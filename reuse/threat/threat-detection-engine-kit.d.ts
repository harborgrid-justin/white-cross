/**
 * LOC: THREATDETECT1234567
 * File: /reuse/threat/threat-detection-engine-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Threat detection services
 *   - Security analytics modules
 *   - Anomaly detection services
 *   - ML model integration services
 *   - Real-time threat monitoring
 *   - SIEM integration modules
 */
/**
 * Threat detection configuration
 */
export interface ThreatDetectionConfig {
    id: string;
    name: string;
    enabled: boolean;
    detectionType: DetectionType;
    sensitivity: DetectionSensitivity;
    thresholds: DetectionThresholds;
    mlModelId?: string;
    ruleIds: string[];
    metadata?: Record<string, any>;
}
/**
 * Detection types
 */
export declare enum DetectionType {
    SIGNATURE_BASED = "SIGNATURE_BASED",
    ANOMALY_BASED = "ANOMALY_BASED",
    BEHAVIOR_BASED = "BEHAVIOR_BASED",
    HEURISTIC = "HEURISTIC",
    ML_BASED = "ML_BASED",
    HYBRID = "HYBRID"
}
/**
 * Detection sensitivity levels
 */
export declare enum DetectionSensitivity {
    VERY_LOW = "VERY_LOW",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH"
}
/**
 * Detection thresholds
 */
export interface DetectionThresholds {
    anomalyScore: number;
    confidenceScore: number;
    riskScore: number;
    falsePositiveRate: number;
    minSeverity: ThreatSeverity;
}
/**
 * Threat severity levels
 */
export declare enum ThreatSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Threat detection result
 */
export interface ThreatDetectionResult {
    id: string;
    timestamp: Date;
    detectionType: DetectionType;
    threatType: string;
    severity: ThreatSeverity;
    confidence: number;
    anomalyScore: number;
    riskScore: number;
    isFalsePositive: boolean;
    falsePositiveConfidence?: number;
    triggeredRules: DetectionRule[];
    affectedEntities: AffectedEntity[];
    indicators: ThreatIndicator[];
    mlModelPrediction?: MLPrediction;
    correlatedEvents: string[];
    recommendedActions: string[];
    metadata?: Record<string, any>;
}
/**
 * Detection rule structure
 */
export interface DetectionRule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    ruleType: RuleType;
    severity: ThreatSeverity;
    conditions: RuleCondition[];
    actions: RuleAction[];
    tags: string[];
    mitreAttack?: string[];
    version: string;
    lastUpdated: Date;
    metadata?: Record<string, any>;
}
/**
 * Rule types
 */
export declare enum RuleType {
    SIGNATURE = "SIGNATURE",
    THRESHOLD = "THRESHOLD",
    CORRELATION = "CORRELATION",
    STATISTICAL = "STATISTICAL",
    BEHAVIORAL = "BEHAVIORAL",
    MACHINE_LEARNING = "MACHINE_LEARNING"
}
/**
 * Rule condition
 */
export interface RuleCondition {
    field: string;
    operator: ConditionOperator;
    value: any;
    aggregation?: AggregationType;
    timeWindow?: number;
}
/**
 * Condition operators
 */
export declare enum ConditionOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    CONTAINS = "CONTAINS",
    REGEX = "REGEX",
    IN_LIST = "IN_LIST",
    NOT_IN_LIST = "NOT_IN_LIST",
    EXISTS = "EXISTS",
    NOT_EXISTS = "NOT_EXISTS"
}
/**
 * Aggregation types
 */
export declare enum AggregationType {
    COUNT = "COUNT",
    SUM = "SUM",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX",
    DISTINCT_COUNT = "DISTINCT_COUNT"
}
/**
 * Rule action
 */
export interface RuleAction {
    type: ActionType;
    parameters: Record<string, any>;
    priority: number;
}
/**
 * Action types
 */
export declare enum ActionType {
    ALERT = "ALERT",
    BLOCK = "BLOCK",
    QUARANTINE = "QUARANTINE",
    LOG = "LOG",
    NOTIFY = "NOTIFY",
    EXECUTE_SCRIPT = "EXECUTE_SCRIPT",
    CREATE_TICKET = "CREATE_TICKET"
}
/**
 * Affected entity information
 */
export interface AffectedEntity {
    type: EntityType;
    id: string;
    name?: string;
    ipAddress?: string;
    hostname?: string;
    userId?: string;
    metadata?: Record<string, any>;
}
/**
 * Entity types
 */
export declare enum EntityType {
    USER = "USER",
    DEVICE = "DEVICE",
    NETWORK = "NETWORK",
    APPLICATION = "APPLICATION",
    FILE = "FILE",
    PROCESS = "PROCESS",
    SERVICE = "SERVICE"
}
/**
 * Threat indicator
 */
export interface ThreatIndicator {
    type: string;
    value: string;
    confidence: number;
    source: string;
    timestamp: Date;
}
/**
 * ML model prediction
 */
export interface MLPrediction {
    modelId: string;
    modelVersion: string;
    prediction: string;
    confidence: number;
    probability: number;
    features: Record<string, number>;
    threshold: number;
}
/**
 * Anomaly detection result
 */
export interface AnomalyDetectionResult {
    id: string;
    timestamp: Date;
    entityId: string;
    entityType: EntityType;
    anomalyType: AnomalyType;
    anomalyScore: number;
    severity: ThreatSeverity;
    baseline: StatisticalBaseline;
    observedValue: number;
    deviation: number;
    zScore: number;
    pValue: number;
    isAnomaly: boolean;
    confidence: number;
    metadata?: Record<string, any>;
}
/**
 * Anomaly types
 */
export declare enum AnomalyType {
    POINT_ANOMALY = "POINT_ANOMALY",
    CONTEXTUAL_ANOMALY = "CONTEXTUAL_ANOMALY",
    COLLECTIVE_ANOMALY = "COLLECTIVE_ANOMALY",
    TEMPORAL_ANOMALY = "TEMPORAL_ANOMALY",
    SPATIAL_ANOMALY = "SPATIAL_ANOMALY"
}
/**
 * Statistical baseline
 */
export interface StatisticalBaseline {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    sampleSize: number;
    confidenceInterval: [number, number];
    timeWindow: number;
}
/**
 * Pattern matching result
 */
export interface PatternMatchResult {
    id: string;
    patternId: string;
    patternName: string;
    matchScore: number;
    confidence: number;
    matchedEvents: any[];
    timespan: number;
    metadata?: Record<string, any>;
}
/**
 * Correlation result
 */
export interface CorrelationResult {
    id: string;
    correlationType: CorrelationType;
    correlatedEvents: any[];
    correlationScore: number;
    timeWindow: number;
    commonAttributes: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Correlation types
 */
export declare enum CorrelationType {
    TEMPORAL = "TEMPORAL",
    SPATIAL = "SPATIAL",
    BEHAVIORAL = "BEHAVIORAL",
    CAUSAL = "CAUSAL",
    SEQUENTIAL = "SEQUENTIAL"
}
/**
 * Risk assessment result
 */
export interface RiskAssessmentResult {
    entityId: string;
    entityType: EntityType;
    overallRiskScore: number;
    riskLevel: RiskLevel;
    riskFactors: RiskFactor[];
    mitigationRecommendations: string[];
    assessmentTimestamp: Date;
    validUntil: Date;
    metadata?: Record<string, any>;
}
/**
 * Risk levels
 */
export declare enum RiskLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    MINIMAL = "MINIMAL"
}
/**
 * Risk factor
 */
export interface RiskFactor {
    name: string;
    category: string;
    score: number;
    weight: number;
    description: string;
    evidence: string[];
}
/**
 * False positive analysis
 */
export interface FalsePositiveAnalysis {
    detectionId: string;
    isFalsePositive: boolean;
    confidence: number;
    reasons: string[];
    historicalAccuracy: number;
    recommendedAction: FalsePositiveAction;
    metadata?: Record<string, any>;
}
/**
 * False positive actions
 */
export declare enum FalsePositiveAction {
    SUPPRESS = "SUPPRESS",
    TUNE_RULE = "TUNE_RULE",
    WHITELIST = "WHITELIST",
    REQUIRE_REVIEW = "REQUIRE_REVIEW",
    NO_ACTION = "NO_ACTION"
}
/**
 * ML model metadata
 */
export interface MLModelMetadata {
    modelId: string;
    modelName: string;
    modelType: MLModelType;
    version: string;
    algorithm: string;
    features: string[];
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    trainedDate: Date;
    lastUpdated: Date;
    metadata?: Record<string, any>;
}
/**
 * ML model types
 */
export declare enum MLModelType {
    CLASSIFICATION = "CLASSIFICATION",
    REGRESSION = "REGRESSION",
    CLUSTERING = "CLUSTERING",
    ANOMALY_DETECTION = "ANOMALY_DETECTION",
    TIME_SERIES = "TIME_SERIES",
    DEEP_LEARNING = "DEEP_LEARNING"
}
/**
 * Sequelize DetectionRule model attributes.
 *
 * @example
 * ```typescript
 * class DetectionRule extends Model {}
 * DetectionRule.init(getDetectionRuleModelAttributes(), {
 *   sequelize,
 *   tableName: 'detection_rules',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['enabled', 'severity'] },
 *     { fields: ['ruleType'] }
 *   ]
 * });
 * ```
 */
export declare const getDetectionRuleModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    enabled: {
        type: string;
        allowNull: boolean;
        defaultValue: boolean;
    };
    ruleType: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    conditions: {
        type: string;
        defaultValue: never[];
    };
    actions: {
        type: string;
        defaultValue: never[];
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        defaultValue: never[];
    };
    version: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    lastUpdated: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize ThreatDetection model attributes.
 *
 * @example
 * ```typescript
 * class ThreatDetection extends Model {}
 * ThreatDetection.init(getThreatDetectionModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_detections',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['timestamp', 'severity'] },
 *     { fields: ['isFalsePositive'] }
 *   ]
 * });
 * ```
 */
export declare const getThreatDetectionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    timestamp: {
        type: string;
        allowNull: boolean;
    };
    detectionType: {
        type: string;
        allowNull: boolean;
    };
    threatType: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    anomalyScore: {
        type: string;
        allowNull: boolean;
    };
    riskScore: {
        type: string;
        allowNull: boolean;
    };
    isFalsePositive: {
        type: string;
        defaultValue: boolean;
    };
    falsePositiveConfidence: {
        type: string;
        allowNull: boolean;
    };
    triggeredRules: {
        type: string;
        defaultValue: never[];
    };
    affectedEntities: {
        type: string;
        defaultValue: never[];
    };
    indicators: {
        type: string;
        defaultValue: never[];
    };
    mlModelPrediction: {
        type: string;
        allowNull: boolean;
    };
    correlatedEvents: {
        type: string;
        defaultValue: never[];
    };
    recommendedActions: {
        type: string;
        defaultValue: never[];
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize AnomalyDetection model attributes.
 *
 * @example
 * ```typescript
 * class AnomalyDetection extends Model {}
 * AnomalyDetection.init(getAnomalyDetectionModelAttributes(), {
 *   sequelize,
 *   tableName: 'anomaly_detections',
 *   timestamps: true
 * });
 * ```
 */
export declare const getAnomalyDetectionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    timestamp: {
        type: string;
        allowNull: boolean;
    };
    entityId: {
        type: string;
        allowNull: boolean;
    };
    entityType: {
        type: string;
        allowNull: boolean;
    };
    anomalyType: {
        type: string;
        allowNull: boolean;
    };
    anomalyScore: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    baseline: {
        type: string;
        allowNull: boolean;
    };
    observedValue: {
        type: string;
        allowNull: boolean;
    };
    deviation: {
        type: string;
        allowNull: boolean;
    };
    zScore: {
        type: string;
        allowNull: boolean;
    };
    pValue: {
        type: string;
        allowNull: boolean;
    };
    isAnomaly: {
        type: string;
        allowNull: boolean;
    };
    confidence: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize MLModel model attributes.
 *
 * @example
 * ```typescript
 * class MLModel extends Model {}
 * MLModel.init(getMLModelAttributes(), {
 *   sequelize,
 *   tableName: 'ml_models',
 *   timestamps: true
 * });
 * ```
 */
export declare const getMLModelAttributes: () => {
    modelId: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    modelName: {
        type: string;
        allowNull: boolean;
    };
    modelType: {
        type: string;
        allowNull: boolean;
    };
    version: {
        type: string;
        allowNull: boolean;
    };
    algorithm: {
        type: string;
        allowNull: boolean;
    };
    features: {
        type: string;
        defaultValue: never[];
    };
    accuracy: {
        type: string;
        allowNull: boolean;
    };
    precision: {
        type: string;
        allowNull: boolean;
    };
    recall: {
        type: string;
        allowNull: boolean;
    };
    f1Score: {
        type: string;
        allowNull: boolean;
    };
    trainedDate: {
        type: string;
        allowNull: boolean;
    };
    lastUpdated: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Calculates a comprehensive threat score based on multiple factors.
 *
 * @param {any} event - Security event to analyze
 * @param {DetectionRule[]} rules - Active detection rules
 * @param {object} [options] - Scoring options
 * @returns {Promise<number>} Threat score (0-100)
 *
 * @example
 * ```typescript
 * const event = { type: 'login_failure', sourceIp: '10.0.0.1', attempts: 10 };
 * const score = await calculateThreatScore(event, rules);
 * console.log(`Threat score: ${score}`);
 * ```
 */
export declare const calculateThreatScore: (event: any, rules: DetectionRule[], options?: {
    weights?: Record<string, number>;
    baselineData?: any[];
}) => Promise<number>;
/**
 * Evaluates a detection rule against an event.
 *
 * @param {DetectionRule} rule - Detection rule
 * @param {any} event - Event to evaluate
 * @returns {boolean} True if rule matches
 *
 * @example
 * ```typescript
 * const rule = { conditions: [{ field: 'attempts', operator: 'GREATER_THAN', value: 5 }] };
 * const matches = evaluateRule(rule, { attempts: 10 });
 * ```
 */
export declare const evaluateRule: (rule: DetectionRule, event: any) => boolean;
/**
 * Performs real-time threat assessment on incoming events.
 *
 * @param {any[]} events - Array of security events
 * @param {ThreatDetectionConfig} config - Detection configuration
 * @returns {Promise<ThreatDetectionResult[]>} Detection results
 *
 * @example
 * ```typescript
 * const events = [{ type: 'network_scan', sourceIp: '192.168.1.1' }];
 * const results = await performRealtimeThreatAssessment(events, config);
 * ```
 */
export declare const performRealtimeThreatAssessment: (events: any[], config: ThreatDetectionConfig) => Promise<ThreatDetectionResult[]>;
/**
 * Calculates dynamic threat score that adapts to changing conditions.
 *
 * @param {any} event - Security event
 * @param {any[]} historicalEvents - Historical events for context
 * @returns {Promise<number>} Dynamic threat score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateDynamicThreatScore(currentEvent, pastEvents);
 * ```
 */
export declare const calculateDynamicThreatScore: (event: any, historicalEvents: any[]) => Promise<number>;
/**
 * Aggregates threat scores across multiple dimensions.
 *
 * @param {Record<string, number>} scores - Dimension scores
 * @param {Record<string, number>} [weights] - Dimension weights
 * @returns {number} Aggregated score (0-100)
 *
 * @example
 * ```typescript
 * const scores = { network: 75, behavior: 60, reputation: 80 };
 * const aggregated = aggregateThreatScores(scores);
 * ```
 */
export declare const aggregateThreatScores: (scores: Record<string, number>, weights?: Record<string, number>) => number;
/**
 * Detects anomalies using statistical methods.
 *
 * @param {number[]} values - Time series values
 * @param {object} [options] - Detection options
 * @returns {AnomalyDetectionResult[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const values = [10, 12, 11, 13, 50, 12, 11]; // 50 is anomaly
 * const anomalies = detectStatisticalAnomalies(values, { threshold: 3 });
 * ```
 */
export declare const detectStatisticalAnomalies: (values: number[], options?: {
    threshold?: number;
    method?: "zscore" | "iqr" | "mad";
}) => AnomalyDetectionResult[];
/**
 * Detects behavioral anomalies based on user/entity patterns.
 *
 * @param {any} currentBehavior - Current behavior data
 * @param {any[]} historicalBehavior - Historical behavior patterns
 * @returns {AnomalyDetectionResult | null} Anomaly result if detected
 *
 * @example
 * ```typescript
 * const current = { loginTime: '03:00', location: 'Russia' };
 * const historical = [{ loginTime: '09:00', location: 'USA' }];
 * const anomaly = detectBehavioralAnomaly(current, historical);
 * ```
 */
export declare const detectBehavioralAnomaly: (currentBehavior: any, historicalBehavior: any[]) => AnomalyDetectionResult | null;
/**
 * Detects temporal anomalies in time series data.
 *
 * @param {Array<{timestamp: Date, value: number}>} timeSeries - Time series data
 * @param {object} [options] - Detection options
 * @returns {AnomalyDetectionResult[]} Detected temporal anomalies
 *
 * @example
 * ```typescript
 * const data = [
 *   { timestamp: new Date('2024-01-01T10:00:00Z'), value: 100 },
 *   { timestamp: new Date('2024-01-01T11:00:00Z'), value: 1000 }
 * ];
 * const anomalies = detectTemporalAnomalies(data);
 * ```
 */
export declare const detectTemporalAnomalies: (timeSeries: Array<{
    timestamp: Date;
    value: number;
}>, options?: {
    windowSize?: number;
    threshold?: number;
}) => AnomalyDetectionResult[];
/**
 * Updates baseline statistics with new data.
 *
 * @param {StatisticalBaseline} baseline - Current baseline
 * @param {number[]} newValues - New data values
 * @returns {StatisticalBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateAnomalyBaseline(currentBaseline, [15, 16, 14]);
 * ```
 */
export declare const updateAnomalyBaseline: (baseline: StatisticalBaseline, newValues: number[]) => StatisticalBaseline;
/**
 * Matches event patterns against known threat patterns.
 *
 * @param {any[]} events - Events to analyze
 * @param {any[]} patterns - Known threat patterns
 * @returns {PatternMatchResult[]} Pattern match results
 *
 * @example
 * ```typescript
 * const events = [{ type: 'scan' }, { type: 'exploit' }, { type: 'exfiltrate' }];
 * const patterns = [{ name: 'APT', sequence: ['scan', 'exploit', 'exfiltrate'] }];
 * const matches = matchThreatPatterns(events, patterns);
 * ```
 */
export declare const matchThreatPatterns: (events: any[], patterns: any[]) => PatternMatchResult[];
/**
 * Performs sequential pattern detection.
 *
 * @param {any[]} events - Ordered events
 * @param {number} [minSupport=2] - Minimum pattern support
 * @returns {any[]} Discovered patterns
 *
 * @example
 * ```typescript
 * const events = [
 *   { type: 'login' }, { type: 'access' }, { type: 'login' }, { type: 'access' }
 * ];
 * const patterns = detectSequentialPatterns(events, 2);
 * ```
 */
export declare const detectSequentialPatterns: (events: any[], minSupport?: number) => any[];
/**
 * Detects attack chains based on MITRE ATT&CK tactics.
 *
 * @param {any[]} events - Security events
 * @param {object} [options] - Detection options
 * @returns {PatternMatchResult[]} Detected attack chains
 *
 * @example
 * ```typescript
 * const events = [
 *   { type: 'recon', mitreTactic: 'reconnaissance' },
 *   { type: 'exploit', mitreTactic: 'initial-access' },
 *   { type: 'persist', mitreTactic: 'persistence' }
 * ];
 * const chains = detectAttackChains(events);
 * ```
 */
export declare const detectAttackChains: (events: any[], options?: {
    minChainLength?: number;
    maxTimeGap?: number;
}) => PatternMatchResult[];
/**
 * Correlates security events based on multiple attributes.
 *
 * @param {any[]} events - Events to correlate
 * @param {string[]} correlationFields - Fields to correlate on
 * @returns {CorrelationResult[]} Correlation results
 *
 * @example
 * ```typescript
 * const events = [
 *   { sourceIp: '10.0.0.1', type: 'scan' },
 *   { sourceIp: '10.0.0.1', type: 'exploit' }
 * ];
 * const correlations = correlateSecurityEvents(events, ['sourceIp']);
 * ```
 */
export declare const correlateSecurityEvents: (events: any[], correlationFields: string[]) => CorrelationResult[];
/**
 * Performs temporal correlation of events.
 *
 * @param {any[]} events - Events with timestamps
 * @param {number} [timeWindow=300000] - Time window in ms (default 5 min)
 * @returns {CorrelationResult[]} Temporal correlations
 *
 * @example
 * ```typescript
 * const correlations = correlateEventsByTime(events, 600000); // 10 min window
 * ```
 */
export declare const correlateEventsByTime: (events: any[], timeWindow?: number) => CorrelationResult[];
/**
 * Detects causal relationships between events.
 *
 * @param {any[]} events - Events to analyze
 * @param {object} [options] - Detection options
 * @returns {CorrelationResult[]} Causal correlations
 *
 * @example
 * ```typescript
 * const causalRelations = detectCausalCorrelations(events, { maxDelay: 60000 });
 * ```
 */
export declare const detectCausalCorrelations: (events: any[], options?: {
    maxDelay?: number;
    minConfidence?: number;
}) => CorrelationResult[];
/**
 * Prepares features for ML model prediction.
 *
 * @param {any} event - Security event
 * @param {string[]} featureNames - Required feature names
 * @returns {Record<string, number>} Feature vector
 *
 * @example
 * ```typescript
 * const event = { attempts: 10, duration: 300, sourceIp: '10.0.0.1' };
 * const features = prepareMLFeatures(event, ['attempts', 'duration']);
 * ```
 */
export declare const prepareMLFeatures: (event: any, featureNames: string[]) => Record<string, number>;
/**
 * Performs ML-based threat prediction.
 *
 * @param {any} event - Event to predict
 * @param {MLModelMetadata} model - ML model metadata
 * @returns {Promise<MLPrediction>} Prediction result
 *
 * @example
 * ```typescript
 * const prediction = await predictThreatWithML(event, mlModel);
 * console.log(`Prediction: ${prediction.prediction}, Confidence: ${prediction.confidence}`);
 * ```
 */
export declare const predictThreatWithML: (event: any, model: MLModelMetadata) => Promise<MLPrediction>;
/**
 * Performs ensemble prediction using multiple ML models.
 *
 * @param {any} event - Event to predict
 * @param {MLModelMetadata[]} models - Array of ML models
 * @returns {Promise<MLPrediction>} Ensemble prediction
 *
 * @example
 * ```typescript
 * const ensemble = await ensembleMLPrediction(event, [model1, model2, model3]);
 * ```
 */
export declare const ensembleMLPrediction: (event: any, models: MLModelMetadata[]) => Promise<MLPrediction>;
/**
 * Normalizes feature values for ML input.
 *
 * @param {Record<string, number>} features - Raw features
 * @param {object} [options] - Normalization options
 * @returns {Record<string, number>} Normalized features
 *
 * @example
 * ```typescript
 * const normalized = normalizeMLFeatures({ attempts: 100, duration: 5000 });
 * ```
 */
export declare const normalizeMLFeatures: (features: Record<string, number>, options?: {
    method?: "minmax" | "zscore" | "log";
    min?: number;
    max?: number;
}) => Record<string, number>;
/**
 * Performs comprehensive risk assessment for an entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {EntityType} entityType - Type of entity
 * @param {any[]} events - Related security events
 * @returns {Promise<RiskAssessmentResult>} Risk assessment result
 *
 * @example
 * ```typescript
 * const riskAssessment = await assessEntityRisk('user123', EntityType.USER, userEvents);
 * ```
 */
export declare const assessEntityRisk: (entityId: string, entityType: EntityType, events: any[]) => Promise<RiskAssessmentResult>;
/**
 * Calculates risk score trend over time.
 *
 * @param {string} entityId - Entity identifier
 * @param {RiskAssessmentResult[]} historicalAssessments - Historical risk assessments
 * @returns {object} Risk trend analysis
 *
 * @example
 * ```typescript
 * const trend = calculateRiskTrend('user123', pastAssessments);
 * console.log(`Trend: ${trend.direction}, Change: ${trend.change}%`);
 * ```
 */
export declare const calculateRiskTrend: (entityId: string, historicalAssessments: RiskAssessmentResult[]) => {
    direction: "increasing" | "decreasing" | "stable";
    change: number;
    velocity: number;
};
/**
 * Aggregates risk scores across multiple entities.
 *
 * @param {RiskAssessmentResult[]} assessments - Entity risk assessments
 * @returns {object} Aggregated risk metrics
 *
 * @example
 * ```typescript
 * const aggregated = aggregateRiskScores(allAssessments);
 * console.log(`Average risk: ${aggregated.average}`);
 * ```
 */
export declare const aggregateRiskScores: (assessments: RiskAssessmentResult[]) => {
    average: number;
    median: number;
    min: number;
    max: number;
    distribution: Record<RiskLevel, number>;
};
/**
 * Analyzes detection for false positive likelihood.
 *
 * @param {ThreatDetectionResult} detection - Threat detection to analyze
 * @param {object} [options] - Analysis options
 * @returns {Promise<FalsePositiveAnalysis>} False positive analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeFalsePositive(detection, { historicalData: true });
 * if (analysis.isFalsePositive) {
 *   console.log('Likely false positive');
 * }
 * ```
 */
export declare const analyzeFalsePositive: (detection: ThreatDetectionResult, options?: {
    historicalData?: any[];
    contextData?: any;
}) => Promise<FalsePositiveAnalysis>;
/**
 * Tunes detection rules to reduce false positives.
 *
 * @param {DetectionRule} rule - Rule to tune
 * @param {FalsePositiveAnalysis[]} fpAnalyses - False positive analyses
 * @returns {DetectionRule} Tuned rule
 *
 * @example
 * ```typescript
 * const tunedRule = tuneDetectionRule(originalRule, falsePositiveReports);
 * ```
 */
export declare const tuneDetectionRule: (rule: DetectionRule, fpAnalyses: FalsePositiveAnalysis[]) => DetectionRule;
/**
 * Creates whitelist entry from false positive.
 *
 * @param {ThreatDetectionResult} detection - Detection to whitelist
 * @param {string} reason - Whitelist reason
 * @returns {object} Whitelist entry
 *
 * @example
 * ```typescript
 * const whitelistEntry = createWhitelistEntry(detection, 'Authorized security scan');
 * ```
 */
export declare const createWhitelistEntry: (detection: ThreatDetectionResult, reason: string) => {
    id: string;
    entityIds: string[];
    indicators: string[];
    reason: string;
    createdAt: Date;
    expiresAt: Date;
};
/**
 * Creates a new detection rule.
 *
 * @param {Partial<DetectionRule>} ruleData - Rule data
 * @returns {DetectionRule} Created rule
 *
 * @example
 * ```typescript
 * const rule = createDetectionRule({
 *   name: 'Brute Force Detection',
 *   ruleType: RuleType.THRESHOLD,
 *   conditions: [{ field: 'failedAttempts', operator: 'GREATER_THAN', value: 5 }]
 * });
 * ```
 */
export declare const createDetectionRule: (ruleData: Partial<DetectionRule>) => DetectionRule;
/**
 * Validates detection rule configuration.
 *
 * @param {DetectionRule} rule - Rule to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDetectionRule(rule);
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateDetectionRule: (rule: DetectionRule) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Tests detection rule against sample events.
 *
 * @param {DetectionRule} rule - Rule to test
 * @param {any[]} sampleEvents - Sample events for testing
 * @returns {object} Test results
 *
 * @example
 * ```typescript
 * const results = testDetectionRule(rule, [event1, event2, event3]);
 * console.log(`Matched ${results.matchCount} of ${results.totalEvents} events`);
 * ```
 */
export declare const testDetectionRule: (rule: DetectionRule, sampleEvents: any[]) => {
    matchCount: number;
    totalEvents: number;
    matchedEvents: any[];
    matchRate: number;
};
/**
 * Optimizes detection rule performance.
 *
 * @param {DetectionRule} rule - Rule to optimize
 * @returns {DetectionRule} Optimized rule
 *
 * @example
 * ```typescript
 * const optimized = optimizeDetectionRule(slowRule);
 * ```
 */
export declare const optimizeDetectionRule: (rule: DetectionRule) => DetectionRule;
/**
 * Manages detection rule versioning.
 *
 * @param {DetectionRule} rule - Rule to version
 * @param {string} changeType - Type of change (major|minor|patch)
 * @returns {DetectionRule} Versioned rule
 *
 * @example
 * ```typescript
 * const newVersion = versionDetectionRule(rule, 'minor');
 * ```
 */
export declare const versionDetectionRule: (rule: DetectionRule, changeType: "major" | "minor" | "patch") => DetectionRule;
/**
 * Exports detection rules to various formats.
 *
 * @param {DetectionRule[]} rules - Rules to export
 * @param {string} format - Export format
 * @returns {string} Exported rules
 *
 * @example
 * ```typescript
 * const exported = exportDetectionRules(rules, 'json');
 * ```
 */
export declare const exportDetectionRules: (rules: DetectionRule[], format: "json" | "yaml" | "sigma") => string;
/**
 * Imports detection rules from external format.
 *
 * @param {string} data - Rule data to import
 * @param {string} format - Import format
 * @returns {DetectionRule[]} Imported rules
 *
 * @example
 * ```typescript
 * const rules = importDetectionRules(jsonData, 'json');
 * ```
 */
export declare const importDetectionRules: (data: string, format: "json" | "yaml" | "sigma") => DetectionRule[];
/**
 * Merges detection rules from multiple sources.
 *
 * @param {DetectionRule[][]} ruleSets - Array of rule sets to merge
 * @param {object} [options] - Merge options
 * @returns {DetectionRule[]} Merged rules
 *
 * @example
 * ```typescript
 * const merged = mergeDetectionRules([internalRules, vendorRules], { deduplication: true });
 * ```
 */
export declare const mergeDetectionRules: (ruleSets: DetectionRule[][], options?: {
    deduplication?: boolean;
    conflictResolution?: "latest" | "highest_version" | "manual";
}) => DetectionRule[];
/**
 * Generates detection coverage report.
 *
 * @param {DetectionRule[]} rules - Detection rules
 * @param {object} [options] - Report options
 * @returns {object} Coverage report
 *
 * @example
 * ```typescript
 * const report = generateDetectionCoverageReport(rules, { includeMitre: true });
 * ```
 */
export declare const generateDetectionCoverageReport: (rules: DetectionRule[], options?: {
    includeMitre?: boolean;
    includeKillChain?: boolean;
}) => {
    totalRules: number;
    activeRules: number;
    coverageByType: Record<RuleType, number>;
    coverageBySeverity: Record<ThreatSeverity, number>;
    mitreCoverage?: string[];
    killChainCoverage?: string[];
};
/**
 * Calculates detection effectiveness metrics.
 *
 * @param {ThreatDetectionResult[]} detections - Historical detections
 * @param {any[]} validatedThreats - Validated actual threats
 * @returns {object} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateDetectionEffectiveness(allDetections, confirmedThreats);
 * console.log(`Precision: ${metrics.precision}, Recall: ${metrics.recall}`);
 * ```
 */
export declare const calculateDetectionEffectiveness: (detections: ThreatDetectionResult[], validatedThreats: any[]) => {
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    precision: number;
    recall: number;
    f1Score: number;
    accuracy: number;
};
/**
 * Generates threat detection summary statistics.
 *
 * @param {ThreatDetectionResult[]} detections - Detections to summarize
 * @param {object} [timeRange] - Time range for summary
 * @returns {object} Summary statistics
 *
 * @example
 * ```typescript
 * const summary = generateDetectionSummary(detections, {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-01-31')
 * });
 * ```
 */
export declare const generateDetectionSummary: (detections: ThreatDetectionResult[], timeRange?: {
    start: Date;
    end: Date;
}) => {
    total: number;
    bySeverity: Record<ThreatSeverity, number>;
    byType: Record<string, number>;
    avgConfidence: number;
    avgRiskScore: number;
    topAffectedEntities: Array<{
        entityId: string;
        count: number;
    }>;
};
/**
 * Performs threat hunting based on hypothesis.
 *
 * @param {any[]} events - Security events to hunt through
 * @param {object} hypothesis - Threat hunting hypothesis
 * @returns {ThreatDetectionResult[]} Hunting results
 *
 * @example
 * ```typescript
 * const results = performThreatHunting(events, {
 *   name: 'Lateral Movement Detection',
 *   indicators: ['psexec', 'wmic', 'net use'],
 *   timeWindow: 3600000
 * });
 * ```
 */
export declare const performThreatHunting: (events: any[], hypothesis: {
    name: string;
    indicators: string[];
    timeWindow?: number;
    minOccurrences?: number;
}) => ThreatDetectionResult[];
/**
 * Trains a simple ML model on detection data.
 *
 * @param {any[]} trainingData - Training data with labels
 * @param {object} [options] - Training options
 * @returns {MLModelMetadata} Trained model metadata
 *
 * @example
 * ```typescript
 * const model = trainDetectionModel(labeledData, { algorithm: 'random_forest' });
 * ```
 */
export declare const trainDetectionModel: (trainingData: any[], options?: {
    algorithm?: string;
    features?: string[];
    testSplit?: number;
}) => MLModelMetadata;
/**
 * Updates ML model with new training data.
 *
 * @param {MLModelMetadata} model - Existing model
 * @param {any[]} newData - New training data
 * @returns {MLModelMetadata} Updated model
 *
 * @example
 * ```typescript
 * const updated = updateDetectionModel(existingModel, newTrainingData);
 * ```
 */
export declare const updateDetectionModel: (model: MLModelMetadata, newData: any[]) => MLModelMetadata;
/**
 * Evaluates ML model performance on test data.
 *
 * @param {MLModelMetadata} model - Model to evaluate
 * @param {any[]} testData - Test data with labels
 * @returns {object} Evaluation metrics
 *
 * @example
 * ```typescript
 * const evaluation = evaluateDetectionModel(model, testDataset);
 * console.log(`Accuracy: ${evaluation.accuracy}`);
 * ```
 */
export declare const evaluateDetectionModel: (model: MLModelMetadata, testData: any[]) => {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
    roc: {
        fpr: number[];
        tpr: number[];
    };
};
/**
 * Predicts future threat trends using historical data.
 *
 * @param {ThreatDetectionResult[]} historicalDetections - Historical detection data
 * @param {number} [forecastDays=30] - Number of days to forecast
 * @returns {object} Threat trend forecast
 *
 * @example
 * ```typescript
 * const forecast = predictThreatTrends(pastDetections, 30);
 * console.log(`Predicted threat volume: ${forecast.predictedVolume}`);
 * ```
 */
export declare const predictThreatTrends: (historicalDetections: ThreatDetectionResult[], forecastDays?: number) => {
    predictedVolume: number;
    trendDirection: "increasing" | "decreasing" | "stable";
    confidence: number;
    bySeverity: Record<ThreatSeverity, number>;
    recommendations: string[];
};
//# sourceMappingURL=threat-detection-engine-kit.d.ts.map