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
import FaqAccordion from '@/Components/Marketing/FaqAccordion.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import {
    credibilityCards,
    homeFaqs,
    CTA_START_SIGNING,
} from '@/constants/marketing';

defineProps({ hasSignSession: { type: Boolean, default: false } });

const exploreLinks = [
    { label: 'Features', description: 'Self-sign, requests, templates, and audit trails', routeName: 'features' },
    { label: 'Pricing', description: 'Free during Early Access — no credit card', routeName: 'pricing' },
    { label: 'Security Center', description: 'HTTPS, encryption, and responsible disclosure', routeName: 'security' },
    { label: 'Help Center', description: 'Step-by-step guides for every workflow', routeName: 'help-center' },
    { label: 'Blog', description: 'PDF signing guides and best practices', routeName: 'blog' },
    { label: 'Contact', description: 'Reach the CubSign team during Early Access', routeName: 'contact' },
];
</script>

<template>
    <MarketingSeo
        title="CubSign – Upload & Sign PDFs Online Free"
        description="Upload your PDF and sign it online in seconds. Add your signature and download the finished document. No account required."
        path="/"
        type="website"
        :faq-schema="homeFaqs"
        search-target="/help-center?q={search_term_string}"
    />

    <PublicLayout>
        <div class="pb-20 md:pb-0">
            <MarketingHero :has-sign-session="hasSignSession" />

            <section class="marketing-section">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal class="mb-12">
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

            <section class="marketing-section-alt" aria-label="Platform trust and security">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Trust"
                            title="Built for secure, everyday signing"
                            description="CubSign combines browser-based convenience with the controls teams expect from a modern signing platform."
                        />
                    </ScrollReveal>
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ScrollReveal
                            v-for="(card, index) in credibilityCards"
                            :key="card.title"
                            :delay="index * 40"
                        >
                            <div class="marketing-card-lift h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="card.icon" />
                                    </svg>
                                </div>
                                <h3 class="text-base font-bold text-gray-900">{{ card.title }}</h3>
                                <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ card.description }}</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section class="marketing-section">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader eyebrow="Built for" title="Freelancers, teams, and small businesses" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><SocialProof compact /></ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt" aria-label="Explore CubSign">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Explore"
                            title="Everything you need to evaluate CubSign"
                            description="Transparent pricing, detailed security information, and guides for every signing workflow."
                        />
                    </ScrollReveal>
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ScrollReveal
                            v-for="(item, index) in exploreLinks"
                            :key="item.routeName"
                            :delay="index * 30"
                        >
                            <Link
                                :href="route(item.routeName)"
                                class="marketing-card-lift group block h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200"
                            >
                                <h3 class="text-sm font-bold text-gray-900 group-hover:text-blue-600">{{ item.label }}</h3>
                                <p class="mt-1.5 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
                                <span class="mt-4 inline-flex text-xs font-semibold text-blue-600">Learn more →</span>
                            </Link>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section class="marketing-section" aria-labelledby="home-faq-heading">
                <div class="mx-auto max-w-3xl">
                    <ScrollReveal class="mb-10 text-center">
                        <SectionHeader
                            eyebrow="FAQ"
                            title="Common questions"
                            description="Quick answers about signing, pricing, and security during Early Access."
                            align="center"
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <FaqAccordion :faqs="homeFaqs" show-all-link />
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt !pb-24">
                <div class="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <CtaBanner
                            eyebrow="Early Access"
                            title="Start signing PDFs in your browser"
                            description="Upload a document, add your signature, and download the finished file — free during Early Access."
                            :primary-label="CTA_START_SIGNING"
                            footer-note="No credit card required · Works on desktop and mobile"
                            variant="premium"
                        />
                    </ScrollReveal>
                    <p class="mt-6 text-center text-sm text-gray-500">
                        Need help choosing a workflow?
                        <Link :href="route('help-center')" class="font-medium text-blue-600 hover:text-blue-700">Visit the Help Center</Link>
                        or
                        <Link :href="route('contact')" class="font-medium text-blue-600 hover:text-blue-700">contact support</Link>.
                    </p>
                </div>
            </section>

            <StickyMobileCta />
        </div>
    </PublicLayout>
</template>
