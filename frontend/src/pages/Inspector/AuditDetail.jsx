import React from 'react';
import { Card, Row, Col, Typography, Button, Tag, Divider, Timeline } from 'antd';
import {
  EnvironmentOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const AuditDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const auditData = {
    code: 'CI-2024-0892',
    status: 'valid',
    legalArea: 2450.5,
    actualArea: 2100.0,
    discrepancy: -350.5,
    taxRate: 12500,
    purpose: 'Đất nông nghiệp (CLN)',
    location: 'Phường An Khánh, Thủ Đức',
    renter: 'Ông Nguyễn Văn A',
    legalDoc: 'H-012/2021',
    contractDoc: '88/2024/STNMT',
    estimatedRevenue: 150000000,
    actualRevenue: 24500000
  };

  const auditHistory = [
    {
      date: 'Q1/2024',
      status: 'completed',
      note: 'Đối soát ký hạn Q1/2024 - Khớp 100%'
    },
    {
      date: 'Q2/2024',
      status: 'warning',
      note: 'Đối soát thay đổi mục đích sử dụng - Lệch 12.5% (Diện tích)'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase' }}>
          THANH TRA → CÔNG ĐỐI SOÁT DỮ LIỆU
        </div>
        <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
          Tra cứu & Đối soát Dữ liệu
        </Title>
        <Text type="secondary">
          So khớp hồ sơ pháp lý, hợp đồng thuê và tính trạng tài chính thực tế.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} lg={10}>
          {/* Quick Search Card */}
          <Card 
            style={{ 
              background: '#002e42',
              color: 'white',
              marginBottom: '16px',
              borderRadius: '12px'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                MÃ THỬA ĐẤT
              </Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>
                {auditData.code}
              </div>
            </div>
            <Button 
              type="primary"
              icon={<ArrowRightOutlined />}
              block
              size="large"
              style={{ background: '#1e7e34', borderColor: '#1e7e34' }}
            >
              TÌM KIẾM DỮ LIỆU
            </Button>
          </Card>

          {/* Location Info */}
          <Card title="📍 Thông tin địa chính" style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Mục đích sử dụng</Text>
              <div style={{ fontWeight: 500 }}>{auditData.purpose}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Diện tích Pháp lý</Text>
              <div style={{ fontWeight: 500 }}>{auditData.legalArea} m²</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Vị trí</Text>
              <div style={{ fontWeight: 500 }}>{auditData.location}</div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Người thuê hiện tại</Text>
              <div style={{ fontWeight: 500 }}>{auditData.renter}</div>
            </div>
          </Card>

          {/* Warning Card */}
          <Card style={{ background: '#fff1f0', border: '1px solid #ffccc7' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <WarningOutlined style={{ fontSize: '20px', color: '#d9363e', marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 'bold', color: '#d9363e', marginBottom: '8px' }}>
                  Hành động cần thiết
                </div>
                <Text style={{ fontSize: '13px' }}>
                  Phát hiện sai lệch 12.5% giữa diện tích thực tế và hợp đồng thuê.
                </Text>
                <Button 
                  danger 
                  type="primary" 
                  block 
                  style={{ marginTop: '12px' }}
                  onClick={() => navigate('/inspector/violations')}
                >
                  KIỂM TRA NGAY TẠI HIỆN TRƯỜNG
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={14}>
          {/* Audit Matrix */}
          <Card title="Ma trận Đối soát" style={{ marginBottom: '16px' }}>
            <div style={{ 
              background: '#f0f2f5',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                      HỒ SƠ PHÁP LÝ
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e7e34' }}>
                      {auditData.legalArea} m²
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                      QSĐD số: {auditData.legalDoc}
                    </div>
                    <Tag color="success" style={{ marginTop: '8px' }}>
                      <CheckCircleOutlined /> HỢP LỆ
                    </Tag>
                  </div>
                </Col>

                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                      HỢP ĐỒNG THUÊ
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#002e42' }}>
                      {auditData.actualArea} m²
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                      HĐ số: {auditData.contractDoc}
                    </div>
                    <Tag color="success" style={{ marginTop: '8px' }}>
                      <CheckCircleOutlined /> HỢP LỆ
                    </Tag>
                  </div>
                </Col>

                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                      THỰC TẾ TÀI CHÍNH
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d9363e' }}>
                      {auditData.taxRate.toLocaleString()}/th
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                      Thu theo HĐ cũ
                    </div>
                    <Tag color="error" style={{ marginTop: '8px' }}>
                      <WarningOutlined /> THẤT THU DỰ KIẾN
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Map Preview */}
            <div style={{ 
              height: '250px',
              background: 'linear-gradient(135deg, #1e7e34 0%, #004d6b 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255,255,255,0.9)',
                padding: '8px 12px',
                borderRadius: '8px',
                color: '#002e42',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                <EnvironmentOutlined /> Chế độ xem Đối chiếu Vệ tính (CI-2024-0892)
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  [Bản đồ vệ tinh sẽ hiển thị tại đây]
                </div>
              </div>
            </div>
          </Card>

          {/* Financial Analysis */}
          <Card title="📊 Phân tích Thất thu & Sai lệch Tài chính">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ 
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                    DỰ ĐỊA THẬT THU
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e7e34' }}>
                    {auditData.estimatedRevenue.toLocaleString()} 
                    <span style={{ fontSize: '12px', marginLeft: '4px' }}>VNĐ</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
                    Dự quyết toán (2024)
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div style={{ 
                  background: '#fff1f0',
                  border: '1px solid #ffccc7',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                    DỰ ĐỊA THẬT THU
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d9363e' }}>
                    {auditData.actualRevenue.toLocaleString()} 
                    <span style={{ fontSize: '12px', marginLeft: '4px' }}>VNĐ</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
                    Dự địa thật thu
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />

            <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '8px' }}>
                <CheckCircleOutlined style={{ color: '#1e7e34', marginRight: '8px' }} />
                Đối soát ký hạn Q1/2024 - Khớp 100%
              </div>
              <div>
                <WarningOutlined style={{ color: '#d9363e', marginRight: '8px' }} />
                Đối soát thay đổi mục đích sử dụng - Lệch 12.5% (Diện tích)
              </div>
            </div>
          </Card>

          {/* History Timeline */}
          <Card title="Lịch sử Đối soát Gần nhất" style={{ marginTop: '16px' }}>
            <Timeline
              items={auditHistory.map(item => ({
                color: item.status === 'completed' ? 'green' : 'red',
                children: (
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {item.date}
                    </div>
                    <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                      {item.note}
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AuditDetail;
