<script setup>
const steps = [
    {
        label: 'Upload',
        description: 'Drop your PDF to get started',
        icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
        accent: 'bg-blue-50 text-blue-600 ring-blue-100',
    },
    {
        label: 'Add Signature',
        description: 'Draw, type, or upload your signature',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        accent: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    },
    {
        label: 'Download Signed PDF',
        description: 'Get your finished document instantly',
        icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
        accent: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    },
];
</script>

<template>
    <div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-7">
        <div class="space-y-0">
            <template v-for="(step, index) in steps" :key="step.label">
                <div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
                    <div :class="['flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1', step.accent]">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="step.icon" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">{{ step.label }}</p>
                        <p class="mt-0.5 text-xs text-gray-500">{{ step.description }}</p>
                    </div>
                </div>
                <div v-if="index < steps.length - 1" class="flex justify-center py-2" aria-hidden="true">
                    <svg class="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </template>
        </div>
    </div>
</template>
