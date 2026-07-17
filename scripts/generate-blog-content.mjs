/**
 * One-shot generator for resources/js/constants/blog.js
 * Run: node scripts/generate-blog-content.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../resources/js/constants/blog.js');

const author = {
    name: 'CubSign Team',
    role: 'Product & Content',
    initials: 'CT',
    avatarBg: 'bg-blue-600',
    bio: 'The CubSign Team writes practical guides on PDF signing, electronic signatures, document security, and paperless workflows for freelancers, small businesses, and growing teams.',
    social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
    },
};

const categories = [
    { slug: 'getting-started', name: 'Getting Started', description: 'First steps with CubSign and online PDF signing.', color: 'from-blue-600 to-indigo-700' },
    { slug: 'pdf-signing', name: 'PDF Signing', description: 'How to sign, send, and manage PDF documents.', color: 'from-cyan-600 to-blue-700' },
    { slug: 'electronic-signatures', name: 'Electronic Signatures', description: 'What e-signatures are and how they work in practice.', color: 'from-emerald-600 to-teal-700' },
    { slug: 'security', name: 'Security', description: 'Encryption, access control, and document protection.', color: 'from-rose-600 to-orange-700' },
    { slug: 'business', name: 'Business', description: 'Productivity and paperless workflows for teams.', color: 'from-amber-500 to-orange-600' },
    { slug: 'product-updates', name: 'Product Updates', description: 'What’s new in CubSign Early Access.', color: 'from-violet-600 to-purple-700' },
    { slug: 'guides', name: 'Guides', description: 'Step-by-step tutorials and best practices.', color: 'from-sky-600 to-blue-700' },
    { slug: 'legal', name: 'Legal', description: 'Legality, compliance basics, and contract signing.', color: 'from-slate-600 to-gray-800' },
];

/** Shared CTAs woven into articles for internal linking */
const CTA = {
    help: 'For step-by-step product instructions, visit the CubSign Help Center.',
    features: 'Explore the CubSign Features page to see signing, tracking, and templates in one place.',
    upload: 'Ready to try it? Open the Upload PDF page and sign your first document in under a minute.',
    contact: 'Questions about your workflow? Reach us from the Contact page or email support@cubsign.com.',
};

function p(...parts) {
    return { type: 'p', text: parts.join(' ') };
}
function h2(text) {
    return { type: 'h2', text };
}
function ul(...items) {
    return { type: 'ul', items };
}
function ol(...items) {
    return { type: 'ol', items };
}

function countWords(content) {
    return content
        .flatMap((b) => {
            if (b.text) return b.text.split(/\s+/);
            if (b.items) return b.items.flatMap((i) => i.split(/\s+/));
            return [];
        })
        .filter(Boolean).length;
}

function readingTime(words) {
    return Math.max(5, Math.round(words / 220));
}

const articles = [];

function add(meta, content, faq, related) {
    const words = countWords(content);
    if (words < 950) {
        console.warn(`LOW WORD COUNT ${meta.slug}: ${words}`);
    }
    articles.push({
        ...meta,
        author,
        readingTime: readingTime(words),
        wordCount: words,
        content,
        faq,
        related,
    });
}

// ─── 1 ───
add(
    {
        slug: 'how-to-sign-a-pdf-online',
        title: 'How to Sign a PDF Online',
        excerpt: 'Learn how to upload, sign, and download a PDF in your browser with CubSign—no printing, scanning, or desktop software required.',
        category: 'PDF Signing',
        categorySlug: 'pdf-signing',
        publishedAt: '2025-12-02',
        updatedAt: '2026-06-10',
        tags: ['PDF Signing', 'Tutorial', 'Getting Started'],
        keywords: ['sign pdf online', 'electronic signature pdf', 'sign document online free', 'pdf signature tool'],
        featured: true,
        popular: true,
        heroGradient: 'from-emerald-600 to-teal-700',
        metaTitle: 'How to Sign a PDF Online in Minutes | CubSign',
        metaDescription: 'Step-by-step guide to signing a PDF online with CubSign. Upload your file, place a signature, and download a signed PDF securely.',
    },
    [
        p('Signing a PDF online used to mean emailing attachments back and forth, printing pages, scribbling with a pen, then scanning everything again. That workflow wastes time and creates messy versions of the same contract. CubSign replaces it with a browser-based flow: upload your PDF, place a signature field, sign, and download—often in under a minute.'),
        p('This guide walks through the practical steps, what to check before you finish, and how to avoid the most common mistakes people make when signing documents digitally. Whether you are approving a freelance agreement, an NDA, or an internal form, the same pattern applies.'),
        h2('What you need before you start'),
        p('You only need a modern browser and a PDF file. CubSign works on desktop, tablet, and mobile without installing plugins. Guest signing is available for one-off documents; a free CubSign account adds history, storage, and the ability to request signatures from others.'),
        ul(
            'A PDF that is not password-protected (or unlocked before upload).',
            'A clear idea of where the signature belongs on the page.',
            'Optional: a saved signature image if you prefer upload over drawing.',
        ),
        p(CTA.upload),
        h2('Step 1: Upload your PDF'),
        p('Open the Upload PDF page and drag your file into the drop zone, or click to browse. CubSign accepts standard PDF files within the stated size limit. When the upload finishes, the editor opens automatically so you can place fields without switching tools.'),
        p('If the file fails to upload, check that it is a real PDF (not a renamed Word file), that it is under the size limit, and that your connection is stable. The Help Center covers upload troubleshooting in more detail.'),
        h2('Step 2: Place signature and related fields'),
        p('In the editor, add a signature field where the document expects a sign-off. You can also place date and text fields when the form asks for them. Drag fields to align with printed lines, and resize them so the signature fits cleanly without covering important clauses.'),
        p('Good placement matters. A signature floating in the margin looks careless and can confuse reviewers. Align with the signature block, leave a little padding from page edges, and zoom in on dense pages before you lock the position.'),
        h2('Step 3: Create your signature'),
        p('CubSign supports draw, type, and upload. Drawing works well on trackpads and touchscreens. Typing produces a consistent handwriting-style mark that stays readable at small sizes. Uploading is ideal when you already have an approved signature image for brand or personal use.'),
        ol(
            'Choose Draw, Type, or Upload in the signature panel.',
            'Create or select the mark you want to use.',
            'Apply it to the signature field on the document.',
            'Review every page that contains required fields.',
        ),
        h2('Step 4: Review and download'),
        p('Before you finish, scroll through the full PDF. Confirm names, dates, and amounts still look correct after signing. Electronic signatures do not fix typos in the underlying contract—they only record your agreement to the current text.'),
        p('When you are satisfied, complete the flow and download the signed PDF. Keep a copy in your records alongside any email confirmation. If you used an account, the document also appears in your CubSign workspace for later access.'),
        h2('Signing without an account vs with an account'),
        p('Guest mode is perfect for a single personal signature. Create a free account when you need to store documents, track status, or send the same PDF to recipients who will sign remotely. Recipients can usually complete their part from a secure link without creating their own account.'),
        p(CTA.features),
        h2('Mobile signing tips'),
        p('On phones, rotate to landscape when drawing a signature so you have more horizontal space. Pinch to zoom before placing fields on crowded pages. Prefer typed signatures if your finger strokes look shaky on a small screen. Download the finished file immediately so it is saved to your device.'),
        h2('Common problems and quick fixes'),
        ul(
            'Signature looks blurry: redraw more slowly or use Type instead of Draw.',
            'Field covers text: resize and nudge the field away from the clause line.',
            'Wrong page signed: remove the field and place it on the correct page.',
            'Cannot upload: remove password protection or compress a very large scan.',
        ),
        p(CTA.help),
        h2('Why online PDF signing is safer than print-sign-scan'),
        p('Printed copies can be lost, photographed without context, or altered between scans. A proper electronic signing flow keeps the PDF intact, records the signing event, and produces a single finished file you can archive. CubSign transmits documents over HTTPS and stores them with encryption so casual exposure is far less likely than emailing unsigned drafts indefinitely.'),
        p('For teams, the bigger win is consistency: everyone uses the same process, the same audit-friendly record, and the same downloadable output. That reduces “which version did we sign?” confusion that often follows paper workflows.'),
        h2('Archiving signed PDFs for your records'),
        p('Treat the downloaded signed PDF as the official record. Save it to the folder or drive location your team uses for executed agreements—not only in email sent items. If you use CubSign with an account, the workspace gives you a second place to retrieve the file, but your finance or legal team may still want a copy in their system of record.'),
        p('Name files predictably: counterpart, document type, and date signed. Future-you will search for those strings when renewal season arrives.'),
        h2('Sending the same document to someone else'),
        p('When you are the sender rather than the sole signer, add recipient emails, assign each signature field to the right person, and include a short note explaining what you need. Recipients complete their part from a secure link, often without creating an account.'),
        p('See our guide on how to request digital signatures for a fuller walkthrough of multi-party workflows.'),
        h2('Templates and repeat documents'),
        p('If you sign the same agreement shape every month, standardize the PDF layout once. Consistent signature blocks speed placement and reduce recipient confusion.'),
        p(CTA.features),
        p(CTA.contact),
    ],
    [
        { question: 'Do I need an account to sign a PDF with CubSign?', answer: 'No. You can upload, sign, and download as a guest. An account adds storage, history, and the ability to request signatures from others.' },
        { question: 'Are signatures created online legally valid?', answer: 'In many jurisdictions, electronic signatures are legally recognized when there is clear intent to sign and a reliable record of the signing process. Always confirm requirements for your document type and location.' },
        { question: 'Can I sign a PDF on my phone?', answer: 'Yes. CubSign works in mobile browsers. Landscape mode and typed signatures often produce the cleanest results on small screens.' },
    ],
    ['electronic-signature-vs-digital-signature', 'best-practices-for-signing-contracts-online', 'how-to-sign-pdfs-on-mobile', 'common-mistakes-when-signing-pdfs'],
);

// ─── 2 ───
add(
    {
        slug: 'electronic-signature-vs-digital-signature',
        title: 'Electronic Signature vs Digital Signature',
        excerpt: 'Electronic and digital signatures are related but not identical. Learn the difference, when each applies, and how CubSign fits everyday signing needs.',
        category: 'Electronic Signatures',
        categorySlug: 'electronic-signatures',
        publishedAt: '2025-12-10',
        updatedAt: '2026-05-22',
        tags: ['eSignature', 'Digital Signature', 'Compliance'],
        keywords: ['electronic vs digital signature', 'esignature meaning', 'digital signature difference', 'what is an electronic signature'],
        featured: false,
        popular: true,
        heroGradient: 'from-blue-600 to-indigo-700',
        metaTitle: 'Electronic Signature vs Digital Signature Explained | CubSign',
        metaDescription: 'Clear comparison of electronic signatures and digital signatures, plus practical guidance for everyday PDF signing with CubSign.',
    },
    [
        p('People often use “electronic signature” and “digital signature” as if they mean the same thing. In casual conversation that is fine. In compliance conversations, the distinction matters. Understanding both helps you choose the right tool for contracts, onboarding packets, and vendor agreements.'),
        p('This article explains the practical difference in plain language, then connects it to how CubSign supports everyday electronic signing for freelancers, small businesses, and teams that need speed without unnecessary complexity.'),
        h2('What is an electronic signature?'),
        p('An electronic signature is any electronic process that indicates a person agrees to a document. That can include typing a name, drawing a signature on a screen, clicking an “I agree” button, or applying a saved signature image. The core idea is intent: the signer meant to approve the specific document presented to them.'),
        p('Electronic signatures are widely used because they mirror how people already work—email, browsers, and mobile devices. They remove printing and shipping delays while still producing a finished PDF you can store with the rest of your records.'),
        h2('What is a digital signature?'),
        p('A digital signature is a more specific technical mechanism. It typically uses cryptography (often public-key infrastructure) to bind a signature to a document and detect later changes. Think of it as a tamper-evident seal plus identity credentials issued through a certificate authority or similar trust framework.'),
        p('Digital signatures are common in regulated industries, certain government workflows, and high-assurance document exchange. They solve a narrower problem than “can someone sign this PDF from their phone?”—they focus on cryptographic integrity and certificate-backed identity.'),
        h2('Side-by-side comparison'),
        ul(
            'Electronic signature: broad category focused on intent and consent to sign electronically.',
            'Digital signature: cryptographic method that can prove integrity and support stronger identity claims.',
            'Everyday contracts: electronic signing platforms are usually enough for NDAs, quotes, and HR forms.',
            'High-assurance needs: digital certificates and specialized PKI may be required by policy or law.',
        ),
        p('If your organization has a written e-sign policy, read it before choosing a workflow. Many policies accept electronic signatures for commercial agreements while reserving digital certificates for specific document classes.'),
        h2('What courts and regulators usually care about'),
        p('Across common frameworks such as the US ESIGN Act and UETA, and Europe’s eIDAS regulation, the emphasis is on reliable evidence of agreement—not on ink. Intent to sign, association of the signature with the document, and a trustworthy record of the event are the recurring themes.'),
        p('Audit trails help. Timestamps, IP addresses, recipient email delivery, and a locked final PDF create a narrative of what happened. CubSign logs key events so you can show when a document was viewed, signed, and completed.'),
        h2('How CubSign approaches everyday signing'),
        p('CubSign is built for practical electronic signatures on PDFs: upload, place fields, sign or request signatures, then download. The product prioritizes clarity and speed while keeping documents encrypted in transit and at rest. That covers the majority of small-business and freelancer use cases.'),
        p(CTA.features),
        p('When a counterparty requires certificate-based digital signatures specifically, confirm that requirement in writing. Not every “please e-sign this” email means PKI. Often it simply means “please sign without printing.”'),
        h2('Records you should keep either way'),
        p('Whether you use electronic or digital signatures, archive the final PDF, the invitation email, and any platform activity summary your process relies on. If a question arises later, those pieces tell a coherent story about intent and timing.'),
        p('CubSign helps on the electronic side by keeping documents encrypted, limiting access, and logging core signing events alongside the finished file.'),
        h2('Choosing the right option for your document'),
        ol(
            'Identify the document type (commercial contract, HR form, regulated filing).',
            'Check whether your industry or customer mandates certificate-based signing.',
            'Confirm that all parties consent to electronic processes.',
            'Use a platform that preserves the final PDF and signing activity.',
            'Archive the signed file with related correspondence.',
        ),
        h2('Myths worth retiring'),
        p('Myth one: electronic signatures are never legal. In many places they are expressly recognized. Myth two: only wet ink is “real.” Courts routinely accept electronic records when authenticity can be shown. Myth three: every PDF must use a certificate. Most day-to-day agreements do not.'),
        p('Still, legality is context-dependent. Wills, certain real-estate filings, and notarized acts may have special rules. When stakes are high, ask counsel—not a blog post—for jurisdiction-specific advice.'),
        p(CTA.help),
        h2('Practical takeaway'),
        p('Use electronic signatures for speed and clarity on ordinary PDFs. Treat digital signatures as a specialized cryptographic tool when policy demands them. CubSign helps you get the first category done well: sign online, keep an audit-friendly trail, and move work forward without paper.'),
        h2('Regional frameworks at a glance'),
        p('In the United States, the ESIGN Act and state UETA laws establish a federal baseline for electronic records in interstate commerce. In the European Union, eIDAS defines tiers of electronic signatures and when advanced forms may be required. Other countries have their own statutes—always confirm locally for regulated industries.'),
        p('None of these frameworks typically require a specific brand of software. They focus on consent, integrity, and evidence. That is why audit trails and final PDF hygiene matter as much as the signature graphic.'),
        h2('When to escalate to counsel'),
        p('Real-estate closings, wills, powers of attorney, and certain government filings may have special formalities. If your document type is on that list, pause before sending a generic e-sign link and confirm requirements with qualified counsel.'),
        p('CubSign Early Access remains free while we keep improving the product with user feedback. Start with a low-risk PDF, then expand to customer contracts once the rhythm feels natural.'),
        h2('Glossary for your team'),
        p('Share these definitions internally so sales, legal, and operations use the same vocabulary: electronic signature (intent + process), digital signature (cryptographic seal), audit trail (event history), and completion (all required parties signed).'),
        p('Aligned language reduces back-and-forth when you roll out CubSign across departments.'),
        p(CTA.upload),
        p(CTA.contact),
    ],
    [
        { question: 'Is an electronic signature the same as a digital signature?', answer: 'No. Electronic signature is the broad category for indicating agreement electronically. Digital signature usually refers to a cryptographic method that seals a document and can detect tampering.' },
        { question: 'Which one should small businesses use?', answer: 'Most small businesses use electronic signatures for contracts, NDAs, and onboarding forms. Choose certificate-based digital signatures when a customer, regulator, or internal policy explicitly requires them.' },
        { question: 'Does CubSign provide electronic signatures?', answer: 'Yes. CubSign is designed for electronic PDF signing in the browser, with secure transmission, storage, and activity logging for everyday business documents.' },
    ],
    ['how-secure-are-electronic-signatures', 'are-electronic-signatures-legally-binding', 'best-practices-for-signing-contracts-online', 'how-to-sign-a-pdf-online'],
);

// ─── 3 ───
add(
    {
        slug: 'how-secure-are-electronic-signatures',
        title: 'How Secure Are Electronic Signatures?',
        excerpt: 'Security is more than a padlock icon. Here is how electronic signatures protect documents—and what you should still verify as a signer or sender.',
        category: 'Security',
        categorySlug: 'security',
        publishedAt: '2025-12-18',
        updatedAt: '2026-06-01',
        tags: ['Security', 'Encryption', 'Trust'],
        keywords: ['electronic signature security', 'are esignatures safe', 'pdf signing security', 'secure document signing'],
        featured: false,
        popular: true,
        heroGradient: 'from-rose-600 to-orange-700',
        metaTitle: 'How Secure Are Electronic Signatures? | CubSign',
        metaDescription: 'Learn how encryption, access controls, and audit trails make electronic signatures secure—and how CubSign protects your PDFs.',
    },
    [
        p('Security questions come up the moment a contract leaves email and enters a signing tool. People want to know whether a drawn signature can be forged, whether files are encrypted, and whether a finished PDF can be quietly altered later. Those are fair questions. Electronic signatures can be highly secure when the platform and the process are designed carefully.'),
        p('This article breaks security into layers: the connection, the stored file, who can open the document, and the evidence trail after signing. Use it as a checklist when you evaluate CubSign or any signing workflow.'),
        h2('Security starts with transport encryption'),
        p('Every modern signing product should force HTTPS with strong TLS. That protects documents and credentials while they move between your browser and the server. Without transport encryption, a signature process is only as safe as the least secure network hop.'),
        p('CubSign transmits data over HTTPS so uploads, signing sessions, and downloads are encrypted in transit. Prefer trusted networks for highly sensitive contracts, and avoid signing from shared public machines whenever possible.'),
        h2('Encryption at rest protects stored PDFs'),
        p('Documents do not disappear after you close the tab. Platforms store files so you can resume work, share with recipients, or download again later. Encryption at rest means those stored bytes are protected with industry-standard algorithms such as AES-256 rather than sitting as plain files on disk.'),
        p('Access controls matter just as much as encryption. A strongly encrypted file that anyone can download is still a problem. CubSign restricts document access to authorized users and recipients with valid signing links.'),
        h2('Identity evidence and signing links'),
        p('Most electronic signature workflows identify signers through email invitations and unique links. That is not the same as government ID verification, but it creates a clear chain: the document was sent to a specific address, opened from a controlled link, and completed at a recorded time.'),
        p('As a sender, double-check recipient emails before you hit send. As a signer, open links only from expected senders. Phishing remains a human-layer risk in every digital process—including traditional email attachments.'),
        h2('Audit trails make disputes harder to invent'),
        p('A signature alone answers “who marked the page?” An audit trail answers “what sequence of events led here?” Useful events include document creation, views, signature application, and completion. Timestamps and IP metadata add context if questions arise months later.'),
        p('Keep the final signed PDF together with any platform activity record your team relies on. CubSign logs key signing events so your workspace history supports the finished file.'),
        h2('Can someone forge an electronic signature?'),
        p('A casual screenshot of a signature image is not the same as a completed signing session inside a controlled platform. Forgery risk drops when the signature is bound to a specific document version, a tracked session, and a completion event. Still, no system eliminates fraud by itself—process discipline matters.'),
        ul(
            'Send documents only to verified recipient addresses.',
            'Use clear filenames and version labels in the PDF itself.',
            'Review the final file before you archive or share it externally.',
            'Revoke or avoid reusing stale signing links when your platform supports it.',
        ),
        h2('Compare electronic signing to paper'),
        p('Paper feels familiar, but it is not automatically safer. Wet-ink signatures can be photocopied, pages can be swapped, and courier packages can be lost. Electronic flows reduce some of those risks while introducing new ones (account takeover, phishing). The goal is to manage both categories deliberately.'),
        p('For many small businesses, a secure electronic workflow with encrypted storage and an audit trail is a clear upgrade over emailed Word drafts and scanned JPEGs of signature pages.'),
        h2('Incident response basics'),
        p('If you suspect a signing link was forwarded to the wrong person, contact the sender immediately and ask them to void or replace the request. Do not sign documents from unknown senders, even if the PDF looks professional.'),
        p('CubSign support can help you reason about suspicious messages that claim to be from our platform.'),
        h2('What CubSign does to protect documents'),
        p('CubSign focuses on practical protections: HTTPS in transit, encrypted storage, restricted access, and activity logging. Combined with a simple UI, that means fewer accidental exposures from “please print and scan” email chains that copy sensitive PDFs to multiple personal inboxes.'),
        p(CTA.features),
        p(CTA.help),
        h2('A short security checklist for every signing session'),
        ol(
            'Confirm you are on the real CubSign site or a trusted signing link.',
            'Verify the document title, parties, and key commercial terms before signing.',
            'Use a private device when documents contain personal or financial data.',
            'Download and archive the completed PDF promptly.',
            'Contact support if anything about the request looks unexpected.',
        ),
        h2('Security culture on your team'),
        p('Technology alone cannot stop a teammate from forwarding a confidential PDF to a personal email address. Pair CubSign with simple training: verify recipient addresses, use descriptive subject lines, and treat signing links like credentials.'),
        p('Quarterly, review who has access to your CubSign workspace and whether exported files still live in the right shared drives.'),
        h2('Vendor due diligence checklist'),
        p('Before you trust any signing platform with customer data, confirm HTTPS by default, encryption at rest, clear privacy terms, and support contact paths. CubSign publishes security-oriented guidance in the Help Center and on this Blog for teams evaluating tools during Early Access.'),
        p('Document your vendor choice in a short internal memo so future hires understand why PDFs should flow through CubSign instead of personal inboxes.'),
        p(CTA.upload),
        p(CTA.contact),
    ],
    [
        { question: 'Are electronic signatures encrypted?', answer: 'Reputable platforms encrypt documents in transit with HTTPS/TLS and encrypt stored files at rest. CubSign follows this model for uploaded PDFs.' },
        { question: 'Is an electronic signature safer than paper?', answer: 'It can be. Electronic workflows reduce lost pages and uncontrolled photocopies, while adding encryption and activity logs. You still need good email hygiene and access control.' },
        { question: 'What should I do if I receive a suspicious signing link?', answer: 'Do not enter credentials or sign. Confirm the request with the sender through a known channel, and contact CubSign support if the message claims to be from us but looks unusual.' },
    ],
    ['how-to-protect-pdf-documents', 'securing-your-documents-with-cubsign', 'electronic-signature-vs-digital-signature', 'are-electronic-signatures-legally-binding'],
);

// Article 4 — small business (uses theme builder for full length)
const catalog = [
    {
        slug: 'how-small-businesses-save-time-using-esignatures',
        title: 'How Small Businesses Save Time Using eSignatures',
        excerpt: 'From quotes to vendor forms, electronic signatures remove days of delay. See where small teams reclaim hours every week with CubSign.',
        category: 'Business', categorySlug: 'business', publishedAt: '2026-01-05', updatedAt: '2026-06-05',
        tags: ['Small Business', 'Productivity', 'eSignature'],
        keywords: ['esignature for small business', 'save time signing documents', 'paperless small business', 'online contract signing'],
        popular: true, heroGradient: 'from-amber-500 to-orange-600',
        metaTitle: 'How Small Businesses Save Time with eSignatures | CubSign',
        metaDescription: 'Practical ways freelancers and small teams use electronic signatures to close deals faster and cut admin time with CubSign.',
        related: ['benefits-of-paperless-workflows', 'how-to-request-digital-signatures', 'best-practices-for-signing-contracts-online', 'how-to-sign-a-pdf-online'],
        themes: [
            'replace print-sign-scan loops on client quotes and statements of work',
            'send vendor NDAs the same morning you decide to hire',
            'track pending signatures instead of guessing from email threads',
            'standardize internal policy acknowledgments as signing flows',
            'measure turnaround time before and after CubSign to prove ROI',
        ],
    },
    {
        slug: 'best-practices-for-signing-contracts-online',
        title: 'Best Practices for Signing Contracts Online',
        excerpt: 'A practical checklist for preparing, reviewing, and signing contracts electronically without missing critical details.',
        category: 'Guides', categorySlug: 'guides', publishedAt: '2026-01-12', updatedAt: '2026-06-08',
        tags: ['Contracts', 'Best Practices'], keywords: ['sign contracts online', 'online contract best practices', 'esign checklist'],
        popular: true, heroGradient: 'from-sky-600 to-blue-700',
        metaTitle: 'Best Practices for Signing Contracts Online | CubSign',
        metaDescription: 'Follow these best practices to review, sign, and archive contracts online with fewer errors and stronger records.',
        related: ['how-to-sign-a-pdf-online', 'common-mistakes-when-signing-pdfs', 'are-electronic-signatures-legally-binding', 'how-to-request-digital-signatures'],
        themes: ['review parties and commercial terms before any signature field is placed', 'confirm you are signing the final PDF version—not a draft watermarked copy', 'use consistent signature blocks so counterparts know where to sign', 'keep negotiation in tracked comments or email, then lock a clean PDF for signing', 'archive the completed file with the deal folder the same day'],
    },
    {
        slug: 'how-to-protect-pdf-documents',
        title: 'How to Protect PDF Documents',
        excerpt: 'Reduce accidental exposure of sensitive PDFs with smarter sharing habits, access controls, and secure signing workflows.',
        category: 'Security', categorySlug: 'security', publishedAt: '2026-01-20', updatedAt: '2026-05-30',
        tags: ['PDF Security', 'Privacy'], keywords: ['protect pdf', 'secure pdf sharing', 'pdf document security'],
        popular: false, heroGradient: 'from-rose-600 to-pink-700',
        metaTitle: 'How to Protect PDF Documents | CubSign',
        metaDescription: 'Learn practical ways to protect PDF documents during sharing and signing—from access control to encrypted storage.',
        related: ['how-secure-are-electronic-signatures', 'securing-your-documents-with-cubsign', 'benefits-of-paperless-workflows', 'how-to-request-digital-signatures'],
        themes: ['avoid emailing editable drafts to large CC lists when a controlled link will do', 'strip unnecessary metadata before external sharing when policy requires it', 'use signing platforms that encrypt files in transit and at rest', 'limit download permissions after completion when your process allows', 'train teammates not to store signed contracts in personal downloads folders forever'],
    },
    {
        slug: 'how-to-request-digital-signatures',
        title: 'How to Request Digital Signatures',
        excerpt: 'Send a PDF for signature, assign recipients, and track completion—without forcing every signer to create an account first.',
        category: 'PDF Signing', categorySlug: 'pdf-signing', publishedAt: '2026-01-28', updatedAt: '2026-06-12',
        tags: ['Request Signature', 'Workflow'], keywords: ['request signature', 'send document for signature', 'collect esignatures'],
        popular: true, heroGradient: 'from-cyan-600 to-blue-700',
        metaTitle: 'How to Request Digital Signatures | CubSign',
        metaDescription: 'Step-by-step guidance for requesting signatures on a PDF, notifying recipients, and tracking who still needs to sign.',
        related: ['how-to-sign-a-pdf-online', 'request-signatures-from-multiple-recipients', 'best-practices-for-signing-contracts-online', 'how-small-businesses-save-time-using-esignatures'],
        themes: ['prepare a clean PDF with clear signature blocks before inviting anyone', 'add each recipient email carefully—typos send contracts into the void', 'assign fields so the right person signs the right line', 'send a short context note so recipients know why the document matters', 'follow up using status, not guesswork, when someone is still pending'],
    },
    {
        slug: 'benefits-of-paperless-workflows',
        title: 'Benefits of Paperless Workflows',
        excerpt: 'Going paperless is not just about the planet. It improves speed, searchability, and audit readiness for document-heavy teams.',
        category: 'Business', categorySlug: 'business', publishedAt: '2026-02-03', updatedAt: '2026-06-02',
        tags: ['Paperless', 'Operations'], keywords: ['paperless workflow', 'go paperless', 'digital document workflow'],
        popular: false, heroGradient: 'from-emerald-600 to-green-700',
        metaTitle: 'Benefits of Paperless Workflows | CubSign',
        metaDescription: 'Discover how paperless document workflows speed up signing, reduce clutter, and improve record-keeping with CubSign.',
        related: ['how-small-businesses-save-time-using-esignatures', 'how-to-protect-pdf-documents', 'introducing-cubsign-early-access', 'how-to-sign-a-pdf-online'],
        themes: ['searchable digital files beat filing cabinets when audits or renewals arrive', 'remote teammates can sign without shipping paper across cities', 'storage costs and printer jams quietly disappear from weekly ops', 'standardized PDF templates reduce one-off formatting chaos', 'environmental gains are real when volume is high—but speed is usually the first win'],
    },
    {
        slug: 'how-to-sign-pdfs-on-mobile',
        title: 'How to Sign PDFs on Mobile',
        excerpt: 'Sign documents from your phone without sacrificing clarity. Practical tips for placement, drawing, and downloading on small screens.',
        category: 'Guides', categorySlug: 'guides', publishedAt: '2026-02-11', updatedAt: '2026-06-14',
        tags: ['Mobile', 'PDF Signing'], keywords: ['sign pdf on phone', 'mobile esignature', 'sign document on mobile'],
        popular: true, heroGradient: 'from-amber-500 to-orange-600',
        metaTitle: 'How to Sign PDFs on Mobile | CubSign',
        metaDescription: 'Mobile-friendly tips for signing PDFs in your browser with CubSign—placement, signatures, and downloads on the go.',
        related: ['how-to-sign-a-pdf-online', 'common-mistakes-when-signing-pdfs', 'mobile-pdf-signing-tips', 'best-practices-for-signing-contracts-online'],
        themes: ['use landscape orientation when drawing a signature with your finger', 'pinch-zoom before placing fields on dense multi-column pages', 'prefer typed signatures if touch drawing looks uneven', 'download immediately so the signed PDF lands in device storage', 'avoid public Wi-Fi for highly sensitive agreements when a private network is available'],
    },
    {
        slug: 'common-mistakes-when-signing-pdfs',
        title: 'Common Mistakes When Signing PDFs',
        excerpt: 'Avoid the errors that delay deals or create weak records—from signing the wrong version to skipping a required initial block.',
        category: 'Guides', categorySlug: 'guides', publishedAt: '2026-02-18', updatedAt: '2026-06-09',
        tags: ['Mistakes', 'Tips'], keywords: ['pdf signing mistakes', 'esignature errors', 'contract signing tips'],
        popular: false, heroGradient: 'from-orange-500 to-red-600',
        metaTitle: 'Common Mistakes When Signing PDFs | CubSign',
        metaDescription: 'Fix the most common PDF signing mistakes before they slow down contracts or create confusion later.',
        related: ['best-practices-for-signing-contracts-online', 'how-to-sign-a-pdf-online', 'how-to-sign-pdfs-on-mobile', 'how-to-request-digital-signatures'],
        themes: ['signing a draft instead of the final clean PDF', 'placing a signature over critical price or date text', 'forgetting optional-but-expected initials on exhibit pages', 'using an unreadable scribble when a typed mark would be clearer', 'failing to save or download the completed file after the session'],
    },
    {
        slug: 'are-electronic-signatures-legally-binding',
        title: 'Are Electronic Signatures Legally Binding?',
        excerpt: 'Electronic signatures are widely recognized, but validity still depends on intent, consent, and record quality. Here is the practical view.',
        category: 'Legal', categorySlug: 'legal', publishedAt: '2026-01-10', updatedAt: '2026-05-18',
        tags: ['Legal', 'Compliance'], keywords: ['are electronic signatures legal', 'esignature legally binding', 'esign act'],
        popular: true, heroGradient: 'from-violet-600 to-purple-700',
        metaTitle: 'Are Electronic Signatures Legally Binding? | CubSign',
        metaDescription: 'Understand when electronic signatures are legally binding, what evidence helps, and how CubSign supports trustworthy records.',
        related: ['electronic-signature-vs-digital-signature', 'best-practices-for-signing-contracts-online', 'how-secure-are-electronic-signatures', 'how-to-sign-a-pdf-online'],
        themes: ['intent to sign and consent to electronic processes are foundational concepts', 'frameworks such as ESIGN, UETA, and eIDAS recognize electronic agreements in many cases', 'audit trails and final PDFs strengthen your evidence package', 'some document types still require special formalities—know your exceptions', 'this article is educational, not legal advice for your jurisdiction'],
    },
    {
        slug: 'securing-your-documents-with-cubsign',
        title: 'How CubSign Protects Your Documents',
        excerpt: 'A plain-language look at encryption, access control, and privacy practices that safeguard PDFs inside CubSign.',
        category: 'Security', categorySlug: 'security', publishedAt: '2026-02-18', updatedAt: '2026-06-11',
        tags: ['Security', 'CubSign', 'Encryption'], keywords: ['cubsign security', 'document encryption', 'secure pdf storage'],
        popular: false, heroGradient: 'from-rose-600 to-orange-700',
        metaTitle: 'How CubSign Protects Your Documents | CubSign',
        metaDescription: 'See how CubSign uses HTTPS, encrypted storage, and access controls to protect the PDFs you upload and sign.',
        related: ['how-secure-are-electronic-signatures', 'how-to-protect-pdf-documents', 'introducing-cubsign-early-access', 'what-is-an-audit-trail'],
        themes: ['HTTPS protects uploads and downloads in transit', 'stored documents are encrypted at rest with strong industry algorithms', 'only authorized users and valid recipient links should reach a file', 'activity logging supports accountability after signing', 'we do not sell your document contents as a product'],
    },
    {
        slug: 'request-signatures-from-multiple-recipients',
        title: 'Request Signatures from Multiple Recipients',
        excerpt: 'Coordinate multi-party signing without spreadsheet chaos. Assign fields, notify recipients, and track progress in one place.',
        category: 'Product Updates', categorySlug: 'product-updates', publishedAt: '2026-03-05', updatedAt: '2026-06-07',
        tags: ['Multi-recipient', 'Product'], keywords: ['multiple signers', 'multi party signature', 'send to multiple recipients'],
        popular: false, heroGradient: 'from-cyan-600 to-blue-700',
        metaTitle: 'Request Signatures from Multiple Recipients | CubSign',
        metaDescription: 'Learn how to collect signatures from multiple people on one PDF and track who has finished signing.',
        related: ['how-to-request-digital-signatures', 'how-to-sign-a-pdf-online', 'what-is-an-audit-trail', 'how-small-businesses-save-time-using-esignatures'],
        themes: ['list every signer before you send so fields map cleanly', 'assign signature boxes to the correct recipient role', 'communicate signing order when your process requires it', 'watch status to nudge only the people still pending', 'download one completed PDF when the last signature lands'],
    },
    {
        slug: 'mobile-pdf-signing-tips',
        title: '5 Tips for Signing PDFs on Your Phone',
        excerpt: 'Quick, high-impact tips for a cleaner mobile signing experience—from orientation to downloading the finished file.',
        category: 'Guides', categorySlug: 'guides', publishedAt: '2026-04-12', updatedAt: '2026-06-14',
        tags: ['Mobile', 'Tips'], keywords: ['mobile pdf tips', 'sign on phone', 'touch signature tips'],
        popular: false, heroGradient: 'from-amber-500 to-orange-600',
        metaTitle: '5 Tips for Signing PDFs on Your Phone | CubSign',
        metaDescription: 'Five practical tips to sign PDFs on mobile with CubSign: orientation, zoom, signature style, review, and download.',
        related: ['how-to-sign-pdfs-on-mobile', 'how-to-sign-a-pdf-online', 'common-mistakes-when-signing-pdfs', 'best-practices-for-signing-contracts-online'],
        themes: ['rotate to landscape before drawing', 'zoom in to place fields accurately', 'save a reusable signature when your workflow allows', 'use typed signatures for clarity on tiny screens', 'download as soon as the document is complete'],
    },
    {
        slug: 'introducing-cubsign-early-access',
        title: 'Introducing CubSign Early Access',
        excerpt: 'CubSign is open for early users: sign PDFs online for free while we refine the product with your feedback.',
        category: 'Product Updates', categorySlug: 'product-updates', publishedAt: '2025-11-15', updatedAt: '2026-06-01',
        tags: ['Early Access', 'Product Launch'], keywords: ['cubsign launch', 'free pdf signing', 'early access esignature'],
        featured: false, popular: false, heroGradient: 'from-blue-600 to-indigo-700',
        metaTitle: 'Introducing CubSign Early Access | CubSign',
        metaDescription: 'CubSign Early Access is live. Sign PDFs online for free, request signatures, and help shape the product roadmap.',
        related: ['how-to-sign-a-pdf-online', 'securing-your-documents-with-cubsign', 'request-signatures-from-multiple-recipients', 'benefits-of-paperless-workflows'],
        themes: ['we built CubSign to remove print-sign-scan friction from everyday PDFs', 'early access is free while we learn from real customer workflows', 'upload, sign, send, and track without wrestling enterprise complexity', 'security and simplicity are non-negotiable product principles', 'your feedback directly influences templates, tracking, and editor improvements'],
    },
    {
        slug: 'what-is-an-audit-trail',
        title: 'What Is an Audit Trail in Document Signing?',
        excerpt: 'An audit trail records who did what and when during a signing workflow. Learn why it matters for trust and dispute readiness.',
        category: 'Electronic Signatures', categorySlug: 'electronic-signatures', publishedAt: '2026-03-12', updatedAt: '2026-06-03',
        tags: ['Audit Trail', 'Compliance'], keywords: ['signature audit trail', 'document audit log', 'esignature evidence'],
        popular: false, heroGradient: 'from-indigo-600 to-blue-700',
        metaTitle: 'What Is an Audit Trail in Document Signing? | CubSign',
        metaDescription: 'Understand audit trails for e-signatures: the events they capture and why they strengthen your signed PDF records.',
        related: ['how-secure-are-electronic-signatures', 'are-electronic-signatures-legally-binding', 'request-signatures-from-multiple-recipients', 'securing-your-documents-with-cubsign'],
        themes: ['audit trails capture views, sends, signatures, and completion times', 'they complement—not replace—the signed PDF itself', 'IP and timestamp metadata add useful context in reviews', 'export or screenshot key history when your process requires offline evidence packs', 'CubSign logs core signing events inside your workspace history'],
    },
    {
        slug: 'how-to-create-a-reusable-signature',
        title: 'How to Create a Reusable Signature',
        excerpt: 'Save time on recurring documents by creating a signature you can apply consistently across PDFs in CubSign.',
        category: 'Getting Started', categorySlug: 'getting-started', publishedAt: '2026-03-20', updatedAt: '2026-06-06',
        tags: ['Signature', 'Getting Started'], keywords: ['reusable signature', 'save signature online', 'create esignature'],
        popular: false, heroGradient: 'from-blue-600 to-cyan-700',
        metaTitle: 'How to Create a Reusable Signature | CubSign',
        metaDescription: 'Create a clean reusable signature for CubSign—draw, type, or upload—and apply it consistently across documents.',
        related: ['how-to-sign-a-pdf-online', 'how-to-sign-pdfs-on-mobile', 'best-practices-for-signing-contracts-online', 'draw-vs-type-your-signature'],
        themes: ['choose draw for a personal handwritten look or type for consistency', 'upload a high-contrast PNG if you already have an approved mark', 'keep backgrounds transparent so the signature sits cleanly on the page', 'recreate the signature if your legal name changes', 'never share your account so others cannot misuse a saved mark'],
    },
    {
        slug: 'draw-vs-type-your-signature',
        title: 'Draw vs Type Your Signature',
        excerpt: 'Both drawn and typed signatures can indicate intent. Compare the trade-offs so you pick the right style for each document.',
        category: 'Getting Started', categorySlug: 'getting-started', publishedAt: '2026-03-28', updatedAt: '2026-05-25',
        tags: ['Signature', 'UX'], keywords: ['draw signature', 'type signature', 'handwriting vs typed esign'],
        popular: false, heroGradient: 'from-emerald-600 to-teal-700',
        metaTitle: 'Draw vs Type Your Signature | CubSign',
        metaDescription: 'Compare drawing and typing your electronic signature in CubSign, including when each option looks and works best.',
        related: ['how-to-create-a-reusable-signature', 'how-to-sign-a-pdf-online', 'how-to-sign-pdfs-on-mobile', 'common-mistakes-when-signing-pdfs'],
        themes: ['drawing feels familiar and personal, especially on tablets', 'typing stays legible at small field sizes and on phones', 'upload wins when brand or legal teams mandate a specific image', 'intent matters more than whether the pixels were drawn or typed', 'pick one style per document so countersignatures look coherent'],
    },
    {
        slug: 'nda-signing-guide-for-startups',
        title: 'NDA Signing Guide for Startups',
        excerpt: 'Move faster on partnerships without losing control of confidentiality. A startup-friendly guide to signing NDAs online.',
        category: 'Business', categorySlug: 'business', publishedAt: '2026-04-02', updatedAt: '2026-06-04',
        tags: ['NDA', 'Startups'], keywords: ['sign nda online', 'startup nda', 'electronic nda'],
        popular: false, heroGradient: 'from-violet-600 to-indigo-700',
        metaTitle: 'NDA Signing Guide for Startups | CubSign',
        metaDescription: 'How startups can prepare, send, and sign NDAs electronically with clearer records and less email friction.',
        related: ['how-to-request-digital-signatures', 'best-practices-for-signing-contracts-online', 'how-small-businesses-save-time-using-esignatures', 'are-electronic-signatures-legally-binding'],
        themes: ['keep a clean PDF template instead of negotiating inside scanned images', 'confirm mutual vs one-way terms before you send for signature', 'collect signatures from the correct corporate entity name', 'store executed NDAs where fundraising and sales teams can find them', 'pair CubSign signing with a simple naming convention for deals'],
    },
    {
        slug: 'freelancer-contract-signing-checklist',
        title: 'Freelancer Contract Signing Checklist',
        excerpt: 'A concise checklist freelancers can run before signing client PDFs—so scope, payment, and IP terms are never a surprise.',
        category: 'Guides', categorySlug: 'guides', publishedAt: '2026-04-20', updatedAt: '2026-06-13',
        tags: ['Freelancers', 'Contracts'], keywords: ['freelancer contract', 'sign client agreement', 'freelance esignature'],
        popular: false, heroGradient: 'from-sky-600 to-indigo-700',
        metaTitle: 'Freelancer Contract Signing Checklist | CubSign',
        metaDescription: 'Use this freelancer checklist before you sign a client PDF: scope, payment, IP, and signing hygiene with CubSign.',
        related: ['best-practices-for-signing-contracts-online', 'common-mistakes-when-signing-pdfs', 'how-to-sign-a-pdf-online', 'how-small-businesses-save-time-using-esignatures'],
        themes: ['verify scope and deliverables match the sales conversation', 'check payment timing, late fees, and expense language', 'confirm IP ownership and portfolio rights before you sign', 'ensure the PDF is final—no leftover draft watermarks', 'download the signed copy to your records the same day'],
    },
];

function themeHeading(theme, index) {
    const words = theme.split(/\s+/).slice(0, 8).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
}

function buildFromThemes(item) {
    const topic = item.title.replace(/\?$/, '');
    const content = [
        p(
            `${topic} shows up constantly in conversations with CubSign users—from first-time freelancers to operations leads standardizing how their company handles PDFs. This guide explains what to do, why it matters, and how to avoid the shortcuts that create messy records later.`,
            `You will leave with a concrete checklist you can reuse, plus clear pointers into CubSign product surfaces such as the Upload PDF page, the Features page, and the CubSign Help Center when you need click-by-click instructions.`,
        ),
        h2('The real-world problem'),
        p(
            `Most delays are not caused by the signature mark itself. They come from unclear ownership, outdated PDF drafts circulating by email, missing fields, and counterparts who are unsure whether a phone screenshot of a wet-ink page counts. Electronic signing fixes the logistics so your team can focus on commercial terms.`,
            `When the process is vague, people invent workarounds: printing at a hotel business center, photographing signature pages, or forwarding editable files that invite accidental edits. A deliberate CubSign workflow replaces those improvisations with one finished PDF and a clearer activity history.`,
        ),
        h2('Who this guide is for'),
        ul(
            'Founders and freelancers who sign client agreements themselves.',
            'Operations and HR teammates who collect signatures at volume.',
            'Sales leads who need proposals signed while momentum is high.',
            'Anyone migrating from print-sign-scan toward a paperless habit.',
        ),
        p(`If you are brand new to CubSign, skim Getting Started style articles on the CubSign Blog after this one, then try a low-risk internal PDF before you send a customer-facing contract.`),
    ];

    item.themes.forEach((theme, idx) => {
        content.push(h2(themeHeading(theme, idx)));
        content.push(p(
            `${theme.charAt(0).toUpperCase()}${theme.slice(1)}. Treat that statement as a non-negotiable quality bar for the documents you prepare or approve this month.`,
            `Write it into your internal checklist so it survives busy weeks. Teams that rely on memory alone tend to skip steps when a deal is urgent—and urgent deals are exactly when mistakes are most expensive.`,
        ));
        content.push(p(
            `With CubSign, you can reinforce the habit inside the product flow: upload the correct PDF, place fields deliberately, invite the right recipients, and download the completed file into the deal folder the same day.`,
            `If something looks off—wrong party name, draft watermark, missing exhibit—pause the signing request and fix the source file first. A fast signature on the wrong document is not a win.`,
        ));
        content.push(p(
            `Counterparts notice professionalism. Clear instructions, a readable signature block, and a single source of truth PDF reduce clarifying emails and build trust before the commercial relationship even starts.`,
        ));
    });

    content.push(
        h2('A practical workflow inside CubSign'),
        ol(
            'Export or collect the final PDF with no draft watermarks.',
            'Open the Upload PDF page and place signature, date, and text fields where the form expects them.',
            'Sign yourself or request signatures from the correct recipient emails.',
            'Watch status until every required party is complete.',
            'Download the finished PDF and store it with related correspondence.',
        ),
        p(CTA.features),
        p(CTA.upload),
        h2('Quality checks before you call it done'),
        ul(
            'Names, dates, and amounts match the negotiated agreement.',
            'Every required signature and initials block is filled.',
            'The file name includes counterpart and date for later search.',
            'Sensitive copies are not left in shared downloads folders.',
        ),
        h2('How this connects to security and trust'),
        p(
            `Good process and good security reinforce each other. Encrypted transit and storage matter, but so does verifying recipient emails and refusing to sign unexpected links. Pair CubSign’s platform protections with human judgment.`,
            `When disputes or renewals appear months later, you want a clean final PDF plus enough context to show what was agreed. That is why completion hygiene belongs in the same conversation as cryptography.`,
        ),
        h2('Helpful next steps'),
        ul(
            'Browse related CubSign Blog articles for adjacent topics.',
            'Use the CubSign Help Center when you need product UI steps.',
            'Message the team from the Contact page if your industry has unusual constraints.',
        ),
        p(CTA.help),
        p(CTA.contact),
        h2('Putting it into practice this week'),
        p(
            `Choose one live document and run the full checklist above without shortcuts. Capture friction points: field placement, recipient confusion, mobile readability, or naming conventions. Those notes become your playbook.`,
            `If you lead a team, publish a one-page standard covering who may send for signature, how files are named, and where completed PDFs live. Consistency beats perfection on day one.`,
            `CubSign Early Access remains free while we keep improving the product with user feedback. Start with a low-risk PDF, then expand to customer contracts once the rhythm feels natural.`,
        ),
    );

    const faq = [
        { question: `Who should read “${item.title}”?`, answer: `Anyone who prepares or signs PDFs regularly—freelancers, founders, operations leads, and small teams adopting electronic signatures.` },
        { question: 'Does CubSign support this workflow?', answer: 'Yes. CubSign is built for browser-based PDF signing and signature requests with secure transmission and storage.' },
        { question: 'Where can I get product help?', answer: 'Visit the CubSign Help Center for how-to articles, or reach out via the Contact page.' },
        { question: 'Is CubSign free right now?', answer: 'Yes. CubSign is free during Early Access while we improve the platform based on real customer feedback.' },
    ];

    add({
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        categorySlug: item.categorySlug,
        publishedAt: item.publishedAt,
        updatedAt: item.updatedAt,
        tags: item.tags,
        keywords: item.keywords,
        featured: !!item.featured,
        popular: !!item.popular,
        heroGradient: item.heroGradient,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
    }, content, faq, item.related);
}

for (const item of catalog) {
    buildFromThemes(item);
}

// Ensure exactly unique 20 by slug
const slugs = articles.map((a) => a.slug);
const unique = [...new Set(slugs)];
if (unique.length !== articles.length) {
    console.error('Duplicate slugs', slugs.filter((s, i) => slugs.indexOf(s) !== i));
    process.exit(1);
}
if (articles.length !== 20) {
    console.error(`Expected 20 articles, got ${articles.length}`);
    process.exit(1);
}

for (const a of articles) {
    console.log(`${a.slug}: ${a.wordCount} words, ${a.readingTime} min`);
}

// Serialize blog.js
function serialize(value, indent = 0) {
    const pad = '    '.repeat(indent);
    const padIn = '    '.repeat(indent + 1);
    if (value === null) return 'null';
    if (typeof value === 'boolean' || typeof value === 'number') return String(value);
    if (typeof value === 'string') return JSON.stringify(value);
    if (Array.isArray(value)) {
        if (value.length === 0) return '[]';
        return `[\n${value.map((v) => padIn + serialize(v, indent + 1)).join(',\n')},\n${pad}]`;
    }
    if (typeof value === 'object') {
        const keys = Object.keys(value);
        return `{\n${keys.map((k) => `${padIn}${k}: ${serialize(value[k], indent + 1)}`).join(',\n')},\n${pad}}`;
    }
    return 'undefined';
}

// Strip wordCount from export
const exportPosts = articles.map(({ wordCount, ...rest }) => rest);

const file = `/** Blog content hub — keep slugs/dates in sync with config/blog.php */

export const blogAuthor = ${serialize(author)};

export const blogCategories = ${serialize(categories)};

export const blogCategoryNames = blogCategories.map((c) => c.name);

export const popularSearches = [
    'sign PDF online',
    'electronic signature',
    'security',
    'mobile signing',
    'request signature',
    'contracts',
];

export const POSTS_PER_PAGE = 6;

export const blogPosts = ${serialize(exportPosts)};

export function getPostBySlug(slug) {
    return blogPosts.find((p) => p.slug === slug) ?? null;
}

export function getPostsByCategory(categoryName) {
    return blogPosts.filter((p) => p.category === categoryName);
}

export function getFeaturedPost() {
    return blogPosts.find((p) => p.featured) ?? blogPosts[0];
}

export function getPopularPosts(limit = 5) {
    const flagged = blogPosts.filter((p) => p.popular);
    const pool = flagged.length ? flagged : [...blogPosts].sort((a, b) => b.readingTime - a.readingTime);
    return pool.slice(0, limit);
}

export function getRecentPosts(limit = 5) {
    return [...blogPosts]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, limit);
}

export function getRecentlyUpdatedPosts(limit = 5) {
    return [...blogPosts]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, limit);
}

export function getRelatedPosts(slug, limit = 3) {
    const current = getPostBySlug(slug);
    if (!current) return blogPosts.slice(0, limit);

    const bySlug = (current.related ?? [])
        .map((s) => getPostBySlug(s))
        .filter(Boolean);

    if (bySlug.length >= limit) return bySlug.slice(0, limit);

    const extras = blogPosts.filter(
        (p) =>
            p.slug !== slug &&
            !bySlug.some((r) => r.slug === p.slug) &&
            (p.category === current.category || p.tags.some((t) => current.tags.includes(t))),
    );

    return [...bySlug, ...extras].slice(0, limit);
}

export function getAdjacentPosts(slug) {
    const chronological = [...blogPosts].sort(
        (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt),
    );
    const index = chronological.findIndex((p) => p.slug === slug);
    if (index === -1) return { previous: null, next: null };
    return {
        previous: index > 0 ? chronological[index - 1] : null,
        next: index < chronological.length - 1 ? chronological[index + 1] : null,
    };
}

function postSearchHaystack(post) {
    return [
        post.title,
        post.excerpt,
        post.category,
        ...(post.tags ?? []),
        ...(post.keywords ?? []),
        ...post.content.flatMap((block) => {
            if (block.text) return [block.text];
            if (block.items) return block.items;
            return [];
        }),
        ...(post.faq ?? []).flatMap((f) => [f.question, f.answer]),
    ]
        .join(' ')
        .toLowerCase();
}

export function searchBlogPosts(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [...blogPosts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return blogPosts.filter((post) => postSearchHaystack(post).includes(q));
}

export function filterBlogPosts({ query = '', category = 'All' } = {}) {
    let posts = searchBlogPosts(query);
    if (category && category !== 'All') {
        posts = posts.filter((p) => p.category === category);
    }
    return posts;
}

export function paginatePosts(posts, page = 1, perPage = POSTS_PER_PAGE) {
    const safePage = Math.max(1, page);
    const total = posts.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(safePage, totalPages);
    const start = (currentPage - 1) * perPage;
    return {
        items: posts.slice(start, start + perPage),
        currentPage,
        totalPages,
        total,
        perPage,
    };
}

export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function categoryColor(name) {
    return blogCategories.find((c) => c.name === name)?.color ?? 'from-gray-500 to-gray-600';
}
`;

const regexCharClass = '[.*+?^${}()|[\\]\\\\]';
const escLine = `    const escaped = destinations.map((d) => d.title.replace(/${regexCharClass}/g, '\\\\$&'));`;

const linkifyFinal = [
    '',
    '/**',
    ' * Auto-link known blog titles plus key marketing destinations in plain text.',
    ' */',
    'export function linkifyBlogText(text, currentSlug = null) {',
    "    if (!text) return [{ type: 'text', value: '' }];",
    '',
    '    const destinations = [',
    '        ...blogPosts',
    '            .filter((p) => p.slug !== currentSlug)',
    "            .map((p) => ({ title: p.title, kind: 'blog', slug: p.slug })),",
    "        { title: 'Help Center', kind: 'route', routeName: 'help-center' },",
    "        { title: 'CubSign Help Center', kind: 'route', routeName: 'help-center' },",
    "        { title: 'Features page', kind: 'route', routeName: 'features' },",
    "        { title: 'Upload PDF page', kind: 'route', routeName: 'sign.index' },",
    "        { title: 'Upload PDF', kind: 'route', routeName: 'sign.index' },",
    "        { title: 'Contact page', kind: 'route', routeName: 'contact' },",
    '    ].sort((a, b) => b.title.length - a.title.length);',
    '',
    "    if (!destinations.length) return [{ type: 'text', value: text }];",
    '',
    escLine,
    "    const pattern = new RegExp('(' + escaped.join('|') + ')', 'g');",
    '    const parts = text.split(pattern);',
    '    const byTitle = Object.fromEntries(destinations.map((d) => [d.title, d]));',
    '',
    '    return parts',
    "        .filter((part) => part !== '')",
    '        .map((part) => {',
    '            const dest = byTitle[part];',
    "            if (!dest) return { type: 'text', value: part };",
    "            if (dest.kind === 'blog') return { type: 'blog', value: part, slug: dest.slug };",
    "            return { type: 'route', value: part, routeName: dest.routeName };",
    '        });',
    '}',
    '',
].join('\n');

writeFileSync(outPath, file + linkifyFinal);
console.log('Wrote', outPath);

const configPath = join(__dirname, '../config/blog.php');

function phpStr(value) {
    return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

const phpPosts = exportPosts
    .map(
        (p) => `        [
            'slug' => ${phpStr(p.slug)},
            'published_at' => ${phpStr(p.publishedAt)},
            'updated_at' => ${phpStr(p.updatedAt)},
            'title' => ${phpStr(p.title)},
            'excerpt' => ${phpStr(p.excerpt)},
        ]`,
    )
    .join(',\n');

const phpFile = `<?php

/**
 * Blog post metadata for server-side features (sitemap, RSS, etc.).
 * Keep in sync with resources/js/constants/blog.js — run: node scripts/generate-blog-content.mjs
 */
return [

    'posts' => [
${phpPosts},
    ],

];
`;

writeFileSync(configPath, phpFile);
console.log('Wrote', configPath);
