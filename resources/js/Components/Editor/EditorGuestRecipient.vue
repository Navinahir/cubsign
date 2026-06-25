<script setup>
defineProps({
    userName: { type: String, default: '' },
});
</script>

<template>
    <div class="border-t border-gray-100 px-3 py-2.5">
        <p class="text-xs font-semibold text-gray-900">Recipient</p>
        <p class="mt-0.5 text-[11px] text-gray-500">This field will belong to you.</p>
        <div class="mt-2 flex items-center gap-2.5 rounded-lg border-2 border-blue-500 bg-blue-50 px-3 py-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {{ (userName || 'You').slice(0, 2).toUpperCase() }}
            </div>
            <div>
                <p class="text-sm font-semibold text-gray-900">{{ userName || 'You' }}</p>
                <p class="text-[10px] text-gray-500">Self-signing</p>
            </div>
        </div>
    </div>
</template>
