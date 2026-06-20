<script setup>
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import DevNav from '@/Components/DevNav.vue';

const page = usePage();
const user = computed(() => page.props.auth.user);
const mobileOpen = ref(false);

const navItems = [
    {
        label: 'Overview',
        routeName: 'overview',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
        label: 'Documents',
        routeName: null,
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
        label: 'Signatures',
        routeName: null,
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    },
    {
        label: 'Templates',
        routeName: null,
        icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
    },
    {
        label: 'Activities',
        routeName: null,
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    },
    {
        label: 'Billing',
        routeName: null,
        icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    },
    {
        label: 'Profile',
        routeName: 'profile.edit',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
        label: 'Settings',
        routeName: null,
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
];

function isActive(item) {
    if (!item.routeName) return false;
    if (item.routeName === 'profile.edit') return route().current('profile.*');
    return route().current(item.routeName);
}

function getHref(item) {
    return item.routeName ? route(item.routeName) : '#';
}

const initials = computed(() => {
    return user.value.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join('');
});
</script>

<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
        <!-- Mobile backdrop -->
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="mobileOpen"
                class="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
                @click="mobileOpen = false"
            />
        </Transition>

        <!-- Sidebar -->
        <aside
            :class="[
                'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 transition-transform duration-200 ease-in-out',
                'lg:static lg:translate-x-0',
                mobileOpen ? 'translate-x-0' : '-translate-x-full',
            ]"
        >
            <!-- Logo -->
            <div class="flex h-16 shrink-0 items-center border-b border-slate-800 px-6">
                <Link :href="route('overview')" class="flex items-center gap-2.5">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span class="text-base font-bold tracking-tight text-white">CubSign</span>
                </Link>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto px-3 py-5">
                <ul class="space-y-0.5">
                    <li v-for="item in navItems" :key="item.label">
                        <!-- Functional nav item -->
                        <Link
                            v-if="item.routeName"
                            :href="getHref(item)"
                            :class="[
                                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                                isActive(item)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                            ]"
                        >
                            <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                            </svg>
                            {{ item.label }}
                        </Link>

                        <!-- Placeholder nav item -->
                        <div
                            v-else
                            class="flex cursor-not-allowed select-none items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600"
                        >
                            <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                            </svg>
                            {{ item.label }}
                            <span class="ml-auto rounded px-1.5 py-0.5 text-xs text-slate-600 bg-slate-800">
                                Soon
                            </span>
                        </div>
                    </li>
                </ul>
            </nav>

            <!-- Sidebar footer: user info -->
            <div class="shrink-0 border-t border-slate-800 p-4">
                <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                        {{ initials }}
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium text-white">{{ user.name }}</p>
                        <p class="truncate text-xs text-slate-500">{{ user.email }}</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main content wrapper -->
        <div class="flex min-w-0 flex-1 flex-col overflow-auto">
            <!-- Top bar -->
            <header class="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
                <!-- Mobile hamburger -->
                <button
                    type="button"
                    class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                    @click="mobileOpen = !mobileOpen"
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <!-- Page title (desktop) -->
                <div class="hidden lg:block">
                    <slot name="header" />
                </div>

                <!-- Right: user dropdown -->
                <div class="ml-auto">
                    <Dropdown align="right" width="48">
                        <template #trigger>
                            <button
                                type="button"
                                class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            >
                                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                    {{ initials }}
                                </div>
                                <span class="hidden font-medium sm:block">{{ user.name }}</span>
                                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </template>
                        <template #content>
                            <DropdownLink :href="route('profile.edit')">Profile</DropdownLink>
                            <DropdownLink :href="route('logout')" method="post" as="button">
                                Log Out
                            </DropdownLink>
                        </template>
                    </Dropdown>
                </div>
            </header>

            <!-- Page content -->
            <main class="flex-1 p-6 lg:p-8">
                <slot />
            </main>
        </div>
    </div>

    <DevNav />

</template>
