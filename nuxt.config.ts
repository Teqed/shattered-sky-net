// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from "node:url";
import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";
import { defineNuxtConfig } from 'nuxt/config'

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
		importToCDN({
		  modules: [
			autoComplete("vue"),
			{
			  name: "vue-router",
			  var: "VueRouter",
			  path: "dist/vue-router.global.prod.js",
			},
		  ],
		}),
	  ],
	  resolve: {
		alias: {
		  "@": fileURLToPath(new URL("./", import.meta.url)),
		},
	  },
	},
	app: {
		head: {
			link: [
			],
			"script": [
				// Import Vue from CDN URL
				{
					"src": "https://cdn.jsdelivr.net/npm/vue@3.2.45/dist/vue.global.prod.js",
				},
				// Import Vue Router from CDN URL
				{
					"src": "https://cdn.jsdelivr.net/npm/vue-router@4.1.6/dist/vue-router.global.prod.js",
				},
			],
		  },
	},
});