/**
 * Reusable blog callout/box configuration.
 *
 * Visual HTML is stored as semantic <aside> markup with Tailwind classes
 * (same format as existing manual blog HTML). TinyMCE iframe CSS is generated
 * from the same tokens so the Visual editor matches the public article.
 */

export const BLOG_BOX_THEMES = {
    blue: {
        id: 'blue',
        label: 'Blue',
        aside: 'border-blue-200 bg-blue-50/80 text-blue-950',
        labelClass: 'text-blue-700',
        body: 'text-blue-950',
        gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50/60',
        css: {
            border: '#bfdbfe',
            bg: 'rgba(239, 246, 255, 0.8)',
            title: '#1d4ed8',
            body: '#172554',
            gradient: 'linear-gradient(to bottom right, #eff6ff, rgba(238, 242, 255, 0.6))',
        },
    },
    indigo: {
        id: 'indigo',
        label: 'Indigo',
        aside: 'border-indigo-200 bg-indigo-50/80 text-indigo-950',
        labelClass: 'text-indigo-700',
        body: 'text-indigo-950',
        gradient: 'bg-gradient-to-br from-indigo-50 to-violet-50/60',
        css: {
            border: '#c7d2fe',
            bg: 'rgba(238, 242, 255, 0.8)',
            title: '#4338ca',
            body: '#1e1b4b',
            gradient: 'linear-gradient(to bottom right, #eef2ff, rgba(245, 243, 255, 0.6))',
        },
    },
    green: {
        id: 'green',
        label: 'Green',
        aside: 'border-emerald-200 bg-emerald-50/80 text-emerald-950',
        labelClass: 'text-emerald-700',
        body: 'text-emerald-950',
        gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50/60',
        css: {
            border: '#a7f3d0',
            bg: 'rgba(236, 253, 245, 0.8)',
            title: '#047857',
            body: '#022c22',
            gradient: 'linear-gradient(to bottom right, #ecfdf5, rgba(240, 253, 250, 0.6))',
        },
    },
    yellow: {
        id: 'yellow',
        label: 'Yellow',
        aside: 'border-yellow-200 bg-yellow-50/80 text-yellow-950',
        labelClass: 'text-yellow-800',
        body: 'text-yellow-950',
        gradient: 'bg-gradient-to-br from-yellow-50 to-amber-50/60',
        css: {
            border: '#fde68a',
            bg: 'rgba(254, 252, 232, 0.8)',
            title: '#854d0e',
            body: '#422006',
            gradient: 'linear-gradient(to bottom right, #fefce8, rgba(255, 251, 235, 0.6))',
        },
    },
    orange: {
        id: 'orange',
        label: 'Orange',
        aside: 'border-orange-200 bg-orange-50/80 text-orange-950',
        labelClass: 'text-orange-800',
        body: 'text-orange-950',
        gradient: 'bg-gradient-to-br from-orange-50 to-amber-50/60',
        css: {
            border: '#fed7aa',
            bg: 'rgba(255, 247, 237, 0.8)',
            title: '#9a3412',
            body: '#431407',
            gradient: 'linear-gradient(to bottom right, #fff7ed, rgba(255, 251, 235, 0.6))',
        },
    },
    red: {
        id: 'red',
        label: 'Red',
        aside: 'border-red-200 bg-red-50/80 text-red-950',
        labelClass: 'text-red-800',
        body: 'text-red-950',
        gradient: 'bg-gradient-to-br from-red-50 to-rose-50/60',
        css: {
            border: '#fecaca',
            bg: 'rgba(254, 242, 242, 0.8)',
            title: '#991b1b',
            body: '#450a0a',
            gradient: 'linear-gradient(to bottom right, #fef2f2, rgba(255, 241, 242, 0.6))',
        },
    },
    purple: {
        id: 'purple',
        label: 'Purple',
        aside: 'border-purple-200 bg-purple-50/80 text-purple-950',
        labelClass: 'text-purple-700',
        body: 'text-purple-950',
        gradient: 'bg-gradient-to-br from-purple-50 to-fuchsia-50/60',
        css: {
            border: '#e9d5ff',
            bg: 'rgba(250, 245, 255, 0.8)',
            title: '#7e22ce',
            body: '#3b0764',
            gradient: 'linear-gradient(to bottom right, #faf5ff, rgba(253, 244, 255, 0.6))',
        },
    },
    gray: {
        id: 'gray',
        label: 'Gray',
        aside: 'border-gray-200 bg-gray-50/80 text-gray-900',
        labelClass: 'text-gray-700',
        body: 'text-gray-900',
        gradient: 'bg-gradient-to-br from-gray-50 to-slate-100/60',
        css: {
            border: '#e5e7eb',
            bg: 'rgba(249, 250, 251, 0.8)',
            title: '#374151',
            body: '#111827',
            gradient: 'linear-gradient(to bottom right, #f9fafb, rgba(241, 245, 249, 0.6))',
        },
    },
};

export const BLOG_BOX_TYPES = [
    { id: 'note', label: 'Note', defaultTheme: 'blue' },
    { id: 'tip', label: 'Tip', defaultTheme: 'green' },
    { id: 'info', label: 'Info', defaultTheme: 'indigo' },
    { id: 'warning', label: 'Warning', defaultTheme: 'yellow' },
    { id: 'important', label: 'Important', defaultTheme: 'orange' },
    { id: 'success', label: 'Success', defaultTheme: 'green' },
    { id: 'custom', label: 'Custom', defaultTheme: 'gray' },
];

export const BLOG_BOX_IMAGE_POSITIONS = [
    { id: 'right', label: 'Right' },
    { id: 'left', label: 'Left' },
    { id: 'top', label: 'Top' },
    { id: 'bottom', label: 'Bottom' },
];

export const BLOG_BOX_IMAGE_WIDTHS = [
    { id: '160', label: 'Small', className: 'max-w-[160px]' },
    { id: '200', label: 'Medium', className: 'max-w-[200px]' },
    { id: '240', label: 'Large', className: 'max-w-[240px]' },
    { id: '320', label: 'XL', className: 'max-w-[320px]' },
    { id: 'full', label: 'Full width', className: 'max-w-full' },
];

/**
 * Class strings referenced so Tailwind JIT emits utilities used in stored HTML.
 */
export const BLOG_BOX_TAILWIND_SAFELIST = [
    'mb-5', 'mb-8', 'mb-1', 'mt-2', 'my-0', 'px-4', 'py-3', 'p-5', 'sm:p-6',
    'rounded-xl', 'rounded-2xl', 'rounded-none',
    'border', 'border-2', 'overflow-hidden', 'shadow-sm',
    'text-sm', 'text-xs', 'leading-relaxed', 'font-semibold', 'uppercase', 'tracking-wide',
    'grid', 'gap-4', 'sm:items-center', 'block', 'h-auto', 'w-full', 'bg-gray-50',
    'sm:grid-cols-[minmax(0,1fr)_160px]',
    'sm:grid-cols-[minmax(0,1fr)_200px]',
    'sm:grid-cols-[minmax(0,1fr)_240px]',
    'sm:grid-cols-[minmax(0,1fr)_320px]',
    'sm:grid-cols-[160px_minmax(0,1fr)]',
    'sm:grid-cols-[200px_minmax(0,1fr)]',
    'sm:grid-cols-[240px_minmax(0,1fr)]',
    'sm:grid-cols-[320px_minmax(0,1fr)]',
    'max-w-[160px]', 'max-w-[200px]', 'max-w-[240px]', 'max-w-[320px]', 'max-w-full', 'max-w-3xl',
    ...Object.values(BLOG_BOX_THEMES).flatMap((theme) => [
        theme.aside, theme.labelClass, theme.body, theme.gradient,
    ]),
];

export function defaultBlogBox(overrides = {}) {
    return {
        type: 'note',
        title: 'Note',
        body: '',
        theme: 'blue',
        border: 'solid',
        gradient: false,
        rounded: 'xl',
        shadow: false,
        imageUrl: '',
        imageAlt: '',
        imagePosition: 'right',
        imageMaxWidth: '200',
        imageRounded: '2xl',
        imageBorder: true,
        imageShadow: true,
        imageLazy: true,
        ...overrides,
    };
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function themeOf(id) {
    return BLOG_BOX_THEMES[id] || BLOG_BOX_THEMES.blue;
}

function typeOf(id) {
    return BLOG_BOX_TYPES.find((item) => item.id === id) || BLOG_BOX_TYPES[0];
}

function widthMeta(id) {
    return BLOG_BOX_IMAGE_WIDTHS.find((item) => item.id === id) || BLOG_BOX_IMAGE_WIDTHS[1];
}

function bodyParagraphs(body) {
    const chunks = String(body ?? '')
        .split(/\n{2,}/)
        .map((chunk) => chunk.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

    if (!chunks.length) {
        return ['<p><br></p>'];
    }

    return chunks.map((chunk) => `<p>${escapeHtml(chunk)}</p>`);
}

function roundedClass(value) {
    if (value === 'none') {
        return 'rounded-none';
    }
    if (value === '2xl') {
        return 'rounded-2xl';
    }
    return 'rounded-xl';
}

function borderWidthClass(value) {
    if (value === 'none') {
        return '';
    }
    return value === 'strong' ? 'border-2' : 'border';
}

function imageChromeClasses(config) {
    const parts = ['block', 'overflow-hidden', 'bg-gray-50'];

    if (config.imageRounded === 'none') {
        parts.push('rounded-none');
    } else if (config.imageRounded === 'xl') {
        parts.push('rounded-xl');
    } else {
        parts.push('rounded-2xl');
    }

    if (config.imageBorder) {
        parts.push('border', 'border-gray-200');
    }

    if (config.imageShadow) {
        parts.push('shadow-sm');
    }

    return parts.join(' ');
}

function gridClass(config) {
    const width = config.imageMaxWidth === 'full' ? '200' : (config.imageMaxWidth || '200');
    if (config.imagePosition === 'left') {
        return `blog-box-grid grid gap-4 p-5 sm:grid-cols-[${width}px_minmax(0,1fr)] sm:items-center sm:p-6`;
    }
    if (config.imagePosition === 'right') {
        return `blog-box-grid grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_${width}px] sm:items-center sm:p-6`;
    }
    return 'blog-box-grid grid gap-4 p-5 sm:p-6';
}

function buildImageMarkup(config) {
    const url = String(config.imageUrl || '').trim();
    if (!url) {
        return '';
    }

    const width = widthMeta(config.imageMaxWidth);
    const stacked = config.imagePosition === 'top' || config.imagePosition === 'bottom';
    const figureWidth = stacked || config.imageMaxWidth === 'full'
        ? 'max-w-full'
        : width.className;
    const lazy = config.imageLazy !== false;
    const alt = escapeHtml(config.imageAlt || '');
    const src = escapeHtml(url);

    return (
        `<figure class="blog-box-figure my-0 ${figureWidth} w-full">` +
            `<picture class="${imageChromeClasses(config)}">` +
                `<img src="${src}" alt="${alt}" class="h-auto w-full" loading="${lazy ? 'lazy' : 'eager'}" decoding="async">` +
            '</picture>' +
        '</figure>'
    );
}

function buildCopyMarkup(config, theme, compact) {
    const title = String(config.title || '').trim();
    const labelClass = compact
        ? `blog-box-label mb-1 text-xs font-semibold uppercase tracking-wide ${theme.labelClass}`
        : `blog-box-label text-xs font-semibold uppercase tracking-wide ${theme.labelClass}`;
    const paragraphs = bodyParagraphs(config.body).map((html, index) => {
        if (!compact && index === 0) {
            return html.replace('<p>', `<p class="mt-2 text-sm leading-relaxed ${theme.body}">`);
        }
        return html;
    });

    const label = title
        ? `<p class="${labelClass}">${escapeHtml(title)}</p>`
        : '';

    return label + paragraphs.join('');
}

export function buildBlogBoxHtml(rawConfig) {
    const config = defaultBlogBox(rawConfig);
    const theme = themeOf(config.theme);
    const hasImage = Boolean(String(config.imageUrl || '').trim());
    const themeTokens = theme.aside.split(' ').filter(Boolean);
    const borderColor = config.border === 'none'
        ? ''
        : (themeTokens.find((token) => token.startsWith('border-')) || '');
    const background = config.gradient
        ? theme.gradient
        : themeTokens.filter((token) => token.startsWith('bg-')).join(' ');
    const rounded = roundedClass(config.rounded);
    const border = borderWidthClass(config.border);
    const bodyColor = theme.body;
    const shadow = config.shadow ? 'shadow-sm' : '';
    const spacing = hasImage ? 'mb-8 overflow-hidden' : 'mb-5';
    const padding = hasImage ? '' : 'px-4 py-3 text-sm leading-relaxed';

    const asideClass = [
        'blog-box',
        spacing,
        rounded,
        border,
        borderColor,
        background,
        bodyColor,
        padding,
        shadow,
    ].filter(Boolean).join(' ');

    const attrs = [
        `class="${asideClass}"`,
        'data-blog-box="1"',
        `data-type="${escapeHtml(config.type)}"`,
        `data-theme="${escapeHtml(config.theme)}"`,
        `data-border="${escapeHtml(config.border)}"`,
        `data-gradient="${config.gradient ? '1' : '0'}"`,
        `data-rounded="${escapeHtml(config.rounded)}"`,
        `data-shadow="${config.shadow ? '1' : '0'}"`,
    ];

    if (hasImage) {
        attrs.push(`data-image-position="${escapeHtml(config.imagePosition)}"`);
        attrs.push(`data-image-max-width="${escapeHtml(config.imageMaxWidth)}"`);
        attrs.push(`data-image-rounded="${escapeHtml(config.imageRounded)}"`);
        attrs.push(`data-image-border="${config.imageBorder ? '1' : '0'}"`);
        attrs.push(`data-image-shadow="${config.imageShadow ? '1' : '0'}"`);
        attrs.push(`data-image-lazy="${config.imageLazy !== false ? '1' : '0'}"`);
    }

    const imageHtml = buildImageMarkup(config);
    let inner;

    if (!hasImage) {
        inner = buildCopyMarkup(config, theme, true);
    } else {
        const copy = `<div class="blog-box-copy">${buildCopyMarkup(config, theme, false)}</div>`;
        const grid = `<div class="${gridClass(config)}">`;
        if (config.imagePosition === 'left' || config.imagePosition === 'top') {
            inner = `${grid}${imageHtml}${copy}</div>`;
        } else {
            inner = `${grid}${copy}${imageHtml}</div>`;
        }
    }

    return `<aside ${attrs.join(' ')}>${inner}</aside>`;
}

/** Same order as App\Support\BlogContent::boxFields(). */
export const BLOG_BOX_FIELDS = [
    'type',
    'theme',
    'border',
    'gradient',
    'rounded',
    'shadow',
    'image-position',
    'image-max-width',
    'image-rounded',
    'image-border',
    'image-shadow',
    'image-lazy',
];

function attr(el, name, fallback = '') {
    return (el?.getAttribute?.(name) || fallback).trim();
}

/**
 * Saved HTML keeps box settings in one data-box value.
 * The visual editor still needs the separate data-* attributes for its CSS.
 */
export function expandBlogBoxHtml(html) {
    const source = String(html ?? '');
    if (!source.includes('data-box=')) {
        return source;
    }

    return source.replace(/<aside\b([^>]*)>/gi, (full, attrs) => {
        const packed = attrs.match(/\sdata-box="([^"]*)"/i);
        if (!packed) {
            return full;
        }

        const parts = packed[1].split(',');
        let next = attrs.replace(/\sdata-box="[^"]*"/i, '');
        if (!/\sdata-blog-box\s*=/i.test(next)) {
            next += ' data-blog-box="1"';
        }

        BLOG_BOX_FIELDS.forEach((field, index) => {
            const value = (parts[index] || '').trim();
            if (!value || new RegExp(`\\sdata-${field}\\s*=`, 'i').test(next)) {
                return;
            }
            next += ` data-${field}="${value.replace(/"/g, '')}"`;
        });

        return `<aside${next}>`;
    });
}

function applyPackedBox(aside) {
    const packed = attr(aside, 'data-box');
    if (!packed) {
        return;
    }

    const parts = packed.split(',');
    if (!attr(aside, 'data-blog-box')) {
        aside.setAttribute('data-blog-box', '1');
    }

    BLOG_BOX_FIELDS.forEach((field, index) => {
        const value = (parts[index] || '').trim();
        const name = `data-${field}`;
        if (value && !attr(aside, name)) {
            aside.setAttribute(name, value);
        }
    });
}

function inferThemeFromClass(className) {
    const value = ` ${className} `;
    const map = {
        emerald: 'green',
        amber: 'yellow',
        violet: 'purple',
        slate: 'gray',
    };
    const named = (token) => map[token] || token;
    const border = value.match(/\sborder-(blue|indigo|emerald|green|yellow|amber|orange|red|purple|violet|gray|slate)-/);
    if (border) {
        return named(border[1]);
    }

    const label = value.match(/\stext-(blue|indigo|emerald|green|yellow|amber|orange|red|purple|violet|gray|slate)-7/);
    if (label) {
        return named(label[1]);
    }

    const from = value.match(/\sfrom-(blue|indigo|emerald|green|yellow|amber|orange|red|purple|violet|gray|slate)-/);
    if (from) {
        return named(from[1]);
    }

    return 'blue';
}

function inferTypeFromTitle(title) {
    const normalized = String(title || '').trim().toLowerCase();
    return BLOG_BOX_TYPES.find((item) => item.label.toLowerCase() === normalized)?.id || 'custom';
}

function textOf(el) {
    return (el?.textContent || '').replace(/\s+/g, ' ').trim();
}

export function parseBlogBox(source) {
    let aside = null;

    if (typeof source === 'string') {
        const doc = new DOMParser().parseFromString(source, 'text/html');
        aside = doc.querySelector('aside');
    } else if (source?.nodeType === 1) {
        aside = source.closest?.('aside') || (source.nodeName === 'ASIDE' ? source : null);
    }

    if (!aside) {
        return defaultBlogBox();
    }

    applyPackedBox(aside);

    const className = aside.getAttribute('class') || '';
    const img = aside.querySelector('img');
    const paragraphs = [...aside.querySelectorAll('p')];
    const labelEl = aside.querySelector('.blog-box-label, .blog-aside-label') || paragraphs[0] || null;
    const title = textOf(labelEl);
    const body = paragraphs
        .filter((p) => p !== labelEl)
        .map((p) => textOf(p))
        .filter(Boolean)
        .join('\n\n');

    let imagePosition = attr(aside, 'data-image-position', '');
    if (!imagePosition && img) {
        const grid = aside.querySelector('[class*="grid"]');
        const children = grid ? [...grid.children] : [...aside.children];
        const imgIndex = children.findIndex((child) => child.querySelector?.('img') || child.tagName === 'IMG' || child.tagName === 'FIGURE' || child.tagName === 'PICTURE');
        const copyIndex = children.findIndex((child) => child.tagName === 'DIV' && !child.querySelector?.('img'));
        if (imgIndex !== -1 && copyIndex !== -1) {
            imagePosition = imgIndex < copyIndex ? 'left' : 'right';
        } else {
            imagePosition = 'right';
        }
    }

    const widthToken = (aside.querySelector('figure')?.getAttribute('class') || '')
        + (img?.getAttribute('class') || '');
    let imageMaxWidth = attr(aside, 'data-image-max-width', '');
    if (!imageMaxWidth) {
        const match = widthToken.match(/max-w-\[(\d+)px\]/);
        imageMaxWidth = match ? match[1] : (widthToken.includes('max-w-full') ? 'full' : '200');
    }

    const type = attr(aside, 'data-type') || inferTypeFromTitle(title);
    const theme = attr(aside, 'data-theme') || inferThemeFromClass(className);

    return defaultBlogBox({
        type: typeOf(type).id,
        title: title || typeOf(type).label,
        body,
        theme: themeOf(theme).id,
        border: attr(aside, 'data-border') || (className.includes('border-2') ? 'strong' : (className.includes('border') ? 'solid' : 'none')),
        gradient: attr(aside, 'data-gradient') === '1' || className.includes('bg-gradient'),
        rounded: attr(aside, 'data-rounded') || (className.includes('rounded-2xl') ? '2xl' : (className.includes('rounded-none') ? 'none' : 'xl')),
        shadow: attr(aside, 'data-shadow') === '1' || className.includes('shadow'),
        imageUrl: img?.getAttribute('src') || '',
        imageAlt: img?.getAttribute('alt') || '',
        imagePosition: imagePosition || 'right',
        imageMaxWidth,
        imageRounded: attr(aside, 'data-image-rounded') || (
            (aside.querySelector('picture')?.getAttribute('class') || '').includes('rounded-xl') ? 'xl' : '2xl'
        ),
        imageBorder: attr(aside, 'data-image-border') !== '0' && (
            attr(aside, 'data-image-border') === '1'
            || (aside.querySelector('picture')?.getAttribute('class') || '').includes('border')
            || !img
        ),
        imageShadow: attr(aside, 'data-image-shadow') === '1'
            || (aside.querySelector('picture')?.getAttribute('class') || '').includes('shadow'),
        imageLazy: attr(aside, 'data-image-lazy') !== '0' && (img?.getAttribute('loading') || 'lazy') !== 'eager',
    });
}

function cssClass(className) {
    return `.${String(className).replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`)}`;
}

/**
 * Visual styles for blog callouts.
 *
 * TinyMCE's iframe has no Tailwind, so this CSS must fully describe boxes.
 * The public article also applies it (scoped) so editor and published pages match,
 * including legacy manual <aside> HTML that has no data-blog-box attributes.
 */
export function blogBoxEditorCss(scope = '', options = {}) {
    const p = scope ? `${scope} ` : '';
    const editorChrome = options.editorChrome ?? scope === '';

    const classColorRules = Object.values(BLOG_BOX_THEMES).map((theme) => {
        const borderClass = theme.aside.split(' ').find((token) => token.startsWith('border-')) || '';
        const bgClass = theme.aside.split(' ').find((token) => token.startsWith('bg-')) || '';
        const fromClass = theme.gradient.split(' ').find((token) => token.startsWith('from-')) || '';

        return `
            ${p}aside${cssClass(borderClass)} { border-color: ${theme.css.border}; }
            ${p}aside${cssClass(bgClass)}, ${p}aside ${cssClass(bgClass)} { background-color: ${theme.css.bg}; }
            ${p}aside${cssClass(theme.body)}, ${p}aside ${cssClass(theme.body)} { color: ${theme.css.body}; }
            ${p}aside ${cssClass(theme.labelClass)}, ${p}aside${cssClass(theme.labelClass)} { color: ${theme.css.title}; }
            ${p}aside[class*="${fromClass}"] {
                background-image: ${theme.css.gradient};
            }
        `;
    }).join('\n');

    const themeRules = Object.values(BLOG_BOX_THEMES).map((theme) => `
        ${p}aside[data-blog-box][data-theme="${theme.id}"] {
            border-color: ${theme.css.border};
            background-color: ${theme.css.bg};
            color: ${theme.css.body};
        }
        ${p}aside[data-blog-box][data-theme="${theme.id}"][data-gradient="1"] {
            background-image: ${theme.css.gradient};
        }
        ${p}aside[data-blog-box][data-theme="${theme.id}"] .blog-box-label,
        ${p}aside[data-blog-box][data-theme="${theme.id}"] .blog-aside-label {
            color: ${theme.css.title};
        }
    `).join('\n');

    const chrome = editorChrome ? `
        ${p}aside[contenteditable="false"] {
            cursor: pointer;
        }
        ${p}aside[data-mce-selected] {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
        }
        ${p}.mce-offscreen-selection {
            position: absolute !important;
            left: -999999px !important;
            max-width: 1000000px;
            overflow: hidden !important;
        }
    ` : '';

    return `
        ${p}aside {
            display: block;
            box-sizing: border-box;
            max-width: 100%;
            margin: 1.25rem 0;
            overflow: hidden;
        }

        ${p}aside[data-blog-box] {
            border-style: solid;
            border-width: 1px;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            line-height: 1.625;
        }

        ${p}aside[data-blog-box][data-border="none"] { border-width: 0; }
        ${p}aside[data-blog-box][data-border="strong"] { border-width: 2px; }
        ${p}aside[data-blog-box][data-rounded="none"] { border-radius: 0; }
        ${p}aside[data-blog-box][data-rounded="xl"] { border-radius: 0.75rem; }
        ${p}aside[data-blog-box][data-rounded="2xl"] { border-radius: 1rem; }
        ${p}aside[data-blog-box][data-shadow="1"] { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }

        ${p}aside .blog-box-label,
        ${p}aside .blog-aside-label,
        ${p}aside[data-blog-box] > p:first-child {
            margin: 0 0 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        ${p}aside p {
            margin: 0;
            color: inherit;
        }

        ${p}aside .blog-box-copy p + p,
        ${p}aside > p + p {
            margin-top: 0.5rem;
        }

        ${p}aside[data-blog-box]:has(img),
        ${p}aside:has(img) {
            padding: 0;
        }

        ${p}aside:has(img) {
            margin-bottom: 2rem;
        }

        ${p}aside .blog-box-grid,
        ${p}aside .grid {
            display: grid;
            gap: 1rem;
            padding: 1.25rem;
            min-width: 0;
        }

        ${p}aside .blog-box-copy,
        ${p}aside .grid > * {
            min-width: 0;
        }

        ${p}aside .blog-box-figure,
        ${p}aside figure {
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            box-shadow: none;
            width: 100%;
            max-width: 100%;
            overflow: visible;
        }

        ${p}aside picture {
            display: block;
            overflow: hidden;
            background: #f9fafb;
            max-width: 100%;
        }

        ${p}aside[data-image-border="1"] picture,
        ${p}aside picture {
            border: 1px solid #e5e7eb;
        }

        ${p}aside[data-image-border="0"] picture { border: 0; }
        ${p}aside[data-image-rounded="xl"] picture { border-radius: 0.75rem; }
        ${p}aside[data-image-rounded="2xl"] picture,
        ${p}aside picture { border-radius: 1rem; }
        ${p}aside[data-image-rounded="none"] picture { border-radius: 0; }
        ${p}aside[data-image-shadow="1"] picture { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }

        ${p}aside img {
            display: block;
            width: 100%;
            max-width: 100%;
            height: auto;
            margin: 0;
            border: 0;
            border-radius: 0;
        }

        @media (min-width: 640px) {
            ${p}aside .blog-box-grid,
            ${p}aside .grid {
                padding: 1.5rem;
                align-items: center;
            }

            ${p}aside[data-image-position="right"] .blog-box-grid,
            ${p}aside[data-image-position="right"] .grid,
            ${p}aside:has(img):not([data-image-position]) .grid {
                grid-template-columns: minmax(0, 1fr) var(--blog-box-image-width, 200px);
            }

            ${p}aside[data-image-position="left"] .blog-box-grid,
            ${p}aside[data-image-position="left"] .grid,
            ${p}aside .grid:has(> :first-child figure),
            ${p}aside .grid:has(> :first-child picture) {
                grid-template-columns: var(--blog-box-image-width, 200px) minmax(0, 1fr);
            }

            ${p}aside[data-image-position="top"] .blog-box-grid,
            ${p}aside[data-image-position="bottom"] .blog-box-grid,
            ${p}aside[data-image-position="top"] .grid,
            ${p}aside[data-image-position="bottom"] .grid {
                grid-template-columns: minmax(0, 1fr);
            }

            ${p}aside[data-image-max-width="160"] { --blog-box-image-width: 160px; }
            ${p}aside[data-image-max-width="200"] { --blog-box-image-width: 200px; }
            ${p}aside[data-image-max-width="240"] { --blog-box-image-width: 240px; }
            ${p}aside[data-image-max-width="320"] { --blog-box-image-width: 320px; }
            ${p}aside[data-image-max-width="full"] { --blog-box-image-width: 100%; }
        }

        ${themeRules}
        ${classColorRules}

        ${p}aside.rounded-xl { border-radius: 0.75rem; }
        ${p}aside.rounded-2xl { border-radius: 1rem; }
        ${p}aside.rounded-none { border-radius: 0; }
        ${p}aside.border { border-width: 1px; border-style: solid; }
        ${p}aside.border-2 { border-width: 2px; border-style: solid; }
        ${p}aside.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
        ${p}aside.overflow-hidden { overflow: hidden; }
        ${p}aside.mb-5 { margin-bottom: 1.25rem; }
        ${p}aside.mb-8 { margin-bottom: 2rem; }
        ${p}aside.px-4 { padding-left: 1rem; padding-right: 1rem; }
        ${p}aside.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        ${p}aside.p-5 { padding: 1.25rem; }
        ${p}aside.text-sm { font-size: 0.875rem; }
        ${p}aside.leading-relaxed { line-height: 1.625; }
        ${p}aside .text-xs { font-size: 0.75rem; }
        ${p}aside .font-semibold { font-weight: 600; }
        ${p}aside .uppercase { text-transform: uppercase; }
        ${p}aside .tracking-wide { letter-spacing: 0.05em; }
        ${p}aside .mb-1 { margin-bottom: 0.25rem; }
        ${p}aside .mt-2 { margin-top: 0.5rem; }
        ${p}aside .my-0 { margin-top: 0; margin-bottom: 0; }
        ${p}aside .w-full { width: 100%; }
        ${p}aside .h-auto { height: auto; }
        ${p}aside .block { display: block; }
        ${p}aside .max-w-full { max-width: 100%; }
        ${p}aside .max-w-3xl { max-width: 48rem; }
        ${p}aside .max-w-\\[160px\\] { max-width: 160px; }
        ${p}aside .max-w-\\[200px\\] { max-width: 200px; }
        ${p}aside .max-w-\\[240px\\] { max-width: 240px; }
        ${p}aside .max-w-\\[320px\\] { max-width: 320px; }

        ${p}aside.blog-aside {
            margin-bottom: 1.25rem;
            border-radius: 0.75rem;
            border: 1px solid #bfdbfe;
            background: rgba(239, 246, 255, 0.8);
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            line-height: 1.625;
            color: #172554;
        }
        ${p}aside.blog-aside-tip {
            border-color: #a7f3d0;
            background: rgba(236, 253, 245, 0.8);
            color: #022c22;
        }
        ${p}aside .blog-aside-label {
            margin-bottom: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: #1d4ed8;
        }
        ${p}aside.blog-aside-tip .blog-aside-label {
            color: #047857;
        }

        ${chrome}
    `;
}

void BLOG_BOX_TAILWIND_SAFELIST;
