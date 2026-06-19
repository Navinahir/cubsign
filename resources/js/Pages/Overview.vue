<script setup>
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();
const firstName = computed(() => page.props.auth.user.name.split(' ')[0]);

const stats = [
    {
        label: 'Documents',
        count: 0,
        description: 'No documents uploaded yet',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        label: 'Signatures',
        count: 0,
        description: 'No signatures completed yet',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        color: 'bg-violet-50 text-violet-600',
    },
    {
        label: 'Templates',
        count: 0,
        description: 'No templates created yet',
        icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        label: 'Activities',
        count: 0,
        description: 'No recent activity',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
        color: 'bg-amber-50 text-amber-600',
    },
];
</script>

<template>
    <Head title="Overview" />

    <WorkspaceLayout>
        <template #header>
            <h1 class="text-base font-semibold text-gray-900">Overview</h1>
        </template>

        <!-- Welcome -->
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">
                Welcome back, {{ firstName }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
                Here's what's happening in your workspace.
            </p>
        </div>

        <!-- Stat cards -->
        <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div
                v-for="stat in stats"
                :key="stat.label"
                class="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
            >
                <div class="mb-4 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
                    <div :class="['flex h-9 w-9 items-center justify-center rounded-lg', stat.color]">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" :d="stat.icon" />
                        </svg>
                    </div>
                </div>
                <div class="text-3xl font-bold text-gray-900">{{ stat.count }}</div>
                <p class="mt-1 text-xs text-gray-400">{{ stat.description }}</p>
            </div>
        </div>

        <!-- Recent activity -->
        <div class="rounded-xl border border-gray-200 bg-white">
            <div class="border-b border-gray-100 px-5 py-4">
                <h3 class="text-sm font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <svg class="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p class="text-sm font-medium text-gray-700">No activity yet</p>
                <p class="mt-1 text-xs text-gray-400">
                    Activity will appear here once you start signing and sending documents.
                </p>
            </div>
        </div>
    </WorkspaceLayout>
</template>
