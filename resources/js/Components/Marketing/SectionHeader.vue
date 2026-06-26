<script setup>
defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    align: { type: String, default: 'center' },
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <div :class="align === 'center' ? 'text-center' : 'text-left'">
        <span v-if="eyebrow" class="text-xs font-semibold uppercase tracking-widest text-blue-600">{{ eyebrow }}</span>
        <h2
            :class="[
                'font-bold tracking-tight text-gray-900',
                eyebrow ? (compact ? 'mt-1.5' : 'mt-3') : '',
                compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl',
            ]"
        >
            {{ title }}
        </h2>
        <p
            v-if="description"
            :class="[
                'text-gray-500',
                compact ? 'mt-2 text-sm' : 'mt-4 text-base',
                align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl',
            ]"
        >
            {{ description }}
        </p>
    </div>
</template>
