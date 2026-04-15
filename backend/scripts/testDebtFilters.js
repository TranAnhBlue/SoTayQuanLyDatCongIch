const axios = require('axios');
const jwt = require('jsonwebtoken');

const testDebtFilters = async () => {
  try {
    const token = jwt.sign({ id: '69de7624af0681e4cdbbd1a6', role: 'finance' }, 'your_super_secret_key_123');
    
    console.log('🔍 Testing Debt Management Filters...\n');

    // Test 1: All data
    console.log('1. Test: All data');
    const allData = await axios.get('http://localhost:5000/api/finance/debt', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   Result: ${allData.data.data.debtData.length} items\n`);

    // Test 2: Filter by status - overdue only
    console.log('2. Test: Filter by status = overdue');
    const overdueData = await axios.get('http://localhost:5000/api/finance/debt', {
      params: { status: 'overdue' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   Result: ${overdueData.data.data.debtData.length} items`);
    if (overdueData.data.data.debtData.length > 0) {
      console.log(`   First item: ${overdueData.data.data.debtData[0].name} - ${overdueData.data.data.debtData[0].statusText}`);
    }
    console.log('');

    // Test 3: Filter by zone - Yên Khê
    console.log('3. Test: Filter by zone = yen-khe');
    const yenKheData = await axios.get('http://localhost:5000/api/finance/debt', {
      params: { zone: 'yen-khe' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   Result: ${yenKheData.data.data.debtData.length} items`);
    if (yenKheData.data.data.debtData.length > 0) {
      console.log(`   First item: ${yenKheData.data.data.debtData[0].name}`);
      console.log(`   Area: ${yenKheData.data.data.debtData[0].area}`);
    }
    console.log('');

    // Test 4: Search by name
    console.log('4. Test: Search by name = "Nguyễn"');
    const searchData = await axios.get('http://localhost:5000/api/finance/debt', {
      params: { search: 'Nguyễn' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   Result: ${searchData.data.data.debtData.length} items`);
    if (searchData.data.data.debtData.length > 0) {
      searchData.data.data.debtData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
      });
    }
    console.log('');

    // Test 5: Combined filters
    console.log('5. Test: Combined - status=overdue + zone=yen-khe');
    const combinedData = await axios.get('http://localhost:5000/api/finance/debt', {
      params: { status: 'overdue', zone: 'yen-khe' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   Result: ${combinedData.data.data.debtData.length} items`);
    if (combinedData.data.data.debtData.length > 0) {
      console.log(`   Item: ${combinedData.data.data.debtData[0].name} - ${combinedData.data.data.debtData[0].statusText}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testDebtFilters();