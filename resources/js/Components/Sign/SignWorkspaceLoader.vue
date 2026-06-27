<script setup>
import BrandLogo from '@/Components/BrandLogo.vue';

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
            <div class="mb-8 flex justify-center">
                <BrandLogo variant="loader" />
            </div>

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
