/** Security Center content, /security */

export const securityArticleMeta = {
    title: 'CubSign Security Center',
    excerpt:
        'How CubSign protects your documents and account: HTTPS, encryption in transit, secure document handling, authentication options, and responsible disclosure.',
    author: { name: 'CubSign Team' },
    publishedAt: '2025-12-01',
    updatedAt: '2026-07-27',
    keywords: [
        'cubsign security',
        'pdf signing security',
        'electronic signature security',
        'document encryption',
        'secure pdf signing',
    ],
};

export const securitySections = [
    {
        slug: 'https',
        title: 'HTTPS',
        description: 'Every connection to CubSign is encrypted before data leaves your browser.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        paragraphs: [
            'CubSign is served exclusively over HTTPS. When you upload a PDF, sign a document, or manage your account, traffic between your browser and our servers is encrypted using TLS (Transport Layer Security).',
            'HTTPS helps prevent third parties on the same network from reading or modifying requests in transit. You should always verify the address bar shows a valid HTTPS connection when signing sensitive documents.',
        ],
        bullets: [
            'All public pages and signing workflows use HTTPS',
            'Session cookies are transmitted only over secure connections',
            'HTTP requests are redirected to HTTPS where applicable',
        ],
    },
    {
        slug: 'encryption-in-transit',
        title: 'Encryption in transit',
        description: 'Documents and account data are protected while moving between your device and CubSign.',
        icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
        paragraphs: [
            'Encryption in transit means data is scrambled while it travels across the internet. CubSign uses TLS for every request, including PDF uploads, signature submissions, and API calls from the signing editor.',
            'Recipient signing links also use HTTPS, so documents sent for signature are protected the same way as documents you sign yourself.',
        ],
        bullets: [
            'PDF uploads and downloads travel over encrypted connections',
            'Signing invitations and recipient sessions use HTTPS',
            'Email notifications link to HTTPS signing pages only',
        ],
    },
    {
        slug: 'secure-document-handling',
        title: 'Secure document handling',
        description: 'How uploaded PDFs are stored, accessed, and removed.',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        paragraphs: [
            'When you upload a PDF to CubSign, the file is stored on secure cloud infrastructure with access limited to authorized users and invited recipients. Document owners control who can view or sign each file.',
            'You can delete documents from your workspace at any time. Deleted documents are removed from active storage as described in our Privacy Policy.',
        ],
        bullets: [
            'Documents are accessible only to the account owner and invited recipients',
            'Signing links are unique per recipient and tied to a specific document',
            'Workspace owners can delete documents when they are no longer needed',
            'Activity events (views, signatures) are logged for audit purposes',
        ],
    },
    {
        slug: 'authentication',
        title: 'Authentication',
        description: 'How CubSign verifies who is accessing an account or signing a document.',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        paragraphs: [
            'CubSign supports email-and-password accounts and Google sign-in. Email verification is required before accessing workspace features, which helps confirm that account holders control the email address on file.',
            'Recipients who sign via a secure link do not need a CubSign account. Each signing invitation is tied to a specific email address and document.',
        ],
        bullets: [
            'Email verification required for full workspace access',
            'Session-based authentication with secure cookies',
            'Recipients authenticate via unique per-document signing links',
            'Sign-out is available from account settings at any time',
        ],
    },
    {
        slug: 'password-protection',
        title: 'Password protection',
        description: 'How passwords are stored and how you can keep your account secure.',
        icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
        paragraphs: [
            'If you register with email and password, your password is never stored in plain text. CubSign hashes passwords using industry-standard one-way hashing before they are saved.',
            'You can reset a forgotten password through a secure, time-limited link sent to your registered email. Password changes require your current password when logged in.',
        ],
        bullets: [
            'Passwords are hashed, not stored as readable text',
            'Password reset links expire after a limited time',
            'Account deletion requires password confirmation',
            'Use a unique, strong password you do not reuse elsewhere',
        ],
    },
    {
        slug: 'google-authentication',
        title: 'Google authentication',
        description: 'Sign in with Google as an alternative to email and password.',
        icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9',
        paragraphs: [
            'CubSign supports Google sign-in through OAuth. When you choose “Continue with Google,” you are redirected to Google to authenticate. CubSign receives only the profile information Google shares, typically your name and email address.',
            'CubSign does not receive or store your Google password. If you previously registered with email and password and want to link Google sign-in to the same address, contact support before connecting accounts to avoid duplicates.',
        ],
        bullets: [
            'OAuth flow handled by Google. CubSign never sees your Google password',
            'Google accounts must use a verified email address',
            'You can sign out of CubSign without affecting your Google account',
        ],
    },
    {
        slug: 'privacy-practices',
        title: 'Privacy practices',
        description: 'How security and privacy work together at CubSign.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        paragraphs: [
            'Security and privacy are related but distinct. CubSign collects only the data needed to provide the signing service, account details, uploaded documents, and support communications. We do not sell personal data.',
            'For full details on what we collect, how long we retain it, and your rights, read our Privacy Policy and Cookie Policy.',
        ],
        bullets: [
            'Data collection is limited to operating the service',
            'Documents are not used for advertising or sold to third parties',
            'You can request account or document deletion',
            'Privacy Policy describes retention and your rights by jurisdiction',
        ],
    },
    {
        slug: 'responsible-disclosure',
        title: 'Responsible disclosure',
        description: 'How to report a security concern to the CubSign team.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        paragraphs: [
            'If you believe you have found a security vulnerability in CubSign, we want to hear from you. Please report it responsibly so we can investigate and address it before public disclosure.',
            'Email security@cubsign.com with a clear description of the issue, steps to reproduce, and the impact you believe it has. Include enough detail for us to verify the report, but do not access or modify data that does not belong to you.',
        ],
        bullets: [
            'Report to security@cubsign.com. Do not post vulnerabilities publicly first',
            'Give us reasonable time to investigate and fix confirmed issues',
            'Do not exploit vulnerabilities beyond what is needed to demonstrate the issue',
            'We will acknowledge receipt and follow up when we have more information',
        ],
    },
];

export const securityFaqs = [
    {
        question: 'Is CubSign served over HTTPS?',
        answer: 'Yes. All CubSign pages and signing workflows use HTTPS. Traffic between your browser and our servers is encrypted with TLS.',
    },
    {
        question: 'Are my uploaded PDFs encrypted?',
        answer: 'Documents are transmitted over HTTPS (encrypted in transit). Stored files are kept on secure cloud infrastructure with access controls. See our Privacy Policy for storage and retention details.',
    },
    {
        question: 'Do recipients need an account to sign?',
        answer: 'No. Recipients sign through a unique HTTPS link sent to their email. They do not need to create a CubSign account.',
    },
    {
        question: 'How are passwords stored?',
        answer: 'Passwords are hashed using one-way hashing before storage. CubSign never stores passwords in plain text.',
    },
    {
        question: 'Can I sign in with Google?',
        answer: 'Yes. CubSign supports Google OAuth sign-in. Your Google password is never shared with CubSign.',
    },
    {
        question: 'How do I report a security issue?',
        answer: 'Email security@cubsign.com with a description of the vulnerability and steps to reproduce. Please allow time for us to investigate before public disclosure.',
    },
    {
        question: 'Can I delete my documents?',
        answer: 'Yes. Document owners can delete files from their workspace. Deletion is permanent as described in our Privacy Policy.',
    },
    {
        question: 'Where can I read more about privacy?',
        answer: 'Our Privacy Policy at /privacy covers data collection, retention, cookies, and your rights. The Cookie Policy at /cookies explains session and analytics cookies.',
    },
];

export const securityRelatedLinks = [
    { label: 'Privacy Policy', routeName: 'privacy' },
    { label: 'Cookie Policy', routeName: 'cookies' },
    { label: 'Terms of Service', routeName: 'terms' },
    { label: 'Help Center', routeName: 'help-center' },
    { label: 'Contact', routeName: 'contact' },
];
