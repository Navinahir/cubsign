/**
 * Capture real CubSign product screenshots via Playwright.
 * Uses guest self-sign flow with a safe demo PDF.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createCanvas } = (() => {
    try {
        return require('canvas');
    } catch {
        return { createCanvas: null };
    }
})();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const OUT_DIR = path.join(ROOT, 'public/images/product');
const RAW_DIR = path.join(ROOT, 'storage/app/demo/screenshots-raw');
const DEMO_PDF = path.join(ROOT, 'storage/app/demo/cubsign-demo-agreement.pdf');
const BASE = process.env.CUBSIGN_BASE_URL || 'http://127.0.0.1:8765';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(RAW_DIR, { recursive: true });

async function makeSignaturePng() {
    const out = path.join(ROOT, 'storage/app/demo/demo-signature.png');
    // Transparent PNG with a simple ink-like scribble using sharp SVG
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120">
      <path d="M20 80 C60 20, 100 100, 140 50 S220 90, 280 40 S340 70, 380 55"
            fill="none" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(out);
    return out;
}

async function hideDevChrome(page) {
    await page.addStyleTag({
        content: `
          .fixed.bottom-4.right-4.z-\[9999\],
          .fixed.bottom-4.right-4,
          button[title="Dev tools"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        `,
    });
    await page.evaluate(() => {
        document.querySelectorAll('button[title="Dev tools"]').forEach((btn) => {
            const host = btn.closest('.fixed') || btn.parentElement;
            host?.remove();
        });
        document.querySelectorAll('.fixed.bottom-4.right-4').forEach((el) => el.remove());
    }).catch(() => {});
}

async function shot(page, name, options = {}) {
    const rawPath = path.join(RAW_DIR, `${name}.png`);
    await hideDevChrome(page);
    await page.waitForTimeout(400);
    await page.screenshot({
        path: rawPath,
        type: 'png',
        fullPage: false,
        animations: 'disabled',
        ...options,
    });
    const webpPath = path.join(OUT_DIR, `${name}.webp`);
    const pngPath = path.join(OUT_DIR, `${name}.png`);
    const meta = await sharp(rawPath).metadata();
    // Cap width at 1600 for web, keep readable quality
    let pipeline = sharp(rawPath);
    if ((meta.width || 0) > 1600) {
        pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
    }
    await pipeline.clone().webp({ quality: 82 }).toFile(webpPath);
    await pipeline.png({ compressionLevel: 9 }).toFile(pngPath);
    const webpStat = fs.statSync(webpPath);
    console.log(`✓ ${name}.webp (${(webpStat.size / 1024).toFixed(1)} KB) ${meta.width}x${meta.height}`);
    return { name, webpPath, pngPath, width: meta.width, height: meta.height };
}

async function waitForPdfCanvas(page) {
    // pdf.js canvas or page layers
    await page.waitForFunction(() => {
        const canvases = [...document.querySelectorAll('canvas')];
        return canvases.some((c) => c.width > 100 && c.height > 100);
    }, { timeout: 60000 });
    await page.waitForTimeout(1200);
}

async function main() {
    if (!fs.existsSync(DEMO_PDF)) {
        throw new Error(`Missing demo PDF at ${DEMO_PDF}`);
    }
    const sigPng = await makeSignaturePng();
    const results = [];

    const browser = await chromium.launch({
        headless: true,
        args: ['--disable-dev-shm-usage'],
    });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // 1) Upload screen
    await page.goto(`${BASE}/sign`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('text=Drop your PDF here', { timeout: 30000 });
    results.push(await shot(page, 'pdf-upload'));

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(DEMO_PDF);
    await page.waitForSelector('text=Open in Editor', { timeout: 15000 });
    // Optional: capture with file selected — skip to keep set small

    await page.getByRole('button', { name: /Open in Editor/i }).first().click();
    await page.waitForURL(/\/sign\/editor/, { timeout: 60000 });
    await waitForPdfCanvas(page);

    // 2) Signing editor overview
    results.push(await shot(page, 'signing-editor'));

    // Ensure Signature field / draw tab visible
    const drawTab = page.getByRole('button', { name: /^draw$/i });
    if (await drawTab.count()) {
        await drawTab.click();
    }

    // 3) Draw signature — scribble on canvas in the right panel
    const drawCanvas = page.locator('canvas.touch-none, canvas.block.w-full').first();
    await drawCanvas.waitFor({ state: 'visible', timeout: 15000 });
    const box = await drawCanvas.boundingBox();
    if (box) {
        await page.mouse.move(box.x + 30, box.y + box.height * 0.6);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.3, { steps: 12 });
        await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.7, { steps: 12 });
        await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.4, { steps: 12 });
        await page.mouse.up();
    }
    await page.waitForTimeout(300);
    results.push(await shot(page, 'draw-signature'));

    // Save drawn signature for later placement (we'll change methods first)
    const saveBtn = page.getByRole('button', { name: /Save Signature/i });
    // Switch to type before saving so we can capture type UI with empty/create state
    // Actually draw already has ink — capture type on Change after save, or clear and switch

    // 4) Type signature
    await page.getByRole('button', { name: /^type$/i }).click();
    await page.getByPlaceholder(/Your full name/i).fill('Demo User');
    await page.waitForTimeout(300);
    results.push(await shot(page, 'type-signature'));

    // 5) Upload signature
    await page.getByRole('button', { name: /^upload$/i }).click();
    const uploadInput = page.locator('input[type="file"][accept*="image"], input[type="file"]').last();
    // Find the signature upload input specifically
    const sigUpload = page.locator('input[type="file"]').filter({ has: page.locator('xpath=..') });
    // Prefer accept=image
    const imageInputs = page.locator('input[type="file"][accept*="image"]');
    if (await imageInputs.count()) {
        await imageInputs.first().setInputFiles(sigPng);
    } else {
        // Fallback: any remaining file input
        const inputs = page.locator('input[type="file"]');
        const n = await inputs.count();
        await inputs.nth(n - 1).setInputFiles(sigPng);
    }
    await page.waitForTimeout(500);
    results.push(await shot(page, 'upload-signature'));

    // Save uploaded signature, then place via manual mode (required before Review)
    if (await saveBtn.count()) {
        await saveBtn.click();
    } else {
        await page.getByRole('button', { name: /Save Signature/i }).click();
    }
    await page.waitForSelector('text=/Signature Saved|Place Manually|Place signature/i', { timeout: 10000 });
    await page.waitForTimeout(400);

    const placeManual = page.getByRole('button', { name: /Place Manually/i });
    const autoPlace = page.getByRole('button', { name: /Auto Place/i });
    if (await placeManual.count()) {
        await placeManual.click();
        await page.waitForTimeout(200);
        const allCanvas = page.locator('canvas');
        const count = await allCanvas.count();
        let placed = false;
        for (let i = 0; i < count; i++) {
            const c = allCanvas.nth(i);
            const b = await c.boundingBox();
            if (b && b.width > 300 && b.height > 300) {
                await page.mouse.click(b.x + b.width * 0.35, b.y + b.height * 0.72);
                placed = true;
                break;
            }
        }
        if (!placed && (await autoPlace.count())) {
            await autoPlace.click();
        }
    } else if (await autoPlace.count()) {
        await autoPlace.click();
    } else {
        throw new Error('No Place Manually / Auto Place controls after saving signature');
    }

    await page.waitForFunction(() => {
        return document.body.innerText.includes('field') && /Review Document/i.test(document.body.innerText);
    }, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(800);
    results.push(await shot(page, 'signature-placement'));

    const reviewBtn = page.getByRole('button', { name: /Review Document/i });
    await reviewBtn.waitFor({ state: 'visible', timeout: 10000 });
    // Ensure at least one field was placed so Review is enabled
    for (let attempt = 0; attempt < 3; attempt++) {
        if (await reviewBtn.isEnabled()) break;
        if (await autoPlace.count()) {
            await autoPlace.click();
            await page.waitForTimeout(600);
        } else if (await placeManual.count()) {
            await placeManual.click();
            const big = page.locator('canvas').filter({ hasNot: page.locator('xpath=ancestor::aside') });
            const box = await page.evaluate(() => {
                const canvases = [...document.querySelectorAll('canvas')];
                const c = canvases.find((el) => el.width > 300 && el.height > 300);
                if (!c) return null;
                const r = c.getBoundingClientRect();
                return { x: r.x + r.width * 0.4, y: r.y + r.height * 0.75 };
            });
            if (box) await page.mouse.click(box.x, box.y);
            await page.waitForTimeout(600);
        }
    }
    if (!(await reviewBtn.isEnabled())) {
        throw new Error('Review Document stayed disabled � signature field was not placed');
    }

    // Review → Complete
    await page.getByRole('button', { name: /Review Document/i }).click();
    await page.waitForURL(/\/sign\/review/, { timeout: 30000 });
    await page.waitForTimeout(500);

    const finish = page.getByRole('button', { name: /Finish Signing/i });
    await finish.click();
    await page.waitForURL(/\/sign\/complete/, { timeout: 60000 });
    await page.waitForSelector('text=/signed|Download/i', { timeout: 30000 });
    await page.waitForTimeout(600);
    results.push(await shot(page, 'signed-pdf-download'));

    await browser.close();

    const manifest = {
        capturedAt: new Date().toISOString(),
        baseUrl: BASE,
        shots: results.map((r) => ({
            name: r.name,
            webp: `/images/product/${r.name}.webp`,
            png: `/images/product/${r.name}.png`,
        })),
        skipped: [
            'send-signature — requires authenticated verified account + recipient send flow',
            'activity-history — requires authenticated workspace document with activity events',
        ],
    };
    fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('\nDone. Captured:', results.map((r) => r.name).join(', '));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
