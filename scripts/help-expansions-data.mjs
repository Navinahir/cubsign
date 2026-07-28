/**
 * Extra unique paragraphs/sections for Help articles under ~450 words.
 * Merged by generate-help-content.mjs before write.
 */
export const helpExpansions = {
    'email-verification': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Never forward a verification link to someone else. The link proves control of your inbox. Treat it like a password reset. If you did not create a CubSign account and receive a verification email, ignore it and contact support from the Contact page so we can investigate misuse of your address.' },
        { type: 'p', text: 'After verifying, keep your email address current in account settings. An outdated address blocks password resets and signing notifications, which is almost as disruptive as never verifying at all.' },
        { type: 'tip', text: 'If you use Google Login, you typically skip a separate CubSign verification step because Google already confirmed the address.' },
    ],
    'maximum-upload-size': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Only use trusted compression tools when reducing a PDF. Avoid uploading confidential contracts to unknown free converter sites. Prefer desktop tools you control, or re-export from the original app at a lower image quality.' },
        { type: 'p', text: 'After compressing, open the PDF and confirm text is still readable and signature lines are intact. A file that uploads but cannot be read is not a success.' },
        { type: 'note', text: 'If uploads fail under 25 MB, the cause is often network instability or a password-protected file. See Troubleshooting Upload Errors.' },
    ],
    'browser-compatibility': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Keep your browser updated. Outdated browsers miss security patches and may break the signing editor. Prefer the latest stable Chrome, Edge, Firefox, or Safari on a device you control.' },
        { type: 'p', text: 'Avoid signing highly sensitive documents in shared kiosk browsers or public computers. Even with HTTPS, session leftovers on a shared machine are an unnecessary risk.' },
        { type: 'tip', text: 'If the editor looks broken, try a private/incognito window to rule out extension conflicts, then retry from the Upload PDF page.' },
    ],
    'secure-storage': [
        { type: 'h2', text: 'Putting storage hygiene into practice' },
        { type: 'p', text: 'CubSign encrypts stored PDFs, but you still choose where downloads live afterward. Move executed files out of personal Downloads into an access-controlled folder your team agrees on.' },
        { type: 'ul', items: [
            'Use strong, unique passwords for your CubSign account.',
            'Sign out on shared devices after finishing.',
            'Limit who has workspace access when teammates leave.',
            'Prefer CubSign links over emailing editable drafts broadly.',
        ]},
        { type: 'note', text: 'For a broader security overview, read Document Privacy and Audit Trail in this Help Center, and How Secure Are Electronic Signatures? on the CubSign Blog.' },
    ],
    'supported-file-types': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Convert documents on a machine you trust. Do not upload confidential Word files to untrusted online converters. Use Save as PDF in Word, Google Docs, or LibreOffice whenever possible.' },
        { type: 'p', text: 'After conversion, skim the PDF for missing pages, broken fonts, or layout shifts before you place signature fields. Fix the source file first if anything looks wrong.' },
        { type: 'tip', text: 'Signature images (PNG/JPG) are separate from document uploads. See Upload Your Signature Image for that flow.' },
    ],
    'delete-documents': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Deleting a document from CubSign removes it from your workspace according to product behavior, but copies you already downloaded still exist on your devices and in email. Treat deletion as workspace cleanup, not a guarantee that every historical copy is gone.' },
        { type: 'p', text: 'Before deleting, confirm no pending recipients still need the signing link. Prefer completing or voiding active requests intentionally rather than surprising signers with a dead link.' },
        { type: 'note', text: 'If you need help confirming what was deleted, reach us from the Contact page with the document name and approximate date.' },
    ],
    'mobile-support': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'On mobile, prefer a private network for sensitive agreements when possible. CubSign uses HTTPS, but public Wi-Fi and borrowed phones add avoidable risk. Download the finished PDF into a files location you control, not only a chat app’s temporary storage.' },
        { type: 'p', text: 'Use your device passcode or biometrics so a lost phone does not expose open signing sessions. Sign out of CubSign on shared tablets after you finish.' },
        { type: 'tip', text: 'Landscape mode plus a typed signature usually produces the cleanest mobile result. See Draw vs Type Signature for trade-offs.' },
    ],
    'create-your-cubsign-account': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Choose a unique password you do not reuse on other sites, or use Google Login to avoid managing a separate CubSign password. Enable whatever device-level protections you already use for email, because your inbox receives signing links and resets.' },
        { type: 'p', text: 'After creating an account, verify your email promptly so notifications and recovery options work. Then try a low-risk PDF on the Upload PDF page before sending customer contracts.' },
        { type: 'note', text: 'Early Access is free while we improve CubSign with real feedback. Explore the Features page to see what is available today.' },
    ],
    'upload-your-signature-image': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Keep signature image files in a private folder. Do not post them publicly or share your CubSign login so others can apply your mark. If your legal name changes, replace the image instead of reusing an outdated one.' },
        { type: 'p', text: 'Prefer a transparent PNG with high contrast so the signature sits cleanly on the page without a gray scan background.' },
    ],
    'download-signed-pdf': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Download promptly and store the file in an access-controlled location. A signed PDF left in a shared Downloads folder or chat cache is easier to misplace or expose than one filed intentionally.' },
        { type: 'tip', text: 'Name files with counterpart and date so renewals and audits find them quickly.' },
    ],
    'reset-password': [
        { type: 'h2', text: 'Security considerations' },
        { type: 'p', text: 'Use the official CubSign reset flow only. Ignore unexpected password emails, and never share a reset link. Choose a new password you do not reuse elsewhere, or switch to Google Login to reduce password risk.' },
        { type: 'note', text: 'If reset emails do not arrive, check spam and confirm the address on the account. See Email Verification and Contact Support if you remain locked out.' },
    ],
    'electronic-signature-legality': [
        { type: 'h2', text: 'Practical next steps' },
        { type: 'p', text: 'For everyday commercial PDFs, use a clear electronic signing process in CubSign, keep the final file, and retain activity context when your process requires it. Escalate special document types, such as wills, certain real-estate filings, notarizations, to qualified counsel in your jurisdiction.' },
        { type: 'note', text: 'This Help article is educational, not legal advice. Read Are Electronic Signatures Legally Binding? on the CubSign Blog for a deeper overview.' },
    ],
    'contact-support': [
        { type: 'h2', text: 'What helps us respond faster' },
        { type: 'ul', items: [
            'Your account email and approximate time of the issue.',
            'Browser and device (for example Chrome on Windows, Safari on iPhone).',
            'Document name and whether you were uploading, signing, or downloading.',
            'Screenshots of any error message (without sensitive contract text if possible).',
        ]},
        { type: 'tip', text: 'Check the Help Center and Troubleshooting Upload Errors first. Many fixes are one checklist away.' },
    ],
};
