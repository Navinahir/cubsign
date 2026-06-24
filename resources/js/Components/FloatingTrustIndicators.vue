<script setup>
import { floatingTrustItems } from '@/constants/marketing';
</script>

<template>
    <div class="mt-8 flex flex-wrap gap-2.5" role="list" aria-label="Trust indicators">
        <span
            v-for="item in floatingTrustItems"
            :key="item"
            role="listitem"
            class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm"
        >
            <svg class="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            {{ item }}
        </span>
    </div>
</template>
