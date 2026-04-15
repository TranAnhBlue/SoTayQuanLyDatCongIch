const axios = require('axios');
const jwt = require('jsonwebtoken');

const testAPI = async () => {
  try {
    // Tạo token Finance với ID thật
    const token = jwt.sign(
      { id: '69de7624af0681e4cdbbd1a6', role: 'finance' }, 
      'your_super_secret_key_123'
    );

    console.log('🔑 Token:', token.substring(0, 50) + '...');

    // Test API Dashboard
    const response = await axios.get('http://localhost:5000/api/finance/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('\n📊 API Response:');
    console.log('Success:', response.data.success);
    console.log('Stats:', JSON.stringify(response.data.data.stats, null, 2));
    console.log('Monthly Data Count:', response.data.data.monthlyData.length);
    console.log('Urgent Items Count:', response.data.data.urgentItems.length);

  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
  }
};

testAPI();