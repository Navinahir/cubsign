<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Cache::forget('sitemap.xml');
    }

    public function test_sitemap_returns_xml_with_correct_headers(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $this->assertStringStartsWith('<?xml version="1.0" encoding="UTF-8"?>', $response->getContent());
    }

    public function test_sitemap_includes_public_pages(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        $this->assertStringContainsString('<loc>https://cubsign.com/</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/features</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/sign</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/blog</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/about</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/pricing</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/faq</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/help-center</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/privacy</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/terms</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/cookies</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/contact</loc>', $content);
    }

    public function test_sitemap_includes_blog_posts(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        $this->assertStringContainsString(
            '<loc>https://cubsign.com/blog/introducing-cubsign-early-access</loc>',
            $content,
        );
        $this->assertStringContainsString('<lastmod>2026-06-01</lastmod>', $content);
    }

    public function test_sitemap_includes_help_center_articles(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        $this->assertStringContainsString(
            '<loc>https://cubsign.com/help-center/how-to-upload-a-pdf</loc>',
            $content,
        );
        $this->assertStringContainsString(
            '<loc>https://cubsign.com/help-center/contact-support</loc>',
            $content,
        );
        $this->assertStringContainsString('<lastmod>2026-06-15</lastmod>', $content);
    }

    public function test_sitemap_excludes_private_routes(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        $this->assertStringNotContainsString('/login', $content);
        $this->assertStringNotContainsString('/register', $content);
        $this->assertStringNotContainsString('/forgot-password', $content);
        $this->assertStringNotContainsString('/overview', $content);
        $this->assertStringNotContainsString('/documents', $content);
        $this->assertStringNotContainsString('/profile', $content);
        $this->assertStringNotContainsString('/sign/editor', $content);
        $this->assertStringNotContainsString('/r/', $content);
    }

    public function test_sitemap_uses_https_urls(): void
    {
        config(['app.url' => 'http://cubsign.com']);

        $response = $this->get('/sitemap.xml');

        $this->assertStringContainsString('https://cubsign.com/', $response->getContent());
        $this->assertStringNotContainsString('http://cubsign.com/', $response->getContent());
    }

    public function test_sitemap_has_no_duplicate_urls(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $content = $this->get('/sitemap.xml')->getContent();
        preg_match_all('#<loc>([^<]+)</loc>#', $content, $matches);

        $locations = $matches[1];
        $this->assertSame(count($locations), count(array_unique($locations)));
    }

    public function test_sitemap_is_cached(): void
    {
        $this->get('/sitemap.xml');

        $this->assertTrue(Cache::has('sitemap.xml'));
    }

    public function test_sitemap_does_not_require_authentication(): void
    {
        $this->get('/sitemap.xml')->assertOk();
    }
}
