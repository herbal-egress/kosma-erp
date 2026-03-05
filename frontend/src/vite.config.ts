// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // Новый плагин для sync tsconfig paths
import { resolve } from 'path';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'), // Явное разрешение для Rollup
        },
    },
    build: {
        outDir: 'dist',
    },
    server: {
        port: 5173,
        strictPort: true,
        open: true,
        proxy: { '/api': 'http://localhost:8080' },
    },
});