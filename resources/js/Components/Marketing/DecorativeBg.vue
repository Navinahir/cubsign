<script setup>
defineProps({
    pattern: { type: String, default: 'grid' }, // grid | dots | rings
});
</script>

<template>
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg v-if="pattern === 'grid'" class="absolute inset-0 h-full w-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M32 0H0V32" fill="none" stroke="#93C5FD" stroke-width="0.5" opacity="0.4" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <svg v-else-if="pattern === 'dots'" class="absolute inset-0 h-full w-full opacity-30">
            <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#93C5FD" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        <div v-else class="absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div class="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
    </div>
</template>
