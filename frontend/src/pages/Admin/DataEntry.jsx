import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  Button, 
  Upload, 
  message, 
  Row, 
  Col, 
  Typography,
  Space,
  Table,
  Modal,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  FileExcelOutlined,
  SaveOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState('landparcels');
  const [loading, setLoading] = useState(false);
  const [landParcelForm] = Form.useForm();
  const [legalDocForm] = Form.useForm();
  const [contractForm] = Form.useForm();
  const [userForm] = Form.useForm();

  // Danh sách thôn/xóm thực tế của Xã Yên Thường
  const THON_LIST = [
    'Thôn Yên Khê',
    'Thôn Lại Hoàng', 
    'Thôn Quy Mông',
    'Thôn Trung',
    'Thôn Đình',
    'Thôn Xuân Dục',
    'Thôn Dốc Lã',
    'Thôn Liên Nhĩ'
  ];

  // Tạo thửa đất mới
  const handleCreateLandParcel = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/land-parcels', values, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        message.success('Tạo thửa đất thành công!');
        landParcelForm.resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Tạo văn bản pháp lý mới
  const handleCreateLegalDoc = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/legal-documents', values, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        message.success('Tạo văn bản pháp lý thành công!');
        legalDocForm.resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Tạo hợp đồng mới
  const handleCreateContract = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Tính toán ngày kết thúc dựa trên thời hạn
      const endDate = moment(values.startDate).add(values.term, 'years');
      const contractData = {
        ...values,
        endDate: endDate.format('YYYY-MM-DD'),
        currentDebt: values.annualPrice * values.area * values.term // Tổng nợ ban đầu
      };

      const response = await axios.post('http://localhost:5000/api/admin/contracts', contractData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        message.success('Tạo hợp đồng thành công!');
        contractForm.resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Tạo người dùng mới
  const handleCreateUser = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/users', values, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        message.success('Tạo người dùng thành công!');
        userForm.resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Import từ Excel
  const handleExcelImport = async (file, type) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await axios.post('http://localhost:5000/api/admin/import-excel', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        message.success(`Import ${type} thành công! Đã thêm ${response.data.count} bản ghi.`);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Import thất bại');
    }
    return false; // Prevent auto upload
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          <DatabaseOutlined style={{ marginRight: '12px' }} />
          Nhập liệu Dữ liệu Thực tế
        </Title>
        <Text type="secondary">Nhập dữ liệu thực tế cho hệ thống quản lý đất đai Xã Yên Thường</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Tab Thửa đất */}
        <TabPane 
          tab={
            <span>
              <EnvironmentOutlined />
              Thửa đất
            </span>
          } 
          key="landparcels"
        >
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Thông tin thửa đất" extra={
                <Upload
                  beforeUpload={(file) => handleExcelImport(file, 'landparcels')}
                  accept=".xlsx,.xls"
                  showUploadList={false}
                >
                  <Button icon={<FileExcelOutlined />}>Import Excel</Button>
                </Upload>
              }>
                <Form
                  form={landParcelForm}
                  layout="vertical"
                  onFinish={handleCreateLandParcel}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="mapSheet"
                        label="Tờ bản đồ *"
                        rules={[{ required: true, message: 'Vui lòng nhập tờ bản đồ' }]}
                      >
                        <Input placeholder="VD: C44" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="parcelNumber"
                        label="Số thửa *"
                        rules={[{ required: true, message: 'Vui lòng nhập số thửa' }]}
                      >
                        <Input placeholder="VD: 5691" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="area"
                        label="Diện tích (m²) *"
                        rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={1}
                          placeholder="2450"
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="village"
                        label="Thôn/Xóm *"
                        rules={[{ required: true, message: 'Vui lòng chọn thôn/xóm' }]}
                      >
                        <Select placeholder="Chọn thôn/xóm">
                          {THON_LIST.map(thon => (
                            <Option key={thon} value={thon}>{thon}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="landType"
                        label="Loại đất *"
                        rules={[{ required: true, message: 'Vui lòng chọn loại đất' }]}
                      >
                        <Select placeholder="Chọn loại đất">
                          <Option value="Đất sản xuất nông nghiệp">Đất sản xuất nông nghiệp</Option>
                          <Option value="Đất nuôi trồng thủy sản">Đất nuôi trồng thủy sản</Option>
                          <Option value="Đất công trình công cộng">Đất công trình công cộng</Option>
                          <Option value="Đất chưa sử dụng">Đất chưa sử dụng</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="currentStatus"
                        label="Hiện trạng sử dụng *"
                        rules={[{ required: true, message: 'Vui lòng chọn hiện trạng' }]}
                      >
                        <Select placeholder="Chọn hiện trạng">
                          <Option value="Đang cho thuê/giao khoán">Đang cho thuê/giao khoán</Option>
                          <Option value="Chưa đưa vào sử dụng">Chưa đưa vào sử dụng</Option>
                          <Option value="Sử dụng sai mục đích">Sử dụng sai mục đích</Option>
                          <Option value="Bị lấn chiếm, tranh chấp">Bị lấn chiếm, tranh chấp</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={['legalDocuments', 'legalStatus']}
                        label="Trạng thái pháp lý *"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái pháp lý' }]}
                      >
                        <Select placeholder="Chọn trạng thái pháp lý">
                          <Option value="Đầy đủ – hợp lệ">Đầy đủ – hợp lệ</Option>
                          <Option value="Chưa đầy đủ">Chưa đầy đủ</Option>
                          <Option value="Cần xác minh">Cần xác minh</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={['coordinates', 'latitude']}
                        label="Vĩ độ (Latitude)"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="21.0825"
                          step={0.000001}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={['coordinates', 'longitude']}
                        label="Kinh độ (Longitude)"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="105.9320"
                          step={0.000001}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="notes"
                    label="Ghi chú"
                  >
                    <TextArea rows={3} placeholder="Ghi chú bổ sung (nếu có)" />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      Lưu thửa đất
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Hướng dẫn nhập liệu" size="small">
                <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  <Text strong>Lưu ý khi nhập thửa đất:</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                    <li>Tờ bản đồ: Theo sổ địa chính thực tế (VD: C44, C45...)</li>
                    <li>Số thửa: Số thửa đất trong tờ bản đồ</li>
                    <li>Diện tích: Theo đo đạc thực tế (m²)</li>
                    <li>Thôn/Xóm: Chọn từ danh sách có sẵn</li>
                    <li>Tọa độ: Có thể để trống, sẽ bổ sung sau</li>
                  </ul>
                  
                  <Divider />
                  
                  <Text strong>Import từ Excel:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text>Cột cần có: Tờ bản đồ, Số thửa, Diện tích, Thôn, Loại đất, Hiện trạng</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Tab Văn bản pháp lý */}
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              Văn bản pháp lý
            </span>
          } 
          key="legaldocs"
        >
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Thông tin văn bản pháp lý">
                <Form
                  form={legalDocForm}
                  layout="vertical"
                  onFinish={handleCreateLegalDoc}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="documentNumber"
                        label="Số văn bản *"
                        rules={[{ required: true, message: 'Vui lòng nhập số văn bản' }]}
                      >
                        <Input placeholder="VD: QĐ-125/2024/QĐ-UBND" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="documentType"
                        label="Loại văn bản *"
                        rules={[{ required: true, message: 'Vui lòng chọn loại văn bản' }]}
                      >
                        <Select placeholder="Chọn loại văn bản">
                          <Option value="Quyết định">Quyết định</Option>
                          <Option value="Thông tư">Thông tư</Option>
                          <Option value="Nghị định">Nghị định</Option>
                          <Option value="Công văn">Công văn</Option>
                          <Option value="Hướng dẫn">Hướng dẫn</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="title"
                    label="Tiêu đề văn bản *"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                  >
                    <Input placeholder="VD: Quyết định phê duyệt quy hoạch sử dụng đất giai đoạn 2024-2030" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="issuedBy"
                        label="Cơ quan ban hành *"
                        rules={[{ required: true, message: 'Vui lòng chọn cơ quan ban hành' }]}
                      >
                        <Select placeholder="Chọn cơ quan ban hành">
                          <Option value="UBND Xã Yên Thường">UBND Xã Yên Thường</Option>
                          <Option value="UBND Huyện Gia Lâm">UBND Huyện Gia Lâm</Option>
                          <Option value="UBND Thành phố Hà Nội">UBND Thành phố Hà Nội</Option>
                          <Option value="Bộ TN&MT">Bộ TN&MT</Option>
                          <Option value="Chính phủ">Chính phủ</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="status"
                        label="Trạng thái *"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        initialValue="Có hiệu lực"
                      >
                        <Select>
                          <Option value="Có hiệu lực">Có hiệu lực</Option>
                          <Option value="Hết hiệu lực">Hết hiệu lực</Option>
                          <Option value="Tạm dừng">Tạm dừng</Option>
                          <Option value="Đã hủy">Đã hủy</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="issuedDate"
                        label="Ngày ban hành *"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
                      >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="effectiveDate"
                        label="Ngày hiệu lực *"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày hiệu lực' }]}
                      >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="description"
                    label="Mô tả nội dung"
                  >
                    <TextArea rows={4} placeholder="Mô tả ngắn gọn về nội dung văn bản" />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      Lưu văn bản
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Mẫu văn bản thường dùng" size="small">
                <div style={{ fontSize: '13px' }}>
                  <Text strong>Quyết định phổ biến:</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '16px', fontSize: '12px' }}>
                    <li>Quyết định giao đất, cho thuê đất</li>
                    <li>Quyết định thu hồi đất</li>
                    <li>Quyết định phê duyệt quy hoạch</li>
                    <li>Quyết định xử phạt vi phạm</li>
                  </ul>
                  
                  <Text strong style={{ display: 'block', marginTop: '16px' }}>Thông tư hướng dẫn:</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '16px', fontSize: '12px' }}>
                    <li>Hướng dẫn quản lý đất công ích</li>
                    <li>Quy trình cấp giấy chứng nhận</li>
                    <li>Thủ tục chuyển mục đích sử dụng</li>
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Tab Người dùng */}
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              Người dùng
            </span>
          } 
          key="users"
        >
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Thông tin người dùng">
                <Form
                  form={userForm}
                  layout="vertical"
                  onFinish={handleCreateUser}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Họ và tên *"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                      >
                        <Input placeholder="Nguyễn Văn A" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email *"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email' },
                          { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="nguyenvana@example.com" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại *"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại' },
                          { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="0987654321" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="role"
                        label="Vai trò *"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                      >
                        <Select placeholder="Chọn vai trò">
                          <Option value="admin">Quản trị viên</Option>
                          <Option value="officer">Cán bộ</Option>
                          <Option value="renter">Người thuê đất</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="department"
                        label="Cơ quan/Đơn vị"
                      >
                        <Input placeholder="UBND Xã Yên Thường" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="position"
                        label="Chức vụ"
                      >
                        <Input placeholder="Cán bộ địa chính" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="password"
                    label="Mật khẩu tạm thời *"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    initialValue="123456"
                  >
                    <Input.Password placeholder="Mật khẩu tạm thời" />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      Tạo người dùng
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Lưu ý tạo tài khoản" size="small">
                <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  <Text strong>Phân quyền hệ thống:</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                    <li><Text strong>Quản trị viên:</Text> Toàn quyền hệ thống</li>
                    <li><Text strong>Cán bộ:</Text> Xử lý hồ sơ, phê duyệt</li>
                    <li><Text strong>Người thuê đất:</Text> Xem hợp đồng, thanh toán</li>
                  </ul>
                  
                  <Divider />
                  
                  <Text strong>Mật khẩu mặc định:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text>Người dùng sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DataEntry;