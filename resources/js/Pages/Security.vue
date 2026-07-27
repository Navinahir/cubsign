<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import SecuritySectionNav from '@/Components/Security/SecuritySectionNav.vue';
import {
    securityArticleMeta,
    securitySections,
    securityFaqs,
    securityRelatedLinks,
} from '@/constants/security';
import { SUPPORT_EMAIL, btnPrimary, btnSecondary } from '@/constants/marketing';

const openFaq = ref(null);
const activeSlug = ref(securitySections[0]?.slug ?? '');
const mobileNavOpen = ref(false);

const breadcrumbSchema = [
    { name: 'Home', url: '/' },
    { name: 'Security Center' },
];

function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}

let sectionObserver;
function setupSectionObserver() {
    sectionObserver?.disconnect();

    const targets = [
        ...securitySections.map((s) => s.slug),
        'security-faq',
    ];

    sectionObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible[0]?.target?.id) {
                activeSlug.value = visible[0].target.id;
            }
        },
        { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );

    targets.forEach((id) => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });
}

onMounted(() => {
    if (window.location.hash) {
        const slug = window.location.hash.slice(1);
        const valid = securitySections.some((s) => s.slug === slug) || slug === 'security-faq';
        if (valid) {
            activeSlug.value = slug;
            requestAnimationFrame(() => {
                document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }
    setupSectionObserver();
});

onUnmounted(() => sectionObserver?.disconnect());
</script>

<template>
    <MarketingSeo
        title="Security Center — CubSign | Document & Account Protection"
        description="Learn how CubSign protects your PDFs and account: HTTPS, encryption in transit, secure document handling, authentication, Google sign-in, and responsible disclosure."
        path="/security"
        type="article"
        :article="securityArticleMeta"
        :faq-schema="securityFaqs"
        :breadcrumb-schema="breadcrumbSchema"
    />

    <PublicLayout>
        <!-- Hero -->
        <section class="border-b border-gray-100 bg-gradient-to-b from-white to-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    Trust &amp; Safety
                </span>
                <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                    Security Center
                </h1>
                <p class="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
                    How CubSign protects your documents, account, and signing workflows — explained clearly, without jargon.
                </p>
                <p class="mt-4 text-sm text-gray-500">
                    Last updated {{ new Date(securityArticleMeta.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                </p>
            </div>
        </section>

        <!-- Mobile nav -->
        <section class="border-b border-gray-100 bg-white lg:hidden">
            <div class="px-4 py-3 sm:px-6">
                <button
                    type="button"
                    class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                    :aria-expanded="mobileNavOpen"
                    @click="mobileNavOpen = !mobileNavOpen"
                >
                    <span>Browse security topics</span>
                    <svg :class="['h-4 w-4 text-gray-400 transition-transform', mobileNavOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div v-show="mobileNavOpen" class="mt-3 rounded-2xl border border-gray-200 bg-white p-3">
                    <SecuritySectionNav :active-slug="activeSlug" />
                </div>
            </div>
        </section>

        <!-- Main layout -->
        <section class="bg-white">
            <div class="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_240px]">
                <aside class="hidden border-r border-gray-100 lg:block">
                    <div class="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8 xl:px-6">
                        <SecuritySectionNav :active-slug="activeSlug" />
                    </div>
                </aside>

                <div class="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                    <div class="mb-10 max-w-3xl">
                        <h2 class="text-2xl font-bold tracking-tight text-gray-900">How we protect your documents</h2>
                        <p class="mt-2 text-sm text-gray-600 sm:text-base">
                            CubSign is built around secure connections, careful access controls, and transparent practices.
                            This page describes what we do today — not marketing claims we cannot verify.
                        </p>
                    </div>

                    <div class="max-w-3xl space-y-16">
                        <section
                            v-for="section in securitySections"
                            :id="section.slug"
                            :key="section.slug"
                            class="scroll-mt-24"
                        >
                            <div class="flex items-start gap-4">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="section.icon" />
                                    </svg>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3 class="text-xl font-bold text-gray-900">{{ section.title }}</h3>
                                    <p class="mt-1 text-sm text-gray-500">{{ section.description }}</p>
                                </div>
                            </div>

                            <div class="mt-6 space-y-4 pl-0 sm:pl-[3.75rem]">
                                <p
                                    v-for="(paragraph, i) in section.paragraphs"
                                    :key="`${section.slug}-p-${i}`"
                                    class="text-sm leading-relaxed text-gray-600 sm:text-base"
                                >
                                    {{ paragraph }}
                                </p>
                                <ul v-if="section.bullets?.length" class="space-y-2.5">
                                    <li
                                        v-for="bullet in section.bullets"
                                        :key="bullet"
                                        class="flex items-start gap-2.5 text-sm text-gray-600"
                                    >
                                        <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {{ bullet }}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <!-- Security FAQ -->
                        <section id="security-faq" class="scroll-mt-24 border-t border-gray-100 pt-16">
                            <h3 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Security FAQ</h3>
                            <p class="mt-2 text-sm text-gray-600">Quick answers to common security questions.</p>
                            <div class="mt-6 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                                <div v-for="(item, index) in securityFaqs" :key="item.question">
                                    <button
                                        type="button"
                                        class="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white sm:px-6 sm:py-5"
                                        :aria-expanded="openFaq === index"
                                        @click="toggleFaq(index)"
                                    >
                                        <span class="pr-4 text-sm font-semibold text-gray-900">{{ item.question }}</span>
                                        <svg
                                            :class="['h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', openFaq === index ? 'rotate-180' : '']"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div v-show="openFaq === index" class="px-5 pb-5 text-sm leading-relaxed text-gray-500 sm:px-6">
                                        {{ item.answer }}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <!-- Right sidebar -->
                <aside class="hidden border-l border-gray-100 xl:block">
                    <div class="sticky top-20 max-h-[calc(100vh-5rem)] space-y-8 overflow-y-auto px-5 py-8">
                        <div>
                            <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Related policies</p>
                            <ul class="mt-3 space-y-2">
                                <li v-for="link in securityRelatedLinks" :key="link.label">
                                    <Link
                                        :href="route(link.routeName)"
                                        class="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                                    >
                                        {{ link.label }}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p class="text-sm font-semibold text-gray-900">Report a vulnerability</p>
                            <p class="mt-1 text-xs leading-relaxed text-gray-600">
                                Found a security issue? Contact us responsibly.
                            </p>
                            <a href="mailto:security@cubsign.com" class="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700">
                                security@cubsign.com →
                            </a>
                        </div>
                        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <p class="text-sm font-semibold text-gray-900">General support</p>
                            <p class="mt-1 text-xs leading-relaxed text-gray-600">
                                Questions about signing or your account.
                            </p>
                            <a :href="`mailto:${SUPPORT_EMAIL}`" class="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700">
                                {{ SUPPORT_EMAIL }} →
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </section>

        <!-- Bottom CTA -->
        <section class="border-t border-gray-100 bg-gray-50 px-4 py-14 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-xl">
                <h2 class="text-2xl font-bold text-gray-900">Questions about security?</h2>
                <p class="mt-3 text-sm text-gray-500 sm:text-base">
                    For vulnerabilities, email
                    <a href="mailto:security@cubsign.com" class="font-medium text-blue-600 hover:text-blue-700">security@cubsign.com</a>.
                    For general help, contact support or browse the Help Center.
                </p>
                <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link :href="route('help-center')" :class="btnPrimary">Help Center</Link>
                    <Link :href="route('contact')" :class="btnSecondary">Contact us</Link>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
