import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import viteSsrPlugin from 'vite-ssr/plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // viteSsrPlugin()
    ],

    define: {
        __DEV__: process.env.NODE_ENV === 'development',
    },

    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:9999',
                changeOrigin: true,
            }
        }
    },

    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
