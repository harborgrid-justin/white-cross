/**
 * LOC: R1E2P3L4I5C6
 * File: /reuse/san/sequelize-oracle-replication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *   - oracledb (v6.x)
 *
 * DOWNSTREAM (imported by):
 *   - High-availability configurations
 *   - Disaster recovery systems
 *   - Multi-datacenter deployments
 *   - Read replica management
 */
/**
 * File: /reuse/san/sequelize-oracle-replication-kit.ts
 * Locator: WC-UTL-SEQ-REPL-001
 * Purpose: Oracle Database Replication Kit - Enterprise replication patterns and conflict resolution
 *
 * Upstream: sequelize v6.x, oracledb, @types/node
 * Downstream: HA configurations, disaster recovery, multi-datacenter setups, read replicas, failover systems
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, Oracle Database 12c+ with Advanced Replication
 * Exports: 40 replication utilities for master-slave/multi-master patterns, lag monitoring, conflict resolution, CDC, snapshots, and sync
 *
 * LLM Context: Production-grade Oracle Database replication toolkit for White Cross healthcare platform.
 * Provides advanced replication strategies (master-slave, multi-master, cascading), replication lag monitoring,
 * conflict detection and resolution, change data capture (CDC), snapshot replication, bidirectional synchronization,
 * and topology management. HIPAA-compliant with healthcare-specific replication patterns ensuring data consistency,
 * audit trail preservation, and zero-downtime deployments. Optimized for Oracle Streams, GoldenGate, and Advanced Replication.
 */
import { QueryInterface, Transaction } from 'sequelize';
/**
 * Replication topology type
 */
export declare enum ReplicationTopology {
    MASTER_SLAVE = "MASTER_SLAVE",
    MASTER_MASTER = "MASTER_MASTER",
    CASCADING = "CASCADING",
    PEER_TO_PEER = "PEER_TO_PEER",
    MULTI_MASTER = "MULTI_MASTER",
    HUB_SPOKE = "HUB_SPOKE"
}
/**
 * Replication method
 */
export declare enum ReplicationMethod {
    STREAMS = "STREAMS",
    GOLDENGATE = "GOLDENGATE",
    MATERIALIZED_VIEW = "MATERIALIZED_VIEW",
    ADVANCED_REPLICATION = "ADVANCED_REPLICATION",
    DATA_GUARD = "DATA_GUARD",
    LOGICAL_STANDBY = "LOGICAL_STANDBY"
}
/**
 * Conflict resolution strategy
 */
export declare enum ConflictResolution {
    TIMESTAMP = "TIMESTAMP",
    PRIORITY = "PRIORITY",
    SITE_PRIORITY = "SITE_PRIORITY",
    ADDITIVE = "ADDITIVE",
    AVERAGE = "AVERAGE",
    MINIMUM = "MINIMUM",
    MAXIMUM = "MAXIMUM",
    CUSTOM = "CUSTOM",
    MANUAL = "MANUAL"
}
/**
 * Replication node configuration
 */
export interface ReplicationNode {
    nodeId: string;
    nodeName: string;
    hostname: string;
    port: number;
    database: string;
    username: string;
    password: string;
    role: 'MASTER' | 'SLAVE' | 'PEER';
    priority: number;
    isActive: boolean;
    lastHeartbeat?: Date;
}
/**
 * Master-slave configuration
 */
export interface MasterSlaveConfig {
    masterId: string;
    slaveIds: string[];
    replicationMethod: ReplicationMethod;
    tables: string[];
    conflictResolution?: ConflictResolution;
    lagThresholdSeconds?: number;
    autoFailover?: boolean;
    healthCheckIntervalMs?: number;
}
/**
 * Multi-master configuration
 */
export interface MultiMasterConfig {
    nodeIds: string[];
    replicationMethod: ReplicationMethod;
    tables: string[];
    conflictResolution: ConflictResolution;
    conflictDetectionInterval?: number;
    quorumSize?: number;
    partitionScheme?: 'HASH' | 'RANGE' | 'LIST';
}
/**
 * Replication lag information
 */
export interface ReplicationLag {
    nodeId: string;
    nodeName: string;
    lagSeconds: number;
    lagTransactions: number;
    lastAppliedScn: number;
    currentScn: number;
    applyRate: number;
    status: 'CURRENT' | 'LAGGING' | 'CRITICAL' | 'STALLED';
    timestamp: Date;
}
/**
 * Conflict detection result
 */
export interface ConflictDetection {
    conflictId: string;
    tableName: string;
    primaryKey: any;
    sourceNode: string;
    targetNode: string;
    conflictType: 'UPDATE' | 'DELETE' | 'UNIQUENESS' | 'FOREIGN_KEY';
    sourceValue: any;
    targetValue: any;
    detectedAt: Date;
    resolved: boolean;
    resolution?: string;
}
/**
 * Change data capture configuration
 */
export interface CDCConfiguration {
    tableName: string;
    captureMode: 'SYNCHRONOUS' | 'ASYNCHRONOUS';
    captureColumns?: string[];
    excludeColumns?: string[];
    captureInserts?: boolean;
    captureUpdates?: boolean;
    captureDeletes?: boolean;
    subscriptionName?: string;
}
/**
 * CDC change record
 */
export interface CDCChangeRecord {
    scn: number;
    timestamp: Date;
    operation: 'INSERT' | 'UPDATE' | 'DELETE';
    tableName: string;
    rowId: string;
    username: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    transactionId?: string;
}
/**
 * Snapshot replication configuration
 */
export interface SnapshotConfig {
    sourceTables: string[];
    targetDatabase: string;
    refreshMode: 'COMPLETE' | 'FAST' | 'FORCE';
    refreshMethod: 'ON_COMMIT' | 'ON_DEMAND' | 'SCHEDULED';
    refreshInterval?: number;
    parallelDegree?: number;
    compressionEnabled?: boolean;
}
/**
 * Synchronization result
 */
export interface SyncResult {
    tableName: string;
    sourceRows: number;
    targetRows: number;
    rowsInserted: number;
    rowsUpdated: number;
    rowsDeleted: number;
    conflicts: number;
    duration: number;
    success: boolean;
    errors?: string[];
}
/**
 * Replication health status
 */
export interface ReplicationHealth {
    nodeId: string;
    healthy: boolean;
    lag: ReplicationLag;
    errorCount: number;
    lastError?: string;
    uptime: number;
    throughput: number;
    checksPerformed: number;
    lastCheckTime: Date;
}
/**
 * Failover configuration
 */
export interface FailoverConfig {
    primaryNode: string;
    standbyNodes: string[];
    automaticFailover: boolean;
    failoverThresholdSeconds: number;
    switchbackPolicy: 'AUTOMATIC' | 'MANUAL' | 'PLANNED_ONLY';
    dataLossTolerance: 'ZERO' | 'MINIMAL' | 'ACCEPTABLE';
    notificationEndpoints?: string[];
}
/**
 * Replication statistics
 */
export interface ReplicationStatistics {
    nodeId: string;
    totalTransactionsApplied: number;
    totalBytesReplicated: number;
    averageLagSeconds: number;
    conflictsDetected: number;
    conflictsResolved: number;
    errorCount: number;
    uptimePercentage: number;
    lastReplicationTime: Date;
}
/**
 * Configures master-slave replication between databases.
 * Sets up unidirectional replication from master to slave(s).
 *
 * @param {QueryInterface} masterInterface - Master database query interface
 * @param {QueryInterface} slaveInterface - Slave database query interface
 * @param {MasterSlaveConfig} config - Master-slave configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupMasterSlaveReplication(masterQI, slaveQI, {
 *   masterId: 'master-dc1',
 *   slaveIds: ['slave-dc2', 'slave-dc3'],
 *   replicationMethod: ReplicationMethod.STREAMS,
 *   tables: ['patients', 'medical_records', 'appointments'],
 *   lagThresholdSeconds: 5,
 *   autoFailover: true
 * });
 * ```
 */
export declare function setupMasterSlaveReplication(masterInterface: QueryInterface, slaveInterface: QueryInterface, config: MasterSlaveConfig): Promise<void>;
/**
 * Configures Oracle Streams for real-time replication.
 * Enables low-latency change capture and propagation.
 *
 * @param {QueryInterface} sourceInterface - Source database query interface
 * @param {QueryInterface} targetInterface - Target database query interface
 * @param {string[]} tables - Tables to replicate
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureStreamsReplication(sourceQI, targetQI, [
 *   'patients', 'appointments', 'prescriptions'
 * ]);
 * ```
 */
export declare function configureStreamsReplication(sourceInterface: QueryInterface, targetInterface: QueryInterface, tables: string[]): Promise<void>;
/**
 * Configures materialized view replication.
 * Suitable for periodic refresh and read-heavy workloads.
 *
 * @param {QueryInterface} sourceInterface - Source database query interface
 * @param {QueryInterface} targetInterface - Target database query interface
 * @param {string[]} tables - Tables to replicate
 * @param {object} options - Materialized view options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureMaterializedViewReplication(sourceQI, targetQI,
 *   ['patient_summary', 'appointment_stats'], {
 *     refreshMode: 'FAST',
 *     refreshInterval: 300 // 5 minutes
 *   }
 * );
 * ```
 */
export declare function configureMaterializedViewReplication(sourceInterface: QueryInterface, targetInterface: QueryInterface, tables: string[], options?: {
    refreshMode?: 'COMPLETE' | 'FAST' | 'FORCE';
    refreshInterval?: number;
}): Promise<void>;
/**
 * Promotes a slave to master during failover.
 * Handles graceful promotion with minimal data loss.
 *
 * @param {QueryInterface} slaveInterface - Slave database query interface
 * @param {string} slaveId - Slave node ID to promote
 * @param {object} options - Promotion options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await promoteSlaveToMaster(slaveQI, 'slave-dc2', {
 *   forcePromotion: false,
 *   waitForSync: true,
 *   maxWaitSeconds: 30
 * });
 * ```
 */
export declare function promoteSlaveToMaster(slaveInterface: QueryInterface, slaveId: string, options?: {
    forcePromotion?: boolean;
    waitForSync?: boolean;
    maxWaitSeconds?: number;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Configures multi-master (bidirectional) replication.
 * Enables writes on all nodes with conflict resolution.
 *
 * @param {QueryInterface[]} nodeInterfaces - All node query interfaces
 * @param {MultiMasterConfig} config - Multi-master configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupMultiMasterReplication([node1QI, node2QI, node3QI], {
 *   nodeIds: ['node1', 'node2', 'node3'],
 *   replicationMethod: ReplicationMethod.GOLDENGATE,
 *   tables: ['patients', 'appointments'],
 *   conflictResolution: ConflictResolution.TIMESTAMP,
 *   quorumSize: 2
 * });
 * ```
 */
export declare function setupMultiMasterReplication(nodeInterfaces: QueryInterface[], config: MultiMasterConfig): Promise<void>;
/**
 * Configures bidirectional replication between two nodes.
 * Enables mutual replication with conflict handling.
 *
 * @param {QueryInterface} node1Interface - First node query interface
 * @param {QueryInterface} node2Interface - Second node query interface
 * @param {string[]} tables - Tables to replicate
 * @param {ConflictResolution} conflictResolution - Conflict resolution strategy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureBidirectionalReplication(dc1QI, dc2QI,
 *   ['patients', 'appointments'],
 *   ConflictResolution.TIMESTAMP
 * );
 * ```
 */
export declare function configureBidirectionalReplication(node1Interface: QueryInterface, node2Interface: QueryInterface, tables: string[], conflictResolution: ConflictResolution): Promise<void>;
/**
 * Sets up conflict resolution procedures.
 * Implements automatic conflict detection and resolution.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string[]} tables - Tables with conflict resolution
 * @param {ConflictResolution} strategy - Resolution strategy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupConflictResolution(queryInterface,
 *   ['medical_records'],
 *   ConflictResolution.TIMESTAMP
 * );
 * ```
 */
export declare function setupConflictResolution(queryInterface: QueryInterface, tables: string[], strategy: ConflictResolution): Promise<void>;
/**
 * Implements quorum-based conflict resolution.
 * Requires majority consensus for conflict resolution.
 *
 * @param {QueryInterface[]} nodeInterfaces - All node query interfaces
 * @param {string} tableName - Table with conflict
 * @param {any} primaryKey - Row primary key
 * @param {number} quorumSize - Required votes for resolution
 * @returns {Promise<any>} Resolved value
 *
 * @example
 * ```typescript
 * const resolvedValue = await resolveConflictWithQuorum(
 *   [node1QI, node2QI, node3QI],
 *   'patients',
 *   { id: 'patient-123' },
 *   2
 * );
 * ```
 */
export declare function resolveConflictWithQuorum(nodeInterfaces: QueryInterface[], tableName: string, primaryKey: any, quorumSize: number): Promise<any>;
/**
 * Retrieves current replication lag for a node.
 * Measures delay between source and replica.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} nodeId - Node identifier
 * @returns {Promise<ReplicationLag>} Replication lag information
 *
 * @example
 * ```typescript
 * const lag = await getReplicationLag(slaveQI, 'slave-dc2');
 * if (lag.lagSeconds > 10) {
 *   console.warn(`High replication lag: ${lag.lagSeconds}s`);
 * }
 * ```
 */
export declare function getReplicationLag(queryInterface: QueryInterface, nodeId: string): Promise<ReplicationLag>;
/**
 * Monitors replication lag continuously.
 * Alerts when lag exceeds thresholds.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} nodeId - Node identifier
 * @param {object} config - Monitoring configuration
 * @param {Function} callback - Callback for lag updates
 * @returns {NodeJS.Timer} Monitoring interval handle
 *
 * @example
 * ```typescript
 * const monitor = monitorReplicationLag(slaveQI, 'slave-dc2', {
 *   intervalMs: 5000,
 *   warningThreshold: 10,
 *   criticalThreshold: 30
 * }, (lag) => {
 *   console.log(`Current lag: ${lag.lagSeconds}s - ${lag.status}`);
 * });
 * ```
 */
export declare function monitorReplicationLag(queryInterface: QueryInterface, nodeId: string, config: {
    intervalMs?: number;
    warningThreshold?: number;
    criticalThreshold?: number;
}, callback: (lag: ReplicationLag) => void): NodeJS.Timer;
/**
 * Calculates replication throughput and performance metrics.
 * Analyzes apply rate and transaction processing.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} nodeId - Node identifier
 * @param {number} durationSeconds - Measurement duration
 * @returns {Promise<object>} Throughput metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateReplicationThroughput(slaveQI, 'slave-dc2', 60);
 * console.log(`Apply rate: ${metrics.transactionsPerSecond} tx/s`);
 * ```
 */
export declare function calculateReplicationThroughput(queryInterface: QueryInterface, nodeId: string, durationSeconds?: number): Promise<{
    transactionsPerSecond: number;
    bytesPerSecond: number;
    averageLatencyMs: number;
}>;
/**
 * Detects replication stalls and applies remediation.
 * Automatically restarts stalled apply processes.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} nodeId - Node identifier
 * @param {object} options - Stall detection options
 * @returns {Promise<boolean>} Whether stall was detected and fixed
 *
 * @example
 * ```typescript
 * const wasStalled = await detectAndFixReplicationStall(slaveQI, 'slave-dc2', {
 *   stallThresholdSeconds: 120,
 *   autoRestart: true
 * });
 * ```
 */
export declare function detectAndFixReplicationStall(queryInterface: QueryInterface, nodeId: string, options?: {
    stallThresholdSeconds?: number;
    autoRestart?: boolean;
}): Promise<boolean>;
/**
 * Detects conflicts between replicated nodes.
 * Identifies divergent data that needs resolution.
 *
 * @param {QueryInterface} node1Interface - First node query interface
 * @param {QueryInterface} node2Interface - Second node query interface
 * @param {string} tableName - Table to check for conflicts
 * @param {string[]} compareColumns - Columns to compare
 * @returns {Promise<ConflictDetection[]>} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await detectConflicts(dc1QI, dc2QI,
 *   'patients', ['first_name', 'last_name', 'date_of_birth']
 * );
 * conflicts.forEach(c => console.log(`Conflict in ${c.tableName} for key ${c.primaryKey}`));
 * ```
 */
export declare function detectConflicts(node1Interface: QueryInterface, node2Interface: QueryInterface, tableName: string, compareColumns: string[]): Promise<ConflictDetection[]>;
/**
 * Resolves conflicts using timestamp-based strategy.
 * Keeps the most recently modified version.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {ConflictDetection} conflict - Conflict to resolve
 * @param {string} timestampColumn - Column containing modification timestamp
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveConflictByTimestamp(queryInterface, conflict, 'updated_at');
 * ```
 */
export declare function resolveConflictByTimestamp(queryInterface: QueryInterface, conflict: ConflictDetection, timestampColumn?: string): Promise<void>;
/**
 * Resolves conflicts using priority-based strategy.
 * Applies configured site or user priority.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {ConflictDetection} conflict - Conflict to resolve
 * @param {Record<string, number>} sitePriorities - Site priority mapping
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveConflictByPriority(queryInterface, conflict, {
 *   'dc1': 1,
 *   'dc2': 2,
 *   'dc3': 3
 * });
 * ```
 */
export declare function resolveConflictByPriority(queryInterface: QueryInterface, conflict: ConflictDetection, sitePriorities: Record<string, number>): Promise<void>;
/**
 * Implements custom conflict resolution logic.
 * Allows application-specific conflict resolution.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {ConflictDetection} conflict - Conflict to resolve
 * @param {Function} resolutionFn - Custom resolution function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveConflictCustom(queryInterface, conflict, (source, target) => {
 *   // Custom logic: merge both values
 *   return { ...source, notes: source.notes + '; ' + target.notes };
 * });
 * ```
 */
export declare function resolveConflictCustom(queryInterface: QueryInterface, conflict: ConflictDetection, resolutionFn: (sourceValue: any, targetValue: any) => any): Promise<void>;
/**
 * Logs conflicts for manual review.
 * Stores conflict information in audit table.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {ConflictDetection} conflict - Conflict to log
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logConflictForManualReview(queryInterface, conflict);
 * ```
 */
export declare function logConflictForManualReview(queryInterface: QueryInterface, conflict: ConflictDetection): Promise<void>;
/**
 * Configures change data capture for tables.
 * Tracks all DML operations for replication and audit.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {CDCConfiguration} config - CDC configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureCDC(queryInterface, {
 *   tableName: 'patients',
 *   captureMode: 'ASYNCHRONOUS',
 *   captureInserts: true,
 *   captureUpdates: true,
 *   captureDeletes: true,
 *   excludeColumns: ['password_hash']
 * });
 * ```
 */
export declare function configureCDC(queryInterface: QueryInterface, config: CDCConfiguration): Promise<void>;
/**
 * Retrieves change records from CDC.
 * Fetches captured changes for processing.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} subscriptionName - CDC subscription name
 * @param {object} options - Query options
 * @returns {Promise<CDCChangeRecord[]>} Change records
 *
 * @example
 * ```typescript
 * const changes = await getCDCChanges(queryInterface, 'CDC_patients', {
 *   fromScn: 1000000,
 *   toScn: 1000100,
 *   operationType: 'UPDATE'
 * });
 * ```
 */
export declare function getCDCChanges(queryInterface: QueryInterface, subscriptionName: string, options?: {
    fromScn?: number;
    toScn?: number;
    operationType?: 'INSERT' | 'UPDATE' | 'DELETE';
    limit?: number;
}): Promise<CDCChangeRecord[]>;
/**
 * Purges old CDC change records.
 * Manages CDC storage and performance.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} subscriptionName - CDC subscription name
 * @param {number} retentionDays - Days to retain changes
 * @returns {Promise<number>} Number of records purged
 *
 * @example
 * ```typescript
 * const purged = await purgeCDCChanges(queryInterface, 'CDC_patients', 30);
 * console.log(`Purged ${purged} old CDC records`);
 * ```
 */
export declare function purgeCDCChanges(queryInterface: QueryInterface, subscriptionName: string, retentionDays: number): Promise<number>;
/**
 * Creates snapshot replication for tables.
 * Implements periodic full or incremental snapshots.
 *
 * @param {QueryInterface} sourceInterface - Source database query interface
 * @param {QueryInterface} targetInterface - Target database query interface
 * @param {SnapshotConfig} config - Snapshot configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createSnapshotReplication(sourceQI, targetQI, {
 *   sourceTables: ['patients', 'medical_records'],
 *   targetDatabase: 'REPLICA_DB',
 *   refreshMode: 'FAST',
 *   refreshMethod: 'SCHEDULED',
 *   refreshInterval: 3600,
 *   parallelDegree: 4
 * });
 * ```
 */
export declare function createSnapshotReplication(sourceInterface: QueryInterface, targetInterface: QueryInterface, config: SnapshotConfig): Promise<void>;
/**
 * Refreshes snapshot replicas.
 * Manually triggers snapshot refresh.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string[]} snapshotNames - Snapshot names to refresh
 * @param {object} options - Refresh options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await refreshSnapshots(queryInterface,
 *   ['patients_SNAPSHOT', 'appointments_SNAPSHOT'],
 *   { method: 'FAST', parallelDegree: 4 }
 * );
 * ```
 */
export declare function refreshSnapshots(queryInterface: QueryInterface, snapshotNames: string[], options?: {
    method?: 'COMPLETE' | 'FAST' | 'FORCE';
    parallelDegree?: number;
    atomic?: boolean;
}): Promise<void>;
/**
 * Gets snapshot refresh statistics.
 * Returns refresh history and performance metrics.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} snapshotName - Snapshot name
 * @returns {Promise<object>} Refresh statistics
 *
 * @example
 * ```typescript
 * const stats = await getSnapshotStatistics(queryInterface, 'patients_SNAPSHOT');
 * console.log(`Last refresh: ${stats.lastRefreshDate}, Duration: ${stats.refreshDuration}s`);
 * ```
 */
export declare function getSnapshotStatistics(queryInterface: QueryInterface, snapshotName: string): Promise<{
    lastRefreshDate: Date;
    nextRefreshDate: Date;
    refreshDuration: number;
    refreshErrors: number;
    staleness: string;
}>;
/**
 * Synchronizes data between two databases.
 * Performs bidirectional sync with conflict resolution.
 *
 * @param {QueryInterface} source Interface - Source database query interface
 * @param {QueryInterface} targetInterface - Target database query interface
 * @param {string} tableName - Table to synchronize
 * @param {object} options - Sync options
 * @returns {Promise<SyncResult>} Synchronization result
 *
 * @example
 * ```typescript
 * const result = await synchronizeData(sourceQI, targetQI, 'appointments', {
 *   bidirectional: true,
 *   conflictResolution: ConflictResolution.TIMESTAMP,
 *   timestampColumn: 'updated_at'
 * });
 * console.log(`Synced: ${result.rowsInserted} inserted, ${result.rowsUpdated} updated`);
 * ```
 */
export declare function synchronizeData(sourceInterface: QueryInterface, targetInterface: QueryInterface, tableName: string, options?: {
    bidirectional?: boolean;
    conflictResolution?: ConflictResolution;
    timestampColumn?: string;
    batchSize?: number;
}): Promise<SyncResult>;
/**
 * Validates data consistency between replicas.
 * Compares checksums and row counts.
 *
 * @param {QueryInterface} source Interface - Source database query interface
 * @param {QueryInterface} targetInterface - Target database query interface
 * @param {string[]} tables - Tables to validate
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateDataConsistency(sourceQI, targetQI,
 *   ['patients', 'appointments', 'medical_records']
 * );
 * validation.forEach(v => {
 *   console.log(`${v.table}: ${v.consistent ? 'CONSISTENT' : 'INCONSISTENT'}`);
 * });
 * ```
 */
export declare function validateDataConsistency(sourceInterface: QueryInterface, targetInterface: QueryInterface, tables: string[]): Promise<{
    table: string;
    consistent: boolean;
    sourceCount: number;
    targetCount: number;
    sourceChecksum: string;
    targetChecksum: string;
}[]>;
declare const _default: {
    setupMasterSlaveReplication: typeof setupMasterSlaveReplication;
    configureStreamsReplication: typeof configureStreamsReplication;
    configureMaterializedViewReplication: typeof configureMaterializedViewReplication;
    promoteSlaveToMaster: typeof promoteSlaveToMaster;
    setupMultiMasterReplication: typeof setupMultiMasterReplication;
    configureBidirectionalReplication: typeof configureBidirectionalReplication;
    setupConflictResolution: typeof setupConflictResolution;
    resolveConflictWithQuorum: typeof resolveConflictWithQuorum;
    getReplicationLag: typeof getReplicationLag;
    monitorReplicationLag: typeof monitorReplicationLag;
    calculateReplicationThroughput: typeof calculateReplicationThroughput;
    detectAndFixReplicationStall: typeof detectAndFixReplicationStall;
    detectConflicts: typeof detectConflicts;
    resolveConflictByTimestamp: typeof resolveConflictByTimestamp;
    resolveConflictByPriority: typeof resolveConflictByPriority;
    resolveConflictCustom: typeof resolveConflictCustom;
    logConflictForManualReview: typeof logConflictForManualReview;
    configureCDC: typeof configureCDC;
    getCDCChanges: typeof getCDCChanges;
    purgeCDCChanges: typeof purgeCDCChanges;
    createSnapshotReplication: typeof createSnapshotReplication;
    refreshSnapshots: typeof refreshSnapshots;
    getSnapshotStatistics: typeof getSnapshotStatistics;
    synchronizeData: typeof synchronizeData;
    validateDataConsistency: typeof validateDataConsistency;
    ReplicationTopology: typeof ReplicationTopology;
    ReplicationMethod: typeof ReplicationMethod;
    ConflictResolution: typeof ConflictResolution;
};
export default _default;
//# sourceMappingURL=sequelize-oracle-replication-kit.d.ts.map