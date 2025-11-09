/**
 * @fileoverview SAN Compression Kit
 * @module reuse/san/san-compression-kit
 * @description Comprehensive SAN data compression utilities with deep Sequelize integration for
 * production-grade storage compression, algorithm selection, performance monitoring, and policy management.
 *
 * Key Features:
 * - Multi-algorithm compression support (LZ4, ZSTD, GZIP, Snappy)
 * - Inline and background compression modes
 * - Intelligent algorithm selection based on workload patterns
 * - Real-time compression ratio analysis and space savings tracking
 * - Performance impact monitoring and anomaly detection
 * - Compression policy management and enforcement
 * - Adaptive compression based on data characteristics
 * - Compression metrics and statistics collection
 * - Deduplication-aware compression optimization
 * - HIPAA-compliant compression audit trails
 * - Resource-aware compression scheduling
 * - Compression effectiveness evaluation
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x, NestJS v11.x
 *
 * @security
 * - HIPAA-compliant compression audit logging
 * - Encrypted data compression support
 * - Secure decompression with validation
 * - Resource consumption limits
 * - Performance impact controls
 * - Data integrity verification post-compression
 *
 * @example Basic usage
 * ```typescript
 * import { compressInline, selectOptimalAlgorithm, calculateCompressionRatio } from './san-compression-kit';
 *
 * // Select optimal algorithm
 * const algorithm = await selectOptimalAlgorithm(CompressionMetrics, {
 *   dataType: 'database',
 *   sizeBytes: 1024 * 1024 * 100,
 *   priority: 'balanced'
 * });
 *
 * // Compress data inline
 * const result = await compressInline(Volume, CompressionMetrics, volumeId, algorithm);
 *
 * // Analyze compression ratio
 * const ratio = await calculateCompressionRatio(CompressionMetrics, volumeId);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   compressBackground,
 *   createCompressionPolicy,
 *   monitorCompressionPerformance,
 *   evaluatePolicyEffectiveness
 * } from './san-compression-kit';
 *
 * // Create compression policy
 * const policy = await createCompressionPolicy(CompressionPolicy, {
 *   name: 'hipaa-compliant-compression',
 *   algorithm: 'ZSTD',
 *   compressionLevel: 3,
 *   schedulePattern: 'off-peak',
 *   minRatioThreshold: 1.2
 * });
 *
 * // Apply background compression
 * await compressBackground(Volume, CompressionMetrics, volumeId, {
 *   policyId: policy.id,
 *   priority: 'low',
 *   maxConcurrent: 4
 * });
 *
 * // Monitor performance
 * const metrics = await monitorCompressionPerformance(CompressionMetrics, volumeId, {
 *   intervalMs: 5000,
 *   alertThresholds: { latencyMs: 100, cpuPercent: 50 }
 * });
 * ```
 *
 * LOC: SANCOMP7892X234
 * UPSTREAM: sequelize, @types/sequelize, zlib, lz4, zstd
 * DOWNSTREAM: Storage services, volume management, backup systems, performance monitoring
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Transaction } from 'sequelize';
/**
 * @enum CompressionAlgorithm
 * @description Supported compression algorithms with different characteristics
 */
export declare enum CompressionAlgorithm {
    /** LZ4: Ultra-fast compression with moderate ratio, best for latency-sensitive workloads */
    LZ4 = "LZ4",
    /** ZSTD: Balanced compression with tunable levels, best for general-purpose use */
    ZSTD = "ZSTD",
    /** GZIP: Standard compression with good ratio, widely compatible */
    GZIP = "GZIP",
    /** Snappy: Fast compression optimized for throughput, best for streaming */
    Snappy = "Snappy",
    /** None: No compression applied */
    None = "None"
}
/**
 * @enum CompressionMode
 * @description Compression execution modes
 */
export declare enum CompressionMode {
    /** Inline: Synchronous compression during write operations */
    Inline = "Inline",
    /** Background: Asynchronous compression during idle periods */
    Background = "Background",
    /** Adaptive: Automatically switch between inline and background based on load */
    Adaptive = "Adaptive"
}
/**
 * @enum CompressionPriority
 * @description Compression optimization priorities
 */
export declare enum CompressionPriority {
    /** Speed: Prioritize compression/decompression speed over ratio */
    Speed = "Speed",
    /** Ratio: Prioritize compression ratio over speed */
    Ratio = "Ratio",
    /** Balanced: Balance between speed and ratio */
    Balanced = "Balanced",
    /** Resource: Minimize CPU and memory usage */
    Resource = "Resource"
}
/**
 * @interface CompressionMetricsModel
 * @description Sequelize model interface for compression metrics tracking
 */
export interface CompressionMetricsModel extends Model {
    id: string;
    volumeId: string;
    algorithm: CompressionAlgorithm;
    mode: CompressionMode;
    uncompressedBytes: number;
    compressedBytes: number;
    compressionRatio: number;
    compressionTimeMs: number;
    decompressionTimeMs: number;
    cpuUsagePercent: number;
    memoryUsageMb: number;
    throughputMbps: number;
    errorCount: number;
    lastCompressedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @interface CompressionPolicyModel
 * @description Sequelize model interface for compression policies
 */
export interface CompressionPolicyModel extends Model {
    id: string;
    name: string;
    algorithm: CompressionAlgorithm;
    compressionLevel: number;
    mode: CompressionMode;
    schedulePattern: string;
    minRatioThreshold: number;
    maxCpuPercent: number;
    maxMemoryMb: number;
    enabledDataTypes: string[];
    excludedVolumeIds: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @interface VolumeModel
 * @description Sequelize model interface for SAN volumes with compression
 */
export interface VolumeModel extends Model {
    id: string;
    name: string;
    sizeBytes: number;
    compressionEnabled: boolean;
    compressionAlgorithm: CompressionAlgorithm;
    compressionMode: CompressionMode;
    currentCompressionRatio: number;
    spaceSavedBytes: number;
    lastCompressionCheck: Date;
    compressionPolicyId?: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @interface CompressionOptions
 * @description Configuration options for compression operations
 */
export interface CompressionOptions {
    /** Compression level (1-9, algorithm-dependent) */
    level?: number;
    /** Maximum CPU usage percentage */
    maxCpuPercent?: number;
    /** Maximum memory usage in MB */
    maxMemoryMb?: number;
    /** Enable verification after compression */
    verifyIntegrity?: boolean;
    /** Timeout in milliseconds */
    timeoutMs?: number;
    /** Database transaction for atomic operations */
    transaction?: Transaction;
}
/**
 * @interface CompressionResult
 * @description Result of a compression operation
 */
export interface CompressionResult {
    success: boolean;
    algorithm: CompressionAlgorithm;
    uncompressedBytes: number;
    compressedBytes: number;
    compressionRatio: number;
    compressionTimeMs: number;
    cpuUsagePercent: number;
    memoryUsageMb: number;
    errorMessage?: string;
    metadataId?: string;
}
/**
 * @interface DecompressionResult
 * @description Result of a decompression operation
 */
export interface DecompressionResult {
    success: boolean;
    algorithm: CompressionAlgorithm;
    compressedBytes: number;
    decompressedBytes: number;
    decompressionTimeMs: number;
    verificationPassed: boolean;
    errorMessage?: string;
}
/**
 * @interface CompressionStatistics
 * @description Aggregate compression statistics
 */
export interface CompressionStatistics {
    totalVolumes: number;
    compressedVolumes: number;
    totalUncompressedBytes: number;
    totalCompressedBytes: number;
    averageCompressionRatio: number;
    totalSpaceSavedBytes: number;
    spaceSavingsPercent: number;
    algorithmDistribution: Record<CompressionAlgorithm, number>;
    performanceMetrics: {
        averageCompressionTimeMs: number;
        averageThroughputMbps: number;
        averageCpuPercent: number;
        averageMemoryMb: number;
    };
}
/**
 * @interface WorkloadCharacteristics
 * @description Characteristics of data workload for algorithm selection
 */
export interface WorkloadCharacteristics {
    /** Type of data being compressed */
    dataType: 'database' | 'multimedia' | 'logs' | 'backup' | 'generic';
    /** Size of data in bytes */
    sizeBytes: number;
    /** Compression priority */
    priority: CompressionPriority;
    /** Expected read/write ratio */
    readWriteRatio?: number;
    /** IOPS requirements */
    iopsRequirement?: number;
    /** Latency sensitivity in milliseconds */
    latencySensitivity?: number;
}
/**
 * @interface PerformanceMonitoringConfig
 * @description Configuration for compression performance monitoring
 */
export interface PerformanceMonitoringConfig {
    /** Monitoring interval in milliseconds */
    intervalMs: number;
    /** Alert thresholds */
    alertThresholds?: {
        latencyMs?: number;
        cpuPercent?: number;
        memoryMb?: number;
        errorRate?: number;
    };
    /** Enable detailed metrics collection */
    detailedMetrics?: boolean;
}
/**
 * @interface BackgroundCompressionConfig
 * @description Configuration for background compression operations
 */
export interface BackgroundCompressionConfig {
    /** Compression policy ID */
    policyId?: string;
    /** Priority level */
    priority: 'low' | 'medium' | 'high';
    /** Maximum concurrent compression tasks */
    maxConcurrent: number;
    /** Schedule pattern (cron-like) */
    schedulePattern?: string;
    /** Enable auto-pause on high load */
    autoPause?: boolean;
}
/**
 * Compresses data using LZ4 algorithm
 *
 * @description Ultra-fast compression optimized for latency-sensitive workloads.
 * Provides excellent decompression speed with moderate compression ratios.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<CompressionResult>} Compression result
 *
 * @throws {Error} If compression fails or data is invalid
 *
 * @example
 * ```typescript
 * const result = await compressWithLZ4(CompressionMetrics, 'vol-123', dataBuffer, {
 *   level: 1,
 *   verifyIntegrity: true
 * });
 * console.log(`Compression ratio: ${result.compressionRatio}`);
 * ```
 */
export declare function compressWithLZ4(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, data: Buffer, options?: CompressionOptions): Promise<CompressionResult>;
/**
 * Decompresses LZ4-compressed data
 *
 * @description Fast decompression of LZ4-compressed data with integrity verification.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} compressedData - Compressed data
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<DecompressionResult>} Decompression result
 *
 * @throws {Error} If decompression fails or data is corrupted
 */
export declare function decompressWithLZ4(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, compressedData: Buffer, options?: CompressionOptions): Promise<DecompressionResult>;
/**
 * Compresses data using ZSTD algorithm
 *
 * @description Balanced compression with tunable compression levels (1-22).
 * Best for general-purpose use with excellent ratio-to-speed trade-off.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<CompressionResult>} Compression result
 *
 * @example
 * ```typescript
 * const result = await compressWithZSTD(CompressionMetrics, 'vol-123', dataBuffer, {
 *   level: 3, // Balanced level
 *   maxCpuPercent: 50
 * });
 * ```
 */
export declare function compressWithZSTD(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, data: Buffer, options?: CompressionOptions): Promise<CompressionResult>;
/**
 * Decompresses ZSTD-compressed data
 *
 * @description Fast decompression of ZSTD data with integrity verification.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} compressedData - Compressed data
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<DecompressionResult>} Decompression result
 */
export declare function decompressWithZSTD(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, compressedData: Buffer, options?: CompressionOptions): Promise<DecompressionResult>;
/**
 * Compresses data using GZIP algorithm
 *
 * @description Standard compression with wide compatibility. Good compression ratio
 * but slower than LZ4/Snappy. Best for archival and compatibility requirements.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<CompressionResult>} Compression result
 */
export declare function compressWithGZIP(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, data: Buffer, options?: CompressionOptions): Promise<CompressionResult>;
/**
 * Decompresses GZIP-compressed data
 *
 * @description Decompression of GZIP data with integrity verification.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} compressedData - Compressed data
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<DecompressionResult>} Decompression result
 */
export declare function decompressWithGZIP(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, compressedData: Buffer, options?: CompressionOptions): Promise<DecompressionResult>;
/**
 * Compresses data using Snappy algorithm
 *
 * @description Fast compression optimized for throughput. Lower compression ratio
 * but excellent for streaming and high-throughput scenarios.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<CompressionResult>} Compression result
 */
export declare function compressWithSnappy(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, data: Buffer, options?: CompressionOptions): Promise<CompressionResult>;
/**
 * Decompresses Snappy-compressed data
 *
 * @description Ultra-fast decompression of Snappy data.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} compressedData - Compressed data
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<DecompressionResult>} Decompression result
 */
export declare function decompressWithSnappy(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, compressedData: Buffer, options?: CompressionOptions): Promise<DecompressionResult>;
/**
 * Performs inline compression during write operations
 *
 * @description Synchronous compression that occurs during data write operations.
 * Provides immediate space savings but may impact write latency.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {CompressionAlgorithm} algorithm - Compression algorithm to use
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<CompressionResult>} Compression result
 *
 * @example
 * ```typescript
 * const result = await compressInline(Volume, CompressionMetrics, 'vol-123',
 *   CompressionAlgorithm.ZSTD, { level: 3 }
 * );
 * ```
 */
export declare function compressInline(Volume: ModelStatic<VolumeModel>, CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, algorithm: CompressionAlgorithm, options?: CompressionOptions): Promise<CompressionResult>;
/**
 * Performs background compression during idle periods
 *
 * @description Asynchronous compression scheduled during low-activity periods.
 * Minimizes impact on production workloads.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {BackgroundCompressionConfig} config - Background compression configuration
 * @returns {Promise<CompressionResult>} Compression result
 *
 * @example
 * ```typescript
 * const result = await compressBackground(Volume, CompressionMetrics, 'vol-123', {
 *   priority: 'low',
 *   maxConcurrent: 2,
 *   schedulePattern: '0 2 * * *' // 2 AM daily
 * });
 * ```
 */
export declare function compressBackground(Volume: ModelStatic<VolumeModel>, CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, config: BackgroundCompressionConfig): Promise<CompressionResult>;
/**
 * Performs inline decompression during read operations
 *
 * @description Synchronous decompression during data read operations.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<DecompressionResult>} Decompression result
 */
export declare function decompressInline(Volume: ModelStatic<VolumeModel>, CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, options?: CompressionOptions): Promise<DecompressionResult>;
/**
 * Performs background decompression
 *
 * @description Asynchronous decompression for maintenance or migration operations.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {BackgroundCompressionConfig} config - Background decompression configuration
 * @returns {Promise<DecompressionResult>} Decompression result
 */
export declare function decompressBackground(Volume: ModelStatic<VolumeModel>, CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, config: BackgroundCompressionConfig): Promise<DecompressionResult>;
/**
 * Calculates compression ratio for a volume
 *
 * @description Computes the compression ratio based on compressed and uncompressed sizes.
 * Ratio > 1.0 indicates space savings.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @returns {Promise<number>} Compression ratio
 *
 * @example
 * ```typescript
 * const ratio = await calculateCompressionRatio(CompressionMetrics, 'vol-123');
 * console.log(`Compression ratio: ${ratio.toFixed(2)}:1`);
 * ```
 */
export declare function calculateCompressionRatio(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string): Promise<number>;
/**
 * Analyzes compression efficiency across algorithms
 *
 * @description Evaluates compression effectiveness by comparing multiple algorithms
 * on sample data to determine optimal choice.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {Buffer} sampleData - Sample data for analysis
 * @returns {Promise<Record<CompressionAlgorithm, CompressionResult>>} Algorithm comparison
 *
 * @example
 * ```typescript
 * const analysis = await analyzeCompressionEfficiency(
 *   CompressionMetrics, 'vol-123', sampleBuffer
 * );
 * const bestAlgorithm = Object.entries(analysis)
 *   .sort((a, b) => b[1].compressionRatio - a[1].compressionRatio)[0][0];
 * ```
 */
export declare function analyzeCompressionEfficiency(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, sampleData: Buffer): Promise<Record<CompressionAlgorithm, CompressionResult>>;
/**
 * Estimates space savings from compression
 *
 * @description Projects potential space savings based on compression ratio and volume size.
 *
 * @param {number} volumeSizeBytes - Total volume size in bytes
 * @param {number} compressionRatio - Expected compression ratio
 * @returns {Promise<{ spaceSavedBytes: number; spaceSavedPercent: number }>} Space savings estimate
 *
 * @example
 * ```typescript
 * const savings = await estimateSpaceSavings(1024 * 1024 * 1024 * 100, 2.5);
 * console.log(`Estimated savings: ${savings.spaceSavedPercent.toFixed(1)}%`);
 * ```
 */
export declare function estimateSpaceSavings(volumeSizeBytes: number, compressionRatio: number): Promise<{
    spaceSavedBytes: number;
    spaceSavedPercent: number;
}>;
/**
 * Compares compression ratios across multiple volumes
 *
 * @description Analyzes and compares compression effectiveness across different volumes
 * to identify optimization opportunities.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string[]} volumeIds - Volume identifiers to compare
 * @returns {Promise<Map<string, number>>} Volume ID to compression ratio map
 */
export declare function compareCompressionRatios(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeIds: string[]): Promise<Map<string, number>>;
/**
 * Gets comprehensive compression statistics
 *
 * @description Retrieves aggregate compression statistics across all volumes or tenant.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} tenantId - Tenant identifier
 * @returns {Promise<CompressionStatistics>} Aggregate statistics
 *
 * @example
 * ```typescript
 * const stats = await getCompressionStatistics(Volume, CompressionMetrics, 'tenant-1');
 * console.log(`Total space saved: ${stats.totalSpaceSavedBytes / 1024 / 1024 / 1024} GB`);
 * ```
 */
export declare function getCompressionStatistics(Volume: ModelStatic<VolumeModel>, CompressionMetrics: ModelStatic<CompressionMetricsModel>, tenantId: string): Promise<CompressionStatistics>;
/**
 * Selects optimal compression algorithm based on workload
 *
 * @description Intelligently selects the best compression algorithm by analyzing
 * workload characteristics, performance requirements, and data patterns.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {WorkloadCharacteristics} workload - Workload characteristics
 * @returns {Promise<CompressionAlgorithm>} Recommended algorithm
 *
 * @example
 * ```typescript
 * const algorithm = await selectOptimalAlgorithm(CompressionMetrics, {
 *   dataType: 'database',
 *   sizeBytes: 1024 * 1024 * 1024,
 *   priority: CompressionPriority.Balanced,
 *   iopsRequirement: 10000
 * });
 * ```
 */
export declare function selectOptimalAlgorithm(CompressionMetrics: ModelStatic<CompressionMetricsModel>, workload: WorkloadCharacteristics): Promise<CompressionAlgorithm>;
/**
 * Selects algorithm optimized for specific workload type
 *
 * @description Specialized algorithm selection based on workload patterns.
 *
 * @param {string} workloadType - Workload type identifier
 * @returns {Promise<CompressionAlgorithm>} Recommended algorithm
 */
export declare function selectAlgorithmForWorkload(workloadType: string): Promise<CompressionAlgorithm>;
/**
 * Selects algorithm optimized for compression speed
 *
 * @description Returns the fastest compression algorithm with acceptable ratio.
 *
 * @returns {Promise<CompressionAlgorithm>} Speed-optimized algorithm
 */
export declare function selectAlgorithmBySpeed(): Promise<CompressionAlgorithm>;
/**
 * Selects algorithm optimized for compression ratio
 *
 * @description Returns algorithm with best compression ratio regardless of speed.
 *
 * @returns {Promise<CompressionAlgorithm>} Ratio-optimized algorithm
 */
export declare function selectAlgorithmByRatio(): Promise<CompressionAlgorithm>;
/**
 * Selects algorithm optimized for resource usage
 *
 * @description Returns algorithm with minimal CPU and memory footprint.
 *
 * @returns {Promise<CompressionAlgorithm>} Resource-optimized algorithm
 */
export declare function selectAlgorithmByResource(): Promise<CompressionAlgorithm>;
/**
 * Evaluates algorithm suitability for specific data characteristics
 *
 * @description Scores each algorithm based on data patterns and requirements,
 * returning suitability scores for informed decision-making.
 *
 * @param {WorkloadCharacteristics} workload - Workload characteristics
 * @returns {Promise<Record<CompressionAlgorithm, number>>} Algorithm suitability scores (0-100)
 *
 * @example
 * ```typescript
 * const scores = await evaluateAlgorithmSuitability({
 *   dataType: 'database',
 *   sizeBytes: 1024 * 1024 * 1024,
 *   priority: CompressionPriority.Balanced
 * });
 * // { LZ4: 75, ZSTD: 95, GZIP: 80, Snappy: 70, None: 0 }
 * ```
 */
export declare function evaluateAlgorithmSuitability(workload: WorkloadCharacteristics): Promise<Record<CompressionAlgorithm, number>>;
/**
 * Monitors compression performance in real-time
 *
 * @description Continuously monitors compression operations, tracking metrics
 * and detecting performance issues.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {PerformanceMonitoringConfig} config - Monitoring configuration
 * @returns {Promise<CompressionMetricsModel[]>} Recent performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await monitorCompressionPerformance(CompressionMetrics, 'vol-123', {
 *   intervalMs: 5000,
 *   alertThresholds: { latencyMs: 100, cpuPercent: 70 }
 * });
 * ```
 */
export declare function monitorCompressionPerformance(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, config: PerformanceMonitoringConfig): Promise<CompressionMetricsModel[]>;
/**
 * Tracks compression metrics over time
 *
 * @description Aggregates and tracks compression metrics for trend analysis.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {number} durationMs - Duration to track in milliseconds
 * @returns {Promise<CompressionMetricsModel[]>} Historical metrics
 */
export declare function trackCompressionMetrics(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, durationMs: number): Promise<CompressionMetricsModel[]>;
/**
 * Measures compression latency
 *
 * @description Precisely measures compression operation latency for performance analysis.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @param {CompressionAlgorithm} algorithm - Algorithm to measure
 * @returns {Promise<{ p50: number; p95: number; p99: number }>} Latency percentiles in ms
 */
export declare function measureCompressionLatency(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string, algorithm: CompressionAlgorithm): Promise<{
    p50: number;
    p95: number;
    p99: number;
}>;
/**
 * Measures compression throughput
 *
 * @description Calculates compression throughput in MB/s for capacity planning.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @returns {Promise<number>} Average throughput in MB/s
 */
export declare function measureCompressionThroughput(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string): Promise<number>;
/**
 * Detects performance anomalies
 *
 * @description Identifies unusual compression performance patterns that may indicate issues.
 *
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @returns {Promise<{ hasAnomaly: boolean; anomalyType?: string; details?: string }>} Anomaly detection result
 */
export declare function detectPerformanceAnomaly(CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string): Promise<{
    hasAnomaly: boolean;
    anomalyType?: string;
    details?: string;
}>;
/**
 * Generates compression performance report
 *
 * @description Creates comprehensive performance report with metrics and recommendations.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} volumeId - Volume identifier
 * @returns {Promise<object>} Performance report
 */
export declare function generatePerformanceReport(Volume: ModelStatic<VolumeModel>, CompressionMetrics: ModelStatic<CompressionMetricsModel>, volumeId: string): Promise<{
    volume: VolumeModel;
    currentRatio: number;
    latencyMetrics: {
        p50: number;
        p95: number;
        p99: number;
    };
    throughput: number;
    spaceSavings: {
        bytes: number;
        percent: number;
    };
    anomalies: {
        hasAnomaly: boolean;
        anomalyType?: string;
        details?: string;
    };
    recommendations: string[];
}>;
/**
 * Creates a compression policy
 *
 * @description Defines and stores a compression policy with algorithm, scheduling,
 * and resource limits.
 *
 * @param {ModelStatic<CompressionPolicyModel>} CompressionPolicy - Policy model
 * @param {Partial<CompressionPolicyModel>} policyData - Policy configuration
 * @returns {Promise<CompressionPolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createCompressionPolicy(CompressionPolicy, {
 *   name: 'production-compression',
 *   algorithm: CompressionAlgorithm.ZSTD,
 *   compressionLevel: 3,
 *   mode: CompressionMode.Background,
 *   schedulePattern: '0 2 * * *',
 *   minRatioThreshold: 1.3,
 *   maxCpuPercent: 50
 * });
 * ```
 */
export declare function createCompressionPolicy(CompressionPolicy: ModelStatic<CompressionPolicyModel>, policyData: Partial<CompressionPolicyModel>): Promise<CompressionPolicyModel>;
/**
 * Applies compression policy to volume
 *
 * @description Enforces compression policy on specified volume.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionPolicyModel>} CompressionPolicy - Policy model
 * @param {string} volumeId - Volume identifier
 * @param {string} policyId - Policy identifier
 * @returns {Promise<VolumeModel>} Updated volume
 */
export declare function applyCompressionPolicy(Volume: ModelStatic<VolumeModel>, CompressionPolicy: ModelStatic<CompressionPolicyModel>, volumeId: string, policyId: string): Promise<VolumeModel>;
/**
 * Validates compression policy configuration
 *
 * @description Ensures policy configuration is valid and consistent.
 *
 * @param {Partial<CompressionPolicyModel>} policyData - Policy to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 */
export declare function validateCompressionPolicy(policyData: Partial<CompressionPolicyModel>): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Updates existing compression policy
 *
 * @description Modifies compression policy configuration.
 *
 * @param {ModelStatic<CompressionPolicyModel>} CompressionPolicy - Policy model
 * @param {string} policyId - Policy identifier
 * @param {Partial<CompressionPolicyModel>} updates - Policy updates
 * @returns {Promise<CompressionPolicyModel>} Updated policy
 */
export declare function updateCompressionPolicy(CompressionPolicy: ModelStatic<CompressionPolicyModel>, policyId: string, updates: Partial<CompressionPolicyModel>): Promise<CompressionPolicyModel>;
/**
 * Evaluates policy effectiveness
 *
 * @description Analyzes how well a policy is performing across applied volumes.
 *
 * @param {ModelStatic<VolumeModel>} Volume - Volume model
 * @param {ModelStatic<CompressionMetricsModel>} CompressionMetrics - Metrics model
 * @param {string} policyId - Policy identifier
 * @returns {Promise<object>} Policy effectiveness metrics
 */
export declare function evaluatePolicyEffectiveness(Volume: ModelStatic<VolumeModel>, CompressionMetrics: ModelStatic<CompressionMetricsModel>, policyId: string): Promise<{
    appliedVolumes: number;
    averageRatio: number;
    totalSpaceSaved: number;
    averageLatency: number;
    policyEfficiencyScore: number;
}>;
/**
 * Determines if compression is beneficial for given data
 *
 * @description Analyzes data characteristics to determine if compression would be beneficial.
 *
 * @param {Buffer} sampleData - Sample data to analyze
 * @param {number} minRatioThreshold - Minimum acceptable compression ratio
 * @returns {Promise<boolean>} True if compression is recommended
 */
export declare function isCompressionBeneficial(sampleData: Buffer, minRatioThreshold?: number): Promise<boolean>;
/**
 * Estimates compression time for given data size
 *
 * @description Predicts compression duration based on data size and algorithm.
 *
 * @param {number} dataSizeBytes - Size of data to compress
 * @param {CompressionAlgorithm} algorithm - Compression algorithm
 * @returns {Promise<number>} Estimated time in milliseconds
 */
export declare function estimateCompressionTime(dataSizeBytes: number, algorithm: CompressionAlgorithm): Promise<number>;
/**
 * Validates compression input data
 *
 * @description Ensures input data is valid for compression operations.
 *
 * @param {Buffer} data - Data to validate
 * @returns {Promise<{ valid: boolean; error?: string }>} Validation result
 */
export declare function validateCompressionInput(data: Buffer): Promise<{
    valid: boolean;
    error?: string;
}>;
/**
 * Handles compression errors with appropriate recovery
 *
 * @description Centralized error handling for compression operations.
 *
 * @param {Error} error - Error to handle
 * @param {string} volumeId - Volume identifier
 * @param {CompressionAlgorithm} algorithm - Algorithm that failed
 * @returns {Promise<void>}
 */
export declare function handleCompressionError(error: Error, volumeId: string, algorithm: CompressionAlgorithm): Promise<void>;
/**
 * Gets algorithm capabilities and characteristics
 *
 * @description Returns detailed information about compression algorithm capabilities.
 *
 * @param {CompressionAlgorithm} algorithm - Algorithm to query
 * @returns {Promise<object>} Algorithm capabilities
 */
export declare function getAlgorithmCapabilities(algorithm: CompressionAlgorithm): Promise<{
    name: string;
    typicalRatio: number;
    compressionSpeed: string;
    decompressionSpeed: string;
    cpuUsage: string;
    memoryUsage: string;
    bestUseCase: string;
}>;
/**
 * Formats compression metrics for display
 *
 * @description Formats compression metrics into human-readable format.
 *
 * @param {CompressionMetricsModel} metrics - Metrics to format
 * @returns {Promise<string>} Formatted metrics string
 */
export declare function formatCompressionMetrics(metrics: CompressionMetricsModel): Promise<string>;
/**
 * Logs compression activity for audit trail
 *
 * @description Records compression operations for HIPAA-compliant audit logging.
 *
 * @param {string} volumeId - Volume identifier
 * @param {string} operation - Operation type
 * @param {CompressionAlgorithm} algorithm - Algorithm used
 * @param {CompressionResult | DecompressionResult} result - Operation result
 * @returns {Promise<void>}
 */
export declare function logCompressionActivity(volumeId: string, operation: 'compress' | 'decompress', algorithm: CompressionAlgorithm, result: CompressionResult | DecompressionResult): Promise<void>;
//# sourceMappingURL=san-compression-kit.d.ts.map