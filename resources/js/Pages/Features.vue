<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import ProductMockup from '@/Components/Marketing/ProductMockup.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import FeaturesHeroIllustration from '@/Components/Marketing/Features/FeaturesHeroIllustration.vue';
import FeaturesTemplatesIllustration from '@/Components/Marketing/Features/FeaturesTemplatesIllustration.vue';
import FeaturesAuditIllustration from '@/Components/Marketing/Features/FeaturesAuditIllustration.vue';
import FeaturesSecureStorageIllustration from '@/Components/Marketing/Features/FeaturesSecureStorageIllustration.vue';
import FeaturesTrackingIllustration from '@/Components/Marketing/Features/FeaturesTrackingIllustration.vue';
import { Link } from '@inertiajs/vue3';
import {
    EARLY_ACCESS_HEADLINE,
    CTA_START_SIGNING,
    btnPrimary,
    btnSecondary,
} from '@/constants/marketing';
import {
    featuresShowcases,
    featuresAudience,
    featuresIncluded,
} from '@/constants/featuresPage';
</script>

<template>
    <MarketingSeo
        title="Features — CubSign | Free PDF Signing"
        description="Self-sign PDFs, request signatures, use templates, track documents, and keep audit trails. Free during early access."
        path="/features"
    />

    <PublicLayout>
        <!-- Hero -->
        <section class="marketing-gradient-hero relative overflow-hidden px-4 pb-10 pt-10 sm:px-6 lg:pb-12 lg:pt-12">
            <DecorativeBg pattern="grid" />
            <div class="pointer-events-none absolute -right-24 top-16 h-56 w-56 rounded-full bg-blue-200/20 blur-3xl" aria-hidden="true" />

            <div class="relative mx-auto max-w-6xl">
                <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
                    <ScrollReveal>
                        <span class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
                            Features
                        </span>

                        <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                            Everything CubSign offers,
                            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">in one place</span>
                        </h1>

                        <p class="mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                            Sign PDFs yourself, collect signatures from others, reuse templates, and see exactly where each document stands.
                        </p>

                        <p class="mt-2 text-xs font-medium text-blue-600">{{ EARLY_ACCESS_HEADLINE }}</p>

                        <div class="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                            <Link :href="route('register')" :class="[btnPrimary, 'marketing-btn-ripple']">
                                {{ CTA_START_SIGNING }}
                            </Link>
                            <Link :href="route('sign.index')" :class="btnSecondary">
                                Try Without Account
                            </Link>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" :delay="100">
                        <FeaturesHeroIllustration />
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Core features -->
        <section
            v-for="(feature, index) in featuresShowcases"
            :key="feature.id"
            :class="[
                'px-4 py-10 sm:px-6 lg:px-8 lg:py-12',
                index % 2 === 1 ? 'bg-gray-50/70' : 'bg-white',
            ]"
            :aria-labelledby="`feature-${feature.id}`"
        >
            <div class="mx-auto max-w-6xl">
                <div
                    :class="[
                        'grid items-center gap-6 lg:grid-cols-2 lg:gap-10',
                        index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : '',
                    ]"
                >
                    <ScrollReveal :direction="index % 2 === 0 ? 'left' : 'right'">
                        <div class="relative max-w-md lg:max-w-none">
                            <ProductMockup
                                v-if="feature.mockup === 'signature'"
                                variant="signature"
                                size="compact"
                            />
                            <ProductMockup
                                v-else-if="feature.mockup === 'request'"
                                variant="request"
                                size="compact"
                            />
                            <FeaturesTemplatesIllustration v-else-if="feature.mockup === 'templates'" />
                            <FeaturesAuditIllustration v-else-if="feature.mockup === 'audit'" />
                            <FeaturesSecureStorageIllustration v-else-if="feature.mockup === 'storage'" />
                            <FeaturesTrackingIllustration v-else-if="feature.mockup === 'tracking'" />
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :direction="index % 2 === 0 ? 'right' : 'left'" :delay="60">
                        <div>
                            <h2 :id="`feature-${feature.id}`" class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                {{ feature.title }}
                            </h2>
                            <p class="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
                                {{ feature.description }}
                            </p>
                            <ul class="mt-4 space-y-2">
                                <li
                                    v-for="bullet in feature.bullets"
                                    :key="bullet"
                                    class="flex items-start gap-2 text-sm text-gray-700"
                                >
                                    <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {{ bullet }}
                                </li>
                            </ul>
                            <Link
                                :href="route('register')"
                                class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Learn more
                                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Designed for every workflow -->
        <section class="bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-12" aria-labelledby="audience-heading">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <h2 id="audience-heading" class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Designed for every workflow
                    </h2>
                    <p class="mt-2 max-w-xl text-sm text-gray-500">
                        Whether you work alone or with a team, CubSign fits how you handle documents.
                    </p>
                </ScrollReveal>

                <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <ScrollReveal
                        v-for="(card, i) in featuresAudience"
                        :key="card.title"
                        :delay="i * 40"
                    >
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div
                                :class="[
                                    'mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none',
                                    card.gradient,
                                ]"
                            >
                                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="card.icon" />
                                </svg>
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">{{ card.title }}</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">{{ card.description }}</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <!-- Everything included -->
        <section class="bg-gray-50/70 px-4 py-10 sm:px-6 lg:px-8 lg:py-12" aria-labelledby="included-heading">
            <div class="mx-auto max-w-4xl">
                <ScrollReveal>
                    <h2 id="included-heading" class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Everything included
                    </h2>
                    <p class="mx-auto mt-2 max-w-md text-center text-sm text-gray-500">
                        All of this is available free during early access.
                    </p>
                </ScrollReveal>

                <ScrollReveal :delay="60">
                    <ul class="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" role="list">
                        <li
                            v-for="item in featuresIncluded"
                            :key="item"
                            class="flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-shadow hover:shadow-md motion-reduce:transition-none"
                        >
                            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600" aria-hidden="true">✓</span>
                            {{ item }}
                        </li>
                    </ul>
                </ScrollReveal>
            </div>
        </section>

        <!-- Final CTA -->
        <section class="px-4 py-10 sm:px-6 lg:px-8 lg:py-14" aria-labelledby="features-cta">
            <div class="mx-auto max-w-3xl">
                <ScrollReveal>
                    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-10 text-center shadow-xl sm:px-10 sm:py-12">
                        <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
                        <h2 id="features-cta" class="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Ready to simplify document signing?
                        </h2>
                        <p class="relative mt-2 text-sm text-blue-100">
                            Create a free account or sign a PDF right now. No credit card needed.
                        </p>
                        <div class="relative mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                            <Link
                                :href="route('register')"
                                class="marketing-btn-ripple w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
                            >
                                {{ CTA_START_SIGNING }}
                            </Link>
                            <Link
                                :href="route('sign.index')"
                                class="w-full rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
                            >
                                Try Without Account
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    </PublicLayout>
</template>
