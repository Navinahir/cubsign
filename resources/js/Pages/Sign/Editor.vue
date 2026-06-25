<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';
import { persistSignedPdf } from '@/utils/persistSignedPdf';
import { FIELD_TYPES, FIELD_DEFAULTS, RECIPIENT_COLORS, TYPE_FONTS } from '@/Components/Editor/editorConstants';
import {
    recipientInitials,
    recipientDisplayName as displayRecipientName,
    isSignPlaceholder,
    signPlaceholderLabel,
    fieldsForRecipient,
    fieldTypesForRecipient,
    recipientFieldSummaries,
    buildFieldsLogPayload,
    configuredRecipients,
    validateRequestSigning,
    validateSigningModeConsistency,
    resolveFieldSigningMode,
    fieldsForSigningMode,
    buildModeSwitchModal,
} from '@/Components/Editor/editorHelpers';
import EditorAddRecipientModal from '@/Components/Editor/EditorAddRecipientModal.vue';
import EditorSigningMode from '@/Components/Editor/EditorSigningMode.vue';
import EditorSigningModeSwitchModal from '@/Components/Editor/EditorSigningModeSwitchModal.vue';
import EditorRequestFieldHint from '@/Components/Editor/EditorRequestFieldHint.vue';
import EditorRecipientSection from '@/Components/Editor/EditorRecipientSection.vue';
import EditorGuestRecipient from '@/Components/Editor/EditorGuestRecipient.vue';
import EditorFieldTypeGrid from '@/Components/Editor/EditorFieldTypeGrid.vue';
import EditorFieldSettings from '@/Components/Editor/EditorFieldSettings.vue';
import EditorSignaturePanel from '@/Components/Editor/EditorSignaturePanel.vue';
import EditorDocumentInfo from '@/Components/Editor/EditorDocumentInfo.vue';
import EditorEmptyState from '@/Components/Editor/EditorEmptyState.vue';
import EditorBottomActionBar from '@/Components/Editor/EditorBottomActionBar.vue';
import EditorPlacementHelper from '@/Components/Editor/EditorPlacementHelper.vue';
import SignWorkspaceLoader from '@/Components/Sign/SignWorkspaceLoader.vue';
import { createPdfRenderer } from '@/utils/pdfPageRenderer';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

const { getDocument, GlobalWorkerOptions, Util } = pdfjsLib;
GlobalWorkerOptions.workerSrc = workerUrl;

const pdfRenderer = createPdfRenderer();
const THUMB_SCALE   = 0.14;

const props = defineProps({
    session:     { type: Object, required: true },
    documentId:  { type: Number, default: null },
    editorState: { type: Object, default: null },
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
const workspaceInitState = ref('loading'); // loading | ready | error
const initError     = ref(null);
const centerRef     = ref(null);    // scrollable center column

let initStarted     = false;
let initAborted     = false;

// ── Signature creation ──────────────────────────────────────────────────
const signatureTab        = ref('draw');
const initialsTab         = ref('draw');
const isChangingSignature = ref(false);
const isChangingInitials  = ref(false);
const sigPanelRef            = ref(null);
const initialsPanelRef       = ref(null);
const recipientSectionRef    = ref(null);
const hasDrawingSignature    = ref(false);
const hasDrawingInitials     = ref(false);

const typedName           = ref('');
const typedFont           = ref('script');
const uploadedSig         = ref(null);
const uploadInput         = ref(null);

const activeTab = computed({
    get() {
        return activeFieldType.value === 'initials' ? initialsTab.value : signatureTab.value;
    },
    set(val) {
        if (activeFieldType.value === 'initials') initialsTab.value = val;
        else signatureTab.value = val;
    },
});

const typeFonts = TYPE_FONTS;

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

// ── Signing mode: self = owner signs now, request = recipient placeholders ──
const signingMode = ref('self'); // 'self' | 'request'

// ── Placement state ─────────────────────────────────────────────────────
const savedSignature  = ref(null);    // { type, src, font? } — reusable session asset
const savedInitials   = ref(null);
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
const saveStatus      = ref('idle'); // idle | saving | saved | failed
let   autosaveTimer   = null;
const clipboardField  = ref(null);   // Ctrl+C / Ctrl+V internal clipboard
const thumbStripRef   = ref(null);   // for auto-scrolling the thumbnail aside
let   intersectionObs = null;        // scroll-based active-page tracking

// ── Template placeholder helpers ─────────────────────────────────────────────
// Template editor stores placeholder values: { sigType:'text', src:'Signature'/'Initials' }
// These must be filled with the actual signature before the PDF is generated.
function isTemplatePlaceholder(field) {
    return isSignPlaceholder(field);
}

const hasTemplatePlaceholders = computed(() => placedFields.value.some(isTemplatePlaceholder));

const templatePlaceholderCount = computed(() => placedFields.value.filter(isTemplatePlaceholder).length);

function savedAssetForType(type) {
    if (type === 'signature') return savedSignature.value;
    if (type === 'initials') return savedInitials.value;
    return null;
}

const activeSavedAsset = computed(() => savedAssetForType(activeFieldType.value));

const isChangingAsset = computed(() =>
    activeFieldType.value === 'initials' ? isChangingInitials.value : isChangingSignature.value,
);

function activeSignaturePanel() {
    return activeFieldType.value === 'initials' ? initialsPanelRef.value : sigPanelRef.value;
}

const hasDrawing = computed(() =>
    activeFieldType.value === 'initials' ? hasDrawingInitials.value : hasDrawingSignature.value,
);

function fillTemplatePlaceholders() {
    placedFields.value.forEach(f => {
        if (!isTemplatePlaceholder(f)) return;
        const asset = savedAssetForType(f.type);
        if (!asset) return;
        f.value = {
            sigType: asset.type,
            src:     asset.src,
            font:    asset.font,
        };
        if (!f.signerId) {
            f.signerId = activeRecipientId.value;
        }
    });
}

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

const isRequestMode = computed(() => signingMode.value === 'request');
const isSelfSignMode = computed(() => signingMode.value === 'self');

const signatureReady = computed(() => {
    if (activeTab.value === 'draw')   return hasDrawing.value;
    if (activeTab.value === 'type')   return typedName.value.trim().length >= 2;
    if (activeTab.value === 'upload') return uploadedSig.value !== null;
    return false;
});

const realPlacedFields = computed(() => {
    if (isRequestMode.value) return placedFields.value;
    return placedFields.value.filter(f => !isSignPlaceholder(f));
});

const hasRecipientConfigured = computed(() =>
    configuredRecipients(recipients.value).length > 0,
);

const requestFieldsLocked = computed(() =>
    isRequestMode.value && !hasRecipientConfigured.value,
);

const existingRecipientEmails = computed(() =>
    configuredRecipients(recipients.value).map(r => (r.email ?? '').trim().toLowerCase()),
);

const setupFieldsPlaced = computed(() => placedFields.value.length > 0);

const emptyStateStep = computed(() => {
    if (placementMode.value === 'manual') return 2;
    if (placedFields.value.length === 0) return 1;
    return null;
});

const recipientListVisible = ref(false);
const showAddRecipientModal = ref(false);
const requestToast          = ref('');
const requestOnboardingHint = ref(false);
let   requestToastTimer     = null;
let   pendingAfterModeSwitch = null;

const modeSwitchModal = ref({
    show:         false,
    targetMode:   null,
    title:        '',
    lead:         '',
    subtitle:     '',
    bullets:      [],
    footer:       null,
    confirmLabel: 'Continue',
});

watch(() => configuredRecipients(recipients.value).length, (count) => {
    if (count > 0) recipientListVisible.value = true;
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
function attachGlobalListeners() {
    window.addEventListener('mousemove', onGlobalMove);
    window.addEventListener('mouseup',   onGlobalUp);
    window.addEventListener('touchmove', onGlobalMove, { passive: false });
    window.addEventListener('touchend',  onGlobalUp);
    window.addEventListener('keydown',   onKeyDown);
}

function detachGlobalListeners() {
    window.removeEventListener('mousemove', onGlobalMove);
    window.removeEventListener('mouseup',   onGlobalUp);
    window.removeEventListener('touchmove', onGlobalMove);
    window.removeEventListener('touchend',  onGlobalUp);
    window.removeEventListener('keydown',   onKeyDown);
}

function restoreEditorMetadata() {
    const es = props.editorState;
    if (!es) return;

    if (es.scale) {
        scale.value = es.scale;
    }

    if (es.recipients?.length) {
        recipients.value = es.recipients.map(r => ({
            ...r,
            name:  r.name  ?? '',
            email: r.email ?? '',
        }));
        recipientSeq = Math.max(...es.recipients.map(r => (typeof r.id === 'number' ? r.id : 0)));
        activeRecipientId.value = es.activeRecipientId ?? es.recipients[0]?.id ?? 1;
    }

    if (es.signingMode === 'request' || es.signingMode === 'self') {
        signingMode.value = es.signingMode;
    } else if (
        es.recipients?.length > 1 ||
        es.recipients?.some(r => (r.name ?? '').trim() || (r.email ?? '').trim())
    ) {
        signingMode.value = 'request';
    }

    if (es.savedSignature) savedSignature.value = es.savedSignature;
    if (es.savedInitials)  savedInitials.value  = es.savedInitials;
    if (es.selectedSignatureTab) signatureTab.value = es.selectedSignatureTab;
    if (es.selectedInitialsTab)  initialsTab.value  = es.selectedInitialsTab;
    if (es.activeFieldType)        activeFieldType.value = es.activeFieldType;

    if (recipients.value.length > 1 || configuredRecipients(recipients.value).length > 0) {
        recipientListVisible.value = true;
    }

    if (signingMode.value === 'request') {
        recipients.value = configuredRecipients(recipients.value);
        activeRecipientId.value = recipients.value[0]?.id ?? null;
    }
}

function restorePlacedFields() {
    const es = props.editorState;
    if (!es?.placedFields?.length) return;

    placedFields.value = es.placedFields.map(f => {
        const value = f.value ?? '';
        const field = { ...f, value };
        return {
            ...field,
            signingMode: f.signingMode ?? resolveFieldSigningMode(field, es.signingMode ?? 'self'),
        };
    });
    fieldSeq = Math.max(0, ...es.placedFields.map(f => (typeof f.id === 'number' ? f.id : 0)));
}

function finalizeWorkspaceUi() {
    if (isSelfSignMode.value && savedAssetForType(activeFieldType.value)) {
        placementMode.value = 'manual';
    }
}

function teardownPdf() {
    pdfRenderer.cancelAll();
    if (intersectionObs) {
        intersectionObs.disconnect();
        intersectionObs = null;
    }
    if (pdfDoc?.destroy) {
        try {
            pdfDoc.destroy();
        } catch (e) {
            console.warn('[CubSign PDF] destroy failed:', e);
        }
    }
    pdfDoc        = null;
    pageCanvases  = [];
    thumbCanvases = [];
    pageDims.value = [];
    numPages.value = 0;
}

async function initializeWorkspace() {
    if (initStarted && workspaceInitState.value !== 'error') return;
    initStarted         = true;
    initAborted         = false;
    workspaceInitState.value = 'loading';
    initError.value     = null;
    loadError.value     = null;
    isLoading.value     = true;

    try {
        if (!props.session?.pdfUrl) {
            throw new Error('Missing document session.');
        }

        restoreEditorMetadata();

        const ok = await loadPdf(props.session.pdfUrl);
        if (initAborted) return;

        if (!ok) {
            workspaceInitState.value = 'error';
            initError.value = loadError.value ?? 'Unable to load document.';
            return;
        }

        restorePlacedFields();

        if (initAborted) return;

        finalizeWorkspaceUi();
        workspaceInitState.value = 'ready';

        await nextTick();
        if (props.editorState?.activePage) {
            scrollToPage(props.editorState.activePage);
        }
        setupScrollObserver();
    } catch (err) {
        console.error('[CubSign] Workspace init failed:', err);
        workspaceInitState.value = 'error';
        initError.value = 'Unable to load document.';
    }
}

async function retryInit() {
    teardownPdf();
    initStarted = false;
    await initializeWorkspace();
}

onMounted(() => {
    attachGlobalListeners();
    initializeWorkspace();
});

onBeforeUnmount(() => {
    initAborted = true;
    detachGlobalListeners();
    teardownPdf();
    if (autosaveTimer) clearTimeout(autosaveTimer);
    if (requestToastTimer) clearTimeout(requestToastTimer);
});

function showRequestToast(message = 'Please add a recipient before placing fields.') {
    requestToast.value = message;
    clearTimeout(requestToastTimer);
    requestToastTimer = setTimeout(() => {
        requestToast.value = '';
    }, 3200);
}

watch(activePage, async (pageNum) => {
    await nextTick();
    if (!thumbStripRef.value) return;
    thumbStripRef.value.querySelectorAll('button')[pageNum - 1]
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});

watch([placedFields, recipients, scale, signingMode, savedSignature, savedInitials, signatureTab, initialsTab, activeRecipientId], () => scheduleAutosave(), { deep: true });

// ── PDF loading ───────────────────────────────────────────────────────────
async function renderAllPages() {
    if (!pdfDoc || numPages.value === 0) return;

    for (let i = 1; i <= numPages.value; i++) {
        if (initAborted) return;
        const canvas = await pdfRenderer.waitForCanvas(
            (idx) => pageCanvases[idx],
            i - 1,
            { label: 'main' },
        );
        if (!canvas) {
            throw new Error(`Main canvas for page ${i} is not mounted`);
        }
        await pdfRenderer.renderToCanvas(pdfDoc, i, canvas, scale.value, `main-${i}`);
    }
}

async function renderAllThumbs() {
    if (!pdfDoc || numPages.value === 0) return;

    for (let i = 1; i <= numPages.value; i++) {
        if (initAborted) return;
        const canvas = await pdfRenderer.waitForCanvas(
            (idx) => thumbCanvases[idx],
            i - 1,
            { label: 'thumb' },
        );
        if (!canvas) {
            throw new Error(`Thumbnail canvas for page ${i} is not mounted`);
        }
        await pdfRenderer.renderToCanvas(pdfDoc, i, canvas, THUMB_SCALE, `thumb-${i}`);
    }
}

async function loadPdf(url) {
    pdfRenderer.cancelAll();
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
    } catch (err) {
        console.error('[CubSign] PDF fetch error:', err);
        loadError.value = 'Could not load the document. Try re-uploading.';
        isLoading.value = false;
        return false;
    }

    try {
        const task = getDocument({ data: arrayBuffer });
        pdfDoc         = await task.promise;
        numPages.value = pdfDoc.numPages;
        if (import.meta.env.DEV) {
            console.debug('[CubSign PDF] PDF loaded', { pages: numPages.value });
        }
    } catch (err) {
        console.error('[CubSign] PDF parse error:', err);
        loadError.value = 'Could not parse the document. Try re-uploading.';
        isLoading.value = false;
        return false;
    }

    try {
        // Set final layout dimensions first, then mount canvases, then render.
        // Main canvases must stay in the DOM during render (never behind v-if="isLoading").
        pageDims.value = await pdfRenderer.computePageDimensions(pdfDoc, numPages.value, scale.value);
        await nextTick();

        if (import.meta.env.DEV) {
            console.debug('[CubSign PDF] Pages created in DOM', { count: pageDims.value.length });
        }

        await renderAllPages();
        await renderAllThumbs();

        if (window.innerWidth < 768 && pageDims.value[0] && !props.editorState?.scale) {
            await fitWidth();
        }
    } catch (err) {
        console.error('[CubSign] PDF render pipeline failed:', err);
        loadError.value = 'Could not render the document. Try refreshing the page.';
        isLoading.value = false;
        return false;
    }

    isLoading.value = false;
    return true;
}

async function rerenderAll() {
    if (!pdfDoc) return;
    pageDims.value = await pdfRenderer.computePageDimensions(pdfDoc, numPages.value, scale.value);
    await nextTick();
    await renderAllPages();
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
    let asset;
    if (activeTab.value === 'draw') {
        const png = activeSignaturePanel()?.exportPng?.();
        if (!png) return;
        asset = { type: 'image', src: png };
    } else if (activeTab.value === 'type') {
        asset = { type: 'text', src: typedName.value.trim(), font: selectedFont.value.cls };
    } else {
        asset = { type: 'image', src: uploadedSig.value };
    }

    if (activeFieldType.value === 'initials') {
        savedInitials.value = asset;
        isChangingInitials.value = false;
    } else {
        savedSignature.value = asset;
        isChangingSignature.value = false;
    }

    detectionRan.value = false;
    resetCreationDraft();

    if (hasTemplatePlaceholders.value) {
        fillTemplatePlaceholders();
    }
    placementMode.value = 'manual';
}

function resetCreationDraft() {
    if (activeFieldType.value === 'initials') {
        hasDrawingInitials.value = false;
    } else {
        hasDrawingSignature.value = false;
    }
    typedName.value   = '';
    uploadedSig.value = null;
    activeSignaturePanel()?.clearPad?.();
}

function startChangeAsset() {
    if (activeFieldType.value === 'initials') {
        isChangingInitials.value = true;
    } else {
        isChangingSignature.value = true;
    }
    placementMode.value = null;
    resetCreationDraft();
}

function useExistingAsset() {
    if (activeFieldType.value === 'initials') {
        isChangingInitials.value = false;
    } else {
        isChangingSignature.value = false;
    }
    resetCreationDraft();
    if (savedAssetForType(activeFieldType.value)) {
        placementMode.value = 'manual';
    }
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
        selectedSigId.value = null;
        return;
    }
    if (requestFieldsLocked.value) {
        showRequestToast();
        return;
    }
    const type = activeFieldType.value;
    if (isRequestMode.value && !activeRecipientId.value) {
        showRequestToast();
        return;
    }
    if ((type === 'signature' || type === 'initials') && !savedAssetForType(type) && !isRequestMode.value) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const def  = FIELD_DEFAULTS[type];
    const x    = Math.max(0, e.clientX - rect.left - def.w / 2);
    const y    = Math.max(0, e.clientY - rect.top  - def.h / 2);
    placeField(pageNum, x, y);
    if (type !== 'signature' && type !== 'initials') {
        placementMode.value = null;
    }
}

function buildFieldValue(type) {
    if (isRequestMode.value) {
        if (type === 'signature') return { sigType: 'text', src: 'Sign Here' };
        if (type === 'initials')  return { sigType: 'text', src: 'Initial Here' };
        if (type === 'date' || type === 'name' || type === 'text') return '';
        return false;
    }
    if (type === 'signature' || type === 'initials') {
        const asset = savedAssetForType(type);
        return { sigType: asset.type, src: asset.src, font: asset.font };
    }
    if (type === 'date') {
        return pendingDate.value || new Date().toLocaleDateString();
    }
    if (type === 'name' || type === 'text') {
        return pendingText.value;
    }
    return false;
}

function placeField(pageNum, x, y, w, h) {
    const type = activeFieldType.value;
    const id   = ++fieldSeq;
    const def  = FIELD_DEFAULTS[type];
    const value = buildFieldValue(type);
    placedFields.value.push({
        id, type, pageNum, x, y,
        w: w ?? def.w, h: h ?? def.h,
        value,
        signerId: isSelfSignMode.value ? (activeRecipientId.value ?? 1) : activeRecipientId.value,
        signingMode: signingMode.value,
    });
    selectedSigId.value = id;

    if (isRequestMode.value) {
        requestOnboardingHint.value = false;
    }
}

// ── Smart detection (MODE 2) ──────────────────────────────────────────────
const KEYWORDS = [
    'signature', 'signed by', 'authorized signature',
    'company representative', 'customer signature', 'sign here',
    'signatory', 'undersigned', 'authorized signatory',
];

async function detectFields() {
    if (!pdfDoc || !savedSignature.value) return;
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
            if (!('str' in item) || !(item.str ?? '').trim()) continue;
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
    if (!savedSignature.value) return;
    placeField(field.pageNum, Math.max(0, field.x - 5), field.y, 180, 60);
    detectedFields.value = [];   // remove yellow field markers from PDF
    showFields.value     = false;
    detectionRan.value   = false;
    placementMode.value  = null;
    scrollToPage(field.pageNum);
}

// ── AI Auto place (MODE 3) ────────────────────────────────────────────────
async function autoPlace() {
    if (!savedSignature.value) return;
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
    if (isRequestMode.value) return;
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
    if (requestFieldsLocked.value) {
        showRequestToast();
        return;
    }

    const prev = activeFieldType.value;
    activeFieldType.value = type;
    if (prev === 'signature' && type !== 'signature') isChangingSignature.value = false;
    if (prev === 'initials' && type !== 'initials') isChangingInitials.value = false;
    detectedFields.value = [];
    showFields.value     = false;
    detectionRan.value   = false;

    if (isRequestMode.value) {
        placementMode.value = 'manual';
    } else if (type === 'signature' || type === 'initials') {
        const changing = type === 'initials' ? isChangingInitials.value : isChangingSignature.value;
        if (savedAssetForType(type) && !changing) {
            placementMode.value = 'manual';
        } else {
            placementMode.value = null;
        }
    } else {
        placementMode.value = 'manual';
    }

    if (type === 'date') {
        pendingDate.value = isSelfSignMode.value ? new Date().toLocaleDateString() : '';
    } else if (type === 'name' && isSelfSignMode.value && authUserName.value) {
        pendingText.value = authUserName.value;
    } else if (type !== 'name' && type !== 'text') {
        pendingText.value = '';
    }
}

// ── Recipient management ──────────────────────────────────────────────────
function onFieldDoubleClick(field) {
    selectedSigId.value = field.id;
    scrollToPage(field.pageNum);
}

function recipientById(id) {
    return recipients.value.find(r => r.id === id);
}

function updateRecipientField(id, field, value) {
    const r = recipientById(id);
    if (r) r[field] = value;
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

function modeSwitchNeedsConfirm(targetMode) {
    const selfFields    = fieldsForSigningMode(placedFields.value, 'self', signingMode.value);
    const requestFields = fieldsForSigningMode(placedFields.value, 'request', signingMode.value);
    const configured    = configuredRecipients(recipients.value);

    if (targetMode === 'self') {
        return requestFields.length > 0 || configured.length > 0;
    }

    return selfFields.length > 0;
}

function applySigningModeSwitch(mode) {
    if (mode === 'self') {
        placedFields.value = placedFields.value.filter(
            f => resolveFieldSigningMode(f, signingMode.value) !== 'request',
        );
        recipientSeq = 1;
        recipients.value = [{
            id: 1, name: '', email: '', color: RECIPIENT_COLORS[0],
            role: 'signer', signingOrder: 1, status: 'pending',
        }];
        activeRecipientId.value    = 1;
        recipientListVisible.value = false;
        requestOnboardingHint.value = false;
    } else {
        placedFields.value = placedFields.value.filter(
            f => resolveFieldSigningMode(f, signingMode.value) !== 'self',
        );
        recipients.value = configuredRecipients(recipients.value);
        activeRecipientId.value     = recipients.value[0]?.id ?? null;
        recipientListVisible.value  = recipients.value.length > 0;
        requestOnboardingHint.value = false;
    }

    signingMode.value         = mode;
    selectedSigId.value       = null;
    placementMode.value       = null;
    detectedFields.value      = [];
    showFields.value          = false;
    isChangingSignature.value = false;
    isChangingInitials.value  = false;

    if (mode === 'self' && savedAssetForType(activeFieldType.value)) {
        placementMode.value = 'manual';
    }
}

async function requestSigningModeChange(mode, afterConfirm = null) {
    if (mode !== 'self' && mode !== 'request') return;
    if (signingMode.value === mode) return;

    if (!modeSwitchNeedsConfirm(mode)) {
        applySigningModeSwitch(mode);
        await flushAutosave();
        afterConfirm?.();
        return;
    }

    pendingAfterModeSwitch = afterConfirm;
    const copy = buildModeSwitchModal(mode, placedFields.value, recipients.value, signingMode.value);
    modeSwitchModal.value = {
        show: true,
        targetMode: mode,
        ...copy,
    };
}

function closeModeSwitchModal() {
    modeSwitchModal.value.show = false;
    pendingAfterModeSwitch     = null;
}

async function confirmModeSwitch() {
    const mode    = modeSwitchModal.value.targetMode;
    const pending = pendingAfterModeSwitch;
    modeSwitchModal.value.show = false;
    pendingAfterModeSwitch     = null;

    if (mode !== 'self' && mode !== 'request') return;

    applySigningModeSwitch(mode);
    await flushAutosave();
    pending?.();
}

function setSigningMode(mode) {
    requestSigningModeChange(mode);
}

function openAddRecipientModal() {
    if (isSelfSignMode.value) {
        requestSigningModeChange('request', () => {
            showAddRecipientModal.value = true;
        });
        return;
    }
    showAddRecipientModal.value = true;
}

async function saveRecipientFromModal({ name, email }) {
    const id           = ++recipientSeq;
    const signingOrder = recipients.value.length + 1;
    const color        = RECIPIENT_COLORS[(recipients.value.length) % RECIPIENT_COLORS.length];
    recipients.value.push({
        id, name, email, color, role: 'signer', signingOrder, status: 'pending',
    });
    activeRecipientId.value     = id;
    recipientListVisible.value  = true;
    requestOnboardingHint.value = true;
    placementMode.value         = null;
    showAddRecipientModal.value = false;
    await recipientSectionRef.value?.scrollToRecipient(id);
}

function removeRecipient(id) {
    recipients.value = recipients.value.filter(r => r.id !== id);
    placedFields.value = placedFields.value.filter(f => f.signerId !== id);
    recipients.value.forEach((r, i) => { r.signingOrder = i + 1; });
    if (activeRecipientId.value === id) {
        activeRecipientId.value = recipients.value[0]?.id ?? null;
    }
    recipientListVisible.value = recipients.value.length > 0;
    if (!configuredRecipients(recipients.value).length) {
        placementMode.value         = null;
        requestOnboardingHint.value = false;
    }
}

// ── Recipient UI helpers ──────────────────────────────────────────────────
function fieldCountForRecipient(recipientId) {
    return fieldsForRecipient(placedFields.value, recipientId).length;
}

function fieldCountsForRecipient(recipientId) {
    return fieldTypesForRecipient(placedFields.value, recipientId);
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
    return displayRecipientName(r);
}

function fieldLabel(field) {
    const peers = fieldsForRecipient(placedFields.value, field.signerId)
        .filter(f => f.type === field.type);
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
        // Skip template placeholder fields that were never filled with a real signature
        if (isTemplatePlaceholder(field)) continue;

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

    return pdflibDoc.save({ useObjectStreams: false });
}

function scheduleAutosave() {
    if (workspaceInitState.value !== 'ready') return;
    if (!props.documentId) return;
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => flushAutosave(), 2500);
}

async function flushAutosave() {
    if (!props.documentId) return;
    saveStatus.value = 'saving';
    const ok = await persistEditorState();
    saveStatus.value = ok ? 'saved' : 'failed';
}

async function persistEditorState() {
    if (!props.documentId) return false;
    try {
        const state = {
            placedFields: placedFields.value,
            scale:        scale.value,
            activePage:   activePage.value,
            recipients:   recipients.value,
            signingMode:  signingMode.value,
            pageCount:    numPages.value,
            savedSignature:       savedSignature.value,
            savedInitials:        savedInitials.value,
            selectedSignatureTab: signatureTab.value,
            selectedInitialsTab:  initialsTab.value,
            activeFieldType:      activeFieldType.value,
            activeRecipientId:    activeRecipientId.value,
        };

        console.log('[CubSign] Placed fields before save:', placedFields.value.length);
        console.log('[CubSign] Recipient assignment:', recipientFieldSummaries(placedFields.value, recipients.value).map(r => ({
            id: r.id,
            name: r.name,
            assigned_fields_count: r.assigned_fields_count,
            assigned_field_types: r.assigned_field_types,
        })));
        console.log('[CubSign] Field types:', placedFields.value.reduce((acc, f) => {
            acc[f.type] = (acc[f.type] ?? 0) + 1;
            return acc;
        }, {}));

        for (const r of recipients.value) {
            console.log('[CubSign] EDITOR_FIELDS', buildFieldsLogPayload(props.documentId, r.id, placedFields.value, r.id));
        }

        const xsrf = decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
        const res = await fetch(route('documents.editor-state', props.documentId), {
            method:      'PATCH',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf },
            body: JSON.stringify({ state }),
        });
        return res.ok;
    } catch (e) {
        console.warn('[CubSign] editor state save failed:', e);
        return false;
    }
}

async function goToReview() {
    console.log('REVIEW_BUTTON_CLICKED');
    console.log('GO_TO_REVIEW_ENTER', {
        placedFields: placedFields.value.length,
        isFinishing: isFinishing.value,
        documentId: props.documentId,
        authenticated: !!usePage().props.auth?.user,
    });
    if (placedFields.value.length === 0 || isFinishing.value) {
        console.log('GO_TO_REVIEW_EARLY_EXIT', {
            reason: placedFields.value.length === 0 ? 'no_fields' : 'already_finishing',
        });
        return;
    }

    const consistencyErrors = validateSigningModeConsistency({
        signingMode:  signingMode.value,
        placedFields: placedFields.value,
        recipients:   recipients.value,
    });
    if (consistencyErrors.length > 0) {
        showRequestToast(consistencyErrors[0]);
        return;
    }

    isFinishing.value = true;
    try {
        await persistEditorState();
        const bytes = await generateSignedPdf();
        console.log('AFTER_GENERATE_PDF', { byteLength: bytes?.byteLength ?? bytes?.length ?? 0 });

        const isAuthenticated = !!usePage().props.auth?.user;
        let documentSaved = window.__cubsignSession?.token === props.session.token
            ? (window.__cubsignSession.documentSaved ?? false)
            : false;

        if (isAuthenticated) {
            console.log('BEFORE_PERSIST', { route: route('sign.save'), documentId: props.documentId });
            const response = await persistSignedPdf(bytes, props.session.filename);
            console.log('AFTER_PERSIST', response);
            if (response.ok) {
                documentSaved = true;
            } else {
                console.warn('[CubSign] persistSignedPdf failed before Review', response);
            }
        } else {
            console.log('PERSIST_SKIPPED', { isAuthenticated, documentId: props.documentId });
        }

        const namedRecipients = recipientFieldSummaries(placedFields.value, recipients.value);

        const reviewData = {
            pageCount:      numPages.value,
            fieldCount:     placedFields.value.length,
            recipientCount: namedRecipients.length,
            recipients:     namedRecipients,
            signingMode:    signingMode.value,
            placedFields:   placedFields.value,
        };

        window.__cubsignSession = {
            token:         props.session.token,
            documentId:    props.documentId,
            signedPdf:     bytes,
            filename:      props.session.filename,
            reviewData,
            documentSaved,
        };

        try {
            const xsrf = decodeURIComponent(
                document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
            );
            await fetch(route('sign.review.snapshot'), {
                method:      'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf },
                body: JSON.stringify({ reviewData }),
            });
        } catch (e) {
            console.warn('[CubSign] review snapshot save failed:', e);
        }

        console.log('BEFORE_REVIEW_NAVIGATION', { documentSaved });
        router.visit(route('sign.review'));
    } catch (err) {
        console.error('[CubSign] GO_TO_REVIEW_EXCEPTION', err);
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

        <!-- Initialization error -->
        <div
            v-if="workspaceInitState === 'error'"
            class="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 px-6 text-center"
        >
            <p class="text-sm font-semibold text-red-600">{{ initError ?? 'Unable to load document.' }}</p>
            <div class="flex items-center gap-3">
                <button
                    type="button"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    @click="retryInit"
                >
                    Retry
                </button>
                <Link :href="route('sign.index')" class="text-sm text-blue-600 hover:underline">
                    Re-upload document
                </Link>
            </div>
        </div>

        <!-- Workspace (always mounted so PDF canvases can render during init) -->
        <div
            v-else
            class="relative flex h-full min-h-0 flex-col overflow-hidden"
            :class="workspaceInitState !== 'ready' && 'pointer-events-none'"
        >

        <!-- Loading overlay -->
        <div
            v-if="workspaceInitState === 'loading'"
            class="absolute inset-0 z-50 flex bg-[#e2e4e9]"
        >
            <SignWorkspaceLoader message="Loading document…" />
        </div>

        <!-- ░░░░ EDITOR WORKSPACE — responsive 3-col (lg) / 2-col (md) / stacked (mobile) ░░░░ -->
        <div class="flex h-full min-h-0 w-full flex-col overflow-hidden lg:flex-row">

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
                            <canvas
                                :ref="el => { thumbCanvases[i] = el ?? undefined }"
                                class="block h-full w-auto mx-auto lg:h-auto lg:w-full"
                            />
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

                <!-- Manual-placement banner removed — floating tooltip only -->

                <!-- Scrollable pages -->
                <div
                    ref="centerRef"
                    class="relative flex-1 overflow-y-auto overflow-x-auto"
                    :class="placementMode === 'manual' ? 'cursor-crosshair' : 'cursor-default'"
                >
                    <EditorPlacementHelper
                        :active="placementMode === 'manual'"
                        @cancel="cancelPlacement"
                    />

                    <!-- Loading overlay (does NOT unmount page canvases) -->
                    <div
                        v-show="isLoading"
                        class="absolute inset-0 z-20 flex items-center justify-center bg-gray-200/80"
                    >
                        <div class="flex flex-col items-center gap-4">
                            <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                            <p class="text-sm text-gray-500">Loading document…</p>
                        </div>
                    </div>

                    <!-- Error state -->
                    <div v-if="loadError" class="flex h-full items-center justify-center p-8 text-center">
                        <div>
                            <p class="mb-2 text-sm font-semibold text-red-600">{{ loadError }}</p>
                            <button
                                type="button"
                                class="mr-3 text-xs font-medium text-blue-600 hover:underline"
                                @click="retryInit"
                            >
                                Retry
                            </button>
                            <Link :href="route('sign.index')" class="text-xs text-blue-600 hover:underline">Re-upload document</Link>
                        </div>
                    </div>

                    <!-- PDF pages — always mounted when pageDims exist so render can target canvases -->
                    <div
                        v-else-if="pageDims.length > 0"
                        class="flex flex-col items-start gap-8 py-6 px-3 md:items-center md:px-6"
                    >
                        <div
                            v-for="(dim, i) in pageDims"
                            :key="`page-${i}`"
                            class="page-wrapper relative shadow-xl ring-1 ring-black/10"
                            :style="{ width: `${dim.w}px`, height: `${dim.h}px` }"
                        >
                            <!-- PDF canvas: dimensions set only in renderToCanvas, not reactive bindings -->
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

                                <!-- Placed fields (signature, initials, date, name, text, checkbox) -->
                                <div
                                    v-for="field in placedFieldsOnPage(i + 1)"
                                    :key="field.id"
                                    class="group/field absolute select-none transition-all duration-200"
                                    :class="field.id === selectedSigId ? 'z-20' : 'z-10'"
                                    :title="`Assigned to ${recipientDisplayName(field.signerId)}`"
                                    :style="`left:${field.x}px; top:${field.y}px; width:${field.w}px; height:${field.h}px; cursor:move; opacity:${recipients.length > 1 && field.signerId !== activeRecipientId ? '0.55' : '1'}`"
                                    @mousedown.stop="startDrag($event, field)"
                                    @touchstart.stop="startDrag($event, field)"
                                    @dblclick.stop="onFieldDoubleClick(field)"
                                    @click.stop
                                >
                                    <!-- Recipient + field badge -->
                                    <div
                                        class="absolute -left-px -top-5 flex items-center gap-1 rounded-t px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm transition-opacity duration-200"
                                        :style="`background:${isSignPlaceholder(field) && field.value?.src !== 'Signature' && field.value?.src !== 'Initials' ? (recipientById(field.signerId)?.color ?? '#3B82F6') : isTemplatePlaceholder(field) ? '#F59E0B' : (recipientById(field.signerId)?.color ?? '#3B82F6')}`"
                                    >
                                        <span
                                            class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/25 text-[7px]"
                                        >{{ isTemplatePlaceholder(field) ? '?' : recipientInitials(recipientById(field.signerId)) }}</span>
                                        <span class="truncate capitalize">{{ field.type }}</span>
                                    </div>
                                    <div
                                        class="relative h-full w-full overflow-hidden rounded"
                                        :style="`background:${isTemplatePlaceholder(field) ? 'rgba(254,243,199,0.6)' : 'rgba(239,246,255,0.4)'}; outline:${field.id === selectedSigId ? '2px' : '1px'} solid ${isTemplatePlaceholder(field) ? '#F59E0B' : (recipientById(field.signerId)?.color ?? '#3B82F6')}${field.id === selectedSigId ? '' : '50'}; outline-offset:${field.id === selectedSigId ? '1px' : '0'}`"
                                    >
                                        <!-- Recipient name strip — shown when field is selected -->
                                        <div
                                            v-if="field.id === selectedSigId"
                                            class="absolute left-0 right-0 top-0 z-10 truncate px-1.5 py-px text-[8px] font-semibold text-white"
                                            :style="`background:${isSignPlaceholder(field) && field.value?.src !== 'Signature' && field.value?.src !== 'Initials' ? (recipientById(field.signerId)?.color ?? '#3B82F6') : isTemplatePlaceholder(field) ? '#F59E0B' : (recipientById(field.signerId)?.color ?? '#3B82F6')}`"
                                        >{{ isSignPlaceholder(field) ? recipientDisplayName(field.signerId) : (recipientById(field.signerId)?.name || 'Signer') }}</div>

                                        <!-- Signature / Initials -->
                                        <template v-if="field.type === 'signature' || field.type === 'initials'">
                                            <div
                                                v-if="isSignPlaceholder(field)"
                                                class="flex h-full w-full flex-col items-center justify-center border-2 border-dashed bg-[#FFFDF5] px-1"
                                                :style="`border-color:${recipientById(field.signerId)?.color ?? '#3B82F6'}`"
                                            >
                                                <svg class="mb-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    :style="`color:${recipientById(field.signerId)?.color ?? '#3B82F6'}`">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                <span class="text-[9px] font-bold uppercase tracking-wide text-gray-700">{{ signPlaceholderLabel(field) }}</span>
                                            </div>
                                            <img
                                                v-else-if="field.value?.sigType === 'image'"
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
                                                v-if="isRequestMode && !field.value"
                                                class="flex h-full w-full items-center justify-center border-2 border-dashed bg-[#FFFDF5] px-1"
                                                :style="`border-color:${recipientById(field.signerId)?.color ?? '#3B82F6'}60`"
                                            >
                                                <span class="text-[9px] font-semibold capitalize text-gray-500">{{ field.type }}</span>
                                            </div>
                                            <div
                                                v-else
                                                class="flex h-full w-full items-center overflow-hidden px-2"
                                                :style="`border:1px solid ${recipientById(field.signerId)?.color ?? '#3B82F6'}40; background:${recipientById(field.signerId)?.color ?? '#3B82F6'}0d`"
                                            >
                                                <span class="truncate text-xs text-gray-800">{{ field.value || '…' }}</span>
                                            </div>
                                        </template>
                                    </div>

                                    <!-- Delete on hover -->
                                    <button
                                        type="button"
                                        class="absolute -right-2 -top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition-opacity duration-150 hover:bg-red-600 group-hover/field:opacity-100"
                                        style="font-size:9px"
                                        title="Delete field"
                                        @mousedown.stop
                                        @touchstart.stop
                                        @click.stop="removeField(field.id)"
                                    >✕</button>

                                    <!-- Resize handles (when selected) -->
                                    <template v-if="field.id === selectedSigId">
                                        <div
                                            v-for="h in HANDLES"
                                            :key="h.id"
                                            class="absolute z-20 h-2.5 w-2.5 rounded-full border-2 border-white shadow-md"
                                            :class="h.pos"
                                            :style="`cursor:${h.cur}; background:${isTemplatePlaceholder(field) ? '#F59E0B' : (recipientById(field.signerId)?.color ?? '#3B82F6')}`"
                                            @mousedown.stop="startResize($event, field, h.id)"
                                            @touchstart.stop="startResize($event, field, h.id)"
                                        />
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
            <aside class="flex max-h-[240px] w-full flex-col overflow-y-auto border-t border-gray-200 bg-white sm:max-h-[320px] md:max-h-none md:w-[252px] md:shrink-0 md:border-t-0 md:border-l">

                <EditorDocumentInfo
                    :filename="session.filename"
                    :num-pages="numPages"
                    :file-size="session.fileSize"
                />

                <EditorSigningMode
                    v-if="isAuthenticated"
                    :mode="signingMode"
                    @update:mode="setSigningMode"
                />

                <EditorRecipientSection
                    v-if="isAuthenticated && isRequestMode"
                    ref="recipientSectionRef"
                    :recipients="recipients"
                    :active-recipient-id="activeRecipientId"
                    :drag-over-recipient-id="dragOverRecipientId"
                    :field-count-for="fieldCountForRecipient"
                    :has-configured-recipient="hasRecipientConfigured"
                    :recipients-visible="recipientListVisible"
                    @add="openAddRecipientModal"
                    @select="activeRecipientId = $event"
                    @remove="removeRecipient"
                    @update:name="(id, v) => updateRecipientField(id, 'name', v)"
                    @update:email="(id, v) => updateRecipientField(id, 'email', v)"
                    @dragstart="onRecipientDragStart"
                    @dragover="onRecipientDragOver"
                    @dragleave="onRecipientDragLeave"
                    @drop="onRecipientDrop"
                    @dragend="onRecipientDragEnd"
                />
                <EditorGuestRecipient v-else-if="!isAuthenticated" :user-name="authUserName" />

                <EditorEmptyState
                    v-if="emptyStateStep && !(isRequestMode && !hasRecipientConfigured)"
                    :step="emptyStateStep"
                />

                <EditorFieldTypeGrid
                    :field-types="FIELD_TYPES"
                    :active-field-type="activeFieldType"
                    :disabled="requestFieldsLocked"
                    @select="setFieldType"
                    @blocked="showRequestToast()"
                />

                <EditorFieldSettings
                    v-if="isSelfSignMode && (activeFieldType === 'date' || activeFieldType === 'name' || activeFieldType === 'text')"
                    :active-field-type="activeFieldType"
                    :pending-date="pendingDate"
                    :pending-text="pendingText"
                    @update:pending-date="pendingDate = $event"
                    @update:pending-text="pendingText = $event"
                />

                <EditorRequestFieldHint
                    v-if="isRequestMode"
                    :active-field-type="activeFieldType"
                    :has-recipients="hasRecipientConfigured"
                    :show-onboarding-hint="requestOnboardingHint"
                />

                <template v-if="isSelfSignMode">
                    <EditorSignaturePanel
                        v-show="activeFieldType === 'signature'"
                        ref="sigPanelRef"
                        active-field-type="signature"
                        :active-tab="signatureTab"
                        :typed-name="typedName"
                        :typed-font="typedFont"
                        :uploaded-sig="uploadedSig"
                        :signature-ready="signatureReady"
                        :saved-asset="savedSignature"
                        :is-changing="isChangingSignature"
                        :type-fonts="typeFonts"
                        :has-template-placeholders="hasTemplatePlaceholders && activeFieldType === 'signature'"
                        :template-placeholder-count="templatePlaceholderCount"
                        @update:active-tab="signatureTab = $event"
                        @update:typed-name="typedName = $event"
                        @update:typed-font="typedFont = $event"
                        @update:has-drawing="hasDrawingSignature = $event"
                        @upload="uploadInput?.click()"
                        @save="captureSignature"
                        @change="startChangeAsset"
                        @use-existing="useExistingAsset"
                    />
                    <EditorSignaturePanel
                        v-show="activeFieldType === 'initials'"
                        ref="initialsPanelRef"
                        active-field-type="initials"
                        :active-tab="initialsTab"
                        :typed-name="typedName"
                        :typed-font="typedFont"
                        :uploaded-sig="uploadedSig"
                        :signature-ready="signatureReady"
                        :saved-asset="savedInitials"
                        :is-changing="isChangingInitials"
                        :type-fonts="typeFonts"
                        :has-template-placeholders="hasTemplatePlaceholders && activeFieldType === 'initials'"
                        :template-placeholder-count="templatePlaceholderCount"
                        @update:active-tab="initialsTab = $event"
                        @update:typed-name="typedName = $event"
                        @update:typed-font="typedFont = $event"
                        @update:has-drawing="hasDrawingInitials = $event"
                        @upload="uploadInput?.click()"
                        @save="captureSignature"
                        @change="startChangeAsset"
                        @use-existing="useExistingAsset"
                    />
                </template>
                <input ref="uploadInput" type="file" accept="image/*" class="hidden" @change="handleUpload" />

            </aside>
            </div><!-- /pdf-panel inner wrapper -->
        </div><!-- /outer workspace wrapper -->

        <EditorBottomActionBar
            :fields-placed="setupFieldsPlaced"
            :is-finishing="isFinishing"
            @review="goToReview"
        />

        <EditorAddRecipientModal
            :open="showAddRecipientModal"
            :existing-emails="existingRecipientEmails"
            @close="showAddRecipientModal = false"
            @save="saveRecipientFromModal"
        />

        <EditorSigningModeSwitchModal
            :show="modeSwitchModal.show"
            :title="modeSwitchModal.title"
            :lead="modeSwitchModal.lead"
            :subtitle="modeSwitchModal.subtitle"
            :bullets="modeSwitchModal.bullets"
            :footer="modeSwitchModal.footer"
            :confirm-label="modeSwitchModal.confirmLabel"
            @close="closeModeSwitchModal"
            @confirm="confirmModeSwitch"
        />

        <!-- Request-mode toast -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-2 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-2 opacity-0"
            >
                <div
                    v-if="requestToast"
                    class="fixed bottom-6 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg"
                    role="status"
                >
                    {{ requestToast }}
                </div>
            </Transition>
        </Teleport>

        </div><!-- /workspace wrapper -->

    </SignLayout>
</template>
