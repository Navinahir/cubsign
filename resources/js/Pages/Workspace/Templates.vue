<script setup>
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';
</script>

<template>
    <WorkspaceLayout>
        <template #header>Templates</template>

        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Templates</h1>
            <p class="mt-1 text-sm text-gray-500">Reusable document templates for your signing workflows.</p>
        </div>

        <div class="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <svg class="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <p class="text-base font-semibold text-gray-700">Templates coming soon</p>
            <p class="mt-1 max-w-sm text-sm text-gray-400">
                Save frequently used documents as templates so you can sign them again in seconds.
            </p>
            <span class="mt-5 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                In development
            </span>
        </div>

    </WorkspaceLayout>
</template>
