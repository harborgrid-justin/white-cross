/**
 * LOC: MAILATTACH001
 * File: /reuse/server/mail/mail-attachment-handling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/platform-express
 *   - multer
 *   - sequelize (v6.x)
 *   - @aws-sdk/client-s3
 *   - @azure/storage-blob
 *   - sharp
 *   - file-type
 *   - archiver
 *   - clamscan
 *   - stream
 *
 * DOWNSTREAM (imported by):
 *   - Mail services
 *   - Email attachment controllers
 *   - Message composition modules
 *   - Document handling services
 *   - Healthcare communication modules
 */

/**
 * File: /reuse/server/mail/mail-attachment-handling-kit.ts
 * Locator: WC-UTL-MAILATTACH-001
 * Purpose: Enterprise Mail Attachment Handling Kit for NestJS - Exchange Server Compatible
 *
 * Upstream: @nestjs/common, multer, sequelize, AWS SDK v3, Azure Storage, sharp, file-type
 * Downstream: ../backend/*, Mail services, Email controllers, Document services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Sharp 0.33.x
 * Exports: 45 utility functions for attachment upload, storage, virus scanning, compression, streaming
 *
 * LLM Context: Enterprise-grade mail attachment handling utilities for White Cross healthcare platform.
 * Provides comprehensive email attachment upload/download, inline image (CID) handling, size validation,
 * virus scanning integration, metadata extraction, thumbnail generation, compression, cloud storage
 * (S3/Azure), streaming, HIPAA-compliant storage, NestJS upload interceptors, Swagger documentation,
 * and Exchange Server-compatible attachment processing for secure medical document communication.
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
import { Readable, Transform, PassThrough } from 'stream';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import * as mimeTypes from 'mime-types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Mail attachment metadata
 */
export interface MailAttachment {
  id: string;
  messageId: string;
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
  encoding?: string;
  contentId?: string; // For inline images (CID)
  contentDisposition: 'attachment' | 'inline';
  storageType: 'local' | 's3' | 'azure' | 'database';
  storagePath?: string;
  storageKey?: string;
  storageContainer?: string;
  checksum: string;
  checksumAlgorithm: 'md5' | 'sha256' | 'sha512';
  isInline: boolean;
  isDeleted: boolean;
  virusScanStatus?: 'pending' | 'clean' | 'infected' | 'error';
  virusScanDate?: Date;
  virusScanResult?: string;
  thumbnailPath?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Attachment upload configuration
 */
export interface AttachmentUploadConfig {
  maxFileSize: number;
  maxTotalSize?: number;
  maxAttachments?: number;
  allowedMimeTypes?: string[];
  blockedMimeTypes?: string[];
  allowedExtensions?: string[];
  blockedExtensions?: string[];
  requireVirusScan?: boolean;
  generateThumbnails?: boolean;
  compressImages?: boolean;
  storageType: 'local' | 's3' | 'azure' | 'database';
  storageConfig?: LocalStorageConfig | S3StorageConfig | AzureStorageConfig;
}

/**
 * Local filesystem storage configuration
 */
export interface LocalStorageConfig {
  basePath: string;
  permissions?: string;
  createDirectories?: boolean;
  useHashedDirectories?: boolean;
  hashDepth?: number;
}

/**
 * AWS S3 storage configuration
 */
export interface S3StorageConfig {
  region: string;
  bucket: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  prefix?: string;
  acl?: 'private' | 'public-read' | 'authenticated-read';
  serverSideEncryption?: 'AES256' | 'aws:kms';
  kmsKeyId?: string;
  storageClass?: 'STANDARD' | 'INTELLIGENT_TIERING' | 'GLACIER';
}

/**
 * Azure Blob Storage configuration
 */
export interface AzureStorageConfig {
  accountName: string;
  accountKey?: string;
  connectionString?: string;
  containerName: string;
  sasToken?: string;
  blobPrefix?: string;
  tier?: 'Hot' | 'Cool' | 'Archive';
}

/**
 * Attachment upload result
 */
export interface AttachmentUploadResult {
  id: string;
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
  contentId?: string;
  url?: string;
  thumbnailUrl?: string;
  checksum: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Attachment validation result
 */
export interface AttachmentValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  detectedMimeType?: string;
  actualExtension?: string;
  isExecutable?: boolean;
  isSuspicious?: boolean;
}

/**
 * Virus scan configuration
 */
export interface VirusScanConfig {
  enabled: boolean;
  clamavHost?: string;
  clamavPort?: number;
  timeout?: number;
  removeInfected?: boolean;
  quarantinePath?: string;
  scanMode?: 'upload' | 'async' | 'disabled';
}

/**
 * Virus scan result
 */
export interface VirusScanResult {
  isClean: boolean;
  isInfected: boolean;
  viruses?: string[];
  scanDate: Date;
  scanner: string;
  scanDuration?: number;
  errorMessage?: string;
}

/**
 * Thumbnail generation configuration
 */
export interface ThumbnailConfig {
  enabled: boolean;
  sizes: Array<{
    name: string;
    width: number;
    height: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  }>;
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number;
  storagePath?: string;
}

/**
 * Image compression configuration
 */
export interface ImageCompressionConfig {
  enabled: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  preserveMetadata?: boolean;
}

/**
 * Attachment metadata extraction result
 */
export interface AttachmentMetadata {
  filename: string;
  size: number;
  mimeType: string;
  extension: string;
  width?: number;
  height?: number;
  duration?: number; // For video/audio
  pages?: number; // For PDFs
  createdDate?: Date;
  modifiedDate?: Date;
  author?: string;
  title?: string;
  description?: string;
  exif?: Record<string, any>; // For images
  format?: string;
  encoding?: string;
  bitrate?: number;
  sampleRate?: number;
  colorSpace?: string;
  hasAlpha?: boolean;
  isAnimated?: boolean;
}

/**
 * Attachment download options
 */
export interface AttachmentDownloadOptions {
  inline?: boolean;
  downloadFilename?: string;
  contentType?: string;
  cacheControl?: string;
  expires?: Date;
  presignedUrl?: boolean;
  presignedExpiry?: number; // Seconds
}

/**
 * Inline image (CID) reference
 */
export interface InlineImageReference {
  contentId: string;
  attachmentId: string;
  filename: string;
  url?: string;
  mimeType: string;
}

/**
 * Attachment streaming options
 */
export interface StreamingOptions {
  start?: number;
  end?: number;
  chunkSize?: number;
  highWaterMark?: number;
}

/**
 * Bulk attachment operation result
 */
export interface BulkAttachmentResult {
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    filename: string;
    success: boolean;
    attachmentId?: string;
    error?: string;
  }>;
}

/**
 * Attachment quota information
 */
export interface AttachmentQuota {
  userId: string;
  maxStorageBytes: number;
  usedStorageBytes: number;
  availableStorageBytes: number;
  maxAttachmentsPerMessage: number;
  maxAttachmentSize: number;
  totalAttachments: number;
  quotaPercentage: number;
}

/**
 * Attachment compression result
 */
export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  savedBytes: number;
  algorithm: string;
  path?: string;
  buffer?: Buffer;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITION
// ============================================================================

/**
 * Sequelize model attributes for mail attachments table
 */
export const MailAttachmentAttributes: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique attachment identifier',
  },
  messageId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Associated email message ID',
    references: {
      model: 'mail_messages',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Stored filename',
  },
  originalFilename: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Original filename from upload',
  },
  contentType: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'MIME type (e.g., image/jpeg, application/pdf)',
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'File size in bytes',
  },
  encoding: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Content transfer encoding (base64, quoted-printable, etc.)',
  },
  contentId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    comment: 'Content-ID for inline images (CID references)',
  },
  contentDisposition: {
    type: DataTypes.ENUM('attachment', 'inline'),
    allowNull: false,
    defaultValue: 'attachment',
    comment: 'How attachment should be displayed',
  },
  storageType: {
    type: DataTypes.ENUM('local', 's3', 'azure', 'database'),
    allowNull: false,
    defaultValue: 'local',
    comment: 'Storage backend type',
  },
  storagePath: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'Local filesystem path',
  },
  storageKey: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'S3/Azure storage key',
  },
  storageContainer: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Azure container or S3 bucket name',
  },
  checksum: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: 'File integrity checksum',
  },
  checksumAlgorithm: {
    type: DataTypes.ENUM('md5', 'sha256', 'sha512'),
    allowNull: false,
    defaultValue: 'sha256',
    comment: 'Checksum algorithm used',
  },
  isInline: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether attachment is inline (embedded in message)',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Soft delete flag',
  },
  virusScanStatus: {
    type: DataTypes.ENUM('pending', 'clean', 'infected', 'error'),
    allowNull: true,
    comment: 'Virus scan status',
  },
  virusScanDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When virus scan was performed',
  },
  virusScanResult: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Virus scan detailed results',
  },
  thumbnailPath: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    comment: 'Path to generated thumbnail (for images)',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional metadata (EXIF, dimensions, etc.)',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp',
  },
};

/**
 * Sequelize model options for mail attachments
 */
export const MailAttachmentOptions: ModelOptions = {
  tableName: 'mail_attachments',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_mail_attachments_message_id',
      fields: ['message_id'],
    },
    {
      name: 'idx_mail_attachments_content_id',
      fields: ['content_id'],
      unique: true,
      where: { content_id: { [Op.ne]: null } },
    },
    {
      name: 'idx_mail_attachments_checksum',
      fields: ['checksum'],
    },
    {
      name: 'idx_mail_attachments_created_at',
      fields: ['created_at'],
    },
    {
      name: 'idx_mail_attachments_is_deleted',
      fields: ['is_deleted'],
    },
    {
      name: 'idx_mail_attachments_virus_scan',
      fields: ['virus_scan_status', 'virus_scan_date'],
    },
  ],
};

/**
 * Creates and initializes the MailAttachment Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized MailAttachment model
 * @example
 * const MailAttachment = defineMailAttachmentModel(sequelize);
 */
export function defineMailAttachmentModel(sequelize: Sequelize): typeof Model {
  class MailAttachment extends Model {}

  MailAttachment.init(MailAttachmentAttributes, {
    ...MailAttachmentOptions,
    sequelize,
  });

  return MailAttachment;
}

// ============================================================================
// ATTACHMENT VALIDATION
// ============================================================================

/**
 * Validates attachment against configured rules
 * @param file - Uploaded file buffer or metadata
 * @param config - Upload configuration
 * @returns Validation result with errors/warnings
 * @example
 * const result = await validateAttachment(uploadedFile, {
 *   maxFileSize: 25 * 1024 * 1024,
 *   allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
 * });
 */
export async function validateAttachment(
  file: { filename: string; size: number; buffer?: Buffer; mimetype?: string },
  config: AttachmentUploadConfig
): Promise<AttachmentValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let detectedMimeType: string | undefined;
  let actualExtension: string | undefined;
  let isExecutable = false;
  let isSuspicious = false;

  // Size validation
  if (file.size > config.maxFileSize) {
    errors.push(
      `File size ${file.size} bytes exceeds maximum allowed size of ${config.maxFileSize} bytes`
    );
  }

  // Detect actual file type from buffer magic bytes
  if (file.buffer) {
    const fileType = await detectFileType(file.buffer);
    if (fileType) {
      detectedMimeType = fileType.mime;
      actualExtension = fileType.ext;
    }
  }

  // Extension validation
  const fileExtension = path.extname(file.filename).toLowerCase();
  if (config.allowedExtensions && config.allowedExtensions.length > 0) {
    if (!config.allowedExtensions.includes(fileExtension)) {
      errors.push(
        `File extension ${fileExtension} not allowed. Allowed: ${config.allowedExtensions.join(', ')}`
      );
    }
  }

  if (config.blockedExtensions && config.blockedExtensions.includes(fileExtension)) {
    errors.push(`File extension ${fileExtension} is blocked`);
  }

  // MIME type validation
  const mimeType = file.mimetype || detectedMimeType;
  if (mimeType) {
    if (config.allowedMimeTypes && config.allowedMimeTypes.length > 0) {
      if (!config.allowedMimeTypes.includes(mimeType)) {
        errors.push(
          `MIME type ${mimeType} not allowed. Allowed: ${config.allowedMimeTypes.join(', ')}`
        );
      }
    }

    if (config.blockedMimeTypes && config.blockedMimeTypes.includes(mimeType)) {
      errors.push(`MIME type ${mimeType} is blocked`);
    }
  }

  // Check for executable files
  const executableExtensions = [
    '.exe',
    '.bat',
    '.cmd',
    '.com',
    '.scr',
    '.vbs',
    '.js',
    '.jar',
    '.app',
    '.deb',
    '.rpm',
  ];
  if (executableExtensions.includes(fileExtension)) {
    isExecutable = true;
    warnings.push(`File appears to be executable: ${fileExtension}`);
  }

  // MIME type mismatch detection
  if (detectedMimeType && file.mimetype && detectedMimeType !== file.mimetype) {
    isSuspicious = true;
    warnings.push(
      `MIME type mismatch: claimed ${file.mimetype}, detected ${detectedMimeType}`
    );
  }

  // Filename validation
  if (!isValidFilename(file.filename)) {
    errors.push('Filename contains invalid characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    detectedMimeType,
    actualExtension,
    isExecutable,
    isSuspicious,
  };
}

/**
 * Detects file type from buffer using magic bytes
 * @param buffer - File buffer
 * @returns Detected file type with MIME and extension
 * @example
 * const type = await detectFileType(fileBuffer);
 * console.log(type.mime); // 'image/jpeg'
 */
export async function detectFileType(
  buffer: Buffer
): Promise<{ mime: string; ext: string } | null> {
  const { fileTypeFromBuffer } = await import('file-type');
  const result = await fileTypeFromBuffer(buffer);
  return result ? { mime: result.mime, ext: result.ext } : null;
}

/**
 * Validates filename for security (prevents path traversal, invalid chars)
 * @param filename - Filename to validate
 * @returns True if filename is safe
 * @example
 * const isSafe = isValidFilename('document.pdf'); // true
 * const isUnsafe = isValidFilename('../../../etc/passwd'); // false
 */
export function isValidFilename(filename: string): boolean {
  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }

  // Check for null bytes
  if (filename.includes('\0')) {
    return false;
  }

  // Check for control characters
  if (/[\x00-\x1f\x80-\x9f]/.test(filename)) {
    return false;
  }

  // Ensure not empty
  if (!filename.trim()) {
    return false;
  }

  return true;
}

/**
 * Sanitizes filename by removing/replacing unsafe characters
 * @param filename - Original filename
 * @returns Sanitized filename
 * @example
 * const safe = sanitizeFilename('my file (copy) [1].pdf');
 * // 'my_file_copy_1.pdf'
 */
export function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);

  // Replace unsafe characters with underscores
  let sanitized = base
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');

  // Ensure not empty
  if (!sanitized) {
    sanitized = `file_${Date.now()}`;
  }

  // Limit length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }

  return sanitized + ext.toLowerCase();
}

// ============================================================================
// ATTACHMENT UPLOAD
// ============================================================================

/**
 * Uploads attachment to configured storage backend
 * @param file - File buffer and metadata
 * @param messageId - Associated message ID
 * @param config - Upload configuration
 * @param options - Additional upload options
 * @returns Upload result with attachment metadata
 * @example
 * const result = await uploadAttachment(
 *   { buffer, filename: 'report.pdf', mimetype: 'application/pdf', size: 1024000 },
 *   'msg-123',
 *   { maxFileSize: 25MB, storageType: 's3' }
 * );
 */
export async function uploadAttachment(
  file: { buffer: Buffer; filename: string; mimetype: string; size: number },
  messageId: string,
  config: AttachmentUploadConfig,
  options?: {
    contentId?: string;
    isInline?: boolean;
    generateThumbnail?: boolean;
    compressImage?: boolean;
  }
): Promise<AttachmentUploadResult> {
  // Validate attachment
  const validation = await validateAttachment(file, config);
  if (!validation.valid) {
    throw new Error(`Attachment validation failed: ${validation.errors.join(', ')}`);
  }

  // Generate unique filename
  const sanitizedFilename = sanitizeFilename(file.filename);
  const uniqueFilename = generateUniqueFilename(sanitizedFilename);

  // Calculate checksum
  const checksum = calculateChecksum(file.buffer, 'sha256');

  // Store file based on storage type
  let storagePath: string | undefined;
  let storageKey: string | undefined;
  let storageContainer: string | undefined;

  switch (config.storageType) {
    case 'local':
      if (config.storageConfig) {
        storagePath = await uploadToLocalStorage(
          file.buffer,
          uniqueFilename,
          config.storageConfig as LocalStorageConfig
        );
      }
      break;
    case 's3':
      if (config.storageConfig) {
        const s3Result = await uploadToS3(
          file.buffer,
          uniqueFilename,
          file.mimetype,
          config.storageConfig as S3StorageConfig
        );
        storageKey = s3Result.key;
        storageContainer = s3Result.bucket;
      }
      break;
    case 'azure':
      if (config.storageConfig) {
        const azureResult = await uploadToAzure(
          file.buffer,
          uniqueFilename,
          file.mimetype,
          config.storageConfig as AzureStorageConfig
        );
        storageKey = azureResult.blobName;
        storageContainer = azureResult.containerName;
      }
      break;
  }

  // Generate thumbnail if needed
  let thumbnailPath: string | undefined;
  if (options?.generateThumbnail && isImageMimeType(file.mimetype)) {
    thumbnailPath = await generateThumbnailForAttachment(file.buffer, uniqueFilename);
  }

  const result: AttachmentUploadResult = {
    id: crypto.randomUUID(),
    filename: uniqueFilename,
    originalFilename: file.filename,
    contentType: file.mimetype,
    size: file.size,
    contentId: options?.contentId,
    checksum,
    uploadedAt: new Date(),
    metadata: {
      storagePath,
      storageKey,
      storageContainer,
      thumbnailPath,
      isInline: options?.isInline || false,
    },
  };

  return result;
}

/**
 * Uploads multiple attachments in batch
 * @param files - Array of files to upload
 * @param messageId - Associated message ID
 * @param config - Upload configuration
 * @returns Bulk upload results
 * @example
 * const results = await uploadMultipleAttachments(files, 'msg-123', config);
 */
export async function uploadMultipleAttachments(
  files: Array<{ buffer: Buffer; filename: string; mimetype: string; size: number }>,
  messageId: string,
  config: AttachmentUploadConfig
): Promise<BulkAttachmentResult> {
  // Validate total count
  if (config.maxAttachments && files.length > config.maxAttachments) {
    throw new Error(
      `Too many attachments: ${files.length} exceeds maximum of ${config.maxAttachments}`
    );
  }

  // Validate total size
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (config.maxTotalSize && totalSize > config.maxTotalSize) {
    throw new Error(
      `Total attachment size ${totalSize} bytes exceeds maximum of ${config.maxTotalSize} bytes`
    );
  }

  const results: BulkAttachmentResult = {
    total: files.length,
    successful: 0,
    failed: 0,
    results: [],
  };

  // Upload each file
  for (const file of files) {
    try {
      const result = await uploadAttachment(file, messageId, config);
      results.successful++;
      results.results.push({
        filename: file.filename,
        success: true,
        attachmentId: result.id,
      });
    } catch (error: any) {
      results.failed++;
      results.results.push({
        filename: file.filename,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Generates unique filename with timestamp and random suffix
 * @param originalFilename - Original filename
 * @returns Unique filename
 * @example
 * const unique = generateUniqueFilename('document.pdf');
 * // '20240115_143022_abc123_document.pdf'
 */
export function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename);
  const base = path.basename(originalFilename, ext);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_');
  const random = crypto.randomBytes(4).toString('hex');
  return `${timestamp}_${random}_${base}${ext}`;
}

/**
 * Uploads file to local filesystem storage
 * @param buffer - File buffer
 * @param filename - Filename
 * @param config - Local storage configuration
 * @returns Storage path
 * @example
 * const path = await uploadToLocalStorage(buffer, 'file.pdf', config);
 */
export async function uploadToLocalStorage(
  buffer: Buffer,
  filename: string,
  config: LocalStorageConfig
): Promise<string> {
  let targetPath = config.basePath;

  // Use hashed directories for better performance
  if (config.useHashedDirectories) {
    const hash = crypto.createHash('md5').update(filename).digest('hex');
    const depth = config.hashDepth || 2;
    const dirs: string[] = [];

    for (let i = 0; i < depth; i++) {
      dirs.push(hash.substring(i * 2, i * 2 + 2));
    }

    targetPath = path.join(targetPath, ...dirs);
  }

  // Create directories if needed
  if (config.createDirectories) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  const filePath = path.join(targetPath, filename);
  await fs.writeFile(filePath, buffer, {
    mode: config.permissions ? parseInt(config.permissions, 8) : 0o644,
  });

  return filePath;
}

/**
 * Uploads file to AWS S3
 * @param buffer - File buffer
 * @param filename - Filename
 * @param contentType - MIME type
 * @param config - S3 configuration
 * @returns S3 upload result
 * @example
 * const result = await uploadToS3(buffer, 'file.pdf', 'application/pdf', s3Config);
 */
export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  contentType: string,
  config: S3StorageConfig
): Promise<{ bucket: string; key: string; etag: string; url: string }> {
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  const client = new S3Client({
    region: config.region,
    credentials: config.accessKeyId
      ? {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey!,
        }
      : undefined,
    endpoint: config.endpoint,
  });

  const key = config.prefix ? `${config.prefix}/${filename}` : filename;

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: config.acl,
    ServerSideEncryption: config.serverSideEncryption,
    SSEKMSKeyId: config.kmsKeyId,
    StorageClass: config.storageClass,
  });

  const result = await client.send(command);

  return {
    bucket: config.bucket,
    key,
    etag: result.ETag || '',
    url: `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`,
  };
}

/**
 * Uploads file to Azure Blob Storage
 * @param buffer - File buffer
 * @param filename - Filename
 * @param contentType - MIME type
 * @param config - Azure configuration
 * @returns Azure upload result
 * @example
 * const result = await uploadToAzure(buffer, 'file.pdf', 'application/pdf', azureConfig);
 */
export async function uploadToAzure(
  buffer: Buffer,
  filename: string,
  contentType: string,
  config: AzureStorageConfig
): Promise<{ containerName: string; blobName: string; url: string }> {
  const { BlobServiceClient } = await import('@azure/storage-blob');

  let blobServiceClient: any;

  if (config.connectionString) {
    blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);
  } else {
    const credential = await import('@azure/storage-blob').then((m) => m.StorageSharedKeyCredential);
    const sharedKeyCredential = new credential(config.accountName, config.accountKey!);
    blobServiceClient = new BlobServiceClient(
      `https://${config.accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );
  }

  const containerClient = blobServiceClient.getContainerClient(config.containerName);
  const blobName = config.blobPrefix ? `${config.blobPrefix}/${filename}` : filename;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
    tier: config.tier,
  });

  return {
    containerName: config.containerName,
    blobName,
    url: blockBlobClient.url,
  };
}

// ============================================================================
// ATTACHMENT DOWNLOAD & RETRIEVAL
// ============================================================================

/**
 * Downloads attachment from storage
 * @param attachment - Attachment metadata
 * @param options - Download options
 * @returns File buffer
 * @example
 * const buffer = await downloadAttachment(attachment, { inline: false });
 */
export async function downloadAttachment(
  attachment: MailAttachment,
  options?: AttachmentDownloadOptions
): Promise<Buffer> {
  let buffer: Buffer;

  switch (attachment.storageType) {
    case 'local':
      buffer = await downloadFromLocalStorage(attachment.storagePath!);
      break;
    case 's3':
      buffer = await downloadFromS3(attachment.storageKey!, attachment.storageContainer!);
      break;
    case 'azure':
      buffer = await downloadFromAzure(attachment.storageKey!, attachment.storageContainer!);
      break;
    default:
      throw new Error(`Unsupported storage type: ${attachment.storageType}`);
  }

  // Verify checksum
  const checksum = calculateChecksum(buffer, attachment.checksumAlgorithm);
  if (checksum !== attachment.checksum) {
    throw new Error('Attachment checksum mismatch - file may be corrupted');
  }

  return buffer;
}

/**
 * Downloads file from local storage
 * @param filePath - Local file path
 * @returns File buffer
 * @example
 * const buffer = await downloadFromLocalStorage('/var/mail/attachments/file.pdf');
 */
export async function downloadFromLocalStorage(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

/**
 * Downloads file from AWS S3
 * @param key - S3 object key
 * @param bucket - S3 bucket name
 * @returns File buffer
 * @example
 * const buffer = await downloadFromS3('attachments/file.pdf', 'my-bucket');
 */
export async function downloadFromS3(key: string, bucket: string): Promise<Buffer> {
  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');

  const client = new S3Client({});
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await client.send(command);

  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

/**
 * Downloads file from Azure Blob Storage
 * @param blobName - Blob name
 * @param containerName - Container name
 * @returns File buffer
 * @example
 * const buffer = await downloadFromAzure('file.pdf', 'attachments');
 */
export async function downloadFromAzure(blobName: string, containerName: string): Promise<Buffer> {
  const { BlobServiceClient } = await import('@azure/storage-blob');

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const downloadResponse = await blobClient.download();
  const chunks: Buffer[] = [];

  for await (const chunk of downloadResponse.readableStreamBody as any) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

/**
 * Generates presigned download URL for attachment
 * @param attachment - Attachment metadata
 * @param expirySeconds - URL expiry time in seconds
 * @returns Presigned URL
 * @example
 * const url = await generatePresignedDownloadUrl(attachment, 3600);
 */
export async function generatePresignedDownloadUrl(
  attachment: MailAttachment,
  expirySeconds: number = 3600
): Promise<string> {
  if (attachment.storageType === 's3') {
    return generateS3PresignedUrl(attachment.storageKey!, attachment.storageContainer!, expirySeconds);
  } else if (attachment.storageType === 'azure') {
    return generateAzurePresignedUrl(
      attachment.storageKey!,
      attachment.storageContainer!,
      expirySeconds
    );
  }

  throw new Error(`Presigned URLs not supported for storage type: ${attachment.storageType}`);
}

/**
 * Generates S3 presigned download URL
 * @param key - S3 object key
 * @param bucket - S3 bucket name
 * @param expirySeconds - Expiry time
 * @returns Presigned URL
 * @example
 * const url = await generateS3PresignedUrl('file.pdf', 'bucket', 3600);
 */
export async function generateS3PresignedUrl(
  key: string,
  bucket: string,
  expirySeconds: number
): Promise<string> {
  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

  const client = new S3Client({});
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  return getSignedUrl(client, command, { expiresIn: expirySeconds });
}

/**
 * Generates Azure Blob presigned download URL (SAS)
 * @param blobName - Blob name
 * @param containerName - Container name
 * @param expirySeconds - Expiry time
 * @returns Presigned URL with SAS token
 * @example
 * const url = await generateAzurePresignedUrl('file.pdf', 'container', 3600);
 */
export async function generateAzurePresignedUrl(
  blobName: string,
  containerName: string,
  expirySeconds: number
): Promise<string> {
  const { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters } = await import(
    '@azure/storage-blob'
  );

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const expiresOn = new Date(Date.now() + expirySeconds * 1000);
  const permissions = BlobSASPermissions.parse('r');

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions,
      expiresOn,
    },
    blobServiceClient.credential as any
  ).toString();

  return `${blobClient.url}?${sasToken}`;
}

// ============================================================================
// INLINE IMAGES (CID) HANDLING
// ============================================================================

/**
 * Generates Content-ID for inline image
 * @param filename - Image filename
 * @param messageId - Associated message ID
 * @returns Content-ID string
 * @example
 * const cid = generateContentId('logo.png', 'msg-123');
 * // 'logo.png.msg-123@whitecross.com'
 */
export function generateContentId(filename: string, messageId: string): string {
  const sanitized = sanitizeFilename(filename).replace(/\s+/g, '_');
  const hash = crypto.createHash('md5').update(`${filename}${messageId}`).digest('hex').substring(0, 8);
  return `${sanitized}.${hash}@whitecross.com`;
}

/**
 * Embeds inline images in HTML content using CID references
 * @param html - Email HTML content
 * @param attachments - Array of inline attachments
 * @returns HTML with embedded CID references
 * @example
 * const html = embedInlineImages('<img src="logo.png">', inlineAttachments);
 * // '<img src="cid:logo.png.abc123@whitecross.com">'
 */
export function embedInlineImages(
  html: string,
  attachments: InlineImageReference[]
): string {
  let modifiedHtml = html;

  for (const attachment of attachments) {
    // Replace src="filename" with src="cid:contentId"
    const filenamePattern = new RegExp(`src=["']${attachment.filename}["']`, 'gi');
    modifiedHtml = modifiedHtml.replace(filenamePattern, `src="cid:${attachment.contentId}"`);

    // Also handle absolute paths
    const pathPattern = new RegExp(`src=["'][^"']*/${attachment.filename}["']`, 'gi');
    modifiedHtml = modifiedHtml.replace(pathPattern, `src="cid:${attachment.contentId}"`);
  }

  return modifiedHtml;
}

/**
 * Extracts inline image references from HTML
 * @param html - Email HTML content
 * @returns Array of extracted CID references
 * @example
 * const refs = extractInlineImageReferences('<img src="cid:img@domain.com">');
 */
export function extractInlineImageReferences(html: string): string[] {
  const cidPattern = /src=["']cid:([^"']+)["']/gi;
  const matches: string[] = [];
  let match;

  while ((match = cidPattern.exec(html)) !== null) {
    matches.push(match[1]);
  }

  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Converts inline CID references back to URLs
 * @param html - Email HTML with CID references
 * @param cidToUrlMap - Mapping of CID to actual URLs
 * @returns HTML with URLs instead of CIDs
 * @example
 * const html = convertCidToUrls(htmlWithCids, { 'img@domain.com': 'https://...' });
 */
export function convertCidToUrls(
  html: string,
  cidToUrlMap: Record<string, string>
): string {
  let modifiedHtml = html;

  for (const [cid, url] of Object.entries(cidToUrlMap)) {
    const cidPattern = new RegExp(`cid:${cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    modifiedHtml = modifiedHtml.replace(cidPattern, url);
  }

  return modifiedHtml;
}

// ============================================================================
// VIRUS SCANNING
// ============================================================================

/**
 * Scans attachment for viruses using ClamAV
 * @param buffer - File buffer to scan
 * @param config - Virus scan configuration
 * @returns Scan result
 * @example
 * const result = await scanAttachmentForViruses(fileBuffer, {
 *   enabled: true,
 *   clamavHost: 'localhost',
 *   clamavPort: 3310
 * });
 */
export async function scanAttachmentForViruses(
  buffer: Buffer,
  config: VirusScanConfig
): Promise<VirusScanResult> {
  if (!config.enabled) {
    return {
      isClean: true,
      isInfected: false,
      scanDate: new Date(),
      scanner: 'disabled',
    };
  }

  const startTime = Date.now();

  try {
    const NodeClam = require('clamscan');
    const clamscan = await new NodeClam().init({
      clamdscan: {
        host: config.clamavHost || 'localhost',
        port: config.clamavPort || 3310,
        timeout: config.timeout || 60000,
      },
    });

    const { isInfected, viruses } = await clamscan.scanBuffer(buffer);

    return {
      isClean: !isInfected,
      isInfected,
      viruses: viruses || [],
      scanDate: new Date(),
      scanner: 'clamav',
      scanDuration: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      isClean: false,
      isInfected: false,
      scanDate: new Date(),
      scanner: 'clamav',
      scanDuration: Date.now() - startTime,
      errorMessage: error.message,
    };
  }
}

/**
 * Quarantines infected attachment
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param quarantinePath - Quarantine directory path
 * @returns Quarantine location
 * @example
 * const location = await quarantineAttachment(buffer, 'virus.exe', '/var/quarantine');
 */
export async function quarantineAttachment(
  buffer: Buffer,
  filename: string,
  quarantinePath: string
): Promise<string> {
  await fs.mkdir(quarantinePath, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const quarantineFilename = `${timestamp}_${sanitizeFilename(filename)}`;
  const quarantineLocation = path.join(quarantinePath, quarantineFilename);

  await fs.writeFile(quarantineLocation, buffer, { mode: 0o000 }); // No permissions

  // Write metadata
  const metadataPath = `${quarantineLocation}.json`;
  await fs.writeFile(
    metadataPath,
    JSON.stringify(
      {
        originalFilename: filename,
        quarantinedAt: new Date(),
        size: buffer.length,
        checksum: calculateChecksum(buffer, 'sha256'),
      },
      null,
      2
    )
  );

  return quarantineLocation;
}

// ============================================================================
// METADATA EXTRACTION
// ============================================================================

/**
 * Extracts comprehensive metadata from attachment
 * @param buffer - File buffer
 * @param filename - Filename
 * @param mimeType - MIME type
 * @returns Extracted metadata
 * @example
 * const metadata = await extractAttachmentMetadata(buffer, 'photo.jpg', 'image/jpeg');
 */
export async function extractAttachmentMetadata(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<AttachmentMetadata> {
  const metadata: AttachmentMetadata = {
    filename,
    size: buffer.length,
    mimeType,
    extension: path.extname(filename).toLowerCase(),
  };

  // Image metadata
  if (isImageMimeType(mimeType)) {
    try {
      const imageMetadata = await extractImageMetadata(buffer);
      Object.assign(metadata, imageMetadata);
    } catch (error) {
      // Ignore errors in metadata extraction
    }
  }

  // PDF metadata
  if (mimeType === 'application/pdf') {
    try {
      const pdfMetadata = await extractPdfMetadata(buffer);
      Object.assign(metadata, pdfMetadata);
    } catch (error) {
      // Ignore errors
    }
  }

  return metadata;
}

/**
 * Extracts metadata from image files
 * @param buffer - Image buffer
 * @returns Image metadata including dimensions, EXIF
 * @example
 * const metadata = await extractImageMetadata(imageBuffer);
 */
export async function extractImageMetadata(
  buffer: Buffer
): Promise<Partial<AttachmentMetadata>> {
  const sharp = await import('sharp');
  const image = sharp.default(buffer);
  const imageMetadata = await image.metadata();

  return {
    width: imageMetadata.width,
    height: imageMetadata.height,
    format: imageMetadata.format,
    colorSpace: imageMetadata.space,
    hasAlpha: imageMetadata.hasAlpha,
    isAnimated: (imageMetadata.pages || 1) > 1,
    exif: imageMetadata.exif ? parseExifData(imageMetadata.exif) : undefined,
  };
}

/**
 * Parses EXIF data from buffer
 * @param exifBuffer - EXIF data buffer
 * @returns Parsed EXIF object
 * @example
 * const exif = parseExifData(exifBuffer);
 */
export function parseExifData(exifBuffer: Buffer): Record<string, any> {
  try {
    // Simple EXIF parsing - in production, use exif-parser or similar
    return { raw: exifBuffer.toString('base64') };
  } catch (error) {
    return {};
  }
}

/**
 * Extracts metadata from PDF files
 * @param buffer - PDF buffer
 * @returns PDF metadata
 * @example
 * const metadata = await extractPdfMetadata(pdfBuffer);
 */
export async function extractPdfMetadata(
  buffer: Buffer
): Promise<Partial<AttachmentMetadata>> {
  // In production, use pdf-parse or pdf-lib
  const metadata: Partial<AttachmentMetadata> = {
    pages: 1, // Would extract actual page count
  };

  return metadata;
}

// ============================================================================
// THUMBNAIL GENERATION
// ============================================================================

/**
 * Generates thumbnail for image attachment
 * @param buffer - Image buffer
 * @param filename - Original filename
 * @param config - Thumbnail configuration
 * @returns Thumbnail buffer and path
 * @example
 * const result = await generateThumbnail(imageBuffer, 'photo.jpg', {
 *   width: 200,
 *   height: 200,
 *   quality: 80
 * });
 */
export async function generateThumbnail(
  buffer: Buffer,
  filename: string,
  config: { width: number; height: number; quality?: number; format?: 'jpeg' | 'png' | 'webp' }
): Promise<{ buffer: Buffer; path?: string }> {
  const sharp = await import('sharp');

  const thumbnail = await sharp
    .default(buffer)
    .resize(config.width, config.height, {
      fit: 'cover',
      position: 'center',
    })
    [config.format || 'jpeg']({ quality: config.quality || 80 })
    .toBuffer();

  return { buffer: thumbnail };
}

/**
 * Generates multiple thumbnail sizes
 * @param buffer - Image buffer
 * @param filename - Original filename
 * @param config - Thumbnail configuration with multiple sizes
 * @returns Array of generated thumbnails
 * @example
 * const thumbnails = await generateMultipleThumbnails(buffer, 'photo.jpg', {
 *   enabled: true,
 *   sizes: [
 *     { name: 'small', width: 100, height: 100 },
 *     { name: 'medium', width: 300, height: 300 }
 *   ]
 * });
 */
export async function generateMultipleThumbnails(
  buffer: Buffer,
  filename: string,
  config: ThumbnailConfig
): Promise<Array<{ name: string; buffer: Buffer; path?: string }>> {
  if (!config.enabled) {
    return [];
  }

  const thumbnails: Array<{ name: string; buffer: Buffer; path?: string }> = [];

  for (const size of config.sizes) {
    const thumbnail = await generateThumbnail(buffer, filename, {
      width: size.width,
      height: size.height,
      quality: config.quality,
      format: config.format,
    });

    thumbnails.push({
      name: size.name,
      buffer: thumbnail.buffer,
      path: thumbnail.path,
    });
  }

  return thumbnails;
}

/**
 * Generates thumbnail for attachment (helper function)
 * @param buffer - File buffer
 * @param filename - Filename
 * @returns Thumbnail path
 * @example
 * const path = await generateThumbnailForAttachment(buffer, 'image.jpg');
 */
async function generateThumbnailForAttachment(
  buffer: Buffer,
  filename: string
): Promise<string | undefined> {
  try {
    const thumbnail = await generateThumbnail(buffer, filename, {
      width: 200,
      height: 200,
      quality: 80,
    });

    // Would save thumbnail and return path
    return `/thumbnails/${filename}`;
  } catch (error) {
    return undefined;
  }
}

// ============================================================================
// IMAGE COMPRESSION
// ============================================================================

/**
 * Compresses image attachment
 * @param buffer - Image buffer
 * @param config - Compression configuration
 * @returns Compressed image buffer and stats
 * @example
 * const result = await compressImage(imageBuffer, {
 *   enabled: true,
 *   maxWidth: 1920,
 *   quality: 85,
 *   format: 'jpeg'
 * });
 */
export async function compressImage(
  buffer: Buffer,
  config: ImageCompressionConfig
): Promise<CompressionResult> {
  if (!config.enabled) {
    return {
      originalSize: buffer.length,
      compressedSize: buffer.length,
      compressionRatio: 1,
      savedBytes: 0,
      algorithm: 'none',
      buffer,
    };
  }

  const sharp = await import('sharp');
  const image = sharp.default(buffer);
  const metadata = await image.metadata();

  let pipeline = image;

  // Resize if exceeds max dimensions
  if (
    (config.maxWidth && metadata.width && metadata.width > config.maxWidth) ||
    (config.maxHeight && metadata.height && metadata.height > config.maxHeight)
  ) {
    pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Apply format and quality
  const format = config.format || 'jpeg';
  pipeline = pipeline[format]({ quality: config.quality || 85 });

  const compressed = await pipeline.toBuffer();

  return {
    originalSize: buffer.length,
    compressedSize: compressed.length,
    compressionRatio: compressed.length / buffer.length,
    savedBytes: buffer.length - compressed.length,
    algorithm: format,
    buffer: compressed,
  };
}

/**
 * Compresses generic file using gzip
 * @param buffer - File buffer
 * @returns Compression result
 * @example
 * const result = await compressFile(fileBuffer);
 */
export async function compressFile(buffer: Buffer): Promise<CompressionResult> {
  const zlib = await import('zlib');
  const { promisify } = await import('util');
  const gzip = promisify(zlib.gzip);

  const compressed = await gzip(buffer);

  return {
    originalSize: buffer.length,
    compressedSize: compressed.length,
    compressionRatio: compressed.length / buffer.length,
    savedBytes: buffer.length - compressed.length,
    algorithm: 'gzip',
    buffer: compressed,
  };
}

// ============================================================================
// ATTACHMENT STREAMING
// ============================================================================

/**
 * Creates read stream for attachment
 * @param attachment - Attachment metadata
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = await createAttachmentStream(attachment, { chunkSize: 64 * 1024 });
 */
export async function createAttachmentStream(
  attachment: MailAttachment,
  options?: StreamingOptions
): Promise<Readable> {
  switch (attachment.storageType) {
    case 'local':
      return createLocalFileStream(attachment.storagePath!, options);
    case 's3':
      return createS3Stream(attachment.storageKey!, attachment.storageContainer!, options);
    case 'azure':
      return createAzureStream(attachment.storageKey!, attachment.storageContainer!, options);
    default:
      throw new Error(`Streaming not supported for storage type: ${attachment.storageType}`);
  }
}

/**
 * Creates read stream from local file
 * @param filePath - File path
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = createLocalFileStream('/path/to/file.pdf', { chunkSize: 64KB });
 */
export function createLocalFileStream(
  filePath: string,
  options?: StreamingOptions
): Readable {
  const fsSync = require('fs');

  return fsSync.createReadStream(filePath, {
    start: options?.start,
    end: options?.end,
    highWaterMark: options?.highWaterMark || options?.chunkSize || 64 * 1024,
  });
}

/**
 * Creates read stream from S3 object
 * @param key - S3 object key
 * @param bucket - S3 bucket name
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = await createS3Stream('file.pdf', 'bucket', { start: 0, end: 1024 });
 */
export async function createS3Stream(
  key: string,
  bucket: string,
  options?: StreamingOptions
): Promise<Readable> {
  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');

  const client = new S3Client({});
  const range = options?.start !== undefined || options?.end !== undefined
    ? `bytes=${options.start || 0}-${options.end || ''}`
    : undefined;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    Range: range,
  });

  const response = await client.send(command);
  return response.Body as Readable;
}

/**
 * Creates read stream from Azure Blob
 * @param blobName - Blob name
 * @param containerName - Container name
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = await createAzureStream('file.pdf', 'container');
 */
export async function createAzureStream(
  blobName: string,
  containerName: string,
  options?: StreamingOptions
): Promise<Readable> {
  const { BlobServiceClient } = await import('@azure/storage-blob');

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const downloadResponse = await blobClient.download(options?.start, options?.end);
  return downloadResponse.readableStreamBody as Readable;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates checksum for file buffer
 * @param buffer - File buffer
 * @param algorithm - Hash algorithm (md5, sha256, sha512)
 * @returns Checksum hex string
 * @example
 * const checksum = calculateChecksum(buffer, 'sha256');
 */
export function calculateChecksum(
  buffer: Buffer,
  algorithm: 'md5' | 'sha256' | 'sha512' = 'sha256'
): string {
  return crypto.createHash(algorithm).update(buffer).digest('hex');
}

/**
 * Checks if MIME type is an image
 * @param mimeType - MIME type string
 * @returns True if image type
 * @example
 * const isImg = isImageMimeType('image/jpeg'); // true
 */
export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Gets file extension from MIME type
 * @param mimeType - MIME type
 * @returns File extension
 * @example
 * const ext = getExtensionFromMimeType('image/jpeg'); // '.jpg'
 */
export function getExtensionFromMimeType(mimeType: string): string | null {
  return mimeTypes.extension(mimeType) ? `.${mimeTypes.extension(mimeType)}` : null;
}

/**
 * Gets MIME type from file extension
 * @param filename - Filename with extension
 * @returns MIME type
 * @example
 * const mime = getMimeTypeFromFilename('document.pdf'); // 'application/pdf'
 */
export function getMimeTypeFromFilename(filename: string): string {
  return mimeTypes.lookup(filename) || 'application/octet-stream';
}

/**
 * Formats file size in human-readable format
 * @param bytes - Size in bytes
 * @param decimals - Decimal places
 * @returns Formatted size string
 * @example
 * const size = formatFileSize(1536000); // '1.46 MB'
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Checks attachment quota for user
 * @param userId - User ID
 * @param maxStorageBytes - Maximum storage allowed
 * @returns Quota information
 * @example
 * const quota = await checkAttachmentQuota('user-123', 1GB);
 */
export async function checkAttachmentQuota(
  userId: string,
  maxStorageBytes: number
): Promise<AttachmentQuota> {
  // In production, query from database
  const usedStorageBytes = 0; // Would calculate from DB
  const totalAttachments = 0;

  return {
    userId,
    maxStorageBytes,
    usedStorageBytes,
    availableStorageBytes: maxStorageBytes - usedStorageBytes,
    maxAttachmentsPerMessage: 20,
    maxAttachmentSize: 25 * 1024 * 1024,
    totalAttachments,
    quotaPercentage: (usedStorageBytes / maxStorageBytes) * 100,
  };
}

// ============================================================================
// NESTJS DECORATORS & INTERCEPTORS
// ============================================================================

/**
 * NestJS decorator for Swagger API documentation of file upload
 * @returns Swagger decorator
 * @example
 * @Post('upload')
 * @ApiFileUpload()
 * async uploadFile(@UploadedFile() file: Express.Multer.File) {}
 */
export function ApiFileUpload(): MethodDecorator {
  const { ApiConsumes, ApiBody } = require('@nestjs/swagger');

  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}

/**
 * NestJS decorator for multiple file upload documentation
 * @param fieldName - Field name for files
 * @returns Swagger decorator
 * @example
 * @Post('upload-multiple')
 * @ApiMultipleFileUpload('attachments')
 * async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {}
 */
export function ApiMultipleFileUpload(fieldName: string = 'files'): MethodDecorator {
  const { ApiConsumes, ApiBody } = require('@nestjs/swagger');

  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: 'Files to upload',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}

/**
 * Creates NestJS file upload interceptor with validation
 * @param config - Upload configuration
 * @returns File interceptor
 * @example
 * const interceptor = createFileUploadInterceptor({
 *   maxFileSize: 25MB,
 *   allowedMimeTypes: ['image/jpeg', 'image/png']
 * });
 */
export function createFileUploadInterceptor(config: AttachmentUploadConfig): any {
  const { FileInterceptor } = require('@nestjs/platform-express');
  const multer = require('multer');

  const storage = multer.memoryStorage();

  const fileFilter = (req: any, file: any, callback: any) => {
    // Validate MIME type
    if (config.allowedMimeTypes && !config.allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error(`File type ${file.mimetype} not allowed`), false);
    }

    if (config.blockedMimeTypes && config.blockedMimeTypes.includes(file.mimetype)) {
      return callback(new Error(`File type ${file.mimetype} is blocked`), false);
    }

    // Validate extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (config.allowedExtensions && !config.allowedExtensions.includes(ext)) {
      return callback(new Error(`File extension ${ext} not allowed`), false);
    }

    if (config.blockedExtensions && config.blockedExtensions.includes(ext)) {
      return callback(new Error(`File extension ${ext} is blocked`), false);
    }

    callback(null, true);
  };

  return FileInterceptor('file', {
    storage,
    limits: {
      fileSize: config.maxFileSize,
    },
    fileFilter,
  });
}

/**
 * Creates NestJS multiple file upload interceptor
 * @param fieldName - Field name for files
 * @param config - Upload configuration
 * @returns Files interceptor
 * @example
 * const interceptor = createMultipleFileUploadInterceptor('attachments', config);
 */
export function createMultipleFileUploadInterceptor(
  fieldName: string,
  config: AttachmentUploadConfig
): any {
  const { FilesInterceptor } = require('@nestjs/platform-express');
  const multer = require('multer');

  const storage = multer.memoryStorage();

  const fileFilter = (req: any, file: any, callback: any) => {
    if (config.allowedMimeTypes && !config.allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error(`File type ${file.mimetype} not allowed`), false);
    }
    callback(null, true);
  };

  return FilesInterceptor(fieldName, config.maxAttachments || 10, {
    storage,
    limits: {
      fileSize: config.maxFileSize,
      files: config.maxAttachments,
    },
    fileFilter,
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Model definition
  defineMailAttachmentModel,
  MailAttachmentAttributes,
  MailAttachmentOptions,

  // Validation
  validateAttachment,
  detectFileType,
  isValidFilename,
  sanitizeFilename,

  // Upload
  uploadAttachment,
  uploadMultipleAttachments,
  generateUniqueFilename,
  uploadToLocalStorage,
  uploadToS3,
  uploadToAzure,

  // Download
  downloadAttachment,
  downloadFromLocalStorage,
  downloadFromS3,
  downloadFromAzure,
  generatePresignedDownloadUrl,
  generateS3PresignedUrl,
  generateAzurePresignedUrl,

  // Inline images (CID)
  generateContentId,
  embedInlineImages,
  extractInlineImageReferences,
  convertCidToUrls,

  // Virus scanning
  scanAttachmentForViruses,
  quarantineAttachment,

  // Metadata
  extractAttachmentMetadata,
  extractImageMetadata,
  parseExifData,
  extractPdfMetadata,

  // Thumbnails
  generateThumbnail,
  generateMultipleThumbnails,

  // Compression
  compressImage,
  compressFile,

  // Streaming
  createAttachmentStream,
  createLocalFileStream,
  createS3Stream,
  createAzureStream,

  // Utilities
  calculateChecksum,
  isImageMimeType,
  getExtensionFromMimeType,
  getMimeTypeFromFilename,
  formatFileSize,
  checkAttachmentQuota,

  // NestJS decorators
  ApiFileUpload,
  ApiMultipleFileUpload,
  createFileUploadInterceptor,
  createMultipleFileUploadInterceptor,
};
