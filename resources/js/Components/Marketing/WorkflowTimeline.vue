<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { journeySteps } from '@/constants/marketing';

const stepIcons = [
    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
    'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
];

const activeStep = ref(0);
let interval = null;

onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    interval = setInterval(() => {
        activeStep.value = (activeStep.value + 1) % journeySteps.length;
    }, 2800);
});
onUnmounted(() => clearInterval(interval));
</script>

<template>
    <div class="relative">
        <div class="hidden lg:block">
            <div class="absolute left-0 right-0 top-6 h-0.5 overflow-hidden rounded-full bg-blue-100" aria-hidden="true">
                <div
                    class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-out motion-reduce:transition-none"
                    :style="{ width: `${((activeStep + 1) / journeySteps.length) * 100}%` }"
                />
            </div>
            <div class="relative grid grid-cols-6 gap-2">
                <div v-for="(step, index) in journeySteps" :key="step.title" class="flex flex-col items-center text-center">
                    <div
                        :class="[
                            'relative z-10 flex h-12 w-12 items-center justify-center rounded-xl shadow-md transition-all duration-500 motion-reduce:transition-none',
                            activeStep === index ? 'scale-105 bg-blue-600' : 'bg-blue-500/85',
                        ]"
                    >
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="stepIcons[index]" />
                        </svg>
                    </div>
                    <h3 :class="['mt-2.5 text-xs font-semibold', activeStep === index ? 'text-blue-600' : 'text-gray-900']">{{ step.title }}</h3>
                    <p class="mt-0.5 hidden text-[10px] leading-snug text-gray-500 xl:block">{{ step.description }}</p>
                </div>
            </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2 lg:hidden">
            <template v-for="(step, index) in journeySteps" :key="step.title">
                <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700">
                    <span class="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-[10px] font-bold text-white">{{ index + 1 }}</span>
                    {{ step.title }}
                </div>
                <svg v-if="index < journeySteps.length - 1" class="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </template>
        </div>
    </div>
</template>
