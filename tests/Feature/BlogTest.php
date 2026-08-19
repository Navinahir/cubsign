<?php

namespace Tests\Feature;

use Symfony\Component\Process\Process;
use Tests\TestCase;

class BlogTest extends TestCase
{
    public function test_blog_index_loads(): void
    {
        $this->get('/blog')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Blog'));
    }

    public function test_blog_post_loads_for_valid_slug(): void
    {
        $this->get('/blog/how-to-sign-a-pdf-online')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('BlogPost')
                ->where('slug', 'how-to-sign-a-pdf-online'));
    }

    public function test_blog_post_loads_for_all_configured_slugs(): void
    {
        foreach (config('blog.posts', []) as $post) {
            $this->get('/blog/'.$post['slug'])
                ->assertOk()
                ->assertInertia(fn ($page) => $page
                    ->component('BlogPost')
                    ->where('slug', $post['slug']));
        }
    }

    public function test_blog_does_not_require_authentication(): void
    {
        $this->get('/blog')->assertOk();
        $this->get('/blog/how-to-sign-a-pdf-online')->assertOk();
    }

    public function test_blog_metadata_dates_are_not_automatically_today(): void
    {
        $js = file_get_contents(resource_path('js/constants/blog.js'));
        $this->assertIsString($js);

        foreach (config('blog.posts', []) as $post) {
            $published = $post['published_at'] ?? null;
            $updated = $post['updated_at'] ?? null;

            $this->assertNotEmpty($published, "{$post['slug']} must keep a real published_at.");
            $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}$/', (string) $published);
            $this->assertStringContainsString("slug: \"{$post['slug']}\"", $js);
            $this->assertStringContainsString("publishedAt: \"{$published}\"", $js);

            if ($updated) {
                $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}$/', (string) $updated);
                $this->assertStringContainsString("updatedAt: \"{$updated}\"", $js);
            }
        }

        $featured = collect(config('blog.posts'))->firstWhere('slug', 'how-to-sign-a-pdf-online');
        $this->assertSame('2025-12-02', $featured['published_at']);
        $this->assertSame('2026-08-11', $featured['updated_at']);
        $this->assertNotSame(now()->toDateString(), $featured['published_at']);
    }

    public function test_article_json_ld_dates_remain_the_canonical_published_and_updated_values(): void
    {
        config(['app.url' => 'https://cubsign.com']);

        $post = collect(config('blog.posts'))->firstWhere('slug', 'how-to-sign-a-pdf-online');
        $this->assertNotNull($post);
        $this->assertSame('2025-12-02', $post['published_at']);
        $this->assertSame('2026-08-11', $post['updated_at']);
        $this->assertNotSame($post['published_at'], $post['updated_at']);

        $html = $this->get('/blog/how-to-sign-a-pdf-online')->assertOk()->getContent();
        $article = $this->articleJsonLd($html);

        $this->assertSame($post['published_at'], $article['datePublished'] ?? null);
        $this->assertSame($post['updated_at'], $article['dateModified'] ?? null);
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
