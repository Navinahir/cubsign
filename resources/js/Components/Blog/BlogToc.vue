<script setup>
defineProps({
    headings: { type: Array, default: () => [] },
    activeHeading: { type: String, default: '' },
});

const emit = defineEmits(['navigate']);

function onNavigate(id) {
    emit('navigate', id);
}
</script>

<template>
    <nav v-if="headings.length" aria-label="Table of contents">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            On this page
        </p>
        <ul class="mt-3 space-y-1 border-l border-gray-200">
            <li v-for="heading in headings" :key="heading.id">
                <a
                    :href="`#${heading.id}`"
                    :class="[
                        'block border-l-2 py-1.5 pl-3 text-[13px] leading-snug transition-colors -ml-px',
                        activeHeading === heading.id
                            ? 'border-blue-600 font-medium text-blue-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900',
                    ]"
                    @click.prevent="onNavigate(heading.id)"
                >
                    {{ heading.title }}
                </a>
            </li>
        </ul>
    </nav>
</template>
