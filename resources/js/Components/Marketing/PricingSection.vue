<script setup>
import { Link } from '@inertiajs/vue3';
import {
    EARLY_ACCESS_HEADLINE,
    CTA_UPLOAD_PDF,
    btnPrimary,
    pricingComparison,
} from '@/constants/marketing';

defineProps({
    compact: { type: Boolean, default: false },
});

const fullBenefits = [
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
    <div v-if="compact" class="mx-auto max-w-lg">
        <div class="marketing-card-lift overflow-hidden rounded-2xl border border-blue-100 bg-white p-8 shadow-lg shadow-blue-100/40">
            <p class="text-center text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</p>
            <h3 class="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">{{ EARLY_ACCESS_HEADLINE }}</h3>
            <div class="mt-4 flex items-baseline justify-center gap-2">
                <span class="text-5xl font-bold tracking-tight text-gray-900">$0</span>
                <span class="text-sm text-gray-400">forever during early access</span>
            </div>
            <ul class="mt-8 space-y-3">
                <li v-for="benefit in fullBenefits.slice(0, 6)" :key="benefit" class="flex items-center gap-2.5 text-sm text-gray-700">
                    <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ benefit }}
                </li>
            </ul>
            <Link :href="route('sign.index')" :class="[btnPrimary, 'marketing-btn-ripple mt-8 w-full py-3.5']">
                {{ CTA_UPLOAD_PDF }}
            </Link>
        </div>
    </div>

    <div v-else class="grid items-start gap-10 lg:grid-cols-2">
        <div>
            <div class="relative">
                <div class="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <span class="inline-flex rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Most Popular</span>
                </div>
                <div class="marketing-card-lift overflow-hidden rounded-3xl border-2 border-blue-200 bg-white p-8 shadow-xl sm:p-10">
                    <p class="text-xs font-semibold uppercase tracking-widest text-blue-600">Early Access</p>
                    <div class="mt-3 flex items-baseline gap-2">
                        <span class="text-5xl font-bold tracking-tight text-gray-900">$0</span>
                        <span class="text-xs text-gray-400">during early access</span>
                    </div>
                    <ul class="mt-8 space-y-3">
                        <li v-for="benefit in fullBenefits" :key="benefit" class="flex items-center gap-2 text-sm text-gray-700">
                            <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            {{ benefit }}
                        </li>
                    </ul>
                    <Link :href="route('sign.index')" :class="[btnPrimary, 'marketing-btn-ripple mt-10 w-full']">{{ CTA_UPLOAD_PDF }}</Link>
                </div>
            </div>
        </div>

        <div class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 class="text-lg font-semibold text-gray-900">How CubSign compares</h3>
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
                                <svg v-if="row.cubsign" class="mx-auto h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            </td>
                            <td class="py-3 text-center">
                                <svg v-if="row.others" class="mx-auto h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                                <span v-else class="text-gray-300">—</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Link :href="route('pricing')" class="mt-6 inline-flex text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">Full pricing details &rarr;</Link>
        </div>
    </div>
</template>
