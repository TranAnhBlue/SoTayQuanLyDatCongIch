import React, { useState } from 'react';
import { Card, Row, Col, Typography, Divider, Space, Button, message, Tabs } from 'antd';
import { 
    UserOutlined, 
    PictureOutlined, 
    FileTextOutlined, 
    SafetyCertificateOutlined,
    CloudUploadOutlined 
} from '@ant-design/icons';
import FileUpload from '../../components/FileUpload/FileUpload';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const FileUploadTest = () => {
    const [uploadResults, setUploadResults] = useState({});

    const handleUploadSuccess = (type) => (files) => {
        console.log(`${type} upload success:`, files);
        setUploadResults(prev => ({
            ...prev,
            [type]: files
        }));
        message.success(`${type} upload thành công!`);
    };

    const handleUploadError = (type) => (error) => {
        console.error(`${type} upload error:`, error);
        message.error(`${type} upload thất bại!`);
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Card style={{ marginBottom: 24 }}>
                    <Title level={2}>
                        <CloudUploadOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        Cloudinary File Upload Test
                    </Title>
                    <Paragraph>
                        Trang test để kiểm tra tất cả các loại upload file với Cloudinary. 
                        Hỗ trợ upload avatar, ảnh đất, tài liệu, chứng từ và file tổng quát.
                    </Paragraph>
                    
                    <div style={{ backgroundColor: '#e6f7ff', padding: 16, borderRadius: 8, marginTop: 16 }}>
                        <Text strong>📋 Cloudinary Configuration:</Text>
                        <ul style={{ marginTop: 8, marginBottom: 0 }}>
                            <li>Cloud Name: djpnd5vb8</li>
                            <li>Folders: datviet/avatars, datviet/land-images, datviet/documents, etc.</li>
                            <li>Auto optimization: ✅ Enabled</li>
                            <li>Transformations: ✅ Automatic resizing & compression</li>
                        </ul>
                    </div>
                </Card>

                <Tabs defaultActiveKey="avatar" type="card">
                    <TabPane 
                        tab={
                            <span>
                                <UserOutlined />
                                Avatar Upload
                            </span>
                        } 
                        key="avatar"
                    >
                        <Card title="Upload Avatar (300x300, Auto-crop face)">
                            <Paragraph>
                                Upload avatar cho người dùng. Tự động resize về 300x300px và crop theo khuôn mặt.
                                Hỗ trợ: JPG, PNG, GIF, WebP. Kích thước tối đa: 5MB.
                            </Paragraph>
                            
                            <FileUpload
                                type="avatar"
                                multiple={false}
                                accept="image/*"
                                maxSize={5}
                                onUploadSuccess={handleUploadSuccess('avatar')}
                                onUploadError={handleUploadError('avatar')}
                            />
                        </Card>
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <PictureOutlined />
                                Land Images
                            </span>
                        } 
                        key="land-images"
                    >
                        <Card title="Upload Ảnh Đất (1200x800, Auto-optimize)">
                            <Paragraph>
                                Upload ảnh đất đai. Tự động resize về 1200x800px và tối ưu chất lượng.
                                Hỗ trợ: JPG, PNG, WebP. Kích thước tối đa: 10MB. Có thể upload nhiều ảnh cùng lúc.
                            </Paragraph>
                            
                            <FileUpload
                                type="land-images"
                                multiple={true}
                                accept="image/*"
                                maxSize={10}
                                landId="test-land-123"
                                onUploadSuccess={handleUploadSuccess('land-images')}
                                onUploadError={handleUploadError('land-images')}
                            />
                        </Card>
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <FileTextOutlined />
                                Documents
                            </span>
                        } 
                        key="documents"
                    >
                        <Card title="Upload Tài Liệu (PDF, Word, Excel, Text)">
                            <Paragraph>
                                Upload tài liệu văn bản. Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, TXT.
                                Kích thước tối đa: 20MB. Có thể upload nhiều file cùng lúc.
                            </Paragraph>
                            
                            <FileUpload
                                type="documents"
                                multiple={true}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                maxSize={20}
                                onUploadSuccess={handleUploadSuccess('documents')}
                                onUploadError={handleUploadError('documents')}
                            />
                        </Card>
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <SafetyCertificateOutlined />
                                Certificates
                            </span>
                        } 
                        key="certificates"
                    >
                        <Card title="Upload Chứng Từ (Images + PDF, 1000x1400)">
                            <Paragraph>
                                Upload chứng từ, giấy tờ pháp lý. Tự động resize ảnh về 1000x1400px.
                                Hỗ trợ: JPG, PNG, PDF. Kích thước tối đa: 15MB.
                            </Paragraph>
                            
                            <FileUpload
                                type="certificates"
                                multiple={true}
                                accept="image/*,.pdf"
                                maxSize={15}
                                contractId="test-contract-456"
                                onUploadSuccess={handleUploadSuccess('certificates')}
                                onUploadError={handleUploadError('certificates')}
                            />
                        </Card>
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <CloudUploadOutlined />
                                General Upload
                            </span>
                        } 
                        key="general"
                    >
                        <Card title="Upload Tổng Quát (Mọi loại file)">
                            <Paragraph>
                                Upload bất kỳ loại file nào. Tự động phân loại và tối ưu theo từng loại.
                                Kích thước tối đa: 25MB. Hỗ trợ cả Base64 upload.
                            </Paragraph>
                            
                            <FileUpload
                                type="general"
                                multiple={true}
                                accept="*"
                                maxSize={25}
                                folder="general"
                                onUploadSuccess={handleUploadSuccess('general')}
                                onUploadError={handleUploadError('general')}
                            />
                        </Card>
                    </TabPane>
                </Tabs>

                {/* Upload Results */}
                {Object.keys(uploadResults).length > 0 && (
                    <Card title="Upload Results" style={{ marginTop: 24 }}>
                        <pre style={{ 
                            backgroundColor: '#f6f8fa', 
                            padding: 16, 
                            borderRadius: 8,
                            overflow: 'auto',
                            fontSize: 12
                        }}>
                            {JSON.stringify(uploadResults, null, 2)}
                        </pre>
                    </Card>
                )}

                {/* API Endpoints */}
                <Card title="Available API Endpoints" style={{ marginTop: 24 }}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card size="small" title="Upload Endpoints">
                                <ul style={{ fontSize: 12, margin: 0 }}>
                                    <li><code>POST /api/auth/upload-avatar</code></li>
                                    <li><code>POST /api/files/land-images/:landId</code></li>
                                    <li><code>POST /api/files/documents</code></li>
                                    <li><code>POST /api/files/certificates/:contractId</code></li>
                                    <li><code>POST /api/files/upload</code></li>
                                    <li><code>POST /api/files/upload-base64</code></li>
                                </ul>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" title="Utility Endpoints">
                                <ul style={{ fontSize: 12, margin: 0 }}>
                                    <li><code>DELETE /api/files/:publicId</code></li>
                                    <li><code>GET /api/files/optimize/:publicId</code></li>
                                </ul>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default FileUploadTest;