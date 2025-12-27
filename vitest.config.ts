import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // This allows using describe/it/expect without imports if desired, but I imported them manually anyway. Useful to have on.
  },
});
