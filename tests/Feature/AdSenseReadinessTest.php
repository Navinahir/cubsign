<?php

namespace Tests\Feature;

use Tests\TestCase;

class AdSenseReadinessTest extends TestCase
{
    /** @return array<int, string> */
    private function publicMarketingPaths(): array
    {
        return [
            '/',
            '/features',
            '/pricing',
            '/faq',
            '/help-center',
            '/about',
            '/contact',
            '/security',
            '/privacy',
            '/terms',
            '/cookies',
            '/blog',
            '/sign',
            '/login',
            '/register',
        ];
    }

    /** @return array<int, string> */
    private function footerAndNavRouteNames(): array
    {
        return [
            'features',
            'pricing',
            'sign.index',
            'faq',
            'about',
            'blog',
            'contact',
            'privacy',
            'terms',
            'cookies',
            'help-center',
            'security',
        ];
    }

    public function test_public_marketing_pages_load(): void
    {
        foreach ($this->publicMarketingPaths() as $path) {
            $this->get($path)->assertOk();
        }
    }

    public function test_footer_and_nav_routes_resolve(): void
    {
        foreach ($this->footerAndNavRouteNames() as $routeName) {
            $url = route($routeName);
            $this->assertNotEmpty($url);
            $this->get($url)->assertOk();
        }
    }

    public function test_static_footer_assets_load(): void
    {
        foreach (['/rss.xml', '/sitemap.xml'] as $path) {
            $this->get($path)->assertOk();
        }
    }

    public function test_all_blog_posts_load(): void
    {
        foreach (config('blog.posts', []) as $post) {
            $this->get('/blog/'.$post['slug'])->assertOk();
        }
    }

    public function test_all_help_center_articles_load(): void
    {
        foreach (config('help.articles', []) as $article) {
            $this->get('/help-center/'.$article['slug'])->assertOk();
        }
    }

    public function test_marketing_sources_exclude_misleading_placeholders(): void
    {
        $roots = [
            base_path('resources/js/Pages'),
            base_path('resources/js/Components/Marketing'),
            base_path('resources/js/Layouts/PublicLayout.vue'),
        ];

        $patterns = [
            'Coming Soon',
            'coming soon',
            'Google Drive',
            'Dropbox',
            'href="#"',
            'BlogNewsletter',
        ];

        $violations = [];

        foreach ($roots as $root) {
            $files = is_file($root) ? [$root] : $this->vueFilesIn($root);

            foreach ($files as $file) {
                $contents = file_get_contents($file);
                foreach ($patterns as $pattern) {
                    if (str_contains($contents, $pattern)) {
                        $violations[] = basename($file).': '.$pattern;
                    }
                }
            }
        }

        $this->assertSame([], $violations, 'Misleading placeholder UI found: '.implode(', ', $violations));
    }

    public function test_footer_company_matches_legal_entity(): void
    {
        $layout = file_get_contents(base_path('resources/js/Layouts/PublicLayout.vue'));

        $this->assertStringContainsString('Cubiz Infotech', $layout);
        $this->assertStringNotContainsString('AppArrow Technologies', $layout);
    }

    public function test_robots_allows_public_sign_upload_page(): void
    {
        $robots = file_get_contents(public_path('robots.txt'));

        $this->assertStringContainsString('Allow: /', $robots);
        $this->assertStringNotContainsString('Disallow: /sign$', $robots);
    }

    /** @return array<int, string> */
    private function vueFilesIn(string $directory): array
    {
        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS),
        );

        foreach ($iterator as $file) {
            if ($file->isFile() && str_ends_with($file->getFilename(), '.vue')) {
                $files[] = $file->getPathname();
            }
        }

        return $files;
    }
}
