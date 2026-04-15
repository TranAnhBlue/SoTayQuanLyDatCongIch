import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Tag, Button, Modal, Input, message, Space, Card, Typography, Statistic, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TransactionApproval = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [note, setNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [stats, setStats] = useState({ pending: 0, totalAmount: 0 });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/finance/transactions/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setTransactions(response.data.data);
      
      // Calculate stats
      const pending = response.data.data.length;
      const totalAmount = response.data.data.reduce((sum, t) => sum + t.amount, 0);
      setStats({ pending, totalAmount });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      message.error('Lỗi khi tải danh sách giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async () => {
    if (!selectedTransaction) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/finance/transactions/${selectedTransaction.key}/approve`,
        { note },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      message.success('Đã duyệt giao dịch thành công!');
      setApproveModal(false);
      setNote('');
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error('Error approving transaction:', error);
      message.error(error.response?.data?.message || 'Lỗi khi duyệt giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTransaction || !rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/finance/transactions/${selectedTransaction.key}/reject`,
        { reason: rejectionReason },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      message.success('Đã từ chối giao dịch');
      setRejectModal(false);
      setRejectionReason('');
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      message.error(error.response?.data?.message || 'Lỗi khi từ chối giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'MÃ GIAO DỊCH',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
      render: text => <Text code strong>{text}</Text>
    },
    {
      title: 'NGÀY GIO DỊCH',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.date}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.time}</Text>
        </div>
      )
    },
    {
      title: 'NGƯỜI THUÊ',
      key: 'renter',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.renterName}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.renterPhone}</Text>
        </div>
      )
    },
    {
      title: 'HỢP ĐỒNG',
      dataIndex: 'contractCode',
      key: 'contractCode',
      render: text => <Text code>{text}</Text>
    },
    {
      title: 'SỐ TIỀN',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => (
        <Text strong style={{ color: '#1e7e34', fontSize: '15px' }}>
          {amount.toLocaleString('vi-VN')} VNĐ
        </Text>
      )
    },
    {
      title: 'PHƯƠNG THỨC',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: method => <Tag color="blue">{method}</Tag>
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          {status}
        </Tag>
      )
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            style={{ backgroundColor: '#1e7e34' }}
            onClick={() => {
              setSelectedTransaction(record);
              setApproveModal(true);
            }}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setSelectedTransaction(record);
              setRejectModal(true);
            }}
          >
            Từ chối
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Title level={1} style={{ margin: '8px 0', color: '#002e42' }}>
          Duyệt Giao Dịch Thanh Toán
        </Title>
        <Text type="secondary">Xác nhận các giao dịch thanh toán từ người thuê đất</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={24} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Giao dịch chờ duyệt"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng số tiền chờ duyệt"
              value={stats.totalAmount}
              prefix={<DollarOutlined style={{ color: '#1e7e34' }} />}
              valueStyle={{ color: '#1e7e34' }}
              suffix="VNĐ"
              formatter={value => value.toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
      </Row>

      {/* Transactions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={transactions}
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} giao dịch`
          }}
        />
      </Card>

      {/* Approve Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleOutlined style={{ color: '#1e7e34', marginRight: 8, fontSize: '20px' }} />
            <span>Duyệt giao dịch</span>
          </div>
        }
        open={approveModal}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModal(false);
          setNote('');
          setSelectedTransaction(null);
        }}
        okText="Xác nhận duyệt"
        cancelText="Hủy"
        okButtonProps={{ loading, style: { backgroundColor: '#1e7e34' } }}
      >
        {selectedTransaction && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <div><Text strong>Mã giao dịch:</Text> <Text code>{selectedTransaction.transactionCode}</Text></div>
              <div><Text strong>Người thuê:</Text> {selectedTransaction.renterName}</div>
              <div><Text strong>Hợp đồng:</Text> <Text code>{selectedTransaction.contractCode}</Text></div>
              <div><Text strong>Số tiền:</Text> <Text style={{ color: '#1e7e34', fontWeight: 'bold' }}>{selectedTransaction.amount.toLocaleString('vi-VN')} VNĐ</Text></div>
              <div><Text strong>Nợ hiện tại:</Text> {selectedTransaction.currentDebt.toLocaleString('vi-VN')} VNĐ</div>
            </div>
            
            <p style={{ marginBottom: 8 }}>Ghi chú (tùy chọn):</p>
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về giao dịch này..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            
            <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
              <Text style={{ fontSize: '13px', color: '#389e0d' }}>
                ✓ Sau khi duyệt, số tiền <strong>{selectedTransaction.amount.toLocaleString('vi-VN')} VNĐ</strong> sẽ được trừ vào dư nợ của hợp đồng.
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8, fontSize: '20px' }} />
            <span>Từ chối giao dịch</span>
          </div>
        }
        open={rejectModal}
        onOk={handleReject}
        onCancel={() => {
          setRejectModal(false);
          setRejectionReason('');
          setSelectedTransaction(null);
        }}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        okButtonProps={{ loading, danger: true }}
      >
        {selectedTransaction && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#fff7e6', borderRadius: '8px' }}>
              <div><Text strong>Mã giao dịch:</Text> <Text code>{selectedTransaction.transactionCode}</Text></div>
              <div><Text strong>Người thuê:</Text> {selectedTransaction.renterName}</div>
              <div><Text strong>Số tiền:</Text> <Text style={{ fontWeight: 'bold' }}>{selectedTransaction.amount.toLocaleString('vi-VN')} VNĐ</Text></div>
            </div>
            
            <p style={{ marginBottom: 8 }}><Text type="danger">* </Text>Lý do từ chối (bắt buộc):</p>
            <TextArea
              rows={4}
              placeholder="Nhập lý do từ chối giao dịch này..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              status={!rejectionReason.trim() ? 'error' : ''}
            />
            
            <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#fff2e8', borderRadius: '8px', border: '1px solid #ffbb96' }}>
              <Text style={{ fontSize: '13px', color: '#d46b08' }}>
                ⚠️ Giao dịch sẽ bị từ chối và người thuê sẽ nhận được thông báo.
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionApproval;
