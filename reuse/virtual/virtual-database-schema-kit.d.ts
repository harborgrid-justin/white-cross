/**
 * LOC: VDBSK9012345
 * File: /reuse/virtual/virtual-database-schema-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - VMware vRealize Automation API
 *   - Virtual infrastructure database patterns
 *   - Multi-tenancy frameworks
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure services
 *   - Database migration modules
 *   - Schema versioning services
 *   - vRealize integration services
 */
/**
 * File: /reuse/virtual/virtual-database-schema-kit.ts
 * Locator: WC-VIRT-DBSK-001
 * Purpose: Virtual Database Schema Kit - Comprehensive schema design for virtualized database infrastructure
 *
 * Upstream: Sequelize ORM, VMware vRealize APIs, PostgreSQL/MySQL for virtual environments
 * Downstream: ../backend/*, ../migrations/*, virtual infrastructure services
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+, VMware vRealize SDK
 * Exports: 41 utility functions for virtual database schema design, migrations, indexes, constraints,
 *          optimization, multi-tenancy, sharding for virtual workloads, backup/restore, replication
 *
 * LLM Context: Comprehensive virtual database schema utilities for White Cross healthcare virtual infrastructure.
 * Provides schema design for virtualized databases, migration patterns for virtual environments,
 * index optimization for VM storage, constraint management, multi-tenant virtual isolation,
 * sharding strategies for distributed virtual infrastructure, backup/recovery for VMs,
 * replication across virtual datacenters, and vRealize Automation database integration.
 * Essential for building scalable, resilient database architectures on virtualized platforms.
 */
import { Sequelize, ModelAttributes } from 'sequelize';
interface VirtualSchemaConfig {
    virtualDatacenterId: string;
    clusterId: string;
    storagePolicy: 'SSD' | 'HDD' | 'HYBRID' | 'NVME';
    replicationFactor: number;
    backupEnabled: boolean;
    snapshotInterval?: number;
}
interface VirtualMigrationConfig {
    migrationId: string;
    version: string;
    targetVirtualEnv: 'vmware' | 'hyperv' | 'kvm' | 'openstack';
    rollbackStrategy: 'snapshot' | 'transaction' | 'manual';
    validateBeforeApply: boolean;
    downtime: number;
}
interface VirtualIndexConfig {
    indexName: string;
    tableName: string;
    columns: string[];
    type: 'BTREE' | 'HASH' | 'GIN' | 'GIST' | 'BRIN';
    storageNode?: string;
    concurrently: boolean;
    vmPlacement?: 'local' | 'distributed' | 'replicated';
}
interface VirtualConstraintConfig {
    constraintName: string;
    constraintType: 'PRIMARY_KEY' | 'FOREIGN_KEY' | 'UNIQUE' | 'CHECK' | 'EXCLUSION';
    columns: string[];
    referencedTable?: string;
    referencedColumns?: string[];
    onDelete?: 'CASCADE' | 'SET_NULL' | 'RESTRICT' | 'NO_ACTION';
    onUpdate?: 'CASCADE' | 'SET_NULL' | 'RESTRICT' | 'NO_ACTION';
    deferrable?: boolean;
}
interface VirtualShardConfig {
    shardKey: string;
    numberOfShards: number;
    shardingStrategy: 'hash' | 'range' | 'geo' | 'tenant';
    virtualNodes: Array<{
        nodeId: string;
        datacenter: string;
        capacity: number;
    }>;
    rebalanceThreshold: number;
}
interface VirtualReplicationConfig {
    replicationType: 'sync' | 'async' | 'semi-sync';
    replicaCount: number;
    replicaDatacenters: string[];
    failoverAutomatic: boolean;
    replicationLagThreshold: number;
}
interface VirtualBackupConfig {
    backupType: 'full' | 'incremental' | 'differential' | 'snapshot';
    schedule: string;
    retentionDays: number;
    storageBackend: 'vsan' | 's3' | 'nfs' | 'iscsi';
    compression: boolean;
    encryption: boolean;
}
interface VirtualTenantSchema {
    tenantId: string;
    schemaName: string;
    isolationLevel: 'schema' | 'database' | 'cluster';
    resourceQuota: {
        maxConnections: number;
        maxStorage: number;
        maxCPU: number;
        maxMemory: number;
    };
    virtualNetworkId?: string;
}
interface VirtualMaterializedView {
    viewName: string;
    baseQuery: string;
    refreshStrategy: 'manual' | 'on-commit' | 'scheduled';
    refreshInterval?: number;
    storageOptimization: 'columnar' | 'row' | 'compressed';
    distributedAcrossNodes: boolean;
}
interface VirtualConnectionPool {
    poolName: string;
    virtualDatacenterId: string;
    minConnections: number;
    maxConnections: number;
    connectionTimeout: number;
    idleTimeout: number;
    loadBalancing: 'round-robin' | 'least-connections' | 'weighted';
}
interface SchemaVersionControl {
    version: string;
    description: string;
    appliedAt: Date;
    appliedBy: string;
    virtualEnvironment: string;
    rollbackAvailable: boolean;
    checksum: string;
}
interface VirtualDataEncryption {
    encryptionType: 'AES-256' | 'AES-128' | 'RSA';
    keyManagement: 'kms' | 'vault' | 'local';
    encryptAtRest: boolean;
    encryptInTransit: boolean;
    keyRotationDays: number;
}
/**
 * 1. Creates virtual database schema optimized for VM infrastructure.
 *
 * @param {string} schemaName - Schema name
 * @param {VirtualSchemaConfig} config - Virtual schema configuration
 * @returns {string} SQL for creating virtual-optimized schema
 *
 * @example
 * ```typescript
 * const sql = createVirtualSchema('healthcare_prod', {
 *   virtualDatacenterId: 'dc-01',
 *   clusterId: 'cluster-prod',
 *   storagePolicy: 'SSD',
 *   replicationFactor: 3,
 *   backupEnabled: true,
 *   snapshotInterval: 3600000
 * });
 * ```
 */
export declare const createVirtualSchema: (schemaName: string, config: VirtualSchemaConfig) => string;
/**
 * 2. Generates table schema optimized for virtual storage performance.
 *
 * @param {string} tableName - Table name
 * @param {ModelAttributes} attributes - Table columns
 * @param {VirtualSchemaConfig} virtualConfig - Virtual configuration
 * @returns {string} SQL for creating optimized virtual table
 *
 * @example
 * ```typescript
 * const sql = createVirtualOptimizedTable('patient_records', {
 *   id: { type: DataTypes.UUID, primaryKey: true },
 *   name: { type: DataTypes.STRING },
 *   dob: { type: DataTypes.DATE }
 * }, virtualConfig);
 * ```
 */
export declare const createVirtualOptimizedTable: (tableName: string, attributes: ModelAttributes, virtualConfig: VirtualSchemaConfig) => string;
/**
 * 3. Creates multi-tenant schema with virtual isolation.
 *
 * @param {VirtualTenantSchema} config - Tenant schema configuration
 * @returns {string} SQL for creating tenant-isolated schema
 *
 * @example
 * ```typescript
 * const sql = createTenantVirtualSchema({
 *   tenantId: 'tenant-123',
 *   schemaName: 'tenant_123_data',
 *   isolationLevel: 'schema',
 *   resourceQuota: {
 *     maxConnections: 50,
 *     maxStorage: 100,
 *     maxCPU: 4,
 *     maxMemory: 16
 *   }
 * });
 * ```
 */
export declare const createTenantVirtualSchema: (config: VirtualTenantSchema) => string;
/**
 * 4. Generates schema migration for virtual environment upgrades.
 *
 * @param {VirtualMigrationConfig} config - Migration configuration
 * @returns {string} SQL for virtual environment migration
 *
 * @example
 * ```typescript
 * const sql = generateVirtualMigration({
 *   migrationId: 'mig-001',
 *   version: 'v2.0.0',
 *   targetVirtualEnv: 'vmware',
 *   rollbackStrategy: 'snapshot',
 *   validateBeforeApply: true,
 *   downtime: 300
 * });
 * ```
 */
export declare const generateVirtualMigration: (config: VirtualMigrationConfig) => string;
/**
 * 5. Creates optimized index for virtual storage backends.
 *
 * @param {VirtualIndexConfig} config - Index configuration
 * @returns {string} SQL for creating virtual-optimized index
 *
 * @example
 * ```typescript
 * const sql = createVirtualOptimizedIndex({
 *   indexName: 'idx_patient_lookup',
 *   tableName: 'patients',
 *   columns: ['tenant_id', 'patient_id'],
 *   type: 'BTREE',
 *   concurrently: true,
 *   vmPlacement: 'local'
 * });
 * ```
 */
export declare const createVirtualOptimizedIndex: (config: VirtualIndexConfig) => string;
/**
 * 6. Creates covering index for virtual infrastructure read performance.
 *
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {string[]} indexColumns - Indexed columns
 * @param {string[]} includeColumns - Included columns
 * @returns {string} SQL for covering index
 *
 * @example
 * ```typescript
 * const sql = createVirtualCoveringIndex(
 *   'appointments',
 *   'idx_appt_coverage',
 *   ['patient_id', 'scheduled_date'],
 *   ['doctor_id', 'status', 'notes']
 * );
 * ```
 */
export declare const createVirtualCoveringIndex: (tableName: string, indexName: string, indexColumns: string[], includeColumns: string[]) => string;
/**
 * 7. Generates partial index for filtered queries on virtual nodes.
 *
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {string[]} columns - Indexed columns
 * @param {string} whereClause - Filter condition
 * @returns {string} SQL for partial index
 *
 * @example
 * ```typescript
 * const sql = createVirtualPartialIndex(
 *   'orders',
 *   'idx_active_orders',
 *   ['customer_id', 'order_date'],
 *   "status = 'active' AND deleted_at IS NULL"
 * );
 * ```
 */
export declare const createVirtualPartialIndex: (tableName: string, indexName: string, columns: string[], whereClause: string) => string;
/**
 * 8. Creates GIN index for JSONB columns in virtual databases.
 *
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {string} jsonbColumn - JSONB column name
 * @returns {string} SQL for GIN index
 *
 * @example
 * ```typescript
 * const sql = createVirtualGINIndex('patient_metadata', 'idx_metadata_gin', 'attributes');
 * ```
 */
export declare const createVirtualGINIndex: (tableName: string, indexName: string, jsonbColumn: string) => string;
/**
 * 9. Analyzes and recommends missing indexes for virtual workloads.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table to analyze
 * @returns {Promise<Array<{ columns: string[]; reason: string; estimatedImprovement: string }>>}
 *
 * @example
 * ```typescript
 * const recommendations = await analyzeVirtualIndexNeeds(sequelize, 'patient_visits');
 * recommendations.forEach(rec => {
 *   console.log(`Consider index on: ${rec.columns.join(', ')} - ${rec.reason}`);
 * });
 * ```
 */
export declare const analyzeVirtualIndexNeeds: (sequelize: Sequelize, tableName: string) => Promise<Array<{
    columns: string[];
    reason: string;
    estimatedImprovement: string;
}>>;
/**
 * 10. Creates constraint with virtual infrastructure awareness.
 *
 * @param {string} tableName - Table name
 * @param {VirtualConstraintConfig} config - Constraint configuration
 * @returns {string} SQL for creating constraint
 *
 * @example
 * ```typescript
 * const sql = createVirtualConstraint('orders', {
 *   constraintName: 'fk_customer',
 *   constraintType: 'FOREIGN_KEY',
 *   columns: ['customer_id'],
 *   referencedTable: 'customers',
 *   referencedColumns: ['id'],
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export declare const createVirtualConstraint: (tableName: string, config: VirtualConstraintConfig) => string;
/**
 * 11. Creates check constraint for virtual resource validation.
 *
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {string} condition - Check condition
 * @returns {string} SQL for check constraint
 *
 * @example
 * ```typescript
 * const sql = createVirtualCheckConstraint(
 *   'vm_resources',
 *   'check_cpu_range',
 *   'cpu_cores >= 1 AND cpu_cores <= 64'
 * );
 * ```
 */
export declare const createVirtualCheckConstraint: (tableName: string, constraintName: string, condition: string) => string;
/**
 * 12. Creates exclusion constraint for virtual resource conflicts.
 *
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {string} exclusionExpression - Exclusion expression
 * @returns {string} SQL for exclusion constraint
 *
 * @example
 * ```typescript
 * const sql = createVirtualExclusionConstraint(
 *   'vm_reservations',
 *   'no_vm_overlap',
 *   'vm_id WITH =, time_range WITH &&'
 * );
 * ```
 */
export declare const createVirtualExclusionConstraint: (tableName: string, constraintName: string, exclusionExpression: string) => string;
/**
 * 13. Creates sharding configuration for distributed virtual nodes.
 *
 * @param {string} tableName - Table name
 * @param {VirtualShardConfig} config - Sharding configuration
 * @returns {string} SQL for sharding setup
 *
 * @example
 * ```typescript
 * const sql = createVirtualShardedTable('patient_data', {
 *   shardKey: 'tenant_id',
 *   numberOfShards: 8,
 *   shardingStrategy: 'hash',
 *   virtualNodes: [
 *     { nodeId: 'node-1', datacenter: 'dc-us-east', capacity: 1000 },
 *     { nodeId: 'node-2', datacenter: 'dc-us-west', capacity: 1000 }
 *   ],
 *   rebalanceThreshold: 0.2
 * });
 * ```
 */
export declare const createVirtualShardedTable: (tableName: string, config: VirtualShardConfig) => string;
/**
 * 14. Calculates shard placement for virtual node balancing.
 *
 * @param {string} shardKey - Shard key value
 * @param {number} numberOfShards - Total shards
 * @param {string} strategy - Sharding strategy
 * @returns {number} Shard number
 *
 * @example
 * ```typescript
 * const shard = calculateVirtualShard('tenant-abc-123', 8, 'hash');
 * console.log(`Route to shard: ${shard}`);
 * ```
 */
export declare const calculateVirtualShard: (shardKey: string, numberOfShards: number, strategy: "hash" | "range" | "geo") => number;
/**
 * 15. Creates virtual node routing table for shard distribution.
 *
 * @param {VirtualShardConfig} config - Shard configuration
 * @returns {string} SQL for routing table
 *
 * @example
 * ```typescript
 * const sql = createVirtualNodeRoutingTable(shardConfig);
 * ```
 */
export declare const createVirtualNodeRoutingTable: (config: VirtualShardConfig) => string;
/**
 * 16. Configures replication for virtual datacenter failover.
 *
 * @param {string} tableName - Table name
 * @param {VirtualReplicationConfig} config - Replication configuration
 * @returns {string} SQL for replication setup
 *
 * @example
 * ```typescript
 * const sql = configureVirtualReplication('critical_data', {
 *   replicationType: 'sync',
 *   replicaCount: 3,
 *   replicaDatacenters: ['dc-us-east', 'dc-us-west', 'dc-eu'],
 *   failoverAutomatic: true,
 *   replicationLagThreshold: 100
 * });
 * ```
 */
export declare const configureVirtualReplication: (tableName: string, config: VirtualReplicationConfig) => string;
/**
 * 17. Creates virtual failover trigger for automatic datacenter switching.
 *
 * @param {string} tableName - Table name
 * @param {string[]} replicaDatacenters - Replica datacenter IDs
 * @returns {string} SQL for failover trigger
 *
 * @example
 * ```typescript
 * const sql = createVirtualFailoverTrigger('orders', ['dc-backup-1', 'dc-backup-2']);
 * ```
 */
export declare const createVirtualFailoverTrigger: (tableName: string, replicaDatacenters: string[]) => string;
/**
 * 18. Monitors virtual replication lag across datacenters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{ datacenter: string; lagMs: number; status: string }>>}
 *
 * @example
 * ```typescript
 * const replicationStatus = await monitorVirtualReplicationLag(sequelize);
 * replicationStatus.forEach(status => {
 *   console.log(`${status.datacenter}: ${status.lagMs}ms - ${status.status}`);
 * });
 * ```
 */
export declare const monitorVirtualReplicationLag: (sequelize: Sequelize) => Promise<Array<{
    datacenter: string;
    lagMs: number;
    status: string;
}>>;
/**
 * 19. Creates backup configuration for virtual infrastructure.
 *
 * @param {string} schemaName - Schema name
 * @param {VirtualBackupConfig} config - Backup configuration
 * @returns {string} SQL for backup setup
 *
 * @example
 * ```typescript
 * const sql = createVirtualBackupConfig('production', {
 *   backupType: 'incremental',
 *   schedule: '0 2 * * *',
 *   retentionDays: 30,
 *   storageBackend: 'vsan',
 *   compression: true,
 *   encryption: true
 * });
 * ```
 */
export declare const createVirtualBackupConfig: (schemaName: string, config: VirtualBackupConfig) => string;
/**
 * 20. Generates snapshot-based backup for virtual databases.
 *
 * @param {string} databaseName - Database name
 * @param {string} snapshotName - Snapshot name
 * @returns {string} SQL for snapshot backup
 *
 * @example
 * ```typescript
 * const sql = createVirtualDatabaseSnapshot('healthcare_db', 'snapshot_2024_01_15');
 * ```
 */
export declare const createVirtualDatabaseSnapshot: (databaseName: string, snapshotName: string) => string;
/**
 * 21. Creates point-in-time recovery configuration.
 *
 * @param {string} databaseName - Database name
 * @param {number} retentionHours - PITR retention in hours
 * @returns {string} SQL for PITR setup
 *
 * @example
 * ```typescript
 * const sql = configureVirtualPITR('healthcare_db', 72);
 * ```
 */
export declare const configureVirtualPITR: (databaseName: string, retentionHours: number) => string;
/**
 * 22. Creates time-based partitioning for virtual log tables.
 *
 * @param {string} tableName - Table name
 * @param {string} partitionColumn - Partition column (timestamp)
 * @param {string} interval - Partition interval ('day', 'week', 'month')
 * @returns {string} SQL for time-based partitioning
 *
 * @example
 * ```typescript
 * const sql = createVirtualTimePartitioning('access_logs', 'created_at', 'month');
 * ```
 */
export declare const createVirtualTimePartitioning: (tableName: string, partitionColumn: string, interval: "day" | "week" | "month" | "year") => string;
/**
 * 23. Creates list-based partitioning for virtual tenant isolation.
 *
 * @param {string} tableName - Table name
 * @param {string} partitionColumn - Partition column
 * @param {Array<{ name: string; values: string[] }>} partitions - Partition definitions
 * @returns {string} SQL for list partitioning
 *
 * @example
 * ```typescript
 * const sql = createVirtualListPartitioning('tenant_data', 'tenant_id', [
 *   { name: 'tenant_a', values: ['tenant-001', 'tenant-002'] },
 *   { name: 'tenant_b', values: ['tenant-003', 'tenant-004'] }
 * ]);
 * ```
 */
export declare const createVirtualListPartitioning: (tableName: string, partitionColumn: string, partitions: Array<{
    name: string;
    values: string[];
}>) => string;
/**
 * 24. Manages partition lifecycle (archival/deletion) for virtual storage.
 *
 * @param {string} tableName - Table name
 * @param {number} retentionDays - Days to retain partitions
 * @returns {string} SQL for partition lifecycle management
 *
 * @example
 * ```typescript
 * const sql = manageVirtualPartitionLifecycle('audit_logs', 90);
 * ```
 */
export declare const manageVirtualPartitionLifecycle: (tableName: string, retentionDays: number) => string;
/**
 * 25. Creates materialized view optimized for virtual infrastructure.
 *
 * @param {VirtualMaterializedView} config - Materialized view configuration
 * @returns {string} SQL for creating materialized view
 *
 * @example
 * ```typescript
 * const sql = createVirtualMaterializedView({
 *   viewName: 'patient_summary_mv',
 *   baseQuery: 'SELECT patient_id, COUNT(*) as visit_count FROM visits GROUP BY patient_id',
 *   refreshStrategy: 'scheduled',
 *   refreshInterval: 3600000,
 *   storageOptimization: 'columnar',
 *   distributedAcrossNodes: true
 * });
 * ```
 */
export declare const createVirtualMaterializedView: (config: VirtualMaterializedView) => string;
/**
 * 26. Refreshes virtual materialized view with minimal downtime.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} viewName - Materialized view name
 * @param {boolean} concurrently - Refresh concurrently
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await refreshVirtualMaterializedView(sequelize, 'patient_summary_mv', true);
 * ```
 */
export declare const refreshVirtualMaterializedView: (sequelize: Sequelize, viewName: string, concurrently?: boolean) => Promise<void>;
/**
 * 27. Configures transparent data encryption for virtual databases.
 *
 * @param {string} tableName - Table name
 * @param {VirtualDataEncryption} config - Encryption configuration
 * @returns {string} SQL for encryption setup
 *
 * @example
 * ```typescript
 * const sql = configureVirtualEncryption('patient_records', {
 *   encryptionType: 'AES-256',
 *   keyManagement: 'vault',
 *   encryptAtRest: true,
 *   encryptInTransit: true,
 *   keyRotationDays: 90
 * });
 * ```
 */
export declare const configureVirtualEncryption: (tableName: string, config: VirtualDataEncryption) => string;
/**
 * 28. Creates column-level encryption for sensitive virtual data.
 *
 * @param {string} tableName - Table name
 * @param {string} columnName - Column to encrypt
 * @param {string} encryptionKey - Encryption key reference
 * @returns {string} SQL for column encryption
 *
 * @example
 * ```typescript
 * const sql = createVirtualColumnEncryption('patients', 'ssn', 'vault://keys/ssn-key');
 * ```
 */
export declare const createVirtualColumnEncryption: (tableName: string, columnName: string, encryptionKey: string) => string;
/**
 * 29. Creates virtual database performance monitoring tables.
 *
 * @returns {string} SQL for monitoring infrastructure
 *
 * @example
 * ```typescript
 * const sql = createVirtualMonitoringInfrastructure();
 * ```
 */
export declare const createVirtualMonitoringInfrastructure: () => string;
/**
 * 30. Tracks virtual database schema changes for auditing.
 *
 * @returns {string} SQL for schema change tracking
 *
 * @example
 * ```typescript
 * const sql = createVirtualSchemaChangeTracking();
 * ```
 */
export declare const createVirtualSchemaChangeTracking: () => string;
/**
 * 31. Creates schema version control system for virtual environments.
 *
 * @returns {string} SQL for version control
 *
 * @example
 * ```typescript
 * const sql = createVirtualSchemaVersionControl();
 * ```
 */
export declare const createVirtualSchemaVersionControl: () => string;
/**
 * 32. Records schema migration execution in virtual environment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SchemaVersionControl} version - Version information
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordVirtualSchemaMigration(sequelize, {
 *   version: 'v1.2.0',
 *   description: 'Add patient analytics tables',
 *   appliedAt: new Date(),
 *   appliedBy: 'admin',
 *   virtualEnvironment: 'vmware-prod',
 *   rollbackAvailable: true,
 *   checksum: 'abc123def456'
 * });
 * ```
 */
export declare const recordVirtualSchemaMigration: (sequelize: Sequelize, version: SchemaVersionControl) => Promise<void>;
/**
 * 33. Gets current schema version for virtual environment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} virtualEnvironment - Virtual environment identifier
 * @returns {Promise<SchemaVersionControl | null>}
 *
 * @example
 * ```typescript
 * const currentVersion = await getVirtualSchemaVersion(sequelize, 'vmware-prod');
 * console.log(`Current version: ${currentVersion?.version}`);
 * ```
 */
export declare const getVirtualSchemaVersion: (sequelize: Sequelize, virtualEnvironment: string) => Promise<SchemaVersionControl | null>;
/**
 * 34. Validates schema migration checksum for integrity.
 *
 * @param {string} migrationContent - Migration SQL content
 * @returns {string} SHA-256 checksum
 *
 * @example
 * ```typescript
 * const checksum = calculateMigrationChecksum(migrationSQL);
 * ```
 */
export declare const calculateMigrationChecksum: (migrationContent: string) => string;
/**
 * 35. Generates rollback script for virtual schema migration.
 *
 * @param {string} migrationSQL - Forward migration SQL
 * @returns {string} Rollback SQL
 *
 * @example
 * ```typescript
 * const rollback = generateVirtualMigrationRollback('CREATE TABLE test (id INT)');
 * ```
 */
export declare const generateVirtualMigrationRollback: (migrationSQL: string) => string;
/**
 * 36. Creates virtual database cluster coordination table.
 *
 * @returns {string} SQL for cluster coordination
 *
 * @example
 * ```typescript
 * const sql = createVirtualClusterCoordination();
 * ```
 */
export declare const createVirtualClusterCoordination: () => string;
/**
 * 37. Implements distributed locking for virtual database operations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} lockName - Lock identifier
 * @param {string} nodeId - Node requesting lock
 * @param {number} timeoutMs - Lock timeout
 * @returns {Promise<boolean>} True if lock acquired
 *
 * @example
 * ```typescript
 * const acquired = await acquireVirtualDistributedLock(
 *   sequelize,
 *   'schema-migration',
 *   'node-1',
 *   30000
 * );
 * ```
 */
export declare const acquireVirtualDistributedLock: (sequelize: Sequelize, lockName: string, nodeId: string, timeoutMs: number) => Promise<boolean>;
/**
 * 38. Releases distributed lock for virtual database.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} lockName - Lock identifier
 * @param {string} nodeId - Node releasing lock
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseVirtualDistributedLock(sequelize, 'schema-migration', 'node-1');
 * ```
 */
export declare const releaseVirtualDistributedLock: (sequelize: Sequelize, lockName: string, nodeId: string) => Promise<void>;
/**
 * 39. Creates virtual database connection pooling configuration.
 *
 * @param {VirtualConnectionPool} config - Connection pool configuration
 * @returns {string} SQL for connection pool setup
 *
 * @example
 * ```typescript
 * const sql = createVirtualConnectionPool({
 *   poolName: 'main-pool',
 *   virtualDatacenterId: 'dc-01',
 *   minConnections: 10,
 *   maxConnections: 100,
 *   connectionTimeout: 5000,
 *   idleTimeout: 30000,
 *   loadBalancing: 'least-connections'
 * });
 * ```
 */
export declare const createVirtualConnectionPool: (config: VirtualConnectionPool) => string;
/**
 * 40. Optimizes virtual database statistics for query planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table to analyze
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await optimizeVirtualTableStatistics(sequelize, 'patient_records');
 * ```
 */
export declare const optimizeVirtualTableStatistics: (sequelize: Sequelize, tableName: string) => Promise<void>;
/**
 * 41. Creates comprehensive health check for virtual database infrastructure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ healthy: boolean; checks: Array<{ name: string; status: string; details?: any }> }>}
 *
 * @example
 * ```typescript
 * const health = await checkVirtualDatabaseHealth(sequelize);
 * if (!health.healthy) {
 *   console.error('Database health issues:', health.checks);
 * }
 * ```
 */
export declare const checkVirtualDatabaseHealth: (sequelize: Sequelize) => Promise<{
    healthy: boolean;
    checks: Array<{
        name: string;
        status: string;
        details?: any;
    }>;
}>;
declare const _default: {
    createVirtualSchema: (schemaName: string, config: VirtualSchemaConfig) => string;
    createVirtualOptimizedTable: (tableName: string, attributes: ModelAttributes, virtualConfig: VirtualSchemaConfig) => string;
    createTenantVirtualSchema: (config: VirtualTenantSchema) => string;
    generateVirtualMigration: (config: VirtualMigrationConfig) => string;
    createVirtualOptimizedIndex: (config: VirtualIndexConfig) => string;
    createVirtualCoveringIndex: (tableName: string, indexName: string, indexColumns: string[], includeColumns: string[]) => string;
    createVirtualPartialIndex: (tableName: string, indexName: string, columns: string[], whereClause: string) => string;
    createVirtualGINIndex: (tableName: string, indexName: string, jsonbColumn: string) => string;
    analyzeVirtualIndexNeeds: (sequelize: Sequelize, tableName: string) => Promise<Array<{
        columns: string[];
        reason: string;
        estimatedImprovement: string;
    }>>;
    createVirtualConstraint: (tableName: string, config: VirtualConstraintConfig) => string;
    createVirtualCheckConstraint: (tableName: string, constraintName: string, condition: string) => string;
    createVirtualExclusionConstraint: (tableName: string, constraintName: string, exclusionExpression: string) => string;
    createVirtualShardedTable: (tableName: string, config: VirtualShardConfig) => string;
    calculateVirtualShard: (shardKey: string, numberOfShards: number, strategy: "hash" | "range" | "geo") => number;
    createVirtualNodeRoutingTable: (config: VirtualShardConfig) => string;
    configureVirtualReplication: (tableName: string, config: VirtualReplicationConfig) => string;
    createVirtualFailoverTrigger: (tableName: string, replicaDatacenters: string[]) => string;
    monitorVirtualReplicationLag: (sequelize: Sequelize) => Promise<Array<{
        datacenter: string;
        lagMs: number;
        status: string;
    }>>;
    createVirtualBackupConfig: (schemaName: string, config: VirtualBackupConfig) => string;
    createVirtualDatabaseSnapshot: (databaseName: string, snapshotName: string) => string;
    configureVirtualPITR: (databaseName: string, retentionHours: number) => string;
    createVirtualTimePartitioning: (tableName: string, partitionColumn: string, interval: "day" | "week" | "month" | "year") => string;
    createVirtualListPartitioning: (tableName: string, partitionColumn: string, partitions: Array<{
        name: string;
        values: string[];
    }>) => string;
    manageVirtualPartitionLifecycle: (tableName: string, retentionDays: number) => string;
    createVirtualMaterializedView: (config: VirtualMaterializedView) => string;
    refreshVirtualMaterializedView: (sequelize: Sequelize, viewName: string, concurrently?: boolean) => Promise<void>;
    configureVirtualEncryption: (tableName: string, config: VirtualDataEncryption) => string;
    createVirtualColumnEncryption: (tableName: string, columnName: string, encryptionKey: string) => string;
    createVirtualMonitoringInfrastructure: () => string;
    createVirtualSchemaChangeTracking: () => string;
    createVirtualSchemaVersionControl: () => string;
    recordVirtualSchemaMigration: (sequelize: Sequelize, version: SchemaVersionControl) => Promise<void>;
    getVirtualSchemaVersion: (sequelize: Sequelize, virtualEnvironment: string) => Promise<SchemaVersionControl | null>;
    calculateMigrationChecksum: (migrationContent: string) => string;
    generateVirtualMigrationRollback: (migrationSQL: string) => string;
    createVirtualClusterCoordination: () => string;
    acquireVirtualDistributedLock: (sequelize: Sequelize, lockName: string, nodeId: string, timeoutMs: number) => Promise<boolean>;
    releaseVirtualDistributedLock: (sequelize: Sequelize, lockName: string, nodeId: string) => Promise<void>;
    createVirtualConnectionPool: (config: VirtualConnectionPool) => string;
    optimizeVirtualTableStatistics: (sequelize: Sequelize, tableName: string) => Promise<void>;
    checkVirtualDatabaseHealth: (sequelize: Sequelize) => Promise<{
        healthy: boolean;
        checks: Array<{
            name: string;
            status: string;
            details?: any;
        }>;
    }>;
};
export default _default;
//# sourceMappingURL=virtual-database-schema-kit.d.ts.map