/** Default marketing Open Graph illustration — 1200×630, CubSign blue/white brand. */

export function defaultOgSvg() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="CubSign — Sign PDF Online">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EFF6FF"/>
      <stop offset="55%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <filter id="cardShadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#1E3A5F" flood-opacity="0.10"/>
    </filter>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#2563EB"/>
    </marker>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1080" cy="80" r="120" fill="#BFDBFE" opacity="0.35"/>
  <circle cx="120" cy="560" r="90" fill="#DBEAFE" opacity="0.45"/>

  <!-- Logo -->
  <g transform="translate(72,56) scale(1.35)">
    <g transform="translate(10, 10)">
      <path d="M7 5.5H19.5L23.5 9.5V26.5H7V5.5Z" stroke="#0A1628" stroke-width="2" stroke-linejoin="round"/>
      <path d="M19.5 5.5V9.5H23.5" stroke="#0A1628" stroke-width="2" stroke-linejoin="round"/>
      <path d="M11.5 17.5L14.5 20.5L20.5 13.5" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <line x1="46" y1="10" x2="46" y2="42" stroke="#CBD5E1" stroke-width="1"/>
    <text x="54" y="31" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="18" font-weight="700">
      <tspan fill="#0A1628">Cub</tspan><tspan fill="#2563EB">Sign</tspan>
    </text>
  </g>

  <!-- Copy -->
  <text x="72" y="210" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="58" font-weight="800" fill="#0F172A" letter-spacing="-1.5">Sign PDF Online</text>
  <text x="72" y="262" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="26" font-weight="600" fill="#2563EB" letter-spacing="0.5">Fast • Secure • Free</text>

  <!-- Workflow: PDF → Signature → Download -->
  <g transform="translate(72,320)">
    <!-- Step 1: PDF -->
    <g filter="url(#cardShadow)">
      <rect width="200" height="220" rx="20" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
      <rect x="28" y="36" width="144" height="10" rx="5" fill="#DBEAFE"/>
      <rect x="28" y="56" width="120" height="7" rx="3.5" fill="#E2E8F0"/>
      <rect x="28" y="72" width="132" height="7" rx="3.5" fill="#E2E8F0"/>
      <rect x="28" y="88" width="108" height="7" rx="3.5" fill="#E2E8F0"/>
      <rect x="28" y="120" width="144" height="56" rx="12" fill="#EFF6FF" stroke="#BFDBFE"/>
      <text x="100" y="154" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#2563EB">PDF</text>
      <text x="100" y="200" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#64748B">Upload</text>
    </g>

    <path d="M220 110 L268 110" stroke="#2563EB" stroke-width="3" marker-end="url(#arrow)"/>

    <!-- Step 2: Signature -->
    <g transform="translate(288,0)" filter="url(#cardShadow)">
      <rect width="200" height="220" rx="20" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
      <rect x="28" y="36" width="144" height="10" rx="5" fill="#DBEAFE"/>
      <rect x="28" y="56" width="120" height="7" rx="3.5" fill="#E2E8F0"/>
      <rect x="28" y="88" width="144" height="80" rx="12" fill="#F8FAFC" stroke="#DBEAFE"/>
      <path d="M48 148 Q78 118 108 138 T168 122" fill="none" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
      <text x="100" y="200" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#64748B">Signature</text>
    </g>

    <path d="M508 110 L556 110" stroke="#2563EB" stroke-width="3" marker-end="url(#arrow)"/>

    <!-- Step 3: Download -->
    <g transform="translate(576,0)" filter="url(#cardShadow)">
      <rect width="200" height="220" rx="20" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
      <rect x="28" y="36" width="144" height="10" rx="5" fill="#DBEAFE"/>
      <rect x="28" y="56" width="120" height="7" rx="3.5" fill="#E2E8F0"/>
      <circle cx="100" cy="128" r="40" fill="#DCFCE7"/>
      <path d="M82 128 L94 140 L118 116" fill="none" stroke="#16A34A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="100" y="200" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#64748B">Download</text>
    </g>
  </g>

  <!-- Accent bar -->
  <rect x="72" y="580" width="180" height="6" rx="3" fill="url(#accent)"/>
</svg>`;
}
