/**
 * LOC: BEHAVIORALTHREAT001
 * File: /reuse/threat/behavioral-threat-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - User and Entity Behavior Analytics (UEBA) services
 *   - Anomaly detection modules
 *   - Risk scoring engines
 *   - Security monitoring dashboards
 *   - Insider threat detection systems
 *   - Behavioral alerting services
 */
/**
 * User or entity for behavioral analysis
 */
export interface BehaviorEntity {
    id: string;
    type: EntityType;
    identifier: string;
    department?: string;
    role?: string;
    riskLevel: RiskLevel;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Entity types for behavioral analysis
 */
export declare enum EntityType {
    USER = "USER",
    DEVICE = "DEVICE",
    IP_ADDRESS = "IP_ADDRESS",
    APPLICATION = "APPLICATION",
    SERVICE_ACCOUNT = "SERVICE_ACCOUNT",
    API_KEY = "API_KEY"
}
/**
 * Risk level classification
 */
export declare enum RiskLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    MINIMAL = "MINIMAL"
}
/**
 * Behavioral activity event
 */
export interface BehaviorActivity {
    id: string;
    entityId: string;
    activityType: ActivityType;
    timestamp: Date;
    details: ActivityDetails;
    location?: GeoLocation;
    device?: DeviceInfo;
    metadata?: Record<string, any>;
}
/**
 * Activity types
 */
export declare enum ActivityType {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    FILE_ACCESS = "FILE_ACCESS",
    FILE_DOWNLOAD = "FILE_DOWNLOAD",
    FILE_UPLOAD = "FILE_UPLOAD",
    DATA_QUERY = "DATA_QUERY",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    CONFIGURATION_CHANGE = "CONFIGURATION_CHANGE",
    API_CALL = "API_CALL",
    EMAIL_SENT = "EMAIL_SENT",
    FAILED_LOGIN = "FAILED_LOGIN"
}
/**
 * Activity details
 */
export interface ActivityDetails {
    resource?: string;
    action?: string;
    result: 'success' | 'failure' | 'partial';
    duration?: number;
    dataVolume?: number;
    recordCount?: number;
    severity?: string;
    [key: string]: any;
}
/**
 * Geographic location
 */
export interface GeoLocation {
    country: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    ipAddress?: string;
}
/**
 * Device information
 */
export interface DeviceInfo {
    deviceId: string;
    deviceType: string;
    os?: string;
    browser?: string;
    isManaged?: boolean;
}
/**
 * Behavioral baseline profile
 */
export interface BehaviorBaseline {
    id: string;
    entityId: string;
    baselineType: BaselineType;
    timeWindow: TimeWindow;
    metrics: BaselineMetrics;
    lastUpdated: Date;
    confidence: number;
    sampleSize: number;
    version: string;
}
/**
 * Baseline types
 */
export declare enum BaselineType {
    ACTIVITY_FREQUENCY = "ACTIVITY_FREQUENCY",
    ACCESS_PATTERNS = "ACCESS_PATTERNS",
    TIME_PATTERNS = "TIME_PATTERNS",
    LOCATION_PATTERNS = "LOCATION_PATTERNS",
    DATA_VOLUME = "DATA_VOLUME",
    PEER_GROUP = "PEER_GROUP"
}
/**
 * Time window for baseline
 */
export interface TimeWindow {
    start: Date;
    end: Date;
    duration: number;
}
/**
 * Baseline metrics
 */
export interface BaselineMetrics {
    mean?: number;
    median?: number;
    stdDev?: number;
    min?: number;
    max?: number;
    percentiles?: {
        p25?: number;
        p50?: number;
        p75?: number;
        p90?: number;
        p95?: number;
        p99?: number;
    };
    distribution?: Record<string, number>;
    patterns?: Array<{
        pattern: string;
        frequency: number;
        confidence: number;
    }>;
}
/**
 * Detected anomaly
 */
export interface BehaviorAnomaly {
    id: string;
    entityId: string;
    anomalyType: AnomalyType;
    severity: RiskLevel;
    confidence: number;
    detectedAt: Date;
    activityId?: string;
    baseline?: string;
    deviation: AnomalyDeviation;
    context: AnomalyContext;
    status: AnomalyStatus;
    investigationNotes?: string;
}
/**
 * Anomaly types
 */
export declare enum AnomalyType {
    STATISTICAL = "STATISTICAL",
    TEMPORAL = "TEMPORAL",
    CONTEXTUAL = "CONTEXTUAL",
    VOLUME = "VOLUME",
    FREQUENCY = "FREQUENCY",
    LOCATION = "LOCATION",
    ACCESS_PATTERN = "ACCESS_PATTERN",
    PRIVILEGE = "PRIVILEGE",
    PEER_GROUP = "PEER_GROUP"
}
/**
 * Anomaly deviation metrics
 */
export interface AnomalyDeviation {
    expectedValue?: number;
    actualValue?: number;
    deviationScore: number;
    deviationPercentage: number;
    threshold: number;
}
/**
 * Anomaly context
 */
export interface AnomalyContext {
    relatedActivities: string[];
    timeOfDay?: string;
    dayOfWeek?: string;
    location?: GeoLocation;
    device?: DeviceInfo;
    peerComparison?: {
        peerAverage: number;
        entityValue: number;
        percentile: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Anomaly status
 */
export declare enum AnomalyStatus {
    NEW = "NEW",
    INVESTIGATING = "INVESTIGATING",
    CONFIRMED_THREAT = "CONFIRMED_THREAT",
    FALSE_POSITIVE = "FALSE_POSITIVE",
    RESOLVED = "RESOLVED",
    SUPPRESSED = "SUPPRESSED"
}
/**
 * Behavior risk score
 */
export interface BehaviorRiskScore {
    id: string;
    entityId: string;
    overallScore: number;
    calculatedAt: Date;
    factors: RiskFactor[];
    historicalScores: Array<{
        timestamp: Date;
        score: number;
    }>;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
    recommendedActions: string[];
}
/**
 * Individual risk factor
 */
export interface RiskFactor {
    factorType: RiskFactorType;
    score: number;
    weight: number;
    description: string;
    evidence: any[];
}
/**
 * Risk factor types
 */
export declare enum RiskFactorType {
    ANOMALY_FREQUENCY = "ANOMALY_FREQUENCY",
    ANOMALY_SEVERITY = "ANOMALY_SEVERITY",
    FAILED_AUTHENTICATIONS = "FAILED_AUTHENTICATIONS",
    PRIVILEGE_CHANGES = "PRIVILEGE_CHANGES",
    UNUSUAL_LOCATIONS = "UNUSUAL_LOCATIONS",
    DATA_EXFILTRATION_INDICATORS = "DATA_EXFILTRATION_INDICATORS",
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT",
    TIME_ANOMALIES = "TIME_ANOMALIES",
    PEER_DEVIATION = "PEER_DEVIATION"
}
/**
 * Behavior pattern
 */
export interface BehaviorPattern {
    id: string;
    patternType: PatternType;
    name: string;
    description: string;
    signature: PatternSignature;
    threatLevel: RiskLevel;
    confidence: number;
    matchCriteria: MatchCriteria[];
}
/**
 * Pattern types
 */
export declare enum PatternType {
    THREAT = "THREAT",
    NORMAL = "NORMAL",
    SUSPICIOUS = "SUSPICIOUS",
    COMPLIANCE_VIOLATION = "COMPLIANCE_VIOLATION"
}
/**
 * Pattern signature
 */
export interface PatternSignature {
    activities: ActivityType[];
    timeWindow?: number;
    sequence?: boolean;
    frequency?: {
        min?: number;
        max?: number;
    };
    conditions?: Array<{
        field: string;
        operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'regex';
        value: any;
    }>;
}
/**
 * Pattern match criteria
 */
export interface MatchCriteria {
    field: string;
    operator: string;
    value: any;
    weight: number;
}
/**
 * Peer group definition
 */
export interface PeerGroup {
    id: string;
    name: string;
    description?: string;
    criteria: PeerGroupCriteria;
    members: string[];
    baselineMetrics: BaselineMetrics;
    updatedAt: Date;
}
/**
 * Peer group criteria
 */
export interface PeerGroupCriteria {
    department?: string[];
    role?: string[];
    activityVolume?: {
        min?: number;
        max?: number;
    };
    customFilters?: Array<{
        field: string;
        value: any;
    }>;
}
/**
 * Behavioral alert
 */
export interface BehaviorAlert {
    id: string;
    entityId: string;
    alertType: AlertType;
    severity: RiskLevel;
    priority: number;
    title: string;
    description: string;
    detectedAt: Date;
    anomalies: string[];
    riskScore?: number;
    recommendations: string[];
    status: AlertStatus;
    assignedTo?: string;
    acknowledgedAt?: Date;
    resolvedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Alert types
 */
export declare enum AlertType {
    INSIDER_THREAT = "INSIDER_THREAT",
    COMPROMISED_CREDENTIALS = "COMPROMISED_CREDENTIALS",
    PRIVILEGE_ABUSE = "PRIVILEGE_ABUSE",
    DATA_EXFILTRATION = "DATA_EXFILTRATION",
    UNUSUAL_ACCESS = "UNUSUAL_ACCESS",
    POLICY_VIOLATION = "POLICY_VIOLATION",
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT",
    BRUTE_FORCE = "BRUTE_FORCE"
}
/**
 * Alert status
 */
export declare enum AlertStatus {
    NEW = "NEW",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    INVESTIGATING = "INVESTIGATING",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    FALSE_POSITIVE = "FALSE_POSITIVE"
}
/**
 * Sequelize BehaviorEntity model attributes.
 *
 * @example
 * ```typescript
 * class BehaviorEntity extends Model {}
 * BehaviorEntity.init(getBehaviorEntityModelAttributes(), {
 *   sequelize,
 *   tableName: 'behavior_entities',
 *   timestamps: true
 * });
 * ```
 */
export declare const getBehaviorEntityModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    identifier: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    department: {
        type: string;
        allowNull: boolean;
    };
    role: {
        type: string;
        allowNull: boolean;
    };
    riskLevel: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
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
 * Sequelize BehaviorActivity model attributes.
 *
 * @example
 * ```typescript
 * class BehaviorActivity extends Model {}
 * BehaviorActivity.init(getBehaviorActivityModelAttributes(), {
 *   sequelize,
 *   tableName: 'behavior_activities',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['entityId'] },
 *     { fields: ['activityType'] },
 *     { fields: ['timestamp'] }
 *   ]
 * });
 * ```
 */
export declare const getBehaviorActivityModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    entityId: {
        type: string;
        allowNull: boolean;
    };
    activityType: {
        type: string;
        allowNull: boolean;
    };
    timestamp: {
        type: string;
        allowNull: boolean;
    };
    details: {
        type: string;
        allowNull: boolean;
    };
    location: {
        type: string;
        allowNull: boolean;
    };
    device: {
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
 * Sequelize BehaviorBaseline model attributes.
 *
 * @example
 * ```typescript
 * class BehaviorBaseline extends Model {}
 * BehaviorBaseline.init(getBehaviorBaselineModelAttributes(), {
 *   sequelize,
 *   tableName: 'behavior_baselines',
 *   timestamps: true
 * });
 * ```
 */
export declare const getBehaviorBaselineModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    entityId: {
        type: string;
        allowNull: boolean;
    };
    baselineType: {
        type: string;
        allowNull: boolean;
    };
    timeWindow: {
        type: string;
        allowNull: boolean;
    };
    metrics: {
        type: string;
        allowNull: boolean;
    };
    lastUpdated: {
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
    sampleSize: {
        type: string;
        allowNull: boolean;
    };
    version: {
        type: string;
        allowNull: boolean;
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
 * Sequelize BehaviorAnomaly model attributes.
 *
 * @example
 * ```typescript
 * class BehaviorAnomaly extends Model {}
 * BehaviorAnomaly.init(getBehaviorAnomalyModelAttributes(), {
 *   sequelize,
 *   tableName: 'behavior_anomalies',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['entityId'] },
 *     { fields: ['severity'] },
 *     { fields: ['status'] }
 *   ]
 * });
 * ```
 */
export declare const getBehaviorAnomalyModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    entityId: {
        type: string;
        allowNull: boolean;
    };
    anomalyType: {
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
    detectedAt: {
        type: string;
        allowNull: boolean;
    };
    activityId: {
        type: string;
        allowNull: boolean;
    };
    baseline: {
        type: string;
        allowNull: boolean;
    };
    deviation: {
        type: string;
        allowNull: boolean;
    };
    context: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    investigationNotes: {
        type: string;
        allowNull: boolean;
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
 * Sequelize BehaviorRiskScore model attributes.
 *
 * @example
 * ```typescript
 * class BehaviorRiskScore extends Model {}
 * BehaviorRiskScore.init(getBehaviorRiskScoreModelAttributes(), {
 *   sequelize,
 *   tableName: 'behavior_risk_scores',
 *   timestamps: true
 * });
 * ```
 */
export declare const getBehaviorRiskScoreModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    entityId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    overallScore: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    calculatedAt: {
        type: string;
        allowNull: boolean;
    };
    factors: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    historicalScores: {
        type: string;
        defaultValue: never[];
    };
    trendDirection: {
        type: string;
        allowNull: boolean;
    };
    recommendedActions: {
        type: string;
        defaultValue: never[];
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
 * Sequelize BehaviorAlert model attributes.
 *
 * @example
 * ```typescript
 * class BehaviorAlert extends Model {}
 * BehaviorAlert.init(getBehaviorAlertModelAttributes(), {
 *   sequelize,
 *   tableName: 'behavior_alerts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['entityId'] },
 *     { fields: ['severity'] },
 *     { fields: ['status'] },
 *     { fields: ['priority'] }
 *   ]
 * });
 * ```
 */
export declare const getBehaviorAlertModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    entityId: {
        type: string;
        allowNull: boolean;
    };
    alertType: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    priority: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    detectedAt: {
        type: string;
        allowNull: boolean;
    };
    anomalies: {
        type: string;
        defaultValue: never[];
    };
    riskScore: {
        type: string;
        allowNull: boolean;
    };
    recommendations: {
        type: string;
        defaultValue: never[];
    };
    status: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    assignedTo: {
        type: string;
        allowNull: boolean;
    };
    acknowledgedAt: {
        type: string;
        allowNull: boolean;
    };
    resolvedAt: {
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
 * Sequelize PeerGroup model attributes.
 *
 * @example
 * ```typescript
 * class PeerGroup extends Model {}
 * PeerGroup.init(getPeerGroupModelAttributes(), {
 *   sequelize,
 *   tableName: 'peer_groups',
 *   timestamps: true
 * });
 * ```
 */
export declare const getPeerGroupModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    criteria: {
        type: string;
        allowNull: boolean;
    };
    members: {
        type: string;
        defaultValue: never[];
    };
    baselineMetrics: {
        type: string;
        defaultValue: {};
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Analyzes user behavior patterns to detect anomalies and threats.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Recent activities
 * @param {BehaviorBaseline} baseline - Behavior baseline
 * @returns {Promise<{ anomalies: BehaviorAnomaly[]; riskScore: number }>} Analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeUserBehavior('user-123', recentActivities, userBaseline);
 * console.log(`Detected ${analysis.anomalies.length} anomalies, risk: ${analysis.riskScore}`);
 * ```
 */
export declare const analyzeUserBehavior: (entityId: string, activities: BehaviorActivity[], baseline: BehaviorBaseline) => Promise<{
    anomalies: BehaviorAnomaly[];
    riskScore: number;
}>;
/**
 * Analyzes entity (device, service, etc.) behavior patterns.
 *
 * @param {string} entityId - Entity identifier
 * @param {EntityType} entityType - Type of entity
 * @param {BehaviorActivity[]} activities - Entity activities
 * @returns {Promise<{ normalBehavior: boolean; anomalies: BehaviorAnomaly[] }>} Analysis results
 *
 * @example
 * ```typescript
 * const result = await analyzeEntityBehavior('device-789', EntityType.DEVICE, deviceActivities);
 * ```
 */
export declare const analyzeEntityBehavior: (entityId: string, entityType: EntityType, activities: BehaviorActivity[]) => Promise<{
    normalBehavior: boolean;
    anomalies: BehaviorAnomaly[];
}>;
/**
 * Tracks behavior changes over time for an entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorBaseline[]} historicalBaselines - Historical baselines
 * @param {BehaviorBaseline} currentBaseline - Current baseline
 * @returns {{ changeDetected: boolean; changes: Array<{ metric: string; oldValue: number; newValue: number; changePercentage: number }> }} Change analysis
 *
 * @example
 * ```typescript
 * const changes = trackBehaviorChanges('user-123', historicalBaselines, currentBaseline);
 * if (changes.changeDetected) {
 *   console.log('Behavior drift detected:', changes.changes);
 * }
 * ```
 */
export declare const trackBehaviorChanges: (entityId: string, historicalBaselines: BehaviorBaseline[], currentBaseline: BehaviorBaseline) => {
    changeDetected: boolean;
    changes: Array<{
        metric: string;
        oldValue: number;
        newValue: number;
        changePercentage: number;
    }>;
};
/**
 * Compares behavior profiles between entities or time periods.
 *
 * @param {BehaviorBaseline} baseline1 - First baseline
 * @param {BehaviorBaseline} baseline2 - Second baseline
 * @returns {{ similarity: number; differences: Array<{ metric: string; difference: number }> }} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = compareBehaviorProfiles(userBaseline, peerBaseline);
 * console.log(`Similarity: ${comparison.similarity}%`);
 * ```
 */
export declare const compareBehaviorProfiles: (baseline1: BehaviorBaseline, baseline2: BehaviorBaseline) => {
    similarity: number;
    differences: Array<{
        metric: string;
        difference: number;
    }>;
};
/**
 * Calculates comprehensive behavior score for an entity.
 *
 * @param {BehaviorRiskScore} riskScoreData - Risk score data with factors
 * @returns {BehaviorRiskScore} Calculated risk score
 *
 * @example
 * ```typescript
 * const score = calculateBehaviorScore(riskData);
 * console.log(`Overall risk: ${score.overallScore}`);
 * ```
 */
export declare const calculateBehaviorScore: (riskScoreData: BehaviorRiskScore) => BehaviorRiskScore;
/**
 * Identifies behavioral anomalies for an entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Recent activities
 * @param {BehaviorBaseline[]} baselines - Applicable baselines
 * @returns {BehaviorAnomaly[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = identifyBehaviorAnomalies('user-123', activities, baselines);
 * anomalies.forEach(a => console.log(`${a.anomalyType}: ${a.severity}`));
 * ```
 */
export declare const identifyBehaviorAnomalies: (entityId: string, activities: BehaviorActivity[], baselines: BehaviorBaseline[]) => BehaviorAnomaly[];
/**
 * Creates initial behavior baseline for an entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Historical activities
 * @param {BaselineType} baselineType - Type of baseline to create
 * @returns {BehaviorBaseline} Created baseline
 *
 * @example
 * ```typescript
 * const baseline = createBehaviorBaseline('user-123', historicalActivities, BaselineType.ACTIVITY_FREQUENCY);
 * ```
 */
export declare const createBehaviorBaseline: (entityId: string, activities: BehaviorActivity[], baselineType: BaselineType) => BehaviorBaseline;
/**
 * Updates existing behavior baseline with new data.
 *
 * @param {BehaviorBaseline} baseline - Existing baseline
 * @param {BehaviorActivity[]} newActivities - New activities
 * @param {object} [options] - Update options
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateBehaviorBaseline(currentBaseline, newActivities, {
 *   adaptiveLearning: true,
 *   learningRate: 0.1
 * });
 * ```
 */
export declare const updateBehaviorBaseline: (baseline: BehaviorBaseline, newActivities: BehaviorActivity[], options?: {
    adaptiveLearning?: boolean;
    learningRate?: number;
}) => BehaviorBaseline;
/**
 * Calculates baseline metrics from activity data.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {BaselineType} baselineType - Type of baseline
 * @returns {BaselineMetrics} Calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBaselineMetrics(activities, BaselineType.ACTIVITY_FREQUENCY);
 * console.log(`Mean: ${metrics.mean}, StdDev: ${metrics.stdDev}`);
 * ```
 */
export declare const calculateBaselineMetrics: (activities: BehaviorActivity[], baselineType: BaselineType) => BaselineMetrics;
/**
 * Detects deviation from established baseline.
 *
 * @param {BehaviorActivity[]} activities - Current activities
 * @param {BehaviorBaseline} baseline - Baseline to compare against
 * @returns {{ hasDeviation: boolean; deviationScore: number; details: any }} Deviation analysis
 *
 * @example
 * ```typescript
 * const deviation = detectBaselineDeviation(recentActivities, userBaseline);
 * if (deviation.hasDeviation) {
 *   console.log(`Deviation score: ${deviation.deviationScore}`);
 * }
 * ```
 */
export declare const detectBaselineDeviation: (activities: BehaviorActivity[], baseline: BehaviorBaseline) => {
    hasDeviation: boolean;
    deviationScore: number;
    details: any;
};
/**
 * Implements adaptive baseline learning that evolves with behavior.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {BehaviorActivity[]} activities - Recent activities
 * @param {object} options - Learning options
 * @returns {BehaviorBaseline} Adapted baseline
 *
 * @example
 * ```typescript
 * const adapted = adaptiveBaselineLearning(baseline, recentActivities, {
 *   learningRate: 0.1,
 *   decayFactor: 0.95
 * });
 * ```
 */
export declare const adaptiveBaselineLearning: (baseline: BehaviorBaseline, activities: BehaviorActivity[], options: {
    learningRate: number;
    decayFactor?: number;
}) => BehaviorBaseline;
/**
 * Detects statistical anomalies using standard deviation and outlier detection.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {BehaviorBaseline[]} baselines - Reference baselines
 * @returns {BehaviorAnomaly[]} Detected statistical anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectStatisticalAnomalies(activities, baselines);
 * ```
 */
export declare const detectStatisticalAnomalies: (activities: BehaviorActivity[], baselines: BehaviorBaseline[]) => BehaviorAnomaly[];
/**
 * Detects temporal anomalies (unusual timing, frequency).
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {BehaviorAnomaly[]} Detected temporal anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectTemporalAnomalies(activities);
 * // Detects after-hours access, unusual frequency spikes
 * ```
 */
export declare const detectTemporalAnomalies: (activities: BehaviorActivity[]) => BehaviorAnomaly[];
/**
 * Detects contextual anomalies (unusual combinations of attributes).
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {BehaviorBaseline[]} baselines - Reference baselines
 * @returns {BehaviorAnomaly[]} Detected contextual anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectContextualAnomalies(activities, baselines);
 * // Detects unusual location + activity combinations
 * ```
 */
export declare const detectContextualAnomalies: (activities: BehaviorActivity[], baselines: BehaviorBaseline[]) => BehaviorAnomaly[];
/**
 * Scores anomaly severity based on multiple factors.
 *
 * @param {BehaviorAnomaly} anomaly - Anomaly to score
 * @param {BehaviorRiskScore} [entityRiskScore] - Entity's overall risk score
 * @returns {BehaviorAnomaly} Anomaly with updated severity
 *
 * @example
 * ```typescript
 * const scored = scoreAnomalySeverity(anomaly, entityRiskScore);
 * console.log(`Severity: ${scored.severity}`);
 * ```
 */
export declare const scoreAnomalySeverity: (anomaly: BehaviorAnomaly, entityRiskScore?: BehaviorRiskScore) => BehaviorAnomaly;
/**
 * Classifies anomalies into threat categories.
 *
 * @param {BehaviorAnomaly[]} anomalies - Anomalies to classify
 * @returns {Record<string, BehaviorAnomaly[]>} Classified anomalies
 *
 * @example
 * ```typescript
 * const classified = classifyAnomalyType(anomalies);
 * console.log(`Privilege anomalies: ${classified.privilege.length}`);
 * ```
 */
export declare const classifyAnomalyType: (anomalies: BehaviorAnomaly[]) => Record<string, BehaviorAnomaly[]>;
/**
 * Correlates related behavioral anomalies.
 *
 * @param {BehaviorAnomaly[]} anomalies - Anomalies to correlate
 * @param {number} [timeWindowMs=3600000] - Time window for correlation (default 1 hour)
 * @returns {Array<{ cluster: BehaviorAnomaly[]; correlationScore: number }>} Correlated anomaly clusters
 *
 * @example
 * ```typescript
 * const clusters = correlateBehaviorAnomalies(anomalies, 3600000);
 * clusters.forEach(c => console.log(`Cluster of ${c.cluster.length} anomalies`));
 * ```
 */
export declare const correlateBehaviorAnomalies: (anomalies: BehaviorAnomaly[], timeWindowMs?: number) => Array<{
    cluster: BehaviorAnomaly[];
    correlationScore: number;
}>;
/**
 * Calculates comprehensive behavior-based risk score.
 *
 * @param {BehaviorRiskScore} riskData - Risk score data
 * @returns {BehaviorRiskScore} Calculated risk score
 *
 * @example
 * ```typescript
 * const risk = calculateBehaviorRiskScore(riskData);
 * console.log(`Risk: ${risk.overallScore}, Trend: ${risk.trendDirection}`);
 * ```
 */
export declare const calculateBehaviorRiskScore: (riskData: BehaviorRiskScore) => BehaviorRiskScore;
/**
 * Aggregates multiple risk factors into overall score.
 *
 * @param {RiskFactor[]} factors - Risk factors to aggregate
 * @returns {{ score: number; topFactors: RiskFactor[] }} Aggregated risk
 *
 * @example
 * ```typescript
 * const aggregated = aggregateRiskFactors(factors);
 * console.log(`Aggregated risk: ${aggregated.score}`);
 * ```
 */
export declare const aggregateRiskFactors: (factors: RiskFactor[]) => {
    score: number;
    topFactors: RiskFactor[];
};
/**
 * Adjusts risk score based on contextual information.
 *
 * @param {number} baseScore - Base risk score
 * @param {object} context - Contextual factors
 * @returns {number} Adjusted risk score
 *
 * @example
 * ```typescript
 * const adjusted = adjustRiskByContext(75, {
 *   department: 'IT',
 *   role: 'admin',
 *   timeOfDay: 'business_hours'
 * });
 * ```
 */
export declare const adjustRiskByContext: (baseScore: number, context: {
    department?: string;
    role?: string;
    timeOfDay?: "business_hours" | "after_hours";
    location?: "known" | "unknown";
    deviceManaged?: boolean;
}) => number;
/**
 * Tracks risk score trends over time.
 *
 * @param {BehaviorRiskScore} riskScore - Current risk score with history
 * @param {number} [windowDays=30] - Analysis window in days
 * @returns {{ trend: 'increasing' | 'decreasing' | 'stable'; changeRate: number; prediction: number }} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = trackRiskTrends(entityRiskScore, 30);
 * console.log(`Trend: ${trend.trend}, Predicted: ${trend.prediction}`);
 * ```
 */
export declare const trackRiskTrends: (riskScore: BehaviorRiskScore, windowDays?: number) => {
    trend: "increasing" | "decreasing" | "stable";
    changeRate: number;
    prediction: number;
};
/**
 * Prioritizes entities by risk score for investigation.
 *
 * @param {BehaviorRiskScore[]} scores - Risk scores to prioritize
 * @param {object} [options] - Prioritization options
 * @returns {Array<{ entityId: string; score: number; priority: number }>} Prioritized entities
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeHighRiskBehaviors(allScores, {
 *   minScore: 50,
 *   includeTrend: true
 * });
 * ```
 */
export declare const prioritizeHighRiskBehaviors: (scores: BehaviorRiskScore[], options?: {
    minScore?: number;
    includeTrend?: boolean;
    limit?: number;
}) => Array<{
    entityId: string;
    score: number;
    priority: number;
}>;
/**
 * Identifies behavior patterns in activity sequences.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {object} [options] - Pattern identification options
 * @returns {Array<{ pattern: string; frequency: number; activities: BehaviorActivity[] }>} Identified patterns
 *
 * @example
 * ```typescript
 * const patterns = identifyBehaviorPatterns(activities, { minFrequency: 3 });
 * ```
 */
export declare const identifyBehaviorPatterns: (activities: BehaviorActivity[], options?: {
    minFrequency?: number;
    sequenceLength?: number;
}) => Array<{
    pattern: string;
    frequency: number;
    activities: BehaviorActivity[];
}>;
/**
 * Matches activities against known threat patterns.
 *
 * @param {BehaviorActivity[]} activities - Activities to check
 * @param {BehaviorPattern[]} knownPatterns - Known threat patterns
 * @returns {Array<{ pattern: BehaviorPattern; matchScore: number; matchedActivities: BehaviorActivity[] }>} Pattern matches
 *
 * @example
 * ```typescript
 * const matches = matchKnownThreatPatterns(activities, threatPatternDatabase);
 * ```
 */
export declare const matchKnownThreatPatterns: (activities: BehaviorActivity[], knownPatterns: BehaviorPattern[]) => Array<{
    pattern: BehaviorPattern;
    matchScore: number;
    matchedActivities: BehaviorActivity[];
}>;
/**
 * Clusters similar behavior patterns together.
 *
 * @param {BehaviorActivity[]} activities - Activities to cluster
 * @param {number} [similarityThreshold=0.7] - Similarity threshold (0-1)
 * @returns {Array<{ clusterId: string; activities: BehaviorActivity[]; centroid: any }>} Behavior clusters
 *
 * @example
 * ```typescript
 * const clusters = clusterSimilarBehaviors(activities, 0.8);
 * ```
 */
export declare const clusterSimilarBehaviors: (activities: BehaviorActivity[], similarityThreshold?: number) => Array<{
    clusterId: string;
    activities: BehaviorActivity[];
    centroid: any;
}>;
/**
 * Extracts behavior signatures for pattern matching.
 *
 * @param {BehaviorActivity[]} activities - Activities to extract signatures from
 * @returns {Array<{ signature: string; frequency: number; metadata: any }>} Behavior signatures
 *
 * @example
 * ```typescript
 * const signatures = extractBehaviorSignatures(activities);
 * ```
 */
export declare const extractBehaviorSignatures: (activities: BehaviorActivity[]) => Array<{
    signature: string;
    frequency: number;
    metadata: any;
}>;
/**
 * Detects recurring behavior patterns over time.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {number} [windowMs=86400000] - Time window in milliseconds (default 24 hours)
 * @returns {Array<{ pattern: string; occurrences: number; interval: number }>} Recurring patterns
 *
 * @example
 * ```typescript
 * const recurring = detectRecurringPatterns(activities, 86400000);
 * // Finds patterns that repeat daily
 * ```
 */
export declare const detectRecurringPatterns: (activities: BehaviorActivity[], windowMs?: number) => Array<{
    pattern: string;
    occurrences: number;
    interval: number;
}>;
/**
 * Analyzes time-based behavior patterns.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {{ hourlyDistribution: Record<number, number>; weekdayDistribution: Record<number, number>; peakHours: number[] }} Time pattern analysis
 *
 * @example
 * ```typescript
 * const timePatterns = analyzeTimeBasedPatterns(activities);
 * console.log(`Peak hours: ${timePatterns.peakHours}`);
 * ```
 */
export declare const analyzeTimeBasedPatterns: (activities: BehaviorActivity[]) => {
    hourlyDistribution: Record<number, number>;
    weekdayDistribution: Record<number, number>;
    peakHours: number[];
};
/**
 * Detects unusual activity timing.
 *
 * @param {BehaviorActivity[]} activities - Activities to check
 * @param {BehaviorBaseline} timeBaseline - Time pattern baseline
 * @returns {BehaviorActivity[]} Activities with unusual timing
 *
 * @example
 * ```typescript
 * const unusual = detectUnusualTimings(activities, timeBaseline);
 * console.log(`${unusual.length} activities at unusual times`);
 * ```
 */
export declare const detectUnusualTimings: (activities: BehaviorActivity[], timeBaseline: BehaviorBaseline) => BehaviorActivity[];
/**
 * Tracks activity frequency over time.
 *
 * @param {BehaviorActivity[]} activities - Activities to track
 * @param {string} [interval='hourly'] - Time interval
 * @returns {Array<{ timestamp: string; count: number }>} Frequency timeline
 *
 * @example
 * ```typescript
 * const frequency = trackBehaviorFrequency(activities, 'daily');
 * ```
 */
export declare const trackBehaviorFrequency: (activities: BehaviorActivity[], interval?: "hourly" | "daily" | "weekly") => Array<{
    timestamp: string;
    count: number;
}>;
/**
 * Analyzes activity time windows and patterns.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {{ businessHours: number; afterHours: number; weekends: number; averageDuration: number }} Activity window analysis
 *
 * @example
 * ```typescript
 * const windows = analyzeActivityWindows(activities);
 * console.log(`Business hours: ${windows.businessHours}, After hours: ${windows.afterHours}`);
 * ```
 */
export declare const analyzeActivityWindows: (activities: BehaviorActivity[]) => {
    businessHours: number;
    afterHours: number;
    weekends: number;
    averageDuration: number;
};
/**
 * Creates peer groups based on criteria.
 *
 * @param {BehaviorEntity[]} entities - Entities to group
 * @param {PeerGroupCriteria} criteria - Grouping criteria
 * @returns {PeerGroup} Created peer group
 *
 * @example
 * ```typescript
 * const peerGroup = createPeerGroups(allEntities, {
 *   department: ['Engineering'],
 *   role: ['Developer', 'Senior Developer']
 * });
 * ```
 */
export declare const createPeerGroups: (entities: BehaviorEntity[], criteria: PeerGroupCriteria) => PeerGroup;
/**
 * Compares entity behavior to peer group baseline.
 *
 * @param {BehaviorEntity} entity - Entity to compare
 * @param {PeerGroup} peerGroup - Peer group
 * @param {BehaviorBaseline} entityBaseline - Entity's baseline
 * @returns {{ deviation: number; percentile: number; isOutlier: boolean }} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = compareToPeerBehavior(user, userPeerGroup, userBaseline);
 * if (comparison.isOutlier) {
 *   console.log(`User is an outlier at ${comparison.percentile} percentile`);
 * }
 * ```
 */
export declare const compareToPeerBehavior: (entity: BehaviorEntity, peerGroup: PeerGroup, entityBaseline: BehaviorBaseline) => {
    deviation: number;
    percentile: number;
    isOutlier: boolean;
};
/**
 * Detects anomalies within peer group context.
 *
 * @param {BehaviorEntity} entity - Entity to check
 * @param {PeerGroup} peerGroup - Peer group
 * @param {BehaviorActivity[]} entityActivities - Entity's activities
 * @returns {BehaviorAnomaly[]} Peer-group-based anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectPeerAnomalies(user, peerGroup, userActivities);
 * ```
 */
export declare const detectPeerAnomalies: (entity: BehaviorEntity, peerGroup: PeerGroup, entityActivities: BehaviorActivity[]) => BehaviorAnomaly[];
/**
 * Calculates peer group deviation score.
 *
 * @param {number} entityValue - Entity's value
 * @param {PeerGroup} peerGroup - Peer group
 * @returns {number} Deviation score (standard deviations from mean)
 *
 * @example
 * ```typescript
 * const deviation = calculatePeerDeviation(userActivityCount, peerGroup);
 * ```
 */
export declare const calculatePeerDeviation: (entityValue: number, peerGroup: PeerGroup) => number;
/**
 * Identifies outliers from peer group.
 *
 * @param {BehaviorEntity[]} entities - Entities in peer group
 * @param {BehaviorBaseline[]} baselines - Entity baselines
 * @param {number} [threshold=2] - Outlier threshold (standard deviations)
 * @returns {Array<{ entity: BehaviorEntity; deviationScore: number }>} Identified outliers
 *
 * @example
 * ```typescript
 * const outliers = identifyOutliers(peerGroupEntities, baselines, 2.5);
 * ```
 */
export declare const identifyOutliers: (entities: BehaviorEntity[], baselines: BehaviorBaseline[], threshold?: number) => Array<{
    entity: BehaviorEntity;
    deviationScore: number;
}>;
/**
 * Generates behavior-based alerts from anomalies.
 *
 * @param {BehaviorAnomaly[]} anomalies - Anomalies to alert on
 * @param {BehaviorEntity} entity - Entity associated with anomalies
 * @param {BehaviorRiskScore} [riskScore] - Entity risk score
 * @returns {BehaviorAlert[]} Generated alerts
 *
 * @example
 * ```typescript
 * const alerts = generateBehaviorAlert(detectedAnomalies, user, userRiskScore);
 * ```
 */
export declare const generateBehaviorAlert: (anomalies: BehaviorAnomaly[], entity: BehaviorEntity, riskScore?: BehaviorRiskScore) => BehaviorAlert[];
/**
 * Prioritizes alerts by severity and context.
 *
 * @param {BehaviorAlert[]} alerts - Alerts to prioritize
 * @returns {BehaviorAlert[]} Prioritized alerts
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeAlertsBySeverity(allAlerts);
 * // Returns alerts ordered by priority
 * ```
 */
export declare const prioritizeAlertsBySeverity: (alerts: BehaviorAlert[]) => BehaviorAlert[];
/**
 * Correlates related alerts for comprehensive view.
 *
 * @param {BehaviorAlert[]} alerts - Alerts to correlate
 * @param {number} [timeWindowMs=3600000] - Time window for correlation
 * @returns {Array<{ primary: BehaviorAlert; related: BehaviorAlert[] }>} Correlated alert groups
 *
 * @example
 * ```typescript
 * const correlated = correlateBehaviorAlerts(alerts, 3600000);
 * ```
 */
export declare const correlateBehaviorAlerts: (alerts: BehaviorAlert[], timeWindowMs?: number) => Array<{
    primary: BehaviorAlert;
    related: BehaviorAlert[];
}>;
/**
 * Creates actionable recommendations from alerts.
 *
 * @param {BehaviorAlert} alert - Alert to create recommendations for
 * @param {BehaviorEntity} entity - Associated entity
 * @returns {string[]} Recommended actions
 *
 * @example
 * ```typescript
 * const recommendations = createAlertRecommendations(alert, entity);
 * recommendations.forEach(r => console.log(r));
 * ```
 */
export declare const createAlertRecommendations: (alert: BehaviorAlert, entity: BehaviorEntity) => string[];
//# sourceMappingURL=behavioral-threat-analytics-kit.d.ts.map