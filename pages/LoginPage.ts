import { test, expect, Page } from "@playwright/test";
import imaps from "imap-simple";
import dotenv from "dotenv";

dotenv.config();

export class LoginPage {
  static navigate(page: Page) {
    throw new Error('Method not implemented.');
  }
  page: any;
  loginLink: any;
  emailInput: any;
  requestOtpButton: any;
  otpInputs: any;
  verifyButton: any;
  errorMessage: any;
  resendOtpbutton: any;
  constructor(page) {
    this.page = page;
    this.loginLink = page.getByRole("link", { name: "Login Login" }); // ✅ Fixed typo "gaetByRole" → "getByRole"
    //this.emailInput = page.locator("//form//input[@type='text']").first();
    this.emailInput = page
      .locator("form")
      .filter({ hasText: "Enter Email/Mobile numberBy" })
      .getByRole("textbox");
    //this.emailInput = page.getByPlaceholder('Enter Email/Mobile number');
    this.requestOtpButton = page.getByRole("button", { name: "Request OTP" });
    this.otpInputs = page.locator("//div[@class='XDRRi5']//input");
    this.verifyButton = page.getByRole("button", { name: "Verify" });
    this.resendOtpbutton = page.getByText("Resend code");
    this.errorMessage = page.getByText("OTP is incorrect");
  }

  async navigate() {
    await this.page.goto("https://www.flipkart.com/");
  }

  async openLoginPage() {
    await this.loginLink.click();
    console.log("Login button clicked");
  }

  async enterEmail(email) {
    await this.emailInput.fill(email);
    console.log("Email entered");
    await this.page.waitForTimeout(1000);
  }

  async requestOtp(email) {
    await this.requestOtpButton.click();
    console.log("Request OTP button clicked");
    const verificationMessage = this.page.locator(`text=Verification code sent to ${email}`);
    await expect(verificationMessage).toBeVisible();
    console.group("Verification code sent confirmation displayed");
  }

  async fetchOTP(retryCount = 3, delayMs = 5000) {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      console.log(`📩 Attempt ${attempt}: Checking for OTP...`);
  
      try {
        const config = {
          imap: {
            user: process.env.EMAIL_USER || "",  // Ensure it's always a string
            password: process.env.EMAIL_PASS || "",
            host: process.env.IMAP_HOST || "",
            port: parseInt(process.env.IMAP_PORT || "993"),
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
            authTimeout: 15000,
            timeout: 15000
          }
        };
  
        console.log("📩 Connecting to IMAP...");
        const connection = await imaps.connect(config);
        await connection.openBox("INBOX");
        console.log("✅ IMAP Connection Successful");
  
        // ✅ Search for the latest 10 emails (no "UNSEEN" restriction)
        const searchCriteria = [["SINCE", new Date(Date.now() - 10 * 60 * 1000)]]; // Last 10 minutes
        const fetchOptions = { bodies: ["HEADER.FIELDS (SUBJECT FROM)", "TEXT"], markSeen: true };
  
        const messages = await connection.search(searchCriteria, fetchOptions);
  
        if (messages.length === 0) {
          console.log("⚠️ No OTP emails found.");
        } else {
          console.log(`📨 Retrieved ${messages.length} emails. Checking for OTP...`);
  
          // ✅ Process all emails and check for OTP
          for (const message of messages) {
            const headers = message.parts.find(part => part.which === "HEADER.FIELDS (SUBJECT FROM)")?.body || {};
            const body = message.parts.find(part => part.which === "TEXT")?.body || "";
  
            const subject = headers.subject?.[0] || "No Subject";
            const sender = headers.from?.[0] || "Unknown Sender";
  
            console.log(`📧 Email from: ${sender}`);
            console.log(`📄 Subject: ${subject}`);
  
            // ✅ Check if email is from Flipkart (handle different formats)
            if (!/flipkart\.com/i.test(sender)) continue;
  
            // ✅ Extract OTP from subject
            const otpMatch = subject.match(/\b\d{6}\b/);
            if (otpMatch) {
              console.log(`🔢 OTP from subject: ${otpMatch[0]}`);

              // ✅ Mark email as read & stop further processing
              // await connection.moveMessage(message.attributes.uid, "Read OTPs"); // Move to another folder (optional)
              await connection.addFlags(message.attributes.uid, ["\\Seen"]);
              return otpMatch[0];
            }
  
            // ✅ Extract OTP from body
            const bodyOtpMatch = body.match(/\b\d{6}\b/);
            if (bodyOtpMatch) {
              console.log(`🔢 OTP from body: ${bodyOtpMatch[0]}`);
              return bodyOtpMatch[0];
            }
          }
  
          console.log("⚠️ OTP not found in any email.");
        }
      } catch (error) {
        console.error("❌ IMAP Connection Failed:", error);
      }
  
      if (attempt < retryCount) {
        console.log(`⏳ Waiting ${delayMs / 1000} seconds before retrying...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  
    return null; // ❌ OTP retrieval failed
  }
    

  async enterOtp(otp) {
    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
    }
  }

  async verifyOtp() {
    await this.verifyButton.click();
  }

  async validateIncorrectOtptoastermsg() {
    await expect(this.errorMessage).toBeVisible();
  }

  async resendOtp() {
    await this.resendOtpbutton.click();
  }
}
