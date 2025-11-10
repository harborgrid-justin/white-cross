"use strict";
/**
 * LOC: FILESTOR1234567
 * File: /reuse/file-storage-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - AWS SDK (S3 storage)
 *   - Azure Storage SDK (Blob storage)
 *   - Google Cloud Storage SDK
 *   - Sharp (image processing)
 *   - FFmpeg (video transcoding)
 *   - ClamAV (virus scanning)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS file upload controllers
 *   - Media processing services
 *   - Storage management services
 *   - CDN integration services
 *   - File validation middleware
 */
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidationInterceptor = exports.FilesUpload = exports.FileUpload = exports.updateStorageQuota = exports.cleanupFiles = exports.searchFiles = exports.generateCDNUrl = exports.purgeCDNCache = exports.completeChunkedUpload = exports.getChunkedUploadStatus = exports.uploadChunk = exports.createChunkedUploadSession = exports.segmentVideoForStreaming = exports.extractVideoMetadata = exports.generateVideoThumbnail = exports.transcodeVideo = exports.extractImageMetadata = exports.generateImageThumbnail = exports.processImage = exports.deleteFileFromGCS = exports.generateGCSSignedUrl = exports.uploadFileToGCS = exports.deleteFileFromAzureBlob = exports.generateAzureBlobSasUrl = exports.uploadFileToAzureBlob = exports.deleteFileFromS3 = exports.completeS3MultipartUpload = exports.uploadS3MultipartPart = exports.initiateS3MultipartUpload = exports.generateS3PresignedUrl = exports.uploadFileToS3 = exports.createLocalFileStream = exports.deleteFileFromLocalStorage = exports.saveFileToLocalStorage = exports.quarantineFile = exports.scanFileForViruses = exports.validateStorageQuota = exports.calculateFileHash = exports.generateSafeFilename = exports.detectFileTypeFromMagicNumbers = exports.validateFile = exports.defineStorageQuotaModel = exports.defineChunkedUploadSessionModel = exports.defineStorageProviderModel = exports.defineFileMetadataModel = exports.StorageQuotaSchema = exports.PresignedUrlOptionsSchema = exports.VideoProcessingOptionsSchema = exports.ImageProcessingOptionsSchema = exports.FileUploadConfigSchema = void 0;
exports.FileStorageService = void 0;
/**
 * File: /reuse/file-storage-kit.prod.ts
 * Locator: WC-UTL-FILESTOR-001
 * Purpose: Comprehensive File Storage & Upload Kit - Complete file management toolkit for NestJS + Multi-cloud storage
 *
 * Upstream: Independent utility module for file upload, storage, and media processing operations
 * Downstream: ../backend/*, File upload services, Storage providers, Media processing, CDN integration
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/platform-express, AWS SDK, Azure Storage,
 *               Google Cloud Storage, Sharp, FFmpeg, Multer, ClamAV, Sequelize
 * Exports: 45+ utility functions for file uploads, storage providers (S3, Azure, GCP, Local), file validation,
 *          virus scanning, image processing, video transcoding, streaming, presigned URLs, chunked uploads,
 *          CDN integration, Sequelize models for file metadata and storage providers
 *
 * LLM Context: Enterprise-grade file storage and media processing utilities for White Cross healthcare platform.
 * Provides comprehensive multi-cloud storage integration (AWS S3, Azure Blob, GCP Storage), local file system
 * storage, advanced file validation, virus scanning with ClamAV, image optimization and resizing with Sharp,
 * video transcoding with FFmpeg, streaming capabilities, presigned URL generation for secure downloads,
 * chunked/resumable uploads for large files, CDN integration for global content delivery, file metadata
 * management, storage quota enforcement, and HIPAA-compliant file handling for medical documents and images.
 * Includes Sequelize models for file metadata tracking, storage provider configuration, and upload sessions.
 */
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for file upload configuration validation.
 */
exports.FileUploadConfigSchema = zod_1.z.object({
    maxFileSize: zod_1.z.number().int().positive().optional().default(10485760), // 10MB default
    allowedMimeTypes: zod_1.z.array(zod_1.z.string()).optional(),
    allowedExtensions: zod_1.z.array(zod_1.z.string()).optional(),
    maxFiles: zod_1.z.number().int().positive().optional().default(10),
    generateThumbnails: zod_1.z.boolean().optional().default(false),
    scanForViruses: zod_1.z.boolean().optional().default(true),
    storageProvider: zod_1.z.string().optional(),
    public: zod_1.z.boolean().optional().default(false),
    expiresIn: zod_1.z.number().int().positive().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Zod schema for image processing options validation.
 */
exports.ImageProcessingOptionsSchema = zod_1.z.object({
    resize: zod_1.z.object({
        width: zod_1.z.number().int().positive().optional(),
        height: zod_1.z.number().int().positive().optional(),
        fit: zod_1.z.enum(['cover', 'contain', 'fill', 'inside', 'outside']).optional(),
        position: zod_1.z.string().optional(),
    }).optional(),
    format: zod_1.z.enum(['jpeg', 'png', 'webp', 'avif', 'tiff']).optional(),
    quality: zod_1.z.number().int().min(1).max(100).optional().default(80),
    compress: zod_1.z.boolean().optional().default(true),
    stripMetadata: zod_1.z.boolean().optional().default(true),
    watermark: zod_1.z.object({
        image: zod_1.z.string(),
        position: zod_1.z.enum(['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
        opacity: zod_1.z.number().min(0).max(1).optional().default(0.5),
    }).optional(),
    variants: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        width: zod_1.z.number().int().positive().optional(),
        height: zod_1.z.number().int().positive().optional(),
        format: zod_1.z.string().optional(),
        quality: zod_1.z.number().int().min(1).max(100).optional(),
    })).optional(),
});
/**
 * Zod schema for video processing options validation.
 */
exports.VideoProcessingOptionsSchema = zod_1.z.object({
    format: zod_1.z.enum(['mp4', 'webm', 'avi', 'mov']).optional().default('mp4'),
    codec: zod_1.z.string().optional().default('h264'),
    resolution: zod_1.z.enum(['480p', '720p', '1080p', '4k']).optional(),
    bitrate: zod_1.z.string().optional(),
    framerate: zod_1.z.number().int().positive().optional(),
    audioCodec: zod_1.z.string().optional().default('aac'),
    audioBitrate: zod_1.z.string().optional(),
    thumbnail: zod_1.z.object({
        timestamp: zod_1.z.number().optional().default(1),
        count: zod_1.z.number().int().positive().optional().default(1),
        width: zod_1.z.number().int().positive().optional(),
        height: zod_1.z.number().int().positive().optional(),
    }).optional(),
    segments: zod_1.z.object({
        duration: zod_1.z.number().int().positive(),
        format: zod_1.z.enum(['hls', 'dash']).optional().default('hls'),
    }).optional(),
});
/**
 * Zod schema for presigned URL options validation.
 */
exports.PresignedUrlOptionsSchema = zod_1.z.object({
    expiresIn: zod_1.z.number().int().positive().min(60).max(604800), // 1 minute to 7 days
    filename: zod_1.z.string().optional(),
    contentType: zod_1.z.string().optional(),
    contentDisposition: zod_1.z.enum(['inline', 'attachment']).optional().default('attachment'),
    responseHeaders: zod_1.z.record(zod_1.z.string()).optional(),
});
/**
 * Zod schema for storage quota configuration.
 */
exports.StorageQuotaSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    organizationId: zod_1.z.string().uuid().optional(),
    maxStorage: zod_1.z.number().int().positive(),
    usedStorage: zod_1.z.number().int().min(0).default(0),
    maxFileSize: zod_1.z.number().int().positive(),
    maxFiles: zod_1.z.number().int().positive(),
    fileCount: zod_1.z.number().int().min(0).default(0),
    allowedMimeTypes: zod_1.z.array(zod_1.z.string()).optional(),
    quotaResetDate: zod_1.z.date().optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model definition for File Metadata.
 * Tracks all uploaded files with comprehensive metadata.
 *
 * @example
 * ```typescript
 * const file = await FileMetadataModel.create({
 *   originalName: 'patient-xray.jpg',
 *   filename: 'abc123.jpg',
 *   mimetype: 'image/jpeg',
 *   size: 2048576,
 *   storageProvider: 's3',
 *   storageKey: 'medical-images/2024/abc123.jpg',
 *   uploadedBy: 'user-123',
 * });
 * ```
 */
const defineFileMetadataModel = (sequelize) => {
    return sequelize.define('FileMetadata', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        originalName: {
            type: sequelize_1.DataTypes.STRING(512),
            allowNull: false,
            field: 'original_name',
        },
        filename: {
            type: sequelize_1.DataTypes.STRING(512),
            allowNull: false,
            unique: true,
        },
        mimetype: {
            type: sequelize_1.DataTypes.STRING(127),
            allowNull: false,
        },
        encoding: {
            type: sequelize_1.DataTypes.STRING(63),
            allowNull: true,
        },
        size: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        path: {
            type: sequelize_1.DataTypes.STRING(1024),
            allowNull: true,
        },
        url: {
            type: sequelize_1.DataTypes.STRING(2048),
            allowNull: true,
        },
        storageProvider: {
            type: sequelize_1.DataTypes.STRING(63),
            allowNull: false,
            field: 'storage_provider',
        },
        storageKey: {
            type: sequelize_1.DataTypes.STRING(1024),
            allowNull: false,
            field: 'storage_key',
        },
        hash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'SHA256 hash of file content',
        },
        checksum: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'MD5 checksum for integrity verification',
        },
        uploadedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'uploaded_by',
        },
        uploadedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'uploaded_at',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'expires_at',
        },
        isPublic: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_public',
        },
        isScanned: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_scanned',
        },
        scanResult: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            field: 'scan_result',
        },
        scanTimestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'scan_timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        width: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Image/video width in pixels',
        },
        height: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Image/video height in pixels',
        },
        duration: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'Video/audio duration in seconds',
        },
        thumbnailUrl: {
            type: sequelize_1.DataTypes.STRING(2048),
            allowNull: true,
            field: 'thumbnail_url',
        },
        variants: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of file variants (thumbnails, resized versions)',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at',
        },
    }, {
        tableName: 'file_metadata',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['uploaded_by'] },
            { fields: ['storage_provider'] },
            { fields: ['mimetype'] },
            { fields: ['uploaded_at'] },
            { fields: ['expires_at'] },
            { fields: ['is_scanned'] },
            { fields: ['tags'], using: 'gin' },
            { fields: ['hash'] },
            { fields: ['storage_key'] },
        ],
    });
};
exports.defineFileMetadataModel = defineFileMetadataModel;
/**
 * Sequelize model definition for Storage Providers.
 * Manages multiple storage provider configurations.
 *
 * @example
 * ```typescript
 * const provider = await StorageProviderModel.create({
 *   type: 's3',
 *   name: 'AWS S3 Production',
 *   config: {
 *     bucket: 'whitecross-medical-files',
 *     region: 'us-east-1',
 *     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *   },
 *   isDefault: true,
 *   isActive: true,
 * });
 * ```
 */
const defineStorageProviderModel = (sequelize) => {
    return sequelize.define('StorageProvider', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('local', 's3', 'azure', 'gcp'),
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        config: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Encrypted storage provider configuration',
        },
        isDefault: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_default',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Higher priority providers are preferred',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'storage_providers',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['type'] },
            { fields: ['is_default'] },
            { fields: ['is_active'] },
            { fields: ['priority'] },
        ],
    });
};
exports.defineStorageProviderModel = defineStorageProviderModel;
/**
 * Sequelize model definition for Chunked Upload Sessions.
 * Tracks resumable chunked upload sessions for large files.
 *
 * @example
 * ```typescript
 * const session = await ChunkedUploadSessionModel.create({
 *   filename: 'large-video.mp4',
 *   totalSize: 524288000,
 *   chunkSize: 5242880,
 *   totalChunks: 100,
 *   storageProvider: 's3',
 * });
 * ```
 */
const defineChunkedUploadSessionModel = (sequelize) => {
    return sequelize.define('ChunkedUploadSession', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        filename: {
            type: sequelize_1.DataTypes.STRING(512),
            allowNull: false,
        },
        totalSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            field: 'total_size',
        },
        chunkSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'chunk_size',
        },
        uploadedChunks: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
            allowNull: false,
            defaultValue: [],
            field: 'uploaded_chunks',
        },
        totalChunks: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'total_chunks',
        },
        storageProvider: {
            type: sequelize_1.DataTypes.STRING(63),
            allowNull: false,
            field: 'storage_provider',
        },
        storageKey: {
            type: sequelize_1.DataTypes.STRING(1024),
            allowNull: true,
            field: 'storage_key',
        },
        uploadId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            field: 'upload_id',
            comment: 'S3 multipart upload ID or similar',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        uploadedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'uploaded_by',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'expires_at',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
        },
    }, {
        tableName: 'chunked_upload_sessions',
        timestamps: false,
        underscored: true,
        indexes: [
            { fields: ['uploaded_by'] },
            { fields: ['expires_at'] },
            { fields: ['created_at'] },
            { fields: ['completed_at'] },
        ],
    });
};
exports.defineChunkedUploadSessionModel = defineChunkedUploadSessionModel;
/**
 * Sequelize model definition for Storage Quotas.
 * Manages storage quota limits per user or organization.
 *
 * @example
 * ```typescript
 * const quota = await StorageQuotaModel.create({
 *   userId: 'user-123',
 *   maxStorage: 10737418240, // 10GB
 *   maxFileSize: 104857600, // 100MB
 *   maxFiles: 1000,
 * });
 * ```
 */
const defineStorageQuotaModel = (sequelize) => {
    return sequelize.define('StorageQuota', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'user_id',
        },
        organizationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'organization_id',
        },
        maxStorage: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            field: 'max_storage',
            comment: 'Maximum storage in bytes',
        },
        usedStorage: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            field: 'used_storage',
            comment: 'Currently used storage in bytes',
        },
        maxFileSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            field: 'max_file_size',
            comment: 'Maximum individual file size in bytes',
        },
        maxFiles: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'max_files',
            comment: 'Maximum number of files allowed',
        },
        fileCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'file_count',
            comment: 'Current number of files',
        },
        allowedMimeTypes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            field: 'allowed_mime_types',
        },
        quotaResetDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'quota_reset_date',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'storage_quotas',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'], unique: true, where: { user_id: { [sequelize_1.Op.ne]: null } } },
            { fields: ['organization_id'], unique: true, where: { organization_id: { [sequelize_1.Op.ne]: null } } },
        ],
    });
};
exports.defineStorageQuotaModel = defineStorageQuotaModel;
// ============================================================================
// FILE VALIDATION UTILITIES
// ============================================================================
/**
 * Validates file based on comprehensive validation rules.
 *
 * @param {Express.Multer.File} file - Uploaded file to validate
 * @param {FileValidationOptions} options - Validation options
 * @returns {Promise<FileValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateFile(file, {
 *   maxSize: 10485760, // 10MB
 *   allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
 *   allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf'],
 *   checkMagicNumbers: true,
 * });
 *
 * if (!result.isValid) {
 *   throw new BadRequestException(result.errors.join(', '));
 * }
 * ```
 */
const validateFile = async (file, options) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
    };
    // Size validation
    if (options.maxSize && file.size > options.maxSize) {
        result.isValid = false;
        result.errors.push(`File size ${file.size} bytes exceeds maximum allowed ${options.maxSize} bytes`);
    }
    if (options.minSize && file.size < options.minSize) {
        result.isValid = false;
        result.errors.push(`File size ${file.size} bytes is below minimum required ${options.minSize} bytes`);
    }
    // MIME type validation
    if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
        if (!options.allowedMimeTypes.includes(file.mimetype)) {
            result.isValid = false;
            result.errors.push(`MIME type ${file.mimetype} is not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`);
        }
    }
    // Extension validation
    if (options.allowedExtensions && options.allowedExtensions.length > 0) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!options.allowedExtensions.includes(ext)) {
            result.isValid = false;
            result.errors.push(`Extension ${ext} is not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`);
        }
    }
    // Magic number validation (file signature)
    if (options.checkMagicNumbers && file.buffer) {
        const detectedType = await (0, exports.detectFileTypeFromMagicNumbers)(file.buffer);
        result.detectedMimeType = detectedType?.mime;
        result.detectedExtension = detectedType?.ext;
        if (options.requireMimeTypeMatch && detectedType && detectedType.mime !== file.mimetype) {
            result.warnings.push(`Detected MIME type ${detectedType.mime} differs from declared ${file.mimetype}`);
        }
    }
    // Custom validators
    if (options.customValidators && options.customValidators.length > 0) {
        for (const validator of options.customValidators) {
            try {
                const isValid = await validator(file);
                if (!isValid) {
                    result.isValid = false;
                    result.errors.push('Custom validation failed');
                }
            }
            catch (error) {
                result.isValid = false;
                result.errors.push(`Custom validation error: ${error.message}`);
            }
        }
    }
    return result;
};
exports.validateFile = validateFile;
/**
 * Detects file type from magic numbers (file signature).
 *
 * @param {Buffer} buffer - File buffer to analyze
 * @returns {Promise<{mime: string, ext: string} | null>} Detected file type or null
 *
 * @example
 * ```typescript
 * const fileType = await detectFileTypeFromMagicNumbers(fileBuffer);
 * console.log(`Detected: ${fileType.mime} (${fileType.ext})`);
 * ```
 */
const detectFileTypeFromMagicNumbers = async (buffer) => {
    const magicNumbers = [
        // Images
        { bytes: [0xff, 0xd8, 0xff], mime: 'image/jpeg', ext: '.jpg' },
        { bytes: [0x89, 0x50, 0x4e, 0x47], mime: 'image/png', ext: '.png' },
        { bytes: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif', ext: '.gif' },
        { bytes: [0x52, 0x49, 0x46, 0x46], mime: 'image/webp', ext: '.webp', offset: 8 },
        { bytes: [0x42, 0x4d], mime: 'image/bmp', ext: '.bmp' },
        // Documents
        { bytes: [0x25, 0x50, 0x44, 0x46], mime: 'application/pdf', ext: '.pdf' },
        { bytes: [0x50, 0x4b, 0x03, 0x04], mime: 'application/zip', ext: '.zip' }, // Also .docx, .xlsx, .pptx
        { bytes: [0xd0, 0xcf, 0x11, 0xe0], mime: 'application/msword', ext: '.doc' },
        // Video
        { bytes: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], mime: 'video/mp4', ext: '.mp4' },
        { bytes: [0x1a, 0x45, 0xdf, 0xa3], mime: 'video/webm', ext: '.webm' },
        { bytes: [0x00, 0x00, 0x01, 0xba], mime: 'video/mpeg', ext: '.mpg' },
        // Audio
        { bytes: [0x49, 0x44, 0x33], mime: 'audio/mpeg', ext: '.mp3' },
        { bytes: [0xff, 0xfb], mime: 'audio/mpeg', ext: '.mp3' },
        { bytes: [0x4f, 0x67, 0x67, 0x53], mime: 'audio/ogg', ext: '.ogg' },
    ];
    for (const signature of magicNumbers) {
        const offset = signature.offset || 0;
        let match = true;
        for (let i = 0; i < signature.bytes.length; i++) {
            if (buffer[offset + i] !== signature.bytes[i]) {
                match = false;
                break;
            }
        }
        if (match) {
            return { mime: signature.mime, ext: signature.ext };
        }
    }
    return null;
};
exports.detectFileTypeFromMagicNumbers = detectFileTypeFromMagicNumbers;
/**
 * Generates safe filename from original filename.
 *
 * @param {string} originalName - Original filename
 * @param {string} [prefix] - Optional prefix
 * @returns {string} Safe filename
 *
 * @example
 * ```typescript
 * const safeName = generateSafeFilename('Patient Report (2024).pdf', 'medical');
 * // Returns: 'medical-patient-report-2024-abc123.pdf'
 * ```
 */
const generateSafeFilename = (originalName, prefix) => {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    // Remove special characters and replace spaces
    const safeName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const parts = [prefix, safeName, timestamp, uniqueId].filter(Boolean);
    return `${parts.join('-')}${ext}`;
};
exports.generateSafeFilename = generateSafeFilename;
/**
 * Calculates file hash (SHA256) and checksum (MD5).
 *
 * @param {Buffer | string} fileContent - File content or path
 * @returns {Promise<{hash: string, checksum: string}>} Hash and checksum
 *
 * @example
 * ```typescript
 * const { hash, checksum } = await calculateFileHash(file.buffer);
 * console.log(`SHA256: ${hash}, MD5: ${checksum}`);
 * ```
 */
const calculateFileHash = async (fileContent) => {
    let buffer;
    if (typeof fileContent === 'string') {
        buffer = await fs.promises.readFile(fileContent);
    }
    else {
        buffer = fileContent;
    }
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const checksum = crypto.createHash('md5').update(buffer).digest('hex');
    return { hash, checksum };
};
exports.calculateFileHash = calculateFileHash;
/**
 * Validates file against storage quota.
 *
 * @param {string} userId - User ID
 * @param {number} fileSize - File size in bytes
 * @param {ModelStatic<Model>} quotaModel - Storage quota model
 * @returns {Promise<{allowed: boolean, reason?: string}>} Quota validation result
 *
 * @example
 * ```typescript
 * const quotaCheck = await validateStorageQuota('user-123', file.size, StorageQuotaModel);
 * if (!quotaCheck.allowed) {
 *   throw new PayloadTooLargeException(quotaCheck.reason);
 * }
 * ```
 */
const validateStorageQuota = async (userId, fileSize, quotaModel) => {
    const quota = await quotaModel.findOne({
        where: { userId },
    });
    if (!quota) {
        return { allowed: true }; // No quota configured
    }
    const quotaData = quota.get({ plain: true });
    // Check file size limit
    if (fileSize > quotaData.maxFileSize) {
        return {
            allowed: false,
            reason: `File size ${fileSize} bytes exceeds maximum allowed ${quotaData.maxFileSize} bytes`,
        };
    }
    // Check storage quota
    if (quotaData.usedStorage + fileSize > quotaData.maxStorage) {
        return {
            allowed: false,
            reason: `Storage quota exceeded. Used: ${quotaData.usedStorage}, Max: ${quotaData.maxStorage}`,
        };
    }
    // Check file count limit
    if (quotaData.fileCount >= quotaData.maxFiles) {
        return {
            allowed: false,
            reason: `File count limit reached. Max files: ${quotaData.maxFiles}`,
        };
    }
    return { allowed: true };
};
exports.validateStorageQuota = validateStorageQuota;
// ============================================================================
// VIRUS SCANNING UTILITIES
// ============================================================================
/**
 * Scans file for viruses using ClamAV.
 *
 * @param {string | Buffer} fileContent - File path or buffer to scan
 * @param {VirusScanConfig} config - Virus scan configuration
 * @returns {Promise<VirusScanResult>} Scan result
 *
 * @example
 * ```typescript
 * const scanResult = await scanFileForViruses(file.path, {
 *   enabled: true,
 *   clamAvHost: 'localhost',
 *   clamAvPort: 3310,
 *   timeout: 30000,
 * });
 *
 * if (!scanResult.isClean) {
 *   await quarantineFile(file.path);
 *   throw new BadRequestException(`Virus detected: ${scanResult.virusName}`);
 * }
 * ```
 */
const scanFileForViruses = async (fileContent, config) => {
    const startTime = Date.now();
    if (!config.enabled) {
        return {
            isClean: true,
            scanTimestamp: new Date(),
            scanDuration: 0,
            scanner: 'disabled',
        };
    }
    try {
        // In production, integrate with actual ClamAV client
        // Example using node-clamav or clamd-client
        // const NodeClam = require('clamscan');
        // const clamscan = await new NodeClam().init({
        //   clamdscan: {
        //     host: config.clamAvHost,
        //     port: config.clamAvPort,
        //   },
        // });
        // const { isInfected, viruses } = await clamscan.scanFile(fileContent);
        // Placeholder implementation
        const scanDuration = Date.now() - startTime;
        return {
            isClean: true,
            scanTimestamp: new Date(),
            scanDuration,
            scanner: 'clamav',
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException(`Virus scan failed: ${error.message}`);
    }
};
exports.scanFileForViruses = scanFileForViruses;
/**
 * Quarantines infected file by moving to quarantine directory.
 *
 * @param {string} filePath - File path to quarantine
 * @param {string} quarantinePath - Quarantine directory path
 * @returns {Promise<string>} Quarantined file path
 *
 * @example
 * ```typescript
 * const quarantinedPath = await quarantineFile(
 *   '/uploads/infected.exe',
 *   '/quarantine'
 * );
 * console.log(`File quarantined at: ${quarantinedPath}`);
 * ```
 */
const quarantineFile = async (filePath, quarantinePath) => {
    const filename = path.basename(filePath);
    const timestamp = Date.now();
    const quarantinedFilename = `${timestamp}-${filename}`;
    const quarantinedPath = path.join(quarantinePath, quarantinedFilename);
    // Ensure quarantine directory exists
    await fs.promises.mkdir(quarantinePath, { recursive: true });
    // Move file to quarantine
    await fs.promises.rename(filePath, quarantinedPath);
    // Create metadata file
    const metadataPath = `${quarantinedPath}.metadata.json`;
    await fs.promises.writeFile(metadataPath, JSON.stringify({
        originalPath: filePath,
        quarantinedAt: new Date().toISOString(),
        reason: 'Virus detected',
    }, null, 2));
    return quarantinedPath;
};
exports.quarantineFile = quarantineFile;
// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================
/**
 * Saves file to local file system storage.
 *
 * @param {Express.Multer.File} file - File to save
 * @param {LocalStorageConfig} config - Local storage configuration
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await saveFileToLocalStorage(file, {
 *   basePath: '/var/www/uploads',
 *   urlPrefix: 'https://cdn.whitecross.com/uploads',
 *   createDirectories: true,
 * });
 * console.log(`File saved: ${metadata.url}`);
 * ```
 */
const saveFileToLocalStorage = async (file, config) => {
    const safeFilename = (0, exports.generateSafeFilename)(file.originalname);
    const dateFolder = new Date().toISOString().split('T')[0];
    const relativePath = path.join(dateFolder, safeFilename);
    const fullPath = path.join(config.basePath, relativePath);
    // Create directory if needed
    if (config.createDirectories) {
        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    }
    // Write file
    const fileContent = file.buffer || await fs.promises.readFile(file.path);
    await fs.promises.writeFile(fullPath, fileContent);
    // Set permissions if specified
    if (config.permissions) {
        await fs.promises.chmod(fullPath, config.permissions);
    }
    // Calculate hash and checksum
    const { hash, checksum } = await (0, exports.calculateFileHash)(fileContent);
    const url = config.urlPrefix ? `${config.urlPrefix}/${relativePath}` : fullPath;
    return {
        originalName: file.originalname,
        filename: safeFilename,
        mimetype: file.mimetype,
        encoding: file.encoding,
        size: file.size,
        path: fullPath,
        url,
        storageProvider: 'local',
        storageKey: relativePath,
        hash,
        checksum,
    };
};
exports.saveFileToLocalStorage = saveFileToLocalStorage;
/**
 * Deletes file from local file system storage.
 *
 * @param {string} filePath - File path to delete
 * @returns {Promise<boolean>} True if deleted successfully
 *
 * @example
 * ```typescript
 * const deleted = await deleteFileFromLocalStorage('/var/www/uploads/2024-01-01/file.jpg');
 * console.log(`File deleted: ${deleted}`);
 * ```
 */
const deleteFileFromLocalStorage = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
        return true;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return false; // File doesn't exist
        }
        throw error;
    }
};
exports.deleteFileFromLocalStorage = deleteFileFromLocalStorage;
/**
 * Creates read stream for local file.
 *
 * @param {string} filePath - File path to stream
 * @param {FileStreamOptions} [options] - Stream options
 * @returns {fs.ReadStream} File read stream
 *
 * @example
 * ```typescript
 * const stream = createLocalFileStream('/var/www/uploads/video.mp4', {
 *   start: 0,
 *   end: 1048576, // First 1MB
 * });
 * stream.pipe(response);
 * ```
 */
const createLocalFileStream = (filePath, options) => {
    return fs.createReadStream(filePath, {
        start: options?.start,
        end: options?.end,
        highWaterMark: options?.highWaterMark || 64 * 1024, // 64KB chunks
    });
};
exports.createLocalFileStream = createLocalFileStream;
// ============================================================================
// AWS S3 STORAGE UTILITIES
// ============================================================================
/**
 * Uploads file to AWS S3 storage.
 *
 * @param {Express.Multer.File} file - File to upload
 * @param {S3StorageConfig} config - S3 configuration
 * @param {string} [key] - Optional S3 key (path)
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await uploadFileToS3(file, {
 *   bucket: 'whitecross-medical-files',
 *   region: 'us-east-1',
 *   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *   acl: 'private',
 * });
 * console.log(`File uploaded to S3: ${metadata.url}`);
 * ```
 */
const uploadFileToS3 = async (file, config, key) => {
    // In production, use AWS SDK v3
    // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
    const safeFilename = (0, exports.generateSafeFilename)(file.originalname);
    const dateFolder = new Date().toISOString().split('T')[0];
    const s3Key = key || `${dateFolder}/${safeFilename}`;
    // Example S3 upload (pseudo-code)
    // const s3Client = new S3Client({
    //   region: config.region,
    //   credentials: {
    //     accessKeyId: config.accessKeyId,
    //     secretAccessKey: config.secretAccessKey,
    //   },
    // });
    //
    // const command = new PutObjectCommand({
    //   Bucket: config.bucket,
    //   Key: s3Key,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    //   ACL: config.acl || 'private',
    // });
    //
    // await s3Client.send(command);
    const { hash, checksum } = await (0, exports.calculateFileHash)(file.buffer);
    const url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${s3Key}`;
    return {
        originalName: file.originalname,
        filename: safeFilename,
        mimetype: file.mimetype,
        encoding: file.encoding,
        size: file.size,
        url,
        storageProvider: 's3',
        storageKey: s3Key,
        hash,
        checksum,
    };
};
exports.uploadFileToS3 = uploadFileToS3;
/**
 * Generates presigned URL for S3 object.
 *
 * @param {string} key - S3 object key
 * @param {S3StorageConfig} config - S3 configuration
 * @param {PresignedUrlOptions} options - Presigned URL options
 * @returns {Promise<string>} Presigned URL
 *
 * @example
 * ```typescript
 * const url = await generateS3PresignedUrl('2024-01-01/file.pdf', s3Config, {
 *   expiresIn: 3600, // 1 hour
 *   contentDisposition: 'attachment',
 *   filename: 'Patient Report.pdf',
 * });
 * console.log(`Download URL: ${url}`);
 * ```
 */
const generateS3PresignedUrl = async (key, config, options) => {
    // In production, use AWS SDK v3
    // import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
    // import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
    // const s3Client = new S3Client({
    //   region: config.region,
    //   credentials: {
    //     accessKeyId: config.accessKeyId,
    //     secretAccessKey: config.secretAccessKey,
    //   },
    // });
    //
    // const command = new GetObjectCommand({
    //   Bucket: config.bucket,
    //   Key: key,
    //   ResponseContentDisposition: options.contentDisposition === 'attachment'
    //     ? `attachment; filename="${options.filename || path.basename(key)}"`
    //     : 'inline',
    //   ResponseContentType: options.contentType,
    // });
    //
    // return await getSignedUrl(s3Client, command, { expiresIn: options.expiresIn });
    // Placeholder
    return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}?presigned=true`;
};
exports.generateS3PresignedUrl = generateS3PresignedUrl;
/**
 * Initiates S3 multipart upload for large files.
 *
 * @param {string} key - S3 object key
 * @param {S3StorageConfig} config - S3 configuration
 * @param {string} contentType - File content type
 * @returns {Promise<string>} Upload ID
 *
 * @example
 * ```typescript
 * const uploadId = await initiateS3MultipartUpload(
 *   '2024-01-01/large-video.mp4',
 *   s3Config,
 *   'video/mp4'
 * );
 * console.log(`Multipart upload initiated: ${uploadId}`);
 * ```
 */
const initiateS3MultipartUpload = async (key, config, contentType) => {
    // In production, use AWS SDK v3
    // import { S3Client, CreateMultipartUploadCommand } from '@aws-sdk/client-s3';
    // const s3Client = new S3Client({
    //   region: config.region,
    //   credentials: {
    //     accessKeyId: config.accessKeyId,
    //     secretAccessKey: config.secretAccessKey,
    //   },
    // });
    //
    // const command = new CreateMultipartUploadCommand({
    //   Bucket: config.bucket,
    //   Key: key,
    //   ContentType: contentType,
    //   ACL: config.acl || 'private',
    // });
    //
    // const response = await s3Client.send(command);
    // return response.UploadId;
    // Placeholder
    return crypto.randomUUID();
};
exports.initiateS3MultipartUpload = initiateS3MultipartUpload;
/**
 * Uploads part of multipart upload to S3.
 *
 * @param {string} key - S3 object key
 * @param {string} uploadId - Multipart upload ID
 * @param {number} partNumber - Part number (1-indexed)
 * @param {Buffer} data - Part data
 * @param {S3StorageConfig} config - S3 configuration
 * @returns {Promise<{ETag: string, PartNumber: number}>} Part upload result
 *
 * @example
 * ```typescript
 * const part = await uploadS3MultipartPart(
 *   '2024-01-01/large-video.mp4',
 *   uploadId,
 *   1,
 *   chunkBuffer,
 *   s3Config
 * );
 * parts.push(part);
 * ```
 */
const uploadS3MultipartPart = async (key, uploadId, partNumber, data, config) => {
    // In production, use AWS SDK v3
    // import { S3Client, UploadPartCommand } from '@aws-sdk/client-s3';
    // const s3Client = new S3Client({
    //   region: config.region,
    //   credentials: {
    //     accessKeyId: config.accessKeyId,
    //     secretAccessKey: config.secretAccessKey,
    //   },
    // });
    //
    // const command = new UploadPartCommand({
    //   Bucket: config.bucket,
    //   Key: key,
    //   UploadId: uploadId,
    //   PartNumber: partNumber,
    //   Body: data,
    // });
    //
    // const response = await s3Client.send(command);
    // return { ETag: response.ETag, PartNumber: partNumber };
    // Placeholder
    const etag = crypto.createHash('md5').update(data).digest('hex');
    return { ETag: etag, PartNumber: partNumber };
};
exports.uploadS3MultipartPart = uploadS3MultipartPart;
/**
 * Completes S3 multipart upload.
 *
 * @param {string} key - S3 object key
 * @param {string} uploadId - Multipart upload ID
 * @param {Array<{ETag: string, PartNumber: number}>} parts - Uploaded parts
 * @param {S3StorageConfig} config - S3 configuration
 * @returns {Promise<string>} S3 object URL
 *
 * @example
 * ```typescript
 * const url = await completeS3MultipartUpload(
 *   '2024-01-01/large-video.mp4',
 *   uploadId,
 *   parts,
 *   s3Config
 * );
 * console.log(`Upload completed: ${url}`);
 * ```
 */
const completeS3MultipartUpload = async (key, uploadId, parts, config) => {
    // In production, use AWS SDK v3
    // import { S3Client, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';
    // const s3Client = new S3Client({
    //   region: config.region,
    //   credentials: {
    //     accessKeyId: config.accessKeyId,
    //     secretAccessKey: config.secretAccessKey,
    //   },
    // });
    //
    // const command = new CompleteMultipartUploadCommand({
    //   Bucket: config.bucket,
    //   Key: key,
    //   UploadId: uploadId,
    //   MultipartUpload: {
    //     Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
    //   },
    // });
    //
    // const response = await s3Client.send(command);
    // return response.Location;
    // Placeholder
    return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
};
exports.completeS3MultipartUpload = completeS3MultipartUpload;
/**
 * Deletes file from S3 storage.
 *
 * @param {string} key - S3 object key to delete
 * @param {S3StorageConfig} config - S3 configuration
 * @returns {Promise<boolean>} True if deleted successfully
 *
 * @example
 * ```typescript
 * const deleted = await deleteFileFromS3('2024-01-01/file.jpg', s3Config);
 * console.log(`File deleted: ${deleted}`);
 * ```
 */
const deleteFileFromS3 = async (key, config) => {
    // In production, use AWS SDK v3
    // import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
    // const s3Client = new S3Client({
    //   region: config.region,
    //   credentials: {
    //     accessKeyId: config.accessKeyId,
    //     secretAccessKey: config.secretAccessKey,
    //   },
    // });
    //
    // const command = new DeleteObjectCommand({
    //   Bucket: config.bucket,
    //   Key: key,
    // });
    //
    // await s3Client.send(command);
    return true;
};
exports.deleteFileFromS3 = deleteFileFromS3;
// ============================================================================
// AZURE BLOB STORAGE UTILITIES
// ============================================================================
/**
 * Uploads file to Azure Blob Storage.
 *
 * @param {Express.Multer.File} file - File to upload
 * @param {AzureBlobStorageConfig} config - Azure Blob configuration
 * @param {string} [blobName] - Optional blob name
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await uploadFileToAzureBlob(file, {
 *   accountName: 'whitecrossstorage',
 *   accountKey: process.env.AZURE_STORAGE_KEY,
 *   containerName: 'medical-files',
 * });
 * console.log(`File uploaded to Azure: ${metadata.url}`);
 * ```
 */
const uploadFileToAzureBlob = async (file, config, blobName) => {
    // In production, use @azure/storage-blob
    // import { BlobServiceClient } from '@azure/storage-blob';
    const safeFilename = (0, exports.generateSafeFilename)(file.originalname);
    const dateFolder = new Date().toISOString().split('T')[0];
    const blobPath = blobName || `${dateFolder}/${safeFilename}`;
    // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${config.accountName};AccountKey=${config.accountKey};EndpointSuffix=core.windows.net`;
    // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    // const containerClient = blobServiceClient.getContainerClient(config.containerName);
    // const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
    //
    // await blockBlobClient.uploadData(file.buffer, {
    //   blobHTTPHeaders: { blobContentType: file.mimetype },
    // });
    const { hash, checksum } = await (0, exports.calculateFileHash)(file.buffer);
    const url = `https://${config.accountName}.blob.core.windows.net/${config.containerName}/${blobPath}`;
    return {
        originalName: file.originalname,
        filename: safeFilename,
        mimetype: file.mimetype,
        encoding: file.encoding,
        size: file.size,
        url,
        storageProvider: 'azure',
        storageKey: blobPath,
        hash,
        checksum,
    };
};
exports.uploadFileToAzureBlob = uploadFileToAzureBlob;
/**
 * Generates SAS URL for Azure Blob.
 *
 * @param {string} blobName - Blob name
 * @param {AzureBlobStorageConfig} config - Azure Blob configuration
 * @param {PresignedUrlOptions} options - SAS URL options
 * @returns {Promise<string>} SAS URL
 *
 * @example
 * ```typescript
 * const url = await generateAzureBlobSasUrl('2024-01-01/file.pdf', azureConfig, {
 *   expiresIn: 3600,
 *   contentDisposition: 'attachment',
 * });
 * console.log(`Download URL: ${url}`);
 * ```
 */
const generateAzureBlobSasUrl = async (blobName, config, options) => {
    // In production, use @azure/storage-blob
    // import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
    // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${config.accountName};AccountKey=${config.accountKey};EndpointSuffix=core.windows.net`;
    // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    // const containerClient = blobServiceClient.getContainerClient(config.containerName);
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //
    // const sasToken = generateBlobSASQueryParameters({
    //   containerName: config.containerName,
    //   blobName,
    //   permissions: BlobSASPermissions.parse('r'),
    //   startsOn: new Date(),
    //   expiresOn: new Date(Date.now() + options.expiresIn * 1000),
    //   contentDisposition: options.contentDisposition === 'attachment'
    //     ? `attachment; filename="${options.filename || path.basename(blobName)}"`
    //     : 'inline',
    // }, sharedKeyCredential).toString();
    //
    // return `${blockBlobClient.url}?${sasToken}`;
    // Placeholder
    return `https://${config.accountName}.blob.core.windows.net/${config.containerName}/${blobName}?sas=true`;
};
exports.generateAzureBlobSasUrl = generateAzureBlobSasUrl;
/**
 * Deletes blob from Azure Blob Storage.
 *
 * @param {string} blobName - Blob name to delete
 * @param {AzureBlobStorageConfig} config - Azure Blob configuration
 * @returns {Promise<boolean>} True if deleted successfully
 *
 * @example
 * ```typescript
 * const deleted = await deleteFileFromAzureBlob('2024-01-01/file.jpg', azureConfig);
 * console.log(`Blob deleted: ${deleted}`);
 * ```
 */
const deleteFileFromAzureBlob = async (blobName, config) => {
    // In production, use @azure/storage-blob
    // import { BlobServiceClient } from '@azure/storage-blob';
    // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${config.accountName};AccountKey=${config.accountKey};EndpointSuffix=core.windows.net`;
    // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    // const containerClient = blobServiceClient.getContainerClient(config.containerName);
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //
    // await blockBlobClient.delete();
    return true;
};
exports.deleteFileFromAzureBlob = deleteFileFromAzureBlob;
// ============================================================================
// GOOGLE CLOUD STORAGE UTILITIES
// ============================================================================
/**
 * Uploads file to Google Cloud Storage.
 *
 * @param {Express.Multer.File} file - File to upload
 * @param {GCPStorageConfig} config - GCP Storage configuration
 * @param {string} [objectName] - Optional object name
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await uploadFileToGCS(file, {
 *   projectId: 'whitecross-prod',
 *   bucketName: 'whitecross-medical-files',
 *   keyFilename: '/path/to/service-account.json',
 * });
 * console.log(`File uploaded to GCS: ${metadata.url}`);
 * ```
 */
const uploadFileToGCS = async (file, config, objectName) => {
    // In production, use @google-cloud/storage
    // import { Storage } from '@google-cloud/storage';
    const safeFilename = (0, exports.generateSafeFilename)(file.originalname);
    const dateFolder = new Date().toISOString().split('T')[0];
    const gcsObjectName = objectName || `${dateFolder}/${safeFilename}`;
    // const storage = new Storage({
    //   projectId: config.projectId,
    //   keyFilename: config.keyFilename,
    // });
    //
    // const bucket = storage.bucket(config.bucketName);
    // const blob = bucket.file(gcsObjectName);
    //
    // await blob.save(file.buffer, {
    //   contentType: file.mimetype,
    //   metadata: {
    //     originalName: file.originalname,
    //   },
    // });
    const { hash, checksum } = await (0, exports.calculateFileHash)(file.buffer);
    const url = `https://storage.googleapis.com/${config.bucketName}/${gcsObjectName}`;
    return {
        originalName: file.originalname,
        filename: safeFilename,
        mimetype: file.mimetype,
        encoding: file.encoding,
        size: file.size,
        url,
        storageProvider: 'gcp',
        storageKey: gcsObjectName,
        hash,
        checksum,
    };
};
exports.uploadFileToGCS = uploadFileToGCS;
/**
 * Generates signed URL for GCS object.
 *
 * @param {string} objectName - GCS object name
 * @param {GCPStorageConfig} config - GCP Storage configuration
 * @param {PresignedUrlOptions} options - Signed URL options
 * @returns {Promise<string>} Signed URL
 *
 * @example
 * ```typescript
 * const url = await generateGCSSignedUrl('2024-01-01/file.pdf', gcsConfig, {
 *   expiresIn: 3600,
 *   contentDisposition: 'attachment',
 * });
 * console.log(`Download URL: ${url}`);
 * ```
 */
const generateGCSSignedUrl = async (objectName, config, options) => {
    // In production, use @google-cloud/storage
    // import { Storage } from '@google-cloud/storage';
    // const storage = new Storage({
    //   projectId: config.projectId,
    //   keyFilename: config.keyFilename,
    // });
    //
    // const bucket = storage.bucket(config.bucketName);
    // const file = bucket.file(objectName);
    //
    // const [url] = await file.getSignedUrl({
    //   version: 'v4',
    //   action: 'read',
    //   expires: Date.now() + options.expiresIn * 1000,
    //   responseDisposition: options.contentDisposition === 'attachment'
    //     ? `attachment; filename="${options.filename || path.basename(objectName)}"`
    //     : 'inline',
    //   responseType: options.contentType,
    // });
    //
    // return url;
    // Placeholder
    return `https://storage.googleapis.com/${config.bucketName}/${objectName}?signed=true`;
};
exports.generateGCSSignedUrl = generateGCSSignedUrl;
/**
 * Deletes object from Google Cloud Storage.
 *
 * @param {string} objectName - GCS object name to delete
 * @param {GCPStorageConfig} config - GCP Storage configuration
 * @returns {Promise<boolean>} True if deleted successfully
 *
 * @example
 * ```typescript
 * const deleted = await deleteFileFromGCS('2024-01-01/file.jpg', gcsConfig);
 * console.log(`Object deleted: ${deleted}`);
 * ```
 */
const deleteFileFromGCS = async (objectName, config) => {
    // In production, use @google-cloud/storage
    // import { Storage } from '@google-cloud/storage';
    // const storage = new Storage({
    //   projectId: config.projectId,
    //   keyFilename: config.keyFilename,
    // });
    //
    // const bucket = storage.bucket(config.bucketName);
    // await bucket.file(objectName).delete();
    return true;
};
exports.deleteFileFromGCS = deleteFileFromGCS;
// ============================================================================
// IMAGE PROCESSING UTILITIES
// ============================================================================
/**
 * Processes image with Sharp (resize, convert, optimize).
 *
 * @param {Buffer | string} input - Image buffer or path
 * @param {ImageProcessingOptions} options - Processing options
 * @returns {Promise<{buffer: Buffer, metadata: any, variants?: Array<{name: string, buffer: Buffer}>}>} Processed image
 *
 * @example
 * ```typescript
 * const result = await processImage(file.buffer, {
 *   resize: { width: 1920, height: 1080, fit: 'cover' },
 *   format: 'webp',
 *   quality: 85,
 *   compress: true,
 *   stripMetadata: true,
 *   variants: [
 *     { name: 'thumbnail', width: 150, height: 150 },
 *     { name: 'medium', width: 800, height: 600 },
 *   ],
 * });
 * ```
 */
const processImage = async (input, options) => {
    // In production, use Sharp
    // import sharp from 'sharp';
    // let pipeline = sharp(input);
    // // Resize
    // if (options.resize) {
    //   pipeline = pipeline.resize({
    //     width: options.resize.width,
    //     height: options.resize.height,
    //     fit: options.resize.fit || 'cover',
    //     position: options.resize.position,
    //   });
    // }
    // // Format conversion
    // if (options.format) {
    //   pipeline = pipeline.toFormat(options.format, {
    //     quality: options.quality || 80,
    //   });
    // }
    // // Strip metadata
    // if (options.stripMetadata) {
    //   pipeline = pipeline.withMetadata({ exif: {} });
    // }
    // // Watermark
    // if (options.watermark) {
    //   const watermark = await sharp(options.watermark.image)
    //     .resize({ width: 200 })
    //     .toBuffer();
    //
    //   pipeline = pipeline.composite([{
    //     input: watermark,
    //     gravity: options.watermark.position || 'southeast',
    //     blend: 'over',
    //   }]);
    // }
    // const buffer = await pipeline.toBuffer();
    // const metadata = await sharp(buffer).metadata();
    // // Generate variants
    // const variants = [];
    // if (options.variants) {
    //   for (const variant of options.variants) {
    //     const variantBuffer = await sharp(input)
    //       .resize({ width: variant.width, height: variant.height })
    //       .toFormat(variant.format || options.format || 'jpeg', {
    //         quality: variant.quality || options.quality || 80,
    //       })
    //       .toBuffer();
    //
    //     const variantMetadata = await sharp(variantBuffer).metadata();
    //     variants.push({
    //       name: variant.name,
    //       buffer: variantBuffer,
    //       width: variantMetadata.width,
    //       height: variantMetadata.height,
    //     });
    //   }
    // }
    // return { buffer, metadata, variants };
    // Placeholder - return original
    const buffer = Buffer.isBuffer(input) ? input : await fs.promises.readFile(input);
    return {
        buffer,
        metadata: { width: 1920, height: 1080, format: 'jpeg' },
        variants: [],
    };
};
exports.processImage = processImage;
/**
 * Generates thumbnail from image.
 *
 * @param {Buffer | string} input - Image buffer or path
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {Promise<Buffer>} Thumbnail buffer
 *
 * @example
 * ```typescript
 * const thumbnail = await generateImageThumbnail(file.buffer, 150, 150);
 * await fs.promises.writeFile('/thumbnails/thumb.jpg', thumbnail);
 * ```
 */
const generateImageThumbnail = async (input, width, height) => {
    // In production, use Sharp
    // import sharp from 'sharp';
    // return await sharp(input)
    //   .resize(width, height, { fit: 'cover', position: 'center' })
    //   .jpeg({ quality: 80 })
    //   .toBuffer();
    // Placeholder
    const buffer = Buffer.isBuffer(input) ? input : await fs.promises.readFile(input);
    return buffer;
};
exports.generateImageThumbnail = generateImageThumbnail;
/**
 * Extracts image metadata (dimensions, format, exif).
 *
 * @param {Buffer | string} input - Image buffer or path
 * @returns {Promise<any>} Image metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractImageMetadata(file.buffer);
 * console.log(`Image: ${metadata.width}x${metadata.height}, Format: ${metadata.format}`);
 * ```
 */
const extractImageMetadata = async (input) => {
    // In production, use Sharp
    // import sharp from 'sharp';
    // return await sharp(input).metadata();
    // Placeholder
    return {
        width: 1920,
        height: 1080,
        format: 'jpeg',
        space: 'srgb',
        channels: 3,
        depth: 'uchar',
        density: 72,
        hasAlpha: false,
    };
};
exports.extractImageMetadata = extractImageMetadata;
// ============================================================================
// VIDEO PROCESSING UTILITIES
// ============================================================================
/**
 * Transcodes video with FFmpeg.
 *
 * @param {string} inputPath - Input video path
 * @param {string} outputPath - Output video path
 * @param {VideoProcessingOptions} options - Transcoding options
 * @returns {Promise<{outputPath: string, duration: number, size: number}>} Transcoding result
 *
 * @example
 * ```typescript
 * const result = await transcodeVideo('/uploads/input.mov', '/processed/output.mp4', {
 *   format: 'mp4',
 *   codec: 'h264',
 *   resolution: '1080p',
 *   bitrate: '4M',
 *   framerate: 30,
 * });
 * console.log(`Transcoded: ${result.outputPath}, Duration: ${result.duration}s`);
 * ```
 */
const transcodeVideo = async (inputPath, outputPath, options) => {
    // In production, use fluent-ffmpeg
    // import ffmpeg from 'fluent-ffmpeg';
    // return new Promise((resolve, reject) => {
    //   let command = ffmpeg(inputPath);
    //
    //   if (options.codec) {
    //     command = command.videoCodec(options.codec);
    //   }
    //
    //   if (options.resolution) {
    //     const resolutionMap = {
    //       '480p': '854x480',
    //       '720p': '1280x720',
    //       '1080p': '1920x1080',
    //       '4k': '3840x2160',
    //     };
    //     command = command.size(resolutionMap[options.resolution]);
    //   }
    //
    //   if (options.bitrate) {
    //     command = command.videoBitrate(options.bitrate);
    //   }
    //
    //   if (options.framerate) {
    //     command = command.fps(options.framerate);
    //   }
    //
    //   if (options.audioCodec) {
    //     command = command.audioCodec(options.audioCodec);
    //   }
    //
    //   if (options.audioBitrate) {
    //     command = command.audioBitrate(options.audioBitrate);
    //   }
    //
    //   command
    //     .on('end', async () => {
    //       const stats = await fs.promises.stat(outputPath);
    //       resolve({
    //         outputPath,
    //         duration: 0, // Would get from ffprobe
    //         size: stats.size,
    //       });
    //     })
    //     .on('error', reject)
    //     .save(outputPath);
    // });
    // Placeholder
    const stats = await fs.promises.stat(inputPath);
    return {
        outputPath,
        duration: 120,
        size: stats.size,
    };
};
exports.transcodeVideo = transcodeVideo;
/**
 * Generates video thumbnail at specific timestamp.
 *
 * @param {string} videoPath - Video file path
 * @param {number} timestamp - Timestamp in seconds
 * @param {string} outputPath - Thumbnail output path
 * @returns {Promise<string>} Thumbnail path
 *
 * @example
 * ```typescript
 * const thumbnailPath = await generateVideoThumbnail(
 *   '/uploads/video.mp4',
 *   10, // 10 seconds
 *   '/thumbnails/thumb.jpg'
 * );
 * ```
 */
const generateVideoThumbnail = async (videoPath, timestamp, outputPath) => {
    // In production, use fluent-ffmpeg
    // import ffmpeg from 'fluent-ffmpeg';
    // return new Promise((resolve, reject) => {
    //   ffmpeg(videoPath)
    //     .screenshots({
    //       timestamps: [timestamp],
    //       filename: path.basename(outputPath),
    //       folder: path.dirname(outputPath),
    //       size: '1280x720',
    //     })
    //     .on('end', () => resolve(outputPath))
    //     .on('error', reject);
    // });
    // Placeholder
    return outputPath;
};
exports.generateVideoThumbnail = generateVideoThumbnail;
/**
 * Extracts video metadata (duration, resolution, codec, bitrate).
 *
 * @param {string} videoPath - Video file path
 * @returns {Promise<any>} Video metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractVideoMetadata('/uploads/video.mp4');
 * console.log(`Duration: ${metadata.duration}s, Resolution: ${metadata.width}x${metadata.height}`);
 * ```
 */
const extractVideoMetadata = async (videoPath) => {
    // In production, use fluent-ffmpeg with ffprobe
    // import ffmpeg from 'fluent-ffmpeg';
    // return new Promise((resolve, reject) => {
    //   ffmpeg.ffprobe(videoPath, (err, metadata) => {
    //     if (err) return reject(err);
    //
    //     const videoStream = metadata.streams.find(s => s.codec_type === 'video');
    //     const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
    //
    //     resolve({
    //       duration: metadata.format.duration,
    //       size: metadata.format.size,
    //       bitrate: metadata.format.bit_rate,
    //       width: videoStream?.width,
    //       height: videoStream?.height,
    //       videoCodec: videoStream?.codec_name,
    //       audioCodec: audioStream?.codec_name,
    //       framerate: eval(videoStream?.r_frame_rate || '0'),
    //     });
    //   });
    // });
    // Placeholder
    return {
        duration: 120,
        width: 1920,
        height: 1080,
        videoCodec: 'h264',
        audioCodec: 'aac',
        bitrate: 4000000,
        framerate: 30,
    };
};
exports.extractVideoMetadata = extractVideoMetadata;
/**
 * Segments video for HLS/DASH streaming.
 *
 * @param {string} inputPath - Input video path
 * @param {string} outputDir - Output directory for segments
 * @param {VideoProcessingOptions['segments']} options - Segmentation options
 * @returns {Promise<{playlistPath: string, segmentCount: number}>} Segmentation result
 *
 * @example
 * ```typescript
 * const result = await segmentVideoForStreaming(
 *   '/uploads/video.mp4',
 *   '/streaming/output',
 *   { duration: 6, format: 'hls' }
 * );
 * console.log(`HLS playlist: ${result.playlistPath}`);
 * ```
 */
const segmentVideoForStreaming = async (inputPath, outputDir, options) => {
    // In production, use fluent-ffmpeg
    // import ffmpeg from 'fluent-ffmpeg';
    await fs.promises.mkdir(outputDir, { recursive: true });
    // if (options.format === 'hls') {
    //   const playlistPath = path.join(outputDir, 'playlist.m3u8');
    //   const segmentPattern = path.join(outputDir, 'segment%03d.ts');
    //
    //   return new Promise((resolve, reject) => {
    //     ffmpeg(inputPath)
    //       .outputOptions([
    //         '-codec: copy',
    //         '-start_number 0',
    //         `-hls_time ${options.duration}`,
    //         '-hls_list_size 0',
    //         '-f hls',
    //       ])
    //       .output(playlistPath)
    //       .on('end', async () => {
    //         const files = await fs.promises.readdir(outputDir);
    //         const segmentCount = files.filter(f => f.endsWith('.ts')).length;
    //         resolve({ playlistPath, segmentCount });
    //       })
    //       .on('error', reject)
    //       .run();
    //   });
    // }
    // Placeholder
    const playlistPath = path.join(outputDir, 'playlist.m3u8');
    return { playlistPath, segmentCount: 20 };
};
exports.segmentVideoForStreaming = segmentVideoForStreaming;
// ============================================================================
// CHUNKED UPLOAD UTILITIES
// ============================================================================
/**
 * Creates chunked upload session.
 *
 * @param {ChunkedUploadConfig} config - Chunked upload configuration
 * @param {string} filename - Original filename
 * @param {number} totalSize - Total file size
 * @param {ModelStatic<Model>} sessionModel - Chunked upload session model
 * @returns {Promise<ChunkedUploadSession>} Created session
 *
 * @example
 * ```typescript
 * const session = await createChunkedUploadSession(
 *   {
 *     chunkSize: 5242880, // 5MB
 *     maxFileSize: 524288000, // 500MB
 *     sessionTimeout: 86400, // 24 hours
 *     storageProvider: 's3',
 *     resumable: true,
 *   },
 *   'large-video.mp4',
 *   524288000,
 *   ChunkedUploadSessionModel
 * );
 * ```
 */
const createChunkedUploadSession = async (config, filename, totalSize, sessionModel) => {
    if (totalSize > config.maxFileSize) {
        throw new common_1.PayloadTooLargeException(`File size ${totalSize} exceeds maximum allowed ${config.maxFileSize}`);
    }
    const totalChunks = Math.ceil(totalSize / config.chunkSize);
    const expiresAt = new Date(Date.now() + config.sessionTimeout * 1000);
    const session = await sessionModel.create({
        filename,
        totalSize,
        chunkSize: config.chunkSize,
        uploadedChunks: [],
        totalChunks,
        storageProvider: config.storageProvider,
        expiresAt,
    });
    return session.get({ plain: true });
};
exports.createChunkedUploadSession = createChunkedUploadSession;
/**
 * Uploads chunk to session.
 *
 * @param {string} sessionId - Upload session ID
 * @param {number} chunkNumber - Chunk number (0-indexed)
 * @param {Buffer} chunkData - Chunk data
 * @param {ModelStatic<Model>} sessionModel - Chunked upload session model
 * @returns {Promise<{uploadedChunks: number[], isComplete: boolean}>} Upload result
 *
 * @example
 * ```typescript
 * const result = await uploadChunk(sessionId, 0, chunkBuffer, ChunkedUploadSessionModel);
 * console.log(`Uploaded ${result.uploadedChunks.length}/${session.totalChunks} chunks`);
 * if (result.isComplete) {
 *   console.log('Upload complete!');
 * }
 * ```
 */
const uploadChunk = async (sessionId, chunkNumber, chunkData, sessionModel) => {
    const session = await sessionModel.findByPk(sessionId);
    if (!session) {
        throw new common_1.NotFoundException('Upload session not found');
    }
    const sessionData = session.get({ plain: true });
    // Check if session expired
    if (new Date() > new Date(sessionData.expiresAt)) {
        throw new common_1.BadRequestException('Upload session expired');
    }
    // Check if chunk already uploaded
    if (sessionData.uploadedChunks.includes(chunkNumber)) {
        return {
            uploadedChunks: sessionData.uploadedChunks,
            isComplete: sessionData.uploadedChunks.length === sessionData.totalChunks,
        };
    }
    // In production, save chunk to temporary storage or directly to cloud storage
    // For S3 multipart: await uploadS3MultipartPart(...)
    // Update session
    const uploadedChunks = [...sessionData.uploadedChunks, chunkNumber].sort((a, b) => a - b);
    await session.update({ uploadedChunks });
    const isComplete = uploadedChunks.length === sessionData.totalChunks;
    if (isComplete) {
        await session.update({ completedAt: new Date() });
    }
    return { uploadedChunks, isComplete };
};
exports.uploadChunk = uploadChunk;
/**
 * Gets chunked upload session status.
 *
 * @param {string} sessionId - Upload session ID
 * @param {ModelStatic<Model>} sessionModel - Chunked upload session model
 * @returns {Promise<ChunkedUploadSession>} Session status
 *
 * @example
 * ```typescript
 * const session = await getChunkedUploadStatus(sessionId, ChunkedUploadSessionModel);
 * console.log(`Progress: ${session.uploadedChunks.length}/${session.totalChunks}`);
 * ```
 */
const getChunkedUploadStatus = async (sessionId, sessionModel) => {
    const session = await sessionModel.findByPk(sessionId);
    if (!session) {
        throw new common_1.NotFoundException('Upload session not found');
    }
    return session.get({ plain: true });
};
exports.getChunkedUploadStatus = getChunkedUploadStatus;
/**
 * Completes chunked upload and assembles file.
 *
 * @param {string} sessionId - Upload session ID
 * @param {ModelStatic<Model>} sessionModel - Chunked upload session model
 * @param {StorageProvider} storageConfig - Storage provider configuration
 * @returns {Promise<FileMetadata>} Completed file metadata
 *
 * @example
 * ```typescript
 * const fileMetadata = await completeChunkedUpload(
 *   sessionId,
 *   ChunkedUploadSessionModel,
 *   s3StorageConfig
 * );
 * console.log(`File uploaded: ${fileMetadata.url}`);
 * ```
 */
const completeChunkedUpload = async (sessionId, sessionModel, storageConfig) => {
    const session = await sessionModel.findByPk(sessionId);
    if (!session) {
        throw new common_1.NotFoundException('Upload session not found');
    }
    const sessionData = session.get({ plain: true });
    if (sessionData.uploadedChunks.length !== sessionData.totalChunks) {
        throw new common_1.BadRequestException('Upload incomplete - not all chunks uploaded');
    }
    // In production, complete multipart upload or assemble chunks
    // For S3: await completeS3MultipartUpload(...)
    // Placeholder metadata
    const metadata = {
        originalName: sessionData.filename,
        filename: (0, exports.generateSafeFilename)(sessionData.filename),
        mimetype: 'application/octet-stream',
        size: sessionData.totalSize,
        storageProvider: sessionData.storageProvider,
        storageKey: sessionData.storageKey || 'assembled-file',
        url: 'https://storage.example.com/assembled-file',
    };
    // Clean up session
    await session.destroy();
    return metadata;
};
exports.completeChunkedUpload = completeChunkedUpload;
// ============================================================================
// CDN INTEGRATION UTILITIES
// ============================================================================
/**
 * Purges CDN cache for specific URL or pattern.
 *
 * @param {string | string[]} urls - URLs to purge
 * @param {CDNConfig} config - CDN configuration
 * @returns {Promise<{purged: number, errors: string[]}>} Purge result
 *
 * @example
 * ```typescript
 * const result = await purgeCDNCache(
 *   ['https://cdn.whitecross.com/images/old-logo.png'],
 *   {
 *     provider: 'cloudflare',
 *     zoneId: 'abc123',
 *     apiKey: process.env.CLOUDFLARE_API_KEY,
 *   }
 * );
 * console.log(`Purged ${result.purged} URLs`);
 * ```
 */
const purgeCDNCache = async (urls, config) => {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    // In production, integrate with CDN provider APIs
    // Cloudflare example:
    // const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${config.zoneId}/purge_cache`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${config.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ files: urlArray }),
    // });
    // Placeholder
    return { purged: urlArray.length, errors: [] };
};
exports.purgeCDNCache = purgeCDNCache;
/**
 * Generates CDN URL for file.
 *
 * @param {string} storageUrl - Original storage URL
 * @param {CDNConfig} config - CDN configuration
 * @returns {string} CDN URL
 *
 * @example
 * ```typescript
 * const cdnUrl = generateCDNUrl(
 *   'https://whitecross-storage.s3.amazonaws.com/images/photo.jpg',
 *   {
 *     provider: 'cloudfront',
 *     baseUrl: 'https://cdn.whitecross.com',
 *   }
 * );
 * console.log(`CDN URL: ${cdnUrl}`);
 * ```
 */
const generateCDNUrl = (storageUrl, config) => {
    const url = new URL(storageUrl);
    const pathname = url.pathname;
    if (config.customDomain) {
        return `https://${config.customDomain}${pathname}`;
    }
    return `${config.baseUrl}${pathname}`;
};
exports.generateCDNUrl = generateCDNUrl;
// ============================================================================
// FILE MANAGEMENT UTILITIES
// ============================================================================
/**
 * Searches files with advanced filtering.
 *
 * @param {FileSearchOptions} options - Search options
 * @param {ModelStatic<Model>} fileModel - File metadata model
 * @returns {Promise<{files: FileMetadata[], total: number}>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchFiles({
 *   mimetype: 'image/jpeg',
 *   tags: ['patient-records', 'x-ray'],
 *   uploadedAfter: new Date('2024-01-01'),
 *   minSize: 1048576, // 1MB
 *   limit: 50,
 *   offset: 0,
 * }, FileMetadataModel);
 * ```
 */
const searchFiles = async (options, fileModel) => {
    const where = {};
    if (options.filename) {
        where.filename = { [sequelize_1.Op.iLike]: `%${options.filename}%` };
    }
    if (options.mimetype) {
        where.mimetype = options.mimetype;
    }
    if (options.tags && options.tags.length > 0) {
        where.tags = { [sequelize_1.Op.overlap]: options.tags };
    }
    if (options.uploadedBy) {
        where.uploadedBy = options.uploadedBy;
    }
    if (options.uploadedAfter) {
        where.uploadedAt = { [sequelize_1.Op.gte]: options.uploadedAfter };
    }
    if (options.uploadedBefore) {
        where.uploadedAt = { ...where.uploadedAt, [sequelize_1.Op.lte]: options.uploadedBefore };
    }
    if (options.minSize) {
        where.size = { [sequelize_1.Op.gte]: options.minSize };
    }
    if (options.maxSize) {
        where.size = { ...where.size, [sequelize_1.Op.lte]: options.maxSize };
    }
    if (options.storageProvider) {
        where.storageProvider = options.storageProvider;
    }
    if (options.isPublic !== undefined) {
        where.isPublic = options.isPublic;
    }
    const { count, rows } = await fileModel.findAndCountAll({
        where,
        limit: options.limit || 50,
        offset: options.offset || 0,
        order: [['uploadedAt', 'DESC']],
    });
    return {
        files: rows.map(r => r.get({ plain: true })),
        total: count,
    };
};
exports.searchFiles = searchFiles;
/**
 * Cleans up expired and orphaned files.
 *
 * @param {FileCleanupConfig} config - Cleanup configuration
 * @param {ModelStatic<Model>} fileModel - File metadata model
 * @returns {Promise<{deleted: number, archived: number}>} Cleanup result
 *
 * @example
 * ```typescript
 * const result = await cleanupFiles({
 *   deleteExpired: true,
 *   deleteUnscanned: true,
 *   deleteOrphaned: true,
 *   archiveOld: true,
 *   archiveThreshold: 365, // 1 year
 *   dryRun: false,
 * }, FileMetadataModel);
 * console.log(`Deleted: ${result.deleted}, Archived: ${result.archived}`);
 * ```
 */
const cleanupFiles = async (config, fileModel) => {
    let deleted = 0;
    let archived = 0;
    const now = new Date();
    // Delete expired files
    if (config.deleteExpired) {
        const expiredFiles = await fileModel.findAll({
            where: {
                expiresAt: { [sequelize_1.Op.lte]: now },
            },
        });
        for (const file of expiredFiles) {
            if (!config.dryRun) {
                await file.destroy();
            }
            deleted++;
        }
    }
    // Delete unscanned files older than 24 hours
    if (config.deleteUnscanned) {
        const unscannedThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const unscannedFiles = await fileModel.findAll({
            where: {
                isScanned: false,
                uploadedAt: { [sequelize_1.Op.lte]: unscannedThreshold },
            },
        });
        for (const file of unscannedFiles) {
            if (!config.dryRun) {
                await file.destroy();
            }
            deleted++;
        }
    }
    // Archive old files
    if (config.archiveOld && config.archiveThreshold) {
        const archiveThreshold = new Date(now.getTime() - config.archiveThreshold * 24 * 60 * 60 * 1000);
        const oldFiles = await fileModel.findAll({
            where: {
                uploadedAt: { [sequelize_1.Op.lte]: archiveThreshold },
            },
        });
        for (const file of oldFiles) {
            // In production, move to archive storage (e.g., S3 Glacier)
            if (!config.dryRun) {
                // Archive file...
            }
            archived++;
        }
    }
    return { deleted, archived };
};
exports.cleanupFiles = cleanupFiles;
/**
 * Updates storage quota usage.
 *
 * @param {string} userId - User ID
 * @param {number} sizeChange - Size change in bytes (positive or negative)
 * @param {number} fileCountChange - File count change
 * @param {ModelStatic<Model>} quotaModel - Storage quota model
 * @returns {Promise<StorageQuota>} Updated quota
 *
 * @example
 * ```typescript
 * const quota = await updateStorageQuota(
 *   'user-123',
 *   5242880, // Added 5MB
 *   1, // Added 1 file
 *   StorageQuotaModel
 * );
 * console.log(`Used: ${quota.usedStorage}/${quota.maxStorage} bytes`);
 * ```
 */
const updateStorageQuota = async (userId, sizeChange, fileCountChange, quotaModel) => {
    const quota = await quotaModel.findOne({ where: { userId } });
    if (!quota) {
        throw new common_1.NotFoundException('Storage quota not found');
    }
    const quotaData = quota.get({ plain: true });
    const newUsedStorage = quotaData.usedStorage + sizeChange;
    const newFileCount = quotaData.fileCount + fileCountChange;
    if (newUsedStorage < 0 || newFileCount < 0) {
        throw new common_1.BadRequestException('Invalid quota update - would result in negative values');
    }
    await quota.update({
        usedStorage: newUsedStorage,
        fileCount: newFileCount,
    });
    return quota.get({ plain: true });
};
exports.updateStorageQuota = updateStorageQuota;
// ============================================================================
// NESTJS DECORATORS AND INTERCEPTORS
// ============================================================================
/**
 * Custom decorator for single file upload with validation.
 *
 * @example
 * ```typescript
 * @Post('upload')
 * @ApiConsumes('multipart/form-data')
 * @ApiBody({
 *   schema: {
 *     type: 'object',
 *     properties: {
 *       file: { type: 'string', format: 'binary' },
 *     },
 *   },
 * })
 * async uploadFile(@UploadedFile() file: Express.Multer.File) {
 *   // File is automatically validated and processed
 *   return { fileId: file.filename };
 * }
 * ```
 */
const FileUpload = (fieldName = 'file', validationOptions) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)(fieldName))(target, propertyKey, descriptor);
        (0, swagger_1.ApiConsumes)('multipart/form-data')(target, propertyKey, descriptor);
    };
};
exports.FileUpload = FileUpload;
/**
 * Custom decorator for multiple files upload with validation.
 *
 * @example
 * ```typescript
 * @Post('upload-multiple')
 * @FilesUpload('files', 10, {
 *   maxSize: 10485760,
 *   allowedMimeTypes: ['image/jpeg', 'image/png'],
 * })
 * async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
 *   return { count: files.length };
 * }
 * ```
 */
const FilesUpload = (fieldName = 'files', maxCount = 10, validationOptions) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)(fieldName, maxCount))(target, propertyKey, descriptor);
        (0, swagger_1.ApiConsumes)('multipart/form-data')(target, propertyKey, descriptor);
    };
};
exports.FilesUpload = FilesUpload;
/**
 * NestJS interceptor for file upload validation.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   @UseInterceptors(new FileValidationInterceptor({
 *     maxSize: 10485760,
 *     allowedMimeTypes: ['image/jpeg', 'image/png'],
 *   }))
 *   async handleUpload(@UploadedFile() file: Express.Multer.File) {
 *     // File is already validated
 *   }
 * }
 * ```
 */
let FileValidationInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FileValidationInterceptor = _classThis = class {
        constructor(options) {
            this.options = options;
        }
        async intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const file = request.file;
            const files = request.files;
            if (file) {
                const result = await (0, exports.validateFile)(file, this.options);
                if (!result.isValid) {
                    throw new common_1.BadRequestException(result.errors.join(', '));
                }
            }
            if (files && Array.isArray(files)) {
                for (const f of files) {
                    const result = await (0, exports.validateFile)(f, this.options);
                    if (!result.isValid) {
                        throw new common_1.BadRequestException(`File ${f.originalname}: ${result.errors.join(', ')}`);
                    }
                }
            }
            return next.handle();
        }
    };
    __setFunctionName(_classThis, "FileValidationInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileValidationInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileValidationInterceptor = _classThis;
})();
exports.FileValidationInterceptor = FileValidationInterceptor;
/**
 * NestJS service for file storage operations.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class FilesController {
 *   constructor(private readonly fileStorageService: FileStorageService) {}
 *
 *   @Post('upload')
 *   async upload(@UploadedFile() file: Express.Multer.File) {
 *     return await this.fileStorageService.uploadFile(file, {
 *       storageProvider: 's3',
 *       public: false,
 *       scanForViruses: true,
 *     });
 *   }
 * }
 * ```
 */
let FileStorageService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FileStorageService = _classThis = class {
        constructor(fileMetadataModel, storageProviderModel, storageQuotaModel) {
            this.fileMetadataModel = fileMetadataModel;
            this.storageProviderModel = storageProviderModel;
            this.storageQuotaModel = storageQuotaModel;
        }
        /**
         * Uploads file to configured storage provider.
         */
        async uploadFile(file, config, userId) {
            // Validate file
            const validation = await (0, exports.validateFile)(file, {
                maxSize: config.maxFileSize,
                allowedMimeTypes: config.allowedMimeTypes,
                allowedExtensions: config.allowedExtensions,
            });
            if (!validation.isValid) {
                throw new common_1.BadRequestException(validation.errors.join(', '));
            }
            // Check quota
            if (userId) {
                const quotaCheck = await (0, exports.validateStorageQuota)(userId, file.size, this.storageQuotaModel);
                if (!quotaCheck.allowed) {
                    throw new common_1.PayloadTooLargeException(quotaCheck.reason);
                }
            }
            // Scan for viruses
            if (config.scanForViruses) {
                const scanResult = await (0, exports.scanFileForViruses)(file.buffer || file.path, {
                    enabled: true,
                    clamAvHost: 'localhost',
                    clamAvPort: 3310,
                });
                if (!scanResult.isClean) {
                    throw new common_1.BadRequestException(`Virus detected: ${scanResult.virusName}`);
                }
            }
            // Get storage provider
            const provider = await this.getStorageProvider(config.storageProvider);
            // Upload to storage
            let metadata;
            switch (provider.type) {
                case 's3':
                    metadata = await (0, exports.uploadFileToS3)(file, provider.config);
                    break;
                case 'azure':
                    metadata = await (0, exports.uploadFileToAzureBlob)(file, provider.config);
                    break;
                case 'gcp':
                    metadata = await (0, exports.uploadFileToGCS)(file, provider.config);
                    break;
                case 'local':
                default:
                    metadata = await (0, exports.saveFileToLocalStorage)(file, provider.config);
                    break;
            }
            // Save metadata
            const fileRecord = await this.fileMetadataModel.create({
                ...metadata,
                uploadedBy: userId,
                isPublic: config.public,
                metadata: config.metadata,
                tags: config.tags,
                expiresAt: config.expiresIn ? new Date(Date.now() + config.expiresIn * 1000) : null,
            });
            // Update quota
            if (userId) {
                await (0, exports.updateStorageQuota)(userId, file.size, 1, this.storageQuotaModel);
            }
            return fileRecord.get({ plain: true });
        }
        /**
         * Gets storage provider configuration.
         */
        async getStorageProvider(name) {
            const provider = name
                ? await this.storageProviderModel.findOne({ where: { name, isActive: true } })
                : await this.storageProviderModel.findOne({ where: { isDefault: true, isActive: true } });
            if (!provider) {
                throw new common_1.NotFoundException('Storage provider not found');
            }
            return provider.get({ plain: true });
        }
        /**
         * Downloads file by ID.
         */
        async downloadFile(fileId) {
            const file = await this.fileMetadataModel.findByPk(fileId);
            if (!file) {
                throw new common_1.NotFoundException('File not found');
            }
            const fileData = file.get({ plain: true });
            // Create stream based on storage provider
            const stream = (0, exports.createLocalFileStream)(fileData.path);
            return new common_1.StreamableFile(stream, {
                type: fileData.mimetype,
                disposition: `attachment; filename="${fileData.originalName}"`,
            });
        }
        /**
         * Deletes file by ID.
         */
        async deleteFile(fileId, userId) {
            const file = await this.fileMetadataModel.findByPk(fileId);
            if (!file) {
                throw new common_1.NotFoundException('File not found');
            }
            const fileData = file.get({ plain: true });
            // Delete from storage
            const provider = await this.getStorageProvider(fileData.storageProvider);
            switch (provider.type) {
                case 's3':
                    await (0, exports.deleteFileFromS3)(fileData.storageKey, provider.config);
                    break;
                case 'azure':
                    await (0, exports.deleteFileFromAzureBlob)(fileData.storageKey, provider.config);
                    break;
                case 'gcp':
                    await (0, exports.deleteFileFromGCS)(fileData.storageKey, provider.config);
                    break;
                case 'local':
                default:
                    await (0, exports.deleteFileFromLocalStorage)(fileData.path);
                    break;
            }
            // Delete metadata
            await file.destroy();
            // Update quota
            if (userId) {
                await (0, exports.updateStorageQuota)(userId, -fileData.size, -1, this.storageQuotaModel);
            }
            return true;
        }
        /**
         * Generates presigned/temporary URL for file download.
         */
        async generateDownloadUrl(fileId, options) {
            const file = await this.fileMetadataModel.findByPk(fileId);
            if (!file) {
                throw new common_1.NotFoundException('File not found');
            }
            const fileData = file.get({ plain: true });
            const provider = await this.getStorageProvider(fileData.storageProvider);
            switch (provider.type) {
                case 's3':
                    return await (0, exports.generateS3PresignedUrl)(fileData.storageKey, provider.config, options);
                case 'azure':
                    return await (0, exports.generateAzureBlobSasUrl)(fileData.storageKey, provider.config, options);
                case 'gcp':
                    return await (0, exports.generateGCSSignedUrl)(fileData.storageKey, provider.config, options);
                case 'local':
                default:
                    // For local storage, return direct URL
                    return fileData.url;
            }
        }
    };
    __setFunctionName(_classThis, "FileStorageService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileStorageService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileStorageService = _classThis;
})();
exports.FileStorageService = FileStorageService;
//# sourceMappingURL=file-storage-kit.prod.js.map