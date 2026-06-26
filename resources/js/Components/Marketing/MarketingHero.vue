<script setup>
import { Link } from '@inertiajs/vue3';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import ProductMockup from '@/Components/Marketing/ProductMockup.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import FloatingTrustIndicators from '@/Components/FloatingTrustIndicators.vue';
import { EARLY_ACCESS_HEADLINE, CTA_START_SIGNING, btnPrimary, btnSecondary, heroTrustBadges } from '@/constants/marketing';

defineProps({
    hasSignSession: { type: Boolean, default: false },
});
</script>

<template>
    <section class="marketing-gradient-hero relative overflow-hidden px-4 pb-10 pt-10 sm:px-6 lg:pb-12 lg:pt-14">
        <DecorativeBg pattern="grid" />
        <div class="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl marketing-gradient-shift" />

        <div class="relative mx-auto max-w-7xl">
            <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
                <ScrollReveal>
                    <div class="mb-5 flex flex-wrap items-center gap-3">
                        <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 motion-reduce:animate-none" />
                            {{ EARLY_ACCESS_HEADLINE }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                            Encrypted documents
                        </span>
                    </div>

                    <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                        Sign PDFs online<br />
                        <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">in minutes</span>
                    </h1>

                    <p class="mt-4 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
                        Upload a PDF, add your signature, and download or send the finished file. Free during Early Access.
                    </p>

                    <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link :href="route('register')" :class="[btnPrimary, 'marketing-btn-ripple text-base']">{{ CTA_START_SIGNING }}</Link>
                        <Link :href="route('sign.index')" :class="btnSecondary">Sign Without Account</Link>
                    </div>

                    <FloatingTrustIndicators />

                    <div v-if="hasSignSession" class="mt-3">
                        <Link :href="route('sign.editor')" class="text-sm text-blue-600 hover:underline">Continue signing &rarr;</Link>
                    </div>

                    <div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-2">
                        <span v-for="badge in heroTrustBadges" :key="badge" class="flex items-center gap-2 rounded-lg border border-gray-100 bg-white/80 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                            <svg class="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            {{ badge }}
                        </span>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="right" :delay="120">
                    <div class="relative mx-auto w-full max-w-lg lg:mx-0">
                        <ProductMockup variant="editor" size="large" />

                        <div class="marketing-float absolute -left-4 top-8 z-20 hidden w-44 rounded-xl bg-white p-3 shadow-xl ring-1 ring-gray-100 sm:block">
                            <p class="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Dashboard</p>
                            <div class="mt-2 flex items-center justify-between">
                                <span class="text-lg font-bold text-gray-900">12</span>
                                <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">+3 today</span>
                            </div>
                            <p class="text-[10px] text-gray-500">Documents this week</p>
                        </div>

                        <div class="absolute -bottom-3 -right-3 z-20 hidden items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-xl ring-1 ring-gray-100 sm:flex">
                            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <div>
                                <p class="text-xs font-semibold text-gray-900">Signature saved</p>
                                <p class="text-[10px] text-gray-500">Audit trail included</p>
                            </div>
                        </div>

                        <div class="absolute -right-2 top-1/2 z-20 hidden rounded-lg bg-gray-900 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg sm:block">
                            AES-256
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    </section>
</template>
