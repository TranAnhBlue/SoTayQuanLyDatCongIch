import React from 'react';
import { Button, Typography, Row, Col, Card } from 'antd';
import { LockOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Forbidden.css';

const { Title, Paragraph, Text } = Typography;

/**
 * Trang 403 - Forbidden (Truy cập bị từ chối)
 * Hiển thị khi user không có quyền truy cập trang
 */
const Forbidden = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'officer') {
      navigate('/officer/dashboard');
    } else if (user?.role === 'renter') {
      navigate('/renter/dashboard');
    } else if (user?.role === 'finance') {
      navigate('/finance/dashboard');
    } else if (user?.role === 'inspector') {
      navigate('/inspector/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="forbidden-page">
      {/* Header */}
      <div className="forbidden-header">
        <div className="forbidden-container">
          <Text className="forbidden-brand">ĐẤT VIỆT CORE</Text>
        </div>
      </div>

      {/* Main Content */}
      <div className="forbidden-container">
        <Row gutter={[48, 48]} align="middle" justify="center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          {/* Left Column - Error Message */}
          <Col xs={24} md={12}>
            <div className="forbidden-content">
              <div className="forbidden-code">403</div>
              <Title level={2} className="forbidden-title">
                Truy Cập Bị Từ Chối
              </Title>
              <Paragraph className="forbidden-description">
                Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn tin rằng đây là một sự nhầm lẫn.
              </Paragraph>

              <div className="forbidden-actions">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleGoBack}
                  className="btn-go-back"
                >
                  Quay Lại
                </Button>
                <Button 
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={handleGoHome}
                  className="btn-go-home"
                >
                  Về Trang Chủ
                </Button>
              </div>

              {user && (
                <div className="forbidden-user-info">
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Tài khoản: <strong>{user.email}</strong>
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Vai trò: <strong>
                      {user.role === 'admin' ? 'Quản trị viên' :
                       user.role === 'officer' ? 'Cán bộ địa chính' :
                       user.role === 'renter' ? 'Người thuê đất' :
                       user.role === 'finance' ? 'Tài chính' :
                       user.role === 'inspector' ? 'Thanh tra' : 'Không xác định'}
                    </strong>
                  </Text>
                </div>
              )}
            </div>
          </Col>

          {/* Right Column - Lock Icon Card */}
          <Col xs={24} md={12}>
            <div className="forbidden-card-wrapper">
              <Card className="forbidden-card">
                <div className="forbidden-icon-wrapper">
                  <LockOutlined className="forbidden-icon" />
                </div>
                
                <Title level={4} className="forbidden-card-title">
                  Giao Thức Bảo Mật
                </Title>

                <div className="forbidden-card-content">
                  <div className="forbidden-card-item">
                    <div className="forbidden-card-check">✓</div>
                    <div>
                      <div className="forbidden-card-label">ID Hệ Thống</div>
                      <div className="forbidden-card-value">ĐV-CORE-403-PR</div>
                    </div>
                  </div>

                  <div className="forbidden-card-item">
                    <div className="forbidden-card-check">✓</div>
                    <div>
                      <div className="forbidden-card-label">Thời gian</div>
                      <div className="forbidden-card-value">{new Date().toLocaleString('vi-VN')}</div>
                    </div>
                  </div>
                </div>

                <Paragraph className="forbidden-card-quote">
                  "Tính minh bạch bạch và bảo mật là nền tảng của quản lý đất đai hiệu quả."
                </Paragraph>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <div className="forbidden-footer">
        <div className="forbidden-container">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 Cổng Thông Tin Đất Việt Core • Hệ Thống Quản Lý Đất Công Ích Quốc Gia
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
