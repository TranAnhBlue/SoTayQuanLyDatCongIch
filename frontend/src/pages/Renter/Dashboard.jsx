import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Typography, Input, Button, Tag, Steps, List, Space } from 'antd';
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
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const [data, setData] = useState({ contract: null, recentTransactions: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/renter/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Lỗi khi fetch renter dashboard:', error);
      }
    };
    fetchData();
  }, []);

  const contract = data.contract || {
    contractCode: 'YT-2023-00892',
    landAddress: 'Thửa đất số 5691, Tờ bản đồ số C44, Thôn Lại Hoàng, Xã Yên Thường',
    area: 2450,
    duration: '5 Năm',
    startDate: '2023-01-01',
    endDate: '2028-01-01',
    purpose: 'Đất sản xuất nông nghiệp (Trồng lúa)',
    currentDebt: 4500000
  };

  const transactions = data.recentTransactions?.length > 0 ? data.recentTransactions : [];

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
            />
            <Button type="primary" size="large" style={{ backgroundColor: '#1e7e34', borderRadius: '6px' }}>
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
          {/* Active Contract Card */}
          <Card variant="borderless" style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <Tag color="success" style={{ marginBottom: '12px', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>ĐANG THUÊ</Tag>
                <Title level={3} style={{ margin: 0 }}>Hợp đồng: {contract.contractCode}</Title>
                <Text type="secondary"><EnvironmentOutlined /> {contract.landAddress}</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'bold' }}>DIỆN TÍCH</Text>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: 1 }}>{Math.floor(contract.area).toLocaleString('vi-VN')} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>m²</span></div>
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Thời hạn thuê</Text>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{contract.duration}</div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Ngày bắt đầu</Text>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{new Date(contract.startDate).toLocaleDateString('vi-VN')}</div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Ngày kết thúc</Text>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{new Date(contract.endDate).toLocaleDateString('vi-VN')}</div>
              </Col>
              <Col span={6}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Mục đích sử dụng</Text>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{contract.purpose}</div>
              </Col>
            </Row>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1, backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Dư nợ hiện tại</Text>
                <div style={{ color: '#d9363e', fontSize: '24px', fontWeight: 'bold' }}>{contract.currentDebt.toLocaleString('vi-VN')} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>VNĐ</span></div>
              </div>
              <Button type="primary" size="large" style={{ backgroundColor: '#002e42', height: '56px', padding: '0 32px', borderRadius: '8px' }}>
                Thanh toán ngay
              </Button>
              <Button size="large" icon={<FilePdfOutlined />} style={{ height: '56px', padding: '0 24px', borderRadius: '8px' }}>
                Tải hợp đồng (PDF)
              </Button>
            </div>
          </Card>

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
              direction="vertical"
              size="small"
              current={-1}
              style={{ marginTop: '24px' }}
              items={[
                { icon: <QrcodeOutlined />, title: <Text style={{ fontSize: '14px' }}>Quét mã QR qua ứng dụng Ngân hàng (VietQR)</Text> },
                { icon: <BankOutlined />, title: <Text style={{ fontSize: '14px' }}>Chuyển khoản theo số tài khoản chỉ định của Kho bạc Nhà nước</Text> },
                { icon: <HomeOutlined />, title: <Text style={{ fontSize: '14px' }}>Nộp trực tiếp tại Bộ phận Một cửa cấp Huyện/Xã</Text> },
              ]}
            />
            <Button block style={{ marginTop: '16px', borderRadius: '6px' }}>Xem chi tiết hướng dẫn</Button>
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
            <Button block size="large" style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', fontWeight: 'bold' }}>
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
    </div>
  );
};

export default Dashboard;
