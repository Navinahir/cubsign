<script setup>
import { ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import { Link } from '@inertiajs/vue3';
import {
    EARLY_ACCESS_HEADLINE,
    EARLY_ACCESS_SUBHEADLINE,
    CTA_START_SIGNING,
    CTA_CREATE_ACCOUNT,
    btnPrimary,
    pageHeaderClass,
} from '@/constants/marketing';

const included = [
    { title: 'Self-sign PDFs', detail: 'Upload a PDF up to 25 MB, place fields, and download the signed file.' },
    { title: 'Guest self-sign', detail: 'Complete one signing session without an account, then register free to continue.' },
    { title: 'Signature options', detail: 'Draw, type, or upload a signature image for the current document.' },
    { title: 'Send for signature', detail: 'Invite recipients by email with unique links (account required).' },
    { title: 'Templates', detail: 'Reuse prepared field layouts for documents you send often.' },
    { title: 'Workspace storage', detail: 'Keep account documents private with owner and recipient access controls.' },
    { title: 'Activity history', detail: 'See invitation, signature, and completion events on sent documents.' },
    { title: 'Desktop and mobile', detail: 'Use CubSign in a modern browser with no software to install.' },
];

const guestVsAccount = [
    {
        label: 'Without an account',
        items: [
            'One self-sign session per browser session',
            'Upload PDF, place signature, download',
            'No document storage in CubSign after download',
            'Cannot send for signature or use templates',
        ],
    },
    {
        label: 'With a free account',
        items: [
            'Continue signing beyond the guest session',
            'Store documents in your workspace',
            'Send to one or more recipients by email',
            'Templates, tracking, and activity history',
        ],
    },
];

const faqs = [
    {
        question: 'Why is CubSign free right now?',
        answer: 'CubSign is in Early Access. We are collecting feedback on the real signing workflows people use before introducing paid plans. No credit card is required.',
    },
    {
        question: 'Will CubSign always be free?',
        answer: 'CubSign is free during Early Access while we validate the product. Paid plans may be introduced later. If that happens, Early Access users will get advance notice. There is no billing system today.',
    },
    {
        question: 'Are there hidden limits during Early Access?',
        answer: 'Uploads must be PDF files up to 25 MB. Guests can finish one self-sign session without registering. Account features (storage, templates, send-for-signature) require a verified free account. We do not sell tiers or add-ons during Early Access.',
    },
    {
        question: 'Do I need a credit card?',
        answer: 'No. Create a free account or start a guest self-sign from Upload PDF. There is nothing to cancel because there is no subscription.',
    },
    {
        question: 'What happens when paid plans launch?',
        answer: 'We will notify account holders in advance. Your existing documents remain accessible under the Privacy Policy. Preferential options for Early Access users may be offered, but no prices or plan names are published yet.',
    },
];

const openFaq = ref(null);

function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}
</script>

<template>
    <MarketingSeo
        title="Pricing — CubSign | Free During Early Access"
        description="CubSign is free during Early Access. Learn what guest self-sign includes, what a free account unlocks, and current limits (PDF, 25 MB)."
        path="/pricing"
        :faq-schema="faqs"
    />

    <PublicLayout>
        <section :class="pageHeaderClass">
            <div class="mx-auto max-w-3xl">
                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    Early Access
                </span>
                <h1 class="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    {{ EARLY_ACCESS_HEADLINE }}
                </h1>
                <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
                    {{ EARLY_ACCESS_SUBHEADLINE }} There is one offering today: free access to the product while we improve it.
                </p>
            </div>
        </section>

        <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-lg">
                <div class="relative overflow-hidden rounded-3xl border border-blue-200 bg-white p-8 shadow-xl shadow-blue-100/60 sm:p-10">
                    <div class="absolute right-6 top-6">
                        <span class="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                            Early Access
                        </span>
                    </div>

                    <p class="text-sm font-semibold uppercase tracking-widest text-blue-600">Current offering</p>
                    <h2 class="mt-2 text-2xl font-bold text-gray-900">Free Plan</h2>
                    <p class="mt-2 text-sm text-gray-500">Full product access during Early Access. No paid tiers are published yet.</p>

                    <div class="mt-8 flex items-baseline gap-2">
                        <span class="text-6xl font-bold tracking-tight text-gray-900">$0</span>
                        <span class="text-sm text-gray-400">no credit card</span>
                    </div>

                    <Link :href="route('register')" :class="[btnPrimary, 'mt-10 w-full']">
                        {{ CTA_CREATE_ACCOUNT }}
                    </Link>

                    <p class="mt-4 text-center text-xs text-gray-400">
                        No credit card required &middot; No subscription to cancel
                    </p>
                </div>

                <p class="mt-8 text-center text-sm text-gray-500">
                    Prefer to try without an account?
                    <Link :href="route('sign.index')" class="font-medium text-blue-600 hover:text-blue-700">
                        Sign a PDF now &rarr;
                    </Link>
                </p>
            </div>
        </section>

        <section class="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl">
                <h2 class="text-center text-2xl font-bold text-gray-900">What is included</h2>
                <p class="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-500">
                    Honest scope of the current CubSign product, not a future roadmap promise.
                </p>
                <ul class="mt-10 grid gap-4 sm:grid-cols-2">
                    <li
                        v-for="item in included"
                        :key="item.title"
                        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <h3 class="text-sm font-bold text-gray-900">{{ item.title }}</h3>
                        <p class="mt-1.5 text-sm leading-relaxed text-gray-600">{{ item.detail }}</p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl">
                <h2 class="text-center text-2xl font-bold text-gray-900">Guest vs free account</h2>
                <p class="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-500">
                    Both paths are free. An account is required after one guest self-sign session and for sending documents.
                </p>
                <div class="mt-10 grid gap-6 md:grid-cols-2">
                    <div
                        v-for="column in guestVsAccount"
                        :key="column.label"
                        class="rounded-2xl border border-gray-200 bg-gray-50 p-6"
                    >
                        <h3 class="text-sm font-bold text-gray-900">{{ column.label }}</h3>
                        <ul class="mt-4 space-y-2.5">
                            <li
                                v-for="line in column.items"
                                :key="line"
                                class="flex items-start gap-2 text-sm text-gray-700"
                            >
                                <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                {{ line }}
                            </li>
                        </ul>
                    </div>
                </div>
                <p class="mt-8 text-center text-sm text-gray-500">
                    More detail:
                    <Link :href="route('features')" class="font-medium text-blue-600 hover:text-blue-700">Features</Link>,
                    <Link :href="route('faq')" class="font-medium text-blue-600 hover:text-blue-700">FAQ</Link>,
                    or the
                    <Link :href="route('help-center')" class="font-medium text-blue-600 hover:text-blue-700">Help Center</Link>.
                </p>
            </div>
        </section>

        <section class="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <div class="mb-10 text-center">
                    <h2 class="text-2xl font-bold text-gray-900">Pricing questions</h2>
                    <p class="mt-2 text-sm text-gray-500">About Early Access, not invented plan comparisons.</p>
                </div>

                <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div v-for="(faq, index) in faqs" :key="faq.question">
                        <button
                            type="button"
                            class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50"
                            @click="toggleFaq(index)"
                        >
                            <span class="pr-4 text-sm font-semibold text-gray-900">{{ faq.question }}</span>
                            <svg
                                :class="[
                                    'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200',
                                    openFaq === index ? 'rotate-180' : '',
                                ]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <Transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0"
                            enter-to-class="opacity-100 max-h-96"
                            leave-active-class="transition-all duration-150 ease-in"
                            leave-from-class="opacity-100 max-h-96"
                            leave-to-class="opacity-0 max-h-0"
                        >
                            <div v-if="openFaq === index" class="overflow-hidden px-6 pb-5 text-sm leading-relaxed text-gray-500">
                                {{ faq.answer }}
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-blue-600 px-4 py-16 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-xl">
                <h2 class="text-2xl font-bold text-white sm:text-3xl">{{ EARLY_ACCESS_HEADLINE }}</h2>
                <p class="mt-3 text-blue-100">
                    Start with a guest upload or create a free account for storage and send-for-signature.
                </p>
                <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link :href="route('sign.index')" :class="[btnPrimary, '!bg-white !text-blue-600 hover:!bg-blue-50']">
                        {{ CTA_START_SIGNING }}
                    </Link>
                    <Link :href="route('register')" class="rounded-xl border border-white/40 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                        {{ CTA_CREATE_ACCOUNT }}
                    </Link>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
