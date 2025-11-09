/**
 * LOC: TDLAKE1234567
 * File: /reuse/threat/threat-data-lake-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence data services
 *   - Big data analytics modules
 *   - Data retention services
 *   - Query optimization services
 *   - Threat archival services
 */
/**
 * File: /reuse/threat/threat-data-lake-kit.ts
 * Locator: WC-THREAT-DATALAKE-001
 * Purpose: Comprehensive Threat Data Lake Toolkit - Production-ready big data threat intelligence storage
 *
 * Upstream: Independent utility module for threat intelligence data lake operations
 * Downstream: ../backend/*, Data lake services, Analytics, Time-series storage, Query optimization
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 40 utility functions for data lake architecture, partitioning, sharding, retention, archival
 *
 * LLM Context: Enterprise-grade threat data lake toolkit for White Cross healthcare platform.
 * Provides comprehensive big data storage for threat intelligence, time-series data management,
 * partitioning and sharding strategies, high-volume data ingestion, retention policies, archival
 * strategies, query optimization for large datasets, data compression, deduplication, and
 * HIPAA-compliant threat data storage for healthcare systems. Includes Sequelize models for
 * data lake tables with advanced TypeScript type safety and performance optimization.
 */
import { Model } from 'sequelize-typescript';
declare const __brand: unique symbol;
type Brand<T, TBrand> = T & {
    [__brand]: TBrand;
};
export type DataLakeId = Brand<string, 'DataLakeId'>;
export type PartitionId = Brand<string, 'PartitionId'>;
export type ShardId = Brand<string, 'ShardId'>;
export type ArchiveId = Brand<string, 'ArchiveId'>;
/**
 * Data lake storage tier
 */
export declare enum StorageTier {
    HOT = "HOT",// Frequently accessed data (last 30 days)
    WARM = "WARM",// Occasionally accessed data (30-90 days)
    COLD = "COLD",// Rarely accessed data (90-365 days)
    FROZEN = "FROZEN"
}
/**
 * Partitioning strategy
 */
export declare enum PartitionStrategy {
    TIME_BASED = "TIME_BASED",// Partition by time period
    HASH_BASED = "HASH_BASED",// Partition by hash of key
    RANGE_BASED = "RANGE_BASED",// Partition by value range
    LIST_BASED = "LIST_BASED",// Partition by predefined list
    COMPOSITE = "COMPOSITE"
}
/**
 * Sharding strategy
 */
export declare enum ShardStrategy {
    CONSISTENT_HASH = "CONSISTENT_HASH",
    RANGE_SHARD = "RANGE_SHARD",
    GEOGRAPHIC = "GEOGRAPHIC",
    SEVERITY_BASED = "SEVERITY_BASED",
    SOURCE_BASED = "SOURCE_BASED"
}
/**
 * Compression algorithm
 */
export declare enum CompressionAlgorithm {
    NONE = "NONE",
    GZIP = "GZIP",
    BROTLI = "BROTLI",
    ZSTD = "ZSTD",
    LZ4 = "LZ4",
    SNAPPY = "SNAPPY"
}
/**
 * Data lake configuration
 */
export interface DataLakeConfig {
    id: DataLakeId;
    name: string;
    description?: string;
    storagePath: string;
    partitionStrategy: PartitionStrategy;
    shardStrategy?: ShardStrategy;
    compressionAlgorithm: CompressionAlgorithm;
    retentionPolicy: RetentionPolicy;
    indexingStrategy: IndexingStrategy;
    replicationFactor: number;
    encryptionEnabled: boolean;
    deduplicationEnabled: boolean;
    metadata?: Record<string, unknown>;
}
/**
 * Retention policy configuration
 */
export interface RetentionPolicy {
    id: string;
    name: string;
    hotTierDays: number;
    warmTierDays: number;
    coldTierDays: number;
    archiveAfterDays: number;
    deleteAfterDays?: number;
    compressAfterDays?: number;
    severityOverrides?: Array<{
        severity: string;
        retentionDays: number;
    }>;
}
/**
 * Indexing strategy
 */
export interface IndexingStrategy {
    primaryKeys: string[];
    secondaryIndexes: Array<{
        fields: string[];
        type: 'btree' | 'hash' | 'gin' | 'gist';
        unique?: boolean;
    }>;
    fullTextIndexes?: string[];
    spatialIndexes?: string[];
}
/**
 * Partition metadata
 */
export interface PartitionMetadata {
    id: PartitionId;
    tableName: string;
    partitionKey: string;
    partitionValue: string | number | Date;
    startRange?: string | number | Date;
    endRange?: string | number | Date;
    recordCount: number;
    sizeBytes: number;
    tier: StorageTier;
    compressionRatio?: number;
    lastAccessedAt?: Date;
    createdAt: Date;
    archivedAt?: Date;
}
/**
 * Shard metadata
 */
export interface ShardMetadata {
    id: ShardId;
    shardKey: string;
    nodeId: string;
    hostAddress: string;
    port: number;
    partitions: PartitionId[];
    recordCount: number;
    sizeBytes: number;
    status: 'active' | 'readonly' | 'draining' | 'offline';
    replicaCount: number;
    lastRebalanced?: Date;
}
/**
 * Time-series threat data point
 */
export interface ThreatTimeSeries {
    timestamp: Date;
    threatId: string;
    threatType: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    source: string;
    iocType?: string;
    iocValue?: string;
    geoLocation?: {
        country?: string;
        region?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
    };
    metadata: Record<string, unknown>;
    partitionKey?: string;
    shardKey?: string;
}
/**
 * Data ingestion batch
 */
export interface IngestionBatch {
    batchId: string;
    recordCount: number;
    sizeBytes: number;
    source: string;
    startTime: Date;
    endTime?: Date;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    errorMessage?: string;
    partitionsAffected: string[];
    metadata?: Record<string, unknown>;
}
/**
 * Query optimization hint
 */
export interface QueryOptimizationHint {
    partitionPruning: boolean;
    indexScan: boolean;
    parallelQuery: boolean;
    cachingEnabled: boolean;
    compressionAware: boolean;
    estimatedRowCount?: number;
    estimatedCostUnits?: number;
}
/**
 * Archive operation
 */
export interface ArchiveOperation {
    id: ArchiveId;
    sourcePartitions: PartitionId[];
    destinationPath: string;
    archiveFormat: 'parquet' | 'avro' | 'orc' | 'csv' | 'jsonl';
    compressionAlgorithm: CompressionAlgorithm;
    startedAt: Date;
    completedAt?: Date;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    recordCount: number;
    originalSizeBytes: number;
    compressedSizeBytes: number;
    checksumMD5?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Deduplication result
 */
export interface DeduplicationResult {
    recordsProcessed: number;
    duplicatesFound: number;
    duplicatesRemoved: number;
    spaceReclaimed: number;
    processingTimeMs: number;
    deduplicationMethod: 'hash' | 'fuzzy' | 'semantic';
}
/**
 * Data lake statistics
 */
export interface DataLakeStatistics {
    totalRecords: number;
    totalSizeBytes: number;
    partitionCount: number;
    shardCount: number;
    averageRecordsPerPartition: number;
    compressionRatio: number;
    tierDistribution: Record<StorageTier, {
        records: number;
        sizeBytes: number;
    }>;
    oldestRecord?: Date;
    newestRecord?: Date;
    ingestRatePerSecond: number;
    queryRatePerSecond: number;
}
export declare class ThreatDataLakeConfig extends Model {
    id: string;
    name: string;
    description?: string;
    storagePath: string;
    partitionStrategy: string;
    shardStrategy?: string;
    compressionAlgorithm: string;
    retentionPolicy: RetentionPolicy;
    indexingStrategy: IndexingStrategy;
    replicationFactor: number;
    encryptionEnabled: boolean;
    deduplicationEnabled: boolean;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ThreatDataPartition extends Model {
    id: string;
    tableName: string;
    partitionKey: string;
    partitionValue: string;
    startRange?: Date;
    endRange?: Date;
    recordCount: number;
    sizeBytes: number;
    tier: string;
    compressionRatio?: number;
    lastAccessedAt?: Date;
    archivedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ThreatTimeSeriesData extends Model {
    id: string;
    timestamp: Date;
    threatId: string;
    threatType: string;
    severity: string;
    source: string;
    iocType?: string;
    iocValue?: string;
    geoLocation?: Record<string, unknown>;
    metadata: Record<string, unknown>;
    partitionKey?: string;
    shardKey?: string;
}
export declare class ThreatArchiveOperation extends Model {
    id: string;
    sourcePartitions: string[];
    destinationPath: string;
    archiveFormat: string;
    compressionAlgorithm: string;
    startedAt: Date;
    completedAt?: Date;
    status: string;
    recordCount: number;
    originalSizeBytes: number;
    compressedSizeBytes: number;
    checksumMD5?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates a new data lake configuration with optimized settings.
 *
 * @param {Partial<DataLakeConfig>} config - Data lake configuration
 * @returns {DataLakeConfig} Complete data lake configuration
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const dataLake = createDataLakeConfig({
 *   name: 'Threat Intelligence Lake',
 *   storagePath: '/data/threat-lake',
 *   partitionStrategy: PartitionStrategy.TIME_BASED,
 *   compressionAlgorithm: CompressionAlgorithm.ZSTD
 * });
 * ```
 */
export declare const createDataLakeConfig: (config: Partial<DataLakeConfig>) => DataLakeConfig;
/**
 * Validates a data lake configuration for correctness and best practices.
 *
 * @param {DataLakeConfig} config - Data lake configuration to validate
 * @returns {{ valid: boolean; errors: string[]; warnings: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDataLakeConfig(config);
 * if (!validation.valid) {
 *   console.error('Invalid configuration:', validation.errors);
 * }
 * ```
 */
export declare const validateDataLakeConfig: (config: DataLakeConfig) => {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Generates optimal partition key based on data characteristics.
 *
 * @param {ThreatTimeSeries[]} sampleData - Sample data for analysis
 * @param {PartitionStrategy} strategy - Partitioning strategy
 * @returns {{ partitionKey: string; cardinality: number; distribution: Record<string, number> }} Partition key recommendation
 *
 * @example
 * ```typescript
 * const recommendation = generatePartitionKey(sampleData, PartitionStrategy.TIME_BASED);
 * console.log('Use partition key:', recommendation.partitionKey);
 * ```
 */
export declare const generatePartitionKey: (sampleData: ThreatTimeSeries[], strategy: PartitionStrategy) => {
    partitionKey: string;
    cardinality: number;
    distribution: Record<string, number>;
};
/**
 * Calculates optimal shard count based on data volume and performance requirements.
 *
 * @param {number} totalRecords - Total number of records
 * @param {number} averageRecordSizeBytes - Average record size in bytes
 * @param {number} targetShardSizeGB - Target shard size in GB
 * @returns {{ shardCount: number; recordsPerShard: number; shardSizeGB: number }} Shard recommendation
 *
 * @example
 * ```typescript
 * const sharding = calculateOptimalShardCount(10000000, 1024, 50);
 * console.log(`Use ${sharding.shardCount} shards`);
 * ```
 */
export declare const calculateOptimalShardCount: (totalRecords: number, averageRecordSizeBytes: number, targetShardSizeGB?: number) => {
    shardCount: number;
    recordsPerShard: number;
    shardSizeGB: number;
};
/**
 * Ingests time-series threat data with automatic partitioning.
 *
 * @param {ThreatTimeSeries[]} data - Time-series data to ingest
 * @param {DataLakeConfig} config - Data lake configuration
 * @returns {IngestionBatch} Ingestion batch metadata
 *
 * @example
 * ```typescript
 * const batch = ingestTimeSeriesData(threatData, dataLakeConfig);
 * console.log(`Ingested ${batch.recordCount} records`);
 * ```
 */
export declare const ingestTimeSeriesData: (data: ThreatTimeSeries[], config: DataLakeConfig) => IngestionBatch;
/**
 * Determines the appropriate partition for a data record.
 *
 * @param {ThreatTimeSeries} record - Data record
 * @param {PartitionStrategy} strategy - Partitioning strategy
 * @returns {string} Partition key
 *
 * @example
 * ```typescript
 * const partition = determinePartition(record, PartitionStrategy.TIME_BASED);
 * console.log('Partition:', partition);
 * ```
 */
export declare const determinePartition: (record: ThreatTimeSeries, strategy: PartitionStrategy) => string;
/**
 * Queries time-series data with optimized partition pruning.
 *
 * @param {Date} startDate - Start date for query
 * @param {Date} endDate - End date for query
 * @param {Partial<ThreatTimeSeries>} filters - Additional filters
 * @param {QueryOptimizationHint} hints - Query optimization hints
 * @returns {{ partitions: string[]; estimatedRecords: number; queryPlan: string }} Query plan
 *
 * @example
 * ```typescript
 * const queryPlan = queryTimeSeriesData(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   { severity: 'high' },
 *   { partitionPruning: true }
 * );
 * ```
 */
export declare const queryTimeSeriesData: (startDate: Date, endDate: Date, filters?: Partial<ThreatTimeSeries>, hints?: QueryOptimizationHint) => {
    partitions: string[];
    estimatedRecords: number;
    queryPlan: string;
};
/**
 * Aggregates time-series data with time bucketing.
 *
 * @param {ThreatTimeSeries[]} data - Time-series data
 * @param {'hour' | 'day' | 'week' | 'month'} bucketSize - Time bucket size
 * @returns {Array<{ timestamp: Date; count: number; severityCounts: Record<string, number> }>} Aggregated data
 *
 * @example
 * ```typescript
 * const aggregated = aggregateTimeSeriesData(data, 'day');
 * console.log(`${aggregated.length} buckets created`);
 * ```
 */
export declare const aggregateTimeSeriesData: (data: ThreatTimeSeries[], bucketSize: "hour" | "day" | "week" | "month") => Array<{
    timestamp: Date;
    count: number;
    severityCounts: Record<string, number>;
}>;
/**
 * Creates a new partition for data organization.
 *
 * @param {string} tableName - Table name
 * @param {string} partitionKey - Partition key
 * @param {string | number | Date} partitionValue - Partition value
 * @param {StorageTier} tier - Storage tier
 * @returns {PartitionMetadata} Partition metadata
 *
 * @example
 * ```typescript
 * const partition = createPartition('threat_timeseries', 'month', '2024-01', StorageTier.HOT);
 * ```
 */
export declare const createPartition: (tableName: string, partitionKey: string, partitionValue: string | number | Date, tier?: StorageTier) => PartitionMetadata;
/**
 * Merges small partitions to optimize storage and query performance.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to merge
 * @param {number} minSizeBytes - Minimum partition size threshold
 * @returns {{ mergedPartitions: PartitionMetadata[]; spaceSaved: number }} Merge result
 *
 * @example
 * ```typescript
 * const result = mergePartitions(smallPartitions, 10 * 1024 * 1024);
 * console.log(`Space saved: ${result.spaceSaved} bytes`);
 * ```
 */
export declare const mergePartitions: (partitions: PartitionMetadata[], minSizeBytes: number) => {
    mergedPartitions: PartitionMetadata[];
    spaceSaved: number;
};
/**
 * Splits a large partition for better distribution.
 *
 * @param {PartitionMetadata} partition - Partition to split
 * @param {number} targetCount - Target number of partitions
 * @returns {PartitionMetadata[]} Split partitions
 *
 * @example
 * ```typescript
 * const splitPartitions = splitPartition(largePartition, 4);
 * console.log(`Split into ${splitPartitions.length} partitions`);
 * ```
 */
export declare const splitPartition: (partition: PartitionMetadata, targetCount: number) => PartitionMetadata[];
/**
 * Rebalances shards across nodes for optimal distribution.
 *
 * @param {ShardMetadata[]} shards - Current shard distribution
 * @param {number} targetNodesCount - Target number of nodes
 * @returns {{ rebalancePlan: Array<{ shardId: string; fromNode: string; toNode: string }>; estimatedDataTransferGB: number }} Rebalance plan
 *
 * @example
 * ```typescript
 * const plan = rebalanceShards(currentShards, 8);
 * console.log(`Will transfer ${plan.estimatedDataTransferGB}GB of data`);
 * ```
 */
export declare const rebalanceShards: (shards: ShardMetadata[], targetNodesCount: number) => {
    rebalancePlan: Array<{
        shardId: string;
        fromNode: string;
        toNode: string;
    }>;
    estimatedDataTransferGB: number;
};
/**
 * Applies retention policy to partitions and moves data between tiers.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to evaluate
 * @param {RetentionPolicy} policy - Retention policy
 * @returns {{ tierChanges: Array<{ partition: PartitionId; oldTier: StorageTier; newTier: StorageTier }>; deletions: PartitionId[] }} Retention actions
 *
 * @example
 * ```typescript
 * const actions = applyRetentionPolicy(allPartitions, retentionPolicy);
 * console.log(`${actions.tierChanges.length} tier changes, ${actions.deletions.length} deletions`);
 * ```
 */
export declare const applyRetentionPolicy: (partitions: PartitionMetadata[], policy: RetentionPolicy) => {
    tierChanges: Array<{
        partition: PartitionId;
        oldTier: StorageTier;
        newTier: StorageTier;
    }>;
    deletions: PartitionId[];
};
/**
 * Archives partitions to long-term storage.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to archive
 * @param {string} destinationPath - Archive destination path
 * @param {'parquet' | 'avro' | 'orc' | 'csv' | 'jsonl'} format - Archive format
 * @param {CompressionAlgorithm} compression - Compression algorithm
 * @returns {ArchiveOperation} Archive operation metadata
 *
 * @example
 * ```typescript
 * const archiveOp = archivePartitions(
 *   oldPartitions,
 *   '/archive/2023',
 *   'parquet',
 *   CompressionAlgorithm.ZSTD
 * );
 * ```
 */
export declare const archivePartitions: (partitions: PartitionMetadata[], destinationPath: string, format: "parquet" | "avro" | "orc" | "csv" | "jsonl", compression: CompressionAlgorithm) => ArchiveOperation;
/**
 * Restores archived data back to active storage.
 *
 * @param {ArchiveOperation} archiveOp - Archive operation to restore
 * @param {StorageTier} targetTier - Target storage tier
 * @returns {{ partitions: PartitionMetadata[]; estimatedRestoreTime: number }} Restore plan
 *
 * @example
 * ```typescript
 * const restore = restoreArchivedData(archiveOperation, StorageTier.COLD);
 * console.log(`Restore will take approximately ${restore.estimatedRestoreTime}ms`);
 * ```
 */
export declare const restoreArchivedData: (archiveOp: ArchiveOperation, targetTier: StorageTier) => {
    partitions: PartitionMetadata[];
    estimatedRestoreTime: number;
};
/**
 * Estimates storage costs across different tiers.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to analyze
 * @param {Record<StorageTier, number>} costPerGBPerMonth - Cost per GB per month by tier
 * @returns {{ totalCost: number; costByTier: Record<StorageTier, number>; optimizationSuggestions: string[] }} Cost analysis
 *
 * @example
 * ```typescript
 * const costs = estimateStorageCosts(partitions, {
 *   [StorageTier.HOT]: 0.023,
 *   [StorageTier.WARM]: 0.0125,
 *   [StorageTier.COLD]: 0.004,
 *   [StorageTier.FROZEN]: 0.001
 * });
 * ```
 */
export declare const estimateStorageCosts: (partitions: PartitionMetadata[], costPerGBPerMonth: Record<StorageTier, number>) => {
    totalCost: number;
    costByTier: Record<StorageTier, number>;
    optimizationSuggestions: string[];
};
/**
 * Generates an optimized query plan for large datasets.
 *
 * @param {Date} startDate - Query start date
 * @param {Date} endDate - Query end date
 * @param {string[]} filters - Query filters
 * @param {PartitionMetadata[]} availablePartitions - Available partitions
 * @returns {{ selectedPartitions: PartitionId[]; estimatedCost: number; parallelism: number; cachingStrategy: string }} Query plan
 *
 * @example
 * ```typescript
 * const plan = generateOptimizedQueryPlan(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   ['severity = high'],
 *   allPartitions
 * );
 * ```
 */
export declare const generateOptimizedQueryPlan: (startDate: Date, endDate: Date, filters: string[], availablePartitions: PartitionMetadata[]) => {
    selectedPartitions: PartitionId[];
    estimatedCost: number;
    parallelism: number;
    cachingStrategy: string;
};
/**
 * Analyzes query performance and suggests optimizations.
 *
 * @param {number} executionTimeMs - Query execution time in milliseconds
 * @param {number} recordsScanned - Number of records scanned
 * @param {number} recordsReturned - Number of records returned
 * @param {boolean} indexUsed - Whether index was used
 * @returns {{ efficiency: number; suggestions: string[]; indexRecommendations: string[] }} Performance analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeQueryPerformance(5000, 1000000, 500, false);
 * console.log('Efficiency:', analysis.efficiency);
 * console.log('Suggestions:', analysis.suggestions);
 * ```
 */
export declare const analyzeQueryPerformance: (executionTimeMs: number, recordsScanned: number, recordsReturned: number, indexUsed: boolean) => {
    efficiency: number;
    suggestions: string[];
    indexRecommendations: string[];
};
/**
 * Creates a materialized view for frequently accessed query patterns.
 *
 * @param {string} viewName - Materialized view name
 * @param {string} query - Source query
 * @param {'hour' | 'day' | 'week'} refreshInterval - Refresh interval
 * @returns {{ viewName: string; estimatedSize: number; refreshSchedule: string }} Materialized view definition
 *
 * @example
 * ```typescript
 * const view = createMaterializedView(
 *   'daily_threat_summary',
 *   'SELECT date, severity, COUNT(*) FROM threat_timeseries GROUP BY date, severity',
 *   'day'
 * );
 * ```
 */
export declare const createMaterializedView: (viewName: string, query: string, refreshInterval: "hour" | "day" | "week") => {
    viewName: string;
    estimatedSize: number;
    refreshSchedule: string;
};
/**
 * Applies compression to a partition.
 *
 * @param {PartitionMetadata} partition - Partition to compress
 * @param {CompressionAlgorithm} algorithm - Compression algorithm
 * @returns {{ originalSize: number; compressedSize: number; compressionRatio: number; estimatedTime: number }} Compression result
 *
 * @example
 * ```typescript
 * const result = compressPartition(partition, CompressionAlgorithm.ZSTD);
 * console.log(`Compression ratio: ${result.compressionRatio}`);
 * ```
 */
export declare const compressPartition: (partition: PartitionMetadata, algorithm: CompressionAlgorithm) => {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    estimatedTime: number;
};
/**
 * Decompresses a partition.
 *
 * @param {PartitionMetadata} partition - Partition to decompress
 * @param {CompressionAlgorithm} algorithm - Compression algorithm used
 * @returns {{ compressedSize: number; decompressedSize: number; estimatedTime: number }} Decompression result
 *
 * @example
 * ```typescript
 * const result = decompressPartition(compressedPartition, CompressionAlgorithm.ZSTD);
 * console.log(`Decompression will take ${result.estimatedTime}ms`);
 * ```
 */
export declare const decompressPartition: (partition: PartitionMetadata, algorithm: CompressionAlgorithm) => {
    compressedSize: number;
    decompressedSize: number;
    estimatedTime: number;
};
/**
 * Performs deduplication on threat data.
 *
 * @param {ThreatTimeSeries[]} data - Data to deduplicate
 * @param {'hash' | 'fuzzy' | 'semantic'} method - Deduplication method
 * @returns {DeduplicationResult} Deduplication result
 *
 * @example
 * ```typescript
 * const result = deduplicateData(threatData, 'hash');
 * console.log(`Removed ${result.duplicatesRemoved} duplicates`);
 * ```
 */
export declare const deduplicateData: (data: ThreatTimeSeries[], method: "hash" | "fuzzy" | "semantic") => DeduplicationResult;
/**
 * Identifies duplicate partitions across shards.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to analyze
 * @returns {Array<{ original: PartitionId; duplicates: PartitionId[] }>} Duplicate groups
 *
 * @example
 * ```typescript
 * const duplicates = identifyDuplicatePartitions(allPartitions);
 * console.log(`Found ${duplicates.length} groups of duplicates`);
 * ```
 */
export declare const identifyDuplicatePartitions: (partitions: PartitionMetadata[]) => Array<{
    original: PartitionId;
    duplicates: PartitionId[];
}>;
/**
 * Calculates comprehensive statistics for the data lake.
 *
 * @param {PartitionMetadata[]} partitions - All partitions
 * @param {number} ingestRatePerSecond - Current ingestion rate
 * @param {number} queryRatePerSecond - Current query rate
 * @returns {DataLakeStatistics} Data lake statistics
 *
 * @example
 * ```typescript
 * const stats = calculateDataLakeStatistics(allPartitions, 1000, 50);
 * console.log(`Total records: ${stats.totalRecords}`);
 * ```
 */
export declare const calculateDataLakeStatistics: (partitions: PartitionMetadata[], ingestRatePerSecond: number, queryRatePerSecond: number) => DataLakeStatistics;
/**
 * Monitors data lake health and performance.
 *
 * @param {DataLakeStatistics} stats - Current statistics
 * @param {DataLakeConfig} config - Data lake configuration
 * @returns {{ health: 'healthy' | 'warning' | 'critical'; issues: string[]; recommendations: string[] }} Health report
 *
 * @example
 * ```typescript
 * const health = monitorDataLakeHealth(currentStats, dataLakeConfig);
 * console.log(`Data lake health: ${health.health}`);
 * ```
 */
export declare const monitorDataLakeHealth: (stats: DataLakeStatistics, config: DataLakeConfig) => {
    health: "healthy" | "warning" | "critical";
    issues: string[];
    recommendations: string[];
};
/**
 * Generates a data lake optimization report.
 *
 * @param {DataLakeStatistics} stats - Current statistics
 * @param {PartitionMetadata[]} partitions - All partitions
 * @param {RetentionPolicy} retentionPolicy - Retention policy
 * @returns {{ estimatedSavings: number; optimizationActions: string[]; priorityLevel: 'high' | 'medium' | 'low' }} Optimization report
 *
 * @example
 * ```typescript
 * const report = generateOptimizationReport(stats, partitions, policy);
 * console.log(`Estimated savings: $${report.estimatedSavings}/month`);
 * ```
 */
export declare const generateOptimizationReport: (stats: DataLakeStatistics, partitions: PartitionMetadata[], retentionPolicy: RetentionPolicy) => {
    estimatedSavings: number;
    optimizationActions: string[];
    priorityLevel: "high" | "medium" | "low";
};
/**
 * Formats bytes to human-readable string.
 *
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted string
 */
export declare const formatBytes: (bytes: number) => string;
/**
 * Formats duration to human-readable string.
 *
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted string
 */
export declare const formatDuration: (ms: number) => string;
export {};
//# sourceMappingURL=threat-data-lake-kit.d.ts.map