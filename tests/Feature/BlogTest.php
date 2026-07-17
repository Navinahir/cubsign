<?php

namespace Tests\Feature;

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
}
