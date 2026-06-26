<script setup>
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import LegalPageLayout from '@/Components/Marketing/LegalPageLayout.vue';

const sections = [
    { id: 'collection', title: 'Information We Collect', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'cookies', title: 'Cookies', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'usage', title: 'How We Use Your Data', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
    { id: 'retention', title: 'Data Retention', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'security', title: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'third-party', title: 'Third-Party Services', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' },
    { id: 'rights', title: 'Your Rights', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'contact', title: 'Contact Us', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];
</script>

<template>
    <MarketingSeo title="Privacy Policy – CubSign" description="CubSign Privacy Policy. Learn how we collect, use, and protect your personal information." path="/privacy" />

    <PublicLayout>
        <LegalPageLayout title="Privacy Policy" description="How CubSign collects, uses, and protects your personal information." updated="June 1, 2026" badge="Legal" :sections="sections">
            <p class="text-base leading-relaxed text-gray-600">CubSign ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>

            <section id="collection" class="mt-12 scroll-mt-28">
                <div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50"><svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div><h2 class="text-xl font-bold text-gray-900">Information We Collect</h2></div>
                <ul class="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-gray-600">
                    <li>Account information (name, email address, password)</li>
                    <li>Documents you upload for signing</li>
                    <li>Signature data (drawn, typed, or uploaded)</li>
                    <li>Communications with our support team</li>
                    <li>Usage data (pages visited, features used, device information)</li>
                </ul>
            </section>

            <section id="cookies" class="mt-12 scroll-mt-28">
                <div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50"><svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div><h2 class="text-xl font-bold text-gray-900">Cookies</h2></div>
                <p class="mt-4 text-base leading-relaxed text-gray-600">We use cookies to maintain your session and analyze site usage. See our <a href="/cookies" class="text-blue-600 hover:text-blue-700">Cookie Policy</a> for details.</p>
            </section>

            <section id="usage" class="mt-12 scroll-mt-28">
                <div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50"><svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg></div><h2 class="text-xl font-bold text-gray-900">How We Use Your Data</h2></div>
                <ul class="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-gray-600">
                    <li>Provide, maintain, and improve our signing services</li>
                    <li>Process documents and facilitate electronic signatures</li>
                    <li>Send transactional emails and respond to support requests</li>
                    <li>Detect and prevent fraud or abuse</li>
                </ul>
            </section>

            <section id="retention" class="mt-12 scroll-mt-28">
                <h2 class="text-xl font-bold text-gray-900">Data Retention</h2>
                <p class="mt-4 text-base leading-relaxed text-gray-600">We retain your data for as long as your account is active. Upon deletion, personal data is removed within 30 days except where required by law.</p>
            </section>

            <section id="security" class="mt-12 scroll-mt-28">
                <h2 class="text-xl font-bold text-gray-900">Security</h2>
                <p class="mt-4 text-base leading-relaxed text-gray-600">AES-256 encryption at rest, TLS 1.3 in transit, and access controls protect your documents. See our <Link :href="route('terms')" class="text-blue-600 hover:text-blue-700">Terms of Service</Link> for full details.</p>
            </section>

            <section id="third-party" class="mt-12 scroll-mt-28">
                <h2 class="text-xl font-bold text-gray-900">Third-Party Services</h2>
                <p class="mt-4 text-base leading-relaxed text-gray-600">We use third-party services for hosting, email delivery, analytics, and authentication under strict data processing agreements.</p>
            </section>

            <section id="rights" class="mt-12 scroll-mt-28">
                <h2 class="text-xl font-bold text-gray-900">Your Rights</h2>
                <p class="mt-4 text-base leading-relaxed text-gray-600">You may access, correct, delete, or export your data depending on your jurisdiction. Contact us to exercise these rights.</p>
            </section>

            <section id="contact" class="mt-12 scroll-mt-28">
                <h2 class="text-xl font-bold text-gray-900">Contact Us</h2>
                <p class="mt-4 text-base leading-relaxed text-gray-600">Email <a href="mailto:privacy@cubsign.com" class="text-blue-600 hover:text-blue-700">privacy@cubsign.com</a> or visit our <a href="/contact" class="text-blue-600 hover:text-blue-700">Contact page</a>.</p>
            </section>
        </LegalPageLayout>
    </PublicLayout>
</template>
