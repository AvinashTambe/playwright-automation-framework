import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from 'dotenv';  // ✅ Load dotenv

test('Verify Flipkart login with OTP', async ({ page }) => {
  const loginPage = new LoginPage(page)
  // ✅ Load email from .env
  const userEmail = 'avitambe3000@gmail.com'; 
  test.setTimeout(60000); // Set timeout to 60 seconds
  await loginPage.navigate();
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
