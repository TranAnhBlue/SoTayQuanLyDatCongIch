import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Table, Tag, Button, Space, Modal, Descriptions } from 'antd';
import { 
  PieChartOutlined, 
  DownloadOutlined, 
  FileExcelOutlined,
  CheckCircleOutlined,
  EllipsisOutlined,
  MailOutlined
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const { Title, Text } = Typography;

const AdminReport = () => {
  const [data, setData] = useState({ violations: [], pieData: [], barData: [], stats: {} });
  const [updatingId, setUpdatingId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/reports');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching admin reports data:', error);
      }
    };
    fetchData();
  }, []);

  // Chart Data
  const pieData = data.pieData.length > 0 ? data.pieData : [
    { name: 'Đất nông nghiệp', value: 55, color: '#1e7e34' },
    { name: 'Đất ở đô thị', value: 25, color: '#002e42' },
    { name: 'Đất công ích', value: 20, color: '#f39c12' }
  ];

  // BarData from API
  const barData = data.barData?.length > 0 ? data.barData : [
    { name: 'Quý I', value: 2.1 },
    { name: 'Quý II', value: 3.4 },
    { name: 'Quý III', value: 5.8 },
    { name: 'Quý IV', value: 4.2 }
  ];

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleUpdateViolation = async (id, status, statusColor) => {
    setUpdatingId(id);
    try {
      await axios.put(`http://localhost:5000/api/admin/violations/${id}`, { status, statusColor });
      // Refresh
      const response = await axios.get('http://localhost:5000/api/admin/reports');
      setData(response.data);
    } catch (e) {
      console.error('Failed to update violation', e);
    }
    setUpdatingId(null);
  };

  // Table Data
  const violations = data.violations.length > 0 ? data.violations : [
    {
      key: '1',
      code: 'VP-2024-001',
      location: 'Khu vực 3, Ấp 2',
      target: 'Hộ ông Nguyễn Văn A',
      type: 'Xây dựng trái phép',
      date: '14/10/2023',
      status: 'Chờ xử lý',
      statusColor: 'warning'
    }
  ];

  const columns = [
    {
      title: 'MÃ HỒ SƠ',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => <Text onClick={() => handleOpenDetail(record)} style={{ fontWeight: 'bold', color: '#1e7e34', cursor: 'pointer', textDecoration: 'underline' }}>{text}</Text>
    },
    {
      title: 'VỊ TRÍ / ĐỐI TƯỢNG',
      key: 'location',
      render: (text, record) => (
        <div>
          <Text style={{ fontWeight: 'bold', display: 'block' }}>{record.location}</Text>
          <Text style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic' }}>{record.target}</Text>
        </div>
      )
    },
    {
      title: 'LOẠI VI PHẠM',
      dataIndex: 'type',
      key: 'type',
      render: text => <Text style={{ color: '#595959', fontWeight: 500 }}>{text}</Text>
    },
    {
      title: 'NGÀY GHI',
      dataIndex: 'date',
      key: 'date',
      render: text => <Text style={{ color: '#595959' }}>{text}</Text>
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        let color = '#52c41a';
        let bgColor = '#f6ffed';
        if (record.statusColor === 'error') { color = '#f5222d'; bgColor = '#fff1f0'; }
        if (record.statusColor === 'warning') { color = '#fa8c16'; bgColor = '#fff7e6'; }
        return (
          <Tag color={color} style={{ backgroundColor: bgColor, border: 'none', borderRadius: '12px', padding: '4px 12px', fontWeight: 'bold' }}>
            {text}
          </Tag>
        )
      }
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.statusColor === 'error' && (
            <Button
              size="small"
              loading={updatingId === record.key}
              onClick={() => handleUpdateViolation(record.key, 'Đang xác minh', 'warning')}
              style={{ borderRadius: '6px', fontSize: '10px' }}
            >
              Chuyển xử lý
            </Button>
          )}
          {record.statusColor === 'warning' && (
            <Button
              size="small"
              type="primary"
              loading={updatingId === record.key}
              onClick={() => handleUpdateViolation(record.key, 'Đã xử lý', 'success')}
              style={{ backgroundColor: '#1e7e34', borderRadius: '6px', fontSize: '10px' }}
            >
              Hoàn tất
            </Button>
          )}
          <Button size="small" onClick={() => handleOpenDetail(record)}>Chi tiết</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#002e42', fontWeight: 800, textTransform: 'uppercase' }}>Báo cáo & Thống kê</Title>
          <Text style={{ fontSize: '14px', color: '#595959' }}>Tổng hợp dữ liệu sử dụng đất và vi phạm định kỳ</Text>
        </div>
        <Space>
          <Button type="default" icon={<DownloadOutlined />} style={{ borderRadius: '6px' }}>Tải báo cáo PDF</Button>
          <Button type="primary" icon={<FileExcelOutlined />} style={{ backgroundColor: '#1e7e34', borderRadius: '6px' }}>Xuất Excel</Button>
        </Space>
      </div>

      <Row gutter={24} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={5} style={{ margin: 0, fontWeight: 'bold', color: '#002e42' }}>Cơ cấu sử dụng đất</Title>
              <PieChartOutlined style={{ color: '#8c8c8c', fontSize: '20px' }} />
            </div>
            
            <div style={{ position: 'relative', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Inner Content for Donut chart */}
                <div style={{ position: 'absolute', textAlign: 'center', backgroundColor: '#e6f4ea', border: '8px solid #1e7e34', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: '28px', fontWeight: 800, color: '#002e42', lineHeight: 1 }}>1.240</Text>
                  <Text style={{ fontSize: '10px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '1px' }}>Hecta</Text>
                </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              {pieData.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Space>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                    <Text style={{ fontWeight: 500, color: '#262626' }}>{item.name}</Text>
                  </Space>
                  <Text style={{ fontWeight: 'bold' }}>{item.value}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card variant="borderless" style={{ borderRadius: '12px', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%' } }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <Title level={5} style={{ margin: 0, fontWeight: 'bold', color: '#002e42' }}>Nguồn thu theo quý</Title>
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Đơn vị tính: Tỷ VNĐ</Text>
              </div>
              <Space size={0}>
                  <Button type="primary" size="small" style={{ backgroundColor: '#002e42', borderRadius: '4px 0 0 4px' }}>2023</Button>
                  <Button type="default" size="small" style={{ borderRadius: '0 4px 4px 0' }}>2024</Button>
              </Space>
            </div>

            <div style={{ flex: 1, minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f4f6f8' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#1e7e34' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
               {/* Note: The 5.8 text above bar 3 in the screenshot can be implemented using custom labels in Recharts */}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', backgroundColor: '#002e42', height: '100%', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ padding: '16px' }}>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
                Tỷ lệ tăng trưởng thu
              </Text>
              <Title level={1} style={{ margin: 0, color: 'white', fontWeight: 800 }}>+12.5%</Title>
              <Text style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', display: 'block', marginTop: '24px', lineHeight: '1.6' }}>
                Nguồn thu từ thuế đất đạt mức cao kỷ lục so với cùng kỳ năm ngoái.
              </Text>
            </div>
            {/* Arrow background SVG proxy */}
            <div style={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.2 }}>
               <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card variant="borderless" style={{ borderRadius: '12px', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} styles={{ body: { padding: 0 } }}>
            <div style={{ margin: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0, fontWeight: 'bold', color: '#002e42' }}>Danh sách vi phạm mới ghi nhận</Title>
              <a href="#" style={{ color: '#1e7e34', fontWeight: 'bold', fontSize: '13px' }}>Xem tất cả &gt;</a>
            </div>
            <Table 
              columns={columns} 
              dataSource={violations} 
              pagination={false} 
              rowClassName={() => 'violation-row'}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: '24px' }}>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Space align="center" size={16}>
              <div style={{ backgroundColor: '#e6f4ea', padding: '12px', borderRadius: '8px' }}>
                <CheckCircleOutlined style={{ fontSize: '24px', color: '#1e7e34' }} />
              </div>
              <div>
                <Text style={{ fontSize: '12px', color: '#595959', fontWeight: 'bold', textTransform: 'uppercase' }}>Đã xử lý</Text>
                <Title level={3} style={{ margin: 0, color: '#002e42' }}>
                  {data.violations?.filter(v => v.statusColor === 'success').length || data.stats?.resolved || 0} việc
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Space align="center" size={16}>
              <div style={{ backgroundColor: '#fff7e6', padding: '12px', borderRadius: '8px' }}>
                <EllipsisOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              </div>
              <div>
                <Text style={{ fontSize: '12px', color: '#595959', fontWeight: 'bold', textTransform: 'uppercase' }}>Đang kiểm tra</Text>
                <Title level={3} style={{ margin: 0, color: '#002e42' }}>
                  {data.violations?.filter(v => v.statusColor === 'warning').length || 0} hồ sơ
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Space align="center" size={16}>
              <div style={{ backgroundColor: '#e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <MailOutlined style={{ fontSize: '24px', color: '#002e42' }} />
              </div>
              <div>
                <Text style={{ fontSize: '12px', color: '#595959', fontWeight: 'bold', textTransform: 'uppercase' }}>Phản hồi dân cư</Text>
                <Title level={3} style={{ margin: 0, color: '#002e42' }}>45 kiến nghị</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Detail Modal for Records */}
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Chi tiết hồ sơ đất đai / Vi phạm</Title>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã hồ sơ" span={2}>{selectedRecord.code}</Descriptions.Item>
            <Descriptions.Item label="Chủ hồ sơ / Đối tượng">{selectedRecord.target || selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="Mã định danh">cccd_audit_00x</Descriptions.Item>
            <Descriptions.Item label="Loại hình">{selectedRecord.type || 'Hồ sơ đất đai'}</Descriptions.Item>
            <Descriptions.Item label="Diện tích">{selectedRecord.area || '1.240 m²'}</Descriptions.Item>
            <Descriptions.Item label="Vị trí thửa đất" span={2}>{selectedRecord.location}</Descriptions.Item>
            <Descriptions.Item label="Ngày ghi nhận">{selectedRecord.date || (selectedRecord.startDate ? new Date(selectedRecord.startDate).toLocaleDateString('vi-VN') : '--')}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedRecord.statusColor || 'warning'}>{selectedRecord.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú nghiệp vụ" span={2}>
              Hồ sơ được trích xuất từ hệ thống giám sát định kỳ. Mọi thay đổi trạng thái sẽ được lưu vào nhật ký hệ thống.
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </div>
  );
};

export default AdminReport;
