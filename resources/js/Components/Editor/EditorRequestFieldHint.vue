<script setup>
defineProps({
    activeFieldType: { type: String, required: true },
});
</script>

<template>
    <div class="border-t border-gray-100 px-3 py-2 text-[11px] text-gray-500">
        <template v-if="activeFieldType === 'signature' || activeFieldType === 'initials'">
            Click the document to place a <strong class="font-medium text-gray-700">Sign Here</strong> box for the selected recipient.
        </template>
        <template v-else>
            Recipient will fill this {{ activeFieldType }} when they sign.
        </template>
    </div>
</template>
