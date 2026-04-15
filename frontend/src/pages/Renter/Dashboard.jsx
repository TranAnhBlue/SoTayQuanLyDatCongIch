import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Typography, Input, Button, Tag, Steps, List, Modal, message } from 'antd';
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
  CreditCardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const [data, setData] = useState({ contracts: [], recentTransactions: [] });
  const [searchValue, setSearchValue] = useState('');
  const [paymentGuideVisible, setPaymentGuideVisible] = useState(false);
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
  const handlePayment = () => {
    navigate('/renter/finance');
  };

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
                onClick={handlePayment}
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
            extra={<a href="#/renter/finance" style={{ color: '#1e7e34', fontWeight: 'bold' }}>Xem tất cả</a>}
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
                    <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: '12px', border: 'none', backgroundColor: '#e6f4ea', color: '#1e8e3e' }}>
                      {item.status}
                    </Tag>
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
          <Button key="payment" type="primary" onClick={handlePayment} style={{ backgroundColor: '#1e7e34' }}>
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
            <Text>Số tài khoản: 1234567890</Text><br/>
            <Text>Ngân hàng: Vietcombank - Chi nhánh Gia Lâm</Text><br/>
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
    </div>
  );
};

export default Dashboard;
