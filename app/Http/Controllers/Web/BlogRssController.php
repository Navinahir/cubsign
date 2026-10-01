<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Support\BlogPresenter;
use App\Support\BlogQuery;
use Illuminate\Http\Response;

class BlogRssController extends Controller
{
    public function __invoke(): Response
    {
        $posts = BlogQuery::published(Blog::query())
            ->latest('published_at')
            ->get();

        $appUrl = rtrim((string) config('app.url'), '/');
        $appUrl = preg_replace('#^http:#', 'https:', $appUrl) ?? $appUrl;
        $latest = $posts->max('updated_at');
        $buildDate = $latest instanceof \DateTimeInterface
            ? $latest->format('Y-m-d')
            : now()->toDateString();

        $items = $posts->map(function (Blog $blog) use ($appUrl): string {
            $slug = $blog->slug;
            $title = htmlspecialchars($blog->title, ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $link = htmlspecialchars("{$appUrl}/blog/{$slug}", ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $description = htmlspecialchars((string) ($blog->excerpt ?? ''), ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $publishedAt = optional($blog->published_at)?->toDateString();
            $pubDate = gmdate('D, d M Y H:i:s T', strtotime($publishedAt ?? 'now') ?: time());
            $guid = htmlspecialchars("{$appUrl}/blog/{$slug}", ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $enclosure = $this->enclosure(BlogPresenter::coverImageUrl($blog), $appUrl);

            $lines = [
                '    <item>',
                "      <title>{$title}</title>",
                "      <link>{$link}</link>",
                "      <guid isPermaLink=\"true\">{$guid}</guid>",
                "      <pubDate>{$pubDate}</pubDate>",
                "      <description>{$description}</description>",
            ];

            if ($enclosure !== '') {
                $lines[] = $enclosure;
            }

            $lines[] = '    </item>';

            return implode("\n", $lines);
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

    private function enclosure(?string $cover, string $appUrl): string
    {
        if (! is_string($cover) || $cover === '') {
            return '';
        }

        $url = str_starts_with($cover, 'http://') || str_starts_with($cover, 'https://')
            ? $cover
            : $appUrl.(str_starts_with($cover, '/') ? $cover : '/'.$cover);

        $path = parse_url($url, PHP_URL_PATH);
        $length = '0';

        if (is_string($path) && $path !== '') {
            $file = public_path(ltrim($path, '/'));
            if (is_file($file)) {
                $length = (string) filesize($file);
            }
        }

        $extension = strtolower(pathinfo(is_string($path) ? $path : '', PATHINFO_EXTENSION));
        $type = match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            default => 'image/png',
        };

        $safeUrl = htmlspecialchars($url, ENT_XML1 | ENT_QUOTES, 'UTF-8');

        return "      <enclosure url=\"{$safeUrl}\" type=\"{$type}\" length=\"{$length}\" />";
    }
}
