<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    open:           { type: Boolean, default: false },
    existingEmails: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'save']);

const name  = ref('');
const email = ref('');
const error = ref('');

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        name.value  = '';
        email.value = '';
        error.value = '';
    }
});

function close() {
    emit('close');
}

function save() {
    error.value = '';
    const trimmedName  = name.value.trim();
    const trimmedEmail = email.value.trim().toLowerCase();

    if (!trimmedName) {
        error.value = 'Please enter the recipient\'s full name.';
        return;
    }
    if (!trimmedEmail) {
        error.value = 'Please enter the recipient\'s email address.';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        error.value = 'Please enter a valid email address.';
        return;
    }
    if (props.existingEmails.some(e => e.toLowerCase() === trimmedEmail)) {
        error.value = 'This email address is already used by another recipient.';
        return;
    }

    emit('save', { name: trimmedName, email: trimmedEmail });
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
            @click.self="close"
        >
            <div class="absolute inset-0 bg-black/40" />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-recipient-title"
                class="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
            >
                <h2 id="add-recipient-title" class="text-base font-bold text-gray-900">Add Recipient</h2>
                <p class="mt-1 text-xs text-gray-500">Enter the name and email of the person who will sign.</p>

                <div class="mt-4 space-y-3">
                    <div>
                        <label class="mb-1 block text-xs font-medium text-gray-700">Full name</label>
                        <input
                            v-model="name"
                            type="text"
                            placeholder="John Doe"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            @keydown.enter="save"
                        />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs font-medium text-gray-700">Email</label>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="john@email.com"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            @keydown.enter="save"
                        />
                    </div>
                </div>

                <p v-if="error" class="mt-3 text-xs font-medium text-red-600">{{ error }}</p>

                <div class="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        @click="close"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        @click="save"
                    >
                        Save Recipient
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
