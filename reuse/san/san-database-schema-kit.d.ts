/**
 * LOC: SAN_DB_KIT_001
 * File: /reuse/san/san-database-schema-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM core)
 *   - sequelize-typescript (decorators)
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - SAN management modules
 *   - Storage infrastructure services
 *   - Database migration files
 *   - SAN monitoring systems
 */
/**
 * File: /reuse/san/san-database-schema-kit.ts
 * Locator: WC-SAN-DBK-001
 * Purpose: SAN Database Schema Kit - Comprehensive database operations for Storage Area Network management
 *
 * Upstream: Sequelize 6.x, Sequelize-TypeScript, NestJS, PostgreSQL
 * Downstream: SAN management services, storage infrastructure, monitoring systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+
 * Exports: 36 utility functions for SAN schema operations, migrations, seeding, validation, indexing
 *
 * LLM Context: Comprehensive SAN (Storage Area Network) database schema utilities for enterprise storage management.
 * Provides Sequelize model definitions for SAN volumes, LUNs, snapshots, and replication configurations.
 * Includes migration helpers, type-safe schema operations, validation utilities, and performance-optimized indexing
 * strategies. Designed for high-performance storage infrastructure with audit trails, temporal tracking, and
 * comprehensive data integrity constraints. Essential for managing enterprise storage operations with compliance
 * requirements and zero tolerance for data loss.
 */
import { Model } from 'sequelize-typescript';
import { QueryInterface, Transaction, Sequelize, Optional, IndexesOptions } from 'sequelize';
/**
 * Volume status enumeration
 */
export declare enum VolumeStatus {
    AVAILABLE = "AVAILABLE",
    IN_USE = "IN_USE",
    CREATING = "CREATING",
    DELETING = "DELETING",
    ERROR = "ERROR",
    MAINTENANCE = "MAINTENANCE"
}
/**
 * LUN status enumeration
 */
export declare enum LunStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    DEGRADED = "DEGRADED",
    FAILED = "FAILED",
    INITIALIZING = "INITIALIZING"
}
/**
 * Snapshot status enumeration
 */
export declare enum SnapshotStatus {
    CREATING = "CREATING",
    AVAILABLE = "AVAILABLE",
    DELETING = "DELETING",
    ERROR = "ERROR",
    RESTORING = "RESTORING"
}
/**
 * Replication status enumeration
 */
export declare enum ReplicationStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    SYNCING = "SYNCING",
    ERROR = "ERROR",
    STOPPED = "STOPPED"
}
/**
 * Storage protocol enumeration
 */
export declare enum StorageProtocol {
    ISCSI = "ISCSI",
    FC = "FC",
    FCOE = "FCOE",
    NFS = "NFS",
    SMB = "SMB"
}
/**
 * Replication type enumeration
 */
export declare enum ReplicationType {
    SYNCHRONOUS = "SYNCHRONOUS",
    ASYNCHRONOUS = "ASYNCHRONOUS",
    SNAPSHOT = "SNAPSHOT"
}
/**
 * SAN Volume attributes
 */
export interface SanVolumeAttributes {
    id: string;
    name: string;
    description?: string;
    capacityGb: number;
    usedCapacityGb: number;
    status: VolumeStatus;
    storagePoolId?: string;
    protocol: StorageProtocol;
    wwn?: string;
    serialNumber?: string;
    thinProvisioned: boolean;
    compressionEnabled: boolean;
    deduplicationEnabled: boolean;
    encryptionEnabled: boolean;
    iopsLimit?: number;
    throughputMbps?: number;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface SanVolumeCreationAttributes extends Optional<SanVolumeAttributes, 'id' | 'description' | 'usedCapacityGb' | 'storagePoolId' | 'wwn' | 'serialNumber' | 'thinProvisioned' | 'compressionEnabled' | 'deduplicationEnabled' | 'encryptionEnabled' | 'iopsLimit' | 'throughputMbps' | 'tags' | 'metadata' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
}
/**
 * SAN LUN attributes
 */
export interface SanLunAttributes {
    id: string;
    lunNumber: number;
    name: string;
    description?: string;
    volumeId: string;
    capacityGb: number;
    status: LunStatus;
    targetId?: string;
    initiatorGroup?: string;
    maskedTo?: string[];
    readOnly: boolean;
    blockSizeBytes: number;
    multipath: boolean;
    alua: boolean;
    iopsRead?: number;
    iopsWrite?: number;
    latencyMs?: number;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface SanLunCreationAttributes extends Optional<SanLunAttributes, 'id' | 'description' | 'targetId' | 'initiatorGroup' | 'maskedTo' | 'readOnly' | 'blockSizeBytes' | 'multipath' | 'alua' | 'iopsRead' | 'iopsWrite' | 'latencyMs' | 'tags' | 'metadata' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
}
/**
 * SAN Snapshot attributes
 */
export interface SanSnapshotAttributes {
    id: string;
    name: string;
    description?: string;
    volumeId?: string;
    lunId?: string;
    status: SnapshotStatus;
    sizeGb: number;
    retentionDays?: number;
    expiresAt?: Date;
    isAutomatic: boolean;
    scheduleId?: string;
    consistencyGroupId?: string;
    sourceSnapshotId?: string;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface SanSnapshotCreationAttributes extends Optional<SanSnapshotAttributes, 'id' | 'description' | 'volumeId' | 'lunId' | 'retentionDays' | 'expiresAt' | 'isAutomatic' | 'scheduleId' | 'consistencyGroupId' | 'sourceSnapshotId' | 'tags' | 'metadata' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
}
/**
 * SAN Replication attributes
 */
export interface SanReplicationAttributes {
    id: string;
    name: string;
    description?: string;
    sourceVolumeId: string;
    targetVolumeId: string;
    replicationType: ReplicationType;
    status: ReplicationStatus;
    direction: 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE' | 'BIDIRECTIONAL';
    priority: number;
    rpoMinutes?: number;
    rtoMinutes?: number;
    lastSyncAt?: Date;
    nextSyncAt?: Date;
    syncIntervalMinutes?: number;
    bandwidthLimitMbps?: number;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
    errorCount: number;
    lastError?: string;
    totalBytesSynced?: number;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface SanReplicationCreationAttributes extends Optional<SanReplicationAttributes, 'id' | 'description' | 'priority' | 'rpoMinutes' | 'rtoMinutes' | 'lastSyncAt' | 'nextSyncAt' | 'syncIntervalMinutes' | 'bandwidthLimitMbps' | 'compressionEnabled' | 'encryptionEnabled' | 'errorCount' | 'lastError' | 'totalBytesSynced' | 'tags' | 'metadata' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
}
/**
 * SanVolume Model
 * Represents a storage volume in the SAN infrastructure
 */
export declare class SanVolume extends Model<SanVolumeAttributes, SanVolumeCreationAttributes> {
    id: string;
    name: string;
    description?: string;
    capacityGb: number;
    usedCapacityGb: number;
    status: VolumeStatus;
    storagePoolId?: string;
    protocol: StorageProtocol;
    wwn?: string;
    serialNumber?: string;
    thinProvisioned: boolean;
    compressionEnabled: boolean;
    deduplicationEnabled: boolean;
    encryptionEnabled: boolean;
    iopsLimit?: number;
    throughputMbps?: number;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    luns?: SanLun[];
    snapshots?: SanSnapshot[];
    sourceReplications?: SanReplication[];
    targetReplications?: SanReplication[];
    static generateWwn(instance: SanVolume): Promise<void>;
    static validateCapacity(instance: SanVolume): void;
    get availableCapacityGb(): number;
    get utilizationPercent(): number;
}
/**
 * SanLun Model
 * Represents a Logical Unit Number (LUN) in the SAN
 */
export declare class SanLun extends Model<SanLunAttributes, SanLunCreationAttributes> {
    id: string;
    lunNumber: number;
    name: string;
    description?: string;
    volumeId: string;
    capacityGb: number;
    status: LunStatus;
    targetId?: string;
    initiatorGroup?: string;
    maskedTo?: string[];
    readOnly: boolean;
    blockSizeBytes: number;
    multipath: boolean;
    alua: boolean;
    iopsRead?: number;
    iopsWrite?: number;
    latencyMs?: number;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    volume?: SanVolume;
    snapshots?: SanSnapshot[];
    static validateLunNumber(instance: SanLun): void;
    get totalIops(): number;
}
export declare class SanSnapshot extends Model<SanSnapshotAttributes, SanSnapshotCreationAttributes> {
    id: string;
    name: string;
    description?: string;
    volumeId?: string;
    lunId?: string;
    status: SnapshotStatus;
    sizeGb: number;
    retentionDays?: number;
    expiresAt?: Date;
    isAutomatic: boolean;
    scheduleId?: string;
    consistencyGroupId?: string;
    sourceSnapshotId?: string;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    volume?: SanVolume;
    lun?: SanLun;
    static setExpirationDate(instance: SanSnapshot): void;
    static validateVolumeOrLun(instance: SanSnapshot): void;
    get isExpired(): boolean;
    get daysUntilExpiration(): number | null;
}
/**
 * SanReplication Model
 * Represents replication configuration between volumes
 */
export declare class SanReplication extends Model<SanReplicationAttributes, SanReplicationCreationAttributes> {
    id: string;
    name: string;
    description?: string;
    sourceVolumeId: string;
    targetVolumeId: string;
    replicationType: ReplicationType;
    status: ReplicationStatus;
    direction: 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE' | 'BIDIRECTIONAL';
    priority: number;
    rpoMinutes?: number;
    rtoMinutes?: number;
    lastSyncAt?: Date;
    nextSyncAt?: Date;
    syncIntervalMinutes?: number;
    bandwidthLimitMbps?: number;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
    errorCount: number;
    lastError?: string;
    totalBytesSynced?: number;
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    sourceVolume?: SanVolume;
    targetVolume?: SanVolume;
    static validateVolumes(instance: SanReplication): void;
    static calculateNextSync(instance: SanReplication): void;
    get totalGbSynced(): number;
    get isHealthy(): boolean;
    get syncLag(): number | null;
}
/**
 * Function 1: Create SanVolume table
 */
export declare function createSanVolumeTable(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 2: Create SanLun table
 */
export declare function createSanLunTable(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 3: Create SanSnapshot table
 */
export declare function createSanSnapshotTable(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 4: Create SanReplication table
 */
export declare function createSanReplicationTable(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 5: Add column to SAN table
 */
export declare function addColumnToSanTable(queryInterface: QueryInterface, tableName: string, columnName: string, columnDefinition: any, transaction?: Transaction): Promise<void>;
/**
 * Function 6: Modify column in SAN table
 */
export declare function modifyColumnInSanTable(queryInterface: QueryInterface, tableName: string, columnName: string, columnDefinition: any, transaction?: Transaction): Promise<void>;
/**
 * Function 7: Drop column from SAN table
 */
export declare function dropColumnFromSanTable(queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction): Promise<void>;
/**
 * Function 8: Create index on SAN table
 */
export declare function createIndexOnSanTable(queryInterface: QueryInterface, tableName: string, indexDefinition: IndexesOptions, transaction?: Transaction): Promise<void>;
/**
 * Function 9: Initialize complete SAN schema
 */
export declare function initializeSanSchema(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 10: Validate SAN schema structure
 */
export declare function validateSanSchema(queryInterface: QueryInterface): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Function 11: Migrate SAN schema to new version
 */
export declare function migrateSanSchema(queryInterface: QueryInterface, fromVersion: string, toVersion: string, transaction?: Transaction): Promise<void>;
/**
 * Function 12: Rollback SAN schema to previous version
 */
export declare function rollbackSanSchema(queryInterface: QueryInterface, toVersion: string, transaction?: Transaction): Promise<void>;
/**
 * Function 13: Get SAN schema version
 */
export declare function getSanSchemaVersion(sequelize: Sequelize): Promise<string>;
/**
 * Function 14: Compare two SAN schemas
 */
export declare function compareSanSchemas(queryInterface1: QueryInterface, queryInterface2: QueryInterface): Promise<{
    differences: string[];
    identical: boolean;
}>;
/**
 * Function 15: Seed SAN volumes
 */
export declare function seedSanVolumes(sequelize: Sequelize, count?: number): Promise<SanVolume[]>;
/**
 * Function 16: Seed SAN LUNs
 */
export declare function seedSanLuns(sequelize: Sequelize, volumeIds: string[], lunsPerVolume?: number): Promise<SanLun[]>;
/**
 * Function 17: Validate SAN volume data
 */
export declare function validateSanVolumeData(data: Partial<SanVolumeAttributes>): {
    valid: boolean;
    errors: string[];
};
/**
 * Function 18: Validate SAN replication configuration
 */
export declare function validateSanReplicationConfig(data: Partial<SanReplicationAttributes>): {
    valid: boolean;
    errors: string[];
};
/**
 * Function 19: Create SAN volume indexes
 */
export declare function createSanVolumeIndexes(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 20: Create SAN LUN indexes
 */
export declare function createSanLunIndexes(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 21: Create SAN snapshot indexes
 */
export declare function createSanSnapshotIndexes(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 22: Create SAN replication indexes
 */
export declare function createSanReplicationIndexes(queryInterface: QueryInterface, transaction?: Transaction): Promise<void>;
/**
 * Function 23: Get volume capacity statistics
 */
export declare function getVolumeCapacityStats(sequelize: Sequelize): Promise<{
    totalCapacityGb: number;
    usedCapacityGb: number;
    availableCapacityGb: number;
    utilizationPercent: number;
}>;
/**
 * Function 24: Get LUN performance metrics
 */
export declare function getLunPerformanceMetrics(lunId: string, sequelize: Sequelize): Promise<{
    lunId: string;
    avgLatencyMs: number;
    totalIops: number;
    readWriteRatio: number;
} | null>;
/**
 * Function 25: Get snapshot retention compliance
 */
export declare function getSnapshotRetentionCompliance(sequelize: Sequelize): Promise<{
    totalSnapshots: number;
    expiredSnapshots: number;
    expiringSoonSnapshots: number;
    compliancePercent: number;
}>;
/**
 * Function 26: Get replication health status
 */
export declare function getReplicationHealthStatus(sequelize: Sequelize): Promise<{
    totalReplications: number;
    healthyReplications: number;
    unhealthyReplications: number;
    avgSyncLagMinutes: number;
}>;
/**
 * Function 27: Find volumes by utilization threshold
 */
export declare function findVolumesByUtilization(minUtilizationPercent: number, maxUtilizationPercent?: number): Promise<SanVolume[]>;
/**
 * Function 28: Find LUNs with high latency
 */
export declare function findLunsWithHighLatency(latencyThresholdMs: number): Promise<SanLun[]>;
/**
 * Function 29: Find expired snapshots
 */
export declare function findExpiredSnapshots(): Promise<SanSnapshot[]>;
/**
 * Function 30: Find stale replications
 */
export declare function findStaleReplications(staleLagMinutes: number): Promise<SanReplication[]>;
/**
 * Function 31: Bulk create volumes
 */
export declare function bulkCreateVolumes(volumeData: SanVolumeCreationAttributes[], transaction?: Transaction): Promise<SanVolume[]>;
/**
 * Function 32: Bulk update volume status
 */
export declare function bulkUpdateVolumeStatus(volumeIds: string[], status: VolumeStatus, transaction?: Transaction): Promise<number>;
/**
 * Function 33: Bulk delete expired snapshots
 */
export declare function bulkDeleteExpiredSnapshots(transaction?: Transaction): Promise<number>;
/**
 * Function 34: Bulk create snapshots for volumes
 */
export declare function bulkCreateSnapshotsForVolumes(volumeIds: string[], retentionDays: number, transaction?: Transaction): Promise<SanSnapshot[]>;
/**
 * Function 35: Cleanup deleted resources
 */
export declare function cleanupDeletedResources(olderThanDays: number, transaction?: Transaction): Promise<{
    volumesDeleted: number;
    lunsDeleted: number;
    snapshotsDeleted: number;
    replicationsDeleted: number;
}>;
/**
 * Function 36: Optimize SAN database tables
 */
export declare function optimizeSanDatabaseTables(sequelize: Sequelize): Promise<{
    tablesOptimized: string[];
    statistics: Record<string, any>;
}>;
export declare const SanModels: {
    SanVolume: typeof SanVolume;
    SanLun: typeof SanLun;
    SanSnapshot: typeof SanSnapshot;
    SanReplication: typeof SanReplication;
};
export declare const SanMigrationHelpers: {
    createSanVolumeTable: typeof createSanVolumeTable;
    createSanLunTable: typeof createSanLunTable;
    createSanSnapshotTable: typeof createSanSnapshotTable;
    createSanReplicationTable: typeof createSanReplicationTable;
    addColumnToSanTable: typeof addColumnToSanTable;
    modifyColumnInSanTable: typeof modifyColumnInSanTable;
    dropColumnFromSanTable: typeof dropColumnFromSanTable;
    createIndexOnSanTable: typeof createIndexOnSanTable;
};
export declare const SanSchemaOperations: {
    initializeSanSchema: typeof initializeSanSchema;
    validateSanSchema: typeof validateSanSchema;
    migrateSanSchema: typeof migrateSanSchema;
    rollbackSanSchema: typeof rollbackSanSchema;
    getSanSchemaVersion: typeof getSanSchemaVersion;
    compareSanSchemas: typeof compareSanSchemas;
};
export declare const SanSeedingValidation: {
    seedSanVolumes: typeof seedSanVolumes;
    seedSanLuns: typeof seedSanLuns;
    validateSanVolumeData: typeof validateSanVolumeData;
    validateSanReplicationConfig: typeof validateSanReplicationConfig;
};
export declare const SanIndexing: {
    createSanVolumeIndexes: typeof createSanVolumeIndexes;
    createSanLunIndexes: typeof createSanLunIndexes;
    createSanSnapshotIndexes: typeof createSanSnapshotIndexes;
    createSanReplicationIndexes: typeof createSanReplicationIndexes;
};
export declare const SanQueryFunctions: {
    getVolumeCapacityStats: typeof getVolumeCapacityStats;
    getLunPerformanceMetrics: typeof getLunPerformanceMetrics;
    getSnapshotRetentionCompliance: typeof getSnapshotRetentionCompliance;
    getReplicationHealthStatus: typeof getReplicationHealthStatus;
    findVolumesByUtilization: typeof findVolumesByUtilization;
    findLunsWithHighLatency: typeof findLunsWithHighLatency;
    findExpiredSnapshots: typeof findExpiredSnapshots;
    findStaleReplications: typeof findStaleReplications;
};
export declare const SanBulkOperations: {
    bulkCreateVolumes: typeof bulkCreateVolumes;
    bulkUpdateVolumeStatus: typeof bulkUpdateVolumeStatus;
    bulkDeleteExpiredSnapshots: typeof bulkDeleteExpiredSnapshots;
    bulkCreateSnapshotsForVolumes: typeof bulkCreateSnapshotsForVolumes;
};
export declare const SanMaintenance: {
    cleanupDeletedResources: typeof cleanupDeletedResources;
    optimizeSanDatabaseTables: typeof optimizeSanDatabaseTables;
};
//# sourceMappingURL=san-database-schema-kit.d.ts.map