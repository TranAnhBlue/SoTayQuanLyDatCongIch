import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  Row, 
  Col, 
  Modal, 
  Form, 
  InputNumber, 
  DatePicker, 
  message, 
  Tooltip,
  Typography,
  Statistic,
  Descriptions,
  Timeline,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const LandRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('');
  const [form] = Form.useForm();
  const [contractForm] = Form.useForm();

  // Fetch data
  const fetchRequests = async (page = 1, pageSize = 10, filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        ...filterParams
      };
      
      const response = await axios.get('http://localhost:5000/api/admin/land-requests', { params });
      setRequests(response.data.data);
      setPagination({
        current: response.data.pagination.current,
        pageSize: pageSize,
        total: response.data.pagination.totalRecords
      });
      setStatistics(response.data.statistics);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu đơn xin thuê đất');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle search and filters
  const handleSearch = () => {
    fetchRequests(1, pagination.pageSize, filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: ''
    });
    fetchRequests();
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    fetchRequests(paginationInfo.current, paginationInfo.pageSize, filters);
  };

  // Handle view details
  const handleViewDetails = async (record) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/land-requests/${record._id}`);
      if (response.data.success) {
        setSelectedRequest(response.data.data);
        setDetailModalVisible(true);
      }
    } catch (error) {
      message.error('Lỗi khi tải chi tiết đơn xin thuê đất');
    }
  };

  // Handle status update
  const handleStatusUpdate = (record, type) => {
    setSelectedRequest(record);
    setActionType(type);
    form.resetFields();
    setActionModalVisible(true);
  };

  // Handle create contract
  const handleCreateContract = (record) => {
    setSelectedRequest(record);
    contractForm.resetFields();
    contractForm.setFieldsValue({
      startDate: moment(record.preferredStartDate),
      annualPrice: 50000 // Default price
    });
    setContractModalVisible(true);
  };

  // Submit status update
  const handleSubmitStatusUpdate = async (values) => {
    try {
      const statusMap = {
        'approve': 'Đã phê duyệt',
        'reject': 'Từ chối',
        'request_info': 'Yêu cầu bổ sung',
        'reviewing': 'Đang xem xét'
      };

      const payload = {
        status: statusMap[actionType],
        notes: values.notes,
        rejectionReason: values.rejectionReason
      };

      await axios.put(`http://localhost:5000/api/admin/land-requests/${selectedRequest._id}/status`, payload);
      
      message.success(`Cập nhật trạng thái thành công: ${statusMap[actionType]}`);
      setActionModalVisible(false);
      fetchRequests(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Submit create contract
  const handleSubmitCreateContract = async (values) => {
    try {
      const payload = {
        annualPrice: values.annualPrice,
        startDate: values.startDate.format('YYYY-MM-DD'),
        additionalTerms: values.additionalTerms
      };

      await axios.post(`http://localhost:5000/api/admin/land-requests/${selectedRequest._id}/create-contract`, payload);
      
      message.success('Tạo hợp đồng thành công!');
      setContractModalVisible(false);
      fetchRequests(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    const configs = {
      'Chờ xử lý': { color: 'warning', icon: <ClockCircleOutlined /> },
      'Đang xem xét': { color: 'processing', icon: <ClockCircleOutlined /> },
      'Yêu cầu bổ sung': { color: 'orange', icon: <ExclamationCircleOutlined /> },
      'Đã phê duyệt': { color: 'success', icon: <CheckCircleOutlined /> },
      'Từ chối': { color: 'error', icon: <StopOutlined /> },
      'Đã ký hợp đồng': { color: 'success', icon: <CheckCircleOutlined /> }
    };
    return configs[status] || { color: 'default', icon: <ClockCircleOutlined /> };
  };

  // Table columns
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'requestCode',
      key: 'requestCode',
      width: 120,
      render: (text) => <Text strong style={{ color: '#1e7e34' }}>{text}</Text>
    },
    {
      title: 'Người xin thuê',
      key: 'requester',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.requesterName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.requesterPhone}
          </Text>
        </div>
      )
    },
    {
      title: 'Vị trí mong muốn',
      dataIndex: 'requestedLocation',
      key: 'requestedLocation',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Diện tích (m²)',
      dataIndex: 'requestedArea',
      key: 'requestedArea',
      width: 120,
      render: (area) => area?.toLocaleString()
    },
    {
      title: 'Mục đích',
      dataIndex: 'landUse',
      key: 'landUse',
      width: 150
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {status}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          
          {record.status === 'Chờ xử lý' && (
            <>
              <Tooltip title="Đang xem xét">
                <Button 
                  type="text" 
                  icon={<ClockCircleOutlined />} 
                  size="small"
                  onClick={() => handleStatusUpdate(record, 'reviewing')}
                />
              </Tooltip>
              <Tooltip title="Phê duyệt">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined />} 
                  size="small"
                  style={{ color: '#52c41a' }}
                  onClick={() => handleStatusUpdate(record, 'approve')}
                />
              </Tooltip>
              <Tooltip title="Yêu cầu bổ sung">
                <Button 
                  type="text" 
                  icon={<ExclamationCircleOutlined />} 
                  size="small"
                  style={{ color: '#fa8c16' }}
                  onClick={() => handleStatusUpdate(record, 'request_info')}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  size="small"
                  danger
                  onClick={() => handleStatusUpdate(record, 'reject')}
                />
              </Tooltip>
            </>
          )}

          {record.status === 'Đã phê duyệt' && !record.contractId && (
            <Tooltip title="Tạo hợp đồng">
              <Button 
                type="text" 
                icon={<FileTextOutlined />} 
                size="small"
                style={{ color: '#1e7e34' }}
                onClick={() => handleCreateContract(record)}
              >
                Tạo HĐ
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          <FileTextOutlined style={{ marginRight: '12px' }} />
          Quản lý Đơn xin thuê đất
        </Title>
        <Text type="secondary">Xem xét và phê duyệt các đơn xin thuê đất công ích</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn"
              value={statistics.total || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={statistics.pending || 0}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã phê duyệt"
              value={statistics.approved || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={statistics.rejected || 0}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm mã đơn, tên người xin thuê..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
            >
              <Option value="Chờ xử lý">Chờ xử lý</Option>
              <Option value="Đang xem xét">Đang xem xét</Option>
              <Option value="Yêu cầu bổ sung">Yêu cầu bổ sung</Option>
              <Option value="Đã phê duyệt">Đã phê duyệt</Option>
              <Option value="Từ chối">Từ chối</Option>
              <Option value="Đã ký hợp đồng">Đã ký hợp đồng</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <Button onClick={handleReset}>
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`Chi tiết đơn ${selectedRequest?.requestCode}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={900}
      >
        {selectedRequest && (
          <div>
            {/* Status */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <Tag 
                color={getStatusConfig(selectedRequest.status).color} 
                icon={getStatusConfig(selectedRequest.status).icon}
                style={{ fontSize: '16px', padding: '8px 16px' }}
              >
                {selectedRequest.status}
              </Tag>
            </div>

            {/* Personal Info */}
            <Descriptions title="Thông tin người xin thuê" bordered size="small" column={2}>
              <Descriptions.Item label="Họ tên">{selectedRequest.requesterName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedRequest.requesterPhone}</Descriptions.Item>
              <Descriptions.Item label="CCCD/CMND">{selectedRequest.requesterIdCard}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{selectedRequest.requesterAddress}</Descriptions.Item>
            </Descriptions>

            {/* Land Info */}
            <Descriptions title="Thông tin đất thuê" bordered size="small" column={2} style={{ marginTop: '16px' }}>
              <Descriptions.Item label="Vị trí mong muốn" span={2}>
                {selectedRequest.requestedLocation}
              </Descriptions.Item>
              <Descriptions.Item label="Diện tích">
                {selectedRequest.requestedArea?.toLocaleString()} m²
              </Descriptions.Item>
              <Descriptions.Item label="Thời hạn thuê">
                {selectedRequest.requestedDuration} năm
              </Descriptions.Item>
              <Descriptions.Item label="Mục đích sử dụng">
                {selectedRequest.landUse}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu mong muốn">
                {moment(selectedRequest.preferredStartDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả chi tiết" span={2}>
                {selectedRequest.landUseDetail}
              </Descriptions.Item>
            </Descriptions>

            {/* Financial Info */}
            <Descriptions title="Năng lực tài chính" bordered size="small" column={2} style={{ marginTop: '16px' }}>
              <Descriptions.Item label="Thu nhập hàng tháng">
                {selectedRequest.financialCapacity?.monthlyIncome?.toLocaleString()} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Ngân hàng">
                {selectedRequest.financialCapacity?.bankName}
              </Descriptions.Item>
              <Descriptions.Item label="Số tài khoản" span={2}>
                {selectedRequest.financialCapacity?.bankAccount}
              </Descriptions.Item>
            </Descriptions>

            {/* Experience & Plan */}
            <div style={{ marginTop: '16px' }}>
              <Title level={5}>Kinh nghiệm:</Title>
              <Text>{selectedRequest.experience}</Text>
            </div>

            <div style={{ marginTop: '16px' }}>
              <Title level={5}>Kế hoạch kinh doanh:</Title>
              <Text>{selectedRequest.businessPlan}</Text>
            </div>

            {/* Processing Info */}
            {selectedRequest.reviewedBy && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Thông tin xử lý:</Title>
                <Text>Được xử lý bởi: <strong>{selectedRequest.reviewedBy.name}</strong></Text>
                <br />
                <Text>Thời gian: {moment(selectedRequest.reviewedAt).format('DD/MM/YYYY HH:mm')}</Text>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        title={`${actionType === 'approve' ? 'Phê duyệt' : 
               actionType === 'reject' ? 'Từ chối' : 
               actionType === 'request_info' ? 'Yêu cầu bổ sung' : 'Đang xem xét'} đơn`}
        open={actionModalVisible}
        onCancel={() => setActionModalVisible(false)}
        onOk={() => form.submit()}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} onFinish={handleSubmitStatusUpdate} layout="vertical">
          {actionType === 'reject' && (
            <Form.Item
              name="rejectionReason"
              label="Lý do từ chối *"
              rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
            >
              <TextArea rows={4} placeholder="Nhập lý do từ chối chi tiết" />
            </Form.Item>
          )}
          
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={3} placeholder="Nhập ghi chú (tùy chọn)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Contract Modal */}
      <Modal
        title="Tạo hợp đồng từ đơn được phê duyệt"
        open={contractModalVisible}
        onCancel={() => setContractModalVisible(false)}
        onOk={() => contractForm.submit()}
        okText="Tạo hợp đồng"
        cancelText="Hủy"
        width={600}
      >
        <Form form={contractForm} onFinish={handleSubmitCreateContract} layout="vertical">
          <Form.Item
            name="annualPrice"
            label="Giá thuê hàng năm (VNĐ/m²) *"
            rules={[{ required: true, message: 'Vui lòng nhập giá thuê' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1000}
              placeholder="Nhập giá thuê hàng năm"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Ngày bắt đầu hợp đồng *"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="additionalTerms"
            label="Điều khoản bổ sung"
          >
            <TextArea rows={4} placeholder="Nhập các điều khoản bổ sung (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LandRequestManagement;