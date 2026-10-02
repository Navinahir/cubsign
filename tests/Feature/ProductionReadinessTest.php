<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductionReadinessTest extends TestCase
{
    use RefreshDatabase;
    /** @return array<int, string> */
    private function publicPagePaths(): array
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
        ];
    }

    /** @return array<int, string> */
    private function bannedPublicUiPatterns(): array
    {
        return [
            'Coming Soon',
            'coming soon',
            'BlogNewsletter',
            'Discussion is coming soon',
            'cursor-not-allowed rounded-xl bg-blue-600/60',
        ];
    }

    public function test_public_pages_load_successfully(): void
    {
        foreach ($this->publicPagePaths() as $path) {
            $this->get($path)->assertOk();
        }
    }

    public function test_public_marketing_sources_exclude_placeholder_ui(): void
    {
        $roots = [
            base_path('resources/js/Pages'),
            base_path('resources/js/Components/Marketing'),
            base_path('resources/js/Components/Blog'),
            base_path('resources/js/Layouts/PublicLayout.vue'),
        ];

        $files = [];
        foreach ($roots as $root) {
            if (is_file($root)) {
                $files[] = $root;
                continue;
            }

            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS),
            );

            foreach ($iterator as $file) {
                if ($file->isFile() && str_ends_with($file->getFilename(), '.vue')) {
                    $files[] = $file->getPathname();
                }
            }
        }

        $violations = [];

        foreach ($files as $file) {
            $contents = file_get_contents($file);

            foreach ($this->bannedPublicUiPatterns() as $pattern) {
                if (str_contains($contents, $pattern)) {
                    $violations[] = basename($file).': '.$pattern;
                }
            }
        }

        $this->assertSame([], $violations, 'Placeholder UI found in public marketing sources: '.implode(', ', $violations));
    }
}
