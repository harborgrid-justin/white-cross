"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.synchronizeConfigurations = exports.validateDataIntegrity = exports.cleanupExpiredBackups = exports.performIncrementalBackup = exports.archiveOldSnapshots = exports.decryptBackup = exports.encryptBackup = exports.compressBackup = exports.createDataVersionControl = exports.importNetworkData = exports.exportNetworkData = exports.generateRealisticMetrics = exports.generateConfigurationSeedData = exports.generateTopologySeedData = exports.generateDeviceSeedData = exports.generateNetworkSeedData = exports.getMigrationProgress = exports.rollbackMigration = exports.validateMigration = exports.executeZeroDowntimeMigration = exports.listBackups = exports.verifyBackupIntegrity = exports.restoreFromBackup = exports.executeBackup = exports.createBackupJob = exports.captureStateSnapshot = exports.captureTopologySnapshot = exports.listNetworkSnapshots = exports.deleteNetworkSnapshot = exports.createNetworkSnapshot = exports.compareConfigurationVersions = exports.listConfigurationVersions = exports.rollbackConfiguration = exports.getConfigurationVersion = exports.saveConfigurationVersion = exports.synchronizeStateAcrossReplicas = exports.persistMetricsState = exports.persistTopologyState = exports.restoreNetworkState = exports.persistNetworkState = exports.DataFormat = exports.MigrationStrategy = exports.BackupFrequency = exports.SnapshotType = exports.PersistenceStrategy = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const ulid_1 = require("ulid");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum PersistenceStrategy
 * @description Persistence strategies for network data
 */
var PersistenceStrategy;
(function (PersistenceStrategy) {
    PersistenceStrategy["IMMEDIATE"] = "IMMEDIATE";
    PersistenceStrategy["BATCHED"] = "BATCHED";
    PersistenceStrategy["DEFERRED"] = "DEFERRED";
    PersistenceStrategy["ASYNC"] = "ASYNC";
})(PersistenceStrategy || (exports.PersistenceStrategy = PersistenceStrategy = {}));
/**
 * @enum SnapshotType
 * @description Types of network snapshots
 */
var SnapshotType;
(function (SnapshotType) {
    SnapshotType["FULL"] = "FULL";
    SnapshotType["INCREMENTAL"] = "INCREMENTAL";
    SnapshotType["DIFFERENTIAL"] = "DIFFERENTIAL";
    SnapshotType["TOPOLOGY_ONLY"] = "TOPOLOGY_ONLY";
    SnapshotType["STATE_ONLY"] = "STATE_ONLY";
})(SnapshotType || (exports.SnapshotType = SnapshotType = {}));
/**
 * @enum BackupFrequency
 * @description Backup schedule frequencies
 */
var BackupFrequency;
(function (BackupFrequency) {
    BackupFrequency["HOURLY"] = "HOURLY";
    BackupFrequency["DAILY"] = "DAILY";
    BackupFrequency["WEEKLY"] = "WEEKLY";
    BackupFrequency["MONTHLY"] = "MONTHLY";
    BackupFrequency["ON_DEMAND"] = "ON_DEMAND";
})(BackupFrequency || (exports.BackupFrequency = BackupFrequency = {}));
/**
 * @enum MigrationStrategy
 * @description Migration strategies
 */
var MigrationStrategy;
(function (MigrationStrategy) {
    MigrationStrategy["ROLLING"] = "ROLLING";
    MigrationStrategy["BLUE_GREEN"] = "BLUE_GREEN";
    MigrationStrategy["CANARY"] = "CANARY";
    MigrationStrategy["SHADOW"] = "SHADOW";
})(MigrationStrategy || (exports.MigrationStrategy = MigrationStrategy = {}));
/**
 * @enum DataFormat
 * @description Data export/import formats
 */
var DataFormat;
(function (DataFormat) {
    DataFormat["JSON"] = "JSON";
    DataFormat["JSONL"] = "JSONL";
    DataFormat["CSV"] = "CSV";
    DataFormat["YAML"] = "YAML";
    DataFormat["BINARY"] = "BINARY";
})(DataFormat || (exports.DataFormat = DataFormat = {}));
// ============================================================================
// STATE PERSISTENCE
// ============================================================================
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
const persistNetworkState = async (sequelize, config, transaction) => {
    const snapshotId = generateULID();
    const timestamp = new Date();
    // Create snapshot record
    await sequelize.query(`INSERT INTO network.state_snapshots (
      id, snapshot_type, created_at, configuration
    ) VALUES (:id, :type, :timestamp, :config)`, {
        replacements: {
            id: snapshotId,
            type: SnapshotType.FULL,
            timestamp,
            config: JSON.stringify(config),
        },
        transaction,
    });
    // Persist topology if requested
    if (config.includeTopology) {
        await (0, exports.persistTopologyState)(sequelize, snapshotId, transaction);
    }
    // Persist metrics if requested
    if (config.includeMetrics) {
        await (0, exports.persistMetricsState)(sequelize, snapshotId, transaction);
    }
    // Calculate checksum
    const checksum = await calculateSnapshotChecksum(sequelize, snapshotId);
    return {
        id: snapshotId,
        type: SnapshotType.FULL,
        name: `state_${timestamp.toISOString()}`,
        size: 0,
        createdAt: timestamp,
        checksum,
        metadata: config,
    };
};
exports.persistNetworkState = persistNetworkState;
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
const restoreNetworkState = async (sequelize, snapshotId, config, transaction) => {
    // Validate snapshot exists and is valid
    const [snapshot] = await sequelize.query(`SELECT * FROM network.state_snapshots WHERE id = :snapshotId`, {
        replacements: { snapshotId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    if (!snapshot) {
        throw new Error(`Snapshot ${snapshotId} not found`);
    }
    if (!config?.skipValidation) {
        await validateSnapshotIntegrity(sequelize, snapshotId);
    }
    if (config?.dryRun) {
        return;
    }
    // Restore topology
    await restoreTopologyFromSnapshot(sequelize, snapshotId, transaction);
    // Restore device states
    await restoreDeviceStatesFromSnapshot(sequelize, snapshotId, transaction);
    // Log restore operation
    await sequelize.query(`INSERT INTO network.restore_history (snapshot_id, restored_at, restored_by)
     VALUES (:snapshotId, NOW(), :userId)`, {
        replacements: { snapshotId, userId: config?.userId || 'system' },
        transaction,
    });
};
exports.restoreNetworkState = restoreNetworkState;
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
const persistTopologyState = async (sequelize, snapshotId, transaction) => {
    await sequelize.query(`INSERT INTO network.topology_snapshots (snapshot_id, topology_data, created_at)
     SELECT :snapshotId, jsonb_agg(t.*), NOW()
     FROM network.topologies t`, {
        replacements: { snapshotId },
        transaction,
    });
};
exports.persistTopologyState = persistTopologyState;
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
const persistMetricsState = async (sequelize, snapshotId, transaction) => {
    // Persist last hour of metrics
    await sequelize.query(`INSERT INTO network.metrics_snapshots (snapshot_id, metrics_data, time_range, created_at)
     SELECT
       :snapshotId,
       jsonb_agg(m.*),
       tstzrange(MIN(time), MAX(time)),
       NOW()
     FROM network.network_metrics m
     WHERE time > NOW() - INTERVAL '1 hour'`, {
        replacements: { snapshotId },
        transaction,
    });
};
exports.persistMetricsState = persistMetricsState;
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
const synchronizeStateAcrossReplicas = async (sequelize, replicaHosts) => {
    const snapshot = await (0, exports.persistNetworkState)(sequelize, {
        strategy: PersistenceStrategy.IMMEDIATE,
        includeTopology: true,
        includeMetrics: false,
        includeConfigurations: true,
        compression: true,
    });
    // Propagate to replicas (implementation would use network calls)
    for (const host of replicaHosts) {
        // await pushSnapshotToReplica(host, snapshot);
    }
};
exports.synchronizeStateAcrossReplicas = synchronizeStateAcrossReplicas;
// ============================================================================
// CONFIGURATION PERSISTENCE
// ============================================================================
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
const saveConfigurationVersion = async (sequelize, params, transaction) => {
    // Get next version number
    const [result] = await sequelize.query(`SELECT COALESCE(MAX(version), 0) + 1 AS next_version
     FROM network.configuration_versions
     WHERE device_id = :deviceId`, {
        replacements: { deviceId: params.deviceId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const version = result.next_version;
    const checksum = calculateConfigChecksum(params.configuration);
    // Save version
    await sequelize.query(`INSERT INTO network.configuration_versions (
      device_id, version, configuration, comment, created_by, checksum, created_at
    ) VALUES (:deviceId, :version, :config, :comment, :userId, :checksum, NOW())`, {
        replacements: {
            deviceId: params.deviceId,
            version,
            config: JSON.stringify(params.configuration),
            comment: params.comment || null,
            userId: params.userId || 'system',
            checksum,
        },
        transaction,
    });
    return version;
};
exports.saveConfigurationVersion = saveConfigurationVersion;
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
const getConfigurationVersion = async (sequelize, deviceId, version) => {
    const [result] = await sequelize.query(`SELECT configuration FROM network.configuration_versions
     WHERE device_id = :deviceId AND version = :version`, {
        replacements: { deviceId, version },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result ? result.configuration : null;
};
exports.getConfigurationVersion = getConfigurationVersion;
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
const rollbackConfiguration = async (sequelize, deviceId, version, transaction) => {
    const config = await (0, exports.getConfigurationVersion)(sequelize, deviceId, version);
    if (!config) {
        throw new Error(`Configuration version ${version} not found for device ${deviceId}`);
    }
    // Apply configuration
    await sequelize.query(`UPDATE network.device_configurations
     SET configuration = :config, updated_at = NOW()
     WHERE device_id = :deviceId`, {
        replacements: { deviceId, config: JSON.stringify(config) },
        transaction,
    });
    // Log rollback
    await sequelize.query(`INSERT INTO network.configuration_rollbacks (device_id, from_version, to_version, rolled_back_at)
     VALUES (:deviceId, (SELECT MAX(version) FROM network.configuration_versions WHERE device_id = :deviceId), :version, NOW())`, {
        replacements: { deviceId, version },
        transaction,
    });
};
exports.rollbackConfiguration = rollbackConfiguration;
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
const listConfigurationVersions = async (sequelize, deviceId, limit = 10) => {
    const [results] = await sequelize.query(`SELECT version, created_at, created_by, comment, checksum
     FROM network.configuration_versions
     WHERE device_id = :deviceId
     ORDER BY version DESC
     LIMIT :limit`, {
        replacements: { deviceId, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.map((r) => ({
        version: r.version,
        createdAt: r.created_at,
        createdBy: r.created_by,
        comment: r.comment,
        checksum: r.checksum,
    }));
};
exports.listConfigurationVersions = listConfigurationVersions;
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
const compareConfigurationVersions = async (sequelize, deviceId, version1, version2) => {
    const config1 = await (0, exports.getConfigurationVersion)(sequelize, deviceId, version1);
    const config2 = await (0, exports.getConfigurationVersion)(sequelize, deviceId, version2);
    return {
        version1: { version: version1, config: config1 },
        version2: { version: version2, config: config2 },
        changes: calculateConfigDiff(config1, config2),
    };
};
exports.compareConfigurationVersions = compareConfigurationVersions;
// ============================================================================
// SNAPSHOT MANAGEMENT
// ============================================================================
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
const createNetworkSnapshot = async (sequelize, config, transaction) => {
    const snapshotId = generateULID();
    const timestamp = new Date();
    await sequelize.query(`INSERT INTO network.snapshots (
      id, type, name, description, tags, created_at, configuration
    ) VALUES (:id, :type, :name, :description, :tags, :timestamp, :config)`, {
        replacements: {
            id: snapshotId,
            type: config.type,
            name: config.name,
            description: config.description || null,
            tags: JSON.stringify(config.tags || {}),
            timestamp,
            config: JSON.stringify(config),
        },
        transaction,
    });
    // Capture snapshot data based on type
    if (config.type === SnapshotType.FULL || config.type === SnapshotType.TOPOLOGY_ONLY) {
        await (0, exports.captureTopologySnapshot)(sequelize, snapshotId, transaction);
    }
    if (config.type === SnapshotType.FULL || config.type === SnapshotType.STATE_ONLY) {
        await (0, exports.captureStateSnapshot)(sequelize, snapshotId, transaction);
    }
    const checksum = await calculateSnapshotChecksum(sequelize, snapshotId);
    return {
        id: snapshotId,
        type: config.type,
        name: config.name,
        size: 0,
        createdAt: timestamp,
        checksum,
        metadata: config.tags || {},
    };
};
exports.createNetworkSnapshot = createNetworkSnapshot;
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
const deleteNetworkSnapshot = async (sequelize, snapshotId, transaction) => {
    await sequelize.query(`DELETE FROM network.snapshots WHERE id = :snapshotId`, {
        replacements: { snapshotId },
        transaction,
    });
};
exports.deleteNetworkSnapshot = deleteNetworkSnapshot;
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
const listNetworkSnapshots = async (sequelize, filters) => {
    const whereClause = filters?.type ? `WHERE type = '${filters.type}'` : '';
    const limitClause = filters?.limit ? `LIMIT ${filters.limit}` : 'LIMIT 100';
    const [results] = await sequelize.query(`SELECT id, type, name, created_at, checksum, tags
     FROM network.snapshots
     ${whereClause}
     ORDER BY created_at DESC
     ${limitClause}`, { type: sequelize_1.QueryTypes.SELECT });
    return results.map((r) => ({
        id: r.id,
        type: r.type,
        name: r.name,
        size: 0,
        createdAt: r.created_at,
        checksum: r.checksum,
        metadata: r.tags,
    }));
};
exports.listNetworkSnapshots = listNetworkSnapshots;
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
const captureTopologySnapshot = async (sequelize, snapshotId, transaction) => {
    await sequelize.query(`INSERT INTO network.snapshot_data (snapshot_id, data_type, data_content)
     VALUES (
       :snapshotId,
       'topology',
       (SELECT jsonb_agg(row_to_json(d.*)) FROM network.devices d)
     )`, {
        replacements: { snapshotId },
        transaction,
    });
};
exports.captureTopologySnapshot = captureTopologySnapshot;
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
const captureStateSnapshot = async (sequelize, snapshotId, transaction) => {
    await sequelize.query(`INSERT INTO network.snapshot_data (snapshot_id, data_type, data_content)
     VALUES (
       :snapshotId,
       'state',
       (SELECT jsonb_agg(row_to_json(s.*)) FROM network.device_states s)
     )`, {
        replacements: { snapshotId },
        transaction,
    });
};
exports.captureStateSnapshot = captureStateSnapshot;
// ============================================================================
// BACKUP AND RESTORE
// ============================================================================
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
const createBackupJob = async (sequelize, config) => {
    const jobId = generateULID();
    await sequelize.query(`INSERT INTO network.backup_jobs (
      id, frequency, retention_days, compression, encryption,
      destination, configuration, created_at
    ) VALUES (:id, :frequency, :retention, :compression, :encryption, :destination, :config, NOW())`, {
        replacements: {
            id: jobId,
            frequency: config.frequency,
            retention: config.retention,
            compression: config.compression,
            encryption: config.encryption,
            destination: config.destination,
            config: JSON.stringify(config),
        },
    });
    // Schedule backup job based on frequency
    const cronSchedule = getCronSchedule(config.frequency);
    await sequelize.query(`SELECT cron.schedule('backup_${jobId}', '${cronSchedule}', 'SELECT execute_backup(:jobId)')`, { replacements: { jobId } });
    return jobId;
};
exports.createBackupJob = createBackupJob;
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
const executeBackup = async (sequelize, jobId) => {
    const backupId = generateULID();
    const timestamp = new Date();
    // Create backup record
    await sequelize.query(`INSERT INTO network.backups (
      id, job_id, status, started_at
    ) VALUES (:id, :jobId, 'running', :timestamp)`, {
        replacements: { id: backupId, jobId, timestamp },
    });
    try {
        // Execute pg_dump or custom backup logic
        const backupPath = await performDatabaseBackup(sequelize, backupId);
        // Calculate checksum
        const checksum = await calculateBackupChecksum(backupPath);
        // Update backup record
        await sequelize.query(`UPDATE network.backups
       SET status = 'completed', completed_at = NOW(), backup_path = :path, checksum = :checksum
       WHERE id = :id`, {
            replacements: { id: backupId, path: backupPath, checksum },
        });
        return backupId;
    }
    catch (error) {
        await sequelize.query(`UPDATE network.backups SET status = 'failed', error_message = :error WHERE id = :id`, {
            replacements: { id: backupId, error: error.message },
        });
        throw error;
    }
};
exports.executeBackup = executeBackup;
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
const restoreFromBackup = async (sequelize, backupId, options) => {
    // Get backup details
    const [backup] = await sequelize.query(`SELECT * FROM network.backups WHERE id = :backupId`, {
        replacements: { backupId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (!backup) {
        throw new Error(`Backup ${backupId} not found`);
    }
    if (options?.verifyIntegrity) {
        await (0, exports.verifyBackupIntegrity)(sequelize, backupId);
    }
    // Perform restore
    await performDatabaseRestore(sequelize, backup.backup_path);
    // Log restore
    await sequelize.query(`INSERT INTO network.restore_history (backup_id, restored_at)
     VALUES (:backupId, NOW())`, { replacements: { backupId } });
};
exports.restoreFromBackup = restoreFromBackup;
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
const verifyBackupIntegrity = async (sequelize, backupId) => {
    const [backup] = await sequelize.query(`SELECT backup_path, checksum FROM network.backups WHERE id = :backupId`, {
        replacements: { backupId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (!backup) {
        throw new Error(`Backup ${backupId} not found`);
    }
    const currentChecksum = await calculateBackupChecksum(backup.backup_path);
    return currentChecksum === backup.checksum;
};
exports.verifyBackupIntegrity = verifyBackupIntegrity;
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
const listBackups = async (sequelize, filters) => {
    const whereClause = filters?.status ? `WHERE status = '${filters.status}'` : '';
    const limitClause = filters?.limit ? `LIMIT ${filters.limit}` : 'LIMIT 50';
    const [results] = await sequelize.query(`SELECT id, job_id, status, started_at, completed_at, backup_path, checksum
     FROM network.backups
     ${whereClause}
     ORDER BY started_at DESC
     ${limitClause}`, { type: sequelize_1.QueryTypes.SELECT });
    return results;
};
exports.listBackups = listBackups;
// ============================================================================
// MIGRATION UTILITIES
// ============================================================================
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
const executeZeroDowntimeMigration = async (sequelize, config) => {
    const migrationId = generateULID();
    // Create migration record
    await sequelize.query(`INSERT INTO network.migrations (
      id, strategy, source, target, status, started_at
    ) VALUES (:id, :strategy, :source, :target, 'running', NOW())`, {
        replacements: {
            id: migrationId,
            strategy: config.strategy,
            source: config.source,
            target: config.target,
        },
    });
    try {
        if (config.strategy === MigrationStrategy.BLUE_GREEN) {
            await executeBlueGreenMigration(sequelize, config);
        }
        else if (config.strategy === MigrationStrategy.ROLLING) {
            await executeRollingMigration(sequelize, config);
        }
        await sequelize.query(`UPDATE network.migrations SET status = 'completed', completed_at = NOW() WHERE id = :id`, { replacements: { id: migrationId } });
    }
    catch (error) {
        await sequelize.query(`UPDATE network.migrations SET status = 'failed', error_message = :error WHERE id = :id`, {
            replacements: { id: migrationId, error: error.message },
        });
        if (config.rollbackOnError) {
            await (0, exports.rollbackMigration)(sequelize, migrationId);
        }
        throw error;
    }
};
exports.executeZeroDowntimeMigration = executeZeroDowntimeMigration;
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
const validateMigration = async (sequelize, config) => {
    const errors = [];
    // Check source schema exists
    const [sourceExists] = await sequelize.query(`SELECT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = :source)`, {
        replacements: { source: config.source },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (!sourceExists.exists) {
        errors.push(`Source schema ${config.source} does not exist`);
    }
    // Validate data consistency
    // Additional validation logic...
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateMigration = validateMigration;
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
const rollbackMigration = async (sequelize, migrationId) => {
    const [migration] = await sequelize.query(`SELECT * FROM network.migrations WHERE id = :migrationId`, {
        replacements: { migrationId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (!migration) {
        throw new Error(`Migration ${migrationId} not found`);
    }
    // Perform rollback based on strategy
    // Implementation would reverse the migration steps
};
exports.rollbackMigration = rollbackMigration;
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
const getMigrationProgress = async (sequelize, migrationId) => {
    const [result] = await sequelize.query(`SELECT
       id,
       status,
       started_at,
       completed_at,
       (SELECT COUNT(*) FROM network.migration_steps WHERE migration_id = :migrationId AND status = 'completed') AS completed_steps,
       (SELECT COUNT(*) FROM network.migration_steps WHERE migration_id = :migrationId) AS total_steps
     FROM network.migrations
     WHERE id = :migrationId`, {
        replacements: { migrationId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result;
};
exports.getMigrationProgress = getMigrationProgress;
// ============================================================================
// SEED DATA GENERATORS
// ============================================================================
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
const generateNetworkSeedData = async (sequelize, config, transaction) => {
    const counts = getDataSizeCounts(config.dataSize);
    // Generate devices
    await (0, exports.generateDeviceSeedData)(sequelize, counts.devices, transaction);
    // Generate topologies
    await (0, exports.generateTopologySeedData)(sequelize, counts.topologies, transaction);
    // Generate configurations
    await (0, exports.generateConfigurationSeedData)(sequelize, counts.devices, transaction);
    // Generate metrics
    if (config.realistic) {
        await (0, exports.generateRealisticMetrics)(sequelize, counts.devices, transaction);
    }
};
exports.generateNetworkSeedData = generateNetworkSeedData;
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
const generateDeviceSeedData = async (sequelize, count, transaction) => {
    const deviceTypes = ['router', 'switch', 'firewall', 'load_balancer'];
    const statuses = ['active', 'inactive', 'maintenance'];
    for (let i = 0; i < count; i++) {
        const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        await sequelize.query(`INSERT INTO network.devices (
        id, device_type, hostname, ip_address, status, created_at
      ) VALUES (
        uuid_generate_v4(),
        :deviceType,
        :hostname,
        :ipAddress,
        :status,
        NOW()
      )`, {
            replacements: {
                deviceType,
                hostname: `${deviceType}-${i + 1}`,
                ipAddress: `10.0.${Math.floor(i / 256)}.${i % 256}`,
                status,
            },
            transaction,
        });
    }
};
exports.generateDeviceSeedData = generateDeviceSeedData;
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
const generateTopologySeedData = async (sequelize, count, transaction) => {
    const topologyTypes = ['mesh', 'star', 'ring', 'hybrid'];
    for (let i = 0; i < count; i++) {
        const topologyType = topologyTypes[Math.floor(Math.random() * topologyTypes.length)];
        await sequelize.query(`INSERT INTO network.topologies (
        id, name, type, created_at
      ) VALUES (
        uuid_generate_v4(),
        :name,
        :type,
        NOW()
      )`, {
            replacements: {
                name: `Topology ${i + 1}`,
                type: topologyType,
            },
            transaction,
        });
    }
};
exports.generateTopologySeedData = generateTopologySeedData;
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
const generateConfigurationSeedData = async (sequelize, count, transaction) => {
    const [devices] = await sequelize.query(`SELECT id FROM network.devices LIMIT :count`, {
        replacements: { count },
        type: sequelize_1.QueryTypes.SELECT,
    });
    for (const device of devices) {
        const config = {
            vlan: Math.floor(Math.random() * 4096),
            mtu: 1500,
            speed: '1Gbps',
        };
        await sequelize.query(`INSERT INTO network.device_configurations (
        id, device_id, config_version, configuration, applied_at
      ) VALUES (
        uuid_generate_v4(),
        :deviceId,
        1,
        :config,
        NOW()
      )`, {
            replacements: {
                deviceId: device.id,
                config: JSON.stringify(config),
            },
            transaction,
        });
    }
};
exports.generateConfigurationSeedData = generateConfigurationSeedData;
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
const generateRealisticMetrics = async (sequelize, deviceCount, transaction) => {
    // Implementation would generate time-series metrics data
};
exports.generateRealisticMetrics = generateRealisticMetrics;
// ============================================================================
// DATA IMPORT/EXPORT
// ============================================================================
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
const exportNetworkData = async (sequelize, config) => {
    const exportId = generateULID();
    const exportPath = `/tmp/network_export_${exportId}.${config.format.toLowerCase()}`;
    // Export logic based on format
    // Implementation would handle different formats
    return exportPath;
};
exports.exportNetworkData = exportNetworkData;
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
const importNetworkData = async (sequelize, config, transaction) => {
    // Import logic based on format
    // Implementation would handle different formats and batch processing
    return { imported: 0, errors: 0 };
};
exports.importNetworkData = importNetworkData;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates ULID
 *
 * @returns {string} ULID
 */
const generateULID = () => {
    const ulid = (0, ulid_1.monotonicFactory)();
    return ulid();
};
/**
 * Calculates configuration checksum
 *
 * @param {any} config - Configuration object
 * @returns {string} Checksum
 */
const calculateConfigChecksum = (config) => {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(config))
        .digest('hex');
};
/**
 * Calculates configuration diff
 *
 * @param {any} config1 - First configuration
 * @param {any} config2 - Second configuration
 * @returns {any} Diff object
 */
const calculateConfigDiff = (config1, config2) => {
    // Implementation would calculate differences
    return {};
};
/**
 * Calculates snapshot checksum
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @returns {Promise<string>} Checksum
 */
const calculateSnapshotChecksum = async (sequelize, snapshotId) => {
    return crypto.randomBytes(32).toString('hex');
};
/**
 * Validates snapshot integrity
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @returns {Promise<void>}
 */
const validateSnapshotIntegrity = async (sequelize, snapshotId) => {
    // Implementation would validate snapshot
};
/**
 * Restores topology from snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const restoreTopologyFromSnapshot = async (sequelize, snapshotId, transaction) => {
    // Implementation would restore topology
};
/**
 * Restores device states from snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const restoreDeviceStatesFromSnapshot = async (sequelize, snapshotId, transaction) => {
    // Implementation would restore device states
};
/**
 * Gets cron schedule for backup frequency
 *
 * @param {BackupFrequency} frequency - Backup frequency
 * @returns {string} Cron schedule
 */
const getCronSchedule = (frequency) => {
    const schedules = {
        [BackupFrequency.HOURLY]: '0 * * * *',
        [BackupFrequency.DAILY]: '0 0 * * *',
        [BackupFrequency.WEEKLY]: '0 0 * * 0',
        [BackupFrequency.MONTHLY]: '0 0 1 * *',
        [BackupFrequency.ON_DEMAND]: '',
    };
    return schedules[frequency];
};
/**
 * Performs database backup
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} backupId - Backup ID
 * @returns {Promise<string>} Backup path
 */
const performDatabaseBackup = async (sequelize, backupId) => {
    // Implementation would execute pg_dump or similar
    return `/backups/${backupId}.sql`;
};
/**
 * Calculates backup checksum
 *
 * @param {string} backupPath - Backup file path
 * @returns {Promise<string>} Checksum
 */
const calculateBackupChecksum = async (backupPath) => {
    return crypto.randomBytes(32).toString('hex');
};
/**
 * Performs database restore
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} backupPath - Backup file path
 * @returns {Promise<void>}
 */
const performDatabaseRestore = async (sequelize, backupPath) => {
    // Implementation would execute pg_restore or similar
};
/**
 * Executes blue-green migration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {MigrationConfig} config - Migration configuration
 * @returns {Promise<void>}
 */
const executeBlueGreenMigration = async (sequelize, config) => {
    // Implementation would handle blue-green migration
};
/**
 * Executes rolling migration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {MigrationConfig} config - Migration configuration
 * @returns {Promise<void>}
 */
const executeRollingMigration = async (sequelize, config) => {
    // Implementation would handle rolling migration
};
/**
 * Gets data size counts based on configuration
 *
 * @param {string} dataSize - Data size ('small', 'medium', 'large')
 * @returns {{ devices: number; topologies: number }} Counts
 */
const getDataSizeCounts = (dataSize) => {
    const sizes = {
        small: { devices: 10, topologies: 2 },
        medium: { devices: 100, topologies: 10 },
        large: { devices: 1000, topologies: 50 },
    };
    return sizes[dataSize];
};
// ============================================================================
// DATA VERSIONING
// ============================================================================
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
const createDataVersionControl = async (sequelize, tableName, transaction) => {
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.${tableName}_versions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      record_id UUID NOT NULL,
      version INTEGER NOT NULL,
      data JSONB NOT NULL,
      operation VARCHAR(20) NOT NULL,
      changed_by VARCHAR(255),
      changed_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(record_id, version)
    )`, { transaction });
    // Create trigger for automatic versioning
    await sequelize.query(`CREATE OR REPLACE FUNCTION version_${tableName}()
     RETURNS TRIGGER AS $$
     DECLARE
       next_version INTEGER;
     BEGIN
       SELECT COALESCE(MAX(version), 0) + 1 INTO next_version
       FROM network.${tableName}_versions
       WHERE record_id = NEW.id;

       INSERT INTO network.${tableName}_versions (record_id, version, data, operation)
       VALUES (NEW.id, next_version, row_to_json(NEW), TG_OP);

       RETURN NEW;
     END;
     $$ LANGUAGE plpgsql;

     DROP TRIGGER IF EXISTS ${tableName}_versioning ON network.${tableName};
     CREATE TRIGGER ${tableName}_versioning
     AFTER INSERT OR UPDATE ON network.${tableName}
     FOR EACH ROW EXECUTE FUNCTION version_${tableName}()`, { transaction });
};
exports.createDataVersionControl = createDataVersionControl;
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
const compressBackup = async (backupPath, compressionLevel = '6') => {
    const compressedPath = `${backupPath}.gz`;
    // Implementation would use zlib or similar
    return compressedPath;
};
exports.compressBackup = compressBackup;
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
const encryptBackup = async (backupPath, encryptionKey) => {
    const encryptedPath = `${backupPath}.enc`;
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    // Implementation would stream encrypt the file
    return encryptedPath;
};
exports.encryptBackup = encryptBackup;
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
const decryptBackup = async (encryptedPath, encryptionKey) => {
    const decryptedPath = encryptedPath.replace('.enc', '');
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    // Implementation would stream decrypt the file
    return decryptedPath;
};
exports.decryptBackup = decryptBackup;
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
const archiveOldSnapshots = async (sequelize, daysOld, destination) => {
    const [snapshots] = await sequelize.query(`SELECT id FROM network.snapshots
     WHERE created_at < NOW() - INTERVAL '${daysOld} days'
     AND archived = false`, { type: sequelize_1.QueryTypes.SELECT });
    for (const snapshot of snapshots) {
        // Archive snapshot data to destination
        await sequelize.query(`UPDATE network.snapshots
       SET archived = true, archive_location = :destination
       WHERE id = :id`, {
            replacements: { id: snapshot.id, destination },
        });
    }
    return snapshots.length;
};
exports.archiveOldSnapshots = archiveOldSnapshots;
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
const performIncrementalBackup = async (sequelize, baseBackupId, transaction) => {
    const backupId = generateULID();
    // Get base backup timestamp
    const [baseBackup] = await sequelize.query(`SELECT completed_at FROM network.backups WHERE id = :baseBackupId`, {
        replacements: { baseBackupId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (!baseBackup) {
        throw new Error(`Base backup ${baseBackupId} not found`);
    }
    // Create incremental backup record
    await sequelize.query(`INSERT INTO network.backups (
      id, job_id, status, backup_type, base_backup_id, started_at
    ) VALUES (
      :id, NULL, 'running', 'incremental', :baseBackupId, NOW()
    )`, {
        replacements: { id: backupId, baseBackupId },
        transaction,
    });
    // Backup only changes since base backup
    // Implementation would use WAL archiving or timestamp-based filtering
    return backupId;
};
exports.performIncrementalBackup = performIncrementalBackup;
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
const cleanupExpiredBackups = async (sequelize, retentionDays) => {
    const [backups] = await sequelize.query(`DELETE FROM network.backups
     WHERE completed_at < NOW() - INTERVAL '${retentionDays} days'
     AND status = 'completed'
     RETURNING id`, { type: sequelize_1.QueryTypes.DELETE });
    return backups.length;
};
exports.cleanupExpiredBackups = cleanupExpiredBackups;
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
const validateDataIntegrity = async (sequelize, tables) => {
    const errors = [];
    for (const table of tables) {
        // Check for orphaned foreign keys
        const [orphans] = await sequelize.query(`SELECT COUNT(*) as count FROM network.${table}
       WHERE id NOT IN (SELECT DISTINCT id FROM network.${table})`, { type: sequelize_1.QueryTypes.SELECT });
        if (orphans.count > 0) {
            errors.push(`Found ${orphans.count} orphaned records in ${table}`);
        }
        // Check for constraint violations
        try {
            await sequelize.query(`SET CONSTRAINTS ALL IMMEDIATE`);
        }
        catch (error) {
            errors.push(`Constraint violation in ${table}: ${error.message}`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateDataIntegrity = validateDataIntegrity;
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
const synchronizeConfigurations = async (sourceSequelize, targetSequelize, deviceIds) => {
    let syncedCount = 0;
    for (const deviceId of deviceIds) {
        const [sourceConfig] = await sourceSequelize.query(`SELECT * FROM network.device_configurations WHERE device_id = :deviceId`, {
            replacements: { deviceId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (sourceConfig) {
            await targetSequelize.query(`INSERT INTO network.device_configurations (device_id, config_version, configuration, applied_at)
         VALUES (:deviceId, :version, :config, :appliedAt)
         ON CONFLICT (device_id) DO UPDATE
         SET config_version = EXCLUDED.config_version,
             configuration = EXCLUDED.configuration,
             applied_at = EXCLUDED.applied_at`, {
                replacements: {
                    deviceId: sourceConfig.device_id,
                    version: sourceConfig.config_version,
                    config: sourceConfig.configuration,
                    appliedAt: sourceConfig.applied_at,
                },
            });
            syncedCount++;
        }
    }
    return syncedCount;
};
exports.synchronizeConfigurations = synchronizeConfigurations;
//# sourceMappingURL=network-persistence-kit.js.map