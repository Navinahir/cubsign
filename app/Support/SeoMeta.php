<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Central SEO metadata resolver for Blade initial HTML and Inertia shared props.
 * Values come from config/seo.php (static pages) and config/blog.php / config/help.php.
 */
class SeoMeta
{
    /**
     * Resolve page SEO for the Inertia root Blade view (initial HTML).
     *
     * @param  array<string, mixed>  $page
     * @return array<string, mixed>|null
     */
    public static function forBlade(array $page, Request $request): ?array
    {
        if (($page['component'] ?? null) === 'Error') {
            return null;
        }

        return self::forRequest($request);
    }

    /**
     * Resolve SEO for the current request (shared to Inertia + Blade).
     *
     * @return array<string, mixed>|null
     */
    public static function forRequest(Request $request): ?array
    {
        if (SeoRobots::forRequest($request) === SeoRobots::NOINDEX) {
            return null;
        }

        if ($request->routeIs('blog.show')) {
            $meta = self::forBlogPost((string) $request->route('slug'));
        } elseif ($request->routeIs('help-center.show')) {
            $meta = self::forHelpArticle((string) $request->route('slug'));
        } else {
            $path = self::requestPath($request);
            $page = config('seo.pages.'.$path);

            if (! is_array($page)) {
                return null;
            }

            $meta = self::buildPayload(
                title: (string) $page['title'],
                description: (string) $page['description'],
                path: $path,
                type: (string) ($page['type'] ?? 'website'),
                article: is_array($page['article'] ?? null) ? $page['article'] : null,
                coverImage: null,
            );
        }

        if ($meta === null) {
            return null;
        }

        $schemas = SeoSchema::forMeta($meta, $request);
        if ($schemas !== []) {
            $meta['schemas'] = $schemas;
        }

        return $meta;
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function forBlogPost(string $slug): ?array
    {
        $post = collect(config('blog.posts', []))
            ->first(fn (array $item) => ($item['slug'] ?? null) === $slug);

        if (! is_array($post)) {
            return null;
        }

        $title = (string) ($post['meta_title'] ?? $post['title'] ?? '');
        $description = (string) ($post['meta_description'] ?? $post['excerpt'] ?? '');

        if ($title === '' || $description === '') {
            return null;
        }

        return self::buildPayload(
            title: $title,
            description: $description,
            path: '/blog/'.$slug,
            type: 'article',
            article: [
                'published_at' => $post['published_at'] ?? null,
                'updated_at' => $post['updated_at'] ?? null,
                'author' => $post['author'] ?? 'CubSign Team',
            ],
            // Keep OG on the default image (matches prior MarketingSeo). Cover is used in Article JSON-LD.
            coverImage: null,
        );
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function forHelpArticle(string $slug): ?array
    {
        $article = collect(config('help.articles', []))
            ->first(fn (array $item) => ($item['slug'] ?? null) === $slug);

        if (! is_array($article)) {
            return null;
        }

        $title = (string) ($article['meta_title'] ?? '');
        $description = (string) ($article['meta_description'] ?? '');

        if ($title === '' || $description === '') {
            return null;
        }

        $updatedAt = $article['updated_at'] ?? null;

        return self::buildPayload(
            title: $title,
            description: $description,
            path: '/help-center/'.$slug,
            type: 'article',
            article: [
                // No genuine published date for Help articles.
                'updated_at' => $updatedAt,
                'author' => $article['author'] ?? 'CubSign Product & Engineering Team',
            ],
            coverImage: null,
        );
    }

    /**
     * @param  array<string, mixed>|null  $article
     * @return array<string, mixed>
     */
    private static function buildPayload(
        string $title,
        string $description,
        string $path,
        string $type,
        ?array $article,
        ?string $coverImage,
    ): array {
        $baseUrl = self::baseUrl();
        $canonical = $baseUrl.($path === '/' ? '/' : $path);
        $ogType = $type === 'article' ? 'article' : 'website';
        $imagePath = $coverImage ?: (string) config('seo.default_og_image', '/images/og/default-og.png');
        $image = str_starts_with($imagePath, 'http') ? $imagePath : $baseUrl.$imagePath;
        $imageWidth = $coverImage
            ? (int) config('seo.blog_og_width', 1200)
            : (int) config('seo.default_og_width', 1200);
        $imageHeight = $coverImage
            ? (int) config('seo.blog_og_height', 675)
            : (int) config('seo.default_og_height', 630);

        $payload = [
            'title' => $title,
            'description' => $description,
            'path' => $path,
            'canonical' => $canonical,
            'og' => [
                'title' => $title,
                'description' => $description,
                'url' => $canonical,
                'image' => $image,
                'image_width' => $imageWidth,
                'image_height' => $imageHeight,
                'type' => $ogType,
                'site_name' => 'CubSign',
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => $title,
                'description' => $description,
                'image' => $image,
            ],
        ];

        if ($ogType === 'article' && is_array($article)) {
            if (! empty($article['published_at'])) {
                $payload['og']['article_published_time'] = (string) $article['published_at'];
            }
            if (! empty($article['updated_at'])) {
                $payload['og']['article_modified_time'] = (string) $article['updated_at'];
            }
            if (! empty($article['author'])) {
                $payload['og']['article_author'] = (string) $article['author'];
            }
        }

        return $payload;
    }

    private static function requestPath(Request $request): string
    {
        $path = trim($request->path(), '/');

        return $path === '' ? '/' : '/'.$path;
    }

    private static function baseUrl(): string
    {
        return rtrim((string) config('app.url'), '/');
    }
}
