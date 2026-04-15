const axios = require('axios');
const jwt = require('jsonwebtoken');

const testDocumentsAPI = async () => {
  try {
    const token = jwt.sign({ id: '69de7624af0681e4cdbbd1a6', role: 'finance' }, 'your_super_secret_key_123');
    
    console.log('🔍 Testing Documents Management API...');
    
    const response = await axios.get('http://localhost:5000/api/finance/documents', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log('✅ API Response Success');
      console.log(`📋 Total Documents: ${response.data.data.total}`);
      console.log(`📄 Documents in current page: ${response.data.data.documents.length}`);
      
      if (response.data.data.documents.length > 0) {
        console.log('\n📝 First 5 documents:');
        response.data.data.documents.slice(0, 5).forEach((doc, index) => {
          console.log(`${index + 1}. Code: ${doc.code}`);
          console.log(`   Date: ${doc.date}`);
          console.log(`   Payer: ${doc.payer}`);
          console.log(`   Amount: ${doc.amount.toLocaleString('vi-VN')} VNĐ`);
          console.log(`   Status: ${doc.statusText}`);
          console.log(`   Purpose: ${doc.purpose}`);
          console.log('');
        });
      } else {
        console.log('❌ No documents found!');
      }
    } else {
      console.error('❌ API failed:', response.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testDocumentsAPI();