<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import {
    helpArticles,
    helpCategories,
    helpFaqs,
    searchHelpArticles,
    getArticlesByCategory,
    formatHelpDate,
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

onMounted(() => {
    const q = page.url.includes('?')
        ? new URLSearchParams(page.url.split('?')[1]).get('q')
        : null;
    if (q) searchQuery.value = q;
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

const categoryCards = computed(() =>
    helpCategories.map((category) => ({
        ...category,
        count: getArticlesByCategory(category.slug).length,
        articles: getArticlesByCategory(category.slug).slice(0, 4),
    })),
);

const popularArticles = computed(() =>
    [...helpArticles]
        .sort((a, b) => b.readingTime - a.readingTime)
        .slice(0, 6),
);

const faqSchema = computed(() => helpFaqs);

function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}

const categoryIconPaths = {
    rocket: 'M13 10V3L4 14h7v7l9-11h-7z',
    upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    pen: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    wrench: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
};
</script>

<template>
    <MarketingSeo
        title="Help Center — CubSign | PDF Signing Guides & Support"
        description="Search CubSign Help Center articles on uploading PDFs, signing documents, accounts, security, and troubleshooting. Free PDF signing support and FAQs."
        path="/help-center"
        :faq-schema="faqSchema"
    />

    <PublicLayout>
        <section class="marketing-gradient-hero px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    Knowledge Base
                </span>
                <h1 class="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Help Center
                </h1>
                <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                    Guides and answers for uploading PDFs, signing documents, managing your account, and staying secure.
                </p>
                <div class="relative mx-auto mt-8 max-w-xl">
                    <label for="help-search" class="sr-only">Search the Help Center</label>
                    <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        id="help-search"
                        v-model="searchQuery"
                        type="search"
                        placeholder="Search articles, topics, or keywords..."
                        class="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        autocomplete="off"
                    />
                </div>
                <p class="mt-3 text-sm text-gray-500">
                    {{ helpArticles.length }} articles across {{ helpCategories.length }} categories
                </p>
            </div>
        </section>

        <section v-if="searchQuery.trim()" class="marketing-section-tight bg-white">
            <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 class="text-xl font-bold text-gray-900">
                    Search results
                    <span class="font-medium text-gray-500">({{ filteredArticles.length }})</span>
                </h2>
                <p v-if="filteredArticles.length === 0" class="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                    No articles matched “{{ searchQuery.trim() }}”. Try another keyword or
                    <a :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium text-blue-600 hover:underline">contact support</a>.
                </p>
                <ul v-else class="mt-6 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <li v-for="article in filteredArticles" :key="article.slug">
                        <Link
                            :href="route('help-center.show', article.slug)"
                            class="block px-6 py-5 transition-colors hover:bg-gray-50"
                        >
                            <p class="text-xs font-medium uppercase tracking-wide text-blue-600">{{ article.category }}</p>
                            <h3 class="mt-1 text-base font-semibold text-gray-900">{{ article.title }}</h3>
                            <p class="mt-1 text-sm leading-relaxed text-gray-500">{{ article.excerpt }}</p>
                            <p class="mt-2 text-xs text-gray-400">{{ article.readingTime }} min read · Updated {{ formatHelpDate(article.updatedAt) }}</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </section>

        <template v-else>
            <section class="marketing-section bg-white">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="max-w-2xl">
                        <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Browse by category</h2>
                        <p class="mt-3 text-gray-600">Pick a topic to explore step-by-step guides written for real CubSign workflows.</p>
                    </div>
                    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div
                            v-for="category in categoryCards"
                            :id="category.slug"
                            :key="category.slug"
                            class="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div :class="['flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white', category.color]">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="categoryIconPaths[category.icon]" />
                                </svg>
                            </div>
                            <h3 class="mt-4 text-lg font-bold text-gray-900">{{ category.name }}</h3>
                            <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ category.description }}</p>
                            <p class="mt-3 text-xs font-medium text-gray-400">{{ category.count }} articles</p>
                            <ul class="mt-4 space-y-2 border-t border-gray-100 pt-4">
                                <li v-for="article in category.articles" :key="article.slug">
                                    <Link
                                        :href="route('help-center.show', article.slug)"
                                        class="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                                    >
                                        {{ article.title }}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section class="marketing-section-alt">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Popular articles</h2>
                            <p class="mt-2 text-gray-600">Start with the guides CubSign users open most often.</p>
                        </div>
                        <Link :href="route('faq')" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
                            View FAQ page →
                        </Link>
                    </div>
                    <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Link
                            v-for="article in popularArticles"
                            :key="article.slug"
                            :href="route('help-center.show', article.slug)"
                            class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                        >
                            <p class="text-xs font-medium uppercase tracking-wide text-blue-600">{{ article.category }}</p>
                            <h3 class="mt-2 text-base font-semibold text-gray-900 group-hover:text-blue-600">{{ article.title }}</h3>
                            <p class="mt-2 line-clamp-2 text-sm text-gray-500">{{ article.excerpt }}</p>
                            <p class="mt-3 text-xs text-gray-400">{{ article.readingTime }} min read</p>
                        </Link>
                    </div>
                </div>
            </section>

            <section class="marketing-section bg-white">
                <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Frequently asked questions</h2>
                        <p class="mt-3 text-gray-600">Short answers to the questions we hear most during Early Access.</p>
                    </div>
                    <div class="mt-10 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                        <div v-for="(item, index) in helpFaqs" :key="item.question">
                            <button
                                type="button"
                                class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white"
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
                            <div v-show="openFaq === index" class="px-6 pb-5 text-sm leading-relaxed text-gray-500">
                                {{ item.answer }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </template>

        <section class="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
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
