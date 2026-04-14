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
  Upload, 
  message, 
  Tooltip,
  Popconfirm,
  Typography,
  Statistic,
  Progress
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const LandParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    landType: '',
    currentStatus: '',
    legalStatus: '',
    village: '',
    canExploit: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingParcel, setEditingParcel] = useState(null);
  const [form] = Form.useForm();

  // Fetch data
  const fetchParcels = async (page = 1, pageSize = 10, filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        ...filterParams
      };
      
      const response = await axios.get('http://localhost:5000/api/admin/land-parcels', { params });
      setParcels(response.data.data);
      setPagination({
        current: response.data.pagination.current,
        pageSize: pageSize,
        total: response.data.pagination.totalRecords
      });
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu thửa đất');
      console.error('Error fetching parcels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/land-parcels/statistics');
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchParcels();
    fetchStatistics();
  }, []);

  // Handle search and filters
  const handleSearch = () => {
    fetchParcels(1, pagination.pageSize, filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      landType: '',
      currentStatus: '',
      legalStatus: '',
      village: '',
      canExploit: ''
    });
    fetchParcels();
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    fetchParcels(paginationInfo.current, paginationInfo.pageSize, filters);
  };

  // Handle create/edit
  const handleCreate = () => {
    setEditingParcel(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingParcel(record);
    form.setFieldsValue({
      ...record,
      'legalDocuments.allocationDecision.date': record.legalDocuments?.allocationDecision?.date ? moment(record.legalDocuments.allocationDecision.date) : null,
      'legalDocuments.handoverRecord.date': record.legalDocuments?.handoverRecord?.date ? moment(record.legalDocuments.handoverRecord.date) : null,
      'legalDocuments.mapExtract.surveyDate': record.legalDocuments?.mapExtract?.surveyDate ? moment(record.legalDocuments.mapExtract.surveyDate) : null
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingParcel) {
        await axios.put(`http://localhost:5000/api/admin/land-parcels/${editingParcel._id}`, values);
        message.success('Cập nhật thửa đất thành công');
      } else {
        await axios.post('http://localhost:5000/api/admin/land-parcels', values);
        message.success('Tạo thửa đất thành công');
      }
      setModalVisible(false);
      fetchParcels(pagination.current, pagination.pageSize, filters);
      fetchStatistics();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/land-parcels/${id}`);
      message.success('Xóa thửa đất thành công');
      fetchParcels(pagination.current, pagination.pageSize, filters);
      fetchStatistics();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Handle approval
  const handleApprove = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/land-parcels/${id}/approve`, {
        approvalStatus: status
      });
      message.success(`${status === 'Đã phê duyệt' ? 'Phê duyệt' : 'Cập nhật trạng thái'} thành công`);
      fetchParcels(pagination.current, pagination.pageSize, filters);
      fetchStatistics();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Mã thửa đất',
      dataIndex: 'parcelCode',
      key: 'parcelCode',
      width: 120,
      render: (text) => <Text strong style={{ color: '#1e7e34' }}>{text}</Text>
    },
    {
      title: 'Vị trí',
      key: 'location',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>Tờ {record.mapSheet}, Thửa {record.parcelNumber}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.village}</Text>
        </div>
      )
    },
    {
      title: 'Diện tích (m²)',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      render: (area) => <Text>{area?.toLocaleString()}</Text>
    },
    {
      title: 'Loại đất',
      dataIndex: 'landType',
      key: 'landType',
      width: 150,
      render: (type) => {
        const colors = {
          'Đất sản xuất nông nghiệp': 'green',
          'Đất nuôi trồng thủy sản': 'blue',
          'Đất công trình công cộng': 'orange',
          'Đất chưa sử dụng': 'default'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      }
    },
    {
      title: 'Hiện trạng',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      width: 150,
      render: (status) => {
        const colors = {
          'Đang cho thuê/giao khoán': 'success',
          'Chưa đưa vào sử dụng': 'default',
          'Sử dụng sai mục đích': 'warning',
          'Bị lấn chiếm, tranh chấp': 'error'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    },
    {
      title: 'Pháp lý',
      key: 'legalStatus',
      width: 120,
      render: (_, record) => {
        const status = record.legalDocuments?.legalStatus;
        const colors = {
          'Đầy đủ – hợp lệ': 'success',
          'Chưa đầy đủ': 'warning',
          'Cần xác minh': 'error'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    },
    {
      title: 'Có thể khai thác',
      dataIndex: 'canExploit',
      key: 'canExploit',
      width: 120,
      render: (canExploit) => (
        canExploit ? 
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} /> : 
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
      )
    },
    {
      title: 'Trạng thái phê duyệt',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 140,
      render: (status) => {
        const colors = {
          'Đã phê duyệt': 'success',
          'Chưa phê duyệt': 'warning',
          'Cần bổ sung': 'error'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
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
              onClick={() => {/* Handle view details */}}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {record.approvalStatus !== 'Đã phê duyệt' && (
            <Tooltip title="Phê duyệt">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                size="small"
                style={{ color: '#52c41a' }}
                onClick={() => handleApprove(record._id, 'Đã phê duyệt')}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thửa đất này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          <EnvironmentOutlined style={{ marginRight: '12px' }} />
          Quản lý Thửa đất
        </Title>
        <Text type="secondary">Sổ tay điện tử quản lý đất công ích</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số thửa đất"
              value={statistics.summary?.totalParcels || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Có thể khai thác"
              value={statistics.summary?.exploitableParcels || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang sử dụng"
              value={statistics.summary?.inUseParcels || 0}
              prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div>
              <Text type="secondary">Tỷ lệ khai thác</Text>
              <div style={{ marginTop: '8px' }}>
                <Text strong style={{ fontSize: '24px' }}>
                  {statistics.summary?.exploitationRate || 0}%
                </Text>
                <Progress 
                  percent={statistics.summary?.exploitationRate || 0} 
                  showInfo={false} 
                  size="small"
                  style={{ marginTop: '8px' }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input
              placeholder="Tìm kiếm mã thửa, tờ bản đồ..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Loại đất"
              value={filters.landType}
              onChange={(value) => setFilters({ ...filters, landType: value })}
              allowClear
            >
              <Option value="Đất sản xuất nông nghiệp">Đất sản xuất nông nghiệp</Option>
              <Option value="Đất nuôi trồng thủy sản">Đất nuôi trồng thủy sản</Option>
              <Option value="Đất công trình công cộng">Đất công trình công cộng</Option>
              <Option value="Đất chưa sử dụng">Đất chưa sử dụng</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Hiện trạng"
              value={filters.currentStatus}
              onChange={(value) => setFilters({ ...filters, currentStatus: value })}
              allowClear
            >
              <Option value="Đang cho thuê/giao khoán">Đang cho thuê/giao khoán</Option>
              <Option value="Chưa đưa vào sử dụng">Chưa đưa vào sử dụng</Option>
              <Option value="Sử dụng sai mục đích">Sử dụng sai mục đích</Option>
              <Option value="Bị lấn chiếm, tranh chấp">Bị lấn chiếm, tranh chấp</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái pháp lý"
              value={filters.legalStatus}
              onChange={(value) => setFilters({ ...filters, legalStatus: value })}
              allowClear
            >
              <Option value="Đầy đủ – hợp lệ">Đầy đủ – hợp lệ</Option>
              <Option value="Chưa đầy đủ">Chưa đầy đủ</Option>
              <Option value="Cần xác minh">Cần xác minh</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select
              placeholder="Có thể khai thác"
              value={filters.canExploit}
              onChange={(value) => setFilters({ ...filters, canExploit: value })}
              allowClear
            >
              <Option value="true">Có</Option>
              <Option value="false">Không</Option>
            </Select>
          </Col>
          <Col span={3}>
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

      {/* Action Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm thửa đất mới
        </Button>
        <Space>
          <Button icon={<UploadOutlined />}>
            Import Excel
          </Button>
          <Button icon={<FileTextOutlined />}>
            Xuất báo cáo
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={parcels}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thửa đất`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingParcel ? 'Chỉnh sửa thửa đất' : 'Thêm thửa đất mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mapSheet"
                label="Tờ bản đồ *"
                rules={[{ required: true, message: 'Vui lòng nhập tờ bản đồ' }]}
              >
                <Input placeholder="Nhập tờ bản đồ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parcelNumber"
                label="Số thửa đất *"
                rules={[{ required: true, message: 'Vui lòng nhập số thửa đất' }]}
              >
                <Input placeholder="Nhập số thửa đất" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="area"
                label="Diện tích (m²) *"
                rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
              >
                <InputNumber
                  placeholder="Nhập diện tích"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="village"
                label="Thôn/Xóm *"
                rules={[{ required: true, message: 'Vui lòng nhập thôn/xóm' }]}
              >
                <Input placeholder="Nhập thôn/xóm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="landType"
                label="Loại đất *"
                rules={[{ required: true, message: 'Vui lòng chọn loại đất' }]}
              >
                <Select placeholder="Chọn loại đất">
                  <Option value="Đất sản xuất nông nghiệp">Đất sản xuất nông nghiệp</Option>
                  <Option value="Đất nuôi trồng thủy sản">Đất nuôi trồng thủy sản</Option>
                  <Option value="Đất công trình công cộng">Đất công trình công cộng</Option>
                  <Option value="Đất chưa sử dụng">Đất chưa sử dụng</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currentStatus"
                label="Hiện trạng sử dụng *"
                rules={[{ required: true, message: 'Vui lòng chọn hiện trạng' }]}
              >
                <Select placeholder="Chọn hiện trạng">
                  <Option value="Đang cho thuê/giao khoán">Đang cho thuê/giao khoán</Option>
                  <Option value="Chưa đưa vào sử dụng">Chưa đưa vào sử dụng</Option>
                  <Option value="Sử dụng sai mục đích">Sử dụng sai mục đích</Option>
                  <Option value="Bị lấn chiếm, tranh chấp">Bị lấn chiếm, tranh chấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingParcel ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LandParcels;