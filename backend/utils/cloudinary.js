const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Kiểm tra kết nối Cloudinary
const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary connected successfully:', result);
        return true;
    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error.message);
        return false;
    }
};

// Storage cho Avatar (ảnh người dùng)
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'datviet/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
        ],
        public_id: (req, file) => `avatar-${req.user?.id || 'unknown'}-${Date.now()}`,
    },
});

// Storage cho Ảnh đất (land images)
const landImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'datviet/land-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
        ],
        public_id: (req, file) => `land-${req.params.landId || 'unknown'}-${Date.now()}`,
    },
});

// Storage cho Tài liệu (documents)
const documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'datviet/documents',
        allowed_formats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
        resource_type: 'raw', // Cho phép upload file không phải ảnh
        public_id: (req, file) => `doc-${req.user?.id || 'unknown'}-${Date.now()}-${file.originalname.split('.')[0]}`,
    },
});

// Storage cho Ảnh chứng từ (certificates, contracts)
const certificateStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'datviet/certificates',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        transformation: [
            { width: 1000, height: 1400, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
        ],
        public_id: (req, file) => `cert-${req.params.contractId || 'unknown'}-${Date.now()}`,
    },
});

// Storage tổng quát cho mọi loại file
const generalStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        // Xác định folder dựa trên loại file
        let folder = 'datviet/general';
        let transformation = [];
        
        if (file.mimetype.startsWith('image/')) {
            folder = 'datviet/images';
            transformation = [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' }
            ];
        } else if (file.mimetype === 'application/pdf') {
            folder = 'datviet/pdfs';
        } else {
            folder = 'datviet/files';
        }

        return {
            folder: folder,
            resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
            transformation: transformation,
            public_id: `${folder.split('/')[1]}-${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

// Multer middleware cho từng loại file
const uploadAvatar = multer({ 
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh cho avatar!'), false);
        }
    }
});

const uploadLandImage = multer({ 
    storage: landImageStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
    }
});

const uploadDocument = multer({ 
    storage: documentStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Loại file không được hỗ trợ!'), false);
        }
    }
});

const uploadCertificate = multer({ 
    storage: certificateStorage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG) hoặc PDF!'), false);
        }
    }
});

const uploadGeneral = multer({ 
    storage: generalStorage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// Utility functions
const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('File deleted from Cloudinary:', result);
        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};

const getFileUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
        secure: true,
        ...options
    });
};

// Tạo URL với transformation
const getOptimizedImageUrl = (publicId, width = 800, height = 600, quality = 'auto') => {
    return cloudinary.url(publicId, {
        secure: true,
        width: width,
        height: height,
        crop: 'fill',
        quality: quality,
        fetch_format: 'auto'
    });
};

// Upload file từ buffer hoặc base64
const uploadFromBuffer = async (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: options.folder || 'datviet/uploads',
                public_id: options.public_id,
                transformation: options.transformation,
                ...options
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(buffer);
    });
};

module.exports = {
    cloudinary,
    testCloudinaryConnection,
    
    // Multer middlewares
    uploadAvatar,
    uploadLandImage,
    uploadDocument,
    uploadCertificate,
    uploadGeneral,
    
    // Utility functions
    deleteFile,
    getFileUrl,
    getOptimizedImageUrl,
    uploadFromBuffer,
    
    // Storage instances (nếu cần custom)
    avatarStorage,
    landImageStorage,
    documentStorage,
    certificateStorage,
    generalStorage,
};