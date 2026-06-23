<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

const { getDocument, GlobalWorkerOptions } = pdfjsLib;
GlobalWorkerOptions.workerSrc = workerUrl;

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

// ── Template state ────────────────────────────────────────────────────────────
const templateName = ref(props.template.name);
const isSaving     = ref(false);

// ── Field placement ───────────────────────────────────────────────────────────
const placedFields    = ref([]);
const placementMode   = ref(null);
const selectedFieldId = ref(null);
const activeFieldType = ref('signature');
const pendingText     = ref('');
const pendingDate     = ref(new Date().toLocaleDateString());
let   fieldSeq        = 0;
const clipboardField  = ref(null);

// ── Undo / Redo ───────────────────────────────────────────────────────────────
const undoStack   = ref([]);
const redoStack   = ref([]);
let   dragDidMove   = false;
let   resizeDidMove = false;

// ── UI state ──────────────────────────────────────────────────────────────────
const fieldsListOpen = ref(true);

// ── Drag / Resize ─────────────────────────────────────────────────────────────
let activeDrag   = null;
let prevX = 0, prevY = 0;
let isResizing   = false;
let resizeHandle = null;
let resizeSig    = null;
let rsStartW = 0, rsStartH = 0, rsStartX = 0, rsStartY = 0;
let rsClientX = 0, rsClientY = 0;

// ── Constants ─────────────────────────────────────────────────────────────────
const FIELD_TYPES = [
    {
        id: 'signature', label: 'Signature',
        paths: ['M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'],
    },
    {
        id: 'initials', label: 'Initials',
        paths: ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
    },
    {
        id: 'date', label: 'Date',
        paths: ['M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
    },
    {
        id: 'name', label: 'Name',
        paths: ['M16 7a4 4 0 11-8 0 4 4 0 018 0z', 'M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
    },
    {
        id: 'text', label: 'Text',
        paths: ['M4 6h16M4 12h16M4 18h7'],
    },
    {
        id: 'checkbox', label: 'Checkbox',
        paths: ['M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
    },
];

const FIELD_DEFAULTS = {
    signature: { w: 180, h: 60 },
    initials:  { w: 90,  h: 40 },
    date:      { w: 140, h: 32 },
    name:      { w: 160, h: 32 },
    text:      { w: 160, h: 32 },
    checkbox:  { w: 28,  h: 28 },
};

const FIELD_COLOR = '#3B82F6';

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

const ALIGN_TOOLS = [
    { dir: 'left',   label: 'Left',   title: 'Align to left edge',   icon: 'M4 4v16M8 12h12' },
    { dir: 'cx',     label: 'Center', title: 'Center horizontally',  icon: 'M12 4v16M7 12h4m2 0h4' },
    { dir: 'right',  label: 'Right',  title: 'Align to right edge',  icon: 'M20 4v16M4 12h12' },
    { dir: 'top',    label: 'Top',    title: 'Align to top edge',    icon: 'M4 4h16M12 8v12' },
    { dir: 'cy',     label: 'Middle', title: 'Center vertically',    icon: 'M4 12h16M12 7v4m0 2v4' },
    { dir: 'bottom', label: 'Bottom', title: 'Align to bottom edge', icon: 'M4 20h16M12 4v12' },
];

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
onMounted(async () => {
    window.addEventListener('mousemove', onGlobalMove);
    window.addEventListener('mouseup',   onGlobalUp);
    window.addEventListener('touchmove', onGlobalMove, { passive: false });
    window.addEventListener('touchend',  onGlobalUp);
    window.addEventListener('keydown',   onKeyDown);

    if (props.template.editorState?.scale) {
        scale.value = props.template.editorState.scale;
    }

    await loadPdf(props.template.pdfUrl);

    if (props.template.editorState?.placedFields?.length) {
        placedFields.value = props.template.editorState.placedFields;
        fieldSeq = Math.max(0, ...props.template.editorState.placedFields.map(f => (typeof f.id === 'number' ? f.id : 0)));
        if (props.template.editorState.activePage) {
            await nextTick();
            scrollToPage(props.template.editorState.activePage);
        }
    }
});

onBeforeUnmount(() => {
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
        const task = getDocument({ data: arrayBuffer });
        pdfDoc         = await task.promise;
        numPages.value = pdfDoc.numPages;
    } catch {
        loadError.value = 'Could not parse the document. Please re-upload.';
        isLoading.value = false;
        return;
    }

    isLoading.value = false;

    for (let i = 1; i <= numPages.value; i++) {
        await nextTick();
        try { await renderPage(i); }  catch (e) { console.error(`[CubSign] Page ${i}:`, e); }
        try { await renderThumb(i); } catch (e) { console.error(`[CubSign] Thumb ${i}:`, e); }
    }

    if (window.innerWidth < 768 && pageDims.value[0]) {
        await fitWidth();
        await nextTick();
    }
    setupScrollObserver();
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
        try { await renderPage(i); } catch (e) { console.error(e); }
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
                    const p = parseInt(entry.target.dataset.pageNum);
                    if (!isNaN(p)) activePage.value = p;
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
}

function redo() {
    if (!redoStack.value.length) return;
    undoStack.value.push(JSON.stringify(placedFields.value));
    placedFields.value = JSON.parse(redoStack.value.pop());
    selectedFieldId.value = null;
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
    if (type === 'date') {
        pendingDate.value = new Date().toLocaleDateString();
    } else {
        pendingText.value = '';
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
    const x    = Math.max(0, e.clientX - rect.left - def.w / 2);
    const y    = Math.max(0, e.clientY - rect.top  - def.h / 2);
    placeField(pageNum, x, y);
    placementMode.value = null;
}

function placeField(pageNum, x, y, w, h) {
    pushUndo();
    const type = activeFieldType.value;
    const id   = ++fieldSeq;
    const def  = FIELD_DEFAULTS[type];
    let value;
    if (type === 'signature') {
        value = { sigType: 'text', src: 'Signature', font: 'font-sans italic text-lg tracking-wide' };
    } else if (type === 'initials') {
        value = { sigType: 'text', src: 'Initials', font: 'font-sans italic text-lg tracking-wide' };
    } else if (type === 'date') {
        value = pendingDate.value || new Date().toLocaleDateString();
    } else if (type === 'checkbox') {
        value = false;
    } else {
        value = pendingText.value;
    }
    placedFields.value.push({ id, type, pageNum, x, y, w: w ?? def.w, h: h ?? def.h, value });
    selectedFieldId.value = id;
}

function removeField(id) {
    pushUndo();
    placedFields.value = placedFields.value.filter(f => f.id !== id);
    if (selectedFieldId.value === id) selectedFieldId.value = null;
}

function toggleCheckbox(field) {
    field.value = !field.value;
}

function placedFieldsOnPage(pageNum) {
    return placedFields.value.filter(f => f.pageNum === pageNum);
}

function duplicateField(sourceId) {
    const f = placedFields.value.find(f => f.id === (sourceId ?? selectedFieldId.value));
    if (!f) return;
    pushUndo();
    const id      = ++fieldSeq;
    const valCopy = (typeof f.value === 'object' && f.value !== null) ? { ...f.value } : f.value;
    placedFields.value.push({ ...f, id, x: f.x + 20, y: f.y + 20, value: valCopy });
    selectedFieldId.value = id;
}

function iconPathsForType(type) {
    return FIELD_TYPES.find(ft => ft.id === type)?.paths ?? [];
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
        prevX = clientX;
        prevY = clientY;
    }
    if (isResizing && resizeSig) {
        if (!resizeDidMove) { pushUndo(); resizeDidMove = true; }
        const dx = clientX - rsClientX;
        const dy = clientY - rsClientY;
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

    if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) { redo(); } else { undo(); }
        return;
    }

    if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        redo();
        return;
    }

    if (e.ctrlKey && e.key === 'c' && selectedFieldId.value !== null) {
        const f = placedFields.value.find(f => f.id === selectedFieldId.value);
        if (f) clipboardField.value = { ...f, value: (typeof f.value === 'object' && f.value !== null) ? { ...f.value } : f.value };
        return;
    }

    if (e.ctrlKey && e.key === 'v' && clipboardField.value) {
        e.preventDefault();
        const src     = clipboardField.value;
        pushUndo();
        const id      = ++fieldSeq;
        const valCopy = (typeof src.value === 'object' && src.value !== null) ? { ...src.value } : src.value;
        placedFields.value.push({ ...src, id, x: src.x + 20, y: src.y + 20, value: valCopy });
        selectedFieldId.value = id;
        clipboardField.value  = { ...src, x: src.x + 20, y: src.y + 20 };
        return;
    }

    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        duplicateField();
    }
}

// ── Save ──────────────────────────────────────────────────────────────────────
function saveTemplate() {
    if (isSaving.value) return;
    isSaving.value = true;
    router.put(
        route('templates.update', props.template.id),
        {
            name:         templateName.value.trim() || props.template.name,
            editor_state: {
                placedFields: placedFields.value,
                scale:        scale.value,
                activePage:   activePage.value,
            },
        },
        {
            onError:  () => { isSaving.value = false; },
            onFinish: () => { isSaving.value = false; },
        }
    );
}

function fieldTypeLabel(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<template>
    <!-- Full-page layout — no WorkspaceLayout so editor fills the viewport -->
    <div class="flex h-screen flex-col overflow-hidden bg-gray-200">

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
                        <p class="hidden min-w-0 truncate text-xs font-medium text-gray-600 md:block">{{ template.name }}</p>

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

                    <!-- Placement banner -->
                    <div v-if="placementMode === 'manual'" class="flex shrink-0 items-center justify-between bg-blue-600 px-3 py-2 md:px-4">
                        <div class="flex items-center gap-2">
                            <svg class="h-4 w-4 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
                            </svg>
                            <span class="text-xs font-semibold text-white md:text-sm">Click anywhere on the document to place the {{ activeFieldType }} field</span>
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
                                    :ref="el => { if (el) pageCanvases[i] = el }"
                                    class="block"
                                    :width="dim.w"
                                    :height="dim.h"
                                />

                                <!-- Interaction overlay -->
                                <div class="absolute inset-0 z-10" @click="onPageClick($event, i + 1)" @mousedown.stop>

                                    <!-- Placed fields -->
                                    <div
                                        v-for="field in placedFieldsOnPage(i + 1)"
                                        :key="field.id"
                                        class="absolute select-none"
                                        :style="`left:${field.x}px; top:${field.y}px; width:${field.w}px; height:${field.h}px; cursor:move`"
                                        @mousedown.stop="startDrag($event, field)"
                                        @touchstart.stop="startDrag($event, field)"
                                        @click.stop
                                    >
                                        <div
                                            class="relative h-full w-full overflow-hidden rounded"
                                            :style="field.id === selectedFieldId
                                                ? 'background:rgba(59,130,246,0.12); outline:3px solid #3B82F6; outline-offset:2px; box-shadow:0 0 0 5px rgba(59,130,246,0.15);'
                                                : 'background:rgba(239,246,255,0.45); outline:1.5px solid #3B82F660; outline-offset:0;'"
                                        >
                                            <!-- Signature / Initials placeholder -->
                                            <template v-if="field.type === 'signature' || field.type === 'initials'">
                                                <div
                                                    class="flex h-full w-full items-center justify-center px-2"
                                                    :class="field.value?.font"
                                                    style="color:#1e40af"
                                                >{{ field.value?.src }}</div>
                                            </template>

                                            <!-- Checkbox -->
                                            <template v-else-if="field.type === 'checkbox'">
                                                <div
                                                    class="flex h-full w-full items-center justify-center rounded bg-white"
                                                    :style="`border:2px solid ${FIELD_COLOR}`"
                                                    @click.stop="toggleCheckbox(field)"
                                                >
                                                    <svg v-if="field.value" class="h-3/4 w-3/4" fill="none" stroke="currentColor" viewBox="0 0 24 24" :style="`color:${FIELD_COLOR}`">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </div>
                                            </template>

                                            <!-- Date / Name / Text -->
                                            <template v-else>
                                                <div
                                                    class="flex h-full w-full items-center overflow-hidden px-2"
                                                    :style="`border:1px solid ${FIELD_COLOR}40; background:${FIELD_COLOR}0d`"
                                                >
                                                    <span class="truncate text-xs text-gray-800">{{ field.value || '…' }}</span>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- Type badge -->
                                        <span
                                            class="absolute -left-px -top-4 truncate rounded-t px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-white"
                                            :style="`background:${FIELD_COLOR}`"
                                        >{{ field.type }}</span>

                                        <!-- Resize handles (when selected) -->
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
                                            <button
                                                class="absolute -right-3 -top-3 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                                                style="font-size:9px;line-height:1"
                                                @mousedown.stop
                                                @touchstart.stop
                                                @click.stop="removeField(field.id)"
                                            >✕</button>
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
                <aside class="flex max-h-[320px] w-full flex-col overflow-y-auto border-t border-gray-200 bg-white sm:max-h-[360px] md:max-h-none md:w-[268px] md:shrink-0 md:border-t-0 md:border-l">

                    <!-- Section: Field Type -->
                    <div class="border-b border-gray-100 px-4 py-3">
                        <p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Field Type</p>
                        <div class="grid grid-cols-3 gap-1.5">
                            <button
                                v-for="ft in FIELD_TYPES"
                                :key="ft.id"
                                :class="[
                                    'flex flex-col items-center gap-1 rounded-lg py-2 px-1 text-[10px] font-semibold transition',
                                    activeFieldType === ft.id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'border border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700',
                                ]"
                                @click="setFieldType(ft.id)"
                            >
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        v-for="p in ft.paths"
                                        :key="p"
                                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        :d="p"
                                    />
                                </svg>
                                {{ ft.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Section: Configure -->
                    <div class="border-b border-gray-100 px-4 py-3">
                        <p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Configure</p>

                        <template v-if="activeFieldType === 'signature' || activeFieldType === 'initials'">
                            <p class="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                                Places a labeled
                                <span class="font-medium capitalize text-gray-700">{{ activeFieldType }}</span>
                                box. Recipients fill it in when signing.
                            </p>
                        </template>

                        <template v-else-if="activeFieldType === 'date'">
                            <p class="mb-2 text-xs text-gray-500">Default date shown on the template.</p>
                            <input
                                v-model="pendingDate"
                                type="text"
                                placeholder="e.g. 6/23/2026"
                                class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </template>

                        <template v-else-if="activeFieldType === 'name' || activeFieldType === 'text'">
                            <p class="mb-2 text-xs text-gray-500">
                                {{ activeFieldType === 'name' ? 'Pre-fill a name, or leave empty.' : 'Enter default text, or leave empty.' }}
                            </p>
                            <input
                                v-model="pendingText"
                                type="text"
                                :placeholder="activeFieldType === 'name' ? 'Full name…' : 'Enter text…'"
                                class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </template>

                        <template v-else>
                            <p class="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                                Places an unchecked checkbox. Click a placed checkbox to toggle its default state.
                            </p>
                        </template>
                    </div>

                    <!-- Section: Place Field -->
                    <div class="border-b border-gray-100 px-4 py-3">
                        <p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Place Field</p>

                        <div v-if="placementMode === 'manual'" class="mb-2 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                            <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"/>
                            Click on the PDF to place
                            <button class="ml-auto text-blue-400 hover:text-blue-700" @click="placementMode = null">✕</button>
                        </div>

                        <button
                            :class="[
                                'flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition active:scale-[0.98]',
                                placementMode === 'manual'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400'
                                    : 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
                            ]"
                            @click="placementMode = 'manual'"
                        >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
                            </svg>
                            Place {{ fieldTypeLabel(activeFieldType) }}
                        </button>
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

                        <!-- Empty state -->
                        <div v-if="placedFields.length === 0" class="px-4 pb-5 pt-1 text-center">
                            <svg class="mx-auto mb-2 h-8 w-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                            </svg>
                            <p class="text-xs text-gray-400">No fields placed yet</p>
                            <p class="mt-0.5 text-[10px] text-gray-300">Select a type above, then click Place.</p>
                        </div>

                        <!-- Collapsible list -->
                        <div v-else-if="fieldsListOpen" class="px-3 pb-3">
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
                                    <!-- Type icon -->
                                    <div
                                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded border"
                                        :class="field.id === selectedFieldId
                                            ? 'border-blue-300 bg-blue-100 text-blue-600'
                                            : 'border-gray-200 bg-gray-50 text-gray-400'"
                                    >
                                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                v-for="p in iconPathsForType(field.type)"
                                                :key="p"
                                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                :d="p"
                                            />
                                        </svg>
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <p
                                            class="text-[11px] font-semibold capitalize"
                                            :class="field.id === selectedFieldId ? 'text-blue-700' : 'text-gray-700'"
                                        >{{ field.type }}</p>
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
