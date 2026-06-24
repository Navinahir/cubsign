<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue';
</script>

<template>
    <PublicLayout>
        <section class="flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
            <div class="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-lg shadow-gray-200/50 sm:px-8">
                <slot />
            </div>
        </section>
    </PublicLayout>
</template>
