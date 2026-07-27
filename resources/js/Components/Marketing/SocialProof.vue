<script setup>
import { socialStats, customerLogos } from '@/constants/marketing';

defineProps({
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <div>
        <div :class="['grid grid-cols-3 gap-4', compact ? 'mb-10' : 'mb-14 gap-5']">
            <div v-for="stat in socialStats" :key="stat.label" class="marketing-card-lift rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm shadow-gray-100/80 sm:p-6">
                <p :class="[compact ? 'text-2xl' : 'text-3xl sm:text-4xl', 'font-bold tracking-tight text-blue-600']">{{ stat.value }}</p>
                <p class="mt-1.5 text-xs font-medium text-gray-500 sm:text-sm">{{ stat.label }}</p>
            </div>
        </div>

        <div :class="compact ? 'mb-10' : 'mb-14'">
            <p class="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Built for teams of every size</p>
            <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <div v-for="logo in customerLogos" :key="logo.name" class="flex items-center gap-2 rounded-xl border border-gray-100/80 bg-white px-3.5 py-2 shadow-sm shadow-gray-100/60" :aria-label="logo.name">
                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-[9px] font-bold text-gray-600">{{ logo.initials }}</div>
                    <span class="text-xs font-medium text-gray-600 sm:text-sm">{{ logo.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
