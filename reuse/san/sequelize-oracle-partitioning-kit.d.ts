/**
 * LOC: P1A2R3T4I5T6
 * File: /reuse/san/sequelize-oracle-partitioning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *   - moment (v2.x)
 *
 * DOWNSTREAM (imported by):
 *   - Data warehouse models
 *   - Large-scale healthcare analytics
 *   - Time-series data models
 *   - High-volume transaction tables
 */
/**
 * File: /reuse/san/sequelize-oracle-partitioning-kit.ts
 * Locator: WC-UTL-SEQ-PART-001
 * Purpose: Oracle Database Partitioning Kit - Enterprise table partitioning strategies and management
 *
 * Upstream: sequelize v6.x, moment, @types/node
 * Downstream: Data warehouse models, analytics tables, time-series models, high-volume transactional systems
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, Oracle Database 12c+
 * Exports: 42 partitioning utilities for range/hash/list strategies, partition management, pruning optimization, statistics, and maintenance
 *
 * LLM Context: Production-grade Oracle Database partitioning toolkit for White Cross healthcare platform.
 * Provides advanced table partitioning strategies (range, hash, list, composite), partition pruning optimization,
 * dynamic partition creation, partition-wise joins, partition maintenance operations, and statistics management.
 * HIPAA-compliant with healthcare-specific partitioning patterns for medical records, audit logs, and time-series data.
 * Optimized for Oracle Database 12c+ with support for interval partitioning, reference partitioning, and virtual columns.
 */
import { QueryInterface, Transaction } from 'sequelize';
/**
 * Partition type enumeration
 */
export declare enum PartitionType {
    RANGE = "RANGE",
    HASH = "HASH",
    LIST = "LIST",
    COMPOSITE = "COMPOSITE",
    INTERVAL = "INTERVAL",
    REFERENCE = "REFERENCE",
    SYSTEM = "SYSTEM"
}
/**
 * Partition strategy configuration
 */
export interface PartitionStrategy {
    type: PartitionType;
    column: string | string[];
    subpartitionType?: PartitionType;
    subpartitionColumn?: string | string[];
    enableRowMovement?: boolean;
    compressionEnabled?: boolean;
    indexing?: 'LOCAL' | 'GLOBAL';
}
/**
 * Range partition definition
 */
export interface RangePartition {
    name: string;
    lessThan: string | number | Date;
    tablespace?: string;
    compress?: boolean;
    lobStorage?: string;
    subpartitions?: Subpartition[];
}
/**
 * Hash partition definition
 */
export interface HashPartition {
    name: string;
    tablespace?: string;
    compress?: boolean;
}
/**
 * List partition definition
 */
export interface ListPartition {
    name: string;
    values: (string | number)[];
    tablespace?: string;
    compress?: boolean;
    subpartitions?: Subpartition[];
}
/**
 * Subpartition definition
 */
export interface Subpartition {
    name: string;
    type: 'HASH' | 'LIST' | 'RANGE';
    value?: any;
    tablespace?: string;
}
/**
 * Partition metadata information
 */
export interface PartitionMetadata {
    tableName: string;
    partitionName: string;
    partitionPosition: number;
    subpartitionCount: number;
    highValue: string;
    highValueLength: number;
    partitionPosition: number;
    tablespace: string;
    compressed: boolean;
    numRows: number;
    blocks: number;
    avgRowLen: number;
    lastAnalyzed: Date;
}
/**
 * Partition statistics
 */
export interface PartitionStatistics {
    partitionName: string;
    numRows: number;
    blocks: number;
    emptyBlocks: number;
    avgSpaceFreelist: number;
    chainCnt: number;
    avgRowLen: number;
    sampleSize: number;
    lastAnalyzed: Date;
}
/**
 * Partition pruning analysis result
 */
export interface PartitionPruningAnalysis {
    query: string;
    partitionsAccessed: string[];
    partitionsPruned: string[];
    pruningEfficiency: number;
    estimatedCostReduction: number;
    recommendations: string[];
}
/**
 * Partition maintenance operation
 */
export interface PartitionMaintenanceOperation {
    operation: 'ADD' | 'DROP' | 'TRUNCATE' | 'MERGE' | 'SPLIT' | 'EXCHANGE' | 'MOVE' | 'RENAME';
    partitionName: string;
    newPartitionName?: string;
    values?: any;
    tablespace?: string;
    updateIndexes?: boolean;
}
/**
 * Interval partition configuration
 */
export interface IntervalPartitionConfig {
    column: string;
    interval: string;
    intervalValue?: number;
    intervalUnit?: 'DAY' | 'MONTH' | 'YEAR';
    storeIn?: string[];
}
/**
 * Partition key analysis result
 */
export interface PartitionKeyAnalysis {
    column: string;
    cardinality: number;
    distinctValues: number;
    nullCount: number;
    distribution: 'UNIFORM' | 'SKEWED' | 'HIGHLY_SKEWED';
    recommendedStrategy: PartitionType;
    estimatedPartitions: number;
    rationale: string[];
}
/**
 * Composite partition configuration
 */
export interface CompositePartitionConfig {
    primaryType: PartitionType;
    primaryColumn: string;
    secondaryType: PartitionType;
    secondaryColumn: string;
    partitions: any[];
}
/**
 * Partition exchange configuration
 */
export interface PartitionExchangeConfig {
    partitionName: string;
    tableToExchange: string;
    validateRows?: boolean;
    updateIndexes?: boolean;
    updateGlobalIndexes?: boolean;
}
/**
 * Creates a range-partitioned table strategy.
 * Partitions data based on value ranges (ideal for dates, numeric ranges).
 *
 * @param {string} tableName - Table name
 * @param {string} partitionColumn - Column to partition on
 * @param {RangePartition[]} partitions - Partition definitions
 * @param {Partial<PartitionStrategy>} options - Additional options
 * @returns {string} DDL statement for creating range-partitioned table
 *
 * @example
 * ```typescript
 * const ddl = createRangePartitionStrategy('medical_records', 'record_date', [
 *   { name: 'p_2023', lessThan: '2024-01-01', tablespace: 'TS_2023' },
 *   { name: 'p_2024', lessThan: '2025-01-01', tablespace: 'TS_2024' }
 * ], { enableRowMovement: true, compressionEnabled: true });
 * ```
 */
export declare function createRangePartitionStrategy(tableName: string, partitionColumn: string, partitions: RangePartition[], options?: Partial<PartitionStrategy>): string;
/**
 * Creates a hash-partitioned table strategy.
 * Distributes data evenly across partitions using hash function.
 *
 * @param {string} tableName - Table name
 * @param {string} partitionColumn - Column to partition on
 * @param {number} partitionCount - Number of hash partitions
 * @param {HashPartition[]} partitions - Optional partition definitions
 * @param {Partial<PartitionStrategy>} options - Additional options
 * @returns {string} DDL statement for creating hash-partitioned table
 *
 * @example
 * ```typescript
 * const ddl = createHashPartitionStrategy('patients', 'patient_id', 8, [
 *   { name: 'p_hash_0', tablespace: 'TS_HASH_0' },
 *   { name: 'p_hash_1', tablespace: 'TS_HASH_1' }
 * ]);
 * ```
 */
export declare function createHashPartitionStrategy(tableName: string, partitionColumn: string, partitionCount: number, partitions?: HashPartition[], options?: Partial<PartitionStrategy>): string;
/**
 * Creates a list-partitioned table strategy.
 * Partitions data based on discrete value lists (ideal for categories, regions).
 *
 * @param {string} tableName - Table name
 * @param {string} partitionColumn - Column to partition on
 * @param {ListPartition[]} partitions - Partition definitions with value lists
 * @param {Partial<PartitionStrategy>} options - Additional options
 * @returns {string} DDL statement for creating list-partitioned table
 *
 * @example
 * ```typescript
 * const ddl = createListPartitionStrategy('appointments', 'department', [
 *   { name: 'p_cardiology', values: ['CARDIO', 'CARDIAC'] },
 *   { name: 'p_neurology', values: ['NEURO', 'BRAIN'] },
 *   { name: 'p_default', values: ['DEFAULT'] }
 * ]);
 * ```
 */
export declare function createListPartitionStrategy(tableName: string, partitionColumn: string, partitions: ListPartition[], options?: Partial<PartitionStrategy>): string;
/**
 * Creates a composite (range-hash) partitioned table strategy.
 * Combines range partitioning with hash subpartitioning for optimal distribution.
 *
 * @param {CompositePartitionConfig} config - Composite partition configuration
 * @param {Partial<PartitionStrategy>} options - Additional options
 * @returns {string} DDL statement for creating composite-partitioned table
 *
 * @example
 * ```typescript
 * const ddl = createCompositePartitionStrategy({
 *   primaryType: PartitionType.RANGE,
 *   primaryColumn: 'created_at',
 *   secondaryType: PartitionType.HASH,
 *   secondaryColumn: 'patient_id',
 *   partitions: [
 *     { name: 'p_2024_q1', lessThan: '2024-04-01', subpartitionCount: 4 }
 *   ]
 * });
 * ```
 */
export declare function createCompositePartitionStrategy(config: CompositePartitionConfig, options?: Partial<PartitionStrategy>): string;
/**
 * Creates an interval-partitioned table strategy.
 * Automatically creates partitions based on defined intervals (Oracle 11g+).
 *
 * @param {string} tableName - Table name
 * @param {IntervalPartitionConfig} config - Interval partition configuration
 * @param {RangePartition[]} initialPartitions - Initial partitions before interval starts
 * @param {Partial<PartitionStrategy>} options - Additional options
 * @returns {string} DDL statement for creating interval-partitioned table
 *
 * @example
 * ```typescript
 * const ddl = createIntervalPartitionStrategy('audit_logs', {
 *   column: 'log_date',
 *   interval: 'NUMTOYMINTERVAL(1, \'MONTH\')',
 *   storeIn: ['TS_AUDIT_1', 'TS_AUDIT_2']
 * }, [
 *   { name: 'p_initial', lessThan: '2024-01-01' }
 * ]);
 * ```
 */
export declare function createIntervalPartitionStrategy(tableName: string, config: IntervalPartitionConfig, initialPartitions: RangePartition[], options?: Partial<PartitionStrategy>): string;
/**
 * Adds a new partition to an existing partitioned table.
 * Supports range, list, and composite partitioned tables.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionName - New partition name
 * @param {any} values - Partition values (range or list)
 * @param {object} options - Additional options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addPartition(queryInterface, 'medical_records', 'p_2025', {
 *   lessThan: '2026-01-01',
 *   tablespace: 'TS_2025'
 * });
 * ```
 */
export declare function addPartition(queryInterface: QueryInterface, tableName: string, partitionName: string, values: any, options?: {
    tablespace?: string;
    compress?: boolean;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Drops a partition from a partitioned table.
 * Can optionally update global indexes.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionName - Partition name to drop
 * @param {object} options - Drop options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropPartition(queryInterface, 'audit_logs', 'p_2020', {
 *   updateIndexes: true
 * });
 * ```
 */
export declare function dropPartition(queryInterface: QueryInterface, tableName: string, partitionName: string, options?: {
    updateIndexes?: boolean;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Truncates a partition, removing all data but keeping structure.
 * Faster than DELETE for clearing partition data.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionName - Partition name to truncate
 * @param {object} options - Truncate options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await truncatePartition(queryInterface, 'temp_calculations', 'p_scratch', {
 *   updateIndexes: true
 * });
 * ```
 */
export declare function truncatePartition(queryInterface: QueryInterface, tableName: string, partitionName: string, options?: {
    updateIndexes?: boolean;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Merges two adjacent partitions into a single partition.
 * Useful for consolidating historical data.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partition1 - First partition name
 * @param {string} partition2 - Second partition name
 * @param {string} newPartitionName - Merged partition name
 * @param {object} options - Merge options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await mergePartitions(queryInterface, 'medical_records',
 *   'p_2020_q1', 'p_2020_q2', 'p_2020_h1', { updateIndexes: true }
 * );
 * ```
 */
export declare function mergePartitions(queryInterface: QueryInterface, tableName: string, partition1: string, partition2: string, newPartitionName: string, options?: {
    tablespace?: string;
    updateIndexes?: boolean;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Splits a partition into multiple partitions.
 * Useful for dividing large partitions or changing partition strategy.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionName - Partition to split
 * @param {any[]} newPartitions - New partition definitions
 * @param {object} options - Split options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await splitPartition(queryInterface, 'appointments', 'p_2024', [
 *   { name: 'p_2024_h1', lessThan: '2024-07-01' },
 *   { name: 'p_2024_h2', lessThan: '2025-01-01' }
 * ], { updateIndexes: true });
 * ```
 */
export declare function splitPartition(queryInterface: QueryInterface, tableName: string, partitionName: string, newPartitions: any[], options?: {
    updateIndexes?: boolean;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Exchanges partition data with a non-partitioned table.
 * Allows fast data loading and archiving.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Partitioned table name
 * @param {PartitionExchangeConfig} config - Exchange configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await exchangePartition(queryInterface, 'medical_records', {
 *   partitionName: 'p_archive',
 *   tableToExchange: 'medical_records_staging',
 *   validateRows: true,
 *   updateGlobalIndexes: true
 * });
 * ```
 */
export declare function exchangePartition(queryInterface: QueryInterface, tableName: string, config: PartitionExchangeConfig): Promise<void>;
/**
 * Moves a partition to a different tablespace.
 * Useful for storage management and optimization.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionName - Partition to move
 * @param {string} targetTablespace - Target tablespace
 * @param {object} options - Move options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await movePartition(queryInterface, 'audit_logs', 'p_2020',
 *   'TS_ARCHIVE', { compress: true, updateIndexes: true }
 * );
 * ```
 */
export declare function movePartition(queryInterface: QueryInterface, tableName: string, partitionName: string, targetTablespace: string, options?: {
    compress?: boolean;
    updateIndexes?: boolean;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Renames a partition.
 * Updates partition name while preserving data and structure.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} oldPartitionName - Current partition name
 * @param {string} newPartitionName - New partition name
 * @param {object} options - Rename options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await renamePartition(queryInterface, 'medical_records',
 *   'p_temp', 'p_2024_archive'
 * );
 * ```
 */
export declare function renamePartition(queryInterface: QueryInterface, tableName: string, oldPartitionName: string, newPartitionName: string, options?: {
    transaction?: Transaction;
}): Promise<void>;
/**
 * Retrieves partition metadata for a table.
 * Returns comprehensive partition information.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {object} options - Query options
 * @returns {Promise<PartitionMetadata[]>} Partition metadata array
 *
 * @example
 * ```typescript
 * const metadata = await getPartitionMetadata(queryInterface, 'MEDICAL_RECORDS');
 * metadata.forEach(p => console.log(p.partitionName, p.numRows));
 * ```
 */
export declare function getPartitionMetadata(queryInterface: QueryInterface, tableName: string, options?: {
    owner?: string;
    transaction?: Transaction;
}): Promise<PartitionMetadata[]>;
/**
 * Gathers partition statistics for query optimization.
 * Essential for partition pruning and cost-based optimization.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionName - Partition name (or ALL for all partitions)
 * @param {object} options - Statistics options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await gatherPartitionStatistics(queryInterface, 'medical_records', 'p_2024', {
 *   estimatePercent: 10,
 *   cascade: true
 * });
 * ```
 */
export declare function gatherPartitionStatistics(queryInterface: QueryInterface, tableName: string, partitionName: string, options?: {
    estimatePercent?: number;
    cascade?: boolean;
    degree?: number;
    granularity?: 'ALL' | 'AUTO' | 'PARTITION' | 'SUBPARTITION';
    transaction?: Transaction;
}): Promise<void>;
/**
 * Retrieves detailed partition statistics.
 * Returns row counts, block usage, and analysis information.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionName - Partition name (optional)
 * @param {object} options - Query options
 * @returns {Promise<PartitionStatistics[]>} Partition statistics array
 *
 * @example
 * ```typescript
 * const stats = await getPartitionStatistics(queryInterface, 'AUDIT_LOGS');
 * const totalRows = stats.reduce((sum, s) => sum + s.numRows, 0);
 * ```
 */
export declare function getPartitionStatistics(queryInterface: QueryInterface, tableName: string, partitionName?: string, options?: {
    owner?: string;
    transaction?: Transaction;
}): Promise<PartitionStatistics[]>;
/**
 * Analyzes partition key distribution and cardinality.
 * Helps determine optimal partitioning strategy.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Potential partition key column
 * @param {object} options - Analysis options
 * @returns {Promise<PartitionKeyAnalysis>} Partition key analysis result
 *
 * @example
 * ```typescript
 * const analysis = await analyzePartitionKey(queryInterface,
 *   'appointments', 'scheduled_date'
 * );
 * console.log(`Recommended: ${analysis.recommendedStrategy}`);
 * ```
 */
export declare function analyzePartitionKey(queryInterface: QueryInterface, tableName: string, columnName: string, options?: {
    sampleSize?: number;
    transaction?: Transaction;
}): Promise<PartitionKeyAnalysis>;
/**
 * Analyzes partition pruning for a query.
 * Shows which partitions are accessed vs. pruned.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} query - SQL query to analyze
 * @param {object} options - Analysis options
 * @returns {Promise<PartitionPruningAnalysis>} Pruning analysis result
 *
 * @example
 * ```typescript
 * const analysis = await analyzePartitionPruning(queryInterface,
 *   `SELECT * FROM medical_records WHERE record_date >= '2024-01-01'`
 * );
 * console.log(`Pruned ${analysis.partitionsPruned.length} partitions`);
 * ```
 */
export declare function analyzePartitionPruning(queryInterface: QueryInterface, query: string, options?: {
    transaction?: Transaction;
}): Promise<PartitionPruningAnalysis>;
/**
 * Enables partition-wise join optimization.
 * Improves join performance between partitioned tables.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {boolean} enable - Enable or disable partition-wise joins
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enablePartitionWiseJoins(queryInterface, true);
 * ```
 */
export declare function enablePartitionWiseJoins(queryInterface: QueryInterface, enable?: boolean): Promise<void>;
/**
 * Optimizes partition pruning by analyzing predicates.
 * Suggests query modifications for better pruning.
 *
 * @param {string} query - SQL query to optimize
 * @param {string} partitionColumn - Partition column name
 * @returns {object} Optimization suggestions
 *
 * @example
 * ```typescript
 * const suggestions = optimizePartitionPruning(
 *   'SELECT * FROM logs WHERE MONTH(log_date) = 1',
 *   'log_date'
 * );
 * ```
 */
export declare function optimizePartitionPruning(query: string, partitionColumn: string): {
    optimizedQuery: string;
    suggestions: string[];
};
/**
 * Validates partition pruning efficiency for a table.
 * Checks if queries are effectively using partition elimination.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string[]} sampleQueries - Sample queries to validate
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validatePartitionPruning(queryInterface,
 *   'medical_records', [
 *     'SELECT * FROM medical_records WHERE record_date >= SYSDATE - 30'
 *   ]
 * );
 * ```
 */
export declare function validatePartitionPruning(queryInterface: QueryInterface, tableName: string, sampleQueries: string[]): Promise<{
    query: string;
    partitionsAccessed: number;
    efficient: boolean;
}[]>;
/**
 * Creates partitions dynamically based on data analysis.
 * Automatically determines optimal partition boundaries.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionColumn - Column to partition on
 * @param {object} config - Dynamic partition configuration
 * @returns {Promise<string[]>} Created partition names
 *
 * @example
 * ```typescript
 * const partitions = await createDynamicPartitions(queryInterface,
 *   'appointments', 'scheduled_date', {
 *     partitionCount: 12,
 *     strategy: 'RANGE',
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31')
 *   }
 * );
 * ```
 */
export declare function createDynamicPartitions(queryInterface: QueryInterface, tableName: string, partitionColumn: string, config: {
    partitionCount: number;
    strategy: PartitionType;
    startDate?: Date;
    endDate?: Date;
    prefix?: string;
    transaction?: Transaction;
}): Promise<string[]>;
/**
 * Auto-creates missing partitions based on current data.
 * Analyzes data and creates partitions for existing ranges.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} partitionColumn - Partition column
 * @param {object} config - Auto-creation configuration
 * @returns {Promise<string[]>} Created partition names
 *
 * @example
 * ```typescript
 * const created = await autoCreateMissingPartitions(queryInterface,
 *   'audit_logs', 'log_date', {
 *     interval: 'MONTH',
 *     lookAhead: 3
 *   }
 * );
 * ```
 */
export declare function autoCreateMissingPartitions(queryInterface: QueryInterface, tableName: string, partitionColumn: string, config: {
    interval: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
    lookAhead?: number;
    prefix?: string;
    transaction?: Transaction;
}): Promise<string[]>;
/**
 * Creates HIPAA-compliant partitioning for medical records.
 * Implements retention policies and audit requirements.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Medical records table name
 * @param {object} config - HIPAA partition configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createHIPAACompliantPartitioning(queryInterface, 'patient_records', {
 *   retentionYears: 7,
 *   archiveOlderThan: 5,
 *   enableCompression: true
 * });
 * ```
 */
export declare function createHIPAACompliantPartitioning(queryInterface: QueryInterface, tableName: string, config: {
    retentionYears: number;
    archiveOlderThan?: number;
    enableCompression?: boolean;
    partitionColumn?: string;
    transaction?: Transaction;
}): Promise<void>;
/**
 * Implements time-based data lifecycle management for audit logs.
 * Automatically manages partition retention and archival.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Audit log table name
 * @param {object} policy - Lifecycle policy configuration
 * @returns {Promise<object>} Lifecycle management results
 *
 * @example
 * ```typescript
 * const results = await implementAuditLogLifecycle(queryInterface,
 *   'audit_logs', {
 *     retentionDays: 2555, // 7 years
 *     archiveAfterDays: 365,
 *     compressionEnabled: true
 *   }
 * );
 * ```
 */
export declare function implementAuditLogLifecycle(queryInterface: QueryInterface, tableName: string, policy: {
    retentionDays: number;
    archiveAfterDays: number;
    compressionEnabled?: boolean;
    transaction?: Transaction;
}): Promise<{
    archived: string[];
    dropped: string[];
    compressed: string[];
}>;
/**
 * Creates optimized partitioning strategy for time-series healthcare data.
 * Handles vital signs, lab results, and monitoring data efficiently.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Time-series table name
 * @param {object} config - Time-series partition configuration
 * @returns {Promise<string>} Partition DDL statement
 *
 * @example
 * ```typescript
 * const ddl = await createTimeSeriesPartitioning(queryInterface,
 *   'vital_signs', {
 *     granularity: 'HOURLY',
 *     retentionDays: 90,
 *     compressionEnabled: true
 *   }
 * );
 * ```
 */
export declare function createTimeSeriesPartitioning(queryInterface: QueryInterface, tableName: string, config: {
    granularity: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    retentionDays: number;
    compressionEnabled?: boolean;
    partitionColumn?: string;
}): Promise<string>;
declare const _default: {
    createRangePartitionStrategy: typeof createRangePartitionStrategy;
    createHashPartitionStrategy: typeof createHashPartitionStrategy;
    createListPartitionStrategy: typeof createListPartitionStrategy;
    createCompositePartitionStrategy: typeof createCompositePartitionStrategy;
    createIntervalPartitionStrategy: typeof createIntervalPartitionStrategy;
    addPartition: typeof addPartition;
    dropPartition: typeof dropPartition;
    truncatePartition: typeof truncatePartition;
    mergePartitions: typeof mergePartitions;
    splitPartition: typeof splitPartition;
    exchangePartition: typeof exchangePartition;
    movePartition: typeof movePartition;
    renamePartition: typeof renamePartition;
    getPartitionMetadata: typeof getPartitionMetadata;
    gatherPartitionStatistics: typeof gatherPartitionStatistics;
    getPartitionStatistics: typeof getPartitionStatistics;
    analyzePartitionKey: typeof analyzePartitionKey;
    analyzePartitionPruning: typeof analyzePartitionPruning;
    enablePartitionWiseJoins: typeof enablePartitionWiseJoins;
    optimizePartitionPruning: typeof optimizePartitionPruning;
    validatePartitionPruning: typeof validatePartitionPruning;
    createDynamicPartitions: typeof createDynamicPartitions;
    autoCreateMissingPartitions: typeof autoCreateMissingPartitions;
    createHIPAACompliantPartitioning: typeof createHIPAACompliantPartitioning;
    implementAuditLogLifecycle: typeof implementAuditLogLifecycle;
    createTimeSeriesPartitioning: typeof createTimeSeriesPartitioning;
    PartitionType: typeof PartitionType;
};
export default _default;
//# sourceMappingURL=sequelize-oracle-partitioning-kit.d.ts.map