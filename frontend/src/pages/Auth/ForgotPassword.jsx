import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, ArrowRightOutlined, SafetyOutlined, InfoCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/forgotpassword', values);
            message.success(response.data.message);
            localStorage.setItem('resetEmail', values.email);
            navigate('/verify-otp');
        } catch (error) {
            console.error('Forgot password error:', error);
            message.error(error.response?.data?.message || 'Gửi yêu cầu thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#ebf0f3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'white',
                borderRadius: '12px 12px 0 0',
                padding: '45px 50px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Shield Icon Box */}
                <div style={{
                    backgroundColor: '#01263f',
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '25px',
                }}>
                    <SafetyOutlined style={{ color: 'white', fontSize: '24px' }} />
                </div>

                <Title level={2} style={{ color: '#01263f', margin: '0 0 12px 0', fontWeight: 900, fontSize: '28px', textAlign: 'center' }}>
                    Quên mật khẩu?
                </Title>
                
                <Text style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '35px', textAlign: 'center', display: 'block', lineHeight: '1.6', maxWidth: '340px' }}>
                    Vui lòng nhập Email công vụ đã được cấp để nhận mã OTP xác thực. Mã sẽ được gửi tự động đến hộp thư của bạn.
                </Text>

                <Form
                    name="forgot_password_form"
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    style={{ width: '100%' }}
                >
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>EMAIL CÔNG VỤ</span>
                    </div>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                        style={{ marginBottom: '12px' }}
                    >
                        <Input 
                            prefix={<span style={{ color: '#94a3b8', fontSize: '16px', marginRight: '5px' }}>@</span>} 
                            placeholder="nguyenvana@hanhchinh.vn" 
                            style={{ 
                                backgroundColor: '#eaeeef', 
                                border: 'none', 
                                borderRadius: '8px', 
                                height: '52px',
                                fontSize: '14px',
                                color: '#1e293b'
                            }}
                        />
                    </Form.Item>

                    <Text style={{ color: '#94a3b8', fontSize: '10px', fontStyle: 'italic', display: 'block', marginBottom: '30px', lineHeight: '1.5' }}>
                        Lưu ý: Hệ thống chỉ chấp nhận định dạng email @hanhchinh.vn hoặc các tên miền công vụ liên quan.
                    </Text>

                    {/* Info Alert Box */}
                    <div style={{ 
                        backgroundColor: '#f1f5f9', 
                        borderRadius: '10px', 
                        padding: '18px 20px', 
                        display: 'flex', 
                        gap: '15px',
                        marginBottom: '35px',
                        position: 'relative'
                    }}>
                        <InfoCircleFilled style={{ color: '#f59e0b', fontSize: '18px', marginTop: '3px' }} />
                        <div>
                            <Text style={{ color: '#1e293b', fontWeight: 800, fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                                Tính bảo mật hệ thống
                            </Text>
                            <Text style={{ color: '#64748b', fontSize: '11px', lineHeight: '1.5', display: 'block' }}>
                                Vì lý do an ninh, liên kết khôi phục sẽ hết hạn sau 15 phút. Không chia sẻ mã xác thực này cho bất kỳ ai.
                            </Text>
                        </div>
                    </div>

                    <Form.Item style={{ marginBottom: '20px' }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            block
                            style={{ 
                                backgroundColor: '#01263f', 
                                height: '52px',
                                borderRadius: '6px',
                                fontSize: '15px',
                                fontWeight: 800,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            Gửi mã OTP xác thực <ArrowRightOutlined style={{ marginLeft: '12px' }} />
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login" style={{ 
                            color: '#1b742a', 
                            fontSize: '14px', 
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ArrowLeftOutlined style={{ marginRight: '8px' }} /> Quay lại Đăng nhập
                        </Link>
                    </div>
                </Form>
            </div>
            
            {/* Bottom Border Accent */}
            <div style={{ width: '100%', maxWidth: '480px', display: 'flex', height: '4px' }}>
                <div style={{ flex: '0 0 45%', backgroundColor: '#01263f', borderRadius: '0 0 0 12px' }} />
                <div style={{ flex: '0 0 55%', backgroundColor: '#1b742a', borderRadius: '0 0 12px 0' }} />
            </div>

            {/* Bottom Credit */}
            <div style={{ marginTop: '35px', textAlign: 'center' }}>
                <Text style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    CỔNG THÔNG TIN QUẢN LÝ ĐẤT CÔNG ÍCH
                </Text>
                <div style={{ marginTop: '5px' }}>
                    <Text style={{ color: '#cbd5e1', fontSize: '10px' }}>
                        Bản quyền © 2024. Phát triển bởi Cục Công nghệ Thông tin.
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
