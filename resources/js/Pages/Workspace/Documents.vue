<script setup>
import { Link } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    documents: {
        type: Array,
        default: () => [],
    },
});

function statusBadgeClass(status) {
    const map = {
        draft:    'bg-gray-100 text-gray-600',
        signed:   'bg-emerald-100 text-emerald-700',
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
        <template #header>My Documents</template>

        <!-- Page header -->
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">My Documents</h1>
                <p class="mt-1 text-sm text-gray-500">All your signed and in-progress documents.</p>
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

        <!-- Empty state -->
        <div
            v-if="documents.length === 0"
            class="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center"
        >
            <svg class="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-base font-semibold text-gray-700">No documents yet</p>
            <p class="mt-1 text-sm text-gray-400">Upload a PDF and sign it — it will appear here automatically.</p>
            <Link
                :href="route('sign.index')"
                class="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Sign your first document
            </Link>
        </div>

        <!-- Documents table -->
        <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 bg-white">
                    <tr
                        v-for="doc in documents"
                        :key="doc.id"
                        class="transition hover:bg-gray-50"
                    >
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <svg class="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span class="max-w-xs truncate text-sm font-medium text-gray-900">{{ doc.name }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span :class="statusBadgeClass(doc.status)">{{ doc.status }}</span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            {{ formatDate(doc.created_at) }}
                        </td>
                        <td class="px-6 py-4">
                            <button
                                v-if="doc.pdf_path"
                                class="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                disabled
                                title="Download coming soon"
                            >
                                Download
                            </button>
                            <span v-else class="text-xs text-gray-400">—</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </WorkspaceLayout>
</template>
