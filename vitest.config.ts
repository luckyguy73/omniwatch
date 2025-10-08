import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  esbuild: {
    jsx: 'automatic', // Enable automatic JSX runtime (React 17+)
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',  // enables browser-like environment for your tests
    globals: true,         // optional: enables global test APIs like `describe`, `it`, `expect`
    setupFiles: './vitest.setup.ts', // optional setup file for global config
  },
})
