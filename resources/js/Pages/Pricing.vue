<script setup>
import { ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import { Link } from '@inertiajs/vue3';

const benefits = [
    'Unlimited signatures',
    'Unlimited recipients',
    'Unlimited downloads',
    'Secure cloud storage',
    'Audit history',
    'PDF signing',
];

const faqs = [
    {
        question: 'Why is CubSign free?',
        answer: 'We are currently in Early Access and collecting feedback from users before introducing paid plans.',
    },
    {
        question: 'Will CubSign always be free?',
        answer: 'CubSign is free during early access while we validate the product. Paid plans may be introduced later, and early access users will be notified well in advance.',
    },
    {
        question: 'Do I need a credit card?',
        answer: 'No credit card is required. Create a free account and start signing immediately.',
    },
    {
        question: 'What happens when paid plans launch?',
        answer: 'Early access users will receive advance notice and preferential pricing options. Your documents and account remain secure throughout any transition.',
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
        description="CubSign is completely free during early access. Unlimited signatures, recipients, and downloads while we improve the platform."
        path="/pricing"
        :faq-schema="faqs"
    />

    <PublicLayout>
        <section class="bg-gradient-to-b from-white to-blue-50/40 px-4 py-20 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl">
                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Early Access
                </span>
                <h1 class="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Free During Early Access
                </h1>
                <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
                    Use CubSign completely free while we improve the platform based on user feedback.
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

                    <p class="text-sm font-semibold uppercase tracking-widest text-blue-600">Free Plan</p>
                    <h2 class="mt-2 text-2xl font-bold text-gray-900">Everything included</h2>
                    <p class="mt-2 text-sm text-gray-500">Full access while we build with your feedback.</p>

                    <div class="mt-8 flex items-baseline gap-2">
                        <span class="text-6xl font-bold tracking-tight text-gray-900">$0</span>
                        <span class="text-sm text-gray-400">during early access</span>
                    </div>

                    <ul class="mt-8 space-y-3.5">
                        <li
                            v-for="benefit in benefits"
                            :key="benefit"
                            class="flex items-start gap-3 text-sm text-gray-700"
                        >
                            <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            {{ benefit }}
                        </li>
                    </ul>

                    <Link
                        :href="route('register')"
                        class="mt-10 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:-translate-y-px hover:bg-blue-700 hover:shadow-md"
                    >
                        Start Signing Free
                    </Link>

                    <p class="mt-4 text-center text-xs text-gray-400">
                        No credit card required &middot; Cancel anytime
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

        <section class="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <div class="mb-10 text-center">
                    <h2 class="text-2xl font-bold text-gray-900">Pricing questions</h2>
                    <p class="mt-2 text-sm text-gray-500">Common questions about our early access program.</p>
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
                            enter-to-class="opacity-100 max-h-40"
                            leave-active-class="transition-all duration-150 ease-in"
                            leave-from-class="opacity-100 max-h-40"
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
                <h2 class="text-2xl font-bold text-white sm:text-3xl">Join early access today</h2>
                <p class="mt-3 text-blue-100">
                    Help shape CubSign while enjoying unlimited signing — completely free.
                </p>
                <Link
                    :href="route('register')"
                    class="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 shadow-sm transition-all hover:-translate-y-px hover:bg-blue-50 hover:shadow-md"
                >
                    Start Signing Free
                </Link>
            </div>
        </section>
    </PublicLayout>
</template>
