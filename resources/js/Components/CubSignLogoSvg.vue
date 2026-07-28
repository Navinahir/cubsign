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
        <g transform="translate(10, 10)">
            <path d="M7 5.5H19.5L23.5 9.5V26.5H7V5.5Z" stroke="#0A1628" stroke-width="2" stroke-linejoin="round" />
            <path d="M19.5 5.5V9.5H23.5" stroke="#0A1628" stroke-width="2" stroke-linejoin="round" />
            <path d="M11.5 17.5L14.5 20.5L20.5 13.5" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
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
