<template>
    <div class="rounded-xl border border-gray-200/80 bg-white p-1 shadow-lg ring-1 ring-gray-100" aria-hidden="true">
        <div class="flex items-center gap-1.5 rounded-t-lg border-b border-gray-100 bg-gray-50 px-3 py-2">
            <span class="h-2 w-2 rounded-full bg-red-400" />
            <span class="h-2 w-2 rounded-full bg-amber-400" />
            <span class="h-2 w-2 rounded-full bg-emerald-400" />
            <span class="ml-2 text-[9px] text-gray-400">Secure Storage</span>
        </div>
        <div class="p-4">
            <div class="flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6">
                <div class="relative">
                    <svg class="h-24 w-24 text-blue-200" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M50 10 L90 30 V55 C90 75 72 92 50 95 C28 92 10 75 10 55 V30 Z" opacity="0.5" />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-2">
                <div v-for="f in files" :key="f" class="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                    <svg class="mx-auto h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="mt-1 truncate text-[7px] font-medium text-gray-600">{{ f }}</p>
                </div>
            </div>
            <p class="mt-3 text-center text-[9px] font-medium text-emerald-600">Encrypted at rest</p>
        </div>
    </div>
</template>

<script setup>
const files = ['NDA.pdf', 'Contract.pdf', 'Offer.pdf'];
</script>
