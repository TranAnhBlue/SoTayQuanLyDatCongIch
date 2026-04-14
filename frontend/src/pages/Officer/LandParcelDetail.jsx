import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Timeline, Descriptions, Divider, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import {
  EnvironmentOutlined,
  FileTextOutlined,
  HistoryOutlined,
  EditOutlined,
  PrinterOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const LandParcelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parcel, setParcel] = useState(null);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchParcelDetail();
  }, [id]);

  const fetchParcelDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/officer/land-parcels/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setParcel(response.data.data);
    } catch (error) {
      message.error('Không thể tải thông tin thửa đất');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChange = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/officer/land-parcels/${id}/changes`,
        values,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      message.success('Đã thêm biến động thành công');
      setIsChangeModalVisible(false);
      form.resetFields();
      fetchParcelDetail();
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm biến động');
    }
  };

  if (!parcel && !loading) {
    return <div>Không tìm thấy thửa đất</div>;
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">
          QUẢN LÝ THỬA ĐẤT › TỜ BẢN ĐỒ 24 › THỬA SỐ 102
        </Text>
      </div>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Biến động Đất đai</Title>
          <Text type="secondary">
            Lịch sử thay đổi và cập nhật pháp lý thửa đất #{parcel?.parcelCode || 'CI-102'}-TB24.
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<PrinterOutlined />}>In lịch sử</Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setIsChangeModalVisible(true)}
            style={{ background: '#002e42' }}
          >
            Cập nhật biến động
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ background: '#002e42', color: '#fff', borderRadius: '8px' }}>
            <div style={{ opacity: 0.8, marginBottom: '8px' }}>TỔNG SỐ BIẾN ĐỘNG</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              14 <span style={{ fontSize: '14px', color: '#52c41a' }}>+2 Tháng 2023</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ background: '#d4f4dd', borderRadius: '8px' }}>
            <div style={{ color: '#1e7e34', marginBottom: '8px' }}>DIỆN TÍCH HIỆN TẠI</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e7e34' }}>
              1.250 m²
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>CẬP NHẬT SAU ĐO ĐẠC</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ background: '#fff3e0', borderRadius: '8px' }}>
            <div style={{ color: '#f39c12', marginBottom: '8px' }}>TRẠNG THÁI PHÁP LÝ</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f39c12' }}>
              Sổ đỏ đã cấp đổi
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>NHẬT CẬP NHẬT: 12/10/2023</div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Timeline */}
        <Col xs={24} lg={14}>
          <Card title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <HistoryOutlined style={{ marginRight: '8px' }} />
              Lịch sử biến động chi tiết
            </div>
          }>
            <Timeline>
              <Timeline.Item 
                dot={<CheckCircleOutlined style={{ fontSize: '16px', color: '#1e7e34' }} />}
                color="green"
              >
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>ĐIỀU CHỈNH DIỆN TÍCH SAU ĐO ĐẠC LẠI</Text>
                  <Text type="secondary" style={{ marginLeft: '16px', fontSize: '12px' }}>
                    12/10/2023 14:30
                  </Text>
                </div>
                <Text type="secondary">
                  Thay đổi diện tích từ 1.240m2 lên 1.250m2 do điều chỉnh ranh giới phía Tây theo bản vẽ trích lục địa chính số 45/TL-ĐP.
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag>CÁN BỘ: NGUYỄN VĂN AN</Tag>
                  <Tag color="success">CẬP ĐỔI GCN</Tag>
                  <Tag>QĐ 450/QĐ-UBND</Tag>
                </div>
              </Timeline.Item>

              <Timeline.Item 
                dot={<FileTextOutlined style={{ fontSize: '16px', color: '#1890ff' }} />}
                color="blue"
              >
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>HỢP ĐỒNG CHUYỂN NHƯỢNG QUYỀN SỬ DỤNG ĐẤT</Text>
                  <Text type="secondary" style={{ marginLeft: '16px', fontSize: '12px' }}>
                    01/06/2022 09:15
                  </Text>
                </div>
                <Text type="secondary">
                  Chủ sở hữu: Ông Trần Văn B. Chủ sở hữu: Bà Lê Thị C. Văn phòng công chứng số 102/2022 Văn phòng công chứng số 1.
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag>CÁN BỘ: LÊ THỊ HÀ</Tag>
                  <Tag color="processing">ĐỔI CHỦ SỞ HỮU</Tag>
                  <Tag>GCN BD 123456</Tag>
                </div>
              </Timeline.Item>

              <Timeline.Item 
                dot={<WarningOutlined style={{ fontSize: '16px', color: '#f39c12' }} />}
                color="orange"
              >
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>CHUYỂN TỰ ĐẤT NÀM SANG ĐẤT Ở ĐÔ THỊ</Text>
                  <Text type="secondary" style={{ marginLeft: '16px', fontSize: '12px' }}>
                    10/02/2021 16:00
                  </Text>
                </div>
                <Text type="secondary">
                  Cho phép chuyển mục đích sử dụng 200m2 từ đất ở tại đô thị (ĐĐT) theo quy hoạch phân khu được duyệt năm sang đất ở đô thị 2021.
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag>HỘI ĐỒNG BỒI THƯỜNG</Tag>
                  <Tag color="warning">THU HỒI ĐẤT</Tag>
                  <Tag>PP PA-76/HĐBT</Tag>
                </div>
              </Timeline.Item>

              <Timeline.Item 
                dot={<WarningOutlined style={{ fontSize: '16px', color: '#d9363e' }} />}
                color="red"
              >
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>GIẢI PHÓNG MẶT BẰNG ĐƯỜNG VÀNH ĐAI 3</Text>
                  <Text type="secondary" style={{ marginLeft: '16px', fontSize: '12px' }}>
                    15/12/2019 10:20
                  </Text>
                </div>
                <Text type="secondary">
                  Thu hồi 150m2 phía trước thửa đất để phục vụ dự án mở rộng đường Vành Đai 3. Đã hoàn tất bồi thường và bàn giao mặt bằng.
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag>HỘI ĐỒNG BỒI THƯỜNG</Tag>
                  <Tag color="error">THU HỒI ĐẤT</Tag>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={10}>
          {/* Map */}
          <Card 
            title="Vị trí địa chính"
            extra={<Button type="link">XEM BẢN ĐỒ CHI TIẾT</Button>}
            style={{ marginBottom: '16px' }}
          >
            <div style={{ 
              height: '200px',
              background: '#f0f2f5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <EnvironmentOutlined style={{ fontSize: '48px', color: '#1e7e34' }} />
                <div style={{ marginTop: '8px', color: '#666' }}>
                  TỜ BĐ: 21.0289, 105.8942
                </div>
              </div>
            </div>
            <div style={{ 
              padding: '12px',
              background: '#f0f2f5',
              borderRadius: '4px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <EnvironmentOutlined style={{ marginRight: '8px' }} />
                <Text strong>Vị trí địa chính</Text>
              </div>
              <Text type="secondary">
                VN-2000: 458.293, 1.204.382
              </Text>
              <br />
              <Text type="secondary">
                Tỷ lệ: 1:2000
              </Text>
            </div>
          </Card>

          {/* Contact Info */}
          <Card title="Thông tin liên thời" style={{ marginBottom: '16px' }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="CHỦ SỞ HỮU HIỆN TẠI">
                <Text strong>Bà Lê Thị C</Text>
              </Descriptions.Item>
              <Descriptions.Item label="CCCD">
                001xxx000123
              </Descriptions.Item>
              <Descriptions.Item label="THỜI HẠN">
                Lâu dài
              </Descriptions.Item>
              <Descriptions.Item label="LOẠI ĐẤT">
                Đất ở đô thị (ĐĐT)
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Documents */}
          <Card title="Tài liệu đính kèm">
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileTextOutlined style={{ fontSize: '24px', color: '#d9363e', marginRight: '12px' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>GCN-BD1234...</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>2.4 MB • 12/10/2023</Text>
                </div>
              </div>
              <Button type="link" size="small">Tải</Button>
            </div>

            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>Trich-Luc-45...</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>2.1 MB • 11/10/2023</Text>
                </div>
              </div>
              <Button type="link" size="small">Tải</Button>
            </div>

            <Button type="dashed" block icon={<FileTextOutlined />}>
              + TẢI LÊN TÀI LIỆU MỚI
            </Button>
          </Card>

          {/* Actions */}
          <Card title="Mô tả tài liệu" style={{ marginTop: '16px' }}>
            <Text type="secondary">
              Quyết định phê duyệt phương án bồi thường, hỗ trợ tái định cư và mở rộng quốc lộ tại phân khu A, thửa CI-042.
            </Text>
            <Divider />
            <div style={{ marginBottom: '8px' }}>
              <Text strong>NGƯỜI CẬP NHẬT</Text>
              <div>Lê Văn Quân</div>
            </div>
            <div>
              <Text strong>MÃ THAM CHIẾU</Text>
              <div>REF-2024-CI-01</div>
            </div>
            <Divider />
            <Button type="primary" block icon={<CheckCircleOutlined />} style={{ background: '#1e7e34', borderColor: '#1e7e34' }}>
              Xác nhận hồ sơ
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Add Change Modal */}
      <Modal
        title="Cập nhật biến động đất đai"
        open={isChangeModalVisible}
        onCancel={() => setIsChangeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddChange}
        >
          <Form.Item
            name="changeType"
            label="Loại biến động"
            rules={[{ required: true, message: 'Vui lòng chọn loại biến động' }]}
          >
            <Select placeholder="Chọn loại biến động">
              <Select.Option value="Chuyển mục đích sử dụng">Chuyển mục đích sử dụng</Select.Option>
              <Select.Option value="Thu hồi đất">Thu hồi đất</Select.Option>
              <Select.Option value="Điều chỉnh diện tích">Điều chỉnh diện tích</Select.Option>
              <Select.Option value="Thay đổi đối tượng thuê">Thay đổi đối tượng thuê</Select.Option>
              <Select.Option value="Phát sinh tranh chấp">Phát sinh tranh chấp</Select.Option>
              <Select.Option value="Bị lấn chiếm">Bị lấn chiếm</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="changeDate"
            label="Ngày biến động"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết về biến động..." />
          </Form.Item>

          <Form.Item
            name="legalBasis"
            label="Căn cứ pháp lý"
            rules={[{ required: true, message: 'Vui lòng nhập căn cứ pháp lý' }]}
          >
            <Input placeholder="VD: QĐ-125/2024/QĐ-UBND" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu biến động
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LandParcelDetail;