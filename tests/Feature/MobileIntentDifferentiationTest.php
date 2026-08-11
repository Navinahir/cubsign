<?php

namespace Tests\Feature;

use Tests\TestCase;

class MobileIntentDifferentiationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['app.url' => 'https://cubsign.com']);
    }

    public function test_blog_mobile_article_is_educational_and_links_to_help_and_sign(): void
    {
        $blog = file_get_contents(resource_path('js/constants/blog.js'));
        $this->assertIsString($blog);

        $this->assertStringContainsString(
            'Signing a PDF on a phone or tablet is often the fastest way',
            $blog,
        );
        $this->assertStringContainsString('full CubSign mobile guide', $blog);
        $this->assertStringContainsString("slug: 'mobile-support'", $blog);
        $this->assertStringContainsString('Start signing a PDF', $blog);
        $this->assertStringContainsString('Before you sign on a phone', $blog);
        $this->assertStringContainsString('Common mobile mistakes', $blog);

        $this->assertStringNotContainsString(
            'Mobile signing steps',
            $blog,
            'Blog must not retain the long CubSign mobile step-list heading.',
        );
        $this->assertStringNotContainsString(
            'CubSign runs in mobile browsers—no app install.',
            $blog,
            'Blog must not lead with the old product-tutorial intro.',
        );

        $post = collect(config('blog.posts'))->firstWhere('slug', 'how-to-sign-pdfs-on-mobile');
        $this->assertNotNull($post);
        $this->assertSame('How to Sign PDFs on Mobile | CubSign', $post['meta_title']);
        $this->assertStringNotContainsString('with CubSign, placement', $post['meta_description']);
        $this->assertTrue(
            str_contains(strtolower($post['meta_description']), 'tip')
                || str_contains(strtolower($post['meta_description']), 'mistake')
                || str_contains(strtolower($post['meta_description']), 'prepare'),
        );

        $appFaq = collect($post['faq'] ?? [])->firstWhere('question', 'Do I need an app to sign on mobile?');
        $this->assertNotNull($appFaq);
        $this->assertStringContainsString('full CubSign mobile guide', $appFaq['answer']);
    }

    public function test_help_mobile_support_remains_product_focused_with_optional_blog_link(): void
    {
        $help = file_get_contents(resource_path('js/constants/help.js'));
        $this->assertIsString($help);

        $this->assertStringContainsString('Recommended browsers', $help);
        $this->assertStringContainsString('iOS: Safari', $help);
        $this->assertStringContainsString('Android: Chrome', $help);
        $this->assertStringContainsString('Recipient links on mobile', $help);
        $this->assertStringContainsString('More mobile signing tips', $help);
        $this->assertStringContainsString('Start signing', $help);

        $article = collect(config('help.articles'))->firstWhere('slug', 'mobile-support');
        $this->assertNotNull($article);
        $this->assertSame('Mobile Support: Sign PDFs on Your Phone | CubSign', $article['meta_title']);
        $this->assertNotEmpty($article['faq']);
    }

    public function test_blog_and_help_mobile_pages_keep_canonical_and_schema(): void
    {
        $blogHtml = $this->get('/blog/how-to-sign-pdfs-on-mobile')->assertOk()->getContent();
        $helpHtml = $this->get('/help-center/mobile-support')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="https://cubsign.com/blog/how-to-sign-pdfs-on-mobile">',
            $blogHtml,
        );
        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="https://cubsign.com/help-center/mobile-support">',
            $helpHtml,
        );
        $this->assertSame(1, substr_count($blogHtml, 'rel="canonical"'));
        $this->assertSame(1, substr_count($helpHtml, 'rel="canonical"'));

        $blogSchemas = $this->jsonLdBlocks($blogHtml);
        $helpSchemas = $this->jsonLdBlocks($helpHtml);

        $this->assertSchemaTypes($blogSchemas, ['Article', 'BreadcrumbList', 'FAQPage']);
        $this->assertSchemaTypes($helpSchemas, ['Article', 'BreadcrumbList', 'FAQPage']);
        $this->assertCount(1, array_filter($blogSchemas, fn (array $s) => ($s['@type'] ?? null) === 'Article'));
        $this->assertCount(1, array_filter($helpSchemas, fn (array $s) => ($s['@type'] ?? null) === 'Article'));

        $blogFaq = collect($blogSchemas)->first(fn (array $s) => ($s['@type'] ?? null) === 'FAQPage');
        $this->assertNotNull($blogFaq);
        $encoded = json_encode($blogFaq);
        $this->assertIsString($encoded);
        $this->assertStringContainsString('full CubSign mobile guide', $encoded);
    }

    public function test_sign_page_source_was_not_modified_for_mobile_phase(): void
    {
        $source = file_get_contents(resource_path('js/Pages/Sign/Upload.vue'));
        $this->assertIsString($source);

        $this->assertStringNotContainsString('/help-center/mobile-support', $source);
        $this->assertStringNotContainsString('/blog/how-to-sign-pdfs-on-mobile', $source);
        $this->assertStringNotContainsString('mobile SEO', $source);
        $this->assertMatchesRegularExpression(
            '/<h1\b[^>]*>\s*Sign a PDF Online\s*<\/h1>/s',
            $source,
        );
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
            $this->assertContains($type, $found, "Expected schema type {$type}.");
        }
    }
}
