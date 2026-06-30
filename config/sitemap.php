<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Sitemap cache TTL (seconds)
    |--------------------------------------------------------------------------
    */
    'cache_ttl' => (int) env('SITEMAP_CACHE_TTL', 3600),

    /*
    |--------------------------------------------------------------------------
    | Static public pages
    |--------------------------------------------------------------------------
    |
    | Add new marketing pages here. Paths must be canonical (no trailing slash
    | except for home). Private or auth-only routes must not be listed.
    |
    */
    'static' => [
        ['path' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
        ['path' => '/features', 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['path' => '/sign', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['path' => '/blog', 'priority' => '0.8', 'changefreq' => 'daily'],
        ['path' => '/faq', 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['path' => '/privacy', 'priority' => '0.5', 'changefreq' => 'yearly'],
        ['path' => '/terms', 'priority' => '0.5', 'changefreq' => 'yearly'],
        ['path' => '/cookies', 'priority' => '0.5', 'changefreq' => 'yearly'],
        ['path' => '/contact', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Blog post defaults
    |--------------------------------------------------------------------------
    */
    'blog_posts' => [
        'priority' => '0.6',
        'changefreq' => 'monthly',
    ],

    /*
    |--------------------------------------------------------------------------
    | Documentation pages (included when entries exist)
    |--------------------------------------------------------------------------
    |
    | Example:
    | ['path' => '/docs/getting-started', 'priority' => '0.6', 'changefreq' => 'weekly', 'lastmod' => '2026-01-15'],
    |
    */
    'documentation' => [
        // ['path' => '/docs/example', 'priority' => '0.6', 'changefreq' => 'weekly'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Help Center pages (included when entries exist)
    |--------------------------------------------------------------------------
    |
    | Use when Help Center has dedicated URLs beyond /faq.
    |
    */
    'help_center' => [
        // ['path' => '/help/getting-started', 'priority' => '0.6', 'changefreq' => 'weekly'],
    ],

];
