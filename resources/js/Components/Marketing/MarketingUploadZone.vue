<script setup>
import { Link } from '@inertiajs/vue3';
import { CTA_UPLOAD_PDF } from '@/constants/marketing';

const cloudProviders = [
    { label: 'Google Drive', icon: 'google' },
    { label: 'Dropbox', icon: 'dropbox' },
];
</script>

<template>
    <Link
        :href="route('sign.index')"
        class="group marketing-upload-card block rounded-3xl border-2 border-dashed border-blue-200/90 bg-white p-8 shadow-lg shadow-blue-100/40 transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-200/50 sm:p-10"
    >
        <div class="flex justify-center">
            <span class="marketing-btn-ripple inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-blue-700 group-hover:shadow-xl group-hover:shadow-blue-600/35 sm:px-12 sm:py-4.5">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {{ CTA_UPLOAD_PDF }}
            </span>
        </div>

        <p class="mt-6 text-center text-sm font-medium text-gray-500">
            or drag &amp; drop your PDF here
        </p>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span
                v-for="provider in cloudProviders"
                :key="provider.label"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50/80 px-4 py-2 text-xs font-medium text-gray-500 transition-colors group-hover:border-gray-300 group-hover:bg-white"
                aria-hidden="true"
            >
                <svg v-if="provider.icon === 'google'" class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="#0061FF" aria-hidden="true">
                    <path d="M6 2L18 2C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2ZM12 6L7 14H11L10 18L17 10H13L12 6Z"/>
                </svg>
                {{ provider.label }}
            </span>
        </div>

        <p class="mt-6 text-center text-xs font-semibold tracking-wide text-gray-400 uppercase">No account required</p>
    </Link>
</template>
