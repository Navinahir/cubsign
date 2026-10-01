<script setup>
import { computed, onMounted, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
    recentBlogs: {
        type: Array,
        default: () => [],
    },
});

const user = computed(() => usePage().props.auth.user);
const firstName = computed(() => user.value?.name?.split(' ')[0] ?? 'there');

const page = usePage();
const toast = ref('');
let toastTimer = null;

onMounted(() => {
    if (page.props.flash?.status === 'email-verified') {
        showToast('Your email has been verified successfully.');
    }
});

function showToast(message) {
    toast.value = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.value = '';
    }, 6000);
}

const statCards = computed(() => [
    {
        label: 'Blog posts',
        value: props.stats.blogs,
        icon: 'M4 5a2 2 0 012-2h14v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5z M8 7h4v4H8V7z M14 7h4 M14 10h4 M8 14h10 M8 17h6',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        label: 'Published',
        value: props.stats.published,
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        label: 'Drafts',
        value: props.stats.drafts,
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        color: 'text-sky-600',
        bg: 'bg-sky-50',
    },
    {
        label: 'Categories',
        value: props.stats.categories,
        icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
    },
]);

function statusBadgeClass(status) {
    const map = {
        draft: 'bg-gray-100 text-gray-600',
        published: 'bg-emerald-100 text-emerald-700',
        archived: 'bg-amber-100 text-amber-700',
    };

    return `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? map.draft}`;
}

function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Admin Dashboard</template>

        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="toast"
                class="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800 shadow-lg"
            >
                {{ toast }}
            </div>
        </Transition>

        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ firstName }}</h1>
                <p class="mt-1 text-sm text-gray-500">Manage the CubSign blog from this dashboard.</p>
            </div>
            <Link
                :href="route('blogs.index')"
                class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
                Open blogs
            </Link>
        </div>

        <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
                v-for="card in statCards"
                :key="card.label"
                class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
                <div :class="['flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', card.bg]">
                    <svg :class="['h-5 w-5', card.color]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="card.icon" />
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500">{{ card.label }}</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ card.value }}</p>
                </div>
            </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h2 class="text-sm font-semibold text-gray-900">Recent posts</h2>
                <Link :href="route('blogs.index')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View all
                </Link>
            </div>
            <div v-if="recentBlogs.length" class="divide-y divide-gray-100">
                <Link
                    v-for="blog in recentBlogs"
                    :key="blog.id"
                    :href="route('blogs.show', blog.id)"
                    class="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-gray-50"
                >
                    <div class="min-w-0">
                        <p class="truncate text-sm font-medium text-gray-900">{{ blog.title }}</p>
                        <p class="truncate text-xs text-gray-500">{{ blog.category || 'Uncategorized' }}</p>
                    </div>
                    <div class="flex shrink-0 items-center gap-3">
                        <span :class="statusBadgeClass(blog.status)">{{ blog.status }}</span>
                        <span class="text-xs text-gray-400">{{ formatDate(blog.updated_at) }}</span>
                    </div>
                </Link>
            </div>
            <p v-else class="px-5 py-8 text-sm text-gray-500">No blog posts yet.</p>
        </div>
    </WorkspaceLayout>
</template>
