<script setup>
import { Link } from '@inertiajs/vue3';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import HeroFlowPreview from '@/Components/Marketing/HeroFlowPreview.vue';
import MarketingUploadZone from '@/Components/Marketing/MarketingUploadZone.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import { EARLY_ACCESS_HEADLINE } from '@/constants/marketing';

defineProps({
    hasSignSession: { type: Boolean, default: false },
});
</script>

<template>
    <section class="marketing-gradient-hero relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 lg:pb-28 lg:pt-16">
        <DecorativeBg pattern="grid" />
        <div class="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl marketing-gradient-shift" />

        <div class="relative mx-auto max-w-7xl">
            <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                <ScrollReveal>
                    <div class="mb-6">
                        <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 motion-reduce:animate-none" />
                            {{ EARLY_ACCESS_HEADLINE }}
                        </span>
                    </div>

                    <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                        Securely upload and
                        <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent"> sign</span> your PDF online
                    </h1>

                    <p class="mt-5 max-w-lg text-lg leading-relaxed text-gray-600">
                        Add your signature and download the finished document in seconds. No printing, no scanning.
                    </p>

                    <div class="mt-10">
                        <MarketingUploadZone />
                    </div>

                    <div v-if="hasSignSession" class="mt-6 text-center sm:text-left">
                        <Link :href="route('sign.editor')" class="text-sm font-medium text-blue-600 hover:underline">
                            Continue signing &rarr;
                        </Link>
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
