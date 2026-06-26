<script setup>
import { Link } from '@inertiajs/vue3';
import { btnPrimary } from '@/constants/marketing';

defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    primaryLabel: { type: String, default: 'Get Started Free' },
    primaryHref: { type: String, default: '' },
    secondaryLabel: { type: String, default: '' },
    secondaryHref: { type: String, default: '' },
    variant: { type: String, default: 'gradient' }, // gradient | light | dark
});

const variantClasses = {
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-700 text-white',
    light: 'bg-gray-50 border border-gray-200 text-gray-900',
    dark: 'bg-gray-900 text-white',
};
</script>

<template>
    <div :class="['relative overflow-hidden rounded-3xl px-8 py-12 shadow-xl sm:px-12 sm:py-14', variantClasses[variant]]">
        <div v-if="variant === 'gradient'" class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl marketing-gradient-shift" />
        <div class="relative text-center">
            <span v-if="eyebrow" :class="['mb-4 inline-flex rounded-full px-4 py-1 text-xs font-semibold', variant === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-white/15 text-white backdrop-blur-sm']">{{ eyebrow }}</span>
            <h2 :class="['text-2xl font-bold tracking-tight sm:text-3xl', variant === 'light' ? 'text-gray-900' : 'text-white']">{{ title }}</h2>
            <p v-if="description" :class="['mx-auto mt-3 max-w-xl text-sm sm:text-base', variant === 'light' ? 'text-gray-600' : variant === 'gradient' ? 'text-blue-100' : 'text-gray-300']">{{ description }}</p>
            <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                    :href="primaryHref || route('register')"
                    :class="[
                        'marketing-btn-ripple w-full rounded-xl px-8 py-3.5 text-sm font-semibold shadow-sm transition-all sm:w-auto',
                        variant === 'light' ? btnPrimary : 'bg-white text-gray-900 hover:bg-gray-50',
                    ]"
                >
                    {{ primaryLabel }}
                </Link>
                <Link
                    v-if="secondaryLabel"
                    :href="secondaryHref || route('sign.index')"
                    :class="[
                        'w-full rounded-xl px-8 py-3.5 text-sm font-semibold transition-all sm:w-auto',
                        variant === 'light' ? 'border border-gray-300 text-gray-700 hover:bg-gray-100' : 'border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
                    ]"
                >
                    {{ secondaryLabel }}
                </Link>
            </div>
        </div>
    </div>
</template>
