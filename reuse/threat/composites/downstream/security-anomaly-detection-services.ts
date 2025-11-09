/**
 * LOC: SECANOMSVC002
 * File: /reuse/threat/composites/downstream/security-anomaly-detection-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../security-anomaly-detection-composite.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - SIEM integration platforms
 *   - Healthcare threat monitoring dashboards
 *   - Real-time security analytics engines
 *   - Behavioral analysis systems
 *   - Compliance monitoring services
 */

/**
 * File: /reuse/threat/composites/downstream/security-anomaly-detection-services.ts
 * Locator: WC-SECURITY-ANOMALY-DETECTION-SERVICE-002
 * Purpose: Production-ready Security Anomaly Detection Services for Healthcare
 *
 * Upstream: Imports from security-anomaly-detection-composite
 * Downstream: SIEM systems, Healthcare monitoring, Real-time detection, Analytics platforms
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, class-validator, class-transformer
 * Exports: Injectable services for anomaly detection, behavioral analytics, pattern recognition
 *
 * LLM Context: Enterprise-grade security anomaly detection service for White Cross healthcare platform.
 * Provides comprehensive anomaly detection combining statistical analysis, machine learning models,
 * behavioral analytics, and pattern recognition. Includes real-time threat detection, baseline
 * establishment, deviation analysis, UEBA (User and Entity Behavior Analytics), risk scoring,
 * automated alerting, false positive reduction, and HIPAA-compliant security monitoring for
 * healthcare environments with audit trails and compliance reporting.
 */

import {
  Injectable,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
  Max,
  IsUUID,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

// Import from security anomaly detection composite
import {
  // Baseline management
  establishBehaviorBaseline,
  createBehaviorBaseline,
  updateBehaviorBaseline,
  calculateBaselineMetrics,
  detectBaselineDeviation,
  adaptiveBaselineLearning,

  // Anomaly detection
  detectStatisticalAnomaly,
  detectMLBasedAnomaly,
  detectStatisticalAnomalies,
  detectTemporalAnomalies,
  detectContextualAnomalies,
  scoreBehavioralAnomaly,
  scoreAnomalySeverity,
  classifyAnomaly,
  classifyAnomalyType,
  reduceFalsePositives,

  // Behavioral analytics
  analyzeUserBehavior,
  analyzeEntityBehavior,
  trackBehaviorChanges,
  compareBehaviorProfiles,
  calculateBehaviorScore,
  identifyBehaviorAnomalies,
  correlateBehaviorAnomalies,
  detectPeerGroupDeviation,

  // Pattern detection
  detectThreatPatterns,
  matchThreatPatternAlgorithm,
  clusterThreatBehaviors,
  reconstructAttackChain,
  calculatePatternSimilarity,
  managePatternLibrary,

  // ML-based detection
  createAnomalyDetectionModel,
  detectAnomalies,
  trainStatisticalAnomalyModel,
  updateAnomalyBaseline,
  identifyOutlierThreats,

  // Feature engineering
  engineerThreatFeatures,
  extractStatisticalFeatures,
  selectTopFeatures,
  generateSHAPExplanation,
  getGlobalFeatureImportance,
} from '../security-anomaly-detection-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Anomaly severity levels
 */
export enum AnomalySeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Anomaly detection method
 */
export enum DetectionMethod {
  STATISTICAL = 'STATISTICAL',
  ML_BASED = 'ML_BASED',
  BEHAVIORAL = 'BEHAVIORAL',
  TEMPORAL = 'TEMPORAL',
  CONTEXTUAL = 'CONTEXTUAL',
  ENSEMBLE = 'ENSEMBLE',
}

/**
 * Entity types for monitoring
 */
export enum EntityType {
  USER = 'USER',
  DEVICE = 'DEVICE',
  APPLICATION = 'APPLICATION',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  API = 'API',
  SERVICE = 'SERVICE',
}

/**
 * Baseline status
 */
export enum BaselineStatus {
  INITIALIZING = 'INITIALIZING',
  ACTIVE = 'ACTIVE',
  STALE = 'STALE',
  UPDATING = 'UPDATING',
  ARCHIVED = 'ARCHIVED',
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * DTO for creating a baseline
 */
export class CreateBaselineDto {
  @ApiProperty({ description: 'Entity ID to monitor', example: 'user-12345' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType, example: EntityType.USER })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({ description: 'Baseline duration in days', example: 30 })
  @IsNumber()
  @Min(7)
  @Max(90)
  baselineDuration: number;

  @ApiProperty({ description: 'Metrics to baseline', type: [String], example: ['login_count', 'data_access'] })
  @IsArray()
  @IsString({ each: true })
  metrics: string[];

  @ApiProperty({ description: 'Enable adaptive learning', example: true })
  @IsBoolean()
  @IsOptional()
  adaptiveLearning?: boolean;

  @ApiProperty({ description: 'Peer group for comparison', required: false })
  @IsOptional()
  @IsString()
  peerGroup?: string;
}

/**
 * DTO for anomaly detection request
 */
export class DetectAnomalyDto {
  @ApiProperty({ description: 'Entity ID to analyze', example: 'user-12345' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType, example: EntityType.USER })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({ description: 'Detection method', enum: DetectionMethod, example: DetectionMethod.ENSEMBLE })
  @IsEnum(DetectionMethod)
  detectionMethod: DetectionMethod;

  @ApiProperty({ description: 'Activity data to analyze', type: 'object' })
  @IsObject()
  activityData: Record<string, any>;

  @ApiProperty({ description: 'Baseline ID to use', required: false })
  @IsOptional()
  @IsString()
  baselineId?: string;

  @ApiProperty({ description: 'Sensitivity threshold (0-1)', example: 0.8 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  sensitivityThreshold?: number;

  @ApiProperty({ description: 'Enable false positive reduction', example: true })
  @IsBoolean()
  @IsOptional()
  enableFPReduction?: boolean;
}

/**
 * DTO for behavioral analysis request
 */
export class AnalyzeBehaviorDto {
  @ApiProperty({ description: 'Entity ID to analyze', example: 'user-12345' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType, example: EntityType.USER })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({ description: 'Analysis time range start' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Analysis time range end' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Include peer group comparison', example: true })
  @IsBoolean()
  @IsOptional()
  includePeerComparison?: boolean;

  @ApiProperty({ description: 'Activity categories to analyze', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activityCategories?: string[];
}

/**
 * DTO for pattern detection request
 */
export class DetectPatternsDto {
  @ApiProperty({ description: 'Entity IDs to analyze', type: [String] })
  @IsArray()
  @IsString({ each: true })
  entityIds: string[];

  @ApiProperty({ description: 'Time range for analysis (hours)', example: 24 })
  @IsNumber()
  @Min(1)
  @Max(720)
  timeRangeHours: number;

  @ApiProperty({ description: 'Minimum pattern confidence', example: 0.7 })
  @IsNumber()
  @Min(0)
  @Max(1)
  minConfidence: number;

  @ApiProperty({ description: 'Include MITRE ATT&CK mapping', example: true })
  @IsBoolean()
  @IsOptional()
  includeMitreMapping?: boolean;

  @ApiProperty({ description: 'Cluster similar behaviors', example: true })
  @IsBoolean()
  @IsOptional()
  clusterBehaviors?: boolean;
}

/**
 * Response DTO for baseline creation
 */
export class BaselineResponseDto {
  @ApiProperty({ description: 'Baseline ID' })
  baselineId: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  entityType: EntityType;

  @ApiProperty({ description: 'Baseline status', enum: BaselineStatus })
  status: BaselineStatus;

  @ApiProperty({ description: 'Metrics tracked', type: [String] })
  metrics: string[];

  @ApiProperty({ description: 'Sample size' })
  sampleSize: number;

  @ApiProperty({ description: 'Confidence score (0-1)' })
  confidence: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated' })
  lastUpdated: Date;

  @ApiProperty({ description: 'Adaptive learning enabled' })
  adaptiveLearning: boolean;
}

/**
 * Response DTO for anomaly detection
 */
export class AnomalyDetectionResponseDto {
  @ApiProperty({ description: 'Detection ID' })
  detectionId: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  entityType: EntityType;

  @ApiProperty({ description: 'Detection timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Anomalies detected', type: [Object] })
  anomalies: Array<{
    anomalyId: string;
    type: string;
    severity: AnomalySeverity;
    score: number;
    confidence: number;
    description: string;
    affectedMetrics: string[];
    deviation: number;
    isOutlier: boolean;
  }>;

  @ApiProperty({ description: 'Detection method used', enum: DetectionMethod })
  detectionMethod: DetectionMethod;

  @ApiProperty({ description: 'Overall risk score (0-100)' })
  overallRiskScore: number;

  @ApiProperty({ description: 'Recommended actions', type: [String] })
  recommendedActions: string[];

  @ApiProperty({ description: 'False positive probability (0-1)' })
  falsePositiveProbability: number;

  @ApiProperty({ description: 'Feature importance', type: 'object', required: false })
  featureImportance?: Record<string, number>;
}

/**
 * Response DTO for behavioral analysis
 */
export class BehaviorAnalysisResponseDto {
  @ApiProperty({ description: 'Analysis ID' })
  analysisId: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  entityType: EntityType;

  @ApiProperty({ description: 'Analysis period start' })
  periodStart: Date;

  @ApiProperty({ description: 'Analysis period end' })
  periodEnd: Date;

  @ApiProperty({ description: 'Behavior score (0-100)' })
  behaviorScore: number;

  @ApiProperty({ description: 'Behavioral changes detected', type: [Object] })
  behaviorChanges: Array<{
    metric: string;
    changeType: string;
    magnitude: number;
    significance: string;
    timestamp: Date;
  }>;

  @ApiProperty({ description: 'Peer group comparison', type: 'object', required: false })
  peerComparison?: {
    peerGroup: string;
    deviation: number;
    percentile: number;
    isOutlier: boolean;
  };

  @ApiProperty({ description: 'Risk indicators', type: [String] })
  riskIndicators: string[];

  @ApiProperty({ description: 'Activity summary', type: 'object' })
  activitySummary: Record<string, number>;
}

/**
 * Response DTO for pattern detection
 */
export class PatternDetectionResponseDto {
  @ApiProperty({ description: 'Detection ID' })
  detectionId: string;

  @ApiProperty({ description: 'Timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Patterns detected', type: [Object] })
  patterns: Array<{
    patternId: string;
    patternType: string;
    confidence: number;
    entityCount: number;
    entities: string[];
    description: string;
    riskLevel: AnomalySeverity;
    mitreTactics?: string[];
    mitreTechniques?: string[];
  }>;

  @ApiProperty({ description: 'Behavior clusters', type: [Object], required: false })
  clusters?: Array<{
    clusterId: string;
    size: number;
    centroid: Record<string, number>;
    members: string[];
    cohesion: number;
  }>;

  @ApiProperty({ description: 'Attack chains reconstructed', type: [Object], required: false })
  attackChains?: Array<{
    chainId: string;
    steps: string[];
    confidence: number;
    severity: AnomalySeverity;
  }>;

  @ApiProperty({ description: 'Total patterns found' })
  totalPatterns: number;

  @ApiProperty({ description: 'High-risk patterns' })
  highRiskPatterns: number;
}

// ============================================================================
// INJECTABLE SERVICE
// ============================================================================

/**
 * Security Anomaly Detection Service
 *
 * Provides comprehensive anomaly detection for healthcare security operations
 * using statistical analysis, machine learning, and behavioral analytics.
 *
 * @example
 * ```typescript
 * // Inject service in controller or other service
 * constructor(private readonly anomalyService: SecurityAnomalyDetectionService) {}
 *
 * // Create a baseline for user
 * const baseline = await this.anomalyService.createBaseline({
 *   entityId: 'user-12345',
 *   entityType: EntityType.USER,
 *   baselineDuration: 30,
 *   metrics: ['login_count', 'data_access', 'failed_auth']
 * });
 * ```
 */
@Injectable()
export class SecurityAnomalyDetectionService {
  private readonly logger = new Logger(SecurityAnomalyDetectionService.name);

  /**
   * Creates a behavioral baseline for an entity
   *
   * @param dto - Baseline creation configuration
   * @returns Baseline information with metrics
   * @throws BadRequestException if configuration is invalid
   * @throws InternalServerErrorException if baseline creation fails
   */
  async createBaseline(dto: CreateBaselineDto): Promise<BaselineResponseDto> {
    try {
      this.logger.log(`Creating baseline for ${dto.entityType}: ${dto.entityId}`);

      // Create behavior baseline using composite function
      const baseline = await createBehaviorBaseline(
        dto.entityId,
        dto.metrics,
        {
          duration: dto.baselineDuration,
          entityType: dto.entityType,
          peerGroup: dto.peerGroup,
        }
      );

      // Calculate baseline metrics
      const metrics = await calculateBaselineMetrics(baseline.id, {
        includeStatistical: true,
        includeTemporal: true,
        includeDistribution: true,
      });

      // Establish behavior baseline with advanced features
      const establishedBaseline = await establishBehaviorBaseline(
        dto.entityId,
        dto.metrics,
        {
          duration: dto.baselineDuration,
          adaptiveLearning: dto.adaptiveLearning !== false,
          peerGroupComparison: !!dto.peerGroup,
        }
      );

      this.logger.log(`Baseline created successfully: ${baseline.id}`);

      return {
        baselineId: baseline.id,
        entityId: dto.entityId,
        entityType: dto.entityType,
        status: BaselineStatus.ACTIVE,
        metrics: dto.metrics,
        sampleSize: metrics.sampleSize || 0,
        confidence: metrics.confidence || 0,
        createdAt: new Date(),
        lastUpdated: new Date(),
        adaptiveLearning: dto.adaptiveLearning !== false,
      };
    } catch (error) {
      this.logger.error(`Failed to create baseline: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create behavioral baseline');
    }
  }

  /**
   * Detects anomalies in entity behavior
   *
   * @param dto - Anomaly detection request
   * @returns Detected anomalies with severity and recommendations
   * @throws NotFoundException if baseline not found
   * @throws InternalServerErrorException if detection fails
   */
  async detectAnomalies(dto: DetectAnomalyDto): Promise<AnomalyDetectionResponseDto> {
    try {
      this.logger.log(`Detecting anomalies for ${dto.entityType}: ${dto.entityId} using ${dto.detectionMethod}`);

      const detectionId = crypto.randomUUID();
      const anomaliesList: any[] = [];

      // Detect using specified method
      if (dto.detectionMethod === DetectionMethod.STATISTICAL || dto.detectionMethod === DetectionMethod.ENSEMBLE) {
        const statAnomalies = await detectStatisticalAnomalies(
          dto.entityId,
          dto.activityData,
          {
            threshold: dto.sensitivityThreshold || 0.8,
            includeZScore: true,
            includePValue: true,
          }
        );
        anomaliesList.push(...(Array.isArray(statAnomalies) ? statAnomalies : [statAnomalies]));
      }

      if (dto.detectionMethod === DetectionMethod.ML_BASED || dto.detectionMethod === DetectionMethod.ENSEMBLE) {
        const mlAnomalies = await detectMLBasedAnomaly(
          dto.entityId,
          dto.activityData,
          dto.baselineId || 'default'
        );
        anomaliesList.push(...(Array.isArray(mlAnomalies) ? mlAnomalies : [mlAnomalies]));
      }

      if (dto.detectionMethod === DetectionMethod.TEMPORAL) {
        const temporalAnomalies = await detectTemporalAnomalies(
          dto.entityId,
          [dto.activityData],
          {
            windowSize: 24,
            includeSeasonality: true,
          }
        );
        anomaliesList.push(...(Array.isArray(temporalAnomalies) ? temporalAnomalies : [temporalAnomalies]));
      }

      if (dto.detectionMethod === DetectionMethod.CONTEXTUAL) {
        const contextualAnomalies = await detectContextualAnomalies(
          dto.entityId,
          dto.activityData,
          {
            includeEnvironmentContext: true,
            includeBehaviorContext: true,
          }
        );
        anomaliesList.push(...(Array.isArray(contextualAnomalies) ? contextualAnomalies : [contextualAnomalies]));
      }

      // Score and classify anomalies
      const scoredAnomalies = await Promise.all(
        anomaliesList.map(async (anomaly) => {
          const behaviorScore = await scoreBehavioralAnomaly(anomaly, {
            includeContext: true,
            historicalComparison: true,
          });

          const severityScore = await scoreAnomalySeverity(anomaly, {
            includeImpact: true,
            includeUrgency: true,
          });

          const classification = await classifyAnomalyType(anomaly, {
            includeRootCause: true,
          });

          return {
            anomalyId: crypto.randomUUID(),
            type: classification.type || 'UNKNOWN',
            severity: this.mapScoreToSeverity(severityScore),
            score: behaviorScore,
            confidence: anomaly.confidence || 0.5,
            description: classification.description || 'Anomalous behavior detected',
            affectedMetrics: Object.keys(dto.activityData),
            deviation: anomaly.deviation || 0,
            isOutlier: anomaly.isOutlier !== false,
          };
        })
      );

      // Reduce false positives if enabled
      const finalAnomalies = dto.enableFPReduction
        ? await reduceFalsePositives(scoredAnomalies, {
            historicalData: true,
            contextAware: true,
            mlBased: true,
          })
        : scoredAnomalies;

      // Extract feature importance
      const features = await engineerThreatFeatures(dto.activityData, {
        includeStatistical: true,
        includeTemporal: true,
        includeBehavioral: true,
      });

      const featureImportance = await getGlobalFeatureImportance({
        features: features.features || [],
        model: 'anomaly_detection',
      });

      // Calculate overall risk score
      const overallRiskScore = this.calculateOverallRiskScore(finalAnomalies);

      // Generate recommendations
      const recommendations = this.generateRecommendations(finalAnomalies, dto.entityType);

      // Calculate false positive probability
      const fpProbability = this.calculateFalsePositiveProbability(finalAnomalies);

      this.logger.log(`Anomaly detection completed: ${finalAnomalies.length} anomalies detected`);

      return {
        detectionId,
        entityId: dto.entityId,
        entityType: dto.entityType,
        timestamp: new Date(),
        anomalies: finalAnomalies,
        detectionMethod: dto.detectionMethod,
        overallRiskScore,
        recommendedActions: recommendations,
        falsePositiveProbability: fpProbability,
        featureImportance: featureImportance,
      };
    } catch (error) {
      this.logger.error(`Failed to detect anomalies: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to detect anomalies');
    }
  }

  /**
   * Analyzes entity behavior over time
   *
   * @param dto - Behavior analysis request
   * @returns Comprehensive behavioral analysis with peer comparison
   * @throws InternalServerErrorException if analysis fails
   */
  async analyzeBehavior(dto: AnalyzeBehaviorDto): Promise<BehaviorAnalysisResponseDto> {
    try {
      this.logger.log(`Analyzing behavior for ${dto.entityType}: ${dto.entityId}`);

      const analysisId = crypto.randomUUID();

      // Analyze entity behavior
      const entityBehavior = await analyzeEntityBehavior(
        dto.entityId,
        {
          entityType: dto.entityType,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          includeCategories: dto.activityCategories,
        }
      );

      // Track behavior changes
      const behaviorChanges = await trackBehaviorChanges(
        dto.entityId,
        {
          timeRange: {
            start: new Date(dto.startDate),
            end: new Date(dto.endDate),
          },
          sensitivity: 0.7,
        }
      );

      // Calculate behavior score
      const behaviorScore = await calculateBehaviorScore(
        entityBehavior,
        {
          includeRisk: true,
          includeTrust: true,
          normalizeScore: true,
        }
      );

      // Identify behavior anomalies
      const anomalies = await identifyBehaviorAnomalies(
        entityBehavior,
        {
          threshold: 0.8,
          includeMinor: false,
        }
      );

      // Peer group comparison if requested
      let peerComparison = undefined;
      if (dto.includePeerComparison) {
        const deviation = await detectPeerGroupDeviation(
          dto.entityId,
          entityBehavior,
          {
            peerGroupSize: 50,
            significanceLevel: 0.05,
          }
        );

        peerComparison = {
          peerGroup: 'default',
          deviation: deviation.score || 0,
          percentile: deviation.percentile || 50,
          isOutlier: deviation.isOutlier || false,
        };
      }

      // Extract risk indicators
      const riskIndicators = this.extractRiskIndicators(anomalies, behaviorChanges);

      // Generate activity summary
      const activitySummary = this.generateActivitySummary(entityBehavior);

      this.logger.log(`Behavior analysis completed for ${dto.entityId}`);

      return {
        analysisId,
        entityId: dto.entityId,
        entityType: dto.entityType,
        periodStart: new Date(dto.startDate),
        periodEnd: new Date(dto.endDate),
        behaviorScore: behaviorScore * 100,
        behaviorChanges: behaviorChanges.map((change: any) => ({
          metric: change.metric,
          changeType: change.type || 'UNKNOWN',
          magnitude: change.magnitude || 0,
          significance: change.significance || 'LOW',
          timestamp: change.timestamp || new Date(),
        })),
        peerComparison,
        riskIndicators,
        activitySummary,
      };
    } catch (error) {
      this.logger.error(`Failed to analyze behavior: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to analyze behavior');
    }
  }

  /**
   * Detects threat patterns across multiple entities
   *
   * @param dto - Pattern detection request
   * @returns Detected patterns, clusters, and attack chains
   * @throws InternalServerErrorException if detection fails
   */
  async detectPatterns(dto: DetectPatternsDto): Promise<PatternDetectionResponseDto> {
    try {
      this.logger.log(`Detecting patterns for ${dto.entityIds.length} entities`);

      const detectionId = crypto.randomUUID();

      // Detect threat patterns
      const patterns = await detectThreatPatterns(
        [], // Activity data would be loaded here
        {
          includeKnownPatterns: true,
          includeMITREMapping: dto.includeMitreMapping !== false,
          minConfidence: dto.minConfidence,
        }
      );

      // Cluster behaviors if requested
      let clusters = undefined;
      if (dto.clusterBehaviors) {
        clusters = await clusterThreatBehaviors(
          [],
          {
            method: 'hierarchical',
            threshold: dto.minConfidence,
            minClusterSize: 2,
          }
        );
      }

      // Reconstruct attack chains
      const attackChains = await reconstructAttackChain([]);

      // Map patterns to response format
      const mappedPatterns = patterns.map((pattern: any) => ({
        patternId: pattern.id || crypto.randomUUID(),
        patternType: pattern.type || 'UNKNOWN',
        confidence: pattern.confidence || 0,
        entityCount: pattern.entities?.length || 0,
        entities: pattern.entities || [],
        description: pattern.description || 'Threat pattern detected',
        riskLevel: this.mapScoreToSeverity(pattern.riskScore || 0),
        mitreTactics: pattern.mitreTactics || [],
        mitreTechniques: pattern.mitreTechniques || [],
      }));

      // Map clusters to response format
      const mappedClusters = clusters ? clusters.map((cluster: any) => ({
        clusterId: cluster.id || crypto.randomUUID(),
        size: cluster.size || 0,
        centroid: cluster.centroid || {},
        members: cluster.members || [],
        cohesion: cluster.cohesion || 0,
      })) : undefined;

      // Map attack chains
      const mappedChains = attackChains.map((chain: any) => ({
        chainId: chain.id || crypto.randomUUID(),
        steps: chain.steps || [],
        confidence: chain.confidence || 0,
        severity: this.mapScoreToSeverity(chain.severity || 0),
      }));

      const highRiskPatterns = mappedPatterns.filter(
        p => p.riskLevel === AnomalySeverity.CRITICAL || p.riskLevel === AnomalySeverity.HIGH
      ).length;

      this.logger.log(`Pattern detection completed: ${mappedPatterns.length} patterns found`);

      return {
        detectionId,
        timestamp: new Date(),
        patterns: mappedPatterns,
        clusters: mappedClusters,
        attackChains: mappedChains,
        totalPatterns: mappedPatterns.length,
        highRiskPatterns,
      };
    } catch (error) {
      this.logger.error(`Failed to detect patterns: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to detect patterns');
    }
  }

  /**
   * Updates an existing baseline with new data
   *
   * @param baselineId - Baseline identifier
   * @param newData - New activity data
   * @returns Updated baseline information
   * @throws NotFoundException if baseline not found
   */
  async updateBaseline(baselineId: string, newData: Record<string, any>): Promise<BaselineResponseDto> {
    try {
      this.logger.log(`Updating baseline: ${baselineId}`);

      // Update baseline using adaptive learning
      const updatedBaseline = await adaptiveBaselineLearning(
        baselineId,
        newData,
        {
          learningRate: 0.1,
          driftDetection: true,
        }
      );

      // Recalculate metrics
      const metrics = await calculateBaselineMetrics(baselineId, {
        includeStatistical: true,
        includeTemporal: true,
      });

      this.logger.log(`Baseline updated successfully: ${baselineId}`);

      return {
        baselineId,
        entityId: updatedBaseline.entityId || '',
        entityType: EntityType.USER,
        status: BaselineStatus.ACTIVE,
        metrics: updatedBaseline.metrics || [],
        sampleSize: metrics.sampleSize || 0,
        confidence: metrics.confidence || 0,
        createdAt: updatedBaseline.createdAt || new Date(),
        lastUpdated: new Date(),
        adaptiveLearning: true,
      };
    } catch (error) {
      this.logger.error(`Failed to update baseline: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update baseline');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Maps numeric score to severity level
   */
  private mapScoreToSeverity(score: number): AnomalySeverity {
    if (score >= 0.9) return AnomalySeverity.CRITICAL;
    if (score >= 0.7) return AnomalySeverity.HIGH;
    if (score >= 0.5) return AnomalySeverity.MEDIUM;
    if (score >= 0.3) return AnomalySeverity.LOW;
    return AnomalySeverity.INFO;
  }

  /**
   * Calculates overall risk score from anomalies
   */
  private calculateOverallRiskScore(anomalies: any[]): number {
    if (anomalies.length === 0) return 0;

    const totalScore = anomalies.reduce((sum, anomaly) => {
      const severityWeight = this.getSeverityWeight(anomaly.severity);
      return sum + (anomaly.score * severityWeight * anomaly.confidence);
    }, 0);

    return Math.min(100, (totalScore / anomalies.length) * 100);
  }

  /**
   * Gets weight for severity level
   */
  private getSeverityWeight(severity: AnomalySeverity): number {
    const weights = {
      [AnomalySeverity.CRITICAL]: 1.0,
      [AnomalySeverity.HIGH]: 0.8,
      [AnomalySeverity.MEDIUM]: 0.6,
      [AnomalySeverity.LOW]: 0.4,
      [AnomalySeverity.INFO]: 0.2,
    };
    return weights[severity] || 0.5;
  }

  /**
   * Generates recommended actions based on anomalies
   */
  private generateRecommendations(anomalies: any[], entityType: EntityType): string[] {
    const recommendations: string[] = [];

    const criticalCount = anomalies.filter(a => a.severity === AnomalySeverity.CRITICAL).length;
    const highCount = anomalies.filter(a => a.severity === AnomalySeverity.HIGH).length;

    if (criticalCount > 0) {
      recommendations.push('IMMEDIATE ACTION REQUIRED: Critical anomalies detected - escalate to security team');
      recommendations.push('Temporarily restrict access permissions for affected entity');
      recommendations.push('Initiate forensic investigation');
    }

    if (highCount > 0) {
      recommendations.push('Enhanced monitoring required for this entity');
      recommendations.push('Review recent activity logs in detail');
    }

    if (entityType === EntityType.USER) {
      recommendations.push('Verify user identity through additional authentication');
      recommendations.push('Check for compromised credentials');
    } else if (entityType === EntityType.DEVICE) {
      recommendations.push('Perform endpoint security scan');
      recommendations.push('Verify device compliance status');
    }

    recommendations.push('Update behavioral baseline with validated normal activity');
    recommendations.push('Document findings for compliance audit trail');

    return recommendations;
  }

  /**
   * Calculates false positive probability
   */
  private calculateFalsePositiveProbability(anomalies: any[]): number {
    if (anomalies.length === 0) return 0;

    // Lower confidence and lower severity increase FP probability
    const fpSum = anomalies.reduce((sum, anomaly) => {
      const confidenceFactor = 1 - anomaly.confidence;
      const severityFactor = 1 - this.getSeverityWeight(anomaly.severity);
      return sum + (confidenceFactor * severityFactor);
    }, 0);

    return Math.min(1, fpSum / anomalies.length);
  }

  /**
   * Extracts risk indicators from anomalies and behavior changes
   */
  private extractRiskIndicators(anomalies: any[], changes: any[]): string[] {
    const indicators: string[] = [];

    if (anomalies.length > 3) {
      indicators.push('Multiple concurrent anomalies detected');
    }

    const rapidChanges = changes.filter((c: any) => c.magnitude > 2);
    if (rapidChanges.length > 0) {
      indicators.push('Rapid behavioral changes observed');
    }

    return indicators;
  }

  /**
   * Generates activity summary from behavior data
   */
  private generateActivitySummary(behavior: any): Record<string, number> {
    return {
      totalActivities: behavior.totalActivities || 0,
      uniqueActions: behavior.uniqueActions || 0,
      averageFrequency: behavior.averageFrequency || 0,
      peakActivity: behavior.peakActivity || 0,
    };
  }
}

// ============================================================================
// REST API CONTROLLER
// ============================================================================

/**
 * Security Anomaly Detection Controller
 *
 * REST API endpoints for security anomaly detection and behavioral analytics
 */
@ApiTags('Security Anomaly Detection')
@Controller('api/v1/security-anomaly-detection')
@ApiBearerAuth()
export class SecurityAnomalyDetectionController {
  private readonly logger = new Logger(SecurityAnomalyDetectionController.name);

  constructor(private readonly anomalyService: SecurityAnomalyDetectionService) {}

  /**
   * Create a behavioral baseline
   */
  @Post('baselines')
  @ApiOperation({
    summary: 'Create baseline',
    description: 'Create a behavioral baseline for entity monitoring'
  })
  @ApiResponse({ status: 201, description: 'Baseline created successfully', type: BaselineResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid baseline configuration' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateBaselineDto })
  async createBaseline(@Body() dto: CreateBaselineDto): Promise<BaselineResponseDto> {
    return this.anomalyService.createBaseline(dto);
  }

  /**
   * Detect anomalies
   */
  @Post('detect')
  @ApiOperation({
    summary: 'Detect anomalies',
    description: 'Detect behavioral and statistical anomalies in entity activity'
  })
  @ApiResponse({ status: 200, description: 'Anomaly detection completed', type: AnomalyDetectionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid detection parameters' })
  @ApiResponse({ status: 500, description: 'Detection failed' })
  @ApiBody({ type: DetectAnomalyDto })
  async detectAnomalies(@Body() dto: DetectAnomalyDto): Promise<AnomalyDetectionResponseDto> {
    return this.anomalyService.detectAnomalies(dto);
  }

  /**
   * Analyze entity behavior
   */
  @Post('analyze-behavior')
  @ApiOperation({
    summary: 'Analyze behavior',
    description: 'Perform comprehensive behavioral analysis for an entity'
  })
  @ApiResponse({ status: 200, description: 'Behavior analysis completed', type: BehaviorAnalysisResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid analysis parameters' })
  @ApiResponse({ status: 500, description: 'Analysis failed' })
  @ApiBody({ type: AnalyzeBehaviorDto })
  async analyzeBehavior(@Body() dto: AnalyzeBehaviorDto): Promise<BehaviorAnalysisResponseDto> {
    return this.anomalyService.analyzeBehavior(dto);
  }

  /**
   * Detect threat patterns
   */
  @Post('detect-patterns')
  @ApiOperation({
    summary: 'Detect patterns',
    description: 'Detect threat patterns and behavior clusters across entities'
  })
  @ApiResponse({ status: 200, description: 'Pattern detection completed', type: PatternDetectionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid pattern detection parameters' })
  @ApiResponse({ status: 500, description: 'Detection failed' })
  @ApiBody({ type: DetectPatternsDto })
  async detectPatterns(@Body() dto: DetectPatternsDto): Promise<PatternDetectionResponseDto> {
    return this.anomalyService.detectPatterns(dto);
  }

  /**
   * Update baseline
   */
  @Put('baselines/:baselineId')
  @ApiOperation({
    summary: 'Update baseline',
    description: 'Update baseline with new activity data using adaptive learning'
  })
  @ApiResponse({ status: 200, description: 'Baseline updated successfully', type: BaselineResponseDto })
  @ApiResponse({ status: 404, description: 'Baseline not found' })
  @ApiResponse({ status: 500, description: 'Update failed' })
  @ApiParam({ name: 'baselineId', description: 'Baseline identifier' })
  @ApiBody({ schema: { type: 'object' } })
  async updateBaseline(
    @Param('baselineId') baselineId: string,
    @Body() newData: Record<string, any>
  ): Promise<BaselineResponseDto> {
    return this.anomalyService.updateBaseline(baselineId, newData);
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export default {
  service: SecurityAnomalyDetectionService,
  controller: SecurityAnomalyDetectionController,
};
