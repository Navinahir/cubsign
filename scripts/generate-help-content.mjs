/**
 * One-shot generator for resources/js/constants/help.js and config/help.php
 * Run: node scripts/generate-help-content.mjs
 *
 * Expands the CubSign Help Center knowledge base into full educational
 * articles while preserving every existing slug and helper export.
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { helpExpansions } from './help-expansions-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const helpJsPath = join(__dirname, '../resources/js/constants/help.js');
const helpPhpPath = join(__dirname, '../config/help.php');

const LAST_REVIEWED = '2026-07-17';

/* ── Categories (kept in the existing structure and order) ── */
const helpCategories = [
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

const categoryNameBySlug = Object.fromEntries(helpCategories.map((c) => [c.slug, c.name]));

/* ── Content block helpers ── */
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
function tip(text) {
    return { type: 'tip', text };
}
function note(text) {
    return { type: 'note', text };
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
    return Math.max(2, Math.round(words / 220));
}

const articles = [];

function add(meta, content, faq) {
    const expanded = [...content, ...(helpExpansions[meta.slug] ?? [])];
    const words = countWords(expanded);
    if (words < 450) {
        console.warn(`LOW WORD COUNT ${meta.slug}: ${words}`);
    }
    if (!Array.isArray(faq) || faq.length < 3) {
        console.warn(`FAQ ISSUE ${meta.slug}: expected 3+, got ${faq ? faq.length : 0}`);
    }
    articles.push({
        slug: meta.slug,
        title: meta.title,
        excerpt: meta.excerpt,
        category: categoryNameBySlug[meta.categorySlug],
        categorySlug: meta.categorySlug,
        updatedAt: meta.updatedAt,
        lastReviewed: LAST_REVIEWED,
        readingTime: readingTime(words),
        wordCount: words,
        tags: meta.tags,
        keywords: meta.keywords,
        metaTitle: meta.metaTitle,
        metaDescription: meta.metaDescription,
        related: meta.related,
        faq,
        content: expanded,
    });
}

/* ═══════════════════════════ GETTING STARTED ═══════════════════════════ */

// 1 ── what-is-cubsign
add(
    {
        slug: 'what-is-cubsign',
        title: 'What Is CubSign?',
        excerpt: 'A complete overview of CubSign, what it does, and how it replaces print-sign-scan with a fast browser workflow.',
        categorySlug: 'getting-started',
        updatedAt: '2026-06-20',
        tags: ['Getting Started', 'Overview'],
        keywords: ['what is cubsign', 'online pdf signing', 'electronic signature platform', 'sign pdf in browser'],
        metaTitle: 'What Is CubSign? Online PDF Signing Explained | CubSign',
        metaDescription: 'Learn what CubSign is, who it is for, and how to upload, sign, and share PDFs online without printing or installing software.',
        related: ['create-your-cubsign-account', 'how-to-sign-a-pdf-online', 'how-to-upload-a-pdf', 'electronic-signature-legality'],
    },
    [
        p('CubSign is a web-based platform for signing PDF documents online. You upload a PDF, place signature and form fields, sign it yourself or send it to others, and download the completed file. Everything happens in your browser, so there is nothing to install and no plugin to configure.'),
        p('If you have ever printed a contract just to sign one line, scanned it back, and emailed a blurry copy, CubSign removes that entire loop. The goal is simple: turn a document into a signed, shareable, audit-friendly PDF in under a minute. To follow along with hands-on steps, open the Upload PDF page and try it with a low-risk file first.'),
        h2('Why it matters'),
        p('Signing is often the last step before work can move forward, yet it is where deals stall. Paper introduces delay, version confusion, and lost pages. A browser-based signing tool keeps one clean copy of the truth, records who signed and when, and lets remote participants finish their part from anywhere. That speed compounds across every quote, agreement, and onboarding form you handle.'),
        h2('What you can do with CubSign'),
        ol(
            'Upload a PDF from your computer, phone, or tablet.',
            'Add signature, date, and text fields wherever the document needs them.',
            'Draw, type, or upload a signature to sign yourself.',
            'Request signatures from recipients who sign from a secure link.',
            'Download the finished PDF and keep it with your records.',
        ),
        h2('Who CubSign is for'),
        ul(
            'Individuals signing contracts, leases, forms, and agreements.',
            'Freelancers who need clients to approve proposals quickly.',
            'Small teams collecting signatures from clients, vendors, or partners.',
            'Anyone who wants a faster, cleaner alternative to print-and-scan.',
        ),
        tip('New to the product? Start by reading How to Sign a PDF Online, then create a free account so your documents are saved to a workspace you control.'),
        h2('Best practices for getting the most from CubSign'),
        ul(
            'Create a free account so documents, history, and signatures are saved.',
            'Keep source PDFs final and clean before you sign, with no draft watermarks.',
            'Name files consistently so you can find executed agreements later.',
            'Explore the Features page to see signing, sending, and tracking together.',
        ),
        h2('Common mistakes'),
        ul(
            'Signing a draft instead of the final version of the document.',
            'Uploading a photo or Word file instead of an actual PDF.',
            'Forgetting to download the signed file after finishing as a guest.',
            'Assuming a signature is legally identical for every document type without checking.',
        ),
        note('CubSign is free during Early Access while we improve the product based on user feedback. No credit card is required to upload, sign, or send documents.'),
        h2('Summary'),
        p('CubSign turns PDF signing into a quick browser task: upload, place fields, sign or send, and download. It suits individuals, freelancers, and small teams who want speed without sacrificing security or a clear record. To learn the full flow, read How to Sign a PDF Online and Create Your CubSign Account, or browse the CubSign Blog for deeper guides. When you are ready, the Upload PDF page is the fastest place to begin.'),
    ],
    [
        { question: 'Is CubSign free to use?', answer: 'Yes. CubSign is free during Early Access. You can upload, sign, and send PDFs for signature without a credit card.' },
        { question: 'Do I need to install anything to use CubSign?', answer: 'No. CubSign runs entirely in a modern web browser on desktop and mobile. There is no app or plugin to install.' },
        { question: 'Can I sign a PDF without creating an account?', answer: 'Yes. Guest signing works for one-off documents. Creating a free account adds storage, history, and the ability to request signatures from others.' },
    ],
);

// 2 ── create-your-cubsign-account
add(
    {
        slug: 'create-your-cubsign-account',
        title: 'Create Your CubSign Account',
        excerpt: 'Set up a free CubSign account to store documents, reuse signatures, and send PDFs for signature.',
        categorySlug: 'getting-started',
        updatedAt: '2026-05-12',
        tags: ['Account', 'Getting Started'],
        keywords: ['create cubsign account', 'sign up cubsign', 'free esignature account', 'register cubsign'],
        metaTitle: 'Create Your CubSign Account (Free) | CubSign',
        metaDescription: 'Step-by-step guide to creating a free CubSign account with email or Google so you can store documents and send them for signature.',
        related: ['what-is-cubsign', 'email-verification', 'google-login', 'how-to-sign-a-pdf-online'],
    },
    [
        p('You can sign a single PDF as a guest, but a free CubSign account unlocks storage, signing history, and multi-recipient workflows. An account is the difference between a one-time signature and an organized, searchable record of everything you sign.'),
        p('Creating an account takes less than a minute. You can register with an email address and password, or use Google Login to skip password management entirely. Either way, no credit card is required during Early Access.'),
        h2('Why it matters'),
        p('Without an account, a signed document lives only on the device where you downloaded it. If you lose that file, there is no second copy. An account gives you a workspace where finished PDFs are saved, statuses are tracked, and reusable signatures are ready for the next document. For anyone who signs more than occasionally, that history is worth the sign-up. It also becomes the hub for anything you send to others, so you always know who has signed and who is still pending without digging through email threads.'),
        h2('Step-by-step: create your account'),
        ol(
            'Click Get Started Free or Register from the CubSign site.',
            'Choose email and password, or select Continue with Google.',
            'Enter your details and submit the registration form.',
            'Verify your email address if prompted. See Email Verification for help.',
            'Open your Overview to start uploading and managing documents.',
        ),
        tip('Use a work email if these documents belong to a business. It keeps executed agreements out of a personal inbox and makes handover easier if roles change.'),
        h2('What you get during Early Access'),
        ul(
            'Free PDF signing with no per-document charges.',
            'A document workspace with downloads and status tracking.',
            'The ability to send documents to others for signature.',
            'Audit-friendly signing history for accountability.',
        ),
        h2('Best practices'),
        ul(
            'Pick a strong, unique password or use Google Login for convenience.',
            'Verify your email promptly so signing notifications reach you.',
            'Keep one account per person to avoid duplicate document histories.',
            'Review the Features page to understand everything your account includes.',
        ),
        h2('Common mistakes'),
        ul(
            'Registering with a typo in your email, which blocks verification.',
            'Creating a second account with a different login method for the same person.',
            'Skipping email verification and then missing signature requests.',
            'Reusing a weak password from another site.',
        ),
        note('If you signed up with email and later want Google Login on the same address, reach out from the Contact page before linking so we can prevent duplicate profiles.'),
        h2('Summary'),
        p('A free CubSign account turns signing into an organized workflow with storage, history, and sending. Register with email or Google, verify your address, and open your workspace. From there, read How to Sign a PDF Online to complete your first document, or visit the Upload PDF page to begin immediately.'),
    ],
    [
        { question: 'Does creating an account cost anything?', answer: 'No. Registration is free during Early Access, and no credit card is required to sign or send documents.' },
        { question: 'Can I register with Google?', answer: 'Yes. Choose Continue with Google to create your account without setting a separate CubSign password. See the Google Login article for details.' },
        { question: 'What if I already signed as a guest?', answer: 'Guest signatures are not tied to an account. Create an account going forward so future documents are saved to your workspace with full history.' },
    ],
);

// 3 ── mobile-support
add(
    {
        slug: 'mobile-support',
        title: 'Mobile Support',
        excerpt: 'Upload and sign PDFs on phones and tablets using a modern mobile browser, with no app required.',
        categorySlug: 'getting-started',
        updatedAt: '2026-06-10',
        tags: ['Mobile', 'Browsers'],
        keywords: ['sign pdf on mobile', 'cubsign mobile', 'sign document on phone', 'mobile pdf signing'],
        metaTitle: 'Mobile Support: Sign PDFs on Your Phone | CubSign',
        metaDescription: 'Learn how to upload and sign PDFs on phones and tablets with CubSign, plus tips for signatures, uploads, and downloads on small screens.',
        related: ['browser-compatibility', 'draw-vs-type-signature', 'how-to-sign-a-pdf-online', 'troubleshooting-upload-errors'],
    },
    [
        p('CubSign is a web app, which means you can upload and sign PDFs from a phone or tablet without installing a native application. If your device has a modern browser and an internet connection, it can sign documents. Start signing from the Upload PDF page when you are ready.'),
        p('Mobile signing is genuinely useful: approve a contract from the train, sign an onboarding form on the couch, or countersign a proposal while traveling. The experience is designed for touch, but a few habits make it noticeably smoother.'),
        h2('Why it matters'),
        p('Work does not wait for you to reach a desktop. When a signature is the only thing between you and a closed deal, being able to finish from a phone removes hours or days of delay. Mobile support also helps recipients who receive your signing links. Many of them will open the document on a phone first, so a mobile-friendly flow keeps your agreements moving.'),
        h2('Step-by-step: sign on a phone'),
        ol(
            'Open the Upload PDF page in Safari (iOS) or Chrome (Android).',
            'Upload your PDF from Files, Photos, or a cloud drive.',
            'Pinch to zoom, then tap to place signature and date fields.',
            'Choose Draw or Type to create your signature.',
            'Finish the flow and download the signed PDF to your device.',
        ),
        tip('Rotate to landscape when drawing a signature. The extra horizontal space produces a far cleaner stroke than a cramped portrait canvas.'),
        h2('Best practices for mobile'),
        ul(
            'Use the latest Safari on iOS or Chrome on Android.',
            'Stay on stable Wi-Fi or a strong cellular signal during uploads.',
            'Prefer Type signature when finger drawing looks shaky on a small screen.',
            'Download the signed file immediately if you are signing as a guest.',
        ),
        h2('Common mistakes'),
        ul(
            'Signing inside a social or email in-app browser that blocks uploads or downloads.',
            'Closing the tab before the signed PDF is saved to the device.',
            'Trying to place fields without zooming in on dense pages.',
            'Uploading on a weak connection, which can interrupt large files.',
        ),
        note('If a link opens inside an in-app browser and something fails, tap the menu and choose Open in Safari or Open in Chrome, then try again in the full browser. For broader preparation and small-screen habits, see More mobile signing tips.'),
        h2('Summary'),
        p('CubSign works on phones and tablets through the browser, so you can sign anywhere. Use a modern browser, a stable connection, landscape orientation for drawing, and download the finished file right away. If uploads or the editor misbehave on mobile, check Browser Compatibility and Troubleshooting Upload Errors, or reach us from the Contact page.'),
    ],
    [
        { question: 'Do I need an app to sign on mobile?', answer: 'No. Open cubsign.com in Safari (iOS) or Chrome (Android). CubSign is a web app, not a native app.' },
        { question: 'Why does signing fail inside my email app?', answer: 'In-app browsers often block uploads or downloads. Tap Open in Safari or Open in Chrome and retry.' },
        { question: 'Draw or type on a phone?', answer: 'Both work. Landscape helps when drawing; typed signatures are often cleaner on small screens.' },
    ],
);

// 4 ── browser-compatibility
add(
    {
        slug: 'browser-compatibility',
        title: 'Browser Compatibility',
        excerpt: 'See which browsers CubSign supports and how to fix a signing editor that looks broken.',
        categorySlug: 'getting-started',
        updatedAt: '2026-06-10',
        tags: ['Browsers', 'Compatibility'],
        keywords: ['cubsign browser support', 'supported browsers', 'pdf editor browser', 'signing editor not loading'],
        metaTitle: 'Supported Browsers for CubSign | CubSign',
        metaDescription: 'Find out which browsers CubSign supports for uploading, signing, and downloading PDFs, plus fixes for a broken editor.',
        related: ['mobile-support', 'troubleshooting-upload-errors', 'how-to-sign-a-pdf-online', 'maximum-upload-size'],
    },
    [
        p('CubSign runs in modern browsers that support current web standards for file upload, canvas drawing, and PDF rendering. Using a supported, up-to-date browser is the single easiest way to avoid upload and editor problems.'),
        p('Most people never need to think about this, their browser updates automatically. But if the editor looks broken or an upload stalls, the browser is one of the first things worth checking.'),
        h2('Why it matters'),
        p('The signing editor draws PDFs on screen, captures your signature on a canvas, and streams files to and from the server. Older or heavily restricted browsers can break any of those steps, producing blank pages, missing buttons, or failed uploads. A supported browser gives you the smooth, predictable experience the product is designed around. It also reduces the odds of a half-finished signature session, where a document uploads but the editor cannot render it correctly. When you are signing something time-sensitive, that reliability is worth more than sticking with an unusual or outdated browser out of habit.'),
        h2('Supported browsers'),
        ul(
            'Google Chrome (latest two major versions).',
            'Mozilla Firefox (latest two major versions).',
            'Microsoft Edge (latest two major versions).',
            'Apple Safari (latest two major versions on macOS and iOS).',
        ),
        h2('Not recommended'),
        ul(
            'Internet Explorer, which is not supported.',
            'Very outdated versions of any browser.',
            'Browsers with aggressive script blockers that break uploads or the editor.',
            'Some social and email in-app browsers with limited file access.',
        ),
        tip('If a page looks stale after a CubSign update, clear the cache for the site or open a private window. That often resolves leftover asset issues instantly.'),
        h2('Step-by-step: fix a broken editor'),
        ol(
            'Refresh the page to reload the latest assets.',
            'Update your browser to the newest version.',
            'Temporarily disable extensions that block scripts or trackers.',
            'Clear the cache for the CubSign site, or try a private window.',
            'Switch to another supported browser if the issue persists.',
        ),
        h2('Common mistakes'),
        ul(
            'Running an outdated browser that lacks modern canvas or upload support.',
            'Leaving an aggressive ad blocker enabled while signing.',
            'Assuming a network issue is a browser issue without checking the connection.',
            'Signing inside an in-app browser instead of the full browser.',
        ),
        note('Corporate devices sometimes lock browser versions or block scripts by policy. If nothing else works on a work laptop, ask your IT team or try a personal supported browser.'),
        h2('Summary'),
        p('Use a current version of Chrome, Firefox, Edge, or Safari for the best CubSign experience. If the editor misbehaves, refresh, update, disable conflicting extensions, clear the cache, or switch browsers. For upload-specific problems, read Troubleshooting Upload Errors, and for phones and tablets see Mobile Support. Still stuck? Reach the team from the Contact page.'),
    ],
    [
        { question: 'Which browser works best with CubSign?', answer: 'Any current version of Chrome, Firefox, Edge, or Safari works well. Keeping the browser updated prevents most editor and upload issues.' },
        { question: 'Why is the signing editor blank?', answer: 'A blank editor usually means an outdated browser, a blocking extension, or stale cached assets. Refresh, update, disable extensions, or clear the cache.' },
        { question: 'Is Internet Explorer supported?', answer: 'No. Internet Explorer is not supported. Please use a modern browser such as Chrome, Firefox, Edge, or Safari.' },
    ],
);

/* ═══════════════════════════ UPLOADING PDFS ═══════════════════════════ */

// 5 ── how-to-upload-a-pdf
add(
    {
        slug: 'how-to-upload-a-pdf',
        title: 'How to Upload a PDF',
        excerpt: 'Upload a PDF to CubSign from your computer or phone in a few clicks and open the signing editor.',
        categorySlug: 'uploading-pdfs',
        updatedAt: '2026-06-15',
        tags: ['Upload', 'PDF'],
        keywords: ['upload pdf to cubsign', 'how to upload pdf', 'add pdf for signing', 'pdf upload steps'],
        metaTitle: 'How to Upload a PDF to CubSign | CubSign',
        metaDescription: 'A clear, step-by-step guide to uploading a PDF to CubSign from desktop or mobile, plus tips to avoid failed uploads.',
        related: ['supported-file-types', 'maximum-upload-size', 'troubleshooting-upload-errors', 'how-to-sign-a-pdf-online'],
    },
    [
        p('CubSign accepts standard PDF files so you can start signing within seconds. You do not need to install software or convert your document first. The upload is the doorway to the signing editor, where the rest of the work happens.'),
        p('This guide covers uploading from both desktop and mobile, what happens after the upload, and how to prevent the small mistakes that cause failed uploads. To try it right now, open the Upload PDF page.'),
        h2('Why it matters'),
        p('A smooth upload sets the tone for the entire signing session. When the file is a clean, appropriately sized PDF, the editor opens instantly and every later step, placing fields, signing, downloading just works. When the upload is wrong, you lose time troubleshooting before you can even sign. Getting this first step right saves the most friction overall, and it is almost entirely within your control: the right format, a sensible size, and a stable connection cover the vast majority of successful uploads.'),
        h2('Step-by-step: upload from the Upload PDF page'),
        ol(
            'Go to the Upload PDF page, or choose Sign PDF from the navigation.',
            'Drag and drop your PDF onto the upload area, or click to browse files.',
            'On mobile, pick the file from Files, Photos, or a connected cloud drive.',
            'Wait for the upload to finish, the signing editor opens automatically.',
        ),
        h2('What happens after upload'),
        p('Your PDF is stored securely for the signing session. You can place signature, date, and text fields, draw or type your signature, then download the signed file or send it to others for signature. If you are signed into an account, the document is also saved to your workspace.'),
        tip('Prefer a clear, text-based PDF over a low-quality scan. Crisp source files render faster in the editor and look better in the final signed document.'),
        h2('Best practices'),
        ul(
            'Use a PDF that is not password-protected.',
            'Keep the file at or under the 25 MB limit. See Maximum Upload Size.',
            'Upload on a stable connection to avoid interruptions.',
            'Confirm the file is a real .pdf, not a renamed Word or image file.',
        ),
        h2('Common mistakes'),
        ul(
            'Uploading a .docx or image file renamed with a .pdf extension.',
            'Trying to upload a password-protected PDF that CubSign cannot open.',
            'Losing connection mid-upload on weak mobile signal.',
            'Choosing an enormous scan that exceeds the size limit.',
        ),
        note('If the upload fails, read Troubleshooting Upload Errors for the most common causes and quick fixes before contacting support.'),
        h2('Summary'),
        p('Uploading a PDF to CubSign is a matter of dragging a file onto the Upload PDF page and waiting a moment for the editor to open. Keep files unlocked, under 25 MB, and genuinely PDF. Once uploaded, continue with How to Sign a PDF Online, or review Supported File Types if you are unsure about your document.'),
    ],
    [
        { question: 'How do I upload a PDF to CubSign?', answer: 'Open the Upload PDF page, then drag your PDF onto the drop zone or click to browse. The signing editor opens automatically when the upload finishes.' },
        { question: 'Can I upload a PDF from my phone?', answer: 'Yes. On mobile, tap the upload area and choose the file from Files, Photos, or a cloud drive. A stable connection helps large files upload reliably.' },
        { question: 'What if my upload keeps failing?', answer: 'Confirm the file is a real PDF under 25 MB and not password-protected. If it still fails, see Troubleshooting Upload Errors for detailed fixes.' },
    ],
);

// 6 ── supported-file-types
add(
    {
        slug: 'supported-file-types',
        title: 'Supported File Types',
        excerpt: 'CubSign accepts PDF documents for upload and signing. Learn what works and how to convert other formats.',
        categorySlug: 'uploading-pdfs',
        updatedAt: '2026-06-15',
        tags: ['Upload', 'PDF', 'Formats'],
        keywords: ['cubsign file types', 'supported formats', 'convert to pdf', 'pdf only upload'],
        metaTitle: 'Supported File Types for Uploads | CubSign',
        metaDescription: 'Understand which file types CubSign accepts for signing, why PDF is required, and how to convert Word, Excel, and images to PDF.',
        related: ['how-to-upload-a-pdf', 'maximum-upload-size', 'troubleshooting-upload-errors', 'upload-your-signature-image'],
    },
    [
        p('CubSign is built for PDF workflows. You upload a PDF, place fields, sign, and download a signed PDF. Standardizing on one format keeps the editor fast, predictable, and consistent across every device.'),
        p('If your document currently lives in another format, Word, Excel, PowerPoint, or an image, you can convert it to PDF in a few seconds using tools you already have. This article explains what is accepted and how to prepare anything that is not.'),
        h2('Why it matters'),
        p('PDF is the universal format for finished documents because it preserves layout, fonts, and pagination everywhere it opens. Editable formats like Word can shift content between devices, which is risky for something you are about to sign. Requiring PDF ensures the document you sign looks exactly like the document everyone agreed to. It also protects against accidental last-minute edits: once a file is a finished PDF, the text is fixed, so what a recipient signs is guaranteed to match what you sent rather than a version that reflowed on their screen.'),
        h2('Accepted format'),
        ul(
            'PDF (.pdf), required for all document uploads.',
        ),
        h2('Not accepted as the main document'),
        ul(
            'Word (.doc, .docx), Excel, and PowerPoint files.',
            'Standalone images (JPG, PNG) used as the main document.',
            'Password-protected PDFs that CubSign cannot open.',
            'Executable or archive files (.exe, .zip, and similar).',
        ),
        tip('Signature images (PNG or JPG) are still useful just not as the document. Use them when creating a signature; see Upload Your Signature Image.'),
        h2('Step-by-step: convert another format to PDF'),
        ol(
            'Open the file in its original app (Word, Excel, Google Docs, etc.).',
            'Choose File, then Export or Save as PDF.',
            'Save the PDF to your device.',
            'Upload the new PDF from the Upload PDF page.',
        ),
        h2('Best practices'),
        ul(
            'Always export a real PDF rather than renaming a file to .pdf.',
            'Remove password protection before uploading.',
            'Flatten complex layouts to PDF so they render consistently.',
            'Check the file opens correctly in a PDF viewer before uploading.',
        ),
        h2('Common mistakes'),
        ul(
            'Renaming a .docx to .pdf and expecting it to work.',
            'Uploading a photo of a printed page instead of a true PDF.',
            'Trying to upload a locked or encrypted PDF.',
            'Assuming a spreadsheet will keep its layout after conversion without checking.',
        ),
        note('If you are unsure whether your file is a valid PDF, open it in a browser tab first. If it displays as a document rather than downloading gibberish, it is likely a real PDF.'),
        h2('Summary'),
        p('CubSign accepts PDF files for signing. Convert Word, Excel, PowerPoint, or images to PDF first using Save as PDF, then upload from the Upload PDF page. For size guidance read Maximum Upload Size, and if an upload is rejected, see Troubleshooting Upload Errors.'),
    ],
    [
        { question: 'What file types can I upload to CubSign?', answer: 'CubSign accepts PDF (.pdf) files for documents. Convert other formats to PDF before uploading.' },
        { question: 'Can I upload a Word document?', answer: 'Not directly. Use Save as PDF or Export to PDF in Word first, then upload the resulting PDF.' },
        { question: 'Are image files supported?', answer: 'Images are not accepted as the main document. However, you can upload a PNG or JPG when creating a signature. See Upload Your Signature Image.' },
    ],
);

// 7 ── maximum-upload-size
add(
    {
        slug: 'maximum-upload-size',
        title: 'Maximum Upload Size',
        excerpt: 'CubSign accepts PDF uploads up to 25 MB. Learn how to reduce large files that exceed the limit.',
        categorySlug: 'uploading-pdfs',
        updatedAt: '2026-06-15',
        tags: ['Upload', 'Limits'],
        keywords: ['pdf upload size limit', '25 mb pdf', 'compress pdf', 'reduce pdf file size'],
        metaTitle: 'Maximum PDF Upload Size (25 MB) | CubSign',
        metaDescription: 'Learn about the 25 MB CubSign upload limit and practical ways to compress or split large PDFs so they upload successfully.',
        related: ['how-to-upload-a-pdf', 'supported-file-types', 'troubleshooting-upload-errors', 'browser-compatibility'],
    },
    [
        p('CubSign accepts PDF uploads up to 25 MB. This limit keeps uploads reliable across browsers and mobile connections while comfortably covering most contracts, forms, and scanned packets.'),
        p('The vast majority of documents fall well under 25 MB. When a file is larger, it is almost always a high-resolution scan or a PDF stuffed with large embedded images. Both of which can be reduced without harming readability. A ten-page text contract might be under 1 MB, while a single color scan of the same length can balloon past the limit. Knowing the difference tells you exactly where to look when a file is too big.'),
        h2('Why it matters'),
        p('Large files fail more often, especially on mobile or unstable networks, and they slow the editor for everyone. A sensible size limit protects the reliability of the whole signing flow. Learning to trim a bloated PDF also produces a cleaner document that others can open and store more easily. Recipients benefit too: a compact PDF downloads quickly on their end and is less likely to be blocked by an email attachment limit if they forward it. In practice, a right-sized file is simply more portable at every step of its life.'),
        h2('Step-by-step: shrink a file that is too large'),
        ol(
            'Run the PDF through a trusted PDF compressor.',
            'If it is a scan, re-scan at a lower resolution (150–200 DPI is usually plenty).',
            'Remove or downsample large embedded images inside the PDF.',
            'Split a very large packet into separate PDFs when the workflow allows it.',
            'Re-upload the smaller file from the Upload PDF page.',
        ),
        tip('Scanning at 200 DPI in black and white instead of 600 DPI in color can cut a file to a fraction of its size while keeping text perfectly legible.'),
        h2('Best practices'),
        ul(
            'Compress photo-heavy scans before uploading.',
            'Prefer text-based PDFs, which are naturally small.',
            'Keep only the pages you actually need to sign.',
            'Upload on a stable connection so large-but-valid files finish.',
        ),
        h2('Common mistakes'),
        ul(
            'Uploading a raw 600 DPI color scan of a multi-page document.',
            'Embedding full-resolution photos that were never resized.',
            'Assuming any upload failure means the file is too big when it may be a network issue.',
            'Splitting a document unnecessarily when compression alone would fix it.',
        ),
        note('Uploads can still fail under 25 MB due to a slow connection, a browser extension, or a temporary network hiccup. Retry on a stable connection or another browser. See Troubleshooting Upload Errors.'),
        h2('Summary'),
        p('The CubSign upload limit is 25 MB, which fits almost every everyday document. If your file is larger, compress it, lower the scan resolution, or split it, then upload again from the Upload PDF page. For format questions read Supported File Types, and for persistent failures see Troubleshooting Upload Errors.'),
    ],
    [
        { question: 'What is the maximum PDF upload size?', answer: 'CubSign accepts PDF files up to 25 MB. Most contracts and forms are far smaller than this.' },
        { question: 'How do I reduce a PDF that is too large?', answer: 'Compress the PDF, lower the scan resolution, remove large embedded images, or split it into smaller files, then upload again.' },
        { question: 'Why did my upload fail even though the file is small?', answer: 'A slow connection, browser extension, or temporary network issue can interrupt uploads. Retry on a stable connection or another browser.' },
    ],
);

/* ═══════════════════════════ SIGNING DOCUMENTS ═══════════════════════════ */

// 8 ── how-to-sign-a-pdf-online
add(
    {
        slug: 'how-to-sign-a-pdf-online',
        title: 'How to Sign a PDF Online',
        excerpt: 'Sign any PDF in your browser: upload, place your signature, review, and download the signed file.',
        categorySlug: 'signing-documents',
        updatedAt: '2026-06-20',
        tags: ['Signing', 'Tutorial'],
        keywords: ['sign pdf online', 'how to sign a pdf', 'esign pdf', 'add signature to pdf'],
        metaTitle: 'How to Sign a PDF in CubSign | CubSign',
        metaDescription: 'Learn how to sign a PDF in CubSign: upload your document, add your signature, place it on the page, and download the signed file.',
        related: ['how-to-upload-a-pdf', 'draw-vs-type-signature', 'download-signed-pdf', 'share-documents'],
    },
    [
        p('Learn how to sign a PDF in CubSign by uploading your document, adding your signature, placing it on the page, and downloading the signed file. Start signing from the Upload PDF page when you are ready to follow along.'),
        p('The same pattern applies whether you are approving a freelance agreement, an NDA, or an internal form. Once you have done it once, every future document follows the identical rhythm.'),
        h2('Why it matters'),
        p('Signing is often the final gate before work can start, money can move, or a hire can begin. Doing it online removes the print-sign-scan delay, keeps a single clean copy of the document, and produces an audit-friendly record. For remote work in particular, browser signing is the difference between same-day and same-week turnaround.'),
        h2('Step-by-step'),
        ol(
            'Upload your PDF (up to 25 MB) from the Upload PDF page.',
            'Add signature, date, and text fields where the document expects them.',
            'Choose Draw, Type, or Upload to create your signature.',
            'Apply the signature and complete every required field.',
            'Review each page, finish the flow, and download the signed PDF.',
        ),
        h2('Creating your signature'),
        p('CubSign supports three methods. Draw captures your handwriting on a canvas with a mouse, trackpad, or touchscreen. Type renders your name in a handwriting-style font for speed and legibility. Upload places an existing signature image. Compare the trade-offs in Draw vs Type Signature.'),
        tip('Before you finish, scroll through the whole PDF and confirm names, dates, and amounts are correct. A signature records agreement to the current text. It does not fix typos in the underlying contract.'),
        h2('Best practices'),
        ul(
            'Align signatures with the printed signature block, not the margin.',
            'Zoom in on dense pages before locking field positions.',
            'Sign the final version of the document, never a draft.',
            'Download and archive the completed file the same day.',
        ),
        h2('Common mistakes'),
        ul(
            'Placing a signature over important price or date text.',
            'Missing an initials block on an exhibit or appendix page.',
            'Signing the wrong page and forgetting to move the field.',
            'Closing the tab as a guest before downloading the signed file.',
        ),
        h2('Signing without an account vs with an account'),
        p('Guest mode is perfect for a single personal signature. A free account adds document history, cloud storage, and the ability to send documents for signature. When you are the sender, recipients can usually sign from a secure link without creating their own account. See Share Documents.'),
        note('For deeper background on how electronic signatures work and when they are recognized, read Electronic Signature Legality and browse the CubSign Blog.'),
        h2('Summary'),
        p('To sign a PDF in CubSign: upload, place fields, create your signature, review, and download. Keep the source document final, place fields carefully, and save the finished PDF. Next, learn to Download Signed PDF or to Share Documents with other signers. Start now from the Upload PDF page.'),
    ],
    [
        { question: 'Do I need an account to sign a PDF?', answer: 'No. You can sign as a guest. A free account adds storage, history, and the ability to request signatures from others.' },
        { question: 'How long does signing take?', answer: 'For a simple one-signature document, the full upload-sign-download flow usually takes under a minute.' },
        { question: 'Can I sign on my phone?', answer: 'Yes. CubSign works in mobile browsers. See Mobile Support for tips on signatures, uploads, and downloads on small screens.' },
    ],
);

// 9 ── draw-vs-type-signature
add(
    {
        slug: 'draw-vs-type-signature',
        title: 'Draw vs Type Signature',
        excerpt: 'Compare drawing and typing your signature so you can pick the best option for each document.',
        categorySlug: 'signing-documents',
        updatedAt: '2026-05-28',
        tags: ['Signature', 'Draw', 'Type'],
        keywords: ['draw vs type signature', 'handwritten signature online', 'typed signature', 'signature style'],
        metaTitle: 'Draw vs Type Signature: Which to Use | CubSign',
        metaDescription: 'Compare drawing and typing your electronic signature in CubSign, including when each option looks and works best.',
        related: ['upload-your-signature-image', 'how-to-sign-a-pdf-online', 'electronic-signature-legality', 'mobile-support'],
    },
    [
        p('CubSign supports multiple ways to create a signature. Draw and Type are the two most common, and both produce a valid electronic signature when you intend to sign. Choosing between them is about appearance and comfort, not legality.'),
        p('This article compares the two approaches, explains when each shines, and helps you pick confidently. If you already have a signature image, you can also skip both and read Upload Your Signature Image.'),
        h2('Why it matters'),
        p('Your signature is the visual mark others associate with your agreement. A clean, legible signature looks professional and reduces "is this really signed?" questions. Picking the right method for the device and document keeps that mark consistent, whether you are on a tablet with a stylus or a desktop without one. Consistency also builds recognition over time, counterparts who see the same tidy signature on every agreement gain quiet confidence that they are dealing with the same person.'),
        h2('Draw signature'),
        p('Drawing captures your handwriting on a canvas using a mouse, trackpad, or touchscreen. It looks closest to pen on paper and works especially well on tablets and phones with a finger or stylus.'),
        ul(
            'Best when you want a natural, handwritten look.',
            'Use landscape orientation on mobile for more room to write.',
            'Clear and redraw freely until you are satisfied.',
        ),
        h2('Type signature'),
        p('Typing renders your name in a handwriting-style font. It is fast, consistent, and easy to read even on dense contracts or at small field sizes.'),
        ul(
            'Best when speed and clarity matter more than a freehand look.',
            'Ideal on desktops without a stylus or touchscreen.',
            'Useful when a drawn signature looks uneven on a small screen.',
        ),
        tip('On a phone, if your drawn signature keeps coming out shaky, switch to Type. A clean typed name almost always reads better than a cramped finger scribble.'),
        h2('Best practices'),
        ul(
            'Match the style to the device, draw on touch, type on desktop.',
            'Keep one consistent style per document for a coherent look.',
            'Preview the signature at actual field size before applying it.',
            'Use a legible version of your name so counterparts can read it.',
        ),
        h2('Common mistakes'),
        ul(
            'Forcing a drawn signature on a tiny screen when Type would look cleaner.',
            'Mixing drawn and typed signatures on the same agreement.',
            'Choosing an unreadable scribble that raises authenticity questions.',
            'Assuming one method is "more legal" than the other. Both indicate intent.',
        ),
        note('There is no legal requirement to pick one method over the other for most everyday documents. What matters is your clear intent to sign. See Electronic Signature Legality for more.'),
        h2('Summary'),
        p('Draw for a natural handwritten look, especially on touch devices; type for speed and legibility, especially on desktops. Both are valid electronic signatures. If neither fits, Upload Your Signature Image instead. When you are ready to apply your choice, follow How to Sign a PDF Online.'),
    ],
    [
        { question: 'Is a drawn signature more legal than a typed one?', answer: 'No. Both drawn and typed signatures are valid electronic signatures when you intend to sign. The method is a matter of appearance and comfort.' },
        { question: 'Which should I use on my phone?', answer: 'Drawing works well in landscape, but typing is often cleaner on small screens. Try both and keep whichever reads best.' },
        { question: 'Can I use an existing signature image instead?', answer: 'Yes. If you already have a signature PNG or JPG, see Upload Your Signature Image to use it directly.' },
    ],
);

// 10 ── upload-your-signature-image
add(
    {
        slug: 'upload-your-signature-image',
        title: 'Upload Your Signature Image',
        excerpt: 'Use an existing signature PNG or JPG instead of drawing or typing, and place it on your PDF.',
        categorySlug: 'signing-documents',
        updatedAt: '2026-05-28',
        tags: ['Signature', 'Upload'],
        keywords: ['upload signature image', 'signature png', 'use signature image pdf', 'add signature picture'],
        metaTitle: 'Upload Your Signature Image | CubSign',
        metaDescription: 'Learn how to upload a signature PNG or JPG in CubSign and place it cleanly on your PDF, with image quality and privacy tips.',
        related: ['draw-vs-type-signature', 'how-to-sign-a-pdf-online', 'mobile-support', 'document-privacy'],
    },
    [
        p('If you already have a scanned or photographed signature, you can upload it and place it on your PDF like any other signature method. This is ideal when you have an approved signature image for personal or brand use and want it to look identical every time.'),
        p('The result is only as good as the image you provide, so a little preparation goes a long way. This article covers uploading, cleaning up the image, and keeping it private.'),
        h2('Why it matters'),
        p('A consistent signature image gives a polished, repeatable look across documents, useful for professionals and brands. It also saves time: instead of redrawing on every device, you apply the same clean mark. But a poor-quality image (blurry, boxed in a gray background) undermines that polish, which is why image quality matters. Investing a couple of minutes once to capture a crisp, well-cropped signature pays off on every future document you sign with it.'),
        h2('Step-by-step: upload a signature image'),
        ol(
            'Open a document in the CubSign signing editor.',
            'Choose the Upload signature option.',
            'Select a clear PNG or JPG of your signature.',
            'Place and resize the signature on the document.',
        ),
        tip('A PNG with a transparent background looks best because the signature blends into the page instead of sitting inside a white or gray box.'),
        h2('Best practices for the image'),
        ul(
            'Use a high-contrast signature on a plain white or transparent background.',
            'Crop tightly around the signature so empty space does not push it off the field.',
            'Prefer PNG for transparency; use a clean, well-lit JPG otherwise.',
            'Avoid low-resolution photos that blur when enlarged.',
        ),
        h2('Common mistakes'),
        ul(
            'Uploading a dim phone photo with shadows and a colored background.',
            'Leaving huge margins around the signature so it appears tiny in the field.',
            'Using a tilted or skewed capture that looks unprofessional.',
            'Saving at very low resolution, producing a pixelated mark.',
        ),
        h2('Security considerations'),
        p('Treat your signature image like a personal asset. Do not share your account or leave a saved signature accessible to others, since a signature image can be reused. During a session, the image is used to sign the current document; create an account if you want to reuse signatures and keep documents in your workspace. For more, read Document Privacy.'),
        note('If your legal name or signature changes, recreate the image so your applied signature always matches your current mark.'),
        h2('Summary'),
        p('Uploading a signature image lets you apply a consistent, professional mark to every PDF. Use a high-contrast, tightly cropped PNG or JPG, place and resize it in the editor, and keep it private. If you would rather sign freehand, compare options in Draw vs Type Signature, then complete signing with How to Sign a PDF Online.'),
    ],
    [
        { question: 'What image format should I use for my signature?', answer: 'A PNG with a transparent background is best. A clean, high-contrast JPG also works if you crop it tightly.' },
        { question: 'Why does my uploaded signature look boxed in?', answer: 'That usually means the image has a solid background. Use a transparent PNG or crop tightly around the signature for a clean placement.' },
        { question: 'Is my signature image kept private?', answer: 'Your signature image is used for your signing session. Create an account to reuse it, and never share your account so the image cannot be misused. See Document Privacy.' },
    ],
);

// 11 ── download-signed-pdf
add(
    {
        slug: 'download-signed-pdf',
        title: 'Download Signed PDF',
        excerpt: 'Save the final signed PDF to your device after completing a signature, and find it later in your workspace.',
        categorySlug: 'signing-documents',
        updatedAt: '2026-06-20',
        tags: ['Download', 'Signed PDF'],
        keywords: ['download signed pdf', 'save signed document', 'get signed copy', 'export signed pdf'],
        metaTitle: 'How to Download a Signed PDF | CubSign',
        metaDescription: 'Learn how to download your signed PDF after signing, retrieve it from your workspace, and understand what the file contains.',
        related: ['how-to-sign-a-pdf-online', 'share-documents', 'audit-trail', 'delete-documents'],
    },
    [
        p('After you finish signing, CubSign generates a signed PDF you can download and keep with your records. The downloaded file is the official, portable copy of your agreement, the thing you archive, forward, or file away.'),
        p('This guide shows how to download right after signing, how to retrieve the file later from your workspace, and what the signed PDF actually contains.'),
        h2('Why it matters'),
        p('The signed PDF is your evidence that an agreement was completed. Treating it as the system of record, stored somewhere reliable, named clearly, prevents the "which version did we sign?" confusion that plagues email and paper workflows. Downloading promptly is especially important for guest signing, where the file is not saved to an account. Even with an account, keeping your own copy means you are never dependent on a single location to retrieve an important agreement, and your finance or legal colleagues can file it in whatever system they treat as authoritative.'),
        h2('Step-by-step: download after signing yourself'),
        ol(
            'Complete all required signature and form fields.',
            'Finish the signing flow.',
            'Choose Download on the completion screen to save the PDF.',
            'Confirm the file opens correctly on your device.',
        ),
        h2('Download from your workspace'),
        p('If you are signed in, open Documents, select the completed document, and use Download. This gives you a second, reliable place to retrieve executed agreements later, handy when a colleague needs a copy months after signing.'),
        tip('Name files predictably: counterpart, document type, and date signed. Future-you will search for exactly those terms at renewal time.'),
        h2('What the signed file includes'),
        p('The downloaded PDF contains the applied signatures and related field values from the signing session. CubSign also maintains an audit trail of signing events for documents processed through the platform. See Audit Trail for what is recorded.'),
        h2('Best practices'),
        ul(
            'Download immediately, especially when signing as a guest.',
            'Store the file in your team’s official contracts folder, not just email.',
            'Keep a copy for contracts you may need offline.',
            'Verify the file opens and shows every signature before archiving.',
        ),
        h2('Common mistakes'),
        ul(
            'Closing the tab before saving the file as a guest.',
            'Leaving the only copy in a downloads folder that gets cleared.',
            'Assuming email delivery replaces keeping your own archived copy.',
            'Forgetting to download before deleting a document from the workspace.',
        ),
        note('If you plan to Delete Documents from your workspace, download a final signed copy first so you retain it for your records.'),
        h2('Summary'),
        p('Download your signed PDF from the completion screen, or later from your workspace Documents. Save it somewhere durable with a clear name, and verify it opens with all signatures present. To involve other signers, read Share Documents; to understand the recorded events behind the file, see Audit Trail.'),
    ],
    [
        { question: 'How do I download my signed PDF?', answer: 'After completing all fields and finishing the flow, choose Download on the completion screen. Signed-in users can also download later from the Documents workspace.' },
        { question: 'Where can I find a signed document later?', answer: 'If you signed in, open Documents in your workspace, select the completed file, and download it again anytime.' },
        { question: 'What does the signed PDF contain?', answer: 'It contains the applied signatures and field values from the signing session. CubSign also keeps an audit trail of signing events. See the Audit Trail article.' },
    ],
);

// 12 ── share-documents
add(
    {
        slug: 'share-documents',
        title: 'Share Documents',
        excerpt: 'Send a PDF for signature and let recipients sign from a secure link, usually without an account.',
        categorySlug: 'signing-documents',
        updatedAt: '2026-06-20',
        tags: ['Share', 'Recipients'],
        keywords: ['send pdf for signature', 'request signature', 'share document to sign', 'collect signatures'],
        metaTitle: 'How to Share Documents for Signature | CubSign',
        metaDescription: 'Learn how to send a PDF for signature with CubSign, assign recipients, and track completion. Recipients sign from a secure link.',
        related: ['how-to-sign-a-pdf-online', 'audit-trail', 'document-privacy', 'download-signed-pdf'],
    },
    [
        p('CubSign can send documents to other people for signature. Recipients open a secure link, review the PDF, and sign, usually without creating a CubSign account. This turns a solo signature into a coordinated, multi-party workflow.'),
        p('Sending for signature is where CubSign saves the most time for teams. Instead of emailing attachments back and forth, you assign fields, send once, and watch status update as signatures arrive.'),
        h2('Why it matters'),
        p('Chasing signatures over email is slow and error-prone: attachments get lost, versions diverge, and nobody knows who still needs to sign. A structured send gives every recipient the same clean document, the correct fields, and a clear call to action, while you keep a single source of truth and an audit trail. That structure scales, whether you need one signature or several, the process stays the same and the status is always visible.'),
        h2('Step-by-step: send for signature'),
        ol(
            'Upload your PDF from the Upload PDF page and open the editor.',
            'Add signature fields for each person who must sign.',
            'Enter recipient email addresses and assign fields to the right person.',
            'Send the document and track status from your workspace.',
            'Download the completed PDF once everyone has signed.',
        ),
        h2('What recipients experience'),
        p('Recipients get an email with a secure signing link. They review the document, complete their assigned fields, and submit. You are notified as signatures come in, so you can follow up only with the people still pending.'),
        tip('Add a short note explaining what the document is and why it matters. Context reduces hesitation and speeds up completion.'),
        h2('Best practices'),
        ul(
            'Double-check recipient emails before sending, typos send contracts nowhere.',
            'Assign each field to the correct signer so nobody signs the wrong line.',
            'Tell mobile recipients which browser works best (see Mobile Support).',
            'Download the completed PDF promptly once all signatures land.',
        ),
        h2('Common mistakes'),
        ul(
            'Sending a draft with a watermark instead of the final PDF.',
            'Leaving fields unassigned so recipients are unsure where to sign.',
            'Entering a misspelled email and assuming the recipient ignored it.',
            'Forgetting to follow up on a single pending signer.',
        ),
        h2('Security considerations'),
        p('Signing links are unique to the intended workflow, and documents remain private by default. Send only to people who genuinely need to sign, and verify addresses carefully. For how access and privacy work, read Document Privacy, and for the recorded history of a send, see Audit Trail.'),
        note('Recipients usually do not need a CubSign account to sign. That lowers friction and improves completion rates for external partners and clients.'),
        h2('Summary'),
        p('Sharing a document for signature means uploading, assigning fields to recipients, sending secure links, and tracking completion. Verify emails, add context, and download the finished PDF when everyone has signed. To prepare the document itself, start with How to Sign a PDF Online, and understand privacy in Document Privacy.'),
    ],
    [
        { question: 'Do recipients need a CubSign account to sign?', answer: 'Usually no. Recipients open a secure email link, review the document, and sign without creating an account.' },
        { question: 'How do I know when someone has signed?', answer: 'You are notified as signatures come in, and you can track status from your workspace so you only follow up with pending signers.' },
        { question: 'Can I send one PDF to multiple signers?', answer: 'Yes. Add a signature field for each person, assign fields to the right recipient, and send. Track completion until everyone has signed.' },
    ],
);

/* ═══════════════════════════ ACCOUNT ═══════════════════════════ */

// 13 ── delete-documents
add(
    {
        slug: 'delete-documents',
        title: 'Delete Documents',
        excerpt: 'Remove documents from your CubSign workspace when you no longer need them, safely and deliberately.',
        categorySlug: 'account',
        updatedAt: '2026-06-01',
        tags: ['Documents', 'Privacy'],
        keywords: ['delete cubsign document', 'remove document', 'clean up workspace', 'delete signed pdf'],
        metaTitle: 'How to Delete Documents in CubSign | CubSign',
        metaDescription: 'Learn how to delete documents from your CubSign workspace, what deletion means, and what to check before you remove a file.',
        related: ['document-privacy', 'secure-storage', 'download-signed-pdf', 'contact-support'],
    },
    [
        p('You control the documents stored in your CubSign account. Deleting files you no longer need keeps your workspace clean and reduces the amount of data retained about you. This is part of good privacy hygiene, especially for sensitive agreements.'),
        p('Deletion is deliberate and permanent, so it is worth a moment of care. This guide covers how to delete, what deletion actually does, and what to confirm first.'),
        h2('Why it matters'),
        p('Every stored document is data you are responsible for. Removing files you no longer need shrinks your exposure if an account is ever compromised and keeps your workspace focused on active matters. Deliberate cleanup also prevents the clutter that makes it hard to find the documents that still matter. For businesses handling personal or financial information, minimizing retained data is also a sensible privacy practice: the less sensitive material you keep beyond its useful life, the smaller the risk if anything ever goes wrong.'),
        h2('Step-by-step: delete a document'),
        ol(
            'Sign in and open Documents from your workspace.',
            'Find the document you want to remove.',
            'Open the document actions and choose Delete (or Archive for a softer cleanup).',
            'Confirm the deletion when prompted.',
        ),
        h2('What deletion means'),
        p('Deleted documents are removed from your workspace and are no longer available to download or share. If a signing request was already sent, recipients may lose access once the document is deleted. Treat deletion as final.'),
        tip('Prefer Archive when you might need a document later but want it out of your active list. Reserve Delete for files you are certain you no longer need.'),
        h2('Best practices'),
        ul(
            'Download a final signed copy before deleting. See Download Signed PDF.',
            'Confirm no open signature requests depend on the file.',
            'Double-check you selected the correct document.',
            'Delete sensitive documents once a matter is fully closed.',
        ),
        h2('Common mistakes'),
        ul(
            'Deleting the only copy of a signed contract you still needed.',
            'Removing a document while recipients are mid-signing.',
            'Confusing two similarly named files and deleting the wrong one.',
            'Assuming deletion can be undone. Treat it as permanent.',
        ),
        h2('Security considerations'),
        p('Deleting documents supports the privacy principle of keeping only what you need. Combined with the protections in Secure Storage and Document Privacy, deliberate cleanup limits how much sensitive data lives in your account over time.'),
        note('If you are unsure whether a file is safe to delete, Archive it first, or reach out from the Contact page before removing anything critical.'),
        h2('Summary'),
        p('Delete documents from Documents in your workspace when they are no longer needed, but download a final copy first and confirm nothing depends on the file. Deletion is permanent. For related privacy topics, read Document Privacy and Secure Storage.'),
    ],
    [
        { question: 'How do I delete a document in CubSign?', answer: 'Sign in, open Documents, find the file, open its actions, choose Delete, and confirm. You can Archive instead for a softer cleanup.' },
        { question: 'Can I recover a deleted document?', answer: 'Treat deletion as permanent. Download a final signed copy before deleting, and use Archive if you might need the file later.' },
        { question: 'What happens to recipients if I delete a shared document?', answer: 'If a signing request was already sent, recipients may lose access once the document is deleted. Confirm no active request depends on it first.' },
    ],
);

// 14 ── email-verification
add(
    {
        slug: 'email-verification',
        title: 'Email Verification',
        excerpt: 'Verify your email address to unlock the full CubSign workspace and receive signing notifications.',
        categorySlug: 'account',
        updatedAt: '2026-05-12',
        tags: ['Account', 'Email'],
        keywords: ['verify email cubsign', 'email verification', 'confirm email address', 'verification email not received'],
        metaTitle: 'Email Verification in CubSign | CubSign',
        metaDescription: 'Learn how CubSign email verification works, why it matters, and what to do if the verification email does not arrive.',
        related: ['create-your-cubsign-account', 'google-login', 'reset-password', 'contact-support'],
    },
    [
        p('CubSign asks you to verify your email so we can confirm account ownership, send signing notifications, and protect your workspace. Verification is a quick, one-time step that unlocks the full account experience.'),
        p('If the verification email does not arrive right away, do not worry, the fixes are simple and covered below. In almost every case it is a matter of checking the right folder or confirming the address you typed, rather than anything being broken with your account.'),
        h2('Why it matters'),
        p('Your email is the anchor of your CubSign account. It receives signing notifications, password resets, and important updates. Verifying it proves you own the address, prevents someone from creating an account with your email, and ensures you actually receive the messages the product depends on. If your address is never verified, you may miss the very notifications that tell you a document was signed or is waiting for you, which quietly stalls the workflows you set up in the first place. A verified address is also what makes account recovery reliable if you ever forget your password.'),
        h2('Step-by-step: verify your email'),
        ol(
            'Create an account with your email address.',
            'Open the verification email from CubSign.',
            'Click the verification link to confirm your address.',
            'Return to CubSign and continue to your dashboard.',
        ),
        h2('Did not receive the email?'),
        ul(
            'Check spam, junk, and promotions folders.',
            'Confirm you typed the correct email during signup.',
            'Wait a minute and request a new verification email from the prompt in CubSign.',
            'Add support@cubsign.com to your contacts if your provider filters unknown senders.',
        ),
        tip('Corporate mail filters are the most common culprit. If nothing arrives, try a personal address or ask your IT team to allowlist messages from cubsign.com.'),
        h2('Best practices'),
        ul(
            'Verify promptly so signing notifications reach you.',
            'Use an email you check regularly and control long-term.',
            'Keep the address current if you change providers.',
            'Consider Google Login to skip separate email/password management.',
        ),
        h2('Common mistakes'),
        ul(
            'Registering with a typo in the email address.',
            'Ignoring the spam folder where the message often lands.',
            'Letting the verification link expire and not requesting a new one.',
            'Verifying one address but signing in with a different one.',
        ),
        note('Prefer not to manage verification at all? Google Login authenticates through Google, so a separate CubSign verification step is typically unnecessary.'),
        h2('Summary'),
        p('Email verification confirms you own your address, protects your account, and enables signing notifications. Open the CubSign email, click the link, and you are done. If it does not arrive, check spam, confirm the address, and request a new one, an allowlist entry for cubsign.com solves most stubborn filtering issues. For alternatives, see Google Login, and for access recovery, read Reset Password. Once verified, you can move straight on to uploading and signing from the Upload PDF page.'),
    ],
    [
        { question: 'Why does CubSign need to verify my email?', answer: 'Verification confirms account ownership, enables signing notifications, and prevents someone else from creating an account with your address.' },
        { question: 'The verification email never arrived, what do I do?', answer: 'Check spam and promotions folders, confirm you typed the address correctly, and request a new verification email. Allowlist cubsign.com if your provider filters unknown senders.' },
        { question: 'Do Google Login users need to verify email?', answer: 'Generally no. Google Login authenticates through Google, so a separate verification step is typically unnecessary.' },
    ],
);

// 15 ── google-login
add(
    {
        slug: 'google-login',
        title: 'Google Login',
        excerpt: 'Sign in to CubSign quickly and securely with your Google account, with no separate password to manage.',
        categorySlug: 'account',
        updatedAt: '2026-05-12',
        tags: ['Account', 'Google', 'Login'],
        keywords: ['google login cubsign', 'sign in with google', 'continue with google', 'google sso'],
        metaTitle: 'Sign In with Google Login | CubSign',
        metaDescription: 'Learn how to use Google Login with CubSign, what data CubSign receives, and how to switch between Google and email sign-in.',
        related: ['create-your-cubsign-account', 'email-verification', 'reset-password', 'secure-storage'],
    },
    [
        p('Google Login lets you create or access a CubSign account without managing a separate password for CubSign. If you already use a Google account, it is the fastest way to get started and one less password to remember.'),
        p('This article explains how to sign in with Google, exactly what CubSign receives, and how to avoid duplicate accounts when switching login methods.'),
        h2('Why it matters'),
        p('Passwords are the weakest link in most accounts, reused, forgotten, or phished. Signing in with Google delegates authentication to a provider you already trust and secure, often with two-factor protection. That means faster access for you and fewer password-related support issues. There is also nothing new to remember: if you can sign into Google, you can sign into CubSign, which removes a common reason people get locked out of their own documents.'),
        h2('Step-by-step: sign in with Google'),
        ol(
            'Open the CubSign Login or Register page.',
            'Choose Continue with Google.',
            'Select the Google account you want to use and approve access.',
            'CubSign creates or opens your account and takes you to the workspace.',
        ),
        h2('What CubSign receives'),
        p('CubSign uses Google only for authentication basics such as your name and email. We do not receive access to your Google Drive files or Gmail content through this login. It is sign-in, not data sharing.'),
        tip('Use the same login method every time. Consistently choosing Continue with Google avoids accidentally creating a second account with an email/password profile.'),
        h2('Best practices'),
        ul(
            'Secure your Google account with a strong password and two-factor authentication.',
            'Use the same email consistently across CubSign.',
            'Review which apps have access in your Google security settings periodically.',
            'Keep your recovery options current on the Google side.',
        ),
        h2('Common mistakes'),
        ul(
            'Registering with email/password, then later using Google with a different address.',
            'Creating duplicate profiles by switching methods on the same account.',
            'Forgetting which Google account was used to register.',
            'Assuming Google Login shares your Drive or Gmail. It does not.',
        ),
        h2('Security considerations'),
        p('Because Google handles authentication, your CubSign access is only as secure as your Google account, so protect it well. CubSign still applies its own protections to your documents; see Secure Storage. If you ever suspect unauthorized access, secure your Google account first, then review your CubSign workspace.'),
        note('If you previously registered with email and password and now want Google Login on the same address, reach out from the Contact page before linking so we can help you avoid duplicate profiles.'),
        h2('Summary'),
        p('Google Login is a fast, secure way to access CubSign without a separate password. It shares only basic profile details, never your Drive or Gmail content. Use one method consistently, secure your Google account, and read Secure Storage for how documents are protected. If you prefer email, see Reset Password for password help.'),
    ],
    [
        { question: 'Does Google Login give CubSign access to my Gmail or Drive?', answer: 'No. CubSign uses Google only for authentication basics like your name and email. It does not access your Gmail content or Drive files.' },
        { question: 'Can I switch from email login to Google Login?', answer: 'Use the same email consistently. If you registered with email and password, contact support before linking a Google account to avoid duplicate profiles.' },
        { question: 'What if I forget which Google account I used?', answer: 'Try the addresses you commonly use. If you still cannot access your account, reach out from the Contact page for help.' },
    ],
);

// 16 ── reset-password
add(
    {
        slug: 'reset-password',
        title: 'Reset Password',
        excerpt: 'Recover access to your CubSign account if you forgot your password, using a secure reset link.',
        categorySlug: 'account',
        updatedAt: '2026-05-12',
        tags: ['Account', 'Password'],
        keywords: ['reset cubsign password', 'forgot password', 'change password', 'password recovery'],
        metaTitle: 'How to Reset Your Password | CubSign',
        metaDescription: 'Step-by-step guide to resetting your CubSign password with a secure link, plus password tips and the Google Login alternative.',
        related: ['google-login', 'email-verification', 'create-your-cubsign-account', 'contact-support'],
    },
    [
        p('If you sign in with email and password, you can reset your password at any time from the login page. The process uses a secure, time-limited link sent to your registered email, so only someone with access to that inbox can complete it.'),
        p('This article walks through the reset steps, shares password tips, and explains when you might not need a password at all.'),
        h2('Why it matters'),
        p('A forgotten password should never lock you out of your own documents. A reliable reset flow keeps you in control while protecting the account, because the reset link goes only to your verified email. Understanding the process also helps you spot phishing attempts that imitate reset emails. Genuine reset messages appear only after you request one and always link back to the real CubSign site, so an unexpected reset email is a signal to slow down rather than click through in a hurry.'),
        h2('Step-by-step: reset your password'),
        ol(
            'Go to Login and choose Forgot password.',
            'Enter the email address for your CubSign account.',
            'Open the password reset email and click the secure link.',
            'Choose a new password and save it.',
            'Sign in with your new password.',
        ),
        tip('Reset links expire for security. If yours no longer works, simply request a new one from the Forgot password prompt.'),
        h2('Password tips'),
        ul(
            'Use a unique password you do not reuse on other sites.',
            'Prefer a long passphrase or a password manager.',
            'Never share reset links, anyone with the link could change your password.',
            'Update the password if you suspect it was exposed anywhere.',
        ),
        h2('Common mistakes'),
        ul(
            'Requesting a reset for an email that is not the one on the account.',
            'Ignoring the reset email in the spam folder.',
            'Waiting too long so the link expires, then not requesting a new one.',
            'Choosing a weak or reused password after resetting.',
        ),
        h2('Security considerations'),
        p('Legitimate reset emails come from CubSign and link back to the real site. Check the address before entering anything. If you receive a reset email you did not request, it may mean someone entered your address; you can safely ignore it as long as you do not click through and change the password. For account protection basics, read Secure Storage.'),
        note('Using Google Login? You do not need a CubSign password at all. Just choose Continue with Google on the login page. See the Google Login article.'),
        h2('Summary'),
        p('To reset your CubSign password, use Forgot password on the Login page, open the secure email link, and set a new, unique password. Reset links expire, so request a fresh one if needed. If you sign in with Google, skip passwords entirely via Google Login, and verify your address using Email Verification.'),
    ],
    [
        { question: 'How do I reset my CubSign password?', answer: 'On the Login page choose Forgot password, enter your email, open the reset email, click the secure link, and set a new password.' },
        { question: 'The reset link stopped working, why?', answer: 'Reset links expire for security. Request a new link from the Forgot password prompt and use it promptly.' },
        { question: 'I use Google Login, do I need a password?', answer: 'No. Google Login users do not need a CubSign password. Just choose Continue with Google on the login page.' },
    ],
);

/* ═══════════════════════════ SECURITY ═══════════════════════════ */

// 17 ── secure-storage
add(
    {
        slug: 'secure-storage',
        title: 'Secure Storage',
        excerpt: 'How CubSign protects your documents in transit and at rest with encryption and access controls.',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        tags: ['Security', 'Encryption'],
        keywords: ['cubsign secure storage', 'document encryption', 'encrypted pdf storage', 'data security'],
        metaTitle: 'Secure Storage: How CubSign Protects Documents | CubSign',
        metaDescription: 'Learn how CubSign secures documents with HTTPS in transit, encryption at rest, and access controls for uploads, signing, and downloads.',
        related: ['document-privacy', 'audit-trail', 'delete-documents', 'electronic-signature-legality'],
    },
    [
        p('Document security is part of every CubSign workflow, from the moment you upload a PDF to the moment you download or delete it. Security is not a single feature. It is layered protection across the connection, the stored file, and who can access it.'),
        p('This article explains those layers in plain language so you can evaluate CubSign with confidence and understand your own role in keeping documents safe.'),
        h2('Why it matters'),
        p('The documents you sign often contain sensitive details: names, addresses, financial terms, and confidential business information. Weak security anywhere in the chain, an unencrypted connection, plaintext storage, or loose access, puts that data at risk. Layered protection ensures a single weak point does not expose your files. This defense-in-depth approach is the same principle banks and healthcare systems rely on: if one control is bypassed, others still stand between an attacker and your data. Understanding those layers also helps you judge any signing tool, not just CubSign, when sensitive documents are involved.'),
        h2('Encryption in transit'),
        p('All traffic between your browser and CubSign uses HTTPS with modern TLS. That protects uploads, signing sessions, and downloads from being read on the network, including on shared or public connections.'),
        h2('Encryption at rest'),
        p('Stored documents are protected with industry-standard encryption on the server side. Rather than sitting as plain files on disk, they are encrypted, and access is limited to authorized account holders and recipients with valid signing links.'),
        tip('For highly sensitive contracts, sign from a trusted network and a private device rather than a shared public computer, adding a human layer to the platform’s protections.'),
        h2('Session and access controls'),
        ul(
            'Signing links are unique to the intended workflow.',
            'Account sessions require authentication for workspace documents.',
            'You can delete documents you no longer need. See Delete Documents.',
            'Access is limited to you and the recipients you invite.',
        ),
        h2('Best practices for your side of security'),
        ul(
            'Protect your login, use a strong password or Google Login with two-factor.',
            'Verify recipient emails before sending documents.',
            'Avoid signing on shared or public machines.',
            'Delete sensitive files once a matter is closed.',
        ),
        h2('Common mistakes'),
        ul(
            'Forwarding confidential PDFs to large email CC lists.',
            'Storing signed contracts indefinitely in a personal downloads folder.',
            'Reusing a weak password that is exposed elsewhere.',
            'Signing sensitive documents on public Wi-Fi without care.',
        ),
        note('Security is a shared responsibility. CubSign protects the platform; you protect your credentials and your recipient list.'),
        h2('Summary'),
        p('CubSign secures documents with HTTPS in transit, encryption at rest, and access controls that limit who can open a file. Pair those protections with good habits, strong login, verified recipients, and prompt cleanup. For related topics, read Document Privacy, Audit Trail, and Delete Documents.'),
    ],
    [
        { question: 'Does CubSign encrypt my documents?', answer: 'Yes. Documents are encrypted in transit with HTTPS/TLS and protected at rest with industry-standard server-side encryption.' },
        { question: 'Who can access my stored documents?', answer: 'Access is limited to you as the authenticated account holder and the recipients you invite via valid signing links.' },
        { question: 'What can I do to improve security on my end?', answer: 'Protect your login, verify recipient emails, avoid signing on public machines, and delete sensitive files once a matter is closed.' },
    ],
);

// 18 ── document-privacy
add(
    {
        slug: 'document-privacy',
        title: 'Document Privacy',
        excerpt: 'Who can see your documents and how CubSign keeps uploaded files private by default.',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        tags: ['Privacy', 'Security'],
        keywords: ['document privacy', 'private pdf', 'who can see my documents', 'cubsign privacy'],
        metaTitle: 'Document Privacy in CubSign | CubSign',
        metaDescription: 'Understand how CubSign keeps documents private, who can access them, what staff can see, and how to control your own privacy.',
        related: ['secure-storage', 'share-documents', 'delete-documents', 'audit-trail'],
    },
    [
        p('Your documents are private by default. CubSign does not publish uploaded PDFs publicly or list them in search engines. Privacy is the baseline, not an add-on, access is limited to you and the people you explicitly invite.'),
        p('This article explains exactly who can access a document, what CubSign staff can and cannot see, and the controls you have to protect sensitive files.'),
        h2('Why it matters'),
        p('The documents you sign frequently contain personal and confidential information. Knowing who can access them and confirming that the default is private, lets you use the platform with confidence. Understanding your own controls means you can keep tight boundaries around especially sensitive agreements. Privacy is not only about the platform; the biggest variable is usually who you choose to share a document with, which is entirely in your hands.'),
        h2('Who can access a document'),
        ul(
            'You, when signed into your account and viewing your workspace.',
            'Recipients you explicitly invite to sign via a secure link.',
            'Guest signing sessions you start yourself, for that session only.',
        ),
        h2('What CubSign staff can see'),
        p('Support access is limited and used only when needed to investigate issues you report. We do not use your private documents for marketing, and we do not sell your document contents. Your files are yours.'),
        tip('Only upload documents you are authorized to process. If a file contains secrets that belong to someone else, confirm you have permission before signing or sharing it.'),
        h2('Your privacy controls'),
        ul(
            'Share only with people who genuinely need to sign. See Share Documents.',
            'Download and delete documents when a matter is finished.',
            'Use Delete Documents to remove files you no longer need.',
            'Verify recipient addresses so links reach the right people only.',
        ),
        h2('Best practices'),
        ul(
            'Keep recipient lists tight and accurate.',
            'Close out sensitive matters by deleting the file afterward.',
            'Avoid forwarding private PDFs to unnecessary parties.',
            'Protect your login so no one else can open your workspace.',
        ),
        h2('Common mistakes'),
        ul(
            'Sending a document to a mistyped or wrong email address.',
            'Leaving completed sensitive files in the workspace indefinitely.',
            'Assuming a shared link is public. Links are scoped to the workflow, not open to search engines.',
            'Uploading documents you are not authorized to handle.',
        ),
        h2('Security considerations'),
        p('Privacy and storage security work together. Documents are private by default and protected by the measures in Secure Storage, while the Audit Trail records who accessed and signed a file. Together they give you both confidentiality and accountability.'),
        note('For full details on data handling and retention, read the CubSign Privacy Policy in addition to this Help Center article.'),
        h2('Summary'),
        p('CubSign keeps documents private by default: only you and invited recipients can access them, and staff access is limited to support needs. Control privacy by sharing narrowly, verifying emails, and deleting finished files. See Secure Storage for protection details and Share Documents for safe sending.'),
    ],
    [
        { question: 'Are my documents private on CubSign?', answer: 'Yes. Documents are private by default. They are not published publicly or listed in search engines, and only you and invited recipients can access them.' },
        { question: 'Can CubSign staff read my documents?', answer: 'Staff access is limited and used only when needed to investigate an issue you report. CubSign does not use your private documents for marketing or sell their contents.' },
        { question: 'How do I keep a sensitive document extra private?', answer: 'Share only with required recipients, verify their email addresses, and delete the file once the matter is finished. See Delete Documents.' },
    ],
);

// 19 ── audit-trail
add(
    {
        slug: 'audit-trail',
        title: 'Audit Trail',
        excerpt: 'Understand the signing history CubSign records for accountability and dispute readiness.',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        tags: ['Audit', 'Compliance'],
        keywords: ['audit trail', 'signing history', 'document audit log', 'esignature evidence'],
        metaTitle: 'What Is an Audit Trail in CubSign? | CubSign',
        metaDescription: 'Learn what an audit trail records during signing, why it matters for accountability, and where to find document history in CubSign.',
        related: ['electronic-signature-legality', 'secure-storage', 'download-signed-pdf', 'share-documents'],
    },
    [
        p('An audit trail is a chronological record of important events on a document. CubSign logs key actions so you can show when a document was created, viewed, signed, or completed. Where a signature answers "who marked the page?", an audit trail answers "what sequence of events led here?"'),
        p('This record is quiet but powerful: it turns a signed PDF into a defensible story of exactly what happened and when.'),
        h2('Why it matters'),
        p('If a signing is ever questioned months or years later, the audit trail provides context that a signature alone cannot. Timestamps and event details help demonstrate that signing happened in a controlled electronic process, supporting dispute resolution, internal compliance reviews, and simple peace of mind. The value is quiet but real: most trails are never examined, yet the one time a document is challenged, that record is exactly what turns a "he said, she said" argument into a clear sequence of facts.'),
        h2('What is typically recorded'),
        ul(
            'Document created or uploaded.',
            'Sent for signature.',
            'Viewed by a recipient.',
            'Signed by a participant.',
            'Completed and available for download.',
        ),
        h2('Why audit trails strengthen a signature'),
        p('Intent to sign, association of the signature with the document, and a reliable record of the process are recurring themes in electronic signature frameworks. The audit trail supplies that reliable record, complementing, not replacing, the signed PDF itself.'),
        tip('When your process needs an offline evidence pack, download the signed PDF and keep it together with any activity summary your workspace provides.'),
        h2('Where to find history'),
        p('Signed-in users can review document status and history from the Documents workspace. Keep downloaded signed PDFs with your business records when a matter requires long-term retention. See Download Signed PDF.'),
        h2('Best practices'),
        ul(
            'Archive the final PDF alongside the invitation and any activity record.',
            'Use clear file names so records are easy to locate later.',
            'Verify recipient identity through correct email addresses before sending.',
            'Retain records for the period your industry or agreements require.',
        ),
        h2('Common mistakes'),
        ul(
            'Relying on the signature image alone with no surrounding record.',
            'Deleting a document before exporting the evidence you may need.',
            'Failing to store the completed PDF in a durable location.',
            'Assuming an audit trail replaces the signed file. Keep both.',
        ),
        h2('Security considerations'),
        p('Audit trails work hand in hand with Secure Storage and Document Privacy: the file stays protected and private, while the trail provides accountability. For how this supports the legal recognition of electronic signatures, read Electronic Signature Legality.'),
        note('An audit trail supports your evidence but does not, by itself, guarantee any legal outcome. Requirements vary by document type and jurisdiction.'),
        h2('Summary'),
        p('An audit trail records the key events in a document’s signing lifecycle, creation, sending, viewing, signing, and completion, giving you accountability and dispute readiness. Find history in your workspace, and keep the downloaded PDF as your primary record. Learn more in Electronic Signature Legality and Secure Storage.'),
    ],
    [
        { question: 'What does a CubSign audit trail record?', answer: 'It records key signing events such as document creation, sending, recipient views, signatures, and completion, along with timestamps.' },
        { question: 'Where can I see a document’s history?', answer: 'Signed-in users can review status and history from the Documents workspace. Keep the downloaded signed PDF for long-term records.' },
        { question: 'Does an audit trail make a signature legally binding?', answer: 'It strengthens your evidence by showing a reliable process, but it does not by itself guarantee a legal outcome. Requirements vary. See Electronic Signature Legality.' },
    ],
);

// 20 ── electronic-signature-legality
add(
    {
        slug: 'electronic-signature-legality',
        title: 'Electronic Signature Legality',
        excerpt: 'An overview of how electronic signatures work under common e-sign frameworks like ESIGN, UETA, and eIDAS.',
        categorySlug: 'security',
        updatedAt: '2026-06-01',
        tags: ['Legal', 'eSign'],
        keywords: ['electronic signature legality', 'are esignatures legal', 'esign act ueta', 'eidas signature'],
        metaTitle: 'Are Electronic Signatures Legal? | CubSign',
        metaDescription: 'Understand how electronic signatures are recognized under ESIGN, UETA, and eIDAS, what makes them effective, and important limitations.',
        related: ['audit-trail', 'draw-vs-type-signature', 'secure-storage', 'what-is-cubsign'],
    },
    [
        p('Electronic signatures are widely recognized when parties intend to sign and consent to do business electronically. CubSign produces electronic signatures suitable for many everyday agreements, from NDAs to onboarding forms and vendor contracts.'),
        p('This article explains the common legal frameworks, what usually makes an electronic signature effective, and where the limits are. It is educational, not legal advice.'),
        h2('Why it matters'),
        p('Understanding the basics of e-signature law helps you choose the right workflow and avoid two opposite errors: treating electronic signatures as legally worthless, or assuming they are valid for every document type without checking. A little knowledge keeps your agreements both fast and defensible. It also helps you respond calmly when a counterpart raises doubts, you can explain how intent, consent, and a reliable record combine to make a signature effective, rather than defaulting to paper out of uncertainty.'),
        h2('Common legal frameworks'),
        ul(
            'United States: the ESIGN Act (federal) and UETA (adopted by most states).',
            'European Union: the eIDAS regulation, which defines tiers of electronic signatures.',
            'Many other jurisdictions recognize electronic signatures with local variations.',
        ),
        h2('What usually makes a signature effective'),
        ol(
            'Clear intent to sign the specific document.',
            'Consent to use electronic records and signatures.',
            'Association of the signature with the document.',
            'A reliable record of the signing process, such as an audit trail.',
        ),
        tip('An audit trail matters here. Timestamps and event history help demonstrate intent and a controlled process. See the Audit Trail article for what CubSign records.'),
        h2('Best practices'),
        ul(
            'Confirm all parties consent to signing electronically.',
            'Sign the final document version, not a draft.',
            'Keep the completed PDF and its signing record together.',
            'Check whether your document type or industry has special rules.',
        ),
        h2('Common mistakes'),
        ul(
            'Assuming every document can be e-signed, some have special formalities.',
            'Neglecting to keep evidence of intent and the signing process.',
            'Treating "please e-sign" as a demand for cryptographic certificates when it usually is not.',
            'Relying on a blog article instead of counsel for high-stakes agreements.',
        ),
        h2('Important disclaimer'),
        p('CubSign provides technology and audit information to support electronic signing. This Help Center article is educational and is not legal advice. Requirements can differ by document type, industry, and country. Wills, certain real-estate filings, and notarized acts may have special rules. Consult qualified counsel for regulated or high-stakes agreements.'),
        note('For deeper background on frameworks, digital vs electronic signatures, and evidence, browse the CubSign Blog, which covers these topics in more detail.'),
        h2('Summary'),
        p('Electronic signatures are broadly recognized under frameworks like ESIGN, UETA, and eIDAS when there is intent, consent, association with the document, and a reliable record. Keep evidence, sign final versions, and check for exceptions. This is educational only, consult counsel when stakes are high. Related reading: Audit Trail and Secure Storage.'),
    ],
    [
        { question: 'Are electronic signatures legally binding?', answer: 'In many jurisdictions they are recognized under frameworks such as ESIGN, UETA, and eIDAS when intent and consent requirements are met. This is educational, not legal advice.' },
        { question: 'What makes an electronic signature effective?', answer: 'Generally: clear intent to sign, consent to electronic records, association of the signature with the document, and a reliable record such as an audit trail.' },
        { question: 'Are there documents I should not e-sign?', answer: 'Some documents, such as wills, certain real-estate filings, and notarized acts, may have special formalities. Check requirements and consult counsel for high-stakes matters.' },
    ],
);

/* ═══════════════════════════ TROUBLESHOOTING ═══════════════════════════ */

// 21 ── troubleshooting-upload-errors
add(
    {
        slug: 'troubleshooting-upload-errors',
        title: 'Troubleshooting Upload Errors',
        excerpt: 'Fix common PDF upload failures, file type, size, network, and browser issues and get back to signing.',
        categorySlug: 'troubleshooting',
        updatedAt: '2026-06-15',
        tags: ['Upload', 'Errors', 'Fix'],
        keywords: ['pdf upload error', 'upload failed cubsign', 'fix upload problem', 'file too large error'],
        metaTitle: 'Troubleshooting PDF Upload Errors | CubSign',
        metaDescription: 'Work through common CubSign upload errors, invalid file type, size limits, network issues, and browser restrictions with clear fixes.',
        related: ['maximum-upload-size', 'supported-file-types', 'browser-compatibility', 'contact-support'],
    },
    [
        p('Most upload issues come from file type, size, network interruptions, or browser restrictions. The good news is that nearly all of them are quick to diagnose and fix. Work through the checks below before contacting support.'),
        p('This guide starts with a fast checklist, then explains the most common error messages and what each one means.'),
        h2('Why it matters'),
        p('An upload error blocks everything, you cannot place fields or sign until the file is accepted. Knowing the handful of common causes lets you resolve the problem in seconds instead of guessing. It also helps you provide the right details if you do need to contact support.'),
        h2('Quick checklist'),
        ul(
            'Confirm the file is a .pdf, not a Word or image file renamed to PDF.',
            'Confirm the file is 25 MB or smaller. See Maximum Upload Size.',
            'Try a different browser or an Incognito/Private window.',
            'Disable VPN or ad blockers temporarily and retry.',
            'Switch from an in-app browser to Safari or Chrome.',
        ),
        h2('Common error messages'),
        ul(
            'File too large, compress or split the PDF.',
            'Invalid file type, export a real PDF from your source app.',
            'Upload failed / network error. Retry on a stable connection.',
            'Cannot open file, the PDF may be password-protected; unlock it first.',
        ),
        tip('If a file uploads fine on one network but fails on another, the problem is almost certainly the connection or a network-level blocker, not the file itself.'),
        h2('Step-by-step: methodical fix'),
        ol(
            'Verify the file opens as a real PDF in a browser tab.',
            'Check the size and compress if it exceeds 25 MB.',
            'Switch to a supported browser and disable blocking extensions.',
            'Retry on a stable, trusted network.',
            'If it still fails, gather details and contact support.',
        ),
        h2('Best practices'),
        ul(
            'Keep source PDFs clean, unlocked, and reasonably sized.',
            'Use a supported, up-to-date browser (see Browser Compatibility).',
            'Upload on Wi-Fi or a strong signal for large files.',
            'Convert other formats to PDF properly rather than renaming them.',
        ),
        h2('Common mistakes'),
        ul(
            'Renaming a .docx to .pdf and expecting it to upload.',
            'Retrying repeatedly on the same weak connection.',
            'Leaving an aggressive ad blocker enabled the whole time.',
            'Uploading a locked PDF without removing the password.',
        ),
        h2('Still stuck?'),
        p('Note the exact error text, browser, device, and approximate file size, then reach us from the Contact page or email support@cubsign.com. That information helps us reproduce and resolve the issue faster. See Contact Support for what to include.'),
        note('A surprising number of "upload" problems are really browser or extension problems. A quick test in a private window rules that out immediately.'),
        h2('Summary'),
        p('Upload errors usually trace back to file type, size, network, or browser. Confirm the file is a real PDF under 25 MB, use a supported browser without blockers, and retry on a stable connection. For specifics, read Supported File Types, Maximum Upload Size, and Browser Compatibility. If it persists, see Contact Support.'),
    ],
    [
        { question: 'Why does CubSign say my file is too large?', answer: 'The upload limit is 25 MB. Compress the PDF, lower scan resolution, or split it, then upload again. See Maximum Upload Size.' },
        { question: 'I get an invalid file type error, what is wrong?', answer: 'The file is likely not a real PDF. Export or Save as PDF from your source app instead of renaming a Word or image file.' },
        { question: 'My upload keeps failing with a network error. What now?', answer: 'Retry on a stable connection, disable VPN or ad blockers, and try a supported browser in a private window. If it persists, contact support with the details.' },
    ],
);

// 22 ── contact-support
add(
    {
        slug: 'contact-support',
        title: 'Contact Support',
        excerpt: 'Reach the CubSign team when you need help beyond the Help Center, and learn what details to include.',
        categorySlug: 'troubleshooting',
        updatedAt: '2026-06-20',
        tags: ['Support', 'Contact'],
        keywords: ['contact cubsign support', 'get help cubsign', 'support email', 'report a problem'],
        metaTitle: 'How to Contact CubSign Support | CubSign',
        metaDescription: 'Learn how to contact CubSign support, what details to include for a fast response, and how to help us reproduce your issue.',
        related: ['troubleshooting-upload-errors', 'email-verification', 'reset-password', 'browser-compatibility'],
    },
    [
        p('If you cannot find an answer in the Help Center, our support team is ready to help with account, upload, and signing questions. Reaching out with the right information is the fastest path to a resolution.'),
        p('This article explains how to contact us, what to include, and what to expect after you send a message.'),
        h2('Why it matters'),
        p('Support can only move as fast as the details you provide. A message that says "it doesn’t work" starts a slow back-and-forth, while a message with the exact error, browser, and steps often gets a same-session answer. Knowing what to send saves everyone time especially you. A well-described report also lets us reproduce the exact situation on our side, which is the difference between a confident fix and a round of guesswork.'),
        h2('How to contact us'),
        ul(
            'Email: support@cubsign.com.',
            'Contact form: use the Contact page on cubsign.com.',
        ),
        h2('Step-by-step: before you reach out'),
        ol(
            'Search the Help Center for your issue. Many answers are already here.',
            'Try the relevant fixes, such as Troubleshooting Upload Errors.',
            'Note the exact error text and what you were doing.',
            'Gather your browser, device, and whether you are signed in or a guest.',
            'Send your message with those details included.',
        ),
        h2('What to include'),
        ul(
            'A short description of what you were trying to do.',
            'Screenshots or the exact error message.',
            'Browser and device (for example, Chrome on Windows, Safari on iPhone).',
            'Whether you are signed in or signing as a guest.',
        ),
        tip('A screenshot of the error, plus the browser and device, resolves the majority of tickets on the first reply. Include them whenever you can.'),
        h2('Best practices'),
        ul(
            'Check the Help Center first. Your fix may already be documented.',
            'Report one issue per message so nothing gets lost.',
            'Reply promptly if we ask for logs or reproduction steps.',
            'Use the email address associated with your account for account issues.',
        ),
        h2('Common mistakes'),
        ul(
            'Sending "it doesn’t work" with no error, browser, or steps.',
            'Omitting whether you are a guest or signed in.',
            'Bundling several unrelated problems into one thread.',
            'Skipping the Help Center articles that already cover the issue.',
        ),
        h2('Response expectations'),
        p('We aim to respond as quickly as possible during Early Access. Complex technical issues may take longer if we need logs or reproduction steps. Clear details up front keep that turnaround as short as possible.'),
        note('For common account issues, self-service is often fastest: see Reset Password, Email Verification, and Troubleshooting Upload Errors before writing in.'),
        h2('Summary'),
        p('Contact CubSign support by email at support@cubsign.com or through the Contact page. Search the Help Center first, then include the exact error, browser, device, and account status for the fastest reply. For common fixes you can handle yourself, see Troubleshooting Upload Errors, Reset Password, and Email Verification.'),
    ],
    [
        { question: 'How do I contact CubSign support?', answer: 'Email support@cubsign.com or use the Contact page. Include the error message, browser, device, and what you were trying to do.' },
        { question: 'What details should I include in a support request?', answer: 'A short description of the problem, screenshots or the exact error, your browser and device, and whether you are signed in or a guest.' },
        { question: 'How fast will I get a response?', answer: 'We respond as quickly as possible during Early Access. Providing clear details up front helps us resolve your issue faster.' },
    ],
);

/* ═══════════════════════════ VALIDATION ═══════════════════════════ */

const EXPECTED_SLUGS = [
    'what-is-cubsign', 'create-your-cubsign-account', 'mobile-support', 'browser-compatibility',
    'how-to-upload-a-pdf', 'supported-file-types', 'maximum-upload-size', 'how-to-sign-a-pdf-online',
    'draw-vs-type-signature', 'upload-your-signature-image', 'download-signed-pdf', 'share-documents',
    'delete-documents', 'email-verification', 'google-login', 'reset-password', 'secure-storage',
    'document-privacy', 'audit-trail', 'electronic-signature-legality', 'troubleshooting-upload-errors',
    'contact-support',
];

const slugs = articles.map((a) => a.slug);
const unique = [...new Set(slugs)];
if (unique.length !== articles.length) {
    console.error('Duplicate slugs:', slugs.filter((s, i) => slugs.indexOf(s) !== i));
    process.exit(1);
}

const missing = EXPECTED_SLUGS.filter((s) => !slugs.includes(s));
const extra = slugs.filter((s) => !EXPECTED_SLUGS.includes(s));
if (missing.length || extra.length) {
    console.error('Slug mismatch. Missing:', missing, 'Extra:', extra);
    process.exit(1);
}
if (articles.length !== 22) {
    console.error(`Expected 22 articles, got ${articles.length}`);
    process.exit(1);
}

// Validate related slugs resolve
for (const a of articles) {
    for (const r of a.related ?? []) {
        if (!slugs.includes(r)) {
            console.error(`Article ${a.slug} references unknown related slug: ${r}`);
            process.exit(1);
        }
    }
    if ((a.related ?? []).length < 3) {
        console.warn(`RELATED WARNING ${a.slug}: fewer than 3 related`);
    }
}

for (const a of articles) {
    console.log(`${a.slug}: ${a.wordCount} words, ${a.readingTime} min, faq ${a.faq.length}`);
}

/* ═══════════════════════════ SERIALIZATION ═══════════════════════════ */

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

// Strip internal wordCount before exporting
const exportArticles = articles.map(({ wordCount, ...rest }) => rest);

const helpFaqs = [
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
        answer: 'Electronic signatures are widely recognized under frameworks such as the US ESIGN Act and EU eIDAS when intent and consent requirements are met. CubSign provides audit-friendly signing records. This is not legal advice. Check local requirements for your document type.',
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

const popularSearches = [
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

const helpersBlock = `
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
export const popularSearches = ${serialize(popularSearches)};

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

/** Articles ordered by category, then title, used for prev/next navigation. */
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

function articleSearchHaystack(article) {
    return [
        article.title,
        article.excerpt,
        article.category,
        ...(article.tags ?? []),
        ...(article.keywords ?? []),
        ...article.content.flatMap((block) => {
            if (block.text) return [block.text];
            if (block.items) return block.items;
            return [];
        }),
        ...(article.faq ?? []).flatMap((f) => [f.question, f.answer]),
    ]
        .join(' ')
        .toLowerCase();
}

export function searchHelpArticles(query) {
    const q = query.trim().toLowerCase();
    if (!q) return helpArticles;

    return helpArticles.filter((article) => articleSearchHaystack(article).includes(q));
}

export function formatHelpDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
`;

const regexCharClass = '[.*+?^${}()|[\\]\\\\]';
const escLine = `    const escaped = destinations.map((d) => d.title.replace(/${regexCharClass}/g, '\\\\$&'));`;

const linkifyBlock = [
    '',
    '/**',
    ' * Split plain text into segments, auto-linking known article titles and key',
    ' * marketing/route destinations (longest titles first). Does not mutate source content.',
    ' *',
    " * Route destinations return { type: 'route', value, routeName }.",
    " * Help articles return { type: 'link', value, slug }.",
    ' */',
    'export function linkifyHelpText(text, currentSlug = null) {',
    "    if (!text) return [{ type: 'text', value: '' }];",
    '',
    '    const destinations = [',
    '        ...helpArticles',
    '            .filter((a) => a.slug !== currentSlug)',
    "            .map((a) => ({ title: a.title, kind: 'help', slug: a.slug })),",
    "        { title: 'Help Center', kind: 'route', routeName: 'help-center' },",
    "        { title: 'Features page', kind: 'route', routeName: 'features' },",
    "        { title: 'Upload PDF page', kind: 'route', routeName: 'sign.index' },",
    "        { title: 'Upload PDF', kind: 'route', routeName: 'sign.index' },",
    "        { title: 'Contact page', kind: 'route', routeName: 'contact' },",
    "        { title: 'CubSign Blog', kind: 'route', routeName: 'blog' },",
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
    "            if (dest.kind === 'route') return { type: 'route', value: part, routeName: dest.routeName };",
    "            return { type: 'link', value: part, slug: dest.slug };",
    '        });',
    '}',
    '',
].join('\n');

const file = `/** Help Center knowledge base, keep slugs in sync with config/help.php. Generated by scripts/generate-help-content.mjs */

export const helpCategories = ${serialize(helpCategories)};

export const helpArticles = ${serialize(exportArticles)};

export const helpFaqs = ${serialize(helpFaqs)};
${helpersBlock}${linkifyBlock}`;

writeFileSync(helpJsPath, file);
console.log('Wrote', helpJsPath);

/* ═══════════════════════════ config/help.php ═══════════════════════════ */

function phpStr(value) {
    return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function phpFaqs(faq) {
    if (!Array.isArray(faq) || faq.length === 0) {
        return '[]';
    }
    const rows = faq
        .filter((item) => item?.question && item?.answer)
        .map(
            (item) => `            [
                'question' => ${phpStr(item.question)},
                'answer' => ${phpStr(item.answer)},
            ]`,
        )
        .join(',\n');
    return `[\n${rows},\n        ]`;
}

const phpArticles = exportArticles
    .map(
        (a) => `        [
            'slug' => ${phpStr(a.slug)},
            'updated_at' => ${phpStr(a.updatedAt)},
            'title' => ${phpStr(a.title)},
            'excerpt' => ${phpStr(a.excerpt)},
            'meta_title' => ${phpStr(a.metaTitle)},
            'meta_description' => ${phpStr(a.metaDescription)},
            'author' => 'CubSign Product & Engineering Team',
            'faq' => ${phpFaqs(a.faq)},
        ],`,
    )
    .join('\n');

const phpFile = `<?php

/**
 * Help Center article metadata for server-side features (sitemap, SEO head, JSON-LD).
 * Keep in sync with resources/js/constants/help.js.
 * Generated by scripts/generate-help-content.mjs
 * Or sync SEO fields only: node scripts/sync-seo-php-from-js.mjs
 */
return [

    'articles' => [
${phpArticles}
    ],

];
`;

writeFileSync(helpPhpPath, phpFile);
console.log('Wrote', helpPhpPath);
