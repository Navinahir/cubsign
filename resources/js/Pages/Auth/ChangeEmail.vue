<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
    email: {
        type: String,
        required: true,
    },
});

const form = useForm({
    email: props.email,
});

const submit = () => {
    form.put(route('verification.update-email'));
};
</script>

<template>
    <GuestLayout>
        <Head title="Change email address" />

        <div class="mb-6">
            <h1 class="text-xl font-bold text-gray-900">Change email address</h1>
            <p class="mt-2 text-sm text-gray-600">
                Enter a new email address. We'll send a verification link to the updated address.
            </p>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <InputLabel for="email" value="Email address" />
                <TextInput
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full"
                    required
                    autocomplete="username"
                />
                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <PrimaryButton
                type="submit"
                class="w-full justify-center"
                :class="{ 'opacity-50': form.processing }"
                :disabled="form.processing"
            >
                Update &amp; Resend Verification
            </PrimaryButton>

            <div class="text-center">
                <Link
                    :href="route('verification.notice')"
                    class="text-sm text-gray-500 underline transition hover:text-gray-800"
                >
                    Back to Verify Email
                </Link>
            </div>
        </form>
    </GuestLayout>
</template>
