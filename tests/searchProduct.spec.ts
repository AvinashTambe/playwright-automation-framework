import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test.beforeEach(async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigate(); // Call the navigate function before each test
});

test('Search with invalid product name', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const searchKey = 'InvalidProductName12345'
    await searchPage.keywordsearch(searchKey);
    await page.waitForTimeout(2000);
    await searchPage.validatesearch(searchKey);
    await page.waitForTimeout(2000);
});

test('Search with emojis', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const searchKey = '📱'
    await searchPage.keywordsearch(searchKey);
    await page.waitForTimeout(2000);
    await searchPage.validatesearch(searchKey);
    await page.waitForTimeout(2000); 
}); 

test('Search long text', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const searchKey = 'Samsung Galaxy S24 Ultra 5G 12GB RAM 512GB Storage with 200MP Camera, 5000mAh Battery, Dynamic AMOLED 2X Display, Snapdragon 8 Gen 3 Processor, S Pen Support, AI-powered Photography, and 4 Years of Software Updates'
    await searchPage.keywordsearch(searchKey);
    await page.waitForTimeout(2000);
    const expectedsearch = 'samsung galaxy s24 ultra storage with camera, battery, dynamic amoled 2x display, snapdragon 8'
    await searchPage.validatesearch(expectedsearch);
    await page.waitForTimeout(2000);
});

test('Search with Valid Product name', async ({ page}) =>{
    const searchPage = new SearchPage(page);
    const searchKey = 'Mobile'
    const minPrice = 10000;
    const maxPrice = 30000;
    await searchPage.keywordsearch(searchKey);
    await page.waitForTimeout(2000);
    await searchPage.validatesearch(searchKey);
    await page.waitForTimeout(2000);
    await searchPage.applypricefilter(minPrice,maxPrice);
    await searchPage.validateAppliedPriceFilter(minPrice, maxPrice);
    //define brand to search
    const brand = 'Apple';    
    await searchPage.searchbybrand(brand);
    await searchPage.validateAppliedBrandFilter(brand);
});