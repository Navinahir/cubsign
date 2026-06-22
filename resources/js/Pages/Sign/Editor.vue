<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
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

const FIELD_TYPES = [
    { id: 'signature', label: 'Signature' },
    { id: 'initials',  label: 'Initials'  },
    { id: 'date',      label: 'Date'      },
    { id: 'name',      label: 'Name'      },
    { id: 'text',      label: 'Text'      },
    { id: 'checkbox',  label: 'Checkbox'  },
];

const FIELD_DEFAULTS = {
    signature: { w: 180, h: 60 },
    initials:  { w: 90,  h: 40 },
    date:      { w: 140, h: 32 },
    name:      { w: 160, h: 32 },
    text:      { w: 160, h: 32 },
    checkbox:  { w: 28,  h: 28 },
};

const RECIPIENT_COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];
const COLOR_NAMES      = { '#3B82F6':'Blue', '#10B981':'Green', '#F59E0B':'Amber', '#EF4444':'Red', '#8B5CF6':'Purple', '#EC4899':'Pink' };

// Prepared for future multi-step send workflow — no UI built yet
const SEND_WORKFLOW_STEPS = [
    { id: 'upload',     label: 'Upload'     },
    { id: 'recipients', label: 'Recipients' },
    { id: 'prepare',    label: 'Prepare'    },
    { id: 'review',     label: 'Review'     },
    { id: 'send',       label: 'Send'       },
];

// ── Recipients ───────────────────────────────────────────────────────────
let   recipientSeq        = 1;
let   dragRecipientId     = null;
const dragOverRecipientId = ref(null);
const recipients          = ref([{ id: 1, name: '', email: '', color: RECIPIENT_COLORS[0], role: 'signer', signingOrder: 1, status: 'pending' }]);
const activeRecipientId   = ref(1);

// ── Placement state ─────────────────────────────────────────────────────
const capturedSig     = ref(null);    // { type, src, font? } — pending sig/initials before placement
const placedFields    = ref([]);      // [{ id, type, pageNum, x, y, w, h, value }]
const placementMode   = ref(null);    // 'manual' | null
const detectedFields  = ref([]);      // detected signature field positions
const isDetecting     = ref(false);
const showFields      = ref(false);
const detectionRan    = ref(false);
const selectedSigId   = ref(null);
const activeFieldType = ref('signature'); // 'signature'|'initials'|'date'|'name'|'text'|'checkbox'
const pendingText     = ref('');      // value for name/text fields before placing
const pendingDate     = ref(new Date().toLocaleDateString()); // value for date field before placing
let   fieldSeq        = 0;
const isFinishing     = ref(false);
const clipboardField  = ref(null);   // Ctrl+C / Ctrl+V internal clipboard
const thumbStripRef   = ref(null);   // for auto-scrolling the thumbnail aside
let   intersectionObs = null;        // scroll-based active-page tracking

// ── Drag / resize ───────────────────────────────────────────────────────
let activeDrag   = null;
let prevX = 0, prevY = 0;
let isResizing   = false;
let resizeHandle = null;
let resizeSig    = null;
let rsStartW = 0, rsStartH = 0, rsStartX = 0, rsStartY = 0;
let rsClientX = 0, rsClientY = 0;

// ── Computed ─────────────────────────────────────────────────────────────
const isAuthenticated = computed(() => !!usePage().props.auth?.user);

const signatureReady = computed(() => {
    if (activeTab.value === 'draw')   return hasDrawing.value;
    if (activeTab.value === 'type')   return typedName.value.trim().length >= 2;
    if (activeTab.value === 'upload') return uploadedSig.value !== null;
    return false;
});

const workflowStep = computed(() => {
    if (placedFields.value.length > 0) return 3;
    if (capturedSig.value)           return 2;
    return 1;
});

const selectedFont = computed(
    () => typeFonts.find(f => f.id === typedFont.value) ?? typeFonts[0]
);

const zoomSelect = computed({
    get: () => {
        const found = [0.5, 0.75, 1.0, 1.25, 1.5].find(p => Math.abs(scale.value - p) < 0.01);
        return found !== undefined ? String(found) : 'custom';
    },
    set: (val) => {
        if (val === 'fit')    { fitWidth();                return; }
        if (val === 'custom') {                            return; }
        scale.value = parseFloat(val);
        rerenderAll();
    },
});

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
    window.addEventListener('mousemove', onGlobalMove);
    window.addEventListener('mouseup',   onGlobalUp);
    // non-passive so we can preventDefault() to stop scroll during touch drag/resize
    window.addEventListener('touchmove', onGlobalMove, { passive: false });
    window.addEventListener('touchend',  onGlobalUp);
    window.addEventListener('keydown',   onKeyDown);
    await loadPdf(props.session.pdfUrl);
});

onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onGlobalMove);
    window.removeEventListener('mouseup',   onGlobalUp);
    window.removeEventListener('touchmove', onGlobalMove);
    window.removeEventListener('touchend',  onGlobalUp);
    window.removeEventListener('keydown',   onKeyDown);
    if (intersectionObs) intersectionObs.disconnect();
});

watch(activeTab, async (tab) => {
    if (tab === 'draw') {
        await nextTick();
        initSigCanvas();
    }
});

watch(activePage, async (pageNum) => {
    await nextTick();
    if (!thumbStripRef.value) return;
    thumbStripRef.value.querySelectorAll('button')[pageNum - 1]
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
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

    // Auto-fit PDF width on narrow screens so the page is immediately readable
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
    const rect  = sigCanvasRef.value.getBoundingClientRect();
    // Support both mouse events and touch events
    const point = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
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
    if (placementMode.value !== 'manual') {
        selectedSigId.value = null;   // deselect when clicking empty space
        return;
    }
    const type = activeFieldType.value;
    if ((type === 'signature' || type === 'initials') && !capturedSig.value) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const def  = FIELD_DEFAULTS[type];
    const x    = Math.max(0, e.clientX - rect.left - def.w / 2);
    const y    = Math.max(0, e.clientY - rect.top  - def.h / 2);
    placeField(pageNum, x, y);
    placementMode.value = null;
}

function placeField(pageNum, x, y, w, h) {
    const type = activeFieldType.value;
    const id   = ++fieldSeq;
    const def  = FIELD_DEFAULTS[type];
    let value;
    if (type === 'signature' || type === 'initials') {
        value = { sigType: capturedSig.value.type, src: capturedSig.value.src, font: capturedSig.value.font };
    } else if (type === 'date') {
        value = pendingDate.value || new Date().toLocaleDateString();
    } else if (type === 'name' || type === 'text') {
        value = pendingText.value;
    } else {
        value = false; // checkbox — starts unchecked
    }
    placedFields.value.push({ id, type, pageNum, x, y, w: w ?? def.w, h: h ?? def.h, value, signerId: activeRecipientId.value });
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
    placeField(field.pageNum, Math.max(0, field.x - 5), field.y, 180, 60);
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

// ── Remove / toggle field ─────────────────────────────────────────────────
function removeField(id) {
    placedFields.value = placedFields.value.filter(f => f.id !== id);
    if (selectedSigId.value === id) selectedSigId.value = null;
}

function toggleCheckbox(field) {
    field.value = !field.value;
}

function placedFieldsOnPage(pageNum) {
    return placedFields.value.filter(f => f.pageNum === pageNum);
}

function detectedFieldsOnPage(pageNum) {
    return detectedFields.value.filter(f => f.pageNum === pageNum);
}

// ── Field type selector ───────────────────────────────────────────────────
function setFieldType(type) {
    activeFieldType.value = type;
    if (type !== 'signature' && type !== 'initials') {
        capturedSig.value    = null;
        placementMode.value  = null;
        detectedFields.value = [];
        showFields.value     = false;
        detectionRan.value   = false;
    }
    if (type === 'date') {
        pendingDate.value = new Date().toLocaleDateString();
    } else {
        pendingText.value = '';
    }
}

// ── Recipient management ──────────────────────────────────────────────────
function recipientById(id) {
    return recipients.value.find(r => r.id === id);
}

function addRecipient() {
    const id           = ++recipientSeq;
    const signingOrder = recipients.value.length + 1;
    const color        = RECIPIENT_COLORS[(recipients.value.length) % RECIPIENT_COLORS.length];
    recipients.value.push({ id, name: '', email: '', color, role: 'signer', signingOrder, status: 'pending' });
    activeRecipientId.value = id;
}

function removeRecipient(id) {
    if (recipients.value.length <= 1) return;
    recipients.value = recipients.value.filter(r => r.id !== id);
    // Renumber signingOrder after removal
    recipients.value.forEach((r, i) => { r.signingOrder = i + 1; });
    if (activeRecipientId.value === id) {
        activeRecipientId.value = recipients.value[0].id;
    }
    placedFields.value.forEach(f => {
        if (f.signerId === id) f.signerId = recipients.value[0].id;
    });
}

// ── Recipient UI helpers ──────────────────────────────────────────────────
function fieldCountsForRecipient(recipientId) {
    const counts = {};
    placedFields.value.forEach(f => {
        if (f.signerId === recipientId) counts[f.type] = (counts[f.type] || 0) + 1;
    });
    return counts;
}

function fieldCountLabel(type, count) {
    const map = {
        signature: ['Signature',  'Signatures' ],
        initials:  ['Initials',   'Initials'   ],
        date:      ['Date',       'Dates'      ],
        name:      ['Name',       'Names'      ],
        text:      ['Text',       'Text'       ],
        checkbox:  ['Checkbox',   'Checkboxes' ],
    };
    const pair = map[type] ?? [type, type];
    return count > 1 ? pair[1] : pair[0];
}

function recipientDisplayName(id) {
    const r = recipientById(id);
    if (!r) return '?';
    return r.name.trim() ? r.name.trim().split(' ')[0] : `#${r.signingOrder}`;
}

function fieldsForRecipient(recipientId) {
    return placedFields.value.filter(f => f.signerId === recipientId);
}

function fieldLabel(field) {
    const peers = placedFields.value.filter(f => f.signerId === field.signerId && f.type === field.type);
    const n     = peers.findIndex(f => f.id === field.id) + 1;
    const type  = field.type.charAt(0).toUpperCase() + field.type.slice(1);
    return `${type} #${n}`;
}

function navigateToField(field) {
    activeRecipientId.value = field.signerId;
    selectedSigId.value     = field.id;
    scrollToPage(field.pageNum);
}

function statusBadgeClass(status) {
    const base = 'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize';
    const map  = { pending: 'bg-gray-100 text-gray-500', viewed: 'bg-blue-100 text-blue-600', signed: 'bg-emerald-100 text-emerald-700', declined: 'bg-red-100 text-red-600', completed: 'bg-emerald-100 text-emerald-700' };
    return `${base} ${map[status] ?? map.pending}`;
}

// ── Recipient drag-and-drop reordering ────────────────────────────────────
function onRecipientDragStart(e, id) {
    dragRecipientId = id;
    e.dataTransfer.effectAllowed = 'move';
}

function onRecipientDragOver(e, id) {
    e.preventDefault();
    dragOverRecipientId.value = id;
}

function onRecipientDragLeave(e) {
    // Only clear when leaving the list container entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
        dragOverRecipientId.value = null;
    }
}

function onRecipientDrop(e, targetId) {
    e.preventDefault();
    dragOverRecipientId.value = null;
    if (!dragRecipientId || dragRecipientId === targetId) { dragRecipientId = null; return; }
    const arr  = [...recipients.value];
    const from = arr.findIndex(r => r.id === dragRecipientId);
    const to   = arr.findIndex(r => r.id === targetId);
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    arr.forEach((r, i) => { r.signingOrder = i + 1; });
    recipients.value = arr;
    dragRecipientId  = null;
}

function onRecipientDragEnd() {
    dragRecipientId       = null;
    dragOverRecipientId.value = null;
}

// ── Drag / Resize — shared touch+mouse coord helper ───────────────────────
function getEventCoords(e) {
    const p = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    return { clientX: p.clientX, clientY: p.clientY };
}

function startDrag(e, sig) {
    if (isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    selectedSigId.value = sig.id;
    activeDrag = sig;
    const { clientX, clientY } = getEventCoords(e);
    prevX = clientX;
    prevY = clientY;
}

function onGlobalMove(e) {
    if (!activeDrag && !isResizing) return;
    // Prevent page scroll while dragging/resizing on touch devices
    if (e.type === 'touchmove' && e.cancelable) e.preventDefault();
    const { clientX, clientY } = getEventCoords(e);
    if (activeDrag && !isResizing) {
        activeDrag.x += clientX - prevX;
        activeDrag.y += clientY - prevY;
        prevX = clientX;
        prevY = clientY;
    }
    if (isResizing && resizeSig) {
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
    const { clientX, clientY } = getEventCoords(e);
    rsClientX    = clientX;
    rsClientY    = clientY;
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

// ── Duplicate selected field ──────────────────────────────────────────────
function duplicateField(sourceId) {
    const f = placedFields.value.find(f => f.id === (sourceId ?? selectedSigId.value));
    if (!f) return;
    const id      = ++fieldSeq;
    const valCopy = (typeof f.value === 'object' && f.value !== null) ? { ...f.value } : f.value;
    placedFields.value.push({ ...f, id, x: f.x + 20, y: f.y + 20, value: valCopy });
    selectedSigId.value = id;
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────
function onKeyDown(e) {
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.key === 'Escape') {
        e.preventDefault();
        if (placementMode.value) {
            placementMode.value = null;
        } else {
            selectedSigId.value = null;
        }
        return;
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSigId.value !== null) {
        e.preventDefault();
        removeField(selectedSigId.value);
        return;
    }

    if (e.ctrlKey && e.key === 'c' && selectedSigId.value !== null) {
        const f = placedFields.value.find(f => f.id === selectedSigId.value);
        if (f) clipboardField.value = { ...f, value: (typeof f.value === 'object' && f.value !== null) ? { ...f.value } : f.value };
        return;
    }

    if (e.ctrlKey && e.key === 'v' && clipboardField.value) {
        e.preventDefault();
        const src     = clipboardField.value;
        const id      = ++fieldSeq;
        const valCopy = (typeof src.value === 'object' && src.value !== null) ? { ...src.value } : src.value;
        placedFields.value.push({ ...src, id, x: src.x + 20, y: src.y + 20, value: valCopy });
        selectedSigId.value  = id;
        clipboardField.value = { ...src, x: src.x + 20, y: src.y + 20 };
        return;
    }

    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        duplicateField();
    }
}

// ── Page navigation ───────────────────────────────────────────────────────
function goToPrevPage() {
    if (activePage.value > 1) scrollToPage(activePage.value - 1);
}

function goToNextPage() {
    if (activePage.value < numPages.value) scrollToPage(activePage.value + 1);
}

// ── Fit-width zoom ────────────────────────────────────────────────────────
async function fitWidth() {
    if (!centerRef.value || !pageDims.value[0]) return;
    const available = centerRef.value.clientWidth - 80;
    const nativeW   = pageDims.value[0].w / scale.value;
    scale.value = Math.min(3.0, Math.max(0.4, parseFloat((available / nativeW).toFixed(2))));
    await rerenderAll();
}

// ── Scroll-based active-page tracking ────────────────────────────────────
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

// ── PDF signing + download ────────────────────────────────────────────────
async function generateSignedPdf() {
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

    const res = await fetch(props.session.pdfUrl, { credentials: 'same-origin' });
    const originalBytes = await res.arrayBuffer();
    const pdflibDoc = await PDFDocument.load(originalBytes);
    const pages     = pdflibDoc.getPages();
    const helvetica = await pdflibDoc.embedFont(StandardFonts.Helvetica);

    for (const field of placedFields.value) {
        const page = pages[field.pageNum - 1];
        if (!page) continue;

        const { width: pageW, height: pageH } = page.getSize();
        const dim = pageDims.value[field.pageNum - 1];
        if (!dim) continue;

        // Convert canvas pixels → PDF points (PDF y=0 is bottom-left)
        const scaleX = pageW / dim.w;
        const scaleY = pageH / dim.h;
        const pdfX   = field.x * scaleX;
        const pdfY   = pageH - (field.y + field.h) * scaleY;
        const pdfW   = field.w * scaleX;
        const pdfH   = field.h * scaleY;

        if (field.type === 'signature' || field.type === 'initials') {
            const val = field.value;
            let pngBytes;
            if (val.sigType === 'image') {
                const b64 = val.src.split(',')[1];
                pngBytes  = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
            } else {
                // Typed text → temp canvas → PNG
                const tmp = document.createElement('canvas');
                const dpr = 2;
                tmp.width  = field.w * dpr;
                tmp.height = field.h * dpr;
                const ctx  = tmp.getContext('2d');
                ctx.scale(dpr, dpr);
                const isGeorgia = val.font?.includes('Georgia');
                const isBold    = val.font?.includes('font-bold');
                const isItalic  = val.font?.includes('italic');
                const family    = isGeorgia ? 'Georgia, serif' : 'Arial, sans-serif';
                const style     = (isBold ? 'bold ' : '') + (isItalic ? 'italic ' : '');
                const fontSize  = Math.round(field.h * 0.55);
                ctx.fillStyle   = '#1e40af';
                ctx.font        = `${style}${fontSize}px ${family}`;
                ctx.textBaseline = 'middle';
                ctx.fillText(val.src, 6, field.h / 2);
                const b64 = tmp.toDataURL('image/png').split(',')[1];
                pngBytes  = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
            }
            const img = await pdflibDoc.embedPng(pngBytes);
            page.drawImage(img, { x: pdfX, y: pdfY, width: pdfW, height: pdfH });

        } else if (field.type === 'date' || field.type === 'name' || field.type === 'text') {
            const text = String(field.value || '');
            if (!text.trim()) continue;
            const fontSize = Math.max(8, Math.min(14, pdfH * 0.55));
            page.drawText(text, {
                x:    pdfX + 4,
                y:    pdfY + (pdfH - fontSize) / 2,
                size: fontSize,
                font: helvetica,
                color: rgb(0, 0, 0),
            });

        } else if (field.type === 'checkbox') {
            page.drawRectangle({
                x: pdfX + 1, y: pdfY + 1,
                width:       pdfW - 2,
                height:      pdfH - 2,
                borderColor: rgb(0.2, 0.2, 0.2),
                borderWidth: 1.5,
                color:       rgb(1, 1, 1),
            });
            if (field.value === true) {
                page.drawLine({
                    start:     { x: pdfX + pdfW * 0.15, y: pdfY + pdfH * 0.45 },
                    end:       { x: pdfX + pdfW * 0.42, y: pdfY + pdfH * 0.2  },
                    thickness: 1.5,
                    color:     rgb(0.1, 0.1, 0.8),
                });
                page.drawLine({
                    start:     { x: pdfX + pdfW * 0.42, y: pdfY + pdfH * 0.2  },
                    end:       { x: pdfX + pdfW * 0.85, y: pdfY + pdfH * 0.72 },
                    thickness: 1.5,
                    color:     rgb(0.1, 0.1, 0.8),
                });
            }
        }
    }

    return pdflibDoc.save();
}

async function goToReview() {
    if (placedFields.value.length === 0 || isFinishing.value) return;
    isFinishing.value = true;
    try {
        const bytes = await generateSignedPdf();
        const prevSaved = window.__cubsignSession?.token === props.session.token
            ? (window.__cubsignSession.documentSaved ?? false)
            : false;
        window.__cubsignSession = {
            token:         props.session.token,
            signedPdf:     bytes,
            filename:      props.session.filename,
            reviewData:    { pageCount: numPages.value, fieldCount: placedFields.value.length },
            documentSaved: prevSaved,
        };
        router.visit(route('sign.review'));
    } catch (err) {
        console.error('[CubSign] PDF generation error:', err);
        isFinishing.value = false;
    }
}

async function finishSigning() {
    if (placedFields.value.length === 0 || isFinishing.value) return;
    isFinishing.value = true;
    try {
        const bytes = await generateSignedPdf();
        const prevSaved = window.__cubsignSession?.token === props.session.token
            ? (window.__cubsignSession.documentSaved ?? false)
            : false;
        window.__cubsignSession = {
            token:         props.session.token,
            signedPdf:     bytes,
            filename:      props.session.filename,
            documentSaved: prevSaved,
        };
    } catch (err) {
        console.error('[CubSign] PDF signing error:', err);
        // Fall through to Complete even on error — user can try again
    }
    router.visit(route('sign.complete'));
}
</script>

<template>
    <SignLayout :step="2">

        <!-- ░░░░ EDITOR WORKSPACE — responsive 3-col (lg) / 2-col (md) / stacked (mobile) ░░░░ -->
        <div class="flex h-full min-h-0 flex-col overflow-hidden lg:flex-row">

            <!-- ═══ THUMBNAILS — horizontal strip on mobile/tablet, vertical sidebar on desktop ═══ -->
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
                            <canvas :ref="el => { if (el) thumbCanvases[i] = el }" class="block h-full w-auto mx-auto lg:h-auto lg:w-full" />
                        </div>
                        <span class="hidden text-[9px] font-medium text-gray-500 lg:block">{{ i + 1 }}</span>
                    </button>
                </template>
                <template v-if="isLoading">
                    <div v-for="n in 3" :key="n" class="h-[46px] w-[44px] shrink-0 animate-pulse rounded border border-gray-300 bg-gray-200 lg:h-16 lg:w-full" />
                </template>
            </aside>

            <!-- ═══ PDF VIEWER + SIGNATURE PANEL (side-by-side md+, stacked mobile) ═══ -->
            <div class="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">

            <!-- ─── PDF VIEWER ─────────────────────────────────────────────────── -->
            <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-200">

                <!-- Viewer toolbar -->
                <div class="flex h-10 shrink-0 items-center justify-between border-b border-gray-300 bg-white px-2 shadow-sm md:px-4">
                    <div class="hidden min-w-0 items-center gap-2 text-xs text-gray-600 md:flex">
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
                            title="Previous page"
                            @click="goToPrevPage"
                        >
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <span class="min-w-[58px] text-center text-xs text-gray-500">
                            {{ activePage }} / {{ numPages || '…' }}
                        </span>
                        <button
                            class="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                            :disabled="activePage >= numPages || !numPages"
                            title="Next page"
                            @click="goToNextPage"
                        >
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Manual-placement banner -->
                <div v-if="placementMode === 'manual'" class="flex shrink-0 items-center justify-between bg-blue-600 px-3 py-2 md:px-4">
                    <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
                        </svg>
                        <span class="text-xs font-semibold text-white md:text-sm">Tap anywhere on the document to place your {{ activeFieldType }}</span>
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
                    <div v-else class="flex flex-col items-start gap-8 py-6 px-3 md:items-center md:px-6">
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

                                <!-- Placed fields (signature, initials, date, name, text, checkbox) -->
                                <div
                                    v-for="field in placedFieldsOnPage(i + 1)"
                                    :key="field.id"
                                    class="absolute select-none transition-opacity duration-150"
                                    :style="`left:${field.x}px; top:${field.y}px; width:${field.w}px; height:${field.h}px; cursor:move; opacity:${recipients.length > 1 && field.signerId !== activeRecipientId ? '0.4' : '1'}`"
                                    @mousedown.stop="startDrag($event, field)"
                                    @touchstart.stop="startDrag($event, field)"
                                    @click.stop
                                >
                                    <div
                                        class="relative h-full w-full overflow-hidden rounded"
                                        :style="`background:rgba(239,246,255,0.4); outline:${field.id === selectedSigId ? '2px' : '1px'} solid ${(recipientById(field.signerId)?.color ?? '#3B82F6')}${field.id === selectedSigId ? '' : '50'}; outline-offset:${field.id === selectedSigId ? '1px' : '0'}`"
                                    >
                                        <!-- Recipient name strip — shown when field is selected -->
                                        <div
                                            v-if="field.id === selectedSigId"
                                            class="absolute left-0 right-0 top-0 z-10 truncate px-1.5 py-px text-[8px] font-semibold text-white"
                                            :style="`background:${recipientById(field.signerId)?.color ?? '#3B82F6'}`"
                                        >{{ recipientById(field.signerId)?.name || 'Signer' }}</div>

                                        <!-- Signature / Initials -->
                                        <template v-if="field.type === 'signature' || field.type === 'initials'">
                                            <img
                                                v-if="field.value?.sigType === 'image'"
                                                :src="field.value.src"
                                                class="h-full w-full object-contain"
                                                draggable="false"
                                            />
                                            <div
                                                v-else
                                                class="flex h-full w-full items-center justify-center px-2"
                                                :class="field.value?.font"
                                                style="color:#1e40af"
                                            >{{ field.value?.src }}</div>
                                        </template>

                                        <!-- Checkbox — clickable to toggle -->
                                        <template v-else-if="field.type === 'checkbox'">
                                            <div
                                                class="flex h-full w-full items-center justify-center rounded bg-white"
                                                :style="`border:2px solid ${recipientById(field.signerId)?.color ?? '#3B82F6'}`"
                                                @click.stop="toggleCheckbox(field)"
                                            >
                                                <svg v-if="field.value" class="h-3/4 w-3/4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    :style="`color:${recipientById(field.signerId)?.color ?? '#3B82F6'}`">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                                </svg>
                                            </div>
                                        </template>

                                        <!-- Date / Name / Text -->
                                        <template v-else>
                                            <div
                                                class="flex h-full w-full items-center overflow-hidden px-2"
                                                :style="`border:1px solid ${recipientById(field.signerId)?.color ?? '#3B82F6'}40; background:${recipientById(field.signerId)?.color ?? '#3B82F6'}0d`"
                                            >
                                                <span class="truncate text-xs text-gray-800">{{ field.value || '…' }}</span>
                                            </div>
                                        </template>
                                    </div>

                                    <!-- Type + recipient badge -->
                                    <span
                                        class="absolute -left-px -top-4 max-w-[120px] truncate rounded-t px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-white"
                                        :style="`background:${recipientById(field.signerId)?.color ?? '#3B82F6'}`"
                                    >{{ recipientDisplayName(field.signerId) }} · {{ field.type }}</span>

                                    <!-- Resize handles (when selected) -->
                                    <template v-if="field.id === selectedSigId">
                                        <div
                                            v-for="h in HANDLES"
                                            :key="h.id"
                                            class="absolute z-20 h-2.5 w-2.5 rounded-full border-2 border-white shadow-md"
                                            :class="h.pos"
                                            :style="`cursor:${h.cur}; background:${recipientById(field.signerId)?.color ?? '#3B82F6'}`"
                                            @mousedown.stop="startResize($event, field, h.id)"
                                            @touchstart.stop="startResize($event, field, h.id)"
                                        />
                                        <!-- Delete — mousedown.stop / touchstart.stop prevent bubbling to startDrag -->
                                        <button
                                            class="absolute -right-3 -top-3 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                                            style="font-size:9px;line-height:1"
                                            @mousedown.stop
                                            @touchstart.stop
                                            @click.stop="removeField(field.id)"
                                        >✕</button>
                                    </template>
                                </div>

                                <!-- Detected field markers (amber overlays from "Detect Fields") -->
                                <div
                                    v-for="df in detectedFieldsOnPage(i + 1)"
                                    :key="`df-${df.id}`"
                                    class="absolute z-20 cursor-pointer rounded border-2 border-dashed border-amber-400 bg-amber-50/30 transition-colors hover:bg-amber-100/60"
                                    :style="`left:${df.x - 5}px; top:${df.y}px; width:170px; height:52px`"
                                    @click.stop="placeAtField(df)"
                                >
                                    <span class="absolute -top-4 left-0 rounded-sm bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                                        {{ df.label }}
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

            <!-- ═══ SIGNATURE PANEL — full-width below PDF on mobile, 300px right panel on md+ ═══ -->
            <aside class="flex max-h-[280px] w-full flex-col overflow-y-auto border-t border-gray-200 bg-white sm:max-h-[320px] md:max-h-none md:w-[300px] md:shrink-0 md:border-t-0 md:border-l">

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

                <!-- ── RECIPIENTS (authenticated users only) ── -->
                <div v-if="isAuthenticated" class="border-b border-gray-100 px-4 py-4">

                    <!-- Summary line -->
                    <p class="mb-2 text-[10px] text-gray-400">
                        {{ recipients.length }} {{ recipients.length === 1 ? 'recipient' : 'recipients' }}
                        · {{ placedFields.length }} {{ placedFields.length === 1 ? 'field' : 'fields' }} assigned
                    </p>

                    <!-- Header row -->
                    <div class="mb-3 flex items-center justify-between">
                        <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Recipients</p>
                        <button
                            class="flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2 py-1 text-[11px] font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
                            @click="addRecipient"
                        >
                            <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                            </svg>
                            Add Recipient
                        </button>
                    </div>

                    <!-- Recipient cards (drag-reorderable) -->
                    <div class="space-y-2">
                        <div
                            v-for="r in recipients"
                            :key="r.id"
                            draggable="true"
                            class="cursor-pointer rounded-xl border transition-all duration-150"
                            :style="activeRecipientId === r.id
                                ? `border-color:${r.color}; background:${r.color}0f; box-shadow:0 2px 8px ${r.color}30`
                                : dragOverRecipientId === r.id
                                    ? `border:1.5px dashed ${r.color}80; background:${r.color}08`
                                    : 'border-color:#e5e7eb; background:#f9fafb'"
                            @click="activeRecipientId = r.id"
                            @dragstart="onRecipientDragStart($event, r.id)"
                            @dragover="onRecipientDragOver($event, r.id)"
                            @dragleave="onRecipientDragLeave"
                            @drop="onRecipientDrop($event, r.id)"
                            @dragend="onRecipientDragEnd"
                        >
                            <div class="px-3 py-2.5">

                                <!-- Row 1: drag handle + order badge + name + status + delete -->
                                <div class="flex items-center gap-1.5">
                                    <svg class="h-3.5 w-3.5 shrink-0 cursor-grab text-gray-300 active:cursor-grabbing" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                                        <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                                        <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
                                    </svg>
                                    <span
                                        class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                        :style="`background:${r.color}`"
                                    >#{{ r.signingOrder }}</span>
                                    <input
                                        v-model="r.name"
                                        placeholder="Full name"
                                        class="min-w-0 flex-1 bg-transparent text-xs font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none"
                                        @click.stop
                                    />
                                    <span :class="statusBadgeClass(r.status)">{{ r.status }}</span>
                                    <button
                                        v-if="recipients.length > 1"
                                        class="shrink-0 text-gray-200 transition hover:text-red-400"
                                        title="Remove recipient"
                                        @click.stop="removeRecipient(r.id)"
                                    >
                                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Row 2: email -->
                                <div class="ml-[26px] mt-0.5">
                                    <input
                                        v-model="r.email"
                                        type="email"
                                        placeholder="email@example.com"
                                        class="w-full bg-transparent text-[11px] text-gray-400 placeholder:text-gray-300 focus:outline-none"
                                        @click.stop
                                    />
                                </div>

                                <!-- Row 3: field type counts -->
                                <div class="ml-[26px] mt-2">
                                    <div v-if="Object.keys(fieldCountsForRecipient(r.id)).length > 0" class="flex flex-wrap gap-x-3 gap-y-0.5">
                                        <span
                                            v-for="(count, type) in fieldCountsForRecipient(r.id)"
                                            :key="type"
                                            class="flex items-center gap-1 text-[10px] font-medium text-gray-500"
                                        >
                                            <span class="h-1.5 w-1.5 shrink-0 rounded-full" :style="`background:${r.color}`"></span>
                                            {{ count }} {{ fieldCountLabel(type, count) }}
                                        </span>
                                    </div>
                                    <span v-else class="text-[10px] italic text-gray-300">No fields assigned yet</span>
                                </div>

                                <!-- Row 4: clickable field list (only when fields exist) -->
                                <div v-if="fieldsForRecipient(r.id).length > 0" class="ml-[26px] mt-2 space-y-0.5">
                                    <button
                                        v-for="f in fieldsForRecipient(r.id)"
                                        :key="f.id"
                                        class="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left transition"
                                        :class="f.id === selectedSigId
                                            ? 'bg-white/80 font-semibold text-gray-800 shadow-sm'
                                            : 'text-gray-400 hover:bg-white/60 hover:text-gray-600'"
                                        :style="f.id === selectedSigId ? `color:${r.color}` : ''"
                                        @click.stop="navigateToField(f)"
                                    >
                                        <span class="h-1 w-1 shrink-0 rounded-full" :style="`background:${r.color}`"></span>
                                        <span class="truncate text-[10px]">{{ fieldLabel(f) }}</span>
                                        <span class="ml-auto shrink-0 text-[9px] text-gray-300">p.{{ f.pageNum }}</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Color legend (only with multiple recipients) -->
                    <div v-if="recipients.length > 1" class="mt-3 border-t border-gray-100 pt-2.5">
                        <p class="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Color Guide</p>
                        <div class="flex flex-wrap gap-x-3 gap-y-1">
                            <div v-for="r in recipients" :key="r.id" class="flex items-center gap-1">
                                <span class="h-2 w-2 shrink-0 rounded-full" :style="`background:${r.color}`"></span>
                                <span class="text-[10px] text-gray-400">
                                    {{ COLOR_NAMES[r.color] ?? r.color }} = {{ r.name?.trim() || `Recipient ${r.signingOrder}` }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── FIELD TYPE SELECTOR ── -->
                <div class="border-b border-gray-100 px-4 py-3">
                    <p class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Field Type</p>
                    <div class="grid grid-cols-3 gap-1">
                        <button
                            v-for="ft in FIELD_TYPES"
                            :key="ft.id"
                            :class="[
                                'rounded-md py-1.5 text-xs font-medium transition',
                                activeFieldType === ft.id
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
                            ]"
                            @click="setFieldType(ft.id)"
                        >{{ ft.label }}</button>
                    </div>
                </div>

                <!-- ── CREATE / CONFIGURE FIELD ── -->
                <div class="border-b border-gray-100 px-4 py-4">
                    <p class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                        {{ activeFieldType === 'signature' ? 'Create Signature' : activeFieldType === 'initials' ? 'Create Initials' : activeFieldType === 'checkbox' ? 'Checkbox' : 'Field Value' }}
                    </p>

                    <!-- Signature / Initials: draw / type / upload flow -->
                    <template v-if="activeFieldType === 'signature' || activeFieldType === 'initials'">
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
                                    @touchstart.prevent="beginDraw"
                                    @touchmove.prevent="continueDraw"
                                    @touchend.prevent="endDraw"
                                />
                                <p v-if="!hasDrawing" class="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                                    Draw your {{ activeFieldType }} here
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
                                :placeholder="activeFieldType === 'initials' ? 'Type your initials' : 'Type your full name'"
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
                            <!-- Live preview -->
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
                                <p class="text-xs font-medium text-gray-600">Upload {{ activeFieldType }} image</p>
                                <p class="text-[11px] text-gray-400">PNG with transparent background</p>
                            </div>
                            <input ref="uploadInput" type="file" accept="image/*" class="hidden" @change="handleUpload" />
                            <img v-if="uploadedSig" :src="uploadedSig" class="h-16 w-full rounded-lg border border-gray-200 object-contain" />
                        </div>
                    </template>

                    <!-- Date: editable text value (defaults to today) -->
                    <template v-else-if="activeFieldType === 'date'">
                        <div class="space-y-2">
                            <p class="text-xs text-gray-500">Defaults to today. Edit before placing.</p>
                            <input
                                v-model="pendingDate"
                                type="text"
                                placeholder="e.g. 6/22/2026"
                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div class="flex min-h-[36px] items-center rounded-lg border border-blue-100 bg-blue-50/30 px-3">
                                <span class="text-sm text-gray-700">{{ pendingDate || '—' }}</span>
                            </div>
                        </div>
                    </template>

                    <!-- Name / Text: simple text input -->
                    <template v-else-if="activeFieldType === 'name' || activeFieldType === 'text'">
                        <div class="space-y-2">
                            <p class="text-xs text-gray-500">
                                {{ activeFieldType === 'name' ? 'Pre-fill a name, or leave empty.' : 'Enter text, or leave empty.' }}
                            </p>
                            <input
                                v-model="pendingText"
                                type="text"
                                :placeholder="activeFieldType === 'name' ? 'Full name…' : 'Enter text…'"
                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </template>

                    <!-- Checkbox: static preview -->
                    <template v-else>
                        <div class="space-y-2">
                            <p class="text-xs text-gray-500">Places an unchecked checkbox. Click placed checkboxes to toggle.</p>
                            <div class="flex h-10 w-10 items-center justify-center rounded border-2 border-blue-400 bg-white">
                                <svg class="h-6 w-6 text-blue-500 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- ── PLACEMENT SECTION ── -->
                <div class="border-b border-gray-100 px-4 py-4">
                    <p class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Place Field</p>

                    <!-- ── Signature / Initials: 3-mode flow ── -->
                    <template v-if="activeFieldType === 'signature' || activeFieldType === 'initials'">

                        <!-- No signature created -->
                        <p v-if="!capturedSig && !signatureReady" class="text-xs text-gray-400">
                            Create a {{ activeFieldType }} above, then choose how to place it.
                        </p>

                        <!-- Ready to capture -->
                        <div v-else-if="!capturedSig">
                            <button
                                class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                                @click="captureSignature"
                            >
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
                                </svg>
                                Add {{ activeFieldType === 'initials' ? 'Initials' : 'Signature' }}
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
                                Use a different {{ activeFieldType }}
                            </button>
                        </div>
                    </template>

                    <!-- ── Non-sig types: single place button ── -->
                    <template v-else>
                        <div
                            v-if="placementMode === 'manual'"
                            class="mb-2 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                        >
                            <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                            Click on the PDF to place
                            <button class="ml-auto text-blue-400 hover:text-blue-700" @click="placementMode = null">✕</button>
                        </div>
                        <button
                            :class="[
                                'flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98]',
                                placementMode === 'manual'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400'
                                    : 'bg-blue-600 text-white hover:bg-blue-700',
                            ]"
                            @click="placementMode = 'manual'"
                        >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
                            </svg>
                            Place {{ activeFieldType.charAt(0).toUpperCase() + activeFieldType.slice(1) }}
                        </button>
                    </template>
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

                <!-- ── PLACED FIELDS ── -->
                <div v-if="placedFields.length > 0" class="px-4 py-3">
                    <p class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Placed ({{ placedFields.length }})
                    </p>
                    <div class="space-y-1.5">
                        <div
                            v-for="field in placedFields"
                            :key="field.id"
                            :class="[
                                'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 transition',
                                field.id === selectedSigId
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-gray-100 bg-gray-50 hover:border-gray-200',
                            ]"
                            @click="selectedSigId = field.id; scrollToPage(field.pageNum)"
                        >
                            <!-- Thumbnail -->
                            <div class="h-7 w-10 shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
                                <template v-if="field.type === 'signature' || field.type === 'initials'">
                                    <img v-if="field.value?.sigType === 'image'" :src="field.value.src" class="h-full w-full object-contain" />
                                    <span v-else class="flex h-full w-full items-center justify-center text-[8px] font-bold text-blue-700">Aa</span>
                                </template>
                                <template v-else-if="field.type === 'checkbox'">
                                    <span class="flex h-full w-full items-center justify-center text-[11px] text-blue-600">{{ field.value ? '✓' : '☐' }}</span>
                                </template>
                                <template v-else>
                                    <span class="flex h-full w-full items-center justify-center overflow-hidden px-1 text-[7px] text-gray-600">
                                        {{ String(field.value || '').slice(0, 10) || '—' }}
                                    </span>
                                </template>
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="text-[11px] font-medium capitalize text-gray-700">{{ field.type }} {{ field.id }}</p>
                                <p class="text-[10px] text-gray-400">Page {{ field.pageNum }}</p>
                            </div>
                            <div class="flex shrink-0 items-center gap-0.5">
                                <button
                                    class="rounded p-0.5 text-gray-300 hover:bg-blue-50 hover:text-blue-500"
                                    title="Duplicate (Ctrl+D)"
                                    @click.stop="duplicateField(field.id)"
                                >
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                    </svg>
                                </button>
                                <button
                                    class="rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-500"
                                    title="Delete (Delete key)"
                                    @click.stop="removeField(field.id)"
                                >
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
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
            </div><!-- /pdf-panel inner wrapper -->
        </div><!-- /outer workspace wrapper -->

        <!-- ░░ BOTTOM ACTION BAR ░░ -->
        <div class="flex h-14 shrink-0 items-center justify-between border-t border-gray-200 bg-white px-3 shadow-[0_-1px_4px_rgba(0,0,0,0.06)] md:px-6">
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
                <span v-if="placedFields.length > 0" class="hidden text-xs font-medium text-emerald-600 sm:block">
                    ✓ {{ placedFields.length }} field{{ placedFields.length !== 1 ? 's' : '' }} placed
                </span>
                <button
                    :disabled="placedFields.length === 0 || isFinishing"
                    :class="[
                        'flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition',
                        placedFields.length > 0 && !isFinishing
                            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]'
                            : 'cursor-not-allowed bg-gray-100 text-gray-400',
                    ]"
                    @click="goToReview"
                >
                    <svg v-if="isFinishing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <span class="hidden sm:inline">{{ isFinishing ? 'Preparing…' : 'Review' }}</span>
                    <span class="sm:hidden">{{ isFinishing ? '…' : 'Review' }}</span>
                    <svg v-if="!isFinishing" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>

    </SignLayout>
</template>
