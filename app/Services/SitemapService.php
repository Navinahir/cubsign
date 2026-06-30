<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class SitemapService
{
    private const CACHE_KEY = 'sitemap.xml';

    public function xml(): string
    {
        return Cache::remember(
            self::CACHE_KEY,
            config('sitemap.cache_ttl', 3600),
            fn (): string => $this->generateXml(),
        );
    }

    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    private function generateXml(): string
    {
        $urls = $this->collectUrls();

        $lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        foreach ($urls as $url) {
            $lines[] = '  <url>';
            $lines[] = '    <loc>'.$this->escape($url['loc']).'</loc>';

            if (! empty($url['lastmod'])) {
                $lines[] = '    <lastmod>'.$this->escape($url['lastmod']).'</lastmod>';
            }

            if (! empty($url['changefreq'])) {
                $lines[] = '    <changefreq>'.$this->escape($url['changefreq']).'</changefreq>';
            }

            if (! empty($url['priority'])) {
                $lines[] = '    <priority>'.$this->escape($url['priority']).'</priority>';
            }

            $lines[] = '  </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines)."\n";
    }

    /**
     * @return list<array{loc: string, lastmod?: string, changefreq?: string, priority?: string}>
     */
    private function collectUrls(): array
    {
        $urls = [];
        $seen = [];

        foreach (config('sitemap.static', []) as $entry) {
            $this->appendUrl($urls, $seen, $this->normalizeEntry($entry));
        }

        foreach ($this->blogPostUrls() as $entry) {
            $this->appendUrl($urls, $seen, $entry);
        }

        foreach (config('sitemap.documentation', []) as $entry) {
            $this->appendUrl($urls, $seen, $this->normalizeEntry($entry));
        }

        foreach (config('sitemap.help_center', []) as $entry) {
            $this->appendUrl($urls, $seen, $this->normalizeEntry($entry));
        }

        return $urls;
    }

    /**
     * @return list<array{loc: string, lastmod?: string, changefreq?: string, priority?: string}>
     */
    private function blogPostUrls(): array
    {
        $posts = config('blog.posts', []);

        if ($posts === []) {
            return [];
        }

        $defaults = config('sitemap.blog_posts', []);
        $urls = [];

        foreach ($posts as $post) {
            $slug = $post['slug'] ?? null;

            if (! is_string($slug) || $slug === '') {
                continue;
            }

            $entry = [
                'path' => '/blog/'.$slug,
                'priority' => $defaults['priority'] ?? null,
                'changefreq' => $defaults['changefreq'] ?? null,
            ];

            if (! empty($post['published_at'])) {
                $entry['lastmod'] = $post['published_at'];
            }

            $urls[] = $this->normalizeEntry($entry);
        }

        return $urls;
    }

    /**
     * @param  array{path: string, lastmod?: string, changefreq?: string, priority?: string}  $entry
     * @return array{loc: string, lastmod?: string, changefreq?: string, priority?: string}
     */
    private function normalizeEntry(array $entry): array
    {
        $path = $entry['path'] ?? '/';
        $normalized = $path === '/' ? '/' : '/'.ltrim($path, '/');

        $url = [
            'loc' => $this->baseUrl().$normalized,
        ];

        if (! empty($entry['lastmod'])) {
            $url['lastmod'] = $this->formatLastmod($entry['lastmod']);
        }

        if (! empty($entry['changefreq'])) {
            $url['changefreq'] = $entry['changefreq'];
        }

        if (! empty($entry['priority'])) {
            $url['priority'] = $entry['priority'];
        }

        return $url;
    }

    /**
     * @param  list<array{loc: string, lastmod?: string, changefreq?: string, priority?: string}>  $urls
     * @param  array<string, true>  $seen
     * @param  array{loc: string, lastmod?: string, changefreq?: string, priority?: string}  $entry
     */
    private function appendUrl(array &$urls, array &$seen, array $entry): void
    {
        $loc = $entry['loc'];

        if (isset($seen[$loc])) {
            return;
        }

        $seen[$loc] = true;
        $urls[] = $entry;
    }

    private function baseUrl(): string
    {
        $url = rtrim((string) config('app.url'), '/');

        return preg_replace('#^http:#', 'https:', $url) ?? $url;
    }

    private function formatLastmod(string $value): string
    {
        $timestamp = strtotime($value);

        if ($timestamp === false) {
            return $value;
        }

        return gmdate('Y-m-d', $timestamp);
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
