<script setup>
defineProps({
    title: { type: String, default: 'Loading document…' },
    subtitle: { type: String, default: 'Preparing your signing workspace…' },
});
</script>

<template>
    <div
        class="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px]"
        role="status"
        aria-live="polite"
        aria-busy="true"
    >
        <div class="mx-4 w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-2xl ring-1 ring-black/5">
            <!-- CubSign branding -->
            <div class="mb-8 flex flex-col items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25">
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span class="text-lg font-bold tracking-tight text-gray-900">CubSign</span>
            </div>

            <!-- Animated spinner -->
            <div class="relative mx-auto mb-8 h-14 w-14" aria-hidden="true">
                <div class="absolute inset-0 rounded-full border-[3px] border-gray-200" />
                <div class="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-blue-600" />
                <div
                    class="absolute inset-2 animate-spin rounded-full border-[3px] border-transparent border-b-blue-400"
                    style="animation-direction: reverse; animation-duration: 1.4s;"
                />
            </div>

            <p class="text-base font-semibold text-gray-900">{{ title }}</p>
            <p class="mt-2 text-sm text-gray-500">{{ subtitle }}</p>
        </div>
    </div>
</template>
