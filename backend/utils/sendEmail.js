const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log('🔧 Attempting to send email...');
        console.log(`📧 Destination: ${options.email}`);
        console.log(`📧 Service: Gmail`);
        console.log(`📧 User: ${process.env.EMAIL_USER || process.env.SMTP_EMAIL}`);
        
        // Manually resolve IPv4 to bypass Render's IPv6 issues
        const dns = require('dns').promises;
        let gmailIPv4 = '74.125.204.108'; // Default fallback IP
        try {
            const addresses = await dns.resolve4('smtp.gmail.com');
            if (addresses && addresses.length > 0) {
                gmailIPv4 = addresses[0];
            }
        } catch (dnsErr) {
            console.log('⚠️ DNS Resolve failed, using fallback IP');
        }

        console.log(`📡 Using SMTP IP: ${gmailIPv4}`);

        // Create transporter using numeric IP
        const transporter = nodemailer.createTransport({
            host: gmailIPv4,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || process.env.SMTP_EMAIL,
                pass: (process.env.EMAIL_PASS || process.env.SMTP_PASSWORD || '').replace(/\s/g, ''),
            },
            tls: {
                // IMPORTANT: Must specify servername for SSL certificate validation
                servername: 'smtp.gmail.com'
            },
            connectionTimeout: 20000,
            greetingTimeout: 20000,
            socketTimeout: 20000,
        });

        // Define email options
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'Hệ thống Quản lý Đất đai'}" <${process.env.EMAIL_USER || process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully! Message ID:', info.messageId);
        
        return info;
    } catch (error) {
        console.error('❌ DETAILED EMAIL ERROR:', error);
        throw error;
    }
};

module.exports = sendEmail;