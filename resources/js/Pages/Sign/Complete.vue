<script setup>
import { Link } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';

const props = defineProps({
    session: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <SignLayout :step="4">
        <div class="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">

            <div class="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-100">
                <svg class="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 class="mt-6 text-2xl font-bold text-gray-900">Document signed</h1>
            <p class="mt-2 text-sm text-gray-500">{{ session.filename }}</p>

            <p class="mt-6 text-sm text-gray-500">
                Download will be available once the signing flow is complete.
            </p>

            <div class="mt-8">
                <Link
                    :href="route('sign.index')"
                    class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    Sign another PDF
                </Link>
            </div>

        </div>
    </SignLayout>
</template>
