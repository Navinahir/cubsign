<script setup>
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';
import DeleteUserForm from './Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';
import { Head } from '@inertiajs/vue3';

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});
</script>

<template>
    <Head title="Profile" />

    <WorkspaceLayout>
        <template #header>
            <h1 class="text-base font-semibold text-gray-900">Profile</h1>
        </template>

        <div class="mx-auto max-w-2xl space-y-6">
            <div class="rounded-xl border border-gray-200 bg-white p-6">
                <UpdateProfileInformationForm
                    :must-verify-email="mustVerifyEmail"
                    :status="status"
                />
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-6">
                <UpdatePasswordForm />
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-6">
                <DeleteUserForm />
            </div>
        </div>
    </WorkspaceLayout>
</template>
