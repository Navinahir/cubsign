<script setup>
import { nextTick } from 'vue';
import EditorRecipientCard from './EditorRecipientCard.vue';

const props = defineProps({
    recipients:             { type: Array, required: true },
    activeRecipientId:      { type: Number, required: true },
    dragOverRecipientId:    { type: Number, default: null },
    fieldCountFor:          { type: Function, required: true },
    hasConfiguredRecipient: { type: Boolean, default: false },
    recipientsVisible:      { type: Boolean, default: false },
});

const emit = defineEmits([
    'add',
    'select',
    'remove',
    'update:name',
    'update:email',
    'dragstart',
    'dragover',
    'dragleave',
    'drop',
    'dragend',
]);

const showCards = () => props.recipients.length > 0;

async function scrollToRecipient(id) {
    await nextTick();
    document.getElementById(`recipient-card-${id}`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

defineExpose({ scrollToRecipient });
</script>

<template>
    <div class="border-t border-gray-100 px-3 py-2.5">
        <p class="text-xs font-semibold text-gray-900">Recipients</p>
        <p class="mt-0.5 text-[11px] text-gray-500">Invite people who need to sign this document.</p>

        <button
            type="button"
            class="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            @click="$emit('add')"
        >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Recipient
        </button>

        <p
            v-if="!showCards()"
            class="mt-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5 text-center text-[11px] leading-relaxed text-gray-500"
        >
            No recipients yet.<br>
            Click <span class="font-semibold text-gray-700">Add Recipient</span> above to invite someone to sign.
        </p>

        <div v-else class="mt-2 space-y-1.5">
            <EditorRecipientCard
                v-for="r in recipients"
                :key="r.id"
                :recipient="r"
                :is-active="activeRecipientId === r.id"
                :is-drag-over="dragOverRecipientId === r.id"
                :field-count="fieldCountFor(r.id)"
                :can-remove="true"
                @select="$emit('select', r.id)"
                @remove="$emit('remove', r.id)"
                @update:name="$emit('update:name', r.id, $event)"
                @update:email="$emit('update:email', r.id, $event)"
                @dragstart="$emit('dragstart', $event, r.id)"
                @dragover="$emit('dragover', $event, r.id)"
                @dragleave="$emit('dragleave', $event)"
                @drop="$emit('drop', $event, r.id)"
                @dragend="$emit('dragend')"
            />
        </div>
    </div>
</template>
