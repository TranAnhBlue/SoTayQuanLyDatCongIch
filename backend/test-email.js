const sendEmail = require('./utils/sendEmail');
const { getOTPEmailTemplate } = require('./utils/emailTemplates');
require('dotenv').config();

const testEmail = async () => {
    try {
        console.log('🧪 Testing email configuration...');
        console.log('📧 SMTP Email:', process.env.SMTP_EMAIL);
        console.log('🔑 SMTP Password:', process.env.SMTP_PASSWORD ? '***configured***' : 'NOT SET');
        
        const testOTP = '123456';
        const emailHtml = getOTPEmailTemplate(testOTP, 'Test User');
        
        await sendEmail({
            email: 'tranducanh220604@gmail.com',
            subject: 'Test Email - Đất Việt Core OTP',
            html: emailHtml
        });
        
        console.log('✅ Test email sent successfully!');
    } catch (error) {
        console.error('❌ Test email failed:', error.message);
        console.error('Full error:', error);
    }
};

testEmail();