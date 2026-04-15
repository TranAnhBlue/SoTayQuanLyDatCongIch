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
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: null,
    status: ''
  });

  // Fetch data from API
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/renter/contracts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setContracts(response.data.contracts || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu lịch sử hợp đồng');
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Handle view details
  const handleViewDetails = async (contract) => {
    setSelectedContract(contract);
    
    // Fetch transactions for this contract
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/renter/contract/${contract._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Add transactions to the contract object
        setSelectedContract({
          ...contract,
          transactions: response.data.transactions || []
        });
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
    }
    
    setDetailModalVisible(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'ĐANG THUÊ': 'success',
      'HẾT HẠN': 'default',
      'CHỜ DUYỆT': 'processing',
      'ĐÃ TỪ CHỐI': 'error'
    };
    return colors[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'ĐANG THUÊ': <CheckCircleOutlined />,
      'HẾT HẠN': <ClockCircleOutlined />,
      'CHỜ DUYỆT': <HistoryOutlined />,
      'ĐÃ TỪ CHỐI': <ExclamationCircleOutlined />
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
      title: 'Mã giao dịch',
      dataIndex: 'transactionCode',
      key: 'transactionCode'
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount?.toLocaleString()} VNĐ`
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Thành công' ? 'success' : 'warning'}>
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
                {contracts.filter(c => c.status === 'ĐANG THUÊ').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Đang hiệu lực</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {contracts.reduce((sum, c) => sum + (c.area || 0), 0).toLocaleString()}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tổng diện tích (m²)</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                {contracts.reduce((sum, c) => sum + ((c.annualPrice || 0) * (c.area || 0) * (c.term || 0)), 0).toLocaleString()}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tổng giá trị (VNĐ)</div>
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
        {contracts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <HistoryOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#8c8c8c' }}>Chưa có lịch sử hợp đồng</Title>
            <Text type="secondary">Bạn chưa có hợp đồng thuê đất nào.</Text>
          </div>
        ) : (
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
                        Ký ngày: {moment(contract.createdAt || contract.startDate).format('DD/MM/YYYY')}
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
                              {contract.parcelNumber && <Tag color="blue">{contract.parcelNumber}</Tag>}
                              {contract.landLotNumber && <Tag color="blue">Thửa {contract.landLotNumber}</Tag>}
                              <Text>{contract.parcelAddress}</Text>
                            </div>
                          </div>
                          <div>
                            <Text strong>Diện tích:</Text>
                            <Text style={{ marginLeft: '8px' }}>
                              {contract.area?.toLocaleString()} m²
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
                            <Text strong>Giá thuê hàng năm:</Text>
                            <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: 'bold', color: '#1e7e34' }}>
                              <DollarCircleOutlined style={{ marginRight: '4px' }} />
                              {contract.annualPrice?.toLocaleString()} VNĐ/m²
                            </div>
                          </div>
                          <div>
                            <Text strong>Tổng giá trị hợp đồng:</Text>
                            <Text style={{ marginLeft: '8px', color: '#1890ff' }}>
                              {((contract.annualPrice || 0) * (contract.area || 0) * (contract.term || 0)).toLocaleString()} VNĐ
                            </Text>
                          </div>
                          <div>
                            <Text strong>Nợ hiện tại:</Text>
                            <Text style={{ marginLeft: '8px', color: contract.currentDebt > 0 ? '#fa8c16' : '#52c41a' }}>
                              {(contract.currentDebt || 0).toLocaleString()} VNĐ
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>

                  <div style={{ marginTop: '12px' }}>
                    <Text strong>Mục đích sử dụng:</Text>
                    <div style={{ marginTop: '4px', padding: '8px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                      {contract.purpose}
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                      <Text type="secondary">Người thuê: {contract.renterName}</Text>
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
        )}
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
                      {moment(selectedContract.createdAt || selectedContract.startDate).format('DD/MM/YYYY')}
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
                    <Text strong>Người thuê:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {selectedContract.renterName}
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Giá thuê hàng năm:</Text>
                    <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: 'bold', color: '#1e7e34' }}>
                      {selectedContract.annualPrice?.toLocaleString()} VNĐ/m²
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
                    <Text strong>Tờ bản đồ:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {selectedContract.parcelNumber ? (
                        <Tag color="blue" style={{ fontSize: '14px' }}>
                          {selectedContract.parcelNumber}
                        </Tag>
                      ) : 'Chưa có thông tin'}
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Số thửa:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {selectedContract.landLotNumber || 'Chưa có thông tin'}
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Vị trí:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {selectedContract.parcelAddress}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Diện tích:</Text>
                    <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                      {selectedContract.area?.toLocaleString()} m²
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Mục đích sử dụng:</Text>
                    <div style={{ marginTop: '4px' }}>
                      {selectedContract.purpose}
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Tình trạng bàn giao:</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag color={selectedContract.isHandedOver ? 'success' : 'warning'}>
                        {selectedContract.isHandedOver ? 'Đã bàn giao' : 'Chưa bàn giao'}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Payment History */}
            {selectedContract.transactions && selectedContract.transactions.length > 0 && (
              <Card title="Lịch sử Thanh toán" size="small" style={{ marginBottom: '16px' }}>
                <Table
                  columns={paymentColumns}
                  dataSource={selectedContract.transactions}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              </Card>
            )}

            {/* Financial Summary */}
            <Card title="Tóm tắt Tài chính" size="small">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Tổng giá trị hợp đồng</Text>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff', marginTop: '8px' }}>
                      {((selectedContract.annualPrice || 0) * (selectedContract.area || 0) * (selectedContract.term || 0)).toLocaleString()} VNĐ
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Giá thuê hàng năm</Text>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a', marginTop: '8px' }}>
                      {((selectedContract.annualPrice || 0) * (selectedContract.area || 0)).toLocaleString()} VNĐ
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fff7e6', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Nợ hiện tại</Text>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16', marginTop: '8px' }}>
                      {(selectedContract.currentDebt || 0).toLocaleString()} VNĐ
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContractHistory;