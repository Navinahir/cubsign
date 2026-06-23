<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
    recentDocuments: {
        type: Array,
        default: () => [],
    },
});

const user = computed(() => usePage().props.auth.user);
const firstName = computed(() => user.value?.name?.split(' ')[0] ?? 'there');

const statCards = computed(() => [
    {
        label: 'Total Documents',
        value: props.stats.total,
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        label: 'Signed Documents',
        value: props.stats.signed,
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        label: 'Completed Documents',
        value: props.stats.completed,
        icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
        color: 'text-sky-600',
        bg: 'bg-sky-50',
    },
]);

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
        <template #header>Overview</template>

        <!-- Welcome -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ firstName }}</h1>
            <p class="mt-1 text-sm text-gray-500">Here's what's happening with your documents.</p>
        </div>

        <!-- Stat cards -->
        <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <p class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
                    <p class="text-sm text-gray-500">{{ card.label }}</p>
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div class="mb-8">
            <Link
                :href="route('sign.index')"
                class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Sign a document
            </Link>
        </div>

        <!-- Recent documents -->
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 class="text-sm font-semibold text-gray-800">Recent Documents</h2>
                <Link
                    :href="route('documents.index')"
                    class="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                    View all
                </Link>
            </div>

            <!-- Empty state -->
            <div v-if="recentDocuments.length === 0" class="flex flex-col items-center py-12 text-center">
                <svg class="mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm font-medium text-gray-500">No documents yet</p>
                <p class="mt-1 text-xs text-gray-400">Upload a PDF and sign it to get started.</p>
                <Link
                    :href="route('sign.index')"
                    class="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    Sign your first document →
                </Link>
            </div>

            <!-- Document list -->
            <ul v-else class="divide-y divide-gray-50">
                <li
                    v-for="doc in recentDocuments"
                    :key="doc.id"
                    class="flex items-center gap-4 px-6 py-3.5"
                >
                    <svg class="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium text-gray-900">{{ doc.name }}</p>
                    </div>
                    <span :class="statusBadgeClass(doc.status)">{{ statusLabel(doc.status) }}</span>
                    <span class="shrink-0 text-xs text-gray-400">{{ formatDate(doc.created_at) }}</span>
                </li>
            </ul>
        </div>

    </WorkspaceLayout>
</template>
