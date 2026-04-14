import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Table, Tag, Select, Input, Space } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  AuditOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const AuditList = () => {
  const navigate = useNavigate();

  const audits = [
    {
      key: '1',
      code: 'CI-2024-0892',
      location: 'Phường An Khánh, Thủ Đức',
      renter: 'Ông Nguyễn Văn A',
      legalArea: 2450.5,
      actualArea: 2100.0,
      discrepancy: -350.5,
      status: 'warning',
      statusText: 'LỆCH 12.5%'
    },
    {
      key: '2',
      code: 'CI-2024-0891',
      location: 'Lô A, Thửa CI-102, P. Bến Nghé',
      renter: 'Công ty TNHH MTV Xây dựng Đông A',
      legalArea: 5200.0,
      actualArea: 5200.0,
      discrepancy: 0,
      status: 'success',
      statusText: 'KHỚP 100%'
    },
    {
      key: '3',
      code: 'CI-2024-0890',
      location: 'Hẻm 42, Thửa CI-405, P. Đa Kao',
      renter: 'Bà Lê Thị B',
      legalArea: 850.0,
      actualArea: 850.0,
      discrepancy: 0,
      status: 'success',
      statusText: 'KHỚP 100%'
    },
    {
      key: '4',
      code: 'CI-2024-0889',
      location: 'Đại lộ 1, Thửa CI-991, P. Tân Định',
      renter: 'Tập đoàn Bất động sản Hưng Phát',
      legalArea: 12000.0,
      actualArea: 11500.0,
      discrepancy: -500.0,
      status: 'error',
      statusText: 'LỆCH 4.2%'
    }
  ];

  const columns = [
    {
      title: 'MÃ THỬA ĐẤT',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'ĐỊA ĐIỂM',
      dataIndex: 'location',
      key: 'location',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
          <Text>{text}</Text>
        </div>
      )
    },
    {
      title: 'NGƯỜI THUÊ',
      dataIndex: 'renter',
      key: 'renter',
      width: 200
    },
    {
      title: 'DIỆN TÍCH PHÁP LÝ (m²)',
      dataIndex: 'legalArea',
      key: 'legalArea',
      width: 150,
      align: 'right',
      render: (value) => value.toLocaleString()
    },
    {
      title: 'DIỆN TÍCH THỰC TẾ (m²)',
      dataIndex: 'actualArea',
      key: 'actualArea',
      width: 150,
      align: 'right',
      render: (value) => value.toLocaleString()
    },
    {
      title: 'SAI LỆCH',
      dataIndex: 'discrepancy',
      key: 'discrepancy',
      width: 120,
      align: 'right',
      render: (value) => (
        <Text strong style={{ color: value === 0 ? '#1e7e34' : '#d9363e' }}>
          {value === 0 ? '0' : value.toLocaleString()}
        </Text>
      )
    },
    {
      title: 'TRẠNG THÁI',
      key: 'status',
      width: 130,
      render: (_, record) => {
        const statusConfig = {
          success: { color: 'success', text: 'KHỚP 100%' },
          warning: { color: 'warning', text: record.statusText },
          error: { color: 'error', text: record.statusText }
        };
        const config = statusConfig[record.status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/inspector/audits/${record.key}`)}
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase' }}>
          THANH TRA & KIỂM SOÁT
        </div>
        <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
          Công đối soát
        </Title>
        <Text type="secondary">
          So khớp hồ sơ pháp lý, hợp đồng thuê và tính trạng tài chính thực tế
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              TỔNG SỐ THỬA ĐẤT
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#002e42' }}>
              1,284
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              Đã đối soát trong hệ thống
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              KHỚP HOÀN TOÀN
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34' }}>
              1,128
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              87.8% tổng số thửa đất
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              CÓ SAI LỆCH
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d9363e' }}>
              156
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              Cần kiểm tra và xử lý
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle">
              <div>
                <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>TRẠNG THÁI</Text>
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">Tất cả</Option>
                  <Option value="success">Khớp 100%</Option>
                  <Option value="warning">Có sai lệch</Option>
                  <Option value="error">Sai lệch nghiêm trọng</Option>
                </Select>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>KHU VỰC</Text>
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">Tất cả khu vực</Option>
                  <Option value="q1">Quận 1</Option>
                  <Option value="q7">Quận 7</Option>
                  <Option value="td">Thủ Đức</Option>
                </Select>
              </div>
            </Space>
          </Col>

          <Col>
            <Space>
              <Input 
                placeholder="Tìm kiếm mã thửa đất (CI-XXX)..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
              />
              <Button icon={<FilterOutlined />}>Bộ lọc</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AuditOutlined />
            <span>Danh sách đối soát dữ liệu</span>
          </div>
        }
      >
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hiển thị 4 / 1,284 kết quả
          </Text>
        </div>

        <Table 
          columns={columns}
          dataSource={audits}
          pagination={{
            current: 1,
            pageSize: 10,
            total: 1284,
            showSizeChanger: false
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
            <Text style={{ fontSize: '12px' }}>KHỚP 100%</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#faad14' }} />
            <Text style={{ fontSize: '12px' }}>CÓ SAI LỆCH</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d9363e' }} />
            <Text style={{ fontSize: '12px' }}>SAI LỆCH NGHIÊM TRỌNG</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuditList;
