/**
 * LOC: FILESTO1234567
 * File: /reuse/file-storage-kit-v2.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS file upload services
 *   - S3 storage providers
 *   - Azure Blob storage services
 *   - GCS storage services
 *   - Image processing services
 */
import { Model, Sequelize } from 'sequelize';
interface FileMetadata {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path?: string;
    url?: string;
    key?: string;
    bucket?: string;
    etag?: string;
    uploadedBy?: string;
    uploadedAt: Date;
    metadata?: Record<string, any>;
}
interface S3Config {
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
    forcePathStyle?: boolean;
    signatureVersion?: string;
}
interface AzureBlobConfig {
    accountName: string;
    accountKey: string;
    containerName: string;
    endpoint?: string;
}
interface GCSConfig {
    projectId: string;
    bucketName: string;
    keyFilename?: string;
    credentials?: any;
}
interface PresignedUrlConfig {
    key: string;
    expiresIn: number;
    contentType?: string;
    contentDisposition?: string;
}
interface MultipartUploadConfig {
    key: string;
    contentType?: string;
    partSize?: number;
    queueSize?: number;
    metadata?: Record<string, string>;
}
interface ImageProcessingConfig {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
    quality?: number;
    watermark?: {
        path: string;
        position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
        opacity?: number;
    };
}
interface FileValidationConfig {
    maxSize: number;
    allowedMimeTypes: string[];
    allowedExtensions: string[];
    scanVirus?: boolean;
    validateContent?: boolean;
}
interface ThumbnailConfig {
    sizes: Array<{
        width: number;
        height: number;
        name: string;
    }>;
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
}
interface FileEncryptionConfig {
    algorithm: string;
    key: Buffer;
    iv?: Buffer;
}
/**
 * Sequelize model for File Metadata with storage location and access tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FileMetadata model
 *
 * @example
 * const FileMetadata = defineFileMetadataModel(sequelize);
 * await FileMetadata.create({
 *   filename: 'document.pdf',
 *   mimeType: 'application/pdf',
 *   size: 1024000,
 *   storageType: 's3',
 *   storageKey: 'uploads/2024/doc.pdf'
 * });
 */
export declare function defineFileMetadataModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Multipart Upload tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MultipartUpload model
 *
 * @example
 * const MultipartUpload = defineMultipartUploadModel(sequelize);
 * await MultipartUpload.create({
 *   uploadId: 'abc123',
 *   key: 'uploads/large-file.zip',
 *   storageType: 's3',
 *   totalParts: 10
 * });
 */
export declare function defineMultipartUploadModel(sequelize: Sequelize): typeof Model;
/**
 * Zod schema for file upload validation.
 */
export declare const fileUploadSchema: any;
/**
 * Zod schema for S3 configuration validation.
 */
export declare const s3ConfigSchema: any;
/**
 * Zod schema for presigned URL configuration.
 */
export declare const presignedUrlSchema: any;
/**
 * Zod schema for image processing configuration.
 */
export declare const imageProcessingSchema: any;
/**
 * Zod schema for file validation configuration.
 */
export declare const fileValidationSchema: any;
/**
 * Creates AWS S3 client with configuration.
 *
 * @param {S3Config} config - S3 configuration
 * @returns {Promise<any>} S3 client
 *
 * @example
 * const s3 = await createS3Client({
 *   region: 'us-east-1',
 *   bucket: 'my-bucket',
 *   accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
 *   secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
 * });
 */
export declare function createS3Client(config: S3Config): Promise<any>;
/**
 * Uploads file to S3 with metadata.
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket name
 * @param {string} key - S3 object key
 * @param {Buffer} buffer - File buffer
 * @param {Record<string, string>} metadata - File metadata
 * @returns {Promise<FileMetadata>} Upload result
 *
 * @example
 * const result = await uploadToS3(s3, 'my-bucket', 'uploads/file.pdf', buffer, {
 *   'Content-Type': 'application/pdf'
 * });
 */
export declare function uploadToS3(s3Client: any, bucket: string, key: string, buffer: Buffer, metadata?: Record<string, string>): Promise<FileMetadata>;
/**
 * Downloads file from S3.
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket name
 * @param {string} key - S3 object key
 * @returns {Promise<Buffer>} File buffer
 *
 * @example
 * const buffer = await downloadFromS3(s3, 'my-bucket', 'uploads/file.pdf');
 */
export declare function downloadFromS3(s3Client: any, bucket: string, key: string): Promise<Buffer>;
/**
 * Generates presigned URL for S3 object (upload or download).
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket name
 * @param {PresignedUrlConfig} config - Presigned URL configuration
 * @param {'getObject' | 'putObject'} operation - Operation type
 * @returns {Promise<string>} Presigned URL
 *
 * @example
 * const url = await generatePresignedUrl(s3, 'my-bucket', {
 *   key: 'uploads/file.pdf',
 *   expiresIn: 3600
 * }, 'getObject');
 */
export declare function generatePresignedUrl(s3Client: any, bucket: string, config: PresignedUrlConfig, operation?: 'getObject' | 'putObject'): Promise<string>;
/**
 * Deletes file from S3.
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket name
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await deleteFromS3(s3, 'my-bucket', 'uploads/file.pdf');
 */
export declare function deleteFromS3(s3Client: any, bucket: string, key: string): Promise<boolean>;
/**
 * Creates Azure Blob Storage client.
 *
 * @param {AzureBlobConfig} config - Azure Blob configuration
 * @returns {Promise<any>} Azure Blob client
 *
 * @example
 * const azureClient = await createAzureBlobClient({
 *   accountName: 'myaccount',
 *   accountKey: 'key',
 *   containerName: 'uploads'
 * });
 */
export declare function createAzureBlobClient(config: AzureBlobConfig): Promise<any>;
/**
 * Uploads file to Azure Blob Storage.
 *
 * @param {any} containerClient - Azure container client
 * @param {string} blobName - Blob name
 * @param {Buffer} buffer - File buffer
 * @param {Record<string, string>} metadata - File metadata
 * @returns {Promise<FileMetadata>} Upload result
 *
 * @example
 * const result = await uploadToAzure(container, 'uploads/file.pdf', buffer, {});
 */
export declare function uploadToAzure(containerClient: any, blobName: string, buffer: Buffer, metadata?: Record<string, string>): Promise<FileMetadata>;
/**
 * Downloads file from Azure Blob Storage.
 *
 * @param {any} containerClient - Azure container client
 * @param {string} blobName - Blob name
 * @returns {Promise<Buffer>} File buffer
 *
 * @example
 * const buffer = await downloadFromAzure(container, 'uploads/file.pdf');
 */
export declare function downloadFromAzure(containerClient: any, blobName: string): Promise<Buffer>;
/**
 * Generates SAS token for Azure Blob.
 *
 * @param {any} containerClient - Azure container client
 * @param {string} blobName - Blob name
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {Promise<string>} SAS URL
 *
 * @example
 * const url = await generateAzureSasUrl(container, 'uploads/file.pdf', 3600);
 */
export declare function generateAzureSasUrl(containerClient: any, blobName: string, expiresIn: number): Promise<string>;
/**
 * Creates Google Cloud Storage client.
 *
 * @param {GCSConfig} config - GCS configuration
 * @returns {Promise<any>} GCS bucket
 *
 * @example
 * const bucket = await createGCSClient({
 *   projectId: 'my-project',
 *   bucketName: 'my-bucket',
 *   keyFilename: '/path/to/key.json'
 * });
 */
export declare function createGCSClient(config: GCSConfig): Promise<any>;
/**
 * Uploads file to Google Cloud Storage.
 *
 * @param {any} bucket - GCS bucket
 * @param {string} filename - File name/path
 * @param {Buffer} buffer - File buffer
 * @param {Record<string, string>} metadata - File metadata
 * @returns {Promise<FileMetadata>} Upload result
 *
 * @example
 * const result = await uploadToGCS(bucket, 'uploads/file.pdf', buffer, {});
 */
export declare function uploadToGCS(bucket: any, filename: string, buffer: Buffer, metadata?: Record<string, string>): Promise<FileMetadata>;
/**
 * Downloads file from Google Cloud Storage.
 *
 * @param {any} bucket - GCS bucket
 * @param {string} filename - File name/path
 * @returns {Promise<Buffer>} File buffer
 *
 * @example
 * const buffer = await downloadFromGCS(bucket, 'uploads/file.pdf');
 */
export declare function downloadFromGCS(bucket: any, filename: string): Promise<Buffer>;
/**
 * Generates signed URL for GCS object.
 *
 * @param {any} bucket - GCS bucket
 * @param {string} filename - File name/path
 * @param {number} expiresIn - Expiration time in seconds
 * @param {'read' | 'write'} action - Action type
 * @returns {Promise<string>} Signed URL
 *
 * @example
 * const url = await generateGCSSignedUrl(bucket, 'uploads/file.pdf', 3600, 'read');
 */
export declare function generateGCSSignedUrl(bucket: any, filename: string, expiresIn: number, action?: 'read' | 'write'): Promise<string>;
/**
 * Saves file to local filesystem with directory creation.
 *
 * @param {string} basePath - Base storage path
 * @param {string} filename - File name
 * @param {Buffer} buffer - File buffer
 * @returns {Promise<FileMetadata>} Save result
 *
 * @example
 * const result = await saveToLocalStorage('/uploads', 'file.pdf', buffer);
 */
export declare function saveToLocalStorage(basePath: string, filename: string, buffer: Buffer): Promise<FileMetadata>;
/**
 * Reads file from local filesystem.
 *
 * @param {string} filePath - Full file path
 * @returns {Promise<Buffer>} File buffer
 *
 * @example
 * const buffer = await readFromLocalStorage('/uploads/file.pdf');
 */
export declare function readFromLocalStorage(filePath: string): Promise<Buffer>;
/**
 * Deletes file from local filesystem.
 *
 * @param {string} filePath - Full file path
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await deleteFromLocalStorage('/uploads/file.pdf');
 */
export declare function deleteFromLocalStorage(filePath: string): Promise<boolean>;
/**
 * Initiates multipart upload to S3.
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket
 * @param {MultipartUploadConfig} config - Upload configuration
 * @returns {Promise<string>} Upload ID
 *
 * @example
 * const uploadId = await initiateMultipartUpload(s3, 'bucket', {
 *   key: 'large-file.zip'
 * });
 */
export declare function initiateMultipartUpload(s3Client: any, bucket: string, config: MultipartUploadConfig): Promise<string>;
/**
 * Uploads part in multipart upload.
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket
 * @param {string} key - S3 object key
 * @param {string} uploadId - Upload ID
 * @param {number} partNumber - Part number
 * @param {Buffer} buffer - Part buffer
 * @returns {Promise<{ETag: string, PartNumber: number}>} Part result
 *
 * @example
 * const part = await uploadPart(s3, 'bucket', 'key', uploadId, 1, buffer);
 */
export declare function uploadPart(s3Client: any, bucket: string, key: string, uploadId: string, partNumber: number, buffer: Buffer): Promise<{
    ETag: string;
    PartNumber: number;
}>;
/**
 * Completes multipart upload.
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket
 * @param {string} key - S3 object key
 * @param {string} uploadId - Upload ID
 * @param {Array<{ETag: string, PartNumber: number}>} parts - Uploaded parts
 * @returns {Promise<FileMetadata>} Upload result
 *
 * @example
 * const result = await completeMultipartUpload(s3, 'bucket', 'key', uploadId, parts);
 */
export declare function completeMultipartUpload(s3Client: any, bucket: string, key: string, uploadId: string, parts: Array<{
    ETag: string;
    PartNumber: number;
}>): Promise<FileMetadata>;
/**
 * Aborts multipart upload.
 *
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket
 * @param {string} key - S3 object key
 * @param {string} uploadId - Upload ID
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await abortMultipartUpload(s3, 'bucket', 'key', uploadId);
 */
export declare function abortMultipartUpload(s3Client: any, bucket: string, key: string, uploadId: string): Promise<boolean>;
/**
 * Validates file size and type.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - File MIME type
 * @param {string} filename - File name
 * @param {FileValidationConfig} config - Validation configuration
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateFile(buffer, 'application/pdf', 'doc.pdf', {
 *   maxSize: 10485760,
 *   allowedMimeTypes: ['application/pdf'],
 *   allowedExtensions: ['.pdf']
 * });
 */
export declare function validateFile(buffer: Buffer, mimeType: string, filename: string, config: FileValidationConfig): boolean;
/**
 * Validates file content (magic bytes).
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} expectedMimeType - Expected MIME type
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateFileContent(buffer, 'application/pdf');
 */
export declare function validateFileContent(buffer: Buffer, expectedMimeType: string): boolean;
/**
 * Calculates file checksum (SHA-256).
 *
 * @param {Buffer} buffer - File buffer
 * @returns {string} Checksum
 *
 * @example
 * const checksum = calculateFileChecksum(buffer);
 */
export declare function calculateFileChecksum(buffer: Buffer): string;
/**
 * Validates file checksum.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} expectedChecksum - Expected checksum
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateFileChecksum(buffer, 'abc123...');
 */
export declare function validateFileChecksum(buffer: Buffer, expectedChecksum: string): boolean;
/**
 * Resizes image with Sharp.
 *
 * @param {Buffer} buffer - Image buffer
 * @param {ImageProcessingConfig} config - Processing configuration
 * @returns {Promise<Buffer>} Processed image buffer
 *
 * @example
 * const resized = await resizeImage(buffer, { width: 800, height: 600, fit: 'cover' });
 */
export declare function resizeImage(buffer: Buffer, config: ImageProcessingConfig): Promise<Buffer>;
/**
 * Generates image thumbnails.
 *
 * @param {Buffer} buffer - Image buffer
 * @param {ThumbnailConfig} config - Thumbnail configuration
 * @returns {Promise<Array<{name: string, buffer: Buffer}>>} Thumbnails
 *
 * @example
 * const thumbnails = await generateThumbnails(buffer, {
 *   sizes: [{ width: 100, height: 100, name: 'small' }]
 * });
 */
export declare function generateThumbnails(buffer: Buffer, config: ThumbnailConfig): Promise<Array<{
    name: string;
    buffer: Buffer;
}>>;
/**
 * Adds watermark to image.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {Buffer} watermarkBuffer - Watermark buffer
 * @param {string} position - Watermark position
 * @param {number} opacity - Watermark opacity (0-1)
 * @returns {Promise<Buffer>} Watermarked image
 *
 * @example
 * const watermarked = await addWatermark(image, watermark, 'bottom-right', 0.5);
 */
export declare function addWatermark(imageBuffer: Buffer, watermarkBuffer: Buffer, position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center', opacity?: number): Promise<Buffer>;
/**
 * Extracts image metadata.
 *
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<Record<string, any>>} Image metadata
 *
 * @example
 * const metadata = await extractImageMetadata(buffer);
 */
export declare function extractImageMetadata(buffer: Buffer): Promise<Record<string, any>>;
/**
 * Optimizes image for web (compression, format conversion).
 *
 * @param {Buffer} buffer - Image buffer
 * @param {number} quality - Quality (1-100)
 * @returns {Promise<Buffer>} Optimized image
 *
 * @example
 * const optimized = await optimizeImage(buffer, 80);
 */
export declare function optimizeImage(buffer: Buffer, quality?: number): Promise<Buffer>;
/**
 * Encrypts file with AES-256-GCM.
 *
 * @param {Buffer} buffer - File buffer
 * @param {FileEncryptionConfig} config - Encryption configuration
 * @returns {Promise<{encrypted: Buffer, iv: Buffer, authTag: Buffer}>} Encrypted data
 *
 * @example
 * const result = await encryptFile(buffer, {
 *   algorithm: 'aes-256-gcm',
 *   key: Buffer.from('...')
 * });
 */
export declare function encryptFile(buffer: Buffer, config: FileEncryptionConfig): Promise<{
    encrypted: Buffer;
    iv: Buffer;
    authTag: Buffer;
}>;
/**
 * Decrypts file with AES-256-GCM.
 *
 * @param {Buffer} encryptedBuffer - Encrypted file buffer
 * @param {FileEncryptionConfig} config - Decryption configuration
 * @param {Buffer} iv - Initialization vector
 * @param {Buffer} authTag - Authentication tag
 * @returns {Promise<Buffer>} Decrypted buffer
 *
 * @example
 * const decrypted = await decryptFile(encrypted, config, iv, authTag);
 */
export declare function decryptFile(encryptedBuffer: Buffer, config: FileEncryptionConfig, iv: Buffer, authTag: Buffer): Promise<Buffer>;
/**
 * Generates encryption key from password.
 *
 * @param {string} password - Password
 * @param {string} salt - Salt
 * @returns {Promise<Buffer>} Encryption key
 *
 * @example
 * const key = await generateEncryptionKey('password', 'salt');
 */
export declare function generateEncryptionKey(password: string, salt: string): Promise<Buffer>;
/**
 * Sets file expiration and schedules deletion.
 *
 * @param {typeof Model} fileModel - File metadata model
 * @param {string} fileId - File ID
 * @param {Date} expiresAt - Expiration date
 * @returns {Promise<void>}
 *
 * @example
 * await setFileExpiration(FileMetadata, 'file-id', new Date('2024-12-31'));
 */
export declare function setFileExpiration(fileModel: typeof Model, fileId: string, expiresAt: Date): Promise<void>;
/**
 * Cleans up expired files.
 *
 * @param {typeof Model} fileModel - File metadata model
 * @param {(file: any) => Promise<void>} deleteFn - Delete function
 * @returns {Promise<number>} Number of deleted files
 *
 * @example
 * const deleted = await cleanupExpiredFiles(FileMetadata, async (file) => {
 *   await deleteFromS3(s3, bucket, file.storageKey);
 * });
 */
export declare function cleanupExpiredFiles(fileModel: typeof Model, deleteFn: (file: any) => Promise<void>): Promise<number>;
/**
 * Archives old files to cold storage.
 *
 * @param {typeof Model} fileModel - File metadata model
 * @param {any} s3Client - S3 client
 * @param {string} bucket - S3 bucket
 * @param {number} daysOld - Archive files older than this
 * @returns {Promise<number>} Number of archived files
 *
 * @example
 * const archived = await archiveOldFiles(FileMetadata, s3, 'bucket', 90);
 */
export declare function archiveOldFiles(fileModel: typeof Model, s3Client: any, bucket: string, daysOld: number): Promise<number>;
/**
 * NestJS Injectable File Storage Service with multi-cloud support.
 *
 * @example
 * @Injectable()
 * export class DocumentService {
 *   constructor(private storageService: FileStorageService) {}
 *
 *   async uploadDocument(file: Express.Multer.File) {
 *     return this.storageService.upload(file.buffer, file.originalname);
 *   }
 * }
 */
export declare class FileStorageService {
    private s3Client;
    private bucket;
    constructor(s3Client?: any, bucket?: string);
    upload(buffer: Buffer, filename: string, metadata?: Record<string, string>): Promise<FileMetadata>;
    download(key: string): Promise<Buffer>;
    delete(key: string): Promise<boolean>;
    getPresignedUrl(key: string, expiresIn?: number): Promise<string>;
}
export {};
//# sourceMappingURL=file-storage-kit-v2.d.ts.map