<?php

namespace App\Services;

use App\Enums\BlogCategoryStatus;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Support\BlogPresenter;
use App\Support\BlogQuery;
use Illuminate\Support\Collection;

class BlogService
{
    /**
     * Published posts and active categories for the public blog index.
     *
     * @return array{posts: Collection<int, array<string, mixed>>, categories: Collection<int, array<string, mixed>>}
     */
    public function listing(): array
    {
        return [
            'posts'      => $this->presentMany($this->publishedPosts()),
            'categories' => $this->activeCategories(),
        ];
    }

    /**
     * Published article page data, or null when the slug is not a published post.
     *
     * @return array{
     *     post: array<string, mixed>,
     *     relatedPosts: Collection<int, array<string, mixed>>,
     *     categoryPosts: Collection<int, array<string, mixed>>,
     *     adjacentPosts: array{previous: array<string, mixed>|null, next: array<string, mixed>|null}
     * }|null
     */
    public function article(string $slug): ?array
    {
        $blog = BlogQuery::published(Blog::query())
            ->with(['category:id,name,slug,color', 'user'])
            ->where('slug', $slug)
            ->first();

        if (! $blog) {
            return null;
        }

        $sameCategory = $this->sameCategoryPosts($blog);
        $picked = BlogQuery::relatedPublishedPosts($blog, 3);
        $related = $picked->isNotEmpty() ? $picked : $sameCategory->take(3);
        $adjacent = BlogQuery::adjacentPublishedPosts($blog);

        return [
            'post'          => BlogPresenter::toFrontendArray($blog),
            'relatedPosts'  => $this->presentMany($related),
            'categoryPosts' => $this->presentMany($sameCategory),
            'adjacentPosts' => [
                'previous' => $adjacent['previous'] ? BlogPresenter::toFrontendArray($adjacent['previous']) : null,
                'next'     => $adjacent['next'] ? BlogPresenter::toFrontendArray($adjacent['next']) : null,
            ],
        ];
    }

    /**
     * @return Collection<int, Blog>
     */
    private function publishedPosts(): Collection
    {
        return BlogQuery::published(Blog::query())
            ->with(['category:id,name,slug,color,description', 'user'])
            ->latest('published_at')
            ->get();
    }

    /**
     * @return Collection<int, array{slug: string, name: string, description: ?string, color: ?string}>
     */
    private function activeCategories(): Collection
    {
        return BlogCategory::query()
            ->where('status', BlogCategoryStatus::Active)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description', 'color'])
            ->map(fn (BlogCategory $category) => [
                'slug'        => $category->slug,
                'name'        => $category->name,
                'description' => $category->description,
                'color'       => $category->color,
            ])
            ->values();
    }

    /**
     * @return Collection<int, Blog>
     */
    private function sameCategoryPosts(Blog $blog): Collection
    {
        return BlogQuery::published(Blog::query())
            ->with(['category:id,name,slug', 'user'])
            ->where('id', '!=', $blog->id)
            ->where('blog_category_id', $blog->blog_category_id)
            ->latest('published_at')
            ->limit(5)
            ->get();
    }

    /**
     * @param  Collection<int, Blog>  $blogs
     * @return Collection<int, array<string, mixed>>
     */
    private function presentMany(Collection $blogs): Collection
    {
        return $blogs
            ->map(fn (Blog $blog) => BlogPresenter::toFrontendArray($blog))
            ->values();
    }
}
