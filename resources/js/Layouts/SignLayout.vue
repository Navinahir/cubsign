<script setup>
import { Link } from '@inertiajs/vue3';
import DevNav from '@/Components/DevNav.vue';

const props = defineProps({
    step: {
        type: Number,
        default: 1,
    },
});

const steps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Preview' },
    { number: 3, label: 'Sign' },
    { number: 4, label: 'Download' },
];
</script>

<template>
    <div class="flex h-screen flex-col overflow-hidden bg-gray-50">

        <!-- Top bar -->
        <header class="border-b border-gray-200 bg-white">
            <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-14 items-center justify-between">

                    <Link :href="route('home')" class="flex items-center gap-2">
                        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                            <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span class="font-bold text-gray-900">CubSign</span>
                    </Link>

                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg class="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Secure &amp; Private
                    </div>
                </div>
            </div>
        </header>

        <!-- Step indicator -->
        <div class="border-b border-gray-200 bg-white">
            <div class="mx-auto max-w-5xl px-4 py-3.5 sm:px-6 lg:px-8">
                <div class="flex items-center">
                    <template v-for="(s, i) in steps" :key="s.number">
                        <div class="flex items-center gap-2">
                            <!-- Circle -->
                            <div
                                :class="[
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                                    step > s.number
                                        ? 'bg-blue-600 text-white'
                                        : step === s.number
                                        ? 'border-2 border-blue-600 bg-white text-blue-600'
                                        : 'bg-gray-200 text-gray-500',
                                ]"
                            >
                                <svg v-if="step > s.number" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                </svg>
                                <span v-else>{{ s.number }}</span>
                            </div>
                            <!-- Label -->
                            <span
                                :class="[
                                    'hidden text-xs font-medium sm:block',
                                    step >= s.number ? 'text-gray-900' : 'text-gray-400',
                                ]"
                            >
                                {{ s.label }}
                            </span>
                        </div>
                        <!-- Connector -->
                        <div
                            v-if="i < steps.length - 1"
                            :class="['mx-3 h-px flex-1', step > s.number ? 'bg-blue-600' : 'bg-gray-200']"
                        />
                    </template>
                </div>
            </div>
        </div>

        <!-- Page content -->
        <main class="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <slot />
        </main>

        <DevNav />

    </div>
</template>
