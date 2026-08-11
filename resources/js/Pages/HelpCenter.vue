<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import HelpCategoryNav from '@/Components/Help/HelpCategoryNav.vue';
import HelpArticleMeta from '@/Components/Help/HelpArticleMeta.vue';
import {
    helpArticles,
    helpCategories,
    helpFaqs,
    popularSearches,
    searchHelpArticles,
    getArticlesByCategory,
    getRecentlyUpdatedArticles,
    getPopularArticles,
} from '@/constants/help';
import {
    SUPPORT_EMAIL,
    CTA_START_SIGNING,
    btnPrimary,
    btnSecondary,
} from '@/constants/marketing';

const page = usePage();
const searchQuery = ref('');
const openFaq = ref(null);
const activeCategorySlug = ref(helpCategories[0]?.slug ?? '');
const mobileNavOpen = ref(false);

onMounted(() => {
    const params = page.url.includes('?')
        ? new URLSearchParams(page.url.split('?')[1])
        : null;
    const q = params?.get('q');
    if (q) searchQuery.value = q;

    if (window.location.hash) {
        const slug = window.location.hash.slice(1);
        if (helpCategories.some((c) => c.slug === slug)) {
            activeCategorySlug.value = slug;
            requestAnimationFrame(() => {
                document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    setupCategoryObserver();
});

watch(searchQuery, (value) => {
    const url = new URL(window.location.href);
    if (value.trim()) {
        url.searchParams.set('q', value.trim());
    } else {
        url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.pathname + url.search);
});

const filteredArticles = computed(() => searchHelpArticles(searchQuery.value));

const categorySections = computed(() =>
    helpCategories.map((category) => ({
        ...category,
        articles: getArticlesByCategory(category.slug),
    })),
);

const popularArticles = computed(() => getPopularArticles(6));
const recentlyUpdated = computed(() => getRecentlyUpdatedArticles(5));
const faqSchema = computed(() =>
    helpFaqs.map((item) => ({
        question: item.question,
        answer: item.moreHelpLabel ? `${item.answer} ${item.moreHelpLabel}.` : item.answer,
    })),
);

function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}

function applySearch(term) {
    searchQuery.value = term;
    mobileNavOpen.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearSearch() {
    searchQuery.value = '';
}

let categoryObserver;
function setupCategoryObserver() {
    categoryObserver?.disconnect();
    if (searchQuery.value.trim()) return;

    categoryObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible[0]?.target?.id) {
                activeCategorySlug.value = visible[0].target.id;
            }
        },
        { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );

    helpCategories.forEach((category) => {
        const el = document.getElementById(category.slug);
        if (el) categoryObserver.observe(el);
    });
}

watch(searchQuery, () => {
    if (!searchQuery.value.trim()) {
        requestAnimationFrame(() => setupCategoryObserver());
    } else {
        categoryObserver?.disconnect();
    }
});

onUnmounted(() => categoryObserver?.disconnect());
</script>

<template>
    <MarketingSeo
        title="Help Center — CubSign | PDF Signing Guides & Support"
        description="Search CubSign Help Center articles on uploading PDFs, signing documents, accounts, security, and troubleshooting. Free PDF signing support and FAQs."
        path="/help-center"
        :faq-schema="faqSchema"
    />

    <PublicLayout>
        <section class="border-b border-gray-100 bg-gradient-to-b from-white to-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    Knowledge Base
                </span>
                <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                    Help Center
                </h1>
                <p class="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
                    Guides and answers for uploading PDFs, signing documents, managing your account, and staying secure.
                </p>

                <div class="relative mx-auto mt-7 max-w-xl">
                    <label for="help-search" class="sr-only">Search the Help Center</label>
                    <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        id="help-search"
                        v-model="searchQuery"
                        type="search"
                        placeholder="Search articles, topics, or keywords..."
                        class="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-10 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        autocomplete="off"
                    />
                    <button
                        v-if="searchQuery"
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Clear search"
                        @click="clearSearch"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div class="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
                    <span class="text-xs font-medium text-gray-400">Popular:</span>
                    <button
                        v-for="term in popularSearches"
                        :key="term"
                        type="button"
                        class="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        @click="applySearch(term)"
                    >
                        {{ term }}
                    </button>
                </div>

                <p class="mt-4 text-sm text-gray-500">
                    {{ helpArticles.length }} articles across {{ helpCategories.length }} categories
                </p>
            </div>
        </section>

        <section v-if="searchQuery.trim()" class="bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="text-xl font-bold text-gray-900">
                        Search results
                        <span class="font-medium text-gray-500">({{ filteredArticles.length }})</span>
                    </h2>
                    <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700" @click="clearSearch">
                        Clear
                    </button>
                </div>
                <p v-if="filteredArticles.length === 0" class="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                    No articles matched “{{ searchQuery.trim() }}”. Try another keyword or
                    <a :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium text-blue-600 hover:underline">contact support</a>.
                </p>
                <ul v-else class="mt-6 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <li v-for="article in filteredArticles" :key="article.slug">
                        <Link
                            :href="route('help-center.show', article.slug)"
                            class="block px-5 py-4 transition-colors hover:bg-gray-50 sm:px-6 sm:py-5"
                        >
                            <p class="text-xs font-medium uppercase tracking-wide text-blue-600">{{ article.category }}</p>
                            <h3 class="mt-1 text-base font-semibold text-gray-900">{{ article.title }}</h3>
                            <p class="mt-1 text-sm leading-relaxed text-gray-500">{{ article.excerpt }}</p>
                            <HelpArticleMeta class="mt-2" :updated-at="article.updatedAt" :reading-time="article.readingTime" compact />
                        </Link>
                    </li>
                </ul>
            </div>
        </section>

        <template v-else>
            <section class="border-b border-gray-100 bg-white lg:hidden">
                <div class="px-4 py-3 sm:px-6">
                    <button
                        type="button"
                        class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                        :aria-expanded="mobileNavOpen"
                        @click="mobileNavOpen = !mobileNavOpen"
                    >
                        <span>Browse categories</span>
                        <svg :class="['h-4 w-4 text-gray-400 transition-transform', mobileNavOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div v-show="mobileNavOpen" class="mt-3 rounded-2xl border border-gray-200 bg-white p-3">
                        <HelpCategoryNav :active-category-slug="activeCategorySlug" mode="anchor" />
                    </div>
                </div>
            </section>

            <section class="bg-white">
                <div class="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_240px]">
                    <aside class="hidden border-r border-gray-100 lg:block">
                        <div class="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8 xl:px-6">
                            <HelpCategoryNav :active-category-slug="activeCategorySlug" mode="anchor" />
                        </div>
                    </aside>

                    <div class="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                        <div class="mb-10">
                            <h2 class="text-2xl font-bold tracking-tight text-gray-900">Browse by category</h2>
                            <p class="mt-2 text-sm text-gray-600 sm:text-base">Pick a topic to explore step-by-step guides written for real CubSign workflows.</p>
                        </div>

                        <div class="space-y-14">
                            <section
                                v-for="category in categorySections"
                                :id="category.slug"
                                :key="category.slug"
                                class="scroll-mt-24"
                            >
                                <div class="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900">{{ category.name }}</h3>
                                        <p class="mt-1 text-sm text-gray-500">{{ category.description }}</p>
                                    </div>
                                    <span class="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                        {{ category.articles.length }}
                                    </span>
                                </div>
                                <ul class="mt-4 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200">
                                    <li v-for="article in category.articles" :key="article.slug">
                                        <Link
                                            :href="route('help-center.show', article.slug)"
                                            class="group flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                                        >
                                            <div class="min-w-0">
                                                <p class="font-medium text-gray-900 group-hover:text-blue-600">{{ article.title }}</p>
                                                <p class="mt-0.5 line-clamp-1 text-sm text-gray-500">{{ article.excerpt }}</p>
                                            </div>
                                            <HelpArticleMeta class="shrink-0" :updated-at="article.updatedAt" :reading-time="article.readingTime" compact />
                                        </Link>
                                    </li>
                                </ul>
                            </section>
                        </div>

                        <div class="mt-16">
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Popular articles</h2>
                                    <p class="mt-1 text-sm text-gray-600">Start with the guides CubSign users open most often.</p>
                                </div>
                                <Link :href="route('faq')" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                    View FAQ page →
                                </Link>
                            </div>
                            <div class="mt-6 grid gap-3 sm:grid-cols-2">
                                <Link
                                    v-for="article in popularArticles"
                                    :key="article.slug"
                                    :href="route('help-center.show', article.slug)"
                                    class="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
                                >
                                    <p class="text-xs font-medium uppercase tracking-wide text-blue-600">{{ article.category }}</p>
                                    <h3 class="mt-1.5 text-sm font-semibold text-gray-900 group-hover:text-blue-600">{{ article.title }}</h3>
                                    <HelpArticleMeta class="mt-2" :updated-at="article.updatedAt" :reading-time="article.readingTime" compact />
                                </Link>
                            </div>
                        </div>

                        <div class="mt-16">
                            <h2 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Frequently asked questions</h2>
                            <p class="mt-1 text-sm text-gray-600">Short answers to the questions we hear most during Early Access.</p>
                            <div class="mt-6 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                                <div v-for="(item, index) in helpFaqs" :key="item.question">
                                    <button
                                        type="button"
                                        class="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white sm:px-6 sm:py-5"
                                        :aria-expanded="openFaq === index"
                                        @click="toggleFaq(index)"
                                    >
                                        <span class="pr-4 text-sm font-semibold text-gray-900">{{ item.question }}</span>
                                        <svg
                                            :class="['h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', openFaq === index ? 'rotate-180' : '']"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div v-show="openFaq === index" class="px-5 pb-5 text-sm leading-relaxed text-gray-500 sm:px-6">
                                        {{ item.answer }}
                                        <Link
                                            v-if="item.moreHelpSlug"
                                            :href="route('help-center.show', item.moreHelpSlug)"
                                            class="mt-2 block font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            {{ item.moreHelpLabel }}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside class="hidden border-l border-gray-100 xl:block">
                        <div class="sticky top-20 max-h-[calc(100vh-5rem)] space-y-8 overflow-y-auto px-5 py-8">
                            <div>
                                <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Recently updated</p>
                                <ul class="mt-3 space-y-3">
                                    <li v-for="article in recentlyUpdated" :key="article.slug">
                                        <Link :href="route('help-center.show', article.slug)" class="group block">
                                            <p class="text-sm font-medium text-gray-800 group-hover:text-blue-600">{{ article.title }}</p>
                                            <HelpArticleMeta class="mt-1" :updated-at="article.updatedAt" :reading-time="article.readingTime" compact />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                <p class="text-sm font-semibold text-gray-900">Need a hand?</p>
                                <p class="mt-1 text-xs leading-relaxed text-gray-600">Reach support anytime during Early Access.</p>
                                <Link :href="route('contact')" class="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700">
                                    Contact Support →
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section class="border-t border-gray-100 bg-gray-50 px-4 py-10 xl:hidden sm:px-6">
                <div class="mx-auto max-w-3xl">
                    <h2 class="text-lg font-bold text-gray-900">Recently updated</h2>
                    <ul class="mt-4 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <li v-for="article in recentlyUpdated" :key="`mobile-recent-${article.slug}`">
                            <Link :href="route('help-center.show', article.slug)" class="block px-4 py-3.5 hover:bg-gray-50">
                                <p class="text-sm font-medium text-gray-900">{{ article.title }}</p>
                                <HelpArticleMeta class="mt-1" :updated-at="article.updatedAt" :reading-time="article.readingTime" compact />
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>
        </template>

        <section class="border-t border-gray-100 bg-gray-50 px-4 py-14 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-xl">
                <h2 class="text-2xl font-bold text-gray-900">Still need help?</h2>
                <p class="mt-3 text-gray-500">
                    Our team can help with uploads, accounts, and signing workflows.
                    Email <a :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium text-blue-600 hover:underline">{{ SUPPORT_EMAIL }}</a>
                    or send a message from the contact page.
                </p>
                <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link :href="route('sign.index')" :class="[btnPrimary, 'w-full sm:w-auto']">
                        {{ CTA_START_SIGNING }}
                    </Link>
                    <Link :href="route('contact')" :class="[btnSecondary, 'w-full sm:w-auto']">
                        Contact Support
                    </Link>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
