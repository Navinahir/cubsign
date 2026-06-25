<script setup>
defineProps({
    filename:  { type: String, required: true },
    numPages:  { type: Number, default: 0 },
    fileSize:  { type: Number, default: 0 },
});
</script>

<template>
    <div class="px-3 py-2.5">
        <p class="text-xs font-semibold text-gray-900">Document</p>
        <p class="mt-1 truncate text-xs text-gray-600">{{ filename }}</p>
        <p class="text-[10px] text-gray-400">
            {{ numPages ? numPages + ' page' + (numPages !== 1 ? 's' : '') : '…' }}
            · {{ Math.round(fileSize / 1024) }} KB
        </p>
    </div>
</template>
