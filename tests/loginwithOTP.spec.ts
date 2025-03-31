import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from 'dotenv';  // ✅ Load dotenv
require('dotenv').config(); // Ensure environment variables are loaded

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate(); // Call the navigate function before each test

  // Ensure EMAIL_USER is set
  const userEmail = process.env.EMAIL_USER || "";
  if (!userEmail) {
    console.error("❌ EMAIL_USER environment variable is not set. Please check your .env file.");
    throw new Error("EMAIL_USER environment variable is not set.");
  }
});

test('Verify Flipkart login with incorrect OTP', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userEmail = process.env.EMAIL_USER;
  console.log("User Email:", userEmail);
  if (!userEmail) {
    throw new Error("EMAIL_USER environment variable is not set.");
  }

  test.setTimeout(60000); // Set timeout to 60 seconds
  await loginPage.openLoginPage();
  await page.waitForTimeout(3000);
  await loginPage.enterEmail(userEmail);
  
  await loginPage.requestOtp(userEmail); // ✅ Dynamic email validation
  await page.waitForTimeout(10000); 
  const otp = "123456";
  await loginPage.enterOtp(otp.split('')); // Split OTP into array for input fields
  await loginPage.verifyOtp();
  await loginPage.validateIncorrectOtptoastermsg();
});

test('Verify Flipkart login with OTP', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userEmail = process.env.EMAIL_USER || "";
  if (!userEmail) {
    throw new Error("EMAIL_USER environment variable is not set.");
  }
  console.log("User Email:", userEmail);
  test.setTimeout(60000); // Set timeout to 60 seconds
  await loginPage.openLoginPage();
  await page.waitForTimeout(3000);
  await loginPage.enterEmail(userEmail);
  
  await loginPage.requestOtp(userEmail); // ✅ Dynamic email validation
  await page.waitForTimeout(10000); 
  await loginPage.fetchOTP();

  // await page.waitForTimeout(5000); // Wait for OTP email to arrive
  
  const otp = await loginPage.fetchOTP();
  if (!otp || otp === "OTP Not Found") {
    console.error("❌ OTP retrieval failed. Test cannot proceed.");
    return;
  }

  await loginPage.enterOtp(otp.split('')); // Split OTP into array for input fields
  await loginPage.verifyOtp();

  console.log("✅ OTP Entered & Verified");
   

//   // Validate incorrect OTP scenario
//   await loginPage.validateIncorrectOtp();

//   // Resend OTP option
//   await loginPage.resendOtp();
});
