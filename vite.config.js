import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                // pdfjs-dist uses eval("require") internally for Node.js worker loading
                // — harmless in browser builds, suppress the Rolldown eval warning
                if (warning.code === 'EVAL' && warning.id?.includes('pdfjs-dist')) return;
                warn(warning);
            },
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
});
