<script setup>
import { computed, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import DevNav from '@/Components/DevNav.vue';
import { CTA_NAV_REGISTER, EARLY_ACCESS_HEADLINE } from '@/constants/marketing';

const mobileOpen = ref(false);
const page = usePage();

const user = computed(() => page.props.auth?.user ?? null);

const navLinks = [
    { label: 'Features', routeName: 'features' },
    { label: 'Pricing', routeName: 'pricing' },
    { label: 'FAQ', routeName: 'faq' },
];

function isActive(routeName) {
    return route().current(routeName);
}

function navLinkClass(routeName, mobile = false) {
    const active = isActive(routeName);

    if (mobile) {
        return active
            ? 'block rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600'
            : 'block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50';
    }

    return active
        ? 'text-sm font-semibold text-blue-600'
        : 'text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-900';
}
</script>

<template>
    <div class="flex min-h-screen flex-col bg-white">

        <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">

                    <Link :href="route('home')" class="flex shrink-0 items-center gap-2.5" aria-label="CubSign home">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-600/20">
                            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span class="text-lg font-bold tracking-tight text-gray-900">CubSign</span>
                    </Link>

                    <nav class="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                        <Link
                            v-for="link in navLinks"
                            :key="link.routeName"
                            :href="route(link.routeName)"
                            :class="navLinkClass(link.routeName)"
                            :aria-current="isActive(link.routeName) ? 'page' : undefined"
                        >
                            {{ link.label }}
                        </Link>
                    </nav>

                    <div class="hidden items-center gap-3 md:flex">
                        <template v-if="user">
                            <Link
                                :href="route('overview')"
                                class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                            >
                                Dashboard
                            </Link>
                            <Link
                                :href="route('sign.index')"
                                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md"
                            >
                                Sign a PDF
                            </Link>
                        </template>
                        <template v-else>
                            <Link
                                :href="route('login')"
                                class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                            >
                                Login
                            </Link>
                            <Link
                                :href="route('register')"
                                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md"
                            >
                                {{ CTA_NAV_REGISTER }}
                            </Link>
                        </template>
                    </div>

                    <button
                        type="button"
                        class="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
                        :aria-expanded="mobileOpen"
                        aria-label="Toggle navigation menu"
                        @click="mobileOpen = !mobileOpen"
                    >
                        <svg v-if="!mobileOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
            >
                <div v-if="mobileOpen" class="border-t border-gray-100 bg-white md:hidden">
                    <div class="space-y-1 px-4 py-3">
                        <Link
                            v-for="link in navLinks"
                            :key="link.routeName"
                            :href="route(link.routeName)"
                            :class="navLinkClass(link.routeName, true)"
                            :aria-current="isActive(link.routeName) ? 'page' : undefined"
                            @click="mobileOpen = false"
                        >
                            {{ link.label }}
                        </Link>
                    </div>
                    <div class="flex flex-col gap-2 border-t border-gray-100 px-4 py-4">
                        <template v-if="user">
                            <Link
                                :href="route('overview')"
                                class="block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                                @click="mobileOpen = false"
                            >
                                Dashboard
                            </Link>
                            <Link
                                :href="route('sign.index')"
                                class="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                                @click="mobileOpen = false"
                            >
                                Sign a PDF
                            </Link>
                        </template>
                        <template v-else>
                            <Link
                                :href="route('login')"
                                class="block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                                @click="mobileOpen = false"
                            >
                                Login
                            </Link>
                            <Link
                                :href="route('register')"
                                class="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                                @click="mobileOpen = false"
                            >
                                {{ CTA_NAV_REGISTER }}
                            </Link>
                        </template>
                    </div>
                </div>
            </Transition>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-gray-200 bg-white">
            <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

                <div class="grid grid-cols-1 gap-10 sm:grid-cols-3">

                    <div class="sm:col-span-1">
                        <Link :href="route('home')" class="flex items-center gap-2">
                            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                                <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span class="font-bold text-gray-900">CubSign</span>
                        </Link>
                        <p class="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
                            Simple, secure PDF signing for individuals and businesses. {{ EARLY_ACCESS_HEADLINE }}.
                        </p>
                        <p class="mt-5 text-xs text-gray-400">
                            Built by <span class="font-medium text-gray-600">Cubiz Infotech</span>
                        </p>
                    </div>

                    <div>
                        <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-900">Product</h4>
                        <ul class="mt-5 space-y-3">
                            <li>
                                <Link :href="route('home')" class="text-sm text-gray-500 transition-colors hover:text-gray-900">Home</Link>
                            </li>
                            <li>
                                <Link :href="route('features')" class="text-sm text-gray-500 transition-colors hover:text-gray-900">Features</Link>
                            </li>
                            <li>
                                <Link :href="route('pricing')" class="text-sm text-gray-500 transition-colors hover:text-gray-900">Pricing</Link>
                            </li>
                            <li>
                                <Link :href="route('faq')" class="text-sm text-gray-500 transition-colors hover:text-gray-900">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-900">Account</h4>
                        <ul class="mt-5 space-y-3">
                            <li>
                                <Link :href="route('login')" class="text-sm text-gray-500 transition-colors hover:text-gray-900">Login</Link>
                            </li>
                            <li>
                                <Link :href="route('register')" class="text-sm text-gray-500 transition-colors hover:text-gray-900">Register</Link>
                            </li>
                            <li v-if="user">
                                <Link :href="route('overview')" class="text-sm text-gray-500 transition-colors hover:text-gray-900">Dashboard</Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div class="mt-12 flex flex-col items-start justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
                    <p class="text-xs text-gray-400">
                        &copy; {{ new Date().getFullYear() }} CubSign. All rights reserved.
                    </p>
                    <p class="text-xs text-gray-400">
                        Built by <span class="font-medium text-gray-500">Cubiz Infotech</span>
                    </p>
                </div>
            </div>
        </footer>

        <DevNav />

    </div>
</template>
