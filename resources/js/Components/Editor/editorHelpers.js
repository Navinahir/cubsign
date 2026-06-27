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

export function configuredRecipients(recipients) {
    return recipients.filter(
        r => (r.name ?? '').trim() !== '' && (r.email ?? '').trim() !== '',
    );
}

export function recipientFieldCount(placedFields, recipientId) {
    return fieldsForRecipient(placedFields, recipientId).length;
}

export function recipientFieldSummaries(placedFields, recipients) {
    return configuredRecipients(recipients).map(r => {
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

/** Resolve which workflow a placed field belongs to (self vs request). */
export function resolveFieldSigningMode(field, fallbackDocumentMode = 'self') {
    if (field?.signingMode === 'request' || field?.signingMode === 'self') {
        return field.signingMode;
    }
    if (isSignPlaceholder(field)) {
        return 'request';
    }
    if (field?.type === 'signature' || field?.type === 'initials') {
        return 'self';
    }
    return fallbackDocumentMode === 'request' ? 'request' : 'self';
}

export function fieldsForSigningMode(placedFields, mode, documentSigningMode = mode) {
    return placedFields.filter(
        f => resolveFieldSigningMode(f, documentSigningMode) === mode,
    );
}

/**
 * Build confirmation copy for switching signing mode.
 *
 * @returns {{ title: string, lead: string, subtitle: string, bullets: string[], footer: string|null, confirmLabel: string }}
 */
export function buildModeSwitchModal(targetMode, placedFields, recipients, documentSigningMode) {
    if (targetMode === 'self') {
        const requestFields = fieldsForSigningMode(placedFields, 'request', documentSigningMode);
        const configured    = configuredRecipients(recipients);
        const bullets       = [];

        if (configured.length > 0) {
            bullets.push(`${configured.length} recipient${configured.length === 1 ? '' : 's'}`);
        }
        if (requestFields.length > 0) {
            bullets.push(`${requestFields.length} assigned field${requestFields.length === 1 ? '' : 's'}`);
        }

        const sigPlaceholders = requestFields.filter(f => f.type === 'signature').length;
        const initPlaceholders = requestFields.filter(f => f.type === 'initials').length;
        if (sigPlaceholders > 0) {
            bullets.push(`${sigPlaceholders} signature placeholder${sigPlaceholders === 1 ? '' : 's'}`);
        }
        if (initPlaceholders > 0) {
            bullets.push(`${initPlaceholders} initials placeholder${initPlaceholders === 1 ? '' : 's'}`);
        }

        return {
            title:        'Switch to Just Me?',
            lead:         'This document currently contains recipient fields.',
            subtitle:     'Switching to Just Me will remove:',
            bullets,
            footer:       'Your document itself will remain unchanged.',
            confirmLabel: 'Switch & Remove',
        };
    }

    const selfFields = fieldsForSigningMode(placedFields, 'self', documentSigningMode);
    const bullets    = selfFields.length > 0
        ? [`${selfFields.length} personal field${selfFields.length === 1 ? '' : 's'}`]
        : [];

    return {
        title:        'Switch to Request Signatures?',
        lead:         'This document already contains personal signing fields.',
        subtitle:     bullets.length > 0 ? 'Switching modes will remove:' : 'Switching modes will prepare the document for recipients.',
        bullets,
        footer:       'Your saved signature will be kept. Add at least one recipient before placing fields.',
        confirmLabel: 'Switch',
    };
}

const MODE_CONSISTENCY_ERROR =
    'This document contains fields from different signing modes. Please choose a single signing mode.';

/**
 * Ensure placed fields match the active signing workflow.
 *
 * @returns {string[]} error messages (empty = valid)
 */
export function validateSigningModeConsistency({ signingMode, placedFields, recipients }) {
    if (signingMode !== 'request' && signingMode !== 'self') {
        return [MODE_CONSISTENCY_ERROR];
    }

    const selfFields    = fieldsForSigningMode(placedFields, 'self', signingMode);
    const requestFields = fieldsForSigningMode(placedFields, 'request', signingMode);

    if (selfFields.length > 0 && requestFields.length > 0) {
        return [MODE_CONSISTENCY_ERROR];
    }

    if (signingMode === 'self' && requestFields.length > 0) {
        return [MODE_CONSISTENCY_ERROR];
    }

    if (signingMode === 'request' && selfFields.length > 0) {
        return [MODE_CONSISTENCY_ERROR];
    }

    if (signingMode === 'request' && placedFields.length > 0) {
        const configured = configuredRecipients(recipients);
        if (configured.length === 0) {
            return [MODE_CONSISTENCY_ERROR];
        }

        for (const field of placedFields) {
            if (resolveFieldSigningMode(field, signingMode) !== 'request') {
                continue;
            }
            const signerId = normalizeSignerId(field.signerId);
            if (signerId === null || !configured.some(r => r.id === signerId)) {
                return [MODE_CONSISTENCY_ERROR];
            }
        }
    }

    return [];
}

/**
 * Validate request-signing workflow before finish / prepare.
 *
 * Authenticated users require a persisted document (documentId + documentSaved).
 * Guests only need signed PDF bytes in the browser session (signedPdfReady).
 *
 * @returns {string[]} error messages (empty = valid)
 */
export function validateRequestSigning({
    signingMode,
    recipients,
    placedFields,
    documentId,
    documentSaved,
    isGuest = false,
    signedPdfReady = false,
}) {
    const errors = [];

    errors.push(...validateSigningModeConsistency({ signingMode, placedFields, recipients }));

    if (isGuest) {
        if (!signedPdfReady) {
            errors.push('Unable to prepare your signed document. Please try again.');
        }
    } else {
        if (!documentId) {
            errors.push('Document must be saved before continuing.');
        }

        if (!documentSaved) {
            errors.push('Please save the document PDF before finishing.');
        }
    }

    if (signingMode !== 'request' && signingMode !== 'self') {
        errors.push('Invalid signing mode.');
    }

    if (signingMode === 'request') {
        const configured = configuredRecipients(recipients);

        if (configured.length === 0) {
            errors.push('Add at least one recipient before finishing.');
        }

        const seenEmails = new Set();

        for (const r of configured) {
            const email = (r.email ?? '').trim().toLowerCase();
            const name  = (r.name ?? '').trim() || 'A recipient';

            if (!email) {
                errors.push(`${name} must have an email address.`);
                continue;
            }

            if (seenEmails.has(email)) {
                errors.push(`Duplicate email address: ${r.email}.`);
            }
            seenEmails.add(email);

            const count = fieldsForRecipient(placedFields, r.id).length;
            if (count === 0) {
                errors.push(`Recipient ${name} has no assigned fields.`);
            }
        }
    } else if (placedFields.length === 0) {
        errors.push('Place at least one field before finishing.');
    }

    return errors;
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
