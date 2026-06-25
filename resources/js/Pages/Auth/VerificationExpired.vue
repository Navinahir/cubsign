<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineProps({
    isAuthenticated: {
        type: Boolean,
        default: false,
    },
});

const form = useForm({});

const resend = () => {
    form.post(route('verification.send'));
};
</script>

<template>
    <GuestLayout>
        <Head title="Verification link expired" />

        <div class="mb-6 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                <svg class="h-7 w-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Verification link expired</h1>
        </div>

        <p class="mb-6 text-sm text-gray-600">
            This verification link is no longer valid. Verification links expire after 24 hours for your security.
        </p>

        <div class="space-y-3">
            <template v-if="isAuthenticated">
                <PrimaryButton
                    type="button"
                    class="w-full justify-center"
                    :class="{ 'opacity-50': form.processing }"
                    :disabled="form.processing"
                    @click="resend"
                >
                    Send New Verification Email
                </PrimaryButton>

                <Link
                    :href="route('verification.notice')"
                    class="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                    Back to Verify Email
                </Link>
            </template>

            <template v-else>
                <Link
                    :href="route('login')"
                    class="inline-flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
                >
                    Go to Login
                </Link>

                <p class="text-center text-xs text-gray-500">
                    Sign in to request a new verification email.
                </p>
            </template>

            <div v-if="isAuthenticated" class="pt-2 text-center">
                <Link
                    :href="route('logout')"
                    method="post"
                    as="button"
                    class="text-sm text-gray-500 underline transition hover:text-gray-800"
                >
                    Log Out
                </Link>
            </div>
        </div>
    </GuestLayout>
</template>
