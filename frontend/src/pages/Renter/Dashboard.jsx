import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Typography, Input, Button, Tag, Steps, List, Modal, message, InputNumber } from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  FilePdfOutlined, 
  CheckCircleOutlined,
  QrcodeOutlined,
  BankOutlined,
  HomeOutlined,
  PhoneOutlined,
  TransactionOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  CreditCardOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const [data, setData] = useState({ contracts: [], recentTransactions: [] });
  const [searchValue, setSearchValue] = useState('');
  const [paymentGuideVisible, setPaymentGuideVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/renter/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Lỗi khi fetch renter dashboard:', error);
      }
    };
    fetchData();
  }, []);

  const contracts = data?.contracts || [];
  const transactions = data?.recentTransactions || [];

  // Xử lý tìm kiếm hợp đồng
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      message.warning('Vui lòng nhập số CCCD hoặc mã hợp đồng');
      return;
    }
    
    setLoading(true);
    try {
      // Gọi API tìm kiếm hợp đồng
      const response = await axios.get(`http://localhost:5000/api/renter/search?query=${searchValue}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        message.success('Tìm thấy thông tin hợp đồng!');
        // Cập nhật dữ liệu dashboard với kết quả tìm kiếm
        setData(response.data);
      } else {
        message.error('Không tìm thấy thông tin hợp đồng');
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('Lỗi khi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thanh toán
  const handlePayment = (contract) => {
    setSelectedContract(contract);
    const annualAmount = (contract.annualPrice || 50000) * contract.area;
    setPayAmount(annualAmount);
    setPaymentModalVisible(true);
    setShowQR(false);
  };

  const handleShowQR = () => {
    if (!payAmount || payAmount < 1000) {
      message.warning('Vui lòng nhập số tiền thanh toán hợp lệ (tối thiểu 1.000 VNĐ)');
      return;
    }
    setShowQR(true);
  };

  const handleBackToInput = () => {
    setShowQR(false);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/renter/payment', {
        amount: payAmount,
        paymentMethod: 'Chuyển khoản'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      message.success('Đã gửi yêu cầu thanh toán. Vui lòng chờ bộ phận tài chính xác nhận.');
      setPaymentModalVisible(false);
      setShowQR(false);
      // Refresh data
      const response = await axios.get('http://localhost:5000/api/renter/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Thông tin tài khoản ngân hàng
  const bankInfo = {
    bankId: '970422', // MB Bank
    accountNo: '21111122062004',
    accountName: 'KHO BAC NHA NUOC GIA LAM',
    bankName: 'MB Bank - Ngân hàng Quân Đội'
  };

  // Tạo nội dung chuyển khoản
  const transferContent = selectedContract 
    ? `${selectedContract.contractCode} ${new Date().getTime().toString().slice(-6)}`
    : 'THANHTOAN';
  
  // Tạo URL VietQR
  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.jpg?amount=${payAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  // Xử lý tải hợp đồng PDF
  const handleDownloadContract = async (contractCode) => {
    if (!contractCode) {
      message.warning('Không tìm thấy thông tin hợp đồng');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/renter/contract/${contractCode}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });
      
      // Tạo URL để tải file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hop-dong-${contractCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      message.success('Tải hợp đồng thành công!');
    } catch (error) {
      console.error('Download error:', error);
      message.error('Lỗi khi tải hợp đồng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi yêu cầu hỗ trợ
  const handleSupportRequest = () => {
    navigate('/renter/feedback');
  };

  // Hiển thị modal hướng dẫn thanh toán
  const showPaymentGuide = () => {
    if (contracts.length === 0) {
      message.warning('Bạn chưa có hợp đồng thuê đất');
      return;
    }
    setPaymentGuideVisible(true);
  };

  return (
    <div>
      {/* Hero Banner Area */}
      <div style={{ backgroundColor: '#002e42', borderRadius: '12px', padding: '32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '50%', zIndex: 2 }}>
          <Title level={2} style={{ color: 'white', marginTop: 0 }}>
            Tra cứu thông tin<br/>Thửa đất công ích
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>
            Hệ thống minh bạch thông tin thuê đất, nghĩa vụ tài chính và lịch sử thanh toán dành cho cá nhân và tổ chức.
          </Paragraph>
          
          <div style={{ display: 'flex', backgroundColor: 'white', padding: '4px', borderRadius: '8px', maxWidth: '400px' }}>
            <Input 
              prefix={<SearchOutlined style={{ color: '#bfbfbf', margin: '0 8px' }} />} 
              placeholder="Nhập số CCCD hoặc Mã hợp đồng" 
              variant="borderless" 
              style={{ fontSize: '16px' }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button 
              type="primary" 
              size="large" 
              style={{ backgroundColor: '#1e7e34', borderRadius: '6px' }}
              loading={loading}
              onClick={handleSearch}
            >
              Tra cứu ngay
            </Button>
          </div>
          <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '8px', display: 'block' }}>
            * Thông tin của bạn được bảo mật theo quy định pháp luật.
          </Text>
        </div>
        
        {/* Placeholder for map/landscape image */}
        <div style={{ position: 'absolute', right: '32px', top: '24px', width: '40%', height: 'calc(100% - 48px)', borderRadius: '12px', overflow: 'hidden', backgroundImage: 'url("https://images.unsplash.com/photo-1592659762303-90081d37b98f?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
            <Text style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>DỮ LIỆU BẢN ĐỒ ĐỊA CHÍNH</Text>
            <Title level={4} style={{ color: 'white', margin: 0 }}>Xã Yên Thường, Huyện Gia Lâm</Title>
          </div>
        </div>
      </div>

      <Row gutter={24}>
        {/* Left Column */}
        <Col span={16}>
          {/* Active Contracts List */}
          {contracts.length > 0 ? (
            <>
              {contracts.length > 1 && (
                <div style={{ marginBottom: '16px' }}>
                  <Title level={4} style={{ margin: 0, color: '#002e42' }}>
                    Hợp đồng đang hiệu lực ({contracts.length})
                  </Title>
                  <Text type="secondary">Bạn đang có {contracts.length} hợp đồng thuê đất đang hoạt động</Text>
                </div>
              )}
              {contracts.map((contract, index) => (
                <Card 
                  key={contract._id || index} 
                  variant="borderless" 
                  style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <Tag color="success" style={{ marginBottom: '12px', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>
                  {contract?.status || 'ĐANG THUÊ'}
                </Tag>
                <Title level={3} style={{ margin: 0 }}>Hợp đồng: {contract?.contractCode || 'N/A'}</Title>
                <Text type="secondary"><EnvironmentOutlined /> {contract?.parcelAddress || contract?.landAddress || 'N/A'}</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'bold' }}>DIỆN TÍCH</Text>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: 1 }}>
                  {Math.floor(contract?.area || 0).toLocaleString('vi-VN')} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>m²</span>
                </div>
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Thời hạn thuê</Text>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{contract?.term || contract?.duration || 0} năm</div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Ngày bắt đầu</Text>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {contract?.startDate ? new Date(contract.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Ngày kết thúc</Text>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {contract?.endDate ? new Date(contract.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Mục đích sử dụng</Text>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{contract?.purpose || 'N/A'}</div>
              </Col>
            </Row>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1, backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Dư nợ hiện tại</Text>
                <div style={{ color: '#d9363e', fontSize: '24px', fontWeight: 'bold' }}>
                  {(contract.currentDebt || 0).toLocaleString('vi-VN')} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>VNĐ</span>
                </div>
              </div>
              <Button 
                type="primary" 
                size="large" 
                icon={<CreditCardOutlined />}
                style={{ backgroundColor: '#002e42', height: '56px', padding: '0 32px', borderRadius: '8px' }}
                onClick={() => handlePayment(contract)}
              >
                Thanh toán ngay
              </Button>
              <Button 
                size="large" 
                icon={<FilePdfOutlined />} 
                style={{ height: '56px', padding: '0 24px', borderRadius: '8px' }}
                loading={loading}
                onClick={() => handleDownloadContract(contract.contractCode)}
              >
                Tải hợp đồng (PDF)
              </Button>
            </div>
          </Card>
              ))}
            </>
          ) : (
            <Card variant="borderless" style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', padding: '40px' }}>
              <HomeOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Title level={4} style={{ color: '#8c8c8c' }}>Chưa có hợp đồng thuê đất</Title>
              <Text type="secondary">Bạn chưa có hợp đồng thuê đất nào. Vui lòng tạo đơn xin thuê đất để bắt đầu.</Text>
              <div style={{ marginTop: '24px' }}>
                <Button type="primary" size="large" onClick={() => navigate('/renter/create-land-request')}>
                  Tạo đơn xin thuê đất
                </Button>
              </div>
            </Card>
          )}

          {/* Payment History */}
          <Card 
            variant="borderless" 
            title={<><TransactionOutlined style={{ color: '#1e7e34', marginRight: 8 }}/> Lịch sử thanh toán</>}
            extra={<a href="../../renter/finance" style={{ color: '#1e7e34', fontWeight: 'bold' }}>Xem tất cả</a>}
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={transactions}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={<Text type="secondary" style={{ fontSize: '12px' }}>NGÀY GD</Text>} description={<Text style={{ fontWeight: '500' }}>{new Date(item.date).toLocaleDateString('vi-VN')}</Text>} />
                  <List.Item.Meta title={<Text type="secondary" style={{ fontSize: '12px' }}>MÃ GD</Text>} description={<Text style={{ fontWeight: '500' }}>{item.transactionCode}</Text>} />
                  <List.Item.Meta title={<Text type="secondary" style={{ fontSize: '12px' }}>SỐ TIỀN</Text>} description={<Text style={{ fontWeight: 'bold' }}>{item.amount.toLocaleString('vi-VN')} đ</Text>} />
                  <div>
                    {item.status === 'Thành công' && (
                      <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: '12px', border: 'none', backgroundColor: '#e6f4ea', color: '#1e8e3e' }}>
                        {item.status}
                      </Tag>
                    )}
                    {item.status === 'Chờ xử lý' && (
                      <Tag icon={<ClockCircleOutlined />} color="warning" style={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff7e6', color: '#d46b08' }}>
                        {item.status}
                      </Tag>
                    )}
                    {item.status === 'Từ chối' && (
                      <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff1f0', color: '#cf1322' }}>
                        {item.status}
                      </Tag>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Right Column */}
        <Col span={8}>
          {/* Payment Guide */}
          <Card variant="borderless" style={{ borderRadius: '12px', marginBottom: '24px', backgroundColor: '#f4f6f8' }} styles={{ body: { padding: '24px' } }}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center' }}><QuestionCircleOutlined style={{ marginRight: 8 }}/> Hướng dẫn nộp tiền</Title>
            <Steps
              size="small"
              current={-1}
              style={{ marginTop: '24px' }}
              items={[
                { icon: <QrcodeOutlined />, title: <Text style={{ fontSize: '14px' }}>Quét mã QR qua ứng dụng Ngân hàng (VietQR)</Text> },
                { icon: <BankOutlined />, title: <Text style={{ fontSize: '14px' }}>Chuyển khoản theo số tài khoản chỉ định của Kho bạc Nhà nước</Text> },
                { icon: <HomeOutlined />, title: <Text style={{ fontSize: '14px' }}>Nộp trực tiếp tại Bộ phận Một cửa cấp Huyện/Xã</Text> },
              ]}
            />
            <Button 
              block 
              style={{ marginTop: '16px', borderRadius: '6px' }}
              onClick={showPaymentGuide}
            >
              Xem chi tiết hướng dẫn
            </Button>
          </Card>

          {/* Feedback Banner */}
          <div style={{ backgroundColor: '#8a6217', borderRadius: '12px', padding: '24px', color: 'white', marginBottom: '24px' }}>
            <Title level={5} style={{ color: 'white', margin: 0 }}><MessageOutlined /> Phản ánh & Kiến nghị</Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginTop: '8px' }}>
              Bạn có thắc mắc về thông tin thửa đất hoặc số tiền cần nộp? Gửi ý kiến cho chúng tôi ngay.
            </Paragraph>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>ĐƯỜNG DÂY NÓNG</Text>
              <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#f3c754' }}>1900 88 99</Text>
            </div>
            <Button 
              block 
              size="large" 
              style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', fontWeight: 'bold' }}
              onClick={handleSupportRequest}
            >
              Gửi yêu cầu hỗ trợ
            </Button>
          </div>

          {/* Promotion Image Placeholder */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '120px', backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
             <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
               <Text style={{ color: 'white', fontWeight: 'bold', display: 'block' }}>Chính sách ưu đãi thuế đất nông nghiệp 2024</Text>
               <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Xem chi tiết các quy định mới nhất từ Chính phủ</Text>
             </div>
          </div>
        </Col>
      </Row>

      {/* Modal hướng dẫn thanh toán chi tiết */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <QuestionCircleOutlined style={{ color: '#1e7e34', marginRight: 8 }} />
            <span>Hướng dẫn thanh toán chi tiết</span>
          </div>
        }
        open={paymentGuideVisible}
        onCancel={() => setPaymentGuideVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPaymentGuideVisible(false)}>
            Đóng
          </Button>,
          <Button key="payment" type="primary" onClick={() => {
            setPaymentGuideVisible(false);
            if (contracts.length > 0) handlePayment(contracts[0]);
          }} style={{ backgroundColor: '#1e7e34' }}>
            Thanh toán ngay
          </Button>
        ]}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <Title level={5} style={{ color: '#1e7e34' }}>1. Thanh toán qua VietQR</Title>
          <Paragraph>
            • Mở ứng dụng ngân hàng trên điện thoại<br/>
            • Chọn chức năng "Quét mã QR" hoặc "Chuyển khoản QR"<br/>
            • Quét mã QR được cung cấp trong phần thanh toán<br/>
            • Kiểm tra thông tin và xác nhận giao dịch
          </Paragraph>

          <Title level={5} style={{ color: '#1e7e34' }}>2. Chuyển khoản ngân hàng</Title>
          <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <Text strong>Thông tin tài khoản nhận:</Text><br/>
            <Text>Tên tài khoản: KHO BẠC NHÀ NƯỚC GIA LÂM</Text><br/>
            <Text>Số tài khoản: 21111122062004</Text><br/>
            <Text>Ngân hàng: MB Bank - Ngân hàng Quân Đội</Text><br/>
            <Text>Nội dung: {contracts[0]?.contractCode || 'N/A'} - {user?.name || 'N/A'}</Text>
          </div>

          <Title level={5} style={{ color: '#1e7e34' }}>3. Nộp trực tiếp</Title>
          <Paragraph>
            <EnvironmentOutlined style={{ color: '#1e7e34' }} /> <strong>Bộ phận Một cửa UBND Huyện Gia Lâm</strong><br/>
            Địa chỉ: Số 1, Đường Lê Lợi, Thị trấn Trâu Quỳ, Huyện Gia Lâm, Hà Nội<br/>
            Thời gian: 7:30 - 11:30 và 13:30 - 17:00 (Thứ 2 - Thứ 6)<br/>
            Hotline: <PhoneOutlined /> 024.3827.1234
          </Paragraph>

          <div style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: '8px', padding: '12px' }}>
            <Text style={{ color: '#fa8c16', fontWeight: 'bold' }}>
              ⚠️ Lưu ý quan trọng:
            </Text>
            <ul style={{ margin: '8px 0 0 16px', color: '#8c8c8c' }}>
              <li>Vui lòng ghi đúng nội dung chuyển khoản để hệ thống tự động cập nhật</li>
              <li>Sau khi thanh toán, vui lòng chờ 15-30 phút để hệ thống cập nhật</li>
              <li>Nếu có vấn đề, liên hệ hotline: 1900 88 99</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Modal thanh toán với QR */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {showQR && (
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBackToInput}
                style={{ marginRight: 8 }}
              />
            )}
            <span>{showQR ? 'Quét mã QR để thanh toán' : 'Thanh toán tiền thuê đất'}</span>
          </div>
        }
        open={paymentModalVisible}
        onCancel={() => {
          setPaymentModalVisible(false);
          setShowQR(false);
        }}
        footer={
          showQR ? [
            <Button key="back" onClick={handleBackToInput}>
              Quay lại
            </Button>,
            <Button key="confirm" type="primary" onClick={handleConfirmPayment} loading={loading} style={{ backgroundColor: '#1e7e34' }}>
              Đã thanh toán
            </Button>
          ] : [
            <Button key="cancel" onClick={() => setPaymentModalVisible(false)}>
              Hủy
            </Button>,
            <Button key="qr" type="primary" icon={<QrcodeOutlined />} onClick={handleShowQR} style={{ backgroundColor: '#1e7e34' }}>
              Tạo mã QR
            </Button>
          ]
        }
        width={showQR ? 500 : 520}
      >
        {!showQR ? (
          // Bước 1: Nhập số tiền
          <div>
            {selectedContract && (
              <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                <Text strong>Hợp đồng: </Text>
                <Text>{selectedContract.contractCode}</Text>
                <br/>
                <Text strong>Diện tích: </Text>
                <Text>{selectedContract.area?.toLocaleString('vi-VN')} m²</Text>
              </div>
            )}
            <p style={{ marginBottom: 16, fontSize: '15px' }}>Nhập số tiền bạn muốn nộp:</p>
            <InputNumber
              style={{ width: '100%' }}
              min={1000}
              step={1000000}
              value={payAmount}
              onChange={v => setPayAmount(v)}
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={v => v?.replace(/,/g, '')}
              suffix="VNĐ"
              size="large"
            />
            <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
              <Text style={{ fontSize: '13px', color: '#389e0d' }}>
                💡 <strong>Gợi ý:</strong> Số tiền thanh toán hàng năm là {((selectedContract?.annualPrice || 50000) * (selectedContract?.area || 0)).toLocaleString('vi-VN')} VNĐ
              </Text>
            </div>
          </div>
        ) : (
          // Bước 2: Hiển thị QR code
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 8 }}>
                Số tiền: <span style={{ color: '#1e7e34', fontSize: '24px' }}>{payAmount?.toLocaleString('vi-VN')}</span> VNĐ
              </div>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Quét mã QR bằng ứng dụng ngân hàng để thanh toán
              </Text>
            </div>

            {/* QR Code Image */}
            <div style={{ 
              display: 'inline-block', 
              padding: '16px', 
              backgroundColor: '#fff', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: 24
            }}>
              <img 
                src={qrUrl} 
                alt="VietQR Payment" 
                style={{ 
                  width: '280px', 
                  height: '280px',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>

            {/* Thông tin chuyển khoản */}
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'left',
              marginBottom: 16
            }}>
              <div style={{ marginBottom: 12 }}>
                <BankOutlined style={{ marginRight: 8, color: '#1e7e34' }} />
                <Text strong>Thông tin chuyển khoản</Text>
              </div>
              <div style={{ fontSize: '13px', lineHeight: '24px' }}>
                <div><Text type="secondary">Ngân hàng:</Text> <Text strong>{bankInfo.bankName}</Text></div>
                <div><Text type="secondary">Số tài khoản:</Text> <Text strong code>{bankInfo.accountNo}</Text></div>
                <div><Text type="secondary">Tên tài khoản:</Text> <Text strong>{bankInfo.accountName}</Text></div>
                <div><Text type="secondary">Số tiền:</Text> <Text strong style={{ color: '#1e7e34' }}>{payAmount?.toLocaleString('vi-VN')} VNĐ</Text></div>
                <div><Text type="secondary">Nội dung:</Text> <Text strong code>{transferContent}</Text></div>
              </div>
            </div>

            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fff7e6', 
              borderRadius: '8px',
              border: '1px solid #ffd591',
              textAlign: 'left'
            }}>
              <Text style={{ fontSize: '12px', color: '#ad6800' }}>
                ⚠️ <strong>Lưu ý:</strong> Vui lòng ghi đúng nội dung chuyển khoản để hệ thống tự động cập nhật thanh toán. Sau khi chuyển khoản thành công, vui lòng chờ 15-30 phút để hệ thống xử lý.
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
