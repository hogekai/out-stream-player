import { defineConfig } from "vite";
import { resolve } from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import autoprefixer from "autoprefixer";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import postcssNesting from "postcss-nesting";
import dtsPlugin from "vite-plugin-dts";

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
