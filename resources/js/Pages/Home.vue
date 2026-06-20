<script setup>
import { ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

const props = defineProps({
    hasSignSession: {
        type: Boolean,
        default: false,
    },
});

// ─── Interactive demo ─────────────────────────────────────────────
const activeSignTab = ref('draw');
const typedSignature = ref('');

// ─── FAQ ──────────────────────────────────────────────────────────
const openFaq = ref(null);
function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}

// ─── Trust bar ────────────────────────────────────────────────────
const trustItems = [
    {
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        title: 'Secure Signing',
        description: 'Bank-grade encryption',
    },
    {
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        title: 'Audit Trails',
        description: 'Court-ready evidence',
    },
    {
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        title: 'Fast Workflows',
        description: 'Sign in under 30 seconds',
    },
    {
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        title: 'Works Everywhere',
        description: 'Desktop and mobile',
    },
];

// ─── Feature cards ────────────────────────────────────────────────
const featureCards = [
    {
        title: 'Quick Sign',
        description: 'Upload any PDF and sign it yourself in seconds. Draw, type, or upload your signature.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        badge: null,
    },
    {
        title: 'Request Signatures',
        description: 'Send documents to others for signature and track signing status in real time.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
        badge: 'Coming Soon',
    },
    {
        title: 'Bulk Sign',
        description: 'Sign multiple documents at once with a single signature for high-volume workflows.',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        badge: 'Coming Soon',
    },
    {
        title: 'Templates',
        description: 'Create reusable document templates for contracts, agreements and forms.',
        icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        badge: 'Coming Soon',
    },
    {
        title: 'Audit Trails',
        description: 'Every signing event is logged with timestamps and IP addresses for legal compliance.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-600',
        badge: 'Coming Soon',
    },
    {
        title: 'Team Access',
        description: 'Collaborate with your team, share documents and manage signing permissions together.',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        iconBg: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
        badge: 'Coming Soon',
    },
];

// ─── Testimonials ─────────────────────────────────────────────────
const testimonials = [
    {
        initials: 'SM',
        name: 'Sarah Mitchell',
        role: 'Freelance Designer',
        avatarBg: 'bg-blue-500',
        quote: 'CubSign saves me hours every week. I sign client contracts in seconds without printing a single page.',
    },
    {
        initials: 'JT',
        name: 'James Torres',
        role: 'Real Estate Agent',
        avatarBg: 'bg-emerald-500',
        quote: 'My clients sign lease agreements in minutes. The simplest signing tool I have ever used — bar none.',
    },
    {
        initials: 'PK',
        name: 'Priya Kumar',
        role: 'HR Manager',
        avatarBg: 'bg-violet-500',
        quote: 'Onboarding paperwork used to take days. Now new hires sign everything digitally before their first day.',
    },
];

// ─── Pricing ──────────────────────────────────────────────────────
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

// ─── FAQ ──────────────────────────────────────────────────────────
const faqs = [
    {
        question: 'Is CubSign free to use?',
        answer: 'Yes. CubSign is free to use. You can upload, sign and download PDFs without any charge or credit card required.',
    },
    {
        question: 'Do I need to create an account to sign?',
        answer: 'No. You can upload a PDF, add your signature and download the signed document without creating an account.',
    },
    {
        question: 'Are my documents secure?',
        answer: 'All documents are stored with industry-standard encryption. Access is restricted to authorised users only, and all data is transmitted over HTTPS.',
    },
    {
        question: 'Can I sign documents on mobile?',
        answer: 'Yes. CubSign is fully responsive and works on any modern browser — desktop, tablet, and mobile.',
    },
];
</script>

<template>
    <Head title="CubSign — Sign Documents. Simply." />

    <PublicLayout>

        <!-- ============================================================ -->
        <!-- 1. HERO — split layout                                        -->
        <!-- ============================================================ -->
        <section class="relative bg-white px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">

            <!-- Background gradients (clipped inside the section) -->
            <div class="pointer-events-none absolute inset-0 overflow-hidden">
                <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-50 opacity-70 blur-3xl" />
                <div class="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-indigo-50 opacity-60 blur-3xl" />
            </div>

            <div class="relative mx-auto max-w-7xl">
                <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

                    <!-- Left: Text -->
                    <div>
                        <!-- Badge -->
                        <div class="mb-7 flex">
                            <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                                <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                PDF Signing &middot; Fast &amp; Secure
                            </span>
                        </div>

                        <!-- Headline -->
                        <h1 class="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-[3.5rem] lg:leading-[1.1]">
                            Sign Documents<br />
                            in Seconds.<br />
                            <span class="text-blue-600">Anywhere.</span>
                        </h1>

                        <!-- Subheadline -->
                        <p class="mt-6 max-w-lg text-lg leading-relaxed text-gray-500">
                            Upload, sign and download PDFs in under a minute. No software installation required.
                        </p>

                        <!-- Buttons -->
                        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                :href="route('sign.index')"
                                class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:bg-blue-700 hover:shadow-md"
                            >
                                Sign a PDF for Free
                            </Link>
                            <Link
                                :href="route('pricing')"
                                class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                View Pricing
                            </Link>
                        </div>

                        <!-- Continue signing link -->
                        <div v-if="hasSignSession" class="mt-4">
                            <Link
                                :href="route('sign.editor')"
                                class="text-sm text-gray-400 underline-offset-2 transition-colors hover:text-gray-600 hover:underline"
                            >
                                Already started signing? Continue &rarr;
                            </Link>
                        </div>

                        <!-- Trust badges -->
                        <div class="mt-8 flex flex-wrap gap-x-7 gap-y-2">
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
                                Download instantly
                            </span>
                            <span class="flex items-center gap-2 text-sm text-gray-500">
                                <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                Secure &amp; private
                            </span>
                        </div>
                    </div>

                    <!-- Right: Document illustration -->
                    <div class="relative mx-auto w-full max-w-sm sm:max-w-md lg:mx-0">

                        <!-- Main card: signed PDF -->
                        <div class="relative z-10 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200/80">

                            <!-- PDF header -->
                            <div class="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                                        <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-gray-900">Service Agreement.pdf</p>
                                        <p class="text-xs text-gray-400">2 pages &middot; 240 KB</p>
                                    </div>
                                </div>
                                <span class="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Signed</span>
                            </div>

                            <!-- Simulated document body -->
                            <div class="space-y-2.5 px-0.5">
                                <div class="h-2 rounded-full bg-gray-100"></div>
                                <div class="h-2 w-11/12 rounded-full bg-gray-100"></div>
                                <div class="h-2 w-full rounded-full bg-gray-100"></div>
                                <div class="h-2 w-4/5 rounded-full bg-gray-100"></div>
                                <div class="h-2 w-full rounded-full bg-gray-100"></div>
                                <div class="h-2 w-3/4 rounded-full bg-gray-100"></div>
                            </div>

                            <!-- Signature field -->
                            <div class="mt-5 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 px-4 py-3">
                                <p class="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">Signature</p>
                                <svg viewBox="0 0 220 55" class="h-9 w-36" aria-hidden="true">
                                    <path d="M10,42 C28,4 50,58 74,26 C92,5 112,50 140,28 C158,14 172,36 210,20"
                                          fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="mt-0.5 text-[11px] font-medium text-blue-500">Alex Johnson</p>
                            </div>

                            <!-- Signed status -->
                            <div class="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5">
                                <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="text-xs font-semibold text-emerald-700">Document signed &middot; Just now</span>
                            </div>
                        </div>

                        <!-- Floating: stats card (top-right) -->
                        <div class="absolute -right-4 top-2 z-20 hidden rounded-xl bg-white px-4 py-3 shadow-xl ring-1 ring-gray-100 sm:block">
                            <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">This week</p>
                            <p class="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">12</p>
                            <p class="text-[11px] text-gray-500">Documents signed</p>
                        </div>

                        <!-- Floating: verified badge (bottom-left) -->
                        <div class="absolute -bottom-5 -left-4 z-20 hidden items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 shadow-xl ring-1 ring-gray-100 sm:flex">
                            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-semibold text-gray-900">Signature verified</p>
                                <p class="text-[11px] text-gray-500">Bank-grade encryption</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>


        <!-- ============================================================ -->
        <!-- 2. TRUST BAR                                                  -->
        <!-- ============================================================ -->
        <section class="border-y border-gray-100 bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">
                <div class="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
                    <div
                        v-for="item in trustItems"
                        :key="item.title"
                        class="flex items-center gap-3"
                    >
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-900">{{ item.title }}</p>
                            <p class="text-xs text-gray-500">{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- ============================================================ -->
        <!-- 3. INTERACTIVE DEMO                                           -->
        <!-- ============================================================ -->
        <section class="bg-white px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-6xl">

                <!-- Heading -->
                <div class="mb-14 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">See it in action</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        See CubSign work in under 30 seconds.
                    </h2>
                    <p class="mx-auto mt-4 max-w-xl text-base text-gray-500">
                        Three simple steps. Same flow as the real app.
                    </p>
                </div>

                <!-- Demo card -->
                <div class="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200/80">
                    <div class="grid divide-y divide-gray-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">

                        <!-- Step 1: Create Signature -->
                        <div class="p-8">
                            <div class="mb-6 flex items-center gap-3">
                                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Create Signature</p>
                                    <p class="text-xs text-gray-400">Draw, type or upload</p>
                                </div>
                            </div>

                            <!-- Tab switcher -->
                            <div class="flex gap-1 rounded-xl bg-gray-100 p-1">
                                <button
                                    v-for="tab in ['draw', 'type', 'upload']"
                                    :key="tab"
                                    type="button"
                                    :class="[
                                        'flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-all duration-150',
                                        activeSignTab === tab
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700',
                                    ]"
                                    @click="activeSignTab = tab"
                                >
                                    {{ tab }}
                                </button>
                            </div>

                            <!-- Tab content -->
                            <div class="mt-4">

                                <!-- Draw -->
                                <div
                                    v-if="activeSignTab === 'draw'"
                                    class="flex h-32 flex-col items-start justify-end rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3"
                                >
                                    <svg viewBox="0 0 220 55" class="h-10 w-40" aria-hidden="true">
                                        <path d="M8,44 C28,4 50,60 76,28 C96,4 114,52 142,28 C160,14 174,38 215,22"
                                              fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <p class="mt-1 text-[11px] text-gray-400">Click and drag to sign</p>
                                </div>

                                <!-- Type -->
                                <div v-else-if="activeSignTab === 'type'" class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3">
                                    <input
                                        v-model="typedSignature"
                                        type="text"
                                        placeholder="Type your full name"
                                        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                    <div class="mt-3 min-h-10 rounded-lg border border-gray-200 bg-white px-3 py-2">
                                        <p class="font-['Georgia'] text-xl italic text-gray-700">
                                            {{ typedSignature || 'Your Name' }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Upload -->
                                <div v-else class="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                                    <svg class="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p class="mt-2 text-xs text-gray-500">Drop image here or <span class="text-blue-600">browse</span></p>
                                </div>

                            </div>
                        </div>

                        <!-- Step 2: Place on Document -->
                        <div class="p-8">
                            <div class="mb-6 flex items-center gap-3">
                                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Place on Document</p>
                                    <p class="text-xs text-gray-400">Click to position</p>
                                </div>
                            </div>

                            <!-- Mini PDF preview -->
                            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                <!-- Browser chrome -->
                                <div class="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-3 py-2">
                                    <span class="h-2 w-2 rounded-full bg-red-400"></span>
                                    <span class="h-2 w-2 rounded-full bg-yellow-400"></span>
                                    <span class="h-2 w-2 rounded-full bg-green-400"></span>
                                    <span class="ml-2 text-[11px] text-gray-400">Service Agreement.pdf</span>
                                </div>
                                <!-- Document content -->
                                <div class="bg-gray-50 px-4 py-4">
                                    <div class="space-y-1.5">
                                        <div class="h-1.5 rounded-full bg-gray-200"></div>
                                        <div class="h-1.5 w-10/12 rounded-full bg-gray-200"></div>
                                        <div class="h-1.5 w-full rounded-full bg-gray-200"></div>
                                        <div class="h-1.5 w-4/5 rounded-full bg-gray-200"></div>
                                        <div class="h-1.5 w-11/12 rounded-full bg-gray-200"></div>
                                    </div>
                                    <!-- Signature placement widget -->
                                    <div class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 ring-2 ring-blue-100">
                                        <svg viewBox="0 0 120 30" class="h-4 w-16" aria-hidden="true">
                                            <path d="M4,22 C15,2 30,28 44,14 C56,2 66,24 82,14 C92,8 100,18 116,12"
                                                  fill="none" stroke="#2563EB" stroke-width="1.75" stroke-linecap="round" />
                                        </svg>
                                        <span class="text-[10px] font-medium text-blue-500">Drag to move</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 3: Done -->
                        <div class="flex flex-col p-8">
                            <div class="mb-6 flex items-center gap-3">
                                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Done</p>
                                    <p class="text-xs text-gray-400">Ready to download</p>
                                </div>
                            </div>

                            <!-- Completed document preview -->
                            <div class="flex-1 overflow-hidden rounded-xl border border-emerald-200 bg-white">
                                <div class="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/50 px-4 py-2.5">
                                    <span class="text-[11px] font-medium text-gray-700">Service Agreement.pdf</span>
                                    <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">SIGNED</span>
                                </div>
                                <div class="bg-white px-4 py-4">
                                    <div class="space-y-1.5">
                                        <div class="h-1.5 w-full rounded-full bg-gray-200"></div>
                                        <div class="h-1.5 w-9/12 rounded-full bg-gray-200"></div>
                                        <div class="h-1.5 w-full rounded-full bg-gray-200"></div>
                                    </div>
                                    <div class="mt-4 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/30 px-3 py-2">
                                        <svg viewBox="0 0 120 30" class="h-5 w-20" aria-hidden="true">
                                            <path d="M4,22 C15,2 30,28 44,14 C56,2 66,24 82,14 C92,8 100,18 116,12"
                                                  fill="none" stroke="#059669" stroke-width="1.75" stroke-linecap="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- CTA -->
                            <Link
                                :href="route('sign.index')"
                                class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:bg-blue-700 hover:shadow-md"
                            >
                                Finish Signing
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </section>


        <!-- ============================================================ -->
        <!-- 4. FEATURES — 6 cards                                         -->
        <!-- ============================================================ -->
        <section class="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">

                <!-- Heading -->
                <div class="mb-16 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Features</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Everything you need to sign smarter
                    </h2>
                    <p class="mx-auto mt-4 max-w-xl text-base text-gray-500">
                        From quick self-signing to advanced team workflows — built for individuals and businesses.
                    </p>
                </div>

                <!-- Cards grid -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="card in featureCards"
                        :key="card.title"
                        class="relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div
                            v-if="card.badge"
                            class="absolute right-4 top-4 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500"
                        >
                            {{ card.badge }}
                        </div>
                        <div :class="['mb-5 flex h-11 w-11 items-center justify-center rounded-xl', card.iconBg]">
                            <svg :class="['h-5 w-5', card.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="card.icon" />
                            </svg>
                        </div>
                        <h3 class="mb-2 text-[15px] font-semibold text-gray-900">{{ card.title }}</h3>
                        <p class="text-sm leading-relaxed text-gray-500">{{ card.description }}</p>
                    </div>
                </div>

                <div class="mt-12 text-center">
                    <Link :href="route('features')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                        See all features &rarr;
                    </Link>
                </div>

            </div>
        </section>


        <!-- ============================================================ -->
        <!-- 5. HOW IT WORKS                                               -->
        <!-- ============================================================ -->
        <section class="bg-white px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-5xl">

                <!-- Heading -->
                <div class="mb-16 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">How it works</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Three steps. That's it.
                    </h2>
                </div>

                <!-- Steps -->
                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">

                    <!-- Step 1 -->
                    <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-sm shadow-blue-200/60">
                            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">Step 1</p>
                        <h3 class="mb-2 text-base font-semibold text-gray-900">Upload PDF</h3>
                        <p class="text-sm leading-relaxed text-gray-500">Drag and drop or browse any PDF up to 25 MB. No software needed.</p>
                    </div>

                    <!-- Step 2 -->
                    <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-sm shadow-blue-200/60">
                            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">Step 2</p>
                        <h3 class="mb-2 text-base font-semibold text-gray-900">Sign It</h3>
                        <p class="text-sm leading-relaxed text-gray-500">Draw, type or upload your signature. Place it anywhere on the document.</p>
                    </div>

                    <!-- Step 3 -->
                    <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-sm shadow-blue-200/60">
                            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">Step 3</p>
                        <h3 class="mb-2 text-base font-semibold text-gray-900">Download</h3>
                        <p class="text-sm leading-relaxed text-gray-500">Your signed PDF is ready instantly. Download it or share it with anyone.</p>
                    </div>

                </div>

            </div>
        </section>


        <!-- ============================================================ -->
        <!-- 6. TESTIMONIALS                                               -->
        <!-- ============================================================ -->
        <section class="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">

                <!-- Heading -->
                <div class="mb-16 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Testimonials</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Trusted by people who value their time
                    </h2>
                </div>

                <!-- Cards -->
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div
                        v-for="testimonial in testimonials"
                        :key="testimonial.name"
                        class="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
                    >
                        <!-- Quote mark -->
                        <svg class="mb-5 h-6 w-6 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        <p class="text-[15px] leading-relaxed text-gray-700">"{{ testimonial.quote }}"</p>

                        <div class="mt-6 flex items-center gap-3">
                            <div :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white', testimonial.avatarBg]">
                                {{ testimonial.initials }}
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">{{ testimonial.name }}</p>
                                <p class="text-xs text-gray-500">{{ testimonial.role }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>


        <!-- ============================================================ -->
        <!-- 7. PRICING                                                     -->
        <!-- ============================================================ -->
        <section class="bg-white px-4 py-24 sm:px-6 lg:px-8">
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
                        <!-- Badge (e.g. Coming Soon) -->
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
                                plan.highlight ? 'bg-blue-50 text-blue-400' : 'bg-gray-100 text-gray-400',
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


        <!-- ============================================================ -->
        <!-- 8. FAQ                                                        -->
        <!-- ============================================================ -->
        <section class="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">

                <!-- Heading -->
                <div class="mb-12 text-center">
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">FAQ</span>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Common questions
                    </h2>
                </div>

                <!-- Accordion -->
                <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
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


        <!-- ============================================================ -->
        <!-- 9. FINAL CTA                                                   -->
        <!-- ============================================================ -->
        <section class="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div class="mx-auto max-w-5xl">

                <!-- Gradient card -->
                <div class="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-500 to-blue-700 px-8 py-20 shadow-2xl sm:px-16 lg:px-24 lg:py-24">

                    <!-- Ambient glows -->
                    <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400/25 blur-3xl" />
                    <div class="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-800/30 blur-3xl" />

                    <div class="relative text-center">

                        <!-- Badge -->
                        <div class="mb-8 flex justify-center">
                            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
                                <svg class="h-3.5 w-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Sign in under 60 seconds
                            </span>
                        </div>

                        <!-- Headline -->
                        <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Ready to sign real documents?
                        </h2>

                        <!-- Subheadline -->
                        <p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
                            Upload PDFs, create signatures and download signed documents in seconds.
                        </p>

                        <!-- Buttons -->
                        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                :href="route('sign.index')"
                                class="w-full rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-150 hover:-translate-y-px hover:bg-gray-50 hover:shadow-md sm:w-auto"
                            >
                                Sign a PDF for Free
                            </Link>
                            <Link
                                :href="route('pricing')"
                                class="w-full rounded-xl border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20 sm:w-auto"
                            >
                                View Pricing
                            </Link>
                        </div>

                        <!-- Platform badges -->
                        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <span class="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                                <svg class="h-3.5 w-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Desktop Web
                            </span>
                            <span class="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                                <svg class="h-3.5 w-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Mobile Friendly
                            </span>
                            <span class="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                                <svg class="h-3.5 w-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure &amp; Private
                            </span>
                        </div>

                    </div>
                </div>

            </div>
        </section>

    </PublicLayout>
</template>
