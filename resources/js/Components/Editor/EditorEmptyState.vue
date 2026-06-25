<script setup>
defineProps({
    step: { type: Number, required: true },
});
</script>

<template>
    <div class="border-t border-gray-100 px-3 py-3 text-center">
        <template v-if="step === 1">
            <p class="text-xs font-semibold text-gray-800">Choose a field</p>
            <p class="mt-0.5 text-[11px] text-gray-500">Pick a type below, then click the document.</p>
        </template>

        <template v-else>
            <p class="text-xs font-semibold text-gray-800">Click on the document</p>
            <p class="mt-0.5 text-[11px] text-blue-600">Click anywhere on the PDF to place your field.</p>
        </template>
    </div>
</template>
