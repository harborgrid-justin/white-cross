/**
 * LOC: BEHAVANALCOMP001
 * File: /reuse/threat/composites/behavioral-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../behavioral-threat-analytics-kit
 *   - ../threat-scoring-kit
 *   - ../threat-correlation-kit
 *   - ../security-analytics-kit
 *   - ../threat-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - User and Entity Behavior Analytics (UEBA) services
 *   - Behavioral threat detection modules
 *   - Risk scoring engines
 *   - Insider threat detection systems
 *   - Peer group analysis services
 *   - Healthcare security monitoring dashboards
 */
/**
 * File: /reuse/threat/composites/behavioral-analytics-composite.ts
 * Locator: WC-BEHAVIORAL-ANALYTICS-COMPOSITE-001
 * Purpose: Comprehensive Behavioral Analytics Toolkit - Production-ready UEBA and behavioral threat analytics
 *
 * Upstream: Composed from behavioral-threat-analytics-kit, threat-scoring-kit, threat-correlation-kit, security-analytics-kit, threat-analytics-kit
 * Downstream: ../backend/*, UEBA services, Behavioral analytics, Insider threat detection, Risk assessment
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for UEBA, behavioral scoring, peer analysis, risk assessment, temporal analysis, pattern recognition
 *
 * LLM Context: Enterprise-grade behavioral analytics toolkit for White Cross healthcare platform.
 * Provides comprehensive User and Entity Behavior Analytics (UEBA) including user behavior profiling,
 * behavioral risk scoring, peer group comparative analysis, temporal behavior pattern analysis, insider
 * threat detection, privilege escalation detection, data exfiltration analysis, abnormal access pattern
 * recognition, compromised credential detection, and HIPAA-compliant behavioral monitoring for healthcare
 * systems. Composes functions from multiple threat intelligence kits to provide unified behavioral
 * analytics operations for detecting and preventing insider threats, account compromise, and data breaches.
 */
import { Model } from 'sequelize-typescript';
/**
 * Behavioral entity types for analytics
 */
export declare enum BehaviorEntityType {
    USER = "USER",
    SERVICE_ACCOUNT = "SERVICE_ACCOUNT",
    DEVICE = "DEVICE",
    APPLICATION = "APPLICATION",
    IP_ADDRESS = "IP_ADDRESS",
    API_KEY = "API_KEY"
}
/**
 * Risk level classification for behavioral analytics
 */
export declare enum BehaviorRiskLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    MINIMAL = "MINIMAL"
}
/**
 * Activity types for behavioral tracking
 */
export declare enum BehaviorActivityType {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    FILE_ACCESS = "FILE_ACCESS",
    FILE_DOWNLOAD = "FILE_DOWNLOAD",
    FILE_UPLOAD = "FILE_UPLOAD",
    FILE_DELETE = "FILE_DELETE",
    DATA_QUERY = "DATA_QUERY",
    DATA_EXPORT = "DATA_EXPORT",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    CONFIGURATION_CHANGE = "CONFIGURATION_CHANGE",
    API_CALL = "API_CALL",
    EMAIL_SENT = "EMAIL_SENT",
    FAILED_LOGIN = "FAILED_LOGIN",
    PASSWORD_CHANGE = "PASSWORD_CHANGE",
    PERMISSION_CHANGE = "PERMISSION_CHANGE"
}
/**
 * Behavioral entity for UEBA
 */
export interface BehaviorEntity {
    id: string;
    type: BehaviorEntityType;
    identifier: string;
    department?: string;
    role?: string;
    riskLevel: BehaviorRiskLevel;
    riskScore: number;
    trustScore: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Behavioral activity event
 */
export interface BehaviorActivity {
    id: string;
    entityId: string;
    activityType: BehaviorActivityType;
    timestamp: Date;
    details: ActivityDetails;
    location?: GeoLocation;
    device?: DeviceInfo;
    contextual?: ContextualData;
    riskScore?: number;
    metadata?: Record<string, any>;
}
/**
 * Activity details structure
 */
export interface ActivityDetails {
    resource?: string;
    action?: string;
    result: 'success' | 'failure' | 'partial';
    duration?: number;
    dataVolume?: number;
    recordCount?: number;
    severity?: string;
    impactLevel?: string;
    [key: string]: any;
}
/**
 * Geographic location data
 */
export interface GeoLocation {
    country: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    ipAddress?: string;
    asn?: string;
    isp?: string;
}
/**
 * Device information
 */
export interface DeviceInfo {
    deviceId: string;
    deviceType: string;
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    isManaged?: boolean;
    isTrusted?: boolean;
    lastSeen?: Date;
}
/**
 * Contextual data for behavioral analysis
 */
export interface ContextualData {
    timeOfDay: number;
    dayOfWeek: number;
    isBusinessHours: boolean;
    isHoliday?: boolean;
    isWeekend: boolean;
    sessionId?: string;
    sessionDuration?: number;
}
/**
 * Behavioral risk score structure
 */
export interface BehaviorRiskScore {
    id: string;
    entityId: string;
    timestamp: Date;
    overallScore: number;
    components: RiskScoreComponents;
    factors: RiskFactor[];
    trend: RiskTrend;
    confidence: number;
    explanation: string;
    recommendedActions: string[];
}
/**
 * Risk score components breakdown
 */
export interface RiskScoreComponents {
    activityPattern: number;
    accessPattern: number;
    volumeAnomaly: number;
    temporalAnomaly: number;
    locationAnomaly: number;
    peerDeviation: number;
    privilegeRisk: number;
    dataAccessRisk: number;
}
/**
 * Individual risk factor
 */
export interface RiskFactor {
    type: string;
    description: string;
    score: number;
    weight: number;
    evidence: string[];
    mitigation?: string;
}
/**
 * Risk trend analysis
 */
export interface RiskTrend {
    direction: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
    changeRate: number;
    prediction: number;
    confidence: number;
}
/**
 * Peer group definition
 */
export interface PeerGroup {
    id: string;
    name: string;
    description: string;
    criteria: PeerGroupCriteria;
    members: string[];
    baseline: BehaviorBaseline;
    statistics: PeerGroupStatistics;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Peer group criteria for membership
 */
export interface PeerGroupCriteria {
    department?: string[];
    role?: string[];
    location?: string[];
    entityType?: BehaviorEntityType[];
    customFilters?: Record<string, any>;
}
/**
 * Peer group statistical data
 */
export interface PeerGroupStatistics {
    memberCount: number;
    avgActivityRate: number;
    avgRiskScore: number;
    stdDevRiskScore: number;
    medianRiskScore: number;
    outlierCount: number;
    lastUpdated: Date;
}
/**
 * Behavioral baseline profile
 */
export interface BehaviorBaseline {
    id: string;
    entityId: string;
    profilePeriod: TimeRange;
    activityMetrics: ActivityMetrics;
    patterns: BehaviorPattern[];
    normalRanges: NormalRanges;
    confidence: number;
    sampleSize: number;
    lastUpdated: Date;
}
/**
 * Time range definition
 */
export interface TimeRange {
    start: Date;
    end: Date;
    duration: number;
}
/**
 * Activity metrics for baseline
 */
export interface ActivityMetrics {
    avgDailyActivities: number;
    avgWeeklyActivities: number;
    avgSessionDuration: number;
    peakActivityHours: number[];
    commonLocations: string[];
    commonDevices: string[];
    typicalDataVolume: number;
    typicalAccessPatterns: string[];
}
/**
 * Behavior pattern structure
 */
export interface BehaviorPattern {
    id: string;
    type: PatternType;
    description: string;
    frequency: number;
    confidence: number;
    attributes: Record<string, any>;
    firstObserved: Date;
    lastObserved: Date;
    occurrenceCount: number;
}
/**
 * Pattern types
 */
export declare enum PatternType {
    TEMPORAL = "TEMPORAL",
    SEQUENTIAL = "SEQUENTIAL",
    VOLUMETRIC = "VOLUMETRIC",
    ACCESS = "ACCESS",
    LOCATION = "LOCATION",
    DEVICE = "DEVICE",
    DATA_FLOW = "DATA_FLOW"
}
/**
 * Normal behavior ranges
 */
export interface NormalRanges {
    activitiesPerDay: {
        min: number;
        max: number;
    };
    sessionDuration: {
        min: number;
        max: number;
    };
    dataVolume: {
        min: number;
        max: number;
    };
    loginTimes: {
        earliest: number;
        latest: number;
    };
    accessedResources: string[];
}
/**
 * Peer comparison result
 */
export interface PeerComparisonResult {
    entityId: string;
    peerGroupId: string;
    deviationScore: number;
    isOutlier: boolean;
    comparisons: PeerComparison[];
    ranking: number;
    percentile: number;
}
/**
 * Individual peer comparison
 */
export interface PeerComparison {
    metric: string;
    entityValue: number;
    peerAverage: number;
    peerStdDev: number;
    zScore: number;
    deviation: number;
    isAnomaly: boolean;
}
/**
 * Insider threat indicator
 */
export interface InsiderThreatIndicator {
    id: string;
    entityId: string;
    indicatorType: InsiderThreatType;
    severity: BehaviorRiskLevel;
    confidence: number;
    evidence: Evidence[];
    detectedAt: Date;
    description: string;
    recommendedActions: string[];
}
/**
 * Insider threat types
 */
export declare enum InsiderThreatType {
    DATA_EXFILTRATION = "DATA_EXFILTRATION",
    PRIVILEGE_ABUSE = "PRIVILEGE_ABUSE",
    CREDENTIAL_THEFT = "CREDENTIAL_THEFT",
    SABOTAGE = "SABOTAGE",
    POLICY_VIOLATION = "POLICY_VIOLATION",
    SUSPICIOUS_COLLABORATION = "SUSPICIOUS_COLLABORATION",
    ANOMALOUS_ACCESS = "ANOMALOUS_ACCESS"
}
/**
 * Evidence structure
 */
export interface Evidence {
    type: string;
    description: string;
    timestamp: Date;
    confidence: number;
    source: string;
    data?: Record<string, any>;
}
/**
 * Temporal behavior analysis result
 */
export interface TemporalBehaviorAnalysis {
    entityId: string;
    timeWindow: TimeRange;
    patterns: TemporalPattern[];
    anomalies: TemporalAnomaly[];
    trends: BehaviorTrend[];
    riskScore: number;
}
/**
 * Temporal pattern
 */
export interface TemporalPattern {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL';
    description: string;
    strength: number;
    periodicity: number;
    confidence: number;
}
/**
 * Temporal anomaly
 */
export interface TemporalAnomaly {
    timestamp: Date;
    type: 'TIME_OF_DAY' | 'DAY_OF_WEEK' | 'FREQUENCY' | 'DURATION';
    severity: BehaviorRiskLevel;
    description: string;
    expectedValue: any;
    actualValue: any;
    deviation: number;
}
/**
 * Behavior trend
 */
export interface BehaviorTrend {
    metric: string;
    direction: 'INCREASING' | 'DECREASING' | 'STABLE';
    magnitude: number;
    significance: number;
    startDate: Date;
    endDate: Date;
}
/**
 * Behavior Entity Model
 * Stores entities being monitored for behavioral analytics
 */
export declare class BehaviorEntityModel extends Model {
    id: string;
    type: BehaviorEntityType;
    identifier: string;
    department?: string;
    role?: string;
    riskLevel: BehaviorRiskLevel;
    riskScore: number;
    trustScore: number;
    metadata?: Record<string, any>;
}
/**
 * Behavior Activity Model
 * Stores individual behavioral activities
 */
export declare class BehaviorActivityModel extends Model {
    id: string;
    entityId: string;
    activityType: BehaviorActivityType;
    timestamp: Date;
    details: ActivityDetails;
    location?: GeoLocation;
    device?: DeviceInfo;
    contextual?: ContextualData;
    riskScore?: number;
    metadata?: Record<string, any>;
}
/**
 * Behavior Risk Score Model
 * Stores calculated risk scores
 */
export declare class BehaviorRiskScoreModel extends Model {
    id: string;
    entityId: string;
    timestamp: Date;
    overallScore: number;
    components: RiskScoreComponents;
    factors: RiskFactor[];
    trend: RiskTrend;
    confidence: number;
    explanation: string;
    recommendedActions: string[];
}
/**
 * Peer Group Model
 * Stores peer group definitions for comparative analysis
 */
export declare class PeerGroupModel extends Model {
    id: string;
    name: string;
    description: string;
    criteria: PeerGroupCriteria;
    members: string[];
    baseline: BehaviorBaseline;
    statistics: PeerGroupStatistics;
}
/**
 * Insider Threat Indicator Model
 * Stores detected insider threat indicators
 */
export declare class InsiderThreatIndicatorModel extends Model {
    id: string;
    entityId: string;
    indicatorType: InsiderThreatType;
    severity: BehaviorRiskLevel;
    confidence: number;
    evidence: Evidence[];
    detectedAt: Date;
    description: string;
    recommendedActions: string[];
}
/**
 * Analyzes user behavior and calculates comprehensive behavioral profile.
 *
 * @param {string} userId - User identifier
 * @param {BehaviorActivity[]} activities - Recent user activities
 * @param {BehaviorBaseline} baseline - User's behavioral baseline
 * @returns {Promise<BehaviorRiskScore>} Behavioral risk assessment
 *
 * @example
 * ```typescript
 * const riskScore = await analyzeUserBehavior('user123', activities, baseline);
 * console.log('Risk level:', riskScore.overallScore);
 * ```
 */
export declare const analyzeUserBehavior: (userId: string, activities: BehaviorActivity[], baseline: BehaviorBaseline) => Promise<BehaviorRiskScore>;
/**
 * Analyzes entity behavior (devices, applications, service accounts).
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorEntityType} entityType - Type of entity
 * @param {BehaviorActivity[]} activities - Entity activities
 * @param {BehaviorBaseline} baseline - Entity baseline
 * @returns {Promise<BehaviorRiskScore>} Risk assessment
 *
 * @example
 * ```typescript
 * const riskScore = await analyzeEntityBehavior('device123', BehaviorEntityType.DEVICE, activities, baseline);
 * ```
 */
export declare const analyzeEntityBehavior: (entityId: string, entityType: BehaviorEntityType, activities: BehaviorActivity[], baseline: BehaviorBaseline) => Promise<BehaviorRiskScore>;
/**
 * Tracks behavior changes over time periods.
 *
 * @param {BehaviorActivity[]} oldPeriod - Previous period activities
 * @param {BehaviorActivity[]} newPeriod - Current period activities
 * @returns {Record<string, number>} Change metrics
 *
 * @example
 * ```typescript
 * const changes = trackBehaviorChanges(lastWeekActivities, thisWeekActivities);
 * ```
 */
export declare const trackBehaviorChanges: (oldPeriod: BehaviorActivity[], newPeriod: BehaviorActivity[]) => Record<string, number>;
/**
 * Compares two behavioral profiles.
 *
 * @param {BehaviorBaseline} profile1 - First baseline profile
 * @param {BehaviorBaseline} profile2 - Second baseline profile
 * @returns {Record<string, number>} Comparison metrics
 *
 * @example
 * ```typescript
 * const comparison = compareBehaviorProfiles(userBaseline, peerBaseline);
 * ```
 */
export declare const compareBehaviorProfiles: (profile1: BehaviorBaseline, profile2: BehaviorBaseline) => Record<string, number>;
/**
 * Calculates comprehensive behavior score.
 *
 * @param {BehaviorRiskScore} riskScoreData - Risk score data
 * @returns {number} Overall behavior score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateBehaviorScore(riskData);
 * ```
 */
export declare const calculateBehaviorScore: (riskScoreData: BehaviorRiskScore) => number;
/**
 * Identifies behavioral anomalies from activities.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @returns {BehaviorActivity[]} Anomalous activities
 *
 * @example
 * ```typescript
 * const anomalies = identifyBehaviorAnomalies(activities, baseline);
 * ```
 */
export declare const identifyBehaviorAnomalies: (activities: BehaviorActivity[], baseline: BehaviorBaseline) => BehaviorActivity[];
/**
 * Creates behavioral baseline from historical data.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} historicalActivities - Historical activities
 * @param {number} periodDays - Period in days for baseline
 * @returns {BehaviorBaseline} Generated baseline
 *
 * @example
 * ```typescript
 * const baseline = createBehaviorBaseline('user123', activities, 30);
 * ```
 */
export declare const createBehaviorBaseline: (entityId: string, historicalActivities: BehaviorActivity[], periodDays?: number) => BehaviorBaseline;
/**
 * Updates behavioral baseline with new data.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {BehaviorActivity[]} newActivities - New activities
 * @param {number} learningRate - Learning rate (0-1)
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateBehaviorBaseline(baseline, newActivities, 0.1);
 * ```
 */
export declare const updateBehaviorBaseline: (baseline: BehaviorBaseline, newActivities: BehaviorActivity[], learningRate?: number) => BehaviorBaseline;
/**
 * Calculates baseline metrics from activity data.
 *
 * @param {BehaviorActivity[]} activities - Activities for analysis
 * @returns {ActivityMetrics} Calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBaselineMetrics(activities);
 * ```
 */
export declare const calculateBaselineMetrics: (activities: BehaviorActivity[]) => ActivityMetrics;
/**
 * Detects baseline deviation in behavior.
 *
 * @param {number} currentValue - Current metric value
 * @param {NormalRanges} normalRanges - Normal behavior ranges
 * @param {string} metric - Metric name
 * @returns {boolean} Whether deviation detected
 *
 * @example
 * ```typescript
 * const deviated = detectBaselineDeviation(150, normalRanges, 'activitiesPerDay');
 * ```
 */
export declare const detectBaselineDeviation: (currentValue: number, normalRanges: NormalRanges, metric: keyof Pick<NormalRanges, "activitiesPerDay" | "sessionDuration" | "dataVolume">) => boolean;
/**
 * Performs adaptive baseline learning.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {BehaviorActivity[]} recentActivities - Recent activities
 * @returns {BehaviorBaseline} Adapted baseline
 *
 * @example
 * ```typescript
 * const adapted = adaptiveBaselineLearning(baseline, recentActivities);
 * ```
 */
export declare const adaptiveBaselineLearning: (baseline: BehaviorBaseline, recentActivities: BehaviorActivity[]) => BehaviorBaseline;
/**
 * Compares entity behavior against peer group.
 *
 * @param {string} entityId - Entity identifier
 * @param {PeerGroup} peerGroup - Peer group for comparison
 * @param {BehaviorBaseline} entityBaseline - Entity's baseline
 * @returns {PeerComparisonResult} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareToPeerGroup('user123', peerGroup, userBaseline);
 * ```
 */
export declare const compareToPeerGroup: (entityId: string, peerGroup: PeerGroup, entityBaseline: BehaviorBaseline) => PeerComparisonResult;
/**
 * Identifies outliers within peer group.
 *
 * @param {PeerGroup} peerGroup - Peer group
 * @param {Map<string, BehaviorBaseline>} memberBaselines - Member baselines
 * @returns {string[]} Entity IDs of outliers
 *
 * @example
 * ```typescript
 * const outliers = identifyPeerGroupOutliers(peerGroup, baselines);
 * ```
 */
export declare const identifyPeerGroupOutliers: (peerGroup: PeerGroup, memberBaselines: Map<string, BehaviorBaseline>) => string[];
/**
 * Calculates peer group statistics.
 *
 * @param {PeerGroup} peerGroup - Peer group
 * @param {Map<string, BehaviorRiskScore>} memberScores - Member risk scores
 * @returns {PeerGroupStatistics} Calculated statistics
 *
 * @example
 * ```typescript
 * const stats = calculatePeerGroupStatistics(peerGroup, scores);
 * ```
 */
export declare const calculatePeerGroupStatistics: (peerGroup: PeerGroup, memberScores: Map<string, BehaviorRiskScore>) => PeerGroupStatistics;
/**
 * Detects insider threat indicators.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Recent activities
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @returns {InsiderThreatIndicator[]} Detected threat indicators
 *
 * @example
 * ```typescript
 * const threats = detectInsiderThreats('user123', activities, baseline);
 * ```
 */
export declare const detectInsiderThreats: (entityId: string, activities: BehaviorActivity[], baseline: BehaviorBaseline) => InsiderThreatIndicator[];
/**
 * Analyzes temporal behavior patterns.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {TimeRange} timeWindow - Analysis time window
 * @returns {TemporalBehaviorAnalysis} Temporal analysis result
 *
 * @example
 * ```typescript
 * const temporal = analyzeTemporalBehavior('user123', activities, timeWindow);
 * ```
 */
export declare const analyzeTemporalBehavior: (entityId: string, activities: BehaviorActivity[], timeWindow: TimeRange) => TemporalBehaviorAnalysis;
/**
 * Calculates risk trend over time.
 *
 * @param {BehaviorRiskScore[]} historicalScores - Historical risk scores
 * @returns {RiskTrend} Risk trend analysis
 *
 * @example
 * ```typescript
 * const trend = calculateRiskTrend(scores);
 * ```
 */
export declare const calculateRiskTrend: (historicalScores: BehaviorRiskScore[]) => RiskTrend;
/**
 * Predicts future risk score.
 *
 * @param {BehaviorRiskScore[]} historicalScores - Historical scores
 * @param {number} daysAhead - Days to predict ahead
 * @returns {number} Predicted risk score
 *
 * @example
 * ```typescript
 * const predicted = predictRiskScore(scores, 7);
 * ```
 */
export declare const predictRiskScore: (historicalScores: BehaviorRiskScore[], daysAhead: number) => number;
/**
 * Generates behavioral analytics report.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorRiskScore[]} scores - Risk scores
 * @param {InsiderThreatIndicator[]} threats - Threat indicators
 * @returns {Record<string, any>} Analytics report
 *
 * @example
 * ```typescript
 * const report = generateBehaviorAnalyticsReport('user123', scores, threats);
 * ```
 */
export declare const generateBehaviorAnalyticsReport: (entityId: string, scores: BehaviorRiskScore[], threats: InsiderThreatIndicator[]) => Record<string, any>;
/**
 * Calculates confidence interval for risk score.
 *
 * @param {BehaviorRiskScore[]} scores - Historical scores
 * @param {number} confidenceLevel - Confidence level (0-1)
 * @returns {{lower: number, upper: number}} Confidence interval
 *
 * @example
 * ```typescript
 * const interval = calculateRiskConfidenceInterval(scores, 0.95);
 * ```
 */
export declare const calculateRiskConfidenceInterval: (scores: BehaviorRiskScore[], confidenceLevel?: number) => {
    lower: number;
    upper: number;
};
/**
 * Aggregates multiple risk scores.
 *
 * @param {BehaviorRiskScore[]} scores - Scores to aggregate
 * @returns {number} Aggregated score
 *
 * @example
 * ```typescript
 * const aggregated = aggregateRiskScores(scores);
 * ```
 */
export declare const aggregateRiskScores: (scores: BehaviorRiskScore[]) => number;
/**
 * Normalizes risk scores to 0-100 range.
 *
 * @param {number[]} scores - Raw scores
 * @returns {number[]} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = normalizeRiskScores(rawScores);
 * ```
 */
export declare const normalizeRiskScores: (scores: number[]) => number[];
/**
 * Determines risk level from score.
 *
 * @param {number} riskScore - Risk score (0-100)
 * @returns {BehaviorRiskLevel} Risk level
 *
 * @example
 * ```typescript
 * const level = determineRiskLevel(75);
 * ```
 */
export declare const determineRiskLevel: (riskScore: number) => BehaviorRiskLevel;
/**
 * Validates behavioral baseline data.
 *
 * @param {BehaviorBaseline} baseline - Baseline to validate
 * @returns {boolean} Whether baseline is valid
 *
 * @example
 * ```typescript
 * const isValid = validateBehaviorBaseline(baseline);
 * ```
 */
export declare const validateBehaviorBaseline: (baseline: BehaviorBaseline) => boolean;
/**
 * Merges multiple behavioral baselines.
 *
 * @param {BehaviorBaseline[]} baselines - Baselines to merge
 * @returns {BehaviorBaseline} Merged baseline
 *
 * @example
 * ```typescript
 * const merged = mergeBehaviorBaselines([baseline1, baseline2]);
 * ```
 */
export declare const mergeBehaviorBaselines: (baselines: BehaviorBaseline[]) => BehaviorBaseline;
/**
 * Exports behavioral data for analysis.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Activities
 * @param {BehaviorRiskScore[]} scores - Risk scores
 * @returns {Record<string, any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = exportBehaviorData('user123', activities, scores);
 * ```
 */
export declare const exportBehaviorData: (entityId: string, activities: BehaviorActivity[], scores: BehaviorRiskScore[]) => Record<string, any>;
/**
 * Calculates behavioral entropy (measure of predictability).
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {number} Entropy value (0-1, higher = more unpredictable)
 *
 * @example
 * ```typescript
 * const entropy = calculateBehavioralEntropy(activities);
 * ```
 */
export declare const calculateBehavioralEntropy: (activities: BehaviorActivity[]) => number;
/**
 * Scores behavioral consistency.
 *
 * @param {BehaviorActivity[]} activities - Activities
 * @param {BehaviorBaseline} baseline - Baseline
 * @returns {number} Consistency score (0-100, higher = more consistent)
 *
 * @example
 * ```typescript
 * const consistency = scoreBehaviorConsistency(activities, baseline);
 * ```
 */
export declare const scoreBehaviorConsistency: (activities: BehaviorActivity[], baseline: BehaviorBaseline) => number;
/**
 * Detects behavioral pattern shifts.
 *
 * @param {BehaviorBaseline} oldBaseline - Previous baseline
 * @param {BehaviorBaseline} newBaseline - Current baseline
 * @returns {boolean} Whether significant shift detected
 *
 * @example
 * ```typescript
 * const shifted = detectBehaviorShift(oldBaseline, newBaseline);
 * ```
 */
export declare const detectBehaviorShift: (oldBaseline: BehaviorBaseline, newBaseline: BehaviorBaseline) => boolean;
/**
 * Calculates behavioral stability score.
 *
 * @param {BehaviorRiskScore[]} scores - Historical scores
 * @returns {number} Stability score (0-100, higher = more stable)
 *
 * @example
 * ```typescript
 * const stability = calculateBehaviorStability(scores);
 * ```
 */
export declare const calculateBehaviorStability: (scores: BehaviorRiskScore[]) => number;
/**
 * Generates behavioral risk heatmap data.
 *
 * @param {Map<string, BehaviorRiskScore>} entityScores - Entity scores
 * @returns {Record<string, any>} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = generateRiskHeatmap(entityScores);
 * ```
 */
export declare const generateRiskHeatmap: (entityScores: Map<string, BehaviorRiskScore>) => Record<string, any>;
/**
 * Filters activities by type.
 *
 * @param {BehaviorActivity[]} activities - Activities to filter
 * @param {BehaviorActivityType[]} types - Activity types to include
 * @returns {BehaviorActivity[]} Filtered activities
 *
 * @example
 * ```typescript
 * const logins = filterActivitiesByType(activities, [BehaviorActivityType.LOGIN]);
 * ```
 */
export declare const filterActivitiesByType: (activities: BehaviorActivity[], types: BehaviorActivityType[]) => BehaviorActivity[];
/**
 * Calculates activity frequency distribution.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {Map<BehaviorActivityType, number>} Frequency distribution
 *
 * @example
 * ```typescript
 * const distribution = calculateActivityFrequency(activities);
 * ```
 */
export declare const calculateActivityFrequency: (activities: BehaviorActivity[]) => Map<BehaviorActivityType, number>;
/**
 * Detects privilegeescalation patterns.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {InsiderThreatIndicator[]} Detected privilege escalation indicators
 *
 * @example
 * ```typescript
 * const escalations = detectPrivilegeEscalation(activities);
 * ```
 */
export declare const detectPrivilegeEscalation: (activities: BehaviorActivity[]) => InsiderThreatIndicator[];
/**
 * Detects data exfiltration patterns.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {number} volumeThreshold - Volume threshold in bytes
 * @returns {InsiderThreatIndicator[]} Detected exfiltration indicators
 *
 * @example
 * ```typescript
 * const exfiltration = detectDataExfiltration(activities, 10000000);
 * ```
 */
export declare const detectDataExfiltration: (activities: BehaviorActivity[], volumeThreshold: number) => InsiderThreatIndicator[];
/**
 * Calculates trust score for entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Entity activities
 * @param {BehaviorRiskScore[]} historicalScores - Historical risk scores
 * @returns {number} Trust score (0-100)
 *
 * @example
 * ```typescript
 * const trust = calculateTrustScore('user123', activities, scores);
 * ```
 */
export declare const calculateTrustScore: (entityId: string, activities: BehaviorActivity[], historicalScores: BehaviorRiskScore[]) => number;
/**
 * Creates peer group from entity list.
 *
 * @param {string} name - Peer group name
 * @param {PeerGroupCriteria} criteria - Membership criteria
 * @param {BehaviorEntity[]} entities - Entities to evaluate
 * @returns {PeerGroup} Created peer group
 *
 * @example
 * ```typescript
 * const group = createPeerGroup('Finance Team', criteria, entities);
 * ```
 */
export declare const createPeerGroup: (name: string, criteria: PeerGroupCriteria, entities: BehaviorEntity[]) => PeerGroup;
/**
 * Scores behavioral anomaly severity.
 *
 * @param {BehaviorActivity} activity - Activity to score
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @returns {number} Severity score (0-100)
 *
 * @example
 * ```typescript
 * const severity = scoreBehaviorAnomalySeverity(activity, baseline);
 * ```
 */
export declare const scoreBehaviorAnomalySeverity: (activity: BehaviorActivity, baseline: BehaviorBaseline) => number;
/**
 * Behavioral Analytics Service
 * Production-ready NestJS service for UEBA operations
 */
export declare class BehavioralAnalyticsService {
    /**
     * Performs comprehensive behavioral analysis
     */
    performBehaviorAnalysis(entityId: string, activities: BehaviorActivity[], baseline: BehaviorBaseline): Promise<BehaviorRiskScore>;
    /**
     * Detects insider threats
     */
    detectInsiderThreats(entityId: string, activities: BehaviorActivity[], baseline: BehaviorBaseline): Promise<InsiderThreatIndicator[]>;
    /**
     * Compares entity to peer group
     */
    compareToPeers(entityId: string, peerGroup: PeerGroup, entityBaseline: BehaviorBaseline): Promise<PeerComparisonResult>;
}
declare const _default: {
    BehaviorEntityModel: typeof BehaviorEntityModel;
    BehaviorActivityModel: typeof BehaviorActivityModel;
    BehaviorRiskScoreModel: typeof BehaviorRiskScoreModel;
    PeerGroupModel: typeof PeerGroupModel;
    InsiderThreatIndicatorModel: typeof InsiderThreatIndicatorModel;
    analyzeUserBehavior: (userId: string, activities: BehaviorActivity[], baseline: BehaviorBaseline) => Promise<BehaviorRiskScore>;
    analyzeEntityBehavior: (entityId: string, entityType: BehaviorEntityType, activities: BehaviorActivity[], baseline: BehaviorBaseline) => Promise<BehaviorRiskScore>;
    trackBehaviorChanges: (oldPeriod: BehaviorActivity[], newPeriod: BehaviorActivity[]) => Record<string, number>;
    compareBehaviorProfiles: (profile1: BehaviorBaseline, profile2: BehaviorBaseline) => Record<string, number>;
    calculateBehaviorScore: (riskScoreData: BehaviorRiskScore) => number;
    identifyBehaviorAnomalies: (activities: BehaviorActivity[], baseline: BehaviorBaseline) => BehaviorActivity[];
    createBehaviorBaseline: (entityId: string, historicalActivities: BehaviorActivity[], periodDays?: number) => BehaviorBaseline;
    updateBehaviorBaseline: (baseline: BehaviorBaseline, newActivities: BehaviorActivity[], learningRate?: number) => BehaviorBaseline;
    calculateBaselineMetrics: (activities: BehaviorActivity[]) => ActivityMetrics;
    detectBaselineDeviation: (currentValue: number, normalRanges: NormalRanges, metric: keyof Pick<NormalRanges, "activitiesPerDay" | "sessionDuration" | "dataVolume">) => boolean;
    adaptiveBaselineLearning: (baseline: BehaviorBaseline, recentActivities: BehaviorActivity[]) => BehaviorBaseline;
    compareToPeerGroup: (entityId: string, peerGroup: PeerGroup, entityBaseline: BehaviorBaseline) => PeerComparisonResult;
    identifyPeerGroupOutliers: (peerGroup: PeerGroup, memberBaselines: Map<string, BehaviorBaseline>) => string[];
    calculatePeerGroupStatistics: (peerGroup: PeerGroup, memberScores: Map<string, BehaviorRiskScore>) => PeerGroupStatistics;
    detectInsiderThreats: (entityId: string, activities: BehaviorActivity[], baseline: BehaviorBaseline) => InsiderThreatIndicator[];
    analyzeTemporalBehavior: (entityId: string, activities: BehaviorActivity[], timeWindow: TimeRange) => TemporalBehaviorAnalysis;
    calculateRiskTrend: (historicalScores: BehaviorRiskScore[]) => RiskTrend;
    predictRiskScore: (historicalScores: BehaviorRiskScore[], daysAhead: number) => number;
    generateBehaviorAnalyticsReport: (entityId: string, scores: BehaviorRiskScore[], threats: InsiderThreatIndicator[]) => Record<string, any>;
    calculateRiskConfidenceInterval: (scores: BehaviorRiskScore[], confidenceLevel?: number) => {
        lower: number;
        upper: number;
    };
    aggregateRiskScores: (scores: BehaviorRiskScore[]) => number;
    normalizeRiskScores: (scores: number[]) => number[];
    determineRiskLevel: (riskScore: number) => BehaviorRiskLevel;
    validateBehaviorBaseline: (baseline: BehaviorBaseline) => boolean;
    mergeBehaviorBaselines: (baselines: BehaviorBaseline[]) => BehaviorBaseline;
    exportBehaviorData: (entityId: string, activities: BehaviorActivity[], scores: BehaviorRiskScore[]) => Record<string, any>;
    calculateBehavioralEntropy: (activities: BehaviorActivity[]) => number;
    scoreBehaviorConsistency: (activities: BehaviorActivity[], baseline: BehaviorBaseline) => number;
    detectBehaviorShift: (oldBaseline: BehaviorBaseline, newBaseline: BehaviorBaseline) => boolean;
    calculateBehaviorStability: (scores: BehaviorRiskScore[]) => number;
    generateRiskHeatmap: (entityScores: Map<string, BehaviorRiskScore>) => Record<string, any>;
    filterActivitiesByType: (activities: BehaviorActivity[], types: BehaviorActivityType[]) => BehaviorActivity[];
    calculateActivityFrequency: (activities: BehaviorActivity[]) => Map<BehaviorActivityType, number>;
    detectPrivilegeEscalation: (activities: BehaviorActivity[]) => InsiderThreatIndicator[];
    detectDataExfiltration: (activities: BehaviorActivity[], volumeThreshold: number) => InsiderThreatIndicator[];
    calculateTrustScore: (entityId: string, activities: BehaviorActivity[], historicalScores: BehaviorRiskScore[]) => number;
    createPeerGroup: (name: string, criteria: PeerGroupCriteria, entities: BehaviorEntity[]) => PeerGroup;
    scoreBehaviorAnomalySeverity: (activity: BehaviorActivity, baseline: BehaviorBaseline) => number;
    BehavioralAnalyticsService: typeof BehavioralAnalyticsService;
};
export default _default;
//# sourceMappingURL=behavioral-analytics-composite.d.ts.map