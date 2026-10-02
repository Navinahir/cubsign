/** Returns true when a value has visible text after trimming. */
export function hasMarketingText(value) {
    if (value == null) return false;
    return String(value).trim().length > 0;
}

/**
 * Normalize blog content blocks for rendering.
 * Supports legacy flat blocks (p/h2/ul/…) and admin {type,data} blocks.
 * Skips empty paragraphs, headings, list items, and unknown block types.
 */
export function normalizeBlogBlocks(blocks) {
    if (!Array.isArray(blocks)) return [];

    const normalized = [];

    for (const raw of blocks) {
        if (!raw || typeof raw !== 'object' || !raw.type) continue;

        // Admin editor shape → public flat shape
        const block = raw.data && typeof raw.data === 'object'
            ? expandEditorBlock(raw)
            : raw;

        if (!block) continue;

        if (block.type === 'p' || block.type === 'h1' || block.type === 'h2' || block.type === 'h3' || block.type === 'h4' || block.type === 'h5' || block.type === 'h6' || block.type === 'tip' || block.type === 'note' || block.type === 'quote') {
            if (!hasMarketingText(block.text)) continue;
            normalized.push({ ...block });
            continue;
        }

        if (block.type === 'ul' || block.type === 'ol') {
            const items = (block.items ?? []).filter(hasMarketingText);
            if (!items.length) continue;
            normalized.push({ ...block, items });
            continue;
        }

        if (block.type === 'image') {
            if (!hasMarketingText(block.url)) continue;
            normalized.push({ ...block });
            continue;
        }

        if (block.type === 'divider') {
            normalized.push({ type: 'divider' });
            continue;
        }

        if (block.type === 'figure') {
            if (!hasMarketingText(block.slug) && !hasMarketingText(block.asset)) continue;
            normalized.push({ ...block });
            continue;
        }

        if (block.type === 'product-screenshot') {
            if (!hasMarketingText(block.key)) continue;
            normalized.push({ ...block });
            continue;
        }

        if (block.type === 'callout') {
            if (!hasMarketingText(block.text)) continue;
            normalized.push({ ...block });
        }
    }

    return normalized;
}

function expandEditorBlock(block) {
    const data = block.data || {};
    switch (block.type) {
        case 'paragraph':
            return { type: 'p', text: data.text || '' };
        case 'heading':
            return { type: `h${Math.min(6, Math.max(1, Number(data.level) || 2))}`, text: data.text || '' };
        case 'image':
            return { type: 'image', url: data.url || '', alt: data.alt || '' };
        case 'unordered_list':
            return { type: 'ul', items: data.items || [] };
        case 'ordered_list':
            return { type: 'ol', items: data.items || [] };
        case 'quote':
            return { type: 'quote', text: data.text || '' };
        case 'tip':
            return { type: 'tip', text: data.text || '' };
        case 'note':
            return { type: 'note', text: data.text || '' };
        case 'divider':
            return { type: 'divider' };
        case 'figure':
            return {
                type: 'figure',
                slug: data.slug || '',
                asset: data.asset || '',
                alt: data.alt || '',
                caption: data.caption || '',
                variant: data.variant || '',
            };
        case 'product_screenshot':
        case 'product-screenshot':
            return {
                type: 'product-screenshot',
                key: data.key || '',
                caption: data.caption || '',
                alt: data.alt || '',
            };
        case 'callout':
            return {
                type: 'callout',
                title: data.title || '',
                text: data.text || '',
                asset: data.asset || '',
                slug: data.slug || '',
                alt: data.alt || '',
            };
        default:
            return null;
    }
}

/** Build stable heading anchors from normalized heading blocks. */
export function blogHeadingAnchors(blocks) {
    let headingIndex = 0;

    return blocks.map((block) => {
        if (!/^h[1-6]$/.test(block.type)) return block;
        const anchor = { ...block, id: `heading-${headingIndex}` };
        headingIndex += 1;
        return anchor;
    });
}
