<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';

const form = ref({ name: '', email: '', subject: '', message: '' });
const submitted = ref(false);
const errors = ref({});

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
    <MarketingSeo title="Contact Us – CubSign" description="Get in touch with the CubSign team. We're here to help with questions, feedback, and support." path="/contact" />

    <PublicLayout>
        <section class="marketing-gradient-hero px-4 py-14 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Get in Touch</h1>
                <p class="mx-auto mt-4 max-w-xl text-lg text-gray-600">Have a question or feedback? We'd love to hear from you.</p>
            </div>
        </section>

        <section class="px-4 pb-16 sm:px-6 lg:px-8">
            <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5">
                <!-- Contact info -->
                <div class="space-y-8 lg:col-span-2">
                    <ScrollReveal>
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 class="font-semibold text-gray-900">Email</h2>
                            <a href="mailto:support@cubsign.com" class="mt-2 block text-sm text-blue-600 hover:text-blue-700">support@cubsign.com</a>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal :delay="80">
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 class="font-semibold text-gray-900">Business Hours</h2>
                            <p class="mt-2 text-sm text-gray-600">Monday – Friday<br />9:00 AM – 6:00 PM (IST)</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal :delay="160">
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 class="font-semibold text-gray-900">Office</h2>
                            <p class="mt-2 text-sm text-gray-600">Cubiz Infotech<br />Ahmedabad, Gujarat, India</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal :delay="240">
                        <Link :href="route('faq')" class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Check our FAQ first
                        </Link>
                    </ScrollReveal>
                </div>

                <!-- Form -->
                <ScrollReveal :delay="100" class="lg:col-span-3">
                    <div v-if="submitted" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center" role="status">
                        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                            <svg class="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 class="mt-5 text-xl font-bold text-gray-900">Message Sent!</h2>
                        <p class="mt-2 text-sm text-gray-600">Thank you for reaching out. We'll get back to you within 1–2 business days.</p>
                        <button type="button" class="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700" @click="submitted = false; form = { name: '', email: '', subject: '', message: '' }">Send another message</button>
                    </div>

                    <form v-else class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" @submit.prevent="handleSubmit" novalidate>
                        <div class="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Name <span class="text-red-500">*</span></label>
                                <input id="name" v-model="form.name" type="text" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" :aria-invalid="!!errors.name" />
                                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
                                <input id="email" v-model="form.email" type="email" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" :aria-invalid="!!errors.email" />
                                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
                            </div>
                        </div>
                        <div class="mt-5">
                            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                            <input id="subject" v-model="form.subject" type="text" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div class="mt-5">
                            <label for="message" class="block text-sm font-medium text-gray-700">Message <span class="text-red-500">*</span></label>
                            <textarea id="message" v-model="form.message" rows="5" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" :aria-invalid="!!errors.message" />
                            <p v-if="errors.message" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
                        </div>
                        <button type="submit" class="marketing-btn-ripple mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 sm:w-auto">
                            Send Message
                        </button>
                    </form>
                </ScrollReveal>
            </div>

            <!-- Map placeholder -->
            <ScrollReveal class="mx-auto mt-12 max-w-6xl">
                <div class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                    <div class="text-center">
                        <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <p class="mt-3 text-sm text-gray-400">Map placeholder — Ahmedabad, India</p>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    </PublicLayout>
</template>
