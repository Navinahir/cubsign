<script setup>
import { computed, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import DevNav from '@/Components/DevNav.vue';
import { CTA_NAV_REGISTER, EARLY_ACCESS_HEADLINE, footerLinks, APP_VERSION, SOCIAL_LINKS } from '@/constants/marketing';

const mobileOpen = ref(false);
const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);

const navLinks = [
    { label: 'Features', routeName: 'features' },
    { label: 'Pricing', routeName: 'pricing' },
    { label: 'Blog', routeName: 'blog' },
    { label: 'FAQ', routeName: 'faq' },
];

const footerGroups = [
    { key: 'product', label: 'Product' },
    { key: 'company', label: 'Company' },
    { key: 'legal', label: 'Legal' },
    { key: 'resources', label: 'Resources' },
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

                    <nav class="hidden items-center gap-7 md:flex" aria-label="Main navigation">
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
                            <Link :href="route('overview')" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">Dashboard</Link>
                            <Link :href="route('sign.index')" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md">Sign a PDF</Link>
                        </template>
                        <template v-else>
                            <Link :href="route('login')" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">Login</Link>
                            <Link :href="route('register')" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md">{{ CTA_NAV_REGISTER }}</Link>
                        </template>
                    </div>

                    <button type="button" class="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden" :aria-expanded="mobileOpen" aria-label="Toggle navigation menu" @click="mobileOpen = !mobileOpen">
                        <svg v-if="!mobileOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                <div v-if="mobileOpen" class="border-t border-gray-100 bg-white md:hidden">
                    <div class="space-y-1 px-4 py-3">
                        <Link v-for="link in navLinks" :key="link.routeName" :href="route(link.routeName)" :class="navLinkClass(link.routeName, true)" :aria-current="isActive(link.routeName) ? 'page' : undefined" @click="mobileOpen = false">{{ link.label }}</Link>
                    </div>
                    <div class="flex flex-col gap-2 border-t border-gray-100 px-4 py-4">
                        <template v-if="user">
                            <Link :href="route('overview')" class="block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50" @click="mobileOpen = false">Dashboard</Link>
                            <Link :href="route('sign.index')" class="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700" @click="mobileOpen = false">Sign a PDF</Link>
                        </template>
                        <template v-else>
                            <Link :href="route('login')" class="block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50" @click="mobileOpen = false">Login</Link>
                            <Link :href="route('register')" class="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700" @click="mobileOpen = false">{{ CTA_NAV_REGISTER }}</Link>
                        </template>
                    </div>
                </div>
            </Transition>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-gray-200 bg-gray-900 text-gray-300">
            <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-10">
                    <div class="col-span-2 sm:col-span-3 lg:col-span-2">
                        <Link :href="route('home')" class="flex items-center gap-2">
                            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                                <svg class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <span class="font-bold text-white">CubSign</span>
                        </Link>
                        <p class="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">{{ EARLY_ACCESS_HEADLINE }}. Simple PDF signing.</p>
                        <div class="mt-5 flex gap-3">
                            <a
                                v-for="social in SOCIAL_LINKS"
                                :key="social.label"
                                :href="social.href"
                                :aria-label="`${social.label} (coming soon)`"
                                class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
                                @click.prevent
                            >
                                <svg v-if="social.icon === 'linkedin'" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                <svg v-else-if="social.icon === 'twitter'" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                        </div>
                        <div class="mt-6">
                            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Newsletter</p>
                            <p class="mt-2 text-sm text-gray-500">Coming soon — product updates and signing tips.</p>
                            <div class="mt-2 flex gap-2 opacity-60" aria-hidden="true">
                                <input type="email" disabled placeholder="you@email.com" class="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-500" tabindex="-1" />
                                <span class="shrink-0 rounded-lg border border-gray-600 px-3 py-2 text-xs font-semibold text-gray-400">Soon</span>
                            </div>
                        </div>
                    </div>

                    <div v-for="group in footerGroups" :key="group.key">
                        <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-300">{{ group.label }}</h4>
                        <ul class="mt-4 space-y-2.5">
                            <li v-for="link in footerLinks[group.key]" :key="link.label">
                                <Link v-if="link.routeName" :href="route(link.routeName)" class="text-sm text-gray-400 transition-colors hover:text-white">{{ link.label }}</Link>
                                <a
                                    v-else-if="link.unavailable"
                                    href="#"
                                    class="text-sm text-gray-500"
                                    aria-disabled="true"
                                    title="Coming soon"
                                    @click.prevent
                                >{{ link.label }}</a>
                                <a v-else :href="link.href" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-400 transition-colors hover:text-white">{{ link.label }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="mt-10 flex flex-col items-start justify-between gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:items-center">
                    <p class="text-xs text-gray-500">&copy; {{ new Date().getFullYear() }} CubSign · v{{ APP_VERSION }} · Built by Cubiz Infotech</p>
                    <a href="/sitemap.xml" class="text-xs text-gray-500 hover:text-gray-300">Sitemap</a>
                </div>
            </div>
        </footer>

        <DevNav />
    </div>
</template>
