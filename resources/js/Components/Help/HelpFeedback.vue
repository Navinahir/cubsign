<script setup>
import { onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { SUPPORT_EMAIL } from '@/constants/marketing';

const props = defineProps({
    articleSlug: { type: String, required: true },
});

const vote = ref(null);

function storageKey() {
    return `cubsign-help-feedback:${props.articleSlug}`;
}

function record(value) {
    if (vote.value) return;
    vote.value = value;
    try {
        localStorage.setItem(storageKey(), value);
    } catch {
        // Ignore storage failures
    }
}

onMounted(() => {
    try {
        const saved = localStorage.getItem(storageKey());
        if (saved === 'yes' || saved === 'no') vote.value = saved;
    } catch {
        // Ignore
    }
});
</script>

<template>
    <div class="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <template v-if="!vote">
            <p class="text-sm font-semibold text-gray-900">Was this helpful?</p>
            <p class="mt-1 text-sm text-gray-500">Your feedback helps us improve these guides.</p>
            <div class="mt-4 flex flex-wrap gap-3">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    @click="record('yes')"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Yes
                </button>
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    @click="record('no')"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                    No
                </button>
            </div>
        </template>

        <template v-else-if="vote === 'yes'">
            <p class="text-sm font-semibold text-gray-900">Thanks for your feedback</p>
            <p class="mt-1 text-sm text-gray-500">Glad this article helped. You can keep browsing related guides or start signing.</p>
        </template>

        <template v-else>
            <p class="text-sm font-semibold text-gray-900">Thanks — we can help</p>
            <p class="mt-1 text-sm text-gray-500">
                Email
                <a :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium text-blue-600 hover:underline">{{ SUPPORT_EMAIL }}</a>
                or send a message from the contact page.
            </p>
            <Link
                :href="route('contact')"
                class="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
                Contact Support →
            </Link>
        </template>
    </div>
</template>
