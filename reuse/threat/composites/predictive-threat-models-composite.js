"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThreatClassificationModel = exports.trainStatisticalAnomalyModel = exports.createAnomalyDetectionModel = exports.createMLModel = exports.batchPredict = exports.versionMLModel = exports.tuneModelHyperparameters = exports.evaluateModelPerformance = exports.extractThreatFeatures = exports.deployMLModel = exports.trainThreatPredictionModel = exports.reduceFalsePositives = exports.classifyAnomaly = exports.scoreBehavioralAnomaly = exports.detectMLBasedAnomaly = exports.detectStatisticalAnomaly = exports.establishBehaviorBaseline = exports.managePatternLibrary = exports.calculatePatternSimilarity = exports.matchMITREAttackTTP = exports.reconstructAttackChain = exports.clusterThreatBehaviors = exports.matchThreatPatternAlgorithm = exports.detectThreatPatterns = exports.predictCampaignProgression = exports.profileThreatActor = exports.scoreTargetAttractiveness = exports.estimateTimeToAttack = exports.estimateExploitationLikelihood = exports.predictAttackSurfaceExposure = exports.calculateAttackProbability = exports.analyzeIndustryTrends = exports.analyzeGeographicDistribution = exports.calculateThreatVelocity = exports.detectSeasonalPatterns = exports.trackThreatEvolution = exports.identifyEmergingThreats = exports.analyzeThreatTrends = exports.forecastAttackTiming = exports.generateComprehensiveRiskScore = exports.predictThreatImpact = exports.modelThreatEvolution = exports.predictAttackVectors = exports.generatePredictionConfidence = exports.updateThreatPrediction = exports.createThreatPrediction = exports.getMLModelRegistryAttributes = exports.getThreatAnomalyModelAttributes = exports.getThreatForecastingModelAttributes = exports.getMLPredictionModelAttributes = void 0;
exports.queryThreatIntelligenceFeeds = exports.validateThreatIntelligence = exports.enrichThreatIntelligence = exports.calculateExploitabilityScore = exports.evaluateThreatImpact = exports.calculateThreatSeverityScore = exports.analyzeAttackTechniques = exports.identifyEntryPoints = exports.mapAttackPath = exports.analyzeAttackVector = exports.getThreatActorCapabilities = exports.attributeThreatToActor = exports.analyzeThreatActorMotivation = exports.assessThreatActorProfile = exports.categorizeThreatByFramework = exports.classifyThreat = exports.identifyThreat = exports.calculateWeightedAverage = exports.aggregateCompositeScore = exports.normalizeScore = exports.aggregateIndicatorConfidence = exports.calculateSourceReliability = exports.computeConfidenceMetrics = exports.calculateContextualRisk = exports.calculateRiskScore = exports.calculateConfidenceScore = exports.calculateLikelihoodScore = exports.calculateImpactScore = exports.calculateSeverityScore = exports.calculateThreatScore = exports.setupABTest = exports.createEnsembleModel = exports.createModelVersion = exports.generateModelPerformanceReport = exports.selectTopFeatures = exports.extractStatisticalFeatures = exports.createTemporalFeatures = exports.engineerThreatFeatures = exports.createThreatNLPModel = exports.trainThreatForecastingModel = exports.createThreatClusteringModel = void 0;
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
const threat_prediction_forecasting_kit_1 = require("../threat-prediction-forecasting-kit");
Object.defineProperty(exports, "createThreatPrediction", { enumerable: true, get: function () { return 
    // Prediction Functions
    threat_prediction_forecasting_kit_1.createThreatPrediction; } });
Object.defineProperty(exports, "updateThreatPrediction", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.updateThreatPrediction; } });
Object.defineProperty(exports, "generatePredictionConfidence", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.generatePredictionConfidence; } });
Object.defineProperty(exports, "predictAttackVectors", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.predictAttackVectors; } });
Object.defineProperty(exports, "modelThreatEvolution", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.modelThreatEvolution; } });
Object.defineProperty(exports, "predictThreatImpact", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.predictThreatImpact; } });
Object.defineProperty(exports, "generateComprehensiveRiskScore", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.generateComprehensiveRiskScore; } });
Object.defineProperty(exports, "forecastAttackTiming", { enumerable: true, get: function () { return 
    // Forecasting Functions
    threat_prediction_forecasting_kit_1.forecastAttackTiming; } });
Object.defineProperty(exports, "analyzeThreatTrends", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.analyzeThreatTrends; } });
Object.defineProperty(exports, "identifyEmergingThreats", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.identifyEmergingThreats; } });
Object.defineProperty(exports, "trackThreatEvolution", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.trackThreatEvolution; } });
Object.defineProperty(exports, "detectSeasonalPatterns", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.detectSeasonalPatterns; } });
Object.defineProperty(exports, "calculateThreatVelocity", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.calculateThreatVelocity; } });
Object.defineProperty(exports, "analyzeGeographicDistribution", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.analyzeGeographicDistribution; } });
Object.defineProperty(exports, "analyzeIndustryTrends", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.analyzeIndustryTrends; } });
Object.defineProperty(exports, "calculateAttackProbability", { enumerable: true, get: function () { return 
    // Attack Prediction Functions
    threat_prediction_forecasting_kit_1.calculateAttackProbability; } });
Object.defineProperty(exports, "predictAttackSurfaceExposure", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.predictAttackSurfaceExposure; } });
Object.defineProperty(exports, "estimateExploitationLikelihood", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.estimateExploitationLikelihood; } });
Object.defineProperty(exports, "estimateTimeToAttack", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.estimateTimeToAttack; } });
Object.defineProperty(exports, "scoreTargetAttractiveness", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.scoreTargetAttractiveness; } });
Object.defineProperty(exports, "profileThreatActor", { enumerable: true, get: function () { return 
    // Threat Actor & Campaign Prediction
    threat_prediction_forecasting_kit_1.profileThreatActor; } });
Object.defineProperty(exports, "predictCampaignProgression", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.predictCampaignProgression; } });
Object.defineProperty(exports, "detectThreatPatterns", { enumerable: true, get: function () { return 
    // Pattern Detection Functions
    threat_prediction_forecasting_kit_1.detectThreatPatterns; } });
Object.defineProperty(exports, "matchThreatPatternAlgorithm", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.matchThreatPatternAlgorithm; } });
Object.defineProperty(exports, "clusterThreatBehaviors", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.clusterThreatBehaviors; } });
Object.defineProperty(exports, "reconstructAttackChain", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.reconstructAttackChain; } });
Object.defineProperty(exports, "matchMITREAttackTTP", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.matchMITREAttackTTP; } });
Object.defineProperty(exports, "calculatePatternSimilarity", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.calculatePatternSimilarity; } });
Object.defineProperty(exports, "managePatternLibrary", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.managePatternLibrary; } });
Object.defineProperty(exports, "establishBehaviorBaseline", { enumerable: true, get: function () { return 
    // Anomaly Detection Functions
    threat_prediction_forecasting_kit_1.establishBehaviorBaseline; } });
Object.defineProperty(exports, "detectStatisticalAnomaly", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.detectStatisticalAnomaly; } });
Object.defineProperty(exports, "detectMLBasedAnomaly", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.detectMLBasedAnomaly; } });
Object.defineProperty(exports, "scoreBehavioralAnomaly", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.scoreBehavioralAnomaly; } });
Object.defineProperty(exports, "classifyAnomaly", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.classifyAnomaly; } });
Object.defineProperty(exports, "reduceFalsePositives", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.reduceFalsePositives; } });
Object.defineProperty(exports, "trainThreatPredictionModel", { enumerable: true, get: function () { return 
    // ML Model Management
    threat_prediction_forecasting_kit_1.trainThreatPredictionModel; } });
Object.defineProperty(exports, "deployMLModel", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.deployMLModel; } });
Object.defineProperty(exports, "extractThreatFeatures", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.extractThreatFeatures; } });
Object.defineProperty(exports, "evaluateModelPerformance", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.evaluateModelPerformance; } });
Object.defineProperty(exports, "tuneModelHyperparameters", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.tuneModelHyperparameters; } });
Object.defineProperty(exports, "versionMLModel", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.versionMLModel; } });
Object.defineProperty(exports, "batchPredict", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.batchPredict; } });
const threat_intelligence_ml_models_kit_1 = require("../threat-intelligence-ml-models-kit");
Object.defineProperty(exports, "createMLModel", { enumerable: true, get: function () { return 
    // ML Model Creation & Training
    threat_intelligence_ml_models_kit_1.createMLModel; } });
Object.defineProperty(exports, "createAnomalyDetectionModel", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.createAnomalyDetectionModel; } });
Object.defineProperty(exports, "trainStatisticalAnomalyModel", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.trainStatisticalAnomalyModel; } });
Object.defineProperty(exports, "createThreatClassificationModel", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.createThreatClassificationModel; } });
Object.defineProperty(exports, "createThreatClusteringModel", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.createThreatClusteringModel; } });
Object.defineProperty(exports, "trainThreatForecastingModel", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.trainThreatForecastingModel; } });
Object.defineProperty(exports, "createThreatNLPModel", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.createThreatNLPModel; } });
Object.defineProperty(exports, "engineerThreatFeatures", { enumerable: true, get: function () { return 
    // Feature Engineering
    threat_intelligence_ml_models_kit_1.engineerThreatFeatures; } });
Object.defineProperty(exports, "createTemporalFeatures", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.createTemporalFeatures; } });
Object.defineProperty(exports, "extractStatisticalFeatures", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.extractStatisticalFeatures; } });
Object.defineProperty(exports, "selectTopFeatures", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.selectTopFeatures; } });
Object.defineProperty(exports, "generateModelPerformanceReport", { enumerable: true, get: function () { return 
    // Model Performance & Versioning
    threat_intelligence_ml_models_kit_1.generateModelPerformanceReport; } });
Object.defineProperty(exports, "createModelVersion", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.createModelVersion; } });
Object.defineProperty(exports, "createEnsembleModel", { enumerable: true, get: function () { return 
    // Advanced ML Techniques
    threat_intelligence_ml_models_kit_1.createEnsembleModel; } });
Object.defineProperty(exports, "setupABTest", { enumerable: true, get: function () { return threat_intelligence_ml_models_kit_1.setupABTest; } });
const threat_scoring_kit_1 = require("../threat-scoring-kit");
Object.defineProperty(exports, "calculateThreatScore", { enumerable: true, get: function () { return 
    // Scoring Functions
    threat_scoring_kit_1.calculateThreatScore; } });
Object.defineProperty(exports, "calculateSeverityScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateSeverityScore; } });
Object.defineProperty(exports, "calculateImpactScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateImpactScore; } });
Object.defineProperty(exports, "calculateLikelihoodScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateLikelihoodScore; } });
Object.defineProperty(exports, "calculateConfidenceScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateConfidenceScore; } });
Object.defineProperty(exports, "calculateRiskScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateRiskScore; } });
Object.defineProperty(exports, "calculateContextualRisk", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateContextualRisk; } });
Object.defineProperty(exports, "computeConfidenceMetrics", { enumerable: true, get: function () { return 
    // Confidence & Reliability
    threat_scoring_kit_1.computeConfidenceMetrics; } });
Object.defineProperty(exports, "calculateSourceReliability", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateSourceReliability; } });
Object.defineProperty(exports, "aggregateIndicatorConfidence", { enumerable: true, get: function () { return threat_scoring_kit_1.aggregateIndicatorConfidence; } });
Object.defineProperty(exports, "normalizeScore", { enumerable: true, get: function () { return 
    // Normalization & Aggregation
    threat_scoring_kit_1.normalizeScore; } });
Object.defineProperty(exports, "aggregateCompositeScore", { enumerable: true, get: function () { return threat_scoring_kit_1.aggregateCompositeScore; } });
Object.defineProperty(exports, "calculateWeightedAverage", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateWeightedAverage; } });
const threat_assessment_kit_1 = require("../threat-assessment-kit");
Object.defineProperty(exports, "identifyThreat", { enumerable: true, get: function () { return 
    // Threat Analysis
    threat_assessment_kit_1.identifyThreat; } });
Object.defineProperty(exports, "classifyThreat", { enumerable: true, get: function () { return threat_assessment_kit_1.classifyThreat; } });
Object.defineProperty(exports, "categorizeThreatByFramework", { enumerable: true, get: function () { return threat_assessment_kit_1.categorizeThreatByFramework; } });
Object.defineProperty(exports, "assessThreatActorProfile", { enumerable: true, get: function () { return threat_assessment_kit_1.profileThreatActor; } });
Object.defineProperty(exports, "analyzeThreatActorMotivation", { enumerable: true, get: function () { return threat_assessment_kit_1.analyzeThreatActorMotivation; } });
Object.defineProperty(exports, "attributeThreatToActor", { enumerable: true, get: function () { return threat_assessment_kit_1.attributeThreatToActor; } });
Object.defineProperty(exports, "getThreatActorCapabilities", { enumerable: true, get: function () { return threat_assessment_kit_1.getThreatActorCapabilities; } });
Object.defineProperty(exports, "analyzeAttackVector", { enumerable: true, get: function () { return 
    // Attack Vector Analysis
    threat_assessment_kit_1.analyzeAttackVector; } });
Object.defineProperty(exports, "mapAttackPath", { enumerable: true, get: function () { return threat_assessment_kit_1.mapAttackPath; } });
Object.defineProperty(exports, "identifyEntryPoints", { enumerable: true, get: function () { return threat_assessment_kit_1.identifyEntryPoints; } });
Object.defineProperty(exports, "analyzeAttackTechniques", { enumerable: true, get: function () { return threat_assessment_kit_1.analyzeAttackTechniques; } });
Object.defineProperty(exports, "calculateThreatSeverityScore", { enumerable: true, get: function () { return 
    // Threat Severity & Impact
    threat_assessment_kit_1.calculateThreatSeverityScore; } });
Object.defineProperty(exports, "evaluateThreatImpact", { enumerable: true, get: function () { return threat_assessment_kit_1.evaluateThreatImpact; } });
Object.defineProperty(exports, "calculateExploitabilityScore", { enumerable: true, get: function () { return threat_assessment_kit_1.calculateExploitabilityScore; } });
Object.defineProperty(exports, "enrichThreatIntelligence", { enumerable: true, get: function () { return 
    // Threat Intelligence
    threat_assessment_kit_1.enrichThreatIntelligence; } });
Object.defineProperty(exports, "validateThreatIntelligence", { enumerable: true, get: function () { return threat_assessment_kit_1.validateThreatIntelligence; } });
Object.defineProperty(exports, "queryThreatIntelligenceFeeds", { enumerable: true, get: function () { return threat_assessment_kit_1.queryThreatIntelligenceFeeds; } });
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
const getMLPredictionModelAttributes = () => ({
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
exports.getMLPredictionModelAttributes = getMLPredictionModelAttributes;
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
const getThreatForecastingModelAttributes = () => ({
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
exports.getThreatForecastingModelAttributes = getThreatForecastingModelAttributes;
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
const getThreatAnomalyModelAttributes = () => ({
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
exports.getThreatAnomalyModelAttributes = getThreatAnomalyModelAttributes;
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
const getMLModelRegistryAttributes = () => ({
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
exports.getMLModelRegistryAttributes = getMLModelRegistryAttributes;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Sequelize Models
    getMLPredictionModelAttributes: exports.getMLPredictionModelAttributes,
    getThreatForecastingModelAttributes: exports.getThreatForecastingModelAttributes,
    getThreatAnomalyModelAttributes: exports.getThreatAnomalyModelAttributes,
    getMLModelRegistryAttributes: exports.getMLModelRegistryAttributes,
    // Original Model Attributes from Source Kits
    getThreatPredictionModelAttributes: threat_prediction_forecasting_kit_1.getThreatPredictionModelAttributes,
    getThreatForecastModelAttributes: threat_prediction_forecasting_kit_1.getThreatForecastModelAttributes,
    getThreatPatternModelAttributes: threat_prediction_forecasting_kit_1.getThreatPatternModelAttributes,
    getAnomalyDetectionModelAttributes: threat_prediction_forecasting_kit_1.getAnomalyDetectionModelAttributes,
    getMLModelAttributes: threat_prediction_forecasting_kit_1.getMLModelAttributes,
    getThreatIntelligenceModelAttributes: threat_prediction_forecasting_kit_1.getThreatIntelligenceModelAttributes,
    // Prediction Functions (7)
    createThreatPrediction: threat_prediction_forecasting_kit_1.createThreatPrediction,
    updateThreatPrediction: threat_prediction_forecasting_kit_1.updateThreatPrediction,
    generatePredictionConfidence: threat_prediction_forecasting_kit_1.generatePredictionConfidence,
    predictAttackVectors: threat_prediction_forecasting_kit_1.predictAttackVectors,
    modelThreatEvolution: threat_prediction_forecasting_kit_1.modelThreatEvolution,
    predictThreatImpact: threat_prediction_forecasting_kit_1.predictThreatImpact,
    generateComprehensiveRiskScore: threat_prediction_forecasting_kit_1.generateComprehensiveRiskScore,
    // Forecasting Functions (8)
    forecastAttackTiming: threat_prediction_forecasting_kit_1.forecastAttackTiming,
    analyzeThreatTrends: threat_prediction_forecasting_kit_1.analyzeThreatTrends,
    identifyEmergingThreats: threat_prediction_forecasting_kit_1.identifyEmergingThreats,
    trackThreatEvolution: threat_prediction_forecasting_kit_1.trackThreatEvolution,
    detectSeasonalPatterns: threat_prediction_forecasting_kit_1.detectSeasonalPatterns,
    calculateThreatVelocity: threat_prediction_forecasting_kit_1.calculateThreatVelocity,
    analyzeGeographicDistribution: threat_prediction_forecasting_kit_1.analyzeGeographicDistribution,
    analyzeIndustryTrends: threat_prediction_forecasting_kit_1.analyzeIndustryTrends,
    // Attack Prediction Functions (5)
    calculateAttackProbability: threat_prediction_forecasting_kit_1.calculateAttackProbability,
    predictAttackSurfaceExposure: threat_prediction_forecasting_kit_1.predictAttackSurfaceExposure,
    estimateExploitationLikelihood: threat_prediction_forecasting_kit_1.estimateExploitationLikelihood,
    estimateTimeToAttack: threat_prediction_forecasting_kit_1.estimateTimeToAttack,
    scoreTargetAttractiveness: threat_prediction_forecasting_kit_1.scoreTargetAttractiveness,
    // Threat Actor & Campaign Prediction (2)
    profileThreatActor: threat_prediction_forecasting_kit_1.profileThreatActor,
    predictCampaignProgression: threat_prediction_forecasting_kit_1.predictCampaignProgression,
    // Pattern Detection Functions (7)
    detectThreatPatterns: threat_prediction_forecasting_kit_1.detectThreatPatterns,
    matchThreatPatternAlgorithm: threat_prediction_forecasting_kit_1.matchThreatPatternAlgorithm,
    clusterThreatBehaviors: threat_prediction_forecasting_kit_1.clusterThreatBehaviors,
    reconstructAttackChain: threat_prediction_forecasting_kit_1.reconstructAttackChain,
    matchMITREAttackTTP: threat_prediction_forecasting_kit_1.matchMITREAttackTTP,
    calculatePatternSimilarity: threat_prediction_forecasting_kit_1.calculatePatternSimilarity,
    managePatternLibrary: threat_prediction_forecasting_kit_1.managePatternLibrary,
    // Anomaly Detection Functions (6)
    establishBehaviorBaseline: threat_prediction_forecasting_kit_1.establishBehaviorBaseline,
    detectStatisticalAnomaly: threat_prediction_forecasting_kit_1.detectStatisticalAnomaly,
    detectMLBasedAnomaly: threat_prediction_forecasting_kit_1.detectMLBasedAnomaly,
    scoreBehavioralAnomaly: threat_prediction_forecasting_kit_1.scoreBehavioralAnomaly,
    classifyAnomaly: threat_prediction_forecasting_kit_1.classifyAnomaly,
    reduceFalsePositives: threat_prediction_forecasting_kit_1.reduceFalsePositives,
    // ML Model Management (7)
    trainThreatPredictionModel: threat_prediction_forecasting_kit_1.trainThreatPredictionModel,
    deployMLModel: threat_prediction_forecasting_kit_1.deployMLModel,
    extractThreatFeatures: threat_prediction_forecasting_kit_1.extractThreatFeatures,
    evaluateModelPerformance: threat_prediction_forecasting_kit_1.evaluateModelPerformance,
    tuneModelHyperparameters: threat_prediction_forecasting_kit_1.tuneModelHyperparameters,
    versionMLModel: threat_prediction_forecasting_kit_1.versionMLModel,
    batchPredict: threat_prediction_forecasting_kit_1.batchPredict,
    // ML Model Creation & Training (7)
    createMLModel: threat_intelligence_ml_models_kit_1.createMLModel,
    createAnomalyDetectionModel: threat_intelligence_ml_models_kit_1.createAnomalyDetectionModel,
    trainStatisticalAnomalyModel: threat_intelligence_ml_models_kit_1.trainStatisticalAnomalyModel,
    createThreatClassificationModel: threat_intelligence_ml_models_kit_1.createThreatClassificationModel,
    createThreatClusteringModel: threat_intelligence_ml_models_kit_1.createThreatClusteringModel,
    trainThreatForecastingModel: threat_intelligence_ml_models_kit_1.trainThreatForecastingModel,
    createThreatNLPModel: threat_intelligence_ml_models_kit_1.createThreatNLPModel,
    // Feature Engineering (4)
    engineerThreatFeatures: threat_intelligence_ml_models_kit_1.engineerThreatFeatures,
    createTemporalFeatures: threat_intelligence_ml_models_kit_1.createTemporalFeatures,
    extractStatisticalFeatures: threat_intelligence_ml_models_kit_1.extractStatisticalFeatures,
    selectTopFeatures: threat_intelligence_ml_models_kit_1.selectTopFeatures,
    // Model Performance & Versioning (2)
    generateModelPerformanceReport: threat_intelligence_ml_models_kit_1.generateModelPerformanceReport,
    createModelVersion: threat_intelligence_ml_models_kit_1.createModelVersion,
    // Advanced ML Techniques (2)
    createEnsembleModel: threat_intelligence_ml_models_kit_1.createEnsembleModel,
    setupABTest: threat_intelligence_ml_models_kit_1.setupABTest,
    // Scoring Functions (7)
    calculateThreatScore: threat_scoring_kit_1.calculateThreatScore,
    calculateSeverityScore: threat_scoring_kit_1.calculateSeverityScore,
    calculateImpactScore: threat_scoring_kit_1.calculateImpactScore,
    calculateLikelihoodScore: threat_scoring_kit_1.calculateLikelihoodScore,
    calculateConfidenceScore: threat_scoring_kit_1.calculateConfidenceScore,
    calculateRiskScore: threat_scoring_kit_1.calculateRiskScore,
    calculateContextualRisk: threat_scoring_kit_1.calculateContextualRisk,
    // Confidence & Reliability (3)
    computeConfidenceMetrics: threat_scoring_kit_1.computeConfidenceMetrics,
    calculateSourceReliability: threat_scoring_kit_1.calculateSourceReliability,
    aggregateIndicatorConfidence: threat_scoring_kit_1.aggregateIndicatorConfidence,
    // Normalization & Aggregation (3)
    normalizeScore: threat_scoring_kit_1.normalizeScore,
    aggregateCompositeScore: threat_scoring_kit_1.aggregateCompositeScore,
    calculateWeightedAverage: threat_scoring_kit_1.calculateWeightedAverage,
    // Threat Analysis (3)
    identifyThreat: threat_assessment_kit_1.identifyThreat,
    classifyThreat: threat_assessment_kit_1.classifyThreat,
    categorizeThreatByFramework: threat_assessment_kit_1.categorizeThreatByFramework,
    // Threat Actor Analysis (4)
    assessThreatActorProfile: threat_assessment_kit_1.profileThreatActor,
    analyzeThreatActorMotivation: threat_assessment_kit_1.analyzeThreatActorMotivation,
    attributeThreatToActor: threat_assessment_kit_1.attributeThreatToActor,
    getThreatActorCapabilities: threat_assessment_kit_1.getThreatActorCapabilities,
    // Attack Vector Analysis (4)
    analyzeAttackVector: threat_assessment_kit_1.analyzeAttackVector,
    mapAttackPath: threat_assessment_kit_1.mapAttackPath,
    identifyEntryPoints: threat_assessment_kit_1.identifyEntryPoints,
    analyzeAttackTechniques: threat_assessment_kit_1.analyzeAttackTechniques,
    // Threat Severity & Impact (3)
    calculateThreatSeverityScore: threat_assessment_kit_1.calculateThreatSeverityScore,
    evaluateThreatImpact: threat_assessment_kit_1.evaluateThreatImpact,
    calculateExploitabilityScore: threat_assessment_kit_1.calculateExploitabilityScore,
    // Threat Intelligence (3)
    enrichThreatIntelligence: threat_assessment_kit_1.enrichThreatIntelligence,
    validateThreatIntelligence: threat_assessment_kit_1.validateThreatIntelligence,
    queryThreatIntelligenceFeeds: threat_assessment_kit_1.queryThreatIntelligenceFeeds,
};
//# sourceMappingURL=predictive-threat-models-composite.js.map