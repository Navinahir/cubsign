<template>
    <div class="rounded-xl border border-gray-200/80 bg-white p-1 shadow-lg ring-1 ring-gray-100" aria-hidden="true">
        <div class="flex items-center justify-between rounded-t-lg border-b border-gray-100 bg-gray-50 px-3 py-2">
            <div class="flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-red-400" />
                <span class="h-2 w-2 rounded-full bg-amber-400" />
                <span class="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span class="text-[9px] font-semibold text-gray-500">Documents</span>
        </div>
        <div class="p-3">
            <div class="mb-2 flex gap-1.5">
                <span
                    v-for="tab in ['All', 'Pending', 'Done']"
                    :key="tab"
                    :class="[
                        'rounded-md px-2 py-0.5 text-[8px] font-semibold',
                        tab === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500',
                    ]"
                >{{ tab }}</span>
            </div>
            <div class="space-y-1.5">
                <div
                    v-for="doc in docs"
                    :key="doc.name"
                    class="flex items-center gap-2 rounded-lg border border-gray-100 bg-white p-2"
                >
                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-50">
                        <svg class="h-3.5 w-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-[9px] font-semibold text-gray-900">{{ doc.name }}</p>
                        <p class="text-[7px] text-gray-400">{{ doc.recipients }} recipients</p>
                    </div>
                    <span :class="['shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-bold', doc.badge]">{{ doc.status }}</span>
                </div>
            </div>
            <div class="mt-3 flex items-center justify-between rounded-lg bg-blue-50 px-2.5 py-1.5">
                <span class="text-[8px] text-blue-700">2 pending signatures</span>
                <svg class="h-3 w-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup>
const docs = [
    { name: 'Service Agreement.pdf', recipients: 2, status: 'Signed', badge: 'bg-emerald-50 text-emerald-700' },
    { name: 'Vendor Contract.pdf', recipients: 3, status: 'Pending', badge: 'bg-amber-50 text-amber-700' },
    { name: 'NDA - Client.pdf', recipients: 1, status: 'Viewed', badge: 'bg-violet-50 text-violet-700' },
];
</script>
