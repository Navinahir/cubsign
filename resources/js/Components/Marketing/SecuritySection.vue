<script setup>
import { securityCards } from '@/constants/marketing';
</script>

<template>
    <div class="grid items-center gap-12 lg:grid-cols-5">
        <!-- Illustration -->
        <div class="relative lg:col-span-2">
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 p-8 shadow-2xl">
                <div class="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div class="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />

                <!-- Shield SVG illustration -->
                <svg viewBox="0 0 200 220" class="mx-auto h-56 w-48" aria-hidden="true">
                    <defs>
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#93C5FD" />
                            <stop offset="100%" stop-color="#3B82F6" />
                        </linearGradient>
                    </defs>
                    <path d="M100 10 L180 45 L180 120 C180 170 100 210 100 210 C100 210 20 170 20 120 L20 45 Z" fill="url(#shieldGrad)" opacity="0.9" />
                    <path d="M100 10 L180 45 L180 120 C180 170 100 210 100 210 C100 210 20 170 20 120 L20 45 Z" fill="none" stroke="white" stroke-width="2" opacity="0.3" />
                    <path d="M75 115 L92 132 L130 90" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="100" cy="75" r="20" fill="none" stroke="white" stroke-width="2" opacity="0.4" />
                    <path d="M90 75 L100 85 L115 68" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
                </svg>

                <div class="mt-4 text-center">
                    <p class="text-sm font-semibold text-white">Enterprise-grade Security</p>
                    <p class="mt-1 text-xs text-blue-200">Your documents are protected at every step</p>
                </div>
            </div>
        </div>

        <!-- Cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            <div
                v-for="card in securityCards"
                :key="card.title"
                class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
                <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="card.icon" />
                    </svg>
                </div>
                <h3 class="text-sm font-semibold text-gray-900">{{ card.title }}</h3>
                <p class="mt-1.5 text-xs leading-relaxed text-gray-500">{{ card.description }}</p>
            </div>
        </div>
    </div>
</template>
