import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Table, Tag, Select, Space, Divider } from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FilterOutlined,
  FilePdfOutlined,
  SendOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const FinancialReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('q4-2023');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [stats, setStats] = useState({
    totalArea: 0,
    totalUnits: 0,
    totalCollected: 0,
    totalDebt: 0,
    completionRate: 0,
    debtRate: 0
  });

  const [reportData, setReportData] = useState([]);

  // Fetch financial reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/finance/reports', {
          params: {
            period: selectedPeriod,
            page: currentPage,
            limit: 10
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setStats(response.data.data.stats);
          setReportData(response.data.data.reportData);
          setTotalRecords(response.data.data.total);
        }
      } catch (error) {
        console.error('Error fetching financial reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedPeriod, currentPage]);

  const columns = [
    {
      title: 'MÃ ĐƠN VỊ',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'TÊN ĐƠN VỊ / CÁ NHÂN THUÊ',
      key: 'unit',
      width: 300,
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
            {record.unitCode}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{record.unit}</div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {record.area < 10 ? 'Hộ kinh doanh cá nhân' : 
               record.area < 50 ? 'Cơ sở đăng ký vừa' : 
               'Khu dân lập công'}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'DIỆN TÍCH (HA)',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      align: 'right',
      render: (area) => <Text>{area.toFixed(2)}</Text>
    },
    {
      title: 'PHẢI THU (VNĐ)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text>{(amount / 1000000).toLocaleString('vi-VN')}</Text>
      )
    },
    {
      title: 'ĐÃ THU (VNĐ)',
      dataIndex: 'paid',
      key: 'paid',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text>{(amount / 1000000).toLocaleString('vi-VN')}</Text>
      )
    },
    {
      title: 'CÒN NỢ (VNĐ)',
      dataIndex: 'remaining',
      key: 'remaining',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text strong style={{ color: amount > 0 ? '#d9363e' : '#52c41a' }}>
          {(amount / 1000000).toLocaleString('vi-VN')}
        </Text>
      )
    }
  ];

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
          <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
            Báo cáo Tài chính định kỳ
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FileTextOutlined style={{ color: '#1e7e34' }} />
            <Text type="secondary">
              Thống kê chi tiết tình hình thu nộp ngân sách từ quỹ đất công ích
            </Text>
          </div>
        </div>
        <Space>
          <Button>Tháng</Button>
          <Button type="primary" style={{ background: '#1e7e34', borderColor: '#1e7e34' }}>
            Quý
          </Button>
          <Button>Năm</Button>
        </Space>
      </div>

      {/* Period Selector */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text strong>Chọn kỳ báo cáo:</Text>
          <Select 
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            style={{ width: 200 }}
          >
            <Option value="q1-2023">Quý 1, 2023</Option>
            <Option value="q2-2023">Quý 2, 2023</Option>
            <Option value="q3-2023">Quý 3, 2023</Option>
            <Option value="q4-2023">Quý 4, 2023</Option>
          </Select>
        </div>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ background: '#002e42', color: '#fff', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>
              TỔNG DIỆN TÍCH ĐẤT KHAI THÁC
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {stats.totalArea.toLocaleString()} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>Ha</span>
            </div>
            <div style={{ 
              fontSize: '11px', 
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowUpOutlined />
              +2.4% so với kỳ trước
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              TỔNG SỐ PHẢI THU
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#002e42' }}>
              {stats.totalUnits.toLocaleString()} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>triệu VNĐ</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              TỔNG SỐ ĐÃ THU
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34' }}>
              {stats.totalCollected.toLocaleString()} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>triệu VNĐ</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px' }}>
              <span style={{ color: '#1e7e34', fontWeight: 'bold' }}>{stats.completionRate}%</span>
              <span style={{ color: '#8c8c8c', marginLeft: '4px' }}>đã hoàn thành</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
              SỐ CÔNG NỢ
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d9363e' }}>
              {stats.totalDebt.toLocaleString()} 
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>triệu VNĐ</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px' }}>
              <span style={{ color: '#d9363e', fontWeight: 'bold' }}>{stats.debtRate}%</span>
              <span style={{ color: '#8c8c8c', marginLeft: '4px' }}>cần đôn đốc</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Chi tiết các đơn vị khai thác</Text>
          <Space>
            <Button icon={<FilterOutlined />}>Bộ lọc</Button>
            <Button icon={<FilterOutlined />}>Sắp xếp</Button>
          </Space>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hiển thị {Math.min((currentPage - 1) * 10 + 1, totalRecords)} - {Math.min(currentPage * 10, totalRecords)} trong số {totalRecords} bản ghi
          </Text>
        </div>

        <Table 
          columns={columns}
          dataSource={reportData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalRecords,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page)
          }}
        />
      </Card>

      {/* Bottom Actions */}
      <Card 
        style={{ 
          marginTop: '24px',
          background: '#f0f2f5',
          border: 'none'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#1e7e34' }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                  Sẵn sàng phê duyệt
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Dữ liệu báo cáo đã được kiểm tra tính hợp lệ và hệ thống.
                </Text>
              </div>
            </div>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<FilePdfOutlined />}
                size="large"
              >
                Xuất báo cáo PDF
              </Button>
              <Button 
                type="primary"
                icon={<SendOutlined />}
                size="large"
                style={{ 
                  background: '#1e7e34',
                  borderColor: '#1e7e34'
                }}
              >
                Gửi Lãnh đạo phê duyệt
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default FinancialReport;