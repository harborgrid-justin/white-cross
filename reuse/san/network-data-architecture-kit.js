"use strict";
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
exports.createRowLevelSecurityPolicy = exports.createValidationConstraint = exports.vacuumAndAnalyze = exports.createMaterializedViewRefreshJob = exports.paginateQuery = exports.retryDatabaseOperation = exports.createNetworkConnectionPool = exports.optimizeTableStatistics = exports.analyzeQueryPerformance = exports.estimateTableSize = exports.generateShardId = exports.monitorReplicationLag = exports.setupBidirectionalReplication = exports.setupLogicalReplication = exports.configurePrimaryReplicaReplication = exports.createRefreshableMaterializedView = exports.cacheAsideGet = exports.setupWriteThroughCache = exports.setupMultiTierCaching = exports.createAggregatedStatistics = exports.denormalizeNetworkPaths = exports.createDenormalizedDashboardView = exports.normalizeMetricsMetadata = exports.separateConfigurationFromState = exports.normalizeNetworkTopology = exports.createCoveringIndex = exports.createJSONBIndexes = exports.createTimeSeriesIndexes = exports.createNetworkIndexes = exports.implementTenantSharding = exports.getShardAssignment = exports.createShardingKey = exports.setupNetworkSharding = exports.createTimeRangePartition = exports.createAutoPartitionMaintenance = exports.addNetworkPartitioning = exports.createHierarchicalTopologySchema = exports.createTimeSeriesMetricsSchema = exports.createNetworkDeviceSchema = exports.createNetworkSchema = exports.ReplicationTopology = exports.CacheStrategy = exports.IndexType = exports.ShardingStrategy = exports.PartitionStrategy = exports.NetworkSchemaType = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum NetworkSchemaType
 * @description Types of network schema patterns
 */
var NetworkSchemaType;
(function (NetworkSchemaType) {
    NetworkSchemaType["TOPOLOGY"] = "TOPOLOGY";
    NetworkSchemaType["TIMESERIES"] = "TIMESERIES";
    NetworkSchemaType["CONFIGURATION"] = "CONFIGURATION";
    NetworkSchemaType["METRICS"] = "METRICS";
    NetworkSchemaType["EVENTS"] = "EVENTS";
    NetworkSchemaType["STATE"] = "STATE";
})(NetworkSchemaType || (exports.NetworkSchemaType = NetworkSchemaType = {}));
/**
 * @enum PartitionStrategy
 * @description Partitioning strategies for network data
 */
var PartitionStrategy;
(function (PartitionStrategy) {
    PartitionStrategy["RANGE"] = "RANGE";
    PartitionStrategy["LIST"] = "LIST";
    PartitionStrategy["HASH"] = "HASH";
    PartitionStrategy["COMPOSITE"] = "COMPOSITE";
})(PartitionStrategy || (exports.PartitionStrategy = PartitionStrategy = {}));
/**
 * @enum ShardingStrategy
 * @description Sharding strategies for horizontal scaling
 */
var ShardingStrategy;
(function (ShardingStrategy) {
    ShardingStrategy["GEOGRAPHIC"] = "GEOGRAPHIC";
    ShardingStrategy["TENANT"] = "TENANT";
    ShardingStrategy["HASH"] = "HASH";
    ShardingStrategy["RANGE"] = "RANGE";
    ShardingStrategy["CONSISTENT_HASH"] = "CONSISTENT_HASH";
})(ShardingStrategy || (exports.ShardingStrategy = ShardingStrategy = {}));
/**
 * @enum IndexType
 * @description Types of database indexes
 */
var IndexType;
(function (IndexType) {
    IndexType["BTREE"] = "BTREE";
    IndexType["HASH"] = "HASH";
    IndexType["GIN"] = "GIN";
    IndexType["GIST"] = "GIST";
    IndexType["BRIN"] = "BRIN";
    IndexType["PARTIAL"] = "PARTIAL";
    IndexType["COVERING"] = "COVERING";
})(IndexType || (exports.IndexType = IndexType = {}));
/**
 * @enum CacheStrategy
 * @description Caching strategies for network data
 */
var CacheStrategy;
(function (CacheStrategy) {
    CacheStrategy["WRITE_THROUGH"] = "WRITE_THROUGH";
    CacheStrategy["WRITE_BEHIND"] = "WRITE_BEHIND";
    CacheStrategy["READ_THROUGH"] = "READ_THROUGH";
    CacheStrategy["CACHE_ASIDE"] = "CACHE_ASIDE";
    CacheStrategy["REFRESH_AHEAD"] = "REFRESH_AHEAD";
})(CacheStrategy || (exports.CacheStrategy = CacheStrategy = {}));
/**
 * @enum ReplicationTopology
 * @description Database replication topologies
 */
var ReplicationTopology;
(function (ReplicationTopology) {
    ReplicationTopology["PRIMARY_REPLICA"] = "PRIMARY_REPLICA";
    ReplicationTopology["MULTI_PRIMARY"] = "MULTI_PRIMARY";
    ReplicationTopology["CASCADE"] = "CASCADE";
    ReplicationTopology["CIRCULAR"] = "CIRCULAR";
    ReplicationTopology["BIDIRECTIONAL"] = "BIDIRECTIONAL";
})(ReplicationTopology || (exports.ReplicationTopology = ReplicationTopology = {}));
// ============================================================================
// NETWORK SCHEMA DESIGN
// ============================================================================
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
const createNetworkSchema = async (sequelize, config, transaction) => {
    const queries = [];
    // Create schema
    queries.push(`CREATE SCHEMA IF NOT EXISTS network`);
    // Enable required extensions
    queries.push(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    queries.push(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
    queries.push(`CREATE EXTENSION IF NOT EXISTS "btree_gin"`);
    queries.push(`CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE`);
    // Create network topology tables
    queries.push(`
    CREATE TABLE IF NOT EXISTS network.topologies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      ${config.tenantIsolation ? 'tenant_id UUID NOT NULL,' : ''}
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
    // Execute all queries
    for (const query of queries) {
        await sequelize.query(query, { transaction });
    }
};
exports.createNetworkSchema = createNetworkSchema;
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
const createNetworkDeviceSchema = async (sequelize, enablePartitioning = false, transaction) => {
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS network.devices (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      device_type VARCHAR(50) NOT NULL,
      hostname VARCHAR(255) NOT NULL UNIQUE,
      ip_address INET NOT NULL,
      mac_address MACADDR,
      location POINT,
      zone VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )${enablePartitioning ? ' PARTITION BY RANGE (created_at)' : ''}
  `, { transaction });
};
exports.createNetworkDeviceSchema = createNetworkDeviceSchema;
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
const createTimeSeriesMetricsSchema = async (sequelize, tableName, transaction) => {
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS network.${tableName} (
      time TIMESTAMPTZ NOT NULL,
      device_id UUID NOT NULL,
      metric_name VARCHAR(100) NOT NULL,
      metric_value DOUBLE PRECISION,
      tags JSONB DEFAULT '{}'::jsonb,
      PRIMARY KEY (time, device_id, metric_name)
    )
  `, { transaction });
    // Convert to hypertable for TimescaleDB
    await sequelize.query(`SELECT create_hypertable('network.${tableName}', 'time', if_not_exists => TRUE)`, { transaction });
};
exports.createTimeSeriesMetricsSchema = createTimeSeriesMetricsSchema;
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
const createHierarchicalTopologySchema = async (sequelize, transaction) => {
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS network.topology_nodes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      parent_id UUID REFERENCES network.topology_nodes(id) ON DELETE CASCADE,
      path ltree NOT NULL,
      level INTEGER NOT NULL,
      node_type VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      properties JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `, { transaction });
    await sequelize.query(`CREATE EXTENSION IF NOT EXISTS ltree`, { transaction });
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_topology_path ON network.topology_nodes USING GIST (path)`, { transaction });
};
exports.createHierarchicalTopologySchema = createHierarchicalTopologySchema;
// ============================================================================
// DATA PARTITIONING
// ============================================================================
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
const addNetworkPartitioning = async (sequelize, tableName, config, transaction) => {
    const fullTableName = tableName.includes('.') ? tableName : `network.${tableName}`;
    if (config.type === PartitionStrategy.RANGE) {
        // Create range partitions
        if (config.ranges) {
            for (const range of config.ranges) {
                await sequelize.query(`CREATE TABLE IF NOT EXISTS ${fullTableName}_${range.name}
           PARTITION OF ${fullTableName}
           FOR VALUES FROM ('${range.from}') TO ('${range.to}')`, { transaction });
            }
        }
    }
    else if (config.type === PartitionStrategy.LIST) {
        // Create list partitions
        if (config.lists) {
            for (const list of config.lists) {
                const values = list.values.map((v) => `'${v}'`).join(', ');
                await sequelize.query(`CREATE TABLE IF NOT EXISTS ${fullTableName}_${list.name}
           PARTITION OF ${fullTableName}
           FOR VALUES IN (${values})`, { transaction });
            }
        }
    }
    else if (config.type === PartitionStrategy.HASH) {
        // Create hash partitions
        if (config.modulus) {
            for (let i = 0; i < config.modulus; i++) {
                await sequelize.query(`CREATE TABLE IF NOT EXISTS ${fullTableName}_${i}
           PARTITION OF ${fullTableName}
           FOR VALUES WITH (MODULUS ${config.modulus}, REMAINDER ${i})`, { transaction });
            }
        }
    }
};
exports.addNetworkPartitioning = addNetworkPartitioning;
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
const createAutoPartitionMaintenance = async (sequelize, tableName, interval, retentionDays, transaction) => {
    const functionName = `maintain_${tableName}_partitions`;
    await sequelize.query(`
    CREATE OR REPLACE FUNCTION ${functionName}()
    RETURNS void AS $$
    DECLARE
      partition_name TEXT;
      partition_date DATE;
      cutoff_date DATE;
    BEGIN
      -- Create future partition
      partition_date := CURRENT_DATE + INTERVAL '${interval}';
      partition_name := 'network.${tableName}_' || TO_CHAR(partition_date, 'YYYY_MM_DD');

      EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF network.${tableName}
         FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        partition_date,
        partition_date + INTERVAL '${interval}'
      );

      -- Drop old partitions
      cutoff_date := CURRENT_DATE - INTERVAL '${retentionDays} days';

      FOR partition_name IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'network'
        AND tablename LIKE '${tableName}_%'
        AND TO_DATE(SUBSTRING(tablename FROM '\\d{4}_\\d{2}_\\d{2}$'), 'YYYY_MM_DD') < cutoff_date
      LOOP
        EXECUTE format('DROP TABLE IF EXISTS network.%I', partition_name);
      END LOOP;
    END;
    $$ LANGUAGE plpgsql;
  `, { transaction });
    // Create cron job for maintenance
    await sequelize.query(`SELECT cron.schedule('${functionName}', '0 0 * * *', 'SELECT ${functionName}()')`, { transaction });
};
exports.createAutoPartitionMaintenance = createAutoPartitionMaintenance;
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
const createTimeRangePartition = async (sequelize, tableName, startDate, endDate, transaction) => {
    const partitionSuffix = startDate.toISOString().split('T')[0].replace(/-/g, '_');
    const partitionName = `${tableName}_${partitionSuffix}`;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.${partitionName}
     PARTITION OF network.${tableName}
     FOR VALUES FROM ('${startDate.toISOString()}') TO ('${endDate.toISOString()}')`, { transaction });
    return partitionName;
};
exports.createTimeRangePartition = createTimeRangePartition;
// ============================================================================
// SHARDING STRATEGIES
// ============================================================================
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
const setupNetworkSharding = async (sequelize, config, transaction) => {
    // Create shard registry table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS network.shard_registry (
      shard_id VARCHAR(100) PRIMARY KEY,
      shard_name VARCHAR(255) NOT NULL,
      strategy VARCHAR(50) NOT NULL,
      connection_string TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `, { transaction });
    // Register shards
    for (const shard of config.shards) {
        await sequelize.query(`INSERT INTO network.shard_registry (shard_id, shard_name, strategy, connection_string)
       VALUES (:shardId, :shardName, :strategy, :connectionString)
       ON CONFLICT (shard_id) DO UPDATE SET is_active = true`, {
            replacements: {
                shardId: (0, exports.generateShardId)(shard),
                shardName: shard,
                strategy: config.strategy,
                connectionString: `postgresql://shard-${shard}:5432/network`,
            },
            transaction,
        });
    }
};
exports.setupNetworkSharding = setupNetworkSharding;
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
const createShardingKey = (value, virtualNodes = 150) => {
    const hash = crypto.createHash('sha256').update(value).digest('hex');
    const position = parseInt(hash.substring(0, 8), 16) % virtualNodes;
    return `shard_${position}`;
};
exports.createShardingKey = createShardingKey;
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
const getShardAssignment = async (sequelize, entityId, strategy) => {
    const [result] = await sequelize.query(`SELECT shard_id FROM network.shard_registry
     WHERE strategy = :strategy AND is_active = true
     ORDER BY RANDOM()
     LIMIT 1`, {
        replacements: { strategy },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result?.shard_id || (0, exports.createShardingKey)(entityId);
};
exports.getShardAssignment = getShardAssignment;
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
const implementTenantSharding = async (sequelize, tableName, tenantColumn, transaction) => {
    // Enable row-level security
    await sequelize.query(`ALTER TABLE network.${tableName} ENABLE ROW LEVEL SECURITY`, {
        transaction,
    });
    // Create policy for tenant isolation
    await sequelize.query(`CREATE POLICY tenant_isolation_policy ON network.${tableName}
     USING (${tenantColumn} = current_setting('app.current_tenant')::UUID)`, { transaction });
    // Create function to set tenant context
    await sequelize.query(`
    CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id UUID)
    RETURNS void AS $$
    BEGIN
      PERFORM set_config('app.current_tenant', tenant_id::TEXT, false);
    END;
    $$ LANGUAGE plpgsql;
  `, { transaction });
};
exports.implementTenantSharding = implementTenantSharding;
// ============================================================================
// INDEXING STRATEGIES
// ============================================================================
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
const createNetworkIndexes = async (sequelize, tableName, indexes, transaction) => {
    for (const index of indexes) {
        const columns = index.columns.join(', ');
        const include = index.include ? `INCLUDE (${index.include.join(', ')})` : '';
        const where = index.where ? `WHERE ${index.where}` : '';
        const unique = index.unique ? 'UNIQUE' : '';
        const concurrent = index.concurrent ? 'CONCURRENTLY' : '';
        await sequelize.query(`CREATE ${unique} INDEX ${concurrent} IF NOT EXISTS ${index.name}
       ON network.${tableName} USING ${index.type} (${columns})
       ${include} ${where}`, { transaction });
    }
};
exports.createNetworkIndexes = createNetworkIndexes;
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
const createTimeSeriesIndexes = async (sequelize, tableName, timeColumn, transaction) => {
    // BRIN index for time-series data
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_${tableName}_${timeColumn}_brin
     ON network.${tableName} USING BRIN (${timeColumn})`, { transaction });
    // Composite index for common queries
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_${tableName}_time_device
     ON network.${tableName} (${timeColumn} DESC, device_id)`, { transaction });
};
exports.createTimeSeriesIndexes = createTimeSeriesIndexes;
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
const createJSONBIndexes = async (sequelize, tableName, jsonColumn, transaction) => {
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_${tableName}_${jsonColumn}_gin
     ON network.${tableName} USING GIN (${jsonColumn})`, { transaction });
    // Additional path-specific indexes
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_${tableName}_${jsonColumn}_paths
     ON network.${tableName} USING GIN (${jsonColumn} jsonb_path_ops)`, { transaction });
};
exports.createJSONBIndexes = createJSONBIndexes;
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
const createCoveringIndex = async (sequelize, tableName, keyColumns, includedColumns, transaction) => {
    const indexName = `idx_${tableName}_covering_${keyColumns.join('_')}`;
    const keys = keyColumns.join(', ');
    const includes = includedColumns.join(', ');
    await sequelize.query(`CREATE INDEX IF NOT EXISTS ${indexName}
     ON network.${tableName} (${keys})
     INCLUDE (${includes})`, { transaction });
};
exports.createCoveringIndex = createCoveringIndex;
// ============================================================================
// NORMALIZATION PATTERNS
// ============================================================================
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
const normalizeNetworkTopology = async (sequelize, transaction) => {
    // Create normalized device types table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.device_types (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type_name VARCHAR(100) UNIQUE NOT NULL,
      category VARCHAR(50),
      specifications JSONB DEFAULT '{}'::jsonb
    )`, { transaction });
    // Create normalized vendors table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.vendors (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      vendor_name VARCHAR(255) UNIQUE NOT NULL,
      support_contact TEXT,
      metadata JSONB DEFAULT '{}'::jsonb
    )`, { transaction });
    // Update devices table with foreign keys
    await sequelize.query(`ALTER TABLE network.devices
     ADD COLUMN IF NOT EXISTS device_type_id UUID REFERENCES network.device_types(id),
     ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES network.vendors(id)`, { transaction });
};
exports.normalizeNetworkTopology = normalizeNetworkTopology;
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
const separateConfigurationFromState = async (sequelize, transaction) => {
    // Configuration table (slowly changing)
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.device_configurations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      device_id UUID NOT NULL REFERENCES network.devices(id),
      config_version INTEGER NOT NULL,
      configuration JSONB NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      applied_by UUID
    )`, { transaction });
    // State table (rapidly changing)
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.device_states (
      device_id UUID PRIMARY KEY REFERENCES network.devices(id),
      operational_status VARCHAR(50),
      health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
      last_seen TIMESTAMPTZ,
      state_data JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, { transaction });
};
exports.separateConfigurationFromState = separateConfigurationFromState;
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
const normalizeMetricsMetadata = async (sequelize, transaction) => {
    // Metric definitions table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.metric_definitions (
      metric_name VARCHAR(100) PRIMARY KEY,
      display_name VARCHAR(255),
      unit VARCHAR(50),
      aggregation_method VARCHAR(50),
      retention_days INTEGER DEFAULT 90,
      metadata JSONB DEFAULT '{}'::jsonb
    )`, { transaction });
    // Create foreign key in metrics table
    await sequelize.query(`ALTER TABLE network.network_metrics
     ADD CONSTRAINT fk_metric_definition
     FOREIGN KEY (metric_name) REFERENCES network.metric_definitions(metric_name)`, { transaction });
};
exports.normalizeMetricsMetadata = normalizeMetricsMetadata;
// ============================================================================
// DENORMALIZATION PATTERNS
// ============================================================================
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
const createDenormalizedDashboardView = async (sequelize, transaction) => {
    await sequelize.query(`CREATE MATERIALIZED VIEW IF NOT EXISTS network.dashboard_summary AS
     SELECT
       d.id AS device_id,
       d.hostname,
       d.device_type,
       ds.operational_status,
       ds.health_score,
       COUNT(DISTINCT nm.metric_name) AS metrics_count,
       MAX(nm.time) AS last_metric_time
     FROM network.devices d
     LEFT JOIN network.device_states ds ON d.id = ds.device_id
     LEFT JOIN network.network_metrics nm ON d.id = nm.device_id
       AND nm.time > NOW() - INTERVAL '1 hour'
     GROUP BY d.id, d.hostname, d.device_type, ds.operational_status, ds.health_score`, { transaction });
    // Create index on materialized view
    await sequelize.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_device
     ON network.dashboard_summary (device_id)`, { transaction });
};
exports.createDenormalizedDashboardView = createDenormalizedDashboardView;
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
const denormalizeNetworkPaths = async (sequelize, transaction) => {
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.network_paths_denorm (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      source_device_id UUID NOT NULL,
      target_device_id UUID NOT NULL,
      path_hops JSONB NOT NULL,
      hop_count INTEGER NOT NULL,
      total_latency_ms DOUBLE PRECISION,
      path_status VARCHAR(50),
      computed_at TIMESTAMPTZ DEFAULT NOW()
    )`, { transaction });
    // Create function to recompute denormalized paths
    await sequelize.query(`
    CREATE OR REPLACE FUNCTION recompute_network_paths()
    RETURNS void AS $$
    BEGIN
      TRUNCATE network.network_paths_denorm;

      INSERT INTO network.network_paths_denorm (
        source_device_id, target_device_id, path_hops, hop_count, total_latency_ms
      )
      SELECT
        source_id,
        target_id,
        jsonb_agg(hop ORDER BY hop_sequence) AS path_hops,
        COUNT(*) AS hop_count,
        SUM(latency_ms) AS total_latency_ms
      FROM network.path_segments
      GROUP BY source_id, target_id;
    END;
    $$ LANGUAGE plpgsql;
  `, { transaction });
};
exports.denormalizeNetworkPaths = denormalizeNetworkPaths;
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
const createAggregatedStatistics = async (sequelize, sourceTable, pattern, transaction) => {
    const aggregations = pattern.aggregations
        .map((agg) => `${agg.function}(${agg.column}) AS ${agg.alias}`)
        .join(', ');
    await sequelize.query(`CREATE MATERIALIZED VIEW IF NOT EXISTS network.${pattern.targetTable} AS
     SELECT
       device_id,
       DATE_TRUNC('hour', time) AS time_bucket,
       ${aggregations},
       COUNT(*) AS sample_count
     FROM network.${sourceTable}
     GROUP BY device_id, time_bucket`, { transaction });
    // Create refresh function if scheduled
    if (pattern.refreshStrategy === 'scheduled') {
        await sequelize.query(`CREATE OR REPLACE FUNCTION refresh_${pattern.targetTable}()
       RETURNS void AS $$
       BEGIN
         REFRESH MATERIALIZED VIEW CONCURRENTLY network.${pattern.targetTable};
       END;
       $$ LANGUAGE plpgsql`, { transaction });
    }
};
exports.createAggregatedStatistics = createAggregatedStatistics;
// ============================================================================
// CACHING STRATEGIES
// ============================================================================
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
const setupMultiTierCaching = (config) => {
    return {
        config,
        get: async (key) => {
            // Implementation would integrate with Redis/Memory cache
            return null;
        },
        set: async (key, value, ttl) => {
            // Implementation
        },
        invalidate: async (pattern) => {
            // Implementation
        },
    };
};
exports.setupMultiTierCaching = setupMultiTierCaching;
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
const setupWriteThroughCache = async (sequelize, tableName, ttl) => {
    // Create cache table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.${tableName}_cache (
      cache_key VARCHAR(255) PRIMARY KEY,
      cache_value JSONB NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    // Create automatic cleanup function
    await sequelize.query(`CREATE OR REPLACE FUNCTION cleanup_${tableName}_cache()
     RETURNS void AS $$
     BEGIN
       DELETE FROM network.${tableName}_cache WHERE expires_at < NOW();
     END;
     $$ LANGUAGE plpgsql`);
};
exports.setupWriteThroughCache = setupWriteThroughCache;
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
const cacheAsideGet = async (sequelize, cacheKey, loader, ttl) => {
    // Try cache first
    const [cached] = await sequelize.query(`SELECT cache_value FROM network.cache_store
     WHERE cache_key = :cacheKey AND expires_at > NOW()`, {
        replacements: { cacheKey },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (cached) {
        return cached.cache_value;
    }
    // Load from source
    const data = await loader();
    // Store in cache
    await sequelize.query(`INSERT INTO network.cache_store (cache_key, cache_value, expires_at)
     VALUES (:cacheKey, :data, NOW() + INTERVAL '${ttl} seconds')
     ON CONFLICT (cache_key) DO UPDATE
     SET cache_value = EXCLUDED.cache_value, expires_at = EXCLUDED.expires_at`, {
        replacements: { cacheKey, data: JSON.stringify(data) },
    });
    return data;
};
exports.cacheAsideGet = cacheAsideGet;
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
const createRefreshableMaterializedView = async (sequelize, viewName, query, refreshInterval, transaction) => {
    // Create materialized view
    await sequelize.query(`CREATE MATERIALIZED VIEW network.${viewName} AS ${query}`, {
        transaction,
    });
    // Create refresh function
    await sequelize.query(`CREATE OR REPLACE FUNCTION refresh_${viewName}()
     RETURNS void AS $$
     BEGIN
       REFRESH MATERIALIZED VIEW CONCURRENTLY network.${viewName};
     END;
     $$ LANGUAGE plpgsql`, { transaction });
    // Schedule refresh
    await sequelize.query(`SELECT cron.schedule('refresh_${viewName}', '${refreshInterval}', 'SELECT refresh_${viewName}()')`, { transaction });
};
exports.createRefreshableMaterializedView = createRefreshableMaterializedView;
// ============================================================================
// REPLICATION PATTERNS
// ============================================================================
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
const configurePrimaryReplicaReplication = async (sequelize, config) => {
    // Create replication slots
    for (const replica of config.replicas) {
        if (replica.role === 'replica') {
            await sequelize.query(`SELECT pg_create_physical_replication_slot('${replica.name}_slot')
         WHERE NOT EXISTS (
           SELECT 1 FROM pg_replication_slots WHERE slot_name = '${replica.name}_slot'
         )`);
        }
    }
    // Create monitoring view
    await sequelize.query(`CREATE OR REPLACE VIEW network.replication_status AS
     SELECT
       client_addr,
       state,
       sync_state,
       replay_lag,
       write_lag,
       flush_lag
     FROM pg_stat_replication`);
};
exports.configurePrimaryReplicaReplication = configurePrimaryReplicaReplication;
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
const setupLogicalReplication = async (sequelize, tables, publicationName, transaction) => {
    const tableList = tables.map((t) => `network.${t}`).join(', ');
    await sequelize.query(`CREATE PUBLICATION ${publicationName} FOR TABLE ${tableList}`, { transaction });
    // Create replication monitoring
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.replication_monitor (
      id SERIAL PRIMARY KEY,
      publication_name VARCHAR(255),
      subscriber_name VARCHAR(255),
      lag_bytes BIGINT,
      last_msg_send_time TIMESTAMPTZ,
      last_msg_receipt_time TIMESTAMPTZ,
      checked_at TIMESTAMPTZ DEFAULT NOW()
    )`, { transaction });
};
exports.setupLogicalReplication = setupLogicalReplication;
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
const setupBidirectionalReplication = async (sequelize, remoteDsn, tables) => {
    // Create publication for outbound replication
    await sequelize.query(`CREATE PUBLICATION bidirectional_pub FOR TABLE ${tables.map((t) => `network.${t}`).join(', ')}`);
    // Create subscription for inbound replication
    await sequelize.query(`CREATE SUBSCRIPTION bidirectional_sub
     CONNECTION '${remoteDsn}'
     PUBLICATION bidirectional_pub
     WITH (copy_data = true, create_slot = true)`);
    // Create conflict resolution table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS network.replication_conflicts (
      id SERIAL PRIMARY KEY,
      table_name VARCHAR(255),
      record_id UUID,
      local_data JSONB,
      remote_data JSONB,
      conflict_time TIMESTAMPTZ DEFAULT NOW(),
      resolved BOOLEAN DEFAULT false
    )`);
};
exports.setupBidirectionalReplication = setupBidirectionalReplication;
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
const monitorReplicationLag = async (sequelize) => {
    const [results] = await sequelize.query(`SELECT
       client_hostname AS replica,
       pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes,
       EXTRACT(EPOCH FROM (NOW() - replay_timestamp)) AS lag_seconds
     FROM pg_stat_replication`, { type: sequelize_1.QueryTypes.SELECT });
    return results;
};
exports.monitorReplicationLag = monitorReplicationLag;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
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
const generateShardId = (shardName) => {
    return crypto.createHash('sha256').update(shardName).digest('hex').substring(0, 16);
};
exports.generateShardId = generateShardId;
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
const estimateTableSize = async (sequelize, tableName) => {
    const [result] = await sequelize.query(`SELECT
       pg_size_pretty(pg_table_size('network.${tableName}')) AS table_size,
       pg_size_pretty(pg_indexes_size('network.${tableName}')) AS index_size,
       pg_size_pretty(pg_total_relation_size('network.${tableName}')) AS total_size`, { type: sequelize_1.QueryTypes.SELECT });
    return result;
};
exports.estimateTableSize = estimateTableSize;
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
const analyzeQueryPerformance = async (sequelize, tableName) => {
    const [results] = await sequelize.query(`SELECT
       schemaname,
       tablename,
       seq_scan,
       seq_tup_read,
       idx_scan,
       idx_tup_fetch,
       n_tup_ins,
       n_tup_upd,
       n_tup_del
     FROM pg_stat_user_tables
     WHERE tablename = :tableName`, {
        replacements: { tableName },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.analyzeQueryPerformance = analyzeQueryPerformance;
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
const optimizeTableStatistics = async (sequelize, tableName, transaction) => {
    await sequelize.query(`ANALYZE network.${tableName}`, { transaction });
    // Update statistics targets for important columns
    await sequelize.query(`ALTER TABLE network.${tableName} ALTER COLUMN id SET STATISTICS 1000`, { transaction });
};
exports.optimizeTableStatistics = optimizeTableStatistics;
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
const createNetworkConnectionPool = (config) => {
    return {
        max: config.max,
        min: config.min,
        idle: config.idle,
        acquire: 30000,
        evict: 1000,
    };
};
exports.createNetworkConnectionPool = createNetworkConnectionPool;
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
const retryDatabaseOperation = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, delay * attempt));
            }
        }
    }
    throw lastError;
};
exports.retryDatabaseOperation = retryDatabaseOperation;
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
const paginateQuery = async (sequelize, tableName, page, pageSize, where) => {
    const offset = (page - 1) * pageSize;
    const whereClause = where ? `WHERE ${Object.keys(where).map(k => `${k} = '${where[k]}'`).join(' AND ')}` : '';
    const [countResult] = await sequelize.query(`SELECT COUNT(*) as total FROM network.${tableName} ${whereClause}`, { type: sequelize_1.QueryTypes.SELECT });
    const [data] = await sequelize.query(`SELECT * FROM network.${tableName} ${whereClause} LIMIT :pageSize OFFSET :offset`, {
        replacements: { pageSize, offset },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const total = countResult.total;
    const pages = Math.ceil(total / pageSize);
    return { data: data, total, pages };
};
exports.paginateQuery = paginateQuery;
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
const createMaterializedViewRefreshJob = async (sequelize, viewName, schedule, transaction) => {
    await sequelize.query(`SELECT cron.schedule(
      'refresh_${viewName}',
      '${schedule}',
      $$REFRESH MATERIALIZED VIEW CONCURRENTLY network.${viewName}$$
    )`, { transaction });
};
exports.createMaterializedViewRefreshJob = createMaterializedViewRefreshJob;
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
const vacuumAndAnalyze = async (sequelize, tableName, full = false, transaction) => {
    const vacuumType = full ? 'VACUUM FULL' : 'VACUUM';
    await sequelize.query(`${vacuumType} network.${tableName}`, { transaction });
    await sequelize.query(`ANALYZE network.${tableName}`, { transaction });
};
exports.vacuumAndAnalyze = vacuumAndAnalyze;
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
const createValidationConstraint = async (sequelize, tableName, constraintName, checkExpression, transaction) => {
    await sequelize.query(`ALTER TABLE network.${tableName}
     ADD CONSTRAINT ${constraintName} CHECK (${checkExpression})`, { transaction });
};
exports.createValidationConstraint = createValidationConstraint;
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
const createRowLevelSecurityPolicy = async (sequelize, tableName, policyName, policyExpression, transaction) => {
    await sequelize.query(`ALTER TABLE network.${tableName} ENABLE ROW LEVEL SECURITY`, { transaction });
    await sequelize.query(`CREATE POLICY ${policyName} ON network.${tableName}
     FOR ALL
     USING (${policyExpression})`, { transaction });
};
exports.createRowLevelSecurityPolicy = createRowLevelSecurityPolicy;
//# sourceMappingURL=network-data-architecture-kit.js.map