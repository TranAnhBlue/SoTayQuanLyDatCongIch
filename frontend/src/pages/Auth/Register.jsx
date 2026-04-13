import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Checkbox, message } from 'antd';
import { 
    UserOutlined, 
    LockOutlined, 
    ArrowRightOutlined, 
    PhoneOutlined, 
    MailOutlined, 
    BankOutlined,
    IdcardOutlined,
    SafetyCertificateOutlined,
    DashboardOutlined,
    CheckCircleFilled
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            return message.error('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            // Implicitly enforce 'renter' role
            const payload = { 
                name: values.name,
                email: values.email,
                phone: values.phone,
                department: values.department,
                position: values.position,
                password: values.password,
                role: 'renter' 
            };
            const response = await axios.post('http://localhost:5000/api/auth/register', payload);
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            message.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#2d4b5b', // Unified with Login page
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1100px', 
                height: '750px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                backgroundColor: 'white' // Fallback
            }}>
                {/* ---------- LEFT COLUMN ---------- */}
                <div style={{
                    flex: '0 0 400px', // Fixed width for visibility on narrow screens
                    background: 'linear-gradient(135deg, #01263f 0%, #033f63 100%)',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0 // CRITICAL: prevent column from disappearing
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
                            width: '40px',
                            height: '40px',
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '12px'
                        }}>
                            <svg width="24" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 22H22L12 2Z" fill="white"/>
                                <path d="M12 10L7 20H17L12 10Z" fill="#1b742a"/>
                            </svg>
                        </div>
                        <Text style={{ color: 'white', fontWeight: 800, fontSize: '22px', letterSpacing: '1px' }}>
                            ĐẤT VIỆT CORE
                        </Text>
                    </div>

                    {/* Main Text */}
                    <div style={{ zIndex: 1, flex: 1 }}>
                        <Title level={1} style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: 800, lineHeight: '1.2' }}>
                            Hệ thống Quản lý
                        </Title>
                        <Title level={1} style={{ color: '#88f390', margin: '0 0 16px 0', fontSize: '28px', fontWeight: 800, lineHeight: '1.2' }}>
                            Dữ liệu Đất đai <span style={{color: 'white'}}>Tập trung</span>
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', lineHeight: '1.6', display: 'block', maxWidth: '300px', marginTop: '10px' }}>
                            Gia nhập nền tảng số hóa hành chính chuyên nghiệp, giúp
                            tối ưu quy trình quản lý và vận hành dữ liệu công.
                        </Text>
                    </div>

                    {/* Left Bottom Cards */}
                    <div style={{ display: 'flex', gap: '15px', zIndex: 1, marginTop: '25px' }}>
                        <div style={{ 
                            flex: 1, 
                            backgroundColor: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', 
                            padding: '16px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <SafetyCertificateOutlined style={{ color: '#88f390', fontSize: '20px', marginBottom: '12px' }} />
                            <Title level={5} style={{ color: 'white', margin: '0 0 4px 0', fontWeight: 700, fontSize: '14px' }}>Bảo mật cao</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Phân quyền đa tầng</Text>
                        </div>
                        <div style={{ 
                            flex: 1, 
                            backgroundColor: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', 
                            padding: '16px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <DashboardOutlined style={{ color: '#88f390', fontSize: '20px', marginBottom: '12px' }} />
                            <Title level={5} style={{ color: 'white', margin: '0 0 4px 0', fontWeight: 700, fontSize: '14px' }}>Tốc độ tối ưu</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Dữ liệu thực tế</Text>
                        </div>
                    </div>
                </div>

                {/* ---------- RIGHT COLUMN ---------- */}
                <div style={{
                    flex: 1, // Let it take remaining space
                    backgroundColor: '#fff',
                    padding: '35px 50px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}>
                    <Title level={2} style={{ color: '#01263f', margin: '0 0 2px 0', fontWeight: 900, fontSize: '22px' }}>
                        Đăng ký tài khoản mới
                    </Title>
                    <Text style={{ color: '#7a8c96', fontSize: '12px', marginBottom: '20px', display: 'block' }}>
                        Cung cấp thông tin chính xác để phê duyệt quyền.
                    </Text>

                    <Form
                        name="register_form"
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        {/* ROW 1 */}
                        <Row gutter={20}>
                            <Col span={12}>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>HỌ VÀ TÊN</span>
                                </div>
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                    style={{ marginBottom: '12px' }}
                                >
                                    <Input 
                                        prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                        placeholder="Nguyễn Văn A" 
                                        style={{ 
                                            backgroundColor: '#e2e8f0', 
                                            border: 'none', 
                                            borderRadius: '6px', 
                                            height: '40px',
                                            fontSize: '13px',
                                            color: '#334155'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>SỐ ĐIỆN THOẠI</span>
                                </div>
                                <Form.Item
                                    name="phone"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    style={{ marginBottom: '12px' }}
                                >
                                    <Input 
                                        prefix={<PhoneOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                        placeholder="09xx xxx xxx" 
                                        style={{ 
                                            backgroundColor: '#e2e8f0', 
                                            border: 'none', 
                                            borderRadius: '6px', 
                                            height: '40px',
                                            fontSize: '13px',
                                            color: '#334155'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* ROW 2 */}
                        <Row gutter={20}>
                            <Col span={12}>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>ĐƠN VỊ CÔNG TÁC</span>
                                </div>
                                <Form.Item
                                    name="department"
                                    rules={[{ required: true, message: 'Vui lòng nhập đơn vị công tác!' }]}
                                    style={{ marginBottom: '12px' }}
                                >
                                    <Input 
                                        prefix={<BankOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                        placeholder="Phòng TN & MT..." 
                                        style={{ 
                                            backgroundColor: '#e2e8f0', 
                                            border: 'none', 
                                            borderRadius: '6px', 
                                            height: '40px',
                                            fontSize: '13px',
                                            color: '#334155'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>CHỨC VỤ</span>
                                </div>
                                <Form.Item
                                    name="position"
                                    rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
                                    style={{ marginBottom: '12px' }}
                                >
                                    <Input 
                                        prefix={<IdcardOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                        placeholder="Cán bộ chuyên môn" 
                                        style={{ 
                                            backgroundColor: '#e2e8f0', 
                                            border: 'none', 
                                            borderRadius: '6px', 
                                            height: '40px',
                                            fontSize: '13px',
                                            color: '#334155'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* ROW 3 (Full width) */}
                        <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>EMAIL CÔNG VỤ</span>
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
                                prefix={<MailOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                placeholder="canbo@tphcm.gov.vn" 
                                style={{ 
                                    backgroundColor: '#e2e8f0', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    height: '40px',
                                    fontSize: '13px',
                                    color: '#334155'
                                }}
                            />
                        </Form.Item>

                        {/* ROW 4 */}
                        <Row gutter={20}>
                            <Col span={12}>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>MẬT KHẨU</span>
                                </div>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải từ 6 ký tự!' }]}
                                    style={{ marginBottom: '12px' }}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                        placeholder="••••••••" 
                                        style={{ 
                                            backgroundColor: '#e2e8f0', 
                                            border: 'none', 
                                            borderRadius: '6px', 
                                            height: '40px',
                                            fontSize: '13px',
                                            color: '#334155'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '1px' }}>XÁC NHẬN</span>
                                </div>
                                <Form.Item
                                    name="confirmPassword"
                                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                                    style={{ marginBottom: '12px' }}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                                        placeholder="••••••••" 
                                        style={{ 
                                            backgroundColor: '#e2e8f0', 
                                            border: 'none', 
                                            borderRadius: '6px', 
                                            height: '40px',
                                            fontSize: '13px',
                                            color: '#334155'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* TOS Checkbox */}
                        <Form.Item 
                            name="agreement" 
                            valuePropName="checked" 
                            rules={[
                                { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý điều khoản')) }
                            ]}
                            style={{ marginBottom: '12px' }}
                        >
                            <Checkbox style={{ fontSize: '11px', color: '#475569', lineHeight: '1.3' }}>
                                Tôi xác nhận các thông tin trên là chính xác và đồng ý <br/>
                                <span style={{ color: '#1b742a', fontWeight: 700 }}>Điều khoản sử dụng</span> của hệ thống.
                            </Checkbox>
                        </Form.Item>

                        {/* Submit Button */}
                        <Form.Item style={{ marginBottom: '10px' }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                block
                                style={{ 
                                    backgroundColor: '#0f3248', 
                                    height: '42px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                Đăng ký tài khoản <ArrowRightOutlined style={{ marginLeft: '8px' }} />
                            </Button>
                        </Form.Item>

                        {/* Footer Link */}
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <Text style={{ color: '#64748b', fontSize: '13px' }}>
                                Đã có tài khoản?{' '}
                                <Link to="/login" style={{ color: '#0f3248', fontWeight: 800 }}>
                                    Đăng nhập ngay
                                </Link>
                            </Text>
                        </div>
                    </Form>
                    
                    {/* Bottom abstract layout logic */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', padding: '15px 0', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleFilled style={{ color: '#64748b', fontSize: '11px', marginRight: '6px' }} />
                            <Text style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>Cục Chuyển đổi số</Text>
                        </div>
                        <div>
                            <Text style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>HỖ TRỢ   LIÊN HỆ</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
