import React, { useState } from 'react';
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

const { Title, Text } = Typography;
const { Option } = Select;

const DebtManagement = () => {
  const stats = {
    totalEstimate: 142.5,
    collected: 116.8,
    overdue: 25.7,
    collectionRate: 82
  };

  const debtData = [
    {
      key: '1',
      name: 'Công ty TNHH MTV Xây dựng Đông A',
      taxCode: '0312456789',
      area: 'Khu công nghiệp Tân Bình-Lô B3',
      totalAmount: 2450000000,
      paid: 2450000000,
      remaining: 0,
      status: 'paid',
      statusText: 'ĐÃ NỘP ĐỦ'
    },
    {
      key: '2',
      name: 'Hộ kinh doanh Nguyễn Văn A',
      taxCode: '0123456789-001',
      area: 'Chợ Bến Thành-Quầy 1',
      totalAmount: 125000000,
      paid: 45000000,
      remaining: 80000000,
      status: 'overdue',
      statusText: 'NỢ TRONG HẠN'
    },
    {
      key: '3',
      name: 'HTX Nông nghiệp Công nghệ cao Xanh',
      taxCode: '0350587654',
      area: 'Khu B-Nhà kho',
      totalAmount: 540000000,
      paid: 0,
      remaining: 540000000,
      status: 'critical',
      statusText: 'NỢ QUÁ HẠN'
    },
    {
      key: '4',
      name: 'Trần Thị B (Cá nhân)',
      taxCode: '0315RB2231',
      area: 'Quận 3-VTB-14',
      totalAmount: 12500000,
      paid: 12500000,
      remaining: 0,
      status: 'paid',
      statusText: 'ĐÃ NỘP ĐỦ'
    }
  ];

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
              {stats.totalEstimate} 
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
              {stats.collected} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>tỷ VNĐ</span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={stats.collectionRate} 
                strokeColor="#1e7e34"
                showInfo={false}
                size="small"
              />
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
                * Đã đạt {stats.collectionRate}% kế hoạch Nhà nước
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
              {stats.overdue} 
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
              <Select defaultValue="all" style={{ width: 180 }}>
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="paid">Đã nộp đủ</Option>
                <Option value="overdue">Nợ trong hạn</Option>
                <Option value="critical">Nợ quá hạn</Option>
              </Select>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>MỘI KHU VỰC</Text>
              <Select defaultValue="all" style={{ width: 150 }}>
                <Option value="all">Tất cả</Option>
                <Option value="zone-a">Khu A</Option>
                <Option value="zone-b">Khu B</Option>
                <Option value="zone-c">Khu C</Option>
              </Select>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>THỜI GIAN</Text>
              <Select defaultValue="q3" style={{ width: 120 }}>
                <Option value="q1">Q1 - 2024</Option>
                <Option value="q2">Q2 - 2024</Option>
                <Option value="q3">Q3 - 2024</Option>
                <Option value="q4">Q4 - 2024</Option>
              </Select>
            </div>
          </Space>

          <Space>
            <Button icon={<FilterOutlined />}>Bộ lọc</Button>
            <Input 
              placeholder="Tìm kiếm MST hoặc mã thửa..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </Space>
        </div>
      </Card>

      {/* Table */}
      <Card title="DANH SÁCH HỢP THUÊ & CÔNG NỢ CHI TIẾT">
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hiển thị 12 / 1.420 kết quả
          </Text>
        </div>

        <Table 
          columns={columns}
          dataSource={debtData}
          pagination={{
            current: 1,
            pageSize: 10,
            total: 1420,
            showSizeChanger: false
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