import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Timeline, 
  Tag, 
  Button, 
  Space, 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Avatar, 
  Tooltip,
  Modal,
  Table,
  Input,
  DatePicker,
  message
} from 'antd';
import { 
  CalendarOutlined, 
  FileTextOutlined, 
  DollarCircleOutlined, 
  UserOutlined,
  DownloadOutlined,
  EyeOutlined,
  SearchOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ContractHistory = () => {
  const { user } = useAuth(); // Get current user info
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: null,
    status: ''
  });

  // Mock data for demonstration
  const mockContracts = [
    {
      _id: '1',
      contractCode: 'HD-2024-001',
      landParcel: {
        parcelCode: 'CI-045',
        location: 'Tờ 22, Thửa 89, Thôn Tây Hồ',
        area: 2500
      },
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Đang hiệu lực',
      monthlyRent: 2500000,
      totalPaid: 7500000,
      remainingAmount: 22500000,
      signedDate: '2023-12-15',
      approvedBy: 'Nguyễn Văn An - Chuyên viên',
      notes: 'Hợp đồng thuê đất sản xuất nông nghiệp, trồng lúa 2 vụ/năm',
      paymentHistory: [
        {
          _id: 'p1',
          date: '2024-01-05',
          amount: 2500000,
          period: 'Tháng 1/2024',
          status: 'Đã thanh toán',
          method: 'Chuyển khoản'
        },
        {
          _id: 'p2',
          date: '2024-02-05',
          amount: 2500000,
          period: 'Tháng 2/2024',
          status: 'Đã thanh toán',
          method: 'Tiền mặt'
        },
        {
          _id: 'p3',
          date: '2024-03-05',
          amount: 2500000,
          period: 'Tháng 3/2024',
          status: 'Đã thanh toán',
          method: 'Chuyển khoản'
        }
      ],
      documents: [
        {
          name: 'Hợp đồng thuê đất gốc',
          type: 'PDF',
          uploadDate: '2023-12-15',
          size: '2.5 MB'
        },
        {
          name: 'Biên bản bàn giao',
          type: 'PDF',
          uploadDate: '2024-01-02',
          size: '1.8 MB'
        }
      ]
    },
    {
      _id: '2',
      contractCode: 'HD-2023-078',
      landParcel: {
        parcelCode: 'CI-023',
        location: 'Tờ 8, Thửa 67, Thôn Bắc Hà',
        area: 1800
      },
      startDate: '2023-03-01',
      endDate: '2024-02-29',
      status: 'Đã kết thúc',
      monthlyRent: 1800000,
      totalPaid: 21600000,
      remainingAmount: 0,
      signedDate: '2023-02-20',
      approvedBy: 'Trần Thị Bình - Thanh tra viên',
      notes: 'Hợp đồng thuê đất nuôi trồng thủy sản, ao cá',
      paymentHistory: [
        {
          _id: 'p4',
          date: '2023-03-05',
          amount: 1800000,
          period: 'Tháng 3/2023',
          status: 'Đã thanh toán',
          method: 'Chuyển khoản'
        },
        {
          _id: 'p5',
          date: '2023-04-05',
          amount: 1800000,
          period: 'Tháng 4/2023',
          status: 'Đã thanh toán',
          method: 'Chuyển khoản'
        }
      ],
      documents: [
        {
          name: 'Hợp đồng thuê đất',
          type: 'PDF',
          uploadDate: '2023-02-20',
          size: '2.1 MB'
        },
        {
          name: 'Biên bản thanh lý hợp đồng',
          type: 'PDF',
          uploadDate: '2024-03-01',
          size: '1.5 MB'
        }
      ]
    },
    {
      _id: '3',
      contractCode: 'HD-2022-156',
      landParcel: {
        parcelCode: 'CI-112',
        location: 'Tờ 25, Thửa 203, Thôn Đông Nam',
        area: 3200
      },
      startDate: '2022-06-01',
      endDate: '2023-05-31',
      status: 'Đã chuyển nhượng',
      monthlyRent: 3200000,
      totalPaid: 38400000,
      remainingAmount: 0,
      signedDate: '2022-05-15',
      approvedBy: 'Lê Văn Cường - Kỹ sư',
      notes: 'Hợp đồng đã chuyển nhượng cho HTX Sản xuất Xanh Đông Nam',
      paymentHistory: [
        {
          _id: 'p6',
          date: '2022-06-05',
          amount: 3200000,
          period: 'Tháng 6/2022',
          status: 'Đã thanh toán',
          method: 'Chuyển khoản'
        }
      ],
      documents: [
        {
          name: 'Hợp đồng thuê đất',
          type: 'PDF',
          uploadDate: '2022-05-15',
          size: '2.3 MB'
        },
        {
          name: 'Hợp đồng chuyển nhượng',
          type: 'PDF',
          uploadDate: '2023-04-01',
          size: '1.9 MB'
        }
      ]
    }
  ];

  // Fetch data
  const fetchContracts = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In real implementation, this would be an API call
      setTimeout(() => {
        setContracts(mockContracts);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu lịch sử hợp đồng');
      console.error('Error fetching contracts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Handle view details
  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setDetailModalVisible(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Đang hiệu lực': 'success',
      'Đã kết thúc': 'default',
      'Đã chuyển nhượng': 'processing',
      'Đã hủy': 'error',
      'Tạm dừng': 'warning'
    };
    return colors[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Đang hiệu lực': <CheckCircleOutlined />,
      'Đã kết thúc': <ClockCircleOutlined />,
      'Đã chuyển nhượng': <HistoryOutlined />,
      'Đã hủy': <ExclamationCircleOutlined />,
      'Tạm dừng': <ClockCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  // Payment history columns
  const paymentColumns = [
    {
      title: 'Ngày thanh toán',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Kỳ thanh toán',
      dataIndex: 'period',
      key: 'period'
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount?.toLocaleString()} VNĐ`
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đã thanh toán' ? 'success' : 'warning'}>
          {status}
        </Tag>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          <HistoryOutlined style={{ marginRight: '12px' }} />
          Lịch sử Hợp đồng
        </Title>
        <Text type="secondary">Theo dõi tất cả các hợp đồng thuê đất của bạn</Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e7e34' }}>
                {contracts.length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tổng hợp đồng</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {contracts.filter(c => c.status === 'Đang hiệu lực').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Đang hiệu lực</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {contracts.reduce((sum, c) => sum + c.landParcel.area, 0).toLocaleString()}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tổng diện tích (m²)</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                {contracts.reduce((sum, c) => sum + c.totalPaid, 0).toLocaleString()}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tổng đã thanh toán (VNĐ)</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm mã hợp đồng, mã thửa đất..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Col>
          <Col span={8}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ width: '100%' }}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Timeline */}
      <Card title="Lịch sử Hợp đồng" loading={loading}>
        <Timeline
          items={contracts.map((contract, index) => ({
            dot: getStatusIcon(contract.status),
            color: getStatusColor(contract.status),
            children: (
              <div key={contract._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <Title level={4} style={{ margin: 0, color: '#1e7e34' }}>
                      {contract.contractCode}
                    </Title>
                    <Text type="secondary">
                      Ký ngày: {moment(contract.signedDate).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                  <Tag color={getStatusColor(contract.status)} style={{ fontSize: '13px' }}>
                    {contract.status}
                  </Tag>
                </div>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" style={{ backgroundColor: '#f9f9f9' }}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Text strong>Thửa đất:</Text>
                          <div style={{ marginTop: '4px' }}>
                            <Tag color="blue">{contract.landParcel.parcelCode}</Tag>
                            <Text>{contract.landParcel.location}</Text>
                          </div>
                        </div>
                        <div>
                          <Text strong>Diện tích:</Text>
                          <Text style={{ marginLeft: '8px' }}>
                            {contract.landParcel.area.toLocaleString()} m²
                          </Text>
                        </div>
                        <div>
                          <Text strong>Thời hạn:</Text>
                          <div style={{ marginTop: '4px' }}>
                            <CalendarOutlined style={{ marginRight: '4px' }} />
                            {moment(contract.startDate).format('DD/MM/YYYY')} - {moment(contract.endDate).format('DD/MM/YYYY')}
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" style={{ backgroundColor: '#f0f9ff' }}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Text strong>Tiền thuê hàng tháng:</Text>
                          <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: 'bold', color: '#1e7e34' }}>
                            <DollarCircleOutlined style={{ marginRight: '4px' }} />
                            {contract.monthlyRent.toLocaleString()} VNĐ
                          </div>
                        </div>
                        <div>
                          <Text strong>Đã thanh toán:</Text>
                          <Text style={{ marginLeft: '8px', color: '#52c41a' }}>
                            {contract.totalPaid.toLocaleString()} VNĐ
                          </Text>
                        </div>
                        <div>
                          <Text strong>Còn lại:</Text>
                          <Text style={{ marginLeft: '8px', color: contract.remainingAmount > 0 ? '#fa8c16' : '#52c41a' }}>
                            {contract.remainingAmount.toLocaleString()} VNĐ
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>

                <div style={{ marginTop: '12px' }}>
                  <Text strong>Ghi chú:</Text>
                  <div style={{ marginTop: '4px', padding: '8px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                    {contract.notes}
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                    <Text type="secondary">Phê duyệt bởi: {contract.approvedBy}</Text>
                  </div>
                  <Space>
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      onClick={() => handleViewDetails(contract)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />}
                      onClick={() => message.info('Tính năng tải xuống đang được phát triển')}
                    >
                      Tải hợp đồng
                    </Button>
                  </Space>
                </div>

                {index < contracts.length - 1 && <Divider />}
              </div>
            )
          }))}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`Chi tiết Hợp đồng ${selectedContract?.contractCode}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />}>
            Tải hợp đồng
          </Button>,
          <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={900}
      >
        {selectedContract && (
          <div>
            {/* Contract Info */}
            <Card title="Thông tin Hợp đồng" size="small" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Mã hợp đồng:</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag color="green" style={{ fontSize: '14px' }}>
                        {selectedContract.contractCode}
                      </Tag>
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Ngày ký:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {moment(selectedContract.signedDate).format('DD/MM/YYYY')}
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Thời hạn:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {moment(selectedContract.startDate).format('DD/MM/YYYY')} - {moment(selectedContract.endDate).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Trạng thái:</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag color={getStatusColor(selectedContract.status)} style={{ fontSize: '14px' }}>
                        {selectedContract.status}
                      </Tag>
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Người phê duyệt:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {selectedContract.approvedBy}
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Tiền thuê hàng tháng:</Text>
                    <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: 'bold', color: '#1e7e34' }}>
                      {selectedContract.monthlyRent.toLocaleString()} VNĐ
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Land Parcel Info */}
            <Card title="Thông tin Thửa đất" size="small" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Mã thửa đất:</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag color="blue" style={{ fontSize: '14px' }}>
                        {selectedContract.landParcel.parcelCode}
                      </Tag>
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Vị trí:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {selectedContract.landParcel.location}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Diện tích:</Text>
                    <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                      {selectedContract.landParcel.area.toLocaleString()} m²
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Payment History */}
            <Card title="Lịch sử Thanh toán" size="small" style={{ marginBottom: '16px' }}>
              <Table
                columns={paymentColumns}
                dataSource={selectedContract.paymentHistory}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            </Card>

            {/* Documents */}
            <Card title="Tài liệu đính kèm" size="small">
              <div>
                {selectedContract.documents.map((doc, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < selectedContract.documents.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FileTextOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{doc.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {doc.type} • {doc.size} • {moment(doc.uploadDate).format('DD/MM/YYYY')}
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />} 
                      size="small"
                      onClick={() => message.info('Tính năng tải xuống đang được phát triển')}
                    >
                      Tải xuống
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContractHistory;