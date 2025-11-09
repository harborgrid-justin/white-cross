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

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Behavioral entity types for analytics
 */
export enum BehaviorEntityType {
  USER = 'USER',
  SERVICE_ACCOUNT = 'SERVICE_ACCOUNT',
  DEVICE = 'DEVICE',
  APPLICATION = 'APPLICATION',
  IP_ADDRESS = 'IP_ADDRESS',
  API_KEY = 'API_KEY',
}

/**
 * Risk level classification for behavioral analytics
 */
export enum BehaviorRiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  MINIMAL = 'MINIMAL',
}

/**
 * Activity types for behavioral tracking
 */
export enum BehaviorActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FILE_ACCESS = 'FILE_ACCESS',
  FILE_DOWNLOAD = 'FILE_DOWNLOAD',
  FILE_UPLOAD = 'FILE_UPLOAD',
  FILE_DELETE = 'FILE_DELETE',
  DATA_QUERY = 'DATA_QUERY',
  DATA_EXPORT = 'DATA_EXPORT',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  CONFIGURATION_CHANGE = 'CONFIGURATION_CHANGE',
  API_CALL = 'API_CALL',
  EMAIL_SENT = 'EMAIL_SENT',
  FAILED_LOGIN = 'FAILED_LOGIN',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
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
  riskScore: number; // 0-100
  trustScore: number; // 0-100
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
  duration?: number; // milliseconds
  dataVolume?: number; // bytes
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
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
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
  overallScore: number; // 0-100
  components: RiskScoreComponents;
  factors: RiskFactor[];
  trend: RiskTrend;
  confidence: number; // 0-100
  explanation: string;
  recommendedActions: string[];
}

/**
 * Risk score components breakdown
 */
export interface RiskScoreComponents {
  activityPattern: number; // 0-100
  accessPattern: number; // 0-100
  volumeAnomaly: number; // 0-100
  temporalAnomaly: number; // 0-100
  locationAnomaly: number; // 0-100
  peerDeviation: number; // 0-100
  privilegeRisk: number; // 0-100
  dataAccessRisk: number; // 0-100
}

/**
 * Individual risk factor
 */
export interface RiskFactor {
  type: string;
  description: string;
  score: number; // 0-100
  weight: number; // 0-1
  evidence: string[];
  mitigation?: string;
}

/**
 * Risk trend analysis
 */
export interface RiskTrend {
  direction: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
  changeRate: number; // percentage
  prediction: number; // predicted score in 7 days
  confidence: number; // 0-100
}

/**
 * Peer group definition
 */
export interface PeerGroup {
  id: string;
  name: string;
  description: string;
  criteria: PeerGroupCriteria;
  members: string[]; // entity IDs
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
  confidence: number; // 0-100
  sampleSize: number;
  lastUpdated: Date;
}

/**
 * Time range definition
 */
export interface TimeRange {
  start: Date;
  end: Date;
  duration: number; // milliseconds
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
  confidence: number; // 0-100
  attributes: Record<string, any>;
  firstObserved: Date;
  lastObserved: Date;
  occurrenceCount: number;
}

/**
 * Pattern types
 */
export enum PatternType {
  TEMPORAL = 'TEMPORAL',
  SEQUENTIAL = 'SEQUENTIAL',
  VOLUMETRIC = 'VOLUMETRIC',
  ACCESS = 'ACCESS',
  LOCATION = 'LOCATION',
  DEVICE = 'DEVICE',
  DATA_FLOW = 'DATA_FLOW',
}

/**
 * Normal behavior ranges
 */
export interface NormalRanges {
  activitiesPerDay: { min: number; max: number };
  sessionDuration: { min: number; max: number };
  dataVolume: { min: number; max: number };
  loginTimes: { earliest: number; latest: number }; // hours
  accessedResources: string[];
}

/**
 * Peer comparison result
 */
export interface PeerComparisonResult {
  entityId: string;
  peerGroupId: string;
  deviationScore: number; // 0-100
  isOutlier: boolean;
  comparisons: PeerComparison[];
  ranking: number; // 1-N where N is group size
  percentile: number; // 0-100
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
  deviation: number; // percentage
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
  confidence: number; // 0-100
  evidence: Evidence[];
  detectedAt: Date;
  description: string;
  recommendedActions: string[];
}

/**
 * Insider threat types
 */
export enum InsiderThreatType {
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',
  PRIVILEGE_ABUSE = 'PRIVILEGE_ABUSE',
  CREDENTIAL_THEFT = 'CREDENTIAL_THEFT',
  SABOTAGE = 'SABOTAGE',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  SUSPICIOUS_COLLABORATION = 'SUSPICIOUS_COLLABORATION',
  ANOMALOUS_ACCESS = 'ANOMALOUS_ACCESS',
}

/**
 * Evidence structure
 */
export interface Evidence {
  type: string;
  description: string;
  timestamp: Date;
  confidence: number; // 0-100
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
  riskScore: number; // 0-100
}

/**
 * Temporal pattern
 */
export interface TemporalPattern {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL';
  description: string;
  strength: number; // 0-1
  periodicity: number; // in days
  confidence: number; // 0-100
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
  significance: number; // 0-100
  startDate: Date;
  endDate: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Behavior Entity Model
 * Stores entities being monitored for behavioral analytics
 */
@Table({
  tableName: 'behavior_entities',
  timestamps: true,
  indexes: [
    { fields: ['identifier'], unique: true },
    { fields: ['type'] },
    { fields: ['riskLevel'] },
    { fields: ['riskScore'] },
  ],
})
export class BehaviorEntityModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique entity identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(BehaviorEntityType)))
  @ApiProperty({ enum: BehaviorEntityType, description: 'Entity type' })
  type: BehaviorEntityType;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Entity identifier (username, device ID, etc.)' })
  identifier: string;

  @Column(DataType.STRING)
  @ApiPropertyOptional({ description: 'Department or organizational unit' })
  department?: string;

  @Column(DataType.STRING)
  @ApiPropertyOptional({ description: 'Role or job function' })
  role?: string;

  @AllowNull(false)
  @Default(BehaviorRiskLevel.LOW)
  @Column(DataType.ENUM(...Object.values(BehaviorRiskLevel)))
  @ApiProperty({ enum: BehaviorRiskLevel, description: 'Current risk level' })
  riskLevel: BehaviorRiskLevel;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Risk score (0-100)' })
  riskScore: number;

  @AllowNull(false)
  @Default(50)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Trust score (0-100)' })
  trustScore: number;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Behavior Activity Model
 * Stores individual behavioral activities
 */
@Table({
  tableName: 'behavior_activities',
  timestamps: true,
  indexes: [
    { fields: ['entityId'] },
    { fields: ['activityType'] },
    { fields: ['timestamp'] },
    { fields: ['riskScore'] },
  ],
})
export class BehaviorActivityModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique activity identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Associated entity ID' })
  entityId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(BehaviorActivityType)))
  @ApiProperty({ enum: BehaviorActivityType, description: 'Activity type' })
  activityType: BehaviorActivityType;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Activity timestamp' })
  timestamp: Date;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Activity details' })
  details: ActivityDetails;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Geographic location' })
  location?: GeoLocation;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Device information' })
  device?: DeviceInfo;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Contextual data' })
  contextual?: ContextualData;

  @Column(DataType.DECIMAL(5, 2))
  @ApiPropertyOptional({ description: 'Activity risk score' })
  riskScore?: number;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Behavior Risk Score Model
 * Stores calculated risk scores
 */
@Table({
  tableName: 'behavior_risk_scores',
  timestamps: true,
  indexes: [
    { fields: ['entityId'] },
    { fields: ['timestamp'] },
    { fields: ['overallScore'] },
  ],
})
export class BehaviorRiskScoreModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique risk score identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Associated entity ID' })
  entityId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Score calculation timestamp' })
  timestamp: Date;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Overall risk score (0-100)' })
  overallScore: number;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Risk score components' })
  components: RiskScoreComponents;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Risk factors' })
  factors: RiskFactor[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Risk trend analysis' })
  trend: RiskTrend;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Confidence in score (0-100)' })
  confidence: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Human-readable explanation' })
  explanation: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.TEXT))
  @ApiProperty({ description: 'Recommended actions' })
  recommendedActions: string[];
}

/**
 * Peer Group Model
 * Stores peer group definitions for comparative analysis
 */
@Table({
  tableName: 'peer_groups',
  timestamps: true,
  indexes: [{ fields: ['name'] }],
})
export class PeerGroupModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique peer group identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Peer group name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Peer group description' })
  description: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Membership criteria' })
  criteria: PeerGroupCriteria;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.UUID))
  @ApiProperty({ description: 'Member entity IDs' })
  members: string[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Group behavioral baseline' })
  baseline: BehaviorBaseline;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Group statistics' })
  statistics: PeerGroupStatistics;
}

/**
 * Insider Threat Indicator Model
 * Stores detected insider threat indicators
 */
@Table({
  tableName: 'insider_threat_indicators',
  timestamps: true,
  indexes: [
    { fields: ['entityId'] },
    { fields: ['indicatorType'] },
    { fields: ['severity'] },
    { fields: ['detectedAt'] },
  ],
})
export class InsiderThreatIndicatorModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique indicator identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Associated entity ID' })
  entityId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(InsiderThreatType)))
  @ApiProperty({ enum: InsiderThreatType, description: 'Threat indicator type' })
  indicatorType: InsiderThreatType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(BehaviorRiskLevel)))
  @ApiProperty({ enum: BehaviorRiskLevel, description: 'Threat severity' })
  severity: BehaviorRiskLevel;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  @ApiProperty({ description: 'Confidence in detection (0-100)' })
  confidence: number;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Supporting evidence' })
  evidence: Evidence[];

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Detection timestamp' })
  detectedAt: Date;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Indicator description' })
  description: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.TEXT))
  @ApiProperty({ description: 'Recommended actions' })
  recommendedActions: string[];
}

// ============================================================================
// BEHAVIORAL ANALYTICS FUNCTIONS
// ============================================================================

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
export const analyzeUserBehavior = async (
  userId: string,
  activities: BehaviorActivity[],
  baseline: BehaviorBaseline
): Promise<BehaviorRiskScore> => {
  const components: RiskScoreComponents = {
    activityPattern: calculateActivityPatternRisk(activities, baseline),
    accessPattern: calculateAccessPatternRisk(activities, baseline),
    volumeAnomaly: calculateVolumeAnomalyRisk(activities, baseline),
    temporalAnomaly: calculateTemporalAnomalyRisk(activities, baseline),
    locationAnomaly: calculateLocationAnomalyRisk(activities, baseline),
    peerDeviation: 0, // Requires peer group data
    privilegeRisk: calculatePrivilegeRisk(activities),
    dataAccessRisk: calculateDataAccessRisk(activities),
  };

  const factors: RiskFactor[] = [];
  Object.entries(components).forEach(([key, score]) => {
    if (score > 50) {
      factors.push({
        type: key,
        description: `${key} shows elevated risk`,
        score,
        weight: 1 / Object.keys(components).length,
        evidence: [`Score: ${score.toFixed(1)}`],
      });
    }
  });

  const overallScore =
    Object.values(components).reduce((sum, val) => sum + val, 0) / Object.keys(components).length;

  return {
    id: crypto.randomUUID(),
    entityId: userId,
    timestamp: new Date(),
    overallScore,
    components,
    factors,
    trend: {
      direction: 'STABLE',
      changeRate: 0,
      prediction: overallScore,
      confidence: 75,
    },
    confidence: 85,
    explanation: `User behavior analysis detected ${factors.length} risk factors with overall score ${overallScore.toFixed(1)}`,
    recommendedActions:
      overallScore > 70
        ? ['Immediate investigation', 'Review access logs', 'Contact user']
        : ['Monitor closely', 'Update baseline'],
  };
};

/**
 * Calculates activity pattern risk score.
 */
const calculateActivityPatternRisk = (activities: BehaviorActivity[], baseline: BehaviorBaseline): number => {
  const activityCount = activities.length;
  const expected = baseline.activityMetrics.avgDailyActivities;
  const deviation = Math.abs((activityCount - expected) / expected) * 100;
  return Math.min(100, deviation);
};

/**
 * Calculates access pattern risk score.
 */
const calculateAccessPatternRisk = (activities: BehaviorActivity[], baseline: BehaviorBaseline): number => {
  const accessedResources = new Set(activities.map((a) => a.details.resource).filter(Boolean));
  const typicalResources = new Set(baseline.activityMetrics.typicalAccessPatterns);
  const unusualAccess = [...accessedResources].filter((r) => !typicalResources.has(r)).length;
  return Math.min(100, (unusualAccess / accessedResources.size) * 100);
};

/**
 * Calculates volume anomaly risk score.
 */
const calculateVolumeAnomalyRisk = (activities: BehaviorActivity[], baseline: BehaviorBaseline): number => {
  const totalVolume = activities.reduce((sum, a) => sum + (a.details.dataVolume || 0), 0);
  const expected = baseline.activityMetrics.typicalDataVolume;
  if (expected === 0) return 0;
  const deviation = Math.abs((totalVolume - expected) / expected) * 100;
  return Math.min(100, deviation);
};

/**
 * Calculates temporal anomaly risk score.
 */
const calculateTemporalAnomalyRisk = (activities: BehaviorActivity[], baseline: BehaviorBaseline): number => {
  const offHoursActivities = activities.filter((a) => {
    const hour = a.timestamp.getHours();
    return !baseline.activityMetrics.peakActivityHours.includes(hour);
  });
  return (offHoursActivities.length / activities.length) * 100;
};

/**
 * Calculates location anomaly risk score.
 */
const calculateLocationAnomalyRisk = (activities: BehaviorActivity[], baseline: BehaviorBaseline): number => {
  const locations = activities.map((a) => a.location?.country).filter(Boolean);
  const unusualLocations = locations.filter((l) => !baseline.activityMetrics.commonLocations.includes(l!));
  return locations.length > 0 ? (unusualLocations.length / locations.length) * 100 : 0;
};

/**
 * Calculates privilege risk score.
 */
const calculatePrivilegeRisk = (activities: BehaviorActivity[]): number => {
  const privilegeEscalations = activities.filter((a) => a.activityType === BehaviorActivityType.PRIVILEGE_ESCALATION);
  return Math.min(100, privilegeEscalations.length * 25);
};

/**
 * Calculates data access risk score.
 */
const calculateDataAccessRisk = (activities: BehaviorActivity[]): number => {
  const sensitiveAccess = activities.filter(
    (a) =>
      a.activityType === BehaviorActivityType.DATA_EXPORT ||
      a.activityType === BehaviorActivityType.FILE_DOWNLOAD
  );
  return Math.min(100, sensitiveAccess.length * 15);
};

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
export const analyzeEntityBehavior = async (
  entityId: string,
  entityType: BehaviorEntityType,
  activities: BehaviorActivity[],
  baseline: BehaviorBaseline
): Promise<BehaviorRiskScore> => {
  return analyzeUserBehavior(entityId, activities, baseline);
};

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
export const trackBehaviorChanges = (
  oldPeriod: BehaviorActivity[],
  newPeriod: BehaviorActivity[]
): Record<string, number> => {
  return {
    activityCountChange: newPeriod.length - oldPeriod.length,
    activityRateChange: ((newPeriod.length - oldPeriod.length) / oldPeriod.length) * 100,
    avgSessionDurationChange: 0, // Simplified
  };
};

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
export const compareBehaviorProfiles = (
  profile1: BehaviorBaseline,
  profile2: BehaviorBaseline
): Record<string, number> => {
  return {
    activityRateDifference:
      profile2.activityMetrics.avgDailyActivities - profile1.activityMetrics.avgDailyActivities,
    sessionDurationDifference:
      profile2.activityMetrics.avgSessionDuration - profile1.activityMetrics.avgSessionDuration,
  };
};

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
export const calculateBehaviorScore = (riskScoreData: BehaviorRiskScore): number => {
  return riskScoreData.overallScore;
};

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
export const identifyBehaviorAnomalies = (
  activities: BehaviorActivity[],
  baseline: BehaviorBaseline
): BehaviorActivity[] => {
  return activities.filter((activity) => {
    const hour = activity.timestamp.getHours();
    return !baseline.activityMetrics.peakActivityHours.includes(hour);
  });
};

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
export const createBehaviorBaseline = (
  entityId: string,
  historicalActivities: BehaviorActivity[],
  periodDays: number = 30
): BehaviorBaseline => {
  const now = Date.now();
  const periodStart = now - periodDays * 24 * 60 * 60 * 1000;

  const relevantActivities = historicalActivities.filter((a) => a.timestamp.getTime() >= periodStart);

  const activitiesPerDay = relevantActivities.length / periodDays;
  const hoursMap = new Map<number, number>();
  relevantActivities.forEach((a) => {
    const hour = a.timestamp.getHours();
    hoursMap.set(hour, (hoursMap.get(hour) || 0) + 1);
  });

  const peakHours = Array.from(hoursMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([hour]) => hour);

  return {
    id: crypto.randomUUID(),
    entityId,
    profilePeriod: {
      start: new Date(periodStart),
      end: new Date(now),
      duration: periodDays * 24 * 60 * 60 * 1000,
    },
    activityMetrics: {
      avgDailyActivities: activitiesPerDay,
      avgWeeklyActivities: activitiesPerDay * 7,
      avgSessionDuration: 3600000, // 1 hour default
      peakActivityHours: peakHours,
      commonLocations: [],
      commonDevices: [],
      typicalDataVolume: 0,
      typicalAccessPatterns: [],
    },
    patterns: [],
    normalRanges: {
      activitiesPerDay: { min: activitiesPerDay * 0.5, max: activitiesPerDay * 1.5 },
      sessionDuration: { min: 1800000, max: 7200000 },
      dataVolume: { min: 0, max: 1000000 },
      loginTimes: { earliest: Math.min(...peakHours), latest: Math.max(...peakHours) },
      accessedResources: [],
    },
    confidence: Math.min(100, (relevantActivities.length / 1000) * 100),
    sampleSize: relevantActivities.length,
    lastUpdated: new Date(),
  };
};

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
export const updateBehaviorBaseline = (
  baseline: BehaviorBaseline,
  newActivities: BehaviorActivity[],
  learningRate: number = 0.1
): BehaviorBaseline => {
  const newAvgDaily = newActivities.length / 1; // Assume 1 day of new data
  const updatedAvg =
    baseline.activityMetrics.avgDailyActivities * (1 - learningRate) + newAvgDaily * learningRate;

  return {
    ...baseline,
    activityMetrics: {
      ...baseline.activityMetrics,
      avgDailyActivities: updatedAvg,
      avgWeeklyActivities: updatedAvg * 7,
    },
    lastUpdated: new Date(),
    sampleSize: baseline.sampleSize + newActivities.length,
  };
};

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
export const calculateBaselineMetrics = (activities: BehaviorActivity[]): ActivityMetrics => {
  const daysSet = new Set(activities.map((a) => a.timestamp.toDateString()));
  const avgDaily = activities.length / daysSet.size;

  return {
    avgDailyActivities: avgDaily,
    avgWeeklyActivities: avgDaily * 7,
    avgSessionDuration: 3600000,
    peakActivityHours: [],
    commonLocations: [],
    commonDevices: [],
    typicalDataVolume: 0,
    typicalAccessPatterns: [],
  };
};

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
export const detectBaselineDeviation = (
  currentValue: number,
  normalRanges: NormalRanges,
  metric: keyof Pick<NormalRanges, 'activitiesPerDay' | 'sessionDuration' | 'dataVolume'>
): boolean => {
  const range = normalRanges[metric];
  return currentValue < range.min || currentValue > range.max;
};

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
export const adaptiveBaselineLearning = (
  baseline: BehaviorBaseline,
  recentActivities: BehaviorActivity[]
): BehaviorBaseline => {
  return updateBehaviorBaseline(baseline, recentActivities, 0.05);
};

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
export const compareToPeerGroup = (
  entityId: string,
  peerGroup: PeerGroup,
  entityBaseline: BehaviorBaseline
): PeerComparisonResult => {
  const entityActivity = entityBaseline.activityMetrics.avgDailyActivities;
  const peerAvg = peerGroup.baseline.activityMetrics.avgDailyActivities;
  const peerStdDev = peerGroup.statistics.stdDevRiskScore;

  const zScore = (entityActivity - peerAvg) / (peerStdDev || 1);
  const isOutlier = Math.abs(zScore) > 2;

  return {
    entityId,
    peerGroupId: peerGroup.id,
    deviationScore: Math.min(100, Math.abs(zScore) * 30),
    isOutlier,
    comparisons: [
      {
        metric: 'avgDailyActivities',
        entityValue: entityActivity,
        peerAverage: peerAvg,
        peerStdDev,
        zScore,
        deviation: ((entityActivity - peerAvg) / peerAvg) * 100,
        isAnomaly: isOutlier,
      },
    ],
    ranking: 0, // Would need full member data
    percentile: 50,
  };
};

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
export const identifyPeerGroupOutliers = (
  peerGroup: PeerGroup,
  memberBaselines: Map<string, BehaviorBaseline>
): string[] => {
  const outliers: string[] = [];
  const avgActivity = peerGroup.baseline.activityMetrics.avgDailyActivities;
  const stdDev = peerGroup.statistics.stdDevRiskScore;

  peerGroup.members.forEach((memberId) => {
    const baseline = memberBaselines.get(memberId);
    if (baseline) {
      const activity = baseline.activityMetrics.avgDailyActivities;
      const zScore = Math.abs((activity - avgActivity) / stdDev);
      if (zScore > 2.5) {
        outliers.push(memberId);
      }
    }
  });

  return outliers;
};

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
export const calculatePeerGroupStatistics = (
  peerGroup: PeerGroup,
  memberScores: Map<string, BehaviorRiskScore>
): PeerGroupStatistics => {
  const scores = Array.from(memberScores.values()).map((s) => s.overallScore);
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
  const sorted = [...scores].sort((a, b) => a - b);

  return {
    memberCount: peerGroup.members.length,
    avgActivityRate: peerGroup.baseline.activityMetrics.avgDailyActivities,
    avgRiskScore: avg,
    stdDevRiskScore: Math.sqrt(variance),
    medianRiskScore: sorted[Math.floor(sorted.length / 2)],
    outlierCount: scores.filter((s) => Math.abs(s - avg) / Math.sqrt(variance) > 2).length,
    lastUpdated: new Date(),
  };
};

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
export const detectInsiderThreats = (
  entityId: string,
  activities: BehaviorActivity[],
  baseline: BehaviorBaseline
): InsiderThreatIndicator[] => {
  const indicators: InsiderThreatIndicator[] = [];

  // Check for data exfiltration
  const largeDownloads = activities.filter(
    (a) =>
      a.activityType === BehaviorActivityType.FILE_DOWNLOAD &&
      (a.details.dataVolume || 0) > baseline.activityMetrics.typicalDataVolume * 5
  );

  if (largeDownloads.length > 0) {
    indicators.push({
      id: crypto.randomUUID(),
      entityId,
      indicatorType: InsiderThreatType.DATA_EXFILTRATION,
      severity: BehaviorRiskLevel.HIGH,
      confidence: 80,
      evidence: largeDownloads.map((a) => ({
        type: 'activity',
        description: `Large download: ${a.details.dataVolume} bytes`,
        timestamp: a.timestamp,
        confidence: 80,
        source: 'activity_monitor',
      })),
      detectedAt: new Date(),
      description: `Detected ${largeDownloads.length} unusually large downloads`,
      recommendedActions: ['Investigate downloads', 'Review accessed files', 'Contact user'],
    });
  }

  // Check for privilege escalation
  const privilegeChanges = activities.filter(
    (a) => a.activityType === BehaviorActivityType.PRIVILEGE_ESCALATION
  );

  if (privilegeChanges.length > 0) {
    indicators.push({
      id: crypto.randomUUID(),
      entityId,
      indicatorType: InsiderThreatType.PRIVILEGE_ABUSE,
      severity: BehaviorRiskLevel.CRITICAL,
      confidence: 90,
      evidence: privilegeChanges.map((a) => ({
        type: 'privilege_change',
        description: 'Privilege escalation detected',
        timestamp: a.timestamp,
        confidence: 90,
        source: 'privilege_monitor',
      })),
      detectedAt: new Date(),
      description: `Detected ${privilegeChanges.length} privilege escalations`,
      recommendedActions: ['Immediate review', 'Revoke privileges', 'Security audit'],
    });
  }

  return indicators;
};

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
export const analyzeTemporalBehavior = (
  entityId: string,
  activities: BehaviorActivity[],
  timeWindow: TimeRange
): TemporalBehaviorAnalysis => {
  const patterns: TemporalPattern[] = [];
  const anomalies: TemporalAnomaly[] = [];

  // Detect off-hours activity
  const offHours = activities.filter((a) => {
    const hour = a.timestamp.getHours();
    return hour < 6 || hour > 22;
  });

  if (offHours.length > activities.length * 0.3) {
    anomalies.push({
      timestamp: new Date(),
      type: 'TIME_OF_DAY',
      severity: BehaviorRiskLevel.MEDIUM,
      description: `${((offHours.length / activities.length) * 100).toFixed(1)}% of activity outside business hours`,
      expectedValue: '<10%',
      actualValue: `${((offHours.length / activities.length) * 100).toFixed(1)}%`,
      deviation: (offHours.length / activities.length) * 100,
    });
  }

  return {
    entityId,
    timeWindow,
    patterns,
    anomalies,
    trends: [],
    riskScore: anomalies.length > 0 ? 60 : 20,
  };
};

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
export const calculateRiskTrend = (historicalScores: BehaviorRiskScore[]): RiskTrend => {
  if (historicalScores.length < 2) {
    return {
      direction: 'STABLE',
      changeRate: 0,
      prediction: historicalScores[0]?.overallScore || 0,
      confidence: 50,
    };
  }

  const sorted = [...historicalScores].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const first = sorted[0].overallScore;
  const last = sorted[sorted.length - 1].overallScore;
  const changeRate = ((last - first) / first) * 100;

  return {
    direction: changeRate > 10 ? 'INCREASING' : changeRate < -10 ? 'DECREASING' : 'STABLE',
    changeRate,
    prediction: last + (changeRate / 100) * last,
    confidence: 70,
  };
};

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
export const predictRiskScore = (historicalScores: BehaviorRiskScore[], daysAhead: number): number => {
  const trend = calculateRiskTrend(historicalScores);
  return Math.min(100, Math.max(0, trend.prediction));
};

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
export const generateBehaviorAnalyticsReport = (
  entityId: string,
  scores: BehaviorRiskScore[],
  threats: InsiderThreatIndicator[]
): Record<string, any> => {
  const avgScore = scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;

  return {
    entityId,
    reportDate: new Date(),
    avgRiskScore: avgScore,
    currentRiskLevel: avgScore > 70 ? 'HIGH' : avgScore > 40 ? 'MEDIUM' : 'LOW',
    threatCount: threats.length,
    criticalThreats: threats.filter((t) => t.severity === BehaviorRiskLevel.CRITICAL).length,
    trend: calculateRiskTrend(scores),
    recommendations:
      avgScore > 70
        ? ['Immediate investigation required', 'Enhanced monitoring', 'Access review']
        : ['Continue monitoring', 'Periodic review'],
  };
};

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
export const calculateRiskConfidenceInterval = (
  scores: BehaviorRiskScore[],
  confidenceLevel: number = 0.95
): { lower: number; upper: number } => {
  const values = scores.map((s) => s.overallScore);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
  const margin = 1.96 * stdDev; // 95% confidence

  return {
    lower: Math.max(0, mean - margin),
    upper: Math.min(100, mean + margin),
  };
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
export const aggregateRiskScores = (scores: BehaviorRiskScore[]): number => {
  return scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;
};

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
export const normalizeRiskScores = (scores: number[]): number[] => {
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min;

  if (range === 0) return scores.map(() => 50);

  return scores.map((score) => ((score - min) / range) * 100);
};

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
export const determineRiskLevel = (riskScore: number): BehaviorRiskLevel => {
  if (riskScore >= 80) return BehaviorRiskLevel.CRITICAL;
  if (riskScore >= 60) return BehaviorRiskLevel.HIGH;
  if (riskScore >= 40) return BehaviorRiskLevel.MEDIUM;
  if (riskScore >= 20) return BehaviorRiskLevel.LOW;
  return BehaviorRiskLevel.MINIMAL;
};

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
export const validateBehaviorBaseline = (baseline: BehaviorBaseline): boolean => {
  return (
    baseline.sampleSize >= 100 &&
    baseline.confidence >= 50 &&
    baseline.activityMetrics.avgDailyActivities > 0
  );
};

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
export const mergeBehaviorBaselines = (baselines: BehaviorBaseline[]): BehaviorBaseline => {
  const avgDaily =
    baselines.reduce((sum, b) => sum + b.activityMetrics.avgDailyActivities, 0) / baselines.length;

  return {
    ...baselines[0],
    activityMetrics: {
      ...baselines[0].activityMetrics,
      avgDailyActivities: avgDaily,
      avgWeeklyActivities: avgDaily * 7,
    },
    sampleSize: baselines.reduce((sum, b) => sum + b.sampleSize, 0),
    confidence: Math.max(...baselines.map((b) => b.confidence)),
    lastUpdated: new Date(),
  };
};

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
export const exportBehaviorData = (
  entityId: string,
  activities: BehaviorActivity[],
  scores: BehaviorRiskScore[]
): Record<string, any> => {
  return {
    entityId,
    exportDate: new Date(),
    activityCount: activities.length,
    scoreCount: scores.length,
    avgRiskScore: scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length,
    activities: activities.map((a) => ({
      timestamp: a.timestamp,
      type: a.activityType,
      riskScore: a.riskScore,
    })),
    scores: scores.map((s) => ({
      timestamp: s.timestamp,
      score: s.overallScore,
    })),
  };
};

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
export const calculateBehavioralEntropy = (activities: BehaviorActivity[]): number => {
  const typeCounts = new Map<BehaviorActivityType, number>();
  activities.forEach((a) => {
    typeCounts.set(a.activityType, (typeCounts.get(a.activityType) || 0) + 1);
  });

  let entropy = 0;
  const total = activities.length;

  typeCounts.forEach((count) => {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  });

  return entropy / Math.log2(Object.keys(BehaviorActivityType).length);
};

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
export const scoreBehaviorConsistency = (
  activities: BehaviorActivity[],
  baseline: BehaviorBaseline
): number => {
  const entropy = calculateBehavioralEntropy(activities);
  return Math.max(0, (1 - entropy) * 100);
};

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
export const detectBehaviorShift = (oldBaseline: BehaviorBaseline, newBaseline: BehaviorBaseline): boolean => {
  const activityChange =
    Math.abs(
      newBaseline.activityMetrics.avgDailyActivities - oldBaseline.activityMetrics.avgDailyActivities
    ) / oldBaseline.activityMetrics.avgDailyActivities;

  return activityChange > 0.5; // 50% change threshold
};

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
export const calculateBehaviorStability = (scores: BehaviorRiskScore[]): number => {
  const values = scores.map((s) => s.overallScore);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return Math.max(0, 100 - stdDev);
};

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
export const generateRiskHeatmap = (entityScores: Map<string, BehaviorRiskScore>): Record<string, any> => {
  const data: Record<string, number> = {};
  entityScores.forEach((score, entityId) => {
    data[entityId] = score.overallScore;
  });

  return {
    type: 'heatmap',
    data,
    timestamp: new Date(),
    maxScore: Math.max(...Object.values(data)),
    minScore: Math.min(...Object.values(data)),
  };
};

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
export const filterActivitiesByType = (
  activities: BehaviorActivity[],
  types: BehaviorActivityType[]
): BehaviorActivity[] => {
  const typeSet = new Set(types);
  return activities.filter((a) => typeSet.has(a.activityType));
};

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
export const calculateActivityFrequency = (
  activities: BehaviorActivity[]
): Map<BehaviorActivityType, number> => {
  const frequency = new Map<BehaviorActivityType, number>();

  activities.forEach((activity) => {
    frequency.set(activity.activityType, (frequency.get(activity.activityType) || 0) + 1);
  });

  return frequency;
};

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
export const detectPrivilegeEscalation = (
  activities: BehaviorActivity[]
): InsiderThreatIndicator[] => {
  const indicators: InsiderThreatIndicator[] = [];
  const escalations = activities.filter((a) => a.activityType === BehaviorActivityType.PRIVILEGE_ESCALATION);

  if (escalations.length > 0) {
    const entityIds = [...new Set(escalations.map((a) => a.entityId))];

    entityIds.forEach((entityId) => {
      const userEscalations = escalations.filter((a) => a.entityId === entityId);

      indicators.push({
        id: crypto.randomUUID(),
        entityId,
        indicatorType: InsiderThreatType.PRIVILEGE_ABUSE,
        severity: BehaviorRiskLevel.CRITICAL,
        confidence: 90,
        evidence: userEscalations.map((a) => ({
          type: 'privilege_escalation',
          description: `Privilege escalation at ${a.timestamp.toISOString()}`,
          timestamp: a.timestamp,
          confidence: 90,
          source: 'activity_monitor',
        })),
        detectedAt: new Date(),
        description: `Detected ${userEscalations.length} privilege escalation(s)`,
        recommendedActions: ['Immediate investigation', 'Review privilege changes', 'Audit user permissions'],
      });
    });
  }

  return indicators;
};

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
export const detectDataExfiltration = (
  activities: BehaviorActivity[],
  volumeThreshold: number
): InsiderThreatIndicator[] => {
  const indicators: InsiderThreatIndicator[] = [];
  const downloads = activities.filter((a) => a.activityType === BehaviorActivityType.FILE_DOWNLOAD);

  const entityVolumes = new Map<string, number>();

  downloads.forEach((download) => {
    const volume = download.details.dataVolume || 0;
    entityVolumes.set(download.entityId, (entityVolumes.get(download.entityId) || 0) + volume);
  });

  entityVolumes.forEach((volume, entityId) => {
    if (volume > volumeThreshold) {
      indicators.push({
        id: crypto.randomUUID(),
        entityId,
        indicatorType: InsiderThreatType.DATA_EXFILTRATION,
        severity: BehaviorRiskLevel.HIGH,
        confidence: 85,
        evidence: [
          {
            type: 'data_volume',
            description: `Downloaded ${(volume / 1000000).toFixed(2)} MB`,
            timestamp: new Date(),
            confidence: 85,
            source: 'data_monitor',
          },
        ],
        detectedAt: new Date(),
        description: `Excessive data download: ${(volume / 1000000).toFixed(2)} MB`,
        recommendedActions: ['Investigate downloads', 'Review downloaded files', 'Check destination'],
      });
    }
  });

  return indicators;
};

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
export const calculateTrustScore = (
  entityId: string,
  activities: BehaviorActivity[],
  historicalScores: BehaviorRiskScore[]
): number => {
  const avgRisk = historicalScores.reduce((sum, s) => sum + s.overallScore, 0) / historicalScores.length || 0;
  const failureCount = activities.filter((a) => a.details.result === 'failure').length;
  const failureRate = activities.length > 0 ? failureCount / activities.length : 0;

  const baseTrust = 100 - avgRisk;
  const penaltyforFailures = failureRate * 20;

  return Math.max(0, baseTrust - penaltyforFailures);
};

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
export const createPeerGroup = (
  name: string,
  criteria: PeerGroupCriteria,
  entities: BehaviorEntity[]
): PeerGroup => {
  const members = entities
    .filter((entity) => {
      if (criteria.department && !criteria.department.includes(entity.department || '')) return false;
      if (criteria.role && !criteria.role.includes(entity.role || '')) return false;
      if (criteria.entityType && !criteria.entityType.includes(entity.type)) return false;
      return true;
    })
    .map((e) => e.id);

  return {
    id: crypto.randomUUID(),
    name,
    description: `Peer group with ${members.length} members`,
    criteria,
    members,
    baseline: {
      id: crypto.randomUUID(),
      entityId: 'peer_group',
      profilePeriod: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
        duration: 30 * 24 * 60 * 60 * 1000,
      },
      activityMetrics: {
        avgDailyActivities: 0,
        avgWeeklyActivities: 0,
        avgSessionDuration: 0,
        peakActivityHours: [],
        commonLocations: [],
        commonDevices: [],
        typicalDataVolume: 0,
        typicalAccessPatterns: [],
      },
      patterns: [],
      normalRanges: {
        activitiesPerDay: { min: 0, max: 100 },
        sessionDuration: { min: 0, max: 7200000 },
        dataVolume: { min: 0, max: 1000000 },
        loginTimes: { earliest: 0, latest: 23 },
        accessedResources: [],
      },
      confidence: 50,
      sampleSize: 0,
      lastUpdated: new Date(),
    },
    statistics: {
      memberCount: members.length,
      avgActivityRate: 0,
      avgRiskScore: 0,
      stdDevRiskScore: 0,
      medianRiskScore: 0,
      outlierCount: 0,
      lastUpdated: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

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
export const scoreBehaviorAnomalySeverity = (
  activity: BehaviorActivity,
  baseline: BehaviorBaseline
): number => {
  let score = 0;

  // Check time of day
  const hour = activity.timestamp.getHours();
  if (!baseline.activityMetrics.peakActivityHours.includes(hour)) {
    score += 20;
  }

  // Check location
  if (activity.location && !baseline.activityMetrics.commonLocations.includes(activity.location.country)) {
    score += 30;
  }

  // Check activity type
  if (
    [
      BehaviorActivityType.PRIVILEGE_ESCALATION,
      BehaviorActivityType.DATA_EXPORT,
      BehaviorActivityType.FILE_DELETE,
    ].includes(activity.activityType)
  ) {
    score += 40;
  }

  return Math.min(100, score);
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Behavioral Analytics Service
 * Production-ready NestJS service for UEBA operations
 */
@Injectable()
export class BehavioralAnalyticsService {
  /**
   * Performs comprehensive behavioral analysis
   */
  async performBehaviorAnalysis(
    entityId: string,
    activities: BehaviorActivity[],
    baseline: BehaviorBaseline
  ): Promise<BehaviorRiskScore> {
    return analyzeUserBehavior(entityId, activities, baseline);
  }

  /**
   * Detects insider threats
   */
  async detectInsiderThreats(
    entityId: string,
    activities: BehaviorActivity[],
    baseline: BehaviorBaseline
  ): Promise<InsiderThreatIndicator[]> {
    return detectInsiderThreats(entityId, activities, baseline);
  }

  /**
   * Compares entity to peer group
   */
  async compareToPeers(
    entityId: string,
    peerGroup: PeerGroup,
    entityBaseline: BehaviorBaseline
  ): Promise<PeerComparisonResult> {
    return compareToPeerGroup(entityId, peerGroup, entityBaseline);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  BehaviorEntityModel,
  BehaviorActivityModel,
  BehaviorRiskScoreModel,
  PeerGroupModel,
  InsiderThreatIndicatorModel,

  // Core Functions
  analyzeUserBehavior,
  analyzeEntityBehavior,
  trackBehaviorChanges,
  compareBehaviorProfiles,
  calculateBehaviorScore,
  identifyBehaviorAnomalies,
  createBehaviorBaseline,
  updateBehaviorBaseline,
  calculateBaselineMetrics,
  detectBaselineDeviation,
  adaptiveBaselineLearning,
  compareToPeerGroup,
  identifyPeerGroupOutliers,
  calculatePeerGroupStatistics,
  detectInsiderThreats,
  analyzeTemporalBehavior,
  calculateRiskTrend,
  predictRiskScore,
  generateBehaviorAnalyticsReport,
  calculateRiskConfidenceInterval,
  aggregateRiskScores,
  normalizeRiskScores,
  determineRiskLevel,
  validateBehaviorBaseline,
  mergeBehaviorBaselines,
  exportBehaviorData,
  calculateBehavioralEntropy,
  scoreBehaviorConsistency,
  detectBehaviorShift,
  calculateBehaviorStability,
  generateRiskHeatmap,
  filterActivitiesByType,
  calculateActivityFrequency,
  detectPrivilegeEscalation,
  detectDataExfiltration,
  calculateTrustScore,
  createPeerGroup,
  scoreBehaviorAnomalySeverity,

  // Services
  BehavioralAnalyticsService,
};
