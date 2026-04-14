const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const clearDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/SoTayQuanLyDat';
        await mongoose.connect(uri);
        console.log('MongoDB connection successful...');

        // Xóa toàn bộ database
        await mongoose.connection.db.dropDatabase();
        console.log('✅ Đã xóa toàn bộ database');

        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi xóa database:', error);
        process.exit(1);
    }
};

clearDatabase();