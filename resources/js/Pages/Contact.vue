<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';

const form = ref({ name: '', email: '', subject: '', message: '' });
const submitted = ref(false);
const errors = ref({});

const supportCards = [
    { title: 'Sales', description: 'Questions about plans, enterprise, or partnerships.', email: 'sales@cubsign.com', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Support', description: 'Help with your account, documents, or signing.', email: 'support@cubsign.com', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Technical Help', description: 'API, integrations, or technical issues.', email: 'tech@cubsign.com', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { title: 'Partnerships', description: 'Reseller, affiliate, or integration partnerships.', email: 'partners@cubsign.com', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
];

const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/cubsign' },
    { label: 'Twitter', href: 'https://twitter.com/cubsign' },
    { label: 'GitHub', href: 'https://github.com/cubsign' },
];

function validate() {
    errors.value = {};
    if (!form.value.name.trim()) errors.value.name = 'Name is required.';
    if (!form.value.email.trim()) errors.value.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Enter a valid email.';
    if (!form.value.message.trim()) errors.value.message = 'Message is required.';
    return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
    if (!validate()) return;
    submitted.value = true;
}
</script>

<template>
    <MarketingSeo title="Contact Us – CubSign" description="Get in touch with the CubSign team for support, sales, or partnerships." path="/contact" />

    <PublicLayout>
        <section class="marketing-gradient-hero relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
            <DecorativeBg pattern="dots" />
            <div class="relative mx-auto max-w-4xl text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Get in Touch</h1>
                <p class="mx-auto mt-4 max-w-xl text-lg text-gray-600">We're here to help. Expected response time: <strong class="text-gray-900">under 2 hours</strong> during business hours.</p>
            </div>
        </section>

        <!-- Support cards -->
        <section class="marketing-section">
            <div class="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <ScrollReveal v-for="(card, i) in supportCards" :key="card.title" :delay="i * 50" class="marketing-card-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="card.icon"/></svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">{{ card.title }}</h3>
                    <p class="mt-1 text-sm text-gray-500">{{ card.description }}</p>
                    <a :href="`mailto:${card.email}`" class="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">{{ card.email }}</a>
                </ScrollReveal>
            </div>
        </section>

        <section class="marketing-section-alt">
            <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5">
                <div class="space-y-6 lg:col-span-2">
                    <ScrollReveal>
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 class="font-semibold text-gray-900">Office Address</h2>
                            <p class="mt-2 text-sm text-gray-600">Cubiz Infotech<br />Ahmedabad, Gujarat<br />India — 380015</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal :delay="60">
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 class="font-semibold text-gray-900">Business Hours</h2>
                            <p class="mt-2 text-sm text-gray-600">Monday – Friday<br />9:00 AM – 6:00 PM IST<br />Saturday – Sunday: Closed</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal :delay="120">
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 class="font-semibold text-gray-900">Social</h2>
                            <div class="mt-3 flex flex-wrap gap-3">
                                <a v-for="s in socialLinks" :key="s.label" :href="s.href" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ s.label }}</a>
                            </div>
                        </div>
                    </ScrollReveal>
                    <Link :href="route('faq')" class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Check our FAQ first
                    </Link>
                </div>

                <ScrollReveal :delay="80" class="lg:col-span-3">
                    <div v-if="submitted" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center" role="status">
                        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                            <svg class="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <h2 class="mt-5 text-xl font-bold text-gray-900">Message Sent!</h2>
                        <p class="mt-2 text-sm text-gray-600">We'll respond within 1–2 business hours.</p>
                        <button type="button" class="mt-6 text-sm font-medium text-blue-600" @click="submitted=false; form={name:'',email:'',subject:'',message:''}">Send another message</button>
                    </div>
                    <form v-else class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" @submit.prevent="handleSubmit" novalidate>
                        <h2 class="mb-6 text-lg font-semibold text-gray-900">Send us a message</h2>
                        <div class="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Name <span class="text-red-500">*</span></label>
                                <input id="name" v-model="form.name" type="text" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
                                <input id="email" v-model="form.email" type="email" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
                            </div>
                        </div>
                        <div class="mt-5">
                            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                            <input id="subject" v-model="form.subject" type="text" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div class="mt-5">
                            <label for="message" class="block text-sm font-medium text-gray-700">Message <span class="text-red-500">*</span></label>
                            <textarea id="message" v-model="form.message" rows="5" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                            <p v-if="errors.message" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
                        </div>
                        <button type="submit" class="marketing-btn-ripple mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Send Message</button>
                    </form>
                </ScrollReveal>
            </div>

            <!-- Map -->
            <ScrollReveal class="mx-auto mt-12 max-w-6xl">
                <div class="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white shadow-sm">
                    <div class="text-center">
                        <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <p class="mt-3 text-sm font-medium text-gray-500">Ahmedabad, Gujarat, India</p>
                        <p class="text-xs text-gray-400">Google Maps integration coming soon</p>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    </PublicLayout>
</template>
