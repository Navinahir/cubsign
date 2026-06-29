<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'CubSign') }}</title>

        <meta name="description" content="Upload your PDF and sign it online in seconds. Add your signature and download the finished document. No account required.">
        <meta name="robots" content="index, follow">
        <meta property="og:site_name" content="CubSign">
        <meta name="twitter:card" content="summary_large_image">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="apple-touch-icon" href="/favicon.svg">
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
