<script setup>
import { ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

const categories = [
    {
        title: 'Getting Started',
        items: [
            {
                question: 'What is CubSign?',
                answer: 'CubSign is a web-based PDF signing platform that lets you sign documents yourself or send them to others for signature. It\'s designed to be fast, secure, and simple — no software installation required.',
            },
            {
                question: 'Do I need to create an account?',
                answer: 'You need an account to upload and manage your documents. However, recipients you send documents to for signature do not need a CubSign account — they can sign directly from a secure email link.',
            },
            {
                question: 'Is CubSign free to use?',
                answer: 'Yes. CubSign offers a free plan that includes 3 signed documents per month at no charge. No credit card is required to get started.',
            },
            {
                question: 'What file formats are supported?',
                answer: 'CubSign currently supports PDF files. Support for additional file formats is planned for a future release.',
            },
        ],
    },
    {
        title: 'Signing & Documents',
        items: [
            {
                question: 'How do I sign a document?',
                answer: 'Upload your PDF, place your signature on the required fields using our drag-and-drop editor, and download the signed copy. The entire process takes under a minute.',
            },
            {
                question: 'What types of signatures are supported?',
                answer: 'You can draw your signature on a canvas, type it in a handwriting-style font, or upload an existing signature image. All methods produce a legally valid signature.',
            },
            {
                question: 'How do I send a document for someone else to sign?',
                answer: 'Upload your document, add the recipient\'s email address, place the signature fields, and click Send. Your recipient will receive a secure email with a link to review and sign the document.',
            },
            {
                question: 'Do recipients need a CubSign account to sign?',
                answer: 'No. Recipients receive a secure signing link by email and can sign without creating an account. This makes it easy for clients, partners, or anyone to sign without friction.',
            },
        ],
    },
    {
        title: 'Security & Legal',
        items: [
            {
                question: 'Are my documents secure?',
                answer: 'Yes. All documents are stored securely with industry-standard encryption. Access is restricted to authorized users only, and all data is transmitted over HTTPS.',
            },
            {
                question: 'Are CubSign signatures legally binding?',
                answer: 'CubSign produces electronic signatures that comply with widely accepted e-signature standards. Each signed document includes a full audit trail with timestamps and IP addresses to support legal validity.',
            },
            {
                question: 'What is the audit trail?',
                answer: 'Every action on a document is logged — who viewed it, who signed it, and when. The audit trail includes timestamps and IP addresses, making your documents verifiable and legally defensible.',
            },
            {
                question: 'Can I delete my documents?',
                answer: 'Yes. You can delete any document from your workspace at any time. Deleted documents are permanently removed from our servers.',
            },
        ],
    },
    {
        title: 'Plans & Billing',
        items: [
            {
                question: 'What\'s included in the free plan?',
                answer: 'The free plan includes 3 documents per month, self-sign functionality, and the ability to download signed PDFs. No credit card required.',
            },
            {
                question: 'When will the Pro and Founder plans be available?',
                answer: 'Pro and Founder plans are coming soon. Sign up for the free plan to be notified when they launch. Founder pricing is a limited one-time offer for early adopters.',
            },
            {
                question: 'What is the Founder plan?',
                answer: 'The Founder plan is a one-time lifetime deal for early adopters. Pay once and get Pro-level access forever — including all future features — at a fixed price.',
            },
            {
                question: 'Can I upgrade or downgrade my plan later?',
                answer: 'Yes. You can change your plan at any time from your workspace billing settings. Upgrades take effect immediately.',
            },
        ],
    },
];

const openItem = ref(null);

function toggle(categoryIndex, itemIndex) {
    const key = `${categoryIndex}-${itemIndex}`;
    openItem.value = openItem.value === key ? null : key;
}

function isOpen(categoryIndex, itemIndex) {
    return openItem.value === `${categoryIndex}-${itemIndex}`;
}
</script>

<template>
    <Head title="FAQ — CubSign" />

    <PublicLayout>
        <!-- Header -->
        <section class="bg-gradient-to-b from-white to-gray-50 px-4 py-20 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl">
                <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">FAQ</span>
                <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Frequently asked questions
                </h1>
                <p class="mt-5 text-lg text-gray-500">
                    Everything you need to know about CubSign. Can't find your answer?
                    <a href="mailto:support@cubsign.com" class="text-blue-600 hover:underline">Contact support.</a>
                </p>
            </div>
        </section>

        <!-- FAQ content -->
        <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl space-y-14">
                <div v-for="(category, categoryIndex) in categories" :key="category.title">
                    <h2 class="mb-6 text-lg font-bold text-gray-900">{{ category.title }}</h2>

                    <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-gray-50">
                        <div v-for="(item, itemIndex) in category.items" :key="itemIndex">
                            <button
                                type="button"
                                class="flex w-full items-center justify-between px-6 py-5 text-left"
                                @click="toggle(categoryIndex, itemIndex)"
                            >
                                <span class="pr-4 text-sm font-semibold text-gray-900">{{ item.question }}</span>
                                <svg
                                    :class="[
                                        'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200',
                                        isOpen(categoryIndex, itemIndex) ? 'rotate-180' : '',
                                    ]"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <Transition
                                enter-active-class="transition-all duration-200 ease-out"
                                enter-from-class="opacity-0"
                                enter-to-class="opacity-100"
                                leave-active-class="transition-all duration-150 ease-in"
                                leave-from-class="opacity-100"
                                leave-to-class="opacity-0"
                            >
                                <div v-if="isOpen(categoryIndex, itemIndex)" class="px-6 pb-5 text-sm leading-relaxed text-gray-500">
                                    {{ item.answer }}
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-xl">
                <h2 class="text-2xl font-bold text-gray-900">Still have questions?</h2>
                <p class="mt-3 text-gray-500">
                    Reach out to our support team — we're happy to help.
                </p>
                <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        :href="route('register')"
                        class="w-full rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                    >
                        Get Started Free
                    </Link>
                    <a
                        href="mailto:support@cubsign.com"
                        class="w-full rounded-xl border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 sm:w-auto"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
