/**
 * LOC: DOC-CLOUD-001
 * File: /reuse/document/document-cloud-storage-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @aws-sdk/client-s3
 *   - @azure/storage-blob
 *   - @google-cloud/storage
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *   - stream (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Document storage controllers
 *   - Cloud storage services
 *   - Multi-cloud sync modules
 *   - Document backup services
 */
/**
 * File: /reuse/document/document-cloud-storage-kit.ts
 * Locator: WC-UTL-DOCCLOUD-001
 * Purpose: Multi-Cloud Document Storage Kit - S3, Azure Blob, GCS, multi-cloud sync, intelligent tiering, cloud-to-cloud migration
 *
 * Upstream: @nestjs/common, @aws-sdk/client-s3, @azure/storage-blob, @google-cloud/storage, sequelize, crypto, stream
 * Downstream: Storage controllers, cloud services, sync modules, backup handlers, migration services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, AWS SDK v3, Azure Storage 12.x, GCS 7.x
 * Exports: 42 utility functions for AWS S3, Azure Blob, GCS, multi-cloud sync, intelligent tiering, cloud migration
 *
 * LLM Context: Production-grade multi-cloud storage utilities for White Cross healthcare platform.
 * Provides AWS S3 integration, Azure Blob Storage, Google Cloud Storage, multi-cloud synchronization,
 * intelligent storage tiering, lifecycle management, cloud-to-cloud migration, storage analytics,
 * versioning, encryption, access control, and compliance tracking. Essential for secure, distributed
 * medical document storage across multiple cloud providers with automatic failover and cost optimization.
 */
import { Sequelize, Transaction } from 'sequelize';
import { Readable } from 'stream';
/**
 * Cloud storage provider types
 */
export type CloudProvider = 'AWS_S3' | 'AZURE_BLOB' | 'GOOGLE_CLOUD_STORAGE' | 'MULTI_CLOUD';
/**
 * Storage class tiers
 */
export type StorageTier = 'HOT' | 'COOL' | 'ARCHIVE' | 'INTELLIGENT' | 'GLACIER' | 'DEEP_ARCHIVE' | 'PREMIUM' | 'STANDARD';
/**
 * Sync status types
 */
export type SyncStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CONFLICT';
/**
 * Migration status types
 */
export type MigrationStatus = 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
/**
 * Access control level
 */
export type AccessLevel = 'PRIVATE' | 'PUBLIC_READ' | 'PUBLIC_READ_WRITE' | 'AUTHENTICATED_READ';
/**
 * AWS S3 configuration
 */
export interface S3Config {
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
    useAccelerateEndpoint?: boolean;
    signatureVersion?: string;
    s3ForcePathStyle?: boolean;
    sseAlgorithm?: 'AES256' | 'aws:kms';
    kmsKeyId?: string;
}
/**
 * Azure Blob Storage configuration
 */
export interface AzureBlobConfig {
    accountName: string;
    accountKey?: string;
    containerName: string;
    connectionString?: string;
    sasToken?: string;
    blobEndpoint?: string;
    defaultServiceVersion?: string;
}
/**
 * Google Cloud Storage configuration
 */
export interface GCSConfig {
    projectId: string;
    bucketName: string;
    keyFilename?: string;
    credentials?: {
        client_email: string;
        private_key: string;
    };
    location?: string;
    storageClass?: string;
}
/**
 * Multi-cloud storage configuration
 */
export interface MultiCloudConfig {
    primary: CloudProvider;
    replicationTargets?: CloudProvider[];
    s3Config?: S3Config;
    azureConfig?: AzureBlobConfig;
    gcsConfig?: GCSConfig;
    autoSync?: boolean;
    conflictResolution?: 'SOURCE_WINS' | 'DESTINATION_WINS' | 'LATEST_WINS' | 'MANUAL';
}
/**
 * Storage object metadata
 */
export interface StorageObjectMetadata {
    key: string;
    size: number;
    contentType: string;
    etag: string;
    lastModified: Date;
    storageClass?: StorageTier;
    versionId?: string;
    encryption?: string;
    metadata?: Record<string, string>;
    tags?: Record<string, string>;
    owner?: string;
}
/**
 * Upload options
 */
export interface UploadOptions {
    contentType?: string;
    metadata?: Record<string, string>;
    tags?: Record<string, string>;
    storageClass?: StorageTier;
    encryption?: boolean;
    kmsKeyId?: string;
    acl?: AccessLevel;
    cacheControl?: string;
    expires?: Date;
    serverSideEncryption?: string;
}
/**
 * Download options
 */
export interface DownloadOptions {
    versionId?: string;
    range?: string;
    ifMatch?: string;
    ifNoneMatch?: string;
    ifModifiedSince?: Date;
    ifUnmodifiedSince?: Date;
}
/**
 * Multi-part upload session
 */
export interface MultiPartUploadSession {
    uploadId: string;
    provider: CloudProvider;
    bucketName: string;
    key: string;
    parts: Array<{
        partNumber: number;
        etag: string;
        size: number;
    }>;
    createdAt: Date;
    expiresAt: Date;
}
/**
 * Storage analytics data
 */
export interface StorageAnalytics {
    provider: CloudProvider;
    bucket: string;
    totalObjects: number;
    totalSize: number;
    sizeByStorageClass: Record<StorageTier, number>;
    costEstimate: {
        storage: number;
        requests: number;
        dataTransfer: number;
        total: number;
        currency: string;
    };
    accessPatterns: {
        hotObjects: number;
        warmObjects: number;
        coldObjects: number;
    };
    period: {
        start: Date;
        end: Date;
    };
}
/**
 * Lifecycle policy rule
 */
export interface LifecycleRule {
    id: string;
    enabled: boolean;
    prefix?: string;
    tags?: Record<string, string>;
    transitions?: Array<{
        days: number;
        storageClass: StorageTier;
    }>;
    expiration?: {
        days?: number;
        date?: Date;
        expiredObjectDeleteMarker?: boolean;
    };
    noncurrentVersionTransitions?: Array<{
        noncurrentDays: number;
        storageClass: StorageTier;
    }>;
    noncurrentVersionExpiration?: {
        noncurrentDays: number;
    };
}
/**
 * Sync configuration
 */
export interface SyncConfig {
    sourceProvider: CloudProvider;
    destinationProvider: CloudProvider;
    sourceBucket: string;
    destinationBucket: string;
    prefix?: string;
    deleteOnSource?: boolean;
    bidirectional?: boolean;
    conflictResolution: 'SOURCE_WINS' | 'DESTINATION_WINS' | 'LATEST_WINS' | 'MANUAL';
    filters?: {
        includePatterns?: string[];
        excludePatterns?: string[];
        minSize?: number;
        maxSize?: number;
        modifiedAfter?: Date;
        modifiedBefore?: Date;
    };
}
/**
 * Sync result
 */
export interface SyncResult {
    syncId: string;
    status: SyncStatus;
    itemsSynced: number;
    itemsSkipped: number;
    itemsFailed: number;
    bytesTransferred: number;
    duration: number;
    conflicts?: Array<{
        key: string;
        reason: string;
        resolution?: 'SOURCE' | 'DESTINATION' | 'PENDING';
    }>;
    errors?: Array<{
        key: string;
        error: string;
    }>;
    startedAt: Date;
    completedAt?: Date;
}
/**
 * Migration plan
 */
export interface MigrationPlan {
    id: string;
    name: string;
    sourceProvider: CloudProvider;
    destinationProvider: CloudProvider;
    sourceBucket: string;
    destinationBucket: string;
    estimatedObjects: number;
    estimatedSize: number;
    estimatedCost: number;
    estimatedDuration: number;
    batchSize: number;
    parallelThreads: number;
    verifyAfterMigration: boolean;
    deleteAfterMigration: boolean;
    status: MigrationStatus;
    scheduledAt?: Date;
}
/**
 * Migration progress
 */
export interface MigrationProgress {
    planId: string;
    status: MigrationStatus;
    objectsMigrated: number;
    objectsFailed: number;
    bytesMigrated: number;
    currentBatch: number;
    totalBatches: number;
    percentComplete: number;
    estimatedTimeRemaining: number;
    throughputBytesPerSecond: number;
    errors?: Array<{
        key: string;
        error: string;
        attemptCount: number;
    }>;
    startedAt: Date;
    lastUpdatedAt: Date;
    completedAt?: Date;
}
/**
 * Intelligent tiering recommendation
 */
export interface TieringRecommendation {
    objectKey: string;
    currentTier: StorageTier;
    recommendedTier: StorageTier;
    reason: string;
    potentialSavings: number;
    accessFrequency: {
        last30Days: number;
        last90Days: number;
        last365Days: number;
    };
    lastAccessed?: Date;
    confidence: number;
}
/**
 * Cloud storage event
 */
export interface CloudStorageEvent {
    eventId: string;
    provider: CloudProvider;
    eventType: 'OBJECT_CREATED' | 'OBJECT_DELETED' | 'OBJECT_MODIFIED' | 'BUCKET_CREATED' | 'BUCKET_DELETED' | 'LIFECYCLE_TRANSITION';
    bucketName: string;
    objectKey?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Replication configuration
 */
export interface ReplicationConfig {
    id: string;
    enabled: boolean;
    sourceProvider: CloudProvider;
    destinationProvider: CloudProvider;
    sourceBucket: string;
    destinationBucket: string;
    replicateDeletes?: boolean;
    replicateMetadata?: boolean;
    replicateEncryption?: boolean;
    storageClassOverride?: StorageTier;
    priority?: number;
}
/**
 * Cloud storage provider model attributes
 */
export interface CloudStorageProviderAttributes {
    id: string;
    name: string;
    provider: CloudProvider;
    region?: string;
    endpoint?: string;
    configuration: Record<string, any>;
    isActive: boolean;
    isPrimary: boolean;
    credentialsEncrypted: string;
    lastHealthCheck?: Date;
    healthStatus?: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
    quotaLimit?: number;
    quotaUsed?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Storage bucket model attributes
 */
export interface StorageBucketAttributes {
    id: string;
    providerId: string;
    bucketName: string;
    bucketRegion?: string;
    storageClass: StorageTier;
    versioning: boolean;
    encryption: boolean;
    encryptionKeyId?: string;
    lifecyclePolicies?: Record<string, any>[];
    accessControl: AccessLevel;
    totalObjects: number;
    totalSize: number;
    lastSyncedAt?: Date;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Storage sync model attributes
 */
export interface StorageSyncAttributes {
    id: string;
    name: string;
    sourceBucketId: string;
    destinationBucketId: string;
    syncDirection: 'UNIDIRECTIONAL' | 'BIDIRECTIONAL';
    status: SyncStatus;
    lastSyncAt?: Date;
    nextSyncAt?: Date;
    syncSchedule?: string;
    objectsSynced: number;
    bytesSynced: number;
    syncErrors?: Record<string, any>[];
    conflictResolution: string;
    filters?: Record<string, any>;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates CloudStorageProvider model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<CloudStorageProviderAttributes>>} CloudStorageProvider model
 *
 * @example
 * ```typescript
 * const ProviderModel = createCloudStorageProviderModel(sequelize);
 * const provider = await ProviderModel.create({
 *   name: 'Primary S3',
 *   provider: 'AWS_S3',
 *   region: 'us-east-1',
 *   configuration: { bucket: 'medical-docs' },
 *   credentialsEncrypted: encryptedCreds,
 *   isActive: true,
 *   isPrimary: true,
 *   createdBy: 'admin-uuid'
 * });
 * ```
 */
export declare const createCloudStorageProviderModel: (sequelize: Sequelize) => any;
/**
 * Creates StorageBucket model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<StorageBucketAttributes>>} StorageBucket model
 *
 * @example
 * ```typescript
 * const BucketModel = createStorageBucketModel(sequelize);
 * const bucket = await BucketModel.create({
 *   providerId: 'provider-uuid',
 *   bucketName: 'whitecross-medical-documents',
 *   storageClass: 'STANDARD',
 *   versioning: true,
 *   encryption: true,
 *   accessControl: 'PRIVATE',
 *   totalObjects: 0,
 *   totalSize: 0
 * });
 * ```
 */
export declare const createStorageBucketModel: (sequelize: Sequelize) => any;
/**
 * Creates StorageSync model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<StorageSyncAttributes>>} StorageSync model
 *
 * @example
 * ```typescript
 * const SyncModel = createStorageSyncModel(sequelize);
 * const sync = await SyncModel.create({
 *   name: 'S3 to Azure Backup',
 *   sourceBucketId: 's3-bucket-uuid',
 *   destinationBucketId: 'azure-bucket-uuid',
 *   syncDirection: 'UNIDIRECTIONAL',
 *   status: 'PENDING',
 *   conflictResolution: 'SOURCE_WINS',
 *   isActive: true,
 *   createdBy: 'admin-uuid'
 * });
 * ```
 */
export declare const createStorageSyncModel: (sequelize: Sequelize) => any;
/**
 * 1. Uploads file to AWS S3 bucket.
 *
 * @param {S3Config} config - S3 configuration
 * @param {string} key - Object key (path)
 * @param {Buffer | Readable} data - File data or stream
 * @param {UploadOptions} [options] - Upload options
 * @returns {Promise<StorageObjectMetadata>} Uploaded object metadata
 *
 * @example
 * ```typescript
 * const metadata = await uploadToS3(s3Config, 'documents/patient-123.pdf', fileBuffer, {
 *   contentType: 'application/pdf',
 *   storageClass: 'INTELLIGENT',
 *   encryption: true,
 *   metadata: { patientId: '123', documentType: 'medical-record' }
 * });
 * console.log('Uploaded:', metadata.key, 'Size:', metadata.size);
 * ```
 */
export declare const uploadToS3: (config: S3Config, key: string, data: Buffer | Readable, options?: UploadOptions) => Promise<StorageObjectMetadata>;
/**
 * 2. Downloads file from AWS S3 bucket.
 *
 * @param {S3Config} config - S3 configuration
 * @param {string} key - Object key
 * @param {DownloadOptions} [options] - Download options
 * @returns {Promise<{ data: Buffer; metadata: StorageObjectMetadata }>} File data and metadata
 *
 * @example
 * ```typescript
 * const { data, metadata } = await downloadFromS3(s3Config, 'documents/patient-123.pdf', {
 *   versionId: 'v1.0'
 * });
 * console.log('Downloaded:', metadata.size, 'bytes');
 * ```
 */
export declare const downloadFromS3: (config: S3Config, key: string, options?: DownloadOptions) => Promise<{
    data: Buffer;
    metadata: StorageObjectMetadata;
}>;
/**
 * 3. Lists objects in S3 bucket with advanced filtering.
 *
 * @param {S3Config} config - S3 configuration
 * @param {string} [prefix] - Object key prefix filter
 * @param {Object} [options] - List options
 * @returns {Promise<StorageObjectMetadata[]>} List of objects
 *
 * @example
 * ```typescript
 * const objects = await listS3Objects(s3Config, 'documents/2024/', {
 *   maxKeys: 1000,
 *   continuationToken: lastToken
 * });
 * objects.forEach(obj => console.log(obj.key, obj.size));
 * ```
 */
export declare const listS3Objects: (config: S3Config, prefix?: string, options?: {
    maxKeys?: number;
    continuationToken?: string;
}) => Promise<StorageObjectMetadata[]>;
/**
 * 4. Initiates multi-part upload to S3.
 *
 * @param {S3Config} config - S3 configuration
 * @param {string} key - Object key
 * @param {UploadOptions} [options] - Upload options
 * @returns {Promise<MultiPartUploadSession>} Upload session
 *
 * @example
 * ```typescript
 * const session = await initiateS3MultipartUpload(s3Config, 'large-file.zip', {
 *   storageClass: 'GLACIER',
 *   encryption: true
 * });
 * // Upload parts using session.uploadId
 * ```
 */
export declare const initiateS3MultipartUpload: (config: S3Config, key: string, options?: UploadOptions) => Promise<MultiPartUploadSession>;
/**
 * 5. Copies object within S3 or between S3 buckets.
 *
 * @param {S3Config} config - S3 configuration
 * @param {string} sourceKey - Source object key
 * @param {string} destinationKey - Destination object key
 * @param {string} [destinationBucket] - Destination bucket (if different)
 * @returns {Promise<StorageObjectMetadata>} Copied object metadata
 *
 * @example
 * ```typescript
 * const metadata = await copyS3Object(
 *   s3Config,
 *   'original/doc.pdf',
 *   'backup/doc.pdf',
 *   'backup-bucket'
 * );
 * ```
 */
export declare const copyS3Object: (config: S3Config, sourceKey: string, destinationKey: string, destinationBucket?: string) => Promise<StorageObjectMetadata>;
/**
 * 6. Generates pre-signed URL for S3 object access.
 *
 * @param {S3Config} config - S3 configuration
 * @param {string} key - Object key
 * @param {number} [expiresIn] - Expiration time in seconds (default: 3600)
 * @param {'getObject' | 'putObject'} [operation] - Operation type
 * @returns {Promise<string>} Pre-signed URL
 *
 * @example
 * ```typescript
 * const url = await generateS3PresignedUrl(s3Config, 'documents/patient-123.pdf', 900, 'getObject');
 * // Share URL with client for temporary download access
 * ```
 */
export declare const generateS3PresignedUrl: (config: S3Config, key: string, expiresIn?: number, operation?: "getObject" | "putObject") => Promise<string>;
/**
 * 7. Configures S3 bucket lifecycle policies.
 *
 * @param {S3Config} config - S3 configuration
 * @param {LifecycleRule[]} rules - Lifecycle rules
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureS3Lifecycle(s3Config, [
 *   {
 *     id: 'archive-old-documents',
 *     enabled: true,
 *     prefix: 'documents/',
 *     transitions: [
 *       { days: 30, storageClass: 'INTELLIGENT' },
 *       { days: 90, storageClass: 'GLACIER' }
 *     ],
 *     expiration: { days: 2555 } // 7 years
 *   }
 * ]);
 * ```
 */
export declare const configureS3Lifecycle: (config: S3Config, rules: LifecycleRule[]) => Promise<void>;
/**
 * 8. Uploads file to Azure Blob Storage.
 *
 * @param {AzureBlobConfig} config - Azure configuration
 * @param {string} blobName - Blob name (path)
 * @param {Buffer | Readable} data - File data or stream
 * @param {UploadOptions} [options] - Upload options
 * @returns {Promise<StorageObjectMetadata>} Uploaded blob metadata
 *
 * @example
 * ```typescript
 * const metadata = await uploadToAzureBlob(azureConfig, 'medical-records/patient-456.pdf', fileBuffer, {
 *   contentType: 'application/pdf',
 *   storageClass: 'COOL',
 *   metadata: { department: 'cardiology' }
 * });
 * ```
 */
export declare const uploadToAzureBlob: (config: AzureBlobConfig, blobName: string, data: Buffer | Readable, options?: UploadOptions) => Promise<StorageObjectMetadata>;
/**
 * 9. Downloads file from Azure Blob Storage.
 *
 * @param {AzureBlobConfig} config - Azure configuration
 * @param {string} blobName - Blob name
 * @param {DownloadOptions} [options] - Download options
 * @returns {Promise<{ data: Buffer; metadata: StorageObjectMetadata }>} Blob data and metadata
 *
 * @example
 * ```typescript
 * const { data, metadata } = await downloadFromAzureBlob(azureConfig, 'medical-records/patient-456.pdf');
 * await fs.writeFile('local-copy.pdf', data);
 * ```
 */
export declare const downloadFromAzureBlob: (config: AzureBlobConfig, blobName: string, options?: DownloadOptions) => Promise<{
    data: Buffer;
    metadata: StorageObjectMetadata;
}>;
/**
 * 10. Lists blobs in Azure container with pagination.
 *
 * @param {AzureBlobConfig} config - Azure configuration
 * @param {string} [prefix] - Blob name prefix filter
 * @param {Object} [options] - List options
 * @returns {Promise<StorageObjectMetadata[]>} List of blobs
 *
 * @example
 * ```typescript
 * const blobs = await listAzureBlobs(azureConfig, 'medical-records/2024/', {
 *   maxPageSize: 500
 * });
 * ```
 */
export declare const listAzureBlobs: (config: AzureBlobConfig, prefix?: string, options?: {
    maxPageSize?: number;
    marker?: string;
}) => Promise<StorageObjectMetadata[]>;
/**
 * 11. Sets Azure Blob access tier for cost optimization.
 *
 * @param {AzureBlobConfig} config - Azure configuration
 * @param {string} blobName - Blob name
 * @param {StorageTier} tier - Access tier (HOT, COOL, ARCHIVE)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setAzureBlobTier(azureConfig, 'old-records/2020/file.pdf', 'ARCHIVE');
 * console.log('Moved to archive tier for long-term storage');
 * ```
 */
export declare const setAzureBlobTier: (config: AzureBlobConfig, blobName: string, tier: StorageTier) => Promise<void>;
/**
 * 12. Creates Azure Blob snapshot for versioning.
 *
 * @param {AzureBlobConfig} config - Azure configuration
 * @param {string} blobName - Blob name
 * @param {Record<string, string>} [metadata] - Snapshot metadata
 * @returns {Promise<string>} Snapshot identifier
 *
 * @example
 * ```typescript
 * const snapshotId = await createAzureBlobSnapshot(azureConfig, 'important-document.pdf', {
 *   reason: 'pre-update-backup',
 *   timestamp: new Date().toISOString()
 * });
 * ```
 */
export declare const createAzureBlobSnapshot: (config: AzureBlobConfig, blobName: string, metadata?: Record<string, string>) => Promise<string>;
/**
 * 13. Generates Azure Blob SAS token for secure access.
 *
 * @param {AzureBlobConfig} config - Azure configuration
 * @param {string} blobName - Blob name
 * @param {number} [expiresIn] - Expiration in seconds (default: 3600)
 * @param {string[]} [permissions] - Permissions array (r, w, d, l)
 * @returns {Promise<string>} SAS URL
 *
 * @example
 * ```typescript
 * const sasUrl = await generateAzureSasToken(azureConfig, 'shared-document.pdf', 1800, ['r']);
 * // Share URL with limited-time read access
 * ```
 */
export declare const generateAzureSasToken: (config: AzureBlobConfig, blobName: string, expiresIn?: number, permissions?: string[]) => Promise<string>;
/**
 * 14. Configures Azure Blob lifecycle management.
 *
 * @param {AzureBlobConfig} config - Azure configuration
 * @param {LifecycleRule[]} rules - Lifecycle rules
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureAzureLifecycle(azureConfig, [
 *   {
 *     id: 'move-to-cool',
 *     enabled: true,
 *     prefix: 'archived/',
 *     transitions: [{ days: 30, storageClass: 'COOL' }]
 *   }
 * ]);
 * ```
 */
export declare const configureAzureLifecycle: (config: AzureBlobConfig, rules: LifecycleRule[]) => Promise<void>;
/**
 * 15. Uploads file to Google Cloud Storage.
 *
 * @param {GCSConfig} config - GCS configuration
 * @param {string} fileName - File name (path)
 * @param {Buffer | Readable} data - File data or stream
 * @param {UploadOptions} [options] - Upload options
 * @returns {Promise<StorageObjectMetadata>} Uploaded object metadata
 *
 * @example
 * ```typescript
 * const metadata = await uploadToGCS(gcsConfig, 'patient-records/789.pdf', fileBuffer, {
 *   contentType: 'application/pdf',
 *   storageClass: 'STANDARD',
 *   metadata: { patientId: '789' }
 * });
 * ```
 */
export declare const uploadToGCS: (config: GCSConfig, fileName: string, data: Buffer | Readable, options?: UploadOptions) => Promise<StorageObjectMetadata>;
/**
 * 16. Downloads file from Google Cloud Storage.
 *
 * @param {GCSConfig} config - GCS configuration
 * @param {string} fileName - File name
 * @param {DownloadOptions} [options] - Download options
 * @returns {Promise<{ data: Buffer; metadata: StorageObjectMetadata }>} File data and metadata
 *
 * @example
 * ```typescript
 * const { data, metadata } = await downloadFromGCS(gcsConfig, 'patient-records/789.pdf');
 * console.log('Downloaded:', metadata.size, 'bytes');
 * ```
 */
export declare const downloadFromGCS: (config: GCSConfig, fileName: string, options?: DownloadOptions) => Promise<{
    data: Buffer;
    metadata: StorageObjectMetadata;
}>;
/**
 * 17. Lists objects in GCS bucket with filtering.
 *
 * @param {GCSConfig} config - GCS configuration
 * @param {string} [prefix] - Object name prefix filter
 * @param {Object} [options] - List options
 * @returns {Promise<StorageObjectMetadata[]>} List of objects
 *
 * @example
 * ```typescript
 * const objects = await listGCSObjects(gcsConfig, 'patient-records/2024/', {
 *   maxResults: 1000
 * });
 * ```
 */
export declare const listGCSObjects: (config: GCSConfig, prefix?: string, options?: {
    maxResults?: number;
    pageToken?: string;
}) => Promise<StorageObjectMetadata[]>;
/**
 * 18. Moves object to different storage class in GCS.
 *
 * @param {GCSConfig} config - GCS configuration
 * @param {string} fileName - File name
 * @param {StorageTier} storageClass - New storage class
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await moveGCSObjectStorageClass(gcsConfig, 'old-file.pdf', 'ARCHIVE');
 * ```
 */
export declare const moveGCSObjectStorageClass: (config: GCSConfig, fileName: string, storageClass: StorageTier) => Promise<void>;
/**
 * 19. Creates object version in GCS.
 *
 * @param {GCSConfig} config - GCS configuration
 * @param {string} fileName - File name
 * @returns {Promise<string>} Version generation number
 *
 * @example
 * ```typescript
 * const version = await createGCSObjectVersion(gcsConfig, 'versioned-document.pdf');
 * console.log('Created version:', version);
 * ```
 */
export declare const createGCSObjectVersion: (config: GCSConfig, fileName: string) => Promise<string>;
/**
 * 20. Generates signed URL for GCS object access.
 *
 * @param {GCSConfig} config - GCS configuration
 * @param {string} fileName - File name
 * @param {number} [expiresIn] - Expiration in seconds (default: 3600)
 * @param {'read' | 'write'} [action] - Access action
 * @returns {Promise<string>} Signed URL
 *
 * @example
 * ```typescript
 * const url = await generateGCSSignedUrl(gcsConfig, 'share.pdf', 900, 'read');
 * ```
 */
export declare const generateGCSSignedUrl: (config: GCSConfig, fileName: string, expiresIn?: number, action?: "read" | "write") => Promise<string>;
/**
 * 21. Configures GCS bucket lifecycle policies.
 *
 * @param {GCSConfig} config - GCS configuration
 * @param {LifecycleRule[]} rules - Lifecycle rules
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureGCSLifecycle(gcsConfig, [
 *   {
 *     id: 'delete-old-temp-files',
 *     enabled: true,
 *     prefix: 'temp/',
 *     expiration: { days: 7 }
 *   }
 * ]);
 * ```
 */
export declare const configureGCSLifecycle: (config: GCSConfig, rules: LifecycleRule[]) => Promise<void>;
/**
 * 22. Synchronizes objects between two cloud providers.
 *
 * @param {SyncConfig} config - Sync configuration
 * @param {Sequelize} sequelize - Sequelize instance for tracking
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SyncResult>} Sync operation result
 *
 * @example
 * ```typescript
 * const result = await syncBetweenClouds({
 *   sourceProvider: 'AWS_S3',
 *   destinationProvider: 'AZURE_BLOB',
 *   sourceBucket: 's3-bucket',
 *   destinationBucket: 'azure-container',
 *   conflictResolution: 'LATEST_WINS',
 *   filters: { prefix: 'medical-records/' }
 * }, sequelize);
 * console.log('Synced:', result.itemsSynced, 'objects');
 * ```
 */
export declare const syncBetweenClouds: (config: SyncConfig, sequelize: Sequelize, transaction?: Transaction) => Promise<SyncResult>;
/**
 * 23. Detects and resolves sync conflicts.
 *
 * @param {string} sourceKey - Source object key
 * @param {StorageObjectMetadata} sourceMetadata - Source metadata
 * @param {StorageObjectMetadata} destMetadata - Destination metadata
 * @param {SyncConfig['conflictResolution']} strategy - Resolution strategy
 * @returns {Promise<'SOURCE' | 'DESTINATION' | 'SKIP'>} Resolution decision
 *
 * @example
 * ```typescript
 * const decision = await resolveSyncConflict(
 *   'document.pdf',
 *   sourceMetadata,
 *   destMetadata,
 *   'LATEST_WINS'
 * );
 * if (decision === 'SOURCE') {
 *   // Copy from source to destination
 * }
 * ```
 */
export declare const resolveSyncConflict: (sourceKey: string, sourceMetadata: StorageObjectMetadata, destMetadata: StorageObjectMetadata, strategy: SyncConfig["conflictResolution"]) => Promise<"SOURCE" | "DESTINATION" | "SKIP">;
/**
 * 24. Retrieves sync status with detailed metrics.
 *
 * @param {string} syncId - Sync identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SyncResult>} Current sync status
 *
 * @example
 * ```typescript
 * const StorageSyncModel = createStorageSyncModel(sequelize);
 * const status = await getSyncStatus('sync-uuid', sequelize);
 * console.log(`Progress: ${status.itemsSynced} synced, ${status.itemsFailed} failed`);
 * ```
 */
export declare const getSyncStatus: (syncId: string, sequelize: Sequelize) => Promise<SyncResult>;
/**
 * 25. Creates bidirectional sync between clouds.
 *
 * @param {SyncConfig} config - Sync configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ forward: SyncResult; reverse: SyncResult }>} Both sync results
 *
 * @example
 * ```typescript
 * const { forward, reverse } = await createBidirectionalSync({
 *   sourceProvider: 'AWS_S3',
 *   destinationProvider: 'GOOGLE_CLOUD_STORAGE',
 *   sourceBucket: 's3-bucket',
 *   destinationBucket: 'gcs-bucket',
 *   bidirectional: true,
 *   conflictResolution: 'LATEST_WINS'
 * }, sequelize);
 * ```
 */
export declare const createBidirectionalSync: (config: SyncConfig, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    forward: SyncResult;
    reverse: SyncResult;
}>;
/**
 * 26. Schedules automated sync jobs with cron.
 *
 * @param {string} syncId - Sync configuration ID
 * @param {string} cronSchedule - Cron expression
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await scheduleSync('sync-uuid', '0 2 * * *', sequelize); // Daily at 2 AM
 * ```
 */
export declare const scheduleSync: (syncId: string, cronSchedule: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
/**
 * 27. Validates sync integrity with checksums.
 *
 * @param {StorageObjectMetadata} sourceObject - Source object metadata
 * @param {StorageObjectMetadata} destObject - Destination object metadata
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSyncIntegrity(sourceMetadata, destMetadata);
 * if (!validation.valid) {
 *   console.error('Sync integrity issues:', validation.errors);
 * }
 * ```
 */
export declare const validateSyncIntegrity: (sourceObject: StorageObjectMetadata, destObject: StorageObjectMetadata) => Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * 28. Retrieves sync history and statistics.
 *
 * @param {string} syncId - Sync configuration ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} [options] - Query options
 * @returns {Promise<Array<{ timestamp: Date; status: SyncStatus; metrics: any }>>} Sync history
 *
 * @example
 * ```typescript
 * const StorageSyncModel = createStorageSyncModel(sequelize);
 * const history = await getSyncHistory('sync-uuid', sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   limit: 100
 * });
 * history.forEach(entry => console.log(entry.timestamp, entry.status));
 * ```
 */
export declare const getSyncHistory: (syncId: string, sequelize: Sequelize, options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}) => Promise<Array<{
    timestamp: Date;
    status: SyncStatus;
    metrics: any;
}>>;
/**
 * 29. Analyzes access patterns for tiering recommendations.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} bucketName - Bucket name
 * @param {number} analysisDays - Days to analyze (default: 90)
 * @returns {Promise<TieringRecommendation[]>} Tiering recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await analyzeAccessPatterns('AWS_S3', 'medical-docs', 90);
 * recommendations.forEach(rec => {
 *   console.log(`Move ${rec.objectKey} from ${rec.currentTier} to ${rec.recommendedTier}`);
 *   console.log(`Potential savings: $${rec.potentialSavings.toFixed(2)}`);
 * });
 * ```
 */
export declare const analyzeAccessPatterns: (provider: CloudProvider, bucketName: string, analysisDays?: number) => Promise<TieringRecommendation[]>;
/**
 * 30. Applies intelligent tiering policy automatically.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} bucketName - Bucket name
 * @param {TieringRecommendation[]} recommendations - Tiering recommendations
 * @returns {Promise<{ applied: number; failed: number; savedCost: number }>} Application result
 *
 * @example
 * ```typescript
 * const result = await applyIntelligentTiering('AWS_S3', 'medical-docs', recommendations);
 * console.log(`Applied ${result.applied} tier changes, estimated savings: $${result.savedCost}`);
 * ```
 */
export declare const applyIntelligentTiering: (provider: CloudProvider, bucketName: string, recommendations: TieringRecommendation[]) => Promise<{
    applied: number;
    failed: number;
    savedCost: number;
}>;
/**
 * 31. Calculates storage cost by tier.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {StorageTier} tier - Storage tier
 * @param {number} sizeGB - Size in gigabytes
 * @param {number} [requestCount] - Number of requests
 * @returns {Promise<number>} Estimated monthly cost in USD
 *
 * @example
 * ```typescript
 * const cost = await calculateStorageCost('AWS_S3', 'GLACIER', 1000, 500);
 * console.log(`Estimated cost for 1TB in Glacier: $${cost.toFixed(2)}/month`);
 * ```
 */
export declare const calculateStorageCost: (provider: CloudProvider, tier: StorageTier, sizeGB: number, requestCount?: number) => Promise<number>;
/**
 * 32. Generates cost optimization report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [providerId] - Filter by provider ID
 * @param {Date} [startDate] - Report start date
 * @param {Date} [endDate] - Report end date
 * @returns {Promise<StorageAnalytics>} Cost and usage analytics
 *
 * @example
 * ```typescript
 * const StorageBucketModel = createStorageBucketModel(sequelize);
 * const report = await generateCostReport(sequelize, 'provider-uuid',
 *   new Date('2024-01-01'), new Date('2024-01-31')
 * );
 * console.log(`Total cost: $${report.costEstimate.total.toFixed(2)}`);
 * ```
 */
export declare const generateCostReport: (sequelize: Sequelize, providerId?: string, startDate?: Date, endDate?: Date) => Promise<StorageAnalytics>;
/**
 * 33. Predicts future storage needs using ML.
 *
 * @param {string} bucketId - Bucket ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [forecastDays] - Days to forecast (default: 90)
 * @returns {Promise<{ date: Date; estimatedSize: number; estimatedCost: number }[]>} Predictions
 *
 * @example
 * ```typescript
 * const StorageBucketModel = createStorageBucketModel(sequelize);
 * const predictions = await predictStorageNeeds('bucket-uuid', sequelize, 90);
 * predictions.forEach(p => {
 *   console.log(`${p.date.toISOString()}: ${p.estimatedSize} bytes, $${p.estimatedCost}`);
 * });
 * ```
 */
export declare const predictStorageNeeds: (bucketId: string, sequelize: Sequelize, forecastDays?: number) => Promise<{
    date: Date;
    estimatedSize: number;
    estimatedCost: number;
}[]>;
/**
 * 34. Optimizes storage class distribution.
 *
 * @param {string} bucketId - Bucket ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [targetCostReduction] - Target cost reduction percentage
 * @returns {Promise<{ currentCost: number; optimizedCost: number; savings: number; changes: TieringRecommendation[] }>} Optimization plan
 *
 * @example
 * ```typescript
 * const plan = await optimizeStorageDistribution('bucket-uuid', sequelize, 20);
 * console.log(`Can reduce costs by ${plan.savings}% with ${plan.changes.length} tier changes`);
 * ```
 */
export declare const optimizeStorageDistribution: (bucketId: string, sequelize: Sequelize, targetCostReduction?: number) => Promise<{
    currentCost: number;
    optimizedCost: number;
    savings: number;
    changes: TieringRecommendation[];
}>;
/**
 * 35. Monitors and alerts on storage anomalies.
 *
 * @param {string} bucketId - Bucket ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Object} [thresholds] - Alert thresholds
 * @returns {Promise<Array<{ type: string; severity: string; message: string; metric: number }>>} Detected anomalies
 *
 * @example
 * ```typescript
 * const StorageBucketModel = createStorageBucketModel(sequelize);
 * const anomalies = await detectStorageAnomalies('bucket-uuid', sequelize, {
 *   sizeGrowthPercent: 50,
 *   costIncrease: 30
 * });
 * anomalies.forEach(a => console.log(`${a.severity}: ${a.message}`));
 * ```
 */
export declare const detectStorageAnomalies: (bucketId: string, sequelize: Sequelize, thresholds?: {
    sizeGrowthPercent?: number;
    costIncrease?: number;
    unusualAccessPattern?: boolean;
}) => Promise<Array<{
    type: string;
    severity: string;
    message: string;
    metric: number;
}>>;
/**
 * 36. Creates comprehensive migration plan.
 *
 * @param {Object} params - Migration parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MigrationPlan>} Migration plan
 *
 * @example
 * ```typescript
 * const plan = await createMigrationPlan({
 *   name: 'S3 to Azure Migration',
 *   sourceProvider: 'AWS_S3',
 *   destinationProvider: 'AZURE_BLOB',
 *   sourceBucket: 's3-medical-docs',
 *   destinationBucket: 'azure-medical-docs',
 *   verifyAfterMigration: true
 * }, sequelize);
 * console.log(`Estimated duration: ${plan.estimatedDuration} seconds`);
 * ```
 */
export declare const createMigrationPlan: (params: {
    name: string;
    sourceProvider: CloudProvider;
    destinationProvider: CloudProvider;
    sourceBucket: string;
    destinationBucket: string;
    verifyAfterMigration?: boolean;
    deleteAfterMigration?: boolean;
}, sequelize: Sequelize) => Promise<MigrationPlan>;
/**
 * 37. Executes cloud-to-cloud migration with progress tracking.
 *
 * @param {string} planId - Migration plan ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MigrationProgress>} Migration progress
 *
 * @example
 * ```typescript
 * const progress = await executeMigration('plan-uuid', sequelize);
 * console.log(`Progress: ${progress.percentComplete}%`);
 * console.log(`Migrated: ${progress.objectsMigrated} objects`);
 * ```
 */
export declare const executeMigration: (planId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<MigrationProgress>;
/**
 * 38. Monitors migration progress in real-time.
 *
 * @param {string} planId - Migration plan ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MigrationProgress>} Current migration status
 *
 * @example
 * ```typescript
 * const status = await getMigrationProgress('plan-uuid', sequelize);
 * console.log(`${status.percentComplete}% complete`);
 * console.log(`ETA: ${status.estimatedTimeRemaining} seconds`);
 * ```
 */
export declare const getMigrationProgress: (planId: string, sequelize: Sequelize) => Promise<MigrationProgress>;
/**
 * 39. Verifies migration integrity with checksums.
 *
 * @param {string} planId - Migration plan ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ verified: number; failed: number; details: Array<{ key: string; status: string }> }>} Verification results
 *
 * @example
 * ```typescript
 * const verification = await verifyMigrationIntegrity('plan-uuid', sequelize);
 * console.log(`Verified: ${verification.verified}, Failed: ${verification.failed}`);
 * ```
 */
export declare const verifyMigrationIntegrity: (planId: string, sequelize: Sequelize) => Promise<{
    verified: number;
    failed: number;
    details: Array<{
        key: string;
        status: string;
    }>;
}>;
/**
 * 40. Rolls back failed migration.
 *
 * @param {string} planId - Migration plan ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ rolledBack: number; failed: number }>} Rollback result
 *
 * @example
 * ```typescript
 * const result = await rollbackMigration('plan-uuid', sequelize);
 * console.log(`Rolled back ${result.rolledBack} objects`);
 * ```
 */
export declare const rollbackMigration: (planId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    rolledBack: number;
    failed: number;
}>;
/**
 * 41. Estimates migration cost and duration.
 *
 * @param {Object} params - Migration parameters
 * @returns {Promise<{ estimatedCost: number; estimatedDuration: number; bandwidth: number }>} Cost and time estimates
 *
 * @example
 * ```typescript
 * const estimate = await estimateMigrationCost({
 *   sourceProvider: 'AWS_S3',
 *   destinationProvider: 'GOOGLE_CLOUD_STORAGE',
 *   totalSize: 1099511627776, // 1 TB
 *   objectCount: 1000000
 * });
 * console.log(`Cost: $${estimate.estimatedCost}, Duration: ${estimate.estimatedDuration}h`);
 * ```
 */
export declare const estimateMigrationCost: (params: {
    sourceProvider: CloudProvider;
    destinationProvider: CloudProvider;
    totalSize: number;
    objectCount: number;
}) => Promise<{
    estimatedCost: number;
    estimatedDuration: number;
    bandwidth: number;
}>;
/**
 * 42. Generates post-migration audit report.
 *
 * @param {string} planId - Migration plan ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Audit report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateMigrationAuditReport('plan-uuid', sequelize);
 * await fs.writeFile('migration-audit.json', report);
 * ```
 */
export declare const generateMigrationAuditReport: (planId: string, sequelize: Sequelize) => Promise<string>;
declare const _default: {
    createCloudStorageProviderModel: (sequelize: Sequelize) => any;
    createStorageBucketModel: (sequelize: Sequelize) => any;
    createStorageSyncModel: (sequelize: Sequelize) => any;
    uploadToS3: (config: S3Config, key: string, data: Buffer | Readable, options?: UploadOptions) => Promise<StorageObjectMetadata>;
    downloadFromS3: (config: S3Config, key: string, options?: DownloadOptions) => Promise<{
        data: Buffer;
        metadata: StorageObjectMetadata;
    }>;
    listS3Objects: (config: S3Config, prefix?: string, options?: {
        maxKeys?: number;
        continuationToken?: string;
    }) => Promise<StorageObjectMetadata[]>;
    initiateS3MultipartUpload: (config: S3Config, key: string, options?: UploadOptions) => Promise<MultiPartUploadSession>;
    copyS3Object: (config: S3Config, sourceKey: string, destinationKey: string, destinationBucket?: string) => Promise<StorageObjectMetadata>;
    generateS3PresignedUrl: (config: S3Config, key: string, expiresIn?: number, operation?: "getObject" | "putObject") => Promise<string>;
    configureS3Lifecycle: (config: S3Config, rules: LifecycleRule[]) => Promise<void>;
    uploadToAzureBlob: (config: AzureBlobConfig, blobName: string, data: Buffer | Readable, options?: UploadOptions) => Promise<StorageObjectMetadata>;
    downloadFromAzureBlob: (config: AzureBlobConfig, blobName: string, options?: DownloadOptions) => Promise<{
        data: Buffer;
        metadata: StorageObjectMetadata;
    }>;
    listAzureBlobs: (config: AzureBlobConfig, prefix?: string, options?: {
        maxPageSize?: number;
        marker?: string;
    }) => Promise<StorageObjectMetadata[]>;
    setAzureBlobTier: (config: AzureBlobConfig, blobName: string, tier: StorageTier) => Promise<void>;
    createAzureBlobSnapshot: (config: AzureBlobConfig, blobName: string, metadata?: Record<string, string>) => Promise<string>;
    generateAzureSasToken: (config: AzureBlobConfig, blobName: string, expiresIn?: number, permissions?: string[]) => Promise<string>;
    configureAzureLifecycle: (config: AzureBlobConfig, rules: LifecycleRule[]) => Promise<void>;
    uploadToGCS: (config: GCSConfig, fileName: string, data: Buffer | Readable, options?: UploadOptions) => Promise<StorageObjectMetadata>;
    downloadFromGCS: (config: GCSConfig, fileName: string, options?: DownloadOptions) => Promise<{
        data: Buffer;
        metadata: StorageObjectMetadata;
    }>;
    listGCSObjects: (config: GCSConfig, prefix?: string, options?: {
        maxResults?: number;
        pageToken?: string;
    }) => Promise<StorageObjectMetadata[]>;
    moveGCSObjectStorageClass: (config: GCSConfig, fileName: string, storageClass: StorageTier) => Promise<void>;
    createGCSObjectVersion: (config: GCSConfig, fileName: string) => Promise<string>;
    generateGCSSignedUrl: (config: GCSConfig, fileName: string, expiresIn?: number, action?: "read" | "write") => Promise<string>;
    configureGCSLifecycle: (config: GCSConfig, rules: LifecycleRule[]) => Promise<void>;
    syncBetweenClouds: (config: SyncConfig, sequelize: Sequelize, transaction?: Transaction) => Promise<SyncResult>;
    resolveSyncConflict: (sourceKey: string, sourceMetadata: StorageObjectMetadata, destMetadata: StorageObjectMetadata, strategy: SyncConfig["conflictResolution"]) => Promise<"SOURCE" | "DESTINATION" | "SKIP">;
    getSyncStatus: (syncId: string, sequelize: Sequelize) => Promise<SyncResult>;
    createBidirectionalSync: (config: SyncConfig, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        forward: SyncResult;
        reverse: SyncResult;
    }>;
    scheduleSync: (syncId: string, cronSchedule: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
    validateSyncIntegrity: (sourceObject: StorageObjectMetadata, destObject: StorageObjectMetadata) => Promise<{
        valid: boolean;
        errors?: string[];
    }>;
    getSyncHistory: (syncId: string, sequelize: Sequelize, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }) => Promise<Array<{
        timestamp: Date;
        status: SyncStatus;
        metrics: any;
    }>>;
    analyzeAccessPatterns: (provider: CloudProvider, bucketName: string, analysisDays?: number) => Promise<TieringRecommendation[]>;
    applyIntelligentTiering: (provider: CloudProvider, bucketName: string, recommendations: TieringRecommendation[]) => Promise<{
        applied: number;
        failed: number;
        savedCost: number;
    }>;
    calculateStorageCost: (provider: CloudProvider, tier: StorageTier, sizeGB: number, requestCount?: number) => Promise<number>;
    generateCostReport: (sequelize: Sequelize, providerId?: string, startDate?: Date, endDate?: Date) => Promise<StorageAnalytics>;
    predictStorageNeeds: (bucketId: string, sequelize: Sequelize, forecastDays?: number) => Promise<{
        date: Date;
        estimatedSize: number;
        estimatedCost: number;
    }[]>;
    optimizeStorageDistribution: (bucketId: string, sequelize: Sequelize, targetCostReduction?: number) => Promise<{
        currentCost: number;
        optimizedCost: number;
        savings: number;
        changes: TieringRecommendation[];
    }>;
    detectStorageAnomalies: (bucketId: string, sequelize: Sequelize, thresholds?: {
        sizeGrowthPercent?: number;
        costIncrease?: number;
        unusualAccessPattern?: boolean;
    }) => Promise<Array<{
        type: string;
        severity: string;
        message: string;
        metric: number;
    }>>;
    createMigrationPlan: (params: {
        name: string;
        sourceProvider: CloudProvider;
        destinationProvider: CloudProvider;
        sourceBucket: string;
        destinationBucket: string;
        verifyAfterMigration?: boolean;
        deleteAfterMigration?: boolean;
    }, sequelize: Sequelize) => Promise<MigrationPlan>;
    executeMigration: (planId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<MigrationProgress>;
    getMigrationProgress: (planId: string, sequelize: Sequelize) => Promise<MigrationProgress>;
    verifyMigrationIntegrity: (planId: string, sequelize: Sequelize) => Promise<{
        verified: number;
        failed: number;
        details: Array<{
            key: string;
            status: string;
        }>;
    }>;
    rollbackMigration: (planId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        rolledBack: number;
        failed: number;
    }>;
    estimateMigrationCost: (params: {
        sourceProvider: CloudProvider;
        destinationProvider: CloudProvider;
        totalSize: number;
        objectCount: number;
    }) => Promise<{
        estimatedCost: number;
        estimatedDuration: number;
        bandwidth: number;
    }>;
    generateMigrationAuditReport: (planId: string, sequelize: Sequelize) => Promise<string>;
};
export default _default;
//# sourceMappingURL=document-cloud-storage-kit.d.ts.map