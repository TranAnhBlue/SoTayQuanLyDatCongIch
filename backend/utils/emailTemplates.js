const getOTPEmailTemplate = (otp, userName = 'Người dùng') => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mã xác thực OTP - Đất Việt Core</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 40px 20px;
                min-height: 100vh;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                position: relative;
            }
            
            .header {
                background: linear-gradient(135deg, #065f46 0%, #10b981 100%);
                padding: 50px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
                animation: float 20s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            .logo-container {
                position: relative;
                z-index: 2;
                margin-bottom: 25px;
            }
            
            .logo {
                width: 80px;
                height: 80px;
                background: rgba(255,255,255,0.15);
                border-radius: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                margin-bottom: 20px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.2);
            }
            
            .header h1 {
                color: white;
                font-size: 32px;
                font-weight: 800;
                margin-bottom: 8px;
                position: relative;
                z-index: 2;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .header p {
                color: rgba(255,255,255,0.9);
                font-size: 16px;
                font-weight: 500;
                position: relative;
                z-index: 2;
            }
            
            .content {
                padding: 50px 40px;
                background: white;
            }
            
            .greeting {
                font-size: 20px;
                color: #1a202c;
                margin-bottom: 25px;
                font-weight: 600;
            }
            
            .greeting strong {
                color: #059669;
            }
            
            .message {
                font-size: 16px;
                color: #4a5568;
                line-height: 1.7;
                margin-bottom: 40px;
            }
            
            .otp-section {
                text-align: center;
                margin: 40px 0;
            }
            
            .otp-container {
                background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                border: 3px dashed #10b981;
                border-radius: 20px;
                padding: 40px 30px;
                margin: 30px 0;
                position: relative;
                overflow: hidden;
            }
            
            .otp-container::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, #10b981, #34d399, #10b981);
                border-radius: 20px;
                z-index: -1;
                animation: borderGlow 3s ease-in-out infinite;
            }
            
            @keyframes borderGlow {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            
            .otp-label {
                font-size: 12px;
                color: #718096;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 15px;
                font-weight: 700;
            }
            
            .otp-code {
                display: inline-block;
                background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
                border: 3px solid #10b981;
                border-radius: 15px;
                padding: 20px 30px;
                font-size: 42px;
                font-weight: 900;
                color: #065f46;
                letter-spacing: 8px;
                font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                margin: 20px 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                position: relative;
                overflow: hidden;
            }
            
            .otp-code::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
                animation: shine 2s infinite;
            }
            
            @keyframes shine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            .otp-digits {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin: 25px 0;
            }
            
            .otp-digit {
                width: 60px;
                height: 70px;
                background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
                border: 2px solid #a7f3d0;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: 800;
                color: #065f46;
                font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .otp-digit::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .otp-digit:hover::before {
                opacity: 0.1;
            }
            
            .otp-digit span {
                position: relative;
                z-index: 2;
            }
            
            .otp-note {
                font-size: 13px;
                color: #a0aec0;
                margin-top: 15px;
                font-weight: 500;
            }
            
            .security-notice {
                background: linear-gradient(135def, #fef2f2 0%, #fecaca 100%);
                border-left: 5px solid #ef4444;
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
                position: relative;
            }
            
            .security-notice::before {
                content: '🔒';
                position: absolute;
                top: -10px;
                left: 20px;
                background: white;
                padding: 5px 10px;
                border-radius: 50%;
                font-size: 16px;
            }
            
            .security-title {
                font-size: 16px;
                font-weight: 700;
                color: #dc2626;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .security-list {
                list-style: none;
                padding: 0;
            }
            
            .security-list li {
                font-size: 14px;
                color: #dc2626;
                line-height: 1.6;
                margin-bottom: 8px;
                padding-left: 20px;
                position: relative;
            }
            
            .security-list li::before {
                content: '•';
                color: #ef4444;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            
            .support-section {
                background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
                text-align: center;
            }
            
            .support-title {
                font-size: 16px;
                font-weight: 700;
                color: #059669;
                margin-bottom: 10px;
            }
            
            .support-text {
                font-size: 14px;
                color: #065f46;
                line-height: 1.6;
            }
            
            .support-contact {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: white;
                padding: 8px 16px;
                border-radius: 25px;
                margin: 10px 5px;
                text-decoration: none;
                color: #059669;
                font-weight: 600;
                font-size: 13px;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
                transition: transform 0.2s;
            }
            
            .support-contact:hover {
                transform: translateY(-2px);
            }
            
            .footer {
                background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
                padding: 40px;
                text-align: center;
                color: white;
            }
            
            .footer-logo {
                width: 50px;
                height: 50px;
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 20px;
            }
            
            .footer-title {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            
            .footer-subtitle {
                font-size: 14px;
                color: rgba(255,255,255,0.7);
                margin-bottom: 25px;
            }
            
            .footer-links {
                display: flex;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            
            .footer-link {
                color: rgba(255,255,255,0.8);
                text-decoration: none;
                font-size: 13px;
                font-weight: 500;
                padding: 8px 16px;
                border-radius: 20px;
                background: rgba(255,255,255,0.1);
                transition: all 0.3s;
            }
            
            .footer-link:hover {
                background: rgba(255,255,255,0.2);
                color: white;
            }
            
            .copyright {
                margin-top: 25px;
                padding-top: 25px;
                border-top: 1px solid rgba(255,255,255,0.1);
                font-size: 12px;
                color: rgba(255,255,255,0.6);
            }
            
            @media (max-width: 600px) {
                body { padding: 20px 10px; }
                .content, .header { padding: 30px 25px; }
                .otp-code { font-size: 36px; letter-spacing: 8px; }
                .footer { padding: 30px 25px; }
                .footer-links { flex-direction: column; gap: 10px; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header Section -->
            <div class="header">
                <div class="logo-container">
                    <div class="logo">🏛️</div>
                </div>
                <h1>Đất Việt Core</h1>
                <p>Hệ thống Quản lý Đất đai Quốc gia</p>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <div class="greeting">
                    Xin chào <strong style="color: #1e7e34;">${userName}</strong> 👋
                </div>
                
                <div class="message">
                    Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình trong hệ thống <strong>Đất Việt Core</strong>. 
                    Để đảm bảo tính bảo mật, chúng tôi đã tạo một mã xác thực OTP dành riêng cho bạn.
                </div>
                
                <!-- OTP Section -->
                <div class="otp-section">
                    <div class="otp-container">
                        <div class="otp-label">Mã xác thực OTP của bạn</div>
                        
                        <!-- OTP as individual digits -->
                        <div class="otp-digits">
                            <div class="otp-digit"><span>${otp.charAt(0)}</span></div>
                            <div class="otp-digit"><span>${otp.charAt(1)}</span></div>
                            <div class="otp-digit"><span>${otp.charAt(2)}</span></div>
                            <div class="otp-digit"><span>${otp.charAt(3)}</span></div>
                            <div class="otp-digit"><span>${otp.charAt(4)}</span></div>
                            <div class="otp-digit"><span>${otp.charAt(5)}</span></div>
                        </div>
                        
                        <!-- Alternative: Single code block -->
                        <div style="margin: 20px 0; padding: 15px; background: rgba(16, 185, 129, 0.1); border-radius: 10px;">
                            <div style="font-size: 14px; color: #059669; margin-bottom: 8px; font-weight: 600;">
                                📋 Hoặc copy toàn bộ mã:
                            </div>
                            <div class="otp-code">${otp}</div>
                        </div>
                        
                        <div class="otp-note">⏰ Mã này có hiệu lực trong <strong>15 phút</strong></div>
                    </div>
                </div>
                
                <!-- Security Notice -->
                <div class="security-notice">
                    <div class="security-title">
                        Lưu ý quan trọng về bảo mật
                    </div>
                    <ul class="security-list">
                        <li>Tuyệt đối không chia sẻ mã OTP này với bất kỳ ai</li>
                        <li>Mã OTP chỉ được sử dụng một lần duy nhất</li>
                        <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</li>
                        <li>Liên hệ ngay với bộ phận IT nếu nghi ngờ tài khoản bị xâm nhập</li>
                    </ul>
                </div>
                
                <!-- Support Section -->
                <div class="support-section">
                    <div class="support-title">🆘 Cần hỗ trợ?</div>
                    <div class="support-text">
                        Nếu bạn gặp khó khăn trong quá trình đặt lại mật khẩu, đội ngũ hỗ trợ kỹ thuật luôn sẵn sàng giúp đỡ bạn 24/7.
                    </div>
                    <div style="margin-top: 15px;">
                        <a href="tel:19008888" class="support-contact">
                            📞 Hotline: 1900 8888
                        </a>
                        <a href="mailto:support@datvietcore.gov.vn" class="support-contact">
                            ✉️ Email hỗ trợ
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-logo">🌟</div>
                <div class="footer-title">Trung tâm Chuyển đổi số Quản lý Đất đai</div>
                <div class="footer-subtitle">Bộ Tài nguyên và Môi trường - Chính phủ Việt Nam</div>
                
                <div class="footer-links">
                    <a href="#" class="footer-link">Chính sách bảo mật</a>
                    <a href="#" class="footer-link">Điều khoản sử dụng</a>
                    <a href="#" class="footer-link">Hướng dẫn sử dụng</a>
                    <a href="#" class="footer-link">Liên hệ hỗ trợ</a>
                </div>
                
                <div class="copyright">
                    © 2024 Đất Việt Core. Tất cả quyền được bảo lưu.<br>
                    Phát triển bởi Trung tâm Công nghệ Thông tin - Bộ TN&MT
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Template cho email chào mừng
const getWelcomeEmailTemplate = (userName, userEmail) => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chào mừng đến với Đất Việt Core</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                min-height: 100vh;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            }
            
            .header {
                background: linear-gradient(135deg, #002e42 0%, #1e7e34 100%);
                padding: 50px 40px;
                text-align: center;
                color: white;
            }
            
            .logo {
                width: 80px;
                height: 80px;
                background: rgba(255,255,255,0.15);
                border-radius: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                margin-bottom: 20px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.2);
            }
            
            .header h1 {
                font-size: 32px;
                font-weight: 800;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .content {
                padding: 50px 40px;
            }
            
            .welcome-message {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .welcome-title {
                font-size: 28px;
                font-weight: 800;
                color: #1e7e34;
                margin-bottom: 15px;
            }
            
            .welcome-text {
                font-size: 16px;
                color: #4a5568;
                line-height: 1.7;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🎉</div>
                <h1>Chào mừng bạn!</h1>
                <p>Tài khoản của bạn đã được tạo thành công</p>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    <div class="welcome-title">Xin chào ${userName}!</div>
                    <div class="welcome-text">
                        Tài khoản <strong>${userEmail}</strong> của bạn đã được tạo thành công trong hệ thống Đất Việt Core.
                        Bạn có thể bắt đầu sử dụng các tính năng của hệ thống ngay bây giờ.
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    getOTPEmailTemplate,
    getWelcomeEmailTemplate
};