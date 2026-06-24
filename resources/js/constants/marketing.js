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
    { title: 'Upload', description: 'Drop any PDF and start in seconds.' },
    { title: 'Add Fields', description: 'Place signatures, dates, and text fields.' },
    { title: 'Send', description: 'Invite recipients by email — no account needed.' },
    { title: 'Get Signed PDF', description: 'Download the completed document instantly.' },
];
