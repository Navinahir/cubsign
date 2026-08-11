<script setup>
import { computed, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import DevNav from '@/Components/DevNav.vue';
import BrandLogo from '@/Components/BrandLogo.vue';
import SeoRobotsHead from '@/Components/SeoRobotsHead.vue';
import { footerLinks } from '@/constants/marketing';

const mobileOpen = ref(false);
const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);

const navLinks = computed(() => {
    const links = [
        { label: 'Features', routeName: 'features' },
        { label: 'Pricing', routeName: 'pricing' },
        { label: 'Upload PDF', routeName: 'sign.index', highlight: true },
        { label: 'About', routeName: 'about' },
        { label: 'Help', routeName: 'help-center' },
        { label: 'Blog', routeName: 'blog' },
    ];
    if (user.value) {
        links.push({ label: 'Dashboard', routeName: 'overview' });
    }
    return links;
});

const footerGroups = [
    { key: 'product', label: 'Product' },
    { key: 'company', label: 'Company' },
    { key: 'legal', label: 'Legal' },
    { key: 'resources', label: 'Resources' },
];

function isActive(routeName) {
    if (routeName === 'help-center') {
        return route().current('help-center') || route().current('help-center.show');
    }
    if (routeName === 'security') {
        return route().current('security');
    }
    if (routeName === 'blog') {
        return route().current('blog') || route().current('blog.show');
    }
    return route().current(routeName);
}

function navLinkClass(link, mobile = false) {
    const active = isActive(link.routeName);
    const highlighted = link.highlight && !active;

    if (mobile) {
        if (active) {
            return 'block rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-600';
        }
        if (highlighted) {
            return 'block rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white';
        }
        return 'block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50';
    }

    if (active) {
        return 'text-sm font-semibold text-blue-600';
    }
    if (highlighted) {
        return 'rounded-lg bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-600 transition-colors duration-200 hover:bg-blue-100';
    }
    return 'text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-900';
}
</script>

<template>
    <div class="flex min-h-screen flex-col bg-white">
        <SeoRobotsHead />
        <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <Link :href="route('home')" class="flex shrink-0 items-center transition-opacity hover:opacity-90" aria-label="CubSign home">
                        <BrandLogo variant="navbar" />
                    </Link>

                    <nav class="hidden items-center gap-6 md:flex" aria-label="Main navigation">
                        <Link
                            v-for="link in navLinks"
                            :key="link.routeName"
                            :href="route(link.routeName)"
                            :class="navLinkClass(link)"
                            :aria-current="isActive(link.routeName) ? 'page' : undefined"
                        >
                            {{ link.label }}
                        </Link>
                    </nav>

                    <div class="hidden items-center gap-3 md:flex">
                        <template v-if="!user">
                            <Link :href="route('login')" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">Log in</Link>
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
                        <Link v-for="link in navLinks" :key="link.routeName" :href="route(link.routeName)" :class="navLinkClass(link, true)" :aria-current="isActive(link.routeName) ? 'page' : undefined" @click="mobileOpen = false">{{ link.label }}</Link>
                    </div>
                    <div v-if="!user" class="border-t border-gray-100 px-4 py-4">
                        <Link :href="route('login')" class="block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50" @click="mobileOpen = false">Log in</Link>
                    </div>
                </div>
            </Transition>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-gray-200 bg-gray-900 text-gray-300">
            <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-10">
                    <div class="col-span-2 sm:col-span-3 lg:col-span-2">
                        <Link :href="route('home')" class="inline-flex transition-opacity hover:opacity-90">
                            <BrandLogo variant="footer" />
                        </Link>
                        <p class="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">Browser-based PDF signing: upload, sign, download, or send for signature.</p>
                    </div>

                    <div v-for="group in footerGroups" :key="group.key">
                        <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-300">{{ group.label }}</h4>
                        <ul class="mt-4 space-y-2.5">
                            <li v-for="link in footerLinks[group.key]" :key="link.label">
                                <Link v-if="link.routeName" :href="route(link.routeName)" class="text-sm text-gray-400 transition-colors hover:text-white">{{ link.label }}</Link>
                                <a v-else-if="link.sameTab" :href="link.href" class="text-sm text-gray-400 transition-colors hover:text-white">{{ link.label }}</a>
                                <a v-else :href="link.href" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-400 transition-colors hover:text-white">{{ link.label }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="mt-10 border-t border-gray-800 pt-5 space-y-2">
                    <p class="text-xs text-gray-500">&copy; {{ new Date().getFullYear() }} CubSign</p>
                    <p class="text-[11px] text-gray-600">Built by Cubiz Infotech</p>
                </div>
            </div>
        </footer>

        <DevNav />
    </div>
</template>
