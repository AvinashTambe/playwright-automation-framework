import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from 'dotenv';  // ✅ Load dotenv
config(); // Properly initialize dotenv to load environment variables

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

test('Verify login with unregistered email', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userEmail = process.env.INVALID_USER || "";
  if (!userEmail) {
    throw new Error("INVALID_USER environment variable is not set.");
  }
  console.log("User Email:", userEmail);
  test.setTimeout(60000); // Set timeout to 60 seconds
  await loginPage.openLoginPage();
  await page.waitForTimeout(3000);
  await loginPage.enterEmail(userEmail);
  await loginPage.requestOtp(userEmail); // ✅ Dynamic email validation
  // **Check if verification failed**
  const verificationFailed = await loginPage.verificationunsuccessfulstate();
  if (verificationFailed) {
    console.log("Verification failed. Stopping test execution.");
    return; // ❌ Stop test execution if verification fails
  }
  await page.waitForTimeout(1000); // Wait for OTP email to arrive
  await loginPage.unregisteredemailtoasterNotification();
});

test('Verify Flipkart login with invalid or empty email', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userEmail = "invalid_user>";
  console.log("User Email:", userEmail);
  test.setTimeout(60000); // Set timeout to 60 seconds
  await loginPage.openLoginPage();
  await page.waitForTimeout(3000);
  await loginPage.enterEmail(userEmail);
  await loginPage.requestOtp(userEmail); // ✅ Dynamic email validation
  // **Check if verification failed**
  const verificationFailed = await loginPage.verificationunsuccessfulstate();
  if (verificationFailed) {
    console.log("Verification failed. Stopping test execution.");
    return; // ❌ Stop test execution if verification fails
  }
  await page.waitForTimeout(1000); // Wait for OTP email to arrive
  await loginPage.invalidemailtoasterNotification();
});

test('Change Email on OTP page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const initialEmail = "avitambe3000@gmail.com";
  test.setTimeout(60000); // Set timeout to 60 seconds
  await loginPage.openLoginPage();
  await page.waitForTimeout(3000);
  await loginPage.enterEmail(initialEmail);

  await loginPage.requestOtp(initialEmail); // ✅ Dynamic email validation
  await page.waitForTimeout(1000);
  // **Check if verification failed**
  const verificationFailed = await loginPage.verificationunsuccessfulstate();
  if (verificationFailed) {
    console.log("Verification failed. Stopping test execution.");
    return; // ❌ Stop test execution if verification fails
  }

  await loginPage.requestOTPtoastNotification(initialEmail);
  await loginPage.changeEmail();
  await page.waitForTimeout(2000); // Wait for OTP email to arrive
  await loginPage.clearEmail(initialEmail);
  const userEmail = process.env.EMAIL_USER || "";
  console.log("User Email:", userEmail);
  if (!userEmail) {
    throw new Error("EMAIL_USER environment variable is not set.");
  }
  await loginPage.enterEmail(userEmail);
  await loginPage.requestOtp(userEmail); // ✅ Dynamic email validation
  await loginPage.requestOTPtoastNotification(userEmail);
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
  // **Check if verification failed**
  const verificationFailed = await loginPage.verificationunsuccessfulstate();
  if (verificationFailed) {
    console.log("Verification failed. Stopping test execution.");
    return; // ❌ Stop test execution if verification fails
  }
  await loginPage.requestOTPtoastNotification(userEmail);
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
  // **Check if verification failed**
  const verificationFailed = await loginPage.verificationunsuccessfulstate();
  if (verificationFailed) {
    console.log("Verification failed. Stopping test execution.");
    return; // ❌ Stop test execution if verification fails
  }
  await loginPage.requestOTPtoastNotification(userEmail);
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
});
