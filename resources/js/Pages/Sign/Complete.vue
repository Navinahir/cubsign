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
    a.download = (window.__cubsignSignedFilename ?? 'signed-document').replace(/\.pdf$/i, '') + '-signed.pdf';
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

        <!-- overflow-y-auto prevents top-clip on short viewports; justify-start + py keeps it vertically comfortable -->
        <div class="flex min-h-0 flex-1 flex-col items-center justify-start overflow-y-auto bg-gray-50 px-4 py-6 sm:px-8 sm:py-8">

            <!-- ── SUCCESS HERO ────────────────────────────────────────── -->
            <div class="flex flex-col items-center text-center">
                <div class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 shadow-md ring-[10px] ring-emerald-50">
                    <svg class="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h1 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Your document is signed
                </h1>
                <p class="mt-1.5 text-sm text-gray-500">
                    <span class="font-semibold text-gray-700">{{ session.filename }}</span>
                    · signed and ready to download
                </p>
            </div>

            <!-- ── CARDS ──────────────────────────────────────────────── -->
            <div class="mt-6 grid w-full max-w-[54rem] grid-cols-1 items-stretch gap-4 sm:grid-cols-2">

                <!-- CARD 1 — Guest / Download -->
                <div class="flex flex-col rounded-2xl border border-gray-300 bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg">

                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200/80">
                        <svg class="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                    </div>

                    <h2 class="mt-3.5 text-base font-bold text-gray-900">Download Now</h2>
                    <p class="mt-1 flex-1 text-sm leading-relaxed text-gray-500">
                        Get your signed PDF immediately — no account needed.
                    </p>

                    <div class="mt-5 space-y-2.5 border-t border-gray-100 pt-5">
                        <button
                            v-if="hasSignedPdf"
                            class="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-slate-700 hover:shadow-md active:scale-[0.98]"
                            @click="downloadSignedPdf"
                        >
                            <svg class="h-4 w-4 transition-transform duration-150 group-hover:translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Download Signed PDF
                        </button>

                        <div v-else class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
                            <p class="text-xs font-semibold text-amber-700">Signed PDF is no longer in memory.</p>
                            <Link :href="route('sign.index')" class="mt-0.5 block text-[11px] text-amber-600 underline hover:text-amber-800">
                                Re-upload and sign again
                            </Link>
                        </div>

                        <p class="text-center text-[11px] text-gray-400">
                            One-time download · No account required
                        </p>
                    </div>
                </div>

                <!-- CARD 2 — Create Account -->
                <div class="relative flex flex-col rounded-2xl border-2 border-blue-500 bg-white p-6 shadow-lg shadow-blue-100/50 transition-shadow duration-200 hover:shadow-xl hover:shadow-blue-100/60">

                    <!-- Recommended badge -->
                    <div class="absolute -top-[13px] left-1/2 -translate-x-1/2">
                        <span class="whitespace-nowrap rounded-full bg-blue-600 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                            Recommended
                        </span>
                    </div>

                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 ring-1 ring-blue-200/80">
                        <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>

                    <h2 class="mt-3.5 text-base font-bold text-gray-900">Create Free Account</h2>
                    <p class="mt-1 text-sm leading-relaxed text-gray-500">
                        Save your signed document and unlock all features.
                    </p>

                    <!-- 2-column benefits grid to reduce vertical space -->
                    <ul class="mt-4 flex-1 grid grid-cols-2 gap-x-3 gap-y-2">
                        <li v-for="b in benefits" :key="b" class="flex items-center gap-2 text-xs text-gray-700">
                            <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                <svg class="h-2.5 w-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </span>
                            {{ b }}
                        </li>
                    </ul>

                    <div class="mt-5 space-y-2.5 border-t border-gray-100 pt-5">
                        <Link
                            :href="route('register')"
                            class="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-150 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
                        >
                            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </Link>

                        <Link
                            :href="route('register')"
                            class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                        >
                            Create free account
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <!-- ── FOOTER LINKS ─────────────────────────────────────── -->
            <div class="mt-6 flex flex-col items-center gap-2.5">
                <p class="text-sm text-gray-500">
                    Already have an account?
                    <Link :href="route('login')" class="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">
                        Log in
                    </Link>
                </p>
                <Link :href="route('sign.index')" class="text-xs text-gray-400 transition hover:text-gray-600 hover:underline">
                    Sign another document
                </Link>
            </div>

        </div>

    </SignLayout>
</template>
