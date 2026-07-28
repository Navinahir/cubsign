<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import ProductMockup from '@/Components/Marketing/ProductMockup.vue';
import FeaturesTemplatesIllustration from '@/Components/Marketing/Features/FeaturesTemplatesIllustration.vue';
import FeaturesAuditIllustration from '@/Components/Marketing/Features/FeaturesAuditIllustration.vue';
import FeaturesSecureStorageIllustration from '@/Components/Marketing/Features/FeaturesSecureStorageIllustration.vue';
import FeaturesTrackingIllustration from '@/Components/Marketing/Features/FeaturesTrackingIllustration.vue';
import { Link } from '@inertiajs/vue3';
import {
    PenSquare,
    Building2,
    Scale,
    Users,
    TrendingUp,
    Briefcase,
} from '@lucide/vue';
import { featuresShowcases } from '@/constants/featuresPage';
</script>

<template>
    <MarketingSeo
        title="Features — CubSign | Free PDF Signing"
        description="Self-sign PDFs, request signatures, use templates, track documents, and keep audit trails. Free during early access."
        path="/features"
    />

    <PublicLayout>
    <section class="border-b border-gray-100 bg-white px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-20 lg:pb-12">
        <div class="mx-auto max-w-6xl">
            <p class="text-sm font-semibold uppercase tracking-wide text-blue-600">Product</p>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                CubSign features
            </h1>
            <p class="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
                Sign PDFs yourself, request signatures from others, reuse templates, and keep a clear record of what happened. Free during Early Access.
            </p>
        </div>
    </section>

    <!-- Core features -->
    <section
            v-for="(feature, index) in featuresShowcases"
            :key="feature.id"
            :class="[
                'px-4 pb-10 sm:px-6 lg:px-8 lg:pb-12',
                index === 0 ? 'pt-10 lg:pt-12' : 'pt-10 lg:pt-12',
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
                                :href="route('sign.index')"
                                class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Try it now
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
                    <ScrollReveal :delay="0">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <PenSquare :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Freelancers</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Sign client contracts and send proposals without the back-and-forth.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="40">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Building2 :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Small Business</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Handle agreements, invoices, and vendor forms in one place.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="80">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-gray-800 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Scale :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Legal Teams</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Send NDAs and agreements with a clear record of who signed.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="120">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Users :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">HR</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Get offer letters and onboarding paperwork signed before day one.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="160">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <TrendingUp :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Sales</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Close deals faster with quotes and contracts signed online.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="200">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Briefcase :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Operations</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Keep vendor agreements and internal forms organized and tracked.</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
