/** Help Center knowledge base — keep slugs in sync with config/help.php */

export const helpCategories = [
    {
        slug: 'getting-started',
        name: 'Getting Started',
        description: 'Create an account, learn the basics, and sign your first PDF.',
        icon: 'rocket',
        color: 'from-blue-600 to-indigo-700',
    },
    {
        slug: 'uploading-pdfs',
        name: 'Uploading PDFs',
        description: 'Supported formats, size limits, and how to upload documents.',
        icon: 'upload',
        color: 'from-cyan-600 to-blue-700',
    },
    {
        slug: 'signing-documents',
        name: 'Signing Documents',
        description: 'Draw, type, or upload signatures and complete signing workflows.',
        icon: 'pen',
        color: 'from-emerald-600 to-teal-700',
    },
    {
        slug: 'account',
        name: 'Account',
        description: 'Login options, email verification, passwords, and profile settings.',
        icon: 'user',
        color: 'from-violet-600 to-purple-700',
    },
    {
        slug: 'security',
        name: 'Security',
        description: 'Storage, privacy, audit trails, and electronic signature legality.',
        icon: 'shield',
        color: 'from-rose-600 to-orange-700',
    },
    {
        slug: 'troubleshooting',
        name: 'Troubleshooting',
        description: 'Fix upload errors, browser issues, and get in touch with support.',
        icon: 'wrench',
        color: 'from-amber-500 to-orange-600',
    },
];

export const helpArticles = [
    {
        slug: 'how-to-upload-a-pdf',
        title: 'How to Upload a PDF',
        excerpt: 'Upload a PDF to CubSign from your computer or phone in a few clicks.',
        category: 'Uploading PDFs',
        categorySlug: 'uploading-pdfs',
        updatedAt: '2026-06-15',
        readingTime: 3,
        tags: ['Upload', 'PDF'],
        related: ['supported-file-types', 'maximum-upload-size', 'troubleshooting-upload-errors'],
        content: [
            { type: 'p', text: 'CubSign accepts standard PDF files so you can start signing within seconds. You do not need to install software or convert your document first.' },
            { type: 'h2', text: 'Upload from the home or Upload PDF page' },
            { type: 'ol', items: [
                'Go to Upload PDF (or choose Sign PDF from the navigation).',
                'Drag and drop your PDF onto the upload area, or click to browse your files.',
                'Wait for the upload to finish. CubSign will open the signing editor automatically.',
            ]},
            { type: 'h2', text: 'What happens after upload' },
            { type: 'p', text: 'Your PDF is stored securely for the signing session. You can place signature fields, draw or type your signature, then download the signed file or send it to others.' },
            { type: 'h2', text: 'Tips for a smooth upload' },
            { type: 'ul', items: [
                'Use a PDF that is not password-protected.',
                'Keep the file under 25 MB.',
                'Prefer a clear, text-based PDF over a low-quality scan when possible.',
            ]},
            { type: 'p', text: 'If the upload fails, see Troubleshooting Upload Errors for common causes and fixes.' },
        ],
    },
    {
        slug: 'how-to-sign-a-pdf-online',
        title: 'How to Sign a PDF Online',
        excerpt: 'Sign any PDF in your browser: upload, place your signature, and download.',
        category: 'Signing Documents',
        categorySlug: 'signing-documents',
        updatedAt: '2026-06-20',
        readingTime: 5,
        tags: ['Signing', 'Tutorial'],
        related: ['draw-vs-type-signature', 'download-signed-pdf', 'how-to-upload-a-pdf'],
        content: [
            { type: 'p', text: 'CubSign lets you sign PDFs online without printing or scanning. The full flow usually takes under a minute.' },
            { type: 'h2', text: 'Step 1: Upload your document' },
            { type: 'p', text: 'Open Upload PDF and select a PDF up to 25 MB. CubSign opens the editor when the upload completes.' },
            { type: 'h2', text: 'Step 2: Add signature fields' },
            { type: 'p', text: 'Place signature, date, or text fields on the pages where you need them. Drag fields to reposition and resize them so they fit the document layout.' },
            { type: 'h2', text: 'Step 3: Create your signature' },
            { type: 'p', text: 'Choose Draw to sign with a mouse or finger, Type to use a handwriting-style font, or Upload to use an existing signature image.' },
            { type: 'h2', text: 'Step 4: Review and finish' },
            { type: 'p', text: 'Review each page, confirm every required field is filled, then complete the signing flow. You can download the signed PDF immediately.' },
            { type: 'h2', text: 'Signing without an account' },
            { type: 'p', text: 'You can sign as a guest for one-off documents. Creating a free CubSign account adds document history, cloud storage, and the ability to send documents for signature.' },
        ],
    },
    {
        slug: 'draw-vs-type-signature',
        title: 'Draw vs Type Signature',
        excerpt: 'Compare drawing and typing your signature so you can pick the best option.',
        category: 'Signing Documents',
        categorySlug: 'signing-documents',
        updatedAt: '2026-05-28',
        readingTime: 4,
        tags: ['Signature', 'Draw', 'Type'],
        related: ['upload-your-signature-image', 'how-to-sign-a-pdf-online', 'electronic-signature-legality'],
        content: [
            { type: 'p', text: 'CubSign supports multiple ways to create a signature. Draw and Type are the most common. Both produce a valid electronic signature when you intend to sign.' },
            { type: 'h2', text: 'Draw signature' },
            { type: 'p', text: 'Drawing captures your handwriting on a canvas using a mouse, trackpad, or touchscreen. It looks closest to a pen-on-paper signature and works especially well on tablets and phones.' },
            { type: 'ul', items: [
                'Best when you want a natural handwritten look.',
                'Use landscape orientation on mobile for more room to write.',
                'You can clear and redraw until you are satisfied.',
            ]},
            { type: 'h2', text: 'Type signature' },
            { type: 'p', text: 'Typing renders your name in a handwriting-style font. It is fast, consistent, and easy to read on dense contracts or forms.' },
            { type: 'ul', items: [
                'Best when speed and clarity matter more than a freehand look.',
                'Ideal on desktops without a stylus.',
                'Useful when your drawn signature looks uneven on a small screen.',
            ]},
            { type: 'h2', text: 'Which should you use?' },
            { type: 'p', text: 'There is no legal requirement to choose one over the other for most everyday documents. Pick the style that looks right for the document and is comfortable for you. You can also upload a signature image if you already have one.' },
        ],
    },
    {
        slug: 'upload-your-signature-image',
        title: 'Upload Your Signature Image',
        excerpt: 'Use an existing signature PNG or JPG instead of drawing or typing.',
        category: 'Signing Documents',
        categorySlug: 'signing-documents',
        updatedAt: '2026-05-28',
        readingTime: 3,
        tags: ['Signature', 'Upload'],
        related: ['draw-vs-type-signature', 'how-to-sign-a-pdf-online', 'mobile-support'],
        content: [
            { type: 'p', text: 'If you already have a scanned or photographed signature, you can upload it and place it on your PDF like any other signature method.' },
            { type: 'h2', text: 'How to upload a signature image' },
            { type: 'ol', items: [
                'Open a document in the CubSign signing editor.',
                'Choose the Upload signature option.',
                'Select a clear PNG or JPG of your signature.',
                'Place and resize the signature on the document.',
            ]},
            { type: 'h2', text: 'Image tips' },
            { type: 'ul', items: [
                'Use a high-contrast signature on a plain white or transparent background.',
                'Crop tightly around the signature so empty space does not push it off the field.',
                'Avoid low-resolution photos that look blurry when enlarged.',
            ]},
            { type: 'h2', text: 'Privacy note' },
            { type: 'p', text: 'Your signature image is used for the signing session. Create an account if you want to reuse signatures and keep documents in your workspace.' },
        ],
    },
    {
        slug: 'delete-documents',
        title: 'Delete Documents',
        excerpt: 'Remove documents from your CubSign workspace when you no longer need them.',
        category: 'Account',
        categorySlug: 'account',
        updatedAt: '2026-06-01',
        readingTime: 3,
        tags: ['Documents', 'Privacy'],
        related: ['document-privacy', 'secure-storage', 'download-signed-pdf'],
        content: [
            { type: 'p', text: 'You control the documents stored in your CubSign account. Delete files you no longer need to keep your workspace clean and reduce retained data.' },
            { type: 'h2', text: 'How to delete a document' },
            { type: 'ol', items: [
                'Sign in and open Documents from your workspace.',
                'Find the document you want to remove.',
                'Open the document actions and choose Delete (or Archive first if you prefer a softer cleanup).',
                'Confirm the deletion when prompted.',
            ]},
            { type: 'h2', text: 'What deletion means' },
            { type: 'p', text: 'Deleted documents are removed from your workspace and are no longer available to download or share. If a signing request was already sent, recipients may lose access once the document is deleted.' },
            { type: 'h2', text: 'Before you delete' },
            { type: 'ul', items: [
                'Download a final signed copy if you still need it for your records.',
                'Confirm no open signature requests depend on the file.',
                'Double-check you selected the correct document.',
            ]},
        ],
    },
    {
        slug: 'email-verification',
        title: 'Email Verification',
        excerpt: 'Verify your email address to unlock the full CubSign workspace.',
        category: 'Account',
        categorySlug: 'account',
        updatedAt: '2026-05-12',
        readingTime: 3,
        tags: ['Account', 'Email'],
        related: ['google-login', 'reset-password', 'contact-support'],
        content: [
            { type: 'p', text: 'CubSign asks you to verify your email so we can confirm account ownership, send signing notifications, and protect your workspace.' },
            { type: 'h2', text: 'How verification works' },
            { type: 'ol', items: [
                'Create an account with your email address.',
                'Open the verification email from CubSign.',
                'Click the verification link to confirm your address.',
                'Return to CubSign and continue to your dashboard.',
            ]},
            { type: 'h2', text: 'Did not receive the email?' },
            { type: 'ul', items: [
                'Check spam, junk, and promotions folders.',
                'Confirm you typed the correct email during signup.',
                'Wait a minute and request a new verification email from the prompt in CubSign.',
                'Add support@cubsign.com to your contacts if your provider filters unknown senders.',
            ]},
            { type: 'h2', text: 'Why verification matters' },
            { type: 'p', text: 'Verified accounts can use workspace features such as document history and sending for signature. Verification also helps prevent unauthorized account creation with your address.' },
        ],
    },
    {
        slug: 'google-login',
        title: 'Google Login',
        excerpt: 'Sign in to CubSign quickly and securely with your Google account.',
        category: 'Account',
        categorySlug: 'account',
        updatedAt: '2026-05-12',
        readingTime: 3,
        tags: ['Account', 'Google', 'Login'],
        related: ['email-verification', 'reset-password', 'secure-storage'],
        content: [
            { type: 'p', text: 'Google Login lets you create or access a CubSign account without managing a separate password for CubSign.' },
            { type: 'h2', text: 'How to sign in with Google' },
            { type: 'ol', items: [
                'Open the CubSign Login or Register page.',
                'Choose Continue with Google.',
                'Select the Google account you want to use and approve access.',
                'CubSign creates or opens your account and takes you to the workspace.',
            ]},
            { type: 'h2', text: 'What CubSign receives' },
            { type: 'p', text: 'CubSign uses Google only for authentication basics such as your name and email. We do not get access to your Google Drive files or Gmail content through this login.' },
            { type: 'h2', text: 'Switching between Google and email login' },
            { type: 'p', text: 'Use the same email consistently. If you previously registered with email and password, contact support before linking a different Google account so we can help you avoid duplicate profiles.' },
        ],
    },
    {
        slug: 'reset-password',
        title: 'Reset Password',
        excerpt: 'Recover access to your CubSign account if you forgot your password.',
        category: 'Account',
        categorySlug: 'account',
        updatedAt: '2026-05-12',
        readingTime: 3,
        tags: ['Account', 'Password'],
        related: ['google-login', 'email-verification', 'contact-support'],
        content: [
            { type: 'p', text: 'If you sign in with email and password, you can reset your password at any time from the login page.' },
            { type: 'h2', text: 'Reset steps' },
            { type: 'ol', items: [
                'Go to Login and choose Forgot password.',
                'Enter the email address for your CubSign account.',
                'Open the password reset email and click the secure link.',
                'Choose a new password and save it.',
                'Sign in with your new password.',
            ]},
            { type: 'h2', text: 'Password tips' },
            { type: 'ul', items: [
                'Use a unique password you do not reuse on other sites.',
                'Prefer a long passphrase or a password manager.',
                'Do not share reset links. They expire for security.',
            ]},
            { type: 'h2', text: 'Using Google Login instead' },
            { type: 'p', text: 'If you normally sign in with Google, you do not need a CubSign password. Use Continue with Google on the login page.' },
        ],
    },
    {
        slug: 'supported-file-types',
        title: 'Supported File Types',
        excerpt: 'CubSign currently accepts PDF documents for upload and signing.',
        category: 'Uploading PDFs',
        categorySlug: 'uploading-pdfs',
        updatedAt: '2026-06-15',
        readingTime: 2,
        tags: ['Upload', 'PDF', 'Formats'],
        related: ['how-to-upload-a-pdf', 'maximum-upload-size', 'troubleshooting-upload-errors'],
        content: [
            { type: 'p', text: 'CubSign is built for PDF workflows. Upload a PDF, place fields, sign, and download a signed PDF.' },
            { type: 'h2', text: 'Accepted format' },
            { type: 'ul', items: [
                'PDF (.pdf) — required for document uploads.',
            ]},
            { type: 'h2', text: 'Not accepted for document upload' },
            { type: 'ul', items: [
                'Word (.doc, .docx), Excel, PowerPoint, and image-only packages as the main document.',
                'Password-protected PDFs that CubSign cannot open.',
                'Executable or archive files.',
            ]},
            { type: 'h2', text: 'Need to convert another format?' },
            { type: 'p', text: 'Export or “Save as PDF” from your word processor, spreadsheet, or design tool first, then upload the PDF to CubSign. Signature images (PNG/JPG) are only used when creating a signature, not as the main document file.' },
        ],
    },
    {
        slug: 'maximum-upload-size',
        title: 'Maximum Upload Size',
        excerpt: 'Learn CubSign’s 25 MB PDF upload limit and how to reduce large files.',
        category: 'Uploading PDFs',
        categorySlug: 'uploading-pdfs',
        updatedAt: '2026-06-15',
        readingTime: 3,
        tags: ['Upload', 'Limits'],
        related: ['how-to-upload-a-pdf', 'supported-file-types', 'troubleshooting-upload-errors'],
        content: [
            { type: 'p', text: 'CubSign accepts PDF uploads up to 25 MB. This limit keeps uploads reliable across browsers and mobile connections while covering most contracts, forms, and scanned packets.' },
            { type: 'h2', text: 'If your file is too large' },
            { type: 'ul', items: [
                'Compress the PDF with a trusted PDF compressor.',
                'Reduce scan resolution if the file is a photo-heavy scan.',
                'Split very large packets into separate PDFs when the workflow allows it.',
                'Remove unused high-resolution image attachments embedded in the PDF.',
            ]},
            { type: 'h2', text: 'Why uploads may still fail under 25 MB' },
            { type: 'p', text: 'A slow connection, browser extension, or temporary network issue can interrupt an upload even when the file size is valid. Retry on a stable connection, or try another browser. See Troubleshooting Upload Errors for more detail.' },
        ],
    },
    {
        slug: 'download-signed-pdf',
        title: 'Download Signed PDF',
        excerpt: 'Save the final signed PDF to your device after completing a signature.',
        category: 'Signing Documents',
        categorySlug: 'signing-documents',
        updatedAt: '2026-06-20',
        readingTime: 3,
        tags: ['Download', 'Signed PDF'],
        related: ['how-to-sign-a-pdf-online', 'audit-trail', 'share-documents'],
        content: [
            { type: 'p', text: 'After you finish signing, CubSign generates a signed PDF you can download and keep with your records.' },
            { type: 'h2', text: 'Download after signing yourself' },
            { type: 'ol', items: [
                'Complete all required signature fields.',
                'Finish the signing flow.',
                'Choose Download on the completion screen to save the PDF.',
            ]},
            { type: 'h2', text: 'Download from your workspace' },
            { type: 'p', text: 'If you are signed in, open Documents, select the completed document, and use Download. Keep a local copy for contracts you need offline.' },
            { type: 'h2', text: 'What the signed file includes' },
            { type: 'p', text: 'The downloaded PDF contains the applied signatures and related field values from the signing session. CubSign also maintains an audit trail of signing events for documents processed through the platform.' },
        ],
    },
    {
        slug: 'mobile-support',
        title: 'Mobile Support',
        excerpt: 'Sign PDFs on phones and tablets using a modern mobile browser.',
        category: 'Getting Started',
        categorySlug: 'getting-started',
        updatedAt: '2026-06-10',
        readingTime: 4,
        tags: ['Mobile', 'Browsers'],
        related: ['browser-compatibility', 'draw-vs-type-signature', 'how-to-sign-a-pdf-online'],
        content: [
            { type: 'p', text: 'CubSign is a web app. You can upload and sign PDFs from a phone or tablet without installing a native app.' },
            { type: 'h2', text: 'Recommended mobile experience' },
            { type: 'ul', items: [
                'Use the latest version of Safari on iOS or Chrome on Android.',
                'Stay on a stable Wi‑Fi or strong cellular connection for uploads.',
                'Allow the browser to keep the tab active while the PDF loads.',
            ]},
            { type: 'h2', text: 'Tips for signing on a phone' },
            { type: 'ul', items: [
                'Rotate to landscape when drawing a signature.',
                'Pinch to zoom when placing fields on dense pages.',
                'Prefer Type signature if drawing feels cramped.',
                'Download the signed PDF before closing the tab if you are signing as a guest.',
            ]},
            { type: 'h2', text: 'In-app browsers' },
            { type: 'p', text: 'Links opened inside some social or email in-app browsers can limit uploads or downloads. If something fails, open the page in your full Safari or Chrome browser and try again.' },
        ],
    },
    {
        slug: 'browser-compatibility',
        title: 'Browser Compatibility',
        excerpt: 'See which browsers CubSign supports for the best signing experience.',
        category: 'Getting Started',
        categorySlug: 'getting-started',
        updatedAt: '2026-06-10',
        readingTime: 3,
        tags: ['Browsers', 'Compatibility'],
        related: ['mobile-support', 'troubleshooting-upload-errors', 'how-to-sign-a-pdf-online'],
        content: [
            { type: 'p', text: 'CubSign runs in modern browsers that support current web standards for file upload, canvas drawing, and PDF rendering.' },
            { type: 'h2', text: 'Supported browsers' },
            { type: 'ul', items: [
                'Google Chrome (latest two major versions)',
                'Mozilla Firefox (latest two major versions)',
                'Microsoft Edge (latest two major versions)',
                'Apple Safari (latest two major versions on macOS and iOS)',
            ]},
            { type: 'h2', text: 'Not recommended' },
            { type: 'ul', items: [
                'Internet Explorer (not supported)',
                'Very outdated browser versions',
                'Browsers with aggressive script blockers that break uploads or the editor',
            ]},
            { type: 'h2', text: 'If the editor looks broken' },
            { type: 'p', text: 'Refresh the page, disable conflicting extensions temporarily, or switch browsers. Clearing cache for cubsign.com can also resolve stale asset issues after a product update.' },
        ],
    },
    {
        slug: 'secure-storage',
        title: 'Secure Storage',
        excerpt: 'How CubSign protects documents in transit and at rest.',
        category: 'Security',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        readingTime: 4,
        tags: ['Security', 'Encryption'],
        related: ['document-privacy', 'audit-trail', 'delete-documents'],
        content: [
            { type: 'p', text: 'Document security is part of every CubSign workflow, from the moment you upload a PDF to the moment you download or delete it.' },
            { type: 'h2', text: 'Encryption in transit' },
            { type: 'p', text: 'All traffic between your browser and CubSign uses HTTPS with modern TLS. That protects uploads, signing sessions, and downloads from being read on the network.' },
            { type: 'h2', text: 'Encryption at rest' },
            { type: 'p', text: 'Stored documents are protected with industry-standard encryption on the server side. Access is limited to authorized account holders and recipients with valid signing links.' },
            { type: 'h2', text: 'Session and access controls' },
            { type: 'ul', items: [
                'Signing links are unique to the intended workflow.',
                'Account sessions require authentication for workspace documents.',
                'You can delete documents you no longer need.',
            ]},
            { type: 'p', text: 'For privacy practices beyond storage, read Document Privacy and our Privacy Policy.' },
        ],
    },
    {
        slug: 'document-privacy',
        title: 'Document Privacy',
        excerpt: 'Who can see your documents and how CubSign handles private files.',
        category: 'Security',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        readingTime: 4,
        tags: ['Privacy', 'Security'],
        related: ['secure-storage', 'share-documents', 'delete-documents'],
        content: [
            { type: 'p', text: 'Your documents are private by default. CubSign does not publish uploaded PDFs publicly or list them in search engines.' },
            { type: 'h2', text: 'Who can access a document' },
            { type: 'ul', items: [
                'You, when signed into your account and viewing your workspace.',
                'Recipients you explicitly invite to sign via a secure link.',
                'Guest signing sessions you start yourself, for that session only.',
            ]},
            { type: 'h2', text: 'What CubSign staff can see' },
            { type: 'p', text: 'Support access is limited and used only when needed to investigate issues you report. We do not use your private documents for marketing.' },
            { type: 'h2', text: 'Your privacy controls' },
            { type: 'ul', items: [
                'Share only with people who need to sign.',
                'Download and delete documents when a matter is finished.',
                'Avoid uploading documents that contain secrets you are not authorized to process.',
            ]},
            { type: 'p', text: 'Read the full Privacy Policy for details on data handling and retention.' },
        ],
    },
    {
        slug: 'audit-trail',
        title: 'Audit Trail',
        excerpt: 'Understand the signing history CubSign records for accountability.',
        category: 'Security',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        readingTime: 4,
        tags: ['Audit', 'Compliance'],
        related: ['electronic-signature-legality', 'secure-storage', 'download-signed-pdf'],
        content: [
            { type: 'p', text: 'An audit trail is a chronological record of important events on a document. CubSign logs key actions so you can show when a document was viewed, signed, or sent.' },
            { type: 'h2', text: 'What is typically recorded' },
            { type: 'ul', items: [
                'Document created or uploaded',
                'Sent for signature',
                'Viewed by a recipient',
                'Signed by a participant',
                'Completed and available for download',
            ]},
            { type: 'h2', text: 'Why audit trails matter' },
            { type: 'p', text: 'Timestamps and related event details help demonstrate that signing happened in a controlled electronic process. That evidence supports dispute resolution and internal compliance reviews.' },
            { type: 'h2', text: 'Where to find history' },
            { type: 'p', text: 'Signed-in users can review document status and history from the Documents workspace. Keep downloaded signed PDFs with your business records when a matter requires long-term retention.' },
        ],
    },
    {
        slug: 'share-documents',
        title: 'Share Documents',
        excerpt: 'Send a PDF for signature and let recipients sign without creating an account.',
        category: 'Signing Documents',
        categorySlug: 'signing-documents',
        updatedAt: '2026-06-20',
        readingTime: 5,
        tags: ['Share', 'Recipients'],
        related: ['how-to-sign-a-pdf-online', 'audit-trail', 'document-privacy'],
        content: [
            { type: 'p', text: 'CubSign can send documents to other people for signature. Recipients open a secure link, review the PDF, and sign—usually without creating a CubSign account.' },
            { type: 'h2', text: 'How to send for signature' },
            { type: 'ol', items: [
                'Upload your PDF and open the editor.',
                'Add signature fields for each person who must sign.',
                'Enter recipient email addresses.',
                'Send the document and track status from your workspace.',
            ]},
            { type: 'h2', text: 'What recipients experience' },
            { type: 'p', text: 'Recipients get an email with a secure signing link. They review the document, complete assigned fields, and submit. You are notified as signatures come in.' },
            { type: 'h2', text: 'Sharing best practices' },
            { type: 'ul', items: [
                'Double-check recipient emails before sending.',
                'Tell recipients which browser works best if they are on mobile.',
                'Download the completed PDF once everyone has signed.',
            ]},
        ],
    },
    {
        slug: 'electronic-signature-legality',
        title: 'Electronic Signature Legality',
        excerpt: 'An overview of how electronic signatures work under common e-sign frameworks.',
        category: 'Security',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        readingTime: 6,
        tags: ['Legal', 'eSign'],
        related: ['audit-trail', 'draw-vs-type-signature', 'secure-storage'],
        content: [
            { type: 'p', text: 'Electronic signatures are widely recognized when parties intend to sign and consent to do business electronically. CubSign produces electronic signatures suitable for many everyday agreements.' },
            { type: 'h2', text: 'Common legal frameworks' },
            { type: 'ul', items: [
                'United States: ESIGN Act and UETA (state-level)',
                'European Union: eIDAS regulation for electronic identification and trust services',
                'Many other jurisdictions recognize electronic signatures with local variations',
            ]},
            { type: 'h2', text: 'What usually makes a signature effective' },
            { type: 'ul', items: [
                'Clear intent to sign',
                'Consent to use electronic records',
                'Association of the signature with the document',
                'A reliable record of the signing process',
            ]},
            { type: 'h2', text: 'Important disclaimer' },
            { type: 'p', text: 'CubSign provides technology and audit information to support electronic signing. This Help Center article is educational and is not legal advice. Requirements can differ by document type, industry, and country. Consult counsel for regulated or high-stakes agreements.' },
        ],
    },
    {
        slug: 'troubleshooting-upload-errors',
        title: 'Troubleshooting Upload Errors',
        excerpt: 'Fix common PDF upload failures and get back to signing quickly.',
        category: 'Troubleshooting',
        categorySlug: 'troubleshooting',
        updatedAt: '2026-06-15',
        readingTime: 5,
        tags: ['Upload', 'Errors', 'Fix'],
        related: ['maximum-upload-size', 'supported-file-types', 'browser-compatibility'],
        content: [
            { type: 'p', text: 'Most upload issues come from file type, size, network interruptions, or browser restrictions. Work through the checks below before contacting support.' },
            { type: 'h2', text: 'Quick checklist' },
            { type: 'ul', items: [
                'Confirm the file is a .pdf, not a Word or image file renamed to PDF.',
                'Confirm the file is 25 MB or smaller.',
                'Try a different browser or an Incognito/Private window.',
                'Disable VPN or ad blockers temporarily and retry.',
                'Switch from an in-app browser to Safari or Chrome.',
            ]},
            { type: 'h2', text: 'Common error messages' },
            { type: 'ul', items: [
                'File too large — compress or split the PDF.',
                'Invalid file type — export a real PDF from your source app.',
                'Upload failed / network error — retry on a stable connection.',
            ]},
            { type: 'h2', text: 'Still stuck?' },
            { type: 'p', text: 'Note the exact error text, browser, device, and approximate file size, then contact support@cubsign.com. That information helps us reproduce and resolve the issue faster.' },
        ],
    },
    {
        slug: 'contact-support',
        title: 'Contact Support',
        excerpt: 'Reach the CubSign team when you need help beyond the Help Center.',
        category: 'Troubleshooting',
        categorySlug: 'troubleshooting',
        updatedAt: '2026-06-20',
        readingTime: 2,
        tags: ['Support', 'Contact'],
        related: ['troubleshooting-upload-errors', 'email-verification', 'reset-password'],
        content: [
            { type: 'p', text: 'If you cannot find an answer in the Help Center, our support team is ready to help with account, upload, and signing questions.' },
            { type: 'h2', text: 'How to contact us' },
            { type: 'ul', items: [
                'Email: support@cubsign.com',
                'Contact form: use the Contact page on cubsign.com',
            ]},
            { type: 'h2', text: 'What to include' },
            { type: 'ul', items: [
                'A short description of what you were trying to do',
                'Screenshots or the exact error message',
                'Browser and device (for example, Chrome on Windows, Safari on iPhone)',
                'Whether you are signed in or signing as a guest',
            ]},
            { type: 'h2', text: 'Response expectations' },
            { type: 'p', text: 'We aim to respond as quickly as possible during Early Access. Complex technical issues may take longer if we need logs or reproduction steps.' },
        ],
    },
    {
        slug: 'create-your-cubsign-account',
        title: 'Create Your CubSign Account',
        excerpt: 'Set up a free CubSign account to store documents and send for signature.',
        category: 'Getting Started',
        categorySlug: 'getting-started',
        updatedAt: '2026-05-12',
        readingTime: 3,
        tags: ['Account', 'Getting Started'],
        related: ['email-verification', 'google-login', 'how-to-sign-a-pdf-online'],
        content: [
            { type: 'p', text: 'You can sign a single PDF as a guest, but a free CubSign account unlocks storage, history, and multi-recipient workflows.' },
            { type: 'h2', text: 'Create an account' },
            { type: 'ol', items: [
                'Click Get Started Free or Register.',
                'Sign up with email or Continue with Google.',
                'Verify your email if prompted.',
                'Open Overview to start uploading and managing documents.',
            ]},
            { type: 'h2', text: 'What you get during Early Access' },
            { type: 'ul', items: [
                'Free PDF signing',
                'Document workspace and downloads',
                'Ability to send documents for signature',
                'Audit-friendly signing history',
            ]},
            { type: 'p', text: 'No credit card is required to create an Early Access account.' },
        ],
    },
    {
        slug: 'what-is-cubsign',
        title: 'What Is CubSign?',
        excerpt: 'A quick overview of CubSign and what you can do with it.',
        category: 'Getting Started',
        categorySlug: 'getting-started',
        updatedAt: '2026-06-20',
        readingTime: 3,
        tags: ['Getting Started', 'Overview'],
        related: ['create-your-cubsign-account', 'how-to-sign-a-pdf-online', 'electronic-signature-legality'],
        content: [
            { type: 'p', text: 'CubSign is a web-based platform for signing PDF documents online. Upload a PDF, place signature fields, sign yourself or send to others, then download the completed file.' },
            { type: 'h2', text: 'Who CubSign is for' },
            { type: 'ul', items: [
                'Individuals signing contracts, forms, and agreements',
                'Small teams collecting signatures from clients or partners',
                'Anyone who wants a faster alternative to print-and-scan',
            ]},
            { type: 'h2', text: 'Core capabilities' },
            { type: 'ul', items: [
                'Upload and sign PDFs in the browser',
                'Draw, type, or upload a signature',
                'Request signatures from recipients',
                'Secure storage and document history for accounts',
            ]},
            { type: 'p', text: 'CubSign is free during Early Access while we improve the product based on user feedback.' },
        ],
    },
];

export const helpFaqs = [
    {
        question: 'Is CubSign free to use?',
        answer: 'Yes. CubSign is completely free during Early Access. No credit card is required to upload, sign, or send PDFs for signature.',
    },
    {
        question: 'Do I need an account to sign a PDF?',
        answer: 'No. You can sign a PDF as a guest. Creating a free account unlocks document storage, history, and sending documents to others for signature.',
    },
    {
        question: 'What file types does CubSign support?',
        answer: 'CubSign accepts PDF files up to 25 MB. Export other formats to PDF before uploading.',
    },
    {
        question: 'Are electronic signatures legally binding?',
        answer: 'Electronic signatures are widely recognized under frameworks such as the US ESIGN Act and EU eIDAS when intent and consent requirements are met. CubSign provides audit-friendly signing records. This is not legal advice—check local requirements for your document type.',
    },
    {
        question: 'How do I reset my password?',
        answer: 'On the Login page, choose Forgot password, enter your email, and follow the reset link we send you. Google Login users can continue with Google instead.',
    },
    {
        question: 'Can recipients sign without an account?',
        answer: 'Yes. Recipients open a secure email link and can sign without creating a CubSign account.',
    },
    {
        question: 'How do I contact support?',
        answer: 'Email support@cubsign.com or use the Contact page. Include the error message, browser, and what you were trying to do.',
    },
    {
        question: 'Is my document private?',
        answer: 'Documents are private by default. Only you and people you invite to sign can access them. You can delete documents from your workspace at any time.',
    },
];

export function getCategoryBySlug(slug) {
    return helpCategories.find((c) => c.slug === slug) ?? null;
}

export function getArticleBySlug(slug) {
    return helpArticles.find((a) => a.slug === slug) ?? null;
}

export function getArticlesByCategory(categorySlug) {
    return helpArticles.filter((a) => a.categorySlug === categorySlug);
}

/** Common search chips shown under the Help Center search field. */
export const popularSearches = [
    'upload PDF',
    'sign online',
    'draw signature',
    'reset password',
    'Google login',
    '25 MB',
    'audit trail',
    'mobile',
    'upload error',
    'contact support',
];

export function getRelatedArticles(slug, limit = 4) {
    const current = getArticleBySlug(slug);
    if (!current) return helpArticles.slice(0, limit);

    const fromRelated = (current.related ?? [])
        .map((relatedSlug) => getArticleBySlug(relatedSlug))
        .filter(Boolean);

    if (fromRelated.length >= limit) return fromRelated.slice(0, limit);

    const extras = helpArticles.filter(
        (a) => a.slug !== slug && a.categorySlug === current.categorySlug && !fromRelated.some((r) => r.slug === a.slug),
    );

    return [...fromRelated, ...extras].slice(0, limit);
}

/** Articles ordered by category, then title — used for prev/next navigation. */
export function getOrderedArticles() {
    const categoryOrder = helpCategories.map((c) => c.slug);

    return [...helpArticles].sort((a, b) => {
        const catDiff = categoryOrder.indexOf(a.categorySlug) - categoryOrder.indexOf(b.categorySlug);
        if (catDiff !== 0) return catDiff;
        return a.title.localeCompare(b.title);
    });
}

export function getAdjacentArticles(slug) {
    const ordered = getOrderedArticles();
    const index = ordered.findIndex((a) => a.slug === slug);

    if (index === -1) {
        return { previous: null, next: null };
    }

    return {
        previous: index > 0 ? ordered[index - 1] : null,
        next: index < ordered.length - 1 ? ordered[index + 1] : null,
    };
}

export function getRecentlyUpdatedArticles(limit = 5) {
    return [...helpArticles]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) || a.title.localeCompare(b.title))
        .slice(0, limit);
}

export function getPopularArticles(limit = 6) {
    return [...helpArticles]
        .sort((a, b) => b.readingTime - a.readingTime || a.title.localeCompare(b.title))
        .slice(0, limit);
}

export function searchHelpArticles(query) {
    const q = query.trim().toLowerCase();
    if (!q) return helpArticles;

    return helpArticles.filter((article) => {
        const haystack = [
            article.title,
            article.excerpt,
            article.category,
            ...(article.tags ?? []),
            ...article.content.flatMap((block) => {
                if (block.text) return [block.text];
                if (block.items) return block.items;
                return [];
            }),
        ]
            .join(' ')
            .toLowerCase();

        return haystack.includes(q);
    });
}

export function formatHelpDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Split plain text into segments, auto-linking known article titles
 * (longest titles first). Does not mutate source content.
 */
export function linkifyHelpText(text, currentSlug = null) {
    if (!text) return [{ type: 'text', value: '' }];

    const titles = helpArticles
        .filter((a) => a.slug !== currentSlug)
        .map((a) => ({ title: a.title, slug: a.slug }))
        .sort((a, b) => b.title.length - a.title.length);

    if (!titles.length) return [{ type: 'text', value: text }];

    const escaped = titles.map((t) => t.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'g');
    const parts = text.split(pattern);
    const titleToSlug = Object.fromEntries(titles.map((t) => [t.title, t.slug]));

    return parts
        .filter((part) => part !== '')
        .map((part) => {
            if (titleToSlug[part]) {
                return { type: 'link', value: part, slug: titleToSlug[part] };
            }
            return { type: 'text', value: part };
        });
}
