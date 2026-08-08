/**
 * Insert real product-screenshot blocks into selected Help and Blog articles.
 * Idempotent: skips if a product-screenshot with the same key already exists nearby.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const require = createRequire(import.meta.url);

// Dynamic import of ESM constants via transform is awkward; parse JS with Function.
async function loadExport(relPath, exportName) {
    const abs = path.join(ROOT, relPath).replace(/\\/g, '/');
    const mod = await import(`file:///${abs}`);
    return mod[exportName];
}

function shot(key, caption) {
    return { type: 'product-screenshot', key, ...(caption ? { caption } : {}) };
}

function insertAfter(content, predicate, blocks) {
    const idx = content.findIndex(predicate);
    if (idx === -1) return false;
    // Skip if any of these keys already present in article
    const keys = new Set(blocks.map((b) => b.key));
    if (content.some((b) => b.type === 'product-screenshot' && keys.has(b.key))) {
        return false;
    }
    content.splice(idx + 1, 0, ...blocks);
    return true;
}

function insertNearText(content, textIncludes, blocks, position = 'after') {
    const idx = content.findIndex(
        (b) =>
            (b.type === 'p' || b.type === 'h2' || b.type === 'tip' || b.type === 'note') &&
            typeof b.text === 'string' &&
            b.text.toLowerCase().includes(textIncludes.toLowerCase()),
    );
    if (idx === -1) return false;
    const keys = new Set(blocks.map((b) => b.key));
    if (content.some((b) => b.type === 'product-screenshot' && keys.has(b.key))) {
        return false;
    }
    content.splice(position === 'before' ? idx : idx + 1, 0, ...blocks);
    return true;
}

function ensureShots(article, insertions) {
    let changed = false;
    for (const ins of insertions) {
        if (ins.afterHeading) {
            if (
                insertAfter(
                    article.content,
                    (b) => b.type === 'h2' && b.text?.toLowerCase().includes(ins.afterHeading.toLowerCase()),
                    ins.blocks,
                )
            ) {
                changed = true;
                continue;
            }
        }
        if (ins.afterText) {
            if (insertNearText(article.content, ins.afterText, ins.blocks, 'after')) {
                changed = true;
                continue;
            }
        }
        // Fallback: append after first paragraph
        if (!article.content.some((b) => b.type === 'product-screenshot' && ins.blocks.some((x) => x.key === b.key))) {
            const pIdx = article.content.findIndex((b) => b.type === 'p');
            if (pIdx !== -1) {
                article.content.splice(pIdx + 1, 0, ...ins.blocks);
                changed = true;
            }
        }
    }
    return changed;
}

const HELP_PLAN = {
    'how-to-upload-a-pdf': [
        { afterHeading: 'upload', blocks: [shot('pdf-upload')] },
    ],
    'how-to-sign-a-pdf-online': [
        { afterText: 'upload', blocks: [shot('pdf-upload')] },
        { afterText: 'editor', blocks: [shot('signing-editor')] },
        { afterText: 'signature', blocks: [shot('draw-signature')] },
        { afterText: 'place', blocks: [shot('signature-placement')] },
        { afterText: 'download', blocks: [shot('signed-pdf-download')] },
    ],
    'draw-vs-type-signature': [
        { afterText: 'draw', blocks: [shot('draw-signature')] },
        { afterText: 'type', blocks: [shot('type-signature')] },
        { afterText: 'upload', blocks: [shot('upload-signature')] },
    ],
    'upload-your-signature-image': [
        { afterText: 'upload', blocks: [shot('upload-signature')] },
    ],
    'download-signed-pdf': [
        { afterText: 'download', blocks: [shot('signed-pdf-download')] },
    ],
    'mobile-support': [
        { afterText: 'sign', blocks: [shot('signing-editor', 'CubSign signing editor — works in modern mobile browsers.')] },
    ],
};

const BLOG_PLAN = {
    'how-to-sign-a-pdf-online': [
        { afterText: 'upload', blocks: [shot('pdf-upload')] },
        { afterText: 'editor', blocks: [shot('signing-editor')] },
        { afterText: 'signature', blocks: [shot('signature-placement')] },
        { afterText: 'download', blocks: [shot('signed-pdf-download')] },
    ],
    'how-to-sign-pdfs-on-mobile': [
        { afterText: 'browser', blocks: [shot('signing-editor', 'CubSign editor in the browser — usable on phones and tablets.')] },
        { afterText: 'draw', blocks: [shot('draw-signature')] },
    ],
    'draw-vs-type-your-signature': [
        { afterText: 'draw', blocks: [shot('draw-signature')] },
        { afterText: 'type', blocks: [shot('type-signature')] },
        { afterText: 'upload', blocks: [shot('upload-signature')] },
    ],
    'how-to-create-a-reusable-signature': [
        // Per-session signature creation only — not a persistent vault
        { afterText: 'draw', blocks: [shot('draw-signature')] },
        { afterText: 'type', blocks: [shot('type-signature')] },
        { afterText: 'upload', blocks: [shot('upload-signature')] },
    ],
    'electronic-signature-vs-digital-signature': [
        { afterText: 'CubSign', blocks: [shot('signing-editor', 'CubSign captures electronic signatures in the browser editor.')] },
    ],
    'best-practices-for-signing-contracts-online': [
        { afterText: 'review', blocks: [shot('signature-placement')] },
        { afterText: 'download', blocks: [shot('signed-pdf-download')] },
    ],
    'how-small-businesses-save-time-using-esignatures': [
        { afterText: 'upload', blocks: [shot('pdf-upload')] },
        { afterText: 'sign', blocks: [shot('signature-placement')] },
    ],
};

function serializeArticles(articles, varName) {
    // Keep readable enough JSON-ish JS
    return `export const ${varName} = ${JSON.stringify(articles, null, 4)};\n`;
}

async function patchHelp() {
    const helpPath = path.join(ROOT, 'resources/js/constants/help.js');
    let source = fs.readFileSync(helpPath, 'utf8');
    const { helpArticles } = await import(`file:///${helpPath.replace(/\\/g, '/')}?t=${Date.now()}`);

    let changedCount = 0;
    for (const article of helpArticles) {
        const plan = HELP_PLAN[article.slug];
        if (!plan) continue;
        // Limit to max 4 screenshots per article to avoid clutter
        const limited = [];
        const seen = new Set();
        for (const ins of plan) {
            for (const b of ins.blocks) {
                if (seen.has(b.key)) continue;
                seen.add(b.key);
                limited.push({ ...ins, blocks: [b] });
                if (seen.size >= 4) break;
            }
            if (seen.size >= 4) break;
        }
        if (ensureShots(article, limited.length ? limited : plan)) changedCount += 1;
    }

    // Rewrite only the helpArticles array by regenerating from module is hard;
    // instead surgically insert JSON blocks into source using markers.
    // Simpler approach: write a sidecar that merges at runtime — but Help loads from help.js.
    // We'll rewrite helpArticles via a node script that replaces the export.

    return { helpArticles, changedCount, helpPath, source };
}

async function main() {
    const helpPath = path.join(ROOT, 'resources/js/constants/help.js');
    const blogPath = path.join(ROOT, 'resources/js/constants/blog.js');

    const helpMod = await import(`file:///${helpPath.replace(/\\/g, '/')}?v=${Date.now()}`);
    const blogMod = await import(`file:///${blogPath.replace(/\\/g, '/')}?v=${Date.now()}`);

    const helpArticles = helpMod.helpArticles;
    const blogPosts = blogMod.blogPosts;

    const helpChanged = [];
    for (const article of helpArticles) {
        const plan = HELP_PLAN[article.slug];
        if (!plan) continue;
        // Deduplicate keys across plan
        const unique = [];
        const seen = new Set(article.content.filter((b) => b.type === 'product-screenshot').map((b) => b.key));
        for (const ins of plan) {
            const blocks = ins.blocks.filter((b) => !seen.has(b.key));
            blocks.forEach((b) => seen.add(b.key));
            if (blocks.length) unique.push({ ...ins, blocks });
        }
        if (unique.length && ensureShots(article, unique.slice(0, 5))) {
            helpChanged.push(article.slug);
        }
    }

    const blogChanged = [];
    for (const post of blogPosts) {
        const plan = BLOG_PLAN[post.slug];
        if (!plan) continue;
        const unique = [];
        const seen = new Set(post.content.filter((b) => b.type === 'product-screenshot').map((b) => b.key));
        for (const ins of plan) {
            const blocks = ins.blocks.filter((b) => !seen.has(b.key));
            blocks.forEach((b) => seen.add(b.key));
            if (blocks.length) unique.push({ ...ins, blocks });
        }
        if (unique.length && ensureShots(post, unique.slice(0, 4))) {
            blogChanged.push(post.slug);
        }
    }

    // Persist by rewriting exports while preserving other exports.
    // Strategy: write patched arrays to temporary JSON and use a small rewriter.
    const helpJson = path.join(ROOT, 'storage/app/demo/help-articles.patched.json');
    const blogJson = path.join(ROOT, 'storage/app/demo/blog-posts.patched.json');
    fs.writeFileSync(helpJson, JSON.stringify(helpArticles, null, 2));
    fs.writeFileSync(blogJson, JSON.stringify(blogPosts, null, 2));

    rewriteExportArray(helpPath, 'helpArticles', helpArticles);
    rewriteExportArray(blogPath, 'blogPosts', blogPosts);

    console.log('Help articles updated:', helpChanged.join(', ') || '(none)');
    console.log('Blog posts updated:', blogChanged.join(', ') || '(none)');
}

function rewriteExportArray(filePath, exportName, data) {
    let source = fs.readFileSync(filePath, 'utf8');
    const startRe = new RegExp(`export const ${exportName}\\s*=\\s*\\[`);
    const startMatch = source.match(startRe);
    if (!startMatch) throw new Error(`Could not find export const ${exportName}`);
    const startIdx = startMatch.index;
    // Find matching closing ]; for the array starting at first [
    const arrayStart = source.indexOf('[', startIdx);
    let depth = 0;
    let endIdx = -1;
    let inStr = null;
    let escape = false;
    for (let i = arrayStart; i < source.length; i++) {
        const ch = source[i];
        if (inStr) {
            if (escape) {
                escape = false;
                continue;
            }
            if (ch === '\\') {
                escape = true;
                continue;
            }
            if (ch === inStr) inStr = null;
            continue;
        }
        if (ch === '"' || ch === "'" || ch === '`') {
            inStr = ch;
            continue;
        }
        if (ch === '[') depth += 1;
        if (ch === ']') {
            depth -= 1;
            if (depth === 0) {
                endIdx = i + 1;
                break;
            }
        }
    }
    if (endIdx === -1) throw new Error(`Could not find end of ${exportName}`);
    // Skip optional semicolon
    let after = endIdx;
    if (source[after] === ';') after += 1;

    const serialized = `export const ${exportName} = ${stringifyJs(data)};`;
    source = source.slice(0, startIdx) + serialized + source.slice(after);
    fs.writeFileSync(filePath, source);
}

function stringifyJs(value, indent = 0) {
    const pad = '    '.repeat(indent);
    const pad1 = '    '.repeat(indent + 1);
    if (value === null) return 'null';
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
        if (!value.length) return '[]';
        const items = value.map((v) => pad1 + stringifyJs(v, indent + 1)).join(',\n');
        return `[\n${items},\n${pad}]`;
    }
    if (typeof value === 'object') {
        const keys = Object.keys(value);
        if (!keys.length) return '{}';
        const items = keys
            .map((k) => {
                const key = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : JSON.stringify(k);
                return `${pad1}${key}: ${stringifyJs(value[k], indent + 1)}`;
            })
            .join(',\n');
        return `{\n${items},\n${pad}}`;
    }
    return 'null';
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
