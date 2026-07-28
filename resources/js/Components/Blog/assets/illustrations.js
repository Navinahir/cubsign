/**
 * Unique in-article CubSign illustrations — workflow diagrams & UI mockups per post.
 * Generated to WebP/PNG via scripts/generate-blog-assets.mjs
 */
import { BLOG_COVER_SLUGS } from '../covers/illustrations.js';
import {
    BG,
    VIEW_W,
    browserChrome,
    calloutBadge,
    escapeXml,
    pdfDoc,
    workflowRow,
    wrapAssetSvg,
} from './primitives.js';

export const BLOG_ASSET_SLUGS = BLOG_COVER_SLUGS;

/** Per-article visual parameters — each post gets a distinct layout + accent. */
export const articleVariants = {
    'how-to-sign-a-pdf-online': {
        accent: '#2563EB',
        pdf: 'Contract.pdf',
        workflow: [
            { title: 'Upload PDF', sub: 'Drag & drop' },
            { title: 'Place signature', sub: 'Editor' },
            { title: 'Download', sub: 'Signed copy' },
        ],
        scene: 'upload',
    },
    'electronic-signature-vs-digital-signature': {
        accent: '#4F46E5',
        pdf: 'Agreement.pdf',
        workflow: [
            { title: 'Draw or type', sub: 'E-signature' },
            { title: 'Certificate', sub: 'Digital ID' },
            { title: 'Audit log', sub: 'Verification' },
        ],
        scene: 'compare',
    },
    'how-secure-are-electronic-signatures': {
        accent: '#DC2626',
        pdf: 'Secure-NDA.pdf',
        workflow: [
            { title: 'HTTPS upload', sub: 'Encrypted' },
            { title: 'Sign session', sub: 'TLS' },
            { title: 'Stored safely', sub: 'Cloud' },
        ],
        scene: 'security',
    },
    'how-small-businesses-save-time-using-esignatures': {
        accent: '#059669',
        pdf: 'Invoice.pdf',
        workflow: [
            { title: 'Send request', sub: 'Email link' },
            { title: 'Client signs', sub: 'No account' },
            { title: 'Auto notify', sub: 'Complete' },
        ],
        scene: 'request',
    },
    'best-practices-for-signing-contracts-online': {
        accent: '#0D9488',
        pdf: 'Final-Contract.pdf',
        workflow: [
            { title: 'Review pages', sub: 'Every clause' },
            { title: 'Align fields', sub: 'Signature line' },
            { title: 'Archive copy', sub: 'Workspace' },
        ],
        scene: 'editor',
    },
    'how-to-protect-pdf-documents': {
        accent: '#E11D48',
        pdf: 'Protected.pdf',
        workflow: [
            { title: 'HTTPS only', sub: 'In transit' },
            { title: 'Access control', sub: 'Owner only' },
            { title: 'Delete when done', sub: 'Workspace' },
        ],
        scene: 'security',
    },
    'how-to-request-digital-signatures': {
        accent: '#2563EB',
        pdf: 'Proposal.pdf',
        workflow: [
            { title: 'Add recipients', sub: 'By email' },
            { title: 'Place fields', sub: 'Per signer' },
            { title: 'Send & track', sub: 'Dashboard' },
        ],
        scene: 'request',
    },
    'benefits-of-paperless-workflows': {
        accent: '#D97706',
        pdf: 'Onboarding.pdf',
        workflow: [
            { title: 'Upload once', sub: 'Template' },
            { title: 'Reuse fields', sub: 'Templates' },
            { title: 'Track status', sub: 'Dashboard' },
        ],
        scene: 'templates',
    },
    'how-to-sign-pdfs-on-mobile': {
        accent: '#0284C7',
        pdf: 'Mobile-Sign.pdf',
        workflow: [
            { title: 'Open link', sub: 'Phone browser' },
            { title: 'Draw signature', sub: 'Landscape' },
            { title: 'Submit', sub: 'Instant' },
        ],
        scene: 'mobile',
    },
    'common-mistakes-when-signing-pdfs': {
        accent: '#EA580C',
        pdf: 'DRAFT.pdf',
        workflow: [
            { title: 'Check version', sub: 'Not draft' },
            { title: 'Read all pages', sub: 'Initials too' },
            { title: 'Download', sub: 'Save copy' },
        ],
        scene: 'editor',
    },
    'are-electronic-signatures-legally-binding': {
        accent: '#475569',
        pdf: 'Binding-Agreement.pdf',
        workflow: [
            { title: 'Intent to sign', sub: 'Clear action' },
            { title: 'Identity', sub: 'Email link' },
            { title: 'Audit trail', sub: 'Timestamp' },
        ],
        scene: 'audit',
    },
    'securing-your-documents-with-cubsign': {
        accent: '#1D4ED8',
        pdf: 'Workspace-Doc.pdf',
        workflow: [
            { title: 'Verify HTTPS', sub: 'cubsign.com' },
            { title: 'Invite only', sub: 'Recipients' },
            { title: 'Activity log', sub: 'Audit trail' },
        ],
        scene: 'security',
    },
    'request-signatures-from-multiple-recipients': {
        accent: '#7C3AED',
        pdf: 'Multi-Party.pdf',
        workflow: [
            { title: 'Add signers', sub: '2+ emails' },
            { title: 'Assign fields', sub: 'Per person' },
            { title: 'Track all', sub: 'Status view' },
        ],
        scene: 'recipients',
    },
    'mobile-pdf-signing-tips': {
        accent: '#0891B2',
        pdf: 'Field-Report.pdf',
        workflow: [
            { title: 'Rotate device', sub: 'Landscape' },
            { title: 'Pinch zoom', sub: 'Dense pages' },
            { title: 'Type if needed', sub: 'Clear mark' },
        ],
        scene: 'mobile',
    },
    'introducing-cubsign-early-access': {
        accent: '#2563EB',
        pdf: 'Welcome.pdf',
        workflow: [
            { title: 'Sign free', sub: 'Early Access' },
            { title: 'Send requests', sub: 'Unlimited' },
            { title: 'Give feedback', sub: 'Shape product' },
        ],
        scene: 'upload',
    },
    'what-is-an-audit-trail': {
        accent: '#6366F1',
        pdf: 'Audit-Log.pdf',
        workflow: [
            { title: 'Document sent', sub: 'Timestamp' },
            { title: 'Viewed', sub: 'Recipient' },
            { title: 'Signed', sub: 'Recorded' },
        ],
        scene: 'audit',
    },
    'how-to-create-a-reusable-signature': {
        accent: '#2563EB',
        pdf: 'Brand-Sign.pdf',
        workflow: [
            { title: 'Draw once', sub: 'Canvas' },
            { title: 'Save style', sub: 'Reuse' },
            { title: 'Apply fast', sub: 'Next doc' },
        ],
        scene: 'signature',
    },
    'draw-vs-type-your-signature': {
        accent: '#3B82F6',
        pdf: 'Signature-Choice.pdf',
        workflow: [
            { title: 'Draw', sub: 'Personal' },
            { title: 'Type', sub: 'Legible' },
            { title: 'Upload image', sub: 'Existing' },
        ],
        scene: 'signature',
    },
    'nda-signing-guide-for-startups': {
        accent: '#1E40AF',
        pdf: 'Mutual-NDA.pdf',
        workflow: [
            { title: 'Send NDA', sub: 'Request link' },
            { title: 'Founder signs', sub: 'Both parties' },
            { title: 'Store securely', sub: 'Workspace' },
        ],
        scene: 'request',
    },
    'freelancer-contract-signing-checklist': {
        accent: '#0F766E',
        pdf: 'Client-SOW.pdf',
        workflow: [
            { title: 'Scope agreed', sub: 'Final PDF' },
            { title: 'Client signs', sub: 'Email link' },
            { title: 'You countersign', sub: 'Download' },
        ],
        scene: 'request',
    },
};

function sceneUpload(accent, pdf) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#F1F5F9"/>
      <g transform="translate(120,100)">
        <rect width="400" height="220" rx="16" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2" stroke-dasharray="8 6"/>
        <text x="200" y="100" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="#2563EB">Drop PDF here</text>
        <text x="200" y="124" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#64748B">or click to browse (up to 25 MB)</text>
        <rect x="140" y="150" width="120" height="36" rx="10" fill="${accent}"/>
        <text x="200" y="173" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#FFFFFF">Upload PDF</text>
      </g>
      ${pdfDoc(460, 280, 140, 180, pdf, accent)}
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/sign', inner);
}

function sceneEditor(accent, pdf) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#E2E4E9"/>
      ${pdfDoc(60, 70, 280, 320, pdf, accent)}
      <g transform="translate(380,70)">
        <rect width="220" height="320" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="16" y="28" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#1E293B">Signature</text>
        <rect x="16" y="40" width="188" height="80" rx="8" fill="#F8FAFC" stroke="#BFDBFE"/>
        <path d="M30 95 Q60 60 90 85 T150 70" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
        <rect x="16" y="140" width="88" height="28" rx="6" fill="${accent}"/>
        <text x="60" y="158" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="600" fill="#FFF">Draw</text>
        <rect x="116" y="140" width="88" height="28" rx="6" fill="#F1F5F9" stroke="#E2E8F0"/>
        <text x="160" y="158" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#64748B">Type</text>
        ${calloutBadge(16, 190, 'Place on PDF →', accent)}
      </g>
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/sign/editor', inner);
}

function sceneRequest(accent, pdf) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#F8FAFC"/>
      ${pdfDoc(40, 60, 240, 300, pdf, accent)}
      <g transform="translate(320,60)">
        <rect width="280" height="300" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="16" y="28" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#1E293B">Recipients</text>
        <rect x="16" y="44" width="248" height="44" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <circle cx="36" cy="66" r="12" fill="${accent}"/>
        <text x="36" y="70" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" font-weight="700" fill="#FFF">A</text>
        <text x="58" y="62" font-family="system-ui,sans-serif" font-size="10" font-weight="600" fill="#1E293B">alex@client.com</text>
        <text x="58" y="76" font-family="system-ui,sans-serif" font-size="9" fill="#64748B">Pending signature</text>
        <rect x="16" y="100" width="248" height="44" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <circle cx="36" cy="122" r="12" fill="#10B981"/>
        <text x="36" y="126" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" font-weight="700" fill="#FFF">B</text>
        <text x="58" y="118" font-family="system-ui,sans-serif" font-size="10" font-weight="600" fill="#1E293B">you@cubsign.com</text>
        <text x="58" y="132" font-family="system-ui,sans-serif" font-size="9" fill="#059669">Signed</text>
        <rect x="16" y="260" width="248" height="32" rx="8" fill="${accent}"/>
        <text x="140" y="280" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#FFF">Send for signature</text>
      </g>
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/sign/editor', inner);
}

function sceneSecurity(accent) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#EFF6FF"/>
      <g transform="translate(200,80)">
        <path d="M120 20 L200 55 L200 140 C200 200 120 240 120 240 C120 240 40 200 40 140 L40 55 Z" fill="${accent}"/>
        <path d="M85 130 L110 155 L160 100" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      </g>
      <g transform="translate(420,120)">
        <rect width="180" height="200" rx="12" fill="#FFFFFF" stroke="#BFDBFE"/>
        <text x="16" y="28" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#1E293B">Security Center</text>
        <rect x="16" y="40" width="148" height="8" rx="4" fill="#DBEAFE"/>
        <rect x="16" y="56" width="120" height="6" rx="3" fill="#E0E7FF"/>
        <rect x="16" y="72" width="130" height="6" rx="3" fill="#E0E7FF"/>
        <rect x="16" y="100" width="148" height="28" rx="6" fill="#DCFCE7"/>
        <text x="24" y="118" font-family="system-ui,sans-serif" font-size="9" font-weight="600" fill="#166534">HTTPS active</text>
      </g>
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/security', inner);
}

function sceneAudit(accent, pdf) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#F8FAFC"/>
      <g transform="translate(60,70)">
        <rect width="520" height="300" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="20" y="32" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#1E293B">Audit trail: ${pdf}</text>
        <line x1="20" y1="44" x2="500" y2="44" stroke="#F1F5F9"/>
        <circle cx="32" cy="72" r="6" fill="${accent}"/>
        <text x="48" y="76" font-family="system-ui,sans-serif" font-size="10" fill="#334155">Document sent, Jun 12, 2:14 PM</text>
        <circle cx="32" cy="104" r="6" fill="#F59E0B"/>
        <text x="48" y="108" font-family="system-ui,sans-serif" font-size="10" fill="#334155">Viewed by recipient, Jun 12, 4:02 PM</text>
        <circle cx="32" cy="136" r="6" fill="#10B981"/>
        <text x="48" y="140" font-family="system-ui,sans-serif" font-size="10" fill="#334155">Signed, Jun 12, 4:18 PM</text>
        <circle cx="32" cy="168" r="6" fill="#6366F1"/>
        <text x="48" y="172" font-family="system-ui,sans-serif" font-size="10" fill="#334155">Downloaded, Jun 12, 4:19 PM</text>
      </g>
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/documents', inner);
}

function sceneMobile(accent, pdf) {
    return `
    ${BG}
    <g transform="translate(360,40)">
      <rect width="200" height="400" rx="24" fill="#1E293B"/>
      <rect x="12" y="12" width="176" height="376" rx="16" fill="#FFFFFF"/>
      <rect x="70" y="20" width="60" height="6" rx="3" fill="#E2E8F0"/>
      <text x="100" y="52" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" font-weight="600" fill="#64748B">cubsign.com</text>
      ${pdfDoc(28, 70, 144, 180, pdf, accent)}
      <rect x="28" y="270" width="144" height="36" rx="10" fill="${accent}"/>
      <text x="100" y="292" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="600" fill="#FFF">Sign document</text>
    </g>
    <text x="180" y="280" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="#1E293B">Sign from any phone</text>
    <text x="180" y="302" font-family="system-ui,sans-serif" font-size="11" fill="#64748B">No app install required</text>
    ${calloutBadge(180, 320, 'Rotate for drawing', accent)}
    `;
}

function sceneSignature(accent) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#F8FAFC"/>
      <g transform="translate(80,80)">
        <rect width="220" height="280" rx="12" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="16" y="28" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#1E293B">Draw</text>
        <rect x="16" y="40" width="188" height="100" rx="8" fill="#F8FAFC" stroke="#BFDBFE"/>
        <path d="M30 110 Q70 70 120 95 T180 80" fill="none" stroke="${accent}" stroke-width="3"/>
      </g>
      <g transform="translate(340,80)">
        <rect width="220" height="280" rx="12" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="16" y="28" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#1E293B">Type</text>
        <text x="16" y="100" font-family="Georgia,serif" font-size="28" font-style="italic" fill="#1E293B">Alex Morgan</text>
        <rect x="16" y="200" width="188" height="32" rx="8" fill="${accent}"/>
        <text x="110" y="220" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#FFF">Apply signature</text>
      </g>
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/sign/editor', inner);
}

function sceneTemplates(accent, pdf) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#F8FAFC"/>
      <g transform="translate(60,70)">
        <rect width="240" height="300" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="16" y="28" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#1E293B">Templates</text>
        <rect x="16" y="44" width="208" height="56" rx="8" fill="#EFF6FF" stroke="#BFDBFE"/>
        <text x="28" y="66" font-family="system-ui,sans-serif" font-size="10" font-weight="600" fill="#1D4ED8">NDA Template</text>
        <text x="28" y="82" font-family="system-ui,sans-serif" font-size="9" fill="#64748B">Fields saved</text>
        <rect x="16" y="112" width="208" height="56" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
        <text x="28" y="134" font-family="system-ui,sans-serif" font-size="10" font-weight="600" fill="#1E293B">Offer Letter</text>
        <text x="28" y="150" font-family="system-ui,sans-serif" font-size="9" fill="#64748B">3 signature slots</text>
      </g>
      ${pdfDoc(340, 100, 200, 260, pdf, accent)}
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/templates', inner);
}

function sceneRecipients(accent, pdf) {
    return sceneRequest(accent, pdf);
}

function sceneCompare(accent, pdf) {
    const inner = `
      <rect x="0" y="36" width="640" height="384" fill="#F8FAFC"/>
      ${pdfDoc(50, 80, 200, 260, pdf, accent)}
      ${pdfDoc(390, 80, 200, 260, 'Certificate.pdf', '#4F46E5')}
      <g transform="translate(280,180)">
        <circle cx="40" cy="40" r="36" fill="#FFFFFF" stroke="${accent}" stroke-width="3"/>
        <text x="40" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="${accent}">vs</text>
      </g>
    `;
    return browserChrome(40, 50, 640, 420, 'cubsign.com/blog', inner);
}

const sceneBuilders = {
    upload: sceneUpload,
    editor: sceneEditor,
    request: sceneRequest,
    security: sceneSecurity,
    audit: sceneAudit,
    mobile: sceneMobile,
    signature: sceneSignature,
    templates: sceneTemplates,
    recipients: sceneRecipients,
    compare: sceneCompare,
};

export function workflowIllustration(slug) {
    const v = articleVariants[slug] ?? articleVariants['how-to-sign-a-pdf-online'];
    const inner = `
      ${BG}
      <text x="480" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="#1E293B">CubSign workflow</text>
      ${workflowRow(v.workflow, 120, v.accent)}
      ${pdfDoc(380, 380, 200, 120, v.pdf, v.accent)}
    `;
    return wrapAssetSvg(inner, `CubSign workflow diagram for ${slug.replace(/-/g, ' ')}`);
}

export function uiIllustration(slug) {
    const v = articleVariants[slug] ?? articleVariants['how-to-sign-a-pdf-online'];
    const builder = sceneBuilders[v.scene] ?? sceneUpload;
    const inner = builder(v.accent, v.pdf);
    return wrapAssetSvg(inner, `CubSign interface screenshot for ${slug.replace(/-/g, ' ')}`);
}

export const articleAssetIllustrations = {};

for (const slug of BLOG_ASSET_SLUGS) {
    articleAssetIllustrations[`${slug}-workflow`] = workflowIllustration(slug);
    articleAssetIllustrations[`${slug}-ui`] = uiIllustration(slug);
}

export const BLOG_ASSET_KEYS = BLOG_ASSET_SLUGS.flatMap((slug) => [`${slug}-workflow`, `${slug}-ui`]);
