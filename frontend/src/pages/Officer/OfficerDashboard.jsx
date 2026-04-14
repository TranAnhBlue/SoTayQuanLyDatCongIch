import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, List, Tag, Statistic, Progress } from 'antd';
import {
  EnvironmentOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  SyncOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const OfficerDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalParcels: 12482,
    parcelsInUse: 8120,
    emptyParcels: 4015,
    disputedParcels: 347
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch recent activities
      const activitiesRes = await axios.get('http://localhost:5000/api/officer/recent-activities', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch alerts
      const alertsRes = await axios.get('http://localhost:5000/api/officer/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setRecentActivities(activitiesRes.data.activities || []);
      setAlerts(alertsRes.data.alerts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for demo
      setRecentActivities([
        {
          id: 1,
          title: 'Cập nhật biến động thửa #GD-2024-001',
          description: 'Thay đổi mục đích sử dụng từ Đất nông nghiệp sang Đất nông nghiệp',
          officer: 'LÊ MINH QUÂN',
          status: 'ĐÃ PHÊ DUYỆT',
          statusColor: 'success',
          time: '18 PHÚT TRƯỚC'
        },
        {
          id: 2,
          title: 'Tiếp nhận hồ sơ xin cấp GCN mới',
          description: 'Hồ sơ số HS-55291 - Chủ sở hữu: Công ty CP Đầu tư Nam Việt. Diện tích: 1.900m2.',
          officer: 'PHÒNG TIẾP DÂN',
          status: 'CHỜ XỬ LÝ',
          statusColor: 'warning',
          time: '2 GIỜ TRƯỚC'
        },
        {
          id: 3,
          title: 'Hoàn tất đo đạc hiện trạng',
          description: 'Khu vực: Cụm công nghiệp Phú Cường. Bàn về kỹ thuật đo được sẽ hoàn tất lên hệ thống bản đồ.',
          officer: '',
          status: '',
          statusColor: 'default',
          time: 'SÁNG NAY'
        }
      ]);

      setAlerts([
        {
          type: 'contract',
          title: 'HỢP ĐỒNG SẮP HẾT HẠN (18)',
          description: 'Có 8 hợp đồng thuê đất tại khu vực phía Tây sẽ hết hiệu lực trong 30 ngày tới.',
          action: 'GỬI THÔNG BÁO NHẮC NHỞ',
          priority: 'high'
        },
        {
          type: 'legal',
          title: 'THIẾU HỒ SƠ PHÁP LÝ (04)',
          description: 'Các thửa đất dự án Cát Tường chưa đính kèm Giấy phép quy hoạch theo quy định 1/500.',
          action: 'BỔ SUNG HỒ SƠ NGAY',
          priority: 'medium'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'ĐÃ PHÊ DUYỆT': 'success',
      'CHỜ XỬ LÝ': 'warning',
      'ĐANG XỬ LÝ': 'processing'
    };
    return colors[status] || 'default';
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">QUẢN TRỊ HỆ THỐNG › TỔNG QUAN NGHIỆP VỤ</Text>
      </div>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Tổng quan nghiệp vụ</Title>
          <Text type="secondary">
            Chào mừng trở lại, Lê Văn Quân. Hệ thống ghi nhận 12 biến động đất đai cần xử lý trong hôm nay.
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<DownloadOutlined />}>Xuất báo cáo tuần</Button>
          <Button type="primary" icon={<SyncOutlined />} style={{ background: '#002e42' }}>
            Đồng bộ dữ liệu VILIS
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#002e42', color: '#fff', borderRadius: '8px' }}>
            <div style={{ marginBottom: '8px', opacity: 0.8 }}>TỔNG SỐ THỬA ĐẤT</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
              {stats.totalParcels.toLocaleString()} 
              <span style={{ fontSize: '14px', marginLeft: '8px', color: '#52c41a' }}>
                +2.4%
              </span>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>CẬP NHẬT LÚC 08:30 SÁNG NAY</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#d4f4dd', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <CheckCircleOutlined style={{ fontSize: '20px', color: '#1e7e34', marginRight: '8px' }} />
              <span style={{ color: '#1e7e34', fontWeight: 500 }}>ÔN ĐỊNH</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34', marginBottom: '4px' }}>
              {stats.parcelsInUse.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>ĐANG CHO THUÊ</div>
            <div style={{ fontSize: '12px', color: '#666' }}>CHIẾM 65% TỔNG DIỆN TÍCH</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#fff3e0', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <EnvironmentOutlined style={{ fontSize: '20px', color: '#f39c12', marginRight: '8px' }} />
              <span style={{ color: '#f39c12', fontWeight: 500 }}>KHÁI THÁC</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12', marginBottom: '4px' }}>
              {stats.emptyParcels.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>ĐẤT TRỐNG</div>
            <div style={{ fontSize: '12px', color: '#666' }}>SẴN SÀNG LẬP PHƯƠNG ÁN</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#ffe6e6', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <WarningOutlined style={{ fontSize: '20px', color: '#d9363e', marginRight: '8px' }} />
              <span style={{ color: '#d9363e', fontWeight: 500 }}>CẢNH BÁO</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d9363e', marginBottom: '4px' }}>
              {stats.disputedParcels}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>ĐANG TRANH CHẤP</div>
            <div style={{ fontSize: '12px', color: '#666' }}>YÊU CẦU XÁC MINH GẤP</div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Recent Activities */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                Hoạt động gần đây
              </div>
            }
            extra={<Button type="link">XEM TẤT CẢ</Button>}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: item.statusColor === 'success' ? '#d4f4dd' : '#fff3e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.statusColor === 'success' ? 
                            <CheckCircleOutlined style={{ color: '#1e7e34', fontSize: '20px' }} /> :
                            <ClockCircleOutlined style={{ color: '#f39c12', fontSize: '20px' }} />
                          }
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.title}</div>
                          <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                    </div>
                    {item.officer && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Tag>{item.officer}</Tag>
                        {item.status && (
                          <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                        )}
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Quick Actions */}
          <Card 
            title="Thao tác nhanh"
            style={{ marginTop: '16px' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button 
                  block 
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/officer/land-parcels/new')}
                  style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ marginTop: '8px' }}>Thêm thửa đất mới</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Tạo mới hồ sơ địa chính kỹ thuật</div>
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  block 
                  size="large"
                  icon={<FileTextOutlined />}
                  onClick={() => navigate('/officer/documents')}
                  style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ marginTop: '8px' }}>Lập biên bản kiểm tra</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Khảo sát hiện trạng sử dụng đất</div>
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Alerts */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <WarningOutlined style={{ marginRight: '8px', color: '#d9363e' }} />
                Cảnh báo hệ thống
              </div>
            }
          >
            {alerts.map((alert, index) => (
              <Card 
                key={index}
                size="small" 
                style={{ 
                  marginBottom: '16px',
                  border: `1px solid ${alert.priority === 'high' ? '#d9363e' : '#f39c12'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <WarningOutlined style={{ 
                    color: alert.priority === 'high' ? '#d9363e' : '#f39c12',
                    fontSize: '20px',
                    marginRight: '12px'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 'bold',
                      color: alert.priority === 'high' ? '#d9363e' : '#f39c12',
                      marginBottom: '8px'
                    }}>
                      {alert.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                      {alert.description}
                    </div>
                    <Button 
                      type="primary" 
                      size="small"
                      danger={alert.priority === 'high'}
                      style={alert.priority !== 'high' ? { background: '#f39c12', borderColor: '#f39c12' } : {}}
                    >
                      {alert.action} →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </Card>

          {/* Map Preview */}
          <Card 
            title="Bản đồ trực tuyến"
            style={{ marginTop: '16px' }}
            extra={<Button type="link" onClick={() => navigate('/officer/map')}>MỞ BẢN ĐỒ TOÀN MÀN HÌNH</Button>}
          >
            <div style={{ 
              height: '200px',
              background: '#f0f2f5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ textAlign: 'center' }}>
                <EnvironmentOutlined style={{ fontSize: '48px', color: '#1e7e34' }} />
                <div style={{ marginTop: '8px', color: '#666' }}>XEM CHI TIẾT 12.482 THỬA ĐẤT</div>
              </div>
            </div>
          </Card>

          {/* System Status */}
          <Card title="Trạng thái hệ thống" style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>Kết nối CSDL Quốc gia</Text>
                <Tag color="success">CONNECTED</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>Máy chủ bản đồ</Text>
                <Text strong>78%</Text>
              </div>
              <Progress percent={78} status="active" strokeColor="#1e7e34" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>Đồng bộ vệ tinh</Text>
                <Tag color="processing">ACTIVE</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OfficerDashboard;