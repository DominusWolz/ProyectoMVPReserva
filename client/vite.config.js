import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  envDir: '..',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
});
