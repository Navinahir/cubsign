<script setup>
const steps = [
    {
        label: 'Upload',
        description: 'Drop your PDF to get started',
        icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
        gradient: 'from-blue-500 to-blue-600',
        glow: 'shadow-blue-200/60',
    },
    {
        label: 'Add Signature',
        description: 'Draw, type, or upload your signature',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        gradient: 'from-indigo-500 to-violet-600',
        glow: 'shadow-indigo-200/60',
    },
    {
        label: 'Download Signed PDF',
        description: 'Get your finished document instantly',
        icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
        gradient: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-200/60',
    },
];
</script>

<template>
    <div class="relative mx-auto w-full max-w-sm">
        <div class="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-100/40 via-indigo-50/30 to-violet-100/40 blur-2xl" aria-hidden="true" />

        <div class="relative rounded-2xl border border-white/80 bg-white/90 p-7 shadow-2xl shadow-gray-200/60 backdrop-blur-sm sm:p-8">
            <div class="space-y-0">
                <template v-for="(step, index) in steps" :key="step.label">
                    <div class="marketing-card-lift flex items-center gap-4 rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 shadow-md ring-1 ring-gray-100/80">
                        <div :class="['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', step.gradient, step.glow]">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="step.icon" />
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-bold text-gray-900">{{ step.label }}</p>
                            <p class="mt-0.5 text-xs leading-relaxed text-gray-500">{{ step.description }}</p>
                        </div>
                    </div>
                    <div v-if="index < steps.length - 1" class="flex justify-center py-3" aria-hidden="true">
                        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 ring-1 ring-gray-200/80">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
