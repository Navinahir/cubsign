/** Features page content — used only by Features.vue */

export const featuresShowcases = [
    {
        id: 'self-sign',
        title: 'Self-sign a PDF',
        description:
            'Upload a PDF in your browser, place a signature, and download the finished file. Guest users can complete one self-sign session without an account.',
        whyItMatters:
            'Replaces printing, wet-ink signing, scanning, and emailing for everyday agreements.',
        howToUse: [
            'Open Upload PDF and choose a PDF up to 25 MB',
            'In the editor, add signature, initials, name, text, date, or checkbox fields',
            'Create a signature by drawing, typing, or uploading an image',
            'Place it on the page, review, and download the signed PDF',
        ],
        expect: 'You get a signed PDF file on your device. Guest sessions do not keep a copy in CubSign after download.',
        bullets: [
            'Draw on a canvas, type in a signature font, or upload an image',
            'Place fields anywhere on the page',
            'PDF files only, up to 25 MB',
            'One guest self-sign session, then create a free account to continue',
            'Download the finished PDF instantly',
        ],
        links: [
            { label: 'Start signing', routeName: 'sign.index' },
            { label: 'How to sign a PDF', href: '/help-center/how-to-sign-a-pdf-online' },
            { label: 'Signing guide on the blog', href: '/blog' },
        ],
        mockup: 'signature',
        screenshot: 'signing-editor',
    },
    {
        id: 'request-signatures',
        title: 'Request signatures',
        description:
            'With a CubSign account, send a PDF to one or more people by email. Each recipient signs through a unique link and does not need an account.',
        whyItMatters:
            'You stop chasing wet-ink copies and can see who still needs to sign from your workspace.',
        howToUse: [
            'Sign in and upload (or open) a PDF',
            'Add recipients by email and place fields for each signer',
            'Send invitations. Recipients open their unique link',
            'Track pending and signed status until everyone finishes',
        ],
        expect: 'Recipients sign in order as configured. When complete, you can download the finished PDF from your workspace.',
        bullets: [
            'Add recipients by email address',
            'Recipients sign without creating an account',
            'See who has signed and who is waiting',
            'Unique HTTPS signing links per recipient',
            'Download the completed PDF when done',
        ],
        links: [
            { label: 'Create a free account', routeName: 'register' },
            { label: 'Share and send help', href: '/help-center/share-documents' },
            { label: 'Request signatures guide', href: '/blog' },
        ],
        mockup: 'request',
        screenshot: null,
    },
    {
        id: 'templates',
        title: 'Templates',
        description:
            'Save documents you send often as templates so fields stay positioned for the next send. Available for signed-in users.',
        whyItMatters:
            'Contracts, NDAs, and onboarding forms often use the same layout. Templates avoid rebuilding fields every time.',
        howToUse: [
            'Create or open a document with fields placed where you need them',
            'Save it as a template from your workspace',
            'Reuse the template and send to new recipients',
            'Edit or replace the underlying PDF when the form changes',
        ],
        expect: 'Field positions persist on the template. You still send a fresh signing request for each new set of recipients.',
        bullets: [
            'Save a prepared PDF layout as a template',
            'Keep signature and date fields positioned',
            'Send to new recipients without rebuilding the page',
            'Useful for contracts, NDAs, and onboarding forms',
            'Edit templates anytime from your workspace',
        ],
        links: [
            { label: 'View pricing / Early Access', routeName: 'pricing' },
            { label: 'What is CubSign?', href: '/help-center/what-is-cubsign' },
        ],
        mockup: 'templates',
        screenshot: null,
    },
    {
        id: 'audit-trail',
        title: 'Activity history',
        description:
            'For documents you send, CubSign records key events in your workspace: invitations, recipient signatures, and completion.',
        whyItMatters:
            'When someone asks “who signed and when?”, you can open the document activity instead of reconstructing email threads.',
        howToUse: [
            'Send a document for signature from your workspace',
            'Open the document detail view as recipients sign',
            'Review activity events with timestamps',
            'Download the completed PDF when the workflow finishes',
        ],
        expect:
            'Activity shows events such as recipient notified, recipient signed, and document completed. CubSign does not claim page-view logging or IP addresses in this user-facing history.',
        bullets: [
            'Activity log per sent document',
            'Timestamps on recorded events',
            'Signer name and email associated with signature events',
            'View history in your workspace',
            'Useful for everyday contract follow-up (not a legal certification product)',
        ],
        links: [
            { label: 'Audit trail help', href: '/help-center/audit-trail' },
            { label: 'What is an audit trail?', href: '/blog/what-is-an-audit-trail' },
            { label: 'Security Center', routeName: 'security' },
        ],
        mockup: 'audit',
        screenshot: null,
    },
    {
        id: 'secure-storage',
        title: 'Private document storage',
        description:
            'Account documents are stored on private server storage. Access is limited to the owner and invited recipients. Traffic uses HTTPS.',
        whyItMatters:
            'You need a place for drafts and completed files that is not a public download link shared in chat.',
        howToUse: [
            'Sign in and upload PDFs to your workspace',
            'Share only through CubSign invitation links when requesting signatures',
            'Delete documents you no longer need from the workspace',
            'Read the Security Center and Privacy Policy for how data is handled',
        ],
        expect:
            'Files are not sold or used for advertising. CubSign does not market AES-256 or “bank-level” encryption at rest; protection focuses on HTTPS in transit and access controls.',
        bullets: [
            'HTTPS for uploads, signing sessions, and downloads',
            'Private storage with owner and recipient access controls',
            'Unique signing links for invited recipients',
            'Delete documents from your workspace when finished',
            'Documents are not sold or shared for advertising',
        ],
        links: [
            { label: 'Security Center', routeName: 'security' },
            { label: 'Secure storage help', href: '/help-center/secure-storage' },
            { label: 'Privacy Policy', routeName: 'privacy' },
        ],
        mockup: 'storage',
        screenshot: null,
    },
    {
        id: 'document-tracking',
        title: 'Document tracking',
        description:
            'Check pending and signed status for documents you send. Filter and open any document from your workspace dashboard.',
        whyItMatters:
            'Multi-recipient agreements stall when you cannot see who still needs to act.',
        howToUse: [
            'Send a document to one or more recipients',
            'Open Documents in your workspace',
            'Filter by status and open a document for details',
            'Follow up with anyone still pending',
        ],
        expect: 'Status reflects signing progress (for example pending vs signed/completed), not whether someone merely opened an email.',
        bullets: [
            'See pending and signed status for sent documents',
            'Track multiple recipients on one document',
            'Filter documents by status',
            'Open any document in one click',
            'Works in modern browsers on desktop and mobile',
        ],
        links: [
            { label: 'Try Upload PDF', routeName: 'sign.index' },
            { label: 'Multi-recipient guide', href: '/blog/request-signatures-from-multiple-recipients' },
            { label: 'Help Center', routeName: 'help-center' },
        ],
        mockup: 'tracking',
        screenshot: null,
    },
];

/** Real product screenshots for the signature methods feature strip. */
export const signatureMethodShots = [
    { key: 'draw-signature', label: 'Draw' },
    { key: 'type-signature', label: 'Type' },
    { key: 'upload-signature', label: 'Upload image' },
];

export const workflowShots = [
    { key: 'pdf-upload', label: '1. Upload' },
    { key: 'signature-placement', label: '2. Place signature' },
    { key: 'signed-pdf-download', label: '3. Download' },
];
