/** Unique flat-vector blog cover illustrations — 1200×675 (16:9), CubSign blue/white palette. */

export const BLOG_COVER_SLUGS = [
    'how-to-sign-a-pdf-online',
    'electronic-signature-vs-digital-signature',
    'how-secure-are-electronic-signatures',
    'how-small-businesses-save-time-using-esignatures',
    'best-practices-for-signing-contracts-online',
    'how-to-protect-pdf-documents',
    'how-to-request-digital-signatures',
    'benefits-of-paperless-workflows',
    'how-to-sign-pdfs-on-mobile',
    'common-mistakes-when-signing-pdfs',
    'are-electronic-signatures-legally-binding',
    'securing-your-documents-with-cubsign',
    'request-signatures-from-multiple-recipients',
    'mobile-pdf-signing-tips',
    'introducing-cubsign-early-access',
    'what-is-an-audit-trail',
    'how-to-create-a-reusable-signature',
    'draw-vs-type-your-signature',
    'nda-signing-guide-for-startups',
    'freelancer-contract-signing-checklist',
];

const BG = `
  <rect width="1200" height="675" fill="#EFF6FF"/>
  <circle cx="1040" cy="90" r="130" fill="#DBEAFE" opacity="0.55"/>
  <circle cx="120" cy="590" r="100" fill="#BFDBFE" opacity="0.35"/>
`;

function doc(x, y, w, h, accent = '#2563EB') {
    return `
    <g transform="translate(${x},${y})">
      <rect width="${w}" height="${h}" rx="12" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="3"/>
      <rect x="24" y="28" width="${w - 48}" height="8" rx="4" fill="#DBEAFE"/>
      <rect x="24" y="48" width="${w - 80}" height="6" rx="3" fill="#E0E7FF"/>
      <rect x="24" y="64" width="${w - 100}" height="6" rx="3" fill="#E0E7FF"/>
      <rect x="24" y="80" width="${w - 60}" height="6" rx="3" fill="#E0E7FF"/>
      <path d="M${w - 70} ${h - 50} Q${w - 90} ${h - 30} ${w - 110} ${h - 50} Q${w - 95} ${h - 65} ${w - 70} ${h - 50}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    </g>`;
}

export const coverIllustrations = {
    'how-to-sign-a-pdf-online': `
      ${BG}
      ${doc(380, 140, 280, 360)}
      <g transform="translate(720,220)">
        <rect width="200" height="120" rx="14" fill="#2563EB"/>
        <path d="M40 75 Q70 45 100 70 T160 60" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
        <circle cx="165" cy="55" r="8" fill="#FFFFFF" opacity="0.9"/>
      </g>
      <path d="M660 300 L720 280" stroke="#2563EB" stroke-width="3" stroke-dasharray="8 6" opacity="0.5"/>
    `,

    'electronic-signature-vs-digital-signature': `
      ${BG}
      ${doc(200, 160, 240, 320, '#3B82F6')}
      ${doc(760, 160, 240, 320, '#6366F1')}
      <g transform="translate(520,280)">
        <circle cx="80" cy="60" r="70" fill="#FFFFFF" stroke="#2563EB" stroke-width="4"/>
        <rect x="50" y="52" width="60" height="8" rx="4" fill="#2563EB"/>
        <rect x="65" y="68" width="30" height="8" rx="4" fill="#93C5FD"/>
      </g>
      <rect x="230" y="420" width="180" height="36" rx="18" fill="#DBEAFE"/>
      <rect x="790" y="420" width="180" height="36" rx="18" fill="#E0E7FF"/>
    `,

    'how-secure-are-electronic-signatures': `
      ${BG}
      ${doc(420, 180, 260, 340)}
      <g transform="translate(300,200)">
        <path d="M120 20 L200 55 L200 140 C200 200 120 240 120 240 C120 240 40 200 40 140 L40 55 Z" fill="#2563EB"/>
        <path d="M85 130 L110 155 L160 100" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <g transform="translate(750,250)" opacity="0.85">
        <rect width="120" height="120" rx="16" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <circle cx="60" cy="50" r="18" fill="#DBEAFE"/>
        <rect x="30" y="80" width="60" height="8" rx="4" fill="#BFDBFE"/>
        <rect x="20" y="96" width="80" height="6" rx="3" fill="#E0E7FF"/>
      </g>
    `,

    'how-small-businesses-save-time-using-esignatures': `
      ${BG}
      <rect x="180" y="420" width="840" height="12" rx="6" fill="#DBEAFE"/>
      <g transform="translate(200,180)">
        <rect width="180" height="220" rx="14" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="3"/>
        <circle cx="90" cy="70" r="36" fill="#DBEAFE"/>
        <rect x="40" y="130" width="100" height="8" rx="4" fill="#E0E7FF"/>
        <rect x="50" y="150" width="80" height="6" rx="3" fill="#E0E7FF"/>
      </g>
      <path d="M400 290 L480 290" stroke="#2563EB" stroke-width="4" marker-end="url(#arrow)"/>
      ${doc(500, 200, 200, 260)}
      <g transform="translate(760,200)">
        <circle cx="60" cy="60" r="50" fill="#2563EB"/>
        <path d="M40 60 L55 75 L85 45" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
        <rect x="20" y="140" width="80" height="8" rx="4" fill="#DBEAFE"/>
        <rect x="30" y="158" width="60" height="6" rx="3" fill="#E0E7FF"/>
      </g>
      <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/></marker></defs>
    `,

    'best-practices-for-signing-contracts-online': `
      ${BG}
      ${doc(340, 150, 300, 380)}
      <g transform="translate(700,180)">
        <rect width="220" height="300" rx="16" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <rect x="24" y="30" width="24" height="24" rx="6" fill="#2563EB"/>
        <path d="M30 42 L38 50 L48 36" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="60" y="36" width="120" height="10" rx="5" fill="#DBEAFE"/>
        <rect x="24" y="80" width="24" height="24" rx="6" fill="#2563EB"/>
        <path d="M30 92 L38 100 L48 86" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="60" y="86" width="100" height="10" rx="5" fill="#DBEAFE"/>
        <rect x="24" y="130" width="24" height="24" rx="6" stroke="#BFDBFE" stroke-width="2" fill="#FFFFFF"/>
        <rect x="60" y="136" width="110" height="10" rx="5" fill="#E0E7FF"/>
        <rect x="24" y="180" width="24" height="24" rx="6" stroke="#BFDBFE" stroke-width="2" fill="#FFFFFF"/>
        <rect x="60" y="186" width="90" height="10" rx="5" fill="#E0E7FF"/>
      </g>
    `,

    'how-to-protect-pdf-documents': `
      ${BG}
      ${doc(400, 140, 300, 400)}
      <g transform="translate(320,220)">
        <circle cx="80" cy="80" r="70" fill="#2563EB" opacity="0.15"/>
        <rect x="30" y="50" width="100" height="80" rx="12" fill="#2563EB"/>
        <path d="M55 50 L55 35 C55 20 105 20 105 35 L105 50" fill="none" stroke="#1D4ED8" stroke-width="6"/>
        <circle cx="80" cy="85" r="12" fill="#FFFFFF"/>
        <rect x="74" y="90" width="12" height="20" rx="4" fill="#FFFFFF"/>
      </g>
      <g transform="translate(780,280)" opacity="0.7">
        <circle cx="40" cy="40" r="35" fill="#DBEAFE"/>
        <path d="M25 40 L35 50 L55 30" fill="none" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
      </g>
    `,

    'how-to-request-digital-signatures': `
      ${BG}
      ${doc(280, 180, 260, 320)}
      <g transform="translate(620,200)">
        <rect width="280" height="200" rx="16" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <path d="M40 60 L140 60 L140 40 L240 100 L140 160 L140 140 L40 140 Z" fill="#2563EB"/>
        <circle cx="200" cy="60" r="28" fill="#DBEAFE"/>
        <rect x="40" y="100" width="160" height="8" rx="4" fill="#E0E7FF"/>
        <rect x="40" y="120" width="120" height="6" rx="3" fill="#E0E7FF"/>
      </g>
      <path d="M540 320 C580 300 600 280 620 300" fill="none" stroke="#2563EB" stroke-width="3" stroke-dasharray="10 8" opacity="0.6"/>
    `,

    'benefits-of-paperless-workflows': `
      ${BG}
      <g opacity="0.25" transform="translate(160,200)">
        <rect width="140" height="180" rx="8" fill="#94A3B8" transform="rotate(-8)"/>
        <rect width="140" height="180" rx="8" fill="#CBD5E1" transform="translate(20,10) rotate(4)"/>
      </g>
      <g transform="translate(400,160)">
        <rect width="480" height="320" rx="20" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="3"/>
        <rect x="30" y="30" width="420" height="50" rx="10" fill="#EFF6FF"/>
        <circle cx="55" cy="55" r="12" fill="#2563EB"/>
        <rect x="80" y="48" width="200" height="14" rx="7" fill="#DBEAFE"/>
        <rect x="30" y="110" width="180" height="100" rx="12" fill="#DBEAFE" opacity="0.5"/>
        <rect x="240" y="110" width="210" height="100" rx="12" fill="#E0E7FF" opacity="0.5"/>
        <path d="M80 260 L200 260 L240 230 L400 230" fill="none" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
        <circle cx="400" cy="230" r="10" fill="#2563EB"/>
      </g>
    `,

    'how-to-sign-pdfs-on-mobile': `
      ${BG}
      <g transform="translate(420,100)">
        <rect x="20" y="0" width="320" height="520" rx="36" fill="#1E3A5F"/>
        <rect x="36" y="24" width="288" height="472" rx="24" fill="#FFFFFF"/>
        <rect x="56" y="60" width="248" height="320" rx="8" fill="#EFF6FF"/>
        <rect x="76" y="90" width="180" height="8" rx="4" fill="#DBEAFE"/>
        <rect x="76" y="110" width="140" height="6" rx="3" fill="#E0E7FF"/>
        <path d="M100 380 Q140 350 180 370 T260 360" fill="none" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
        <circle cx="150" cy="500" r="28" fill="#2563EB"/>
        <path d="M138 500 L148 510 L165 490" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      </g>
    `,

    'common-mistakes-when-signing-pdfs': `
      ${BG}
      ${doc(380, 160, 280, 340)}
      <g transform="translate(720,200)">
        <circle cx="80" cy="80" r="70" fill="#FEF3C7" stroke="#F59E0B" stroke-width="4"/>
        <rect x="72" y="40" width="16" height="56" rx="8" fill="#D97706"/>
        <circle cx="80" cy="108" r="10" fill="#D97706"/>
      </g>
      <g transform="translate(300,420)">
        <rect width="200" height="14" rx="7" fill="#FECACA" opacity="0.8"/>
        <rect x="20" y="30" width="160" height="10" rx="5" fill="#FEE2E2" opacity="0.8"/>
      </g>
    `,

    'are-electronic-signatures-legally-binding': `
      ${BG}
      <g transform="translate(280,180)">
        <rect x="60" y="200" width="200" height="16" rx="8" fill="#64748B"/>
        <path d="M160 200 L160 80" stroke="#64748B" stroke-width="8"/>
        <path d="M80 80 L160 40 L240 80 L240 200 Z" fill="#2563EB" opacity="0.2" stroke="#2563EB" stroke-width="4"/>
        <circle cx="160" cy="120" r="50" fill="#FFFFFF" stroke="#2563EB" stroke-width="4"/>
        <rect x="130" y="100" width="60" height="50" rx="4" fill="#DBEAFE"/>
      </g>
      ${doc(580, 200, 280, 300)}
      <path d="M520 350 L580 350" stroke="#2563EB" stroke-width="3" opacity="0.5"/>
    `,

    'securing-your-documents-with-cubsign': `
      ${BG}
      <g transform="translate(340,140)">
        <ellipse cx="260" cy="380" rx="220" ry="40" fill="#DBEAFE" opacity="0.6"/>
        <rect x="80" y="120" width="360" height="240" rx="20" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <path d="M200 120 L200 80 C200 40 320 40 320 80 L320 120" fill="none" stroke="#2563EB" stroke-width="6"/>
        <rect x="120" y="160" width="280" height="160" rx="12" fill="#EFF6FF"/>
        <path d="M180 260 L220 300 L340 200" fill="none" stroke="#2563EB" stroke-width="8" stroke-linecap="round"/>
      </g>
      <g transform="translate(780,200)">
        <path d="M60 20 L100 35 L100 90 C100 130 60 150 60 150 C60 150 20 130 20 90 L20 35 Z" fill="#2563EB"/>
        <path d="M45 85 L55 95 L80 70" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      </g>
    `,

    'request-signatures-from-multiple-recipients': `
      ${BG}
      ${doc(440, 180, 320, 340)}
      <g transform="translate(200,220)">
        <circle cx="50" cy="50" r="40" fill="#2563EB"/><circle cx="50" cy="45" r="16" fill="#FFFFFF" opacity="0.9"/><path d="M20 85 Q50 65 80 85" fill="#1D4ED8"/>
      </g>
      <g transform="translate(200,380)">
        <circle cx="50" cy="50" r="40" fill="#3B82F6"/><circle cx="50" cy="45" r="16" fill="#FFFFFF" opacity="0.9"/><path d="M20 85 Q50 65 80 85" fill="#2563EB"/>
      </g>
      <g transform="translate(880,300)">
        <circle cx="50" cy="50" r="40" fill="#6366F1"/><circle cx="50" cy="45" r="16" fill="#FFFFFF" opacity="0.9"/><path d="M20 85 Q50 65 80 85" fill="#4F46E5"/>
      </g>
      <path d="M280 270 L440 300" stroke="#2563EB" stroke-width="2" opacity="0.4"/>
      <path d="M280 430 L440 380" stroke="#2563EB" stroke-width="2" opacity="0.4"/>
      <path d="M760 350 L880 350" stroke="#2563EB" stroke-width="2" opacity="0.4"/>
    `,

    'mobile-pdf-signing-tips': `
      ${BG}
      <g transform="translate(380,90)">
        <rect x="30" y="0" width="300" height="540" rx="32" fill="#1E40AF"/>
        <rect x="46" y="20" width="268" height="500" rx="22" fill="#FFFFFF"/>
        <rect x="66" y="80" width="228" height="300" rx="8" fill="#EFF6FF"/>
        <path d="M120 340 Q160 310 200 330" fill="none" stroke="#2563EB" stroke-width="4"/>
      </g>
      <g transform="translate(760,180)">
        <circle cx="40" cy="40" r="36" fill="#2563EB"/><rect x="28" y="34" width="24" height="12" rx="6" fill="#FFFFFF"/>
        <rect x="100" y="34" width="140" height="12" rx="6" fill="#DBEAFE"/>
        <circle cx="40" cy="110" r="36" fill="#3B82F6"/><rect x="28" y="104" width="24" height="12" rx="6" fill="#FFFFFF"/>
        <rect x="100" y="104" width="120" height="12" rx="6" fill="#DBEAFE"/>
        <circle cx="40" cy="180" r="36" fill="#6366F1"/><rect x="28" y="174" width="24" height="12" rx="6" fill="#FFFFFF"/>
        <rect x="100" y="174" width="130" height="12" rx="6" fill="#DBEAFE"/>
      </g>
    `,

    'introducing-cubsign-early-access': `
      ${BG}
      <g transform="translate(480,120)">
        <path d="M120 400 L120 200 L200 120 L280 200 L280 400 Z" fill="#FFFFFF" stroke="#93C5FD" stroke-width="4"/>
        <rect x="155" y="240" width="90" height="160" rx="8" fill="#DBEAFE"/>
        <circle cx="200" cy="180" r="24" fill="#2563EB"/>
      </g>
      <g transform="translate(620,80)">
        <path d="M0 80 L40 0 L80 80 Z" fill="#2563EB"/>
        <circle cx="200" cy="100" r="60" fill="#FDE68A" opacity="0.8"/>
        <path d="M200 60 L210 90 L245 90 L218 108 L228 138 L200 120 L172 138 L182 108 L155 90 L190 90 Z" fill="#F59E0B"/>
      </g>
      <rect x="340" y="500" width="520" height="16" rx="8" fill="#DBEAFE"/>
    `,

    'what-is-an-audit-trail': `
      ${BG}
      ${doc(680, 160, 260, 360)}
      <g transform="translate(200,180)">
        <line x1="80" y1="40" x2="80" y2="380" stroke="#93C5FD" stroke-width="4"/>
        <circle cx="80" cy="60" r="16" fill="#2563EB"/>
        <rect x="120" y="44" width="200" height="36" rx="8" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
        <rect x="130" y="54" width="120" height="8" rx="4" fill="#DBEAFE"/>
        <circle cx="80" cy="150" r="16" fill="#3B82F6"/>
        <rect x="120" y="134" width="220" height="36" rx="8" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
        <rect x="130" y="144" width="140" height="8" rx="4" fill="#DBEAFE"/>
        <circle cx="80" cy="240" r="16" fill="#6366F1"/>
        <rect x="120" y="224" width="180" height="36" rx="8" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
        <rect x="130" y="234" width="100" height="8" rx="4" fill="#DBEAFE"/>
        <circle cx="80" cy="330" r="16" fill="#2563EB"/>
        <rect x="120" y="314" width="200" height="36" rx="8" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
        <rect x="130" y="324" width="110" height="8" rx="4" fill="#DBEAFE"/>
      </g>
    `,

    'how-to-create-a-reusable-signature': `
      ${BG}
      <g transform="translate(280,160)">
        <rect width="200" height="140" rx="14" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <path d="M40 90 Q70 50 100 75 T160 65" fill="none" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
        <rect x="20" y="20" width="60" height="24" rx="6" fill="#DBEAFE"/>
      </g>
      <g transform="translate(520,160)">
        <rect width="200" height="140" rx="14" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <path d="M40 85 Q80 55 120 80 T180 70" fill="none" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
        <rect x="20" y="20" width="60" height="24" rx="6" fill="#DBEAFE"/>
      </g>
      <g transform="translate(760,160)">
        <rect width="200" height="140" rx="14" fill="#2563EB" stroke="#1D4ED8" stroke-width="3"/>
        <path d="M40 90 Q70 50 100 75 T160 65" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        <circle cx="170" cy="30" r="14" fill="#FFFFFF"/><path d="M164 30 L168 34 L178 24" fill="none" stroke="#2563EB" stroke-width="3"/>
      </g>
      <rect x="340" y="380" width="520" height="120" rx="16" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="3"/>
      <rect x="380" y="420" width="180" height="40" rx="10" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
      <path d="M400 445 Q430 425 460 440" fill="none" stroke="#2563EB" stroke-width="3"/>
    `,

    'draw-vs-type-your-signature': `
      ${BG}
      <g transform="translate(220,180)">
        <rect width="320" height="320" rx="20" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <path d="M60 220 Q120 140 180 200 T280 180" fill="none" stroke="#2563EB" stroke-width="6" stroke-linecap="round"/>
        <rect x="40" y="40" width="80" height="50" rx="10" fill="#DBEAFE"/>
        <path d="M55 75 L65 55 L75 70 L90 50" fill="none" stroke="#2563EB" stroke-width="3"/>
      </g>
      <g transform="translate(660,180)">
        <rect width="320" height="320" rx="20" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <path d="M70 220 Q120 180 170 210 T270 195" fill="none" stroke="#6366F1" stroke-width="5" stroke-linecap="round" opacity="0.35"/>
        <rect x="80" y="190" width="160" height="4" rx="2" fill="#C7D2FE"/>
        <rect x="100" y="205" width="120" height="4" rx="2" fill="#E0E7FF"/>
        <rect x="40" y="40" width="80" height="50" rx="10" fill="#E0E7FF"/>
        <rect x="52" y="58" width="56" height="6" rx="3" fill="#6366F1"/>
        <rect x="52" y="72" width="40" height="6" rx="3" fill="#93C5FD"/>
      </g>
      <rect x="560" y="300" width="80" height="80" rx="40" fill="#FFFFFF" stroke="#2563EB" stroke-width="4"/>
      <rect x="585" y="335" width="30" height="8" rx="4" fill="#2563EB"/>
      <rect x="595" y="350" width="10" height="8" rx="4" fill="#93C5FD"/>
    `,

    'nda-signing-guide-for-startups': `
      ${BG}
      ${doc(380, 140, 300, 400)}
      <g transform="translate(340,200)">
        <rect x="20" y="20" width="120" height="100" rx="12" fill="#2563EB"/>
        <path d="M50 50 L50 35 C50 25 110 25 110 35 L110 50" fill="none" stroke="#1D4ED8" stroke-width="5"/>
        <circle cx="80" cy="75" r="10" fill="#FFFFFF"/>
        <rect x="74" y="80" width="12" height="18" rx="3" fill="#FFFFFF"/>
      </g>
      <rect x="720" y="280" width="160" height="48" rx="24" fill="#FEE2E2" opacity="0.9"/>
      <rect x="740" y="296" width="120" height="16" rx="8" fill="#FCA5A5" opacity="0.6"/>
    `,

    'freelancer-contract-signing-checklist': `
      ${BG}
      ${doc(300, 150, 280, 360)}
      <g transform="translate(640,170)">
        <rect width="260" height="340" rx="18" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <rect x="28" y="36" width="28" height="28" rx="6" fill="#2563EB"/>
        <path d="M34 50 L40 56 L50 44" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="68" y="44" width="150" height="12" rx="6" fill="#DBEAFE"/>
        <rect x="28" y="88" width="28" height="28" rx="6" fill="#2563EB"/>
        <path d="M34 102 L40 108 L50 96" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="68" y="96" width="130" height="12" rx="6" fill="#DBEAFE"/>
        <rect x="28" y="140" width="28" height="28" rx="6" fill="#2563EB"/>
        <path d="M34 154 L40 160 L50 148" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <rect x="68" y="148" width="140" height="12" rx="6" fill="#DBEAFE"/>
        <rect x="28" y="192" width="28" height="28" rx="6" stroke="#BFDBFE" stroke-width="2" fill="#FFFFFF"/>
        <rect x="68" y="200" width="120" height="12" rx="6" fill="#E0E7FF"/>
        <rect x="28" y="244" width="28" height="28" rx="6" stroke="#BFDBFE" stroke-width="2" fill="#FFFFFF"/>
        <rect x="68" y="252" width="100" height="12" rx="6" fill="#E0E7FF"/>
      </g>
      <g transform="translate(200,400)">
        <circle cx="40" cy="40" r="36" fill="#2563EB"/>
        <circle cx="40" cy="34" r="14" fill="#FFFFFF"/>
        <path d="M16 62 Q40 48 64 62" fill="#1D4ED8"/>
      </g>
    `,
};

export function wrapCoverSvg(inner, slug) {
    const title = slug.replace(/-/g, ' ');
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" role="img" aria-label="${title}">
  ${inner}
</svg>`;
}

export function getCoverIllustration(slug) {
    return coverIllustrations[slug] ?? coverIllustrations['how-to-sign-a-pdf-online'];
}
