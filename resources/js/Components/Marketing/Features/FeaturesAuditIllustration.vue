<template>
    <div class="rounded-2xl border border-gray-200/80 bg-white p-1 shadow-xl shadow-amber-500/5 ring-1 ring-gray-100" aria-hidden="true">
        <div class="flex items-center justify-between rounded-t-xl border-b border-gray-100 bg-gray-50 px-3 py-2">
            <div class="flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-red-400" />
                <span class="h-2 w-2 rounded-full bg-amber-400" />
                <span class="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span class="text-[9px] font-semibold text-gray-500">Audit Trail</span>
        </div>
        <div class="p-4">
            <div class="mb-3 flex items-center justify-between">
                <p class="text-xs font-bold text-gray-900">Activity Timeline</p>
                <span class="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">6 events</span>
            </div>
            <div class="relative space-y-0">
                <div class="absolute bottom-2 left-[11px] top-2 w-0.5 bg-gradient-to-b from-emerald-300 via-blue-300 to-violet-300" />
                <div
                    v-for="(event, i) in events"
                    :key="event.label"
                    class="relative flex gap-3 pb-4 last:pb-0"
                >
                    <div
                        :class="[
                            'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 ring-white',
                            event.dot,
                        ]"
                    >
                        <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="event.icon" />
                        </svg>
                    </div>
                    <div class="min-w-0 flex-1 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
                        <div class="flex items-start justify-between gap-2">
                            <p class="text-[10px] font-semibold text-gray-900">{{ event.label }}</p>
                            <span class="shrink-0 text-[8px] text-gray-400">{{ event.time }}</span>
                        </div>
                        <p class="mt-0.5 text-[9px] text-gray-500">{{ event.detail }}</p>
                    </div>
                </div>
            </div>
            <div class="mt-3 flex items-center justify-between rounded-lg border border-dashed border-gray-200 bg-white px-3 py-2">
                <span class="text-[9px] text-gray-500">Download audit certificate</span>
                <svg class="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup>
const events = [
    { label: 'Completed', detail: 'All recipients signed the document', time: '2:14 PM', dot: 'bg-emerald-500', icon: 'M5 13l4 4L19 7' },
    { label: 'Signed', detail: 'Jordan Lee signed via secure link', time: '1:48 PM', dot: 'bg-blue-500', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { label: 'Viewed', detail: 'Alex Rivera opened the document', time: '11:22 AM', dot: 'bg-violet-500', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { label: 'Downloaded', detail: 'Signed PDF downloaded by sender', time: 'Yesterday', dot: 'bg-amber-500', icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' },
];
</script>
