import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  Typography, 
  message
} from 'antd';
import { 
  ArrowLeftOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateLandRequestSimple = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Form values:', values);

      // Prepare data
      const requestData = {
        requesterName: values.requesterName,
        requesterPhone: values.requesterPhone,
        requesterIdCard: values.requesterIdCard,
        requesterAddress: values.requesterAddress,
        requestedArea: values.requestedArea,
        requestedLocation: values.requestedLocation,
        landUse: values.landUse,
        landUseDetail: values.landUseDetail,
        requestedDuration: values.requestedDuration,
        preferredStartDate: values.preferredStartDate.format('YYYY-MM-DD'),
        financialCapacity: {
          monthlyIncome: values.monthlyIncome,
          bankName: values.bankName,
          bankAccount: values.bankAccount
        },
        experience: values.experience,
        businessPlan: values.businessPlan,
        documents: []
      };

      console.log('Request data:', requestData);

      const response = await axios.post('http://localhost:5000/api/renter/land-requests', requestData);
      
      if (response.data.success) {
        message.success('Gửi đơn xin thuê đất thành công!');
        navigate('/renter/land-requests');
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/renter/dashboard')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại
        </Button>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          Tạo đơn xin thuê đất (Đơn giản)
        </Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            requesterName: user?.name,
            requesterPhone: user?.phone
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="requesterName"
                label="Họ và tên *"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nhập họ và tên đầy đủ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="requesterPhone"
                label="Số điện thoại *"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="requesterIdCard"
                label="Số CCCD/CMND *"
                rules={[{ required: true, message: 'Vui lòng nhập số CCCD/CMND' }]}
              >
                <Input placeholder="Nhập số CCCD/CMND" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="requesterAddress"
                label="Địa chỉ thường trú *"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input placeholder="Nhập địa chỉ thường trú" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="requestedArea"
                label="Diện tích mong muốn (m²) *"
                rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Nhập diện tích"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="requestedDuration"
                label="Thời hạn thuê (năm) *"
                rules={[{ required: true, message: 'Vui lòng nhập thời hạn thuê' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={50}
                  placeholder="Nhập số năm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="requestedLocation"
            label="Vị trí mong muốn *"
            rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
          >
            <Input placeholder="VD: Thôn Đông Hòa, Xã Yên Thường, Huyện Gia Lâm" />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="landUse"
                label="Mục đích sử dụng *"
                rules={[{ required: true, message: 'Vui lòng chọn mục đích sử dụng' }]}
              >
                <Select placeholder="Chọn mục đích sử dụng">
                  <Option value="Sản xuất nông nghiệp">Sản xuất nông nghiệp</Option>
                  <Option value="Nuôi trồng thủy sản">Nuôi trồng thủy sản</Option>
                  <Option value="Chăn nuôi">Chăn nuôi</Option>
                  <Option value="Trồng cây lâu năm">Trồng cây lâu năm</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="preferredStartDate"
                label="Ngày bắt đầu mong muốn *"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="landUseDetail"
            label="Mô tả chi tiết mục đích sử dụng *"
            rules={[{ required: true, message: 'Vui lòng mô tả chi tiết' }]}
          >
            <TextArea rows={3} placeholder="Mô tả chi tiết về kế hoạch sử dụng đất" />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                name="monthlyIncome"
                label="Thu nhập hàng tháng (VNĐ) *"
                rules={[{ required: true, message: 'Vui lòng nhập thu nhập' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="Nhập thu nhập hàng tháng"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bankName"
                label="Ngân hàng *"
                rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
              >
                <Select placeholder="Chọn ngân hàng">
                  <Option value="Vietcombank">Vietcombank</Option>
                  <Option value="VietinBank">VietinBank</Option>
                  <Option value="BIDV">BIDV</Option>
                  <Option value="Agribank">Agribank</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bankAccount"
                label="Số tài khoản *"
                rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
              >
                <Input placeholder="Nhập số tài khoản" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="experience"
            label="Kinh nghiệm *"
            rules={[{ required: true, message: 'Vui lòng mô tả kinh nghiệm' }]}
          >
            <TextArea rows={3} placeholder="Mô tả kinh nghiệm của bạn" />
          </Form.Item>

          <Form.Item
            name="businessPlan"
            label="Kế hoạch kinh doanh *"
            rules={[{ required: true, message: 'Vui lòng mô tả kế hoạch kinh doanh' }]}
          >
            <TextArea rows={3} placeholder="Mô tả kế hoạch kinh doanh" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              size="large"
              style={{ backgroundColor: '#1e7e34' }}
            >
              Gửi đơn xin thuê đất
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateLandRequestSimple;