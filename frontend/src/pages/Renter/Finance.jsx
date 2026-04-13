import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Table, Tag, Button, Pagination, Space, Modal, InputNumber, message } from 'antd';
import {
  WalletOutlined,
  ClockCircleOutlined,
  PrinterOutlined,
  FilterOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Finance = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ totalPaid: 0, currentDebt: 0, annualRent: 0 });
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [paying, setPaying] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/renter/finance');
      const { transactions, summary: s } = response.data;
      const formattedData = (transactions || []).map((t, index) => {
        const d = new Date(t.date);
        return {
          key: t._id || index.toString(),
          date: d.toLocaleDateString('vi-VN'),
          time: d.toLocaleTimeString('vi-VN'),
          transactionId: t.transactionCode,
          amount: t.amount.toLocaleString('vi-VN'),
          status: t.status
        };
      });
      setData(formattedData);
      setTotalCount(formattedData.length);
      setSummary({
        totalPaid: (s?.totalPaid || response.data.totalPaid || 0).toLocaleString('vi-VN'),
        currentDebt: (s?.currentDebt || response.data.currentDebt || 0).toLocaleString('vi-VN'),
        annualRent: s?.annualRent || response.data.annualRent || 0,
      });
      if (s?.annualRent) setPayAmount(s.annualRent);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePay = async () => {
    setPaying(true);
    try {
      await axios.post('http://localhost:5000/api/renter/payment', {
        amount: payAmount,
        paymentMethod: 'Chuyển khoản'
      });
      message.success('Thanh toán thành công!');
      setPayModal(false);
      fetchData(); // refresh
    } catch (error) {
      message.error('Thanh toán thất bại, vui lòng thử lại.');
    }
    setPaying(false);
  };

  const columns = [
    {
      title: 'NGÀY GIAO DỊCH',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.time}</Text>
        </div>
      ),
    },
    {
      title: 'MÃ GIAO DỊCH',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: text => <Text code>{text}</Text>,
    },
    {
      title: 'SỐ TIỀN ĐÃ NỘP',
      dataIndex: 'amount',
      key: 'amount',
      render: text => <Text style={{ fontWeight: 'bold' }}>{text} VNĐ</Text>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = status === 'Thành công' ? 'success' : 'warning';
        return (
          <Tag color={color} style={{ borderRadius: '12px', padding: '2px 10px', border: 'none', fontWeight: 500 }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: () => (
        <a style={{ color: '#595959', fontWeight: 500 }}><PrinterOutlined /> Tải biên lai</a>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Text style={{ color: '#595959', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>Hệ thống quản lý tài chính</Text>
        <Title level={1} style={{ margin: '8px 0', color: '#002e42' }}>Lịch sử Thanh toán</Title>
      </div>

      <Row gutter={24} style={{ marginBottom: '32px' }}>
        {/* Total Paid */}
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '16px', backgroundColor: '#002e42', color: 'white', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <WalletOutlined style={{ fontSize: '20px', color: '#bce1ec', marginRight: '8px' }} />
              <Text style={{ color: '#bce1ec', fontSize: '14px' }}>Tổng số tiền đã nộp</Text>
            </div>
            <div style={{ marginTop: '24px' }}>
              <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{summary.totalPaid}</span>
              <span style={{ fontSize: '16px', marginLeft: '8px', color: '#bce1ec' }}>VNĐ</span>
            </div>
          </Card>
        </Col>

        {/* Current Debt */}
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '16px', backgroundColor: '#f0f2f5', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <ClockCircleOutlined style={{ fontSize: '20px', color: '#1e7e34', marginRight: '8px' }} />
              <Text style={{ color: '#595959', fontSize: '14px' }}>Số dư nợ hiện tại</Text>
            </div>
            <div style={{ marginTop: '24px' }}>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#000' }}>{summary.currentDebt}</span>
              <span style={{ fontSize: '16px', marginLeft: '8px', color: '#595959' }}>VNĐ</span>
            </div>
          </Card>
        </Col>

        {/* Next Payment */}
        <Col span={8}>
          <Card variant="borderless" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%)', height: '100%' }}>
            <div style={{ marginBottom: '24px' }}>
              <Text style={{ color: '#262626', fontSize: '14px', fontWeight: 'bold', display: 'block' }}>Kỳ thanh toán tiếp theo</Text>
              <Text style={{ color: '#595959', fontSize: '12px' }}>Hạn chót: 30/11/2024</Text>
            </div>
            <Button type="primary" block size="large" style={{ backgroundColor: '#1e7e34', fontWeight: 'bold', borderRadius: '8px' }} icon={<WalletOutlined />} onClick={() => setPayModal(true)}>
              Thanh toán ngay
            </Button>
          </Card>
        </Col>
      </Row>

      <Card
        variant="borderless"
        title={<><ClockCircleOutlined style={{ marginRight: 8 }} /> Danh sách giao dịch gần đây</>}
        extra={
          <Space>
            <Button icon={<FilterOutlined />} />
            <Button icon={<DownloadOutlined />} />
          </Space>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={loading}
          rowClassName={() => 'transaction-row'}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
          <Text type="secondary">Hiển thị tất cả {totalCount} giao dịch</Text>
          <Pagination defaultCurrent={1} total={totalCount} pageSize={10} showSizeChanger={false} itemRender={(page, type, originalElement) => {
            if (type === 'prev') return <a>Trước</a>;
            if (type === 'next') return <a>Sau</a>;
            return originalElement;
          }} />
        </div>
      </Card>

      {/* Payment Modal */}
      <Modal
        title="Xác nhận thanh toán"
        open={payModal}
        onOk={handlePay}
        onCancel={() => setPayModal(false)}
        okText="Xác nhận thanh toán"
        cancelText="Hủy"
        okButtonProps={{ loading: paying, style: { backgroundColor: '#1e7e34' } }}
      >
        <p style={{ marginBottom: 16 }}>Nhập số tiền bạn muốn nộp (VNĐ):</p>
        <InputNumber
          style={{ width: '100%' }}
          min={1000}
          step={1000000}
          value={payAmount}
          onChange={v => setPayAmount(v)}
          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={v => v.replace(/,/g, '')}
          addonAfter="VNĐ"
          size="large"
        />
      </Modal>
    </div>
  );
};

export default Finance;
