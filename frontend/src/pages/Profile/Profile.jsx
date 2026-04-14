import React from 'react';
import { Row, Col, Typography, Card, Space, Button, Divider } from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  SafetyCertificateOutlined,
  HistoryOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

/**
 * Trang Profile - Hiển thị thông tin tài khoản và session
 */
const Profile = () => {
  const { user } = useAuth();

  const handleUpdateProfile = () => {
    // TODO: Implement profile update modal
    console.log('Update profile clicked');
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: '0 0 8px 0', color: '#002e42', fontWeight: 800 }}>
          Thông tin tài khoản
        </Title>
        <Text style={{ fontSize: '14px', color: '#595959' }}>
          Quản lý thông tin cá nhân và bảo mật tài khoản
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - User Info */}
        <Col span={16}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>Thông tin cá nhân</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleUpdateProfile}
              >
                Chỉnh sửa
              </Button>
            }
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                    HỌ VÀ TÊN
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {user?.name || 'N/A'}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                    EMAIL
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {user?.email || 'N/A'}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                    SỐ ĐIỆN THOẠI
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {user?.phone || 'N/A'}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                    VAI TRÒ
                  </Text>
                  <Text strong style={{ fontSize: '16px', textTransform: 'capitalize' }}>
                    {user?.role === 'admin' ? 'Quản trị viên' : 
                     user?.role === 'officer' ? 'Cán bộ' :
                     user?.role === 'renter' ? 'Người thuê đất' : 'N/A'}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                    ĐơN VỊ CÔNG TÁC
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {user?.department || 'N/A'}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                    CHỨC VỤ
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {user?.position || 'N/A'}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Activity History */}
          <Card 
            title={
              <Space>
                <HistoryOutlined />
                <span>Lịch sử hoạt động</span>
              </Space>
            }
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <HistoryOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: 16 }} />
              <Text type="secondary">Tính năng đang phát triển</Text>
            </div>
          </Card>
        </Col>

        {/* Right Column - Security Info */}
        <Col span={8}>
          <Card 
            title={
              <Space>
                <SafetyCertificateOutlined />
                <span>Bảo mật tài khoản</span>
              </Space>
            }
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Trạng thái đăng nhập:</Text>
                <Text strong style={{ color: '#52c41a' }}>
                  Đang hoạt động
                </Text>
              </div>
              
              <Divider style={{ margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Bảo mật tài khoản:</Text>
                <Text strong style={{ color: '#52c41a' }}>
                  An toàn
                </Text>
              </div>
              
              <Divider style={{ margin: '8px 0' }} />
              
              <Button 
                type="primary" 
                block
                style={{ marginTop: 16 }}
                onClick={() => window.location.href = '/profile'}
              >
                Cài đặt bảo mật
              </Button>
            </Space>
          </Card>
          
          {/* Quick Stats */}
          <Card 
            title={
              <Space>
                <HistoryOutlined />
                <span>Thống kê nhanh</span>
              </Space>
            }
            style={{ marginTop: 24 }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Vai trò:</Text>
                <Text strong>
                  {user?.role === 'admin' ? 'Quản trị viên' : 
                   user?.role === 'officer' ? 'Cán bộ' :
                   user?.role === 'renter' ? 'Người thuê đất' : 'N/A'}
                </Text>
              </div>
              
              <Divider style={{ margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Trạng thái tài khoản:</Text>
                <Text strong style={{ color: '#52c41a' }}>
                  Hoạt động
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;