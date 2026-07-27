/** Returns true when a value has visible text after trimming. */
export function hasMarketingText(value) {
    if (value == null) return false;
    return String(value).trim().length > 0;
}

/** Drop empty strings from metadata / label lists. */
export function nonEmptyStrings(values) {
    return (values ?? []).filter(hasMarketingText);
}

/**
 * Normalize blog content blocks for rendering.
 * Skips empty paragraphs, headings, list items, and unknown block types.
 */
export function normalizeBlogBlocks(blocks) {
    if (!Array.isArray(blocks)) return [];

    const normalized = [];

    for (const block of blocks) {
        if (!block || typeof block !== 'object' || !block.type) continue;

        if (block.type === 'p' || block.type === 'h2' || block.type === 'tip' || block.type === 'note') {
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

        if (block.type === 'figure') {
            if (!hasMarketingText(block.slug) && !hasMarketingText(block.asset)) continue;
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

/** Build stable heading anchors from normalized h2 blocks. */
export function blogHeadingAnchors(blocks) {
    let h2Index = 0;

    return blocks.map((block) => {
        if (block.type !== 'h2') return block;
        const anchor = { ...block, id: `heading-${h2Index}` };
        h2Index += 1;
        return anchor;
    });
}
