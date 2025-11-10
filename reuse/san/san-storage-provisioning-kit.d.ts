/**
 * @fileoverview SAN Storage Provisioning Utilities for Healthcare Infrastructure
 * @module reuse/san/san-storage-provisioning-kit
 * @description Comprehensive SAN (Storage Area Network) provisioning utilities for enterprise healthcare
 * environments, covering thin/thick provisioning, auto-tiering, capacity management, and HIPAA compliance.
 *
 * Key Features:
 * - Thin and thick provisioning strategies
 * - Over-provisioning ratio management
 * - Automated storage tiering (hot/warm/cold)
 * - Storage pool creation and management
 * - LUN allocation and mapping
 * - Capacity planning and forecasting
 * - Performance monitoring and optimization
 * - RAID configuration management
 * - Snapshot and cloning operations
 * - Deduplication and compression
 * - Replication and disaster recovery
 * - Quality of Service (QoS) policies
 * - Multi-tenancy and resource isolation
 * - Storage migration utilities
 * - Audit logging for compliance
 * - Healthcare-specific data retention
 * - NestJS service integration patterns
 * - Dependency injection support
 * - Real-time metrics collection
 * - Alert and threshold management
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant audit logging
 * - Encrypted storage volumes
 * - Access control and authorization
 * - Secure multi-tenancy isolation
 * - PHI data retention policies
 * - Tamper-proof audit trails
 * - Role-based provisioning controls
 *
 * @example Basic usage
 * ```typescript
 * import {
 *   createStoragePool,
 *   allocateThinVolume,
 *   calculateOverProvisioningRatio,
 *   applyAutoTieringPolicy
 * } from './san-storage-provisioning-kit';
 *
 * // Create storage pool
 * const pool = createStoragePool({
 *   name: 'medical-imaging-pool',
 *   capacity: 100 * 1024 * 1024 * 1024 * 1024, // 100TB
 *   tier: 'hot',
 *   raidLevel: 'RAID10'
 * });
 *
 * // Allocate thin volume
 * const volume = allocateThinVolume(pool, {
 *   name: 'patient-records-vol',
 *   virtualSize: 10 * 1024 * 1024 * 1024 * 1024, // 10TB
 *   initialAllocation: 2 * 1024 * 1024 * 1024 * 1024 // 2TB
 * });
 *
 * // Calculate over-provisioning
 * const ratio = calculateOverProvisioningRatio(pool);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createMultiTierPool,
 *   enableAutoTiering,
 *   createQoSPolicy,
 *   setupReplication
 * } from './san-storage-provisioning-kit';
 *
 * // Multi-tier storage pool
 * const multiTierPool = createMultiTierPool({
 *   name: 'white-cross-storage',
 *   tiers: [
 *     { type: 'hot', capacity: 20 * TB, deviceType: 'nvme' },
 *     { type: 'warm', capacity: 100 * TB, deviceType: 'ssd' },
 *     { type: 'cold', capacity: 500 * TB, deviceType: 'hdd' }
 *   ]
 * });
 *
 * // Enable auto-tiering
 * enableAutoTiering(multiTierPool, {
 *   hotThreshold: 0.8,
 *   warmThreshold: 0.5,
 *   migrationSchedule: 'daily'
 * });
 *
 * // Create QoS policy
 * const qosPolicy = createQoSPolicy({
 *   name: 'critical-medical-imaging',
 *   minIOPS: 10000,
 *   maxIOPS: 50000,
 *   minBandwidth: 1000 * MB,
 *   maxBandwidth: 5000 * MB
 * });
 * ```
 *
 * LOC: SF89K2M471
 * UPSTREAM: @nestjs/common, typeorm, ioredis, prometheus-client
 * DOWNSTREAM: storage.service.ts, provisioning.controller.ts, monitoring services
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
/**
 * @type StorageTier
 * @description Storage tier classification for auto-tiering
 */
export type StorageTier = 'hot' | 'warm' | 'cold' | 'archive';
/**
 * @type ProvisioningType
 * @description Storage provisioning strategy
 */
export type ProvisioningType = 'thin' | 'thick' | 'thick-lazy' | 'thick-eager';
/**
 * @type RAIDLevel
 * @description RAID configuration levels
 */
export type RAIDLevel = 'RAID0' | 'RAID1' | 'RAID5' | 'RAID6' | 'RAID10' | 'RAID50' | 'RAID60';
/**
 * @type DeviceType
 * @description Storage device technology
 */
export type DeviceType = 'nvme' | 'ssd' | 'hdd' | 'tape';
/**
 * @type VolumeState
 * @description Current state of a storage volume
 */
export type VolumeState = 'online' | 'offline' | 'degraded' | 'migrating' | 'snapshotting' | 'failed';
/**
 * @interface StoragePool
 * @description Represents a storage pool configuration
 */
export interface StoragePool {
    /** Unique pool identifier */
    id: string;
    /** Pool name */
    name: string;
    /** Total capacity in bytes */
    capacity: number;
    /** Used capacity in bytes */
    used: number;
    /** Available capacity in bytes */
    available: number;
    /** Storage tier */
    tier: StorageTier;
    /** RAID configuration */
    raidLevel: RAIDLevel;
    /** Device type */
    deviceType: DeviceType;
    /** Over-provisioning ratio (e.g., 1.5 = 150%) */
    overProvisioningRatio: number;
    /** Deduplication enabled */
    deduplicationEnabled: boolean;
    /** Compression enabled */
    compressionEnabled: boolean;
    /** Pool creation timestamp */
    createdAt: Date;
    /** Pool metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface StorageVolume
 * @description Represents a provisioned storage volume
 */
export interface StorageVolume {
    /** Unique volume identifier */
    id: string;
    /** Volume name */
    name: string;
    /** Pool ID this volume belongs to */
    poolId: string;
    /** Provisioning type */
    provisioningType: ProvisioningType;
    /** Virtual size in bytes (allocated to user) */
    virtualSize: number;
    /** Physical size in bytes (actual storage used) */
    physicalSize: number;
    /** Current tier */
    currentTier: StorageTier;
    /** Volume state */
    state: VolumeState;
    /** QoS policy ID */
    qosPolicyId?: string;
    /** Tenant/owner identifier */
    tenantId: string;
    /** Healthcare department */
    department?: string;
    /** Data retention period in days */
    retentionDays?: number;
    /** HIPAA compliance enabled */
    hipaaCompliant: boolean;
    /** Encryption enabled */
    encrypted: boolean;
    /** Volume creation timestamp */
    createdAt: Date;
    /** Last access timestamp */
    lastAccessedAt?: Date;
    /** Volume metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface TieringPolicy
 * @description Auto-tiering policy configuration
 */
export interface TieringPolicy {
    /** Policy identifier */
    id: string;
    /** Policy name */
    name: string;
    /** Hot tier access threshold (accesses per day) */
    hotAccessThreshold: number;
    /** Warm tier access threshold */
    warmAccessThreshold: number;
    /** Cold tier age threshold (days without access) */
    coldAgeThreshold: number;
    /** Archive age threshold (days) */
    archiveAgeThreshold: number;
    /** Migration schedule (cron expression) */
    migrationSchedule: string;
    /** Enable automatic migration */
    autoMigrationEnabled: boolean;
    /** Policy metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface QoSPolicy
 * @description Quality of Service policy for storage performance
 */
export interface QoSPolicy {
    /** Policy identifier */
    id: string;
    /** Policy name */
    name: string;
    /** Minimum IOPS guarantee */
    minIOPS: number;
    /** Maximum IOPS limit */
    maxIOPS: number;
    /** Minimum bandwidth in bytes/sec */
    minBandwidth: number;
    /** Maximum bandwidth in bytes/sec */
    maxBandwidth: number;
    /** Latency target in milliseconds */
    latencyTarget?: number;
    /** Priority level (1-10, higher = more important) */
    priority: number;
    /** Policy metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface AllocationRequest
 * @description Storage allocation request
 */
export interface AllocationRequest {
    /** Volume name */
    name: string;
    /** Requested size in bytes */
    size: number;
    /** Provisioning type */
    provisioningType: ProvisioningType;
    /** Preferred tier */
    preferredTier?: StorageTier;
    /** QoS policy */
    qosPolicyId?: string;
    /** Tenant identifier */
    tenantId: string;
    /** Department */
    department?: string;
    /** Data retention days */
    retentionDays?: number;
    /** HIPAA compliance required */
    requireHIPAA?: boolean;
    /** Encryption required */
    requireEncryption?: boolean;
}
/**
 * @interface CapacityForecast
 * @description Storage capacity forecast data
 */
export interface CapacityForecast {
    /** Forecast timestamp */
    timestamp: Date;
    /** Current capacity in bytes */
    currentCapacity: number;
    /** Current usage in bytes */
    currentUsage: number;
    /** Projected usage in 30 days */
    projected30Days: number;
    /** Projected usage in 90 days */
    projected90Days: number;
    /** Projected usage in 180 days */
    projected180Days: number;
    /** Days until capacity exhaustion */
    daysUntilFull: number;
    /** Recommended expansion in bytes */
    recommendedExpansion?: number;
}
/**
 * @interface StorageMetrics
 * @description Real-time storage metrics
 */
export interface StorageMetrics {
    /** Pool or volume ID */
    resourceId: string;
    /** Resource type */
    resourceType: 'pool' | 'volume';
    /** Current IOPS */
    iops: number;
    /** Bandwidth in bytes/sec */
    bandwidth: number;
    /** Average latency in milliseconds */
    latency: number;
    /** Read operations per second */
    readOps: number;
    /** Write operations per second */
    writeOps: number;
    /** Cache hit ratio (0-1) */
    cacheHitRatio: number;
    /** Deduplication ratio (e.g., 2.0 = 50% savings) */
    deduplicationRatio?: number;
    /** Compression ratio */
    compressionRatio?: number;
    /** Timestamp */
    timestamp: Date;
}
/**
 * @interface SnapshotConfig
 * @description Snapshot configuration
 */
export interface SnapshotConfig {
    /** Volume ID to snapshot */
    volumeId: string;
    /** Snapshot name */
    name: string;
    /** Description */
    description?: string;
    /** Retention period in days */
    retentionDays: number;
    /** Schedule (cron expression) */
    schedule?: string;
    /** Snapshot type */
    type: 'crash-consistent' | 'application-consistent';
}
/**
 * @interface ReplicationConfig
 * @description Replication configuration
 */
export interface ReplicationConfig {
    /** Source volume ID */
    sourceVolumeId: string;
    /** Target pool or site ID */
    targetPoolId: string;
    /** Replication type */
    type: 'synchronous' | 'asynchronous';
    /** RPO (Recovery Point Objective) in seconds */
    rpo: number;
    /** RTO (Recovery Time Objective) in seconds */
    rto: number;
    /** Enable automatic failover */
    autoFailover: boolean;
}
/**
 * @interface MigrationJob
 * @description Storage migration job
 */
export interface MigrationJob {
    /** Job identifier */
    id: string;
    /** Volume ID */
    volumeId: string;
    /** Source tier */
    sourceTier: StorageTier;
    /** Target tier */
    targetTier: StorageTier;
    /** Job state */
    state: 'pending' | 'running' | 'completed' | 'failed';
    /** Progress percentage (0-100) */
    progress: number;
    /** Start timestamp */
    startedAt?: Date;
    /** Completion timestamp */
    completedAt?: Date;
    /** Error message if failed */
    error?: string;
}
/**
 * @interface StorageAuditLog
 * @description HIPAA-compliant audit log entry
 */
export interface StorageAuditLog {
    /** Log entry ID */
    id: string;
    /** Timestamp */
    timestamp: Date;
    /** Action performed */
    action: string;
    /** Resource type */
    resourceType: 'pool' | 'volume' | 'snapshot' | 'policy';
    /** Resource ID */
    resourceId: string;
    /** User/service performing action */
    actor: string;
    /** Tenant ID */
    tenantId?: string;
    /** Action result */
    result: 'success' | 'failure';
    /** IP address */
    ipAddress?: string;
    /** Additional details */
    details?: Record<string, any>;
}
/** Size constants */
export declare const KB = 1024;
export declare const MB: number;
export declare const GB: number;
export declare const TB: number;
export declare const PB: number;
/**
 * @constant DEFAULT_OVER_PROVISIONING_RATIOS
 * @description Recommended over-provisioning ratios by tier
 */
export declare const DEFAULT_OVER_PROVISIONING_RATIOS: Record<StorageTier, number>;
/**
 * @constant RAID_OVERHEAD
 * @description Storage overhead for different RAID levels
 */
export declare const RAID_OVERHEAD: Record<RAIDLevel, number>;
/**
 * @constant HIPAA_RETENTION_REQUIREMENTS
 * @description HIPAA retention periods by data type
 */
export declare const HIPAA_RETENTION_REQUIREMENTS: Record<string, number>;
/**
 * @function createStoragePool
 * @description Creates a new storage pool with specified configuration
 *
 * @param {Partial<StoragePool>} config - Pool configuration
 * @returns {StoragePool} Created storage pool
 *
 * @example
 * ```typescript
 * const pool = createStoragePool({
 *   name: 'medical-imaging',
 *   capacity: 100 * TB,
 *   tier: 'hot',
 *   raidLevel: 'RAID10',
 *   deviceType: 'nvme'
 * });
 * ```
 */
export declare function createStoragePool(config: Partial<StoragePool>): StoragePool;
/**
 * @function createMultiTierPool
 * @description Creates a multi-tier storage pool with automatic tiering
 *
 * @param {Object} config - Multi-tier configuration
 * @returns {StoragePool[]} Array of storage pools for each tier
 *
 * @example
 * ```typescript
 * const pools = createMultiTierPool({
 *   name: 'white-cross-storage',
 *   tiers: [
 *     { type: 'hot', capacity: 20 * TB, deviceType: 'nvme' },
 *     { type: 'warm', capacity: 100 * TB, deviceType: 'ssd' },
 *     { type: 'cold', capacity: 500 * TB, deviceType: 'hdd' }
 *   ]
 * });
 * ```
 */
export declare function createMultiTierPool(config: {
    name: string;
    tiers: Array<{
        type: StorageTier;
        capacity: number;
        deviceType: DeviceType;
        raidLevel?: RAIDLevel;
    }>;
}): StoragePool[];
/**
 * @function calculatePoolCapacity
 * @description Calculates effective pool capacity considering RAID overhead
 *
 * @param {number} rawCapacity - Raw storage capacity in bytes
 * @param {RAIDLevel} raidLevel - RAID configuration
 * @returns {number} Effective capacity after RAID overhead
 *
 * @example
 * ```typescript
 * const effective = calculatePoolCapacity(100 * TB, 'RAID10');
 * // Returns: 50TB (50% overhead for RAID10)
 * ```
 */
export declare function calculatePoolCapacity(rawCapacity: number, raidLevel: RAIDLevel): number;
/**
 * @function getPoolUtilization
 * @description Calculates pool utilization percentage
 *
 * @param {StoragePool} pool - Storage pool
 * @returns {number} Utilization percentage (0-100)
 *
 * @example
 * ```typescript
 * const utilization = getPoolUtilization(pool);
 * if (utilization > 80) {
 *   console.log('Pool is nearing capacity');
 * }
 * ```
 */
export declare function getPoolUtilization(pool: StoragePool): number;
/**
 * @function expandStoragePool
 * @description Expands storage pool capacity
 *
 * @param {StoragePool} pool - Storage pool to expand
 * @param {number} additionalCapacity - Capacity to add in bytes
 * @returns {StoragePool} Updated pool
 *
 * @example
 * ```typescript
 * const expanded = expandStoragePool(pool, 50 * TB);
 * ```
 */
export declare function expandStoragePool(pool: StoragePool, additionalCapacity: number): StoragePool;
/**
 * @function allocateThinVolume
 * @description Allocates a thin-provisioned volume
 *
 * @param {StoragePool} pool - Storage pool
 * @param {AllocationRequest} request - Allocation request
 * @returns {StorageVolume} Allocated volume
 *
 * @example
 * ```typescript
 * const volume = allocateThinVolume(pool, {
 *   name: 'patient-records',
 *   size: 10 * TB,
 *   provisioningType: 'thin',
 *   tenantId: 'hospital-001',
 *   requireHIPAA: true
 * });
 * ```
 */
export declare function allocateThinVolume(pool: StoragePool, request: AllocationRequest): StorageVolume;
/**
 * @function allocateThickVolume
 * @description Allocates a thick-provisioned volume
 *
 * @param {StoragePool} pool - Storage pool
 * @param {AllocationRequest} request - Allocation request
 * @param {boolean} eager - Eager zeroing (true) or lazy zeroing (false)
 * @returns {StorageVolume} Allocated volume
 *
 * @example
 * ```typescript
 * const volume = allocateThickVolume(pool, {
 *   name: 'critical-database',
 *   size: 5 * TB,
 *   provisioningType: 'thick',
 *   tenantId: 'hospital-001'
 * }, true);
 * ```
 */
export declare function allocateThickVolume(pool: StoragePool, request: AllocationRequest, eager?: boolean): StorageVolume;
/**
 * @function calculateOverProvisioningRatio
 * @description Calculates current over-provisioning ratio for a pool
 *
 * @param {StoragePool} pool - Storage pool
 * @param {StorageVolume[]} volumes - Volumes in the pool
 * @returns {number} Over-provisioning ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateOverProvisioningRatio(pool, volumes);
 * console.log(`Over-provisioning: ${((ratio - 1) * 100).toFixed(1)}%`);
 * ```
 */
export declare function calculateOverProvisioningRatio(pool: StoragePool, volumes: StorageVolume[]): number;
/**
 * @function expandThinVolume
 * @description Expands physical allocation for a thin volume
 *
 * @param {StorageVolume} volume - Volume to expand
 * @param {number} additionalSize - Additional physical size needed
 * @returns {StorageVolume} Updated volume
 *
 * @example
 * ```typescript
 * const expanded = expandThinVolume(volume, 1 * TB);
 * ```
 */
export declare function expandThinVolume(volume: StorageVolume, additionalSize: number): StorageVolume;
/**
 * @function getThinProvisioningSavings
 * @description Calculates space savings from thin provisioning
 *
 * @param {StorageVolume[]} volumes - Thin-provisioned volumes
 * @returns {Object} Savings statistics
 *
 * @example
 * ```typescript
 * const savings = getThinProvisioningSavings(volumes);
 * console.log(`Saved ${formatBytes(savings.savedBytes)} (${savings.savingsPercentage}%)`);
 * ```
 */
export declare function getThinProvisioningSavings(volumes: StorageVolume[]): {
    totalVirtual: number;
    totalPhysical: number;
    savedBytes: number;
    savingsPercentage: number;
};
/**
 * @function createTieringPolicy
 * @description Creates an auto-tiering policy
 *
 * @param {Partial<TieringPolicy>} config - Policy configuration
 * @returns {TieringPolicy} Created policy
 *
 * @example
 * ```typescript
 * const policy = createTieringPolicy({
 *   name: 'medical-records-tiering',
 *   hotAccessThreshold: 100,
 *   warmAccessThreshold: 10,
 *   coldAgeThreshold: 90,
 *   archiveAgeThreshold: 365
 * });
 * ```
 */
export declare function createTieringPolicy(config: Partial<TieringPolicy>): TieringPolicy;
/**
 * @function determineOptimalTier
 * @description Determines optimal tier for a volume based on access patterns
 *
 * @param {StorageVolume} volume - Volume to evaluate
 * @param {TieringPolicy} policy - Tiering policy
 * @param {number} accessCount - Recent access count
 * @returns {StorageTier} Recommended tier
 *
 * @example
 * ```typescript
 * const optimalTier = determineOptimalTier(volume, policy, 150);
 * // Returns: 'hot' if access count exceeds hot threshold
 * ```
 */
export declare function determineOptimalTier(volume: StorageVolume, policy: TieringPolicy, accessCount: number): StorageTier;
/**
 * @function createMigrationJob
 * @description Creates a storage migration job
 *
 * @param {StorageVolume} volume - Volume to migrate
 * @param {StorageTier} targetTier - Target tier
 * @returns {MigrationJob} Migration job
 *
 * @example
 * ```typescript
 * const job = createMigrationJob(volume, 'cold');
 * ```
 */
export declare function createMigrationJob(volume: StorageVolume, targetTier: StorageTier): MigrationJob;
/**
 * @function estimateMigrationTime
 * @description Estimates migration time based on volume size and bandwidth
 *
 * @param {number} volumeSize - Volume size in bytes
 * @param {number} bandwidth - Available bandwidth in bytes/sec
 * @returns {number} Estimated time in seconds
 *
 * @example
 * ```typescript
 * const timeSeconds = estimateMigrationTime(5 * TB, 1000 * MB);
 * console.log(`Migration will take ~${Math.floor(timeSeconds / 3600)} hours`);
 * ```
 */
export declare function estimateMigrationTime(volumeSize: number, bandwidth: number): number;
/**
 * @function prioritizeMigrations
 * @description Prioritizes migration jobs based on business rules
 *
 * @param {MigrationJob[]} jobs - Migration jobs
 * @param {StorageVolume[]} volumes - All volumes
 * @returns {MigrationJob[]} Sorted jobs (highest priority first)
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeMigrations(pendingJobs, volumes);
 * ```
 */
export declare function prioritizeMigrations(jobs: MigrationJob[], volumes: StorageVolume[]): MigrationJob[];
/**
 * @function createQoSPolicy
 * @description Creates a Quality of Service policy
 *
 * @param {Partial<QoSPolicy>} config - QoS configuration
 * @returns {QoSPolicy} Created policy
 *
 * @example
 * ```typescript
 * const qos = createQoSPolicy({
 *   name: 'critical-medical-imaging',
 *   minIOPS: 10000,
 *   maxIOPS: 50000,
 *   minBandwidth: 1000 * MB,
 *   maxBandwidth: 5000 * MB,
 *   priority: 10
 * });
 * ```
 */
export declare function createQoSPolicy(config: Partial<QoSPolicy>): QoSPolicy;
/**
 * @function applyQoSPolicy
 * @description Applies QoS policy to a volume
 *
 * @param {StorageVolume} volume - Volume to apply policy to
 * @param {QoSPolicy} policy - QoS policy
 * @returns {StorageVolume} Updated volume
 *
 * @example
 * ```typescript
 * const updated = applyQoSPolicy(volume, qosPolicy);
 * ```
 */
export declare function applyQoSPolicy(volume: StorageVolume, policy: QoSPolicy): StorageVolume;
/**
 * @function validateQoSCompliance
 * @description Validates if current metrics meet QoS policy
 *
 * @param {StorageMetrics} metrics - Current metrics
 * @param {QoSPolicy} policy - QoS policy
 * @returns {Object} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = validateQoSCompliance(metrics, policy);
 * if (!compliance.compliant) {
 *   console.error('QoS violations:', compliance.violations);
 * }
 * ```
 */
export declare function validateQoSCompliance(metrics: StorageMetrics, policy: QoSPolicy): {
    compliant: boolean;
    violations: string[];
};
/**
 * @function forecastCapacity
 * @description Forecasts future capacity needs based on growth trends
 *
 * @param {StoragePool} pool - Storage pool
 * @param {number[]} historicalUsage - Historical usage in bytes (daily samples)
 * @returns {CapacityForecast} Capacity forecast
 *
 * @example
 * ```typescript
 * const forecast = forecastCapacity(pool, last90DaysUsage);
 * if (forecast.daysUntilFull < 30) {
 *   console.log('Expansion needed within 30 days');
 * }
 * ```
 */
export declare function forecastCapacity(pool: StoragePool, historicalUsage: number[]): CapacityForecast;
/**
 * @function calculateLinearGrowthRate
 * @description Calculates linear growth rate from historical data
 *
 * @param {number[]} data - Historical data points
 * @returns {number} Growth rate per period
 *
 * @example
 * ```typescript
 * const dailyGrowth = calculateLinearGrowthRate(last30DaysUsage);
 * ```
 */
export declare function calculateLinearGrowthRate(data: number[]): number;
/**
 * @function recommendPoolExpansion
 * @description Recommends pool expansion based on utilization and forecast
 *
 * @param {StoragePool} pool - Storage pool
 * @param {CapacityForecast} forecast - Capacity forecast
 * @param {number} targetUtilization - Target utilization percentage (default 70%)
 * @returns {Object} Expansion recommendation
 *
 * @example
 * ```typescript
 * const recommendation = recommendPoolExpansion(pool, forecast, 70);
 * if (recommendation.shouldExpand) {
 *   console.log(`Add ${formatBytes(recommendation.recommendedSize)}`);
 * }
 * ```
 */
export declare function recommendPoolExpansion(pool: StoragePool, forecast: CapacityForecast, targetUtilization?: number): {
    shouldExpand: boolean;
    recommendedSize: number;
    reason: string;
};
/**
 * @function enableDeduplication
 * @description Enables deduplication on a storage pool
 *
 * @param {StoragePool} pool - Storage pool
 * @returns {StoragePool} Updated pool
 *
 * @example
 * ```typescript
 * const dedupPool = enableDeduplication(pool);
 * ```
 */
export declare function enableDeduplication(pool: StoragePool): StoragePool;
/**
 * @function enableCompression
 * @description Enables compression on a storage pool
 *
 * @param {StoragePool} pool - Storage pool
 * @returns {StoragePool} Updated pool
 *
 * @example
 * ```typescript
 * const compressedPool = enableCompression(pool);
 * ```
 */
export declare function enableCompression(pool: StoragePool): StoragePool;
/**
 * @function calculateSpaceSavings
 * @description Calculates space savings from deduplication and compression
 *
 * @param {StorageMetrics} metrics - Storage metrics
 * @param {number} physicalSize - Physical size in bytes
 * @returns {Object} Savings calculation
 *
 * @example
 * ```typescript
 * const savings = calculateSpaceSavings(metrics, 10 * TB);
 * console.log(`Total savings: ${formatBytes(savings.totalSaved)}`);
 * ```
 */
export declare function calculateSpaceSavings(metrics: StorageMetrics, physicalSize: number): {
    dedupSaved: number;
    compressSaved: number;
    totalSaved: number;
    effectiveSize: number;
};
/**
 * @function createSnapshot
 * @description Creates a volume snapshot
 *
 * @param {StorageVolume} volume - Source volume
 * @param {SnapshotConfig} config - Snapshot configuration
 * @returns {Object} Snapshot information
 *
 * @example
 * ```typescript
 * const snapshot = createSnapshot(volume, {
 *   name: 'daily-backup',
 *   retentionDays: 30,
 *   type: 'application-consistent'
 * });
 * ```
 */
export declare function createSnapshot(volume: StorageVolume, config: Partial<SnapshotConfig>): {
    id: string;
    volumeId: string;
    name: string;
    size: number;
    createdAt: Date;
    retentionUntil: Date;
};
/**
 * @function cloneVolume
 * @description Creates a clone of an existing volume
 *
 * @param {StorageVolume} sourceVolume - Source volume
 * @param {string} cloneName - Name for the clone
 * @returns {StorageVolume} Cloned volume
 *
 * @example
 * ```typescript
 * const clone = cloneVolume(volume, 'test-environment');
 * ```
 */
export declare function cloneVolume(sourceVolume: StorageVolume, cloneName: string): StorageVolume;
/**
 * @function calculateSnapshotRetention
 * @description Calculates snapshots to retain based on retention policy
 *
 * @param {Array} snapshots - Array of snapshots
 * @param {number} retentionDays - Retention period in days
 * @returns {Object} Retention recommendation
 *
 * @example
 * ```typescript
 * const retention = calculateSnapshotRetention(snapshots, 90);
 * console.log(`Delete ${retention.toDelete.length} old snapshots`);
 * ```
 */
export declare function calculateSnapshotRetention(snapshots: Array<{
    id: string;
    createdAt: Date;
    retentionUntil: Date;
}>, retentionDays: number): {
    toKeep: string[];
    toDelete: string[];
};
/**
 * @function setupReplication
 * @description Configures volume replication
 *
 * @param {StorageVolume} volume - Source volume
 * @param {Partial<ReplicationConfig>} config - Replication configuration
 * @returns {ReplicationConfig} Replication configuration
 *
 * @example
 * ```typescript
 * const replication = setupReplication(volume, {
 *   targetPoolId: 'dr-pool-001',
 *   type: 'asynchronous',
 *   rpo: 300, // 5 minutes
 *   autoFailover: true
 * });
 * ```
 */
export declare function setupReplication(volume: StorageVolume, config: Partial<ReplicationConfig>): ReplicationConfig;
/**
 * @function validateRPOCompliance
 * @description Validates if RPO (Recovery Point Objective) is being met
 *
 * @param {ReplicationConfig} config - Replication configuration
 * @param {Date} lastReplicationTime - Last successful replication
 * @returns {Object} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = validateRPOCompliance(replicationConfig, lastReplicationTime);
 * if (!compliance.compliant) {
 *   console.error('RPO violation!');
 * }
 * ```
 */
export declare function validateRPOCompliance(config: ReplicationConfig, lastReplicationTime: Date): {
    compliant: boolean;
    timeSinceLastReplication: number;
    message: string;
};
/**
 * @function collectStorageMetrics
 * @description Collects current storage metrics
 *
 * @param {string} resourceId - Pool or volume ID
 * @param {string} resourceType - Resource type
 * @returns {StorageMetrics} Current metrics
 *
 * @example
 * ```typescript
 * const metrics = collectStorageMetrics(pool.id, 'pool');
 * ```
 */
export declare function collectStorageMetrics(resourceId: string, resourceType: 'pool' | 'volume'): StorageMetrics;
/**
 * @function calculateAverageMetrics
 * @description Calculates average metrics over a time period
 *
 * @param {StorageMetrics[]} metrics - Array of metrics
 * @returns {StorageMetrics} Averaged metrics
 *
 * @example
 * ```typescript
 * const avgMetrics = calculateAverageMetrics(last24HoursMetrics);
 * ```
 */
export declare function calculateAverageMetrics(metrics: StorageMetrics[]): StorageMetrics;
/**
 * @function createAuditLog
 * @description Creates HIPAA-compliant audit log entry
 *
 * @param {Partial<StorageAuditLog>} entry - Audit log entry
 * @returns {StorageAuditLog} Created log entry
 *
 * @example
 * ```typescript
 * const log = createAuditLog({
 *   action: 'volume_created',
 *   resourceType: 'volume',
 *   resourceId: volume.id,
 *   actor: 'admin@whitecross.com',
 *   result: 'success'
 * });
 * ```
 */
export declare function createAuditLog(entry: Partial<StorageAuditLog>): StorageAuditLog;
/**
 * @function validateHIPAARetention
 * @description Validates volume retention meets HIPAA requirements
 *
 * @param {StorageVolume} volume - Volume to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHIPAARetention(volume);
 * if (!validation.compliant) {
 *   console.error(validation.message);
 * }
 * ```
 */
export declare function validateHIPAARetention(volume: StorageVolume): {
    compliant: boolean;
    requiredDays: number;
    configuredDays: number;
    message: string;
};
/**
 * @function enforceDataRetention
 * @description Enforces data retention policies
 *
 * @param {StorageVolume[]} volumes - Volumes to check
 * @returns {Object} Enforcement results
 *
 * @example
 * ```typescript
 * const enforcement = enforceDataRetention(allVolumes);
 * for (const vid of enforcement.toDelete) {
 *   console.log(`Volume ${vid} can be deleted`);
 * }
 * ```
 */
export declare function enforceDataRetention(volumes: StorageVolume[]): {
    toRetain: string[];
    toDelete: string[];
    warnings: Array<{
        volumeId: string;
        reason: string;
    }>;
};
/**
 * @class StorageProvisioningService
 * @description NestJS service for SAN storage provisioning
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class StorageProvisioningService {
 *   private readonly logger = new Logger(StorageProvisioningService.name);
 *   private pools: Map<string, StoragePool> = new Map();
 *   private volumes: Map<string, StorageVolume> = new Map();
 *
 *   async provisionVolume(request: AllocationRequest): Promise<StorageVolume> {
 *     const pool = this.selectOptimalPool(request);
 *     const volume = allocateThinVolume(pool, request);
 *
 *     this.volumes.set(volume.id, volume);
 *     await this.auditLog('volume_created', volume.id);
 *
 *     return volume;
 *   }
 * }
 * ```
 */
export declare class StorageProvisioningService {
    private readonly logger;
    private pools;
    private volumes;
    private eventEmitter;
    /**
     * Provision a new storage volume
     */
    provisionVolume(request: AllocationRequest): Promise<StorageVolume>;
    /**
     * Select optimal pool for allocation
     */
    private selectOptimalPool;
    /**
     * Get storage metrics
     */
    getMetrics(resourceId: string, resourceType: 'pool' | 'volume'): Promise<StorageMetrics>;
}
/**
 * @function generateStorageId
 * @description Generates unique storage resource ID
 *
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 *
 * @example
 * ```typescript
 * const id = generateStorageId('vol');
 * // Returns: 'vol-1a2b3c4d5e6f'
 * ```
 */
export declare function generateStorageId(prefix: string): string;
/**
 * @function formatBytes
 * @description Formats bytes to human-readable string
 *
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 *
 * @example
 * ```typescript
 * formatBytes(1024 * 1024 * 1024);
 * // Returns: '1.00 GB'
 * ```
 */
export declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * @function parseStorageSize
 * @description Parses human-readable size to bytes
 *
 * @param {string} sizeStr - Size string (e.g., '10TB', '500GB')
 * @returns {number} Size in bytes
 *
 * @example
 * ```typescript
 * const bytes = parseStorageSize('5TB');
 * // Returns: 5497558138880
 * ```
 */
export declare function parseStorageSize(sizeStr: string): number;
/**
 * @function balanceStorageLoad
 * @description Balances storage load across multiple pools
 *
 * @param {StoragePool[]} pools - Storage pools
 * @param {StorageVolume[]} volumes - Volumes to balance
 * @returns {Object} Rebalancing recommendations
 *
 * @example
 * ```typescript
 * const recommendations = balanceStorageLoad(pools, volumes);
 * for (const rec of recommendations.migrations) {
 *   console.log(`Move ${rec.volumeId} to ${rec.targetPoolId}`);
 * }
 * ```
 */
export declare function balanceStorageLoad(pools: StoragePool[], volumes: StorageVolume[]): {
    balanced: boolean;
    utilizationVariance: number;
    migrations: Array<{
        volumeId: string;
        sourcePoolId: string;
        targetPoolId: string;
    }>;
};
/**
 * @function calculateIOPSRequirements
 * @description Calculates IOPS requirements for a workload
 *
 * @param {Object} workload - Workload characteristics
 * @returns {Object} IOPS requirements
 *
 * @example
 * ```typescript
 * const requirements = calculateIOPSRequirements({
 *   workloadType: 'database',
 *   transactionsPerSecond: 1000,
 *   averageIOSize: 8 * KB,
 *   readWriteRatio: 0.7 // 70% reads
 * });
 * ```
 */
export declare function calculateIOPSRequirements(workload: {
    workloadType: 'database' | 'file-server' | 'vdi' | 'medical-imaging' | 'general';
    transactionsPerSecond?: number;
    averageIOSize?: number;
    readWriteRatio?: number;
    simultaneousUsers?: number;
}): {
    minIOPS: number;
    recommendedIOPS: number;
    peakIOPS: number;
    readIOPS: number;
    writeIOPS: number;
};
/**
 * @function validateStorageAllocation
 * @description Validates storage allocation request before provisioning
 *
 * @param {AllocationRequest} request - Allocation request
 * @param {StoragePool[]} pools - Available pools
 * @param {StorageVolume[]} existingVolumes - Existing volumes
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateStorageAllocation(request, pools, volumes);
 * if (!validation.valid) {
 *   console.error('Validation failed:', validation.errors);
 * }
 * ```
 */
export declare function validateStorageAllocation(request: AllocationRequest, pools: StoragePool[], existingVolumes: StorageVolume[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    recommendedPool?: string;
};
/**
 * @function generateStorageReport
 * @description Generates comprehensive storage report
 *
 * @param {StoragePool[]} pools - Storage pools
 * @param {StorageVolume[]} volumes - Volumes
 * @param {StorageMetrics[]} recentMetrics - Recent metrics
 * @returns {Object} Storage report
 *
 * @example
 * ```typescript
 * const report = generateStorageReport(pools, volumes, metrics);
 * console.log(`Total capacity: ${formatBytes(report.totalCapacity)}`);
 * console.log(`Utilization: ${report.utilizationPercentage.toFixed(1)}%`);
 * ```
 */
export declare function generateStorageReport(pools: StoragePool[], volumes: StorageVolume[], recentMetrics: StorageMetrics[]): {
    timestamp: Date;
    totalCapacity: number;
    usedCapacity: number;
    availableCapacity: number;
    utilizationPercentage: number;
    poolCount: number;
    volumeCount: number;
    tierBreakdown: Record<StorageTier, {
        capacity: number;
        used: number;
        volumeCount: number;
    }>;
    provisioningBreakdown: Record<ProvisioningType, {
        count: number;
        totalSize: number;
    }>;
    hipaaCompliantVolumes: number;
    encryptedVolumes: number;
    thinProvisioningSavings: ReturnType<typeof getThinProvisioningSavings>;
    performanceMetrics: {
        avgIOPS: number;
        avgBandwidth: number;
        avgLatency: number;
    };
    recommendations: string[];
};
//# sourceMappingURL=san-storage-provisioning-kit.d.ts.map