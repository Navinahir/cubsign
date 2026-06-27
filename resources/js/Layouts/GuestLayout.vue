<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue';
import BrandLogo from '@/Components/BrandLogo.vue';
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <PublicLayout>
        <section class="flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
            <div class="w-full max-w-md">
                <Link :href="route('home')" class="mb-8 flex justify-center transition-opacity hover:opacity-80" aria-label="CubArrow Sign home">
                    <BrandLogo variant="auth" />
                </Link>
                <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-lg shadow-gray-200/50 sm:px-8">
                    <slot />
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
