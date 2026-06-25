<script setup>
const props = defineProps({
    fieldTypes:      { type: Array, required: true },
    activeFieldType: { type: String, required: true },
    disabled:        { type: Boolean, default: false },
    disabledTitle:   { type: String, default: 'Add a recipient first.' },
});

const emit = defineEmits(['select', 'blocked']);

function onSelect(id) {
    if (props.disabled) {
        emit('blocked');
        return;
    }
    emit('select', id);
}
</script>

<template>
    <div class="px-3 py-2.5">
        <p class="text-xs font-semibold text-gray-900">Choose Field</p>
        <div class="mt-2 grid grid-cols-3 gap-1.5">
            <button
                v-for="ft in fieldTypes"
                :key="ft.id"
                type="button"
                :aria-pressed="!disabled && activeFieldType === ft.id"
                :aria-disabled="disabled"
                :title="disabled ? disabledTitle : ft.description"
                :class="[
                    'group flex flex-col items-center rounded-lg px-1 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    disabled
                        ? 'cursor-not-allowed opacity-40'
                        : activeFieldType === ft.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                ]"
                @click="onSelect(ft.id)"
            >
                <div
                    :class="[
                        'mb-1 flex h-7 w-7 items-center justify-center rounded-md transition-transform duration-200',
                        disabled
                            ? 'bg-gray-100 text-gray-400'
                            : activeFieldType === ft.id
                                ? 'bg-blue-500 text-white group-hover:scale-110'
                                : 'bg-white text-gray-500 group-hover:scale-110 group-hover:text-blue-600',
                    ]"
                >
                    <svg v-if="ft.icon === 'signature'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <svg v-else-if="ft.icon === 'initials'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                    <svg v-else-if="ft.icon === 'name'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <svg v-else-if="ft.icon === 'text'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h10M4 18h7" />
                    </svg>
                    <svg v-else-if="ft.icon === 'date'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <svg v-else-if="ft.icon === 'checkbox'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span class="text-[10px] font-semibold leading-tight">{{ ft.label }}</span>
            </button>
        </div>
    </div>
</template>
