/**
 * Generate favicon, PWA, and apple-touch assets from resources/brand/icon.svg.
 * Run: npm run generate:brand
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import toIco from 'to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, '../resources/brand');
const publicDir = path.join(__dirname, '../public');
const iconsDir = path.join(publicDir, 'icons');

const iconSvg = fs.readFileSync(path.join(brandDir, 'icon.svg'), 'utf8');
const logoSvg = fs.readFileSync(path.join(brandDir, 'logo.svg'), 'utf8');

fs.mkdirSync(iconsDir, { recursive: true });

fs.copyFileSync(path.join(brandDir, 'logo.svg'), path.join(publicDir, 'logo.svg'));
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);

async function renderPng(size) {
    return sharp(Buffer.from(iconSvg), { density: Math.max(72, Math.round(size * 4)) })
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toBuffer();
}

const sizes = [16, 32, 48, 64, 180, 192, 512];
const pngBuffers = {};

for (const size of sizes) {
    const buffer = await renderPng(size);
    pngBuffers[size] = buffer;

    if ([192, 512].includes(size)) {
        const outPath = path.join(iconsDir, `icon-${size}.png`);
        fs.writeFileSync(outPath, buffer);
        console.log(`✓ Wrote ${outPath}`);
    }
}

const appleTouchPath = path.join(publicDir, 'apple-touch-icon.png');
fs.writeFileSync(appleTouchPath, pngBuffers[180]);
console.log(`✓ Wrote ${appleTouchPath}`);

const faviconIco = await toIco([pngBuffers[16], pngBuffers[32], pngBuffers[48]]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconIco);
console.log('✓ Wrote public/favicon.ico');

console.log('✓ Wrote public/logo.svg');
console.log('✓ Wrote public/favicon.svg');
