<script setup>
import { Link } from '@inertiajs/vue3';
import { CTA_SIGN_PDF_NOW, btnPrimary } from '@/constants/marketing';

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
            {{ CTA_SIGN_PDF_NOW }}
        </Link>
    </div>
</template>
