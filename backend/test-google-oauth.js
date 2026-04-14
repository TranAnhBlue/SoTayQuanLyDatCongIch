#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

console.log('🧪 TESTING GOOGLE OAUTH CONFIGURATION');
console.log('=====================================\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
console.log(`   GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Configured' : '❌ Missing'}`);
console.log(`   GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL}`);
console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}\n`);

// Generate test URLs
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL)}&scope=profile%20email&response_type=code`;

console.log('🔗 Test URLs:');
console.log(`   Auth URL: ${authUrl}`);
console.log(`   Callback URL: ${process.env.GOOGLE_CALLBACK_URL}\n`);

console.log('🎯 NEXT STEPS:');
console.log('1. Copy the Auth URL above and paste it in your browser');
console.log('2. If you get "redirect_uri_mismatch" error, follow the setup guide');
console.log('3. If it works, you should be redirected to your callback URL');
console.log('4. Make sure your server is running on port 5000\n');

console.log('🔧 Google Cloud Console Configuration:');
console.log('   → Go to: https://console.cloud.google.com/apis/credentials');
console.log('   → Find your OAuth 2.0 Client ID');
console.log('   → Add these Authorized JavaScript origins:');
console.log('     • http://localhost:5173');
console.log('     • http://localhost:3000');
console.log('     • http://localhost:5000');
console.log('   → Add this Authorized redirect URI:');
console.log(`     • ${process.env.GOOGLE_CALLBACK_URL}`);
console.log('   → Save and wait a few minutes for changes to take effect\n');

// Test if server is running
const axios = require('axios');

async function testServer() {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
            timeout: 3000,
            validateStatus: () => true // Accept any status code
        });
        
        if (response.status === 401) {
            console.log('✅ Server is running on port 5000 (got expected 401 for protected route)');
        } else {
            console.log(`✅ Server is running on port 5000 (status: ${response.status})`);
        }
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Server is NOT running on port 5000');
            console.log('   Please start your server with: npm run dev');
        } else {
            console.log(`⚠️  Server test inconclusive: ${error.message}`);
        }
    }
}

testServer();