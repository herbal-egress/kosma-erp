import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// Конфигурация Vite для фронтенда ERP.
// Подключены плагины React, Tailwind v4 и алиасы путей из tsconfig.
export default defineConfig({
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    },
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
});