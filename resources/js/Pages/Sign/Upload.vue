<script setup>
import { ref, computed, onMounted } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';

const props = defineProps({
    guestCompleted: { type: Boolean, default: false },
});

const form = useForm({ pdf: null });

onMounted(() => {
    window.__cubsignSession = null;
});

const isDragging   = ref(false);
const selectedFile = ref(null);
const localError   = ref(null);
const inputRef     = ref(null);

const error = computed(() => localError.value || form.errors.pdf || null);

function handleDragOver(e) {
    e.preventDefault();
    isDragging.value = true;
}

function handleDragLeave(e) {
    e.preventDefault();
    isDragging.value = false;
}

function handleDrop(e) {
    e.preventDefault();
    isDragging.value = false;
    const file = e.dataTransfer.files[0];
    if (file) validate(file);
}

function handleFileInput(e) {
    const file = e.target.files[0];
    if (file) validate(file);
}

function validate(file) {
    localError.value = null;
    form.clearErrors();
    if (file.type !== 'application/pdf') {
        localError.value = 'Only PDF files are accepted.';
        return;
    }
    if (file.size > 25 * 1024 * 1024) {
        localError.value = 'The file must not exceed 25 MB.';
        return;
    }
    selectedFile.value = file;
    form.pdf = file;
}

function removeFile() {
    selectedFile.value = null;
    form.pdf = null;
    localError.value = null;
    form.clearErrors();
    if (inputRef.value) inputRef.value.value = '';
}

function submit() {
    if (!selectedFile.value || form.processing) return;
    form.post(route('sign.store'), { forceFormData: true });
}

function formatSize(bytes) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
</script>

<template>
    <MarketingSeo
        title="Sign PDF Online Free — CubSign"
        description="Upload a PDF and sign it in your browser. Draw, type, or upload your signature—no install required. Free during CubSign Early Access."
        path="/sign"
    />
    <SignLayout :step="1">
        <h1 class="sr-only">Sign a PDF online</h1>
        <div class="flex h-full flex-col overflow-hidden">

            <!-- ─── Workspace row ─────────────────────────────── -->
            <div class="flex min-h-0 flex-1 overflow-hidden">

                <!-- ─── Thumbnail strip placeholder (decorative — desktop only) ──── -->
                <div class="hidden w-[72px] shrink-0 flex-col items-center gap-2.5 overflow-y-auto bg-gray-300 px-2 py-3 lg:flex">
                    <div
                        v-for="n in 3"
                        :key="n"
                        class="w-full overflow-hidden rounded border border-gray-400/30 bg-gray-200/60"
                        style="aspect-ratio: 8.5 / 11"
                    >
                        <div class="flex flex-col gap-[3px] p-1.5">
                            <div v-for="j in 7" :key="j" class="h-[2px] rounded-full bg-gray-400/40"
                                 :style="{ width: (j % 3 === 0 ? '65%' : j % 2 === 0 ? '80%' : '95%') }" />
                        </div>
                    </div>
                </div>

                <!-- ─── Center workspace / drop zone ─────────── -->
                <div
                    class="relative flex min-h-0 flex-1 flex-col items-center justify-center transition-colors duration-200"
                    :class="isDragging && !guestCompleted ? 'bg-blue-50' : 'bg-[#e2e4e9]'"
                    @dragover="!guestCompleted && handleDragOver($event)"
                    @dragleave="!guestCompleted && handleDragLeave($event)"
                    @drop="!guestCompleted && handleDrop($event)"
                >

                    <!-- ── Guest limit reached ─────────────────── -->
                    <div v-if="guestCompleted" class="relative z-10 flex w-full max-w-sm flex-col px-6">
                        <div class="relative rounded-2xl border-2 border-blue-500 bg-white p-6 shadow-lg shadow-blue-100/50">
                            <div class="absolute -top-[13px] left-1/2 -translate-x-1/2">
                                <span class="whitespace-nowrap rounded-full bg-blue-600 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                                    Free limit reached
                                </span>
                            </div>

                            <div class="mb-4 flex justify-center">
                                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 ring-1 ring-blue-200/80">
                                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                </div>
                            </div>

                            <h2 class="text-center text-base font-bold text-gray-900">Your free signing session has already been used</h2>
                            <p class="mt-2 text-center text-sm leading-relaxed text-gray-500">
                                Create a free account to continue signing unlimited documents.
                            </p>

                            <div class="mt-5 space-y-2.5">
                                <a
                                    :href="route('auth.google')"
                                    class="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:bg-gray-100"
                                >
                                    <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Continue with Google
                                </a>

                                <Link
                                    :href="route('register')"
                                    class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                                >
                                    Create free account
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </Link>

                                <p class="text-center text-xs text-gray-500">
                                    Already have an account?
                                    <Link :href="route('login')" class="font-semibold text-blue-600 hover:text-blue-700">Log in</Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Invisible file input over entire drop zone -->
                    <input
                        v-if="!guestCompleted"
                        ref="inputRef"
                        type="file"
                        accept="application/pdf,.pdf"
                        class="absolute inset-0 z-0 cursor-pointer opacity-0"
                        :class="{ 'pointer-events-none': !!selectedFile }"
                        @change="handleFileInput"
                    />

                    <!-- ── Idle: no file selected ─────────── -->
                    <div v-if="!guestCompleted && !selectedFile" class="relative z-10 flex flex-col items-center px-6 text-center">

                        <!-- Upload icon -->
                        <div
                            :class="[
                                'mb-6 flex h-24 w-24 items-center justify-center rounded-3xl shadow-xl transition-all duration-300',
                                isDragging ? 'scale-110 bg-blue-500' : 'bg-white',
                            ]"
                        >
                            <svg
                                :class="['h-11 w-11 transition-colors', isDragging ? 'text-white' : 'text-blue-500']"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>

                        <h2 class="text-xl font-semibold text-gray-800">
                            <span v-if="isDragging">Drop to open</span>
                            <span v-else>Drop your PDF here</span>
                        </h2>
                        <p class="mt-2 text-sm text-gray-500">or click anywhere in this area to browse</p>

                        <button
                            type="button"
                            class="relative z-10 mt-7 rounded-xl border border-gray-300 bg-white px-7 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                            @click.stop="inputRef?.click()"
                        >
                            Select PDF file
                        </button>

                        <p class="mt-5 text-xs text-gray-400">PDF only &nbsp;&middot;&nbsp; Max 25 MB &nbsp;&middot;&nbsp; Your file is never shared</p>
                    </div>

                    <!-- ── File selected ──────────────────── -->
                    <div v-else-if="!guestCompleted" class="relative z-10 flex w-full max-w-sm flex-col items-center px-4">

                        <!-- Paper card preview -->
                        <div class="w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                            <!-- Card header -->
                            <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                                    <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-sm font-semibold text-gray-900">{{ selectedFile.name }}</p>
                                    <p class="mt-0.5 text-xs text-gray-400">{{ formatSize(selectedFile.size) }} &middot; PDF</p>
                                </div>
                                <button
                                    type="button"
                                    class="ml-1 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                    title="Remove file"
                                    @click.stop="removeFile"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Mini document preview -->
                            <div class="bg-gray-50 px-5 py-4">
                                <div class="space-y-1.5">
                                    <div v-for="n in 6" :key="n"
                                         class="h-1.5 rounded-full bg-gray-200"
                                         :style="{ width: [100,85,100,72,100,60][n-1] + '%' }" />
                                </div>
                            </div>

                            <!-- Upload progress -->
                            <div v-if="form.processing" class="px-5 pb-4 pt-3">
                                <div class="flex items-center justify-between mb-1.5">
                                    <span class="text-xs font-medium text-gray-600">Uploading…</span>
                                    <span class="text-xs text-gray-400">{{ form.progress?.percentage ?? 0 }}%</span>
                                </div>
                                <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        class="h-full rounded-full bg-blue-600 transition-all duration-300"
                                        :style="{ width: (form.progress?.percentage ?? 0) + '%' }"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Error -->
                        <div v-if="error" class="mt-3 flex w-full items-center gap-2 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
                            <svg class="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-xs font-medium text-red-700">{{ error }}</p>
                        </div>

                        <!-- CTA: also in center when file ready -->
                        <button
                            type="button"
                            class="mt-5 w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-150"
                            :class="form.processing
                                ? 'cursor-not-allowed bg-blue-400'
                                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-px hover:shadow-lg'"
                            :disabled="form.processing"
                            @click.stop="submit"
                        >
                            <span v-if="form.processing">Uploading…</span>
                            <span v-else class="flex items-center justify-center gap-2">
                                Open in Editor
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>

                        <button
                            type="button"
                            class="mt-2 text-xs text-gray-400 transition-colors hover:text-gray-600"
                            @click.stop="removeFile"
                        >
                            Choose a different file
                        </button>

                    </div>

                    <!-- Drag overlay border -->
                    <div
                        v-if="isDragging && !guestCompleted"
                        class="pointer-events-none absolute inset-3 z-10 rounded-2xl border-2 border-dashed border-blue-400"
                    />

                </div>

                <!-- ─── Right info panel (hidden on mobile, visible md+) ─── -->
                <div class="hidden w-[300px] shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white md:flex">

                    <!-- Panel header -->
                    <div class="shrink-0 border-b border-gray-100 px-5 py-5">
                        <h2 class="text-[13px] font-semibold text-gray-900">Start Signing</h2>
                        <p class="mt-0.5 text-xs text-gray-400">Upload a PDF to open the signing workspace</p>
                    </div>

                    <!-- Steps -->
                    <div class="flex-1 px-5 py-5">
                        <div class="space-y-5">

                            <div class="flex items-start gap-3">
                                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</div>
                                <div class="pt-0.5">
                                    <p class="text-sm font-semibold text-gray-900">Open PDF</p>
                                    <p class="mt-0.5 text-xs leading-relaxed text-gray-500">Drop or browse for any PDF up to 25 MB.</p>
                                </div>
                            </div>

                            <div class="ml-3.5 h-6 w-px bg-gray-200"></div>

                            <div class="flex items-start gap-3">
                                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">2</div>
                                <div class="pt-0.5">
                                    <p class="text-sm font-semibold text-gray-400">Create Signature</p>
                                    <p class="mt-0.5 text-xs leading-relaxed text-gray-400">Draw, type, or upload your signature.</p>
                                </div>
                            </div>

                            <div class="ml-3.5 h-6 w-px bg-gray-200"></div>

                            <div class="flex items-start gap-3">
                                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">3</div>
                                <div class="pt-0.5">
                                    <p class="text-sm font-semibold text-gray-400">Download</p>
                                    <p class="mt-0.5 text-xs leading-relaxed text-gray-400">Your signed PDF is ready in seconds.</p>
                                </div>
                            </div>

                        </div>

                        <!-- Submit button in right panel (secondary location) -->
                        <button
                            v-if="selectedFile"
                            type="button"
                            class="mt-8 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:bg-blue-700 hover:shadow-md"
                            :disabled="form.processing"
                            @click="submit"
                        >
                            <span v-if="form.processing">Uploading…</span>
                            <span v-else>Open in Editor →</span>
                        </button>
                    </div>

                    <!-- Trust footer -->
                    <div class="shrink-0 border-t border-gray-100 px-5 py-4">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-xs text-gray-400">
                                <svg class="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                No account required
                            </div>
                            <div class="flex items-center gap-2 text-xs text-gray-400">
                                <svg class="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                Files are never shared or sold
                            </div>
                            <div class="flex items-center gap-2 text-xs text-gray-400">
                                <svg class="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                Encrypted in transit and at rest
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <!-- ─── Bottom action bar ─────────────────────────── -->
            <div class="shrink-0 border-t border-gray-200 bg-white px-3 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:px-6">
                <div class="flex items-center justify-between gap-4">

                    <!-- Step indicators (disabled) -->
                    <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2">
                            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">1</div>
                            <span class="hidden text-xs font-medium text-gray-800 sm:block">Open PDF</span>
                        </div>
                        <div class="mx-2 h-px w-8 bg-gray-300" />
                        <div class="flex items-center gap-2">
                            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[11px] font-bold text-gray-400">2</div>
                            <span class="hidden text-xs font-medium text-gray-400 sm:block">Create Signature</span>
                        </div>
                        <div class="mx-2 h-px w-8 bg-gray-300" />
                        <div class="flex items-center gap-2">
                            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[11px] font-bold text-gray-400">3</div>
                            <span class="hidden text-xs font-medium text-gray-400 sm:block">Done</span>
                        </div>
                    </div>

                    <p class="hidden text-xs text-gray-400 lg:block">Select a PDF to continue</p>

                    <!-- Disabled finish button -->
                    <button
                        disabled
                        class="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-xl bg-gray-100 px-7 py-2.5 text-sm font-semibold text-gray-400"
                    >
                        Finish Signing
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                </div>
            </div>

        </div>
    </SignLayout>
</template>
