// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Только один раз определяем __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), tailwindcss()],

    resolve: {
        alias: {
            '@': `${__dirname}/src`,          // или dirname(fileURLToPath(import.meta.url)) + '/src'
            // Если нужно — можно добавить 'react/jsx-runtime': 'react/jsx-runtime.js'
        },
    },

    build: { outDir: 'dist' },

    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
});