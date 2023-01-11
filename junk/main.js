// main.js
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
export function createMyApp(){
	createApp({
	  data() {
		const x = 2;
		const y = 3;
		let z = 0;
		z = (x + y);
		return {
		  message: z
		}
	  }
	}).mount('#app');
  }
  