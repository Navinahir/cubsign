<script setup>
import { ref, watch, nextTick } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    documents: { type: Object, required: true },
    filters:   { type: Object, default: () => ({ search: '', status: '', sort: 'newest' }) },
});

// ── Filter state ──────────────────────────────────────────────────────────────
const search       = ref(props.filters.search  ?? '');
const statusFilter = ref(props.filters.status  ?? '');
const sort         = ref(props.filters.sort    ?? 'newest');

let searchTimer;
watch(search, () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => applyFilters(), 300);
});
watch([statusFilter, sort], () => applyFilters());

function applyFilters() {
    router.get(
        route('documents.index'),
        {
            ...(search.value            ? { search: search.value }       : {}),
            ...(statusFilter.value      ? { status: statusFilter.value } : {}),
            ...(sort.value !== 'newest' ? { sort: sort.value }           : {}),
        },
        { preserveState: true, replace: true },
    );
}

const hasActiveFilter = () => !!(search.value || statusFilter.value);

// ── Inline rename ─────────────────────────────────────────────────────────────
const editingId   = ref(null);
const editingName = ref('');
const editInput   = ref(null);

function startEdit(doc) {
    editingId.value   = doc.id;
    editingName.value = doc.name;
    nextTick(() => editInput.value?.focus());
}

function cancelEdit() {
    editingId.value   = null;
    editingName.value = '';
}

function saveRename(doc) {
    const name = editingName.value.trim();
    if (!name || name === doc.name) { cancelEdit(); return; }
    router.patch(
        route('documents.rename', doc.id),
        { name },
        { preserveScroll: true, onSuccess: () => cancelEdit() },
    );
}

// ── Confirmation modal ────────────────────────────────────────────────────────
const modal = ref({
    show:         false,
    title:        '',
    message:      '',
    confirmLabel: '',
    confirmClass: '',
    onConfirm:    () => {},
});

function closeModal() { modal.value.show = false; }

function confirmDelete(doc) {
    modal.value = {
        show:         true,
        title:        'Delete document?',
        message:      'This action cannot be undone.',
        confirmLabel: 'Delete',
        confirmClass: 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700',
        onConfirm: () => {
            closeModal();
            router.delete(route('documents.destroy', doc.id), { preserveScroll: true });
        },
    };
}

function confirmArchive(doc) {
    modal.value = {
        show:         true,
        title:        'Mark document as completed?',
        message:      'This document will move to completed status.',
        confirmLabel: 'Continue',
        confirmClass: 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700',
        onConfirm: () => {
            closeModal();
            router.patch(route('documents.archive', doc.id), {}, { preserveScroll: true });
        },
    };
}

function openDraft(doc) {
    router.post(route('documents.open', doc.id), {}, { preserveScroll: true });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { value: '',         label: 'All statuses' },
    { value: 'signed',   label: 'Signed'       },
    { value: 'archived', label: 'Completed'    },
    { value: 'draft',    label: 'Draft'        },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'az',     label: 'Name A → Z'   },
    { value: 'za',     label: 'Name Z → A'   },
];

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
    return `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? map.draft}`;
}

function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>My Documents</template>

        <!-- ── Page header ── -->
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">My Documents</h1>
                <p class="mt-1 text-sm text-gray-500">
                    {{ documents.total }}
                    {{ documents.total === 1 ? 'document' : 'documents' }}
                    in your account
                </p>
            </div>
            <Link
                :href="route('sign.index')"
                class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Sign a document
            </Link>
        </div>

        <!-- ── Filters bar ── -->
        <div class="mb-4 flex flex-wrap items-center gap-3">
            <!-- Search -->
            <div class="relative flex-1 min-w-[200px] max-w-sm">
                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search by name…"
                    class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                    v-if="search"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    @click="search = ''"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Status filter -->
            <select
                v-model="statusFilter"
                class="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>

            <!-- Sort -->
            <select
                v-model="sort"
                class="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>
        </div>

        <!-- ── Empty state — no documents at all ── -->
        <div
            v-if="documents.total === 0 && !hasActiveFilter()"
            class="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center"
        >
            <svg class="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-base font-semibold text-gray-700">No documents yet</p>
            <p class="mt-1 text-sm text-gray-400">Upload and sign your first document.</p>
            <Link
                :href="route('sign.index')"
                class="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Sign a document
            </Link>
        </div>

        <!-- ── Empty state — search/filter returned nothing ── -->
        <div
            v-else-if="documents.data.length === 0"
            class="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center"
        >
            <svg class="mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="text-sm font-semibold text-gray-600">No matching documents</p>
            <p class="mt-1 text-sm text-gray-400">Try changing your filters or search term.</p>
            <button
                class="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                @click="search = ''; statusFilter = ''"
            >
                Clear filters
            </button>
        </div>

        <!-- ── Documents table ── -->
        <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                        <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 bg-white">
                    <tr
                        v-for="doc in documents.data"
                        :key="doc.id"
                        class="group transition hover:bg-gray-50"
                    >
                        <!-- Name -->
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <svg class="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>

                                <!-- Editing inline -->
                                <input
                                    v-if="editingId === doc.id"
                                    ref="editInput"
                                    v-model="editingName"
                                    class="w-full max-w-xs rounded border border-blue-400 px-2 py-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @blur="saveRename(doc)"
                                    @keyup.enter="saveRename(doc)"
                                    @keyup.escape="cancelEdit"
                                />
                                <!-- Display -->
                                <Link
                                    v-else
                                    :href="route('documents.show', doc.id)"
                                    class="max-w-xs truncate text-sm font-medium text-gray-900 transition hover:text-blue-600"
                                    :title="doc.name"
                                >
                                    {{ doc.name }}
                                </Link>
                            </div>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4">
                            <span :class="statusBadgeClass(doc.status)">{{ statusLabel(doc.status) }}</span>
                        </td>

                        <!-- Date -->
                        <td class="px-6 py-4 text-sm text-gray-500">
                            {{ formatDate(doc.created_at) }}
                        </td>

                        <!-- Actions -->
                        <td class="px-6 py-4">
                            <div class="flex items-center justify-end gap-2">

                                <!-- Rename -->
                                <button
                                    class="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                    title="Rename"
                                    @click.stop="startEdit(doc)"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                    </svg>
                                </button>

                                <!-- Continue editing — draft only -->
                                <button
                                    v-if="doc.status === 'draft'"
                                    class="rounded p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                                    title="Continue editing"
                                    @click="openDraft(doc)"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </button>

                                <!-- Download — signed and completed only -->
                                <a
                                    v-if="doc.status !== 'draft'"
                                    :href="route('documents.download', doc.id)"
                                    class="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                                    title="Download"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                    </svg>
                                </a>

                                <!-- Mark as completed — signed only -->
                                <button
                                    v-if="doc.status === 'signed'"
                                    class="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-amber-600"
                                    title="Mark as completed"
                                    @click="confirmArchive(doc)"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                                    </svg>
                                </button>

                                <!-- Delete — always visible -->
                                <button
                                    class="rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                    title="Delete document"
                                    @click="confirmDelete(doc)"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>

                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- ── Pagination footer ── -->
            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                <p class="text-xs text-gray-500">
                    Showing
                    <span class="font-medium text-gray-700">{{ documents.from }}–{{ documents.to }}</span>
                    of
                    <span class="font-medium text-gray-700">{{ documents.total }}</span>
                    documents
                </p>

                <div class="flex items-center gap-1">
                    <template v-for="link in documents.links" :key="link.label">
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

        <!-- ── Confirmation modal ── -->
        <Teleport to="body">
            <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40" @click="closeModal" />
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
