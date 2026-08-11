<script setup>
import BrandLogo from '@/Components/BrandLogo.vue';
import SeoRobotsHead from '@/Components/SeoRobotsHead.vue';
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 px-4 py-10 sm:py-14">
        <SeoRobotsHead />
        <div class="w-full max-w-[480px]">
            <Link
                :href="route('home')"
                class="mb-8 flex justify-center transition-opacity hover:opacity-90"
                aria-label="CubSign home"
            >
                <BrandLogo variant="auth" />
            </Link>

            <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-xl shadow-gray-200/60 sm:px-10 sm:py-10">
                <slot />
            </div>

            <div v-if="$slots.footer" class="mt-8 text-center">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>
