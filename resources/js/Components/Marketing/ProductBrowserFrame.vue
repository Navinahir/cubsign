<script setup>
defineProps({
    url: { type: String, default: 'app.cubsign.com' },
    size: { type: String, default: 'default' }, // default | large
});
</script>

<template>
    <div
        :class="[
            'overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/80 transition-all duration-300 hover:shadow-blue-100/50',
            size === 'large' ? 'rounded-3xl' : '',
        ]"
    >
        <div class="flex items-center gap-1.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-4 py-2.5">
            <span class="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span class="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span class="h-2.5 w-2.5 rounded-full bg-green-400" />
            <div class="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-white px-3 py-1 ring-1 ring-gray-100">
                <svg class="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span class="truncate text-[11px] text-gray-500">{{ url }}</span>
            </div>
        </div>
        <div :class="size === 'large' ? 'p-0' : 'p-4'">
            <slot />
        </div>
    </div>
</template>
