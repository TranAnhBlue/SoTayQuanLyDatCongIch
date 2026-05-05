const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log('🔧 Attempting to send email...');
        console.log(`📧 Destination: ${options.email}`);
        console.log(`📧 Service: Gmail`);
        console.log(`📧 User: ${process.env.EMAIL_USER || process.env.SMTP_EMAIL}`);
        
        // Force IPv4 globally for this process
        const dns = require('dns');
        if (dns.setDefaultResultOrder) {
            dns.setDefaultResultOrder('ipv4first');
        }

        // Create transporter and force IPv4 (Render has issues with IPv6 to Google)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || process.env.SMTP_EMAIL,
                pass: (process.env.EMAIL_PASS || process.env.SMTP_PASSWORD || '').replace(/\s/g, ''),
            },
            // Force IPv4 lookup explicitly
            lookup: (hostname, options, callback) => {
                dns.lookup(hostname, { family: 4 }, callback);
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