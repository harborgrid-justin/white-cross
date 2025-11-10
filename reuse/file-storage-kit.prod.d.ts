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
import { CallHandler, ExecutionContext, NestInterceptor, StreamableFile } from '@nestjs/common';
import { Model, Sequelize, ModelStatic } from 'sequelize';
import * as fs from 'fs';
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
/**
 * Zod schema for file upload configuration validation.
 */
export declare const FileUploadConfigSchema: any;
/**
 * Zod schema for image processing options validation.
 */
export declare const ImageProcessingOptionsSchema: any;
/**
 * Zod schema for video processing options validation.
 */
export declare const VideoProcessingOptionsSchema: any;
/**
 * Zod schema for presigned URL options validation.
 */
export declare const PresignedUrlOptionsSchema: any;
/**
 * Zod schema for storage quota configuration.
 */
export declare const StorageQuotaSchema: any;
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
export declare const defineFileMetadataModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const defineStorageProviderModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const defineChunkedUploadSessionModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const defineStorageQuotaModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const validateFile: (file: Express.Multer.File, options: FileValidationOptions) => Promise<FileValidationResult>;
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
export declare const detectFileTypeFromMagicNumbers: (buffer: Buffer) => Promise<{
    mime: string;
    ext: string;
} | null>;
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
export declare const generateSafeFilename: (originalName: string, prefix?: string) => string;
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
export declare const calculateFileHash: (fileContent: Buffer | string) => Promise<{
    hash: string;
    checksum: string;
}>;
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
export declare const validateStorageQuota: (userId: string, fileSize: number, quotaModel: ModelStatic<Model>) => Promise<{
    allowed: boolean;
    reason?: string;
}>;
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
export declare const scanFileForViruses: (fileContent: string | Buffer, config: VirusScanConfig) => Promise<VirusScanResult>;
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
export declare const quarantineFile: (filePath: string, quarantinePath: string) => Promise<string>;
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
export declare const saveFileToLocalStorage: (file: Express.Multer.File, config: LocalStorageConfig) => Promise<FileMetadata>;
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
export declare const deleteFileFromLocalStorage: (filePath: string) => Promise<boolean>;
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
export declare const createLocalFileStream: (filePath: string, options?: FileStreamOptions) => fs.ReadStream;
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
export declare const uploadFileToS3: (file: Express.Multer.File, config: S3StorageConfig, key?: string) => Promise<FileMetadata>;
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
export declare const generateS3PresignedUrl: (key: string, config: S3StorageConfig, options: PresignedUrlOptions) => Promise<string>;
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
export declare const initiateS3MultipartUpload: (key: string, config: S3StorageConfig, contentType: string) => Promise<string>;
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
export declare const uploadS3MultipartPart: (key: string, uploadId: string, partNumber: number, data: Buffer, config: S3StorageConfig) => Promise<{
    ETag: string;
    PartNumber: number;
}>;
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
export declare const completeS3MultipartUpload: (key: string, uploadId: string, parts: Array<{
    ETag: string;
    PartNumber: number;
}>, config: S3StorageConfig) => Promise<string>;
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
export declare const deleteFileFromS3: (key: string, config: S3StorageConfig) => Promise<boolean>;
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
export declare const uploadFileToAzureBlob: (file: Express.Multer.File, config: AzureBlobStorageConfig, blobName?: string) => Promise<FileMetadata>;
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
export declare const generateAzureBlobSasUrl: (blobName: string, config: AzureBlobStorageConfig, options: PresignedUrlOptions) => Promise<string>;
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
export declare const deleteFileFromAzureBlob: (blobName: string, config: AzureBlobStorageConfig) => Promise<boolean>;
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
export declare const uploadFileToGCS: (file: Express.Multer.File, config: GCPStorageConfig, objectName?: string) => Promise<FileMetadata>;
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
export declare const generateGCSSignedUrl: (objectName: string, config: GCPStorageConfig, options: PresignedUrlOptions) => Promise<string>;
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
export declare const deleteFileFromGCS: (objectName: string, config: GCPStorageConfig) => Promise<boolean>;
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
export declare const processImage: (input: Buffer | string, options: ImageProcessingOptions) => Promise<{
    buffer: Buffer;
    metadata: any;
    variants?: Array<{
        name: string;
        buffer: Buffer;
        width: number;
        height: number;
    }>;
}>;
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
export declare const generateImageThumbnail: (input: Buffer | string, width: number, height: number) => Promise<Buffer>;
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
export declare const extractImageMetadata: (input: Buffer | string) => Promise<any>;
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
export declare const transcodeVideo: (inputPath: string, outputPath: string, options: VideoProcessingOptions) => Promise<{
    outputPath: string;
    duration: number;
    size: number;
}>;
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
export declare const generateVideoThumbnail: (videoPath: string, timestamp: number, outputPath: string) => Promise<string>;
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
export declare const extractVideoMetadata: (videoPath: string) => Promise<any>;
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
export declare const segmentVideoForStreaming: (inputPath: string, outputDir: string, options: VideoProcessingOptions["segments"]) => Promise<{
    playlistPath: string;
    segmentCount: number;
}>;
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
export declare const createChunkedUploadSession: (config: ChunkedUploadConfig, filename: string, totalSize: number, sessionModel: ModelStatic<Model>) => Promise<ChunkedUploadSession>;
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
export declare const uploadChunk: (sessionId: string, chunkNumber: number, chunkData: Buffer, sessionModel: ModelStatic<Model>) => Promise<{
    uploadedChunks: number[];
    isComplete: boolean;
}>;
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
export declare const getChunkedUploadStatus: (sessionId: string, sessionModel: ModelStatic<Model>) => Promise<ChunkedUploadSession>;
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
export declare const completeChunkedUpload: (sessionId: string, sessionModel: ModelStatic<Model>, storageConfig: StorageProvider) => Promise<FileMetadata>;
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
export declare const purgeCDNCache: (urls: string | string[], config: CDNConfig) => Promise<{
    purged: number;
    errors: string[];
}>;
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
export declare const generateCDNUrl: (storageUrl: string, config: CDNConfig) => string;
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
export declare const searchFiles: (options: FileSearchOptions, fileModel: ModelStatic<Model>) => Promise<{
    files: FileMetadata[];
    total: number;
}>;
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
export declare const cleanupFiles: (config: FileCleanupConfig, fileModel: ModelStatic<Model>) => Promise<{
    deleted: number;
    archived: number;
}>;
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
export declare const updateStorageQuota: (userId: string, sizeChange: number, fileCountChange: number, quotaModel: ModelStatic<Model>) => Promise<StorageQuota>;
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
export declare const FileUpload: (fieldName?: string, validationOptions?: FileValidationOptions) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
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
export declare const FilesUpload: (fieldName?: string, maxCount?: number, validationOptions?: FileValidationOptions) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
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
export declare class FileValidationInterceptor implements NestInterceptor {
    private readonly options;
    constructor(options: FileValidationOptions);
    intercept(context: ExecutionContext, next: CallHandler): Promise<any>;
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
export declare class FileStorageService {
    private readonly fileMetadataModel;
    private readonly storageProviderModel;
    private readonly storageQuotaModel;
    constructor(fileMetadataModel: ModelStatic<Model>, storageProviderModel: ModelStatic<Model>, storageQuotaModel: ModelStatic<Model>);
    /**
     * Uploads file to configured storage provider.
     */
    uploadFile(file: Express.Multer.File, config: FileUploadConfig, userId?: string): Promise<FileMetadata>;
    /**
     * Gets storage provider configuration.
     */
    private getStorageProvider;
    /**
     * Downloads file by ID.
     */
    downloadFile(fileId: string): Promise<StreamableFile>;
    /**
     * Deletes file by ID.
     */
    deleteFile(fileId: string, userId?: string): Promise<boolean>;
    /**
     * Generates presigned/temporary URL for file download.
     */
    generateDownloadUrl(fileId: string, options: PresignedUrlOptions): Promise<string>;
}
export { StorageProvider, LocalStorageConfig, S3StorageConfig, AzureBlobStorageConfig, GCPStorageConfig, FileMetadata, FileVariant, FileUploadConfig, FileValidationOptions, FileValidationResult, VirusScanConfig, VirusScanResult, ImageProcessingOptions, VideoProcessingOptions, ChunkedUploadConfig, ChunkedUploadSession, PresignedUrlOptions, CDNConfig, StorageQuota, FileStreamOptions, FileCleanupConfig, FileSearchOptions, };
//# sourceMappingURL=file-storage-kit.prod.d.ts.map