export const FIELD_TYPES = ['signature', 'initials', 'name', 'date', 'text', 'checkbox'];

export function normalizeSignerId(id) {
    if (id === null || id === undefined || id === '') return null;
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
}

/** Fields assigned to a recipient — single source: editor_state.placedFields */
export function fieldsForRecipient(placedFields, recipientId) {
    const target = normalizeSignerId(recipientId);
    if (target === null) return [];
    return placedFields.filter(f => normalizeSignerId(f.signerId) === target);
}

export function fieldTypesForRecipient(placedFields, recipientId) {
    const counts = Object.fromEntries(FIELD_TYPES.map(t => [t, 0]));
    for (const f of fieldsForRecipient(placedFields, recipientId)) {
        if (counts[f.type] !== undefined) counts[f.type]++;
    }
    return counts;
}

export function recipientFieldSummaries(placedFields, recipients) {
    return recipients
        .filter(r => (r.name ?? '').trim() || (r.email ?? '').trim())
        .map(r => {
            const assigned = fieldsForRecipient(placedFields, r.id);
            const assignedFieldTypes = fieldTypesForRecipient(placedFields, r.id);
            return {
                ...r,
                assignedFields: assigned,
                assigned_fields_count: assigned.length,
                assigned_field_types: assignedFieldTypes,
                fieldCount: assigned.length,
            };
        });
}

export function buildFieldsLogPayload(documentId, recipientId, placedFields, signerId = null) {
    const fields = signerId !== null
        ? fieldsForRecipient(placedFields, signerId)
        : placedFields;
    const fieldTypes = {};
    for (const f of fields) {
        fieldTypes[f.type] = (fieldTypes[f.type] ?? 0) + 1;
    }
    return {
        document_id: documentId ?? null,
        recipient_id: recipientId ?? null,
        field_count: fields.length,
        field_types: fieldTypes,
        field_ids: fields.map(f => f.id),
    };
}

export function recipientInitials(recipient) {
    const name = (recipient?.name ?? '').trim();
    if (!name) return `#${recipient?.signingOrder ?? '?'}`;
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export function recipientDisplayName(recipient) {
    if (!recipient) return 'Signer';
    const name = (recipient.name ?? '').trim();
    if (name) return name;
    return `Recipient #${recipient.signingOrder}`;
}

export function fieldTypeLabel(type) {
    const map = {
        signature: 'Signature',
        initials:  'Initials',
        date:      'Date',
        name:      'Name',
        text:      'Text',
        checkbox:  'Checkbox',
    };
    return map[type] ?? type;
}

/** Signature/initials field awaiting recipient (or template) completion */
export function isSignPlaceholder(field) {
    if (field?.type !== 'signature' && field?.type !== 'initials') return false;
    if (typeof field.value !== 'object' || field.value === null) return false;
    const src = field.value.src ?? '';
    return ['Signature', 'Initials', 'Sign Here', 'Initial Here'].includes(src);
}

export function signPlaceholderLabel(field) {
    if (field?.type === 'initials') return 'Initial Here';
    return 'Sign Here';
}

export function isEmptyRecipientField(field) {
    if (field.type === 'checkbox') return field.value === false;
    if (field.type === 'date' || field.type === 'name' || field.type === 'text') {
        return field.value === '' || field.value === null || field.value === undefined;
    }
    return false;
}

export function statusBadgeClass(status) {
    const base = 'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize transition-colors duration-200';
    const map = {
        pending:   'bg-gray-100 text-gray-500',
        viewed:    'bg-blue-100 text-blue-600',
        signed:    'bg-emerald-100 text-emerald-700',
        declined:  'bg-red-100 text-red-600',
        completed: 'bg-emerald-100 text-emerald-700',
    };
    return `${base} ${map[status] ?? map.pending}`;
}
