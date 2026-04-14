import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { SafetyOutlined, ArrowRightOutlined, InfoCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

// Add CSS for spinner animation
const spinnerStyle = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = spinnerStyle;
    document.head.appendChild(style);
}

const VerifyOTP = () => {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(119); // 01:59 (2 minutes)
    const [isComplete, setIsComplete] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const email = localStorage.getItem('resetEmail') || 'ca***@ubnd.gov.vn';

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (value, index) => {
        if (isNaN(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        // Auto submit when all 6 digits are entered
        const updatedOtp = [...newOtp];
        if (updatedOtp.every(digit => digit !== '') && updatedOtp.join('').length === 6) {
            setIsComplete(true);
            const completeOtp = updatedOtp.join('');
            setTimeout(() => {
                onFinish(completeOtp); // Pass the complete OTP directly
            }, 300); // Slightly longer delay for better UX
        } else {
            setIsComplete(false);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (digits.length === 6) {
            const newOtp = digits.split('');
            setOtp(newOtp);
            setIsComplete(true);
            
            // Auto submit after paste
            setTimeout(() => {
                onFinish(digits); // Pass the pasted digits directly
            }, 300);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const onFinish = async (autoSubmittedOtp = null) => {
        const otpString = autoSubmittedOtp || otp.join('');
        if (otpString.length < 6) {
            return message.error('Vui lòng nhập đầy đủ mã OTP 6 chữ số');
        }

        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/verifyotp', {
                email,
                otp: otpString
            });
            message.success(response.data.message);
            localStorage.setItem('resetOTP', otpString);
            navigate('/reset-password');
        } catch (error) {
            console.error('Verify OTP error:', error);
            message.error(error.response?.data?.message || 'Xác thực mã OTP thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/api/auth/forgotpassword', { email });
            message.success('Mã mới đã được gửi đến email của bạn');
            setTimer(119);
            setOtp(['', '', '', '', '', '']);
        } catch (error) {
            message.error('Không thể gửi lại mã. Vui lòng thử lại sau.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#ebf0f3',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '920px',
                height: 'min(680px, 90vh)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
            }}>
                {/* ---------- LEFT COLUMN ---------- */}
                <div style={{
                    flex: '0 0 350px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#01263f'
                }}>
                    <img 
                        src="/auth-bg.png" 
                        alt="Officer"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.65
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '40px 35px',
                        background: 'linear-gradient(to top, rgba(1,38,63,1) 0%, rgba(1,38,63,0.7) 60%, transparent 100%)',
                        color: 'white'
                    }}>
                        <Title level={1} style={{ color: 'white', fontSize: '32px', fontWeight: 900, margin: 0, lineHeight: '1.1' }}>
                            Bảo mật
                        </Title>
                        <Title level={1} style={{ color: 'white', fontSize: '32px', fontWeight: 900, margin: '5px 0 20px 0', lineHeight: '1.1' }}>
                            Hệ thống Đất đai
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6', display: 'block', maxWidth: '300px' }}>
                            Xác thực hai lớp giúp bảo vệ dữ liệu công ích và quyền lợi của cộng đồng.
                        </Text>
                    </div>
                </div>

                {/* ---------- RIGHT COLUMN ---------- */}
                <div style={{
                    flex: '1 1 auto',
                    padding: '45px 50px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f8fafc',
                    overflow: 'auto'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ backgroundColor: '#1b742a', padding: '10px', borderRadius: '8px', display: 'flex' }}>
                            <SafetyOutlined style={{ color: 'white', fontSize: '20px' }} />
                        </div>
                        <div>
                            <Text style={{ color: '#1b742a', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>XÁC THỰC TÀI KHOẢN</Text>
                            <Title level={3} style={{ color: '#01263f', margin: 0, fontWeight: 900, fontSize: '26px' }}>Nhập mã OTP</Title>
                        </div>
                    </div>

                    <Text style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.5', marginBottom: '30px', display: 'block' }}>
                        Mã xác thực gồm 6 chữ số đã được gửi đến email <br/>
                        <strong style={{ color: '#01263f' }}>{email}</strong>. Vui lòng kiểm tra hộp thư đến hoặc thư rác.
                        {isComplete && (
                            <div style={{ 
                                marginTop: '10px', 
                                padding: '8px 12px', 
                                backgroundColor: '#f0f9f0', 
                                border: '1px solid #1b742a', 
                                borderRadius: '6px',
                                color: '#1b742a',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    border: '2px solid #1b742a',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                ✓ Mã OTP đã được nhập đầy đủ. Đang xác thực...
                            </div>
                        )}
                    </Text>

                    {/* OTP Inputs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                style={{
                                    width: '100%',
                                    height: '65px',
                                    borderRadius: '10px',
                                    border: `2px solid ${isComplete ? '#1b742a' : 'transparent'}`,
                                    backgroundColor: isComplete ? '#f0f9f0' : '#eaeeef',
                                    textAlign: 'center',
                                    fontSize: '26px',
                                    fontWeight: 800,
                                    color: '#01263f',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1b742a'}
                                onBlur={(e) => e.target.style.borderColor = 'transparent'}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
                        <Text style={{ color: '#64748b', fontSize: '13px' }}>Mã sẽ hết hạn sau:</Text>
                        <Text style={{ color: '#1b742a', fontWeight: 800, fontSize: '13px' }}>{formatTime(timer)}</Text>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Text style={{ color: '#64748b', fontSize: '13px' }}>
                            Chưa nhận được mã?{' '}
                            <Text 
                                onClick={handleResend}
                                style={{ color: '#1b742a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Gửi lại ngay
                            </Text>
                        </Text>
                    </div>

                    <Button 
                        type="primary" 
                        onClick={() => onFinish()}
                        loading={loading}
                        block
                        style={{ 
                            backgroundColor: '#01263f', 
                            height: '56px',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: 800,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 10px 20px rgba(1,38,63,0.15)'
                        }}
                    >
                        Xác nhận mã OTP <ArrowRightOutlined style={{ marginLeft: '12px' }} />
                    </Button>

                    {/* Support Box */}
                    <div style={{ 
                        backgroundColor: '#f1f5f9', 
                        borderRadius: '12px', 
                        padding: '25px',
                        marginTop: 'auto'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <InfoCircleFilled style={{ color: '#f59e0b', fontSize: '18px' }} />
                            <Text style={{ fontWeight: 800, fontSize: '12px', color: '#1e293b', letterSpacing: '0.5px' }}>HƯỚNG DẪN HỖ TRỢ</Text>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', fontSize: '12px', lineHeight: '2' }}>
                            <li>Kiểm tra kỹ mục thư rác (Spam) hoặc Quảng cáo (Promotions).</li>
                            <li>Đảm bảo rằng kết nối internet của bạn ổn định.</li>
                            <li>Nếu vẫn không nhận được, vui lòng liên hệ bộ phận IT Cấp Xã.</li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px', alignItems: 'center' }}>
                        <Text 
                            onClick={() => navigate('/login')}
                            style={{ color: '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}
                        >
                            Quay lại đăng nhập
                        </Text>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                        <Text style={{ color: '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>
                            Hỗ trợ kỹ thuật
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
