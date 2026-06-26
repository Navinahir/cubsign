<script setup>
defineProps({
    variant: { type: String, default: 'wave' }, // wave | dots | line
});
</script>

<template>
    <div class="relative h-12 overflow-hidden" aria-hidden="true">
        <svg v-if="variant === 'wave'" class="absolute inset-x-0 bottom-0 h-full w-full text-gray-50" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,32 C360,0 720,48 1080,24 C1260,12 1380,20 1440,28 L1440,48 L0,48 Z" />
        </svg>
        <div v-else-if="variant === 'dots'" class="flex h-full items-center justify-center gap-1.5">
            <span v-for="n in 3" :key="n" class="h-1 w-1 rounded-full bg-blue-200" />
        </div>
        <div v-else class="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
</template>
