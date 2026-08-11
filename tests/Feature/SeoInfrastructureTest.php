<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SeoInfrastructureTest extends TestCase
{
    private function getWithTrailingSlash(string $uri): \Illuminate\Testing\TestResponse
    {
        $request = Request::create($uri, 'GET');

        return $this->createTestResponse(
            $this->app->handle($request),
            $request,
        );
    }

    public function test_trailing_slash_redirects_to_slashless_public_paths(): void
    {
        $this->getWithTrailingSlash('/features/')
            ->assertStatus(301)
            ->assertRedirect('/features');

        $this->getWithTrailingSlash('/blog/')
            ->assertStatus(301)
            ->assertRedirect('/blog');

        $this->getWithTrailingSlash('/sign/')
            ->assertStatus(301)
            ->assertRedirect('/sign');
    }

    public function test_trailing_slash_redirect_preserves_query_string(): void
    {
        $this->getWithTrailingSlash('/features/?utm=1')
            ->assertStatus(301)
            ->assertRedirect('/features?utm=1');
    }

    public function test_nested_trailing_slash_redirects_without_breaking_sign_editor(): void
    {
        $this->getWithTrailingSlash('/sign/editor/')
            ->assertStatus(301)
            ->assertRedirect('/sign/editor');
    }

    public function test_slashless_public_paths_still_return_ok(): void
    {
        $this->get('/')->assertOk();
        $this->get('/features')->assertOk();
        $this->get('/blog')->assertOk();
        $this->get('/sign')->assertOk();
    }

    public function test_logo_svg_is_present_in_public_document_root(): void
    {
        $path = public_path('logo.svg');

        $this->assertFileExists($path);
        $this->assertGreaterThan(100, filesize($path));
        $this->assertStringContainsString('<svg', (string) file_get_contents($path));
    }

    public function test_apple_touch_icon_is_present_in_public_document_root(): void
    {
        $path = public_path('apple-touch-icon.png');

        $this->assertFileExists($path);
        $this->assertGreaterThan(100, filesize($path));
    }

    public function test_robots_txt_removes_stale_settings_disallow(): void
    {
        $robots = file_get_contents(public_path('robots.txt'));

        $this->assertIsString($robots);
        $this->assertStringNotContainsString('Disallow: /settings', $robots);
        $this->assertStringContainsString('Disallow: /overview', $robots);
        $this->assertStringContainsString('Disallow: /documents', $robots);
        $this->assertStringContainsString('Disallow: /templates', $robots);
        $this->assertStringContainsString('Disallow: /profile', $robots);
        $this->assertStringContainsString('Disallow: /sign/', $robots);
        $this->assertStringContainsString('Disallow: /r/', $robots);
        $this->assertStringContainsString('Disallow: /up', $robots);
        $this->assertStringContainsString('Allow: /', $robots);
        $this->assertStringContainsString('Sitemap: https://cubsign.com/sitemap.xml', $robots);
        $this->assertStringNotContainsString('Disallow: /sign$', $robots);
    }

    public function test_sitemap_still_lists_preferred_public_urls(): void
    {
        config(['app.url' => 'https://cubsign.com']);
        Cache::forget('sitemap.xml');

        $content = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('<loc>https://cubsign.com/</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/features</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/blog</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/sign</loc>', $content);
        $this->assertStringNotContainsString('https://www.cubsign.com', $content);
    }

    public function test_root_htaccess_maps_public_assets_and_www_redirect(): void
    {
        $htaccess = file_get_contents(base_path('.htaccess'));

        $this->assertIsString($htaccess);
        $this->assertStringContainsString('www\.cubsign\.com', $htaccess);
        $this->assertStringContainsString('https://cubsign.com%{REQUEST_URI}', $htaccess);
        $this->assertStringContainsString('public%{REQUEST_URI}', $htaccess);
        $this->assertStringContainsString('RewriteRule ^ %1 [L,R=301]', $htaccess);
    }
}
