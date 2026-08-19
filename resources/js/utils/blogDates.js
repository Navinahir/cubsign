/**
 * Calendar-date helpers for CubSign blog UI.
 *
 * YYYY-MM-DD values are treated as calendar dates, not UTC midnight, so the
 * visible day matches published_at / updated_at. "Today" is only used when
 * updated_at is the viewer's calendar date.
 */

const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

const DATE_FORMAT = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
};

export function parseBlogCalendarDate(dateStr) {
    if (dateStr == null || dateStr === '') {
        return null;
    }

    const match = DATE_PREFIX.exec(String(dateStr).trim());
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
    }

    return { year, month, day, key: `${match[1]}-${match[2]}-${match[3]}` };
}

export function formatDate(dateStr) {
    const parsed = parseBlogCalendarDate(dateStr);
    if (!parsed) {
        return '';
    }

    return new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)).toLocaleDateString(
        'en-US',
        DATE_FORMAT,
    );
}

function isLaterCalendarDate(updatedAt, publishedAt) {
    const updated = parseBlogCalendarDate(updatedAt);
    const published = parseBlogCalendarDate(publishedAt);

    if (!updated || !published) {
        return false;
    }

    return updated.key > published.key;
}

function isSameCalendarDateAs(dateStr, now) {
    const parsed = parseBlogCalendarDate(dateStr);
    if (!parsed || !(now instanceof Date) || Number.isNaN(now.getTime())) {
        return false;
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return parsed.key === `${year}-${month}-${day}`;
}

function formatUpdatedPortion(updatedAt, now) {
    if (isSameCalendarDateAs(updatedAt, now)) {
        return 'Today';
    }

    return formatDate(updatedAt);
}

/**
 * Visible blog date line from published_at / updated_at.
 * Does not invent dates. Does not use lastReviewed or the current deploy date.
 */
export function formatBlogDateDisplay(
    { publishedAt = '', updatedAt = '' } = {},
    now = new Date(),
) {
    const published = parseBlogCalendarDate(publishedAt);
    const updated = parseBlogCalendarDate(updatedAt);
    const publishedLabel = published ? formatDate(publishedAt) : '';

    if (published && !isLaterCalendarDate(updatedAt, publishedAt)) {
        return `Published ${publishedLabel}`;
    }

    if (published && isLaterCalendarDate(updatedAt, publishedAt)) {
        return `Published ${publishedLabel} · Updated ${formatUpdatedPortion(updatedAt, now)}`;
    }

    if (!published && updated) {
        return `Updated ${formatUpdatedPortion(updatedAt, now)}`;
    }

    return '';
}
