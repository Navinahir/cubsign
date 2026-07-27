<script setup>
import { securitySections } from '@/constants/security';

defineProps({
    activeSlug: { type: String, default: '' },
});
</script>

<template>
    <nav aria-label="Security topics" class="space-y-1">
        <p class="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Topics
        </p>
        <a
            v-for="section in securitySections"
            :key="section.slug"
            :href="`#${section.slug}`"
            :class="[
                'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activeSlug === section.slug
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
            ]"
        >
            {{ section.title }}
        </a>
        <a
            href="#security-faq"
            :class="[
                'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activeSlug === 'security-faq'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
            ]"
        >
            Security FAQ
        </a>
    </nav>
</template>
