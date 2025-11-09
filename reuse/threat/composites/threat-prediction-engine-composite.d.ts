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
import { type ThreatForecast } from '../threat-prediction-forecasting-kit';
/**
 * Threat prediction engine configuration
 */
export interface ThreatPredictionConfig {
    id: string;
    name: string;
    description: string;
    predictionModels: string[];
    forecastHorizon: number;
    updateInterval: number;
    confidenceThreshold: number;
    enableMLPrediction: boolean;
    enableTrendAnalysis: boolean;
    enableActorProfiling: boolean;
    enableCampaignTracking: boolean;
    autoModelRetraining: boolean;
    hipaaCompliant: boolean;
}
/**
 * Comprehensive threat prediction result
 */
export interface ComprehensiveThreatPrediction {
    predictionId: string;
    timestamp: Date;
    threatType: string;
    threatCategory: string;
    predictedSeverity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    confidenceScore: number;
    attackVectors: Array<{
        vector: string;
        likelihood: number;
        impact: number;
    }>;
    targetedAssets: string[];
    estimatedTimeToAttack: number;
    attackProbability: number;
    riskScore: number;
    threatActors: Array<{
        actorId: string;
        actorName: string;
        capability: number;
        intent: number;
        opportunity: number;
    }>;
    campaigns: string[];
    mitreMapping: string[];
    indicators: any[];
    mitigationRecommendations: string[];
    forecastData?: ThreatForecast;
    mlExplanation?: any;
    metadata: Record<string, any>;
}
/**
 * Healthcare threat forecast
 */
export interface HealthcareThreatForecast {
    forecastId: string;
    facilityId: string;
    departmentId?: string;
    forecastPeriod: {
        start: Date;
        end: Date;
        granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
    };
    threatCategories: Array<{
        category: string;
        currentLevel: number;
        predictedTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
        forecast: Array<{
            timestamp: Date;
            value: number;
            confidence: number;
            upperBound: number;
            lowerBound: number;
        }>;
    }>;
    topPredictedThreats: string[];
    vulnerabilityHotspots: string[];
    complianceRisks: string[];
    recommendations: string[];
}
/**
 * Threat prediction metrics
 */
export interface ThreatPredictionMetrics {
    totalPredictions: number;
    accuratePredictions: number;
    predictionAccuracy: number;
    averageConfidence: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
    modelsDeployed: number;
    lastModelUpdate: Date;
    lastRetraining: Date;
}
/**
 * Generates comprehensive threat predictions using multiple ML models
 * Combines classification, clustering, and forecasting models
 *
 * @param targetId - Target entity identifier
 * @param context - Threat context data
 * @param config - Prediction configuration
 * @returns Comprehensive threat prediction
 */
export declare const generateComprehensiveThreatPrediction: (targetId: string, context: {
    historicalThreats?: any[];
    currentTelemetry?: any;
    industry?: string;
    geography?: string;
    assetValue?: number;
}, config?: ThreatPredictionConfig) => Promise<ComprehensiveThreatPrediction>;
/**
 * Generates healthcare-specific threat forecast
 * Predicts threat trends for healthcare facilities
 *
 * @param facilityId - Healthcare facility identifier
 * @param forecastHorizon - Hours to forecast ahead
 * @returns Healthcare threat forecast
 */
export declare const generateHealthcareThreatForecast: (facilityId: string, forecastHorizon?: number, // 7 days default
options?: {
    departmentId?: string;
    granularity?: "hourly" | "daily" | "weekly" | "monthly";
    includeCompliance?: boolean;
}) => Promise<HealthcareThreatForecast>;
/**
 * Performs advanced threat actor profiling and behavior prediction
 * Predicts threat actor tactics, techniques, and procedures
 *
 * @param actorId - Threat actor identifier
 * @param historicalData - Historical actor data
 * @returns Threat actor profile and predictions
 */
export declare const performAdvancedThreatActorProfiling: (actorId: string, historicalData: any[]) => Promise<{
    profile: any;
    behaviorPredictions: any[];
    targetPredictions: any[];
    ttpPredictions: any[];
    campaignPredictions: any[];
    recommendations: string[];
}>;
/**
 * Trains and deploys ensemble ML models for threat prediction
 * Creates ensemble of multiple model types for better accuracy
 *
 * @param trainingData - Historical threat data
 * @param config - Model configuration
 * @returns Trained ensemble model
 */
export declare const trainEnsembleThreatPredictionModel: (trainingData: any[], config: {
    modelTypes?: string[];
    ensembleMethod?: "voting" | "stacking" | "bagging" | "boosting";
    autoTune?: boolean;
    targetMetric?: "accuracy" | "precision" | "recall" | "f1";
}) => Promise<{
    ensembleModel: any;
    componentModels: any[];
    performance: any;
    deploymentId: string;
}>;
/**
 * Predicts attack surface exposure over time
 * Forecasts how attack surface will evolve
 *
 * @param organizationId - Organization identifier
 * @param timeHorizon - Forecast horizon in days
 * @returns Attack surface exposure forecast
 */
export declare const forecastAttackSurfaceEvolution: (organizationId: string, timeHorizon?: number) => Promise<{
    currentExposure: number;
    forecast: Array<{
        date: Date;
        exposure: number;
        confidence: number;
        factors: string[];
    }>;
    criticalPeriods: Array<{
        start: Date;
        end: Date;
        reason: string;
    }>;
    recommendations: string[];
}>;
/**
 * Predicts vulnerability exploitation likelihood
 * Estimates which vulnerabilities are most likely to be exploited
 *
 * @param vulnerabilities - List of vulnerabilities
 * @returns Exploitation predictions
 */
export declare const predictVulnerabilityExploitationPriority: (vulnerabilities: Array<{
    cveId: string;
    cvssScore: number;
    assetCriticality: number;
    publicationDate: Date;
}>) => Promise<Array<{
    cveId: string;
    exploitationLikelihood: number;
    estimatedTimeToExploit: number;
    priorityScore: number;
    threatActors: string[];
    recommendations: string[];
}>>;
/**
 * Generates proactive threat hunting hypotheses using ML
 * Creates data-driven hunting hypotheses based on predictions
 *
 * @param organizationId - Organization identifier
 * @param context - Threat context
 * @returns Generated hunting hypotheses
 */
export declare const generateMLDrivenHuntingHypotheses: (organizationId: string, context: {
    recentIncidents?: any[];
    threatIntelligence?: any[];
    industryTrends?: any[];
}) => Promise<Array<{
    hypothesis: any;
    supportingEvidence: any[];
    queries: any[];
    predictedFindings: any[];
    priority: number;
}>>;
/**
 * Performs predictive campaign tracking
 * Predicts campaign evolution and next moves
 *
 * @param campaignId - Campaign identifier
 * @param historicalData - Campaign history
 * @returns Campaign predictions
 */
export declare const performPredictiveCampaignTracking: (campaignId: string, historicalData: any[]) => Promise<{
    currentPhase: string;
    predictedNextPhases: Array<{
        phase: string;
        probability: number;
        estimatedStart: Date;
        indicators: string[];
    }>;
    targetPredictions: string[];
    ttpPredictions: string[];
    recommendations: string[];
}>;
declare const _default: {
    generateComprehensiveThreatPrediction: (targetId: string, context: {
        historicalThreats?: any[];
        currentTelemetry?: any;
        industry?: string;
        geography?: string;
        assetValue?: number;
    }, config?: ThreatPredictionConfig) => Promise<ComprehensiveThreatPrediction>;
    generateHealthcareThreatForecast: (facilityId: string, forecastHorizon?: number, options?: {
        departmentId?: string;
        granularity?: "hourly" | "daily" | "weekly" | "monthly";
        includeCompliance?: boolean;
    }) => Promise<HealthcareThreatForecast>;
    performAdvancedThreatActorProfiling: (actorId: string, historicalData: any[]) => Promise<{
        profile: any;
        behaviorPredictions: any[];
        targetPredictions: any[];
        ttpPredictions: any[];
        campaignPredictions: any[];
        recommendations: string[];
    }>;
    trainEnsembleThreatPredictionModel: (trainingData: any[], config: {
        modelTypes?: string[];
        ensembleMethod?: "voting" | "stacking" | "bagging" | "boosting";
        autoTune?: boolean;
        targetMetric?: "accuracy" | "precision" | "recall" | "f1";
    }) => Promise<{
        ensembleModel: any;
        componentModels: any[];
        performance: any;
        deploymentId: string;
    }>;
    forecastAttackSurfaceEvolution: (organizationId: string, timeHorizon?: number) => Promise<{
        currentExposure: number;
        forecast: Array<{
            date: Date;
            exposure: number;
            confidence: number;
            factors: string[];
        }>;
        criticalPeriods: Array<{
            start: Date;
            end: Date;
            reason: string;
        }>;
        recommendations: string[];
    }>;
    predictVulnerabilityExploitationPriority: (vulnerabilities: Array<{
        cveId: string;
        cvssScore: number;
        assetCriticality: number;
        publicationDate: Date;
    }>) => Promise<Array<{
        cveId: string;
        exploitationLikelihood: number;
        estimatedTimeToExploit: number;
        priorityScore: number;
        threatActors: string[];
        recommendations: string[];
    }>>;
    generateMLDrivenHuntingHypotheses: (organizationId: string, context: {
        recentIncidents?: any[];
        threatIntelligence?: any[];
        industryTrends?: any[];
    }) => Promise<Array<{
        hypothesis: any;
        supportingEvidence: any[];
        queries: any[];
        predictedFindings: any[];
        priority: number;
    }>>;
    performPredictiveCampaignTracking: (campaignId: string, historicalData: any[]) => Promise<{
        currentPhase: string;
        predictedNextPhases: Array<{
            phase: string;
            probability: number;
            estimatedStart: Date;
            indicators: string[];
        }>;
        targetPredictions: string[];
        ttpPredictions: string[];
        recommendations: string[];
    }>;
};
export default _default;
//# sourceMappingURL=threat-prediction-engine-composite.d.ts.map