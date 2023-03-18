// plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
// import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		ssr: true,
		// components,
		// directives,
		// icons: {
		// 	defaultSet: 'mdi',
		// 	aliases,
		// 	sets: {
		// 		mdi,
		// 	},
		// }
	})

	nuxtApp.vueApp.use(vuetify)
})
