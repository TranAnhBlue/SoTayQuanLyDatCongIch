import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Input, Select, Upload, Button, List, Tag, Space, message } from 'antd';
import { 
  SafetyCertificateOutlined, 
  PushpinOutlined, 
  InboxOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({ topic: 'tranh-chap', contractId: '', title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/renter/feedback');
        if (res.data && res.data.feedbacks) {
           setFeedbacks(res.data.feedbacks);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      message.warning('Vui lòng điền đầy đủ Tiêu đề và Nội dung.');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/renter/feedback', {
         title: formData.title,
         type: formData.topic,
         content: formData.description,
         lurcCode: formData.contractId || 'DV-2023-00892'
      });
      message.success('Gửi phản hồi thành công! Chúng tôi sẽ phản hồi trong 2-3 ngày làm việc.');
      // reload
      const res = await axios.get('http://localhost:5000/api/renter/feedback');
      if (res.data && res.data.feedbacks) {
         setFeedbacks(res.data.feedbacks);
      }
      setFormData({ topic: 'tranh-chap', contractId: '', title: '', description: '' });
    } catch (error) {
      message.error('Gửi phản hồi thất bại, vui lòng thử lại sau.');
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const dummyFeedbacks = feedbacks.length > 0 ? feedbacks.slice(0,3).map(f => ({
      type: f.type,
      typeColor: 'success',
      time: new Date(f.createdAt).toLocaleDateString('vi-VN'),
      title: f.title,
      status: f.status,
      statusIcon: <CheckCircleOutlined />
  })) : [
    { type: 'KIẾN NGHỊ GIÁ THUÊ', typeColor: 'success', time: '2 giờ trước', title: 'Điều chỉnh đơn giá thuê năm 2024 tại khu vực...', status: 'Đang xử lý', statusIcon: <ClockCircleOutlined /> },
    { type: 'BÁO CÁO LẤN CHIẾM', typeColor: 'warning', time: 'Hôm qua', title: 'Phát hiện san lấp trái phép tại ranh giới...', status: 'Đã phản hồi', statusIcon: <CheckCircleOutlined /> }
  ];

  return (
    <div>
      {/* Header Section for Page */}
      <Row gutter={24} style={{ marginBottom: '32px', alignItems: 'center' }}>
        <Col span={16}>
          <Text style={{ color: '#1e7e34', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>TRUNG TÂM TIẾP NHẬN</Text>
          <Title level={1} style={{ margin: '8px 0', color: '#002e42' }}>Gửi Phản hồi &<br/>Kiến nghị</Title>
          <Paragraph type="secondary" style={{ fontSize: '16px', maxWidth: '80%' }}>
            Chúng tôi lắng nghe mọi ý kiến để nâng cao chất lượng dịch vụ quản lý đất đai. Các phản hồi sẽ được phản hồi trong vòng 3 - 5 ngày làm việc.
          </Paragraph>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <div style={{ backgroundColor: '#002e42', borderRadius: '12px', padding: '24px', display: 'inline-flex', alignItems: 'center', color: 'white', textAlign: 'left' }}>
            <SafetyCertificateOutlined style={{ fontSize: '32px', marginRight: '16px', color: '#bce1ec' }} />
            <div>
              <Text style={{ color: '#bce1ec', fontSize: '12px' }}>Trạng thái định danh</Text>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Mức độ 2 - Đã xác thực</div>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={32}>
        {/* Left Column - Form */}
        <Col span={15}>
          <Card variant="borderless" style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '32px' } }}>
            <Title level={4} style={{ marginBottom: '24px' }}>
              <PushpinOutlined style={{ color: '#1e7e34', marginRight: '8px' }} />
              Thông tin phản hồi mới
            </Title>

            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <div style={{ marginBottom: '8px', fontWeight: 500 }}>Loại phản hồi</div>
                <Select value={formData.topic} onChange={v => setFormData({...formData, topic: v})} style={{ width: '100%' }} size="large">
                  <Select.Option value="tranh-chap">Tranh chấp ranh giới</Select.Option>
                  <Select.Option value="gia-thue">Kiến nghị giá thuê</Select.Option>
                  <Select.Option value="khac">Khác</Select.Option>
                </Select>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '8px', fontWeight: 500 }}>Mã số đất (LURC)</div>
                <Input value={formData.contractId} onChange={e => setFormData({...formData, contractId: e.target.value})} placeholder="Ví dụ: LD-102934" size="large" />
              </Col>
            </Row>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Tiêu đề</div>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Tóm tắt ngắn gọn vấn đề của bạn" size="large" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Nội dung chi tiết</div>
              <TextArea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={5} placeholder="Mô tả chi tiết sự việc, thời gian và các bên liên quan..." size="large" />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Tải lên hình ảnh minh chứng</div>
              <Dragger 
                name="file" 
                multiple={true} 
                style={{ backgroundColor: '#f9fafa', borderColor: '#d9d9d9' }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#8c8c8c' }} />
                </p>
                <p className="ant-upload-text">Kéo thả hoặc <span style={{ color: '#1e7e34', fontWeight: 'bold' }}>chọn tệp</span> để tải lên</p>
                <p className="ant-upload-hint">PNG, JPG tối đa 10MB</p>
              </Dragger>

              {/* Mockup image previews */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid #e8e8e8' }}>
                  <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=200&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="evidence 1" />
                  <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'white', borderRadius: '50%', color: '#ff4d4f', cursor: 'pointer' }}><CloseCircleOutlined /></div>
                </div>
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" style={{ width: '40px', height: '40px' }} alt="pdf" />
                  <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'white', borderRadius: '50%', color: '#ff4d4f', cursor: 'pointer' }}><CloseCircleOutlined /></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <Button size="large" style={{ fontWeight: 500 }}>Lưu nháp</Button>
              <Button loading={isSubmitting} type="primary" size="large" style={{ backgroundColor: '#002e42', fontWeight: 500 }} onClick={handleSubmit}>Gửi yêu cầu ngay</Button>
            </div>
          </Card>
        </Col>

        {/* Right Column - History & Stats */}
        <Col span={9}>
          <Card 
            title={<><Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Phản hồi gần đây</Text></>} 
            extra={<a href="#/all" style={{ color: '#1e7e34', fontSize: '13px', fontWeight: 'bold' }}>Xem tất cả</a>}
            variant="borderless" 
            style={{ borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <List
              itemLayout="vertical"
              dataSource={dummyFeedbacks}
              renderItem={item => (
                <List.Item style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Tag color={item.typeColor} style={{ borderRadius: '4px', fontWeight: 'bold', fontSize: '10px' }}>{item.type}</Tag>
                    <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>{item.time}</Text>
                  </div>
                  <Text style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block' }}>{item.title}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{item.statusIcon} <span style={{ marginLeft: 4 }}>{item.status}</span></Text>
                </List.Item>
              )}
            />
          </Card>

          <Card variant="borderless" style={{ borderRadius: '16px', backgroundColor: '#002e42', color: 'white' }}>
            <Text style={{ color: '#bce1ec', fontSize: '13px' }}>Tổng quan tương tác</Text>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '12px', marginBottom: '4px' }}>
              <span style={{ fontSize: '40px', fontWeight: 'bold', lineHeight: 1 }}>12</span>
              <span style={{ fontSize: '14px', marginLeft: '8px', color: '#bce1ec' }}>Phản hồi/năm</span>
            </div>
            <Text style={{ fontSize: '12px', color: '#4CAF50' }}>92% yêu cầu được xử lý đúng hạn</Text>
            {/* Chart illustration placeholder */}
            <div style={{ height: '60px', marginTop: '16px', backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', position: 'relative' }}>
              <svg viewBox="0 0 100 30" style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%' }}>
                <path d="M0,30 L10,25 L20,28 L30,15 L40,20 L50,10 L60,18 L70,5 L80,12 L90,2 L100,8 L100,30 Z" fill="rgba(76, 175, 80, 0.2)" />
                <polyline points="0,30 10,25 20,28 30,15 40,20 50,10 60,18 70,5 80,12 90,2 100,8" fill="none" stroke="#4CAF50" strokeWidth="2" />
              </svg>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Feedback;
