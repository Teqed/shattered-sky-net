// /plugins/ga.client.js

import VueGtag from 'vue-gtag';

// export default ({ isDev, app }) => {
// 	if (!isDev) {
// 		Vue.use(VueGtag, {
// 			config: { id: 'G-2FGMFZNKDY' }
// 		},
// 		app.router);
// 	} else {
// 		console.log('Skipping GA in development')
// 	}
// }

// export default defineNuxtPlugin((nuxtApp) => {
// 	if (!nuxtApp.vueApp.isDev) {
// 	useNuxtApp(VueGtag, {
// 		config: { id: 'G-2FGMFZNKDY' }
// 	},
// 	nuxtApp.vueApp.router);
// }
// })

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueGtag, {
		config: {
			id: 'G-2FGMFZNKDY'
		}
	}, nuxtApp.vueApp.router)
	// trackRouter(useRouter())
})
