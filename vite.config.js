import { defineConfig } from "vite";
import { resolve } from "path";
import autoprefixer from "autoprefixer";
import postcssNesting from "postcss-nesting";

export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer(), postcssNesting],
    },
  },
  test: {
    globals: true,
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
