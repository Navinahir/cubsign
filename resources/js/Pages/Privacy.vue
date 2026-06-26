<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import LegalToc from '@/Components/Marketing/LegalToc.vue';

const activeId = ref('');

const sections = [
    { id: 'collection', title: 'Information We Collect' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'usage', title: 'How We Use Your Data' },
    { id: 'retention', title: 'Data Retention' },
    { id: 'security', title: 'Security' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'contact', title: 'Contact Us' },
];

function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        activeId.value = id;
    }
}

let observer;
onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) activeId.value = entry.target.id;
            }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
    });
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
    <MarketingSeo title="Privacy Policy – CubSign" description="CubSign Privacy Policy. Learn how we collect, use, and protect your personal information." path="/privacy" />

    <PublicLayout>
        <section class="px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-6xl">
                <div class="mb-10">
                    <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Privacy Policy</h1>
                    <p class="mt-3 text-sm text-gray-500">Last updated: June 1, 2026</p>
                </div>

                <div class="grid gap-10 lg:grid-cols-4">
                    <aside class="hidden lg:col-span-1 lg:block">
                        <div class="sticky top-24">
                            <LegalToc :sections="sections" :active-id="activeId" @navigate="scrollTo" />
                        </div>
                    </aside>

                    <article class="prose-sm lg:col-span-3">
                        <p class="text-sm leading-relaxed text-gray-600">
                            CubSign ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at cubsign.com.
                        </p>

                        <section id="collection" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Information We Collect</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">We collect information you provide directly, including:</p>
                            <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
                                <li>Account information (name, email address, password)</li>
                                <li>Documents you upload for signing</li>
                                <li>Signature data (drawn, typed, or uploaded)</li>
                                <li>Communications with our support team</li>
                                <li>Usage data (pages visited, features used, device information)</li>
                            </ul>
                        </section>

                        <section id="cookies" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Cookies</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">
                                We use cookies and similar technologies to maintain your session, remember preferences, and analyze site usage. You can control cookies through your browser settings. See our <a href="/cookies" class="text-blue-600 hover:text-blue-700">Cookie Policy</a> for details.
                            </p>
                        </section>

                        <section id="usage" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">How We Use Your Data</h2>
                            <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
                                <li>Provide, maintain, and improve our signing services</li>
                                <li>Process documents and facilitate electronic signatures</li>
                                <li>Send transactional emails (signing invitations, confirmations)</li>
                                <li>Respond to support requests</li>
                                <li>Detect and prevent fraud or abuse</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section id="retention" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Data Retention</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">
                                We retain your account data and documents for as long as your account is active or as needed to provide services. You may delete documents at any time. Upon account deletion, we remove your personal data within 30 days, except where retention is required by law.
                            </p>
                        </section>

                        <section id="security" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Security</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">
                                We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, access controls, and regular security audits. No method of transmission over the Internet is 100% secure, but we strive to protect your data.
                            </p>
                        </section>

                        <section id="third-party" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Third-Party Services</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">
                                We may use third-party services for hosting, email delivery, analytics, and authentication (e.g., Google OAuth). These providers process data on our behalf under strict data processing agreements.
                            </p>
                        </section>

                        <section id="rights" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Your Rights</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">Depending on your jurisdiction, you may have the right to:</p>
                            <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
                                <li>Access and receive a copy of your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to or restrict processing</li>
                                <li>Data portability</li>
                            </ul>
                        </section>

                        <section id="contact" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Contact Us</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">
                                For privacy-related questions, contact us at <a href="mailto:privacy@cubsign.com" class="text-blue-600 hover:text-blue-700">privacy@cubsign.com</a> or visit our <a href="/contact" class="text-blue-600 hover:text-blue-700">Contact page</a>.
                            </p>
                        </section>
                    </article>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
