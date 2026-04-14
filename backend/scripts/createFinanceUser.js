const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './.env' });

const createFinanceUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if finance user already exists
        const existingUser = await User.findOne({ email: 'finance@datviet.vn' });
        
        if (existingUser) {
            console.log('⚠️  Finance user already exists');
            console.log('Email:', existingUser.email);
            console.log('Role:', existingUser.role);
            process.exit(0);
        }

        // Create finance user
        const financeUser = await User.create({
            name: 'Nguyễn Thị Mai',
            email: 'finance@datviet.vn',
            password: '123456',
            phone: '0987654321',
            department: 'Phòng Tài chính - Kế toán',
            position: 'Cán bộ Tài chính',
            role: 'finance'
        });

        console.log('✅ Finance user created successfully!');
        console.log('-----------------------------------');
        console.log('Email:', financeUser.email);
        console.log('Password: 123456');
        console.log('Role:', financeUser.role);
        console.log('Name:', financeUser.name);
        console.log('-----------------------------------');
        console.log('You can now login with these credentials');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating finance user:', error);
        process.exit(1);
    }
};

createFinanceUser();
