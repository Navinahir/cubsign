<script setup>
import { ref, onMounted } from 'vue';
import { router } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';

const props = defineProps({
    session: {
        type: Object,
        required: true,
    },
});

const pageCount      = ref(0);
const fieldCount     = ref(0);
const recipientCount = ref(0);
const dataReady      = ref(false);

onMounted(() => {
    const s = window.__cubsignSession;
    if (s?.token === props.session.token && s?.reviewData) {
        pageCount.value      = s.reviewData.pageCount      ?? 0;
        fieldCount.value     = s.reviewData.fieldCount     ?? 0;
        recipientCount.value = s.reviewData.recipientCount ?? 0;
        dataReady.value      = true;
    }
});

function formatFileSize(bytes) {
    if (!bytes) return '—';
    if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
}

function backToEditor() {
    router.visit(route('sign.editor'));
}

function finishSigning() {
    router.visit(route('sign.complete'));
}
</script>

<template>
    <SignLayout :step="3">
        <div class="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">

            <!-- Lost session fallback -->
            <div v-if="!dataReady" class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                <p class="mb-1 font-semibold text-amber-800">Session data not found</p>
                <p class="mb-4 text-sm text-amber-700">
                    Your editor session was lost. Please return to the editor to continue.
                </p>
                <button
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    @click="backToEditor"
                >
                    Back to Editor
                </button>
            </div>

            <template v-else>

                <!-- Title -->
                <div class="mb-6">
                    <h1 class="text-xl font-bold text-gray-900">Review Document</h1>
                    <p class="mt-0.5 text-sm text-gray-500">Confirm the details below before finishing.</p>
                </div>

                <!-- Document info -->
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
                        <div v-if="recipientCount > 0" class="flex items-center justify-between py-3">
                            <span class="text-xs text-gray-500">Recipients</span>
                            <span class="text-sm font-medium text-gray-900">{{ recipientCount }}</span>
                        </div>
                    </div>
                </section>

                <!-- Ready indicator -->
                <div class="mb-6 flex items-center gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <p class="text-sm font-medium text-emerald-700">
                        Your signed PDF is ready to download.
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between">
                    <button
                        class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                        @click="backToEditor"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to Editor
                    </button>

                    <button
                        class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                        @click="finishSigning"
                    >
                        Finish Signing
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>

            </template>
        </div>
    </SignLayout>
</template>
