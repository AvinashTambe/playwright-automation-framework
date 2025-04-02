import { test, expect } from '@playwright/test';

export class SearchPage{
    page: any;
    searchbar_textbox: any;
    search_button: any;
    search_mobile: any;
    searchResultsText: any;
    minprice_dropdown: any;
    maxprice_dropdown: any;
    filter: any;
    searchbrand: any;
    brandFilterOption: any;
    invalidSearchText: any;

    constructor(page){
        this.page = page;
        this.searchbar_textbox = page.getByRole('textbox', { name: 'Search for Products, Brands' }); //🔍 Search bar
        this.search_button = page.getByRole('button', { name: 'Search for Products, Brands' });
        this.search_mobile = page.getByLabel('Mobiles'); //Mobiles Category button
        this.searchResultsText = page.locator("//span[@class='BUOuZu']");  // Locator for search results text
        this.minprice_dropdown = page.locator("//div[@class='suthUA']//select[@class='Gn+jFg']"); //Min Price dropdown button
        this.maxprice_dropdown = page.locator("//div[@class='tKgS7w']//select[@class='Gn+jFg']"); //Max Price dropdown button
        this.filter = page.locator("//div[@class='_6tw8ju']") // Locator of showing applied filter
        this.searchbrand = page.getByRole('textbox', {name: "Search Brand"}); //Locator for search brand filter
        this.brandFilterOption = (brand) => page.getByTitle(brand).locator('div').nth(1); // Dynamic brand locator
        this.invalidSearchText = page.locator('.BHPsUQ') // Locator for invalid search text
    }

    async navigate() {
        await this.page.goto("https://www.flipkart.com");
        await this.page.waitForLoadState('domcontentloaded');
        console.log("✅ Navigated to Flipkart search page");
    }

    async keywordsearch(search_key){
        console.log(`🔍 Searching for: ${search_key}`);
        await this.searchbar_textbox.fill(search_key);
        await this.search_button.click();
    }

    async validatesearch(expectedsearchkey) {
        console.log(`🔍 Validating Search for: ${expectedsearchkey}`);
    
        // Check if the "Sorry, no results found!" message is visible
        const isNoResultsVisible = await this.invalidSearchText.isVisible();
    
        if (isNoResultsVisible) {
            const noResultsMessage = await this.invalidSearchText.textContent();
            expect(noResultsMessage).toContain("Sorry, no results found!");  // Validate "no results" message
            console.log(`❌ No results found for: ${expectedsearchkey}`);
        } else {
            await expect(this.searchResultsText).toBeVisible();  // Ensure search result text is visible
            const searchResultText = await this.searchResultsText.textContent();
    
            console.log(`🔍 Search results message: ${searchResultText}`);
            console.log(`✅ Results found for: ${expectedsearchkey}`);
            expect(searchResultText).toContain(expectedsearchkey); // Validate search result contains expected key
        }
    }
    
     

    async applypricefilter(minPrice, maxPrice){
        console.log(`🔹 Applying price filter: Min=${minPrice}, Max=${maxPrice}`);

        // Select Min Price
        await this.minprice_dropdown.selectOption({ value: `${minPrice}` });
        await this.page.waitForTimeout(1000); // Wait for options to refresh

        // Select Max Price
        await this.maxprice_dropdown.selectOption({ value: `${maxPrice}` });
        await this.page.waitForLoadState('domcontentloaded');

        console.log("✅ Price filter applied successfully");
    }

    async validateAppliedPriceFilter(expectedMin, expectedMax) {
        await this.filter.waitFor();
        const filterText = await this.filter.textContent();
    
        console.log(`🔍 Extracted Filter Text: ${filterText}`);
    
        // Extracting numbers from the price filter text correctly
        const priceMatch = filterText.match(/\d+/g);
        
        if (priceMatch && priceMatch.length >= 2) {
            let appliedMin = parseInt(priceMatch[0], 10);
            let appliedMax = parseInt(priceMatch[1], 10);
    
            console.log(`✅ Parsed Min Price: ${appliedMin}, Max Price: ${appliedMax}`);
    
            expect(appliedMin).toBe(expectedMin);
            expect(appliedMax).toBe(expectedMax);
        } else {
            throw new Error("❌ Unable to extract min and max price from filter text");
        }
    }
    
    async searchbybrand(brand) {
        // Ensure the search box is visible before interacting
        await this.searchbrand.waitFor({ state: 'visible', timeout: 5000 });
    
        // Enter the brand name and press Enter
        await this.searchbrand.fill(brand);
        await this.searchbrand.press('Enter');
    
        // Wait for the brand filter option to appear
        const brandOption = this.brandFilterOption(brand);
        await brandOption.waitFor({ state: 'visible', timeout: 5000 });
    
        // Click on the brand filter option
        await brandOption.click();
    
        console.log(`✅ Applied brand filter for: ${brand}`);
    }
    
    async validateAppliedBrandFilter(brand){
        await this.filter.waitFor();
        const filterText = await this.filter.textContent();
    
        console.log(`🔍 Extracted Filter Text: ${filterText}`);
    }

}   