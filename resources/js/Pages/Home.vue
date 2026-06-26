<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import StickyMobileCta from '@/Components/StickyMobileCta.vue';
import FloatingTrustIndicators from '@/Components/FloatingTrustIndicators.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import WorkflowTimeline from '@/Components/Marketing/WorkflowTimeline.vue';
import FeatureGrid from '@/Components/Marketing/FeatureGrid.vue';
import SecuritySection from '@/Components/Marketing/SecuritySection.vue';
import SocialProof from '@/Components/Marketing/SocialProof.vue';
import PricingSection from '@/Components/Marketing/PricingSection.vue';
import FaqAccordion from '@/Components/Marketing/FaqAccordion.vue';
import {
    EARLY_ACCESS_HEADLINE,
    CTA_START_SIGNING,
    CTA_CREATE_ACCOUNT,
    btnPrimary,
    btnSecondary,
    heroTrustBadges,
    homeFaqs,
} from '@/constants/marketing';

defineProps({
    hasSignSession: { type: Boolean, default: false },
});

const activeSignTab = ref('draw');
const typedSignature = ref('');
</script>

<template>
    <MarketingSeo
        title="CubSign – Free Online PDF Signing"
        description="Sign PDFs online for free. Upload documents, request signatures, and download signed PDFs securely with CubSign."
        path="/"
        :faq-schema="homeFaqs"
    />

    <PublicLayout>
        <div class="pb-20 md:pb-0">

            <!-- HERO -->
            <section class="marketing-gradient-hero relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:pb-20 lg:pt-20">
                <div class="pointer-events-none absolute inset-0 overflow-hidden">
                    <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
                    <div class="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
                </div>

                <div class="relative mx-auto max-w-7xl">
                    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        <ScrollReveal>
                            <div class="mb-6 flex">
                                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                                    <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 motion-reduce:animate-none" />
                                    {{ EARLY_ACCESS_HEADLINE }}
                                </span>
                            </div>

                            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                                Sign PDFs Online<br />
                                <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">in Seconds</span>
                            </h1>

                            <p class="mt-5 max-w-lg text-lg leading-relaxed text-gray-600">
                                Upload, sign, send, and download legally signed PDFs — free during Early Access. No credit card. No friction.
                            </p>

                            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link :href="route('register')" :class="[btnPrimary, 'marketing-btn-ripple']">
                                    {{ CTA_START_SIGNING }}
                                </Link>
                                <Link :href="route('sign.index')" :class="btnSecondary">
                                    Sign Without Account
                                </Link>
                            </div>

                            <FloatingTrustIndicators />

                            <div v-if="hasSignSession" class="mt-4">
                                <Link :href="route('sign.editor')" class="text-sm text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline">
                                    Already started signing? Continue &rarr;
                                </Link>
                            </div>

                            <div class="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                                <span v-for="badge in heroTrustBadges" :key="badge" class="flex items-center gap-2 text-sm text-gray-600">
                                    <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {{ badge }}
                                </span>
                            </div>
                        </ScrollReveal>

                        <!-- Product mockup -->
                        <ScrollReveal direction="right" :delay="150">
                            <div class="relative mx-auto w-full max-w-md lg:mx-0">
                                <!-- Browser frame -->
                                <div class="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/80">
                                    <div class="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                                        <span class="h-2.5 w-2.5 rounded-full bg-red-400" />
                                        <span class="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                        <span class="h-2.5 w-2.5 rounded-full bg-green-400" />
                                        <span class="ml-2 flex-1 rounded-md bg-white px-3 py-1 text-[11px] text-gray-400">app.cubsign.com/editor</span>
                                    </div>
                                    <div class="p-5">
                                        <div class="mb-4 flex items-center justify-between">
                                            <div class="flex items-center gap-3">
                                                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                                                    <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p class="text-sm font-semibold text-gray-900">Service Agreement.pdf</p>
                                                    <p class="text-xs text-gray-400">2 pages · 240 KB</p>
                                                </div>
                                            </div>
                                            <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Signed</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div v-for="w in ['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full']" :key="w" :class="['h-2 rounded-full bg-gray-100', w]" />
                                        </div>
                                        <div class="mt-4 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 px-4 py-3">
                                            <p class="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">Signature</p>
                                            <svg viewBox="0 0 220 55" class="h-8 w-32" aria-hidden="true">
                                                <path d="M10,42 C28,4 50,58 74,26 C92,5 112,50 140,28 C158,14 172,36 210,20" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <!-- Floating cards -->
                                <div class="marketing-float absolute -right-3 top-4 z-20 hidden rounded-xl bg-white px-4 py-3 shadow-xl ring-1 ring-gray-100 sm:block">
                                    <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">This week</p>
                                    <p class="text-2xl font-bold text-gray-900">12</p>
                                    <p class="text-[11px] text-gray-500">Documents signed</p>
                                </div>
                                <div class="absolute -bottom-4 -left-4 z-20 hidden items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 shadow-xl ring-1 ring-gray-100 sm:flex">
                                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                        <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-xs font-semibold text-gray-900">Signature verified</p>
                                        <p class="text-[11px] text-gray-500">Bank-grade encryption</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <!-- INTERACTIVE DEMO -->
            <section class="border-y border-gray-100 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal>
                        <SectionHeader
                            eyebrow="See it in action"
                            title="See CubSign work in under 30 seconds"
                            description="Four simple steps. Same flow as the real app."
                            class="mb-10"
                        />
                    </ScrollReveal>

                    <ScrollReveal :delay="100">
                        <div class="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200/80">
                            <div class="grid divide-y divide-gray-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                                <div class="p-7">
                                    <div class="mb-5 flex items-center gap-3">
                                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                                        <div>
                                            <p class="text-sm font-semibold text-gray-900">Create Signature</p>
                                            <p class="text-xs text-gray-400">Draw, type or upload</p>
                                        </div>
                                    </div>
                                    <div class="flex gap-1 rounded-xl bg-gray-100 p-1">
                                        <button
                                            v-for="tab in ['draw', 'type', 'upload']"
                                            :key="tab"
                                            type="button"
                                            :class="['flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-all', activeSignTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500']"
                                            @click="activeSignTab = tab"
                                        >
                                            {{ tab }}
                                        </button>
                                    </div>
                                    <div class="mt-4">
                                        <div v-if="activeSignTab === 'draw'" class="flex h-28 items-end rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
                                            <svg viewBox="0 0 220 55" class="h-9 w-36" aria-hidden="true">
                                                <path d="M8,44 C28,4 50,60 76,28 C96,4 114,52 142,28 C160,14 174,38 215,22" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />
                                            </svg>
                                        </div>
                                        <div v-else-if="activeSignTab === 'type'" class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3">
                                            <input v-model="typedSignature" type="text" placeholder="Type your full name" class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                                            <p class="mt-3 font-['Georgia'] text-xl italic text-gray-700">{{ typedSignature || 'Your Name' }}</p>
                                        </div>
                                        <div v-else class="flex h-28 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                                            <svg class="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p class="mt-2 text-xs text-gray-500">Drop image or browse</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-7">
                                    <div class="mb-5 flex items-center gap-3">
                                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                                        <p class="text-sm font-semibold text-gray-900">Place on Document</p>
                                    </div>
                                    <div class="overflow-hidden rounded-xl border border-gray-200">
                                        <div class="border-b border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-400">Service Agreement.pdf</div>
                                        <div class="space-y-1.5 bg-gray-50 p-4">
                                            <div v-for="w in ['w-full', 'w-10/12', 'w-full']" :key="w" :class="['h-1.5 rounded-full bg-gray-200', w]" />
                                            <div class="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 ring-2 ring-blue-100">
                                                <svg viewBox="0 0 120 30" class="h-4 w-14" aria-hidden="true">
                                                    <path d="M4,22 C15,2 30,28 44,14 C56,2 66,24 82,14 C92,8 100,18 116,12" fill="none" stroke="#2563EB" stroke-width="1.75" stroke-linecap="round" />
                                                </svg>
                                                <span class="text-[10px] font-medium text-blue-500">Drag to move</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col p-7">
                                    <div class="mb-5 flex items-center gap-3">
                                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>
                                        <p class="text-sm font-semibold text-gray-900">Done — Ready to download</p>
                                    </div>
                                    <div class="flex-1 rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[11px] font-medium text-gray-700">Service Agreement.pdf</span>
                                            <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">SIGNED</span>
                                        </div>
                                    </div>
                                    <Link :href="route('sign.index')" class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700">
                                        Finish Signing
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <!-- FEATURES -->
            <section class="px-4 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-7xl">
                    <ScrollReveal class="mb-12">
                        <SectionHeader eyebrow="Features" title="Everything you need to sign smarter" description="From quick self-signing to multi-recipient workflows — built for individuals and businesses." />
                    </ScrollReveal>
                    <ScrollReveal :delay="100">
                        <FeatureGrid />
                    </ScrollReveal>
                    <div class="mt-10 text-center">
                        <Link :href="route('features')" class="text-sm font-medium text-blue-600 hover:text-blue-700">See all features &rarr;</Link>
                    </div>
                </div>
            </section>

            <!-- WORKFLOW -->
            <section class="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-12">
                        <SectionHeader eyebrow="How it works" title="From upload to signed PDF" description="A simple five-step workflow that takes under a minute." />
                    </ScrollReveal>
                    <ScrollReveal :delay="100">
                        <WorkflowTimeline />
                    </ScrollReveal>
                </div>
            </section>

            <!-- SECURITY -->
            <section class="px-4 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-7xl">
                    <ScrollReveal class="mb-12">
                        <SectionHeader eyebrow="Trust & Security" title="Enterprise-grade security, built in" description="Every document is protected, tracked, and legally defensible from upload to completion." />
                    </ScrollReveal>
                    <ScrollReveal :delay="100">
                        <SecuritySection />
                    </ScrollReveal>
                </div>
            </section>

            <!-- SOCIAL PROOF -->
            <section class="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-7xl">
                    <ScrollReveal class="mb-12">
                        <SectionHeader eyebrow="Social Proof" title="Trusted by people who value their time" />
                    </ScrollReveal>
                    <ScrollReveal :delay="100">
                        <SocialProof />
                    </ScrollReveal>
                </div>
            </section>

            <!-- PRICING -->
            <section class="px-4 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal class="mb-12">
                        <SectionHeader :eyebrow="EARLY_ACCESS_HEADLINE" title="Simple, transparent pricing" description="Use CubSign completely free while we improve the platform based on user feedback." />
                    </ScrollReveal>
                    <ScrollReveal :delay="100">
                        <PricingSection />
                    </ScrollReveal>
                </div>
            </section>

            <!-- FAQ -->
            <section class="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader eyebrow="FAQ" title="Common questions" />
                    </ScrollReveal>
                    <ScrollReveal :delay="100">
                        <FaqAccordion :faqs="homeFaqs" searchable show-all-link />
                    </ScrollReveal>
                </div>
            </section>

            <!-- FINAL CTA -->
            <section class="px-4 py-14 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal>
                        <div class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-500 to-blue-700 px-8 py-16 shadow-2xl sm:px-14 lg:py-20">
                            <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl" />
                            <div class="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-800/30 blur-3xl" />
                            <div class="relative text-center">
                                <span class="mb-6 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">{{ EARLY_ACCESS_HEADLINE }}</span>
                                <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Start Signing Documents Today</h2>
                                <p class="mx-auto mt-4 max-w-xl text-lg text-blue-100">Join thousands of users signing PDFs online — completely free during Early Access.</p>
                                <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                    <Link :href="route('register')" class="marketing-btn-ripple w-full rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 sm:w-auto">
                                        {{ CTA_CREATE_ACCOUNT }}
                                    </Link>
                                    <Link :href="route('sign.index')" class="w-full rounded-xl border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto">
                                        Sign Without Account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <StickyMobileCta />
        </div>
    </PublicLayout>
</template>
