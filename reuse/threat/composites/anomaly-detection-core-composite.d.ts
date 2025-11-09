/**
 * LOC: ANOMALYDETCORE001
 * File: /reuse/threat/composites/anomaly-detection-core-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../behavioral-threat-analytics-kit
 *   - ../threat-detection-engine-kit
 *   - ../threat-analytics-kit
 *   - ../security-analytics-kit
 *   - ../threat-scoring-kit
 *
 * DOWNSTREAM (imported by):
 *   - Anomaly detection services
 *   - Behavioral analysis modules
 *   - Pattern recognition engines
 *   - ML-based threat detection systems
 *   - Statistical anomaly detection services
 *   - Healthcare security monitoring dashboards
 */
/**
 * File: /reuse/threat/composites/anomaly-detection-core-composite.ts
 * Locator: WC-ANOMALY-DETECTION-CORE-001
 * Purpose: Comprehensive Anomaly Detection Core Toolkit - Production-ready anomaly detection and behavioral analysis
 *
 * Upstream: Composed from behavioral-threat-analytics-kit, threat-detection-engine-kit, threat-analytics-kit, security-analytics-kit, threat-scoring-kit
 * Downstream: ../backend/*, Anomaly detection services, Behavioral analysis, Pattern recognition, ML pipelines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for anomaly detection, behavioral analysis, pattern recognition, statistical analysis, ML integration
 *
 * LLM Context: Enterprise-grade anomaly detection core toolkit for White Cross healthcare platform.
 * Provides comprehensive anomaly detection capabilities including statistical anomaly detection, behavioral
 * anomaly analysis, temporal pattern recognition, ML-based detection algorithms, baseline deviation detection,
 * adaptive learning mechanisms, multi-dimensional anomaly scoring, false positive reduction, and HIPAA-compliant
 * healthcare security monitoring. Composes functions from multiple threat intelligence kits to provide unified
 * anomaly detection operations for detecting insider threats, compromised credentials, data exfiltration,
 * abnormal access patterns, and privilege escalation in healthcare systems.
 */
import { Model } from 'sequelize-typescript';
/**
 * Anomaly detection configuration
 */
export interface AnomalyDetectionConfig {
    id: string;
    name: string;
    enabled: boolean;
    detectionMethod: AnomalyDetectionMethod;
    sensitivity: AnomalySensitivity;
    thresholds: AnomalyThresholds;
    baselineId?: string;
    mlModelId?: string;
    adaptiveLearning: boolean;
    metadata?: Record<string, any>;
}
/**
 * Anomaly detection methods
 */
export declare enum AnomalyDetectionMethod {
    STATISTICAL = "STATISTICAL",
    BEHAVIORAL = "BEHAVIORAL",
    TEMPORAL = "TEMPORAL",
    PATTERN_BASED = "PATTERN_BASED",
    ML_BASED = "ML_BASED",
    HYBRID = "HYBRID"
}
/**
 * Anomaly sensitivity levels
 */
export declare enum AnomalySensitivity {
    VERY_LOW = "VERY_LOW",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH"
}
/**
 * Anomaly detection thresholds
 */
export interface AnomalyThresholds {
    standardDeviations: number;
    confidenceLevel: number;
    minimumSamples: number;
    zScore: number;
    pValue: number;
    anomalyScore: number;
}
/**
 * Anomaly detection result
 */
export interface AnomalyDetectionResult {
    id: string;
    timestamp: Date;
    detectionMethod: AnomalyDetectionMethod;
    anomalyType: AnomalyType;
    severity: AnomalySeverity;
    anomalyScore: number;
    confidence: number;
    zScore?: number;
    pValue?: number;
    baselineDeviation: number;
    affectedEntities: string[];
    indicators: AnomalyIndicator[];
    explanation: string;
    recommendedActions: string[];
    isFalsePositive: boolean;
    falsePositiveConfidence?: number;
    metadata?: Record<string, any>;
}
/**
 * Anomaly types
 */
export declare enum AnomalyType {
    POINT_ANOMALY = "POINT_ANOMALY",
    CONTEXTUAL_ANOMALY = "CONTEXTUAL_ANOMALY",
    COLLECTIVE_ANOMALY = "COLLECTIVE_ANOMALY",
    TREND_ANOMALY = "TREND_ANOMALY",
    SEASONAL_ANOMALY = "SEASONAL_ANOMALY",
    BEHAVIOR_ANOMALY = "BEHAVIOR_ANOMALY",
    PATTERN_ANOMALY = "PATTERN_ANOMALY"
}
/**
 * Anomaly severity levels
 */
export declare enum AnomalySeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Anomaly indicator
 */
export interface AnomalyIndicator {
    type: string;
    value: string | number;
    expectedValue?: string | number;
    deviation: number;
    weight: number;
    confidence: number;
}
/**
 * Behavioral baseline profile
 */
export interface BehaviorBaseline {
    id: string;
    entityId: string;
    entityType: string;
    profileType: BaselineProfileType;
    timeWindow: TimeWindow;
    metrics: BaselineMetrics;
    patterns: BehaviorPattern[];
    lastUpdated: Date;
    sampleSize: number;
    confidence: number;
    metadata?: Record<string, any>;
}
/**
 * Baseline profile types
 */
export declare enum BaselineProfileType {
    USER_ACTIVITY = "USER_ACTIVITY",
    NETWORK_TRAFFIC = "NETWORK_TRAFFIC",
    DATA_ACCESS = "DATA_ACCESS",
    SYSTEM_BEHAVIOR = "SYSTEM_BEHAVIOR",
    APPLICATION_USAGE = "APPLICATION_USAGE",
    API_CONSUMPTION = "API_CONSUMPTION"
}
/**
 * Time window for baseline calculation
 */
export interface TimeWindow {
    start: Date;
    end: Date;
    duration: number;
    granularity: TimeGranularity;
}
/**
 * Time granularity options
 */
export declare enum TimeGranularity {
    MINUTE = "MINUTE",
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH"
}
/**
 * Baseline statistical metrics
 */
export interface BaselineMetrics {
    mean: number;
    median: number;
    mode?: number;
    standardDeviation: number;
    variance: number;
    min: number;
    max: number;
    percentile25: number;
    percentile75: number;
    percentile95: number;
    percentile99: number;
    skewness?: number;
    kurtosis?: number;
}
/**
 * Behavior pattern structure
 */
export interface BehaviorPattern {
    id: string;
    patternType: PatternType;
    description: string;
    frequency: number;
    confidence: number;
    attributes: Record<string, any>;
    firstObserved: Date;
    lastObserved: Date;
}
/**
 * Pattern types for detection
 */
export declare enum PatternType {
    SEQUENTIAL = "SEQUENTIAL",
    TEMPORAL = "TEMPORAL",
    FREQUENCY = "FREQUENCY",
    VOLUME = "VOLUME",
    LOCATION = "LOCATION",
    ACCESS = "ACCESS",
    CUSTOM = "CUSTOM"
}
/**
 * Statistical analysis result
 */
export interface StatisticalAnalysisResult {
    method: string;
    zScore?: number;
    pValue?: number;
    chiSquare?: number;
    tStatistic?: number;
    fStatistic?: number;
    confidence: number;
    isSignificant: boolean;
    degreesOfFreedom?: number;
    metadata?: Record<string, any>;
}
/**
 * ML-based detection result
 */
export interface MLDetectionResult {
    modelId: string;
    modelType: string;
    prediction: 'NORMAL' | 'ANOMALY';
    anomalyProbability: number;
    confidence: number;
    features: Record<string, number>;
    featureImportance?: Record<string, number>;
    explanation?: string;
    metadata?: Record<string, any>;
}
/**
 * Pattern matching result
 */
export interface PatternMatchResult {
    patternId: string;
    patternType: PatternType;
    matchScore: number;
    confidence: number;
    matchedAttributes: string[];
    deviations: Array<{
        attribute: string;
        expected: any;
        actual: any;
        deviation: number;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Anomaly Detection Configuration Model
 * Stores configuration for anomaly detection engines
 */
export declare class AnomalyDetectionConfigModel extends Model {
    id: string;
    name: string;
    enabled: boolean;
    detectionMethod: AnomalyDetectionMethod;
    sensitivity: AnomalySensitivity;
    thresholds: AnomalyThresholds;
    baselineId?: string;
    mlModelId?: string;
    adaptiveLearning: boolean;
    metadata?: Record<string, any>;
}
/**
 * Anomaly Detection Result Model
 * Stores detected anomalies
 */
export declare class AnomalyDetectionResultModel extends Model {
    id: string;
    timestamp: Date;
    detectionMethod: AnomalyDetectionMethod;
    anomalyType: AnomalyType;
    severity: AnomalySeverity;
    anomalyScore: number;
    confidence: number;
    zScore?: number;
    pValue?: number;
    baselineDeviation: number;
    affectedEntities: string[];
    indicators: AnomalyIndicator[];
    explanation: string;
    recommendedActions: string[];
    isFalsePositive: boolean;
    falsePositiveConfidence?: number;
    metadata?: Record<string, any>;
}
/**
 * Behavioral Baseline Model
 * Stores behavioral baseline profiles
 */
export declare class BehaviorBaselineModel extends Model {
    id: string;
    entityId: string;
    entityType: string;
    profileType: BaselineProfileType;
    timeWindow: TimeWindow;
    metrics: BaselineMetrics;
    patterns: BehaviorPattern[];
    lastUpdated: Date;
    sampleSize: number;
    confidence: number;
    metadata?: Record<string, any>;
}
/**
 * Detects statistical anomalies using Z-score and standard deviation analysis.
 * Identifies data points that deviate significantly from the mean.
 *
 * @param {number[]} dataPoints - Array of numerical data points
 * @param {number} threshold - Z-score threshold (default: 2.5)
 * @returns {AnomalyDetectionResult[]} Array of detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectStatisticalAnomalies([10, 12, 11, 13, 150, 12, 11], 2.5);
 * // Returns anomaly for value 150
 * ```
 */
export declare const detectStatisticalAnomalies: (dataPoints: number[], threshold?: number) => AnomalyDetectionResult[];
/**
 * Detects behavioral anomalies by comparing current behavior against established baselines.
 * Uses multiple behavioral metrics and pattern matching.
 *
 * @param {any} currentBehavior - Current behavior data
 * @param {BehaviorBaseline} baseline - Established behavioral baseline
 * @returns {AnomalyDetectionResult | null} Detected anomaly or null
 *
 * @example
 * ```typescript
 * const anomaly = detectBehavioralAnomaly(userActivity, userBaseline);
 * if (anomaly) console.log('Behavioral anomaly detected:', anomaly.explanation);
 * ```
 */
export declare const detectBehavioralAnomaly: (currentBehavior: any, baseline: BehaviorBaseline) => AnomalyDetectionResult | null;
/**
 * Detects temporal anomalies by analyzing time-based patterns and sequences.
 * Identifies unusual timing, frequency, or temporal clustering.
 *
 * @param {Array<{timestamp: Date, value: number}>} timeSeriesData - Time series data
 * @returns {AnomalyDetectionResult[]} Array of temporal anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectTemporalAnomalies(loginAttempts);
 * ```
 */
export declare const detectTemporalAnomalies: (timeSeriesData: Array<{
    timestamp: Date;
    value: number;
}>) => AnomalyDetectionResult[];
/**
 * Calculates comprehensive anomaly score combining multiple detection methods.
 *
 * @param {Partial<AnomalyDetectionResult>[]} detectionResults - Results from multiple detection methods
 * @returns {number} Composite anomaly score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCompositeAnomalyScore([statResult, behaviorResult, mlResult]);
 * ```
 */
export declare const calculateCompositeAnomalyScore: (detectionResults: Partial<AnomalyDetectionResult>[]) => number;
/**
 * Creates behavioral baseline profile from historical data.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} entityType - Entity type
 * @param {any[]} historicalData - Historical behavior data
 * @param {BaselineProfileType} profileType - Type of profile to create
 * @returns {BehaviorBaseline} Baseline profile
 *
 * @example
 * ```typescript
 * const baseline = createBehaviorBaseline('user123', 'user', userData, BaselineProfileType.USER_ACTIVITY);
 * ```
 */
export declare const createBehaviorBaseline: (entityId: string, entityType: string, historicalData: any[], profileType: BaselineProfileType) => BehaviorBaseline;
/**
 * Updates behavioral baseline with new data using adaptive learning.
 *
 * @param {BehaviorBaseline} baseline - Existing baseline
 * @param {any[]} newData - New behavior data
 * @param {number} learningRate - Learning rate (0-1, default: 0.1)
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateBehaviorBaseline(currentBaseline, newActivities, 0.1);
 * ```
 */
export declare const updateBehaviorBaseline: (baseline: BehaviorBaseline, newData: any[], learningRate?: number) => BehaviorBaseline;
/**
 * Calculates baseline deviation percentage for a given value.
 *
 * @param {number} value - Current value
 * @param {BaselineMetrics} metrics - Baseline metrics
 * @returns {number} Deviation percentage
 *
 * @example
 * ```typescript
 * const deviation = calculateBaselineDeviation(150, baselineMetrics);
 * ```
 */
export declare const calculateBaselineDeviation: (value: number, metrics: BaselineMetrics) => number;
/**
 * Detects baseline deviation anomalies.
 *
 * @param {number} value - Current value
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @param {number} threshold - Deviation threshold percentage
 * @returns {AnomalyDetectionResult | null} Anomaly if detected
 *
 * @example
 * ```typescript
 * const anomaly = detectBaselineDeviation(200, baseline, 50);
 * ```
 */
export declare const detectBaselineDeviation: (value: number, baseline: BehaviorBaseline, threshold?: number) => AnomalyDetectionResult | null;
/**
 * Performs adaptive baseline learning with automatic threshold adjustment.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {AnomalyDetectionResult[]} recentAnomalies - Recently detected anomalies
 * @returns {BehaviorBaseline} Adapted baseline
 *
 * @example
 * ```typescript
 * const adapted = adaptiveBaselineLearning(baseline, anomalies);
 * ```
 */
export declare const adaptiveBaselineLearning: (baseline: BehaviorBaseline, recentAnomalies: AnomalyDetectionResult[]) => BehaviorBaseline;
/**
 * Matches current behavior against known threat patterns.
 *
 * @param {any} behavior - Current behavior data
 * @param {BehaviorPattern[]} patterns - Known patterns
 * @returns {PatternMatchResult[]} Pattern match results
 *
 * @example
 * ```typescript
 * const matches = matchThreatPatterns(userBehavior, threatPatterns);
 * ```
 */
export declare const matchThreatPatterns: (behavior: any, patterns: BehaviorPattern[]) => PatternMatchResult[];
/**
 * Detects sequential attack patterns across multiple events.
 *
 * @param {any[]} events - Security events
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {AnomalyDetectionResult[]} Detected attack sequences
 *
 * @example
 * ```typescript
 * const sequences = detectSequentialPatterns(events, 300000); // 5 min window
 * ```
 */
export declare const detectSequentialPatterns: (events: any[], timeWindow: number) => AnomalyDetectionResult[];
/**
 * Detects attack chains using graph-based analysis.
 *
 * @param {any[]} events - Security events
 * @returns {AnomalyDetectionResult[]} Detected attack chains
 *
 * @example
 * ```typescript
 * const chains = detectAttackChains(securityEvents);
 * ```
 */
export declare const detectAttackChains: (events: any[]) => AnomalyDetectionResult[];
/**
 * Correlates security events for anomaly detection.
 *
 * @param {any[]} events - Security events
 * @param {number} correlationThreshold - Correlation threshold (0-1)
 * @returns {AnomalyDetectionResult[]} Correlated anomalies
 *
 * @example
 * ```typescript
 * const correlated = correlateSecurityEvents(events, 0.7);
 * ```
 */
export declare const correlateSecurityEvents: (events: any[], correlationThreshold: number) => AnomalyDetectionResult[];
/**
 * Correlates events by time proximity.
 *
 * @param {any[]} events - Events to correlate
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Array<{events: any[], correlation: number}>} Correlated event groups
 *
 * @example
 * ```typescript
 * const correlated = correlateEventsByTime(events, 60000); // 1 minute
 * ```
 */
export declare const correlateEventsByTime: (events: any[], timeWindow: number) => Array<{
    events: any[];
    correlation: number;
}>;
/**
 * Detects causal correlations between events.
 *
 * @param {any[]} events - Events to analyze
 * @returns {Array<{cause: any, effect: any, confidence: number}>} Causal relationships
 *
 * @example
 * ```typescript
 * const causes = detectCausalCorrelations(securityEvents);
 * ```
 */
export declare const detectCausalCorrelations: (events: any[]) => Array<{
    cause: any;
    effect: any;
    confidence: number;
}>;
/**
 * Prepares feature vectors for ML-based anomaly detection.
 *
 * @param {any} data - Input data
 * @returns {Record<string, number>} Feature vector
 *
 * @example
 * ```typescript
 * const features = prepareMLFeatures(userActivity);
 * ```
 */
export declare const prepareMLFeatures: (data: any) => Record<string, number>;
/**
 * Performs real-time threat assessment combining multiple anomaly detection methods.
 *
 * @param {any} event - Security event
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @param {BehaviorPattern[]} patterns - Known threat patterns
 * @returns {Promise<AnomalyDetectionResult>} Comprehensive assessment
 *
 * @example
 * ```typescript
 * const assessment = await performRealtimeThreatAssessment(event, baseline, patterns);
 * ```
 */
export declare const performRealtimeThreatAssessment: (event: any, baseline: BehaviorBaseline, patterns: BehaviorPattern[]) => Promise<AnomalyDetectionResult>;
/**
 * Calculates dynamic threat score based on current context and history.
 *
 * @param {any} threat - Threat data
 * @param {any[]} history - Historical threats
 * @returns {Promise<number>} Dynamic threat score
 *
 * @example
 * ```typescript
 * const score = await calculateDynamicThreatScore(currentThreat, threatHistory);
 * ```
 */
export declare const calculateDynamicThreatScore: (threat: any, history: any[]) => Promise<number>;
/**
 * Aggregates multiple threat scores using weighted averaging.
 *
 * @param {Array<{score: number, weight: number}>} scores - Scores with weights
 * @returns {number} Aggregated score
 *
 * @example
 * ```typescript
 * const aggregated = aggregateThreatScores([{score: 80, weight: 0.5}, {score: 60, weight: 0.3}]);
 * ```
 */
export declare const aggregateThreatScores: (scores: Array<{
    score: number;
    weight: number;
}>) => number;
/**
 * Updates anomaly baseline with feedback from false positive marking.
 *
 * @param {string} anomalyId - Anomaly identifier
 * @param {boolean} isFalsePositive - Whether it's a false positive
 * @param {BehaviorBaseline} baseline - Current baseline
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateAnomalyBaseline(anomalyId, true, baseline);
 * ```
 */
export declare const updateAnomalyBaseline: (anomalyId: string, isFalsePositive: boolean, baseline: BehaviorBaseline) => BehaviorBaseline;
/**
 * Identifies behavioral anomalies in user activity patterns.
 *
 * @param {any[]} activities - User activities
 * @param {BehaviorBaseline} baseline - User baseline
 * @returns {AnomalyDetectionResult[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = identifyBehaviorAnomalies(userActivities, userBaseline);
 * ```
 */
export declare const identifyBehaviorAnomalies: (activities: any[], baseline: BehaviorBaseline) => AnomalyDetectionResult[];
/**
 * Calculates baseline metrics from data samples.
 *
 * @param {number[]} samples - Data samples
 * @returns {BaselineMetrics} Calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBaselineMetrics(dataSamples);
 * ```
 */
export declare const calculateBaselineMetrics: (samples: number[]) => BaselineMetrics;
/**
 * Analyzes user behavior for anomalies.
 *
 * @param {string} userId - User identifier
 * @param {any[]} activities - User activities
 * @param {BehaviorBaseline} baseline - User baseline
 * @returns {Promise<AnomalyDetectionResult[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeUserBehavior('user123', activities, baseline);
 * ```
 */
export declare const analyzeUserBehavior: (userId: string, activities: any[], baseline: BehaviorBaseline) => Promise<AnomalyDetectionResult[]>;
/**
 * Analyzes entity behavior for security threats.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} entityType - Entity type
 * @param {any[]} activities - Entity activities
 * @param {BehaviorBaseline} baseline - Entity baseline
 * @returns {Promise<AnomalyDetectionResult[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeEntityBehavior('device123', 'DEVICE', activities, baseline);
 * ```
 */
export declare const analyzeEntityBehavior: (entityId: string, entityType: string, activities: any[], baseline: BehaviorBaseline) => Promise<AnomalyDetectionResult[]>;
/**
 * Tracks behavior changes over time.
 *
 * @param {any[]} oldBehavior - Previous behavior
 * @param {any[]} newBehavior - Current behavior
 * @returns {Record<string, number>} Change metrics
 *
 * @example
 * ```typescript
 * const changes = trackBehaviorChanges(previousActivities, currentActivities);
 * ```
 */
export declare const trackBehaviorChanges: (oldBehavior: any[], newBehavior: any[]) => Record<string, number>;
/**
 * Compares two behavior profiles.
 *
 * @param {BehaviorBaseline} profile1 - First profile
 * @param {BehaviorBaseline} profile2 - Second profile
 * @returns {Record<string, number>} Comparison metrics
 *
 * @example
 * ```typescript
 * const comparison = compareBehaviorProfiles(baseline1, baseline2);
 * ```
 */
export declare const compareBehaviorProfiles: (profile1: BehaviorBaseline, profile2: BehaviorBaseline) => Record<string, number>;
/**
 * Calculates behavior risk score.
 *
 * @param {any} behavior - Behavior data
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const risk = calculateBehaviorScore(userBehavior);
 * ```
 */
export declare const calculateBehaviorScore: (behavior: any) => number;
/**
 * Normalizes anomaly scores to 0-100 range.
 *
 * @param {number[]} scores - Raw scores
 * @returns {number[]} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = normalizeAnomalyScores(rawScores);
 * ```
 */
export declare const normalizeAnomalyScores: (scores: number[]) => number[];
/**
 * Calculates Z-score for statistical anomaly detection.
 *
 * @param {number} value - Value to analyze
 * @param {number} mean - Mean of distribution
 * @param {number} stdDev - Standard deviation
 * @returns {number} Z-score
 *
 * @example
 * ```typescript
 * const zScore = calculateZScore(150, 100, 20);
 * ```
 */
export declare const calculateZScore: (value: number, mean: number, stdDev: number) => number;
/**
 * Calculates P-value from Z-score.
 *
 * @param {number} zScore - Z-score
 * @returns {number} P-value
 *
 * @example
 * ```typescript
 * const pValue = calculatePValue(2.5);
 * ```
 */
export declare const calculatePValue: (zScore: number) => number;
/**
 * Determines anomaly severity based on score.
 *
 * @param {number} anomalyScore - Anomaly score
 * @returns {AnomalySeverity} Severity level
 *
 * @example
 * ```typescript
 * const severity = determineAnomalySeverity(85);
 * ```
 */
export declare const determineAnomalySeverity: (anomalyScore: number) => AnomalySeverity;
/**
 * Generates anomaly detection report.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Detected anomalies
 * @returns {Record<string, any>} Report summary
 *
 * @example
 * ```typescript
 * const report = generateAnomalyReport(detectedAnomalies);
 * ```
 */
export declare const generateAnomalyReport: (anomalies: AnomalyDetectionResult[]) => Record<string, any>;
/**
 * Filters anomalies by severity level.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to filter
 * @param {AnomalySeverity} minSeverity - Minimum severity level
 * @returns {AnomalyDetectionResult[]} Filtered anomalies
 *
 * @example
 * ```typescript
 * const critical = filterAnomaliesBySeverity(anomalies, AnomalySeverity.HIGH);
 * ```
 */
export declare const filterAnomaliesBySeverity: (anomalies: AnomalyDetectionResult[], minSeverity: AnomalySeverity) => AnomalyDetectionResult[];
/**
 * Groups anomalies by type.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to group
 * @returns {Map<AnomalyType, AnomalyDetectionResult[]>} Grouped anomalies
 *
 * @example
 * ```typescript
 * const grouped = groupAnomaliesByType(anomalies);
 * ```
 */
export declare const groupAnomaliesByType: (anomalies: AnomalyDetectionResult[]) => Map<AnomalyType, AnomalyDetectionResult[]>;
/**
 * Calculates anomaly detection accuracy metrics.
 *
 * @param {AnomalyDetectionResult[]} detectedAnomalies - Detected anomalies
 * @param {string[]} actualAnomalyIds - Known true anomaly IDs
 * @returns {Record<string, number>} Accuracy metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateDetectionAccuracy(detected, actualIds);
 * ```
 */
export declare const calculateDetectionAccuracy: (detectedAnomalies: AnomalyDetectionResult[], actualAnomalyIds: string[]) => Record<string, number>;
/**
 * Merges overlapping anomaly detection results.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to merge
 * @param {number} timeWindowMs - Time window for merging
 * @returns {AnomalyDetectionResult[]} Merged anomalies
 *
 * @example
 * ```typescript
 * const merged = mergeOverlappingAnomalies(anomalies, 60000);
 * ```
 */
export declare const mergeOverlappingAnomalies: (anomalies: AnomalyDetectionResult[], timeWindowMs: number) => AnomalyDetectionResult[];
/**
 * Prioritizes anomalies for investigation.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to prioritize
 * @returns {AnomalyDetectionResult[]} Prioritized anomalies
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeAnomalies(anomalies);
 * ```
 */
export declare const prioritizeAnomalies: (anomalies: AnomalyDetectionResult[]) => AnomalyDetectionResult[];
/**
 * Exports anomaly data for external analysis.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to export
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const csv = exportAnomalyData(anomalies, 'csv');
 * ```
 */
export declare const exportAnomalyData: (anomalies: AnomalyDetectionResult[], format: "json" | "csv") => string;
/**
 * Calculates moving average for anomaly scores.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies with scores
 * @param {number} windowSize - Window size for moving average
 * @returns {number[]} Moving averages
 *
 * @example
 * ```typescript
 * const movingAvg = calculateAnomalyMovingAverage(anomalies, 5);
 * ```
 */
export declare const calculateAnomalyMovingAverage: (anomalies: AnomalyDetectionResult[], windowSize: number) => number[];
/**
 * Detects anomaly trends over time.
 *
 * @param {AnomalyDetectionResult[]} historicalAnomalies - Historical anomalies
 * @returns {Record<string, any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = detectAnomalyTrends(anomalies);
 * ```
 */
export declare const detectAnomalyTrends: (historicalAnomalies: AnomalyDetectionResult[]) => Record<string, any>;
/**
 * Anomaly Detection Service
 * Production-ready NestJS service for anomaly detection operations
 */
export declare class AnomalyDetectionService {
    /**
     * Performs comprehensive anomaly detection
     */
    detectAnomalies(data: any[], config: AnomalyDetectionConfig): Promise<AnomalyDetectionResult[]>;
}
declare const _default: {
    AnomalyDetectionConfigModel: typeof AnomalyDetectionConfigModel;
    AnomalyDetectionResultModel: typeof AnomalyDetectionResultModel;
    BehaviorBaselineModel: typeof BehaviorBaselineModel;
    detectStatisticalAnomalies: (dataPoints: number[], threshold?: number) => AnomalyDetectionResult[];
    detectBehavioralAnomaly: (currentBehavior: any, baseline: BehaviorBaseline) => AnomalyDetectionResult | null;
    detectTemporalAnomalies: (timeSeriesData: Array<{
        timestamp: Date;
        value: number;
    }>) => AnomalyDetectionResult[];
    calculateCompositeAnomalyScore: (detectionResults: Partial<AnomalyDetectionResult>[]) => number;
    createBehaviorBaseline: (entityId: string, entityType: string, historicalData: any[], profileType: BaselineProfileType) => BehaviorBaseline;
    updateBehaviorBaseline: (baseline: BehaviorBaseline, newData: any[], learningRate?: number) => BehaviorBaseline;
    calculateBaselineDeviation: (value: number, metrics: BaselineMetrics) => number;
    detectBaselineDeviation: (value: number, baseline: BehaviorBaseline, threshold?: number) => AnomalyDetectionResult | null;
    adaptiveBaselineLearning: (baseline: BehaviorBaseline, recentAnomalies: AnomalyDetectionResult[]) => BehaviorBaseline;
    matchThreatPatterns: (behavior: any, patterns: BehaviorPattern[]) => PatternMatchResult[];
    detectSequentialPatterns: (events: any[], timeWindow: number) => AnomalyDetectionResult[];
    detectAttackChains: (events: any[]) => AnomalyDetectionResult[];
    correlateSecurityEvents: (events: any[], correlationThreshold: number) => AnomalyDetectionResult[];
    correlateEventsByTime: (events: any[], timeWindow: number) => Array<{
        events: any[];
        correlation: number;
    }>;
    detectCausalCorrelations: (events: any[]) => Array<{
        cause: any;
        effect: any;
        confidence: number;
    }>;
    prepareMLFeatures: (data: any) => Record<string, number>;
    performRealtimeThreatAssessment: (event: any, baseline: BehaviorBaseline, patterns: BehaviorPattern[]) => Promise<AnomalyDetectionResult>;
    calculateDynamicThreatScore: (threat: any, history: any[]) => Promise<number>;
    aggregateThreatScores: (scores: Array<{
        score: number;
        weight: number;
    }>) => number;
    updateAnomalyBaseline: (anomalyId: string, isFalsePositive: boolean, baseline: BehaviorBaseline) => BehaviorBaseline;
    identifyBehaviorAnomalies: (activities: any[], baseline: BehaviorBaseline) => AnomalyDetectionResult[];
    calculateBaselineMetrics: (samples: number[]) => BaselineMetrics;
    analyzeUserBehavior: (userId: string, activities: any[], baseline: BehaviorBaseline) => Promise<AnomalyDetectionResult[]>;
    analyzeEntityBehavior: (entityId: string, entityType: string, activities: any[], baseline: BehaviorBaseline) => Promise<AnomalyDetectionResult[]>;
    trackBehaviorChanges: (oldBehavior: any[], newBehavior: any[]) => Record<string, number>;
    compareBehaviorProfiles: (profile1: BehaviorBaseline, profile2: BehaviorBaseline) => Record<string, number>;
    calculateBehaviorScore: (behavior: any) => number;
    normalizeAnomalyScores: (scores: number[]) => number[];
    calculateZScore: (value: number, mean: number, stdDev: number) => number;
    calculatePValue: (zScore: number) => number;
    determineAnomalySeverity: (anomalyScore: number) => AnomalySeverity;
    generateAnomalyReport: (anomalies: AnomalyDetectionResult[]) => Record<string, any>;
    filterAnomaliesBySeverity: (anomalies: AnomalyDetectionResult[], minSeverity: AnomalySeverity) => AnomalyDetectionResult[];
    groupAnomaliesByType: (anomalies: AnomalyDetectionResult[]) => Map<AnomalyType, AnomalyDetectionResult[]>;
    calculateDetectionAccuracy: (detectedAnomalies: AnomalyDetectionResult[], actualAnomalyIds: string[]) => Record<string, number>;
    mergeOverlappingAnomalies: (anomalies: AnomalyDetectionResult[], timeWindowMs: number) => AnomalyDetectionResult[];
    prioritizeAnomalies: (anomalies: AnomalyDetectionResult[]) => AnomalyDetectionResult[];
    exportAnomalyData: (anomalies: AnomalyDetectionResult[], format: "json" | "csv") => string;
    calculateAnomalyMovingAverage: (anomalies: AnomalyDetectionResult[], windowSize: number) => number[];
    detectAnomalyTrends: (historicalAnomalies: AnomalyDetectionResult[]) => Record<string, any>;
    AnomalyDetectionService: typeof AnomalyDetectionService;
};
export default _default;
//# sourceMappingURL=anomaly-detection-core-composite.d.ts.map