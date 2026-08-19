import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBlogDateDisplay, formatDate } from '../../resources/js/utils/blogDates.js';

const viewerDay = (year, monthIndex, day) => new Date(year, monthIndex, day);

test('historical article shows its actual published date when not updated later', () => {
    const label = formatBlogDateDisplay(
        { publishedAt: '2026-06-18', updatedAt: '2026-06-18' },
        viewerDay(2026, 7, 19),
    );

    assert.equal(label, 'Published June 18, 2026');
    assert.equal(label.includes('Today'), false);
    assert.equal(label.includes('Updated'), false);
});

test('later updated_at shows both published and updated dates', () => {
    const label = formatBlogDateDisplay(
        { publishedAt: '2025-12-02', updatedAt: '2026-08-11' },
        viewerDay(2026, 7, 19),
    );

    assert.equal(label, 'Published December 2, 2025 · Updated August 11, 2026');
});

test('article updated today can display Updated Today', () => {
    const label = formatBlogDateDisplay(
        { publishedAt: '2026-07-27', updatedAt: '2026-08-19' },
        viewerDay(2026, 7, 19),
    );

    assert.equal(label, 'Published July 27, 2026 · Updated Today');
});

test('article without an update today does not display Updated Today', () => {
    const label = formatBlogDateDisplay(
        { publishedAt: '2026-04-20', updatedAt: '2026-08-08' },
        viewerDay(2026, 7, 19),
    );

    assert.equal(label, 'Published April 20, 2026 · Updated August 8, 2026');
    assert.equal(label.includes('Today'), false);
});

test('missing published_at falls back to Updated without inventing a publish date', () => {
    const label = formatBlogDateDisplay(
        { publishedAt: '', updatedAt: '2026-08-08' },
        viewerDay(2026, 7, 19),
    );

    assert.equal(label, 'Updated August 8, 2026');
    assert.equal(label.startsWith('Published'), false);
});

test('updated-only article can display Updated Today', () => {
    const label = formatBlogDateDisplay(
        { updatedAt: '2026-08-19' },
        viewerDay(2026, 7, 19),
    );

    assert.equal(label, 'Updated Today');
});

test('empty metadata does not invent a date', () => {
    assert.equal(formatBlogDateDisplay({}, viewerDay(2026, 7, 19)), '');
    assert.equal(formatDate(''), '');
    assert.equal(formatDate(undefined), '');
});

test('formatDate never returns Today and is calendar-stable for YYYY-MM-DD', () => {
    assert.equal(formatDate('2026-08-08'), 'August 8, 2026');
    assert.equal(formatDate('2026-07-27'), 'July 27, 2026');
    assert.equal(formatDate('2026-08-08').includes('Today'), false);
});

test('blog index and article page share the same date interpretation', () => {
    const post = { publishedAt: '2026-01-05', updatedAt: '2026-08-08' };
    const now = viewerDay(2026, 7, 19);

    assert.equal(
        formatBlogDateDisplay(post, now),
        formatBlogDateDisplay({ publishedAt: post.publishedAt, updatedAt: post.updatedAt }, now),
    );
});
