/**
 * LOC: MLFORECAST001
 * File: /reuse/threat/composites/ml-threat-forecasting-api-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-intelligence-ml-models-kit
 *   - ../threat-prediction-forecasting-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - ML threat forecasting API controllers
 *   - Prediction service endpoints
 *   - Model serving infrastructure
 */

/**
 * File: /reuse/threat/composites/ml-threat-forecasting-api-composite.ts
 * Locator: WC-COMPOSITE-ML-FORECAST-001
 * Purpose: ML-Based Threat Forecasting API Composite - Production-ready ML model serving and prediction APIs
 *
 * Upstream: threat-intelligence-ml-models-kit, threat-prediction-forecasting-kit
 * Downstream: ../backend/*, ML services, Prediction endpoints, Model deployment
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: 45 composed API functions for ML model serving, predictions, forecasting, model management
 *
 * LLM Context: Production-ready ML threat forecasting API composite for White Cross healthcare platform.
 * Provides comprehensive ML model serving APIs, real-time threat prediction endpoints, forecasting services,
 * model deployment and versioning, batch prediction APIs, model monitoring, A/B testing, feature engineering,
 * anomaly detection, and explainable AI endpoints. Complete with OpenAPI/Swagger documentation.
 */

import {
  // Model Training & Deployment
  createMLModel,
  trainMLModel,
  deployMLModel,
  predictWithMLModel,
  updateMLModelIncremental,

  // Anomaly Detection
  createAnomalyDetectionModel,
  detectAnomalies,
  trainStatisticalAnomalyModel,
  updateAnomalyBaseline,

  // Classification
  createThreatClassificationModel,
  trainThreatClassifier,
  classifyThreats,
  multiLabelThreatClassification,

  // Clustering
  createThreatClusteringModel,
  clusterThreats,
  hierarchicalThreatClustering,
  identifyOutlierThreats,

  // Predictive Analytics
  trainThreatForecastingModel,
  predictThreatTrends,
  predictThreatActorBehavior,
  forecastVulnerabilityExploitation,

  // NLP
  createThreatNLPModel,
  extractThreatEntities,
  summarizeThreatReport,
  analyzeThreatSentiment,

  // Feature Engineering
  engineerThreatFeatures,
  createTemporalFeatures,
  extractStatisticalFeatures,
  selectTopFeatures,

  // Model Evaluation
  evaluateMLModel,
  performCrossValidation,
  analyzeModelBias,
  generateModelPerformanceReport,

  // Model Versioning
  createModelVersion,
  compareModelVersions,
  rollbackModelVersion,

  // AutoML
  autoSelectAlgorithm,
  tuneHyperparameters,
  autoGenerateFeatures,

  // Ensemble Methods
  createEnsembleModel,
  ensemblePredict,

  // Model Explainability
  generateSHAPExplanation,
  generateLIMEExplanation,
  getGlobalFeatureImportance,

  // A/B Testing
  setupABTest,
  analyzeABTest,

  // Types
  MLModelConfig,
  TrainingDataset,
  PredictionRequest,
  PredictionResponse,
  ModelDeploymentConfig,
  TrainingResult,
  ModelMetrics,
  AnomalyDetectionResult,
  MLModelType,
  MLAlgorithm,
  MLFramework,
} from '../threat-intelligence-ml-models-kit';

// ============================================================================
// OPENAPI/SWAGGER SCHEMAS
// ============================================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     MLModelConfig:
 *       type: object
 *       required:
 *         - modelId
 *         - modelName
 *         - modelType
 *         - algorithm
 *         - version
 *         - framework
 *       properties:
 *         modelId:
 *           type: string
 *           description: Unique model identifier
 *           example: "ml-abc123def456"
 *         modelName:
 *           type: string
 *           description: Human-readable model name
 *           example: "Threat Classification Random Forest v2"
 *         modelType:
 *           type: string
 *           enum: [CLASSIFICATION, REGRESSION, CLUSTERING, ANOMALY_DETECTION, TIME_SERIES, NLP, DEEP_LEARNING, ENSEMBLE]
 *           description: Type of ML model
 *         algorithm:
 *           type: string
 *           enum: [LOGISTIC_REGRESSION, RANDOM_FOREST, GRADIENT_BOOSTING, SVM, NEURAL_NETWORK, K_MEANS, DBSCAN, ISOLATION_FOREST, LSTM, TRANSFORMER, AUTOENCODER]
 *           description: ML algorithm used
 *         version:
 *           type: string
 *           description: Model version
 *           example: "2.1.0"
 *         framework:
 *           type: string
 *           enum: [TENSORFLOW, PYTORCH, SCIKIT_LEARN, XGBOOST, KERAS, LIGHTGBM]
 *           description: ML framework
 *         hyperparameters:
 *           type: object
 *           description: Model hyperparameters
 *           example: { "n_estimators": 100, "max_depth": 10 }
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Feature names
 *           example: ["ip_reputation", "behavior_score", "frequency"]
 *         targetVariable:
 *           type: string
 *           description: Target variable name
 *           example: "is_malicious"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PredictionRequest:
 *       type: object
 *       required:
 *         - modelId
 *         - modelVersion
 *         - inputData
 *       properties:
 *         modelId:
 *           type: string
 *           description: Model identifier
 *           example: "ml-abc123"
 *         modelVersion:
 *           type: string
 *           description: Model version to use
 *           example: "1.0.0"
 *         inputData:
 *           type: array
 *           items:
 *             type: object
 *           description: Input features for prediction
 *           example: [{ "ip_reputation": 0.8, "behavior_score": 0.9 }]
 *         explainPrediction:
 *           type: boolean
 *           description: Include SHAP/LIME explanation
 *           default: false
 *         confidenceThreshold:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           description: Minimum confidence threshold
 *           example: 0.7
 *
 *     PredictionResponse:
 *       type: object
 *       properties:
 *         predictions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Prediction'
 *         modelVersion:
 *           type: string
 *           example: "1.0.0"
 *         latency:
 *           type: number
 *           description: Prediction latency in milliseconds
 *           example: 45
 *         timestamp:
 *           type: string
 *           format: date-time
 *
 *     Prediction:
 *       type: object
 *       properties:
 *         predictedValue:
 *           description: Predicted value
 *           example: "malicious"
 *         confidence:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           description: Prediction confidence
 *           example: 0.92
 *         probabilities:
 *           type: object
 *           description: Class probabilities
 *           example: { "benign": 0.08, "malicious": 0.92 }
 *         explanation:
 *           $ref: '#/components/schemas/ModelExplanation'
 *
 *     ModelExplanation:
 *       type: object
 *       properties:
 *         method:
 *           type: string
 *           enum: [shap, lime]
 *           description: Explanation method
 *         featureContributions:
 *           type: object
 *           description: Feature contribution scores
 *           example: { "ip_reputation": 0.35, "behavior_score": 0.28 }
 *         baseValue:
 *           type: number
 *           description: Base prediction value
 *           example: 0.5
 *         visualizationData:
 *           type: object
 *           description: Data for visualization (waterfall, force plot)
 *
 *     ModelDeploymentConfig:
 *       type: object
 *       required:
 *         - deploymentId
 *         - modelId
 *         - modelVersion
 *         - deploymentEnvironment
 *       properties:
 *         deploymentId:
 *           type: string
 *           example: "deploy-xyz789"
 *         modelId:
 *           type: string
 *         modelVersion:
 *           type: string
 *         deploymentEnvironment:
 *           type: string
 *           enum: [dev, staging, production]
 *         endpoint:
 *           type: string
 *           format: uri
 *           example: "https://api.whitecross.health/ml/model-abc/v1.0.0"
 *         scalingConfig:
 *           $ref: '#/components/schemas/ScalingConfig'
 *         monitoringConfig:
 *           $ref: '#/components/schemas/MonitoringConfig'
 *         canaryConfig:
 *           $ref: '#/components/schemas/CanaryConfig'
 *
 *     ScalingConfig:
 *       type: object
 *       properties:
 *         minInstances:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         maxInstances:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         targetCPU:
 *           type: number
 *           description: Target CPU utilization percentage
 *           example: 70
 *         targetMemory:
 *           type: number
 *           description: Target memory utilization percentage
 *           example: 80
 *         autoScaling:
 *           type: boolean
 *           default: true
 *
 *     MonitoringConfig:
 *       type: object
 *       properties:
 *         enableMetrics:
 *           type: boolean
 *           default: true
 *         enableLogging:
 *           type: boolean
 *           default: true
 *         alertThresholds:
 *           type: object
 *           properties:
 *             latencyMs:
 *               type: number
 *               example: 1000
 *             errorRate:
 *               type: number
 *               example: 0.05
 *             throughput:
 *               type: number
 *               example: 100
 *
 *     CanaryConfig:
 *       type: object
 *       properties:
 *         enabled:
 *           type: boolean
 *         trafficPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 10
 *         duration:
 *           type: number
 *           description: Canary duration in milliseconds
 *           example: 3600000
 *         successCriteria:
 *           type: object
 *           properties:
 *             maxErrorRate:
 *               type: number
 *               example: 0.05
 *             minSuccessRate:
 *               type: number
 *               example: 0.95
 *
 *     TrainingResult:
 *       type: object
 *       properties:
 *         modelId:
 *           type: string
 *         trainingDuration:
 *           type: number
 *           description: Training duration in milliseconds
 *         trainingMetrics:
 *           $ref: '#/components/schemas/ModelMetrics'
 *         validationMetrics:
 *           $ref: '#/components/schemas/ModelMetrics'
 *         convergenceInfo:
 *           $ref: '#/components/schemas/ConvergenceInfo'
 *         featureImportance:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FeatureImportance'
 *         artifacts:
 *           $ref: '#/components/schemas/ModelArtifacts'
 *
 *     ModelMetrics:
 *       type: object
 *       properties:
 *         accuracy:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.95
 *         precision:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.93
 *         recall:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.92
 *         f1Score:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.925
 *         roc_auc:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.96
 *         mse:
 *           type: number
 *           description: Mean Squared Error (regression)
 *         mae:
 *           type: number
 *           description: Mean Absolute Error (regression)
 *         r2:
 *           type: number
 *           description: R-squared score (regression)
 *         confusionMatrix:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               type: number
 *           example: [[850, 50], [40, 860]]
 *
 *     ConvergenceInfo:
 *       type: object
 *       properties:
 *         converged:
 *           type: boolean
 *         epochs:
 *           type: integer
 *           example: 100
 *         finalLoss:
 *           type: number
 *           example: 0.15
 *         earlyStoppingEpoch:
 *           type: integer
 *         learningCurve:
 *           type: array
 *           items:
 *             type: number
 *
 *     FeatureImportance:
 *       type: object
 *       properties:
 *         featureName:
 *           type: string
 *           example: "ip_reputation"
 *         importance:
 *           type: number
 *           example: 0.35
 *         rank:
 *           type: integer
 *           example: 1
 *
 *     ModelArtifacts:
 *       type: object
 *       properties:
 *         modelPath:
 *           type: string
 *           example: "/models/ml-abc123/model.pkl"
 *         weightsPath:
 *           type: string
 *           example: "/models/ml-abc123/weights.h5"
 *         scalerPath:
 *           type: string
 *         encoderPath:
 *           type: string
 *         vocabularyPath:
 *           type: string
 *         configPath:
 *           type: string
 *
 *     AnomalyDetectionResult:
 *       type: object
 *       properties:
 *         isAnomaly:
 *           type: boolean
 *         anomalyScore:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.85
 *         anomalyProbability:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.92
 *         threshold:
 *           type: number
 *           example: 0.5
 *         contributors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnomalyContributor'
 *         timestamp:
 *           type: string
 *           format: date-time
 *
 *     AnomalyContributor:
 *       type: object
 *       properties:
 *         feature:
 *           type: string
 *           example: "access_frequency"
 *         contribution:
 *           type: number
 *           example: 0.35
 *         normalRange:
 *           type: array
 *           items:
 *             type: number
 *           example: [0, 100]
 *         actualValue:
 *           type: number
 *           example: 250
 *
 *     ThreatForecast:
 *       type: object
 *       properties:
 *         forecast:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ForecastDataPoint'
 *         accuracy:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *           example: 0.88
 *         modelId:
 *           type: string
 *         generatedAt:
 *           type: string
 *           format: date-time
 *
 *     ForecastDataPoint:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         predictedCount:
 *           type: number
 *           example: 75
 *         confidenceInterval:
 *           type: array
 *           items:
 *             type: number
 *           description: Lower and upper bounds
 *           example: [50, 100]
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token obtained from authentication endpoint
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *       description: API key for service-to-service authentication
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusCode:
 *                 type: integer
 *                 example: 401
 *               message:
 *                 type: string
 *                 example: "Unauthorized"
 *     ForbiddenError:
 *       description: Insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusCode:
 *                 type: integer
 *                 example: 403
 *               message:
 *                 type: string
 *                 example: "Forbidden"
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusCode:
 *                 type: integer
 *                 example: 404
 *               message:
 *                 type: string
 *                 example: "Model not found"
 *     ValidationError:
 *       description: Invalid request parameters
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusCode:
 *                 type: integer
 *                 example: 400
 *               message:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["modelId must be a string", "inputData is required"]
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusCode:
 *                 type: integer
 *                 example: 500
 *               message:
 *                 type: string
 *                 example: "Internal server error"
 */

// ============================================================================
// API ENDPOINT FUNCTIONS - MODEL MANAGEMENT
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/models:
 *   post:
 *     summary: Create a new ML model
 *     description: Creates and initializes a new machine learning model configuration
 *     tags: [ML Models]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelName
 *               - modelType
 *               - algorithm
 *               - framework
 *               - features
 *               - targetVariable
 *             properties:
 *               modelName:
 *                 type: string
 *                 example: "Threat Classification Model"
 *               modelType:
 *                 type: string
 *                 enum: [CLASSIFICATION, REGRESSION, CLUSTERING, ANOMALY_DETECTION, TIME_SERIES, NLP]
 *               algorithm:
 *                 type: string
 *                 enum: [RANDOM_FOREST, GRADIENT_BOOSTING, LSTM, ISOLATION_FOREST]
 *               framework:
 *                 type: string
 *                 enum: [SCIKIT_LEARN, TENSORFLOW, PYTORCH, XGBOOST]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ip_reputation", "behavior_score", "frequency"]
 *               targetVariable:
 *                 type: string
 *                 example: "threat_class"
 *               hyperparameters:
 *                 type: object
 *                 example: { "n_estimators": 100, "max_depth": 10 }
 *     responses:
 *       201:
 *         description: Model created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MLModelConfig'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const apiCreateMLModel = createMLModel;

/**
 * @swagger
 * /api/v1/ml/models/{modelId}/train:
 *   post:
 *     summary: Train ML model
 *     description: Trains a machine learning model with provided dataset
 *     tags: [ML Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Model identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - datasetId
 *             properties:
 *               datasetId:
 *                 type: string
 *                 description: Training dataset identifier
 *               epochs:
 *                 type: integer
 *                 minimum: 1
 *                 default: 100
 *               batchSize:
 *                 type: integer
 *                 minimum: 1
 *                 default: 32
 *               validationSplit:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 default: 0.2
 *               earlyStoppingPatience:
 *                 type: integer
 *                 minimum: 1
 *                 default: 10
 *               learningRate:
 *                 type: number
 *                 minimum: 0
 *                 example: 0.001
 *     responses:
 *       200:
 *         description: Training completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingResult'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const apiTrainMLModel = trainMLModel;

/**
 * @swagger
 * /api/v1/ml/models/{modelId}/deploy:
 *   post:
 *     summary: Deploy ML model
 *     description: Deploys a trained ML model to specified environment
 *     tags: [ML Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - environment
 *               - modelVersion
 *             properties:
 *               environment:
 *                 type: string
 *                 enum: [dev, staging, production]
 *               modelVersion:
 *                 type: string
 *                 example: "1.0.0"
 *               minInstances:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *               maxInstances:
 *                 type: integer
 *                 minimum: 1
 *                 default: 5
 *               enableCanary:
 *                 type: boolean
 *                 default: false
 *               canaryTrafficPercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 10
 *     responses:
 *       200:
 *         description: Model deployed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModelDeploymentConfig'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const apiDeployMLModel = deployMLModel;

/**
 * @swagger
 * /api/v1/ml/models/{modelId}/versions:
 *   post:
 *     summary: Create model version
 *     description: Creates a new version of an ML model
 *     tags: [ML Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - versionTag
 *             properties:
 *               versionTag:
 *                 type: string
 *                 example: "v2.1.0"
 *               improvements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Added new features", "Improved accuracy by 5%"]
 *               bugFixes:
 *                 type: array
 *                 items:
 *                   type: string
 *               breaking:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Version created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export const apiCreateModelVersion = createModelVersion;

/**
 * @swagger
 * /api/v1/ml/models/{modelId}/versions/compare:
 *   post:
 *     summary: Compare model versions
 *     description: Compares performance between two model versions
 *     tags: [ML Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - version1
 *               - version2
 *             properties:
 *               version1:
 *                 type: string
 *                 example: "v1.0.0"
 *               version2:
 *                 type: string
 *                 example: "v2.0.0"
 *     responses:
 *       200:
 *         description: Comparison results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metricDifferences:
 *                   type: object
 *                   example: { "accuracy": 0.02, "precision": 0.03 }
 *                 performanceImprovement:
 *                   type: number
 *                   example: 2.5
 *                 recommendation:
 *                   type: string
 *                   enum: [upgrade, keep_current, evaluate_further]
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
export const apiCompareModelVersions = compareModelVersions;

/**
 * @swagger
 * /api/v1/ml/models/{modelId}/rollback:
 *   post:
 *     summary: Rollback model version
 *     description: Rolls back model to a previous version
 *     tags: [ML Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetVersion
 *             properties:
 *               targetVersion:
 *                 type: string
 *                 example: "v1.5.0"
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rollback successful
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export const apiRollbackModelVersion = rollbackModelVersion;

// ============================================================================
// API ENDPOINT FUNCTIONS - PREDICTIONS
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/predict:
 *   post:
 *     summary: Make predictions
 *     description: Makes real-time predictions using deployed ML model
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PredictionRequest'
 *           examples:
 *             threatClassification:
 *               summary: Threat classification
 *               value:
 *                 modelId: "ml-threat-classifier"
 *                 modelVersion: "1.0.0"
 *                 inputData:
 *                   - ip_reputation: 0.8
 *                     behavior_score: 0.9
 *                     frequency: 15
 *                 explainPrediction: true
 *                 confidenceThreshold: 0.7
 *     responses:
 *       200:
 *         description: Predictions generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PredictionResponse'
 *             examples:
 *               threatPrediction:
 *                 summary: Threat prediction result
 *                 value:
 *                   predictions:
 *                     - predictedValue: "malicious"
 *                       confidence: 0.92
 *                       probabilities:
 *                         benign: 0.08
 *                         malicious: 0.92
 *                       explanation:
 *                         method: "shap"
 *                         featureContributions:
 *                           ip_reputation: 0.35
 *                           behavior_score: 0.28
 *                           frequency: 0.22
 *                         baseValue: 0.5
 *                   modelVersion: "1.0.0"
 *                   latency: 45
 *                   timestamp: "2024-01-15T10:30:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const apiPredictWithMLModel = predictWithMLModel;

/**
 * @swagger
 * /api/v1/ml/predict/batch:
 *   post:
 *     summary: Batch predictions
 *     description: Makes predictions for large batches of data
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/PredictionRequest'
 *               - type: object
 *                 properties:
 *                   batchSize:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 10000
 *                     default: 1000
 *                   async:
 *                     type: boolean
 *                     description: Process asynchronously and return job ID
 *                     default: false
 *     responses:
 *       200:
 *         description: Batch predictions completed (sync mode)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PredictionResponse'
 *       202:
 *         description: Batch job accepted (async mode)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "processing"
 *                 estimatedCompletionTime:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
export const apiBatchPredict = predictWithMLModel;

/**
 * @swagger
 * /api/v1/ml/classify:
 *   post:
 *     summary: Classify threats
 *     description: Classifies threats using trained classification model
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - threats
 *             properties:
 *               modelId:
 *                 type: string
 *               threats:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Classification results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   threatId:
 *                     type: string
 *                   predictedClass:
 *                     type: string
 *                     example: "malware"
 *                   confidence:
 *                     type: number
 *                     example: 0.89
 *                   classProbabilities:
 *                     type: object
 *                     example: { "malware": 0.89, "phishing": 0.06, "ransomware": 0.03 }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
export const apiClassifyThreats = classifyThreats;

/**
 * @swagger
 * /api/v1/ml/classify/multi-label:
 *   post:
 *     summary: Multi-label threat classification
 *     description: Performs multi-label classification on threat data
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - threat
 *             properties:
 *               modelId:
 *                 type: string
 *               threat:
 *                 type: object
 *     responses:
 *       200:
 *         description: Multi-label classification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 threatId:
 *                   type: string
 *                 labels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "credential_theft"
 *                       confidence:
 *                         type: number
 *                         example: 0.92
 */
export const apiMultiLabelClassification = multiLabelThreatClassification;

// ============================================================================
// API ENDPOINT FUNCTIONS - ANOMALY DETECTION
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/anomaly/create-model:
 *   post:
 *     summary: Create anomaly detection model
 *     description: Creates a new anomaly detection model
 *     tags: [Anomaly Detection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - algorithm
 *               - features
 *             properties:
 *               algorithm:
 *                 type: string
 *                 enum: [ISOLATION_FOREST, SVM, AUTOENCODER]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["login_frequency", "data_volume", "access_time"]
 *               contamination:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 default: 0.05
 *     responses:
 *       201:
 *         description: Anomaly detection model created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MLModelConfig'
 */
export const apiCreateAnomalyDetectionModel = createAnomalyDetectionModel;

/**
 * @swagger
 * /api/v1/ml/anomaly/detect:
 *   post:
 *     summary: Detect anomalies
 *     description: Detects anomalies in threat intelligence data
 *     tags: [Anomaly Detection]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - data
 *             properties:
 *               modelId:
 *                 type: string
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Anomaly detection results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnomalyDetectionResult'
 *             examples:
 *               anomalyDetection:
 *                 summary: Detected anomaly
 *                 value:
 *                   - isAnomaly: true
 *                     anomalyScore: 0.85
 *                     anomalyProbability: 0.92
 *                     threshold: 0.5
 *                     contributors:
 *                       - feature: "access_frequency"
 *                         contribution: 0.35
 *                         normalRange: [0, 100]
 *                         actualValue: 250
 *                       - feature: "data_volume"
 *                         contribution: 0.28
 *                         normalRange: [0, 1000]
 *                         actualValue: 5000
 *                     timestamp: "2024-01-15T10:30:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
export const apiDetectAnomalies = detectAnomalies;

/**
 * @swagger
 * /api/v1/ml/anomaly/train-statistical:
 *   post:
 *     summary: Train statistical anomaly model
 *     description: Trains a statistical anomaly detection model
 *     tags: [Anomaly Detection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - historicalData
 *               - method
 *               - features
 *             properties:
 *               historicalData:
 *                 type: array
 *                 items:
 *                   type: object
 *               method:
 *                 type: string
 *                 enum: [isolation_forest, one_class_svm, autoencoder]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               contamination:
 *                 type: number
 *                 default: 0.05
 *     responses:
 *       200:
 *         description: Statistical model trained
 */
export const apiTrainStatisticalAnomalyModel = trainStatisticalAnomalyModel;

/**
 * @swagger
 * /api/v1/ml/anomaly/{modelId}/update-baseline:
 *   post:
 *     summary: Update anomaly baseline
 *     description: Updates the baseline for anomaly detection
 *     tags: [Anomaly Detection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newBaselineData
 *             properties:
 *               newBaselineData:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Baseline updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 samplesAdded:
 *                   type: integer
 */
export const apiUpdateAnomalyBaseline = updateAnomalyBaseline;

// ============================================================================
// API ENDPOINT FUNCTIONS - CLUSTERING
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/cluster/create-model:
 *   post:
 *     summary: Create clustering model
 *     description: Creates a new threat clustering model
 *     tags: [Clustering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - algorithm
 *               - features
 *             properties:
 *               algorithm:
 *                 type: string
 *                 enum: [K_MEANS, DBSCAN]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               nClusters:
 *                 type: integer
 *                 minimum: 2
 *                 default: 5
 *     responses:
 *       201:
 *         description: Clustering model created
 */
export const apiCreateClusteringModel = createThreatClusteringModel;

/**
 * @swagger
 * /api/v1/ml/cluster/threats:
 *   post:
 *     summary: Cluster threats
 *     description: Clusters threats based on similarity
 *     tags: [Clustering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - threats
 *             properties:
 *               modelId:
 *                 type: string
 *               threats:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Clustering results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clusters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clusterId:
 *                         type: integer
 *                       threats:
 *                         type: array
 *                       centroid:
 *                         type: object
 *                       size:
 *                         type: integer
 *                 silhouetteScore:
 *                   type: number
 *                   example: 0.75
 */
export const apiClusterThreats = clusterThreats;

/**
 * @swagger
 * /api/v1/ml/cluster/hierarchical:
 *   post:
 *     summary: Hierarchical threat clustering
 *     description: Performs hierarchical clustering on threats
 *     tags: [Clustering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - threats
 *             properties:
 *               threats:
 *                 type: array
 *                 items:
 *                   type: object
 *               linkage:
 *                 type: string
 *                 enum: [ward, complete, average, single]
 *                 default: ward
 *               distanceThreshold:
 *                 type: number
 *               nClusters:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Hierarchical clustering results
 */
export const apiHierarchicalClustering = hierarchicalThreatClustering;

/**
 * @swagger
 * /api/v1/ml/cluster/outliers:
 *   post:
 *     summary: Identify outlier threats
 *     description: Identifies outlier threats using DBSCAN
 *     tags: [Clustering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - threats
 *               - eps
 *               - minSamples
 *             properties:
 *               threats:
 *                 type: array
 *                 items:
 *                   type: object
 *               eps:
 *                 type: number
 *                 example: 0.5
 *               minSamples:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Outlier detection results
 */
export const apiIdentifyOutliers = identifyOutlierThreats;

// ============================================================================
// API ENDPOINT FUNCTIONS - FORECASTING
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/forecast/train:
 *   post:
 *     summary: Train forecasting model
 *     description: Trains a threat forecasting model using historical data
 *     tags: [Forecasting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - historicalThreats
 *               - forecastHorizon
 *               - algorithm
 *               - features
 *             properties:
 *               historicalThreats:
 *                 type: array
 *                 items:
 *                   type: object
 *               forecastHorizon:
 *                 type: integer
 *                 description: Days to forecast ahead
 *                 example: 30
 *               algorithm:
 *                 type: string
 *                 enum: [LSTM, TRANSFORMER]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Forecasting model trained
 */
export const apiTrainForecastingModel = trainThreatForecastingModel;

/**
 * @swagger
 * /api/v1/ml/forecast/trends:
 *   post:
 *     summary: Predict threat trends
 *     description: Predicts future threat trends and volumes
 *     tags: [Forecasting]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - forecastDays
 *             properties:
 *               modelId:
 *                 type: string
 *               forecastDays:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 365
 *                 example: 30
 *     responses:
 *       200:
 *         description: Threat trend forecast
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreatForecast'
 *             examples:
 *               forecastResult:
 *                 summary: 30-day threat forecast
 *                 value:
 *                   forecast:
 *                     - date: "2024-01-16T00:00:00Z"
 *                       predictedCount: 75
 *                       confidenceInterval: [50, 100]
 *                     - date: "2024-01-17T00:00:00Z"
 *                       predictedCount: 82
 *                       confidenceInterval: [55, 110]
 *                   accuracy: 0.88
 *                   modelId: "ml-forecast-001"
 *                   generatedAt: "2024-01-15T10:30:00Z"
 */
export const apiPredictThreatTrends = predictThreatTrends;

/**
 * @swagger
 * /api/v1/ml/forecast/actor-behavior:
 *   post:
 *     summary: Predict threat actor behavior
 *     description: Predicts future behavior of a threat actor
 *     tags: [Forecasting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actorId
 *               - timeframe
 *             properties:
 *               actorId:
 *                 type: string
 *               timeframe:
 *                 type: integer
 *                 description: Prediction timeframe in days
 *                 example: 30
 *               includeConfidence:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Actor behavior prediction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 actorId:
 *                   type: string
 *                 predictedTactics:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Initial Access", "Credential Access", "Lateral Movement"]
 *                 predictedTargets:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Healthcare", "Financial Services"]
 *                 activityProbability:
 *                   type: number
 *                   example: 0.75
 *                 confidence:
 *                   type: number
 *                   example: 0.82
 */
export const apiPredictActorBehavior = predictThreatActorBehavior;

/**
 * @swagger
 * /api/v1/ml/forecast/vulnerability-exploitation:
 *   post:
 *     summary: Forecast vulnerability exploitation
 *     description: Forecasts likelihood of vulnerability exploitation
 *     tags: [Forecasting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vulnerabilityId
 *             properties:
 *               vulnerabilityId:
 *                 type: string
 *                 example: "CVE-2024-1234"
 *     responses:
 *       200:
 *         description: Exploitation forecast
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vulnerabilityId:
 *                   type: string
 *                 exploitationProbability:
 *                   type: number
 *                   example: 0.68
 *                 estimatedTimeToExploit:
 *                   type: integer
 *                   description: Days until likely exploitation
 *                   example: 14
 *                 confidenceScore:
 *                   type: number
 *                   example: 0.85
 *                 factors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       factor:
 *                         type: string
 *                       weight:
 *                         type: number
 */
export const apiForecastVulnerabilityExploitation = forecastVulnerabilityExploitation;

// ============================================================================
// API ENDPOINT FUNCTIONS - NLP & TEXT ANALYSIS
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/nlp/create-model:
 *   post:
 *     summary: Create NLP model
 *     description: Creates an NLP model for threat report analysis
 *     tags: [NLP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - maxSequenceLength
 *             properties:
 *               task:
 *                 type: string
 *                 enum: [classification, ner, sentiment, summarization]
 *               vocabulary:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxSequenceLength:
 *                 type: integer
 *                 example: 512
 *     responses:
 *       201:
 *         description: NLP model created
 */
export const apiCreateNLPModel = createThreatNLPModel;

/**
 * @swagger
 * /api/v1/ml/nlp/extract-entities:
 *   post:
 *     summary: Extract threat entities
 *     description: Extracts threat entities from text using NER
 *     tags: [NLP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - modelId
 *             properties:
 *               text:
 *                 type: string
 *               modelId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Extracted entities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   entity:
 *                     type: string
 *                     example: "192.168.1.100"
 *                   type:
 *                     type: string
 *                     enum: [IOC, THREAT_ACTOR, MALWARE, TECHNIQUE, TOOL]
 *                   confidence:
 *                     type: number
 *                     example: 0.98
 *                   position:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [10, 23]
 */
export const apiExtractThreatEntities = extractThreatEntities;

/**
 * @swagger
 * /api/v1/ml/nlp/summarize:
 *   post:
 *     summary: Summarize threat report
 *     description: Summarizes threat intelligence reports
 *     tags: [NLP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - report
 *             properties:
 *               report:
 *                 type: string
 *               maxLength:
 *                 type: integer
 *                 default: 200
 *               extractKeyPoints:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Report summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                 keyPoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                 length:
 *                   type: integer
 */
export const apiSummarizeReport = summarizeThreatReport;

/**
 * @swagger
 * /api/v1/ml/nlp/sentiment:
 *   post:
 *     summary: Analyze threat sentiment
 *     description: Performs sentiment analysis on threat discussions
 *     tags: [NLP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - texts
 *             properties:
 *               texts:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sentiment analysis results
 */
export const apiAnalyzeSentiment = analyzeThreatSentiment;

// ============================================================================
// API ENDPOINT FUNCTIONS - FEATURE ENGINEERING
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/features/engineer:
 *   post:
 *     summary: Engineer features
 *     description: Engineers features from raw threat data
 *     tags: [Feature Engineering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rawData
 *               - featureDefinitions
 *             properties:
 *               rawData:
 *                 type: array
 *                 items:
 *                   type: object
 *               featureDefinitions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Engineered features
 */
export const apiEngineerFeatures = engineerThreatFeatures;

/**
 * @swagger
 * /api/v1/ml/features/temporal:
 *   post:
 *     summary: Create temporal features
 *     description: Creates temporal features from timestamps
 *     tags: [Feature Engineering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timestamps
 *             properties:
 *               timestamps:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *     responses:
 *       200:
 *         description: Temporal features
 */
export const apiCreateTemporalFeatures = createTemporalFeatures;

/**
 * @swagger
 * /api/v1/ml/features/statistical:
 *   post:
 *     summary: Extract statistical features
 *     description: Extracts statistical features from sequences
 *     tags: [Feature Engineering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sequences
 *             properties:
 *               sequences:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *     responses:
 *       200:
 *         description: Statistical features
 */
export const apiExtractStatisticalFeatures = extractStatisticalFeatures;

/**
 * @swagger
 * /api/v1/ml/features/select:
 *   post:
 *     summary: Select top features
 *     description: Selects top N features by importance
 *     tags: [Feature Engineering]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - featureImportances
 *               - topN
 *             properties:
 *               featureImportances:
 *                 type: object
 *               topN:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Selected features
 */
export const apiSelectTopFeatures = selectTopFeatures;

// ============================================================================
// API ENDPOINT FUNCTIONS - MODEL EVALUATION
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/evaluate:
 *   post:
 *     summary: Evaluate model
 *     description: Evaluates model performance on test data
 *     tags: [Model Evaluation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - testData
 *               - trueLabels
 *             properties:
 *               modelId:
 *                 type: string
 *               testData:
 *                 type: array
 *               trueLabels:
 *                 type: array
 *     responses:
 *       200:
 *         description: Evaluation metrics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModelMetrics'
 */
export const apiEvaluateModel = evaluateMLModel;

/**
 * @swagger
 * /api/v1/ml/cross-validate:
 *   post:
 *     summary: Cross-validate model
 *     description: Performs cross-validation on model
 *     tags: [Model Evaluation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelConfig
 *               - dataset
 *             properties:
 *               modelConfig:
 *                 $ref: '#/components/schemas/MLModelConfig'
 *               dataset:
 *                 type: object
 *               nFolds:
 *                 type: integer
 *                 default: 5
 *     responses:
 *       200:
 *         description: Cross-validation results
 */
export const apiCrossValidate = performCrossValidation;

/**
 * @swagger
 * /api/v1/ml/analyze-bias:
 *   post:
 *     summary: Analyze model bias
 *     description: Analyzes model bias and fairness metrics
 *     tags: [Model Evaluation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - testData
 *             properties:
 *               modelId:
 *                 type: string
 *               testData:
 *                 type: array
 *     responses:
 *       200:
 *         description: Bias analysis results
 */
export const apiAnalyzeBias = analyzeModelBias;

/**
 * @swagger
 * /api/v1/ml/performance-report:
 *   post:
 *     summary: Generate performance report
 *     description: Generates comprehensive model performance report
 *     tags: [Model Evaluation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - metrics
 *             properties:
 *               modelId:
 *                 type: string
 *               metrics:
 *                 $ref: '#/components/schemas/ModelMetrics'
 *     responses:
 *       200:
 *         description: Performance report
 */
export const apiGeneratePerformanceReport = generateModelPerformanceReport;

// ============================================================================
// API ENDPOINT FUNCTIONS - AUTOML
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/automl/select-algorithm:
 *   post:
 *     summary: Auto-select algorithm
 *     description: Automatically selects best algorithm for dataset
 *     tags: [AutoML]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataset
 *               - taskType
 *             properties:
 *               dataset:
 *                 type: object
 *               taskType:
 *                 type: string
 *                 enum: [classification, regression, clustering]
 *               maxTrainingTime:
 *                 type: integer
 *               optimizeFor:
 *                 type: string
 *                 enum: [accuracy, speed, interpretability]
 *     responses:
 *       200:
 *         description: Algorithm recommendation
 */
export const apiAutoSelectAlgorithm = autoSelectAlgorithm;

/**
 * @swagger
 * /api/v1/ml/automl/tune-hyperparameters:
 *   post:
 *     summary: Tune hyperparameters
 *     description: Performs hyperparameter tuning
 *     tags: [AutoML]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelConfig
 *               - dataset
 *               - searchSpace
 *             properties:
 *               modelConfig:
 *                 $ref: '#/components/schemas/MLModelConfig'
 *               dataset:
 *                 type: object
 *               searchSpace:
 *                 type: object
 *     responses:
 *       200:
 *         description: Tuning results
 */
export const apiTuneHyperparameters = tuneHyperparameters;

/**
 * @swagger
 * /api/v1/ml/automl/generate-features:
 *   post:
 *     summary: Auto-generate features
 *     description: Automatically generates features from raw data
 *     tags: [AutoML]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rawData
 *             properties:
 *               rawData:
 *                 type: array
 *               maxFeatures:
 *                 type: integer
 *               includeInteractions:
 *                 type: boolean
 *               includePolynomials:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Generated features
 */
export const apiAutoGenerateFeatures = autoGenerateFeatures;

// ============================================================================
// API ENDPOINT FUNCTIONS - ENSEMBLE METHODS
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/ensemble/create:
 *   post:
 *     summary: Create ensemble model
 *     description: Creates an ensemble of multiple models
 *     tags: [Ensemble]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelIds
 *               - method
 *             properties:
 *               modelIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               method:
 *                 type: string
 *                 enum: [voting, stacking, bagging, boosting]
 *               weights:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       201:
 *         description: Ensemble created
 */
export const apiCreateEnsemble = createEnsembleModel;

/**
 * @swagger
 * /api/v1/ml/ensemble/predict:
 *   post:
 *     summary: Ensemble prediction
 *     description: Makes predictions using ensemble model
 *     tags: [Ensemble]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ensembleId
 *               - data
 *             properties:
 *               ensembleId:
 *                 type: string
 *               data:
 *                 type: array
 *     responses:
 *       200:
 *         description: Ensemble predictions
 */
export const apiEnsemblePredict = ensemblePredict;

// ============================================================================
// API ENDPOINT FUNCTIONS - EXPLAINABILITY
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/explain/shap:
 *   post:
 *     summary: Generate SHAP explanation
 *     description: Generates SHAP explanation for prediction
 *     tags: [Explainability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - instance
 *             properties:
 *               modelId:
 *                 type: string
 *               instance:
 *                 type: object
 *     responses:
 *       200:
 *         description: SHAP explanation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModelExplanation'
 */
export const apiGenerateSHAPExplanation = generateSHAPExplanation;

/**
 * @swagger
 * /api/v1/ml/explain/lime:
 *   post:
 *     summary: Generate LIME explanation
 *     description: Generates LIME explanation for prediction
 *     tags: [Explainability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelId
 *               - instance
 *             properties:
 *               modelId:
 *                 type: string
 *               instance:
 *                 type: object
 *     responses:
 *       200:
 *         description: LIME explanation
 */
export const apiGenerateLIMEExplanation = generateLIMEExplanation;

/**
 * @swagger
 * /api/v1/ml/explain/feature-importance:
 *   get:
 *     summary: Get global feature importance
 *     description: Retrieves global feature importance for model
 *     tags: [Explainability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature importance scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FeatureImportance'
 */
export const apiGetFeatureImportance = getGlobalFeatureImportance;

// ============================================================================
// API ENDPOINT FUNCTIONS - A/B TESTING
// ============================================================================

/**
 * @swagger
 * /api/v1/ml/ab-test/setup:
 *   post:
 *     summary: Setup A/B test
 *     description: Sets up A/B test for model comparison
 *     tags: [A/B Testing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modelA
 *               - modelB
 *               - trafficSplit
 *               - duration
 *               - successMetric
 *             properties:
 *               modelA:
 *                 type: string
 *               modelB:
 *                 type: string
 *               trafficSplit:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *               duration:
 *                 type: integer
 *                 description: Test duration in milliseconds
 *               successMetric:
 *                 type: string
 *                 enum: [accuracy, precision, recall, latency]
 *     responses:
 *       201:
 *         description: A/B test created
 */
export const apiSetupABTest = setupABTest;

/**
 * @swagger
 * /api/v1/ml/ab-test/{testId}/analyze:
 *   get:
 *     summary: Analyze A/B test
 *     description: Analyzes A/B test results and provides recommendation
 *     tags: [A/B Testing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A/B test analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 testId:
 *                   type: string
 *                 modelAPerformance:
 *                   type: number
 *                 modelBPerformance:
 *                   type: number
 *                 improvement:
 *                   type: number
 *                 statisticalSignificance:
 *                   type: number
 *                 recommendation:
 *                   type: string
 *                   enum: [use_model_a, use_model_b, continue_testing]
 */
export const apiAnalyzeABTest = analyzeABTest;

// Export all API functions
export default {
  // Model Management
  apiCreateMLModel,
  apiTrainMLModel,
  apiDeployMLModel,
  apiCreateModelVersion,
  apiCompareModelVersions,
  apiRollbackModelVersion,

  // Predictions
  apiPredictWithMLModel,
  apiBatchPredict,
  apiClassifyThreats,
  apiMultiLabelClassification,

  // Anomaly Detection
  apiCreateAnomalyDetectionModel,
  apiDetectAnomalies,
  apiTrainStatisticalAnomalyModel,
  apiUpdateAnomalyBaseline,

  // Clustering
  apiCreateClusteringModel,
  apiClusterThreats,
  apiHierarchicalClustering,
  apiIdentifyOutliers,

  // Forecasting
  apiTrainForecastingModel,
  apiPredictThreatTrends,
  apiPredictActorBehavior,
  apiForecastVulnerabilityExploitation,

  // NLP
  apiCreateNLPModel,
  apiExtractThreatEntities,
  apiSummarizeReport,
  apiAnalyzeSentiment,

  // Feature Engineering
  apiEngineerFeatures,
  apiCreateTemporalFeatures,
  apiExtractStatisticalFeatures,
  apiSelectTopFeatures,

  // Model Evaluation
  apiEvaluateModel,
  apiCrossValidate,
  apiAnalyzeBias,
  apiGeneratePerformanceReport,

  // AutoML
  apiAutoSelectAlgorithm,
  apiTuneHyperparameters,
  apiAutoGenerateFeatures,

  // Ensemble
  apiCreateEnsemble,
  apiEnsemblePredict,

  // Explainability
  apiGenerateSHAPExplanation,
  apiGenerateLIMEExplanation,
  apiGetFeatureImportance,

  // A/B Testing
  apiSetupABTest,
  apiAnalyzeABTest,
};
