<script setup>
import { ref, computed } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';
import {
    fieldTypeLabel,
    fieldsForRecipient,
    validateRequestSigning,
} from '@/Components/Editor/editorHelpers';
import { persistSignedPdf } from '@/utils/persistSignedPdf';

const props = defineProps({
    session: {
        type: Object,
        required: true,
    },
    documentId: {
        type: Number,
        default: null,
    },
    reviewData: {
        type: Object,
        default: null,
    },
    alreadyPrepared: {
        type: Boolean,
        default: false,
    },
    documentFinalized: {
        type: Boolean,
        default: false,
    },
});

const SEND_STEPS = [
    { id: 'saving',    label: 'Saving document...' },
    { id: 'preparing', label: 'Preparing recipients...' },
    { id: 'sending',   label: 'Sending invitations...' },
    { id: 'done',      label: 'Done.' },
];

const pageCount        = ref(0);
const fieldCount       = ref(0);
const recipientCount   = ref(0);
const reviewRecipients = ref([]);
const placedFields     = ref([]);
const signingMode      = ref('self');
const documentId       = ref(null);
const initError        = ref('');
const initState        = ref('loading');
const sendStep         = ref('idle');
const sendError        = ref('');
const finishError      = ref('');
const isFinalized      = ref(props.documentFinalized);
const isBusy           = ref(false);

const isAuthenticated = computed(() => !!usePage().props.auth?.user);
const isRequestMode   = computed(() => signingMode.value === 'request');
const isSending       = computed(() => sendStep.value !== 'idle' && sendStep.value !== 'error');
const buttonsDisabled = computed(() => isBusy.value || isSending.value);

function clientSession() {
    const cs = typeof window !== 'undefined' ? window.__cubsignSession : null;
    return cs?.token === props.session.token ? cs : null;
}

/** Single source of truth: signed PDF bytes exist or document was persisted server-side. */
const signedPdfReady = computed(() => {
    if (isFinalized.value) return true;
    return !!clientSession()?.signedPdf;
});

function stepStatus(stepId) {
    const order = ['saving', 'preparing', 'sending', 'done'];
    const current = sendStep.value === 'error' ? -1 : order.indexOf(sendStep.value);
    const index   = order.indexOf(stepId);
    if (current < 0) return 'pending';
    if (index < current) return 'complete';
    if (index === current) return 'active';
    return 'pending';
}

function recipientFieldCount(r) {
    return fieldsForRecipient(placedFields.value, r.id).length;
}

function recipientFieldTypeLabels(r) {
    const counts = r.assigned_field_types ?? {};
    return Object.entries(counts)
        .filter(([, count]) => count > 0)
        .map(([type]) => fieldTypeLabel(type));
}

function hydrateFromReviewData(data, docId) {
    if (!data || typeof data !== 'object') return false;

    pageCount.value        = data.pageCount      ?? 0;
    fieldCount.value       = data.fieldCount     ?? 0;
    recipientCount.value   = data.recipientCount ?? 0;
    reviewRecipients.value = Array.isArray(data.recipients) ? data.recipients : [];
    placedFields.value     = Array.isArray(data.placedFields) ? data.placedFields : [];
    signingMode.value      = data.signingMode    ?? 'self';
    documentId.value       = docId ?? props.documentId ?? null;
    return true;
}

function resolveReviewHydration() {
    if (!props.session?.token) {
        initError.value = 'Signing session not found.';
        return false;
    }

    if (props.reviewData) {
        hydrateFromReviewData(props.reviewData, props.documentId);
        isFinalized.value = props.documentFinalized;
        return true;
    }

    const cs = typeof window !== 'undefined' ? window.__cubsignSession : null;
    const sessionReview = cs?.token === props.session.token ? cs?.reviewData : null;

    if (sessionReview) {
        hydrateFromReviewData(sessionReview, cs.documentId ?? props.documentId ?? null);
        if (cs.documentSaved || cs.signedPdf) {
            isFinalized.value = true;
        }
        return true;
    }

    initError.value = 'Your editor session was lost. Please return to the editor to continue.';
    return false;
}

initState.value = resolveReviewHydration() ? 'ready' : 'error';

function formatFileSize(bytes) {
    if (!bytes) return '—';
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
}

function getXsrfToken() {
    return decodeURIComponent(
        document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
    );
}

function backToEditor() {
    if (buttonsDisabled.value) return;
    router.visit(route('sign.editor'));
}

function runValidation() {
    return validateRequestSigning({
        signingMode:     signingMode.value,
        recipients:      reviewRecipients.value,
        placedFields:    placedFields.value,
        documentId:      documentId.value,
        documentSaved:   isAuthenticated.value ? isFinalized.value : signedPdfReady.value,
        isGuest:         !isAuthenticated.value,
        signedPdfReady:  signedPdfReady.value,
    });
}

async function persistEditorStateFromReview() {
    if (!documentId.value) return false;

    const state = {
        placedFields: placedFields.value,
        recipients:   reviewRecipients.value,
        signingMode:  signingMode.value,
        pageCount:    pageCount.value,
    };

    const res = await fetch(route('documents.editor-state', documentId.value), {
        method:      'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getXsrfToken() },
        body: JSON.stringify({ state }),
    });

    return res.ok;
}

async function ensureDocumentSaved() {
    if (isFinalized.value || signedPdfReady.value) {
        if (!isAuthenticated.value && clientSession()?.signedPdf) {
            isFinalized.value = true;
            if (window.__cubsignSession?.token === props.session.token) {
                window.__cubsignSession.documentSaved = true;
            }
        }
        return true;
    }

    const cs = clientSession();
    if (!cs?.signedPdf) {
        return false;
    }

    if (!isAuthenticated.value) {
        isFinalized.value = true;
        window.__cubsignSession.documentSaved = true;
        return true;
    }

    const response = await persistSignedPdf(cs.signedPdf, cs.filename ?? props.session.filename);
    if (!response.ok) return false;

    isFinalized.value = true;
    if (window.__cubsignSession?.token === props.session.token) {
        window.__cubsignSession.documentSaved = true;
    }
    return true;
}

async function finishSigning() {
    if (buttonsDisabled.value) return;

    finishError.value = '';
    const errors = runValidation();
    if (errors.length > 0) {
        finishError.value = errors[0];
        return;
    }

    isBusy.value = true;
    try {
        if (!isFinalized.value && !signedPdfReady.value) {
            const saved = await ensureDocumentSaved();
            if (!saved) {
                finishError.value = 'Unable to prepare your signed document. Please try again.';
                return;
            }
        }
        router.visit(route('sign.complete'));
    } finally {
        isBusy.value = false;
    }
}

async function sendForSignature() {
    if (buttonsDisabled.value || props.alreadyPrepared) return;

    sendError.value = '';
    finishError.value = '';

    const errors = runValidation();
    if (errors.length > 0) {
        sendError.value = errors[0];
        sendStep.value = 'error';
        return;
    }

    isBusy.value = true;
    sendStep.value = 'saving';

    try {
        const editorSaved = await persistEditorStateFromReview();
        if (!editorSaved) {
            throw new Error('Could not save document state. Please try again.');
        }

        const pdfSaved = await ensureDocumentSaved();
        if (!pdfSaved) {
            throw new Error('Could not save the document PDF. Please return to the editor and try again.');
        }

        sendStep.value = 'preparing';

        sendStep.value = 'sending';

        const res = await fetch(route('documents.send', documentId.value), {
            method:      'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getXsrfToken() },
            body: JSON.stringify({
                recipients: reviewRecipients.value.map(r => ({
                    name:                r.name,
                    email:               r.email,
                    color:               r.color,
                    signing_order:       r.signingOrder,
                    editor_recipient_id: r.id,
                })),
            }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message ?? data.errors?.[0] ?? 'Something went wrong. Please try again.');
        }

        sendStep.value = 'done';

        await new Promise(resolve => setTimeout(resolve, 500));

        router.visit(route('sign.sent'));
    } catch (e) {
        sendError.value = e?.message ?? 'Network error. Please check your connection and try again.';
        sendStep.value = 'error';
    } finally {
        isBusy.value = false;
    }
}
</script>

<template>
    <SignLayout :step="3">
        <div class="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">

            <div v-if="initState === 'error'" class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                <p class="mb-1 font-semibold text-amber-800">Unable to load review</p>
                <p class="mb-4 text-sm text-amber-700">{{ initError }}</p>
                <button
                    type="button"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    @click="backToEditor"
                >
                    Back to Editor
                </button>
            </div>

            <template v-else>

                <div class="mb-6">
                    <h1 class="text-xl font-bold text-gray-900">Review Document</h1>
                    <p class="mt-0.5 text-sm text-gray-500">
                        {{ isRequestMode ? 'Confirm recipients and send signature requests.' : 'Confirm the details below before finishing.' }}
                    </p>
                </div>

                <section class="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div class="border-b border-gray-100 px-5 py-3">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Document</p>
                    </div>
                    <div class="divide-y divide-gray-50 px-5">
                        <div class="flex items-center justify-between py-3">
                            <span class="text-xs text-gray-500">File name</span>
                            <span class="max-w-[60%] truncate text-right text-sm font-medium text-gray-900">
                                {{ session.filename }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between py-3">
                            <span class="text-xs text-gray-500">Pages</span>
                            <span class="text-sm font-medium text-gray-900">
                                {{ pageCount > 0 ? pageCount : '—' }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between py-3">
                            <span class="text-xs text-gray-500">File size</span>
                            <span class="text-sm font-medium text-gray-900">
                                {{ formatFileSize(session.fileSize) }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between py-3">
                            <span class="text-xs text-gray-500">Fields placed</span>
                            <span class="text-sm font-medium text-gray-900">{{ fieldCount }}</span>
                        </div>
                        <div v-if="isRequestMode && recipientCount > 0" class="flex items-center justify-between py-3">
                            <span class="text-xs text-gray-500">Recipients</span>
                            <span class="text-sm font-medium text-gray-900">{{ recipientCount }}</span>
                        </div>
                    </div>
                </section>

                <section v-if="isRequestMode && recipientCount > 0" class="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div class="border-b border-gray-100 px-5 py-3">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Recipients</p>
                    </div>
                    <ul class="divide-y divide-gray-50">
                        <li
                            v-for="r in reviewRecipients"
                            :key="r.id"
                            class="px-5 py-3"
                        >
                            <div class="flex items-center gap-3">
                                <span
                                    class="h-2.5 w-2.5 shrink-0 rounded-full"
                                    :style="{ backgroundColor: r.color }"
                                />
                                <div class="min-w-0 flex-1">
                                    <p class="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                        Recipient #{{ r.signingOrder }}
                                    </p>
                                    <p class="truncate text-sm font-medium text-gray-900">{{ r.name }}</p>
                                    <p class="truncate text-xs text-gray-400">{{ r.email }}</p>
                                </div>
                                <span class="shrink-0 text-xs font-medium text-gray-700">
                                    {{ recipientFieldCount(r) }} {{ recipientFieldCount(r) === 1 ? 'Field' : 'Fields' }} Assigned
                                </span>
                            </div>
                            <div
                                v-if="recipientFieldCount(r) > 0"
                                class="mt-2 flex flex-wrap gap-1.5 pl-5"
                            >
                                <span
                                    v-for="label in recipientFieldTypeLabels(r)"
                                    :key="label"
                                    class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                                >
                                    {{ label }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </section>

                <div
                    v-if="alreadyPrepared"
                    class="mb-6 flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3"
                >
                    <svg class="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-sm text-blue-800">
                        Signature requests have already been sent for this document.
                    </p>
                </div>

                <div
                    v-if="isRequestMode && isSending"
                    class="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white px-5 py-4"
                >
                    <ul class="space-y-3">
                        <li
                            v-for="step in SEND_STEPS"
                            :key="step.id"
                            class="flex items-center gap-3"
                        >
                            <span
                                :class="[
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                                    stepStatus(step.id) === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                                    stepStatus(step.id) === 'active' ? 'bg-blue-100 text-blue-600' :
                                    'bg-gray-100 text-gray-400',
                                ]"
                            >
                                <svg
                                    v-if="stepStatus(step.id) === 'complete'"
                                    class="h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                                </svg>
                                <svg
                                    v-else-if="stepStatus(step.id) === 'active' && step.id !== 'done'"
                                    class="h-3 w-3 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                <span v-else class="h-1.5 w-1.5 rounded-full bg-current opacity-50"/>
                            </span>
                            <span
                                :class="[
                                    'text-sm',
                                    stepStatus(step.id) === 'active' ? 'font-medium text-gray-900' :
                                    stepStatus(step.id) === 'complete' ? 'text-gray-600' :
                                    'text-gray-400',
                                ]"
                            >
                                {{ step.label }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div
                    v-if="!isRequestMode && signedPdfReady"
                    class="mb-6 flex items-center gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3"
                >
                    <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <p class="text-sm font-medium text-emerald-700">
                        Your signed PDF is ready to download.
                    </p>
                </div>

                <div
                    v-if="finishError || sendError"
                    class="mb-4 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                >
                    <svg class="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-sm font-medium text-red-700">{{ finishError || sendError }}</p>
                </div>

                <div
                    v-if="alreadyPrepared"
                    class="flex flex-col gap-3 sm:flex-row"
                >
                    <Link
                        v-if="documentId"
                        :href="route('documents.show', documentId)"
                        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        View Document
                    </Link>
                    <Link
                        :href="route(usePage().props.auth?.home || 'overview')"
                        class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <div v-else class="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        :disabled="buttonsDisabled"
                        :class="[
                            'flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition',
                            buttonsDisabled
                                ? 'cursor-not-allowed text-gray-400 opacity-60'
                                : 'text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                        ]"
                        @click="backToEditor"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to Editor
                    </button>

                    <button
                        v-if="isRequestMode && recipientCount > 0"
                        type="button"
                        :disabled="buttonsDisabled"
                        :class="[
                            'flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold shadow-sm transition',
                            buttonsDisabled
                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
                        ]"
                        @click="sendForSignature"
                    >
                        <svg v-if="isSending" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Send for Signature
                        <svg v-if="!isSending" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>

                    <button
                        v-else-if="!isRequestMode"
                        type="button"
                        :disabled="buttonsDisabled"
                        :class="[
                            'flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold shadow-sm transition',
                            buttonsDisabled
                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
                        ]"
                        @click="finishSigning"
                    >
                        <svg v-if="isBusy" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Finish Signing
                        <svg v-if="!isBusy" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>

            </template>
        </div>
    </SignLayout>
</template>
