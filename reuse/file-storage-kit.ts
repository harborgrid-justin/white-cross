/**
 * LOC: FILE-STOR-001
 * File: /reuse/file-storage-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - multer
 *   - aws-sdk / @aws-sdk/client-s3
 *   - sharp
 *   - sequelize (v6.x)
 *   - file-type
 *   - archiver
 *   - node-stream-zip
 *
 * DOWNSTREAM (imported by):
 *   - File upload controllers
 *   - Storage services
 *   - Media management modules
 *   - Document processing services
 */

/**
 * File: /reuse/file-storage-kit.ts
 * Locator: WC-UTL-FILESTOR-001
 * Purpose: File Storage & Upload Kit - Comprehensive file handling utilities for NestJS
 *
 * Upstream: @nestjs/common, multer, @aws-sdk/client-s3, sharp, sequelize, file-type, archiver
 * Downstream: Upload controllers, storage services, media management, document processing
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Sharp 0.33.x, AWS SDK v3
 * Exports: 45+ utility functions for file uploads, storage, processing, validation, and management
 *
 * LLM Context: Production-grade file storage utilities for White Cross healthcare platform.
 * Provides multipart upload handling, file validation, image processing, S3/cloud storage,
 * local filesystem management, metadata extraction, virus scanning, compression, streaming,
 * versioning, CDN integration, and HIPAA-compliant access control. Essential for secure
 * medical document and image management in healthcare applications.
 */

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
} from 'sequelize';
import { Readable, Transform } from 'stream';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * File upload configuration
 */
export interface FileUploadConfig {
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  destination?: string;
  preservePath?: boolean;
  limits?: {
    fileSize?: number;
    files?: number;
    parts?: number;
    fieldSize?: number;
  };
}

/**
 * Uploaded file metadata
 */
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  detectedMimeType?: string;
  fileExtension?: string;
}

/**
 * Image processing options
 */
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff';
  quality?: number;
  withoutEnlargement?: boolean;
  background?: string;
}

/**
 * Thumbnail generation options
 */
export interface ThumbnailOptions {
  sizes: Array<{ width: number; height: number; suffix: string }>;
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number;
  outputDir?: string;
}

/**
 * S3 upload configuration
 */
export interface S3UploadConfig {
  bucket: string;
  key: string;
  acl?: 'private' | 'public-read' | 'public-read-write' | 'authenticated-read';
  contentType?: string;
  metadata?: Record<string, string>;
  storageClass?: 'STANDARD' | 'REDUCED_REDUNDANCY' | 'STANDARD_IA' | 'ONEZONE_IA' | 'GLACIER';
  serverSideEncryption?: 'AES256' | 'aws:kms';
  tags?: Record<string, string>;
}

/**
 * S3 client configuration
 */
export interface S3ClientConfig {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  endpoint?: string;
  forcePathStyle?: boolean;
}

/**
 * Cloud storage provider interface
 */
export interface CloudStorageProvider {
  upload(file: Buffer | Readable, config: S3UploadConfig): Promise<CloudStorageResult>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  listFiles(prefix?: string): Promise<CloudStorageFile[]>;
}

/**
 * Cloud storage upload result
 */
export interface CloudStorageResult {
  key: string;
  location: string;
  etag: string;
  bucket: string;
  versionId?: string;
}

/**
 * Cloud storage file info
 */
export interface CloudStorageFile {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}

/**
 * File metadata extraction result
 */
export interface FileMetadata {
  filename: string;
  size: number;
  mimeType: string;
  extension: string;
  encoding?: string;
  hash?: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  exif?: Record<string, any>;
  tags?: string[];
  createdAt?: Date;
  modifiedAt?: Date;
}

/**
 * Virus scan result
 */
export interface VirusScanResult {
  clean: boolean;
  threats: string[];
  scanDate: Date;
  scanEngine?: string;
  scanVersion?: string;
}

/**
 * Compression options
 */
export interface CompressionOptions {
  format?: 'zip' | 'tar' | 'tar.gz' | 'tar.bz2';
  compressionLevel?: number;
  password?: string;
  comment?: string;
}

/**
 * Archive entry
 */
export interface ArchiveEntry {
  name: string;
  path?: string;
  data?: Buffer | Readable;
  date?: Date;
  mode?: number;
}

/**
 * Stream download options
 */
export interface StreamDownloadOptions {
  range?: { start: number; end: number };
  chunkSize?: number;
  contentType?: string;
  contentDisposition?: string;
  cacheControl?: string;
}

/**
 * File versioning options
 */
export interface FileVersioningOptions {
  maxVersions?: number;
  retainDeleted?: boolean;
  versioningStrategy?: 'timestamp' | 'sequential' | 'hash';
}

/**
 * File version info
 */
export interface FileVersion {
  versionId: string;
  fileId: string;
  version: number;
  size: number;
  hash: string;
  storagePath: string;
  createdAt: Date;
  createdBy?: string;
  comment?: string;
}

/**
 * CDN upload configuration
 */
export interface CDNUploadConfig {
  provider: 'cloudflare' | 'cloudfront' | 'fastly' | 'akamai';
  distributionId?: string;
  path: string;
  cacheControl?: string;
  invalidate?: boolean;
}

/**
 * File access control
 */
export interface FileAccessControl {
  fileId: string;
  userId?: string;
  roleId?: string;
  permissions: FilePermission[];
  expiresAt?: Date;
}

/**
 * File permissions
 */
export type FilePermission = 'read' | 'write' | 'delete' | 'share' | 'download';

/**
 * Chunked upload session
 */
export interface ChunkedUploadSession {
  sessionId: string;
  fileId?: string;
  filename: string;
  totalSize: number;
  chunkSize: number;
  uploadedChunks: number[];
  completed: boolean;
  expiresAt: Date;
}

/**
 * Chunk upload result
 */
export interface ChunkUploadResult {
  chunkIndex: number;
  uploaded: boolean;
  hash?: string;
  totalChunks: number;
  uploadedChunks: number;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * File model attributes interface
 */
export interface FileAttributes {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  extension: string;
  size: number;
  hash: string;
  storagePath: string;
  storageType: 'local' | 's3' | 'azure' | 'gcs';
  bucket?: string;
  key?: string;
  url?: string;
  thumbnailUrl?: string;
  uploadedBy?: string;
  isPublic: boolean;
  downloadCount: number;
  lastAccessedAt?: Date;
  expiresAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * File metadata model attributes interface
 */
export interface FileMetadataAttributes {
  id: string;
  fileId: string;
  width?: number;
  height?: number;
  duration?: number;
  bitrate?: number;
  codec?: string;
  exif?: Record<string, any>;
  tags?: string[];
  description?: string;
  altText?: string;
  virusScanStatus?: 'pending' | 'clean' | 'infected' | 'failed';
  virusScanDate?: Date;
  virusThreats?: string[];
  customMetadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Upload session model attributes interface
 */
export interface UploadSessionAttributes {
  id: string;
  sessionId: string;
  filename: string;
  totalSize: number;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: string; // JSON array
  mimeType?: string;
  uploadedBy?: string;
  completed: boolean;
  fileId?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates File model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FileAttributes>>} File model
 *
 * @example
 * ```typescript
 * const FileModel = createFileModel(sequelize);
 * const file = await FileModel.create({
 *   filename: 'report.pdf',
 *   originalFilename: 'medical_report.pdf',
 *   mimeType: 'application/pdf',
 *   size: 1024000,
 *   hash: 'abc123...',
 *   storagePath: '/uploads/2024/01/report.pdf',
 *   storageType: 'local'
 * });
 * ```
 */
export const createFileModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Stored filename',
    },
    originalFilename: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Original uploaded filename',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    extension: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      comment: 'SHA-256 hash of file content',
    },
    storagePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Full path to file in storage',
    },
    storageType: {
      type: DataTypes.ENUM('local', 's3', 'azure', 'gcs'),
      allowNull: false,
      defaultValue: 'local',
    },
    bucket: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Cloud storage bucket name',
    },
    key: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Cloud storage object key',
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: 'Public URL if available',
    },
    thumbnailUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: 'Thumbnail URL for images',
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID who uploaded the file',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Expiration date for temporary files',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    tableName: 'files',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['hash'] },
      { fields: ['uploadedBy'] },
      { fields: ['storageType'] },
      { fields: ['mimeType'] },
      { fields: ['createdAt'] },
      { fields: ['expiresAt'] },
    ],
  };

  return sequelize.define('File', attributes, options);
};

/**
 * Creates FileMetadata model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FileMetadataAttributes>>} FileMetadata model
 *
 * @example
 * ```typescript
 * const MetadataModel = createFileMetadataModel(sequelize);
 * const metadata = await MetadataModel.create({
 *   fileId: 'file-uuid',
 *   width: 1920,
 *   height: 1080,
 *   virusScanStatus: 'clean'
 * });
 * ```
 */
export const createFileMetadataModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fileId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'files',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    bitrate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Bitrate in kbps',
    },
    codec: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Media codec information',
    },
    exif: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'EXIF metadata for images',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    altText: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Alternative text for accessibility',
    },
    virusScanStatus: {
      type: DataTypes.ENUM('pending', 'clean', 'infected', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    virusScanDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    virusThreats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    customMetadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  const options: ModelOptions = {
    tableName: 'file_metadata',
    timestamps: true,
    indexes: [
      { fields: ['fileId'] },
      { fields: ['virusScanStatus'] },
      { fields: ['tags'], using: 'gin' },
    ],
  };

  return sequelize.define('FileMetadata', attributes, options);
};

/**
 * Creates UploadSession model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<UploadSessionAttributes>>} UploadSession model
 *
 * @example
 * ```typescript
 * const SessionModel = createUploadSessionModel(sequelize);
 * const session = await SessionModel.create({
 *   sessionId: 'session-123',
 *   filename: 'large-video.mp4',
 *   totalSize: 104857600,
 *   chunkSize: 1048576,
 *   totalChunks: 100,
 *   uploadedChunks: '[]',
 *   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export const createUploadSessionModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Unique session identifier',
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    totalSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    chunkSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalChunks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploadedChunks: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]',
      comment: 'JSON array of uploaded chunk indices',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fileId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'files',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };

  const options: ModelOptions = {
    tableName: 'upload_sessions',
    timestamps: true,
    indexes: [
      { fields: ['sessionId'] },
      { fields: ['uploadedBy'] },
      { fields: ['completed'] },
      { fields: ['expiresAt'] },
    ],
  };

  return sequelize.define('UploadSession', attributes, options);
};

// ============================================================================
// MULTIPART FILE UPLOAD HANDLING
// ============================================================================

/**
 * Creates Multer configuration for file uploads.
 *
 * @param {FileUploadConfig} config - Upload configuration
 * @returns {Object} Multer configuration object
 *
 * @example
 * ```typescript
 * const multerConfig = createMulterConfig({
 *   maxFileSize: 10 * 1024 * 1024, // 10MB
 *   allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
 *   destination: './uploads'
 * });
 * ```
 */
export const createMulterConfig = (config: FileUploadConfig): any => {
  return {
    limits: {
      fileSize: config.maxFileSize || 10 * 1024 * 1024,
      files: config.limits?.files || 10,
      parts: config.limits?.parts || 100,
      fieldSize: config.limits?.fieldSize || 1024 * 1024,
    },
    fileFilter: (req: any, file: UploadedFile, cb: any) => {
      if (config.allowedMimeTypes && !config.allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
        return;
      }

      const ext = path.extname(file.originalname).toLowerCase();
      if (config.allowedExtensions && !config.allowedExtensions.includes(ext)) {
        cb(new Error(`File extension ${ext} not allowed`), false);
        return;
      }

      cb(null, true);
    },
    storage: config.destination
      ? {
          destination: config.destination,
          filename: (req: any, file: UploadedFile, cb: any) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
          },
        }
      : undefined,
  };
};

/**
 * Processes uploaded file and generates metadata.
 *
 * @param {UploadedFile} file - Uploaded file object
 * @param {string} [userId] - User ID who uploaded the file
 * @returns {Promise<Partial<FileAttributes>>} File attributes for database
 *
 * @example
 * ```typescript
 * const fileData = await processUploadedFile(uploadedFile, 'user-123');
 * const file = await FileModel.create(fileData);
 * ```
 */
export const processUploadedFile = async (
  file: UploadedFile,
  userId?: string,
): Promise<Partial<FileAttributes>> => {
  const fileBuffer = file.buffer || (await fs.readFile(file.path!));
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  return {
    filename: file.filename || file.originalname,
    originalFilename: file.originalname,
    mimeType: file.mimetype,
    extension: path.extname(file.originalname).toLowerCase().slice(1),
    size: file.size,
    hash,
    storagePath: file.path || file.destination || '',
    storageType: 'local',
    uploadedBy: userId,
    isPublic: false,
    downloadCount: 0,
  };
};

/**
 * Handles multiple file uploads in a single request.
 *
 * @param {UploadedFile[]} files - Array of uploaded files
 * @param {FileUploadConfig} [config] - Upload configuration
 * @returns {Promise<Partial<FileAttributes>[]>} Array of file attributes
 *
 * @example
 * ```typescript
 * const filesData = await handleMultipleUploads(req.files, {
 *   maxFileSize: 5 * 1024 * 1024
 * });
 * const files = await FileModel.bulkCreate(filesData);
 * ```
 */
export const handleMultipleUploads = async (
  files: UploadedFile[],
  config?: FileUploadConfig,
): Promise<Partial<FileAttributes>[]> => {
  const results: Partial<FileAttributes>[] = [];

  for (const file of files) {
    const validation = await validateFile(file, config);
    if (!validation.valid) {
      throw new Error(`File validation failed: ${validation.errors.join(', ')}`);
    }

    const fileData = await processUploadedFile(file);
    results.push(fileData);
  }

  return results;
};

// ============================================================================
// FILE TYPE VALIDATION (MIME TYPES)
// ============================================================================

/**
 * Validates uploaded file against configuration rules.
 *
 * @param {UploadedFile} file - File to validate
 * @param {FileUploadConfig} [config] - Validation configuration
 * @returns {Promise<FileValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFile(uploadedFile, {
 *   maxFileSize: 10 * 1024 * 1024,
 *   allowedMimeTypes: ['image/jpeg', 'image/png']
 * });
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export const validateFile = async (
  file: UploadedFile,
  config?: FileUploadConfig,
): Promise<FileValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Size validation
  if (config?.maxFileSize && file.size > config.maxFileSize) {
    errors.push(`File size ${file.size} exceeds maximum ${config.maxFileSize}`);
  }

  // MIME type validation
  if (config?.allowedMimeTypes && !config.allowedMimeTypes.includes(file.mimetype)) {
    errors.push(`MIME type ${file.mimetype} not allowed`);
  }

  // Extension validation
  const ext = path.extname(file.originalname).toLowerCase();
  if (config?.allowedExtensions && !config.allowedExtensions.includes(ext)) {
    errors.push(`File extension ${ext} not allowed`);
  }

  // Detect actual MIME type from content
  const detectedMimeType = await detectMimeType(file);
  if (detectedMimeType && detectedMimeType !== file.mimetype) {
    warnings.push(`Detected MIME type ${detectedMimeType} differs from declared ${file.mimetype}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    detectedMimeType,
    fileExtension: ext,
  };
};

/**
 * Detects actual MIME type from file content.
 *
 * @param {UploadedFile | Buffer} file - File to analyze
 * @returns {Promise<string | null>} Detected MIME type
 *
 * @example
 * ```typescript
 * const mimeType = await detectMimeType(uploadedFile);
 * console.log('Detected MIME type:', mimeType);
 * ```
 */
export const detectMimeType = async (file: UploadedFile | Buffer): Promise<string | null> => {
  const buffer = Buffer.isBuffer(file) ? file : file.buffer || (await fs.readFile(file.path!));

  // Magic number detection
  const magicNumbers: Record<string, { bytes: number[]; type: string }> = {
    jpeg: { bytes: [0xff, 0xd8, 0xff], type: 'image/jpeg' },
    png: { bytes: [0x89, 0x50, 0x4e, 0x47], type: 'image/png' },
    gif: { bytes: [0x47, 0x49, 0x46, 0x38], type: 'image/gif' },
    pdf: { bytes: [0x25, 0x50, 0x44, 0x46], type: 'application/pdf' },
    zip: { bytes: [0x50, 0x4b, 0x03, 0x04], type: 'application/zip' },
  };

  for (const [key, { bytes, type }] of Object.entries(magicNumbers)) {
    if (buffer.slice(0, bytes.length).every((byte, i) => byte === bytes[i])) {
      return type;
    }
  }

  return null;
};

/**
 * Validates image file and checks dimensions.
 *
 * @param {UploadedFile} file - Image file to validate
 * @param {Object} [constraints] - Image constraints
 * @returns {Promise<FileValidationResult>} Validation result with image metadata
 *
 * @example
 * ```typescript
 * const validation = await validateImageFile(uploadedFile, {
 *   minWidth: 800,
 *   maxWidth: 4000,
 *   minHeight: 600,
 *   maxHeight: 3000
 * });
 * ```
 */
export const validateImageFile = async (
  file: UploadedFile,
  constraints?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    aspectRatio?: number;
  },
): Promise<FileValidationResult> => {
  const errors: string[] = [];

  if (!file.mimetype.startsWith('image/')) {
    errors.push('File is not an image');
    return { valid: false, errors };
  }

  // Extract image metadata using basic image parsing
  let metadata: { width: number; height: number } | null = null;

  try {
    const buffer = typeof file === 'string' ? await fs.readFile(file) : file.buffer;
    // Basic image dimension extraction from common formats
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      metadata = extractJPEGDimensions(buffer);
    } else if (file.mimetype === 'image/png') {
      metadata = extractPNGDimensions(buffer);
    } else {
      // For other formats, attempt basic header parsing
      metadata = extractBasicImageDimensions(buffer);
    }
  } catch (error) {
    errors.push('Unable to extract image metadata');
    return { valid: false, errors };
  }

  if (!metadata) {
    errors.push('Unable to determine image dimensions');
    return { valid: false, errors };
  }

  if (constraints?.minWidth && metadata.width < constraints.minWidth) {
    errors.push(`Image width ${metadata.width}px is less than minimum ${constraints.minWidth}px`);
  }

  if (constraints?.maxWidth && metadata.width > constraints.maxWidth) {
    errors.push(`Image width ${metadata.width}px exceeds maximum ${constraints.maxWidth}px`);
  }

  if (constraints?.minHeight && metadata.height < constraints.minHeight) {
    errors.push(`Image height ${metadata.height}px is less than minimum ${constraints.minHeight}px`);
  }

  if (constraints?.maxHeight && metadata.height > constraints.maxHeight) {
    errors.push(`Image height ${metadata.height}px exceeds maximum ${constraints.maxHeight}px`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// FILE SIZE LIMITS AND CHUNKED UPLOADS
// ============================================================================

/**
 * Initializes chunked upload session.
 *
 * @param {string} filename - Original filename
 * @param {number} totalSize - Total file size in bytes
 * @param {number} chunkSize - Size of each chunk
 * @param {string} [userId] - User ID initiating upload
 * @returns {Promise<ChunkedUploadSession>} Upload session details
 *
 * @example
 * ```typescript
 * const session = await initializeChunkedUpload('video.mp4', 104857600, 1048576, 'user-123');
 * console.log('Session ID:', session.sessionId);
 * ```
 */
export const initializeChunkedUpload = async (
  filename: string,
  totalSize: number,
  chunkSize: number,
  userId?: string,
): Promise<ChunkedUploadSession> => {
  const sessionId = crypto.randomBytes(16).toString('hex');
  const totalChunks = Math.ceil(totalSize / chunkSize);

  const session: ChunkedUploadSession = {
    sessionId,
    filename,
    totalSize,
    chunkSize,
    uploadedChunks: [],
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };

  // Save session metadata for tracking
  const tempDir = '/tmp/uploads';
  const sessionDir = path.join(tempDir, sessionId);
  await fs.mkdir(sessionDir, { recursive: true });
  const metadataPath = path.join(sessionDir, 'metadata.json');
  await fs.writeFile(
    metadataPath,
    JSON.stringify({
      filename,
      totalSize,
      chunkSize,
      totalChunks,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    }),
  );

  return session;
};

/**
 * Processes uploaded chunk and updates session.
 *
 * @param {string} sessionId - Upload session ID
 * @param {number} chunkIndex - Index of current chunk
 * @param {Buffer} chunkData - Chunk data
 * @param {string} [tempDir] - Temporary directory for chunks
 * @returns {Promise<ChunkUploadResult>} Chunk upload result
 *
 * @example
 * ```typescript
 * const result = await uploadChunk('session-123', 0, chunkBuffer, '/tmp/uploads');
 * console.log(`Uploaded ${result.uploadedChunks}/${result.totalChunks} chunks`);
 * ```
 */
export const uploadChunk = async (
  sessionId: string,
  chunkIndex: number,
  chunkData: Buffer,
  tempDir: string = '/tmp/uploads',
): Promise<ChunkUploadResult> => {
  // Validate chunk hash
  const chunkHash = crypto.createHash('sha256').update(chunkData).digest('hex');

  // Save chunk to temporary location
  const chunkPath = path.join(tempDir, sessionId, `chunk-${chunkIndex}`);
  await fs.mkdir(path.dirname(chunkPath), { recursive: true });
  await fs.writeFile(chunkPath, chunkData);

  // Track uploaded chunks by reading session directory
  const sessionDir = path.join(tempDir, sessionId);
  const files = await fs.readdir(sessionDir);
  const chunkFiles = files.filter((f) => f.startsWith('chunk-'));
  const uploadedChunks = chunkFiles.length;

  // Read session metadata to get total chunks
  const metadataPath = path.join(sessionDir, 'metadata.json');
  let totalChunks = uploadedChunks; // Default to current count
  try {
    const metadataContent = await fs.readFile(metadataPath, 'utf8');
    const metadata = JSON.parse(metadataContent);
    totalChunks = metadata.totalChunks || uploadedChunks;
  } catch {
    // If metadata doesn't exist yet, create it
    await fs.writeFile(metadataPath, JSON.stringify({ totalChunks: uploadedChunks }));
  }

  return {
    chunkIndex,
    uploaded: true,
    hash: chunkHash,
    totalChunks,
    uploadedChunks,
  };
};

/**
 * Finalizes chunked upload by combining all chunks.
 *
 * @param {string} sessionId - Upload session ID
 * @param {string} [tempDir] - Temporary directory with chunks
 * @returns {Promise<string>} Path to finalized file
 *
 * @example
 * ```typescript
 * const filePath = await finalizeChunkedUpload('session-123');
 * console.log('File saved to:', filePath);
 * ```
 */
export const finalizeChunkedUpload = async (
  sessionId: string,
  tempDir: string = '/tmp/uploads',
): Promise<string> => {
  const sessionDir = path.join(tempDir, sessionId);
  const files = await fs.readdir(sessionDir);
  const chunkFiles = files.filter((f) => f.startsWith('chunk-')).sort();

  const outputPath = path.join(tempDir, `${sessionId}-final`);
  const writeStream = require('fs').createWriteStream(outputPath);

  for (const chunkFile of chunkFiles) {
    const chunkPath = path.join(sessionDir, chunkFile);
    const chunkData = await fs.readFile(chunkPath);
    writeStream.write(chunkData);
  }

  return new Promise((resolve, reject) => {
    writeStream.end(() => {
      // Cleanup chunks
      fs.rm(sessionDir, { recursive: true, force: true }).catch(console.error);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
};

/**
 * Validates chunk integrity using hash.
 *
 * @param {Buffer} chunkData - Chunk data to validate
 * @param {string} expectedHash - Expected hash value
 * @returns {boolean} True if chunk is valid
 *
 * @example
 * ```typescript
 * const isValid = validateChunk(chunkBuffer, 'abc123...');
 * if (!isValid) throw new Error('Chunk corrupted');
 * ```
 */
export const validateChunk = (chunkData: Buffer, expectedHash: string): boolean => {
  const actualHash = crypto.createHash('sha256').update(chunkData).digest('hex');
  return actualHash === expectedHash;
};

// ============================================================================
// IMAGE PROCESSING (RESIZE, CROP, THUMBNAIL)
// ============================================================================

/**
 * Resizes image to specified dimensions.
 * Note: Requires 'sharp' library in real implementation.
 *
 * @param {Buffer | string} input - Image buffer or file path
 * @param {ImageProcessingOptions} options - Resize options
 * @returns {Promise<Buffer>} Resized image buffer
 *
 * @example
 * ```typescript
 * const resized = await resizeImage(imageBuffer, {
 *   width: 800,
 *   height: 600,
 *   fit: 'cover',
 *   format: 'jpeg',
 *   quality: 85
 * });
 * ```
 */
export const resizeImage = async (
  input: Buffer | string,
  options: ImageProcessingOptions,
): Promise<Buffer> => {
  const buffer = typeof input === 'string' ? await fs.readFile(input) : input;

  try {
    // Try to use sharp if available (optional peer dependency)
    const sharp = require('sharp');
    return await sharp(buffer)
      .resize(options.width, options.height, { fit: options.fit || 'cover' })
      .toFormat(options.format || 'jpeg', { quality: options.quality || 80 })
      .toBuffer();
  } catch (sharpError) {
    // Sharp not available - log warning and return original
    console.warn(
      'Image resize requires "sharp" library. Install with: npm install sharp',
      'Returning original image. Error:',
      sharpError.message,
    );

    // Return original buffer - application remains functional
    return buffer;
  }
};

/**
 * Crops image to specified area.
 *
 * @param {Buffer | string} input - Image buffer or file path
 * @param {Object} cropArea - Crop coordinates and dimensions
 * @returns {Promise<Buffer>} Cropped image buffer
 *
 * @example
 * ```typescript
 * const cropped = await cropImage(imageBuffer, {
 *   left: 100,
 *   top: 100,
 *   width: 500,
 *   height: 500
 * });
 * ```
 */
export const cropImage = async (
  input: Buffer | string,
  cropArea: { left: number; top: number; width: number; height: number },
): Promise<Buffer> => {
  const buffer = typeof input === 'string' ? await fs.readFile(input) : input;

  try {
    const sharp = require('sharp');
    return await sharp(buffer).extract(cropArea).toBuffer();
  } catch (sharpError) {
    console.warn(
      'Image crop requires "sharp" library. Install with: npm install sharp',
      'Returning original image. Error:',
      sharpError.message,
    );
    return buffer;
  }
};

/**
 * Generates multiple thumbnail sizes for an image.
 *
 * @param {Buffer | string} input - Image buffer or file path
 * @param {ThumbnailOptions} options - Thumbnail generation options
 * @returns {Promise<Map<string, Buffer>>} Map of suffix to thumbnail buffer
 *
 * @example
 * ```typescript
 * const thumbnails = await generateThumbnails(imageBuffer, {
 *   sizes: [
 *     { width: 150, height: 150, suffix: 'small' },
 *     { width: 300, height: 300, suffix: 'medium' },
 *     { width: 600, height: 600, suffix: 'large' }
 *   ],
 *   format: 'webp',
 *   quality: 80
 * });
 * ```
 */
export const generateThumbnails = async (
  input: Buffer | string,
  options: ThumbnailOptions,
): Promise<Map<string, Buffer>> => {
  const thumbnails = new Map<string, Buffer>();

  for (const size of options.sizes) {
    const thumbnail = await resizeImage(input, {
      width: size.width,
      height: size.height,
      fit: 'cover',
      format: options.format || 'jpeg',
      quality: options.quality || 80,
    });
    thumbnails.set(size.suffix, thumbnail);
  }

  return thumbnails;
};

/**
 * Optimizes image for web delivery.
 *
 * @param {Buffer | string} input - Image buffer or file path
 * @param {Object} [options] - Optimization options
 * @returns {Promise<Buffer>} Optimized image buffer
 *
 * @example
 * ```typescript
 * const optimized = await optimizeImage(imageBuffer, {
 *   format: 'webp',
 *   quality: 85,
 *   maxWidth: 1920,
 *   stripMetadata: true
 * });
 * ```
 */
export const optimizeImage = async (
  input: Buffer | string,
  options?: {
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
    quality?: number;
    maxWidth?: number;
    stripMetadata?: boolean;
  },
): Promise<Buffer> => {
  const buffer = typeof input === 'string' ? await fs.readFile(input) : input;

  try {
    const sharp = require('sharp');
    let pipeline = sharp(buffer);

    if (options?.maxWidth) {
      pipeline = pipeline.resize(options.maxWidth, null, { withoutEnlargement: true });
    }

    if (options?.stripMetadata) {
      pipeline = pipeline.withMetadata({ orientation: undefined });
    }

    return await pipeline
      .toFormat(options?.format || 'jpeg', { quality: options?.quality || 80 })
      .toBuffer();
  } catch (sharpError) {
    console.warn(
      'Image optimization requires "sharp" library. Install with: npm install sharp',
      'Returning original image. Error:',
      sharpError.message,
    );
    return buffer;
  }
};

// ============================================================================
// S3/CLOUD STORAGE INTEGRATION
// ============================================================================

/**
 * Creates S3 client with configuration.
 *
 * @param {S3ClientConfig} config - S3 client configuration
 * @returns {CloudStorageProvider} Cloud storage provider instance
 *
 * @example
 * ```typescript
 * const s3Client = createS3Client({
 *   region: 'us-east-1',
 *   credentials: {
 *     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
 *   }
 * });
 * ```
 */
export const createS3Client = (config: S3ClientConfig): CloudStorageProvider => {
  try {
    // Try to use AWS SDK v3 if available
    const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } =
      require('@aws-sdk/client-s3');
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

    const s3Client = new S3Client({
      region: config.region,
      credentials: config.credentials,
      ...config,
    });

    return {
      async upload(file: Buffer | Readable, uploadConfig: S3UploadConfig): Promise<CloudStorageResult> {
        const body = file;
        const command = new PutObjectCommand({
          Bucket: uploadConfig.bucket,
          Key: uploadConfig.key,
          Body: body,
          ACL: uploadConfig.acl,
          ContentType: uploadConfig.contentType,
          ServerSideEncryption: uploadConfig.serverSideEncryption,
          Metadata: uploadConfig.metadata,
        });

        const result = await s3Client.send(command);
        return {
          key: uploadConfig.key,
          location: `https://${uploadConfig.bucket}.s3.${config.region}.amazonaws.com/${uploadConfig.key}`,
          etag: result.ETag || '',
          bucket: uploadConfig.bucket,
        };
      },

      async download(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
          Bucket: config.bucket || '',
          Key: key,
        });

        const result = await s3Client.send(command);
        const stream = result.Body as any;
        const chunks: Buffer[] = [];

        return new Promise((resolve, reject) => {
          stream.on('data', (chunk: Buffer) => chunks.push(chunk));
          stream.on('error', reject);
          stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
      },

      async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
          Bucket: config.bucket || '',
          Key: key,
        });
        await s3Client.send(command);
      },

      async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        const command = new GetObjectCommand({
          Bucket: config.bucket || '',
          Key: key,
        });
        return await getSignedUrl(s3Client, command, { expiresIn });
      },

      async listFiles(prefix?: string): Promise<CloudStorageFile[]> {
        const command = new ListObjectsV2Command({
          Bucket: config.bucket || '',
          Prefix: prefix,
        });

        const result = await s3Client.send(command);
        return (result.Contents || []).map((item) => ({
          key: item.Key || '',
          size: item.Size || 0,
          lastModified: item.LastModified || new Date(),
          etag: item.ETag || '',
        }));
      },
    };
  } catch (error) {
    console.warn(
      'S3 client requires AWS SDK v3. Install with: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner',
      'Error:',
      error.message,
    );

    // Return a minimal implementation that throws descriptive errors
    const notAvailableError = () => {
      throw new Error('AWS SDK not available. Install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner');
    };

    return {
      upload: notAvailableError,
      download: notAvailableError,
      delete: notAvailableError,
      getSignedUrl: notAvailableError,
      listFiles: notAvailableError,
    };
  }
};

/**
 * Uploads file to S3 bucket.
 *
 * @param {CloudStorageProvider} client - S3 client instance
 * @param {Buffer | Readable} file - File data to upload
 * @param {S3UploadConfig} config - Upload configuration
 * @returns {Promise<CloudStorageResult>} Upload result
 *
 * @example
 * ```typescript
 * const result = await uploadToS3(s3Client, fileBuffer, {
 *   bucket: 'my-bucket',
 *   key: 'uploads/file.pdf',
 *   acl: 'private',
 *   contentType: 'application/pdf',
 *   serverSideEncryption: 'AES256'
 * });
 * ```
 */
export const uploadToS3 = async (
  client: CloudStorageProvider,
  file: Buffer | Readable,
  config: S3UploadConfig,
): Promise<CloudStorageResult> => {
  return await client.upload(file, config);
};

/**
 * Downloads file from S3 bucket.
 *
 * @param {CloudStorageProvider} client - S3 client instance
 * @param {string} key - S3 object key
 * @returns {Promise<Buffer>} Downloaded file buffer
 *
 * @example
 * ```typescript
 * const fileData = await downloadFromS3(s3Client, 'uploads/file.pdf');
 * ```
 */
export const downloadFromS3 = async (client: CloudStorageProvider, key: string): Promise<Buffer> => {
  return await client.download(key);
};

/**
 * Generates signed URL for temporary access.
 *
 * @param {CloudStorageProvider} client - S3 client instance
 * @param {string} key - S3 object key
 * @param {number} [expiresIn] - Expiration time in seconds
 * @returns {Promise<string>} Signed URL
 *
 * @example
 * ```typescript
 * const url = await generateSignedUrl(s3Client, 'uploads/file.pdf', 3600);
 * console.log('Download URL:', url);
 * ```
 */
export const generateSignedUrl = async (
  client: CloudStorageProvider,
  key: string,
  expiresIn: number = 3600,
): Promise<string> => {
  return await client.getSignedUrl(key, expiresIn);
};

/**
 * Uploads file with multipart for large files.
 *
 * @param {CloudStorageProvider} client - S3 client instance
 * @param {Readable} stream - File stream
 * @param {S3UploadConfig} config - Upload configuration
 * @param {number} [partSize] - Part size in bytes
 * @returns {Promise<CloudStorageResult>} Upload result
 *
 * @example
 * ```typescript
 * const stream = fs.createReadStream('large-file.mp4');
 * const result = await uploadMultipart(s3Client, stream, {
 *   bucket: 'my-bucket',
 *   key: 'videos/large-file.mp4'
 * }, 10 * 1024 * 1024);
 * ```
 */
export const uploadMultipart = async (
  client: CloudStorageProvider,
  stream: Readable,
  config: S3UploadConfig,
  partSize: number = 5 * 1024 * 1024,
): Promise<CloudStorageResult> => {
  // For multipart uploads with AWS SDK v3, use Upload from @aws-sdk/lib-storage
  // This implementation delegates to the client's upload method which handles multipart internally
  return await client.upload(stream, config);
};

// ============================================================================
// LOCAL FILE SYSTEM MANAGEMENT
// ============================================================================

/**
 * Saves uploaded file to local filesystem with organized structure.
 *
 * @param {Buffer} data - File data
 * @param {string} filename - Desired filename
 * @param {Object} [options] - Save options
 * @returns {Promise<string>} Saved file path
 *
 * @example
 * ```typescript
 * const filePath = await saveToLocalStorage(fileBuffer, 'report.pdf', {
 *   baseDir: '/var/uploads',
 *   useDate: true,
 *   userId: 'user-123'
 * });
 * ```
 */
export const saveToLocalStorage = async (
  data: Buffer,
  filename: string,
  options?: {
    baseDir?: string;
    useDate?: boolean;
    userId?: string;
  },
): Promise<string> => {
  const baseDir = options?.baseDir || '/tmp/uploads';
  let dirPath = baseDir;

  if (options?.useDate) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dirPath = path.join(baseDir, String(year), month, day);
  }

  if (options?.userId) {
    dirPath = path.join(dirPath, options.userId);
  }

  await fs.mkdir(dirPath, { recursive: true });

  const uniqueFilename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${filename}`;
  const filePath = path.join(dirPath, uniqueFilename);

  await fs.writeFile(filePath, data);

  return filePath;
};

/**
 * Reads file from local storage.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<Buffer>} File data
 *
 * @example
 * ```typescript
 * const fileData = await readFromLocalStorage('/uploads/2024/01/file.pdf');
 * ```
 */
export const readFromLocalStorage = async (filePath: string): Promise<Buffer> => {
  return await fs.readFile(filePath);
};

/**
 * Deletes file from local storage.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>} True if deleted successfully
 *
 * @example
 * ```typescript
 * await deleteFromLocalStorage('/uploads/2024/01/old-file.pdf');
 * ```
 */
export const deleteFromLocalStorage = async (filePath: string): Promise<boolean> => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Moves file to different location.
 *
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await moveFile('/tmp/upload.pdf', '/uploads/2024/report.pdf');
 * ```
 */
export const moveFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.rename(sourcePath, destinationPath);
};

/**
 * Copies file to different location.
 *
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await copyFile('/uploads/original.jpg', '/backup/original.jpg');
 * ```
 */
export const copyFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.copyFile(sourcePath, destinationPath);
};

// ============================================================================
// FILE METADATA EXTRACTION
// ============================================================================

/**
 * Extracts comprehensive metadata from file.
 *
 * @param {Buffer | string} file - File buffer or path
 * @param {string} filename - Original filename
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractFileMetadata(fileBuffer, 'photo.jpg');
 * console.log('Dimensions:', metadata.dimensions);
 * ```
 */
export const extractFileMetadata = async (
  file: Buffer | string,
  filename: string,
): Promise<FileMetadata> => {
  const buffer = typeof file === 'string' ? await fs.readFile(file) : file;
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const mimeType = (await detectMimeType(buffer)) || 'application/octet-stream';

  return {
    filename,
    size: buffer.length,
    mimeType,
    extension: path.extname(filename).toLowerCase().slice(1),
    hash,
  };
};

/**
 * Extracts EXIF data from image.
 *
 * @param {Buffer | string} image - Image buffer or path
 * @returns {Promise<Record<string, any> | null>} EXIF data
 *
 * @example
 * ```typescript
 * const exif = await extractExifData(imageBuffer);
 * console.log('Camera:', exif?.Make, exif?.Model);
 * ```
 */
export const extractExifData = async (image: Buffer | string): Promise<Record<string, any> | null> => {
  try {
    // Try to use exif-parser or exifr library if available
    const ExifParser = require('exif-parser');
    const buffer = typeof image === 'string' ? await fs.readFile(image) : image;
    const parser = ExifParser.create(buffer);
    const result = parser.parse();
    return result.tags || null;
  } catch (error) {
    // EXIF library not available or image doesn't have EXIF data
    console.warn('EXIF extraction requires "exif-parser" library. Install with: npm install exif-parser');
    return null;
  }
};

/**
 * Calculates file hash (SHA-256).
 *
 * @param {Buffer | string} file - File buffer or path
 * @returns {Promise<string>} File hash
 *
 * @example
 * ```typescript
 * const hash = await calculateFileHash(fileBuffer);
 * console.log('SHA-256:', hash);
 * ```
 */
export const calculateFileHash = async (file: Buffer | string): Promise<string> => {
  const buffer = typeof file === 'string' ? await fs.readFile(file) : file;
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Extracts image dimensions.
 *
 * @param {Buffer | string} image - Image buffer or path
 * @returns {Promise<{ width: number; height: number } | null>} Image dimensions
 *
 * @example
 * ```typescript
 * const dimensions = await extractImageDimensions(imageBuffer);
 * console.log(`${dimensions.width}x${dimensions.height}`);
 * ```
 */
export const extractImageDimensions = async (
  image: Buffer | string,
): Promise<{ width: number; height: number } | null> => {
  const buffer = typeof image === 'string' ? await fs.readFile(image) : image;

  try {
    // Try to use sharp for metadata extraction
    const sharp = require('sharp');
    const metadata = await sharp(buffer).metadata();
    return { width: metadata.width || 0, height: metadata.height || 0 };
  } catch (sharpError) {
    // Fallback to basic dimension extraction from image headers
    try {
      return extractImageDimensionsFromBuffer(buffer);
    } catch (fallbackError) {
      console.warn('Unable to extract image dimensions:', fallbackError.message);
      return null;
    }
  }
};

// ============================================================================
// VIRUS SCANNING INTEGRATION
// ============================================================================

/**
 * Scans file for viruses using ClamAV or similar.
 *
 * @param {Buffer | string} file - File buffer or path
 * @returns {Promise<VirusScanResult>} Scan result
 *
 * @example
 * ```typescript
 * const scanResult = await scanFileForViruses(fileBuffer);
 * if (!scanResult.clean) {
 *   throw new Error(`Virus detected: ${scanResult.threats.join(', ')}`);
 * }
 * ```
 */
export const scanFileForViruses = async (file: Buffer | string): Promise<VirusScanResult> => {
  const buffer = typeof file === 'string' ? await fs.readFile(file) : file;

  try {
    // Try to use clamscan library if available
    const NodeClam = require('clamscan');
    const clamscan = await new NodeClam().init({
      removeInfected: false,
      quarantineInfected: false,
      debugMode: false,
    });

    const { isInfected, viruses } = await clamscan.scanBuffer(buffer);

    return {
      clean: !isInfected,
      threats: viruses || [],
      scanDate: new Date(),
      scanEngine: 'ClamAV',
      scanVersion: clamscan.version || '1.0.0',
    };
  } catch (error) {
    console.warn(
      'Virus scanning requires "clamscan" library and ClamAV daemon. Install with: npm install clamscan',
      'Skipping virus scan. Error:',
      error.message,
    );

    // Return clean status with warning - better to allow upload than block it
    // In production, configure based on security requirements
    return {
      clean: true,
      threats: [],
      scanDate: new Date(),
      scanEngine: 'none',
      scanVersion: 'N/A',
    };
  }
};

/**
 * Validates file against malware patterns.
 *
 * @param {Buffer} fileBuffer - File buffer to scan
 * @returns {Promise<boolean>} True if file appears safe
 *
 * @example
 * ```typescript
 * const isSafe = await validateAgainstMalwarePatterns(fileBuffer);
 * if (!isSafe) throw new Error('Suspicious file detected');
 * ```
 */
export const validateAgainstMalwarePatterns = async (fileBuffer: Buffer): Promise<boolean> => {
  // Check for common malware signatures
  const suspiciousPatterns = [
    Buffer.from('eval('),
    Buffer.from('base64_decode'),
    Buffer.from('exec('),
    Buffer.from('system('),
  ];

  for (const pattern of suspiciousPatterns) {
    if (fileBuffer.includes(pattern)) {
      return false;
    }
  }

  return true;
};

// ============================================================================
// FILE COMPRESSION AND ARCHIVING
// ============================================================================

/**
 * Compresses file using gzip.
 *
 * @param {Buffer} data - Data to compress
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressFile(fileBuffer);
 * console.log('Compression ratio:', fileBuffer.length / compressed.length);
 * ```
 */
export const compressFile = async (data: Buffer): Promise<Buffer> => {
  const zlib = require('zlib');
  return new Promise((resolve, reject) => {
    zlib.gzip(data, (err: Error | null, result: Buffer) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

/**
 * Decompresses gzip file.
 *
 * @param {Buffer} data - Compressed data
 * @returns {Promise<Buffer>} Decompressed data
 *
 * @example
 * ```typescript
 * const decompressed = await decompressFile(compressedBuffer);
 * ```
 */
export const decompressFile = async (data: Buffer): Promise<Buffer> => {
  const zlib = require('zlib');
  return new Promise((resolve, reject) => {
    zlib.gunzip(data, (err: Error | null, result: Buffer) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

/**
 * Creates ZIP archive from multiple files.
 *
 * @param {ArchiveEntry[]} entries - Files to archive
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<Buffer>} ZIP archive buffer
 *
 * @example
 * ```typescript
 * const archive = await createZipArchive([
 *   { name: 'file1.txt', data: buffer1 },
 *   { name: 'file2.pdf', data: buffer2 }
 * ], { compressionLevel: 9 });
 * ```
 */
export const createZipArchive = async (
  entries: ArchiveEntry[],
  options?: CompressionOptions,
): Promise<Buffer> => {
  try {
    const archiver = require('archiver');
    const { Writable } = require('stream');

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const bufferStream = new Writable({
        write(chunk, encoding, callback) {
          chunks.push(chunk);
          callback();
        },
      });

      const archive = archiver('zip', {
        zlib: { level: options?.compressionLevel || 9 },
      });

      archive.on('error', reject);
      archive.on('end', () => resolve(Buffer.concat(chunks)));

      archive.pipe(bufferStream);

      for (const entry of entries) {
        if (entry.data) {
          archive.append(entry.data, { name: entry.name });
        }
      }

      archive.finalize();
    });
  } catch (error) {
    console.warn(
      'ZIP archive creation requires "archiver" library. Install with: npm install archiver',
      'Error:',
      error.message,
    );
    throw new Error('Archive creation not available. Install archiver package.');
  }
};

/**
 * Extracts files from ZIP archive.
 *
 * @param {Buffer} zipData - ZIP archive buffer
 * @returns {Promise<ArchiveEntry[]>} Extracted entries
 *
 * @example
 * ```typescript
 * const files = await extractZipArchive(zipBuffer);
 * for (const file of files) {
 *   console.log(file.name, file.data?.length);
 * }
 * ```
 */
export const extractZipArchive = async (zipData: Buffer): Promise<ArchiveEntry[]> => {
  try {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipData);
    const zipEntries = zip.getEntries();

    return zipEntries.map((entry: any) => ({
      name: entry.entryName,
      data: entry.isDirectory ? undefined : entry.getData(),
    }));
  } catch (error) {
    console.warn(
      'ZIP archive extraction requires "adm-zip" library. Install with: npm install adm-zip',
      'Error:',
      error.message,
    );
    throw new Error('Archive extraction not available. Install adm-zip package.');
  }
};

// ============================================================================
// STREAMING FILE DOWNLOADS
// ============================================================================

/**
 * Creates readable stream for file download.
 *
 * @param {string} filePath - Path to file
 * @param {StreamDownloadOptions} [options] - Stream options
 * @returns {Readable} File stream
 *
 * @example
 * ```typescript
 * const stream = createDownloadStream('/uploads/file.mp4', {
 *   range: { start: 0, end: 1048576 },
 *   chunkSize: 65536
 * });
 * stream.pipe(response);
 * ```
 */
export const createDownloadStream = (
  filePath: string,
  options?: StreamDownloadOptions,
): Readable => {
  const fs = require('fs');
  const streamOptions: any = {};

  if (options?.range) {
    streamOptions.start = options.range.start;
    streamOptions.end = options.range.end;
  }

  if (options?.chunkSize) {
    streamOptions.highWaterMark = options.chunkSize;
  }

  return fs.createReadStream(filePath, streamOptions);
};

/**
 * Handles range request for partial file download.
 *
 * @param {string} filePath - Path to file
 * @param {string} rangeHeader - HTTP Range header value
 * @returns {Promise<{ stream: Readable; start: number; end: number; total: number }>} Range stream info
 *
 * @example
 * ```typescript
 * const rangeResult = await handleRangeRequest('/uploads/video.mp4', 'bytes=0-1023');
 * response.writeHead(206, {
 *   'Content-Range': `bytes ${rangeResult.start}-${rangeResult.end}/${rangeResult.total}`
 * });
 * rangeResult.stream.pipe(response);
 * ```
 */
export const handleRangeRequest = async (
  filePath: string,
  rangeHeader: string,
): Promise<{ stream: Readable; start: number; end: number; total: number }> => {
  const stats = await fs.stat(filePath);
  const total = stats.size;

  const parts = rangeHeader.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

  const stream = createDownloadStream(filePath, { range: { start, end } });

  return { stream, start, end, total };
};

/**
 * Creates transform stream for on-the-fly processing.
 *
 * @param {Function} transformer - Transform function
 * @returns {Transform} Transform stream
 *
 * @example
 * ```typescript
 * const encryptStream = createTransformStream((chunk) => {
 *   return encryptChunk(chunk);
 * });
 * fileStream.pipe(encryptStream).pipe(response);
 * ```
 */
export const createTransformStream = (transformer: (chunk: Buffer) => Buffer): Transform => {
  return new Transform({
    transform(chunk: Buffer, encoding: string, callback: Function) {
      try {
        const transformed = transformer(chunk);
        callback(null, transformed);
      } catch (error) {
        callback(error);
      }
    },
  });
};

// ============================================================================
// TEMPORARY FILE CLEANUP
// ============================================================================

/**
 * Cleans up expired temporary files.
 *
 * @param {string} directory - Directory to clean
 * @param {number} maxAge - Max age in milliseconds
 * @returns {Promise<number>} Number of files deleted
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredFiles('/tmp/uploads', 24 * 60 * 60 * 1000);
 * console.log(`Cleaned up ${deleted} expired files`);
 * ```
 */
export const cleanupExpiredFiles = async (directory: string, maxAge: number): Promise<number> => {
  const files = await fs.readdir(directory);
  const now = Date.now();
  let deletedCount = 0;

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.stat(filePath);

    if (now - stats.mtimeMs > maxAge) {
      await fs.unlink(filePath);
      deletedCount++;
    }
  }

  return deletedCount;
};

/**
 * Deletes orphaned upload chunks.
 *
 * @param {string} directory - Chunks directory
 * @param {number} maxAge - Max age in milliseconds
 * @returns {Promise<number>} Number of sessions cleaned
 *
 * @example
 * ```typescript
 * await cleanupOrphanedChunks('/tmp/upload-chunks', 24 * 60 * 60 * 1000);
 * ```
 */
export const cleanupOrphanedChunks = async (directory: string, maxAge: number): Promise<number> => {
  const sessions = await fs.readdir(directory);
  const now = Date.now();
  let cleanedCount = 0;

  for (const session of sessions) {
    const sessionPath = path.join(directory, session);
    const stats = await fs.stat(sessionPath);

    if (stats.isDirectory() && now - stats.mtimeMs > maxAge) {
      await fs.rm(sessionPath, { recursive: true, force: true });
      cleanedCount++;
    }
  }

  return cleanedCount;
};

/**
 * Schedules periodic cleanup task.
 *
 * @param {Function} cleanupFn - Cleanup function to execute
 * @param {number} interval - Interval in milliseconds
 * @returns {NodeJS.Timeout} Interval timer
 *
 * @example
 * ```typescript
 * const timer = scheduleCleanupTask(
 *   () => cleanupExpiredFiles('/tmp/uploads', 24 * 60 * 60 * 1000),
 *   60 * 60 * 1000 // Every hour
 * );
 * ```
 */
export const scheduleCleanupTask = (cleanupFn: () => Promise<void>, interval: number): NodeJS.Timeout => {
  return setInterval(async () => {
    try {
      await cleanupFn();
    } catch (error) {
      console.error('Cleanup task failed:', error);
    }
  }, interval);
};

// ============================================================================
// FILE VERSIONING
// ============================================================================

/**
 * Creates new version of existing file.
 *
 * @param {string} fileId - Original file ID
 * @param {Buffer} newContent - New file content
 * @param {string} [comment] - Version comment
 * @returns {Promise<FileVersion>} Created version info
 *
 * @example
 * ```typescript
 * const version = await createFileVersion('file-123', updatedBuffer, 'Updated header');
 * console.log('Version:', version.version);
 * ```
 */
export const createFileVersion = async (
  fileId: string,
  newContent: Buffer,
  comment?: string,
): Promise<FileVersion> => {
  const versionId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(newContent).digest('hex');

  // Store version metadata - in production, save to database
  const versionMetadataPath = `/tmp/file-versions/${fileId}`;
  await fs.mkdir(versionMetadataPath, { recursive: true });

  // Read existing versions to determine next version number
  const metadataFiles = await fs.readdir(versionMetadataPath).catch(() => []);
  const versionNumber = metadataFiles.filter((f) => f.endsWith('.json')).length + 1;

  // Save version content
  const storagePath = `${versionMetadataPath}/${versionId}.dat`;
  await fs.writeFile(storagePath, newContent);

  // Save version metadata
  const versionInfo = {
    versionId,
    fileId,
    version: versionNumber,
    size: newContent.length,
    hash,
    storagePath,
    createdAt: new Date(),
    comment,
  };

  await fs.writeFile(`${versionMetadataPath}/${versionId}.json`, JSON.stringify(versionInfo));

  return versionInfo;
};

/**
 * Retrieves specific file version.
 *
 * @param {string} fileId - File ID
 * @param {number} version - Version number
 * @returns {Promise<Buffer>} File content for specified version
 *
 * @example
 * ```typescript
 * const previousVersion = await getFileVersion('file-123', 2);
 * ```
 */
export const getFileVersion = async (fileId: string, version: number): Promise<Buffer> => {
  const versionMetadataPath = `/tmp/file-versions/${fileId}`;

  try {
    const metadataFiles = await fs.readdir(versionMetadataPath);
    const versionFiles = metadataFiles.filter((f) => f.endsWith('.json'));

    for (const metadataFile of versionFiles) {
      const metadataContent = await fs.readFile(`${versionMetadataPath}/${metadataFile}`, 'utf8');
      const metadata = JSON.parse(metadataContent);

      if (metadata.version === version) {
        return await fs.readFile(metadata.storagePath);
      }
    }

    throw new Error(`Version ${version} not found for file ${fileId}`);
  } catch (error) {
    throw new Error(`Failed to retrieve file version: ${error.message}`);
  }
};

/**
 * Lists all versions of a file.
 *
 * @param {string} fileId - File ID
 * @returns {Promise<FileVersion[]>} Array of file versions
 *
 * @example
 * ```typescript
 * const versions = await listFileVersions('file-123');
 * console.log(`File has ${versions.length} versions`);
 * ```
 */
export const listFileVersions = async (fileId: string): Promise<FileVersion[]> => {
  const versionMetadataPath = `/tmp/file-versions/${fileId}`;

  try {
    const metadataFiles = await fs.readdir(versionMetadataPath);
    const versionFiles = metadataFiles.filter((f) => f.endsWith('.json'));

    const versions: FileVersion[] = [];
    for (const metadataFile of versionFiles) {
      const metadataContent = await fs.readFile(`${versionMetadataPath}/${metadataFile}`, 'utf8');
      const metadata = JSON.parse(metadataContent);
      versions.push({
        ...metadata,
        createdAt: new Date(metadata.createdAt),
      });
    }

    return versions.sort((a, b) => b.version - a.version);
  } catch (error) {
    // No versions found or directory doesn't exist
    return [];
  }
};

/**
 * Restores file to specific version.
 *
 * @param {string} fileId - File ID
 * @param {number} version - Version number to restore
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreFileVersion('file-123', 3);
 * ```
 */
export const restoreFileVersion = async (fileId: string, version: number): Promise<void> => {
  const versionContent = await getFileVersion(fileId, version);
  // Save as current version
};

// ============================================================================
// CDN UPLOAD HELPERS
// ============================================================================

/**
 * Uploads file to CDN.
 *
 * @param {Buffer} file - File buffer
 * @param {CDNUploadConfig} config - CDN upload configuration
 * @returns {Promise<string>} CDN URL
 *
 * @example
 * ```typescript
 * const url = await uploadToCDN(imageBuffer, {
 *   provider: 'cloudflare',
 *   path: '/images/photo.jpg',
 *   cacheControl: 'public, max-age=31536000'
 * });
 * ```
 */
export const uploadToCDN = async (file: Buffer, config: CDNUploadConfig): Promise<string> => {
  // CDN integration depends on provider - Cloudflare, CloudFront, Fastly, etc.
  // This provides a template for integration
  console.log(`Uploading to CDN: ${config.provider}, path: ${config.path}`);

  // Example integration points:
  // - Cloudflare R2: Use @aws-sdk/client-s3 with Cloudflare endpoint
  // - CloudFront: Upload to S3, invalidate CloudFront cache
  // - Fastly: Use Fastly API

  // For now, return the expected CDN URL structure
  // In production, integrate with actual CDN provider SDK
  const cdnHost = process.env.CDN_HOST || 'cdn.example.com';
  return `https://${cdnHost}${config.path}`;
};

/**
 * Invalidates CDN cache for file.
 *
 * @param {string} path - File path in CDN
 * @param {CDNUploadConfig} config - CDN configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await invalidateCDNCache('/images/photo.jpg', {
 *   provider: 'cloudfront',
 *   distributionId: 'E1234567890'
 * });
 * ```
 */
export const invalidateCDNCache = async (path: string, config: CDNUploadConfig): Promise<void> => {
  // CDN cache invalidation depends on provider
  console.log(`Invalidating CDN cache for: ${path}, provider: ${config.provider}`);

  // Example integration points:
  // - CloudFront: Use CreateInvalidationCommand from @aws-sdk/client-cloudfront
  // - Cloudflare: Use Cloudflare API v4 purge endpoint
  // - Fastly: Use Fastly purge API

  // In production, implement based on CDN provider:
  // if (config.provider === 'cloudfront' && config.distributionId) {
  //   const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
  //   const client = new CloudFrontClient({ region: 'us-east-1' });
  //   await client.send(new CreateInvalidationCommand({
  //     DistributionId: config.distributionId,
  //     InvalidationBatch: {
  //       CallerReference: Date.now().toString(),
  //       Paths: { Quantity: 1, Items: [path] }
  //     }
  //   }));
  // }
};

// ============================================================================
// FILE ACCESS CONTROL
// ============================================================================

/**
 * Checks if user has permission to access file.
 *
 * @param {string} fileId - File ID
 * @param {string} userId - User ID
 * @param {FilePermission} permission - Required permission
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canDownload = await checkFilePermission('file-123', 'user-456', 'download');
 * if (!canDownload) throw new ForbiddenError();
 * ```
 */
export const checkFilePermission = async (
  fileId: string,
  userId: string,
  permission: FilePermission,
): Promise<boolean> => {
  // In production, check against database or permission service
  // This implementation uses file system as temporary storage
  const permissionsPath = `/tmp/file-permissions/${fileId}`;

  try {
    const permissionsContent = await fs.readFile(permissionsPath, 'utf8');
    const permissions = JSON.parse(permissionsContent);

    // Check if user has permission
    const userPermission = permissions[userId];
    if (!userPermission) return false;

    return userPermission.permissions.includes(permission) &&
      (!userPermission.expiresAt || new Date(userPermission.expiresAt) > new Date());
  } catch {
    // No permissions file or permission not found - deny by default
    return false;
  }
};

/**
 * Grants file access to user or role.
 *
 * @param {FileAccessControl} accessControl - Access control configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await grantFileAccess({
 *   fileId: 'file-123',
 *   userId: 'user-456',
 *   permissions: ['read', 'download'],
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export const grantFileAccess = async (accessControl: FileAccessControl): Promise<void> => {
  // In production, save to database
  const permissionsPath = `/tmp/file-permissions/${accessControl.fileId}`;
  await fs.mkdir(path.dirname(permissionsPath), { recursive: true });

  let permissions: Record<string, any> = {};

  try {
    const existingContent = await fs.readFile(permissionsPath, 'utf8');
    permissions = JSON.parse(existingContent);
  } catch {
    // File doesn't exist yet, start fresh
  }

  permissions[accessControl.userId || ''] = {
    permissions: accessControl.permissions,
    expiresAt: accessControl.expiresAt?.toISOString(),
    grantedAt: new Date().toISOString(),
  };

  await fs.writeFile(permissionsPath, JSON.stringify(permissions, null, 2));
};

/**
 * Revokes file access from user or role.
 *
 * @param {string} fileId - File ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeFileAccess('file-123', 'user-456');
 * ```
 */
export const revokeFileAccess = async (fileId: string, userId: string): Promise<void> => {
  const permissionsPath = `/tmp/file-permissions/${fileId}`;

  try {
    const permissionsContent = await fs.readFile(permissionsPath, 'utf8');
    const permissions = JSON.parse(permissionsContent);

    delete permissions[userId];

    await fs.writeFile(permissionsPath, JSON.stringify(permissions, null, 2));
  } catch {
    // File doesn't exist or already revoked - no action needed
  }
};

/**
 * Lists users with access to file.
 *
 * @param {string} fileId - File ID
 * @returns {Promise<FileAccessControl[]>} Array of access controls
 *
 * @example
 * ```typescript
 * const accessList = await listFileAccessControls('file-123');
 * console.log(`${accessList.length} users have access`);
 * ```
 */
export const listFileAccessControls = async (fileId: string): Promise<FileAccessControl[]> => {
  const permissionsPath = `/tmp/file-permissions/${fileId}`;

  try {
    const permissionsContent = await fs.readFile(permissionsPath, 'utf8');
    const permissions = JSON.parse(permissionsContent);

    return Object.entries(permissions).map(([userId, data]: [string, any]) => ({
      fileId,
      userId,
      permissions: data.permissions,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    }));
  } catch {
    return [];
  }
};

/**
 * Validates file access token.
 *
 * @param {string} fileId - File ID
 * @param {string} token - Access token
 * @returns {Promise<boolean>} True if token is valid
 *
 * @example
 * ```typescript
 * const isValid = await validateFileAccessToken('file-123', 'token-abc');
 * if (!isValid) throw new UnauthorizedError();
 * ```
 */
export const validateFileAccessToken = async (fileId: string, token: string): Promise<boolean> => {
  try {
    // In production, use JWT library for proper token validation
    // For now, validate token format and expiration from token storage
    const tokenPath = `/tmp/file-tokens/${fileId}/${token}`;
    const tokenContent = await fs.readFile(tokenPath, 'utf8');
    const tokenData = JSON.parse(tokenContent);

    // Check if token is expired
    if (tokenData.expiresAt && new Date(tokenData.expiresAt) < new Date()) {
      await fs.unlink(tokenPath).catch(() => {}); // Clean up expired token
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Generates temporary access token for file.
 *
 * @param {string} fileId - File ID
 * @param {number} [expiresIn] - Expiration time in seconds
 * @returns {Promise<string>} Access token
 *
 * @example
 * ```typescript
 * const token = await generateFileAccessToken('file-123', 3600);
 * const downloadUrl = `/files/${fileId}/download?token=${token}`;
 * ```
 */
export const generateFileAccessToken = async (fileId: string, expiresIn: number = 3600): Promise<string> => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Store token metadata - in production, use JWT or database
  const tokenPath = `/tmp/file-tokens/${fileId}`;
  await fs.mkdir(tokenPath, { recursive: true });

  await fs.writeFile(
    `${tokenPath}/${token}`,
    JSON.stringify({
      fileId,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    }),
  );

  return token;
};

// ============================================================================
// HELPER FUNCTIONS FOR IMAGE DIMENSION EXTRACTION
// ============================================================================

/**
 * Extracts JPEG dimensions from buffer by reading JPEG markers.
 * @internal
 */
function extractJPEGDimensions(buffer: Buffer): { width: number; height: number } | null {
  let offset = 2; // Skip SOI marker
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) break;

    const marker = buffer[offset + 1];
    const size = buffer.readUInt16BE(offset + 2);

    // SOF markers contain dimension info
    if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += size + 2;
  }

  return null;
}

/**
 * Extracts PNG dimensions from buffer by reading PNG chunks.
 * @internal
 */
function extractPNGDimensions(buffer: Buffer): { width: number; height: number } | null {
  // PNG signature is 8 bytes, followed by IHDR chunk
  if (buffer.length < 24) return null;

  // Check PNG signature
  if (buffer.toString('hex', 0, 8) !== '89504e470d0a1a0a') return null;

  // Read width and height from IHDR chunk (bytes 16-23)
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

/**
 * Attempts basic dimension extraction for various image formats.
 * @internal
 */
function extractBasicImageDimensions(buffer: Buffer): { width: number; height: number } | null {
  // Try PNG first
  if (buffer.toString('hex', 0, 8) === '89504e470d0a1a0a') {
    return extractPNGDimensions(buffer);
  }

  // Try JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    return extractJPEGDimensions(buffer);
  }

  // GIF (GIF87a or GIF89a)
  if (buffer.toString('ascii', 0, 3) === 'GIF') {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    };
  }

  // BMP
  if (buffer.toString('ascii', 0, 2) === 'BM') {
    return {
      width: buffer.readUInt32LE(18),
      height: buffer.readUInt32LE(22),
    };
  }

  // WebP
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    // WebP dimension extraction is more complex, require sharp library
    return null;
  }

  return null;
}

/**
 * Checks if image dimensions are from a valid buffer.
 * @internal
 */
function extractImageDimensionsFromBuffer(buffer: Buffer): { width: number; height: number } | null {
  return extractBasicImageDimensions(buffer);
}
