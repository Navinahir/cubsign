<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\SeoRobots;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SeoIndexingControlTest extends TestCase
{
    use RefreshDatabase;

    private function assertRobotsMeta(string $uri, string $expected, int $status = 200): void
    {
        $response = $this->get($uri);
        $response->assertStatus($status);
        $response->assertSee('<meta name="robots" content="'.$expected.'">', false);
    }

    private function assertInertiaRobotsProp(string $uri, string $expected): void
    {
        $response = $this->get($uri);
        $response->assertOk();

        $html = html_entity_decode($response->getContent());
        $this->assertMatchesRegularExpression(
            '/"seo":\{[^}]*"robots":"'.preg_quote($expected, '/').'"/',
            $html,
        );
    }

    public function test_public_marketing_pages_are_index_follow(): void
    {
        foreach (['/', '/features', '/sign', '/blog', '/help-center', '/about', '/security'] as $uri) {
            $this->assertRobotsMeta($uri, SeoRobots::INDEX);
            $this->assertInertiaRobotsProp($uri, SeoRobots::INDEX);
        }
    }

    public function test_auth_pages_are_noindex_nofollow(): void
    {
        foreach (['/login', '/register', '/forgot-password'] as $uri) {
            $this->assertRobotsMeta($uri, SeoRobots::NOINDEX);
            $this->assertInertiaRobotsProp($uri, SeoRobots::NOINDEX);
        }
    }

    public function test_private_workspace_pages_are_noindex_nofollow(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user);

        foreach (['/overview', '/profile', '/documents', '/templates'] as $uri) {
            $this->assertRobotsMeta($uri, SeoRobots::NOINDEX);
            $this->assertInertiaRobotsProp($uri, SeoRobots::NOINDEX);
        }
    }

    public function test_sign_landing_remains_indexable_while_workflow_routes_are_noindex(): void
    {
        $this->assertRobotsMeta('/sign', SeoRobots::INDEX);

        $this->assertSame(SeoRobots::INDEX, $this->robotsForRoute('sign.index'));
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('sign.editor'));
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('sign.review'));
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('sign.complete'));
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('sign.pdf'));
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('sign.sent'));
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('sign.save'));
    }

    public function test_recipient_routes_are_noindex(): void
    {
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('recipient.sign', ['token' => 'abc']));
        $this->assertSame(SeoRobots::NOINDEX, $this->robotsForRoute('recipient.pdf', ['token' => 'abc']));
    }

    public function test_error_page_is_noindex_without_canonical(): void
    {
        $response = $this->get('/this-page-definitely-does-not-exist-seo');

        $response->assertStatus(404);
        $response->assertSee('<meta name="robots" content="'.SeoRobots::NOINDEX.'">', false);
        $response->assertDontSee('rel="canonical"', false);
        $response->assertDontSee('head-key="canonical"', false);
    }

    public function test_health_endpoint_sends_x_robots_tag_and_stays_ok(): void
    {
        $response = $this->get('/up');

        $response->assertOk();
        $response->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    public function test_robots_txt_disallows_private_paths_and_up(): void
    {
        $robots = file_get_contents(public_path('robots.txt'));

        $this->assertIsString($robots);
        $this->assertStringContainsString('Disallow: /overview', $robots);
        $this->assertStringContainsString('Disallow: /documents', $robots);
        $this->assertStringContainsString('Disallow: /templates', $robots);
        $this->assertStringContainsString('Disallow: /profile', $robots);
        $this->assertStringContainsString('Disallow: /sign/', $robots);
        $this->assertStringContainsString('Disallow: /r/', $robots);
        $this->assertStringContainsString('Disallow: /up', $robots);
        $this->assertStringContainsString('Allow: /', $robots);
        $this->assertStringContainsString('Sitemap: https://cubsign.com/sitemap.xml', $robots);
        $this->assertStringNotContainsString('Disallow: /settings', $robots);
        $this->assertStringNotContainsString("Disallow: /sign\n", $robots);
    }

    public function test_sitemap_excludes_noindex_routes_and_keeps_sign_landing(): void
    {
        config(['app.url' => 'https://cubsign.com']);
        Cache::forget('sitemap.xml');

        $content = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('<loc>https://cubsign.com/sign</loc>', $content);
        $this->assertStringContainsString('<loc>https://cubsign.com/</loc>', $content);

        preg_match_all('#<loc>([^<]+)</loc>#', $content, $matches);
        $locations = $matches[1];

        foreach ([
            'https://cubsign.com/login',
            'https://cubsign.com/register',
            'https://cubsign.com/forgot-password',
            'https://cubsign.com/overview',
            'https://cubsign.com/documents',
            'https://cubsign.com/templates',
            'https://cubsign.com/profile',
            'https://cubsign.com/sign/editor',
            'https://cubsign.com/sign/review',
            'https://cubsign.com/sign/complete',
            'https://cubsign.com/up',
        ] as $blocked) {
            $this->assertNotContains($blocked, $locations);
        }

        foreach ($locations as $loc) {
            $this->assertStringNotContainsString('/r/', $loc);
            $this->assertDoesNotMatchRegularExpression('#https://cubsign\.com/sign/.+#', $loc);
        }
    }

    private function robotsForRoute(string $name, array $parameters = []): string
    {
        $route = Route::getRoutes()->getByName($name);
        $this->assertNotNull($route, "Missing route [{$name}]");

        $uri = '/'.ltrim($route->uri(), '/');
        foreach ($parameters as $key => $value) {
            $uri = str_replace('{'.$key.'}', (string) $value, $uri);
            $uri = str_replace('{'.$key.'?}', (string) $value, $uri);
        }

        $request = Request::create($uri, $route->methods()[0] ?? 'GET');
        $request->setRouteResolver(static fn () => $route);

        return SeoRobots::forRequest($request);
    }
}
