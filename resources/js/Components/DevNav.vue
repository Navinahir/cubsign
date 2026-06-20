<script setup>
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';

const isLocal = computed(() => usePage().props.app?.isLocal ?? false);
const open = ref(false);

const links = [
    { label: 'Upload',    routeName: 'sign.index' },
    { label: 'Editor',    routeName: 'sign.editor' },
    { label: 'Complete',  routeName: 'sign.complete' },
    { label: 'Workspace', routeName: 'overview' },
];
</script>

<template>
    <div v-if="isLocal" class="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">

        <!-- Panel -->
        <Transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="open"
                class="w-36 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
            >
                <div class="px-3 py-2">
                    <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Dev tools</span>
                </div>
                <div class="border-t border-gray-100">
                    <Link
                        v-for="link in links"
                        :key="link.routeName"
                        :href="route(link.routeName)"
                        class="block px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        @click="open = false"
                    >
                        {{ link.label }}
                    </Link>
                </div>
            </div>
        </Transition>

        <!-- Gear button -->
        <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition-colors hover:bg-gray-50"
            :class="open ? 'bg-gray-100' : ''"
            title="Dev tools"
            @click="open = !open"
        >
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>

    </div>
</template>
