<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\SeoRobots;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoInitialHtmlTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['app.url' => 'https://cubsign.com']);
    }

    public function test_home_initial_html_contains_page_seo(): void
    {
        $html = $this->get('/')->assertOk()->getContent();

        $this->assertInitialSeo(
            $html,
            title: 'CubSign – Upload & Sign PDFs Online Free',
            description: 'CubSign is a browser-based PDF signing product. Upload a PDF, draw type or upload a signature, download the signed file, or send it for signature. Free during Early Access.',
            canonical: 'https://cubsign.com/',
            ogType: 'website',
        );
    }

    public function test_features_initial_html_is_not_generic_home_title(): void
    {
        $html = $this->get('/features')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<title inertia>Features — CubSign | Free PDF Signing</title>',
            $html,
        );
        $this->assertStringNotContainsString(
            '<title inertia>CubSign – Upload &amp; Sign PDFs Online Free</title>',
            $html,
        );
        $this->assertStringNotContainsString(
            '<title inertia>CubSign</title>',
            $html,
        );

        $this->assertInitialSeo(
            $html,
            title: 'Features — CubSign | Free PDF Signing',
            description: 'Learn how CubSign self-sign, request signatures, templates, activity history, private storage, and document tracking work — with real product screenshots.',
            canonical: 'https://cubsign.com/features',
            ogType: 'website',
        );
    }

    public function test_blog_index_initial_html_contains_blog_seo(): void
    {
        $html = $this->get('/blog')->assertOk()->getContent();

        $this->assertInitialSeo(
            $html,
            title: 'CubSign Blog — PDF Signing, eSignatures & Security Guides',
            description: 'Expert guides on signing PDFs online, electronic signatures, document security, and paperless workflows from the CubSign team.',
            canonical: 'https://cubsign.com/blog',
            ogType: 'website',
        );
    }

    public function test_blog_article_initial_html_contains_article_seo(): void
    {
        $post = collect(config('blog.posts'))->firstWhere('slug', 'how-to-sign-a-pdf-online');
        $this->assertNotNull($post);

        $html = $this->get('/blog/how-to-sign-a-pdf-online')->assertOk()->getContent();

        $this->assertInitialSeo(
            $html,
            title: $post['meta_title'],
            description: $post['meta_description'],
            canonical: 'https://cubsign.com/blog/how-to-sign-a-pdf-online',
            ogType: 'article',
        );

        $this->assertStringContainsString(
            'property="article:published_time" content="'.$post['published_at'].'"',
            $html,
        );
    }

    public function test_help_center_initial_html_contains_help_seo(): void
    {
        $html = $this->get('/help-center')->assertOk()->getContent();

        $this->assertInitialSeo(
            $html,
            title: 'Help Center — CubSign | PDF Signing Guides & Support',
            description: 'Search CubSign Help Center articles on uploading PDFs, signing documents, accounts, security, and troubleshooting. Free PDF signing support and FAQs.',
            canonical: 'https://cubsign.com/help-center',
            ogType: 'website',
        );
    }

    public function test_help_article_initial_html_contains_article_seo(): void
    {
        $article = collect(config('help.articles'))->firstWhere('slug', 'what-is-cubsign');
        $this->assertNotNull($article);

        $html = $this->get('/help-center/what-is-cubsign')->assertOk()->getContent();

        $this->assertInitialSeo(
            $html,
            title: $article['meta_title'],
            description: $article['meta_description'],
            canonical: 'https://cubsign.com/help-center/what-is-cubsign',
            ogType: 'article',
        );
    }

    public function test_auth_pages_remain_noindex_without_canonical(): void
    {
        foreach (['/login', '/register'] as $uri) {
            $html = $this->get($uri)->assertOk()->getContent();

            $this->assertStringContainsString(
                '<meta head-key="robots" name="robots" content="'.SeoRobots::NOINDEX.'">',
                $html,
            );
            $this->assertStringNotContainsString('rel="canonical"', $html);
            $this->assertStringNotContainsString('property="og:url"', $html);
        }
    }

    public function test_private_workspace_pages_remain_noindex_without_canonical(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $html = $this->actingAs($user)->get('/overview')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<meta head-key="robots" name="robots" content="'.SeoRobots::NOINDEX.'">',
            $html,
        );
        $this->assertStringNotContainsString('rel="canonical"', $html);
    }

    public function test_error_page_remains_404_noindex_without_canonical(): void
    {
        $response = $this->get('/this-page-definitely-does-not-exist-seo-phase-3a');

        $response->assertStatus(404);
        $html = $response->getContent();

        $this->assertStringContainsString(
            '<meta head-key="robots" name="robots" content="'.SeoRobots::NOINDEX.'">',
            $html,
        );
        $this->assertStringNotContainsString('rel="canonical"', $html);
    }

    public function test_inertia_shared_seo_payload_matches_blade_for_features(): void
    {
        $html = html_entity_decode($this->get('/features')->assertOk()->getContent());

        $this->assertMatchesRegularExpression(
            '/"seo":\{[^}]*"robots":"'.preg_quote(SeoRobots::INDEX, '/').'"/',
            $html,
        );
        // Inertia JSON may escape unicode/slashes; accept either form.
        $this->assertTrue(
            str_contains($html, '"title":"Features — CubSign | Free PDF Signing"')
            || str_contains($html, '"title":"Features \u2014 CubSign | Free PDF Signing"'),
            'Shared seo.title for Features was missing from the Inertia page payload.',
        );
        $this->assertTrue(
            str_contains($html, '"canonical":"https://cubsign.com/features"')
            || str_contains($html, '"canonical":"https:\/\/cubsign.com\/features"'),
            'Shared seo.canonical for Features was missing from the Inertia page payload.',
        );
        $this->assertTrue(
            str_contains($html, '"path":"/features"')
            || str_contains($html, '"path":"\/features"'),
            'Shared seo.path for Features was missing from the Inertia page payload.',
        );
    }

    /**
     * @param  non-empty-string  $title
     * @param  non-empty-string  $description
     * @param  non-empty-string  $canonical
     * @param  non-empty-string  $ogType
     */
    private function assertInitialSeo(
        string $html,
        string $title,
        string $description,
        string $canonical,
        string $ogType,
    ): void {
        $escapedTitle = e($title);
        $escapedDescription = e($description);

        $this->assertStringContainsString('<title inertia>'.$escapedTitle.'</title>', $html);
        $this->assertStringContainsString(
            '<meta head-key="description" name="description" content="'.$escapedDescription.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="'.$canonical.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="robots" name="robots" content="'.SeoRobots::INDEX.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="og:type" property="og:type" content="'.$ogType.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="og:title" property="og:title" content="'.$escapedTitle.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="og:description" property="og:description" content="'.$escapedDescription.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="og:url" property="og:url" content="'.$canonical.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="og:image" property="og:image" content="https://cubsign.com/images/og/default-og.png">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="twitter:card" name="twitter:card" content="summary_large_image">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="twitter:title" name="twitter:title" content="'.$escapedTitle.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="twitter:description" name="twitter:description" content="'.$escapedDescription.'">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="twitter:image" name="twitter:image" content="https://cubsign.com/images/og/default-og.png">',
            $html,
        );
    }
}
