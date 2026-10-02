<script setup>
import { Link } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

defineProps({
    blog: { type: Object, required: true },
});

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Blog</template>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link :href="route('blogs.index')" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Blogs
            </Link>
            <Link
                :href="route('blogs.edit', blog.id)"
                class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
                Edit
            </Link>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">{{ blog.category?.name || 'Uncategorized' }}</p>
                    <h1 class="mt-2 text-2xl font-bold text-gray-900">{{ blog.title }}</h1>
                    <p class="mt-1 text-sm text-gray-500">{{ blog.slug }}</p>
                </div>
                <span class="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                    {{ blog.status }}
                </span>
            </div>

            <img
                v-if="blog.cover_image"
                :src="blog.cover_image"
                :alt="blog.title"
                class="mt-6 max-h-64 w-full rounded-xl object-cover"
            />

            <p v-if="blog.excerpt" class="mt-6 text-sm leading-relaxed text-gray-600">{{ blog.excerpt }}</p>

            <div v-if="blog.tags?.length" class="mt-4 flex flex-wrap gap-2">
                <span
                    v-for="tag in blog.tags"
                    :key="tag"
                    class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                >
                    {{ tag }}
                </span>
            </div>

            <dl class="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">Published</dt>
                    <dd class="mt-1 text-sm text-gray-800">{{ formatDate(blog.published_at) }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">Reading time</dt>
                    <dd class="mt-1 text-sm text-gray-800">{{ blog.reading_time ? `${blog.reading_time} min` : '—' }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">Flags</dt>
                    <dd class="mt-1 text-sm text-gray-800">
                        {{ [blog.featured ? 'Featured' : null, blog.popular ? 'Popular' : null].filter(Boolean).join(', ') || '—' }}
                    </dd>
                </div>
                <div>
                    <dt class="text-xs font-semibold uppercase tracking-wide text-gray-400">FAQ items</dt>
                    <dd class="mt-1 text-sm text-gray-800">{{ blog.faq?.length || 0 }}</dd>
                </div>
            </dl>

            <div v-if="blog.faq?.length" class="mt-8 border-t border-gray-100 pt-6">
                <h2 class="text-sm font-semibold text-gray-900">Frequently Asked Questions</h2>
                <div class="mt-4 space-y-4">
                    <div v-for="(item, index) in blog.faq" :key="index" class="rounded-lg border border-gray-200 p-4">
                        <p class="text-sm font-semibold text-gray-900">{{ item.question }}</p>
                        <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ item.answer }}</p>
                    </div>
                </div>
            </div>
        </div>
    </WorkspaceLayout>
</template>
