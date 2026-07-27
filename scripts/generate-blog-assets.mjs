/**
 * Generate optimized WebP + PNG in-article blog assets from vector illustrations.
 * Run: npm run generate:blog-assets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { BLOG_ASSET_KEYS, articleAssetIllustrations } from '../resources/js/Components/Blog/assets/illustrations.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images/blog/assets');

fs.mkdirSync(outDir, { recursive: true });

const WIDTH = 960;
const HEIGHT = 540;

let totalWebp = 0;
let totalPng = 0;

for (const key of BLOG_ASSET_KEYS) {
    const svg = articleAssetIllustrations[key];
    if (!svg) {
        console.warn(`Missing illustration for: ${key}`);
        continue;
    }

    const svgBuffer = Buffer.from(svg);
    const webpPath = path.join(outDir, `${key}.webp`);
    const pngPath = path.join(outDir, `${key}.png`);

    await sharp(svgBuffer, { density: 96 })
        .resize(WIDTH, HEIGHT)
        .webp({ quality: 82, effort: 6 })
        .toFile(webpPath);

    await sharp(svgBuffer, { density: 96 })
        .resize(WIDTH, HEIGHT)
        .png({ compressionLevel: 9, palette: false })
        .toFile(pngPath);

    totalWebp += fs.statSync(webpPath).size;
    totalPng += fs.statSync(pngPath).size;

    console.log(`✓ ${key}`);
}

console.log(`\nGenerated ${BLOG_ASSET_KEYS.length} assets in ${outDir}`);
console.log(`Total WebP: ${(totalWebp / 1024).toFixed(1)} KB | Total PNG: ${(totalPng / 1024).toFixed(1)} KB`);
