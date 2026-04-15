const axios = require('axios');
const jwt = require('jsonwebtoken');

const testFinancialReports2026 = async () => {
  try {
    const token = jwt.sign({ id: '69de7624af0681e4cdbbd1a6', role: 'finance' }, 'your_super_secret_key_123');
    
    console.log('🔍 Testing Financial Reports API for Q2 2026...');
    
    const response = await axios.get('http://localhost:5000/api/finance/reports', {
      params: { period: 'q2-2026' },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log('✅ API Response Success');
      console.log('📊 Stats:', JSON.stringify(response.data.data.stats, null, 2));
      console.log(`📋 Report Data Count: ${response.data.data.reportData.length}`);
      
      if (response.data.data.reportData.length > 0) {
        console.log('\n📝 First 3 report items:');
        response.data.data.reportData.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. Code: ${item.code}`);
          console.log(`   Unit: ${item.unit}`);
          console.log(`   Area: ${item.area} m²`);
          console.log(`   Total Amount: ${(item.totalAmount / 1000000).toFixed(1)} triệu VNĐ`);
          console.log(`   Paid: ${(item.paid / 1000000).toFixed(1)} triệu VNĐ`);
          console.log(`   Remaining: ${(item.remaining / 1000000).toFixed(1)} triệu VNĐ`);
          console.log('');
        });
      }
    } else {
      console.error('❌ API failed:', response.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testFinancialReports2026();