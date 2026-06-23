<script setup>
import { ref } from 'vue';
import { Link, router, useForm } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';

const form = useForm({
    name: '',
    pdf:  null,
});

const dragOver  = ref(false);
const fileInput = ref(null);

function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    form.pdf = file;
    if (!form.name) form.name = file.name.replace(/\.pdf$/i, '');
}

function onDrop(e) {
    dragOver.value = false;
    const file = e.dataTransfer.files?.[0];
    if (!file || file.type !== 'application/pdf') return;
    form.pdf = file;
    if (!form.name) form.name = file.name.replace(/\.pdf$/i, '');
}

function submit() {
    if (!form.pdf || !form.name.trim()) return;
    form.post(route('templates.store'), {
        forceFormData: true,
    });
}

function formatSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>New Template</template>

        <!-- Back -->
        <div class="mb-6">
            <Link
                :href="route('templates.index')"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Templates
            </Link>
        </div>

        <div class="mx-auto max-w-lg">
            <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div class="border-b border-gray-100 px-6 py-4">
                    <h2 class="text-sm font-semibold text-gray-800">Create new template</h2>
                    <p class="mt-0.5 text-xs text-gray-500">Upload a PDF and add field placeholders that can be reused.</p>
                </div>

                <form class="space-y-5 p-6" @submit.prevent="submit">

                    <!-- Template name -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Template name <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="e.g. NDA Agreement"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            :class="form.errors.name ? 'border-red-400 focus:ring-red-400' : ''"
                        />
                        <p v-if="form.errors.name" class="mt-1 text-xs text-red-500">{{ form.errors.name }}</p>
                    </div>

                    <!-- PDF upload -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            PDF file <span class="text-red-500">*</span>
                        </label>

                        <!-- Dropzone -->
                        <div
                            v-if="!form.pdf"
                            class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 text-center transition"
                            :class="dragOver ? 'border-blue-400 bg-blue-50/40' : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/20'"
                            @click="fileInput?.click()"
                            @dragover.prevent="dragOver = true"
                            @dragleave.prevent="dragOver = false"
                            @drop.prevent="onDrop"
                        >
                            <svg class="mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="text-sm font-medium text-gray-600">Drop your PDF here, or <span class="text-blue-600">browse</span></p>
                            <p class="mt-1 text-xs text-gray-400">PDF only · Max 20 MB</p>
                        </div>

                        <!-- File selected -->
                        <div
                            v-else
                            class="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
                        >
                            <svg class="h-8 w-8 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-gray-900">{{ form.pdf.name }}</p>
                                <p class="text-xs text-gray-400">{{ formatSize(form.pdf.size) }}</p>
                            </div>
                            <button
                                type="button"
                                class="shrink-0 text-gray-400 hover:text-gray-600"
                                @click="form.pdf = null"
                            >
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <input
                            ref="fileInput"
                            type="file"
                            accept=".pdf,application/pdf"
                            class="hidden"
                            @change="onFileChange"
                        />
                        <p v-if="form.errors.pdf" class="mt-1 text-xs text-red-500">{{ form.errors.pdf }}</p>
                    </div>

                    <!-- Submit -->
                    <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <Link
                            :href="route('templates.index')"
                            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >Cancel</Link>
                        <button
                            type="submit"
                            :disabled="!form.pdf || !form.name.trim() || form.processing"
                            class="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition"
                            :class="form.pdf && form.name.trim() && !form.processing
                                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm'
                                : 'cursor-not-allowed bg-gray-100 text-gray-400'"
                        >
                            <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            {{ form.processing ? 'Uploading…' : 'Continue to Editor' }}
                            <svg v-if="!form.processing" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>

                </form>
            </div>
        </div>

    </WorkspaceLayout>
</template>
