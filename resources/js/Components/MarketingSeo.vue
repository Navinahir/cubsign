<script setup>
import { computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        default: '/',
    },
    faqSchema: {
        type: Array,
        default: () => [],
    },
});

const page = usePage();
const appUrl = computed(() => page.props.app?.url ?? '');
const canonicalUrl = computed(() => `${appUrl.value}${props.path}`);
const ogImage = computed(() => `${appUrl.value}/images/og-cubsign.png`);

const faqJsonLd = computed(() => {
    if (!props.faqSchema.length) {
        return null;
    }

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.faqSchema.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    });
});
</script>

<template>
    <Head :title="title">
        <meta head-key="description" name="description" :content="description" />
        <link head-key="canonical" rel="canonical" :href="canonicalUrl" />

        <meta head-key="og:type" property="og:type" content="website" />
        <meta head-key="og:site_name" property="og:site_name" content="CubSign" />
        <meta head-key="og:title" property="og:title" :content="title" />
        <meta head-key="og:description" property="og:description" :content="description" />
        <meta head-key="og:url" property="og:url" :content="canonicalUrl" />
        <meta head-key="og:image" property="og:image" :content="ogImage" />

        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta head-key="twitter:title" name="twitter:title" :content="title" />
        <meta head-key="twitter:description" name="twitter:description" :content="description" />
        <meta head-key="twitter:image" name="twitter:image" :content="ogImage" />

        <script
            v-if="faqJsonLd"
            head-key="faq-schema"
            type="application/ld+json"
            v-html="faqJsonLd"
        />
    </Head>
</template>
