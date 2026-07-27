<script setup>
import { getBlogAssetAlt, getBlogAssetPng, getBlogAssetWebp } from '@/Components/Blog/assets/assetUtils';

const props = defineProps({
    slug: { type: String, required: true },
    asset: { type: String, default: 'workflow' },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
    variant: { type: String, default: 'wide' },
    priority: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
});

const altText = props.alt || getBlogAssetAlt(props.slug, props.asset);
const webpSrc = getBlogAssetWebp(props.slug, props.asset);
const pngSrc = getBlogAssetPng(props.slug, props.asset);

const figureClass = {
    wide: 'max-w-4xl',
    screenshot: 'max-w-3xl',
    diagram: 'max-w-4xl',
}[props.variant] ?? 'max-w-4xl';
</script>

<template>
    <figure :class="[compact ? 'my-0' : 'my-8', figureClass]">
        <picture class="block overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
            <source :srcset="webpSrc" type="image/webp" />
            <img
                :src="pngSrc"
                :alt="altText"
                width="960"
                height="540"
                class="h-auto w-full"
                :loading="priority ? 'eager' : 'lazy'"
                decoding="async"
            />
        </picture>
        <figcaption v-if="caption" class="mt-3 text-center text-sm leading-relaxed text-gray-500">
            {{ caption }}
        </figcaption>
    </figure>
</template>
