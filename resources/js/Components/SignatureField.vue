<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { createSignaturePad } from '@/utils/signatureCanvas';

const props = defineProps({
    isInitials: { type: Boolean, default: false },
});

const containerRef = ref(null);
const canvasRef    = ref(null);
const padApi       = ref(null);
const activeTab    = ref('draw');
const typedText    = ref('');
const typedFontId  = ref('script');
const hasContent   = ref(false);

const typeFonts = computed(() => padApi.value?.typeFonts ?? []);

const showPlaceholder = computed(() => {
    if (activeTab.value === 'type') return typedText.value.trim() === '';
    return !hasContent.value;
});

onMounted(() => {
    if (!canvasRef.value) return;

    const api = createSignaturePad(canvasRef.value, {
        isInitials: props.isInitials,
        onChange:   () => { hasContent.value = !api.isEmpty(); },
    });

    padApi.value = api;
    api.mount(containerRef.value);
});

onBeforeUnmount(() => {
    padApi.value?.destroy();
});

function setTab(tab) {
    activeTab.value = tab;
    padApi.value?.setTab(tab);
}

function onTypedInput(e) {
    typedText.value = e.target.value;
    padApi.value?.setTypedText(typedText.value);
}

function onFontPick(id) {
    typedFontId.value = id;
    padApi.value?.setTypedFont(id);
}

function clear() {
    typedText.value = '';
    padApi.value?.clear();
    hasContent.value = false;
}

function undo() {
    padApi.value?.undo();
    hasContent.value = !padApi.value?.isEmpty();
}

function exportPng() {
    return padApi.value?.exportPng() ?? '';
}

function isEmpty() {
    return padApi.value?.isEmpty() ?? true;
}

defineExpose({ exportPng, isEmpty, clear });
</script>

<template>
    <div ref="containerRef" class="signature-field">
        <!-- Tabs -->
        <div class="mb-2 flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
                type="button"
                :class="[
                    'flex-1 rounded-md py-1.5 text-xs font-medium transition',
                    activeTab === 'draw' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                ]"
                @click="setTab('draw')"
            >
                Draw
            </button>
            <button
                type="button"
                :class="[
                    'flex-1 rounded-md py-1.5 text-xs font-medium transition',
                    activeTab === 'type' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                ]"
                @click="setTab('type')"
            >
                Type
            </button>
        </div>

        <!-- Draw -->
        <div v-show="activeTab === 'draw'" class="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
            <canvas
                ref="canvasRef"
                class="block w-full touch-none cursor-crosshair"
                :style="{ height: isInitials ? '100px' : '150px' }"
            />
            <p
                v-if="showPlaceholder"
                class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-gray-300"
            >
                {{ isInitials ? 'Draw initials here' : 'Draw signature here' }}
            </p>
        </div>

        <!-- Type -->
        <div v-show="activeTab === 'type'" class="space-y-2">
            <input
                :value="typedText"
                type="text"
                :placeholder="isInitials ? 'Type your initials' : 'Type your full name'"
                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                @input="onTypedInput"
            />
            <div class="grid grid-cols-3 gap-1.5">
                <button
                    v-for="f in typeFonts"
                    :key="f.id"
                    type="button"
                    :class="[
                        'flex min-h-[44px] items-center justify-center overflow-hidden rounded-lg border px-1 py-2 text-sm transition',
                        typedFontId === f.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300',
                    ]"
                    :style="{ color: '#1e293b', fontFamily: f.family, fontStyle: f.style, fontWeight: f.weight }"
                    @click="onFontPick(f.id)"
                >
                    {{ f.label }}
                </button>
            </div>
            <div
                v-if="typedText.trim()"
                class="flex min-h-[52px] items-center overflow-hidden rounded-lg border border-blue-100 bg-blue-50/40 px-4"
            >
                <span
                    class="truncate text-2xl"
                    :style="{
                        color: '#1e293b',
                        fontFamily: (typeFonts.find(f => f.id === typedFontId) ?? typeFonts[0])?.family,
                        fontStyle: (typeFonts.find(f => f.id === typedFontId) ?? typeFonts[0])?.style,
                        fontWeight: (typeFonts.find(f => f.id === typedFontId) ?? typeFonts[0])?.weight,
                    }"
                >
                    {{ typedText }}
                </span>
            </div>
        </div>

        <!-- Actions -->
        <div class="mt-2 flex items-center gap-3">
            <button
                v-if="activeTab === 'draw'"
                type="button"
                class="text-xs font-medium text-gray-500 hover:text-gray-800"
                @click="undo"
            >
                Undo
            </button>
            <button
                type="button"
                class="text-xs font-medium text-gray-500 hover:text-gray-800"
                @click="clear"
            >
                Clear
            </button>
        </div>
    </div>
</template>
