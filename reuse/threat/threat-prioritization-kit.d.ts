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
    businessHours: {
        start: number;
        end: number;
    };
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
    p1ResponseTime: number;
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
export declare const createPriorityQueue: () => PriorityQueue;
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
export declare const enqueueThreat: (queue: PriorityQueue, threat: QueuedThreat, priorityScore: number) => PriorityQueue;
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
export declare const dequeueThreat: (queue: PriorityQueue, threatId: string) => PriorityQueue;
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
export declare const rebalancePriorityQueue: (queue: PriorityQueue, updatedScores: Record<string, number>) => PriorityQueue;
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
export declare const getNextThreat: (queue: PriorityQueue, skipThreatIds?: string[]) => QueuedThreat | null;
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
export declare const calculateQueueStatistics: (queue: PriorityQueue) => {
    totalThreats: number;
    p1Count: number;
    p2Count: number;
    p3Count: number;
    p4Count: number;
    p5Count: number;
    avgWaitTime: number;
    longestWaitTime: number;
    queueHealth: "HEALTHY" | "WARNING" | "CRITICAL";
};
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
export declare const adjustPriorityForBusinessContext: (basePriority: number, context: BusinessContext, threatTime?: Date) => number;
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
export declare const calculateStakeholderPriority: (affectedStakeholders: Stakeholder[], basePriority: number) => number;
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
export declare const isInCriticalBusinessPeriod: (threatTime: Date, context: BusinessContext) => boolean;
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
export declare const calculateAssetPriorityMultiplier: (affectedAssets: AssetPrioritization[]) => number;
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
export declare const calculateDependencyImpact: (assetId: string, dependencyGraph: Record<string, string[]>) => number;
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
export declare const calculateAssetBasedPriority: (asset: AssetPrioritization, baseThreatScore: number) => number;
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
export declare const calculateTimeUrgency: (params: {
    activeExploit: boolean;
    windowOfOpportunity: number;
    detectionTime: Date;
}) => number;
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
export declare const adjustPriorityForTimeWindow: (basePriority: number, timeWindow: TimeWindow) => number;
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
export declare const calculateAgingDecay: (detectionTime: Date, maxAgeHours?: number) => number;
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
export declare const calculateSLAStatus: (threat: ThreatPriority, slaConfig: SLAConfiguration) => SLAStatus;
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
export declare const determinePriorityLevel: (priorityScore: number) => "P1" | "P2" | "P3" | "P4" | "P5";
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
export declare const calculateSLADueDate: (priorityLevel: "P1" | "P2" | "P3" | "P4" | "P5", slaConfig: SLAConfiguration, startTime?: Date) => Date;
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
export declare const requiresSLAEscalation: (slaStatus: SLAStatus) => boolean;
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
export declare const evaluateTriageRule: (rule: TriageRule, threatData: Record<string, unknown>) => boolean;
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
export declare const applyTriageRules: (threatData: Record<string, unknown>, rules: TriageRule[]) => TriageAction[];
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
export declare const createAutoAssignmentRule: (name: string, conditions: TriageCondition[], assignToRole: string) => TriageRule;
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
export declare const shouldEscalateThreat: (threat: ThreatPriority, slaStatus: SLAStatus, queueWaitTime: number) => boolean;
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
export declare const calculateEscalationLevel: (threat: ThreatPriority, currentLevel: number, policy: EscalationPolicy) => number;
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
export declare const executeEscalationPolicy: (threat: ThreatPriority, policy: EscalationPolicy, escalationLevel: number) => {
    notifyRoles: string[];
    notifyUsers: string[];
    actions: string[];
    delayMinutes: number;
};
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
export declare const calculateComprehensivePriority: (params: {
    threatScore: number;
    businessImpact: number;
    assetCriticality: number;
    timeUrgency: number;
    slaCompliance: number;
}, weights?: PriorityWeights) => PriorityScore;
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
export declare const createThreatPrioritizationService: () => string;
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
export declare const createThreatPriorityModel: () => string;
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
export declare const createPrioritizationSwagger: () => string;
declare const _default: {
    createPriorityQueue: () => PriorityQueue;
    enqueueThreat: (queue: PriorityQueue, threat: QueuedThreat, priorityScore: number) => PriorityQueue;
    dequeueThreat: (queue: PriorityQueue, threatId: string) => PriorityQueue;
    rebalancePriorityQueue: (queue: PriorityQueue, updatedScores: Record<string, number>) => PriorityQueue;
    getNextThreat: (queue: PriorityQueue, skipThreatIds?: string[]) => QueuedThreat | null;
    calculateQueueStatistics: (queue: PriorityQueue) => {
        totalThreats: number;
        p1Count: number;
        p2Count: number;
        p3Count: number;
        p4Count: number;
        p5Count: number;
        avgWaitTime: number;
        longestWaitTime: number;
        queueHealth: "HEALTHY" | "WARNING" | "CRITICAL";
    };
    adjustPriorityForBusinessContext: (basePriority: number, context: BusinessContext, threatTime?: Date) => number;
    calculateStakeholderPriority: (affectedStakeholders: Stakeholder[], basePriority: number) => number;
    isInCriticalBusinessPeriod: (threatTime: Date, context: BusinessContext) => boolean;
    calculateAssetPriorityMultiplier: (affectedAssets: AssetPrioritization[]) => number;
    calculateDependencyImpact: (assetId: string, dependencyGraph: Record<string, string[]>) => number;
    calculateAssetBasedPriority: (asset: AssetPrioritization, baseThreatScore: number) => number;
    calculateTimeUrgency: (params: {
        activeExploit: boolean;
        windowOfOpportunity: number;
        detectionTime: Date;
    }) => number;
    adjustPriorityForTimeWindow: (basePriority: number, timeWindow: TimeWindow) => number;
    calculateAgingDecay: (detectionTime: Date, maxAgeHours?: number) => number;
    calculateSLAStatus: (threat: ThreatPriority, slaConfig: SLAConfiguration) => SLAStatus;
    determinePriorityLevel: (priorityScore: number) => "P1" | "P2" | "P3" | "P4" | "P5";
    calculateSLADueDate: (priorityLevel: "P1" | "P2" | "P3" | "P4" | "P5", slaConfig: SLAConfiguration, startTime?: Date) => Date;
    requiresSLAEscalation: (slaStatus: SLAStatus) => boolean;
    evaluateTriageRule: (rule: TriageRule, threatData: Record<string, unknown>) => boolean;
    applyTriageRules: (threatData: Record<string, unknown>, rules: TriageRule[]) => TriageAction[];
    createAutoAssignmentRule: (name: string, conditions: TriageCondition[], assignToRole: string) => TriageRule;
    shouldEscalateThreat: (threat: ThreatPriority, slaStatus: SLAStatus, queueWaitTime: number) => boolean;
    calculateEscalationLevel: (threat: ThreatPriority, currentLevel: number, policy: EscalationPolicy) => number;
    executeEscalationPolicy: (threat: ThreatPriority, policy: EscalationPolicy, escalationLevel: number) => {
        notifyRoles: string[];
        notifyUsers: string[];
        actions: string[];
        delayMinutes: number;
    };
    calculateComprehensivePriority: (params: {
        threatScore: number;
        businessImpact: number;
        assetCriticality: number;
        timeUrgency: number;
        slaCompliance: number;
    }, weights?: PriorityWeights) => PriorityScore;
    createThreatPrioritizationService: () => string;
    createThreatPriorityModel: () => string;
    createPrioritizationSwagger: () => string;
};
export default _default;
//# sourceMappingURL=threat-prioritization-kit.d.ts.map