<?php

namespace App\Support;

class BlogContent
{
    /**
     * Always expose HTML. Legacy JSON block drafts (from early seeders) are converted on read.
     */
    public static function storedToHtml(mixed $value): string
    {
        if (is_array($value)) {
            return self::blocksToHtml($value);
        }

        if (! is_string($value) || $value === '') {
            return '';
        }

        $trimmed = ltrim($value);
        if (str_starts_with($trimmed, '[') || str_starts_with($trimmed, '{')) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return self::blocksToHtml($decoded);
            }
        }

        return $value;
    }

    /**
     * Sanitize CMS HTML while preserving document order (text + inline images).
     * Keeps safe formatting, alignment, and image layout styles used by the Visual editor.
     */
    public static function sanitize(string $html): string
    {
        $html = trim($html);
        if ($html === '') {
            return '';
        }

        $html = preg_replace('#<(script|style|iframe|object|embed|form)[^>]*>.*?</\1>#is', '', $html) ?? $html;

        $previous = libxml_use_internal_errors(true);
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $wrapped = '<?xml encoding="UTF-8"><div id="__blog_sanitize_root__">'.$html.'</div>';
        $dom->loadHTML($wrapped, LIBXML_HTML_NODEFDTD);

        $root = $dom->getElementById('__blog_sanitize_root__');
        if (! $root) {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);

            return '';
        }

        self::sanitizeNode($dom, $root);

        $output = '';
        foreach ($root->childNodes as $child) {
            $output .= $dom->saveHTML($child);
        }

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return trim($output);
    }

    public static function hasVisibleBody(string $html): bool
    {
        $text = trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        if ($text !== '') {
            return true;
        }

        return (bool) preg_match('/<img\b/i', $html);
    }

    private static function sanitizeNode(\DOMDocument $dom, \DOMElement $parent): void
    {
        $allowed = [
            'h1' => ['style'],
            'h2' => ['style'],
            'h3' => ['style'],
            'h4' => ['style'],
            'h5' => ['style'],
            'h6' => ['style'],
            'p' => ['style', 'class'],
            'br' => [],
            'strong' => [],
            'b' => [],
            'em' => [],
            'i' => [],
            'u' => [],
            's' => [],
            'strike' => [],
            'a' => ['href', 'target', 'rel', 'title'],
            'ul' => ['style'],
            'ol' => ['style'],
            'li' => ['style'],
            'blockquote' => ['style'],
            'div' => ['class'],
            'aside' => array_merge(
                ['class', 'data-box', 'data-blog-box'],
                array_map(static fn (string $field): string => 'data-'.$field, array_keys(self::boxFields())),
            ),
            'figure' => ['class', 'style'],
            'picture' => ['class'],
            'source' => ['srcset', 'type', 'media'],
            'figcaption' => ['class', 'style'],
            'img' => ['src', 'alt', 'title', 'width', 'height', 'class', 'style', 'loading', 'decoding'],
            'hr' => [],
            'span' => ['style'],
        ];

        $remove = [];

        foreach (iterator_to_array($parent->childNodes) as $node) {
            if ($node instanceof \DOMText) {
                continue;
            }

            if (! $node instanceof \DOMElement) {
                $remove[] = $node;
                continue;
            }

            $tag = strtolower($node->tagName);

            if (! isset($allowed[$tag])) {
                while ($node->firstChild) {
                    $parent->insertBefore($node->firstChild, $node);
                }
                $remove[] = $node;
                continue;
            }

            self::sanitizeAttributes($node, $allowed[$tag], $tag);

            if ($tag === 'aside') {
                self::normalizeAside($node);
            }

            if ($tag === 'img' && ! self::isSafeUrl((string) $node->getAttribute('src'), allowRelative: true)) {
                $remove[] = $node;
                continue;
            }

            if ($tag === 'a') {
                $href = (string) $node->getAttribute('href');
                if ($href !== '' && ! self::isSafeUrl($href, allowRelative: true)) {
                    $node->setAttribute('href', '#');
                }
                if ($node->getAttribute('target') === '_blank' && $node->getAttribute('rel') === '') {
                    $node->setAttribute('rel', 'noopener noreferrer');
                }
            }

            if ($node->hasChildNodes()) {
                self::sanitizeNode($dom, $node);
            }
        }

        foreach ($remove as $node) {
            if ($node->parentNode) {
                $node->parentNode->removeChild($node);
            }
        }
    }

    /**
     * @param  list<string>  $allowedAttrs
     */
    private static function sanitizeAttributes(\DOMElement $node, array $allowedAttrs, string $tag): void
    {
        $removeAttrs = [];

        foreach (iterator_to_array($node->attributes ?? []) as $attr) {
            $name = strtolower($attr->name);
            if (str_starts_with($name, 'on')) {
                $removeAttrs[] = $attr->name;
                continue;
            }

            if (! in_array($name, $allowedAttrs, true)) {
                $removeAttrs[] = $attr->name;
                continue;
            }

            if ($name === 'style') {
                $filtered = self::filterStyles((string) $attr->value, $tag);
                if ($filtered === '') {
                    $removeAttrs[] = $attr->name;
                } else {
                    $node->setAttribute('style', $filtered);
                }
            }

            if ($name === 'class') {
                $filtered = self::sanitizeClassList((string) $attr->value);
                if ($filtered === '') {
                    $removeAttrs[] = $attr->name;
                } else {
                    $node->setAttribute('class', $filtered);
                }
                continue;
            }

            if (str_starts_with($name, 'data-')) {
                $filtered = self::sanitizeDataAttribute($name, (string) $attr->value);
                if ($filtered === null) {
                    $removeAttrs[] = $attr->name;
                } else {
                    $node->setAttribute($name, $filtered);
                }
                continue;
            }

            if ($name === 'loading') {
                $value = strtolower(trim((string) $attr->value));
                if (! in_array($value, ['lazy', 'eager', 'auto'], true)) {
                    $removeAttrs[] = $attr->name;
                }
                continue;
            }

            if ($name === 'decoding') {
                $value = strtolower(trim((string) $attr->value));
                if (! in_array($value, ['async', 'sync', 'auto'], true)) {
                    $removeAttrs[] = $attr->name;
                }
                continue;
            }
        }

        foreach ($removeAttrs as $name) {
            $node->removeAttribute($name);
        }
    }

    private static function filterStyles(string $css, string $tag): string
    {
        $allowed = match ($tag) {
            'img', 'figure' => [
                'width', 'height', 'max-width', 'float', 'display',
                'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
                'text-align',
            ],
            'span' => ['text-align', 'text-decoration', 'font-weight', 'font-style', 'color', 'background-color'],
            default => ['text-align'],
        };

        $parts = [];
        foreach (explode(';', $css) as $declaration) {
            $declaration = trim($declaration);
            if ($declaration === '' || ! str_contains($declaration, ':')) {
                continue;
            }

            [$prop, $value] = array_map('trim', explode(':', $declaration, 2));
            $prop = strtolower($prop);
            $value = preg_replace('/\s+/', ' ', $value) ?? $value;

            if (! in_array($prop, $allowed, true)) {
                continue;
            }

            if (preg_match('/expression|javascript|url\s*\(/i', $value)) {
                continue;
            }

            if ($prop === 'text-align' && ! in_array(strtolower($value), ['left', 'center', 'right', 'justify'], true)) {
                continue;
            }

            if ($prop === 'float' && ! in_array(strtolower($value), ['left', 'right', 'none'], true)) {
                continue;
            }

            if ($prop === 'display' && ! in_array(strtolower($value), ['block', 'inline', 'inline-block', 'none'], true)) {
                continue;
            }

            if (in_array($prop, ['color', 'background-color'], true)) {
                if (! preg_match('/^(#[0-9a-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|[a-z]+)$/i', $value)) {
                    continue;
                }
            }

            if (in_array($prop, ['width', 'height', 'max-width', 'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom'], true)) {
                if (! preg_match('/^(auto|\d+(\.\d+)?(px|%|rem|em)?)$/i', $value)
                    && ! preg_match('/^(\d+(\.\d+)?(px|%|rem|em)?\s+){1,3}\d+(\.\d+)?(px|%|rem|em)?$/i', $value)
                    && ! preg_match('/^\d+(\.\d+)?(px|%)?\s+\d+(\.\d+)?(px|%)?\s+\d+(\.\d+)?(px|%)?\s+\d+(\.\d+)?(px|%)?$/i', $value)
                ) {
                    if (! preg_match('/^[\d.\s%pxrememauto]+$/i', $value)) {
                        continue;
                    }
                }
            }

            $parts[] = $prop.': '.$value;
        }

        return implode('; ', $parts);
    }

    private static function sanitizeClassList(string $class): string
    {
        $tokens = preg_split('/\s+/', trim($class)) ?: [];
        $safe = [];

        foreach ($tokens as $token) {
            if (self::isSafeClassToken($token)) {
                $safe[] = $token;
            }
        }

        return implode(' ', array_unique($safe));
    }

    private static function isSafeClassToken(string $token): bool
    {
        if ($token === '' || strlen($token) > 120) {
            return false;
        }

        if (preg_match('/javascript|expression|url\s*\(/i', $token)) {
            return false;
        }

        return (bool) preg_match('/^[a-zA-Z][a-zA-Z0-9_:\-\/\[\]\(\),.]*$/', $token);
    }

    /**
     * Box settings stored as one comma-separated data-box value.
     * Order is fixed and shared with resources/js/utils/blogBox.js.
     *
     * @return array<string, list<string>>
     */
    private static function boxFields(): array
    {
        return [
            'type' => ['note', 'tip', 'info', 'warning', 'important', 'success', 'custom'],
            'theme' => ['blue', 'indigo', 'green', 'yellow', 'orange', 'red', 'purple', 'gray'],
            'border' => ['none', 'solid', 'strong'],
            'gradient' => ['0', '1'],
            'rounded' => ['none', 'xl', '2xl'],
            'shadow' => ['0', '1'],
            'image-position' => ['left', 'right', 'top', 'bottom'],
            'image-max-width' => ['160', '200', '240', '320', 'full'],
            'image-rounded' => ['none', 'xl', '2xl'],
            'image-border' => ['0', '1'],
            'image-shadow' => ['0', '1'],
            'image-lazy' => ['0', '1'],
        ];
    }

    private static function sanitizeDataAttribute(string $name, string $value): ?string
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }

        if ($name === 'data-box') {
            return strlen($value) > 120 ? null : self::sanitizePackedBox($value);
        }

        if (strlen($value) > 40) {
            return null;
        }

        $field = str_starts_with($name, 'data-') ? substr($name, 5) : '';
        $allowed = self::boxFields();
        if ($name === 'data-blog-box') {
            return $value === '1' ? '1' : null;
        }

        if (! isset($allowed[$field]) || ! in_array($value, $allowed[$field], true)) {
            return null;
        }

        return $value;
    }

    private static function sanitizePackedBox(string $value): ?string
    {
        $fields = array_keys(self::boxFields());
        $tokens = [];

        foreach (explode(',', $value) as $index => $token) {
            if (! isset($fields[$index])) {
                break;
            }

            $token = trim($token);
            if ($token === '') {
                $tokens[] = '';

                continue;
            }

            $safe = self::sanitizeDataAttribute('data-'.$fields[$index], $token);
            $tokens[] = $safe ?? '';
        }

        while ($tokens !== [] && end($tokens) === '') {
            array_pop($tokens);
        }

        return $tokens === [] ? null : implode(',', $tokens);
    }

    private static function normalizeAside(\DOMElement $aside): void
    {
        $class = self::sanitizeClassList((string) $aside->getAttribute('class'));
        if ($class !== '') {
            $aside->setAttribute('class', $class);
        } else {
            $aside->removeAttribute('class');
        }

        self::packBoxAttributes($aside);
    }

    /**
     * Collapse per-field data attributes into data-box="type,theme,border,...".
     */
    private static function packBoxAttributes(\DOMElement $aside): void
    {
        $fields = array_keys(self::boxFields());
        $packed = array_pad(
            explode(',', (string) $aside->getAttribute('data-box')),
            count($fields),
            '',
        );
        $tokens = [];
        $any = false;

        foreach ($fields as $index => $field) {
            $fromAttr = trim((string) $aside->getAttribute('data-'.$field));
            $value = $fromAttr !== '' ? $fromAttr : trim((string) ($packed[$index] ?? ''));
            $tokens[] = $value;
            $any = $any || $value !== '';
            $aside->removeAttribute('data-'.$field);
        }

        $aside->removeAttribute('data-blog-box');
        $aside->removeAttribute('data-box');

        if (! $any) {
            return;
        }

        while ($tokens !== [] && end($tokens) === '') {
            array_pop($tokens);
        }

        $aside->setAttribute('data-box', implode(',', $tokens));
    }

    private static function isSafeUrl(string $url, bool $allowRelative = false): bool
    {
        $url = trim($url);
        if ($url === '') {
            return false;
        }

        if ($allowRelative && (str_starts_with($url, '/') || str_starts_with($url, '#'))) {
            return ! str_contains(strtolower($url), 'javascript:');
        }

        if (preg_match('#^(https?:)?//#i', $url)) {
            return true;
        }

        if ($allowRelative && ! preg_match('#^[a-z][a-z0-9+.-]*:#i', $url)) {
            return true;
        }

        return false;
    }

    /**
     * @param  array<int, mixed>  $blocks
     */
    public static function blocksToHtml(array $blocks): string
    {
        $parts = [];

        foreach ($blocks as $block) {
            if (! is_array($block) || ! isset($block['type'])) {
                continue;
            }

            $type = $block['type'];
            $data = is_array($block['data'] ?? null) ? $block['data'] : $block;
            $text = htmlspecialchars((string) ($data['text'] ?? $block['text'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');

            $parts[] = match ($type) {
                'paragraph', 'p' => $text !== '' ? '<p>'.$text.'</p>' : '',
                'heading' => '<h'.max(1, min(6, (int) ($data['level'] ?? 2))).'>'.$text.'</h'.max(1, min(6, (int) ($data['level'] ?? 2))).'>',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6' => '<'.$type.'>'.$text.'</'.$type.'>',
                'quote' => $text !== '' ? '<blockquote><p>'.$text.'</p></blockquote>' : '',
                'tip', 'note' => $text !== '' ? '<blockquote><p><strong>'.ucfirst($type).':</strong> '.$text.'</p></blockquote>' : '',
                'divider', 'hr' => '<hr>',
                'image' => self::imageTag((string) ($data['url'] ?? $block['url'] ?? ''), (string) ($data['alt'] ?? $block['alt'] ?? '')),
                'unordered_list', 'ul' => self::listTag('ul', $data['items'] ?? $block['items'] ?? []),
                'ordered_list', 'ol' => self::listTag('ol', $data['items'] ?? $block['items'] ?? []),
                default => $text !== '' ? '<p>'.$text.'</p>' : '',
            };
        }

        return implode("\n", array_filter($parts));
    }

    private static function imageTag(string $url, string $alt): string
    {
        $url = trim($url);
        if ($url === '') {
            return '';
        }

        return '<img src="'.htmlspecialchars($url, ENT_QUOTES | ENT_HTML5, 'UTF-8').'" alt="'.htmlspecialchars($alt, ENT_QUOTES | ENT_HTML5, 'UTF-8').'">';
    }

    /**
     * @param  mixed  $items
     */
    private static function listTag(string $tag, mixed $items): string
    {
        if (! is_array($items) || $items === []) {
            return '';
        }

        $lis = [];
        foreach ($items as $item) {
            $text = trim((string) $item);
            if ($text === '') {
                continue;
            }
            $lis[] = '<li>'.htmlspecialchars($text, ENT_QUOTES | ENT_HTML5, 'UTF-8').'</li>';
        }

        return $lis === [] ? '' : '<'.$tag.'>'.implode('', $lis).'</'.$tag.'>';
    }
}
