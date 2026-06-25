<script setup>
defineProps({
    activeFieldType:     { type: String, required: true },
    hasRecipients:       { type: Boolean, default: true },
    showOnboardingHint: { type: Boolean, default: false },
});
</script>

<template>
    <div class="border-t border-gray-100 px-3 py-2.5 text-[11px] leading-relaxed">
        <div
            v-if="!hasRecipients"
            class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-amber-800"
        >
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <span>Add a recipient above, then choose a field type to place on the document.</span>
        </div>

        <div
            v-else-if="showOnboardingHint"
            class="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-emerald-800"
        >
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Great! Now choose a field and click the document to place it.</span>
        </div>

        <p v-else class="text-gray-500">
            <template v-if="activeFieldType === 'signature' || activeFieldType === 'initials'">
                Click the document to place a <strong class="font-medium text-gray-700">Sign Here</strong> box for the selected recipient.
            </template>
            <template v-else>
                Recipient will fill this {{ activeFieldType }} when they sign.
            </template>
        </p>
    </div>
</template>
