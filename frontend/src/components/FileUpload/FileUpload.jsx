import React, { useState } from 'react';
import { Upload, Button, message, Progress, Card, Image, Typography, Space, Tag, Divider } from 'antd';
import { 
    UploadOutlined, 
    InboxOutlined, 
    DeleteOutlined, 
    EyeOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileTextOutlined,
    FileOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const FileUpload = ({ 
    type = 'general', // 'avatar', 'land-images', 'documents', 'certificates', 'general'
    multiple = false,
    accept = '*',
    maxSize = 25, // MB
    onUploadSuccess,
    onUploadError,
    landId,
    contractId,
    folder = 'uploads'
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Xác định endpoint dựa trên type
    const getUploadEndpoint = () => {
        const baseUrl = 'http://localhost:5000/api';
        switch (type) {
            case 'avatar':
                return `${baseUrl}/auth/upload-avatar`;
            case 'land-images':
                return `${baseUrl}/files/land-images/${landId}`;
            case 'documents':
                return `${baseUrl}/files/documents`;
            case 'certificates':
                return `${baseUrl}/files/certificates/${contractId}`;
            case 'base64':
                return `${baseUrl}/files/upload-base64`;
            default:
                return `${baseUrl}/files/upload`;
        }
    };

    // Xác định field name cho form data
    const getFieldName = () => {
        switch (type) {
            case 'avatar':
                return 'avatar';
            case 'land-images':
                return 'images';
            case 'documents':
                return 'documents';
            case 'certificates':
                return 'certificates';
            default:
                return 'files';
        }
    };

    // Upload files
    const handleUpload = async (fileList) => {
        if (!fileList || fileList.length === 0) {
            message.error('Vui lòng chọn file để upload!');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            const fieldName = getFieldName();

            // Thêm files vào form data
            fileList.forEach(file => {
                formData.append(fieldName, file);
            });

            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để upload file');
            }

            const response = await axios.post(getUploadEndpoint(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            if (response.data.success) {
                const files = response.data.files || [response.data];
                setUploadedFiles(prev => [...prev, ...files]);
                message.success(response.data.message || 'Upload thành công!');
                
                if (onUploadSuccess) {
                    onUploadSuccess(files);
                }
            } else {
                throw new Error(response.data.message || 'Upload thất bại');
            }

        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Upload thất bại';
            message.error(errorMessage);
            
            if (onUploadError) {
                onUploadError(error);
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Upload từ base64
    const handleBase64Upload = async (base64Data, fileName) => {
        setUploading(true);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để upload file');
            }

            const response = await axios.post('http://localhost:5000/api/files/upload-base64', {
                base64Data,
                fileName,
                folder: `datviet/${folder}`
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                const file = response.data.file;
                setUploadedFiles(prev => [...prev, file]);
                message.success('Upload base64 thành công!');
                
                if (onUploadSuccess) {
                    onUploadSuccess([file]);
                }
            }

        } catch (error) {
            console.error('Base64 upload error:', error);
            message.error(error.response?.data?.message || 'Upload base64 thất bại');
        } finally {
            setUploading(false);
        }
    };

    // Xóa file
    const handleDelete = async (publicId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/files/${publicId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setUploadedFiles(prev => prev.filter(file => file.publicId !== publicId));
                message.success('Xóa file thành công!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error(error.response?.data?.message || 'Xóa file thất bại');
        }
    };

    // Lấy icon cho file type
    const getFileIcon = (fileName, mimetype) => {
        const ext = fileName?.split('.').pop()?.toLowerCase();
        
        if (mimetype?.startsWith('image/')) {
            return <FileImageOutlined style={{ color: '#52c41a' }} />;
        } else if (ext === 'pdf' || mimetype === 'application/pdf') {
            return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
        } else if (ext === 'doc' || ext === 'docx') {
            return <FileWordOutlined style={{ color: '#1890ff' }} />;
        } else if (ext === 'xls' || ext === 'xlsx') {
            return <FileExcelOutlined style={{ color: '#52c41a' }} />;
        } else if (ext === 'txt') {
            return <FileTextOutlined style={{ color: '#8c8c8c' }} />;
        } else {
            return <FileOutlined style={{ color: '#8c8c8c' }} />;
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Upload props cho Ant Design Upload
    const uploadProps = {
        name: getFieldName(),
        multiple: multiple,
        accept: accept,
        beforeUpload: (file, fileList) => {
            // Kiểm tra kích thước file
            const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
            if (!isLtMaxSize) {
                message.error(`File phải nhỏ hơn ${maxSize}MB!`);
                return false;
            }

            // Nếu không phải multiple, chỉ cho phép 1 file
            if (!multiple && fileList.length > 1) {
                message.error('Chỉ được chọn 1 file!');
                return false;
            }

            return false; // Prevent auto upload
        },
        onChange: (info) => {
            if (info.fileList.length > 0) {
                const files = info.fileList.map(item => item.originFileObj).filter(Boolean);
                if (files.length > 0) {
                    handleUpload(files);
                }
            }
        },
        showUploadList: false,
        disabled: uploading
    };

    return (
        <div style={{ width: '100%' }}>
            <Card title={`Upload ${type === 'avatar' ? 'Avatar' : 'Files'}`} style={{ marginBottom: 16 }}>
                <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click hoặc kéo thả file vào đây để upload
                    </p>
                    <p className="ant-upload-hint">
                        {multiple ? 'Hỗ trợ upload nhiều file cùng lúc' : 'Chỉ upload 1 file'}. 
                        Kích thước tối đa: {maxSize}MB
                    </p>
                </Dragger>

                {uploading && (
                    <Progress 
                        percent={uploadProgress} 
                        status="active" 
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                )}

                {/* Base64 Upload (chỉ cho image) */}
                {type !== 'documents' && (
                    <>
                        <Divider>Hoặc</Divider>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        handleBase64Upload(event.target.result, file.name);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            style={{ display: 'none' }}
                            id="base64-upload"
                        />
                        <Button 
                            onClick={() => document.getElementById('base64-upload').click()}
                            disabled={uploading}
                            icon={<UploadOutlined />}
                        >
                            Upload từ Base64
                        </Button>
                    </>
                )}
            </Card>

            {/* Hiển thị files đã upload */}
            {uploadedFiles.length > 0 && (
                <Card title="Files đã upload" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {uploadedFiles.map((file, index) => (
                            <Card key={index} size="small" style={{ marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        {getFileIcon(file.originalName, file.mimetype)}
                                        <div style={{ marginLeft: 12, flex: 1 }}>
                                            <Text strong>{file.originalName || 'Uploaded File'}</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {formatFileSize(file.size)} • {file.format?.toUpperCase()}
                                            </Text>
                                            {file.type && (
                                                <Tag color="blue" style={{ marginLeft: 8 }}>
                                                    {file.type}
                                                </Tag>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <Space>
                                        {file.url && file.type === 'image' && (
                                            <Image
                                                width={50}
                                                height={50}
                                                src={file.url}
                                                style={{ objectFit: 'cover', borderRadius: 4 }}
                                                preview={{
                                                    mask: <EyeOutlined />
                                                }}
                                            />
                                        )}
                                        
                                        <Button 
                                            type="link" 
                                            icon={<EyeOutlined />}
                                            onClick={() => window.open(file.url, '_blank')}
                                        >
                                            Xem
                                        </Button>
                                        
                                        <Button 
                                            type="link" 
                                            danger 
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(file.publicId)}
                                        >
                                            Xóa
                                        </Button>
                                    </Space>
                                </div>
                            </Card>
                        ))}
                    </Space>
                </Card>
            )}
        </div>
    );
};

export default FileUpload;