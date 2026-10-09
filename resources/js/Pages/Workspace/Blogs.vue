<script setup>
import { computed, ref, watch } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    blogs: { type: Object, required: true }, // paginator
    filters: { type: Object, default: () => ({}) },
    statuses: { type: Array, default: () => [] },
});

const page = usePage();
const searchQuery = ref('');
const statusFilter = ref(props.filters.status || '');

const modal = ref({
    show: false, title: '', message: '',
    confirmLabel: '', confirmClass: '', onConfirm: () => {},
});

function closeModal() { modal.value.show = false; }

const rows = computed(() => props.blogs?.data || []);
const selectedIds = ref([]);

const filteredBlogs = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return rows.value;
    return rows.value.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.category?.name || '').toLowerCase().includes(q),
    );
});

const allVisibleSelected = computed(() =>
    filteredBlogs.value.length > 0
    && filteredBlogs.value.every((blog) => selectedIds.value.includes(blog.id)),
);

watch(rows, (list) => {
    const ids = new Set(list.map((blog) => blog.id));
    selectedIds.value = selectedIds.value.filter((id) => ids.has(id));
});

watch(statusFilter, (value) => {
    selectedIds.value = [];
    router.get(route('blogs.index'), { status: value || undefined }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
});

function toggleAllVisible(checked) {
    const visibleIds = filteredBlogs.value.map((blog) => blog.id);
    if (checked) {
        selectedIds.value = [...new Set([...selectedIds.value, ...visibleIds])];
        return;
    }
    const visible = new Set(visibleIds);
    selectedIds.value = selectedIds.value.filter((id) => !visible.has(id));
}

function toggleOne(id, checked) {
    if (checked) {
        if (!selectedIds.value.includes(id)) {
            selectedIds.value = [...selectedIds.value, id];
        }
        return;
    }
    selectedIds.value = selectedIds.value.filter((item) => item !== id);
}

function confirmDeleteSelected() {
    const count = selectedIds.value.length;
    if (!count) return;

    modal.value = {
        show: true,
        title: count === 1 ? 'Delete blog?' : `Delete ${count} blogs?`,
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete all',
        confirmClass: 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700',
        onConfirm: () => {
            const ids = [...selectedIds.value];
            closeModal();
            router.delete(route('blogs.destroy-many'), {
                data: { ids },
                preserveScroll: true,
                onSuccess: () => {
                    selectedIds.value = [];
                },
            });
        },
    };
}

function confirmDelete(blog) {
    modal.value = {
        show: true,
        title: 'Delete blog?',
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete',
        confirmClass: 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700',
        onConfirm: () => {
            closeModal();
            router.delete(route('blogs.destroy', blog.id), { preserveScroll: true });
        },
    };
}

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusClass(status) {
    const map = {
        draft: 'bg-gray-100 text-gray-700',
        published: 'bg-emerald-50 text-emerald-700',
        archived: 'bg-amber-50 text-amber-700',
    };
    return map[status] || map.draft;
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Blogs</template>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Blogs</h1>
                <p class="mt-1 text-sm text-gray-500">Manage blog posts for your workspace.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <Link
                    :href="route('blog-categories.index')"
                    class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                    Categories
                </Link>
                <Link
                    :href="route('blogs.create')"
                    class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    New Blog
                </Link>
            </div>
        </div>

        <div
            v-if="page.props.flash?.success"
            class="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
            {{ page.props.flash.success }}
        </div>

        <div v-if="(blogs.total || 0) > 0" class="mb-5 flex flex-wrap items-center gap-3">
            <div class="relative max-w-sm flex-1">
                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search blogs..."
                    class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>
            <select
                v-model="statusFilter"
                class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
                <option value="">All statuses</option>
                <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <button
                type="button"
                class="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                :disabled="selectedIds.length === 0"
                @click="confirmDeleteSelected"
            >
                Delete all
            </button>
        </div>

        <div v-if="filteredBlogs.length === 0" class="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <p class="text-sm font-medium text-gray-900">No blogs yet</p>
            <p class="mt-1 text-sm text-gray-500">Create your first blog post to get started.</p>
            <Link
                :href="route('blogs.create')"
                class="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
                + New Blog
            </Link>
        </div>

        <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="w-10 px-4 py-3 text-left">
                            <input
                                type="checkbox"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                :checked="allVisibleSelected"
                                aria-label="Select all blogs"
                                @change="toggleAllVisible($event.target.checked)"
                            />
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Blog</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Published</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Updated</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="blog in filteredBlogs" :key="blog.id" class="hover:bg-gray-50/80">
                        <td class="px-4 py-3">
                            <input
                                type="checkbox"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                :checked="selectedIds.includes(blog.id)"
                                :aria-label="`Select ${blog.title}`"
                                @change="toggleOne(blog.id, $event.target.checked)"
                            />
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <div class="h-12 w-16 overflow-hidden rounded-lg bg-gray-100">
                                    <img
                                        v-if="blog.cover_image"
                                        :src="blog.cover_image"
                                        :alt="blog.title"
                                        class="h-full w-full object-cover"
                                    />
                                    <div v-else class="flex h-full w-full items-center justify-center text-[10px] text-gray-400">No image</div>
                                </div>
                                <div>
                                    <Link :href="route('blogs.show', blog.id)" class="font-medium text-gray-900 hover:text-blue-600">
                                        {{ blog.title }}
                                    </Link>
                                    <p class="mt-0.5 text-xs text-gray-400">{{ blog.slug }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ blog.category?.name || '—' }}</td>
                        <td class="px-4 py-3">
                            <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize', statusClass(blog.status)]">
                                {{ blog.status }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(blog.published_at) }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(blog.updated_at) }}</td>
                        <td class="px-4 py-3 text-right text-sm">
                            <Link :href="route('blogs.show', blog.id)" class="font-medium text-gray-600 hover:text-gray-900">View</Link>
                            <Link :href="route('blogs.edit', blog.id)" class="ml-3 font-medium text-blue-600 hover:text-blue-700">Edit</Link>
                            <button type="button" class="ml-3 font-medium text-red-600 hover:text-red-700" @click="confirmDelete(blog)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- ── Pagination footer ── -->
            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                <p class="text-xs text-gray-500">
                    Showing
                    <span class="font-medium text-gray-700">{{ blogs.from }}–{{ blogs.to }}</span>
                    of
                    <span class="font-medium text-gray-700">{{ blogs.total }}</span>
                    posts
                </p>

                <div class="flex items-center gap-1">
                    <template v-for="link in blogs.links" :key="link.label">
                        <Link
                            v-if="link.url && !link.active"
                            :href="link.url"
                            class="rounded px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            preserve-scroll
                            v-html="link.label"
                        />
                        <span
                            v-else-if="link.active"
                            class="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white"
                            v-html="link.label"
                        />
                        <span
                            v-else
                            class="rounded px-2.5 py-1 text-xs text-gray-300"
                            v-html="link.label"
                        />
                    </template>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                    <h3 class="text-lg font-semibold text-gray-900">{{ modal.title }}</h3>
                    <p class="mt-2 text-sm text-gray-600">{{ modal.message }}</p>
                    <div class="mt-6 flex justify-end gap-2">
                        <button type="button" class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="closeModal">Cancel</button>
                        <button type="button" :class="modal.confirmClass" @click="modal.onConfirm">{{ modal.confirmLabel }}</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </WorkspaceLayout>
</template>
