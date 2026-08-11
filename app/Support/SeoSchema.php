<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Builds JSON-LD schema graphs for public SEO pages.
 * Consumes SeoMeta page context + FAQ/content catalogs — not a second copy system for titles.
 */
class SeoSchema
{
    /**
     * @param  array<string, mixed>  $meta  SeoMeta payload for the current page
     * @return array<string, array<string, mixed>>
     */
    public static function forMeta(array $meta, Request $request): array
    {
        $path = (string) ($meta['path'] ?? self::requestPath($request));
        $schemas = [];

        if ($path === '/' || $path === '/about') {
            $schemas['organization'] = self::organization($path === '/about');
        }

        if ($path === '/') {
            $schemas['website'] = self::website();
        }

        $faqs = self::faqsFor($path, $request);
        if ($faqs !== []) {
            $schemas['faq'] = self::faqPage($faqs);
        }

        $breadcrumbs = self::breadcrumbsFor($path, $meta, $request);
        if ($breadcrumbs !== []) {
            $schemas['breadcrumb'] = self::breadcrumbList($breadcrumbs);
        }

        if (($meta['og']['type'] ?? null) === 'article') {
            $article = self::articleFor($path, $meta, $request);
            if ($article !== null) {
                $schemas['article'] = $article;
            }
        }

        return $schemas;
    }

    /**
     * @return array<string, mixed>
     */
    public static function organization(bool $aboutPage = false): array
    {
        $baseUrl = self::baseUrl();

        $org = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'CubSign',
            'url' => $baseUrl,
            'logo' => $baseUrl.'/logo.svg',
        ];

        if ($aboutPage) {
            $org['description'] = 'CubSign is a browser-based PDF signing platform built to simplify secure electronic signatures for individuals and small teams.';
            $org['email'] = 'support@cubsign.com';
            $org['parentOrganization'] = [
                '@type' => 'Organization',
                'name' => 'Cubiz Infotech',
            ];
        }

        return $org;
    }

    /**
     * @return array<string, mixed>
     */
    public static function website(): array
    {
        $baseUrl = self::baseUrl();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => 'CubSign',
            'url' => $baseUrl,
            'description' => 'Free online PDF signing platform',
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => $baseUrl.'/help-center?q={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    /**
     * @param  list<array{question: string, answer: string}>  $faqs
     * @return array<string, mixed>
     */
    public static function faqPage(array $faqs): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => array_values(array_map(static fn (array $item) => [
                '@type' => 'Question',
                'name' => $item['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $item['answer'],
                ],
            ], $faqs)),
        ];
    }

    /**
     * @param  list<array{name: string, url: string}>  $items
     * @return array<string, mixed>
     */
    public static function breadcrumbList(array $items): array
    {
        $baseUrl = self::baseUrl();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => array_values(array_map(static function (array $item, int $index) use ($baseUrl) {
                $url = $item['url'];
                if (! str_starts_with($url, 'http')) {
                    $url = $baseUrl.($url === '/' ? '/' : $url);
                }

                return [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $item['name'],
                    'item' => $url,
                ];
            }, $items, array_keys($items))),
        ];
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return array<string, mixed>|null
     */
    private static function articleFor(string $path, array $meta, Request $request): ?array
    {
        if ($request->routeIs('blog.show')) {
            return self::blogArticle((string) $request->route('slug'), $meta);
        }

        if ($request->routeIs('help-center.show')) {
            return self::helpArticle((string) $request->route('slug'), $meta);
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return array<string, mixed>|null
     */
    private static function blogArticle(string $slug, array $meta): ?array
    {
        $post = collect(config('blog.posts', []))
            ->first(fn (array $item) => ($item['slug'] ?? null) === $slug);

        if (! is_array($post)) {
            return null;
        }

        $baseUrl = self::baseUrl();
        $payload = [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => (string) ($post['title'] ?? ''),
            'description' => (string) ($post['excerpt'] ?? $meta['description'] ?? ''),
            'author' => [
                '@type' => 'Person',
                'name' => (string) ($post['author'] ?? 'CubSign Team'),
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'CubSign',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $baseUrl.'/logo.svg',
                ],
            ],
            'mainEntityOfPage' => $meta['canonical'] ?? ($baseUrl.'/blog/'.$slug),
        ];

        if (! empty($post['published_at'])) {
            $payload['datePublished'] = (string) $post['published_at'];
        }

        if (! empty($post['updated_at'])) {
            $payload['dateModified'] = (string) $post['updated_at'];
        }

        if (! empty($post['cover_image'])) {
            $cover = (string) $post['cover_image'];
            $payload['image'] = [
                str_starts_with($cover, 'http') ? $cover : $baseUrl.$cover,
            ];
        }

        return $payload;
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return array<string, mixed>|null
     */
    private static function helpArticle(string $slug, array $meta): ?array
    {
        $article = collect(config('help.articles', []))
            ->first(fn (array $item) => ($item['slug'] ?? null) === $slug);

        if (! is_array($article)) {
            return null;
        }

        $baseUrl = self::baseUrl();
        $payload = [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => (string) ($article['title'] ?? ''),
            'description' => (string) ($article['excerpt'] ?? $meta['description'] ?? ''),
            'author' => [
                '@type' => 'Person',
                'name' => (string) ($article['author'] ?? 'CubSign Product & Engineering Team'),
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'CubSign',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $baseUrl.'/logo.svg',
                ],
            ],
            'mainEntityOfPage' => $meta['canonical'] ?? ($baseUrl.'/help-center/'.$slug),
        ];

        // Help articles have no genuine published date — omit datePublished.
        if (! empty($article['updated_at'])) {
            $payload['dateModified'] = (string) $article['updated_at'];
        }

        return $payload;
    }

    /**
     * @return list<array{question: string, answer: string}>
     */
    private static function faqsFor(string $path, Request $request): array
    {
        if ($request->routeIs('blog.show')) {
            $post = collect(config('blog.posts', []))
                ->first(fn (array $item) => ($item['slug'] ?? null) === $request->route('slug'));

            return self::normalizeFaqs($post['faq'] ?? []);
        }

        if ($request->routeIs('help-center.show')) {
            $article = collect(config('help.articles', []))
                ->first(fn (array $item) => ($item['slug'] ?? null) === $request->route('slug'));

            return self::normalizeFaqs($article['faq'] ?? []);
        }

        return self::normalizeFaqs(config('seo.faqs.'.$path, []));
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return list<array{name: string, url: string}>
     */
    private static function breadcrumbsFor(string $path, array $meta, Request $request): array
    {
        if ($request->routeIs('blog.show')) {
            $post = collect(config('blog.posts', []))
                ->first(fn (array $item) => ($item['slug'] ?? null) === $request->route('slug'));

            if (! is_array($post)) {
                return [];
            }

            return [
                ['name' => 'Home', 'url' => '/'],
                ['name' => 'Blog', 'url' => '/blog'],
                ['name' => (string) $post['title'], 'url' => '/blog/'.$post['slug']],
            ];
        }

        if ($request->routeIs('help-center.show')) {
            $article = collect(config('help.articles', []))
                ->first(fn (array $item) => ($item['slug'] ?? null) === $request->route('slug'));

            if (! is_array($article)) {
                return [];
            }

            return [
                ['name' => 'Home', 'url' => '/'],
                ['name' => 'Help Center', 'url' => '/help-center'],
                ['name' => (string) $article['title'], 'url' => '/help-center/'.$article['slug']],
            ];
        }

        $crumbs = config('seo.breadcrumbs.'.$path);

        return is_array($crumbs) ? array_values(array_filter($crumbs, static fn ($item) => is_array($item)
            && ! empty($item['name'])
            && ! empty($item['url']))) : [];
    }

    /**
     * @param  mixed  $faqs
     * @return list<array{question: string, answer: string}>
     */
    private static function normalizeFaqs(mixed $faqs): array
    {
        if (! is_array($faqs)) {
            return [];
        }

        $normalized = [];
        foreach ($faqs as $item) {
            if (! is_array($item)) {
                continue;
            }
            $question = trim((string) ($item['question'] ?? ''));
            $answer = trim((string) ($item['answer'] ?? ''));
            if ($question === '' || $answer === '') {
                continue;
            }
            $normalized[] = [
                'question' => $question,
                'answer' => $answer,
            ];
        }

        return $normalized;
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
