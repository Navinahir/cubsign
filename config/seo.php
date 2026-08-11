<?php

/**
 * Static marketing page SEO catalog (title + description).
 * Values match the existing MarketingSeo props in Vue page components.
 * Dynamic blog/help article meta lives in config/blog.php and config/help.php.
 */
return [

    'default_og_image' => '/images/og/default-og.png',
    'default_og_width' => 1200,
    'default_og_height' => 630,
    'blog_og_width' => 1200,
    'blog_og_height' => 675,

    'pages' => [
        '/' => [
            'title' => 'CubSign – Upload & Sign PDFs Online Free',
            'description' => 'CubSign is a browser-based PDF signing product. Upload a PDF, draw type or upload a signature, download the signed file, or send it for signature. Free during Early Access.',
            'type' => 'website',
        ],
        '/features' => [
            'title' => 'Features — CubSign | Free PDF Signing',
            'description' => 'Learn how CubSign self-sign, request signatures, templates, activity history, private storage, and document tracking work — with real product screenshots.',
            'type' => 'website',
        ],
        '/sign' => [
            'title' => 'Sign PDF Online Free — CubSign',
            'description' => 'Upload a PDF and sign it in your browser. Draw, type, or upload your signature with no install required. Free during CubSign Early Access.',
            'type' => 'website',
        ],
        '/pricing' => [
            'title' => 'Pricing — CubSign | Free During Early Access',
            'description' => 'CubSign is free during Early Access. Learn what guest self-sign includes, what a free account unlocks, and current limits (PDF, 25 MB).',
            'type' => 'website',
        ],
        '/faq' => [
            'title' => 'FAQ — CubSign | Free PDF Signing Help',
            'description' => 'Answers about CubSign PDF signing, guest vs account limits, security, activity history, and free Early Access.',
            'type' => 'website',
        ],
        '/about' => [
            'title' => 'About CubSign — Our Mission, Values & Story',
            'description' => 'CubSign is a browser-based PDF signing product from Cubiz Infotech. Learn why we built it, what the product does today, and what is planned.',
            'type' => 'website',
        ],
        '/security' => [
            'title' => 'Security Center — CubSign | Document & Account Protection',
            'description' => 'Learn how CubSign protects your PDFs and account: HTTPS, encryption in transit, secure document handling, authentication, Google sign-in, and responsible disclosure.',
            'type' => 'article',
            'article' => [
                'published_at' => '2025-12-01',
                'updated_at' => '2026-07-27',
                'author' => 'CubSign Product & Engineering Team',
            ],
        ],
        '/contact' => [
            'title' => 'Contact Us – CubSign',
            'description' => "Get in touch with the CubSign team. We're here to help during Early Access.",
            'type' => 'website',
        ],
        '/privacy' => [
            'title' => 'Privacy Policy – CubSign',
            'description' => 'CubSign Privacy Policy. Learn how we collect, use, and protect your personal information.',
            'type' => 'website',
        ],
        '/terms' => [
            'title' => 'Terms of Service – CubSign',
            'description' => 'CubSign Terms of Service. Read the terms governing your use of our PDF signing platform.',
            'type' => 'website',
        ],
        '/cookies' => [
            'title' => 'Cookie Policy – CubSign',
            'description' => 'Learn how CubSign uses cookies and similar technologies on our website.',
            'type' => 'website',
        ],
        '/blog' => [
            'title' => 'CubSign Blog — PDF Signing, eSignatures & Security Guides',
            'description' => 'Expert guides on signing PDFs online, electronic signatures, document security, and paperless workflows from the CubSign team.',
            'type' => 'website',
        ],
        '/help-center' => [
            'title' => 'Help Center — CubSign | PDF Signing Guides & Support',
            'description' => 'Search CubSign Help Center articles on uploading PDFs, signing documents, accounts, security, and troubleshooting. Free PDF signing support and FAQs.',
            'type' => 'website',
        ],
    ],

];
