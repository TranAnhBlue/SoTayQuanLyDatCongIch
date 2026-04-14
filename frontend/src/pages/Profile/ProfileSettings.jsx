import { useState } from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Space, 
  Divider,
  Progress,
  message,
  Badge,
  Upload,
  Modal
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  CameraOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now()); // Force re-render avatar
  
  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,      // Tối thiểu 12 ký tự
    hasUppercase: false,   // Có chữ hoa (A-Z)
    hasLowercase: false,   // Có chữ thường (a-z)
    hasNumber: false,      // Có số (0-9)
    hasSpecial: false,     // Có ký tự đặc biệt
    isConfirmed: false     // Xác nhận mật khẩu khớp
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validate password in real-time
  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      isConfirmed: confirmPassword ? password === confirmPassword : false
    };
    setPasswordValidation(validation);
    return validation;
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPwd) => {
    const validation = {
      ...passwordValidation,
      isConfirmed: newPassword ? newPassword === confirmPwd : false
    };
    setPasswordValidation(validation);
    return validation;
  };

  // Check if all validations pass
  const isPasswordValid = () => {
    return passwordValidation.minLength && 
           passwordValidation.hasUppercase && 
           passwordValidation.hasLowercase && 
           passwordValidation.hasNumber && 
           passwordValidation.hasSpecial && 
           passwordValidation.isConfirmed;
  };

  // Hàm quay về dashboard theo role
  const handleGoBack = () => {
    if (user?.role === 'admin' || user?.role === 'officer') {
      navigate('/admin/dashboard');
    } else {
      navigate('/renter/dashboard');
    }
  };

  // Xử lý upload avatar
  const handleAvatarUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại');
      }
      
      console.log('Uploading avatar:', file.name, file.size, 'bytes');
      
      const response = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        // Cập nhật user với avatar mới
        const updatedUser = { ...user, avatar: response.data.avatarUrl };
        updateUser(updatedUser);
        message.success('Cập nhật avatar thành công!');
        setAvatarModalVisible(false);
        
        // Force refresh avatar display
        setAvatarKey(Date.now());
        
        // Trigger a re-render of the entire app to update header/sidebar
        setTimeout(() => {
          window.dispatchEvent(new Event('user-updated'));
        }, 500);
      } else {
        throw new Error(response.data.message || 'Upload thất bại');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      console.error('Error response:', error.response?.data);
      message.error(error.response?.data?.message || error.message || 'Upload avatar thất bại!');
    } finally {
      setUploading(false);
    }
  };

  // Props cho Upload component
  const uploadProps = {
    name: 'avatar',
    listType: 'picture-card',
    className: 'avatar-uploader',
    showUploadList: false,
    accept: 'image/*',
    beforeUpload: (file) => {
      console.log('File selected:', file);
      
      // Kiểm tra loại file
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP)!');
        return false;
      }
      
      // Kiểm tra kích thước file (5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Kích thước file phải nhỏ hơn 5MB!');
        return false;
      }
      
      console.log('File validation passed, uploading...');
      handleAvatarUpload(file);
      return false; // Prevent default upload
    },
  };
  const handleUpdateProfile = async (values) => {
    setEditLoading(true);
    try {
      console.log('Updating profile with values:', values);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại');
      }
      
      const response = await axios.put('http://localhost:5000/api/auth/profile', values, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile update response:', response.data);
      
      if (response.data.success) {
        // Cập nhật user trong context
        updateUser(response.data.user);
        message.success('Cập nhật thông tin thành công!');
        
        // Force refresh để cập nhật UI
        setAvatarKey(Date.now());
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      message.error(error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại!');
    } finally {
      setEditLoading(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (values) => {
    setPasswordLoading(true);
    try {
      console.log('Changing password...');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại');
      }
      
      const response = await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Password change response:', response.data);
      
      if (response.data.success) {
        message.success('Đổi mật khẩu thành công!');
        passwordForm.resetFields();
        
        // Reset password validation states
        setPasswordValidation({
          minLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false,
          isConfirmed: false
        });
        setNewPassword('');
        setConfirmPassword('');
        
        // Update user's lastPasswordChange in context
        const updatedUser = { ...user, lastPasswordChange: new Date().toISOString() };
        updateUser(updatedUser);
      } else {
        throw new Error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Password change error:', error);
      message.error(error.response?.data?.message || error.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Kiểm tra độ mạnh mật khẩu
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[!@#$%^&*]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#ff4d4f';
    if (passwordStrength < 75) return '#faad14';
    return '#52c41a';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Yếu';
    if (passwordStrength < 50) return 'Trung bình';
    if (passwordStrength < 75) return 'Mạnh';
    return 'Rất mạnh';
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header với nút quay về */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleGoBack}
            style={{ marginRight: '16px', color: '#002e42' }}
          >
            Quay về
          </Button>
          <Title level={2} style={{ margin: 0, color: '#002e42', fontWeight: 800 }}>
            Chỉnh sửa Hồ sơ
          </Title>
        </div>
        <Text style={{ fontSize: '14px', color: '#595959' }}>
          Cập nhật thông tin định danh và thông tin cơ bản của bạn trong hệ thống quản lý đất đai quốc gia.
        </Text>
      </div>

      <Row gutter={[32, 32]}>
        {/* Left Column - Profile Info */}
        <Col span={14}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>Thông tin chi tiết</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Form
              form={editForm}
              layout="vertical"
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                department: user?.department || '',
                position: user?.position || '',
                notes: 'Thêm mô tả về phạm vi quản lý hoặc ghi chú nghiệp vụ...'
              }}
              onFinish={handleUpdateProfile}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>HỌ VÀ TÊN</Text>}
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input 
                      placeholder="Nguyễn Văn An"
                      style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>CHỨC VỤ</Text>}
                    name="position"
                    rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
                  >
                    <Input 
                      placeholder="Chuyên viên cao cấp"
                      style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>CƠ QUAN / PHÒNG BAN</Text>}
                    name="department"
                    rules={[{ required: true, message: 'Vui lòng nhập cơ quan!' }]}
                  >
                    <Input 
                      placeholder="Văn phòng Đăng ký Đất đai"
                      style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>SỐ ĐIỆN THOẠI</Text>}
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input 
                      placeholder="090 123 4567"
                      style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>ĐỊA CHỈ EMAIL</Text>}
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input 
                  placeholder="an.nguyen@datvietcore.gov.vn"
                  style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>GHI CHÚ NGHIỆP VỤ</Text>}
                name="notes"
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Thêm mô tả về phạm vi quản lý hoặc ghi chú nghiệp vụ..."
                  style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px' }}
                />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                {/* <Button 
                  size="large"
                  style={{ borderRadius: '6px', minWidth: '100px' }}
                >
                  Hủy bỏ
                </Button> */}
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={editLoading}
                  size="large"
                  style={{ 
                    backgroundColor: '#1e7e34', 
                    borderRadius: '6px', 
                    minWidth: '120px',
                    fontWeight: 600,
                  }}
                >
                  Lưu Thay Đổi
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Right Column - Avatar & Security */}
        <Col span={10}>
          {/* Avatar Section với khả năng edit */}
          <Card style={{ marginBottom: 24, textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <Avatar 
                key={avatarKey}
                size={120} 
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                style={{ border: '4px solid #f0f0f0' }}
              />
              <Badge 
                count={<CameraOutlined style={{ color: 'white', fontSize: '12px' }} />}
                style={{ 
                  backgroundColor: '#1e7e34',
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setAvatarModalVisible(true)}
              />
            </div>
            <Title level={4} style={{ margin: '8px 0 4px 0', color: '#002e42' }}>
              {user?.name || 'Người dùng'}
            </Title>
            <Text style={{ color: '#1e7e34', fontWeight: 600, textTransform: 'uppercase', fontSize: '12px' }}>
              {user?.position || 'CHỨC VỤ'}
            </Text>
            
            <Divider />
            
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Trạng thái hồ sơ</Text>
                <div style={{ marginTop: '4px' }}>
                  <Badge status="success" />
                  <Text style={{ fontSize: '13px', fontWeight: 500 }}>HOÀN TẤT</Text>
                </div>
              </div>
              
              <div>
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Ngày gia nhập</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text style={{ fontSize: '13px', fontWeight: 500 }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '12/05/2018'}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card 
            title={
              <Space>
                <LockOutlined />
                <span>Bảo mật tài khoản</span>
              </Space>
            }
            styles={{ 
              header: { backgroundColor: '#002e42', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' },
              body: { backgroundColor: '#002e42' }
            }}
            style={{ backgroundColor: '#002e42', color: 'white' }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', display: 'block', marginBottom: '16px' }}>
              Tài khoản của bạn được bảo mật bằng phương pháp xác thực hai yếu tố (2FA).
            </Text>
            
            <Button 
              block
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '6px',
                height: '40px',
                fontWeight: 500
              }}
              onClick={() => {
                // Scroll to password section or open modal
                document.getElementById('password-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Thay đổi mật khẩu
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Password Change Section */}
      <Card 
        id="password-section"
        title={
          <div>
            <Title level={3} style={{ margin: 0, color: '#002e42' }}>
              Bảo mật hệ thống <span style={{ color: '#1e7e34' }}>Đất Việt Core</span>
            </Title>
            <Text style={{ fontSize: '14px', color: '#595959' }}>
              Cập nhật mật khẩu định kỳ để bảo vệ dữ liệu đất đai quốc gia và thông tin cá nhân của quản trị viên.
            </Text>
          </div>
        }
        style={{ marginTop: 32 }}
      >
        <Row gutter={32}>
          <Col span={14}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>MẬT KHẨU HIỆN TẠI</Text>}
                name="currentPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              >
                <Input.Password 
                  placeholder="••••••••••"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>MẬT KHẨU MỚI</Text>}
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 12, message: 'Mật khẩu phải có ít nhất 12 ký tự!' }
                ]}
              >
                <Input.Password 
                  placeholder="Nhập mật khẩu mới"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                  onChange={(e) => {
                    const password = e.target.value;
                    setNewPassword(password);
                    validatePassword(password);
                    checkPasswordStrength(password);
                  }}
                />
              </Form.Item>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Độ mạnh mật khẩu</Text>
                  <Text style={{ fontSize: '12px', color: getPasswordStrengthColor(), fontWeight: 600 }}>
                    {getPasswordStrengthText()}
                  </Text>
                </div>
                <Progress 
                  percent={passwordStrength} 
                  strokeColor={getPasswordStrengthColor()}
                  showInfo={false}
                  size="small"
                />
              </div>

              <Form.Item
                label={<Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>XÁC NHẬN MẬT KHẨU MỚI</Text>}
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  placeholder="Nhập lại mật khẩu mới"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '6px', height: '40px' }}
                  onChange={(e) => {
                    const confirmPwd = e.target.value;
                    setConfirmPassword(confirmPwd);
                    validateConfirmPassword(confirmPwd);
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: '32px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={passwordLoading}
                  disabled={!isPasswordValid()}
                  size="large"
                  block
                  style={{ 
                    backgroundColor: isPasswordValid() ? '#1e7e34' : '#d9d9d9', 
                    borderColor: isPasswordValid() ? '#1e7e34' : '#d9d9d9',
                    borderRadius: '6px', 
                    height: '48px',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: isPasswordValid() ? 'pointer' : 'not-allowed'
                  }}
                  icon={<SafetyCertificateOutlined />}
                >
                  Cập nhật mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col span={10}>
            {/* Security Guidelines with Real-time Validation */}
            <Card 
              title={
                <Space>
                  <SafetyCertificateOutlined style={{ color: '#1e7e34' }} />
                  <span>Quy định bảo mật</span>
                </Space>
              }
              style={{ backgroundColor: '#f8fffe', border: '1px solid #d9f7be' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircleOutlined 
                    style={{ 
                      color: passwordValidation.minLength ? '#1e7e34' : '#d9d9d9', 
                      marginTop: '2px',
                      transition: 'color 0.3s ease'
                    }} 
                  />
                  <Text 
                    style={{ 
                      fontSize: '13px',
                      color: passwordValidation.minLength ? '#1e7e34' : '#8c8c8c',
                      fontWeight: passwordValidation.minLength ? 600 : 400,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Tối thiểu 12 ký tự trở lên.
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircleOutlined 
                    style={{ 
                      color: passwordValidation.hasUppercase ? '#1e7e34' : '#d9d9d9', 
                      marginTop: '2px',
                      transition: 'color 0.3s ease'
                    }} 
                  />
                  <Text 
                    style={{ 
                      fontSize: '13px',
                      color: passwordValidation.hasUppercase ? '#1e7e34' : '#8c8c8c',
                      fontWeight: passwordValidation.hasUppercase ? 600 : 400,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Bao gồm ít nhất một chữ hoa (A-Z).
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircleOutlined 
                    style={{ 
                      color: passwordValidation.hasLowercase ? '#1e7e34' : '#d9d9d9', 
                      marginTop: '2px',
                      transition: 'color 0.3s ease'
                    }} 
                  />
                  <Text 
                    style={{ 
                      fontSize: '13px',
                      color: passwordValidation.hasLowercase ? '#1e7e34' : '#8c8c8c',
                      fontWeight: passwordValidation.hasLowercase ? 600 : 400,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Bao gồm ít nhất một chữ thường (a-z).
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircleOutlined 
                    style={{ 
                      color: passwordValidation.hasNumber ? '#1e7e34' : '#d9d9d9', 
                      marginTop: '2px',
                      transition: 'color 0.3s ease'
                    }} 
                  />
                  <Text 
                    style={{ 
                      fontSize: '13px',
                      color: passwordValidation.hasNumber ? '#1e7e34' : '#8c8c8c',
                      fontWeight: passwordValidation.hasNumber ? 600 : 400,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Bao gồm ít nhất một chữ số (0-9).
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircleOutlined 
                    style={{ 
                      color: passwordValidation.hasSpecial ? '#1e7e34' : '#d9d9d9', 
                      marginTop: '2px',
                      transition: 'color 0.3s ease'
                    }} 
                  />
                  <Text 
                    style={{ 
                      fontSize: '13px',
                      color: passwordValidation.hasSpecial ? '#1e7e34' : '#8c8c8c',
                      fontWeight: passwordValidation.hasSpecial ? 600 : 400,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sử dụng ký tự đặc biệt (!@#$%^&*).
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircleOutlined 
                    style={{ 
                      color: passwordValidation.isConfirmed ? '#1e7e34' : '#d9d9d9', 
                      marginTop: '2px',
                      transition: 'color 0.3s ease'
                    }} 
                  />
                  <Text 
                    style={{ 
                      fontSize: '13px',
                      color: passwordValidation.isConfirmed ? '#1e7e34' : '#8c8c8c',
                      fontWeight: passwordValidation.isConfirmed ? 600 : 400,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Xác nhận mật khẩu khớp nhau.
                  </Text>
                </div>
              </div>
              
              {/* Overall validation status */}
              {newPassword && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  backgroundColor: isPasswordValid() ? '#f6ffed' : '#fff2e8',
                  border: `1px solid ${isPasswordValid() ? '#b7eb8f' : '#ffbb96'}`,
                  borderRadius: '6px'
                }}>
                  <Text style={{ 
                    fontSize: '12px', 
                    color: isPasswordValid() ? '#1e7e34' : '#fa8c16',
                    fontWeight: 600
                  }}>
                    {isPasswordValid() 
                      ? '✓ Mật khẩu đáp ứng tất cả yêu cầu bảo mật' 
                      : '⚠ Vui lòng hoàn thành tất cả yêu cầu bảo mật'
                    }
                  </Text>
                </div>
              )}
            </Card>

            {/* Last Update Info - chỉ hiển thị khi đã từng đổi mật khẩu */}
            {user?.lastPasswordChange && (
              <div style={{ 
                backgroundColor: '#e6f7ff', 
                border: '1px solid #91d5ff',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>LẦN ĐỔI GẦN NHẤT</Text>
                </div>
                <Text style={{ fontSize: '14px', fontWeight: 600 }}>
                  {new Date(user.lastPasswordChange).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                  })}
                </Text>
              </div>
            )}

            {/* Thông báo cho tài khoản mới */}
            {!user?.lastPasswordChange && (
              <div style={{ 
                backgroundColor: '#fff7e6', 
                border: '1px solid #ffd591',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />
                  <Text strong style={{ fontSize: '13px', color: '#fa8c16' }}>TÀI KHOẢN MỚI</Text>
                </div>
                <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                  Chưa có lịch sử đổi mật khẩu. Khuyến nghị đổi mật khẩu định kỳ để bảo mật tài khoản.
                </Text>
              </div>
            )}

            {/* Security Quote */}
            <div style={{ 
              backgroundColor: '#f6f8fa', 
              borderRadius: '8px',
              padding: '16px',
              marginTop: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(30, 126, 52, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)'
              }} />
              <Text style={{ 
                fontSize: '13px', 
                fontStyle: 'italic', 
                color: '#595959',
                position: 'relative',
                zIndex: 1
              }}>
                "An toàn thông tin là nền tảng của sự phát triển bền vững."
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Modal Upload Avatar */}
      <Modal
        title="Cập nhật Avatar"
        open={avatarModalVisible}
        onCancel={() => setAvatarModalVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Avatar 
            key={avatarKey}
            size={120} 
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            style={{ marginBottom: '20px' }}
          />
          <div>
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />} 
                loading={uploading}
                type="primary"
                style={{ backgroundColor: '#1e7e34' }}
              >
                {uploading ? 'Đang tải lên...' : 'Chọn ảnh mới'}
              </Button>
            </Upload>
            <div style={{ marginTop: '12px', color: '#8c8c8c', fontSize: '12px' }}>
              Hỗ trợ: JPG, PNG. Tối đa 2MB
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileSettings;