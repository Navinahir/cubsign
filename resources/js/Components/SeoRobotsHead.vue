<script setup>
import { computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';

const page = usePage();

const robots = computed(() => {
    if (page.component === 'Error') {
        return 'noindex, nofollow';
    }

    return page.props.seo?.robots ?? 'index, follow';
});
</script>

<template>
    <Head>
        <meta head-key="robots" name="robots" :content="robots" />
    </Head>
</template>
