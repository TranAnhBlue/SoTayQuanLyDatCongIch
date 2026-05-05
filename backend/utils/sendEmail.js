const axios = require('axios');

const sendEmail = async (options) => {
    try {
        console.log('🚀 Sending email via Resend API...');
        
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is missing in environment variables');
        }

        const response = await axios.post('https://api.resend.com/emails', {
            from: process.env.FROM_NAME ? `${process.env.FROM_NAME} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>` : `Hệ thống Quản lý Đất đai <onboarding@resend.dev>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Email sent successfully via Resend!', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Resend API Error:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = sendEmail;