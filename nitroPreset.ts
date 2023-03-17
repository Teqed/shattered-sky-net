import type { NitroPreset } from 'nitropack';

export default {
	// entry: 'entry',
	// externals: true,
	// serveStatic: true,
	extends: 'node-server',
	entry: 'entry',
	experimental: {
		wasm: true,
	}
} as NitroPreset;
