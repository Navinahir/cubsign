<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import FaqAccordion from '@/Components/Marketing/FaqAccordion.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import HeroFlowPreview from '@/Components/Marketing/HeroFlowPreview.vue';
import {
    companyValues,
    aboutMissionStatement,
    aboutVisionStatement,
    aboutMissionPoints,
    aboutWhyChoose,
    aboutHowItWorks,
    aboutTechnology,
    aboutPrivacyPoints,
    aboutTimeline,
    aboutFaqs,
    floatingTrustItems,
    CTA_START_SIGNING_PDFS,
    SUPPORT_EMAIL,
    btnPrimary,
    btnSecondary,
} from '@/constants/marketing';

const breadcrumbSchema = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
];

const aboutFaqSchema = aboutFaqs.map((item) => ({
    question: item.question,
    answer: item.moreHelpLabel ? `${item.answer} ${item.moreHelpLabel}.` : item.answer,
}));

const completedMilestones = aboutTimeline.filter((item) => item.status === 'completed');
const plannedMilestones = aboutTimeline.filter((item) => item.status === 'planned');
</script>

<template>
    <MarketingSeo
        title="About CubSign — Our Mission, Values & Story"
        description="CubSign is a browser-based PDF signing product from Cubiz Infotech. Learn why we built it, what the product does today, and what is planned."
        path="/about"
        :faq-schema="aboutFaqSchema"
        :breadcrumb-schema="breadcrumbSchema"
        about-organization
    />

    <PublicLayout>
        <!-- 1. Hero -->
        <section class="marketing-gradient-hero relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <DecorativeBg pattern="grid" />
            <div class="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <ScrollReveal>
                    <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                        About CubSign
                    </span>
                    <h1 class="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                        Simple, secure PDF signing for everyone
                    </h1>
                    <p class="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                        {{ aboutMissionStatement }}
                    </p>
                    <div class="mt-8 flex flex-wrap items-center gap-3">
                        <Link :href="route('sign.index')" :class="btnPrimary">{{ CTA_START_SIGNING_PDFS }}</Link>
                        <Link :href="route('contact')" :class="btnSecondary">Contact us</Link>
                    </div>
                    <ul class="mt-8 flex flex-wrap gap-2.5" aria-label="Platform highlights">
                        <li
                            v-for="item in floatingTrustItems"
                            :key="item"
                            class="rounded-full border border-gray-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </ScrollReveal>
                <ScrollReveal :delay="80" direction="right" class="flex justify-center lg:justify-end">
                    <HeroFlowPreview />
                </ScrollReveal>
            </div>
        </section>

        <!-- 2. Our Story -->
        <section class="marketing-section" aria-label="Our story">
            <div class="mx-auto max-w-6xl">
                <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <ScrollReveal>
                        <SectionHeader
                            eyebrow="Our Story"
                            title="Why CubSign exists"
                            description="We built CubSign to replace the print-sign-scan cycle with a workflow that stays digital from start to finish."
                            align="left"
                            compact
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <div class="space-y-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                            <p class="text-sm leading-relaxed text-gray-600 sm:text-base">
                                Document signing should not require a printer, a scanner, or a week of back-and-forth emails.
                                Yet that is still how many people handle contracts, agreements, and everyday paperwork.
                            </p>
                            <p class="text-sm leading-relaxed text-gray-600 sm:text-base">
                                CubSign was created to simplify secure document signing. We focused on a clear browser-based workflow:
                                upload a PDF, add your signature, and download the finished file or send it to others for signature.
                            </p>
                            <p class="text-sm leading-relaxed text-gray-600 sm:text-base">
                                Many existing tools felt expensive, overly complex, or locked behind enterprise sales. CubSign is built
                                for freelancers, small businesses, and teams who need a straightforward signing experience without the overhead.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- 3. Mission -->
        <section class="marketing-section-alt" aria-label="Our mission">
            <div class="mx-auto max-w-4xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Mission"
                        title="What we set out to do"
                        :description="aboutMissionStatement"
                        compact
                    />
                </ScrollReveal>
                <div class="mt-10 grid gap-5 sm:grid-cols-3">
                    <ScrollReveal
                        v-for="(point, i) in aboutMissionPoints"
                        :key="point.title"
                        :delay="i * 50"
                        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600" aria-hidden="true">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                        <h3 class="mt-4 font-semibold text-gray-900">{{ point.title }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ point.description }}</p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- 4. Vision -->
        <section class="marketing-section" aria-label="Our vision">
            <div class="mx-auto max-w-4xl">
                <ScrollReveal>
                    <div class="overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-sm sm:p-12">
                        <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Vision</span>
                        <h2 class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Where we are headed
                        </h2>
                        <p class="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                            {{ aboutVisionStatement }}
                        </p>
                        <p class="mt-4 text-sm leading-relaxed text-gray-500">
                            CubSign is built by Cubiz Infotech. We are in Early Access and improving the product based on how people actually sign documents.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>

        <!-- 5. Core Values -->
        <section class="marketing-section-alt" aria-label="Core values">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Core Values"
                        title="What guides every decision"
                        description="Five principles that shape how we design, build, and support CubSign."
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
                        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
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

        <!-- 6. Why Choose CubSign -->
        <section class="marketing-section" aria-label="Why choose CubSign">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Why CubSign"
                        title="Why choose CubSign"
                        description="A focused signing experience built for speed, clarity, and trust, not feature bloat."
                        compact
                    />
                </ScrollReveal>
                <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <ScrollReveal
                        v-for="(item, i) in aboutWhyChoose"
                        :key="item.title"
                        :delay="i * 40"
                        class="marketing-card-lift flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
                            <p class="mt-1.5 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- 7. How CubSign Works -->
        <section class="marketing-section-alt" aria-label="How CubSign works">
            <div class="mx-auto max-w-5xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="How it works"
                        title="Upload → Sign → Download"
                        description="Three steps from PDF to signed document. No installers, no complicated setup."
                        compact
                    />
                </ScrollReveal>

                <div class="relative mt-12">
                    <div class="absolute left-[16.67%] right-[16.67%] top-10 hidden h-0.5 bg-blue-100 sm:block" aria-hidden="true" />
                    <ol class="grid gap-8 sm:grid-cols-3 sm:gap-6">
                        <ScrollReveal
                            v-for="(step, i) in aboutHowItWorks"
                            :key="step.title"
                            :delay="i * 60"
                            tag="li"
                            class="relative text-center"
                        >
                            <div class="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="step.icon" />
                                </svg>
                            </div>
                            <p class="mt-1 text-xs font-bold uppercase tracking-widest text-blue-600">Step {{ step.step }}</p>
                            <h3 class="mt-2 text-lg font-bold text-gray-900">{{ step.title }}</h3>
                            <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ step.description }}</p>
                        </ScrollReveal>
                    </ol>
                </div>

                <div class="mt-12 text-center">
                    <Link :href="route('sign.index')" :class="btnPrimary">{{ CTA_START_SIGNING_PDFS }}</Link>
                </div>
            </div>
        </section>

        <!-- 8. Technology -->
        <section class="marketing-section" aria-label="Technology">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Technology"
                        title="Built for the modern web"
                        description="CubSign runs on practical, production-ready foundations, explained without the jargon."
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

        <!-- 9. Privacy Commitment -->
        <section class="marketing-section-alt" aria-label="Privacy commitment">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Privacy"
                        title="Our privacy commitment"
                        description="We handle your documents responsibly. Here is what that means in practice."
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
                    For full details on data handling, retention, and your rights, read our
                    <Link :href="route('privacy')" class="font-medium text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
                </p>
            </div>
        </section>

        <!-- 10. Product Roadmap -->
        <section class="marketing-section" aria-label="Product roadmap">
            <div class="mx-auto max-w-5xl">
                <ScrollReveal>
                    <SectionHeader
                        eyebrow="Roadmap"
                        title="What we have shipped, and what is next"
                        description="Completed milestones reflect features available today. Planned items are future goals, clearly marked."
                        compact
                    />
                </ScrollReveal>

                <div class="mt-10 grid gap-10 lg:grid-cols-2">
                    <ScrollReveal>
                        <div class="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
                            <div class="flex items-center gap-2">
                                <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                                <h3 class="text-sm font-bold uppercase tracking-widest text-emerald-800">Completed</h3>
                            </div>
                            <ul class="mt-5 space-y-5">
                                <li v-for="item in completedMilestones" :key="item.title" class="border-l-2 border-emerald-300 pl-4">
                                    <p class="text-xs font-semibold text-emerald-700">{{ item.year }}</p>
                                    <p class="mt-0.5 font-semibold text-gray-900">{{ item.title }}</p>
                                    <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>
                                </li>
                            </ul>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="60">
                        <div class="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
                            <div class="flex items-center gap-2">
                                <span class="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden="true" />
                                <h3 class="text-sm font-bold uppercase tracking-widest text-amber-800">Planned</h3>
                            </div>
                            <ul class="mt-5 space-y-5">
                                <li v-for="item in plannedMilestones" :key="item.title" class="border-l-2 border-amber-300 pl-4">
                                    <p class="text-xs font-semibold text-amber-700">{{ item.year }}</p>
                                    <p class="mt-0.5 font-semibold text-gray-900">{{ item.title }}</p>
                                    <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>
                                </li>
                            </ul>
                            <p class="mt-5 text-xs leading-relaxed text-amber-800/80">
                                Planned features may change based on Early Access feedback. We only list goals we are actively considering.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- 11. FAQ -->
        <section class="marketing-section-alt" aria-label="Frequently asked questions">
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

        <!-- 12. Contact CTA -->
        <section class="marketing-section" aria-label="Contact the CubSign team">
            <div class="mx-auto max-w-3xl">
                <ScrollReveal>
                    <div class="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                        <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Talk with the CubSign team</h2>
                        <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
                            Questions, feedback, or partnership ideas? We read every message during Early Access and respond as quickly as we can.
                        </p>
                        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Link :href="route('contact')" :class="btnPrimary">Contact us</Link>
                            <a :href="`mailto:${SUPPORT_EMAIL}`" :class="btnSecondary">{{ SUPPORT_EMAIL }}</a>
                        </div>
                        <p class="mt-6 text-xs text-gray-400">
                            You can also browse the
                            <Link :href="route('help-center')" class="font-medium text-blue-600 hover:text-blue-700">Help Center</Link>
                            for signing guides and troubleshooting.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    </PublicLayout>
</template>
