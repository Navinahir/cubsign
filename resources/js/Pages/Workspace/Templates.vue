<script setup>
import { ref, computed } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    templates: { type: Array, default: () => [] },
});

const page = usePage();

const searchQuery = ref('');

const filteredTemplates = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return props.templates;
    return props.templates.filter(t => t.name.toLowerCase().includes(q));
});

const modal = ref({
    show: false, title: '', message: '',
    confirmLabel: '', confirmClass: '', onConfirm: () => {},
});

function closeModal() { modal.value.show = false; }

function confirmDelete(tpl) {
    modal.value = {
        show:         true,
        title:        'Delete template?',
        message:      'This action cannot be undone. Documents created from this template are not affected.',
        confirmLabel: 'Delete',
        confirmClass: 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700',
        onConfirm: () => {
            closeModal();
            router.delete(route('templates.destroy', tpl.id), { preserveScroll: true });
        },
    };
}

function useTemplate(tpl) {
    if (tpl.pdf_missing) return;
    router.post(route('templates.use', tpl.id));
}

function duplicateTemplate(tpl) {
    router.post(route('templates.duplicate', tpl.id));
}

function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Templates</template>

        <!-- Page header -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Templates</h1>
                <p class="mt-1 text-sm text-gray-500">Reusable document layouts with pre-placed fields.</p>
            </div>
            <Link
                :href="route('templates.create')"
                class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                New Template
            </Link>
        </div>

        <!-- Flash error (e.g. pdf_missing redirected back) -->
        <div
            v-if="page.props.errors?.pdf"
            class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <p class="text-sm text-red-700">{{ page.props.errors.pdf }}</p>
        </div>

        <!-- Search -->
        <div v-if="templates.length > 0" class="mb-5">
            <div class="relative max-w-sm">
                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search templates…"
                    class="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                    v-if="searchQuery"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    @click="searchQuery = ''"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Empty state (no templates at all) -->
        <div
            v-if="templates.length === 0"
            class="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center"
        >
            <svg class="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
            </svg>
            <p class="text-base font-semibold text-gray-700">No templates yet</p>
            <p class="mt-1 text-sm text-gray-400">Upload a PDF and define reusable field positions.</p>
            <Link
                :href="route('templates.create')"
                class="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Create your first template
            </Link>
        </div>

        <!-- No search results -->
        <div
            v-else-if="filteredTemplates.length === 0"
            class="flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center"
        >
            <svg class="mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="text-sm font-semibold text-gray-600">No templates match "{{ searchQuery }}"</p>
            <button class="mt-3 text-xs text-blue-600 hover:underline" @click="searchQuery = ''">Clear search</button>
        </div>

        <!-- Template grid -->
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="tpl in filteredTemplates"
                :key="tpl.id"
                :class="[
                    'flex flex-col rounded-xl border bg-white shadow-sm transition',
                    tpl.pdf_missing
                        ? 'border-red-200 hover:border-red-300'
                        : 'border-gray-200 hover:border-blue-200 hover:shadow-md',
                ]"
            >
                <!-- Card top -->
                <div class="flex items-start gap-3 p-5">
                    <div
                        :class="[
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                            tpl.pdf_missing ? 'bg-red-50' : 'bg-blue-50',
                        ]"
                    >
                        <svg
                            :class="tpl.pdf_missing ? 'h-5 w-5 text-red-400' : 'h-5 w-5 text-blue-600'"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                        </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                        <Link
                            :href="route('templates.show', tpl.id)"
                            class="block truncate text-sm font-semibold text-gray-900 transition hover:text-blue-600"
                        >{{ tpl.name }}</Link>
                        <div class="mt-1 flex flex-wrap items-center gap-2">
                            <p class="text-xs text-gray-400">Updated {{ formatDate(tpl.updated_at) }}</p>
                            <!-- PDF missing badge -->
                            <span
                                v-if="tpl.pdf_missing"
                                class="inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-600"
                            >
                                <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                </svg>
                                PDF missing
                            </span>
                            <template v-else>
                                <span
                                    v-if="tpl.field_count > 0"
                                    class="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600"
                                >{{ tpl.field_count }} field{{ tpl.field_count !== 1 ? 's' : '' }}</span>
                                <span
                                    v-else
                                    class="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400"
                                >No fields</span>
                            </template>
                        </div>
                        <!-- PDF missing hint -->
                        <p v-if="tpl.pdf_missing" class="mt-1 text-[10px] text-red-500">
                            Open template to replace the missing PDF
                        </p>
                    </div>
                </div>

                <!-- Card actions -->
                <div class="mt-auto flex items-center gap-2 border-t border-gray-100 px-4 py-3">
                    <!-- Use button — disabled when PDF is missing -->
                    <button
                        :disabled="tpl.pdf_missing"
                        :class="[
                            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition',
                            tpl.pdf_missing
                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
                        ]"
                        :title="tpl.pdf_missing ? 'PDF file missing — open template to replace it' : 'Use this template'"
                        @click="useTemplate(tpl)"
                    >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        Use
                    </button>

                    <!-- View / fix link when PDF missing -->
                    <Link
                        v-if="tpl.pdf_missing"
                        :href="route('templates.show', tpl.id)"
                        class="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        title="Replace missing PDF"
                    >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                        Fix
                    </Link>

                    <template v-else>
                        <Link
                            :href="route('templates.edit', tpl.id)"
                            class="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                        >
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                            Edit
                        </Link>
                        <button
                            class="flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500"
                            title="Duplicate template"
                            @click="duplicateTemplate(tpl)"
                        >
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                        </button>
                    </template>

                    <button
                        class="flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        title="Delete template"
                        @click="confirmDelete(tpl)"
                    >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
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
