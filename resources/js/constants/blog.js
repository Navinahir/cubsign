export const blogCategories = ['Product', 'Security', 'Guides', 'Company', 'Legal'];

export const blogPosts = [
    {
        slug: 'introducing-cubsign-early-access',
        title: 'Introducing CubSign Early Access',
        excerpt: 'We are opening CubSign to early users. Sign PDFs online for free while we build the future of document signing.',
        category: 'Company',
        author: { name: 'CubSign Team', role: 'Product', initials: 'CT', avatarBg: 'bg-blue-600' },
        publishedAt: '2025-11-15',
        readingTime: 4,
        tags: ['Early Access', 'Product Launch'],
        featured: true,
        heroGradient: 'from-blue-600 to-indigo-700',
        content: [
            { type: 'p', text: 'Today we are thrilled to announce CubSign Early Access — a modern, free way to sign PDFs online without the friction of traditional e-signature tools.' },
            { type: 'h2', text: 'Why we built CubSign' },
            { type: 'p', text: 'Signing documents should not require printing, scanning, or expensive subscriptions. CubSign was built to make PDF signing fast, secure, and accessible to everyone.' },
            { type: 'h2', text: 'What you can do today' },
            { type: 'ul', items: ['Upload and sign PDFs in seconds', 'Request signatures from multiple recipients', 'Track document status with audit trails', 'Download signed PDFs instantly'] },
            { type: 'h2', text: 'Join Early Access' },
            { type: 'p', text: 'CubSign is completely free during Early Access. Create an account or sign without one — the choice is yours.' },
        ],
    },
    {
        slug: 'how-to-sign-pdf-online',
        title: 'How to Sign a PDF Online in Under 60 Seconds',
        excerpt: 'A step-by-step guide to uploading, signing, and downloading your first PDF with CubSign.',
        category: 'Guides',
        author: { name: 'Alex Rivera', role: 'Content Lead', initials: 'AR', avatarBg: 'bg-emerald-600' },
        publishedAt: '2025-12-02',
        readingTime: 5,
        tags: ['Tutorial', 'PDF Signing'],
        featured: false,
        heroGradient: 'from-emerald-600 to-teal-700',
        content: [
            { type: 'p', text: 'Signing a PDF online has never been easier. With CubSign, you can go from upload to signed document in under a minute.' },
            { type: 'h2', text: 'Step 1: Upload your PDF' },
            { type: 'p', text: 'Drag and drop your PDF onto the upload page or click to browse. CubSign supports standard PDF files up to 25 MB.' },
            { type: 'h2', text: 'Step 2: Add your signature' },
            { type: 'p', text: 'Draw your signature with a mouse or finger, type it in a handwriting font, or upload an existing signature image.' },
            { type: 'h2', text: 'Step 3: Download' },
            { type: 'p', text: 'Place your signature on the document, review, and download the signed PDF instantly.' },
        ],
    },
    {
        slug: 'electronic-signatures-legal-guide',
        title: 'Are Electronic Signatures Legally Binding?',
        excerpt: 'Understanding e-signature laws, audit trails, and what makes a digital signature legally defensible.',
        category: 'Legal',
        author: { name: 'Jordan Lee', role: 'Legal Advisor', initials: 'JL', avatarBg: 'bg-violet-600' },
        publishedAt: '2026-01-10',
        readingTime: 7,
        tags: ['Legal', 'Compliance'],
        featured: false,
        heroGradient: 'from-violet-600 to-purple-700',
        content: [
            { type: 'p', text: 'Electronic signatures are widely recognized as legally binding in most jurisdictions, including under the US ESIGN Act and EU eIDAS regulation.' },
            { type: 'h2', text: 'What makes a signature valid' },
            { type: 'p', text: 'A valid electronic signature requires intent to sign, consent to do business electronically, and a reliable record of the signing event.' },
            { type: 'h2', text: 'The role of audit trails' },
            { type: 'p', text: 'CubSign logs every view, sign, and send event with timestamps and IP addresses, providing court-ready evidence of the signing process.' },
        ],
    },
    {
        slug: 'securing-your-documents',
        title: 'How CubSign Protects Your Documents',
        excerpt: 'Encryption, secure storage, and privacy controls that keep your sensitive documents safe.',
        category: 'Security',
        author: { name: 'Morgan Chen', role: 'Security Engineer', initials: 'MC', avatarBg: 'bg-rose-600' },
        publishedAt: '2026-02-18',
        readingTime: 6,
        tags: ['Security', 'Encryption'],
        featured: false,
        heroGradient: 'from-rose-600 to-orange-700',
        content: [
            { type: 'p', text: 'Security is not an afterthought at CubSign. Every document is protected from upload to download with industry-standard encryption and access controls.' },
            { type: 'h2', text: 'Encryption in transit and at rest' },
            { type: 'p', text: 'All data is transmitted over HTTPS with TLS 1.3. Documents at rest are encrypted with AES-256.' },
            { type: 'h2', text: 'Access controls' },
            { type: 'p', text: 'Only authorized users and recipients with valid signing links can access your documents.' },
        ],
    },
    {
        slug: 'request-signatures-workflow',
        title: 'Request Signatures from Multiple Recipients',
        excerpt: 'Send documents for signature, assign fields, and track progress — all without recipients needing an account.',
        category: 'Product',
        author: { name: 'CubSign Team', role: 'Product', initials: 'CT', avatarBg: 'bg-blue-600' },
        publishedAt: '2026-03-05',
        readingTime: 5,
        tags: ['Product', 'Workflow'],
        featured: false,
        heroGradient: 'from-cyan-600 to-blue-700',
        content: [
            { type: 'p', text: 'Need more than one person to sign? CubSign makes multi-recipient workflows simple and trackable.' },
            { type: 'h2', text: 'Add recipients' },
            { type: 'p', text: 'Enter email addresses for each signer and assign signature fields to the right person.' },
            { type: 'h2', text: 'Track in real time' },
            { type: 'p', text: 'See who has signed, who is pending, and when the document is fully completed.' },
        ],
    },
    {
        slug: 'mobile-pdf-signing-tips',
        title: '5 Tips for Signing PDFs on Your Phone',
        excerpt: 'Get the best signing experience on mobile with these practical tips.',
        category: 'Guides',
        author: { name: 'Alex Rivera', role: 'Content Lead', initials: 'AR', avatarBg: 'bg-emerald-600' },
        publishedAt: '2026-04-12',
        readingTime: 3,
        tags: ['Mobile', 'Tips'],
        featured: false,
        heroGradient: 'from-amber-500 to-orange-600',
        content: [
            { type: 'p', text: 'CubSign works great on mobile browsers. Here are five tips to sign like a pro on your phone.' },
            { type: 'ul', items: ['Use landscape mode for drawing signatures', 'Pinch to zoom when placing fields', 'Save your signature for reuse', 'Use typed signatures for clarity', 'Download immediately after signing'] },
        ],
    },
];

export function getPostBySlug(slug) {
    return blogPosts.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug, limit = 3) {
    const current = getPostBySlug(slug);
    if (!current) return blogPosts.slice(0, limit);
    return blogPosts
        .filter((p) => p.slug !== slug && (p.category === current.category || p.tags.some((t) => current.tags.includes(t))))
        .slice(0, limit);
}

export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
