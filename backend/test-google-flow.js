#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const axios = require('axios');

console.log('🧪 TESTING GOOGLE OAUTH FLOW');
console.log('=============================\n');

async function testGoogleOAuthFlow() {
    try {
        console.log('📋 Step 1: Testing server connectivity...');
        
        // Test if server is running
        const serverResponse = await axios.get('http://localhost:5000/api/auth/me', {
            timeout: 3000,
            validateStatus: () => true
        });
        
        if (serverResponse.status === 401) {
            console.log('✅ Server is running on port 5000');
        } else {
            console.log(`✅ Server is running (status: ${serverResponse.status})`);
        }
        
        console.log('\n📋 Step 2: Testing Google OAuth redirect...');
        
        // Test Google OAuth redirect
        const googleResponse = await axios.get('http://localhost:5000/api/auth/google', {
            timeout: 5000,
            maxRedirects: 0,
            validateStatus: () => true
        });
        
        if (googleResponse.status === 302) {
            console.log('✅ Google OAuth redirect is working');
            console.log(`   Redirect URL: ${googleResponse.headers.location}`);
            
            // Check if redirect URL contains correct parameters
            const redirectUrl = googleResponse.headers.location;
            const hasGoogleDomain = redirectUrl.includes('accounts.google.com');
            const hasClientId = redirectUrl.includes(process.env.GOOGLE_CLIENT_ID);
            const hasCallbackUrl = redirectUrl.includes('localhost:5000');
            
            console.log(`   - Google domain: ${hasGoogleDomain ? '✅' : '❌'}`);
            console.log(`   - Client ID: ${hasClientId ? '✅' : '❌'}`);
            console.log(`   - Callback URL: ${hasCallbackUrl ? '✅' : '❌'}`);
            
            if (hasGoogleDomain && hasClientId && hasCallbackUrl) {
                console.log('✅ Redirect URL contains all required parameters');
            } else {
                console.log('⚠️  Some parameters may be missing (this might be OK)');
            }
        } else {
            console.log(`❌ Google OAuth redirect failed (status: ${googleResponse.status})`);
        }
        
        console.log('\n📋 Step 3: Configuration summary...');
        console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
        console.log(`   GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL}`);
        console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}`);
        
        console.log('\n🎯 NEXT STEPS:');
        console.log('1. Make sure Google Cloud Console is configured correctly');
        console.log('2. Open frontend: http://localhost:5173/login');
        console.log('3. Click "Đăng nhập với Google"');
        console.log('4. Check browser console for debug messages');
        console.log('5. If popup doesn\'t close automatically, check for JavaScript errors');
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Server is not running on port 5000');
            console.log('   Please start your server with: npm run dev');
        } else {
            console.log(`❌ Test failed: ${error.message}`);
        }
    }
}

testGoogleOAuthFlow();