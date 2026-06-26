<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import { securityPageFeatures, CTA_START_SIGNING } from '@/constants/marketing';
</script>

<template>
    <MarketingSeo title="Security – CubSign" description="Learn how CubSign protects your documents with bank-grade encryption, audit trails, and GDPR-aligned privacy." path="/security" />

    <PublicLayout>
        <section class="marketing-gradient-hero relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
            <DecorativeBg pattern="rings" />
            <div class="relative mx-auto max-w-4xl text-center">
                <span class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    Enterprise Security
                </span>
                <h1 class="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Your documents deserve bank-grade protection</h1>
                <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">AES-256 encryption, TLS 1.3, audit trails, and GDPR-aligned privacy — built into every document from day one.</p>
            </div>
        </section>

        <section class="marketing-section">
            <div class="mx-auto max-w-6xl">
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ScrollReveal v-for="(f, i) in securityPageFeatures" :key="f.title" :delay="i * 50" class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="f.icon"/></svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">{{ f.title }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ f.description }}</p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <section class="marketing-section-alt">
            <div class="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
                <ScrollReveal>
                    <h2 class="text-2xl font-bold text-gray-900">Encryption at every layer</h2>
                    <ul class="mt-6 space-y-4">
                        <li class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">TLS</span><div><p class="font-medium text-gray-900">TLS 1.3 in transit</p><p class="text-sm text-gray-500">All data encrypted during transmission over HTTPS.</p></div></li>
                        <li class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">AES</span><div><p class="font-medium text-gray-900">AES-256 at rest</p><p class="text-sm text-gray-500">Documents encrypted on secure cloud storage.</p></div></li>
                        <li class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-700">GDPR</span><div><p class="font-medium text-gray-900">GDPR-aligned privacy</p><p class="text-sm text-gray-500">Your data is never sold. Delete anytime.</p></div></li>
                    </ul>
                </ScrollReveal>
                <ScrollReveal :delay="100">
                    <div class="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 p-10 text-center text-white shadow-2xl">
                        <svg viewBox="0 0 200 220" class="mx-auto h-48 w-40" aria-hidden="true">
                            <path d="M100 10 L180 45 L180 120 C180 170 100 210 100 210 C100 210 20 170 20 120 L20 45 Z" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="2" opacity="0.8"/>
                            <path d="M75 115 L92 132 L130 90" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p class="mt-4 text-sm font-semibold">SOC 2 Type II — Coming Soon</p>
                    </div>
                </ScrollReveal>
            </div>
        </section>

        <section class="marketing-section">
            <div class="mx-auto max-w-5xl"><CtaBanner :title="CTA_START_SIGNING" description="Secure, fast, and free during Early Access." primary-label="Create Free Account" secondary-label="View Privacy Policy" :secondary-href="route('privacy')" /></div>
        </section>
    </PublicLayout>
</template>
