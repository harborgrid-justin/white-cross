/**
 * @fileoverview SAN Thin Provisioning Utilities for Healthcare Infrastructure
 * @module reuse/san/san-thin-provisioning-kit
 * @description Advanced thin provisioning utilities for enterprise SAN environments, featuring
 * comprehensive thin pool management, space reclamation (TRIM/UNMAP), over-subscription monitoring,
 * automatic expansion policies, and space efficiency reporting.
 *
 * Key Features:
 * - Thin pool creation and lifecycle management
 * - Space reclamation with TRIM/UNMAP support
 * - Over-subscription ratio monitoring and alerting
 * - Automatic expansion policies with thresholds
 * - Space efficiency reporting and analytics
 * - Zero-page detection and reclamation
 * - Thin volume cloning and snapshots
 * - Capacity forecasting and trending
 * - Real-time space utilization tracking
 * - HIPAA-compliant audit logging
 * - Multi-tenant thin provisioning
 * - Performance-aware expansion
 * - Automated space reclamation scheduling
 * - Block-level deduplication awareness
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant audit logging for all provisioning operations
 * - Secure multi-tenant space isolation
 * - Encrypted thin volume metadata
 * - Access control for expansion policies
 * - Tamper-proof capacity tracking
 * - Role-based thin pool management
 *
 * @example Basic thin pool management
 * ```typescript
 * import {
 *   createThinPool,
 *   allocateThinVolume,
 *   monitorOverSubscription,
 *   reclaimSpace
 * } from './san-thin-provisioning-kit';
 *
 * // Create thin pool
 * const pool = await createThinPool({
 *   name: 'medical-imaging-thin-pool',
 *   physicalCapacity: 50 * TB,
 *   maxOversubscriptionRatio: 3.0,
 *   autoExpand: true,
 *   expansionThreshold: 0.8
 * });
 *
 * // Allocate thin volume
 * const volume = await allocateThinVolume(pool.id, {
 *   name: 'patient-records-thin-vol',
 *   virtualSize: 100 * TB,
 *   initialAllocation: 10 * TB
 * });
 *
 * // Monitor over-subscription
 * const metrics = await monitorOverSubscription(pool.id);
 * console.log(`Current ratio: ${metrics.currentRatio}`);
 * ```
 *
 * @example Advanced space reclamation
 * ```typescript
 * import {
 *   scheduleSpaceReclamation,
 *   performTrimOperation,
 *   reclaimZeroPages,
 *   generateSpaceEfficiencyReport
 * } from './san-thin-provisioning-kit';
 *
 * // Schedule automated TRIM/UNMAP
 * await scheduleSpaceReclamation({
 *   poolId: pool.id,
 *   schedule: 'daily',
 *   time: '02:00',
 *   operations: ['trim', 'unmap', 'zero-page-detection']
 * });
 *
 * // Generate efficiency report
 * const report = await generateSpaceEfficiencyReport(pool.id, {
 *   includeDeduplication: true,
 *   includeCompression: true,
 *   period: '30d'
 * });
 * ```
 */
/**
 * Thin provisioning pool configuration
 */
export interface ThinPool {
    /** Unique pool identifier */
    id: string;
    /** Pool name */
    name: string;
    /** Physical capacity in bytes */
    physicalCapacity: number;
    /** Total allocated virtual capacity in bytes */
    allocatedVirtualCapacity: number;
    /** Actually used physical space in bytes */
    usedPhysicalSpace: number;
    /** Maximum over-subscription ratio allowed */
    maxOversubscriptionRatio: number;
    /** Current over-subscription ratio */
    currentOversubscriptionRatio: number;
    /** Automatic expansion enabled */
    autoExpand: boolean;
    /** Expansion threshold (0.0-1.0) */
    expansionThreshold: number;
    /** Expansion increment in bytes */
    expansionIncrement: number;
    /** Maximum pool size after expansion */
    maxPoolSize?: number;
    /** Space reclamation enabled */
    spaceReclamationEnabled: boolean;
    /** Last reclamation timestamp */
    lastReclamationTime?: Date;
    /** Pool status */
    status: 'active' | 'expanding' | 'full' | 'degraded' | 'offline';
    /** Associated thin volumes */
    thinVolumes: string[];
    /** Storage tier */
    tier: 'hot' | 'warm' | 'cold';
    /** Creation timestamp */
    createdAt: Date;
    /** Last modification timestamp */
    updatedAt: Date;
    /** Tenant ID for multi-tenancy */
    tenantId?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Thin volume definition
 */
export interface ThinVolume {
    /** Unique volume identifier */
    id: string;
    /** Volume name */
    name: string;
    /** Parent thin pool ID */
    poolId: string;
    /** Virtual size presented to host (bytes) */
    virtualSize: number;
    /** Actually allocated physical space (bytes) */
    allocatedSpace: number;
    /** Used space (bytes) */
    usedSpace: number;
    /** Free space in volume (bytes) */
    freeSpace: number;
    /** Space utilization percentage */
    utilizationPercent: number;
    /** Volume status */
    status: 'online' | 'offline' | 'expanding' | 'reclaiming';
    /** TRIM/UNMAP support enabled */
    trimEnabled: boolean;
    /** Zero-page detection enabled */
    zeroPageDetection: boolean;
    /** Deduplication enabled */
    deduplicationEnabled: boolean;
    /** Compression enabled */
    compressionEnabled: boolean;
    /** Parent snapshot ID (if cloned) */
    parentSnapshotId?: string;
    /** Is snapshot */
    isSnapshot: boolean;
    /** Snapshot timestamp */
    snapshotTime?: Date;
    /** LUN mapping information */
    lunMappings: LunMapping[];
    /** Performance tier */
    performanceTier: 'high' | 'medium' | 'low';
    /** Creation timestamp */
    createdAt: Date;
    /** Last modification timestamp */
    updatedAt: Date;
    /** Tenant ID */
    tenantId?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * LUN mapping for thin volumes
 */
export interface LunMapping {
    /** Host or host group ID */
    hostId: string;
    /** LUN number */
    lunNumber: number;
    /** Access mode */
    accessMode: 'read-write' | 'read-only';
    /** Mapping status */
    status: 'active' | 'inactive';
}
/**
 * Over-subscription policy and monitoring
 */
export interface OversubscriptionPolicy {
    /** Policy identifier */
    id: string;
    /** Policy name */
    name: string;
    /** Target pool ID */
    poolId: string;
    /** Maximum allowed over-subscription ratio */
    maxRatio: number;
    /** Warning threshold ratio */
    warningThreshold: number;
    /** Critical threshold ratio */
    criticalThreshold: number;
    /** Alert when thresholds exceeded */
    alertingEnabled: boolean;
    /** Alert recipients */
    alertRecipients: string[];
    /** Action on critical threshold */
    criticalAction: 'alert-only' | 'block-new-allocations' | 'trigger-expansion' | 'emergency-reclaim';
    /** Monitoring interval in seconds */
    monitoringInterval: number;
    /** Enable predictive analytics */
    predictiveMonitoring: boolean;
    /** Policy enabled */
    enabled: boolean;
    /** Creation timestamp */
    createdAt: Date;
    /** Last check timestamp */
    lastCheckTime?: Date;
}
/**
 * Over-subscription metrics
 */
export interface OversubscriptionMetrics {
    /** Pool ID */
    poolId: string;
    /** Current over-subscription ratio */
    currentRatio: number;
    /** Total virtual capacity allocated */
    totalVirtualCapacity: number;
    /** Total physical capacity */
    totalPhysicalCapacity: number;
    /** Used physical space */
    usedPhysicalSpace: number;
    /** Available physical space */
    availablePhysicalSpace: number;
    /** Number of thin volumes */
    volumeCount: number;
    /** Average volume utilization */
    averageVolumeUtilization: number;
    /** Predicted ratio in 7 days */
    predictedRatio7d?: number;
    /** Predicted ratio in 30 days */
    predictedRatio30d?: number;
    /** Risk level */
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    /** Timestamp */
    timestamp: Date;
}
/**
 * Space reclamation configuration
 */
export interface SpaceReclamation {
    /** Reclamation job ID */
    id: string;
    /** Job name */
    name: string;
    /** Target pool or volume ID */
    targetId: string;
    /** Target type */
    targetType: 'pool' | 'volume';
    /** Reclamation operations */
    operations: ReclamationOperation[];
    /** Schedule (cron format or predefined) */
    schedule?: string;
    /** Manual or scheduled */
    mode: 'manual' | 'scheduled' | 'automatic';
    /** Minimum space to reclaim threshold */
    minReclaimThreshold: number;
    /** Maximum runtime in seconds */
    maxRuntime?: number;
    /** I/O priority */
    ioPriority: 'low' | 'medium' | 'high';
    /** Job status */
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    /** Start time */
    startTime?: Date;
    /** End time */
    endTime?: Date;
    /** Space reclaimed in bytes */
    spaceReclaimed?: number;
    /** Error message if failed */
    errorMessage?: string;
    /** Progress percentage */
    progress?: number;
    /** Creation timestamp */
    createdAt: Date;
    /** Last run timestamp */
    lastRunTime?: Date;
    /** Next scheduled run */
    nextRunTime?: Date;
}
/**
 * Reclamation operation types
 */
export type ReclamationOperation = 'trim' | 'unmap' | 'zero-page' | 'duplicate' | 'compress' | 'snapshot-merge';
/**
 * Space reclamation result
 */
export interface ReclamationResult {
    /** Job ID */
    jobId: string;
    /** Target ID */
    targetId: string;
    /** Operations performed */
    operationsPerformed: ReclamationOperation[];
    /** Space reclaimed in bytes */
    spaceReclaimed: number;
    /** Time taken in seconds */
    duration: number;
    /** Blocks processed */
    blocksProcessed: number;
    /** Blocks reclaimed */
    blocksReclaimed: number;
    /** Success status */
    success: boolean;
    /** Detailed results per operation */
    operationResults: OperationResult[];
    /** Completion timestamp */
    completedAt: Date;
}
/**
 * Individual operation result
 */
export interface OperationResult {
    /** Operation type */
    operation: ReclamationOperation;
    /** Space reclaimed in bytes */
    spaceReclaimed: number;
    /** Time taken in seconds */
    duration: number;
    /** Success status */
    success: boolean;
    /** Error message if failed */
    errorMessage?: string;
}
/**
 * Automatic expansion policy
 */
export interface AutoExpansionPolicy {
    /** Policy ID */
    id: string;
    /** Policy name */
    name: string;
    /** Target pool ID */
    poolId: string;
    /** Expansion enabled */
    enabled: boolean;
    /** Trigger threshold (percentage of capacity) */
    triggerThreshold: number;
    /** Expansion increment in bytes */
    expansionIncrement: number;
    /** Expansion increment type */
    incrementType: 'fixed' | 'percentage';
    /** Maximum pool size in bytes */
    maxPoolSize?: number;
    /** Minimum free space to maintain (bytes) */
    minFreeSpace: number;
    /** Allow multiple expansions */
    allowMultipleExpansions: boolean;
    /** Maximum expansions per day */
    maxExpansionsPerDay?: number;
    /** Require approval for expansion */
    requireApproval: boolean;
    /** Approval recipients */
    approvalRecipients?: string[];
    /** Alert on expansion */
    alertOnExpansion: boolean;
    /** Alert recipients */
    alertRecipients: string[];
    /** Pre-expansion validation */
    preExpansionValidation: boolean;
    /** Performance impact assessment */
    performanceImpactCheck: boolean;
    /** Creation timestamp */
    createdAt: Date;
    /** Last expansion time */
    lastExpansionTime?: Date;
    /** Expansion count */
    expansionCount: number;
}
/**
 * Expansion event record
 */
export interface ExpansionEvent {
    /** Event ID */
    id: string;
    /** Pool ID */
    poolId: string;
    /** Policy ID that triggered expansion */
    policyId: string;
    /** Trigger reason */
    triggerReason: string;
    /** Capacity before expansion */
    capacityBefore: number;
    /** Capacity after expansion */
    capacityAfter: number;
    /** Expansion amount */
    expansionAmount: number;
    /** Utilization before expansion */
    utilizationBefore: number;
    /** Utilization after expansion */
    utilizationAfter: number;
    /** Approval required */
    approvalRequired: boolean;
    /** Approved by */
    approvedBy?: string;
    /** Approval timestamp */
    approvalTime?: Date;
    /** Expansion status */
    status: 'pending-approval' | 'approved' | 'in-progress' | 'completed' | 'failed' | 'rejected';
    /** Start time */
    startTime?: Date;
    /** Completion time */
    completionTime?: Date;
    /** Error message if failed */
    errorMessage?: string;
    /** Creation timestamp */
    createdAt: Date;
}
/**
 * Space efficiency report
 */
export interface SpaceEfficiencyReport {
    /** Report ID */
    id: string;
    /** Pool or volume ID */
    targetId: string;
    /** Target type */
    targetType: 'pool' | 'volume';
    /** Report period start */
    periodStart: Date;
    /** Report period end */
    periodEnd: Date;
    /** Physical capacity */
    physicalCapacity: number;
    /** Virtual capacity allocated */
    virtualCapacity: number;
    /** Used physical space */
    usedPhysicalSpace: number;
    /** Over-subscription ratio */
    oversubscriptionRatio: number;
    /** Thin provisioning savings in bytes */
    thinProvisioningSavings: number;
    /** Thin provisioning efficiency percentage */
    thinEfficiencyPercent: number;
    /** Deduplication savings */
    deduplicationSavings?: number;
    /** Deduplication ratio */
    deduplicationRatio?: number;
    /** Compression savings */
    compressionSavings?: number;
    /** Compression ratio */
    compressionRatio?: number;
    /** Zero-page savings */
    zeroPageSavings: number;
    /** Total savings */
    totalSavings: number;
    /** Overall efficiency ratio */
    overallEfficiencyRatio: number;
    /** Space reclaimed in period */
    spaceReclaimedInPeriod: number;
    /** Number of reclamation jobs */
    reclamationJobCount: number;
    /** Volume count (for pools) */
    volumeCount?: number;
    /** Average volume utilization */
    averageVolumeUtilization?: number;
    /** Trend analysis */
    trend: 'improving' | 'stable' | 'degrading';
    /** Recommendations */
    recommendations: string[];
    /** Generation timestamp */
    generatedAt: Date;
}
/**
 * Capacity forecast
 */
export interface CapacityForecast {
    /** Forecast ID */
    id: string;
    /** Pool ID */
    poolId: string;
    /** Current utilization */
    currentUtilization: number;
    /** Forecast period in days */
    forecastPeriod: number;
    /** Predicted utilization at end of period */
    predictedUtilization: number;
    /** Predicted date of capacity exhaustion */
    exhaustionDate?: Date;
    /** Days until exhaustion */
    daysUntilExhaustion?: number;
    /** Growth rate (bytes per day) */
    growthRate: number;
    /** Confidence level */
    confidenceLevel: number;
    /** Forecast method */
    forecastMethod: 'linear' | 'exponential' | 'moving-average' | 'ml-based';
    /** Recommended action */
    recommendedAction?: 'none' | 'monitor' | 'plan-expansion' | 'immediate-expansion';
    /** Generation timestamp */
    generatedAt: Date;
}
/**
 * Creates a new thin provisioning pool
 *
 * @param config Pool configuration
 * @returns Created thin pool
 *
 * @example
 * ```typescript
 * const pool = await createThinPool({
 *   name: 'imaging-thin-pool',
 *   physicalCapacity: 50 * TB,
 *   maxOversubscriptionRatio: 3.0,
 *   autoExpand: true,
 *   expansionThreshold: 0.8,
 *   tier: 'hot'
 * });
 * ```
 */
export declare function createThinPool(config: {
    name: string;
    physicalCapacity: number;
    maxOversubscriptionRatio: number;
    autoExpand?: boolean;
    expansionThreshold?: number;
    expansionIncrement?: number;
    maxPoolSize?: number;
    tier?: 'hot' | 'warm' | 'cold';
    tenantId?: string;
    spaceReclamationEnabled?: boolean;
}): Promise<ThinPool>;
/**
 * Deletes a thin pool after validating it's empty
 *
 * @param poolId Pool identifier
 * @returns Deletion success status
 *
 * @throws Error if pool contains volumes or is not in valid state
 */
export declare function deleteThinPool(poolId: string): Promise<boolean>;
/**
 * Retrieves thin pool information
 *
 * @param poolId Pool identifier
 * @returns Thin pool details
 */
export declare function getThinPool(poolId: string): Promise<ThinPool>;
/**
 * Updates thin pool configuration
 *
 * @param poolId Pool identifier
 * @param updates Configuration updates
 * @returns Updated pool
 */
export declare function updateThinPoolConfig(poolId: string, updates: Partial<Pick<ThinPool, 'maxOversubscriptionRatio' | 'autoExpand' | 'expansionThreshold' | 'expansionIncrement' | 'spaceReclamationEnabled'>>): Promise<ThinPool>;
/**
 * Lists all thin pools with optional filtering
 *
 * @param filter Optional filter criteria
 * @returns Array of thin pools
 */
export declare function listThinPools(filter?: {
    status?: ThinPool['status'];
    tier?: ThinPool['tier'];
    tenantId?: string;
    minCapacity?: number;
    maxCapacity?: number;
}): Promise<ThinPool[]>;
/**
 * Gets real-time thin pool utilization metrics
 *
 * @param poolId Pool identifier
 * @returns Current utilization metrics
 */
export declare function getThinPoolUtilization(poolId: string): Promise<{
    poolId: string;
    physicalUtilization: number;
    virtualAllocation: number;
    oversubscriptionRatio: number;
    freePhysicalSpace: number;
    reclaimableSpace: number;
    volumeCount: number;
    timestamp: Date;
}>;
/**
 * Resizes a thin pool (expand only for safety)
 *
 * @param poolId Pool identifier
 * @param newCapacity New physical capacity in bytes
 * @returns Updated pool
 *
 * @throws Error if new capacity is less than current
 */
export declare function resizeThinPool(poolId: string, newCapacity: number): Promise<ThinPool>;
/**
 * Sets thin pool to maintenance mode (offline)
 *
 * @param poolId Pool identifier
 * @param force Force offline even with active volumes
 * @returns Updated pool
 */
export declare function setThinPoolMaintenance(poolId: string, force?: boolean): Promise<ThinPool>;
/**
 * Allocates a new thin volume from a pool
 *
 * @param poolId Parent pool identifier
 * @param config Volume configuration
 * @returns Created thin volume
 *
 * @example
 * ```typescript
 * const volume = await allocateThinVolume('pool-123', {
 *   name: 'patient-data-vol',
 *   virtualSize: 10 * TB,
 *   initialAllocation: 1 * TB,
 *   trimEnabled: true,
 *   zeroPageDetection: true
 * });
 * ```
 */
export declare function allocateThinVolume(poolId: string, config: {
    name: string;
    virtualSize: number;
    initialAllocation?: number;
    trimEnabled?: boolean;
    zeroPageDetection?: boolean;
    deduplicationEnabled?: boolean;
    compressionEnabled?: boolean;
    performanceTier?: 'high' | 'medium' | 'low';
    tenantId?: string;
}): Promise<ThinVolume>;
/**
 * Deletes a thin volume and reclaims space
 *
 * @param volumeId Volume identifier
 * @param reclaimSpace Whether to immediately reclaim space to pool
 * @returns Deletion success and reclaimed space
 */
export declare function deleteThinVolume(volumeId: string, reclaimSpace?: boolean): Promise<{
    success: boolean;
    spaceReclaimed: number;
}>;
/**
 * Retrieves thin volume information
 *
 * @param volumeId Volume identifier
 * @returns Thin volume details
 */
export declare function getThinVolume(volumeId: string): Promise<ThinVolume>;
/**
 * Updates thin volume properties
 *
 * @param volumeId Volume identifier
 * @param updates Property updates
 * @returns Updated volume
 */
export declare function updateThinVolume(volumeId: string, updates: Partial<Pick<ThinVolume, 'trimEnabled' | 'zeroPageDetection' | 'deduplicationEnabled' | 'compressionEnabled' | 'performanceTier'>>): Promise<ThinVolume>;
/**
 * Expands a thin volume's virtual size
 *
 * @param volumeId Volume identifier
 * @param newVirtualSize New virtual size in bytes
 * @returns Updated volume
 */
export declare function expandThinVolume(volumeId: string, newVirtualSize: number): Promise<ThinVolume>;
/**
 * Creates a thin snapshot of a volume
 *
 * @param volumeId Source volume identifier
 * @param snapshotName Snapshot name
 * @returns Created snapshot volume
 */
export declare function createThinSnapshot(volumeId: string, snapshotName: string): Promise<ThinVolume>;
/**
 * Performs TRIM operation on a thin volume
 *
 * @param volumeId Volume identifier
 * @param priority I/O priority for operation
 * @returns Reclamation result
 *
 * @example
 * ```typescript
 * const result = await performTrimOperation('vol-123', 'low');
 * console.log(`Reclaimed ${result.spaceReclaimed} bytes`);
 * ```
 */
export declare function performTrimOperation(volumeId: string, priority?: 'low' | 'medium' | 'high'): Promise<ReclamationResult>;
/**
 * Performs SCSI UNMAP operation on a thin volume
 *
 * @param volumeId Volume identifier
 * @param priority I/O priority
 * @returns Reclamation result
 */
export declare function performUnmapOperation(volumeId: string, priority?: 'low' | 'medium' | 'high'): Promise<ReclamationResult>;
/**
 * Detects and reclaims zero-filled pages in a thin volume
 *
 * @param volumeId Volume identifier
 * @returns Reclamation result
 */
export declare function reclaimZeroPages(volumeId: string): Promise<ReclamationResult>;
/**
 * Performs comprehensive space reclamation on a pool
 *
 * @param poolId Pool identifier
 * @param operations Operations to perform
 * @param priority I/O priority
 * @returns Aggregate reclamation result
 */
export declare function reclaimPoolSpace(poolId: string, operations?: ReclamationOperation[], priority?: 'low' | 'medium' | 'high'): Promise<ReclamationResult>;
/**
 * Schedules automatic space reclamation for a pool or volume
 *
 * @param config Reclamation schedule configuration
 * @returns Created reclamation schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleSpaceReclamation({
 *   targetId: 'pool-123',
 *   targetType: 'pool',
 *   schedule: 'daily',
 *   time: '02:00',
 *   operations: ['trim', 'unmap', 'zero-page']
 * });
 * ```
 */
export declare function scheduleSpaceReclamation(config: {
    targetId: string;
    targetType: 'pool' | 'volume';
    schedule: string;
    time?: string;
    operations: ReclamationOperation[];
    minReclaimThreshold?: number;
    ioPriority?: 'low' | 'medium' | 'high';
}): Promise<SpaceReclamation>;
/**
 * Cancels a scheduled space reclamation job
 *
 * @param reclamationId Reclamation job identifier
 * @returns Cancellation success
 */
export declare function cancelSpaceReclamation(reclamationId: string): Promise<boolean>;
/**
 * Creates an over-subscription monitoring policy
 *
 * @param config Policy configuration
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createOversubscriptionPolicy({
 *   poolId: 'pool-123',
 *   maxRatio: 3.0,
 *   warningThreshold: 2.5,
 *   criticalThreshold: 2.8,
 *   alertingEnabled: true,
 *   criticalAction: 'trigger-expansion'
 * });
 * ```
 */
export declare function createOversubscriptionPolicy(config: {
    name: string;
    poolId: string;
    maxRatio: number;
    warningThreshold: number;
    criticalThreshold: number;
    alertingEnabled?: boolean;
    alertRecipients?: string[];
    criticalAction?: OversubscriptionPolicy['criticalAction'];
    monitoringInterval?: number;
    predictiveMonitoring?: boolean;
}): Promise<OversubscriptionPolicy>;
/**
 * Monitors over-subscription ratio for a pool
 *
 * @param poolId Pool identifier
 * @returns Current over-subscription metrics
 */
export declare function monitorOverSubscription(poolId: string): Promise<OversubscriptionMetrics>;
/**
 * Checks if over-subscription thresholds are exceeded
 *
 * @param poolId Pool identifier
 * @param policyId Policy identifier
 * @returns Threshold violation details
 */
export declare function checkOversubscriptionThresholds(poolId: string, policyId: string): Promise<{
    violated: boolean;
    level: 'none' | 'warning' | 'critical';
    currentRatio: number;
    threshold: number;
    action: string;
}>;
/**
 * Retrieves over-subscription policy
 *
 * @param policyId Policy identifier
 * @returns Policy details
 */
export declare function getOversubscriptionPolicy(policyId: string): Promise<OversubscriptionPolicy>;
/**
 * Updates over-subscription policy
 *
 * @param policyId Policy identifier
 * @param updates Policy updates
 * @returns Updated policy
 */
export declare function updateOversubscriptionPolicy(policyId: string, updates: Partial<Pick<OversubscriptionPolicy, 'maxRatio' | 'warningThreshold' | 'criticalThreshold' | 'alertingEnabled' | 'criticalAction' | 'enabled'>>): Promise<OversubscriptionPolicy>;
/**
 * Gets historical over-subscription trend data
 *
 * @param poolId Pool identifier
 * @param period Period in days
 * @returns Trend data points
 */
export declare function getOversubscriptionTrend(poolId: string, period?: number): Promise<Array<{
    timestamp: Date;
    ratio: number;
    usedSpace: number;
}>>;
/**
 * Calculates predictive over-subscription forecast
 *
 * @param poolId Pool identifier
 * @param forecastDays Days to forecast
 * @returns Forecast data
 */
export declare function forecastOverSubscription(poolId: string, forecastDays?: number): Promise<{
    currentRatio: number;
    predictedRatio: number;
    forecastDate: Date;
    exceedsMaxRatio: boolean;
    daysUntilMaxRatio?: number;
    confidenceLevel: number;
}>;
/**
 * Lists all over-subscription policies
 *
 * @param filter Optional filter criteria
 * @returns Array of policies
 */
export declare function listOversubscriptionPolicies(filter?: {
    poolId?: string;
    enabled?: boolean;
}): Promise<OversubscriptionPolicy[]>;
/**
 * Creates an automatic expansion policy for a thin pool
 *
 * @param config Expansion policy configuration
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createAutoExpansionPolicy({
 *   poolId: 'pool-123',
 *   triggerThreshold: 0.8,
 *   expansionIncrement: 10 * TB,
 *   incrementType: 'fixed',
 *   maxPoolSize: 200 * TB,
 *   alertOnExpansion: true
 * });
 * ```
 */
export declare function createAutoExpansionPolicy(config: {
    name: string;
    poolId: string;
    triggerThreshold: number;
    expansionIncrement: number;
    incrementType?: 'fixed' | 'percentage';
    maxPoolSize?: number;
    minFreeSpace?: number;
    requireApproval?: boolean;
    approvalRecipients?: string[];
    alertOnExpansion?: boolean;
    alertRecipients?: string[];
}): Promise<AutoExpansionPolicy>;
/**
 * Evaluates if automatic expansion should be triggered
 *
 * @param poolId Pool identifier
 * @param policyId Policy identifier
 * @returns Evaluation result and recommendation
 */
export declare function evaluateExpansionTrigger(poolId: string, policyId: string): Promise<{
    shouldExpand: boolean;
    reason: string;
    currentUtilization: number;
    threshold: number;
    recommendedExpansion: number;
    requiresApproval: boolean;
}>;
/**
 * Executes automatic pool expansion
 *
 * @param poolId Pool identifier
 * @param policyId Policy identifier
 * @param approvedBy Optional approver (required if approval needed)
 * @returns Expansion event
 */
export declare function executeAutoExpansion(poolId: string, policyId: string, approvedBy?: string): Promise<ExpansionEvent>;
/**
 * Retrieves auto-expansion policy
 *
 * @param policyId Policy identifier
 * @returns Policy details
 */
export declare function getAutoExpansionPolicy(policyId: string): Promise<AutoExpansionPolicy>;
/**
 * Updates auto-expansion policy
 *
 * @param policyId Policy identifier
 * @param updates Policy updates
 * @returns Updated policy
 */
export declare function updateAutoExpansionPolicy(policyId: string, updates: Partial<Pick<AutoExpansionPolicy, 'enabled' | 'triggerThreshold' | 'expansionIncrement' | 'maxPoolSize' | 'requireApproval'>>): Promise<AutoExpansionPolicy>;
/**
 * Lists all expansion events for a pool
 *
 * @param poolId Pool identifier
 * @param limit Maximum number of events to return
 * @returns Array of expansion events
 */
export declare function listExpansionEvents(poolId: string, limit?: number): Promise<ExpansionEvent[]>;
/**
 * Approves a pending expansion event
 *
 * @param eventId Expansion event identifier
 * @param approvedBy Approver identifier
 * @returns Updated event
 */
export declare function approveExpansion(eventId: string, approvedBy: string): Promise<ExpansionEvent>;
/**
 * Generates comprehensive space efficiency report for a pool
 *
 * @param poolId Pool identifier
 * @param options Report options
 * @returns Space efficiency report
 *
 * @example
 * ```typescript
 * const report = await generateSpaceEfficiencyReport('pool-123', {
 *   includeDeduplication: true,
 *   includeCompression: true,
 *   period: '30d'
 * });
 * console.log(`Total savings: ${report.totalSavings} bytes`);
 * console.log(`Efficiency ratio: ${report.overallEfficiencyRatio}`);
 * ```
 */
export declare function generateSpaceEfficiencyReport(poolId: string, options?: {
    includeDeduplication?: boolean;
    includeCompression?: boolean;
    period?: string;
}): Promise<SpaceEfficiencyReport>;
/**
 * Generates space efficiency report for a specific volume
 *
 * @param volumeId Volume identifier
 * @returns Volume efficiency report
 */
export declare function generateVolumeEfficiencyReport(volumeId: string): Promise<SpaceEfficiencyReport>;
/**
 * Calculates thin provisioning savings across all pools
 *
 * @returns Aggregate savings summary
 */
export declare function calculateTotalThinSavings(): Promise<{
    totalPhysicalCapacity: number;
    totalVirtualCapacity: number;
    totalUsedSpace: number;
    totalSavings: number;
    averageEfficiency: number;
    poolCount: number;
    volumeCount: number;
}>;
/**
 * Compares efficiency across multiple pools
 *
 * @param poolIds Array of pool identifiers
 * @returns Comparative efficiency data
 */
export declare function comparePoolEfficiency(poolIds: string[]): Promise<Array<{
    poolId: string;
    poolName: string;
    thinEfficiency: number;
    oversubscriptionRatio: number;
    utilizationPercent: number;
    totalSavings: number;
    rank: number;
}>>;
/**
 * Generates capacity forecast for a pool
 *
 * @param poolId Pool identifier
 * @param forecastDays Days to forecast
 * @returns Capacity forecast
 */
export declare function generateCapacityForecast(poolId: string, forecastDays?: number): Promise<CapacityForecast>;
/**
 * Tracks space reclamation history for a pool
 *
 * @param poolId Pool identifier
 * @param period Period in days
 * @returns Reclamation history summary
 */
export declare function getSpaceReclamationHistory(poolId: string, period?: number): Promise<{
    poolId: string;
    period: number;
    totalJobsRun: number;
    totalSpaceReclaimed: number;
    averageSpacePerJob: number;
    largestReclamation: number;
    reclaimationsByType: Record<ReclamationOperation, number>;
    successRate: number;
}>;
/**
 * Exports space efficiency report to various formats
 *
 * @param reportId Report identifier
 * @param format Export format
 * @returns Exported report data
 */
export declare function exportEfficiencyReport(reportId: string, format: 'json' | 'csv' | 'pdf'): Promise<string>;
/**
 * Generates efficiency trend analysis over time
 *
 * @param poolId Pool identifier
 * @param period Period in days
 * @returns Trend analysis
 */
export declare function analyzeEfficiencyTrend(poolId: string, period?: number): Promise<{
    poolId: string;
    periodDays: number;
    startEfficiency: number;
    endEfficiency: number;
    averageEfficiency: number;
    trend: 'improving' | 'stable' | 'degrading';
    changePercent: number;
    dataPoints: Array<{
        date: Date;
        efficiency: number;
    }>;
}>;
/** 1 Terabyte in bytes */
export declare const TB: number;
/** 1 Gigabyte in bytes */
export declare const GB: number;
/** 1 Megabyte in bytes */
export declare const MB: number;
/** Default thin provisioning over-subscription ratio */
export declare const DEFAULT_OVERSUBSCRIPTION_RATIO = 2.5;
/** Default expansion threshold (80% utilization) */
export declare const DEFAULT_EXPANSION_THRESHOLD = 0.8;
/** Default minimum free space (1TB) */
export declare const DEFAULT_MIN_FREE_SPACE: number;
/** Default space reclamation interval (daily) */
export declare const DEFAULT_RECLAMATION_INTERVAL = "daily";
//# sourceMappingURL=san-thin-provisioning-kit.d.ts.map