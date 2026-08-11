<script setup>
import { computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import {
    BLOG_OG_HEIGHT,
    BLOG_OG_WIDTH,
    DEFAULT_OG_HEIGHT,
    DEFAULT_OG_IMAGE,
    DEFAULT_OG_WIDTH,
} from '@/constants/og';

const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    path: { type: String, default: '/' },
    faqSchema: { type: Array, default: () => [] },
    breadcrumbSchema: { type: Array, default: () => [] },
    type: { type: String, default: 'website' },
    article: { type: Object, default: null },
    searchTarget: { type: String, default: '' },
    aboutOrganization: { type: Boolean, default: false },
});

const page = usePage();
const appUrl = computed(() => page.props.app?.url ?? '');

/** Prefer the shared PHP SeoMeta payload when present (same source as Blade initial HTML). */
const serverSeo = computed(() => {
    const seo = page.props.seo;
    if (!seo?.title || !seo?.description || !seo?.canonical) {
        return null;
    }
    return seo;
});

const serverSchemas = computed(() => serverSeo.value?.schemas ?? null);

const resolvedTitle = computed(() => serverSeo.value?.title ?? props.title);
const resolvedDescription = computed(() => serverSeo.value?.description ?? props.description);
const resolvedPath = computed(() => serverSeo.value?.path ?? props.path);
const canonicalUrl = computed(() => serverSeo.value?.canonical ?? `${appUrl.value}${resolvedPath.value}`);
const ogType = computed(() => {
    if (serverSeo.value?.og?.type) {
        return serverSeo.value.og.type;
    }
    return props.type === 'article' ? 'article' : 'website';
});
const ogImage = computed(() => {
    if (serverSeo.value?.og?.image) {
        return serverSeo.value.og.image;
    }
    const img = props.article?.coverImage;
    if (img) {
        return img.startsWith('http') ? img : `${appUrl.value}${img}`;
    }
    return `${appUrl.value}${DEFAULT_OG_IMAGE}`;
});

const ogImageWidth = computed(() => {
    if (serverSeo.value?.og?.image_width) {
        return serverSeo.value.og.image_width;
    }
    return props.article?.coverImage ? BLOG_OG_WIDTH : DEFAULT_OG_WIDTH;
});
const ogImageHeight = computed(() => {
    if (serverSeo.value?.og?.image_height) {
        return serverSeo.value.og.image_height;
    }
    return props.article?.coverImage ? BLOG_OG_HEIGHT : DEFAULT_OG_HEIGHT;
});

function stringifySchema(schema) {
    return schema ? JSON.stringify(schema) : null;
}

const faqJsonLd = computed(() => {
    if (serverSchemas.value?.faq) {
        return stringifySchema(serverSchemas.value.faq);
    }
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

const breadcrumbJsonLd = computed(() => {
    if (serverSchemas.value?.breadcrumb) {
        return stringifySchema(serverSchemas.value.breadcrumb);
    }
    const crumbs = props.breadcrumbSchema.filter((item) => item.name && item.url);
    if (!crumbs.length) return null;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${appUrl.value}${item.url}`,
        })),
    });
});

const orgJsonLd = computed(() => {
    if (serverSchemas.value) {
        return stringifySchema(serverSchemas.value.organization ?? null);
    }
    if (resolvedPath.value !== '/' && resolvedPath.value !== '/about') {
        return null;
    }
    const base = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CubSign',
        url: appUrl.value,
        logo: `${appUrl.value}/logo.svg`,
    };
    if (props.aboutOrganization || resolvedPath.value === '/about') {
        return JSON.stringify({
            ...base,
            description: 'CubSign is a browser-based PDF signing platform built to simplify secure electronic signatures for individuals and small teams.',
            email: 'support@cubsign.com',
            parentOrganization: {
                '@type': 'Organization',
                name: 'Cubiz Infotech',
            },
        });
    }
    return JSON.stringify(base);
});

const articleJsonLd = computed(() => {
    if (serverSchemas.value) {
        return stringifySchema(serverSchemas.value.article ?? null);
    }
    if (!props.article) return null;
    const payload = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.article.title,
        description: props.article.excerpt,
        author: { '@type': 'Person', name: props.article.author.name },
        publisher: { '@type': 'Organization', name: 'CubSign', logo: { '@type': 'ImageObject', url: `${appUrl.value}/logo.svg` } },
        mainEntityOfPage: canonicalUrl.value,
    };
    if (props.article.publishedAt) {
        payload.datePublished = props.article.publishedAt;
    }
    if (props.article.updatedAt) {
        payload.dateModified = props.article.updatedAt;
    }
    if (props.article.coverImage) {
        payload.image = [ogImage.value];
    }
    if (props.article.keywords?.length) {
        payload.keywords = props.article.keywords.join(', ');
    }
    return JSON.stringify(payload);
});

const websiteJsonLd = computed(() => {
    if (serverSchemas.value) {
        return stringifySchema(serverSchemas.value.website ?? null);
    }
    if (resolvedPath.value !== '/') return null;
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CubSign',
        url: appUrl.value,
        description: 'Free online PDF signing platform',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${appUrl.value}${props.searchTarget || '/help-center?q={search_term_string}'}`,
            'query-input': 'required name=search_term_string',
        },
    });
});
</script>

<template>
    <Head :title="resolvedTitle">
        <meta head-key="description" name="description" :content="resolvedDescription" />
        <link head-key="canonical" rel="canonical" :href="canonicalUrl" />

        <meta head-key="og:type" property="og:type" :content="ogType" />
        <meta head-key="og:site_name" property="og:site_name" content="CubSign" />
        <meta head-key="og:title" property="og:title" :content="resolvedTitle" />
        <meta head-key="og:description" property="og:description" :content="resolvedDescription" />
        <meta head-key="og:url" property="og:url" :content="canonicalUrl" />
        <meta head-key="og:image" property="og:image" :content="ogImage" />
        <meta v-if="ogImageWidth" head-key="og:image:width" property="og:image:width" :content="String(ogImageWidth)" />
        <meta v-if="ogImageHeight" head-key="og:image:height" property="og:image:height" :content="String(ogImageHeight)" />
        <meta v-if="article?.publishedAt || serverSeo?.og?.article_published_time" head-key="article:published_time" property="article:published_time" :content="article?.publishedAt ?? serverSeo?.og?.article_published_time" />
        <meta v-if="article?.updatedAt || serverSeo?.og?.article_modified_time" head-key="article:modified_time" property="article:modified_time" :content="article?.updatedAt ?? serverSeo?.og?.article_modified_time" />
        <meta v-if="article?.author?.name || serverSeo?.og?.article_author" head-key="article:author" property="article:author" :content="article?.author?.name ?? serverSeo?.og?.article_author" />

        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta head-key="twitter:title" name="twitter:title" :content="resolvedTitle" />
        <meta head-key="twitter:description" name="twitter:description" :content="resolvedDescription" />
        <meta head-key="twitter:image" name="twitter:image" :content="ogImage" />

        <!-- Use <component :is="'script'"> so Vue does not treat JSON-LD as a side-effect <script> in the template -->
        <component v-if="orgJsonLd" :is="'script'" head-key="org-schema" type="application/ld+json" v-html="orgJsonLd" />
        <component v-if="websiteJsonLd" :is="'script'" head-key="website-schema" type="application/ld+json" v-html="websiteJsonLd" />
        <component v-if="faqJsonLd" :is="'script'" head-key="faq-schema" type="application/ld+json" v-html="faqJsonLd" />
        <component v-if="breadcrumbJsonLd" :is="'script'" head-key="breadcrumb-schema" type="application/ld+json" v-html="breadcrumbJsonLd" />
        <component v-if="articleJsonLd" :is="'script'" head-key="article-schema" type="application/ld+json" v-html="articleJsonLd" />
    </Head>
</template>
