<script setup>
import { templatePlaceholderLabel, TEMPLATE_FIELD_COLOR } from '@/Components/Editor/templateFieldHelpers';

defineProps({
    field:    { type: Object, required: true },
    selected: { type: Boolean, default: false },
});

const FIELD_COLOR = TEMPLATE_FIELD_COLOR;
</script>

<template>
    <div
        class="relative h-full w-full overflow-hidden rounded"
        :style="`background:rgba(254,243,199,0.6); outline:${selected ? '2px' : '1px'} solid ${FIELD_COLOR}${selected ? '' : '80'}; outline-offset:${selected ? '1px' : '0'}`"
    >
        <template v-if="field.type === 'signature' || field.type === 'initials'">
            <div class="flex h-full w-full flex-col items-center justify-center border-2 border-dashed bg-[#FFFDF5] px-1" :style="`border-color:${FIELD_COLOR}`">
                <svg class="mb-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" :style="`color:${FIELD_COLOR}`">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span class="text-[9px] font-bold uppercase tracking-wide text-gray-700">{{ templatePlaceholderLabel(field) }}</span>
            </div>
        </template>

        <template v-else-if="field.type === 'checkbox'">
            <div
                class="flex h-full w-full items-center justify-center rounded border-2 border-dashed bg-[#FFFDF5]"
                :style="`border-color:${FIELD_COLOR}`"
            >
                <span class="text-[8px] font-semibold uppercase text-gray-500">{{ templatePlaceholderLabel(field) }}</span>
            </div>
        </template>

        <template v-else>
            <div class="flex h-full w-full items-center justify-center border-2 border-dashed bg-[#FFFDF5] px-2" :style="`border-color:${FIELD_COLOR}`">
                <span class="truncate text-[9px] font-bold uppercase tracking-wide text-gray-700">{{ templatePlaceholderLabel(field) }}</span>
            </div>
        </template>
    </div>
</template>
