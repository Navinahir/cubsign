<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import StickyMobileCta from '@/Components/StickyMobileCta.vue';
import MarketingHero from '@/Components/Marketing/MarketingHero.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import WorkflowTimeline from '@/Components/Marketing/WorkflowTimeline.vue';
import FeatureGrid from '@/Components/Marketing/FeatureGrid.vue';
import SecuritySection from '@/Components/Marketing/SecuritySection.vue';
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
        description="Sign PDFs online for free. Upload documents, request signatures, and download signed PDFs securely with CubSign."
        path="/"
        :faq-schema="homeFaqs"
        type="website"
    />

    <PublicLayout>
        <div class="pb-20 md:pb-0">
            <!-- Hero -->
            <MarketingHero :has-sign-session="hasSignSession" />

            <!-- Product demo: Upload → Sign → Download -->
            <section class="marketing-section-alt !py-10 lg:!py-14">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-4">
                        <SectionHeader
                            compact
                            eyebrow="How it works"
                            title="Upload, sign, download — in under a minute"
                            description="The same flow as the real app. No account required."
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

            <!-- Features -->
            <section class="marketing-section">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader eyebrow="Features" title="Everything you need to sign smarter" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><FeatureGrid compact /></ScrollReveal>
                    <p class="mt-6 text-center">
                        <Link :href="route('features')" class="text-sm font-medium text-blue-600 hover:text-blue-700">See all features &rarr;</Link>
                    </p>
                </div>
            </section>

            <!-- Workflow -->
            <section class="marketing-section-alt">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader eyebrow="Workflow" title="Six simple steps to a signed PDF" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><WorkflowTimeline /></ScrollReveal>
                </div>
            </section>

            <!-- Security -->
            <section class="marketing-section">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader eyebrow="Security" title="Enterprise-grade protection, built in" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><SecuritySection compact /></ScrollReveal>
                </div>
            </section>

            <!-- Social proof -->
            <section class="marketing-section-alt">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader eyebrow="Trusted" title="Loved by people who value their time" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><SocialProof compact /></ScrollReveal>
                </div>
            </section>

            <!-- Pricing -->
            <section class="marketing-section">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal class="mb-6">
                        <SectionHeader :eyebrow="EARLY_ACCESS_HEADLINE" title="Simple, transparent pricing" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><PricingSection compact /></ScrollReveal>
                </div>
            </section>

            <!-- FAQ -->
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

            <!-- Final CTA -->
            <section class="marketing-section-tight">
                <div class="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <CtaBanner
                            title="Start signing documents today"
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
