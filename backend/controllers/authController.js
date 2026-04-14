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
            phone: user.phone,
            department: user.department,
            position: user.position,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt,
            lastPasswordChange: user.lastPasswordChange
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

        // Set new password and update last change date
        user.password = password;
        user.lastPasswordChange = new Date();
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
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt,
                lastPasswordChange: user.lastPasswordChange
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
        
        // Update password and last change date
        user.password = newPassword;
        user.lastPasswordChange = new Date();
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
        console.log('📸 Avatar upload request received');
        console.log('User ID:', req.user?.id);
        console.log('File info:', req.file ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            path: req.file.path
        } : 'No file');

        if (!req.file) {
            console.log('❌ No file in request');
            return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('❌ User not found:', req.user.id);
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        console.log('👤 Current user:', user.name, user.email);

        // Cloudinary đã tự động upload file, chỉ cần lấy URL
        const avatarUrl = req.file.path; // Cloudinary trả về secure_url trong path
        const publicId = req.file.filename; // Public ID để có thể xóa sau này
        
        console.log('🌤️ Cloudinary upload result:');
        console.log('   URL:', avatarUrl);
        console.log('   Public ID:', publicId);
        
        // Xóa avatar cũ nếu có (và không phải avatar mặc định)
        if (user.avatarPublicId && user.avatarPublicId !== 'default') {
            try {
                const { deleteFile } = require('../utils/cloudinary');
                await deleteFile(user.avatarPublicId);
                console.log('✅ Deleted old avatar from Cloudinary:', user.avatarPublicId);
            } catch (deleteError) {
                console.log('⚠️ Could not delete old avatar:', deleteError.message);
            }
        }
        
        // Cập nhật user với avatar mới
        user.avatar = avatarUrl;
        user.avatarPublicId = publicId;
        await user.save();

        console.log('✅ Avatar updated successfully for user:', user.name);

        res.status(200).json({
            success: true,
            avatarUrl: avatarUrl,
            publicId: publicId,
            message: 'Cập nhật avatar thành công'
        });
    } catch (error) {
        console.error('❌ [Upload avatar] Error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Google OAuth
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = (req, res) => {
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=profile email&response_type=code`;
    res.redirect(googleAuthUrl);
};

// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=missing_code`);
        }

        console.log('🔄 Processing Google OAuth callback...');

        // Exchange code for access token
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        });

        const { access_token } = tokenResponse.data;
        console.log('✅ Got access token from Google');

        // Get user info from Google
        const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
        const { id, email, name, picture } = userResponse.data;
        
        console.log(`👤 Google user info: ${name} (${email})`);

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            console.log('🆕 Creating new user from Google account');
            // Create new user with required fields
            user = await User.create({
                name,
                email,
                password: 'google_oauth_' + id, // Temporary password
                role: 'renter', // Default role
                phone: '0000000000', // Default phone
                department: 'Người dùng Google',
                position: 'Người dùng',
                avatar: picture
            });
        } else {
            console.log('👤 User exists, updating avatar if needed');
            // Update avatar if from Google and user doesn't have one
            if (picture && !user.avatar) {
                user.avatar = picture;
                await user.save();
            }
        }

        // Generate JWT token using the same function as regular login
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_key_123', {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });

        console.log('✅ Generated JWT token for Google user');

        // Create success page HTML
        const successHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Đăng nhập thành công</title>
            <style>
                body { 
                    font-family: 'Inter', sans-serif; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    margin: 0; 
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                }
                .container { 
                    text-align: center; 
                    background: white; 
                    padding: 40px; 
                    border-radius: 20px; 
                    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                }
                .success-icon { 
                    font-size: 48px; 
                    margin-bottom: 20px; 
                }
                .title { 
                    color: #065f46; 
                    font-size: 24px; 
                    font-weight: 700; 
                    margin-bottom: 10px; 
                }
                .message { 
                    color: #6b7280; 
                    margin-bottom: 20px; 
                }
                .loading { 
                    color: #10b981; 
                    font-weight: 600; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success-icon">✅</div>
                <div class="title">Đăng nhập Google thành công!</div>
                <div class="message">Chào mừng ${user.name}</div>
                <div class="loading">Đang chuyển hướng...</div>
            </div>
            <script>
                console.log('Google OAuth callback - sending message to parent');
                
                const userData = ${JSON.stringify({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                })};
                
                const messageData = {
                    type: 'GOOGLE_LOGIN_SUCCESS',
                    token: '${token}',
                    user: userData
                };
                
                console.log('Sending message:', messageData);
                
                // Send data to parent window and close
                if (window.opener) {
                    // Try multiple origins to ensure message is received
                    const origins = ['http://localhost:5173', 'http://localhost:3000', '*'];
                    
                    origins.forEach(origin => {
                        try {
                            window.opener.postMessage(messageData, origin);
                            console.log('Message sent to origin:', origin);
                        } catch (e) {
                            console.log('Failed to send to origin:', origin, e.message);
                        }
                    });
                    
                    // Close popup after a short delay
                    setTimeout(() => {
                        window.close();
                    }, 1000);
                } else {
                    console.log('No opener found, redirecting...');
                    // Fallback: redirect with URL params
                    window.location.href = '${process.env.CLIENT_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        avatar: user.avatar
                    }))}';
                }
            </script>
        </body>
        </html>
        `;

        res.send(successHtml);
    } catch (error) {
        console.error('❌ Google OAuth callback error:', error.message);
        
        const errorHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lỗi đăng nhập</title>
            <style>
                body { 
                    font-family: 'Inter', sans-serif; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    margin: 0; 
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                }
                .container { 
                    text-align: center; 
                    background: white; 
                    padding: 40px; 
                    border-radius: 20px; 
                    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                }
                .error-icon { 
                    font-size: 48px; 
                    margin-bottom: 20px; 
                }
                .title { 
                    color: #dc2626; 
                    font-size: 24px; 
                    font-weight: 700; 
                    margin-bottom: 10px; 
                }
                .message { 
                    color: #6b7280; 
                    margin-bottom: 20px; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">❌</div>
                <div class="title">Đăng nhập thất bại</div>
                <div class="message">Có lỗi xảy ra trong quá trình đăng nhập Google</div>
            </div>
            <script>
                console.log('Google OAuth error - sending error message to parent');
                
                if (window.opener) {
                    const origins = ['http://localhost:5173', 'http://localhost:3000', '*'];
                    
                    origins.forEach(origin => {
                        try {
                            window.opener.postMessage({
                                type: 'GOOGLE_LOGIN_ERROR',
                                error: 'authentication_failed'
                            }, origin);
                            console.log('Error message sent to origin:', origin);
                        } catch (e) {
                            console.log('Failed to send error to origin:', origin, e.message);
                        }
                    });
                    
                    setTimeout(() => {
                        window.close();
                    }, 2000);
                } else {
                    setTimeout(() => {
                        window.location.href = '${process.env.CLIENT_URL}/login?error=google_auth_failed';
                    }, 2000);
                }
            </script>
        </body>
        </html>
        `;
        
        res.send(errorHtml);
    }
};