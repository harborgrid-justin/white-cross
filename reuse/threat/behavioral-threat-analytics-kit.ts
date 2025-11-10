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
 * File: /reuse/threat/behavioral-threat-analytics-kit.ts
 * Locator: WC-BEHAVIORAL-THREAT-001
 * Purpose: Behavioral Threat Analytics Toolkit - Production-ready UEBA and anomaly detection
 *
 * Upstream: Independent utility module for behavioral analytics and anomaly detection
 * Downstream: ../backend/*, Security services, UEBA systems, Insider threat detection, Risk scoring
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, crypto
 * Exports: 40 utility functions for UEBA, baseline profiling, anomaly detection, risk scoring, pattern recognition
 *
 * LLM Context: Enterprise-grade behavioral threat analytics toolkit for White Cross healthcare platform.
 * Provides comprehensive User and Entity Behavior Analytics (UEBA) capabilities including baseline
 * behavior profiling, statistical and machine learning-based anomaly detection, multi-factor risk
 * scoring, behavior pattern recognition and matching against known threat patterns, temporal behavior
 * analysis for time-based anomalies, peer group analysis for identifying outliers, and automated
 * behavioral alerting with intelligent prioritization. Designed for HIPAA-compliant healthcare
 * environments with support for detecting insider threats, compromised credentials, privilege
 * escalation, data exfiltration, and abnormal access patterns. Includes Sequelize models for
 * behavior baselines, anomaly records, risk scores, and behavioral alerts.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User or entity for behavioral analysis
 */
export interface BehaviorEntity {
  id: string;
  type: EntityType;
  identifier: string; // username, device ID, IP, etc.
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
export enum EntityType {
  USER = 'USER',
  DEVICE = 'DEVICE',
  IP_ADDRESS = 'IP_ADDRESS',
  APPLICATION = 'APPLICATION',
  SERVICE_ACCOUNT = 'SERVICE_ACCOUNT',
  API_KEY = 'API_KEY',
}

/**
 * Risk level classification
 */
export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  MINIMAL = 'MINIMAL',
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
export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FILE_ACCESS = 'FILE_ACCESS',
  FILE_DOWNLOAD = 'FILE_DOWNLOAD',
  FILE_UPLOAD = 'FILE_UPLOAD',
  DATA_QUERY = 'DATA_QUERY',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  CONFIGURATION_CHANGE = 'CONFIGURATION_CHANGE',
  API_CALL = 'API_CALL',
  EMAIL_SENT = 'EMAIL_SENT',
  FAILED_LOGIN = 'FAILED_LOGIN',
}

/**
 * Activity details
 */
export interface ActivityDetails {
  resource?: string;
  action?: string;
  result: 'success' | 'failure' | 'partial';
  duration?: number; // milliseconds
  dataVolume?: number; // bytes
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
  confidence: number; // 0-100, confidence in baseline accuracy
  sampleSize: number; // number of activities in baseline
  version: string;
}

/**
 * Baseline types
 */
export enum BaselineType {
  ACTIVITY_FREQUENCY = 'ACTIVITY_FREQUENCY',
  ACCESS_PATTERNS = 'ACCESS_PATTERNS',
  TIME_PATTERNS = 'TIME_PATTERNS',
  LOCATION_PATTERNS = 'LOCATION_PATTERNS',
  DATA_VOLUME = 'DATA_VOLUME',
  PEER_GROUP = 'PEER_GROUP',
}

/**
 * Time window for baseline
 */
export interface TimeWindow {
  start: Date;
  end: Date;
  duration: number; // milliseconds
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
  confidence: number; // 0-100
  detectedAt: Date;
  activityId?: string;
  baseline?: string; // baseline ID
  deviation: AnomalyDeviation;
  context: AnomalyContext;
  status: AnomalyStatus;
  investigationNotes?: string;
}

/**
 * Anomaly types
 */
export enum AnomalyType {
  STATISTICAL = 'STATISTICAL',
  TEMPORAL = 'TEMPORAL',
  CONTEXTUAL = 'CONTEXTUAL',
  VOLUME = 'VOLUME',
  FREQUENCY = 'FREQUENCY',
  LOCATION = 'LOCATION',
  ACCESS_PATTERN = 'ACCESS_PATTERN',
  PRIVILEGE = 'PRIVILEGE',
  PEER_GROUP = 'PEER_GROUP',
}

/**
 * Anomaly deviation metrics
 */
export interface AnomalyDeviation {
  expectedValue?: number;
  actualValue?: number;
  deviationScore: number; // How many standard deviations
  deviationPercentage: number; // Percentage difference
  threshold: number; // Detection threshold
}

/**
 * Anomaly context
 */
export interface AnomalyContext {
  relatedActivities: string[]; // Activity IDs
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
export enum AnomalyStatus {
  NEW = 'NEW',
  INVESTIGATING = 'INVESTIGATING',
  CONFIRMED_THREAT = 'CONFIRMED_THREAT',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  RESOLVED = 'RESOLVED',
  SUPPRESSED = 'SUPPRESSED',
}

/**
 * Behavior risk score
 */
export interface BehaviorRiskScore {
  id: string;
  entityId: string;
  overallScore: number; // 0-100
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
  score: number; // 0-100
  weight: number; // 0-1, importance of this factor
  description: string;
  evidence: any[];
}

/**
 * Risk factor types
 */
export enum RiskFactorType {
  ANOMALY_FREQUENCY = 'ANOMALY_FREQUENCY',
  ANOMALY_SEVERITY = 'ANOMALY_SEVERITY',
  FAILED_AUTHENTICATIONS = 'FAILED_AUTHENTICATIONS',
  PRIVILEGE_CHANGES = 'PRIVILEGE_CHANGES',
  UNUSUAL_LOCATIONS = 'UNUSUAL_LOCATIONS',
  DATA_EXFILTRATION_INDICATORS = 'DATA_EXFILTRATION_INDICATORS',
  LATERAL_MOVEMENT = 'LATERAL_MOVEMENT',
  TIME_ANOMALIES = 'TIME_ANOMALIES',
  PEER_DEVIATION = 'PEER_DEVIATION',
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
export enum PatternType {
  THREAT = 'THREAT',
  NORMAL = 'NORMAL',
  SUSPICIOUS = 'SUSPICIOUS',
  COMPLIANCE_VIOLATION = 'COMPLIANCE_VIOLATION',
}

/**
 * Pattern signature
 */
export interface PatternSignature {
  activities: ActivityType[];
  timeWindow?: number; // milliseconds
  sequence?: boolean; // Must occur in order
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
  members: string[]; // Entity IDs
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
  priority: number; // 1-10
  title: string;
  description: string;
  detectedAt: Date;
  anomalies: string[]; // Anomaly IDs
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
export enum AlertType {
  INSIDER_THREAT = 'INSIDER_THREAT',
  COMPROMISED_CREDENTIALS = 'COMPROMISED_CREDENTIALS',
  PRIVILEGE_ABUSE = 'PRIVILEGE_ABUSE',
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',
  UNUSUAL_ACCESS = 'UNUSUAL_ACCESS',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  LATERAL_MOVEMENT = 'LATERAL_MOVEMENT',
  BRUTE_FORCE = 'BRUTE_FORCE',
}

/**
 * Alert status
 */
export enum AlertStatus {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  INVESTIGATING = 'INVESTIGATING',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const getBehaviorEntityModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  identifier: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  department: {
    type: 'STRING',
    allowNull: true,
  },
  role: {
    type: 'STRING',
    allowNull: true,
  },
  riskLevel: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'LOW',
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

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
export const getBehaviorActivityModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  entityId: {
    type: 'UUID',
    allowNull: false,
  },
  activityType: {
    type: 'STRING',
    allowNull: false,
  },
  timestamp: {
    type: 'DATE',
    allowNull: false,
  },
  details: {
    type: 'JSONB',
    allowNull: false,
  },
  location: {
    type: 'JSONB',
    allowNull: true,
  },
  device: {
    type: 'JSONB',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

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
export const getBehaviorBaselineModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  entityId: {
    type: 'UUID',
    allowNull: false,
  },
  baselineType: {
    type: 'STRING',
    allowNull: false,
  },
  timeWindow: {
    type: 'JSONB',
    allowNull: false,
  },
  metrics: {
    type: 'JSONB',
    allowNull: false,
  },
  lastUpdated: {
    type: 'DATE',
    allowNull: false,
  },
  confidence: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  sampleSize: {
    type: 'INTEGER',
    allowNull: false,
  },
  version: {
    type: 'STRING',
    allowNull: false,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

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
export const getBehaviorAnomalyModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  entityId: {
    type: 'UUID',
    allowNull: false,
  },
  anomalyType: {
    type: 'STRING',
    allowNull: false,
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  confidence: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  detectedAt: {
    type: 'DATE',
    allowNull: false,
  },
  activityId: {
    type: 'UUID',
    allowNull: true,
  },
  baseline: {
    type: 'UUID',
    allowNull: true,
  },
  deviation: {
    type: 'JSONB',
    allowNull: false,
  },
  context: {
    type: 'JSONB',
    allowNull: false,
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'NEW',
  },
  investigationNotes: {
    type: 'TEXT',
    allowNull: true,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

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
export const getBehaviorRiskScoreModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  entityId: {
    type: 'UUID',
    allowNull: false,
    unique: true,
  },
  overallScore: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  calculatedAt: {
    type: 'DATE',
    allowNull: false,
  },
  factors: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
  },
  historicalScores: {
    type: 'JSONB',
    defaultValue: [],
  },
  trendDirection: {
    type: 'STRING',
    allowNull: false,
  },
  recommendedActions: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

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
export const getBehaviorAlertModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  entityId: {
    type: 'UUID',
    allowNull: false,
  },
  alertType: {
    type: 'STRING',
    allowNull: false,
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  priority: {
    type: 'INTEGER',
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  },
  title: {
    type: 'STRING',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: false,
  },
  detectedAt: {
    type: 'DATE',
    allowNull: false,
  },
  anomalies: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  riskScore: {
    type: 'FLOAT',
    allowNull: true,
  },
  recommendations: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'NEW',
  },
  assignedTo: {
    type: 'STRING',
    allowNull: true,
  },
  acknowledgedAt: {
    type: 'DATE',
    allowNull: true,
  },
  resolvedAt: {
    type: 'DATE',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

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
export const getPeerGroupModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  name: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  criteria: {
    type: 'JSONB',
    allowNull: false,
  },
  members: {
    type: 'ARRAY("UUID")',
    defaultValue: [],
  },
  baselineMetrics: {
    type: 'JSONB',
    defaultValue: {},
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// USER AND ENTITY BEHAVIOR ANALYTICS (6 functions)
// ============================================================================

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
export const analyzeUserBehavior = async (
  entityId: string,
  activities: BehaviorActivity[],
  baseline: BehaviorBaseline
): Promise<{ anomalies: BehaviorAnomaly[]; riskScore: number }> => {
  const anomalies: BehaviorAnomaly[] = [];

  // Analyze activity frequency
  const activityCounts = new Map<ActivityType, number>();
  for (const activity of activities) {
    activityCounts.set(
      activity.activityType,
      (activityCounts.get(activity.activityType) || 0) + 1
    );
  }

  // Compare against baseline
  for (const [activityType, count] of activityCounts.entries()) {
    const expectedFrequency = baseline.metrics.distribution?.[activityType] || 0;
    const stdDev = baseline.metrics.stdDev || 1;

    const deviationScore = Math.abs(count - expectedFrequency) / stdDev;

    if (deviationScore > 3) {
      // 3 sigma threshold
      anomalies.push({
        id: crypto.randomUUID(),
        entityId,
        anomalyType: AnomalyType.FREQUENCY,
        severity: deviationScore > 5 ? RiskLevel.HIGH : RiskLevel.MEDIUM,
        confidence: Math.min(100, deviationScore * 15),
        detectedAt: new Date(),
        baseline: baseline.id,
        deviation: {
          expectedValue: expectedFrequency,
          actualValue: count,
          deviationScore,
          deviationPercentage: ((count - expectedFrequency) / expectedFrequency) * 100,
          threshold: 3,
        },
        context: {
          relatedActivities: activities.map((a) => a.id),
        },
        status: AnomalyStatus.NEW,
      });
    }
  }

  // Calculate risk score from anomalies
  const riskScore = calculateBehaviorRiskScore({
    id: crypto.randomUUID(),
    entityId,
    overallScore: 0,
    calculatedAt: new Date(),
    factors: [
      {
        factorType: RiskFactorType.ANOMALY_FREQUENCY,
        score: Math.min(100, anomalies.length * 20),
        weight: 0.4,
        description: `${anomalies.length} anomalies detected`,
        evidence: anomalies,
      },
    ],
    historicalScores: [],
    trendDirection: 'stable',
    recommendedActions: [],
  });

  return { anomalies, riskScore: riskScore.overallScore };
};

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
export const analyzeEntityBehavior = async (
  entityId: string,
  entityType: EntityType,
  activities: BehaviorActivity[]
): Promise<{ normalBehavior: boolean; anomalies: BehaviorAnomaly[] }> => {
  const anomalies: BehaviorAnomaly[] = [];

  // Analyze volume patterns
  const totalVolume = activities.reduce((sum, a) => sum + (a.details.dataVolume || 0), 0);
  const avgVolumePerActivity = totalVolume / activities.length;

  // Check for unusual volume (simplified threshold)
  const volumeThreshold = 10 * 1024 * 1024; // 10 MB
  if (avgVolumePerActivity > volumeThreshold) {
    anomalies.push({
      id: crypto.randomUUID(),
      entityId,
      anomalyType: AnomalyType.VOLUME,
      severity: RiskLevel.MEDIUM,
      confidence: 75,
      detectedAt: new Date(),
      deviation: {
        expectedValue: volumeThreshold / 2,
        actualValue: avgVolumePerActivity,
        deviationScore: avgVolumePerActivity / volumeThreshold,
        deviationPercentage: ((avgVolumePerActivity - volumeThreshold) / volumeThreshold) * 100,
        threshold: 1,
      },
      context: {
        relatedActivities: activities.map((a) => a.id),
      },
      status: AnomalyStatus.NEW,
    });
  }

  // Check for unusual locations
  const locations = new Set(
    activities.filter((a) => a.location).map((a) => a.location!.country)
  );
  if (locations.size > 3) {
    // Multiple countries in short time
    anomalies.push({
      id: crypto.randomUUID(),
      entityId,
      anomalyType: AnomalyType.LOCATION,
      severity: RiskLevel.HIGH,
      confidence: 80,
      detectedAt: new Date(),
      deviation: {
        expectedValue: 1,
        actualValue: locations.size,
        deviationScore: locations.size,
        deviationPercentage: (locations.size - 1) * 100,
        threshold: 3,
      },
      context: {
        relatedActivities: activities.map((a) => a.id),
        metadata: { locations: Array.from(locations) },
      },
      status: AnomalyStatus.NEW,
    });
  }

  return {
    normalBehavior: anomalies.length === 0,
    anomalies,
  };
};

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
export const trackBehaviorChanges = (
  entityId: string,
  historicalBaselines: BehaviorBaseline[],
  currentBaseline: BehaviorBaseline
): {
  changeDetected: boolean;
  changes: Array<{ metric: string; oldValue: number; newValue: number; changePercentage: number }>;
} => {
  const changes: Array<{
    metric: string;
    oldValue: number;
    newValue: number;
    changePercentage: number;
  }> = [];

  if (historicalBaselines.length === 0) {
    return { changeDetected: false, changes: [] };
  }

  const previousBaseline = historicalBaselines[historicalBaselines.length - 1];

  // Compare key metrics
  const metricsToCompare = ['mean', 'median', 'stdDev'] as const;

  for (const metric of metricsToCompare) {
    const oldValue = previousBaseline.metrics[metric];
    const newValue = currentBaseline.metrics[metric];

    if (oldValue !== undefined && newValue !== undefined && oldValue !== 0) {
      const changePercentage = ((newValue - oldValue) / oldValue) * 100;

      if (Math.abs(changePercentage) > 20) {
        // 20% threshold
        changes.push({
          metric,
          oldValue,
          newValue,
          changePercentage,
        });
      }
    }
  }

  return {
    changeDetected: changes.length > 0,
    changes,
  };
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
export const compareBehaviorProfiles = (
  baseline1: BehaviorBaseline,
  baseline2: BehaviorBaseline
): { similarity: number; differences: Array<{ metric: string; difference: number }> } => {
  const differences: Array<{ metric: string; difference: number }> = [];

  // Compare distributions
  const dist1 = baseline1.metrics.distribution || {};
  const dist2 = baseline2.metrics.distribution || {};

  const allKeys = new Set([...Object.keys(dist1), ...Object.keys(dist2)]);

  let totalDifference = 0;
  for (const key of allKeys) {
    const val1 = dist1[key] || 0;
    const val2 = dist2[key] || 0;
    const diff = Math.abs(val1 - val2);

    differences.push({
      metric: key,
      difference: diff,
    });

    totalDifference += diff;
  }

  const avgDifference = totalDifference / allKeys.size;
  const similarity = Math.max(0, 100 - avgDifference);

  return { similarity, differences };
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
export const calculateBehaviorScore = (riskScoreData: BehaviorRiskScore): BehaviorRiskScore => {
  let weightedScore = 0;
  let totalWeight = 0;

  for (const factor of riskScoreData.factors) {
    weightedScore += factor.score * factor.weight;
    totalWeight += factor.weight;
  }

  const overallScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

  // Determine trend
  let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (riskScoreData.historicalScores.length >= 2) {
    const recent = riskScoreData.historicalScores.slice(-5);
    const avgRecent = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;
    const older = riskScoreData.historicalScores.slice(-10, -5);
    const avgOlder = older.length > 0 ? older.reduce((sum, s) => sum + s.score, 0) / older.length : avgRecent;

    if (avgRecent > avgOlder * 1.1) {
      trendDirection = 'increasing';
    } else if (avgRecent < avgOlder * 0.9) {
      trendDirection = 'decreasing';
    }
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (overallScore > 70) {
    recommendations.push('Immediate investigation required');
    recommendations.push('Review recent activities');
    recommendations.push('Consider access restriction');
  } else if (overallScore > 50) {
    recommendations.push('Enhanced monitoring recommended');
    recommendations.push('Review user permissions');
  } else if (overallScore > 30) {
    recommendations.push('Continue standard monitoring');
  }

  return {
    ...riskScoreData,
    overallScore,
    trendDirection,
    recommendedActions: recommendations,
  };
};

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
export const identifyBehaviorAnomalies = (
  entityId: string,
  activities: BehaviorActivity[],
  baselines: BehaviorBaseline[]
): BehaviorAnomaly[] => {
  const anomalies: BehaviorAnomaly[] = [];

  // Statistical anomalies
  const statisticalAnomalies = detectStatisticalAnomalies(activities, baselines);
  anomalies.push(...statisticalAnomalies);

  // Temporal anomalies
  const temporalAnomalies = detectTemporalAnomalies(activities);
  anomalies.push(...temporalAnomalies);

  // Contextual anomalies
  const contextualAnomalies = detectContextualAnomalies(activities, baselines);
  anomalies.push(...contextualAnomalies);

  return anomalies;
};

// ============================================================================
// BASELINE BEHAVIOR PROFILING (5 functions)
// ============================================================================

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
export const createBehaviorBaseline = (
  entityId: string,
  activities: BehaviorActivity[],
  baselineType: BaselineType
): BehaviorBaseline => {
  const metrics = calculateBaselineMetrics(activities, baselineType);

  const timeWindow: TimeWindow = {
    start: activities[0]?.timestamp || new Date(),
    end: activities[activities.length - 1]?.timestamp || new Date(),
    duration: activities.length > 0
      ? activities[activities.length - 1].timestamp.getTime() - activities[0].timestamp.getTime()
      : 0,
  };

  return {
    id: crypto.randomUUID(),
    entityId,
    baselineType,
    timeWindow,
    metrics,
    lastUpdated: new Date(),
    confidence: Math.min(100, (activities.length / 100) * 100), // Higher confidence with more data
    sampleSize: activities.length,
    version: '1.0.0',
  };
};

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
export const updateBehaviorBaseline = (
  baseline: BehaviorBaseline,
  newActivities: BehaviorActivity[],
  options?: {
    adaptiveLearning?: boolean;
    learningRate?: number; // 0-1
  }
): BehaviorBaseline => {
  const learningRate = options?.learningRate || 0.1;
  const newMetrics = calculateBaselineMetrics(newActivities, baseline.baselineType);

  let updatedMetrics = { ...baseline.metrics };

  if (options?.adaptiveLearning) {
    // Exponential moving average
    if (baseline.metrics.mean !== undefined && newMetrics.mean !== undefined) {
      updatedMetrics.mean = baseline.metrics.mean * (1 - learningRate) + newMetrics.mean * learningRate;
    }
    if (baseline.metrics.median !== undefined && newMetrics.median !== undefined) {
      updatedMetrics.median = baseline.metrics.median * (1 - learningRate) + newMetrics.median * learningRate;
    }
    if (baseline.metrics.stdDev !== undefined && newMetrics.stdDev !== undefined) {
      updatedMetrics.stdDev = baseline.metrics.stdDev * (1 - learningRate) + newMetrics.stdDev * learningRate;
    }
  } else {
    updatedMetrics = newMetrics;
  }

  return {
    ...baseline,
    metrics: updatedMetrics,
    lastUpdated: new Date(),
    sampleSize: baseline.sampleSize + newActivities.length,
    confidence: Math.min(100, ((baseline.sampleSize + newActivities.length) / 100) * 100),
  };
};

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
export const calculateBaselineMetrics = (
  activities: BehaviorActivity[],
  baselineType: BaselineType
): BaselineMetrics => {
  const metrics: BaselineMetrics = {};

  switch (baselineType) {
    case BaselineType.ACTIVITY_FREQUENCY: {
      // Calculate frequency distribution
      const distribution: Record<string, number> = {};
      for (const activity of activities) {
        distribution[activity.activityType] = (distribution[activity.activityType] || 0) + 1;
      }

      const frequencies = Object.values(distribution);
      metrics.distribution = distribution;
      metrics.mean = frequencies.reduce((sum, f) => sum + f, 0) / frequencies.length || 0;
      metrics.stdDev = calculateStdDev(frequencies);
      metrics.min = Math.min(...frequencies);
      metrics.max = Math.max(...frequencies);
      break;
    }

    case BaselineType.DATA_VOLUME: {
      const volumes = activities.map((a) => a.details.dataVolume || 0);
      metrics.mean = volumes.reduce((sum, v) => sum + v, 0) / volumes.length || 0;
      metrics.median = calculateMedian(volumes);
      metrics.stdDev = calculateStdDev(volumes);
      metrics.min = Math.min(...volumes);
      metrics.max = Math.max(...volumes);
      metrics.percentiles = calculatePercentiles(volumes);
      break;
    }

    case BaselineType.TIME_PATTERNS: {
      // Analyze time-of-day patterns
      const hourCounts: Record<number, number> = {};
      for (const activity of activities) {
        const hour = activity.timestamp.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }

      metrics.distribution = hourCounts;
      break;
    }

    case BaselineType.LOCATION_PATTERNS: {
      // Analyze location patterns
      const locationCounts: Record<string, number> = {};
      for (const activity of activities) {
        if (activity.location) {
          const loc = activity.location.country;
          locationCounts[loc] = (locationCounts[loc] || 0) + 1;
        }
      }

      metrics.distribution = locationCounts;
      break;
    }

    default:
      // Generic metrics
      metrics.distribution = {};
  }

  return metrics;
};

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
export const detectBaselineDeviation = (
  activities: BehaviorActivity[],
  baseline: BehaviorBaseline
): { hasDeviation: boolean; deviationScore: number; details: any } => {
  const currentMetrics = calculateBaselineMetrics(activities, baseline.baselineType);

  let deviationScore = 0;
  const details: any = {};

  // Compare means
  if (baseline.metrics.mean !== undefined && currentMetrics.mean !== undefined) {
    const stdDev = baseline.metrics.stdDev || 1;
    const meanDeviation = Math.abs(currentMetrics.mean - baseline.metrics.mean) / stdDev;
    deviationScore = Math.max(deviationScore, meanDeviation);
    details.meanDeviation = meanDeviation;
  }

  // Compare distributions
  if (baseline.metrics.distribution && currentMetrics.distribution) {
    const dist1 = baseline.metrics.distribution;
    const dist2 = currentMetrics.distribution;

    const allKeys = new Set([...Object.keys(dist1), ...Object.keys(dist2)]);
    let distributionDifference = 0;

    for (const key of allKeys) {
      const val1 = dist1[key] || 0;
      const val2 = dist2[key] || 0;
      distributionDifference += Math.abs(val1 - val2);
    }

    const avgDifference = distributionDifference / allKeys.size;
    details.distributionDifference = avgDifference;
    deviationScore = Math.max(deviationScore, avgDifference / 10); // Normalize
  }

  return {
    hasDeviation: deviationScore > 2, // 2 sigma threshold
    deviationScore,
    details,
  };
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
export const adaptiveBaselineLearning = (
  baseline: BehaviorBaseline,
  activities: BehaviorActivity[],
  options: {
    learningRate: number; // 0-1
    decayFactor?: number; // 0-1, decay old data
  }
): BehaviorBaseline => {
  const adapted = updateBehaviorBaseline(baseline, activities, {
    adaptiveLearning: true,
    learningRate: options.learningRate,
  });

  // Apply decay to old patterns if specified
  if (options.decayFactor && adapted.metrics.distribution) {
    const decayed: Record<string, number> = {};
    for (const [key, value] of Object.entries(adapted.metrics.distribution)) {
      decayed[key] = value * options.decayFactor;
    }
    adapted.metrics.distribution = decayed;
  }

  return adapted;
};

// ============================================================================
// ANOMALY DETECTION (6 functions)
// ============================================================================

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
export const detectStatisticalAnomalies = (
  activities: BehaviorActivity[],
  baselines: BehaviorBaseline[]
): BehaviorAnomaly[] => {
  const anomalies: BehaviorAnomaly[] = [];

  // Analyze data volume
  const volumes = activities.map((a) => a.details.dataVolume || 0);
  const volumeBaseline = baselines.find((b) => b.baselineType === BaselineType.DATA_VOLUME);

  if (volumeBaseline && volumes.length > 0) {
    const mean = volumeBaseline.metrics.mean || 0;
    const stdDev = volumeBaseline.metrics.stdDev || 1;

    for (const activity of activities) {
      const volume = activity.details.dataVolume || 0;
      const deviationScore = Math.abs(volume - mean) / stdDev;

      if (deviationScore > 3) {
        anomalies.push({
          id: crypto.randomUUID(),
          entityId: activity.entityId,
          anomalyType: AnomalyType.STATISTICAL,
          severity: deviationScore > 5 ? RiskLevel.HIGH : RiskLevel.MEDIUM,
          confidence: Math.min(100, deviationScore * 15),
          detectedAt: new Date(),
          activityId: activity.id,
          baseline: volumeBaseline.id,
          deviation: {
            expectedValue: mean,
            actualValue: volume,
            deviationScore,
            deviationPercentage: ((volume - mean) / mean) * 100,
            threshold: 3,
          },
          context: {
            relatedActivities: [activity.id],
          },
          status: AnomalyStatus.NEW,
        });
      }
    }
  }

  return anomalies;
};

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
export const detectTemporalAnomalies = (activities: BehaviorActivity[]): BehaviorAnomaly[] => {
  const anomalies: BehaviorAnomaly[] = [];

  // Detect after-hours activity
  for (const activity of activities) {
    const hour = activity.timestamp.getHours();

    // Consider 11 PM to 5 AM as after hours
    if (hour >= 23 || hour <= 5) {
      anomalies.push({
        id: crypto.randomUUID(),
        entityId: activity.entityId,
        anomalyType: AnomalyType.TEMPORAL,
        severity: RiskLevel.MEDIUM,
        confidence: 70,
        detectedAt: new Date(),
        activityId: activity.id,
        deviation: {
          deviationScore: 1,
          deviationPercentage: 100,
          threshold: 1,
        },
        context: {
          relatedActivities: [activity.id],
          timeOfDay: `${hour}:00`,
        },
        status: AnomalyStatus.NEW,
      });
    }
  }

  // Detect rapid succession of activities (potential automation/compromise)
  if (activities.length >= 2) {
    for (let i = 1; i < activities.length; i++) {
      const timeDiff = activities[i].timestamp.getTime() - activities[i - 1].timestamp.getTime();

      if (timeDiff < 1000) {
        // Less than 1 second between activities
        anomalies.push({
          id: crypto.randomUUID(),
          entityId: activities[i].entityId,
          anomalyType: AnomalyType.FREQUENCY,
          severity: RiskLevel.HIGH,
          confidence: 85,
          detectedAt: new Date(),
          activityId: activities[i].id,
          deviation: {
            expectedValue: 10000, // Expected 10 seconds
            actualValue: timeDiff,
            deviationScore: (10000 - timeDiff) / 1000,
            deviationPercentage: ((10000 - timeDiff) / 10000) * 100,
            threshold: 1,
          },
          context: {
            relatedActivities: [activities[i - 1].id, activities[i].id],
            metadata: { timeDiffMs: timeDiff },
          },
          status: AnomalyStatus.NEW,
        });
      }
    }
  }

  return anomalies;
};

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
export const detectContextualAnomalies = (
  activities: BehaviorActivity[],
  baselines: BehaviorBaseline[]
): BehaviorAnomaly[] => {
  const anomalies: BehaviorAnomaly[] = [];

  const locationBaseline = baselines.find((b) => b.baselineType === BaselineType.LOCATION_PATTERNS);

  for (const activity of activities) {
    if (activity.location && locationBaseline) {
      const country = activity.location.country;
      const knownLocations = locationBaseline.metrics.distribution || {};

      if (!knownLocations[country]) {
        anomalies.push({
          id: crypto.randomUUID(),
          entityId: activity.entityId,
          anomalyType: AnomalyType.CONTEXTUAL,
          severity: RiskLevel.HIGH,
          confidence: 80,
          detectedAt: new Date(),
          activityId: activity.id,
          baseline: locationBaseline.id,
          deviation: {
            deviationScore: 1,
            deviationPercentage: 100,
            threshold: 1,
          },
          context: {
            relatedActivities: [activity.id],
            location: activity.location,
            metadata: { knownLocations: Object.keys(knownLocations) },
          },
          status: AnomalyStatus.NEW,
        });
      }
    }

    // Detect privilege escalation during unusual activity
    if (activity.activityType === ActivityType.PRIVILEGE_ESCALATION) {
      anomalies.push({
        id: crypto.randomUUID(),
        entityId: activity.entityId,
        anomalyType: AnomalyType.PRIVILEGE,
        severity: RiskLevel.CRITICAL,
        confidence: 90,
        detectedAt: new Date(),
        activityId: activity.id,
        deviation: {
          deviationScore: 5,
          deviationPercentage: 500,
          threshold: 1,
        },
        context: {
          relatedActivities: [activity.id],
          metadata: { activity: activity.activityType },
        },
        status: AnomalyStatus.NEW,
      });
    }
  }

  return anomalies;
};

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
export const scoreAnomalySeverity = (
  anomaly: BehaviorAnomaly,
  entityRiskScore?: BehaviorRiskScore
): BehaviorAnomaly => {
  let severityScore = anomaly.deviation.deviationScore * 10;

  // Adjust based on anomaly type
  const typeWeights: Record<AnomalyType, number> = {
    [AnomalyType.STATISTICAL]: 1.0,
    [AnomalyType.TEMPORAL]: 1.2,
    [AnomalyType.CONTEXTUAL]: 1.5,
    [AnomalyType.VOLUME]: 1.3,
    [AnomalyType.FREQUENCY]: 1.1,
    [AnomalyType.LOCATION]: 1.6,
    [AnomalyType.ACCESS_PATTERN]: 1.4,
    [AnomalyType.PRIVILEGE]: 2.0,
    [AnomalyType.PEER_GROUP]: 1.2,
  };

  severityScore *= typeWeights[anomaly.anomalyType] || 1.0;

  // Adjust based on entity risk
  if (entityRiskScore) {
    severityScore *= 1 + entityRiskScore.overallScore / 200;
  }

  // Determine severity level
  let severity: RiskLevel;
  if (severityScore >= 80) {
    severity = RiskLevel.CRITICAL;
  } else if (severityScore >= 60) {
    severity = RiskLevel.HIGH;
  } else if (severityScore >= 40) {
    severity = RiskLevel.MEDIUM;
  } else if (severityScore >= 20) {
    severity = RiskLevel.LOW;
  } else {
    severity = RiskLevel.MINIMAL;
  }

  return {
    ...anomaly,
    severity,
    confidence: Math.min(100, anomaly.confidence * (severityScore / 50)),
  };
};

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
export const classifyAnomalyType = (
  anomalies: BehaviorAnomaly[]
): Record<string, BehaviorAnomaly[]> => {
  const classified: Record<string, BehaviorAnomaly[]> = {
    critical: [],
    location: [],
    privilege: [],
    volume: [],
    temporal: [],
    other: [],
  };

  for (const anomaly of anomalies) {
    if (anomaly.severity === RiskLevel.CRITICAL) {
      classified.critical.push(anomaly);
    }

    switch (anomaly.anomalyType) {
      case AnomalyType.LOCATION:
        classified.location.push(anomaly);
        break;
      case AnomalyType.PRIVILEGE:
        classified.privilege.push(anomaly);
        break;
      case AnomalyType.VOLUME:
        classified.volume.push(anomaly);
        break;
      case AnomalyType.TEMPORAL:
        classified.temporal.push(anomaly);
        break;
      default:
        classified.other.push(anomaly);
    }
  }

  return classified;
};

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
export const correlateBehaviorAnomalies = (
  anomalies: BehaviorAnomaly[],
  timeWindowMs: number = 3600000
): Array<{ cluster: BehaviorAnomaly[]; correlationScore: number }> => {
  const clusters: Array<{ cluster: BehaviorAnomaly[]; correlationScore: number }> = [];
  const processed = new Set<string>();

  for (const anomaly of anomalies) {
    if (processed.has(anomaly.id)) continue;

    const cluster: BehaviorAnomaly[] = [anomaly];
    processed.add(anomaly.id);

    // Find related anomalies
    for (const candidate of anomalies) {
      if (processed.has(candidate.id)) continue;

      const timeDiff = Math.abs(
        candidate.detectedAt.getTime() - anomaly.detectedAt.getTime()
      );

      if (
        candidate.entityId === anomaly.entityId &&
        timeDiff <= timeWindowMs
      ) {
        cluster.push(candidate);
        processed.add(candidate.id);
      }
    }

    if (cluster.length > 1) {
      const correlationScore = Math.min(100, cluster.length * 25);
      clusters.push({ cluster, correlationScore });
    }
  }

  return clusters.sort((a, b) => b.correlationScore - a.correlationScore);
};

// ============================================================================
// RISK SCORING BASED ON BEHAVIOR (5 functions)
// ============================================================================

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
export const calculateBehaviorRiskScore = (riskData: BehaviorRiskScore): BehaviorRiskScore => {
  return calculateBehaviorScore(riskData);
};

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
export const aggregateRiskFactors = (
  factors: RiskFactor[]
): { score: number; topFactors: RiskFactor[] } => {
  let weightedScore = 0;
  let totalWeight = 0;

  for (const factor of factors) {
    weightedScore += factor.score * factor.weight;
    totalWeight += factor.weight;
  }

  const score = totalWeight > 0 ? weightedScore / totalWeight : 0;

  const topFactors = [...factors]
    .sort((a, b) => b.score * b.weight - a.score * a.weight)
    .slice(0, 5);

  return { score, topFactors };
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
export const adjustRiskByContext = (
  baseScore: number,
  context: {
    department?: string;
    role?: string;
    timeOfDay?: 'business_hours' | 'after_hours';
    location?: 'known' | 'unknown';
    deviceManaged?: boolean;
  }
): number => {
  let adjustedScore = baseScore;

  // Reduce risk for privileged users during business hours on managed devices
  if (
    context.role === 'admin' &&
    context.timeOfDay === 'business_hours' &&
    context.deviceManaged
  ) {
    adjustedScore *= 0.8;
  }

  // Increase risk for after-hours activity
  if (context.timeOfDay === 'after_hours') {
    adjustedScore *= 1.3;
  }

  // Increase risk for unknown locations
  if (context.location === 'unknown') {
    adjustedScore *= 1.5;
  }

  // Increase risk for unmanaged devices
  if (context.deviceManaged === false) {
    adjustedScore *= 1.4;
  }

  return Math.min(100, adjustedScore);
};

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
export const trackRiskTrends = (
  riskScore: BehaviorRiskScore,
  windowDays: number = 30
): { trend: 'increasing' | 'decreasing' | 'stable'; changeRate: number; prediction: number } => {
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - windowMs);

  const recentScores = riskScore.historicalScores.filter(
    (s) => s.timestamp >= cutoff
  );

  if (recentScores.length < 2) {
    return {
      trend: 'stable',
      changeRate: 0,
      prediction: riskScore.overallScore,
    };
  }

  // Calculate linear regression
  const n = recentScores.length;
  const xValues = recentScores.map((_, i) => i);
  const yValues = recentScores.map((s) => s.score);

  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const prediction = slope * n + intercept;

  let trend: 'increasing' | 'decreasing' | 'stable';
  if (Math.abs(slope) < 0.5) {
    trend = 'stable';
  } else if (slope > 0) {
    trend = 'increasing';
  } else {
    trend = 'decreasing';
  }

  return {
    trend,
    changeRate: slope,
    prediction: Math.max(0, Math.min(100, prediction)),
  };
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
export const prioritizeHighRiskBehaviors = (
  scores: BehaviorRiskScore[],
  options?: {
    minScore?: number;
    includeTrend?: boolean;
    limit?: number;
  }
): Array<{ entityId: string; score: number; priority: number }> => {
  const minScore = options?.minScore || 0;
  const limit = options?.limit || 100;

  const prioritized = scores
    .filter((s) => s.overallScore >= minScore)
    .map((s) => {
      let priority = s.overallScore;

      // Boost priority for increasing trends
      if (options?.includeTrend && s.trendDirection === 'increasing') {
        priority *= 1.2;
      }

      return {
        entityId: s.entityId,
        score: s.overallScore,
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);

  return prioritized;
};

// ============================================================================
// BEHAVIOR PATTERN RECOGNITION (5 functions)
// ============================================================================

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
export const identifyBehaviorPatterns = (
  activities: BehaviorActivity[],
  options?: {
    minFrequency?: number;
    sequenceLength?: number;
  }
): Array<{ pattern: string; frequency: number; activities: BehaviorActivity[] }> => {
  const minFrequency = options?.minFrequency || 2;
  const sequenceLength = options?.sequenceLength || 3;

  const patterns = new Map<string, BehaviorActivity[]>();

  // Extract sequences
  for (let i = 0; i <= activities.length - sequenceLength; i++) {
    const sequence = activities.slice(i, i + sequenceLength);
    const pattern = sequence.map((a) => a.activityType).join(' -> ');

    if (!patterns.has(pattern)) {
      patterns.set(pattern, []);
    }
    patterns.get(pattern)!.push(...sequence);
  }

  const result: Array<{ pattern: string; frequency: number; activities: BehaviorActivity[] }> =
    [];

  for (const [pattern, acts] of patterns.entries()) {
    const frequency = acts.length / sequenceLength;
    if (frequency >= minFrequency) {
      result.push({ pattern, frequency, activities: acts });
    }
  }

  return result.sort((a, b) => b.frequency - a.frequency);
};

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
export const matchKnownThreatPatterns = (
  activities: BehaviorActivity[],
  knownPatterns: BehaviorPattern[]
): Array<{
  pattern: BehaviorPattern;
  matchScore: number;
  matchedActivities: BehaviorActivity[];
}> => {
  const matches: Array<{
    pattern: BehaviorPattern;
    matchScore: number;
    matchedActivities: BehaviorActivity[];
  }> = [];

  for (const pattern of knownPatterns) {
    let matchScore = 0;
    const matchedActivities: BehaviorActivity[] = [];

    // Check if required activities are present
    const requiredActivities = pattern.signature.activities;
    const activityTypes = activities.map((a) => a.activityType);

    const hasAllRequired = requiredActivities.every((required) =>
      activityTypes.includes(required)
    );

    if (!hasAllRequired) continue;

    matchScore += 40;

    // Check sequence if required
    if (pattern.signature.sequence) {
      let lastIndex = -1;
      let inSequence = true;

      for (const required of requiredActivities) {
        const index = activityTypes.indexOf(required, lastIndex + 1);
        if (index === -1 || index <= lastIndex) {
          inSequence = false;
          break;
        }
        lastIndex = index;
        matchedActivities.push(activities[index]);
      }

      if (inSequence) {
        matchScore += 40;
      }
    } else {
      // Just presence is enough
      for (const required of requiredActivities) {
        const activity = activities.find((a) => a.activityType === required);
        if (activity) {
          matchedActivities.push(activity);
        }
      }
      matchScore += 20;
    }

    // Check additional conditions
    if (pattern.signature.conditions) {
      let conditionsMet = 0;
      for (const condition of pattern.signature.conditions) {
        // Simplified condition checking
        conditionsMet++;
      }
      matchScore += (conditionsMet / pattern.signature.conditions.length) * 20;
    }

    if (matchScore > 50) {
      matches.push({
        pattern,
        matchScore,
        matchedActivities,
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

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
export const clusterSimilarBehaviors = (
  activities: BehaviorActivity[],
  similarityThreshold: number = 0.7
): Array<{ clusterId: string; activities: BehaviorActivity[]; centroid: any }> => {
  const clusters: Array<{ clusterId: string; activities: BehaviorActivity[]; centroid: any }> =
    [];

  const processed = new Set<string>();

  for (const activity of activities) {
    if (processed.has(activity.id)) continue;

    const cluster: BehaviorActivity[] = [activity];
    processed.add(activity.id);

    // Find similar activities
    for (const candidate of activities) {
      if (processed.has(candidate.id)) continue;

      const similarity = calculateActivitySimilarity(activity, candidate);
      if (similarity >= similarityThreshold) {
        cluster.push(candidate);
        processed.add(candidate.id);
      }
    }

    clusters.push({
      clusterId: crypto.randomUUID(),
      activities: cluster,
      centroid: calculateClusterCentroid(cluster),
    });
  }

  return clusters.sort((a, b) => b.activities.length - a.activities.length);
};

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
export const extractBehaviorSignatures = (
  activities: BehaviorActivity[]
): Array<{ signature: string; frequency: number; metadata: any }> => {
  const signatures = new Map<string, { count: number; metadata: any }>();

  for (const activity of activities) {
    // Create signature from key attributes
    const sig = `${activity.activityType}:${activity.details.action || 'unknown'}`;

    if (!signatures.has(sig)) {
      signatures.set(sig, {
        count: 0,
        metadata: {
          activityType: activity.activityType,
          action: activity.details.action,
        },
      });
    }

    signatures.get(sig)!.count++;
  }

  return Array.from(signatures.entries())
    .map(([signature, data]) => ({
      signature,
      frequency: data.count,
      metadata: data.metadata,
    }))
    .sort((a, b) => b.frequency - a.frequency);
};

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
export const detectRecurringPatterns = (
  activities: BehaviorActivity[],
  windowMs: number = 86400000
): Array<{ pattern: string; occurrences: number; interval: number }> => {
  const patternOccurrences = new Map<string, Date[]>();

  for (const activity of activities) {
    const pattern = activity.activityType;

    if (!patternOccurrences.has(pattern)) {
      patternOccurrences.set(pattern, []);
    }
    patternOccurrences.get(pattern)!.push(activity.timestamp);
  }

  const recurring: Array<{ pattern: string; occurrences: number; interval: number }> = [];

  for (const [pattern, timestamps] of patternOccurrences.entries()) {
    if (timestamps.length < 3) continue; // Need at least 3 occurrences

    // Sort timestamps
    timestamps.sort((a, b) => a.getTime() - b.getTime());

    // Calculate intervals
    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i].getTime() - timestamps[i - 1].getTime());
    }

    // Check if intervals are consistent
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const stdDev = calculateStdDev(intervals);

    // If low variance, it's recurring
    if (stdDev < avgInterval * 0.2) {
      recurring.push({
        pattern,
        occurrences: timestamps.length,
        interval: avgInterval,
      });
    }
  }

  return recurring.sort((a, b) => b.occurrences - a.occurrences);
};

// ============================================================================
// TEMPORAL BEHAVIOR ANALYSIS (4 functions)
// ============================================================================

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
export const analyzeTimeBasedPatterns = (
  activities: BehaviorActivity[]
): {
  hourlyDistribution: Record<number, number>;
  weekdayDistribution: Record<number, number>;
  peakHours: number[];
} => {
  const hourlyDistribution: Record<number, number> = {};
  const weekdayDistribution: Record<number, number> = {};

  for (const activity of activities) {
    const hour = activity.timestamp.getHours();
    const weekday = activity.timestamp.getDay();

    hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
    weekdayDistribution[weekday] = (weekdayDistribution[weekday] || 0) + 1;
  }

  // Identify peak hours (top 3)
  const peakHours = Object.entries(hourlyDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  return {
    hourlyDistribution,
    weekdayDistribution,
    peakHours,
  };
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
export const detectUnusualTimings = (
  activities: BehaviorActivity[],
  timeBaseline: BehaviorBaseline
): BehaviorActivity[] => {
  const unusual: BehaviorActivity[] = [];

  const normalHours = timeBaseline.metrics.distribution || {};

  for (const activity of activities) {
    const hour = activity.timestamp.getHours();
    const expectedCount = normalHours[hour] || 0;

    // If this hour has very low expected activity, flag it
    if (expectedCount < 2) {
      unusual.push(activity);
    }
  }

  return unusual;
};

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
export const trackBehaviorFrequency = (
  activities: BehaviorActivity[],
  interval: 'hourly' | 'daily' | 'weekly' = 'hourly'
): Array<{ timestamp: string; count: number }> => {
  const buckets = new Map<string, number>();

  for (const activity of activities) {
    const bucket = formatTimestamp(activity.timestamp, interval);
    buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
  }

  return Array.from(buckets.entries())
    .map(([timestamp, count]) => ({ timestamp, count }))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

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
export const analyzeActivityWindows = (
  activities: BehaviorActivity[]
): { businessHours: number; afterHours: number; weekends: number; averageDuration: number } => {
  let businessHours = 0;
  let afterHours = 0;
  let weekends = 0;
  let totalDuration = 0;
  let durationCount = 0;

  for (const activity of activities) {
    const hour = activity.timestamp.getHours();
    const day = activity.timestamp.getDay();

    if (day === 0 || day === 6) {
      weekends++;
    } else if (hour >= 9 && hour < 17) {
      businessHours++;
    } else {
      afterHours++;
    }

    if (activity.details.duration) {
      totalDuration += activity.details.duration;
      durationCount++;
    }
  }

  return {
    businessHours,
    afterHours,
    weekends,
    averageDuration: durationCount > 0 ? totalDuration / durationCount : 0,
  };
};

// ============================================================================
// PEER GROUP ANALYSIS (5 functions)
// ============================================================================

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
export const createPeerGroups = (
  entities: BehaviorEntity[],
  criteria: PeerGroupCriteria
): PeerGroup => {
  const members = entities.filter((entity) => {
    if (criteria.department && !criteria.department.includes(entity.department || '')) {
      return false;
    }

    if (criteria.role && !criteria.role.includes(entity.role || '')) {
      return false;
    }

    return true;
  });

  return {
    id: crypto.randomUUID(),
    name: `Peer Group - ${criteria.department?.join(', ') || 'Custom'}`,
    description: `Peer group for ${criteria.role?.join(', ') || 'entities'}`,
    criteria,
    members: members.map((m) => m.id),
    baselineMetrics: {},
    updatedAt: new Date(),
  };
};

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
export const compareToPeerBehavior = (
  entity: BehaviorEntity,
  peerGroup: PeerGroup,
  entityBaseline: BehaviorBaseline
): { deviation: number; percentile: number; isOutlier: boolean } => {
  const peerMean = peerGroup.baselineMetrics.mean || 0;
  const peerStdDev = peerGroup.baselineMetrics.stdDev || 1;
  const entityMean = entityBaseline.metrics.mean || 0;

  const deviation = (entityMean - peerMean) / peerStdDev;

  // Calculate percentile (simplified)
  const percentile = 50 + deviation * 15; // Approximation

  const isOutlier = Math.abs(deviation) > 2; // 2 sigma threshold

  return {
    deviation,
    percentile: Math.max(0, Math.min(100, percentile)),
    isOutlier,
  };
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
export const detectPeerAnomalies = (
  entity: BehaviorEntity,
  peerGroup: PeerGroup,
  entityActivities: BehaviorActivity[]
): BehaviorAnomaly[] => {
  const anomalies: BehaviorAnomaly[] = [];

  const entityMetrics = calculateBaselineMetrics(
    entityActivities,
    BaselineType.ACTIVITY_FREQUENCY
  );

  const peerMean = peerGroup.baselineMetrics.mean || 0;
  const peerStdDev = peerGroup.baselineMetrics.stdDev || 1;
  const entityMean = entityMetrics.mean || 0;

  const deviation = Math.abs(entityMean - peerMean) / peerStdDev;

  if (deviation > 2) {
    anomalies.push({
      id: crypto.randomUUID(),
      entityId: entity.id,
      anomalyType: AnomalyType.PEER_GROUP,
      severity: deviation > 3 ? RiskLevel.HIGH : RiskLevel.MEDIUM,
      confidence: Math.min(100, deviation * 20),
      detectedAt: new Date(),
      deviation: {
        expectedValue: peerMean,
        actualValue: entityMean,
        deviationScore: deviation,
        deviationPercentage: ((entityMean - peerMean) / peerMean) * 100,
        threshold: 2,
      },
      context: {
        relatedActivities: entityActivities.map((a) => a.id),
        peerComparison: {
          peerAverage: peerMean,
          entityValue: entityMean,
          percentile: 50 + deviation * 15,
        },
      },
      status: AnomalyStatus.NEW,
    });
  }

  return anomalies;
};

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
export const calculatePeerDeviation = (entityValue: number, peerGroup: PeerGroup): number => {
  const peerMean = peerGroup.baselineMetrics.mean || 0;
  const peerStdDev = peerGroup.baselineMetrics.stdDev || 1;

  return (entityValue - peerMean) / peerStdDev;
};

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
export const identifyOutliers = (
  entities: BehaviorEntity[],
  baselines: BehaviorBaseline[],
  threshold: number = 2
): Array<{ entity: BehaviorEntity; deviationScore: number }> => {
  const outliers: Array<{ entity: BehaviorEntity; deviationScore: number }> = [];

  // Calculate peer group statistics
  const baselineMap = new Map(baselines.map((b) => [b.entityId, b]));
  const values = baselines.map((b) => b.metrics.mean || 0);

  if (values.length === 0) return outliers;

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = calculateStdDev(values);

  for (const entity of entities) {
    const baseline = baselineMap.get(entity.id);
    if (!baseline) continue;

    const entityValue = baseline.metrics.mean || 0;
    const deviation = Math.abs(entityValue - mean) / stdDev;

    if (deviation > threshold) {
      outliers.push({
        entity,
        deviationScore: deviation,
      });
    }
  }

  return outliers.sort((a, b) => b.deviationScore - a.deviationScore);
};

// ============================================================================
// BEHAVIORAL ALERTING (4 functions)
// ============================================================================

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
export const generateBehaviorAlert = (
  anomalies: BehaviorAnomaly[],
  entity: BehaviorEntity,
  riskScore?: BehaviorRiskScore
): BehaviorAlert[] => {
  const alerts: BehaviorAlert[] = [];

  // Group anomalies by type
  const grouped = new Map<AnomalyType, BehaviorAnomaly[]>();
  for (const anomaly of anomalies) {
    if (!grouped.has(anomaly.anomalyType)) {
      grouped.set(anomaly.anomalyType, []);
    }
    grouped.get(anomaly.anomalyType)!.push(anomaly);
  }

  for (const [type, typeAnomalies] of grouped.entries()) {
    const severity = calculateAlertSeverity(typeAnomalies);
    const alertType = mapAnomalyToAlertType(type);

    alerts.push({
      id: crypto.randomUUID(),
      entityId: entity.id,
      alertType,
      severity,
      priority: calculateAlertPriority(severity, typeAnomalies.length),
      title: `${alertType} detected for ${entity.identifier}`,
      description: `${typeAnomalies.length} ${type} anomalies detected`,
      detectedAt: new Date(),
      anomalies: typeAnomalies.map((a) => a.id),
      riskScore: riskScore?.overallScore,
      recommendations: generateAlertRecommendations(alertType, severity),
      status: AlertStatus.NEW,
      metadata: {
        entityType: entity.type,
        anomalyCount: typeAnomalies.length,
      },
    });
  }

  return alerts;
};

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
export const prioritizeAlertsBySeverity = (alerts: BehaviorAlert[]): BehaviorAlert[] => {
  return [...alerts].sort((a, b) => {
    // First by severity
    const severityOrder = {
      [RiskLevel.CRITICAL]: 5,
      [RiskLevel.HIGH]: 4,
      [RiskLevel.MEDIUM]: 3,
      [RiskLevel.LOW]: 2,
      [RiskLevel.MINIMAL]: 1,
    };

    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;

    // Then by priority
    return b.priority - a.priority;
  });
};

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
export const correlateBehaviorAlerts = (
  alerts: BehaviorAlert[],
  timeWindowMs: number = 3600000
): Array<{ primary: BehaviorAlert; related: BehaviorAlert[] }> => {
  const correlated: Array<{ primary: BehaviorAlert; related: BehaviorAlert[] }> = [];
  const processed = new Set<string>();

  for (const alert of alerts) {
    if (processed.has(alert.id)) continue;

    const related: BehaviorAlert[] = [];
    processed.add(alert.id);

    for (const candidate of alerts) {
      if (processed.has(candidate.id)) continue;

      const timeDiff = Math.abs(
        candidate.detectedAt.getTime() - alert.detectedAt.getTime()
      );

      if (candidate.entityId === alert.entityId && timeDiff <= timeWindowMs) {
        related.push(candidate);
        processed.add(candidate.id);
      }
    }

    if (related.length > 0 || alert.severity === RiskLevel.CRITICAL) {
      correlated.push({ primary: alert, related });
    }
  }

  return correlated;
};

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
export const createAlertRecommendations = (
  alert: BehaviorAlert,
  entity: BehaviorEntity
): string[] => {
  return generateAlertRecommendations(alert.alertType, alert.severity);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates standard deviation.
 */
const calculateStdDev = (values: number[]): number => {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

  return Math.sqrt(variance);
};

/**
 * Calculates median value.
 */
const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

/**
 * Calculates percentiles.
 */
const calculatePercentiles = (
  values: number[]
): {
  p25?: number;
  p50?: number;
  p75?: number;
  p90?: number;
  p95?: number;
  p99?: number;
} => {
  if (values.length === 0) return {};

  const sorted = [...values].sort((a, b) => a - b);

  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  };

  return {
    p25: getPercentile(25),
    p50: getPercentile(50),
    p75: getPercentile(75),
    p90: getPercentile(90),
    p95: getPercentile(95),
    p99: getPercentile(99),
  };
};

/**
 * Calculates similarity between two activities.
 */
const calculateActivitySimilarity = (
  activity1: BehaviorActivity,
  activity2: BehaviorActivity
): number => {
  let similarity = 0;

  if (activity1.activityType === activity2.activityType) similarity += 0.4;
  if (activity1.details.action === activity2.details.action) similarity += 0.3;

  const timeDiff = Math.abs(
    activity1.timestamp.getTime() - activity2.timestamp.getTime()
  );
  if (timeDiff < 3600000) similarity += 0.3; // Within 1 hour

  return similarity;
};

/**
 * Calculates cluster centroid.
 */
const calculateClusterCentroid = (activities: BehaviorActivity[]): any => {
  const activityTypes = new Map<ActivityType, number>();

  for (const activity of activities) {
    activityTypes.set(
      activity.activityType,
      (activityTypes.get(activity.activityType) || 0) + 1
    );
  }

  return {
    dominantType: Array.from(activityTypes.entries()).sort((a, b) => b[1] - a[1])[0]?.[0],
    size: activities.length,
  };
};

/**
 * Formats timestamp by interval.
 */
const formatTimestamp = (
  date: Date,
  interval: 'hourly' | 'daily' | 'weekly'
): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');

  switch (interval) {
    case 'hourly':
      return `${year}-${month}-${day}T${hour}:00`;
    case 'daily':
      return `${year}-${month}-${day}`;
    case 'weekly':
      const weekNum = getWeekNumber(date);
      return `${year}-W${weekNum}`;
    default:
      return date.toISOString();
  }
};

/**
 * Gets ISO week number.
 */
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

/**
 * Calculates alert severity from anomalies.
 */
const calculateAlertSeverity = (anomalies: BehaviorAnomaly[]): RiskLevel => {
  const severities = anomalies.map((a) => a.severity);

  if (severities.includes(RiskLevel.CRITICAL)) return RiskLevel.CRITICAL;
  if (severities.includes(RiskLevel.HIGH)) return RiskLevel.HIGH;
  if (severities.includes(RiskLevel.MEDIUM)) return RiskLevel.MEDIUM;
  if (severities.includes(RiskLevel.LOW)) return RiskLevel.LOW;

  return RiskLevel.MINIMAL;
};

/**
 * Calculates alert priority.
 */
const calculateAlertPriority = (severity: RiskLevel, anomalyCount: number): number => {
  const severityScore = {
    [RiskLevel.CRITICAL]: 10,
    [RiskLevel.HIGH]: 8,
    [RiskLevel.MEDIUM]: 5,
    [RiskLevel.LOW]: 3,
    [RiskLevel.MINIMAL]: 1,
  }[severity];

  return Math.min(10, severityScore + Math.floor(anomalyCount / 5));
};

/**
 * Maps anomaly type to alert type.
 */
const mapAnomalyToAlertType = (anomalyType: AnomalyType): AlertType => {
  const mapping: Record<AnomalyType, AlertType> = {
    [AnomalyType.STATISTICAL]: AlertType.UNUSUAL_ACCESS,
    [AnomalyType.TEMPORAL]: AlertType.UNUSUAL_ACCESS,
    [AnomalyType.CONTEXTUAL]: AlertType.UNUSUAL_ACCESS,
    [AnomalyType.VOLUME]: AlertType.DATA_EXFILTRATION,
    [AnomalyType.FREQUENCY]: AlertType.BRUTE_FORCE,
    [AnomalyType.LOCATION]: AlertType.COMPROMISED_CREDENTIALS,
    [AnomalyType.ACCESS_PATTERN]: AlertType.UNUSUAL_ACCESS,
    [AnomalyType.PRIVILEGE]: AlertType.PRIVILEGE_ABUSE,
    [AnomalyType.PEER_GROUP]: AlertType.INSIDER_THREAT,
  };

  return mapping[anomalyType] || AlertType.UNUSUAL_ACCESS;
};

/**
 * Generates alert recommendations.
 */
const generateAlertRecommendations = (
  alertType: AlertType,
  severity: RiskLevel
): string[] => {
  const recommendations: string[] = [];

  if (severity === RiskLevel.CRITICAL || severity === RiskLevel.HIGH) {
    recommendations.push('Immediate investigation required');
    recommendations.push('Contact user to verify activity');
  }

  switch (alertType) {
    case AlertType.INSIDER_THREAT:
      recommendations.push('Review user access logs');
      recommendations.push('Check for data exfiltration');
      recommendations.push('Consider access restriction');
      break;

    case AlertType.COMPROMISED_CREDENTIALS:
      recommendations.push('Force password reset');
      recommendations.push('Terminate active sessions');
      recommendations.push('Enable MFA if not already active');
      break;

    case AlertType.PRIVILEGE_ABUSE:
      recommendations.push('Review privilege changes');
      recommendations.push('Audit admin actions');
      recommendations.push('Restrict elevated access');
      break;

    case AlertType.DATA_EXFILTRATION:
      recommendations.push('Block network egress if needed');
      recommendations.push('Review data access logs');
      recommendations.push('Check for unusual file transfers');
      break;

    case AlertType.BRUTE_FORCE:
      recommendations.push('Implement account lockout');
      recommendations.push('Block source IP');
      recommendations.push('Enable CAPTCHA');
      break;

    default:
      recommendations.push('Review activity logs');
      recommendations.push('Monitor for additional anomalies');
  }

  return recommendations;
};
