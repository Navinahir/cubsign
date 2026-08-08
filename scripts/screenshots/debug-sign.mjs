import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://127.0.0.1:8765';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (msg) => console.log('CONSOLE', msg.type(), msg.text()));
page.on('pageerror', (err) => console.log('PAGEERROR', err.message));
page.on('requestfailed', (req) => console.log('FAIL', req.url(), req.failure()?.errorText));

const res = await page.goto(`${BASE}/sign`, { waitUntil: 'networkidle', timeout: 60000 });
console.log('status', res?.status());
await page.waitForTimeout(3000);
console.log('title', await page.title());
const body = await page.locator('body').innerText().catch(() => '');
console.log('body text sample:', body.slice(0, 500));
const html = await page.content();
fs.writeFileSync('storage/app/demo/debug-sign.html', html);
await page.screenshot({ path: 'storage/app/demo/debug-sign.png', fullPage: true });
console.log('saved debug files');
await browser.close();
