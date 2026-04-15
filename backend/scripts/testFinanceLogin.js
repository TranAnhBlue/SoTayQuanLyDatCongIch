const axios = require('axios');

const testFinanceLogin = async () => {
  try {
    console.log('🔐 Testing Finance user login...');
    
    // Login with Finance credentials
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'finance@datviet.vn',
      password: '123456'
    });

    if (loginResponse.data.success) {
      const { token, user } = loginResponse.data;
      
      console.log('✅ Login successful!');
      console.log('- User:', user.name, `(${user.role})`);
      console.log('- Token (first 50 chars):', token.substring(0, 50) + '...');
      
      // Test Finance Dashboard API with the real token
      console.log('\n🚀 Testing Finance Dashboard API...');
      const dashboardResponse = await axios.get('http://localhost:5000/api/finance/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (dashboardResponse.data.success) {
        console.log('✅ Dashboard API successful!');
        console.log('- Stats:', JSON.stringify(dashboardResponse.data.data.stats, null, 2));
        console.log('- Monthly Data Count:', dashboardResponse.data.data.monthlyData.length);
        console.log('- Urgent Items Count:', dashboardResponse.data.data.urgentItems.length);
        
        console.log('\n📋 Instructions for Frontend:');
        console.log('1. Login with: finance@datviet.vn / 123456');
        console.log('2. Check browser console for detailed logs');
        console.log('3. Verify Network tab shows successful API calls');
        console.log('4. Clear browser cache if needed');
      } else {
        console.error('❌ Dashboard API failed:', dashboardResponse.data);
      }
    } else {
      console.error('❌ Login failed:', loginResponse.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testFinanceLogin();