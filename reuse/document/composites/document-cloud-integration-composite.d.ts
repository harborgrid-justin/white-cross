/**
 * LOC: DOCCLOUDINT001
 * File: /reuse/document/composites/document-cloud-integration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - stream (Node.js built-in)
 *   - ../document-cloud-storage-kit
 *   - ../document-api-integration-kit
 *   - ../document-versioning-kit
 *   - ../document-collaboration-kit
 *   - ../document-security-kit
 *
 * DOWNSTREAM (imported by):
 *   - Cloud storage controllers
 *   - Multi-cloud sync services
 *   - Document sharing modules
 *   - Cloud migration services
 *   - Healthcare cloud infrastructure
 */
/**
 * File: /reuse/document/composites/document-cloud-integration-composite.ts
 * Locator: WC-DOCCLOUDINTEGRATION-COMPOSITE-001
 * Purpose: Comprehensive Cloud Integration Toolkit - Production-ready cloud storage, sync, sharing, multi-cloud support
 *
 * Upstream: Composed from document-cloud-storage-kit, document-api-integration-kit, document-versioning-kit, document-collaboration-kit, document-security-kit
 * Downstream: ../backend/*, Cloud storage controllers, Multi-cloud services, Sharing modules, Migration handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, AWS SDK, Azure SDK, GCS
 * Exports: 48 utility functions for multi-cloud storage, synchronization, sharing, migration, versioning, security
 *
 * LLM Context: Enterprise-grade cloud integration toolkit for White Cross healthcare platform.
 * Provides comprehensive multi-cloud document management including AWS S3, Azure Blob Storage, Google Cloud Storage,
 * intelligent storage tiering, automatic failover, cloud-to-cloud migration, real-time synchronization across providers,
 * encrypted cloud storage, access control, compliance tracking, cost optimization, lifecycle management, versioning,
 * and HIPAA-compliant cloud operations. Composes functions from multiple cloud and security kits to provide unified
 * cloud document operations supporting hybrid and multi-cloud healthcare infrastructure deployments.
 */
import { Model } from 'sequelize-typescript';
import { Readable } from 'stream';
/**
 * Cloud storage provider enumeration
 */
export declare enum CloudProvider {
    AWS_S3 = "AWS_S3",
    AZURE_BLOB = "AZURE_BLOB",
    GOOGLE_CLOUD_STORAGE = "GOOGLE_CLOUD_STORAGE",
    CLOUDFLARE_R2 = "CLOUDFLARE_R2",
    MULTI_CLOUD = "MULTI_CLOUD"
}
/**
 * Storage tier classification
 */
export declare enum StorageTier {
    HOT = "HOT",
    COOL = "COOL",
    ARCHIVE = "ARCHIVE",
    INTELLIGENT = "INTELLIGENT",
    GLACIER = "GLACIER",
    DEEP_ARCHIVE = "DEEP_ARCHIVE",
    PREMIUM = "PREMIUM",
    STANDARD = "STANDARD"
}
/**
 * Cloud sync status
 */
export declare enum CloudSyncStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CONFLICT = "CONFLICT",
    PAUSED = "PAUSED"
}
/**
 * Migration status
 */
export declare enum MigrationStatus {
    SCHEDULED = "SCHEDULED",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    VALIDATING = "VALIDATING"
}
/**
 * Access control level
 */
export declare enum CloudAccessLevel {
    PRIVATE = "PRIVATE",
    PUBLIC_READ = "PUBLIC_READ",
    PUBLIC_READ_WRITE = "PUBLIC_READ_WRITE",
    AUTHENTICATED_READ = "AUTHENTICATED_READ",
    BUCKET_OWNER_READ = "BUCKET_OWNER_READ",
    BUCKET_OWNER_FULL_CONTROL = "BUCKET_OWNER_FULL_CONTROL"
}
/**
 * Replication strategy
 */
export declare enum ReplicationStrategy {
    NONE = "NONE",
    SINGLE_REGION = "SINGLE_REGION",
    MULTI_REGION = "MULTI_REGION",
    CROSS_CLOUD = "CROSS_CLOUD",
    GEO_REDUNDANT = "GEO_REDUNDANT"
}
/**
 * Cloud storage configuration
 */
export interface CloudStorageConfig {
    provider: CloudProvider;
    region: string;
    bucket: string;
    credentials: {
        accessKeyId?: string;
        secretAccessKey?: string;
        accountName?: string;
        accountKey?: string;
        projectId?: string;
        keyFile?: string;
    };
    tier: StorageTier;
    encryption: {
        enabled: boolean;
        algorithm: 'AES256' | 'AES256-GCM' | 'aws:kms' | 'azure:kms';
        keyId?: string;
    };
    versioning: boolean;
    lifecycle: {
        enabled: boolean;
        transitionDays?: number;
        expirationDays?: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Multi-cloud sync configuration
 */
export interface MultiCloudSyncConfig {
    id: string;
    name: string;
    primaryProvider: CloudProvider;
    secondaryProviders: CloudProvider[];
    syncDirection: 'ONE_WAY' | 'TWO_WAY' | 'MULTI_WAY';
    syncFrequency: number;
    conflictResolution: 'PRIMARY_WINS' | 'LATEST_WINS' | 'MANUAL' | 'MERGE';
    replicationStrategy: ReplicationStrategy;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Cloud migration task
 */
export interface CloudMigrationTask {
    id: string;
    sourceProvider: CloudProvider;
    targetProvider: CloudProvider;
    sourceBucket: string;
    targetBucket: string;
    status: MigrationStatus;
    totalObjects: number;
    migratedObjects: number;
    totalBytes: number;
    migratedBytes: number;
    startTime: Date;
    endTime?: Date;
    errorCount: number;
    errors?: string[];
    validateIntegrity: boolean;
    deleteSource: boolean;
    metadata?: Record<string, any>;
}
/**
 * Cloud document metadata
 */
export interface CloudDocumentMetadata {
    documentId: string;
    provider: CloudProvider;
    bucket: string;
    key: string;
    size: number;
    contentType: string;
    etag: string;
    versionId?: string;
    tier: StorageTier;
    encryption: {
        enabled: boolean;
        algorithm: string;
    };
    lastModified: Date;
    customMetadata?: Record<string, string>;
}
/**
 * Cloud sharing configuration
 */
export interface CloudSharingConfig {
    documentId: string;
    provider: CloudProvider;
    accessLevel: CloudAccessLevel;
    expiresAt?: Date;
    allowedIPs?: string[];
    requireAuthentication: boolean;
    downloadLimit?: number;
    password?: string;
    notifyOnAccess: boolean;
    metadata?: Record<string, any>;
}
/**
 * Cloud storage analytics
 */
export interface CloudStorageAnalytics {
    provider: CloudProvider;
    totalDocuments: number;
    totalSize: number;
    costEstimate: number;
    requestCount: {
        get: number;
        put: number;
        delete: number;
        list: number;
    };
    transferredBytes: {
        ingress: number;
        egress: number;
    };
    storageByTier: Record<StorageTier, number>;
    period: {
        start: Date;
        end: Date;
    };
}
/**
 * Cloud Storage Configuration Model
 * Stores cloud provider configurations
 */
export declare class CloudStorageConfigModel extends Model {
    id: string;
    name: string;
    provider: CloudProvider;
    region: string;
    bucket: string;
    credentials: Record<string, any>;
    tier: StorageTier;
    encryption: {
        enabled: boolean;
        algorithm: string;
        keyId?: string;
    };
    versioning: boolean;
    lifecycle: {
        enabled: boolean;
        transitionDays?: number;
        expirationDays?: number;
    };
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Cloud Document Model
 * Tracks documents stored in cloud providers
 */
export declare class CloudDocumentModel extends Model {
    id: string;
    documentId: string;
    provider: CloudProvider;
    bucket: string;
    key: string;
    size: number;
    contentType: string;
    etag: string;
    versionId?: string;
    tier: StorageTier;
    encryption: {
        enabled: boolean;
        algorithm: string;
    };
    lastModified: Date;
    customMetadata?: Record<string, string>;
}
/**
 * Multi-Cloud Sync Configuration Model
 * Manages multi-cloud synchronization settings
 */
export declare class MultiCloudSyncConfigModel extends Model {
    id: string;
    name: string;
    primaryProvider: CloudProvider;
    secondaryProviders: CloudProvider[];
    syncDirection: 'ONE_WAY' | 'TWO_WAY' | 'MULTI_WAY';
    syncFrequency: number;
    conflictResolution: 'PRIMARY_WINS' | 'LATEST_WINS' | 'MANUAL' | 'MERGE';
    replicationStrategy: ReplicationStrategy;
    enabled: boolean;
    lastSyncAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Cloud Migration Task Model
 * Tracks cloud-to-cloud migration operations
 */
export declare class CloudMigrationTaskModel extends Model {
    id: string;
    sourceProvider: CloudProvider;
    targetProvider: CloudProvider;
    sourceBucket: string;
    targetBucket: string;
    status: MigrationStatus;
    totalObjects: number;
    migratedObjects: number;
    totalBytes: number;
    migratedBytes: number;
    startTime: Date;
    endTime?: Date;
    errorCount: number;
    errors?: string[];
    validateIntegrity: boolean;
    deleteSource: boolean;
    metadata?: Record<string, any>;
}
/**
 * Cloud Sharing Model
 * Manages cloud document sharing configurations
 */
export declare class CloudSharingModel extends Model {
    id: string;
    documentId: string;
    provider: CloudProvider;
    accessLevel: CloudAccessLevel;
    shareUrl?: string;
    expiresAt?: Date;
    allowedIPs?: string[];
    requireAuthentication: boolean;
    downloadLimit?: number;
    downloadCount: number;
    passwordHash?: string;
    notifyOnAccess: boolean;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Configures cloud storage provider.
 * Sets up cloud provider with credentials and settings.
 *
 * @param {CloudStorageConfig} config - Cloud storage configuration
 * @returns {Promise<string>} Configuration ID
 *
 * @example
 * ```typescript
 * const configId = await configureCloudStorage({
 *   provider: CloudProvider.AWS_S3,
 *   region: 'us-east-1',
 *   bucket: 'medical-documents',
 *   credentials: { accessKeyId: '...', secretAccessKey: '...' },
 *   tier: StorageTier.STANDARD,
 *   encryption: { enabled: true, algorithm: 'AES256' },
 *   versioning: true,
 *   lifecycle: { enabled: true, transitionDays: 90, expirationDays: 2555 }
 * });
 * ```
 */
export declare const configureCloudStorage: (config: CloudStorageConfig) => Promise<string>;
/**
 * Uploads document to cloud storage.
 * Stores document with encryption and metadata.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer | Readable} data - Document data
 * @param {CloudProvider} provider - Cloud provider
 * @param {Record<string, any>} options - Upload options
 * @returns {Promise<CloudDocumentMetadata>}
 *
 * @example
 * ```typescript
 * const metadata = await uploadDocumentToCloud('doc-123', buffer, CloudProvider.AWS_S3, {
 *   bucket: 'medical-docs',
 *   contentType: 'application/pdf',
 *   tier: StorageTier.STANDARD
 * });
 * ```
 */
export declare const uploadDocumentToCloud: (documentId: string, data: Buffer | Readable, provider: CloudProvider, options: Record<string, any>) => Promise<CloudDocumentMetadata>;
/**
 * Downloads document from cloud storage.
 * Retrieves and decrypts document from cloud provider.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const data = await downloadDocumentFromCloud('doc-123', CloudProvider.AWS_S3);
 * ```
 */
export declare const downloadDocumentFromCloud: (documentId: string, provider: CloudProvider) => Promise<Buffer>;
/**
 * Synchronizes document across multiple cloud providers.
 * Implements multi-cloud replication.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider[]} providers - Target cloud providers
 * @returns {Promise<Record<CloudProvider, CloudSyncStatus>>}
 *
 * @example
 * ```typescript
 * const status = await syncDocumentAcrossClouds('doc-123', [
 *   CloudProvider.AWS_S3,
 *   CloudProvider.AZURE_BLOB,
 *   CloudProvider.GOOGLE_CLOUD_STORAGE
 * ]);
 * ```
 */
export declare const syncDocumentAcrossClouds: (documentId: string, providers: CloudProvider[]) => Promise<Record<CloudProvider, CloudSyncStatus>>;
/**
 * Creates multi-cloud sync configuration.
 * Sets up automatic synchronization between cloud providers.
 *
 * @param {MultiCloudSyncConfig} config - Sync configuration
 * @returns {Promise<string>} Sync configuration ID
 *
 * @example
 * ```typescript
 * const syncId = await createMultiCloudSync({
 *   name: 'Medical Records Sync',
 *   primaryProvider: CloudProvider.AWS_S3,
 *   secondaryProviders: [CloudProvider.AZURE_BLOB],
 *   syncDirection: 'TWO_WAY',
 *   syncFrequency: 300,
 *   conflictResolution: 'LATEST_WINS',
 *   replicationStrategy: ReplicationStrategy.CROSS_CLOUD,
 *   enabled: true
 * });
 * ```
 */
export declare const createMultiCloudSync: (config: Omit<MultiCloudSyncConfig, "id">) => Promise<string>;
/**
 * Migrates documents between cloud providers.
 * Performs cloud-to-cloud migration with validation.
 *
 * @param {CloudProvider} source - Source provider
 * @param {CloudProvider} target - Target provider
 * @param {string} sourceBucket - Source bucket
 * @param {string} targetBucket - Target bucket
 * @param {Record<string, any>} options - Migration options
 * @returns {Promise<string>} Migration task ID
 *
 * @example
 * ```typescript
 * const taskId = await migrateCloudDocuments(
 *   CloudProvider.AWS_S3,
 *   CloudProvider.AZURE_BLOB,
 *   'old-bucket',
 *   'new-bucket',
 *   { validateIntegrity: true, deleteSource: false }
 * );
 * ```
 */
export declare const migrateCloudDocuments: (source: CloudProvider, target: CloudProvider, sourceBucket: string, targetBucket: string, options: Record<string, any>) => Promise<string>;
/**
 * Gets migration task status and progress.
 * Returns current state of cloud migration.
 *
 * @param {string} taskId - Migration task identifier
 * @returns {Promise<CloudMigrationTask>}
 *
 * @example
 * ```typescript
 * const status = await getMigrationStatus('task-123');
 * ```
 */
export declare const getMigrationStatus: (taskId: string) => Promise<CloudMigrationTask>;
/**
 * Cancels active cloud migration.
 * Stops in-progress migration task.
 *
 * @param {string} taskId - Migration task identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelMigration('task-123');
 * ```
 */
export declare const cancelMigration: (taskId: string) => Promise<void>;
/**
 * Shares document via cloud storage.
 * Creates secure cloud sharing link.
 *
 * @param {CloudSharingConfig} config - Sharing configuration
 * @returns {Promise<{ shareId: string; shareUrl: string }>}
 *
 * @example
 * ```typescript
 * const share = await shareDocumentViaCloud({
 *   documentId: 'doc-123',
 *   provider: CloudProvider.AWS_S3,
 *   accessLevel: CloudAccessLevel.PUBLIC_READ,
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   requireAuthentication: false,
 *   notifyOnAccess: true
 * });
 * ```
 */
export declare const shareDocumentViaCloud: (config: CloudSharingConfig) => Promise<{
    shareId: string;
    shareUrl: string;
}>;
/**
 * Revokes cloud document sharing.
 * Disables access to shared document.
 *
 * @param {string} shareId - Share identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeCloudSharing('share-123');
 * ```
 */
export declare const revokeCloudSharing: (shareId: string) => Promise<void>;
/**
 * Implements intelligent storage tiering.
 * Automatically moves documents to cost-optimal tiers.
 *
 * @param {string} documentId - Document identifier
 * @param {number} daysSinceAccess - Days since last access
 * @returns {Promise<StorageTier>}
 *
 * @example
 * ```typescript
 * const newTier = await applyIntelligentTiering('doc-123', 90);
 * ```
 */
export declare const applyIntelligentTiering: (documentId: string, daysSinceAccess: number) => Promise<StorageTier>;
/**
 * Enables cloud versioning for document.
 * Activates version control in cloud storage.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableCloudVersioning('doc-123', CloudProvider.AWS_S3);
 * ```
 */
export declare const enableCloudVersioning: (documentId: string, provider: CloudProvider) => Promise<void>;
/**
 * Lists all versions of cloud document.
 * Returns version history from cloud storage.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<CloudDocumentMetadata[]>}
 *
 * @example
 * ```typescript
 * const versions = await listCloudVersions('doc-123', CloudProvider.AWS_S3);
 * ```
 */
export declare const listCloudVersions: (documentId: string, provider: CloudProvider) => Promise<CloudDocumentMetadata[]>;
/**
 * Restores document from cloud version.
 * Retrieves specific version from cloud storage.
 *
 * @param {string} documentId - Document identifier
 * @param {string} versionId - Version identifier
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const data = await restoreCloudVersion('doc-123', 'v-456', CloudProvider.AWS_S3);
 * ```
 */
export declare const restoreCloudVersion: (documentId: string, versionId: string, provider: CloudProvider) => Promise<Buffer>;
/**
 * Encrypts document in cloud storage.
 * Applies server-side encryption to cloud document.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider} provider - Cloud provider
 * @param {string} algorithm - Encryption algorithm
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await encryptCloudDocument('doc-123', CloudProvider.AWS_S3, 'AES256');
 * ```
 */
export declare const encryptCloudDocument: (documentId: string, provider: CloudProvider, algorithm: string) => Promise<void>;
/**
 * Sets cloud document lifecycle policy.
 * Configures automatic archival and deletion.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider} provider - Cloud provider
 * @param {Record<string, any>} policy - Lifecycle policy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setCloudLifecyclePolicy('doc-123', CloudProvider.AWS_S3, {
 *   transitionDays: 90,
 *   expirationDays: 2555
 * });
 * ```
 */
export declare const setCloudLifecyclePolicy: (documentId: string, provider: CloudProvider, policy: Record<string, any>) => Promise<void>;
/**
 * Validates cloud document integrity.
 * Verifies document hash against cloud storage.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<boolean>}
 *
 * @example
 * ```typescript
 * const isValid = await validateCloudIntegrity('doc-123', CloudProvider.AWS_S3);
 * ```
 */
export declare const validateCloudIntegrity: (documentId: string, provider: CloudProvider) => Promise<boolean>;
/**
 * Gets cloud storage analytics.
 * Returns usage and cost metrics.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<CloudStorageAnalytics>}
 *
 * @example
 * ```typescript
 * const analytics = await getCloudStorageAnalytics(
 *   CloudProvider.AWS_S3,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare const getCloudStorageAnalytics: (provider: CloudProvider, startDate: Date, endDate: Date) => Promise<CloudStorageAnalytics>;
/**
 * Optimizes cloud storage costs.
 * Analyzes and applies cost-saving strategies.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<{ savedCost: number; recommendations: string[] }>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeCloudStorageCosts(CloudProvider.AWS_S3);
 * ```
 */
export declare const optimizeCloudStorageCosts: (provider: CloudProvider) => Promise<{
    savedCost: number;
    recommendations: string[];
}>;
/**
 * Implements cross-region replication.
 * Replicates documents across cloud regions.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider} provider - Cloud provider
 * @param {string[]} targetRegions - Target regions
 * @returns {Promise<Record<string, CloudSyncStatus>>}
 *
 * @example
 * ```typescript
 * const status = await replicateAcrossRegions('doc-123', CloudProvider.AWS_S3, ['us-west-2', 'eu-west-1']);
 * ```
 */
export declare const replicateAcrossRegions: (documentId: string, provider: CloudProvider, targetRegions: string[]) => Promise<Record<string, CloudSyncStatus>>;
/**
 * Monitors cloud sync operations.
 * Tracks synchronization status and performance.
 *
 * @param {string} syncConfigId - Sync configuration identifier
 * @returns {Promise<{ status: CloudSyncStatus; lastSync: Date; nextSync: Date }>}
 *
 * @example
 * ```typescript
 * const monitor = await monitorCloudSync('sync-123');
 * ```
 */
export declare const monitorCloudSync: (syncConfigId: string) => Promise<{
    status: CloudSyncStatus;
    lastSync: Date;
    nextSync: Date;
}>;
/**
 * Pauses multi-cloud synchronization.
 * Temporarily stops sync operations.
 *
 * @param {string} syncConfigId - Sync configuration identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseCloudSync('sync-123');
 * ```
 */
export declare const pauseCloudSync: (syncConfigId: string) => Promise<void>;
/**
 * Resumes multi-cloud synchronization.
 * Restarts paused sync operations.
 *
 * @param {string} syncConfigId - Sync configuration identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeCloudSync('sync-123');
 * ```
 */
export declare const resumeCloudSync: (syncConfigId: string) => Promise<void>;
/**
 * Detects and resolves cloud sync conflicts.
 * Handles conflicting versions across providers.
 *
 * @param {string} documentId - Document identifier
 * @param {CloudProvider[]} providers - Conflicting providers
 * @param {'PRIMARY_WINS' | 'LATEST_WINS' | 'MERGE'} strategy - Resolution strategy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveCloudConflict('doc-123', [CloudProvider.AWS_S3, CloudProvider.AZURE_BLOB], 'LATEST_WINS');
 * ```
 */
export declare const resolveCloudConflict: (documentId: string, providers: CloudProvider[], strategy: "PRIMARY_WINS" | "LATEST_WINS" | "MERGE") => Promise<void>;
/**
 * Backs up cloud configuration.
 * Creates backup of cloud storage settings.
 *
 * @param {string} configId - Configuration identifier
 * @returns {Promise<string>} Backup ID
 *
 * @example
 * ```typescript
 * const backupId = await backupCloudConfiguration('config-123');
 * ```
 */
export declare const backupCloudConfiguration: (configId: string) => Promise<string>;
/**
 * Restores cloud configuration from backup.
 * Recovers cloud storage settings.
 *
 * @param {string} backupId - Backup identifier
 * @returns {Promise<string>} Configuration ID
 *
 * @example
 * ```typescript
 * const configId = await restoreCloudConfiguration('backup-123');
 * ```
 */
export declare const restoreCloudConfiguration: (backupId: string) => Promise<string>;
/**
 * Tests cloud connectivity and credentials.
 * Validates cloud provider access.
 *
 * @param {string} configId - Configuration identifier
 * @returns {Promise<{ connected: boolean; latency: number; error?: string }>}
 *
 * @example
 * ```typescript
 * const test = await testCloudConnectivity('config-123');
 * ```
 */
export declare const testCloudConnectivity: (configId: string) => Promise<{
    connected: boolean;
    latency: number;
    error?: string;
}>;
/**
 * Gets cloud storage quota and usage.
 * Returns storage limits and consumption.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<{ used: number; total: number; percentage: number }>}
 *
 * @example
 * ```typescript
 * const quota = await getCloudStorageQuota(CloudProvider.AWS_S3);
 * ```
 */
export declare const getCloudStorageQuota: (provider: CloudProvider) => Promise<{
    used: number;
    total: number;
    percentage: number;
}>;
/**
 * Archives inactive cloud documents.
 * Moves old documents to archive tier.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {number} inactiveDays - Days of inactivity
 * @returns {Promise<number>} Number of archived documents
 *
 * @example
 * ```typescript
 * const archived = await archiveInactiveDocuments(CloudProvider.AWS_S3, 180);
 * ```
 */
export declare const archiveInactiveDocuments: (provider: CloudProvider, inactiveDays: number) => Promise<number>;
/**
 * Exports cloud storage inventory.
 * Generates comprehensive storage report.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<{ documents: CloudDocumentMetadata[]; summary: Record<string, any> }>}
 *
 * @example
 * ```typescript
 * const inventory = await exportCloudInventory(CloudProvider.AWS_S3);
 * ```
 */
export declare const exportCloudInventory: (provider: CloudProvider) => Promise<{
    documents: CloudDocumentMetadata[];
    summary: Record<string, any>;
}>;
/**
 * Implements cloud disaster recovery.
 * Sets up automatic backup and recovery.
 *
 * @param {CloudProvider} primaryProvider - Primary provider
 * @param {CloudProvider} backupProvider - Backup provider
 * @param {Record<string, any>} options - Recovery options
 * @returns {Promise<string>} Disaster recovery plan ID
 *
 * @example
 * ```typescript
 * const planId = await setupCloudDisasterRecovery(
 *   CloudProvider.AWS_S3,
 *   CloudProvider.AZURE_BLOB,
 *   { rpo: 60, rto: 240 }
 * );
 * ```
 */
export declare const setupCloudDisasterRecovery: (primaryProvider: CloudProvider, backupProvider: CloudProvider, options: Record<string, any>) => Promise<string>;
/**
 * Performs cloud failover.
 * Switches to backup cloud provider.
 *
 * @param {string} drPlanId - Disaster recovery plan identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await performCloudFailover('dr-plan-123');
 * ```
 */
export declare const performCloudFailover: (drPlanId: string) => Promise<void>;
/**
 * Validates cloud compliance requirements.
 * Checks HIPAA, GDPR, and other regulations.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<{ compliant: boolean; issues: string[] }>}
 *
 * @example
 * ```typescript
 * const compliance = await validateCloudCompliance(CloudProvider.AWS_S3);
 * ```
 */
export declare const validateCloudCompliance: (provider: CloudProvider) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * Generates cloud access audit log.
 * Creates detailed access history for compliance.
 *
 * @param {string} documentId - Document identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>[]>}
 *
 * @example
 * ```typescript
 * const auditLog = await generateCloudAccessAuditLog('doc-123', startDate, endDate);
 * ```
 */
export declare const generateCloudAccessAuditLog: (documentId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>[]>;
/**
 * Estimates cloud storage costs.
 * Calculates projected costs based on usage.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {number} sizeGB - Storage size in GB
 * @param {StorageTier} tier - Storage tier
 * @returns {Promise<{ monthlyCost: number; yearlyCost: number }>}
 *
 * @example
 * ```typescript
 * const cost = await estimateCloudCosts(CloudProvider.AWS_S3, 1000, StorageTier.STANDARD);
 * ```
 */
export declare const estimateCloudCosts: (provider: CloudProvider, sizeGB: number, tier: StorageTier) => Promise<{
    monthlyCost: number;
    yearlyCost: number;
}>;
/**
 * Cleans up orphaned cloud documents.
 * Removes documents without database references.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<number>} Number of cleaned documents
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupOrphanedCloudDocuments(CloudProvider.AWS_S3);
 * ```
 */
export declare const cleanupOrphanedCloudDocuments: (provider: CloudProvider) => Promise<number>;
/**
 * Monitors cloud API rate limits.
 * Tracks and manages API quota usage.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @returns {Promise<{ current: number; limit: number; resetAt: Date }>}
 *
 * @example
 * ```typescript
 * const rateLimit = await monitorCloudRateLimits(CloudProvider.AWS_S3);
 * ```
 */
export declare const monitorCloudRateLimits: (provider: CloudProvider) => Promise<{
    current: number;
    limit: number;
    resetAt: Date;
}>;
/**
 * Batches cloud operations for efficiency.
 * Groups multiple operations into single request.
 *
 * @param {CloudProvider} provider - Cloud provider
 * @param {Array<{ operation: string; params: any }>} operations - Operations to batch
 * @returns {Promise<Array<{ success: boolean; result?: any; error?: string }>>}
 *
 * @example
 * ```typescript
 * const results = await batchCloudOperations(CloudProvider.AWS_S3, [
 *   { operation: 'upload', params: {...} },
 *   { operation: 'delete', params: {...} }
 * ]);
 * ```
 */
export declare const batchCloudOperations: (provider: CloudProvider, operations: Array<{
    operation: string;
    params: any;
}>) => Promise<Array<{
    success: boolean;
    result?: any;
    error?: string;
}>>;
/**
 * Cloud Integration Service
 * Production-ready NestJS service for multi-cloud document operations
 */
export declare class CloudIntegrationService {
    /**
     * Uploads document to configured cloud storage
     */
    uploadDocument(documentId: string, data: Buffer, provider: CloudProvider): Promise<CloudDocumentMetadata>;
    /**
     * Synchronizes document across multiple clouds
     */
    syncMultiCloud(documentId: string): Promise<Record<CloudProvider, CloudSyncStatus>>;
    /**
     * Migrates documents between cloud providers
     */
    migrateDocuments(source: CloudProvider, target: CloudProvider): Promise<string>;
    /**
     * Shares document via cloud with expiration
     */
    shareDocument(documentId: string, expirationDays: number): Promise<{
        shareId: string;
        shareUrl: string;
    }>;
}
declare const _default: {
    CloudStorageConfigModel: typeof CloudStorageConfigModel;
    CloudDocumentModel: typeof CloudDocumentModel;
    MultiCloudSyncConfigModel: typeof MultiCloudSyncConfigModel;
    CloudMigrationTaskModel: typeof CloudMigrationTaskModel;
    CloudSharingModel: typeof CloudSharingModel;
    configureCloudStorage: (config: CloudStorageConfig) => Promise<string>;
    uploadDocumentToCloud: (documentId: string, data: Buffer | Readable, provider: CloudProvider, options: Record<string, any>) => Promise<CloudDocumentMetadata>;
    downloadDocumentFromCloud: (documentId: string, provider: CloudProvider) => Promise<Buffer>;
    syncDocumentAcrossClouds: (documentId: string, providers: CloudProvider[]) => Promise<Record<CloudProvider, CloudSyncStatus>>;
    createMultiCloudSync: (config: Omit<MultiCloudSyncConfig, "id">) => Promise<string>;
    migrateCloudDocuments: (source: CloudProvider, target: CloudProvider, sourceBucket: string, targetBucket: string, options: Record<string, any>) => Promise<string>;
    getMigrationStatus: (taskId: string) => Promise<CloudMigrationTask>;
    cancelMigration: (taskId: string) => Promise<void>;
    shareDocumentViaCloud: (config: CloudSharingConfig) => Promise<{
        shareId: string;
        shareUrl: string;
    }>;
    revokeCloudSharing: (shareId: string) => Promise<void>;
    applyIntelligentTiering: (documentId: string, daysSinceAccess: number) => Promise<StorageTier>;
    enableCloudVersioning: (documentId: string, provider: CloudProvider) => Promise<void>;
    listCloudVersions: (documentId: string, provider: CloudProvider) => Promise<CloudDocumentMetadata[]>;
    restoreCloudVersion: (documentId: string, versionId: string, provider: CloudProvider) => Promise<Buffer>;
    encryptCloudDocument: (documentId: string, provider: CloudProvider, algorithm: string) => Promise<void>;
    setCloudLifecyclePolicy: (documentId: string, provider: CloudProvider, policy: Record<string, any>) => Promise<void>;
    validateCloudIntegrity: (documentId: string, provider: CloudProvider) => Promise<boolean>;
    getCloudStorageAnalytics: (provider: CloudProvider, startDate: Date, endDate: Date) => Promise<CloudStorageAnalytics>;
    optimizeCloudStorageCosts: (provider: CloudProvider) => Promise<{
        savedCost: number;
        recommendations: string[];
    }>;
    replicateAcrossRegions: (documentId: string, provider: CloudProvider, targetRegions: string[]) => Promise<Record<string, CloudSyncStatus>>;
    monitorCloudSync: (syncConfigId: string) => Promise<{
        status: CloudSyncStatus;
        lastSync: Date;
        nextSync: Date;
    }>;
    pauseCloudSync: (syncConfigId: string) => Promise<void>;
    resumeCloudSync: (syncConfigId: string) => Promise<void>;
    resolveCloudConflict: (documentId: string, providers: CloudProvider[], strategy: "PRIMARY_WINS" | "LATEST_WINS" | "MERGE") => Promise<void>;
    backupCloudConfiguration: (configId: string) => Promise<string>;
    restoreCloudConfiguration: (backupId: string) => Promise<string>;
    testCloudConnectivity: (configId: string) => Promise<{
        connected: boolean;
        latency: number;
        error?: string;
    }>;
    getCloudStorageQuota: (provider: CloudProvider) => Promise<{
        used: number;
        total: number;
        percentage: number;
    }>;
    archiveInactiveDocuments: (provider: CloudProvider, inactiveDays: number) => Promise<number>;
    exportCloudInventory: (provider: CloudProvider) => Promise<{
        documents: CloudDocumentMetadata[];
        summary: Record<string, any>;
    }>;
    setupCloudDisasterRecovery: (primaryProvider: CloudProvider, backupProvider: CloudProvider, options: Record<string, any>) => Promise<string>;
    performCloudFailover: (drPlanId: string) => Promise<void>;
    validateCloudCompliance: (provider: CloudProvider) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    generateCloudAccessAuditLog: (documentId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>[]>;
    estimateCloudCosts: (provider: CloudProvider, sizeGB: number, tier: StorageTier) => Promise<{
        monthlyCost: number;
        yearlyCost: number;
    }>;
    cleanupOrphanedCloudDocuments: (provider: CloudProvider) => Promise<number>;
    monitorCloudRateLimits: (provider: CloudProvider) => Promise<{
        current: number;
        limit: number;
        resetAt: Date;
    }>;
    batchCloudOperations: (provider: CloudProvider, operations: Array<{
        operation: string;
        params: any;
    }>) => Promise<Array<{
        success: boolean;
        result?: any;
        error?: string;
    }>>;
    CloudIntegrationService: typeof CloudIntegrationService;
};
export default _default;
//# sourceMappingURL=document-cloud-integration-composite.d.ts.map