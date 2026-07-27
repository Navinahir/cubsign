/**
 * Generate optimized WebP + PNG blog cover images from vector illustrations.
 * Run: npm run generate:blog-covers
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import {
    BLOG_COVER_SLUGS,
    coverIllustrations,
    wrapCoverSvg,
} from '../resources/js/Components/Blog/covers/illustrations.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images/blog/covers');

fs.mkdirSync(outDir, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 675;

let totalWebp = 0;
let totalPng = 0;

for (const slug of BLOG_COVER_SLUGS) {
    const inner = coverIllustrations[slug];
    if (!inner) {
        console.warn(`Missing illustration for: ${slug}`);
        continue;
    }

    const svg = wrapCoverSvg(inner, slug);
    const svgBuffer = Buffer.from(svg);

    const webpPath = path.join(outDir, `${slug}.webp`);
    const pngPath = path.join(outDir, `${slug}.png`);

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

    console.log(`✓ ${slug}`);
}

console.log(`\nGenerated ${BLOG_COVER_SLUGS.length} covers in ${outDir}`);
console.log(`Total WebP: ${(totalWebp / 1024).toFixed(1)} KB | Total PNG: ${(totalPng / 1024).toFixed(1)} KB`);
