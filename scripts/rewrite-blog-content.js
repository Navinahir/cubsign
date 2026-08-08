/**
 * One-time blog content cleanup for AdSense first-party usefulness.
 * Run: node scripts/rewrite-blog-content.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_PATH = path.join(__dirname, "../resources/js/constants/blog.js");

const AUTHOR_BLOCK = `author: {
            name: "CubSign Product & Engineering Team",
            role: "Product & Engineering",
            initials: "PE",
            avatarBg: "bg-blue-600",
            bio: "We build CubSign—the browser PDF signing tool at cubsign.com. These guides describe the product as we ship it. Learn more at /about.",
        }`;

const OLD_AUTHOR = `author: {
            name: "CubSign Team",
            role: "Product & Content",
            initials: "CT",
            avatarBg: "bg-blue-600",
            bio: "The CubSign Team writes practical guides on PDF signing, electronic signatures, document security, and paperless workflows for freelancers, small businesses, and growing teams.",
        }`;

const GLOBAL_AUTHOR = `export const blogAuthor = {
    name: "CubSign Product & Engineering Team",
    role: "Product & Engineering",
    initials: "PE",
    avatarBg: "bg-blue-600",
    bio: "We build CubSign—the browser PDF signing tool at cubsign.com. These guides describe the product as we ship it. Learn more at /about.",
};`;

const PRIORITY_SLUGS = new Set([
    "how-to-sign-a-pdf-online",
    "how-to-request-digital-signatures",
    "request-signatures-from-multiple-recipients",
    "introducing-cubsign-early-access",
    "what-is-an-audit-trail",
    "draw-vs-type-your-signature",
    "how-to-sign-pdfs-on-mobile",
    "securing-your-documents-with-cubsign",
    "how-to-create-a-reusable-signature",
]);

function contentBlock(type, props) {
    return { type, ...props };
}

// --- Priority post content (CubSign-specific, honest claims) ---

const priorityContent = {
    "how-to-sign-a-pdf-online": [
        contentBlock("p", { text: "CubSign lets you sign a PDF entirely in your browser: upload a file up to 25 MB, place fields in the editor, add your signature, and download the finished document. No printer, scanner, or desktop app required. Guest users get one self-sign session; a free account adds storage, templates, and the ability to send documents to other signers." }),
        contentBlock("p", { text: "This guide walks through the exact CubSign flow on cubsign.com/sign—from upload through field placement to download—so you can complete a real agreement in minutes." }),
        contentBlock("figure", { slug: "how-to-sign-a-pdf-online", asset: "workflow", alt: "CubSign workflow: upload PDF, place fields in editor, download signed file", caption: "CubSign self-sign: upload at cubsign.com/sign, place signature and other fields, download the signed PDF.", variant: "diagram" }),
        contentBlock("h2", { text: "Before you upload" }),
        contentBlock("p", { text: "CubSign accepts standard PDF files up to 25 MB. Export Word or Google Docs files to PDF first, and remove any open password—the editor cannot edit locked files. If you only need to sign once without an account, guest mode works for a single self-sign session." }),
        contentBlock("note", { text: "Need to collect signatures from others or save documents in your workspace? Create a free CubSign account. Guest signing is limited to one self-sign session." }),
        contentBlock("h2", { text: "Step-by-step in the CubSign editor" }),
        contentBlock("ol", { items: [
            "Open cubsign.com/sign and upload your PDF (drag-and-drop or file picker).",
            "In the editor, add fields where needed: signature, initials, name, text, date, or checkbox.",
            "Click a signature field and create your mark—draw on the canvas, type your name, or upload a PNG/JPG image for this document.",
            "Resize and drag fields so they align with printed signature lines; use page thumbnails for multi-page files.",
            "Review every page at zoom before finishing—confirm names, dates, and amounts are correct.",
            "Complete signing and download the signed PDF to your device. Logged-in users also see the file in their workspace.",
        ]}),
        contentBlock("figure", { slug: "how-to-sign-a-pdf-online", asset: "ui", alt: "CubSign upload page with drag-and-drop zone", caption: "The upload screen accepts PDFs up to 25 MB. No account is required for guest self-signing.", variant: "screenshot" }),
        contentBlock("h2", { text: "Field types CubSign supports" }),
        contentBlock("p", { text: "The editor is not signature-only. Place the field types your form actually needs:" }),
        contentBlock("ul", { items: [
            "Signature — your drawn, typed, or uploaded mark",
            "Initials — for exhibit or acknowledgment pages",
            "Name — printed full name separate from the signature graphic",
            "Text — freeform answers (title, address, reference number)",
            "Date — signing date aligned to a date line",
            "Checkbox — acknowledgments or optional clauses",
        ]}),
        contentBlock("h2", { text: "Draw, type, or upload your signature" }),
        contentBlock("p", { text: "When you click a signature field, CubSign opens the signature panel with three options. Draw for a handwritten look (use landscape on mobile for more canvas width). Type when legibility matters on small fields. Upload when you already have a signature image file on your device. Your choice applies to fields in the current signing session; CubSign does not store a persistent reusable signature across documents." }),
        contentBlock("callout", { slug: "how-to-sign-a-pdf-online", title: "Editor tip", text: "Use the sidebar page thumbnails to jump between signature pages. Zoom in on dense contract pages before placing fields so nothing overlaps clause text.", asset: "ui", alt: "CubSign upload page with drag-and-drop PDF zone", variant: "screenshot" }),
        contentBlock("h2", { text: "Guest vs account" }),
        contentBlock("ul", { items: [
            "Guest — one self-sign session: upload, sign, download. No workspace storage.",
            "Account — document storage, signing history, templates, and sending signature requests to multiple recipients.",
        ]}),
        contentBlock("h2", { text: "Common mistakes" }),
        contentBlock("ul", { items: [
            "Uploading a password-protected or non-PDF file.",
            "Placing a signature over price or date text.",
            "Skipping initials on appendix pages.",
            "Forgetting to download before closing the browser tab.",
            "Using an illegible scribble when typed text would read clearly.",
        ]}),
        contentBlock("tip", { text: "On mobile, rotate to landscape before drawing. If the result looks shaky, switch to a typed signature—it stays crisp at small sizes." }),
        contentBlock("h2", { text: "Security" }),
        contentBlock("p", { text: "CubSign serves all signing pages over HTTPS, so uploads and downloads are encrypted in transit. Stored documents in your workspace are kept in private storage with access limited to your account and invited recipients—not as open attachments. Protect your account with a strong password and verify you are on cubsign.com before uploading sensitive contracts." }),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "Signing a PDF in CubSign: upload (≤25 MB), place fields, draw/type/upload your signature for that session, review, download. Create an account when you need storage, templates, or multi-recipient requests." }),
        contentBlock("p", { text: "Next: How to Request Digital Signatures for sending to others, or How to Sign PDFs on Mobile for phone-specific tips." }),
    ],

    "how-to-request-digital-signatures": [
        contentBlock("p", { text: "After you sign a PDF yourself, the next CubSign workflow is requesting signatures from someone else. With a free account, upload a PDF, add recipient emails, assign fields per signer, and send. Recipients complete signing from a secure link in their browser—no CubSign account required on their side." }),
        contentBlock("p", { text: "This guide covers the sender flow in CubSign: preparing the PDF, adding recipients, placing fields, sending, and tracking completion from your workspace." }),
        contentBlock("figure", { slug: "how-to-request-digital-signatures", asset: "workflow", alt: "CubSign request flow: add recipients, assign fields, send, track status", caption: "Request signatures: add recipients in the editor, assign fields, send, monitor status in your workspace.", variant: "diagram" }),
        contentBlock("h2", { text: "What you need" }),
        contentBlock("p", { text: "Signature requests require a CubSign account (guest mode is self-sign only). Have a final PDF ready—up to 25 MB, not password-protected—with clear signature blocks for each party." }),
        contentBlock("note", { text: "Recipients sign via email link. They do not need to create a CubSign account to complete their fields." }),
        contentBlock("h2", { text: "Send a signature request" }),
        contentBlock("ol", { items: [
            "Log in and upload the final PDF at cubsign.com/sign.",
            "Switch to request mode and add each recipient name and email.",
            "Place fields (signature, initials, name, text, date, checkbox) and assign each field to the correct recipient.",
            "Set signing order if one party must sign before another.",
            "Add a short message explaining the document and any deadline.",
            "Send. CubSign emails each recipient a secure signing link.",
            "Track status in your workspace and follow up only with pending signers.",
            "Download the completed PDF when all required signatures are in.",
        ]}),
        contentBlock("figure", { slug: "how-to-request-digital-signatures", asset: "ui", alt: "CubSign editor with recipient list and send button", caption: "Add recipients in the sidebar, assign color-coded fields, then send for signature.", variant: "screenshot" }),
        contentBlock("h2", { text: "What recipients see" }),
        contentBlock("p", { text: "Each recipient gets an email with a link to the document. They open it in a browser, see only their assigned fields, and create a signature by drawing, typing, or uploading an image for that session. When they finish, you receive notification and the workspace status updates." }),
        contentBlock("h2", { text: "Tracking completion" }),
        contentBlock("p", { text: "Your workspace shows document status and per-recipient progress. Activity events include when invitations were sent, when a recipient signed, and when the document completed—not a detailed view log. Use status to send targeted reminders instead of emailing everyone." }),
        contentBlock("callout", { slug: "how-to-request-digital-signatures", title: "Before you send", text: "Double-check recipient emails. A typo sends a confidential contract to the wrong inbox. Send yourself a test request first on new document types.", asset: "ui", alt: "CubSign editor showing recipient list" }),
        contentBlock("h2", { text: "Best practices" }),
        contentBlock("ul", { items: [
            "Use the final PDF version—avoid resending after last-minute edits.",
            "Map every signature block to a named recipient before sending.",
            "Write a clear subject and note so recipients know what they are signing.",
            "Archive the completed PDF as soon as the last signature lands.",
        ]}),
        contentBlock("h2", { text: "Security" }),
        contentBlock("p", { text: "Requests travel over HTTPS. Each recipient gets their own link; access is limited to invited emails. Verify addresses before sending. Encourage signers to open links only from expected senders on cubsign.com." }),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "CubSign signature requests: account required, upload PDF, add recipients, assign fields, send, track invitations and signatures in workspace, download when complete. For three or more signers, see Request Signatures from Multiple Recipients." }),
    ],

    "request-signatures-from-multiple-recipients": [
        contentBlock("p", { text: "Partnership agreements, board consents, and multi-tenant leases often need several people on one PDF. CubSign handles this in a single document: add every recipient, assign fields by person, optionally set signing order, and track each signer from your workspace." }),
        contentBlock("p", { text: "This guide focuses on CubSign multi-recipient requests—how field assignment, signing order, and status tracking work when more than one person must sign the same file." }),
        contentBlock("figure", { slug: "request-signatures-from-multiple-recipients", asset: "workflow", alt: "CubSign multi-recipient workflow with color-coded field assignment", caption: "Add multiple recipients, assign fields per person, track all statuses in one workspace document.", variant: "diagram" }),
        contentBlock("h2", { text: "Plan signers before opening the editor" }),
        contentBlock("p", { text: "List every required signer and role (Party A, Party B, witness, etc.) before upload. One PDF, one CubSign document—avoid sending separate copies and merging signatures manually." }),
        contentBlock("note", { text: "Multi-recipient requests require a CubSign account. Each recipient signs from their email link without creating an account." }),
        contentBlock("h2", { text: "Set up a multi-party request" }),
        contentBlock("ol", { items: [
            "Upload the final PDF (≤25 MB).",
            "Add all recipient names and emails in the editor.",
            "Place signature, initials, date, and other fields on the correct lines.",
            "Assign each field to the right recipient—CubSign color-codes signers in the sidebar.",
            "Enable signing order if signatures must happen in sequence.",
            "Send with a note naming all parties and any deadline.",
            "Monitor workspace status; nudge only pending recipients.",
            "Download one completed PDF when every required signature is captured.",
        ]}),
        contentBlock("figure", { slug: "request-signatures-from-multiple-recipients", asset: "ui", alt: "CubSign editor with two recipients and color-coded fields", caption: "Each recipient has a color in the editor—assign every field to the correct signer before sending.", variant: "screenshot" }),
        contentBlock("h2", { text: "Sequential vs parallel signing" }),
        contentBlock("p", { text: "Parallel: all recipients receive the invitation at once—fastest when order does not matter. Sequential: CubSign invites the next signer only after the previous one completes—use when one signature must precede another (e.g., employee then manager)." }),
        contentBlock("h2", { text: "Field types per signer" }),
        contentBlock("p", { text: "Assign not just signature fields. A single signer may need initials on exhibits, a date field, and a name field. Match CubSign field types to what each role must complete." }),
        contentBlock("callout", { slug: "request-signatures-from-multiple-recipients", title: "Multi-signer tip", text: "For three-party deals, place fields in document order (Party A, B, C) and verify the sidebar legend before sending.", asset: "ui", alt: "CubSign multi-recipient editor" }),
        contentBlock("h2", { text: "Activity and completion" }),
        contentBlock("p", { text: "CubSign records invitation sent, recipient signed, and document completed events with timestamps. Use these to see who still needs to sign—not separate view or IP logs in the user-facing trail." }),
        contentBlock("h2", { text: "Common mistakes" }),
        contentBlock("ul", { items: [
            "Missing a required signer in the recipient list.",
            "Assigning a field to the wrong person.",
            "Sending before the PDF is final.",
            "Reminding everyone instead of checking pending status first.",
        ]}),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "Multi-recipient signing in CubSign: one PDF, all recipients added upfront, fields assigned per person, optional signing order, one completed download. Start with How to Request Digital Signatures if single-recipient requests are new to you." }),
    ],

    "introducing-cubsign-early-access": [
        contentBlock("p", { text: "CubSign is in Early Access: a browser-based PDF signing tool built by our team at cubsign.com. Upload a PDF (≤25 MB), place fields in the editor, sign or send to recipients, and download—no desktop software or scanner required." }),
        contentBlock("p", { text: "Early Access means the product is live, free to use, and actively improving from real user feedback. This post explains what CubSign does today and how to get started." }),
        contentBlock("figure", { slug: "introducing-cubsign-early-access", asset: "workflow", alt: "CubSign Early Access: upload, sign, request signatures, track completion", caption: "CubSign Early Access: self-sign as guest or create an account for storage, templates, and signature requests.", variant: "diagram" }),
        contentBlock("h2", { text: "What CubSign does today" }),
        contentBlock("ul", { items: [
            "Upload PDFs up to 25 MB and open them in the browser editor.",
            "Place fields: signature, initials, name, text, date, checkbox.",
            "Create a signature by drawing, typing, or uploading an image for the current session.",
            "Download signed PDFs or send signature requests to multiple recipients (account required).",
            "Store documents, use templates, and track signing activity in your workspace (account).",
        ]}),
        contentBlock("note", { text: "Guest users: one self-sign session without an account. Create a free account for storage, templates, multi-recipient requests, and signing history." }),
        contentBlock("h2", { text: "Get started in five minutes" }),
        contentBlock("ol", { items: [
            "Visit cubsign.com/sign and upload a low-stakes PDF to try guest self-signing.",
            "Place a signature field, draw or type your mark, download the result.",
            "Create a free account to save the document and unlock signature requests.",
            "Send a test request to a colleague and experience the recipient link flow.",
            "Share feedback via the Contact page or support@cubsign.com—we read every message during Early Access.",
        ]}),
        contentBlock("figure", { slug: "introducing-cubsign-early-access", asset: "ui", alt: "CubSign upload page for Early Access users", caption: "Early Access includes self-signing, signature requests, templates, and workspace storage at no charge while we refine the product.", variant: "screenshot" }),
        contentBlock("h2", { text: "Security from day one" }),
        contentBlock("p", { text: "CubSign serves all pages over HTTPS. Documents in your workspace are stored with access controls—only your account and invited recipients can reach them. Activity logging covers core signing events (invitations, signatures, completion), not marketing-style view tracking." }),
        contentBlock("h2", { text: "What we are building toward" }),
        contentBlock("p", { text: "Early Access feedback shapes templates, editor UX, and request workflows. Tell us where the flow slowed you down, which document types you sign most, and what would make CubSign your default tool." }),
        contentBlock("callout", { slug: "introducing-cubsign-early-access", title: "Try both sides", text: "Send your first signature request to yourself. Experiencing the recipient link once shows exactly what your clients will see.", asset: "ui", alt: "CubSign Early Access upload page" }),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "CubSign Early Access: free PDF signing in the browser, guest self-sign or account for storage and requests, honest security (HTTPS + private storage + access controls). Start at cubsign.com/sign and help us build the signing tool you actually need." }),
    ],

    "what-is-an-audit-trail": [
        contentBlock("p", { text: "When you send a PDF for signature in CubSign, the workspace keeps a record of key signing events—not just the finished PDF, but when invitations went out, who signed, and when the document completed. That record is what people mean by an audit trail in e-signing." }),
        contentBlock("p", { text: "This article explains what CubSign logs, what it does not surface in the user-facing trail, and why that matters for everyday contract work." }),
        contentBlock("figure", { slug: "what-is-an-audit-trail", asset: "workflow", alt: "CubSign activity: invitation sent, recipient signed, document completed", caption: "CubSign activity events: invitation sent, recipient signed, document completed—with timestamps in your workspace.", variant: "diagram" }),
        contentBlock("h2", { text: "Events CubSign records" }),
        contentBlock("p", { text: "In your CubSign workspace, the user-facing activity trail focuses on signing workflow events:" }),
        contentBlock("ul", { items: [
            "Invitation sent — when a signature request was emailed to a recipient.",
            "Recipient signed — when a signer completed their assigned fields.",
            "Document completed — when all required signatures are in and the document is finished.",
        ]}),
        contentBlock("p", { text: "Each event includes a timestamp and ties to the document in your workspace. CubSign does not present page views or IP addresses in this user-facing audit trail—those are not part of what we show account holders for day-to-day tracking." }),
        contentBlock("note", { text: "Keep the signed PDF and the workspace activity together. The PDF is the executed agreement; the activity record supports who signed and when." }),
        contentBlock("h2", { text: "Why teams use it" }),
        contentBlock("p", { text: "Status questions come up constantly: Did they sign? Is everyone done? The activity trail answers that without digging through email. For disputes, the combination of the final PDF plus invitation and signature timestamps establishes a clearer timeline than memory alone." }),
        contentBlock("figure", { slug: "what-is-an-audit-trail", asset: "ui", alt: "CubSign document activity showing invitation, signature, and completion events", caption: "Open any document in your workspace to see invitation, signature, and completion events.", variant: "screenshot" }),
        contentBlock("h2", { text: "Multi-recipient documents" }),
        contentBlock("p", { text: "Each recipient generates their own recipient signed event. Document completed appears only after the last required signature. With signing order enabled, later invitations may not send until earlier signers finish." }),
        contentBlock("h2", { text: "Self-sign vs requests" }),
        contentBlock("p", { text: "Guest self-sign sessions do not create workspace history—download the PDF when done. Account holders see activity for documents they send for signature and store in the workspace." }),
        contentBlock("callout", { slug: "what-is-an-audit-trail", title: "Record keeping", text: "After a deal closes, save the downloaded PDF and note the completion timestamp from workspace activity in your CRM or deal folder.", asset: "ui", alt: "CubSign activity log" }),
        contentBlock("h2", { text: "What an audit trail is not" }),
        contentBlock("ul", { items: [
            "A replacement for the signed PDF itself.",
            "A guarantee of identity beyond the email invitation and signing action.",
            "A log of every page view or visitor IP in the CubSign UI.",
        ]}),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "CubSign audit trail (user-facing): invitations sent, recipients signed, document completed—with timestamps in your workspace. Pair that record with the downloaded PDF for a complete signing file." }),
    ],

    "draw-vs-type-your-signature": [
        contentBlock("p", { text: "CubSign gives you three ways to fill a signature field: draw on the canvas, type your name in a signature-style font, or upload a PNG/JPG from your device. All three are valid for the current signing session—CubSign does not save a persistent signature library across documents." }),
        contentBlock("p", { text: "Choosing draw vs type is mostly about legibility and device. This guide helps you pick the right option in the CubSign editor for each document." }),
        contentBlock("figure", { slug: "draw-vs-type-your-signature", asset: "workflow", alt: "CubSign draw, type, and upload signature options", caption: "CubSign signature panel: Draw, Type, or Upload—for the current document session.", variant: "diagram" }),
        contentBlock("h2", { text: "Draw" }),
        contentBlock("p", { text: "Best on tablet, trackpad, or phone in landscape mode. Feels personal on informal agreements. Risk: shaky strokes on small screens or with a mouse—zoom the field and draw slowly, or switch to type." }),
        contentBlock("h2", { text: "Type" }),
        contentBlock("p", { text: "Best for small signature blocks, dense contracts, and mobile signing. Spelling of your legal name is explicit. Often the clearest choice when the field will print at reduced size." }),
        contentBlock("h2", { text: "Upload" }),
        contentBlock("p", { text: "Use when you already have a signature image file. Prefer high-contrast PNG with transparent background. The image is used for this signing session only—not stored as a reusable CubSign profile signature." }),
        contentBlock("note", { text: "Legally, intent and a reliable record matter more than whether the mark was drawn or typed. CubSign captures either in the signed PDF." }),
        contentBlock("h2", { text: "Quick decision guide" }),
        contentBlock("ol", { items: [
            "Signing on a phone with a tiny field? → Type.",
            "Informal agreement on a tablet? → Draw in landscape.",
            "Brand requires a specific image file? → Upload.",
            "Multiple signature fields on one PDF? → Use one method consistently throughout.",
        ]}),
        contentBlock("figure", { slug: "draw-vs-type-your-signature", asset: "ui", alt: "CubSign Draw and Type signature panels side by side", caption: "Compare draw and type in the editor before completing—preview at document zoom.", variant: "screenshot" }),
        contentBlock("h2", { text: "Within one document" }),
        contentBlock("p", { text: "You can redraw or retype before completing the document. Once applied, the same drawn or typed mark can fill multiple signature fields in that session. Starting a new document means creating your signature again—there is no cross-document saved signature in CubSign today." }),
        contentBlock("callout", { slug: "draw-vs-type-your-signature", title: "Consistency", text: "Do not mix a drawn signature on page 1 and typed on page 5 of the same contract—it looks inconsistent in review.", asset: "ui", alt: "CubSign signature options" }),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "Draw for personal touch on a good input device; type for clarity on mobile and formal PDFs; upload when you have an approved image file. All apply to the current CubSign session only. See How to Sign a PDF Online for the full upload-to-download flow." }),
    ],

    "how-to-sign-pdfs-on-mobile": [
        contentBlock("p", { text: "CubSign runs in mobile browsers—no app install. Open cubsign.com/sign or a recipient signing link on iOS or Android, upload or open the PDF, place fields, and download the signed file. The same field types (signature, initials, name, text, date, checkbox) and 25 MB limit apply as on desktop." }),
        contentBlock("p", { text: "Mobile works well when you adjust for screen size: landscape for drawing, pinch-zoom for placement, typed signatures on very small fields." }),
        contentBlock("figure", { slug: "how-to-sign-pdfs-on-mobile", asset: "workflow", alt: "CubSign mobile signing in browser", caption: "Open CubSign in your phone browser, rotate to landscape for drawing, download when finished.", variant: "diagram" }),
        contentBlock("h2", { text: "Mobile signing steps" }),
        contentBlock("ol", { items: [
            "Open the signing link or cubsign.com/sign in Safari, Chrome, or Firefox—not a cramped in-app browser if you can avoid it.",
            "Rotate to landscape before drawing a signature.",
            "Pinch-zoom to the signature line before placing or dragging a field.",
            "Prefer typed signature if finger-drawing looks uneven.",
            "Scroll every page at readable zoom before completing.",
            "Download immediately—the signed PDF saves to your device downloads.",
        ]}),
        contentBlock("figure", { slug: "how-to-sign-pdfs-on-mobile", asset: "ui", alt: "CubSign on phone showing PDF and sign button", caption: "CubSign mobile editor: same upload, field, and download flow as desktop.", variant: "screenshot" }),
        contentBlock("h2", { text: "Recipient links on mobile" }),
        contentBlock("p", { text: "Signature request emails open the same mobile editor. Recipients draw, type, or upload a signature for that session—no account needed. HTTPS protects the session in transit." }),
        contentBlock("h2", { text: "Tips that matter on small screens" }),
        contentBlock("ul", { items: [
            "Landscape + slow strokes for drawn signatures.",
            "Typed name for fields smaller than a thumb width.",
            "Stable Wi‑Fi or cellular—not public Wi‑Fi for sensitive contracts.",
            "Screen lock on your device before saving confidential PDFs locally.",
        ]}),
        contentBlock("tip", { text: "Create your signature once per document session. If the first draw attempt looks bad, clear and retry—or switch to type instead of fighting the touch canvas." }),
        contentBlock("h2", { text: "Guest vs account on mobile" }),
        contentBlock("p", { text: "Guest: one self-sign session, download when done. Account: signed documents also appear in your workspace for later access from any device." }),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "CubSign mobile signing: browser-based, landscape + zoom + typed signatures for best results, download right away. No persistent saved signature across sessions—recreate draw/type/upload each time you sign a new PDF." }),
    ],

    "securing-your-documents-with-cubsign": [
        contentBlock("p", { text: "This page describes how CubSign handles PDFs you upload and send for signature—honestly, without overstating what the product does. We focus on HTTPS in transit, private storage with access controls, and logging of core signing events." }),
        contentBlock("p", { text: "Security is shared: CubSign protects the platform layer; you protect credentials, recipient emails, and where downloaded files land." }),
        contentBlock("figure", { slug: "securing-your-documents-with-cubsign", asset: "workflow", alt: "CubSign security: HTTPS, access controls, activity logging", caption: "CubSign: HTTPS connections, workspace access controls, signing activity events.", variant: "diagram" }),
        contentBlock("h2", { text: "In transit: HTTPS" }),
        contentBlock("p", { text: "All CubSign signing pages are served over HTTPS. Uploads, editor sessions, and downloads are encrypted between your browser and our servers. Verify the padlock and cubsign.com domain before uploading sensitive files." }),
        contentBlock("h2", { text: "At rest: private storage and access controls" }),
        contentBlock("p", { text: "PDFs stored in your CubSign workspace are not public links. Access is limited to your authenticated account and recipients you invite via signing links tied to their email. We do not claim AES-256 or specific at-rest encryption algorithms in product documentation—what we implement is private storage with strict access boundaries rather than files sitting as open attachments in email." }),
        contentBlock("note", { text: "Downloaded PDFs on your laptop or phone are your responsibility. Store them in access-controlled folders, not shared Downloads directories." }),
        contentBlock("h2", { text: "Signing links and recipients" }),
        contentBlock("p", { text: "Signature requests send recipients individual links. Do not forward links in public channels. Verify email addresses before sending—a typo exposes a contract to a stranger." }),
        contentBlock("h2", { text: "Activity logging" }),
        contentBlock("p", { text: "CubSign logs core workflow events in your workspace: invitations sent, recipient signed, document completed. This user-facing trail supports accountability; it is not a detailed view or IP audit log." }),
        contentBlock("ol", { items: [
            "Upload over HTTPS on cubsign.com.",
            "Invite only required recipients.",
            "Recipients sign via their link; events record completion.",
            "Download the finished PDF to your controlled storage.",
            "Review workspace activity if a signing dispute arises.",
        ]}),
        contentBlock("figure", { slug: "securing-your-documents-with-cubsign", asset: "ui", alt: "CubSign Security page", caption: "Full overview at cubsign.com/security—HTTPS, access control, authentication, disclosure policy.", variant: "screenshot" }),
        contentBlock("h2", { text: "Your responsibilities" }),
        contentBlock("ul", { items: [
            "Strong unique password or Google sign-in for your CubSign account.",
            "Do not share one login across a team.",
            "Confirm recipient identities before sending contracts.",
            "Report suspicious emails impersonating CubSign to support@cubsign.com.",
        ]}),
        contentBlock("callout", { slug: "securing-your-documents-with-cubsign", title: "Account hygiene", text: "Platform access controls cannot help if someone logs in with a leaked password. Use a unique credential for CubSign.", asset: "ui", alt: "CubSign security overview" }),
        contentBlock("h2", { text: "What we do not claim" }),
        contentBlock("ul", { items: [
            "AES-256 or specific at-rest encryption marketing language.",
            "Qualified digital certificates or PKI-backed signatures—CubSign is electronic signing for everyday PDFs.",
            "Persistent reusable signature storage across all sessions.",
        ]}),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "CubSign document security: HTTPS in transit, private workspace storage with access limited to you and invited signers, activity events for invitations and signatures. Pair that with strong account hygiene and careful recipient verification." }),
    ],

    "how-to-create-a-reusable-signature": [
        contentBlock("p", { text: "Search engines often ask how to create a reusable signature—but CubSign works differently than tools with a saved signature library. In CubSign, you draw, type, or upload a signature image each time you start a new document or signing session. Within that session, the same mark can fill multiple signature fields on the same PDF." }),
        contentBlock("p", { text: "This guide explains how to create a clean signature in the CubSign editor for the document in front of you, and how to get consistent results without a persistent saved signature feature." }),
        contentBlock("figure", { slug: "how-to-create-a-reusable-signature", asset: "workflow", alt: "CubSign signature panel: draw, type, or upload for current session", caption: "Create your signature in the CubSign editor—draw, type, or upload—for the current document session.", variant: "diagram" }),
        contentBlock("h2", { text: "How signatures work in CubSign" }),
        contentBlock("p", { text: "When you click a signature field, the panel offers Draw, Type, and Upload. Your choice applies to fields in that signing session. Starting a new PDF means creating your signature again. CubSign does not store a cross-document reusable signature profile today." }),
        contentBlock("note", { text: "Slug note: this article keeps the URL how-to-create-a-reusable-signature for search compatibility, but describes CubSign actual per-session behavior." }),
        contentBlock("h2", { text: "Create your mark for this document" }),
        contentBlock("ol", { items: [
            "Open the PDF in the CubSign editor.",
            "Click a signature field to open the signature panel.",
            "Draw: use a tablet, trackpad, or phone in landscape with slow strokes.",
            "Type: enter your legal name—best for small fields and mobile.",
            "Upload: choose a PNG/JPG from your device if you keep a signature image locally.",
            "Apply the same mark to other signature fields on this PDF without recreating it.",
        ]}),
        contentBlock("figure", { slug: "how-to-create-a-reusable-signature", asset: "ui", alt: "CubSign signature panel with Draw and Type tabs", caption: "Draw, type, or upload in the signature panel—then apply across fields on the same document.", variant: "screenshot" }),
        contentBlock("h2", { text: "Consistency without a saved library" }),
        contentBlock("p", { text: "Teams that want uniform signatures often keep a PNG on their device and use Upload each session, or standardize on typed signatures for formal documents. Drawing on a laptop once per document still takes seconds if you use landscape on mobile or a steady stroke on desktop." }),
        contentBlock("h2", { text: "Upload option tips" }),
        contentBlock("ul", { items: [
            "Use high-contrast PNG with transparent background.",
            "Store the source image in a private folder—not a shared drive.",
            "Re-upload the same file each new CubSign document if you want identical appearance.",
        ]}),
        contentBlock("callout", { slug: "how-to-create-a-reusable-signature", title: "Within one PDF", text: "After creating your signature once, click additional signature fields on the same document to reuse that mark without redrawing.", asset: "ui", alt: "CubSign signature panel" }),
        contentBlock("h2", { text: "Security" }),
        contentBlock("p", { text: "Treat uploaded signature images like credentials—anyone with the file could paste it elsewhere. Never share your CubSign account login. Sessions run over HTTPS." }),
        contentBlock("h2", { text: "Summary" }),
        contentBlock("p", { text: "CubSign: draw, type, or upload per signing session; reuse the mark across fields on the same PDF only. For draw vs type guidance, see Draw vs Type Your Signature." }),
    ],
};

function serializeContent(content) {
    const lines = content.map((block) => {
        const inner = Object.entries(block)
            .map(([k, v]) => {
                if (k === "items") {
                    return `${k}: [\n${v.map((item) => `                    ${JSON.stringify(item)},`).join("\n")}\n                ]`;
                }
                return `${k}: ${JSON.stringify(v)}`;
            })
            .join(",\n                ");
        return `            {\n                ${inner},\n            }`;
    });
    return `[\n${lines.join(",\n")}\n        ]`;
}

function replacePostContent(source, slug, newContent) {
    const slugPattern = new RegExp(
        `(slug: "${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",[\\s\\S]*?content: )\\[[\\s\\S]*?\\](\\s*,\\s*faq:)`,
        "m"
    );
    if (!slugPattern.test(source)) {
        throw new Error(`Could not find content block for slug: ${slug}`);
    }
    return source.replace(slugPattern, `$1${serializeContent(newContent)}$2`);
}

function removeBridgeBlocks(source) {
    const bridgePattern =
        /\{\s*type: "p",\s*text: "Walk through the details of each step so nothing important is skipped under time pressure:",\s*\},/g;
    let result = source.replace(bridgePattern, "");

    const stepDetailPattern =
        /\{\s*type: "p",\s*text: "Step \d+: [\s\S]*?",\s*\},/g;
    result = result.replace(stepDetailPattern, "");
    return result;
}

const CLAIM_REPLACEMENTS = [
    [/encrypted at rest rather than sitting as plain documents on a disk/g, "stored in your workspace with access limited to your account—not as loose email attachments"],
    [/encrypts stored documents at rest/g, "stores documents with access limited to authorized users"],
    [/encrypts stored files at rest/g, "stores files with access limited to authorized users"],
    [/encryption at rest for stored PDFs/g, "private storage and access controls for stored PDFs"],
    [/encrypted storage at rest/g, "private storage with access controls"],
    [/encrypted storage and/g, "private storage with access controls and"],
    [/encrypted storage,/g, "private storage with access controls,"],
    [/encrypted storage\./g, "private storage with access controls."],
    [/encrypted storage/g, "private storage with access controls"],
    [/encryption at rest/g, "private storage and access controls"],
    [/encrypts documents in transit over HTTPS and at rest/g, "protects documents with HTTPS in transit and private storage with access controls"],
    [/encrypts documents in transit and at rest/g, "uses HTTPS in transit and private storage with access controls"],
    [/encrypts files both in transit and at rest/g, "protects files in transit over HTTPS and in private storage with access controls"],
    [/encrypts files in transit and at rest/g, "protects files in transit over HTTPS and in private storage with access controls"],
    [/encrypts stored data in transit and at rest/g, "protects data in transit over HTTPS and in private storage with access controls"],
    [/encrypts documents in transit and at rest and logs/g, "uses HTTPS in transit, private storage with access controls, and logs"],
    [/Storage encryption protects it while it sits at rest\./g, "Access control protects stored files by limiting who can open them."],
    [/storage encryption, access control/g, "private storage with access controls"],
    [/Transport encryption, storage encryption, access control/g, "HTTPS in transit, private storage with access controls, activity logging"],
    [/encrypted in transit and at rest/g, "protected in transit over HTTPS and in private storage with access controls"],
    [/encrypted in transit during upload and signing, then stored with access limited to owners and invited recipients/g, "encrypted in transit over HTTPS during upload and signing, then stored in private workspace storage with access limited to owners and invited recipients"],
    [/Verify encryption at rest so stored PDFs are protected with algorithms such as AES-256\./g, "Confirm the platform uses HTTPS and restricts stored PDF access to authorized users—not open public links."],
    [/CubSign stores the document encrypted at rest using strong industry algorithms\./g, "CubSign stores the document in private workspace storage with access limited to your account and invited recipients."],
    [/Documents are encrypted in transit over HTTPS and encrypted at rest with strong industry algorithms/g, "Documents are protected in transit over HTTPS and stored in private workspace storage with access controls"],
    [/tool encrypts files in transit and at rest and access is controlled/g, "tool uses HTTPS in transit, private storage with access controls"],
    [/Because CubSign encrypts documents in transit over HTTPS and at rest,/g, "Because CubSign uses HTTPS in transit and private storage with access controls,"],
    [/rely on encrypted transit and storage rather than/g, "rely on HTTPS and controlled signing links rather than"],
    [/encrypted transit, encrypted storage, and controlled access/g, "HTTPS in transit, private storage with access controls"],
    [/encrypted transit and storage/g, "HTTPS and private storage with access controls"],
    [/with encrypted storage and an audit trail/g, "with private storage, access controls, and signing activity records"],
    [/Unique per-recipient links, activity logging, and encrypted storage mean/g, "Unique per-recipient links, activity logging, and private storage mean"],
    [/encryption in transit, encryption at rest, or activity logging/g, "HTTPS, access control, or activity logging"],
    [/HTTPS, access control, encryption at rest, or activity logging/g, "HTTPS, access control, or activity logging"],
    [/encryption in transit and at rest, strict access control/g, "HTTPS in transit, private storage with access controls"],
    [/Free and early does not mean unprotected\. From day one CubSign enforces HTTPS in transit, encrypts stored documents at rest,/g, "Free and early does not mean unprotected. From day one CubSign enforces HTTPS in transit, stores documents in private workspace storage with access controls,"],
    [/CubSign enforces HTTPS, encrypts stored files, and controls access/g, "CubSign enforces HTTPS, uses private storage with access controls"],
    [/they keep both the document and its history from being tampered with after the fact\./g, "access controls help keep both the document and its history tied to authorized users."],
    [/The CubSign audit trail logs views, signatures, and downloads with timestamps/g, "CubSign records invitation, recipient signed, and document completed events with timestamps"],
    [/audit trail of views, signatures, timestamps, and completion/g, "activity record of invitations, signatures, timestamps, and completion"],
    [/An audit trail of views, timestamps, and completion/g, "An activity record of invitations, signatures, timestamps, and completion"],
    [/Inspect the audit trail for views, signatures, timestamps, and completion events\./g, "Inspect the activity record for invitations, signatures, timestamps, and completion events."],
    [/Open any completed document in your workspace to review the full activity timeline, sent, viewed, signed, and downloaded events are listed in order\./g, "Open any completed document in your workspace to review activity: invitations sent, recipient signed, and document completed events with timestamps."],
    [/Per-document audit trail with timestamps/g, "Per-document activity events with timestamps"],
    [/Status tracking: pending, viewed, signed/g, "Status tracking: pending, signed, completed"],
    [/It shows who has completed and who is still pending/g, "It shows who has signed and who is still pending"],
    [/The audit trail shows viewed and signed timestamps\./g, "The activity record shows invitation and signature timestamps."],
    [/When a client asks “did they sign yet?”, open the document in your workspace instead of searching email\. The audit trail shows viewed and signed timestamps\./g, "When a client asks “did they sign yet?”, open the document in your workspace instead of searching email. The activity record shows invitation and signature timestamps."],
    [/View events, indicating when a recipient actually opened the document\./g, "Recipient signed events, indicating when a signer completed their fields."],
    [/Supporting metadata such as timestamps and, where relevant, IP information\./g, "Timestamps on each signing workflow event."],
    [/sent, viewed, signed, downloaded with timestamps/g, "invitation sent, recipient signed, document completed with timestamps"],
    [/sent, viewed, signed, and downloaded events/g, "invitation, signature, and completion events"],
    [/sent, viewed, signed, downloaded/g, "invitation sent, recipient signed, document completed"],
    [/creation, sends, views, signatures, and completion/g, "invitations, signatures, and completion"],
    [/views, signatures, and completion/g, "invitations, signatures, and completion"],
    [/Yes\. CubSign logs core signing events inside your workspace so the finished PDF is backed by a record of views, signatures, and completion\./g, "Yes. CubSign logs core signing events inside your workspace—invitations sent, recipient signed, and document completed."],
    [/backed by a clear record of views, signatures, and completion/g, "backed by a clear record of invitations, signatures, and completion"],
    [/save a reusable signature approach you trust/g, "pick a consistent approach—typed or upload the same PNG each session"],
    [/Save a reusable signature when your workflow allows, so you skip redrawing\./g, "Use typed signature or upload the same image file each session if you want a consistent look."],
    [/Keep a saved signature ready for documents you sign frequently\./g, "Keep a signature PNG on your device to upload each new CubSign session if you want consistency."],
    [/Create your reusable signature once on a larger screen/g, "Create your drawn signature on a larger screen each session"],
    [/save a reusable signature, prefer typed marks/g, "use typed signatures or upload a PNG, prefer typed marks"],
    [/Saving a reusable signature means you skip redrawing on every document you sign\./g, "Within one CubSign document, your signature applies to all fields without redrawing; new documents require creating the mark again."],
    [/Can I reuse a signature across documents\?/g, "Can I reuse a signature across documents?"],
    [/Yes, when your workflow allows it\. Saving a reusable signature means you skip redrawing on every document you sign\./g, "Within one PDF, yes—the same mark fills multiple fields. Across new documents, you create your signature again each session; CubSign does not store a persistent signature library."],
    [/Save whichever style you prefer as a reusable signature for speed\./g, "Use the same style (draw, type, or upload) consistently within each document."],
    [/How to Create a Reusable Signature shows how to save it so you never have to decide again on routine documents\./g, "How to Create Your Signature in CubSign explains draw, type, and upload for each session."],
    [/How to Create a Reusable Signature saves your preferred style/g, "How to Create Your Signature in CubSign covers draw, type, and upload"],
    [/Never saving your preferred style, so you re-decide on every document\./g, "Not deciding draw vs type upfront, so you waste time toggling in the editor."],
    [/keep any saved signature image secure/g, "keep any signature image file you upload stored securely on your device"],
    [/uploading a saved signature image/g, "uploading a signature image from your device"],
];

let source = fs.readFileSync(BLOG_PATH, "utf8");

// Global author
source = source.replace(
    /export const blogAuthor = \{[\s\S]*?\};/,
    GLOBAL_AUTHOR
);

// Per-post author blocks
source = source.split(OLD_AUTHOR).join(AUTHOR_BLOCK);

// Remove bridge + step detail blocks (non-priority posts still benefit; priority gets full replace)
source = removeBridgeBlocks(source);

// Claim fixes globally (including light cleanup posts)
for (const [pattern, replacement] of CLAIM_REPLACEMENTS) {
    source = source.replace(pattern, replacement);
}

// Update priority post metadata and content
for (const slug of PRIORITY_SLUGS) {
    if (priorityContent[slug]) {
        source = replacePostContent(source, slug, priorityContent[slug]);
    }
    // updatedAt for rewritten posts
    const updatedPattern = new RegExp(
        `(slug: "${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",[\\s\\S]*?updatedAt: ")[^"]+(")`
    );
    source = source.replace(updatedPattern, `$1${"2026-08-08"}$2`);
}

// Fix reusable signature post title/excerpt/meta (keep slug)
source = source.replace(
    /slug: "how-to-create-a-reusable-signature",\s*title: "How to Create a Reusable Signature"/,
    'slug: "how-to-create-a-reusable-signature",\n        title: "How to Create Your Signature in CubSign"'
);
source = source.replace(
    /excerpt: "Save time on recurring documents by creating a signature you can apply consistently across PDFs in CubSign\."/,
    'excerpt: "Draw, type, or upload a signature in the CubSign editor for your current document. How per-session signatures work—without a persistent saved signature library."'
);
source = source.replace(
    /metaTitle: "How to Create a Reusable Signature \| CubSign"/,
    'metaTitle: "How to Create Your Signature in CubSign | CubSign"'
);
source = source.replace(
    /metaDescription: "Create a clean reusable signature for CubSign, draw, type, or upload and apply it consistently across documents\."/,
    'metaDescription: "Create a signature in CubSign by drawing, typing, or uploading an image for the current session. Apply it across fields on the same PDF."'
);

// Priority post updatedAt already set; also update how-to-sign-a-pdf-online excerpt if needed
source = source.replace(
    /metaDescription: "See how CubSign uses HTTPS, encrypted storage, and access controls to protect the PDFs you upload and sign\."/,
    'metaDescription: "How CubSign protects PDFs: HTTPS in transit, private storage with access controls, and signing activity logging."'
);

fs.writeFileSync(BLOG_PATH, source, "utf8");
console.log("Blog rewrite complete.");
console.log("Priority full rewrites:", [...PRIORITY_SLUGS].join(", "));
