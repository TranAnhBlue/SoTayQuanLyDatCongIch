import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Tag, Button, Progress, List, Space, Modal, InputNumber, message } from 'antd';
import {
  CheckCircleOutlined,
  ArrowRightOutlined,
  FolderOpenOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  PrinterOutlined,
  ExpandOutlined,
  WalletOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ContractDetail = () => {
  const [contractData, setContractData] = useState(null);
  const [progress, setProgress] = useState({ paymentPercent: 0, totalPaid: 0, remainingDebt: 0, periodsPaid: 0, totalPeriods: 5 });
  const [payModal, setPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [paying, setPaying] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/renter/contract');
      if (response.data.contract) {
        setContractData(response.data.contract);
      }
      if (response.data.paymentProgress) {
        setProgress(response.data.paymentProgress);
        // Pre-fill annual payment amount
        const annualAmount = response.data.contract?.rentAmount * response.data.contract?.area;
        if (annualAmount) setPayAmount(annualAmount);
      }
    } catch (error) {
      console.error('Error fetching contract detail:', error);
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
      message.success('Thanh toán kỳ tiếp theo thành công!');
      setPayModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      message.error('Thanh toán thất bại, vui lòng thử lại.');
    }
    setPaying(false);
  };

  // Fallback data (hiển thị khi API chưa trả về)
  const c = contractData || {
    contractCode: 'YT-2023-00892',
    renterName: 'Lê Văn Hùng',
    parcelAddress: 'Thửa đất số 5691, Tờ bản đồ số C44, Thôn Lại Hoàng, Xã Yên Thường',
    area: 2450,
    purpose: 'Đất sản xuất nông nghiệp (Trồng lúa)',
    term: 5,
    startDate: '2023-01-01',
    endDate: '2028-01-01',
    annualPrice: 45000,
    rentAmount: 45000,
    isHandedOver: true
  };

  const paymentPercent = Math.round(progress.paymentPercent || 0);
  const totalAnnualRent = (c.rentAmount || c.annualPrice) * c.area;

  return (
    <div>
      <Row gutter={24} style={{ marginBottom: '32px', alignItems: 'flex-start' }}>
        <Col span={18}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
            <Tag color="#d4edda" style={{ color: '#155724', fontWeight: 'bold', padding: '4px 12px', borderRadius: '16px', border: 'none', margin: 0 }}>ĐANG HIỆU LỰC</Tag>
            <Text type="secondary" style={{ fontWeight: 500 }}>{c.contractCode}</Text>
          </div>
          <Title level={1} style={{ margin: '0 0 8px 0', color: '#002e42' }}>Chi tiết Hợp đồng Thuê đất</Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            Hệ thống quản lý quỹ đất công ích thuộc cơ quan quản lý nhà nước tỉnh<br />Đất Việt.
          </Text>
        </Col>
        <Col span={6} style={{ textAlign: 'right', paddingTop: '32px' }}>
          <Button type="primary" size="large" icon={<PrinterOutlined />} style={{ backgroundColor: '#002e42', fontWeight: 500, borderRadius: '8px' }}>
            Tải Hợp đồng (.PDF)
          </Button>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* Left Column - Main Details */}
        <Col span={16}>
          {/* Renter Info */}
          <Card variant="borderless" style={{ borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '32px' } }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <Title level={4} style={{ margin: 0 }}>Thông tin đối tượng thuê</Title>
              <CheckCircleOutlined style={{ color: '#1e7e34', fontSize: '24px' }} />
            </div>

            <Row gutter={[24, 32]}>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>HỌ VÀ TÊN NGƯỜI THUÊ</Text>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{c.renterName}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>DIỆN TÍCH THUÊ</Text>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{Math.floor(c.area).toLocaleString('vi-VN')} m²</div>
              </Col>

              <Col span={24}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>MỤC ĐÍCH SỬ DỤNG ĐẤT</Text>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{c.purpose}</div>
              </Col>

              <Col span={12}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>THỜI HẠN THUÊ</Text>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{c.term} Năm <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#8c8c8c', marginLeft: 8 }}>({new Date(c.startDate).toLocaleDateString('vi-VN')} - {new Date(c.endDate).toLocaleDateString('vi-VN')})</span></div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>TÌNH TRẠNG BÀN GIAO</Text>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e7e34' }}>
                  {c.isHandedOver ? 'Đã bàn giao thực địa' : 'Chưa bàn giao'}
                </div>
              </Col>
            </Row>
          </Card>

          {/* Financial Obligation */}
          <Card variant="borderless" style={{ borderRadius: '16px', backgroundColor: '#e2e8f0', padding: '16px' }} styles={{ body: { padding: 0 } }}>
            <Title level={4} style={{ margin: '0 0 24px 16px' }}>Nghĩa vụ tài chính</Title>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>ĐƠN GIÁ THUÊ HẰNG NĂM</Text>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: 1 }}>{(c.rentAmount || c.annualPrice || 45000).toLocaleString('vi-VN')}</div>
                <Text type="secondary" style={{ fontSize: '13px' }}>VNĐ/m²/năm</Text>
              </div>

              <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '32px' }}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>TỔNG TIỀN NỘP HẰNG NĂM</Text>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34', lineHeight: 1 }}>{totalAnnualRent.toLocaleString('vi-VN')}</div>
                <Text style={{ fontSize: '14px', color: '#1e7e34', fontWeight: 500 }}>VNĐ</Text>
              </div>

              <div
                style={{ backgroundColor: '#002e42', width: '56px', height: '56px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setPayModal(true)}
              >
                <ArrowRightOutlined style={{ color: 'white', fontSize: '20px' }} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column - Map, Files, Payment Progress */}
        <Col span={8}>
          {/* Map Preview */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', height: '200px', marginBottom: '24px', backgroundImage: 'url("https://images.unsplash.com/photo-1592659762303-90081d37b98f?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <Button icon={<ExpandOutlined />} style={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', backdropFilter: 'blur(4px)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>VỊ TRÍ LÔ ĐẤT</Text>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{c.parcelAddress?.split(',').slice(-2).join(',').trim()}</Text>
            </div>
          </div>

          {/* Legal Documents */}
          <Card variant="borderless" title={<><FolderOpenOutlined style={{ marginRight: 8 }} /> Hồ sơ pháp lý đính kèm</>} style={{ borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: 'Quyết định giao đất', icon: <FilePdfOutlined style={{ color: '#ff4d4f' }} />, size: 'PDF • 2.4 MB' },
                { title: 'Biên bản bàn giao', icon: <FilePdfOutlined style={{ color: '#ff4d4f' }} />, size: 'PDF • 1.1 MB' },
                { title: 'Sơ đồ trích lục', icon: <FileImageOutlined style={{ color: '#1890ff' }} />, size: 'JPG • 4.8 MB' },
              ]}
              renderItem={item => (
                <List.Item style={{ padding: '8px 0', border: 'none' }}>
                  <div style={{ display: 'flex', width: '100%', backgroundColor: '#f9f9f9', padding: '12px 16px', borderRadius: '8px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', width: '36px', height: '36px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{item.size}</div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a style={{ fontWeight: 'bold', fontSize: '12px', color: '#002e42', letterSpacing: '0.5px' }}>XEM TẤT CẢ 5 TÀI LIỆU</a>
            </div>
          </Card>

          {/* Payment Progress - NOW REAL DATA */}
          <Card variant="borderless" style={{ borderRadius: '16px', backgroundColor: '#002e42', color: 'white' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', display: 'block', marginBottom: '24px' }}>TIẾN ĐỘ THANH TOÁN</Text>

            <Progress
              percent={paymentPercent}
              showInfo={false}
              strokeColor="#1e7e34"
              trailColor="rgba(255,255,255,0.2)"
              size={['100%', 8]}
              style={{ marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <Text style={{ color: '#bce1ec' }}>Đã nộp: {progress.periodsPaid || 0}/{progress.totalPeriods || 5} kỳ</Text>
              <Text style={{ color: '#bce1ec' }}>{paymentPercent}%</Text>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <Text style={{ color: '#bce1ec', fontSize: '12px' }}>
                Còn lại: {(progress.remainingDebt || 0).toLocaleString('vi-VN')} VNĐ
              </Text>
            </div>

            <Button
              block
              size="large"
              icon={<WalletOutlined />}
              style={{ fontWeight: 'bold' }}
              onClick={() => setPayModal(true)}
            >
              THANH TOÁN KỲ TIẾP THEO
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Payment Modal */}
      <Modal
        title="Thanh toán kỳ tiếp theo"
        open={payModal}
        onOk={handlePay}
        onCancel={() => setPayModal(false)}
        okText="Xác nhận thanh toán"
        cancelText="Hủy"
        okButtonProps={{ loading: paying, style: { backgroundColor: '#1e7e34' } }}
      >
        <div style={{ marginBottom: 8 }}>
          <Text strong>Hợp đồng:</Text> {c.contractCode}
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Kỳ tiếp theo:</Text> Năm {(progress.periodsPaid || 0) + 1}/{progress.totalPeriods || 5}
        </div>
        <p>Số tiền thanh toán (VNĐ):</p>
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

export default ContractDetail;
