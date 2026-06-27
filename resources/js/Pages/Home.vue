<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import StickyMobileCta from '@/Components/StickyMobileCta.vue';
import MarketingHero from '@/Components/Marketing/MarketingHero.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import ComparisonSection from '@/Components/Marketing/ComparisonSection.vue';
import SocialProof from '@/Components/Marketing/SocialProof.vue';
import PricingSection from '@/Components/Marketing/PricingSection.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import ProductMockup from '@/Components/Marketing/ProductMockup.vue';
import { CTA_SIGN_PDF_NOW } from '@/constants/marketing';

defineProps({ hasSignSession: { type: Boolean, default: false } });
</script>

<template>
    <MarketingSeo
        title="CubSign – Sign PDFs Online Free"
        description="Sign PDFs online in seconds. Upload a document, add your signature, and download the finished PDF. No account required."
        path="/"
        type="website"
    />

    <PublicLayout>
        <div class="pb-20 md:pb-0">
            <MarketingHero :has-sign-session="hasSignSession" />

            <section class="marketing-section-alt">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-8">
                        <SectionHeader
                            compact
                            eyebrow="How it works"
                            title="Upload, sign, and download your PDF in under a minute"
                            description="This is the same flow you get in the app. No account required."
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <div class="grid gap-4 sm:grid-cols-3 sm:gap-5">
                            <div class="marketing-card-lift flex max-h-[360px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
                                <p class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                                    Upload
                                </p>
                                <div class="min-h-0 flex-1 overflow-hidden">
                                    <ProductMockup variant="dashboard" size="compact" />
                                </div>
                            </div>
                            <div class="marketing-card-lift flex max-h-[360px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
                                <p class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                                    Sign
                                </p>
                                <div class="min-h-0 flex-1 overflow-hidden">
                                    <ProductMockup variant="signature" size="compact" />
                                </div>
                            </div>
                            <div class="marketing-card-lift flex max-h-[360px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition-shadow hover:shadow-lg sm:max-h-none">
                                <p class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">3</span>
                                    Download
                                </p>
                                <div class="min-h-0 flex-1 overflow-hidden">
                                    <ProductMockup variant="complete" size="compact" />
                                </div>
                                <Link :href="route('sign.index')" class="mt-3 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                                    {{ CTA_SIGN_PDF_NOW }}
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Compare"
                            title="Why choose CubSign?"
                            description="Simple, free PDF signing without the usual limits and subscriptions."
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <ComparisonSection />
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-8">
                        <SectionHeader eyebrow="Trusted by" title="Used by freelancers, teams, and small businesses" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><SocialProof compact /></ScrollReveal>
                </div>
            </section>

            <section class="marketing-section">
                <div class="mx-auto max-w-3xl">
                    <ScrollReveal :delay="60"><PricingSection compact /></ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-tight">
                <div class="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <CtaBanner
                            title="Ready to sign your PDF?"
                            description="Upload, sign and download your PDF in seconds."
                            primary-label="Sign PDF Now"
                            footer-note="No account required."
                        />
                    </ScrollReveal>
                </div>
            </section>

            <StickyMobileCta />
        </div>
    </PublicLayout>
</template>
