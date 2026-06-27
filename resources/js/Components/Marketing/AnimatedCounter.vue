<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
    value: { type: String, required: true }, // e.g. "2,500+" or "99.9%"
    duration: { type: Number, default: 2000 },
});

const display = ref('');
const elementRef = ref(null);
let observer = null;
let animated = false;

const numericPart = computed(() => {
    const match = props.value.match(/^([\d,.]+)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
});

const suffix = computed(() => props.value.replace(/^[\d,.]+/, ''));

function initialDisplay() {
    return numericPart.value === null ? props.value : '0';
}

function animate() {
    if (animated) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || numericPart.value === null) {
        display.value = props.value;
        animated = true;
        return;
    }
    animated = true;
    const target = numericPart.value;
    const isDecimal = props.value.includes('.');
    const start = performance.now();
    function tick(now) {
        const p = Math.min((now - start) / props.duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = target * eased;
        if (isDecimal) {
            display.value = current.toFixed(1) + suffix.value;
        } else if (target >= 1000) {
            display.value = Math.round(current).toLocaleString() + suffix.value;
        } else {
            display.value = Math.round(current) + suffix.value;
        }
        if (p < 1) requestAnimationFrame(tick);
        else display.value = props.value;
    }
    requestAnimationFrame(tick);
}

onMounted(() => {
    display.value = initialDisplay();

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        display.value = props.value;
        return;
    }
    observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            animate();
            observer?.disconnect();
        }
    }, { threshold: 0.3 });
    if (elementRef.value) observer.observe(elementRef.value);
});

onUnmounted(() => observer?.disconnect());
watch(() => props.value, () => { animated = false; display.value = initialDisplay(); });
</script>

<template>
    <span ref="elementRef" class="tabular-nums">{{ display }}</span>
</template>
