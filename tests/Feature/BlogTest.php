<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\Process\Process;
use Tests\Support\CreatesPublishedBlog;
use Tests\TestCase;

class BlogTest extends TestCase
{
    use CreatesPublishedBlog;
    use RefreshDatabase;

    public function test_blog_index_loads(): void
    {
        $this->get('/blog')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Blog')
                ->has('posts')
                ->has('categories'));
    }

    public function test_published_blog_post_loads(): void
    {
        $blog = $this->createPublishedBlog();

        $this->get('/blog/'.$blog->slug)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('BlogPost')
                ->where('slug', $blog->slug)
                ->where('post.title', $blog->title));
    }

    public function test_missing_blog_post_returns_not_found(): void
    {
        $this->get('/blog/missing-article')->assertNotFound();
    }

    public function test_blog_does_not_require_authentication(): void
    {
        $blog = $this->createPublishedBlog();

        $this->get('/blog')->assertOk();
        $this->get('/blog/'.$blog->slug)->assertOk();
    }

    public function test_article_json_ld_uses_the_published_post_dates(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $blog = $this->createPublishedBlog();

        $html = $this->get('/blog/'.$blog->slug)->assertOk()->getContent();
        $article = $this->articleJsonLd($html);

        $this->assertSame('2025-12-02', $article['datePublished'] ?? null);
        $this->assertSame('2026-08-11', $article['dateModified'] ?? null);
        $this->assertNotSame(now()->toDateString(), $article['datePublished'] ?? null);
        $this->assertNotSame(now()->toDateString(), $article['dateModified'] ?? null);
    }

    public function test_blog_date_display_helper_matches_index_and_article_rules(): void
    {
        $process = new Process(
            ['node', '--test', base_path('tests/Unit/blogDates.test.mjs')],
            base_path(),
        );
        $process->run();

        $this->assertTrue(
            $process->isSuccessful(),
            $process->getOutput().$process->getErrorOutput(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function articleJsonLd(string $html): array
    {
        preg_match_all(
            '/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/si',
            $html,
            $matches,
        );

        foreach ($matches[1] as $json) {
            $decoded = json_decode($json, true);
            if (is_array($decoded) && ($decoded['@type'] ?? null) === 'Article') {
                return $decoded;
            }
        }

        $this->fail('Blog post HTML must include Article JSON-LD.');
    }
}
