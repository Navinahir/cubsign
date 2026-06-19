<script setup>
import { ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

const features = [
    {
        title: 'Self Sign PDFs',
        description: 'Upload PDFs and add your signature in seconds. Draw, type, or upload your signature.',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        title: 'Draw or Type Signatures',
        description: 'Create beautiful signatures and reuse them across documents.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
    },
    {
        title: 'Secure Documents',
        description: 'Your signed documents remain protected and secure.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        title: 'Works Everywhere',
        description: 'Use CubSign from any browser on desktop or mobile.',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
];

const plans = [
    {
        name: 'Free',
        priceDisplay: '$0',
        pricePeriod: 'forever',
        description: 'Everything you need to start signing documents today.',
        badge: null,
        features: [
            'Self sign PDFs',
            'Download signed documents',
            'Email support',
        ],
        cta: 'Get Started Free',
        ctaRoute: 'register',
        disabled: false,
        highlight: false,
    },
    {
        name: 'Pro',
        priceDisplay: null,
        pricePeriod: null,
        description: 'Advanced features arriving soon.',
        badge: 'Coming Soon',
        features: [],
        cta: 'Coming Soon',
        ctaRoute: null,
        disabled: true,
        highlight: true,
    },
    {
        name: 'Founder',
        priceDisplay: 'Limited Lifetime Offer',
        pricePeriod: null,
        description: 'Early supporter access.',
        badge: null,
        features: [],
        cta: 'Coming Soon',
        ctaRoute: null,
        disabled: true,
        highlight: false,
    },
];

const faqs = [
    {
        question: 'Is CubSign free to use?',
        answer: 'Yes. CubSign offers a free plan with up to 3 documents per month. No credit card is required to get started.',
    },
    {
        question: 'Are my documents secure?',
        answer: 'All documents are stored securely with industry-standard encryption. Access is restricted to authorised users only, and all data is transmitted over HTTPS.',
    },
    {
        question: 'Can I sign documents on mobile?',
        answer: 'Yes. CubSign is fully responsive and works on any modern browser — desktop, tablet, and mobile.',
    },
    {
        question: 'Do recipients need a CubSign account?',
        answer: 'No. Recipients receive a secure link by email and can sign without creating an account.',
    },
];

const trustPoints = [
    {
        title: 'Fast Signing',
        description: 'Sign any PDF in under a minute. No software to install.',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        title: 'Secure Documents',
        description: 'Every file is encrypted and protected at rest and in transit.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        title: 'Reusable Signatures',
        description: 'Save your signature once and apply it across any document.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
    },
    {
        title: 'Works Everywhere',
        description: 'Any browser, any device. Nothing to download or configure.',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
];

const openFaq = ref(null);
function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}
</script>

<template>
    <Head title="CubSign — Sign Documents. Simply." />

    <PublicLayout>

        <!-- ================================================ -->
        <!-- HERO                                              -->
        <!-- ================================================ -->
        <section class="bg-gradient-to-b from-white to-blue-50/50 px-4 pb-28 pt-24 text-center sm:px-6 lg:pb-36 lg:pt-32">
            <div class="mx-auto max-w-3xl">

                <!-- Badge -->
                <div class="mb-8 flex justify-center">
                    <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                        <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        PDF Signing &middot; Fast &amp; Secure
                    </span>
                </div>

                <!-- Headline -->
                <h1 class="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-[4.5rem] lg:leading-[1.1]">
                    Sign Documents.<br />
                    <span class="text-blue-600">Simply.</span>
                </h1>

                <!-- Subheadline -->
                <p class="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-gray-500">
                    Fast, secure PDF signing for individuals and businesses.<br class="hidden sm:block" />
                    Upload, sign, and download documents in seconds.
                </p>

                <!-- Buttons -->
                <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        :href="route('register')"
                        class="w-full rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        Sign a PDF for Free
                    </Link>
                    <Link
                        :href="route('login')"
                        class="w-full rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                    >
                        Login
                    </Link>
                </div>

                <!-- Trust badges -->
                <div class="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    <span class="flex items-center gap-2 text-sm text-gray-500">
                        <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        No account required
                    </span>
                    <span class="flex items-center gap-2 text-sm text-gray-500">
                        <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Free forever
                    </span>
                    <span class="flex items-center gap-2 text-sm text-gray-500">
                        <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        No credit card required
                    </span>
                </div>
            </div>
        </section>


        <!-- ================================================ -->
        <!-- FEATURES                                          -->
        <!-- ================================================ -->
        <section class="bg-white px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-6xl">

                <!-- Heading -->
                <div class="mb-16 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Features</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Smart tools for every signing workflow
                    </h2>
                    <p class="mx-auto mt-4 max-w-xl text-base text-gray-500">
                        Upload, sign, and download PDFs from any device — fast, simple, and secure.
                    </p>
                </div>

                <!-- Cards -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="feature in features"
                        :key="feature.title"
                        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div :class="['mb-5 flex h-11 w-11 items-center justify-center rounded-xl', feature.iconBg]">
                            <svg :class="['h-5 w-5', feature.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
                            </svg>
                        </div>
                        <h3 class="mb-2 text-[15px] font-semibold text-gray-900">{{ feature.title }}</h3>
                        <p class="text-sm leading-relaxed text-gray-500">{{ feature.description }}</p>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <Link :href="route('features')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                        See all features &rarr;
                    </Link>
                </div>
            </div>
        </section>


        <!-- ================================================ -->
        <!-- PRICING                                           -->
        <!-- ================================================ -->
        <section class="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-5xl">

                <!-- Heading -->
                <div class="mb-16 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p class="mx-auto mt-4 max-w-md text-base text-gray-500">
                        Start free. Upgrade when you need more.
                    </p>
                </div>

                <!-- Cards -->
                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div
                        v-for="plan in plans"
                        :key="plan.name"
                        :class="[
                            'relative flex flex-col rounded-2xl border bg-white p-8',
                            plan.highlight
                                ? 'border-blue-400 shadow-xl shadow-blue-100'
                                : 'border-gray-200 shadow-sm',
                        ]"
                    >
                        <!-- Plan badge (e.g. "Coming Soon") -->
                        <div
                            v-if="plan.badge"
                            class="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold tracking-wide text-white"
                        >
                            {{ plan.badge }}
                        </div>

                        <!-- Plan header -->
                        <div class="mb-7 border-b border-gray-100 pb-7">
                            <h3 class="text-base font-semibold text-gray-900">{{ plan.name }}</h3>
                            <p class="mt-1 text-sm text-gray-400">{{ plan.description }}</p>

                            <!-- Price display -->
                            <div v-if="plan.priceDisplay" class="mt-5">
                                <template v-if="plan.pricePeriod">
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-4xl font-bold tracking-tight text-gray-900">{{ plan.priceDisplay }}</span>
                                        <span class="text-sm text-gray-400">/ {{ plan.pricePeriod }}</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <span class="text-base font-semibold text-gray-500">{{ plan.priceDisplay }}</span>
                                </template>
                            </div>
                        </div>

                        <!-- Feature list -->
                        <ul v-if="plan.features.length" class="mb-8 flex-1 space-y-3">
                            <li
                                v-for="item in plan.features"
                                :key="item"
                                class="flex items-start gap-2.5 text-sm text-gray-600"
                            >
                                <svg class="mt-px h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                {{ item }}
                            </li>
                        </ul>
                        <div v-else class="mb-8 flex-1"></div>

                        <!-- CTA -->
                        <Link
                            v-if="!plan.disabled"
                            :href="route(plan.ctaRoute)"
                            class="block rounded-xl bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                        >
                            {{ plan.cta }}
                        </Link>
                        <button
                            v-else
                            disabled
                            :class="[
                                'w-full cursor-not-allowed rounded-xl px-6 py-3 text-sm font-semibold',
                                plan.highlight
                                    ? 'bg-blue-50 text-blue-400'
                                    : 'bg-gray-100 text-gray-400',
                            ]"
                        >
                            {{ plan.cta }}
                        </button>
                    </div>
                </div>

                <div class="mt-10 text-center">
                    <Link :href="route('pricing')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Compare all plans &rarr;
                    </Link>
                </div>
            </div>
        </section>


        <!-- ================================================ -->
        <!-- FAQ                                               -->
        <!-- ================================================ -->
        <section class="bg-white px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">

                <!-- Heading -->
                <div class="mb-12 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">FAQ</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Common questions
                    </h2>
                </div>

                <!-- Accordion -->
                <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-gray-50">
                    <div v-for="(faq, index) in faqs" :key="index">
                        <button
                            type="button"
                            class="flex w-full items-center justify-between px-6 py-5 text-left"
                            @click="toggleFaq(index)"
                        >
                            <span class="pr-4 text-sm font-semibold text-gray-900">{{ faq.question }}</span>
                            <svg
                                :class="[
                                    'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200',
                                    openFaq === index ? 'rotate-180' : '',
                                ]"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <Transition
                            enter-active-class="transition-opacity duration-200 ease-out"
                            enter-from-class="opacity-0"
                            enter-to-class="opacity-100"
                            leave-active-class="transition-opacity duration-150 ease-in"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                            <div v-if="openFaq === index" class="px-6 pb-6 text-sm leading-relaxed text-gray-500">
                                {{ faq.answer }}
                            </div>
                        </Transition>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <Link :href="route('faq')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View all FAQs &rarr;
                    </Link>
                </div>
            </div>
        </section>


        <!-- ================================================ -->
        <!-- SOCIAL PROOF — Why choose CubSign?               -->
        <!-- ================================================ -->
        <section class="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-5xl">

                <!-- Heading -->
                <div class="mb-14 text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Why choose CubSign?
                    </h2>
                    <p class="mx-auto mt-4 max-w-xl text-base text-gray-500">
                        Built for people who want signing to be effortless, secure, and reliable.
                    </p>
                </div>

                <!-- Trust cards -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="point in trustPoints"
                        :key="point.title"
                        class="flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <div :class="['mb-4 flex h-10 w-10 items-center justify-center rounded-xl', point.iconBg]">
                            <svg :class="['h-5 w-5', point.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="point.icon" />
                            </svg>
                        </div>
                        <h3 class="mb-1.5 text-sm font-semibold text-gray-900">{{ point.title }}</h3>
                        <p class="text-sm leading-relaxed text-gray-500">{{ point.description }}</p>
                    </div>
                </div>
            </div>
        </section>


        <!-- ================================================ -->
        <!-- FINAL CTA                                         -->
        <!-- ================================================ -->
        <section class="bg-blue-600 px-4 py-20 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready to sign smarter?
                </h2>
                <p class="mx-auto mt-4 max-w-lg text-base text-blue-100">
                    Join professionals who trust CubSign for fast and secure document signing.
                </p>
                <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        :href="route('register')"
                        class="w-full rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 sm:w-auto"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        :href="route('login')"
                        class="w-full rounded-xl border border-blue-400 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </section>

    </PublicLayout>
</template>
