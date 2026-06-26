<script setup>
import { computed } from 'vue';

const props = defineProps({
    sections: { type: Array, required: true },
    activeId: { type: String, default: '' },
});

const emit = defineEmits(['navigate']);

const sectionIds = computed(() => props.sections.map((s) => s.id));
</script>

<template>
    <nav aria-label="Table of contents" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-900">On this page</h2>
        <ul class="mt-4 space-y-2">
            <li v-for="section in sections" :key="section.id">
                <a
                    :href="`#${section.id}`"
                    :class="[
                        'block text-sm transition-colors',
                        activeId === section.id ? 'font-medium text-blue-600' : 'text-gray-500 hover:text-gray-900',
                    ]"
                    @click.prevent="emit('navigate', section.id)"
                >
                    {{ section.title }}
                </a>
            </li>
        </ul>
    </nav>
</template>
