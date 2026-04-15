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
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDebt: 0,
    completionRate: 0
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [urgentItems, setUrgentItems] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('🔍 Debug Info:');
        console.log('- Token exists:', !!token);
        console.log('- User role:', user.role);
        console.log('- User info:', user);
        
        if (!token) {
          console.error('❌ No token found, redirecting to login');
          navigate('/login');
          return;
        }

        if (user.role !== 'finance' && user.role !== 'admin') {
          console.error('❌ User role not authorized for finance dashboard:', user.role);
          alert('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản Finance.');
          navigate('/login');
          return;
        }

        console.log('🚀 Fetching dashboard data...');
        console.log('- API URL: http://localhost:5000/api/finance/dashboard');
        console.log('- Token (first 20 chars):', token.substring(0, 20) + '...');
        
        const response = await axios.get('http://localhost:5000/api/finance/dashboard', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Dashboard API response:', response.data);

        if (response.data.success) {
          const { stats, monthlyData, urgentItems } = response.data.data;
          console.log('📊 Setting dashboard data:');
          console.log('- Stats:', stats);
          console.log('- Monthly data items:', monthlyData.length);
          console.log('- Urgent items:', urgentItems.length);
          
          setStats(stats);
          setMonthlyData(monthlyData);
          setUrgentItems(urgentItems);
        } else {
          console.error('❌ API returned success: false');
          console.error('Response:', response.data);
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        console.error('- Error message:', error.message);
        console.error('- Error response:', error.response?.data);
        console.error('- Error status:', error.response?.status);
        
        // Nếu lỗi 401 (Unauthorized), token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {
          console.log('🔄 Token expired or invalid, redirecting to login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
          return;
        }
        
        // Nếu lỗi 403 (Forbidden), không có quyền
        if (error.response?.status === 403) {
          console.log('🚫 Access forbidden');
          alert('Bạn không có quyền truy cập trang này.');
          navigate('/login');
          return;
        }
        
        // Nếu lỗi 500 (Server Error)
        if (error.response?.status === 500) {
          console.log('🔧 Server error');
          alert('Lỗi máy chủ. Vui lòng thử lại sau.');
        }
        
        // Nếu không kết nối được server
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          console.log('🌐 Network error - server might be down');
          alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

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

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '16px', color: '#1890ff' }}>Đang tải dữ liệu...</div>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && (
        <>
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
                      {stats.totalRevenue ? parseFloat(stats.totalRevenue).toLocaleString() : '0'} 
                      <span style={{ fontSize: '16px', marginLeft: '4px' }}>tỷ VNĐ</span>
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
                      {stats.totalDebt ? parseFloat(stats.totalDebt).toLocaleString() : '0'} 
                      <span style={{ fontSize: '16px', marginLeft: '4px' }}>tỷ VNĐ</span>
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
                      {stats.completionRate || 0}
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
                    width: `${stats.completionRate || 0}%`,
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
                {monthlyData.length > 0 ? (
                  <Line {...chartConfig} height={300} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#8c8c8c' }}>
                    Không có dữ liệu biểu đồ
                  </div>
                )}
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
                  <Button type="link" onClick={() => navigate('/finance/debt')}>
                    Xem tất cả danh sách công nợ
                  </Button>
                }
              >
                {urgentItems.length > 0 ? (
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
                                {item.amount} triệu VNĐ
                              </div>
                              <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{item.dueDate}</div>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#8c8c8c' }}>
                    Không có công nợ khẩn cấp
                  </div>
                )}
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
        </>
      )}
    </div>
  );
};

export default FinanceDashboard;