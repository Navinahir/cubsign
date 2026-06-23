<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    token:         { type: String,  required: true },
    recipient:     { type: Object,  required: true },
    document:      { type: Object,  required: true },
    fields:        { type: Array,   default: () => [] },
    alreadySigned: { type: Boolean, default: false },
});

const fieldValues = ref({});
const canvasRefs  = ref({});
const submitState = ref('idle'); // 'idle' | 'loading' | 'success' | 'error'
const submitError = ref('');

let drawing = false, lastX = 0, lastY = 0;

onMounted(() => {
    const today = new Date().toISOString().split('T')[0];
    props.fields.forEach(f => {
        if (f.type === 'date')          fieldValues.value[f.id] = today;
        else if (f.type === 'checkbox') fieldValues.value[f.id] = false;
        else                            fieldValues.value[f.id] = f.value ?? '';
    });
});

function setCanvasRef(fieldId, el) {
    if (el) canvasRefs.value[fieldId] = el;
}

function getPos(canvas, e) {
    const r   = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
}

function onDrawStart(fieldId, e) {
    drawing = true;
    const canvas = canvasRefs.value[fieldId];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    const { x, y } = getPos(canvas, e);
    lastX = x; lastY = y;
}

function onDraw(fieldId, e) {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRefs.value[fieldId];
    if (!canvas) return;
    const ctx     = canvas.getContext('2d');
    const { x, y } = getPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x; lastY = y;
    fieldValues.value[fieldId] = canvas.toDataURL();
}

function onDrawEnd() { drawing = false; }

function clearCanvas(fieldId) {
    const canvas = canvasRefs.value[fieldId];
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    fieldValues.value[fieldId] = '';
}

function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });
}

async function finishSigning() {
    if (submitState.value === 'loading') return;
    submitState.value = 'loading';
    submitError.value = '';

    const signed = props.fields.map(f => ({
        id:    f.id,
        type:  f.type,
        value: fieldValues.value[f.id] ?? '',
    }));

    try {
        const xsrf = decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
        const res = await fetch(route('recipient.complete', props.token), {
            method:      'POST',
            credentials: 'same-origin',
            headers:     { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf },
            body:        JSON.stringify({ signed_fields: signed }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            submitError.value = data.message ?? 'Something went wrong. Please try again.';
            submitState.value = 'error';
            return;
        }

        submitState.value = 'success';
    } catch {
        submitError.value = 'Network error. Please check your connection.';
        submitState.value = 'error';
    }
}
</script>

<template>
    <div class="flex h-screen flex-col bg-gray-50">

        <!-- Header -->
        <header class="shrink-0 border-b border-gray-200 bg-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-14 items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                            <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <span class="font-bold text-gray-900">CubSign</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg class="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        Secure &amp; Private
                    </div>
                </div>
            </div>
        </header>

        <!-- Already signed -->
        <div v-if="alreadySigned" class="flex flex-1 items-center justify-center p-8">
            <div class="max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="mb-1 text-lg font-semibold text-emerald-900">Already signed</h2>
                <p class="text-sm text-emerald-700">
                    You have already signed <strong>{{ document.name }}</strong>. No further action is needed.
                </p>
                <p v-if="recipient.signed_at" class="mt-2 text-xs text-emerald-600">
                    Signed {{ formatDate(recipient.signed_at) }}
                </p>
            </div>
        </div>

        <!-- Signing complete -->
        <div v-else-if="submitState === 'success'" class="flex flex-1 items-center justify-center p-8">
            <div class="max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="mb-1 text-lg font-semibold text-emerald-900">Signing complete</h2>
                <p class="text-sm text-emerald-700">
                    Thank you, <strong>{{ recipient.name }}</strong>. Your signature has been recorded for
                    <em>{{ document.name }}</em>.
                </p>
            </div>
        </div>

        <!-- Main signing view -->
        <div v-else class="flex min-h-0 flex-1 overflow-hidden">

            <!-- PDF preview (desktop only) -->
            <div class="hidden min-w-0 flex-1 flex-col border-r border-gray-200 bg-white lg:flex">
                <div class="shrink-0 border-b border-gray-100 px-5 py-3">
                    <p class="text-sm font-medium text-gray-700">{{ document.name }}</p>
                </div>
                <iframe
                    :src="route('recipient.pdf', token)"
                    class="min-h-0 flex-1 w-full"
                    title="Document preview"
                />
            </div>

            <!-- Signing panel -->
            <div class="flex w-full flex-col overflow-y-auto lg:w-96 lg:shrink-0">
                <div class="px-6 py-6">

                    <!-- Recipient info -->
                    <div class="mb-5 flex items-center gap-3">
                        <span
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            :style="{ backgroundColor: recipient.color || '#3B82F6' }"
                        >
                            {{ (recipient.name || '#')[0].toUpperCase() }}
                        </span>
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-gray-900">{{ recipient.name }}</p>
                            <p class="truncate text-xs text-gray-500">{{ recipient.email }}</p>
                        </div>
                    </div>

                    <h1 class="mb-0.5 text-base font-bold text-gray-900">Sign document</h1>
                    <p class="mb-6 text-sm text-gray-500">
                        Complete the fields below to sign <em>{{ document.name }}</em>.
                    </p>

                    <!-- No fields assigned -->
                    <div
                        v-if="fields.length === 0"
                        class="mb-6 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                        No fields have been assigned to you in this document.
                    </div>

                    <!-- Fields -->
                    <div v-else class="mb-6 space-y-5">
                        <div v-for="field in fields" :key="field.id">

                            <p class="mb-1.5 text-xs font-semibold text-gray-600">
                                <template v-if="field.type === 'signature'">Signature</template>
                                <template v-else-if="field.type === 'initials'">Initials</template>
                                <template v-else-if="field.type === 'date'">Date</template>
                                <template v-else-if="field.type === 'checkbox'">{{ field.label || 'Checkbox' }}</template>
                                <template v-else>{{ field.label || 'Text' }}</template>
                            </p>

                            <!-- Signature / Initials canvas -->
                            <template v-if="field.type === 'signature' || field.type === 'initials'">
                                <div class="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                                    <canvas
                                        :ref="el => setCanvasRef(field.id, el)"
                                        :width="field.type === 'initials' ? 200 : 320"
                                        :height="field.type === 'initials' ? 80  : 120"
                                        class="block w-full touch-none cursor-crosshair"
                                        @mousedown="e => onDrawStart(field.id, e)"
                                        @mousemove="e => onDraw(field.id, e)"
                                        @mouseup="onDrawEnd"
                                        @mouseleave="onDrawEnd"
                                        @touchstart.prevent="e => onDrawStart(field.id, e)"
                                        @touchmove.prevent="e => onDraw(field.id, e)"
                                        @touchend="onDrawEnd"
                                    />
                                    <p
                                        v-if="!fieldValues[field.id]"
                                        class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-gray-300"
                                    >
                                        {{ field.type === 'initials' ? 'Draw initials here' : 'Draw signature here' }}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    class="mt-1 text-xs text-gray-400 hover:text-gray-600"
                                    @click="clearCanvas(field.id)"
                                >
                                    Clear
                                </button>
                            </template>

                            <!-- Date -->
                            <input
                                v-else-if="field.type === 'date'"
                                v-model="fieldValues[field.id]"
                                type="date"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />

                            <!-- Checkbox -->
                            <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
                                <input
                                    :id="`field-${field.id}`"
                                    v-model="fieldValues[field.id]"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label :for="`field-${field.id}`" class="text-sm text-gray-700">
                                    {{ field.label || 'I agree' }}
                                </label>
                            </div>

                            <!-- Text fallback -->
                            <input
                                v-else
                                v-model="fieldValues[field.id]"
                                type="text"
                                :placeholder="field.label || 'Enter text'"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />

                        </div>
                    </div>

                    <!-- Error -->
                    <div
                        v-if="submitState === 'error'"
                        class="mb-4 flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {{ submitError }}
                    </div>

                    <!-- Finish Signing -->
                    <button
                        :disabled="submitState === 'loading'"
                        :class="[
                            'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition',
                            submitState === 'loading'
                                ? 'cursor-not-allowed bg-blue-400'
                                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]',
                        ]"
                        @click="finishSigning"
                    >
                        <svg v-if="submitState === 'loading'" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        {{ submitState === 'loading' ? 'Signing…' : 'Finish Signing' }}
                    </button>

                </div>
            </div>
        </div>

    </div>
</template>
