const axios = require('axios');
const jwt = require('jsonwebtoken');

const testDebtAPI = async () => {
  try {
    const token = jwt.sign({ id: '69de7624af0681e4cdbbd1a6', role: 'finance' }, 'your_super_secret_key_123');
    
    console.log('🔍 Testing Debt Management API (Full Data)...');
    const response = await axios.get('http://localhost:5000/api/finance/debt', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log('✅ API Response Success');
      console.log('📊 Stats:', JSON.stringify(response.data.data.stats, null, 2));
      console.log(`📋 Total Items: ${response.data.data.debtData.length}`);
      
      console.log('\n📝 All Debt Items:');
      response.data.data.debtData.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name}`);
        console.log(`   Area: "${item.area}"`);
        console.log(`   Tax Code: ${item.taxCode}`);
        console.log(`   Remaining: ${(item.remaining / 1000000).toFixed(1)} triệu VNĐ`);
        console.log(`   Status: ${item.statusText}`);
        console.log('');
      });
    } else {
      console.error('❌ API failed:', response.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testDebtAPI();