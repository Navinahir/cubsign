<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @include('partials.seo-head')
        @include('partials.seo-schema')

        <meta head-key="robots" name="robots" content="{{ \App\Support\SeoRobots::forBlade($page ?? [], request()) }}">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
        @unless(request()->routeIs(
            'overview',
            'documents.*',
            'templates.*',
            'profile.*',
            'recipient.*',
            'sign.sent',
            'sign.save',
        ))
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-8864815130887951" crossorigin="anonymous"></script>
        @endunless
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
