<script setup>
defineProps({
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <div
        :class="[
            'rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50',
            compact ? 'p-5' : 'p-8',
        ]"
    >
        <p class="text-xs font-semibold uppercase tracking-widest text-blue-600">Newsletter</p>
        <h3 :class="['font-bold text-gray-900', compact ? 'mt-2 text-base' : 'mt-2 text-xl']">
            Stay in the loop
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-gray-600">
            Signing tips, product updates, and guides from the CubSign team—delivered when our newsletter launches.
        </p>
        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
                type="email"
                disabled
                placeholder="you@company.com"
                aria-label="Email address"
                class="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-400"
            />
            <button
                type="button"
                disabled
                class="shrink-0 cursor-not-allowed rounded-xl bg-blue-600/60 px-5 py-3 text-sm font-semibold text-white"
            >
                Coming Soon
            </button>
        </div>
        <p class="mt-3 text-xs text-gray-500">No spam. Unsubscribe anytime when we launch.</p>
    </div>
</template>
