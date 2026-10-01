<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\CreatesPublishedBlog;
use Tests\TestCase;

class MobileIntentDifferentiationTest extends TestCase
{
    use CreatesPublishedBlog;
    use RefreshDatabase;
    protected function setUp(): void
    {
        parent::setUp();
        config(['app.url' => 'https://cubsign.com']);
    }

    public function test_static_blog_source_is_not_shipped(): void
    {
        $this->assertFileDoesNotExist(resource_path('js/constants/blog.js'));
        $this->assertFileDoesNotExist(config_path('blog.php'));
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
        $blog = $this->createPublishedBlog([
            'slug' => 'signing-on-a-phone',
            'title' => 'Signing on a Phone',
            'excerpt' => 'Prepare a PDF before you sign on a small screen.',
            'faq' => [
                [
                    'question' => 'Do I need an app to sign on mobile?',
                    'answer' => 'A current mobile browser is enough for most documents.',
                ],
            ],
        ]);
        $blogHtml = $this->get('/blog/'.$blog->slug)->assertOk()->getContent();
        $helpHtml = $this->get('/help-center/mobile-support')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="https://cubsign.com/blog/'.$blog->slug.'">',
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
        $this->assertStringContainsString('Do I need an app to sign on mobile?', $encoded);
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
