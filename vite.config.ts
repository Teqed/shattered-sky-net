import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    importToCDN({
        modules: [
            autoComplete('vue'), // vue2 use autoComplete('vue2')
            autoComplete('@vueuse/shared'),
            autoComplete('@vueuse/core')
        ],
    }),
  ],
})
