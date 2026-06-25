<script setup>
import { ref, computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';
import {
    fieldTypeLabel,
    fieldsForRecipient,
    validateRequestSigning,
} from '@/Components/Editor/editorHelpers';

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

const pageCount        = ref(0);
const fieldCount       = ref(0);
const recipientCount   = ref(0);
const reviewRecipients = ref([]);
const placedFields     = ref([]);
const signingMode      = ref('self');
const documentId       = ref(null);
const initError        = ref('');
const initState        = ref('loading');
const sendState        = ref('idle');
const sendError        = ref('');
const sendWarning      = ref('');
const finishError      = ref('');
const isFinalized      = ref(props.documentFinalized);

const isAuthenticated = computed(() => !!usePage().props.auth?.user);
const isRequestMode   = computed(() => signingMode.value === 'request');

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
        if (props.alreadyPrepared) {
            sendState.value = 'success';
        }
        return true;
    }

    const cs = typeof window !== 'undefined' ? window.__cubsignSession : null;
    const sessionReview = cs?.token === props.session.token ? cs?.reviewData : null;

    if (sessionReview) {
        hydrateFromReviewData(sessionReview, cs.documentId ?? props.documentId ?? null);
        if (cs.documentSaved) {
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

function backToEditor() {
    router.visit(route('sign.editor'));
}

function runValidation() {
    return validateRequestSigning({
        signingMode:    signingMode.value,
        recipients:     reviewRecipients.value,
        placedFields:   placedFields.value,
        documentId:     documentId.value,
        documentSaved:  isFinalized.value,
    });
}

function finishSigning() {
    finishError.value = '';
    const errors = runValidation();
    if (errors.length > 0) {
        finishError.value = errors[0];
        return;
    }
    router.visit(route('sign.complete'));
}

const canPrepare = computed(() =>
    recipientCount.value > 0
    && documentId.value !== null
    && isFinalized.value
    && sendState.value !== 'success'
    && sendState.value !== 'warning'
);

async function prepareRequests() {
    finishError.value = '';
    const errors = runValidation();
    if (errors.length > 0) {
        sendError.value = errors[0];
        sendState.value = 'error';
        return;
    }

    if (!canPrepare.value || sendState.value === 'loading') return;
    sendState.value = 'loading';
    sendError.value = '';
    sendWarning.value = '';

    try {
        const xsrf = decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
        const res = await fetch(route('documents.send', documentId.value), {
            method:      'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf },
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
            sendError.value = data.message ?? data.errors?.[0] ?? 'Something went wrong. Please try again.';
            sendState.value = 'error';
            return;
        }

        if (data.warning) {
            sendWarning.value = data.warning;
            sendState.value = 'warning';
            return;
        }

        sendState.value = 'success';
    } catch (e) {
        sendError.value = 'Network error. Please check your connection and try again.';
        sendState.value = 'error';
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
                    <p class="mt-0.5 text-sm text-gray-500">Confirm the details below before finishing.</p>
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

                    <div
                        v-if="sendState === 'success'"
                        class="flex items-center gap-2.5 border-t border-emerald-100 bg-emerald-50 px-5 py-3"
                    >
                        <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <p class="text-sm font-medium text-emerald-700">Recipients prepared successfully.</p>
                    </div>

                    <div
                        v-if="sendState === 'warning'"
                        class="flex items-center gap-2.5 border-t border-amber-100 bg-amber-50 px-5 py-3"
                    >
                        <svg class="h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        </svg>
                        <p class="text-sm font-medium text-amber-800">{{ sendWarning }}</p>
                    </div>

                    <div
                        v-if="sendState === 'error'"
                        class="flex items-center gap-2.5 border-t border-red-100 bg-red-50 px-5 py-3"
                    >
                        <svg class="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-sm font-medium text-red-700">{{ sendError }}</p>
                    </div>
                </section>

                <div
                    v-if="!isRequestMode"
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
                    v-if="finishError"
                    class="mb-4 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                >
                    <svg class="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-sm font-medium text-red-700">{{ finishError }}</p>
                </div>

                <div class="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                        @click="backToEditor"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to Editor
                    </button>

                    <div class="flex items-center gap-2">
                        <button
                            v-if="isRequestMode && recipientCount > 0"
                            :disabled="!canPrepare || sendState === 'loading'"
                            :class="[
                                'flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition',
                                sendState === 'success'
                                    ? 'cursor-default bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : sendState === 'warning'
                                        ? 'cursor-default bg-amber-50 text-amber-800 border border-amber-200'
                                    : canPrepare && sendState !== 'loading'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400',
                            ]"
                            @click="prepareRequests"
                        >
                            <svg v-if="sendState === 'loading'" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            <svg v-else-if="sendState === 'success' || sendState === 'warning'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span>{{ sendState === 'loading' ? 'Preparing…' : sendState === 'success' || sendState === 'warning' ? 'Prepared' : 'Prepare Requests' }}</span>
                        </button>

                        <button
                            type="button"
                            class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                            @click="finishSigning"
                        >
                            Finish Signing
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                </div>

            </template>
        </div>
    </SignLayout>
</template>
