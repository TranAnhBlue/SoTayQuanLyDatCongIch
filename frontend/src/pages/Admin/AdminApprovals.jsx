import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Table, Tag, Button, Tabs, Progress, Space, message, Modal, Input, Descriptions } from 'antd';
import { 
  CheckCircleOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  MessageFilled,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminApprovals = () => {
  const [data, setData] = useState({ approvalData: [], stats: { pending: 0, approved: 0, violations: 0 } });
  const [activeTab, setActiveTab] = useState('pending');
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchData = async (tab = activeTab) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/approvals?tab=${tab}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching admin approvals data:', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (record) => {
    try {
      if (record.actionType === 'approve-request') {
        // Approve land request
        const token = localStorage.getItem('token');
        await axios.put(
          `http://localhost:5000/api/admin/land-requests/${record.key}/status`,
          { status: 'Đã phê duyệt', notes: 'Đã phê duyệt bởi Admin' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success(`Đã phê duyệt đơn xin thuê ${record.code}!`);
      } else if (record.actionType === 'create-contract') {
        // Create contract from approved request
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:5000/api/admin/land-requests/${record.key}/create-contract`,
          { 
            annualPrice: 50000, // Default price per m2/year
            startDate: record.startDate,
            additionalTerms: ''
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success(`Đã tạo hợp đồng từ đơn ${record.code}!`);
      } else {
        // Approve contract
        await axios.post(`http://localhost:5000/api/admin/approvals/${record.key}/approve`);
        message.success(`Đã phê duyệt hồ sơ ${record.code}!`);
      }
      fetchData(activeTab);
    } catch (e) {
      message.error('Phê duyệt thất bại.');
    }
  };

  const handleOpenReject = (record) => {
    setSelectedRecord(record);
    setRejectReason('');
    setIsRejectModalVisible(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối.');
      return;
    }
    try {
      if (selectedRecord.actionType === 'approve-request') {
        // Reject land request
        const token = localStorage.getItem('token');
        await axios.put(
          `http://localhost:5000/api/admin/land-requests/${selectedRecord.key}/status`,
          { status: 'Từ chối', rejectionReason: rejectReason, notes: 'Đã từ chối bởi Admin' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Reject contract
        await axios.post(`http://localhost:5000/api/admin/approvals/${selectedRecord.key}/reject`, { reason: rejectReason });
      }
      message.warning(`Đã từ chối hồ sơ ${selectedRecord.code}.`);
      setIsRejectModalVisible(false);
      fetchData(activeTab);
    } catch (e) {
      message.error('Từ chối thất bại.');
    }
  };

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleTabChange = (key) => {
    const tabMap = { '1': 'pending', '2': 'approved', '3': 'violation', '4': 'rejected', '5': 'land-requests' };
    const tab = tabMap[key];
    setActiveTab(tab);
    fetchData(tab);
  };

  const handleApproveAll = async () => {
    const pending = (data.approvalData || []).filter(r => r.actionType !== 'reject');
    if (!pending.length) {
      message.info('Không có hồ sơ nào chờ phê duyệt.');
      return;
    }
    try {
      await Promise.all(pending.map(r =>
        axios.post(`http://localhost:5000/api/admin/approvals/${r.key}/approve`)
      ));
      message.success(`Đã phê duyệt ${pending.length} hồ sơ thành công!`);
      fetchData(activeTab);
    } catch (e) {
      message.error('Phê duyệt hàng loạt thất bại.');
    }
  };

  const approvalData = data.approvalData || [];

  const columns = [
    {
      title: 'THÔNG TIN HỒ SƠ',
      dataIndex: 'info',
      key: 'info',
      render: (_, record) => (
        <div onClick={() => handleOpenDetail(record)} style={{ cursor: 'pointer' }}>
          <Text style={{ fontWeight: 'bold', fontSize: '15px', color: '#1e7e34', display: 'block', textDecoration: 'underline' }}>{record.code}</Text>
          <Text style={{ fontSize: '13px', color: '#595959' }}>{record.name}</Text>
        </div>
      )
    },
    {
      title: 'LOẠI HỒ SƠ',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        let color = '#52c41a';
        let bgColor = '#f6ffed';
        if (record.typeColor === 'warning') { color = '#fa8c16'; bgColor = '#fff7e6'; }
        if (record.typeColor === 'error') { color = '#f5222d'; bgColor = '#fff1f0'; }
        return (
          <Tag color={color} style={{ backgroundColor: bgColor, border: 'none', borderRadius: '12px', padding: '2px 10px', fontWeight: 'bold', fontSize: '11px' }}>
            {text}
          </Tag>
        )
      }
    },
    {
      title: 'VỊ TRÍ & DIỆN TÍCH',
      dataIndex: 'location',
      key: 'location',
      render: (_, record) => (
        <div>
          <Text style={{ fontWeight: 'bold', display: 'block', color: '#262626' }}>{record.location}</Text>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.details}</Text>
        </div>
      )
    },
    {
      title: 'MỨC ĐỘ',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (text, record) => {
        if (record.urgencyColor === 'error') {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ExclamationCircleOutlined style={{ color: '#d9363e', marginRight: '4px', fontSize: '16px' }} />
              <Text style={{ color: '#d9363e', fontWeight: 'bold', fontSize: '13px' }}>{text}</Text>
            </div>
          )
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8c8c8c', marginRight: '8px' }} />
            <Text style={{ color: '#595959', fontSize: '13px' }}>{text}</Text>
          </div>
        )
      }
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {activeTab === 'pending' && (
            <>
              <Button 
                type="primary" 
                size="small"
                style={{ backgroundColor: '#1e7e34', borderRadius: '4px', fontWeight: 600 }}
                onClick={() => handleApprove(record)}
              >
                Duyệt
              </Button>
              <Button 
                danger 
                size="small"
                style={{ borderRadius: '4px', fontWeight: 600 }}
                onClick={() => handleOpenReject(record)}
              >
                Từ chối
              </Button>
            </>
          )}
          {activeTab === 'land-requests' && (
            <>
              {record.actionType === 'approve-request' && (
                <>
                  <Button 
                    type="primary" 
                    size="small"
                    style={{ backgroundColor: '#1e7e34', borderRadius: '4px', fontWeight: 600 }}
                    onClick={() => handleApprove(record)}
                  >
                    Phê duyệt
                  </Button>
                  <Button 
                    danger 
                    size="small"
                    style={{ borderRadius: '4px', fontWeight: 600 }}
                    onClick={() => handleOpenReject(record)}
                  >
                    Từ chối
                  </Button>
                </>
              )}
              {record.actionType === 'create-contract' && (
                <Button 
                  type="primary" 
                  size="small"
                  style={{ backgroundColor: '#002e42', borderRadius: '4px', fontWeight: 600 }}
                  onClick={() => handleApprove(record)}
                >
                  Tạo hợp đồng
                </Button>
              )}
            </>
          )}
          <Button size="small" onClick={() => handleOpenDetail(record)}>Chi tiết</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#002e42', fontWeight: 800 }}>Trung tâm Phê duyệt</Title>
          <Space>
            <CheckCircleOutlined style={{ color: '#1e7e34' }} />
            <Text style={{ fontSize: '14px', color: '#595959' }}>Xin chào Lãnh đạo, hiện có <strong style={{ color: '#262626' }}>{data.stats?.pending || 0} hồ sơ</strong> đang chờ bạn xử lý.</Text>
          </Space>
        </div>
        <Space>
          <Button type="default" icon={<FilterOutlined />} style={{ borderRadius: '6px', backgroundColor: '#e2e8f0', border: 'none', fontWeight: 500, color: '#262626' }}>
            Lọc hồ sơ
          </Button>
          <Button type="primary" icon={<CheckSquareOutlined />} style={{ backgroundColor: '#002e42', borderRadius: '6px', fontWeight: 500 }} onClick={handleApproveAll}>
            Duyệt nhanh tất cả
          </Button>
        </Space>
      </div>

      {/* KPI Cards */}
      <Row gutter={24} style={{ marginBottom: '32px' }}>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', backgroundColor: '#002e42', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>HỒ SƠ CHỜ DUYỆT</Text>
            <Title level={1} style={{ margin: '12px 0', color: 'white', fontWeight: 800, fontSize: '48px', lineHeight: 1 }}>{data.stats?.pending || 0}</Title>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ color: '#8ce29f', fontSize: '12px', fontWeight: 'bold' }}>Cần xử lý ngay</Text>
            </div>
            <FileTextOutlined style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '120px', color: 'rgba(255,255,255,0.05)' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', borderLeft: '4px solid #faad14', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
            <Text style={{ color: '#595959', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>HỢP ĐỒNG ĐÃ DUYỆT</Text>
            <Title level={1} style={{ margin: '12px 0', color: '#002e42', fontWeight: 800, fontSize: '48px', lineHeight: 1 }}>{data.stats?.approved || 0}</Title>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlined style={{ color: '#1e7e34', marginRight: '6px' }} />
              <Text style={{ color: '#1e7e34', fontSize: '12px', fontWeight: 'bold' }}>Hồ sơ đang thuê</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', borderLeft: '4px solid #d9363e', backgroundColor: '#fff1f0', position: 'relative', overflow: 'hidden' }}>
            <Text style={{ color: '#d9363e', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>VI PHẠM ĐẤT ĐAI</Text>
            <Title level={1} style={{ margin: '12px 0', color: '#d9363e', fontWeight: 800, fontSize: '48px', lineHeight: 1 }}>{data.stats?.violations || 0}</Title>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WarningOutlined style={{ color: '#d9363e', marginRight: '6px' }} />
              <Text style={{ color: '#d9363e', fontSize: '12px', fontWeight: 'bold' }}>Hành vi cần xử lý</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }} styles={{ body: { padding: 0 } }}>
        <Tabs 
          activeKey={activeTab === 'pending' ? '1' : activeTab === 'approved' ? '2' : activeTab === 'violation' ? '3' : activeTab === 'rejected' ? '4' : '5'} 
          style={{ padding: '0 24px', paddingTop: '16px' }}
          tabBarStyle={{ marginBottom: 0, borderBottom: '1px solid #f0f0f0' }}
          onChange={handleTabChange}
          items={[
            {
              key: '1',
              label: <span style={{ fontWeight: 'bold', color: activeTab === 'pending' ? '#1e7e34' : '#8c8c8c', fontSize: '14px' }}>Hồ sơ chờ duyệt ({data.stats?.pending || 0})</span>,
            },
            {
              key: '2',
              label: <span style={{ fontWeight: 'bold', color: activeTab === 'approved' ? '#1e7e34' : '#8c8c8c', fontSize: '14px' }}>Đang thực hiện ({data.stats?.approved || 0})</span>,
            },
            {
              key: '3',
              label: <span style={{ fontWeight: 'bold', color: activeTab === 'violation' ? '#1e7e34' : '#8c8c8c', fontSize: '14px' }}>Vi phạm ({data.stats?.violations || 0})</span>,
            },
            {
              key: '4',
              label: <span style={{ fontWeight: 'bold', color: activeTab === 'rejected' ? '#1e7e34' : '#8c8c8c', fontSize: '14px' }}>Đã từ chối ({data.stats?.rejected || 0})</span>,
            },
            {
              key: '5',
              label: <span style={{ fontWeight: 'bold', color: activeTab === 'land-requests' ? '#1e7e34' : '#8c8c8c', fontSize: '14px' }}>Đơn xin thuê ({data.stats?.landRequests || 0})</span>,
            }
          ]}
        />
        
        <Table 
          columns={columns} 
          dataSource={approvalData} 
          pagination={{
            pageSize: 4,
            showTotal: (total, range) => <span style={{ color: '#8c8c8c' }}>Hiển thị {range[1]} trên tổng số {total} hồ sơ chờ duyệt</span>,
            style: { padding: '16px 24px', margin: 0, borderTop: '1px solid #f0f0f0' }
          }} 
        />
      </Card>

      {/* Bottom Cards */}
      <Row gutter={24} style={{ paddingBottom: '32px' }}>
        <Col span={12}>
          <Card variant="borderless" style={{ borderRadius: '12px', height: '100%', backgroundColor: '#f9fafa' }}>
            <Row align="middle">
              <Col span={16}>
                <Title level={4} style={{ margin: '0 0 8px 0', color: '#002e42', fontWeight: 800 }}>Tỉ lệ xử lý đúng hạn</Title>
                <Text style={{ color: '#595959', fontSize: '13px', display: 'block', marginBottom: '24px' }}>Mục tiêu quý II: Đạt 95% hồ sơ xử lý dưới 48h.</Text>
                
                <Progress percent={88} showInfo={false} strokeColor="#1e7e34" trailColor="#e2e8f0" size={['100%', 8]} style={{ marginBottom: '8px' }} />
                <Text style={{ color: '#1e7e34', fontWeight: 'bold', fontSize: '13px' }}>88% Hiện tại</Text>
              </Col>
              <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ border: '4px solid #1e7e34', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
                  <Text style={{ fontSize: '32px', fontWeight: 800, color: '#262626' }}>88%</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless" style={{ borderRadius: '12px', height: '100%', backgroundColor: '#002e42', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <Row align="middle">
              <Col span={18}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', marginRight: '16px' }}>
                    <CalendarOutlined style={{ fontSize: '32px', color: 'white' }} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: '0 0 8px 0', color: 'white', fontWeight: 800 }}>Lịch họp địa chính</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Hôm nay, 14:30 - Phòng họp số 2</Text>
                    <Text style={{ color: '#69c0ff', fontWeight: 'bold', fontSize: '12px' }}>Đang diễn ra sau 2 giờ</Text>
                  </div>
                </div>
              </Col>
            </Row>
            {/* Background design elements */}
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px', paddingRight: '20px' }}>
               <div style={{ height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', width: '100%' }} />
               <div style={{ height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', width: '80%', alignSelf: 'flex-end' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Reject Reason Modal */}
      <Modal
        title="Từ chối hồ sơ"
        open={isRejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={() => setIsRejectModalVisible(false)}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Hồ sơ: </Text>
          <Text>{selectedRecord?.code}</Text>
        </div>
        <Text style={{ display: 'block', marginBottom: '8px' }}>Lý do từ chối:</Text>
        <TextArea 
          rows={4} 
          value={rejectReason} 
          onChange={(e) => setRejectReason(e.target.value)} 
          placeholder="Nhập lý do chi tiết..."
        />
      </Modal>

      {/* Contract Detail Modal */}
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Chi tiết hồ sơ đất đai</Title>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>,
          activeTab === 'pending' && (
            <Button key="approve" type="primary" style={{ backgroundColor: '#1e7e34' }} onClick={() => { handleApprove(selectedRecord); setIsDetailModalVisible(false); }}>
              Phê duyệt ngay
            </Button>
          )
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã hồ sơ" span={2}>{selectedRecord.code}</Descriptions.Item>
            <Descriptions.Item label="Chủ hồ sơ">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="Mã định danh">CCCD: {selectedRecord.renterId || '00109200xxxx'}</Descriptions.Item>
            <Descriptions.Item label="Loại yêu cầu">{selectedRecord.type}</Descriptions.Item>
            <Descriptions.Item label="Mức độ khẩn">{selectedRecord.urgency}</Descriptions.Item>
            <Descriptions.Item label="Vị trí thực địa" span={2}>{selectedRecord.location || selectedRecord.address}</Descriptions.Item>
            <Descriptions.Item label="Diện tích">{selectedRecord.area}</Descriptions.Item>
            <Descriptions.Item label="Ngày ghi nhận">{selectedRecord.date || (selectedRecord.startDate ? new Date(selectedRecord.startDate).toLocaleDateString('vi-VN') : '--')}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái hệ thống" span={2}>
              <Tag color={activeTab === 'pending' ? 'processing' : 'success'}>
                {activeTab === 'pending' ? 'ĐANG CHỜ DUYỆT' : 'ĐÃ PHÊ DUYỆT'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">{selectedRecord.startDate ? new Date(selectedRecord.startDate).toLocaleDateString('vi-VN') : '--'}</Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">{selectedRecord.endDate ? new Date(selectedRecord.endDate).toLocaleDateString('vi-VN') : '--'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Floating Chat Button */}
      <Button 
        type="primary" 
        shape="circle" 
        icon={<MessageFilled style={{ fontSize: '24px' }} />} 
        size="large"
        style={{ 
          position: 'fixed', 
          bottom: '32px', 
          right: '32px', 
          width: '64px', 
          height: '64px', 
          backgroundColor: '#1e7e34',
          boxShadow: '0 8px 24px rgba(30,126,52,0.4)',
          zIndex: 1000
        }} 
      />
    </div>
  );
};

export default AdminApprovals;
