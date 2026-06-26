<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import LegalToc from '@/Components/Marketing/LegalToc.vue';

const activeId = ref('');

const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'services', title: 'Description of Services' },
    { id: 'accounts', title: 'User Accounts' },
    { id: 'acceptable-use', title: 'Acceptable Use' },
    { id: 'documents', title: 'Documents & Signatures' },
    { id: 'ip', title: 'Intellectual Property' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'termination', title: 'Termination' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact' },
];

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeId.value = id;
}

let observer;
onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => { for (const e of entries) if (e.isIntersecting) activeId.value = e.target.id; },
        { rootMargin: '-80px 0px -60% 0px' },
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
    <MarketingSeo title="Terms of Service – CubSign" description="CubSign Terms of Service. Read the terms governing your use of our PDF signing platform." path="/terms" />

    <PublicLayout>
        <section class="px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-6xl">
                <div class="mb-10">
                    <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Terms of Service</h1>
                    <p class="mt-3 text-sm text-gray-500">Last updated: June 1, 2026</p>
                </div>

                <div class="grid gap-10 lg:grid-cols-4">
                    <aside class="hidden lg:block">
                        <div class="sticky top-24">
                            <LegalToc :sections="sections" :active-id="activeId" @navigate="scrollTo" />
                        </div>
                    </aside>

                    <article class="lg:col-span-3">
                        <p class="text-sm leading-relaxed text-gray-600">
                            These Terms of Service ("Terms") govern your access to and use of CubSign's website and services. By using CubSign, you agree to these Terms.
                        </p>

                        <section id="acceptance" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Acceptance of Terms</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">By accessing or using CubSign, you confirm that you are at least 18 years old and agree to be bound by these Terms and our Privacy Policy.</p>
                        </section>

                        <section id="services" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Description of Services</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">CubSign provides online PDF signing services including self-signing, multi-recipient signature requests, document storage, audit trails, and related features. Services are provided "as is" during Early Access.</p>
                        </section>

                        <section id="accounts" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">User Accounts</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access. You may use certain features without an account, but document storage and sending require registration.</p>
                        </section>

                        <section id="acceptable-use" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Acceptable Use</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">You agree not to:</p>
                            <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
                                <li>Use CubSign for illegal purposes or to sign fraudulent documents</li>
                                <li>Upload malware, viruses, or harmful content</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Resell or redistribute our services without permission</li>
                                <li>Harass, abuse, or harm other users</li>
                            </ul>
                        </section>

                        <section id="documents" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Documents & Signatures</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">You retain ownership of documents you upload. CubSign processes documents solely to provide signing services. Electronic signatures created through CubSign are intended to comply with applicable e-signature laws, but legal validity may vary by jurisdiction. You are responsible for ensuring your use meets local legal requirements.</p>
                        </section>

                        <section id="ip" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Intellectual Property</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">CubSign and its logos, design, and software are owned by Cubiz Infotech. You may not copy, modify, or distribute our intellectual property without written consent.</p>
                        </section>

                        <section id="liability" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Limitation of Liability</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">To the maximum extent permitted by law, CubSign shall not be liable for indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim (or $100 if using free services).</p>
                        </section>

                        <section id="termination" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Termination</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">We may suspend or terminate your account for violation of these Terms. You may delete your account at any time. Upon termination, your right to use the service ceases immediately.</p>
                        </section>

                        <section id="changes" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Changes to Terms</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">We may update these Terms from time to time. We will notify you of material changes via email or in-app notice. Continued use after changes constitutes acceptance.</p>
                        </section>

                        <section id="contact" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Contact</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">Questions about these Terms? Contact <a href="mailto:legal@cubsign.com" class="text-blue-600 hover:text-blue-700">legal@cubsign.com</a>.</p>
                        </section>
                    </article>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
