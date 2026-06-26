<script setup>
import { computed, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import { blogPosts, blogCategories, formatDate } from '@/constants/blog';

const searchQuery = ref('');
const activeCategory = ref('All');
const newsletterEmail = ref('');
const newsletterSubmitted = ref(false);

const featuredPost = computed(() => blogPosts.find((p) => p.featured) ?? blogPosts[0]);

const filteredPosts = computed(() => {
    let posts = blogPosts.filter((p) => !p.featured || p.slug !== featuredPost.value?.slug);
    if (activeCategory.value !== 'All') {
        posts = posts.filter((p) => p.category === activeCategory.value);
    }
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        posts = posts.filter(
            (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)),
        );
    }
    return posts;
});

const popularPosts = computed(() => [...blogPosts].sort((a, b) => b.readingTime - a.readingTime).slice(0, 4));
const recentPosts = computed(() => [...blogPosts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 5));

function subscribeNewsletter() {
    if (newsletterEmail.value.trim()) newsletterSubmitted.value = true;
}
</script>

<template>
    <MarketingSeo title="Blog – CubSign" description="Tips, guides, and product updates from the CubSign team." path="/blog" />

    <PublicLayout>
        <section class="marketing-gradient-hero px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">CubSign Blog</h1>
                <p class="mx-auto mt-4 max-w-xl text-lg text-gray-600">Tips, guides, and updates on PDF signing, security, and productivity.</p>
            </div>
        </section>

        <section class="px-4 pb-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">
                <!-- Search & categories -->
                <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div class="relative max-w-md flex-1">
                        <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input v-model="searchQuery" type="search" placeholder="Search articles..." class="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" aria-label="Search blog articles" />
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="cat in ['All', ...blogCategories]"
                            :key="cat"
                            type="button"
                            :class="['rounded-full px-4 py-1.5 text-xs font-medium transition-colors', activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                            @click="activeCategory = cat"
                        >
                            {{ cat }}
                        </button>
                    </div>
                </div>

                <div class="grid gap-10 lg:grid-cols-3">
                    <div class="space-y-10 lg:col-span-2">
                        <!-- Featured -->
                        <ScrollReveal v-if="featuredPost && activeCategory === 'All' && !searchQuery">
                            <Link :href="route('blog.show', featuredPost.slug)" class="group block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
                                <div :class="['flex h-48 items-end bg-gradient-to-br p-8 sm:h-56', featuredPost.heroGradient]">
                                    <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">Featured</span>
                                </div>
                                <div class="p-8">
                                    <div class="flex items-center gap-3 text-xs text-gray-500">
                                        <span class="font-medium text-blue-600">{{ featuredPost.category }}</span>
                                        <span>{{ formatDate(featuredPost.publishedAt) }}</span>
                                        <span>{{ featuredPost.readingTime }} min read</span>
                                    </div>
                                    <h2 class="mt-3 text-2xl font-bold text-gray-900 group-hover:text-blue-600">{{ featuredPost.title }}</h2>
                                    <p class="mt-3 text-sm leading-relaxed text-gray-600">{{ featuredPost.excerpt }}</p>
                                    <div class="mt-4 flex items-center gap-3">
                                        <div :class="['flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white', featuredPost.author.avatarBg]">{{ featuredPost.author.initials }}</div>
                                        <span class="text-sm font-medium text-gray-700">{{ featuredPost.author.name }}</span>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>

                        <!-- Post grid -->
                        <div class="grid gap-6 sm:grid-cols-2">
                            <ScrollReveal v-for="(post, i) in filteredPosts" :key="post.slug" :delay="i * 60">
                                <Link :href="route('blog.show', post.slug)" class="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                    <div :class="['h-32 bg-gradient-to-br', post.heroGradient]" />
                                    <div class="flex flex-1 flex-col p-6">
                                        <div class="flex items-center gap-2 text-xs text-gray-500">
                                            <span class="font-medium text-blue-600">{{ post.category }}</span>
                                            <span>{{ post.readingTime }} min</span>
                                        </div>
                                        <h3 class="mt-2 font-semibold text-gray-900 group-hover:text-blue-600">{{ post.title }}</h3>
                                        <p class="mt-2 flex-1 text-sm text-gray-500 line-clamp-2">{{ post.excerpt }}</p>
                                        <div class="mt-4 flex flex-wrap gap-1.5">
                                            <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-gray-500">{{ tag }}</span>
                                        </div>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        </div>

                        <p v-if="filteredPosts.length === 0" class="py-12 text-center text-sm text-gray-500">No articles found. Try a different search or category.</p>
                    </div>

                    <!-- Sidebar -->
                    <aside class="space-y-8">
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Popular Posts</h3>
                            <ul class="mt-4 space-y-4">
                                <li v-for="post in popularPosts" :key="post.slug">
                                    <Link :href="route('blog.show', post.slug)" class="group block">
                                        <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">{{ post.title }}</p>
                                        <p class="mt-0.5 text-xs text-gray-400">{{ post.readingTime }} min read</p>
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
                            <p class="mt-2 text-sm text-blue-100">Get signing tips and product updates in your inbox.</p>
                            <div v-if="newsletterSubmitted" class="mt-4 text-sm font-medium text-blue-100">Thanks for subscribing!</div>
                            <form v-else class="mt-4" @submit.prevent="subscribeNewsletter">
                                <input v-model="newsletterEmail" type="email" placeholder="you@email.com" required class="w-full rounded-lg border-0 px-4 py-2.5 text-sm text-gray-900 outline-none" aria-label="Email for newsletter" />
                                <button type="submit" class="mt-3 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50">Subscribe</button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
