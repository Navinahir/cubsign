<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { blogHeadingAnchors, normalizeBlogBlocks } from '@/utils/marketingContent';
import { linkifyBlogText } from '@/constants/blog';

const props = defineProps({
    blocks: { type: Array, default: () => [] },
    currentSlug: { type: String, default: '' },
});

const renderBlocks = computed(() => blogHeadingAnchors(normalizeBlogBlocks(props.blocks)));

function segments(text) {
    return linkifyBlogText(text, props.currentSlug);
}
</script>

<template>
    <div class="blog-prose">
        <template v-for="(block, index) in renderBlocks" :key="`${block.type}-${index}`">
            <p v-if="block.type === 'p'" class="mb-5 text-base leading-relaxed text-gray-600">
                <template v-for="(seg, segIndex) in segments(block.text)" :key="segIndex">
                    <Link
                        v-if="seg.type === 'blog'"
                        :href="route('blog.show', seg.slug)"
                        class="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                    >
                        {{ seg.value }}
                    </Link>
                    <Link
                        v-else-if="seg.type === 'route'"
                        :href="route(seg.routeName)"
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
                            v-if="seg.type === 'blog'"
                            :href="route('blog.show', seg.slug)"
                            class="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                        >
                            {{ seg.value }}
                        </Link>
                        <Link
                            v-else-if="seg.type === 'route'"
                            :href="route(seg.routeName)"
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
                            v-if="seg.type === 'blog'"
                            :href="route('blog.show', seg.slug)"
                            class="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                        >
                            {{ seg.value }}
                        </Link>
                        <Link
                            v-else-if="seg.type === 'route'"
                            :href="route(seg.routeName)"
                            class="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-400"
                        >
                            {{ seg.value }}
                        </Link>
                        <template v-else>{{ seg.value }}</template>
                    </template>
                </li>
            </ol>
            <aside
                v-else-if="block.type === 'tip'"
                class="mb-5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm leading-relaxed text-emerald-900"
            >
                <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Tip</p>
                <p>
                    <template v-for="(seg, segIndex) in segments(block.text)" :key="segIndex">
                        <Link
                            v-if="seg.type === 'blog'"
                            :href="route('blog.show', seg.slug)"
                            class="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-950"
                        >
                            {{ seg.value }}
                        </Link>
                        <Link
                            v-else-if="seg.type === 'route'"
                            :href="route(seg.routeName)"
                            class="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-950"
                        >
                            {{ seg.value }}
                        </Link>
                        <template v-else>{{ seg.value }}</template>
                    </template>
                </p>
            </aside>
            <aside
                v-else-if="block.type === 'note'"
                class="mb-5 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm leading-relaxed text-blue-950"
            >
                <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Note</p>
                <p>
                    <template v-for="(seg, segIndex) in segments(block.text)" :key="segIndex">
                        <Link
                            v-if="seg.type === 'blog'"
                            :href="route('blog.show', seg.slug)"
                            class="font-medium text-blue-800 underline decoration-blue-300 underline-offset-2 hover:text-blue-950"
                        >
                            {{ seg.value }}
                        </Link>
                        <Link
                            v-else-if="seg.type === 'route'"
                            :href="route(seg.routeName)"
                            class="font-medium text-blue-800 underline decoration-blue-300 underline-offset-2 hover:text-blue-950"
                        >
                            {{ seg.value }}
                        </Link>
                        <template v-else>{{ seg.value }}</template>
                    </template>
                </p>
            </aside>
        </template>
    </div>
</template>
