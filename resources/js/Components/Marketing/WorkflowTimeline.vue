<script setup>
import { journeySteps } from '@/constants/marketing';

const stepIcons = [
    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
    'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
];
</script>

<template>
    <div class="relative">
        <!-- Desktop timeline -->
        <div class="hidden lg:block">
            <div class="absolute left-0 right-0 top-10 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" aria-hidden="true" />
            <div class="relative grid grid-cols-5 gap-4">
                <div
                    v-for="(step, index) in journeySteps"
                    :key="step.title"
                    class="group flex flex-col items-center text-center"
                >
                    <div class="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25 transition-transform group-hover:scale-105">
                        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="stepIcons[index]" />
                        </svg>
                        <span class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow ring-2 ring-blue-100">
                            {{ index + 1 }}
                        </span>
                    </div>
                    <h3 class="mt-5 text-sm font-semibold text-gray-900">{{ step.title }}</h3>
                    <p class="mt-1.5 text-xs leading-relaxed text-gray-500">{{ step.description }}</p>
                </div>
            </div>
        </div>

        <!-- Mobile / tablet vertical timeline -->
        <div class="space-y-0 lg:hidden">
            <div
                v-for="(step, index) in journeySteps"
                :key="step.title"
                class="relative flex gap-5 pb-8 last:pb-0"
            >
                <div v-if="index < journeySteps.length - 1" class="absolute left-5 top-14 h-full w-0.5 bg-blue-200" aria-hidden="true" />
                <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md">
                    {{ index + 1 }}
                </div>
                <div class="pt-1.5">
                    <h3 class="text-sm font-semibold text-gray-900">{{ step.title }}</h3>
                    <p class="mt-1 text-sm text-gray-500">{{ step.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
