<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class BlogRssController extends Controller
{
    public function __invoke(): Response
    {
        $posts = collect(config('blog.posts', []))
            ->sortByDesc('published_at')
            ->values();

        $appUrl = rtrim((string) config('app.url'), '/');
        $appUrl = preg_replace('#^http:#', 'https:', $appUrl) ?? $appUrl;
        $buildDate = $posts->max('updated_at') ?? now()->toDateString();

        $items = $posts->map(function (array $post) use ($appUrl): string {
            $slug = $post['slug'] ?? '';
            $title = htmlspecialchars($post['title'] ?? $slug, ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $link = htmlspecialchars("{$appUrl}/blog/{$slug}", ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $description = htmlspecialchars($post['excerpt'] ?? '', ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $pubDate = gmdate('D, d M Y H:i:s T', strtotime($post['published_at'] ?? 'now') ?: time());
            $guid = htmlspecialchars("{$appUrl}/blog/{$slug}", ENT_XML1 | ENT_QUOTES, 'UTF-8');

            return implode("\n", [
                '    <item>',
                "      <title>{$title}</title>",
                "      <link>{$link}</link>",
                "      <guid isPermaLink=\"true\">{$guid}</guid>",
                "      <pubDate>{$pubDate}</pubDate>",
                "      <description>{$description}</description>",
                '    </item>',
            ]);
        })->implode("\n");

        $xml = implode("\n", [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
            '  <channel>',
            '    <title>CubSign Blog</title>',
            '    <link>'.htmlspecialchars("{$appUrl}/blog", ENT_XML1 | ENT_QUOTES, 'UTF-8').'</link>',
            '    <description>Tips, guides, and product updates on PDF signing, security, and paperless workflows from CubSign.</description>',
            '    <language>en-us</language>',
            '    <lastBuildDate>'.gmdate('D, d M Y H:i:s T', strtotime($buildDate) ?: time()).'</lastBuildDate>',
            '    <atom:link href="'.htmlspecialchars("{$appUrl}/rss.xml", ENT_XML1 | ENT_QUOTES, 'UTF-8').'" rel="self" type="application/rss+xml" />',
            $items,
            '  </channel>',
            '</rss>',
            '',
        ]);

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=UTF-8',
        ]);
    }
}
