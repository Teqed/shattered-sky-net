// https://nuxt.com/docs/api/configuration/nuxt-config
// import { fileURLToPath, URL } from 'node:url';
// import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";
// import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'nuxt-security',
    'nuxt-delay-hydration',
    // 'nuxt-purgecss',
    ['@nuxtjs/google-fonts', {
        families: {
          Roboto: true,
        },
    }],
    ['@nuxtjs/i18n', {
      baseUrl: 'https://shatteredsky.net',
      locales: [{
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en-US.json',
      }, {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        file: 'fr-FR.json',
      }],
      lazy: true,
      langDir: 'lang/',
      defaultLocale: 'en',
      strategy: 'no_prefix',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        redirectOn: 'root',
      },
        vueI18n: {
          legacy: false,
          // locale: 'fr',
            fallbackLocale: 'en',
            runtimeOnly: false,
            compositionOnly: false,
          }
    }],
  ],
  security: {
    headers: {
      crossOriginResourcePolicy: {
        value: 'cross-origin',
        route: '/**'
      },
      // crossOriginOpenerPolicy: false,
      crossOriginEmbedderPolicy: {
        value: 'unsafe-none',
        route: '/social'
      },
      // contentSecurityPolicy: false,
      // originAgentCluster: false,
      // referrerPolicy: false,
      // strictTransportSecurity: false,
      // xContentTypeOptions: false,
      // xDNSPrefetchControl: false,
      // xDownloadOptions: false,
      // xFrameOptions: false,
      // xPermittedCrossDomainPolicies: false,
      // xXSSProtection: false,
    }
  },
  delayHydration: {
    mode: 'init'
  },
  extends: [
    'nuxt-seo-kit'
  ],
  unhead: {
    ogTitleTemplate: '%pageTitle',
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://shatteredsky.net',
      siteName: 'Shattered Sky',
      siteDescription: 'Hosting for Shattered Sky',
      siteAuthor: 'Timothy E. Quilling',
    }
  },
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
      // htmlAttrs: {
      //   lang: 'en',
      // },
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
