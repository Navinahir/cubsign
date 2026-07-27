const ASSET_BASE = '/images/blog/assets';

export function getBlogAssetPng(slug, asset = 'workflow') {
    return `${ASSET_BASE}/${slug}-${asset}.png`;
}

export function getBlogAssetWebp(slug, asset = 'workflow') {
    return `${ASSET_BASE}/${slug}-${asset}.webp`;
}

export function getBlogAssetAlt(slug, asset, fallbackTitle = '') {
    const label = fallbackTitle || slug.replace(/-/g, ' ');
    if (asset === 'workflow') {
        return `CubSign workflow diagram: ${label}`;
    }
    if (asset === 'ui') {
        return `CubSign product interface showing ${label}`;
    }
    return `CubSign illustration for ${label}`;
}
