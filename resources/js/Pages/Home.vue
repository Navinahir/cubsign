<script setup>
import { ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

const features = [
    {
        title: 'Self Sign PDFs',
        description: 'Upload any PDF and add your signature in seconds. Draw, type, or upload — your choice.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'Send for Signature',
        description: 'Invite others to sign your documents with a single click. Track progress in real time.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        color: 'bg-violet-50 text-violet-600',
    },
    {
        title: 'Reusable Templates',
        description: 'Save your most-used documents as templates. Populate and send in seconds, not minutes.',
        icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        title: 'Audit Trail',
        description: 'Every action is logged with timestamps and IP addresses. Your documents are always audit-ready.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
        color: 'bg-amber-50 text-amber-600',
    },
];

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for individuals getting started.',
        features: [
            '3 documents per month',
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
        price: '$12',
        period: 'per month',
        description: 'For professionals who sign frequently.',
        features: [
            'Unlimited documents',
            'Send for signature',
            'Reusable templates',
            'Audit trail',
            'Priority support',
        ],
        cta: 'Coming Soon',
        ctaRoute: null,
        disabled: true,
        highlight: true,
    },
    {
        name: 'Founder',
        price: '$49',
        period: 'one-time',
        description: 'Early adopter lifetime access.',
        features: [
            'Everything in Pro',
            'Lifetime access',
            'Early access to features',
            'Founding member badge',
            'Direct support',
        ],
        cta: 'Coming Soon',
        ctaRoute: null,
        disabled: true,
        highlight: false,
    },
];

const faqs = [
    {
        question: 'Is CubSign free to use?',
        answer: 'Yes. CubSign offers a free plan with up to 3 documents per month. No credit card required to get started.',
    },
    {
        question: 'Are my documents secure?',
        answer: 'All documents are stored securely on our servers. We use industry-standard encryption to protect your files and personal data.',
    },
    {
        question: 'Can I sign documents on mobile?',
        answer: 'Yes. CubSign is fully responsive and works on any modern browser, including on mobile and tablet devices.',
    },
    {
        question: 'Do recipients need a CubSign account?',
        answer: 'No. You can send documents to anyone via email. Recipients can sign without creating an account.',
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
        <!-- ====== HERO ====== -->
        <section class="bg-gradient-to-b from-white to-blue-50/40 px-4 py-24 text-center sm:px-6 lg:py-32">
            <div class="mx-auto max-w-4xl">
                <span class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    PDF Signing · Fast &amp; Secure
                </span>

                <h1 class="mt-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                    Sign Documents.<br class="hidden sm:block" />
                    <span class="text-blue-600">Simply.</span>
                </h1>

                <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                    Fast, secure PDF signing for individuals and businesses.
                    Upload, sign, and send — in under a minute.
                </p>

                <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        :href="route('register')"
                        class="w-full rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        Sign a PDF for Free
                    </Link>
                    <Link
                        :href="route('login')"
                        class="w-full rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                    >
                        Login →
                    </Link>
                </div>

                <p class="mt-5 text-xs text-gray-400">Free forever · No credit card required</p>
            </div>
        </section>

        <!-- ====== FEATURES ====== -->
        <section class="bg-white px-4 py-20 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">
                <div class="mb-14 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Features</span>
                    <h2 class="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Smart tools for every signing workflow
                    </h2>
                    <p class="mx-auto mt-4 max-w-2xl text-gray-500">
                        Everything you need to sign, send, and manage documents — built into one clean workspace.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="feature in features"
                        :key="feature.title"
                        class="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-shadow hover:shadow-sm"
                    >
                        <div :class="['mb-4 flex h-11 w-11 items-center justify-center rounded-xl', feature.color]">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
                            </svg>
                        </div>
                        <h3 class="mb-2 text-base font-semibold text-gray-900">{{ feature.title }}</h3>
                        <p class="text-sm leading-relaxed text-gray-500">{{ feature.description }}</p>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <Link :href="route('features')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                        See all features →
                    </Link>
                </div>
            </div>
        </section>

        <!-- ====== PRICING PREVIEW ====== -->
        <section class="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">
                <div class="mb-14 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</span>
                    <h2 class="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p class="mx-auto mt-4 max-w-xl text-gray-500">
                        Start free. Upgrade when you need more.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div
                        v-for="plan in plans"
                        :key="plan.name"
                        :class="[
                            'relative flex flex-col rounded-2xl border p-8 transition-shadow',
                            plan.highlight
                                ? 'border-blue-500 bg-white shadow-lg shadow-blue-100'
                                : 'border-gray-200 bg-white hover:shadow-sm',
                        ]"
                    >
                        <div
                            v-if="plan.highlight"
                            class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white"
                        >
                            Most Popular
                        </div>

                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-gray-900">{{ plan.name }}</h3>
                            <p class="mt-1 text-sm text-gray-500">{{ plan.description }}</p>
                            <div class="mt-4 flex items-baseline gap-1">
                                <span class="text-4xl font-bold text-gray-900">{{ plan.price }}</span>
                                <span class="text-sm text-gray-400">/ {{ plan.period }}</span>
                            </div>
                        </div>

                        <ul class="mb-8 flex-1 space-y-3">
                            <li
                                v-for="item in plan.features"
                                :key="item"
                                class="flex items-start gap-2.5 text-sm text-gray-600"
                            >
                                <svg class="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {{ item }}
                            </li>
                        </ul>

                        <Link
                            v-if="!plan.disabled"
                            :href="route(plan.ctaRoute)"
                            :class="[
                                'block rounded-xl px-6 py-3 text-center text-sm font-semibold transition-colors',
                                plan.highlight
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-900 text-white hover:bg-gray-800',
                            ]"
                        >
                            {{ plan.cta }}
                        </Link>
                        <button
                            v-else
                            disabled
                            class="block w-full cursor-not-allowed rounded-xl bg-gray-100 px-6 py-3 text-center text-sm font-semibold text-gray-400"
                        >
                            {{ plan.cta }}
                        </button>
                    </div>
                </div>

                <div class="mt-10 text-center">
                    <Link :href="route('pricing')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Compare all plans →
                    </Link>
                </div>
            </div>
        </section>

        <!-- ====== FAQ PREVIEW ====== -->
        <section class="bg-white px-4 py-20 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <div class="mb-12 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">FAQ</span>
                    <h2 class="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Common questions</h2>
                </div>

                <div class="divide-y divide-gray-200">
                    <div v-for="(faq, index) in faqs" :key="index">
                        <button
                            type="button"
                            class="flex w-full items-center justify-between py-5 text-left"
                            @click="toggleFaq(index)"
                        >
                            <span class="text-sm font-semibold text-gray-900">{{ faq.question }}</span>
                            <svg
                                :class="['ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', openFaq === index ? 'rotate-180' : '']"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <Transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0"
                            enter-to-class="opacity-100"
                            leave-active-class="transition-all duration-150 ease-in"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                            <div v-if="openFaq === index" class="pb-5 text-sm leading-relaxed text-gray-500">
                                {{ faq.answer }}
                            </div>
                        </Transition>
                    </div>
                </div>

                <div class="mt-10 text-center">
                    <Link :href="route('faq')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View all FAQs →
                    </Link>
                </div>
            </div>
        </section>

        <!-- ====== CTA BANNER ====== -->
        <section class="bg-blue-600 px-4 py-16 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <h2 class="text-3xl font-bold text-white">Ready to sign smarter?</h2>
                <p class="mt-3 text-blue-100">
                    Join thousands of professionals who trust CubSign for their document signing.
                </p>
                <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        :href="route('register')"
                        class="w-full rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 sm:w-auto"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        :href="route('login')"
                        class="w-full rounded-xl border border-blue-400 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
