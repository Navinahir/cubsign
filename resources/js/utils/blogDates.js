/**
 * Calendar-date helpers for CubSign blog UI.
 *
 * YYYY-MM-DD values are treated as calendar dates, not UTC midnight, so the
 * visible day matches published_at / updated_at. Laravel datetimes such as
 * "2026-09-16 07:20:16" keep their time for "was this edited after publish?".
 * "Today" is only used when updated_at is a later calendar day that is also
 * the viewer's calendar date.
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

/**
 * Comparable instant for published_at / updated_at.
 * Date-only values (YYYY-MM-DD) are start-of-day; Laravel datetimes such as
 * "2026-09-16 07:20:16" and ISO strings keep their time component.
 */
export function parseBlogTimestamp(dateStr) {
    if (dateStr == null || dateStr === '') {
        return null;
    }

    const value = String(dateStr).trim();
    if (!value) {
        return null;
    }

    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
        const iso = new Date(value);
        return Number.isNaN(iso.getTime()) ? null : iso.getTime();
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(value);
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = Number(match[4] ?? 0);
    const minute = Number(match[5] ?? 0);
    const second = Number(match[6] ?? 0);

    if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
    }

    return Date.UTC(year, month - 1, day, hour, minute, second);
}

function isLaterThanPublished(updatedAt, publishedAt) {
    const updated = parseBlogTimestamp(updatedAt);
    const published = parseBlogTimestamp(publishedAt);

    if (updated == null || published == null) {
        return false;
    }

    return updated > published;
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

function formatUpdatedPortion(updatedAt, publishedAt, now) {
    const published = parseBlogCalendarDate(publishedAt);
    const updated = parseBlogCalendarDate(updatedAt);
    const sameCalendarDayAsPublished = Boolean(
        published && updated && published.key === updated.key,
    );

    // Keep "Today" only when the update is on a later calendar day than publish.
    if (!sameCalendarDayAsPublished && isSameCalendarDateAs(updatedAt, now)) {
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
    const wasUpdatedAfterPublish = isLaterThanPublished(updatedAt, publishedAt);

    if (published && !wasUpdatedAfterPublish) {
        return `Published ${publishedLabel}`;
    }

    if (published && wasUpdatedAfterPublish) {
        return `Published ${publishedLabel} · Updated ${formatUpdatedPortion(updatedAt, publishedAt, now)}`;
    }

    if (!published && updated) {
        return `Updated ${formatUpdatedPortion(updatedAt, publishedAt, now)}`;
    }

    return '';
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

function pluralUnit(count, unit) {
    return count === 1 ? unit : `${unit}s`;
}

/**
 * Age of a post from its created timestamp.
 * "1 min ago", "5 min ago", "1 hour ago", "2 days ago", then months and years.
 * A post created in the last minute shows "1 min ago".
 */
export function formatTimeAgo(dateStr, now = new Date()) {
    const then = parseBlogTimestamp(dateStr);
    if (then == null || !(now instanceof Date) || Number.isNaN(now.getTime())) {
        return '';
    }

    const elapsed = now.getTime() - then;
    if (elapsed < MINUTE_MS) {
        return '1 min ago';
    }

    const minutes = Math.floor(elapsed / MINUTE_MS);
    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(elapsed / HOUR_MS);
    if (hours < 24) {
        return `${hours} ${pluralUnit(hours, 'hour')} ago`;
    }

    const days = Math.floor(elapsed / DAY_MS);
    if (days < 30) {
        return `${days} ${pluralUnit(days, 'day')} ago`;
    }

    const years = Math.floor(elapsed / YEAR_MS);
    if (years >= 1) {
        return `${years} ${pluralUnit(years, 'year')} ago`;
    }

    const months = Math.floor(elapsed / MONTH_MS);
    return `${months} ${pluralUnit(months, 'month')} ago`;
}
