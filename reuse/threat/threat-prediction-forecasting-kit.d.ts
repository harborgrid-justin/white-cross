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
interface ThreatPrediction {
    id: string;
    threatType: string;
    threatCategory: string;
    predictedSeverity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    confidenceScore: number;
    predictionScore: number;
    attackVector?: string;
    targetAsset?: string;
    predictedImpact?: number;
    likelihood: number;
    timeToAttack?: number;
    modelId: string;
    features: Record<string, any>;
    predictions: Record<string, any>;
    metadata?: Record<string, any>;
    validFrom: Date;
    validUntil?: Date;
    status: 'active' | 'expired' | 'validated' | 'false_positive';
}
interface ThreatForecast {
    id: string;
    forecastType: string;
    timeHorizon: number;
    granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
    forecastData: Array<{
        timestamp: Date;
        value: number;
        confidence: number;
        upperBound: number;
        lowerBound: number;
    }>;
    trendDirection: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    seasonalPattern?: Record<string, any>;
    modelAccuracy: number;
    metadata?: Record<string, any>;
}
interface ThreatPattern {
    id: string;
    patternName: string;
    patternType: 'signature' | 'behavioral' | 'anomaly' | 'composite';
    description: string;
    tactics: string[];
    techniques: string[];
    procedures: string[];
    indicators: Array<{
        type: string;
        value: string;
        confidence: number;
    }>;
    attackChain: string[];
    severity: 'critical' | 'high' | 'medium' | 'low';
    prevalence: number;
    matchingRules: Record<string, any>;
    similarityThreshold: number;
    isActive: boolean;
    metadata?: Record<string, any>;
}
interface AnomalyDetection {
    id: string;
    anomalyType: string;
    detectionMethod: 'statistical' | 'ml' | 'behavioral' | 'hybrid';
    anomalyScore: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    baselineId?: string;
    observedValue: number;
    expectedValue: number;
    deviation: number;
    standardDeviations: number;
    context: Record<string, any>;
    affectedEntities: string[];
    isConfirmed: boolean;
    falsePositive: boolean;
    metadata?: Record<string, any>;
}
interface MLModel {
    id: string;
    modelName: string;
    modelType: 'classification' | 'regression' | 'clustering' | 'anomaly_detection' | 'time_series';
    algorithm: string;
    version: string;
    trainingData: {
        datasetId: string;
        sampleCount: number;
        features: string[];
        labels?: string[];
    };
    hyperparameters: Record<string, any>;
    performance: {
        accuracy?: number;
        precision?: number;
        recall?: number;
        f1Score?: number;
        auc?: number;
        rmse?: number;
        mae?: number;
    };
    status: 'training' | 'deployed' | 'deprecated' | 'failed';
    deployedAt?: Date;
    retrainSchedule?: string;
    metadata?: Record<string, any>;
}
interface ThreatIntelligence {
    id: string;
    sourceType: 'feed' | 'report' | 'osint' | 'internal' | 'vendor';
    sourceName: string;
    iocType: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'cve' | 'signature';
    iocValue: string;
    threatType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    tags: string[];
    attribution?: string;
    campaignId?: string;
    relatedIOCs: string[];
    context: Record<string, any>;
    isActive: boolean;
    metadata?: Record<string, any>;
}
interface MLTrainingConfig {
    datasetId: string;
    modelType: string;
    algorithm: string;
    hyperparameters: Record<string, any>;
    validationSplit?: number;
    crossValidationFolds?: number;
    earlyStoppingRounds?: number;
}
interface PredictionInput {
    features: Record<string, any>;
    context?: Record<string, any>;
    threshold?: number;
}
interface TrendAnalysisConfig {
    timeRange: {
        start: Date;
        end: Date;
    };
    granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
    filters?: Record<string, any>;
    includeSeasonality?: boolean;
}
interface PatternMatchConfig {
    patterns: string[];
    threshold: number;
    matchType: 'exact' | 'fuzzy' | 'semantic';
    maxResults?: number;
}
interface BaselineConfig {
    dataPoints: number;
    windowSize: number;
    updateFrequency: string;
    excludeAnomalies: boolean;
    aggregationMethod: 'mean' | 'median' | 'percentile';
}
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
export declare const getThreatPredictionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    threatType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    threatCategory: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    predictedSeverity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    confidenceScore: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    predictionScore: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    attackVector: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    targetAsset: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    predictedImpact: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    likelihood: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    timeToAttack: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    modelId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        comment: string;
    };
    features: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    predictions: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    validFrom: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    validUntil: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
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
export declare const getThreatForecastModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    forecastType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    timeHorizon: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    granularity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    forecastData: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    trendDirection: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    seasonalPattern: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    modelAccuracy: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
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
export declare const getThreatPatternModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    patternName: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    patternType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    tactics: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    techniques: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    procedures: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    indicators: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    attackChain: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    prevalence: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    matchingRules: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    similarityThreshold: {
        type: string;
        defaultValue: number;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
        comment: string;
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
export declare const getAnomalyDetectionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    anomalyType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    detectionMethod: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    anomalyScore: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    baselineId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    observedValue: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    expectedValue: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    deviation: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    standardDeviations: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    context: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    affectedEntities: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    isConfirmed: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    falsePositive: {
        type: string;
        defaultValue: boolean;
        comment: string;
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
export declare const getMLModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    modelName: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    modelType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    algorithm: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    version: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    trainingData: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    hyperparameters: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    performance: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    deployedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    retrainSchedule: {
        type: string;
        allowNull: boolean;
        comment: string;
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
export declare const getThreatIntelligenceModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    sourceType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    sourceName: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    iocType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    iocValue: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    threatType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    firstSeen: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    lastSeen: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    tags: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    attribution: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    campaignId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    relatedIOCs: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    context: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
        comment: string;
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
export declare const createThreatPrediction: (input: PredictionInput, modelId: string) => Promise<ThreatPrediction>;
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
export declare const updateThreatPrediction: (predictionId: string, updates: Partial<PredictionInput>) => Promise<ThreatPrediction>;
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
export declare const generatePredictionConfidence: (features: Record<string, any>, modelPerformance: Record<string, any>) => number;
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
export declare const predictAttackVectors: (threatType: string, environmentData: Record<string, any>) => Promise<Array<{
    vector: string;
    likelihood: number;
    mitigation: string;
}>>;
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
export declare const modelThreatEvolution: (threatId: string, timeHorizon: number) => Promise<Array<{
    timestamp: Date;
    severity: string;
    confidence: number;
}>>;
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
export declare const predictThreatImpact: (prediction: ThreatPrediction, assetValue: Record<string, any>) => Promise<{
    financialImpact: number;
    operationalImpact: number;
    reputationalImpact: number;
}>;
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
export declare const generateComprehensiveRiskScore: (predictions: ThreatPrediction[], contextData: Record<string, any>) => number;
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
export declare const forecastAttackTiming: (threatType: string, intelligence: ThreatIntelligence[]) => Promise<{
    estimatedTime: Date;
    confidence: number;
    factors: string[];
}>;
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
export declare const trainThreatPredictionModel: (config: MLTrainingConfig) => Promise<MLModel>;
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
export declare const deployMLModel: (modelId: string, deploymentConfig: Record<string, any>) => Promise<{
    deployed: boolean;
    endpoint: string;
    version: string;
}>;
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
export declare const extractThreatFeatures: (rawData: Record<string, any>, featureDefinitions: string[]) => Record<string, any>;
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
export declare const evaluateModelPerformance: (modelId: string, testData: Record<string, any>[]) => Promise<Record<string, number>>;
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
export declare const tuneModelHyperparameters: (modelType: string, searchSpace: Record<string, any>, trials: number) => Promise<{
    bestParams: Record<string, any>;
    bestScore: number;
}>;
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
export declare const versionMLModel: (modelId: string, versionTag: string, changes: Record<string, any>) => Promise<MLModel>;
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
export declare const batchPredict: (modelId: string, inputs: PredictionInput[]) => Promise<ThreatPrediction[]>;
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
export declare const analyzeThreatTrends: (config: TrendAnalysisConfig) => Promise<ThreatForecast>;
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
export declare const identifyEmergingThreats: (intelligence: ThreatIntelligence[], lookbackDays: number) => Promise<Array<{
    threat: string;
    growthRate: number;
    severity: string;
}>>;
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
export declare const trackThreatEvolution: (threatType: string, historicalData: ThreatPrediction[]) => Promise<Array<{
    period: string;
    severity: string;
    volume: number;
}>>;
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
export declare const detectSeasonalPatterns: (intelligence: ThreatIntelligence[], minPeriods: number) => Promise<Record<string, any>>;
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
export declare const calculateThreatVelocity: (predictions: ThreatPrediction[], windowSize: number) => number;
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
export declare const analyzeGeographicDistribution: (intelligence: ThreatIntelligence[]) => Promise<Array<{
    region: string;
    count: number;
    severity: string;
}>>;
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
export declare const analyzeIndustryTrends: (industry: string, intelligence: ThreatIntelligence[]) => Promise<Array<{
    threat: string;
    prevalence: number;
    trend: string;
}>>;
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
export declare const calculateAttackProbability: (riskFactors: Record<string, any>, intelligence: ThreatIntelligence[]) => number;
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
export declare const predictAttackSurfaceExposure: (assets: Record<string, any>[], networkConfig: Record<string, any>) => Promise<{
    exposureScore: number;
    vulnerableAssets: string[];
    recommendations: string[];
}>;
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
export declare const estimateExploitationLikelihood: (cveId: string, intelligence: ThreatIntelligence[]) => Promise<{
    likelihood: number;
    timeframe: string;
    exploitAvailable: boolean;
}>;
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
export declare const estimateTimeToAttack: (threatActorId: string, targetAsset: string) => Promise<{
    estimatedHours: number;
    confidence: number;
    factors: string[];
}>;
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
export declare const scoreTargetAttractiveness: (asset: Record<string, any>, threatLandscape: Record<string, any>) => number;
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
export declare const profileThreatActor: (intelligence: ThreatIntelligence[], patterns: ThreatPattern[]) => Promise<{
    actorId: string;
    sophistication: number;
    targetPreference: string[];
    capabilities: string[];
}>;
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
export declare const predictCampaignProgression: (campaignId: string, intelligence: ThreatIntelligence[]) => Promise<{
    currentPhase: string;
    nextPhase: string;
    timeline: Array<{
        phase: string;
        estimatedDate: Date;
    }>;
}>;
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
export declare const detectThreatPatterns: (events: Record<string, any>[], knownPatterns: ThreatPattern[]) => Promise<Array<{
    patternId: string;
    confidence: number;
    matchedEvents: number;
}>>;
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
export declare const matchThreatPatternAlgorithm: (event: Record<string, any>, config: PatternMatchConfig) => Promise<Array<{
    patternName: string;
    score: number;
    matched: string[];
}>>;
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
export declare const clusterThreatBehaviors: (events: Record<string, any>[], minClusterSize: number) => Promise<Array<{
    clusterId: string;
    events: number;
    centroid: Record<string, any>;
}>>;
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
export declare const reconstructAttackChain: (events: Record<string, any>[], targetAsset: string) => Promise<Array<{
    phase: string;
    timestamp: Date;
    events: Record<string, any>[];
}>>;
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
export declare const matchMITREAttackTTP: (events: Record<string, any>[]) => Promise<Array<{
    tactic: string;
    technique: string;
    procedure: string;
    confidence: number;
}>>;
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
export declare const calculatePatternSimilarity: (pattern1: ThreatPattern, pattern2: ThreatPattern) => number;
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
export declare const managePatternLibrary: (patterns: ThreatPattern[], operation: "add" | "update" | "remove" | "list") => Promise<{
    success: boolean;
    patterns: ThreatPattern[];
    version: string;
}>;
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
export declare const establishBehaviorBaseline: (config: BaselineConfig, historicalData: Record<string, any>[]) => Promise<{
    baselineId: string;
    mean: number;
    stdDev: number;
    percentiles: Record<string, number>;
}>;
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
export declare const detectStatisticalAnomaly: (value: number, baseline: Record<string, any>) => Promise<AnomalyDetection | null>;
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
export declare const detectMLBasedAnomaly: (observation: Record<string, any>, modelId: string) => Promise<AnomalyDetection | null>;
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
export declare const scoreBehavioralAnomaly: (entityId: string, behavior: Record<string, any>, profile: Record<string, any>) => number;
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
export declare const classifyAnomaly: (anomaly: AnomalyDetection, contextData: Record<string, any>) => Promise<{
    category: string;
    subcategory: string;
    confidence: number;
}>;
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
export declare const reduceFalsePositives: (anomalies: AnomalyDetection[], feedbackData: Record<string, any>) => Promise<AnomalyDetection[]>;
export {};
//# sourceMappingURL=threat-prediction-forecasting-kit.d.ts.map