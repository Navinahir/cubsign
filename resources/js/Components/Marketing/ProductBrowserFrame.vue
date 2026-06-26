<script setup>
defineProps({
    url: { type: String, default: 'app.cubsign.com' },
    size: { type: String, default: 'default' }, // default | large | compact
});
</script>

<template>
    <div
        :class="[
            'overflow-hidden bg-white ring-1 transition-all duration-300',
            size === 'large'
                ? 'rounded-3xl shadow-2xl ring-gray-200/80 hover:shadow-blue-100/50'
                : size === 'compact'
                    ? 'rounded-xl shadow-md ring-gray-200/70 hover:shadow-lg hover:shadow-blue-100/40'
                    : 'rounded-2xl shadow-2xl ring-gray-200/80 hover:shadow-blue-100/50',
        ]"
    >
        <div
            :class="[
                'flex items-center gap-1 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white',
                size === 'compact' ? 'px-2.5 py-1.5' : 'px-4 py-2.5',
            ]"
        >
            <span :class="size === 'compact' ? 'h-2 w-2' : 'h-2.5 w-2.5'" class="rounded-full bg-red-400" />
            <span :class="size === 'compact' ? 'h-2 w-2' : 'h-2.5 w-2.5'" class="rounded-full bg-yellow-400" />
            <span :class="size === 'compact' ? 'h-2 w-2' : 'h-2.5 w-2.5'" class="rounded-full bg-green-400" />
            <div
                :class="[
                    'ml-1.5 flex flex-1 items-center gap-1 rounded-md bg-white ring-1 ring-gray-100',
                    size === 'compact' ? 'px-2 py-0.5' : 'px-3 py-1',
                ]"
            >
                <svg :class="[size === 'compact' ? 'h-2.5 w-2.5' : 'h-3 w-3', 'text-emerald-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span :class="['truncate text-gray-500', size === 'compact' ? 'text-[9px]' : 'text-[11px]']">{{ url }}</span>
            </div>
        </div>
        <div :class="size === 'default' ? 'p-4' : 'p-0'">
            <slot />
        </div>
    </div>
</template>
