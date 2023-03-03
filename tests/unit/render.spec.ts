import { describe, it, expect } from 'vitest';
import { setup, $fetch, createPage } from '@nuxt/test-utils';

describe('HomePage', async () => {
	await setup({
		// test context options
		// browser: true,
	});

	it('renders properly', async () => {
		const page = await createPage('/');
		const text = await page.innerText('body');

		expect(text).toContain('Shattered Sky');
	});
});
