import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
// import viteSsrPlugin from 'vite-ssr/plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        {
            enforce: 'pre',
            ...mdx()
        },
        react(),
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

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    zustand: ['zustand'],
                    rehypeHighlight: ['rehype-highlight'],
                }
            }
        }
    },

    resolve: {
        alias: {
            '@': '/src'
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mdx', '.md']
    }
})
