/** Shared marketing copy, keep messaging consistent across public pages. */
export const EARLY_ACCESS_HEADLINE = 'Free During Early Access';

export const EARLY_ACCESS_SUBHEADLINE =
    'Use CubSign completely free while we improve the platform based on user feedback.';

export const CTA_START_SIGNING = 'Start Signing Free';
export const CTA_START_SIGNING_PDFS = 'Start Signing PDFs';
export const CTA_TRY_CUBSIGN = 'Try CubSign Free';
export const CTA_UPLOAD_PDF = 'SIGN PDF';
/** @deprecated Use CTA_UPLOAD_PDF */
export const CTA_SIGN_PDF_NOW = 'SIGN PDF';
export const CTA_CREATE_ACCOUNT = 'Create Free Account';
export const CTA_NAV_REGISTER = 'Get Started Free';

/** Reusable Tailwind class strings for marketing CTAs */
export const btnPrimary =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30';

export const btnSecondary =
    'inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow-md';

export const pageHeaderClass =
    'bg-gradient-to-b from-white to-gray-50 px-4 py-20 text-center sm:px-6 lg:px-8';

export const sectionPadding = 'px-4 py-24 sm:px-6 lg:px-8';

export const cardClass =
    'rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md';

export const floatingTrustItems = [
    'PDF signing in the browser',
    'No credit card required',
    'Free during Early Access',
];

export const credibilityCards = [
    {
        title: 'HTTPS in transit',
        description: 'Uploads, signing sessions, and downloads travel over HTTPS so documents are encrypted while moving between your browser and CubSign.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
    {
        title: 'Activity history',
        description: 'Sent documents log key events such as invitations, recipient signatures, and completion with timestamps in your workspace.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
        title: 'Document tracking',
        description: 'See who has signed, who is still pending, and when a multi-recipient document was completed.',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
        title: 'Electronic signatures',
        description: 'Draw, type, or upload a signature and place it on the PDF. You remain responsible for using e-signatures appropriately for your documents and jurisdiction.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
        title: 'Email invitations',
        description: 'Recipients get a unique signing link by email. They can sign without creating a CubSign account.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
];

export const journeySteps = [
    { title: 'Upload', description: 'Choose a PDF up to 25 MB.' },
    { title: 'Prepare', description: 'Add signature, initials, name, text, date, or checkbox fields.' },
    { title: 'Sign', description: 'Draw, type, or upload your signature image.' },
    { title: 'Send', description: 'Invite recipients with unique email links (account required).' },
    { title: 'Track', description: 'Watch pending and signed status in your workspace.' },
    { title: 'Download', description: 'Save the finished signed PDF.' },
];

export const APP_VERSION = '0.13.2';

export const SUPPORT_EMAIL = 'support@cubsign.com';

export const companyValues = [
    {
        title: 'Simplicity',
        description: 'Sign documents in minutes without training, cluttered menus, or complicated setup.',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
        title: 'Security',
        description: 'Documents travel over HTTPS and are handled with careful access controls at every step.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
    {
        title: 'Privacy',
        description: 'We collect only what we need to run the product. Your documents are never sold or shared for advertising.',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
        title: 'Reliability',
        description: 'A focused signing workflow you can depend on: upload, sign, send, and download without friction.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
        title: 'Customer First',
        description: 'We listen to real signing workflows and ship improvements based on feedback, not assumptions about what users need.',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    },
];

export const aboutMissionStatement =
    'Make secure, browser-based PDF signing accessible to everyone without printing, enterprise contracts, or software to install.';

export const aboutVisionStatement =
    'A trusted platform for everyday document workflows, where signing is fast, clear, and dependable for freelancers, teams, and growing businesses.';

export const aboutMissionPoints = [
    {
        title: 'Simplify document signing',
        description: 'Replace the print-sign-scan loop with a clear, browser-based workflow anyone can finish quickly.',
    },
    {
        title: 'Eliminate printing and scanning',
        description: 'Keep agreements digital from the first upload to the final signed PDF with no paper trail required.',
    },
    {
        title: 'Make secure eSignatures accessible',
        description: 'Offer a trustworthy signing experience without enterprise contracts or software to install.',
    },
];

export const aboutWhyChoose = [
    {
        title: 'Secure signing',
        description: 'Encrypted connections and careful document handling so every signature stays protected in transit.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
    {
        title: 'Fast workflow',
        description: 'Upload a PDF, place your signature, and download or send for signature without extra steps.',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
        title: 'Modern interface',
        description: 'A clean editor built for focus: place fields, sign, and review without fighting the UI.',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
        title: 'Cross-device compatibility',
        description: 'Works in modern browsers on desktop, tablet, and phone so you can sign wherever you are.',
        icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
    {
        title: 'No software installation',
        description: 'Open CubSign in your browser and start signing. Nothing to download or maintain.',
        icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    },
];

export const aboutHowItWorks = [
    {
        step: 1,
        title: 'Upload',
        description: 'Drop your PDF into CubSign. No account required to get started.',
        icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
    },
    {
        step: 2,
        title: 'Sign',
        description: 'Draw, type, or upload your signature and place it on the document.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    },
    {
        step: 3,
        title: 'Download',
        description: 'Save the signed PDF instantly, or send it to others for signature.',
        icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V16.5',
    },
];

export const aboutTechnology = [
    {
        title: 'Modern web technologies',
        description: 'A responsive web app built with current frontend and backend tooling for a fast, reliable experience.',
    },
    {
        title: 'Secure encrypted connections',
        description: 'All traffic uses HTTPS so documents and account data stay protected between your device and our servers.',
    },
    {
        title: 'Responsive design',
        description: 'Layouts adapt to phones, tablets, and desktops so signing stays clear on every screen size.',
    },
    {
        title: 'Reliable cloud infrastructure',
        description: 'Documents and accounts run on cloud infrastructure designed for availability and secure storage.',
    },
];

export const aboutPrivacyPoints = [
    {
        title: 'Limited data collection',
        description: 'We collect only what is needed to run the service, account details, uploaded documents, and support messages. We do not sell personal data.',
    },
    {
        title: 'Controlled document access',
        description: 'Uploaded PDFs are accessible to you and the recipients you invite. You can delete documents from your workspace at any time.',
    },
    {
        title: 'Encrypted connections',
        description: 'Traffic between your browser and CubSign uses HTTPS. How files are stored and retained is described in our Privacy Policy.',
    },
];

/** Roadmap milestones, status is "completed" or "planned" only. */
export const aboutTimeline = [
    {
        year: '2025',
        title: 'CubSign founded',
        description: 'Started from the frustration of printing, signing, scanning, and emailing documents.',
        status: 'completed',
    },
    {
        year: '2025',
        title: 'Core signing MVP',
        description: 'Browser-based PDF upload, signature placement, and signed PDF download.',
        status: 'completed',
    },
    {
        year: '2025',
        title: 'Early Access launch',
        description: 'Opened CubSign free to early users while gathering product feedback.',
        status: 'completed',
    },
    {
        year: '2026',
        title: 'Templates & multi-recipient workflows',
        description: 'Reusable templates, send-for-signature flows, and document status tracking.',
        status: 'completed',
    },
    {
        year: '2026',
        title: 'Deeper audit trail insights',
        description: 'Clearer signing history and activity detail for completed documents.',
        status: 'planned',
    },
    {
        year: '2026',
        title: 'Team collaboration features',
        description: 'Shared workspaces and role-friendly document management for growing teams.',
        status: 'planned',
    },
];

export const aboutFaqs = [
    {
        question: 'What is CubSign?',
        answer: 'CubSign is an online PDF signing product. Upload a PDF in your browser, place a signature (draw, type, or upload an image), then download the signed file or send it to others for signature. No software install required.',
    },
    {
        question: 'Who builds CubSign?',
        answer: 'CubSign is built by Cubiz Infotech. The Product & Engineering team ships the signing editor, workspace, and public site, and improves the product during Early Access from real user feedback.',
    },
    {
        question: 'Why was CubSign created?',
        answer: 'Printing, signing, scanning, and emailing PDFs is slow for everyday agreements. CubSign was built so freelancers, small teams, and growing businesses can finish that workflow in the browser without enterprise complexity.',
    },
    {
        question: 'Is CubSign free?',
        answer: 'Yes. CubSign is free during Early Access. No credit card is required. Guest users can complete one self-sign session; a free account unlocks storage, templates, and send-for-signature.',
    },
    {
        question: 'Do I need to create an account?',
        answer: 'Not for a single self-sign session. Upload, sign, and download without registering. Create a free account for document storage, templates, multi-recipient sends, and continued signing after the guest limit.',
    },
    {
        question: 'Are electronic signatures on CubSign legally valid?',
        answer: 'Electronic signatures are widely recognized when parties intend to sign and consent to transact electronically. CubSign captures signatures and related activity for sent documents; you remain responsible for fitness for your documents and jurisdiction.',
    },
    {
        question: 'How does CubSign keep documents secure?',
        answer: 'Documents travel over HTTPS. Files are stored on private server storage with access limited to owners and invited recipients. Passwords are hashed. Details are on the Security Center and Privacy Policy.',
    },
    {
        question: 'Does CubSign work on mobile devices?',
        answer: 'Yes. CubSign runs in modern browsers on desktop, tablet, and phone, including drawing a signature on a touch screen.',
    },
    {
        question: 'Do I need to install any software?',
        answer: 'No. CubSign is browser-based. Open the site, upload your PDF, and start signing.',
    },
    {
        question: 'How can I contact the CubSign team?',
        answer: 'Visit the Contact page or email support@cubsign.com. During Early Access we read every message.',
    },
];

export const socialStats = [
    { value: 'Free', label: 'During Early Access' },
    { value: 'HTTPS', label: 'Encrypted in transit' },
    { value: 'Browser', label: 'Desktop and mobile' },
];

/** Audience labels for homepage use cases — not customer logos or testimonials. */
export const audienceUseCases = [
    { name: 'Freelancers', initials: 'FL', example: 'Client contracts and invoices' },
    { name: 'Agencies', initials: 'AG', example: 'Proposals and vendor forms' },
    { name: 'HR', initials: 'HR', example: 'Offer letters and onboarding PDFs' },
    { name: 'Legal ops', initials: 'LG', example: 'NDAs and agreements' },
    { name: 'Real estate', initials: 'RE', example: 'Listing and closing paperwork' },
    { name: 'Startups', initials: 'ST', example: 'Founder and contractor docs' },
];

/** @deprecated Prefer audienceUseCases — kept for any remaining imports. */
export const customerLogos = audienceUseCases;

export const heroTrustBadges = [
    'Guest self-sign available',
    'PDF up to 25 MB',
    'HTTPS in transit',
    'Free during Early Access',
];

export const homeComparisonCubsign = [
    'Guest self-sign without an account',
    'Account storage for signed PDFs',
    'Send to multiple recipients',
    'Draw, type, or upload a signature',
    'Private document storage with access controls',
    'Activity history on sent documents',
    'Free during Early Access',
];

export const homeComparisonOthers = [
    'Paid subscription required',
    'Signature or envelope limits',
    'Account required to start',
    'Complex enterprise setup',
    'Print-sign-scan workflow',
];

export const pricingTrustBadges = [
    'Account signing included',
    'Send for signature included',
    'No credit card',
    'Free Early Access',
];

export const homeFaqs = [
    {
        question: 'Is CubSign free to use?',
        answer: 'Yes. CubSign is free during Early Access. No credit card is required. Guest users can complete one self-sign session without an account; a free account unlocks storage, templates, and send-for-signature.',
    },
    {
        question: 'What happens after I upload a PDF?',
        answer: 'CubSign opens the signing editor. You place fields (signature, initials, name, text, date, or checkbox), create a signature by drawing, typing, or uploading an image, then download the signed PDF or, with an account, send it to recipients.',
    },
    {
        question: 'Do I need to create an account to sign?',
        answer: 'Not for a single self-sign session. You can upload a PDF, sign it, and download the result without registering. After that guest session, create a free account to continue. An account also unlocks document storage, templates, and email invitations.',
    },
    {
        question: 'How does CubSign protect documents?',
        answer: 'Traffic uses HTTPS. Stored files live on private server storage with access limited to the document owner and invited recipients. Read the Security Center for details on authentication, passwords, and responsible disclosure.',
    },
    {
        question: 'Can I sign documents on mobile?',
        answer: 'Yes. CubSign runs in modern browsers on desktop, tablet, and phone. You can draw a signature with a finger or stylus on touch devices.',
    },
];

export const homePricingComparison = [
    { feature: 'Guest self-sign (one session)', cubsign: true, others: false },
    { feature: 'No credit card required', cubsign: true, others: false },
    { feature: 'Free during Early Access', cubsign: true, others: false },
];

export const pricingComparison = [
    { feature: 'Guest self-sign available', cubsign: true, others: false },
    { feature: 'No credit card required', cubsign: true, others: false },
    { feature: 'Activity history on sent docs', cubsign: true, others: true },
    { feature: 'Multi-recipient signing', cubsign: true, others: true },
    { feature: 'Free during Early Access', cubsign: true, others: false },
];

export const footerLinks = {
    product: [
        { label: 'Features', routeName: 'features' },
        { label: 'Pricing', routeName: 'pricing' },
        { label: 'Upload PDF', routeName: 'sign.index' },
        { label: 'FAQ', routeName: 'faq' },
    ],
    company: [
        { label: 'About', routeName: 'about' },
        { label: 'Blog', routeName: 'blog' },
        { label: 'Contact', routeName: 'contact' },
    ],
    legal: [
        { label: 'Privacy Policy', routeName: 'privacy' },
        { label: 'Terms', routeName: 'terms' },
        { label: 'Cookie Policy', routeName: 'cookies' },
    ],
    resources: [
        { label: 'Help Center', routeName: 'help-center' },
        { label: 'Security Center', routeName: 'security' },
        { label: 'RSS Feed', href: '/rss.xml', sameTab: true },
        { label: 'Sitemap', href: '/sitemap.xml', sameTab: true },
    ],
};
