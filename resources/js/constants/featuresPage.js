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
