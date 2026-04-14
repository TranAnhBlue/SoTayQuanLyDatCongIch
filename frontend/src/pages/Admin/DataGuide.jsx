import React from 'react';
import { 
  Card, 
  Typography, 
  Steps, 
  Row, 
  Col, 
  Alert, 
  Table, 
  Tag,
  Button,
  Space,
  Divider
} from 'antd';
import { 
  FileExcelOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const DataGuide = () => {
  // Cấu trúc dữ liệu mẫu cho thửa đất
  const landParcelColumns = [
    { title: 'Tên cột', dataIndex: 'column', key: 'column' },
    { title: 'Kiểu dữ liệu', dataIndex: 'type', key: 'type' },
    { title: 'Bắt buộc', dataIndex: 'required', key: 'required', render: (required) => required ? <Tag color="red">Bắt buộc</Tag> : <Tag>Tùy chọn</Tag> },
    { title: 'Ví dụ', dataIndex: 'example', key: 'example' }
  ];

  const landParcelData = [
    { key: '1', column: 'Tờ bản đồ', type: 'Văn bản', required: true, example: 'C44' },
    { key: '2', column: 'Số thửa', type: 'Văn bản', required: true, example: '5691' },
    { key: '3', column: 'Diện tích', type: 'Số', required: true, example: '2450' },
    { key: '4', column: 'Thôn', type: 'Văn bản', required: true, example: 'Thôn Lại Hoàng' },
    { key: '5', column: 'Loại đất', type: 'Văn bản', required: true, example: 'Đất sản xuất nông nghiệp' },
    { key: '6', column: 'Hiện trạng', type: 'Văn bản', required: true, example: 'Chưa đưa vào sử dụng' },
    { key: '7', column: 'Trạng thái pháp lý', type: 'Văn bản', required: false, example: 'Đầy đủ – hợp lệ' },
    { key: '8', column: 'Vĩ độ', type: 'Số thập phân', required: false, example: '21.0825' },
    { key: '9', column: 'Kinh độ', type: 'Số thập phân', required: false, example: '105.9320' }
  ];

  // Cấu trúc dữ liệu mẫu cho văn bản pháp lý
  const legalDocData = [
    { key: '1', column: 'Số văn bản', type: 'Văn bản', required: true, example: 'QĐ-125/2024/QĐ-UBND' },
    { key: '2', column: 'Tiêu đề', type: 'Văn bản', required: true, example: 'Quyết định phê duyệt quy hoạch sử dụng đất' },
    { key: '3', column: 'Loại văn bản', type: 'Văn bản', required: true, example: 'Quyết định' },
    { key: '4', column: 'Cơ quan ban hành', type: 'Văn bản', required: true, example: 'UBND Huyện Gia Lâm' },
    { key: '5', column: 'Ngày ban hành', type: 'Ngày tháng', required: true, example: '15/03/2024' },
    { key: '6', column: 'Ngày hiệu lực', type: 'Ngày tháng', required: true, example: '01/04/2024' },
    { key: '7', column: 'Trạng thái', type: 'Văn bản', required: false, example: 'Có hiệu lực' },
    { key: '8', column: 'Mô tả', type: 'Văn bản dài', required: false, example: 'Phê duyệt quy hoạch sử dụng đất giai đoạn 2024-2030' }
  ];

  const steps = [
    {
      title: 'Chuẩn bị dữ liệu',
      description: 'Thu thập và sắp xếp dữ liệu từ sổ địa chính, hồ sơ pháp lý',
      icon: <FileExcelOutlined />
    },
    {
      title: 'Nhập thửa đất',
      description: 'Nhập thông tin các thửa đất từ sổ địa chính thực tế',
      icon: <EnvironmentOutlined />
    },
    {
      title: 'Nhập văn bản pháp lý',
      description: 'Nhập các quyết định, thông tư, nghị định liên quan',
      icon: <FileTextOutlined />
    },
    {
      title: 'Tạo tài khoản người dùng',
      description: 'Tạo tài khoản cho cán bộ và người dân',
      icon: <UserOutlined />
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#002e42' }}>
          Hướng dẫn Nhập liệu Dữ liệu Thực tế
        </Title>
        <Text type="secondary">Hướng dẫn chi tiết cách nhập dữ liệu thực tế cho hệ thống quản lý đất đai</Text>
      </div>

      {/* Alert */}
      <Alert
        message="Quan trọng"
        description="Dữ liệu nhập vào hệ thống phải chính xác và đầy đủ. Vui lòng kiểm tra kỹ trước khi lưu."
        type="warning"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Quy trình nhập liệu */}
      <Card title="Quy trình Nhập liệu" style={{ marginBottom: '24px' }}>
        <Steps
          direction="horizontal"
          current={-1}
          items={steps}
        />
        
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <Text strong>Lưu ý:</Text>
          <ul style={{ marginTop: '8px', marginBottom: 0 }}>
            <li>Nhập dữ liệu theo đúng thứ tự: Thửa đất → Văn bản pháp lý → Người dùng</li>
            <li>Kiểm tra tính chính xác của dữ liệu trước khi lưu</li>
            <li>Sao lưu dữ liệu định kỳ để tránh mất mát</li>
            <li>Liên hệ bộ phận kỹ thuật nếu gặp vấn đề</li>
          </ul>
        </div>
      </Card>

      <Row gutter={24}>
        {/* Hướng dẫn nhập thửa đất */}
        <Col span={12}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined style={{ color: '#1e7e34' }} />
                Nhập liệu Thửa đất
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Paragraph>
              <Text strong>Nguồn dữ liệu:</Text> Sổ địa chính, bản đồ địa chính, hồ sơ giao đất
            </Paragraph>
            
            <Table 
              columns={landParcelColumns}
              dataSource={landParcelData}
              pagination={false}
              size="small"
            />

            <Divider />

            <div>
              <Text strong>Danh sách thôn/xóm Xã Yên Thường:</Text>
              <div style={{ marginTop: '8px' }}>
                {[
                  'Thôn Yên Khê', 'Thôn Lại Hoàng', 'Thôn Quy Mông', 'Thôn Trung',
                  'Thôn Đình', 'Thôn Xuân Dục', 'Thôn Dốc Lã', 'Thôn Liên Nhĩ'
                ].map(thon => (
                  <Tag key={thon} style={{ margin: '2px' }}>{thon}</Tag>
                ))}
              </div>
            </div>

            <Alert
              message="Lưu ý quan trọng"
              description="Tọa độ GPS có thể để trống, sẽ bổ sung sau bằng thiết bị đo đạc chuyên dụng"
              type="info"
              showIcon
              style={{ marginTop: '16px' }}
            />
          </Card>
        </Col>

        {/* Hướng dẫn nhập văn bản pháp lý */}
        <Col span={12}>
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                Nhập liệu Văn bản Pháp lý
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Paragraph>
              <Text strong>Nguồn dữ liệu:</Text> Văn thư, lưu trữ UBND, công báo, công văn
            </Paragraph>
            
            <Table 
              columns={landParcelColumns}
              dataSource={legalDocData}
              pagination={false}
              size="small"
            />

            <Divider />

            <div>
              <Text strong>Các loại văn bản thường gặp:</Text>
              <ul style={{ marginTop: '8px' }}>
                <li><Text strong>Quyết định:</Text> Giao đất, thu hồi đất, phê duyệt quy hoạch</li>
                <li><Text strong>Thông tư:</Text> Hướng dẫn thực hiện, quy trình thủ tục</li>
                <li><Text strong>Nghị định:</Text> Quy định của Chính phủ</li>
                <li><Text strong>Công văn:</Text> Chỉ đạo, báo cáo, thông báo</li>
              </ul>
            </div>

            <Alert
              message="Định dạng ngày tháng"
              description="Nhập ngày tháng theo định dạng DD/MM/YYYY (VD: 15/03/2024)"
              type="info"
              showIcon
              style={{ marginTop: '16px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Hướng dẫn Import Excel */}
      <Card 
        title={
          <Space>
            <FileExcelOutlined style={{ color: '#52c41a' }} />
            Import từ File Excel
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <div>
              <Text strong>Các bước thực hiện:</Text>
              <ol style={{ marginTop: '8px' }}>
                <li>Chuẩn bị file Excel với các cột theo đúng tên và thứ tự</li>
                <li>Kiểm tra dữ liệu không có ô trống ở các cột bắt buộc</li>
                <li>Lưu file dưới định dạng .xlsx hoặc .xls</li>
                <li>Sử dụng chức năng "Import Excel" trong từng tab</li>
                <li>Kiểm tra kết quả import và sửa lỗi nếu có</li>
              </ol>

              <Alert
                message="Lưu ý khi Import"
                description="Hệ thống sẽ bỏ qua các dòng có lỗi và báo cáo chi tiết. Vui lòng sửa lỗi và import lại."
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
              />
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<FileExcelOutlined />} 
                size="large"
                style={{ marginBottom: '16px' }}
              >
                Tải mẫu Excel
              </Button>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Tải file mẫu Excel để tham khảo cấu trúc dữ liệu
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Liên hệ hỗ trợ */}
      <Card title="Liên hệ Hỗ trợ">
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
              <div style={{ fontWeight: 'bold' }}>Hỗ trợ Kỹ thuật</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Hotline: 024.3827.xxxx<br/>
                Email: support@datviet.gov.vn
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <FileTextOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
              <div style={{ fontWeight: 'bold' }}>Hướng dẫn Chi tiết</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Tài liệu hướng dẫn đầy đủ<br/>
                Video tutorial
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <WarningOutlined style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '8px' }} />
              <div style={{ fontWeight: 'bold' }}>Báo lỗi Hệ thống</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Báo cáo lỗi và đề xuất<br/>
                Cải tiến hệ thống
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DataGuide;