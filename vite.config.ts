import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
    },
    base: './',
    plugins: [react(), svgr()],
    test: {
        include: ['**/*.spec.js'],
        globals: true,
    },
})
