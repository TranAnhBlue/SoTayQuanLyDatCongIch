import React, { useState } from 'react';
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

const { Title, Text } = Typography;
const { Option } = Select;

const DocumentManagement = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTime, setSelectedTime] = useState('month');

  const stats = {
    totalDocuments: 1284,
    pendingApproval: 42,
    totalValue: 2450.8,
    collectionRate: 82
  };

  const documents = [
    {
      key: '1',
      code: 'PT-2023-00452',
      date: '12/10/2023',
      payer: 'Nguyễn Nam Anh',
      payerAvatar: 'NN',
      purpose: 'Thu tiền thuê đất lô ...',
      amount: 12500000,
      status: 'verified',
      statusText: 'VERIFIED'
    },
    {
      key: '2',
      code: 'HD-2023-0891',
      date: '11/10/2023',
      payer: 'CTCP Đầu tư Việt Xanh',
      payerAvatar: 'ĐV',
      purpose: 'Phí hạ tầng ký thuật ...',
      amount: 85200000,
      status: 'pending',
      statusText: 'PENDING'
    },
    {
      key: '3',
      code: 'PT-2023-00451',
      date: '10/10/2023',
      payer: 'Trần Lan Hương',
      payerAvatar: 'TL',
      purpose: 'Phạt chậm nộp thuế ...',
      amount: 2400000,
      status: 'canceled',
      statusText: 'CANCELED'
    },
    {
      key: '4',
      code: 'PT-2023-00450',
      date: '09/10/2023',
      payer: 'Dương Hiếu Minh',
      payerAvatar: 'DH',
      purpose: 'Thu phí đo đạc trích l...',
      amount: 1200000,
      status: 'verified',
      statusText: 'VERIFIED'
    }
  ];

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
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>Trđ</span>
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              Hạn mức thu nộp: 3.000 Trđ
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
            Hiển thị 1-10 trong số 1.284 kết quả
          </Text>
        </div>

        <Table 
          columns={columns}
          dataSource={documents}
          pagination={{
            current: 1,
            pageSize: 10,
            total: 1284,
            showSizeChanger: false,
            style: { marginTop: '24px' }
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