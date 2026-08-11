<?php

namespace Tests\Feature;

use App\Support\SeoRobots;
use Tests\TestCase;

class SignUploadClarityTest extends TestCase
{
    public function test_sign_page_loads_with_server_seo(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $html = $this->get('/sign')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<title inertia>Sign PDF Online Free — CubSign</title>',
            $html,
        );
        $this->assertStringContainsString(
            '<link head-key="canonical" rel="canonical" href="https://cubsign.com/sign">',
            $html,
        );
        $this->assertStringContainsString(
            '<meta head-key="robots" name="robots" content="'.SeoRobots::INDEX.'">',
            $html,
        );
        $this->assertStringNotContainsString('"@type":"Article"', $html);
        $this->assertStringNotContainsString('"@type":"Organization"', $html);
    }

    public function test_sign_upload_vue_has_one_visible_h1(): void
    {
        $source = file_get_contents(resource_path('js/Pages/Sign/Upload.vue'));
        $this->assertIsString($source);

        preg_match_all('/<h1\b[^>]*>/i', $source, $matches);
        $this->assertCount(1, $matches[0], 'Sign/Upload.vue must contain exactly one H1.');

        $this->assertDoesNotMatchRegularExpression(
            '/<h1\b[^>]*\bsr-only\b/i',
            $source,
            'Sign/Upload.vue H1 must not use sr-only.',
        );
        $this->assertMatchesRegularExpression(
            '/<h1\b[^>]*>\s*Sign a PDF Online\s*<\/h1>/s',
            $source,
        );
        $this->assertStringContainsString(
            'Upload a PDF, draw, type, or upload your signature, place it on the page, then download the signed file.',
            $source,
        );
    }
}
