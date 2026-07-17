<script setup>
import { ref } from 'vue';

defineProps({
    items: { type: Array, default: () => [] },
});

const openIndex = ref(0);
</script>

<template>
    <section v-if="items.length" class="mt-12 border-t border-gray-100 pt-10">
        <h2 class="text-lg font-bold text-gray-900">Frequently asked questions</h2>
        <div class="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
            <div v-for="(item, index) in items" :key="item.question">
                <button
                    type="button"
                    class="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    :aria-expanded="openIndex === index"
                    @click="openIndex = openIndex === index ? -1 : index"
                >
                    <span class="text-sm font-semibold text-gray-900">{{ item.question }}</span>
                    <svg
                        :class="['mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform', openIndex === index ? 'rotate-180' : '']"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div v-show="openIndex === index" class="px-5 pb-4 text-sm leading-relaxed text-gray-600">
                    {{ item.answer }}
                </div>
            </div>
        </div>
    </section>
</template>
