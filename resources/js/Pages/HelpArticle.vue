<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import BlogContent from '@/Components/Marketing/BlogContent.vue';
import MetaItems from '@/Components/Marketing/MetaItems.vue';
import {
    getArticleBySlug,
    getRelatedArticles,
    formatHelpDate,
} from '@/constants/help';
import { normalizeBlogBlocks } from '@/utils/marketingContent';
import {
    SUPPORT_EMAIL,
    CTA_START_SIGNING,
    btnPrimary,
    btnSecondary,
} from '@/constants/marketing';

const props = defineProps({
    slug: { type: String, required: true },
});

const article = computed(() => getArticleBySlug(props.slug));
const relatedArticles = computed(() => getRelatedArticles(props.slug));
const activeHeading = ref('');

const contentBlocks = computed(() => normalizeBlogBlocks(article.value?.content ?? []));

const headings = computed(() =>
    contentBlocks.value
        .filter((block) => block.type === 'h2')
        .map((block, index) => ({ id: `heading-${index}`, title: block.text })),
);

const articleMeta = computed(() => {
    if (!article.value) return [];
    return [
        { text: `Updated ${formatHelpDate(article.value.updatedAt)}`, class: 'text-gray-500' },
        `${article.value.readingTime} min read`,
    ];
});

const seoArticle = computed(() => {
    if (!article.value) return null;
    return {
        title: article.value.title,
        excerpt: article.value.excerpt,
        publishedAt: article.value.updatedAt,
        author: { name: 'CubSign Support' },
    };
});

function scrollToHeading(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let observer;
onMounted(() => {
    if (!article.value) {
        router.visit(route('help-center'));
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) activeHeading.value = entry.target.id;
            }
        },
        { rootMargin: '-100px 0px -60% 0px' },
    );

    headings.value.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.observe(el);
    });
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
    <template v-if="article">
        <MarketingSeo
            :title="`${article.title} — CubSign Help Center`"
            :description="article.excerpt"
            :path="`/help-center/${article.slug}`"
            type="article"
            :article="seoArticle"
        />

        <PublicLayout>
            <section class="border-b border-gray-100 bg-gradient-to-b from-white to-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-4xl">
                    <nav aria-label="Breadcrumb" class="text-sm text-gray-500">
                        <ol class="flex flex-wrap items-center gap-2">
                            <li>
                                <Link :href="route('help-center')" class="font-medium text-blue-600 hover:text-blue-700">
                                    Help Center
                                </Link>
                            </li>
                            <li aria-hidden="true" class="text-gray-300">/</li>
                            <li>
                                <Link
                                    :href="`${route('help-center')}#${article.categorySlug}`"
                                    class="hover:text-gray-800"
                                >
                                    {{ article.category }}
                                </Link>
                            </li>
                            <li aria-hidden="true" class="text-gray-300">/</li>
                            <li class="font-medium text-gray-700" aria-current="page">
                                {{ article.title }}
                            </li>
                        </ol>
                    </nav>

                    <p class="mt-6 text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {{ article.category }}
                    </p>
                    <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {{ article.title }}
                    </h1>
                    <p class="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
                        {{ article.excerpt }}
                    </p>
                    <MetaItems class="mt-5 text-sm text-gray-500" :items="articleMeta" />
                </div>
            </section>

            <section class="marketing-section bg-white">
                <div class="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
                    <aside class="hidden lg:block">
                        <div class="sticky top-24 space-y-6">
                            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 class="text-sm font-semibold text-gray-900">Table of Contents</h2>
                                <ul class="mt-4 space-y-2">
                                    <li v-for="heading in headings" :key="heading.id">
                                        <a
                                            :href="`#${heading.id}`"
                                            :class="[
                                                'block text-sm transition-colors',
                                                activeHeading === heading.id
                                                    ? 'font-medium text-blue-600'
                                                    : 'text-gray-500 hover:text-gray-900',
                                            ]"
                                            @click.prevent="scrollToHeading(heading.id)"
                                        >
                                            {{ heading.title }}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <Link
                                :href="route('help-center')"
                                class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                ← Back to Help Center
                            </Link>
                        </div>
                    </aside>

                    <article class="lg:col-span-2">
                        <div class="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 lg:hidden">
                            <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">On this page</p>
                            <ul class="mt-3 space-y-2">
                                <li v-for="heading in headings" :key="`mobile-${heading.id}`">
                                    <a
                                        :href="`#${heading.id}`"
                                        class="text-sm text-gray-600 hover:text-blue-600"
                                        @click.prevent="scrollToHeading(heading.id)"
                                    >
                                        {{ heading.title }}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <BlogContent :blocks="article.content" />

                        <div class="mt-8 flex flex-wrap gap-2">
                            <span
                                v-for="tag in article.tags"
                                :key="tag"
                                class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <div class="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                            <p class="text-sm font-semibold text-gray-900">Was this helpful?</p>
                            <p class="mt-2 text-sm text-gray-500">
                                If you still need assistance, email
                                <a :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium text-blue-600 hover:underline">{{ SUPPORT_EMAIL }}</a>
                                or visit the contact page.
                            </p>
                            <div class="mt-4 flex flex-wrap gap-3">
                                <Link :href="route('contact')" :class="[btnSecondary, '!px-4 !py-2.5 text-xs']">
                                    Contact Support
                                </Link>
                                <Link :href="route('help-center')" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                    ← Back to Help Center
                                </Link>
                            </div>
                        </div>
                    </article>

                    <aside class="lg:col-span-1">
                        <div class="sticky top-24 space-y-6">
                            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 class="font-semibold text-gray-900">Related Articles</h2>
                                <ul class="mt-4 space-y-4">
                                    <li v-for="related in relatedArticles" :key="related.slug">
                                        <Link :href="route('help-center.show', related.slug)" class="group block">
                                            <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                                {{ related.title }}
                                            </p>
                                            <p class="mt-0.5 text-xs text-gray-400">
                                                {{ related.readingTime }} min read · {{ related.category }}
                                            </p>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div class="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                                <p class="text-sm font-semibold text-gray-900">Ready to sign?</p>
                                <p class="mt-2 text-sm text-gray-600">Upload a PDF and finish in under a minute.</p>
                                <Link :href="route('sign.index')" :class="[btnPrimary, 'mt-4 w-full !px-4 !py-3 text-xs']">
                                    {{ CTA_START_SIGNING }}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    </template>
</template>
