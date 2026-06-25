<script setup>
import { Link } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';

const props = defineProps({
    summary: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <SignLayout :step="4">
        <div class="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">

            <div class="mb-8 text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <svg class="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Signature requests sent</h1>
                <p class="mt-2 text-sm text-gray-500">Your document has been sent successfully.</p>
            </div>

            <div
                v-if="summary.warning"
                class="mb-6 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
            >
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                <p class="text-sm text-amber-800">{{ summary.warning }}</p>
            </div>

            <section class="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div class="border-b border-gray-100 px-5 py-3">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Recipients</p>
                </div>
                <ul class="divide-y divide-gray-50">
                    <li
                        v-for="(recipient, index) in summary.recipients"
                        :key="`${recipient.email}-${index}`"
                        class="flex items-center justify-between px-5 py-3.5"
                    >
                        <div class="min-w-0">
                            <p class="truncate text-sm font-medium text-gray-900">{{ recipient.name }}</p>
                            <p class="truncate text-xs text-gray-400">{{ recipient.email }}</p>
                        </div>
                        <span class="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-600">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </span>
                    </li>
                </ul>
            </section>

            <div class="flex flex-col gap-3 sm:flex-row">
                <Link
                    :href="route('documents.show', summary.document_id)"
                    class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    View Document
                </Link>
                <Link
                    :href="route('overview')"
                    class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    </SignLayout>
</template>
