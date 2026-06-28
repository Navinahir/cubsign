<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import StickyMobileCta from '@/Components/StickyMobileCta.vue';
import MarketingHero from '@/Components/Marketing/MarketingHero.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';
import ComparisonSection from '@/Components/Marketing/ComparisonSection.vue';
import SocialProof from '@/Components/Marketing/SocialProof.vue';

defineProps({ hasSignSession: { type: Boolean, default: false } });
</script>

<template>
    <MarketingSeo
        title="CubSign – Upload & Sign PDFs Online Free"
        description="Upload your PDF and sign it online in seconds. Add your signature and download the finished document. No account required."
        path="/"
        type="website"
    />

    <PublicLayout>
        <div class="pb-20 md:pb-0">
            <MarketingHero :has-sign-session="hasSignSession" />

            <section class="marketing-section">
                <div class="mx-auto max-w-5xl">
                    <ScrollReveal class="mb-12">
                        <SectionHeader
                            eyebrow="Compare"
                            title="Why choose CubSign?"
                            description="Simple, free PDF signing without the usual limits and subscriptions."
                        />
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <ComparisonSection />
                    </ScrollReveal>
                </div>
            </section>

            <section class="marketing-section-alt !pb-20 lg:!pb-28">
                <div class="mx-auto max-w-6xl">
                    <ScrollReveal class="mb-10">
                        <SectionHeader eyebrow="Trusted by" title="Used by freelancers, teams, and small businesses" />
                    </ScrollReveal>
                    <ScrollReveal :delay="60"><SocialProof compact /></ScrollReveal>
                </div>
            </section>

            <StickyMobileCta />
        </div>
    </PublicLayout>
</template>
