/**
 * SAN Quality of Service and Throttling Kit
 *
 * Comprehensive set of reusable functions for managing Storage Area Network Quality of Service,
 * IOPS throttling, bandwidth control, priority queuing, fair scheduling, workload isolation,
 * and performance SLA enforcement.
 *
 * @module san-qos-throttling-kit
 */
/**
 * QoS priority levels
 */
export declare enum QoSPriority {
    Critical = "critical",// Highest priority - mission critical workloads
    High = "high",// High priority - production workloads
    Medium = "medium",// Medium priority - standard workloads
    Low = "low",// Low priority - background tasks
    BestEffort = "best-effort"
}
/**
 * Throttle state for tracking enforcement
 */
export declare enum ThrottleState {
    Normal = "normal",// Within limits
    Warning = "warning",// Approaching limits (80-95%)
    Throttled = "throttled",// Limits exceeded, throttling active
    Suspended = "suspended",// Temporarily suspended
    Disabled = "disabled"
}
/**
 * SLA compliance status
 */
export declare enum SLAStatus {
    Compliant = "compliant",// Meeting SLA targets
    AtRisk = "at-risk",// Close to violation
    Violated = "violated",// SLA violated
    Unknown = "unknown"
}
/**
 * Workload classification types
 */
export declare enum WorkloadType {
    OLTP = "oltp",// Online Transaction Processing
    Analytics = "analytics",// Analytical/reporting workloads
    Batch = "batch",// Batch processing
    Backup = "backup",// Backup operations
    Replication = "replication",// Replication traffic
    Custom = "custom"
}
/**
 * IO operation types
 */
export declare enum IOType {
    Read = "read",
    Write = "write",
    ReadWrite = "read-write"
}
/**
 * Scheduling algorithm types
 */
export declare enum SchedulingAlgorithm {
    FIFO = "fifo",// First In First Out
    RoundRobin = "round-robin",// Round robin scheduling
    WeightedFairQueuing = "wfq",// Weighted Fair Queuing
    PriorityBased = "priority",// Priority-based scheduling
    DeadlineMonotonic = "deadline"
}
/**
 * IOPS limit configuration
 */
export interface IOPSLimit {
    readonly maxReadIOPS: number;
    readonly maxWriteIOPS: number;
    readonly maxTotalIOPS: number;
    readonly burstIOPS?: number;
    readonly burstDuration?: number;
    readonly blockSize: number;
}
/**
 * Bandwidth limit configuration (in bytes per second)
 */
export interface BandwidthLimit {
    readonly maxReadBandwidth: number;
    readonly maxWriteBandwidth: number;
    readonly maxTotalBandwidth: number;
    readonly burstBandwidth?: number;
    readonly burstDuration?: number;
}
/**
 * QoS Policy configuration
 */
export interface QoSPolicy {
    readonly policyId: string;
    readonly policyName: string;
    readonly priority: QoSPriority;
    readonly iopsLimit?: IOPSLimit;
    readonly bandwidthLimit?: BandwidthLimit;
    readonly latencyTarget?: number;
    readonly enabled: boolean;
    readonly volumeIds: string[];
    readonly workloadType: WorkloadType;
    readonly createdAt: Date;
    readonly lastModified: Date;
    readonly description?: string;
}
/**
 * Current IOPS usage metrics
 */
export interface IOPSUsage {
    readonly volumeId: string;
    readonly currentReadIOPS: number;
    readonly currentWriteIOPS: number;
    readonly currentTotalIOPS: number;
    readonly peakReadIOPS: number;
    readonly peakWriteIOPS: number;
    readonly peakTotalIOPS: number;
    readonly timestamp: Date;
    readonly intervalSeconds: number;
}
/**
 * Current bandwidth usage metrics
 */
export interface BandwidthUsage {
    readonly volumeId: string;
    readonly currentReadBandwidth: number;
    readonly currentWriteBandwidth: number;
    readonly currentTotalBandwidth: number;
    readonly peakReadBandwidth: number;
    readonly peakWriteBandwidth: number;
    readonly peakTotalBandwidth: number;
    readonly timestamp: Date;
    readonly intervalSeconds: number;
}
/**
 * Throttle enforcement result
 */
export interface ThrottleResult {
    readonly allowed: boolean;
    readonly throttleState: ThrottleState;
    readonly delayMs?: number;
    readonly remainingQuota: number;
    readonly message?: string;
}
/**
 * Priority queue entry
 */
export interface QueuedIO {
    readonly ioId: string;
    readonly volumeId: string;
    readonly ioType: IOType;
    readonly priority: QoSPriority;
    readonly sizeBytes: number;
    readonly enqueuedAt: Date;
    readonly deadline?: Date;
    readonly metadata?: Record<string, unknown>;
}
/**
 * Priority queue configuration
 */
export interface PriorityQueue {
    readonly queueId: string;
    readonly maxQueueDepth: number;
    readonly algorithm: SchedulingAlgorithm;
    readonly entries: QueuedIO[];
    readonly currentDepth: number;
    readonly totalEnqueued: bigint;
    readonly totalDequeued: bigint;
    readonly droppedIOs: bigint;
    readonly createdAt: Date;
}
/**
 * Fair scheduler configuration
 */
export interface FairScheduler {
    readonly schedulerId: string;
    readonly algorithm: SchedulingAlgorithm;
    readonly workloadWeights: Map<string, number>;
    readonly activeWorkloads: string[];
    readonly schedulingQuantum: number;
    readonly createdAt: Date;
    readonly lastScheduled: Date;
}
/**
 * Workload class for isolation
 */
export interface WorkloadClass {
    readonly classId: string;
    readonly className: string;
    readonly workloadType: WorkloadType;
    readonly priority: QoSPriority;
    readonly reservedIOPS?: number;
    readonly reservedBandwidth?: number;
    readonly maxIOPS?: number;
    readonly maxBandwidth?: number;
    readonly volumeIds: string[];
    readonly isolationEnabled: boolean;
    readonly createdAt: Date;
}
/**
 * SLA target definition
 */
export interface SLATarget {
    readonly slaId: string;
    readonly slaName: string;
    readonly volumeIds: string[];
    readonly minIOPS?: number;
    readonly minBandwidth?: number;
    readonly maxLatency?: number;
    readonly availability?: number;
    readonly complianceWindow: number;
    readonly createdAt: Date;
}
/**
 * SLA metrics
 */
export interface SLAMetrics {
    readonly slaId: string;
    readonly volumeId: string;
    readonly actualIOPS: number;
    readonly actualBandwidth: number;
    readonly actualLatency: number;
    readonly actualAvailability: number;
    readonly complianceScore: number;
    readonly status: SLAStatus;
    readonly measurementStart: Date;
    readonly measurementEnd: Date;
}
/**
 * SLA violation record
 */
export interface SLAViolation {
    readonly violationId: string;
    readonly slaId: string;
    readonly volumeId: string;
    readonly violationType: 'iops' | 'bandwidth' | 'latency' | 'availability';
    readonly targetValue: number;
    readonly actualValue: number;
    readonly deviation: number;
    readonly detectedAt: Date;
    readonly resolvedAt?: Date;
    readonly severity: 'minor' | 'major' | 'critical';
    readonly description: string;
}
/**
 * Workload metrics
 */
export interface WorkloadMetrics {
    readonly classId: string;
    readonly volumeCount: number;
    readonly currentIOPS: number;
    readonly currentBandwidth: number;
    readonly avgLatency: number;
    readonly queueDepth: number;
    readonly utilizationPercent: number;
    readonly timestamp: Date;
}
/**
 * QoS statistics
 */
export interface QoSStatistics {
    readonly policyId: string;
    readonly enforcementCount: bigint;
    readonly throttleCount: bigint;
    readonly throttlePercentage: number;
    readonly avgEnforcementTimeMs: number;
    readonly violationCount: bigint;
    readonly lastEnforced: Date;
}
/**
 * Scheduling statistics
 */
export interface SchedulingStatistics {
    readonly schedulerId: string;
    readonly totalScheduled: bigint;
    readonly avgSchedulingTimeMs: number;
    readonly workloadDistribution: Map<string, number>;
    readonly fairnessScore: number;
    readonly timestamp: Date;
}
/**
 * Result type for operations that can fail
 */
export type QoSResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
    code?: string;
};
/**
 * Policy filter criteria
 */
export interface PolicyFilter {
    readonly priority?: QoSPriority;
    readonly workloadType?: WorkloadType;
    readonly enabled?: boolean;
    readonly volumeId?: string;
}
/**
 * Time series data point
 */
export interface TimeSeriesPoint {
    readonly timestamp: Date;
    readonly value: number;
}
/**
 * Creates a new QoS policy
 *
 * @param policyName - Name of the policy
 * @param priority - QoS priority level
 * @param workloadType - Type of workload
 * @param volumeIds - Volume IDs to apply policy to
 * @param options - Optional policy configuration
 * @returns New QoS policy
 *
 * @example
 * ```typescript
 * const policy = createQoSPolicy(
 *   'Production-DB-Policy',
 *   QoSPriority.High,
 *   WorkloadType.OLTP,
 *   ['vol-001', 'vol-002'],
 *   {
 *     iopsLimit: { maxReadIOPS: 10000, maxWriteIOPS: 5000, maxTotalIOPS: 12000, blockSize: 4096 },
 *     latencyTarget: 10
 *   }
 * );
 * ```
 */
export declare function createQoSPolicy(policyName: string, priority: QoSPriority, workloadType: WorkloadType, volumeIds: string[], options?: {
    iopsLimit?: IOPSLimit;
    bandwidthLimit?: BandwidthLimit;
    latencyTarget?: number;
    description?: string;
}): QoSPolicy;
/**
 * Updates an existing QoS policy
 *
 * @param policy - Policy to update
 * @param updates - Updates to apply
 * @returns Updated policy
 */
export declare function updateQoSPolicy(policy: QoSPolicy, updates: Partial<Omit<QoSPolicy, 'policyId' | 'createdAt'>>): QoSPolicy;
/**
 * Validates a QoS policy configuration
 *
 * @param policy - Policy to validate
 * @returns Validation result with any errors
 */
export declare function validateQoSPolicy(policy: QoSPolicy): QoSResult<boolean>;
/**
 * Applies a QoS policy to specified volumes
 *
 * @param policy - Policy to apply
 * @param additionalVolumeIds - Additional volume IDs to apply policy to
 * @returns Updated policy with additional volumes
 */
export declare function applyQoSPolicy(policy: QoSPolicy, additionalVolumeIds: string[]): QoSPolicy;
/**
 * Revokes a QoS policy from specified volumes
 *
 * @param policy - Policy to revoke from
 * @param volumeIds - Volume IDs to remove from policy
 * @returns Updated policy without specified volumes
 */
export declare function revokeQoSPolicy(policy: QoSPolicy, volumeIds: string[]): QoSPolicy;
/**
 * Merges multiple QoS policies into a single policy
 *
 * @param policies - Policies to merge
 * @param mergedName - Name for merged policy
 * @returns Merged policy with combined settings
 */
export declare function mergeQoSPolicies(policies: QoSPolicy[], mergedName: string): QoSPolicy;
/**
 * Gets the current status of a QoS policy
 *
 * @param policy - Policy to check status of
 * @param currentUsage - Current usage metrics
 * @returns Policy status information
 */
export declare function getQoSPolicyStatus(policy: QoSPolicy, currentUsage: IOPSUsage | BandwidthUsage): {
    enabled: boolean;
    utilizationPercent: number;
    state: ThrottleState;
    withinLimits: boolean;
};
/**
 * Exports a QoS policy to a portable format
 *
 * @param policy - Policy to export
 * @returns JSON string representation of policy
 */
export declare function exportQoSPolicy(policy: QoSPolicy): string;
/**
 * Creates an IOPS limit configuration
 *
 * @param maxReadIOPS - Maximum read IOPS
 * @param maxWriteIOPS - Maximum write IOPS
 * @param blockSize - Block size in bytes
 * @param options - Optional burst configuration
 * @returns IOPS limit configuration
 */
export declare function createIOPSLimit(maxReadIOPS: number, maxWriteIOPS: number, blockSize?: number, options?: {
    burstIOPS?: number;
    burstDuration?: number;
}): IOPSLimit;
/**
 * Enforces IOPS limits and determines if IO should be throttled
 *
 * @param limit - IOPS limit configuration
 * @param currentUsage - Current IOPS usage
 * @param ioType - Type of IO operation
 * @returns Throttle enforcement result
 */
export declare function enforceIOPSLimit(limit: IOPSLimit, currentUsage: IOPSUsage, ioType: IOType): ThrottleResult;
/**
 * Calculates current IOPS usage from IO operations
 *
 * @param volumeId - Volume ID
 * @param ioOperations - Number of IO operations in the interval
 * @param intervalSeconds - Time interval for measurement
 * @param readWriteRatio - Ratio of reads to writes (0-1)
 * @returns IOPS usage metrics
 */
export declare function calculateIOPSUsage(volumeId: string, ioOperations: number, intervalSeconds: number, readWriteRatio?: number): IOPSUsage;
/**
 * Adjusts IOPS limits dynamically based on workload
 *
 * @param currentLimit - Current IOPS limit
 * @param adjustmentFactor - Adjustment factor (0.5 = 50% decrease, 2.0 = 100% increase)
 * @returns Adjusted IOPS limit
 */
export declare function adjustIOPSLimit(currentLimit: IOPSLimit, adjustmentFactor: number): IOPSLimit;
/**
 * Gets IOPS statistics over time
 *
 * @param usageHistory - Historical IOPS usage data
 * @param limit - IOPS limit configuration
 * @returns IOPS statistics
 */
export declare function getIOPSStatistics(usageHistory: IOPSUsage[], limit: IOPSLimit): {
    avgIOPS: number;
    peakIOPS: number;
    minIOPS: number;
    utilizationPercent: number;
    throttleEvents: number;
};
/**
 * Resets IOPS counters for a fresh measurement period
 *
 * @param volumeId - Volume ID
 * @returns Reset IOPS usage metrics
 */
export declare function resetIOPSCounters(volumeId: string): IOPSUsage;
/**
 * Creates a bandwidth limit configuration
 *
 * @param maxReadBandwidth - Maximum read bandwidth (bytes/sec)
 * @param maxWriteBandwidth - Maximum write bandwidth (bytes/sec)
 * @param options - Optional burst configuration
 * @returns Bandwidth limit configuration
 */
export declare function createBandwidthLimit(maxReadBandwidth: number, maxWriteBandwidth: number, options?: {
    burstBandwidth?: number;
    burstDuration?: number;
}): BandwidthLimit;
/**
 * Enforces bandwidth limits and determines if IO should be throttled
 *
 * @param limit - Bandwidth limit configuration
 * @param currentUsage - Current bandwidth usage
 * @param ioType - Type of IO operation
 * @returns Throttle enforcement result
 */
export declare function enforceBandwidthLimit(limit: BandwidthLimit, currentUsage: BandwidthUsage, ioType: IOType): ThrottleResult;
/**
 * Calculates current bandwidth usage from IO operations
 *
 * @param volumeId - Volume ID
 * @param bytesTransferred - Total bytes transferred in the interval
 * @param intervalSeconds - Time interval for measurement
 * @param readWriteRatio - Ratio of reads to writes (0-1)
 * @returns Bandwidth usage metrics
 */
export declare function calculateBandwidthUsage(volumeId: string, bytesTransferred: number, intervalSeconds: number, readWriteRatio?: number): BandwidthUsage;
/**
 * Adjusts bandwidth limits dynamically based on workload
 *
 * @param currentLimit - Current bandwidth limit
 * @param adjustmentFactor - Adjustment factor (0.5 = 50% decrease, 2.0 = 100% increase)
 * @returns Adjusted bandwidth limit
 */
export declare function adjustBandwidthLimit(currentLimit: BandwidthLimit, adjustmentFactor: number): BandwidthLimit;
/**
 * Gets bandwidth statistics over time
 *
 * @param usageHistory - Historical bandwidth usage data
 * @param limit - Bandwidth limit configuration
 * @returns Bandwidth statistics
 */
export declare function getBandwidthStatistics(usageHistory: BandwidthUsage[], limit: BandwidthLimit): {
    avgBandwidth: number;
    peakBandwidth: number;
    minBandwidth: number;
    utilizationPercent: number;
    throttleEvents: number;
};
/**
 * Resets bandwidth counters for a fresh measurement period
 *
 * @param volumeId - Volume ID
 * @returns Reset bandwidth usage metrics
 */
export declare function resetBandwidthCounters(volumeId: string): BandwidthUsage;
/**
 * Creates a priority queue for IO operations
 *
 * @param maxQueueDepth - Maximum number of queued IOs
 * @param algorithm - Scheduling algorithm to use
 * @returns New priority queue
 */
export declare function createPriorityQueue(maxQueueDepth: number, algorithm?: SchedulingAlgorithm): PriorityQueue;
/**
 * Enqueues an IO operation with priority
 *
 * @param queue - Priority queue
 * @param io - IO operation to enqueue
 * @returns Updated queue with enqueued IO
 */
export declare function enqueueIO(queue: PriorityQueue, io: QueuedIO): QoSResult<PriorityQueue>;
/**
 * Dequeues the next IO operation based on scheduling algorithm
 *
 * @param queue - Priority queue
 * @returns Result containing dequeued IO and updated queue
 */
export declare function dequeueIO(queue: PriorityQueue): QoSResult<{
    io: QueuedIO;
    queue: PriorityQueue;
}>;
/**
 * Reorders queue based on priority changes
 *
 * @param queue - Priority queue
 * @param ioId - IO operation ID to reprioritize
 * @param newPriority - New priority level
 * @returns Updated queue with reordered entries
 */
export declare function reorderQueue(queue: PriorityQueue, ioId: string, newPriority: QoSPriority): PriorityQueue;
/**
 * Gets statistics for a priority queue
 *
 * @param queue - Priority queue
 * @returns Queue statistics
 */
export declare function getPriorityStatistics(queue: PriorityQueue): {
    currentDepth: number;
    utilizationPercent: number;
    totalProcessed: bigint;
    dropRate: number;
    avgWaitTimeMs: number;
    priorityDistribution: Map<QoSPriority, number>;
};
/**
 * Clears all entries from a priority queue
 *
 * @param queue - Priority queue to clear
 * @returns Cleared queue
 */
export declare function clearPriorityQueue(queue: PriorityQueue): PriorityQueue;
/**
 * Creates a fair scheduler for workload balancing
 *
 * @param algorithm - Scheduling algorithm
 * @param workloadWeights - Initial workload weights (higher = more resources)
 * @param schedulingQuantum - Time quantum in milliseconds
 * @returns New fair scheduler
 */
export declare function createFairScheduler(algorithm: SchedulingAlgorithm, workloadWeights: Map<string, number>, schedulingQuantum?: number): FairScheduler;
/**
 * Schedules the next IO operation using fair scheduling algorithm
 *
 * @param scheduler - Fair scheduler
 * @param pendingIOs - Map of workload ID to pending IOs
 * @returns Result containing selected IO and workload ID
 */
export declare function scheduleNextIO(scheduler: FairScheduler, pendingIOs: Map<string, QueuedIO[]>): QoSResult<{
    workloadId: string;
    io: QueuedIO;
}>;
/**
 * Balances workloads based on current utilization
 *
 * @param scheduler - Fair scheduler
 * @param workloadMetrics - Current metrics for each workload
 * @returns Updated scheduler with rebalanced weights
 */
export declare function balanceWorkloads(scheduler: FairScheduler, workloadMetrics: Map<string, WorkloadMetrics>): FairScheduler;
/**
 * Gets scheduling statistics
 *
 * @param scheduler - Fair scheduler
 * @param completedIOs - Map of workload ID to number of completed IOs
 * @returns Scheduling statistics
 */
export declare function getSchedulerStatistics(scheduler: FairScheduler, completedIOs: Map<string, bigint>): SchedulingStatistics;
/**
 * Creates a workload class for resource isolation
 *
 * @param className - Name of workload class
 * @param workloadType - Type of workload
 * @param priority - QoS priority
 * @param volumeIds - Volumes in this workload class
 * @param options - Optional resource guarantees and limits
 * @returns New workload class
 */
export declare function createWorkloadClass(className: string, workloadType: WorkloadType, priority: QoSPriority, volumeIds: string[], options?: {
    reservedIOPS?: number;
    reservedBandwidth?: number;
    maxIOPS?: number;
    maxBandwidth?: number;
}): WorkloadClass;
/**
 * Assigns a volume to a workload class
 *
 * @param workloadClass - Workload class to assign to
 * @param volumeId - Volume ID to assign
 * @returns Updated workload class
 */
export declare function assignVolumeToWorkload(workloadClass: WorkloadClass, volumeId: string): WorkloadClass;
/**
 * Isolates a workload by enforcing resource boundaries
 *
 * @param workloadClass - Workload class to isolate
 * @param currentUsage - Current resource usage
 * @returns Isolation enforcement result
 */
export declare function isolateWorkload(workloadClass: WorkloadClass, currentUsage: {
    iops: number;
    bandwidth: number;
}): {
    withinLimits: boolean;
    reservationsMet: boolean;
    adjustmentNeeded: boolean;
    recommendations: string[];
};
/**
 * Gets metrics for a workload class
 *
 * @param workloadClass - Workload class
 * @param volumeMetrics - Map of volume ID to current metrics
 * @returns Aggregated workload metrics
 */
export declare function getWorkloadMetrics(workloadClass: WorkloadClass, volumeMetrics: Map<string, {
    iops: number;
    bandwidth: number;
    latency: number;
    queueDepth: number;
}>): WorkloadMetrics;
/**
 * Creates an SLA target definition
 *
 * @param slaName - Name of the SLA
 * @param volumeIds - Volumes covered by this SLA
 * @param targets - SLA targets
 * @param complianceWindow - Compliance measurement window in seconds
 * @returns New SLA target
 */
export declare function createSLATarget(slaName: string, volumeIds: string[], targets: {
    minIOPS?: number;
    minBandwidth?: number;
    maxLatency?: number;
    availability?: number;
}, complianceWindow?: number): SLATarget;
/**
 * Monitors SLA compliance for a volume
 *
 * @param slaTarget - SLA target to monitor
 * @param volumeId - Volume to monitor
 * @param actualMetrics - Actual performance metrics
 * @param measurementPeriod - Measurement period in seconds
 * @returns SLA metrics with compliance status
 */
export declare function monitorSLACompliance(slaTarget: SLATarget, volumeId: string, actualMetrics: {
    iops: number;
    bandwidth: number;
    latency: number;
    availability: number;
}, measurementPeriod: number): SLAMetrics;
/**
 * Detects SLA violations
 *
 * @param slaTarget - SLA target
 * @param slaMetrics - Current SLA metrics
 * @returns SLA violation if detected, undefined otherwise
 */
export declare function detectSLAViolation(slaTarget: SLATarget, slaMetrics: SLAMetrics): SLAViolation | undefined;
/**
 * Generates an SLA compliance report
 *
 * @param slaTarget - SLA target
 * @param metricsHistory - Historical SLA metrics
 * @returns SLA compliance report
 */
export declare function generateSLAReport(slaTarget: SLATarget, metricsHistory: SLAMetrics[]): {
    slaId: string;
    slaName: string;
    overallCompliance: number;
    violationCount: number;
    uptimePercent: number;
    avgIOPS: number;
    avgBandwidth: number;
    avgLatency: number;
    periodStart: Date;
    periodEnd: Date;
    recommendations: string[];
};
//# sourceMappingURL=san-qos-throttling-kit.d.ts.map