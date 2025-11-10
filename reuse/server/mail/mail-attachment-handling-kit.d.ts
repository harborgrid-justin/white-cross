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
import { Model, Sequelize, ModelAttributes, ModelOptions } from 'sequelize';
import { Readable } from 'stream';
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
    contentId?: string;
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
    duration?: number;
    pages?: number;
    createdDate?: Date;
    modifiedDate?: Date;
    author?: string;
    title?: string;
    description?: string;
    exif?: Record<string, any>;
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
    presignedExpiry?: number;
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
/**
 * Sequelize model attributes for mail attachments table
 */
export declare const MailAttachmentAttributes: ModelAttributes;
/**
 * Sequelize model options for mail attachments
 */
export declare const MailAttachmentOptions: ModelOptions;
/**
 * Creates and initializes the MailAttachment Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized MailAttachment model
 * @example
 * const MailAttachment = defineMailAttachmentModel(sequelize);
 */
export declare function defineMailAttachmentModel(sequelize: Sequelize): typeof Model;
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
export declare function validateAttachment(file: {
    filename: string;
    size: number;
    buffer?: Buffer;
    mimetype?: string;
}, config: AttachmentUploadConfig): Promise<AttachmentValidationResult>;
/**
 * Detects file type from buffer using magic bytes
 * @param buffer - File buffer
 * @returns Detected file type with MIME and extension
 * @example
 * const type = await detectFileType(fileBuffer);
 * console.log(type.mime); // 'image/jpeg'
 */
export declare function detectFileType(buffer: Buffer): Promise<{
    mime: string;
    ext: string;
} | null>;
/**
 * Validates filename for security (prevents path traversal, invalid chars)
 * @param filename - Filename to validate
 * @returns True if filename is safe
 * @example
 * const isSafe = isValidFilename('document.pdf'); // true
 * const isUnsafe = isValidFilename('../../../etc/passwd'); // false
 */
export declare function isValidFilename(filename: string): boolean;
/**
 * Sanitizes filename by removing/replacing unsafe characters
 * @param filename - Original filename
 * @returns Sanitized filename
 * @example
 * const safe = sanitizeFilename('my file (copy) [1].pdf');
 * // 'my_file_copy_1.pdf'
 */
export declare function sanitizeFilename(filename: string): string;
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
export declare function uploadAttachment(file: {
    buffer: Buffer;
    filename: string;
    mimetype: string;
    size: number;
}, messageId: string, config: AttachmentUploadConfig, options?: {
    contentId?: string;
    isInline?: boolean;
    generateThumbnail?: boolean;
    compressImage?: boolean;
}): Promise<AttachmentUploadResult>;
/**
 * Uploads multiple attachments in batch
 * @param files - Array of files to upload
 * @param messageId - Associated message ID
 * @param config - Upload configuration
 * @returns Bulk upload results
 * @example
 * const results = await uploadMultipleAttachments(files, 'msg-123', config);
 */
export declare function uploadMultipleAttachments(files: Array<{
    buffer: Buffer;
    filename: string;
    mimetype: string;
    size: number;
}>, messageId: string, config: AttachmentUploadConfig): Promise<BulkAttachmentResult>;
/**
 * Generates unique filename with timestamp and random suffix
 * @param originalFilename - Original filename
 * @returns Unique filename
 * @example
 * const unique = generateUniqueFilename('document.pdf');
 * // '20240115_143022_abc123_document.pdf'
 */
export declare function generateUniqueFilename(originalFilename: string): string;
/**
 * Uploads file to local filesystem storage
 * @param buffer - File buffer
 * @param filename - Filename
 * @param config - Local storage configuration
 * @returns Storage path
 * @example
 * const path = await uploadToLocalStorage(buffer, 'file.pdf', config);
 */
export declare function uploadToLocalStorage(buffer: Buffer, filename: string, config: LocalStorageConfig): Promise<string>;
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
export declare function uploadToS3(buffer: Buffer, filename: string, contentType: string, config: S3StorageConfig): Promise<{
    bucket: string;
    key: string;
    etag: string;
    url: string;
}>;
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
export declare function uploadToAzure(buffer: Buffer, filename: string, contentType: string, config: AzureStorageConfig): Promise<{
    containerName: string;
    blobName: string;
    url: string;
}>;
/**
 * Downloads attachment from storage
 * @param attachment - Attachment metadata
 * @param options - Download options
 * @returns File buffer
 * @example
 * const buffer = await downloadAttachment(attachment, { inline: false });
 */
export declare function downloadAttachment(attachment: MailAttachment, options?: AttachmentDownloadOptions): Promise<Buffer>;
/**
 * Downloads file from local storage
 * @param filePath - Local file path
 * @returns File buffer
 * @example
 * const buffer = await downloadFromLocalStorage('/var/mail/attachments/file.pdf');
 */
export declare function downloadFromLocalStorage(filePath: string): Promise<Buffer>;
/**
 * Downloads file from AWS S3
 * @param key - S3 object key
 * @param bucket - S3 bucket name
 * @returns File buffer
 * @example
 * const buffer = await downloadFromS3('attachments/file.pdf', 'my-bucket');
 */
export declare function downloadFromS3(key: string, bucket: string): Promise<Buffer>;
/**
 * Downloads file from Azure Blob Storage
 * @param blobName - Blob name
 * @param containerName - Container name
 * @returns File buffer
 * @example
 * const buffer = await downloadFromAzure('file.pdf', 'attachments');
 */
export declare function downloadFromAzure(blobName: string, containerName: string): Promise<Buffer>;
/**
 * Generates presigned download URL for attachment
 * @param attachment - Attachment metadata
 * @param expirySeconds - URL expiry time in seconds
 * @returns Presigned URL
 * @example
 * const url = await generatePresignedDownloadUrl(attachment, 3600);
 */
export declare function generatePresignedDownloadUrl(attachment: MailAttachment, expirySeconds?: number): Promise<string>;
/**
 * Generates S3 presigned download URL
 * @param key - S3 object key
 * @param bucket - S3 bucket name
 * @param expirySeconds - Expiry time
 * @returns Presigned URL
 * @example
 * const url = await generateS3PresignedUrl('file.pdf', 'bucket', 3600);
 */
export declare function generateS3PresignedUrl(key: string, bucket: string, expirySeconds: number): Promise<string>;
/**
 * Generates Azure Blob presigned download URL (SAS)
 * @param blobName - Blob name
 * @param containerName - Container name
 * @param expirySeconds - Expiry time
 * @returns Presigned URL with SAS token
 * @example
 * const url = await generateAzurePresignedUrl('file.pdf', 'container', 3600);
 */
export declare function generateAzurePresignedUrl(blobName: string, containerName: string, expirySeconds: number): Promise<string>;
/**
 * Generates Content-ID for inline image
 * @param filename - Image filename
 * @param messageId - Associated message ID
 * @returns Content-ID string
 * @example
 * const cid = generateContentId('logo.png', 'msg-123');
 * // 'logo.png.msg-123@whitecross.com'
 */
export declare function generateContentId(filename: string, messageId: string): string;
/**
 * Embeds inline images in HTML content using CID references
 * @param html - Email HTML content
 * @param attachments - Array of inline attachments
 * @returns HTML with embedded CID references
 * @example
 * const html = embedInlineImages('<img src="logo.png">', inlineAttachments);
 * // '<img src="cid:logo.png.abc123@whitecross.com">'
 */
export declare function embedInlineImages(html: string, attachments: InlineImageReference[]): string;
/**
 * Extracts inline image references from HTML
 * @param html - Email HTML content
 * @returns Array of extracted CID references
 * @example
 * const refs = extractInlineImageReferences('<img src="cid:img@domain.com">');
 */
export declare function extractInlineImageReferences(html: string): string[];
/**
 * Converts inline CID references back to URLs
 * @param html - Email HTML with CID references
 * @param cidToUrlMap - Mapping of CID to actual URLs
 * @returns HTML with URLs instead of CIDs
 * @example
 * const html = convertCidToUrls(htmlWithCids, { 'img@domain.com': 'https://...' });
 */
export declare function convertCidToUrls(html: string, cidToUrlMap: Record<string, string>): string;
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
export declare function scanAttachmentForViruses(buffer: Buffer, config: VirusScanConfig): Promise<VirusScanResult>;
/**
 * Quarantines infected attachment
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param quarantinePath - Quarantine directory path
 * @returns Quarantine location
 * @example
 * const location = await quarantineAttachment(buffer, 'virus.exe', '/var/quarantine');
 */
export declare function quarantineAttachment(buffer: Buffer, filename: string, quarantinePath: string): Promise<string>;
/**
 * Extracts comprehensive metadata from attachment
 * @param buffer - File buffer
 * @param filename - Filename
 * @param mimeType - MIME type
 * @returns Extracted metadata
 * @example
 * const metadata = await extractAttachmentMetadata(buffer, 'photo.jpg', 'image/jpeg');
 */
export declare function extractAttachmentMetadata(buffer: Buffer, filename: string, mimeType: string): Promise<AttachmentMetadata>;
/**
 * Extracts metadata from image files
 * @param buffer - Image buffer
 * @returns Image metadata including dimensions, EXIF
 * @example
 * const metadata = await extractImageMetadata(imageBuffer);
 */
export declare function extractImageMetadata(buffer: Buffer): Promise<Partial<AttachmentMetadata>>;
/**
 * Parses EXIF data from buffer
 * @param exifBuffer - EXIF data buffer
 * @returns Parsed EXIF object
 * @example
 * const exif = parseExifData(exifBuffer);
 */
export declare function parseExifData(exifBuffer: Buffer): Record<string, any>;
/**
 * Extracts metadata from PDF files
 * @param buffer - PDF buffer
 * @returns PDF metadata
 * @example
 * const metadata = await extractPdfMetadata(pdfBuffer);
 */
export declare function extractPdfMetadata(buffer: Buffer): Promise<Partial<AttachmentMetadata>>;
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
export declare function generateThumbnail(buffer: Buffer, filename: string, config: {
    width: number;
    height: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}): Promise<{
    buffer: Buffer;
    path?: string;
}>;
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
export declare function generateMultipleThumbnails(buffer: Buffer, filename: string, config: ThumbnailConfig): Promise<Array<{
    name: string;
    buffer: Buffer;
    path?: string;
}>>;
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
export declare function compressImage(buffer: Buffer, config: ImageCompressionConfig): Promise<CompressionResult>;
/**
 * Compresses generic file using gzip
 * @param buffer - File buffer
 * @returns Compression result
 * @example
 * const result = await compressFile(fileBuffer);
 */
export declare function compressFile(buffer: Buffer): Promise<CompressionResult>;
/**
 * Creates read stream for attachment
 * @param attachment - Attachment metadata
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = await createAttachmentStream(attachment, { chunkSize: 64 * 1024 });
 */
export declare function createAttachmentStream(attachment: MailAttachment, options?: StreamingOptions): Promise<Readable>;
/**
 * Creates read stream from local file
 * @param filePath - File path
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = createLocalFileStream('/path/to/file.pdf', { chunkSize: 64KB });
 */
export declare function createLocalFileStream(filePath: string, options?: StreamingOptions): Readable;
/**
 * Creates read stream from S3 object
 * @param key - S3 object key
 * @param bucket - S3 bucket name
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = await createS3Stream('file.pdf', 'bucket', { start: 0, end: 1024 });
 */
export declare function createS3Stream(key: string, bucket: string, options?: StreamingOptions): Promise<Readable>;
/**
 * Creates read stream from Azure Blob
 * @param blobName - Blob name
 * @param containerName - Container name
 * @param options - Streaming options
 * @returns Readable stream
 * @example
 * const stream = await createAzureStream('file.pdf', 'container');
 */
export declare function createAzureStream(blobName: string, containerName: string, options?: StreamingOptions): Promise<Readable>;
/**
 * Calculates checksum for file buffer
 * @param buffer - File buffer
 * @param algorithm - Hash algorithm (md5, sha256, sha512)
 * @returns Checksum hex string
 * @example
 * const checksum = calculateChecksum(buffer, 'sha256');
 */
export declare function calculateChecksum(buffer: Buffer, algorithm?: 'md5' | 'sha256' | 'sha512'): string;
/**
 * Checks if MIME type is an image
 * @param mimeType - MIME type string
 * @returns True if image type
 * @example
 * const isImg = isImageMimeType('image/jpeg'); // true
 */
export declare function isImageMimeType(mimeType: string): boolean;
/**
 * Gets file extension from MIME type
 * @param mimeType - MIME type
 * @returns File extension
 * @example
 * const ext = getExtensionFromMimeType('image/jpeg'); // '.jpg'
 */
export declare function getExtensionFromMimeType(mimeType: string): string | null;
/**
 * Gets MIME type from file extension
 * @param filename - Filename with extension
 * @returns MIME type
 * @example
 * const mime = getMimeTypeFromFilename('document.pdf'); // 'application/pdf'
 */
export declare function getMimeTypeFromFilename(filename: string): string;
/**
 * Formats file size in human-readable format
 * @param bytes - Size in bytes
 * @param decimals - Decimal places
 * @returns Formatted size string
 * @example
 * const size = formatFileSize(1536000); // '1.46 MB'
 */
export declare function formatFileSize(bytes: number, decimals?: number): string;
/**
 * Checks attachment quota for user
 * @param userId - User ID
 * @param maxStorageBytes - Maximum storage allowed
 * @returns Quota information
 * @example
 * const quota = await checkAttachmentQuota('user-123', 1GB);
 */
export declare function checkAttachmentQuota(userId: string, maxStorageBytes: number): Promise<AttachmentQuota>;
/**
 * NestJS decorator for Swagger API documentation of file upload
 * @returns Swagger decorator
 * @example
 * @Post('upload')
 * @ApiFileUpload()
 * async uploadFile(@UploadedFile() file: Express.Multer.File) {}
 */
export declare function ApiFileUpload(): MethodDecorator;
/**
 * NestJS decorator for multiple file upload documentation
 * @param fieldName - Field name for files
 * @returns Swagger decorator
 * @example
 * @Post('upload-multiple')
 * @ApiMultipleFileUpload('attachments')
 * async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {}
 */
export declare function ApiMultipleFileUpload(fieldName?: string): MethodDecorator;
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
export declare function createFileUploadInterceptor(config: AttachmentUploadConfig): any;
/**
 * Creates NestJS multiple file upload interceptor
 * @param fieldName - Field name for files
 * @param config - Upload configuration
 * @returns Files interceptor
 * @example
 * const interceptor = createMultipleFileUploadInterceptor('attachments', config);
 */
export declare function createMultipleFileUploadInterceptor(fieldName: string, config: AttachmentUploadConfig): any;
declare const _default: {
    defineMailAttachmentModel: typeof defineMailAttachmentModel;
    MailAttachmentAttributes: ModelAttributes;
    MailAttachmentOptions: ModelOptions;
    validateAttachment: typeof validateAttachment;
    detectFileType: typeof detectFileType;
    isValidFilename: typeof isValidFilename;
    sanitizeFilename: typeof sanitizeFilename;
    uploadAttachment: typeof uploadAttachment;
    uploadMultipleAttachments: typeof uploadMultipleAttachments;
    generateUniqueFilename: typeof generateUniqueFilename;
    uploadToLocalStorage: typeof uploadToLocalStorage;
    uploadToS3: typeof uploadToS3;
    uploadToAzure: typeof uploadToAzure;
    downloadAttachment: typeof downloadAttachment;
    downloadFromLocalStorage: typeof downloadFromLocalStorage;
    downloadFromS3: typeof downloadFromS3;
    downloadFromAzure: typeof downloadFromAzure;
    generatePresignedDownloadUrl: typeof generatePresignedDownloadUrl;
    generateS3PresignedUrl: typeof generateS3PresignedUrl;
    generateAzurePresignedUrl: typeof generateAzurePresignedUrl;
    generateContentId: typeof generateContentId;
    embedInlineImages: typeof embedInlineImages;
    extractInlineImageReferences: typeof extractInlineImageReferences;
    convertCidToUrls: typeof convertCidToUrls;
    scanAttachmentForViruses: typeof scanAttachmentForViruses;
    quarantineAttachment: typeof quarantineAttachment;
    extractAttachmentMetadata: typeof extractAttachmentMetadata;
    extractImageMetadata: typeof extractImageMetadata;
    parseExifData: typeof parseExifData;
    extractPdfMetadata: typeof extractPdfMetadata;
    generateThumbnail: typeof generateThumbnail;
    generateMultipleThumbnails: typeof generateMultipleThumbnails;
    compressImage: typeof compressImage;
    compressFile: typeof compressFile;
    createAttachmentStream: typeof createAttachmentStream;
    createLocalFileStream: typeof createLocalFileStream;
    createS3Stream: typeof createS3Stream;
    createAzureStream: typeof createAzureStream;
    calculateChecksum: typeof calculateChecksum;
    isImageMimeType: typeof isImageMimeType;
    getExtensionFromMimeType: typeof getExtensionFromMimeType;
    getMimeTypeFromFilename: typeof getMimeTypeFromFilename;
    formatFileSize: typeof formatFileSize;
    checkAttachmentQuota: typeof checkAttachmentQuota;
    ApiFileUpload: typeof ApiFileUpload;
    ApiMultipleFileUpload: typeof ApiMultipleFileUpload;
    createFileUploadInterceptor: typeof createFileUploadInterceptor;
    createMultipleFileUploadInterceptor: typeof createMultipleFileUploadInterceptor;
};
export default _default;
//# sourceMappingURL=mail-attachment-handling-kit.d.ts.map