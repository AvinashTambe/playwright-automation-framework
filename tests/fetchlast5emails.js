import imaps from 'imap-simple';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("IMAP Host:", process.env.IMAP_HOST || "Not Found");  // Debugging
console.log("IMAP Port:", process.env.IMAP_PORT || "Not Found");

export async function fetchLastFiveEmails() {
    try {
        const config = {
            imap: {
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_PASS,
                host: process.env.IMAP_HOST,
                port: parseInt(process.env.IMAP_PORT || "993"),
                tls: true,
                tlsOptions: { rejectUnauthorized: false },
                authTimeout: 10000, // Increased timeout
            }
        };

        console.log(`📩 Connecting to IMAP at ${config.imap.host}:${config.imap.port}...`);

        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        console.log("✅ IMAP Connection Successful");

        // Fetch the last 5 emails
        const searchCriteria = ['ALL'];
        const fetchOptions = { bodies: ['HEADER'], markSeen: false };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("⚠️ No emails found.");
            return;
        }

        // Get the last 5 emails
        const lastFiveEmails = messages.slice(-5);

        lastFiveEmails.forEach((message, index) => {
            const headersPart = message.parts.find(part => part.which === 'HEADER');
            if (headersPart) {
                const headers = headersPart.body;
                const subject = headers.subject ? headers.subject[0] : "No Subject";
                console.log(`📧 Email ${index + 1}: ${subject}`);
            } else {
                console.log(`❌ Email ${index + 1}: Headers not found.`);
            }
        });

        connection.end();
    } catch (error) {
        console.error("❌ IMAP Connection Failed:", error);
    }
}

// Run the function
fetchLastFiveEmails();
