/** Shared marketing copy — keep messaging consistent across public pages. */
export const EARLY_ACCESS_HEADLINE = 'Free During Early Access';

export const EARLY_ACCESS_SUBHEADLINE =
    'Use CubSign completely free while we improve the platform based on user feedback.';

export const CTA_START_SIGNING = 'Start Signing Free';
export const CTA_CREATE_ACCOUNT = 'Create Free Account';
export const CTA_NAV_REGISTER = 'Get Started Free';

/** Reusable Tailwind class strings for marketing CTAs */
export const btnPrimary =
    'inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:-translate-y-px hover:bg-blue-700 hover:shadow-md';

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

export const APP_VERSION = '0.11.2';

/** Homepage-only: 6 key features (full list remains on /features) */
export const homeFeatureGrid = [
    {
        title: 'Draw Signature',
        description: 'Sign naturally with mouse, trackpad, or finger.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        title: 'Type Signature',
        description: 'Elegant handwriting fonts for a professional look.',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
    },
    {
        title: 'Request Signatures',
        description: 'Send documents and track status in real time.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-600',
    },
    {
        title: 'Audit Trail',
        description: 'Every event logged with timestamps for compliance.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
    {
        title: 'Secure Storage',
        description: 'Encrypted in transit and at rest on secure cloud.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        iconBg: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
    },
    {
        title: 'Mobile Friendly',
        description: 'Sign from any modern browser on any device.',
        icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
    },
];

/** Homepage pricing comparison — essentials only */
export const homePricingComparison = [
    { feature: 'Unlimited signatures', cubsign: true, others: false },
    { feature: 'No credit card required', cubsign: true, others: false },
    { feature: 'Free during Early Access', cubsign: true, others: false },
];

export const companyStats = [
    { value: '2,500+', label: 'Documents Signed' },
    { value: '900+', label: 'Active Users' },
    { value: '40+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
    { value: '<2h', label: 'Support Response' },
];

export const companyValues = [
    { title: 'Security', description: 'Bank-grade encryption and audit trails on every document.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'Privacy', description: 'Your data is never sold. You control who sees your documents.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { title: 'Simplicity', description: 'Sign in under 60 seconds. No training required.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Performance', description: 'Fast uploads, instant downloads, 99.9% availability.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Customer First', description: 'Free during Early Access while we build based on your feedback.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Innovation', description: 'Continuously improving with smart detection and modern workflows.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
];

export const aboutTimeline = [
    { year: '2025', title: 'CubSign Founded', description: 'Born from frustration with print-sign-scan workflows.' },
    { year: '2025', title: 'MVP Launch', description: 'Core signing engine and PDF editor built from scratch.' },
    { year: '2025', title: 'Early Access', description: 'Opened to early users — completely free.' },
    { year: '2026', title: 'Public Beta', description: 'Multi-recipient workflows, audit trails, and templates.' },
    { year: 'Future', title: 'Enterprise', description: 'Team workspaces, API access, and SOC 2 readiness.' },
];

export const aboutTeam = [
    { name: 'Alex Chen', role: 'CEO & Founder', dept: 'Leadership', initials: 'AC', bg: 'bg-blue-600' },
    { name: 'Priya Sharma', role: 'Co-Founder & CTO', dept: 'Engineering', initials: 'PS', bg: 'bg-violet-600' },
    { name: 'Jordan Lee', role: 'Head of Product', dept: 'Product', initials: 'JL', bg: 'bg-emerald-600' },
    { name: 'Morgan Davis', role: 'Lead Engineer', dept: 'Engineering', initials: 'MD', bg: 'bg-rose-600' },
    { name: 'Sarah Kim', role: 'Support Lead', dept: 'Support', initials: 'SK', bg: 'bg-amber-600' },
    { name: 'Riley Torres', role: 'Marketing Director', dept: 'Marketing', initials: 'RT', bg: 'bg-cyan-600' },
];

export const successStories = [
    { company: 'Brightpath Agency', quote: 'We cut contract turnaround from 3 days to 20 minutes.', metric: '90% faster', initials: 'BP', bg: 'bg-blue-500' },
    { company: 'Summit Legal', quote: 'Client NDAs are signed before the meeting ends.', metric: '500+ docs/mo', initials: 'SL', bg: 'bg-emerald-500' },
];

export const securityPageFeatures = [
    { title: 'Bank-Grade Encryption', description: 'AES-256 encryption at rest and TLS 1.3 in transit for all documents.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'Audit Trail', description: 'Complete event history with timestamps, IP addresses, and signer identity.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { title: 'Data Privacy', description: 'GDPR-aligned practices. Your data is never sold to third parties.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { title: 'Secure Infrastructure', description: 'Enterprise cloud hosting with access controls and monitoring.', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
    { title: 'Secure Storage & Backups', description: 'Redundant storage with automated backups and disaster recovery.', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { title: 'SOC 2 Readiness', description: 'Building toward SOC 2 Type II certification for enterprise customers.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
];

export const socialStats = [
    { value: '2,500+', label: 'Documents Signed' },
    { value: '900+', label: 'Happy Users' },
    { value: '99.9%', label: 'Availability' },
];

export const customerLogos = [
    { name: 'Acme Corp', initials: 'AC' },
    { name: 'Northline', initials: 'NL' },
    { name: 'Brightpath', initials: 'BP' },
    { name: 'Summit Legal', initials: 'SL' },
    { name: 'Vertex HR', initials: 'VH' },
    { name: 'Clearview', initials: 'CV' },
];

export const heroTrustBadges = [
    'Bank-grade security',
    'Legally binding',
    'No account required',
    'Free during Early Access',
];

export const featureGrid = [
    {
        title: 'Draw Signature',
        description: 'Sign naturally with your mouse, trackpad, or finger on any device.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        visual: 'draw',
    },
    {
        title: 'Type Signature',
        description: 'Choose elegant handwriting fonts for a polished, professional look.',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
        visual: 'type',
    },
    {
        title: 'Upload Signature',
        description: 'Use your existing signature image for consistent branding.',
        icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        visual: 'upload',
    },
    {
        title: 'Request Signatures',
        description: 'Send documents to others and track signing status in real time.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-600',
        visual: 'request',
    },
    {
        title: 'Audit Trail',
        description: 'Every view, sign, and send event logged with timestamps for compliance.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        visual: 'audit',
    },
    {
        title: 'Secure Storage',
        description: 'Documents encrypted in transit and at rest on secure cloud infrastructure.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        iconBg: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
        visual: 'storage',
    },
    {
        title: 'Mobile Friendly',
        description: 'Sign and send from any modern browser — desktop, tablet, or phone.',
        icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        visual: 'mobile',
    },
    {
        title: 'Instant Download',
        description: 'Get your signed PDF immediately — no waiting, no extra steps.',
        icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-600',
        visual: 'download',
    },
    {
        title: 'Multi Recipient Support',
        description: 'Add multiple signers with signing order and field assignments.',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
        iconBg: 'bg-pink-50',
        iconColor: 'text-pink-600',
        visual: 'multi',
    },
];

export const securityCards = [
    {
        title: 'Encryption',
        description: 'AES-256 encryption at rest and TLS 1.3 in transit protect every document.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
    {
        title: 'Secure Cloud Storage',
        description: 'Documents stored on enterprise-grade infrastructure with access controls.',
        icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    },
    {
        title: 'Audit Trail',
        description: 'Complete event history with timestamps, IP addresses, and signer identity.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
        title: 'Email Verification',
        description: 'Verified email addresses ensure signers are who they claim to be.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
        title: 'Tamper Detection',
        description: 'Signed PDFs are locked to prevent unauthorized modifications after signing.',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    {
        title: 'Privacy',
        description: 'Your data is never sold. You control who sees your documents.',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
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
        quote: 'My clients sign lease agreements in minutes. The simplest signing tool I have ever used — bar none.',
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
        answer: 'Yes. CubSign is fully responsive and works on any modern browser — desktop, tablet, and mobile.',
    },
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
        { label: 'Security', routeName: 'security' },
        { label: 'FAQ', routeName: 'faq' },
    ],
    company: [
        { label: 'About Us', routeName: 'about' },
        { label: 'Blog', routeName: 'blog' },
        { label: 'Contact', routeName: 'contact' },
    ],
    legal: [
        { label: 'Privacy Policy', routeName: 'privacy' },
        { label: 'Terms of Service', routeName: 'terms' },
        { label: 'Cookie Policy', routeName: 'cookies' },
    ],
    resources: [
        { label: 'Help Center', routeName: 'faq' },
        { label: 'Documentation', href: 'https://docs.cubsign.com', external: true },
        { label: 'Status', href: 'https://status.cubsign.com', external: true },
    ],
    developers: [
        { label: 'API', href: 'https://docs.cubsign.com/api', external: true },
        { label: 'Documentation', href: 'https://docs.cubsign.com', external: true },
    ],
    support: [
        { label: 'Contact Support', routeName: 'contact' },
        { label: 'FAQ', routeName: 'faq' },
        { label: 'Status', href: 'https://status.cubsign.com', external: true },
    ],
};
