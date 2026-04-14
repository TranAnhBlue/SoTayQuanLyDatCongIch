const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên người dùng']
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Vui lòng nhập email hợp lệ'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại']
    },
    department: {
        type: String,
        required: [true, 'Vui lòng nhập đơn vị công tác']
    },
    position: {
        type: String,
        required: [true, 'Vui lòng nhập chức vụ']
    },
    avatar: {
        type: String,
        default: null
    },
    avatarPublicId: {
        type: String,
        default: null // Cloudinary public ID để có thể xóa file
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: 6,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['admin', 'renter', 'officer'],
        default: 'renter'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastPasswordChange: {
        type: Date,
        default: Date.now
    },
    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
