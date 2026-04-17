import { Button, Row, Col, Card, Typography, Space, Input, Form, Collapse, Avatar } from 'antd';
import {
  LoginOutlined,
  UserAddOutlined,
  FileTextOutlined,
  DollarOutlined,
  SafetyOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
  SolutionOutlined,
  UpOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [form] = Form.useForm();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (values) => {
    console.log('Tra cứu:', values);
    // TODO: Implement search functionality
  };

  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Người thuê đất tại Yên Khe',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=52c41a&color=fff',
      content: 'Hệ thống rất tiện lợi, giúp tôi tra cứu và thanh toán tiền thuê đất nhanh chóng. Không cần phải đến trực tiếp cơ quan.'
    },
    {
      name: 'Trần Thị B',
      role: 'Người thuê đất tại Lai Hoang',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=1890ff&color=fff',
      content: 'Quy trình minh bạch, dễ hiểu. Tôi có thể theo dõi tình trạng hợp đồng và công nợ mọi lúc mọi nơi.'
    },
    {
      name: 'Lê Văn C',
      role: 'Người thuê đất tại Dinh',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=722ed1&color=fff',
      content: 'Hỗ trợ thanh toán qua VietQR rất tiện, không cần mang tiền mặt. Hệ thống tự động cập nhật sau khi thanh toán.'
    }
  ];

  const faqs = [
    {
      question: 'Làm thế nào để đăng ký thuê đất?',
      answer: 'Bạn cần đăng ký tài khoản trên hệ thống, sau đó nộp hồ sơ xin thuê đất trực tuyến với đầy đủ giấy tờ theo quy định. Cán bộ địa chính sẽ xem xét và phê duyệt hồ sơ của bạn.'
    },
    {
      question: 'Tôi có thể thanh toán tiền thuê đất như thế nào?',
      answer: 'Hệ thống hỗ trợ thanh toán qua VietQR. Bạn chỉ cần quét mã QR bằng ứng dụng ngân hàng và thanh toán. Hệ thống sẽ tự động cập nhật sau khi nhận được tiền.'
    },
    {
      question: 'Làm sao để tra cứu thông tin hợp đồng?',
      answer: 'Bạn có thể tra cứu bằng cách nhập số điện thoại hoặc mã hợp đồng vào ô tìm kiếm trên trang chủ. Hoặc đăng nhập vào tài khoản để xem chi tiết hợp đồng của mình.'
    },
    {
      question: 'Tôi có thể xem lịch sử giao dịch không?',
      answer: 'Có, sau khi đăng nhập, bạn có thể xem toàn bộ lịch sử giao dịch, bao gồm các khoản thanh toán, công nợ và tình trạng hợp đồng.'
    },
    {
      question: 'Hệ thống có hỗ trợ trên mobile không?',
      answer: 'Có, hệ thống được thiết kế responsive, hoạt động tốt trên mọi thiết bị: máy tính, tablet và điện thoại di động.'
    }
  ];

  const features = [
    {
      icon: <CheckCircleOutlined />,
      title: 'Minh bạch dữ liệu',
      description: 'Hệ thống quản lý dữ liệu đất đai minh bạch, dễ dàng tra cứu và cập nhật thông tin theo thời gian thực.'
    },
    {
      icon: <SafetyOutlined />,
      title: 'Chuẩn hóa quy trình',
      description: 'Áp dụng tiêu chuẩn ISO 9001 để chuẩn hóa quy trình và kiểm soát chất lượng dữ liệu một cách chặt chẽ.'
    },
    {
      icon: <FileTextOutlined />,
      title: 'Bảo mật thông tin',
      description: 'Tuân thủ tiêu chuẩn ISO 27001 để đảm bảo an toàn, bảo mật thông tin và dữ liệu người dùng tuyệt đối.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Đăng ký',
      description: 'Tạo tài khoản và xác thực thông tin cá nhân qua hệ thống một cách nhanh chóng'
    },
    {
      step: '02',
      title: 'Nộp đơn',
      description: 'Nộp hồ sơ xin thuê đất trực tuyến với đầy đủ giấy tờ theo quy định'
    },
    {
      step: '03',
      title: 'Nghiệm thu',
      description: 'Cán bộ địa chính kiểm tra và nghiệm thu hồ sơ theo đúng quy trình'
    },
    {
      step: '04',
      title: 'Ký hợp đồng',
      description: 'Hoàn tất thủ tục và ký kết hợp đồng thuê đất chính thức với cơ quan'
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-container">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="landing-logo">
                <EnvironmentOutlined className="logo-icon" />
                <span className="logo-text">Sổ tay Quản lý Đất</span>
              </div>
            </Col>
            <Col>
              <nav className="landing-nav">
                <a href="#features">Giới thiệu</a>
                <a href="#process">Tính năng</a>
                <a href="#stats">Hướng dẫn</a>
                <a href="#contact">Tra cứu nhanh</a>
                {isAuthenticated ? (
                  <div className="user-menu">
                    <div className="user-info">
                      <div className="user-name">{user?.name || user?.email}</div>
                      <div className="user-role">
                        {user?.role === 'admin' && '👤 Quản trị viên'}
                        {user?.role === 'officer' && '📋 Cán bộ địa chính'}
                        {user?.role === 'renter' && '🏠 Người thuê đất'}
                        {user?.role === 'finance' && '💰 Tài chính'}
                        {user?.role === 'inspector' && '🔍 Thanh tra'}
                      </div>
                    </div>
                    <Button 
                      type="default"
                      onClick={() => {
                        // Điều hướng dựa trên role
                        if (user?.role === 'admin') navigate('/admin/dashboard');
                        else if (user?.role === 'officer') navigate('/officer/dashboard');
                        else if (user?.role === 'renter') navigate('/renter/dashboard');
                        else if (user?.role === 'finance') navigate('/finance/dashboard');
                        else if (user?.role === 'inspector') navigate('/inspector/dashboard');
                        else navigate('/admin/dashboard');
                      }}
                      className="btn-dashboard"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      type="primary"
                      danger
                      onClick={() => {
                        navigate('/login');
                      }}
                      className="btn-logout"
                    >
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="primary" 
                    icon={<LoginOutlined />}
                    onClick={() => navigate('/login')}
                    className="btn-login"
                  >
                    Đăng nhập
                  </Button>
                )}
              </nav>
            </Col>
          </Row>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-overlay"></div>
        <div className="landing-container hero-content">
          <div className="hero-text">
            <Text className="hero-subtitle">ĐẤT VIỆT CORE - NỀN TẢNG BỀN VỮNG</Text>
            <Title level={1} className="hero-title">
              Hệ thống Quản lý<br />
              <span style={{ color: '#52c41a' }}>Đất công ích Quốc gia</span>
            </Title>
            <Paragraph className="hero-description">
              Kiến tạo sự minh bạch và bền vững trong quản lý tài nguyên đất đai.<br />
              Số hóa quy trình, tối ưu hóa hiệu quả khai thác và hỗ trợ người dân<br />
              tiếp cận thông tin công bằng.
            </Paragraph>
            <Space size="large" className="hero-buttons">
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/register')}
                className="btn-hero-primary"
              >
                Tra cứu ngay →
              </Button>
              <Button 
                size="large"
                onClick={() => navigate('/login')}
                className="btn-hero-secondary"
              >
                Xem hướng dẫn
              </Button>
            </Space>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="landing-container">
          <Card className="search-card-main">
            <Row gutter={[48, 32]} align="middle">
              <Col xs={24} md={12}>
                <Title level={3} className="search-title">
                  Tra cứu thông tin<br />
                  thuê đất nhanh
                </Title>
                <Paragraph className="search-description">
                  Nhập mã tra cứu hoặc số điện thoại để tra cứu thông tin thuê đất.<br />
                  Hệ thống sẽ cung cấp thông tin chi tiết về hợp đồng và tình trạng sử dụng đất.
                </Paragraph>
                <div className="search-contact">
                  <PhoneOutlined /> +84 24 3827 1234
                </div>
                <Button type="link" className="search-help-link">
                  Hướng dẫn tra cứu?
                </Button>
              </Col>
              <Col xs={24} md={12}>
                <Form form={form} onFinish={handleSearch} layout="vertical" className="search-form">
                  <Form.Item 
                    name="query" 
                    rules={[{ required: true, message: 'Vui lòng nhập thông tin tra cứu' }]}
                  >
                    <Input 
                      size="large"
                      placeholder="Ví dụ: 0912345678"
                      prefix={<SearchOutlined />}
                      className="search-input"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large" 
                      block
                      className="btn-search-main"
                    >
                      Tra cứu ngay
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-section features-section">
        <div className="landing-container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Giá trị cốt lõi
            </Title>
            <Paragraph className="section-description">
              Hệ thống được thiết kế tuân thủ các tiêu chuẩn ISO 9001 và ISO 27001,<br />
              đảm bảo chất lượng dữ liệu và bảo mật thông tin tuyệt đối.
            </Paragraph>
          </div>
          
          <Row gutter={[48, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <div className="feature-item">
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <div className="feature-content">
                    <Title level={4} className="feature-title">
                      {feature.title}
                    </Title>
                    <Paragraph className="feature-description">
                      {feature.description}
                    </Paragraph>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="landing-section process-section">
        <div className="landing-container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Lộ trình sử dụng hệ thống
            </Title>
            <Paragraph className="section-description">
              Quy trình đơn giản, minh bạch và hiệu quả từ đăng ký đến sử dụng đất
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {steps.map((step, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <div className="process-step">
                  <div className="step-badge">
                    <span className="step-number">{step.step}</span>
                  </div>
                  <Title level={4} className="step-title">
                    {step.title}
                  </Title>
                  <Paragraph className="step-description">
                    {step.description}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section">
        <div className="landing-container">
          <Row gutter={[48, 48]} justify="center">
            <Col xs={24} sm={8}>
              <div className="stat-item">
                <div className="stat-value">12.500+</div>
                <div className="stat-label">Hợp đồng</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="stat-item">
                <div className="stat-value">4.200+</div>
                <div className="stat-label">Người dùng</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="stat-item">
                <div className="stat-value">85.000</div>
                <div className="stat-label">Giao dịch/năm</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="trust-badges-section">
        <div className="landing-container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Tuân thủ tiêu chuẩn quốc tế
            </Title>
            <Paragraph className="section-description">
              Hệ thống được xây dựng và vận hành theo các tiêu chuẩn ISO nghiêm ngặt
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center" align="middle">
            <Col xs={12} sm={6}>
              <div className="trust-badge">
                <SafetyOutlined className="badge-icon" />
                <div className="badge-text">ISO 9001<br />Chuẩn hóa quy trình</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="trust-badge">
                <CheckCircleOutlined className="badge-icon" />
                <div className="badge-text">ISO 27001<br />Bảo mật thông tin</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="trust-badge">
                <FileTextOutlined className="badge-icon" />
                <div className="badge-text">Kiểm soát<br />Chất lượng dữ liệu</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="trust-badge">
                <TeamOutlined className="badge-icon" />
                <div className="badge-text">Hỗ trợ<br />24/7</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              Tham gia hệ thống quản lý đất đai<br />
              minh bạch ngay hôm nay
            </Title>
            <Space size="large" className="cta-buttons">
              <Button 
                type="primary" 
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => navigate('/register')}
                className="btn-cta-primary"
              >
                Đăng ký ngay
              </Button>
              <Button 
                size="large"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
                className="btn-cta-secondary"
              >
                Đăng nhập
              </Button>
            </Space>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="landing-container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Người dùng nói gì về chúng tôi
            </Title>
            <Paragraph className="section-description">
              Những phản hồi tích cực từ người dân đang sử dụng hệ thống
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <div className="testimonial-card">
                  <Avatar 
                    size={64} 
                    src={testimonial.avatar}
                    icon={<UserOutlined />}
                    className="testimonial-avatar"
                  />
                  <Paragraph className="testimonial-content">
                    "{testimonial.content}"
                  </Paragraph>
                  <div className="testimonial-author">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="landing-container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Câu hỏi thường gặp
            </Title>
            <Paragraph className="section-description">
              Giải đáp các thắc mắc phổ biến về hệ thống
            </Paragraph>
          </div>

          <Row justify="center">
            <Col xs={24} lg={16}>
              <Collapse 
                accordion 
                bordered={false}
                className="faq-item"
                expandIconPosition="end"
              >
                {faqs.map((faq, index) => (
                  <Panel header={faq.question} key={index}>
                    <Paragraph style={{ margin: 0, color: '#666' }}>
                      {faq.answer}
                    </Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </Col>
          </Row>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="landing-container">
          <Row gutter={[48, 48]}>
            <Col xs={24} sm={12} lg={8}>
              <div className="footer-brand">
                <EnvironmentOutlined className="footer-icon" />
                <Title level={4} className="footer-title">
                  Sổ tay Quản lý Đất
                </Title>
              </div>
              <Paragraph className="footer-description">
                Hệ thống quản lý đất công ích hiện đại, minh bạch và hiệu quả 
                cho Xã Yên Thường, Huyện Gia Lâm, Hà Nội.
              </Paragraph>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Title level={5} className="footer-heading">
                Liên hệ
              </Title>
              <div className="footer-links">
                <div className="footer-link">
                  <EnvironmentOutlined />
                  <span>Xã Yên Thường, Huyện Gia Lâm, Hà Nội</span>
                </div>
                <div className="footer-link">
                  <PhoneOutlined />
                  <span>(024) 3827 1234</span>
                </div>
                <div className="footer-link">
                  <MailOutlined />
                  <span>info@yenthuong.gov.vn</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Title level={5} className="footer-heading">
                Liên kết nhanh
              </Title>
              <div className="footer-links">
                <div className="footer-link">
                  <GlobalOutlined />
                  <span>Cổng thông tin Huyện Gia Lâm</span>
                </div>
                <div className="footer-link">
                  <GlobalOutlined />
                  <span>Sở Tài nguyên & Môi trường Hà Nội</span>
                </div>
                <div className="footer-link">
                  <GlobalOutlined />
                  <span>Bộ Tài nguyên & Môi trường</span>
                </div>
              </div>
            </Col>
          </Row>
          <div className="footer-bottom">
            <Text className="footer-copyright">
              © 2024 HỆ THỐNG QUẢN LÝ ĐẤT ĐAI - Xã Yên Thường, Huyện Gia Lâm, Hà Nội
            </Text>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <div 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        <UpOutlined />
      </div>
    </div>
  );
};

export default LandingPage;