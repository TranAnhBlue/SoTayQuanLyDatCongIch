import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Table, Tag, Select, Input, Space, Progress } from 'antd';
import {
  WarningOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  BankOutlined,
  MoreOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const DebtManagement = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedTime, setSelectedTime] = useState('q3');
  const [searchText, setSearchText] = useState('');

  const [stats, setStats] = useState({
    totalEstimate: 0,
    collected: 0,
    overdue: 0,
    collectionRate: 0
  });

  const [debtData, setDebtData] = useState([]);

  // Fetch debt management data
  useEffect(() => {
    const fetchDebtData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('🔍 Debt Management - Debug Info:');
        console.log('- Token exists:', !!token);
        console.log('- User role:', user.role);
        
        if (!token) {
          console.error('❌ No token found');
          return;
        }

        if (user.role !== 'finance' && user.role !== 'admin') {
          console.error('❌ User role not authorized:', user.role);
          return;
        }

        console.log('🚀 Fetching debt data with filters:', {
          status: selectedStatus,
          zone: selectedZone, 
          time: selectedTime,
          search: searchText,
          page: currentPage
        });
        
        const response = await axios.get('http://localhost:5000/api/finance/debt', {
          params: {
            status: selectedStatus,
            zone: selectedZone,
            time: selectedTime,
            search: searchText,
            page: currentPage,
            limit: 10
          },
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Debt API response:', response.data);

        if (response.data.success) {
          console.log('📊 Setting debt data:');
          console.log('- Stats:', response.data.data.stats);
          console.log('- Debt items:', response.data.data.debtData.length);
          
          // Debug: Log first few items to see area data
          if (response.data.data.debtData.length > 0) {
            console.log('📝 First 3 debt items:');
            response.data.data.debtData.slice(0, 3).forEach((item, index) => {
              console.log(`${index + 1}. ${item.name}`);
              console.log(`   Area: "${item.area}"`);
              console.log(`   Tax Code: ${item.taxCode}`);
            });
          }
          
          setStats(response.data.data.stats);
          setDebtData(response.data.data.debtData);
          setTotalRecords(response.data.data.total);
          setFilteredRecords(response.data.data.filtered || response.data.data.debtData.length);
        } else {
          console.error('❌ API returned success: false');
        }
      } catch (error) {
        console.error('❌ Error fetching debt data:', error);
        console.error('- Error response:', error.response?.data);
        
        if (error.response?.status === 401) {
          console.log('🔄 Token expired, redirecting to login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDebtData();
  }, [selectedStatus, selectedZone, selectedTime, currentPage, searchText]);

  const columns = [
    {
      title: 'TÊN CHO THUÊ / TỔ CHỨC',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>{record.area}</Text>
        </div>
      )
    },
    {
      title: 'MÃ SỐ THUẾ / THỬA ĐẤT',
      dataIndex: 'taxCode',
      key: 'taxCode',
      width: 150
    },
    {
      title: 'TỔNG PHẢI THU',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text strong>{(amount / 1000000).toLocaleString('vi-VN')}</Text>
      )
    },
    {
      title: 'ĐÃ NỘP',
      dataIndex: 'paid',
      key: 'paid',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text>{(amount / 1000000).toLocaleString('vi-VN')}</Text>
      )
    },
    {
      title: 'DƯ NỢ',
      dataIndex: 'remaining',
      key: 'remaining',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text strong style={{ color: amount > 0 ? '#d9363e' : '#52c41a' }}>
          {(amount / 1000000).toLocaleString('vi-VN')}
        </Text>
      )
    },
    {
      title: 'TRẠNG THÁI',
      key: 'status',
      width: 150,
      render: (_, record) => {
        const statusConfig = {
          paid: { color: 'success', text: 'ĐÃ NỘP ĐỦ' },
          overdue: { color: 'warning', text: 'NỢ TRONG HẠN' },
          critical: { color: 'error', text: 'NỢ QUÁ HẠN' }
        };
        const config = statusConfig[record.status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 80,
      align: 'center',
      render: () => (
        <Button type="text" icon={<MoreOutlined />} />
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
          Quản lý Thu nộp & Công nợ
        </Title>
        <Text type="secondary">
          Theo dõi, kiểm tra và phê duyệt hệ thống chứng từ tài chính đất công ích.
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#002e42', color: '#fff', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <BankOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
              <div style={{ fontSize: '12px', opacity: 0.8 }}>TỔNG THU DỰ KIẾN</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {stats.totalEstimate ? parseFloat(stats.totalEstimate).toLocaleString('vi-VN') : '0'} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>tỷ VNĐ</span>
            </div>
            <div style={{ 
              fontSize: '11px', 
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowUpOutlined />
              Cập nhật lúc 08:30 hôm nay
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              ĐÃ THU THỰC TẾ
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34' }}>
              {stats.collected ? parseFloat(stats.collected).toLocaleString('vi-VN') : '0'} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>tỷ VNĐ</span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={stats.collectionRate || 0} 
                strokeColor="#1e7e34"
                showInfo={false}
                size="small"
              />
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
                * Đã đạt {stats.collectionRate || 0}% kế hoạch Nhà nước
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#fff1f0', borderRadius: '12px', border: '1px solid #ffccc7' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <WarningOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#d9363e' }} />
              <div style={{ fontSize: '12px', color: '#d9363e' }}>CÔNG NỢ QUÁ HẠN</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d9363e' }}>
              {stats.overdue ? parseFloat(stats.overdue).toLocaleString('vi-VN') : '0'} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>tỷ VNĐ</span>
            </div>
            <div style={{ fontSize: '11px', color: '#d9363e', marginTop: '8px' }}>
              CẢNH BÁO MỨC ĐỘ CAO
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button 
              icon={<DownloadOutlined />}
              block
              style={{ height: '48px' }}
            >
              Xuất báo cáo công nợ
            </Button>
            <Button 
              type="primary"
              icon={<CheckCircleOutlined />}
              block
              style={{ 
                height: '48px',
                background: '#1e7e34',
                borderColor: '#1e7e34'
              }}
            >
              Ghi nhận nộp tiền nhanh
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Space size="middle">
            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>LOẠI</Text>
              <Select value={selectedStatus} onChange={setSelectedStatus} style={{ width: 180 }}>
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="paid">Đã nộp đủ</Option>
                <Option value="overdue">Nợ trong hạn</Option>
                <Option value="critical">Nợ quá hạn</Option>
              </Select>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>MỘI KHU VỰC</Text>
              <Select value={selectedZone} onChange={setSelectedZone} style={{ width: 150 }}>
                <Option value="all">Tất cả</Option>
                <Option value="yen-khe">Thôn Yên Khê</Option>
                <Option value="lai-hoang">Thôn Lại Hoàng</Option>
                <Option value="dinh">Thôn Đình</Option>
                <Option value="doc-la">Thôn Dốc Lã</Option>
              </Select>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>THỜI GIAN</Text>
              <Select value={selectedTime} onChange={setSelectedTime} style={{ width: 120 }}>
                <Option value="q1">Q1 - 2024</Option>
                <Option value="q2">Q2 - 2024</Option>
                <Option value="q3">Q3 - 2024</Option>
                <Option value="q4">Q4 - 2024</Option>
              </Select>
            </div>
          </Space>

          <Space>
            <Button 
              icon={<FilterOutlined />}
              onClick={() => {
                setSelectedStatus('all');
                setSelectedZone('all');
                setSelectedTime('q3');
                setSearchText('');
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
            <Input 
              placeholder="Tìm kiếm MST hoặc mã thửa..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Space>
        </div>
      </Card>

      {/* Table */}
      <Card title="DANH SÁCH HỢP THUÊ & CÔNG NỢ CHI TIẾT">
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hiển thị {Math.min((currentPage - 1) * 10 + 1, filteredRecords)} - {Math.min(currentPage * 10, filteredRecords)} / {filteredRecords} kết quả
            {filteredRecords !== totalRecords && (
              <span style={{ color: '#1890ff', marginLeft: '8px' }}>
                (đã lọc từ {totalRecords} tổng cộng)
              </span>
            )}
          </Text>
        </div>

        <Table 
          columns={columns}
          dataSource={debtData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: filteredRecords,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} kết quả`
          }}
        />
      </Card>

      {/* Bottom Alert */}
      <Card 
        style={{ 
          marginTop: '24px',
          background: '#fff1f0',
          border: '1px solid #ffccc7'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <WarningOutlined style={{ fontSize: '24px', color: '#d9363e', marginTop: '4px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#d9363e', marginBottom: '8px' }}>
              CẢNH BÁO TỰ ĐỘNG HÓA
            </div>
            <div style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: '12px' }}>
              Hệ thống xác thực 3 lớp
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
              ✓ Hệ thống đã tự động gửi 142 thông báo nợ qua SMS/Email trong tháng này.
              <br />
              ✓ 32 trường hợp nợ quá hạn 90 ngày đã được chuyển hồ sơ xử lý vi phạm.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DebtManagement;