<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import { Link } from '@inertiajs/vue3';
import {
    EARLY_ACCESS_HEADLINE,
    CTA_START_SIGNING,
    btnPrimary,
    pageHeaderClass,
} from '@/constants/marketing';

const features = [
    {
        title: 'Self Sign PDFs',
        description: 'Upload any PDF from your device and sign it yourself in seconds. Draw your signature on a canvas, type it in any style, or upload an existing signature image. Download the completed, signed document instantly.',
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        color: 'bg-blue-50 text-blue-600',
        bullets: [
            'Draw, type, or upload your signature',
            'Place signature fields anywhere on the document',
            'Download the signed PDF instantly',
        ],
    },
    {
        title: 'Send for Signature',
        description: 'Need others to sign? Invite recipients by email and let CubSign handle the rest. Recipients receive a secure link, sign without needing an account, and you get notified the moment everyone has signed.',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        color: 'bg-violet-50 text-violet-600',
        bullets: [
            'Send to multiple recipients',
            'Recipients sign without creating an account',
            'Real-time status tracking',
            'Automatic completion notifications',
        ],
    },
    {
        title: 'Reusable Templates',
        description: 'Stop recreating the same documents from scratch. Save frequently-used forms as templates with pre-defined signature fields. Send them to new recipients in seconds, every time.',
        icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
        color: 'bg-emerald-50 text-emerald-600',
        bullets: [
            'Save any document as a reusable template',
            'Pre-define signature fields and positions',
            'Send to new recipients instantly',
        ],
    },
    {
        title: 'Audit Trail',
        description: 'Every action on every document is logged: who viewed it, who signed it, and when. Timestamps and IP addresses help you verify what happened.',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
        color: 'bg-amber-50 text-amber-600',
        bullets: [
            'Full activity log per document',
            'Timestamps and IP addresses recorded',
            'Downloadable audit certificate',
        ],
    },
];
</script>

<template>
    <MarketingSeo
        title="Features — CubSign | Free PDF Signing"
        description="Explore CubSign features: self-sign PDFs, send for signature, reusable templates, and full audit trails. Free during early access."
        path="/features"
    />

    <PublicLayout>
        <section :class="pageHeaderClass">
            <div class="mx-auto max-w-3xl">
                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    {{ EARLY_ACCESS_HEADLINE }}
                </span>
                <h1 class="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Tools for signing PDFs online
                </h1>
                <p class="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
                    Sign documents yourself, send them to others, and keep a record of what was signed and when.
                </p>
            </div>
        </section>

        <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-5xl space-y-12">
                <div
                    v-for="(feature, index) in features"
                    :key="feature.title"
                    :class="[
                        'flex flex-col gap-8 rounded-2xl border border-gray-100 bg-gray-50 p-8 shadow-sm transition-shadow hover:shadow-md lg:flex-row lg:items-start',
                        index % 2 === 1 ? 'lg:flex-row-reverse' : '',
                    ]"
                >
                    <div class="shrink-0">
                        <div :class="['flex h-14 w-14 items-center justify-center rounded-2xl', feature.color]">
                            <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
                            </svg>
                        </div>
                    </div>

                    <div class="flex-1">
                        <h2 class="text-xl font-bold text-gray-900">{{ feature.title }}</h2>
                        <p class="mt-3 text-sm leading-relaxed text-gray-500">{{ feature.description }}</p>
                        <ul class="mt-5 space-y-2">
                            <li
                                v-for="bullet in feature.bullets"
                                :key="bullet"
                                class="flex items-start gap-2.5 text-sm text-gray-600"
                            >
                                <svg class="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {{ bullet }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-xl">
                <h2 class="text-2xl font-bold text-gray-900">{{ EARLY_ACCESS_HEADLINE }}</h2>
                <p class="mt-3 text-gray-500">No credit card required.</p>
                <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link :href="route('register')" :class="[btnPrimary, 'w-full sm:w-auto']">
                        {{ CTA_START_SIGNING }}
                    </Link>
                    <Link
                        :href="route('sign.index')"
                        class="w-full rounded-xl border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto"
                    >
                        Sign a PDF Now
                    </Link>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
