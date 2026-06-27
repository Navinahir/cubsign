<script setup>
import CubArrowLogoSvg from '@/Components/CubArrowLogoSvg.vue';

defineProps({
    variant: {
        type: String,
        default: 'navbar',
        validator: (v) => ['navbar', 'footer', 'auth', 'loader', 'workspace'].includes(v),
    },
});
</script>

<template>
    <CubArrowLogoSvg :variant="variant" />
</template>
