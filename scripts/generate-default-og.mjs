/**
 * Generate the default CubSign marketing Open Graph image (1200×630 PNG).
 * Run: npm run generate:og
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { defaultOgSvg } from './og/default-og.svg.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images/og');
const outPath = path.join(outDir, 'default-og.png');

fs.mkdirSync(outDir, { recursive: true });

const svgBuffer = Buffer.from(defaultOgSvg());

await sharp(svgBuffer, { density: 144 })
    .resize(1200, 630)
    .png({ compressionLevel: 9, palette: false })
    .toFile(outPath);

const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`✓ Wrote ${outPath} (${sizeKb} KB)`);
