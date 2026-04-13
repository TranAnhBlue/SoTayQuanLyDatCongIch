const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, department, position } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            department,
            position
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('[Auth register]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('[Auth login]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('[Auth getMe]', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expire time (15 mins)
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpire = Date.now() + 15 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // MOCK EMAIL SENDING
        console.log('==========================================');
        console.log(`RESET PASSWORD OTP FOR ${email}: ${otp}`);
        console.log('==========================================');

        res.status(200).json({ success: true, message: 'Mã OTP đã được gửi đến email của bạn' });
    } catch (error) {
        console.error('[Auth forgotPassword]', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verifyotp
// @access  Public
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordOTPExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
        }

        res.status(200).json({ success: true, message: 'Xác thực OTP thành công' });
    } catch (error) {
        console.error('[Auth verifyOTP]', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordOTPExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Xác thực không hợp lệ để đổi mật khẩu' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
    } catch (error) {
        console.error('[Auth resetPassword]', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
