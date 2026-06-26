<script setup>
import { computed } from 'vue';
import ProductBrowserFrame from '@/Components/Marketing/ProductBrowserFrame.vue';

const props = defineProps({
    variant: {
        type: String,
        required: true,
        validator: (v) => ['dashboard', 'editor', 'signature', 'request', 'review', 'complete', 'mobile'].includes(v),
    },
    url: { type: String, default: '' },
    size: { type: String, default: 'default' },
});

const isCompact = computed(() => props.size === 'compact');

const dashboardDocs = computed(() => {
    const docs = [
        { n: 'Service Agreement.pdf', s: 'Completed', c: 'emerald' },
        { n: 'NDA - Client.pdf', s: 'Pending', c: 'amber' },
        { n: 'Offer Letter.pdf', s: 'Draft', c: 'gray' },
    ];
    return isCompact.value ? docs.slice(0, 2) : docs;
});

const urls = {
    dashboard: 'app.cubsign.com/documents',
    editor: 'app.cubsign.com/sign/editor',
    signature: 'app.cubsign.com/sign/editor',
    request: 'app.cubsign.com/sign/editor',
    review: 'app.cubsign.com/sign/review',
    complete: 'app.cubsign.com/sign/complete',
    mobile: 'app.cubsign.com/sign',
};
</script>

<template>
    <ProductBrowserFrame :url="url || urls[variant]" :size="size">
        <!-- Dashboard -->
        <div v-if="variant === 'dashboard'" :class="isCompact ? 'bg-gray-50 p-2' : 'bg-gray-50 p-4'">
            <div :class="isCompact ? 'mb-2 flex items-center justify-between' : 'mb-3 flex items-center justify-between'">
                <div>
                    <p :class="isCompact ? 'text-[11px] font-bold text-gray-900' : 'text-sm font-bold text-gray-900'">My Documents</p>
                    <p class="text-[9px] text-gray-400">{{ isCompact ? '8 documents' : '12 documents' }}</p>
                </div>
                <span :class="isCompact ? 'rounded-md bg-blue-600 px-2 py-0.5 text-[8px] font-semibold text-white' : 'rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white'">+ Upload</span>
            </div>
            <div :class="isCompact ? 'space-y-1.5' : 'space-y-2'">
                <div v-for="(doc, i) in dashboardDocs" :key="i" :class="['flex items-center gap-2 rounded-lg border border-gray-200 bg-white', isCompact ? 'p-2' : 'gap-3 rounded-xl p-3']">
                    <div :class="['flex shrink-0 items-center justify-center rounded-lg bg-red-50', isCompact ? 'h-7 w-7' : 'h-9 w-9']">
                        <svg :class="isCompact ? 'h-3 w-3 text-red-500' : 'h-4 w-4 text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-[10px] font-semibold text-gray-900">{{ doc.n }}</p>
                        <p v-if="!isCompact" class="text-[10px] text-gray-400">Updated 2h ago</p>
                    </div>
                    <span :class="['rounded-full font-bold', isCompact ? 'px-1.5 py-0.5 text-[8px]' : 'px-2 py-0.5 text-[9px]', doc.c==='emerald'?'bg-emerald-50 text-emerald-700':doc.c==='amber'?'bg-amber-50 text-amber-700':'bg-gray-100 text-gray-500']">{{ doc.s }}</span>
                </div>
            </div>
        </div>

        <!-- Editor -->
        <div v-else-if="variant === 'editor'" class="flex bg-gray-100">
            <div class="w-16 shrink-0 border-r border-gray-200 bg-white p-2">
                <div class="mb-2 h-6 rounded bg-blue-100" />
                <div v-for="n in 4" :key="n" class="mb-1.5 h-5 rounded bg-gray-100" />
            </div>
            <div class="min-w-0 flex-1 p-3">
                <div class="mb-2 flex gap-1">
                    <span v-for="n in 3" :key="n" class="h-1.5 flex-1 rounded-full bg-gray-300" />
                </div>
                <div class="rounded-lg bg-white p-3 shadow-sm">
                    <div class="space-y-1.5">
                        <div v-for="w in ['w-full','w-11/12','w-full','w-4/5']" :key="w" :class="['h-1.5 rounded-full bg-gray-200',w]" />
                    </div>
                    <div class="mt-3 inline-flex rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/60 px-3 py-2 ring-2 ring-blue-100">
                        <svg viewBox="0 0 120 30" class="h-5 w-20" aria-hidden="true"><path d="M4,22 C15,2 30,28 44,14 C56,2 66,24 82,14" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                </div>
            </div>
            <div class="hidden w-24 shrink-0 border-l border-gray-200 bg-white p-2 sm:block">
                <p class="mb-2 text-[8px] font-bold uppercase text-gray-400">Fields</p>
                <div v-for="c in ['Sign','Date','Text']" :key="c" class="mb-1 rounded bg-gray-50 px-1.5 py-1 text-[8px] text-gray-600">{{ c }}</div>
            </div>
        </div>

        <!-- Signature creation -->
        <div v-else-if="variant === 'signature'" :class="isCompact ? 'p-2' : 'p-4'">
            <p :class="isCompact ? 'mb-2 text-[10px] font-semibold text-gray-900' : 'mb-3 text-xs font-semibold text-gray-900'">Create Your Signature</p>
            <div :class="isCompact ? 'mb-2 flex gap-0.5 rounded-md bg-gray-100 p-0.5' : 'mb-3 flex gap-1 rounded-lg bg-gray-100 p-0.5'">
                <span class="flex-1 rounded-md bg-white py-0.5 text-center text-[9px] font-semibold shadow-sm sm:py-1 sm:text-[10px]">Draw</span>
                <span class="flex-1 py-0.5 text-center text-[9px] text-gray-500 sm:py-1 sm:text-[10px]">Type</span>
                <span v-if="!isCompact" class="flex-1 py-1 text-center text-[10px] text-gray-500">Upload</span>
            </div>
            <div :class="['marketing-signature-draw rounded-lg border border-dashed border-blue-300 bg-blue-50/30', isCompact ? 'h-14 px-2 py-2' : 'h-24 rounded-xl px-4 py-3']">
                <svg viewBox="0 0 220 55" class="h-full w-full" aria-hidden="true">
                    <path class="marketing-signature-path" d="M8,44 C28,4 50,60 76,28 C96,4 114,52 142,28 C160,14 174,38 215,22" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />
                </svg>
            </div>
            <div v-if="!isCompact" class="mt-3 flex gap-2">
                <span class="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white">Save Signature</span>
                <span class="rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] text-gray-600">Clear</span>
            </div>
        </div>

        <!-- Request signatures -->
        <div v-else-if="variant === 'request'" class="p-4">
            <p class="mb-3 text-xs font-semibold text-gray-900">Add Recipients</p>
            <div class="space-y-2">
                <div v-for="r in [{e:'alex@company.com',s:'Signed'},{e:'jordan@client.io',s:'Pending'}]" :key="r.e" class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">{{ r.e[0].toUpperCase() }}</div>
                    <div class="min-w-0 flex-1"><p class="truncate text-[10px] font-medium text-gray-900">{{ r.e }}</p></div>
                    <span :class="['text-[9px] font-bold', r.s==='Signed'?'text-emerald-600':'text-amber-600']">{{ r.s }}</span>
                </div>
            </div>
            <div class="mt-3 rounded-lg border border-dashed border-gray-300 py-2 text-center text-[10px] text-gray-400">+ Add recipient</div>
        </div>

        <!-- Review -->
        <div v-else-if="variant === 'review'" class="p-4">
            <p class="mb-3 text-xs font-semibold text-gray-900">Review Before Sending</p>
            <div class="rounded-xl border border-gray-200 bg-white p-3">
                <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div class="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center"><svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
                    <div><p class="text-[10px] font-semibold text-gray-900">Contract.pdf</p><p class="text-[9px] text-gray-400">2 recipients · 3 fields</p></div>
                </div>
                <div class="mt-2 space-y-1"><div v-for="n in 3" :key="n" class="flex items-center gap-2 text-[9px] text-gray-600"><svg class="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Field placed</div></div>
            </div>
            <span class="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-semibold text-white">Send for Signature</span>
        </div>

        <!-- Complete -->
        <div v-else-if="variant === 'complete'" :class="isCompact ? 'p-3 text-center' : 'p-6 text-center'">
            <div :class="['mx-auto flex items-center justify-center rounded-full bg-emerald-100', isCompact ? 'h-10 w-10' : 'h-14 w-14']">
                <svg :class="isCompact ? 'h-5 w-5 text-emerald-600' : 'h-7 w-7 text-emerald-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p :class="isCompact ? 'mt-2 text-xs font-bold text-gray-900' : 'mt-3 text-sm font-bold text-gray-900'">Document Signed!</p>
            <p class="mt-0.5 text-[9px] text-gray-500">Your signed PDF is ready</p>
            <div :class="['inline-flex items-center gap-1.5 rounded-lg bg-blue-600 font-semibold text-white', isCompact ? 'mt-2 px-3 py-1 text-[9px]' : 'mt-4 gap-2 rounded-xl px-4 py-2 text-[10px]']">
                <svg :class="isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
                Download PDF
            </div>
        </div>

        <!-- Mobile -->
        <div v-else-if="variant === 'mobile'" class="mx-auto max-w-[200px] p-3">
            <div class="overflow-hidden rounded-[20px] border-4 border-gray-800 bg-white shadow-xl">
                <div class="h-4 bg-gray-800" />
                <div class="p-3">
                    <p class="text-[10px] font-bold text-gray-900">Sign on mobile</p>
                    <div class="mt-2 h-20 rounded-lg border border-dashed border-blue-300 bg-blue-50/40 p-2">
                        <svg viewBox="0 0 120 30" class="h-6 w-full" aria-hidden="true"><path d="M4,22 C15,2 30,28 44,14" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                    <div class="mt-2 rounded-lg bg-blue-600 py-1.5 text-center text-[9px] font-semibold text-white">Sign & Download</div>
                </div>
                <div class="mx-auto mb-1 h-1 w-16 rounded-full bg-gray-800" />
            </div>
        </div>
    </ProductBrowserFrame>
</template>
