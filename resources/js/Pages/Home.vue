<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import StickyMobileCta from '@/Components/StickyMobileCta.vue';
import MarketingHero from '@/Components/Marketing/MarketingHero.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import WorkflowTimeline from '@/Components/Marketing/WorkflowTimeline.vue';
import SocialProof from '@/Components/Marketing/SocialProof.vue';
import PricingSection from '@/Components/Marketing/PricingSection.vue';
import FaqAccordion from '@/Components/Marketing/FaqAccordion.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import ProductMockup from '@/Components/Marketing/ProductMockup.vue';
import { EARLY_ACCESS_HEADLINE, CTA_START_SIGNING, homeFaqs } from '@/constants/marketing';

defineProps({ hasSignSession: { type: Boolean, default: false } });
</script>

<template>
    <MarketingSeo
        title="CubSign – Free Online PDF Signing"
        description="Sign PDFs online for free. Upload a document, add your signature, request signatures from others, and download the finished PDF."
        path="/"
        :faq-schema="homeFaqs"
        type="website"
    />

    <PublicLayout>
        <div class="pb-20 md:pb-0">
            <MarketingHero :has-sign-session="hasSignSession" />

            <section class="marketing-section-alt !py-10 lg:!py-14">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-4">
                        <SectionHeader
                            compact
                            eyebrow="How it works"
                            title="Upload, sign, and download your PDF in under a minute"
                            description="This is the same flow you get in the app. No account required."
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <div class="grid gap-3 sm:grid-cols-3">
                            <div class="marketing-card-lift flex max-h-[360px] flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                                <p class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                                    <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">1</span>
                                    Upload
                                </p>
                                <div class="min-h-0 flex-1 overflow-hidden">
                                    <ProductMockup variant="dashboard" size="compact" />
                                </div>
                            </div>
                            <div class="marketing-card-lift flex max-h-[360px] flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                                <p class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                                    <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</span>
                                    Sign
                                </p>
                                <div class="min-h-0 flex-1 overflow-hidden">
                                    <ProductMockup variant="signature" size="compact" />
                                </div>
                            </div>
                            <div class="marketing-card-lift flex max-h-[360px] flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:max-h-none">
                                <p class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                                    <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">3</span>
                                    Download
                                </p>
                                <div class="min-h-0 flex-1 overflow-hidden">
                                    <ProductMockup variant="complete" size="compact" />
                                </div>
                                <Link :href="route('sign.index')" class="mt-2 flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700">
                                    {{ CTA_START_SIGNING }}
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader
                            eyebrow="Workflow"
                            title="From upload to signed PDF"
                            description="Six steps. Most documents are finished in a few minutes."
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><WorkflowTimeline /></ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader eyebrow="Early Access" title="Used by freelancers, teams, and small businesses" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><SocialProof compact /></ScrollReveal>
                </div>
            </section>

            <section class="marketing-section">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader :eyebrow="EARLY_ACCESS_HEADLINE" title="Pricing" description="CubSign is free while we are in Early Access." />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><PricingSection compact /></ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt">
                <div class="mx-auto max-w-2xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader eyebrow="FAQ" title="Common questions" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <FaqAccordion :faqs="homeFaqs" show-all-link />
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-tight">
                <div class="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <CtaBanner
                            title="Ready to sign your first document?"
                            description="Free during Early Access. No credit card required."
                            primary-label="Get Started Free"
                            secondary-label="Sign Without Account"
                        />
                    </ScrollReveal>
                </div>
            </section>

            <StickyMobileCta />
        </div>
    </PublicLayout>
</template>
