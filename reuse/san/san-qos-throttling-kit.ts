/**
 * SAN Quality of Service and Throttling Kit
 *
 * Comprehensive set of reusable functions for managing Storage Area Network Quality of Service,
 * IOPS throttling, bandwidth control, priority queuing, fair scheduling, workload isolation,
 * and performance SLA enforcement.
 *
 * @module san-qos-throttling-kit
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * QoS priority levels
 */
export enum QoSPriority {
  Critical = 'critical',     // Highest priority - mission critical workloads
  High = 'high',            // High priority - production workloads
  Medium = 'medium',        // Medium priority - standard workloads
  Low = 'low',              // Low priority - background tasks
  BestEffort = 'best-effort', // Lowest priority - opportunistic
}

/**
 * Throttle state for tracking enforcement
 */
export enum ThrottleState {
  Normal = 'normal',         // Within limits
  Warning = 'warning',       // Approaching limits (80-95%)
  Throttled = 'throttled',   // Limits exceeded, throttling active
  Suspended = 'suspended',   // Temporarily suspended
  Disabled = 'disabled',     // Throttling disabled
}

/**
 * SLA compliance status
 */
export enum SLAStatus {
  Compliant = 'compliant',         // Meeting SLA targets
  AtRisk = 'at-risk',             // Close to violation
  Violated = 'violated',           // SLA violated
  Unknown = 'unknown',             // Insufficient data
}

/**
 * Workload classification types
 */
export enum WorkloadType {
  OLTP = 'oltp',                   // Online Transaction Processing
  Analytics = 'analytics',         // Analytical/reporting workloads
  Batch = 'batch',                 // Batch processing
  Backup = 'backup',               // Backup operations
  Replication = 'replication',     // Replication traffic
  Custom = 'custom',               // Custom workload
}

/**
 * IO operation types
 */
export enum IOType {
  Read = 'read',
  Write = 'write',
  ReadWrite = 'read-write',
}

/**
 * Scheduling algorithm types
 */
export enum SchedulingAlgorithm {
  FIFO = 'fifo',                   // First In First Out
  RoundRobin = 'round-robin',      // Round robin scheduling
  WeightedFairQueuing = 'wfq',     // Weighted Fair Queuing
  PriorityBased = 'priority',      // Priority-based scheduling
  DeadlineMonotonic = 'deadline',  // Deadline monotonic scheduling
}

/**
 * IOPS limit configuration
 */
export interface IOPSLimit {
  readonly maxReadIOPS: number;
  readonly maxWriteIOPS: number;
  readonly maxTotalIOPS: number;
  readonly burstIOPS?: number;           // Burst allowance
  readonly burstDuration?: number;       // Burst duration in seconds
  readonly blockSize: number;            // Block size in bytes for calculations
}

/**
 * Bandwidth limit configuration (in bytes per second)
 */
export interface BandwidthLimit {
  readonly maxReadBandwidth: number;     // Bytes per second
  readonly maxWriteBandwidth: number;    // Bytes per second
  readonly maxTotalBandwidth: number;    // Bytes per second
  readonly burstBandwidth?: number;      // Burst allowance in bytes/sec
  readonly burstDuration?: number;       // Burst duration in seconds
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
  readonly latencyTarget?: number;       // Target latency in milliseconds
  readonly enabled: boolean;
  readonly volumeIds: string[];          // Volumes this policy applies to
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
  readonly currentReadBandwidth: number;   // Bytes per second
  readonly currentWriteBandwidth: number;  // Bytes per second
  readonly currentTotalBandwidth: number;  // Bytes per second
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
  readonly delayMs?: number;             // Delay to apply if throttled
  readonly remainingQuota: number;       // Remaining quota before throttling
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
  readonly deadline?: Date;              // Deadline for deadline-based scheduling
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
  readonly workloadWeights: Map<string, number>;  // Workload ID to weight mapping
  readonly activeWorkloads: string[];
  readonly schedulingQuantum: number;    // Time quantum in milliseconds
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
  readonly reservedIOPS?: number;        // Reserved IOPS guarantee
  readonly reservedBandwidth?: number;   // Reserved bandwidth guarantee
  readonly maxIOPS?: number;             // Maximum IOPS cap
  readonly maxBandwidth?: number;        // Maximum bandwidth cap
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
  readonly minIOPS?: number;             // Minimum guaranteed IOPS
  readonly minBandwidth?: number;        // Minimum guaranteed bandwidth
  readonly maxLatency?: number;          // Maximum acceptable latency (ms)
  readonly availability?: number;        // Availability percentage (0-100)
  readonly complianceWindow: number;     // Window for measurement (seconds)
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
  readonly complianceScore: number;      // 0-100
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
  readonly deviation: number;            // Percentage deviation
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
  readonly fairnessScore: number;        // 0-100, 100 = perfectly fair
  readonly timestamp: Date;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Result type for operations that can fail
 */
export type QoSResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

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

// ============================================================================
// QoS Policy Management Functions (8 functions)
// ============================================================================

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
export function createQoSPolicy(
  policyName: string,
  priority: QoSPriority,
  workloadType: WorkloadType,
  volumeIds: string[],
  options?: {
    iopsLimit?: IOPSLimit;
    bandwidthLimit?: BandwidthLimit;
    latencyTarget?: number;
    description?: string;
  }
): QoSPolicy {
  if (volumeIds.length === 0) {
    throw new Error('QoS policy must apply to at least one volume');
  }

  const now = new Date();
  const policyId = `qos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    policyId,
    policyName,
    priority,
    workloadType,
    volumeIds: [...volumeIds],
    enabled: true,
    iopsLimit: options?.iopsLimit,
    bandwidthLimit: options?.bandwidthLimit,
    latencyTarget: options?.latencyTarget,
    description: options?.description,
    createdAt: now,
    lastModified: now,
  };
}

/**
 * Updates an existing QoS policy
 *
 * @param policy - Policy to update
 * @param updates - Updates to apply
 * @returns Updated policy
 */
export function updateQoSPolicy(
  policy: QoSPolicy,
  updates: Partial<Omit<QoSPolicy, 'policyId' | 'createdAt'>>
): QoSPolicy {
  return {
    ...policy,
    ...updates,
    lastModified: new Date(),
  };
}

/**
 * Validates a QoS policy configuration
 *
 * @param policy - Policy to validate
 * @returns Validation result with any errors
 */
export function validateQoSPolicy(policy: QoSPolicy): QoSResult<boolean> {
  const errors: string[] = [];

  // Validate IOPS limits
  if (policy.iopsLimit) {
    const { maxReadIOPS, maxWriteIOPS, maxTotalIOPS, burstIOPS } = policy.iopsLimit;

    if (maxReadIOPS < 0 || maxWriteIOPS < 0 || maxTotalIOPS < 0) {
      errors.push('IOPS limits must be non-negative');
    }

    if (maxReadIOPS + maxWriteIOPS > maxTotalIOPS) {
      errors.push('Sum of read and write IOPS exceeds total IOPS limit');
    }

    if (burstIOPS && burstIOPS <= maxTotalIOPS) {
      errors.push('Burst IOPS must be greater than max total IOPS');
    }
  }

  // Validate bandwidth limits
  if (policy.bandwidthLimit) {
    const { maxReadBandwidth, maxWriteBandwidth, maxTotalBandwidth, burstBandwidth } = policy.bandwidthLimit;

    if (maxReadBandwidth < 0 || maxWriteBandwidth < 0 || maxTotalBandwidth < 0) {
      errors.push('Bandwidth limits must be non-negative');
    }

    if (maxReadBandwidth + maxWriteBandwidth > maxTotalBandwidth) {
      errors.push('Sum of read and write bandwidth exceeds total bandwidth limit');
    }

    if (burstBandwidth && burstBandwidth <= maxTotalBandwidth) {
      errors.push('Burst bandwidth must be greater than max total bandwidth');
    }
  }

  // Validate latency target
  if (policy.latencyTarget && policy.latencyTarget <= 0) {
    errors.push('Latency target must be positive');
  }

  // Validate volume IDs
  if (policy.volumeIds.length === 0) {
    errors.push('Policy must apply to at least one volume');
  }

  if (errors.length > 0) {
    return { success: false, error: errors.join('; '), code: 'VALIDATION_FAILED' };
  }

  return { success: true, data: true };
}

/**
 * Applies a QoS policy to specified volumes
 *
 * @param policy - Policy to apply
 * @param additionalVolumeIds - Additional volume IDs to apply policy to
 * @returns Updated policy with additional volumes
 */
export function applyQoSPolicy(policy: QoSPolicy, additionalVolumeIds: string[]): QoSPolicy {
  const newVolumeIds = additionalVolumeIds.filter(id => !policy.volumeIds.includes(id));

  if (newVolumeIds.length === 0) {
    return policy; // No new volumes to add
  }

  return {
    ...policy,
    volumeIds: [...policy.volumeIds, ...newVolumeIds],
    lastModified: new Date(),
  };
}

/**
 * Revokes a QoS policy from specified volumes
 *
 * @param policy - Policy to revoke from
 * @param volumeIds - Volume IDs to remove from policy
 * @returns Updated policy without specified volumes
 */
export function revokeQoSPolicy(policy: QoSPolicy, volumeIds: string[]): QoSPolicy {
  const remainingVolumes = policy.volumeIds.filter(id => !volumeIds.includes(id));

  if (remainingVolumes.length === 0) {
    throw new Error('Cannot revoke policy from all volumes - policy would be empty');
  }

  return {
    ...policy,
    volumeIds: remainingVolumes,
    lastModified: new Date(),
  };
}

/**
 * Merges multiple QoS policies into a single policy
 *
 * @param policies - Policies to merge
 * @param mergedName - Name for merged policy
 * @returns Merged policy with combined settings
 */
export function mergeQoSPolicies(policies: QoSPolicy[], mergedName: string): QoSPolicy {
  if (policies.length === 0) {
    throw new Error('Cannot merge zero policies');
  }

  if (policies.length === 1) {
    return { ...policies[0], policyName: mergedName };
  }

  // Take most restrictive limits
  const allVolumeIds = [...new Set(policies.flatMap(p => p.volumeIds))];
  const highestPriority = policies.reduce((max, p) => {
    const priorityOrder = [QoSPriority.BestEffort, QoSPriority.Low, QoSPriority.Medium, QoSPriority.High, QoSPriority.Critical];
    return priorityOrder.indexOf(p.priority) > priorityOrder.indexOf(max) ? p.priority : max;
  }, QoSPriority.BestEffort);

  // Merge IOPS limits (take minimum)
  const iopsLimits = policies.filter(p => p.iopsLimit).map(p => p.iopsLimit!);
  const mergedIOPSLimit = iopsLimits.length > 0 ? {
    maxReadIOPS: Math.min(...iopsLimits.map(l => l.maxReadIOPS)),
    maxWriteIOPS: Math.min(...iopsLimits.map(l => l.maxWriteIOPS)),
    maxTotalIOPS: Math.min(...iopsLimits.map(l => l.maxTotalIOPS)),
    blockSize: iopsLimits[0].blockSize,
  } : undefined;

  // Merge bandwidth limits (take minimum)
  const bandwidthLimits = policies.filter(p => p.bandwidthLimit).map(p => p.bandwidthLimit!);
  const mergedBandwidthLimit = bandwidthLimits.length > 0 ? {
    maxReadBandwidth: Math.min(...bandwidthLimits.map(l => l.maxReadBandwidth)),
    maxWriteBandwidth: Math.min(...bandwidthLimits.map(l => l.maxWriteBandwidth)),
    maxTotalBandwidth: Math.min(...bandwidthLimits.map(l => l.maxTotalBandwidth)),
  } : undefined;

  // Merge latency targets (take minimum)
  const latencyTargets = policies.filter(p => p.latencyTarget).map(p => p.latencyTarget!);
  const mergedLatencyTarget = latencyTargets.length > 0 ? Math.min(...latencyTargets) : undefined;

  const now = new Date();
  const policyId = `qos-merged-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    policyId,
    policyName: mergedName,
    priority: highestPriority,
    workloadType: policies[0].workloadType,
    volumeIds: allVolumeIds,
    enabled: true,
    iopsLimit: mergedIOPSLimit,
    bandwidthLimit: mergedBandwidthLimit,
    latencyTarget: mergedLatencyTarget,
    description: `Merged from ${policies.length} policies`,
    createdAt: now,
    lastModified: now,
  };
}

/**
 * Gets the current status of a QoS policy
 *
 * @param policy - Policy to check status of
 * @param currentUsage - Current usage metrics
 * @returns Policy status information
 */
export function getQoSPolicyStatus(
  policy: QoSPolicy,
  currentUsage: IOPSUsage | BandwidthUsage
): {
  enabled: boolean;
  utilizationPercent: number;
  state: ThrottleState;
  withinLimits: boolean;
} {
  if (!policy.enabled) {
    return {
      enabled: false,
      utilizationPercent: 0,
      state: ThrottleState.Disabled,
      withinLimits: true,
    };
  }

  let utilization = 0;
  let withinLimits = true;

  if ('currentTotalIOPS' in currentUsage && policy.iopsLimit) {
    utilization = (currentUsage.currentTotalIOPS / policy.iopsLimit.maxTotalIOPS) * 100;
    withinLimits = currentUsage.currentTotalIOPS <= policy.iopsLimit.maxTotalIOPS;
  } else if ('currentTotalBandwidth' in currentUsage && policy.bandwidthLimit) {
    utilization = (currentUsage.currentTotalBandwidth / policy.bandwidthLimit.maxTotalBandwidth) * 100;
    withinLimits = currentUsage.currentTotalBandwidth <= policy.bandwidthLimit.maxTotalBandwidth;
  }

  let state: ThrottleState;
  if (utilization >= 100) {
    state = ThrottleState.Throttled;
  } else if (utilization >= 80) {
    state = ThrottleState.Warning;
  } else {
    state = ThrottleState.Normal;
  }

  return {
    enabled: true,
    utilizationPercent: utilization,
    state,
    withinLimits,
  };
}

/**
 * Exports a QoS policy to a portable format
 *
 * @param policy - Policy to export
 * @returns JSON string representation of policy
 */
export function exportQoSPolicy(policy: QoSPolicy): string {
  return JSON.stringify(policy, null, 2);
}

// ============================================================================
// IOPS Throttling Functions (6 functions)
// ============================================================================

/**
 * Creates an IOPS limit configuration
 *
 * @param maxReadIOPS - Maximum read IOPS
 * @param maxWriteIOPS - Maximum write IOPS
 * @param blockSize - Block size in bytes
 * @param options - Optional burst configuration
 * @returns IOPS limit configuration
 */
export function createIOPSLimit(
  maxReadIOPS: number,
  maxWriteIOPS: number,
  blockSize: number = 4096,
  options?: { burstIOPS?: number; burstDuration?: number }
): IOPSLimit {
  if (maxReadIOPS < 0 || maxWriteIOPS < 0) {
    throw new Error('IOPS limits must be non-negative');
  }

  if (blockSize <= 0 || blockSize % 512 !== 0) {
    throw new Error('Block size must be positive and a multiple of 512');
  }

  const maxTotalIOPS = maxReadIOPS + maxWriteIOPS;

  if (options?.burstIOPS && options.burstIOPS <= maxTotalIOPS) {
    throw new Error('Burst IOPS must exceed max total IOPS');
  }

  return {
    maxReadIOPS,
    maxWriteIOPS,
    maxTotalIOPS,
    blockSize,
    burstIOPS: options?.burstIOPS,
    burstDuration: options?.burstDuration,
  };
}

/**
 * Enforces IOPS limits and determines if IO should be throttled
 *
 * @param limit - IOPS limit configuration
 * @param currentUsage - Current IOPS usage
 * @param ioType - Type of IO operation
 * @returns Throttle enforcement result
 */
export function enforceIOPSLimit(
  limit: IOPSLimit,
  currentUsage: IOPSUsage,
  ioType: IOType
): ThrottleResult {
  const { currentReadIOPS, currentWriteIOPS, currentTotalIOPS } = currentUsage;

  // Check total IOPS limit
  if (currentTotalIOPS >= limit.maxTotalIOPS) {
    const excessIOPS = currentTotalIOPS - limit.maxTotalIOPS;
    const delayMs = calculateThrottleDelay(excessIOPS, limit.maxTotalIOPS);

    return {
      allowed: false,
      throttleState: ThrottleState.Throttled,
      delayMs,
      remainingQuota: 0,
      message: `Total IOPS limit exceeded: ${currentTotalIOPS}/${limit.maxTotalIOPS}`,
    };
  }

  // Check read/write specific limits
  if (ioType === IOType.Read && currentReadIOPS >= limit.maxReadIOPS) {
    const excessIOPS = currentReadIOPS - limit.maxReadIOPS;
    const delayMs = calculateThrottleDelay(excessIOPS, limit.maxReadIOPS);

    return {
      allowed: false,
      throttleState: ThrottleState.Throttled,
      delayMs,
      remainingQuota: 0,
      message: `Read IOPS limit exceeded: ${currentReadIOPS}/${limit.maxReadIOPS}`,
    };
  }

  if (ioType === IOType.Write && currentWriteIOPS >= limit.maxWriteIOPS) {
    const excessIOPS = currentWriteIOPS - limit.maxWriteIOPS;
    const delayMs = calculateThrottleDelay(excessIOPS, limit.maxWriteIOPS);

    return {
      allowed: false,
      throttleState: ThrottleState.Throttled,
      delayMs,
      remainingQuota: 0,
      message: `Write IOPS limit exceeded: ${currentWriteIOPS}/${limit.maxWriteIOPS}`,
    };
  }

  // Check if approaching limits (warning state)
  const utilizationPercent = (currentTotalIOPS / limit.maxTotalIOPS) * 100;
  const state = utilizationPercent >= 80 ? ThrottleState.Warning : ThrottleState.Normal;
  const remainingQuota = limit.maxTotalIOPS - currentTotalIOPS;

  return {
    allowed: true,
    throttleState: state,
    remainingQuota,
    message: state === ThrottleState.Warning ? 'Approaching IOPS limit' : undefined,
  };
}

/**
 * Calculates current IOPS usage from IO operations
 *
 * @param volumeId - Volume ID
 * @param ioOperations - Number of IO operations in the interval
 * @param intervalSeconds - Time interval for measurement
 * @param readWriteRatio - Ratio of reads to writes (0-1)
 * @returns IOPS usage metrics
 */
export function calculateIOPSUsage(
  volumeId: string,
  ioOperations: number,
  intervalSeconds: number,
  readWriteRatio: number = 0.5
): IOPSUsage {
  if (intervalSeconds <= 0) {
    throw new Error('Interval must be positive');
  }

  if (readWriteRatio < 0 || readWriteRatio > 1) {
    throw new Error('Read/write ratio must be between 0 and 1');
  }

  const iops = ioOperations / intervalSeconds;
  const readIOPS = iops * readWriteRatio;
  const writeIOPS = iops * (1 - readWriteRatio);

  return {
    volumeId,
    currentReadIOPS: readIOPS,
    currentWriteIOPS: writeIOPS,
    currentTotalIOPS: iops,
    peakReadIOPS: readIOPS, // In real implementation, track actual peaks
    peakWriteIOPS: writeIOPS,
    peakTotalIOPS: iops,
    timestamp: new Date(),
    intervalSeconds,
  };
}

/**
 * Adjusts IOPS limits dynamically based on workload
 *
 * @param currentLimit - Current IOPS limit
 * @param adjustmentFactor - Adjustment factor (0.5 = 50% decrease, 2.0 = 100% increase)
 * @returns Adjusted IOPS limit
 */
export function adjustIOPSLimit(currentLimit: IOPSLimit, adjustmentFactor: number): IOPSLimit {
  if (adjustmentFactor <= 0) {
    throw new Error('Adjustment factor must be positive');
  }

  return {
    ...currentLimit,
    maxReadIOPS: Math.floor(currentLimit.maxReadIOPS * adjustmentFactor),
    maxWriteIOPS: Math.floor(currentLimit.maxWriteIOPS * adjustmentFactor),
    maxTotalIOPS: Math.floor(currentLimit.maxTotalIOPS * adjustmentFactor),
    burstIOPS: currentLimit.burstIOPS ? Math.floor(currentLimit.burstIOPS * adjustmentFactor) : undefined,
  };
}

/**
 * Gets IOPS statistics over time
 *
 * @param usageHistory - Historical IOPS usage data
 * @param limit - IOPS limit configuration
 * @returns IOPS statistics
 */
export function getIOPSStatistics(
  usageHistory: IOPSUsage[],
  limit: IOPSLimit
): {
  avgIOPS: number;
  peakIOPS: number;
  minIOPS: number;
  utilizationPercent: number;
  throttleEvents: number;
} {
  if (usageHistory.length === 0) {
    return {
      avgIOPS: 0,
      peakIOPS: 0,
      minIOPS: 0,
      utilizationPercent: 0,
      throttleEvents: 0,
    };
  }

  const totalIOPS = usageHistory.reduce((sum, u) => sum + u.currentTotalIOPS, 0);
  const avgIOPS = totalIOPS / usageHistory.length;
  const peakIOPS = Math.max(...usageHistory.map(u => u.currentTotalIOPS));
  const minIOPS = Math.min(...usageHistory.map(u => u.currentTotalIOPS));
  const throttleEvents = usageHistory.filter(u => u.currentTotalIOPS > limit.maxTotalIOPS).length;
  const utilizationPercent = (avgIOPS / limit.maxTotalIOPS) * 100;

  return {
    avgIOPS,
    peakIOPS,
    minIOPS,
    utilizationPercent,
    throttleEvents,
  };
}

/**
 * Resets IOPS counters for a fresh measurement period
 *
 * @param volumeId - Volume ID
 * @returns Reset IOPS usage metrics
 */
export function resetIOPSCounters(volumeId: string): IOPSUsage {
  return {
    volumeId,
    currentReadIOPS: 0,
    currentWriteIOPS: 0,
    currentTotalIOPS: 0,
    peakReadIOPS: 0,
    peakWriteIOPS: 0,
    peakTotalIOPS: 0,
    timestamp: new Date(),
    intervalSeconds: 0,
  };
}

// ============================================================================
// Bandwidth Control Functions (6 functions)
// ============================================================================

/**
 * Creates a bandwidth limit configuration
 *
 * @param maxReadBandwidth - Maximum read bandwidth (bytes/sec)
 * @param maxWriteBandwidth - Maximum write bandwidth (bytes/sec)
 * @param options - Optional burst configuration
 * @returns Bandwidth limit configuration
 */
export function createBandwidthLimit(
  maxReadBandwidth: number,
  maxWriteBandwidth: number,
  options?: { burstBandwidth?: number; burstDuration?: number }
): BandwidthLimit {
  if (maxReadBandwidth < 0 || maxWriteBandwidth < 0) {
    throw new Error('Bandwidth limits must be non-negative');
  }

  const maxTotalBandwidth = maxReadBandwidth + maxWriteBandwidth;

  if (options?.burstBandwidth && options.burstBandwidth <= maxTotalBandwidth) {
    throw new Error('Burst bandwidth must exceed max total bandwidth');
  }

  return {
    maxReadBandwidth,
    maxWriteBandwidth,
    maxTotalBandwidth,
    burstBandwidth: options?.burstBandwidth,
    burstDuration: options?.burstDuration,
  };
}

/**
 * Enforces bandwidth limits and determines if IO should be throttled
 *
 * @param limit - Bandwidth limit configuration
 * @param currentUsage - Current bandwidth usage
 * @param ioType - Type of IO operation
 * @returns Throttle enforcement result
 */
export function enforceBandwidthLimit(
  limit: BandwidthLimit,
  currentUsage: BandwidthUsage,
  ioType: IOType
): ThrottleResult {
  const { currentReadBandwidth, currentWriteBandwidth, currentTotalBandwidth } = currentUsage;

  // Check total bandwidth limit
  if (currentTotalBandwidth >= limit.maxTotalBandwidth) {
    const excessBandwidth = currentTotalBandwidth - limit.maxTotalBandwidth;
    const delayMs = calculateBandwidthThrottleDelay(excessBandwidth, limit.maxTotalBandwidth);

    return {
      allowed: false,
      throttleState: ThrottleState.Throttled,
      delayMs,
      remainingQuota: 0,
      message: `Total bandwidth limit exceeded: ${formatBandwidth(currentTotalBandwidth)}/${formatBandwidth(limit.maxTotalBandwidth)}`,
    };
  }

  // Check read/write specific limits
  if (ioType === IOType.Read && currentReadBandwidth >= limit.maxReadBandwidth) {
    const excessBandwidth = currentReadBandwidth - limit.maxReadBandwidth;
    const delayMs = calculateBandwidthThrottleDelay(excessBandwidth, limit.maxReadBandwidth);

    return {
      allowed: false,
      throttleState: ThrottleState.Throttled,
      delayMs,
      remainingQuota: 0,
      message: `Read bandwidth limit exceeded: ${formatBandwidth(currentReadBandwidth)}/${formatBandwidth(limit.maxReadBandwidth)}`,
    };
  }

  if (ioType === IOType.Write && currentWriteBandwidth >= limit.maxWriteBandwidth) {
    const excessBandwidth = currentWriteBandwidth - limit.maxWriteBandwidth;
    const delayMs = calculateBandwidthThrottleDelay(excessBandwidth, limit.maxWriteBandwidth);

    return {
      allowed: false,
      throttleState: ThrottleState.Throttled,
      delayMs,
      remainingQuota: 0,
      message: `Write bandwidth limit exceeded: ${formatBandwidth(currentWriteBandwidth)}/${formatBandwidth(limit.maxWriteBandwidth)}`,
    };
  }

  // Check if approaching limits (warning state)
  const utilizationPercent = (currentTotalBandwidth / limit.maxTotalBandwidth) * 100;
  const state = utilizationPercent >= 80 ? ThrottleState.Warning : ThrottleState.Normal;
  const remainingQuota = limit.maxTotalBandwidth - currentTotalBandwidth;

  return {
    allowed: true,
    throttleState: state,
    remainingQuota,
    message: state === ThrottleState.Warning ? 'Approaching bandwidth limit' : undefined,
  };
}

/**
 * Calculates current bandwidth usage from IO operations
 *
 * @param volumeId - Volume ID
 * @param bytesTransferred - Total bytes transferred in the interval
 * @param intervalSeconds - Time interval for measurement
 * @param readWriteRatio - Ratio of reads to writes (0-1)
 * @returns Bandwidth usage metrics
 */
export function calculateBandwidthUsage(
  volumeId: string,
  bytesTransferred: number,
  intervalSeconds: number,
  readWriteRatio: number = 0.5
): BandwidthUsage {
  if (intervalSeconds <= 0) {
    throw new Error('Interval must be positive');
  }

  if (readWriteRatio < 0 || readWriteRatio > 1) {
    throw new Error('Read/write ratio must be between 0 and 1');
  }

  const bandwidth = bytesTransferred / intervalSeconds;
  const readBandwidth = bandwidth * readWriteRatio;
  const writeBandwidth = bandwidth * (1 - readWriteRatio);

  return {
    volumeId,
    currentReadBandwidth: readBandwidth,
    currentWriteBandwidth: writeBandwidth,
    currentTotalBandwidth: bandwidth,
    peakReadBandwidth: readBandwidth,
    peakWriteBandwidth: writeBandwidth,
    peakTotalBandwidth: bandwidth,
    timestamp: new Date(),
    intervalSeconds,
  };
}

/**
 * Adjusts bandwidth limits dynamically based on workload
 *
 * @param currentLimit - Current bandwidth limit
 * @param adjustmentFactor - Adjustment factor (0.5 = 50% decrease, 2.0 = 100% increase)
 * @returns Adjusted bandwidth limit
 */
export function adjustBandwidthLimit(currentLimit: BandwidthLimit, adjustmentFactor: number): BandwidthLimit {
  if (adjustmentFactor <= 0) {
    throw new Error('Adjustment factor must be positive');
  }

  return {
    ...currentLimit,
    maxReadBandwidth: Math.floor(currentLimit.maxReadBandwidth * adjustmentFactor),
    maxWriteBandwidth: Math.floor(currentLimit.maxWriteBandwidth * adjustmentFactor),
    maxTotalBandwidth: Math.floor(currentLimit.maxTotalBandwidth * adjustmentFactor),
    burstBandwidth: currentLimit.burstBandwidth ? Math.floor(currentLimit.burstBandwidth * adjustmentFactor) : undefined,
  };
}

/**
 * Gets bandwidth statistics over time
 *
 * @param usageHistory - Historical bandwidth usage data
 * @param limit - Bandwidth limit configuration
 * @returns Bandwidth statistics
 */
export function getBandwidthStatistics(
  usageHistory: BandwidthUsage[],
  limit: BandwidthLimit
): {
  avgBandwidth: number;
  peakBandwidth: number;
  minBandwidth: number;
  utilizationPercent: number;
  throttleEvents: number;
} {
  if (usageHistory.length === 0) {
    return {
      avgBandwidth: 0,
      peakBandwidth: 0,
      minBandwidth: 0,
      utilizationPercent: 0,
      throttleEvents: 0,
    };
  }

  const totalBandwidth = usageHistory.reduce((sum, u) => sum + u.currentTotalBandwidth, 0);
  const avgBandwidth = totalBandwidth / usageHistory.length;
  const peakBandwidth = Math.max(...usageHistory.map(u => u.currentTotalBandwidth));
  const minBandwidth = Math.min(...usageHistory.map(u => u.currentTotalBandwidth));
  const throttleEvents = usageHistory.filter(u => u.currentTotalBandwidth > limit.maxTotalBandwidth).length;
  const utilizationPercent = (avgBandwidth / limit.maxTotalBandwidth) * 100;

  return {
    avgBandwidth,
    peakBandwidth,
    minBandwidth,
    utilizationPercent,
    throttleEvents,
  };
}

/**
 * Resets bandwidth counters for a fresh measurement period
 *
 * @param volumeId - Volume ID
 * @returns Reset bandwidth usage metrics
 */
export function resetBandwidthCounters(volumeId: string): BandwidthUsage {
  return {
    volumeId,
    currentReadBandwidth: 0,
    currentWriteBandwidth: 0,
    currentTotalBandwidth: 0,
    peakReadBandwidth: 0,
    peakWriteBandwidth: 0,
    peakTotalBandwidth: 0,
    timestamp: new Date(),
    intervalSeconds: 0,
  };
}

// ============================================================================
// Priority Queuing Functions (6 functions)
// ============================================================================

/**
 * Creates a priority queue for IO operations
 *
 * @param maxQueueDepth - Maximum number of queued IOs
 * @param algorithm - Scheduling algorithm to use
 * @returns New priority queue
 */
export function createPriorityQueue(
  maxQueueDepth: number,
  algorithm: SchedulingAlgorithm = SchedulingAlgorithm.PriorityBased
): PriorityQueue {
  if (maxQueueDepth <= 0) {
    throw new Error('Max queue depth must be positive');
  }

  const queueId = `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    queueId,
    maxQueueDepth,
    algorithm,
    entries: [],
    currentDepth: 0,
    totalEnqueued: 0n,
    totalDequeued: 0n,
    droppedIOs: 0n,
    createdAt: new Date(),
  };
}

/**
 * Enqueues an IO operation with priority
 *
 * @param queue - Priority queue
 * @param io - IO operation to enqueue
 * @returns Updated queue with enqueued IO
 */
export function enqueueIO(queue: PriorityQueue, io: QueuedIO): QoSResult<PriorityQueue> {
  if (queue.currentDepth >= queue.maxQueueDepth) {
    // Queue full - check if we should drop this IO or drop lowest priority
    const lowestPriorityIO = findLowestPriorityIO(queue.entries);

    if (!lowestPriorityIO || comparePriority(io.priority, lowestPriorityIO.priority) <= 0) {
      // Drop the new IO
      return {
        success: false,
        error: 'Queue full and IO priority too low',
        code: 'QUEUE_FULL',
      };
    }

    // Drop the lowest priority IO to make room
    const updatedEntries = queue.entries.filter(e => e.ioId !== lowestPriorityIO.ioId);
    const newQueue: PriorityQueue = {
      ...queue,
      entries: [...updatedEntries, io],
      totalEnqueued: queue.totalEnqueued + 1n,
      droppedIOs: queue.droppedIOs + 1n,
    };

    return { success: true, data: newQueue };
  }

  const updatedQueue: PriorityQueue = {
    ...queue,
    entries: [...queue.entries, io],
    currentDepth: queue.currentDepth + 1,
    totalEnqueued: queue.totalEnqueued + 1n,
  };

  return { success: true, data: updatedQueue };
}

/**
 * Dequeues the next IO operation based on scheduling algorithm
 *
 * @param queue - Priority queue
 * @returns Result containing dequeued IO and updated queue
 */
export function dequeueIO(queue: PriorityQueue): QoSResult<{ io: QueuedIO; queue: PriorityQueue }> {
  if (queue.currentDepth === 0) {
    return { success: false, error: 'Queue is empty', code: 'QUEUE_EMPTY' };
  }

  let selectedIO: QueuedIO;

  switch (queue.algorithm) {
    case SchedulingAlgorithm.FIFO:
      selectedIO = queue.entries[0];
      break;

    case SchedulingAlgorithm.PriorityBased:
      selectedIO = findHighestPriorityIO(queue.entries);
      break;

    case SchedulingAlgorithm.DeadlineMonotonic:
      selectedIO = findEarliestDeadlineIO(queue.entries);
      break;

    case SchedulingAlgorithm.RoundRobin:
    case SchedulingAlgorithm.WeightedFairQueuing:
      // For round-robin and WFQ, need external state tracking
      // For simplicity, use FIFO for now
      selectedIO = queue.entries[0];
      break;

    default:
      selectedIO = queue.entries[0];
  }

  const updatedEntries = queue.entries.filter(e => e.ioId !== selectedIO.ioId);
  const updatedQueue: PriorityQueue = {
    ...queue,
    entries: updatedEntries,
    currentDepth: queue.currentDepth - 1,
    totalDequeued: queue.totalDequeued + 1n,
  };

  return { success: true, data: { io: selectedIO, queue: updatedQueue } };
}

/**
 * Reorders queue based on priority changes
 *
 * @param queue - Priority queue
 * @param ioId - IO operation ID to reprioritize
 * @param newPriority - New priority level
 * @returns Updated queue with reordered entries
 */
export function reorderQueue(queue: PriorityQueue, ioId: string, newPriority: QoSPriority): PriorityQueue {
  const updatedEntries = queue.entries.map(io =>
    io.ioId === ioId ? { ...io, priority: newPriority } : io
  );

  return {
    ...queue,
    entries: updatedEntries,
  };
}

/**
 * Gets statistics for a priority queue
 *
 * @param queue - Priority queue
 * @returns Queue statistics
 */
export function getPriorityStatistics(queue: PriorityQueue): {
  currentDepth: number;
  utilizationPercent: number;
  totalProcessed: bigint;
  dropRate: number;
  avgWaitTimeMs: number;
  priorityDistribution: Map<QoSPriority, number>;
} {
  const totalProcessed = queue.totalEnqueued;
  const dropRate = totalProcessed > 0n ? Number(queue.droppedIOs * 100n / totalProcessed) : 0;
  const utilizationPercent = (queue.currentDepth / queue.maxQueueDepth) * 100;

  // Calculate average wait time
  const now = new Date();
  const waitTimes = queue.entries.map(io => now.getTime() - io.enqueuedAt.getTime());
  const avgWaitTimeMs = waitTimes.length > 0 ? waitTimes.reduce((sum, t) => sum + t, 0) / waitTimes.length : 0;

  // Priority distribution
  const priorityDistribution = new Map<QoSPriority, number>();
  for (const priority of Object.values(QoSPriority)) {
    const count = queue.entries.filter(io => io.priority === priority).length;
    priorityDistribution.set(priority, count);
  }

  return {
    currentDepth: queue.currentDepth,
    utilizationPercent,
    totalProcessed,
    dropRate,
    avgWaitTimeMs,
    priorityDistribution,
  };
}

/**
 * Clears all entries from a priority queue
 *
 * @param queue - Priority queue to clear
 * @returns Cleared queue
 */
export function clearPriorityQueue(queue: PriorityQueue): PriorityQueue {
  return {
    ...queue,
    entries: [],
    currentDepth: 0,
  };
}

// ============================================================================
// Fair Scheduling Functions (4 functions)
// ============================================================================

/**
 * Creates a fair scheduler for workload balancing
 *
 * @param algorithm - Scheduling algorithm
 * @param workloadWeights - Initial workload weights (higher = more resources)
 * @param schedulingQuantum - Time quantum in milliseconds
 * @returns New fair scheduler
 */
export function createFairScheduler(
  algorithm: SchedulingAlgorithm,
  workloadWeights: Map<string, number>,
  schedulingQuantum: number = 100
): FairScheduler {
  if (schedulingQuantum <= 0) {
    throw new Error('Scheduling quantum must be positive');
  }

  const schedulerId = `scheduler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();

  return {
    schedulerId,
    algorithm,
    workloadWeights: new Map(workloadWeights),
    activeWorkloads: Array.from(workloadWeights.keys()),
    schedulingQuantum,
    createdAt: now,
    lastScheduled: now,
  };
}

/**
 * Schedules the next IO operation using fair scheduling algorithm
 *
 * @param scheduler - Fair scheduler
 * @param pendingIOs - Map of workload ID to pending IOs
 * @returns Result containing selected IO and workload ID
 */
export function scheduleNextIO(
  scheduler: FairScheduler,
  pendingIOs: Map<string, QueuedIO[]>
): QoSResult<{ workloadId: string; io: QueuedIO }> {
  const eligibleWorkloads = scheduler.activeWorkloads.filter(wid => {
    const ios = pendingIOs.get(wid);
    return ios && ios.length > 0;
  });

  if (eligibleWorkloads.length === 0) {
    return { success: false, error: 'No pending IOs for any workload', code: 'NO_PENDING_IO' };
  }

  let selectedWorkloadId: string;

  switch (scheduler.algorithm) {
    case SchedulingAlgorithm.RoundRobin:
      selectedWorkloadId = selectRoundRobinWorkload(scheduler, eligibleWorkloads);
      break;

    case SchedulingAlgorithm.WeightedFairQueuing:
      selectedWorkloadId = selectWeightedFairWorkload(scheduler, eligibleWorkloads);
      break;

    default:
      selectedWorkloadId = eligibleWorkloads[0];
  }

  const selectedIOs = pendingIOs.get(selectedWorkloadId)!;
  const selectedIO = selectedIOs[0]; // FIFO within workload

  return {
    success: true,
    data: { workloadId: selectedWorkloadId, io: selectedIO },
  };
}

/**
 * Balances workloads based on current utilization
 *
 * @param scheduler - Fair scheduler
 * @param workloadMetrics - Current metrics for each workload
 * @returns Updated scheduler with rebalanced weights
 */
export function balanceWorkloads(
  scheduler: FairScheduler,
  workloadMetrics: Map<string, WorkloadMetrics>
): FairScheduler {
  const updatedWeights = new Map(scheduler.workloadWeights);

  // Adjust weights based on utilization
  // Workloads with lower utilization get higher weights to balance
  for (const [workloadId, metrics] of workloadMetrics.entries()) {
    const currentWeight = updatedWeights.get(workloadId) || 1;
    const utilizationFactor = 100 - metrics.utilizationPercent;
    const newWeight = Math.max(1, Math.floor(currentWeight * (utilizationFactor / 50)));
    updatedWeights.set(workloadId, newWeight);
  }

  return {
    ...scheduler,
    workloadWeights: updatedWeights,
    lastScheduled: new Date(),
  };
}

/**
 * Gets scheduling statistics
 *
 * @param scheduler - Fair scheduler
 * @param completedIOs - Map of workload ID to number of completed IOs
 * @returns Scheduling statistics
 */
export function getSchedulerStatistics(
  scheduler: FairScheduler,
  completedIOs: Map<string, bigint>
): SchedulingStatistics {
  const totalScheduled = Array.from(completedIOs.values()).reduce((sum, count) => sum + count, 0n);

  // Calculate fairness score (Jain's fairness index)
  const workloadCounts = Array.from(completedIOs.values()).map(Number);
  const fairnessScore = calculateFairnessScore(workloadCounts);

  const workloadDistribution = new Map<string, number>();
  for (const [workloadId, count] of completedIOs.entries()) {
    const percentage = totalScheduled > 0n ? Number(count * 100n / totalScheduled) : 0;
    workloadDistribution.set(workloadId, percentage);
  }

  return {
    schedulerId: scheduler.schedulerId,
    totalScheduled,
    avgSchedulingTimeMs: 5, // In real implementation, track actual scheduling time
    workloadDistribution,
    fairnessScore,
    timestamp: new Date(),
  };
}

// ============================================================================
// Workload Isolation Functions (4 functions)
// ============================================================================

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
export function createWorkloadClass(
  className: string,
  workloadType: WorkloadType,
  priority: QoSPriority,
  volumeIds: string[],
  options?: {
    reservedIOPS?: number;
    reservedBandwidth?: number;
    maxIOPS?: number;
    maxBandwidth?: number;
  }
): WorkloadClass {
  if (volumeIds.length === 0) {
    throw new Error('Workload class must contain at least one volume');
  }

  if (options?.reservedIOPS && options?.maxIOPS && options.reservedIOPS > options.maxIOPS) {
    throw new Error('Reserved IOPS cannot exceed max IOPS');
  }

  if (options?.reservedBandwidth && options?.maxBandwidth && options.reservedBandwidth > options.maxBandwidth) {
    throw new Error('Reserved bandwidth cannot exceed max bandwidth');
  }

  const classId = `workload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    classId,
    className,
    workloadType,
    priority,
    volumeIds: [...volumeIds],
    reservedIOPS: options?.reservedIOPS,
    reservedBandwidth: options?.reservedBandwidth,
    maxIOPS: options?.maxIOPS,
    maxBandwidth: options?.maxBandwidth,
    isolationEnabled: true,
    createdAt: new Date(),
  };
}

/**
 * Assigns a volume to a workload class
 *
 * @param workloadClass - Workload class to assign to
 * @param volumeId - Volume ID to assign
 * @returns Updated workload class
 */
export function assignVolumeToWorkload(workloadClass: WorkloadClass, volumeId: string): WorkloadClass {
  if (workloadClass.volumeIds.includes(volumeId)) {
    return workloadClass; // Already assigned
  }

  return {
    ...workloadClass,
    volumeIds: [...workloadClass.volumeIds, volumeId],
  };
}

/**
 * Isolates a workload by enforcing resource boundaries
 *
 * @param workloadClass - Workload class to isolate
 * @param currentUsage - Current resource usage
 * @returns Isolation enforcement result
 */
export function isolateWorkload(
  workloadClass: WorkloadClass,
  currentUsage: { iops: number; bandwidth: number }
): {
  withinLimits: boolean;
  reservationsMet: boolean;
  adjustmentNeeded: boolean;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let withinLimits = true;
  let reservationsMet = true;
  let adjustmentNeeded = false;

  // Check max limits
  if (workloadClass.maxIOPS && currentUsage.iops > workloadClass.maxIOPS) {
    withinLimits = false;
    recommendations.push(`IOPS exceeds maximum: ${currentUsage.iops}/${workloadClass.maxIOPS}`);
  }

  if (workloadClass.maxBandwidth && currentUsage.bandwidth > workloadClass.maxBandwidth) {
    withinLimits = false;
    recommendations.push(`Bandwidth exceeds maximum: ${formatBandwidth(currentUsage.bandwidth)}/${formatBandwidth(workloadClass.maxBandwidth)}`);
  }

  // Check reservations
  if (workloadClass.reservedIOPS && currentUsage.iops < workloadClass.reservedIOPS * 0.8) {
    reservationsMet = false;
    adjustmentNeeded = true;
    recommendations.push(`IOPS below reservation: allocate more resources to meet ${workloadClass.reservedIOPS} IOPS guarantee`);
  }

  if (workloadClass.reservedBandwidth && currentUsage.bandwidth < workloadClass.reservedBandwidth * 0.8) {
    reservationsMet = false;
    adjustmentNeeded = true;
    recommendations.push(`Bandwidth below reservation: allocate more resources to meet ${formatBandwidth(workloadClass.reservedBandwidth)} guarantee`);
  }

  return {
    withinLimits,
    reservationsMet,
    adjustmentNeeded,
    recommendations,
  };
}

/**
 * Gets metrics for a workload class
 *
 * @param workloadClass - Workload class
 * @param volumeMetrics - Map of volume ID to current metrics
 * @returns Aggregated workload metrics
 */
export function getWorkloadMetrics(
  workloadClass: WorkloadClass,
  volumeMetrics: Map<string, { iops: number; bandwidth: number; latency: number; queueDepth: number }>
): WorkloadMetrics {
  let totalIOPS = 0;
  let totalBandwidth = 0;
  let totalLatency = 0;
  let totalQueueDepth = 0;
  let volumeCount = 0;

  for (const volumeId of workloadClass.volumeIds) {
    const metrics = volumeMetrics.get(volumeId);
    if (metrics) {
      totalIOPS += metrics.iops;
      totalBandwidth += metrics.bandwidth;
      totalLatency += metrics.latency;
      totalQueueDepth += metrics.queueDepth;
      volumeCount++;
    }
  }

  const avgLatency = volumeCount > 0 ? totalLatency / volumeCount : 0;
  const utilizationPercent = workloadClass.maxIOPS
    ? (totalIOPS / workloadClass.maxIOPS) * 100
    : 0;

  return {
    classId: workloadClass.classId,
    volumeCount: workloadClass.volumeIds.length,
    currentIOPS: totalIOPS,
    currentBandwidth: totalBandwidth,
    avgLatency,
    queueDepth: totalQueueDepth,
    utilizationPercent,
    timestamp: new Date(),
  };
}

// ============================================================================
// SLA Enforcement Functions (4 functions)
// ============================================================================

/**
 * Creates an SLA target definition
 *
 * @param slaName - Name of the SLA
 * @param volumeIds - Volumes covered by this SLA
 * @param targets - SLA targets
 * @param complianceWindow - Compliance measurement window in seconds
 * @returns New SLA target
 */
export function createSLATarget(
  slaName: string,
  volumeIds: string[],
  targets: {
    minIOPS?: number;
    minBandwidth?: number;
    maxLatency?: number;
    availability?: number;
  },
  complianceWindow: number = 3600
): SLATarget {
  if (volumeIds.length === 0) {
    throw new Error('SLA must cover at least one volume');
  }

  if (targets.availability && (targets.availability < 0 || targets.availability > 100)) {
    throw new Error('Availability must be between 0 and 100');
  }

  if (complianceWindow <= 0) {
    throw new Error('Compliance window must be positive');
  }

  const slaId = `sla-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    slaId,
    slaName,
    volumeIds: [...volumeIds],
    minIOPS: targets.minIOPS,
    minBandwidth: targets.minBandwidth,
    maxLatency: targets.maxLatency,
    availability: targets.availability,
    complianceWindow,
    createdAt: new Date(),
  };
}

/**
 * Monitors SLA compliance for a volume
 *
 * @param slaTarget - SLA target to monitor
 * @param volumeId - Volume to monitor
 * @param actualMetrics - Actual performance metrics
 * @param measurementPeriod - Measurement period in seconds
 * @returns SLA metrics with compliance status
 */
export function monitorSLACompliance(
  slaTarget: SLATarget,
  volumeId: string,
  actualMetrics: {
    iops: number;
    bandwidth: number;
    latency: number;
    availability: number;
  },
  measurementPeriod: number
): SLAMetrics {
  if (!slaTarget.volumeIds.includes(volumeId)) {
    throw new Error(`Volume ${volumeId} is not covered by SLA ${slaTarget.slaId}`);
  }

  const now = new Date();
  const measurementStart = new Date(now.getTime() - measurementPeriod * 1000);

  // Calculate compliance score (0-100)
  const scores: number[] = [];

  if (slaTarget.minIOPS) {
    const iopsScore = Math.min(100, (actualMetrics.iops / slaTarget.minIOPS) * 100);
    scores.push(iopsScore);
  }

  if (slaTarget.minBandwidth) {
    const bandwidthScore = Math.min(100, (actualMetrics.bandwidth / slaTarget.minBandwidth) * 100);
    scores.push(bandwidthScore);
  }

  if (slaTarget.maxLatency) {
    const latencyScore = actualMetrics.latency <= slaTarget.maxLatency
      ? 100
      : Math.max(0, 100 - ((actualMetrics.latency - slaTarget.maxLatency) / slaTarget.maxLatency) * 100);
    scores.push(latencyScore);
  }

  if (slaTarget.availability) {
    const availabilityScore = (actualMetrics.availability / slaTarget.availability) * 100;
    scores.push(availabilityScore);
  }

  const complianceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 100;

  let status: SLAStatus;
  if (complianceScore >= 95) {
    status = SLAStatus.Compliant;
  } else if (complianceScore >= 85) {
    status = SLAStatus.AtRisk;
  } else {
    status = SLAStatus.Violated;
  }

  return {
    slaId: slaTarget.slaId,
    volumeId,
    actualIOPS: actualMetrics.iops,
    actualBandwidth: actualMetrics.bandwidth,
    actualLatency: actualMetrics.latency,
    actualAvailability: actualMetrics.availability,
    complianceScore,
    status,
    measurementStart,
    measurementEnd: now,
  };
}

/**
 * Detects SLA violations
 *
 * @param slaTarget - SLA target
 * @param slaMetrics - Current SLA metrics
 * @returns SLA violation if detected, undefined otherwise
 */
export function detectSLAViolation(
  slaTarget: SLATarget,
  slaMetrics: SLAMetrics
): SLAViolation | undefined {
  if (slaMetrics.status === SLAStatus.Compliant) {
    return undefined; // No violation
  }

  let violationType: SLAViolation['violationType'];
  let targetValue: number;
  let actualValue: number;
  let severity: SLAViolation['severity'];

  // Determine violation type and severity
  if (slaTarget.minIOPS && slaMetrics.actualIOPS < slaTarget.minIOPS) {
    violationType = 'iops';
    targetValue = slaTarget.minIOPS;
    actualValue = slaMetrics.actualIOPS;
  } else if (slaTarget.minBandwidth && slaMetrics.actualBandwidth < slaTarget.minBandwidth) {
    violationType = 'bandwidth';
    targetValue = slaTarget.minBandwidth;
    actualValue = slaMetrics.actualBandwidth;
  } else if (slaTarget.maxLatency && slaMetrics.actualLatency > slaTarget.maxLatency) {
    violationType = 'latency';
    targetValue = slaTarget.maxLatency;
    actualValue = slaMetrics.actualLatency;
  } else if (slaTarget.availability && slaMetrics.actualAvailability < slaTarget.availability) {
    violationType = 'availability';
    targetValue = slaTarget.availability;
    actualValue = slaMetrics.actualAvailability;
  } else {
    return undefined; // No specific violation detected
  }

  const deviation = Math.abs(((actualValue - targetValue) / targetValue) * 100);

  if (deviation > 50) {
    severity = 'critical';
  } else if (deviation > 25) {
    severity = 'major';
  } else {
    severity = 'minor';
  }

  const violationId = `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    violationId,
    slaId: slaTarget.slaId,
    volumeId: slaMetrics.volumeId,
    violationType,
    targetValue,
    actualValue,
    deviation,
    detectedAt: new Date(),
    severity,
    description: `SLA violation: ${violationType} target ${targetValue} not met (actual: ${actualValue}, deviation: ${deviation.toFixed(2)}%)`,
  };
}

/**
 * Generates an SLA compliance report
 *
 * @param slaTarget - SLA target
 * @param metricsHistory - Historical SLA metrics
 * @returns SLA compliance report
 */
export function generateSLAReport(
  slaTarget: SLATarget,
  metricsHistory: SLAMetrics[]
): {
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
} {
  if (metricsHistory.length === 0) {
    throw new Error('Cannot generate report with no metrics');
  }

  const compliantMetrics = metricsHistory.filter(m => m.status === SLAStatus.Compliant);
  const overallCompliance = (compliantMetrics.length / metricsHistory.length) * 100;

  const violationCount = metricsHistory.filter(m => m.status === SLAStatus.Violated).length;

  const totalIOPS = metricsHistory.reduce((sum, m) => sum + m.actualIOPS, 0);
  const avgIOPS = totalIOPS / metricsHistory.length;

  const totalBandwidth = metricsHistory.reduce((sum, m) => sum + m.actualBandwidth, 0);
  const avgBandwidth = totalBandwidth / metricsHistory.length;

  const totalLatency = metricsHistory.reduce((sum, m) => sum + m.actualLatency, 0);
  const avgLatency = totalLatency / metricsHistory.length;

  const totalAvailability = metricsHistory.reduce((sum, m) => sum + m.actualAvailability, 0);
  const uptimePercent = totalAvailability / metricsHistory.length;

  const periodStart = metricsHistory[0].measurementStart;
  const periodEnd = metricsHistory[metricsHistory.length - 1].measurementEnd;

  const recommendations: string[] = [];

  if (overallCompliance < 95) {
    recommendations.push('Overall compliance below target - review resource allocation');
  }

  if (slaTarget.minIOPS && avgIOPS < slaTarget.minIOPS * 0.9) {
    recommendations.push(`Average IOPS below target - consider increasing storage performance`);
  }

  if (slaTarget.maxLatency && avgLatency > slaTarget.maxLatency * 0.9) {
    recommendations.push(`Average latency approaching limit - optimize workload or add resources`);
  }

  if (violationCount > metricsHistory.length * 0.05) {
    recommendations.push(`High violation rate (${violationCount} violations) - immediate action required`);
  }

  return {
    slaId: slaTarget.slaId,
    slaName: slaTarget.slaName,
    overallCompliance,
    violationCount,
    uptimePercent,
    avgIOPS,
    avgBandwidth,
    avgLatency,
    periodStart,
    periodEnd,
    recommendations,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculates throttle delay based on excess usage
 */
function calculateThrottleDelay(excessIOPS: number, maxIOPS: number): number {
  // Linear delay calculation: 1ms delay per 1% over limit
  const excessPercent = (excessIOPS / maxIOPS) * 100;
  return Math.min(1000, Math.floor(excessPercent * 10)); // Cap at 1 second
}

/**
 * Calculates bandwidth throttle delay
 */
function calculateBandwidthThrottleDelay(excessBandwidth: number, maxBandwidth: number): number {
  const excessPercent = (excessBandwidth / maxBandwidth) * 100;
  return Math.min(1000, Math.floor(excessPercent * 10)); // Cap at 1 second
}

/**
 * Formats bandwidth for display
 */
function formatBandwidth(bytesPerSec: number): string {
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
  let value = bytesPerSec;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Finds lowest priority IO in queue
 */
function findLowestPriorityIO(ios: QueuedIO[]): QueuedIO | undefined {
  if (ios.length === 0) return undefined;

  return ios.reduce((lowest, current) =>
    comparePriority(current.priority, lowest.priority) < 0 ? current : lowest
  );
}

/**
 * Finds highest priority IO in queue
 */
function findHighestPriorityIO(ios: QueuedIO[]): QueuedIO {
  return ios.reduce((highest, current) =>
    comparePriority(current.priority, highest.priority) > 0 ? current : highest
  );
}

/**
 * Finds IO with earliest deadline
 */
function findEarliestDeadlineIO(ios: QueuedIO[]): QueuedIO {
  return ios.reduce((earliest, current) => {
    if (!current.deadline) return earliest;
    if (!earliest.deadline) return current;
    return current.deadline < earliest.deadline ? current : earliest;
  });
}

/**
 * Compares two priority levels
 * Returns: >0 if p1 > p2, 0 if equal, <0 if p1 < p2
 */
function comparePriority(p1: QoSPriority, p2: QoSPriority): number {
  const priorityOrder = {
    [QoSPriority.Critical]: 4,
    [QoSPriority.High]: 3,
    [QoSPriority.Medium]: 2,
    [QoSPriority.Low]: 1,
    [QoSPriority.BestEffort]: 0,
  };

  return priorityOrder[p1] - priorityOrder[p2];
}

/**
 * Selects workload using round-robin algorithm
 */
function selectRoundRobinWorkload(scheduler: FairScheduler, eligibleWorkloads: string[]): string {
  // Simple round-robin: rotate through eligible workloads
  const lastIndex = scheduler.activeWorkloads.indexOf(eligibleWorkloads[0]);
  const nextIndex = (lastIndex + 1) % eligibleWorkloads.length;
  return eligibleWorkloads[nextIndex];
}

/**
 * Selects workload using weighted fair queuing
 */
function selectWeightedFairWorkload(scheduler: FairScheduler, eligibleWorkloads: string[]): string {
  // Select based on weights - higher weight = higher probability
  const totalWeight = eligibleWorkloads.reduce((sum, wid) => sum + (scheduler.workloadWeights.get(wid) || 1), 0);
  let random = Math.random() * totalWeight;

  for (const workloadId of eligibleWorkloads) {
    const weight = scheduler.workloadWeights.get(workloadId) || 1;
    random -= weight;
    if (random <= 0) {
      return workloadId;
    }
  }

  return eligibleWorkloads[0]; // Fallback
}

/**
 * Calculates fairness score using Jain's fairness index
 * Returns value between 0 (unfair) and 100 (perfectly fair)
 */
function calculateFairnessScore(values: number[]): number {
  if (values.length === 0) return 100;
  if (values.length === 1) return 100;

  const sum = values.reduce((a, b) => a + b, 0);
  const sumSquares = values.reduce((a, b) => a + b * b, 0);

  if (sumSquares === 0) return 100;

  const fairnessIndex = (sum * sum) / (values.length * sumSquares);
  return fairnessIndex * 100;
}
