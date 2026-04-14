const { 
    deleteFile, 
    getFileUrl, 
    getOptimizedImageUrl, 
    uploadFromBuffer 
} = require('../utils/cloudinary');

// @desc    Upload land images
// @route   POST /api/files/land-images/:landId
// @access  Private (Admin/Officer)
exports.uploadLandImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file ảnh' });
        }

        const landId = req.params.landId;
        const uploadedFiles = [];

        for (const file of req.files) {
            uploadedFiles.push({
                url: file.path,
                publicId: file.filename,
                originalName: file.originalname,
                size: file.size,
                format: file.format || file.mimetype.split('/')[1]
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã upload ${uploadedFiles.length} ảnh thành công`,
            files: uploadedFiles,
            landId: landId
        });
    } catch (error) {
        console.error('[Upload land images]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Upload documents
// @route   POST /api/files/documents
// @access  Private
exports.uploadDocuments = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file tài liệu' });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            uploadedFiles.push({
                url: file.path,
                publicId: file.filename,
                originalName: file.originalname,
                size: file.size,
                format: file.format || file.originalname.split('.').pop(),
                type: 'document'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã upload ${uploadedFiles.length} tài liệu thành công`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('[Upload documents]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Upload certificates
// @route   POST /api/files/certificates/:contractId
// @access  Private
exports.uploadCertificates = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file chứng từ' });
        }

        const contractId = req.params.contractId;
        const uploadedFiles = [];

        for (const file of req.files) {
            uploadedFiles.push({
                url: file.path,
                publicId: file.filename,
                originalName: file.originalname,
                size: file.size,
                format: file.format || file.originalname.split('.').pop(),
                type: 'certificate'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã upload ${uploadedFiles.length} chứng từ thành công`,
            files: uploadedFiles,
            contractId: contractId
        });
    } catch (error) {
        console.error('[Upload certificates]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Upload general files
// @route   POST /api/files/upload
// @access  Private
exports.uploadGeneral = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một file' });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            uploadedFiles.push({
                url: file.path,
                publicId: file.filename,
                originalName: file.originalname,
                size: file.size,
                format: file.format || file.originalname.split('.').pop(),
                mimetype: file.mimetype,
                type: file.mimetype.startsWith('image/') ? 'image' : 'document'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã upload ${uploadedFiles.length} file thành công`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('[Upload general files]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Delete file from Cloudinary
// @route   DELETE /api/files/:publicId
// @access  Private
exports.deleteFile = async (req, res) => {
    try {
        const { publicId } = req.params;
        
        if (!publicId) {
            return res.status(400).json({ message: 'Vui lòng cung cấp public ID của file' });
        }

        const result = await deleteFile(publicId);
        
        if (result.result === 'ok') {
            res.status(200).json({
                success: true,
                message: 'Xóa file thành công',
                publicId: publicId
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Không thể xóa file',
                result: result
            });
        }
    } catch (error) {
        console.error('[Delete file]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get optimized image URL
// @route   GET /api/files/optimize/:publicId
// @access  Public
exports.getOptimizedImage = async (req, res) => {
    try {
        const { publicId } = req.params;
        const { width = 800, height = 600, quality = 'auto' } = req.query;
        
        if (!publicId) {
            return res.status(400).json({ message: 'Vui lòng cung cấp public ID của ảnh' });
        }

        const optimizedUrl = getOptimizedImageUrl(publicId, parseInt(width), parseInt(height), quality);
        
        res.status(200).json({
            success: true,
            originalPublicId: publicId,
            optimizedUrl: optimizedUrl,
            parameters: {
                width: parseInt(width),
                height: parseInt(height),
                quality: quality
            }
        });
    } catch (error) {
        console.error('[Get optimized image]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Upload from base64 or buffer
// @route   POST /api/files/upload-base64
// @access  Private
exports.uploadFromBase64 = async (req, res) => {
    try {
        const { base64Data, fileName, folder = 'datviet/uploads' } = req.body;
        
        if (!base64Data) {
            return res.status(400).json({ message: 'Vui lòng cung cấp dữ liệu base64' });
        }

        // Remove data URL prefix if present
        const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
        const buffer = Buffer.from(base64String, 'base64');

        const result = await uploadFromBuffer(buffer, {
            folder: folder,
            public_id: fileName ? `${fileName}-${Date.now()}` : undefined,
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Upload từ base64 thành công',
            file: {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                size: result.bytes,
                width: result.width,
                height: result.height
            }
        });
    } catch (error) {
        console.error('[Upload from base64]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

module.exports = {
    uploadLandImages: exports.uploadLandImages,
    uploadDocuments: exports.uploadDocuments,
    uploadCertificates: exports.uploadCertificates,
    uploadGeneral: exports.uploadGeneral,
    deleteFile: exports.deleteFile,
    getOptimizedImage: exports.getOptimizedImage,
    uploadFromBase64: exports.uploadFromBase64
};