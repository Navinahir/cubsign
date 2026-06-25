<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';

defineProps({
    doc:        { type: Object, required: true },
    isEditing:  { type: Boolean, default: false },
    isSaving:   { type: Boolean, default: false },
    baseName:   { type: String, default: '' },
    extension:  { type: String, default: '' },
    error:      { type: String, default: '' },
    warning:    { type: String, default: '' },
});

defineEmits(['update:baseName', 'keydown']);

const inputRef = ref(null);

function focusInput() {
    const input = inputRef.value;
    if (!input) return;
    input.focus();
    const len = input.value.length;
    input.setSelectionRange(0, len);
}

defineExpose({ focusInput });
</script>

<template>
    <div class="flex min-w-0 items-center gap-3">
        <svg class="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>

        <div v-if="isEditing" class="min-w-0 flex-1">
            <div class="flex max-w-xs items-center gap-1">
                <input
                    ref="inputRef"
                    :value="baseName"
                    type="text"
                    :disabled="isSaving"
                    class="min-w-0 flex-1 rounded border border-blue-400 px-2 py-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                    @input="$emit('update:baseName', $event.target.value)"
                    @keydown="$emit('keydown', $event)"
                />
                <span v-if="extension" class="shrink-0 text-sm font-medium text-gray-500">{{ extension }}</span>
                <svg
                    v-if="isSaving"
                    class="h-4 w-4 shrink-0 animate-spin text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
            <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
            <p v-else-if="warning" class="mt-1 text-xs text-amber-600">{{ warning }}</p>
        </div>

        <Link
            v-else
            :href="route('documents.show', doc.id)"
            class="max-w-xs truncate text-sm font-medium text-gray-900 transition hover:text-blue-600"
            :title="doc.name"
        >
            {{ doc.name }}
        </Link>
    </div>
</template>
