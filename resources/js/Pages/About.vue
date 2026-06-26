<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import AnimatedCounter from '@/Components/Marketing/AnimatedCounter.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import {
    companyStats, companyValues, aboutTimeline,
    CTA_START_SIGNING, btnPrimary,
} from '@/constants/marketing';
</script>

<template>
    <MarketingSeo title="About Us – CubSign" description="CubSign's mission is to make PDF signing simple, secure, and accessible for everyone." path="/about" />

    <PublicLayout>
        <!-- Hero -->
        <section class="marketing-gradient-hero relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
            <DecorativeBg pattern="grid" />
            <div class="relative mx-auto max-w-4xl text-center">
                <ScrollReveal>
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">About CubSign</span>
                    <h1 class="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Making paperless signing accessible to everyone</h1>
                    <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
                        CubSign was built to eliminate the print-sign-scan cycle. We believe signing documents should be fast, secure, and free of friction — for freelancers, businesses, and enterprises alike.
                    </p>
                </ScrollReveal>
            </div>
        </section>

        <!-- Mission & Vision -->
        <section class="marketing-section">
            <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
                <ScrollReveal class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h2 class="text-xl font-bold text-gray-900">Our Mission</h2>
                    <p class="mt-4 text-sm leading-relaxed text-gray-600">To democratize document signing by providing a modern, accessible platform that anyone can use — from freelancers signing contracts to HR teams onboarding new hires.</p>
                    <Link :href="route('register')" :class="[btnPrimary, 'mt-6']">{{ CTA_START_SIGNING }}</Link>
                </ScrollReveal>
                <ScrollReveal :delay="80" class="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 shadow-sm">
                    <h2 class="text-xl font-bold text-gray-900">Our Vision</h2>
                    <p class="mt-4 text-sm leading-relaxed text-gray-600">A world where every document can be signed digitally in seconds, with the same legal validity and security as traditional methods — but without the hassle, cost, or environmental waste.</p>
                </ScrollReveal>
            </div>
        </section>

        <!-- Our Story -->
        <section class="marketing-section-alt">
            <div class="mx-auto max-w-3xl">
                <ScrollReveal>
                    <h2 class="text-2xl font-bold text-gray-900">Our Story</h2>
                    <div class="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
                        <p><strong class="text-gray-900">Why CubSign was built:</strong> We watched teams waste hours printing, signing, scanning, and emailing documents. Existing e-signature tools were expensive, bloated, or required enterprise contracts.</p>
                        <p><strong class="text-gray-900">The problem we solve:</strong> CubSign removes every friction point — upload a PDF, add your signature, send to recipients, and download the signed document. No printing. No scanning. No waiting.</p>
                        <p><strong class="text-gray-900">Our vision for paperless signing:</strong> We are building the signing platform we wished existed — simple enough for anyone, secure enough for legal teams, and free during Early Access while we perfect the experience.</p>
                    </div>
                </ScrollReveal>
            </div>
        </section>

        <!-- Timeline -->
        <section class="marketing-section">
            <div class="mx-auto max-w-3xl">
                <h2 class="mb-10 text-center text-2xl font-bold text-gray-900">Our Journey</h2>
                <div class="relative">
                    <div class="absolute left-5 top-0 hidden h-full w-0.5 bg-gradient-to-b from-blue-400 to-indigo-300 sm:block" aria-hidden="true" />
                    <ScrollReveal v-for="(item, i) in aboutTimeline" :key="item.title" :delay="i * 60" class="relative flex gap-6 pb-10 last:pb-0">
                        <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md">{{ item.year === 'Future' ? '→' : item.year.slice(2) }}</div>
                        <div>
                            <p class="text-xs font-semibold text-blue-600">{{ item.year }}</p>
                            <h3 class="mt-0.5 font-semibold text-gray-900">{{ item.title }}</h3>
                            <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Values -->
        <section class="marketing-section-alt">
            <div class="mx-auto max-w-6xl">
                <h2 class="mb-10 text-center text-2xl font-bold text-gray-900">Company Values</h2>
                <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <ScrollReveal v-for="(v, i) in companyValues" :key="v.title" :delay="i * 40" class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="v.icon"/></svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">{{ v.title }}</h3>
                        <p class="mt-2 text-sm text-gray-500">{{ v.description }}</p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Stats -->
        <section class="marketing-section">
            <div class="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <div v-for="stat in companyStats" :key="stat.label" class="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <p class="text-2xl font-bold text-blue-600 sm:text-3xl"><AnimatedCounter :value="stat.value" /></p>
                    <p class="mt-2 text-xs font-medium text-gray-500 sm:text-sm">{{ stat.label }}</p>
                </div>
            </div>
        </section>

        <!-- Team -->
        <section class="marketing-section-alt">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-2xl font-bold text-gray-900">Who We Are</h2>
                <p class="mt-4 text-sm leading-relaxed text-gray-600">
                    CubSign is built by Cubiz Infotech — a small team focused on making document signing simple, secure, and accessible. We're in Early Access and improving the product based on real user feedback.
                </p>
            </div>
        </section>

        <!-- CTA -->
        <section class="marketing-section">
            <div class="mx-auto max-w-5xl"><CtaBanner title="Start Signing Today" description="Join CubSign Early Access — completely free." /></div>
        </section>
    </PublicLayout>
</template>
