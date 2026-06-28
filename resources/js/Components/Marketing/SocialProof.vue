<script setup>
import AnimatedCounter from '@/Components/Marketing/AnimatedCounter.vue';
import { socialStats, customerLogos, testimonials } from '@/constants/marketing';

defineProps({
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <div>
        <div :class="['grid grid-cols-3 gap-4', compact ? 'mb-10' : 'mb-14 gap-5']">
            <div v-for="stat in socialStats" :key="stat.label" class="marketing-card-lift rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm shadow-gray-100/80 sm:p-6">
                <p :class="[compact ? 'text-2xl' : 'text-3xl sm:text-4xl', 'font-bold tracking-tight text-blue-600']"><AnimatedCounter :value="stat.value" /></p>
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

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            <div v-for="t in testimonials" :key="t.name" class="marketing-card-lift flex h-full min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-100/80">
                <div class="mb-4 flex gap-0.5">
                    <svg v-for="n in 5" :key="n" class="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <p class="flex-1 text-sm leading-relaxed text-gray-700 line-clamp-3">"{{ t.quote }}"</p>
                <div class="mt-5 flex min-w-0 items-center gap-3">
                    <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white', t.avatarBg]">{{ t.initials }}</div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-semibold text-gray-900">{{ t.name }}</p>
                        <p class="truncate text-xs text-gray-500">{{ t.role }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
