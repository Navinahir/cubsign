@php
    /** @var array<string, mixed>|null $seo */
    $seo = $seo ?? \App\Support\SeoMeta::forBlade($page ?? [], request());
    $schemas = is_array($seo['schemas'] ?? null) ? $seo['schemas'] : [];
    $schemaKeys = [
        'organization' => 'org-schema',
        'website' => 'website-schema',
        'faq' => 'faq-schema',
        'breadcrumb' => 'breadcrumb-schema',
        'article' => 'article-schema',
    ];
@endphp

@foreach ($schemaKeys as $key => $headKey)
    @if (!empty($schemas[$key]) && is_array($schemas[$key]))
        <script head-key="{{ $headKey }}" type="application/ld+json">{!! json_encode($schemas[$key], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS) !!}</script>
    @endif
@endforeach
