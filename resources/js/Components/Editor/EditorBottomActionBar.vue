<script setup>
import { computed } from 'vue';

const props = defineProps({
    fieldsPlaced: { type: Boolean, default: false },
    isFinishing:  { type: Boolean, default: false },
});

defineEmits(['review']);

const canReview = computed(() => props.fieldsPlaced && !props.isFinishing);
</script>

<template>
    <div class="flex h-14 shrink-0 items-center justify-end border-t border-gray-200 bg-white px-4 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <button
            type="button"
            :disabled="!canReview"
            :title="canReview ? 'Continue to review' : 'Add at least one field.'"
            :class="[
                'flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                canReview
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400',
            ]"
            @click="$emit('review')"
        >
            <svg v-if="isFinishing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>{{ isFinishing ? 'Preparing…' : 'Review Document' }}</span>
            <svg v-if="!isFinishing" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>
