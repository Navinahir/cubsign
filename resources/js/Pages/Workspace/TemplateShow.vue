<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    template: { type: Object, required: true },
});

const modal = ref({
    show: false, title: '', message: '',
    confirmLabel: '', confirmClass: '', onConfirm: () => {},
});

function closeModal() { modal.value.show = false; }

function confirmDelete() {
    modal.value = {
        show:         true,
        title:        'Delete template?',
        message:      'This action cannot be undone. Documents created from this template are not affected.',
        confirmLabel: 'Delete',
        confirmClass: 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700',
        onConfirm: () => {
            closeModal();
            router.delete(route('templates.destroy', props.template.id), {
                onSuccess: () => router.visit(route('templates.index')),
            });
        },
    };
}

function useTemplate() {
    router.post(route('templates.use', props.template.id));
}

function duplicateTemplate() {
    router.post(route('templates.duplicate', props.template.id));
}

function formatDateTime(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Template Details</template>

        <!-- Back -->
        <div class="mb-6">
            <Link
                :href="route('templates.index')"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Templates
            </Link>
        </div>

        <!-- Header -->
        <div class="mb-6 flex flex-wrap items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                </svg>
            </div>
            <div class="min-w-0 flex-1">
                <h1 class="truncate text-2xl font-bold text-gray-900">{{ template.name }}</h1>
                <div class="mt-1.5 flex flex-wrap items-center gap-3">
                    <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Template</span>
                    <span
                        v-if="template.field_count > 0"
                        class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                    >{{ template.field_count }} field{{ template.field_count !== 1 ? 's' : '' }}</span>
                    <span class="text-xs text-gray-400">Updated {{ formatDateTime(template.updated_at) }}</span>
                </div>
            </div>
        </div>

        <!-- Two-column layout -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

            <!-- Left: info -->
            <div class="lg:col-span-2">
                <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-sm font-semibold text-gray-800">Template information</h2>
                    </div>
                    <dl class="divide-y divide-gray-50 px-6">
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Name</dt>
                            <dd class="min-w-0 truncate text-sm font-medium text-gray-900">{{ template.name }}</dd>
                        </div>
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Fields placed</dt>
                            <dd class="text-sm text-gray-700">
                                <span v-if="template.field_count > 0" class="font-semibold text-blue-700">{{ template.field_count }}</span>
                                <span v-else class="text-gray-400">None yet</span>
                            </dd>
                        </div>
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Created</dt>
                            <dd class="text-sm text-gray-700">{{ formatDateTime(template.created_at) }}</dd>
                        </div>
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Last updated</dt>
                            <dd class="text-sm text-gray-700">{{ formatDateTime(template.updated_at) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <!-- Right: actions -->
            <div>
                <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-sm font-semibold text-gray-800">Actions</h2>
                    </div>
                    <div class="space-y-1 p-3">

                        <!-- Use template -->
                        <button
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                            @click="useTemplate"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            Use template
                        </button>

                        <!-- Edit fields -->
                        <Link
                            :href="route('templates.edit', template.id)"
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                            Edit fields
                        </Link>

                        <!-- Duplicate -->
                        <button
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                            @click="duplicateTemplate"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            Duplicate template
                        </button>

                        <div class="my-1 border-t border-gray-100"/>

                        <!-- Delete -->
                        <button
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            @click="confirmDelete"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete template
                        </button>
                    </div>
                </div>
            </div>

        </div>

        <!-- Confirmation modal -->
        <Teleport to="body">
            <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40" @click="closeModal"/>
                <div class="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                    <h3 class="text-base font-semibold text-gray-900">{{ modal.title }}</h3>
                    <p class="mt-2 text-sm text-gray-500">{{ modal.message }}</p>
                    <div class="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            @click="closeModal"
                        >Cancel</button>
                        <button
                            type="button"
                            :class="modal.confirmClass"
                            @click="modal.onConfirm()"
                        >{{ modal.confirmLabel }}</button>
                    </div>
                </div>
            </div>
        </Teleport>

    </WorkspaceLayout>
</template>
