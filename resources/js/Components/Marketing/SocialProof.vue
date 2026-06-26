<script setup>
import { socialStats, customerLogos, testimonials } from '@/constants/marketing';
</script>

<template>
    <div>
        <!-- Stats -->
        <div class="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div
                v-for="stat in socialStats"
                :key="stat.label"
                class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
                <p class="text-4xl font-bold tracking-tight text-blue-600">{{ stat.value }}</p>
                <p class="mt-2 text-sm font-medium text-gray-500">{{ stat.label }}</p>
            </div>
        </div>

        <!-- Customer logos -->
        <div class="mb-16">
            <p class="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Trusted by teams worldwide</p>
            <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div
                    v-for="logo in customerLogos"
                    :key="logo.name"
                    class="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm transition-shadow hover:shadow-md"
                    :aria-label="logo.name"
                >
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                        {{ logo.initials }}
                    </div>
                    <span class="text-sm font-medium text-gray-600">{{ logo.name }}</span>
                </div>
            </div>
        </div>

        <!-- Testimonials -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div
                v-for="testimonial in testimonials"
                :key="testimonial.name"
                class="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
                <svg class="mb-5 h-6 w-6 text-blue-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p class="text-[15px] leading-relaxed text-gray-700">"{{ testimonial.quote }}"</p>
                <div class="mt-6 flex items-center gap-3">
                    <div :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white', testimonial.avatarBg]">
                        {{ testimonial.initials }}
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-900">{{ testimonial.name }}</p>
                        <p class="text-xs text-gray-500">{{ testimonial.role }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
