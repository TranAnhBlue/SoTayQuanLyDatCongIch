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
  DatePicker, 
  message, 
  Tooltip,
  Typography,
  Timeline,
  Avatar,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined,
  HistoryOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ExportOutlined,
  FilterOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ChangeHistory = () => {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    changeType: '',
    dateRange: null,
    updatedBy: ''
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);

  // Mock data for demonstration
  const mockChanges = [
    {
      _id: '1',
      parcelCode: 'CI-001',
      parcelLocation: 'Tờ 15, Thửa 120, Thôn Đông Hòa',
      changeType: 'Chuyển mục đích sử dụng',
      changeDate: '2024-04-10T08:30:00Z',
      description: 'Chuyển từ đất nông nghiệp sang đất công trình công cộng để xây dựng trường học',
      legalBasis: 'Quyết định số 125/2024/QĐ-UBND ngày 05/04/2024',
      updatedBy: {
        _id: 'user1',
        name: 'Nguyễn Văn An',
        position: 'Chuyên viên Quản lý đất đai'
      },
      oldValue: {
        landType: 'Đất sản xuất nông nghiệp',
        currentStatus: 'Chưa đưa vào sử dụng'
      },
      newValue: {
        landType: 'Đất công trình công cộng',
        currentStatus: 'Đang triển khai dự án'
      }
    },
    {
      _id: '2',
      parcelCode: 'CI-045',
      parcelLocation: 'Tờ 22, Thửa 89, Thôn Tây Hồ',
      changeType: 'Thu hồi đất',
      changeDate: '2024-04-08T14:15:00Z',
      description: 'Thu hồi đất do vi phạm hợp đồng thuê đất, không sử dụng đúng mục đích',
      legalBasis: 'Biên bản vi phạm số 15/2024 và Quyết định thu hồi số 89/2024/QĐ-UBND',
      updatedBy: {
        _id: 'user2',
        name: 'Trần Thị Bình',
        position: 'Thanh tra viên'
      },
      oldValue: {
        currentStatus: 'Đang cho thuê/giao khoán',
        contractId: 'HD-2023-045'
      },
      newValue: {
        currentStatus: 'Chưa đưa vào sử dụng',
        contractId: null
      }
    },
    {
      _id: '3',
      parcelCode: 'CI-078',
      parcelLocation: 'Tờ 18, Thửa 156, Thôn Nam Sơn',
      changeType: 'Điều chỉnh diện tích',
      changeDate: '2024-04-05T10:45:00Z',
      description: 'Điều chỉnh diện tích sau đo đạc lại, phát hiện sai lệch so với hồ sơ gốc',
      legalBasis: 'Biên bản đo đạc số 78/2024 ngày 02/04/2024',
      updatedBy: {
        _id: 'user3',
        name: 'Lê Văn Cường',
        position: 'Kỹ sư Đo đạc'
      },
      oldValue: {
        area: 2500
      },
      newValue: {
        area: 2347
      }
    },
    {
      _id: '4',
      parcelCode: 'CI-023',
      parcelLocation: 'Tờ 8, Thửa 67, Thôn Bắc Hà',
      changeType: 'Phát sinh tranh chấp',
      changeDate: '2024-04-03T16:20:00Z',
      description: 'Phát sinh tranh chấp ranh giới với thửa đất liền kề, tạm dừng khai thác',
      legalBasis: 'Đơn khiếu nại số 234/2024 và Quyết định tạm dừng số 45/2024/QĐ-UBND',
      updatedBy: {
        _id: 'user2',
        name: 'Trần Thị Bình',
        position: 'Thanh tra viên'
      },
      oldValue: {
        currentStatus: 'Đang cho thuê/giao khoán',
        canExploit: true
      },
      newValue: {
        currentStatus: 'Bị lấn chiếm, tranh chấp',
        canExploit: false
      }
    },
    {
      _id: '5',
      parcelCode: 'CI-112',
      parcelLocation: 'Tờ 25, Thửa 203, Thôn Đông Nam',
      changeType: 'Thay đổi đối tượng thuê',
      changeDate: '2024-04-01T09:10:00Z',
      description: 'Chuyển nhượng hợp đồng thuê từ HTX cũ sang HTX mới theo quy định',
      legalBasis: 'Hợp đồng chuyển nhượng số 56/2024 và Quyết định phê duyệt số 78/2024/QĐ-UBND',
      updatedBy: {
        _id: 'user1',
        name: 'Nguyễn Văn An',
        position: 'Chuyên viên Quản lý đất đai'
      },
      oldValue: {
        contractId: 'HD-2023-112',
        renterName: 'HTX Nông nghiệp Đông Nam'
      },
      newValue: {
        contractId: 'HD-2024-112',
        renterName: 'HTX Sản xuất Xanh Đông Nam'
      }
    }
  ];

  // Fetch data
  const fetchChanges = async (page = 1, pageSize = 10, filterParams = {}) => {
    setLoading(true);
    try {
      // For now, use mock data
      // In real implementation, this would be an API call
      setTimeout(() => {
        let filteredData = [...mockChanges];
        
        // Apply filters
        if (filterParams.search) {
          filteredData = filteredData.filter(item => 
            item.parcelCode.toLowerCase().includes(filterParams.search.toLowerCase()) ||
            item.description.toLowerCase().includes(filterParams.search.toLowerCase())
          );
        }
        
        if (filterParams.changeType) {
          filteredData = filteredData.filter(item => item.changeType === filterParams.changeType);
        }
        
        setChanges(filteredData);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: filteredData.length
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu lịch sử biến động');
      console.error('Error fetching changes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChanges();
  }, []);

  // Handle search and filters
  const handleSearch = () => {
    fetchChanges(1, pagination.pageSize, filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      changeType: '',
      dateRange: null,
      updatedBy: ''
    });
    fetchChanges();
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    fetchChanges(paginationInfo.current, paginationInfo.pageSize, filters);
  };

  // Handle view details
  const handleViewDetails = (record) => {
    setSelectedChange(record);
    setDetailModalVisible(true);
  };

  // Get change type color
  const getChangeTypeColor = (type) => {
    const colors = {
      'Chuyển mục đích sử dụng': 'blue',
      'Thu hồi đất': 'red',
      'Điều chỉnh diện tích': 'orange',
      'Thay đổi đối tượng thuê': 'green',
      'Phát sinh tranh chấp': 'volcano',
      'Bị lấn chiếm': 'magenta',
      'Tạm dừng khai thác': 'gold',
      'Xử lý vi phạm': 'purple'
    };
    return colors[type] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'changeDate',
      key: 'changeDate',
      width: 120,
      render: (date) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {moment(date).format('DD/MM/YYYY')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {moment(date).format('HH:mm')}
          </div>
        </div>
      ),
      sorter: (a, b) => moment(a.changeDate).unix() - moment(b.changeDate).unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Mã thửa đất',
      dataIndex: 'parcelCode',
      key: 'parcelCode',
      width: 120,
      render: (text) => <Text strong style={{ color: '#1e7e34' }}>{text}</Text>
    },
    {
      title: 'Vị trí',
      dataIndex: 'parcelLocation',
      key: 'parcelLocation',
      width: 200,
      render: (text) => <Text>{text}</Text>
    },
    {
      title: 'Loại biến động',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 150,
      render: (type) => <Tag color={getChangeTypeColor(type)}>{type}</Tag>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: '280px' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Người thực hiện',
      key: 'updatedBy',
      width: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px' }} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
              {record.updatedBy.name}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {record.updatedBy.position}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          <HistoryOutlined style={{ marginRight: '12px' }} />
          Lịch sử Biến động Đất đai
        </Title>
        <Text type="secondary">Theo dõi và quản lý các thay đổi về thửa đất công ích</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e7e34' }}>
                {changes.length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tổng biến động</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {changes.filter(c => c.changeType === 'Chuyển mục đích sử dụng').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Chuyển mục đích</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {changes.filter(c => c.changeType === 'Thu hồi đất').length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Thu hồi đất</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                {changes.filter(c => c.changeType.includes('tranh chấp') || c.changeType.includes('lấn chiếm')).length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>Tranh chấp/Lấn chiếm</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input
              placeholder="Tìm kiếm mã thửa, mô tả..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={5}>
            <Select
              placeholder="Loại biến động"
              value={filters.changeType}
              onChange={(value) => setFilters({ ...filters, changeType: value })}
              allowClear
            >
              <Option value="Chuyển mục đích sử dụng">Chuyển mục đích sử dụng</Option>
              <Option value="Thu hồi đất">Thu hồi đất</Option>
              <Option value="Điều chỉnh diện tích">Điều chỉnh diện tích</Option>
              <Option value="Thay đổi đối tượng thuê">Thay đổi đối tượng thuê</Option>
              <Option value="Phát sinh tranh chấp">Phát sinh tranh chấp</Option>
              <Option value="Bị lấn chiếm">Bị lấn chiếm</Option>
              <Option value="Tạm dừng khai thác">Tạm dừng khai thác</Option>
              <Option value="Xử lý vi phạm">Xử lý vi phạm</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Người thực hiện"
              value={filters.updatedBy}
              onChange={(value) => setFilters({ ...filters, updatedBy: value })}
              allowClear
            >
              <Option value="user1">Nguyễn Văn An</Option>
              <Option value="user2">Trần Thị Bình</Option>
              <Option value="user3">Lê Văn Cường</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Space>
              <Button type="primary" onClick={handleSearch} icon={<FilterOutlined />}>
                Lọc
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
        <div>
          <Text strong>Hiển thị {changes.length} biến động</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>
            Xuất Excel
          </Button>
          <Button icon={<FileTextOutlined />}>
            Báo cáo tổng hợp
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={changes}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} biến động`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết Biến động"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedChange && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Mã thửa đất:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag color="green" style={{ fontSize: '14px' }}>
                      {selectedChange.parcelCode}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Thời gian biến động:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <CalendarOutlined style={{ marginRight: '8px' }} />
                    {moment(selectedChange.changeDate).format('DD/MM/YYYY HH:mm')}
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Vị trí:</Text>
              <div style={{ marginTop: '4px' }}>{selectedChange.parcelLocation}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Loại biến động:</Text>
              <div style={{ marginTop: '4px' }}>
                <Tag color={getChangeTypeColor(selectedChange.changeType)} style={{ fontSize: '14px' }}>
                  {selectedChange.changeType}
                </Tag>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Mô tả chi tiết:</Text>
              <div style={{ marginTop: '4px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                {selectedChange.description}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Căn cứ pháp lý:</Text>
              <div style={{ marginTop: '4px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #d1ecf1' }}>
                {selectedChange.legalBasis}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Người thực hiện:</Text>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: '12px' }} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{selectedChange.updatedBy.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{selectedChange.updatedBy.position}</div>
                </div>
              </div>
            </div>

            {(selectedChange.oldValue || selectedChange.newValue) && (
              <>
                <Divider />
                <div>
                  <Text strong>Chi tiết thay đổi:</Text>
                  <Row gutter={16} style={{ marginTop: '12px' }}>
                    {selectedChange.oldValue && (
                      <Col span={12}>
                        <Card size="small" title="Trước khi thay đổi" style={{ backgroundColor: '#fff2f0' }}>
                          {Object.entries(selectedChange.oldValue).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '8px' }}>
                              <Text type="secondary">{key}:</Text>
                              <div style={{ fontWeight: 'bold' }}>{value?.toString()}</div>
                            </div>
                          ))}
                        </Card>
                      </Col>
                    )}
                    {selectedChange.newValue && (
                      <Col span={12}>
                        <Card size="small" title="Sau khi thay đổi" style={{ backgroundColor: '#f6ffed' }}>
                          {Object.entries(selectedChange.newValue).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '8px' }}>
                              <Text type="secondary">{key}:</Text>
                              <div style={{ fontWeight: 'bold' }}>{value?.toString()}</div>
                            </div>
                          ))}
                        </Card>
                      </Col>
                    )}
                  </Row>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChangeHistory;