<script setup>
import { Link, useForm } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    category: { type: Object, required: true },
    statuses: { type: Array, default: () => [] },
});

const form = useForm({
    name: props.category.name || '',
    slug: props.category.slug || '',
    description: props.category.description || '',
    color: props.category.color || '',
    status: props.category.status || 'active',
});

function submit() {
    form.put(route('blog-categories.update', props.category.id));
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Edit Category</template>

        <div class="mb-6">
            <Link :href="route('blog-categories.index')" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800">
                Categories
            </Link>
        </div>

        <form class="mx-auto max-w-lg space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" @submit.prevent="submit">
            <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
                <input v-model="form.name" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <p v-if="form.errors.name" class="mt-1 text-xs text-red-600">{{ form.errors.name }}</p>
            </div>
            <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Slug *</label>
                <input v-model="form.slug" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <p v-if="form.errors.slug" class="mt-1 text-xs text-red-600">{{ form.errors.slug }}</p>
            </div>
            <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea v-model="form.description" rows="3" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Color</label>
                <input v-model="form.color" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Status *</label>
                <select v-model="form.status" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
            </div>
            <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
                <Link :href="route('blog-categories.index')" class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">Cancel</Link>
                <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" :disabled="form.processing">Save</button>
            </div>
        </form>
    </WorkspaceLayout>
</template>
