<script setup>
import { recipientInitials, recipientDisplayName, statusBadgeClass } from './editorHelpers';

defineProps({
    recipient:  { type: Object, required: true },
    isActive:   { type: Boolean, default: false },
    isDragOver: { type: Boolean, default: false },
    fieldCount: { type: Number, default: 0 },
    canRemove:  { type: Boolean, default: true },
});

defineEmits(['select', 'remove', 'update:name', 'update:email', 'dragstart', 'dragover', 'dragleave', 'drop', 'dragend']);
</script>

<template>
    <div
        draggable="true"
        role="button"
        tabindex="0"
        :aria-selected="isActive"
        class="group cursor-pointer rounded-lg border-2 px-3 py-2.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :class="isActive
            ? 'border-blue-500 bg-blue-50'
            : isDragOver
                ? 'border-dashed border-blue-300 bg-blue-50/40'
                : 'border-gray-200 bg-white hover:border-gray-300'"
        @click="$emit('select')"
        @keydown.enter="$emit('select')"
        @dragstart="$emit('dragstart', $event)"
        @dragover="$emit('dragover', $event)"
        @dragleave="$emit('dragleave', $event)"
        @drop="$emit('drop', $event)"
        @dragend="$emit('dragend')"
    >
        <div class="flex items-start gap-2.5">
            <div class="relative shrink-0">
                <div
                    class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                    :style="`background:${recipient.color}`"
                >
                    {{ recipientInitials(recipient) }}
                </div>
                <div
                    v-if="isActive"
                    class="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-white"
                >
                    <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1">
                    <input
                        :value="recipient.name"
                        placeholder="Full name"
                        class="min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none"
                        @input="$emit('update:name', $event.target.value)"
                        @click.stop
                    />
                    <button
                        v-if="canRemove"
                        type="button"
                        class="shrink-0 text-gray-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                        @click.stop="$emit('remove')"
                    >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <input
                    :value="recipient.email"
                    type="email"
                    placeholder="email@example.com"
                    class="w-full bg-transparent text-xs text-gray-500 placeholder:text-gray-300 focus:outline-none"
                    @input="$emit('update:email', $event.target.value)"
                    @click.stop
                />
                <div class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-gray-400">
                    <span>Recipient #{{ recipient.signingOrder }}</span>
                    <span>·</span>
                    <span :style="`color:${recipient.color}`">{{ fieldCount }} {{ fieldCount === 1 ? 'Field' : 'Fields' }}</span>
                    <span :class="statusBadgeClass(recipient.status)">{{ recipient.status }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
