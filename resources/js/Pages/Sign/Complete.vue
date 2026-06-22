<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import SignLayout from '@/Layouts/SignLayout.vue';

const props = defineProps({
    session: { type: Object, required: true },
});

const hasSignedPdf = ref(typeof window !== 'undefined' && !!window.__cubsignSignedPdf);

function downloadSignedPdf() {
    const bytes = window.__cubsignSignedPdf;
    if (!bytes) return;
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = (window.__cubsignSignedFilename ?? 'signed-document') .replace(/\.pdf$/i, '') + '-signed.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const benefits = [
    'Save signed documents',
    'Download anytime',
    'Reuse signatures',
    'Activity history',
    'Secure cloud storage',
    'Access from any device',
];
</script>

<template>
    <SignLayout :step="4">

        <!-- Full-height centred stage -->
        <div class="flex min-h-0 flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-14 sm:px-6">

            <!-- ── SUCCESS MARK ────────────────────────────────────────── -->
            <div class="flex flex-col items-center text-center">

                <!-- Icon -->
                <div class="relative inline-flex">
                    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-[10px] ring-emerald-50">
                        <svg class="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                </div>

                <h1 class="mt-7 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Your document is ready
                </h1>
                <p class="mt-3 text-base text-gray-500">
                    <span class="font-semibold text-gray-700">{{ session.filename }}</span>
                    has been successfully signed.
                </p>
            </div>

            <!-- ── TWO CARDS ──────────────────────────────────────────── -->
            <div class="mt-10 grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">

                <!-- CARD 1 — Guest -->
                <div class="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

                    <!-- Icon -->
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                        <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>

                    <h2 class="mt-4 text-[17px] font-semibold text-gray-900">Continue as Guest</h2>
                    <p class="mt-1.5 flex-1 text-sm leading-relaxed text-gray-500">
                        Download the PDF once without creating an account.
                    </p>

                    <!-- Divider -->
                    <div class="my-5 border-t border-gray-100" />

                    <button
                        v-if="hasSignedPdf"
                        class="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]"
                        @click="downloadSignedPdf"
                    >
                        <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Download PDF
                    </button>

                    <!-- Shown if user refreshed the page (signed PDF no longer in memory) -->
                    <div v-else class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
                        <p class="text-xs font-medium text-amber-700">Signed PDF is no longer in memory.</p>
                        <Link :href="route('sign.index')" class="mt-1 block text-[11px] text-amber-600 underline hover:text-amber-800">
                            Re-upload and sign again
                        </Link>
                    </div>

                    <p class="mt-3 text-center text-[11px] text-gray-400">
                        One-time download · No account required
                    </p>
                </div>

                <!-- CARD 2 — Create Account (highlighted) -->
                <div class="relative flex flex-col rounded-2xl border-2 border-blue-500 bg-white p-7 shadow-lg shadow-blue-100/60">

                    <!-- Recommended pill -->
                    <div class="absolute -top-[13px] left-1/2 -translate-x-1/2">
                        <span class="whitespace-nowrap rounded-full bg-blue-600 px-3.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white shadow">
                            Recommended
                        </span>
                    </div>

                    <!-- Icon -->
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                        <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>

                    <h2 class="mt-4 text-[17px] font-semibold text-gray-900">Create Free Account</h2>

                    <!-- Benefits -->
                    <ul class="mt-4 flex-1 space-y-2">
                        <li
                            v-for="b in benefits"
                            :key="b"
                            class="flex items-center gap-2.5 text-sm text-gray-700"
                        >
                            <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                <svg class="h-2.5 w-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </span>
                            {{ b }}
                        </li>
                    </ul>

                    <!-- Divider -->
                    <div class="my-5 border-t border-gray-100" />

                    <!-- CTAs -->
                    <div class="space-y-2.5">

                        <!-- Google -->
                        <Link
                            :href="route('register')"
                            class="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
                        >
                            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </Link>

                        <!-- Create account -->
                        <Link
                            :href="route('register')"
                            class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                            Create account
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <!-- ── FOOTER ──────────────────────────────────────────────── -->
            <p class="mt-8 text-sm text-gray-500">
                Already have an account?
                <Link
                    :href="route('login')"
                    class="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                >Login</Link>
            </p>

            <!-- Sign another -->
            <Link
                :href="route('sign.index')"
                class="mt-3 text-xs text-gray-400 transition hover:text-gray-600 hover:underline"
            >
                Sign another document
            </Link>

        </div>

    </SignLayout>
</template>
