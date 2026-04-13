import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, ArrowRightOutlined, SafetyCertificateOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem('resetEmail');
    const otp = localStorage.getItem('resetOTP');

    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            return message.error('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/resetpassword', {
                email,
                otp,
                password: values.password
            });
            message.success(response.data.message);
            localStorage.removeItem('resetEmail');
            localStorage.removeItem('resetOTP');
            navigate('/login');
        } catch (error) {
            console.error('Reset password error:', error);
            message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setLoading(false);
        }
    };

    if (!email || !otp) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ebf0f3' }}>
                <div style={{ textAlign: 'center' }}>
                    <Title level={4}>Phiên làm việc không hợp lệ</Title>
                    <Button type="primary" onClick={() => navigate('/forgot-password')}>Quay lại</Button>
                </div>
            </div>
        );
    }

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
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#1b742a',
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '25px',
                }}>
                    <SafetyCertificateOutlined style={{ color: 'white', fontSize: '26px' }} />
                </div>

                <Title level={2} style={{ color: '#01263f', margin: '0 0 12px 0', fontWeight: 900, fontSize: '28px', textAlign: 'center' }}>
                    Đặt lại mật khẩu
                </Title>
                
                <Text style={{ color: '#64748b', fontSize: '14px', marginBottom: '35px', textAlign: 'center', display: 'block', lineHeight: '1.6' }}>
                    Vui lòng thiết lập mật khẩu mới có độ bảo mật cao để bảo vệ tài khoản của bạn.
                </Text>

                <Form
                    name="reset_password_form"
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    style={{ width: '100%' }}
                >
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>MẬT KHẨU MỚI</span>
                    </div>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên!' }
                        ]}
                        style={{ marginBottom: '20px' }}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                            placeholder="••••••••" 
                            style={{ 
                                backgroundColor: '#eaeeef', 
                                border: 'none', 
                                borderRadius: '8px', 
                                height: '52px',
                                fontSize: '14px'
                            }}
                        />
                    </Form.Item>

                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>XÁC NHẬN MẬT KHẨU</span>
                    </div>
                    <Form.Item
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' }
                        ]}
                        style={{ marginBottom: '30px' }}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                            placeholder="••••••••" 
                            style={{ 
                                backgroundColor: '#eaeeef', 
                                border: 'none', 
                                borderRadius: '8px', 
                                height: '52px',
                                fontSize: '14px'
                            }}
                        />
                    </Form.Item>

                    {/* Password Strength Indicators */}
                    <div style={{ marginBottom: '35px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: '#1b742a' }} />
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: '#1b742a' }} />
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: '#1b742a' }} />
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: '#cbd5e1' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircleFilled style={{ color: '#1b742a', fontSize: '14px' }} />
                            <Text style={{ color: '#64748b', fontSize: '12px' }}>Độ bảo mật: <strong style={{color: '#1b742a'}}>Mạnh</strong></Text>
                        </div>
                    </div>

                    <Form.Item style={{ marginBottom: '10px' }}>
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
                            Cập nhật mật khẩu <ArrowRightOutlined style={{ marginLeft: '12px' }} />
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            
            {/* Bottom Border Accent */}
            <div style={{ width: '100%', maxWidth: '480px', display: 'flex', height: '4px' }}>
                <div style={{ flex: '0 0 45%', backgroundColor: '#01263f', borderRadius: '0 0 0 12px' }} />
                <div style={{ flex: '0 0 55%', backgroundColor: '#1b742a', borderRadius: '0 0 12px 0' }} />
            </div>
        </div>
    );
};

export default ResetPassword;
