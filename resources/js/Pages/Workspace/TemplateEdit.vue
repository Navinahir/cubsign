<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { FIELD_TYPES, FIELD_DEFAULTS } from '@/Components/Editor/editorConstants';
import { RESIZE_HANDLES, ALIGN_TOOLS } from '@/Components/Editor/editorLayoutConstants';
import { buildTemplateFieldValue, TEMPLATE_FIELD_COLOR, hydrateTemplateFields, serializeTemplateEditorState, sanitizeTemplateField, clampFieldToPage, minFieldSize } from '@/Components/Editor/templateFieldHelpers';
import { fieldTypeLabel } from '@/Components/Editor/editorHelpers';
import { createPdfRenderer } from '@/utils/pdfPageRenderer';
import EditorFieldTypeGrid from '@/Components/Editor/EditorFieldTypeGrid.vue';
import EditorPlacementHelper from '@/Components/Editor/EditorPlacementHelper.vue';
import EditorEmptyState from '@/Components/Editor/EditorEmptyState.vue';
import EditorDocumentInfo from '@/Components/Editor/EditorDocumentInfo.vue';
import TemplateFieldPlaceholder from '@/Components/Editor/TemplateFieldPlaceholder.vue';
import SeoRobotsHead from '@/Components/SeoRobotsHead.vue';

const { getDocument, GlobalWorkerOptions } = pdfjsLib;
GlobalWorkerOptions.workerSrc = workerUrl;

const pdfRenderer = createPdfRenderer();
const HANDLES = RESIZE_HANDLES;
const FIELD_COLOR = TEMPLATE_FIELD_COLOR;

const props = defineProps({
    template: { type: Object, required: true },
});

// ── PDF state ─────────────────────────────────────────────────────────────────
let   pdfDoc        = null;
const numPages      = ref(0);
const pageDims      = ref([]);
let   pageCanvases  = [];
let   thumbCanvases = [];
const activePage    = ref(1);
const scale         = ref(1.3);
const isLoading     = ref(true);
const loadError     = ref(null);
const centerRef     = ref(null);
const thumbStripRef = ref(null);
let   intersectionObs = null;
/** Tracks which pages are rendered at the current scale (lazy PDF rendering). */
let   renderedPageKeys  = new Set();

// ── Template state ────────────────────────────────────────────────────────────
const templateName = ref(props.template.name);
const isSaving     = ref(false);

// ── Field placement ───────────────────────────────────────────────────────────
const placedFields    = ref([]);
const placementMode   = ref(null);
const selectedFieldId = ref(null);
const activeFieldType = ref('signature');
let   fieldSeq        = 0;
const clipboardField  = ref(null);

// ── Undo / Redo ───────────────────────────────────────────────────────────────
const undoStack   = ref([]);
const redoStack   = ref([]);
let   dragDidMove   = false;
let   resizeDidMove = false;

// ── UI state ──────────────────────────────────────────────────────────────────
const fieldsListOpen = ref(true);

const placementHelperMessage = computed(() => {
    const label = fieldTypeLabel(activeFieldType.value).toLowerCase();
    return `Click anywhere on the document to place the ${label} field.`;
});

const emptyStateStep = computed(() => (placementMode.value === 'manual' ? 2 : 1));

// ── Drag / Resize ─────────────────────────────────────────────────────────────
let activeDrag   = null;
let prevX = 0, prevY = 0;
let isResizing   = false;
let resizeHandle = null;
let resizeSig    = null;
let rsStartW = 0, rsStartH = 0, rsStartX = 0, rsStartY = 0;
let rsClientX = 0, rsClientY = 0;

// ── Derived ───────────────────────────────────────────────────────────────────
const selectedField = computed(() =>
    placedFields.value.find(f => f.id === selectedFieldId.value) ?? null
);

// ── Zoom ──────────────────────────────────────────────────────────────────────
const zoomSelect = computed({
    get: () => {
        const found = [0.5, 0.75, 1.0, 1.25, 1.5].find(p => Math.abs(scale.value - p) < 0.01);
        return found !== undefined ? String(found) : 'custom';
    },
    set: (val) => {
        if (val === 'fit')    { fitWidth(); return; }
        if (val === 'custom') { return; }
        scale.value = parseFloat(val);
        rerenderAll();
    },
});

// ── Lifecycle ─────────────────────────────────────────────────────────────────
function resetTemplateSession() {
    placedFields.value    = [];
    placementMode.value   = null;
    selectedFieldId.value = null;
    activeFieldType.value = 'signature';
    clipboardField.value  = null;
    undoStack.value       = [];
    redoStack.value       = [];
    fieldSeq              = 0;
    renderedPageKeys      = new Set();
}

function syncFieldSeq() {
    fieldSeq = placedFields.value.reduce(
        (max, f) => Math.max(max, typeof f.id === 'number' ? f.id : 0),
        0,
    );
}

function pageRenderKey(pageNum) {
    return `${pageNum}@${scale.value.toFixed(2)}`;
}

async function ensurePageRendered(pageNum) {
    const key = pageRenderKey(pageNum);
    if (renderedPageKeys.has(key) || !pdfDoc) return;
    await renderPage(pageNum);
    renderedPageKeys.add(key);
}

function isModKey(e) {
    return e.ctrlKey || e.metaKey;
}

onMounted(async () => {
    resetTemplateSession();

    window.addEventListener('mousemove', onGlobalMove);
    window.addEventListener('mouseup',   onGlobalUp);
    window.addEventListener('touchmove', onGlobalMove, { passive: false });
    window.addEventListener('touchend',  onGlobalUp);
    window.addEventListener('keydown',   onKeyDown);

    if (props.template.editorState?.scale) {
        scale.value = props.template.editorState.scale;
    }

    await loadPdf(props.template.pdfUrl);

    if (props.template.editorState?.activePage) {
        await nextTick();
        scrollToPage(props.template.editorState.activePage);
    }

    placementMode.value = 'manual';
});

onBeforeUnmount(() => {
    resetTemplateSession();
    pdfRenderer.cancelAll();
    window.removeEventListener('mousemove', onGlobalMove);
    window.removeEventListener('mouseup',   onGlobalUp);
    window.removeEventListener('touchmove', onGlobalMove);
    window.removeEventListener('touchend',  onGlobalUp);
    window.removeEventListener('keydown',   onKeyDown);
    if (intersectionObs) intersectionObs.disconnect();
});

watch(activePage, async (pageNum) => {
    await nextTick();
    if (!thumbStripRef.value) return;
    thumbStripRef.value.querySelectorAll('button')[pageNum - 1]
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});

// ── PDF loading ───────────────────────────────────────────────────────────────
async function loadPdf(url) {
    isLoading.value = true;
    loadError.value = null;
    pageCanvases    = [];
    thumbCanvases   = [];
    pageDims.value  = [];

    let arrayBuffer;
    try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        arrayBuffer = await res.arrayBuffer();
    } catch {
        loadError.value = 'Could not load the document. Please try again.';
        isLoading.value = false;
        return;
    }

    try {
        pdfDoc         = await getDocument({ data: arrayBuffer }).promise;
        numPages.value = pdfDoc.numPages;
        pageDims.value = await pdfRenderer.computePageDimensions(pdfDoc, numPages.value, scale.value);
    } catch {
        loadError.value = 'Could not parse the document. Please re-upload.';
        isLoading.value = false;
        return;
    }

    isLoading.value = false;
    await nextTick();

    for (let i = 1; i <= numPages.value; i++) {
        try { await renderThumb(i); } catch (e) { console.error(`[CubSign] Thumb ${i}:`, e); }
    }

    placedFields.value = hydrateTemplateFields(
        props.template.editorState?.placedFields ?? placedFields.value,
        numPages.value,
    );
    syncFieldSeq();

    await ensurePageRendered(1);
    for (let i = 2; i <= Math.min(3, numPages.value); i++) {
        try { await ensurePageRendered(i); } catch (e) { console.error(`[CubSign] Page ${i}:`, e); }
    }

    if (window.innerWidth < 768 && pageDims.value[0]) {
        await fitWidth();
        await nextTick();
    }
    setupScrollObserver();
}

async function renderPage(pageNum) {
    const canvas = await pdfRenderer.waitForCanvas((i) => pageCanvases[i], pageNum - 1, { label: 'template-main' });
    if (!canvas || !pdfDoc) return;
    const result = await pdfRenderer.renderToCanvas(pdfDoc, pageNum, canvas, scale.value, `template-page-${pageNum}`);
    if (result) {
        pageDims.value[pageNum - 1] = { w: result.width, h: result.height };
    }
}

async function renderThumb(pageNum) {
    const canvas = await pdfRenderer.waitForCanvas((i) => thumbCanvases[i], pageNum - 1, { label: 'template-thumb' });
    if (!canvas || !pdfDoc) return;
    await pdfRenderer.renderToCanvas(pdfDoc, pageNum, canvas, 0.14, `template-thumb-${pageNum}`);
}

async function rerenderAll() {
    renderedPageKeys = new Set();
    const visible = getVisiblePageNumbers();
    for (const i of visible) {
        try { await ensurePageRendered(i); } catch (e) { console.error(e); }
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

async function zoomIn() {
    scale.value = Math.min(3.0, parseFloat((scale.value + 0.2).toFixed(1)));
    await rerenderAll();
}

async function zoomOut() {
    scale.value = Math.max(0.4, parseFloat((scale.value - 0.2).toFixed(1)));
    await rerenderAll();
}

async function fitWidth() {
    if (!centerRef.value || !pageDims.value[0]) return;
    const available = centerRef.value.clientWidth - 80;
    const nativeW   = pageDims.value[0].w / scale.value;
    scale.value = Math.min(3.0, Math.max(0.4, parseFloat((available / nativeW).toFixed(2))));
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

function goToPrevPage() {
    if (activePage.value > 1) scrollToPage(activePage.value - 1);
}

function goToNextPage() {
    if (activePage.value < numPages.value) scrollToPage(activePage.value + 1);
}

function setupScrollObserver() {
    if (intersectionObs) intersectionObs.disconnect();
    if (!centerRef.value) return;
    intersectionObs = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
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

// ── Undo / Redo ───────────────────────────────────────────────────────────────
function pushUndo() {
    undoStack.value.push(JSON.stringify(placedFields.value));
    if (undoStack.value.length > 50) undoStack.value.shift();
    redoStack.value = [];
}

function undo() {
    if (!undoStack.value.length) return;
    redoStack.value.push(JSON.stringify(placedFields.value));
    placedFields.value = JSON.parse(undoStack.value.pop());
    selectedFieldId.value = null;
    syncFieldSeq();
}

function redo() {
    if (!redoStack.value.length) return;
    undoStack.value.push(JSON.stringify(placedFields.value));
    placedFields.value = JSON.parse(redoStack.value.pop());
    selectedFieldId.value = null;
    syncFieldSeq();
}

// ── Alignment ─────────────────────────────────────────────────────────────────
function alignField(dir) {
    const f = selectedField.value;
    if (!f) return;
    const dim = pageDims.value[f.pageNum - 1];
    if (!dim) return;
    pushUndo();
    if (dir === 'left')   f.x = 0;
    if (dir === 'right')  f.x = dim.w - f.w;
    if (dir === 'cx')     f.x = (dim.w - f.w) / 2;
    if (dir === 'top')    f.y = 0;
    if (dir === 'bottom') f.y = dim.h - f.h;
    if (dir === 'cy')     f.y = (dim.h - f.h) / 2;
}

// ── Field placement ───────────────────────────────────────────────────────────
function setFieldType(type) {
    activeFieldType.value = type;
    placementMode.value   = 'manual';
}

function cancelPlacement() {
    placementMode.value = null;
}

function onPageContextMenu(e) {
    if (placementMode.value === 'manual') {
        e.preventDefault();
        placementMode.value = null;
    }
}

function onPageClick(e, pageNum) {
    if (placementMode.value !== 'manual') {
        selectedFieldId.value = null;
        return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const type = activeFieldType.value;
    const def  = FIELD_DEFAULTS[type];
    const dim  = pageDims.value[pageNum - 1];
    let x      = Math.max(0, e.clientX - rect.left - def.w / 2);
    let y      = Math.max(0, e.clientY - rect.top - def.h / 2);
    if (dim) {
        ({ x, y } = clampFieldToPage({ type, x, y, w: def.w, h: def.h }, dim));
    }
    placeField(pageNum, x, y);
    if (type !== 'signature' && type !== 'initials') {
        placementMode.value = null;
    }
}

function placeField(pageNum, x, y, w, h) {
    pushUndo();
    const type  = activeFieldType.value;
    const id    = ++fieldSeq;
    const def   = FIELD_DEFAULTS[type];
    const value = buildTemplateFieldValue(type);

    placedFields.value.push(sanitizeTemplateField({
        id,
        type,
        pageNum,
        x,
        y,
        w: w ?? def.w,
        h: h ?? def.h,
        value,
        label: '',
        required: false,
    }, pageDims.value[pageNum - 1]));
    selectedFieldId.value = id;
}

function removeField(id) {
    pushUndo();
    placedFields.value = placedFields.value.filter(f => f.id !== id);
    if (selectedFieldId.value === id) selectedFieldId.value = null;
}

function placedFieldsOnPage(pageNum) {
    return placedFields.value.filter(f => f.pageNum === pageNum);
}

function duplicateField(sourceId) {
    const f = placedFields.value.find((fld) => fld.id === (sourceId ?? selectedFieldId.value));
    if (!f) return;
    pushUndo();
    const id = ++fieldSeq;
    placedFields.value.push(sanitizeTemplateField({ ...f, id, x: f.x + 20, y: f.y + 20 }));
    selectedFieldId.value = id;
}

function onFieldDoubleClick(field) {
    selectedFieldId.value = field.id;
    scrollToPage(field.pageNum);
}

// ── Drag / Resize ─────────────────────────────────────────────────────────────
function getEventCoords(e) {
    const p = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    return { clientX: p.clientX, clientY: p.clientY };
}

function startDrag(e, field) {
    if (isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    selectedFieldId.value = field.id;
    activeDrag  = field;
    dragDidMove = false;
    const { clientX, clientY } = getEventCoords(e);
    prevX = clientX;
    prevY = clientY;
}

function onGlobalMove(e) {
    if (!activeDrag && !isResizing) return;
    if (e.type === 'touchmove' && e.cancelable) e.preventDefault();
    const { clientX, clientY } = getEventCoords(e);
    if (activeDrag && !isResizing) {
        if (!dragDidMove) { pushUndo(); dragDidMove = true; }
        activeDrag.x += clientX - prevX;
        activeDrag.y += clientY - prevY;
        const dim = pageDims.value[activeDrag.pageNum - 1];
        if (dim) clampFieldToPage(activeDrag, dim);
        prevX = clientX;
        prevY = clientY;
    }
    if (isResizing && resizeSig) {
        if (!resizeDidMove) { pushUndo(); resizeDidMove = true; }
        const dx = clientX - rsClientX;
        const dy = clientY - rsClientY;
        const min = minFieldSize(resizeSig.type);
        if (resizeHandle.includes('e')) resizeSig.w = Math.max(min.w, rsStartW + dx);
        if (resizeHandle.includes('s')) resizeSig.h = Math.max(min.h, rsStartH + dy);
        if (resizeHandle.includes('w')) {
            const nw = Math.max(min.w, rsStartW - dx);
            resizeSig.x = rsStartX + (rsStartW - nw);
            resizeSig.w = nw;
        }
        if (resizeHandle.includes('n')) {
            const nh = Math.max(min.h, rsStartH - dy);
            resizeSig.y = rsStartY + (rsStartH - nh);
            resizeSig.h = nh;
        }
        const dim = pageDims.value[resizeSig.pageNum - 1];
        if (dim) clampFieldToPage(resizeSig, dim);
    }
}

function onGlobalUp() {
    if (activeDrag) {
        const dim = pageDims.value[activeDrag.pageNum - 1];
        if (dim) clampFieldToPage(activeDrag, dim);
    }
    activeDrag   = null;
    isResizing   = false;
    resizeHandle = null;
    resizeSig    = null;
}

function startResize(e, field, handle) {
    e.preventDefault();
    e.stopPropagation();
    isResizing    = true;
    resizeHandle  = handle;
    resizeSig     = field;
    resizeDidMove = false;
    rsStartW      = field.w;
    rsStartH      = field.h;
    rsStartX      = field.x;
    rsStartY      = field.y;
    const { clientX, clientY } = getEventCoords(e);
    rsClientX     = clientX;
    rsClientY     = clientY;
    selectedFieldId.value = field.id;
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
function onKeyDown(e) {
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.key === 'Escape') {
        e.preventDefault();
        if (placementMode.value) { placementMode.value = null; }
        else { selectedFieldId.value = null; }
        return;
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFieldId.value !== null) {
        e.preventDefault();
        removeField(selectedFieldId.value);
        return;
    }

    if (isModKey(e) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) { redo(); } else { undo(); }
        return;
    }

    if (isModKey(e) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        redo();
        return;
    }

    if (isModKey(e) && e.key === 'c' && selectedFieldId.value !== null) {
        const f = placedFields.value.find(f => f.id === selectedFieldId.value);
        if (f) clipboardField.value = sanitizeTemplateField(f);
        return;
    }

    if (isModKey(e) && e.key === 'v' && clipboardField.value) {
        e.preventDefault();
        const src = clipboardField.value;
        pushUndo();
        const id = ++fieldSeq;
        placedFields.value.push(sanitizeTemplateField({ ...src, id, x: src.x + 20, y: src.y + 20 }));
        selectedFieldId.value = id;
        clipboardField.value = sanitizeTemplateField({ ...src, x: src.x + 20, y: src.y + 20 });
        return;
    }

    if (isModKey(e) && e.key === 'd') {
        e.preventDefault();
        duplicateField();
    }
}

// ── Save ──────────────────────────────────────────────────────────────────────
function saveTemplate() {
    if (isSaving.value) return;
    isSaving.value = true;
    const editor_state = serializeTemplateEditorState(placedFields.value, scale.value, activePage.value);
    router.put(
        route('templates.update', props.template.id),
        {
            name:         templateName.value.trim() || props.template.name,
            editor_state,
        },
        {
            onError:  () => { isSaving.value = false; },
            onFinish: () => { isSaving.value = false; },
        }
    );
}

function updateSelectedFieldLabel(value) {
    if (!selectedField.value || selectedField.value.label === value) return;
    pushUndo();
    selectedField.value.label = value;
}

function updateSelectedFieldRequired(value) {
    if (!selectedField.value || selectedField.value.required === value) return;
    pushUndo();
    selectedField.value.required = value;
}
</script>

<template>
    <!-- Full-page layout — no WorkspaceLayout so editor fills the viewport -->
    <div class="flex h-screen flex-col overflow-hidden bg-gray-200">
        <SeoRobotsHead />

        <!-- ── TOP BAR ──────────────────────────────────────────────────────── -->
        <header class="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 shadow-sm md:px-4">

            <!-- Back link -->
            <Link
                :href="route('templates.show', template.id)"
                class="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <span class="hidden sm:inline">Templates</span>
            </Link>

            <!-- Template name -->
            <input
                v-model="templateName"
                type="text"
                class="mx-4 flex-1 truncate rounded-lg border border-transparent px-2 py-1 text-center text-sm font-semibold text-gray-800 transition hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                :title="templateName"
            />

            <!-- Save button -->
            <button
                :disabled="isSaving"
                :class="[
                    'flex shrink-0 items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold transition',
                    isSaving
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]',
                ]"
                @click="saveTemplate"
            >
                <svg v-if="isSaving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ isSaving ? 'Saving…' : 'Save Template' }}
            </button>
        </header>

        <!-- ── EDITOR WORKSPACE ──────────────────────────────────────────────── -->
        <div class="flex min-h-0 flex-1 overflow-hidden lg:flex-row">

            <!-- Thumbnail strip -->
            <aside
                ref="thumbStripRef"
                class="flex h-[68px] shrink-0 flex-row items-end gap-2 overflow-x-auto overflow-y-hidden border-b border-gray-200 bg-gray-100 px-3 py-2
                       lg:h-auto lg:w-[72px] lg:flex-col lg:items-stretch lg:overflow-x-hidden lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-2 lg:py-3"
            >
                <template v-for="(dim, i) in pageDims" :key="i">
                    <button class="group flex w-[44px] shrink-0 flex-col items-center gap-0.5 lg:w-full lg:gap-1" @click="scrollToPage(i + 1)">
                        <div
                            :class="[
                                'w-full overflow-hidden rounded border-2 bg-white shadow-sm transition h-[46px] lg:h-auto',
                                activePage === i + 1
                                    ? 'border-blue-600 shadow-blue-200'
                                    : 'border-gray-300 group-hover:border-gray-400',
                            ]"
                        >
                            <canvas :ref="el => { if (el) thumbCanvases[i] = el }" class="block h-full w-auto mx-auto lg:h-auto lg:w-full"/>
                        </div>
                        <span class="hidden text-[9px] font-medium text-gray-500 lg:block">{{ i + 1 }}</span>
                    </button>
                </template>
                <template v-if="isLoading">
                    <div v-for="n in 3" :key="n" class="h-[46px] w-[44px] shrink-0 animate-pulse rounded border border-gray-300 bg-gray-200 lg:h-16 lg:w-full"/>
                </template>
            </aside>

            <!-- PDF viewer + right panel -->
            <div class="flex min-h-0 flex-1 overflow-hidden md:flex-row">

                <!-- PDF viewer -->
                <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-200">

                    <!-- Viewer toolbar -->
                    <div class="flex h-10 shrink-0 items-center justify-between border-b border-gray-300 bg-white px-2 shadow-sm md:px-4">
                        <div class="hidden min-w-0 items-center gap-2 text-xs text-gray-600 md:flex">
                            <svg class="h-3.5 w-3.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-2v2H6v-5h1.5v1.5h2V8.5H11v5H9.5v-2zm4.5 2h-1.5v-5H15c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5zm4.5 0H17v-5h1.5v3.5H19V13.5z"/>
                            </svg>
                            <span class="truncate font-medium text-gray-700">{{ template.name }}</span>
                            <span v-if="numPages" class="shrink-0 text-gray-400">· {{ numPages }}p</span>
                        </div>

                        <div class="flex items-center gap-1">
                            <button class="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100" title="Zoom out" @click="zoomOut">
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
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
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>

                        <div class="flex shrink-0 items-center gap-0.5">
                            <button
                                class="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                                :disabled="activePage <= 1 || !numPages"
                                @click="goToPrevPage"
                            >
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <span class="min-w-[58px] text-center text-xs text-gray-500">{{ activePage }} / {{ numPages || '…' }}</span>
                            <button
                                class="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                                :disabled="activePage >= numPages || !numPages"
                                @click="goToNextPage"
                            >
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Scrollable pages -->
                    <div
                        ref="centerRef"
                        class="relative flex-1 overflow-y-auto overflow-x-auto"
                        :class="placementMode === 'manual' ? 'cursor-crosshair' : 'cursor-default'"
                    >
                        <EditorPlacementHelper
                            :active="placementMode === 'manual'"
                            :message="placementHelperMessage"
                            @cancel="cancelPlacement"
                        />
                        <div v-if="isLoading" class="flex h-full items-center justify-center">
                            <div class="flex flex-col items-center gap-4">
                                <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"/>
                                <p class="text-sm text-gray-500">Loading document…</p>
                            </div>
                        </div>

                        <div v-else-if="loadError" class="flex h-full items-center justify-center p-8 text-center">
                            <div>
                                <p class="mb-2 text-sm font-semibold text-red-600">{{ loadError }}</p>
                                <Link :href="route('templates.index')" class="text-xs text-blue-600 hover:underline">Back to templates</Link>
                            </div>
                        </div>

                        <div v-else class="flex flex-col items-start gap-8 py-6 px-3 md:items-center md:px-6">
                            <div
                                v-for="(dim, i) in pageDims"
                                :key="i"
                                class="page-wrapper relative shadow-xl ring-1 ring-black/10"
                                :style="`width:${dim.w}px; height:${dim.h}px`"
                            >
                                <canvas
                                    :ref="el => { pageCanvases[i] = el ?? undefined }"
                                    class="block"
                                />

                                <!-- Interaction overlay -->
                                <div
                                    class="absolute inset-0 z-10"
                                    @click="onPageClick($event, i + 1)"
                                    @contextmenu="onPageContextMenu"
                                    @mousedown.stop
                                >

                                    <!-- Placed fields -->
                                    <div
                                        v-for="field in placedFieldsOnPage(i + 1)"
                                        :key="field.id"
                                        class="group/field absolute select-none transition-all duration-200"
                                        :class="field.id === selectedFieldId ? 'z-20' : 'z-10'"
                                        :style="`left:${field.x}px; top:${field.y}px; width:${field.w}px; height:${field.h}px; cursor:move`"
                                        @mousedown.stop="startDrag($event, field)"
                                        @touchstart.stop="startDrag($event, field)"
                                        @dblclick.stop="onFieldDoubleClick(field)"
                                        @click.stop
                                    >
                                        <div
                                            class="absolute -left-px -top-5 flex items-center gap-1 rounded-t px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm"
                                            :style="`background:${FIELD_COLOR}`"
                                        >
                                            <span class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/25 text-[7px]">?</span>
                                            <span class="truncate capitalize">{{ field.label || field.type }}</span>
                                        </div>
                                        <TemplateFieldPlaceholder :field="field" :selected="field.id === selectedFieldId" />

                                        <button
                                            type="button"
                                            class="absolute -right-2 -top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition-opacity duration-150 hover:bg-red-600 group-hover/field:opacity-100"
                                            style="font-size:9px"
                                            title="Delete field"
                                            @mousedown.stop
                                            @touchstart.stop
                                            @click.stop="removeField(field.id)"
                                        >✕</button>

                                        <template v-if="field.id === selectedFieldId">
                                            <div
                                                v-for="h in HANDLES"
                                                :key="h.id"
                                                class="absolute z-20 h-2.5 w-2.5 rounded-full border-2 border-white shadow-md"
                                                :class="h.pos"
                                                :style="`cursor:${h.cur}; background:${FIELD_COLOR}`"
                                                @mousedown.stop="startResize($event, field, h.id)"
                                                @touchstart.stop="startResize($event, field, h.id)"
                                            />
                                        </template>
                                    </div>
                                </div>

                                <div class="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-gray-400">
                                    Page {{ i + 1 }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── RIGHT PANEL ─────────────────────────────────────────── -->
                <aside class="flex max-h-[240px] w-full flex-col overflow-y-auto border-t border-gray-200 bg-white sm:max-h-[320px] md:max-h-none md:w-[252px] md:shrink-0 md:border-t-0 md:border-l">

                    <EditorDocumentInfo
                        :filename="template.name"
                        :num-pages="numPages"
                        :file-size="template.fileSize ?? 0"
                    />

                    <EditorEmptyState
                        v-if="placedFields.length === 0"
                        :step="emptyStateStep"
                    />

                    <EditorFieldTypeGrid
                        :field-types="FIELD_TYPES"
                        :active-field-type="activeFieldType"
                        @select="setFieldType"
                    />

                    <div class="border-t border-gray-100 px-3 py-2.5">
                        <p class="text-[11px] text-gray-500">
                            Choose a field type, then click the PDF to place a placeholder. Recipients fill these in when signing.
                        </p>
                    </div>

                    <div v-if="selectedField" class="border-b border-gray-100 px-3 py-2.5">
                        <p class="text-xs font-semibold text-gray-900">Field label</p>
                        <input
                            :value="selectedField.label"
                            type="text"
                            placeholder="Optional custom label"
                            class="mt-2 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            @input="updateSelectedFieldLabel($event.target.value)"
                        />
                        <label class="mt-2 flex items-center gap-2 text-xs text-gray-600">
                            <input
                                type="checkbox"
                                :checked="selectedField.required"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                @change="updateSelectedFieldRequired($event.target.checked)"
                            />
                            Required field
                        </label>
                    </div>

                    <!-- Section: Align (visible when a field is selected) -->
                    <div v-if="selectedField" class="border-b border-gray-100 px-4 py-3">
                        <p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Align — <span class="capitalize">{{ selectedField.type }}</span>
                        </p>
                        <div class="grid grid-cols-3 gap-1">
                            <button
                                v-for="a in ALIGN_TOOLS"
                                :key="a.dir"
                                class="flex flex-col items-center gap-0.5 rounded-lg border border-gray-200 px-1 py-1.5 text-[9px] font-medium text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                :title="a.title"
                                @click="alignField(a.dir)"
                            >
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="a.icon"/>
                                </svg>
                                {{ a.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Section: Placed fields list -->
                    <div class="border-b border-gray-100">
                        <!-- Header with collapse toggle -->
                        <div
                            class="flex items-center justify-between px-4 py-2.5"
                            :class="placedFields.length > 0 ? 'cursor-pointer select-none hover:bg-gray-50' : ''"
                            @click="placedFields.length > 0 && (fieldsListOpen = !fieldsListOpen)"
                        >
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Fields
                                <span
                                    v-if="placedFields.length > 0"
                                    class="ml-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700"
                                >{{ placedFields.length }}</span>
                            </p>
                            <svg
                                v-if="placedFields.length > 0"
                                class="h-3.5 w-3.5 text-gray-400 transition-transform duration-150"
                                :class="fieldsListOpen ? '' : '-rotate-90'"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>

                        <!-- Collapsible list -->
                        <div v-if="placedFields.length > 0 && fieldsListOpen" class="px-3 pb-3">
                            <div class="space-y-1">
                                <div
                                    v-for="field in placedFields"
                                    :key="field.id"
                                    :class="[
                                        'flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 transition',
                                        field.id === selectedFieldId
                                            ? 'border-blue-300 bg-blue-50 shadow-sm'
                                            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50',
                                    ]"
                                    @click="selectedFieldId = field.id; scrollToPage(field.pageNum)"
                                >
                                    <div
                                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[10px] font-bold uppercase"
                                        :class="field.id === selectedFieldId
                                            ? 'border-amber-300 bg-amber-100 text-amber-700'
                                            : 'border-gray-200 bg-gray-50 text-gray-400'"
                                    >
                                        {{ (field.label || field.type).charAt(0) }}
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <p
                                            class="text-[11px] font-semibold capitalize"
                                            :class="field.id === selectedFieldId ? 'text-blue-700' : 'text-gray-700'"
                                        >{{ field.label || field.type }}</p>
                                        <p
                                            class="text-[10px]"
                                            :class="field.id === selectedFieldId ? 'text-blue-400' : 'text-gray-400'"
                                        >p.{{ field.pageNum }}</p>
                                    </div>

                                    <div class="flex shrink-0 items-center gap-0.5">
                                        <button
                                            class="rounded p-0.5 text-gray-300 transition hover:bg-blue-100 hover:text-blue-600"
                                            title="Duplicate (Ctrl+D)"
                                            @click.stop="duplicateField(field.id)"
                                        >
                                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                            </svg>
                                        </button>
                                        <button
                                            class="rounded p-0.5 text-gray-300 transition hover:bg-red-100 hover:text-red-500"
                                            title="Delete (Delete key)"
                                            @click.stop="removeField(field.id)"
                                        >
                                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Undo / Redo buttons -->
                    <div class="border-b border-gray-100 px-3 py-2.5">
                        <div class="flex items-center gap-1.5">
                            <button
                                :disabled="!undoStack.length"
                                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                title="Undo (Ctrl+Z)"
                                @click="undo"
                            >
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6"/>
                                </svg>
                                Undo
                            </button>
                            <button
                                :disabled="!redoStack.length"
                                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                title="Redo (Ctrl+Shift+Z)"
                                @click="redo"
                            >
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6M21 10l-6-6"/>
                                </svg>
                                Redo
                            </button>
                        </div>
                    </div>

                    <div class="flex-1"/>

                    <!-- Footer: keyboard shortcuts -->
                    <div class="border-t border-gray-100 px-4 py-3">
                        <div class="flex flex-wrap gap-x-3 gap-y-1.5">
                            <span class="text-[10px] text-gray-400">
                                <kbd class="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium text-gray-600">Del</kbd> remove
                            </span>
                            <span class="text-[10px] text-gray-400">
                                <kbd class="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium text-gray-600">Ctrl+D</kbd> duplicate
                            </span>
                            <span class="text-[10px] text-gray-400">
                                <kbd class="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium text-gray-600">Esc</kbd> deselect
                            </span>
                            <span class="text-[10px] text-gray-400">
                                <kbd class="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium text-gray-600">Ctrl+Z</kbd> undo
                            </span>
                            <span class="text-[10px] text-gray-400">
                                <kbd class="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium text-gray-600">Ctrl+⇧Z</kbd> redo
                            </span>
                            <span class="text-[10px] text-gray-400">
                                <kbd class="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium text-gray-600">Ctrl+C/V</kbd> copy/paste
                            </span>
                        </div>
                    </div>

                </aside>
            </div>
        </div>

    </div>
</template>
