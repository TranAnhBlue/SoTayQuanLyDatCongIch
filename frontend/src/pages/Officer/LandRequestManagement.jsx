import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, Table, Tag, Button, Space, Typography, Row, Col, 
  Modal, Descriptions, message, Input, Select, Badge, Statistic 
} from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const LandRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewForm, setReviewForm] = useState({ status: '', notes: '', rejectionReason: '' });
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }
      
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      
      const response = await axios.get('http://localhost:5000/api/admin/land-requests', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      
      console.log('Requests loaded:', response.data.data?.length);
      setRequests(response.data.data || []);
      setStats(response.data.statistics || {});
    } catch (error) {
      console.error('Error fetching land requests:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        message.error('Bạn không có quyền truy cập chức năng này');
      } else {
        message.error('Không thể tải danh sách đơn xin thuê đất');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (record) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/admin/land-requests/${record._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedRequest(response.data.data);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error('Error loading request detail:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        message.error('Không thể tải chi tiết đơn xin thuê');
      }
    }
  };

  const handleOpenReview = (record) => {
    setSelectedRequest(record);
    setReviewForm({ status: 'Đang xem xét', notes: '', rejectionReason: '' });
    setIsReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.status) {
      message.warning('Vui lòng chọn trạng thái xử lý');
      return;
    }

    if (reviewForm.status === 'Từ chối' && !reviewForm.rejectionReason) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn');
        return;
      }
      
      await axios.put(
        `http://localhost:5000/api/admin/land-requests/${selectedRequest._id}/status`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      message.success('Cập nhật trạng thái thành công');
      setIsReviewModalVisible(false);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        message.error('Cập nhật thất bại');
      }
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'Chờ xử lý': { color: 'orange', icon: <ClockCircleOutlined /> },
      'Đang xem xét': { color: 'blue', icon: <FileTextOutlined /> },
      'Yêu cầu bổ sung': { color: 'warning', icon: <ExclamationCircleOutlined /> },
      'Đã phê duyệt': { color: 'green', icon: <CheckCircleOutlined /> },
      'Từ chối': { color: 'red', icon: <ExclamationCircleOutlined /> },
      'Đã ký hợp đồng': { color: 'success', icon: <CheckCircleOutlined /> }
    };
    
    const config = statusConfig[status] || { color: 'default', icon: null };
    return (
      <Tag color={config.color} icon={config.icon}>
        {status}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'MÃ ĐƠN',
      dataIndex: 'requestCode',
      key: 'requestCode',
      render: (text) => <Text strong style={{ color: '#1e7e34' }}>{text}</Text>
    },
    {
      title: 'NGƯỜI XIN THUÊ',
      dataIndex: 'requesterName',
      key: 'requesterName',
      render: (text, record) => (
        <div>
          <div><UserOutlined /> {text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.requesterPhone}</Text>
        </div>
      )
    },
    {
      title: 'VỊ TRÍ & DIỆN TÍCH',
      key: 'location',
      render: (_, record) => (
        <div>
          <div><EnvironmentOutlined /> {record.requestedLocation}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.requestedArea.toLocaleString('vi-VN')} m²
          </Text>
        </div>
      )
    },
    {
      title: 'MỤC ĐÍCH SỬ DỤNG',
      dataIndex: 'landUse',
      key: 'landUse',
      render: (text) => <Tag>{text}</Tag>
    },
    {
      title: 'THỜI HẠN',
      dataIndex: 'requestedDuration',
      key: 'requestedDuration',
      render: (text) => (
        <div>
          <CalendarOutlined /> {text} năm
        </div>
      )
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'NGÀY NỘP',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          {(record.status === 'Chờ xử lý' || record.status === 'Đang xem xét') && (
            <Button 
              type="primary"
              size="small" 
              icon={<EditOutlined />}
              style={{ backgroundColor: '#1e7e34' }}
              onClick={() => handleOpenReview(record)}
            >
              Xử lý
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: '0 0 8px 0', color: '#002e42', fontWeight: 800 }}>
          Quản lý Đơn xin thuê đất
        </Title>
        <Text style={{ color: '#595959' }}>
          Xem xét và xử lý các đơn xin thuê đất công ích
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn"
              value={stats.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#002e42' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang xem xét"
              value={stats.reviewing || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã phê duyệt"
              value={stats.approved || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Card style={{ marginBottom: '16px' }}>
        <Space>
          <Text strong>Lọc theo trạng thái:</Text>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="Chờ xử lý">Chờ xử lý</Option>
            <Option value="Đang xem xét">Đang xem xét</Option>
            <Option value="Yêu cầu bổ sung">Yêu cầu bổ sung</Option>
            <Option value="Đã phê duyệt">Đã phê duyệt</Option>
            <Option value="Từ chối">Từ chối</Option>
          </Select>
          <Button onClick={fetchRequests}>Làm mới</Button>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} đơn`
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={<Title level={4}>Chi tiết đơn xin thuê đất</Title>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={900}
      >
        {selectedRequest && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn" span={2}>
                <Text strong>{selectedRequest.requestCode}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Họ tên" span={2}>
                {selectedRequest.requesterName}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại">
                {selectedRequest.requesterPhone}
              </Descriptions.Item>
              
              <Descriptions.Item label="CCCD/CMND">
                {selectedRequest.requesterIdCard}
              </Descriptions.Item>
              
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedRequest.requesterAddress}
              </Descriptions.Item>
              
              <Descriptions.Item label="Vị trí đất xin thuê" span={2}>
                {selectedRequest.requestedLocation}
              </Descriptions.Item>
              
              <Descriptions.Item label="Diện tích">
                {selectedRequest.requestedArea?.toLocaleString('vi-VN')} m²
              </Descriptions.Item>
              
              <Descriptions.Item label="Thời hạn thuê">
                {selectedRequest.requestedDuration} năm
              </Descriptions.Item>
              
              <Descriptions.Item label="Mục đích sử dụng" span={2}>
                {selectedRequest.landUse}
              </Descriptions.Item>
              
              <Descriptions.Item label="Chi tiết mục đích" span={2}>
                {selectedRequest.landUseDetail}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày bắt đầu mong muốn">
                {new Date(selectedRequest.preferredStartDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              
              <Descriptions.Item label="Kinh nghiệm" span={2}>
                {selectedRequest.experience}
              </Descriptions.Item>
              
              <Descriptions.Item label="Kế hoạch kinh doanh" span={2}>
                {selectedRequest.businessPlan}
              </Descriptions.Item>
              
              <Descriptions.Item label="Thu nhập hàng tháng">
                {selectedRequest.financialCapacity?.monthlyIncome?.toLocaleString('vi-VN')} VNĐ
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngân hàng">
                {selectedRequest.financialCapacity?.bankName}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số tài khoản">
                {selectedRequest.financialCapacity?.bankAccount}
              </Descriptions.Item>
              
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedRequest.status)}
              </Descriptions.Item>
              
              {selectedRequest.adminNotes && (
                <Descriptions.Item label="Ghi chú xử lý" span={2}>
                  {selectedRequest.adminNotes}
                </Descriptions.Item>
              )}
              
              {selectedRequest.rejectionReason && (
                <Descriptions.Item label="Lý do từ chối" span={2}>
                  <Text type="danger">{selectedRequest.rejectionReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        title="Xử lý đơn xin thuê đất"
        open={isReviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => setIsReviewModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: '#1e7e34' } }}
      >
        {selectedRequest && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Mã đơn: </Text>
              <Text>{selectedRequest.requestCode}</Text>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Người xin thuê: </Text>
              <Text>{selectedRequest.requesterName}</Text>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                Trạng thái xử lý: <Text type="danger">*</Text>
              </Text>
              <Select
                value={reviewForm.status}
                onChange={(value) => setReviewForm({ ...reviewForm, status: value })}
                style={{ width: '100%' }}
                placeholder="Chọn trạng thái"
              >
                <Option value="Đang xem xét">Đang xem xét</Option>
                <Option value="Yêu cầu bổ sung">Yêu cầu bổ sung hồ sơ</Option>
                <Option value="Đã phê duyệt">Đề xuất phê duyệt</Option>
                <Option value="Từ chối">Từ chối</Option>
              </Select>
            </div>
            
            {reviewForm.status === 'Từ chối' && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  Lý do từ chối: <Text type="danger">*</Text>
                </Text>
                <TextArea
                  rows={3}
                  value={reviewForm.rejectionReason}
                  onChange={(e) => setReviewForm({ ...reviewForm, rejectionReason: e.target.value })}
                  placeholder="Nhập lý do từ chối chi tiết..."
                />
              </div>
            )}
            
            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                Ghi chú xử lý:
              </Text>
              <TextArea
                rows={4}
                value={reviewForm.notes}
                onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                placeholder="Nhập ghi chú về quá trình xử lý..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LandRequestManagement;
