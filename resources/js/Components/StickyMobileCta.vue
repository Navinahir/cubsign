<script setup>
import { Link } from '@inertiajs/vue3';
import { CTA_UPLOAD_PDF, btnPrimary } from '@/constants/marketing';

defineProps({
    href: {
        type: String,
        default: null,
    },
});
</script>

<template>
    <div
        class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-sm md:hidden"
        role="complementary"
        aria-label="Quick action"
    >
        <Link
            :href="href ?? route('sign.index')"
            :class="[btnPrimary, 'w-full py-3.5 text-base']"
        >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {{ CTA_UPLOAD_PDF }}
        </Link>
    </div>
</template>
