import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import viteSsrPlugin from 'vite-ssr/plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // viteSsrPlugin()
    ],

    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
