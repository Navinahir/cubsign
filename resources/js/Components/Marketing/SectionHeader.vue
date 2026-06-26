<script setup>
defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    align: { type: String, default: 'center' },
});
</script>

<template>
    <div :class="align === 'center' ? 'text-center' : 'text-left'">
        <span v-if="eyebrow" class="text-xs font-semibold uppercase tracking-widest text-blue-600">{{ eyebrow }}</span>
        <h2 :class="['font-bold tracking-tight text-gray-900', eyebrow ? 'mt-3' : '', 'text-3xl sm:text-4xl']">
            {{ title }}
        </h2>
        <p v-if="description" :class="['mt-4 text-base text-gray-500', align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl']">
            {{ description }}
        </p>
    </div>
</template>
