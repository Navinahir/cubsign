/** Template fields are structural placeholders only — never real signature or user data. */

import { FIELD_DEFAULTS } from '@/Components/Editor/editorConstants';

export const TEMPLATE_FIELD_TYPES = [
    'signature',
    'initials',
    'name',
    'text',
    'date',
    'checkbox',
];

export const TEMPLATE_MAX_FIELDS = 500;

const PLACEHOLDER_VALUES = {
    signature: { sigType: 'text', src: 'Signature' },
    initials:  { sigType: 'text', src: 'Initials' },
    date:      '',
    name:      '',
    text:      '',
    checkbox:  false,
};

/** Minimum resize dimensions per field type. */
export function minFieldSize(type) {
    const def = FIELD_DEFAULTS[type];
    if (type === 'checkbox') {
        return { w: 28, h: 28 };
    }
    if (!def) {
        return { w: 40, h: 24 };
    }
    if (type === 'signature' || type === 'initials') {
        return { w: 60, h: 24 };
    }
    return { w: Math.min(def.w, 80), h: Math.max(24, def.h) };
}

/** Keep a field within page bounds and enforce minimum size. */
export function clampFieldToPage(field, pageDim) {
    if (!pageDim) return field;
    const min = minFieldSize(field.type);
    const w = Math.max(min.w, Math.min(field.w, pageDim.w));
    const h = Math.max(min.h, Math.min(field.h, pageDim.h));
    const x = Math.max(0, Math.min(field.x, pageDim.w - w));
    const y = Math.max(0, Math.min(field.y, pageDim.h - h));
    return { ...field, x, y, w, h };
}

/** Build placeholder value when placing a field in the template editor. */
export function buildTemplateFieldValue(type) {
    if (type === 'signature' || type === 'initials') {
        return { ...PLACEHOLDER_VALUES[type] };
    }
    if (type === 'checkbox') {
        return false;
    }
    return '';
}

/** Normalize a single field for template storage or display. */
export function sanitizeTemplateField(field, pageDim = null) {
    const type = TEMPLATE_FIELD_TYPES.includes(field.type) ? field.type : 'text';
    const def  = FIELD_DEFAULTS[type] ?? { w: 160, h: 32 };
    const min  = minFieldSize(type);

    let normalized = {
        id:       field.id,
        type,
        pageNum:  Math.max(1, Number(field.pageNum) || 1),
        x:        Math.max(0, Number(field.x) || 0),
        y:        Math.max(0, Number(field.y) || 0),
        w:        Math.max(min.w, Number(field.w) || def.w),
        h:        Math.max(min.h, Number(field.h) || def.h),
        label:    String(field.label ?? '').slice(0, 255),
        required: Boolean(field.required),
        value:    buildTemplateFieldValue(type),
    };

    if (pageDim) {
        normalized = clampFieldToPage(normalized, pageDim);
    }

    return normalized;
}

/** Strip signing metadata — only layout + placeholders for template save. */
export function serializeTemplateEditorState(placedFields, scale, activePage) {
    const safeScale = Math.max(0.4, Math.min(3, Number(scale) || 1.3));
    return {
        placedFields: placedFields
            .slice(0, TEMPLATE_MAX_FIELDS)
            .map((f) => sanitizeTemplateField(f)),
        scale:      safeScale,
        activePage: Math.max(1, Number(activePage) || 1),
    };
}

/** Load template fields from storage, discarding any legacy signing data. */
export function hydrateTemplateFields(rawFields, numPages = null) {
    if (!Array.isArray(rawFields)) return [];
    return rawFields
        .slice(0, TEMPLATE_MAX_FIELDS)
        .map((f) => sanitizeTemplateField(f))
        .filter((f) => numPages === null || f.pageNum <= numPages);
}

export function templatePlaceholderLabel(field) {
    if (field.label?.trim()) return field.label.trim();
    const labels = {
        signature: 'Signature',
        initials:  'Initials',
        date:      'Date',
        name:      'Name',
        text:      'Text',
        checkbox:  'Checkbox',
    };
    return labels[field.type] ?? field.type;
}

export const TEMPLATE_FIELD_COLOR = '#F59E0B';
