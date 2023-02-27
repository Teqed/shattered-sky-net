// /plugins/ga.client.js

import VueGtag from 'vue-gtag';

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueGtag, {
		config: {
			id: 'G-2FGMFZNKDY'
		},
		onError: (_error) => {
			return true;
		},
		deferScriptLoad: true,
	}, nuxtApp.vueApp.router);
})
