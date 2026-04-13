import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Tag, Button, Progress, List, Space, Divider } from 'antd';
import { 
  ArrowUpOutlined, 
  WarningFilled, 
  FileTextOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  FileDoneOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const data = dashboardData?.revenueTrend || [
    { name: 'T1', value: 200 },
    { name: 'T2', value: 250 },
    { name: 'T3', value: 320 }
  ];

  const kpi = dashboardData?.kpi || {};
  const totalArea = kpi.totalAreaHa || '2.450';
  const areaUnit = kpi.areaUnit || 'm²';
  const usageRate = kpi.usageRate || 84.2;
  const totalRevenue = kpi.totalRevenueMillion || 75.5;
  const revenueUnit = kpi.revenueUnit || 'Triệu';

  const landTypes = dashboardData?.landStructure?.length > 0 ? dashboardData.landStructure : [
    { type: 'Đất nông nghiệp', percent: 55, color: '#1e7e34' },
    { type: 'Đất ở đô thị', percent: 25, color: '#002e42' },
    { type: 'Đất công ích', percent: 20, color: '#f39c12' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Text style={{ fontSize: '10px', fontWeight: 'bold', color: '#8c8c8c', letterSpacing: '1px', textTransform: 'uppercase' }}>
          ĐẤT VIỆT CORE EXECUTIVE DASHBOARD
        </Text>
        <Title level={2} style={{ margin: '8px 0', color: '#002e42', fontWeight: 800 }}>Tổng quan Điều hành</Title>
        <Space style={{ marginTop: '12px' }}>
          <Tag color="success" style={{ borderRadius: '4px', padding: '4px 12px', fontSize: '13px', border: 'none', backgroundColor: '#8ce29f', color: '#1e7e34', fontWeight: 600 }}>
            <CheckCircleOutlined /> Dữ liệu cập nhật: Hôm nay, {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </Tag>
          <Text style={{ color: '#595959', fontSize: '13px' }}>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column (Main Content) */}
        <Col span={17}>
          {/* Top KPI Cards */}
          <Row gutter={24} style={{ marginBottom: '24px' }}>
            <Col span={8}>
              <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderTop: '4px solid #002e42' }}>
                <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#595959', textTransform: 'uppercase' }}>Tổng diện tích đất công ích</Text>
                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <Text style={{ fontSize: '32px', fontWeight: 800, color: '#002e42' }}>{totalArea}</Text>
                  <Text style={{ fontSize: '16px', color: '#595959', marginLeft: '8px' }}>{areaUnit}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpOutlined style={{ color: '#1e7e34', marginRight: '4px' }} />
                  <Text style={{ color: '#1e7e34', fontWeight: 'bold', fontSize: '13px' }}>+2.4% so với năm ngoái</Text>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderTop: '4px solid #1e7e34' }}>
                <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#595959', textTransform: 'uppercase' }}>Tỷ lệ sử dụng đất</Text>
                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <Text style={{ fontSize: '32px', fontWeight: 800, color: '#1e7e34' }}>{usageRate}</Text>
                  <Text style={{ fontSize: '16px', color: '#595959', marginLeft: '8px' }}>%</Text>
                </div>
                <Progress percent={usageRate} showInfo={false} strokeColor="#1e7e34" trailColor="#e6f4ea" size={['100%', 6]} />
              </Card>
            </Col>
            <Col span={8}>
              <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderTop: '4px solid #f39c12' }}>
                <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#595959', textTransform: 'uppercase' }}>Tổng doanh thu quỹ đất</Text>
                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <Text style={{ fontSize: '32px', fontWeight: 800, color: '#002e42' }}>{totalRevenue}</Text>
                  <Text style={{ fontSize: '16px', color: '#595959', marginLeft: '8px' }}>{revenueUnit} VNĐ</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color="success" style={{ margin: 0, padding: '2px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#e6f4ea', color: '#1e7e34', fontWeight: 'bold' }}>
                    Đạt 92% kế hoạch năm
                  </Tag>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Chart Section */}
          <Card variant="borderless" style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>Xu hướng Doanh thu hàng tháng</Title>
                <Text type="secondary">Thống kê dữ liệu tài chính chu kỳ 12 tháng</Text>
              </div>
              <Space>
                <Button type="default" style={{ borderRadius: '6px' }}>Tháng</Button>
                <Button type="primary" style={{ backgroundColor: '#002e42', borderRadius: '6px' }}>Quý</Button>
              </Space>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#1e7e34' : '#ccd4dc'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-200px', marginRight: '50px' }}>
                <Tag color="#002e42" style={{ border: 'none', padding: '2px 12px', borderRadius: '4px' }}>Hiện tại</Tag>
              </div>
            </div>
          </Card>

          {/* Bottom Features */}
          <Row gutter={24}>
            <Col span={10}>
              <Card variant="borderless" style={{ borderRadius: '12px', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#595959', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>PHÂN LOẠI QUỸ ĐẤT</Text>
                <List
                  dataSource={landTypes}
                  renderItem={(item) => (
                    <List.Item style={{ borderBottom: 'none', padding: '12px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Space>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }} />
                          <Text style={{ fontWeight: 500 }}>{item.type}</Text>
                        </Space>
                        <Text style={{ fontWeight: 'bold' }}>{item.percent}%</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={14}>
              <Card variant="borderless" style={{ 
                  borderRadius: '12px', 
                  height: '100%', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                styles={{ body: { padding: 0, height: '100%' } }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,46,66,0.9), rgba(0,46,66,0.2))' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '24px', width: '100%' }}>
                  <Title level={4} style={{ color: 'white', margin: 0, marginBottom: '8px' }}>Bản đồ quy hoạch</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '16px' }}>Truy xuất dữ liệu vị trí địa chính số</Text>
                  <Button type="primary" icon={<EnvironmentOutlined />} style={{ backgroundColor: '#1e7e34', border: 'none', borderRadius: '6px' }}>
                    Mở bản đồ
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Column (Alerts & Actions) */}
        <Col span={7}>
          {/* Alerts */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            borderLeft: '4px solid #d9363e', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginBottom: '24px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <WarningFilled style={{ color: '#d9363e', fontSize: '24px', marginRight: '16px' }} />
                <Title level={5} style={{ margin: 0, color: '#002e42', fontWeight: 800 }}>CẢNH BÁO QUAN TRỌNG</Title>
              </div>
            </div>
            
            <div style={{ padding: '16px 24px' }}>
              {(dashboardData?.alerts?.expiringContracts || []).length > 0 ? (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Tag color="warning" style={{ borderRadius: '4px', border: 'none', fontWeight: 'bold' }}>HỢP ĐỒNG</Tag>
                      <Text type="danger" style={{ fontWeight: 'bold', fontSize: '12px' }}>{dashboardData.alerts.expiringContracts.length} hồ sơ</Text>
                    </div>
                    <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#262626', display: 'block' }}>Hợp đồng sắp hết hạn</Text>
                    <Text style={{ fontSize: '13px', color: '#595959' }}>
                      Cần rà soát hồ sơ {dashboardData.alerts.expiringContracts[0].contractCode} ({dashboardData.alerts.expiringContracts[0].renterName}).
                    </Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                </>
              ) : null}

              {(dashboardData?.alerts?.pendingPayments || []).length > 0 ? (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Tag color="error" style={{ borderRadius: '4px', border: 'none', fontWeight: 'bold' }}>TÀI CHÍNH</Tag>
                      <Text type="danger" style={{ fontWeight: 'bold', fontSize: '12px' }}>{(dashboardData.alerts.pendingPayments[0].amount / 1000000).toFixed(1)} Triệu</Text>
                    </div>
                    <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#262626', display: 'block' }}>Giao dịch chờ xử lý</Text>
                    <Text style={{ fontSize: '13px', color: '#595959' }}>Mã GD: {dashboardData.alerts.pendingPayments[0].transactionCode} chưa xác thực.</Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                </>
              ) : null}

              {(dashboardData?.alerts?.urgentViolations || []).length > 0 ? (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Tag color="processing" style={{ borderRadius: '4px', border: 'none', fontWeight: 'bold', backgroundColor: '#002e42', color: 'white' }}>THANH TRA</Tag>
                    <Text style={{ fontWeight: 'bold', fontSize: '12px', color: '#262626' }}>{dashboardData.alerts.urgentViolations.length} vụ</Text>
                  </div>
                  <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#262626', display: 'block' }}>Vi phạm khẩn cấp</Text>
                  <Text style={{ fontSize: '13px', color: '#595959' }}>{dashboardData.alerts.urgentViolations[0].type} tại {dashboardData.alerts.urgentViolations[0].location}.</Text>
                </div>
              ) : (
                <Text type="secondary">Không có cảnh báo khẩn cấp.</Text>
              )}

              <Button type="primary" block style={{ backgroundColor: '#002e42', borderRadius: '6px', height: '40px', marginTop: '16px' }}>
                Xem tất cả cảnh báo
              </Button>
            </div>
          </div>

          {/* Workflow Progress */}
          <Card variant="borderless" style={{ backgroundColor: '#002e42', borderRadius: '12px', color: 'white' }} styles={{ body: { padding: '24px' } }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '24px' }}>Tiến độ công việc</Text>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px', marginRight: '16px' }}>
                <FileTextOutlined style={{ fontSize: '20px', color: '#bce1ec' }} />
              </div>
              <div>
                <Text style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', lineHeight: 1, display: 'block' }}>{kpi.pendingApprovals || 0}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Hồ sơ chờ phê duyệt</Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px', marginRight: '16px' }}>
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#1e7e34' }} />
              </div>
              <div>
                <Text style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', lineHeight: 1, display: 'block' }}>{kpi.activeContracts || 0}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Hợp đồng hiệu lực</Text>
              </div>
            </div>

            <Button type="primary" block style={{ backgroundColor: '#1e7e34', border: 'none', borderRadius: '6px', height: '40px' }}>
              Truy cập Kho Lưu trữ
            </Button>
          </Card>
        </Col>
      </Row>
      
      {/* Quick Access Footer Row inside dashboard (Optional addition to match UI) */}
      <div style={{ marginTop: '32px' }}>
         <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#002e42', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}>KHO LƯU TRỮ & TRUY CẬP NHANH</Text>
         <Row gutter={24}>
           <Col span={8}>
             <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '16px 24px' } }}>
               <Space align="center" size={16}>
                  <div style={{ backgroundColor: '#e6f4ea', padding: '12px', borderRadius: '8px' }}>
                    <FolderOpenOutlined style={{ fontSize: '24px', color: '#1e7e34' }} />
                  </div>
                  <div>
                    <Text style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>Hồ sơ địa chính</Text>
                    <Text style={{ fontSize: '12px', color: '#595959' }}>Lưu trữ kỹ thuật số</Text>
                  </div>
               </Space>
             </Card>
           </Col>
           <Col span={8}>
             <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '16px 24px' } }}>
               <Space align="center" size={16}>
                  <div style={{ backgroundColor: '#e6f4ea', padding: '12px', borderRadius: '8px' }}>
                    <FileDoneOutlined style={{ fontSize: '24px', color: '#1e7e34' }} />
                  </div>
                  <div>
                    <Text style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>Văn bản pháp lý</Text>
                    <Text style={{ fontSize: '12px', color: '#595959' }}>Thông tư, Nghị định</Text>
                  </div>
               </Space>
             </Card>
           </Col>
           <Col span={8}>
             <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '16px 24px' } }}>
               <Space align="center" size={16}>
                  <div style={{ backgroundColor: '#e6f4ea', padding: '12px', borderRadius: '8px' }}>
                    <ProfileOutlined style={{ fontSize: '24px', color: '#1e7e34' }} />
                  </div>
                  <div>
                    <Text style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>Biểu mẫu chuẩn</Text>
                    <Text style={{ fontSize: '12px', color: '#595959' }}>Quy trình SOP</Text>
                  </div>
               </Space>
             </Card>
           </Col>
         </Row>
      </div>

    </div>
  );
};

export default AdminDashboard;
