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
import { S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
/**
 * @enum FileStorageProvider
 * @description Supported cloud storage providers
 */
export declare enum FileStorageProvider {
    S3 = "S3",
    MINIO = "MINIO",
    GCS = "GCS",
    AZURE = "AZURE",
    LOCAL = "LOCAL"
}
/**
 * @enum FileCategory
 * @description Categories of files for organization
 */
export declare enum FileCategory {
    MEDICAL_RECORD = "MEDICAL_RECORD",
    PATIENT_IMAGE = "PATIENT_IMAGE",
    LAB_RESULT = "LAB_RESULT",
    PRESCRIPTION = "PRESCRIPTION",
    CONSENT_FORM = "CONSENT_FORM",
    INSURANCE = "INSURANCE",
    REPORT = "REPORT",
    AVATAR = "AVATAR",
    DOCUMENT = "DOCUMENT",
    OTHER = "OTHER"
}
/**
 * @enum ImageFormat
 * @description Supported image formats
 */
export declare enum ImageFormat {
    JPEG = "jpeg",
    PNG = "png",
    WEBP = "webp",
    AVIF = "avif",
    GIF = "gif",
    TIFF = "tiff"
}
/**
 * @enum CompressionFormat
 * @description Supported compression formats
 */
export declare enum CompressionFormat {
    GZIP = "gzip",
    BROTLI = "brotli",
    ZIP = "zip",
    DEFLATE = "deflate"
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
    dimensions?: {
        width: number;
        height: number;
    };
    duration?: number;
    pageCount?: number;
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
    margin?: number | {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
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
    parts: Array<{
        partNumber: number;
        etag: string;
    }>;
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
    expiresIn?: number;
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
    level?: number;
    includeMetadata?: boolean;
}
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
export declare const uploadToS3: (s3Client: S3Client, options: S3UploadOptions) => Promise<{
    key: string;
    bucket: string;
    etag?: string;
    versionId?: string;
}>;
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
export declare const downloadFromS3: (s3Client: S3Client, options: S3DownloadOptions) => Promise<Buffer>;
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
export declare const deleteFromS3: (s3Client: S3Client, bucket: string, key: string, versionId?: string) => Promise<boolean>;
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
export declare const fileExistsInS3: (s3Client: S3Client, bucket: string, key: string) => Promise<boolean>;
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
export declare const getS3FileMetadata: (s3Client: S3Client, bucket: string, key: string) => Promise<FileMetadata>;
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
export declare const copyS3File: (s3Client: S3Client, sourceBucket: string, sourceKey: string, destBucket: string, destKey: string) => Promise<boolean>;
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
export declare const saveToLocalStorage: (data: Buffer, filepath: string, options?: {
    mode?: number;
    flag?: string;
}) => Promise<string>;
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
export declare const readFromLocalStorage: (filepath: string) => Promise<Buffer>;
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
export declare const deleteFromLocalStorage: (filepath: string) => Promise<boolean>;
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
export declare const getLocalFileMetadata: (filepath: string) => Promise<FileMetadata>;
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
export declare const validateFileUpload: (fileBuffer: Buffer, mimeType: string, options?: FileValidationOptions) => Promise<FileValidationResult>;
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
export declare const sanitizeFilename: (filename: string) => string;
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
export declare const generateUniqueFilename: (originalFilename: string, prefix?: string) => string;
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
export declare const validateFileExtension: (filename: string, allowedExtensions: string[]) => boolean;
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
export declare const calculateFileHash: (fileBuffer: Buffer, algorithm?: string) => string;
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
export declare const checkStorageQuota: (fileSize: number, currentUsage: number, quota: number) => boolean;
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
export declare const resizeImage: (imageBuffer: Buffer, options: ImageProcessingOptions) => Promise<Buffer>;
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
export declare const cropImage: (imageBuffer: Buffer, options: CropOptions) => Promise<Buffer>;
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
export declare const optimizeImage: (imageBuffer: Buffer, options?: {
    quality?: number;
    format?: ImageFormat;
}) => Promise<Buffer>;
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
export declare const addWatermark: (imageBuffer: Buffer, options: WatermarkOptions) => Promise<Buffer>;
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
export declare const getImageDimensions: (imageBuffer: Buffer) => Promise<{
    width: number;
    height: number;
}>;
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
export declare const generateThumbnail: (imageBuffer: Buffer, options?: ThumbnailOptions) => Promise<Buffer>;
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
export declare const generateMultipleThumbnails: (imageBuffer: Buffer, sizes: Array<{
    name: string;
    width: number;
    height: number;
}>) => Promise<Map<string, Buffer>>;
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
export declare const generatePDFThumbnail: (pdfBuffer: Buffer, options?: ThumbnailOptions) => Promise<Buffer>;
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
export declare const generatePDF: (options: PDFGenerationOptions) => Promise<Buffer>;
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
export declare const mergePDFs: (pdfBuffers: Buffer[]) => Promise<Buffer>;
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
export declare const extractPDFText: (pdfBuffer: Buffer) => Promise<string>;
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
export declare const getPDFMetadata: (pdfBuffer: Buffer) => Promise<{
    pageCount: number;
    metadata: Record<string, any>;
}>;
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
export declare const parseCSV: (csvData: Buffer | string, options?: CSVParseOptions) => Promise<any[]>;
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
export declare const generateCSV: (data: any[], options?: CSVGenerateOptions) => string;
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
export declare const streamCSVImport: (stream: Readable, options: CSVParseOptions, processor: (record: any) => Promise<void>) => Promise<{
    processed: number;
    errors: number;
}>;
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
export declare const exportToCSVStream: (data: any[], options: CSVGenerateOptions) => Readable;
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
export declare const chunkFile: (fileBuffer: Buffer, chunkSize?: number) => Buffer[];
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
export declare const uploadFileInChunks: (fileBuffer: Buffer, uploadChunk: (chunk: Buffer, index: number) => Promise<void>, options?: ChunkUploadOptions) => Promise<void>;
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
export declare const reassembleChunks: (chunks: Buffer[]) => Buffer;
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
export declare const initiateMultipartUpload: (s3Client: S3Client, bucket: string, key: string, contentType?: string) => Promise<string>;
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
export declare const uploadPart: (s3Client: S3Client, bucket: string, key: string, uploadId: string, partNumber: number, data: Buffer) => Promise<string>;
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
export declare const completeMultipartUpload: (s3Client: S3Client, bucket: string, key: string, uploadId: string, parts: Array<{
    partNumber: number;
    etag: string;
}>) => Promise<boolean>;
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
export declare const abortMultipartUpload: (s3Client: S3Client, bucket: string, key: string, uploadId: string) => Promise<boolean>;
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
export declare const multipartUploadToS3: (s3Client: S3Client, bucket: string, key: string, fileBuffer: Buffer, options?: ChunkUploadOptions) => Promise<void>;
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
export declare const scanFileForViruses: (fileBuffer: Buffer, options?: {
    clamHost?: string;
    clamPort?: number;
}) => Promise<VirusScanResult>;
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
export declare const scanS3FileForViruses: (s3Client: S3Client, bucket: string, key: string) => Promise<VirusScanResult>;
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
export declare const quarantineFile: (s3Client: S3Client, bucket: string, key: string, quarantineBucket: string) => Promise<boolean>;
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
export declare const extractEXIFMetadata: (imageBuffer: Buffer) => Promise<Record<string, any>>;
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
export declare const extractAudioMetadata: (audioBuffer: Buffer) => Promise<Record<string, any>>;
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
export declare const extractVideoMetadata: (videoBuffer: Buffer) => Promise<Record<string, any>>;
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
export declare const extractFileMetadata: (fileBuffer: Buffer, filename: string) => Promise<FileMetadata>;
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
export declare const compressFile: (fileBuffer: Buffer, level?: number) => Promise<Buffer>;
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
export declare const decompressFile: (compressedBuffer: Buffer) => Promise<Buffer>;
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
export declare const compressFileBrotli: (fileBuffer: Buffer, quality?: number) => Promise<Buffer>;
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
export declare const createZipArchive: (files: Map<string, Buffer>) => Promise<Buffer>;
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
export declare const generatePresignedDownloadUrl: (s3Client: S3Client, bucket: string, key: string, options?: PresignedUrlOptions) => Promise<string>;
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
export declare const generatePresignedUploadUrl: (s3Client: S3Client, bucket: string, key: string, options?: PresignedUrlOptions) => Promise<string>;
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
export declare const generateBatchPresignedUrls: (s3Client: S3Client, bucket: string, keys: string[], options?: PresignedUrlOptions) => Promise<Map<string, string>>;
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
export declare const encryptFile: (fileBuffer: Buffer, options?: FileEncryptionOptions) => EncryptedFileResult;
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
export declare const decryptFile: (encryptedBuffer: Buffer, key: Buffer, iv: Buffer, authTag?: Buffer, algorithm?: string) => Buffer;
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
export declare const encryptAndUploadToS3: (s3Client: S3Client, uploadOptions: S3UploadOptions, encryptionOptions?: FileEncryptionOptions) => Promise<{
    key: string;
    bucket: string;
    encryptionKey: Buffer;
    iv: Buffer;
}>;
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
export declare const downloadAndDecryptFromS3: (s3Client: S3Client, bucket: string, key: string, encryptionKey: Buffer, iv: Buffer) => Promise<Buffer>;
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
export declare const detectMimeType: (fileBuffer: Buffer) => Promise<string>;
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
export declare const validateMimeTypeExtension: (filename: string, mimeType: string) => boolean;
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
export declare const getExtensionFromMimeType: (mimeType: string) => string;
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
export declare const streamToBuffer: (stream: Readable) => Promise<Buffer>;
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
export declare const formatFileSize: (bytes: number, decimals?: number) => string;
//# sourceMappingURL=file-storage-processing-kit.d.ts.map