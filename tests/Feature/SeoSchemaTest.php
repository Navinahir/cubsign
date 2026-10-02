<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\CreatesPublishedBlog;
use Tests\TestCase;

class SeoSchemaTest extends TestCase
{
    use CreatesPublishedBlog;
    use RefreshDatabase;
    protected function setUp(): void
    {
        parent::setUp();
        config(['app.url' => 'https://cubsign.com']);
    }

    public function test_home_initial_html_contains_organization_website_and_search_action(): void
    {
        $schemas = $this->jsonLdBlocks($this->get('/')->assertOk()->getContent());

        $this->assertSchemaTypes($schemas, ['Organization', 'WebSite', 'FAQPage']);
        $this->assertTrue(
            collect($schemas)->contains(fn (array $s) => ($s['@type'] ?? null) === 'WebSite'
                && ($s['potentialAction']['@type'] ?? null) === 'SearchAction'
                && str_contains((string) ($s['potentialAction']['target'] ?? ''), '/help-center?q={search_term_string}')),
            'Home WebSite schema must include Help Center SearchAction.',
        );

        $org = collect($schemas)->first(fn (array $s) => ($s['@type'] ?? null) === 'Organization');
        $this->assertSame('https://cubsign.com/logo.svg', $org['logo'] ?? null);
        $this->assertFileExists(public_path('logo.svg'));
    }

    public function test_about_initial_html_contains_organization_breadcrumb_and_faq(): void
    {
        $schemas = $this->jsonLdBlocks($this->get('/about')->assertOk()->getContent());

        $this->assertSchemaTypes($schemas, ['Organization', 'BreadcrumbList', 'FAQPage']);
        $this->assertBreadcrumbItems($schemas, [
            'https://cubsign.com/',
            'https://cubsign.com/about',
        ]);
    }

    public function test_faq_initial_html_contains_faq_and_breadcrumb(): void
    {
        $schemas = $this->jsonLdBlocks($this->get('/faq')->assertOk()->getContent());

        $this->assertSchemaTypes($schemas, ['FAQPage', 'BreadcrumbList']);
        $this->assertFalse(
            collect($schemas)->contains(fn (array $s) => ($s['@type'] ?? null) === 'Organization'),
            'FAQ page must not emit Organization schema.',
        );
        $this->assertBreadcrumbItems($schemas, [
            'https://cubsign.com/',
            'https://cubsign.com/faq',
        ]);
    }

    public function test_security_initial_html_has_no_article_schema_and_uses_website_og(): void
    {
        $html = $this->get('/security')->assertOk()->getContent();
        $schemas = $this->jsonLdBlocks($html);

        $this->assertSchemaTypes($schemas, ['FAQPage', 'BreadcrumbList']);
        $this->assertFalse(
            collect($schemas)->contains(fn (array $s) => ($s['@type'] ?? null) === 'Article'),
            'Security page must not emit Article JSON-LD.',
        );
        $this->assertStringContainsString(
            '<meta head-key="og:type" property="og:type" content="website">',
            $html,
        );
        $this->assertBreadcrumbItems($schemas, [
            'https://cubsign.com/',
            'https://cubsign.com/security',
        ]);
    }

    public function test_features_does_not_emit_organization_schema(): void
    {
        $schemas = $this->jsonLdBlocks($this->get('/features')->assertOk()->getContent());

        $this->assertFalse(
            collect($schemas)->contains(fn (array $s) => ($s['@type'] ?? null) === 'Organization'),
            'Unrelated marketing pages must not emit Organization schema.',
        );
    }

    public function test_blog_post_initial_html_contains_article_breadcrumb_and_faq(): void
    {
        $blog = $this->createPublishedBlog([
            'slug' => 'tips-before-you-sign',
            'cover_image' => '/images/blog/sample-cover.png',
        ]);

        $schemas = $this->jsonLdBlocks(
            $this->get('/blog/'.$blog->slug)->assertOk()->getContent(),
        );

        $this->assertSchemaTypes($schemas, ['Article', 'BreadcrumbList', 'FAQPage']);

        $article = collect($schemas)->first(fn (array $s) => ($s['@type'] ?? null) === 'Article');
        $this->assertSame('2025-12-02', $article['datePublished'] ?? null);
        $this->assertSame('2026-08-11', $article['dateModified'] ?? null);
        $this->assertNotSame('2026-08-11', $article['datePublished'] ?? null);
        $this->assertSame(
            'https://cubsign.com/images/blog/sample-cover.png',
            $article['image'][0] ?? null,
        );

        $this->assertBreadcrumbItems($schemas, [
            'https://cubsign.com/',
            'https://cubsign.com/blog',
            'https://cubsign.com/blog/'.$blog->slug,
        ]);
        $this->assertBreadcrumbHasNoQueryUrls($schemas);
    }

    public function test_help_article_omits_date_published_and_uses_date_modified(): void
    {
        $articleMeta = collect(config('help.articles'))->firstWhere('slug', 'what-is-cubsign');
        $this->assertNotNull($articleMeta);

        $html = $this->get('/help-center/what-is-cubsign')->assertOk()->getContent();
        $schemas = $this->jsonLdBlocks($html);

        $this->assertSchemaTypes($schemas, ['Article', 'BreadcrumbList', 'FAQPage']);

        $article = collect($schemas)->first(fn (array $s) => ($s['@type'] ?? null) === 'Article');
        $this->assertArrayNotHasKey('datePublished', $article);
        $this->assertSame($articleMeta['updated_at'], $article['dateModified'] ?? null);
        $this->assertStringNotContainsString('property="article:published_time"', $html);

        $this->assertBreadcrumbItems($schemas, [
            'https://cubsign.com/',
            'https://cubsign.com/help-center',
            'https://cubsign.com/help-center/what-is-cubsign',
        ]);
        $this->assertBreadcrumbHasNoQueryUrls($schemas);
    }

    public function test_json_ld_blocks_are_valid_json_and_use_absolute_urls(): void
    {
        $blog = $this->createPublishedBlog(['slug' => 'schema-sample']);

        foreach (['/', '/about', '/faq', '/security', '/blog/'.$blog->slug, '/help-center/what-is-cubsign'] as $uri) {
            $schemas = $this->jsonLdBlocks($this->get($uri)->assertOk()->getContent());
            $this->assertNotEmpty($schemas, "Expected JSON-LD on {$uri}");

            foreach ($schemas as $schema) {
                $encoded = json_encode($schema);
                $this->assertNotFalse($encoded);
                $this->assertIsArray(json_decode($encoded, true));
            }
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function jsonLdBlocks(string $html): array
    {
        preg_match_all(
            '/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/si',
            $html,
            $matches,
        );

        $schemas = [];
        foreach ($matches[1] as $json) {
            $decoded = json_decode($json, true);
            $this->assertIsArray($decoded, 'JSON-LD block must decode to an array: '.$json);
            $schemas[] = $decoded;
        }

        return $schemas;
    }

    /**
     * @param  list<array<string, mixed>>  $schemas
     * @param  list<string>  $types
     */
    private function assertSchemaTypes(array $schemas, array $types): void
    {
        $found = collect($schemas)->pluck('@type')->all();
        foreach ($types as $type) {
            $this->assertContains($type, $found, "Missing schema type {$type}");
        }
    }

    /**
     * @param  list<array<string, mixed>>  $schemas
     * @param  list<string>  $urls
     */
    private function assertBreadcrumbItems(array $schemas, array $urls): void
    {
        $breadcrumb = collect($schemas)->first(fn (array $s) => ($s['@type'] ?? null) === 'BreadcrumbList');
        $this->assertNotNull($breadcrumb);

        $items = $breadcrumb['itemListElement'] ?? [];
        $this->assertCount(count($urls), $items);

        foreach ($urls as $index => $url) {
            $this->assertSame($index + 1, $items[$index]['position'] ?? null);
            $this->assertNotEmpty($items[$index]['name'] ?? null);
            $this->assertSame($url, $items[$index]['item'] ?? null);
            $this->assertStringStartsWith('https://cubsign.com', (string) ($items[$index]['item'] ?? ''));
        }
    }

    /**
     * @param  list<array<string, mixed>>  $schemas
     */
    private function assertBreadcrumbHasNoQueryUrls(array $schemas): void
    {
        $breadcrumb = collect($schemas)->first(fn (array $s) => ($s['@type'] ?? null) === 'BreadcrumbList');
        $this->assertNotNull($breadcrumb);

        foreach ($breadcrumb['itemListElement'] ?? [] as $item) {
            $url = (string) ($item['item'] ?? '');
            $this->assertStringNotContainsString('?', $url);
            $this->assertStringNotContainsString('#', $url);
        }
    }
}
