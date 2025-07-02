import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',  // enables browser-like environment for your tests
        globals: true,         // optional: enables global test APIs like `describe`, `it`, `expect`
        setupFiles: './vitest.setup.ts', // optional setup file for global config
    },
})
