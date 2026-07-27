<script setup>
import { computed } from 'vue';
import { getBlogCoverAlt, getBlogCoverPng, getBlogCoverWebp } from '@/Components/Blog/covers/coverUtils';

const props = defineProps({
    slug: { type: String, required: true },
    title: { type: String, default: '' },
    category: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    priority: { type: Boolean, default: false },
});

const alt = computed(() => getBlogCoverAlt(props.title || props.category));
const webpSrc = computed(() => getBlogCoverWebp(props.slug));
const pngSrc = computed(() => getBlogCoverPng(props.slug));
</script>

<template>
    <div class="relative aspect-[16/9] overflow-hidden bg-blue-50">
        <picture>
            <source :srcset="webpSrc" type="image/webp" />
            <img
                :src="pngSrc"
                :alt="alt"
                :loading="priority ? 'eager' : 'lazy'"
                :fetchpriority="priority ? 'high' : 'auto'"
                decoding="async"
                width="1200"
                height="675"
                class="h-full w-full object-cover"
            />
        </picture>

        <span
            v-if="featured"
            class="absolute left-4 top-4 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm"
        >
            Featured
        </span>
        <span
            v-if="popular"
            class="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-sm"
        >
            Popular
        </span>
        <span
            v-if="category"
            class="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm"
        >
            {{ category }}
        </span>
    </div>
</template>
