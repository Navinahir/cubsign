/**
 * Per-article visual + CubSign-specific section metadata for blog content generation.
 * Used by scripts/generate-blog-content.mjs
 */

/** @typedef {{ workflow: { alt: string, caption: string }, ui: { alt: string, caption: string }, cubsignHelps: string[], cubsignFeatures: string[], callout: { title: string, text: string, asset: string } }} ArticleAssetMeta */

/** @type {Record<string, ArticleAssetMeta>} */
export const BLOG_ASSET_META = {
    'how-to-sign-a-pdf-online': {
        workflow: {
            alt: 'CubSign workflow diagram showing upload PDF, place signature in editor, and download signed file',
            caption: 'The CubSign self-sign flow: upload your PDF on cubsign.com/sign, place fields in the editor, and download the finished document.',
        },
        ui: {
            alt: 'CubSign upload page with drag-and-drop PDF zone and example Contract.pdf file',
            caption: 'The CubSign upload screen accepts standard PDFs up to 25 MB, with no account required for your first signature.',
        },
        cubsignHelps: [
            'CubSign is built around a three-step self-sign path: open the Upload PDF page, place your signature in the browser editor, and download the signed copy. You never need desktop software or a scanner.',
            'If you create a free CubSign account, the same workflow unlocks document storage, signing history, and the ability to send documents to other people for signature, all from the same editor you use for self-signing.',
            'During Early Access, unlimited signatures and downloads are included at no cost, so you can practice the flow on real documents before sending anything to a client.',
        ],
        cubsignFeatures: [
            'Guest signing; upload and sign without creating an account',
            'Draw, type, or upload your signature in the editor',
            'Date and text fields for standard agreement forms',
            'HTTPS-encrypted upload and download',
            'Mobile-friendly signing in any modern browser',
        ],
        callout: {
            title: 'CubSign UI tip',
            text: 'After uploading, use the page thumbnails in the editor sidebar to jump between signature pages quickly. Zoom in before placing fields on dense contract pages.',
            asset: 'ui',
        },
    },
    'electronic-signature-vs-digital-signature': {
        workflow: {
            alt: 'Diagram comparing electronic signature creation, digital certificate, and audit log in CubSign',
            caption: 'CubSign focuses on practical electronic signatures with an audit trail, distinct from PKI-backed digital certificates used in some enterprise systems.',
        },
        ui: {
            alt: 'CubSign editor comparing electronic signature document and certificate-style document side by side',
            caption: 'Most CubSign users need a clear electronic signature and activity record, not a hardware token or enterprise certificate authority.',
        },
        cubsignHelps: [
            'CubSign produces electronic signatures, your drawn, typed, or uploaded mark applied to a PDF with a timestamped activity record. That is what most freelancers, agencies, and small businesses need day to day.',
            'The CubSign audit trail logs views, signatures, and downloads with timestamps, giving you evidence of who signed and when without requiring specialized digital certificate infrastructure.',
            'When a counterparty asks about “digital signatures,” you can explain that CubSign provides legally recognized electronic signatures with a verifiable history, visit the Security Center for full details on how documents are protected.',
        ],
        cubsignFeatures: [
            'Electronic signatures via draw, type, or image upload',
            'Per-document audit trail with timestamps',
            'Recipient signing links tied to email addresses',
            'HTTPS encryption for all signing sessions',
            'Downloadable signed PDF as the authoritative record',
        ],
        callout: {
            title: 'How CubSign helps',
            text: 'Open any completed document in your workspace to review the full activity timeline, sent, viewed, signed, and downloaded events are listed in order.',
            asset: 'ui',
        },
    },
    'how-secure-are-electronic-signatures': {
        workflow: {
            alt: 'CubSign security workflow: HTTPS upload, encrypted signing session, secure cloud storage',
            caption: 'CubSign protects documents at every stage, encrypted in transit during upload and signing, then stored with access limited to owners and invited recipients.',
        },
        ui: {
            alt: 'CubSign Security Center page showing HTTPS status and document protection overview',
            caption: 'The CubSign Security Center explains HTTPS, encryption in transit, authentication, and responsible disclosure in plain language.',
        },
        cubsignHelps: [
            'Every CubSign session runs over HTTPS, so uploads, signature submissions, and downloads are encrypted between your browser and our servers.',
            'Recipient signing links are unique per person and per document, recipients do not need a CubSign account, but they must use the secure link sent to their email.',
            'Workspace owners can delete documents when they are no longer needed, and activity events are logged so you can demonstrate what happened if a question arises later.',
        ],
        cubsignFeatures: [
            'TLS encryption for all public and signing pages',
            'Per-recipient secure signing invitations',
            'Email verification for workspace accounts',
            'Google sign-in as an alternative to passwords',
            'Document deletion from your workspace',
        ],
        callout: {
            title: 'Security best practice',
            text: 'Before signing a sensitive contract, confirm the browser address bar shows HTTPS on cubsign.com or your trusted CubSign signing link. Avoid signing on shared public computers.',
            asset: 'ui',
        },
    },
    'how-small-businesses-save-time-using-esignatures': {
        workflow: {
            alt: 'CubSign request signature workflow: send email link, client signs without account, automatic completion notification',
            caption: 'Small teams use CubSign to replace print-scan-email cycles with a single send-and-track workflow.',
        },
        ui: {
            alt: 'CubSign editor recipient panel showing pending and signed status for client@email.com',
            caption: 'Track each recipient’s status from the editor. See who has signed and who is still pending without chasing email threads.',
        },
        cubsignHelps: [
            'CubSign lets you upload a PDF once, add recipients by email, place signature fields, and send. Recipients sign through a link without creating an account.',
            'Your workspace dashboard shows document status at a glance: pending, viewed, and signed. That visibility alone saves hours of “just checking if you got my email” follow-ups.',
            'Templates let you save field layouts for agreements you send repeatedly. NDAs, offer letters, and vendor forms, so the next send takes minutes instead of rebuilding from scratch.',
        ],
        cubsignFeatures: [
            'Multi-recipient signature requests by email',
            'Real-time status tracking in the workspace',
            'Reusable templates with saved field positions',
            'Audit trail on every document',
            'Free unlimited sends during Early Access',
        ],
        callout: {
            title: 'Time-saving tip',
            text: 'Save your most-used agreement as a CubSign template. The next time a client is ready to sign, upload the template PDF and only change the recipient email.',
            asset: 'ui',
        },
    },
    'best-practices-for-signing-contracts-online': {
        workflow: {
            alt: 'CubSign contract signing best practice workflow: review all pages, align signature fields, archive in workspace',
            caption: 'Professional contract signing in CubSign starts with reviewing every page before placing fields.',
        },
        ui: {
            alt: 'CubSign PDF editor with signature field aligned to signature line on contract page',
            caption: 'Align signature and date fields with the printed blocks on the contract, zoom in on dense pages before completing.',
        },
        cubsignHelps: [
            'CubSign’s editor lets you scroll through every page before signing, add initials on exhibits, and place date fields next to signature lines, the same discipline you would use on paper.',
            'Name your downloaded file with the counterparty and date (for example, Acme-MSA-2026-07-27-signed.pdf) so your workspace and local folders stay searchable.',
            'When sending for signature, add all required signers upfront in the recipient panel so fields are assigned correctly the first time.',
        ],
        cubsignFeatures: [
            'Multi-page PDF navigation in the editor',
            'Signature, initials, date, and text fields',
            'Recipient assignment per field',
            'Download with a clear filename',
            'Workspace storage for signed agreements',
        ],
        callout: {
            title: 'Field placement tip',
            text: 'Use the editor zoom controls on signature pages with small print. A field that overlaps clause text can create ambiguity during a later review.',
            asset: 'ui',
        },
    },
    'how-to-protect-pdf-documents': {
        workflow: {
            alt: 'CubSign document protection workflow: HTTPS transfer, owner-only access, delete from workspace',
            caption: 'Protect PDFs by using HTTPS signing, limiting access to invited recipients, and removing documents when retention ends.',
        },
        ui: {
            alt: 'CubSign Security Center and workspace document access controls overview',
            caption: 'CubSign combines transport encryption with workspace access controls, only document owners and invited recipients can open signing links.',
        },
        cubsignHelps: [
            'CubSign never requires you to email unsigned PDF drafts back and forth; upload once, send a signing link, and let recipients complete their portion in a controlled session.',
            'Workspace documents are accessible only to your account and the specific recipients you invite. Each signing link is tied to an email address and a single document.',
            'When a retention period ends, delete the document from your CubSign workspace. See the Privacy Policy for details on how deleted files are handled.',
        ],
        cubsignFeatures: [
            'HTTPS for all uploads and downloads',
            'Per-recipient signing URLs',
            'Workspace owner access control',
            'On-demand document deletion',
            'Activity logging for accountability',
        ],
        callout: {
            title: 'Protection reminder',
            text: 'Do not forward CubSign signing links to a different email address than the one you assigned. Create a new recipient in the editor if someone else needs to sign.',
            asset: 'ui',
        },
    },
    'how-to-request-digital-signatures': {
        workflow: {
            alt: 'CubSign request signatures workflow: add recipients by email, place fields per signer, send and track from dashboard',
            caption: 'Requesting signatures in CubSign: add recipients, assign fields, send, and monitor completion from your workspace.',
        },
        ui: {
            alt: 'CubSign editor showing recipient list and Send for signature button',
            caption: 'Add recipients in the editor sidebar, place fields assigned to each signer, then send. CubSign emails a secure link automatically.',
        },
        cubsignHelps: [
            'Switch to request mode in the CubSign editor after uploading your PDF. Add each signer’s name and email, then place signature and date fields assigned to the correct recipient.',
            'Recipients receive an email with a secure link. They sign in the browser without a CubSign account, and you receive a notification when everyone has completed.',
            'The workspace shows each document’s status so you know whether to follow up, viewed but not signed is a very different nudge than never opened.',
        ],
        cubsignFeatures: [
            'Request signatures from unlimited recipients',
            'Per-signer field assignment',
            'Email invitations with secure links',
            'Status tracking: pending, viewed, signed',
            'Completed PDF download when all parties sign',
        ],
        callout: {
            title: 'Sending tip',
            text: 'Double-check recipient emails before sending, a typo means the wrong person receives a signing link. You can add a message in your own email when forwarding the CubSign notification if needed.',
            asset: 'ui',
        },
    },
    'benefits-of-paperless-workflows': {
        workflow: {
            alt: 'CubSign paperless workflow: upload template once, reuse fields, track document status in dashboard',
            caption: 'Paperless signing with CubSign: templates, tracking, and instant delivery replace printing and scanning.',
        },
        ui: {
            alt: 'CubSign templates library showing saved NDA and offer letter templates with reusable fields',
            caption: 'CubSign templates keep signature and date fields in place so recurring documents are ready to send in a few clicks.',
        },
        cubsignHelps: [
            'CubSign eliminates print-sign-scan for everyday agreements. Upload a PDF, sign or send for signature, and store the finished file in your workspace, searchable and accessible from any device.',
            'Templates turn your most common documents into reusable starting points. Field positions, signature slots, and date lines stay exactly where you placed them.',
            'Because everything lives in one workspace, you stop hunting through email attachments for “the signed one” versus “the draft.”',
        ],
        cubsignFeatures: [
            'Browser-based signing with no printer required',
            'Template library for recurring documents',
            'Centralized document workspace',
            'Instant download of signed PDFs',
            'Audit trail replacing paper routing slips',
        ],
        callout: {
            title: 'Paperless starter',
            text: 'Pick one recurring form, an NDA, onboarding packet, or vendor agreement, and build a CubSign template this week. That single template often eliminates more paper than ad-hoc signing.',
            asset: 'ui',
        },
    },
    'how-to-sign-pdfs-on-mobile': {
        workflow: {
            alt: 'CubSign mobile signing workflow: open link in phone browser, draw signature in landscape, submit signed PDF',
            caption: 'Sign on mobile by opening CubSign in your phone browser, rotate to landscape for a cleaner drawn signature.',
        },
        ui: {
            alt: 'CubSign mobile interface on phone showing PDF document and Sign document button',
            caption: 'CubSign runs in mobile browsers without app install. Open cubsign.com/sign or your signing link on any modern phone.',
        },
        cubsignHelps: [
            'CubSign’s editor adapts to mobile screens. Upload from your phone’s file picker or open a recipient signing link from email, the same HTTPS-protected session as desktop.',
            'Rotate to landscape before drawing a signature. The extra canvas width produces a mark that looks professional at normal zoom levels.',
            'If drawing on glass feels awkward, switch to a typed signature in the editor, legibility often matters more than flourish on small screens.',
        ],
        cubsignFeatures: [
            'Full editor in mobile browsers',
            'Touch-friendly signature canvas',
            'Typed signature option for clarity',
            'Recipient links work on iOS and Android',
            'Download signed PDF to your phone',
        ],
        callout: {
            title: 'Mobile tip',
            text: 'Pinch to zoom on dense PDF pages before placing a field. On phones, a signature that looks fine at default zoom may overlap text when the PDF is printed.',
            asset: 'ui',
        },
    },
    'common-mistakes-when-signing-pdfs': {
        workflow: {
            alt: 'CubSign mistake-prevention workflow: verify final PDF not draft, read all pages including initials, download signed copy',
            caption: 'Avoid common PDF signing mistakes by confirming the file version, reading every page, and downloading the completed document.',
        },
        ui: {
            alt: 'CubSign editor warning example showing DRAFT.pdf filename and signature field placement',
            caption: 'Check the filename and remove any “DRAFT” or “v2” labels before signing. CubSign signs exactly the PDF you upload.',
        },
        cubsignHelps: [
            'CubSign signs the exact PDF you upload. If you attach a draft with a watermark, that watermark appears in the signed output, always upload the final agreed version.',
            'The editor’s page navigator helps you catch missed initials on exhibit pages. Scroll the full document before tapping Complete.',
            'After signing, download the finished PDF immediately. Relying only on a browser tab without saving leaves you without a copy if the session closes.',
        ],
        cubsignFeatures: [
            'Page-by-page navigation before complete',
            'Initials fields for multi-page exhibits',
            'Clear download step after signing',
            'Workspace copy when signed while logged in',
            'Audit trail showing completion time',
        ],
        callout: {
            title: 'Mistake to avoid',
            text: 'Never place a signature field over pricing or date text. Use zoom to position the field on the signature line only, overlapping terms can create disputes later.',
            asset: 'ui',
        },
    },
    'are-electronic-signatures-legally-binding': {
        workflow: {
            alt: 'CubSign legal signing workflow: clear intent to sign, identity via email link, audit trail with timestamp',
            caption: 'CubSign supports legally recognized electronic signatures through clear signing intent, identity via email links, and timestamped audit records.',
        },
        ui: {
            alt: 'CubSign audit trail showing document sent, viewed, signed events with timestamps on Binding-Agreement.pdf',
            caption: 'The CubSign audit trail records who signed and when, supporting the integrity of electronically signed agreements.',
        },
        cubsignHelps: [
            'CubSign captures the essential elements courts and businesses expect: a clear action to sign, association of the signature with the document, and a record of when the signing occurred.',
            'Recipient links are sent to specific email addresses, tying each signature to an identifiable party. Combined with timestamps in the audit trail, this supports enforceability in most commercial contexts.',
            'Laws vary by jurisdiction and document type. CubSign provides the technical record, consult qualified counsel for regulated industries or high-stakes transactions.',
        ],
        cubsignFeatures: [
            'Explicit complete/sign actions in the editor',
            'Email-tied recipient invitations',
            'Timestamped audit trail per document',
            'Downloadable signed PDF as evidence',
            'IP and event logging on signing activity',
        ],
        callout: {
            title: 'Record keeping',
            text: 'After all parties sign, download the final PDF and store it in your official system of record. The CubSign workspace copy is convenient, but your contract filing system should have the authoritative version.',
            asset: 'ui',
        },
    },
    'securing-your-documents-with-cubsign': {
        workflow: {
            alt: 'CubSign document security workflow: verify HTTPS on cubsign.com, invite-only recipients, review activity log',
            caption: 'Secure your documents with CubSign by using verified HTTPS connections, invite-only recipients, and regular activity log reviews.',
        },
        ui: {
            alt: 'CubSign Security Center page with HTTPS active indicator and document protection summary',
            caption: 'Visit cubsign.com/security for CubSign’s full security overview. HTTPS, encryption, authentication, and disclosure policy.',
        },
        cubsignHelps: [
            'CubSign is served exclusively over HTTPS. Bookmark cubsign.com/sign and verify the padlock icon before uploading sensitive contracts.',
            'Only add recipients who should see the document. Each person receives their own link. Do not share links in public channels.',
            'Review the activity log on important documents monthly. Unexpected view events before sending can indicate a forwarded link.',
        ],
        cubsignFeatures: [
            'Security Center at /security',
            'HTTPS-only signing sessions',
            'Google OAuth and email verification',
            'Per-document activity history',
            'Responsible disclosure at security@cubsign.com',
        ],
        callout: {
            title: 'Account security',
            text: 'Enable email verification on your CubSign account and use a strong unique password or Google sign-in. Workspace access should be limited to people who handle contracts.',
            asset: 'ui',
        },
    },
    'request-signatures-from-multiple-recipients': {
        workflow: {
            alt: 'CubSign multi-recipient workflow: add two or more signers, assign fields per person, track all statuses',
            caption: 'Request signatures from multiple people in one CubSign document, assign fields per recipient and track everyone’s status.',
        },
        ui: {
            alt: 'CubSign editor with two recipients and color-coded signature field assignments',
            caption: 'Each recipient in CubSign has a color in the editor, assign signature fields to the correct signer before sending.',
        },
        cubsignHelps: [
            'Add every required signer in the CubSign editor before placing fields. Each recipient gets a color code so you can assign signature, initials, and date fields to the right person.',
            'CubSign sends each recipient their own secure link. They sign independently. You do not need to route a single PDF sequentially by email.',
            'The workspace shows per-recipient status. Follow up only with people still marked pending, not the entire group.',
        ],
        cubsignFeatures: [
            'Unlimited recipients per document',
            'Color-coded field assignment',
            'Independent signing order',
            'Per-recipient status in workspace',
            'Single completed PDF when all sign',
        ],
        callout: {
            title: 'Multi-signer tip',
            text: 'For three-party agreements, list all signers first, then place fields in document order (Party A, Party B, Party C). Review the field legend in the sidebar before sending.',
            asset: 'ui',
        },
    },
    'mobile-pdf-signing-tips': {
        workflow: {
            alt: 'CubSign mobile tips workflow: rotate to landscape, pinch zoom on dense pages, type signature when needed',
            caption: 'Mobile PDF signing tips in CubSign: landscape for drawing, zoom for detail, typed signature when clarity matters.',
        },
        ui: {
            alt: 'CubSign phone interface with rotate for drawing callout and sign document button',
            caption: 'CubSign on mobile, rotate your phone, zoom into signature blocks, and use typed signatures when drawing is unclear.',
        },
        cubsignHelps: [
            'CubSign’s mobile editor supports the same field types as desktop. Open your signing link on cellular data or Wi‑Fi, both use HTTPS encryption.',
            'Enable screen rotation lock off temporarily while drawing. A steady landscape canvas beats a cramped portrait scribble every time.',
            'For field reports and dense tables, pinch-zoom before signing. You are confirming specific rows, make sure you can read them.',
        ],
        cubsignFeatures: [
            'Responsive editor layout',
            'Touch-optimized signature pad',
            'Typed signature fallback',
            'Mobile recipient links',
            'Download to device files app',
        ],
        callout: {
            title: 'On-the-go signing',
            text: 'If you receive a CubSign link while away from your desk, you can complete it on your phone and download the signed PDF to forward from your mobile email app.',
            asset: 'ui',
        },
    },
    'introducing-cubsign-early-access': {
        workflow: {
            alt: 'CubSign Early Access workflow: sign free, send unlimited signature requests, share product feedback',
            caption: 'CubSign Early Access: free unlimited signing, signature requests, and a direct line to shape the product.',
        },
        ui: {
            alt: 'CubSign upload page welcoming Early Access users with free Upload PDF button',
            caption: 'Early Access users get full CubSign features at $0: upload, sign, send, and store documents while we refine the platform.',
        },
        cubsignHelps: [
            'CubSign Early Access gives you unlimited self-signing, signature requests, recipients, and downloads at no charge while we collect feedback and harden the platform.',
            'Create a free account to unlock workspace storage, templates, and document history. Guest signing still works for quick one-off PDFs.',
            'We read every message from the Contact page and support@cubsign.com. Early Access is your chance to influence what we build next.',
        ],
        cubsignFeatures: [
            '$0 during Early Access',
            'No credit card required',
            'Unlimited signatures and documents',
            'Templates and audit trail included',
            'Google sign-in supported',
        ],
        callout: {
            title: 'Get started',
            text: 'Open the Upload PDF page and sign your first document in under a minute. Then create a free account to save it and try sending a signature request to a colleague.',
            asset: 'ui',
        },
    },
    'what-is-an-audit-trail': {
        workflow: {
            alt: 'CubSign audit trail workflow: document sent, recipient viewed, signed, and downloaded with timestamps',
            caption: 'A CubSign audit trail logs each document event, sent, viewed, signed, downloaded with timestamps and participant details.',
        },
        ui: {
            alt: 'CubSign document activity log showing sent, viewed, signed, and downloaded events with timestamps',
            caption: 'View the full activity timeline on any document in your CubSign workspace.',
        },
        cubsignHelps: [
            'Every CubSign document records key events automatically. You do not configure logging. It is part of every send and sign flow.',
            'When a client asks “did they sign yet?”, open the document in your workspace instead of searching email. The audit trail shows viewed and signed timestamps.',
            'For compliance conversations, export the signed PDF and reference the activity history. Together they demonstrate who acted and when.',
        ],
        cubsignFeatures: [
            'Automatic event logging',
            'Timestamps on every action',
            'Signer name and email captured',
            'View history in document details',
            'Supports contract dispute resolution',
        ],
        callout: {
            title: 'Audit tip',
            text: 'After a deal closes, screenshot or note the final audit trail status in your CRM record. The signed PDF plus activity log is your complete evidence package.',
            asset: 'ui',
        },
    },
    'how-to-create-a-reusable-signature': {
        workflow: {
            alt: 'CubSign reusable signature workflow: draw once in editor, save style, apply quickly on next document',
            caption: 'Create a signature once in CubSign and reuse it across documents, draw, type, or upload your preferred style.',
        },
        ui: {
            alt: 'CubSign signature panel showing Draw and Type options with signature canvas',
            caption: 'The CubSign signature panel lets you draw on canvas, type your name, or upload an image, reuse your choice on the next document.',
        },
        cubsignHelps: [
            'In the CubSign editor, open the signature panel and create your mark once, draw, type, or upload. Your session remembers it for subsequent fields on the same document.',
            'With a CubSign account, your signing workflow stays consistent across sessions. Use the same typed signature for formal documents and drawn for informal ones.',
            'Save a PNG of your signature locally if you prefer the upload option. CubSign accepts standard image formats in the signature panel.',
        ],
        cubsignFeatures: [
            'Draw signature on canvas',
            'Type with handwriting-style font',
            'Upload signature image',
            'Apply to multiple fields per document',
            'Consistent marks across workspace sessions',
        ],
        callout: {
            title: 'Signature consistency',
            text: 'For brand-facing documents, typed signatures often look cleaner than trackpad drawings. Try both in CubSign on the same PDF and compare at 100% zoom before sending.',
            asset: 'ui',
        },
    },
    'draw-vs-type-your-signature': {
        workflow: {
            alt: 'CubSign draw versus type signature workflow comparing draw canvas, typed name, and upload image options',
            caption: 'CubSign supports draw, type, and upload. Choose based on document formality and the device you are using.',
        },
        ui: {
            alt: 'CubSign editor side-by-side Draw and Type signature panels',
            caption: 'Compare draw and type signatures in the CubSign editor before completing the document.',
        },
        cubsignHelps: [
            'CubSign does not force one signature style. Draw for a personal touch on informal agreements; type when legibility at small sizes matters; upload when you already have a scanned signature on file.',
            'On desktop with a mouse, drawing can look shaky. Typed signatures often read better on contracts that will be archived for years.',
            'Recipients signing via CubSign links get the same three options. Choose what produces the clearest mark on your device.',
        ],
        cubsignFeatures: [
            'Draw, type, and upload in one panel',
            'Switch methods before completing',
            'Mobile-optimized canvas',
            'Preview at document zoom level',
            'Same options for recipients',
        ],
        callout: {
            title: 'Choosing a style',
            text: 'For multi-page contracts, use one consistent method throughout. Mixing a drawn signature on page 1 and typed on page 5 can look unprofessional in a legal review.',
            asset: 'ui',
        },
    },
    'nda-signing-guide-for-startups': {
        workflow: {
            alt: 'CubSign NDA signing workflow for startups: send mutual NDA, founder signs, store securely in workspace',
            caption: 'Startups use CubSign to send NDAs, collect founder and counterparty signatures, and store executed copies in the workspace.',
        },
        ui: {
            alt: 'CubSign request signature interface with Mutual-NDA.pdf and recipient email fields',
            caption: 'Send a mutual NDA through CubSign, add both parties as recipients and track who has signed.',
        },
        cubsignHelps: [
            'Upload your standard mutual NDA to CubSign, add both parties as recipients, and place signature fields on the signature blocks. Send before sharing sensitive pitch materials.',
            'Save the NDA as a template once fields are positioned. Every new investor or partner conversation starts from the same layout.',
            'Store executed NDAs in your CubSign workspace with clear filenames (Investor-NDA-Acme-2026.pdf) so due diligence later is painless.',
        ],
        cubsignFeatures: [
            'Multi-party NDA signing',
            'Template for recurring NDAs',
            'Secure workspace storage',
            'Audit trail for investor records',
            'Free during Early Access',
        ],
        callout: {
            title: 'Startup checklist',
            text: 'Before sharing your deck, confirm the NDA is fully signed by all parties in CubSign, not just sent. Check workspace status shows Signed for every recipient.',
            asset: 'ui',
        },
    },
    'freelancer-contract-signing-checklist': {
        workflow: {
            alt: 'CubSign freelancer contract workflow: finalize scope PDF, client signs via email link, freelancer countersigns and downloads',
            caption: 'Freelancers use CubSign to send SOWs and contracts, collect client signatures, and retain signed copies for every engagement.',
        },
        ui: {
            alt: 'CubSign editor checklist view with Client-SOW.pdf and client signature request pending',
            caption: 'Track client signature status on statements of work directly from your CubSign workspace.',
        },
        cubsignHelps: [
            'Freelancers use CubSign to send statements of work and service agreements without printing. Clients sign from email links; you countersign and download the executed PDF.',
            'Build a template for your standard contract with signature and date fields pre-placed. New clients mean a new recipient email, not rebuilding the PDF layout.',
            'Keep every signed SOW in your workspace folder structure or download to your project archive, either way, you have proof of scope agreement before work begins.',
        ],
        cubsignFeatures: [
            'Client signing without an account',
            'Countersign after client completes',
            'Template for standard freelancer SOW',
            'Status tracking per engagement',
            'Download for project files',
        ],
        callout: {
            title: 'Freelancer tip',
            text: 'Do not start billable work until CubSign shows Signed for the client on your SOW. The audit trail timestamp is your alignment evidence if scope is questioned later.',
            asset: 'ui',
        },
    },
};

export function assetMetaFor(slug) {
    return BLOG_ASSET_META[slug] ?? BLOG_ASSET_META['how-to-sign-a-pdf-online'];
}
