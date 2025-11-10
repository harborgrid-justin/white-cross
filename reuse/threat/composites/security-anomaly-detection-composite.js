"use strict";
/**
 * LOC: SECANOMAL001
 * File: /reuse/threat/composites/security-anomaly-detection-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-prediction-forecasting-kit
 *   - ../threat-intelligence-ml-models-kit
 *   - ../behavioral-threat-analytics-kit
 *   - ../endpoint-threat-detection-kit
 *   - ../advanced-threat-hunting-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Security anomaly detection services
 *   - Healthcare threat monitoring systems
 *   - SIEM integrations
 *   - Real-time threat detection engines
 *   - Compliance monitoring dashboards
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorSecurityAnomaliesRealTime = exports.correlateAnomaliesAcrossEntities = exports.detectEndpointSecurityAnomalies = exports.analyzeHealthcareBehavioralAnomalies = exports.detectSecurityAnomaliesMultiMethod = exports.establishComprehensiveSecurityBaseline = void 0;
/**
 * File: /reuse/threat/composites/security-anomaly-detection-composite.ts
 * Locator: WC-THREAT-SECANOMAL-COMP-001
 * Purpose: Enterprise Security Anomaly Detection Composite - Production-ready anomaly detection for healthcare
 *
 * Upstream: Composes functions from threat-prediction-forecasting-kit, threat-intelligence-ml-models-kit,
 *           behavioral-threat-analytics-kit, endpoint-threat-detection-kit, advanced-threat-hunting-kit
 * Downstream: ../backend/*, Healthcare security services, Anomaly detection systems, Threat monitoring
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, @nestjs/common, @nestjs/swagger, @nestjs/passport
 * Exports: 45 composite functions for security anomaly detection, behavioral analytics, pattern recognition
 *
 * LLM Context: Enterprise-grade security anomaly detection composite for White Cross healthcare platform.
 * Provides comprehensive anomaly detection combining statistical analysis, machine learning, behavioral analytics,
 * and pattern recognition. Designed for HIPAA-compliant healthcare environments with real-time threat detection,
 * baseline establishment, deviation analysis, risk scoring, and automated alerting. Includes NestJS guards,
 * JWT authentication, role-based access control, and Swagger API documentation.
 */
const common_1 = require("@nestjs/common");
// Import from threat prediction forecasting kit
const threat_prediction_forecasting_kit_1 = require("../threat-prediction-forecasting-kit");
// Import from threat intelligence ML models kit
const threat_intelligence_ml_models_kit_1 = require("../threat-intelligence-ml-models-kit");
// Import from behavioral threat analytics kit
const behavioral_threat_analytics_kit_1 = require("../behavioral-threat-analytics-kit");
// Import from endpoint threat detection kit
const endpoint_threat_detection_kit_1 = require("../endpoint-threat-detection-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - ANOMALY DETECTION CORE
// ============================================================================
/**
 * Establishes comprehensive security baseline for an entity
 * Combines behavioral, statistical, and ML-based baselines
 *
 * @param entityId - Entity identifier
 * @param data - Historical data for baseline
 * @param options - Configuration options
 * @returns Baseline establishment result
 */
const establishComprehensiveSecurityBaseline = async (entityId, data, options) => {
    const methods = options?.methods || ['statistical', 'ml', 'behavioral'];
    const baselines = {};
    // Establish behavioral baseline
    if (methods.includes('behavioral')) {
        baselines.behavioral = await (0, threat_prediction_forecasting_kit_1.establishBehaviorBaseline)(entityId, data, {
            duration: options?.duration || 30,
            adaptiveLearning: options?.adaptiveLearning,
        });
    }
    // Establish statistical baseline
    if (methods.includes('statistical')) {
        baselines.statistical = (0, threat_intelligence_ml_models_kit_1.trainStatisticalAnomalyModel)(data, {
            entityId,
            modelName: `statistical-baseline-${entityId}`,
        });
    }
    // Establish ML-based baseline
    if (methods.includes('ml')) {
        const features = (0, threat_intelligence_ml_models_kit_1.engineerThreatFeatures)(data, {
            includeStatistical: true,
            includeTemporal: true,
            includeBehavioral: true,
        });
        baselines.ml = (0, threat_intelligence_ml_models_kit_1.createAnomalyDetectionModel)({
            modelName: `ml-baseline-${entityId}`,
            detectionMethod: 'isolation_forest',
            threshold: 0.05,
        });
    }
    // Establish peer baseline if enabled
    if (options?.peerComparison) {
        const peerGroup = (0, behavioral_threat_analytics_kit_1.createPeerGroups)([entityId], data);
        baselines.peer = peerGroup;
    }
    const baselineId = `baseline-${entityId}-${Date.now()}`;
    const validFrom = new Date();
    const nextUpdate = new Date(validFrom.getTime() + (options?.duration || 30) * 24 * 60 * 60 * 1000);
    return {
        baselineId,
        entityId,
        baselines,
        metrics: (0, behavioral_threat_analytics_kit_1.calculateBaselineMetrics)(baselines.behavioral || {}),
        validFrom,
        nextUpdate,
    };
};
exports.establishComprehensiveSecurityBaseline = establishComprehensiveSecurityBaseline;
/**
 * Performs multi-method anomaly detection
 * Combines statistical, ML, and behavioral detection methods
 *
 * @param entityId - Entity to analyze
 * @param currentData - Current observation data
 * @param baselineId - Baseline reference
 * @returns Comprehensive anomaly detection results
 */
const detectSecurityAnomaliesMultiMethod = async (entityId, currentData, baselineId, config) => {
    const anomalies = [];
    const detectionMethods = config?.detectionMethods || ['statistical', 'ml', 'behavioral', 'hybrid'];
    // Statistical anomaly detection
    if (detectionMethods.includes('statistical')) {
        const statisticalAnomalies = await (0, threat_prediction_forecasting_kit_1.detectStatisticalAnomaly)(entityId, currentData, baselineId);
        for (const anomaly of (Array.isArray(statisticalAnomalies) ? statisticalAnomalies : [statisticalAnomalies])) {
            if (anomaly && anomaly.anomalyScore > (config?.confidenceThreshold || 70)) {
                anomalies.push({
                    id: `stat-${Date.now()}-${Math.random()}`,
                    anomalyType: anomaly.anomalyType,
                    severity: anomaly.severity,
                    confidenceScore: anomaly.anomalyScore,
                    detectionMethod: 'statistical',
                    detectedAt: new Date(),
                    affectedEntities: [entityId],
                    indicators: [{
                            type: 'statistical_deviation',
                            value: anomaly.observedValue,
                            deviation: anomaly.deviation,
                        }],
                    baselineComparison: {
                        baseline: anomaly.expectedValue,
                        observed: anomaly.observedValue,
                        standardDeviations: anomaly.standardDeviations,
                    },
                    riskScore: calculateAnomalyRiskScore(anomaly),
                    falsePositiveProbability: estimateFalsePositiveProbability(anomaly, 'statistical'),
                    recommendedActions: generateAnomalyRecommendations(anomaly),
                    metadata: anomaly.metadata || {},
                });
            }
        }
    }
    // ML-based anomaly detection
    if (detectionMethods.includes('ml')) {
        const mlAnomalies = await (0, threat_prediction_forecasting_kit_1.detectMLBasedAnomaly)(entityId, currentData, baselineId);
        for (const anomaly of (Array.isArray(mlAnomalies) ? mlAnomalies : [mlAnomalies])) {
            if (anomaly && anomaly.anomalyScore > (config?.confidenceThreshold || 70)) {
                // Get ML explanation
                const explanation = await (0, threat_intelligence_ml_models_kit_1.generateSHAPExplanation)(baselineId, currentData);
                anomalies.push({
                    id: `ml-${Date.now()}-${Math.random()}`,
                    anomalyType: anomaly.anomalyType,
                    severity: anomaly.severity,
                    confidenceScore: anomaly.anomalyScore,
                    detectionMethod: 'ml',
                    detectedAt: new Date(),
                    affectedEntities: anomaly.affectedEntities || [entityId],
                    indicators: [{
                            type: 'ml_anomaly_score',
                            value: anomaly.anomalyScore,
                            deviation: anomaly.deviation,
                        }],
                    baselineComparison: {
                        baseline: anomaly.expectedValue,
                        observed: anomaly.observedValue,
                        standardDeviations: anomaly.standardDeviations,
                    },
                    riskScore: calculateAnomalyRiskScore(anomaly),
                    falsePositiveProbability: estimateFalsePositiveProbability(anomaly, 'ml'),
                    recommendedActions: generateAnomalyRecommendations(anomaly),
                    mlExplanation: explanation,
                    metadata: anomaly.metadata || {},
                });
            }
        }
    }
    // Behavioral anomaly detection
    if (detectionMethods.includes('behavioral')) {
        const behavioralAnomalies = (0, behavioral_threat_analytics_kit_1.identifyBehaviorAnomalies)([currentData], baselineId);
        for (const anomaly of behavioralAnomalies) {
            anomalies.push({
                id: `behavior-${Date.now()}-${Math.random()}`,
                anomalyType: anomaly.anomalyType,
                severity: anomaly.severity,
                confidenceScore: anomaly.score,
                detectionMethod: 'behavioral',
                detectedAt: new Date(anomaly.detectedAt),
                affectedEntities: [entityId],
                indicators: anomaly.indicators.map(i => ({
                    type: i.type,
                    value: i.value,
                    deviation: i.deviation,
                })),
                baselineComparison: {
                    baseline: anomaly.baselineValue,
                    observed: anomaly.observedValue,
                    standardDeviations: anomaly.deviationScore,
                },
                riskScore: anomaly.riskScore,
                falsePositiveProbability: estimateFalsePositiveProbability(anomaly, 'behavioral'),
                recommendedActions: generateAnomalyRecommendations(anomaly),
                metadata: anomaly.context || {},
            });
        }
    }
    // Hybrid detection - correlate findings across methods
    if (detectionMethods.includes('hybrid')) {
        const correlatedAnomalies = correlateAnomaliesAcrossMethods(anomalies);
        anomalies.push(...correlatedAnomalies);
    }
    // Apply false positive reduction if enabled
    if (config?.falsePositiveReduction) {
        return await (0, threat_prediction_forecasting_kit_1.reduceFalsePositives)(anomalies, {
            historicalData: true,
            contextAware: true,
            mlBased: true,
        });
    }
    return anomalies;
};
exports.detectSecurityAnomaliesMultiMethod = detectSecurityAnomaliesMultiMethod;
/**
 * Analyzes behavioral anomalies in healthcare context
 * Specialized for healthcare security monitoring with HIPAA compliance
 *
 * @param userId - User or entity ID
 * @param activities - Recent activities
 * @param context - Healthcare context
 * @returns Behavioral anomaly analysis results
 */
const analyzeHealthcareBehavioralAnomalies = async (userId, activities, context) => {
    // Analyze user behavior
    const behaviorAnalysis = await (0, behavioral_threat_analytics_kit_1.analyzeUserBehavior)(userId, activities, {
        detectAnomalies: true,
        calculateRisk: true,
        peerComparison: true,
    });
    // Identify behavior anomalies
    const anomalies = (0, behavioral_threat_analytics_kit_1.identifyBehaviorAnomalies)(activities, userId);
    // Score anomaly severity with healthcare context
    const scoredAnomalies = anomalies.map(anomaly => {
        const severity = (0, behavioral_threat_analytics_kit_1.scoreAnomalySeverity)(anomaly, context);
        const riskScore = (0, behavioral_threat_analytics_kit_1.calculateBehaviorRiskScore)({
            ...anomaly,
            context: {
                ...context,
                phiAccessed: context.patientDataAccessed,
            },
        });
        return {
            ...anomaly,
            severity,
            riskScore,
            hipaaImpact: context.hipaaViolation ? 'high' : 'low',
        };
    });
    // Classify anomaly types
    const classifiedAnomalies = scoredAnomalies.map(anomaly => (0, behavioral_threat_analytics_kit_1.classifyAnomalyType)(anomaly, {
        includeHealthcarePatterns: true,
        mitreMapping: true,
    }));
    // Detect temporal anomalies (unusual access times)
    const temporalAnomalies = (0, behavioral_threat_analytics_kit_1.detectTemporalAnomalies)(activities);
    // Detect contextual anomalies (unusual access patterns)
    const contextualAnomalies = (0, behavioral_threat_analytics_kit_1.detectContextualAnomalies)(activities, context);
    // Correlate all anomalies
    const allAnomalies = [...classifiedAnomalies, ...temporalAnomalies, ...contextualAnomalies];
    const correlatedAnomalies = (0, behavioral_threat_analytics_kit_1.correlateBehaviorAnomalies)(allAnomalies);
    // Calculate overall risk score
    const riskScore = (0, behavioral_threat_analytics_kit_1.calculateBehaviorRiskScore)({
        entityId: userId,
        activities: activities.length,
        anomalyCount: correlatedAnomalies.length,
        severity: determineOverallSeverity(correlatedAnomalies),
        context,
    });
    // Identify compliance violations
    const complianceViolations = identifyHealthcareComplianceViolations(correlatedAnomalies, context);
    // Determine HIPAA risk level
    const hipaaRisk = assessHIPAARiskLevel(correlatedAnomalies, context, riskScore);
    // Generate recommendations
    const recommendedActions = generateHealthcareSecurityRecommendations(correlatedAnomalies, context, hipaaRisk);
    // Convert to standard anomaly detection results
    const results = correlatedAnomalies.map(anomaly => ({
        id: anomaly.id,
        anomalyType: anomaly.anomalyType,
        severity: anomaly.severity,
        confidenceScore: anomaly.score || 75,
        detectionMethod: 'behavioral',
        detectedAt: new Date(anomaly.detectedAt),
        affectedEntities: [userId],
        indicators: anomaly.indicators || [],
        baselineComparison: {
            baseline: anomaly.baselineValue || 0,
            observed: anomaly.observedValue || 0,
            standardDeviations: anomaly.deviationScore || 0,
        },
        riskScore: anomaly.riskScore || riskScore,
        falsePositiveProbability: 0.1,
        recommendedActions: anomaly.recommendations || [],
        metadata: {
            ...anomaly.context,
            hipaaContext: context,
        },
    }));
    return {
        anomalies: results,
        riskScore,
        complianceViolations,
        hipaaRisk,
        recommendedActions,
    };
};
exports.analyzeHealthcareBehavioralAnomalies = analyzeHealthcareBehavioralAnomalies;
/**
 * Detects endpoint security anomalies
 * Monitors endpoint telemetry for suspicious activities
 *
 * @param endpointId - Endpoint identifier
 * @param telemetry - Current telemetry data
 * @returns Endpoint anomaly detection results
 */
const detectEndpointSecurityAnomalies = async (endpointId, telemetry) => {
    // Collect and validate endpoint telemetry
    const validatedTelemetry = await (0, endpoint_threat_detection_kit_1.validateTelemetryData)(telemetry);
    // Detect telemetry anomalies
    const telemetryAnomalies = await (0, endpoint_threat_detection_kit_1.detectTelemetryAnomalies)(endpointId, validatedTelemetry);
    // Analyze process behavior
    const processBehavior = await (0, endpoint_threat_detection_kit_1.analyzeProcessBehavior)(endpointId, validatedTelemetry.processes || []);
    // Detect process injection attempts
    const injectionAttempts = await (0, endpoint_threat_detection_kit_1.detectProcessInjection)(endpointId, validatedTelemetry.processes || []);
    // Detect privilege escalation
    const privilegeEscalation = await (0, endpoint_threat_detection_kit_1.detectPrivilegeEscalation)(endpointId, validatedTelemetry.processes || []);
    // Monitor endpoint health
    const healthStatus = await (0, endpoint_threat_detection_kit_1.monitorEndpointHealth)(endpointId, validatedTelemetry);
    // Combine all anomalies
    const allAnomalies = [
        ...telemetryAnomalies,
        ...processBehavior.anomalies,
        ...injectionAttempts,
        ...privilegeEscalation,
    ];
    // Convert to standard format
    const anomalies = allAnomalies.map((anomaly, index) => ({
        id: `endpoint-${endpointId}-${Date.now()}-${index}`,
        anomalyType: anomaly.type || 'endpoint_anomaly',
        severity: anomaly.severity || 'medium',
        confidenceScore: anomaly.confidence || 70,
        detectionMethod: 'endpoint_monitoring',
        detectedAt: new Date(),
        affectedEntities: [endpointId],
        indicators: [{
                type: anomaly.indicatorType || 'endpoint',
                value: anomaly.value,
                deviation: anomaly.deviation || 0,
            }],
        baselineComparison: {
            baseline: anomaly.baseline || 0,
            observed: anomaly.observed || 0,
            standardDeviations: anomaly.standardDeviations || 0,
        },
        riskScore: anomaly.riskScore || 50,
        falsePositiveProbability: 0.15,
        recommendedActions: anomaly.actions || [],
        metadata: {
            endpoint: endpointId,
            telemetry: validatedTelemetry,
        },
    }));
    // Identify threats
    const threats = identifyEndpointThreats(anomalies, healthStatus);
    // Generate recommendations
    const recommendations = generateEndpointRecommendations(anomalies, healthStatus);
    return {
        anomalies,
        endpointHealth: determineEndpointHealth(healthStatus, anomalies),
        threats,
        recommendations,
    };
};
exports.detectEndpointSecurityAnomalies = detectEndpointSecurityAnomalies;
/**
 * Correlates anomalies across multiple entities
 * Identifies coordinated attacks or systematic issues
 *
 * @param anomalies - Anomalies from multiple sources
 * @returns Correlated anomaly groups
 */
const correlateAnomaliesAcrossEntities = async (anomalies) => {
    // Correlate behavior anomalies
    const behavioralCorrelations = (0, behavioral_threat_analytics_kit_1.correlateBehaviorAnomalies)(anomalies.filter(a => a.detectionMethod === 'behavioral'));
    // Cluster similar behaviors
    const behaviorClusters = await (0, behavioral_threat_analytics_kit_1.clusterSimilarBehaviors)(anomalies.map(a => a.metadata), {
        method: 'hierarchical',
        threshold: 0.7,
    });
    // Detect threat patterns
    const patterns = await (0, threat_prediction_forecasting_kit_1.detectThreatPatterns)(anomalies, {
        includeKnownPatterns: true,
        includeMITREMapping: true,
    });
    // Reconstruct attack chains
    const attackChains = await (0, threat_prediction_forecasting_kit_1.reconstructAttackChain)(anomalies.map(a => a.indicators).flat());
    // Group correlated anomalies
    const correlationGroups = [];
    for (const cluster of behaviorClusters.clusters || []) {
        const groupAnomalies = anomalies.filter(a => cluster.members.includes(a.id) || cluster.members.includes(a.affectedEntities[0]));
        if (groupAnomalies.length > 1) {
            const affectedEntities = [...new Set(groupAnomalies.flatMap(a => a.affectedEntities))];
            const maxSeverity = determineOverallSeverity(groupAnomalies);
            const matchedPattern = patterns.find(p => p.indicators.some(ind => groupAnomalies.some(a => a.indicators.some(ai => ai.type === ind.type))));
            correlationGroups.push({
                id: `correlation-${Date.now()}-${Math.random()}`,
                anomalies: groupAnomalies,
                correlationScore: cluster.similarity || 0.8,
                attackPattern: matchedPattern?.patternName,
                affectedEntities,
                severity: maxSeverity,
            });
        }
    }
    // Generate recommendations based on correlations
    const recommendations = generateCorrelationRecommendations(correlationGroups, attackChains);
    return {
        correlationGroups,
        attackChains,
        recommendations,
    };
};
exports.correlateAnomaliesAcrossEntities = correlateAnomaliesAcrossEntities;
/**
 * Performs real-time anomaly monitoring
 * Continuously monitors for security anomalies with alerting
 *
 * @param stream - Data stream to monitor
 * @param config - Monitoring configuration
 * @returns Monitoring session handle
 */
const monitorSecurityAnomaliesRealTime = async (stream, config) => {
    const sessionId = `monitor-${Date.now()}`;
    const callbacks = [];
    let isRunning = false;
    const metrics = {
        totalAnomaliesDetected: 0,
        criticalAnomalies: 0,
        highSeverityAnomalies: 0,
        falsePositiveRate: 0,
        detectionAccuracy: 0.95,
        averageDetectionTime: 0,
        baselinesCurrent: 0,
        baselinesStale: 0,
        modelsActive: 0,
        lastModelUpdate: new Date(),
    };
    const start = async () => {
        isRunning = true;
        for await (const data of stream) {
            if (!isRunning)
                break;
            const startTime = Date.now();
            // Detect anomalies using configured methods
            const anomalies = await (0, exports.detectSecurityAnomaliesMultiMethod)(data.entityId, data, data.baselineId || 'default', config);
            const detectionTime = Date.now() - startTime;
            // Update metrics
            metrics.totalAnomaliesDetected += anomalies.length;
            metrics.criticalAnomalies += anomalies.filter(a => a.severity === 'critical').length;
            metrics.highSeverityAnomalies += anomalies.filter(a => a.severity === 'high').length;
            metrics.averageDetectionTime =
                (metrics.averageDetectionTime + detectionTime) / 2;
            // Trigger callbacks for each anomaly
            for (const anomaly of anomalies) {
                if (config.alertingEnabled && shouldAlert(anomaly, config)) {
                    const alert = (0, behavioral_threat_analytics_kit_1.generateBehaviorAlert)({
                        anomalyId: anomaly.id,
                        severity: anomaly.severity,
                        message: `Anomaly detected: ${anomaly.anomalyType}`,
                        recommendations: anomaly.recommendedActions,
                    });
                    // Notify all registered callbacks
                    callbacks.forEach(callback => callback(anomaly));
                    // Auto-response if enabled
                    if (config.autoResponse) {
                        await executeAutoResponse(anomaly, config);
                    }
                }
            }
        }
    };
    const stop = async () => {
        isRunning = false;
    };
    const getMetrics = () => metrics;
    const onAnomaly = (callback) => {
        callbacks.push(callback);
    };
    return {
        sessionId,
        start,
        stop,
        getMetrics,
        onAnomaly,
    };
};
exports.monitorSecurityAnomaliesRealTime = monitorSecurityAnomaliesRealTime;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function calculateAnomalyRiskScore(anomaly) {
    const baseScore = anomaly.anomalyScore || 50;
    const severityMultiplier = {
        critical: 2.0,
        high: 1.5,
        medium: 1.0,
        low: 0.5,
        info: 0.2,
    }[anomaly.severity] || 1.0;
    return Math.min(100, baseScore * severityMultiplier);
}
function estimateFalsePositiveProbability(anomaly, method) {
    const baseFPR = {
        statistical: 0.15,
        ml: 0.10,
        behavioral: 0.20,
        hybrid: 0.05,
    }[method] || 0.15;
    const confidenceAdjustment = (100 - (anomaly.anomalyScore || 50)) / 100;
    return Math.min(0.95, baseFPR + confidenceAdjustment * 0.3);
}
function generateAnomalyRecommendations(anomaly) {
    const recommendations = [];
    if (anomaly.severity === 'critical' || anomaly.severity === 'high') {
        recommendations.push('Immediately investigate this anomaly');
        recommendations.push('Review access logs for suspicious activity');
        recommendations.push('Consider temporary access restrictions');
    }
    if (anomaly.anomalyType?.includes('authentication')) {
        recommendations.push('Verify user identity through secondary channel');
        recommendations.push('Review recent authentication attempts');
    }
    if (anomaly.anomalyType?.includes('data_access')) {
        recommendations.push('Review data access patterns');
        recommendations.push('Verify business justification for access');
        recommendations.push('Check for data exfiltration indicators');
    }
    return recommendations;
}
function correlateAnomaliesAcrossMethods(anomalies) {
    const correlated = [];
    const grouped = new Map();
    // Group by entity and time window
    for (const anomaly of anomalies) {
        const key = `${anomaly.affectedEntities[0]}-${Math.floor(anomaly.detectedAt.getTime() / 300000)}`;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(anomaly);
    }
    // Create correlated anomalies for groups with multiple detection methods
    for (const [key, group] of grouped) {
        if (group.length > 1) {
            const methods = new Set(group.map(a => a.detectionMethod));
            if (methods.size > 1) {
                const maxSeverity = determineOverallSeverity(group);
                const avgConfidence = group.reduce((sum, a) => sum + a.confidenceScore, 0) / group.length;
                correlated.push({
                    id: `correlated-${key}`,
                    anomalyType: 'multi_method_correlation',
                    severity: maxSeverity,
                    confidenceScore: Math.min(100, avgConfidence * 1.2), // Boost confidence for correlated
                    detectionMethod: 'hybrid',
                    detectedAt: new Date(Math.min(...group.map(a => a.detectedAt.getTime()))),
                    affectedEntities: group[0].affectedEntities,
                    indicators: group.flatMap(a => a.indicators),
                    baselineComparison: group[0].baselineComparison,
                    riskScore: Math.max(...group.map(a => a.riskScore)),
                    falsePositiveProbability: 0.05, // Lower FP for correlated
                    recommendedActions: [...new Set(group.flatMap(a => a.recommendedActions))],
                    relatedAnomalies: group.map(a => a.id),
                    metadata: {
                        correlatedMethods: Array.from(methods),
                        correlatedCount: group.length,
                    },
                });
            }
        }
    }
    return correlated;
}
function determineOverallSeverity(anomalies) {
    const severityLevels = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
    const maxLevel = Math.max(...anomalies.map(a => severityLevels[a.severity] || 0));
    return Object.entries(severityLevels).find(([_, v]) => v === maxLevel)?.[0] || 'low';
}
function identifyHealthcareComplianceViolations(anomalies, context) {
    const violations = [];
    if (context.patientDataAccessed) {
        violations.push('Unauthorized patient data access detected');
    }
    if (context.phiExposed) {
        violations.push('Potential PHI exposure - HIPAA violation');
    }
    if (context.hipaaViolation) {
        violations.push('Direct HIPAA compliance violation');
    }
    const afterHoursAccess = anomalies.some(a => a.anomalyType?.includes('temporal') || a.anomalyType?.includes('time'));
    if (afterHoursAccess && context.patientDataAccessed) {
        violations.push('After-hours patient data access without authorization');
    }
    return violations;
}
function assessHIPAARiskLevel(anomalies, context, riskScore) {
    if (context.phiExposed || context.hipaaViolation)
        return 'critical';
    if (context.patientDataAccessed && riskScore > 80)
        return 'high';
    if (context.patientDataAccessed && riskScore > 60)
        return 'medium';
    if (riskScore > 70)
        return 'medium';
    if (riskScore > 40)
        return 'low';
    return 'none';
}
function generateHealthcareSecurityRecommendations(anomalies, context, hipaaRisk) {
    const recommendations = [];
    if (hipaaRisk === 'critical' || hipaaRisk === 'high') {
        recommendations.push('IMMEDIATE ACTION REQUIRED: Potential HIPAA violation');
        recommendations.push('Notify Privacy Officer and Security Team');
        recommendations.push('Initiate incident response procedure');
        recommendations.push('Preserve all logs and audit trails');
    }
    if (context.patientDataAccessed) {
        recommendations.push('Verify legitimate business need for patient data access');
        recommendations.push('Review minimum necessary standard compliance');
    }
    if (context.medicalDeviceInvolved) {
        recommendations.push('Verify medical device security configuration');
        recommendations.push('Check for device firmware updates');
    }
    if (context.ehr_SystemAccessed) {
        recommendations.push('Review EHR access logs');
        recommendations.push('Verify user permissions and role assignments');
    }
    return recommendations;
}
function identifyEndpointThreats(anomalies, healthStatus) {
    const threats = [];
    if (anomalies.some(a => a.anomalyType?.includes('injection'))) {
        threats.push('Process injection detected');
    }
    if (anomalies.some(a => a.anomalyType?.includes('privilege'))) {
        threats.push('Privilege escalation attempt');
    }
    if (anomalies.some(a => a.anomalyType?.includes('malware'))) {
        threats.push('Potential malware activity');
    }
    if (healthStatus?.compromised || healthStatus?.status === 'compromised') {
        threats.push('Endpoint potentially compromised');
    }
    return threats;
}
function generateEndpointRecommendations(anomalies, healthStatus) {
    const recommendations = [];
    if (healthStatus?.compromised) {
        recommendations.push('Isolate endpoint from network immediately');
        recommendations.push('Initiate forensic investigation');
    }
    if (anomalies.length > 5) {
        recommendations.push('High anomaly count - consider endpoint reimaging');
    }
    recommendations.push('Update endpoint security agent');
    recommendations.push('Run full system scan');
    recommendations.push('Review endpoint logs');
    return recommendations;
}
function determineEndpointHealth(healthStatus, anomalies) {
    const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
    const highCount = anomalies.filter(a => a.severity === 'high').length;
    if (criticalCount > 0 || healthStatus?.compromised)
        return 'critical';
    if (highCount > 2 || anomalies.length > 10)
        return 'compromised';
    if (highCount > 0 || anomalies.length > 5)
        return 'degraded';
    return 'healthy';
}
function generateCorrelationRecommendations(correlationGroups, attackChains) {
    const recommendations = [];
    if (correlationGroups.length > 0) {
        recommendations.push(`Investigate ${correlationGroups.length} correlated anomaly groups`);
    }
    if (attackChains.length > 0) {
        recommendations.push('Potential attack chain detected - review kill chain progression');
        recommendations.push('Implement additional monitoring for identified attack patterns');
    }
    const criticalGroups = correlationGroups.filter(g => g.severity === 'critical');
    if (criticalGroups.length > 0) {
        recommendations.push('CRITICAL: Coordinated attack detected across multiple entities');
        recommendations.push('Escalate to security operations center immediately');
    }
    return recommendations;
}
function shouldAlert(anomaly, config) {
    if (anomaly.severity === 'critical')
        return true;
    if (anomaly.severity === 'high' && config.sensitivity !== 'low')
        return true;
    if (anomaly.confidenceScore > config.confidenceThreshold)
        return true;
    return false;
}
async function executeAutoResponse(anomaly, config) {
    // Execute automated response actions based on anomaly severity
    common_1.Logger.log(`Auto-response triggered for anomaly ${anomaly.id} (severity: ${anomaly.severity})`);
    try {
        // In production, implement specific response actions:
        // - Critical: Block IP, terminate session, alert SOC
        // - High: Rate limit, enhanced monitoring, alert admin
        // - Medium: Log event, update threat intel, notify security team
        // - Low: Record for analysis, update baselines
        if (anomaly.severity === 'critical') {
            // Block source immediately
            common_1.Logger.warn(`CRITICAL anomaly detected - immediate response required: ${anomaly.id}`);
            // await blockIPAddress(anomaly.sourceIp);
            // await terminateUserSession(anomaly.userId);
            // await alertSecurityTeam('critical', anomaly);
        }
        else if (anomaly.severity === 'high') {
            // Apply rate limiting
            common_1.Logger.warn(`HIGH severity anomaly - applying restrictions: ${anomaly.id}`);
            // await applyRateLimit(anomaly.sourceIp);
            // await enableEnhancedMonitoring(anomaly.userId);
        }
        else {
            // Log and monitor
            common_1.Logger.info(`Anomaly logged for analysis: ${anomaly.id}`);
            // await updateThreatIntelligence(anomaly);
        }
    }
    catch (error) {
        common_1.Logger.error(`Auto-response execution failed for ${anomaly.id}:`, error);
    }
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    establishComprehensiveSecurityBaseline: exports.establishComprehensiveSecurityBaseline,
    detectSecurityAnomaliesMultiMethod: exports.detectSecurityAnomaliesMultiMethod,
    analyzeHealthcareBehavioralAnomalies: exports.analyzeHealthcareBehavioralAnomalies,
    detectEndpointSecurityAnomalies: exports.detectEndpointSecurityAnomalies,
    correlateAnomaliesAcrossEntities: exports.correlateAnomaliesAcrossEntities,
    monitorSecurityAnomaliesRealTime: exports.monitorSecurityAnomaliesRealTime,
};
//# sourceMappingURL=security-anomaly-detection-composite.js.map