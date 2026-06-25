<script setup>
defineProps({
    mode: { type: String, required: true }, // 'self' | 'request'
});

defineEmits(['update:mode']);
</script>

<template>
    <div class="border-b border-gray-100 px-3 py-2.5">
        <p class="mb-2 text-xs font-semibold text-gray-900">Signing Mode</p>
        <div class="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-0.5">
            <button
                type="button"
                :class="[
                    'rounded-md py-2 text-xs font-semibold transition-all duration-200',
                    mode === 'self'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700',
                ]"
                @click="$emit('update:mode', 'self')"
            >
                Just Me
            </button>
            <button
                type="button"
                :class="[
                    'rounded-md py-2 text-xs font-semibold transition-all duration-200',
                    mode === 'request'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700',
                ]"
                @click="$emit('update:mode', 'request')"
            >
                Request Signatures
            </button>
        </div>
        <p class="mt-2 text-[10px] leading-relaxed text-gray-500">
            <template v-if="mode === 'self'">Sign the document yourself now.</template>
            <template v-else>Place fields for recipients to complete later.</template>
        </p>
    </div>
</template>
