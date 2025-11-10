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
import { Sequelize } from 'sequelize';
import { Readable, Transform } from 'stream';
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
    sizes: Array<{
        width: number;
        height: number;
        suffix: string;
    }>;
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
    dimensions?: {
        width: number;
        height: number;
    };
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
    range?: {
        start: number;
        end: number;
    };
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
    uploadedChunks: string;
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
export declare const createFileModel: (sequelize: Sequelize) => any;
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
export declare const createFileMetadataModel: (sequelize: Sequelize) => any;
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
export declare const createUploadSessionModel: (sequelize: Sequelize) => any;
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
export declare const createMulterConfig: (config: FileUploadConfig) => any;
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
export declare const processUploadedFile: (file: UploadedFile, userId?: string) => Promise<Partial<FileAttributes>>;
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
export declare const handleMultipleUploads: (files: UploadedFile[], config?: FileUploadConfig) => Promise<Partial<FileAttributes>[]>;
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
export declare const validateFile: (file: UploadedFile, config?: FileUploadConfig) => Promise<FileValidationResult>;
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
export declare const detectMimeType: (file: UploadedFile | Buffer) => Promise<string | null>;
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
export declare const validateImageFile: (file: UploadedFile, constraints?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    aspectRatio?: number;
}) => Promise<FileValidationResult>;
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
export declare const initializeChunkedUpload: (filename: string, totalSize: number, chunkSize: number, userId?: string) => Promise<ChunkedUploadSession>;
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
export declare const uploadChunk: (sessionId: string, chunkIndex: number, chunkData: Buffer, tempDir?: string) => Promise<ChunkUploadResult>;
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
export declare const finalizeChunkedUpload: (sessionId: string, tempDir?: string) => Promise<string>;
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
export declare const validateChunk: (chunkData: Buffer, expectedHash: string) => boolean;
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
export declare const resizeImage: (input: Buffer | string, options: ImageProcessingOptions) => Promise<Buffer>;
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
export declare const cropImage: (input: Buffer | string, cropArea: {
    left: number;
    top: number;
    width: number;
    height: number;
}) => Promise<Buffer>;
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
export declare const generateThumbnails: (input: Buffer | string, options: ThumbnailOptions) => Promise<Map<string, Buffer>>;
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
export declare const optimizeImage: (input: Buffer | string, options?: {
    format?: "jpeg" | "png" | "webp" | "avif";
    quality?: number;
    maxWidth?: number;
    stripMetadata?: boolean;
}) => Promise<Buffer>;
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
export declare const createS3Client: (config: S3ClientConfig) => CloudStorageProvider;
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
export declare const uploadToS3: (client: CloudStorageProvider, file: Buffer | Readable, config: S3UploadConfig) => Promise<CloudStorageResult>;
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
export declare const downloadFromS3: (client: CloudStorageProvider, key: string) => Promise<Buffer>;
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
export declare const generateSignedUrl: (client: CloudStorageProvider, key: string, expiresIn?: number) => Promise<string>;
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
export declare const uploadMultipart: (client: CloudStorageProvider, stream: Readable, config: S3UploadConfig, partSize?: number) => Promise<CloudStorageResult>;
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
export declare const saveToLocalStorage: (data: Buffer, filename: string, options?: {
    baseDir?: string;
    useDate?: boolean;
    userId?: string;
}) => Promise<string>;
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
export declare const readFromLocalStorage: (filePath: string) => Promise<Buffer>;
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
export declare const deleteFromLocalStorage: (filePath: string) => Promise<boolean>;
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
export declare const moveFile: (sourcePath: string, destinationPath: string) => Promise<void>;
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
export declare const copyFile: (sourcePath: string, destinationPath: string) => Promise<void>;
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
export declare const extractFileMetadata: (file: Buffer | string, filename: string) => Promise<FileMetadata>;
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
export declare const extractExifData: (image: Buffer | string) => Promise<Record<string, any> | null>;
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
export declare const calculateFileHash: (file: Buffer | string) => Promise<string>;
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
export declare const extractImageDimensions: (image: Buffer | string) => Promise<{
    width: number;
    height: number;
} | null>;
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
export declare const scanFileForViruses: (file: Buffer | string) => Promise<VirusScanResult>;
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
export declare const validateAgainstMalwarePatterns: (fileBuffer: Buffer) => Promise<boolean>;
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
export declare const compressFile: (data: Buffer) => Promise<Buffer>;
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
export declare const decompressFile: (data: Buffer) => Promise<Buffer>;
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
export declare const createZipArchive: (entries: ArchiveEntry[], options?: CompressionOptions) => Promise<Buffer>;
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
export declare const extractZipArchive: (zipData: Buffer) => Promise<ArchiveEntry[]>;
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
export declare const createDownloadStream: (filePath: string, options?: StreamDownloadOptions) => Readable;
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
export declare const handleRangeRequest: (filePath: string, rangeHeader: string) => Promise<{
    stream: Readable;
    start: number;
    end: number;
    total: number;
}>;
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
export declare const createTransformStream: (transformer: (chunk: Buffer) => Buffer) => Transform;
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
export declare const cleanupExpiredFiles: (directory: string, maxAge: number) => Promise<number>;
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
export declare const cleanupOrphanedChunks: (directory: string, maxAge: number) => Promise<number>;
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
export declare const scheduleCleanupTask: (cleanupFn: () => Promise<void>, interval: number) => NodeJS.Timeout;
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
export declare const createFileVersion: (fileId: string, newContent: Buffer, comment?: string) => Promise<FileVersion>;
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
export declare const getFileVersion: (fileId: string, version: number) => Promise<Buffer>;
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
export declare const listFileVersions: (fileId: string) => Promise<FileVersion[]>;
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
export declare const restoreFileVersion: (fileId: string, version: number) => Promise<void>;
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
export declare const uploadToCDN: (file: Buffer, config: CDNUploadConfig) => Promise<string>;
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
export declare const invalidateCDNCache: (path: string, config: CDNUploadConfig) => Promise<void>;
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
export declare const checkFilePermission: (fileId: string, userId: string, permission: FilePermission) => Promise<boolean>;
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
export declare const grantFileAccess: (accessControl: FileAccessControl) => Promise<void>;
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
export declare const revokeFileAccess: (fileId: string, userId: string) => Promise<void>;
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
export declare const listFileAccessControls: (fileId: string) => Promise<FileAccessControl[]>;
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
export declare const validateFileAccessToken: (fileId: string, token: string) => Promise<boolean>;
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
export declare const generateFileAccessToken: (fileId: string, expiresIn?: number) => Promise<string>;
//# sourceMappingURL=file-storage-kit.d.ts.map