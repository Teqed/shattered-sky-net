import { test, expect, Page } from "@playwright/test";

test.describe("visits all pages", async () => {
	test.describe.configure({ mode: 'parallel' });
	test("visits the app root url", async ({ page, baseURL }) => {
	  await page.goto(baseURL + "/");
	  await expect(page.locator("div.greetings")).toHaveText(/Shattered Sky/);
	});
	
	test("visits the files url", async ({ page, baseURL }) => {
		await page.goto(baseURL + "/files")
		await expect(page.locator("h3").nth(1)).toHaveText(/Files/);
	  });
	
	  test("visits the tabletop url", async ({ page, baseURL }) => {
		  await page.goto(baseURL + "/tabletop")
		  await expect(page.locator("h3").nth(1)).toHaveText(/Tabletop/);
		});
	
		test("visits the stream url", async ({ page, baseURL }) => {
		  await page.goto(baseURL + "/stream")
		  await expect(page.locator("h3").nth(1)).toHaveText(/Stream/);
		});
	
		test("visits the social url", async ({ page, baseURL }) => {
			await page.goto(baseURL + "/social")
			await expect(page.locator("h3").nth(1)).toHaveText(/Social/);
		  });
		  
	
		  test("visits the about url", async ({ page, baseURL }) => {
			await page.goto(baseURL + "/about")
			await expect(page.locator("h3").nth(1)).toHaveText(/About/);
		  });

});

