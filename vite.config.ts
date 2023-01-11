/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    importToCDN({
      modules: [
        autoComplete("vue"),
        {
          name: "vue-router",
          var: "VueRouter",
          path: "dist/vue-router.esm-browser.js",
        },
        {
          name: "pinia",
          var: "Pinia",
          path: "dist/pinia.esm-browser.js",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
  },
});
