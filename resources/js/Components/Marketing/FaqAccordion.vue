<script setup>
import { computed, ref, watch } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    faqs: { type: Array, required: true },
    searchable: { type: Boolean, default: false },
    showAllLink: { type: Boolean, default: false },
});

const openFaq = ref(null);
const searchQuery = ref('');

const filteredFaqs = computed(() => {
    if (!props.searchable || !searchQuery.value.trim()) {
        return props.faqs;
    }
    const q = searchQuery.value.toLowerCase();
    return props.faqs.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
    );
});

watch(searchQuery, () => {
    openFaq.value = null;
});

function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}
</script>

<template>
    <div>
        <div v-if="searchable" class="mb-6">
            <label for="faq-search" class="sr-only">Search FAQ</label>
            <div class="relative">
                <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    id="faq-search"
                    v-model="searchQuery"
                    type="search"
                    placeholder="Search questions..."
                    class="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>
            <p v-if="searchQuery && filteredFaqs.length === 0" class="mt-3 text-center text-sm text-gray-500">
                No matching questions found.
            </p>
        </div>

        <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            <div v-for="(faq, index) in filteredFaqs" :key="faq.question">
                <button
                    type="button"
                    class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    :aria-expanded="openFaq === index"
                    @click="toggleFaq(index)"
                >
                    <span class="pr-4 text-sm font-semibold text-gray-900">{{ faq.question }}</span>
                    <svg
                        :class="['h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300', openFaq === index ? 'rotate-180' : '']"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-96"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 max-h-96"
                    leave-to-class="opacity-0 max-h-0"
                >
                    <div v-show="openFaq === index" class="overflow-hidden px-6 pb-6 text-sm leading-relaxed text-gray-500">
                        {{ faq.answer }}
                        <Link
                            v-if="faq.moreHelpSlug"
                            :href="route('help-center.show', faq.moreHelpSlug)"
                            class="mt-2 block font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            {{ faq.moreHelpLabel }}
                        </Link>
                    </div>
                </Transition>
            </div>
        </div>

        <div v-if="showAllLink" class="mt-8 text-center">
            <Link :href="route('faq')" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                View all FAQs &rarr;
            </Link>
        </div>
    </div>
</template>
