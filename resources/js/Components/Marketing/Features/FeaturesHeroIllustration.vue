<template>
    <div class="relative mx-auto w-full max-w-md lg:max-w-lg" aria-hidden="true">
        <div class="rounded-2xl border border-gray-200/80 bg-white p-1 shadow-xl shadow-blue-500/10 ring-1 ring-gray-100">
            <div class="flex items-center gap-1.5 rounded-t-xl border-b border-gray-100 bg-gray-50 px-3 py-2">
                <span class="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span class="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span class="ml-2 flex-1 rounded-md bg-white px-2 py-0.5 text-[9px] text-gray-400">app.cubsign.com</span>
            </div>

            <div class="flex min-h-[220px] bg-gray-50">
                <div class="hidden w-14 shrink-0 border-r border-gray-200 bg-white p-2 sm:block">
                    <div v-for="(item, i) in nav" :key="item.label" :class="['mb-1.5 flex flex-col items-center rounded-lg p-1.5', i === 0 ? 'bg-blue-50' : '']">
                        <svg :class="['h-3.5 w-3.5', i === 0 ? 'text-blue-600' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" />
                        </svg>
                        <span :class="['mt-0.5 text-[6px] font-medium', i === 0 ? 'text-blue-600' : 'text-gray-400']">{{ item.label }}</span>
                    </div>
                </div>

                <div class="min-w-0 flex-1 p-3">
                    <div class="mb-2 flex items-center justify-between">
                        <p class="text-[10px] font-bold text-gray-900">My Documents</p>
                        <span class="rounded-md bg-blue-600 px-2 py-0.5 text-[8px] font-semibold text-white">+ Upload</span>
                    </div>

                    <div class="grid gap-2 sm:grid-cols-2">
                        <div class="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                            <div class="mb-1.5 flex items-center gap-1.5">
                                <div class="h-5 w-5 rounded bg-red-50 flex items-center justify-center">
                                    <svg class="h-2.5 w-2.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <p class="truncate text-[8px] font-semibold text-gray-900">Contract.pdf</p>
                            </div>
                            <div class="inline-flex rounded border border-dashed border-blue-300 bg-blue-50/60 px-2 py-1">
                                <svg viewBox="0 0 80 20" class="h-3 w-12"><path d="M2,16 C12,2 24,18 38,8" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round"/></svg>
                            </div>
                        </div>

                        <div class="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                            <p class="mb-1.5 text-[8px] font-semibold text-gray-900">Recipients</p>
                            <div v-for="r in [{n:'Alex',s:'Signed'},{n:'Jordan',s:'Pending'}]" :key="r.n" class="mb-1 flex items-center justify-between text-[7px]">
                                <span class="text-gray-700">{{ r.n }}</span>
                                <span :class="r.s==='Signed'?'text-emerald-600':'text-amber-600'">{{ r.s }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-2 rounded-lg border border-gray-200 bg-white p-2">
                        <p class="mb-1 text-[8px] font-semibold text-gray-900">Recent Activity</p>
                        <div v-for="e in activity" :key="e" class="flex items-center gap-1 text-[7px] text-gray-500">
                            <span class="h-1 w-1 rounded-full bg-blue-400" />
                            {{ e }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute -right-2 top-6 z-20 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 shadow-md sm:-right-4">
            <p class="text-[9px] font-bold text-emerald-700">Signed</p>
        </div>
        <div class="absolute -left-2 bottom-8 z-20 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 shadow-md sm:-left-4">
            <p class="text-[9px] font-bold text-gray-800">3 templates saved</p>
        </div>
    </div>
</template>

<script setup>
const nav = [
    { label: 'Docs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Sign', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { label: 'Send', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Audit', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const activity = ['Jordan viewed Contract.pdf', 'Alex signed NDA.pdf', 'Template reused'];
</script>
