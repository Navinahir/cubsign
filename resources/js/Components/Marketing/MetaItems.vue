<script setup>
import { computed } from 'vue';
import { hasMarketingText } from '@/utils/marketingContent';

const props = defineProps({
    items: { type: Array, default: () => [] },
});

const visibleItems = computed(() =>
    props.items.filter((item) => {
        if (item == null) return false;
        if (typeof item === 'string' || typeof item === 'number') {
            return hasMarketingText(item);
        }
        return hasMarketingText(item.text);
    }),
);
</script>

<template>
    <div v-if="visibleItems.length" class="flex flex-wrap items-center gap-3">
        <template v-for="(item, index) in visibleItems" :key="index">
            <span v-if="typeof item === 'string' || typeof item === 'number'">
                {{ item }}
            </span>
            <span v-else :class="item.class">{{ item.text }}</span>
        </template>
    </div>
</template>
