<script setup>
import { computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';

const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    path: { type: String, default: '/' },
    faqSchema: { type: Array, default: () => [] },
    type: { type: String, default: 'website' },
    article: { type: Object, default: null },
});

const page = usePage();
const appUrl = computed(() => page.props.app?.url ?? '');
const canonicalUrl = computed(() => `${appUrl.value}${props.path}`);
const ogImage = computed(() => `${appUrl.value}/images/og-cubsign.png`);

const faqJsonLd = computed(() => {
    if (!props.faqSchema.length) return null;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.faqSchema.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    });
});

const orgJsonLd = computed(() => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CubSign',
    url: appUrl.value,
    logo: `${appUrl.value}/images/og-cubsign.png`,
    sameAs: [
        'https://linkedin.com/company/cubsign',
        'https://twitter.com/cubsign',
        'https://github.com/cubsign',
    ],
}));

const articleJsonLd = computed(() => {
    if (!props.article) return null;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.article.title,
        description: props.article.excerpt,
        author: { '@type': 'Person', name: props.article.author.name },
        datePublished: props.article.publishedAt,
        publisher: { '@type': 'Organization', name: 'CubSign', logo: { '@type': 'ImageObject', url: ogImage.value } },
        mainEntityOfPage: canonicalUrl.value,
    });
});

const websiteJsonLd = computed(() => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CubSign',
    url: appUrl.value,
    description: 'Free online PDF signing platform',
    potentialAction: {
        '@type': 'SearchAction',
        target: `${appUrl.value}/faq?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
}));
</script>

<template>
    <Head :title="title">
        <meta head-key="description" name="description" :content="description" />
        <link head-key="canonical" rel="canonical" :href="canonicalUrl" />

        <meta head-key="og:type" property="og:type" :content="type === 'article' ? 'article' : 'website'" />
        <meta head-key="og:site_name" property="og:site_name" content="CubSign" />
        <meta head-key="og:title" property="og:title" :content="title" />
        <meta head-key="og:description" property="og:description" :content="description" />
        <meta head-key="og:url" property="og:url" :content="canonicalUrl" />
        <meta head-key="og:image" property="og:image" :content="ogImage" />
        <meta v-if="article" head-key="article:published_time" property="article:published_time" :content="article.publishedAt" />
        <meta v-if="article" head-key="article:author" property="article:author" :content="article.author.name" />

        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta head-key="twitter:site" name="twitter:site" content="@cubsign" />
        <meta head-key="twitter:title" name="twitter:title" :content="title" />
        <meta head-key="twitter:description" name="twitter:description" :content="description" />
        <meta head-key="twitter:image" name="twitter:image" :content="ogImage" />

        <script head-key="org-schema" type="application/ld+json" v-html="orgJsonLd" />
        <script v-if="path === '/'" head-key="website-schema" type="application/ld+json" v-html="websiteJsonLd" />
        <script v-if="faqJsonLd" head-key="faq-schema" type="application/ld+json" v-html="faqJsonLd" />
        <script v-if="articleJsonLd" head-key="article-schema" type="application/ld+json" v-html="articleJsonLd" />
    </Head>
</template>
