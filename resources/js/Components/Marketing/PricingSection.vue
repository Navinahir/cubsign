<script setup>
import { Link } from '@inertiajs/vue3';
import {
    EARLY_ACCESS_HEADLINE,
    CTA_START_SIGNING,
    btnPrimary,
    pricingComparison,
} from '@/constants/marketing';

const earlyAccessBenefits = [
    'Unlimited signatures',
    'Unlimited recipients',
    'Unlimited downloads',
    'Secure cloud storage',
    'Audit history',
    'PDF signing',
    'Email verification',
    'Multi-recipient support',
];
</script>

<template>
    <div class="grid items-start gap-10 lg:grid-cols-2">
        <!-- Pricing card -->
        <div class="relative">
            <div class="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                <span class="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    Most Popular
                </span>
            </div>
            <div class="overflow-hidden rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-xl shadow-blue-100/60 sm:p-10">
                <p class="text-sm font-semibold uppercase tracking-widest text-blue-600">Early Access</p>
                <div class="mt-4 flex items-baseline gap-2">
                    <span class="text-5xl font-bold tracking-tight text-gray-900">$0</span>
                    <span class="text-sm text-gray-400">/ forever during early access</span>
                </div>
                <p class="mt-2 text-sm text-gray-500">{{ EARLY_ACCESS_HEADLINE }} — no credit card required.</p>

                <ul class="mt-8 space-y-3">
                    <li v-for="benefit in earlyAccessBenefits" :key="benefit" class="flex items-start gap-3 text-sm text-gray-700">
                        <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ benefit }}
                    </li>
                </ul>

                <Link :href="route('register')" :class="[btnPrimary, 'marketing-btn-ripple mt-10 w-full']">
                    {{ CTA_START_SIGNING }}
                </Link>
            </div>
        </div>

        <!-- Comparison table -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 class="text-lg font-semibold text-gray-900">How CubSign compares</h3>
            <p class="mt-1 text-sm text-gray-500">See why teams choose CubSign during Early Access.</p>

            <div class="mt-6 overflow-x-auto">
                <table class="w-full min-w-[280px] text-sm">
                    <thead>
                        <tr class="border-b border-gray-100">
                            <th class="pb-3 text-left font-medium text-gray-500">Feature</th>
                            <th class="pb-3 text-center font-semibold text-blue-600">CubSign</th>
                            <th class="pb-3 text-center font-medium text-gray-400">Others</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in pricingComparison" :key="row.feature" class="border-b border-gray-50">
                            <td class="py-3 text-gray-700">{{ row.feature }}</td>
                            <td class="py-3 text-center">
                                <svg v-if="row.cubsign" class="mx-auto h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span v-else class="text-gray-300">—</span>
                            </td>
                            <td class="py-3 text-center">
                                <svg v-if="row.others" class="mx-auto h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span v-else class="text-gray-300">—</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Link :href="route('pricing')" class="mt-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
                Full pricing details &rarr;
            </Link>
        </div>
    </div>
</template>
