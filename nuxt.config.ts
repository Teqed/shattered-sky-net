// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
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
		transpile: ['vuetify'],
	},
	delayHydration: {
		mode: 'init',
	},
	devtools: {
		enabled: false,
	},
	extends: ['nuxt-seo-kit'],
	i18n: {
		baseUrl: 'https://shatteredsky.net',
		defaultLocale: 'en-US',
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
		// seo: true,
		// seoOptimise: true,
		strategy: 'no_prefix',
		// vueI18n: 'i18n.config.ts', // if you are using custom path, default
	},
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
		'@nuxtjs/i18n',
	],

	nitro: {
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
			siteUrl: 'https://shatteredsky.net',
		},
	},
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
		},
		define: {
			'process.env.DEBUG': false,
		},
	},
});
