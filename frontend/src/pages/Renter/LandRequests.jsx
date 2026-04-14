import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Modal,
  Descriptions,
  Timeline,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;

const LandRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  // Fetch requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/renter/land-requests');
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      message.error('Lỗi khi tải danh sách đơn xin thuê đất');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle view details
  const handleViewDetails = async (record) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/renter/land-requests/${record._id}`);
      if (response.data.success) {
        setSelectedRequest(response.data.request);
        setDetailModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      message.error('Lỗi khi tải chi tiết đơn xin thuê đất');
    }
  };

  // Handle edit (only for requests that need more info)
  const handleEdit = (record) => {
    if (record.status === 'Yêu cầu bổ sung') {
      navigate(`/renter/land-requests/edit/${record._id}`);
    } else {
      message.warning('Chỉ có thể chỉnh sửa đơn có trạng thái "Yêu cầu bổ sung"');
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

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Chờ xử lý').length,
    approved: requests.filter(r => r.status === 'Đã phê duyệt').length,
    rejected: requests.filter(r => r.status === 'Từ chối').length
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => moment(date).format('DD/MM/YYYY')
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
      title: 'Mục đích sử dụng',
      dataIndex: 'landUse',
      key: 'landUse',
      width: 150
    },
    {
      title: 'Thời hạn (năm)',
      dataIndex: 'requestedDuration',
      key: 'requestedDuration',
      width: 100,
      align: 'center'
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetails(record)}
          />
          {record.status === 'Yêu cầu bổ sung' && (
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
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
          Đơn xin thuê đất
        </Title>
        <Text type="secondary">Quản lý các đơn xin thuê đất công ích của bạn</Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã phê duyệt"
              value={stats.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/renter/create-land-request')}
          style={{ backgroundColor: '#1e7e34' }}
        >
          Tạo đơn xin thuê đất mới
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn`
          }}
          scroll={{ x: 1200 }}
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
        width={800}
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

            {/* Basic Info */}
            <Descriptions title="Thông tin cơ bản" bordered size="small" column={2}>
              <Descriptions.Item label="Mã đơn">{selectedRequest.requestCode}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {moment(selectedRequest.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên">{selectedRequest.requesterName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedRequest.requesterPhone}</Descriptions.Item>
              <Descriptions.Item label="CCCD/CMND">{selectedRequest.requesterIdCard}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{selectedRequest.requesterAddress}</Descriptions.Item>
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

            {/* Admin Notes */}
            {selectedRequest.adminNotes && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Ghi chú từ cán bộ xử lý:</Title>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f0f9ff', 
                  borderRadius: '6px',
                  border: '1px solid #d1ecf1' 
                }}>
                  <Text>{selectedRequest.adminNotes}</Text>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {selectedRequest.rejectionReason && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Lý do từ chối:</Title>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#fff2f0', 
                  borderRadius: '6px',
                  border: '1px solid #ffccc7' 
                }}>
                  <Text style={{ color: '#cf1322' }}>{selectedRequest.rejectionReason}</Text>
                </div>
              </div>
            )}

            {/* Documents */}
            {selectedRequest.documents && selectedRequest.documents.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>Tài liệu đính kèm:</Title>
                <ul>
                  {selectedRequest.documents.map((doc, index) => (
                    <li key={index} style={{ padding: '4px 0' }}>
                      <FileTextOutlined style={{ marginRight: '8px', color: '#1e7e34' }} />
                      {doc.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {selectedRequest.reviewedAt && (
              <div style={{ marginTop: '24px' }}>
                <Title level={5}>Lịch sử xử lý:</Title>
                <Timeline
                  items={[
                    {
                      children: `Tạo đơn xin thuê đất - ${moment(selectedRequest.createdAt).format('DD/MM/YYYY HH:mm')}`
                    },
                    selectedRequest.reviewedAt && {
                      children: `${selectedRequest.status} bởi ${selectedRequest.reviewedBy?.name} - ${moment(selectedRequest.reviewedAt).format('DD/MM/YYYY HH:mm')}`
                    }
                  ].filter(Boolean)}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LandRequests;