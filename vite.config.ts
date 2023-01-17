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
          path: "dist/vue-router.global.prod.js",
        },
        {
          name: "vue-demi",
          var: "VueDemi",
          path: "lib/index.iife.min.js",
        },
        {
          name: "pinia",
          var: "Pinia",
          path: "dist/pinia.iife.min.js",
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
