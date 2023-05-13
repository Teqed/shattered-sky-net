export default defineI18nConfig(() => ({
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
	vueI18n: {
		compositionOnly: false,

		// locale: 'fr',
		fallbackLocale: 'en',
		legacy: false,
		runtimeOnly: false,
	},
}));
