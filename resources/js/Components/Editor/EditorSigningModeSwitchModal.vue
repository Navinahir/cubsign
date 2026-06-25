<script setup>
import Modal from '@/Components/Modal.vue';

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
    lead: {
        type: String,
        default: '',
    },
    subtitle: {
        type: String,
        default: '',
    },
    bullets: {
        type: Array,
        default: () => [],
    },
    footer: {
        type: String,
        default: null,
    },
    confirmLabel: {
        type: String,
        default: 'Continue',
    },
});

defineEmits(['close', 'confirm']);
</script>

<template>
    <Modal :show="show" max-width="md" @close="$emit('close')">
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>

            <p v-if="lead" class="mt-3 text-sm leading-relaxed text-gray-600">{{ lead }}</p>

            <p v-if="subtitle" class="mt-3 text-sm font-medium text-gray-700">{{ subtitle }}</p>

            <ul v-if="bullets.length" class="mt-2 space-y-1 pl-1">
                <li
                    v-for="(line, index) in bullets"
                    :key="index"
                    class="text-sm text-gray-700"
                >
                    • {{ line }}
                </li>
            </ul>

            <p v-if="footer" class="mt-3 text-sm leading-relaxed text-gray-500">{{ footer }}</p>

            <div class="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                    @click="$emit('close')"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    @click="$emit('confirm')"
                >
                    {{ confirmLabel }}
                </button>
            </div>
        </div>
    </Modal>
</template>
