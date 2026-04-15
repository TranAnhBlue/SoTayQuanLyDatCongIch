import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  Upload, 
  Button, 
  Steps, 
  Row, 
  Col, 
  Typography, 
  message,
  Space,
  Divider,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  DollarCircleOutlined, 
  FileTextOutlined,
  UploadOutlined,
  SendOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateLandRequest = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({}); // Store form data across steps
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams(); // Get ID from URL for edit mode
  const isEditMode = !!id;

  // Load existing request data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadRequestData(id);
    }
  }, [id, isEditMode]);

  const loadRequestData = async (requestId) => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/renter/land-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const request = response.data.request;
        
        // Format data for form
        const formattedData = {
          requesterName: request.requesterName,
          requesterPhone: request.requesterPhone,
          requesterIdCard: request.requesterIdCard,
          requesterAddress: request.requesterAddress,
          requestedArea: request.requestedArea,
          requestedDuration: request.requestedDuration,
          requestedLocation: request.requestedLocation,
          landUse: request.landUse,
          landUseDetail: request.landUseDetail,
          preferredStartDate: request.preferredStartDate ? dayjs(request.preferredStartDate) : null,
          monthlyIncome: request.financialCapacity?.monthlyIncome,
          bankAccount: request.financialCapacity?.bankAccount,
          bankName: request.financialCapacity?.bankName,
          experience: request.experience,
          businessPlan: request.businessPlan
        };
        
        setFormData(formattedData);
        form.setFieldsValue(formattedData);
      }
    } catch (error) {
      console.error('Error loading request:', error);
      message.error('Không thể tải thông tin đơn xin thuê đất');
      navigate('/renter/land-requests');
    } finally {
      setLoadingData(false);
    }
  };

  // Set initial values when user data is available
  React.useEffect(() => {
    if (user) {
      const initialData = {
        requesterName: user.name,
        requesterPhone: user.phone
      };
      form.setFieldsValue(initialData);
      setFormData(initialData);
    }
  }, [user, form]);

  // Sync form with formData when step changes
  React.useEffect(() => {
    if (Object.keys(formData).length > 0) {
      form.setFieldsValue(formData);
    }
  }, [currentStep, formData, form]);

  const steps = [
    {
      title: 'Thông tin cá nhân',
      icon: <UserOutlined />
    },
    {
      title: 'Thông tin đất thuê',
      icon: <EnvironmentOutlined />
    },
    {
      title: 'Năng lực tài chính',
      icon: <DollarCircleOutlined />
    },
    {
      title: 'Hồ sơ đính kèm',
      icon: <FileTextOutlined />
    }
  ];

  const handleNext = async () => {
    try {
      // Get current form values first
      const currentValues = form.getFieldsValue();
      
      // Validate fields for current step only
      let fieldsToValidate = [];
      
      switch (currentStep) {
        case 0:
          fieldsToValidate = ['requesterName', 'requesterPhone', 'requesterIdCard', 'requesterAddress'];
          break;
        case 1:
          fieldsToValidate = ['requestedArea', 'requestedDuration', 'requestedLocation', 'landUse', 'preferredStartDate', 'landUseDetail'];
          break;
        case 2:
          fieldsToValidate = [
            ['financialCapacity', 'monthlyIncome'],
            ['financialCapacity', 'bankName'],
            ['financialCapacity', 'bankAccount'],
            'experience',
            'businessPlan'
          ];
          break;
        case 3:
          // No required fields for documents step
          break;
      }
      
      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
      }
      
      // Save current step data to formData state
      const updatedFormData = { ...formData, ...currentValues };
      setFormData(updatedFormData);
      
      console.log('Current step:', currentStep);
      console.log('Current values:', currentValues);
      console.log('Updated form data:', updatedFormData);
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final submit - use accumulated form data
        handleSubmit(updatedFormData);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (finalFormData) => {
    setLoading(true);
    try {
      console.log('Final form data for submit:', finalFormData); // Debug log
      
      // Validate that preferredStartDate is provided
      if (!finalFormData.preferredStartDate) {
        message.error('Vui lòng chọn ngày bắt đầu mong muốn');
        setCurrentStep(1); // Go back to step 2 where date is selected
        setLoading(false);
        return;
      }

      // Convert dayjs object to proper date format
      let startDate;
      if (finalFormData.preferredStartDate && typeof finalFormData.preferredStartDate.format === 'function') {
        startDate = finalFormData.preferredStartDate.format('YYYY-MM-DD');
      } else if (finalFormData.preferredStartDate instanceof Date) {
        startDate = finalFormData.preferredStartDate.toISOString().split('T')[0];
      } else {
        startDate = finalFormData.preferredStartDate;
      }

      // Prepare data with proper validation
      const requestData = {
        requesterName: finalFormData.requesterName || '',
        requesterPhone: finalFormData.requesterPhone || '',
        requesterIdCard: finalFormData.requesterIdCard || '',
        requesterAddress: finalFormData.requesterAddress || '',
        requestedArea: Number(finalFormData.requestedArea) || 0,
        requestedLocation: finalFormData.requestedLocation || '',
        landUse: finalFormData.landUse || '',
        landUseDetail: finalFormData.landUseDetail || '',
        requestedDuration: Number(finalFormData.requestedDuration) || 0,
        preferredStartDate: startDate,
        financialCapacity: {
          monthlyIncome: Number(finalFormData.financialCapacity?.monthlyIncome) || 0,
          bankName: finalFormData.financialCapacity?.bankName || '',
          bankAccount: finalFormData.financialCapacity?.bankAccount || ''
        },
        experience: finalFormData.experience || '',
        businessPlan: finalFormData.businessPlan || '',
        documents: fileList.map(file => ({
          name: file.name,
          type: file.type,
          url: file.url || file.response?.url || '',
          uploadDate: new Date()
        }))
      };

      console.log('Request data to send:', requestData); // Debug log

      // Validate required fields before sending
      const requiredFields = [
        { field: 'requesterName', label: 'Họ tên' },
        { field: 'requesterPhone', label: 'Số điện thoại' },
        { field: 'requesterIdCard', label: 'Số CCCD/CMND' },
        { field: 'requesterAddress', label: 'Địa chỉ' },
        { field: 'requestedArea', label: 'Diện tích' },
        { field: 'requestedLocation', label: 'Vị trí' },
        { field: 'landUse', label: 'Mục đích sử dụng' },
        { field: 'landUseDetail', label: 'Mô tả chi tiết' },
        { field: 'requestedDuration', label: 'Thời hạn thuê' },
        { field: 'experience', label: 'Kinh nghiệm' },
        { field: 'businessPlan', label: 'Kế hoạch kinh doanh' }
      ];

      const missingFields = requiredFields.filter(({ field }) => {
        if (field === 'requestedArea' || field === 'requestedDuration') {
          return !requestData[field] || requestData[field] === 0;
        }
        return !requestData[field] || requestData[field].trim() === '';
      });

      if (missingFields.length > 0) {
        const missingLabels = missingFields.map(f => f.label).join(', ');
        message.error(`Vui lòng điền đầy đủ thông tin: ${missingLabels}`);
        setLoading(false);
        return;
      }

      const response = isEditMode 
        ? await axios.put(`http://localhost:5000/api/renter/land-requests/${id}`, requestData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        : await axios.post('http://localhost:5000/api/renter/land-requests', requestData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
      
      if (response.data.success) {
        message.success(isEditMode 
          ? 'Cập nhật đơn xin thuê đất thành công!' 
          : 'Gửi đơn xin thuê đất thành công! Chúng tôi sẽ xem xét và phản hồi trong 5-7 ngày làm việc.'
        );
        navigate('/renter/land-requests');
      }
    } catch (error) {
      console.error('Submit error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.data) {
        console.error('Error details:', error.response.data);
        message.error('Có lỗi validation. Vui lòng kiểm tra lại thông tin.');
      } else {
        message.error('Có lỗi xảy ra khi gửi đơn');
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('image/') ||
                         file.type === 'application/msword' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isValidType) {
        message.error('Chỉ hỗ trợ file PDF, Word và hình ảnh!');
        return false;
      }
      
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File phải nhỏ hơn 10MB!');
        return false;
      }
      
      return false; // Prevent auto upload
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title level={4} style={{ marginBottom: '24px', color: '#002e42' }}>
              <UserOutlined style={{ marginRight: '8px' }} />
              Thông tin người xin thuê
            </Title>
            
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
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
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
                  rules={[
                    { required: true, message: 'Vui lòng nhập số CCCD/CMND' },
                    { pattern: /^[0-9]{9,12}$/, message: 'Số CCCD/CMND không hợp lệ' }
                  ]}
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
          </div>
        );

      case 1:
        return (
          <div>
            <Title level={4} style={{ marginBottom: '24px', color: '#002e42' }}>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              Thông tin đất muốn thuê
            </Title>
            
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
                    max={100000}
                    placeholder="Nhập diện tích"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết về kế hoạch sử dụng đất (loại cây trồng, quy mô sản xuất, v.v.)"
              />
            </Form.Item>
          </div>
        );

      case 2:
        return (
          <div>
            <Title level={4} style={{ marginBottom: '24px', color: '#002e42' }}>
              <DollarCircleOutlined style={{ marginRight: '8px' }} />
              Năng lực tài chính
            </Title>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name={['financialCapacity', 'monthlyIncome']}
                  label="Thu nhập hàng tháng (VNĐ) *"
                  rules={[{ required: true, message: 'Vui lòng nhập thu nhập' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="Nhập thu nhập hàng tháng"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['financialCapacity', 'bankName']}
                  label="Ngân hàng *"
                  rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}
                >
                  <Select placeholder="Chọn ngân hàng">
                    <Option value="Vietcombank">Vietcombank</Option>
                    <Option value="VietinBank">VietinBank</Option>
                    <Option value="BIDV">BIDV</Option>
                    <Option value="Agribank">Agribank</Option>
                    <Option value="Techcombank">Techcombank</Option>
                    <Option value="MB Bank">MB Bank</Option>
                    <Option value="ACB">ACB</Option>
                    <Option value="Khác">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={['financialCapacity', 'bankAccount']}
              label="Số tài khoản ngân hàng *"
              rules={[
                { required: true, message: 'Vui lòng nhập số tài khoản' },
                { pattern: /^[0-9]{6,20}$/, message: 'Số tài khoản không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập số tài khoản ngân hàng" />
            </Form.Item>

            <Form.Item
              name="experience"
              label="Kinh nghiệm sản xuất/kinh doanh *"
              rules={[{ required: true, message: 'Vui lòng mô tả kinh nghiệm' }]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả kinh nghiệm của bạn trong lĩnh vực sản xuất nông nghiệp, chăn nuôi hoặc kinh doanh liên quan"
              />
            </Form.Item>

            <Form.Item
              name="businessPlan"
              label="Kế hoạch kinh doanh *"
              rules={[{ required: true, message: 'Vui lòng mô tả kế hoạch kinh doanh' }]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả kế hoạch kinh doanh, dự kiến lợi nhuận, thời gian hoàn vốn, v.v."
              />
            </Form.Item>
          </div>
        );

      case 3:
        return (
          <div>
            <Title level={4} style={{ marginBottom: '24px', color: '#002e42' }}>
              <FileTextOutlined style={{ marginRight: '8px' }} />
              Hồ sơ đính kèm
            </Title>
            
            <div style={{ marginBottom: '24px' }}>
              <Text strong>Danh sách tài liệu cần thiết:</Text>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Bản sao CCCD/CMND (có công chứng)</li>
                <li>Sổ hộ khẩu hoặc giấy tờ chứng minh nơi cư trú</li>
                <li>Giấy chứng nhận thu nhập (nếu có)</li>
                <li>Sao kê tài khoản ngân hàng 3 tháng gần nhất</li>
                <li>Giấy phép kinh doanh (nếu có)</li>
                <li>Các tài liệu khác chứng minh năng lực tài chính</li>
              </ul>
            </div>

            <Form.Item
              name="documents"
              label="Tải lên tài liệu"
            >
              <Upload.Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: '48px', color: '#1e7e34' }} />
                </p>
                <p className="ant-upload-text">Kéo thả file vào đây hoặc click để chọn</p>
                <p className="ant-upload-hint">
                  Hỗ trợ: PDF, Word, JPG, PNG. Tối đa 10MB mỗi file.
                </p>
              </Upload.Dragger>
            </Form.Item>

            {fileList.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>Danh sách file đã chọn:</Text>
                <ul style={{ marginTop: '8px' }}>
                  {fileList.map((file, index) => (
                    <li key={index} style={{ padding: '4px 0' }}>
                      <FileTextOutlined style={{ marginRight: '8px', color: '#1e7e34' }} />
                      {file.name} ({file.size ? (file.size / 1024 / 1024).toFixed(2) : '0.00'} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {loadingData ? (
        <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px' }}>
            <Text>Đang tải thông tin đơn xin thuê đất...</Text>
          </div>
        </Card>
      ) : (
        <>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/renter/dashboard')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại
        </Button>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          {isEditMode ? 'Chỉnh sửa đơn xin thuê đất' : 'Tạo đơn xin thuê đất'}
        </Title>
        <Text type="secondary">
          {isEditMode ? 'Cập nhật thông tin đơn xin thuê đất của bạn' : 'Điền đầy đủ thông tin để tạo đơn xin thuê đất công ích'}
        </Text>
      </div>

      {/* Steps */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: '32px' }}
        />
      </Card>

      {/* Form Content */}
      <Card>
        <Form
          form={form}
          layout="vertical"
        >
          {renderStepContent()}
        </Form>

        <Divider />

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {currentStep > 0 && (
              <Button onClick={handlePrev}>
                Quay lại
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext}>
                Tiếp theo
              </Button>
            ) : (
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleNext}
                style={{ backgroundColor: '#1e7e34' }}
              >
                {isEditMode ? 'Cập nhật đơn xin thuê đất' : 'Gửi đơn xin thuê đất'}
              </Button>
            )}
          </div>
        </div>
      </Card>
        </>
      )}
    </div>
  );
};

export default CreateLandRequest;