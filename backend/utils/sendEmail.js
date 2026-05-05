const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log('🔧 Attempting to send email...');
        console.log(`📧 Destination: ${options.email}`);
        console.log(`📧 Service: Gmail`);
        console.log(`📧 User: ${process.env.EMAIL_USER || process.env.SMTP_EMAIL}`);
        
        // Create transporter with port 465 (SSL) - Often more stable on cloud networks
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER || process.env.SMTP_EMAIL,
                pass: (process.env.EMAIL_PASS || process.env.SMTP_PASSWORD || '').replace(/\s/g, ''),
            },
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000,
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