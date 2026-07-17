<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import HelpCategoryNav from '@/Components/Help/HelpCategoryNav.vue';
import HelpToc from '@/Components/Help/HelpToc.vue';
import HelpContent from '@/Components/Help/HelpContent.vue';
import HelpArticleMeta from '@/Components/Help/HelpArticleMeta.vue';
import HelpCopyLink from '@/Components/Help/HelpCopyLink.vue';
import HelpFeedback from '@/Components/Help/HelpFeedback.vue';
import BlogFaq from '@/Components/Blog/BlogFaq.vue';
import {
    getArticleBySlug,
    getRelatedArticles,
    getAdjacentArticles,
    getArticlesByCategory,
} from '@/constants/help';
import { normalizeBlogBlocks } from '@/utils/marketingContent';
import {
    CTA_START_SIGNING,
    btnPrimary,
} from '@/constants/marketing';

const props = defineProps({
    slug: { type: String, required: true },
});

const article = computed(() => getArticleBySlug(props.slug));
const relatedArticles = computed(() => getRelatedArticles(props.slug));
const adjacent = computed(() => getAdjacentArticles(props.slug));
const categoryArticles = computed(() =>
    article.value ? getArticlesByCategory(article.value.categorySlug) : [],
);
const activeHeading = ref('');
const mobileTocOpen = ref(false);
const mobileNavOpen = ref(false);

const contentBlocks = computed(() => normalizeBlogBlocks(article.value?.content ?? []));

const headings = computed(() =>
    contentBlocks.value
        .filter((block) => block.type === 'h2')
        .map((block, index) => ({ id: `heading-${index}`, title: block.text })),
);

const seoTitle = computed(() => article.value?.metaTitle ?? `${article.value?.title} — CubSign Help Center`);
const seoDescription = computed(() => article.value?.metaDescription ?? article.value?.excerpt ?? '');

const breadcrumbSchema = computed(() => {
    if (!article.value) return [];
    return [
        { name: 'Home', url: '/' },
        { name: 'Help Center', url: '/help-center' },
        { name: article.value.category, url: `/help-center#category-${article.value.categorySlug}` },
        { name: article.value.title, url: `/help-center/${article.value.slug}` },
    ];
});

const seoArticle = computed(() => {
    if (!article.value) return null;
    return {
        title: article.value.title,
        excerpt: article.value.excerpt,
        publishedAt: article.value.updatedAt,
        updatedAt: article.value.updatedAt,
        keywords: article.value.keywords,
        author: { name: 'CubSign Support' },
    };
});

function scrollToHeading(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    mobileTocOpen.value = false;
}

let observer;
function setupHeadingObserver() {
    observer?.disconnect();
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
}

onMounted(async () => {
    if (!article.value) {
        router.visit(route('help-center'));
        return;
    }
    await nextTick();
    setupHeadingObserver();
});

watch(() => props.slug, async () => {
    activeHeading.value = '';
    mobileTocOpen.value = false;
    mobileNavOpen.value = false;
    await nextTick();
    setupHeadingObserver();
    window.scrollTo({ top: 0 });
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
    <template v-if="article">
        <MarketingSeo
            :title="seoTitle"
            :description="seoDescription"
            :path="`/help-center/${article.slug}`"
            type="article"
            :article="seoArticle"
            :faq-schema="article.faq ?? []"
            :breadcrumb-schema="breadcrumbSchema"
        />

        <PublicLayout>
            <div class="border-b border-gray-100 bg-white lg:hidden">
                <div class="flex gap-2 px-4 py-3 sm:px-6">
                    <button
                        type="button"
                        class="flex flex-1 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-700"
                        :aria-expanded="mobileNavOpen"
                        @click="mobileNavOpen = !mobileNavOpen; mobileTocOpen = false"
                    >
                        <span class="truncate">{{ article.category }}</span>
                        <svg :class="['h-4 w-4 shrink-0 text-gray-400 transition-transform', mobileNavOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <button
                        v-if="headings.length"
                        type="button"
                        class="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-700"
                        :aria-expanded="mobileTocOpen"
                        @click="mobileTocOpen = !mobileTocOpen; mobileNavOpen = false"
                    >
                        Contents
                        <svg :class="['h-4 w-4 text-gray-400 transition-transform', mobileTocOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>
                <div v-show="mobileNavOpen" class="border-t border-gray-100 px-4 py-3 sm:px-6">
                    <HelpCategoryNav
                        mode="browse"
                        :active-category-slug="article.categorySlug"
                        :active-article-slug="article.slug"
                    />
                </div>
                <div v-show="mobileTocOpen" class="border-t border-gray-100 px-4 py-3 sm:px-6">
                    <HelpToc :headings="headings" :active-heading="activeHeading" @navigate="scrollToHeading" />
                </div>
            </div>

            <div class="bg-white">
                <div class="mx-auto grid max-w-7xl lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px]">
                    <aside class="hidden border-r border-gray-100 lg:block">
                        <div class="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8">
                            <Link
                                :href="route('help-center')"
                                class="mb-5 inline-flex items-center gap-1.5 px-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                ← Help Center
                            </Link>
                            <HelpCategoryNav
                                mode="browse"
                                :active-category-slug="article.categorySlug"
                                :active-article-slug="article.slug"
                            />
                        </div>
                    </aside>

                    <div class="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                        <nav aria-label="Breadcrumb" class="text-sm text-gray-500">
                            <ol class="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                                <li aria-hidden="true" class="hidden text-gray-300 sm:inline">/</li>
                                <li class="hidden font-medium text-gray-700 sm:inline" aria-current="page">
                                    {{ article.title }}
                                </li>
                            </ol>
                        </nav>

                        <header class="mt-6 border-b border-gray-100 pb-6">
                            <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                {{ article.category }}
                            </p>
                            <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                                {{ article.title }}
                            </h1>
                            <p class="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                                {{ article.excerpt }}
                            </p>
                            <div class="mt-5 flex flex-wrap items-center gap-3">
                                <HelpArticleMeta
                                    :updated-at="article.updatedAt"
                                    :last-reviewed="article.lastReviewed || article.updatedAt"
                                    :reading-time="article.readingTime"
                                />
                                <HelpCopyLink />
                            </div>
                        </header>

                        <article class="pt-2">
                            <HelpContent :blocks="article.content" :current-slug="article.slug" />

                            <div v-if="article.tags?.length" class="mt-8 flex flex-wrap gap-2">
                                <span
                                    v-for="tag in article.tags"
                                    :key="tag"
                                    class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                                >
                                    {{ tag }}
                                </span>
                            </div>

                            <BlogFaq :items="article.faq ?? []" />

                            <div class="mt-10">
                                <HelpFeedback :article-slug="article.slug" />
                            </div>

                            <nav aria-label="Article pagination" class="mt-10 grid gap-3 sm:grid-cols-2">
                                <Link
                                    v-if="adjacent.previous"
                                    :href="route('help-center.show', adjacent.previous.slug)"
                                    class="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
                                >
                                    <p class="text-xs font-medium text-gray-400">Previous</p>
                                    <p class="mt-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                                        ← {{ adjacent.previous.title }}
                                    </p>
                                </Link>
                                <div v-else class="hidden sm:block" />
                                <Link
                                    v-if="adjacent.next"
                                    :href="route('help-center.show', adjacent.next.slug)"
                                    class="group rounded-2xl border border-gray-200 bg-white p-4 text-right transition-all hover:border-blue-200 hover:shadow-sm sm:col-start-2"
                                >
                                    <p class="text-xs font-medium text-gray-400">Next</p>
                                    <p class="mt-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                                        {{ adjacent.next.title }} →
                                    </p>
                                </Link>
                            </nav>

                            <div class="mt-10 rounded-2xl border border-gray-200 p-5">
                                <div class="flex items-center justify-between gap-3">
                                    <h2 class="text-sm font-semibold text-gray-900">Related articles</h2>
                                    <Link
                                        :href="route('help-center')"
                                        class="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Back to Help Center
                                    </Link>
                                </div>
                                <ul class="mt-4 grid gap-3 sm:grid-cols-2">
                                    <li v-for="related in relatedArticles" :key="related.slug">
                                        <Link
                                            :href="route('help-center.show', related.slug)"
                                            class="group block rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:border-blue-100 hover:bg-blue-50/40"
                                        >
                                            <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                                {{ related.title }}
                                            </p>
                                            <HelpArticleMeta
                                                class="mt-1"
                                                :updated-at="related.updatedAt"
                                                :reading-time="related.readingTime"
                                                compact
                                            />
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div v-if="categoryArticles.length > 1" class="mt-8">
                                <h2 class="text-sm font-semibold text-gray-900">More in {{ article.category }}</h2>
                                <ul class="mt-3 space-y-1">
                                    <li v-for="item in categoryArticles" :key="`cat-${item.slug}`">
                                        <Link
                                            v-if="item.slug !== article.slug"
                                            :href="route('help-center.show', item.slug)"
                                            class="block rounded-lg px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                        >
                                            {{ item.title }}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </article>
                    </div>

                    <aside class="hidden border-l border-gray-100 xl:block">
                        <div class="sticky top-20 max-h-[calc(100vh-5rem)] space-y-8 overflow-y-auto px-5 py-8">
                            <HelpToc
                                :headings="headings"
                                :active-heading="activeHeading"
                                @navigate="scrollToHeading"
                            />
                            <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                <p class="text-sm font-semibold text-gray-900">Ready to sign?</p>
                                <p class="mt-1 text-xs leading-relaxed text-gray-600">Upload a PDF and finish in under a minute.</p>
                                <Link :href="route('sign.index')" :class="[btnPrimary, 'mt-3 w-full !px-3 !py-2.5 text-xs']">
                                    {{ CTA_START_SIGNING }}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    </template>
</template>
