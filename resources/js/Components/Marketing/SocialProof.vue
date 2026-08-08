<script setup>
import { audienceUseCases, socialStats } from '@/constants/marketing';

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
            <p class="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Example audiences (not customer logos)</p>
            <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <div
                    v-for="item in audienceUseCases"
                    :key="item.name"
                    class="flex max-w-xs items-center gap-2 rounded-xl border border-gray-100/80 bg-white px-3.5 py-2 shadow-sm shadow-gray-100/60"
                    :aria-label="`${item.name}: ${item.example}`"
                >
                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-[9px] font-bold text-gray-600">{{ item.initials }}</div>
                    <div class="min-w-0 text-left">
                        <span class="block text-xs font-medium text-gray-700 sm:text-sm">{{ item.name }}</span>
                        <span class="block truncate text-[11px] text-gray-400">{{ item.example }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
