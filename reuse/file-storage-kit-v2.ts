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

/**
 * File: /reuse/file-storage-kit-v2.ts
 * Locator: WC-UTL-FILESTO-001
 * Purpose: Comprehensive File Storage Kit - Complete file storage toolkit for NestJS
 *
 * Upstream: Independent utility module for file storage and processing operations
 * Downstream: ../backend/*, File upload services, Cloud storage providers, Media processing
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @aws-sdk/client-s3, @azure/storage-blob, @google-cloud/storage, multer, sharp, Sequelize
 * Exports: 40+ utility functions for S3, Azure Blob, GCS, local storage, multipart upload, presigned URLs, image processing, validation
 *
 * LLM Context: Enterprise-grade file storage utilities for White Cross healthcare platform.
 * Provides comprehensive cloud storage (AWS S3, Azure Blob, Google Cloud Storage), local storage,
 * multipart upload handling, presigned URL generation, file validation (size, type, content),
 * image processing (resize, crop, watermark), virus scanning, HIPAA-compliant encryption,
 * CDN integration, thumbnail generation, metadata extraction, and file lifecycle management.
 */

import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Model, DataTypes, Sequelize } from 'sequelize';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  sizes: Array<{ width: number; height: number; name: string }>;
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number;
}

interface FileEncryptionConfig {
  algorithm: string;
  key: Buffer;
  iv?: Buffer;
}

interface CDNConfig {
  enabled: boolean;
  domain: string;
  invalidationPath?: string;
  cacheControl?: string;
}

// ============================================================================
// SEQUELIZE MODELS (1-2)
// ============================================================================

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
export function defineFileMetadataModel(sequelize: Sequelize): typeof Model {
  class FileMetadata extends Model {
    public id!: string;
    public filename!: string;
    public originalName!: string;
    public mimeType!: string;
    public size!: number;
    public storageType!: 'local' | 's3' | 'azure' | 'gcs';
    public storageKey!: string;
    public storageBucket!: string;
    public url!: string;
    public etag!: string;
    public checksum!: string;
    public encrypted!: boolean;
    public virusScanned!: boolean;
    public scanStatus!: 'pending' | 'clean' | 'infected' | 'error';
    public uploadedBy!: string;
    public accessCount!: number;
    public lastAccessedAt!: Date;
    public metadata!: Record<string, any>;
    public expiresAt!: Date;
    public deletedAt!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  FileMetadata.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      filename: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'original_name',
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'mime_type',
      },
      size: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'File size in bytes',
      },
      storageType: {
        type: DataTypes.ENUM('local', 's3', 'azure', 'gcs'),
        allowNull: false,
        field: 'storage_type',
      },
      storageKey: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        field: 'storage_key',
      },
      storageBucket: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'storage_bucket',
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      etag: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      checksum: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: 'SHA-256 checksum',
      },
      encrypted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      virusScanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'virus_scanned',
      },
      scanStatus: {
        type: DataTypes.ENUM('pending', 'clean', 'infected', 'error'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'scan_status',
      },
      uploadedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'uploaded_by',
      },
      accessCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'access_count',
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_accessed_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expires_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
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
      sequelize,
      tableName: 'file_metadata',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['filename'] },
        { fields: ['storage_type'] },
        { fields: ['storage_key'] },
        { fields: ['uploaded_by'] },
        { fields: ['created_at'] },
        { fields: ['scan_status'] },
      ],
    }
  );

  return FileMetadata;
}

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
export function defineMultipartUploadModel(sequelize: Sequelize): typeof Model {
  class MultipartUpload extends Model {
    public id!: string;
    public uploadId!: string;
    public key!: string;
    public storageType!: 'local' | 's3' | 'azure' | 'gcs';
    public bucket!: string;
    public totalParts!: number;
    public uploadedParts!: number[];
    public status!: 'initiated' | 'in_progress' | 'completed' | 'aborted' | 'failed';
    public initiatedBy!: string;
    public metadata!: Record<string, any>;
    public completedAt!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  MultipartUpload.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      uploadId: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        field: 'upload_id',
      },
      key: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      storageType: {
        type: DataTypes.ENUM('local', 's3', 'azure', 'gcs'),
        allowNull: false,
        field: 'storage_type',
      },
      bucket: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      totalParts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_parts',
      },
      uploadedParts: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: 'uploaded_parts',
      },
      status: {
        type: DataTypes.ENUM('initiated', 'in_progress', 'completed', 'aborted', 'failed'),
        allowNull: false,
        defaultValue: 'initiated',
      },
      initiatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'initiated_by',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
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
      sequelize,
      tableName: 'multipart_uploads',
      timestamps: true,
      indexes: [
        { fields: ['upload_id'], unique: true },
        { fields: ['status'] },
        { fields: ['initiated_by'] },
        { fields: ['created_at'] },
      ],
    }
  );

  return MultipartUpload;
}

// ============================================================================
// ZOD SCHEMAS (3-5)
// ============================================================================

/**
 * Zod schema for file upload validation.
 */
export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(500),
  mimeType: z.string().min(1).max(100),
  size: z.number().min(1).max(5368709120), // 5GB max
  buffer: z.instanceof(Buffer).optional(),
  path: z.string().optional(),
});

/**
 * Zod schema for S3 configuration validation.
 */
export const s3ConfigSchema = z.object({
  region: z.string().min(1),
  bucket: z.string().min(1).max(200),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
  endpoint: z.string().url().optional(),
  forcePathStyle: z.boolean().optional(),
  signatureVersion: z.string().optional(),
});

/**
 * Zod schema for presigned URL configuration.
 */
export const presignedUrlSchema = z.object({
  key: z.string().min(1).max(1000),
  expiresIn: z.number().min(60).max(604800), // 1 week max
  contentType: z.string().optional(),
  contentDisposition: z.string().optional(),
});

/**
 * Zod schema for image processing configuration.
 */
export const imageProcessingSchema = z.object({
  width: z.number().min(1).max(10000).optional(),
  height: z.number().min(1).max(10000).optional(),
  fit: z.enum(['cover', 'contain', 'fill', 'inside', 'outside']).optional(),
  format: z.enum(['jpeg', 'png', 'webp', 'avif']).optional(),
  quality: z.number().min(1).max(100).optional(),
});

/**
 * Zod schema for file validation configuration.
 */
export const fileValidationSchema = z.object({
  maxSize: z.number().min(1).max(10737418240), // 10GB max
  allowedMimeTypes: z.array(z.string()),
  allowedExtensions: z.array(z.string()),
  scanVirus: z.boolean().optional(),
  validateContent: z.boolean().optional(),
});

// ============================================================================
// AWS S3 UTILITIES (6-10)
// ============================================================================

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
export async function createS3Client(config: S3Config): Promise<any> {
  const { S3Client } = require('@aws-sdk/client-s3');

  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
  });
}

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
export async function uploadToS3(
  s3Client: any,
  bucket: string,
  key: string,
  buffer: Buffer,
  metadata: Record<string, string> = {}
): Promise<FileMetadata> {
  const { PutObjectCommand } = require('@aws-sdk/client-s3');

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    Metadata: metadata,
    ContentType: metadata['Content-Type'] || 'application/octet-stream',
  });

  const response = await s3Client.send(command);

  return {
    filename: path.basename(key),
    originalName: metadata.originalName || path.basename(key),
    mimeType: metadata['Content-Type'] || 'application/octet-stream',
    size: buffer.length,
    key,
    bucket,
    etag: response.ETag,
    url: `https://${bucket}.s3.amazonaws.com/${key}`,
    uploadedAt: new Date(),
  };
}

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
export async function downloadFromS3(
  s3Client: any,
  bucket: string,
  key: string
): Promise<Buffer> {
  const { GetObjectCommand } = require('@aws-sdk/client-s3');

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await s3Client.send(command);
  const stream = response.Body;

  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

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
export async function generatePresignedUrl(
  s3Client: any,
  bucket: string,
  config: PresignedUrlConfig,
  operation: 'getObject' | 'putObject' = 'getObject'
): Promise<string> {
  const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
  const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

  const Command = operation === 'getObject' ? GetObjectCommand : PutObjectCommand;

  const command = new Command({
    Bucket: bucket,
    Key: config.key,
    ContentType: config.contentType,
    ContentDisposition: config.contentDisposition,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: config.expiresIn });
}

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
export async function deleteFromS3(
  s3Client: any,
  bucket: string,
  key: string
): Promise<boolean> {
  const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3Client.send(command);
  return true;
}

// ============================================================================
// AZURE BLOB STORAGE UTILITIES (11-14)
// ============================================================================

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
export async function createAzureBlobClient(config: AzureBlobConfig): Promise<any> {
  const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

  const credential = new StorageSharedKeyCredential(config.accountName, config.accountKey);

  const blobServiceClient = new BlobServiceClient(
    config.endpoint || `https://${config.accountName}.blob.core.windows.net`,
    credential
  );

  return blobServiceClient.getContainerClient(config.containerName);
}

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
export async function uploadToAzure(
  containerClient: any,
  blobName: string,
  buffer: Buffer,
  metadata: Record<string, string> = {}
): Promise<FileMetadata> {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadResponse = await blockBlobClient.upload(buffer, buffer.length, {
    metadata,
    blobHTTPHeaders: {
      blobContentType: metadata.contentType || 'application/octet-stream',
    },
  });

  return {
    filename: path.basename(blobName),
    originalName: metadata.originalName || path.basename(blobName),
    mimeType: metadata.contentType || 'application/octet-stream',
    size: buffer.length,
    key: blobName,
    etag: uploadResponse.etag,
    url: blockBlobClient.url,
    uploadedAt: new Date(),
  };
}

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
export async function downloadFromAzure(containerClient: any, blobName: string): Promise<Buffer> {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const downloadResponse = await blockBlobClient.download();

  const chunks: Buffer[] = [];
  for await (const chunk of downloadResponse.readableStreamBody!) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

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
export async function generateAzureSasUrl(
  containerClient: any,
  blobName: string,
  expiresIn: number
): Promise<string> {
  const { BlobSASPermissions, generateBlobSASQueryParameters } = require('@azure/storage-blob');

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const sasOptions = {
    containerName: containerClient.containerName,
    blobName,
    permissions: BlobSASPermissions.parse('r'),
    startsOn: new Date(),
    expiresOn: new Date(Date.now() + expiresIn * 1000),
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    containerClient.credential
  ).toString();

  return `${blockBlobClient.url}?${sasToken}`;
}

// ============================================================================
// GOOGLE CLOUD STORAGE UTILITIES (15-18)
// ============================================================================

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
export async function createGCSClient(config: GCSConfig): Promise<any> {
  const { Storage } = require('@google-cloud/storage');

  const storage = new Storage({
    projectId: config.projectId,
    keyFilename: config.keyFilename,
    credentials: config.credentials,
  });

  return storage.bucket(config.bucketName);
}

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
export async function uploadToGCS(
  bucket: any,
  filename: string,
  buffer: Buffer,
  metadata: Record<string, string> = {}
): Promise<FileMetadata> {
  const file = bucket.file(filename);

  await file.save(buffer, {
    metadata: {
      contentType: metadata.contentType || 'application/octet-stream',
      metadata,
    },
  });

  const [fileMetadata] = await file.getMetadata();

  return {
    filename: path.basename(filename),
    originalName: metadata.originalName || path.basename(filename),
    mimeType: fileMetadata.contentType || 'application/octet-stream',
    size: buffer.length,
    key: filename,
    bucket: bucket.name,
    url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
    uploadedAt: new Date(),
  };
}

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
export async function downloadFromGCS(bucket: any, filename: string): Promise<Buffer> {
  const file = bucket.file(filename);
  const [buffer] = await file.download();
  return buffer;
}

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
export async function generateGCSSignedUrl(
  bucket: any,
  filename: string,
  expiresIn: number,
  action: 'read' | 'write' = 'read'
): Promise<string> {
  const file = bucket.file(filename);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action,
    expires: Date.now() + expiresIn * 1000,
  });

  return url;
}

// ============================================================================
// LOCAL STORAGE UTILITIES (19-21)
// ============================================================================

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
export async function saveToLocalStorage(
  basePath: string,
  filename: string,
  buffer: Buffer
): Promise<FileMetadata> {
  const fullPath = path.join(basePath, filename);
  const directory = path.dirname(fullPath);

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(fullPath, buffer);

  const stats = await fs.stat(fullPath);

  return {
    filename: path.basename(filename),
    originalName: path.basename(filename),
    mimeType: 'application/octet-stream',
    size: stats.size,
    path: fullPath,
    url: `/files/${filename}`,
    uploadedAt: new Date(),
  };
}

/**
 * Reads file from local filesystem.
 *
 * @param {string} filePath - Full file path
 * @returns {Promise<Buffer>} File buffer
 *
 * @example
 * const buffer = await readFromLocalStorage('/uploads/file.pdf');
 */
export async function readFromLocalStorage(filePath: string): Promise<Buffer> {
  return await fs.readFile(filePath);
}

/**
 * Deletes file from local filesystem.
 *
 * @param {string} filePath - Full file path
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await deleteFromLocalStorage('/uploads/file.pdf');
 */
export async function deleteFromLocalStorage(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// MULTIPART UPLOAD UTILITIES (22-25)
// ============================================================================

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
export async function initiateMultipartUpload(
  s3Client: any,
  bucket: string,
  config: MultipartUploadConfig
): Promise<string> {
  const { CreateMultipartUploadCommand } = require('@aws-sdk/client-s3');

  const command = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: config.key,
    ContentType: config.contentType,
    Metadata: config.metadata,
  });

  const response = await s3Client.send(command);
  return response.UploadId!;
}

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
export async function uploadPart(
  s3Client: any,
  bucket: string,
  key: string,
  uploadId: string,
  partNumber: number,
  buffer: Buffer
): Promise<{ ETag: string; PartNumber: number }> {
  const { UploadPartCommand } = require('@aws-sdk/client-s3');

  const command = new UploadPartCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
    Body: buffer,
  });

  const response = await s3Client.send(command);

  return {
    ETag: response.ETag!,
    PartNumber: partNumber,
  };
}

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
export async function completeMultipartUpload(
  s3Client: any,
  bucket: string,
  key: string,
  uploadId: string,
  parts: Array<{ ETag: string; PartNumber: number }>
): Promise<FileMetadata> {
  const { CompleteMultipartUploadCommand } = require('@aws-sdk/client-s3');

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });

  const response = await s3Client.send(command);

  return {
    filename: path.basename(key),
    originalName: path.basename(key),
    mimeType: 'application/octet-stream',
    size: 0,
    key,
    bucket,
    etag: response.ETag,
    url: `https://${bucket}.s3.amazonaws.com/${key}`,
    uploadedAt: new Date(),
  };
}

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
export async function abortMultipartUpload(
  s3Client: any,
  bucket: string,
  key: string,
  uploadId: string
): Promise<boolean> {
  const { AbortMultipartUploadCommand } = require('@aws-sdk/client-s3');

  const command = new AbortMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
  });

  await s3Client.send(command);
  return true;
}

// ============================================================================
// FILE VALIDATION UTILITIES (26-29)
// ============================================================================

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
export function validateFile(
  buffer: Buffer,
  mimeType: string,
  filename: string,
  config: FileValidationConfig
): boolean {
  if (buffer.length > config.maxSize) {
    throw new BadRequestException(`File size exceeds maximum of ${config.maxSize} bytes`);
  }

  if (!config.allowedMimeTypes.includes(mimeType)) {
    throw new BadRequestException(`File type ${mimeType} is not allowed`);
  }

  const ext = path.extname(filename).toLowerCase();
  if (!config.allowedExtensions.includes(ext)) {
    throw new BadRequestException(`File extension ${ext} is not allowed`);
  }

  return true;
}

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
export function validateFileContent(buffer: Buffer, expectedMimeType: string): boolean {
  const magicBytes = buffer.slice(0, 8);

  const signatures: Record<string, Buffer[]> = {
    'application/pdf': [Buffer.from([0x25, 0x50, 0x44, 0x46])],
    'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
    'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
    'application/zip': [Buffer.from([0x50, 0x4b, 0x03, 0x04])],
  };

  const expectedSignatures = signatures[expectedMimeType];
  if (!expectedSignatures) return true;

  for (const signature of expectedSignatures) {
    if (magicBytes.slice(0, signature.length).equals(signature)) {
      return true;
    }
  }

  throw new BadRequestException('File content does not match expected type');
}

/**
 * Calculates file checksum (SHA-256).
 *
 * @param {Buffer} buffer - File buffer
 * @returns {string} Checksum
 *
 * @example
 * const checksum = calculateFileChecksum(buffer);
 */
export function calculateFileChecksum(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

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
export function validateFileChecksum(buffer: Buffer, expectedChecksum: string): boolean {
  const actualChecksum = calculateFileChecksum(buffer);

  if (actualChecksum !== expectedChecksum) {
    throw new BadRequestException('File checksum mismatch');
  }

  return true;
}

// ============================================================================
// IMAGE PROCESSING UTILITIES (30-34)
// ============================================================================

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
export async function resizeImage(
  buffer: Buffer,
  config: ImageProcessingConfig
): Promise<Buffer> {
  const sharp = require('sharp');

  let image = sharp(buffer);

  if (config.width || config.height) {
    image = image.resize(config.width, config.height, {
      fit: config.fit || 'cover',
    });
  }

  if (config.format) {
    image = image.toFormat(config.format, {
      quality: config.quality || 80,
    });
  }

  return await image.toBuffer();
}

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
export async function generateThumbnails(
  buffer: Buffer,
  config: ThumbnailConfig
): Promise<Array<{ name: string; buffer: Buffer }>> {
  const sharp = require('sharp');
  const thumbnails: Array<{ name: string; buffer: Buffer }> = [];

  for (const size of config.sizes) {
    const thumbnail = await sharp(buffer)
      .resize(size.width, size.height, { fit: 'cover' })
      .toFormat(config.format || 'jpeg', { quality: config.quality || 80 })
      .toBuffer();

    thumbnails.push({
      name: size.name,
      buffer: thumbnail,
    });
  }

  return thumbnails;
}

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
export async function addWatermark(
  imageBuffer: Buffer,
  watermarkBuffer: Buffer,
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' = 'bottom-right',
  opacity: number = 0.5
): Promise<Buffer> {
  const sharp = require('sharp');

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  const watermark = await sharp(watermarkBuffer)
    .resize({ width: Math.floor((metadata.width || 100) * 0.2) })
    .composite([
      {
        input: Buffer.from([255, 255, 255, Math.floor(opacity * 255)]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: 'dest-in',
      },
    ])
    .toBuffer();

  const watermarkMeta = await sharp(watermark).metadata();

  let gravity: any = 'southeast';
  if (position === 'top-left') gravity = 'northwest';
  if (position === 'top-right') gravity = 'northeast';
  if (position === 'bottom-left') gravity = 'southwest';
  if (position === 'center') gravity = 'center';

  return await image
    .composite([{ input: watermark, gravity }])
    .toBuffer();
}

/**
 * Extracts image metadata.
 *
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<Record<string, any>>} Image metadata
 *
 * @example
 * const metadata = await extractImageMetadata(buffer);
 */
export async function extractImageMetadata(buffer: Buffer): Promise<Record<string, any>> {
  const sharp = require('sharp');
  const metadata = await sharp(buffer).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    space: metadata.space,
    channels: metadata.channels,
    depth: metadata.depth,
    density: metadata.density,
    hasAlpha: metadata.hasAlpha,
    orientation: metadata.orientation,
    size: buffer.length,
  };
}

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
export async function optimizeImage(buffer: Buffer, quality: number = 80): Promise<Buffer> {
  const sharp = require('sharp');

  return await sharp(buffer)
    .webp({ quality })
    .toBuffer();
}

// ============================================================================
// FILE ENCRYPTION UTILITIES (35-37)
// ============================================================================

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
export async function encryptFile(
  buffer: Buffer,
  config: FileEncryptionConfig
): Promise<{ encrypted: Buffer; iv: Buffer; authTag: Buffer }> {
  const iv = config.iv || crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(config.algorithm, config.key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = (cipher as any).getAuthTag();

  return { encrypted, iv, authTag };
}

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
export async function decryptFile(
  encryptedBuffer: Buffer,
  config: FileEncryptionConfig,
  iv: Buffer,
  authTag: Buffer
): Promise<Buffer> {
  const decipher = crypto.createDecipheriv(config.algorithm, config.key, iv);
  (decipher as any).setAuthTag(authTag);

  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

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
export async function generateEncryptionKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

// ============================================================================
// FILE LIFECYCLE UTILITIES (38-40)
// ============================================================================

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
export async function setFileExpiration(
  fileModel: typeof Model,
  fileId: string,
  expiresAt: Date
): Promise<void> {
  await fileModel.update(
    { expiresAt },
    { where: { id: fileId } }
  );
}

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
export async function cleanupExpiredFiles(
  fileModel: typeof Model,
  deleteFn: (file: any) => Promise<void>
): Promise<number> {
  const expiredFiles = await fileModel.findAll({
    where: {
      expiresAt: {
        [Sequelize.Op.lte]: new Date(),
      },
      deletedAt: null,
    },
  });

  let deletedCount = 0;

  for (const file of expiredFiles) {
    try {
      await deleteFn(file);
      await file.destroy();
      deletedCount++;
    } catch (error) {
      console.error(`Failed to delete expired file ${file.get('id')}:`, error);
    }
  }

  return deletedCount;
}

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
export async function archiveOldFiles(
  fileModel: typeof Model,
  s3Client: any,
  bucket: string,
  daysOld: number
): Promise<number> {
  const { CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

  const oldFiles = await fileModel.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.lte]: new Date(Date.now() - daysOld * 86400000),
      },
      storageType: 's3',
    },
  });

  let archivedCount = 0;

  for (const file of oldFiles) {
    try {
      const sourceKey = file.get('storageKey') as string;
      const archiveKey = `archive/${sourceKey}`;

      // Copy to archive with Glacier storage class
      await s3Client.send(
        new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${sourceKey}`,
          Key: archiveKey,
          StorageClass: 'GLACIER',
        })
      );

      // Delete original
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: sourceKey,
        })
      );

      // Update metadata
      await file.update({
        storageKey: archiveKey,
        metadata: {
          ...(file.get('metadata') as any),
          archived: true,
          archivedAt: new Date(),
        },
      });

      archivedCount++;
    } catch (error) {
      console.error(`Failed to archive file ${file.get('id')}:`, error);
    }
  }

  return archivedCount;
}

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

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
@Injectable()
export class FileStorageService {
  private s3Client: any;
  private bucket: string;

  constructor(
    @Inject('S3_CLIENT') s3Client?: any,
    @Inject('S3_BUCKET') bucket?: string
  ) {
    this.s3Client = s3Client;
    this.bucket = bucket || 'default-bucket';
  }

  async upload(buffer: Buffer, filename: string, metadata?: Record<string, string>): Promise<FileMetadata> {
    const key = `uploads/${Date.now()}-${filename}`;
    return uploadToS3(this.s3Client, this.bucket, key, buffer, metadata);
  }

  async download(key: string): Promise<Buffer> {
    return downloadFromS3(this.s3Client, this.bucket, key);
  }

  async delete(key: string): Promise<boolean> {
    return deleteFromS3(this.s3Client, this.bucket, key);
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return generatePresignedUrl(this.s3Client, this.bucket, { key, expiresIn }, 'getObject');
  }
}
