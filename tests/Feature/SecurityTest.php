<?php

namespace Tests\Feature;

use Tests\TestCase;

class SecurityTest extends TestCase
{
    public function test_security_center_loads(): void
    {
        $this->get('/security')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Security'));
    }

    public function test_security_does_not_require_authentication(): void
    {
        $this->get('/security')->assertOk();
    }

    public function test_security_imports_article_meta_for_last_updated_only(): void
    {
        $source = file_get_contents(resource_path('js/Pages/Security.vue'));
        $this->assertIsString($source);

        $this->assertStringContainsString('securityArticleMeta', $source);
        $this->assertStringContainsString('lastUpdatedLabel', $source);
        $this->assertStringContainsString('Last updated {{ lastUpdatedLabel }}', $source);

        // Must not reintroduce Article schema via MarketingSeo article prop.
        $this->assertDoesNotMatchRegularExpression(
            '/<MarketingSeo[\s\S]*?:article=/',
            $source,
        );
        $this->assertDoesNotMatchRegularExpression(
            '/<MarketingSeo[\s\S]*?type="article"/',
            $source,
        );
    }

    public function test_security_initial_html_keeps_website_og_without_article_schema(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $html = $this->get('/security')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<meta head-key="og:type" property="og:type" content="website">',
            $html,
        );
        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="https://cubsign.com/security">',
            $html,
        );

        preg_match_all(
            '/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/si',
            $html,
            $matches,
        );

        $types = [];
        foreach ($matches[1] as $json) {
            $decoded = json_decode($json, true);
            $this->assertIsArray($decoded);
            $types[] = $decoded['@type'] ?? null;
        }

        $this->assertContains('FAQPage', $types);
        $this->assertContains('BreadcrumbList', $types);
        $this->assertNotContains('Article', $types);
    }
}
