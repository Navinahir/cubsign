<script setup>
defineProps({
    active: { type: Boolean, default: false },
    message: { type: String, default: 'Click anywhere on the document to place your signature.' },
});

defineEmits(['cancel']);
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="active"
            class="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center px-4"
        >
            <div class="pointer-events-auto flex items-center gap-2 rounded-full bg-gray-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg">
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                {{ message }}
                <button
                    type="button"
                    class="ml-1 rounded-full p-0.5 text-gray-400 hover:text-white"
                    title="Cancel (Esc)"
                    @click="$emit('cancel')"
                >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </Transition>
</template>
