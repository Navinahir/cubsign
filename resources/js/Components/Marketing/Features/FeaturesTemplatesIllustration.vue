<template>
    <div class="rounded-2xl border border-gray-200/80 bg-white p-1 shadow-xl shadow-violet-500/5 ring-1 ring-gray-100" aria-hidden="true">
        <div class="flex items-center gap-1.5 rounded-t-xl border-b border-gray-100 bg-gray-50 px-3 py-2">
            <span class="h-2 w-2 rounded-full bg-red-400" />
            <span class="h-2 w-2 rounded-full bg-amber-400" />
            <span class="h-2 w-2 rounded-full bg-emerald-400" />
            <span class="ml-2 text-[9px] text-gray-400">Templates</span>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-5">
            <div class="space-y-2 sm:col-span-2">
                <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Saved Templates</p>
                <div
                    v-for="(t, i) in templates"
                    :key="t.name"
                    :class="[
                        'flex items-center gap-2 rounded-lg border p-2.5 transition-colors',
                        i === 0 ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-white',
                    ]"
                >
                    <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', t.bg]">
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <p class="truncate text-[10px] font-semibold text-gray-900">{{ t.name }}</p>
                        <p class="text-[8px] text-gray-400">{{ t.fields }} fields</p>
                    </div>
                </div>
            </div>
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:col-span-3">
                <p class="mb-2 text-[10px] font-semibold text-gray-900">Preview — NDA Template</p>
                <div class="rounded-lg bg-white p-3 shadow-sm">
                    <div class="space-y-1.5">
                        <div v-for="w in ['w-full', 'w-11/12', 'w-full', 'w-3/4']" :key="w" :class="['h-1.5 rounded-full bg-gray-100', w]" />
                    </div>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                        <div class="rounded border border-dashed border-blue-300 bg-blue-50/50 px-2 py-1.5 text-center text-[8px] font-medium text-blue-600">Signature</div>
                        <div class="rounded border border-dashed border-gray-300 bg-gray-50 px-2 py-1.5 text-center text-[8px] font-medium text-gray-500">Date</div>
                    </div>
                </div>
                <div class="mt-3 flex gap-2">
                    <span class="rounded-lg bg-emerald-600 px-3 py-1.5 text-[9px] font-semibold text-white">Use Template</span>
                    <span class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[9px] text-gray-600">Edit</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const templates = [
    { name: 'NDA Template', fields: 4, bg: 'bg-emerald-500' },
    { name: 'Offer Letter', fields: 3, bg: 'bg-blue-500' },
    { name: 'Contract Form', fields: 6, bg: 'bg-violet-500' },
];
</script>
