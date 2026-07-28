<script setup>
import { Link } from '@inertiajs/vue3';
import { CTA_UPLOAD_PDF, heroTrustBadges } from '@/constants/marketing';
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

        <ul class="mt-6 flex flex-wrap items-center justify-center gap-2">
            <li
                v-for="badge in heroTrustBadges"
                :key="badge"
                class="rounded-full border border-gray-200/80 bg-gray-50/80 px-3.5 py-1.5 text-xs font-medium text-gray-600"
            >
                {{ badge }}
            </li>
        </ul>

        <p class="mt-6 text-center text-xs font-semibold tracking-wide text-gray-400 uppercase">PDF files up to 25 MB</p>
    </Link>
</template>
