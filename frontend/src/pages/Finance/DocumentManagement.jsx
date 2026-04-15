import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Table, Tag, Select, Input, Space } from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  SyncOutlined,
  BankOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const DocumentManagement = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTime, setSelectedTime] = useState('month');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [documents, setDocuments] = useState([]);

  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingApproval: 0,
    totalValue: 0,
    collectionRate: 0
  });

  // Fetch documents data
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('🔍 Documents Management - Debug Info:');
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

        console.log('🚀 Fetching documents with params:', {
          type: selectedType,
          time: selectedTime,
          page: currentPage,
          limit: 10
        });

        const response = await axios.get('http://localhost:5000/api/finance/documents', {
          params: {
            type: selectedType,
            time: selectedTime,
            page: currentPage,
            limit: 10
          },
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Documents API response:', response.data);

        if (response.data.success) {
          console.log('✅ Documents API response:', response.data);
          
          setDocuments(response.data.data.documents);
          setTotalDocuments(response.data.data.total);
          
          // Calculate stats from data
          const docs = response.data.data.documents;
          const pendingCount = docs.filter(d => d.status === 'pending').length;
          const totalValue = docs.reduce((sum, d) => sum + d.amount, 0) / 1000000000;
          
          setStats({
            totalDocuments: response.data.data.total,
            pendingApproval: pendingCount,
            totalValue: totalValue,
            collectionRate: 82 // This would need a separate calculation
          });
          
          console.log('📊 Stats calculated:', {
            totalDocuments: response.data.data.total,
            pendingApproval: pendingCount,
            totalValue: totalValue.toFixed(1) + ' tỷ VNĐ'
          });
        } else {
          console.error('❌ API returned success: false');
        }
      } catch (error) {
        console.error('❌ Error fetching documents:', error);
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

    fetchDocuments();
  }, [selectedType, selectedTime, currentPage]);

  const columns = [
    {
      title: 'MÃ CHỨNG TỪ',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'NGÀY LẬP',
      dataIndex: 'date',
      key: 'date',
      width: 120
    },
    {
      title: 'NGƯỜI NỘP / ĐƠN VỊ',
      key: 'payer',
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            {record.payerAvatar}
          </div>
          <Text>{record.payer}</Text>
        </div>
      )
    },
    {
      title: 'NỘI DUNG',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true
    },
    {
      title: 'SỐ TIỀN (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text strong>{amount.toLocaleString('vi-VN')}</Text>
      )
    },
    {
      title: 'TRẠNG THÁI',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const statusConfig = {
          verified: { color: 'success', text: 'VERIFIED' },
          pending: { color: 'warning', text: 'PENDING' },
          canceled: { color: 'error', text: 'CANCELED' }
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
        <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>Quản lý chứng từ</Title>
        <Text type="secondary">
          Theo dõi, kiểm tra và phê duyệt hệ thống chứng từ tài chính đất công ích.
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#002e42', color: '#fff', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>
              TỔNG SỐ CHỨNG TỪ ĐÃ LẬP
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {stats.totalDocuments.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: '11px', 
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <SyncOutlined />
              +12% so với tháng trước
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              CHỜ ĐỒNG BỘ KHO BẠC
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#002e42' }}>
              {stats.pendingApproval}
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              Ưu tiên đồng bộ trong 24h tới
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <SyncOutlined style={{ color: '#1e7e34' }} />
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                GIÁ TRỊ GIAO DỊCH (THÁNG)
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34' }}>
              {stats.totalValue.toLocaleString()} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>tỷ VNĐ</span>
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              Hạn mức thu nộp: 3.000 tỷ VNĐ
              <span style={{ marginLeft: '8px', color: '#1e7e34', fontWeight: 'bold' }}>
                {stats.collectionRate}%
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Button 
            type="primary" 
            size="large"
            icon={<DownloadOutlined />}
            block
            style={{ 
              height: '100%',
              minHeight: '100px',
              background: '#1e7e34',
              borderColor: '#1e7e34'
            }}
          >
            Xuất báo cáo (Excel)
          </Button>
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Space size="middle">
            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>LOẠI</Text>
              <Select 
                defaultValue="all" 
                style={{ width: 180 }}
                onChange={setSelectedType}
              >
                <Option value="all">Tất cả chứng từ</Option>
                <Option value="payment">Phiếu thu</Option>
                <Option value="receipt">Biên lai</Option>
                <Option value="invoice">Hóa đơn</Option>
              </Select>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>THỜI GIAN</Text>
              <Select 
                defaultValue="month" 
                style={{ width: 150 }}
                onChange={setSelectedTime}
              >
                <Option value="today">Hôm nay</Option>
                <Option value="week">Tuần này</Option>
                <Option value="month">Tháng này</Option>
                <Option value="quarter">Quý này</Option>
              </Select>
            </div>
          </Space>

          <Space>
            <Button icon={<FilterOutlined />}>Bộ lọc</Button>
            <Input 
              placeholder="Tìm kiếm chứng từ, mã số..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </Space>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hiển thị {Math.min((currentPage - 1) * 10 + 1, totalDocuments)} - {Math.min(currentPage * 10, totalDocuments)} trong số {totalDocuments.toLocaleString()} kết quả
          </Text>
        </div>

        <Table 
          columns={columns}
          dataSource={documents}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalDocuments,
            showSizeChanger: false,
            style: { marginTop: '24px' },
            onChange: (page) => setCurrentPage(page)
          }}
        />

        <div style={{ 
          marginTop: '24px',
          padding: '16px',
          background: '#f0f2f5',
          borderRadius: '8px',
          display: 'flex',
          gap: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#52c41a' }} />
            <Text style={{ fontSize: '12px' }}>ĐÃ PHÊ DUYỆT (VERIFIED)</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#faad14' }} />
            <Text style={{ fontSize: '12px' }}>CHỜ XỬ LÝ (PENDING)</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d9363e' }} />
            <Text style={{ fontSize: '12px' }}>ĐÃ HỦY (CANCELED)</Text>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#8c8c8c' }}>
            Lần cập nhật cuối cùng vào Kho bạc: 12/10/2023 - 14:30:22
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentManagement;