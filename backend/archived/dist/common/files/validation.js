"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileType = validateFileType;
exports.generateSecureFilename = generateSecureFilename;
exports.calculateFileHash = calculateFileHash;
exports.extractDocumentMetadata = extractDocumentMetadata;
exports.validateFileSize = validateFileSize;
exports.generateUploadPath = generateUploadPath;
const crypto = __importStar(require("crypto"));
const path = __importStar(require("path"));
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/rtf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
    'application/dicom',
    'application/hl7-v2',
    'application/fhir+json',
    'application/fhir+xml',
    'application/zip',
    'application/x-zip-compressed',
];
const EXTENSION_MIME_MAP = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.rtf': 'application/rtf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.webp': 'image/webp',
    '.dcm': 'application/dicom',
    '.hl7': 'application/hl7-v2',
    '.zip': 'application/zip',
};
function validateFileType(filename, allowedTypes = ALLOWED_MIME_TYPES, fileBuffer) {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
    };
    if (!filename || typeof filename !== 'string') {
        result.isValid = false;
        result.errors.push('Filename is required');
        return result;
    }
    const extension = path.extname(filename).toLowerCase();
    if (!extension) {
        result.isValid = false;
        result.errors.push('File must have an extension');
        return result;
    }
    const expectedMimeType = EXTENSION_MIME_MAP[extension];
    if (!expectedMimeType) {
        result.isValid = false;
        result.errors.push(`File extension '${extension}' is not supported`);
        return result;
    }
    if (!allowedTypes.includes(expectedMimeType)) {
        result.isValid = false;
        result.errors.push(`File type '${expectedMimeType}' is not allowed`);
        return result;
    }
    result.detectedMimeType = expectedMimeType;
    if (fileBuffer && fileBuffer.length > 0) {
        const detectedType = detectMimeTypeFromBuffer(fileBuffer);
        if (detectedType && detectedType !== expectedMimeType) {
            result.warnings.push(`File extension suggests '${expectedMimeType}' but content appears to be '${detectedType}'`);
        }
    }
    const suspiciousPatterns = [
        /\.(exe|bat|cmd|scr|pif|com)$/i,
        /\.(js|vbs|jar|app)$/i,
        /\.(php|asp|jsp|cgi)$/i,
    ];
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(filename)) {
            result.isValid = false;
            result.errors.push('File type is potentially dangerous and not allowed');
            break;
        }
    }
    return result;
}
function generateSecureFilename(originalName, prefix) {
    if (!originalName || typeof originalName !== 'string') {
        originalName = 'unnamed_file';
    }
    const sanitizedName = originalName
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .substring(0, 50);
    const extension = path.extname(sanitizedName).toLowerCase();
    const nameWithoutExt = path.basename(sanitizedName, extension);
    const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .substring(0, 14);
    const randomBytes = crypto.randomBytes(8);
    const randomHex = randomBytes.toString('hex');
    const parts = [prefix, timestamp, nameWithoutExt, randomHex].filter(Boolean);
    return `${parts.join('_')}${extension}`;
}
function calculateFileHash(buffer, algorithm = 'sha256') {
    if (!buffer || !Buffer.isBuffer(buffer)) {
        throw new Error('Invalid buffer provided');
    }
    const hash = crypto.createHash(algorithm);
    hash.update(buffer);
    return hash.digest('hex');
}
function extractDocumentMetadata(file) {
    const secureFilename = generateSecureFilename(file.originalname, 'doc');
    const hash = calculateFileHash(file.buffer);
    const extension = path.extname(file.originalname).toLowerCase();
    const validation = validateFileType(file.originalname);
    const isSecure = validation.isValid && validation.errors.length === 0;
    return {
        filename: secureFilename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        extension,
        hash,
        uploadDate: new Date(),
        isSecure,
    };
}
function validateFileSize(size, maxSize = 10 * 1024 * 1024) {
    return typeof size === 'number' && size > 0 && size <= maxSize;
}
function detectMimeTypeFromBuffer(buffer) {
    if (!buffer || buffer.length < 4) {
        return null;
    }
    const magicNumbers = {
        '25504446': 'application/pdf',
        D0CF11E0: 'application/msword',
        '504B0304': 'application/zip',
        FFD8FFE0: 'image/jpeg',
        FFD8FFE1: 'image/jpeg',
        '89504E47': 'image/png',
        '47494638': 'image/gif',
        '424D': 'image/bmp',
        '49492A00': 'image/tiff',
        '4D4D002A': 'image/tiff',
        '52494646': 'image/webp',
    };
    const hex = buffer.subarray(0, 8).toString('hex').toUpperCase();
    for (const [magic, mimeType] of Object.entries(magicNumbers)) {
        if (hex.startsWith(magic)) {
            return mimeType;
        }
    }
    return null;
}
function generateUploadPath(userId, category, filename) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return path.join('uploads', category, String(year), month, userId, filename);
}
//# sourceMappingURL=validation.js.map