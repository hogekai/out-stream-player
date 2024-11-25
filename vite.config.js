import { defineConfig } from "vite";
import { resolve } from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import autoprefixer from "autoprefixer";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import postcssNesting from 'postcss-nesting';

export default defineConfig({
  plugins: [libInjectCss()],
  build: {
    lib: {
      entry: "./lib/in-renderer",
      name: "InRenderer",
      fileName: "in-renderer",
    },
    rollupOptions: {
      output: {
        preserveModules: false,
        plugins: {
          output: {
            plugins: [
              getBabelOutputPlugin({
                allowAllFormats: true,
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: "> 0.25%, not dead, IE 11",
                      useBuiltIns: "usage",
                      modules: false,
                      corejs: true,
                    },
                  ],
                ],
              }),
            ],
          },
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer, postcssNesting],
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
