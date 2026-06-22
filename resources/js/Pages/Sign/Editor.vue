<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Link } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

const { getDocument, GlobalWorkerOptions, Util } = pdfjsLib;
GlobalWorkerOptions.workerSrc = workerUrl;

const props = defineProps({
    session: { type: Object, required: true },
});

// ── PDF state ───────────────────────────────────────────────────────────
// pdfDoc is NOT a Vue ref — Vue's deep Proxy wrapping breaks pdfjs internals
let   pdfDoc        = null;
const numPages      = ref(0);
const pageDims      = ref([]);      // [{ w, h }] populated as pages render
let   pageCanvases  = [];           // plain array — avoids Vue ref unwrap issues
let   thumbCanvases = [];
const activePage    = ref(1);
const scale         = ref(1.3);
const isLoading     = ref(true);
const loadError     = ref(null);
const centerRef     = ref(null);    // scrollable center column

// ── Signature creation ──────────────────────────────────────────────────
const activeTab     = ref('draw');
const sigCanvasRef  = ref(null);
const hasDrawing    = ref(false);
const isDrawing     = ref(false);
const typedName     = ref('');
const typedFont     = ref('script');
const uploadedSig   = ref(null);
const uploadInput   = ref(null);

const typeFonts = [
    { id: 'script',  label: 'Script',  cls: "font-['Georgia'] italic text-2xl tracking-wide" },
    { id: 'cursive', label: 'Cursive', cls: 'font-sans italic text-2xl tracking-wide text-gray-700' },
    { id: 'print',   label: 'Print',   cls: 'font-sans font-bold text-xl tracking-wider text-gray-900' },
];

// ── Placement state ─────────────────────────────────────────────────────
const capturedSig     = ref(null);    // { type, src, font? } or null
const placedSigs      = ref([]);      // [{ id, pageNum, x, y, w, h, type, src, font? }]
const placementMode   = ref(null);    // 'manual' | null
const detectedFields  = ref([]);      // detected signature field positions
const isDetecting     = ref(false);
const showFields      = ref(false);
const detectionRan    = ref(false);
const selectedSigId   = ref(null);
let   sigSeq          = 0;

// ── Drag / resize ───────────────────────────────────────────────────────
let activeDrag   = null;
let prevX = 0, prevY = 0;
let isResizing   = false;
let resizeHandle = null;
let resizeSig    = null;
let rsStartW = 0, rsStartH = 0, rsStartX = 0, rsStartY = 0;
let rsClientX = 0, rsClientY = 0;

// ── Computed ─────────────────────────────────────────────────────────────
const signatureReady = computed(() => {
    if (activeTab.value === 'draw')   return hasDrawing.value;
    if (activeTab.value === 'type')   return typedName.value.trim().length >= 2;
    if (activeTab.value === 'upload') return uploadedSig.value !== null;
    return false;
});

const workflowStep = computed(() => {
    if (placedSigs.value.length > 0) return 3;
    if (capturedSig.value)           return 2;
    return 1;
});

const selectedFont = computed(
    () => typeFonts.find(f => f.id === typedFont.value) ?? typeFonts[0]
);

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
    window.addEventListener('mousemove', onGlobalMove);
    window.addEventListener('mouseup', onGlobalUp);
    await loadPdf(props.session.pdfUrl);
});

onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onGlobalMove);
    window.removeEventListener('mouseup', onGlobalUp);
});

watch(activeTab, async (tab) => {
    if (tab === 'draw') {
        await nextTick();
        initSigCanvas();
    }
});

// ── PDF loading ───────────────────────────────────────────────────────────
async function loadPdf(url) {
    isLoading.value = true;
    loadError.value = null;
    pageCanvases    = [];
    thumbCanvases   = [];

    // Fetch in main thread so the session cookie is always included
    let arrayBuffer;
    try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        arrayBuffer = await res.arrayBuffer();
    } catch (err) {
        console.error('[CubSign] PDF fetch error:', err);
        loadError.value = 'Could not load the document. Try re-uploading.';
        isLoading.value = false;
        return;
    }

    // Parse document
    try {
        const task = getDocument({ data: arrayBuffer });
        pdfDoc   = await task.promise;
        numPages.value = pdfDoc.numPages;
    } catch (err) {
        console.error('[CubSign] PDF parse error:', err);
        loadError.value = 'Could not parse the document. Try re-uploading.';
        isLoading.value = false;
        return;
    }

    isLoading.value = false;

    // Render pages — errors here are non-fatal (show blank page, log error)
    for (let i = 1; i <= numPages.value; i++) {
        await nextTick();
        try { await renderPage(i); }  catch (e) { console.error(`[CubSign] Page ${i} render:`, e); }
        try { await renderThumb(i); } catch (e) { console.error(`[CubSign] Thumb ${i} render:`, e); }
    }
}

async function renderPage(pageNum) {
    const page     = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: scale.value });

    pageDims.value[pageNum - 1] = { w: viewport.width, h: viewport.height };

    await nextTick();
    const canvas = pageCanvases[pageNum - 1];
    if (!canvas) return;

    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    const renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport });
    await (renderTask.promise ?? renderTask);
}

async function renderThumb(pageNum) {
    const page     = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 0.14 });

    await nextTick();
    const canvas = thumbCanvases[pageNum - 1];
    if (!canvas) return;

    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    const renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport });
    await (renderTask.promise ?? renderTask);
}

async function rerenderAll() {
    for (let i = 1; i <= numPages.value; i++) {
        try { await renderPage(i); } catch (e) { console.error(`[CubSign] Rerender page ${i}:`, e); }
    }
}

async function zoomIn() {
    scale.value = Math.min(3.0, parseFloat((scale.value + 0.2).toFixed(1)));
    await rerenderAll();
}

async function zoomOut() {
    scale.value = Math.max(0.4, parseFloat((scale.value - 0.2).toFixed(1)));
    await rerenderAll();
}

function scrollToPage(pageNum) {
    activePage.value = pageNum;
    const wrappers = centerRef.value?.querySelectorAll('.page-wrapper') ?? [];
    const el = wrappers[pageNum - 1];
    if (el && centerRef.value) {
        centerRef.value.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
    }
}

// ── Signature canvas (Draw tab) ───────────────────────────────────────────
function initSigCanvas() {
    const canvas = sigCanvasRef.value;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = Math.max(canvas.parentElement?.clientWidth ?? 0, 240);
    const h   = 120;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    hasDrawing.value = false;
}

onMounted(initSigCanvas);

function beginDraw(e) {
    isDrawing.value = true;
    const pos = getCanvasPos(e);
    const ctx = sigCanvasRef.value.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function continueDraw(e) {
    if (!isDrawing.value) return;
    const pos = getCanvasPos(e);
    const ctx = sigCanvasRef.value.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    hasDrawing.value = true;
}

function endDraw() { isDrawing.value = false; }

function getCanvasPos(e) {
    const rect = sigCanvasRef.value.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function clearCanvas() { initSigCanvas(); }

function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { uploadedSig.value = ev.target.result; };
    reader.readAsDataURL(file);
}

// ── Capture → placement ───────────────────────────────────────────────────
function captureSignature() {
    if (!signatureReady.value) return;
    if (activeTab.value === 'draw') {
        capturedSig.value = { type: 'image', src: sigCanvasRef.value.toDataURL() };
    } else if (activeTab.value === 'type') {
        capturedSig.value = { type: 'text', src: typedName.value.trim(), font: selectedFont.value.cls };
    } else {
        capturedSig.value = { type: 'image', src: uploadedSig.value };
    }
    detectionRan.value  = false;
    placementMode.value = 'manual';
}

function cancelCapture() {
    capturedSig.value    = null;
    placementMode.value  = null;
    showFields.value     = false;
    detectedFields.value = [];
    detectionRan.value   = false;
}

// ── Manual placement ──────────────────────────────────────────────────────
function activateManualMode() {
    // Clear detect state so yellow field markers disappear from PDF
    detectedFields.value = [];
    showFields.value     = false;
    detectionRan.value   = false;
    placementMode.value  = 'manual';
}

function onPageClick(e, pageNum) {
    if (placementMode.value !== 'manual') return;
    if (!capturedSig.value) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 90;
    const y = e.clientY - rect.top  - 30;
    placeSig(pageNum, Math.max(0, x), Math.max(0, y));
    placementMode.value = null;
}

function placeSig(pageNum, x, y, w = 180, h = 60) {
    const id = ++sigSeq;
    placedSigs.value.push({ id, pageNum, x, y, w, h, ...capturedSig.value });
    selectedSigId.value = id;
}

// ── Smart detection (MODE 2) ──────────────────────────────────────────────
const KEYWORDS = [
    'signature', 'signed by', 'authorized signature',
    'company representative', 'customer signature', 'sign here',
    'signatory', 'undersigned', 'authorized signatory',
];

async function detectFields() {
    if (!pdfDoc || !capturedSig.value) return;
    placementMode.value  = null;   // exit manual mode so banner/crosshair disappear
    isDetecting.value    = true;
    detectedFields.value = [];
    showFields.value     = false;
    let seq = 0;

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page        = await pdfDoc.getPage(pageNum);
        const viewport    = page.getViewport({ scale: scale.value });
        const textContent = await page.getTextContent();

        // PDF stores text as fragmented runs — "Signature:" may arrive as
        // ["S","ign","ature:"] across multiple items. Group items within 10px
        // of each other in Y (same visual line) then concatenate before searching.
        const lines = [];
        for (const item of textContent.items) {
            if (!('str' in item) || !item.str.trim()) continue;
            const tx = Util.transform(viewport.transform, item.transform);
            const ix = tx[4], iy = tx[5], ih = Math.abs(tx[3]) || 12;
            const existing = lines.find(l => Math.abs(l.y - iy) < 10);
            if (existing) {
                existing.items.push({ str: item.str, x: ix });
            } else {
                lines.push({ y: iy, h: ih, x: ix, items: [{ str: item.str, x: ix }] });
            }
        }

        for (const line of lines) {
            line.items.sort((a, b) => a.x - b.x);
            const lineText = line.items.map(i => i.str).join('').trim();
            const lower    = lineText.toLowerCase();

            // Only accept a keyword match when:
            //   a) it starts the line (it IS the label, e.g. "Signature:"), OR
            //   b) the line is short (<= 40 chars, unlikely to be a sentence)
            // This rejects keywords buried in paragraph text like "signed by both parties"
            const matched = KEYWORDS.find(k => {
                if (!lower.includes(k)) return false;
                if (lower.trimStart().startsWith(k)) return true;
                if (lineText.length <= 40) return true;
                return false;
            });
            if (!matched) continue;

            // Score: label-shaped lines score high, headings/paragraphs score low
            let score = 0;
            const afterKeyword = lower[lower.indexOf(matched) + matched.length];
            if (afterKeyword === ':') score += 60;         // "Signature:" — definite field label
            if (lineText.length <= 15) score += 40;        // very short = pure label
            else if (lineText.length <= 30) score += 20;
            if (/^\d+[\.\s]/.test(lineText)) score -= 80; // "10. Signatures" section heading
            if (lineText.length > 60) score -= 50;         // paragraph text
            if (/^[A-Z\s]+$/.test(lineText)) score -= 30; // ALL-CAPS HEADING

            detectedFields.value.push({
                id:      ++seq,
                pageNum,
                label:   lineText.length > 35 ? lineText.slice(0, 35) + '…' : lineText,
                keyword: matched,
                score,
                x:       line.items[0].x,
                y:       line.y + 4,
                h:       line.h,
            });
        }
    }

    // Sort by confidence score so the best match is always first
    detectedFields.value.sort((a, b) => b.score - a.score);

    isDetecting.value  = false;
    showFields.value   = detectedFields.value.length > 0;
    detectionRan.value = true;
}

function placeAtField(field) {
    if (!capturedSig.value) return;
    placeSig(field.pageNum, Math.max(0, field.x - 5), field.y, 180, 60);
    detectedFields.value = [];   // remove yellow field markers from PDF
    showFields.value     = false;
    detectionRan.value   = false;
    placementMode.value  = null;
    scrollToPage(field.pageNum);
}

// ── AI Auto place (MODE 3) ────────────────────────────────────────────────
async function autoPlace() {
    if (!capturedSig.value) return;
    if (detectedFields.value.length === 0) {
        await detectFields();
    }
    if (detectedFields.value.length > 0) {
        placeAtField(detectedFields.value[0]);
    } else {
        // No fields found — don't place anything, just show the "no fields found" message
        placementMode.value = null;
    }
}

// ── Remove signature ──────────────────────────────────────────────────────
function removeSig(id) {
    placedSigs.value = placedSigs.value.filter(s => s.id !== id);
    if (selectedSigId.value === id) selectedSigId.value = null;
}

function sigsOnPage(pageNum) {
    return placedSigs.value.filter(s => s.pageNum === pageNum);
}

function fieldsOnPage(pageNum) {
    return detectedFields.value.filter(f => f.pageNum === pageNum);
}

// ── Drag ──────────────────────────────────────────────────────────────────
function startDrag(e, sig) {
    if (isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    selectedSigId.value = sig.id;
    activeDrag = sig;
    prevX = e.clientX;
    prevY = e.clientY;
}

function onGlobalMove(e) {
    if (activeDrag && !isResizing) {
        activeDrag.x += e.clientX - prevX;
        activeDrag.y += e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
    }
    if (isResizing && resizeSig) {
        const dx = e.clientX - rsClientX;
        const dy = e.clientY - rsClientY;
        if (resizeHandle.includes('e')) resizeSig.w = Math.max(60, rsStartW + dx);
        if (resizeHandle.includes('s')) resizeSig.h = Math.max(24, rsStartH + dy);
        if (resizeHandle.includes('w')) {
            const nw = Math.max(60, rsStartW - dx);
            resizeSig.x = rsStartX + (rsStartW - nw);
            resizeSig.w = nw;
        }
        if (resizeHandle.includes('n')) {
            const nh = Math.max(24, rsStartH - dy);
            resizeSig.y = rsStartY + (rsStartH - nh);
            resizeSig.h = nh;
        }
    }
}

function onGlobalUp() {
    activeDrag   = null;
    isResizing   = false;
    resizeHandle = null;
    resizeSig    = null;
}

function startResize(e, sig, handle) {
    e.preventDefault();
    e.stopPropagation();
    isResizing   = true;
    resizeHandle = handle;
    resizeSig    = sig;
    rsStartW     = sig.w;
    rsStartH     = sig.h;
    rsStartX     = sig.x;
    rsStartY     = sig.y;
    rsClientX    = e.clientX;
    rsClientY    = e.clientY;
    selectedSigId.value = sig.id;
}

// ── Resize handle config ──────────────────────────────────────────────────
const HANDLES = [
    { id: 'nw', pos: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',    cur: 'nwse-resize' },
    { id: 'n',  pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',  cur: 'ns-resize'   },
    { id: 'ne', pos: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',     cur: 'nesw-resize' },
    { id: 'e',  pos: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',  cur: 'ew-resize'   },
    { id: 'se', pos: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',   cur: 'nwse-resize' },
    { id: 's',  pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', cur: 'ns-resize'   },
    { id: 'sw', pos: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',   cur: 'nesw-resize' },
    { id: 'w',  pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',  cur: 'ew-resize'   },
];
</script>

<template>
    <SignLayout :step="workflowStep">

        <!-- ░░░░ THREE-COLUMN EDITOR WORKSPACE ░░░░ -->
        <div class="flex h-full min-h-0 overflow-hidden">

            <!-- ═══ LEFT: THUMBNAIL STRIP ═══════════════════════════════════ -->
            <aside class="flex w-[72px] shrink-0 flex-col gap-2 overflow-y-auto border-r border-gray-200 bg-gray-100 px-2 py-3">
                <template v-for="(dim, i) in pageDims" :key="i">
                    <button class="group flex w-full flex-col items-center gap-1" @click="scrollToPage(i + 1)">
                        <div
                            :class="[
                                'w-full overflow-hidden rounded border-2 bg-white shadow-sm transition',
                                activePage === i + 1
                                    ? 'border-blue-600 shadow-blue-200'
                                    : 'border-gray-300 group-hover:border-gray-400',
                            ]"
                        >
                            <canvas :ref="el => { if (el) thumbCanvases[i] = el }" class="block w-full" />
                        </div>
                        <span class="text-[9px] font-medium text-gray-500">{{ i + 1 }}</span>
                    </button>
                </template>
                <template v-if="isLoading">
                    <div v-for="n in 3" :key="n" class="h-16 animate-pulse rounded border border-gray-300 bg-gray-200" />
                </template>
            </aside>

            <!-- ═══ CENTER: PDF VIEWER ════════════════════════════════════════ -->
            <div class="flex min-w-0 flex-1 flex-col overflow-hidden bg-gray-200">

                <!-- Viewer toolbar -->
                <div class="flex h-10 shrink-0 items-center justify-between border-b border-gray-300 bg-white px-4 shadow-sm">
                    <div class="flex min-w-0 items-center gap-2 text-xs text-gray-600">
                        <svg class="h-3.5 w-3.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-2v2H6v-5h1.5v1.5h2V8.5H11v5H9.5v-2zm4.5 2h-1.5v-5H15c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5zm4.5 0H17v-5h1.5v3.5H19V13.5z"/>
                        </svg>
                        <span class="truncate font-medium text-gray-700">{{ session.filename }}</span>
                        <span v-if="numPages" class="shrink-0 text-gray-400">· {{ numPages }}p</span>
                    </div>

                    <div class="flex items-center gap-1">
                        <button class="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100" title="Zoom out" @click="zoomOut">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                            </svg>
                        </button>
                        <span class="w-11 text-center text-xs font-medium tabular-nums text-gray-700">{{ Math.round(scale * 100) }}%</span>
                        <button class="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100" title="Zoom in" @click="zoomIn">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        </button>
                    </div>

                    <span class="shrink-0 text-xs text-gray-400">Page {{ activePage }} / {{ numPages || '…' }}</span>
                </div>

                <!-- Manual-placement banner -->
                <div v-if="placementMode === 'manual'" class="flex shrink-0 items-center justify-between bg-blue-600 px-4 py-2">
                    <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
                        </svg>
                        <span class="text-sm font-semibold text-white">Click anywhere on the document to place your signature</span>
                    </div>
                    <button class="rounded px-2 py-0.5 text-xs font-medium text-blue-200 hover:bg-blue-700 hover:text-white" @click="placementMode = null">
                        Cancel
                    </button>
                </div>

                <!-- Scrollable pages -->
                <div
                    ref="centerRef"
                    class="flex-1 overflow-y-auto overflow-x-auto"
                    :class="placementMode === 'manual' ? 'cursor-crosshair' : 'cursor-default'"
                >
                    <!-- Loading state -->
                    <div v-if="isLoading" class="flex h-full items-center justify-center">
                        <div class="flex flex-col items-center gap-4">
                            <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                            <p class="text-sm text-gray-500">Loading document…</p>
                        </div>
                    </div>

                    <!-- Error state -->
                    <div v-else-if="loadError" class="flex h-full items-center justify-center p-8 text-center">
                        <div>
                            <p class="mb-2 text-sm font-semibold text-red-600">{{ loadError }}</p>
                            <Link :href="route('sign.index')" class="text-xs text-blue-600 hover:underline">Re-upload document</Link>
                        </div>
                    </div>

                    <!-- PDF pages -->
                    <div v-else class="flex flex-col items-center gap-8 py-6 px-6">
                        <div
                            v-for="(dim, i) in pageDims"
                            :key="i"
                            class="page-wrapper relative shadow-xl ring-1 ring-black/10"
                            :style="`width:${dim.w}px; height:${dim.h}px`"
                        >
                            <!-- PDF canvas -->
                            <canvas
                                :ref="el => { if (el) pageCanvases[i] = el }"
                                class="block"
                                :width="dim.w"
                                :height="dim.h"
                            />

                            <!-- Interaction overlay -->
                            <div class="absolute inset-0 z-10" @click="onPageClick($event, i + 1)" @mousedown.stop>

                                <!-- Placed signatures -->
                                <div
                                    v-for="sig in sigsOnPage(i + 1)"
                                    :key="sig.id"
                                    class="absolute select-none"
                                    :style="`left:${sig.x}px; top:${sig.y}px; width:${sig.w}px; height:${sig.h}px; cursor:move`"
                                    @mousedown.stop="startDrag($event, sig)"
                                    @click.stop
                                >
                                    <div
                                        :class="[
                                            'relative h-full w-full overflow-hidden rounded',
                                            sig.id === selectedSigId
                                                ? 'ring-2 ring-blue-500 ring-offset-1'
                                                : 'ring-1 ring-blue-300/50',
                                        ]"
                                        style="background:rgba(239,246,255,0.4)"
                                    >
                                        <img
                                            v-if="sig.type === 'image'"
                                            :src="sig.src"
                                            class="h-full w-full object-contain"
                                            draggable="false"
                                        />
                                        <div
                                            v-else
                                            class="flex h-full w-full items-center justify-center px-2"
                                            :class="sig.font"
                                            style="color:#1e40af"
                                        >
                                            {{ sig.src }}
                                        </div>
                                    </div>

                                    <!-- Resize handles (when selected) -->
                                    <template v-if="sig.id === selectedSigId">
                                        <div
                                            v-for="h in HANDLES"
                                            :key="h.id"
                                            class="absolute z-20 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500 shadow-md"
                                            :class="h.pos"
                                            :style="`cursor:${h.cur}`"
                                            @mousedown.stop="startResize($event, sig, h.id)"
                                        />
                                        <!-- Delete — mousedown.stop prevents bubbling to startDrag which calls preventDefault, which would block the click event -->
                                        <button
                                            class="absolute -right-3 -top-3 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                                            style="font-size:9px;line-height:1"
                                            @mousedown.stop
                                            @click.stop="removeSig(sig.id)"
                                        >✕</button>
                                    </template>
                                </div>

                                <!-- Detected field markers -->
                                <div
                                    v-for="field in fieldsOnPage(i + 1)"
                                    :key="`field-${field.id}`"
                                    class="absolute z-20 cursor-pointer rounded border-2 border-dashed border-amber-400 bg-amber-50/30 transition-colors hover:bg-amber-100/60"
                                    :style="`left:${field.x - 5}px; top:${field.y}px; width:170px; height:52px`"
                                    @click.stop="placeAtField(field)"
                                >
                                    <span class="absolute -top-4 left-0 rounded-sm bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                                        {{ field.label }}
                                    </span>
                                    <div class="flex h-full w-full items-center justify-center text-[10px] font-semibold text-amber-600">
                                        Click to sign here
                                    </div>
                                </div>
                            </div>

                            <div class="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-gray-400">
                                Page {{ i + 1 }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══ RIGHT: SIGNATURE PANEL ════════════════════════════════════ -->
            <aside class="flex w-[300px] shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">

                <!-- File info -->
                <div class="border-b border-gray-100 bg-gray-50 px-4 py-3">
                    <div class="flex items-center gap-2">
                        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-red-100">
                            <svg class="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="truncate text-xs font-semibold text-gray-800">{{ session.filename }}</p>
                            <p class="text-[10px] text-gray-400">
                                {{ numPages ? numPages + ' page' + (numPages !== 1 ? 's' : '') : 'Loading…' }}
                                · {{ Math.round(session.fileSize / 1024) }} KB
                            </p>
                        </div>
                    </div>
                </div>

                <!-- ── CREATE SIGNATURE ── -->
                <div class="border-b border-gray-100 px-4 py-4">
                    <p class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Create Signature</p>

                    <!-- Tabs -->
                    <div class="mb-3 flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                        <button
                            v-for="tab in ['draw', 'type', 'upload']"
                            :key="tab"
                            :class="[
                                'flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition',
                                activeTab === tab
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700',
                            ]"
                            @click="activeTab = tab"
                        >{{ tab }}</button>
                    </div>

                    <!-- Draw tab -->
                    <div v-if="activeTab === 'draw'" class="space-y-1.5">
                        <div class="relative overflow-hidden rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30">
                            <canvas
                                ref="sigCanvasRef"
                                class="block touch-none"
                                style="width:100%;height:120px"
                                @mousedown="beginDraw"
                                @mousemove="continueDraw"
                                @mouseup="endDraw"
                                @mouseleave="endDraw"
                            />
                            <p v-if="!hasDrawing" class="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                                Draw your signature here
                            </p>
                        </div>
                        <button v-if="hasDrawing" class="text-[11px] text-gray-400 hover:text-gray-600" @click="clearCanvas">
                            Clear &amp; redraw
                        </button>
                    </div>

                    <!-- Type tab -->
                    <div v-else-if="activeTab === 'type'" class="space-y-2">
                        <input
                            v-model="typedName"
                            type="text"
                            placeholder="Type your full name"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <!-- Font style selector — always shows static label, never changes on typing -->
                        <div class="grid grid-cols-3 gap-1.5">
                            <button
                                v-for="f in typeFonts"
                                :key="f.id"
                                :class="[
                                    'flex items-center justify-center overflow-hidden rounded-lg border px-1 py-3 transition',
                                    typedFont === f.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300',
                                ]"
                                style="min-height:48px;color:#1e40af"
                                @click="typedFont = f.id"
                            >
                                <span :class="f.cls" class="leading-tight" style="font-size:15px">{{ f.label }}</span>
                            </button>
                        </div>

                        <!-- Live preview of typed name in selected font -->
                        <div
                            v-if="typedName.trim()"
                            class="flex min-h-[48px] items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-blue-50/30 px-3 py-2"
                        >
                            <span
                                :class="selectedFont.cls"
                                class="block w-full overflow-hidden whitespace-nowrap text-center"
                                style="color:#1e40af;font-size:22px;text-overflow:ellipsis"
                            >{{ typedName }}</span>
                        </div>
                    </div>

                    <!-- Upload tab -->
                    <div v-else class="space-y-2">
                        <div
                            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
                            @click="uploadInput?.click()"
                        >
                            <svg class="mb-2 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p class="text-xs font-medium text-gray-600">Upload signature image</p>
                            <p class="text-[11px] text-gray-400">PNG with transparent background</p>
                        </div>
                        <input ref="uploadInput" type="file" accept="image/*" class="hidden" @change="handleUpload" />
                        <img v-if="uploadedSig" :src="uploadedSig" class="h-16 w-full rounded-lg border border-gray-200 object-contain" />
                    </div>
                </div>

                <!-- ── PLACEMENT SECTION ── -->
                <div class="border-b border-gray-100 px-4 py-4">
                    <p class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Place Signature</p>

                    <!-- No signature created -->
                    <p v-if="!capturedSig && !signatureReady" class="text-xs text-gray-400">
                        Create a signature above, then choose how to place it.
                    </p>

                    <!-- Signature ready — show Add button -->
                    <div v-else-if="!capturedSig">
                        <button
                            class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                            @click="captureSignature"
                        >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
                            </svg>
                            Add Signature
                        </button>
                    </div>

                    <!-- Captured — three placement options -->
                    <div v-else class="space-y-2">

                        <!-- Active mode indicator -->
                        <div
                            v-if="placementMode === 'manual'"
                            class="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                        >
                            <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                            Click on the PDF to place
                            <button class="ml-auto text-blue-400 hover:text-blue-700" @click="placementMode = null">✕</button>
                        </div>

                        <!-- Preview captured sig -->
                        <div class="mb-1 flex min-h-[52px] items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-2">
                            <img v-if="capturedSig.type === 'image'" :src="capturedSig.src" class="max-h-12 max-w-full object-contain" />
                            <span v-else :class="capturedSig.font" class="text-xl" style="color:#1e40af">{{ capturedSig.src }}</span>
                        </div>

                        <!-- MODE 1 -->
                        <button
                            :class="[
                                'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition',
                                placementMode === 'manual'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400'
                                    : 'border-blue-200 bg-blue-50/60 text-blue-700 hover:bg-blue-100',
                            ]"
                            @click="activateManualMode"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
                            </svg>
                            <div class="text-left">
                                <p>Place Manually</p>
                                <p class="text-[10px] font-normal text-blue-500">Click anywhere on the PDF</p>
                            </div>
                        </button>

                        <!-- MODE 2 -->
                        <button
                            class="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="isDetecting"
                            @click="detectFields"
                        >
                            <svg class="h-4 w-4 shrink-0" :class="isDetecting ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <div class="text-left">
                                <p>{{ isDetecting ? 'Scanning…' : 'Detect Signature Fields' }}</p>
                                <p class="text-[10px] font-normal text-gray-400">Find signature lines in the PDF</p>
                            </div>
                        </button>

                        <!-- MODE 3 -->
                        <button
                            class="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                            @click="autoPlace"
                        >
                            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            <div class="text-left">
                                <p>Auto Place</p>
                                <p class="text-[10px] font-normal text-gray-400">Insert at the most likely location</p>
                            </div>
                        </button>

                        <button class="w-full text-center text-[11px] text-gray-400 hover:text-gray-600" @click="cancelCapture">
                            Use a different signature
                        </button>
                    </div>
                </div>

                <!-- ── DETECTED FIELDS LIST ── -->
                <div v-if="showFields && detectedFields.length > 0" class="border-b border-gray-100 px-4 py-3">
                    <div class="mb-2 flex items-center justify-between">
                        <p class="text-xs font-bold text-amber-700">
                            {{ detectedFields.length }} field{{ detectedFields.length !== 1 ? 's' : '' }} found
                        </p>
                        <button class="text-[11px] text-gray-400 hover:text-gray-600" @click="showFields = false; detectedFields = []; detectionRan = false">
                            Clear
                        </button>
                    </div>
                    <div class="space-y-1.5">
                        <button
                            v-for="field in detectedFields"
                            :key="field.id"
                            class="flex w-full items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-left transition hover:bg-amber-100"
                            @click="placeAtField(field)"
                        >
                            <svg class="mt-0.5 h-3 w-3 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <div>
                                <p class="text-xs font-semibold text-gray-800">{{ field.label }}</p>
                                <p class="text-[10px] text-gray-400">Page {{ field.pageNum }} · Click to place here</p>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- No fields found feedback -->
                <div
                    v-else-if="detectionRan && !isDetecting && !showFields && capturedSig && !isLoading && detectedFields.length === 0"
                    class="px-4 py-2 text-center"
                >
                    <p class="text-xs text-gray-500">No signature fields found in this document.</p>
                    <p class="mt-0.5 text-[11px] text-gray-400">Use "Place Manually" or "Auto Place" instead.</p>
                </div>

                <!-- ── PLACED SIGNATURES ── -->
                <div v-if="placedSigs.length > 0" class="px-4 py-3">
                    <p class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Placed ({{ placedSigs.length }})
                    </p>
                    <div class="space-y-1.5">
                        <div
                            v-for="sig in placedSigs"
                            :key="sig.id"
                            :class="[
                                'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 transition',
                                sig.id === selectedSigId
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-gray-100 bg-gray-50 hover:border-gray-200',
                            ]"
                            @click="selectedSigId = sig.id; scrollToPage(sig.pageNum)"
                        >
                            <div class="h-7 w-10 overflow-hidden rounded border border-gray-200 bg-white">
                                <img v-if="sig.type === 'image'" :src="sig.src" class="h-full w-full object-contain" />
                                <span v-else class="flex h-full w-full items-center justify-center text-[8px] font-bold text-blue-700">Aa</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-[11px] font-medium text-gray-700">Signature {{ sig.id }}</p>
                                <p class="text-[10px] text-gray-400">Page {{ sig.pageNum }}</p>
                            </div>
                            <button
                                class="shrink-0 rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-500"
                                @click.stop="removeSig(sig.id)"
                            >
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex-1" />

                <!-- Trust signals -->
                <div class="border-t border-gray-100 px-4 py-3">
                    <p class="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <svg class="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        End-to-end encrypted · Legally binding
                    </p>
                </div>
            </aside>
        </div>

        <!-- ░░ BOTTOM ACTION BAR ░░ -->
        <div class="flex h-14 shrink-0 items-center justify-between border-t border-gray-200 bg-white px-6 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
            <div class="flex items-center gap-4">
                <div v-for="(label, i) in ['Upload', 'Sign', 'Download']" :key="i" class="flex items-center gap-1.5">
                    <div
                        :class="[
                            'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                            workflowStep > i + 1
                                ? 'bg-emerald-500 text-white'
                                : workflowStep === i + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-500',
                        ]"
                    >
                        <svg v-if="workflowStep > i + 1" class="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span v-else>{{ i + 1 }}</span>
                    </div>
                    <span :class="['hidden text-xs sm:block', workflowStep >= i + 1 ? 'font-medium text-gray-800' : 'text-gray-400']">
                        {{ label }}
                    </span>
                    <svg v-if="i < 2" class="h-3 w-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <span v-if="placedSigs.length > 0" class="hidden text-xs font-medium text-emerald-600 sm:block">
                    ✓ {{ placedSigs.length }} signature{{ placedSigs.length !== 1 ? 's' : '' }} placed
                </span>
                <Link
                    :href="placedSigs.length > 0 ? route('sign.complete') : '#'"
                    :class="[
                        'flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition',
                        placedSigs.length > 0
                            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                            : 'cursor-not-allowed bg-gray-100 text-gray-400',
                    ]"
                >
                    Finish Signing
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </Link>
            </div>
        </div>

    </SignLayout>
</template>
