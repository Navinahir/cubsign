<script setup>
import { computed, ref } from 'vue';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import MarketingSeo from '@/Components/MarketingSeo.vue';
import { Link } from '@inertiajs/vue3';
import {
    EARLY_ACCESS_HEADLINE,
    btnPrimary,
    pageHeaderClass,
} from '@/constants/marketing';

const searchQuery = ref('');

const categories = [
    {
        title: 'Getting Started',
        items: [
            {
                question: 'What is CubSign?',
                answer: 'CubSign is a browser-based PDF signing product. Upload a PDF, place a signature (draw, type, or upload an image), download the signed file, or send it to others for signature. No software installation required.',
            },
            {
                question: 'Do I need to create an account?',
                answer: 'You can complete one self-sign session without an account. Creating a free account unlocks continued signing, document storage, templates, send-for-signature, and activity history.',
            },
            {
                question: 'Is CubSign free to use?',
                answer: 'Yes. CubSign is free during Early Access. No credit card is required.',
            },
            {
                question: 'Why is CubSign free?',
                answer: 'We are in Early Access and collecting feedback on real signing workflows before introducing paid plans. No plans or prices are published yet.',
            },
            {
                question: 'What file formats are supported?',
                answer: 'CubSign accepts PDF files only, up to 25 MB per upload.',
            },
        ],
    },
    {
        title: 'Signing & Documents',
        items: [
            {
                question: 'How do I sign a document?',
                answer: 'Go to Upload PDF, choose a PDF, open the editor, place fields (signature, initials, name, text, date, or checkbox), create your signature, then download. Account holders can also send the document for others to sign.',
            },
            {
                question: 'What types of signatures are supported?',
                answer: 'Draw on a canvas, type in a signature-style font, or upload a signature image. The signature applies to the current document session; CubSign does not offer a permanent cross-document signature vault.',
            },
            {
                question: 'How do I send a document for someone else to sign?',
                answer: 'Sign in, upload or open a PDF, add recipient email addresses, place fields for each signer, and send. Each recipient gets a unique email link and can sign without a CubSign account.',
            },
            {
                question: 'Do recipients need a CubSign account to sign?',
                answer: 'No. Recipients open a unique signing link from email and complete their fields without registering.',
            },
        ],
    },
    {
        title: 'Security & Legal',
        items: [
            {
                question: 'Are my documents secure?',
                answer: 'Traffic uses HTTPS. Account documents are stored on private server storage with access limited to owners and invited recipients. See the Security Center for authentication, passwords, and disclosure. CubSign does not claim AES-256 encryption at rest.',
            },
            {
                question: 'Are CubSign signatures legally binding?',
                answer: 'Electronic signatures are widely recognized when parties intend to sign and consent to transact electronically. CubSign helps you capture signatures and related activity for sent documents. You remain responsible for whether an e-signature is appropriate for your document and jurisdiction. CubSign does not provide legal advice.',
            },
            {
                question: 'What is the activity history (audit trail)?',
                answer: 'For documents you send, CubSign logs key events such as invitations, recipient signatures, and completion, with timestamps in your workspace. The user-facing activity history does not claim page-view logging or IP addresses.',
            },
            {
                question: 'Can I delete my documents?',
                answer: 'Yes. Account holders can delete documents from the workspace. Deletion follows the Privacy Policy.',
            },
        ],
    },
    {
        title: 'Early Access & Pricing',
        items: [
            {
                question: "What's included during early access?",
                answer: 'Self-sign, guest one-session signing, account storage, templates, multi-recipient send, activity history, and PDF downloads — all free. Limits: PDF only, 25 MB, guest one session.',
            },
            {
                question: 'Will CubSign always be free?',
                answer: 'CubSign is free during Early Access. Paid plans may come later with advance notice. There is no billing today and nothing to cancel.',
            },
            {
                question: 'When will paid plans be available?',
                answer: 'No launch date is published. Account holders will be notified before any paid plans begin.',
            },
            {
                question: 'Do I need a credit card?',
                answer: 'No. Early Access requires no credit card.',
            },
        ],
    },
];

const filteredCategories = computed(() => {
    if (!searchQuery.value.trim()) return categories;
    const q = searchQuery.value.toLowerCase();
    return categories
        .map((cat) => ({
            ...cat,
            items: cat.items.filter(
                (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
            ),
        }))
        .filter((cat) => cat.items.length > 0);
});

const faqSchema = computed(() =>
    categories.flatMap((category) => category.items),
);

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
    <MarketingSeo
        title="FAQ — CubSign | Free PDF Signing Help"
        description="Answers about CubSign PDF signing, guest vs account limits, security, activity history, and free Early Access."
        path="/faq"
        :faq-schema="faqSchema"
    />

    <PublicLayout>
        <section :class="pageHeaderClass">
            <div class="mx-auto max-w-2xl">
                <span class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    {{ EARLY_ACCESS_HEADLINE }}
                </span>
                <h1 class="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Frequently asked questions
                </h1>
                <p class="mt-5 text-lg text-gray-500">
                    Product answers for how CubSign works today.
                    Prefer step-by-step guides?
                    <Link :href="route('help-center')" class="text-blue-600 hover:underline">Open the Help Center</Link>
                    or
                    <Link :href="route('security')" class="text-blue-600 hover:underline">Security Center</Link>.
                </p>
            </div>
        </section>

        <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl">
                <div class="mb-10">
                    <label for="faq-page-search" class="sr-only">Search FAQ</label>
                    <div class="relative">
                        <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input id="faq-page-search" v-model="searchQuery" type="search" placeholder="Search questions..." class="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <p v-if="searchQuery && filteredCategories.length === 0" class="mt-4 text-center text-sm text-gray-500">No matching questions found.</p>
                </div>

                <div class="space-y-14">
                <div v-for="(category, categoryIndex) in filteredCategories" :key="category.title">
                    <h2 class="mb-6 text-lg font-bold text-gray-900">{{ category.title }}</h2>

                    <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                        <div v-for="(item, itemIndex) in category.items" :key="itemIndex">
                            <button
                                type="button"
                                class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white"
                                @click="toggle(categoryIndex, itemIndex)"
                            >
                                <span class="pr-4 text-sm font-semibold text-gray-900">{{ item.question }}</span>
                                <svg
                                    :class="[
                                        'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200',
                                        isOpen(categoryIndex, itemIndex) ? 'rotate-180' : '',
                                    ]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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
            </div>
        </section>

        <section class="bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
            <div class="mx-auto max-w-xl">
                <h2 class="text-2xl font-bold text-gray-900">Still have questions?</h2>
                <p class="mt-3 text-gray-500">
                    Browse product guides or email the CubSign team.
                </p>
                <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link :href="route('help-center')" :class="[btnPrimary, 'w-full sm:w-auto']">
                        Browse Help Center
                    </Link>
                    <Link :href="route('contact')" class="w-full rounded-xl border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto">
                        Contact Support
                    </Link>
                </div>
            </div>
        </section>
    </PublicLayout>
</template>
