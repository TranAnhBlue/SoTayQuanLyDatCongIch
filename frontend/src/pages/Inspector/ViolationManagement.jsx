import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Form, Input, Select, DatePicker, Upload, message } from 'antd';
import {
  FileTextOutlined,
  UploadOutlined,
  SaveOutlined,
  SendOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ViolationManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Violation data:', values);
      message.success('Biên bản vi phạm đã được lưu thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu biên bản!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase' }}>
          THANH TRA & KIỂM SOÁT
        </div>
        <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
          Lập biên bản vi phạm
        </Title>
        <Text type="secondary">
          Ghi nhận và xử lý các trường hợp vi phạm về sử dụng đất công ích
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Row gutter={[16, 16]}>
          {/* Left Column - Form */}
          <Col xs={24} lg={16}>
            <Card title="📝 Thông tin biên bản" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Mã biên bản"
                    name="code"
                    rules={[{ required: true, message: 'Vui lòng nhập mã biên bản!' }]}
                  >
                    <Input placeholder="VD: BB-2024-001" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Ngày lập biên bản"
                    name="date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                  >
                    <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Loại vi phạm"
                    name="violationType"
                    rules={[{ required: true, message: 'Vui lòng chọn loại vi phạm!' }]}
                  >
                    <Select placeholder="Chọn loại vi phạm">
                      <Option value="encroachment">Lấn chiếm đất công</Option>
                      <Option value="illegal_construction">Xây dựng trái phép</Option>
                      <Option value="wrong_purpose">Sử dụng sai mục đích</Option>
                      <Option value="environmental">Vi phạm môi trường</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Mức độ nghiêm trọng"
                    name="severity"
                    rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
                  >
                    <Select placeholder="Chọn mức độ">
                      <Option value="low">Nhẹ</Option>
                      <Option value="medium">Trung bình</Option>
                      <Option value="high">Nghiêm trọng</Option>
                      <Option value="critical">Rất nghiêm trọng</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Địa điểm vi phạm"
                    name="location"
                    rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
                  >
                    <Input placeholder="VD: Lô A, Thửa CI-102, Phường Bến Nghé, Quận 1" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Đối tượng vi phạm"
                    name="violator"
                    rules={[{ required: true, message: 'Vui lòng nhập đối tượng vi phạm!' }]}
                  >
                    <Input placeholder="Tên cá nhân/tổ chức vi phạm" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Mô tả vi phạm"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng mô tả vi phạm!' }]}
                  >
                    <TextArea 
                      rows={4} 
                      placeholder="Mô tả chi tiết hành vi vi phạm, diện tích, thời gian phát hiện..."
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Biện pháp xử lý đề xuất"
                    name="proposedAction"
                    rules={[{ required: true, message: 'Vui lòng nhập biện pháp xử lý!' }]}
                  >
                    <TextArea 
                      rows={3} 
                      placeholder="Đề xuất biện pháp xử lý: cảnh cáo, phạt tiền, buộc tháo dỡ..."
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Mức phạt đề xuất (VNĐ)"
                    name="fineAmount"
                  >
                    <Input type="number" placeholder="0" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Thời hạn khắc phục"
                    name="deadline"
                  >
                    <DatePicker style={{ width: '100%' }} placeholder="Chọn thời hạn" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="📎 Tài liệu đính kèm">
              <Form.Item
                name="attachments"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
              >
                <Upload.Dragger
                  name="files"
                  multiple
                  beforeUpload={() => false}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: '48px', color: '#1e7e34' }} />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả file vào đây hoặc click để chọn file
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ: Ảnh hiện trường, văn bản, bản đồ (PDF, JPG, PNG, DOC)
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column - Info */}
          <Col xs={24} lg={8}>
            <Card 
              title="ℹ️ Hướng dẫn lập biên bản"
              style={{ marginBottom: '16px' }}
            >
              <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong>1. Thông tin cơ bản</Text>
                  <div style={{ color: '#8c8c8c', marginTop: '4px' }}>
                    Điền đầy đủ mã biên bản, ngày lập và loại vi phạm
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Text strong>2. Địa điểm và đối tượng</Text>
                  <div style={{ color: '#8c8c8c', marginTop: '4px' }}>
                    Ghi rõ địa chỉ cụ thể và thông tin người/đơn vị vi phạm
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Text strong>3. Mô tả chi tiết</Text>
                  <div style={{ color: '#8c8c8c', marginTop: '4px' }}>
                    Mô tả rõ ràng hành vi vi phạm, diện tích, thời gian
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Text strong>4. Biện pháp xử lý</Text>
                  <div style={{ color: '#8c8c8c', marginTop: '4px' }}>
                    Đề xuất mức phạt và thời hạn khắc phục
                  </div>
                </div>

                <div>
                  <Text strong>5. Tài liệu đính kèm</Text>
                  <div style={{ color: '#8c8c8c', marginTop: '4px' }}>
                    Upload ảnh hiện trường, bản đồ, văn bản liên quan
                  </div>
                </div>
              </div>
            </Card>

            <Card 
              style={{ 
                background: '#fff1f0',
                border: '1px solid #ffccc7'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <FileTextOutlined style={{ fontSize: '20px', color: '#d9363e', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#d9363e', marginBottom: '8px' }}>
                    Lưu ý quan trọng
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    • Biên bản phải được lập trong vòng 24h kể từ khi phát hiện vi phạm
                    <br />
                    • Cần có ít nhất 2 nhân chứng hoặc ảnh hiện trường
                    <br />
                    • Thông báo cho đối tượng vi phạm trong vòng 3 ngày làm việc
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div style={{ marginTop: '16px' }}>
              <Button 
                type="default"
                icon={<SaveOutlined />}
                block
                size="large"
                style={{ marginBottom: '8px' }}
                onClick={() => form.submit()}
                loading={loading}
              >
                Lưu nháp
              </Button>
              <Button 
                type="primary"
                icon={<SendOutlined />}
                block
                size="large"
                style={{ background: '#d9363e', borderColor: '#d9363e' }}
                onClick={() => form.submit()}
                loading={loading}
              >
                Gửi phê duyệt
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ViolationManagement;
