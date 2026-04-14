// Debug script for checking authentication state
// Run this in browser console to debug auth issues

console.log('🔍 DEBUGGING AUTHENTICATION STATE');
console.log('==================================\n');

// Check localStorage with correct keys
console.log('📋 LocalStorage Data:');
console.log('   token:', localStorage.getItem('token'));
console.log('   user:', localStorage.getItem('user'));
console.log('   session:', localStorage.getItem('session'));

// Check sessionStorage
console.log('\n📋 SessionStorage Data:');
console.log('   token:', sessionStorage.getItem('token'));
console.log('   user:', sessionStorage.getItem('user'));

// Parse user data if exists
try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        console.log('\n👤 Parsed User Data:');
        console.log('   ID:', user.id);
        console.log('   Name:', user.name);
        console.log('   Email:', user.email);
        console.log('   Role:', user.role);
        console.log('   Avatar:', user.avatar);
    } else {
        console.log('\n❌ No user data found in localStorage');
    }
} catch (e) {
    console.log('\n❌ Error parsing user data:', e.message);
}

// Parse session data if exists
try {
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
        const session = JSON.parse(sessionStr);
        console.log('\n📅 Session Data:');
        console.log('   Login Time:', session.loginTime);
        console.log('   Expires At:', session.expiresAt);
        
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        console.log('   Current Time:', now.toISOString());
        console.log('   Valid:', now < expiresAt ? '✅ Yes' : '❌ Expired');
        
        if (now < expiresAt) {
            const timeLeft = Math.floor((expiresAt - now) / 1000 / 60);
            console.log('   Time Left:', timeLeft, 'minutes');
        }
    } else {
        console.log('\n❌ No session data found');
    }
} catch (e) {
    console.log('\n❌ Error parsing session data:', e.message);
}

// Check current URL and route
console.log('\n🌐 Current State:');
console.log('   URL:', window.location.href);
console.log('   Pathname:', window.location.pathname);
console.log('   Search:', window.location.search);

// Test auth functions if available
if (window.localStorage) {
    console.log('\n🧪 Testing Auth Functions:');
    
    // Simulate login function test
    console.log('   localStorage available: ✅');
    
    // Check if React app is loaded
    if (window.React) {
        console.log('   React loaded: ✅');
    } else {
        console.log('   React loaded: ❌');
    }
}

console.log('\n💡 Debug Tips:');
console.log('1. Check Network tab for failed API calls');
console.log('2. Look for JavaScript errors in Console');
console.log('3. Verify AuthContext is properly initialized');
console.log('4. Check if navigation/routing is working');
console.log('5. Test manual login to compare behavior');

// Function to clear all auth data
window.clearAuthData = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    sessionStorage.clear();
    console.log('🧹 All auth data cleared. Refresh page to test fresh login.');
};

// Function to simulate Google login success
window.simulateGoogleLogin = function() {
    const mockUser = {
        id: 'test123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'renter'
    };
    const mockToken = 'mock-jwt-token';
    
    // Simulate the login process
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    const session = {
        token: mockToken,
        user: mockUser,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem('session', JSON.stringify(session));
    
    console.log('🎭 Mock Google login simulated. Refresh page to see effect.');
};

console.log('\n🛠️  Available Debug Functions:');
console.log('   clearAuthData() - Clear all authentication data');
console.log('   simulateGoogleLogin() - Simulate a successful Google login');