/**
 * LOC: THREATML1234567
 * File: /reuse/threat/threat-intelligence-ml-models-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - ML-based threat detection services
 *   - Predictive threat intelligence modules
 *   - Anomaly detection systems
 *   - Automated threat classification services
 *   - Natural language processing for threat reports
 *   - Behavioral analytics engines
 */
/**
 * Machine learning model configuration
 * @interface MLModelConfig
 */
export interface MLModelConfig {
    modelId: string;
    modelName: string;
    modelType: MLModelType;
    algorithm: MLAlgorithm;
    version: string;
    framework: MLFramework;
    hyperparameters: Record<string, any>;
    features: string[];
    targetVariable: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Machine learning model types
 * @enum MLModelType
 */
export declare enum MLModelType {
    CLASSIFICATION = "CLASSIFICATION",
    REGRESSION = "REGRESSION",
    CLUSTERING = "CLUSTERING",
    ANOMALY_DETECTION = "ANOMALY_DETECTION",
    TIME_SERIES = "TIME_SERIES",
    NLP = "NLP",
    DEEP_LEARNING = "DEEP_LEARNING",
    ENSEMBLE = "ENSEMBLE"
}
/**
 * Machine learning algorithms
 * @enum MLAlgorithm
 */
export declare enum MLAlgorithm {
    LOGISTIC_REGRESSION = "LOGISTIC_REGRESSION",
    RANDOM_FOREST = "RANDOM_FOREST",
    GRADIENT_BOOSTING = "GRADIENT_BOOSTING",
    SVM = "SVM",
    NEURAL_NETWORK = "NEURAL_NETWORK",
    K_MEANS = "K_MEANS",
    DBSCAN = "DBSCAN",
    ISOLATION_FOREST = "ISOLATION_FOREST",
    LSTM = "LSTM",
    TRANSFORMER = "TRANSFORMER",
    AUTOENCODER = "AUTOENCODER"
}
/**
 * ML framework types
 * @enum MLFramework
 */
export declare enum MLFramework {
    TENSORFLOW = "TENSORFLOW",
    PYTORCH = "PYTORCH",
    SCIKIT_LEARN = "SCIKIT_LEARN",
    XGBOOST = "XGBOOST",
    KERAS = "KERAS",
    LIGHTGBM = "LIGHTGBM"
}
/**
 * Training dataset configuration
 * @interface TrainingDataset
 */
export interface TrainingDataset {
    datasetId: string;
    datasetName: string;
    dataSource: string;
    features: FeatureDefinition[];
    targetVariable: string;
    totalSamples: number;
    trainSplit: number;
    validationSplit: number;
    testSplit: number;
    balancingStrategy?: 'oversample' | 'undersample' | 'smote' | 'none';
    preprocessingSteps: PreprocessingStep[];
}
/**
 * Feature definition
 * @interface FeatureDefinition
 */
export interface FeatureDefinition {
    featureName: string;
    featureType: 'numeric' | 'categorical' | 'text' | 'datetime' | 'boolean';
    importance?: number;
    encoding?: 'onehot' | 'label' | 'embedding' | 'tfidf';
    normalization?: 'standard' | 'minmax' | 'robust' | 'none';
    missingValueStrategy?: 'mean' | 'median' | 'mode' | 'drop' | 'ffill';
}
/**
 * Preprocessing step
 * @interface PreprocessingStep
 */
export interface PreprocessingStep {
    stepName: string;
    stepType: 'scaling' | 'encoding' | 'imputation' | 'feature_engineering' | 'dimensionality_reduction';
    parameters: Record<string, any>;
    order: number;
}
/**
 * Model training result
 * @interface TrainingResult
 */
export interface TrainingResult {
    modelId: string;
    trainingDuration: number;
    trainingMetrics: ModelMetrics;
    validationMetrics: ModelMetrics;
    convergenceInfo: ConvergenceInfo;
    featureImportance: FeatureImportance[];
    artifacts: ModelArtifacts;
}
/**
 * Model evaluation metrics
 * @interface ModelMetrics
 */
export interface ModelMetrics {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    roc_auc?: number;
    mse?: number;
    mae?: number;
    r2?: number;
    confusionMatrix?: number[][];
    classificationReport?: Record<string, any>;
}
/**
 * Convergence information
 * @interface ConvergenceInfo
 */
export interface ConvergenceInfo {
    converged: boolean;
    epochs: number;
    finalLoss: number;
    earlyStoppingEpoch?: number;
    learningCurve: number[];
}
/**
 * Feature importance
 * @interface FeatureImportance
 */
export interface FeatureImportance {
    featureName: string;
    importance: number;
    rank: number;
}
/**
 * Model artifacts
 * @interface ModelArtifacts
 */
export interface ModelArtifacts {
    modelPath: string;
    weightsPath?: string;
    scalerPath?: string;
    encoderPath?: string;
    vocabularyPath?: string;
    configPath: string;
}
/**
 * Prediction request
 * @interface PredictionRequest
 */
export interface PredictionRequest {
    modelId: string;
    modelVersion: string;
    inputData: Record<string, any>[];
    explainPrediction?: boolean;
    confidenceThreshold?: number;
}
/**
 * Prediction response
 * @interface PredictionResponse
 */
export interface PredictionResponse {
    predictions: Prediction[];
    modelVersion: string;
    latency: number;
    timestamp: Date;
}
/**
 * Individual prediction
 * @interface Prediction
 */
export interface Prediction {
    predictedValue: any;
    confidence: number;
    probabilities?: Record<string, number>;
    explanation?: ModelExplanation;
}
/**
 * Model explanation (SHAP/LIME)
 * @interface ModelExplanation
 */
export interface ModelExplanation {
    method: 'shap' | 'lime';
    featureContributions: Record<string, number>;
    baseValue: number;
    visualizationData?: any;
}
/**
 * Anomaly detection result
 * @interface AnomalyDetectionResult
 */
export interface AnomalyDetectionResult {
    isAnomaly: boolean;
    anomalyScore: number;
    anomalyProbability: number;
    threshold: number;
    contributors: AnomalyContributor[];
    timestamp: Date;
}
/**
 * Anomaly contributor
 * @interface AnomalyContributor
 */
export interface AnomalyContributor {
    feature: string;
    contribution: number;
    normalRange: [number, number];
    actualValue: number;
}
/**
 * Model deployment configuration
 * @interface ModelDeploymentConfig
 */
export interface ModelDeploymentConfig {
    deploymentId: string;
    modelId: string;
    modelVersion: string;
    deploymentEnvironment: 'dev' | 'staging' | 'production';
    endpoint: string;
    scalingConfig: ScalingConfig;
    monitoringConfig: MonitoringConfig;
    canaryConfig?: CanaryConfig;
}
/**
 * Scaling configuration
 * @interface ScalingConfig
 */
export interface ScalingConfig {
    minInstances: number;
    maxInstances: number;
    targetCPU: number;
    targetMemory: number;
    autoScaling: boolean;
}
/**
 * Monitoring configuration
 * @interface MonitoringConfig
 */
export interface MonitoringConfig {
    enableMetrics: boolean;
    enableLogging: boolean;
    alertThresholds: {
        latencyMs: number;
        errorRate: number;
        throughput: number;
    };
}
/**
 * Canary deployment configuration
 * @interface CanaryConfig
 */
export interface CanaryConfig {
    enabled: boolean;
    trafficPercentage: number;
    duration: number;
    successCriteria: {
        maxErrorRate: number;
        minSuccessRate: number;
    };
}
/**
 * Creates and initializes a new ML model configuration
 * @param {Object} config - Model configuration parameters
 * @returns {MLModelConfig} Initialized model configuration
 * @example
 * const model = createMLModel({
 *   modelName: 'Threat Classification Model',
 *   modelType: MLModelType.CLASSIFICATION,
 *   algorithm: MLAlgorithm.RANDOM_FOREST
 * });
 */
export declare function createMLModel(config: {
    modelName: string;
    modelType: MLModelType;
    algorithm: MLAlgorithm;
    framework: MLFramework;
    features: string[];
    targetVariable: string;
    hyperparameters?: Record<string, any>;
}): MLModelConfig;
/**
 * Trains a machine learning model with the provided dataset
 * @param {MLModelConfig} model - Model configuration
 * @param {TrainingDataset} dataset - Training dataset
 * @param {Object} options - Training options
 * @returns {TrainingResult} Training results and metrics
 * @example
 * const result = await trainMLModel(model, dataset, {
 *   epochs: 100,
 *   batchSize: 32,
 *   earlyStoppingPatience: 10
 * });
 */
export declare function trainMLModel(model: MLModelConfig, dataset: TrainingDataset, options?: {
    epochs?: number;
    batchSize?: number;
    validationSplit?: number;
    earlyStoppingPatience?: number;
    learningRate?: number;
}): Promise<TrainingResult>;
/**
 * Deploys a trained ML model to a specified environment
 * @param {string} modelId - Model identifier
 * @param {string} modelVersion - Model version
 * @param {Object} deploymentConfig - Deployment configuration
 * @returns {ModelDeploymentConfig} Deployment configuration
 * @example
 * const deployment = await deployMLModel('ml-abc123', '1.0.0', {
 *   environment: 'production',
 *   minInstances: 2,
 *   maxInstances: 10
 * });
 */
export declare function deployMLModel(modelId: string, modelVersion: string, deploymentConfig: {
    environment: 'dev' | 'staging' | 'production';
    minInstances?: number;
    maxInstances?: number;
    enableCanary?: boolean;
    canaryTrafficPercentage?: number;
}): Promise<ModelDeploymentConfig>;
/**
 * Makes predictions using a deployed ML model
 * @param {PredictionRequest} request - Prediction request
 * @returns {PredictionResponse} Prediction results
 * @example
 * const predictions = await predictWithMLModel({
 *   modelId: 'ml-abc123',
 *   modelVersion: '1.0.0',
 *   inputData: [{ feature1: 10, feature2: 'value' }],
 *   explainPrediction: true
 * });
 */
export declare function predictWithMLModel(request: PredictionRequest): Promise<PredictionResponse>;
/**
 * Updates an existing ML model with incremental learning
 * @param {string} modelId - Model identifier
 * @param {any[]} newData - New training data
 * @returns {TrainingResult} Updated training results
 * @example
 * const result = await updateMLModelIncremental('ml-abc123', newThreatData);
 */
export declare function updateMLModelIncremental(modelId: string, newData: any[]): Promise<TrainingResult>;
/**
 * Creates an anomaly detection model
 * @param {Object} config - Anomaly detection configuration
 * @returns {MLModelConfig} Anomaly detection model
 * @example
 * const model = createAnomalyDetectionModel({
 *   algorithm: MLAlgorithm.ISOLATION_FOREST,
 *   features: ['login_frequency', 'data_volume', 'access_time'],
 *   contamination: 0.05
 * });
 */
export declare function createAnomalyDetectionModel(config: {
    algorithm: MLAlgorithm;
    features: string[];
    contamination?: number;
}): MLModelConfig;
/**
 * Detects anomalies in threat intelligence data
 * @param {string} modelId - Anomaly detection model ID
 * @param {any[]} data - Data to analyze
 * @returns {AnomalyDetectionResult[]} Anomaly detection results
 * @example
 * const anomalies = await detectAnomalies('ml-anom-001', threatEvents);
 */
export declare function detectAnomalies(modelId: string, data: any[]): Promise<AnomalyDetectionResult[]>;
/**
 * Trains a statistical anomaly detection model
 * @param {any[]} historicalData - Historical baseline data
 * @param {Object} options - Training options
 * @returns {MLModelConfig} Trained anomaly model
 * @example
 * const model = trainStatisticalAnomalyModel(historicalEvents, {
 *   method: 'isolation_forest',
 *   features: ['frequency', 'volume', 'timing']
 * });
 */
export declare function trainStatisticalAnomalyModel(historicalData: any[], options: {
    method: 'isolation_forest' | 'one_class_svm' | 'autoencoder';
    features: string[];
    contamination?: number;
}): MLModelConfig;
/**
 * Updates anomaly detection baseline
 * @param {string} modelId - Model identifier
 * @param {any[]} newBaselineData - New baseline data
 * @returns {Object} Update result
 * @example
 * const result = await updateAnomalyBaseline('ml-anom-001', recentNormalData);
 */
export declare function updateAnomalyBaseline(modelId: string, newBaselineData: any[]): Promise<{
    success: boolean;
    samplesAdded: number;
}>;
/**
 * Creates a threat classification model
 * @param {Object} config - Classification configuration
 * @returns {MLModelConfig} Classification model
 * @example
 * const model = createThreatClassificationModel({
 *   classes: ['malware', 'phishing', 'ransomware', 'apt'],
 *   features: ['ioc_type', 'severity', 'frequency'],
 *   algorithm: MLAlgorithm.RANDOM_FOREST
 * });
 */
export declare function createThreatClassificationModel(config: {
    classes: string[];
    features: string[];
    algorithm: MLAlgorithm;
}): MLModelConfig;
/**
 * Trains a multi-class threat classifier
 * @param {TrainingDataset} dataset - Training dataset
 * @param {Object} options - Training options
 * @returns {TrainingResult} Training results
 * @example
 * const result = await trainThreatClassifier(dataset, {
 *   algorithm: MLAlgorithm.GRADIENT_BOOSTING,
 *   balanceClasses: true
 * });
 */
export declare function trainThreatClassifier(dataset: TrainingDataset, options: {
    algorithm: MLAlgorithm;
    balanceClasses?: boolean;
    crossValidation?: number;
}): Promise<TrainingResult>;
/**
 * Classifies threats using trained model
 * @param {string} modelId - Model identifier
 * @param {any[]} threats - Threats to classify
 * @returns {Object[]} Classification results
 * @example
 * const results = await classifyThreats('ml-class-001', unknownThreats);
 */
export declare function classifyThreats(modelId: string, threats: any[]): Promise<Array<{
    threatId: string;
    predictedClass: string;
    confidence: number;
    classProbabilities: Record<string, number>;
}>>;
/**
 * Performs multi-label threat classification
 * @param {string} modelId - Model identifier
 * @param {any} threat - Threat to classify
 * @returns {Object} Multi-label classification result
 * @example
 * const result = await multiLabelThreatClassification('ml-multi-001', threat);
 */
export declare function multiLabelThreatClassification(modelId: string, threat: any): Promise<{
    threatId: string;
    labels: Array<{
        label: string;
        confidence: number;
    }>;
}>;
/**
 * Creates a threat clustering model
 * @param {Object} config - Clustering configuration
 * @returns {MLModelConfig} Clustering model
 * @example
 * const model = createThreatClusteringModel({
 *   algorithm: MLAlgorithm.K_MEANS,
 *   features: ['behavior_pattern', 'infrastructure', 'ttp'],
 *   nClusters: 10
 * });
 */
export declare function createThreatClusteringModel(config: {
    algorithm: MLAlgorithm;
    features: string[];
    nClusters?: number;
}): MLModelConfig;
/**
 * Clusters threats based on similarity
 * @param {string} modelId - Model identifier
 * @param {any[]} threats - Threats to cluster
 * @returns {Object} Clustering results
 * @example
 * const clusters = await clusterThreats('ml-cluster-001', threatData);
 */
export declare function clusterThreats(modelId: string, threats: any[]): Promise<{
    clusters: Array<{
        clusterId: number;
        threats: any[];
        centroid: Record<string, number>;
        size: number;
    }>;
    silhouetteScore: number;
}>;
/**
 * Performs hierarchical clustering on threats
 * @param {any[]} threats - Threats to cluster
 * @param {Object} options - Clustering options
 * @returns {Object} Hierarchical clustering result
 * @example
 * const hierarchy = await hierarchicalThreatClustering(threats, {
 *   linkage: 'ward',
 *   distanceThreshold: 0.5
 * });
 */
export declare function hierarchicalThreatClustering(threats: any[], options: {
    linkage: 'ward' | 'complete' | 'average' | 'single';
    distanceThreshold?: number;
    nClusters?: number;
}): Promise<{
    dendrogram: any;
    clusters: number[];
    nClusters: number;
}>;
/**
 * Identifies outlier threats using DBSCAN
 * @param {any[]} threats - Threats to analyze
 * @param {Object} options - DBSCAN options
 * @returns {Object} Outlier detection result
 * @example
 * const outliers = await identifyOutlierThreats(threats, {
 *   eps: 0.5,
 *   minSamples: 5
 * });
 */
export declare function identifyOutlierThreats(threats: any[], options: {
    eps: number;
    minSamples: number;
}): Promise<{
    outliers: any[];
    clusters: number[];
    nClusters: number;
}>;
/**
 * Trains a threat forecasting model
 * @param {any[]} historicalThreats - Historical threat data
 * @param {Object} options - Forecasting options
 * @returns {MLModelConfig} Forecasting model
 * @example
 * const model = trainThreatForecastingModel(historicalData, {
 *   forecastHorizon: 30,
 *   algorithm: MLAlgorithm.LSTM
 * });
 */
export declare function trainThreatForecastingModel(historicalThreats: any[], options: {
    forecastHorizon: number;
    algorithm: MLAlgorithm;
    features: string[];
}): MLModelConfig;
/**
 * Predicts future threat trends
 * @param {string} modelId - Model identifier
 * @param {number} forecastDays - Number of days to forecast
 * @returns {Object} Forecast results
 * @example
 * const forecast = await predictThreatTrends('ml-forecast-001', 30);
 */
export declare function predictThreatTrends(modelId: string, forecastDays: number): Promise<{
    forecast: Array<{
        date: Date;
        predictedCount: number;
        confidenceInterval: [number, number];
    }>;
    accuracy: number;
}>;
/**
 * Predicts threat actor behavior
 * @param {string} actorId - Threat actor identifier
 * @param {Object} options - Prediction options
 * @returns {Object} Behavior prediction
 * @example
 * const prediction = await predictThreatActorBehavior('actor-001', {
 *   timeframe: 30,
 *   includeConfidence: true
 * });
 */
export declare function predictThreatActorBehavior(actorId: string, options: {
    timeframe: number;
    includeConfidence?: boolean;
}): Promise<{
    actorId: string;
    predictedTactics: string[];
    predictedTargets: string[];
    activityProbability: number;
    confidence: number;
}>;
/**
 * Forecasts vulnerability exploitation likelihood
 * @param {string} vulnerabilityId - Vulnerability identifier
 * @returns {Object} Exploitation forecast
 * @example
 * const forecast = await forecastVulnerabilityExploitation('CVE-2024-1234');
 */
export declare function forecastVulnerabilityExploitation(vulnerabilityId: string): Promise<{
    vulnerabilityId: string;
    exploitationProbability: number;
    estimatedTimeToExploit: number;
    confidenceScore: number;
    factors: Array<{
        factor: string;
        weight: number;
    }>;
}>;
/**
 * Creates an NLP model for threat report analysis
 * @param {Object} config - NLP configuration
 * @returns {MLModelConfig} NLP model
 * @example
 * const model = createThreatNLPModel({
 *   task: 'classification',
 *   vocabulary: threatTerms,
 *   maxSequenceLength: 512
 * });
 */
export declare function createThreatNLPModel(config: {
    task: 'classification' | 'ner' | 'sentiment' | 'summarization';
    vocabulary?: string[];
    maxSequenceLength: number;
}): MLModelConfig;
/**
 * Extracts threat entities from text
 * @param {string} text - Text to analyze
 * @param {string} modelId - NLP model identifier
 * @returns {Object[]} Extracted entities
 * @example
 * const entities = await extractThreatEntities(reportText, 'ml-nlp-001');
 */
export declare function extractThreatEntities(text: string, modelId: string): Promise<Array<{
    entity: string;
    type: 'IOC' | 'THREAT_ACTOR' | 'MALWARE' | 'TECHNIQUE' | 'TOOL';
    confidence: number;
    position: [number, number];
}>>;
/**
 * Summarizes threat intelligence reports
 * @param {string} report - Report text
 * @param {Object} options - Summarization options
 * @returns {Object} Summary result
 * @example
 * const summary = await summarizeThreatReport(longReport, {
 *   maxLength: 200,
 *   extractKeyPoints: true
 * });
 */
export declare function summarizeThreatReport(report: string, options: {
    maxLength: number;
    extractKeyPoints?: boolean;
}): Promise<{
    summary: string;
    keyPoints: string[];
    length: number;
}>;
/**
 * Performs sentiment analysis on threat discussions
 * @param {string[]} texts - Texts to analyze
 * @returns {Object[]} Sentiment analysis results
 * @example
 * const sentiments = await analyzeThreatSentiment(forumPosts);
 */
export declare function analyzeThreatSentiment(texts: string[]): Promise<Array<{
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
}>>;
/**
 * Engineers features from raw threat data
 * @param {any[]} rawData - Raw threat data
 * @param {string[]} featureDefinitions - Feature definitions
 * @returns {Object} Engineered features
 * @example
 * const features = engineerThreatFeatures(rawData, [
 *   'log_frequency',
 *   'hour_of_day',
 *   'data_volume_ratio'
 * ]);
 */
export declare function engineerThreatFeatures(rawData: any[], featureDefinitions: string[]): {
    features: Record<string, any>[];
    featureNames: string[];
};
/**
 * Creates temporal features from timestamps
 * @param {Date[]} timestamps - Array of timestamps
 * @returns {Object[]} Temporal features
 * @example
 * const temporalFeatures = createTemporalFeatures(eventTimestamps);
 */
export declare function createTemporalFeatures(timestamps: Date[]): Array<{
    hour: number;
    dayOfWeek: number;
    isWeekend: boolean;
    isBusinessHours: boolean;
    timeSinceLast: number;
}>;
/**
 * Extracts statistical features from sequences
 * @param {number[][]} sequences - Array of numeric sequences
 * @returns {Object[]} Statistical features
 * @example
 * const stats = extractStatisticalFeatures(numericSequences);
 */
export declare function extractStatisticalFeatures(sequences: number[][]): Array<{
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    q25: number;
    q75: number;
}>;
/**
 * Performs feature selection using importance scores
 * @param {Record<string, number>} featureImportances - Feature importance scores
 * @param {number} topN - Number of top features to select
 * @returns {string[]} Selected feature names
 * @example
 * const selected = selectTopFeatures(importanceScores, 10);
 */
export declare function selectTopFeatures(featureImportances: Record<string, number>, topN: number): string[];
/**
 * Evaluates model performance on test data
 * @param {string} modelId - Model identifier
 * @param {any[]} testData - Test dataset
 * @param {any[]} trueLabels - True labels
 * @returns {ModelMetrics} Evaluation metrics
 * @example
 * const metrics = await evaluateMLModel('ml-001', testData, trueLabels);
 */
export declare function evaluateMLModel(modelId: string, testData: any[], trueLabels: any[]): Promise<ModelMetrics>;
/**
 * Performs cross-validation on a model
 * @param {MLModelConfig} model - Model configuration
 * @param {TrainingDataset} dataset - Training dataset
 * @param {number} nFolds - Number of cross-validation folds
 * @returns {Object} Cross-validation results
 * @example
 * const cvResults = await performCrossValidation(model, dataset, 5);
 */
export declare function performCrossValidation(model: MLModelConfig, dataset: TrainingDataset, nFolds?: number): Promise<{
    foldScores: number[];
    meanScore: number;
    stdScore: number;
    metrics: ModelMetrics;
}>;
/**
 * Calculates model bias and fairness metrics
 * @param {string} modelId - Model identifier
 * @param {any[]} testData - Test data with sensitive attributes
 * @returns {Object} Bias analysis results
 * @example
 * const biasAnalysis = await analyzeModelBias('ml-001', testDataWithAttributes);
 */
export declare function analyzeModelBias(modelId: string, testData: any[]): Promise<{
    overallAccuracy: number;
    groupMetrics: Record<string, ModelMetrics>;
    disparateImpact: number;
    equalizedOdds: boolean;
}>;
/**
 * Generates model performance report
 * @param {string} modelId - Model identifier
 * @param {ModelMetrics} metrics - Model metrics
 * @returns {Object} Performance report
 * @example
 * const report = generateModelPerformanceReport('ml-001', metrics);
 */
export declare function generateModelPerformanceReport(modelId: string, metrics: ModelMetrics): {
    modelId: string;
    performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
};
/**
 * Creates a new model version
 * @param {string} modelId - Model identifier
 * @param {string} versionTag - Version tag
 * @param {Object} changes - Changes in this version
 * @returns {Object} Version information
 * @example
 * const version = createModelVersion('ml-001', 'v2.1.0', {
 *   improvements: ['Added new features', 'Improved accuracy']
 * });
 */
export declare function createModelVersion(modelId: string, versionTag: string, changes: {
    improvements?: string[];
    bugFixes?: string[];
    breaking?: boolean;
}): {
    versionId: string;
    modelId: string;
    version: string;
    changes: typeof changes;
    createdAt: Date;
};
/**
 * Compares two model versions
 * @param {string} modelId - Model identifier
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {Object} Comparison results
 * @example
 * const comparison = await compareModelVersions('ml-001', 'v1.0.0', 'v2.0.0');
 */
export declare function compareModelVersions(modelId: string, version1: string, version2: string): Promise<{
    metricDifferences: Record<string, number>;
    performanceImprovement: number;
    recommendation: 'upgrade' | 'keep_current' | 'evaluate_further';
}>;
/**
 * Rolls back to a previous model version
 * @param {string} modelId - Model identifier
 * @param {string} targetVersion - Version to roll back to
 * @returns {Object} Rollback result
 * @example
 * const result = await rollbackModelVersion('ml-001', 'v1.5.0');
 */
export declare function rollbackModelVersion(modelId: string, targetVersion: string): Promise<{
    success: boolean;
    currentVersion: string;
    rollbackReason?: string;
}>;
/**
 * Automatically selects best algorithm for dataset
 * @param {TrainingDataset} dataset - Training dataset
 * @param {Object} options - AutoML options
 * @returns {Object} Algorithm recommendation
 * @example
 * const recommendation = await autoSelectAlgorithm(dataset, {
 *   taskType: 'classification',
 *   maxTrainingTime: 3600
 * });
 */
export declare function autoSelectAlgorithm(dataset: TrainingDataset, options: {
    taskType: 'classification' | 'regression' | 'clustering';
    maxTrainingTime?: number;
    optimizeFor?: 'accuracy' | 'speed' | 'interpretability';
}): Promise<{
    recommendedAlgorithm: MLAlgorithm;
    recommendedHyperparameters: Record<string, any>;
    expectedPerformance: number;
    reasoning: string[];
}>;
/**
 * Performs hyperparameter tuning
 * @param {MLModelConfig} model - Model configuration
 * @param {TrainingDataset} dataset - Training dataset
 * @param {Object} searchSpace - Hyperparameter search space
 * @returns {Object} Tuning results
 * @example
 * const tuned = await tuneHyperparameters(model, dataset, {
 *   n_estimators: [50, 100, 200],
 *   max_depth: [5, 10, 15]
 * });
 */
export declare function tuneHyperparameters(model: MLModelConfig, dataset: TrainingDataset, searchSpace: Record<string, any[]>): Promise<{
    bestHyperparameters: Record<string, any>;
    bestScore: number;
    searchResults: Array<{
        hyperparameters: Record<string, any>;
        score: number;
    }>;
}>;
/**
 * Automatically generates features from raw data
 * @param {any[]} rawData - Raw input data
 * @param {Object} options - Feature generation options
 * @returns {Object} Generated features
 * @example
 * const features = await autoGenerateFeatures(rawData, {
 *   maxFeatures: 20,
 *   includeInteractions: true
 * });
 */
export declare function autoGenerateFeatures(rawData: any[], options: {
    maxFeatures?: number;
    includeInteractions?: boolean;
    includePolynomials?: boolean;
}): Promise<{
    features: Record<string, any>[];
    featureDescriptions: Record<string, string>;
    importanceScores: Record<string, number>;
}>;
/**
 * Creates an ensemble of multiple models
 * @param {string[]} modelIds - Array of model identifiers
 * @param {Object} options - Ensemble options
 * @returns {Object} Ensemble configuration
 * @example
 * const ensemble = createEnsembleModel(['ml-001', 'ml-002', 'ml-003'], {
 *   method: 'voting',
 *   weights: [0.4, 0.35, 0.25]
 * });
 */
export declare function createEnsembleModel(modelIds: string[], options: {
    method: 'voting' | 'stacking' | 'bagging' | 'boosting';
    weights?: number[];
}): {
    ensembleId: string;
    modelIds: string[];
    method: string;
    weights: number[];
};
/**
 * Makes predictions using ensemble model
 * @param {string} ensembleId - Ensemble identifier
 * @param {any[]} data - Input data
 * @returns {Prediction[]} Ensemble predictions
 * @example
 * const predictions = await ensemblePredict('ensemble-abc', inputData);
 */
export declare function ensemblePredict(ensembleId: string, data: any[]): Promise<Prediction[]>;
/**
 * Generates SHAP (SHapley Additive exPlanations) values
 * @param {string} modelId - Model identifier
 * @param {any} instance - Instance to explain
 * @returns {ModelExplanation} SHAP explanation
 * @example
 * const explanation = await generateSHAPExplanation('ml-001', threatInstance);
 */
export declare function generateSHAPExplanation(modelId: string, instance: any): Promise<ModelExplanation>;
/**
 * Generates LIME (Local Interpretable Model-agnostic Explanations)
 * @param {string} modelId - Model identifier
 * @param {any} instance - Instance to explain
 * @returns {ModelExplanation} LIME explanation
 * @example
 * const explanation = await generateLIMEExplanation('ml-001', threatInstance);
 */
export declare function generateLIMEExplanation(modelId: string, instance: any): Promise<ModelExplanation>;
/**
 * Generates global feature importance explanations
 * @param {string} modelId - Model identifier
 * @returns {FeatureImportance[]} Global feature importance
 * @example
 * const importance = await getGlobalFeatureImportance('ml-001');
 */
export declare function getGlobalFeatureImportance(modelId: string): Promise<FeatureImportance[]>;
/**
 * Sets up A/B test for model comparison
 * @param {string} modelA - Model A identifier
 * @param {string} modelB - Model B identifier
 * @param {Object} config - A/B test configuration
 * @returns {Object} A/B test configuration
 * @example
 * const abTest = setupABTest('ml-v1', 'ml-v2', {
 *   trafficSplit: 0.5,
 *   duration: 7 * 24 * 60 * 60 * 1000
 * });
 */
export declare function setupABTest(modelA: string, modelB: string, config: {
    trafficSplit: number;
    duration: number;
    successMetric: 'accuracy' | 'precision' | 'recall' | 'latency';
}): {
    testId: string;
    modelA: string;
    modelB: string;
    config: typeof config;
    startDate: Date;
};
/**
 * Analyzes A/B test results
 * @param {string} testId - A/B test identifier
 * @returns {Object} A/B test analysis
 * @example
 * const results = await analyzeABTest('abtest-abc123');
 */
export declare function analyzeABTest(testId: string): Promise<{
    testId: string;
    modelAPerformance: number;
    modelBPerformance: number;
    improvement: number;
    statisticalSignificance: number;
    recommendation: 'use_model_a' | 'use_model_b' | 'continue_testing';
}>;
/**
 * Sequelize model attributes for ML Model
 */
export declare const MLModelAttributes: {
    modelId: {
        type: string;
        primaryKey: boolean;
    };
    modelName: {
        type: string;
        allowNull: boolean;
    };
    modelType: {
        type: string;
        values: MLModelType[];
    };
    algorithm: {
        type: string;
        values: MLAlgorithm[];
    };
    version: {
        type: string;
    };
    framework: {
        type: string;
        values: MLFramework[];
    };
    hyperparameters: {
        type: string;
    };
    features: {
        type: string;
    };
    targetVariable: {
        type: string;
    };
    metadata: {
        type: string;
    };
};
/**
 * Sequelize model attributes for Training Result
 */
export declare const TrainingResultAttributes: {
    resultId: {
        type: string;
        primaryKey: boolean;
    };
    modelId: {
        type: string;
        references: {
            model: string;
            key: string;
        };
    };
    trainingDuration: {
        type: string;
    };
    trainingMetrics: {
        type: string;
    };
    validationMetrics: {
        type: string;
    };
    convergenceInfo: {
        type: string;
    };
    featureImportance: {
        type: string;
    };
    artifacts: {
        type: string;
    };
};
/**
 * Sequelize model attributes for Model Deployment
 */
export declare const ModelDeploymentAttributes: {
    deploymentId: {
        type: string;
        primaryKey: boolean;
    };
    modelId: {
        type: string;
        references: {
            model: string;
            key: string;
        };
    };
    modelVersion: {
        type: string;
    };
    deploymentEnvironment: {
        type: string;
        values: string[];
    };
    endpoint: {
        type: string;
    };
    scalingConfig: {
        type: string;
    };
    monitoringConfig: {
        type: string;
    };
    canaryConfig: {
        type: string;
    };
};
declare const _default: {
    createMLModel: typeof createMLModel;
    trainMLModel: typeof trainMLModel;
    deployMLModel: typeof deployMLModel;
    predictWithMLModel: typeof predictWithMLModel;
    updateMLModelIncremental: typeof updateMLModelIncremental;
    createAnomalyDetectionModel: typeof createAnomalyDetectionModel;
    detectAnomalies: typeof detectAnomalies;
    trainStatisticalAnomalyModel: typeof trainStatisticalAnomalyModel;
    updateAnomalyBaseline: typeof updateAnomalyBaseline;
    createThreatClassificationModel: typeof createThreatClassificationModel;
    trainThreatClassifier: typeof trainThreatClassifier;
    classifyThreats: typeof classifyThreats;
    multiLabelThreatClassification: typeof multiLabelThreatClassification;
    createThreatClusteringModel: typeof createThreatClusteringModel;
    clusterThreats: typeof clusterThreats;
    hierarchicalThreatClustering: typeof hierarchicalThreatClustering;
    identifyOutlierThreats: typeof identifyOutlierThreats;
    trainThreatForecastingModel: typeof trainThreatForecastingModel;
    predictThreatTrends: typeof predictThreatTrends;
    predictThreatActorBehavior: typeof predictThreatActorBehavior;
    forecastVulnerabilityExploitation: typeof forecastVulnerabilityExploitation;
    createThreatNLPModel: typeof createThreatNLPModel;
    extractThreatEntities: typeof extractThreatEntities;
    summarizeThreatReport: typeof summarizeThreatReport;
    analyzeThreatSentiment: typeof analyzeThreatSentiment;
    engineerThreatFeatures: typeof engineerThreatFeatures;
    createTemporalFeatures: typeof createTemporalFeatures;
    extractStatisticalFeatures: typeof extractStatisticalFeatures;
    selectTopFeatures: typeof selectTopFeatures;
    evaluateMLModel: typeof evaluateMLModel;
    performCrossValidation: typeof performCrossValidation;
    analyzeModelBias: typeof analyzeModelBias;
    generateModelPerformanceReport: typeof generateModelPerformanceReport;
    createModelVersion: typeof createModelVersion;
    compareModelVersions: typeof compareModelVersions;
    rollbackModelVersion: typeof rollbackModelVersion;
    autoSelectAlgorithm: typeof autoSelectAlgorithm;
    tuneHyperparameters: typeof tuneHyperparameters;
    autoGenerateFeatures: typeof autoGenerateFeatures;
    createEnsembleModel: typeof createEnsembleModel;
    ensemblePredict: typeof ensemblePredict;
    generateSHAPExplanation: typeof generateSHAPExplanation;
    generateLIMEExplanation: typeof generateLIMEExplanation;
    getGlobalFeatureImportance: typeof getGlobalFeatureImportance;
    setupABTest: typeof setupABTest;
    analyzeABTest: typeof analyzeABTest;
};
export default _default;
//# sourceMappingURL=threat-intelligence-ml-models-kit.d.ts.map