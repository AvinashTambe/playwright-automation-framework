import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';


test('Validate Search functionality', async ({ page}) =>{

    const searchPage = new SearchPage(page);

    const searchKey = 'Mobile'
    const minPrice = 10000;
    const maxPrice = 30000;

    await searchPage.navigate();

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