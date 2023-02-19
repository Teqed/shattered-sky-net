// https://nuxt.com/docs/api/configuration/nuxt-config
// import { fileURLToPath, URL } from 'node:url';
// import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";
// import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // webpack:{
  // 	extractCSS: true,
  // 	optimization: {
  // 	  splitChunks: {
  // 		cacheGroups: {
  // 		  styles: {
  // 			name: 'styles',
  // 			test: /\.(css|vue)$/,
  // 			chunks: 'all',
  // 			enforce: true
  // 		  }
  // 		}
  // 	  }
  // 	}
  // },
  build: {
    analyze: true,
  },
  vite: {
    plugins: [
      // importToCDN({
      //   modules: [
      // 	{
      // 	  name: "vue",
      // 	  var: "Vue",
      // 	  path: "dist/vue.global.prod.js",
      // 	},
      // 	{
      // 	  name: "vue-router",
      // 	  var: "VueRouter",
      // 	  path: "dist/vue-router.global.prod.js",
      // 	},
      //   ],
      // }),
    ],
    resolve: {
      alias: {
        // '@': fileURLToPath(new URL('./', import.meta.url)),
        // '~': fileURLToPath(new URL('./', import.meta.url)),
        // '~~': fileURLToPath(new URL('./', import.meta.url)),
        // '@@': fileURLToPath(new URL('./', import.meta.url)),
        // 'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@4/+esm',
      },
    },
    build: {
      emptyOutDir: true,
      rollupOptions: {
        external: [
          // 'vue',
          // 'vue-router'
        ],
        output: {
          // format: 'iife',
          globals: {
            // vue: 'Vue',
              // 'vue-router': 'VueRouter',
          },
          // entryFileNames: "_nuxt/ss-entry.js",
          // chunkFileNames: "_nuxt/ss-chunk.js",
          // assetFileNames: "_nuxt/ss-asset.[ext]",
          paths: {
            // vue$: 'https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.esm-bundler.js',
            // 'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@4/+esm',
          },
        },
      },
    },
  },
  app: {
    head: {
      link: [
        // Import favicon
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        }
      ],
			script: [
				// Import Vue from CDN URL
				{
					// src: 'https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.esm-browser.prod.js',
          // type: 'module',
				},
				// Import Vue Router from CDN URL
				{
					// src: 'https://cdn.jsdelivr.net/npm/vue-router@4.1.6/dist/vue-router.global.min.js',
          // type: 'module',
				},
			],
    },
  },
});
