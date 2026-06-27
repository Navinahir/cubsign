<script setup>
import { computed, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import BlogCover from '@/Components/Marketing/BlogCover.vue';
import MetaItems from '@/Components/Marketing/MetaItems.vue';
import { blogPosts, blogCategories, formatDate } from '@/constants/blog';

const searchQuery = ref('');
const activeCategory = ref('All');

const featuredPost = computed(() => blogPosts.find((p) => p.featured) ?? blogPosts[0]);
const popularSlug = 'how-to-sign-pdf-online';

const filteredPosts = computed(() => {
    let posts = blogPosts.filter((p) => !p.featured || p.slug !== featuredPost.value?.slug);
    if (activeCategory.value !== 'All') posts = posts.filter((p) => p.category === activeCategory.value);
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return posts;
});

const popularPosts = computed(() => [...blogPosts].sort((a, b) => b.readingTime - a.readingTime).slice(0, 4));
const recentPosts = computed(() => [...blogPosts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 5));

const categoryColors = { Product: 'from-cyan-600 to-blue-700', Security: 'from-rose-600 to-orange-700', Guides: 'from-emerald-600 to-teal-700', Company: 'from-blue-600 to-indigo-700', Legal: 'from-violet-600 to-purple-700' };

function featuredMeta(post) {
    return [
        post.category ? { text: post.category, class: 'font-medium text-blue-600' } : null,
        post.publishedAt ? formatDate(post.publishedAt) : null,
        post.readingTime ? `${post.readingTime} min read` : null,
    ].filter(Boolean);
}

function cardMeta(post) {
    return [
        post.category
            ? { text: post.category, class: `rounded-full px-2 py-0.5 font-medium text-white bg-gradient-to-r ${categoryColors[post.category] || 'from-gray-500 to-gray-600'}` }
            : null,
        post.readingTime ? `${post.readingTime} min` : null,
    ].filter(Boolean);
}
</script>

<template>
    <MarketingSeo title="Blog – CubSign" description="Tips, guides, and product updates from the CubSign team." path="/blog" />

    <PublicLayout>
        <section class="marketing-gradient-hero px-4 py-12 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">CubSign Blog</h1>
                <p class="mx-auto mt-3 max-w-xl text-lg text-gray-600">Tips, guides, and updates on PDF signing, security, and productivity.</p>
            </div>
        </section>

        <section class="marketing-section">
            <div class="mx-auto max-w-7xl">
                <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div class="relative max-w-md flex-1">
                        <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        <input v-model="searchQuery" type="search" placeholder="Search articles..." class="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" aria-label="Search blog articles" />
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="cat in ['All', ...blogCategories]" :key="cat" type="button" :class="['rounded-full px-4 py-1.5 text-xs font-medium transition-colors', activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']" @click="activeCategory = cat">{{ cat }}</button>
                    </div>
                </div>

                <div class="grid gap-10 lg:grid-cols-3">
                    <div class="space-y-8 lg:col-span-2">
                        <Link v-if="featuredPost && activeCategory === 'All' && !searchQuery" :href="route('blog.show', featuredPost.slug)" class="group block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                            <BlogCover :gradient="featuredPost.heroGradient" :category="featuredPost.category" featured size="large" />
                            <div class="p-8">
                                <MetaItems class="text-xs text-gray-500" :items="featuredMeta(featuredPost)" />
                                <h2 class="mt-3 text-2xl font-bold text-gray-900 group-hover:text-blue-600">{{ featuredPost.title }}</h2>
                                <p class="mt-3 text-sm leading-relaxed text-gray-600">{{ featuredPost.excerpt }}</p>
                                <div class="mt-5 flex items-center gap-3">
                                    <div :class="['flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white', featuredPost.author.avatarBg]">{{ featuredPost.author.initials }}</div>
                                    <span class="text-sm font-medium text-gray-700">{{ featuredPost.author.name }}</span>
                                </div>
                            </div>
                        </Link>

                        <div class="grid gap-6 sm:grid-cols-2">
                            <Link v-for="post in filteredPosts" :key="post.slug" :href="route('blog.show', post.slug)" class="group marketing-card-lift flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <BlogCover :gradient="post.heroGradient" :category="post.category" :popular="post.slug === popularSlug" />
                                <div class="flex flex-1 flex-col p-5">
                                    <MetaItems class="text-xs text-gray-500" :items="cardMeta(post)" />
                                    <h3 class="mt-2 font-semibold text-gray-900 group-hover:text-blue-600">{{ post.title }}</h3>
                                    <p class="mt-2 flex-1 text-sm text-gray-500 line-clamp-2">{{ post.excerpt }}</p>
                                    <div class="mt-4 flex flex-wrap gap-1.5">
                                        <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-gray-500">{{ tag }}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <p v-if="filteredPosts.length === 0" class="py-12 text-center text-sm text-gray-500">No articles found.</p>
                    </div>

                    <aside class="space-y-8">
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Popular Posts</h3>
                            <ul class="mt-4 space-y-4">
                                <li v-for="post in popularPosts" :key="post.slug">
                                    <Link :href="route('blog.show', post.slug)" class="group block">
                                        <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">{{ post.title }}</p>
                                        <p v-if="post.readingTime" class="mt-0.5 text-xs text-gray-400">{{ post.readingTime }} min read</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Recent Posts</h3>
                            <ul class="mt-4 space-y-3">
                                <li v-for="post in recentPosts" :key="post.slug">
                                    <Link :href="route('blog.show', post.slug)" class="text-sm text-gray-600 hover:text-blue-600">{{ post.title }}</Link>
                                </li>
                            </ul>
                        </div>
                        <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-lg">
                            <h3 class="font-semibold">Newsletter</h3>
                            <p class="mt-2 text-sm text-blue-100">Product updates and signing tips. Coming soon.</p>
                            <div class="mt-4 flex gap-2 opacity-70" aria-hidden="true">
                                <input type="email" disabled placeholder="you@email.com" class="w-full rounded-lg border-0 px-4 py-2.5 text-sm text-gray-500" tabindex="-1" />
                            </div>
                            <span class="mt-3 inline-block rounded-lg border border-blue-400/50 px-3 py-1.5 text-xs font-semibold text-blue-100">Coming Soon</span>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
