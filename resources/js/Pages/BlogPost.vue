<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import BlogCover from '@/Components/Marketing/BlogCover.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import { getPostBySlug, getRelatedPosts, formatDate, blogPosts } from '@/constants/blog';

const props = defineProps({ slug: { type: String, required: true } });

const post = computed(() => getPostBySlug(props.slug));
const relatedPosts = computed(() => getRelatedPosts(props.slug));
const activeHeading = ref('');
const newsletterEmail = ref('');
const newsletterSubmitted = ref(false);

const postIndex = computed(() => blogPosts.findIndex((p) => p.slug === props.slug));
const prevPost = computed(() => postIndex.value > 0 ? blogPosts[postIndex.value - 1] : null);
const nextPost = computed(() => postIndex.value < blogPosts.length - 1 ? blogPosts[postIndex.value + 1] : null);

const headings = computed(() =>
    (post.value?.content ?? []).filter((b) => b.type === 'h2').map((b, i) => ({ id: `heading-${i}`, title: b.text })),
);

function scrollToHeading(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function shareUrl(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.value?.title ?? '');
    const urls = { twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
}

let observer;
onMounted(() => {
    if (!post.value) { router.visit(route('blog')); return; }
    observer = new IntersectionObserver(
        (entries) => { for (const e of entries) if (e.isIntersecting) activeHeading.value = e.target.id; },
        { rootMargin: '-100px 0px -60% 0px' },
    );
    headings.value.forEach((h) => { const el = document.getElementById(h.id); if (el) observer.observe(el); });
});
onUnmounted(() => observer?.disconnect());

function subscribeNewsletter() {
    if (newsletterEmail.value.trim()) newsletterSubmitted.value = true;
}
</script>

<template>
    <template v-if="post">
        <MarketingSeo :title="`${post.title} – CubSign Blog`" :description="post.excerpt" :path="`/blog/${post.slug}`" type="article" :article="post" />

        <PublicLayout>
            <BlogCover :gradient="post.heroGradient" :category="post.category" size="large" />

            <section class="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-3xl text-center">
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{{ post.title }}</h1>
                    <div class="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                        <div class="flex items-center gap-2">
                            <div :class="['flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white', post.author.avatarBg]">{{ post.author.initials }}</div>
                            <div class="text-left">
                                <p class="font-medium text-gray-900">{{ post.author.name }}</p>
                                <p class="text-xs text-gray-400">{{ post.author.role }}</p>
                            </div>
                        </div>
                        <span>{{ formatDate(post.publishedAt) }}</span>
                        <span>{{ post.readingTime }} min read</span>
                    </div>
                </div>
            </section>

            <section class="marketing-section">
                <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-4">
                    <aside class="hidden lg:block">
                        <div class="sticky top-24 space-y-6">
                            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 class="text-sm font-semibold text-gray-900">Table of Contents</h2>
                                <ul class="mt-4 space-y-2">
                                    <li v-for="h in headings" :key="h.id">
                                        <a :href="`#${h.id}`" :class="['block text-sm transition-colors', activeHeading === h.id ? 'font-medium text-blue-600' : 'text-gray-500 hover:text-gray-900']" @click.prevent="scrollToHeading(h.id)">{{ h.title }}</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Share</p>
                                <div class="mt-3 flex gap-2">
                                    <button type="button" class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900" aria-label="Share on Twitter" @click="shareUrl('twitter')">
                                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </button>
                                    <button type="button" class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900" aria-label="Share on LinkedIn" @click="shareUrl('linkedin')">
                                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <article class="lg:col-span-2">
                        <template v-for="(block, index) in post.content" :key="index">
                            <p v-if="block.type === 'p'" class="mb-5 text-base leading-relaxed text-gray-600">{{ block.text }}</p>
                            <h2 v-else-if="block.type === 'h2'" :id="`heading-${headings.findIndex((h) => h.title === block.text)}`" class="mb-4 mt-10 scroll-mt-24 text-xl font-bold text-gray-900">{{ block.text }}</h2>
                            <ul v-else-if="block.type === 'ul'" class="mb-5 list-disc space-y-2 pl-5 text-base text-gray-600">
                                <li v-for="item in block.items" :key="item">{{ item }}</li>
                            </ul>
                        </template>
                        <div class="mt-8 flex flex-wrap gap-2">
                            <span v-for="tag in post.tags" :key="tag" class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{{ tag }}</span>
                        </div>
                        <div class="mt-10 flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                            <div :class="['flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white', post.author.avatarBg]">{{ post.author.initials }}</div>
                            <div>
                                <p class="font-semibold text-gray-900">{{ post.author.name }}</p>
                                <p class="text-sm text-gray-500">{{ post.author.role }}</p>
                            </div>
                        </div>
                    </article>

                    <aside class="lg:col-span-1">
                        <div class="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-900">Related Articles</h3>
                            <ul class="mt-4 space-y-4">
                                <li v-for="related in relatedPosts" :key="related.slug">
                                    <Link :href="route('blog.show', related.slug)" class="group block">
                                        <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">{{ related.title }}</p>
                                        <p class="mt-0.5 text-xs text-gray-400">{{ related.readingTime }} min read</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>

                <div class="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
                    <Link v-if="prevPost" :href="route('blog.show', prevPost.slug)" class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-5">
                        <p class="text-xs text-gray-400">← Previous</p>
                        <p class="mt-1 text-sm font-medium text-gray-900">{{ prevPost.title }}</p>
                    </Link>
                    <div v-else />
                    <Link v-if="nextPost" :href="route('blog.show', nextPost.slug)" class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-5 text-right sm:col-start-2">
                        <p class="text-xs text-gray-400">Next →</p>
                        <p class="mt-1 text-sm font-medium text-gray-900">{{ nextPost.title }}</p>
                    </Link>
                </div>

                <div class="mx-auto mt-12 max-w-3xl">
                    <CtaBanner variant="light" title="Stay in the loop" description="Get the latest signing tips and CubSign updates." primary-label="Subscribe via Blog" :primary-href="route('blog')" />
                </div>
            </section>
        </PublicLayout>
    </template>
</template>
