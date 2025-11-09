/**
 * @fileoverview Network Persistence Kit - Enterprise network state and configuration persistence
 * @module reuse/san/network-persistence-kit
 * @description Complete persistence utilities for enterprise virtual networks including state management,
 * configuration persistence, snapshots, backups, migrations, seed data, import/export, and versioning.
 *
 * Key Features:
 * - Network state persistence and recovery
 * - Configuration management and versioning
 * - Point-in-time snapshots
 * - Automated backup and restore
 * - Zero-downtime migrations
 * - Network seed data generation
 * - Bulk import/export utilities
 * - Configuration versioning and rollback
 * - State synchronization across replicas
 * - Disaster recovery procedures
 * - Data validation and integrity checks
 * - Change tracking and audit trails
 * - Network topology persistence
 * - Incremental backup strategies
 * - Cross-environment data migration
 *
 * @target Sequelize v6.x, PostgreSQL 14+, Redis 7+, Node 18+, TypeScript 5.x
 *
 * @security
 * - Encrypted backups
 * - Secure configuration storage
 * - Access-controlled snapshots
 * - Audit logging for all persistence operations
 * - Configuration secrets encryption
 * - Backup integrity verification
 * - Role-based access to restore operations
 * - Zero-knowledge backup encryption
 *
 * @example Basic state persistence
 * ```typescript
 * import { persistNetworkState, restoreNetworkState } from './network-persistence-kit';
 *
 * // Persist current network state
 * const snapshot = await persistNetworkState(sequelize, {
 *   includeTopology: true,
 *   includeMetrics: false,
 *   compression: true
 * });
 *
 * // Restore state
 * await restoreNetworkState(sequelize, snapshot.id);
 * ```
 *
 * @example Configuration versioning
 * ```typescript
 * import { saveConfigurationVersion, rollbackConfiguration } from './network-persistence-kit';
 *
 * // Save configuration version
 * const version = await saveConfigurationVersion(sequelize, {
 *   deviceId: 'device-123',
 *   configuration: configData,
 *   comment: 'Updated VLAN configuration'
 * });
 *
 * // Rollback to previous version
 * await rollbackConfiguration(sequelize, 'device-123', version - 1);
 * ```
 *
 * LOC: DB-PERSIST-NET-001
 * UPSTREAM: sequelize, pg, redis, archiver, zlib
 * DOWNSTREAM: network services, backup systems, DR systems
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * @enum PersistenceStrategy
 * @description Persistence strategies for network data
 */
export declare enum PersistenceStrategy {
    IMMEDIATE = "IMMEDIATE",
    BATCHED = "BATCHED",
    DEFERRED = "DEFERRED",
    ASYNC = "ASYNC"
}
/**
 * @enum SnapshotType
 * @description Types of network snapshots
 */
export declare enum SnapshotType {
    FULL = "FULL",
    INCREMENTAL = "INCREMENTAL",
    DIFFERENTIAL = "DIFFERENTIAL",
    TOPOLOGY_ONLY = "TOPOLOGY_ONLY",
    STATE_ONLY = "STATE_ONLY"
}
/**
 * @enum BackupFrequency
 * @description Backup schedule frequencies
 */
export declare enum BackupFrequency {
    HOURLY = "HOURLY",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    ON_DEMAND = "ON_DEMAND"
}
/**
 * @enum MigrationStrategy
 * @description Migration strategies
 */
export declare enum MigrationStrategy {
    ROLLING = "ROLLING",
    BLUE_GREEN = "BLUE_GREEN",
    CANARY = "CANARY",
    SHADOW = "SHADOW"
}
/**
 * @enum DataFormat
 * @description Data export/import formats
 */
export declare enum DataFormat {
    JSON = "JSON",
    JSONL = "JSONL",
    CSV = "CSV",
    YAML = "YAML",
    BINARY = "BINARY"
}
/**
 * @interface StatePersistenceConfig
 * @description State persistence configuration
 */
export interface StatePersistenceConfig {
    strategy: PersistenceStrategy;
    includeTopology: boolean;
    includeMetrics: boolean;
    includeConfigurations: boolean;
    compression: boolean;
    encryption?: boolean;
    retention?: number;
}
/**
 * @interface SnapshotConfig
 * @description Snapshot configuration
 */
export interface SnapshotConfig {
    type: SnapshotType;
    name: string;
    description?: string;
    tags?: Record<string, string>;
    includeData?: string[];
    excludeData?: string[];
    compression?: boolean;
}
/**
 * @interface BackupConfig
 * @description Backup configuration
 */
export interface BackupConfig {
    frequency: BackupFrequency;
    retention: number;
    compression: boolean;
    encryption: boolean;
    destination: string;
    incrementalBase?: string;
    verifyIntegrity?: boolean;
}
/**
 * @interface RestoreConfig
 * @description Restore configuration
 */
export interface RestoreConfig {
    snapshotId: string;
    pointInTime?: Date;
    tablesToRestore?: string[];
    skipValidation?: boolean;
    dryRun?: boolean;
}
/**
 * @interface MigrationConfig
 * @description Migration configuration
 */
export interface MigrationConfig {
    strategy: MigrationStrategy;
    source: string;
    target: string;
    validation?: boolean;
    rollbackOnError?: boolean;
    batchSize?: number;
}
/**
 * @interface SeedDataConfig
 * @description Seed data configuration
 */
export interface SeedDataConfig {
    environment: 'development' | 'staging' | 'production';
    dataSize: 'small' | 'medium' | 'large';
    realistic: boolean;
    customGenerators?: Record<string, () => any>;
}
/**
 * @interface ExportConfig
 * @description Export configuration
 */
export interface ExportConfig {
    format: DataFormat;
    tables: string[];
    includeSchema?: boolean;
    compression?: boolean;
    chunkSize?: number;
    where?: Record<string, any>;
}
/**
 * @interface ImportConfig
 * @description Import configuration
 */
export interface ImportConfig {
    format: DataFormat;
    source: string;
    targetTable: string;
    mapping?: Record<string, string>;
    validateBeforeImport?: boolean;
    batchSize?: number;
    onConflict?: 'skip' | 'update' | 'error';
}
/**
 * @interface VersionInfo
 * @description Version information
 */
export interface VersionInfo {
    version: number;
    createdAt: Date;
    createdBy: string;
    comment?: string;
    checksum: string;
}
/**
 * @interface SnapshotMetadata
 * @description Snapshot metadata
 */
export interface SnapshotMetadata {
    id: string;
    type: SnapshotType;
    name: string;
    size: number;
    createdAt: Date;
    expiresAt?: Date;
    checksum: string;
    metadata: Record<string, any>;
}
/**
 * Persists current network state
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {StatePersistenceConfig} config - Persistence configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SnapshotMetadata>} Snapshot metadata
 *
 * @example
 * ```typescript
 * const snapshot = await persistNetworkState(sequelize, {
 *   strategy: PersistenceStrategy.IMMEDIATE,
 *   includeTopology: true,
 *   includeMetrics: true,
 *   compression: true
 * });
 * ```
 */
export declare const persistNetworkState: (sequelize: Sequelize, config: StatePersistenceConfig, transaction?: Transaction) => Promise<SnapshotMetadata>;
/**
 * Restores network state from snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {RestoreConfig} [config] - Restore configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreNetworkState(sequelize, 'snapshot-123', {
 *   tablesToRestore: ['devices', 'configurations'],
 *   dryRun: false
 * });
 * ```
 */
export declare const restoreNetworkState: (sequelize: Sequelize, snapshotId: string, config?: RestoreConfig, transaction?: Transaction) => Promise<void>;
/**
 * Persists network topology state
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await persistTopologyState(sequelize, 'snapshot-123');
 * ```
 */
export declare const persistTopologyState: (sequelize: Sequelize, snapshotId: string, transaction?: Transaction) => Promise<void>;
/**
 * Persists network metrics state
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await persistMetricsState(sequelize, 'snapshot-123');
 * ```
 */
export declare const persistMetricsState: (sequelize: Sequelize, snapshotId: string, transaction?: Transaction) => Promise<void>;
/**
 * Synchronizes state across network replicas
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} replicaHosts - Replica host addresses
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await synchronizeStateAcrossReplicas(sequelize, [
 *   'replica1.example.com',
 *   'replica2.example.com'
 * ]);
 * ```
 */
export declare const synchronizeStateAcrossReplicas: (sequelize: Sequelize, replicaHosts: string[]) => Promise<void>;
/**
 * Saves configuration version
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} params - Configuration parameters
 * @param {string} params.deviceId - Device ID
 * @param {any} params.configuration - Configuration data
 * @param {string} [params.comment] - Version comment
 * @param {string} [params.userId] - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Version number
 *
 * @example
 * ```typescript
 * const version = await saveConfigurationVersion(sequelize, {
 *   deviceId: 'device-123',
 *   configuration: { vlan: 100, ports: [1, 2, 3] },
 *   comment: 'Updated VLAN configuration'
 * });
 * ```
 */
export declare const saveConfigurationVersion: (sequelize: Sequelize, params: {
    deviceId: string;
    configuration: any;
    comment?: string;
    userId?: string;
}, transaction?: Transaction) => Promise<number>;
/**
 * Retrieves configuration version
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deviceId - Device ID
 * @param {number} version - Version number
 * @returns {Promise<any>} Configuration data
 *
 * @example
 * ```typescript
 * const config = await getConfigurationVersion(sequelize, 'device-123', 5);
 * ```
 */
export declare const getConfigurationVersion: (sequelize: Sequelize, deviceId: string, version: number) => Promise<any>;
/**
 * Rolls back configuration to specific version
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deviceId - Device ID
 * @param {number} version - Target version number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackConfiguration(sequelize, 'device-123', 3);
 * ```
 */
export declare const rollbackConfiguration: (sequelize: Sequelize, deviceId: string, version: number, transaction?: Transaction) => Promise<void>;
/**
 * Lists configuration versions for device
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deviceId - Device ID
 * @param {number} [limit=10] - Number of versions to retrieve
 * @returns {Promise<VersionInfo[]>} Version history
 *
 * @example
 * ```typescript
 * const versions = await listConfigurationVersions(sequelize, 'device-123', 20);
 * ```
 */
export declare const listConfigurationVersions: (sequelize: Sequelize, deviceId: string, limit?: number) => Promise<VersionInfo[]>;
/**
 * Compares two configuration versions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deviceId - Device ID
 * @param {number} version1 - First version
 * @param {number} version2 - Second version
 * @returns {Promise<any>} Configuration diff
 *
 * @example
 * ```typescript
 * const diff = await compareConfigurationVersions(sequelize, 'device-123', 3, 5);
 * ```
 */
export declare const compareConfigurationVersions: (sequelize: Sequelize, deviceId: string, version1: number, version2: number) => Promise<any>;
/**
 * Creates network snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SnapshotConfig} config - Snapshot configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SnapshotMetadata>} Snapshot metadata
 *
 * @example
 * ```typescript
 * const snapshot = await createNetworkSnapshot(sequelize, {
 *   type: SnapshotType.FULL,
 *   name: 'pre-migration-snapshot',
 *   description: 'Snapshot before major upgrade',
 *   compression: true
 * });
 * ```
 */
export declare const createNetworkSnapshot: (sequelize: Sequelize, config: SnapshotConfig, transaction?: Transaction) => Promise<SnapshotMetadata>;
/**
 * Deletes network snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteNetworkSnapshot(sequelize, 'snapshot-123');
 * ```
 */
export declare const deleteNetworkSnapshot: (sequelize: Sequelize, snapshotId: string, transaction?: Transaction) => Promise<void>;
/**
 * Lists available snapshots
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<SnapshotMetadata[]>} Snapshot list
 *
 * @example
 * ```typescript
 * const snapshots = await listNetworkSnapshots(sequelize, {
 *   type: SnapshotType.FULL,
 *   limit: 20
 * });
 * ```
 */
export declare const listNetworkSnapshots: (sequelize: Sequelize, filters?: {
    type?: SnapshotType;
    limit?: number;
}) => Promise<SnapshotMetadata[]>;
/**
 * Captures topology snapshot data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await captureTopologySnapshot(sequelize, 'snapshot-123');
 * ```
 */
export declare const captureTopologySnapshot: (sequelize: Sequelize, snapshotId: string, transaction?: Transaction) => Promise<void>;
/**
 * Captures state snapshot data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await captureStateSnapshot(sequelize, 'snapshot-123');
 * ```
 */
export declare const captureStateSnapshot: (sequelize: Sequelize, snapshotId: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates automated backup job
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BackupConfig} config - Backup configuration
 * @returns {Promise<string>} Backup job ID
 *
 * @example
 * ```typescript
 * const jobId = await createBackupJob(sequelize, {
 *   frequency: BackupFrequency.DAILY,
 *   retention: 30,
 *   compression: true,
 *   encryption: true,
 *   destination: 's3://backups/network'
 * });
 * ```
 */
export declare const createBackupJob: (sequelize: Sequelize, config: BackupConfig) => Promise<string>;
/**
 * Executes network backup
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} jobId - Backup job ID
 * @returns {Promise<string>} Backup ID
 *
 * @example
 * ```typescript
 * const backupId = await executeBackup(sequelize, 'job-123');
 * ```
 */
export declare const executeBackup: (sequelize: Sequelize, jobId: string) => Promise<string>;
/**
 * Restores from backup
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} backupId - Backup ID
 * @param {object} [options] - Restore options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreFromBackup(sequelize, 'backup-123', {
 *   verifyIntegrity: true,
 *   pointInTime: new Date('2025-01-01')
 * });
 * ```
 */
export declare const restoreFromBackup: (sequelize: Sequelize, backupId: string, options?: {
    verifyIntegrity?: boolean;
    pointInTime?: Date;
}) => Promise<void>;
/**
 * Verifies backup integrity
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} backupId - Backup ID
 * @returns {Promise<boolean>} Integrity check result
 *
 * @example
 * ```typescript
 * const isValid = await verifyBackupIntegrity(sequelize, 'backup-123');
 * ```
 */
export declare const verifyBackupIntegrity: (sequelize: Sequelize, backupId: string) => Promise<boolean>;
/**
 * Lists available backups
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} [filters] - Filter criteria
 * @returns {Promise<any[]>} Backup list
 *
 * @example
 * ```typescript
 * const backups = await listBackups(sequelize, {
 *   status: 'completed',
 *   limit: 10
 * });
 * ```
 */
export declare const listBackups: (sequelize: Sequelize, filters?: {
    status?: string;
    limit?: number;
}) => Promise<any[]>;
/**
 * Executes zero-downtime migration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {MigrationConfig} config - Migration configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeZeroDowntimeMigration(sequelize, {
 *   strategy: MigrationStrategy.BLUE_GREEN,
 *   source: 'v1_schema',
 *   target: 'v2_schema',
 *   validation: true
 * });
 * ```
 */
export declare const executeZeroDowntimeMigration: (sequelize: Sequelize, config: MigrationConfig) => Promise<void>;
/**
 * Validates migration before execution
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {MigrationConfig} config - Migration configuration
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateMigration(sequelize, migrationConfig);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare const validateMigration: (sequelize: Sequelize, config: MigrationConfig) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Rolls back migration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} migrationId - Migration ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackMigration(sequelize, 'migration-123');
 * ```
 */
export declare const rollbackMigration: (sequelize: Sequelize, migrationId: string) => Promise<void>;
/**
 * Tracks migration progress
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} migrationId - Migration ID
 * @returns {Promise<any>} Migration progress
 *
 * @example
 * ```typescript
 * const progress = await getMigrationProgress(sequelize, 'migration-123');
 * console.log(`Progress: ${progress.percentage}%`);
 * ```
 */
export declare const getMigrationProgress: (sequelize: Sequelize, migrationId: string) => Promise<any>;
/**
 * Generates network seed data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SeedDataConfig} config - Seed data configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateNetworkSeedData(sequelize, {
 *   environment: 'development',
 *   dataSize: 'medium',
 *   realistic: true
 * });
 * ```
 */
export declare const generateNetworkSeedData: (sequelize: Sequelize, config: SeedDataConfig, transaction?: Transaction) => Promise<void>;
/**
 * Generates device seed data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} count - Number of devices to generate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateDeviceSeedData(sequelize, 100);
 * ```
 */
export declare const generateDeviceSeedData: (sequelize: Sequelize, count: number, transaction?: Transaction) => Promise<void>;
/**
 * Generates topology seed data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} count - Number of topologies to generate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateTopologySeedData(sequelize, 10);
 * ```
 */
export declare const generateTopologySeedData: (sequelize: Sequelize, count: number, transaction?: Transaction) => Promise<void>;
/**
 * Generates configuration seed data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} count - Number of configurations to generate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateConfigurationSeedData(sequelize, 50);
 * ```
 */
export declare const generateConfigurationSeedData: (sequelize: Sequelize, count: number, transaction?: Transaction) => Promise<void>;
/**
 * Generates realistic network metrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} deviceCount - Number of devices
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateRealisticMetrics(sequelize, 100);
 * ```
 */
export declare const generateRealisticMetrics: (sequelize: Sequelize, deviceCount: number, transaction?: Transaction) => Promise<void>;
/**
 * Exports network data to file
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ExportConfig} config - Export configuration
 * @returns {Promise<string>} Export file path
 *
 * @example
 * ```typescript
 * const exportPath = await exportNetworkData(sequelize, {
 *   format: DataFormat.JSON,
 *   tables: ['devices', 'topologies'],
 *   compression: true
 * });
 * ```
 */
export declare const exportNetworkData: (sequelize: Sequelize, config: ExportConfig) => Promise<string>;
/**
 * Imports network data from file
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ImportConfig} config - Import configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ imported: number; errors: number }>} Import result
 *
 * @example
 * ```typescript
 * const result = await importNetworkData(sequelize, {
 *   format: DataFormat.JSON,
 *   source: '/path/to/data.json',
 *   targetTable: 'devices',
 *   batchSize: 1000
 * });
 * ```
 */
export declare const importNetworkData: (sequelize: Sequelize, config: ImportConfig, transaction?: Transaction) => Promise<{
    imported: number;
    errors: number;
}>;
/**
 * Creates version control system for network data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to version
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createDataVersionControl(sequelize, 'devices');
 * ```
 */
export declare const createDataVersionControl: (sequelize: Sequelize, tableName: string, transaction?: Transaction) => Promise<void>;
/**
 * Compresses old backup files
 *
 * @param {string} backupPath - Backup file path
 * @param {string} compressionLevel - Compression level (1-9)
 * @returns {Promise<string>} Compressed file path
 *
 * @example
 * ```typescript
 * const compressed = await compressBackup('/backups/backup.sql', '9');
 * ```
 */
export declare const compressBackup: (backupPath: string, compressionLevel?: string) => Promise<string>;
/**
 * Encrypts backup with AES-256
 *
 * @param {string} backupPath - Backup file path
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<string>} Encrypted file path
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBackup('/backups/backup.sql', process.env.BACKUP_KEY);
 * ```
 */
export declare const encryptBackup: (backupPath: string, encryptionKey: string) => Promise<string>;
/**
 * Decrypts encrypted backup
 *
 * @param {string} encryptedPath - Encrypted file path
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<string>} Decrypted file path
 *
 * @example
 * ```typescript
 * const decrypted = await decryptBackup('/backups/backup.sql.enc', process.env.BACKUP_KEY);
 * ```
 */
export declare const decryptBackup: (encryptedPath: string, encryptionKey: string) => Promise<string>;
/**
 * Archives old snapshots to cold storage
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysOld - Archive snapshots older than this many days
 * @param {string} destination - Archive destination path
 * @returns {Promise<number>} Number of snapshots archived
 *
 * @example
 * ```typescript
 * const archived = await archiveOldSnapshots(sequelize, 90, 's3://archive/snapshots');
 * ```
 */
export declare const archiveOldSnapshots: (sequelize: Sequelize, daysOld: number, destination: string) => Promise<number>;
/**
 * Performs incremental backup
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} baseBackupId - Base backup ID for incremental
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Incremental backup ID
 *
 * @example
 * ```typescript
 * const incrementalId = await performIncrementalBackup(sequelize, 'base-backup-123');
 * ```
 */
export declare const performIncrementalBackup: (sequelize: Sequelize, baseBackupId: string, transaction?: Transaction) => Promise<string>;
/**
 * Cleans up expired backups based on retention policy
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} retentionDays - Retention period in days
 * @returns {Promise<number>} Number of backups deleted
 *
 * @example
 * ```typescript
 * const deleted = await cleanupExpiredBackups(sequelize, 30);
 * ```
 */
export declare const cleanupExpiredBackups: (sequelize: Sequelize, retentionDays: number) => Promise<number>;
/**
 * Validates data integrity after restore
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} tables - Tables to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDataIntegrity(sequelize, ['devices', 'topologies']);
 * ```
 */
export declare const validateDataIntegrity: (sequelize: Sequelize, tables: string[]) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Synchronizes configuration across multiple environments
 *
 * @param {Sequelize} sourceSequelize - Source database connection
 * @param {Sequelize} targetSequelize - Target database connection
 * @param {string[]} deviceIds - Device IDs to synchronize
 * @returns {Promise<number>} Number of configurations synchronized
 *
 * @example
 * ```typescript
 * const synced = await synchronizeConfigurations(
 *   productionDb,
 *   stagingDb,
 *   ['device-1', 'device-2']
 * );
 * ```
 */
export declare const synchronizeConfigurations: (sourceSequelize: Sequelize, targetSequelize: Sequelize, deviceIds: string[]) => Promise<number>;
//# sourceMappingURL=network-persistence-kit.d.ts.map