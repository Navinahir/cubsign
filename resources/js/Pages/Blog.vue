<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import BlogCover from '@/Components/Marketing/BlogCover.vue';
import BlogArticleMeta from '@/Components/Blog/BlogArticleMeta.vue';
import { formatTimeAgo } from '@/utils/blogDates';

const POSTS_PER_PAGE = 6;

const popularSearches = [
    'sign PDF online',
    'electronic signature',
    'security',
    'mobile signing',
    'request signature',
    'contracts',
];

const props = defineProps({
    posts: { type: Array, default: () => [] },
    categories: { type: Array, default: () => [] },
});

const page = usePage();
const searchQuery = ref('');
const activeCategory = ref('All');
const currentPage = ref(1);

const allPosts = computed(() => (Array.isArray(props.posts) ? props.posts : []));
const categories = computed(() => (Array.isArray(props.categories) ? props.categories : []));
const categoryNames = computed(() => categories.value.map((c) => c.name));

function popularMeta(post) {
    const ago = formatTimeAgo(post?.createdAt || '');
    const read = post?.readingTime ? `${post.readingTime} min read` : '';

    return [ago, read].filter(Boolean).join(' · ');
}

onMounted(() => {
    const params = page.url.includes('?')
        ? new URLSearchParams(page.url.split('?')[1])
        : null;
    const q = params?.get('q');
    const cat = params?.get('category');
    const pg = params?.get('page');
    if (q) searchQuery.value = q;
    if (cat && (cat === 'All' || categoryNames.value.includes(cat))) activeCategory.value = cat;
    if (pg) currentPage.value = Math.max(1, parseInt(pg, 10) || 1);
});

watch([searchQuery, activeCategory], () => {
    currentPage.value = 1;
    const url = new URL(window.location.href);
    if (searchQuery.value.trim()) {
        url.searchParams.set('q', searchQuery.value.trim());
    } else {
        url.searchParams.delete('q');
    }
    if (activeCategory.value !== 'All') {
        url.searchParams.set('category', activeCategory.value);
    } else {
        url.searchParams.delete('category');
    }
    url.searchParams.delete('page');
    window.history.replaceState({}, '', url.pathname + url.search);
});

watch(currentPage, (value) => {
    const url = new URL(window.location.href);
    if (value > 1) {
        url.searchParams.set('page', String(value));
    } else {
        url.searchParams.delete('page');
    }
    window.history.replaceState({}, '', url.pathname + url.search);
});

function postHaystack(post) {
    return [
        post.title,
        post.excerpt,
        post.category,
        ...(post.tags ?? []),
        ...(post.keywords ?? []),
    ].join(' ').toLowerCase();
}

const featuredPost = computed(() => allPosts.value.find((p) => p.featured) ?? allPosts.value[0] ?? null);
const popularPosts = computed(() => {
    const flagged = allPosts.value.filter((p) => p.popular);
    const pool = flagged.length ? flagged : [...allPosts.value];
    return pool.slice(0, 5);
});
const recentPosts = computed(() =>
    [...allPosts.value]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 5),
);
const recentlyUpdated = computed(() =>
    [...allPosts.value]
        .filter((p) => p.updatedAt && p.updatedAt !== p.publishedAt)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
);

const isDefaultView = computed(
    () => !searchQuery.value.trim() && activeCategory.value === 'All',
);

const filteredPosts = computed(() => {
    let posts = [...allPosts.value].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
        posts = posts.filter((p) => postHaystack(p).includes(q));
    }
    if (activeCategory.value && activeCategory.value !== 'All') {
        posts = posts.filter((p) => p.category === activeCategory.value);
    }
    if (isDefaultView.value && featuredPost.value) {
        posts = posts.filter((p) => p.slug !== featuredPost.value.slug);
    }
    return posts;
});

const paginated = computed(() => paginatePosts(filteredPosts.value, currentPage.value, POSTS_PER_PAGE));

const categoryCounts = computed(() =>
    categories.value.map((category) => ({
        ...category,
        count: allPosts.value.filter((p) => p.category === category.name).length,
    })),
);

function applySearch(term) {
    searchQuery.value = term;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectCategory(category) {
    activeCategory.value = category;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage(pageNumber) {
    currentPage.value = pageNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function paginatePosts(posts, page = 1, perPage = POSTS_PER_PAGE) {
    const safePage = Math.max(1, page);
    const total = posts.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage) || 1);
    const current = Math.min(safePage, totalPages);
    const start = (current - 1) * perPage;

    return {
        items: posts.slice(start, start + perPage),
        currentPage: current,
        totalPages,
        total,
        perPage,
    };
}
</script>

<template>
    <MarketingSeo
        title="CubSign Blog — PDF Signing, eSignatures & Security Guides"
        description="Expert guides on signing PDFs online, electronic signatures, document security, and paperless workflows from the CubSign team."
        path="/blog"
        search-target="/blog?q={search_term_string}"
    />

    <PublicLayout>
        <section class="marketing-gradient-hero px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl text-center">
                <p class="text-xs font-semibold uppercase tracking-widest text-blue-600">CubSign Blog</p>
                <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Guides for modern PDF signing
                </h1>
                <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
                    Practical articles on electronic signatures, security, contracts, and paperless workflows for freelancers, small businesses, and growing teams.
                </p>

                <div class="relative mx-auto mt-8 max-w-xl">
                    <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        v-model="searchQuery"
                        type="search"
                        placeholder="Search titles, topics, keywords, and content..."
                        class="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        aria-label="Search blog articles"
                    />
                </div>

                <div class="mt-5 flex flex-wrap justify-center gap-2">
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
            </div>
        </section>

        <section class="border-b border-gray-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div class="mx-auto flex max-w-7xl flex-wrap gap-2">
                <button
                    v-for="cat in ['All', ...categoryNames]"
                    :key="cat"
                    type="button"
                    :class="[
                        'rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
                        activeCategory === cat
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    ]"
                    @click="selectCategory(cat)"
                >
                    {{ cat }}
                </button>
            </div>
        </section>

        <section class="marketing-section">
            <div class="mx-auto max-w-7xl">
                <p v-if="searchQuery.trim()" class="mb-6 text-sm text-gray-500">
                    {{ paginated.total }} result{{ paginated.total === 1 ? '' : 's' }} for
                    <span class="font-medium text-gray-800">"{{ searchQuery.trim() }}"</span>
                </p>

                <div class="grid gap-10 lg:grid-cols-3">
                    <div class="space-y-8 lg:col-span-2">
                        <Link
                            v-if="isDefaultView && featuredPost"
                            :href="route('blog.show', featuredPost.slug)"
                            class="group block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <BlogCover
                                :title="featuredPost.title"
                                :category="featuredPost.category"
                                :cover-image="featuredPost.coverImage || ''"
                                featured
                                priority
                            />
                            <div class="p-8">
                                <BlogArticleMeta
                                    :published-at="featuredPost.publishedAt"
                                    :updated-at="featuredPost.updatedAt"
                                    :created-at="featuredPost.createdAt"
                                    :reading-time="featuredPost.readingTime"
                                    :category="featuredPost.category"
                                />
                                <h2 class="mt-4 text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                                    {{ featuredPost.title }}
                                </h2>
                                <p class="mt-3 text-sm leading-relaxed text-gray-600">{{ featuredPost.excerpt }}</p>
                                <div class="mt-5 flex items-center gap-3">
                                    <div :class="['flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white', featuredPost.author.avatarBg]">
                                        {{ featuredPost.author.initials }}
                                    </div>
                                    <span class="text-sm font-medium text-gray-700">{{ featuredPost.author.name }}</span>
                                </div>
                            </div>
                        </Link>

                        <div>
                            <h2 class="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400">
                                {{ searchQuery.trim() ? 'Search results' : 'Latest articles' }}
                            </h2>
                            <div class="grid gap-6 sm:grid-cols-2">
                                <Link
                                    v-for="post in paginated.items"
                                    :key="post.slug"
                                    :href="route('blog.show', post.slug)"
                                    class="group marketing-card-lift flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    <BlogCover
                                        :title="post.title"
                                        :category="post.category"
                                        :cover-image="post.coverImage || ''"
                                        :popular="post.popular"
                                    />
                                    <div class="flex flex-1 flex-col p-5">
                                        <BlogArticleMeta
                                            compact
                                            :published-at="post.publishedAt"
                                            :updated-at="post.updatedAt"
                                            :created-at="post.createdAt"
                                            :reading-time="post.readingTime"
                                            :category="post.category"
                                        />
                                        <h3 class="mt-2 font-semibold text-gray-900 group-hover:text-blue-600">
                                            {{ post.title }}
                                        </h3>
                                        <p class="mt-2 flex-1 text-sm text-gray-500 line-clamp-2">{{ post.excerpt }}</p>
                                        <div class="mt-4 flex flex-wrap gap-1.5">
                                            <span
                                                v-for="tag in (post.tags || []).slice(0, 2)"
                                                :key="tag"
                                                class="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-gray-500"
                                            >
                                                {{ tag }}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <p v-if="paginated.items.length === 0" class="py-12 text-center text-sm text-gray-500">
                                No articles found. Try another search or category.
                            </p>
                        </div>

                        <nav
                            v-if="paginated.totalPages > 1"
                            class="flex flex-wrap items-center justify-center gap-2 pt-2"
                            aria-label="Blog pagination"
                        >
                            <button
                                type="button"
                                class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
                                :disabled="paginated.currentPage <= 1"
                                @click="goToPage(paginated.currentPage - 1)"
                            >
                                Previous
                            </button>
                            <button
                                v-for="pageNumber in paginated.totalPages"
                                :key="pageNumber"
                                type="button"
                                :class="[
                                    'h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition-colors',
                                    pageNumber === paginated.currentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50',
                                ]"
                                :aria-current="pageNumber === paginated.currentPage ? 'page' : undefined"
                                @click="goToPage(pageNumber)"
                            >
                                {{ pageNumber }}
                            </button>
                            <button
                                type="button"
                                class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
                                :disabled="paginated.currentPage >= paginated.totalPages"
                                @click="goToPage(paginated.currentPage + 1)"
                            >
                                Next
                            </button>
                        </nav>
                    </div>

                    <aside class="space-y-8">
                        <div v-if="categoryCounts.length" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Categories</h3>
                            <ul class="mt-4 space-y-2">
                                <li v-for="category in categoryCounts" :key="category.slug">
                                    <button
                                        type="button"
                                        class="group flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                        @click="selectCategory(category.name)"
                                    >
                                        <span class="flex items-center gap-2">
                                            <span :class="['h-2 w-2 rounded-full bg-gradient-to-r', category.color]" />
                                            {{ category.name }}
                                        </span>
                                        <span class="text-xs text-gray-400">{{ category.count }}</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div v-if="popularPosts.length" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Popular articles</h3>
                            <ul class="mt-4 space-y-4">
                                <li v-for="post in popularPosts" :key="`pop-${post.slug}`">
                                    <Link :href="route('blog.show', post.slug)" class="group block">
                                        <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">{{ post.title }}</p>
                                        <p v-if="popularMeta(post)" class="mt-0.5 text-xs text-gray-400">{{ popularMeta(post) }}</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div v-if="recentlyUpdated.length" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Recently updated</h3>
                            <ul class="mt-4 space-y-3">
                                <li v-for="post in recentlyUpdated" :key="`upd-${post.slug}`">
                                    <Link :href="route('blog.show', post.slug)" class="text-sm text-gray-600 hover:text-blue-600">
                                        {{ post.title }}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div v-if="recentPosts.length" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Recent posts</h3>
                            <ul class="mt-4 space-y-3">
                                <li v-for="post in recentPosts" :key="`rec-${post.slug}`">
                                    <Link :href="route('blog.show', post.slug)" class="text-sm text-gray-600 hover:text-blue-600">
                                        {{ post.title }}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </aside>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
