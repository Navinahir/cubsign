<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import BlogCover from '@/Components/Marketing/BlogCover.vue';
import BlogContent from '@/Components/Marketing/BlogContent.vue';
import BlogArticleMeta from '@/Components/Blog/BlogArticleMeta.vue';
import BlogToc from '@/Components/Blog/BlogToc.vue';
import BlogShare from '@/Components/Blog/BlogShare.vue';
import BlogFaq from '@/Components/Blog/BlogFaq.vue';
import BlogFeedback from '@/Components/Blog/BlogFeedback.vue';
import {
    getPostBySlug,
    getRelatedPosts,
    getAdjacentPosts,
    getPostsByCategory,
    blogAuthor,
} from '@/constants/blog';
import { normalizeBlogBlocks } from '@/utils/marketingContent';
import { CTA_START_SIGNING, btnPrimary } from '@/constants/marketing';

const props = defineProps({
    slug: { type: String, required: true },
});

const post = computed(() => getPostBySlug(props.slug));
const relatedPosts = computed(() => getRelatedPosts(props.slug));
const adjacent = computed(() => getAdjacentPosts(props.slug));
const categoryPosts = computed(() =>
    post.value ? getPostsByCategory(post.value.category).filter((p) => p.slug !== props.slug) : [],
);

const activeHeading = ref('');
const mobileTocOpen = ref(false);

const contentBlocks = computed(() => normalizeBlogBlocks(post.value?.content ?? []));

const headings = computed(() =>
    contentBlocks.value
        .filter((block) => block.type === 'h2')
        .map((block, index) => ({ id: `heading-${index}`, title: block.text })),
);

const seoTitle = computed(() => post.value?.metaTitle ?? `${post.value?.title} — CubSign Blog`);
const seoDescription = computed(() => post.value?.metaDescription ?? post.value?.excerpt ?? '');

const breadcrumbSchema = computed(() => {
    if (!post.value) return [];
    return [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.value.category, url: `/blog?category=${encodeURIComponent(post.value.category)}` },
        { name: post.value.title, url: `/blog/${post.value.slug}` },
    ];
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
    if (!post.value) {
        router.visit(route('blog'));
        return;
    }
    await nextTick();
    setupHeadingObserver();
});

watch(() => props.slug, async () => {
    activeHeading.value = '';
    mobileTocOpen.value = false;
    await nextTick();
    setupHeadingObserver();
    window.scrollTo({ top: 0 });
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
    <template v-if="post">
        <MarketingSeo
            :title="seoTitle"
            :description="seoDescription"
            :path="`/blog/${post.slug}`"
            type="article"
            :article="post"
            :faq-schema="post.faq ?? []"
            :breadcrumb-schema="breadcrumbSchema"
        />

        <PublicLayout>
            <div class="border-b border-gray-100 bg-white lg:hidden">
                <div class="flex gap-2 px-4 py-3 sm:px-6">
                    <button
                        v-if="headings.length"
                        type="button"
                        class="flex flex-1 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-700"
                        :aria-expanded="mobileTocOpen"
                        @click="mobileTocOpen = !mobileTocOpen"
                    >
                        Table of contents
                        <svg :class="['h-4 w-4 shrink-0 text-gray-400 transition-transform', mobileTocOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <div v-show="mobileTocOpen" class="border-t border-gray-100 px-4 py-3 sm:px-6">
                    <BlogToc :headings="headings" :active-heading="activeHeading" @navigate="scrollToHeading" />
                </div>
            </div>

            <BlogCover
                :slug="post.slug"
                :title="post.title"
                :category="post.category"
                :popular="post.popular"
                priority
            />

            <div class="bg-white">
                <div class="mx-auto grid max-w-7xl lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_260px]">
                    <aside class="hidden xl:block">
                        <div class="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto px-5 py-8">
                            <Link
                                :href="route('blog')"
                                class="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                ← Back to Blog
                            </Link>
                            <BlogToc
                                :headings="headings"
                                :active-heading="activeHeading"
                                @navigate="scrollToHeading"
                            />
                        </div>
                    </aside>

                    <div class="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                        <nav aria-label="Breadcrumb" class="text-sm text-gray-500">
                            <ol class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <li>
                                    <Link :href="route('home')" class="hover:text-gray-800">Home</Link>
                                </li>
                                <li aria-hidden="true" class="text-gray-300">/</li>
                                <li>
                                    <Link :href="route('blog')" class="font-medium text-blue-600 hover:text-blue-700">
                                        Blog
                                    </Link>
                                </li>
                                <li aria-hidden="true" class="text-gray-300">/</li>
                                <li>
                                    <Link
                                        :href="`${route('blog')}?category=${encodeURIComponent(post.category)}`"
                                        class="hover:text-gray-800"
                                    >
                                        {{ post.category }}
                                    </Link>
                                </li>
                                <li aria-hidden="true" class="hidden text-gray-300 sm:inline">/</li>
                                <li class="hidden font-medium text-gray-700 sm:inline" aria-current="page">
                                    {{ post.title }}
                                </li>
                            </ol>
                        </nav>

                        <header class="mt-6 border-b border-gray-100 pb-6">
                            <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                {{ post.category }}
                            </p>
                            <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                                {{ post.title }}
                            </h1>
                            <p class="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                                {{ post.excerpt }}
                            </p>
                            <div class="mt-5 flex flex-wrap items-center gap-4">
                                <div class="flex items-center gap-3">
                                    <div :class="['flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white', post.author.avatarBg]">
                                        {{ post.author.initials }}
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-gray-900">{{ post.author.name }}</p>
                                        <p class="text-xs text-gray-500">{{ post.author.role }}</p>
                                    </div>
                                </div>
                                <BlogArticleMeta
                                    :published-at="post.publishedAt"
                                    :updated-at="post.updatedAt"
                                    :last-reviewed="post.lastReviewed || post.updatedAt"
                                    :reading-time="post.readingTime"
                                />
                            </div>
                            <div class="mt-4 lg:hidden">
                                <BlogShare :title="post.title" />
                            </div>
                        </header>

                        <article class="pt-2">
                            <BlogContent :blocks="post.content" :current-slug="post.slug" />

                            <div v-if="post.tags?.length" class="mt-8 flex flex-wrap gap-2">
                                <span
                                    v-for="tag in post.tags"
                                    :key="tag"
                                    class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                                >
                                    {{ tag }}
                                </span>
                            </div>

                            <BlogFaq :items="post.faq ?? []" />

                            <div class="mt-10 flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                                <div :class="['flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white', blogAuthor.avatarBg]">
                                    {{ blogAuthor.initials }}
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">{{ blogAuthor.name }}</p>
                                    <p class="mt-1 text-sm leading-relaxed text-gray-600">{{ blogAuthor.bio }}</p>
                                </div>
                            </div>

                            <div class="mt-10">
                                <BlogFeedback :post-slug="post.slug" />
                            </div>

                            <nav aria-label="Article pagination" class="mt-10 grid gap-3 sm:grid-cols-2">
                                <Link
                                    v-if="adjacent.previous"
                                    :href="route('blog.show', adjacent.previous.slug)"
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
                                    :href="route('blog.show', adjacent.next.slug)"
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
                                    <Link :href="route('blog')" class="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                        View all posts
                                    </Link>
                                </div>
                                <ul class="mt-4 grid gap-3 sm:grid-cols-2">
                                    <li v-for="related in relatedPosts" :key="related.slug">
                                        <Link
                                            :href="route('blog.show', related.slug)"
                                            class="group block rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:border-blue-100 hover:bg-blue-50/40"
                                        >
                                            <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                                {{ related.title }}
                                            </p>
                                            <BlogArticleMeta
                                                class="mt-1"
                                                compact
                                                :published-at="related.publishedAt"
                                                :last-reviewed="related.lastReviewed || related.updatedAt"
                                                :reading-time="related.readingTime"
                                            />
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div v-if="categoryPosts.length" class="mt-8">
                                <h2 class="text-sm font-semibold text-gray-900">More in {{ post.category }}</h2>
                                <ul class="mt-3 space-y-1">
                                    <li v-for="item in categoryPosts.slice(0, 5)" :key="item.slug">
                                        <Link
                                            :href="route('blog.show', item.slug)"
                                            class="block rounded-lg px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                        >
                                            {{ item.title }}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                        </article>
                    </div>

                    <aside class="hidden border-l border-gray-100 lg:block">
                        <div class="sticky top-20 max-h-[calc(100vh-5rem)] space-y-6 overflow-y-auto px-5 py-8">
                            <BlogToc
                                class="xl:hidden"
                                :headings="headings"
                                :active-heading="activeHeading"
                                @navigate="scrollToHeading"
                            />
                            <BlogShare :title="post.title" />
                            <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                <p class="text-sm font-semibold text-gray-900">Ready to sign?</p>
                                <p class="mt-1 text-xs leading-relaxed text-gray-600">Upload a PDF and finish in under a minute.</p>
                                <Link :href="route('sign.index')" :class="[btnPrimary, 'mt-3 w-full !px-3 !py-2.5 text-xs']">
                                    {{ CTA_START_SIGNING }}
                                </Link>
                            </div>
                            <div class="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                                <p class="font-semibold text-gray-900">Resources</p>
                                <ul class="mt-3 space-y-2 text-gray-600">
                                    <li>
                                        <Link :href="route('help-center')" class="hover:text-blue-600">Help Center</Link>
                                    </li>
                                    <li>
                                        <Link :href="route('features')" class="hover:text-blue-600">Features</Link>
                                    </li>
                                    <li>
                                        <Link :href="route('contact')" class="hover:text-blue-600">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    </template>
</template>
