const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createRenterUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if renter user already exists
        const existingRenter = await User.findOne({ email: 'renter@datviet.vn' });
        
        if (existingRenter) {
            console.log('✅ Renter user already exists');
            console.log('   Email: renter@datviet.vn');
            console.log('   Password: 123456');
            console.log('   Name:', existingRenter.name);
            console.log('   Role:', existingRenter.role);
            process.exit(0);
        }

        // Create renter user
        const renter = await User.create({
            name: 'Trần Đức Anh',
            email: 'renter@datviet.vn',
            password: '123456',
            phone: '0912345678',
            role: 'renter',
            department: 'Người dân',
            position: 'Người thuê đất',
            address: 'Số 15, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
            isVerified: true
        });

        console.log('✅ Renter user created successfully!');
        console.log('   Email: renter@datviet.vn');
        console.log('   Password: 123456');
        console.log('   Name:', renter.name);
        console.log('   Role:', renter.role);
        console.log('   Phone:', renter.phone);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createRenterUser();
