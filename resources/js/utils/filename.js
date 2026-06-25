const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\x00]/;

/**
 * Split a filename into base name and extension (extension includes the dot).
 */
export function splitFilename(name) {
    const lastDot = name.lastIndexOf('.');
    if (lastDot <= 0) {
        return { base: name, ext: '' };
    }
    return { base: name.slice(0, lastDot), ext: name.slice(lastDot) };
}

export function buildFilename(base, ext) {
    return `${base.trim()}${ext}`;
}

export function validateFilename(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return 'Filename cannot be empty.';
    }
    if (INVALID_FILENAME_CHARS.test(trimmed)) {
        return 'Filename contains invalid characters.';
    }
    return null;
}

export function isDuplicateName(name, documents) {
    const normalized = name.trim().toLowerCase();
    return documents.some((doc) => doc.name.trim().toLowerCase() === normalized);
}
