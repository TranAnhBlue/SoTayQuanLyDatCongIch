const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log('🔧 Configuring email transporter...');
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail service
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        console.log(`📧 Sending email to: ${options.email}`);
        console.log(`📧 From: ${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`);

        // Define email options
        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully! Message ID:', info.messageId);
        
        return info;
    } catch (error) {
        console.error('❌ Email sending error:', error.message);
        throw error;
    }
};

module.exports = sendEmail;