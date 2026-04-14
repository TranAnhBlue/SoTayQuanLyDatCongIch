const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if test user exists
        const existingUser = await User.findOne({ email: 'tranducanh220604@gmail.com' });
        
        if (existingUser) {
            console.log('Test user already exists:', existingUser.email);
            return;
        }

        // Create test user
        const testUser = await User.create({
            name: 'Trần Đức Anh',
            email: 'tranducanh220604@gmail.com',
            password: '123456',
            phone: '0901234567',
            department: 'Phòng Công nghệ Thông tin',
            position: 'Chuyên viên',
            role: 'admin'
        });

        console.log('Test user created successfully:', testUser.email);
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        mongoose.disconnect();
    }
};

createTestUser();