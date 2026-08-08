<script setup>
import { computed } from 'vue';
import { getProductScreenshot } from '@/constants/productScreenshots';

const props = defineProps({
    shotKey: { type: String, required: true },
    caption: { type: String, default: '' },
    alt: { type: String, default: '' },
    eager: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
});

const shot = computed(() => getProductScreenshot(props.shotKey));
const altText = computed(() => props.alt || shot.value?.alt || 'CubSign product screenshot');
const captionText = computed(() => props.caption || shot.value?.caption || '');
</script>

<template>
    <figure
        v-if="shot"
        :class="[
            'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm',
            compact ? 'my-4' : 'my-8',
        ]"
    >
        <picture>
            <source :srcset="shot.src" type="image/webp" />
            <img
                :src="shot.fallbackSrc || shot.src"
                :alt="altText"
                :width="shot.width"
                :height="shot.height"
                :loading="eager ? 'eager' : 'lazy'"
                decoding="async"
                class="h-auto w-full object-cover object-top"
            />
        </picture>
        <figcaption
            v-if="captionText"
            class="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-sm leading-relaxed text-gray-500"
        >
            {{ captionText }}
        </figcaption>
    </figure>
</template>
