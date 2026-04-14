import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, List, Tag, Select, DatePicker } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const FinanceDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('month');
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRevenue: 12850,
    totalDebt: 3420,
    completionRate: 85.4
  });

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Tháng 5', value: 850, type: 'Thực thu' },
    { month: 'Tháng 5', value: 650, type: 'Kế hoạch' },
    { month: 'Tháng 6', value: 920, type: 'Thực thu' },
    { month: 'Tháng 6', value: 700, type: 'Kế hoạch' },
    { month: 'Tháng 7', value: 1100, type: 'Thực thu' },
    { month: 'Tháng 7', value: 800, type: 'Kế hoạch' },
    { month: 'Tháng 8', value: 1250, type: 'Thực thu' },
    { month: 'Tháng 8', value: 900, type: 'Kế hoạch' },
    { month: 'Tháng 9', value: 1180, type: 'Thực thu' },
    { month: 'Tháng 9', value: 850, type: 'Kế hoạch' },
    { month: 'Tháng 10', value: 1350, type: 'Thực thu' },
    { month: 'Tháng 10', value: 950, type: 'Kế hoạch' }
  ]);

  const [urgentItems, setUrgentItems] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn Thành',
      area: 'Khu A - Lô 24',
      amount: 45.2,
      dueDate: 'Quá hạn 45 ngày',
      status: 'urgent'
    },
    {
      id: 2,
      name: 'Lê Minh Hùng',
      area: 'Khu B - Cụm hàng 09',
      amount: 38.7,
      dueDate: 'Quá hạn 32 ngày',
      status: 'urgent'
    },
    {
      id: 3,
      name: 'Phạm Minh Tuấn',
      area: 'Khu A - Lô 05',
      amount: 32.1,
      dueDate: 'Quá hạn 28 ngày',
      status: 'warning'
    },
    {
      id: 4,
      name: 'Hoàng Diệu Hoa',
      area: 'Khu C - KT-01.11',
      amount: 27.5,
      dueDate: 'Quá hạn 21 ngày',
      status: 'warning'
    },
    {
      id: 5,
      name: 'Trần Anh Khoa',
      area: 'Khu B - Kho 01',
      amount: 22.8,
      dueDate: 'Quá hạn 15 ngày',
      status: 'warning'
    }
  ]);

  const chartConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#1e7e34', '#8c8c8c'],
    legend: {
      position: 'top',
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return { name: datum.type, value: `${datum.value} triệu` };
      },
    },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>2</div>
          <Title level={2} style={{ margin: 0 }}>Tổng quan Tài chính</Title>
          <Text type="secondary">
            Báo cáo tình hình thu chi và công nợ bất động sản công ích tháng 10/2023
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button>Theo tháng</Button>
          <Button>Theo quý</Button>
          <Button>Theo năm</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ 
            background: 'linear-gradient(135deg, #1e7e34 0%, #2d9f4a 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <DollarOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>TỔNG NGUỒN THU THỰC TẾ</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                  {stats.totalRevenue.toLocaleString()} 
                  <span style={{ fontSize: '16px', marginLeft: '4px' }}>trđ</span>
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
              <ArrowUpOutlined /> +12.5%
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ 
            background: 'linear-gradient(135deg, #d9363e 0%, #ff4d4f 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <WarningOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>TỔNG CÔNG NỢ HIỆN TẠI</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                  {stats.totalDebt.toLocaleString()} 
                  <span style={{ fontSize: '16px', marginLeft: '4px' }}>trđ</span>
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
              <ArrowUpOutlined /> +4.2%
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ 
            background: '#002e42',
            border: 'none',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <CheckCircleOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>TỶ LỆ HOÀN THÀNH CHỈ TIÊU</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                  {stats.completionRate}
                  <span style={{ fontSize: '16px', marginLeft: '4px' }}>%</span>
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
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Chart */}
        <Col xs={24} lg={14}>
          <Card 
            title="So sánh thu nộp tháng"
            extra={
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1e7e34' }} />
                  <Text style={{ fontSize: '12px' }}>Thực thu</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8c8c8c' }} />
                  <Text style={{ fontSize: '12px' }}>Kế hoạch</Text>
                </div>
              </div>
            }
          >
            <Line {...chartConfig} height={300} />
          </Card>
        </Col>

        {/* Urgent List */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <WarningOutlined style={{ color: '#d9363e' }} />
                <span>Cần xử lý công nợ</span>
                <Tag color="red">KHẨN CẤP</Tag>
              </div>
            }
            extra={
              <Button type="link" onClick={() => navigate('/officer/debt-management')}>
                Xem tất cả danh sách công nợ
              </Button>
            }
          >
            <List
              dataSource={urgentItems}
              renderItem={(item) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.area}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#d9363e' }}>
                          {item.amount} trđ
                        </div>
                        <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{item.dueDate}</div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Bottom Alert */}
      <Card 
        style={{ 
          marginTop: '24px',
          background: 'linear-gradient(135deg, #002e42 0%, #004d6b 100%)',
          border: 'none',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileTextOutlined style={{ fontSize: '24px', color: '#fff' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                Nhắc nhở quyết toán
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                Kỳ hạn chốt số tháng 10 còn 03 ngày. Vui lòng kiểm tra các khoản thu nộp tồn đọng.
              </div>
            </div>
          </div>
          <Button 
            type="primary" 
            size="large"
            style={{ 
              background: '#1e7e34',
              borderColor: '#1e7e34',
              height: '48px',
              padding: '0 32px'
            }}
          >
            Xử lý ngay
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FinanceDashboard;