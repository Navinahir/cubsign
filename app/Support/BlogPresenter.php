<?php

namespace App\Support;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class BlogPresenter
{
    /**
     * @return array{name: string, role: string, initials: string, avatarBg: string, bio: string}
     */
    public static function author(Blog $blog): array
    {
        $user = $blog->relationLoaded('user') ? $blog->user : null;

        // Eager-load with a column subset can mark the relation loaded but empty.
        if (! $user && $blog->user_id) {
            $user = $blog->user()->first();
        }

        if ($user) {
            return self::toPublicAuthorArray($user);

        }

        return self::defaultPublicAuthorArray();
    }

     /**
     * Public blog author shape resolved from this authenticated user.
     *
     * @return array{name: string, role: string, initials: string, avatarBg: string, bio: string}
     */
    public static function toPublicAuthorArray(User $user): array
    {
        return [
            'name'     => $user->name,
            'role'     => $user->isAdmin() ? 'Admin' : 'Author',
            'initials' => $user->initials(),
            'avatarBg' => 'bg-blue-600',
            'bio'      => '',
        ];
    }

    /**
     * Public blog byline when a post has no resolvable owner.
     *
     * @return array{name: string, role: string, initials: string, avatarBg: string, bio: string}
     */
    public static function defaultPublicAuthorArray(): array
    {
        return [
            'name'     => 'CubSign Product & Engineering Team',
            'role'     => 'Product & Engineering',
            'initials' => 'PE',
            'avatarBg' => 'bg-blue-600',
            'bio'      => 'We build CubSign, the browser PDF signing product. These guides describe the product as we ship it.',
        ];
    }
    public static function coverImageUrl(Blog $blog): ?string
    {
        if (! $blog->cover_image) {
            return null;
        }

        if (str_starts_with($blog->cover_image, 'http://') || str_starts_with($blog->cover_image, 'https://')|| str_starts_with($blog->cover_image, '/')) {
            return $blog->cover_image;
        }

        return Storage::disk('public')->url($blog->cover_image);
    }

    /**
     * Shape matching the existing public Blog frontend post fields.
     */
    public static function toFrontendArray(Blog $blog): array
    {
        $category = $blog->relationLoaded('category') ? $blog->category : $blog->category()->first();

        return [
            'id'              => $blog->id,
            'slug'            => $blog->slug,
            'title'           => $blog->title,
            'excerpt'         => $blog->excerpt,
            'category'        => $category?->name,
            'categorySlug'    => $category?->slug,
            'publishedAt'     => optional($blog->published_at)?->toDateString(),
            'updatedAt'       => $blog->updated_at?->format('Y-m-d H:i:s'),
            'tags'            => $blog->tags ?? [],
            'keywords'        => $blog->keywords ?? [],
            'featured'        => (bool) $blog->featured,
            'popular'         => (bool) $blog->popular,
            'metaTitle'       => $blog->title ? $blog->title.' — CubSign Blog' : null,
            'metaDescription' => $blog->excerpt,
            'author'          => self::author($blog),
            'readingTime'     => self::minutesSinceCreated($blog),
            'content'         => self::htmlContent($blog),
            'faq'             => $blog->faq ?? [],
            'coverImage'      => self::coverImageUrl($blog),
            'status'          => $blog->status?->value ?? $blog->status,
        ];
    }

    public static function htmlContent(Blog $blog): string
    {
        return BlogContent::storedToHtml($blog->content);
    }

    /**
     * Whole minutes since the post was created. The public "min read" label uses this number.
     */
    private static function minutesSinceCreated(Blog $blog): int
    {
        if (! $blog->created_at) {
            return (int) ($blog->reading_time ?? 0);
        }

        return max(0, (int) abs($blog->created_at->diffInMinutes(now())));
    }
}
