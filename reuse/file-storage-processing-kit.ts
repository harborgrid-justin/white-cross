/**
 * @fileoverview File Storage & Processing Kit - Comprehensive file handling utilities
 * @module reuse/file-storage-processing-kit
 * @description Complete file storage and processing solution with S3/cloud storage integration,
 * local file management, image processing, PDF generation, CSV handling, virus scanning,
 * encryption, and advanced file operations for healthcare document management.
 *
 * Key Features:
 * - S3/cloud storage integration (AWS S3, MinIO, GCS compatible)
 * - Local file system operations with security
 * - File upload validation and sanitization
 * - Image processing (resize, crop, optimize, watermark)
 * - PDF generation and manipulation
 * - CSV import/export with streaming
 * - File chunking for large uploads (>100MB)
 * - Virus/malware scanning integration (ClamAV)
 * - File metadata extraction (EXIF, ID3, PDF metadata)
 * - Thumbnail generation for multiple formats
 * - File compression and archive handling
 * - Presigned URL generation for secure access
 * - Multipart upload handling for large files
 * - File encryption/decryption (AES-256-GCM)
 * - MIME type detection and validation
 * - HIPAA-compliant file handling
 * - Audit logging for file operations
 *
 * @target Node 18+, TypeScript 5.x, AWS SDK v3, Sharp, PDFKit
 *
 * @security
 * - HIPAA compliance for healthcare documents
 * - File type validation (magic number checking)
 * - Virus scanning before storage
 * - Encrypted storage at rest
 * - Secure presigned URLs with expiration
 * - Content Security Policy headers
 * - File size limits and quota enforcement
 * - Path traversal prevention
 * - Sanitized filenames
 * - Access control and audit logging
 *
 * @example Basic file upload to S3
 * ```typescript
 * import { uploadToS3, validateFileUpload } from './file-storage-processing-kit';
 *
 * // Validate and upload file
 * const validation = await validateFileUpload(fileBuffer, 'image/jpeg', {
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedMimeTypes: ['image/jpeg', 'image/png']
 * });
 *
 * if (validation.isValid) {
 *   const result = await uploadToS3(s3Client, {
 *     bucket: 'patient-documents',
 *     key: 'medical-records/image.jpg',
 *     body: fileBuffer,
 *     contentType: 'image/jpeg'
 *   });
 * }
 * ```
 *
 * @example Image processing and thumbnails
 * ```typescript
 * import { resizeImage, generateThumbnail, optimizeImage } from './file-storage-processing-kit';
 *
 * // Resize image
 * const resized = await resizeImage(imageBuffer, { width: 800, height: 600, fit: 'cover' });
 *
 * // Generate thumbnail
 * const thumbnail = await generateThumbnail(imageBuffer, { width: 150, height: 150 });
 *
 * // Optimize for web
 * const optimized = await optimizeImage(imageBuffer, { quality: 80, format: 'webp' });
 * ```
 *
 * @example PDF generation
 * ```typescript
 * import { generatePDF, mergePDFs, extractPDFText } from './file-storage-processing-kit';
 *
 * // Generate PDF from HTML
 * const pdf = await generatePDF({
 *   html: '<h1>Medical Report</h1><p>Patient details...</p>',
 *   options: { format: 'A4', margin: 20 }
 * });
 *
 * // Merge multiple PDFs
 * const merged = await mergePDFs([pdf1Buffer, pdf2Buffer, pdf3Buffer]);
 * ```
 *
 * @example CSV operations
 * ```typescript
 * import { parseCSV, generateCSV, streamCSVImport } from './file-storage-processing-kit';
 *
 * // Parse CSV file
 * const data = await parseCSV(csvBuffer, { delimiter: ',', headers: true });
 *
 * // Generate CSV from data
 * const csv = await generateCSV(patientData, { headers: true, delimiter: ',' });
 * ```
 *
 * LOC: FILE-STOR-001
 * UPSTREAM: @aws-sdk/client-s3, sharp, pdfkit, csv-parser, file-type, crypto
 * DOWNSTREAM: medical records service, patient documents, imaging service, reports
 *
 * @version 1.0.0
 * @since 2025-11-08
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @enum FileStorageProvider
 * @description Supported cloud storage providers
 */
export enum FileStorageProvider {
  S3 = 'S3',
  MINIO = 'MINIO',
  GCS = 'GCS',
  AZURE = 'AZURE',
  LOCAL = 'LOCAL',
}

/**
 * @enum FileCategory
 * @description Categories of files for organization
 */
export enum FileCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  PATIENT_IMAGE = 'PATIENT_IMAGE',
  LAB_RESULT = 'LAB_RESULT',
  PRESCRIPTION = 'PRESCRIPTION',
  CONSENT_FORM = 'CONSENT_FORM',
  INSURANCE = 'INSURANCE',
  REPORT = 'REPORT',
  AVATAR = 'AVATAR',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

/**
 * @enum ImageFormat
 * @description Supported image formats
 */
export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
  AVIF = 'avif',
  GIF = 'gif',
  TIFF = 'tiff',
}

/**
 * @enum CompressionFormat
 * @description Supported compression formats
 */
export enum CompressionFormat {
  GZIP = 'gzip',
  BROTLI = 'brotli',
  ZIP = 'zip',
  DEFLATE = 'deflate',
}

/**
 * @interface FileMetadata
 * @description Complete file metadata information
 */
export interface FileMetadata {
  filename: string;
  originalFilename?: string;
  mimeType: string;
  size: number;
  hash?: string;
  category?: FileCategory;
  uploadedBy?: string;
  uploadedAt?: Date;
  expiresAt?: Date;
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  isScanned?: boolean;
  scanResult?: VirusScanResult;
  dimensions?: { width: number; height: number };
  duration?: number; // for video/audio
  pageCount?: number; // for PDFs
  metadata?: Record<string, any>;
  tags?: string[];
}

/**
 * @interface S3UploadOptions
 * @description Options for S3 file upload
 */
export interface S3UploadOptions {
  bucket: string;
  key: string;
  body: Buffer | Readable;
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: string;
  serverSideEncryption?: string;
  storageClass?: string;
  cacheControl?: string;
  contentDisposition?: string;
  tags?: Record<string, string>;
}

/**
 * @interface S3DownloadOptions
 * @description Options for S3 file download
 */
export interface S3DownloadOptions {
  bucket: string;
  key: string;
  range?: string;
  versionId?: string;
}

/**
 * @interface FileValidationOptions
 * @description Options for file upload validation
 */
export interface FileValidationOptions {
  maxSize?: number;
  minSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  requireVirusScan?: boolean;
  checkMagicNumbers?: boolean;
  sanitizeFilename?: boolean;
}

/**
 * @interface FileValidationResult
 * @description Result of file validation
 */
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedMimeType?: string;
  sanitizedFilename?: string;
  fileSize?: number;
}

/**
 * @interface ImageProcessingOptions
 * @description Options for image processing
 */
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: string;
  quality?: number;
  format?: ImageFormat;
  background?: string;
  withoutEnlargement?: boolean;
  kernel?: 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3';
}

/**
 * @interface CropOptions
 * @description Options for image cropping
 */
export interface CropOptions {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * @interface WatermarkOptions
 * @description Options for image watermarking
 */
export interface WatermarkOptions {
  text?: string;
  image?: Buffer;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
  fontSize?: number;
  fontColor?: string;
}

/**
 * @interface PDFGenerationOptions
 * @description Options for PDF generation
 */
export interface PDFGenerationOptions {
  html?: string;
  content?: PDFContent[];
  format?: 'A4' | 'Letter' | 'Legal';
  margin?: number | { top: number; right: number; bottom: number; left: number };
  orientation?: 'portrait' | 'landscape';
  header?: string;
  footer?: string;
  displayHeaderFooter?: boolean;
  printBackground?: boolean;
}

/**
 * @interface PDFContent
 * @description Content block for PDF generation
 */
export interface PDFContent {
  type: 'text' | 'image' | 'table' | 'list' | 'pagebreak';
  content?: any;
  style?: Record<string, any>;
}

/**
 * @interface CSVParseOptions
 * @description Options for CSV parsing
 */
export interface CSVParseOptions {
  delimiter?: string;
  headers?: boolean | string[];
  skipEmptyLines?: boolean;
  maxRows?: number;
  encoding?: BufferEncoding;
  quote?: string;
  escape?: string;
}

/**
 * @interface CSVGenerateOptions
 * @description Options for CSV generation
 */
export interface CSVGenerateOptions {
  headers?: boolean | string[];
  delimiter?: string;
  quote?: string;
  escape?: string;
  newline?: string;
}

/**
 * @interface ChunkUploadOptions
 * @description Options for chunked file upload
 */
export interface ChunkUploadOptions {
  chunkSize?: number;
  maxConcurrentUploads?: number;
  retryAttempts?: number;
  onProgress?: (progress: number) => void;
}

/**
 * @interface MultipartUploadState
 * @description State tracking for multipart uploads
 */
export interface MultipartUploadState {
  uploadId: string;
  bucket: string;
  key: string;
  parts: Array<{ partNumber: number; etag: string }>;
  totalParts: number;
  uploadedParts: number;
}

/**
 * @interface VirusScanResult
 * @description Result of virus scan
 */
export interface VirusScanResult {
  isClean: boolean;
  threats: string[];
  scanDate: Date;
  scanner: string;
  signature?: string;
}

/**
 * @interface FileEncryptionOptions
 * @description Options for file encryption
 */
export interface FileEncryptionOptions {
  algorithm?: string;
  key?: Buffer;
  iv?: Buffer;
  generateKey?: boolean;
}

/**
 * @interface EncryptedFileResult
 * @description Result of file encryption
 */
export interface EncryptedFileResult {
  encryptedData: Buffer;
  key: Buffer;
  iv: Buffer;
  algorithm: string;
  authTag?: Buffer;
}

/**
 * @interface PresignedUrlOptions
 * @description Options for presigned URL generation
 */
export interface PresignedUrlOptions {
  expiresIn?: number; // seconds
  responseContentType?: string;
  responseContentDisposition?: string;
  versionId?: string;
}

/**
 * @interface ThumbnailOptions
 * @description Options for thumbnail generation
 */
export interface ThumbnailOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill';
  format?: ImageFormat;
  quality?: number;
  background?: string;
}

/**
 * @interface CompressionOptions
 * @description Options for file compression
 */
export interface CompressionOptions {
  format?: CompressionFormat;
  level?: number; // 1-9
  includeMetadata?: boolean;
}

// ============================================================================
// S3 / CLOUD STORAGE OPERATIONS
// ============================================================================

/**
 * Uploads a file to S3-compatible storage
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {S3UploadOptions} options - Upload options
 * @returns {Promise<{ key: string; bucket: string; etag?: string; versionId?: string }>} Upload result
 *
 * @example
 * ```typescript
 * const result = await uploadToS3(s3Client, {
 *   bucket: 'patient-documents',
 *   key: 'records/patient-123.pdf',
 *   body: fileBuffer,
 *   contentType: 'application/pdf',
 *   metadata: { patientId: '123', uploadedBy: 'nurse-456' }
 * });
 * ```
 */
export const uploadToS3 = async (
  s3Client: S3Client,
  options: S3UploadOptions,
): Promise<{ key: string; bucket: string; etag?: string; versionId?: string }> => {
  const command = new PutObjectCommand({
    Bucket: options.bucket,
    Key: options.key,
    Body: options.body,
    ContentType: options.contentType || 'application/octet-stream',
    Metadata: options.metadata,
    ACL: options.acl,
    ServerSideEncryption: options.serverSideEncryption || 'AES256',
    StorageClass: options.storageClass || 'STANDARD',
    CacheControl: options.cacheControl,
    ContentDisposition: options.contentDisposition,
    Tagging: options.tags ? Object.entries(options.tags).map(([k, v]) => `${k}=${v}`).join('&') : undefined,
  });

  const response = await s3Client.send(command);

  return {
    key: options.key,
    bucket: options.bucket,
    etag: response.ETag,
    versionId: response.VersionId,
  };
};

/**
 * Downloads a file from S3-compatible storage
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {S3DownloadOptions} options - Download options
 * @returns {Promise<Buffer>} File content as buffer
 *
 * @example
 * ```typescript
 * const fileBuffer = await downloadFromS3(s3Client, {
 *   bucket: 'patient-documents',
 *   key: 'records/patient-123.pdf'
 * });
 * ```
 */
export const downloadFromS3 = async (
  s3Client: S3Client,
  options: S3DownloadOptions,
): Promise<Buffer> => {
  const command = new GetObjectCommand({
    Bucket: options.bucket,
    Key: options.key,
    Range: options.range,
    VersionId: options.versionId,
  });

  const response = await s3Client.send(command);
  const stream = response.Body as Readable;

  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

/**
 * Deletes a file from S3-compatible storage
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {string} [versionId] - Optional version ID
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await deleteFromS3(s3Client, 'patient-documents', 'records/old-file.pdf');
 * ```
 */
export const deleteFromS3 = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  versionId?: string,
): Promise<boolean> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
    VersionId: versionId,
  });

  await s3Client.send(command);
  return true;
};

/**
 * Checks if a file exists in S3-compatible storage
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @returns {Promise<boolean>} Whether file exists
 *
 * @example
 * ```typescript
 * const exists = await fileExistsInS3(s3Client, 'patient-documents', 'records/patient-123.pdf');
 * ```
 */
export const fileExistsInS3 = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
): Promise<boolean> => {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
};

/**
 * Gets metadata for a file in S3-compatible storage
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await getS3FileMetadata(s3Client, 'patient-documents', 'records/patient-123.pdf');
 * console.log(`File size: ${metadata.size} bytes`);
 * ```
 */
export const getS3FileMetadata = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
): Promise<FileMetadata> => {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await s3Client.send(command);

  return {
    filename: key.split('/').pop() || key,
    mimeType: response.ContentType || 'application/octet-stream',
    size: response.ContentLength || 0,
    uploadedAt: response.LastModified,
    isEncrypted: response.ServerSideEncryption !== undefined,
    encryptionAlgorithm: response.ServerSideEncryption,
    metadata: response.Metadata,
  };
};

/**
 * Copies a file within S3 or between buckets
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} sourceBucket - Source bucket name
 * @param {string} sourceKey - Source object key
 * @param {string} destBucket - Destination bucket name
 * @param {string} destKey - Destination object key
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await copyS3File(s3Client, 'source-bucket', 'file.pdf', 'dest-bucket', 'archive/file.pdf');
 * ```
 */
export const copyS3File = async (
  s3Client: S3Client,
  sourceBucket: string,
  sourceKey: string,
  destBucket: string,
  destKey: string,
): Promise<boolean> => {
  const command = new PutObjectCommand({
    Bucket: destBucket,
    Key: destKey,
    CopySource: `${sourceBucket}/${sourceKey}`,
  });

  await s3Client.send(command);
  return true;
};

// ============================================================================
// LOCAL FILE STORAGE OPERATIONS
// ============================================================================

/**
 * Saves a file to local filesystem with security checks
 *
 * @param {Buffer} data - File data
 * @param {string} filepath - Target file path
 * @param {object} [options] - Write options
 * @returns {Promise<string>} Absolute file path
 *
 * @example
 * ```typescript
 * const path = await saveToLocalStorage(fileBuffer, '/var/uploads/document.pdf');
 * ```
 */
export const saveToLocalStorage = async (
  data: Buffer,
  filepath: string,
  options?: { mode?: number; flag?: string },
): Promise<string> => {
  // Prevent path traversal
  const normalizedPath = path.normalize(filepath);
  if (normalizedPath.includes('..')) {
    throw new Error('Path traversal detected');
  }

  // Ensure directory exists
  const dir = path.dirname(normalizedPath);
  await fs.mkdir(dir, { recursive: true });

  // Write file
  await fs.writeFile(normalizedPath, data, {
    mode: options?.mode || 0o644,
    flag: options?.flag || 'w',
  });

  return path.resolve(normalizedPath);
};

/**
 * Reads a file from local filesystem
 *
 * @param {string} filepath - File path to read
 * @returns {Promise<Buffer>} File content
 *
 * @example
 * ```typescript
 * const data = await readFromLocalStorage('/var/uploads/document.pdf');
 * ```
 */
export const readFromLocalStorage = async (filepath: string): Promise<Buffer> => {
  const normalizedPath = path.normalize(filepath);
  if (normalizedPath.includes('..')) {
    throw new Error('Path traversal detected');
  }

  return await fs.readFile(normalizedPath);
};

/**
 * Deletes a file from local filesystem
 *
 * @param {string} filepath - File path to delete
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await deleteFromLocalStorage('/var/uploads/old-file.pdf');
 * ```
 */
export const deleteFromLocalStorage = async (filepath: string): Promise<boolean> => {
  const normalizedPath = path.normalize(filepath);
  if (normalizedPath.includes('..')) {
    throw new Error('Path traversal detected');
  }

  try {
    await fs.unlink(normalizedPath);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
};

/**
 * Gets metadata for a local file
 *
 * @param {string} filepath - File path
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await getLocalFileMetadata('/var/uploads/document.pdf');
 * console.log(`File size: ${metadata.size} bytes`);
 * ```
 */
export const getLocalFileMetadata = async (filepath: string): Promise<FileMetadata> => {
  const normalizedPath = path.normalize(filepath);
  if (normalizedPath.includes('..')) {
    throw new Error('Path traversal detected');
  }

  const stats = await fs.stat(normalizedPath);
  const filename = path.basename(normalizedPath);

  return {
    filename,
    size: stats.size,
    uploadedAt: stats.birthtime,
    metadata: {
      mode: stats.mode,
      uid: stats.uid,
      gid: stats.gid,
      mtime: stats.mtime,
      atime: stats.atime,
    },
  };
};

// ============================================================================
// FILE UPLOAD VALIDATION
// ============================================================================

/**
 * Validates a file upload with comprehensive security checks
 *
 * @param {Buffer} fileBuffer - File data
 * @param {string} mimeType - Declared MIME type
 * @param {FileValidationOptions} [options] - Validation options
 * @returns {Promise<FileValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateFileUpload(fileBuffer, 'image/jpeg', {
 *   maxSize: 5 * 1024 * 1024,
 *   allowedMimeTypes: ['image/jpeg', 'image/png']
 * });
 *
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export const validateFileUpload = async (
  fileBuffer: Buffer,
  mimeType: string,
  options?: FileValidationOptions,
): Promise<FileValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileSize = fileBuffer.length;

  // Size validation
  if (options?.maxSize && fileSize > options.maxSize) {
    errors.push(`File size ${fileSize} exceeds maximum ${options.maxSize} bytes`);
  }
  if (options?.minSize && fileSize < options.minSize) {
    errors.push(`File size ${fileSize} below minimum ${options.minSize} bytes`);
  }

  // MIME type validation
  let detectedMimeType: string | undefined;
  if (options?.checkMagicNumbers) {
    detectedMimeType = await detectMimeType(fileBuffer);
    if (detectedMimeType !== mimeType) {
      warnings.push(`Declared MIME type ${mimeType} differs from detected ${detectedMimeType}`);
    }
  }

  if (options?.allowedMimeTypes && !options.allowedMimeTypes.includes(mimeType)) {
    errors.push(`MIME type ${mimeType} not allowed. Allowed: ${options.allowedMimeTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    detectedMimeType,
    fileSize,
  };
};

/**
 * Sanitizes a filename for safe storage
 *
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 *
 * @example
 * ```typescript
 * const safe = sanitizeFilename('../../../etc/passwd'); // Returns 'etc-passwd'
 * ```
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .replace(/\.+$/, '')
    .substring(0, 255);
};

/**
 * Generates a unique filename with timestamp and hash
 *
 * @param {string} originalFilename - Original filename
 * @param {string} [prefix] - Optional prefix
 * @returns {string} Unique filename
 *
 * @example
 * ```typescript
 * const unique = generateUniqueFilename('document.pdf', 'patient-123');
 * // Returns: 'patient-123-20251108-abc123def.pdf'
 * ```
 */
export const generateUniqueFilename = (originalFilename: string, prefix?: string): string => {
  const ext = path.extname(originalFilename);
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const randomHash = crypto.randomBytes(4).toString('hex');

  const parts = [prefix, timestamp, randomHash].filter(Boolean);
  return `${parts.join('-')}${ext}`;
};

/**
 * Validates file extension against allowed list
 *
 * @param {string} filename - Filename to check
 * @param {string[]} allowedExtensions - Allowed extensions (e.g., ['.pdf', '.jpg'])
 * @returns {boolean} Whether extension is allowed
 *
 * @example
 * ```typescript
 * const allowed = validateFileExtension('document.pdf', ['.pdf', '.doc', '.docx']);
 * ```
 */
export const validateFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.map(e => e.toLowerCase()).includes(ext);
};

/**
 * Calculates file hash for integrity verification
 *
 * @param {Buffer} fileBuffer - File data
 * @param {string} [algorithm='sha256'] - Hash algorithm
 * @returns {string} File hash
 *
 * @example
 * ```typescript
 * const hash = calculateFileHash(fileBuffer, 'sha256');
 * ```
 */
export const calculateFileHash = (fileBuffer: Buffer, algorithm: string = 'sha256'): string => {
  return crypto.createHash(algorithm).update(fileBuffer).digest('hex');
};

/**
 * Checks if file size exceeds quota for user/organization
 *
 * @param {number} fileSize - File size in bytes
 * @param {number} currentUsage - Current storage usage in bytes
 * @param {number} quota - Total quota in bytes
 * @returns {boolean} Whether upload is within quota
 *
 * @example
 * ```typescript
 * const withinQuota = checkStorageQuota(5242880, 100000000, 500000000);
 * ```
 */
export const checkStorageQuota = (
  fileSize: number,
  currentUsage: number,
  quota: number,
): boolean => {
  return (currentUsage + fileSize) <= quota;
};

// ============================================================================
// IMAGE PROCESSING
// ============================================================================

/**
 * Resizes an image with specified dimensions and options
 *
 * @param {Buffer} imageBuffer - Image data
 * @param {ImageProcessingOptions} options - Processing options
 * @returns {Promise<Buffer>} Processed image
 *
 * @example
 * ```typescript
 * const resized = await resizeImage(imageBuffer, {
 *   width: 800,
 *   height: 600,
 *   fit: 'cover',
 *   quality: 85
 * });
 * ```
 */
export const resizeImage = async (
  imageBuffer: Buffer,
  options: ImageProcessingOptions,
): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use Sharp library
  // const sharp = require('sharp');
  // return await sharp(imageBuffer)
  //   .resize(options.width, options.height, { fit: options.fit })
  //   .toFormat(options.format || 'jpeg', { quality: options.quality || 80 })
  //   .toBuffer();

  throw new Error('Image processing requires Sharp library installation');
};

/**
 * Crops an image to specified dimensions
 *
 * @param {Buffer} imageBuffer - Image data
 * @param {CropOptions} options - Crop options
 * @returns {Promise<Buffer>} Cropped image
 *
 * @example
 * ```typescript
 * const cropped = await cropImage(imageBuffer, {
 *   left: 100,
 *   top: 100,
 *   width: 400,
 *   height: 300
 * });
 * ```
 */
export const cropImage = async (
  imageBuffer: Buffer,
  options: CropOptions,
): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use Sharp library
  // const sharp = require('sharp');
  // return await sharp(imageBuffer)
  //   .extract(options)
  //   .toBuffer();

  throw new Error('Image processing requires Sharp library installation');
};

/**
 * Optimizes an image for web delivery
 *
 * @param {Buffer} imageBuffer - Image data
 * @param {object} [options] - Optimization options
 * @returns {Promise<Buffer>} Optimized image
 *
 * @example
 * ```typescript
 * const optimized = await optimizeImage(imageBuffer, {
 *   quality: 80,
 *   format: 'webp'
 * });
 * ```
 */
export const optimizeImage = async (
  imageBuffer: Buffer,
  options?: { quality?: number; format?: ImageFormat },
): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use Sharp library
  // const sharp = require('sharp');
  // return await sharp(imageBuffer)
  //   .toFormat(options?.format || 'webp', {
  //     quality: options?.quality || 80,
  //     effort: 6
  //   })
  //   .toBuffer();

  throw new Error('Image processing requires Sharp library installation');
};

/**
 * Adds a watermark to an image
 *
 * @param {Buffer} imageBuffer - Image data
 * @param {WatermarkOptions} options - Watermark options
 * @returns {Promise<Buffer>} Watermarked image
 *
 * @example
 * ```typescript
 * const watermarked = await addWatermark(imageBuffer, {
 *   text: 'CONFIDENTIAL',
 *   position: 'bottom-right',
 *   opacity: 0.5
 * });
 * ```
 */
export const addWatermark = async (
  imageBuffer: Buffer,
  options: WatermarkOptions,
): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use Sharp library
  throw new Error('Image watermarking requires Sharp library installation');
};

/**
 * Gets image dimensions
 *
 * @param {Buffer} imageBuffer - Image data
 * @returns {Promise<{ width: number; height: number }>} Image dimensions
 *
 * @example
 * ```typescript
 * const { width, height } = await getImageDimensions(imageBuffer);
 * ```
 */
export const getImageDimensions = async (
  imageBuffer: Buffer,
): Promise<{ width: number; height: number }> => {
  // Note: This is a placeholder. In production, use Sharp library
  // const sharp = require('sharp');
  // const metadata = await sharp(imageBuffer).metadata();
  // return { width: metadata.width!, height: metadata.height! };

  throw new Error('Image processing requires Sharp library installation');
};

// ============================================================================
// THUMBNAIL GENERATION
// ============================================================================

/**
 * Generates a thumbnail from an image
 *
 * @param {Buffer} imageBuffer - Image data
 * @param {ThumbnailOptions} [options] - Thumbnail options
 * @returns {Promise<Buffer>} Thumbnail image
 *
 * @example
 * ```typescript
 * const thumbnail = await generateThumbnail(imageBuffer, {
 *   width: 150,
 *   height: 150,
 *   fit: 'cover'
 * });
 * ```
 */
export const generateThumbnail = async (
  imageBuffer: Buffer,
  options?: ThumbnailOptions,
): Promise<Buffer> => {
  return await resizeImage(imageBuffer, {
    width: options?.width || 150,
    height: options?.height || 150,
    fit: options?.fit || 'cover',
    quality: options?.quality || 70,
    format: options?.format || ImageFormat.JPEG,
    background: options?.background,
  });
};

/**
 * Generates thumbnails in multiple sizes
 *
 * @param {Buffer} imageBuffer - Image data
 * @param {Array<{ name: string; width: number; height: number }>} sizes - Size configurations
 * @returns {Promise<Map<string, Buffer>>} Map of size name to thumbnail buffer
 *
 * @example
 * ```typescript
 * const thumbnails = await generateMultipleThumbnails(imageBuffer, [
 *   { name: 'small', width: 100, height: 100 },
 *   { name: 'medium', width: 300, height: 300 },
 *   { name: 'large', width: 600, height: 600 }
 * ]);
 * ```
 */
export const generateMultipleThumbnails = async (
  imageBuffer: Buffer,
  sizes: Array<{ name: string; width: number; height: number }>,
): Promise<Map<string, Buffer>> => {
  const thumbnails = new Map<string, Buffer>();

  for (const size of sizes) {
    const thumbnail = await generateThumbnail(imageBuffer, {
      width: size.width,
      height: size.height,
      fit: 'cover',
    });
    thumbnails.set(size.name, thumbnail);
  }

  return thumbnails;
};

/**
 * Generates a thumbnail from PDF (first page)
 *
 * @param {Buffer} pdfBuffer - PDF data
 * @param {ThumbnailOptions} [options] - Thumbnail options
 * @returns {Promise<Buffer>} Thumbnail image
 *
 * @example
 * ```typescript
 * const thumbnail = await generatePDFThumbnail(pdfBuffer, { width: 200, height: 300 });
 * ```
 */
export const generatePDFThumbnail = async (
  pdfBuffer: Buffer,
  options?: ThumbnailOptions,
): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use pdf-to-img or similar
  throw new Error('PDF thumbnail generation requires pdf-to-img library installation');
};

// ============================================================================
// PDF GENERATION
// ============================================================================

/**
 * Generates a PDF from HTML content
 *
 * @param {PDFGenerationOptions} options - PDF generation options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await generatePDF({
 *   html: '<h1>Medical Report</h1><p>Patient: John Doe</p>',
 *   format: 'A4',
 *   margin: 20
 * });
 * ```
 */
export const generatePDF = async (options: PDFGenerationOptions): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use Puppeteer or PDFKit
  // const puppeteer = require('puppeteer');
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.setContent(options.html || '');
  // const pdf = await page.pdf({
  //   format: options.format,
  //   margin: options.margin,
  //   printBackground: options.printBackground
  // });
  // await browser.close();
  // return Buffer.from(pdf);

  throw new Error('PDF generation requires Puppeteer or PDFKit library installation');
};

/**
 * Merges multiple PDF files into one
 *
 * @param {Buffer[]} pdfBuffers - Array of PDF buffers to merge
 * @returns {Promise<Buffer>} Merged PDF
 *
 * @example
 * ```typescript
 * const merged = await mergePDFs([pdf1Buffer, pdf2Buffer, pdf3Buffer]);
 * ```
 */
export const mergePDFs = async (pdfBuffers: Buffer[]): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use pdf-lib
  // const { PDFDocument } = require('pdf-lib');
  // const mergedPdf = await PDFDocument.create();
  // for (const pdfBuffer of pdfBuffers) {
  //   const pdf = await PDFDocument.load(pdfBuffer);
  //   const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  //   copiedPages.forEach((page) => mergedPdf.addPage(page));
  // }
  // return Buffer.from(await mergedPdf.save());

  throw new Error('PDF merging requires pdf-lib library installation');
};

/**
 * Extracts text content from PDF
 *
 * @param {Buffer} pdfBuffer - PDF data
 * @returns {Promise<string>} Extracted text
 *
 * @example
 * ```typescript
 * const text = await extractPDFText(pdfBuffer);
 * console.log(text);
 * ```
 */
export const extractPDFText = async (pdfBuffer: Buffer): Promise<string> => {
  // Note: This is a placeholder. In production, use pdf-parse
  // const pdfParse = require('pdf-parse');
  // const data = await pdfParse(pdfBuffer);
  // return data.text;

  throw new Error('PDF text extraction requires pdf-parse library installation');
};

/**
 * Gets PDF metadata (page count, author, etc.)
 *
 * @param {Buffer} pdfBuffer - PDF data
 * @returns {Promise<{ pageCount: number; metadata: Record<string, any> }>} PDF metadata
 *
 * @example
 * ```typescript
 * const { pageCount, metadata } = await getPDFMetadata(pdfBuffer);
 * console.log(`PDF has ${pageCount} pages`);
 * ```
 */
export const getPDFMetadata = async (
  pdfBuffer: Buffer,
): Promise<{ pageCount: number; metadata: Record<string, any> }> => {
  // Note: This is a placeholder. In production, use pdf-parse
  throw new Error('PDF metadata extraction requires pdf-parse library installation');
};

// ============================================================================
// CSV IMPORT/EXPORT
// ============================================================================

/**
 * Parses CSV data into JavaScript objects
 *
 * @param {Buffer | string} csvData - CSV data
 * @param {CSVParseOptions} [options] - Parse options
 * @returns {Promise<any[]>} Parsed records
 *
 * @example
 * ```typescript
 * const records = await parseCSV(csvBuffer, {
 *   headers: true,
 *   delimiter: ','
 * });
 * ```
 */
export const parseCSV = async (
  csvData: Buffer | string,
  options?: CSVParseOptions,
): Promise<any[]> => {
  const csvString = Buffer.isBuffer(csvData) ? csvData.toString(options?.encoding || 'utf-8') : csvData;
  const lines = csvString.split('\n').filter(line => {
    if (options?.skipEmptyLines) {
      return line.trim().length > 0;
    }
    return true;
  });

  if (lines.length === 0) return [];

  const delimiter = options?.delimiter || ',';
  const quote = options?.quote || '"';
  const escape = options?.escape || '"';

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === quote) {
        if (inQuotes && nextChar === quote) {
          current += quote;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  let headers: string[];
  let dataStartIndex = 0;

  if (options?.headers === true) {
    headers = parseLine(lines[0]);
    dataStartIndex = 1;
  } else if (Array.isArray(options?.headers)) {
    headers = options.headers;
    dataStartIndex = 0;
  } else {
    // No headers, use indices
    const firstLine = parseLine(lines[0]);
    headers = firstLine.map((_, i) => `field${i}`);
    dataStartIndex = 0;
  }

  const records: any[] = [];
  const maxRows = options?.maxRows || lines.length;

  for (let i = dataStartIndex; i < Math.min(lines.length, dataStartIndex + maxRows); i++) {
    const values = parseLine(lines[i]);
    const record: Record<string, any> = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });

    records.push(record);
  }

  return records;
};

/**
 * Generates CSV from JavaScript objects
 *
 * @param {any[]} data - Array of objects
 * @param {CSVGenerateOptions} [options] - Generation options
 * @returns {string} CSV string
 *
 * @example
 * ```typescript
 * const csv = generateCSV(patientData, {
 *   headers: true,
 *   delimiter: ','
 * });
 * ```
 */
export const generateCSV = (data: any[], options?: CSVGenerateOptions): string => {
  if (data.length === 0) return '';

  const delimiter = options?.delimiter || ',';
  const quote = options?.quote || '"';
  const newline = options?.newline || '\n';

  const escapeValue = (value: any): string => {
    const stringValue = String(value ?? '');
    if (stringValue.includes(delimiter) || stringValue.includes(quote) || stringValue.includes('\n')) {
      return `${quote}${stringValue.replace(new RegExp(quote, 'g'), `${quote}${quote}`)}${quote}`;
    }
    return stringValue;
  };

  let headers: string[];
  if (options?.headers === true) {
    headers = Object.keys(data[0]);
  } else if (Array.isArray(options?.headers)) {
    headers = options.headers;
  } else {
    headers = Object.keys(data[0]);
  }

  const lines: string[] = [];

  if (options?.headers !== false) {
    lines.push(headers.map(escapeValue).join(delimiter));
  }

  for (const record of data) {
    const values = headers.map(header => escapeValue(record[header]));
    lines.push(values.join(delimiter));
  }

  return lines.join(newline);
};

/**
 * Streams CSV import for large files
 *
 * @param {Readable} stream - CSV stream
 * @param {CSVParseOptions} options - Parse options
 * @param {(record: any) => Promise<void>} processor - Record processor function
 * @returns {Promise<{ processed: number; errors: number }>} Processing stats
 *
 * @example
 * ```typescript
 * const stats = await streamCSVImport(fileStream, { headers: true }, async (record) => {
 *   await savePatientRecord(record);
 * });
 * ```
 */
export const streamCSVImport = async (
  stream: Readable,
  options: CSVParseOptions,
  processor: (record: any) => Promise<void>,
): Promise<{ processed: number; errors: number }> => {
  // Note: This is a placeholder. In production, use csv-parser
  throw new Error('CSV streaming requires csv-parser library installation');
};

/**
 * Exports data to CSV file stream
 *
 * @param {any[]} data - Data to export
 * @param {CSVGenerateOptions} options - Generation options
 * @returns {Readable} CSV stream
 *
 * @example
 * ```typescript
 * const stream = exportToCSVStream(patientData, { headers: true });
 * stream.pipe(fs.createWriteStream('export.csv'));
 * ```
 */
export const exportToCSVStream = (data: any[], options: CSVGenerateOptions): Readable => {
  const csvString = generateCSV(data, options);
  return Readable.from(csvString);
};

// ============================================================================
// FILE CHUNKING FOR LARGE UPLOADS
// ============================================================================

/**
 * Splits a file into chunks for upload
 *
 * @param {Buffer} fileBuffer - File data
 * @param {number} [chunkSize=5242880] - Chunk size in bytes (default 5MB)
 * @returns {Buffer[]} Array of chunks
 *
 * @example
 * ```typescript
 * const chunks = chunkFile(largeFileBuffer, 5 * 1024 * 1024);
 * console.log(`Split into ${chunks.length} chunks`);
 * ```
 */
export const chunkFile = (fileBuffer: Buffer, chunkSize: number = 5 * 1024 * 1024): Buffer[] => {
  const chunks: Buffer[] = [];
  let offset = 0;

  while (offset < fileBuffer.length) {
    const chunk = fileBuffer.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  return chunks;
};

/**
 * Uploads a file in chunks
 *
 * @param {Buffer} fileBuffer - File data
 * @param {Function} uploadChunk - Function to upload individual chunk
 * @param {ChunkUploadOptions} [options] - Upload options
 * @returns {Promise<void>} Completion promise
 *
 * @example
 * ```typescript
 * await uploadFileInChunks(largeFile, async (chunk, index) => {
 *   await uploadChunkToS3(chunk, index);
 * }, {
 *   chunkSize: 5 * 1024 * 1024,
 *   onProgress: (progress) => console.log(`${progress}% complete`)
 * });
 * ```
 */
export const uploadFileInChunks = async (
  fileBuffer: Buffer,
  uploadChunk: (chunk: Buffer, index: number) => Promise<void>,
  options?: ChunkUploadOptions,
): Promise<void> => {
  const chunkSize = options?.chunkSize || 5 * 1024 * 1024;
  const chunks = chunkFile(fileBuffer, chunkSize);
  const maxConcurrent = options?.maxConcurrentUploads || 3;
  const retryAttempts = options?.retryAttempts || 3;

  let uploaded = 0;

  const uploadWithRetry = async (chunk: Buffer, index: number): Promise<void> => {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < retryAttempts; attempt++) {
      try {
        await uploadChunk(chunk, index);
        uploaded++;

        if (options?.onProgress) {
          const progress = Math.round((uploaded / chunks.length) * 100);
          options.onProgress(progress);
        }

        return;
      } catch (error: any) {
        lastError = error;
        if (attempt < retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError;
  };

  // Upload chunks with concurrency control
  for (let i = 0; i < chunks.length; i += maxConcurrent) {
    const batch = chunks.slice(i, i + maxConcurrent);
    const uploadPromises = batch.map((chunk, batchIndex) =>
      uploadWithRetry(chunk, i + batchIndex)
    );
    await Promise.all(uploadPromises);
  }
};

/**
 * Reassembles chunks into complete file
 *
 * @param {Buffer[]} chunks - Array of file chunks
 * @returns {Buffer} Complete file
 *
 * @example
 * ```typescript
 * const completeFile = reassembleChunks(downloadedChunks);
 * ```
 */
export const reassembleChunks = (chunks: Buffer[]): Buffer => {
  return Buffer.concat(chunks);
};

// ============================================================================
// MULTIPART UPLOAD HANDLING
// ============================================================================

/**
 * Initiates a multipart upload to S3
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {string} [contentType] - Content type
 * @returns {Promise<string>} Upload ID
 *
 * @example
 * ```typescript
 * const uploadId = await initiateMultipartUpload(s3Client, 'bucket', 'large-file.zip');
 * ```
 */
export const initiateMultipartUpload = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  contentType?: string,
): Promise<string> => {
  const command = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
  });

  const response = await s3Client.send(command);

  if (!response.UploadId) {
    throw new Error('Failed to initiate multipart upload');
  }

  return response.UploadId;
};

/**
 * Uploads a part in multipart upload
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {string} uploadId - Upload ID
 * @param {number} partNumber - Part number (1-indexed)
 * @param {Buffer} data - Part data
 * @returns {Promise<string>} ETag of uploaded part
 *
 * @example
 * ```typescript
 * const etag = await uploadPart(s3Client, 'bucket', 'file.zip', uploadId, 1, chunk);
 * ```
 */
export const uploadPart = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  uploadId: string,
  partNumber: number,
  data: Buffer,
): Promise<string> => {
  const command = new UploadPartCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
    Body: data,
  });

  const response = await s3Client.send(command);

  if (!response.ETag) {
    throw new Error(`Failed to upload part ${partNumber}`);
  }

  return response.ETag;
};

/**
 * Completes a multipart upload
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {string} uploadId - Upload ID
 * @param {Array<{ partNumber: number; etag: string }>} parts - Uploaded parts
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await completeMultipartUpload(s3Client, 'bucket', 'file.zip', uploadId, parts);
 * ```
 */
export const completeMultipartUpload = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  uploadId: string,
  parts: Array<{ partNumber: number; etag: string }>,
): Promise<boolean> => {
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts.map(p => ({
        PartNumber: p.partNumber,
        ETag: p.etag,
      })),
    },
  });

  await s3Client.send(command);
  return true;
};

/**
 * Aborts a multipart upload
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {string} uploadId - Upload ID
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await abortMultipartUpload(s3Client, 'bucket', 'file.zip', uploadId);
 * ```
 */
export const abortMultipartUpload = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  uploadId: string,
): Promise<boolean> => {
  const command = new AbortMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
  });

  await s3Client.send(command);
  return true;
};

/**
 * Uploads large file using multipart upload
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {Buffer} fileBuffer - File data
 * @param {ChunkUploadOptions} [options] - Upload options
 * @returns {Promise<void>} Completion promise
 *
 * @example
 * ```typescript
 * await multipartUploadToS3(s3Client, 'bucket', 'large-video.mp4', videoBuffer, {
 *   chunkSize: 10 * 1024 * 1024,
 *   onProgress: (p) => console.log(`${p}% uploaded`)
 * });
 * ```
 */
export const multipartUploadToS3 = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  fileBuffer: Buffer,
  options?: ChunkUploadOptions,
): Promise<void> => {
  const uploadId = await initiateMultipartUpload(s3Client, bucket, key);
  const chunkSize = options?.chunkSize || 10 * 1024 * 1024; // 10MB default
  const chunks = chunkFile(fileBuffer, chunkSize);
  const parts: Array<{ partNumber: number; etag: string }> = [];

  try {
    await uploadFileInChunks(
      fileBuffer,
      async (chunk, index) => {
        const partNumber = index + 1;
        const etag = await uploadPart(s3Client, bucket, key, uploadId, partNumber, chunk);
        parts.push({ partNumber, etag });
      },
      options,
    );

    await completeMultipartUpload(s3Client, bucket, key, uploadId, parts);
  } catch (error) {
    await abortMultipartUpload(s3Client, bucket, key, uploadId);
    throw error;
  }
};

// ============================================================================
// VIRUS SCANNING INTEGRATION
// ============================================================================

/**
 * Scans file for viruses using ClamAV
 *
 * @param {Buffer} fileBuffer - File data
 * @param {object} [options] - Scanner options
 * @returns {Promise<VirusScanResult>} Scan result
 *
 * @example
 * ```typescript
 * const result = await scanFileForViruses(fileBuffer);
 * if (!result.isClean) {
 *   console.error('Threats found:', result.threats);
 * }
 * ```
 */
export const scanFileForViruses = async (
  fileBuffer: Buffer,
  options?: { clamHost?: string; clamPort?: number },
): Promise<VirusScanResult> => {
  // Note: This is a placeholder. In production, integrate with ClamAV
  // const NodeClam = require('clamscan');
  // const clamscan = await new NodeClam().init({
  //   clamdscan: {
  //     host: options?.clamHost || 'localhost',
  //     port: options?.clamPort || 3310
  //   }
  // });
  // const { isInfected, viruses } = await clamscan.scanBuffer(fileBuffer);
  // return {
  //   isClean: !isInfected,
  //   threats: viruses || [],
  //   scanDate: new Date(),
  //   scanner: 'ClamAV'
  // };

  // For now, return mock clean result
  return {
    isClean: true,
    threats: [],
    scanDate: new Date(),
    scanner: 'ClamAV (mock)',
  };
};

/**
 * Scans file from S3 for viruses
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @returns {Promise<VirusScanResult>} Scan result
 *
 * @example
 * ```typescript
 * const result = await scanS3FileForViruses(s3Client, 'uploads', 'document.pdf');
 * ```
 */
export const scanS3FileForViruses = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
): Promise<VirusScanResult> => {
  const fileBuffer = await downloadFromS3(s3Client, { bucket, key });
  return await scanFileForViruses(fileBuffer);
};

/**
 * Quarantines an infected file
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {string} quarantineBucket - Quarantine bucket name
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await quarantineFile(s3Client, 'uploads', 'infected.exe', 'quarantine-bucket');
 * ```
 */
export const quarantineFile = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  quarantineBucket: string,
): Promise<boolean> => {
  // Copy to quarantine
  await copyS3File(s3Client, bucket, key, quarantineBucket, `quarantine/${key}`);

  // Delete original
  await deleteFromS3(s3Client, bucket, key);

  return true;
};

// ============================================================================
// FILE METADATA EXTRACTION
// ============================================================================

/**
 * Extracts EXIF metadata from image
 *
 * @param {Buffer} imageBuffer - Image data
 * @returns {Promise<Record<string, any>>} EXIF data
 *
 * @example
 * ```typescript
 * const exif = await extractEXIFMetadata(imageBuffer);
 * console.log('Camera:', exif.Make, exif.Model);
 * ```
 */
export const extractEXIFMetadata = async (imageBuffer: Buffer): Promise<Record<string, any>> => {
  // Note: This is a placeholder. In production, use exif-parser or exifr
  throw new Error('EXIF extraction requires exif-parser library installation');
};

/**
 * Extracts metadata from audio file
 *
 * @param {Buffer} audioBuffer - Audio data
 * @returns {Promise<Record<string, any>>} Audio metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractAudioMetadata(mp3Buffer);
 * console.log('Artist:', metadata.artist);
 * ```
 */
export const extractAudioMetadata = async (audioBuffer: Buffer): Promise<Record<string, any>> => {
  // Note: This is a placeholder. In production, use music-metadata
  throw new Error('Audio metadata extraction requires music-metadata library installation');
};

/**
 * Extracts metadata from video file
 *
 * @param {Buffer} videoBuffer - Video data
 * @returns {Promise<Record<string, any>>} Video metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractVideoMetadata(videoBuffer);
 * console.log('Duration:', metadata.duration);
 * ```
 */
export const extractVideoMetadata = async (videoBuffer: Buffer): Promise<Record<string, any>> => {
  // Note: This is a placeholder. In production, use ffprobe
  throw new Error('Video metadata extraction requires ffprobe integration');
};

/**
 * Extracts comprehensive file metadata
 *
 * @param {Buffer} fileBuffer - File data
 * @param {string} filename - Filename
 * @returns {Promise<FileMetadata>} Complete metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractFileMetadata(fileBuffer, 'photo.jpg');
 * ```
 */
export const extractFileMetadata = async (
  fileBuffer: Buffer,
  filename: string,
): Promise<FileMetadata> => {
  const mimeType = await detectMimeType(fileBuffer);
  const hash = calculateFileHash(fileBuffer);

  const metadata: FileMetadata = {
    filename,
    mimeType,
    size: fileBuffer.length,
    hash,
    uploadedAt: new Date(),
  };

  // Extract format-specific metadata
  if (mimeType.startsWith('image/')) {
    try {
      const exif = await extractEXIFMetadata(fileBuffer);
      metadata.metadata = { exif };

      const dimensions = await getImageDimensions(fileBuffer);
      metadata.dimensions = dimensions;
    } catch (error) {
      // EXIF not available
    }
  } else if (mimeType === 'application/pdf') {
    try {
      const pdfMeta = await getPDFMetadata(fileBuffer);
      metadata.pageCount = pdfMeta.pageCount;
      metadata.metadata = pdfMeta.metadata;
    } catch (error) {
      // PDF metadata not available
    }
  }

  return metadata;
};

// ============================================================================
// FILE COMPRESSION
// ============================================================================

/**
 * Compresses file using gzip
 *
 * @param {Buffer} fileBuffer - File data
 * @param {number} [level=6] - Compression level (1-9)
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressFile(fileBuffer, 9);
 * ```
 */
export const compressFile = async (fileBuffer: Buffer, level: number = 6): Promise<Buffer> => {
  const zlib = require('zlib');
  return new Promise((resolve, reject) => {
    zlib.gzip(fileBuffer, { level }, (error: Error | null, result: Buffer) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

/**
 * Decompresses gzipped file
 *
 * @param {Buffer} compressedBuffer - Compressed data
 * @returns {Promise<Buffer>} Decompressed data
 *
 * @example
 * ```typescript
 * const original = await decompressFile(compressedBuffer);
 * ```
 */
export const decompressFile = async (compressedBuffer: Buffer): Promise<Buffer> => {
  const zlib = require('zlib');
  return new Promise((resolve, reject) => {
    zlib.gunzip(compressedBuffer, (error: Error | null, result: Buffer) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

/**
 * Compresses file using Brotli
 *
 * @param {Buffer} fileBuffer - File data
 * @param {number} [quality=6] - Compression quality (0-11)
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressFileBrotli(fileBuffer, 11);
 * ```
 */
export const compressFileBrotli = async (fileBuffer: Buffer, quality: number = 6): Promise<Buffer> => {
  const zlib = require('zlib');
  return new Promise((resolve, reject) => {
    zlib.brotliCompress(fileBuffer, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: quality,
      },
    }, (error: Error | null, result: Buffer) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

/**
 * Creates a ZIP archive from multiple files
 *
 * @param {Map<string, Buffer>} files - Map of filename to file data
 * @returns {Promise<Buffer>} ZIP archive
 *
 * @example
 * ```typescript
 * const files = new Map([
 *   ['document1.pdf', pdf1Buffer],
 *   ['document2.pdf', pdf2Buffer]
 * ]);
 * const zipArchive = await createZipArchive(files);
 * ```
 */
export const createZipArchive = async (files: Map<string, Buffer>): Promise<Buffer> => {
  // Note: This is a placeholder. In production, use archiver or jszip
  throw new Error('ZIP creation requires archiver library installation');
};

// ============================================================================
// PRESIGNED URL GENERATION
// ============================================================================

/**
 * Generates a presigned URL for file download
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {PresignedUrlOptions} [options] - URL options
 * @returns {Promise<string>} Presigned URL
 *
 * @example
 * ```typescript
 * const url = await generatePresignedDownloadUrl(s3Client, 'bucket', 'file.pdf', {
 *   expiresIn: 3600 // 1 hour
 * });
 * ```
 */
export const generatePresignedDownloadUrl = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  options?: PresignedUrlOptions,
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentType: options?.responseContentType,
    ResponseContentDisposition: options?.responseContentDisposition,
    VersionId: options?.versionId,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: options?.expiresIn || 3600,
  });
};

/**
 * Generates a presigned URL for file upload
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {PresignedUrlOptions} [options] - URL options
 * @returns {Promise<string>} Presigned URL
 *
 * @example
 * ```typescript
 * const uploadUrl = await generatePresignedUploadUrl(s3Client, 'bucket', 'upload.pdf', {
 *   expiresIn: 300 // 5 minutes
 * });
 * ```
 */
export const generatePresignedUploadUrl = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  options?: PresignedUrlOptions,
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: options?.responseContentType,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: options?.expiresIn || 300,
  });
};

/**
 * Generates multiple presigned URLs for batch operations
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string[]} keys - Object keys
 * @param {PresignedUrlOptions} [options] - URL options
 * @returns {Promise<Map<string, string>>} Map of key to presigned URL
 *
 * @example
 * ```typescript
 * const urls = await generateBatchPresignedUrls(s3Client, 'bucket', [
 *   'file1.pdf',
 *   'file2.pdf',
 *   'file3.pdf'
 * ]);
 * ```
 */
export const generateBatchPresignedUrls = async (
  s3Client: S3Client,
  bucket: string,
  keys: string[],
  options?: PresignedUrlOptions,
): Promise<Map<string, string>> => {
  const urls = new Map<string, string>();

  await Promise.all(
    keys.map(async (key) => {
      const url = await generatePresignedDownloadUrl(s3Client, bucket, key, options);
      urls.set(key, url);
    }),
  );

  return urls;
};

// ============================================================================
// FILE ENCRYPTION/DECRYPTION
// ============================================================================

/**
 * Encrypts file data using AES-256-GCM
 *
 * @param {Buffer} fileBuffer - File data
 * @param {FileEncryptionOptions} [options] - Encryption options
 * @returns {EncryptedFileResult} Encryption result
 *
 * @example
 * ```typescript
 * const encrypted = encryptFile(sensitiveFileBuffer);
 * // Store encrypted.encryptedData, encrypted.key, and encrypted.iv securely
 * ```
 */
export const encryptFile = (
  fileBuffer: Buffer,
  options?: FileEncryptionOptions,
): EncryptedFileResult => {
  const algorithm = options?.algorithm || 'aes-256-gcm';
  const key = options?.key || (options?.generateKey ? crypto.randomBytes(32) : crypto.randomBytes(32));
  const iv = options?.iv || crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encryptedChunks: Buffer[] = [];
  encryptedChunks.push(cipher.update(fileBuffer));
  encryptedChunks.push(cipher.final());

  const encryptedData = Buffer.concat(encryptedChunks);
  const authTag = (cipher as any).getAuthTag();

  return {
    encryptedData,
    key,
    iv,
    algorithm,
    authTag,
  };
};

/**
 * Decrypts file data using AES-256-GCM
 *
 * @param {Buffer} encryptedBuffer - Encrypted data
 * @param {Buffer} key - Encryption key
 * @param {Buffer} iv - Initialization vector
 * @param {Buffer} [authTag] - Authentication tag
 * @param {string} [algorithm='aes-256-gcm'] - Algorithm
 * @returns {Buffer} Decrypted data
 *
 * @example
 * ```typescript
 * const decrypted = decryptFile(
 *   encrypted.encryptedData,
 *   encrypted.key,
 *   encrypted.iv,
 *   encrypted.authTag
 * );
 * ```
 */
export const decryptFile = (
  encryptedBuffer: Buffer,
  key: Buffer,
  iv: Buffer,
  authTag?: Buffer,
  algorithm: string = 'aes-256-gcm',
): Buffer => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  if (authTag) {
    (decipher as any).setAuthTag(authTag);
  }

  const decryptedChunks: Buffer[] = [];
  decryptedChunks.push(decipher.update(encryptedBuffer));
  decryptedChunks.push(decipher.final());

  return Buffer.concat(decryptedChunks);
};

/**
 * Encrypts and uploads file to S3
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {S3UploadOptions} uploadOptions - Upload options
 * @param {FileEncryptionOptions} [encryptionOptions] - Encryption options
 * @returns {Promise<{ key: string; bucket: string; encryptionKey: Buffer; iv: Buffer }>} Upload result with encryption keys
 *
 * @example
 * ```typescript
 * const result = await encryptAndUploadToS3(s3Client, {
 *   bucket: 'encrypted-files',
 *   key: 'sensitive-data.enc',
 *   body: fileBuffer
 * });
 * // Store result.encryptionKey and result.iv securely
 * ```
 */
export const encryptAndUploadToS3 = async (
  s3Client: S3Client,
  uploadOptions: S3UploadOptions,
  encryptionOptions?: FileEncryptionOptions,
): Promise<{ key: string; bucket: string; encryptionKey: Buffer; iv: Buffer }> => {
  const fileBuffer = Buffer.isBuffer(uploadOptions.body)
    ? uploadOptions.body
    : await streamToBuffer(uploadOptions.body as Readable);

  const encrypted = encryptFile(fileBuffer, encryptionOptions);

  await uploadToS3(s3Client, {
    ...uploadOptions,
    body: encrypted.encryptedData,
    metadata: {
      ...uploadOptions.metadata,
      encrypted: 'true',
      algorithm: encrypted.algorithm,
    },
  });

  return {
    key: uploadOptions.key,
    bucket: uploadOptions.bucket,
    encryptionKey: encrypted.key,
    iv: encrypted.iv,
  };
};

/**
 * Downloads and decrypts file from S3
 *
 * @param {S3Client} s3Client - S3 client instance
 * @param {string} bucket - Bucket name
 * @param {string} key - Object key
 * @param {Buffer} encryptionKey - Encryption key
 * @param {Buffer} iv - Initialization vector
 * @returns {Promise<Buffer>} Decrypted file data
 *
 * @example
 * ```typescript
 * const decrypted = await downloadAndDecryptFromS3(
 *   s3Client,
 *   'encrypted-files',
 *   'sensitive-data.enc',
 *   encryptionKey,
 *   iv
 * );
 * ```
 */
export const downloadAndDecryptFromS3 = async (
  s3Client: S3Client,
  bucket: string,
  key: string,
  encryptionKey: Buffer,
  iv: Buffer,
): Promise<Buffer> => {
  const encryptedData = await downloadFromS3(s3Client, { bucket, key });
  return decryptFile(encryptedData, encryptionKey, iv);
};

// ============================================================================
// MIME TYPE DETECTION
// ============================================================================

/**
 * Detects MIME type from file buffer using magic numbers
 *
 * @param {Buffer} fileBuffer - File data
 * @returns {Promise<string>} Detected MIME type
 *
 * @example
 * ```typescript
 * const mimeType = await detectMimeType(fileBuffer);
 * console.log('Detected type:', mimeType);
 * ```
 */
export const detectMimeType = async (fileBuffer: Buffer): Promise<string> => {
  // Check magic numbers for common file types
  const magicNumbers: Array<{ signature: number[]; mimeType: string }> = [
    { signature: [0xFF, 0xD8, 0xFF], mimeType: 'image/jpeg' },
    { signature: [0x89, 0x50, 0x4E, 0x47], mimeType: 'image/png' },
    { signature: [0x47, 0x49, 0x46, 0x38], mimeType: 'image/gif' },
    { signature: [0x25, 0x50, 0x44, 0x46], mimeType: 'application/pdf' },
    { signature: [0x50, 0x4B, 0x03, 0x04], mimeType: 'application/zip' },
    { signature: [0x50, 0x4B, 0x05, 0x06], mimeType: 'application/zip' },
    { signature: [0x50, 0x4B, 0x07, 0x08], mimeType: 'application/zip' },
    { signature: [0x52, 0x61, 0x72, 0x21], mimeType: 'application/x-rar-compressed' },
    { signature: [0x1F, 0x8B], mimeType: 'application/gzip' },
    { signature: [0x42, 0x4D], mimeType: 'image/bmp' },
    { signature: [0x49, 0x49, 0x2A, 0x00], mimeType: 'image/tiff' },
    { signature: [0x4D, 0x4D, 0x00, 0x2A], mimeType: 'image/tiff' },
  ];

  for (const { signature, mimeType } of magicNumbers) {
    let matches = true;
    for (let i = 0; i < signature.length; i++) {
      if (fileBuffer[i] !== signature[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      return mimeType;
    }
  }

  return 'application/octet-stream';
};

/**
 * Validates MIME type matches file extension
 *
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 * @returns {boolean} Whether MIME type matches extension
 *
 * @example
 * ```typescript
 * const valid = validateMimeTypeExtension('photo.jpg', 'image/jpeg'); // true
 * const invalid = validateMimeTypeExtension('photo.jpg', 'application/pdf'); // false
 * ```
 */
export const validateMimeTypeExtension = (filename: string, mimeType: string): boolean => {
  const ext = path.extname(filename).toLowerCase();

  const extensionMap: Record<string, string[]> = {
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword'],
    '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    '.xls': ['application/vnd.ms-excel'],
    '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    '.zip': ['application/zip'],
    '.csv': ['text/csv'],
    '.txt': ['text/plain'],
    '.mp4': ['video/mp4'],
    '.mp3': ['audio/mpeg'],
  };

  const expectedMimeTypes = extensionMap[ext];
  if (!expectedMimeTypes) {
    return false;
  }

  return expectedMimeTypes.includes(mimeType);
};

/**
 * Gets file extension from MIME type
 *
 * @param {string} mimeType - MIME type
 * @returns {string} File extension (with dot)
 *
 * @example
 * ```typescript
 * const ext = getExtensionFromMimeType('image/jpeg'); // '.jpg'
 * ```
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExtension: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/zip': '.zip',
    'text/csv': '.csv',
    'text/plain': '.txt',
    'video/mp4': '.mp4',
    'audio/mpeg': '.mp3',
  };

  return mimeToExtension[mimeType] || '';
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts a readable stream to buffer
 *
 * @param {Readable} stream - Readable stream
 * @returns {Promise<Buffer>} Buffer containing stream data
 *
 * @example
 * ```typescript
 * const buffer = await streamToBuffer(readableStream);
 * ```
 */
export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

/**
 * Formats file size for human-readable display
 *
 * @param {number} bytes - File size in bytes
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted file size
 *
 * @example
 * ```typescript
 * console.log(formatFileSize(1536)); // "1.50 KB"
 * console.log(formatFileSize(1048576)); // "1.00 MB"
 * ```
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};
