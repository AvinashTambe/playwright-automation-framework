import imaps from 'imap-simple';
import dotenv from 'dotenv';

dotenv.config();

export async function fetchOTP() {
    try {
        const config = {
            imap: {
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_PASS,
                host: process.env.IMAP_HOST,
                port: parseInt(process.env.IMAP_PORT || "993"),
                tls: true,
                tlsOptions: { rejectUnauthorized: false },
                authTimeout: 3000
            }
        };

        console.log("📩 Connecting to IMAP...");
        console.log(`🌐 Connecting to ${config.imap.host}:${config.imap.port}...`);

        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        console.log("✅ IMAP Connection Successful");

        const searchCriteria = [['UNSEEN'], ['FROM', 'hello@secomind.ai']];
        const fetchOptions = { bodies: ['HEADER'], markSeen: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("⚠️ No unread OTP emails found.");
            return;
        }

        const latestMessage = messages[messages.length - 1];

        const headersPart = latestMessage.parts ? latestMessage.parts.find(part => part.which === 'HEADER') : null;
        if (!headersPart) {
            console.error("❌ Email headers not found.");
            return;
        }

        const headers = headersPart.body;
        const subject = headers.subject ? headers.subject[0] : "No Subject";

        const otpMatch = subject.match(/\d{6}/);
        const otp = otpMatch ? otpMatch[0] : "OTP Not Found";

        console.log(`📧 Latest OTP Email: ${subject}`);
        console.log(`🔢 Extracted OTP: ${otp}`);
        return otp;
    } catch (error) {
        console.error("❌ IMAP Connection Failed:", error);
    }
}
