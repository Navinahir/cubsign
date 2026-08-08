<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import StickyMobileCta from '@/Components/StickyMobileCta.vue';
import MarketingHero from '@/Components/Marketing/MarketingHero.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import ComparisonSection from '@/Components/Marketing/ComparisonSection.vue';
import SocialProof from '@/Components/Marketing/SocialProof.vue';
import FaqAccordion from '@/Components/Marketing/FaqAccordion.vue';
import CtaBanner from '@/Components/Marketing/CtaBanner.vue';
import {
    credibilityCards,
    homeFaqs,
    journeySteps,
    CTA_START_SIGNING,
} from '@/constants/marketing';

defineProps({ hasSignSession: { type: Boolean, default: false } });

const whatCubSignDoes = [
    {
        title: 'Sign a PDF yourself',
        body: 'Upload a PDF, place a signature in the browser editor, and download the finished file. No printing or scanning.',
    },
    {
        title: 'Send for signature',
        body: 'With a free account, invite recipients by email. They sign through a unique link without creating an account.',
    },
    {
        title: 'Keep work in one place',
        body: 'Account holders store documents, reuse templates, and check pending vs signed status from the workspace.',
    },
];

const useCases = [
    {
        title: 'Client contracts',
        body: 'Sign a proposal or MSA yourself, or send it to a client for their signature and download the completed PDF.',
    },
    {
        title: 'NDAs and simple agreements',
        body: 'Place signature and date fields once, save as a template, and send to the next counterparty.',
    },
    {
        title: 'Onboarding paperwork',
        body: 'Send offer letters or policy acknowledgements to new hires and track who still needs to sign.',
    },
    {
        title: 'Instead of print-sign-scan',
        body: 'When you only need a clear electronic signature on a PDF, CubSign keeps the whole loop in the browser.',
    },
];

const privacyPoints = [
    {
        title: 'HTTPS in transit',
        body: 'Uploads, signing sessions, and downloads use encrypted HTTPS connections.',
    },
    {
        title: 'Private storage',
        body: 'Account documents live on private server storage. Access is limited to owners and invited recipients.',
    },
    {
        title: 'Honest limits',
        body: 'PDF only, up to 25 MB. Guests get one self-sign session. We do not claim AES-256 at rest or legal guarantees.',
    },
];

const resourceLinks = [
    { label: 'Features', description: 'What each CubSign capability does and how to use it', routeName: 'features' },
    { label: 'Pricing', description: 'Free Early Access, guest vs account, current limits', routeName: 'pricing' },
    { label: 'Security Center', description: 'HTTPS, authentication, storage, and disclosure', routeName: 'security' },
    { label: 'Help Center', description: 'Step-by-step upload, sign, download, and troubleshooting', routeName: 'help-center' },
    { label: 'Blog', description: 'Product guides on signing, sending, and mobile use', routeName: 'blog' },
    { label: 'FAQ', description: 'Accounts, file types, activity history, and Early Access', routeName: 'faq' },
];
</script>

<template>
    <MarketingSeo
        title="CubSign – Upload & Sign PDFs Online Free"
        description="CubSign is a browser-based PDF signing product. Upload a PDF, draw type or upload a signature, download the signed file, or send it for signature. Free during Early Access."
        path="/"
        type="website"
        :faq-schema="homeFaqs"
        search-target="/help-center?q={search_term_string}"
    />

    <PublicLayout>
        <div class="pb-20 md:pb-0">
            <MarketingHero :has-sign-session="hasSignSession" />

            <section class="marketing-section" aria-labelledby="what-cubsign-does">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Product"
                            title="What CubSign does"
                            description="CubSign is a first-party PDF signing tool for freelancers, small teams, and anyone who needs to finish a document without print-sign-scan."
                        />
                    </ScrollReveal>
                    <div class="grid gap-4 md:grid-cols-3">
                        <ScrollReveal
                            v-for="(item, index) in whatCubSignDoes"
                            :key="item.title"
                            :delay="index * 40"
                        >
                            <div class="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 class="text-base font-bold text-gray-900">{{ item.title }}</h3>
                                <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ item.body }}</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section class="marketing-section-alt" aria-labelledby="how-signing-works">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Workflow"
                            title="How signing works"
                            description="The same editor powers guest self-sign and account workflows. After upload, you prepare fields, add a signature, then download or send."
                        />
                    </ScrollReveal>
                    <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ScrollReveal
                            v-for="(step, index) in journeySteps"
                            :key="step.title"
                            :delay="index * 30"
                        >
                            <li class="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">Step {{ index + 1 }}</p>
                                <h3 class="mt-2 text-sm font-bold text-gray-900">{{ step.title }}</h3>
                                <p class="mt-1.5 text-sm leading-relaxed text-gray-600">{{ step.description }}</p>
                            </li>
                        </ScrollReveal>
                    </ol>
                    <p class="mt-8 text-center text-sm text-gray-500">
                        Ready to try it?
                        <Link :href="route('sign.index')" class="font-medium text-blue-600 hover:text-blue-700">Upload a PDF</Link>
                        or read
                        <Link href="/help-center/how-to-sign-a-pdf-online" class="font-medium text-blue-600 hover:text-blue-700">How to sign a PDF online</Link>.
                    </p>
                </div>
            </section>

            <section class="marketing-section" aria-labelledby="use-cases">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Use cases"
                            title="Who CubSign is for"
                            description="Practical situations where a browser PDF signature is enough — without enterprise setup."
                        />
                    </ScrollReveal>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <ScrollReveal
                            v-for="(item, index) in useCases"
                            :key="item.title"
                            :delay="index * 30"
                        >
                            <div class="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 class="text-base font-bold text-gray-900">{{ item.title }}</h3>
                                <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ item.body }}</p>
                            </div>
                        </ScrollReveal>
                    </div>
                    <ScrollReveal class="mt-10" :delay="60">
                        <SocialProof compact />
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt" aria-label="Compare">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal class="mb-12">
                        <SectionHeader
                            eyebrow="Compare"
                            title="Why people choose CubSign over print-sign-scan"
                            description="A focused browser workflow instead of subscriptions and paper loops for everyday PDFs."
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <ComparisonSection />
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section" aria-label="Security and privacy">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Security"
                            title="Privacy and security, stated accurately"
                            description="CubSign protects documents with HTTPS and access controls. Read the Security Center for full detail."
                        />
                    </ScrollReveal>
                    <div class="grid gap-4 md:grid-cols-3">
                        <ScrollReveal
                            v-for="(item, index) in privacyPoints"
                            :key="item.title"
                            :delay="index * 40"
                        >
                            <div class="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 class="text-base font-bold text-gray-900">{{ item.title }}</h3>
                                <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ item.body }}</p>
                            </div>
                        </ScrollReveal>
                    </div>
                    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ScrollReveal
                            v-for="(card, index) in credibilityCards"
                            :key="card.title"
                            :delay="index * 30"
                        >
                            <div class="marketing-card-lift h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="card.icon" />
                                    </svg>
                                </div>
                                <h3 class="text-base font-bold text-gray-900">{{ card.title }}</h3>
                                <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ card.description }}</p>
                            </div>
                        </ScrollReveal>
                    </div>
                    <p class="mt-8 text-center text-sm text-gray-500">
                        <Link :href="route('security')" class="font-medium text-blue-600 hover:text-blue-700">Security Center</Link>
                        ·
                        <Link :href="route('privacy')" class="font-medium text-blue-600 hover:text-blue-700">Privacy Policy</Link>
                    </p>
                </div>
            </section>

            <section class="marketing-section-alt" aria-label="Explore CubSign">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader
                            eyebrow="Resources"
                            title="Helpful resources"
                            description="Product pages, security detail, and guides written for how CubSign actually works."
                        />
                    </ScrollReveal>
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ScrollReveal
                            v-for="(item, index) in resourceLinks"
                            :key="item.routeName"
                            :delay="index * 30"
                        >
                            <Link
                                :href="route(item.routeName)"
                                class="marketing-card-lift group block h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200"
                            >
                                <h3 class="text-sm font-bold text-gray-900 group-hover:text-blue-600">{{ item.label }}</h3>
                                <p class="mt-1.5 text-sm leading-relaxed text-gray-500">{{ item.description }}</p>
                                <span class="mt-4 inline-flex text-xs font-semibold text-blue-600">Open →</span>
                            </Link>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section class="marketing-section" aria-labelledby="home-faq-heading">
                <div class="mx-auto max-w-3xl">
                    <ScrollReveal class="mb-10 text-center">
                        <SectionHeader
                            eyebrow="FAQ"
                            title="Common questions"
                            description="Guest limits, what happens after upload, and how documents are protected."
                            align="center"
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <FaqAccordion :faqs="homeFaqs" show-all-link />
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt !pb-24">
                <div class="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <CtaBanner
                            eyebrow="Early Access"
                            title="Start signing PDFs in your browser"
                            description="Upload a PDF up to 25 MB, add your signature, and download the finished file. Free during Early Access."
                            :primary-label="CTA_START_SIGNING"
                            footer-note="Guest self-sign available · No credit card · Works on desktop and mobile"
                            variant="premium"
                        />
                    </ScrollReveal>
                    <p class="mt-6 text-center text-sm text-gray-500">
                        Need help choosing a workflow?
                        <Link :href="route('help-center')" class="font-medium text-blue-600 hover:text-blue-700">Visit the Help Center</Link>
                        or
                        <Link :href="route('contact')" class="font-medium text-blue-600 hover:text-blue-700">contact support</Link>.
                    </p>
                </div>
            </section>

            <StickyMobileCta />
        </div>
    </PublicLayout>
</template>
