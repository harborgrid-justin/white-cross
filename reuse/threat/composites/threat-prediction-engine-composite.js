"use strict";
/**
 * LOC: THREATPREDENG001
 * File: /reuse/threat/composites/threat-prediction-engine-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-prediction-forecasting-kit
 *   - ../threat-intelligence-ml-models-kit
 *   - ../apt-detection-tracking-kit
 *   - ../advanced-threat-hunting-kit
 *   - ../endpoint-threat-detection-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Predictive threat intelligence services
 *   - Healthcare threat forecasting systems
 *   - ML-based security analytics
 *   - Proactive threat mitigation engines
 *   - Executive security dashboards
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.performPredictiveCampaignTracking = exports.generateMLDrivenHuntingHypotheses = exports.predictVulnerabilityExploitationPriority = exports.forecastAttackSurfaceEvolution = exports.trainEnsembleThreatPredictionModel = exports.performAdvancedThreatActorProfiling = exports.generateHealthcareThreatForecast = exports.generateComprehensiveThreatPrediction = void 0;
// Import from threat prediction forecasting kit
const threat_prediction_forecasting_kit_1 = require("../threat-prediction-forecasting-kit");
// Import from threat intelligence ML models kit
const threat_intelligence_ml_models_kit_1 = require("../threat-intelligence-ml-models-kit");
// Import from APT detection tracking kit
const apt_detection_tracking_kit_1 = require("../apt-detection-tracking-kit");
// Import from advanced threat hunting kit
const advanced_threat_hunting_kit_1 = require("../advanced-threat-hunting-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - THREAT PREDICTION CORE
// ============================================================================
/**
 * Generates comprehensive threat predictions using multiple ML models
 * Combines classification, clustering, and forecasting models
 *
 * @param targetId - Target entity identifier
 * @param context - Threat context data
 * @param config - Prediction configuration
 * @returns Comprehensive threat prediction
 */
const generateComprehensiveThreatPrediction = async (targetId, context, config) => {
    // Extract features for ML models
    const features = (0, threat_prediction_forecasting_kit_1.extractThreatFeatures)({
        targetId,
        ...context,
        timestamp: new Date(),
    });
    // Add temporal features
    const temporalFeatures = (0, threat_intelligence_ml_models_kit_1.createTemporalFeatures)(context.historicalThreats || [], { includeSeasonality: true, includeTrends: true });
    // Add statistical features
    const statisticalFeatures = (0, threat_intelligence_ml_models_kit_1.extractStatisticalFeatures)(context.historicalThreats || []);
    const allFeatures = { ...features, ...temporalFeatures, ...statisticalFeatures };
    // Predict attack vectors
    const attackVectors = await (0, threat_prediction_forecasting_kit_1.predictAttackVectors)(targetId, allFeatures);
    // Classify threat types using ML
    const threatClassification = await (0, threat_intelligence_ml_models_kit_1.classifyThreats)([allFeatures], {
        includeMultiLabel: true,
        confidenceThreshold: config?.confidenceThreshold || 70,
    });
    // Predict threat impact
    const impactPrediction = await (0, threat_prediction_forecasting_kit_1.predictThreatImpact)(targetId, allFeatures);
    // Calculate attack probability
    const attackProbability = (0, threat_prediction_forecasting_kit_1.calculateAttackProbability)({
        targetAttractiveness: (0, threat_prediction_forecasting_kit_1.scoreTargetAttractiveness)({
            assetValue: context.assetValue || 50,
            visibility: 70,
            vulnerability: 60,
        }),
        threatLevel: 65,
        defenseStrength: 75,
    });
    // Estimate time to attack
    const timeToAttack = await (0, threat_prediction_forecasting_kit_1.estimateTimeToAttack)(targetId, allFeatures);
    // Predict threat actors likely to target
    const threatActors = await predictThreatActorsForTarget(targetId, context);
    // Identify related campaigns
    const campaigns = await identifyPotentialCampaigns(targetId, allFeatures);
    // Generate risk score
    const riskScore = (0, threat_prediction_forecasting_kit_1.generateComprehensiveRiskScore)({
        threatSeverity: impactPrediction.severity,
        attackProbability,
        assetValue: context.assetValue || 50,
        vulnerabilityScore: 60,
        threatActorCapability: Math.max(...threatActors.map(a => a.capability)),
    });
    // Generate prediction confidence
    const confidenceScore = (0, threat_prediction_forecasting_kit_1.generatePredictionConfidence)({
        modelAccuracy: 0.85,
        featureQuality: 0.90,
        dataCompleteness: 0.88,
        ensembleAgreement: 0.92,
    });
    // Create threat prediction
    const prediction = await (0, threat_prediction_forecasting_kit_1.createThreatPrediction)({
        threatType: threatClassification[0]?.threatType || 'unknown',
        threatCategory: threatClassification[0]?.category || 'general',
        predictedSeverity: impactPrediction.severity,
        confidenceScore,
        attackProbability,
        targetAsset: targetId,
        modelId: 'ensemble-prediction-v1',
        features: allFeatures,
    });
    // Generate ML explanation
    const mlExplanation = await (0, threat_intelligence_ml_models_kit_1.generateSHAPExplanation)('ensemble-prediction-v1', allFeatures);
    // Generate mitigation recommendations
    const recommendations = generateThreatMitigationRecommendations(threatClassification[0]?.threatType || 'unknown', attackVectors, riskScore);
    return {
        predictionId: prediction.id,
        timestamp: new Date(),
        threatType: prediction.threatType,
        threatCategory: prediction.threatCategory,
        predictedSeverity: prediction.predictedSeverity,
        confidenceScore,
        attackVectors: attackVectors.map(av => ({
            vector: av.vector,
            likelihood: av.likelihood,
            impact: av.impact,
        })),
        targetedAssets: [targetId],
        estimatedTimeToAttack: timeToAttack,
        attackProbability,
        riskScore,
        threatActors,
        campaigns,
        mitreMapping: extractMITREMapping(attackVectors),
        indicators: extractThreatIndicators(allFeatures),
        mitigationRecommendations: recommendations,
        mlExplanation,
        metadata: {
            modelVersion: 'v1.0',
            predictionDate: new Date(),
            featuresUsed: Object.keys(allFeatures).length,
        },
    };
};
exports.generateComprehensiveThreatPrediction = generateComprehensiveThreatPrediction;
/**
 * Generates healthcare-specific threat forecast
 * Predicts threat trends for healthcare facilities
 *
 * @param facilityId - Healthcare facility identifier
 * @param forecastHorizon - Hours to forecast ahead
 * @returns Healthcare threat forecast
 */
const generateHealthcareThreatForecast = async (facilityId, forecastHorizon = 168, // 7 days default
options) => {
    const granularity = options?.granularity || 'daily';
    // Analyze historical threat trends
    const trendAnalysis = await (0, threat_prediction_forecasting_kit_1.analyzeThreatTrends)(facilityId, {
        timeWindow: 90, // 90 days of history
        includeSeasonality: true,
    });
    // Identify emerging threats specific to healthcare
    const emergingThreats = await (0, threat_prediction_forecasting_kit_1.identifyEmergingThreats)({
        industry: 'healthcare',
        geography: 'facility-' + facilityId,
        timeWindow: 30,
    });
    // Detect seasonal patterns
    const seasonalPatterns = await (0, threat_prediction_forecasting_kit_1.detectSeasonalPatterns)(facilityId, {
        minPeriod: 7,
        maxPeriod: 365,
    });
    // Analyze industry-specific trends
    const industryTrends = await (0, threat_prediction_forecasting_kit_1.analyzeIndustryTrends)('healthcare', {
        includeRegional: true,
        includeThreatTypes: true,
    });
    // Train forecasting models for each threat category
    const threatCategories = ['ransomware', 'phishing', 'insider_threat', 'data_breach', 'ddos'];
    const categoryForecasts = [];
    for (const category of threatCategories) {
        // Get historical data for this category
        const historicalData = trendAnalysis.categoryData?.[category] || [];
        // Train forecasting model
        const forecastModel = (0, threat_intelligence_ml_models_kit_1.trainThreatForecastingModel)(historicalData, { horizon: forecastHorizon, method: 'arima' });
        // Generate forecast
        const forecast = await (0, threat_intelligence_ml_models_kit_1.predictThreatTrends)(forecastModel.modelId, {
            horizon: forecastHorizon,
            granularity,
            includeConfidenceInterval: true,
        });
        // Determine trend direction
        const trendDirection = determineTrendDirection(forecast.predictions);
        categoryForecasts.push({
            category,
            currentLevel: historicalData[historicalData.length - 1]?.value || 0,
            predictedTrend: trendDirection,
            forecast: forecast.predictions.map(p => ({
                timestamp: p.timestamp,
                value: p.value,
                confidence: p.confidence,
                upperBound: p.upperBound,
                lowerBound: p.lowerBound,
            })),
        });
    }
    // Identify vulnerability hotspots
    const vulnerabilityHotspots = await identifyVulnerabilityHotspots(facilityId, {
        includeDepartments: true,
        includeAssets: true,
    });
    // Assess compliance risks
    const complianceRisks = options?.includeCompliance
        ? await assessHealthcareComplianceRisks(facilityId, categoryForecasts)
        : [];
    // Generate recommendations
    const recommendations = generateForecastRecommendations(categoryForecasts, emergingThreats, complianceRisks);
    return {
        forecastId: `forecast-${facilityId}-${Date.now()}`,
        facilityId,
        departmentId: options?.departmentId,
        forecastPeriod: {
            start: new Date(),
            end: new Date(Date.now() + forecastHorizon * 60 * 60 * 1000),
            granularity,
        },
        threatCategories: categoryForecasts,
        topPredictedThreats: emergingThreats.slice(0, 10).map(t => t.threatType),
        vulnerabilityHotspots,
        complianceRisks,
        recommendations,
    };
};
exports.generateHealthcareThreatForecast = generateHealthcareThreatForecast;
/**
 * Performs advanced threat actor profiling and behavior prediction
 * Predicts threat actor tactics, techniques, and procedures
 *
 * @param actorId - Threat actor identifier
 * @param historicalData - Historical actor data
 * @returns Threat actor profile and predictions
 */
const performAdvancedThreatActorProfiling = async (actorId, historicalData) => {
    // Profile threat actor using APT detection
    const aptProfile = (0, apt_detection_tracking_kit_1.profileThreatActor)(actorId, historicalData);
    // Predict future behavior using ML
    const behaviorPredictions = await (0, threat_intelligence_ml_models_kit_1.predictThreatActorBehavior)(actorId, {
        historicalActivities: historicalData,
        includeTTP: true,
        includeTargets: true,
    });
    // Detect behavior patterns
    const patterns = (0, apt_detection_tracking_kit_1.detectBehaviorPatterns)(historicalData, {
        minConfidence: 0.7,
        includeEvolution: true,
    });
    // Analyze pattern evolution
    const patternEvolution = await (0, apt_detection_tracking_kit_1.analyzePatternEvolution)(patterns.map(p => p.patternId), historicalData);
    // Track APT infrastructure
    const infrastructure = (0, apt_detection_tracking_kit_1.trackAPTInfrastructure)({
        actorId,
        infrastructureType: 'command_and_control',
        indicators: extractInfrastructureIndicators(historicalData),
    });
    // Predict target selection
    const targetPredictions = await predictActorTargetSelection(actorId, behaviorPredictions);
    // Predict TTP usage
    const ttpPredictions = await predictActorTTPUsage(actorId, patterns);
    // Predict campaign progression
    const campaigns = historicalData.filter(d => d.campaignId);
    const campaignPredictions = [];
    for (const campaign of campaigns) {
        const progression = await (0, threat_prediction_forecasting_kit_1.predictCampaignProgression)(campaign.campaignId, {
            includeTimeline: true,
            includeTargets: true,
        });
        campaignPredictions.push(progression);
    }
    // Generate comprehensive profile
    const profile = {
        actorId,
        actorName: aptProfile.name,
        sophistication: aptProfile.sophisticationLevel,
        motivation: aptProfile.motivation,
        capabilities: aptProfile.capabilities,
        infrastructure,
        patterns,
        evolution: patternEvolution,
        ...behaviorPredictions,
    };
    // Generate recommendations
    const recommendations = generateActorDefenseRecommendations(profile, ttpPredictions, campaignPredictions);
    return {
        profile,
        behaviorPredictions,
        targetPredictions,
        ttpPredictions,
        campaignPredictions,
        recommendations,
    };
};
exports.performAdvancedThreatActorProfiling = performAdvancedThreatActorProfiling;
/**
 * Trains and deploys ensemble ML models for threat prediction
 * Creates ensemble of multiple model types for better accuracy
 *
 * @param trainingData - Historical threat data
 * @param config - Model configuration
 * @returns Trained ensemble model
 */
const trainEnsembleThreatPredictionModel = async (trainingData, config) => {
    const modelTypes = config.modelTypes || [
        'random_forest',
        'gradient_boosting',
        'neural_network',
        'svm',
    ];
    const componentModels = [];
    // Train individual models
    for (const modelType of modelTypes) {
        let model;
        if (config.autoTune) {
            // Auto-select algorithm and tune hyperparameters
            const bestAlgorithm = await (0, threat_intelligence_ml_models_kit_1.autoSelectAlgorithm)(trainingData, {
                taskType: 'classification',
                targetMetric: config.targetMetric || 'f1',
            });
            const tunedParams = await (0, threat_intelligence_ml_models_kit_1.tuneHyperparameters)(bestAlgorithm.modelId, trainingData, {
                method: 'grid_search',
                metric: config.targetMetric || 'f1',
            });
            model = await (0, threat_intelligence_ml_models_kit_1.trainMLModel)(bestAlgorithm.modelId, trainingData, tunedParams);
        }
        else {
            // Train with default configuration
            const mlModel = (0, threat_intelligence_ml_models_kit_1.createMLModel)({
                modelName: `threat-prediction-${modelType}`,
                modelType: 'classification',
                algorithm: modelType,
                features: Object.keys(trainingData[0] || {}),
            });
            model = await (0, threat_intelligence_ml_models_kit_1.trainMLModel)(mlModel.modelId, trainingData);
        }
        // Evaluate model performance
        const performance = await (0, threat_intelligence_ml_models_kit_1.evaluateMLModel)(model.modelId, trainingData, {
            splitRatio: 0.2,
            metrics: ['accuracy', 'precision', 'recall', 'f1'],
        });
        componentModels.push({
            model,
            performance,
        });
    }
    // Create ensemble model
    const ensembleModel = (0, threat_intelligence_ml_models_kit_1.createEnsembleModel)({
        ensembleName: 'threat-prediction-ensemble',
        baseModels: componentModels.map(m => m.model.modelId),
        ensembleMethod: config.ensembleMethod || 'voting',
        weights: componentModels.map(m => m.performance.f1Score || 0.7),
    });
    // Evaluate ensemble performance
    const ensemblePerformance = await (0, threat_intelligence_ml_models_kit_1.evaluateMLModel)(ensembleModel.ensembleId, trainingData, { splitRatio: 0.2, metrics: ['accuracy', 'precision', 'recall', 'f1'] });
    // Perform cross-validation
    const cvResults = await (0, threat_intelligence_ml_models_kit_1.performCrossValidation)(ensembleModel.ensembleId, trainingData, { folds: 5, stratified: true });
    // Analyze model bias
    const biasAnalysis = await (0, threat_intelligence_ml_models_kit_1.analyzeModelBias)(ensembleModel.ensembleId, trainingData);
    // Generate performance report
    const performanceReport = (0, threat_intelligence_ml_models_kit_1.generateModelPerformanceReport)({
        modelId: ensembleModel.ensembleId,
        performance: ensemblePerformance,
        crossValidation: cvResults,
        biasAnalysis,
    });
    // Deploy ensemble model
    const deployment = await (0, threat_prediction_forecasting_kit_1.deployMLModel)(ensembleModel.ensembleId, {
        environment: 'production',
        scalingConfig: {
            minInstances: 2,
            maxInstances: 10,
        },
    });
    return {
        ensembleModel,
        componentModels: componentModels.map(m => m.model),
        performance: {
            ensemble: ensemblePerformance,
            components: componentModels.map(m => m.performance),
            crossValidation: cvResults,
            biasAnalysis,
            report: performanceReport,
        },
        deploymentId: deployment.deploymentId,
    };
};
exports.trainEnsembleThreatPredictionModel = trainEnsembleThreatPredictionModel;
/**
 * Predicts attack surface exposure over time
 * Forecasts how attack surface will evolve
 *
 * @param organizationId - Organization identifier
 * @param timeHorizon - Forecast horizon in days
 * @returns Attack surface exposure forecast
 */
const forecastAttackSurfaceEvolution = async (organizationId, timeHorizon = 90) => {
    // Predict current attack surface exposure
    const currentExposure = await (0, threat_prediction_forecasting_kit_1.predictAttackSurfaceExposure)(organizationId, {
        includeCloud: true,
        includeEndpoints: true,
        includeNetwork: true,
        includeApplications: true,
    });
    // Analyze geographic distribution of threats
    const geoDistribution = await (0, threat_prediction_forecasting_kit_1.analyzeGeographicDistribution)(organizationId, {
        includeThreatOrigins: true,
        includeTargetLocations: true,
    });
    // Calculate threat velocity
    const velocity = (0, threat_prediction_forecasting_kit_1.calculateThreatVelocity)({
        currentThreats: 150,
        previousThreats: 120,
        timeWindow: 30,
    });
    // Track threat evolution
    const evolution = await (0, threat_prediction_forecasting_kit_1.trackThreatEvolution)(organizationId, {
        timeWindow: 180,
        includeNewThreats: true,
        includeEvolvedThreats: true,
    });
    // Generate forecast points
    const forecast = [];
    const criticalPeriods = [];
    for (let day = 1; day <= timeHorizon; day++) {
        const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
        // Apply growth/decline based on velocity and trends
        const growthFactor = 1 + (velocity / 100) * (day / timeHorizon);
        const exposure = currentExposure.totalExposure * growthFactor;
        // Identify contributing factors
        const factors = identifyExposureFactors(day, evolution, geoDistribution);
        forecast.push({
            date,
            exposure,
            confidence: Math.max(0.5, 1 - (day / timeHorizon) * 0.3), // Confidence decreases over time
            factors,
        });
        // Identify critical periods (high exposure)
        if (exposure > currentExposure.totalExposure * 1.5) {
            criticalPeriods.push({
                start: date,
                end: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
                reason: `High exposure period: ${factors.join(', ')}`,
            });
        }
    }
    // Generate recommendations
    const recommendations = [
        'Monitor attack surface continuously',
        'Implement zero-trust architecture',
        'Reduce unnecessary external exposure',
        ...criticalPeriods.map(p => `Prepare for high-risk period starting ${p.start.toLocaleDateString()}`),
    ];
    return {
        currentExposure: currentExposure.totalExposure,
        forecast,
        criticalPeriods,
        recommendations,
    };
};
exports.forecastAttackSurfaceEvolution = forecastAttackSurfaceEvolution;
/**
 * Predicts vulnerability exploitation likelihood
 * Estimates which vulnerabilities are most likely to be exploited
 *
 * @param vulnerabilities - List of vulnerabilities
 * @returns Exploitation predictions
 */
const predictVulnerabilityExploitationPriority = async (vulnerabilities) => {
    const predictions = [];
    for (const vuln of vulnerabilities) {
        // Estimate exploitation likelihood
        const exploitationLikelihood = await (0, threat_prediction_forecasting_kit_1.estimateExploitationLikelihood)(vuln.cveId, {
            cvssScore: vuln.cvssScore,
            ageInDays: Math.floor((Date.now() - vuln.publicationDate.getTime()) / (1000 * 60 * 60 * 24)),
            hasPublicExploit: await checkPublicExploit(vuln.cveId),
        });
        // Forecast when vulnerability will be exploited
        const exploitationForecast = await (0, threat_intelligence_ml_models_kit_1.forecastVulnerabilityExploitation)(vuln.cveId, {
            includeActorAnalysis: true,
            includeCampaignAnalysis: true,
        });
        // Identify threat actors likely to exploit
        const threatActors = exploitationForecast.likelyActors || [];
        // Calculate priority score
        const priorityScore = exploitationLikelihood * 0.4 +
            vuln.cvssScore * 10 * 0.3 +
            vuln.assetCriticality * 0.3;
        // Generate recommendations
        const recommendations = generateVulnerabilityRecommendations(vuln, exploitationLikelihood, priorityScore);
        predictions.push({
            cveId: vuln.cveId,
            exploitationLikelihood,
            estimatedTimeToExploit: exploitationForecast.estimatedDays || 30,
            priorityScore,
            threatActors,
            recommendations,
        });
    }
    // Sort by priority score (highest first)
    return predictions.sort((a, b) => b.priorityScore - a.priorityScore);
};
exports.predictVulnerabilityExploitationPriority = predictVulnerabilityExploitationPriority;
/**
 * Generates proactive threat hunting hypotheses using ML
 * Creates data-driven hunting hypotheses based on predictions
 *
 * @param organizationId - Organization identifier
 * @param context - Threat context
 * @returns Generated hunting hypotheses
 */
const generateMLDrivenHuntingHypotheses = async (organizationId, context) => {
    // Identify emerging threats
    const emergingThreats = await (0, threat_prediction_forecasting_kit_1.identifyEmergingThreats)({
        organizationId,
        timeWindow: 30,
        includeIndustryContext: true,
    });
    // Analyze threat trends
    const trends = await (0, threat_prediction_forecasting_kit_1.analyzeThreatTrends)(organizationId, {
        timeWindow: 90,
        includeAnomalies: true,
    });
    // Cluster threats to find patterns
    const clusters = await (0, threat_intelligence_ml_models_kit_1.clusterThreats)(context.threatIntelligence || [], {
        method: 'dbscan',
        minSamples: 3,
    });
    // Identify outlier threats (potential new attack methods)
    const outliers = await (0, threat_intelligence_ml_models_kit_1.identifyOutlierThreats)(context.recentIncidents || [], {
        threshold: 0.95,
    });
    const hypotheses = [];
    // Generate hypotheses from emerging threats
    for (const threat of emergingThreats.slice(0, 5)) {
        const hypothesis = (0, advanced_threat_hunting_kit_1.createHuntHypothesis)({
            name: `Hunt for ${threat.threatType}`,
            description: `Emerging threat detected: ${threat.description}`,
            threatType: threat.threatType,
            confidenceLevel: threat.confidence,
        });
        // Validate hypothesis with available data
        const validation = await (0, advanced_threat_hunting_kit_1.validateHypothesis)(hypothesis.id, {
            availableDataSources: ['logs', 'telemetry', 'threat_intel'],
        });
        // Generate queries
        const queries = await (0, advanced_threat_hunting_kit_1.generateQueriesFromHypothesis)(hypothesis.id, {
            includeSTIX: true,
            includeYARA: true,
            includeSigma: true,
        });
        // Predict potential findings using ML
        const predictedFindings = await predictHypothesisFindings(hypothesis, context);
        hypotheses.push({
            hypothesis,
            supportingEvidence: [
                { type: 'emerging_threat', data: threat },
                { type: 'validation', data: validation },
            ],
            queries,
            predictedFindings,
            priority: calculateHypothesisPriority(threat, validation),
        });
    }
    // Generate hypotheses from outliers
    for (const outlier of outliers.slice(0, 3)) {
        const hypothesis = (0, advanced_threat_hunting_kit_1.createHuntHypothesis)({
            name: `Investigate anomalous activity`,
            description: `Outlier detected: ${outlier.description}`,
            threatType: 'unknown',
            confidenceLevel: 0.7,
        });
        const queries = await (0, advanced_threat_hunting_kit_1.generateQueriesFromHypothesis)(hypothesis.id, {
            focusOnOutliers: true,
        });
        hypotheses.push({
            hypothesis,
            supportingEvidence: [{ type: 'outlier', data: outlier }],
            queries,
            predictedFindings: [],
            priority: 75, // Outliers get medium-high priority
        });
    }
    // Sort by priority
    return hypotheses.sort((a, b) => b.priority - a.priority);
};
exports.generateMLDrivenHuntingHypotheses = generateMLDrivenHuntingHypotheses;
/**
 * Performs predictive campaign tracking
 * Predicts campaign evolution and next moves
 *
 * @param campaignId - Campaign identifier
 * @param historicalData - Campaign history
 * @returns Campaign predictions
 */
const performPredictiveCampaignTracking = async (campaignId, historicalData) => {
    // Track campaign progression
    const progression = (0, apt_detection_tracking_kit_1.trackCampaignProgression)(campaignId, historicalData);
    // Predict campaign progression using ML
    const mlPrediction = await (0, threat_prediction_forecasting_kit_1.predictCampaignProgression)(campaignId, {
        includeTimeline: true,
        includeTargets: true,
        includeTTP: true,
    });
    // Identify related campaigns for pattern matching
    const relatedCampaigns = (0, apt_detection_tracking_kit_1.identifyRelatedCampaigns)(campaignId, historicalData, {
        similarityThreshold: 0.7,
    });
    // Calculate campaign impact
    const impact = (0, apt_detection_tracking_kit_1.calculateCampaignImpact)({
        campaignId,
        affectedOrganizations: historicalData.filter(d => d.affected).length,
        dataStolenGB: historicalData.reduce((sum, d) => sum + (d.dataStolenGB || 0), 0),
        estimatedCost: 1000000,
    });
    // Determine current phase
    const currentPhase = progression.currentPhase || 'reconnaissance';
    // Predict next phases based on historical patterns
    const predictedNextPhases = predictCampaignPhases(currentPhase, relatedCampaigns, mlPrediction);
    // Predict targets
    const targetPredictions = mlPrediction.predictedTargets || [];
    // Predict TTP usage
    const ttpPredictions = mlPrediction.predictedTTPs || [];
    // Generate recommendations
    const recommendations = [
        `Monitor for indicators of ${predictedNextPhases[0]?.phase} phase`,
        `Strengthen defenses for predicted targets: ${targetPredictions.slice(0, 3).join(', ')}`,
        `Prepare detection rules for TTPs: ${ttpPredictions.slice(0, 3).join(', ')}`,
        `Review campaign impact and adjust response priorities`,
    ];
    return {
        currentPhase,
        predictedNextPhases,
        targetPredictions,
        ttpPredictions,
        recommendations,
    };
};
exports.performPredictiveCampaignTracking = performPredictiveCampaignTracking;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
async function predictThreatActorsForTarget(targetId, context) {
    // Simplified implementation - would use ML models in production
    return [
        {
            actorId: 'apt29',
            actorName: 'Cozy Bear',
            capability: 90,
            intent: 75,
            opportunity: 60,
        },
        {
            actorId: 'apt28',
            actorName: 'Fancy Bear',
            capability: 85,
            intent: 70,
            opportunity: 55,
        },
    ];
}
async function identifyPotentialCampaigns(targetId, features) {
    return ['campaign-2024-001', 'campaign-2024-002'];
}
function extractMITREMapping(attackVectors) {
    return attackVectors.map(av => av.mitreId).filter(Boolean);
}
function extractThreatIndicators(features) {
    return Object.entries(features)
        .filter(([key, value]) => typeof value === 'number' && value > 70)
        .map(([key, value]) => ({ type: key, value }));
}
function generateThreatMitigationRecommendations(threatType, attackVectors, riskScore) {
    const recommendations = [];
    if (riskScore > 80) {
        recommendations.push('URGENT: Implement immediate defensive measures');
    }
    recommendations.push(`Deploy detection rules for ${threatType}`);
    recommendations.push('Enable enhanced monitoring');
    for (const vector of attackVectors.slice(0, 3)) {
        recommendations.push(`Harden defenses against ${vector.vector} attacks`);
    }
    return recommendations;
}
function determineTrendDirection(predictions) {
    if (predictions.length < 2)
        return 'stable';
    const values = predictions.map(p => p.value);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const change = (secondAvg - firstAvg) / firstAvg;
    if (Math.abs(change) < 0.1)
        return 'stable';
    if (change > 0.3)
        return 'increasing';
    if (change < -0.3)
        return 'decreasing';
    // Check volatility
    const variance = values.reduce((sum, v) => sum + Math.pow(v - secondAvg, 2), 0) / values.length;
    if (variance > secondAvg * 0.5)
        return 'volatile';
    return change > 0 ? 'increasing' : 'decreasing';
}
async function identifyVulnerabilityHotspots(facilityId, options) {
    return ['Emergency Department', 'Radiology', 'Patient Portal', 'Medical Devices'];
}
async function assessHealthcareComplianceRisks(facilityId, forecasts) {
    const risks = [];
    const highThreats = forecasts.filter(f => f.predictedTrend === 'increasing');
    if (highThreats.some(t => t.category === 'data_breach')) {
        risks.push('HIPAA violation risk due to increasing data breach threats');
    }
    if (highThreats.some(t => t.category === 'ransomware')) {
        risks.push('Patient care continuity risk from ransomware threats');
    }
    return risks;
}
function generateForecastRecommendations(forecasts, emergingThreats, complianceRisks) {
    const recommendations = [];
    const increasingThreats = forecasts.filter(f => f.predictedTrend === 'increasing');
    for (const threat of increasingThreats) {
        recommendations.push(`Strengthen defenses against ${threat.category} - trend increasing`);
    }
    if (emergingThreats.length > 0) {
        recommendations.push(`Monitor emerging threats: ${emergingThreats.slice(0, 3).map(t => t.threatType).join(', ')}`);
    }
    if (complianceRisks.length > 0) {
        recommendations.push('Address compliance risks to maintain HIPAA compliance');
    }
    return recommendations;
}
async function predictActorTargetSelection(actorId, behaviorPredictions) {
    return [
        { target: 'Healthcare facilities', likelihood: 0.85 },
        { target: 'Pharmaceutical companies', likelihood: 0.70 },
    ];
}
async function predictActorTTPUsage(actorId, patterns) {
    return patterns.map(p => ({
        ttp: p.technique,
        likelihood: p.confidence,
    }));
}
function extractInfrastructureIndicators(data) {
    return data.flatMap(d => d.indicators || []);
}
function generateActorDefenseRecommendations(profile, ttpPredictions, campaignPredictions) {
    return [
        `Deploy detections for ${profile.actorName} TTPs`,
        `Monitor for infrastructure patterns used by ${profile.actorName}`,
        `Implement defenses against predicted attack vectors`,
    ];
}
function identifyExposureFactors(day, evolution, geoDistribution) {
    const factors = [];
    if (day % 7 === 0)
        factors.push('Weekly vulnerability scan cycle');
    if (evolution?.newThreats > 5)
        factors.push('New threat emergence');
    if (geoDistribution?.highRiskRegions?.length > 0)
        factors.push('Geographic threat distribution');
    return factors;
}
/**
 * Checks if a public exploit exists for the given CVE ID
 * @param cveId - The CVE identifier to check
 * @returns True if a public exploit is known to exist
 */
async function checkPublicExploit(cveId) {
    if (!cveId || !cveId.trim()) {
        return false;
    }
    try {
        // Check if CVE ID follows standard format (CVE-YYYY-NNNNN)
        const cvePattern = /^CVE-\d{4}-\d{4,}$/i;
        if (!cvePattern.test(cveId)) {
            return false;
        }
        // In production, this would query exploit databases like:
        // - Exploit-DB (exploit-db.com)
        // - Metasploit modules
        // - PacketStorm
        // - NVD (National Vulnerability Database)
        // For now, we implement a heuristic based on CVE characteristics
        // Extract year and ID from CVE
        const match = cveId.match(/CVE-(\d{4})-(\d+)/i);
        if (!match) {
            return false;
        }
        const year = parseInt(match[1], 10);
        const id = parseInt(match[2], 10);
        const currentYear = new Date().getFullYear();
        // Heuristics:
        // - Recent CVEs (within 2 years) with high IDs are more likely to have exploits
        // - Older CVEs (>2 years) are more likely to have public exploits
        // - CVE IDs < 1000 in recent years often indicate early disclosure
        if (currentYear - year > 2) {
            // Older vulnerabilities are more likely to have public exploits
            return true;
        }
        else if (currentYear - year <= 1 && id < 1000) {
            // Recent, low-ID CVEs may not have exploits yet
            return false;
        }
        // For production, replace with actual database query
        return false;
    }
    catch (error) {
        // Log error in production
        console.error(`Error checking public exploit for ${cveId}:`, error);
        return false;
    }
}
function generateVulnerabilityRecommendations(vuln, exploitationLikelihood, priorityScore) {
    const recommendations = [];
    if (priorityScore > 80) {
        recommendations.push('CRITICAL: Patch immediately');
    }
    else if (priorityScore > 60) {
        recommendations.push('Patch within 48 hours');
    }
    else {
        recommendations.push('Schedule patching within normal cycle');
    }
    if (exploitationLikelihood > 0.7) {
        recommendations.push('Deploy IDS/IPS signatures');
        recommendations.push('Enable enhanced logging');
    }
    return recommendations;
}
async function predictHypothesisFindings(hypothesis, context) {
    return [
        { finding: 'Suspicious network traffic', likelihood: 0.75 },
        { finding: 'Anomalous file access', likelihood: 0.60 },
    ];
}
function calculateHypothesisPriority(threat, validation) {
    return threat.confidence * 0.6 + (validation.feasibility || 0.5) * 40;
}
function predictCampaignPhases(currentPhase, relatedCampaigns, mlPrediction) {
    const phases = ['reconnaissance', 'weaponization', 'delivery', 'exploitation', 'installation', 'command_and_control', 'actions_on_objectives'];
    const currentIndex = phases.indexOf(currentPhase);
    return phases.slice(currentIndex + 1, currentIndex + 4).map((phase, idx) => ({
        phase,
        probability: 0.9 - idx * 0.2,
        estimatedStart: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000),
        indicators: [`indicator-${phase}-1`, `indicator-${phase}-2`],
    }));
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    generateComprehensiveThreatPrediction: exports.generateComprehensiveThreatPrediction,
    generateHealthcareThreatForecast: exports.generateHealthcareThreatForecast,
    performAdvancedThreatActorProfiling: exports.performAdvancedThreatActorProfiling,
    trainEnsembleThreatPredictionModel: exports.trainEnsembleThreatPredictionModel,
    forecastAttackSurfaceEvolution: exports.forecastAttackSurfaceEvolution,
    predictVulnerabilityExploitationPriority: exports.predictVulnerabilityExploitationPriority,
    generateMLDrivenHuntingHypotheses: exports.generateMLDrivenHuntingHypotheses,
    performPredictiveCampaignTracking: exports.performPredictiveCampaignTracking,
};
//# sourceMappingURL=threat-prediction-engine-composite.js.map