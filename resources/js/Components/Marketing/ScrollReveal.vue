<script setup>
import { computed } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const props = defineProps({
    tag: { type: String, default: 'div' },
    delay: { type: Number, default: 0 },
    direction: { type: String, default: 'up' }, // up | fade | left | right
});

const { elementRef, isVisible } = useScrollReveal();

const revealClass = computed(() => {
    const base = 'transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0';
    if (isVisible.value) {
        return `${base} opacity-100 translate-x-0 translate-y-0`;
    }
    const hidden = {
        up: 'opacity-0 translate-y-8',
        fade: 'opacity-0',
        left: 'opacity-0 -translate-x-8',
        right: 'opacity-0 translate-x-8',
    };
    return `${base} ${hidden[props.direction] ?? hidden.up}`;
});

const style = computed(() => ({
    transitionDelay: isVisible.value ? `${props.delay}ms` : '0ms',
}));
</script>

<template>
    <component :is="tag" ref="elementRef" :class="revealClass" :style="style">
        <slot />
    </component>
</template>
