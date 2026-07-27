<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import { btnPrimary, btnSecondary } from '@/constants/marketing';

const props = defineProps({
    status: { type: Number, default: 404 },
});

const page = usePage();
const seoPath = computed(() => page.url.split('?')[0] || '/');

const title = computed(() => {
    if (props.status === 403) return 'Access denied';
    if (props.status === 503) return 'Service unavailable';
    if (props.status === 500) return 'Something went wrong';
    return 'Page not found';
});

const description = computed(() => {
    if (props.status === 403) return 'You do not have permission to view this page.';
    if (props.status === 503) return 'CubSign is temporarily unavailable. Please try again shortly.';
    if (props.status === 500) return 'An unexpected error occurred. Please try again or contact support if the problem continues.';
    return 'The page you are looking for does not exist or may have been moved.';
});
</script>

<template>
    <MarketingSeo
        :title="`${title} — CubSign`"
        :description="description"
        :path="seoPath"
    />

    <PublicLayout>
        <section class="marketing-section">
            <div class="mx-auto max-w-xl text-center">
                <p class="text-sm font-semibold uppercase tracking-widest text-blue-600">{{ status }}</p>
                <h1 class="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{{ title }}</h1>
                <p class="mt-4 text-base leading-relaxed text-gray-600">{{ description }}</p>
                <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link :href="route('home')" :class="btnPrimary">Back to home</Link>
                    <Link :href="route('sign.index')" :class="btnSecondary">Sign a PDF</Link>
                </div>
                <p class="mt-8 text-sm text-gray-500">
                    Need help?
                    <Link :href="route('help-center')" class="font-medium text-blue-600 hover:text-blue-700">Visit the Help Center</Link>
                    or
                    <Link :href="route('contact')" class="font-medium text-blue-600 hover:text-blue-700">contact support</Link>.
                </p>
            </div>
        </section>
    </PublicLayout>
</template>
