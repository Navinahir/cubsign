<script setup>
import { computed, watch, onBeforeUnmount, nextTick } from 'vue';
import { useSignaturePad } from './useSignaturePad';

const props = defineProps({
    activeFieldType:          { type: String, required: true },
    activeTab:                { type: String, default: 'draw' },
    typedName:                { type: String, default: '' },
    typedFont:                { type: String, default: 'script' },
    uploadedSig:              { type: String, default: null },
    signatureReady:           { type: Boolean, default: false },
    savedAsset:               { type: Object, default: null },
    isChanging:               { type: Boolean, default: false },
    typeFonts:                { type: Array, required: true },
    hasTemplatePlaceholders:  { type: Boolean, default: false },
    templatePlaceholderCount: { type: Number, default: 0 },
});

const emit = defineEmits([
    'update:activeTab',
    'update:typedName',
    'update:typedFont',
    'update:hasDrawing',
    'upload',
    'save',
    'change',
    'use-existing',
]);

const {
    canvasRef,
    containerRef,
    hasDrawing,
    initPad,
    setupResizeObserver,
    setReadOnly,
    clearPad,
    undoStroke,
    exportPng,
    isEmpty,
    destroy,
    CANVAS_HEIGHT_PX,
} = useSignaturePad();

const isInitials = computed(() => props.activeFieldType === 'initials');
const assetLabel = computed(() => (isInitials.value ? 'Initials' : 'Signature'));
const showReady    = computed(() => props.savedAsset && !props.isChanging);
const showCreation = computed(() => !props.savedAsset || props.isChanging);

watch(hasDrawing, (v) => emit('update:hasDrawing', v));

watch(showReady, (ready) => {
    setReadOnly(ready);
}, { immediate: true });

watch(
    () => [showCreation.value, props.activeTab],
    async ([creating, tab]) => {
        if (!creating || tab !== 'draw') return;
        await nextTick();
        initPad();
        setupResizeObserver();
        if (!showReady.value) {
            setReadOnly(false);
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    destroy();
});

defineExpose({ exportPng, isEmpty, clearPad, undoStroke, hasDrawing });
</script>

<template>
    <div v-if="activeFieldType === 'signature' || activeFieldType === 'initials'" class="px-3 py-2.5">
        <p class="text-xs font-semibold text-gray-900">{{ assetLabel }}</p>

        <!-- Saved — read-only preview -->
        <div v-show="showReady" class="mt-2">
            <div class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2">
                <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-xs font-semibold text-emerald-700">{{ assetLabel }} Saved</span>
            </div>

            <div class="mt-2 flex min-h-[56px] items-center justify-center rounded-lg border border-gray-200 bg-white p-2">
                <img
                    v-if="savedAsset?.type === 'image'"
                    :src="savedAsset.src"
                    class="max-h-14 object-contain"
                    :alt="`${assetLabel} preview`"
                />
                <span v-else-if="savedAsset" :class="savedAsset.font" class="text-xl" style="color:#1e40af">{{ savedAsset.src }}</span>
            </div>

            <p class="mt-2 text-center text-[10px] text-gray-400">
                Click the document to place {{ isInitials ? 'initials' : 'a signature' }}
            </p>

            <button
                type="button"
                class="mt-2 w-full rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                @click="$emit('change')"
            >
                Change {{ assetLabel }}
            </button>
        </div>

        <!-- Create / change — draw, type, upload -->
        <div v-show="showCreation" class="mt-2">
            <div v-if="savedAsset && isChanging" class="mb-2">
                <button
                    type="button"
                    class="w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    @click="$emit('use-existing')"
                >
                    Use Existing {{ assetLabel }}
                </button>
            </div>

            <div class="flex rounded-lg bg-gray-100 p-0.5">
                <button
                    v-for="tab in ['draw', 'type', 'upload']"
                    :key="tab"
                    type="button"
                    :class="[
                        'flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition duration-200',
                        activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                    ]"
                    @click="$emit('update:activeTab', tab)"
                >{{ tab }}</button>
            </div>

            <!-- Draw tab: canvas always in DOM (v-show) so SignaturePad is not recreated on tab switch -->
            <div v-show="activeTab === 'draw'" class="mt-2">
                <div
                    ref="containerRef"
                    class="relative overflow-hidden rounded-lg border border-gray-200 bg-white"
                    style="touch-action: none"
                >
                    <canvas
                        ref="canvasRef"
                        class="block w-full touch-none"
                        :style="{ height: `${CANVAS_HEIGHT_PX}px` }"
                    />
                    <p
                        v-if="!hasDrawing"
                        class="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-400"
                    >
                        Draw here
                    </p>
                </div>
                <div v-if="hasDrawing" class="mt-1.5 flex items-center gap-3">
                    <button type="button" class="text-[11px] text-gray-400 hover:text-gray-600" @click="undoStroke">
                        Undo
                    </button>
                    <button type="button" class="text-[11px] text-gray-400 hover:text-gray-600" @click="clearPad">
                        Clear
                    </button>
                </div>
            </div>

            <div v-show="activeTab === 'type'" class="mt-2 space-y-2">
                <input
                    :value="typedName"
                    type="text"
                    :placeholder="isInitials ? 'Your initials' : 'Your full name'"
                    class="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    @input="$emit('update:typedName', $event.target.value)"
                />
                <div class="grid grid-cols-3 gap-1">
                    <button
                        v-for="f in typeFonts"
                        :key="f.id"
                        type="button"
                        :class="[
                            'rounded border py-2 text-center transition',
                            typedFont === f.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300',
                        ]"
                        @click="$emit('update:typedFont', f.id)"
                    >
                        <span :class="f.cls" class="text-sm" style="color:#1e40af">{{ f.label }}</span>
                    </button>
                </div>
            </div>

            <div v-show="activeTab === 'upload'" class="mt-2">
                <button
                    type="button"
                    class="flex w-full flex-col items-center rounded-lg border border-dashed border-gray-200 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50/40"
                    @click="$emit('upload')"
                >
                    <svg class="mb-1 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-xs text-gray-500">Upload image</span>
                </button>
                <img v-if="uploadedSig" :src="uploadedSig" class="mt-2 max-h-14 w-full rounded border border-gray-200 object-contain" />
            </div>

            <button
                v-if="signatureReady"
                type="button"
                class="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 active:scale-[0.98]"
                @click="$emit('save')"
            >
                Save {{ assetLabel }}
            </button>

            <p v-if="hasTemplatePlaceholders" class="mt-2 text-[10px] text-amber-600">
                {{ templatePlaceholderCount }} template {{ activeFieldType }} {{ templatePlaceholderCount === 1 ? 'slot' : 'slots' }} will be filled on save.
            </p>
        </div>
    </div>
</template>
