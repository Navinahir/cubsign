<?php

namespace App\Support;

use App\Models\Blog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class BlogQuery
{
    public static function published(Builder $query): Builder
    {
        return $query->published();
    }

    /**
     * Manually picked related posts, in saved order. Unpublished IDs are skipped.
     *
     * @return Collection<int, Blog>
     */
    public static function relatedPublishedPosts(Blog $blog, int $limit = 3): Collection
    {
        $ids = collect($blog->related_ids ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter(fn (int $id) => $id > 0 && $id !== (int) $blog->id)
            ->unique()
            ->take($limit)
            ->values();

        if ($ids->isEmpty()) {
            return collect();
        }

        $posts = self::published(Blog::query())
            ->with(['category:id,name,slug', 'user'])
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        return $ids
            ->map(fn (int $id) => $posts->get($id))
            ->filter()
            ->values();
    }

    /**
     * Previous/next published posts in chronological published_at order
     * (same rule as the public article Previous / Next nav).
     *
     * @return array{previous: ?Blog, next: ?Blog}
     */
    public static function adjacentPublishedPosts(Blog $blog): array
    {
        $publishedAt = $blog->published_at;

        $previous = self::published(Blog::query())
            ->with(['category:id,name,slug,color', 'user'])
            ->whereKeyNot($blog->id)
            ->where(function (Builder $query) use ($blog, $publishedAt) {
                $query->where('published_at', '<', $publishedAt)
                    ->orWhere(function (Builder $query) use ($blog, $publishedAt) {
                        $query->where('published_at', $publishedAt)
                            ->where('id', '<', $blog->id);
                    });
            })
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->first();

        $next = self::published(Blog::query())
            ->with(['category:id,name,slug,color', 'user'])
            ->whereKeyNot($blog->id)
            ->where(function (Builder $query) use ($blog, $publishedAt) {
                $query->where('published_at', '>', $publishedAt)
                    ->orWhere(function (Builder $query) use ($blog, $publishedAt) {
                        $query->where('published_at', $publishedAt)
                            ->where('id', '>', $blog->id);
                    });
            })
            ->orderBy('published_at')
            ->orderBy('id')
            ->first();

        return [
            'previous' => $previous,
            'next'     => $next,
        ];
    }
}
