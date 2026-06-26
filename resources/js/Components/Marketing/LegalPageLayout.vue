<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    updated: { type: String, default: '' },
    badge: { type: String, default: '' },
    sections: { type: Array, default: () => [] },
});

const activeId = ref('');

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeId.value = id;
}

let observer;
onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => { for (const e of entries) if (e.isIntersecting) activeId.value = e.target.id; },
        { rootMargin: '-100px 0px -60% 0px' },
    );
    props.sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
    });
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
    <section class="marketing-gradient-hero relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
        <div class="relative mx-auto max-w-4xl text-center">
            <span v-if="badge" class="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700">{{ badge }}</span>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">{{ title }}</h1>
            <p v-if="description" class="mx-auto mt-4 max-w-2xl text-base text-gray-600">{{ description }}</p>
            <p v-if="updated" class="mt-4 text-sm text-gray-400">Last updated: {{ updated }}</p>
        </div>
    </section>

    <section class="px-4 pb-16 sm:px-6 lg:px-8">
        <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-4">
            <aside v-if="sections.length" class="hidden lg:col-span-1 lg:block">
                <div class="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 class="text-sm font-semibold text-gray-900">On this page</h2>
                    <ul class="mt-4 space-y-2">
                        <li v-for="s in sections" :key="s.id">
                            <a
                                :href="`#${s.id}`"
                                :class="['flex items-center gap-2 text-sm transition-colors', activeId === s.id ? 'font-medium text-blue-600' : 'text-gray-500 hover:text-gray-900']"
                                @click.prevent="scrollTo(s.id)"
                            >
                                <svg v-if="s.icon" class="h-4 w-4 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="s.icon"/></svg>
                                {{ s.title }}
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <article :class="sections.length ? 'lg:col-span-3' : 'lg:col-span-4'">
                <slot />
            </article>
        </div>
    </section>
</template>
