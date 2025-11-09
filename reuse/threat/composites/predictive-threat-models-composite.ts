/**
 * LOC: THREATPRED1234567
 * File: /reuse/threat/composites/predictive-threat-models-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-prediction-forecasting-kit
 *   - ../threat-intelligence-ml-models-kit
 *   - ../threat-scoring-kit
 *   - ../threat-assessment-kit
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Predictive analytics services
 *   - ML model management services
 *   - Threat forecasting modules
 *   - Advanced threat intelligence platforms
 *   - Security data science applications
 */

/**
 * File: /reuse/threat/composites/predictive-threat-models-composite.ts
 * Locator: WC-THREAT-PREDICTIVE-COMPOSITE-001
 * Purpose: Comprehensive Predictive Threat Models Composite - ML-based threat prediction and forecasting
 *
 * Upstream: Composes functions from threat-prediction-forecasting-kit, threat-intelligence-ml-models-kit,
 *           threat-scoring-kit, threat-assessment-kit
 * Downstream: ../backend/*, ML services, Predictive analytics, Threat forecasting, Advanced threat intelligence
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, ML libraries
 * Exports: 45+ utility functions for ML models, predictive analytics, threat forecasting, anomaly detection
 *
 * LLM Context: Enterprise-grade predictive threat modeling composite for White Cross healthcare platform.
 * Provides comprehensive ML-based threat prediction, forecasting models, anomaly detection, pattern recognition,
 * threat evolution modeling, attack timing prediction, statistical analysis, behavioral analytics, and
 * HIPAA-compliant advanced threat intelligence for healthcare systems. Includes Sequelize models for ML
 * predictions, forecasts, patterns, anomalies, and model versioning.
 */

// ============================================================================
// IMPORTS - Composed from existing threat intelligence kits
// ============================================================================

import {
  // Sequelize Model Attributes
  getThreatPredictionModelAttributes,
  getThreatForecastModelAttributes,
  getThreatPatternModelAttributes,
  getAnomalyDetectionModelAttributes,
  getMLModelAttributes,
  getThreatIntelligenceModelAttributes,

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
} from '../threat-prediction-forecasting-kit';

import {
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
} from '../threat-intelligence-ml-models-kit';

import {
  // Scoring Functions
  calculateThreatScore,
  calculateSeverityScore,
  calculateImpactScore,
  calculateLikelihoodScore,
  calculateConfidenceScore,
  calculateRiskScore,
  calculateContextualRisk,

  // Confidence & Reliability
  computeConfidenceMetrics,
  calculateSourceReliability,
  aggregateIndicatorConfidence,

  // Normalization & Aggregation
  normalizeScore,
  aggregateCompositeScore,
  calculateWeightedAverage,
} from '../threat-scoring-kit';

import {
  // Threat Analysis
  identifyThreat,
  classifyThreat,
  categorizeThreatByFramework,

  // Threat Actor Analysis
  profileThreatActor as assessThreatActorProfile,
  analyzeThreatActorMotivation,
  attributeThreatToActor,
  getThreatActorCapabilities,

  // Attack Vector Analysis
  analyzeAttackVector,
  mapAttackPath,
  identifyEntryPoints,
  analyzeAttackTechniques,

  // Threat Severity & Impact
  calculateThreatSeverityScore,
  evaluateThreatImpact,
  calculateExploitabilityScore,

  // Threat Intelligence
  enrichThreatIntelligence,
  validateThreatIntelligence,
  queryThreatIntelligenceFeeds,
} from '../threat-assessment-kit';

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES - ML Prediction Models
// ============================================================================

/**
 * ML prediction model for storing threat predictions with confidence scores.
 * Tracks predicted threats, their likelihood, impact, and temporal forecasts.
 *
 * @example
 * ```typescript
 * class MLThreatPrediction extends Model {}
 * MLThreatPrediction.init(getMLPredictionModelAttributes(), {
 *   sequelize,
 *   tableName: 'ml_threat_predictions',
 *   timestamps: true,
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['predictionType', 'confidence'] },
 *     { fields: ['threatCategory', 'status'] },
 *     { fields: ['predictedDate', 'actualDate'] },
 *     { fields: ['modelId', 'modelVersion'] }
 *   ]
 * });
 * ```
 */
export const getMLPredictionModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  predictionId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
    comment: 'Unique prediction identifier',
  },
  modelId: {
    type: 'UUID',
    allowNull: false,
    comment: 'Reference to ML model used',
  },
  modelVersion: {
    type: 'STRING',
    allowNull: false,
    comment: 'Version of model at prediction time',
  },
  predictionType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Type: THREAT_EMERGENCE, ATTACK_TIMING, VECTOR_PREDICTION, ACTOR_BEHAVIOR',
  },
  threatCategory: {
    type: 'STRING',
    allowNull: false,
    comment: 'Predicted threat category',
  },
  threatDescription: {
    type: 'TEXT',
    allowNull: false,
  },
  confidence: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 1.0,
    },
    comment: 'Prediction confidence (0.0-1.0)',
  },
  likelihood: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 1.0,
    },
    comment: 'Predicted likelihood (0.0-1.0)',
  },
  impact: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 10.0,
    },
    comment: 'Predicted impact score (0-10)',
  },
  severity: {
    type: 'STRING',
    allowNull: false,
    comment: 'Severity: CRITICAL, HIGH, MEDIUM, LOW',
  },
  predictedDate: {
    type: 'DATE',
    allowNull: false,
    comment: 'When threat is predicted to occur',
  },
  predictionWindow: {
    type: 'INTEGER',
    allowNull: false,
    comment: 'Prediction window in hours',
  },
  actualDate: {
    type: 'DATE',
    allowNull: true,
    comment: 'When threat actually occurred (for validation)',
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'PENDING',
    comment: 'Status: PENDING, CONFIRMED, FALSE_POSITIVE, EXPIRED',
  },
  attackVectors: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Predicted attack vectors',
  },
  targetAssets: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Predicted target assets',
  },
  indicators: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Leading indicators detected',
  },
  features: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Feature values used for prediction',
  },
  featureImportance: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Feature importance scores',
  },
  modelMetrics: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Model performance metrics at prediction time',
  },
  validationScore: {
    type: 'FLOAT',
    allowNull: true,
    comment: 'Validation score after actual outcome',
  },
  feedbackProvided: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  mitigationActions: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Recommended mitigation actions',
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
  deletedAt: {
    type: 'DATE',
    allowNull: true,
  },
});

/**
 * Threat forecast model for time-series predictions and trend analysis.
 * Tracks threat evolution over time with predictive analytics.
 *
 * @example
 * ```typescript
 * class ThreatForecast extends Model {}
 * ThreatForecast.init(getThreatForecastingModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_forecasts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['forecastPeriod', 'forecastType'] },
 *     { fields: ['confidenceInterval', 'accuracy'] },
 *     { fields: ['startDate', 'endDate'] }
 *   ]
 * });
 * ```
 */
export const getThreatForecastingModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  forecastId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  forecastType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Type: ATTACK_VOLUME, THREAT_EVOLUTION, SEASONAL_PATTERN, GEOGRAPHIC_SPREAD',
  },
  modelType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Model: ARIMA, LSTM, PROPHET, ENSEMBLE',
  },
  threatCategory: {
    type: 'STRING',
    allowNull: false,
  },
  startDate: {
    type: 'DATE',
    allowNull: false,
  },
  endDate: {
    type: 'DATE',
    allowNull: false,
  },
  forecastPeriod: {
    type: 'INTEGER',
    allowNull: false,
    comment: 'Forecast period in days',
  },
  granularity: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'DAILY',
    comment: 'Granularity: HOURLY, DAILY, WEEKLY, MONTHLY',
  },
  predictions: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
    comment: 'Array of time-series predictions',
  },
  confidenceInterval: {
    type: 'FLOAT',
    allowNull: false,
    defaultValue: 0.95,
    comment: 'Statistical confidence interval',
  },
  upperBound: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Upper confidence bounds',
  },
  lowerBound: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Lower confidence bounds',
  },
  trendDirection: {
    type: 'STRING',
    allowNull: false,
    comment: 'Direction: INCREASING, DECREASING, STABLE, VOLATILE',
  },
  trendStrength: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 1.0,
    },
  },
  seasonalityDetected: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  seasonalPattern: {
    type: 'JSONB',
    allowNull: true,
    comment: 'Detected seasonal patterns',
  },
  anomalyThreshold: {
    type: 'FLOAT',
    allowNull: false,
    defaultValue: 2.0,
    comment: 'Standard deviations for anomaly detection',
  },
  detectedAnomalies: {
    type: 'JSONB',
    defaultValue: [],
  },
  accuracy: {
    type: 'FLOAT',
    allowNull: true,
    comment: 'Forecast accuracy when validated',
  },
  rmse: {
    type: 'FLOAT',
    allowNull: true,
    comment: 'Root Mean Squared Error',
  },
  mae: {
    type: 'FLOAT',
    allowNull: true,
    comment: 'Mean Absolute Error',
  },
  trainingDataPoints: {
    type: 'INTEGER',
    allowNull: false,
  },
  features: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Features used in forecasting',
  },
  exogenousVariables: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'External variables influencing forecast',
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'ACTIVE',
    comment: 'Status: ACTIVE, VALIDATED, EXPIRED, SUPERSEDED',
  },
  validationDate: {
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
 * Anomaly detection model for behavioral analytics and outlier detection.
 * Tracks anomalous patterns and deviations from established baselines.
 *
 * @example
 * ```typescript
 * class ThreatAnomaly extends Model {}
 * ThreatAnomaly.init(getThreatAnomalyModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_anomalies',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['anomalyType', 'severity'] },
 *     { fields: ['detectionMethod', 'confidence'] },
 *     { fields: ['detectedAt', 'resolvedAt'] }
 *   ]
 * });
 * ```
 */
export const getThreatAnomalyModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  anomalyId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  anomalyType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Type: BEHAVIORAL, STATISTICAL, TEMPORAL, VOLUMETRIC, PATTERN',
  },
  detectionMethod: {
    type: 'STRING',
    allowNull: false,
    comment: 'Method: ISOLATION_FOREST, AUTOENCODER, STATISTICAL, ENSEMBLE',
  },
  entityType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Entity: USER, SYSTEM, NETWORK, APPLICATION, DATA',
  },
  entityId: {
    type: 'STRING',
    allowNull: false,
  },
  detectedAt: {
    type: 'DATE',
    allowNull: false,
  },
  anomalyScore: {
    type: 'FLOAT',
    allowNull: false,
    comment: 'Anomaly score (higher = more anomalous)',
  },
  deviationScore: {
    type: 'FLOAT',
    allowNull: false,
    comment: 'Standard deviations from baseline',
  },
  confidence: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 1.0,
    },
  },
  severity: {
    type: 'STRING',
    allowNull: false,
    comment: 'Severity: CRITICAL, HIGH, MEDIUM, LOW',
  },
  baselineId: {
    type: 'UUID',
    allowNull: false,
    comment: 'Reference to baseline used',
  },
  baselineValue: {
    type: 'FLOAT',
    allowNull: false,
  },
  observedValue: {
    type: 'FLOAT',
    allowNull: false,
  },
  deviation: {
    type: 'FLOAT',
    allowNull: false,
  },
  features: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Feature values at detection',
  },
  contributingFactors: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Factors contributing to anomaly',
  },
  context: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Contextual information',
  },
  falsePositiveProbability: {
    type: 'FLOAT',
    allowNull: false,
    defaultValue: 0.0,
  },
  isFalsePositive: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'NEW',
    comment: 'Status: NEW, INVESTIGATING, CONFIRMED, FALSE_POSITIVE, RESOLVED',
  },
  investigationNotes: {
    type: 'TEXT',
    allowNull: true,
  },
  resolvedAt: {
    type: 'DATE',
    allowNull: true,
  },
  resolvedBy: {
    type: 'UUID',
    allowNull: true,
  },
  resolution: {
    type: 'TEXT',
    allowNull: true,
  },
  relatedThreats: {
    type: 'JSONB',
    defaultValue: [],
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
 * ML model registry for tracking model versions, performance, and deployment.
 * Maintains complete lifecycle of predictive models.
 *
 * @example
 * ```typescript
 * class MLModelRegistry extends Model {}
 * MLModelRegistry.init(getMLModelRegistryAttributes(), {
 *   sequelize,
 *   tableName: 'ml_model_registry',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['modelName', 'version'] },
 *     { fields: ['status', 'deploymentStatus'] },
 *     { fields: ['modelType', 'algorithm'] }
 *   ]
 * });
 * ```
 */
export const getMLModelRegistryAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  modelId: {
    type: 'UUID',
    allowNull: false,
    unique: true,
  },
  modelName: {
    type: 'STRING',
    allowNull: false,
  },
  version: {
    type: 'STRING',
    allowNull: false,
  },
  modelType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Type: CLASSIFICATION, REGRESSION, CLUSTERING, ANOMALY_DETECTION, TIME_SERIES',
  },
  algorithm: {
    type: 'STRING',
    allowNull: false,
    comment: 'Algorithm: RANDOM_FOREST, LSTM, ISOLATION_FOREST, etc.',
  },
  framework: {
    type: 'STRING',
    allowNull: false,
    comment: 'Framework: TENSORFLOW, PYTORCH, SCIKIT_LEARN, PROPHET',
  },
  purpose: {
    type: 'TEXT',
    allowNull: false,
  },
  trainingDataset: {
    type: 'JSONB',
    allowNull: false,
    comment: 'Training dataset metadata',
  },
  trainingDate: {
    type: 'DATE',
    allowNull: false,
  },
  trainingDuration: {
    type: 'INTEGER',
    allowNull: false,
    comment: 'Training duration in seconds',
  },
  hyperparameters: {
    type: 'JSONB',
    allowNull: false,
  },
  features: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
  },
  featureImportance: {
    type: 'JSONB',
    defaultValue: {},
  },
  performanceMetrics: {
    type: 'JSONB',
    allowNull: false,
    comment: 'Accuracy, precision, recall, F1, etc.',
  },
  validationMetrics: {
    type: 'JSONB',
    allowNull: false,
  },
  testMetrics: {
    type: 'JSONB',
    allowNull: true,
  },
  modelArtifactPath: {
    type: 'TEXT',
    allowNull: false,
    comment: 'Path to serialized model',
  },
  modelSize: {
    type: 'BIGINT',
    allowNull: false,
    comment: 'Model size in bytes',
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'TRAINING',
    comment: 'Status: TRAINING, VALIDATED, APPROVED, RETIRED',
  },
  deploymentStatus: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'NOT_DEPLOYED',
    comment: 'Deployment: NOT_DEPLOYED, STAGING, PRODUCTION, DEPRECATED',
  },
  deploymentDate: {
    type: 'DATE',
    allowNull: true,
  },
  predictionCount: {
    type: 'BIGINT',
    defaultValue: 0,
    comment: 'Total predictions made',
  },
  averageInferenceTime: {
    type: 'FLOAT',
    allowNull: true,
    comment: 'Average inference time in ms',
  },
  driftDetected: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  driftScore: {
    type: 'FLOAT',
    allowNull: true,
  },
  lastDriftCheck: {
    type: 'DATE',
    allowNull: true,
  },
  retrainingSchedule: {
    type: 'STRING',
    allowNull: true,
    comment: 'Cron expression for retraining',
  },
  nextRetrainingDate: {
    type: 'DATE',
    allowNull: true,
  },
  approvedBy: {
    type: 'UUID',
    allowNull: true,
  },
  approvalDate: {
    type: 'DATE',
    allowNull: true,
  },
  notes: {
    type: 'TEXT',
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

// ============================================================================
// RE-EXPORTED FUNCTIONS - Composed from source kits
// ============================================================================

// Prediction Functions
export {
  createThreatPrediction,
  updateThreatPrediction,
  generatePredictionConfidence,
  predictAttackVectors,
  modelThreatEvolution,
  predictThreatImpact,
  generateComprehensiveRiskScore,
};

// Forecasting Functions
export {
  forecastAttackTiming,
  analyzeThreatTrends,
  identifyEmergingThreats,
  trackThreatEvolution,
  detectSeasonalPatterns,
  calculateThreatVelocity,
  analyzeGeographicDistribution,
  analyzeIndustryTrends,
};

// Attack Prediction Functions
export {
  calculateAttackProbability,
  predictAttackSurfaceExposure,
  estimateExploitationLikelihood,
  estimateTimeToAttack,
  scoreTargetAttractiveness,
};

// Threat Actor & Campaign Prediction
export {
  profileThreatActor,
  predictCampaignProgression,
};

// Pattern Detection Functions
export {
  detectThreatPatterns,
  matchThreatPatternAlgorithm,
  clusterThreatBehaviors,
  reconstructAttackChain,
  matchMITREAttackTTP,
  calculatePatternSimilarity,
  managePatternLibrary,
};

// Anomaly Detection Functions
export {
  establishBehaviorBaseline,
  detectStatisticalAnomaly,
  detectMLBasedAnomaly,
  scoreBehavioralAnomaly,
  classifyAnomaly,
  reduceFalsePositives,
};

// ML Model Management
export {
  trainThreatPredictionModel,
  deployMLModel,
  extractThreatFeatures,
  evaluateModelPerformance,
  tuneModelHyperparameters,
  versionMLModel,
  batchPredict,
};

// ML Model Creation & Training
export {
  createMLModel,
  createAnomalyDetectionModel,
  trainStatisticalAnomalyModel,
  createThreatClassificationModel,
  createThreatClusteringModel,
  trainThreatForecastingModel,
  createThreatNLPModel,
};

// Feature Engineering
export {
  engineerThreatFeatures,
  createTemporalFeatures,
  extractStatisticalFeatures,
  selectTopFeatures,
};

// Model Performance & Versioning
export {
  generateModelPerformanceReport,
  createModelVersion,
};

// Advanced ML Techniques
export {
  createEnsembleModel,
  setupABTest,
};

// Scoring Functions
export {
  calculateThreatScore,
  calculateSeverityScore,
  calculateImpactScore,
  calculateLikelihoodScore,
  calculateConfidenceScore,
  calculateRiskScore,
  calculateContextualRisk,
};

// Confidence & Reliability
export {
  computeConfidenceMetrics,
  calculateSourceReliability,
  aggregateIndicatorConfidence,
};

// Normalization & Aggregation
export {
  normalizeScore,
  aggregateCompositeScore,
  calculateWeightedAverage,
};

// Threat Analysis
export {
  identifyThreat,
  classifyThreat,
  categorizeThreatByFramework,
};

// Threat Actor Analysis
export {
  assessThreatActorProfile,
  analyzeThreatActorMotivation,
  attributeThreatToActor,
  getThreatActorCapabilities,
};

// Attack Vector Analysis
export {
  analyzeAttackVector,
  mapAttackPath,
  identifyEntryPoints,
  analyzeAttackTechniques,
};

// Threat Severity & Impact
export {
  calculateThreatSeverityScore,
  evaluateThreatImpact,
  calculateExploitabilityScore,
};

// Threat Intelligence
export {
  enrichThreatIntelligence,
  validateThreatIntelligence,
  queryThreatIntelligenceFeeds,
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Sequelize Models
  getMLPredictionModelAttributes,
  getThreatForecastingModelAttributes,
  getThreatAnomalyModelAttributes,
  getMLModelRegistryAttributes,

  // Original Model Attributes from Source Kits
  getThreatPredictionModelAttributes,
  getThreatForecastModelAttributes,
  getThreatPatternModelAttributes,
  getAnomalyDetectionModelAttributes,
  getMLModelAttributes,
  getThreatIntelligenceModelAttributes,

  // Prediction Functions (7)
  createThreatPrediction,
  updateThreatPrediction,
  generatePredictionConfidence,
  predictAttackVectors,
  modelThreatEvolution,
  predictThreatImpact,
  generateComprehensiveRiskScore,

  // Forecasting Functions (8)
  forecastAttackTiming,
  analyzeThreatTrends,
  identifyEmergingThreats,
  trackThreatEvolution,
  detectSeasonalPatterns,
  calculateThreatVelocity,
  analyzeGeographicDistribution,
  analyzeIndustryTrends,

  // Attack Prediction Functions (5)
  calculateAttackProbability,
  predictAttackSurfaceExposure,
  estimateExploitationLikelihood,
  estimateTimeToAttack,
  scoreTargetAttractiveness,

  // Threat Actor & Campaign Prediction (2)
  profileThreatActor,
  predictCampaignProgression,

  // Pattern Detection Functions (7)
  detectThreatPatterns,
  matchThreatPatternAlgorithm,
  clusterThreatBehaviors,
  reconstructAttackChain,
  matchMITREAttackTTP,
  calculatePatternSimilarity,
  managePatternLibrary,

  // Anomaly Detection Functions (6)
  establishBehaviorBaseline,
  detectStatisticalAnomaly,
  detectMLBasedAnomaly,
  scoreBehavioralAnomaly,
  classifyAnomaly,
  reduceFalsePositives,

  // ML Model Management (7)
  trainThreatPredictionModel,
  deployMLModel,
  extractThreatFeatures,
  evaluateModelPerformance,
  tuneModelHyperparameters,
  versionMLModel,
  batchPredict,

  // ML Model Creation & Training (7)
  createMLModel,
  createAnomalyDetectionModel,
  trainStatisticalAnomalyModel,
  createThreatClassificationModel,
  createThreatClusteringModel,
  trainThreatForecastingModel,
  createThreatNLPModel,

  // Feature Engineering (4)
  engineerThreatFeatures,
  createTemporalFeatures,
  extractStatisticalFeatures,
  selectTopFeatures,

  // Model Performance & Versioning (2)
  generateModelPerformanceReport,
  createModelVersion,

  // Advanced ML Techniques (2)
  createEnsembleModel,
  setupABTest,

  // Scoring Functions (7)
  calculateThreatScore,
  calculateSeverityScore,
  calculateImpactScore,
  calculateLikelihoodScore,
  calculateConfidenceScore,
  calculateRiskScore,
  calculateContextualRisk,

  // Confidence & Reliability (3)
  computeConfidenceMetrics,
  calculateSourceReliability,
  aggregateIndicatorConfidence,

  // Normalization & Aggregation (3)
  normalizeScore,
  aggregateCompositeScore,
  calculateWeightedAverage,

  // Threat Analysis (3)
  identifyThreat,
  classifyThreat,
  categorizeThreatByFramework,

  // Threat Actor Analysis (4)
  assessThreatActorProfile,
  analyzeThreatActorMotivation,
  attributeThreatToActor,
  getThreatActorCapabilities,

  // Attack Vector Analysis (4)
  analyzeAttackVector,
  mapAttackPath,
  identifyEntryPoints,
  analyzeAttackTechniques,

  // Threat Severity & Impact (3)
  calculateThreatSeverityScore,
  evaluateThreatImpact,
  calculateExploitabilityScore,

  // Threat Intelligence (3)
  enrichThreatIntelligence,
  validateThreatIntelligence,
  queryThreatIntelligenceFeeds,
};
