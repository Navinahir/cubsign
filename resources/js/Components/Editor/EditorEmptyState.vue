<script setup>
defineProps({
    step: { type: Number, required: true },
});

defineEmits(['add-recipient']);
</script>

<template>
    <div class="border-t border-gray-100 px-3 py-3 text-center">
        <div class="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
            {{ step }}
        </div>

        <template v-if="step === 1">
            <p class="text-xs font-semibold text-gray-800">Add your first recipient</p>
            <p class="mt-0.5 text-[11px] text-gray-500">Add who needs to sign, then place fields for them.</p>
            <button
                type="button"
                class="mt-2.5 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                @click="$emit('add-recipient')"
            >
                Add Recipient
            </button>
        </template>

        <template v-else-if="step === 2">
            <p class="text-xs font-semibold text-gray-800">Choose a field</p>
            <p class="mt-0.5 text-[11px] text-gray-500">Pick a type below, then click the document.</p>
        </template>

        <template v-else>
            <p class="text-xs font-semibold text-gray-800">Click on the document</p>
            <p class="mt-0.5 text-[11px] text-blue-600">Click anywhere on the PDF to place your field.</p>
        </template>
    </div>
</template>
