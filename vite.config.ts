import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), visualizer(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
