<script setup>
import { securityCards } from '@/constants/marketing';

defineProps({
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <div :class="['grid items-center', compact ? 'gap-8 lg:grid-cols-5' : 'gap-12 lg:grid-cols-5']">
        <div class="lg:col-span-2">
            <div :class="['relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 shadow-xl', compact ? 'p-6' : 'rounded-3xl p-8 shadow-2xl']">
                <svg viewBox="0 0 200 220" :class="[compact ? 'mx-auto h-36 w-32' : 'mx-auto h-56 w-48']" aria-hidden="true">
                    <defs>
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#93C5FD" />
                            <stop offset="100%" stop-color="#3B82F6" />
                        </linearGradient>
                    </defs>
                    <path d="M100 10 L180 45 L180 120 C180 170 100 210 100 210 C100 210 20 170 20 120 L20 45 Z" fill="url(#shieldGrad)" opacity="0.9" />
                    <path d="M75 115 L92 132 L130 90" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-3 text-center text-sm font-semibold text-white">Enterprise-grade Security</p>
            </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:col-span-3">
            <div
                v-for="card in securityCards"
                :key="card.title"
                class="marketing-card-lift rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
                <div class="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="card.icon" />
                    </svg>
                </div>
                <h3 class="text-sm font-semibold text-gray-900">{{ card.title }}</h3>
                <p class="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">{{ card.description }}</p>
            </div>
        </div>
    </div>
</template>
