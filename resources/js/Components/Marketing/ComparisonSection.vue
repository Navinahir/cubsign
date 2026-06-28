<script setup>
import { homeComparisonCubsign, homeComparisonOthers } from '@/constants/marketing';
</script>

<template>
    <div class="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div class="marketing-card-lift rounded-2xl border-2 border-blue-200/80 bg-white p-7 shadow-lg shadow-blue-100/30 ring-1 ring-blue-50 sm:p-9">
            <div class="mb-7 flex items-center gap-3.5">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/25">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900">CubSign</h3>
            </div>
            <ul class="space-y-4">
                <li v-for="item in homeComparisonCubsign" :key="item" class="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                    <svg class="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ item }}
                </li>
            </ul>
        </div>

        <div class="marketing-card-lift rounded-2xl border border-gray-200/80 bg-gray-50/60 p-7 shadow-sm sm:p-9">
            <div class="mb-7 flex items-center gap-3.5">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-200/80">
                    <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-500">Others</h3>
            </div>
            <ul class="space-y-4">
                <li v-for="item in homeComparisonOthers" :key="item" class="flex items-start gap-3 text-sm leading-relaxed text-gray-500">
                    <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>
