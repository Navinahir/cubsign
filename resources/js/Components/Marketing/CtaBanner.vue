<script setup>
import { Link } from '@inertiajs/vue3';
import { CTA_UPLOAD_PDF, btnPrimary } from '@/constants/marketing';

defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    primaryLabel: { type: String, default: '' },
    primaryHref: { type: String, default: '' },
    footerNote: { type: String, default: '' },
    variant: { type: String, default: 'gradient' },
});

const variantClasses = {
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-700 text-white',
    premium: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white',
    light: 'bg-gray-50 border border-gray-200 text-gray-900',
    dark: 'bg-gray-900 text-white',
};
</script>

<template>
    <div
        v-if="variant === 'premium'"
        class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 px-6 py-14 shadow-2xl shadow-blue-900/25 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
    >
        <div class="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl marketing-gradient-shift" aria-hidden="true" />

        <div class="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div class="order-2 text-center lg:order-1 lg:text-left">
                <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">{{ title }}</h2>
                <p v-if="description" class="mt-5 max-w-md text-base leading-relaxed text-blue-100 sm:text-lg lg:mt-6">{{ description }}</p>
                <div class="mt-10 flex flex-col items-center lg:items-start">
                    <Link
                        :href="primaryHref || route('sign.index')"
                        :class="[btnPrimary, 'marketing-btn-ripple !bg-white !text-gray-900 !shadow-xl hover:!bg-gray-50 px-12 py-4.5 text-lg sm:min-w-[260px]']"
                    >
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {{ primaryLabel || CTA_UPLOAD_PDF }}
                    </Link>
                    <p v-if="footerNote" class="mt-5 text-sm font-medium text-blue-100/90">{{ footerNote }}</p>
                </div>
            </div>

            <div class="order-1 flex justify-center lg:order-2">
                <div class="marketing-float w-full max-w-sm">
                    <div class="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md shadow-2xl shadow-black/10">
                        <div class="rounded-2xl border-2 border-dashed border-white/35 bg-white/5 p-8 text-center">
                            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20">
                                <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p class="mt-5 text-base font-semibold text-white">Drag &amp; Drop</p>
                            <p class="mt-1.5 text-sm text-blue-100/80">Drop your PDF here</p>
                            <div class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-lg">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                {{ CTA_UPLOAD_PDF }}
                            </div>
                        </div>
                        <div class="mt-4 flex justify-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                                <svg class="h-5 w-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                                <svg class="h-5 w-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else :class="['relative overflow-hidden rounded-3xl px-8 py-14 shadow-xl sm:px-12 sm:py-16', variantClasses[variant]]">
        <div v-if="variant === 'gradient'" class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl marketing-gradient-shift" />
        <div class="relative text-center">
            <span v-if="eyebrow" :class="['mb-4 inline-flex rounded-full px-4 py-1 text-xs font-semibold', variant === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-white/15 text-white backdrop-blur-sm']">{{ eyebrow }}</span>
            <h2 :class="['text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl', variant === 'light' ? 'text-gray-900' : 'text-white']">{{ title }}</h2>
            <p v-if="description" :class="['mx-auto mt-4 max-w-xl text-base sm:text-lg', variant === 'light' ? 'text-gray-600' : variant === 'gradient' ? 'text-blue-100' : 'text-gray-300']">{{ description }}</p>
            <div class="mt-8 flex flex-col items-center justify-center">
                <Link
                    :href="primaryHref || route('sign.index')"
                    :class="[
                        'marketing-btn-ripple inline-flex w-full items-center justify-center gap-2 rounded-xl px-10 py-4 text-base font-semibold shadow-sm transition-all sm:w-auto sm:min-w-[220px]',
                        variant === 'light' ? btnPrimary : 'bg-white text-gray-900 hover:bg-gray-50',
                    ]"
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {{ primaryLabel || CTA_UPLOAD_PDF }}
                </Link>
                <p v-if="footerNote" :class="['mt-4 text-sm', variant === 'light' ? 'text-gray-500' : variant === 'gradient' ? 'text-blue-100/90' : 'text-gray-400']">
                    {{ footerNote }}
                </p>
            </div>
        </div>
    </div>
</template>
