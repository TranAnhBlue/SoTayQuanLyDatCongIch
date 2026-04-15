const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '.env' });

const createOfficerUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if officer user already exists
        const existingOfficer = await User.findOne({ email: 'officer@datviet.vn' });
        
        if (existingOfficer) {
            console.log('✅ Officer user already exists');
            console.log('   Email: officer@datviet.vn');
            console.log('   Password: 123456');
            console.log('   Role:', existingOfficer.role);
            process.exit(0);
        }

        // Create officer user
        const officer = await User.create({
            name: 'Lê Văn Quân',
            email: 'officer@datviet.vn',
            password: '123456',
            phone: '0912345678',
            role: 'officer',
            department: 'Phòng Địa chính',
            position: 'Cán bộ Địa chính',
            address: 'UBND Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
            isVerified: true
        });

        console.log('✅ Officer user created successfully!');
        console.log('   Email: officer@datviet.vn');
        console.log('   Password: 123456');
        console.log('   Name:', officer.name);
        console.log('   Role:', officer.role);
        console.log('   Department:', officer.department);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createOfficerUser();
