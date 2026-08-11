<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Link } from '@inertiajs/vue3';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { createPdfRenderer } from '@/utils/pdfPageRenderer';
import { hydrateTemplateFields } from '@/Components/Editor/templateFieldHelpers';
import TemplateFieldPlaceholder from '@/Components/Editor/TemplateFieldPlaceholder.vue';

const { getDocument, GlobalWorkerOptions } = pdfjsLib;
GlobalWorkerOptions.workerSrc = workerUrl;

const pdfRenderer = createPdfRenderer();

const props = defineProps({
    template: { type: Object, required: true },
});

let pdfDoc = null;
const numPages = ref(0);
const pageDims = ref([]);
let pageCanvases = [];
let thumbCanvases = [];
let renderedPageKeys = new Set();
let intersectionObs = null;

const activePage = ref(1);
const scale = ref(1.3);
const isLoading = ref(true);
const loadError = ref(null);
const centerRef = ref(null);
const thumbStripRef = ref(null);
const placedFields = ref([]);

const zoomSelect = computed({
    get: () => {
        const found = [0.5, 0.75, 1.0, 1.25, 1.5].find((p) => Math.abs(scale.value - p) < 0.01);
        return found !== undefined ? String(found) : 'custom';
    },
    set: (val) => {
        if (val === 'fit') { fitWidth(); return; }
        if (val === 'custom') return;
        scale.value = parseFloat(val);
        rerenderVisible();
    },
});

function pageRenderKey(pageNum) {
    return `${pageNum}@${scale.value.toFixed(2)}`;
}

async function ensurePageRendered(pageNum) {
    const key = pageRenderKey(pageNum);
    if (renderedPageKeys.has(key) || !pdfDoc) return;
    const canvas = await pdfRenderer.waitForCanvas((idx) => pageCanvases[idx], pageNum - 1, { label: 'preview-main' });
    if (!canvas) return;
    const result = await pdfRenderer.renderToCanvas(pdfDoc, pageNum, canvas, scale.value, `preview-page-${pageNum}`);
    if (result) {
        pageDims.value[pageNum - 1] = { w: result.width, h: result.height };
        renderedPageKeys.add(key);
    }
}

function getVisiblePageNumbers() {
    const pages = new Set([activePage.value]);
    centerRef.value?.querySelectorAll('.page-wrapper').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const root = centerRef.value.getBoundingClientRect();
        if (rect.bottom > root.top && rect.top < root.bottom) {
            const p = parseInt(el.dataset.pageNum, 10);
            if (!isNaN(p)) pages.add(p);
        }
    });
    if (!pages.size) pages.add(1);
    return [...pages];
}

async function rerenderVisible() {
    renderedPageKeys = new Set();
    for (const i of getVisiblePageNumbers()) {
        try { await ensurePageRendered(i); } catch (e) { console.error(e); }
    }
}

onMounted(async () => {
    if (props.template.editorState?.scale) {
        scale.value = props.template.editorState.scale;
    }
    await loadPdf(props.template.pdfUrl);
    if (props.template.editorState?.activePage) {
        await nextTick();
        scrollToPage(props.template.editorState.activePage);
    }
});

onBeforeUnmount(() => {
    renderedPageKeys = new Set();
    pdfRenderer.cancelAll();
    if (intersectionObs) intersectionObs.disconnect();
});

async function loadPdf(url) {
    isLoading.value = true;
    loadError.value = null;
    pageDims.value = [];
    renderedPageKeys = new Set();

    try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        pdfDoc = await getDocument({ data: arrayBuffer }).promise;
        numPages.value = pdfDoc.numPages;
        pageDims.value = await pdfRenderer.computePageDimensions(pdfDoc, numPages.value, scale.value);
        placedFields.value = hydrateTemplateFields(props.template.editorState?.placedFields ?? [], numPages.value);
    } catch {
        loadError.value = 'Could not load the template preview.';
        isLoading.value = false;
        return;
    }

    isLoading.value = false;
    await nextTick();

    for (let i = 1; i <= numPages.value; i++) {
        try {
            const canvas = await pdfRenderer.waitForCanvas((idx) => thumbCanvases[idx], i - 1, { label: 'preview-thumb' });
            if (canvas) await pdfRenderer.renderToCanvas(pdfDoc, i, canvas, 0.14, `preview-thumb-${i}`);
        } catch (e) { console.error(`[CubSign] Thumb ${i}:`, e); }
    }

    await ensurePageRendered(1);
    for (let i = 2; i <= Math.min(3, numPages.value); i++) {
        try { await ensurePageRendered(i); } catch (e) { console.error(e); }
    }

    if (window.innerWidth < 768 && pageDims.value[0]) {
        await fitWidth();
        await nextTick();
    }
    setupScrollObserver();
}

function setupScrollObserver() {
    if (intersectionObs) intersectionObs.disconnect();
    if (!centerRef.value) return;
    intersectionObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                    const p = parseInt(entry.target.dataset.pageNum, 10);
                    if (!isNaN(p)) {
                        activePage.value = p;
                        ensurePageRendered(p);
                    }
                }
            });
        },
        { root: centerRef.value, threshold: 0.3 },
    );
    centerRef.value.querySelectorAll('.page-wrapper').forEach((el, i) => {
        el.dataset.pageNum = String(i + 1);
        intersectionObs.observe(el);
    });
}

function placedFieldsOnPage(pageNum) {
    return placedFields.value.filter((f) => f.pageNum === pageNum);
}

function scrollToPage(pageNum) {
    activePage.value = pageNum;
    const wrappers = centerRef.value?.querySelectorAll('.page-wrapper') ?? [];
    const el = wrappers[pageNum - 1];
    if (el && centerRef.value) {
        centerRef.value.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
    }
}

function goToPrevPage() {
    if (activePage.value > 1) scrollToPage(activePage.value - 1);
}

function goToNextPage() {
    if (activePage.value < numPages.value) scrollToPage(activePage.value + 1);
}

async function zoomIn() {
    scale.value = Math.min(3.0, parseFloat((scale.value + 0.2).toFixed(1)));
    await rerenderVisible();
}

async function zoomOut() {
    scale.value = Math.max(0.4, parseFloat((scale.value - 0.2).toFixed(1)));
    await rerenderVisible();
}

async function fitWidth() {
    if (!centerRef.value || !pageDims.value[0]) return;
    const available = centerRef.value.clientWidth - 80;
    const nativeW = pageDims.value[0].w / scale.value;
    scale.value = Math.min(3.0, Math.max(0.4, parseFloat((available / nativeW).toFixed(2))));
    await rerenderVisible();
}
</script>

<template>
    <div class="flex h-screen flex-col overflow-hidden bg-gray-200">
        <header class="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 shadow-sm md:px-4">
            <Link
                :href="route('templates.show', template.id)"
                class="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <span class="hidden sm:inline">Back</span>
            </Link>
            <div class="text-center">
                <p class="truncate text-sm font-semibold text-gray-900">{{ template.name }}</p>
                <p class="text-[10px] text-gray-400">Structural preview: placeholders only</p>
            </div>
            <Link
                :href="route('templates.edit', template.id)"
                class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
                Edit
            </Link>
        </header>

        <div class="flex min-h-0 flex-1 overflow-hidden lg:flex-row">
            <aside
                ref="thumbStripRef"
                class="flex h-[68px] shrink-0 flex-row items-end gap-2 overflow-x-auto overflow-y-hidden border-b border-gray-200 bg-gray-100 px-3 py-2
                       lg:h-auto lg:w-[72px] lg:flex-col lg:items-stretch lg:overflow-x-hidden lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-2 lg:py-3"
            >
                <template v-for="(dim, i) in pageDims" :key="i">
                    <button class="group flex w-[44px] shrink-0 flex-col items-center gap-0.5 lg:w-full lg:gap-1" @click="scrollToPage(i + 1)">
                        <div
                            :class="[
                                'h-[46px] w-full overflow-hidden rounded border-2 bg-white shadow-sm transition lg:h-auto',
                                activePage === i + 1 ? 'border-blue-600 shadow-blue-200' : 'border-gray-300 group-hover:border-gray-400',
                            ]"
                        >
                            <canvas :ref="el => { if (el) thumbCanvases[i] = el }" class="mx-auto block h-full w-auto lg:h-auto lg:w-full"/>
                        </div>
                        <span class="hidden text-[9px] font-medium text-gray-500 lg:block">{{ i + 1 }}</span>
                    </button>
                </template>
            </aside>

            <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <div class="flex h-10 shrink-0 items-center justify-between border-b border-gray-300 bg-white px-2 shadow-sm md:px-4">
                    <div class="hidden min-w-0 items-center gap-2 text-xs text-gray-600 md:flex">
                        <span class="truncate font-medium text-gray-700">{{ template.name }}</span>
                        <span v-if="numPages" class="shrink-0 text-gray-400">· {{ numPages }}p</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <button class="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100" title="Zoom out" @click="zoomOut">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                        </button>
                        <select
                            v-model="zoomSelect"
                            class="w-[82px] cursor-pointer rounded border border-gray-200 bg-white py-0.5 text-center text-xs font-medium text-gray-700 focus:border-blue-400 focus:outline-none"
                        >
                            <option value="0.5">50%</option>
                            <option value="0.75">75%</option>
                            <option value="1.0">100%</option>
                            <option value="1.25">125%</option>
                            <option value="1.5">150%</option>
                            <option value="fit">Fit Width</option>
                            <option v-if="zoomSelect === 'custom'" value="custom">{{ Math.round(scale * 100) }}%</option>
                        </select>
                        <button class="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100" title="Zoom in" @click="zoomIn">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        </button>
                    </div>
                    <div class="flex shrink-0 items-center gap-0.5">
                        <button class="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30" :disabled="activePage <= 1 || !numPages" @click="goToPrevPage">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <span class="min-w-[58px] text-center text-xs text-gray-500">{{ activePage }} / {{ numPages || '…' }}</span>
                        <button class="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30" :disabled="activePage >= numPages || !numPages" @click="goToNextPage">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>

                <div ref="centerRef" class="relative flex-1 overflow-y-auto overflow-x-auto">
                    <div v-if="isLoading" class="flex h-full items-center justify-center">
                        <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"/>
                    </div>
                    <div v-else-if="loadError" class="flex h-full items-center justify-center text-sm text-red-600">{{ loadError }}</div>
                    <div v-else class="flex flex-col items-start gap-8 py-6 px-3 md:items-center md:px-6">
                        <div
                            v-for="(dim, i) in pageDims"
                            :key="i"
                            class="page-wrapper relative shadow-xl ring-1 ring-black/10"
                            :style="`width:${dim.w}px; height:${dim.h}px`"
                        >
                            <canvas :ref="el => { pageCanvases[i] = el ?? undefined }" class="block" />
                            <div class="pointer-events-none absolute inset-0 z-10">
                                <div
                                    v-for="field in placedFieldsOnPage(i + 1)"
                                    :key="field.id"
                                    class="absolute"
                                    :style="`left:${field.x}px; top:${field.y}px; width:${field.w}px; height:${field.h}px`"
                                >
                                    <TemplateFieldPlaceholder :field="field" />
                                </div>
                            </div>
                            <div class="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-gray-400">Page {{ i + 1 }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
