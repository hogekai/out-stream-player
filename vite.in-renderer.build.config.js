import { defineConfig } from "vite";
import { resolve } from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import autoprefixer from "autoprefixer";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import postcssNesting from "postcss-nesting";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [
    libInjectCss(),
    dtsPlugin({
      outputDir: "dist",
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
    }),
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: "./lib/in-renderer",
      name: "InRenderer",
      fileName: "in-renderer",
    },
    rollupOptions: {
      output: {
        preserveModules: false,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  modules: false,
                  corejs: true,
                },
              ],
            ],
          }),
          terser(),
        ],
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), postcssNesting],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
