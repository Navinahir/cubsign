/** Shared marketing copy — keep messaging consistent across public pages. */
export const EARLY_ACCESS_HEADLINE = 'Free During Early Access';

export const EARLY_ACCESS_SUBHEADLINE =
    'Use CubSign completely free while we improve the platform based on user feedback.';

export const CTA_START_SIGNING = 'Start Signing Free';
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

/** Social profiles — use # until official accounts are live */
export const SOCIAL_LINKS = [
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
    { label: 'Twitter', href: '#', icon: 'twitter' },
    { label: 'GitHub', href: '#', icon: 'github' },
];

export const SUPPORT_EMAIL = 'support@cubsign.com';

export const companyStats = [
    { value: 'Free', label: 'During Early Access' },
    { value: 'Secure', label: 'Encrypted documents' },
    { value: 'Simple', label: 'Sign in minutes' },
    { value: 'Mobile', label: 'Works on any device' },
    { value: 'Support', label: 'Email assistance' },
];

export const companyValues = [
    { title: 'Security', description: 'HTTPS in transit and encrypted storage for uploaded documents.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'Privacy', description: 'Your data is never sold. You control who sees your documents.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { title: 'Simplicity', description: 'Sign in under 60 seconds. No training required.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Performance', description: 'Fast uploads, instant downloads, 99.9% availability.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Customer First', description: 'Free during Early Access while we build based on your feedback.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Innovation', description: 'Continuously improving with smart detection and modern workflows.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
];

export const aboutTimeline = [
    { year: '2025', title: 'CubSign Founded', description: 'Born from frustration with print-sign-scan workflows.' },
    { year: '2025', title: 'MVP Launch', description: 'Core signing engine and PDF editor built from scratch.' },
    { year: '2025', title: 'Early Access', description: 'Opened to early users. Completely free.' },
    { year: '2026', title: 'Public Beta', description: 'Multi-recipient workflows, audit trails, and templates.' },
    { year: 'Future', title: 'Enterprise', description: 'Team workspaces, API access, and SOC 2 readiness.' },
];

export const successStories = [
    { company: 'Brightpath Agency', quote: 'We cut contract turnaround from 3 days to 20 minutes.', metric: '90% faster', initials: 'BP', bg: 'bg-blue-500' },
    { company: 'Summit Legal', quote: 'Client NDAs are signed before the meeting ends.', metric: '500+ docs/mo', initials: 'SL', bg: 'bg-emerald-500' },
];

/** Reserved for a future dedicated Security / Trust Center page (SOC 2, ISO 27001, etc.) */
export const securityPageFeatures = [
    { title: 'Bank-Grade Encryption', description: 'AES-256 encryption at rest and TLS 1.3 in transit for all documents.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'Audit Trail', description: 'Complete event history with timestamps, IP addresses, and signer identity.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { title: 'Data Privacy', description: 'GDPR-aligned practices. Your data is never sold to third parties.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { title: 'Secure Infrastructure', description: 'Enterprise cloud hosting with access controls and monitoring.', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
    { title: 'Secure Storage & Backups', description: 'Redundant storage with automated backups and disaster recovery.', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { title: 'SOC 2 Readiness', description: 'Building toward SOC 2 Type II certification for enterprise customers.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
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

export const testimonials = [
    {
        initials: 'SM',
        name: 'Sarah Mitchell',
        role: 'Freelance Designer',
        avatarBg: 'bg-blue-500',
        quote: 'CubSign saves me hours every week. I sign client contracts in seconds without printing a single page.',
    },
    {
        initials: 'JT',
        name: 'James Torres',
        role: 'Real Estate Agent',
        avatarBg: 'bg-emerald-500',
        quote: 'My clients sign lease agreements in minutes. It is the simplest signing tool I have used.',
    },
    {
        initials: 'PK',
        name: 'Priya Kumar',
        role: 'HR Manager',
        avatarBg: 'bg-violet-500',
        quote: 'Onboarding paperwork used to take days. Now new hires sign everything digitally before their first day.',
    },
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
        { label: 'Documentation', href: '#', unavailable: true },
        { label: 'Help Center', routeName: 'faq' },
    ],
};
