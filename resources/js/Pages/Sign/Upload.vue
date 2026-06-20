<script setup>
import { ref, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';

const form = useForm({ pdf: null });

const isDragging    = ref(false);
const selectedFile  = ref(null);
const localError    = ref(null);
const inputRef      = ref(null);

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
    <SignLayout :step="1">
        <div class="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">

            <!-- Heading -->
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold tracking-tight text-gray-900">Upload your PDF</h1>
                <p class="mt-1.5 text-sm text-gray-500">Sign it in seconds. No account required.</p>
            </div>

            <!-- Upload card -->
            <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">

                <!-- Drop zone -->
                <div
                    class="relative m-2 rounded-xl border-2 border-dashed transition-colors duration-150"
                    :class="[
                        isDragging
                            ? 'border-blue-400 bg-blue-50'
                            : selectedFile
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50',
                    ]"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop"
                >
                    <!-- Hidden file input -->
                    <input
                        ref="inputRef"
                        type="file"
                        accept="application/pdf,.pdf"
                        class="absolute inset-0 cursor-pointer opacity-0"
                        :class="{ 'pointer-events-none': !!selectedFile }"
                        @change="handleFileInput"
                    />

                    <!-- Idle state -->
                    <div v-if="!selectedFile" class="flex flex-col items-center px-8 py-12">
                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                            <svg class="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p class="mt-4 text-sm font-semibold text-gray-700">
                            <span v-if="isDragging">Drop your PDF here</span>
                            <span v-else>Drag &amp; drop your PDF here</span>
                        </p>
                        <p class="mt-1 text-xs text-gray-400">or</p>
                        <button
                            type="button"
                            class="relative z-10 mt-3 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400"
                            @click="inputRef?.click()"
                        >
                            Select PDF file
                        </button>
                        <p class="mt-5 text-xs text-gray-400">PDF only · Max 25 MB</p>
                    </div>

                    <!-- File selected state -->
                    <div v-else class="flex items-center gap-4 px-5 py-5">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
                            <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-semibold text-gray-900">{{ selectedFile.name }}</p>
                            <p class="mt-0.5 text-xs text-gray-400">{{ formatSize(selectedFile.size) }}</p>
                        </div>
                        <button
                            type="button"
                            class="ml-2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            title="Remove file"
                            @click="removeFile"
                        >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Upload progress -->
                <div v-if="form.processing && form.progress" class="mx-2 mb-2 overflow-hidden rounded-xl bg-gray-100">
                    <div
                        class="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                        :style="{ width: form.progress.percentage + '%' }"
                    />
                </div>

                <!-- Error message -->
                <div v-if="error" class="mx-2 mb-2 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3">
                    <svg class="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-xs font-medium text-red-700">{{ error }}</p>
                </div>

                <!-- Submit button -->
                <div class="px-4 pb-4 pt-2">
                    <button
                        type="button"
                        class="w-full rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150"
                        :class="[
                            selectedFile && !form.processing
                                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                : 'bg-gray-300 cursor-not-allowed',
                        ]"
                        :disabled="!selectedFile || form.processing"
                        @click="submit"
                    >
                        <span v-if="form.processing">
                            Uploading...
                        </span>
                        <span v-else>
                            Sign this PDF
                            <svg class="ml-1.5 inline-block h-4 w-4 align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </button>
                </div>

            </div>

            <!-- Trust line -->
            <p class="mt-5 text-center text-xs text-gray-400">
                Your file is stored securely and never shared.
            </p>

        </div>
    </SignLayout>
</template>
