<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import LegalToc from '@/Components/Marketing/LegalToc.vue';

const activeId = ref('');
const sections = [
    { id: 'what-are-cookies', title: 'What Are Cookies' },
    { id: 'cookies-we-use', title: 'Cookies We Use' },
    { id: 'managing-cookies', title: 'Managing Cookies' },
    { id: 'third-party-cookies', title: 'Third-Party Cookies' },
    { id: 'updates', title: 'Policy Updates' },
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
    <MarketingSeo title="Cookie Policy – CubSign" description="Learn how CubSign uses cookies and similar technologies on our website." path="/cookies" />

    <PublicLayout>
        <section class="px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-6xl">
                <div class="mb-10">
                    <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">Cookie Policy</h1>
                    <p class="mt-3 text-sm text-gray-500">Last updated: June 1, 2026</p>
                </div>

                <div class="grid gap-10 lg:grid-cols-4">
                    <aside class="hidden lg:block">
                        <div class="sticky top-24">
                            <LegalToc :sections="sections" :active-id="activeId" @navigate="scrollTo" />
                        </div>
                    </aside>

                    <article class="lg:col-span-3">
                        <section id="what-are-cookies" class="scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">What Are Cookies</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site.</p>
                        </section>

                        <section id="cookies-we-use" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Cookies We Use</h2>
                            <div class="mt-4 overflow-x-auto rounded-xl border border-gray-200">
                                <table class="w-full min-w-[400px] text-sm">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-3 text-left font-medium text-gray-700">Cookie</th>
                                            <th class="px-4 py-3 text-left font-medium text-gray-700">Purpose</th>
                                            <th class="px-4 py-3 text-left font-medium text-gray-700">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100">
                                        <tr><td class="px-4 py-3 text-gray-700">cubsign_session</td><td class="px-4 py-3 text-gray-600">Authentication & session management</td><td class="px-4 py-3 text-gray-600">Session</td></tr>
                                        <tr><td class="px-4 py-3 text-gray-700">XSRF-TOKEN</td><td class="px-4 py-3 text-gray-600">Security (CSRF protection)</td><td class="px-4 py-3 text-gray-600">Session</td></tr>
                                        <tr><td class="px-4 py-3 text-gray-700">remember_web</td><td class="px-4 py-3 text-gray-600">Keep you logged in</td><td class="px-4 py-3 text-gray-600">5 years</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="managing-cookies" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Managing Cookies</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">You can control cookies through your browser settings. Note that disabling essential cookies may affect site functionality, including the ability to sign in or upload documents.</p>
                        </section>

                        <section id="third-party-cookies" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Third-Party Cookies</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">We may use third-party services (e.g., Google OAuth) that set their own cookies. We do not control these cookies. Please review the respective privacy policies of these providers.</p>
                        </section>

                        <section id="updates" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Policy Updates</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">We may update this Cookie Policy periodically. Changes will be posted on this page with an updated date.</p>
                        </section>

                        <section id="contact" class="mt-10 scroll-mt-24">
                            <h2 class="text-xl font-bold text-gray-900">Contact</h2>
                            <p class="mt-3 text-sm leading-relaxed text-gray-600">Questions? Email <a href="mailto:privacy@cubsign.com" class="text-blue-600 hover:text-blue-700">privacy@cubsign.com</a>.</p>
                        </section>
                    </article>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
