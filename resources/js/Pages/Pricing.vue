<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'For individuals who occasionally need to sign documents.',
        features: [
            '3 documents per month',
            'Self sign PDFs',
            'Draw, type, or upload signature',
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
        description: 'For professionals who sign and send frequently.',
        features: [
            'Unlimited documents',
            'Send for signature',
            'Reusable templates',
            'Full audit trail',
            'Priority email support',
            'All Free features',
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
        description: 'Early adopter lifetime access at a fixed price.',
        features: [
            'Everything in Pro',
            'Lifetime access',
            'Locked-in pricing forever',
            'Early access to new features',
            'Founding member status',
            'Direct support channel',
        ],
        cta: 'Coming Soon',
        ctaRoute: null,
        disabled: true,
        highlight: false,
    },
];

const comparisons = [
    { feature: 'Documents per month', free: '3', pro: 'Unlimited', founder: 'Unlimited' },
    { feature: 'Self sign PDFs', free: true, pro: true, founder: true },
    { feature: 'Send for signature', free: false, pro: true, founder: true },
    { feature: 'Reusable templates', free: false, pro: true, founder: true },
    { feature: 'Audit trail', free: false, pro: true, founder: true },
    { feature: 'Early access to features', free: false, pro: false, founder: true },
    { feature: 'Lifetime access', free: false, pro: false, founder: true },
];
</script>

<template>
    <Head title="Pricing — CubSign" />

    <PublicLayout>
        <!-- Header -->
        <section class="bg-gradient-to-b from-white to-gray-50 px-4 py-20 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</span>
                <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Simple, transparent pricing
                </h1>
                <p class="mt-5 text-lg text-gray-500">
                    Start free. No credit card required. Upgrade when you're ready.
                </p>
            </div>
        </section>

        <!-- Pricing cards -->
        <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-6xl">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div
                        v-for="plan in plans"
                        :key="plan.name"
                        :class="[
                            'relative flex flex-col rounded-2xl border p-8',
                            plan.highlight
                                ? 'border-blue-500 shadow-lg shadow-blue-100'
                                : 'border-gray-200',
                        ]"
                    >
                        <div
                            v-if="plan.highlight"
                            class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white"
                        >
                            Most Popular
                        </div>

                        <div class="mb-6">
                            <h2 class="text-xl font-bold text-gray-900">{{ plan.name }}</h2>
                            <p class="mt-1 text-sm text-gray-500">{{ plan.description }}</p>
                            <div class="mt-5 flex items-baseline gap-1">
                                <span class="text-5xl font-bold text-gray-900">{{ plan.price }}</span>
                                <span class="ml-1 text-sm text-gray-400">/ {{ plan.period }}</span>
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
                            class="w-full cursor-not-allowed rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-400"
                        >
                            {{ plan.cta }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Comparison table -->
        <section class="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl">
                <h2 class="mb-10 text-center text-2xl font-bold text-gray-900">Compare plans</h2>

                <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-100">
                                <th class="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                                <th class="px-6 py-4 text-center font-semibold text-gray-900">Free</th>
                                <th class="px-6 py-4 text-center font-semibold text-blue-600">Pro</th>
                                <th class="px-6 py-4 text-center font-semibold text-gray-900">Founder</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="row in comparisons" :key="row.feature">
                                <td class="px-6 py-4 text-gray-600">{{ row.feature }}</td>
                                <td class="px-6 py-4 text-center">
                                    <span v-if="typeof row.free === 'boolean'">
                                        <svg v-if="row.free" class="mx-auto h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span v-else class="text-gray-300">—</span>
                                    </span>
                                    <span v-else class="font-medium text-gray-900">{{ row.free }}</span>
                                </td>
                                <td class="bg-blue-50/30 px-6 py-4 text-center">
                                    <span v-if="typeof row.pro === 'boolean'">
                                        <svg v-if="row.pro" class="mx-auto h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span v-else class="text-gray-300">—</span>
                                    </span>
                                    <span v-else class="font-medium text-gray-900">{{ row.pro }}</span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span v-if="typeof row.founder === 'boolean'">
                                        <svg v-if="row.founder" class="mx-auto h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span v-else class="text-gray-300">—</span>
                                    </span>
                                    <span v-else class="font-medium text-gray-900">{{ row.founder }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="bg-blue-600 px-4 py-14 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-xl">
                <h2 class="text-2xl font-bold text-white">Start signing for free today</h2>
                <p class="mt-2 text-blue-100">No credit card required. Cancel anytime.</p>
                <Link
                    :href="route('register')"
                    class="mt-7 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                    Get Started Free
                </Link>
            </div>
        </section>
    </PublicLayout>
</template>
