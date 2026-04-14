import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Table, Tag, Select, Input, DatePicker, Space } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  PlusOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const InspectionHistory = () => {
  const navigate = useNavigate();

  const stats = {
    totalInspections: 1284,
    violations: 156,
    completionRate: 94.2
  };

  const inspections = [
    {
      key: '1',
      code: '#TT-2024-001',
      date: '12/10/2024',
      subject: 'Công ty TNHH MTV Xây dựng Đông A',
      location: 'Lô A, Thửa CI-102, P. Bến Nghé',
      status: 'completed',
      statusText: 'HOÀN TẤT'
    },
    {
      key: '2',
      code: '#TT-2024-002',
      date: '14/10/2024',
      subject: 'Ông Nguyễn Văn A',
      location: 'Hẻm 42, Thửa CI-405, P. Đa Kao',
      status: 'pending',
      statusText: 'ĐANG XỬ LÝ'
    },
    {
      key: '3',
      code: '#TT-2024-003',
      date: '15/10/2024',
      subject: 'Tập đoàn Bất động sản Hưng Phát',
      location: 'Đại lộ 1, Thửa CI-991, P. Tân Định',
      status: 'violation',
      statusText: 'VI PHẠM'
    },
    {
      key: '4',
      code: '#TT-2024-004',
      date: '18/10/2024',
      subject: 'Bà Lê Thị B',
      location: 'Đường số 5, Thửa CI-223, P. Bến Nghé',
      status: 'completed',
      statusText: 'HOÀN TẤT'
    },
    {
      key: '5',
      code: '#TT-2024-005',
      date: '20/10/2024',
      subject: 'HTX Nông nghiệp 1',
      location: 'Khu công nghệ, Thửa CI-011, P. Đa Kao',
      status: 'pending',
      statusText: 'ĐANG XỬ LÝ'
    }
  ];

  const columns = [
    {
      title: 'MÃ ĐỢT',
      dataIndex: 'code',
      key: 'code',
      width: 130,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'NGÀY KIỂM TRA',
      dataIndex: 'date',
      key: 'date',
      width: 130
    },
    {
      title: 'ĐỐI TƯỢNG',
      dataIndex: 'subject',
      key: 'subject',
      width: 250
    },
    {
      title: 'ĐỊA ĐIỂM/THỬA ĐẤT',
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
      title: 'TRẠNG THÁI',
      key: 'status',
      width: 130,
      render: (_, record) => {
        const statusConfig = {
          completed: { color: 'success', text: 'HOÀN TẤT' },
          pending: { color: 'warning', text: 'ĐANG XỬ LÝ' },
          violation: { color: 'error', text: 'VI PHẠM' }
        };
        const config = statusConfig[record.status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/inspector/audits/${record.key}`)}
        >
          Chi tiết
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
          Lịch sử Kiểm tra
        </Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">
            Dữ liệu hệ thống Đất Việt Core
          </Text>
          <Tag color="green">HỆ THỐNG ỔN ĐỊNH</Tag>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              TỔNG SỐ ĐỢT KIỂM TRA
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#002e42' }}>
              {stats.totalInspections.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              ↗ +12% tháng này
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              SỐ VI PHẠM PHÁT HIỆN
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d9363e' }}>
              {stats.violations}
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              ▲ Cần xử lý: 24
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              TỶ LỆ HOÀN THÀNH
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34' }}>
              {stats.completionRate}%
            </div>
            <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px' }}>
              ● Vượt chỉ tiêu: 2.1%
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
                <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>THỜI GIAN</Text>
                <DatePicker 
                  placeholder="Tháng này (Tháng 10/2024)"
                  style={{ width: 220 }}
                />
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>TRẠNG THÁI</Text>
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="completed">Hoàn tất</Option>
                  <Option value="pending">Đang xử lý</Option>
                  <Option value="violation">Vi phạm</Option>
                </Select>
              </div>
            </Space>
          </Col>

          <Col>
            <Space>
              <Button icon={<FilterOutlined />}>Bộ lọc</Button>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                style={{ background: '#002e42', borderColor: '#002e42' }}
              >
                Tìm kiếm hồ sơ
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card 
        title="Danh sách lịch sử kiểm tra"
        extra={
          <Space>
            <Button icon={<DownloadOutlined />}>Xuất báo cáo</Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{ background: '#1e7e34', borderColor: '#1e7e34' }}
              onClick={() => navigate('/inspector/violations')}
            >
              Tạo đợt kiểm tra mới
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hiển thị 5 / 128 đợt kiểm tra
          </Text>
        </div>

        <Table 
          columns={columns}
          dataSource={inspections}
          pagination={{
            current: 1,
            pageSize: 10,
            total: 128,
            showSizeChanger: false
          }}
        />
      </Card>
    </div>
  );
};

export default InspectionHistory;
