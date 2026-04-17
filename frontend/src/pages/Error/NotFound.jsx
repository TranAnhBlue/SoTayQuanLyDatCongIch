import React from 'react';
import { Button, Typography, Row, Col, Card } from 'antd';
import { SearchOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const { Title, Paragraph, Text } = Typography;

/**
 * Trang 404 - Not Found (Trang không tồn tại)
 * Hiển thị khi user truy cập vào URL không tồn tại
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-page">
      {/* Header */}
      <div className="not-found-header">
        <div className="not-found-container">
          <Text className="not-found-brand">ĐẤT VIỆT CORE</Text>
        </div>
      </div>

      {/* Main Content */}
      <div className="not-found-container">
        <Row gutter={[48, 48]} align="middle" justify="center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          {/* Left Column - Error Message */}
          <Col xs={24} md={12}>
            <div className="not-found-content">
              <div className="not-found-code">404</div>
              <Title level={2} className="not-found-title">
                Trang Không Tồn Tại
              </Title>
              <Paragraph className="not-found-description">
                Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại URL hoặc quay lại trang chủ.
              </Paragraph>

              <div className="not-found-actions">
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

              <div className="not-found-search-hint">
                <SearchOutlined className="search-icon" />
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Bạn có thể sử dụng thanh tìm kiếm để tìm thông tin cần thiết
                </Text>
              </div>
            </div>
          </Col>

          {/* Right Column - Illustration Card */}
          <Col xs={24} md={12}>
            <div className="not-found-card-wrapper">
              <Card className="not-found-card">
                <div className="not-found-illustration">
                  <div className="illustration-circle">
                    <div className="illustration-question">?</div>
                  </div>
                </div>
                
                <Title level={4} className="not-found-card-title">
                  Có Gì Sai Sót?
                </Title>

                <div className="not-found-card-content">
                  <div className="not-found-card-item">
                    <div className="not-found-card-check">✓</div>
                    <div>
                      <div className="not-found-card-label">Mã Lỗi</div>
                      <div className="not-found-card-value">ERR_NOT_FOUND_404</div>
                    </div>
                  </div>

                  <div className="not-found-card-item">
                    <div className="not-found-card-check">✓</div>
                    <div>
                      <div className="not-found-card-label">Thời gian</div>
                      <div className="not-found-card-value">{new Date().toLocaleString('vi-VN')}</div>
                    </div>
                  </div>

                  <div className="not-found-card-item">
                    <div className="not-found-card-check">✓</div>
                    <div>
                      <div className="not-found-card-label">URL Yêu Cầu</div>
                      <div className="not-found-card-value" style={{ wordBreak: 'break-all' }}>
                        {window.location.pathname}
                      </div>
                    </div>
                  </div>
                </div>

                <Paragraph className="not-found-card-quote">
                  "Mỗi lỗi là một cơ hội để cải thiện trải nghiệm người dùng."
                </Paragraph>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <div className="not-found-footer">
        <div className="not-found-container">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 Cổng Thông Tin Đất Việt Core • Hệ Thống Quản Lý Đất Công Ích Quốc Gia
          </Text>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
