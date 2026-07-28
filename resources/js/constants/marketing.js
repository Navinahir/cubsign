/** Shared marketing copy — keep messaging consistent across public pages. */
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
    'Secure PDF Signing',
    'No Credit Card Required',
    'Free During Early Access',
];

export const credibilityCards = [
    {
        title: 'Security',
        description: 'HTTPS encryption in transit and secure cloud storage for every document you upload.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
    {
        title: 'Audit Trail',
        description: 'Every view, sign, and send event is logged with timestamps for legal defensibility.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
        title: 'Document Tracking',
        description: 'See who has signed, who is pending, and when each document was completed.',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
        title: 'Legally Binding Signatures',
        description: 'Electronic signatures with identity evidence that meet widely accepted e-sign standards.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
        title: 'Email Notifications',
        description: 'Recipients get secure signing links. You are notified the moment documents are completed.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
];

export const journeySteps = [
    { title: 'Upload', description: 'Drop your PDF and start instantly.' },
    { title: 'Prepare', description: 'Add fields, dates, and text boxes.' },
    { title: 'Sign', description: 'Draw, type, or upload your signature.' },
    { title: 'Send', description: 'Invite recipients with secure email links.' },
    { title: 'Track', description: 'Monitor who signed and who is pending.' },
    { title: 'Complete', description: 'Download the fully signed PDF.' },
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
        description: 'A focused signing workflow you can depend on — upload, sign, send, and download without friction.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
        title: 'Customer First',
        description: 'We listen to real signing workflows and ship improvements based on feedback — not assumptions about what users need.',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    },
];

export const aboutMissionStatement =
    'Make secure, browser-based PDF signing accessible to everyone — without printing, enterprise contracts, or software to install.';

export const aboutVisionStatement =
    'A trusted platform for everyday document workflows, where signing is fast, clear, and dependable for freelancers, teams, and growing businesses.';

export const aboutMissionPoints = [
    {
        title: 'Simplify document signing',
        description: 'Replace the print-sign-scan loop with a clear, browser-based workflow anyone can finish quickly.',
    },
    {
        title: 'Eliminate printing and scanning',
        description: 'Keep agreements digital from the first upload to the final signed PDF — no paper trail required.',
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
        description: 'Upload a PDF, place your signature, and download — or send for signature — without extra steps.',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
        title: 'Modern interface',
        description: 'A clean editor built for focus: place fields, sign, and review without fighting the UI.',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
        title: 'Cross-device compatibility',
        description: 'Works in modern browsers on desktop, tablet, and phone — sign wherever you are.',
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
        description: 'Save the signed PDF instantly — or send it to others for signature.',
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
        description: 'We collect only what is needed to run the service — account details, uploaded documents, and support messages. We do not sell personal data.',
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

/** Roadmap milestones — status is "completed" or "planned" only. */
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
        answer: 'CubSign is an online PDF signing platform. You can upload a PDF, add your signature in the browser, download the signed file, or send documents to others for signature — without printing or installing software.',
    },
    {
        question: 'Who builds CubSign?',
        answer: 'CubSign is built by Cubiz Infotech, a focused product team improving the platform during Early Access based on real user feedback.',
    },
    {
        question: 'Why was CubSign created?',
        answer: 'We built CubSign to end the print-sign-scan cycle. Many e-signature tools felt expensive or overly complex for everyday contracts, so we focused on a simple, secure workflow anyone can use.',
    },
    {
        question: 'Is CubSign free?',
        answer: 'Yes. CubSign is free during Early Access. You can upload, sign, send for signature, and download PDFs without a credit card.',
    },
    {
        question: 'Do I need to create an account?',
        answer: 'Not for basic self-signing. You can upload a PDF, sign it, and download the result without an account. Creating an account unlocks document storage and send-for-signature workflows.',
    },
    {
        question: 'Are electronic signatures on CubSign legally valid?',
        answer: 'Electronic signatures are widely recognized under modern e-signature laws when parties intend to sign. CubSign helps you capture signatures digitally; you remain responsible for using them appropriately for your documents and jurisdiction.',
    },
    {
        question: 'How does CubSign keep documents secure?',
        answer: 'Documents are transmitted over HTTPS and stored with industry-standard cloud security practices. Access is limited to authorized users and invited recipients.',
    },
    {
        question: 'Does CubSign work on mobile devices?',
        answer: 'Yes. CubSign runs in modern browsers on desktop, tablet, and mobile, so you can sign on the device you already use.',
    },
    {
        question: 'Do I need to install any software?',
        answer: 'No. CubSign is entirely browser-based. Open the site, upload your PDF, and start signing — nothing to download or update.',
    },
    {
        question: 'How can I contact the CubSign team?',
        answer: 'Visit the Contact page or email support@cubsign.com. We are a small team and read every message during Early Access.',
    },
];

export const socialStats = [
    { value: 'Free', label: 'During Early Access' },
    { value: 'Secure', label: 'Encrypted documents' },
    { value: 'Simple', label: 'Works on mobile' },
];

export const customerLogos = [
    { name: 'Freelancers', initials: 'FL' },
    { name: 'Agencies', initials: 'AG' },
    { name: 'HR Teams', initials: 'HR' },
    { name: 'Legal', initials: 'LG' },
    { name: 'Real Estate', initials: 'RE' },
    { name: 'Startups', initials: 'ST' },
];

export const heroTrustBadges = [
    'No Account Required',
    'Secure PDF Signing',
    'Legally Valid',
    'Free During Early Access',
];

export const homeComparisonCubsign = [
    'No account required',
    'Unlimited signatures',
    'Unlimited documents',
    'Multiple recipients',
    'Secure cloud storage',
    'Audit trail',
    'Early Access Free',
];

export const homeComparisonOthers = [
    'Monthly subscription',
    'Signature limits',
    'Account required',
    'Hidden pricing',
    'Feature restrictions',
];

export const pricingTrustBadges = [
    'Unlimited Signatures',
    'Unlimited Documents',
    'No Credit Card',
    'Free Early Access',
];

export const homeFaqs = [
    {
        question: 'Is CubSign free to use?',
        answer: 'Yes. CubSign is completely free during early access. You can upload, sign, send for signature, and download PDFs without any charge or credit card required.',
    },
    {
        question: 'Why is CubSign free?',
        answer: 'We are currently in Early Access and collecting feedback from users before introducing paid plans.',
    },
    {
        question: 'Do I need to create an account to sign?',
        answer: 'No. You can upload a PDF, add your signature and download the signed document without creating an account. An account unlocks document storage and sending for signature.',
    },
    {
        question: 'Are my documents secure?',
        answer: 'All documents are stored with industry-standard encryption. Access is restricted to authorised users only, and all data is transmitted over HTTPS.',
    },
    {
        question: 'Can I sign documents on mobile?',
        answer: 'Yes. CubSign works in any modern browser on desktop, tablet, and mobile.',
    },
];

export const homePricingComparison = [
    { feature: 'Unlimited signatures', cubsign: true, others: false },
    { feature: 'No credit card required', cubsign: true, others: false },
    { feature: 'Free during Early Access', cubsign: true, others: false },
];

export const pricingComparison = [
    { feature: 'Unlimited signatures', cubsign: true, others: false },
    { feature: 'No credit card required', cubsign: true, others: false },
    { feature: 'Audit trail', cubsign: true, others: true },
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
