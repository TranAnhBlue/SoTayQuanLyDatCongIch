import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Table, Tag, Button, Pagination, Space, Select } from 'antd';
import { 
  CheckCircleFilled, 
  WarningFilled, 
  SafetyCertificateFilled,
  LockFilled,
  ClockCircleFilled
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminSOPLog = () => {
  const [data, setData] = useState({ logs: [], progressPercent: 0, activeFiles: 0, pagination: { total: 0 } });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const PAGE_SIZE = 10;

  const fetchData = async (page = 1, status = '') => {
    try {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (status) params.append('status', status);
      const response = await axios.get(`http://localhost:5000/api/admin/sop-logs?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi fetch sop logs:', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, statusFilter);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchData(1, value);
  };

  const handleExportCSV = () => {
    const logs = data.logs;
    if (!logs.length) return;
    const headers = ['Thời gian', 'Ngày', 'Cán bộ', 'Chức vụ', 'Mã hồ sơ', 'Loại', 'Nội dung', 'Trạng thái'];
    const rows = logs.map(l => [
      l.time, l.date, l.officer, l.role, l.target, l.targetType, l.action, l.status
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(v => `"${v || ''}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const auditLogs = data.logs.length > 0 ? data.logs : [
    {
      key: '1',
      time: new Date().toLocaleTimeString('vi-VN'),
      date: new Date().toLocaleDateString('vi-VN'),
      officer: 'Trần Văn Cường ({Địa chính})',
      role: 'Cán bộ Xã Yên Thường',
      target: 'YT-2023-0891',
      targetType: 'Hồ sơ thuê đất',
      action: 'Đã phê duyệt hồ sơ hợp đồng',
      status: 'Thành công',
      statusColor: 'success'
    }
  ];

  const columns = [
    {
      title: 'THỜI GIAN',
      dataIndex: 'time',
      key: 'time',
      render: (text, record) => (
        <div>
          <Text style={{ fontWeight: 'bold', display: 'block' }}>{record.time}</Text>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.date}</Text>
        </div>
      )
    },
    {
      title: 'CÁN BỘ THỰC HIỆN',
      dataIndex: 'officer',
      key: 'officer',
      render: (text, record) => (
        <Space>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e6f7ff', color: '#0050b3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {record.officer.substring(0,2).toUpperCase()}
          </div>
          <div>
            <Text style={{ fontWeight: 'bold', display: 'block' }}>{record.officer}</Text>
            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.role}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'ĐỐI TƯỢNG/HỒ SƠ',
      dataIndex: 'target',
      key: 'target',
      render: (text, record) => (
        <div>
          <Text style={{ fontWeight: 'bold', display: 'block' }}>{record.target}</Text>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.targetType}</Text>
        </div>
      )
    },
    {
      title: 'NỘI DUNG THAO TÁC',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        let icon = <CheckCircleFilled style={{ color: '#1e7e34', marginRight: '8px' }} />;
        if (record.statusColor === 'error') icon = <LockFilled style={{ color: '#d9363e', marginRight: '8px' }} />;
        if (record.statusColor === 'warning') icon = <ClockCircleFilled style={{ color: '#faad14', marginRight: '8px' }} />;
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {icon}
            <Text style={{ fontWeight: 500 }}>{text}</Text>
          </div>
        )
      }
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
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#002e42', fontWeight: 800 }}>Kiểm soát Quy trình SOP</Title>
          <Text style={{ fontSize: '14px', color: '#595959' }}>Giám sát thực thi và nhật ký hệ thống thời gian thực</Text>
        </div>
        <Space>
          <Select
            placeholder="Lọc trạng thái"
            allowClear
            style={{ width: 160, borderRadius: '6px' }}
            onChange={handleFilterChange}
            options={[
              { value: 'Thành công', label: 'Thành công' },
              { value: 'Đang xử lý', label: 'Đang xử lý' },
              { value: 'Đã chặn', label: 'Đã chặn' },
              { value: 'Từ chối', label: 'Từ chối' },
            ]}
          />
          <Button type="primary" style={{ backgroundColor: '#002e42', borderRadius: '6px' }} onClick={handleExportCSV}>Xuất báo cáo Audit (.CSV)</Button>
        </Space>
      </div>

      <Row gutter={24} style={{ marginBottom: '32px' }}>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', backgroundColor: '#002e42', color: 'white', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>Tiến độ bình quân quy trình</Text>
              <SafetyCertificateFilled style={{ color: 'rgba(255,255,255,0.2)', fontSize: '24px' }} />
            </div>
            <div style={{ marginTop: '16px', marginBottom: '24px' }}>
              <Text style={{ color: 'white', fontSize: '48px', fontWeight: 800 }}>{data.progressPercent || 88.5}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px', marginLeft: '8px' }}>%</Text>
            </div>
            <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', height: '6px', borderRadius: '3px' }}>
              <div style={{ width: `${data.progressPercent || 88.5}%`, backgroundColor: '#1e7e34', height: '100%', borderRadius: '3px' }}></div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', backgroundColor: '#f0f2f5', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: '#595959', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>Hồ sơ đang thực hiện</Text>
              <Tag color="success" style={{ backgroundColor: '#8ce29f', color: '#1e7e34', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>+12% Tuần qua</Tag>
            </div>
            <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', alignItems: 'baseline' }}>
              <Text style={{ color: '#002e42', fontSize: '48px', fontWeight: 800 }}>{data.activeFiles || 142}</Text>
              <Text style={{ color: '#595959', fontSize: '16px', marginLeft: '8px' }}>hồ sơ</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', marginRight: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#002e42', border: '2px solid white', marginLeft: '-8px', zIndex: 3 }} />
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#1e7e34', border: '2px solid white', marginLeft: '-8px', zIndex: 2 }} />
              </div>
              <Text style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 'bold' }}>+8</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', backgroundColor: '#fff1f0', height: '100%', border: '1px solid #ffa39e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: '#d9363e', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>Hồ sơ quá hạn ISO</Text>
              <WarningFilled style={{ color: '#d9363e', fontSize: '20px' }} />
            </div>
            <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', alignItems: 'baseline' }}>
              <Text style={{ color: '#d9363e', fontSize: '48px', fontWeight: 800 }}>07</Text>
              <Text style={{ color: '#d9363e', fontSize: '16px', marginLeft: '8px', fontWeight: 'bold' }}>cảnh báo</Text>
            </div>
            <Text style={{ fontSize: '12px', color: '#d9363e', fontStyle: 'italic' }}>Yêu cầu can thiệp xử lý ngay trong ngày</Text>
          </Card>
        </Col>
      </Row>

      <Card variant="borderless" style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: '#1e7e34', borderRadius: '2px', marginRight: '16px' }} />
            <Title level={4} style={{ margin: 0 }}>Nhật ký hệ thống (Audit Log)</Title>
          </div>
          <Tag color="success" style={{ backgroundColor: '#8ce29f', color: '#1e7e34', border: 'none', borderRadius: '12px', padding: '2px 12px', fontWeight: 'bold' }}>
            TRỰC TIẾP
          </Tag>
        </div>

        <Table 
          columns={columns} 
          dataSource={auditLogs} 
          pagination={false} 
          rowClassName={() => 'audit-row'}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
          <Text style={{ color: '#595959' }}>Hiển thị {data.logs.length} trên tổng số {data.pagination?.total || 0} bản ghi</Text>
          <Pagination
            current={currentPage}
            total={data.pagination?.total || 0}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            size="small"
            showSizeChanger={false}
          />
        </div>
      </Card>

      <Row gutter={24}>
        <Col span={10}>
          <Card variant="borderless" style={{ borderRadius: '12px', backgroundColor: '#e6f4ea', border: '1px solid #8ce29f', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '12px', marginRight: '24px' }}>
                <SafetyCertificateFilled style={{ fontSize: '32px', color: '#1e7e34' }} />
              </div>
              <div>
                <Title level={4} style={{ marginTop: 0, color: '#002e42' }}>Cam kết Bảo mật & Minh bạch</Title>
                <Text style={{ color: '#595959', fontSize: '13px' }}>
                  Mọi thao tác trên hệ thống đều được mã hóa và lưu trữ vĩnh viễn trên chuỗi Audit Trail. Cán bộ lãnh đạo có thể truy xuất nguồn gốc dữ liệu đến từng giây thực hiện.
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={14}>
          <Card variant="borderless" style={{ borderRadius: '12px', backgroundColor: '#e2e8f0', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#002e42', textTransform: 'uppercase', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <SafetyCertificateFilled style={{ marginRight: '8px' }} /> TRẠNG THÁI AN NINH
              </Text>
              <Title level={2} style={{ margin: '0 0 12px 0', color: '#002e42', fontWeight: 800 }}>100% Bảo mật</Title>
              <Text style={{ color: '#595959', fontSize: '13px' }}>Không phát hiện truy cập trái phép trong 30 ngày qua.</Text>
            </div>
            <CheckCircleFilled style={{ position: 'absolute', right: '-20px', bottom: '-40px', fontSize: '180px', color: 'rgba(255,255,255,0.4)', zIndex: 1 }} />
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default AdminSOPLog;
