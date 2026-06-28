<script setup>
defineProps({
    variant: {
        type: String,
        default: 'navbar',
        validator: (v) => ['navbar', 'footer', 'auth', 'loader', 'workspace'].includes(v),
    },
});

const heightClasses = {
    navbar: 'h-11 w-auto shrink-0 sm:h-12',
    footer: 'h-11 w-auto shrink-0 brightness-0 invert sm:h-12',
    auth: 'mx-auto w-[min(100%,18rem)] h-auto shrink-0 sm:w-[20rem]',
    loader: 'mx-auto h-11 w-auto shrink-0 sm:h-12',
    workspace: 'h-9 w-auto shrink-0 brightness-0 invert sm:h-10',
};

</script>

<template>
    <svg
        :class="heightClasses[variant]"
        viewBox="0 0 170 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="CubSign"
        shape-rendering="geometricPrecision"
        text-rendering="geometricPrecision"
    >
        <path d="M8 18L22 10V28L8 36V18Z" fill="#0A1628" />
        <path d="M22 10L36 18V36L22 28V10Z" fill="#0A1628" />
        <path d="M8 18L22 26L36 18L22 10L8 18Z" fill="#2563EB" />
        <path d="M26 22C28 24 30 25 32 25" stroke="#0A1628" stroke-width="1.5" stroke-linecap="round" />
        <path d="M24 26H34" stroke="#2563EB" stroke-width="2" stroke-linecap="round" />
        <line x1="46" y1="10" x2="46" y2="42" stroke="#CBD5E1" stroke-width="1" />
        <text x="54" y="31" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" letter-spacing="0.3" fill="#0A1628">Cub</text>
        <text x="96" y="31" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" letter-spacing="0.3" fill="#2563EB">Sign</text>
        <text
            v-if="variant === 'auth'"
            x="54"
            y="44"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="7"
            font-weight="600"
            letter-spacing="1.2"
            fill="#64748B"
        >SIMPLE PDF SIGNING.</text>
    </svg>
</template>
