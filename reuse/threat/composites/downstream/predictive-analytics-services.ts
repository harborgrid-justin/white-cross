/**
 * LOC: PREDANALYTICS001
 * File: /reuse/threat/composites/downstream/predictive-analytics-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../predictive-threat-models-composite
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Backend API controllers
 *   - Threat prediction dashboards
 *   - ML model management interfaces
 *   - Healthcare threat forecasting systems
 *   - Executive reporting services
 */

/**
 * File: /reuse/threat/composites/downstream/predictive-analytics-services.ts
 * Locator: WC-THREAT-PREDICTIVE-ANALYTICS-SERVICE-001
 * Purpose: Production-ready Predictive Analytics Services for Healthcare Threat Intelligence
 *
 * Upstream: Imports from predictive-threat-models-composite
 * Downstream: REST APIs, WebSocket services, Background jobs, Reporting systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6.x, TensorFlow.js, Prophet
 * Exports: Injectable services for ML-based threat prediction, forecasting, and analytics
 *
 * LLM Context: Enterprise-grade predictive analytics service for White Cross healthcare platform.
 * Provides comprehensive ML-based threat prediction services including real-time prediction APIs,
 * model training and deployment, threat forecasting, anomaly detection, pattern recognition,
 * attack timing prediction, behavioral analytics, and HIPAA-compliant predictive intelligence.
 * Includes NestJS decorators, Swagger documentation, comprehensive error handling, audit logging,
 * and production-ready monitoring capabilities.
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
  UseGuards,
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
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// Import from predictive threat models composite
import {
  // Sequelize Model Attributes
  getMLPredictionModelAttributes,
  getThreatForecastingModelAttributes,
  getThreatAnomalyModelAttributes,
  getMLModelRegistryAttributes,

  // Prediction Functions
  createThreatPrediction,
  updateThreatPrediction,
  generatePredictionConfidence,
  predictAttackVectors,
  modelThreatEvolution,
  predictThreatImpact,
  generateComprehensiveRiskScore,

  // Forecasting Functions
  forecastAttackTiming,
  analyzeThreatTrends,
  identifyEmergingThreats,
  trackThreatEvolution,
  detectSeasonalPatterns,
  calculateThreatVelocity,
  analyzeGeographicDistribution,
  analyzeIndustryTrends,

  // Attack Prediction Functions
  calculateAttackProbability,
  predictAttackSurfaceExposure,
  estimateExploitationLikelihood,
  estimateTimeToAttack,
  scoreTargetAttractiveness,

  // Threat Actor & Campaign Prediction
  profileThreatActor,
  predictCampaignProgression,

  // Pattern Detection Functions
  detectThreatPatterns,
  matchThreatPatternAlgorithm,
  clusterThreatBehaviors,
  reconstructAttackChain,
  matchMITREAttackTTP,
  calculatePatternSimilarity,
  managePatternLibrary,

  // Anomaly Detection Functions
  establishBehaviorBaseline,
  detectStatisticalAnomaly,
  detectMLBasedAnomaly,
  scoreBehavioralAnomaly,
  classifyAnomaly,
  reduceFalsePositives,

  // ML Model Management
  trainThreatPredictionModel,
  deployMLModel,
  extractThreatFeatures,
  evaluateModelPerformance,
  tuneModelHyperparameters,
  versionMLModel,
  batchPredict,

  // ML Model Creation & Training
  createMLModel,
  createAnomalyDetectionModel,
  trainStatisticalAnomalyModel,
  createThreatClassificationModel,
  createThreatClusteringModel,
  trainThreatForecastingModel,
  createThreatNLPModel,

  // Feature Engineering
  engineerThreatFeatures,
  createTemporalFeatures,
  extractStatisticalFeatures,
  selectTopFeatures,

  // Model Performance & Versioning
  generateModelPerformanceReport,
  createModelVersion,

  // Advanced ML Techniques
  createEnsembleModel,
  setupABTest,
} from '../predictive-threat-models-composite';

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * DTO for creating a new threat prediction
 */
export class CreateThreatPredictionDto {
  @ApiProperty({ description: 'Type of threat prediction', example: 'THREAT_EMERGENCE' })
  @IsString()
  predictionType: string;

  @ApiProperty({ description: 'Threat category', example: 'RANSOMWARE' })
  @IsString()
  threatCategory: string;

  @ApiProperty({ description: 'Threat description', example: 'Predicted ransomware attack on healthcare facility' })
  @IsString()
  threatDescription: string;

  @ApiProperty({ description: 'Historical data for prediction', type: 'object' })
  @IsOptional()
  historicalData?: Record<string, any>;

  @ApiProperty({ description: 'Prediction window in hours', example: 24 })
  @IsNumber()
  @Min(1)
  @Max(720)
  predictionWindow: number;

  @ApiProperty({ description: 'Target assets', type: [String], required: false })
  @IsOptional()
  @IsArray()
  targetAssets?: string[];
}

/**
 * DTO for threat forecast request
 */
export class CreateThreatForecastDto {
  @ApiProperty({ description: 'Forecast type', example: 'ATTACK_VOLUME' })
  @IsString()
  forecastType: string;

  @ApiProperty({ description: 'Threat category', example: 'PHISHING' })
  @IsString()
  threatCategory: string;

  @ApiProperty({ description: 'Forecast period in days', example: 30 })
  @IsNumber()
  @Min(1)
  @Max(365)
  forecastPeriod: number;

  @ApiProperty({ description: 'Granularity', enum: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'], example: 'DAILY' })
  @IsEnum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'])
  granularity: string;

  @ApiProperty({ description: 'Model type', enum: ['ARIMA', 'LSTM', 'PROPHET', 'ENSEMBLE'], example: 'PROPHET' })
  @IsEnum(['ARIMA', 'LSTM', 'PROPHET', 'ENSEMBLE'])
  modelType: string;

  @ApiProperty({ description: 'Include seasonal patterns', example: true })
  @IsBoolean()
  includeSeasonality: boolean;
}

/**
 * DTO for training ML model
 */
export class TrainMLModelDto {
  @ApiProperty({ description: 'Model name', example: 'ransomware-predictor-v2' })
  @IsString()
  modelName: string;

  @ApiProperty({ description: 'Model type', example: 'CLASSIFICATION' })
  @IsString()
  modelType: string;

  @ApiProperty({ description: 'Algorithm', example: 'RANDOM_FOREST' })
  @IsString()
  algorithm: string;

  @ApiProperty({ description: 'Training dataset reference', example: 'dataset-2024-q4' })
  @IsString()
  trainingDataset: string;

  @ApiProperty({ description: 'Hyperparameters', type: 'object', required: false })
  @IsOptional()
  hyperparameters?: Record<string, any>;

  @ApiProperty({ description: 'Features to use', type: [String] })
  @IsArray()
  features: string[];

  @ApiProperty({ description: 'Auto-deploy on success', example: false })
  @IsBoolean()
  @IsOptional()
  autoDeploy?: boolean;
}

/**
 * DTO for anomaly detection configuration
 */
export class AnomalyDetectionConfigDto {
  @ApiProperty({ description: 'Entity ID to monitor', example: 'user-12345' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: 'Detection method', enum: ['STATISTICAL', 'ML', 'ENSEMBLE'], example: 'ENSEMBLE' })
  @IsEnum(['STATISTICAL', 'ML', 'ENSEMBLE'])
  detectionMethod: string;

  @ApiProperty({ description: 'Baseline duration in days', example: 30 })
  @IsNumber()
  @Min(7)
  @Max(90)
  baselineDuration: number;

  @ApiProperty({ description: 'Sensitivity threshold (0-1)', example: 0.75 })
  @IsNumber()
  @Min(0)
  @Max(1)
  sensitivityThreshold: number;

  @ApiProperty({ description: 'Enable false positive reduction', example: true })
  @IsBoolean()
  enableFPReduction: boolean;
}

/**
 * Response DTO for threat prediction
 */
export class ThreatPredictionResponseDto {
  @ApiProperty({ description: 'Prediction ID' })
  predictionId: string;

  @ApiProperty({ description: 'Model ID used for prediction' })
  modelId: string;

  @ApiProperty({ description: 'Model version' })
  modelVersion: string;

  @ApiProperty({ description: 'Prediction type' })
  predictionType: string;

  @ApiProperty({ description: 'Threat category' })
  threatCategory: string;

  @ApiProperty({ description: 'Confidence score (0-1)' })
  confidence: number;

  @ApiProperty({ description: 'Likelihood score (0-1)' })
  likelihood: number;

  @ApiProperty({ description: 'Impact score (0-10)' })
  impact: number;

  @ApiProperty({ description: 'Severity level' })
  severity: string;

  @ApiProperty({ description: 'Predicted date' })
  predictedDate: Date;

  @ApiProperty({ description: 'Attack vectors', type: [Object] })
  attackVectors: any[];

  @ApiProperty({ description: 'Recommended mitigation actions', type: [String] })
  mitigationActions: string[];

  @ApiProperty({ description: 'Feature importance', type: 'object' })
  featureImportance: Record<string, number>;
}

/**
 * Response DTO for threat forecast
 */
export class ThreatForecastResponseDto {
  @ApiProperty({ description: 'Forecast ID' })
  forecastId: string;

  @ApiProperty({ description: 'Forecast type' })
  forecastType: string;

  @ApiProperty({ description: 'Model type used' })
  modelType: string;

  @ApiProperty({ description: 'Time series predictions', type: [Object] })
  predictions: Array<{
    timestamp: Date;
    value: number;
    upperBound: number;
    lowerBound: number;
  }>;

  @ApiProperty({ description: 'Trend direction' })
  trendDirection: string;

  @ApiProperty({ description: 'Trend strength (0-1)' })
  trendStrength: number;

  @ApiProperty({ description: 'Seasonality detected' })
  seasonalityDetected: boolean;

  @ApiProperty({ description: 'Detected anomalies', type: [Object] })
  detectedAnomalies: any[];

  @ApiProperty({ description: 'Forecast accuracy metrics', type: 'object' })
  accuracy: {
    rmse?: number;
    mae?: number;
    mape?: number;
  };

  @ApiProperty({ description: 'Confidence interval' })
  confidenceInterval: number;
}

/**
 * Response DTO for ML model information
 */
export class MLModelInfoDto {
  @ApiProperty({ description: 'Model ID' })
  modelId: string;

  @ApiProperty({ description: 'Model name' })
  modelName: string;

  @ApiProperty({ description: 'Version' })
  version: string;

  @ApiProperty({ description: 'Model type' })
  modelType: string;

  @ApiProperty({ description: 'Algorithm' })
  algorithm: string;

  @ApiProperty({ description: 'Status' })
  status: string;

  @ApiProperty({ description: 'Deployment status' })
  deploymentStatus: string;

  @ApiProperty({ description: 'Performance metrics', type: 'object' })
  performanceMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };

  @ApiProperty({ description: 'Prediction count' })
  predictionCount: number;

  @ApiProperty({ description: 'Average inference time (ms)' })
  averageInferenceTime: number;

  @ApiProperty({ description: 'Drift detected' })
  driftDetected: boolean;

  @ApiProperty({ description: 'Last training date' })
  trainingDate: Date;

  @ApiProperty({ description: 'Deployment date' })
  deploymentDate?: Date;
}

// ============================================================================
// INJECTABLE SERVICE
// ============================================================================

/**
 * Predictive Analytics Service
 *
 * Provides comprehensive ML-based threat prediction and forecasting capabilities
 * for healthcare security operations. Includes model training, deployment,
 * real-time prediction, anomaly detection, and performance monitoring.
 *
 * @example
 * ```typescript
 * // Inject service in controller or other service
 * constructor(private readonly predictiveAnalytics: PredictiveAnalyticsService) {}
 *
 * // Create a threat prediction
 * const prediction = await this.predictiveAnalytics.createPrediction({
 *   predictionType: 'THREAT_EMERGENCE',
 *   threatCategory: 'RANSOMWARE',
 *   threatDescription: 'Predicted ransomware attack',
 *   predictionWindow: 24
 * });
 * ```
 */
@Injectable()
export class PredictiveAnalyticsService {
  private readonly logger = new Logger(PredictiveAnalyticsService.name);

  /**
   * Creates a new threat prediction using ML models
   *
   * @param dto - Prediction configuration
   * @returns Threat prediction with confidence scores and mitigation actions
   */
  async createPrediction(dto: CreateThreatPredictionDto): Promise<ThreatPredictionResponseDto> {
    try {
      this.logger.log(`Creating threat prediction: ${dto.predictionType} - ${dto.threatCategory}`);

      // Create the prediction using composite function
      const prediction = await createThreatPrediction({
        predictionType: dto.predictionType,
        threatCategory: dto.threatCategory,
        description: dto.threatDescription,
        historicalData: dto.historicalData || {},
        predictionWindow: dto.predictionWindow,
      });

      // Generate confidence score
      const confidence = await generatePredictionConfidence(prediction, {
        includeModelMetrics: true,
        includeFeatureImportance: true,
      });

      // Predict attack vectors
      const attackVectors = await predictAttackVectors(dto.threatCategory, {
        includeEntryPoints: true,
        includeTechniques: true,
        mitreMapping: true,
      });

      // Predict threat impact
      const impact = await predictThreatImpact(prediction, {
        targetAssets: dto.targetAssets || [],
        includeFinancialImpact: true,
        includeOperationalImpact: true,
        hipaaContext: true,
      });

      // Generate comprehensive risk score
      const riskScore = await generateComprehensiveRiskScore({
        likelihood: prediction.likelihood,
        impact: impact.score,
        confidence: confidence.score,
        threatCategory: dto.threatCategory,
      });

      // Extract feature importance
      const features = await extractThreatFeatures(dto.historicalData || {}, {
        includeStatistical: true,
        includeTemporal: true,
        includeBehavioral: true,
      });

      this.logger.log(`Prediction created successfully: ${prediction.id}`);

      return {
        predictionId: prediction.id,
        modelId: prediction.modelId,
        modelVersion: prediction.modelVersion,
        predictionType: prediction.predictionType,
        threatCategory: prediction.threatCategory,
        confidence: confidence.score,
        likelihood: prediction.likelihood,
        impact: impact.score,
        severity: prediction.severity,
        predictedDate: prediction.predictedDate,
        attackVectors: attackVectors,
        mitigationActions: this.generateMitigationActions(prediction, attackVectors),
        featureImportance: features.importance || {},
      };
    } catch (error) {
      this.logger.error(`Failed to create prediction: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create threat prediction');
    }
  }

  /**
   * Creates a threat forecast for a specified time period
   *
   * @param dto - Forecast configuration
   * @returns Time-series threat forecast with predictions and anomalies
   */
  async createForecast(dto: CreateThreatForecastDto): Promise<ThreatForecastResponseDto> {
    try {
      this.logger.log(`Creating threat forecast: ${dto.forecastType} - ${dto.threatCategory}`);

      // Train forecasting model if needed
      const forecastModel = await trainThreatForecastingModel({
        modelType: dto.modelType,
        threatCategory: dto.threatCategory,
        forecastPeriod: dto.forecastPeriod,
        granularity: dto.granularity,
        includeSeasonality: dto.includeSeasonality,
      });

      // Forecast attack timing
      const forecast = await forecastAttackTiming(dto.threatCategory, {
        forecastPeriod: dto.forecastPeriod,
        granularity: dto.granularity,
        modelType: dto.modelType,
        confidenceInterval: 0.95,
      });

      // Detect seasonal patterns if enabled
      let seasonalPattern = null;
      if (dto.includeSeasonality) {
        seasonalPattern = await detectSeasonalPatterns(dto.threatCategory, {
          minCycles: 2,
          confidenceThreshold: 0.8,
        });
      }

      // Analyze threat trends
      const trends = await analyzeThreatTrends(dto.threatCategory, {
        timeRange: { start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), end: new Date() },
        includeVelocity: true,
        includeTrendStrength: true,
      });

      // Calculate threat velocity
      const velocity = await calculateThreatVelocity(dto.threatCategory, {
        timeWindow: 24 * 60 * 60 * 1000, // 24 hours
        unit: 'per_day',
      });

      // Identify emerging threats
      const emergingThreats = await identifyEmergingThreats({
        threatCategory: dto.threatCategory,
        threshold: 0.7,
        timeWindow: dto.forecastPeriod,
      });

      this.logger.log(`Forecast created successfully: ${forecast.id}`);

      return {
        forecastId: forecast.id,
        forecastType: dto.forecastType,
        modelType: dto.modelType,
        predictions: forecast.predictions.map((pred: any) => ({
          timestamp: pred.timestamp,
          value: pred.value,
          upperBound: pred.upperBound,
          lowerBound: pred.lowerBound,
        })),
        trendDirection: trends.direction,
        trendStrength: trends.strength,
        seasonalityDetected: !!seasonalPattern,
        detectedAnomalies: forecast.anomalies || [],
        accuracy: {
          rmse: forecast.rmse,
          mae: forecast.mae,
          mape: forecast.mape,
        },
        confidenceInterval: forecast.confidenceInterval,
      };
    } catch (error) {
      this.logger.error(`Failed to create forecast: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create threat forecast');
    }
  }

  /**
   * Trains a new ML model for threat prediction
   *
   * @param dto - Model training configuration
   * @returns Trained model information with performance metrics
   */
  async trainModel(dto: TrainMLModelDto): Promise<MLModelInfoDto> {
    try {
      this.logger.log(`Training ML model: ${dto.modelName}`);

      // Create ML model
      const model = await createMLModel({
        modelName: dto.modelName,
        modelType: dto.modelType,
        algorithm: dto.algorithm,
        framework: this.selectFramework(dto.algorithm),
      });

      // Train the model
      const trainedModel = await trainThreatPredictionModel({
        modelId: model.id,
        trainingDataset: dto.trainingDataset,
        features: dto.features,
        hyperparameters: dto.hyperparameters || this.getDefaultHyperparameters(dto.algorithm),
        validationSplit: 0.2,
        testSplit: 0.1,
      });

      // Evaluate model performance
      const performance = await evaluateModelPerformance(trainedModel.id, {
        metrics: ['accuracy', 'precision', 'recall', 'f1', 'auc'],
        includeConfusionMatrix: true,
        includeROC: true,
      });

      // Create model version
      const version = await createModelVersion(trainedModel.id, {
        versionTag: 'v1.0.0',
        description: `Initial training of ${dto.modelName}`,
        performanceMetrics: performance,
      });

      // Deploy model if auto-deploy is enabled
      if (dto.autoDeploy && performance.accuracy > 0.85) {
        await deployMLModel(trainedModel.id, {
          environment: 'production',
          deploymentStrategy: 'blue_green',
          healthCheckEnabled: true,
        });
        this.logger.log(`Model auto-deployed: ${trainedModel.id}`);
      }

      this.logger.log(`Model training completed: ${trainedModel.id}`);

      return {
        modelId: trainedModel.id,
        modelName: dto.modelName,
        version: version.version,
        modelType: dto.modelType,
        algorithm: dto.algorithm,
        status: 'VALIDATED',
        deploymentStatus: dto.autoDeploy ? 'PRODUCTION' : 'NOT_DEPLOYED',
        performanceMetrics: {
          accuracy: performance.accuracy,
          precision: performance.precision,
          recall: performance.recall,
          f1Score: performance.f1Score,
        },
        predictionCount: 0,
        averageInferenceTime: 0,
        driftDetected: false,
        trainingDate: new Date(),
        deploymentDate: dto.autoDeploy ? new Date() : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to train model: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to train ML model');
    }
  }

  /**
   * Detects anomalies using ML-based methods
   *
   * @param dto - Anomaly detection configuration
   * @returns Detected anomalies with severity scores
   */
  async detectAnomalies(dto: AnomalyDetectionConfigDto): Promise<any> {
    try {
      this.logger.log(`Detecting anomalies for entity: ${dto.entityId}`);

      // Establish behavior baseline
      const baseline = await establishBehaviorBaseline(dto.entityId, [], {
        duration: dto.baselineDuration,
        adaptiveLearning: true,
      });

      // Detect anomalies using configured method
      let anomalies: any[] = [];

      if (dto.detectionMethod === 'STATISTICAL' || dto.detectionMethod === 'ENSEMBLE') {
        const statAnomalies = await detectStatisticalAnomaly(dto.entityId, {}, baseline.id);
        anomalies = anomalies.concat(Array.isArray(statAnomalies) ? statAnomalies : [statAnomalies]);
      }

      if (dto.detectionMethod === 'ML' || dto.detectionMethod === 'ENSEMBLE') {
        const mlAnomalies = await detectMLBasedAnomaly(dto.entityId, {}, baseline.id);
        anomalies = anomalies.concat(Array.isArray(mlAnomalies) ? mlAnomalies : [mlAnomalies]);
      }

      // Score behavioral anomalies
      const scoredAnomalies = await Promise.all(
        anomalies.map(async (anomaly) => {
          const score = await scoreBehavioralAnomaly(anomaly, {
            includeContext: true,
            historicalComparison: true,
          });
          return { ...anomaly, behaviorScore: score };
        })
      );

      // Classify anomalies
      const classifiedAnomalies = scoredAnomalies.map((anomaly) =>
        classifyAnomaly(anomaly, {
          includeRootCause: true,
          suggestRemediation: true,
        })
      );

      // Reduce false positives if enabled
      const finalAnomalies = dto.enableFPReduction
        ? await reduceFalsePositives(classifiedAnomalies, {
            historicalData: true,
            contextAware: true,
            mlBased: true,
          })
        : classifiedAnomalies;

      this.logger.log(`Detected ${finalAnomalies.length} anomalies for entity ${dto.entityId}`);

      return {
        entityId: dto.entityId,
        baselineId: baseline.id,
        anomalyCount: finalAnomalies.length,
        anomalies: finalAnomalies,
        detectionMethod: dto.detectionMethod,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to detect anomalies: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to detect anomalies');
    }
  }

  /**
   * Analyzes threat patterns and clusters behaviors
   *
   * @param threatCategory - Category of threats to analyze
   * @returns Pattern analysis with MITRE ATT&CK mapping
   */
  async analyzePatterns(threatCategory: string): Promise<any> {
    try {
      this.logger.log(`Analyzing threat patterns for category: ${threatCategory}`);

      // Detect threat patterns
      const patterns = await detectThreatPatterns([], {
        includeKnownPatterns: true,
        includeMITREMapping: true,
      });

      // Cluster threat behaviors
      const clusters = await clusterThreatBehaviors([], {
        method: 'hierarchical',
        threshold: 0.7,
        minClusterSize: 3,
      });

      // Reconstruct attack chains
      const attackChains = await reconstructAttackChain([]);

      // Match MITRE ATT&CK TTPs
      const mitreMapping = await Promise.all(
        patterns.map((pattern: any) =>
          matchMITREAttackTTP(pattern, {
            includeSubTechniques: true,
            confidenceThreshold: 0.6,
          })
        )
      );

      // Manage pattern library
      await managePatternLibrary({
        action: 'update',
        patterns: patterns,
        threatCategory: threatCategory,
      });

      this.logger.log(`Pattern analysis completed for ${threatCategory}`);

      return {
        threatCategory,
        patternCount: patterns.length,
        patterns: patterns,
        clusters: clusters,
        attackChains: attackChains,
        mitreMapping: mitreMapping,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to analyze patterns: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to analyze threat patterns');
    }
  }

  /**
   * Predicts attack surface exposure for target assets
   *
   * @param targetAssets - List of asset identifiers
   * @returns Attack surface analysis with exposure scores
   */
  async predictAttackSurface(targetAssets: string[]): Promise<any> {
    try {
      this.logger.log(`Predicting attack surface for ${targetAssets.length} assets`);

      const predictions = await Promise.all(
        targetAssets.map(async (asset) => {
          // Predict attack surface exposure
          const exposure = await predictAttackSurfaceExposure(asset, {
            includeVulnerabilities: true,
            includeNetworkPaths: true,
            includeAccessPoints: true,
          });

          // Calculate attack probability
          const probability = await calculateAttackProbability(asset, {
            threatCategory: 'ALL',
            timeWindow: 30 * 24 * 60 * 60 * 1000, // 30 days
          });

          // Estimate exploitation likelihood
          const exploitability = await estimateExploitationLikelihood(asset, {
            includeZeroDays: true,
            includeKnownExploits: true,
          });

          // Estimate time to attack
          const timeToAttack = await estimateTimeToAttack(asset, {
            attackerSkillLevel: 'intermediate',
            includePreparationTime: true,
          });

          // Score target attractiveness
          const attractiveness = await scoreTargetAttractiveness(asset, {
            includeDataValue: true,
            includeStrategicValue: true,
            includeSymbolicValue: true,
          });

          return {
            asset,
            exposure: exposure.score,
            attackProbability: probability,
            exploitability: exploitability,
            estimatedTimeToAttack: timeToAttack,
            attractiveness: attractiveness,
            recommendations: this.generateAttackSurfaceRecommendations(exposure),
          };
        })
      );

      this.logger.log(`Attack surface prediction completed`);

      return {
        assetCount: targetAssets.length,
        predictions: predictions,
        overallRisk: this.calculateOverallRisk(predictions),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to predict attack surface: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to predict attack surface');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Generates mitigation actions based on prediction
   */
  private generateMitigationActions(prediction: any, attackVectors: any[]): string[] {
    const actions: string[] = [];

    if (prediction.severity === 'CRITICAL' || prediction.severity === 'HIGH') {
      actions.push('Immediately notify security team and incident response');
      actions.push('Activate enhanced monitoring for affected systems');
      actions.push('Review and update access controls');
    }

    attackVectors.forEach((vector: any) => {
      if (vector.type === 'PHISHING') {
        actions.push('Deploy anti-phishing training to affected users');
        actions.push('Enable advanced email filtering');
      } else if (vector.type === 'RANSOMWARE') {
        actions.push('Verify backup integrity and accessibility');
        actions.push('Implement application whitelisting');
        actions.push('Disable unnecessary network shares');
      } else if (vector.type === 'SQL_INJECTION') {
        actions.push('Review and sanitize database inputs');
        actions.push('Enable Web Application Firewall (WAF)');
      }
    });

    actions.push('Document incident and update threat model');

    return actions;
  }

  /**
   * Selects appropriate ML framework based on algorithm
   */
  private selectFramework(algorithm: string): string {
    const frameworkMap: Record<string, string> = {
      RANDOM_FOREST: 'SCIKIT_LEARN',
      LSTM: 'TENSORFLOW',
      PROPHET: 'PROPHET',
      ISOLATION_FOREST: 'SCIKIT_LEARN',
      AUTOENCODER: 'PYTORCH',
      XG_BOOST: 'XGBOOST',
    };

    return frameworkMap[algorithm] || 'SCIKIT_LEARN';
  }

  /**
   * Gets default hyperparameters for algorithm
   */
  private getDefaultHyperparameters(algorithm: string): Record<string, any> {
    const defaults: Record<string, Record<string, any>> = {
      RANDOM_FOREST: {
        n_estimators: 100,
        max_depth: 10,
        min_samples_split: 2,
        min_samples_leaf: 1,
      },
      LSTM: {
        units: 64,
        layers: 2,
        dropout: 0.2,
        learning_rate: 0.001,
      },
      ISOLATION_FOREST: {
        n_estimators: 100,
        contamination: 0.1,
        max_samples: 256,
      },
    };

    return defaults[algorithm] || {};
  }

  /**
   * Generates recommendations for attack surface reduction
   */
  private generateAttackSurfaceRecommendations(exposure: any): string[] {
    const recommendations: string[] = [];

    if (exposure.vulnerabilityCount > 0) {
      recommendations.push(`Patch ${exposure.vulnerabilityCount} identified vulnerabilities`);
    }

    if (exposure.openPorts && exposure.openPorts.length > 10) {
      recommendations.push('Review and close unnecessary open ports');
    }

    if (exposure.publicExposure) {
      recommendations.push('Reduce public exposure through network segmentation');
    }

    recommendations.push('Implement zero-trust architecture principles');
    recommendations.push('Enable multi-factor authentication on all access points');

    return recommendations;
  }

  /**
   * Calculates overall risk from attack surface predictions
   */
  private calculateOverallRisk(predictions: any[]): number {
    if (predictions.length === 0) return 0;

    const totalRisk = predictions.reduce((sum, pred) => {
      return sum + (pred.exposure * pred.attackProbability * pred.attractiveness);
    }, 0);

    return totalRisk / predictions.length;
  }
}

// ============================================================================
// REST API CONTROLLER
// ============================================================================

/**
 * Predictive Analytics Controller
 *
 * REST API endpoints for threat prediction and forecasting services
 */
@ApiTags('Predictive Analytics')
@Controller('api/v1/predictive-analytics')
@ApiBearerAuth()
export class PredictiveAnalyticsController {
  private readonly logger = new Logger(PredictiveAnalyticsController.name);

  constructor(private readonly analyticsService: PredictiveAnalyticsService) {}

  /**
   * Create a new threat prediction
   */
  @Post('predictions')
  @ApiOperation({ summary: 'Create threat prediction', description: 'Generate ML-based threat prediction with confidence scores' })
  @ApiResponse({ status: 201, description: 'Prediction created successfully', type: ThreatPredictionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateThreatPredictionDto })
  async createPrediction(@Body() dto: CreateThreatPredictionDto): Promise<ThreatPredictionResponseDto> {
    return this.analyticsService.createPrediction(dto);
  }

  /**
   * Create a threat forecast
   */
  @Post('forecasts')
  @ApiOperation({ summary: 'Create threat forecast', description: 'Generate time-series threat forecast' })
  @ApiResponse({ status: 201, description: 'Forecast created successfully', type: ThreatForecastResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateThreatForecastDto })
  async createForecast(@Body() dto: CreateThreatForecastDto): Promise<ThreatForecastResponseDto> {
    return this.analyticsService.createForecast(dto);
  }

  /**
   * Train a new ML model
   */
  @Post('models/train')
  @ApiOperation({ summary: 'Train ML model', description: 'Train new threat prediction model' })
  @ApiResponse({ status: 201, description: 'Model trained successfully', type: MLModelInfoDto })
  @ApiResponse({ status: 400, description: 'Invalid training parameters' })
  @ApiResponse({ status: 500, description: 'Training failed' })
  @ApiBody({ type: TrainMLModelDto })
  async trainModel(@Body() dto: TrainMLModelDto): Promise<MLModelInfoDto> {
    return this.analyticsService.trainModel(dto);
  }

  /**
   * Detect anomalies for an entity
   */
  @Post('anomalies/detect')
  @ApiOperation({ summary: 'Detect anomalies', description: 'Detect behavioral and statistical anomalies' })
  @ApiResponse({ status: 200, description: 'Anomalies detected successfully' })
  @ApiResponse({ status: 400, description: 'Invalid detection parameters' })
  @ApiResponse({ status: 500, description: 'Detection failed' })
  @ApiBody({ type: AnomalyDetectionConfigDto })
  async detectAnomalies(@Body() dto: AnomalyDetectionConfigDto): Promise<any> {
    return this.analyticsService.detectAnomalies(dto);
  }

  /**
   * Analyze threat patterns
   */
  @Get('patterns/:threatCategory')
  @ApiOperation({ summary: 'Analyze threat patterns', description: 'Analyze patterns and cluster behaviors for threat category' })
  @ApiResponse({ status: 200, description: 'Pattern analysis completed' })
  @ApiResponse({ status: 404, description: 'Threat category not found' })
  @ApiParam({ name: 'threatCategory', description: 'Threat category to analyze', example: 'RANSOMWARE' })
  async analyzePatterns(@Param('threatCategory') threatCategory: string): Promise<any> {
    return this.analyticsService.analyzePatterns(threatCategory);
  }

  /**
   * Predict attack surface
   */
  @Post('attack-surface/predict')
  @ApiOperation({ summary: 'Predict attack surface', description: 'Predict attack surface exposure for target assets' })
  @ApiResponse({ status: 200, description: 'Attack surface prediction completed' })
  @ApiResponse({ status: 400, description: 'Invalid asset list' })
  @ApiBody({ type: [String], description: 'List of target asset identifiers' })
  async predictAttackSurface(@Body() targetAssets: string[]): Promise<any> {
    if (!targetAssets || targetAssets.length === 0) {
      throw new BadRequestException('Target assets list cannot be empty');
    }
    return this.analyticsService.predictAttackSurface(targetAssets);
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export default {
  service: PredictiveAnalyticsService,
  controller: PredictiveAnalyticsController,
};
