<script setup>
import { featureGrid } from '@/constants/marketing';

function miniVisual(type) {
    const visuals = {
        draw: 'signature',
        type: 'text',
        upload: 'cloud',
        request: 'email',
        audit: 'list',
        storage: 'lock',
        mobile: 'phone',
        download: 'arrow',
        multi: 'users',
    };
    return visuals[type] ?? 'signature';
}
</script>

<template>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
            v-for="card in featureGrid"
            :key="card.title"
            class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        >
            <!-- Mini illustration bar -->
            <div class="relative h-24 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/50">
                <div class="absolute inset-0 flex items-center justify-center opacity-60 transition-opacity group-hover:opacity-80">
                    <!-- Draw signature visual -->
                    <svg v-if="miniVisual(card.visual) === 'signature'" viewBox="0 0 200 60" class="h-12 w-40" aria-hidden="true">
                        <path d="M10,45 C30,5 55,55 80,25 C100,5 120,50 145,28 C165,14 180,38 195,22" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />
                    </svg>
                    <!-- Type text visual -->
                    <div v-else-if="miniVisual(card.visual) === 'text'" class="font-['Georgia'] text-2xl italic text-blue-600/70">Signature</div>
                    <!-- Cloud upload -->
                    <svg v-else-if="miniVisual(card.visual) === 'cloud'" class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <!-- Email -->
                    <svg v-else-if="miniVisual(card.visual) === 'email'" class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <!-- Audit list -->
                    <div v-else-if="miniVisual(card.visual) === 'list'" class="w-32 space-y-1.5">
                        <div v-for="n in 3" :key="n" class="flex items-center gap-2">
                            <div class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <div class="h-1.5 flex-1 rounded-full bg-gray-200" />
                        </div>
                    </div>
                    <!-- Lock -->
                    <svg v-else-if="miniVisual(card.visual) === 'lock'" class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <!-- Phone -->
                    <svg v-else-if="miniVisual(card.visual) === 'phone'" class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <!-- Download arrow -->
                    <svg v-else-if="miniVisual(card.visual) === 'arrow'" class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <!-- Users -->
                    <svg v-else class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </div>

            <div class="p-6">
                <div :class="['mb-4 flex h-10 w-10 items-center justify-center rounded-xl', card.iconBg]">
                    <svg :class="['h-5 w-5', card.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="card.icon" />
                    </svg>
                </div>
                <h3 class="text-[15px] font-semibold text-gray-900">{{ card.title }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ card.description }}</p>
            </div>
        </div>
    </div>
</template>
