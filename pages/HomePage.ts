import { test, expect } from "@playwright/test";  // ✅ Importing necessary Playwright modules

export class HomePage {
  page: any;
  logo: any;
  searchbar_textbox: any;
  search_button: any;
  login_button: any;
  cart_button: any;
  reseller_button: any;
  hammenu_button: any;
  
  constructor(page) {
    this.page = page;
    this.logo = page.locator("//img[@title='Flipkart']"); // 🏷️ Flipkart logo locator
    this.searchbar_textbox = page.getByRole('textbox', { name: 'Search for Products, Brands' }); //🔍 Search bar
    this.search_button = page.getByRole('button', { name: 'Search for Products, Brands' });
    this.login_button = page.getByRole("link", { name: "Login Login" }); // 🔑 Login button
    this.cart_button = page.getByRole("link", { name: "Cart" }).first(); // 🛒 Cart button
    this.reseller_button = page.getByRole('banner').getByText('Become a Seller') // 🏪 Become a Seller button
    this.hammenu_button = page.getByRole('link', { name: 'Dropdown with more help links' }); // 🍔 Hamburger menu button
    // this.categories =  // 📌 Placeholder for categories (to be implemented)
  }

  async navigate() {
    console.log('🌍 Navigating to Flipkart')
    await this.page.goto("https://www.flipkart.com");  
    await this.page.waitForLoadState('domcontentloaded');
    console.log("✅ Application launched successfully");
  }

  async uitest() {
    await expect(this.logo).toBeVisible(); // ✅ Checking if Flipkart logo is visible
    console.log("✅ Flipkart logo is visible");
    
    await expect(this.searchbar_textbox).toBeVisible(); // 🔍 Search bar check
    console.log("✅ Search bar is visible");
    
    await expect(this.login_button).toBeVisible(); // 🔑 Login button check
    console.log("✅ Login button is visible");
    
    await expect(this.cart_button).toBeVisible(); // 🛒 Cart button check
    console.log("✅ Cart button is visible");
    
    await expect(this.reseller_button).toBeVisible(); // 🏪 Become a Seller button check
    console.log("✅ Become Reseller button is visible");
    
    await expect(this.hammenu_button).toBeVisible(); // 🍔 Hamburger menu check
    console.log("✅ Hamburger menu button is visible");
  }

  async search(search_key) {
    await this.searchbar_textbox.fill(search_key);
    await this.search_button.click();
  }


}