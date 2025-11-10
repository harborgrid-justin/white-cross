/**
 * @fileoverview Network Data Architecture Kit - Enterprise virtual network database architecture
 * @module reuse/san/network-data-architecture-kit
 * @description Complete database architecture utilities for software-defined enterprise virtual networks
 * including schema design, data partitioning, sharding, indexing, normalization, denormalization,
 * caching strategies, and replication patterns.
 *
 * Key Features:
 * - Network schema design and modeling
 * - Network topology data structures
 * - Time-series data partitioning for network metrics
 * - Geographic and tenant-based sharding
 * - Multi-level indexing strategies
 * - Network data normalization patterns
 * - Strategic denormalization for performance
 * - Hierarchical caching strategies
 * - Master-replica replication topologies
 * - Network data consistency models
 * - Query optimization for network operations
 * - Data retention and archival policies
 * - Network analytics data warehousing
 * - Real-time network state management
 * - Cross-datacenter replication
 *
 * @target Sequelize v6.x, PostgreSQL 14+, Redis 7+, Node 18+, TypeScript 5.x
 *
 * @security
 * - Tenant isolation in multi-tenant architectures
 * - Network configuration encryption
 * - Access control for network data
 * - Audit logging for schema changes
 * - SQL injection prevention
 * - Row-level security policies
 * - Encrypted replication channels
 * - Zero-trust network data access
 *
 * @example Basic network schema setup
 * ```typescript
 * import { createNetworkSchema, addNetworkPartitioning } from './network-data-architecture-kit';
 *
 * const schema = await createNetworkSchema(sequelize, {
 *   tenantIsolation: true,
 *   timeSeriesPartitioning: true
 * });
 *
 * await addNetworkPartitioning(sequelize, 'network_metrics', {
 *   type: 'range',
 *   partitionBy: 'timestamp',
 *   interval: '1 day'
 * });
 * ```
 *
 * @example Network sharding configuration
 * ```typescript
 * import { setupNetworkSharding, createShardingKey } from './network-data-architecture-kit';
 *
 * await setupNetworkSharding(sequelize, {
 *   strategy: 'geographic',
 *   shards: ['us-east', 'us-west', 'eu-central', 'ap-southeast'],
 *   replicationFactor: 3
 * });
 * ```
 *
 * LOC: DB-ARCH-NET-001
 * UPSTREAM: sequelize, pg, redis, ioredis
 * DOWNSTREAM: network models, network services, monitoring systems
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * @enum NetworkSchemaType
 * @description Types of network schema patterns
 */
export declare enum NetworkSchemaType {
    TOPOLOGY = "TOPOLOGY",
    TIMESERIES = "TIMESERIES",
    CONFIGURATION = "CONFIGURATION",
    METRICS = "METRICS",
    EVENTS = "EVENTS",
    STATE = "STATE"
}
/**
 * @enum PartitionStrategy
 * @description Partitioning strategies for network data
 */
export declare enum PartitionStrategy {
    RANGE = "RANGE",
    LIST = "LIST",
    HASH = "HASH",
    COMPOSITE = "COMPOSITE"
}
/**
 * @enum ShardingStrategy
 * @description Sharding strategies for horizontal scaling
 */
export declare enum ShardingStrategy {
    GEOGRAPHIC = "GEOGRAPHIC",
    TENANT = "TENANT",
    HASH = "HASH",
    RANGE = "RANGE",
    CONSISTENT_HASH = "CONSISTENT_HASH"
}
/**
 * @enum IndexType
 * @description Types of database indexes
 */
export declare enum IndexType {
    BTREE = "BTREE",
    HASH = "HASH",
    GIN = "GIN",
    GIST = "GIST",
    BRIN = "BRIN",
    PARTIAL = "PARTIAL",
    COVERING = "COVERING"
}
/**
 * @enum CacheStrategy
 * @description Caching strategies for network data
 */
export declare enum CacheStrategy {
    WRITE_THROUGH = "WRITE_THROUGH",
    WRITE_BEHIND = "WRITE_BEHIND",
    READ_THROUGH = "READ_THROUGH",
    CACHE_ASIDE = "CACHE_ASIDE",
    REFRESH_AHEAD = "REFRESH_AHEAD"
}
/**
 * @enum ReplicationTopology
 * @description Database replication topologies
 */
export declare enum ReplicationTopology {
    PRIMARY_REPLICA = "PRIMARY_REPLICA",
    MULTI_PRIMARY = "MULTI_PRIMARY",
    CASCADE = "CASCADE",
    CIRCULAR = "CIRCULAR",
    BIDIRECTIONAL = "BIDIRECTIONAL"
}
/**
 * @interface NetworkSchemaConfig
 * @description Network schema configuration
 */
export interface NetworkSchemaConfig {
    tenantIsolation?: boolean;
    timeSeriesPartitioning?: boolean;
    geoSharding?: boolean;
    auditEnabled?: boolean;
    encryptionAtRest?: boolean;
    retentionPolicy?: RetentionPolicy;
}
/**
 * @interface PartitionConfig
 * @description Partition configuration
 */
export interface PartitionConfig {
    type: PartitionStrategy;
    partitionBy: string | string[];
    interval?: string;
    ranges?: Array<{
        name: string;
        from: any;
        to: any;
    }>;
    lists?: Array<{
        name: string;
        values: any[];
    }>;
    modulus?: number;
}
/**
 * @interface ShardConfig
 * @description Shard configuration
 */
export interface ShardConfig {
    strategy: ShardingStrategy;
    shards: string[];
    replicationFactor: number;
    consistentHashRing?: boolean;
    virtualNodes?: number;
    shardKey?: string;
}
/**
 * @interface IndexConfig
 * @description Index configuration
 */
export interface IndexConfig {
    name: string;
    type: IndexType;
    columns: string[];
    where?: string;
    include?: string[];
    unique?: boolean;
    concurrent?: boolean;
}
/**
 * @interface CacheConfig
 * @description Cache configuration
 */
export interface CacheConfig {
    strategy: CacheStrategy;
    ttl: number;
    maxSize?: number;
    evictionPolicy?: 'LRU' | 'LFU' | 'FIFO';
    compressionEnabled?: boolean;
    layers?: CacheLayer[];
}
/**
 * @interface CacheLayer
 * @description Multi-tier cache layer
 */
export interface CacheLayer {
    name: string;
    type: 'memory' | 'redis' | 'cdn';
    ttl: number;
    priority: number;
}
/**
 * @interface ReplicationConfig
 * @description Replication configuration
 */
export interface ReplicationConfig {
    topology: ReplicationTopology;
    syncMode: 'synchronous' | 'asynchronous' | 'semi-synchronous';
    replicas: ReplicaNode[];
    conflictResolution?: 'last-write-wins' | 'first-write-wins' | 'custom';
}
/**
 * @interface ReplicaNode
 * @description Replica node configuration
 */
export interface ReplicaNode {
    name: string;
    host: string;
    port: number;
    role: 'primary' | 'replica' | 'standby';
    priority: number;
    lag?: number;
}
/**
 * @interface RetentionPolicy
 * @description Data retention policy
 */
export interface RetentionPolicy {
    hotDataDays: number;
    warmDataDays: number;
    coldDataDays: number;
    archiveAfterDays: number;
    deleteAfterDays: number;
}
/**
 * @interface DenormalizationPattern
 * @description Denormalization pattern configuration
 */
export interface DenormalizationPattern {
    sourceTable: string;
    targetTable: string;
    aggregations: Array<{
        column: string;
        function: 'COUNT' | 'SUM' | 'AVG' | 'MAX' | 'MIN';
        alias: string;
    }>;
    refreshStrategy: 'realtime' | 'scheduled' | 'on-demand';
}
/**
 * Creates a comprehensive network schema
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {NetworkSchemaConfig} config - Schema configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createNetworkSchema(sequelize, {
 *   tenantIsolation: true,
 *   timeSeriesPartitioning: true,
 *   auditEnabled: true
 * });
 * ```
 */
export declare const createNetworkSchema: (sequelize: Sequelize, config: NetworkSchemaConfig, transaction?: Transaction) => Promise<void>;
/**
 * Creates network device schema with optimized structure
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {boolean} [enablePartitioning=false] - Enable partitioning
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createNetworkDeviceSchema(sequelize, true);
 * ```
 */
export declare const createNetworkDeviceSchema: (sequelize: Sequelize, enablePartitioning?: boolean, transaction?: Transaction) => Promise<void>;
/**
 * Creates time-series metrics schema
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTimeSeriesMetricsSchema(sequelize, 'network_metrics');
 * ```
 */
export declare const createTimeSeriesMetricsSchema: (sequelize: Sequelize, tableName: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates hierarchical network topology schema
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createHierarchicalTopologySchema(sequelize);
 * ```
 */
export declare const createHierarchicalTopologySchema: (sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
/**
 * Adds range-based partitioning to network table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {PartitionConfig} config - Partition configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addNetworkPartitioning(sequelize, 'network_metrics', {
 *   type: PartitionStrategy.RANGE,
 *   partitionBy: 'timestamp',
 *   interval: '1 day'
 * });
 * ```
 */
export declare const addNetworkPartitioning: (sequelize: Sequelize, tableName: string, config: PartitionConfig, transaction?: Transaction) => Promise<void>;
/**
 * Creates automatic time-based partition maintenance
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} interval - Partition interval (e.g., '1 day')
 * @param {number} retentionDays - Days to retain partitions
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAutoPartitionMaintenance(sequelize, 'network_events', '1 day', 90);
 * ```
 */
export declare const createAutoPartitionMaintenance: (sequelize: Sequelize, tableName: string, interval: string, retentionDays: number, transaction?: Transaction) => Promise<void>;
/**
 * Creates partition for specific time range
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {Date} startDate - Partition start date
 * @param {Date} endDate - Partition end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Partition name
 *
 * @example
 * ```typescript
 * const partitionName = await createTimeRangePartition(
 *   sequelize,
 *   'network_logs',
 *   new Date('2025-01-01'),
 *   new Date('2025-02-01')
 * );
 * ```
 */
export declare const createTimeRangePartition: (sequelize: Sequelize, tableName: string, startDate: Date, endDate: Date, transaction?: Transaction) => Promise<string>;
/**
 * Sets up network data sharding
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ShardConfig} config - Shard configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupNetworkSharding(sequelize, {
 *   strategy: ShardingStrategy.GEOGRAPHIC,
 *   shards: ['us-east', 'us-west', 'eu-central'],
 *   replicationFactor: 2
 * });
 * ```
 */
export declare const setupNetworkSharding: (sequelize: Sequelize, config: ShardConfig, transaction?: Transaction) => Promise<void>;
/**
 * Creates sharding key for consistent hashing
 *
 * @param {string} value - Value to hash
 * @param {number} [virtualNodes=150] - Number of virtual nodes
 * @returns {string} Shard key
 *
 * @example
 * ```typescript
 * const shardKey = createShardingKey('tenant-12345', 150);
 * ```
 */
export declare const createShardingKey: (value: string, virtualNodes?: number) => string;
/**
 * Gets shard assignment for network entity
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @param {ShardingStrategy} strategy - Sharding strategy
 * @returns {Promise<string>} Shard ID
 *
 * @example
 * ```typescript
 * const shardId = await getShardAssignment(sequelize, 'device-123', ShardingStrategy.HASH);
 * ```
 */
export declare const getShardAssignment: (sequelize: Sequelize, entityId: string, strategy: ShardingStrategy) => Promise<string>;
/**
 * Implements tenant-based sharding
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} tenantColumn - Tenant ID column
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await implementTenantSharding(sequelize, 'network_configs', 'tenant_id');
 * ```
 */
export declare const implementTenantSharding: (sequelize: Sequelize, tableName: string, tenantColumn: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates comprehensive network indexes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {IndexConfig[]} indexes - Index configurations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createNetworkIndexes(sequelize, 'devices', [
 *   { name: 'idx_device_status', type: IndexType.BTREE, columns: ['status'] },
 *   { name: 'idx_device_location', type: IndexType.GIST, columns: ['location'] }
 * ]);
 * ```
 */
export declare const createNetworkIndexes: (sequelize: Sequelize, tableName: string, indexes: IndexConfig[], transaction?: Transaction) => Promise<void>;
/**
 * Creates time-series optimized indexes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} timeColumn - Time column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTimeSeriesIndexes(sequelize, 'network_metrics', 'timestamp');
 * ```
 */
export declare const createTimeSeriesIndexes: (sequelize: Sequelize, tableName: string, timeColumn: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates GIN index for JSONB network metadata
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} jsonColumn - JSONB column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createJSONBIndexes(sequelize, 'devices', 'metadata');
 * ```
 */
export declare const createJSONBIndexes: (sequelize: Sequelize, tableName: string, jsonColumn: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates covering index for query optimization
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} keyColumns - Key columns
 * @param {string[]} includedColumns - Included columns
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createCoveringIndex(sequelize, 'devices', ['device_id'], ['hostname', 'status']);
 * ```
 */
export declare const createCoveringIndex: (sequelize: Sequelize, tableName: string, keyColumns: string[], includedColumns: string[], transaction?: Transaction) => Promise<void>;
/**
 * Normalizes network topology to 3NF
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await normalizeNetworkTopology(sequelize);
 * ```
 */
export declare const normalizeNetworkTopology: (sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
/**
 * Separates network configuration from state
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await separateConfigurationFromState(sequelize);
 * ```
 */
export declare const separateConfigurationFromState: (sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
/**
 * Normalizes network metrics metadata
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await normalizeMetricsMetadata(sequelize);
 * ```
 */
export declare const normalizeMetricsMetadata: (sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
/**
 * Creates denormalized view for network dashboard
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createDenormalizedDashboardView(sequelize);
 * ```
 */
export declare const createDenormalizedDashboardView: (sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
/**
 * Implements denormalization for network paths
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await denormalizeNetworkPaths(sequelize);
 * ```
 */
export declare const denormalizeNetworkPaths: (sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
/**
 * Creates aggregated network statistics table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTable - Source table name
 * @param {DenormalizationPattern} pattern - Denormalization pattern
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAggregatedStatistics(sequelize, 'network_metrics', {
 *   sourceTable: 'network_metrics',
 *   targetTable: 'device_statistics',
 *   aggregations: [
 *     { column: 'metric_value', function: 'AVG', alias: 'avg_value' },
 *     { column: 'metric_value', function: 'MAX', alias: 'max_value' }
 *   ],
 *   refreshStrategy: 'scheduled'
 * });
 * ```
 */
export declare const createAggregatedStatistics: (sequelize: Sequelize, sourceTable: string, pattern: DenormalizationPattern, transaction?: Transaction) => Promise<void>;
/**
 * Implements multi-tier caching for network data
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {CacheManager} Cache manager instance
 *
 * @example
 * ```typescript
 * const cache = setupMultiTierCaching({
 *   strategy: CacheStrategy.READ_THROUGH,
 *   ttl: 300,
 *   layers: [
 *     { name: 'l1', type: 'memory', ttl: 60, priority: 1 },
 *     { name: 'l2', type: 'redis', ttl: 300, priority: 2 }
 *   ]
 * });
 * ```
 */
export declare const setupMultiTierCaching: (config: CacheConfig) => any;
/**
 * Creates write-through cache for network configuration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupWriteThroughCache(sequelize, 'device_configurations', 600);
 * ```
 */
export declare const setupWriteThroughCache: (sequelize: Sequelize, tableName: string, ttl: number) => Promise<void>;
/**
 * Implements cache-aside pattern with lazy loading
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cacheKey - Cache key
 * @param {Function} loader - Data loader function
 * @param {number} ttl - Time to live
 * @returns {Promise<any>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const deviceData = await cacheAsideGet(sequelize, 'device:123', async () => {
 *   return await fetchDeviceData('123');
 * }, 300);
 * ```
 */
export declare const cacheAsideGet: (sequelize: Sequelize, cacheKey: string, loader: () => Promise<any>, ttl: number) => Promise<any>;
/**
 * Creates materialized view with refresh strategy
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} viewName - View name
 * @param {string} query - View query
 * @param {string} refreshInterval - Refresh interval
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createRefreshableMaterializedView(
 *   sequelize,
 *   'network_stats_hourly',
 *   'SELECT device_id, COUNT(*) FROM network_events GROUP BY device_id',
 *   '1 hour'
 * );
 * ```
 */
export declare const createRefreshableMaterializedView: (sequelize: Sequelize, viewName: string, query: string, refreshInterval: string, transaction?: Transaction) => Promise<void>;
/**
 * Configures primary-replica replication
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReplicationConfig} config - Replication configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configurePrimaryReplicaReplication(sequelize, {
 *   topology: ReplicationTopology.PRIMARY_REPLICA,
 *   syncMode: 'asynchronous',
 *   replicas: [
 *     { name: 'replica-1', host: 'db-replica-1', port: 5432, role: 'replica', priority: 1 }
 *   ]
 * });
 * ```
 */
export declare const configurePrimaryReplicaReplication: (sequelize: Sequelize, config: ReplicationConfig) => Promise<void>;
/**
 * Sets up logical replication for network data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} tables - Tables to replicate
 * @param {string} publicationName - Publication name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupLogicalReplication(sequelize, ['devices', 'network_metrics'], 'network_pub');
 * ```
 */
export declare const setupLogicalReplication: (sequelize: Sequelize, tables: string[], publicationName: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates bidirectional replication setup
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} remoteDsn - Remote database DSN
 * @param {string[]} tables - Tables to replicate
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupBidirectionalReplication(
 *   sequelize,
 *   'postgresql://remote-db:5432/network',
 *   ['devices', 'configurations']
 * );
 * ```
 */
export declare const setupBidirectionalReplication: (sequelize: Sequelize, remoteDsn: string, tables: string[]) => Promise<void>;
/**
 * Monitors replication lag
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{ replica: string; lag_bytes: number; lag_seconds: number }>>} Replication lag info
 *
 * @example
 * ```typescript
 * const lagInfo = await monitorReplicationLag(sequelize);
 * ```
 */
export declare const monitorReplicationLag: (sequelize: Sequelize) => Promise<Array<{
    replica: string;
    lag_bytes: number;
    lag_seconds: number;
}>>;
/**
 * Generates unique shard ID
 *
 * @param {string} shardName - Shard name
 * @returns {string} Shard ID
 *
 * @example
 * ```typescript
 * const shardId = generateShardId('us-east-1');
 * ```
 */
export declare const generateShardId: (shardName: string) => string;
/**
 * Estimates table size and index overhead
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<{ table_size: string; index_size: string; total_size: string }>} Size information
 *
 * @example
 * ```typescript
 * const sizes = await estimateTableSize(sequelize, 'network_metrics');
 * ```
 */
export declare const estimateTableSize: (sequelize: Sequelize, tableName: string) => Promise<{
    table_size: string;
    index_size: string;
    total_size: string;
}>;
/**
 * Analyzes query performance for network tables
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<any[]>} Query statistics
 *
 * @example
 * ```typescript
 * const stats = await analyzeQueryPerformance(sequelize, 'devices');
 * ```
 */
export declare const analyzeQueryPerformance: (sequelize: Sequelize, tableName: string) => Promise<any[]>;
/**
 * Optimizes network table statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await optimizeTableStatistics(sequelize, 'network_metrics');
 * ```
 */
export declare const optimizeTableStatistics: (sequelize: Sequelize, tableName: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates database connection pool for network operations
 *
 * @param {object} config - Connection pool configuration
 * @returns {any} Connection pool
 *
 * @example
 * ```typescript
 * const pool = createNetworkConnectionPool({
 *   max: 20,
 *   min: 5,
 *   idle: 10000
 * });
 * ```
 */
export declare const createNetworkConnectionPool: (config: {
    max: number;
    min: number;
    idle: number;
}) => any;
/**
 * Implements database connection retry logic
 *
 * @param {Function} operation - Database operation
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @param {number} [delay=1000] - Delay between retries in ms
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await retryDatabaseOperation(
 *   () => sequelize.query('SELECT * FROM devices'),
 *   5,
 *   2000
 * );
 * ```
 */
export declare const retryDatabaseOperation: (operation: () => Promise<any>, maxRetries?: number, delay?: number) => Promise<any>;
/**
 * Implements query result pagination
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Items per page
 * @param {object} [where] - Where clause
 * @returns {Promise<{ data: any[]; total: number; pages: number }>} Paginated results
 *
 * @example
 * ```typescript
 * const results = await paginateQuery(sequelize, 'devices', 1, 50, { status: 'active' });
 * ```
 */
export declare const paginateQuery: (sequelize: Sequelize, tableName: string, page: number, pageSize: number, where?: Record<string, any>) => Promise<{
    data: any[];
    total: number;
    pages: number;
}>;
/**
 * Creates database materialized view refresh job
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} viewName - Materialized view name
 * @param {string} schedule - Cron schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createMaterializedViewRefreshJob(
 *   sequelize,
 *   'network_stats_hourly',
 *   '0 * * * *'
 * );
 * ```
 */
export declare const createMaterializedViewRefreshJob: (sequelize: Sequelize, viewName: string, schedule: string, transaction?: Transaction) => Promise<void>;
/**
 * Implements database vacuum and analyze strategy
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {boolean} [full=false] - Full vacuum
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await vacuumAndAnalyze(sequelize, 'network_metrics', false);
 * ```
 */
export declare const vacuumAndAnalyze: (sequelize: Sequelize, tableName: string, full?: boolean, transaction?: Transaction) => Promise<void>;
/**
 * Creates database constraint for data validation
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {string} checkExpression - Check expression
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createValidationConstraint(
 *   sequelize,
 *   'devices',
 *   'valid_ip_address',
 *   "ip_address << '0.0.0.0/0'"
 * );
 * ```
 */
export declare const createValidationConstraint: (sequelize: Sequelize, tableName: string, constraintName: string, checkExpression: string, transaction?: Transaction) => Promise<void>;
/**
 * Implements row-level security policy
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} policyName - Policy name
 * @param {string} policyExpression - Policy expression
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createRowLevelSecurityPolicy(
 *   sequelize,
 *   'devices',
 *   'tenant_access',
 *   "tenant_id = current_setting('app.tenant_id')::UUID"
 * );
 * ```
 */
export declare const createRowLevelSecurityPolicy: (sequelize: Sequelize, tableName: string, policyName: string, policyExpression: string, transaction?: Transaction) => Promise<void>;
//# sourceMappingURL=network-data-architecture-kit.d.ts.map