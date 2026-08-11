<script setup>
import { ref } from 'vue';
import SignatureField from '@/Components/SignatureField.vue';
import BrandLogo from '@/Components/BrandLogo.vue';
import SeoRobotsHead from '@/Components/SeoRobotsHead.vue';

const props = defineProps({
    token:         { type: String,  required: true },
    recipient:     { type: Object,  required: true },
    document:      { type: Object,  required: true },
    fields:        { type: Array,   default: () => [] },
    alreadySigned: { type: Boolean, default: false },
    notYetTurn:    { type: Boolean, default: false },
});

const fieldValues        = ref({});
const signatureFieldRefs = ref({});
const submitState        = ref('idle');
const submitError        = ref('');

props.fields.forEach(f => {
    if (f.type === 'date')          fieldValues.value[f.id] = new Date().toISOString().split('T')[0];
    else if (f.type === 'checkbox') fieldValues.value[f.id] = false;
    else if (f.type !== 'signature' && f.type !== 'initials') {
        fieldValues.value[f.id] = f.value ?? '';
    }
});

function setSignatureFieldRef(fieldId, el) {
    if (el) signatureFieldRefs.value[fieldId] = el;
}

function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });
}

function collectSignedFields() {
    return props.fields.map(f => {
        if (f.type === 'signature' || f.type === 'initials') {
            const comp = signatureFieldRefs.value[f.id];
            const png  = comp?.exportPng?.() ?? '';
            return { id: f.id, type: f.type, value: png };
        }
        return {
            id:    f.id,
            type:  f.type,
            value: fieldValues.value[f.id] ?? '',
        };
    });
}

async function finishSigning() {
    if (submitState.value === 'loading') return;
    submitState.value = 'loading';
    submitError.value = '';

    const signed = collectSignedFields();

    const missingDrawn = props.fields.some(f => {
        if (f.type !== 'signature' && f.type !== 'initials') return false;
        const val = signed.find(s => s.id === f.id)?.value ?? '';
        return val === '';
    });

    if (missingDrawn) {
        submitError.value = 'Please complete all signature and initials fields before finishing.';
        submitState.value = 'error';
        return;
    }

    try {
        const xsrf = decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
        const res = await fetch(route('recipient.complete', props.token), {
            method:      'POST',
            credentials: 'same-origin',
            headers:     { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf },
            body:        JSON.stringify({ signed_fields: signed }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            submitError.value = data.message ?? 'Something went wrong. Please try again.';
            submitState.value = 'error';
            return;
        }

        submitState.value = 'success';
    } catch {
        submitError.value = 'Network error. Please check your connection.';
        submitState.value = 'error';
    }
}
</script>

<template>
    <div class="flex h-screen flex-col bg-gray-50">
        <SeoRobotsHead />

        <!-- Header -->
        <header class="shrink-0 border-b border-gray-200 bg-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-14 items-center justify-between">
                    <BrandLogo variant="navbar" />
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg class="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        Secure &amp; Private
                    </div>
                </div>
            </div>
        </header>

        <!-- Not yet your turn -->
        <div v-if="notYetTurn" class="flex flex-1 items-center justify-center p-8">
            <div class="max-w-sm rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <svg class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h2 class="mb-1 text-lg font-semibold text-amber-900">Waiting for others</h2>
                <p class="text-sm text-amber-700">
                    Other signers need to complete their signatures before it's your turn to sign
                    <strong>{{ document.name }}</strong>.
                </p>
                <p class="mt-2 text-xs text-amber-600">You will be notified when it's your turn.</p>
            </div>
        </div>

        <!-- Already signed -->
        <div v-else-if="alreadySigned" class="flex flex-1 items-center justify-center p-8">
            <div class="max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="mb-1 text-lg font-semibold text-emerald-900">Already signed</h2>
                <p class="text-sm text-emerald-700">
                    You have already signed <strong>{{ document.name }}</strong>. No further action is needed.
                </p>
                <p v-if="recipient.signed_at" class="mt-2 text-xs text-emerald-600">
                    Signed {{ formatDate(recipient.signed_at) }}
                </p>
            </div>
        </div>

        <!-- Signing complete -->
        <div v-else-if="submitState === 'success'" class="flex flex-1 items-center justify-center p-8">
            <div class="max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="mb-1 text-lg font-semibold text-emerald-900">Signing complete</h2>
                <p class="text-sm text-emerald-700">
                    Thank you, <strong>{{ recipient.name }}</strong>. Your signature has been recorded for
                    <em>{{ document.name }}</em>.
                </p>
            </div>
        </div>

        <!-- Main signing view -->
        <div v-else class="flex min-h-0 flex-1 overflow-hidden">

            <!-- PDF preview (desktop only) -->
            <div class="hidden min-w-0 flex-1 flex-col border-r border-gray-200 bg-white lg:flex">
                <div class="shrink-0 border-b border-gray-100 px-5 py-3">
                    <p class="text-sm font-medium text-gray-700">{{ document.name }}</p>
                </div>
                <iframe
                    :src="route('recipient.pdf', token)"
                    class="min-h-0 flex-1 w-full"
                    title="Document preview"
                />
            </div>

            <!-- Signing panel -->
            <div class="flex w-full flex-col overflow-y-auto lg:w-96 lg:shrink-0">
                <div class="px-6 py-6">

                    <div class="mb-5 flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            :style="{ backgroundColor: recipient.color || '#3B82F6' }"
                        >
                            {{ (recipient.name || '#')[0].toUpperCase() }}
                        </span>
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-gray-900">{{ recipient.name }}</p>
                            <p class="truncate text-xs text-gray-500">{{ recipient.email }}</p>
                        </div>
                    </div>

                    <h1 class="mb-0.5 text-base font-bold text-gray-900">Sign document</h1>
                    <p class="mb-6 text-sm text-gray-500">
                        Complete the fields below to sign <em>{{ document.name }}</em>.
                    </p>

                    <div
                        v-if="fields.length === 0"
                        class="mb-6 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                        No fields have been assigned to you in this document.
                    </div>

                    <div v-else class="mb-6 space-y-5">
                        <div v-for="field in fields" :key="field.id">

                            <p class="mb-1.5 text-xs font-semibold text-gray-600">
                                <template v-if="field.type === 'signature'">Signature</template>
                                <template v-else-if="field.type === 'initials'">Initials</template>
                                <template v-else-if="field.type === 'date'">Date</template>
                                <template v-else-if="field.type === 'checkbox'">{{ field.label || 'Checkbox' }}</template>
                                <template v-else>{{ field.label || 'Text' }}</template>
                            </p>

                            <SignatureField
                                v-if="field.type === 'signature' || field.type === 'initials'"
                                :ref="el => setSignatureFieldRef(field.id, el)"
                                :is-initials="field.type === 'initials'"
                            />

                            <input
                                v-else-if="field.type === 'date'"
                                v-model="fieldValues[field.id]"
                                type="date"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />

                            <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
                                <input
                                    :id="`field-${field.id}`"
                                    v-model="fieldValues[field.id]"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label :for="`field-${field.id}`" class="text-sm text-gray-700">
                                    {{ field.label || 'I agree' }}
                                </label>
                            </div>

                            <input
                                v-else
                                v-model="fieldValues[field.id]"
                                type="text"
                                :placeholder="field.label || 'Enter text'"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />

                        </div>
                    </div>

                    <div
                        v-if="submitState === 'error'"
                        class="mb-4 flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {{ submitError }}
                    </div>

                    <button
                        :disabled="submitState === 'loading'"
                        :class="[
                            'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition',
                            submitState === 'loading'
                                ? 'cursor-not-allowed bg-blue-400'
                                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]',
                        ]"
                        @click="finishSigning"
                    >
                        <svg v-if="submitState === 'loading'" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        {{ submitState === 'loading' ? 'Signing…' : 'Finish Signing' }}
                    </button>

                </div>
            </div>
        </div>

    </div>
</template>
