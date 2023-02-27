// /plugins/ga.client.js

import VueGtag from 'vue-gtag';

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueGtag, {
		config: {
			id: 'G-2FGMFZNKDY'
		},
		onReady: () => {
			console.log('Google Analytics is ready');
		},
		onError: () => {
			// console.log('An error occurred while sending data to Google Analytics, but it is not critical:');
		},
		deferScriptLoad: true,
	}, nuxtApp.vueApp.router);
})
