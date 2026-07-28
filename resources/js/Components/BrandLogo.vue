<script setup>
import CubSignLogoSvg from '@/Components/CubSignLogoSvg.vue';

defineProps({
    variant: {
        type: String,
        default: 'navbar',
        validator: (v) => ['navbar', 'footer', 'auth', 'loader', 'workspace'].includes(v),
    },
});
</script>

<template>
    <CubSignLogoSvg :variant="variant" />
</template>
