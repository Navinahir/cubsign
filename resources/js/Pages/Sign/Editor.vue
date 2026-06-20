<script setup>
import { Link } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';

const props = defineProps({
    session: {
        type: Object,
        required: true,
    },
});

function formatSize(bytes) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (bytes / 1024 * 1024)).toFixed(1) + ' MB';
}
</script>

<template>
    <SignLayout :step="2">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">

            <!-- Upload success banner -->
            <div class="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm font-semibold text-emerald-800">PDF uploaded successfully</p>
                    <p class="mt-0.5 truncate text-xs text-emerald-600">{{ session.filename }}</p>
                </div>
            </div>

            <!-- Editor placeholder -->
            <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <!-- Toolbar skeleton -->
                <div class="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
                    <div class="h-5 w-24 animate-pulse rounded bg-gray-200" />
                    <div class="h-5 w-16 animate-pulse rounded bg-gray-200" />
                    <div class="h-5 w-20 animate-pulse rounded bg-gray-200" />
                </div>

                <!-- PDF preview area placeholder -->
                <div class="flex min-h-96 flex-col items-center justify-center px-8 py-16 text-center">
                    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                        <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <h2 class="mt-5 text-base font-semibold text-gray-900">PDF editor — coming next</h2>
                    <p class="mt-2 max-w-xs text-sm text-gray-500">
                        Your PDF is ready. The signature editor (PDF preview, draw &amp; place signature) will be available in the next build.
                    </p>
                    <div class="mt-6 flex items-center gap-3">
                        <Link
                            :href="route('sign.index')"
                            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            ← Upload another
                        </Link>
                    </div>
                </div>
            </div>

            <!-- Token (debug info, small) -->
            <p class="mt-4 text-center text-xs text-gray-300">
                Session: {{ session.token }}
            </p>

        </div>
    </SignLayout>
</template>
