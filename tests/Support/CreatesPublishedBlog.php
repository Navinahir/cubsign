<?php

namespace Tests\Support;

use App\Enums\BlogCategoryStatus;
use App\Enums\BlogStatus;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\User;

trait CreatesPublishedBlog
{
    /**
     * @param  array<string, mixed>  $overrides
     */
    protected function createPublishedBlog(array $overrides = []): Blog
    {
        $updatedAt = $overrides['updated_at'] ?? '2026-08-11 12:00:00';
        unset($overrides['updated_at']);

        $user = User::factory()->create();
        $category = BlogCategory::query()->create([
            'name' => 'Guides',
            'slug' => 'guides-'.str()->lower(str()->random(8)),
            'description' => 'Guides for the public blog.',
            'color' => 'from-sky-600 to-blue-700',
            'status' => BlogCategoryStatus::Active,
        ]);

        $blog = Blog::query()->create(array_merge([
            'user_id' => $user->id,
            'blog_category_id' => $category->id,
            'title' => 'Tips Before You Sign',
            'slug' => 'tips-before-you-sign',
            'excerpt' => 'Prepare the PDF and avoid common mistakes before you sign.',
            'content' => '<p>Use a final, unlocked PDF.</p><h2>Before you upload</h2><p>Check names and dates.</p>',
            'cover_image' => '/images/blog/sample-cover.png',
            'tags' => ['PDF Signing'],
            'keywords' => ['sign pdf online'],
            'faq' => [
                [
                    'question' => 'What should I prepare?',
                    'answer' => 'Use a final unlocked PDF and confirm the names and dates.',
                ],
            ],
            'reading_time' => 6,
            'featured' => true,
            'popular' => true,
            'status' => BlogStatus::Published,
            'published_at' => '2025-12-02',
        ], $overrides));

        $blog->timestamps = false;
        $blog->updated_at = $updatedAt;
        $blog->save();

        return $blog->fresh();
    }
}
