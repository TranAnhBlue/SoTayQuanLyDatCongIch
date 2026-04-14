const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const sendEmail = require('../utils/sendEmail');
const { getOTPEmailTemplate } = require('../utils/emailTemplates');

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

        // Send OTP via email
        try {
            const emailHtml = getOTPEmailTemplate(otp, user.name);
            
            await sendEmail({
                email: user.email,
                subject: 'Mã xác thực đặt lại mật khẩu - Đất Việt Core',
                html: emailHtml
            });

            console.log(`✅ OTP email sent successfully to ${email}`);
            
            res.status(200).json({ 
                success: true, 
                message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư rác.' 
            });
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            
            // Fallback to console log if email fails
            console.log('==========================================');
            console.log(`📧 FALLBACK - OTP for ${email}: ${otp}`);
            console.log('==========================================');
            
            res.status(200).json({ 
                success: true, 
                message: `Có lỗi gửi email, nhưng mã OTP đã được tạo: ${otp}. Vui lòng sử dụng mã này để tiếp tục.` 
            });
        }
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, department, position } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, department, position },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                department: user.department,
                position: user.position,
                role: user.role
            }
        });
    } catch (error) {
        console.error('[Auth updateProfile]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Get user with password
        const user = await User.findById(req.user.id).select('+password');
        
        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('[Auth changePassword]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Upload avatar
// @route   POST /api/auth/upload-avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Tạo URL avatar (trong thực tế sẽ upload lên cloud storage)
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        
        user.avatar = avatarUrl;
        await user.save();

        res.status(200).json({
            success: true,
            avatarUrl: avatarUrl,
            message: 'Cập nhật avatar thành công'
        });
    } catch (error) {
        console.error('[Upload avatar]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Google OAuth
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = (req, res) => {
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=profile email&response_type=code`;
    res.redirect(googleAuthUrl);
};

// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
        }

        // Exchange code for access token
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        });

        const { access_token } = tokenResponse.data;

        // Get user info from Google
        const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
        const { id, email, name, picture } = userResponse.data;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                password: 'google_oauth_' + id, // Temporary password
                role: 'renter', // Default role
                phone: '', // Will be updated later
                department: 'Google User',
                position: 'User',
                avatar: picture
            });
        } else {
            // Update avatar if from Google
            if (picture && !user.avatar) {
                user.avatar = picture;
                await user.save();
            }
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (error) {
        console.error('[Google OAuth callback]', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
};