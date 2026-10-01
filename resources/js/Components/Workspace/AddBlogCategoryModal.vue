<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

const props = defineProps({
    show: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'created']);

const name = ref('');
const error = ref('');
const processing = ref(false);

function getXsrfToken() {
    const raw = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1] ?? '';

    return raw ? decodeURIComponent(raw) : '';
}

function reset() {
    name.value = '';
    error.value = '';
    processing.value = false;
}

function close() {
    reset();
    emit('close');
}

async function submit() {
    error.value = '';
    if (!name.value.trim()) {
        error.value = 'Category name is required.';
        return;
    }

    processing.value = true;
    try {
        const { data } = await axios.post(route('blog-categories.quick'), {
            name: name.value.trim(),
        }, {
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': getXsrfToken(),
            },
        });

        emit('created', data.category);
        reset();
        emit('close');
    } catch (e) {
        error.value = e?.response?.data?.errors?.name?.[0]
            || e?.response?.data?.message
            || e?.message
            || 'Could not create category.';
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <Modal :show="show" max-width="md" @close="close">
        <div class="p-6">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">Add Category</h2>
                    <p class="mt-1 text-sm text-gray-500">Create a category and select it for this blog.</p>
                </div>
                <button type="button" class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" @click="close">
                    <span class="sr-only">Close</span>
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="mt-5">
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Category Name</label>
                <input
                    v-model="name"
                    type="text"
                    placeholder="e.g. Security"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    @keyup.enter="submit"
                />
                <p v-if="error" class="mt-1.5 text-sm text-red-600">{{ error }}</p>
            </div>

            <div class="mt-6 flex justify-end gap-2">
                <SecondaryButton type="button" @click="close">Cancel</SecondaryButton>
                <PrimaryButton type="button" :disabled="processing" @click="submit">
                    {{ processing ? 'Adding…' : 'Add Category' }}
                </PrimaryButton>
            </div>
        </div>
    </Modal>
</template>
