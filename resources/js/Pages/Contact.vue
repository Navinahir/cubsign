<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import DecorativeBg from '@/Components/Marketing/DecorativeBg.vue';
import { SUPPORT_EMAIL } from '@/constants/marketing';

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
    <MarketingSeo title="Contact Us – CubSign" description="Get in touch with the CubSign team. We're here to help during Early Access." path="/contact" />

    <PublicLayout>
        <section class="marketing-gradient-hero relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
            <DecorativeBg pattern="dots" />
            <div class="relative mx-auto max-w-2xl text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Get in Touch</h1>
                <p class="mx-auto mt-4 max-w-lg text-lg text-gray-600">Questions, feedback, or need help? Send us a message. We are a small team and read every note during Early Access.</p>
            </div>
        </section>

        <section class="marketing-section">
            <div class="mx-auto grid max-w-4xl gap-8 lg:grid-cols-5">
                <ScrollReveal class="lg:col-span-3">
                    <div v-if="submitted" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center" role="status">
                        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                            <svg class="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <h2 class="mt-5 text-xl font-bold text-gray-900">Message Sent!</h2>
                        <p class="mt-2 text-sm text-gray-600">We'll get back to you as soon as we can.</p>
                        <button type="button" class="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700" @click="submitted=false; form={name:'',email:'',subject:'',message:''}">Send another message</button>
                    </div>
                    <form v-else class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm" @submit.prevent="handleSubmit" novalidate>
                        <h2 class="mb-6 text-lg font-semibold text-gray-900">Send us a message</h2>
                        <div class="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Name <span class="text-red-500">*</span></label>
                                <input id="name" v-model="form.name" type="text" autocomplete="name" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
                                <input id="email" v-model="form.email" type="email" autocomplete="email" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
                            </div>
                        </div>
                        <div class="mt-5">
                            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                            <input id="subject" v-model="form.subject" type="text" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div class="mt-5">
                            <label for="message" class="block text-sm font-medium text-gray-700">Message <span class="text-red-500">*</span></label>
                            <textarea id="message" v-model="form.message" rows="5" class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                            <p v-if="errors.message" class="mt-1 text-xs text-red-500">{{ errors.message }}</p>
                        </div>
                        <button type="submit" class="marketing-btn-ripple mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Send Message</button>
                    </form>
                </ScrollReveal>

                <div class="space-y-6 lg:col-span-2">
                    <ScrollReveal :delay="60">
                        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 class="font-semibold text-gray-900">Support</h2>
                            <p class="mt-2 text-sm text-gray-600">For help with signing, accounts, or general questions:</p>
                            <a :href="`mailto:${SUPPORT_EMAIL}`" class="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">{{ SUPPORT_EMAIL }}</a>
                            <p class="mt-4 text-xs text-gray-400">Typical response within 1–2 business days during Early Access.</p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal :delay="120">
                        <Link :href="route('faq')" class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-blue-600 shadow-sm hover:border-blue-200 hover:bg-blue-50">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Check our FAQ first
                        </Link>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
