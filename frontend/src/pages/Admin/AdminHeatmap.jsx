import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Card, Tag, Button, List, Space, message } from 'antd';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  FilterOutlined, 
  CalendarOutlined,
  FileTextOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Descriptions, Modal } from 'antd';

const { Title, Text } = Typography;

// Fix Leaflet Default Icon Issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminHeatmap = () => {
  const [data, setData] = useState({ hotSpots: [], recentViolations: [], mapPoints: [], stats: { total: 0, urgent: 0, verifying: 0, resolved: 0 } });
  const [updatingId, setUpdatingId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/heatmap');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching admin heatmap data:', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenDetail = (record) => {
    // Standardize record fields for the modal
    const standardized = record.contractCode ? record : {
        code: record.code,
        name: record.target || record.name,
        location: record.address || record.location,
        type: record.type,
        area: record.area,
        status: record.status,
        date: record.date
    };
    setSelectedRecord(standardized);
    setIsDetailModalVisible(true);
  };

  const handleUpdateViolation = async (code, status, statusColor) => {
    setUpdatingId(code);
    try {
      // Backend hỗ trợ tìm theo code hoặc _id
      await axios.put(`http://localhost:5000/api/admin/violations/${encodeURIComponent(code)}`, { status, statusColor });
      message.success(`Cập nhật vi phạm ${code} thành công!`);
      fetchData();
    } catch (e) {
      message.error('Cập nhật thất bại.');
    }
    setUpdatingId(null);
  };

  const hotSpots = data.hotSpots.length > 0 ? data.hotSpots : [
    { area: 'Phường Cầu Diễn', district: 'Quận Nam Từ Liêm', cases: 42 }
  ];

  const recentViolations = data.recentViolations.length > 0 ? data.recentViolations : [
    { address: 'Số 12 Ngõ 84, Cầu Diễn', target: 'Nguyễn Văn A', area: '124.5 m²', status: 'Khẩn cấp', statusColor: 'error' }
  ];

  const mapCenter = [21.0825, 105.9320]; // Xã Yên Thường, Huyện Gia Lâm
  
  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ height: '100%' }}>
        {/* Left Map View */}
        <Col span={16} style={{ height: '100%' }}>
          <div style={{ position: 'relative', height: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              
              {/* Heatmap/Hotspot markers dynamically generated */}
              {data.mapPoints && data.mapPoints.map((point, index) => (
                <CircleMarker key={index} center={[point.lat, point.lng]} pathOptions={{ fillColor: point.color, color: 'transparent', fillOpacity: 0.6 }} radius={point.radius || 30}>
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>{point.code}</Text>
                      <Text style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>{point.popup}</Text>
                      <Button size="small" type="primary" style={{ fontSize: '10px', height: '24px' }} onClick={() => handleOpenDetail(point)}>
                        Chi tiết hồ sơ
                      </Button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {data.mapPoints.length === 0 && (
                <>
                  <CircleMarker center={[21.0378, 105.7442]} pathOptions={{ fillColor: '#d9363e', color: 'transparent', fillOpacity: 0.6 }} radius={40}>
                    <Popup>Điểm nóng Cầu Diễn: 42 vụ vi phạm</Popup>
                  </CircleMarker>
                  <CircleMarker center={[21.0400, 105.7600]} pathOptions={{ fillColor: '#1e7e34', color: 'transparent', fillOpacity: 0.5 }} radius={15} />
                </>
              )}
            </MapContainer>

            {/* Float Overlay Legend */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '20px', borderRadius: '12px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '320px' }}>
              <Text style={{ fontSize: '11px', fontWeight: 'bold', color: '#595959', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>CHÚ GIẢI MẬT ĐỘ</Text>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d9363e', marginRight: '12px' }} />
                 <Text style={{ fontSize: '13px', fontWeight: 500 }}>Nghiêm trọng (&gt; 15 vụ)</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#faad14', marginRight: '12px' }} />
                 <Text style={{ fontSize: '13px', fontWeight: 500 }}>Trung bình (5 - 15 vụ)</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1e7e34', marginRight: '12px' }} />
                 <Text style={{ fontSize: '13px', fontWeight: 500 }}>An toàn (&lt; 5 vụ)</Text>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1e7e34', border: 'none', borderRadius: '6px', flex: 1 }}>Lọc theo loại Đất</Button>
                <Button icon={<CalendarOutlined />} style={{ borderRadius: '6px', flex: 1 }}>Tháng này</Button>
              </div>
            </div>
          </div>
        </Col>

        {/* Right Info Panel */}
        <Col span={8} style={{ height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
          <div>
            <Title level={2} style={{ margin: '0 0 4px 0', color: '#002e42', fontWeight: 800 }}>Phân tích Vi phạm</Title>
            <Text style={{ fontSize: '13px', color: '#595959' }}>Dữ liệu cập nhật: {new Date().toLocaleDateString('vi-VN')} - {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
          </div>

          <Row gutter={16} style={{ marginTop: '24px', marginBottom: '32px' }}>
            <Col span={12}>
              <Card variant="borderless" style={{ backgroundColor: '#fff1f0', borderRadius: '12px' }} styles={{ body: { padding: '16px' } }}>
                <Text style={{ color: '#d9363e', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Tổng vi phạm</Text>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline' }}>
                  <Title level={2} style={{ margin: 0, color: '#d9363e', fontWeight: 800 }}>{data.stats?.total || 0}</Title>
                  <Text style={{ color: '#d9363e', fontSize: '12px', marginLeft: '8px', fontWeight: 'bold' }}>{data.stats?.urgent ? `${data.stats.urgent} khẩn` : ''}</Text>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card variant="borderless" style={{ backgroundColor: '#e6f4ea', borderRadius: '12px' }} styles={{ body: { padding: '16px' } }}>
                <Text style={{ color: '#1e7e34', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Đã xử lý</Text>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline' }}>
                  <Title level={2} style={{ margin: 0, color: '#1e7e34', fontWeight: 800 }}>{data.stats?.resolved || 0}</Title>
                  <Text style={{ color: '#1e7e34', fontSize: '12px', marginLeft: '8px', fontWeight: 'bold' }}>
                    {data.stats?.total ? `${Math.round((data.stats.resolved / data.stats.total) * 100)}%` : '--'}
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#002e42', textTransform: 'uppercase' }}>Điểm nóng vi phạm</Text>
            <a href="#" style={{ color: '#1e7e34', fontWeight: 'bold', fontSize: '12px' }}>Xem tất cả</a>
          </div>

          {hotSpots.map((spot, index) => (
             <Card key={index} variant="borderless" style={{ borderRadius: '12px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '16px' } }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text style={{ fontWeight: 'bold', display: 'block', fontSize: '15px', color: '#262626' }}>{spot.area}</Text>
                    <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>{spot.district}</Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text style={{ color: '#d9363e', fontSize: '20px', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>{spot.cases}</Text>
                    <Text style={{ fontSize: '11px', color: '#595959' }}>vụ việc</Text>
                  </div>
               </div>
             </Card>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', marginBottom: '16px' }}>
            <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#002e42', textTransform: 'uppercase' }}>Vi phạm mới nhất</Text>
            <Tag style={{ backgroundColor: '#e2e8f0', color: '#595959', border: 'none', fontWeight: 'bold' }}>LIVE</Tag>
          </div>

          {recentViolations.map((v, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Space>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#002e42', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <EnvironmentOutlined style={{ color: 'white', fontSize: '20px' }} />
                  </div>
                  <Text style={{ fontWeight: 'bold', fontSize: '14px', color: '#262626' }}>{v.address}</Text>
                </Space>
                <Tag color={v.statusColor} style={{ borderRadius: '4px', border: 'none', fontWeight: 'bold', height: '22px' }}>{v.status}</Tag>
              </div>
              <div style={{ marginLeft: '48px' }}>
                <Text style={{ display: 'block', fontSize: '12px', color: '#8c8c8c' }}>Loại: <strong>{v.type}</strong></Text>
                <Text style={{ display: 'block', fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>Đối tượng: <strong>{v.target}</strong></Text>
                <Text style={{ display: 'block', fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>Diện tích: <strong>{v.area}</strong></Text>
                <Space style={{ marginTop: '8px' }}>
                  {v.statusColor === 'error' && (
                    <Button
                      size="small"
                      loading={updatingId === v.code}
                      onClick={() => handleUpdateViolation(v.code, 'Đang xác minh', 'warning')}
                      style={{ borderRadius: '6px', fontSize: '11px' }}
                    >
                      Chuyển xử lý
                    </Button>
                  )}
                  {v.statusColor === 'warning' && (
                    <Button
                      size="small"
                      type="primary"
                      loading={updatingId === v.code}
                      onClick={() => handleUpdateViolation(v.code, 'Đã xử lý', 'success')}
                      style={{ backgroundColor: '#1e7e34', borderRadius: '6px', fontSize: '11px' }}
                    >
                      Hoàn tất
                    </Button>
                  )}
                  <Button size="small" style={{ borderRadius: '6px', fontSize: '11px' }} onClick={() => handleOpenDetail(v)}>
                    Hồ sơ
                  </Button>
                </Space>
              </div>
              {index < recentViolations.length - 1 && <div style={{ borderBottom: '1px solid #f0f0f0', marginTop: '20px', marginLeft: '48px' }} />}
            </div>
          ))}

          <Button type="primary" block icon={<FileTextOutlined />} style={{ backgroundColor: '#002e42', borderRadius: '8px', height: '48px', marginTop: '16px', fontWeight: 'bold' }}>
             Xuất báo cáo vi phạm
          </Button>
        </Col>
      </Row>
      {/* Contract Detail Modal (Shared Logic) */}
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Chi tiết hồ sơ đất đai</Title>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã hồ sơ" span={2}>{selectedRecord.code}</Descriptions.Item>
            <Descriptions.Item label="Chủ hồ sơ/Đối tượng">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="Mã định danh">cccd_audit_00x</Descriptions.Item>
            <Descriptions.Item label="Loại hình">{selectedRecord.type || 'Hợp đồng thuê đất'}</Descriptions.Item>
            <Descriptions.Item label="Diện tích">{selectedRecord.area}</Descriptions.Item>
            <Descriptions.Item label="Vị trí thửa đất" span={2}>{selectedRecord.location || selectedRecord.address}</Descriptions.Item>
            <Descriptions.Item label="Ngày ghi nhận">{selectedRecord.date ? new Date(selectedRecord.date).toLocaleDateString('vi-VN') : '--'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color="warning">{selectedRecord.status || 'Đang xử lý'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú nghiệp vụ" span={2}>
              Hồ sơ vi phạm/hợp đồng được trích xuất trực tiếp từ bản đồ địa chính kỹ thuật số của UBND Phường.
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </div>
  );
}

export default AdminHeatmap;
