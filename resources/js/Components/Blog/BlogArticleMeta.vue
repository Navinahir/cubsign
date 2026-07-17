<script setup>
import { formatDate } from '@/constants/blog';

defineProps({
    publishedAt: { type: String, default: '' },
    updatedAt: { type: String, default: '' },
    lastReviewed: { type: String, default: '' },
    readingTime: { type: Number, default: 0 },
    category: { type: String, default: '' },
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <div
        :class="[
            'flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500',
            compact ? 'text-xs' : 'text-sm',
        ]"
    >
        <span v-if="category" class="inline-flex items-center gap-1.5 font-medium text-blue-600">
            {{ category }}
        </span>
        <span v-if="publishedAt" class="inline-flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Published {{ formatDate(publishedAt) }}</span>
        </span>
        <span v-if="lastReviewed || updatedAt" class="inline-flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Last reviewed {{ formatDate(lastReviewed || updatedAt) }}</span>
        </span>
        <span v-if="readingTime" class="inline-flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ readingTime }} min read</span>
        </span>
    </div>
</template>
