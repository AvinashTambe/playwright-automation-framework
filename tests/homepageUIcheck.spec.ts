import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';


test('homepage test', async ({ page }) => {

    let homePage = new HomePage (page);
    await homePage.navigate();
    await page.waitForTimeout(3000);

    await homePage.uitest();
    await page.waitForTimeout(3000);

    await homePage.search('Iphone');

});