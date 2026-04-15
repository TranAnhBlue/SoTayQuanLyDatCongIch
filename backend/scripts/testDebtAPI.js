const axios = require('axios');
const jwt = require('jsonwebtoken');

const testDebtAPI = async () => {
  try {
    const token = jwt.sign({ id: '69de7624af0681e4cdbbd1a6', role: 'finance' }, 'your_super_secret_key_123');
    
    console.log('🔍 Testing Debt Management API...');
    const response = await axios.get('http://localhost:5000/api/finance/debt', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ API Response:');
    console.log('Success:', response.data.success);
    console.log('Stats:', JSON.stringify(response.data.data.stats, null, 2));
    console.log('Debt Data Count:', response.data.data.debtData.length);
    console.log('Total Records:', response.data.data.total);
    
    if (response.data.data.debtData.length > 0) {
      console.log('First Debt Item:', JSON.stringify(response.data.data.debtData[0], null, 2));
    } else {
      console.log('❌ No debt data found!');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testDebtAPI();