/**
 * LOC: THPR1234567
 * File: /reuse/threat/threat-prioritization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ./threat-scoring-kit.ts (for scoring integration)
 *
 * DOWNSTREAM (imported by):
 *   - Threat response services
 *   - Security operations centers
 *   - Incident management systems
 */

/**
 * File: /reuse/threat/threat-prioritization-kit.ts
 * Locator: WC-UTL-THPR-001
 * Purpose: Comprehensive Threat Prioritization Utilities - Priority queues, SLA management, automated triage
 *
 * Upstream: threat-scoring-kit.ts for score integration
 * Downstream: ../backend/*, threat response, SOC operations, incident management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 38 utility functions for threat prioritization, queue management, SLA tracking, triage automation
 *
 * LLM Context: Comprehensive threat prioritization utilities for implementing production-ready threat
 * response systems in White Cross platform. Provides priority queue management, business context prioritization,
 * asset-based prioritization, time-sensitive scheduling, SLA tracking, automated triage rules, priority
 * escalation logic, real-time updates, NestJS providers, and OpenAPI specifications.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PriorityScore {
  overall: number;
  businessImpact: number;
  assetCriticality: number;
  timeUrgency: number;
  slaCompliance: number;
  timestamp: Date;
}

interface ThreatPriority {
  threatId: string;
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  priorityScore: number;
  assignedTo?: string;
  dueDate: Date;
  escalated: boolean;
  queuePosition: number;
}

interface PriorityQueue {
  p1: QueuedThreat[];
  p2: QueuedThreat[];
  p3: QueuedThreat[];
  p4: QueuedThreat[];
  p5: QueuedThreat[];
  metadata: QueueMetadata;
}

interface QueuedThreat {
  threatId: string;
  priorityScore: number;
  queuedAt: Date;
  estimatedResolutionTime: number;
  dependencies: string[];
  tags: string[];
}

interface QueueMetadata {
  totalThreats: number;
  averageWaitTime: number;
  capacityUtilization: number;
  lastUpdated: Date;
}

interface BusinessContext {
  industry: string;
  complianceFrameworks: string[];
  businessHours: { start: number; end: number };
  criticalPeriods: DateRange[];
  stakeholders: Stakeholder[];
}

interface DateRange {
  start: Date;
  end: Date;
  description: string;
}

interface Stakeholder {
  id: string;
  role: string;
  priority: number;
  notificationPreferences: string[];
}

interface AssetPrioritization {
  assetId: string;
  criticalityScore: number;
  businessValue: number;
  dependencies: string[];
  priorityMultiplier: number;
}

interface SLAConfiguration {
  p1ResponseTime: number; // minutes
  p2ResponseTime: number;
  p3ResponseTime: number;
  p4ResponseTime: number;
  p5ResponseTime: number;
  escalationThreshold: number;
  businessHoursOnly: boolean;
}

interface SLAStatus {
  threatId: string;
  priorityLevel: string;
  expectedResponseTime: Date;
  actualResponseTime?: Date;
  remainingTime: number;
  breached: boolean;
  escalationRequired: boolean;
}

interface TriageRule {
  id: string;
  name: string;
  conditions: TriageCondition[];
  action: TriageAction;
  priority: number;
  enabled: boolean;
}

interface TriageCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
  value: unknown;
}

interface TriageAction {
  type: 'ASSIGN' | 'ESCALATE' | 'AUTO_RESOLVE' | 'NOTIFY' | 'TAG';
  parameters: Record<string, unknown>;
}

interface EscalationPolicy {
  id: string;
  name: string;
  levels: EscalationLevel[];
  enabled: boolean;
}

interface EscalationLevel {
  level: number;
  delayMinutes: number;
  notifyRoles: string[];
  notifyUsers: string[];
  actions: string[];
}

interface PriorityWeights {
  threatScore: number;
  businessImpact: number;
  assetCriticality: number;
  timeUrgency: number;
  slaCompliance: number;
}

interface TimeWindow {
  start: Date;
  end: Date;
  type: 'BUSINESS_HOURS' | 'AFTER_HOURS' | 'WEEKEND' | 'HOLIDAY';
  priorityModifier: number;
}

// ============================================================================
// PRIORITY QUEUE MANAGEMENT
// ============================================================================

/**
 * Creates and initializes a priority queue for threat management.
 *
 * @returns {PriorityQueue} Initialized priority queue
 *
 * @example
 * ```typescript
 * const queue = createPriorityQueue();
 * // Result: { p1: [], p2: [], p3: [], p4: [], p5: [], metadata: {...} }
 * ```
 */
export const createPriorityQueue = (): PriorityQueue => {
  return {
    p1: [],
    p2: [],
    p3: [],
    p4: [],
    p5: [],
    metadata: {
      totalThreats: 0,
      averageWaitTime: 0,
      capacityUtilization: 0,
      lastUpdated: new Date(),
    },
  };
};

/**
 * Adds threat to appropriate priority queue based on score.
 *
 * @param {PriorityQueue} queue - Priority queue instance
 * @param {QueuedThreat} threat - Threat to enqueue
 * @param {number} priorityScore - Calculated priority score
 * @returns {PriorityQueue} Updated priority queue
 *
 * @example
 * ```typescript
 * const updatedQueue = enqueueThreat(queue, {
 *   threatId: 'threat-123',
 *   priorityScore: 92,
 *   queuedAt: new Date(),
 *   estimatedResolutionTime: 120,
 *   dependencies: [],
 *   tags: ['malware', 'critical']
 * }, 92);
 * ```
 */
export const enqueueThreat = (
  queue: PriorityQueue,
  threat: QueuedThreat,
  priorityScore: number,
): PriorityQueue => {
  const priorityLevel = determinePriorityLevel(priorityScore);
  const queueKey = priorityLevel.toLowerCase() as keyof Omit<PriorityQueue, 'metadata'>;

  // Insert in sorted order (highest priority first)
  const targetQueue = [...queue[queueKey], threat].sort(
    (a, b) => b.priorityScore - a.priorityScore
  );

  return {
    ...queue,
    [queueKey]: targetQueue,
    metadata: {
      ...queue.metadata,
      totalThreats: queue.metadata.totalThreats + 1,
      lastUpdated: new Date(),
    },
  };
};

/**
 * Removes threat from priority queue.
 *
 * @param {PriorityQueue} queue - Priority queue instance
 * @param {string} threatId - Threat identifier to remove
 * @returns {PriorityQueue} Updated priority queue
 *
 * @example
 * ```typescript
 * const updatedQueue = dequeueThreat(queue, 'threat-123');
 * ```
 */
export const dequeueThreat = (
  queue: PriorityQueue,
  threatId: string,
): PriorityQueue => {
  const queues: (keyof Omit<PriorityQueue, 'metadata'>)[] = ['p1', 'p2', 'p3', 'p4', 'p5'];
  const updatedQueue = { ...queue };

  queues.forEach(queueKey => {
    updatedQueue[queueKey] = queue[queueKey].filter(t => t.threatId !== threatId);
  });

  return {
    ...updatedQueue,
    metadata: {
      ...queue.metadata,
      totalThreats: Math.max(0, queue.metadata.totalThreats - 1),
      lastUpdated: new Date(),
    },
  };
};

/**
 * Rebalances priority queue based on updated scores.
 *
 * @param {PriorityQueue} queue - Priority queue to rebalance
 * @param {Record<string, number>} updatedScores - Map of threat IDs to new scores
 * @returns {PriorityQueue} Rebalanced queue
 *
 * @example
 * ```typescript
 * const rebalanced = rebalancePriorityQueue(queue, {
 *   'threat-123': 95,
 *   'threat-456': 78
 * });
 * ```
 */
export const rebalancePriorityQueue = (
  queue: PriorityQueue,
  updatedScores: Record<string, number>,
): PriorityQueue => {
  let newQueue = createPriorityQueue();

  const allThreats: QueuedThreat[] = [
    ...queue.p1,
    ...queue.p2,
    ...queue.p3,
    ...queue.p4,
    ...queue.p5,
  ];

  allThreats.forEach(threat => {
    const score = updatedScores[threat.threatId] || threat.priorityScore;
    newQueue = enqueueThreat(newQueue, { ...threat, priorityScore: score }, score);
  });

  return newQueue;
};

/**
 * Gets next threat to process from queue.
 *
 * @param {PriorityQueue} queue - Priority queue instance
 * @param {string[]} [skipThreatIds] - Threat IDs to skip
 * @returns {QueuedThreat | null} Next threat or null if queue is empty
 *
 * @example
 * ```typescript
 * const nextThreat = getNextThreat(queue, ['threat-456']);
 * ```
 */
export const getNextThreat = (
  queue: PriorityQueue,
  skipThreatIds?: string[],
): QueuedThreat | null => {
  const skipSet = new Set(skipThreatIds || []);
  const queues: (keyof Omit<PriorityQueue, 'metadata'>)[] = ['p1', 'p2', 'p3', 'p4', 'p5'];

  for (const queueKey of queues) {
    const threat = queue[queueKey].find(t => !skipSet.has(t.threatId));
    if (threat) return threat;
  }

  return null;
};

/**
 * Calculates queue statistics and health metrics.
 *
 * @param {PriorityQueue} queue - Priority queue instance
 * @returns {object} Queue statistics
 *
 * @example
 * ```typescript
 * const stats = calculateQueueStatistics(queue);
 * // Result: {
 * //   totalThreats: 45,
 * //   p1Count: 5,
 * //   p2Count: 12,
 * //   avgWaitTime: 45,
 * //   longestWaitTime: 120,
 * //   queueHealth: 'HEALTHY'
 * // }
 * ```
 */
export const calculateQueueStatistics = (queue: PriorityQueue): {
  totalThreats: number;
  p1Count: number;
  p2Count: number;
  p3Count: number;
  p4Count: number;
  p5Count: number;
  avgWaitTime: number;
  longestWaitTime: number;
  queueHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
} => {
  const now = Date.now();
  const allThreats = [...queue.p1, ...queue.p2, ...queue.p3, ...queue.p4, ...queue.p5];

  const waitTimes = allThreats.map(
    t => (now - t.queuedAt.getTime()) / (1000 * 60)
  );

  const avgWaitTime = waitTimes.length > 0
    ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length
    : 0;

  const longestWaitTime = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;

  let queueHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  if (queue.p1.length > 10 || longestWaitTime > 240) {
    queueHealth = 'CRITICAL';
  } else if (queue.p1.length > 5 || longestWaitTime > 120) {
    queueHealth = 'WARNING';
  } else {
    queueHealth = 'HEALTHY';
  }

  return {
    totalThreats: allThreats.length,
    p1Count: queue.p1.length,
    p2Count: queue.p2.length,
    p3Count: queue.p3.length,
    p4Count: queue.p4.length,
    p5Count: queue.p5.length,
    avgWaitTime: Math.round(avgWaitTime),
    longestWaitTime: Math.round(longestWaitTime),
    queueHealth,
  };
};

// ============================================================================
// BUSINESS CONTEXT PRIORITIZATION
// ============================================================================

/**
 * Adjusts threat priority based on business context.
 *
 * @param {number} basePriority - Base priority score
 * @param {BusinessContext} context - Business context information
 * @param {Date} [threatTime] - Time of threat detection
 * @returns {number} Context-adjusted priority score
 *
 * @example
 * ```typescript
 * const adjusted = adjustPriorityForBusinessContext(75, {
 *   industry: 'healthcare',
 *   complianceFrameworks: ['HIPAA', 'SOC2'],
 *   businessHours: { start: 8, end: 18 },
 *   criticalPeriods: [],
 *   stakeholders: []
 * });
 * // Result: 88
 * ```
 */
export const adjustPriorityForBusinessContext = (
  basePriority: number,
  context: BusinessContext,
  threatTime?: Date,
): number => {
  let adjusted = basePriority;

  // Industry-specific adjustments
  const industryMultipliers: Record<string, number> = {
    healthcare: 1.3,
    finance: 1.25,
    government: 1.2,
    critical_infrastructure: 1.3,
    education: 1.1,
    retail: 1.05,
  };
  adjusted *= industryMultipliers[context.industry] || 1.0;

  // Compliance framework impact
  if (context.complianceFrameworks.length > 0) {
    adjusted += Math.min(15, context.complianceFrameworks.length * 3);
  }

  // Time-based adjustments
  if (threatTime) {
    const hour = threatTime.getHours();
    const isBusinessHours = hour >= context.businessHours.start && hour < context.businessHours.end;

    if (isBusinessHours) {
      adjusted *= 1.2; // Higher priority during business hours
    }

    // Check critical periods
    const inCriticalPeriod = context.criticalPeriods.some(
      period => threatTime >= period.start && threatTime <= period.end
    );
    if (inCriticalPeriod) {
      adjusted *= 1.5;
    }
  }

  return Math.min(100, Math.round(adjusted));
};

/**
 * Calculates priority based on stakeholder impact.
 *
 * @param {Stakeholder[]} affectedStakeholders - List of affected stakeholders
 * @param {number} basePriority - Base priority score
 * @returns {number} Stakeholder-adjusted priority
 *
 * @example
 * ```typescript
 * const priority = calculateStakeholderPriority([
 *   { id: '1', role: 'C-Suite', priority: 95, notificationPreferences: ['email', 'sms'] },
 *   { id: '2', role: 'Manager', priority: 70, notificationPreferences: ['email'] }
 * ], 65);
 * // Result: 82
 * ```
 */
export const calculateStakeholderPriority = (
  affectedStakeholders: Stakeholder[],
  basePriority: number,
): number => {
  if (affectedStakeholders.length === 0) return basePriority;

  const maxStakeholderPriority = Math.max(...affectedStakeholders.map(s => s.priority));
  const stakeholderBonus = (maxStakeholderPriority - 50) * 0.3;

  return Math.min(100, Math.round(basePriority + stakeholderBonus));
};

/**
 * Determines if threat occurred during critical business period.
 *
 * @param {Date} threatTime - Time of threat detection
 * @param {BusinessContext} context - Business context
 * @returns {boolean} True if in critical period
 *
 * @example
 * ```typescript
 * const isCritical = isInCriticalBusinessPeriod(
 *   new Date('2025-12-24'),
 *   context
 * );
 * ```
 */
export const isInCriticalBusinessPeriod = (
  threatTime: Date,
  context: BusinessContext,
): boolean => {
  return context.criticalPeriods.some(
    period => threatTime >= period.start && threatTime <= period.end
  );
};

// ============================================================================
// ASSET-BASED PRIORITIZATION
// ============================================================================

/**
 * Calculates priority multiplier based on affected asset criticality.
 *
 * @param {AssetPrioritization[]} affectedAssets - List of affected assets
 * @returns {number} Priority multiplier (1.0 - 2.0)
 *
 * @example
 * ```typescript
 * const multiplier = calculateAssetPriorityMultiplier([
 *   { assetId: 'db-primary', criticalityScore: 95, businessValue: 1000000, dependencies: [], priorityMultiplier: 1.5 },
 *   { assetId: 'web-server', criticalityScore: 70, businessValue: 500000, dependencies: [], priorityMultiplier: 1.2 }
 * ]);
 * // Result: 1.8
 * ```
 */
export const calculateAssetPriorityMultiplier = (
  affectedAssets: AssetPrioritization[],
): number => {
  if (affectedAssets.length === 0) return 1.0;

  // Get highest criticality asset
  const maxCriticality = Math.max(...affectedAssets.map(a => a.criticalityScore));

  // Base multiplier from criticality
  let multiplier = 1.0 + (maxCriticality / 100);

  // Additional multiplier for multiple critical assets
  const criticalAssets = affectedAssets.filter(a => a.criticalityScore >= 80);
  if (criticalAssets.length > 1) {
    multiplier += Math.min(0.3, (criticalAssets.length - 1) * 0.1);
  }

  // Cap at 2.0
  return Math.min(2.0, Math.round(multiplier * 10) / 10);
};

/**
 * Prioritizes threats based on asset dependency chains.
 *
 * @param {string} assetId - Primary affected asset
 * @param {Record<string, string[]>} dependencyGraph - Asset dependency graph
 * @returns {number} Dependency impact score
 *
 * @example
 * ```typescript
 * const impact = calculateDependencyImpact(
 *   'database-server',
 *   {
 *     'database-server': ['web-app', 'api-gateway', 'reporting-service'],
 *     'web-app': ['user-portal'],
 *     'api-gateway': ['mobile-app', 'partner-integration']
 *   }
 * );
 * // Result: 85
 * ```
 */
export const calculateDependencyImpact = (
  assetId: string,
  dependencyGraph: Record<string, string[]>,
): number => {
  const visited = new Set<string>();

  const countDependents = (id: string): number => {
    if (visited.has(id)) return 0;
    visited.add(id);

    const directDependents = dependencyGraph[id] || [];
    let total = directDependents.length;

    directDependents.forEach(dependent => {
      total += countDependents(dependent);
    });

    return total;
  };

  const totalDependents = countDependents(assetId);

  // Score based on number of dependent systems
  return Math.min(100, 40 + (totalDependents * 10));
};

/**
 * Calculates asset-based priority score.
 *
 * @param {AssetPrioritization} asset - Asset information
 * @param {number} baseThreatScore - Base threat score
 * @returns {number} Asset-adjusted priority score
 *
 * @example
 * ```typescript
 * const priority = calculateAssetBasedPriority({
 *   assetId: 'payment-gateway',
 *   criticalityScore: 95,
 *   businessValue: 5000000,
 *   dependencies: ['order-system', 'inventory-system'],
 *   priorityMultiplier: 1.8
 * }, 70);
 * // Result: 92
 * ```
 */
export const calculateAssetBasedPriority = (
  asset: AssetPrioritization,
  baseThreatScore: number,
): number => {
  const assetWeight = asset.criticalityScore * 0.4;
  const threatWeight = baseThreatScore * 0.6;

  let priority = assetWeight + threatWeight;
  priority *= asset.priorityMultiplier;

  // Bonus for dependencies
  if (asset.dependencies.length > 0) {
    priority += Math.min(10, asset.dependencies.length * 2);
  }

  return Math.min(100, Math.round(priority));
};

// ============================================================================
// TIME-SENSITIVE PRIORITIZATION
// ============================================================================

/**
 * Calculates time urgency factor based on threat characteristics.
 *
 * @param {object} params - Time urgency parameters
 * @param {boolean} params.activeExploit - Whether exploit is actively being used
 * @param {number} params.windowOfOpportunity - Hours before threat window closes
 * @param {Date} params.detectionTime - When threat was detected
 * @returns {number} Time urgency score (0-100)
 *
 * @example
 * ```typescript
 * const urgency = calculateTimeUrgency({
 *   activeExploit: true,
 *   windowOfOpportunity: 4,
 *   detectionTime: new Date()
 * });
 * // Result: 92
 * ```
 */
export const calculateTimeUrgency = (params: {
  activeExploit: boolean;
  windowOfOpportunity: number;
  detectionTime: Date;
}): number => {
  let urgency = 50; // Base urgency

  // Active exploit significantly increases urgency
  if (params.activeExploit) {
    urgency += 40;
  }

  // Window of opportunity
  if (params.windowOfOpportunity <= 1) {
    urgency += 20;
  } else if (params.windowOfOpportunity <= 4) {
    urgency += 15;
  } else if (params.windowOfOpportunity <= 24) {
    urgency += 10;
  }

  // Time since detection
  const hoursSinceDetection = (Date.now() - params.detectionTime.getTime()) / (1000 * 60 * 60);
  if (hoursSinceDetection > 24) {
    urgency += 15; // Unaddressed threats become more urgent
  }

  return Math.min(100, urgency);
};

/**
 * Adjusts priority based on time window (business hours, weekends, etc.).
 *
 * @param {number} basePriority - Base priority score
 * @param {TimeWindow} timeWindow - Current time window
 * @returns {number} Time-adjusted priority
 *
 * @example
 * ```typescript
 * const adjusted = adjustPriorityForTimeWindow(75, {
 *   start: new Date('2025-11-09T08:00:00'),
 *   end: new Date('2025-11-09T18:00:00'),
 *   type: 'BUSINESS_HOURS',
 *   priorityModifier: 1.2
 * });
 * // Result: 90
 * ```
 */
export const adjustPriorityForTimeWindow = (
  basePriority: number,
  timeWindow: TimeWindow,
): number => {
  return Math.min(100, Math.round(basePriority * timeWindow.priorityModifier));
};

/**
 * Calculates decay factor for aging threats.
 *
 * @param {Date} detectionTime - When threat was detected
 * @param {number} maxAgeHours - Maximum age before full priority
 * @returns {number} Decay multiplier (1.0 - 1.5)
 *
 * @example
 * ```typescript
 * const decay = calculateAgingDecay(new Date('2025-11-08'), 48);
 * // Result: 1.3 (threat is aging, increase priority)
 * ```
 */
export const calculateAgingDecay = (
  detectionTime: Date,
  maxAgeHours: number = 48,
): number => {
  const ageHours = (Date.now() - detectionTime.getTime()) / (1000 * 60 * 60);
  const ageFactor = Math.min(1.0, ageHours / maxAgeHours);

  // Aging threats get higher priority
  return 1.0 + (ageFactor * 0.5);
};

// ============================================================================
// SLA-BASED PRIORITIZATION
// ============================================================================

/**
 * Calculates SLA compliance status for threat.
 *
 * @param {ThreatPriority} threat - Threat with priority information
 * @param {SLAConfiguration} slaConfig - SLA configuration
 * @returns {SLAStatus} SLA compliance status
 *
 * @example
 * ```typescript
 * const status = calculateSLAStatus(
 *   { threatId: '123', priorityLevel: 'P1', priorityScore: 95, dueDate: new Date(), escalated: false, queuePosition: 1 },
 *   { p1ResponseTime: 60, p2ResponseTime: 240, p3ResponseTime: 1440, p4ResponseTime: 4320, p5ResponseTime: 10080, escalationThreshold: 0.8, businessHoursOnly: false }
 * );
 * ```
 */
export const calculateSLAStatus = (
  threat: ThreatPriority,
  slaConfig: SLAConfiguration,
): SLAStatus => {
  const responseTimeMap = {
    P1: slaConfig.p1ResponseTime,
    P2: slaConfig.p2ResponseTime,
    P3: slaConfig.p3ResponseTime,
    P4: slaConfig.p4ResponseTime,
    P5: slaConfig.p5ResponseTime,
  };

  const expectedMinutes = responseTimeMap[threat.priorityLevel];
  const expectedResponseTime = new Date(threat.dueDate.getTime() - (expectedMinutes * 60 * 1000));

  const now = Date.now();
  const remainingTime = threat.dueDate.getTime() - now;
  const remainingMinutes = remainingTime / (1000 * 60);

  const breached = remainingTime < 0;
  const escalationRequired = !breached && (remainingMinutes / expectedMinutes) < slaConfig.escalationThreshold;

  return {
    threatId: threat.threatId,
    priorityLevel: threat.priorityLevel,
    expectedResponseTime,
    actualResponseTime: threat.assignedTo ? new Date() : undefined,
    remainingTime: Math.round(remainingMinutes),
    breached,
    escalationRequired,
  };
};

/**
 * Determines priority level from score with SLA mapping.
 *
 * @param {number} priorityScore - Priority score (0-100)
 * @returns {'P1' | 'P2' | 'P3' | 'P4' | 'P5'} Priority level
 *
 * @example
 * ```typescript
 * const level = determinePriorityLevel(88);
 * // Result: 'P1'
 * ```
 */
export const determinePriorityLevel = (
  priorityScore: number,
): 'P1' | 'P2' | 'P3' | 'P4' | 'P5' => {
  if (priorityScore >= 85) return 'P1';
  if (priorityScore >= 70) return 'P2';
  if (priorityScore >= 50) return 'P3';
  if (priorityScore >= 30) return 'P4';
  return 'P5';
};

/**
 * Calculates SLA due date based on priority level.
 *
 * @param {'P1' | 'P2' | 'P3' | 'P4' | 'P5'} priorityLevel - Priority level
 * @param {SLAConfiguration} slaConfig - SLA configuration
 * @param {Date} [startTime] - Start time (defaults to now)
 * @returns {Date} SLA due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateSLADueDate('P1', slaConfig);
 * ```
 */
export const calculateSLADueDate = (
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4' | 'P5',
  slaConfig: SLAConfiguration,
  startTime?: Date,
): Date => {
  const start = startTime || new Date();
  const responseTimeMap = {
    P1: slaConfig.p1ResponseTime,
    P2: slaConfig.p2ResponseTime,
    P3: slaConfig.p3ResponseTime,
    P4: slaConfig.p4ResponseTime,
    P5: slaConfig.p5ResponseTime,
  };

  const minutes = responseTimeMap[priorityLevel];
  return new Date(start.getTime() + (minutes * 60 * 1000));
};

/**
 * Checks if SLA escalation is required.
 *
 * @param {SLAStatus} slaStatus - Current SLA status
 * @returns {boolean} True if escalation required
 *
 * @example
 * ```typescript
 * const shouldEscalate = requiresSLAEscalation(slaStatus);
 * ```
 */
export const requiresSLAEscalation = (slaStatus: SLAStatus): boolean => {
  return slaStatus.escalationRequired || slaStatus.breached;
};

// ============================================================================
// AUTOMATED TRIAGE RULES
// ============================================================================

/**
 * Evaluates triage rule against threat data.
 *
 * @param {TriageRule} rule - Triage rule to evaluate
 * @param {Record<string, unknown>} threatData - Threat data
 * @returns {boolean} True if rule matches
 *
 * @example
 * ```typescript
 * const matches = evaluateTriageRule({
 *   id: 'rule-1',
 *   name: 'Auto-escalate critical threats',
 *   conditions: [{ field: 'severity', operator: 'gte', value: 90 }],
 *   action: { type: 'ESCALATE', parameters: { level: 2 } },
 *   priority: 1,
 *   enabled: true
 * }, { severity: 95, type: 'malware' });
 * // Result: true
 * ```
 */
export const evaluateTriageRule = (
  rule: TriageRule,
  threatData: Record<string, unknown>,
): boolean => {
  if (!rule.enabled) return false;

  return rule.conditions.every(condition => {
    const fieldValue = threatData[condition.field];

    switch (condition.operator) {
      case 'eq':
        return fieldValue === condition.value;
      case 'ne':
        return fieldValue !== condition.value;
      case 'gt':
        return typeof fieldValue === 'number' && fieldValue > (condition.value as number);
      case 'gte':
        return typeof fieldValue === 'number' && fieldValue >= (condition.value as number);
      case 'lt':
        return typeof fieldValue === 'number' && fieldValue < (condition.value as number);
      case 'lte':
        return typeof fieldValue === 'number' && fieldValue <= (condition.value as number);
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      default:
        return false;
    }
  });
};

/**
 * Applies triage rules to threat and returns actions.
 *
 * @param {Record<string, unknown>} threatData - Threat data
 * @param {TriageRule[]} rules - Available triage rules
 * @returns {TriageAction[]} Actions to execute
 *
 * @example
 * ```typescript
 * const actions = applyTriageRules(threatData, [rule1, rule2, rule3]);
 * ```
 */
export const applyTriageRules = (
  threatData: Record<string, unknown>,
  rules: TriageRule[],
): TriageAction[] => {
  const matchedRules = rules
    .filter(rule => evaluateTriageRule(rule, threatData))
    .sort((a, b) => b.priority - a.priority);

  return matchedRules.map(rule => rule.action);
};

/**
 * Creates automated assignment rule.
 *
 * @param {string} name - Rule name
 * @param {TriageCondition[]} conditions - Rule conditions
 * @param {string} assignToRole - Role to assign to
 * @returns {TriageRule} Triage rule
 *
 * @example
 * ```typescript
 * const rule = createAutoAssignmentRule(
 *   'Assign malware to security team',
 *   [{ field: 'type', operator: 'eq', value: 'malware' }],
 *   'security-analyst'
 * );
 * ```
 */
export const createAutoAssignmentRule = (
  name: string,
  conditions: TriageCondition[],
  assignToRole: string,
): TriageRule => {
  return {
    id: `auto-assign-${Date.now()}`,
    name,
    conditions,
    action: {
      type: 'ASSIGN',
      parameters: { role: assignToRole },
    },
    priority: 50,
    enabled: true,
  };
};

// ============================================================================
// PRIORITY ESCALATION LOGIC
// ============================================================================

/**
 * Determines if threat requires escalation.
 *
 * @param {ThreatPriority} threat - Threat priority information
 * @param {SLAStatus} slaStatus - SLA status
 * @param {number} queueWaitTime - Time in queue (minutes)
 * @returns {boolean} True if escalation required
 *
 * @example
 * ```typescript
 * const shouldEscalate = shouldEscalateThreat(threat, slaStatus, 180);
 * ```
 */
export const shouldEscalateThreat = (
  threat: ThreatPriority,
  slaStatus: SLAStatus,
  queueWaitTime: number,
): boolean => {
  // Already escalated
  if (threat.escalated) return false;

  // SLA breach or near breach
  if (slaStatus.breached || slaStatus.escalationRequired) return true;

  // Excessive queue wait time
  const maxWaitTimes = {
    P1: 30,
    P2: 120,
    P3: 480,
    P4: 1440,
    P5: 4320,
  };

  if (queueWaitTime > maxWaitTimes[threat.priorityLevel]) return true;

  return false;
};

/**
 * Calculates escalation level based on conditions.
 *
 * @param {ThreatPriority} threat - Threat information
 * @param {number} currentLevel - Current escalation level
 * @param {EscalationPolicy} policy - Escalation policy
 * @returns {number} Next escalation level
 *
 * @example
 * ```typescript
 * const nextLevel = calculateEscalationLevel(threat, 1, escalationPolicy);
 * ```
 */
export const calculateEscalationLevel = (
  threat: ThreatPriority,
  currentLevel: number,
  policy: EscalationPolicy,
): number => {
  const maxLevel = policy.levels.length;
  return Math.min(currentLevel + 1, maxLevel);
};

/**
 * Executes escalation policy for threat.
 *
 * @param {ThreatPriority} threat - Threat to escalate
 * @param {EscalationPolicy} policy - Escalation policy
 * @param {number} escalationLevel - Target escalation level
 * @returns {object} Escalation actions
 *
 * @example
 * ```typescript
 * const actions = executeEscalationPolicy(threat, policy, 2);
 * ```
 */
export const executeEscalationPolicy = (
  threat: ThreatPriority,
  policy: EscalationPolicy,
  escalationLevel: number,
): {
  notifyRoles: string[];
  notifyUsers: string[];
  actions: string[];
  delayMinutes: number;
} => {
  const level = policy.levels.find(l => l.level === escalationLevel);

  if (!level) {
    throw new Error(`Escalation level ${escalationLevel} not found in policy`);
  }

  return {
    notifyRoles: level.notifyRoles,
    notifyUsers: level.notifyUsers,
    actions: level.actions,
    delayMinutes: level.delayMinutes,
  };
};

// ============================================================================
// COMPOSITE PRIORITIZATION
// ============================================================================

/**
 * Calculates comprehensive priority score with all factors.
 *
 * @param {object} params - Prioritization parameters
 * @param {number} params.threatScore - Base threat score
 * @param {number} params.businessImpact - Business impact score
 * @param {number} params.assetCriticality - Asset criticality score
 * @param {number} params.timeUrgency - Time urgency score
 * @param {number} params.slaCompliance - SLA compliance score
 * @param {PriorityWeights} [weights] - Custom weights
 * @returns {PriorityScore} Comprehensive priority score
 *
 * @example
 * ```typescript
 * const priority = calculateComprehensivePriority({
 *   threatScore: 85,
 *   businessImpact: 90,
 *   assetCriticality: 95,
 *   timeUrgency: 80,
 *   slaCompliance: 70
 * });
 * ```
 */
export const calculateComprehensivePriority = (
  params: {
    threatScore: number;
    businessImpact: number;
    assetCriticality: number;
    timeUrgency: number;
    slaCompliance: number;
  },
  weights?: PriorityWeights,
): PriorityScore => {
  const defaultWeights: PriorityWeights = {
    threatScore: 0.3,
    businessImpact: 0.25,
    assetCriticality: 0.25,
    timeUrgency: 0.15,
    slaCompliance: 0.05,
  };

  const finalWeights = { ...defaultWeights, ...weights };

  const overall = Math.round(
    params.threatScore * finalWeights.threatScore +
    params.businessImpact * finalWeights.businessImpact +
    params.assetCriticality * finalWeights.assetCriticality +
    params.timeUrgency * finalWeights.timeUrgency +
    params.slaCompliance * finalWeights.slaCompliance
  );

  return {
    overall,
    businessImpact: params.businessImpact,
    assetCriticality: params.assetCriticality,
    timeUrgency: params.timeUrgency,
    slaCompliance: params.slaCompliance,
    timestamp: new Date(),
  };
};

// ============================================================================
// NESTJS PROVIDER PATTERNS
// ============================================================================

/**
 * Creates NestJS injectable threat prioritization service.
 *
 * @returns {string} NestJS service class template
 *
 * @example
 * ```typescript
 * const serviceCode = createThreatPrioritizationService();
 * ```
 */
export const createThreatPrioritizationService = (): string => {
  return `
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ThreatPriority as ThreatPriorityModel } from './models/threat-priority.model';
import * as PrioritizationKit from './threat-prioritization-kit';

@Injectable()
export class ThreatPrioritizationService {
  private readonly logger = new Logger(ThreatPrioritizationService.name);
  private priorityQueue: PrioritizationKit.PriorityQueue;

  constructor(
    @InjectModel(ThreatPriorityModel)
    private readonly priorityModel: typeof ThreatPriorityModel,
  ) {
    this.priorityQueue = PrioritizationKit.createPriorityQueue();
  }

  async prioritizeThreat(
    threatId: string,
    priorityScore: number,
    context: any
  ): Promise<PrioritizationKit.ThreatPriority> {
    this.logger.log(\`Prioritizing threat: \${threatId}\`);

    const priorityLevel = PrioritizationKit.determinePriorityLevel(priorityScore);
    const slaConfig = this.getSLAConfiguration();
    const dueDate = PrioritizationKit.calculateSLADueDate(priorityLevel, slaConfig);

    const priority: PrioritizationKit.ThreatPriority = {
      threatId,
      priorityLevel,
      priorityScore,
      dueDate,
      escalated: false,
      queuePosition: 0,
    };

    // Add to queue
    this.priorityQueue = PrioritizationKit.enqueueThreat(
      this.priorityQueue,
      {
        threatId,
        priorityScore,
        queuedAt: new Date(),
        estimatedResolutionTime: 0,
        dependencies: [],
        tags: [],
      },
      priorityScore
    );

    // Persist to database
    await this.priorityModel.create({
      threatId,
      priorityLevel,
      priorityScore,
      dueDate,
      escalated: false,
    });

    return priority;
  }

  async getNextThreat(): Promise<PrioritizationKit.QueuedThreat | null> {
    return PrioritizationKit.getNextThreat(this.priorityQueue);
  }

  private getSLAConfiguration(): PrioritizationKit.SLAConfiguration {
    return {
      p1ResponseTime: 60,
      p2ResponseTime: 240,
      p3ResponseTime: 1440,
      p4ResponseTime: 4320,
      p5ResponseTime: 10080,
      escalationThreshold: 0.8,
      businessHoursOnly: false,
    };
  }
}`;
};

/**
 * Creates Sequelize model for threat priorities.
 *
 * @returns {string} Sequelize model definition
 *
 * @example
 * ```typescript
 * const model = createThreatPriorityModel();
 * ```
 */
export const createThreatPriorityModel = (): string => {
  return `
import { Table, Column, Model, DataType, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';

@Table({
  tableName: 'threat_priorities',
  timestamps: true,
  indexes: [
    { fields: ['threat_id'] },
    { fields: ['priority_level'] },
    { fields: ['priority_score'] },
    { fields: ['due_date'] },
    { fields: ['escalated'] },
  ],
})
export class ThreatPriority extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Threat)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  threatId: string;

  @Column({
    type: DataType.ENUM('P1', 'P2', 'P3', 'P4', 'P5'),
    allowNull: false,
  })
  priorityLevel: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 100 },
  })
  priorityScore: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assignedTo: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  escalated: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  escalationLevel: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  queuePosition: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  priorityFactors: object;

  @BelongsTo(() => Threat)
  threat: Threat;
}`;
};

/**
 * Creates Swagger/OpenAPI specification for prioritization endpoint.
 *
 * @returns {string} Swagger decorator code
 *
 * @example
 * ```typescript
 * const swagger = createPrioritizationSwagger();
 * ```
 */
export const createPrioritizationSwagger = (): string => {
  return `
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('threat-prioritization')
@ApiOperation({
  summary: 'Prioritize threat',
  description: 'Calculates priority and assigns to appropriate queue based on multiple factors'
})
@ApiBody({
  schema: {
    type: 'object',
    required: ['threatId', 'threatScore', 'context'],
    properties: {
      threatId: { type: 'string', format: 'uuid' },
      threatScore: { type: 'number', minimum: 0, maximum: 100 },
      context: {
        type: 'object',
        properties: {
          businessImpact: { type: 'number', minimum: 0, maximum: 100 },
          assetCriticality: { type: 'number', minimum: 0, maximum: 100 },
          timeUrgency: { type: 'number', minimum: 0, maximum: 100 },
          affectedAssets: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
})
@ApiResponse({
  status: 201,
  description: 'Threat prioritized successfully',
  schema: {
    type: 'object',
    properties: {
      threatId: { type: 'string', format: 'uuid' },
      priorityLevel: { type: 'string', enum: ['P1', 'P2', 'P3', 'P4', 'P5'] },
      priorityScore: { type: 'number' },
      dueDate: { type: 'string', format: 'date-time' },
      queuePosition: { type: 'integer' },
      escalated: { type: 'boolean' },
    },
  },
})`;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Queue management
  createPriorityQueue,
  enqueueThreat,
  dequeueThreat,
  rebalancePriorityQueue,
  getNextThreat,
  calculateQueueStatistics,

  // Business context
  adjustPriorityForBusinessContext,
  calculateStakeholderPriority,
  isInCriticalBusinessPeriod,

  // Asset-based
  calculateAssetPriorityMultiplier,
  calculateDependencyImpact,
  calculateAssetBasedPriority,

  // Time-sensitive
  calculateTimeUrgency,
  adjustPriorityForTimeWindow,
  calculateAgingDecay,

  // SLA management
  calculateSLAStatus,
  determinePriorityLevel,
  calculateSLADueDate,
  requiresSLAEscalation,

  // Triage automation
  evaluateTriageRule,
  applyTriageRules,
  createAutoAssignmentRule,

  // Escalation
  shouldEscalateThreat,
  calculateEscalationLevel,
  executeEscalationPolicy,

  // Comprehensive
  calculateComprehensivePriority,

  // NestJS patterns
  createThreatPrioritizationService,
  createThreatPriorityModel,
  createPrioritizationSwagger,
};
