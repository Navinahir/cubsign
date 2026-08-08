/** Real CubSign product screenshots — captured from the live app UI. */

export const PRODUCT_SCREENSHOT_BASE = '/images/product';

export const productScreenshots = {
    'pdf-upload': {
        src: `${PRODUCT_SCREENSHOT_BASE}/pdf-upload.webp`,
        fallbackSrc: `${PRODUCT_SCREENSHOT_BASE}/pdf-upload.png`,
        alt: 'CubSign PDF upload interface with drop zone and Select PDF file button',
        caption: 'CubSign upload screen — PDF only, up to 25 MB.',
        width: 1440,
        height: 900,
    },
    'signing-editor': {
        src: `${PRODUCT_SCREENSHOT_BASE}/signing-editor.webp`,
        fallbackSrc: `${PRODUCT_SCREENSHOT_BASE}/signing-editor.png`,
        alt: 'CubSign signing editor showing a demo PDF and signature tools',
        caption: 'Signing editor with field tools and draw / type / upload signature options.',
        width: 1440,
        height: 900,
    },
    'draw-signature': {
        src: `${PRODUCT_SCREENSHOT_BASE}/draw-signature.webp`,
        fallbackSrc: `${PRODUCT_SCREENSHOT_BASE}/draw-signature.png`,
        alt: 'CubSign draw signature tool with a signature drawn on the canvas',
        caption: 'Draw tab — create a signature on the canvas, then save it.',
        width: 1440,
        height: 900,
    },
    'type-signature': {
        src: `${PRODUCT_SCREENSHOT_BASE}/type-signature.webp`,
        fallbackSrc: `${PRODUCT_SCREENSHOT_BASE}/type-signature.png`,
        alt: 'CubSign type signature tool with Demo User entered and a font selected',
        caption: 'Type tab — enter a name and choose a signature font.',
        width: 1440,
        height: 900,
    },
    'upload-signature': {
        src: `${PRODUCT_SCREENSHOT_BASE}/upload-signature.webp`,
        fallbackSrc: `${PRODUCT_SCREENSHOT_BASE}/upload-signature.png`,
        alt: 'CubSign upload signature tab showing an uploaded signature image preview',
        caption: 'Upload tab — use an image of your signature for the current document.',
        width: 1440,
        height: 900,
    },
    'signature-placement': {
        src: `${PRODUCT_SCREENSHOT_BASE}/signature-placement.webp`,
        fallbackSrc: `${PRODUCT_SCREENSHOT_BASE}/signature-placement.png`,
        alt: 'CubSign editor prompting to click the PDF to place a saved signature',
        caption: 'After saving, click the PDF to place your signature.',
        width: 1440,
        height: 900,
    },
    'signed-pdf-download': {
        src: `${PRODUCT_SCREENSHOT_BASE}/signed-pdf-download.webp`,
        fallbackSrc: `${PRODUCT_SCREENSHOT_BASE}/signed-pdf-download.png`,
        alt: 'CubSign complete screen with Download Signed PDF button',
        caption: 'Complete screen — download the signed PDF when you are done.',
        width: 1440,
        height: 900,
    },
};

export function getProductScreenshot(key) {
    return productScreenshots[key] ?? null;
}

/** Content block helper for Help / Blog articles. */
export function productShotBlock(key, captionOverride = null) {
    const shot = getProductScreenshot(key);
    if (!shot) return null;
    return {
        type: 'product-screenshot',
        key,
        caption: captionOverride ?? shot.caption,
    };
}
