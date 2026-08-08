/** Phase 11 content patches keyed by article slug. */

export const patches = {
    'what-is-cubsign': {
        excerpt:
            'CubSign is a browser-based PDF signing tool: upload a PDF, place fields, sign yourself or send for signature, and download the finished file.',
        metaDescription:
            'Learn what CubSign does today: PDF-only uploads, guest self-sign, draw/type/upload signatures, workspace storage, templates, and send-for-signature links.',
        faq: [
            {
                question: 'Is CubSign free to use?',
                answer: 'Yes. CubSign is free during Early Access. You can upload, sign, and send PDFs without a credit card.',
            },
            {
                question: 'Do I need to install anything?',
                answer: 'No. CubSign runs in a modern web browser on desktop and mobile. There is no app or plugin to install.',
            },
            {
                question: 'Can I sign without an account?',
                answer: 'Yes, for one guest self-sign session. After that, create a free account to keep signing, store documents, use templates, and send PDFs to others.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'CubSign is a web app for signing PDF documents. You upload a PDF (up to 25 MB), place fields on the pages, sign the document yourself or send it to others, and download the completed PDF. Everything runs in your browser — no desktop software or browser plugin required.',
            },
            {
                type: 'p',
                text: 'If you normally print a form, sign it, scan it, and email a blurry copy back, CubSign replaces that loop with one file and one workflow. Start from the Upload PDF page with a low-risk document if you want to try it immediately.',
            },
            {
                type: 'h2',
                text: 'What CubSign supports today',
            },
            {
                type: 'ul',
                items: [
                    'PDF documents only, maximum 25 MB per upload.',
                    'Field types: signature, initials, name, text, date, and checkbox.',
                    'Signature input: draw on a canvas, type your name, or upload a PNG/JPG image.',
                    'Self-sign as a guest for one session, then a free account for continued use.',
                    'With an account: document storage, templates, and send-for-signature via email links.',
                    'Recipients sign at a unique link (/r/{token}) without creating a CubSign account.',
                ],
            },
            {
                type: 'h2',
                text: 'Typical workflows',
            },
            {
                type: 'ol',
                items: [
                    'Self-sign: upload → place fields → sign → download.',
                    'Send for signature: upload → add recipients and fields → send → track completion → download.',
                    'Reuse a template: save field layout once, start new documents from it in your workspace.',
                ],
            },
            {
                type: 'h2',
                text: 'Who it fits',
            },
            {
                type: 'p',
                text: 'Freelancers closing client agreements, small teams collecting signatures from vendors or partners, and anyone who wants a faster alternative to print-and-scan. CubSign focuses on straightforward PDF signing rather than enterprise contract lifecycle management.',
            },
            {
                type: 'tip',
                text: 'New here? Read How to Sign a PDF Online for the full click path, then Create Your CubSign Account if you will sign more than once or need to send documents to others.',
            },
            {
                type: 'note',
                text: 'CubSign is free during Early Access while we improve the product. No credit card is required. See the Features page for a concise list of what is available now.',
            },
            {
                type: 'p',
                text: 'For legal context around electronic signatures, read Electronic Signature Legality — it is educational, not legal advice. For security details, see Secure Storage and Document Privacy in this Help Center, or visit the Security page on cubsign.com.',
            },
        ],
    },

    'create-your-cubsign-account': {
        excerpt:
            'Create a free CubSign account to store documents, use templates, and send PDFs for signature after your one guest self-sign session.',
        metaDescription:
            'Register with email or Google to unlock CubSign workspace storage, templates, send-for-signature, and email verification for full access.',
        faq: [
            {
                question: 'Does creating an account cost anything?',
                answer: 'No. Registration is free during Early Access, and no credit card is required.',
            },
            {
                question: 'Can I register with Google?',
                answer: 'Yes. Choose Continue with Google to sign in without a separate CubSign password. See the Google Login article.',
            },
            {
                question: 'What if I already signed as a guest?',
                answer: 'Guest sessions are not tied to an account and are limited to one self-sign flow. Create an account to continue signing and to save documents in your workspace.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'You can complete one self-sign session as a guest without registering. A free account is required afterward if you want to keep signing, and it unlocks the features most people need beyond a single one-off signature.',
            },
            {
                type: 'h2',
                text: 'What an account adds',
            },
            {
                type: 'ul',
                items: [
                    'Document storage and status in your workspace.',
                    'Templates to reuse field layouts on new PDFs.',
                    'Send-for-signature: email unique signing links to recipients.',
                    'Activity history on documents you own (see Audit Trail).',
                    'Continued signing after the guest limit.',
                ],
            },
            {
                type: 'p',
                text: 'CubSign does not maintain a persistent signature library across documents. During a signing session, your drawn, typed, or uploaded signature can be reused on multiple fields in that same document — but it is not saved as a standalone asset for every future PDF.',
            },
            {
                type: 'h2',
                text: 'Registration steps',
            },
            {
                type: 'ol',
                items: [
                    'Click Get Started Free or Register on cubsign.com.',
                    'Choose email and password, or Continue with Google.',
                    'Complete the form and submit.',
                    'Verify your email if prompted (required for full workspace access). See Email Verification.',
                    'Open your workspace Overview to upload or manage documents.',
                ],
            },
            {
                type: 'tip',
                text: 'Use a work email for business documents so notifications and executed files stay with the role, not a personal inbox you might leave behind.',
            },
            {
                type: 'h2',
                text: 'Early Access pricing',
            },
            {
                type: 'p',
                text: 'During Early Access, account registration, signing, storage, templates, and send-for-signature are free. No credit card is required.',
            },
            {
                type: 'h2',
                text: 'Avoid duplicate accounts',
            },
            {
                type: 'p',
                text: 'Pick one login method and stick with it. Registering with email and later signing in with Google using a different address creates separate workspaces. If you need to link methods on the same email, contact support before switching.',
            },
            {
                type: 'note',
                text: 'Passwords are stored hashed. Google Login delegates authentication to Google — CubSign receives basic profile details, not Gmail or Drive access. See Google Login and Secure Storage for more.',
            },
        ],
    },

    'mobile-support': {
        excerpt:
            'Sign PDFs on phones and tablets in Safari or Chrome — no app install, with practical tips for touch signing and uploads.',
        lastReviewed: '2026-08-08',
        faq: [
            {
                question: 'Do I need an app to sign on mobile?',
                answer: 'No. Open cubsign.com in Safari (iOS) or Chrome (Android). CubSign is a web app, not a native app.',
            },
            {
                question: 'Why does signing fail inside my email app?',
                answer: 'In-app browsers often block uploads or downloads. Tap Open in Safari or Open in Chrome and retry.',
            },
            {
                question: 'Draw or type on a phone?',
                answer: 'Both work. Landscape helps when drawing; typed signatures are often cleaner on small screens.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'CubSign works on phones and tablets through your mobile browser. Upload a PDF (up to 25 MB), place fields with pinch-to-zoom, sign with draw/type/upload, and download the result — the same core flow as desktop.',
            },
            {
                type: 'h2',
                text: 'Recommended browsers',
            },
            {
                type: 'ul',
                items: [
                    'iOS: Safari (latest).',
                    'Android: Chrome (latest).',
                    'Avoid signing inside email or social in-app browsers when possible.',
                ],
            },
            {
                type: 'h2',
                text: 'Signing on a small screen',
            },
            {
                type: 'ol',
                items: [
                    'Open the Upload PDF page in your full browser.',
                    'Upload from Files, Photos, or a cloud drive.',
                    'Zoom in before placing signature, initials, date, or text fields.',
                    'Rotate to landscape when drawing a signature.',
                    'Finish and download immediately — especially important for guest sessions.',
                ],
            },
            {
                type: 'h2',
                text: 'Recipient links on mobile',
            },
            {
                type: 'p',
                text: 'When someone sends you a document, the email link opens the recipient signing page at /r/{token}. Recipients do not need a CubSign account. If the page misbehaves, open the link in Safari or Chrome instead of the mail app’s built-in browser.',
            },
            {
                type: 'tip',
                text: 'On a shaky connection, wait for the upload progress to finish before placing fields. Large scans near the 25 MB limit need a stable Wi‑Fi or strong cellular signal.',
            },
            {
                type: 'note',
                text: 'For browser-specific fixes, see Browser Compatibility. For upload failures, see Troubleshooting Upload Errors.',
            },
        ],
    },

    'browser-compatibility': {
        lastReviewed: '2026-08-08',
        content: [
            {
                type: 'p',
                text: 'CubSign targets modern browsers with support for file upload, HTML canvas (for drawn signatures), and PDF rendering. If the editor looks blank or uploads stall, your browser is the first thing to check.',
            },
            {
                type: 'h2',
                text: 'Supported browsers',
            },
            {
                type: 'ul',
                items: [
                    'Google Chrome — latest two major versions.',
                    'Mozilla Firefox — latest two major versions.',
                    'Microsoft Edge — latest two major versions.',
                    'Apple Safari — latest two major versions (macOS and iOS).',
                ],
            },
            {
                type: 'h2',
                text: 'Not supported',
            },
            {
                type: 'ul',
                items: [
                    'Internet Explorer.',
                    'Very outdated browser versions.',
                    'Some in-app browsers inside email or social apps (limited file access).',
                ],
            },
            {
                type: 'h2',
                text: 'Fix a broken editor',
            },
            {
                type: 'ol',
                items: [
                    'Hard-refresh the page or open a private/incognito window.',
                    'Update the browser to the latest version.',
                    'Temporarily disable extensions that block scripts, ads, or trackers.',
                    'Clear cached assets for cubsign.com.',
                    'Try another supported browser on the same device.',
                ],
            },
            {
                type: 'tip',
                text: 'Corporate laptops sometimes block scripts by policy. If nothing works on a work machine, try a personal device or ask IT to allow cubsign.com.',
            },
            {
                type: 'p',
                text: 'Upload-specific errors may be file type or size (PDF only, 25 MB max) rather than browser issues. See Troubleshooting Upload Errors before contacting support.',
            },
        ],
    },

    'how-to-upload-a-pdf': {
        excerpt:
            'Upload a PDF up to 25 MB from desktop or mobile and open the CubSign signing editor.',
        faq: [
            {
                question: 'How do I upload a PDF?',
                answer: 'Open the Upload PDF page, drag your file onto the drop zone or click to browse, and wait for the editor to open.',
            },
            {
                question: 'Can I upload from my phone?',
                answer: 'Yes. Tap the upload area and pick a PDF from Files, Photos, or cloud storage. Use a stable connection for larger files.',
            },
            {
                question: 'What if upload keeps failing?',
                answer: 'Confirm the file is a real PDF under 25 MB and not password-protected. See Troubleshooting Upload Errors.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'CubSign accepts standard PDF files up to 25 MB. Upload is the entry point to the signing editor — where you place fields, sign, send to recipients, or download.',
            },
            {
                type: 'h2',
                text: 'Upload from desktop',
            },
            {
                type: 'ol',
                items: [
                    'Go to the Upload PDF page (Sign PDF in the navigation).',
                    'Drag a .pdf onto the drop zone, or click to browse.',
                    'Wait for the upload to finish — the editor opens automatically.',
                ],
            },
            {
                type: 'h2',
                text: 'Upload from mobile',
            },
            {
                type: 'p',
                text: 'Tap the upload area and select a PDF from your device or cloud drive. Use Safari on iOS or Chrome on Android for the fewest surprises. See Mobile Support if the file picker or download step fails.',
            },
            {
                type: 'h2',
                text: 'After upload',
            },
            {
                type: 'p',
                text: 'The PDF is stored for your signing session. Signed-in users also get a workspace copy they can return to later. You can add signature, initials, name, text, date, and checkbox fields, then self-sign or configure recipients and send.',
            },
            {
                type: 'h2',
                text: 'Before you upload — quick checks',
            },
            {
                type: 'ul',
                items: [
                    'File extension is .pdf and it opens correctly in a PDF viewer.',
                    'Size is 25 MB or less (see Maximum Upload Size).',
                    'Password protection is removed.',
                    'You are uploading the final version, not a draft with watermarks.',
                ],
            },
            {
                type: 'tip',
                text: 'Text-based PDFs render faster and produce cleaner signed output than heavy color scans. Compress large scans before uploading.',
            },
            {
                type: 'note',
                text: 'Word, Excel, and image files are not accepted as documents. Export to PDF first — see Supported File Types.',
            },
        ],
    },

    'supported-file-types': {
        excerpt: 'CubSign accepts PDF documents only. Convert Word, Excel, or images to PDF before uploading.',
        faq: [
            {
                question: 'What file types can I upload?',
                answer: 'PDF (.pdf) only, up to 25 MB. Convert other formats before uploading.',
            },
            {
                question: 'Can I upload Word?',
                answer: 'Not directly. Use Save as PDF or Export to PDF in Word, then upload the result.',
            },
            {
                question: 'Can I upload an image as the document?',
                answer: 'No for the main document. You can upload PNG or JPG when creating a signature image — see Upload Your Signature Image.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'CubSign is built around PDF because the format preserves layout across devices — important when you are about to sign. The upload endpoint accepts .pdf files only.',
            },
            {
                type: 'h2',
                text: 'Accepted',
            },
            {
                type: 'ul',
                items: ['PDF (.pdf) — maximum 25 MB per file.'],
            },
            {
                type: 'h2',
                text: 'Not accepted as the document',
            },
            {
                type: 'ul',
                items: [
                    'Microsoft Word (.doc, .docx), Excel, PowerPoint.',
                    'Standalone JPG, PNG, or TIFF used as the main file.',
                    'Password-protected or encrypted PDFs CubSign cannot parse.',
                    'Executables, archives, or files renamed to .pdf without proper export.',
                ],
            },
            {
                type: 'h2',
                text: 'Convert to PDF',
            },
            {
                type: 'ol',
                items: [
                    'Open the source file in its native app (Word, Google Docs, LibreOffice, etc.).',
                    'Choose File → Save as PDF or Export to PDF.',
                    'Open the exported file in a viewer to confirm pages and layout.',
                    'Upload from the Upload PDF page.',
                ],
            },
            {
                type: 'h2',
                text: 'Signature images are separate',
            },
            {
                type: 'p',
                text: 'When signing, you can upload a PNG or JPG as your signature mark inside the editor. That is different from uploading an image file as the document itself.',
            },
            {
                type: 'tip',
                text: 'Renaming contract.docx to contract.pdf does not convert it. The upload will fail or the editor cannot render it. Always export properly.',
            },
            {
                type: 'note',
                text: 'Convert sensitive files on a machine you trust. Prefer local Save as PDF over unknown online converters when confidentiality matters.',
            },
        ],
    },

    'maximum-upload-size': {
        excerpt: 'CubSign accepts PDF uploads up to 25 MB. Here is how to shrink files that exceed the limit.',
        faq: [
            {
                question: 'What is the maximum upload size?',
                answer: '25 MB per PDF. Most contracts and forms are much smaller.',
            },
            {
                question: 'How do I reduce file size?',
                answer: 'Compress the PDF, lower scan DPI (150–200 is usually enough), remove oversized embedded images, or split into separate files when the workflow allows.',
            },
            {
                question: 'Upload failed but the file is small?',
                answer: 'Network drops, VPNs, browser extensions, or password-protected PDFs can cause failures unrelated to size. See Troubleshooting Upload Errors.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'The 25 MB limit keeps uploads reliable on mobile networks and prevents oversized scans from slowing the signing editor. Typical text contracts are well under 1 MB; problems usually come from high-resolution color scans or embedded photos.',
            },
            {
                type: 'h2',
                text: 'Why files grow large',
            },
            {
                type: 'ul',
                items: [
                    '600 DPI color scans of multi-page documents.',
                    'Full-resolution photos embedded in the PDF.',
                    'Scanned packets where every page is a bitmap instead of text.',
                ],
            },
            {
                type: 'h2',
                text: 'Shrink a PDF',
            },
            {
                type: 'ol',
                items: [
                    'Re-scan at 150–200 DPI, black and white when color is not needed.',
                    'Run a trusted desktop compressor or re-export from the source app at lower image quality.',
                    'Remove pages you do not need to sign.',
                    'Split a large packet into separate PDFs if your process allows multiple files.',
                    'Re-upload from the Upload PDF page.',
                ],
            },
            {
                type: 'tip',
                text: 'After compressing, open the PDF and confirm signature lines and fine print are still readable before you place fields.',
            },
            {
                type: 'p',
                text: 'A failure on a 5 MB file is often a network or browser issue, not the size cap. Retry on stable Wi‑Fi, try a private window, or switch browsers before assuming the file is too large.',
            },
        ],
    },

    'how-to-sign-a-pdf-online': {
        excerpt:
            'Upload a PDF, place fields, create your signature, and download the signed file — or send it to others for signature.',
        faq: [
            {
                question: 'Do I need an account?',
                answer: 'No for your first guest self-sign session. A free account is required to continue signing afterward and to send documents to others.',
            },
            {
                question: 'How long does signing take?',
                answer: 'A simple one-signature PDF often takes under a minute once you are familiar with the editor.',
            },
            {
                question: 'Can I sign on my phone?',
                answer: 'Yes. See Mobile Support for touch and browser tips.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'CubSign signs PDFs in the browser: upload, place fields, apply your signature, review, and download. No printing or scanning required.',
            },
            {
                type: 'h2',
                text: 'Step-by-step: self-sign',
            },
            {
                type: 'ol',
                items: [
                    'Upload a PDF (max 25 MB) from the Upload PDF page.',
                    'Select a field type: signature, initials, name, text, date, or checkbox.',
                    'Click on the page to place each field where it belongs.',
                    'Create your signature — draw, type, or upload an image.',
                    'Fill every required field, finish the flow, and download the signed PDF.',
                ],
            },
            {
                type: 'h2',
                text: 'Three signature methods',
            },
            {
                type: 'ul',
                items: [
                    'Draw — handwriting on a canvas (mouse, trackpad, or finger).',
                    'Type — your name rendered in a handwriting-style font.',
                    'Upload — place an existing PNG or JPG signature image.',
                ],
            },
            {
                type: 'p',
                text: 'Within one signing session, the signature you create can be applied to multiple fields on the same document. CubSign does not store a cross-document signature library.',
            },
            {
                type: 'h2',
                text: 'Guest vs account',
            },
            {
                type: 'p',
                text: 'Guests can complete one self-sign session without registering. Create a free account to sign again, save documents, use templates, and send PDFs to recipients via email links. Recipients sign at /r/{token} without an account.',
            },
            {
                type: 'tip',
                text: 'Scroll every page before finishing. A signature records agreement to the text as shown — it does not fix typos you missed.',
            },
            {
                type: 'note',
                text: 'To collect signatures from others, see Share Documents. For legal background (not advice), see Electronic Signature Legality.',
            },
        ],
    },

    'draw-vs-type-signature': {
        content: [
            {
                type: 'p',
                text: 'CubSign offers draw and type (plus upload image) when you fill a signature or initials field. Both are valid electronic signatures when you intend to sign — the choice is about appearance and device, not legality.',
            },
            {
                type: 'h2',
                text: 'Draw',
            },
            {
                type: 'p',
                text: 'Use a mouse, trackpad, or finger on the canvas. Closest to pen-on-paper. Works well on tablets; on phones, rotate to landscape for more room.',
            },
            {
                type: 'h2',
                text: 'Type',
            },
            {
                type: 'p',
                text: 'Enter your name and pick a font. Fast, legible at small sizes, and often the best option on desktop without a stylus or on cramped phone screens.',
            },
            {
                type: 'h2',
                text: 'When to pick which',
            },
            {
                type: 'ul',
                items: [
                    'Draw: you want a handwritten look and have enough space to write cleanly.',
                    'Type: speed and readability matter more than freehand appearance.',
                    'Upload: you already have an approved signature image file.',
                ],
            },
            {
                type: 'tip',
                text: 'Preview the signature at the actual field size before applying. A large canvas scribble can look unreadable when shrunk onto a signature line.',
            },
            {
                type: 'p',
                text: 'During the session, CubSign remembers your signature for reuse on other fields in the same document. Starting a new document means creating or uploading the mark again. See Upload Your Signature Image for the upload path.',
            },
            {
                type: 'note',
                text: 'Neither method is inherently “more legal” than the other. See Electronic Signature Legality for general framework information — not legal advice.',
            },
        ],
    },

    'upload-your-signature-image': {
        faq: [
            {
                question: 'What format works best?',
                answer: 'PNG with a transparent background is ideal. A high-contrast, tightly cropped JPG also works.',
            },
            {
                question: 'Why does my signature look boxed in?',
                answer: 'The image likely has a solid background. Use transparency or crop tightly around the ink.',
            },
            {
                question: 'Is my image saved forever in CubSign?',
                answer: 'It is used in your current signing session. CubSign does not offer a persistent signature library across all future documents.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'If you already have a scanned or designed signature, upload it in the signing editor instead of drawing or typing. The image is placed on signature or initials fields like any other mark.',
            },
            {
                type: 'h2',
                text: 'Upload steps',
            },
            {
                type: 'ol',
                items: [
                    'Open a document in the signing editor.',
                    'Select a signature or initials field, or create your mark from the signature panel.',
                    'Choose Upload and pick a PNG or JPG.',
                    'Apply it to fields and resize as needed.',
                ],
            },
            {
                type: 'h2',
                text: 'Image quality tips',
            },
            {
                type: 'ul',
                items: [
                    'High contrast ink on white or transparent background.',
                    'Crop close to the signature — extra margins make it appear tiny in the field.',
                    'Avoid blurry phone photos with shadows.',
                    'Prefer PNG when you need transparency over the PDF page.',
                ],
            },
            {
                type: 'h2',
                text: 'Session reuse only',
            },
            {
                type: 'p',
                text: 'Once uploaded, the image can be reused on multiple fields during that signing session. It is not stored as a permanent personal signature vault for every future PDF. Each new document workflow starts fresh unless you upload the file again.',
            },
            {
                type: 'note',
                text: 'Treat signature image files like sensitive assets. Do not share your CubSign login — someone with account access could send documents on your behalf.',
            },
        ],
    },

    'download-signed-pdf': {
        faq: [
            {
                question: 'How do I download after signing?',
                answer: 'Complete all fields, finish the flow, and click Download on the completion screen.',
            },
            {
                question: 'Can I download later?',
                answer: 'Signed-in users can download again from Documents in the workspace. Guests must download during the session — there is no saved copy afterward.',
            },
            {
                question: 'What is in the file?',
                answer: 'The PDF with applied signatures and field values from the session. Activity events are tracked separately in your workspace — see Audit Trail.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'When signing completes, CubSign generates a PDF with your signatures and field values embedded. Download is how you keep the portable record.',
            },
            {
                type: 'h2',
                text: 'Download right after signing',
            },
            {
                type: 'ol',
                items: [
                    'Complete every assigned signature, initials, and form field.',
                    'Finish the signing flow.',
                    'Click Download on the completion screen.',
                    'Open the file locally to confirm all pages and marks look correct.',
                ],
            },
            {
                type: 'h2',
                text: 'Download from workspace',
            },
            {
                type: 'p',
                text: 'If you are signed in, open Documents, select the file, and download again anytime — useful when a colleague needs a copy months later.',
            },
            {
                type: 'h2',
                text: 'Guest sessions',
            },
            {
                type: 'p',
                text: 'Guest self-sign does not save the document to an account. Download before closing the tab — there is no second chance from a workspace.',
            },
            {
                type: 'h2',
                text: 'Multi-recipient documents',
            },
            {
                type: 'p',
                text: 'When you send for signature, the final merged PDF is available after all recipients sign and PDF generation succeeds. If generation fails, the document stays incomplete and a signed_pdf_failed event appears in activity — contact support if that happens.',
            },
            {
                type: 'tip',
                text: 'Name downloads predictably: counterpart, document type, date — e.g. Acme-NDA-2026-08-08.pdf.',
            },
        ],
    },

    'share-documents': {
        excerpt:
            'Send a PDF for signature by email. Recipients sign at a unique /r/{token} link without a CubSign account.',
        faq: [
            {
                question: 'Do recipients need an account?',
                answer: 'No. They open the email link, review the PDF, and sign at /r/{token}.',
            },
            {
                question: 'How do I track progress?',
                answer: 'Check document status and activity in your workspace. You receive notifications as recipients complete their fields.',
            },
            {
                question: 'Multiple signers?',
                answer: 'Add a field for each person, assign fields to the correct recipient email, and send once.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'Send-for-signature requires a CubSign account. You upload a PDF, place fields, add recipient emails, and CubSign sends each person a unique signing link.',
            },
            {
                type: 'h2',
                text: 'Send workflow',
            },
            {
                type: 'ol',
                items: [
                    'Upload a PDF and open the editor (account required).',
                    'Switch to request-signatures mode and add recipients by email.',
                    'Place signature, initials, name, text, date, or checkbox fields.',
                    'Assign each field to the correct recipient.',
                    'Send — recipients receive email with a link to /r/{token}.',
                    'Monitor activity until document_completed, then download the PDF.',
                ],
            },
            {
                type: 'h2',
                text: 'What recipients see',
            },
            {
                type: 'p',
                text: 'Recipients open the link, review the PDF in the browser, complete their assigned fields using draw, type, or upload, and submit. No CubSign registration step.',
            },
            {
                type: 'h2',
                text: 'Activity you can track',
            },
            {
                type: 'p',
                text: 'Your workspace records events such as recipient_notified, recipient_signed, document_completed, and signed_pdf_failed if PDF generation fails. CubSign does not log “document viewed” events in this activity timeline.',
            },
            {
                type: 'tip',
                text: 'Double-check recipient emails before sending. A typo sends the contract to the wrong inbox with no way to unsend.',
            },
            {
                type: 'note',
                text: 'For privacy expectations when sharing, read Document Privacy. For what each activity event means, see Audit Trail.',
            },
        ],
    },

    'delete-documents': {
        lastReviewed: '2026-08-08',
        content: [
            {
                type: 'p',
                text: 'Signed-in users can remove documents from the workspace when they are no longer needed. Deletion is intentional — treat it as permanent for the CubSign copy.',
            },
            {
                type: 'h2',
                text: 'Delete or archive',
            },
            {
                type: 'ol',
                items: [
                    'Open Documents in your workspace.',
                    'Select the file and open its actions menu.',
                    'Choose Delete, or Archive to hide it from active lists without the same urgency.',
                    'Confirm when prompted.',
                ],
            },
            {
                type: 'h2',
                text: 'Before you delete',
            },
            {
                type: 'ul',
                items: [
                    'Download the signed PDF if you need a local copy — see Download Signed PDF.',
                    'Confirm no recipient still needs an open signing link.',
                    'Verify you picked the correct file among similarly named documents.',
                ],
            },
            {
                type: 'p',
                text: 'Deleting removes the document from your CubSign workspace. Copies you already downloaded, forwarded by email, or filed elsewhere are unaffected. Pending recipients may lose access to signing links once the document is removed.',
            },
            {
                type: 'note',
                text: 'For retention and privacy policy details, see Document Privacy and the Privacy Policy on cubsign.com.',
            },
        ],
    },

    'email-verification': {
        lastReviewed: '2026-08-08',
        content: [
            {
                type: 'p',
                text: 'Email verification confirms you control the address on your CubSign account. It is required before full workspace access — uploading to your library, templates, and send-for-signature.',
            },
            {
                type: 'h2',
                text: 'Verify your address',
            },
            {
                type: 'ol',
                items: [
                    'Register with email and password.',
                    'Open the verification email from CubSign.',
                    'Click the link to confirm.',
                    'Return to CubSign and continue to your workspace.',
                ],
            },
            {
                type: 'h2',
                text: 'Email not arriving?',
            },
            {
                type: 'ul',
                items: [
                    'Check spam, junk, and promotions folders.',
                    'Confirm the address you typed at registration.',
                    'Request a new verification email from the in-app prompt.',
                    'Allowlist mail from cubsign.com — corporate filters often block new senders.',
                ],
            },
            {
                type: 'p',
                text: 'Google Login users typically skip separate CubSign verification because Google already authenticated the email. See Google Login.',
            },
            {
                type: 'note',
                text: 'Do not forward verification links. They prove inbox control. If you receive verification mail for an account you did not create, ignore the link and contact support.',
            },
        ],
    },

    'google-login': {
        lastReviewed: '2026-08-08',
        content: [
            {
                type: 'p',
                text: 'Continue with Google to register or sign in without a separate CubSign password. Authentication is handled by Google; CubSign receives basic profile information needed for your account.',
            },
            {
                type: 'h2',
                text: 'Sign in with Google',
            },
            {
                type: 'ol',
                items: [
                    'Open Login or Register on cubsign.com.',
                    'Click Continue with Google.',
                    'Pick the Google account and approve access.',
                    'CubSign opens your workspace.',
                ],
            },
            {
                type: 'h2',
                text: 'What CubSign receives',
            },
            {
                type: 'p',
                text: 'Name and email for account identity — not Gmail content, Drive files, or contacts. This is sign-in only.',
            },
            {
                type: 'h2',
                text: 'One account, one method',
            },
            {
                type: 'p',
                text: 'Using the same email for password registration and Google Login on different occasions can create duplicate workspaces. Contact support before linking if you already registered with a password and want to switch.',
            },
            {
                type: 'tip',
                text: 'Secure your Google account with two-factor authentication. CubSign access follows Google session security.',
            },
        ],
    },

    'reset-password': {
        lastReviewed: '2026-08-08',
        content: [
            {
                type: 'p',
                text: 'Email-and-password accounts can reset via a time-limited link sent to the registered address. CubSign stores passwords hashed — we cannot read your current password.',
            },
            {
                type: 'h2',
                text: 'Reset steps',
            },
            {
                type: 'ol',
                items: [
                    'On Login, click Forgot password.',
                    'Enter the email on your CubSign account.',
                    'Open the reset email and click the link promptly — links expire.',
                    'Set a new unique password and sign in.',
                ],
            },
            {
                type: 'h2',
                text: 'Google Login users',
            },
            {
                type: 'p',
                text: 'No CubSign password exists for pure Google Login accounts. Use Continue with Google instead of the reset flow.',
            },
            {
                type: 'h2',
                text: 'Security notes',
            },
            {
                type: 'ul',
                items: [
                    'Reset emails should arrive only after you request one.',
                    'Use the official cubsign.com link — not third-party lookalikes.',
                    'Never share a reset link; anyone with it can change your password.',
                ],
            },
            {
                type: 'note',
                text: 'If reset mail never arrives, check spam and confirm the account email. See Email Verification and Contact Support.',
            },
        ],
    },

    'secure-storage': {
        keywords: [
            'cubsign secure storage',
            'pdf storage security',
            'https document signing',
            'data security',
        ],
        excerpt:
            'How CubSign protects PDFs in transit with HTTPS and limits access to stored files — without overstating encryption claims.',
        metaDescription:
            'CubSign uses HTTPS for uploads and signing, stores PDFs on private infrastructure with access controls, and hashes passwords. Learn what we do and do not claim.',
        faq: [
            {
                question: 'Is my PDF encrypted in transit?',
                answer: 'Yes. Connections to CubSign use HTTPS (TLS), including uploads, signing sessions, and downloads.',
            },
            {
                question: 'Does CubSign use AES-256 encryption at rest?',
                answer: 'We do not claim AES-256 or bank-level encryption at rest. PDFs are stored on private server storage with access controls limited to authorized account holders and valid signing links.',
            },
            {
                question: 'What can I do on my side?',
                answer: 'Use a strong unique password or Google Login, verify recipient emails, avoid shared public computers, and delete documents you no longer need.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'Security in CubSign spans the connection, stored files, and who can open them. This article describes what the product actually does today — without marketing claims we cannot substantiate.',
            },
            {
                type: 'h2',
                text: 'HTTPS in transit',
            },
            {
                type: 'p',
                text: 'All traffic between your browser and CubSign uses HTTPS with modern TLS. That protects PDF uploads, signing actions, workspace pages, and recipient sessions at /r/{token} from casual network interception.',
            },
            {
                type: 'h2',
                text: 'Storage and access controls',
            },
            {
                type: 'p',
                text: 'Uploaded PDFs are stored on private server infrastructure — not in public buckets. Access is restricted to the document owner (when signed in) and recipients who hold valid signing links for that workflow. CubSign does not describe stored files as “AES-256 encrypted at rest” or “bank-level” secured.',
            },
            {
                type: 'h2',
                text: 'Account security',
            },
            {
                type: 'ul',
                items: [
                    'Passwords are hashed — not stored in plain text.',
                    'Google OAuth is available as an alternative to password login.',
                    'Email verification is required for full workspace access.',
                    'You can delete documents from your workspace when finished.',
                ],
            },
            {
                type: 'h2',
                text: 'Signing links',
            },
            {
                type: 'p',
                text: 'Each recipient receives a unique tokenized link. Links are scoped to a specific document and recipient — not open public URLs. Still, treat links like credentials: send only to intended signers.',
            },
            {
                type: 'h2',
                text: 'Your responsibilities',
            },
            {
                type: 'ul',
                items: [
                    'Protect your login — password manager or Google 2FA.',
                    'Download signed PDFs to access-controlled storage you manage.',
                    'Verify recipient email addresses before sending contracts.',
                    'Sign out on shared devices after use.',
                ],
            },
            {
                type: 'note',
                text: 'For broader security documentation, visit the Security page on cubsign.com. For privacy and who can see files, read Document Privacy.',
            },
        ],
    },

    'document-privacy': {
        faq: [
            {
                question: 'Are documents public?',
                answer: 'No. Documents are private by default — not listed in search engines. Only you and invited recipients with valid links can access them.',
            },
            {
                question: 'Can CubSign staff read my PDFs?',
                answer: 'Staff access is limited to legitimate support needs you initiate. We do not sell document contents or use them for advertising.',
            },
            {
                question: 'How do I reduce exposure?',
                answer: 'Share narrowly, verify emails, download what you need, and delete finished documents from your workspace.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'Documents you upload are private by default. CubSign does not publish them or index them for public search. Access flows through your account or recipient signing links.',
            },
            {
                type: 'h2',
                text: 'Who can access a file',
            },
            {
                type: 'ul',
                items: [
                    'You, when authenticated in your workspace.',
                    'Recipients you invite — via unique /r/{token} links tied to their email.',
                    'Guest upload sessions you start yourself, for that session only.',
                ],
            },
            {
                type: 'h2',
                text: 'Staff access',
            },
            {
                type: 'p',
                text: 'CubSign staff may access account or document metadata when investigating a support issue you report. Routine browsing of customer PDFs is not part of the product model. See the Privacy Policy on cubsign.com for retention details.',
            },
            {
                type: 'h2',
                text: 'Controls you have',
            },
            {
                type: 'ul',
                items: [
                    'Send only to people who must sign — see Share Documents.',
                    'Delete or archive documents when a matter closes — see Delete Documents.',
                    'Keep your login credentials private.',
                    'Download executed PDFs to systems your organization controls.',
                ],
            },
            {
                type: 'p',
                text: 'HTTPS protects data in transit. Stored files rely on private infrastructure and access controls — see Secure Storage for an honest description of what we claim (and do not claim) about at-rest protection.',
            },
            {
                type: 'note',
                text: 'The workspace activity timeline records signing events (sent, notified, signed, completed) — not casual page views. See Audit Trail.',
            },
        ],
    },

    'audit-trail': {
        excerpt:
            'CubSign logs signing events in your workspace — sent, notified, signed, completed, and generation failures — not page views or IP addresses in the UI.',
        metaDescription:
            'See which DocumentActivity events CubSign records: recipient_notified, recipient_signed, document_completed, signed_pdf_failed — and where to find them.',
        faq: [
            {
                question: 'What events does CubSign record?',
                answer: 'Events include document creation, send preparation, recipient_notified, recipient_signed, document_completed, and signed_pdf_failed when PDF generation fails. View/open events are not logged in this timeline.',
            },
            {
                question: 'Where do I see activity?',
                answer: 'Open a document in your workspace to view its activity timeline. Keep downloaded signed PDFs for long-term records.',
            },
            {
                question: 'Does the audit trail show IP addresses?',
                answer: 'The workspace activity UI shows event types, recipient names, and timestamps — not IP addresses. Internal session data may exist for operations, but it is not presented as a user-facing audit field.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'CubSign maintains a DocumentActivity timeline on documents in your workspace. It answers “what happened during this signing workflow?” — not “every time someone opened a page.”',
            },
            {
                type: 'h2',
                text: 'Events you will see',
            },
            {
                type: 'ul',
                items: [
                    'Document created — when the file enters your workspace.',
                    'Sent / requests prepared — when a send-for-signature workflow is initiated.',
                    'recipient_notified — recipient was emailed a signing link (logged after successful send).',
                    'recipient_signed — a recipient completed their assigned fields.',
                    'document_completed — all signatures collected and the merged signed PDF generated successfully.',
                    'signed_pdf_failed — PDF generation failed; the document is not marked completed.',
                ],
            },
            {
                type: 'h2',
                text: 'What is not in this timeline',
            },
            {
                type: 'ul',
                items: [
                    '“Document viewed” or per-page open events.',
                    'IP addresses displayed to document owners.',
                    'A guarantee of legal enforceability — see Electronic Signature Legality.',
                ],
            },
            {
                type: 'h2',
                text: 'Why keep activity and the PDF together',
            },
            {
                type: 'p',
                text: 'The signed PDF is the primary artifact. The activity timeline adds context — who was notified, who signed, when completion happened. For disputes or internal reviews, store both the downloaded PDF and a note of the completion date.',
            },
            {
                type: 'tip',
                text: 'If you see signed_pdf_failed, the document may still show partial signatures but no final merged file. Retry or contact support with the document name and time of the error.',
            },
            {
                type: 'note',
                text: 'Activity supports accountability but does not replace legal advice or jurisdiction-specific requirements.',
            },
        ],
    },

    'electronic-signature-legality': {
        excerpt:
            'General background on ESIGN, UETA, and eIDAS — plus honest limits on what CubSign guarantees.',
        metaDescription:
            'Educational overview of electronic signature frameworks. CubSign provides signing tools and activity records — not legal advice or outcome guarantees.',
        faq: [
            {
                question: 'Are electronic signatures legally binding?',
                answer: 'Often yes under frameworks like ESIGN, UETA, and eIDAS when intent and consent requirements are met — but outcomes depend on document type and jurisdiction. This is not legal advice.',
            },
            {
                question: 'What does CubSign provide?',
                answer: 'A browser signing workflow, applied signatures on PDFs, and workspace activity events. It does not provide qualified certificates or legal determinations.',
            },
            {
                question: 'Documents that may need special handling?',
                answer: 'Wills, some real-estate transfers, notarized instruments, and regulated industries may require wet ink, witnesses, or specific platforms. Consult counsel.',
            },
        ],
        content: [
            {
                type: 'p',
                text: 'Electronic signatures are widely used for commercial PDFs — NDAs, offer letters, vendor agreements, and similar. CubSign is a tool for creating and collecting those signatures, not a law firm or compliance certifier.',
            },
            {
                type: 'h2',
                text: 'Common frameworks (high level)',
            },
            {
                type: 'ul',
                items: [
                    'United States: ESIGN Act (federal) and UETA (state adoption).',
                    'European Union: eIDAS — tiers from simple to qualified electronic signatures.',
                    'Other countries: local e-signature laws vary.',
                ],
            },
            {
                type: 'h2',
                text: 'Themes courts and regulators often look for',
            },
            {
                type: 'ol',
                items: [
                    'Intent — the signer meant to sign this document.',
                    'Consent — parties agreed to conduct business electronically when required.',
                    'Association — the signature links to the specific record signed.',
                    'Integrity — a reliable process and record (PDF plus activity timeline).',
                ],
            },
            {
                type: 'h2',
                text: 'What CubSign does not guarantee',
            },
            {
                type: 'ul',
                items: [
                    'That every document you sign is legally enforceable in your jurisdiction.',
                    'That draw, type, or upload methods differ in legal weight — intent matters more than appearance.',
                    'Qualified or advanced electronic signature status under eIDAS.',
                    'Replacement for lawyers on high-stakes or regulated transactions.',
                ],
            },
            {
                type: 'h2',
                text: 'Practical habits',
            },
            {
                type: 'ul',
                items: [
                    'Sign the final PDF version everyone agreed to.',
                    'Keep the downloaded signed file and note completion date.',
                    'Use send-for-signature so each party signs the same document instance.',
                    'Escalate unusual document types to qualified counsel.',
                ],
            },
            {
                type: 'note',
                text: 'This Help Center article is educational only — not legal advice. Read Audit Trail for what CubSign records, and Secure Storage for how files are handled.',
            },
        ],
    },

    'troubleshooting-upload-errors': {
        content: [
            {
                type: 'p',
                text: 'Upload failures almost always trace to file format, size, network, or browser environment. Walk through the checks below before contacting support.',
            },
            {
                type: 'h2',
                text: '60-second checklist',
            },
            {
                type: 'ul',
                items: [
                    'Real PDF? Open it in a viewer — renaming .docx to .pdf fails.',
                    'Under 25 MB? Compress scans if not.',
                    'Unlocked? Remove password protection.',
                    'Supported browser? Chrome, Firefox, Edge, or Safari — latest version.',
                    'Private window? Rules out many extension conflicts.',
                    'Stable network? Retry off VPN or weak cellular.',
                ],
            },
            {
                type: 'h2',
                text: 'Error → likely cause',
            },
            {
                type: 'ul',
                items: [
                    'File too large — compress, re-scan at lower DPI, or split pages.',
                    'Invalid file type — export a proper PDF from the source application.',
                    'Network error / upload failed — connection drop or corporate proxy; retry elsewhere.',
                    'Cannot open PDF — often password-protected or corrupted; re-export from source.',
                ],
            },
            {
                type: 'h2',
                text: 'Mobile-specific',
            },
            {
                type: 'p',
                text: 'If upload works on desktop but not phone, open cubsign.com in full Safari or Chrome — not the in-app browser from email. See Mobile Support.',
            },
            {
                type: 'h2',
                text: 'Still failing?',
            },
            {
                type: 'p',
                text: 'Note the exact error text, browser, device, file size, and whether the PDF opens locally. Email support@cubsign.com or use the Contact page. See Contact Support for the full list of useful details.',
            },
        ],
    },

    'contact-support': {
        content: [
            {
                type: 'p',
                text: 'When Help Center articles do not solve your issue, reach CubSign support with enough detail to reproduce the problem — especially for upload, signing, or account access bugs.',
            },
            {
                type: 'h2',
                text: 'Contact channels',
            },
            {
                type: 'ul',
                items: [
                    'Email: support@cubsign.com',
                    'Web: Contact page on cubsign.com',
                ],
            },
            {
                type: 'h2',
                text: 'Include in your message',
            },
            {
                type: 'ul',
                items: [
                    'Account email (if signed in) or note that you are a guest.',
                    'What you were doing — upload, self-sign, recipient sign, download, send.',
                    'Exact error message or screenshot (redact sensitive contract text).',
                    'Browser and device — e.g. Chrome 128 on Windows 11, Safari on iPhone 15.',
                    'PDF size and whether it opens locally.',
                    'Approximate date and time of the issue.',
                ],
            },
            {
                type: 'h2',
                text: 'Try self-service first',
            },
            {
                type: 'p',
                text: 'Upload problems: Troubleshooting Upload Errors and Maximum Upload Size. Account access: Reset Password and Email Verification. Browser glitches: Browser Compatibility.',
            },
            {
                type: 'tip',
                text: 'One issue per email thread keeps resolution faster than combining unrelated questions.',
            },
            {
                type: 'note',
                text: 'CubSign is in Early Access — we respond as quickly as we can. Clear reports help us fix product issues that affect other users too.',
            },
        ],
    },
};

export const helpFaqsPatch = [
    {
        question: 'Is CubSign free to use?',
        answer: 'Yes. CubSign is free during Early Access. No credit card is required to upload, sign, or send PDFs for signature.',
    },
    {
        question: 'Do I need an account to sign a PDF?',
        answer: 'You can complete one guest self-sign session without an account. After that, create a free account to continue signing and to unlock storage, templates, and send-for-signature.',
    },
    {
        question: 'What file types does CubSign support?',
        answer: 'PDF files only, up to 25 MB per upload. Export Word, Excel, or images to PDF before uploading.',
    },
    {
        question: 'Are electronic signatures legally binding?',
        answer: 'They are often recognized under ESIGN, UETA, and eIDAS when requirements are met — but outcomes vary by document and jurisdiction. CubSign provides tools and activity records, not legal advice.',
    },
    {
        question: 'How do I reset my password?',
        answer: 'On Login, choose Forgot password, enter your email, and follow the reset link. Google Login users should use Continue with Google instead.',
    },
    {
        question: 'Can recipients sign without an account?',
        answer: 'Yes. Recipients open the email link and sign at /r/{token} without registering.',
    },
    {
        question: 'How do I contact support?',
        answer: 'Email support@cubsign.com or use the Contact page. Include the error message, browser, device, and steps you took.',
    },
    {
        question: 'Is my document private?',
        answer: 'Documents are private by default. Only you and invited recipients with valid links can access them. You can delete documents from your workspace.',
    },
];
