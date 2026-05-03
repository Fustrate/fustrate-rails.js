import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
  },
});
