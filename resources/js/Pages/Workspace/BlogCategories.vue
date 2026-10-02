<script setup>
import { ref } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

defineProps({
    categories: { type: Array, default: () => [] },
    statuses: { type: Array, default: () => [] },
});

const page = usePage();
const modal = ref({
    show: false, title: '', message: '',
    confirmLabel: '', confirmClass: '', onConfirm: () => {},
});

function closeModal() { modal.value.show = false; }

function confirmDelete(category) {
    modal.value = {
        show: true,
        title: 'Delete category?',
        message: category.blogs_count > 0
            ? 'This category has blogs assigned and cannot be deleted.'
            : 'This action cannot be undone.',
        confirmLabel: category.blogs_count > 0 ? 'OK' : 'Delete',
        confirmClass: category.blogs_count > 0
            ? 'rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white'
            : 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700',
        onConfirm: () => {
            closeModal();
            if (category.blogs_count > 0) return;
            router.delete(route('blog-categories.destroy', category.id), { preserveScroll: true });
        },
    };
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Blog Categories</template>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Blog Categories</h1>
                <p class="mt-1 text-sm text-gray-500">Organize workspace blogs by topic.</p>
            </div>
            <div class="flex gap-2">
                <Link :href="route('blogs.index')" class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Blogs</Link>
                <Link :href="route('blog-categories.create')" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">New Category</Link>
            </div>
        </div>

        <div v-if="page.props.errors?.category" class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ page.props.errors.category }}
        </div>

        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Slug</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Blogs</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="category in categories" :key="category.id">
                        <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ category.name }}</td>
                        <td class="px-4 py-3 text-sm text-gray-500">{{ category.slug }}</td>
                        <td class="px-4 py-3 text-sm capitalize text-gray-600">{{ category.status }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ category.blogs_count }}</td>
                        <td class="px-4 py-3 text-right text-sm">
                            <Link :href="route('blog-categories.edit', category.id)" class="font-medium text-blue-600 hover:text-blue-700">Edit</Link>
                            <button type="button" class="ml-3 font-medium text-red-600 hover:text-red-700" @click="confirmDelete(category)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
