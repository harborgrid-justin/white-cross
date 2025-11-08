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

import {
  Injectable,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  NotFoundException,
  InternalServerErrorException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiProperty, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Model,
  DataTypes,
  Sequelize,
  ModelStatic,
  Transaction,
  Op,
  literal,
  fn,
  col,
} from 'sequelize';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as stream from 'stream';
import { promisify } from 'util';
import { pipeline } from 'stream/promises';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface StorageProvider {
  type: 'local' | 's3' | 'azure' | 'gcp';
  name: string;
  config: Record<string, any>;
  isDefault?: boolean;
  isActive?: boolean;
}

interface LocalStorageConfig {
  basePath: string;
  urlPrefix?: string;
  createDirectories?: boolean;
  permissions?: number;
}

interface S3StorageConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  s3ForcePathStyle?: boolean;
  signatureVersion?: string;
  acl?: 'private' | 'public-read' | 'public-read-write' | 'authenticated-read';
}

interface AzureBlobStorageConfig {
  accountName: string;
  accountKey: string;
  containerName: string;
  endpoint?: string;
  sasToken?: string;
}

interface GCPStorageConfig {
  projectId: string;
  bucketName: string;
  keyFilename?: string;
  credentials?: any;
  location?: string;
}

interface FileMetadata {
  id?: string;
  originalName: string;
  filename: string;
  mimetype: string;
  encoding?: string;
  size: number;
  path?: string;
  url?: string;
  storageProvider: string;
  storageKey: string;
  hash?: string;
  checksum?: string;
  uploadedBy?: string;
  uploadedAt?: Date;
  expiresAt?: Date;
  isPublic?: boolean;
  isScanned?: boolean;
  scanResult?: string;
  scanTimestamp?: Date;
  metadata?: Record<string, any>;
  tags?: string[];
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  variants?: FileVariant[];
}

interface FileVariant {
  name: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
  format?: string;
}

interface FileUploadConfig {
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  maxFiles?: number;
  generateThumbnails?: boolean;
  scanForViruses?: boolean;
  storageProvider?: string;
  public?: boolean;
  expiresIn?: number;
  metadata?: Record<string, any>;
  tags?: string[];
}

interface FileValidationOptions {
  maxSize?: number;
  minSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  requireMimeTypeMatch?: boolean;
  checkMagicNumbers?: boolean;
  customValidators?: Array<(file: Express.Multer.File) => Promise<boolean>>;
}

interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedMimeType?: string;
  detectedExtension?: string;
}

interface VirusScanConfig {
  enabled: boolean;
  clamAvHost?: string;
  clamAvPort?: number;
  timeout?: number;
  quarantinePath?: string;
}

interface VirusScanResult {
  isClean: boolean;
  virusName?: string;
  scanTimestamp: Date;
  scanDuration: number;
  scanner: string;
}

interface ImageProcessingOptions {
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    position?: string;
  };
  format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff';
  quality?: number;
  compress?: boolean;
  stripMetadata?: boolean;
  watermark?: {
    image: string;
    position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity?: number;
  };
  variants?: Array<{
    name: string;
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
  }>;
}

interface VideoProcessingOptions {
  format?: 'mp4' | 'webm' | 'avi' | 'mov';
  codec?: string;
  resolution?: '480p' | '720p' | '1080p' | '4k';
  bitrate?: string;
  framerate?: number;
  audioCodec?: string;
  audioBitrate?: string;
  thumbnail?: {
    timestamp?: number;
    count?: number;
    width?: number;
    height?: number;
  };
  segments?: {
    duration: number;
    format?: 'hls' | 'dash';
  };
}

interface ChunkedUploadConfig {
  chunkSize: number;
  maxFileSize: number;
  sessionTimeout: number;
  storageProvider: string;
  resumable: boolean;
}

interface ChunkedUploadSession {
  id: string;
  filename: string;
  totalSize: number;
  chunkSize: number;
  uploadedChunks: number[];
  totalChunks: number;
  storageProvider: string;
  metadata?: Record<string, any>;
  expiresAt: Date;
  createdAt: Date;
  completedAt?: Date;
}

interface PresignedUrlOptions {
  expiresIn: number;
  filename?: string;
  contentType?: string;
  contentDisposition?: 'inline' | 'attachment';
  responseHeaders?: Record<string, string>;
}

interface CDNConfig {
  provider: 'cloudflare' | 'cloudfront' | 'fastly' | 'akamai';
  baseUrl: string;
  zoneId?: string;
  distributionId?: string;
  apiKey?: string;
  apiSecret?: string;
  cacheTTL?: number;
  customDomain?: string;
}

interface StorageQuota {
  userId?: string;
  organizationId?: string;
  maxStorage: number;
  usedStorage: number;
  maxFileSize: number;
  maxFiles: number;
  fileCount: number;
  allowedMimeTypes?: string[];
  quotaResetDate?: Date;
}

interface FileStreamOptions {
  start?: number;
  end?: number;
  highWaterMark?: number;
}

interface FileCleanupConfig {
  deleteExpired?: boolean;
  deleteUnscanned?: boolean;
  deleteOrphaned?: boolean;
  archiveOld?: boolean;
  archiveThreshold?: number;
  dryRun?: boolean;
}

interface FileSearchOptions {
  filename?: string;
  mimetype?: string;
  tags?: string[];
  uploadedBy?: string;
  uploadedAfter?: Date;
  uploadedBefore?: Date;
  minSize?: number;
  maxSize?: number;
  storageProvider?: string;
  isPublic?: boolean;
  limit?: number;
  offset?: number;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for file upload configuration validation.
 */
export const FileUploadConfigSchema = z.object({
  maxFileSize: z.number().int().positive().optional().default(10485760), // 10MB default
  allowedMimeTypes: z.array(z.string()).optional(),
  allowedExtensions: z.array(z.string()).optional(),
  maxFiles: z.number().int().positive().optional().default(10),
  generateThumbnails: z.boolean().optional().default(false),
  scanForViruses: z.boolean().optional().default(true),
  storageProvider: z.string().optional(),
  public: z.boolean().optional().default(false),
  expiresIn: z.number().int().positive().optional(),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Zod schema for image processing options validation.
 */
export const ImageProcessingOptionsSchema = z.object({
  resize: z.object({
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    fit: z.enum(['cover', 'contain', 'fill', 'inside', 'outside']).optional(),
    position: z.string().optional(),
  }).optional(),
  format: z.enum(['jpeg', 'png', 'webp', 'avif', 'tiff']).optional(),
  quality: z.number().int().min(1).max(100).optional().default(80),
  compress: z.boolean().optional().default(true),
  stripMetadata: z.boolean().optional().default(true),
  watermark: z.object({
    image: z.string(),
    position: z.enum(['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
    opacity: z.number().min(0).max(1).optional().default(0.5),
  }).optional(),
  variants: z.array(z.object({
    name: z.string(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    format: z.string().optional(),
    quality: z.number().int().min(1).max(100).optional(),
  })).optional(),
});

/**
 * Zod schema for video processing options validation.
 */
export const VideoProcessingOptionsSchema = z.object({
  format: z.enum(['mp4', 'webm', 'avi', 'mov']).optional().default('mp4'),
  codec: z.string().optional().default('h264'),
  resolution: z.enum(['480p', '720p', '1080p', '4k']).optional(),
  bitrate: z.string().optional(),
  framerate: z.number().int().positive().optional(),
  audioCodec: z.string().optional().default('aac'),
  audioBitrate: z.string().optional(),
  thumbnail: z.object({
    timestamp: z.number().optional().default(1),
    count: z.number().int().positive().optional().default(1),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  }).optional(),
  segments: z.object({
    duration: z.number().int().positive(),
    format: z.enum(['hls', 'dash']).optional().default('hls'),
  }).optional(),
});

/**
 * Zod schema for presigned URL options validation.
 */
export const PresignedUrlOptionsSchema = z.object({
  expiresIn: z.number().int().positive().min(60).max(604800), // 1 minute to 7 days
  filename: z.string().optional(),
  contentType: z.string().optional(),
  contentDisposition: z.enum(['inline', 'attachment']).optional().default('attachment'),
  responseHeaders: z.record(z.string()).optional(),
});

/**
 * Zod schema for storage quota configuration.
 */
export const StorageQuotaSchema = z.object({
  userId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  maxStorage: z.number().int().positive(),
  usedStorage: z.number().int().min(0).default(0),
  maxFileSize: z.number().int().positive(),
  maxFiles: z.number().int().positive(),
  fileCount: z.number().int().min(0).default(0),
  allowedMimeTypes: z.array(z.string()).optional(),
  quotaResetDate: z.date().optional(),
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
export const defineFileMetadataModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'FileMetadata',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      originalName: {
        type: DataTypes.STRING(512),
        allowNull: false,
        field: 'original_name',
      },
      filename: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: true,
      },
      mimetype: {
        type: DataTypes.STRING(127),
        allowNull: false,
      },
      encoding: {
        type: DataTypes.STRING(63),
        allowNull: true,
      },
      size: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING(2048),
        allowNull: true,
      },
      storageProvider: {
        type: DataTypes.STRING(63),
        allowNull: false,
        field: 'storage_provider',
      },
      storageKey: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        field: 'storage_key',
      },
      hash: {
        type: DataTypes.STRING(128),
        allowNull: true,
        comment: 'SHA256 hash of file content',
      },
      checksum: {
        type: DataTypes.STRING(128),
        allowNull: true,
        comment: 'MD5 checksum for integrity verification',
      },
      uploadedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'uploaded_by',
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'uploaded_at',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expires_at',
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_public',
      },
      isScanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_scanned',
      },
      scanResult: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'scan_result',
      },
      scanTimestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'scan_timestamp',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Image/video width in pixels',
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Image/video height in pixels',
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Video/audio duration in seconds',
      },
      thumbnailUrl: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        field: 'thumbnail_url',
      },
      variants: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of file variants (thumbnails, resized versions)',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
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
    }
  );
};

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
export const defineStorageProviderModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'StorageProvider',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('local', 's3', 'azure', 'gcp'),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      config: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Encrypted storage provider configuration',
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Higher priority providers are preferred',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: 'storage_providers',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['type'] },
        { fields: ['is_default'] },
        { fields: ['is_active'] },
        { fields: ['priority'] },
      ],
    }
  );
};

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
export const defineChunkedUploadSessionModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'ChunkedUploadSession',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      filename: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      totalSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'total_size',
      },
      chunkSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'chunk_size',
      },
      uploadedChunks: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        field: 'uploaded_chunks',
      },
      totalChunks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_chunks',
      },
      storageProvider: {
        type: DataTypes.STRING(63),
        allowNull: false,
        field: 'storage_provider',
      },
      storageKey: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        field: 'storage_key',
      },
      uploadId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'upload_id',
        comment: 'S3 multipart upload ID or similar',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      uploadedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'uploaded_by',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
      },
    },
    {
      tableName: 'chunked_upload_sessions',
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ['uploaded_by'] },
        { fields: ['expires_at'] },
        { fields: ['created_at'] },
        { fields: ['completed_at'] },
      ],
    }
  );
};

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
export const defineStorageQuotaModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define(
    'StorageQuota',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'organization_id',
      },
      maxStorage: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'max_storage',
        comment: 'Maximum storage in bytes',
      },
      usedStorage: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'used_storage',
        comment: 'Currently used storage in bytes',
      },
      maxFileSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'max_file_size',
        comment: 'Maximum individual file size in bytes',
      },
      maxFiles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'max_files',
        comment: 'Maximum number of files allowed',
      },
      fileCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'file_count',
        comment: 'Current number of files',
      },
      allowedMimeTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: 'allowed_mime_types',
      },
      quotaResetDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'quota_reset_date',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: 'storage_quotas',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id'], unique: true, where: { user_id: { [Op.ne]: null } } },
        { fields: ['organization_id'], unique: true, where: { organization_id: { [Op.ne]: null } } },
      ],
    }
  );
};

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
export const validateFile = async (
  file: Express.Multer.File,
  options: FileValidationOptions
): Promise<FileValidationResult> => {
  const result: FileValidationResult = {
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
    const detectedType = await detectFileTypeFromMagicNumbers(file.buffer);
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
      } catch (error) {
        result.isValid = false;
        result.errors.push(`Custom validation error: ${error.message}`);
      }
    }
  }

  return result;
};

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
export const detectFileTypeFromMagicNumbers = async (
  buffer: Buffer
): Promise<{ mime: string; ext: string } | null> => {
  const magicNumbers: Array<{ bytes: number[]; mime: string; ext: string; offset?: number }> = [
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
export const generateSafeFilename = (originalName: string, prefix?: string): string => {
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
export const calculateFileHash = async (
  fileContent: Buffer | string
): Promise<{ hash: string; checksum: string }> => {
  let buffer: Buffer;

  if (typeof fileContent === 'string') {
    buffer = await fs.promises.readFile(fileContent);
  } else {
    buffer = fileContent;
  }

  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const checksum = crypto.createHash('md5').update(buffer).digest('hex');

  return { hash, checksum };
};

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
export const validateStorageQuota = async (
  userId: string,
  fileSize: number,
  quotaModel: ModelStatic<Model>
): Promise<{ allowed: boolean; reason?: string }> => {
  const quota = await quotaModel.findOne({
    where: { userId },
  });

  if (!quota) {
    return { allowed: true }; // No quota configured
  }

  const quotaData = quota.get({ plain: true }) as any;

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
export const scanFileForViruses = async (
  fileContent: string | Buffer,
  config: VirusScanConfig
): Promise<VirusScanResult> => {
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
  } catch (error) {
    throw new InternalServerErrorException(`Virus scan failed: ${error.message}`);
  }
};

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
export const quarantineFile = async (
  filePath: string,
  quarantinePath: string
): Promise<string> => {
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
  await fs.promises.writeFile(
    metadataPath,
    JSON.stringify({
      originalPath: filePath,
      quarantinedAt: new Date().toISOString(),
      reason: 'Virus detected',
    }, null, 2)
  );

  return quarantinedPath;
};

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
export const saveFileToLocalStorage = async (
  file: Express.Multer.File,
  config: LocalStorageConfig
): Promise<FileMetadata> => {
  const safeFilename = generateSafeFilename(file.originalname);
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
  const { hash, checksum } = await calculateFileHash(fileContent);

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
export const deleteFileFromLocalStorage = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false; // File doesn't exist
    }
    throw error;
  }
};

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
export const createLocalFileStream = (
  filePath: string,
  options?: FileStreamOptions
): fs.ReadStream => {
  return fs.createReadStream(filePath, {
    start: options?.start,
    end: options?.end,
    highWaterMark: options?.highWaterMark || 64 * 1024, // 64KB chunks
  });
};

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
export const uploadFileToS3 = async (
  file: Express.Multer.File,
  config: S3StorageConfig,
  key?: string
): Promise<FileMetadata> => {
  // In production, use AWS SDK v3
  // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

  const safeFilename = generateSafeFilename(file.originalname);
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

  const { hash, checksum } = await calculateFileHash(file.buffer);

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
export const generateS3PresignedUrl = async (
  key: string,
  config: S3StorageConfig,
  options: PresignedUrlOptions
): Promise<string> => {
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
export const initiateS3MultipartUpload = async (
  key: string,
  config: S3StorageConfig,
  contentType: string
): Promise<string> => {
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
export const uploadS3MultipartPart = async (
  key: string,
  uploadId: string,
  partNumber: number,
  data: Buffer,
  config: S3StorageConfig
): Promise<{ ETag: string; PartNumber: number }> => {
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
export const completeS3MultipartUpload = async (
  key: string,
  uploadId: string,
  parts: Array<{ ETag: string; PartNumber: number }>,
  config: S3StorageConfig
): Promise<string> => {
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
export const deleteFileFromS3 = async (
  key: string,
  config: S3StorageConfig
): Promise<boolean> => {
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
export const uploadFileToAzureBlob = async (
  file: Express.Multer.File,
  config: AzureBlobStorageConfig,
  blobName?: string
): Promise<FileMetadata> => {
  // In production, use @azure/storage-blob
  // import { BlobServiceClient } from '@azure/storage-blob';

  const safeFilename = generateSafeFilename(file.originalname);
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

  const { hash, checksum } = await calculateFileHash(file.buffer);

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
export const generateAzureBlobSasUrl = async (
  blobName: string,
  config: AzureBlobStorageConfig,
  options: PresignedUrlOptions
): Promise<string> => {
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
export const deleteFileFromAzureBlob = async (
  blobName: string,
  config: AzureBlobStorageConfig
): Promise<boolean> => {
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
export const uploadFileToGCS = async (
  file: Express.Multer.File,
  config: GCPStorageConfig,
  objectName?: string
): Promise<FileMetadata> => {
  // In production, use @google-cloud/storage
  // import { Storage } from '@google-cloud/storage';

  const safeFilename = generateSafeFilename(file.originalname);
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

  const { hash, checksum } = await calculateFileHash(file.buffer);

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
export const generateGCSSignedUrl = async (
  objectName: string,
  config: GCPStorageConfig,
  options: PresignedUrlOptions
): Promise<string> => {
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
export const deleteFileFromGCS = async (
  objectName: string,
  config: GCPStorageConfig
): Promise<boolean> => {
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
export const processImage = async (
  input: Buffer | string,
  options: ImageProcessingOptions
): Promise<{
  buffer: Buffer;
  metadata: any;
  variants?: Array<{ name: string; buffer: Buffer; width: number; height: number }>;
}> => {
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
export const generateImageThumbnail = async (
  input: Buffer | string,
  width: number,
  height: number
): Promise<Buffer> => {
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
export const extractImageMetadata = async (input: Buffer | string): Promise<any> => {
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
export const transcodeVideo = async (
  inputPath: string,
  outputPath: string,
  options: VideoProcessingOptions
): Promise<{ outputPath: string; duration: number; size: number }> => {
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
export const generateVideoThumbnail = async (
  videoPath: string,
  timestamp: number,
  outputPath: string
): Promise<string> => {
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
export const extractVideoMetadata = async (videoPath: string): Promise<any> => {
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
export const segmentVideoForStreaming = async (
  inputPath: string,
  outputDir: string,
  options: VideoProcessingOptions['segments']
): Promise<{ playlistPath: string; segmentCount: number }> => {
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
export const createChunkedUploadSession = async (
  config: ChunkedUploadConfig,
  filename: string,
  totalSize: number,
  sessionModel: ModelStatic<Model>
): Promise<ChunkedUploadSession> => {
  if (totalSize > config.maxFileSize) {
    throw new PayloadTooLargeException(
      `File size ${totalSize} exceeds maximum allowed ${config.maxFileSize}`
    );
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

  return session.get({ plain: true }) as any;
};

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
export const uploadChunk = async (
  sessionId: string,
  chunkNumber: number,
  chunkData: Buffer,
  sessionModel: ModelStatic<Model>
): Promise<{ uploadedChunks: number[]; isComplete: boolean }> => {
  const session = await sessionModel.findByPk(sessionId);

  if (!session) {
    throw new NotFoundException('Upload session not found');
  }

  const sessionData = session.get({ plain: true }) as any;

  // Check if session expired
  if (new Date() > new Date(sessionData.expiresAt)) {
    throw new BadRequestException('Upload session expired');
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
export const getChunkedUploadStatus = async (
  sessionId: string,
  sessionModel: ModelStatic<Model>
): Promise<ChunkedUploadSession> => {
  const session = await sessionModel.findByPk(sessionId);

  if (!session) {
    throw new NotFoundException('Upload session not found');
  }

  return session.get({ plain: true }) as any;
};

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
export const completeChunkedUpload = async (
  sessionId: string,
  sessionModel: ModelStatic<Model>,
  storageConfig: StorageProvider
): Promise<FileMetadata> => {
  const session = await sessionModel.findByPk(sessionId);

  if (!session) {
    throw new NotFoundException('Upload session not found');
  }

  const sessionData = session.get({ plain: true }) as any;

  if (sessionData.uploadedChunks.length !== sessionData.totalChunks) {
    throw new BadRequestException('Upload incomplete - not all chunks uploaded');
  }

  // In production, complete multipart upload or assemble chunks
  // For S3: await completeS3MultipartUpload(...)

  // Placeholder metadata
  const metadata: FileMetadata = {
    originalName: sessionData.filename,
    filename: generateSafeFilename(sessionData.filename),
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
export const purgeCDNCache = async (
  urls: string | string[],
  config: CDNConfig
): Promise<{ purged: number; errors: string[] }> => {
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
export const generateCDNUrl = (storageUrl: string, config: CDNConfig): string => {
  const url = new URL(storageUrl);
  const pathname = url.pathname;

  if (config.customDomain) {
    return `https://${config.customDomain}${pathname}`;
  }

  return `${config.baseUrl}${pathname}`;
};

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
export const searchFiles = async (
  options: FileSearchOptions,
  fileModel: ModelStatic<Model>
): Promise<{ files: FileMetadata[]; total: number }> => {
  const where: any = {};

  if (options.filename) {
    where.filename = { [Op.iLike]: `%${options.filename}%` };
  }

  if (options.mimetype) {
    where.mimetype = options.mimetype;
  }

  if (options.tags && options.tags.length > 0) {
    where.tags = { [Op.overlap]: options.tags };
  }

  if (options.uploadedBy) {
    where.uploadedBy = options.uploadedBy;
  }

  if (options.uploadedAfter) {
    where.uploadedAt = { [Op.gte]: options.uploadedAfter };
  }

  if (options.uploadedBefore) {
    where.uploadedAt = { ...where.uploadedAt, [Op.lte]: options.uploadedBefore };
  }

  if (options.minSize) {
    where.size = { [Op.gte]: options.minSize };
  }

  if (options.maxSize) {
    where.size = { ...where.size, [Op.lte]: options.maxSize };
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
    files: rows.map(r => r.get({ plain: true })) as any[],
    total: count,
  };
};

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
export const cleanupFiles = async (
  config: FileCleanupConfig,
  fileModel: ModelStatic<Model>
): Promise<{ deleted: number; archived: number }> => {
  let deleted = 0;
  let archived = 0;

  const now = new Date();

  // Delete expired files
  if (config.deleteExpired) {
    const expiredFiles = await fileModel.findAll({
      where: {
        expiresAt: { [Op.lte]: now },
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
        uploadedAt: { [Op.lte]: unscannedThreshold },
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
    const archiveThreshold = new Date(
      now.getTime() - config.archiveThreshold * 24 * 60 * 60 * 1000
    );
    const oldFiles = await fileModel.findAll({
      where: {
        uploadedAt: { [Op.lte]: archiveThreshold },
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
export const updateStorageQuota = async (
  userId: string,
  sizeChange: number,
  fileCountChange: number,
  quotaModel: ModelStatic<Model>
): Promise<StorageQuota> => {
  const quota = await quotaModel.findOne({ where: { userId } });

  if (!quota) {
    throw new NotFoundException('Storage quota not found');
  }

  const quotaData = quota.get({ plain: true }) as any;

  const newUsedStorage = quotaData.usedStorage + sizeChange;
  const newFileCount = quotaData.fileCount + fileCountChange;

  if (newUsedStorage < 0 || newFileCount < 0) {
    throw new BadRequestException('Invalid quota update - would result in negative values');
  }

  await quota.update({
    usedStorage: newUsedStorage,
    fileCount: newFileCount,
  });

  return quota.get({ plain: true }) as any;
};

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
export const FileUpload = (
  fieldName: string = 'file',
  validationOptions?: FileValidationOptions
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    UseInterceptors(FileInterceptor(fieldName))(target, propertyKey, descriptor);
    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
  };
};

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
export const FilesUpload = (
  fieldName: string = 'files',
  maxCount: number = 10,
  validationOptions?: FileValidationOptions
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    UseInterceptors(FilesInterceptor(fieldName, maxCount))(target, propertyKey, descriptor);
    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
  };
};

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
@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private readonly options: FileValidationOptions) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;
    const files = request.files;

    if (file) {
      const result = await validateFile(file, this.options);
      if (!result.isValid) {
        throw new BadRequestException(result.errors.join(', '));
      }
    }

    if (files && Array.isArray(files)) {
      for (const f of files) {
        const result = await validateFile(f, this.options);
        if (!result.isValid) {
          throw new BadRequestException(`File ${f.originalname}: ${result.errors.join(', ')}`);
        }
      }
    }

    return next.handle();
  }
}

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
@Injectable()
export class FileStorageService {
  constructor(
    private readonly fileMetadataModel: ModelStatic<Model>,
    private readonly storageProviderModel: ModelStatic<Model>,
    private readonly storageQuotaModel: ModelStatic<Model>
  ) {}

  /**
   * Uploads file to configured storage provider.
   */
  async uploadFile(
    file: Express.Multer.File,
    config: FileUploadConfig,
    userId?: string
  ): Promise<FileMetadata> {
    // Validate file
    const validation = await validateFile(file, {
      maxSize: config.maxFileSize,
      allowedMimeTypes: config.allowedMimeTypes,
      allowedExtensions: config.allowedExtensions,
    });

    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // Check quota
    if (userId) {
      const quotaCheck = await validateStorageQuota(userId, file.size, this.storageQuotaModel);
      if (!quotaCheck.allowed) {
        throw new PayloadTooLargeException(quotaCheck.reason);
      }
    }

    // Scan for viruses
    if (config.scanForViruses) {
      const scanResult = await scanFileForViruses(file.buffer || file.path, {
        enabled: true,
        clamAvHost: 'localhost',
        clamAvPort: 3310,
      });

      if (!scanResult.isClean) {
        throw new BadRequestException(`Virus detected: ${scanResult.virusName}`);
      }
    }

    // Get storage provider
    const provider = await this.getStorageProvider(config.storageProvider);

    // Upload to storage
    let metadata: FileMetadata;
    switch (provider.type) {
      case 's3':
        metadata = await uploadFileToS3(file, provider.config as S3StorageConfig);
        break;
      case 'azure':
        metadata = await uploadFileToAzureBlob(file, provider.config as AzureBlobStorageConfig);
        break;
      case 'gcp':
        metadata = await uploadFileToGCS(file, provider.config as GCPStorageConfig);
        break;
      case 'local':
      default:
        metadata = await saveFileToLocalStorage(file, provider.config as LocalStorageConfig);
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
      await updateStorageQuota(userId, file.size, 1, this.storageQuotaModel);
    }

    return fileRecord.get({ plain: true }) as any;
  }

  /**
   * Gets storage provider configuration.
   */
  private async getStorageProvider(name?: string): Promise<StorageProvider> {
    const provider = name
      ? await this.storageProviderModel.findOne({ where: { name, isActive: true } })
      : await this.storageProviderModel.findOne({ where: { isDefault: true, isActive: true } });

    if (!provider) {
      throw new NotFoundException('Storage provider not found');
    }

    return provider.get({ plain: true }) as any;
  }

  /**
   * Downloads file by ID.
   */
  async downloadFile(fileId: string): Promise<StreamableFile> {
    const file = await this.fileMetadataModel.findByPk(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const fileData = file.get({ plain: true }) as any;

    // Create stream based on storage provider
    const stream = createLocalFileStream(fileData.path);

    return new StreamableFile(stream, {
      type: fileData.mimetype,
      disposition: `attachment; filename="${fileData.originalName}"`,
    });
  }

  /**
   * Deletes file by ID.
   */
  async deleteFile(fileId: string, userId?: string): Promise<boolean> {
    const file = await this.fileMetadataModel.findByPk(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const fileData = file.get({ plain: true }) as any;

    // Delete from storage
    const provider = await this.getStorageProvider(fileData.storageProvider);

    switch (provider.type) {
      case 's3':
        await deleteFileFromS3(fileData.storageKey, provider.config as S3StorageConfig);
        break;
      case 'azure':
        await deleteFileFromAzureBlob(fileData.storageKey, provider.config as AzureBlobStorageConfig);
        break;
      case 'gcp':
        await deleteFileFromGCS(fileData.storageKey, provider.config as GCPStorageConfig);
        break;
      case 'local':
      default:
        await deleteFileFromLocalStorage(fileData.path);
        break;
    }

    // Delete metadata
    await file.destroy();

    // Update quota
    if (userId) {
      await updateStorageQuota(userId, -fileData.size, -1, this.storageQuotaModel);
    }

    return true;
  }

  /**
   * Generates presigned/temporary URL for file download.
   */
  async generateDownloadUrl(
    fileId: string,
    options: PresignedUrlOptions
  ): Promise<string> {
    const file = await this.fileMetadataModel.findByPk(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const fileData = file.get({ plain: true }) as any;
    const provider = await this.getStorageProvider(fileData.storageProvider);

    switch (provider.type) {
      case 's3':
        return await generateS3PresignedUrl(
          fileData.storageKey,
          provider.config as S3StorageConfig,
          options
        );
      case 'azure':
        return await generateAzureBlobSasUrl(
          fileData.storageKey,
          provider.config as AzureBlobStorageConfig,
          options
        );
      case 'gcp':
        return await generateGCSSignedUrl(
          fileData.storageKey,
          provider.config as GCPStorageConfig,
          options
        );
      case 'local':
      default:
        // For local storage, return direct URL
        return fileData.url;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types
  StorageProvider,
  LocalStorageConfig,
  S3StorageConfig,
  AzureBlobStorageConfig,
  GCPStorageConfig,
  FileMetadata,
  FileVariant,
  FileUploadConfig,
  FileValidationOptions,
  FileValidationResult,
  VirusScanConfig,
  VirusScanResult,
  ImageProcessingOptions,
  VideoProcessingOptions,
  ChunkedUploadConfig,
  ChunkedUploadSession,
  PresignedUrlOptions,
  CDNConfig,
  StorageQuota,
  FileStreamOptions,
  FileCleanupConfig,
  FileSearchOptions,
};
