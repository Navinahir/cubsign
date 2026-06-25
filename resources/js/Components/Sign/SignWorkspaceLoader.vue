<script setup>
defineProps({
    message: { type: String, default: 'Loading document…' },
});
</script>

<template>
    <div class="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 px-6">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p class="text-sm font-medium text-gray-600">{{ message }}</p>
    </div>
</template>
