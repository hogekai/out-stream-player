import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/InRenderer',
      name: 'InRenderer',
      fileName: 'in-renderer',
    },
  },
  test: {
    globals: true,
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
