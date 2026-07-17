<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import FaqAccordion from '@/Components/Marketing/FaqAccordion.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import HeroFlowPreview from '@/Components/Marketing/HeroFlowPreview.vue';
import {
    companyValues,
    aboutTimeline,
    aboutMissionPoints,
    aboutWhyChoose,
    aboutHowItWorks,
    aboutTechnology,
    aboutPrivacyPoints,
    aboutFaqs,
    CTA_TRY_CUBSIGN,
    SUPPORT_EMAIL,
    btnPrimary,
    btnSecondary,
} from '@/constants/marketing';

const breadcrumbSchema = [
    { name: 'Home', url: '/' },
    { name: 'About' },
];
</script>

<template>
    <MarketingSeo
        title="About CubSign — Simple, Secure PDF Signing"
        description="Learn why CubSign exists, our mission to simplify secure eSignatures, and how we protect your documents. Free during Early Access."
        path="/about"
        :faq-schema="aboutFaqs"
        :breadcrumb-schema="breadcrumbSchema"
    />

    <PublicLayout>
        <!-- Hero -->
        <section class="marketing-gradient-hero relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <DecorativeBg pattern="grid" />
            <div class="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <ScrollReveal>
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">About CubSign</span>
                    <h1 class="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Making document signing simple and secure
                    </h1>
                    <p class="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                        CubSign helps people sign PDFs in the browser — without printing, scanning, or installing software.
                        Our mission is to make secure eSignatures accessible to everyone.
                    </p>
                    <div class="mt-8 flex flex-wrap items-center gap-3">
                        <Link :href="route('sign.index')" :class="btnPrimary">{{ CTA_TRY_CUBSIGN }}</Link>
                        <Link :href="route('contact')" :class="btnSecondary">Contact us</Link>
                    </div>
                </ScrollReveal>
                <ScrollReveal :delay="80" direction="right" class="flex justify-center lg:justify-end">
                    <HeroFlowPreview />
                </ScrollReveal>
            </div>
        </section>

        <!-- Our Story -->
        <section class="marketing-section" aria-label="Our story">
            <div class="mx-auto max-w-3xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Our Story"
                        title="Why CubSign exists"
                        description="We built CubSign to replace the print-sign-scan cycle with a workflow that stays digital from start to finish."
                        align="left"
                        compact
                    />
                    <div class="mt-8 space-y-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                        <p>
                            <strong class="text-gray-900">Why CubSign was created.</strong>
                            Teams still waste time printing contracts, signing by hand, scanning pages, and emailing files back and forth.
                            Existing tools were often expensive, heavy, or locked behind enterprise sales processes.
                        </p>
                        <p>
                            <strong class="text-gray-900">The problem we solve.</strong>
                            CubSign removes that friction. Upload a PDF, add a signature, send it to recipients when needed, and download the signed document — all in the browser.
                        </p>
                        <p>
                            <strong class="text-gray-900">Our commitment.</strong>
                            We are committed to making document signing simple and secure: clear interfaces, encrypted connections, and a product that improves through real Early Access feedback.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>

        <!-- Mission & Vision -->
        <section class="marketing-section-alt" aria-label="Mission and vision">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Purpose"
                        title="Mission &amp; vision"
                        description="What we work toward every day — and where we are headed."
                        compact
                    />
                </ScrollReveal>

                <div class="mt-10 grid gap-6 lg:grid-cols-2">
                    <ScrollReveal class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 class="text-xl font-bold text-gray-900">Our mission</h2>
                        <ul class="mt-6 space-y-5">
                            <li v-for="point in aboutMissionPoints" :key="point.title" class="flex gap-3">
                                <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600" aria-hidden="true">
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 class="text-sm font-semibold text-gray-900">{{ point.title }}</h3>
                                    <p class="mt-1 text-sm leading-relaxed text-gray-500">{{ point.description }}</p>
                                </div>
                            </li>
                        </ul>
                    </ScrollReveal>

                    <ScrollReveal :delay="80" class="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-8 shadow-sm">
                        <h2 class="text-xl font-bold text-gray-900">Our vision</h2>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                            Become a trusted global platform for digital document workflows —
                            where signing is fast, secure, and accessible to freelancers, teams, and growing businesses alike.
                        </p>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">
                            CubSign is built by Cubiz Infotech. We are in Early Access and improving the product based on how people actually sign documents.
                        </p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Core Values -->
        <section class="marketing-section" aria-label="Core values">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Core Values"
                        title="What guides CubSign"
                        description="Five principles that shape how we design, ship, and support the product."
                        compact
                    />
                </ScrollReveal>
                <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <ScrollReveal
                        v-for="(value, i) in companyValues"
                        :key="value.title"
                        :delay="i * 40"
                        class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="value.icon" />
                            </svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">{{ value.title }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ value.description }}</p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Why Choose CubSign -->
        <section class="marketing-section-alt" aria-label="Why choose CubSign">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Why CubSign"
                        title="Why choose CubSign"
                        description="A focused signing experience built for speed, clarity, and trust."
                        compact
                    />
                </ScrollReveal>
                <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <ScrollReveal
                        v-for="(item, i) in aboutWhyChoose"
                        :key="item.title"
                        :delay="i * 40"
                        class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" />
                            </svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- How CubSign Works -->
        <section class="marketing-section" aria-label="How CubSign works">
            <div class="mx-auto max-w-5xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="How it works"
                        title="Sign a PDF in three steps"
                        description="No installers. No complicated setup. Just a clear path from upload to signed file."
                        compact
                    />
                </ScrollReveal>
                <ol class="mt-10 grid gap-6 sm:grid-cols-3">
                    <ScrollReveal
                        v-for="(step, i) in aboutHowItWorks"
                        :key="step.title"
                        :delay="i * 60"
                        tag="li"
                        class="relative rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
                    >
                        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-600/25">
                            {{ step.step }}
                        </span>
                        <h3 class="mt-4 font-semibold text-gray-900">{{ step.title }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ step.description }}</p>
                    </ScrollReveal>
                </ol>
                <div class="mt-10 text-center">
                    <Link :href="route('sign.index')" :class="btnPrimary">{{ CTA_TRY_CUBSIGN }}</Link>
                </div>
            </div>
        </section>

        <!-- Technology -->
        <section class="marketing-section-alt" aria-label="Technology">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Technology"
                        title="Built for the modern web"
                        description="CubSign runs on practical, production-ready foundations — explained without the jargon stack."
                        compact
                    />
                </ScrollReveal>
                <div class="mt-10 grid gap-5 sm:grid-cols-2">
                    <ScrollReveal
                        v-for="(item, i) in aboutTechnology"
                        :key="item.title"
                        :delay="i * 40"
                        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Privacy Commitment -->
        <section class="marketing-section" aria-label="Privacy commitment">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Privacy"
                        title="Our privacy commitment"
                        description="Trust starts with how we handle your documents and personal data."
                        compact
                    />
                </ScrollReveal>
                <div class="mt-10 grid gap-5 md:grid-cols-3">
                    <ScrollReveal
                        v-for="(item, i) in aboutPrivacyPoints"
                        :key="item.title"
                        :delay="i * 50"
                        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
                    </ScrollReveal>
                </div>
                <p class="mt-8 text-center text-sm text-gray-500">
                    Read the full details in our
                    <Link :href="route('privacy')" class="font-medium text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
                </p>
            </div>
        </section>

        <!-- Roadmap -->
        <section class="marketing-section-alt" aria-label="Product roadmap">
            <div class="mx-auto max-w-3xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Roadmap"
                        title="Where we have been — and where we are going"
                        description="Completed milestones and clearly marked planned goals. We only list features that ship or are actively planned."
                        compact
                    />
                </ScrollReveal>
                <div class="relative mt-10">
                    <div class="absolute left-5 top-0 hidden h-full w-0.5 bg-gradient-to-b from-blue-400 to-indigo-300 sm:block" aria-hidden="true" />
                    <ScrollReveal
                        v-for="(item, i) in aboutTimeline"
                        :key="`${item.year}-${item.title}`"
                        :delay="i * 50"
                        class="relative flex gap-6 pb-10 last:pb-0"
                    >
                        <div
                            :class="[
                                'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md',
                                item.status === 'planned' ? 'bg-indigo-400' : 'bg-blue-600',
                            ]"
                        >
                            {{ item.year.slice(2) }}
                        </div>
                        <div>
                            <div class="flex flex-wrap items-center gap-2">
                                <p class="text-xs font-semibold text-blue-600">{{ item.year }}</p>
                                <span
                                    :class="[
                                        'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                        item.status === 'planned'
                                            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                            : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
                                    ]"
                                >
                                    {{ item.status === 'planned' ? 'Planned' : 'Completed' }}
                                </span>
                            </div>
                            <h3 class="mt-1 font-semibold text-gray-900">{{ item.title }}</h3>
                            <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="marketing-section" aria-label="Frequently asked questions">
            <div class="mx-auto max-w-3xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="FAQ"
                        title="Questions about CubSign"
                        description="Common answers about who we are, how signing works, and how we handle trust."
                        compact
                    />
                </ScrollReveal>
                <div class="mt-10">
                    <FaqAccordion :faqs="aboutFaqs" />
                </div>
            </div>
        </section>

        <!-- Contact CTA -->
        <section class="marketing-section-alt" aria-label="Contact the CubSign team">
            <div class="mx-auto max-w-3xl text-center">
                <ScrollReveal>
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Talk with the CubSign team</h2>
                    <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
                        Questions, feedback, or partnership ideas? We read every message during Early Access.
                    </p>
                    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link :href="route('contact')" :class="btnPrimary">Contact us</Link>
                        <a :href="`mailto:${SUPPORT_EMAIL}`" :class="btnSecondary">{{ SUPPORT_EMAIL }}</a>
                    </div>
                </ScrollReveal>
            </div>
        </section>

        <!-- Final product CTA -->
        <section class="marketing-section">
            <div class="mx-auto max-w-5xl">
                <CtaBanner
                    title="Ready to sign without the paper trail?"
                    description="Try CubSign free during Early Access. Upload a PDF and finish in minutes."
                    :primary-label="CTA_TRY_CUBSIGN"
                    footer-note="No credit card required."
                />
            </div>
        </section>
    </PublicLayout>
</template>
