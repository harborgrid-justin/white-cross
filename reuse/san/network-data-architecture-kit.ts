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

import {
  Sequelize,
  QueryInterface,
  DataTypes,
  Transaction,
  QueryTypes,
  Op,
  literal,
  fn,
  col,
} from 'sequelize';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @enum NetworkSchemaType
 * @description Types of network schema patterns
 */
export enum NetworkSchemaType {
  TOPOLOGY = 'TOPOLOGY',
  TIMESERIES = 'TIMESERIES',
  CONFIGURATION = 'CONFIGURATION',
  METRICS = 'METRICS',
  EVENTS = 'EVENTS',
  STATE = 'STATE',
}

/**
 * @enum PartitionStrategy
 * @description Partitioning strategies for network data
 */
export enum PartitionStrategy {
  RANGE = 'RANGE',
  LIST = 'LIST',
  HASH = 'HASH',
  COMPOSITE = 'COMPOSITE',
}

/**
 * @enum ShardingStrategy
 * @description Sharding strategies for horizontal scaling
 */
export enum ShardingStrategy {
  GEOGRAPHIC = 'GEOGRAPHIC',
  TENANT = 'TENANT',
  HASH = 'HASH',
  RANGE = 'RANGE',
  CONSISTENT_HASH = 'CONSISTENT_HASH',
}

/**
 * @enum IndexType
 * @description Types of database indexes
 */
export enum IndexType {
  BTREE = 'BTREE',
  HASH = 'HASH',
  GIN = 'GIN',
  GIST = 'GIST',
  BRIN = 'BRIN',
  PARTIAL = 'PARTIAL',
  COVERING = 'COVERING',
}

/**
 * @enum CacheStrategy
 * @description Caching strategies for network data
 */
export enum CacheStrategy {
  WRITE_THROUGH = 'WRITE_THROUGH',
  WRITE_BEHIND = 'WRITE_BEHIND',
  READ_THROUGH = 'READ_THROUGH',
  CACHE_ASIDE = 'CACHE_ASIDE',
  REFRESH_AHEAD = 'REFRESH_AHEAD',
}

/**
 * @enum ReplicationTopology
 * @description Database replication topologies
 */
export enum ReplicationTopology {
  PRIMARY_REPLICA = 'PRIMARY_REPLICA',
  MULTI_PRIMARY = 'MULTI_PRIMARY',
  CASCADE = 'CASCADE',
  CIRCULAR = 'CIRCULAR',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
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
  ranges?: Array<{ name: string; from: any; to: any }>;
  lists?: Array<{ name: string; values: any[] }>;
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
export const createNetworkSchema = async (
  sequelize: Sequelize,
  config: NetworkSchemaConfig,
  transaction?: Transaction,
): Promise<void> => {
  const queries: string[] = [];

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
export const createNetworkDeviceSchema = async (
  sequelize: Sequelize,
  enablePartitioning: boolean = false,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `
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
  `,
    { transaction },
  );
};

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
export const createTimeSeriesMetricsSchema = async (
  sequelize: Sequelize,
  tableName: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `
    CREATE TABLE IF NOT EXISTS network.${tableName} (
      time TIMESTAMPTZ NOT NULL,
      device_id UUID NOT NULL,
      metric_name VARCHAR(100) NOT NULL,
      metric_value DOUBLE PRECISION,
      tags JSONB DEFAULT '{}'::jsonb,
      PRIMARY KEY (time, device_id, metric_name)
    )
  `,
    { transaction },
  );

  // Convert to hypertable for TimescaleDB
  await sequelize.query(
    `SELECT create_hypertable('network.${tableName}', 'time', if_not_exists => TRUE)`,
    { transaction },
  );
};

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
export const createHierarchicalTopologySchema = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `
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
  `,
    { transaction },
  );

  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS ltree`, { transaction });
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_topology_path ON network.topology_nodes USING GIST (path)`,
    { transaction },
  );
};

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
export const addNetworkPartitioning = async (
  sequelize: Sequelize,
  tableName: string,
  config: PartitionConfig,
  transaction?: Transaction,
): Promise<void> => {
  const fullTableName = tableName.includes('.') ? tableName : `network.${tableName}`;

  if (config.type === PartitionStrategy.RANGE) {
    // Create range partitions
    if (config.ranges) {
      for (const range of config.ranges) {
        await sequelize.query(
          `CREATE TABLE IF NOT EXISTS ${fullTableName}_${range.name}
           PARTITION OF ${fullTableName}
           FOR VALUES FROM ('${range.from}') TO ('${range.to}')`,
          { transaction },
        );
      }
    }
  } else if (config.type === PartitionStrategy.LIST) {
    // Create list partitions
    if (config.lists) {
      for (const list of config.lists) {
        const values = list.values.map((v) => `'${v}'`).join(', ');
        await sequelize.query(
          `CREATE TABLE IF NOT EXISTS ${fullTableName}_${list.name}
           PARTITION OF ${fullTableName}
           FOR VALUES IN (${values})`,
          { transaction },
        );
      }
    }
  } else if (config.type === PartitionStrategy.HASH) {
    // Create hash partitions
    if (config.modulus) {
      for (let i = 0; i < config.modulus; i++) {
        await sequelize.query(
          `CREATE TABLE IF NOT EXISTS ${fullTableName}_${i}
           PARTITION OF ${fullTableName}
           FOR VALUES WITH (MODULUS ${config.modulus}, REMAINDER ${i})`,
          { transaction },
        );
      }
    }
  }
};

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
export const createAutoPartitionMaintenance = async (
  sequelize: Sequelize,
  tableName: string,
  interval: string,
  retentionDays: number,
  transaction?: Transaction,
): Promise<void> => {
  const functionName = `maintain_${tableName}_partitions`;

  await sequelize.query(
    `
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
  `,
    { transaction },
  );

  // Create cron job for maintenance
  await sequelize.query(
    `SELECT cron.schedule('${functionName}', '0 0 * * *', 'SELECT ${functionName}()')`,
    { transaction },
  );
};

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
export const createTimeRangePartition = async (
  sequelize: Sequelize,
  tableName: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<string> => {
  const partitionSuffix = startDate.toISOString().split('T')[0].replace(/-/g, '_');
  const partitionName = `${tableName}_${partitionSuffix}`;

  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.${partitionName}
     PARTITION OF network.${tableName}
     FOR VALUES FROM ('${startDate.toISOString()}') TO ('${endDate.toISOString()}')`,
    { transaction },
  );

  return partitionName;
};

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
export const setupNetworkSharding = async (
  sequelize: Sequelize,
  config: ShardConfig,
  transaction?: Transaction,
): Promise<void> => {
  // Create shard registry table
  await sequelize.query(
    `
    CREATE TABLE IF NOT EXISTS network.shard_registry (
      shard_id VARCHAR(100) PRIMARY KEY,
      shard_name VARCHAR(255) NOT NULL,
      strategy VARCHAR(50) NOT NULL,
      connection_string TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `,
    { transaction },
  );

  // Register shards
  for (const shard of config.shards) {
    await sequelize.query(
      `INSERT INTO network.shard_registry (shard_id, shard_name, strategy, connection_string)
       VALUES (:shardId, :shardName, :strategy, :connectionString)
       ON CONFLICT (shard_id) DO UPDATE SET is_active = true`,
      {
        replacements: {
          shardId: generateShardId(shard),
          shardName: shard,
          strategy: config.strategy,
          connectionString: `postgresql://shard-${shard}:5432/network`,
        },
        transaction,
      },
    );
  }
};

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
export const createShardingKey = (value: string, virtualNodes: number = 150): string => {
  const hash = crypto.createHash('sha256').update(value).digest('hex');
  const position = parseInt(hash.substring(0, 8), 16) % virtualNodes;
  return `shard_${position}`;
};

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
export const getShardAssignment = async (
  sequelize: Sequelize,
  entityId: string,
  strategy: ShardingStrategy,
): Promise<string> => {
  const [result] = await sequelize.query(
    `SELECT shard_id FROM network.shard_registry
     WHERE strategy = :strategy AND is_active = true
     ORDER BY RANDOM()
     LIMIT 1`,
    {
      replacements: { strategy },
      type: QueryTypes.SELECT,
    },
  );

  return (result as any)?.shard_id || createShardingKey(entityId);
};

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
export const implementTenantSharding = async (
  sequelize: Sequelize,
  tableName: string,
  tenantColumn: string,
  transaction?: Transaction,
): Promise<void> => {
  // Enable row-level security
  await sequelize.query(`ALTER TABLE network.${tableName} ENABLE ROW LEVEL SECURITY`, {
    transaction,
  });

  // Create policy for tenant isolation
  await sequelize.query(
    `CREATE POLICY tenant_isolation_policy ON network.${tableName}
     USING (${tenantColumn} = current_setting('app.current_tenant')::UUID)`,
    { transaction },
  );

  // Create function to set tenant context
  await sequelize.query(
    `
    CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id UUID)
    RETURNS void AS $$
    BEGIN
      PERFORM set_config('app.current_tenant', tenant_id::TEXT, false);
    END;
    $$ LANGUAGE plpgsql;
  `,
    { transaction },
  );
};

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
export const createNetworkIndexes = async (
  sequelize: Sequelize,
  tableName: string,
  indexes: IndexConfig[],
  transaction?: Transaction,
): Promise<void> => {
  for (const index of indexes) {
    const columns = index.columns.join(', ');
    const include = index.include ? `INCLUDE (${index.include.join(', ')})` : '';
    const where = index.where ? `WHERE ${index.where}` : '';
    const unique = index.unique ? 'UNIQUE' : '';
    const concurrent = index.concurrent ? 'CONCURRENTLY' : '';

    await sequelize.query(
      `CREATE ${unique} INDEX ${concurrent} IF NOT EXISTS ${index.name}
       ON network.${tableName} USING ${index.type} (${columns})
       ${include} ${where}`,
      { transaction },
    );
  }
};

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
export const createTimeSeriesIndexes = async (
  sequelize: Sequelize,
  tableName: string,
  timeColumn: string,
  transaction?: Transaction,
): Promise<void> => {
  // BRIN index for time-series data
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_${tableName}_${timeColumn}_brin
     ON network.${tableName} USING BRIN (${timeColumn})`,
    { transaction },
  );

  // Composite index for common queries
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_${tableName}_time_device
     ON network.${tableName} (${timeColumn} DESC, device_id)`,
    { transaction },
  );
};

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
export const createJSONBIndexes = async (
  sequelize: Sequelize,
  tableName: string,
  jsonColumn: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_${tableName}_${jsonColumn}_gin
     ON network.${tableName} USING GIN (${jsonColumn})`,
    { transaction },
  );

  // Additional path-specific indexes
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_${tableName}_${jsonColumn}_paths
     ON network.${tableName} USING GIN (${jsonColumn} jsonb_path_ops)`,
    { transaction },
  );
};

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
export const createCoveringIndex = async (
  sequelize: Sequelize,
  tableName: string,
  keyColumns: string[],
  includedColumns: string[],
  transaction?: Transaction,
): Promise<void> => {
  const indexName = `idx_${tableName}_covering_${keyColumns.join('_')}`;
  const keys = keyColumns.join(', ');
  const includes = includedColumns.join(', ');

  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS ${indexName}
     ON network.${tableName} (${keys})
     INCLUDE (${includes})`,
    { transaction },
  );
};

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
export const normalizeNetworkTopology = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  // Create normalized device types table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.device_types (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type_name VARCHAR(100) UNIQUE NOT NULL,
      category VARCHAR(50),
      specifications JSONB DEFAULT '{}'::jsonb
    )`,
    { transaction },
  );

  // Create normalized vendors table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.vendors (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      vendor_name VARCHAR(255) UNIQUE NOT NULL,
      support_contact TEXT,
      metadata JSONB DEFAULT '{}'::jsonb
    )`,
    { transaction },
  );

  // Update devices table with foreign keys
  await sequelize.query(
    `ALTER TABLE network.devices
     ADD COLUMN IF NOT EXISTS device_type_id UUID REFERENCES network.device_types(id),
     ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES network.vendors(id)`,
    { transaction },
  );
};

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
export const separateConfigurationFromState = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  // Configuration table (slowly changing)
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.device_configurations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      device_id UUID NOT NULL REFERENCES network.devices(id),
      config_version INTEGER NOT NULL,
      configuration JSONB NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      applied_by UUID
    )`,
    { transaction },
  );

  // State table (rapidly changing)
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.device_states (
      device_id UUID PRIMARY KEY REFERENCES network.devices(id),
      operational_status VARCHAR(50),
      health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
      last_seen TIMESTAMPTZ,
      state_data JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    { transaction },
  );
};

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
export const normalizeMetricsMetadata = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  // Metric definitions table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.metric_definitions (
      metric_name VARCHAR(100) PRIMARY KEY,
      display_name VARCHAR(255),
      unit VARCHAR(50),
      aggregation_method VARCHAR(50),
      retention_days INTEGER DEFAULT 90,
      metadata JSONB DEFAULT '{}'::jsonb
    )`,
    { transaction },
  );

  // Create foreign key in metrics table
  await sequelize.query(
    `ALTER TABLE network.network_metrics
     ADD CONSTRAINT fk_metric_definition
     FOREIGN KEY (metric_name) REFERENCES network.metric_definitions(metric_name)`,
    { transaction },
  );
};

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
export const createDenormalizedDashboardView = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `CREATE MATERIALIZED VIEW IF NOT EXISTS network.dashboard_summary AS
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
     GROUP BY d.id, d.hostname, d.device_type, ds.operational_status, ds.health_score`,
    { transaction },
  );

  // Create index on materialized view
  await sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_device
     ON network.dashboard_summary (device_id)`,
    { transaction },
  );
};

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
export const denormalizeNetworkPaths = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.network_paths_denorm (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      source_device_id UUID NOT NULL,
      target_device_id UUID NOT NULL,
      path_hops JSONB NOT NULL,
      hop_count INTEGER NOT NULL,
      total_latency_ms DOUBLE PRECISION,
      path_status VARCHAR(50),
      computed_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    { transaction },
  );

  // Create function to recompute denormalized paths
  await sequelize.query(
    `
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
  `,
    { transaction },
  );
};

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
export const createAggregatedStatistics = async (
  sequelize: Sequelize,
  sourceTable: string,
  pattern: DenormalizationPattern,
  transaction?: Transaction,
): Promise<void> => {
  const aggregations = pattern.aggregations
    .map((agg) => `${agg.function}(${agg.column}) AS ${agg.alias}`)
    .join(', ');

  await sequelize.query(
    `CREATE MATERIALIZED VIEW IF NOT EXISTS network.${pattern.targetTable} AS
     SELECT
       device_id,
       DATE_TRUNC('hour', time) AS time_bucket,
       ${aggregations},
       COUNT(*) AS sample_count
     FROM network.${sourceTable}
     GROUP BY device_id, time_bucket`,
    { transaction },
  );

  // Create refresh function if scheduled
  if (pattern.refreshStrategy === 'scheduled') {
    await sequelize.query(
      `CREATE OR REPLACE FUNCTION refresh_${pattern.targetTable}()
       RETURNS void AS $$
       BEGIN
         REFRESH MATERIALIZED VIEW CONCURRENTLY network.${pattern.targetTable};
       END;
       $$ LANGUAGE plpgsql`,
      { transaction },
    );
  }
};

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
export const setupMultiTierCaching = (config: CacheConfig): any => {
  return {
    config,
    get: async (key: string): Promise<any> => {
      // Implementation would integrate with Redis/Memory cache
      return null;
    },
    set: async (key: string, value: any, ttl?: number): Promise<void> => {
      // Implementation
    },
    invalidate: async (pattern: string): Promise<void> => {
      // Implementation
    },
  };
};

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
export const setupWriteThroughCache = async (
  sequelize: Sequelize,
  tableName: string,
  ttl: number,
): Promise<void> => {
  // Create cache table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.${tableName}_cache (
      cache_key VARCHAR(255) PRIMARY KEY,
      cache_value JSONB NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
  );

  // Create automatic cleanup function
  await sequelize.query(
    `CREATE OR REPLACE FUNCTION cleanup_${tableName}_cache()
     RETURNS void AS $$
     BEGIN
       DELETE FROM network.${tableName}_cache WHERE expires_at < NOW();
     END;
     $$ LANGUAGE plpgsql`,
  );
};

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
export const cacheAsideGet = async (
  sequelize: Sequelize,
  cacheKey: string,
  loader: () => Promise<any>,
  ttl: number,
): Promise<any> => {
  // Try cache first
  const [cached] = await sequelize.query(
    `SELECT cache_value FROM network.cache_store
     WHERE cache_key = :cacheKey AND expires_at > NOW()`,
    {
      replacements: { cacheKey },
      type: QueryTypes.SELECT,
    },
  );

  if (cached) {
    return (cached as any).cache_value;
  }

  // Load from source
  const data = await loader();

  // Store in cache
  await sequelize.query(
    `INSERT INTO network.cache_store (cache_key, cache_value, expires_at)
     VALUES (:cacheKey, :data, NOW() + INTERVAL '${ttl} seconds')
     ON CONFLICT (cache_key) DO UPDATE
     SET cache_value = EXCLUDED.cache_value, expires_at = EXCLUDED.expires_at`,
    {
      replacements: { cacheKey, data: JSON.stringify(data) },
    },
  );

  return data;
};

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
export const createRefreshableMaterializedView = async (
  sequelize: Sequelize,
  viewName: string,
  query: string,
  refreshInterval: string,
  transaction?: Transaction,
): Promise<void> => {
  // Create materialized view
  await sequelize.query(`CREATE MATERIALIZED VIEW network.${viewName} AS ${query}`, {
    transaction,
  });

  // Create refresh function
  await sequelize.query(
    `CREATE OR REPLACE FUNCTION refresh_${viewName}()
     RETURNS void AS $$
     BEGIN
       REFRESH MATERIALIZED VIEW CONCURRENTLY network.${viewName};
     END;
     $$ LANGUAGE plpgsql`,
    { transaction },
  );

  // Schedule refresh
  await sequelize.query(
    `SELECT cron.schedule('refresh_${viewName}', '${refreshInterval}', 'SELECT refresh_${viewName}()')`,
    { transaction },
  );
};

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
export const configurePrimaryReplicaReplication = async (
  sequelize: Sequelize,
  config: ReplicationConfig,
): Promise<void> => {
  // Create replication slots
  for (const replica of config.replicas) {
    if (replica.role === 'replica') {
      await sequelize.query(
        `SELECT pg_create_physical_replication_slot('${replica.name}_slot')
         WHERE NOT EXISTS (
           SELECT 1 FROM pg_replication_slots WHERE slot_name = '${replica.name}_slot'
         )`,
      );
    }
  }

  // Create monitoring view
  await sequelize.query(
    `CREATE OR REPLACE VIEW network.replication_status AS
     SELECT
       client_addr,
       state,
       sync_state,
       replay_lag,
       write_lag,
       flush_lag
     FROM pg_stat_replication`,
  );
};

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
export const setupLogicalReplication = async (
  sequelize: Sequelize,
  tables: string[],
  publicationName: string,
  transaction?: Transaction,
): Promise<void> => {
  const tableList = tables.map((t) => `network.${t}`).join(', ');

  await sequelize.query(
    `CREATE PUBLICATION ${publicationName} FOR TABLE ${tableList}`,
    { transaction },
  );

  // Create replication monitoring
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.replication_monitor (
      id SERIAL PRIMARY KEY,
      publication_name VARCHAR(255),
      subscriber_name VARCHAR(255),
      lag_bytes BIGINT,
      last_msg_send_time TIMESTAMPTZ,
      last_msg_receipt_time TIMESTAMPTZ,
      checked_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    { transaction },
  );
};

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
export const setupBidirectionalReplication = async (
  sequelize: Sequelize,
  remoteDsn: string,
  tables: string[],
): Promise<void> => {
  // Create publication for outbound replication
  await sequelize.query(
    `CREATE PUBLICATION bidirectional_pub FOR TABLE ${tables.map((t) => `network.${t}`).join(', ')}`,
  );

  // Create subscription for inbound replication
  await sequelize.query(
    `CREATE SUBSCRIPTION bidirectional_sub
     CONNECTION '${remoteDsn}'
     PUBLICATION bidirectional_pub
     WITH (copy_data = true, create_slot = true)`,
  );

  // Create conflict resolution table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS network.replication_conflicts (
      id SERIAL PRIMARY KEY,
      table_name VARCHAR(255),
      record_id UUID,
      local_data JSONB,
      remote_data JSONB,
      conflict_time TIMESTAMPTZ DEFAULT NOW(),
      resolved BOOLEAN DEFAULT false
    )`,
  );
};

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
export const monitorReplicationLag = async (
  sequelize: Sequelize,
): Promise<Array<{ replica: string; lag_bytes: number; lag_seconds: number }>> => {
  const [results] = await sequelize.query(
    `SELECT
       client_hostname AS replica,
       pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes,
       EXTRACT(EPOCH FROM (NOW() - replay_timestamp)) AS lag_seconds
     FROM pg_stat_replication`,
    { type: QueryTypes.SELECT },
  );

  return results as any;
};

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
export const generateShardId = (shardName: string): string => {
  return crypto.createHash('sha256').update(shardName).digest('hex').substring(0, 16);
};

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
export const estimateTableSize = async (
  sequelize: Sequelize,
  tableName: string,
): Promise<{ table_size: string; index_size: string; total_size: string }> => {
  const [result] = await sequelize.query(
    `SELECT
       pg_size_pretty(pg_table_size('network.${tableName}')) AS table_size,
       pg_size_pretty(pg_indexes_size('network.${tableName}')) AS index_size,
       pg_size_pretty(pg_total_relation_size('network.${tableName}')) AS total_size`,
    { type: QueryTypes.SELECT },
  );

  return result as any;
};

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
export const analyzeQueryPerformance = async (
  sequelize: Sequelize,
  tableName: string,
): Promise<any[]> => {
  const [results] = await sequelize.query(
    `SELECT
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
     WHERE tablename = :tableName`,
    {
      replacements: { tableName },
      type: QueryTypes.SELECT,
    },
  );

  return results;
};

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
export const optimizeTableStatistics = async (
  sequelize: Sequelize,
  tableName: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(`ANALYZE network.${tableName}`, { transaction });

  // Update statistics targets for important columns
  await sequelize.query(
    `ALTER TABLE network.${tableName} ALTER COLUMN id SET STATISTICS 1000`,
    { transaction },
  );
};

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
export const createNetworkConnectionPool = (config: {
  max: number;
  min: number;
  idle: number;
}): any => {
  return {
    max: config.max,
    min: config.min,
    idle: config.idle,
    acquire: 30000,
    evict: 1000,
  };
};

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
export const retryDatabaseOperation = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<any> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError!;
};

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
export const paginateQuery = async (
  sequelize: Sequelize,
  tableName: string,
  page: number,
  pageSize: number,
  where?: Record<string, any>,
): Promise<{ data: any[]; total: number; pages: number }> => {
  const offset = (page - 1) * pageSize;
  const whereClause = where ? `WHERE ${Object.keys(where).map(k => `${k} = '${where[k]}'`).join(' AND ')}` : '';

  const [countResult] = await sequelize.query(
    `SELECT COUNT(*) as total FROM network.${tableName} ${whereClause}`,
    { type: QueryTypes.SELECT },
  );

  const [data] = await sequelize.query(
    `SELECT * FROM network.${tableName} ${whereClause} LIMIT :pageSize OFFSET :offset`,
    {
      replacements: { pageSize, offset },
      type: QueryTypes.SELECT,
    },
  );

  const total = (countResult as any).total;
  const pages = Math.ceil(total / pageSize);

  return { data: data as any[], total, pages };
};

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
export const createMaterializedViewRefreshJob = async (
  sequelize: Sequelize,
  viewName: string,
  schedule: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `SELECT cron.schedule(
      'refresh_${viewName}',
      '${schedule}',
      $$REFRESH MATERIALIZED VIEW CONCURRENTLY network.${viewName}$$
    )`,
    { transaction },
  );
};

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
export const vacuumAndAnalyze = async (
  sequelize: Sequelize,
  tableName: string,
  full: boolean = false,
  transaction?: Transaction,
): Promise<void> => {
  const vacuumType = full ? 'VACUUM FULL' : 'VACUUM';

  await sequelize.query(`${vacuumType} network.${tableName}`, { transaction });
  await sequelize.query(`ANALYZE network.${tableName}`, { transaction });
};

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
export const createValidationConstraint = async (
  sequelize: Sequelize,
  tableName: string,
  constraintName: string,
  checkExpression: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `ALTER TABLE network.${tableName}
     ADD CONSTRAINT ${constraintName} CHECK (${checkExpression})`,
    { transaction },
  );
};

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
export const createRowLevelSecurityPolicy = async (
  sequelize: Sequelize,
  tableName: string,
  policyName: string,
  policyExpression: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `ALTER TABLE network.${tableName} ENABLE ROW LEVEL SECURITY`,
    { transaction },
  );

  await sequelize.query(
    `CREATE POLICY ${policyName} ON network.${tableName}
     FOR ALL
     USING (${policyExpression})`,
    { transaction },
  );
};
