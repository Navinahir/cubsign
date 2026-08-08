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

function featureLinkHref(link) {
    if (link.href) return link.href;
    return route(link.routeName);
}
</script>

<template>
    <MarketingSeo
        title="Features — CubSign | Free PDF Signing"
        description="Learn how CubSign self-sign, request signatures, templates, activity history, private storage, and document tracking work — with real product limits."
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
                Each section explains what the feature does, why it matters, how you use it, and what to expect. Free during Early Access. Visuals below are product illustrations of the CubSign workflow, not third-party screenshots.
            </p>
            <p class="mt-4 text-sm text-gray-500">
                Prefer to start immediately?
                <Link :href="route('sign.index')" class="font-medium text-blue-600 hover:text-blue-700">Upload a PDF</Link>
                ·
                <Link :href="route('help-center')" class="font-medium text-blue-600 hover:text-blue-700">Help Center</Link>
            </p>
        </div>
    </section>

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
                        'grid items-start gap-6 lg:grid-cols-2 lg:gap-10',
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
                            <p class="mt-3 text-xs text-gray-400">Illustrated CubSign workflow</p>
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

                            <div class="mt-5 space-y-4 text-sm text-gray-700">
                                <div>
                                    <h3 class="font-semibold text-gray-900">Why it matters</h3>
                                    <p class="mt-1 leading-relaxed text-gray-600">{{ feature.whyItMatters }}</p>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">How you use it</h3>
                                    <ol class="mt-2 list-decimal space-y-1.5 pl-5 text-gray-600">
                                        <li v-for="step in feature.howToUse" :key="step">{{ step }}</li>
                                    </ol>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">What to expect</h3>
                                    <p class="mt-1 leading-relaxed text-gray-600">{{ feature.expect }}</p>
                                </div>
                            </div>

                            <ul class="mt-5 space-y-2">
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

                            <div class="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                                <Link
                                    v-for="link in feature.links"
                                    :key="link.label"
                                    :href="featureLinkHref(link)"
                                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    {{ link.label }}
                                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>

        <section class="bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-12" aria-labelledby="audience-heading">
            <div class="mx-auto max-w-6xl">
                <ScrollReveal>
                    <h2 id="audience-heading" class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Practical audiences
                    </h2>
                    <p class="mt-2 max-w-xl text-sm text-gray-500">
                        Example workflows CubSign supports today — not customer logos or testimonials.
                    </p>
                </ScrollReveal>

                <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <ScrollReveal :delay="0">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <PenSquare :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Freelancers</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Self-sign client contracts or send a PDF for the client’s signature and download the result.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="40">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Building2 :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Small business</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Store vendor forms in the workspace and track who has signed.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="80">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-gray-800 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Scale :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Legal ops</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Send NDAs with activity history for invitations and signature events.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="120">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Users :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">HR</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Collect signed offer letters before day one using email invitation links.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="160">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <TrendingUp :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Sales</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Close quotes and short contracts with sequential multi-recipient signing.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal :delay="200">
                        <div class="marketing-card-lift group h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm transition-transform group-hover:scale-105 motion-reduce:transform-none">
                                <Briefcase :size="18" :stroke-width="2" color="white" aria-hidden="true" />
                            </div>
                            <h3 class="text-sm font-bold text-gray-900">Operations</h3>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500">Reuse templates for recurring internal forms and keep status visible.</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
