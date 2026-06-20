<script setup>
import { Link } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';

const steps = [
    {
        number: 1,
        title: 'Upload your PDF',
        description: 'Select or drag in any PDF file up to 25 MB.',
        icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    },
    {
        number: 2,
        title: 'Preview your document',
        description: 'Review the PDF before adding your signature.',
        icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    },
    {
        number: 3,
        title: 'Sign the document',
        description: 'Draw or type your signature and place it on the PDF.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    },
    {
        number: 4,
        title: 'Download signed PDF',
        description: 'Save your signed document instantly — no account required.',
        icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    },
];
</script>

<template>
    <SignLayout :step="1">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">

            <!-- Headline -->
            <div class="text-center">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Sign any PDF in seconds
                </h1>
                <p class="mt-3 text-base text-gray-500">
                    Free forever. No account needed. Works in any browser.
                </p>
            </div>

            <!-- Steps -->
            <div class="mt-12 space-y-4">
                <div
                    v-for="s in steps"
                    :key="s.number"
                    class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <svg class="h-4.5 w-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="s.icon" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-900">
                            <span class="mr-1.5 text-blue-600">{{ s.number }}.</span>{{ s.title }}
                        </p>
                        <p class="mt-0.5 text-sm text-gray-500">{{ s.description }}</p>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="mt-10 text-center">
                <Link
                    :href="route('sign.upload')"
                    class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    Upload PDF
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
                <p class="mt-3 text-xs text-gray-400">PDF only · Max 25 MB · No account required</p>
            </div>

        </div>
    </SignLayout>
</template>
