// https://nuxt.com/docs/api/configuration/nuxt-config
// import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
	// content: {
	// 	build: {
	// 		markdown: {
	// 			remarkPlugins: {
	// 				'remark-gfm': {},
	// 				'remark-breaks': {},
	// 				'remark-oembed': {},
	// 				'remark-emoji': {},
	// 			},
	// 		},
	// 	},
	// },
	site: {
		url: 'https://shatteredsky.net',
		name: 'Shattered Sky',
	},
	app: {
		head: {
			link: [
				{
					href: '/favicon.ico',
					rel: 'icon',
					type: 'image/x-icon',
				},
			],
		},
	},
	build: {
		analyze: true,
		// transpile: ['vuetify'],
	},
	delayHydration: {
		mode: 'init',
	},
	devtools: {
		enabled: false,
	},
	modules: [
		// ['nuxt-og-image', {
		// 	ogImage: {
		// 		defaults: {
		// 			renderer: 'chromium',
		// 			screenshot: {
		// 				delay: 10000,
		// 			},
		// 		},
		// 	}
		// }],
		'@nuxtjs/seo',
		// '@nuxt/content',
		'@nuxt/eslint',
		['@nuxt/fonts', {
			fonts: {
				families: [
					{ name: 'JetBrainsMono Nerd Font Mono', provider: 'local' },
					// { name: 'JetBrains Mono' },
					{ name: 'Inter' },
					// specify specific font data - this will bypass any providers
					// { name: 'Other Font', src: 'https://example.com/font.woff2' },
				]
			}
		}],
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxt/scripts',
		'@nuxt/test-utils',
		'@nuxt/ui',
		'vuetify-nuxt-module',
		//
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
		// async (_options, nuxt) => {
		// 	nuxt.hooks.hook('vite:extendConfig', config => {
		// 		config.plugins?.push(vuetify({ autoImport: true }));
		// 	});
		// },
		// './modules/socket',
		// 'nuxt-socket-io',
		// '@unlighthouse/nuxt',
		'nuxt-security',
		'nuxt-delay-hydration',
		// 'nuxt-purgecss',
		// '@nuxtjs/html-validator', // Validator, temp disabled
		// [
		// 	'@nuxtjs/google-fonts',
		// 	{
		// 		families: {
		// 			Roboto: true,
		// 		},
		// 	},
		// ],
		[
			'@nuxtjs/i18n',
			{
				baseUrl: 'https://shatteredsky.net',
				defaultLocale: 'en',
				detectBrowserLanguage: {
					cookieKey: 'i18n_redirected',
					redirectOn: 'root',
					useCookie: true,
				},
				langDir: 'lang/',
				lazy: true,
				locales: [
					{
						code: 'en',
						file: 'en-US.json',
						iso: 'en-US',
						name: 'English',
					},
					{
						code: 'fr',
						file: 'fr-FR.json',
						iso: 'fr-FR',
						name: 'Français',
					},
					{
						code: 'zh',
						file: 'zh-CN.json',
						iso: 'zh-CN',
						name: '中文',
					},
				],
				seo: true,
				seoOptimise: true,
				strategy: 'no_prefix',
				// vueI18n: {
				// 	compositionOnly: false,
				// 	fallbackLocale: 'en',
				// 	legacy: false,
				// 	runtimeOnly: false,
				// },
			},
		],
	],

	nitro: {
		preset: 'cloudflare_module',
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
		},
		experimental: {
			wasm: true,
		},
	},

	ogImage: {
		enabled: false,
	},

	robots: {
		disallow: [
			'/cdn-cgi/',
			'/wp-login.php',
			'/wp-admin/',
			'/.git',
			'/.env',
		],
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
	security: {
		headers: {
			// crossOriginOpenerPolicy: false,
			// crossOriginEmbedderPolicy: {
			// 	route: '/social',
			// 	value: 'unsafe-none',
			// },

			// crossOriginResourcePolicy: {
			// 	route: '/**',
			// 	// value: 'cross-origin',
			// 	value: 'same-origin',
			// },
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
		// ogTitleTemplate: '%pageTitle',
	},
	vite: {
		server: {
			allowedHosts: ['localhost', 'shatteredsky.net'],
		},
		build: {
			emptyOutDir: true,
		},
		define: {
			'process.env.DEBUG': false,
		},
	},
	compatibilityDate: '2026-04-18',
})
