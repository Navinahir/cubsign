<script setup>
import ScrollReveal from '@/Components/Marketing/ScrollReveal.vue';
import ProductMockup from '@/Components/Marketing/ProductMockup.vue';
import SectionHeader from '@/Components/Marketing/SectionHeader.vue';

const screens = [
    { variant: 'dashboard', title: 'Document Dashboard', description: 'Track all your documents, statuses, and signing progress in one place.' },
    { variant: 'editor', title: 'PDF Editor', description: 'Drag-and-drop signature fields onto any page with our intuitive editor.' },
    { variant: 'signature', title: 'Signature Creation', description: 'Draw, type, or upload your signature — reuse it across documents.' },
    { variant: 'request', title: 'Request Signatures', description: 'Add recipients, assign fields, and send secure signing invitations.' },
    { variant: 'review', title: 'Review & Send', description: 'Double-check every field and recipient before sending for signature.' },
    { variant: 'complete', title: 'Download Signed PDF', description: 'Get your legally signed document instantly when everyone has signed.' },
    { variant: 'mobile', title: 'Mobile Signing', description: 'Sign from any device — fully responsive on phones and tablets.' },
];
</script>

<template>
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <ScrollReveal v-for="(screen, i) in screens" :key="screen.variant" :delay="i * 60" class="group">
            <div class="marketing-card-lift overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div class="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white p-4 transition-colors group-hover:from-blue-50/50">
                    <ProductMockup :variant="screen.variant" />
                </div>
                <div class="p-5">
                    <h3 class="font-semibold text-gray-900">{{ screen.title }}</h3>
                    <p class="mt-1.5 text-sm leading-relaxed text-gray-500">{{ screen.description }}</p>
                </div>
            </div>
        </ScrollReveal>
    </div>
</template>
