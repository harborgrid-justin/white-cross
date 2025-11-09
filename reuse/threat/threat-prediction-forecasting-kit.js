"use strict";
/**
 * LOC: THREATPRED001
 * File: /reuse/threat/threat-prediction-forecasting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Security analytics modules
 *   - ML prediction engines
 *   - Anomaly detection systems
 *   - SIEM integrations
 *   - Threat hunting tools
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceFalsePositives = exports.classifyAnomaly = exports.scoreBehavioralAnomaly = exports.detectMLBasedAnomaly = exports.detectStatisticalAnomaly = exports.establishBehaviorBaseline = exports.managePatternLibrary = exports.calculatePatternSimilarity = exports.matchMITREAttackTTP = exports.reconstructAttackChain = exports.clusterThreatBehaviors = exports.matchThreatPatternAlgorithm = exports.detectThreatPatterns = exports.predictCampaignProgression = exports.profileThreatActor = exports.scoreTargetAttractiveness = exports.estimateTimeToAttack = exports.estimateExploitationLikelihood = exports.predictAttackSurfaceExposure = exports.calculateAttackProbability = exports.analyzeIndustryTrends = exports.analyzeGeographicDistribution = exports.calculateThreatVelocity = exports.detectSeasonalPatterns = exports.trackThreatEvolution = exports.identifyEmergingThreats = exports.analyzeThreatTrends = exports.batchPredict = exports.versionMLModel = exports.tuneModelHyperparameters = exports.evaluateModelPerformance = exports.extractThreatFeatures = exports.deployMLModel = exports.trainThreatPredictionModel = exports.forecastAttackTiming = exports.generateComprehensiveRiskScore = exports.predictThreatImpact = exports.modelThreatEvolution = exports.predictAttackVectors = exports.generatePredictionConfidence = exports.updateThreatPrediction = exports.createThreatPrediction = exports.getThreatIntelligenceModelAttributes = exports.getMLModelAttributes = exports.getAnomalyDetectionModelAttributes = exports.getThreatPatternModelAttributes = exports.getThreatForecastModelAttributes = exports.getThreatPredictionModelAttributes = void 0;
/**
 * File: /reuse/threat/threat-prediction-forecasting-kit.ts
 * Locator: WC-UTL-THREATPRED-001
 * Purpose: Comprehensive Threat Prediction & Forecasting Kit - ML-powered threat prediction and anomaly detection
 *
 * Upstream: Independent utility module for threat prediction and forecasting operations
 * Downstream: ../backend/*, Security services, ML engines, Threat intelligence systems, Analytics modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize, ml libraries
 * Exports: 42 utility functions for threat prediction, ML integration, trend analysis, pattern recognition, anomaly detection
 *
 * LLM Context: Enterprise-grade threat prediction and forecasting utilities for White Cross healthcare platform.
 * Provides comprehensive machine learning integration, predictive threat modeling, attack likelihood prediction,
 * threat trend analysis, pattern recognition, anomaly detection, and HIPAA-compliant security analytics for
 * protecting healthcare infrastructure and patient data. Includes Sequelize models for threat predictions,
 * forecasts, patterns, anomalies, ML models, and threat intelligence.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize ThreatPrediction model attributes for ML-based threat predictions.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class ThreatPrediction extends Model {
 *   declare id: string;
 *   declare threatType: string;
 *   declare confidenceScore: number;
 * }
 *
 * ThreatPrediction.init(getThreatPredictionModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_predictions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['predictedSeverity', 'confidenceScore'] },
 *     { fields: ['createdAt', 'status'] },
 *     { fields: ['modelId'] }
 *   ]
 * });
 * ```
 */
const getThreatPredictionModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    threatType: {
        type: 'STRING',
        allowNull: false,
        comment: 'Type of predicted threat (malware, phishing, ransomware, etc.)',
    },
    threatCategory: {
        type: 'STRING',
        allowNull: false,
        comment: 'Category classification (network, endpoint, application, etc.)',
    },
    predictedSeverity: {
        type: 'ENUM',
        values: ['critical', 'high', 'medium', 'low', 'info'],
        allowNull: false,
        comment: 'Predicted severity level of the threat',
    },
    confidenceScore: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0,
            max: 1,
        },
        comment: 'ML model confidence score (0-1)',
    },
    predictionScore: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Overall prediction score combining multiple factors',
    },
    attackVector: {
        type: 'STRING',
        allowNull: true,
        comment: 'Predicted attack vector (network, email, usb, etc.)',
    },
    targetAsset: {
        type: 'STRING',
        allowNull: true,
        comment: 'Predicted target asset or system',
    },
    predictedImpact: {
        type: 'FLOAT',
        allowNull: true,
        comment: 'Predicted business impact score',
    },
    likelihood: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0,
            max: 1,
        },
        comment: 'Likelihood of attack occurrence (0-1)',
    },
    timeToAttack: {
        type: 'INTEGER',
        allowNull: true,
        comment: 'Predicted time to attack in seconds',
    },
    modelId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'ml_models',
            key: 'id',
        },
        comment: 'Reference to the ML model used for prediction',
    },
    features: {
        type: 'JSONB',
        allowNull: false,
        defaultValue: {},
        comment: 'Feature values used for prediction',
    },
    predictions: {
        type: 'JSONB',
        allowNull: false,
        defaultValue: {},
        comment: 'Detailed prediction results and probabilities',
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Additional metadata and context',
    },
    validFrom: {
        type: 'DATE',
        allowNull: false,
        defaultValue: 'NOW',
        comment: 'Prediction valid from timestamp',
    },
    validUntil: {
        type: 'DATE',
        allowNull: true,
        comment: 'Prediction expiration timestamp',
    },
    status: {
        type: 'ENUM',
        values: ['active', 'expired', 'validated', 'false_positive'],
        defaultValue: 'active',
        comment: 'Current prediction status',
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
exports.getThreatPredictionModelAttributes = getThreatPredictionModelAttributes;
/**
 * Sequelize ThreatForecast model attributes for time-series threat forecasting.
 *
 * @example
 * ```typescript
 * class ThreatForecast extends Model {}
 * ThreatForecast.init(getThreatForecastModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_forecasts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['forecastType', 'createdAt'] },
 *     { fields: ['trendDirection'] }
 *   ]
 * });
 * ```
 */
const getThreatForecastModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    forecastType: {
        type: 'STRING',
        allowNull: false,
        comment: 'Type of forecast (attack_volume, threat_emergence, etc.)',
    },
    timeHorizon: {
        type: 'INTEGER',
        allowNull: false,
        comment: 'Forecast time horizon in seconds',
    },
    granularity: {
        type: 'ENUM',
        values: ['hourly', 'daily', 'weekly', 'monthly'],
        allowNull: false,
        comment: 'Forecast data granularity',
    },
    forecastData: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Time-series forecast data points with confidence intervals',
    },
    trendDirection: {
        type: 'ENUM',
        values: ['increasing', 'decreasing', 'stable', 'volatile'],
        allowNull: false,
        comment: 'Overall trend direction',
    },
    seasonalPattern: {
        type: 'JSONB',
        allowNull: true,
        comment: 'Detected seasonal patterns',
    },
    modelAccuracy: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0,
            max: 1,
        },
        comment: 'Forecast model accuracy score',
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
exports.getThreatForecastModelAttributes = getThreatForecastModelAttributes;
/**
 * Sequelize ThreatPattern model attributes for threat pattern recognition.
 *
 * @example
 * ```typescript
 * class ThreatPattern extends Model {}
 * ThreatPattern.init(getThreatPatternModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_patterns',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['patternType', 'severity'] },
 *     { fields: ['isActive'] },
 *     { fields: ['tactics'], using: 'gin' }
 *   ]
 * });
 * ```
 */
const getThreatPatternModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    patternName: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'Unique pattern identifier name',
    },
    patternType: {
        type: 'ENUM',
        values: ['signature', 'behavioral', 'anomaly', 'composite'],
        allowNull: false,
        comment: 'Type of threat pattern',
    },
    description: {
        type: 'TEXT',
        allowNull: false,
        comment: 'Detailed pattern description',
    },
    tactics: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'MITRE ATT&CK tactics',
    },
    techniques: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'MITRE ATT&CK techniques',
    },
    procedures: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'Specific procedures and methods',
    },
    indicators: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Pattern indicators with confidence scores',
    },
    attackChain: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'Attack chain phases',
    },
    severity: {
        type: 'ENUM',
        values: ['critical', 'high', 'medium', 'low'],
        allowNull: false,
        comment: 'Pattern severity level',
    },
    prevalence: {
        type: 'FLOAT',
        defaultValue: 0,
        comment: 'Pattern prevalence score',
    },
    matchingRules: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Pattern matching rules and conditions',
    },
    similarityThreshold: {
        type: 'FLOAT',
        defaultValue: 0.8,
        validate: {
            min: 0,
            max: 1,
        },
        comment: 'Similarity threshold for pattern matching',
    },
    isActive: {
        type: 'BOOLEAN',
        defaultValue: true,
        comment: 'Whether pattern is actively used',
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
exports.getThreatPatternModelAttributes = getThreatPatternModelAttributes;
/**
 * Sequelize AnomalyDetection model attributes for anomaly tracking.
 *
 * @example
 * ```typescript
 * class AnomalyDetection extends Model {}
 * AnomalyDetection.init(getAnomalyDetectionModelAttributes(), {
 *   sequelize,
 *   tableName: 'anomaly_detections',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['anomalyScore', 'severity'] },
 *     { fields: ['detectionMethod'] },
 *     { fields: ['createdAt'] }
 *   ]
 * });
 * ```
 */
const getAnomalyDetectionModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    anomalyType: {
        type: 'STRING',
        allowNull: false,
        comment: 'Type of anomaly detected',
    },
    detectionMethod: {
        type: 'ENUM',
        values: ['statistical', 'ml', 'behavioral', 'hybrid'],
        allowNull: false,
        comment: 'Method used for anomaly detection',
    },
    anomalyScore: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Anomaly score (higher = more anomalous)',
    },
    severity: {
        type: 'ENUM',
        values: ['critical', 'high', 'medium', 'low'],
        allowNull: false,
        comment: 'Anomaly severity',
    },
    baselineId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Reference to baseline used for comparison',
    },
    observedValue: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Observed value that triggered anomaly',
    },
    expectedValue: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Expected value based on baseline',
    },
    deviation: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Absolute deviation from expected',
    },
    standardDeviations: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Number of standard deviations from mean',
    },
    context: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Context and additional details',
    },
    affectedEntities: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'Entities affected by the anomaly',
    },
    isConfirmed: {
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Whether anomaly has been confirmed',
    },
    falsePositive: {
        type: 'BOOLEAN',
        defaultValue: false,
        comment: 'Whether anomaly was determined to be false positive',
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
exports.getAnomalyDetectionModelAttributes = getAnomalyDetectionModelAttributes;
/**
 * Sequelize MLModel model attributes for machine learning model management.
 *
 * @example
 * ```typescript
 * class MLModel extends Model {}
 * MLModel.init(getMLModelAttributes(), {
 *   sequelize,
 *   tableName: 'ml_models',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['status'] },
 *     { fields: ['modelType', 'version'] }
 *   ]
 * });
 * ```
 */
const getMLModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    modelName: {
        type: 'STRING',
        allowNull: false,
        comment: 'Model name',
    },
    modelType: {
        type: 'ENUM',
        values: ['classification', 'regression', 'clustering', 'anomaly_detection', 'time_series'],
        allowNull: false,
        comment: 'Type of ML model',
    },
    algorithm: {
        type: 'STRING',
        allowNull: false,
        comment: 'ML algorithm used (random_forest, neural_network, etc.)',
    },
    version: {
        type: 'STRING',
        allowNull: false,
        comment: 'Model version',
    },
    trainingData: {
        type: 'JSONB',
        allowNull: false,
        comment: 'Training dataset metadata',
    },
    hyperparameters: {
        type: 'JSONB',
        allowNull: false,
        defaultValue: {},
        comment: 'Model hyperparameters',
    },
    performance: {
        type: 'JSONB',
        allowNull: false,
        defaultValue: {},
        comment: 'Model performance metrics',
    },
    status: {
        type: 'ENUM',
        values: ['training', 'deployed', 'deprecated', 'failed'],
        allowNull: false,
        defaultValue: 'training',
        comment: 'Model deployment status',
    },
    deployedAt: {
        type: 'DATE',
        allowNull: true,
        comment: 'Deployment timestamp',
    },
    retrainSchedule: {
        type: 'STRING',
        allowNull: true,
        comment: 'Cron schedule for model retraining',
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
exports.getMLModelAttributes = getMLModelAttributes;
/**
 * Sequelize ThreatIntelligence model attributes for threat intelligence data.
 *
 * @example
 * ```typescript
 * class ThreatIntelligence extends Model {}
 * ThreatIntelligence.init(getThreatIntelligenceModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_intelligence',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['iocType', 'iocValue'] },
 *     { fields: ['severity', 'confidence'] },
 *     { fields: ['isActive'] },
 *     { fields: ['tags'], using: 'gin' }
 *   ]
 * });
 * ```
 */
const getThreatIntelligenceModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    sourceType: {
        type: 'ENUM',
        values: ['feed', 'report', 'osint', 'internal', 'vendor'],
        allowNull: false,
        comment: 'Source of threat intelligence',
    },
    sourceName: {
        type: 'STRING',
        allowNull: false,
        comment: 'Name of the intelligence source',
    },
    iocType: {
        type: 'ENUM',
        values: ['ip', 'domain', 'url', 'hash', 'email', 'cve', 'signature'],
        allowNull: false,
        comment: 'Type of indicator of compromise',
    },
    iocValue: {
        type: 'STRING',
        allowNull: false,
        comment: 'IOC value',
    },
    threatType: {
        type: 'STRING',
        allowNull: false,
        comment: 'Type of threat',
    },
    severity: {
        type: 'ENUM',
        values: ['critical', 'high', 'medium', 'low'],
        allowNull: false,
        comment: 'Threat severity',
    },
    confidence: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0,
            max: 1,
        },
        comment: 'Intelligence confidence score',
    },
    firstSeen: {
        type: 'DATE',
        allowNull: false,
        comment: 'First observation timestamp',
    },
    lastSeen: {
        type: 'DATE',
        allowNull: false,
        comment: 'Last observation timestamp',
    },
    tags: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'Intelligence tags',
    },
    attribution: {
        type: 'STRING',
        allowNull: true,
        comment: 'Threat actor attribution',
    },
    campaignId: {
        type: 'STRING',
        allowNull: true,
        comment: 'Related campaign identifier',
    },
    relatedIOCs: {
        type: 'ARRAY(STRING)',
        defaultValue: [],
        comment: 'Related IOC identifiers',
    },
    context: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Additional context and details',
    },
    isActive: {
        type: 'BOOLEAN',
        defaultValue: true,
        comment: 'Whether intelligence is still active',
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
exports.getThreatIntelligenceModelAttributes = getThreatIntelligenceModelAttributes;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const generateId = () => crypto.randomUUID();
const calculateConfidence = (factors) => {
    if (factors.length === 0)
        return 0;
    const sum = factors.reduce((a, b) => a + b, 0);
    return Math.min(1, sum / factors.length);
};
const normalizeScore = (value, min, max) => {
    if (max === min)
        return 0.5;
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
};
const calculateStandardDeviations = (value, mean, stdDev) => {
    if (stdDev === 0)
        return 0;
    return Math.abs((value - mean) / stdDev);
};
// ============================================================================
// PREDICTIVE THREAT MODELING FUNCTIONS (8 functions)
// ============================================================================
/**
 * Creates a comprehensive threat prediction model with ML-based analysis.
 *
 * @param {PredictionInput} input - Prediction input features
 * @param {string} modelId - ML model identifier
 * @returns {Promise<ThreatPrediction>} Generated threat prediction
 *
 * @example
 * ```typescript
 * const prediction = await createThreatPrediction(
 *   {
 *     features: {
 *       networkTraffic: 15000,
 *       failedLogins: 50,
 *       unusualPorts: 3,
 *       geoLocation: 'suspicious-region'
 *     },
 *     context: { assetId: 'server-123' }
 *   },
 *   'ml-model-uuid'
 * );
 * console.log('Predicted severity:', prediction.predictedSeverity);
 * console.log('Confidence:', prediction.confidenceScore);
 * ```
 */
const createThreatPrediction = async (input, modelId) => {
    // Simulate ML prediction (in production, call actual ML service)
    const featureValues = Object.values(input.features).filter(v => typeof v === 'number');
    const predictionScore = featureValues.reduce((sum, val) => sum + val, 0) / featureValues.length;
    const confidenceScore = calculateConfidence([0.85, 0.92, 0.78]);
    const likelihood = normalizeScore(predictionScore, 0, 1000);
    const prediction = {
        id: generateId(),
        threatType: 'advanced_persistent_threat',
        threatCategory: 'network',
        predictedSeverity: predictionScore > 800 ? 'critical' : predictionScore > 600 ? 'high' : predictionScore > 400 ? 'medium' : 'low',
        confidenceScore,
        predictionScore,
        attackVector: 'network',
        targetAsset: input.context?.assetId,
        predictedImpact: predictionScore * 0.8,
        likelihood,
        timeToAttack: Math.floor(3600 * (1 - likelihood)),
        modelId,
        features: input.features,
        predictions: {
            threatTypes: { apt: 0.75, malware: 0.15, ddos: 0.10 },
            attackVectors: { network: 0.60, email: 0.30, usb: 0.10 }
        },
        metadata: { generatedBy: 'createThreatPrediction' },
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 86400000),
        status: 'active'
    };
    return prediction;
};
exports.createThreatPrediction = createThreatPrediction;
/**
 * Updates existing threat prediction with new data and recalculates scores.
 *
 * @param {string} predictionId - Prediction identifier
 * @param {Partial<PredictionInput>} updates - Updated prediction data
 * @returns {Promise<ThreatPrediction>} Updated prediction
 *
 * @example
 * ```typescript
 * const updated = await updateThreatPrediction(
 *   'pred-123',
 *   {
 *     features: { failedLogins: 75 },
 *     context: { status: 'escalated' }
 *   }
 * );
 * ```
 */
const updateThreatPrediction = async (predictionId, updates) => {
    // In production: fetch existing prediction, merge updates, recalculate
    const updatedScore = updates.features ? Object.values(updates.features).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / Object.keys(updates.features).length : 500;
    return {
        id: predictionId,
        threatType: 'updated_threat',
        threatCategory: 'network',
        predictedSeverity: updatedScore > 600 ? 'high' : 'medium',
        confidenceScore: 0.88,
        predictionScore: updatedScore,
        likelihood: normalizeScore(updatedScore, 0, 1000),
        modelId: 'ml-model-uuid',
        features: updates.features || {},
        predictions: { updated: true },
        validFrom: new Date(),
        status: 'active'
    };
};
exports.updateThreatPrediction = updateThreatPrediction;
/**
 * Generates comprehensive confidence score for threat predictions.
 *
 * @param {Record<string, any>} features - Feature values used in prediction
 * @param {Record<string, any>} modelPerformance - Model performance metrics
 * @returns {number} Calculated confidence score (0-1)
 *
 * @example
 * ```typescript
 * const confidence = generatePredictionConfidence(
 *   { feature1: 0.8, feature2: 0.9 },
 *   { accuracy: 0.95, precision: 0.92 }
 * );
 * console.log('Prediction confidence:', confidence);
 * ```
 */
const generatePredictionConfidence = (features, modelPerformance) => {
    const featureCompleteness = Object.keys(features).length / 10; // Assume 10 ideal features
    const modelAccuracy = modelPerformance.accuracy || 0.8;
    const dataQuality = Object.values(features).filter(v => v !== null && v !== undefined).length / Object.keys(features).length;
    return calculateConfidence([featureCompleteness, modelAccuracy, dataQuality]);
};
exports.generatePredictionConfidence = generatePredictionConfidence;
/**
 * Predicts potential attack vectors based on threat intelligence and patterns.
 *
 * @param {string} threatType - Type of threat
 * @param {Record<string, any>} environmentData - Environment and asset data
 * @returns {Promise<Array<{ vector: string; likelihood: number; mitigation: string }>>} Predicted attack vectors
 *
 * @example
 * ```typescript
 * const vectors = await predictAttackVectors(
 *   'ransomware',
 *   { openPorts: [80, 443, 3389], emailGateway: 'enabled' }
 * );
 * vectors.forEach(v => console.log(`${v.vector}: ${v.likelihood}`));
 * ```
 */
const predictAttackVectors = async (threatType, environmentData) => {
    const vectors = [];
    if (environmentData.openPorts?.includes(3389)) {
        vectors.push({
            vector: 'rdp_exploitation',
            likelihood: 0.85,
            mitigation: 'Restrict RDP access, enable MFA, use VPN'
        });
    }
    if (environmentData.emailGateway === 'enabled') {
        vectors.push({
            vector: 'phishing_email',
            likelihood: 0.70,
            mitigation: 'Email filtering, user training, DMARC/SPF'
        });
    }
    vectors.push({
        vector: 'web_application',
        likelihood: 0.60,
        mitigation: 'WAF deployment, input validation, regular patching'
    });
    return vectors.sort((a, b) => b.likelihood - a.likelihood);
};
exports.predictAttackVectors = predictAttackVectors;
/**
 * Models threat evolution over time based on historical data.
 *
 * @param {string} threatId - Threat identifier
 * @param {number} timeHorizon - Time horizon in seconds
 * @returns {Promise<Array<{ timestamp: Date; severity: string; confidence: number }>>} Evolution timeline
 *
 * @example
 * ```typescript
 * const evolution = await modelThreatEvolution('threat-123', 86400 * 7);
 * console.log('Threat evolution over 7 days:', evolution);
 * ```
 */
const modelThreatEvolution = async (threatId, timeHorizon) => {
    const steps = 10;
    const interval = timeHorizon / steps;
    const evolution = [];
    for (let i = 0; i < steps; i++) {
        const timestamp = new Date(Date.now() + interval * i * 1000);
        const progress = i / steps;
        const severity = progress < 0.3 ? 'low' : progress < 0.6 ? 'medium' : progress < 0.8 ? 'high' : 'critical';
        const confidence = 0.9 - (progress * 0.2); // Confidence decreases further into future
        evolution.push({ timestamp, severity, confidence });
    }
    return evolution;
};
exports.modelThreatEvolution = modelThreatEvolution;
/**
 * Predicts potential impact of threat on business operations.
 *
 * @param {ThreatPrediction} prediction - Threat prediction data
 * @param {Record<string, any>} assetValue - Asset valuation and criticality
 * @returns {Promise<{ financialImpact: number; operationalImpact: number; reputationalImpact: number }>} Impact assessment
 *
 * @example
 * ```typescript
 * const impact = await predictThreatImpact(
 *   prediction,
 *   { assetValue: 1000000, criticality: 'high' }
 * );
 * console.log('Estimated financial impact: $', impact.financialImpact);
 * ```
 */
const predictThreatImpact = async (prediction, assetValue) => {
    const baseDamage = assetValue.assetValue || 100000;
    const severityMultiplier = {
        critical: 0.8,
        high: 0.5,
        medium: 0.3,
        low: 0.1,
        info: 0.01
    };
    const multiplier = severityMultiplier[prediction.predictedSeverity];
    return {
        financialImpact: baseDamage * multiplier * prediction.likelihood,
        operationalImpact: prediction.likelihood * (assetValue.criticality === 'high' ? 0.9 : 0.5),
        reputationalImpact: prediction.predictedSeverity === 'critical' ? 0.8 : 0.4
    };
};
exports.predictThreatImpact = predictThreatImpact;
/**
 * Generates comprehensive risk score combining multiple threat factors.
 *
 * @param {ThreatPrediction[]} predictions - Array of threat predictions
 * @param {Record<string, any>} contextData - Contextual risk factors
 * @returns {number} Overall risk score (0-100)
 *
 * @example
 * ```typescript
 * const riskScore = generateComprehensiveRiskScore(
 *   [prediction1, prediction2],
 *   { vulnerabilities: 15, exposureScore: 0.7 }
 * );
 * console.log('Overall risk score:', riskScore);
 * ```
 */
const generateComprehensiveRiskScore = (predictions, contextData) => {
    if (predictions.length === 0)
        return 0;
    const avgPredictionScore = predictions.reduce((sum, p) => sum + p.predictionScore, 0) / predictions.length;
    const maxSeverity = predictions.some(p => p.predictedSeverity === 'critical') ? 100 :
        predictions.some(p => p.predictedSeverity === 'high') ? 75 : 50;
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidenceScore, 0) / predictions.length;
    const vulnerabilityFactor = (contextData.vulnerabilities || 0) * 2;
    const exposureFactor = (contextData.exposureScore || 0.5) * 30;
    const riskScore = (avgPredictionScore / 10) + maxSeverity + vulnerabilityFactor + exposureFactor;
    return Math.min(100, riskScore * avgConfidence);
};
exports.generateComprehensiveRiskScore = generateComprehensiveRiskScore;
/**
 * Forecasts attack timing based on threat intelligence and patterns.
 *
 * @param {string} threatType - Type of threat
 * @param {ThreatIntelligence[]} intelligence - Threat intelligence data
 * @returns {Promise<{ estimatedTime: Date; confidence: number; factors: string[] }>} Attack timing forecast
 *
 * @example
 * ```typescript
 * const timing = await forecastAttackTiming('ransomware', intelligenceData);
 * console.log('Estimated attack time:', timing.estimatedTime);
 * console.log('Confidence:', timing.confidence);
 * ```
 */
const forecastAttackTiming = async (threatType, intelligence) => {
    const recentActivity = intelligence.filter(i => new Date(i.lastSeen).getTime() > Date.now() - 86400000 * 7);
    const activityLevel = recentActivity.length / Math.max(1, intelligence.length);
    const avgConfidence = intelligence.reduce((sum, i) => sum + i.confidence, 0) / intelligence.length;
    // Estimate based on activity trends
    const hoursUntilAttack = activityLevel > 0.7 ? 24 : activityLevel > 0.4 ? 72 : 168;
    return {
        estimatedTime: new Date(Date.now() + hoursUntilAttack * 3600000),
        confidence: avgConfidence * activityLevel,
        factors: [
            `Recent activity: ${(activityLevel * 100).toFixed(0)}%`,
            `Intelligence sources: ${intelligence.length}`,
            `Threat type: ${threatType}`
        ]
    };
};
exports.forecastAttackTiming = forecastAttackTiming;
// ============================================================================
// MACHINE LEARNING INTEGRATION FUNCTIONS (7 functions)
// ============================================================================
/**
 * Trains a new ML model for threat prediction with comprehensive configuration.
 *
 * @param {MLTrainingConfig} config - Training configuration
 * @returns {Promise<MLModel>} Trained model metadata
 *
 * @example
 * ```typescript
 * const model = await trainThreatPredictionModel({
 *   datasetId: 'dataset-123',
 *   modelType: 'classification',
 *   algorithm: 'random_forest',
 *   hyperparameters: {
 *     n_estimators: 100,
 *     max_depth: 10,
 *     min_samples_split: 5
 *   },
 *   validationSplit: 0.2
 * });
 * console.log('Model accuracy:', model.performance.accuracy);
 * ```
 */
const trainThreatPredictionModel = async (config) => {
    // Simulate model training (in production, call ML training service)
    const trainingTime = Math.random() * 5000 + 1000;
    await new Promise(resolve => setTimeout(resolve, trainingTime));
    const model = {
        id: generateId(),
        modelName: `threat_${config.modelType}_${Date.now()}`,
        modelType: config.modelType,
        algorithm: config.algorithm,
        version: '1.0.0',
        trainingData: {
            datasetId: config.datasetId,
            sampleCount: 10000,
            features: ['network_traffic', 'failed_logins', 'unusual_ports', 'geo_anomaly'],
            labels: ['benign', 'malicious']
        },
        hyperparameters: config.hyperparameters,
        performance: {
            accuracy: 0.92 + Math.random() * 0.05,
            precision: 0.89 + Math.random() * 0.05,
            recall: 0.87 + Math.random() * 0.05,
            f1Score: 0.88 + Math.random() * 0.05,
            auc: 0.94 + Math.random() * 0.04
        },
        status: 'deployed',
        deployedAt: new Date(),
        retrainSchedule: '0 2 * * 0', // Weekly on Sundays at 2 AM
        metadata: { trainingDuration: trainingTime }
    };
    return model;
};
exports.trainThreatPredictionModel = trainThreatPredictionModel;
/**
 * Deploys trained ML model to production for real-time predictions.
 *
 * @param {string} modelId - Model identifier
 * @param {Record<string, any>} deploymentConfig - Deployment configuration
 * @returns {Promise<{ deployed: boolean; endpoint: string; version: string }>} Deployment result
 *
 * @example
 * ```typescript
 * const deployment = await deployMLModel(
 *   'model-123',
 *   { replicas: 3, resources: { cpu: '2', memory: '4Gi' } }
 * );
 * console.log('Model endpoint:', deployment.endpoint);
 * ```
 */
const deployMLModel = async (modelId, deploymentConfig) => {
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
        deployed: true,
        endpoint: `https://ml-api.whitecross.com/models/${modelId}/predict`,
        version: '1.0.0'
    };
};
exports.deployMLModel = deployMLModel;
/**
 * Extracts relevant features from raw threat data for ML model input.
 *
 * @param {Record<string, any>} rawData - Raw threat event data
 * @param {string[]} featureDefinitions - Feature extraction definitions
 * @returns {Record<string, any>} Extracted and normalized features
 *
 * @example
 * ```typescript
 * const features = extractThreatFeatures(
 *   {
 *     timestamp: new Date(),
 *     sourceIp: '192.168.1.100',
 *     destPort: 3389,
 *     packetCount: 1500
 *   },
 *   ['sourceIp', 'destPort', 'packetCount', 'hour_of_day']
 * );
 * console.log('Extracted features:', features);
 * ```
 */
const extractThreatFeatures = (rawData, featureDefinitions) => {
    const features = {};
    featureDefinitions.forEach(feature => {
        switch (feature) {
            case 'hour_of_day':
                features[feature] = rawData.timestamp ? new Date(rawData.timestamp).getHours() : 0;
                break;
            case 'day_of_week':
                features[feature] = rawData.timestamp ? new Date(rawData.timestamp).getDay() : 0;
                break;
            case 'packet_rate':
                features[feature] = rawData.packetCount ? rawData.packetCount / 60 : 0;
                break;
            case 'port_risk_score':
                const riskyPorts = [3389, 445, 135, 139];
                features[feature] = riskyPorts.includes(rawData.destPort) ? 0.9 : 0.3;
                break;
            default:
                features[feature] = rawData[feature] || 0;
        }
    });
    return features;
};
exports.extractThreatFeatures = extractThreatFeatures;
/**
 * Evaluates ML model performance with comprehensive metrics.
 *
 * @param {string} modelId - Model identifier
 * @param {Record<string, any>[]} testData - Test dataset
 * @returns {Promise<Record<string, number>>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await evaluateModelPerformance('model-123', testDataset);
 * console.log('Accuracy:', metrics.accuracy);
 * console.log('F1 Score:', metrics.f1Score);
 * console.log('AUC:', metrics.auc);
 * ```
 */
const evaluateModelPerformance = async (modelId, testData) => {
    // Simulate model evaluation
    const predictions = testData.length;
    const correctPredictions = Math.floor(predictions * (0.88 + Math.random() * 0.08));
    return {
        accuracy: correctPredictions / predictions,
        precision: 0.87 + Math.random() * 0.08,
        recall: 0.85 + Math.random() * 0.08,
        f1Score: 0.86 + Math.random() * 0.08,
        auc: 0.91 + Math.random() * 0.06,
        testSamples: predictions,
        correctPredictions
    };
};
exports.evaluateModelPerformance = evaluateModelPerformance;
/**
 * Tunes ML model hyperparameters for optimal performance.
 *
 * @param {string} modelType - Type of ML model
 * @param {Record<string, any>} searchSpace - Hyperparameter search space
 * @param {number} trials - Number of tuning trials
 * @returns {Promise<{ bestParams: Record<string, any>; bestScore: number }>} Optimal hyperparameters
 *
 * @example
 * ```typescript
 * const tuning = await tuneModelHyperparameters(
 *   'random_forest',
 *   {
 *     n_estimators: [50, 100, 200],
 *     max_depth: [5, 10, 15, 20],
 *     min_samples_split: [2, 5, 10]
 *   },
 *   20
 * );
 * console.log('Best parameters:', tuning.bestParams);
 * console.log('Best score:', tuning.bestScore);
 * ```
 */
const tuneModelHyperparameters = async (modelType, searchSpace, trials) => {
    // Simulate hyperparameter tuning
    await new Promise(resolve => setTimeout(resolve, 1000));
    const bestParams = {};
    Object.keys(searchSpace).forEach(param => {
        const values = searchSpace[param];
        bestParams[param] = Array.isArray(values)
            ? values[Math.floor(Math.random() * values.length)]
            : values;
    });
    return {
        bestParams,
        bestScore: 0.91 + Math.random() * 0.06
    };
};
exports.tuneModelHyperparameters = tuneModelHyperparameters;
/**
 * Manages ML model versioning and tracks model lineage.
 *
 * @param {string} modelId - Model identifier
 * @param {string} versionTag - Version tag or number
 * @param {Record<string, any>} changes - Changes from previous version
 * @returns {Promise<MLModel>} Versioned model
 *
 * @example
 * ```typescript
 * const newVersion = await versionMLModel(
 *   'model-123',
 *   '2.0.0',
 *   {
 *     algorithm: 'gradient_boosting',
 *     performance_improvement: 0.05
 *   }
 * );
 * console.log('New version:', newVersion.version);
 * ```
 */
const versionMLModel = async (modelId, versionTag, changes) => {
    return {
        id: generateId(),
        modelName: `threat_model_${versionTag}`,
        modelType: 'classification',
        algorithm: changes.algorithm || 'random_forest',
        version: versionTag,
        trainingData: {
            datasetId: 'dataset-123',
            sampleCount: 15000,
            features: ['network_traffic', 'failed_logins'],
            labels: ['benign', 'malicious']
        },
        hyperparameters: {},
        performance: {
            accuracy: 0.94,
            precision: 0.92,
            recall: 0.91,
            f1Score: 0.915
        },
        status: 'deployed',
        deployedAt: new Date(),
        metadata: { previousVersion: modelId, changes }
    };
};
exports.versionMLModel = versionMLModel;
/**
 * Executes batch predictions on large datasets efficiently.
 *
 * @param {string} modelId - Model identifier
 * @param {PredictionInput[]} inputs - Array of prediction inputs
 * @returns {Promise<ThreatPrediction[]>} Array of predictions
 *
 * @example
 * ```typescript
 * const predictions = await batchPredict('model-123', [
 *   { features: { traffic: 1000, logins: 5 } },
 *   { features: { traffic: 5000, logins: 50 } },
 *   { features: { traffic: 500, logins: 2 } }
 * ]);
 * console.log(`Generated ${predictions.length} predictions`);
 * ```
 */
const batchPredict = async (modelId, inputs) => {
    // Process in batches for efficiency
    const batchSize = 100;
    const results = [];
    for (let i = 0; i < inputs.length; i += batchSize) {
        const batch = inputs.slice(i, i + batchSize);
        const batchPredictions = await Promise.all(batch.map(input => (0, exports.createThreatPrediction)(input, modelId)));
        results.push(...batchPredictions);
    }
    return results;
};
exports.batchPredict = batchPredict;
// ============================================================================
// THREAT TREND ANALYSIS FUNCTIONS (7 functions)
// ============================================================================
/**
 * Analyzes threat trends over specified time period with statistical methods.
 *
 * @param {TrendAnalysisConfig} config - Trend analysis configuration
 * @returns {Promise<ThreatForecast>} Trend analysis results
 *
 * @example
 * ```typescript
 * const trends = await analyzeThreatTrends({
 *   timeRange: {
 *     start: new Date('2025-01-01'),
 *     end: new Date('2025-11-09')
 *   },
 *   granularity: 'daily',
 *   includeSeasonality: true
 * });
 * console.log('Trend direction:', trends.trendDirection);
 * console.log('Model accuracy:', trends.modelAccuracy);
 * ```
 */
const analyzeThreatTrends = async (config) => {
    const days = Math.floor((config.timeRange.end.getTime() - config.timeRange.start.getTime()) / 86400000);
    const forecastData = [];
    for (let i = 0; i < days; i++) {
        const timestamp = new Date(config.timeRange.start.getTime() + i * 86400000);
        const baseValue = 100 + Math.sin(i / 7) * 20; // Weekly pattern
        const trend = i * 2; // Increasing trend
        const noise = Math.random() * 10;
        forecastData.push({
            timestamp,
            value: baseValue + trend + noise,
            confidence: 0.85,
            upperBound: baseValue + trend + noise + 15,
            lowerBound: baseValue + trend + noise - 15
        });
    }
    return {
        id: generateId(),
        forecastType: 'threat_volume',
        timeHorizon: days * 86400,
        granularity: config.granularity,
        forecastData,
        trendDirection: 'increasing',
        seasonalPattern: config.includeSeasonality ? { weeklyPeak: 'friday', monthlyPeak: 'month_end' } : undefined,
        modelAccuracy: 0.87,
        metadata: { analysisDate: new Date() }
    };
};
exports.analyzeThreatTrends = analyzeThreatTrends;
/**
 * Identifies emerging threats based on intelligence and pattern changes.
 *
 * @param {ThreatIntelligence[]} intelligence - Recent threat intelligence
 * @param {number} lookbackDays - Days to look back for comparison
 * @returns {Promise<Array<{ threat: string; growthRate: number; severity: string }>>} Emerging threats
 *
 * @example
 * ```typescript
 * const emerging = await identifyEmergingThreats(intelligenceData, 30);
 * emerging.forEach(threat => {
 *   console.log(`${threat.threat}: ${(threat.growthRate * 100).toFixed(0)}% growth`);
 * });
 * ```
 */
const identifyEmergingThreats = async (intelligence, lookbackDays) => {
    const cutoffDate = new Date(Date.now() - lookbackDays * 86400000);
    const recentThreats = intelligence.filter(i => new Date(i.firstSeen) > cutoffDate);
    const threatCounts = {};
    recentThreats.forEach(i => {
        threatCounts[i.threatType] = (threatCounts[i.threatType] || 0) + 1;
    });
    const emerging = Object.entries(threatCounts)
        .map(([threat, count]) => ({
        threat,
        growthRate: count / lookbackDays,
        severity: count > 10 ? 'high' : count > 5 ? 'medium' : 'low'
    }))
        .sort((a, b) => b.growthRate - a.growthRate)
        .slice(0, 10);
    return emerging;
};
exports.identifyEmergingThreats = identifyEmergingThreats;
/**
 * Tracks threat evolution and lifecycle changes over time.
 *
 * @param {string} threatType - Type of threat to track
 * @param {ThreatPrediction[]} historicalData - Historical prediction data
 * @returns {Promise<Array<{ period: string; severity: string; volume: number }>>} Evolution timeline
 *
 * @example
 * ```typescript
 * const evolution = await trackThreatEvolution('ransomware', historicalPredictions);
 * console.log('Threat evolution:', evolution);
 * ```
 */
const trackThreatEvolution = async (threatType, historicalData) => {
    const relevantData = historicalData.filter(p => p.threatType === threatType);
    const monthlyData = {};
    relevantData.forEach(p => {
        const month = new Date(p.validFrom).toISOString().slice(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { high: 0, medium: 0, low: 0 };
        }
        if (p.predictedSeverity === 'critical' || p.predictedSeverity === 'high') {
            monthlyData[month].high++;
        }
        else if (p.predictedSeverity === 'medium') {
            monthlyData[month].medium++;
        }
        else {
            monthlyData[month].low++;
        }
    });
    return Object.entries(monthlyData).map(([period, counts]) => ({
        period,
        severity: counts.high > counts.medium ? 'high' : 'medium',
        volume: counts.high + counts.medium + counts.low
    }));
};
exports.trackThreatEvolution = trackThreatEvolution;
/**
 * Detects seasonal patterns in threat activity.
 *
 * @param {ThreatIntelligence[]} intelligence - Historical intelligence data
 * @param {number} minPeriods - Minimum periods for pattern detection
 * @returns {Promise<Record<string, any>>} Detected seasonal patterns
 *
 * @example
 * ```typescript
 * const patterns = await detectSeasonalPatterns(intelligenceData, 12);
 * console.log('Peak day:', patterns.weeklyPeak);
 * console.log('Peak month:', patterns.monthlyPeak);
 * ```
 */
const detectSeasonalPatterns = async (intelligence, minPeriods) => {
    const dayOfWeekCounts = new Array(7).fill(0);
    const monthCounts = new Array(12).fill(0);
    const hourCounts = new Array(24).fill(0);
    intelligence.forEach(i => {
        const date = new Date(i.firstSeen);
        dayOfWeekCounts[date.getDay()]++;
        monthCounts[date.getMonth()]++;
        hourCounts[date.getHours()]++;
    });
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        weeklyPeak: daysOfWeek[dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts))],
        monthlyPeak: months[monthCounts.indexOf(Math.max(...monthCounts))],
        hourlyPeak: hourCounts.indexOf(Math.max(...hourCounts)),
        weeklyPattern: dayOfWeekCounts,
        monthlyPattern: monthCounts,
        hourlyPattern: hourCounts
    };
};
exports.detectSeasonalPatterns = detectSeasonalPatterns;
/**
 * Calculates threat velocity (rate of change) over time.
 *
 * @param {ThreatPrediction[]} predictions - Recent threat predictions
 * @param {number} windowSize - Time window in seconds
 * @returns {number} Threat velocity score
 *
 * @example
 * ```typescript
 * const velocity = calculateThreatVelocity(recentPredictions, 3600);
 * console.log('Threat velocity (per hour):', velocity);
 * ```
 */
const calculateThreatVelocity = (predictions, windowSize) => {
    if (predictions.length < 2)
        return 0;
    const sortedPredictions = predictions.sort((a, b) => new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime());
    const recentWindow = sortedPredictions.filter(p => new Date(p.validFrom).getTime() > Date.now() - windowSize * 1000);
    if (recentWindow.length === 0)
        return 0;
    const avgSeverity = recentWindow.reduce((sum, p) => {
        const severityScores = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
        return sum + severityScores[p.predictedSeverity];
    }, 0) / recentWindow.length;
    return (recentWindow.length / (windowSize / 3600)) * avgSeverity; // Threats per hour weighted by severity
};
exports.calculateThreatVelocity = calculateThreatVelocity;
/**
 * Analyzes geographic distribution of threats.
 *
 * @param {ThreatIntelligence[]} intelligence - Threat intelligence with geo data
 * @returns {Promise<Array<{ region: string; count: number; severity: string }>>} Geographic distribution
 *
 * @example
 * ```typescript
 * const distribution = await analyzeGeographicDistribution(intelligenceData);
 * distribution.forEach(region => {
 *   console.log(`${region.region}: ${region.count} threats`);
 * });
 * ```
 */
const analyzeGeographicDistribution = async (intelligence) => {
    const regionCounts = {};
    intelligence.forEach(i => {
        const region = i.context?.region || 'unknown';
        if (!regionCounts[region]) {
            regionCounts[region] = { count: 0, criticalCount: 0 };
        }
        regionCounts[region].count++;
        if (i.severity === 'critical' || i.severity === 'high') {
            regionCounts[region].criticalCount++;
        }
    });
    return Object.entries(regionCounts)
        .map(([region, data]) => ({
        region,
        count: data.count,
        severity: data.criticalCount / data.count > 0.5 ? 'high' : 'medium'
    }))
        .sort((a, b) => b.count - a.count);
};
exports.analyzeGeographicDistribution = analyzeGeographicDistribution;
/**
 * Identifies industry-specific threat trends.
 *
 * @param {string} industry - Industry sector (healthcare, finance, etc.)
 * @param {ThreatIntelligence[]} intelligence - Threat intelligence data
 * @returns {Promise<Array<{ threat: string; prevalence: number; trend: string }>>} Industry trends
 *
 * @example
 * ```typescript
 * const trends = await analyzeIndustryTrends('healthcare', intelligenceData);
 * console.log('Top healthcare threats:', trends.slice(0, 5));
 * ```
 */
const analyzeIndustryTrends = async (industry, intelligence) => {
    const industryThreats = intelligence.filter(i => i.tags.includes(industry) || i.context?.targetIndustry === industry);
    const threatCounts = {};
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    const sixtyDaysAgo = Date.now() - 60 * 86400000;
    industryThreats.forEach(i => {
        const timestamp = new Date(i.firstSeen).getTime();
        if (!threatCounts[i.threatType]) {
            threatCounts[i.threatType] = [0, 0]; // [last 30 days, previous 30 days]
        }
        if (timestamp > thirtyDaysAgo) {
            threatCounts[i.threatType][0]++;
        }
        else if (timestamp > sixtyDaysAgo) {
            threatCounts[i.threatType][1]++;
        }
    });
    return Object.entries(threatCounts)
        .map(([threat, counts]) => ({
        threat,
        prevalence: counts[0] / Math.max(1, industryThreats.length),
        trend: counts[0] > counts[1] * 1.2 ? 'increasing' : counts[0] < counts[1] * 0.8 ? 'decreasing' : 'stable'
    }))
        .sort((a, b) => b.prevalence - a.prevalence);
};
exports.analyzeIndustryTrends = analyzeIndustryTrends;
// ============================================================================
// ATTACK LIKELIHOOD PREDICTION FUNCTIONS (7 functions)
// ============================================================================
/**
 * Calculates probability of attack based on multiple risk factors.
 *
 * @param {Record<string, any>} riskFactors - Risk factor scores
 * @param {ThreatIntelligence[]} intelligence - Current threat intelligence
 * @returns {number} Attack probability (0-1)
 *
 * @example
 * ```typescript
 * const probability = calculateAttackProbability(
 *   {
 *     vulnerabilities: 15,
 *     exposureScore: 0.7,
 *     patchCompliance: 0.6,
 *     securityPosture: 0.8
 *   },
 *   intelligenceData
 * );
 * console.log('Attack probability:', (probability * 100).toFixed(1) + '%');
 * ```
 */
const calculateAttackProbability = (riskFactors, intelligence) => {
    const vulnerabilityScore = Math.min(1, (riskFactors.vulnerabilities || 0) / 20);
    const exposureScore = riskFactors.exposureScore || 0.5;
    const patchScore = 1 - (riskFactors.patchCompliance || 0.8);
    const postureScore = 1 - (riskFactors.securityPosture || 0.8);
    const recentThreats = intelligence.filter(i => new Date(i.lastSeen).getTime() > Date.now() - 7 * 86400000).length;
    const threatScore = Math.min(1, recentThreats / 50);
    const weights = {
        vulnerability: 0.25,
        exposure: 0.25,
        patch: 0.20,
        posture: 0.15,
        threat: 0.15
    };
    return (vulnerabilityScore * weights.vulnerability +
        exposureScore * weights.exposure +
        patchScore * weights.patch +
        postureScore * weights.posture +
        threatScore * weights.threat);
};
exports.calculateAttackProbability = calculateAttackProbability;
/**
 * Predicts attack surface exposure based on asset inventory and configuration.
 *
 * @param {Record<string, any>[]} assets - Asset inventory
 * @param {Record<string, any>} networkConfig - Network configuration
 * @returns {Promise<{ exposureScore: number; vulnerableAssets: string[]; recommendations: string[] }>} Exposure assessment
 *
 * @example
 * ```typescript
 * const exposure = await predictAttackSurfaceExposure(
 *   assetInventory,
 *   { firewallRules: 150, openPorts: [80, 443, 3389] }
 * );
 * console.log('Exposure score:', exposure.exposureScore);
 * console.log('Vulnerable assets:', exposure.vulnerableAssets);
 * ```
 */
const predictAttackSurfaceExposure = async (assets, networkConfig) => {
    const vulnerableAssets = [];
    const recommendations = [];
    const riskyPorts = [3389, 445, 135, 139, 23, 21];
    const exposedPorts = networkConfig.openPorts?.filter((port) => riskyPorts.includes(port)) || [];
    assets.forEach(asset => {
        if (asset.publiclyAccessible && !asset.waf) {
            vulnerableAssets.push(asset.id);
        }
    });
    if (exposedPorts.length > 0) {
        recommendations.push(`Close or restrict access to risky ports: ${exposedPorts.join(', ')}`);
    }
    if (vulnerableAssets.length > 0) {
        recommendations.push(`Deploy WAF for ${vulnerableAssets.length} publicly accessible assets`);
    }
    const exposureScore = Math.min(1, ((exposedPorts.length / 10) * 0.4 +
        (vulnerableAssets.length / assets.length) * 0.6));
    return { exposureScore, vulnerableAssets, recommendations };
};
exports.predictAttackSurfaceExposure = predictAttackSurfaceExposure;
/**
 * Estimates likelihood of vulnerability exploitation based on threat landscape.
 *
 * @param {string} cveId - CVE identifier
 * @param {ThreatIntelligence[]} intelligence - Threat intelligence data
 * @returns {Promise<{ likelihood: number; timeframe: string; exploitAvailable: boolean }>} Exploitation likelihood
 *
 * @example
 * ```typescript
 * const likelihood = await estimateExploitationLikelihood(
 *   'CVE-2024-1234',
 *   intelligenceData
 * );
 * console.log('Exploitation likelihood:', likelihood.likelihood);
 * console.log('Expected timeframe:', likelihood.timeframe);
 * ```
 */
const estimateExploitationLikelihood = async (cveId, intelligence) => {
    const cveIntel = intelligence.filter(i => i.iocType === 'cve' && i.iocValue === cveId);
    const exploitAvailable = cveIntel.some(i => i.context?.exploitAvailable === true || i.tags.includes('exploit-public'));
    const recentActivity = cveIntel.filter(i => new Date(i.lastSeen).getTime() > Date.now() - 7 * 86400000).length;
    let likelihood = 0.3; // Base likelihood
    if (exploitAvailable)
        likelihood += 0.4;
    if (recentActivity > 0)
        likelihood += 0.2;
    if (cveIntel.some(i => i.severity === 'critical'))
        likelihood += 0.1;
    const timeframe = likelihood > 0.8 ? '24-48 hours' :
        likelihood > 0.6 ? '3-7 days' :
            likelihood > 0.4 ? '1-2 weeks' : '2-4 weeks';
    return { likelihood: Math.min(1, likelihood), timeframe, exploitAvailable };
};
exports.estimateExploitationLikelihood = estimateExploitationLikelihood;
/**
 * Estimates time-to-attack based on threat actor capabilities and motivation.
 *
 * @param {string} threatActorId - Threat actor identifier
 * @param {string} targetAsset - Target asset identifier
 * @returns {Promise<{ estimatedHours: number; confidence: number; factors: string[] }>} Time estimation
 *
 * @example
 * ```typescript
 * const tta = await estimateTimeToAttack('apt29', 'critical-server-01');
 * console.log(`Estimated time to attack: ${tta.estimatedHours} hours`);
 * console.log('Confidence:', tta.confidence);
 * ```
 */
const estimateTimeToAttack = async (threatActorId, targetAsset) => {
    // Simulate threat actor capability assessment
    const actorCapability = Math.random() * 0.5 + 0.5; // 0.5-1.0
    const targetComplexity = Math.random() * 0.5 + 0.3; // 0.3-0.8
    const motivationLevel = Math.random() * 0.4 + 0.6; // 0.6-1.0
    // Higher capability and motivation = faster attack
    // Higher complexity = slower attack
    const baseHours = 72;
    const estimatedHours = Math.floor(baseHours * (1 / actorCapability) * targetComplexity * (1 / motivationLevel));
    return {
        estimatedHours,
        confidence: 0.65 + (actorCapability * 0.2),
        factors: [
            `Threat actor capability: ${(actorCapability * 100).toFixed(0)}%`,
            `Target complexity: ${(targetComplexity * 100).toFixed(0)}%`,
            `Motivation level: ${(motivationLevel * 100).toFixed(0)}%`
        ]
    };
};
exports.estimateTimeToAttack = estimateTimeToAttack;
/**
 * Scores target attractiveness from attacker perspective.
 *
 * @param {Record<string, any>} asset - Asset details
 * @param {Record<string, any>} threatLandscape - Current threat landscape
 * @returns {number} Attractiveness score (0-1)
 *
 * @example
 * ```typescript
 * const score = scoreTargetAttractiveness(
 *   {
 *     assetValue: 1000000,
 *     dataClassification: 'PHI',
 *     publiclyAccessible: true,
 *     securityControls: ['firewall', 'ids']
 *   },
 *   threatLandscape
 * );
 * console.log('Target attractiveness:', (score * 100).toFixed(0) + '%');
 * ```
 */
const scoreTargetAttractiveness = (asset, threatLandscape) => {
    let score = 0;
    // Asset value
    const valueScore = Math.min(1, (asset.assetValue || 100000) / 5000000);
    score += valueScore * 0.3;
    // Data sensitivity
    const sensitivityScores = {
        PHI: 0.9,
        PII: 0.8,
        financial: 0.85,
        confidential: 0.7,
        internal: 0.5,
        public: 0.1
    };
    score += (sensitivityScores[asset.dataClassification] || 0.5) * 0.3;
    // Accessibility
    if (asset.publiclyAccessible)
        score += 0.2;
    // Security posture (inverse - weak security = more attractive)
    const controlCount = asset.securityControls?.length || 0;
    score += (1 - Math.min(1, controlCount / 10)) * 0.2;
    return Math.min(1, score);
};
exports.scoreTargetAttractiveness = scoreTargetAttractiveness;
/**
 * Profiles threat actor based on tactics, techniques, and procedures.
 *
 * @param {ThreatIntelligence[]} intelligence - Intelligence on threat actor
 * @param {ThreatPattern[]} patterns - Observed attack patterns
 * @returns {Promise<{ actorId: string; sophistication: number; targetPreference: string[]; capabilities: string[] }>} Actor profile
 *
 * @example
 * ```typescript
 * const profile = await profileThreatActor(actorIntelligence, observedPatterns);
 * console.log('Sophistication level:', profile.sophistication);
 * console.log('Target preferences:', profile.targetPreference);
 * ```
 */
const profileThreatActor = async (intelligence, patterns) => {
    const uniqueTactics = new Set();
    const uniqueTechniques = new Set();
    const targetTags = new Set();
    intelligence.forEach(i => {
        i.tags.forEach(tag => targetTags.add(tag));
    });
    patterns.forEach(p => {
        p.tactics.forEach(t => uniqueTactics.add(t));
        p.techniques.forEach(t => uniqueTechniques.add(t));
    });
    // Sophistication based on number of unique TTPs
    const sophistication = Math.min(1, (uniqueTactics.size + uniqueTechniques.size) / 30);
    return {
        actorId: intelligence[0]?.attribution || 'unknown',
        sophistication,
        targetPreference: Array.from(targetTags).slice(0, 5),
        capabilities: Array.from(uniqueTechniques).slice(0, 10)
    };
};
exports.profileThreatActor = profileThreatActor;
/**
 * Predicts campaign development and attack progression.
 *
 * @param {string} campaignId - Campaign identifier
 * @param {ThreatIntelligence[]} intelligence - Campaign intelligence
 * @returns {Promise<{ currentPhase: string; nextPhase: string; timeline: Array<{ phase: string; estimatedDate: Date }> }>} Campaign prediction
 *
 * @example
 * ```typescript
 * const campaign = await predictCampaignProgression(
 *   'campaign-abc123',
 *   campaignIntelligence
 * );
 * console.log('Current phase:', campaign.currentPhase);
 * console.log('Next phase:', campaign.nextPhase);
 * ```
 */
const predictCampaignProgression = async (campaignId, intelligence) => {
    const campaignData = intelligence.filter(i => i.campaignId === campaignId);
    const firstSeen = Math.min(...campaignData.map(i => new Date(i.firstSeen).getTime()));
    const daysSinceStart = (Date.now() - firstSeen) / 86400000;
    const phases = [
        { phase: 'reconnaissance', duration: 7 },
        { phase: 'initial_access', duration: 3 },
        { phase: 'persistence', duration: 2 },
        { phase: 'privilege_escalation', duration: 2 },
        { phase: 'lateral_movement', duration: 5 },
        { phase: 'exfiltration', duration: 1 }
    ];
    let currentPhase = 'reconnaissance';
    let cumulativeDays = 0;
    for (const phase of phases) {
        if (daysSinceStart > cumulativeDays + phase.duration) {
            cumulativeDays += phase.duration;
            currentPhase = phase.phase;
        }
        else {
            break;
        }
    }
    const currentIndex = phases.findIndex(p => p.phase === currentPhase);
    const nextPhase = currentIndex < phases.length - 1 ? phases[currentIndex + 1].phase : 'complete';
    const timeline = phases.map((phase, index) => {
        const phaseDays = phases.slice(0, index + 1).reduce((sum, p) => sum + p.duration, 0);
        return {
            phase: phase.phase,
            estimatedDate: new Date(firstSeen + phaseDays * 86400000)
        };
    });
    return { currentPhase, nextPhase, timeline };
};
exports.predictCampaignProgression = predictCampaignProgression;
// ============================================================================
// THREAT PATTERN RECOGNITION FUNCTIONS (7 functions)
// ============================================================================
/**
 * Detects threat patterns in security events using signature and behavioral analysis.
 *
 * @param {Record<string, any>[]} events - Security events to analyze
 * @param {ThreatPattern[]} knownPatterns - Known threat patterns
 * @returns {Promise<Array<{ patternId: string; confidence: number; matchedEvents: number }>>} Detected patterns
 *
 * @example
 * ```typescript
 * const detected = await detectThreatPatterns(
 *   securityEvents,
 *   threatPatternLibrary
 * );
 * detected.forEach(match => {
 *   console.log(`Pattern ${match.patternId}: ${match.confidence} confidence`);
 * });
 * ```
 */
const detectThreatPatterns = async (events, knownPatterns) => {
    const matches = [];
    for (const pattern of knownPatterns) {
        let matchedEvents = 0;
        let totalConfidence = 0;
        for (const event of events) {
            const indicators = pattern.indicators;
            let matchCount = 0;
            indicators.forEach((indicator) => {
                if (event[indicator.type] === indicator.value) {
                    matchCount++;
                    totalConfidence += indicator.confidence;
                }
            });
            if (matchCount > 0) {
                matchedEvents++;
            }
        }
        if (matchedEvents > 0) {
            const confidence = totalConfidence / (matchedEvents * indicators.length);
            if (confidence >= pattern.similarityThreshold) {
                matches.push({
                    patternId: pattern.id,
                    confidence,
                    matchedEvents
                });
            }
        }
    }
    return matches.sort((a, b) => b.confidence - a.confidence);
};
exports.detectThreatPatterns = detectThreatPatterns;
/**
 * Implements pattern matching algorithms for threat detection.
 *
 * @param {Record<string, any>} event - Event to match
 * @param {PatternMatchConfig} config - Pattern matching configuration
 * @returns {Promise<Array<{ patternName: string; score: number; matched: string[] }>>} Matching results
 *
 * @example
 * ```typescript
 * const matches = await matchThreatPatternAlgorithm(
 *   securityEvent,
 *   {
 *     patterns: ['lateral_movement', 'privilege_escalation'],
 *     threshold: 0.7,
 *     matchType: 'fuzzy',
 *     maxResults: 5
 *   }
 * );
 * ```
 */
const matchThreatPatternAlgorithm = async (event, config) => {
    const results = [];
    for (const patternName of config.patterns) {
        const matched = [];
        let score = 0;
        // Simulate pattern matching logic
        const eventKeys = Object.keys(event);
        const matchingKeys = eventKeys.filter(key => key.toLowerCase().includes(patternName.toLowerCase().split('_')[0]));
        if (matchingKeys.length > 0) {
            matched.push(...matchingKeys);
            switch (config.matchType) {
                case 'exact':
                    score = matchingKeys.length === eventKeys.length ? 1.0 : 0.5;
                    break;
                case 'fuzzy':
                    score = matchingKeys.length / eventKeys.length;
                    break;
                case 'semantic':
                    score = (matchingKeys.length / eventKeys.length) * 0.9 + 0.1;
                    break;
            }
        }
        if (score >= config.threshold) {
            results.push({ patternName, score, matched });
        }
    }
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, config.maxResults || 10);
};
exports.matchThreatPatternAlgorithm = matchThreatPatternAlgorithm;
/**
 * Clusters similar behaviors to identify new threat patterns.
 *
 * @param {Record<string, any>[]} events - Events to cluster
 * @param {number} minClusterSize - Minimum cluster size
 * @returns {Promise<Array<{ clusterId: string; events: number; centroid: Record<string, any> }>>} Behavior clusters
 *
 * @example
 * ```typescript
 * const clusters = await clusterThreatBehaviors(securityEvents, 5);
 * clusters.forEach(cluster => {
 *   console.log(`Cluster ${cluster.clusterId}: ${cluster.events} events`);
 * });
 * ```
 */
const clusterThreatBehaviors = async (events, minClusterSize) => {
    // Simplified k-means clustering simulation
    const numClusters = Math.max(3, Math.floor(events.length / minClusterSize));
    const clusters = [];
    for (let i = 0; i < numClusters; i++) {
        const clusterEvents = events.filter((_, idx) => idx % numClusters === i);
        if (clusterEvents.length >= minClusterSize) {
            // Calculate centroid (average of all features)
            const centroid = {};
            const keys = Object.keys(clusterEvents[0] || {});
            keys.forEach(key => {
                const values = clusterEvents.map(e => e[key]).filter(v => typeof v === 'number');
                if (values.length > 0) {
                    centroid[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
                }
            });
            clusters.push({
                clusterId: `cluster-${i}`,
                events: clusterEvents.length,
                centroid
            });
        }
    }
    return clusters;
};
exports.clusterThreatBehaviors = clusterThreatBehaviors;
/**
 * Reconstructs attack chain from individual security events.
 *
 * @param {Record<string, any>[]} events - Security events
 * @param {string} targetAsset - Target asset identifier
 * @returns {Promise<Array<{ phase: string; timestamp: Date; events: Record<string, any>[] }>>} Reconstructed attack chain
 *
 * @example
 * ```typescript
 * const chain = await reconstructAttackChain(
 *   securityEvents,
 *   'server-123'
 * );
 * chain.forEach(phase => {
 *   console.log(`${phase.phase}: ${phase.events.length} events`);
 * });
 * ```
 */
const reconstructAttackChain = async (events, targetAsset) => {
    const relevantEvents = events.filter(e => e.targetAsset === targetAsset);
    const sortedEvents = relevantEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const killChainPhases = [
        { phase: 'reconnaissance', keywords: ['scan', 'probe', 'enum'] },
        { phase: 'weaponization', keywords: ['payload', 'exploit', 'malware'] },
        { phase: 'delivery', keywords: ['email', 'download', 'transfer'] },
        { phase: 'exploitation', keywords: ['vulnerability', 'overflow', 'injection'] },
        { phase: 'installation', keywords: ['install', 'persist', 'backdoor'] },
        { phase: 'command_control', keywords: ['c2', 'beacon', 'callback'] },
        { phase: 'actions_objectives', keywords: ['exfil', 'encrypt', 'destroy'] }
    ];
    const chain = [];
    killChainPhases.forEach(({ phase, keywords }) => {
        const phaseEvents = sortedEvents.filter(event => {
            const eventStr = JSON.stringify(event).toLowerCase();
            return keywords.some(keyword => eventStr.includes(keyword));
        });
        if (phaseEvents.length > 0) {
            chain.push({
                phase,
                timestamp: new Date(phaseEvents[0].timestamp),
                events: phaseEvents
            });
        }
    });
    return chain;
};
exports.reconstructAttackChain = reconstructAttackChain;
/**
 * Matches events against MITRE ATT&CK tactics, techniques, and procedures.
 *
 * @param {Record<string, any>[]} events - Security events
 * @returns {Promise<Array<{ tactic: string; technique: string; procedure: string; confidence: number }>>} ATT&CK mappings
 *
 * @example
 * ```typescript
 * const mappings = await matchMITREAttackTTP(securityEvents);
 * mappings.forEach(m => {
 *   console.log(`${m.tactic} -> ${m.technique}: ${m.confidence}`);
 * });
 * ```
 */
const matchMITREAttackTTP = async (events) => {
    const ttps = [];
    const attackMappings = [
        { tactic: 'Initial Access', technique: 'T1566 - Phishing', keywords: ['email', 'attachment', 'link'] },
        { tactic: 'Execution', technique: 'T1059 - Command and Scripting', keywords: ['powershell', 'cmd', 'bash'] },
        { tactic: 'Persistence', technique: 'T1547 - Boot or Logon', keywords: ['registry', 'startup', 'service'] },
        { tactic: 'Privilege Escalation', technique: 'T1068 - Exploitation', keywords: ['vulnerability', 'exploit', 'elevation'] },
        { tactic: 'Defense Evasion', technique: 'T1070 - Indicator Removal', keywords: ['clear', 'delete', 'wipe'] },
        { tactic: 'Credential Access', technique: 'T1110 - Brute Force', keywords: ['login', 'password', 'auth'] },
        { tactic: 'Discovery', technique: 'T1018 - Remote System Discovery', keywords: ['scan', 'enum', 'discover'] },
        { tactic: 'Lateral Movement', technique: 'T1021 - Remote Services', keywords: ['rdp', 'ssh', 'smb'] },
        { tactic: 'Collection', technique: 'T1560 - Archive Collected Data', keywords: ['zip', 'compress', 'archive'] },
        { tactic: 'Exfiltration', technique: 'T1041 - Exfiltration Over C2', keywords: ['upload', 'transfer', 'exfil'] }
    ];
    attackMappings.forEach(mapping => {
        const matchingEvents = events.filter(event => {
            const eventStr = JSON.stringify(event).toLowerCase();
            return mapping.keywords.some(keyword => eventStr.includes(keyword));
        });
        if (matchingEvents.length > 0) {
            ttps.push({
                tactic: mapping.tactic,
                technique: mapping.technique,
                procedure: `Detected in ${matchingEvents.length} events`,
                confidence: Math.min(1, matchingEvents.length / 10)
            });
        }
    });
    return ttps;
};
exports.matchMITREAttackTTP = matchMITREAttackTTP;
/**
 * Calculates similarity score between threat patterns.
 *
 * @param {ThreatPattern} pattern1 - First pattern
 * @param {ThreatPattern} pattern2 - Second pattern
 * @returns {number} Similarity score (0-1)
 *
 * @example
 * ```typescript
 * const similarity = calculatePatternSimilarity(pattern1, pattern2);
 * if (similarity > 0.8) {
 *   console.log('Patterns are highly similar');
 * }
 * ```
 */
const calculatePatternSimilarity = (pattern1, pattern2) => {
    // Jaccard similarity for tactics
    const tactics1 = new Set(pattern1.tactics);
    const tactics2 = new Set(pattern2.tactics);
    const tacticsIntersection = new Set([...tactics1].filter(t => tactics2.has(t)));
    const tacticsUnion = new Set([...tactics1, ...tactics2]);
    const tacticsSimilarity = tacticsIntersection.size / tacticsUnion.size;
    // Jaccard similarity for techniques
    const techniques1 = new Set(pattern1.techniques);
    const techniques2 = new Set(pattern2.techniques);
    const techniquesIntersection = new Set([...techniques1].filter(t => techniques2.has(t)));
    const techniquesUnion = new Set([...techniques1, ...techniques2]);
    const techniquesSimilarity = techniquesIntersection.size / techniquesUnion.size;
    // Severity similarity
    const severityScores = { critical: 4, high: 3, medium: 2, low: 1 };
    const severityDiff = Math.abs(severityScores[pattern1.severity] - severityScores[pattern2.severity]);
    const severitySimilarity = 1 - (severityDiff / 3);
    // Weighted average
    return (tacticsSimilarity * 0.4 + techniquesSimilarity * 0.4 + severitySimilarity * 0.2);
};
exports.calculatePatternSimilarity = calculatePatternSimilarity;
/**
 * Manages threat pattern library with version control.
 *
 * @param {ThreatPattern[]} patterns - Patterns to manage
 * @param {'add' | 'update' | 'remove' | 'list'} operation - Operation type
 * @returns {Promise<{ success: boolean; patterns: ThreatPattern[]; version: string }>} Management result
 *
 * @example
 * ```typescript
 * const result = await managePatternLibrary(newPatterns, 'add');
 * console.log(`Library version: ${result.version}`);
 * console.log(`Total patterns: ${result.patterns.length}`);
 * ```
 */
const managePatternLibrary = async (patterns, operation) => {
    // Simulate library management
    const currentVersion = '1.2.3';
    const versionParts = currentVersion.split('.').map(Number);
    let newPatterns = [...patterns];
    switch (operation) {
        case 'add':
            versionParts[1]++; // Increment minor version
            break;
        case 'update':
            versionParts[2]++; // Increment patch version
            break;
        case 'remove':
            newPatterns = patterns.filter(p => p.isActive);
            versionParts[2]++;
            break;
        case 'list':
            // No version change
            break;
    }
    const newVersion = versionParts.join('.');
    return {
        success: true,
        patterns: newPatterns,
        version: newVersion
    };
};
exports.managePatternLibrary = managePatternLibrary;
// ============================================================================
// ANOMALY DETECTION FUNCTIONS (6 functions)
// ============================================================================
/**
 * Establishes baseline for normal behavior with statistical analysis.
 *
 * @param {BaselineConfig} config - Baseline configuration
 * @param {Record<string, any>[]} historicalData - Historical data points
 * @returns {Promise<{ baselineId: string; mean: number; stdDev: number; percentiles: Record<string, number> }>} Baseline parameters
 *
 * @example
 * ```typescript
 * const baseline = await establishBehaviorBaseline(
 *   {
 *     dataPoints: 1000,
 *     windowSize: 3600,
 *     updateFrequency: '0 * * * *',
 *     excludeAnomalies: true,
 *     aggregationMethod: 'median'
 *   },
 *   historicalData
 * );
 * console.log('Baseline mean:', baseline.mean);
 * console.log('Standard deviation:', baseline.stdDev);
 * ```
 */
const establishBehaviorBaseline = async (config, historicalData) => {
    const values = historicalData
        .map(d => d.value)
        .filter((v) => typeof v === 'number')
        .slice(-config.dataPoints);
    // Remove outliers if configured
    let cleanedValues = values;
    if (config.excludeAnomalies) {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        cleanedValues = values.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
    }
    // Calculate statistics
    const mean = cleanedValues.reduce((sum, v) => sum + v, 0) / cleanedValues.length;
    const variance = cleanedValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / cleanedValues.length;
    const stdDev = Math.sqrt(variance);
    // Calculate percentiles
    const sorted = [...cleanedValues].sort((a, b) => a - b);
    const percentiles = {
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p75: sorted[Math.floor(sorted.length * 0.75)],
        p90: sorted[Math.floor(sorted.length * 0.9)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)]
    };
    return {
        baselineId: generateId(),
        mean: config.aggregationMethod === 'median' ? percentiles.p50 : mean,
        stdDev,
        percentiles
    };
};
exports.establishBehaviorBaseline = establishBehaviorBaseline;
/**
 * Detects statistical anomalies using z-score and percentile methods.
 *
 * @param {number} value - Observed value
 * @param {Record<string, any>} baseline - Baseline parameters
 * @returns {Promise<AnomalyDetection | null>} Anomaly detection result
 *
 * @example
 * ```typescript
 * const anomaly = await detectStatisticalAnomaly(
 *   1500,
 *   { mean: 100, stdDev: 20, percentiles: { p99: 150 } }
 * );
 * if (anomaly) {
 *   console.log('Anomaly severity:', anomaly.severity);
 *   console.log('Standard deviations:', anomaly.standardDeviations);
 * }
 * ```
 */
const detectStatisticalAnomaly = async (value, baseline) => {
    const mean = baseline.mean || 0;
    const stdDev = baseline.stdDev || 1;
    const zScore = calculateStandardDeviations(value, mean, stdDev);
    // Threshold: 3 standard deviations
    if (Math.abs(zScore) >= 3) {
        const deviation = value - mean;
        const anomalyScore = Math.min(1, Math.abs(zScore) / 10);
        return {
            id: generateId(),
            anomalyType: 'statistical',
            detectionMethod: 'statistical',
            anomalyScore,
            severity: Math.abs(zScore) >= 5 ? 'critical' : Math.abs(zScore) >= 4 ? 'high' : 'medium',
            baselineId: baseline.baselineId,
            observedValue: value,
            expectedValue: mean,
            deviation,
            standardDeviations: zScore,
            context: { method: 'z-score' },
            affectedEntities: [],
            isConfirmed: false,
            falsePositive: false,
            metadata: { detectionTime: new Date() }
        };
    }
    return null;
};
exports.detectStatisticalAnomaly = detectStatisticalAnomaly;
/**
 * Applies machine learning anomaly detection algorithms.
 *
 * @param {Record<string, any>} observation - Observation to evaluate
 * @param {string} modelId - Anomaly detection model ID
 * @returns {Promise<AnomalyDetection | null>} ML-based anomaly result
 *
 * @example
 * ```typescript
 * const anomaly = await detectMLBasedAnomaly(
 *   {
 *     networkTraffic: 50000,
 *     connections: 1000,
 *     failedAuth: 50
 *   },
 *   'isolation-forest-model-123'
 * );
 * if (anomaly) {
 *   console.log('ML anomaly score:', anomaly.anomalyScore);
 * }
 * ```
 */
const detectMLBasedAnomaly = async (observation, modelId) => {
    // Simulate ML-based anomaly detection (Isolation Forest, One-Class SVM, etc.)
    const featureValues = Object.values(observation).filter(v => typeof v === 'number');
    const avgValue = featureValues.reduce((sum, v) => sum + v, 0) / featureValues.length;
    // Simulate anomaly score (0-1, higher = more anomalous)
    const anomalyScore = Math.random() * 0.3 + (avgValue > 1000 ? 0.5 : 0);
    // Threshold: 0.7
    if (anomalyScore >= 0.7) {
        return {
            id: generateId(),
            anomalyType: 'ml_detected',
            detectionMethod: 'ml',
            anomalyScore,
            severity: anomalyScore >= 0.9 ? 'critical' : anomalyScore >= 0.8 ? 'high' : 'medium',
            observedValue: avgValue,
            expectedValue: avgValue * 0.5,
            deviation: avgValue * 0.5,
            standardDeviations: (anomalyScore - 0.5) * 10,
            context: { modelId, features: observation },
            affectedEntities: [],
            isConfirmed: false,
            falsePositive: false,
            metadata: { algorithm: 'isolation_forest' }
        };
    }
    return null;
};
exports.detectMLBasedAnomaly = detectMLBasedAnomaly;
/**
 * Scores behavioral anomalies based on user and entity behavior analytics.
 *
 * @param {string} entityId - Entity identifier
 * @param {Record<string, any>} behavior - Observed behavior
 * @param {Record<string, any>} profile - Entity behavioral profile
 * @returns {number} Behavioral anomaly score (0-1)
 *
 * @example
 * ```typescript
 * const score = scoreBehavioralAnomaly(
 *   'user-123',
 *   {
 *     loginTime: '03:00',
 *     dataAccessed: 50000,
 *     locationCountry: 'RU'
 *   },
 *   userProfile
 * );
 * console.log('Behavioral anomaly score:', score);
 * ```
 */
const scoreBehavioralAnomaly = (entityId, behavior, profile) => {
    let anomalyScore = 0;
    let factors = 0;
    // Time-based anomaly
    if (behavior.loginTime && profile.typicalLoginHours) {
        const hour = parseInt(behavior.loginTime.split(':')[0]);
        const typicalHours = profile.typicalLoginHours;
        if (!typicalHours.includes(hour)) {
            anomalyScore += 0.3;
        }
        factors++;
    }
    // Volume-based anomaly
    if (behavior.dataAccessed && profile.avgDataAccessed) {
        const ratio = behavior.dataAccessed / profile.avgDataAccessed;
        if (ratio > 3) {
            anomalyScore += 0.4;
        }
        else if (ratio > 2) {
            anomalyScore += 0.2;
        }
        factors++;
    }
    // Location-based anomaly
    if (behavior.locationCountry && profile.typicalCountries) {
        const typicalCountries = profile.typicalCountries;
        if (!typicalCountries.includes(behavior.locationCountry)) {
            anomalyScore += 0.3;
        }
        factors++;
    }
    return factors > 0 ? anomalyScore / factors : 0;
};
exports.scoreBehavioralAnomaly = scoreBehavioralAnomaly;
/**
 * Classifies detected anomalies into threat categories.
 *
 * @param {AnomalyDetection} anomaly - Detected anomaly
 * @param {Record<string, any>} contextData - Additional context
 * @returns {Promise<{ category: string; subcategory: string; confidence: number }>} Classification result
 *
 * @example
 * ```typescript
 * const classification = await classifyAnomaly(
 *   detectedAnomaly,
 *   { sourceIp: '192.168.1.100', protocol: 'tcp' }
 * );
 * console.log(`Category: ${classification.category}`);
 * console.log(`Subcategory: ${classification.subcategory}`);
 * ```
 */
const classifyAnomaly = async (anomaly, contextData) => {
    // Rule-based classification
    let category = 'unknown';
    let subcategory = 'unclassified';
    let confidence = 0.5;
    if (anomaly.anomalyType.includes('network') || contextData.protocol) {
        category = 'network_anomaly';
        if (contextData.portScan) {
            subcategory = 'port_scan';
            confidence = 0.85;
        }
        else if (contextData.ddos) {
            subcategory = 'ddos_attack';
            confidence = 0.9;
        }
        else {
            subcategory = 'unusual_traffic';
            confidence = 0.7;
        }
    }
    else if (anomaly.anomalyType.includes('auth') || anomaly.context?.failedAuth) {
        category = 'authentication_anomaly';
        if (anomaly.observedValue > 10) {
            subcategory = 'brute_force';
            confidence = 0.8;
        }
        else {
            subcategory = 'suspicious_login';
            confidence = 0.7;
        }
    }
    else if (anomaly.anomalyType.includes('data') || contextData.dataTransfer) {
        category = 'data_anomaly';
        subcategory = 'potential_exfiltration';
        confidence = anomaly.severity === 'critical' ? 0.85 : 0.7;
    }
    return { category, subcategory, confidence };
};
exports.classifyAnomaly = classifyAnomaly;
/**
 * Reduces false positives using feedback and correlation.
 *
 * @param {AnomalyDetection[]} anomalies - Detected anomalies
 * @param {Record<string, any>} feedbackData - Historical feedback
 * @returns {Promise<AnomalyDetection[]>} Filtered anomalies
 *
 * @example
 * ```typescript
 * const filtered = await reduceFalsePositives(
 *   detectedAnomalies,
 *   { knownGoodPatterns: [...], historicalFalsePositives: [...] }
 * );
 * console.log(`Reduced from ${detectedAnomalies.length} to ${filtered.length}`);
 * ```
 */
const reduceFalsePositives = async (anomalies, feedbackData) => {
    const filtered = anomalies.filter(anomaly => {
        // Check against known false positive patterns
        const knownFP = feedbackData.historicalFalsePositives?.some((fp) => fp.anomalyType === anomaly.anomalyType &&
            Math.abs(fp.observedValue - anomaly.observedValue) < fp.observedValue * 0.1);
        if (knownFP) {
            anomaly.falsePositive = true;
            return false;
        }
        // Check against known good patterns
        const knownGood = feedbackData.knownGoodPatterns?.some((pattern) => pattern.type === anomaly.anomalyType &&
            anomaly.observedValue >= pattern.minValue &&
            anomaly.observedValue <= pattern.maxValue);
        if (knownGood) {
            return false;
        }
        // Require higher confidence for low severity
        if (anomaly.severity === 'low' && anomaly.anomalyScore < 0.8) {
            return false;
        }
        return true;
    });
    return filtered;
};
exports.reduceFalsePositives = reduceFalsePositives;
//# sourceMappingURL=threat-prediction-forecasting-kit.js.map