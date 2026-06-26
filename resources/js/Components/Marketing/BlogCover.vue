<script setup>
defineProps({
    gradient: { type: String, default: 'from-blue-600 to-indigo-700' },
    category: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    size: { type: String, default: 'default' }, // default | large
});
</script>

<template>
    <div
        :class="[
            'relative overflow-hidden bg-gradient-to-br',
            gradient,
            size === 'large' ? 'h-56 sm:h-72' : 'h-36',
        ]"
        role="img"
        :aria-label="category ? `${category} article cover` : 'Article cover'"
    >
        <!-- Decorative illustration -->
        <svg class="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="320" cy="40" r="80" fill="white" opacity="0.3" />
            <circle cx="60" cy="160" r="60" fill="white" opacity="0.2" />
            <rect x="40" y="60" width="120" height="80" rx="8" fill="white" opacity="0.15" />
            <path d="M180,140 L220,100 L260,120 L300,80" fill="none" stroke="white" stroke-width="3" opacity="0.4" stroke-linecap="round" />
        </svg>

        <!-- Document icon -->
        <div class="absolute bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>

        <span v-if="featured" class="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">Featured</span>
        <span v-if="popular" class="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">Popular</span>
        <span v-if="category" class="absolute bottom-6 right-6 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">{{ category }}</span>
    </div>
</template>
