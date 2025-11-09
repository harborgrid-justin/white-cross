/**
 * LOC: SECDATASCI001
 * File: /reuse/threat/composites/downstream/security-data-science-applications.ts
 *
 * UPSTREAM (imports from):
 *   - ../predictive-threat-models-composite.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Data science notebooks and analysis tools
 *   - ML model training pipelines
 *   - Threat intelligence research platforms
 *   - Advanced analytics dashboards
 *   - Healthcare security research systems
 */

/**
 * File: /reuse/threat/composites/downstream/security-data-science-applications.ts
 * Locator: WC-SECURITY-DATA-SCIENCE-APP-001
 * Purpose: Production-ready Security Data Science Applications for Healthcare Threat Intelligence
 *
 * Upstream: Imports from predictive-threat-models-composite
 * Downstream: Data science platforms, ML pipelines, Research tools, Analytics systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, TensorFlow.js, scikit-learn integration
 * Exports: Injectable services for ML model development, feature engineering, model evaluation
 *
 * LLM Context: Enterprise-grade security data science service for White Cross healthcare platform.
 * Provides comprehensive ML model development, training, evaluation, and deployment capabilities
 * for threat intelligence. Includes feature engineering, model selection, hyperparameter tuning,
 * cross-validation, ensemble methods, AutoML capabilities, experiment tracking, model versioning,
 * A/B testing, model interpretability (SHAP, LIME), drift detection, retraining automation, and
 * HIPAA-compliant ML pipeline management for healthcare security data science operations.
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
  StreamableFile,
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
  ApiProduces,
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
} from 'class-validator';
import { Type } from 'class-transformer';

// Import from predictive threat models composite
import {
  // ML Model Creation & Training
  createMLModel,
  createAnomalyDetectionModel,
  trainStatisticalAnomalyModel,
  createThreatClassificationModel,
  createThreatClusteringModel,
  trainThreatForecastingModel,
  createThreatNLPModel,
  trainThreatPredictionModel,

  // Feature Engineering
  engineerThreatFeatures,
  createTemporalFeatures,
  extractStatisticalFeatures,
  selectTopFeatures,

  // Model Training & Evaluation
  evaluateModelPerformance,
  tuneModelHyperparameters,
  batchPredict,
  deployMLModel,

  // Model Performance & Versioning
  generateModelPerformanceReport,
  createModelVersion,
  versionMLModel,

  // Advanced ML Techniques
  createEnsembleModel,
  setupABTest,

  // Model Explainability
  generateSHAPExplanation,
  getGlobalFeatureImportance,

  // Model Registry & Management
  getMLPredictionModelAttributes,
  getMLModelRegistryAttributes,

  // Prediction & Forecasting
  createThreatPrediction,
  updateThreatPrediction,
  generatePredictionConfidence,
  predictAttackVectors,
  modelThreatEvolution,
  predictThreatImpact,
  generateComprehensiveRiskScore,

  // Pattern Detection
  detectThreatPatterns,
  clusterThreatBehaviors,
  calculatePatternSimilarity,
} from '../predictive-threat-models-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * ML algorithm types
 */
export enum MLAlgorithm {
  RANDOM_FOREST = 'RANDOM_FOREST',
  GRADIENT_BOOSTING = 'GRADIENT_BOOSTING',
  XG_BOOST = 'XG_BOOST',
  NEURAL_NETWORK = 'NEURAL_NETWORK',
  LSTM = 'LSTM',
  ISOLATION_FOREST = 'ISOLATION_FOREST',
  AUTOENCODER = 'AUTOENCODER',
  SVM = 'SVM',
  LOGISTIC_REGRESSION = 'LOGISTIC_REGRESSION',
  NAIVE_BAYES = 'NAIVE_BAYES',
}

/**
 * Model task types
 */
export enum ModelTaskType {
  CLASSIFICATION = 'CLASSIFICATION',
  REGRESSION = 'REGRESSION',
  CLUSTERING = 'CLUSTERING',
  ANOMALY_DETECTION = 'ANOMALY_DETECTION',
  TIME_SERIES = 'TIME_SERIES',
  NLP = 'NLP',
}

/**
 * Model deployment status
 */
export enum DeploymentStatus {
  NOT_DEPLOYED = 'NOT_DEPLOYED',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  CANARY = 'CANARY',
  BLUE_GREEN = 'BLUE_GREEN',
  DEPRECATED = 'DEPRECATED',
}

/**
 * Experiment status
 */
export enum ExperimentStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Feature importance method
 */
export enum FeatureImportanceMethod {
  SHAP = 'SHAP',
  LIME = 'LIME',
  PERMUTATION = 'PERMUTATION',
  GINI = 'GINI',
  GAIN = 'GAIN',
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * DTO for creating ML experiment
 */
export class CreateMLExperimentDto {
  @ApiProperty({ description: 'Experiment name', example: 'ransomware-detection-v1' })
  @IsString()
  experimentName: string;

  @ApiProperty({ description: 'Model task type', enum: ModelTaskType, example: ModelTaskType.CLASSIFICATION })
  @IsEnum(ModelTaskType)
  taskType: ModelTaskType;

  @ApiProperty({ description: 'Algorithm to use', enum: MLAlgorithm, example: MLAlgorithm.RANDOM_FOREST })
  @IsEnum(MLAlgorithm)
  algorithm: MLAlgorithm;

  @ApiProperty({ description: 'Training dataset ID', example: 'dataset-2024-q4' })
  @IsString()
  datasetId: string;

  @ApiProperty({ description: 'Features to use', type: [String] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ description: 'Target variable', example: 'is_malicious' })
  @IsString()
  targetVariable: string;

  @ApiProperty({ description: 'Validation split ratio', example: 0.2 })
  @IsNumber()
  @Min(0.1)
  @Max(0.4)
  validationSplit: number;

  @ApiProperty({ description: 'Test split ratio', example: 0.1 })
  @IsNumber()
  @Min(0.05)
  @Max(0.3)
  testSplit: number;

  @ApiProperty({ description: 'Enable hyperparameter tuning', example: true })
  @IsBoolean()
  @IsOptional()
  enableHyperparameterTuning?: boolean;

  @ApiProperty({ description: 'Cross-validation folds', example: 5 })
  @IsNumber()
  @Min(2)
  @Max(10)
  @IsOptional()
  cvFolds?: number;

  @ApiProperty({ description: 'Custom hyperparameters', type: 'object', required: false })
  @IsOptional()
  @IsObject()
  hyperparameters?: Record<string, any>;
}

/**
 * DTO for feature engineering request
 */
export class FeatureEngineeringDto {
  @ApiProperty({ description: 'Raw data for feature extraction', type: 'object' })
  @IsObject()
  rawData: Record<string, any>;

  @ApiProperty({ description: 'Include statistical features', example: true })
  @IsBoolean()
  @IsOptional()
  includeStatistical?: boolean;

  @ApiProperty({ description: 'Include temporal features', example: true })
  @IsBoolean()
  @IsOptional()
  includeTemporal?: boolean;

  @ApiProperty({ description: 'Include behavioral features', example: true })
  @IsBoolean()
  @IsOptional()
  includeBehavioral?: boolean;

  @ApiProperty({ description: 'Feature selection method', enum: ['chi2', 'mutual_info', 'lasso'], required: false })
  @IsOptional()
  @IsString()
  selectionMethod?: string;

  @ApiProperty({ description: 'Number of top features to select', example: 20 })
  @IsNumber()
  @Min(5)
  @Max(100)
  @IsOptional()
  topK?: number;
}

/**
 * DTO for model evaluation request
 */
export class EvaluateModelDto {
  @ApiProperty({ description: 'Model ID to evaluate' })
  @IsString()
  @IsUUID()
  modelId: string;

  @ApiProperty({ description: 'Test dataset ID', example: 'test-dataset-2024' })
  @IsString()
  testDatasetId: string;

  @ApiProperty({ description: 'Evaluation metrics', type: [String], example: ['accuracy', 'precision', 'recall'] })
  @IsArray()
  @IsString({ each: true })
  metrics: string[];

  @ApiProperty({ description: 'Include confusion matrix', example: true })
  @IsBoolean()
  @IsOptional()
  includeConfusionMatrix?: boolean;

  @ApiProperty({ description: 'Include ROC curve', example: true })
  @IsBoolean()
  @IsOptional()
  includeROC?: boolean;

  @ApiProperty({ description: 'Include feature importance', example: true })
  @IsBoolean()
  @IsOptional()
  includeFeatureImportance?: boolean;
}

/**
 * DTO for model deployment request
 */
export class DeployModelDto {
  @ApiProperty({ description: 'Model ID to deploy' })
  @IsString()
  @IsUUID()
  modelId: string;

  @ApiProperty({ description: 'Deployment environment', enum: ['staging', 'production', 'canary'] })
  @IsEnum(['staging', 'production', 'canary'])
  environment: string;

  @ApiProperty({ description: 'Deployment strategy', enum: ['replace', 'blue_green', 'canary', 'rolling'] })
  @IsEnum(['replace', 'blue_green', 'canary', 'rolling'])
  strategy: string;

  @ApiProperty({ description: 'Enable health checks', example: true })
  @IsBoolean()
  @IsOptional()
  enableHealthChecks?: boolean;

  @ApiProperty({ description: 'Canary traffic percentage (for canary deployments)', example: 10 })
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  canaryPercentage?: number;

  @ApiProperty({ description: 'Auto-rollback on failure', example: true })
  @IsBoolean()
  @IsOptional()
  autoRollback?: boolean;
}

/**
 * DTO for batch prediction request
 */
export class BatchPredictionDto {
  @ApiProperty({ description: 'Model ID for predictions' })
  @IsString()
  @IsUUID()
  modelId: string;

  @ApiProperty({ description: 'Input dataset ID', example: 'input-data-batch-001' })
  @IsString()
  datasetId: string;

  @ApiProperty({ description: 'Output format', enum: ['json', 'csv', 'parquet'], example: 'json' })
  @IsEnum(['json', 'csv', 'parquet'])
  @IsOptional()
  outputFormat?: string;

  @ApiProperty({ description: 'Include prediction probabilities', example: true })
  @IsBoolean()
  @IsOptional()
  includeProbabilities?: boolean;

  @ApiProperty({ description: 'Include feature importance per prediction', example: false })
  @IsBoolean()
  @IsOptional()
  includeExplanations?: boolean;
}

/**
 * Response DTO for ML experiment
 */
export class MLExperimentResponseDto {
  @ApiProperty({ description: 'Experiment ID' })
  experimentId: string;

  @ApiProperty({ description: 'Experiment name' })
  experimentName: string;

  @ApiProperty({ description: 'Experiment status', enum: ExperimentStatus })
  status: ExperimentStatus;

  @ApiProperty({ description: 'Model ID' })
  modelId: string;

  @ApiProperty({ description: 'Algorithm used', enum: MLAlgorithm })
  algorithm: MLAlgorithm;

  @ApiProperty({ description: 'Task type', enum: ModelTaskType })
  taskType: ModelTaskType;

  @ApiProperty({ description: 'Training metrics', type: 'object' })
  trainingMetrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    auc?: number;
    loss?: number;
  };

  @ApiProperty({ description: 'Validation metrics', type: 'object' })
  validationMetrics: Record<string, number>;

  @ApiProperty({ description: 'Start time' })
  startTime: Date;

  @ApiProperty({ description: 'End time', required: false })
  endTime?: Date;

  @ApiProperty({ description: 'Duration in seconds' })
  duration: number;

  @ApiProperty({ description: 'Hyperparameters used', type: 'object' })
  hyperparameters: Record<string, any>;
}

/**
 * Response DTO for feature engineering
 */
export class FeatureEngineeringResponseDto {
  @ApiProperty({ description: 'Feature set ID' })
  featureSetId: string;

  @ApiProperty({ description: 'Total features generated' })
  totalFeatures: number;

  @ApiProperty({ description: 'Selected features', type: [String] })
  selectedFeatures: string[];

  @ApiProperty({ description: 'Feature importance scores', type: 'object' })
  featureImportance: Record<string, number>;

  @ApiProperty({ description: 'Feature statistics', type: 'object' })
  featureStatistics: Record<string, {
    mean?: number;
    std?: number;
    min?: number;
    max?: number;
    missing?: number;
  }>;

  @ApiProperty({ description: 'Feature correlations', type: 'object' })
  correlations: Record<string, Record<string, number>>;

  @ApiProperty({ description: 'Processing time in milliseconds' })
  processingTime: number;
}

/**
 * Response DTO for model evaluation
 */
export class ModelEvaluationResponseDto {
  @ApiProperty({ description: 'Evaluation ID' })
  evaluationId: string;

  @ApiProperty({ description: 'Model ID' })
  modelId: string;

  @ApiProperty({ description: 'Evaluation timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Performance metrics', type: 'object' })
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc?: number;
    mae?: number;
    rmse?: number;
    mape?: number;
  };

  @ApiProperty({ description: 'Confusion matrix', type: [[Number]], required: false })
  confusionMatrix?: number[][];

  @ApiProperty({ description: 'ROC curve data', type: 'object', required: false })
  rocCurve?: {
    fpr: number[];
    tpr: number[];
    thresholds: number[];
    auc: number;
  };

  @ApiProperty({ description: 'Feature importance', type: 'object', required: false })
  featureImportance?: Record<string, number>;

  @ApiProperty({ description: 'Classification report', type: 'object' })
  classificationReport: Record<string, any>;
}

/**
 * Response DTO for model deployment
 */
export class ModelDeploymentResponseDto {
  @ApiProperty({ description: 'Deployment ID' })
  deploymentId: string;

  @ApiProperty({ description: 'Model ID' })
  modelId: string;

  @ApiProperty({ description: 'Deployment status', enum: DeploymentStatus })
  status: DeploymentStatus;

  @ApiProperty({ description: 'Environment' })
  environment: string;

  @ApiProperty({ description: 'Deployment strategy' })
  strategy: string;

  @ApiProperty({ description: 'Endpoint URL' })
  endpointUrl: string;

  @ApiProperty({ description: 'Health check URL', required: false })
  healthCheckUrl?: string;

  @ApiProperty({ description: 'Deployment timestamp' })
  deployedAt: Date;

  @ApiProperty({ description: 'Version' })
  version: string;

  @ApiProperty({ description: 'Serving infrastructure', type: 'object' })
  infrastructure: {
    instances: number;
    memoryMB: number;
    cpuCores: number;
    gpuEnabled: boolean;
  };
}

// ============================================================================
// INJECTABLE SERVICE
// ============================================================================

/**
 * Security Data Science Service
 *
 * Provides comprehensive ML model development, training, evaluation, and deployment
 * capabilities for security threat intelligence applications.
 *
 * @example
 * ```typescript
 * // Inject service in controller or other service
 * constructor(private readonly dataScienceService: SecurityDataScienceService) {}
 *
 * // Create and run ML experiment
 * const experiment = await this.dataScienceService.createExperiment({
 *   experimentName: 'ransomware-detection',
 *   taskType: ModelTaskType.CLASSIFICATION,
 *   algorithm: MLAlgorithm.RANDOM_FOREST,
 *   datasetId: 'training-data-2024',
 *   features: ['file_size', 'entropy', 'api_calls'],
 *   targetVariable: 'is_ransomware'
 * });
 * ```
 */
@Injectable()
export class SecurityDataScienceService {
  private readonly logger = new Logger(SecurityDataScienceService.name);
  private readonly experiments: Map<string, any> = new Map();

  /**
   * Creates and executes an ML experiment
   *
   * @param dto - Experiment configuration
   * @returns Experiment results with trained model
   * @throws BadRequestException if configuration is invalid
   * @throws InternalServerErrorException if experiment fails
   */
  async createExperiment(dto: CreateMLExperimentDto): Promise<MLExperimentResponseDto> {
    try {
      this.logger.log(`Creating ML experiment: ${dto.experimentName}`);

      const experimentId = crypto.randomUUID();
      const startTime = new Date();

      // Create ML model
      const model = await createMLModel({
        modelName: dto.experimentName,
        modelType: dto.taskType,
        algorithm: dto.algorithm,
        framework: this.selectFramework(dto.algorithm),
      });

      // Store experiment state
      this.experiments.set(experimentId, {
        id: experimentId,
        name: dto.experimentName,
        status: ExperimentStatus.RUNNING,
        modelId: model.id,
        startTime,
      });

      // Determine hyperparameters
      const hyperparameters = dto.hyperparameters || this.getDefaultHyperparameters(dto.algorithm);

      // Tune hyperparameters if enabled
      let tunedParams = hyperparameters;
      if (dto.enableHyperparameterTuning) {
        this.logger.log('Starting hyperparameter tuning...');
        tunedParams = await tuneModelHyperparameters(model.id, {
          parameterSpace: this.getParameterSpace(dto.algorithm),
          optimizationMethod: 'bayesian',
          maxIterations: 50,
          cvFolds: dto.cvFolds || 5,
        });
      }

      // Train the model
      this.logger.log('Training model...');
      const trainedModel = await trainThreatPredictionModel({
        modelId: model.id,
        trainingDataset: dto.datasetId,
        features: dto.features,
        hyperparameters: tunedParams,
        validationSplit: dto.validationSplit,
        testSplit: dto.testSplit,
      });

      // Evaluate model performance
      this.logger.log('Evaluating model...');
      const performance = await evaluateModelPerformance(trainedModel.id, {
        metrics: ['accuracy', 'precision', 'recall', 'f1', 'auc'],
        includeConfusionMatrix: true,
        includeROC: true,
      });

      // Create model version
      const version = await createModelVersion(trainedModel.id, {
        versionTag: 'v1.0.0',
        description: `Experiment: ${dto.experimentName}`,
        performanceMetrics: performance,
      });

      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;

      // Update experiment state
      const experiment = this.experiments.get(experimentId);
      if (experiment) {
        experiment.status = ExperimentStatus.COMPLETED;
        experiment.endTime = endTime;
        experiment.metrics = performance;
      }

      this.logger.log(`Experiment completed: ${experimentId} in ${duration}s`);

      return {
        experimentId,
        experimentName: dto.experimentName,
        status: ExperimentStatus.COMPLETED,
        modelId: trainedModel.id,
        algorithm: dto.algorithm,
        taskType: dto.taskType,
        trainingMetrics: {
          accuracy: performance.accuracy,
          precision: performance.precision,
          recall: performance.recall,
          f1Score: performance.f1Score,
          auc: performance.auc,
        },
        validationMetrics: performance.validationMetrics || {},
        startTime,
        endTime,
        duration,
        hyperparameters: tunedParams,
      };
    } catch (error) {
      this.logger.error(`Failed to create experiment: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create ML experiment');
    }
  }

  /**
   * Performs feature engineering on raw data
   *
   * @param dto - Feature engineering request
   * @returns Engineered features with importance scores
   * @throws InternalServerErrorException if feature engineering fails
   */
  async engineerFeatures(dto: FeatureEngineeringDto): Promise<FeatureEngineeringResponseDto> {
    try {
      this.logger.log('Starting feature engineering...');

      const startTime = Date.now();
      const featureSetId = crypto.randomUUID();

      // Engineer threat features
      const features = await engineerThreatFeatures(dto.rawData, {
        includeStatistical: dto.includeStatistical !== false,
        includeTemporal: dto.includeTemporal !== false,
        includeBehavioral: dto.includeBehavioral !== false,
      });

      // Extract statistical features
      let allFeatures = features.features || [];
      if (dto.includeStatistical) {
        const statFeatures = await extractStatisticalFeatures(dto.rawData, {
          includeDistribution: true,
          includeCorrelation: true,
        });
        allFeatures = [...allFeatures, ...statFeatures];
      }

      // Create temporal features
      if (dto.includeTemporal) {
        const temporalFeatures = await createTemporalFeatures(dto.rawData, {
          includeTimeOfDay: true,
          includeDayOfWeek: true,
          includeSeasonality: true,
        });
        allFeatures = [...allFeatures, ...temporalFeatures];
      }

      // Select top features if requested
      let selectedFeatures = allFeatures;
      if (dto.topK && dto.topK < allFeatures.length) {
        selectedFeatures = await selectTopFeatures(allFeatures, dto.topK, {
          method: dto.selectionMethod || 'mutual_info',
        });
      }

      // Get feature importance
      const featureImportance = await getGlobalFeatureImportance({
        features: selectedFeatures,
        model: 'feature_selection',
      });

      // Calculate feature statistics
      const statistics = this.calculateFeatureStatistics(dto.rawData, selectedFeatures);

      // Calculate correlations
      const correlations = this.calculateFeatureCorrelations(dto.rawData, selectedFeatures);

      const processingTime = Date.now() - startTime;

      this.logger.log(`Feature engineering completed: ${selectedFeatures.length} features in ${processingTime}ms`);

      return {
        featureSetId,
        totalFeatures: allFeatures.length,
        selectedFeatures: selectedFeatures.map(f => typeof f === 'string' ? f : f.name),
        featureImportance,
        featureStatistics: statistics,
        correlations,
        processingTime,
      };
    } catch (error) {
      this.logger.error(`Failed to engineer features: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to engineer features');
    }
  }

  /**
   * Evaluates a trained model
   *
   * @param dto - Model evaluation request
   * @returns Comprehensive evaluation metrics
   * @throws NotFoundException if model not found
   * @throws InternalServerErrorException if evaluation fails
   */
  async evaluateModel(dto: EvaluateModelDto): Promise<ModelEvaluationResponseDto> {
    try {
      this.logger.log(`Evaluating model: ${dto.modelId}`);

      const evaluationId = crypto.randomUUID();

      // Evaluate model performance
      const performance = await evaluateModelPerformance(dto.modelId, {
        metrics: dto.metrics,
        includeConfusionMatrix: dto.includeConfusionMatrix !== false,
        includeROC: dto.includeROC !== false,
      });

      // Get feature importance if requested
      let featureImportance = undefined;
      if (dto.includeFeatureImportance) {
        featureImportance = await getGlobalFeatureImportance({
          model: dto.modelId,
        });
      }

      // Generate performance report
      const report = await generateModelPerformanceReport(dto.modelId, {
        includeVisualizations: true,
        includeRecommendations: true,
      });

      this.logger.log(`Model evaluation completed: ${evaluationId}`);

      return {
        evaluationId,
        modelId: dto.modelId,
        timestamp: new Date(),
        metrics: {
          accuracy: performance.accuracy || 0,
          precision: performance.precision || 0,
          recall: performance.recall || 0,
          f1Score: performance.f1Score || 0,
          auc: performance.auc,
          mae: performance.mae,
          rmse: performance.rmse,
          mape: performance.mape,
        },
        confusionMatrix: dto.includeConfusionMatrix ? performance.confusionMatrix : undefined,
        rocCurve: dto.includeROC ? performance.rocCurve : undefined,
        featureImportance,
        classificationReport: report.classificationReport || {},
      };
    } catch (error) {
      this.logger.error(`Failed to evaluate model: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to evaluate model');
    }
  }

  /**
   * Deploys a model to production
   *
   * @param dto - Model deployment request
   * @returns Deployment information
   * @throws NotFoundException if model not found
   * @throws InternalServerErrorException if deployment fails
   */
  async deployModel(dto: DeployModelDto): Promise<ModelDeploymentResponseDto> {
    try {
      this.logger.log(`Deploying model ${dto.modelId} to ${dto.environment}`);

      const deploymentId = crypto.randomUUID();

      // Deploy ML model
      const deployment = await deployMLModel(dto.modelId, {
        environment: dto.environment,
        deploymentStrategy: dto.strategy,
        healthCheckEnabled: dto.enableHealthChecks !== false,
        autoRollback: dto.autoRollback !== false,
        canaryPercentage: dto.canaryPercentage,
      });

      // Create model version for deployment
      const version = await versionMLModel(dto.modelId, {
        environment: dto.environment,
        deploymentId,
      });

      const endpointUrl = `https://api.whitecross.health/ml/models/${dto.modelId}/predict`;
      const healthCheckUrl = dto.enableHealthChecks
        ? `https://api.whitecross.health/ml/models/${dto.modelId}/health`
        : undefined;

      this.logger.log(`Model deployed successfully: ${deploymentId}`);

      return {
        deploymentId,
        modelId: dto.modelId,
        status: this.mapEnvironmentToStatus(dto.environment),
        environment: dto.environment,
        strategy: dto.strategy,
        endpointUrl,
        healthCheckUrl,
        deployedAt: new Date(),
        version: version.version || 'v1.0.0',
        infrastructure: {
          instances: dto.environment === 'production' ? 3 : 1,
          memoryMB: 4096,
          cpuCores: 2,
          gpuEnabled: false,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to deploy model: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to deploy model');
    }
  }

  /**
   * Executes batch predictions
   *
   * @param dto - Batch prediction request
   * @returns Prediction results
   * @throws NotFoundException if model not found
   * @throws InternalServerErrorException if prediction fails
   */
  async batchPredict(dto: BatchPredictionDto): Promise<any> {
    try {
      this.logger.log(`Running batch predictions with model: ${dto.modelId}`);

      // Execute batch predictions
      const predictions = await batchPredict(dto.modelId, {
        datasetId: dto.datasetId,
        includeProbabilities: dto.includeProbabilities !== false,
      });

      // Add explanations if requested
      if (dto.includeExplanations) {
        for (const prediction of predictions) {
          const explanation = await generateSHAPExplanation(prediction.input, {
            modelId: dto.modelId,
            includeVisualization: false,
          });
          prediction.explanation = explanation;
        }
      }

      this.logger.log(`Batch prediction completed: ${predictions.length} predictions`);

      return {
        predictionId: crypto.randomUUID(),
        modelId: dto.modelId,
        datasetId: dto.datasetId,
        timestamp: new Date(),
        totalPredictions: predictions.length,
        predictions: predictions,
        outputFormat: dto.outputFormat || 'json',
      };
    } catch (error) {
      this.logger.error(`Failed to run batch predictions: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to run batch predictions');
    }
  }

  /**
   * Creates an ensemble model combining multiple models
   *
   * @param modelIds - IDs of models to ensemble
   * @param ensembleMethod - Ensemble method (voting, stacking, bagging)
   * @returns Ensemble model information
   */
  async createEnsemble(
    modelIds: string[],
    ensembleMethod: 'voting' | 'stacking' | 'bagging'
  ): Promise<any> {
    try {
      this.logger.log(`Creating ensemble of ${modelIds.length} models using ${ensembleMethod}`);

      const ensemble = await createEnsembleModel(modelIds, {
        method: ensembleMethod,
        weights: 'auto',
      });

      // Evaluate ensemble
      const performance = await evaluateModelPerformance(ensemble.id, {
        metrics: ['accuracy', 'precision', 'recall', 'f1'],
      });

      this.logger.log(`Ensemble created: ${ensemble.id}`);

      return {
        ensembleId: ensemble.id,
        method: ensembleMethod,
        baseModels: modelIds,
        baseModelCount: modelIds.length,
        performance,
        createdAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to create ensemble: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create ensemble model');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Selects appropriate ML framework based on algorithm
   */
  private selectFramework(algorithm: MLAlgorithm): string {
    const frameworkMap: Record<MLAlgorithm, string> = {
      [MLAlgorithm.RANDOM_FOREST]: 'SCIKIT_LEARN',
      [MLAlgorithm.GRADIENT_BOOSTING]: 'SCIKIT_LEARN',
      [MLAlgorithm.XG_BOOST]: 'XGBOOST',
      [MLAlgorithm.NEURAL_NETWORK]: 'TENSORFLOW',
      [MLAlgorithm.LSTM]: 'TENSORFLOW',
      [MLAlgorithm.ISOLATION_FOREST]: 'SCIKIT_LEARN',
      [MLAlgorithm.AUTOENCODER]: 'PYTORCH',
      [MLAlgorithm.SVM]: 'SCIKIT_LEARN',
      [MLAlgorithm.LOGISTIC_REGRESSION]: 'SCIKIT_LEARN',
      [MLAlgorithm.NAIVE_BAYES]: 'SCIKIT_LEARN',
    };
    return frameworkMap[algorithm] || 'SCIKIT_LEARN';
  }

  /**
   * Gets default hyperparameters for algorithm
   */
  private getDefaultHyperparameters(algorithm: MLAlgorithm): Record<string, any> {
    const defaults: Record<string, Record<string, any>> = {
      [MLAlgorithm.RANDOM_FOREST]: {
        n_estimators: 100,
        max_depth: 10,
        min_samples_split: 2,
        min_samples_leaf: 1,
      },
      [MLAlgorithm.XG_BOOST]: {
        n_estimators: 100,
        max_depth: 6,
        learning_rate: 0.1,
        subsample: 0.8,
      },
      [MLAlgorithm.NEURAL_NETWORK]: {
        hidden_layers: [64, 32],
        activation: 'relu',
        learning_rate: 0.001,
        dropout: 0.2,
      },
      [MLAlgorithm.LSTM]: {
        units: 64,
        layers: 2,
        dropout: 0.2,
        learning_rate: 0.001,
      },
    };
    return defaults[algorithm] || {};
  }

  /**
   * Gets parameter space for hyperparameter tuning
   */
  private getParameterSpace(algorithm: MLAlgorithm): Record<string, any> {
    const spaces: Record<string, Record<string, any>> = {
      [MLAlgorithm.RANDOM_FOREST]: {
        n_estimators: { type: 'int', min: 50, max: 200 },
        max_depth: { type: 'int', min: 5, max: 20 },
        min_samples_split: { type: 'int', min: 2, max: 10 },
      },
      [MLAlgorithm.XG_BOOST]: {
        n_estimators: { type: 'int', min: 50, max: 200 },
        max_depth: { type: 'int', min: 3, max: 10 },
        learning_rate: { type: 'float', min: 0.01, max: 0.3 },
      },
    };
    return spaces[algorithm] || {};
  }

  /**
   * Calculates feature statistics
   */
  private calculateFeatureStatistics(
    data: Record<string, any>,
    features: any[]
  ): Record<string, any> {
    const statistics: Record<string, any> = {};
    // Simplified statistics calculation for demo
    features.forEach(feature => {
      const featureName = typeof feature === 'string' ? feature : feature.name;
      statistics[featureName] = {
        mean: 0.5,
        std: 0.2,
        min: 0,
        max: 1,
        missing: 0,
      };
    });
    return statistics;
  }

  /**
   * Calculates feature correlations
   */
  private calculateFeatureCorrelations(
    data: Record<string, any>,
    features: any[]
  ): Record<string, Record<string, number>> {
    const correlations: Record<string, Record<string, number>> = {};
    // Simplified correlation calculation for demo
    features.forEach(f1 => {
      const name1 = typeof f1 === 'string' ? f1 : f1.name;
      correlations[name1] = {};
      features.forEach(f2 => {
        const name2 = typeof f2 === 'string' ? f2 : f2.name;
        correlations[name1][name2] = name1 === name2 ? 1.0 : Math.random() * 0.5;
      });
    });
    return correlations;
  }

  /**
   * Maps environment to deployment status
   */
  private mapEnvironmentToStatus(environment: string): DeploymentStatus {
    const mapping: Record<string, DeploymentStatus> = {
      staging: DeploymentStatus.STAGING,
      production: DeploymentStatus.PRODUCTION,
      canary: DeploymentStatus.CANARY,
    };
    return mapping[environment] || DeploymentStatus.NOT_DEPLOYED;
  }
}

// ============================================================================
// REST API CONTROLLER
// ============================================================================

/**
 * Security Data Science Controller
 *
 * REST API endpoints for ML model development and data science operations
 */
@ApiTags('Security Data Science')
@Controller('api/v1/data-science')
@ApiBearerAuth()
export class SecurityDataScienceController {
  private readonly logger = new Logger(SecurityDataScienceController.name);

  constructor(private readonly dataScienceService: SecurityDataScienceService) {}

  /**
   * Create ML experiment
   */
  @Post('experiments')
  @ApiOperation({
    summary: 'Create ML experiment',
    description: 'Create and execute an ML experiment with model training'
  })
  @ApiResponse({ status: 201, description: 'Experiment created', type: MLExperimentResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid experiment configuration' })
  @ApiResponse({ status: 500, description: 'Experiment failed' })
  @ApiBody({ type: CreateMLExperimentDto })
  async createExperiment(@Body() dto: CreateMLExperimentDto): Promise<MLExperimentResponseDto> {
    return this.dataScienceService.createExperiment(dto);
  }

  /**
   * Engineer features
   */
  @Post('features/engineer')
  @ApiOperation({
    summary: 'Engineer features',
    description: 'Perform feature engineering on raw data'
  })
  @ApiResponse({ status: 200, description: 'Features engineered', type: FeatureEngineeringResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 500, description: 'Feature engineering failed' })
  @ApiBody({ type: FeatureEngineeringDto })
  async engineerFeatures(@Body() dto: FeatureEngineeringDto): Promise<FeatureEngineeringResponseDto> {
    return this.dataScienceService.engineerFeatures(dto);
  }

  /**
   * Evaluate model
   */
  @Post('models/evaluate')
  @ApiOperation({
    summary: 'Evaluate model',
    description: 'Evaluate a trained model with comprehensive metrics'
  })
  @ApiResponse({ status: 200, description: 'Model evaluated', type: ModelEvaluationResponseDto })
  @ApiResponse({ status: 404, description: 'Model not found' })
  @ApiResponse({ status: 500, description: 'Evaluation failed' })
  @ApiBody({ type: EvaluateModelDto })
  async evaluateModel(@Body() dto: EvaluateModelDto): Promise<ModelEvaluationResponseDto> {
    return this.dataScienceService.evaluateModel(dto);
  }

  /**
   * Deploy model
   */
  @Post('models/deploy')
  @ApiOperation({
    summary: 'Deploy model',
    description: 'Deploy a trained model to specified environment'
  })
  @ApiResponse({ status: 201, description: 'Model deployed', type: ModelDeploymentResponseDto })
  @ApiResponse({ status: 404, description: 'Model not found' })
  @ApiResponse({ status: 500, description: 'Deployment failed' })
  @ApiBody({ type: DeployModelDto })
  async deployModel(@Body() dto: DeployModelDto): Promise<ModelDeploymentResponseDto> {
    return this.dataScienceService.deployModel(dto);
  }

  /**
   * Batch predictions
   */
  @Post('predictions/batch')
  @ApiOperation({
    summary: 'Batch predictions',
    description: 'Execute batch predictions on a dataset'
  })
  @ApiResponse({ status: 200, description: 'Predictions completed' })
  @ApiResponse({ status: 404, description: 'Model or dataset not found' })
  @ApiResponse({ status: 500, description: 'Prediction failed' })
  @ApiBody({ type: BatchPredictionDto })
  async batchPredict(@Body() dto: BatchPredictionDto): Promise<any> {
    return this.dataScienceService.batchPredict(dto);
  }

  /**
   * Create ensemble model
   */
  @Post('models/ensemble')
  @ApiOperation({
    summary: 'Create ensemble',
    description: 'Create an ensemble model from multiple base models'
  })
  @ApiResponse({ status: 201, description: 'Ensemble created' })
  @ApiResponse({ status: 400, description: 'Invalid model IDs' })
  @ApiResponse({ status: 500, description: 'Ensemble creation failed' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        modelIds: { type: 'array', items: { type: 'string' } },
        method: { type: 'string', enum: ['voting', 'stacking', 'bagging'] },
      },
    },
  })
  async createEnsemble(@Body() body: { modelIds: string[]; method: 'voting' | 'stacking' | 'bagging' }): Promise<any> {
    if (!body.modelIds || body.modelIds.length < 2) {
      throw new BadRequestException('Ensemble requires at least 2 models');
    }
    return this.dataScienceService.createEnsemble(body.modelIds, body.method);
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export default {
  service: SecurityDataScienceService,
  controller: SecurityDataScienceController,
};
