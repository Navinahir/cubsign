<?php

/**
 * Static marketing page SEO catalog (title + description).
 * Values match the existing MarketingSeo props in Vue page components.
 * Dynamic blog/help article meta lives in config/blog.php and config/help.php.
 *
 * FAQ / breadcrumb entries must match visible page content only.
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
            'description' => 'Learn how CubSign self-sign, request signatures, templates, activity history, private storage, and document tracking work, with real product screenshots.',
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
            'type' => 'website',
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

    'breadcrumbs' => [
        '/about' => [
            ['name' => 'Home', 'url' => '/'],
            ['name' => 'About', 'url' => '/about'],
        ],
        '/security' => [
            ['name' => 'Home', 'url' => '/'],
            ['name' => 'Security', 'url' => '/security'],
        ],
        '/faq' => [
            ['name' => 'Home', 'url' => '/'],
            ['name' => 'FAQ', 'url' => '/faq'],
        ],
    ],

    'faqs' => [
        '/' => [
            [
                'question' => 'Is CubSign free to use?',
                'answer' => 'Yes. CubSign is free during Early Access. No credit card is required. Guest users can complete one self-sign session without an account; a free account unlocks storage, templates, and send-for-signature.',
            ],
            [
                'question' => 'What happens after I upload a PDF?',
                'answer' => 'CubSign opens the signing editor. You place fields (signature, initials, name, text, date, or checkbox), create a signature by drawing, typing, or uploading an image, then download the signed PDF or, with an account, send it to recipients.',
            ],
            [
                'question' => 'Do I need to create an account to sign?',
                'answer' => 'Not for a single self-sign session. You can upload a PDF, sign it, and download the result without registering. After that guest session, create a free account to continue. An account also unlocks document storage, templates, and email invitations.',
            ],
            [
                'question' => 'How does CubSign protect documents?',
                'answer' => 'Traffic uses HTTPS. Stored files live on private server storage with access limited to the document owner and invited recipients. Read the Security Center for details on authentication, passwords, and responsible disclosure.',
            ],
            [
                'question' => 'Can I sign documents on mobile?',
                'answer' => 'Yes. CubSign runs in modern browsers on desktop, tablet, and phone. You can draw a signature with a finger or stylus on touch devices.',
            ],
        ],
        '/about' => [
            [
                'question' => 'What is CubSign?',
                'answer' => 'CubSign is an online PDF signing product. Upload a PDF in your browser, place a signature (draw, type, or upload an image), then download the signed file or send it to others for signature. No software install required.',
            ],
            [
                'question' => 'Who builds CubSign?',
                'answer' => 'CubSign is built by Cubiz Infotech. The Product & Engineering team ships the signing editor, workspace, and public site, and improves the product during Early Access from real user feedback.',
            ],
            [
                'question' => 'Why was CubSign created?',
                'answer' => 'Printing, signing, scanning, and emailing PDFs is slow for everyday agreements. CubSign was built so freelancers, small teams, and growing businesses can finish that workflow in the browser without enterprise complexity.',
            ],
            [
                'question' => 'Is CubSign free?',
                'answer' => 'Yes. CubSign is free during Early Access. No credit card is required. Guest users can complete one self-sign session; a free account unlocks storage, templates, and send-for-signature.',
            ],
            [
                'question' => 'Do I need to create an account?',
                'answer' => 'Not for a single self-sign session. Upload, sign, and download without registering. Create a free account for document storage, templates, multi-recipient sends, and continued signing after the guest limit.',
            ],
            [
                'question' => 'Are electronic signatures on CubSign legally valid?',
                'answer' => 'Electronic signatures are widely recognized when parties intend to sign and consent to transact electronically. CubSign captures signatures and related activity for sent documents; you remain responsible for fitness for your documents and jurisdiction.',
            ],
            [
                'question' => 'How does CubSign keep documents secure?',
                'answer' => 'Documents travel over HTTPS. Files are stored on private server storage with access limited to owners and invited recipients. Passwords are hashed. Details are on the Security Center and Privacy Policy.',
            ],
            [
                'question' => 'Does CubSign work on mobile devices?',
                'answer' => 'Yes. CubSign runs in modern browsers on desktop, tablet, and phone, including drawing a signature on a touch screen.',
            ],
            [
                'question' => 'Do I need to install any software?',
                'answer' => 'No. CubSign is browser-based. Open the site, upload your PDF, and start signing.',
            ],
            [
                'question' => 'How can I contact the CubSign team?',
                'answer' => 'Visit the Contact page or email support@cubsign.com. During Early Access we read every message.',
            ],
        ],
        '/security' => [
            [
                'question' => 'Is CubSign served over HTTPS?',
                'answer' => 'Yes. All CubSign pages and signing workflows use HTTPS. Traffic between your browser and our servers is encrypted with TLS.',
            ],
            [
                'question' => 'Are my uploaded PDFs encrypted?',
                'answer' => 'Documents are transmitted over HTTPS (encrypted in transit). Stored files are kept on secure cloud infrastructure with access controls. See our Privacy Policy for storage and retention details.',
            ],
            [
                'question' => 'Do recipients need an account to sign?',
                'answer' => 'No. Recipients sign through a unique HTTPS link sent to their email. They do not need to create a CubSign account.',
            ],
            [
                'question' => 'How are passwords stored?',
                'answer' => 'Passwords are hashed using one-way hashing before storage. CubSign never stores passwords in plain text.',
            ],
            [
                'question' => 'Can I sign in with Google?',
                'answer' => 'Yes. CubSign supports Google OAuth sign-in. Your Google password is never shared with CubSign.',
            ],
            [
                'question' => 'How do I report a security issue?',
                'answer' => 'Email security@cubsign.com with a description of the vulnerability and steps to reproduce. Please allow time for us to investigate before public disclosure.',
            ],
            [
                'question' => 'Can I delete my documents?',
                'answer' => 'Yes. Document owners can delete files from their workspace. Deletion is permanent as described in our Privacy Policy.',
            ],
            [
                'question' => 'Where can I read more about privacy?',
                'answer' => 'Our Privacy Policy at /privacy covers data collection, retention, cookies, and your rights. The Cookie Policy at /cookies explains session and analytics cookies.',
            ],
        ],
        '/help-center' => [
            [
                'question' => 'Is CubSign free to use?',
                'answer' => 'Yes. CubSign is free during Early Access. No credit card is required to upload, sign, or send PDFs for signature.',
            ],
            [
                'question' => 'Do I need an account to sign a PDF?',
                'answer' => 'You can complete one guest self-sign session without an account. After that, create a free account to continue signing and to unlock storage, templates, and send-for-signature.',
            ],
            [
                'question' => 'What file types does CubSign support?',
                'answer' => 'PDF files only, up to 25 MB per upload. Export Word, Excel, or images to PDF before uploading.',
            ],
            [
                'question' => 'Are electronic signatures legally binding?',
                'answer' => 'They are often recognized under ESIGN, UETA, and eIDAS when requirements are met, but outcomes vary by document and jurisdiction. CubSign provides tools and activity records, not legal advice.',
            ],
            [
                'question' => 'How do I reset my password?',
                'answer' => 'On Login, choose Forgot password, enter your email, and follow the reset link. Google Login users should use Continue with Google instead.',
            ],
            [
                'question' => 'Can recipients sign without an account?',
                'answer' => 'Yes. Recipients open the email link and sign at /r/{token} without registering.',
            ],
            [
                'question' => 'How do I contact support?',
                'answer' => 'Email support@cubsign.com or use the Contact page. Include the error message, browser, device, and steps you took.',
            ],
            [
                'question' => 'Is my document private?',
                'answer' => 'Documents are private by default. Only you and invited recipients with valid links can access them. You can delete documents from your workspace.',
            ],
        ],
        '/pricing' => [
            [
                'question' => 'Why is CubSign free right now?',
                'answer' => 'CubSign is in Early Access. We are collecting feedback on the real signing workflows people use before introducing paid plans. No credit card is required.',
            ],
            [
                'question' => 'Will CubSign always be free?',
                'answer' => 'CubSign is free during Early Access while we validate the product. Paid plans may be introduced later. If that happens, Early Access users will get advance notice. There is no billing system today.',
            ],
            [
                'question' => 'Are there hidden limits during Early Access?',
                'answer' => 'Uploads must be PDF files up to 25 MB. Guests can finish one self-sign session without registering. Account features (storage, templates, send-for-signature) require a verified free account. We do not sell tiers or add-ons during Early Access.',
            ],
            [
                'question' => 'Do I need a credit card?',
                'answer' => 'No. Create a free account or start a guest self-sign from Upload PDF. There is nothing to cancel because there is no subscription.',
            ],
            [
                'question' => 'What happens when paid plans launch?',
                'answer' => 'We will notify account holders in advance. Your existing documents remain accessible under the Privacy Policy. Preferential options for Early Access users may be offered, but no prices or plan names are published yet.',
            ],
        ],
        '/faq' => [
            [
                'question' => 'What is CubSign?',
                'answer' => 'CubSign is a browser-based PDF signing product. Upload a PDF, place a signature (draw, type, or upload an image), download the signed file, or send it to others for signature. No software installation required.',
            ],
            [
                'question' => 'Do I need to create an account?',
                'answer' => 'You can complete one self-sign session without an account. Creating a free account unlocks continued signing, document storage, templates, send-for-signature, and activity history.',
            ],
            [
                'question' => 'Is CubSign free to use?',
                'answer' => 'Yes. CubSign is free during Early Access. No credit card is required.',
            ],
            [
                'question' => 'Why is CubSign free?',
                'answer' => 'We are in Early Access and collecting feedback on real signing workflows before introducing paid plans. No plans or prices are published yet.',
            ],
            [
                'question' => 'What file formats are supported?',
                'answer' => 'CubSign accepts PDF files only, up to 25 MB per upload.',
            ],
            [
                'question' => 'How do I sign a document?',
                'answer' => 'Go to Upload PDF, choose a PDF, open the editor, place fields (signature, initials, name, text, date, or checkbox), create your signature, then download. Account holders can also send the document for others to sign.',
            ],
            [
                'question' => 'What types of signatures are supported?',
                'answer' => 'Draw on a canvas, type in a signature-style font, or upload a signature image. The signature applies to the current document session; CubSign does not offer a permanent cross-document signature vault.',
            ],
            [
                'question' => 'How do I send a document for someone else to sign?',
                'answer' => 'Sign in, upload or open a PDF, add recipient email addresses, place fields for each signer, and send. Each recipient gets a unique email link and can sign without a CubSign account.',
            ],
            [
                'question' => 'Do recipients need a CubSign account to sign?',
                'answer' => 'No. Recipients open a unique signing link from email and complete their fields without registering.',
            ],
            [
                'question' => 'Are my documents secure?',
                'answer' => 'Traffic uses HTTPS. Account documents are stored on private server storage with access limited to owners and invited recipients. See the Security Center for authentication, passwords, and disclosure. CubSign does not claim AES-256 encryption at rest.',
            ],
            [
                'question' => 'Are CubSign signatures legally binding?',
                'answer' => 'Electronic signatures are widely recognized when parties intend to sign and consent to transact electronically. CubSign helps you capture signatures and related activity for sent documents. You remain responsible for whether an e-signature is appropriate for your document and jurisdiction. CubSign does not provide legal advice.',
            ],
            [
                'question' => 'What is the activity history (audit trail)?',
                'answer' => 'For documents you send, CubSign logs key events such as invitations, recipient signatures, and completion, with timestamps in your workspace. The user-facing activity history does not claim page-view logging or IP addresses.',
            ],
            [
                'question' => 'Can I delete my documents?',
                'answer' => 'Yes. Account holders can delete documents from the workspace. Deletion follows the Privacy Policy.',
            ],
            [
                'question' => "What's included during early access?",
                'answer' => 'Self-sign, guest one-session signing, account storage, templates, multi-recipient send, activity history, and PDF downloads are all free. Limits: PDF only, 25 MB, guest one session.',
            ],
            [
                'question' => 'Will CubSign always be free?',
                'answer' => 'CubSign is free during Early Access. Paid plans may come later with advance notice. There is no billing today and nothing to cancel.',
            ],
            [
                'question' => 'When will paid plans be available?',
                'answer' => 'No launch date is published. Account holders will be notified before any paid plans begin.',
            ],
            [
                'question' => 'Do I need a credit card?',
                'answer' => 'No. Early Access requires no credit card.',
            ],
        ],
    ],

];
