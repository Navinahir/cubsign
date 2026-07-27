/** Shared SVG primitives for CubSign blog article illustrations (960×540). */

export const VIEW_W = 960;
export const VIEW_H = 540;

export function escapeXml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export const BG = `
  <rect width="960" height="540" fill="#F8FAFC"/>
  <circle cx="860" cy="70" r="90" fill="#DBEAFE" opacity="0.5"/>
  <circle cx="80" cy="470" r="70" fill="#EFF6FF" opacity="0.7"/>
`;

export function wrapAssetSvg(inner, ariaLabel) {
    const label = escapeXml(ariaLabel);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" width="${VIEW_W}" height="${VIEW_H}" role="img" aria-label="${label}">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#2563EB"/>
    </marker>
    <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#1E3A5F" flood-opacity="0.08"/>
    </filter>
  </defs>
  ${inner}
</svg>`;
}

export function pdfDoc(x, y, w, h, label = '', accent = '#2563EB') {
    const safeLabel = escapeXml(label);
    const labelBlock = label
        ? `<rect x="16" y="14" width="${Math.min(label.length * 7 + 16, w - 32)}" height="20" rx="6" fill="#DBEAFE"/>
           <text x="24" y="28" font-family="system-ui,sans-serif" font-size="10" font-weight="600" fill="#1D4ED8">${safeLabel}</text>`
        : '';
    return `
    <g transform="translate(${x},${y})" filter="url(#shadow)">
      <rect width="${w}" height="${h}" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${labelBlock}
      <rect x="20" y="${label ? 44 : 28}" width="${w - 40}" height="6" rx="3" fill="#E2E8F0"/>
      <rect x="20" y="${label ? 58 : 42}" width="${w - 70}" height="5" rx="2.5" fill="#F1F5F9"/>
      <rect x="20" y="${label ? 70 : 54}" width="${w - 90}" height="5" rx="2.5" fill="#F1F5F9"/>
      <rect x="20" y="${label ? 82 : 66}" width="${w - 50}" height="5" rx="2.5" fill="#F1F5F9"/>
      <path d="M${w - 60} ${h - 36} Q${w - 80} ${h - 18} ${w - 100} ${h - 36} Q${w - 85} ${h - 50} ${w - 60} ${h - 36}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`;
}

export function browserChrome(x, y, w, h, url, inner) {
    const safeUrl = escapeXml(url);
    return `
    <g transform="translate(${x},${y})" filter="url(#shadow)">
      <rect width="${w}" height="${h}" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
      <rect width="${w}" height="36" rx="12" fill="#F8FAFC"/>
      <rect y="24" width="${w}" height="12" fill="#F8FAFC"/>
      <circle cx="20" cy="18" r="5" fill="#FCA5A5"/>
      <circle cx="38" cy="18" r="5" fill="#FCD34D"/>
      <circle cx="56" cy="18" r="5" fill="#86EFAC"/>
      <rect x="80" y="10" width="${w - 100}" height="16" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <text x="92" y="22" font-family="system-ui,sans-serif" font-size="9" fill="#64748B">${safeUrl}</text>
      ${inner}
    </g>`;
}

export function workflowRow(steps, y = 200, accent = '#2563EB') {
    const stepW = Math.min(200, Math.floor(760 / steps.length));
    const gap = 40;
    const startX = (960 - (steps.length * stepW + (steps.length - 1) * gap)) / 2;
    let svg = '';
    steps.forEach((step, i) => {
        const x = startX + i * (stepW + gap);
        const title = escapeXml(step.title);
        const sub = escapeXml(step.sub ?? '');
        svg += `
        <g transform="translate(${x},${y})">
          <circle cx="${stepW / 2}" cy="28" r="26" fill="${accent}"/>
          <text x="${stepW / 2}" y="34" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${i + 1}</text>
          <rect y="68" width="${stepW}" height="56" rx="10" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
          <text x="${stepW / 2}" y="92" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#1E293B">${title}</text>
          <text x="${stepW / 2}" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748B">${sub}</text>
        </g>`;
        if (i < steps.length - 1) {
            const ax = x + stepW + 8;
            svg += `<path d="M${ax} ${y + 28} L${ax + gap - 16} ${y + 28}" stroke="${accent}" stroke-width="2.5" marker-end="url(#arrow)"/>`;
        }
    });
    return svg;
}

export function calloutBadge(x, y, text, accent = '#2563EB') {
    const safe = escapeXml(text);
    return `
    <g transform="translate(${x},${y})">
      <rect width="${text.length * 7 + 24}" height="28" rx="14" fill="${accent}"/>
      <text x="12" y="19" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#FFFFFF">${safe}</text>
    </g>`;
}
