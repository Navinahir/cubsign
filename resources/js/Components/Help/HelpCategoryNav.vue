<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { helpCategories, getArticlesByCategory } from '@/constants/help';

const props = defineProps({
    activeCategorySlug: { type: String, default: '' },
    activeArticleSlug: { type: String, default: '' },
    /** 'anchor' for index page hash links; 'browse' for article sidebar */
    mode: { type: String, default: 'anchor' },
});

const groups = computed(() =>
    helpCategories.map((category) => ({
        ...category,
        articles: getArticlesByCategory(category.slug),
    })),
);

function isExpanded(categorySlug) {
    return props.activeCategorySlug === categorySlug;
}
</script>

<template>
    <nav aria-label="Help categories" class="space-y-1">
        <p class="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Categories
        </p>

        <div v-for="category in groups" :key="category.slug" class="pt-1">
            <a
                v-if="mode === 'anchor'"
                :href="`#${category.slug}`"
                :class="[
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isExpanded(category.slug)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                ]"
            >
                <span>{{ category.name }}</span>
                <span class="text-xs font-normal text-gray-400">{{ category.articles.length }}</span>
            </a>

            <Link
                v-else
                :href="`${route('help-center')}#${category.slug}`"
                :class="[
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isExpanded(category.slug)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                ]"
            >
                <span>{{ category.name }}</span>
                <span class="text-xs font-normal text-gray-400">{{ category.articles.length }}</span>
            </Link>

            <ul
                v-if="isExpanded(category.slug)"
                class="mt-1 ml-3 space-y-0.5 border-l border-gray-100 pl-3"
            >
                <li v-for="article in category.articles" :key="article.slug">
                    <Link
                        :href="route('help-center.show', article.slug)"
                        :class="[
                            'block rounded-md px-2 py-1.5 text-[13px] leading-snug transition-colors',
                            activeArticleSlug === article.slug
                                ? 'bg-gray-100 font-medium text-gray-900'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                        ]"
                        :aria-current="activeArticleSlug === article.slug ? 'page' : undefined"
                    >
                        {{ article.title }}
                    </Link>
                </li>
            </ul>
        </div>
    </nav>
</template>
