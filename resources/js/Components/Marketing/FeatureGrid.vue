<script setup>
import { computed } from 'vue';
import { featureGrid, homeFeatureGrid } from '@/constants/marketing';

const props = defineProps({
    compact: { type: Boolean, default: false },
    features: { type: Array, default: null },
});

const items = computed(() => props.features ?? (props.compact ? homeFeatureGrid : featureGrid));
</script>

<template>
    <div :class="['grid gap-4', compact ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3']">
        <div
            v-for="card in items"
            :key="card.title"
            :class="[
                'marketing-card-lift group rounded-xl border border-gray-200 bg-white shadow-sm',
                compact ? 'flex max-h-[180px] flex-col p-4' : 'overflow-hidden rounded-2xl hover:-translate-y-1 hover:shadow-lg',
            ]"
        >
            <div :class="['flex shrink-0 items-center justify-center rounded-lg', compact ? 'mb-3 h-9 w-9' : 'mb-4 h-10 w-10 rounded-xl', card.iconBg]">
                <svg :class="['h-4 w-4', compact ? '' : 'h-5 w-5', card.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="card.icon" />
                </svg>
            </div>
            <h3 :class="[compact ? 'text-sm' : 'text-[15px]', 'font-semibold text-gray-900']">{{ card.title }}</h3>
            <p :class="[compact ? 'mt-1 line-clamp-2 text-xs' : 'mt-2 text-sm leading-relaxed', 'text-gray-500']">{{ card.description }}</p>
        </div>
    </div>
</template>
