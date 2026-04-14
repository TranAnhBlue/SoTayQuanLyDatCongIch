require('dotenv').config();

console.log('🔧 Google OAuth Setup Guide');
console.log('=====================================');
console.log('Current Configuration:');
console.log('• CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('• REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);
console.log('• CLIENT_URL:', process.env.CLIENT_URL);
console.log('=====================================');

console.log('\n📋 Google Cloud Console Setup:');
console.log('1. Go to: https://console.cloud.google.com/');
console.log('2. Select/Create Project: "Dat Viet Core"');
console.log('3. Enable APIs: Google+ API');
console.log('4. Create OAuth 2.0 Client ID with:');
console.log('   • Application type: Web application');
console.log('   • Authorized JavaScript origins:');
console.log('     - http://localhost:5173');
console.log('     - http://localhost:3000');
console.log('   • Authorized redirect URIs:');
console.log('     - http://localhost:5000/api/auth/google/callback');
console.log('=====================================');

console.log('\n🔗 Test URLs:');
console.log('• Direct OAuth URL:');
const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&scope=profile email&response_type=code`;
console.log(googleAuthUrl);
console.log('\n• Backend Auth Endpoint:');
console.log('http://localhost:5000/api/auth/google');
console.log('\n• Frontend Login Page:');
console.log('http://localhost:5173/login');
console.log('=====================================');