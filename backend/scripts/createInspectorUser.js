const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './.env' });

const createInspectorUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if inspector user already exists
        const existingUser = await User.findOne({ email: 'inspector@datviet.vn' });
        
        if (existingUser) {
            console.log('⚠️  Inspector user already exists');
            console.log('Email:', existingUser.email);
            console.log('Role:', existingUser.role);
            process.exit(0);
        }

        // Create inspector user
        const inspectorUser = await User.create({
            name: 'Trần Văn Hùng',
            email: 'inspector@datviet.vn',
            password: '123456',
            phone: '0912345678',
            department: 'Thanh tra Sở Tài nguyên & Môi trường',
            position: 'Thanh tra viên',
            role: 'inspector'
        });

        console.log('✅ Inspector user created successfully!');
        console.log('-----------------------------------');
        console.log('Email:', inspectorUser.email);
        console.log('Password: 123456');
        console.log('Role:', inspectorUser.role);
        console.log('Name:', inspectorUser.name);
        console.log('-----------------------------------');
        console.log('You can now login with these credentials');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating inspector user:', error);
        process.exit(1);
    }
};

createInspectorUser();
