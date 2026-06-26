<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import { btnPrimary, CTA_START_SIGNING, socialStats } from '@/constants/marketing';

const timeline = [
    { year: '2024', title: 'The Idea', description: 'CubSign was conceived to make PDF signing accessible to everyone.' },
    { year: '2025', title: 'Early Development', description: 'Core signing engine, editor, and secure storage built from the ground up.' },
    { year: '2025', title: 'Early Access Launch', description: 'CubSign opens to early users — completely free while we gather feedback.' },
    { year: '2026', title: 'Growing Fast', description: '2,500+ documents signed and counting. Multi-recipient workflows launched.' },
];

const team = [
    { name: 'Alex Chen', role: 'CEO & Co-founder', initials: 'AC', bg: 'bg-blue-500' },
    { name: 'Priya Sharma', role: 'CTO & Co-founder', initials: 'PS', bg: 'bg-violet-500' },
    { name: 'Jordan Lee', role: 'Head of Product', initials: 'JL', bg: 'bg-emerald-500' },
    { name: 'Morgan Davis', role: 'Lead Engineer', initials: 'MD', bg: 'bg-rose-500' },
];

const whyCubSign = [
    { title: 'Simplicity First', description: 'No bloated enterprise software. Upload, sign, done.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Security Built In', description: 'Encryption, audit trails, and privacy controls from day one.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'Free During Early Access', description: 'Full features at no cost while we perfect the experience.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];
</script>

<template>
    <MarketingSeo title="About Us – CubSign" description="Learn about CubSign's mission to make PDF signing simple, secure, and accessible for everyone." path="/about" />

    <PublicLayout>
        <!-- Hero -->
        <section class="marketing-gradient-hero px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl text-center">
                <ScrollReveal>
                    <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">About CubSign</span>
                    <h1 class="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Making PDF signing simple for everyone</h1>
                    <p class="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
                        We believe signing documents should be fast, secure, and free of friction — no printing, no scanning, no expensive subscriptions.
                    </p>
                </ScrollReveal>
            </div>
        </section>

        <!-- Mission & Vision -->
        <section class="px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                <ScrollReveal class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h2 class="text-xl font-bold text-gray-900">Our Mission</h2>
                    <p class="mt-4 text-sm leading-relaxed text-gray-600">
                        To democratize document signing by providing a modern, accessible platform that anyone can use — from freelancers signing contracts to HR teams onboarding new hires.
                    </p>
                </ScrollReveal>
                <ScrollReveal :delay="100" class="rounded-2xl border border-blue-200 bg-blue-50/50 p-8 shadow-sm">
                    <h2 class="text-xl font-bold text-gray-900">Our Vision</h2>
                    <p class="mt-4 text-sm leading-relaxed text-gray-600">
                        A world where every document can be signed digitally in seconds, with the same legal validity and security as traditional methods — but without the hassle.
                    </p>
                </ScrollReveal>
            </div>
        </section>

        <!-- Why CubSign -->
        <section class="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-5xl">
                <h2 class="mb-10 text-center text-2xl font-bold text-gray-900">Why CubSign?</h2>
                <div class="grid gap-6 sm:grid-cols-3">
                    <ScrollReveal v-for="(item, i) in whyCubSign" :key="item.title" :delay="i * 80" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" /></svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
                        <p class="mt-2 text-sm text-gray-500">{{ item.description }}</p>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Timeline -->
        <section class="px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl">
                <h2 class="mb-10 text-center text-2xl font-bold text-gray-900">Our Journey</h2>
                <div class="space-y-0">
                    <ScrollReveal v-for="(item, index) in timeline" :key="item.title" :delay="index * 60" class="relative flex gap-6 pb-10 last:pb-0">
                        <div v-if="index < timeline.length - 1" class="absolute left-5 top-12 h-full w-0.5 bg-blue-200" aria-hidden="true" />
                        <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{{ item.year.slice(2) }}</div>
                        <div>
                            <p class="text-xs font-semibold text-blue-600">{{ item.year }}</p>
                            <h3 class="mt-1 font-semibold text-gray-900">{{ item.title }}</h3>
                            <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Stats -->
        <section class="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
                <div v-for="stat in socialStats" :key="stat.label" class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <p class="text-3xl font-bold text-blue-600">{{ stat.value }}</p>
                    <p class="mt-2 text-sm text-gray-500">{{ stat.label }}</p>
                </div>
            </div>
        </section>

        <!-- Team -->
        <section class="px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-5xl">
                <h2 class="mb-10 text-center text-2xl font-bold text-gray-900">Meet the Team</h2>
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div v-for="member in team" :key="member.name" class="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                        <div :class="['mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white', member.bg]">{{ member.initials }}</div>
                        <h3 class="mt-4 font-semibold text-gray-900">{{ member.name }}</h3>
                        <p class="mt-1 text-sm text-gray-500">{{ member.role }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 px-8 py-14 text-center shadow-xl">
                <h2 class="text-2xl font-bold text-white sm:text-3xl">Ready to sign smarter?</h2>
                <p class="mt-3 text-blue-100">Join CubSign Early Access — completely free.</p>
                <Link :href="route('register')" :class="[btnPrimary, 'mt-8 !bg-white !text-gray-900 hover:!bg-gray-50']">{{ CTA_START_SIGNING }}</Link>
            </div>
        </section>
    </PublicLayout>
</template>
