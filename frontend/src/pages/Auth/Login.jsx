import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Row, Col, Space, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined, PhoneFilled, MailFilled, GoogleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Xử lý Google OAuth callback
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userStr = urlParams.get('user');
        const error = urlParams.get('error');

        if (error) {
            message.error('Đăng nhập Google thất bại!');
        } else if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                login(token, user);
                message.success('Đăng nhập Google thành công!');
                
                // Redirect theo role
                if (user.role === 'admin' || user.role === 'officer') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/renter/dashboard');
                }
            } catch (err) {
                message.error('Lỗi xử lý đăng nhập Google!');
            }
        }
    }, [login, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', values);
            const { token, user } = response.data;

            // Sử dụng AuthContext để lưu session
            login(token, user);

            message.success('Đăng nhập thành công!');

            // Redirect theo role
            if (user.role === 'admin' || user.role === 'officer') {
                navigate('/admin/dashboard');
            } else {
                navigate('/renter/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error(error.response?.data?.message || 'Đăng nhập thất bại.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý đăng nhập Google
    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            // Redirect đến Google OAuth
            window.location.href = 'http://localhost:5000/api/auth/google';
        } catch (error) {
            message.error('Đăng nhập Google thất bại!');
            setGoogleLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#2d4b5b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1000px',
                height: '700px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative'
            }}>
                {/* ---------- LEFT COLUMN ---------- */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#01263f',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background Pattern / Grid */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                        zIndex: 0
                    }} />

                    {/* Logo Section */}
                    <div style={{ display: 'flex', alignItems: 'center', zIndex: 1, marginBottom: '60px' }}>
                        <div style={{
                            backgroundColor: '#1b742a',
                            width: '36px',
                            height: '36px',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '12px'
                        }}>
                            {/* Simple generic logo icon */}
                            <svg width="22" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 22H22L12 2Z" fill="white" />
                                <path d="M12 10L7 20H17L12 10Z" fill="#1b742a" />
                            </svg>
                        </div>
                        <Text style={{ color: 'white', fontWeight: 800, fontSize: '20px', letterSpacing: '1px' }}>
                            ĐẤT VIỆT CORE
                        </Text>
                    </div>

                    {/* Main Text */}
                    <div style={{ zIndex: 1, flex: 1 }}>
                        <Title level={1} style={{ color: 'white', margin: 0, fontSize: '42px', fontWeight: 800 }}>
                            Cốt lõi của
                        </Title>
                        <Title level={1} style={{ color: '#88f390', margin: '0 0 20px 0', fontSize: '42px', fontWeight: 800 }}>
                            Sự Thịnh Vượng
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: '1.6', display: 'block', maxWidth: '380px' }}>
                            Hệ thống quản lý đất đai hiện đại, minh bạch và an toàn.
                            Nền tảng kiến tạo giá trị bền vững cho cộng đồng và nhà nước.
                        </Text>
                    </div>

                    {/* Bottom Features */}
                    <div style={{ zIndex: 1, display: 'flex', gap: '30px' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <span style={{ color: '#1b742a', marginRight: '6px', fontSize: '14px' }}>●</span> DỮ LIỆU TẬP TRUNG
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <span style={{ color: '#1b742a', marginRight: '6px', fontSize: '14px' }}>●</span> BẢO MẬT TỐI ĐA
                        </Text>
                    </div>

                    {/* Building Silhouette Mockup */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: '-20px',
                        width: '250px',
                        height: '180px',
                        opacity: 0.2,
                        zIndex: 0
                    }}>
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                            <polygon points="50,10 10,40 90,40" fill="white" />
                            <rect x="10" y="40" width="80" height="60" fill="white" />
                            <rect x="20" y="55" width="10" height="45" fill="#01263f" />
                            <rect x="45" y="55" width="10" height="45" fill="#01263f" />
                            <rect x="70" y="55" width="10" height="45" fill="#01263f" />
                        </svg>
                    </div>
                </div>

                {/* ---------- RIGHT COLUMN ---------- */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#ebeeef',
                    padding: '50px 60px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Title level={2} style={{ color: '#01263f', margin: '0 0 8px 0', fontWeight: 900, fontSize: '28px' }}>
                        ĐĂNG NHẬP
                    </Title>
                    <Text style={{ color: '#7a8c96', fontSize: '14px', marginBottom: '40px', display: 'block' }}>
                        Hệ thống Quản lý Đất Công ích
                    </Text>

                    <Form
                        name="login_form"
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#5b6b75', textTransform: 'uppercase', letterSpacing: '1px' }}>TÊN ĐĂNG NHẬP / EMAIL</span>
                        </div>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            style={{ marginBottom: '24px' }}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#a0aeb6', marginRight: '8px' }} />}
                                placeholder="Nhập tên đăng nhập"
                                style={{
                                    backgroundColor: '#dfe4e6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    height: '55px',
                                    fontSize: '14px'
                                }}
                            />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#5b6b75', textTransform: 'uppercase', letterSpacing: '1px' }}>MẬT KHẨU</span>
                            <Link to="/forgot-password" style={{ fontSize: '11px', fontWeight: 800, color: '#01263f', textTransform: 'uppercase' }}>
                                QUÊN MẬT KHẨU?
                            </Link>
                        </div>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            style={{ marginBottom: '20px' }}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#a0aeb6', marginRight: '8px' }} />}
                                placeholder="••••••••"
                                style={{
                                    backgroundColor: '#dfe4e6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    height: '55px',
                                    fontSize: '14px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: '32px' }}>
                            <Checkbox style={{ color: '#5b6b75', fontSize: '13px', fontWeight: 500 }}>Ghi nhớ đăng nhập</Checkbox>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '16px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{
                                    backgroundColor: '#01263f',
                                    height: '55px',
                                    borderRadius: '6px',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                Truy cập hệ thống <ArrowRightOutlined style={{ marginLeft: '8px' }} />
                            </Button>
                        </Form.Item>

                        {/* Divider */}
                        <Divider style={{ margin: '24px 0', color: '#8c9ea7' }}>
                            <span style={{ fontSize: '12px', color: '#8c9ea7' }}>HOẶC</span>
                        </Divider>

                        {/* Google Login Button */}
                        <Form.Item style={{ marginBottom: '24px' }}>
                            <Button
                                onClick={handleGoogleLogin}
                                loading={googleLoading}
                                block
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #e0e0e0',
                                    height: '55px',
                                    borderRadius: '6px',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#333'
                                }}
                            >
                                <GoogleOutlined style={{ marginRight: '8px', color: '#4285f4' }} />
                                Đăng nhập với Google
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Text style={{ color: '#5b6b75', fontSize: '13px' }}>
                                Chưa có tài khoản đăng nhập?{' '}
                                <Link to="/register" style={{ color: '#01263f', fontWeight: 800 }}>
                                    Đăng ký ngay
                                </Link>
                            </Text>
                        </div>
                    </Form>

                    {/* Footer Support Area */}
                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#d5dcde' }} />
                            <Text style={{ margin: '0 15px', color: '#8c9ea7', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                HỖ TRỢ KỸ THUẬT
                            </Text>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#d5dcde' }} />
                        </div>

                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: '#ebeeef', padding: '8px', borderRadius: '50%', marginRight: '10px', display: 'flex' }}>
                                        <PhoneFilled style={{ color: '#01263f', fontSize: '12px' }} />
                                    </div>
                                    <div>
                                        <Text style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#8c9ea7', textTransform: 'uppercase' }}>HOTLINE</Text>
                                        <Text style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#01263f' }}>1900 8888</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: '#ebeeef', padding: '8px', borderRadius: '50%', marginRight: '10px', display: 'flex' }}>
                                        <MailFilled style={{ color: '#01263f', fontSize: '12px' }} />
                                    </div>
                                    <div>
                                        <Text style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#8c9ea7', textTransform: 'uppercase' }}>EMAIL</Text>
                                        <Text style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#01263f' }}>support@datviet.vn</Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center', zIndex: 1, paddingBottom: '20px' }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    © 2024 CỤC ĐĂNG KÝ VÀ DỮ LIỆU THÔNG TIN ĐẤT ĐAI – PHIÊN BẢN 4.2.0
                </Text>
            </div>
        </div>
    );
};

export default Login;
