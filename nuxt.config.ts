// https://nuxt.com/docs/api/configuration/nuxt-config
// import { fileURLToPath, URL } from 'node:url';
// import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";
// import { defineNuxtConfig } from 'nuxt/config'
// import wasm from 'vite-plugin-wasm';
// import topLevelAwait from 'vite-plugin-top-level-await';
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
	app: {
		head: {
			// htmlAttrs: {
			//   lang: 'en',
			// },
			link: [
				// Import favicon
				{
					href: '/favicon.ico',
					rel: 'icon',
					type: 'image/x-icon',
				},
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
		transpile: ['vuetify'],
	},

	css: [
		// 'vuetify/lib/styles/main.sass',
		// '@mdi/font/css/materialdesignicons.min.css',
	],

	// unlighthouse: {
	// 	site: 'shatteredsky.net',
	// 	scanner: {
	// 		exclude: ['/cdn-cgi/*']
	// 	},
	// },
	delayHydration: {
		mode: 'init',
	},

	devtools: {
		enabled: false,
	},

	extends: ['nuxt-seo-kit'],

	i18n: {
		vueI18n: './i18n.config.ts', // if you are using custom path, default
	},

	// serverHandlers: [
	// 	{
	// 		route: '/ws',
	// 		handler: '~/server-middleware/socket'
	// 	}
	// ],
	modules: [
		'@nuxt/devtools',
		// 'nuxt-purgecss',
		[
			'@unocss/nuxt',
			{
				// presets
				// uno: true, // enabled `@unocss/preset-uno`
				icons: {
					extraProperties: {
						display: 'inline-block',
					},
					// enabled `@unocss/preset-icons`
					prefix: 'i-',
				},
				// attributify: true, // enabled `@unocss/preset-attributify`,

				// core options
				// shortcuts: [],
				// rules: [],
			},
		],
		// ['unplugin-icons/nuxt', { /* options */ }],
		// eslint-disable-next-line require-await
		async (_options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', config => {
				config.plugins?.push(vuetify({ autoImport: true }));
			});
		},
		// './modules/socket',
		// 'nuxt-socket-io',
		// '@unlighthouse/nuxt',
		'nuxt-security',
		'nuxt-delay-hydration',
		// 'nuxt-purgecss',
		'@nuxtjs/html-validator',
		[
			'@nuxtjs/google-fonts',
			{
				families: {
					Roboto: true,
				},
			},
		],
		['@nuxtjs/i18n'],
	],

	nitro: {
		// esbuild: {
		// 	options: {
		// 		target: 'esnext'
		// 	},
		// },
		experimental: {
			wasm: true,
		},
	},

	robots: {
		disallow: ['/cdn-cgi/'],
	},

	runtimeConfig: {
		public: {
			siteAuthor: 'Timothy E. Quilling',
			siteDescription: 'Hosting for Shattered Sky',
			siteName: 'Shattered Sky',
			siteUrl:
				process.env.NUXT_PUBLIC_SITE_URL || 'https://shatteredsky.net',
		},
	},

	// io: {
	// 	sockets: [{
	// 		name: 'chatcompletion',
	// 		url: 'http://localhost:3000',
	// 		default: true,
	// 	}]
	// },
	security: {
		headers: {
			// crossOriginOpenerPolicy: false,
			crossOriginEmbedderPolicy: {
				route: '/social',
				value: 'unsafe-none',
			},

			crossOriginResourcePolicy: {
				route: '/**',
				value: 'cross-origin',
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
		},
	},

	typescript: {
		strict: true,
		tsConfig: {
			compilerOptions: {
				experimentalDecorators: true,
				noFallthroughCasesInSwitch: true,

				noImplicitAny: true,

				// noUnusedLocals: true,
				// noUnusedParameters: true,
				noImplicitOverride: true,

				noImplicitReturns: true,

				noImplicitThis: true,

				// noPropertyAccessFromIndexSignature: true,
				noUncheckedIndexedAccess: true,

				strict: true,

				strictBindCallApply: true,

				strictFunctionTypes: true,

				strictNullChecks: true,

				strictPropertyInitialization: true,
			},
		},
		typeCheck: true,
	},
	unhead: {
		ogTitleTemplate: '%pageTitle',
	},
	vite: {
		build: {
			emptyOutDir: true,
			rollupOptions: {
				external: [
					// 'vue',
					// 'vue-router'
					// '@dimforge/rapier3d-compat'
				],
				output: {
					// format: 'iife',
					// inlineDynamicImports: true,
					globals: {
						// vue: 'Vue',
						// 'vue-router': 'VueRouter',
						// '@dimforge/rapier3d-compat': 'RAPIER'
					},

					manualChunks: {
						// rapier: ['@dimforge/rapier3d-compat'],
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
		define: {
			'process.env.DEBUG': false,
		},
		optimizeDeps: {
			// exclude: [
			// 	'babylon',
			// ],
		},
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
			// wasm(),
			// topLevelAwait()
		],
		resolve: {
			alias: {
				// '@': fileURLToPath(new URL('./', import.meta.url)),
				// '~': fileURLToPath(new URL('./', import.meta.url)),
				// '~~': fileURLToPath(new URL('../', import.meta.url)),
				// '@@': fileURLToPath(new URL('../', import.meta.url)),
				// 'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@4/+esm',
			},
		},
	},
});
