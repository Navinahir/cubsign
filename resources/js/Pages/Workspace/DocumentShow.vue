<script setup>
import { ref, computed } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    document: { type: Object, required: true },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusLabel(status) {
    const map = { draft: 'Draft', signed: 'Signed', archived: 'Completed' };
    return map[status] ?? status;
}

function statusBadgeClass(status) {
    const map = {
        draft:    'bg-gray-100 text-gray-600',
        signed:   'bg-emerald-100 text-emerald-700',
        archived: 'bg-blue-100 text-blue-700',
    };
    return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? map.draft}`;
}

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });
}

// ── Activity timeline ─────────────────────────────────────────────────────────
const timeline = computed(() => {
    const { status, created_at, updated_at } = props.document;
    if (status === 'draft') {
        return [
            { label: 'Uploaded',  at: created_at, done: true  },
            { label: 'Signed',    at: null,        done: false },
            { label: 'Completed', at: null,        done: false },
        ];
    }
    if (status === 'signed') {
        return [
            { label: 'Uploaded',  at: created_at, done: true  },
            { label: 'Signed',    at: updated_at, done: true  },
            { label: 'Completed', at: null,        done: false },
        ];
    }
    // archived / completed
    return [
        { label: 'Uploaded',  at: created_at, done: true },
        { label: 'Signed',    at: null,        done: true },
        { label: 'Completed', at: updated_at, done: true },
    ];
});

// ── Confirmation modal ────────────────────────────────────────────────────────
const modal = ref({
    show: false, title: '', message: '',
    confirmLabel: '', confirmClass: '', onConfirm: () => {},
});

function closeModal() { modal.value.show = false; }

function confirmDelete() {
    modal.value = {
        show:         true,
        title:        'Delete document?',
        message:      'This action cannot be undone.',
        confirmLabel: 'Delete',
        confirmClass: 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700',
        onConfirm: () => {
            closeModal();
            router.delete(route('documents.destroy', props.document.id), {
                onSuccess: () => router.visit(route('documents.index')),
            });
        },
    };
}

function confirmArchive() {
    modal.value = {
        show:         true,
        title:        'Mark document as completed?',
        message:      'This document will move to completed status.',
        confirmLabel: 'Continue',
        confirmClass: 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700',
        onConfirm: () => {
            closeModal();
            router.patch(route('documents.archive', props.document.id));
        },
    };
}

function openDraft() {
    router.post(route('documents.open', props.document.id));
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>Document Details</template>

        <!-- Back navigation -->
        <div class="mb-6">
            <Link
                :href="route('documents.index')"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                My Documents
            </Link>
        </div>

        <!-- Document header -->
        <div class="mb-6 flex flex-wrap items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </div>
            <div class="min-w-0 flex-1">
                <h1 class="truncate text-2xl font-bold text-gray-900">{{ document.name }}</h1>
                <div class="mt-1.5 flex flex-wrap items-center gap-3">
                    <span :class="statusBadgeClass(document.status)">{{ statusLabel(document.status) }}</span>
                    <span class="text-xs text-gray-400">Created {{ formatDate(document.created_at) }}</span>
                    <span class="text-xs text-gray-400">Updated {{ formatDate(document.updated_at) }}</span>
                </div>
            </div>
        </div>

        <!-- Two-column layout -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

            <!-- Left: info + timeline -->
            <div class="space-y-6 lg:col-span-2">

                <!-- Document information card -->
                <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-sm font-semibold text-gray-800">Document information</h2>
                    </div>
                    <dl class="divide-y divide-gray-50 px-6">
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Name</dt>
                            <dd class="min-w-0 truncate text-sm font-medium text-gray-900">{{ document.name }}</dd>
                        </div>
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Status</dt>
                            <dd><span :class="statusBadgeClass(document.status)">{{ statusLabel(document.status) }}</span></dd>
                        </div>
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Created</dt>
                            <dd class="text-sm text-gray-700">{{ formatDateTime(document.created_at) }}</dd>
                        </div>
                        <div class="flex items-center py-3.5">
                            <dt class="w-36 shrink-0 text-sm text-gray-500">Last updated</dt>
                            <dd class="text-sm text-gray-700">{{ formatDateTime(document.updated_at) }}</dd>
                        </div>
                    </dl>
                </div>

                <!-- Activity timeline card -->
                <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-sm font-semibold text-gray-800">Activity</h2>
                    </div>
                    <ul class="px-6 py-5">
                        <li
                            v-for="(event, i) in timeline"
                            :key="event.label"
                            class="flex gap-4"
                            :class="i < timeline.length - 1 ? 'pb-6' : ''"
                        >
                            <!-- Icon + vertical connector -->
                            <div class="flex flex-col items-center">
                                <div
                                    :class="[
                                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                                        event.done ? 'bg-blue-100' : 'bg-gray-100',
                                    ]"
                                >
                                    <svg
                                        v-if="event.done"
                                        class="h-3.5 w-3.5 text-blue-600"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <div v-else class="h-2 w-2 rounded-full bg-gray-300"/>
                                </div>
                                <div
                                    v-if="i < timeline.length - 1"
                                    class="mt-1.5 w-px flex-1 bg-gray-100"
                                />
                            </div>
                            <!-- Label + timestamp -->
                            <div class="pb-1 pt-0.5">
                                <p :class="['text-sm font-medium', event.done ? 'text-gray-900' : 'text-gray-400']">
                                    {{ event.label }}
                                </p>
                                <p v-if="event.at" class="mt-0.5 text-xs text-gray-400">
                                    {{ formatDateTime(event.at) }}
                                </p>
                                <p v-else-if="!event.done" class="mt-0.5 text-xs text-gray-300">
                                    Pending
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>

            <!-- Right: actions card -->
            <div>
                <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-sm font-semibold text-gray-800">Actions</h2>
                    </div>
                    <div class="space-y-1 p-3">

                        <!-- Continue editing — draft only -->
                        <button
                            v-if="document.status === 'draft'"
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                            @click="openDraft"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Continue editing
                        </button>

                        <!-- Download — signed and completed only -->
                        <a
                            v-if="document.status !== 'draft'"
                            :href="route('documents.download', document.id)"
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-700"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Download
                        </a>

                        <!-- Mark as completed — signed only -->
                        <button
                            v-if="document.status === 'signed'"
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-amber-600"
                            @click="confirmArchive"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                            </svg>
                            Mark as completed
                        </button>

                        <div class="my-1 border-t border-gray-100"/>

                        <!-- Delete — always -->
                        <button
                            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            @click="confirmDelete"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete document
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
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            :class="modal.confirmClass"
                            @click="modal.onConfirm()"
                        >
                            {{ modal.confirmLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

    </WorkspaceLayout>
</template>
