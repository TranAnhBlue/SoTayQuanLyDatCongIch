import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, List, Tag, Select } from 'antd';
import {
  ArrowUpOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const InspectorDashboard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalInspections: 1284,
    violations: 156,
    completionRate: 94.2,
    urgentCases: 24,
    activeZones: 8
  });

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Tháng 1', value: 45 },
    { month: 'Tháng 2', value: 62 },
    { month: 'Tháng 3', value: 58 },
    { month: 'Tháng 4', value: 89 },
    { month: 'Tháng 5', value: 72 },
    { month: 'Tháng 6', value: 68 }
  ]);

  const [urgentAlerts, setUrgentAlerts] = useState([
    {
      id: 1,
      code: '#TT-2024-089',
      title: 'Lấn chiếm hành lang đê điều - Lô A12',
      location: 'Phường Bến Nghé, Quận 1',
      daysOverdue: 3,
      status: 'urgent'
    },
    {
      id: 2,
      code: '#TT-2024-092',
      title: 'Xây dựng trái phép trên đất công - KDC 7',
      location: 'Phường Tân Phong, Quận 7',
      daysOverdue: 1,
      status: 'urgent'
    }
  ]);

  const [recentInspections, setRecentInspections] = useState([
    {
      id: 1,
      code: '#TT-2024-089',
      location: 'Khu Công nghiệp Hiệp Phước',
      date: '22/05/2024',
      status: 'completed'
    },
    {
      id: 2,
      code: '#TT-2024-092',
      location: 'KDC Phường Phú Thuận, Q7',
      date: '21/05/2024',
      status: 'pending'
    },
    {
      id: 3,
      code: '#TT-2024-095',
      location: 'Dọc kênh Tẻ, Quận 4',
      date: '20/05/2024',
      status: 'violation'
    }
  ]);

  const chartConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'value',
    color: '#1e7e34',
    label: {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      month: {
        alias: 'Tháng',
      },
      value: {
        alias: 'Số vi phạm',
      },
    },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
          DASHBOARD CONTROL
        </div>
        <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
          Tổng quan Thanh tra
        </Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">
            Dữ liệu hệ thống Đất Việt Core
          </Text>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Cập nhật lần cuối: Hôm nay, 14:30
            </Text>
            <Tag color="green">HỆ THỐNG ỔN ĐỊNH</Tag>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            background: 'linear-gradient(135deg, #1e7e34 0%, #2d9f4a 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <FileSearchOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>TỔNG SỐ ĐỢT KIỂM TRA</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                  {stats.totalInspections.toLocaleString()}
                </div>
              </div>
            </div>
            <div style={{ 
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              <ArrowUpOutlined /> +12% tháng này
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            background: 'linear-gradient(135deg, #d9363e 0%, #ff4d4f 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <WarningOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>SỐ VI PHẠM PHÁT HIỆN</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                  {stats.violations}
                </div>
              </div>
            </div>
            <div style={{ 
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              <ArrowUpOutlined /> Cần xử lý: {stats.urgentCases}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            background: '#002e42',
            border: 'none',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <CheckCircleOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>TỶ LỆ XỬ LÝ VI PHẠM</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                  {stats.completionRate}%
                </div>
              </div>
            </div>
            <div style={{ 
              width: '100%',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${stats.completionRate}%`,
                height: '100%',
                background: '#1e7e34',
                transition: 'width 0.3s'
              }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            background: 'linear-gradient(135deg, #002e42 0%, #004d6b 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <EnvironmentOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>ĐIỂM NÓNG ĐỊA CHÍNH</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                  {String(stats.activeZones).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              Khu vực Quận 1, Quận 7
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Chart */}
        <Col xs={24} lg={14}>
          <Card 
            title="Xu hướng vi phạm theo tháng"
            extra={
              <Select defaultValue="2024" style={{ width: 100 }}>
                <Option value="2024">Năm 2024</Option>
                <Option value="2023">Năm 2023</Option>
              </Select>
            }
          >
            <Column {...chartConfig} height={300} />
          </Card>

          {/* Recent Inspections */}
          <Card 
            title="Các đợt kiểm tra gần đây"
            extra={<Button type="link" onClick={() => navigate('/inspector/inspections')}>Tất cả hồ sơ →</Button>}
            style={{ marginTop: '16px' }}
          >
            <List
              dataSource={recentInspections}
              renderItem={(item) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                        {item.code}
                      </div>
                      <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        <EnvironmentOutlined style={{ marginRight: '4px' }} />
                        {item.location}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                        {item.date}
                      </div>
                      <Tag color={
                        item.status === 'completed' ? 'success' : 
                        item.status === 'pending' ? 'warning' : 'error'
                      }>
                        {item.status === 'completed' ? 'HOÀN TẤT' : 
                         item.status === 'pending' ? 'ĐANG XỬ LÝ' : 'VI PHẠM'}
                      </Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Urgent Alerts */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <WarningOutlined style={{ color: '#d9363e' }} />
                <span>Cảnh báo quá hạn</span>
                <Tag color="red">QUÁ HẠN 3 NGÀY</Tag>
              </div>
            }
            style={{ marginBottom: '16px' }}
          >
            <List
              dataSource={urgentAlerts}
              renderItem={(item) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Text strong style={{ fontSize: '13px' }}>{item.code}</Text>
                      <Tag color="red">QUÁ HẠN {item.daysOverdue} NGÀY</Tag>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      Địa điểm: {item.location}
                    </div>
                    <Button 
                      type="link" 
                      danger 
                      size="small" 
                      style={{ padding: 0, marginTop: '8px' }}
                      onClick={() => navigate('/inspector/violations')}
                    >
                      KIỂM TRA NGAY TẠI HIỆN TRƯỜNG →
                    </Button>
                  </div>
                </List.Item>
              )}
            />
            <Button 
              block 
              style={{ marginTop: '16px' }}
              onClick={() => navigate('/inspector/inspections')}
            >
              Xem tất cả cảnh báo (05)
            </Button>
          </Card>

          {/* Map Preview */}
          <Card 
            title="Bản đồ điểm nóng"
            extra={<Button type="link">Xem toàn màn hình</Button>}
          >
            <div style={{ 
              height: '300px', 
              background: 'linear-gradient(135deg, #1e7e34 0%, #004d6b 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <EnvironmentOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>LAND MANAGEMENT</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
                  SAFE WORLD WORKS
                </div>
              </div>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(217, 54, 62, 0.9)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '11px'
              }}>
                <div style={{ marginBottom: '4px' }}>● Nguy cơ cao (12)</div>
                <div>● Đang theo dõi (08)</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InspectorDashboard;
