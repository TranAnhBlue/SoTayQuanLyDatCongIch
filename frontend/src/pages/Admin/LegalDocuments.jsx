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
  Upload, 
  message, 
  Tooltip,
  Popconfirm,
  Typography,
  DatePicker,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const LegalDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    documentType: '',
    status: '',
    issuedBy: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [form] = Form.useForm();

  // Mock data for demonstration
  const mockDocuments = [
    {
      _id: '1',
      documentNumber: 'TT-01/2024-UBND',
      title: 'Thông tư hướng dẫn quản lý đất công ích',
      documentType: 'Thông tư',
      issuedBy: 'UBND Tỉnh',
      issuedDate: '2024-01-15',
      effectiveDate: '2024-02-01',
      status: 'Có hiệu lực',
      description: 'Hướng dẫn quy trình quản lý, sử dụng đất công ích trên địa bàn tỉnh',
      fileUrl: '/documents/tt-01-2024.pdf',
      createdAt: '2024-01-10'
    },
    {
      _id: '2',
      documentNumber: 'NĐ-15/2024-CP',
      title: 'Nghị định về quản lý quỹ đất công',
      documentType: 'Nghị định',
      issuedBy: 'Chính phủ',
      issuedDate: '2024-03-20',
      effectiveDate: '2024-04-01',
      status: 'Có hiệu lực',
      description: 'Quy định chi tiết về quản lý, sử dụng quỹ đất công trên toàn quốc',
      fileUrl: '/documents/nd-15-2024.pdf',
      createdAt: '2024-03-15'
    },
    {
      _id: '3',
      documentNumber: 'QĐ-125/2024-UBND',
      title: 'Quyết định phê duyệt quy hoạch sử dụng đất',
      documentType: 'Quyết định',
      issuedBy: 'UBND Huyện',
      issuedDate: '2024-02-10',
      effectiveDate: '2024-03-01',
      status: 'Có hiệu lực',
      description: 'Phê duyệt quy hoạch sử dụng đất giai đoạn 2024-2030',
      fileUrl: '/documents/qd-125-2024.pdf',
      createdAt: '2024-02-05'
    }
  ];

  // Fetch data
  const fetchDocuments = async (page = 1, pageSize = 10, filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        ...filterParams
      };
      
      const response = await axios.get('http://localhost:5000/api/admin/legal-documents', { params });
      setDocuments(response.data.data);
      setPagination({
        current: response.data.pagination.current,
        pageSize: pageSize,
        total: response.data.pagination.totalRecords
      });
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu văn bản');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle search and filters
  const handleSearch = () => {
    fetchDocuments(1, pagination.pageSize, filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      documentType: '',
      status: '',
      issuedBy: ''
    });
    fetchDocuments();
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    fetchDocuments(paginationInfo.current, paginationInfo.pageSize, filters);
  };

  // Handle create/edit
  const handleCreate = () => {
    setEditingDocument(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDocument(record);
    form.setFieldsValue({
      ...record,
      issuedDate: record.issuedDate ? moment(record.issuedDate) : null,
      effectiveDate: record.effectiveDate ? moment(record.effectiveDate) : null
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingDocument) {
        await axios.put(`http://localhost:5000/api/admin/legal-documents/${editingDocument._id}`, values);
        message.success('Cập nhật văn bản thành công');
      } else {
        await axios.post('http://localhost:5000/api/admin/legal-documents', values);
        message.success('Tạo văn bản thành công');
      }
      setModalVisible(false);
      fetchDocuments(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/legal-documents/${id}`);
      message.success('Xóa văn bản thành công');
      fetchDocuments(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    if (!fileName) return <FileTextOutlined />;
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Số văn bản',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      width: 150,
      render: (text) => <Text strong style={{ color: '#1e7e34' }}>{text}</Text>
    },
    {
      title: 'Tiêu đề văn bản',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: 'Loại văn bản',
      dataIndex: 'documentType',
      key: 'documentType',
      width: 120,
      render: (type) => {
        const colors = {
          'Thông tư': 'blue',
          'Nghị định': 'red',
          'Quyết định': 'green',
          'Công văn': 'orange',
          'Hướng dẫn': 'purple'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      }
    },
    {
      title: 'Cơ quan ban hành',
      dataIndex: 'issuedBy',
      key: 'issuedBy',
      width: 150
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issuedDate',
      key: 'issuedDate',
      width: 120,
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Ngày hiệu lực',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120,
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = {
          'Có hiệu lực': 'success',
          'Hết hiệu lực': 'default',
          'Tạm dừng': 'warning',
          'Đã hủy': 'error'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    },
    {
      title: 'File đính kèm',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      width: 120,
      render: (fileUrl, record) => (
        fileUrl ? (
          <Tooltip title="Tải xuống">
            <Button 
              type="text" 
              icon={getFileIcon(fileUrl)} 
              size="small"
              onClick={() => {
                // Handle file download
                message.info('Tính năng tải xuống đang được phát triển');
              }}
            />
          </Tooltip>
        ) : (
          <Text type="secondary">Không có</Text>
        )
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => {
                // Handle view details
                message.info('Tính năng xem chi tiết đang được phát triển');
              }}
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
          <Tooltip title="Tải xuống">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              size="small"
              onClick={() => {
                message.info('Tính năng tải xuống đang được phát triển');
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa văn bản này?"
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
          <FileTextOutlined style={{ marginRight: '12px' }} />
          Quản lý Văn bản Pháp lý
        </Title>
        <Text type="secondary">Thông tư, Nghị định, Quyết định và các văn bản hướng dẫn</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e7e34' }}>
                {documents.filter(d => d.status === 'Có hiệu lực').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Văn bản có hiệu lực</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {documents.filter(d => d.documentType === 'Thông tư').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Thông tư</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {documents.filter(d => d.documentType === 'Nghị định').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Nghị định</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {documents.filter(d => d.documentType === 'Quyết định').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Quyết định</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input
              placeholder="Tìm kiếm số văn bản, tiêu đề..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Loại văn bản"
              value={filters.documentType}
              onChange={(value) => setFilters({ ...filters, documentType: value })}
              allowClear
            >
              <Option value="Thông tư">Thông tư</Option>
              <Option value="Nghị định">Nghị định</Option>
              <Option value="Quyết định">Quyết định</Option>
              <Option value="Công văn">Công văn</Option>
              <Option value="Hướng dẫn">Hướng dẫn</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
            >
              <Option value="Có hiệu lực">Có hiệu lực</Option>
              <Option value="Hết hiệu lực">Hết hiệu lực</Option>
              <Option value="Tạm dừng">Tạm dừng</Option>
              <Option value="Đã hủy">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Cơ quan ban hành"
              value={filters.issuedBy}
              onChange={(value) => setFilters({ ...filters, issuedBy: value })}
              allowClear
            >
              <Option value="Chính phủ">Chính phủ</Option>
              <Option value="UBND Tỉnh">UBND Tỉnh</Option>
              <Option value="UBND Huyện">UBND Huyện</Option>
              <Option value="Bộ TN&MT">Bộ TN&MT</Option>
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

      {/* Action Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm văn bản mới
        </Button>
        <Space>
          <Button icon={<UploadOutlined />}>
            Import từ Excel
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
          dataSource={documents}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} văn bản`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingDocument ? 'Chỉnh sửa văn bản' : 'Thêm văn bản mới'}
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
                name="documentNumber"
                label="Số văn bản *"
                rules={[{ required: true, message: 'Vui lòng nhập số văn bản' }]}
              >
                <Input placeholder="VD: TT-01/2024-UBND" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="documentType"
                label="Loại văn bản *"
                rules={[{ required: true, message: 'Vui lòng chọn loại văn bản' }]}
              >
                <Select placeholder="Chọn loại văn bản">
                  <Option value="Thông tư">Thông tư</Option>
                  <Option value="Nghị định">Nghị định</Option>
                  <Option value="Quyết định">Quyết định</Option>
                  <Option value="Công văn">Công văn</Option>
                  <Option value="Hướng dẫn">Hướng dẫn</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Tiêu đề văn bản *"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề văn bản" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="issuedBy"
                label="Cơ quan ban hành *"
                rules={[{ required: true, message: 'Vui lòng nhập cơ quan ban hành' }]}
              >
                <Select placeholder="Chọn cơ quan ban hành">
                  <Option value="Chính phủ">Chính phủ</Option>
                  <Option value="UBND Tỉnh">UBND Tỉnh</Option>
                  <Option value="UBND Huyện">UBND Huyện</Option>
                  <Option value="Bộ TN&MT">Bộ TN&MT</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái *"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="Có hiệu lực">Có hiệu lực</Option>
                  <Option value="Hết hiệu lực">Hết hiệu lực</Option>
                  <Option value="Tạm dừng">Tạm dừng</Option>
                  <Option value="Đã hủy">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="issuedDate"
                label="Ngày ban hành *"
                rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="effectiveDate"
                label="Ngày hiệu lực *"
                rules={[{ required: true, message: 'Vui lòng chọn ngày hiệu lực' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả nội dung"
          >
            <TextArea rows={3} placeholder="Nhập mô tả ngắn gọn về nội dung văn bản" />
          </Form.Item>

          <Form.Item
            name="file"
            label="File đính kèm"
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
            <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
              Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX. Tối đa 10MB.
            </div>
          </Form.Item>

          <Divider />

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingDocument ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LegalDocuments;