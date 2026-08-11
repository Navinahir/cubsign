<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import BlogArticleFigure from '@/Components/Blog/BlogArticleFigure.vue';
import ProductScreenshot from '@/Components/Marketing/ProductScreenshot.vue';
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

function segmentHref(seg) {
    if (seg.type === 'blog') return route('blog.show', seg.slug);
    if (seg.type === 'help') return route('help-center.show', seg.slug);
    if (seg.type === 'route') return route(seg.routeName);
    return null;
}
</script>

<template>
    <div class="blog-prose">
        <template v-for="(block, index) in renderBlocks" :key="`${block.type}-${index}`">
            <p v-if="block.type === 'p'" class="mb-5 text-base leading-relaxed text-gray-600">
                <template v-for="(seg, segIndex) in segments(block.text)" :key="segIndex">
                    <Link
                        v-if="segmentHref(seg)"
                        :href="segmentHref(seg)"
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
                            v-if="segmentHref(seg)"
                            :href="segmentHref(seg)"
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
                            v-if="segmentHref(seg)"
                            :href="segmentHref(seg)"
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
                            v-if="segmentHref(seg)"
                            :href="segmentHref(seg)"
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
                            v-if="segmentHref(seg)"
                            :href="segmentHref(seg)"
                            class="font-medium text-blue-800 underline decoration-blue-300 underline-offset-2 hover:text-blue-950"
                        >
                            {{ seg.value }}
                        </Link>
                        <template v-else>{{ seg.value }}</template>
                    </template>
                </p>
            </aside>
            <BlogArticleFigure
                v-else-if="block.type === 'figure'"
                :slug="block.slug || currentSlug"
                :asset="block.asset || 'workflow'"
                :alt="block.alt"
                :caption="block.caption"
                :variant="block.variant || 'wide'"
            />
            <ProductScreenshot
                v-else-if="block.type === 'product-screenshot'"
                :shot-key="block.key"
                :caption="block.caption || ''"
                :alt="block.alt || ''"
            />
            <aside
                v-else-if="block.type === 'callout'"
                class="mb-8 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/60 shadow-sm"
            >
                <div class="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-center sm:p-6">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            {{ block.title || 'CubSign tip' }}
                        </p>
                        <p class="mt-2 text-sm leading-relaxed text-blue-950">
                            <template v-for="(seg, segIndex) in segments(block.text)" :key="segIndex">
                                <Link
                                    v-if="segmentHref(seg)"
                                    :href="segmentHref(seg)"
                                    class="font-medium text-blue-800 underline decoration-blue-300 underline-offset-2 hover:text-blue-950"
                                >
                                    {{ seg.value }}
                                </Link>
                                <template v-else>{{ seg.value }}</template>
                            </template>
                        </p>
                    </div>
                    <BlogArticleFigure
                        v-if="block.asset"
                        :slug="block.slug || currentSlug"
                        :asset="block.asset"
                        :alt="block.alt"
                        variant="screenshot"
                        compact
                    />
                </div>
            </aside>
        </template>
    </div>
</template>
