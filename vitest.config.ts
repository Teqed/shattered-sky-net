/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		include: ['**/*.spec.ts'],
		exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
	},
});
