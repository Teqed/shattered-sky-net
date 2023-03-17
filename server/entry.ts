import 'node-fetch-native/polyfill'; // this was #internal/nitro/virtual/polyfill
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import destr from 'destr';
import { nitroApp } from 'nitropack/dist/runtime/app'; // this was "../app"
// import { useRuntimeConfig } from '#internal/nitro'; // replaced with Nuxt auto-imported useRuntimeConfig ... but it doesn't work!

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;

const server =
// @ts-expect-error
  cert && key ? new HttpsServer({ key, cert }, nitroApp.h3App.nodeHandler) : new HttpServer(nitroApp.h3App.nodeHandler);

const port = (destr(process.env.NITRO_PORT || process.env.PORT) || 3000) as number;
const hostname = process.env.NITRO_HOST || process.env.HOST || '0.0.0.0';

// @ts-expect-error ignore callback
server.listen(port, hostname, (error) => {
	if (error) {
		console.error(error);
		process.exit(1);
	}
	const protocol = cert && key ? 'https' : 'http';
	console.log(`Listening on ${protocol}://${hostname}:${port}${useRuntimeConfig().app.baseURL}`);
});

if (process.env.DEBUG) {
	process.on('unhandledRejection', error => console.error('[nitro] [dev] [unhandledRejection]', error));
	process.on('uncaughtException', error => console.error('[nitro] [dev] [uncaughtException]', error));
} else {
	process.on('unhandledRejection', error => console.error('[nitro] [dev] [unhandledRejection] ' + error));
	process.on('uncaughtException', error => console.error('[nitro] [dev] [uncaughtException] ' + error));
}

export default {};
