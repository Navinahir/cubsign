<script setup>
import { computed } from 'vue';
import { blogHeadingAnchors, normalizeBlogBlocks } from '@/utils/marketingContent';

const props = defineProps({
    blocks: { type: Array, default: () => [] },
});

const renderBlocks = computed(() => blogHeadingAnchors(normalizeBlogBlocks(props.blocks)));
</script>

<template>
    <template v-for="(block, index) in renderBlocks" :key="`${block.type}-${index}`">
        <p v-if="block.type === 'p'" class="mb-5 text-base leading-relaxed text-gray-600">{{ block.text }}</p>
        <h2
            v-else-if="block.type === 'h2'"
            :id="block.id"
            class="mb-4 mt-10 scroll-mt-24 text-xl font-bold text-gray-900"
        >
            {{ block.text }}
        </h2>
        <ul v-else-if="block.type === 'ul'" class="mb-5 list-disc space-y-2 pl-5 text-base text-gray-600">
            <li v-for="item in block.items" :key="item">{{ item }}</li>
        </ul>
    </template>
</template>
