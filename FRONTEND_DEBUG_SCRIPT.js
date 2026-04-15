// Finance Dashboard Debug Script
// Copy and paste this into browser console on Finance Dashboard page

console.log('🔧 Finance Dashboard Debug Script');
console.log('================================');

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

console.log('🔍 Authentication Check:');
console.log('- Token exists:', !!token);
console.log('- Token preview:', token ? token.substring(0, 30) + '...' : 'No token');
console.log('- User role:', user.role);
console.log('- User name:', user.name);

// Check if user has correct role
if (user.role !== 'finance' && user.role !== 'admin') {
    console.error('❌ User role not authorized for Finance Dashboard');
    console.log('💡 Please login with Finance credentials: finance@datviet.vn / 123456');
}

// Test API call manually
if (token) {
    console.log('\n🚀 Testing API call...');
    
    fetch('http://localhost:5000/api/finance/dashboard', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('📡 API Response Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('✅ API Response Data:', data);
        if (data.success) {
            console.log('📊 Stats:', data.data.stats);
            console.log('📈 Monthly Data Count:', data.data.monthlyData.length);
            console.log('⚠️ Urgent Items Count:', data.data.urgentItems.length);
        }
    })
    .catch(error => {
        console.error('❌ API Error:', error);
    });
} else {
    console.log('💡 No token found. Please login first.');
}

// Check server connectivity
console.log('\n🌐 Testing server connectivity...');
fetch('http://localhost:5000/health')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Server Health:', data);
    })
    .catch(error => {
        console.error('❌ Server Connection Error:', error);
        console.log('💡 Make sure backend server is running on port 5000');
    });

console.log('\n📋 Next Steps:');
console.log('1. If no token: Login with finance@datviet.vn / 123456');
console.log('2. If wrong role: Login with Finance account');
console.log('3. If API error: Check Network tab for details');
console.log('4. If server error: Restart backend server');