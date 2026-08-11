<?php

namespace Tests\Feature;

use Tests\TestCase;

class SignIntentDifferentiationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['app.url' => 'https://cubsign.com']);
    }

    public function test_sign_page_links_prefer_help_over_equal_weight_blog_howto(): void
    {
        $source = file_get_contents(resource_path('js/Pages/Sign/Upload.vue'));
        $this->assertIsString($source);

        $this->assertStringContainsString('CubSign signing steps', $source);
        $this->assertStringContainsString('CubSign signing guide', $source);
        $this->assertStringContainsString('/help-center/how-to-sign-a-pdf-online', $source);
        $this->assertStringContainsString('Tips before you sign', $source);
        $this->assertStringContainsString('/blog/how-to-sign-a-pdf-online', $source);

        $this->assertStringNotContainsString('>Help Center guide<', $source);
        $this->assertStringNotContainsString('>Blog walkthrough<', $source);

        $this->assertMatchesRegularExpression(
            '/type=["\']file["\']|input.*type=.file.|accept=["\'][^"\']*pdf/i',
            $source,
            'Sign upload UI must remain intact.',
        );
        $this->assertMatchesRegularExpression(
            '/<h1\b[^>]*>\s*Sign a PDF Online\s*<\/h1>/s',
            $source,
        );
    }

    public function test_help_and_blog_meta_titles_are_differentiated(): void
    {
        $help = collect(config('help.articles'))->firstWhere('slug', 'how-to-sign-a-pdf-online');
        $blog = collect(config('blog.posts'))->firstWhere('slug', 'how-to-sign-a-pdf-online');

        $this->assertNotNull($help);
        $this->assertNotNull($blog);

        $this->assertSame('How to Sign a PDF in CubSign | CubSign', $help['meta_title']);
        $this->assertSame(
            'How to Sign a PDF Online: Tips & Common Mistakes | CubSign',
            $blog['meta_title'],
        );
        $this->assertNotSame($help['meta_title'], $blog['meta_title']);
        $this->assertNotSame($help['meta_description'], $blog['meta_description']);

        $this->assertStringContainsString('upload', strtolower($help['meta_description']));
        $this->assertStringContainsString('download', strtolower($help['meta_description']));

        $this->assertTrue(
            str_contains(strtolower($blog['meta_description']), 'mistake')
                || str_contains(strtolower($blog['meta_description']), 'prepare')
                || str_contains(strtolower($blog['meta_description']), 'tip'),
            'Blog meta description should emphasize educational guidance.',
        );
    }

    public function test_help_article_initial_html_uses_product_meta_and_valid_schema(): void
    {
        $html = $this->get('/help-center/how-to-sign-a-pdf-online')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<title inertia>How to Sign a PDF in CubSign | CubSign</title>',
            $html,
        );
        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="https://cubsign.com/help-center/how-to-sign-a-pdf-online">',
            $html,
        );
        $this->assertSame(1, substr_count($html, 'rel="canonical"'));

        $schemas = $this->jsonLdBlocks($html);
        $this->assertSchemaTypes($schemas, ['Article', 'BreadcrumbList', 'FAQPage']);
        $this->assertCount(
            1,
            array_filter($schemas, fn (array $s) => ($s['@type'] ?? null) === 'Article'),
        );
        $this->assertBreadcrumbItems($schemas, [
            'https://cubsign.com/',
            'https://cubsign.com/help-center',
            'https://cubsign.com/help-center/how-to-sign-a-pdf-online',
        ]);
    }

    public function test_blog_article_initial_html_uses_educational_meta_and_valid_schema(): void
    {
        $html = $this->get('/blog/how-to-sign-a-pdf-online')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<title inertia>How to Sign a PDF Online: Tips &amp; Common Mistakes | CubSign</title>',
            $html,
        );
        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="https://cubsign.com/blog/how-to-sign-a-pdf-online">',
            $html,
        );
        $this->assertSame(1, substr_count($html, 'rel="canonical"'));

        $schemas = $this->jsonLdBlocks($html);
        $this->assertSchemaTypes($schemas, ['Article', 'BreadcrumbList', 'FAQPage']);
        $this->assertCount(
            1,
            array_filter($schemas, fn (array $s) => ($s['@type'] ?? null) === 'Article'),
        );
        $this->assertBreadcrumbItems($schemas, [
            'https://cubsign.com/',
            'https://cubsign.com/blog',
            'https://cubsign.com/blog/how-to-sign-a-pdf-online',
        ]);
    }

    public function test_blog_and_help_js_sources_contain_cross_links(): void
    {
        $blog = file_get_contents(resource_path('js/constants/blog.js'));
        $help = file_get_contents(resource_path('js/constants/help.js'));
        $this->assertIsString($blog);
        $this->assertIsString($help);

        $this->assertStringContainsString('Full CubSign step-by-step guide', $blog);
        $this->assertStringContainsString("kind: 'help'", $blog);
        $this->assertStringContainsString('Start signing a PDF', $blog);
        $this->assertStringContainsString('Try it on CubSign', $blog);

        $this->assertStringContainsString('Learn how to sign a PDF in CubSign', $help);
        $this->assertStringContainsString('Start signing', $help);
        $this->assertStringContainsString('Upload PDF page', $help);

        $this->assertStringNotContainsString(
            'Step-by-step in the CubSign editor',
            $blog,
            'Blog must not retain the long duplicate CubSign editor walkthrough heading.',
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

    /**
     * @param  list<array<string, mixed>>  $schemas
     * @param  list<string>  $urls
     */
    private function assertBreadcrumbItems(array $schemas, array $urls): void
    {
        $breadcrumb = collect($schemas)->first(fn (array $s) => ($s['@type'] ?? null) === 'BreadcrumbList');
        $this->assertNotNull($breadcrumb);

        $itemUrls = collect($breadcrumb['itemListElement'] ?? [])
            ->map(fn (array $item) => $item['item'] ?? null)
            ->all();

        $this->assertSame($urls, $itemUrls);
    }
}
