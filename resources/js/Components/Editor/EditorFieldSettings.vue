<script setup>
defineProps({
    activeFieldType: { type: String, required: true },
    pendingDate:     { type: String, default: '' },
    pendingText:     { type: String, default: '' },
});

defineEmits(['update:pendingDate', 'update:pendingText']);
</script>

<template>
    <div v-if="activeFieldType === 'date'" class="px-3 py-2.5">
        <p class="text-xs font-semibold text-gray-900">Field Settings</p>
        <input
            :value="pendingDate"
            type="text"
            placeholder="Today's date"
            class="mt-2 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @input="$emit('update:pendingDate', $event.target.value)"
        />
    </div>

    <div v-else-if="activeFieldType === 'name' || activeFieldType === 'text'" class="px-3 py-2.5">
        <p class="text-xs font-semibold text-gray-900">Field Settings</p>
        <input
            :value="pendingText"
            type="text"
            :placeholder="activeFieldType === 'name' ? 'Default name (optional)' : 'Default text (optional)'"
            class="mt-2 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @input="$emit('update:pendingText', $event.target.value)"
        />
    </div>
</template>
