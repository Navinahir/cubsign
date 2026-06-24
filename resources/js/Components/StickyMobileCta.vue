<script setup>
import { Link } from '@inertiajs/vue3';
import { CTA_START_SIGNING, btnPrimary } from '@/constants/marketing';

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
            :href="href ?? route('register')"
            :class="[btnPrimary, 'w-full']"
        >
            {{ CTA_START_SIGNING }}
        </Link>
    </div>
</template>
