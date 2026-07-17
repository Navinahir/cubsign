<?php

namespace Tests\Feature;

use Tests\TestCase;

class BlogRssTest extends TestCase
{
    public function test_rss_returns_xml_with_correct_headers(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $response = $this->get('/rss.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/rss+xml; charset=UTF-8');
        $this->assertStringStartsWith('<?xml version="1.0" encoding="UTF-8"?>', $response->getContent());
        $this->assertStringContainsString('<rss version="2.0"', $response->getContent());
        $this->assertStringContainsString('<title>CubSign Blog</title>', $response->getContent());
    }

    public function test_rss_includes_blog_posts(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $content = $this->get('/rss.xml')->getContent();

        $this->assertStringContainsString(
            '<link>https://cubsign.com/blog/how-to-sign-a-pdf-online</link>',
            $content,
        );
        $this->assertStringContainsString('<title>How to Sign a PDF Online</title>', $content);
    }

    public function test_rss_does_not_require_authentication(): void
    {
        $this->get('/rss.xml')->assertOk();
    }
}
