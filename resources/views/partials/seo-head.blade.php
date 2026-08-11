@php
    /** @var array<string, mixed>|null $seo */
    $seo = $seo ?? \App\Support\SeoMeta::forBlade($page ?? [], request());
@endphp

@if ($seo)
    <title inertia>{{ $seo['title'] }}</title>

    <meta head-key="description" name="description" content="{{ $seo['description'] }}">
    <link head-key="canonical" rel="canonical" href="{{ $seo['canonical'] }}">

    <meta head-key="og:type" property="og:type" content="{{ $seo['og']['type'] }}">
    <meta head-key="og:site_name" property="og:site_name" content="{{ $seo['og']['site_name'] }}">
    <meta head-key="og:title" property="og:title" content="{{ $seo['og']['title'] }}">
    <meta head-key="og:description" property="og:description" content="{{ $seo['og']['description'] }}">
    <meta head-key="og:url" property="og:url" content="{{ $seo['og']['url'] }}">
    <meta head-key="og:image" property="og:image" content="{{ $seo['og']['image'] }}">
    @if (!empty($seo['og']['image_width']))
        <meta head-key="og:image:width" property="og:image:width" content="{{ $seo['og']['image_width'] }}">
    @endif
    @if (!empty($seo['og']['image_height']))
        <meta head-key="og:image:height" property="og:image:height" content="{{ $seo['og']['image_height'] }}">
    @endif
    @if (!empty($seo['og']['article_published_time']))
        <meta head-key="article:published_time" property="article:published_time" content="{{ $seo['og']['article_published_time'] }}">
    @endif
    @if (!empty($seo['og']['article_modified_time']))
        <meta head-key="article:modified_time" property="article:modified_time" content="{{ $seo['og']['article_modified_time'] }}">
    @endif
    @if (!empty($seo['og']['article_author']))
        <meta head-key="article:author" property="article:author" content="{{ $seo['og']['article_author'] }}">
    @endif

    <meta head-key="twitter:card" name="twitter:card" content="{{ $seo['twitter']['card'] }}">
    <meta head-key="twitter:title" name="twitter:title" content="{{ $seo['twitter']['title'] }}">
    <meta head-key="twitter:description" name="twitter:description" content="{{ $seo['twitter']['description'] }}">
    <meta head-key="twitter:image" name="twitter:image" content="{{ $seo['twitter']['image'] }}">
@else
    <title inertia>{{ config('app.name', 'CubSign') }}</title>
    <meta head-key="og:site_name" property="og:site_name" content="CubSign">
    <meta head-key="twitter:card" name="twitter:card" content="summary_large_image">
@endif
