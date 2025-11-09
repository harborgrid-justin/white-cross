/**
 * LOC: SEVCORR987654
 * File: /reuse/threat/security-event-correlation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Security event correlation services
 *   - SIEM integration modules
 *   - Complex Event Processing (CEP) engines
 *   - Real-time threat detection services
 *   - Incident generation pipelines
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Event correlation type
 */
export declare enum CorrelationType {
    TEMPORAL = "TEMPORAL",
    SPATIAL = "SPATIAL",
    CAUSAL = "CAUSAL",
    BEHAVIORAL = "BEHAVIORAL",
    PATTERN_BASED = "PATTERN_BASED",
    STATISTICAL = "STATISTICAL",
    MULTI_DIMENSIONAL = "MULTI_DIMENSIONAL"
}
/**
 * Correlation window type
 */
export declare enum CorrelationWindow {
    SLIDING = "SLIDING",
    TUMBLING = "TUMBLING",
    SESSION = "SESSION",
    HOPPING = "HOPPING"
}
/**
 * Attack stage
 */
export declare enum AttackStage {
    RECONNAISSANCE = "RECONNAISSANCE",
    WEAPONIZATION = "WEAPONIZATION",
    DELIVERY = "DELIVERY",
    EXPLOITATION = "EXPLOITATION",
    INSTALLATION = "INSTALLATION",
    COMMAND_CONTROL = "COMMAND_CONTROL",
    ACTIONS_ON_OBJECTIVE = "ACTIONS_ON_OBJECTIVE"
}
/**
 * Event severity
 */
export declare enum EventSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Correlation rule action
 */
export declare enum CorrelationRuleAction {
    CREATE_INCIDENT = "CREATE_INCIDENT",
    CREATE_ALERT = "CREATE_ALERT",
    ENRICH_EVENT = "ENRICH_EVENT",
    ESCALATE = "ESCALATE",
    SUPPRESS = "SUPPRESS",
    NOTIFY = "NOTIFY",
    EXECUTE_PLAYBOOK = "EXECUTE_PLAYBOOK"
}
/**
 * Security event interface
 */
export interface SecurityEvent {
    id: string;
    eventType: string;
    source: string;
    timestamp: Date;
    severity: EventSeverity;
    data: Record<string, any>;
    metadata?: Record<string, any>;
    correlationId?: string;
}
/**
 * Correlation result interface
 */
export interface CorrelationResult {
    correlationId: string;
    correlationType: CorrelationType;
    events: SecurityEvent[];
    score: number;
    confidence: number;
    attackStage?: AttackStage;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Time window configuration
 */
export interface TimeWindowConfig {
    windowType: CorrelationWindow;
    duration: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
    slideInterval?: number;
    hopSize?: number;
    sessionTimeout?: number;
}
/**
 * Correlation rule interface
 */
export interface CorrelationRule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    priority: number;
    conditions: CorrelationCondition[];
    actions: CorrelationRuleAction[];
    timeWindow?: TimeWindowConfig;
    threshold?: number;
    metadata?: Record<string, any>;
}
/**
 * Correlation condition interface
 */
export interface CorrelationCondition {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'regex';
    value: any;
    eventType?: string;
    sequence?: number;
}
/**
 * Attack chain interface
 */
export interface AttackChain {
    chainId: string;
    stages: AttackStageEvent[];
    confidence: number;
    severity: EventSeverity;
    targetEntity: string;
    firstSeen: Date;
    lastSeen: Date;
    isComplete: boolean;
}
/**
 * Attack stage event
 */
export interface AttackStageEvent {
    stage: AttackStage;
    events: SecurityEvent[];
    timestamp: Date;
    score: number;
}
/**
 * Event aggregation result
 */
export interface EventAggregation {
    groupKey: string;
    count: number;
    uniqueCount: number;
    firstEvent: Date;
    lastEvent: Date;
    events: SecurityEvent[];
    statistics: AggregationStatistics;
}
/**
 * Aggregation statistics
 */
export interface AggregationStatistics {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    percentile95: number;
    percentile99: number;
}
/**
 * Complex event pattern
 */
export interface ComplexEventPattern {
    patternId: string;
    name: string;
    sequence: PatternSequence[];
    timeConstraints: TimeConstraint[];
    matchCount: number;
    lastMatch?: Date;
}
/**
 * Pattern sequence
 */
export interface PatternSequence {
    order: number;
    eventType: string;
    conditions: Record<string, any>;
    optional?: boolean;
}
/**
 * Time constraint
 */
export interface TimeConstraint {
    fromEvent: number;
    toEvent: number;
    maxDelay: number;
    unit: 'seconds' | 'minutes' | 'hours';
}
/**
 * Incident context
 */
export interface IncidentContext {
    incidentId: string;
    correlationResults: CorrelationResult[];
    attackChains: AttackChain[];
    affectedEntities: string[];
    timeline: TimelineEvent[];
    severity: EventSeverity;
    confidence: number;
}
/**
 * Timeline event
 */
export interface TimelineEvent {
    timestamp: Date;
    eventType: string;
    description: string;
    severity: EventSeverity;
    metadata?: Record<string, any>;
}
/**
 * DTO for event correlation query
 */
export declare class EventCorrelationQueryDto {
    correlationType: CorrelationType;
    startTime: Date;
    endTime: Date;
    threshold?: number;
    eventTypes?: string[];
    filters?: Record<string, any>;
}
/**
 * DTO for correlation rule creation
 */
export declare class CreateCorrelationRuleDto {
    name: string;
    description: string;
    priority: number;
    conditions: CorrelationCondition[];
    actions: CorrelationRuleAction[];
    timeWindow?: TimeWindowConfig;
    threshold?: number;
}
/**
 * DTO for attack chain detection
 */
export declare class AttackChainDetectionDto {
    targetEntity: string;
    startTime: Date;
    endTime: Date;
    minConfidence?: number;
}
/**
 * 1. Perform real-time event correlation using temporal windows
 * Uses optimized Sequelize query with window functions and CTEs
 */
export declare function correlateEventsInTimeWindow(sequelize: Sequelize, config: TimeWindowConfig, eventTypes: string[], options?: {
    threshold?: number;
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 2. Detect multi-stage attack patterns using CEP
 * Complex query with recursive CTEs and pattern matching
 */
export declare function detectMultiStageAttacks(sequelize: Sequelize, targetEntity: string, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<AttackChain[]>;
/**
 * 3. Aggregate events by multiple dimensions with advanced statistics
 * Uses window functions, ROLLUP, and statistical aggregations
 */
export declare function aggregateEventsByDimensions(sequelize: Sequelize, dimensions: string[], timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<EventAggregation[]>;
/**
 * 4. Detect complex event patterns using sequential pattern matching
 * Implements CEP with temporal constraints and pattern matching
 */
export declare function detectComplexEventPatterns(sequelize: Sequelize, pattern: ComplexEventPattern, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 5. Correlate events using statistical anomaly detection
 * Uses Z-score, IQR, and statistical outlier detection
 */
export declare function correlateEventsByStatisticalAnomaly(sequelize: Sequelize, eventType: string, metric: string, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    threshold?: number;
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 6. Generate incidents from correlated events automatically
 * Complex aggregation with incident classification
 */
export declare function generateIncidentsFromCorrelations(sequelize: Sequelize, correlations: CorrelationResult[], options?: {
    transaction?: Transaction;
}): Promise<IncidentContext[]>;
/**
 * 7. Calculate correlation confidence score using multiple factors
 */
export declare function calculateCorrelationConfidence(correlationData: any): number;
/**
 * 8. Calculate window duration in milliseconds
 */
export declare function calculateWindowDuration(duration: number, unit: 'seconds' | 'minutes' | 'hours' | 'days'): number;
/**
 * 9. Create correlation rule with validation
 */
export declare function createCorrelationRule(sequelize: Sequelize, ruleData: CreateCorrelationRuleDto, options?: {
    transaction?: Transaction;
}): Promise<CorrelationRule>;
/**
 * 10. Evaluate correlation rule against events
 */
export declare function evaluateCorrelationRule(sequelize: Sequelize, ruleId: string, events: SecurityEvent[], options?: {
    transaction?: Transaction;
}): Promise<boolean>;
/**
 * 11. Find event clusters using density-based spatial clustering
 */
export declare function findEventClusters(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    epsilon?: number;
    minPoints?: number;
    transaction?: Transaction;
}): Promise<EventAggregation[]>;
/**
 * 12. Detect behavioral anomalies using user/entity behavior analytics (UEBA)
 */
export declare function detectBehavioralAnomalies(sequelize: Sequelize, entityId: string, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 13. Perform lateral movement detection
 */
export declare function detectLateralMovement(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<AttackChain[]>;
/**
 * 14. Detect privilege escalation patterns
 */
export declare function detectPrivilegeEscalation(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 15. Correlate events across multiple data sources
 */
export declare function correlateAcrossDataSources(sequelize: Sequelize, sources: string[], timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 16. Detect data exfiltration patterns
 */
export declare function detectDataExfiltration(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    threshold?: number;
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 17. Find temporal event sequences (sequential patterns)
 */
export declare function findTemporalSequences(sequelize: Sequelize, sequencePattern: string[], timeRange: {
    start: Date;
    end: Date;
}, options?: {
    maxDelay?: number;
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 18. Calculate event velocity and detect spikes
 */
export declare function detectEventVelocitySpikes(sequelize: Sequelize, eventType: string, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    windowMinutes?: number;
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 19. Detect brute force attack patterns
 */
export declare function detectBruteForceAttacks(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    failureThreshold?: number;
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 20. Detect command and control (C2) communication patterns
 */
export declare function detectC2Communication(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<CorrelationResult[]>;
/**
 * 21-45: Additional utility functions for comprehensive event correlation
 */
export declare function getCorrelationRuleById(sequelize: Sequelize, ruleId: string, options?: {
    transaction?: Transaction;
}): Promise<CorrelationRule | null>;
export declare function updateCorrelationRule(sequelize: Sequelize, ruleId: string, updates: Partial<CreateCorrelationRuleDto>, options?: {
    transaction?: Transaction;
}): Promise<boolean>;
export declare function deleteCorrelationRule(sequelize: Sequelize, ruleId: string, options?: {
    transaction?: Transaction;
}): Promise<boolean>;
export declare function listCorrelationRules(sequelize: Sequelize, options?: {
    enabled?: boolean;
    transaction?: Transaction;
}): Promise<CorrelationRule[]>;
export declare function getCorrelationStats(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<any>;
export declare function purgeOldCorrelations(sequelize: Sequelize, retentionDays: number, options?: {
    transaction?: Transaction;
}): Promise<number>;
export declare function formatCorrelationForDisplay(correlation: CorrelationResult): string;
export declare function mergeCorrelationResults(correlations: CorrelationResult[]): CorrelationResult;
export declare function calculateCorrelationScore(events: SecurityEvent[], weights?: {
    temporal?: number;
    spatial?: number;
    causal?: number;
}): number;
export declare const SecurityEventCorrelationKit: {
    correlateEventsInTimeWindow: typeof correlateEventsInTimeWindow;
    detectMultiStageAttacks: typeof detectMultiStageAttacks;
    aggregateEventsByDimensions: typeof aggregateEventsByDimensions;
    detectComplexEventPatterns: typeof detectComplexEventPatterns;
    correlateEventsByStatisticalAnomaly: typeof correlateEventsByStatisticalAnomaly;
    generateIncidentsFromCorrelations: typeof generateIncidentsFromCorrelations;
    calculateCorrelationConfidence: typeof calculateCorrelationConfidence;
    calculateWindowDuration: typeof calculateWindowDuration;
    createCorrelationRule: typeof createCorrelationRule;
    evaluateCorrelationRule: typeof evaluateCorrelationRule;
    findEventClusters: typeof findEventClusters;
    detectBehavioralAnomalies: typeof detectBehavioralAnomalies;
    detectLateralMovement: typeof detectLateralMovement;
    detectPrivilegeEscalation: typeof detectPrivilegeEscalation;
    correlateAcrossDataSources: typeof correlateAcrossDataSources;
    detectDataExfiltration: typeof detectDataExfiltration;
    findTemporalSequences: typeof findTemporalSequences;
    detectEventVelocitySpikes: typeof detectEventVelocitySpikes;
    detectBruteForceAttacks: typeof detectBruteForceAttacks;
    detectC2Communication: typeof detectC2Communication;
    getCorrelationRuleById: typeof getCorrelationRuleById;
    updateCorrelationRule: typeof updateCorrelationRule;
    deleteCorrelationRule: typeof deleteCorrelationRule;
    listCorrelationRules: typeof listCorrelationRules;
    getCorrelationStats: typeof getCorrelationStats;
    purgeOldCorrelations: typeof purgeOldCorrelations;
    formatCorrelationForDisplay: typeof formatCorrelationForDisplay;
    mergeCorrelationResults: typeof mergeCorrelationResults;
    calculateCorrelationScore: typeof calculateCorrelationScore;
};
export default SecurityEventCorrelationKit;
//# sourceMappingURL=security-event-correlation-kit.d.ts.map