<script setup>
import { onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { SUPPORT_EMAIL } from '@/constants/marketing';

const props = defineProps({
    postSlug: { type: String, required: true },
});

const vote = ref(null);

function storageKey() {
    return `cubsign-blog-feedback:${props.postSlug}`;
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
            <p class="mt-1 text-sm text-gray-500">Your feedback helps us improve the CubSign Blog.</p>
            <div class="mt-4 flex flex-wrap gap-3">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    @click="record('yes')"
                >
                    Yes
                </button>
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    @click="record('no')"
                >
                    No
                </button>
            </div>
        </template>

        <template v-else-if="vote === 'yes'">
            <p class="text-sm font-semibold text-gray-900">Thanks for your feedback</p>
            <p class="mt-1 text-sm text-gray-500">Glad this article helped. Explore related posts or start signing your next PDF.</p>
        </template>

        <template v-else>
            <p class="text-sm font-semibold text-gray-900">Thanks. We can help</p>
            <p class="mt-1 text-sm text-gray-500">
                Email
                <a :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium text-blue-600 hover:underline">{{ SUPPORT_EMAIL }}</a>
                or visit the contact page.
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
