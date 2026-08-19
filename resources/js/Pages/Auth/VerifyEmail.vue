<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';

const props = defineProps({
    status: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
    },
    resendAvailableAt: {
        type: Number,
        default: null,
    },
    resendLimit: {
        type: Number,
        default: 5,
    },
});

const page = usePage();
const form = useForm({});
const countdown = ref(props.resendAvailableAt ?? 0);
let timer = null;

const verificationLinkSent = computed(() => props.status === 'verification-link-sent');
const resendError = computed(() => page.props.errors?.resend);
const canResend = computed(() => countdown.value <= 0 && !form.processing);

onMounted(() => {
    if (countdown.value > 0) {
        startTimer();
    }
});

onUnmounted(() => {
    clearInterval(timer);
});

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value -= 1;
        } else {
            clearInterval(timer);
        }
    }, 1000);
}

const submit = () => {
    form.post(route('verification.send'), {
        preserveScroll: true,
        onSuccess: (visit) => {
            const status = visit.props.status ?? visit.props.flash?.status;
            if (status === 'verification-link-sent') {
                countdown.value = 60;
                startTimer();
            }
        },
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Verify your email" />

        <div class="mb-6 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <svg class="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Verify your email</h1>
        </div>

        <p class="mb-2 text-sm text-gray-600">
            We've sent a verification link to
            <span class="font-medium text-gray-900">{{ email }}</span>.
        </p>
        <p class="mb-6 text-sm text-gray-600">
            Please verify your email before accessing your CubSign workspace.
        </p>

        <div
            v-if="verificationLinkSent"
            class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
            Verification email sent. Please check your inbox.
        </div>

        <InputError class="mb-4" :message="resendError" />

        <form @submit.prevent="submit" class="space-y-4">
            <PrimaryButton
                type="submit"
                class="w-full justify-center"
                :class="{ 'opacity-50': !canResend }"
                :disabled="!canResend"
            >
                Resend Verification Email
            </PrimaryButton>

            <p v-if="countdown > 0" class="text-center text-xs text-gray-500">
                You can resend another email in {{ countdown }} seconds.
            </p>
            <p v-else class="text-center text-xs text-gray-400">
                Maximum {{ resendLimit }} emails per hour.
            </p>

            <Link
                :href="route('verification.change')"
                class="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
                Change Email Address
            </Link>

            <div class="pt-2 text-center">
                <Link
                    :href="route('logout')"
                    method="post"
                    as="button"
                    class="text-sm text-gray-500 underline transition hover:text-gray-800"
                >
                    Log Out
                </Link>
            </div>
        </form>
    </GuestLayout>
</template>
