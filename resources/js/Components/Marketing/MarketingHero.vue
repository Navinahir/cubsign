<script setup>
import { Link } from '@inertiajs/vue3';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import HeroFlowPreview from '@/Components/Marketing/HeroFlowPreview.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import { EARLY_ACCESS_HEADLINE, CTA_SIGN_PDF_NOW, btnPrimary, heroTrustBadges } from '@/constants/marketing';

defineProps({
    hasSignSession: { type: Boolean, default: false },
});
</script>

<template>
    <section class="marketing-gradient-hero relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:pb-20 lg:pt-16">
        <DecorativeBg pattern="grid" />
        <div class="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl marketing-gradient-shift" />

        <div class="relative mx-auto max-w-7xl">
            <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <ScrollReveal>
                    <div class="mb-6">
                        <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 motion-reduce:animate-none" />
                            {{ EARLY_ACCESS_HEADLINE }}
                        </span>
                    </div>

                    <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                        Sign your PDF online
                        <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent"> in seconds</span>
                    </h1>

                    <p class="mt-5 max-w-lg text-lg leading-relaxed text-gray-600">
                        Upload a PDF, add your signature, and download the signed document. No printing, no scanning.
                    </p>

                    <div class="mt-8 flex flex-col items-center sm:items-start">
                        <Link
                            :href="route('sign.index')"
                            :class="[btnPrimary, 'marketing-btn-ripple w-full px-10 py-4 text-base sm:w-auto sm:min-w-[220px]']"
                        >
                            {{ CTA_SIGN_PDF_NOW }}
                        </Link>
                        <p class="mt-3 text-center text-sm text-gray-500 sm:text-left">
                            No account required &bull; Free during Early Access
                        </p>
                        <p class="mt-4 text-center text-sm text-gray-600 sm:text-left">
                            Already have an account?
                            <Link :href="route('login')" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                Log in &rarr;
                            </Link>
                        </p>
                    </div>

                    <div v-if="hasSignSession" class="mt-4">
                        <Link :href="route('sign.editor')" class="text-sm font-medium text-blue-600 hover:underline">
                            Continue signing &rarr;
                        </Link>
                    </div>

                    <div class="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div
                            v-for="badge in heroTrustBadges"
                            :key="badge"
                            class="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm"
                        >
                            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                                <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            {{ badge }}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="right" :delay="120">
                    <div class="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:pl-4">
                        <HeroFlowPreview />
                    </div>
                </ScrollReveal>
            </div>
        </div>
    </section>
</template>
