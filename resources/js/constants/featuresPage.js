/** Features page content — used only by Features.vue */

export const featuresShowcases = [
    {
        id: 'self-sign',
        title: 'Self Sign',
        description: 'Upload a PDF, add your signature, and download the signed file. No printing required.',
        bullets: [
            'Draw your signature on a canvas',
            'Type your name in a signature font',
            'Upload an image of your signature',
            'Place the field anywhere on the page',
            'Download the finished PDF instantly',
        ],
        mockup: 'signature',
    },
    {
        id: 'request-signatures',
        title: 'Request Signatures',
        description: 'Send a document to one or more people by email. They sign through a link in their inbox.',
        bullets: [
            'Add recipients by email address',
            'Recipients sign without an account',
            'See who has signed and who is waiting',
            'Get notified when everyone is done',
            'Download the completed PDF',
        ],
        mockup: 'request',
    },
    {
        id: 'templates',
        title: 'Templates',
        description: 'Save documents you send often. Fields stay in place so you can reuse them quickly.',
        bullets: [
            'Save any document as a template',
            'Keep signature and date fields positioned',
            'Send to new recipients in a few clicks',
            'Great for contracts, NDAs, and onboarding forms',
            'Edit templates anytime',
        ],
        mockup: 'templates',
    },
    {
        id: 'audit-trail',
        title: 'Audit Trail',
        description: 'Every view, signature, and download is recorded. You always know what happened and when.',
        bullets: [
            'Full activity log per document',
            'Timestamps on every event',
            'Signer name and email captured',
            'Download an audit certificate',
            'Helpful for contracts and compliance',
        ],
        mockup: 'audit',
    },
    {
        id: 'secure-storage',
        title: 'Secure Storage',
        description: 'Your documents are stored in the cloud with encryption. Only you and your recipients can access them.',
        bullets: [
            'HTTPS for all uploads and downloads',
            'Encrypted storage for saved documents',
            'Access limited to document owners',
            'Secure signing links for recipients',
            'Your files are never sold or shared',
        ],
        mockup: 'storage',
    },
    {
        id: 'document-tracking',
        title: 'Document Tracking',
        description: 'Check the status of any document from your dashboard. No more chasing people by email.',
        bullets: [
            'See pending, viewed, and signed status',
            'Track multiple recipients at once',
            'Filter documents by status',
            'Open any document in one click',
            'Works on desktop and mobile',
        ],
        mockup: 'tracking',
    },
];

export const featuresAudience = [
    {
        title: 'Freelancers',
        description: 'Sign client contracts and send proposals without the back-and-forth.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        title: 'Small Business',
        description: 'Handle agreements, invoices, and vendor forms in one place.',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        title: 'Legal Teams',
        description: 'Send NDAs and agreements with a clear record of who signed.',
        icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
        gradient: 'from-slate-600 to-gray-800',
    },
    {
        title: 'HR',
        description: 'Get offer letters and onboarding paperwork signed before day one.',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        title: 'Sales',
        description: 'Close deals faster with quotes and contracts signed online.',
        icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        title: 'Operations',
        description: 'Keep vendor agreements and internal forms organized and tracked.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        gradient: 'from-sky-500 to-blue-600',
    },
];

export const featuresIncluded = [
    'Draw Signature',
    'Type Signature',
    'Upload Signature',
    'Request Signatures',
    'Templates',
    'Audit Trail',
    'Secure Storage',
    'Mobile Friendly',
    'Unlimited Documents (Early Access)',
];
