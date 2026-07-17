<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { blogHeadingAnchors, normalizeBlogBlocks } from '@/utils/marketingContent';
import { linkifyHelpText } from '@/constants/help';

const props = defineProps({
    blocks: { type: Array, default: () => [] },
    currentSlug: { type: String, default: '' },
});

const renderBlocks = computed(() => blogHeadingAnchors(normalizeBlogBlocks(props.blocks)));

function segments(text) {
    return linkifyHelpText(text, props.currentSlug);
}
</script>

<template>
    <div class="help-prose">
        <template v-for="(block, index) in renderBlocks" :key="`${block.type}-${index}`">
            <p v-if="block.type === 'p'" class="mb-5 text-base leading-relaxed text-gray-600">
                <template v-for="(seg, segIndex) in segments(block.text)" :key="segIndex">
                    <Link
                        v-if="seg.type === 'link'"
                        :href="route('help-center.show', seg.slug)"
                        class="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                    >
                        {{ seg.value }}
                    </Link>
                    <template v-else>{{ seg.value }}</template>
                </template>
            </p>
            <h2
                v-else-if="block.type === 'h2'"
                :id="block.id"
                class="mb-4 mt-10 scroll-mt-28 text-xl font-bold tracking-tight text-gray-900"
            >
                {{ block.text }}
            </h2>
            <ul v-else-if="block.type === 'ul'" class="mb-5 list-disc space-y-2 pl-5 text-base text-gray-600">
                <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
                    <template v-for="(seg, segIndex) in segments(item)" :key="segIndex">
                        <Link
                            v-if="seg.type === 'link'"
                            :href="route('help-center.show', seg.slug)"
                            class="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                        >
                            {{ seg.value }}
                        </Link>
                        <template v-else>{{ seg.value }}</template>
                    </template>
                </li>
            </ul>
            <ol v-else-if="block.type === 'ol'" class="mb-5 list-decimal space-y-2 pl-5 text-base text-gray-600">
                <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
                    <template v-for="(seg, segIndex) in segments(item)" :key="segIndex">
                        <Link
                            v-if="seg.type === 'link'"
                            :href="route('help-center.show', seg.slug)"
                            class="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                        >
                            {{ seg.value }}
                        </Link>
                        <template v-else>{{ seg.value }}</template>
                    </template>
                </li>
            </ol>
        </template>
    </div>
</template>
