import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'app',
  plugins: [react()],
  build: {
    outDir: '../dist/react-app',
    emptyOutDir: true
  },
  test: {
    environment: 'node',
    globals: true,
    pool: 'vmForks',
    poolOptions: {
      vmForks: {
        singleFork: true
      }
    }
  }
});
