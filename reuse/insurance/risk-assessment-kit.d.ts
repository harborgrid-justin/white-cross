/**
 * LOC: RISKASS001
 * File: /reuse/insurance/risk-assessment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable insurance utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Underwriting services
 *   - Risk management modules
 *   - Policy pricing engines
 *   - Catastrophe modeling systems
 *   - Portfolio management services
 */
/**
 * File: /reuse/insurance/risk-assessment-kit.ts
 * Locator: WC-INS-RISKASS-001
 * Purpose: Comprehensive Risk Assessment and Analysis Kit for Insurance Underwriting
 *
 * Upstream: Independent utility module for insurance risk assessment operations
 * Downstream: ../backend/*, Underwriting services, Pricing engines, Risk management controllers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ utility functions for risk scoring, hazard analysis, exposure quantification, catastrophe modeling
 *
 * LLM Context: Production-ready insurance risk assessment utilities for enterprise underwriting and portfolio management.
 * Provides comprehensive risk evaluation including scoring algorithms, hazard identification, exposure analysis,
 * loss frequency prediction, severity assessment, risk pooling, catastrophe modeling integration, geographic risk analysis,
 * industry-specific risk factors, concentration monitoring, portfolio aggregation, risk appetite enforcement, mitigation
 * recommendations, and third-party risk data integration (ISO, Verisk). Essential for underwriting decisions and
 * portfolio risk management in commercial and personal lines insurance.
 */
import { Sequelize, Transaction } from 'sequelize';
interface RiskScore {
    riskId: string;
    policyId: string;
    applicantId: string;
    lineOfBusiness: string;
    overallScore: number;
    categoryScores: {
        hazard: number;
        exposure: number;
        frequency: number;
        severity: number;
        geographic: number;
        financial: number;
    };
    tier: 'preferred' | 'standard' | 'substandard' | 'declined';
    calculatedAt: Date;
    expiresAt: Date;
    metadata: Record<string, any>;
}
interface HazardClassification {
    hazardId: string;
    riskId: string;
    hazardType: string;
    category: string;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'certain';
    impact: number;
    mitigationFactors: string[];
    requiresInspection: boolean;
    notes: string;
}
interface ExposureAnalysis {
    exposureId: string;
    riskId: string;
    exposureType: string;
    totalInsuredValue: number;
    maximumPossibleLoss: number;
    probableMaximumLoss: number;
    expectedLoss: number;
    concentrationIndex: number;
    geographicSpread: number;
    industryConcentration: number;
    analysisDate: Date;
}
interface LossFrequencyModel {
    modelId: string;
    lineOfBusiness: string;
    riskClass: string;
    historicalFrequency: number;
    predictedFrequency: number;
    confidenceInterval: {
        lower: number;
        upper: number;
    };
    trendFactor: number;
    seasonalityAdjustment: number;
    credibility: number;
    dataPoints: number;
    modelType: string;
}
interface SeverityAssessment {
    assessmentId: string;
    riskId: string;
    perilType: string;
    expectedSeverity: number;
    worstCaseSeverity: number;
    averageHistoricalSeverity: number;
    severityDistribution: string;
    limitOfLiability: number;
    attachmentPoint: number;
    exhaustionProbability: number;
}
interface RiskPool {
    poolId: string;
    poolName: string;
    lineOfBusiness: string;
    memberCount: number;
    totalExposure: number;
    averageRiskScore: number;
    homogeneityIndex: number;
    diversificationScore: number;
    rateClass: string;
    effectiveDate: Date;
    expirationDate: Date;
}
interface CatastropheModel {
    modelId: string;
    eventType: string;
    geographicRegion: string;
    returnPeriod: number;
    eventProbability: number;
    estimatedLoss: number;
    affectedPolicies: number;
    confidenceLevel: number;
    modelProvider: string;
    lastUpdated: Date;
}
interface GeographicRisk {
    geoRiskId: string;
    location: {
        latitude: number;
        longitude: number;
        address: string;
        zipCode: string;
        county: string;
        state: string;
    };
    perilScores: {
        earthquake: number;
        hurricane: number;
        flood: number;
        tornado: number;
        wildfire: number;
        hail: number;
    };
    territoryCode: string;
    protectionClass: string;
    distanceToCoast: number;
    elevation: number;
    floodZone: string;
}
interface IndustryRiskFactor {
    industryCode: string;
    industryName: string;
    naicsCode: string;
    baselineRiskMultiplier: number;
    lossRatio: number;
    frequencyFactor: number;
    severityFactor: number;
    emergingRisks: string[];
    regulatoryComplexity: number;
    trendDirection: 'improving' | 'stable' | 'deteriorating';
}
interface RiskConcentration {
    concentrationId: string;
    portfolioId: string;
    concentrationType: 'geographic' | 'industry' | 'peril' | 'product' | 'customer';
    concentrationMetric: number;
    threshold: number;
    exceedsLimit: boolean;
    aggregateExposure: number;
    topExposures: Array<{
        id: string;
        exposure: number;
        percentage: number;
    }>;
    diversificationIndex: number;
}
interface PortfolioRiskMetrics {
    portfolioId: string;
    totalPolicies: number;
    totalPremium: number;
    totalExposure: number;
    weightedAverageRiskScore: number;
    expectedLossRatio: number;
    volatility: number;
    varConfidenceLevel: number;
    valueAtRisk: number;
    tailValueAtRisk: number;
    riskAdjustedCapital: number;
}
interface MitigationRecommendation {
    recommendationId: string;
    riskId: string;
    mitigationType: string;
    description: string;
    expectedRiskReduction: number;
    estimatedCost: number;
    costBenefitRatio: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    implementationTimeline: string;
    requiredForApproval: boolean;
}
interface ThirdPartyRiskData {
    dataId: string;
    provider: 'ISO' | 'Verisk' | 'CoreLogic' | 'RMS' | 'AIR';
    dataType: string;
    riskId: string;
    score: number;
    grade: string;
    reportDate: Date;
    expirationDate: Date;
    rawData: Record<string, any>;
    integrationStatus: 'pending' | 'integrated' | 'failed';
}
/**
 * Sequelize model for risk score tracking and analysis.
 */
export declare const createRiskScoreModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        riskId: string;
        policyId: string;
        applicantId: string;
        lineOfBusiness: string;
        overallScore: number;
        categoryScores: Record<string, number>;
        tier: string;
        calculatedAt: Date;
        expiresAt: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for hazard classification and tracking.
 */
export declare const createHazardModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        hazardId: string;
        riskId: string;
        hazardType: string;
        category: string;
        severity: string;
        likelihood: string;
        impact: number;
        mitigationFactors: string[];
        requiresInspection: boolean;
        notes: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for exposure analysis tracking.
 */
export declare const createExposureAnalysisModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        exposureId: string;
        riskId: string;
        exposureType: string;
        totalInsuredValue: number;
        maximumPossibleLoss: number;
        probableMaximumLoss: number;
        expectedLoss: number;
        concentrationIndex: number;
        geographicSpread: number;
        industryConcentration: number;
        analysisDate: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Calculates comprehensive risk score for a policy application.
 *
 * @param {string} policyId - Policy identifier
 * @param {string} applicantId - Applicant identifier
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {Record<string, any>} riskFactors - Risk factor inputs
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskScore>} Calculated risk score
 *
 * @example
 * ```typescript
 * const score = await calculateRiskScore(
 *   'POL-12345',
 *   'APP-67890',
 *   'commercial_property',
 *   { buildingAge: 50, sprinklerSystem: true, previousClaims: 2 },
 *   RiskScoreModel,
 *   HazardModel,
 *   transaction
 * );
 * ```
 */
export declare const calculateRiskScore: (policyId: string, applicantId: string, lineOfBusiness: string, riskFactors: Record<string, any>, RiskScoreModel: any, HazardModel: any, transaction?: Transaction) => Promise<RiskScore>;
/**
 * Identifies and classifies hazards for a risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>} propertyData - Property/risk data
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<HazardClassification[]>} Identified hazards
 */
export declare const identifyHazards: (riskId: string, propertyData: Record<string, any>, HazardModel: any, transaction?: Transaction) => Promise<HazardClassification[]>;
/**
 * Analyzes and quantifies exposure for risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>} exposureData - Exposure data
 * @param {any} ExposureAnalysisModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<ExposureAnalysis>} Exposure analysis results
 */
export declare const quantifyExposure: (riskId: string, exposureData: Record<string, any>, ExposureAnalysisModel: any, transaction?: Transaction) => Promise<ExposureAnalysis>;
/**
 * Predicts loss frequency using historical data and modeling.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {string} riskClass - Risk classification
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<LossFrequencyModel>} Loss frequency prediction
 */
export declare const predictLossFrequency: (lineOfBusiness: string, riskClass: string, ClaimModel: any, transaction?: Transaction) => Promise<LossFrequencyModel>;
/**
 * Assesses loss severity using distribution analysis.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {string} perilType - Type of peril
 * @param {any} ClaimModel - Sequelize model
 * @param {Record<string, any>} policyLimits - Policy limits
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<SeverityAssessment>} Severity assessment
 */
export declare const assessLossSeverity: (riskId: string, perilType: string, ClaimModel: any, policyLimits: Record<string, any>, transaction?: Transaction) => Promise<SeverityAssessment>;
/**
 * Performs risk segmentation and pooling analysis.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskPool[]>} Risk pool segments
 */
export declare const segmentRiskPools: (lineOfBusiness: string, RiskScoreModel: any, transaction?: Transaction) => Promise<RiskPool[]>;
/**
 * Analyzes catastrophe exposure using modeling data.
 *
 * @param {string} eventType - Catastrophe event type
 * @param {string} geographicRegion - Geographic region
 * @param {any} PolicyModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<CatastropheModel>} Catastrophe model results
 */
export declare const analyzeCatastropheExposure: (eventType: string, geographicRegion: string, PolicyModel: any, transaction?: Transaction) => Promise<CatastropheModel>;
/**
 * Performs comprehensive geographic risk analysis.
 *
 * @param {Record<string, any>} location - Location data
 * @param {any} GeoRiskModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<GeographicRisk>} Geographic risk assessment
 */
export declare const analyzeGeographicRisk: (location: Record<string, any>, GeoRiskModel: any, transaction?: Transaction) => Promise<GeographicRisk>;
/**
 * Analyzes industry-specific risk factors.
 *
 * @param {string} industryCode - Industry classification code
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IndustryRiskFactor>} Industry risk analysis
 */
export declare const analyzeIndustryRisk: (industryCode: string, ClaimModel: any, transaction?: Transaction) => Promise<IndustryRiskFactor>;
/**
 * Monitors and analyzes risk concentration in portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} concentrationType - Type of concentration to analyze
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskConcentration>} Concentration analysis
 */
export declare const monitorRiskConcentration: (portfolioId: string, concentrationType: "geographic" | "industry" | "peril" | "product" | "customer", PolicyModel: any, RiskScoreModel: any, transaction?: Transaction) => Promise<RiskConcentration>;
/**
 * Aggregates portfolio-level risk metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<PortfolioRiskMetrics>} Portfolio risk metrics
 */
export declare const aggregatePortfolioRisk: (portfolioId: string, PolicyModel: any, RiskScoreModel: any, ClaimModel: any, transaction?: Transaction) => Promise<PortfolioRiskMetrics>;
/**
 * Enforces risk appetite framework constraints.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {RiskScore} riskScore - Risk score to validate
 * @param {any} RiskAppetiteModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<{ approved: boolean; violations: string[] }>} Approval status
 */
export declare const enforceRiskAppetite: (lineOfBusiness: string, riskScore: RiskScore, RiskAppetiteModel: any, transaction?: Transaction) => Promise<{
    approved: boolean;
    violations: string[];
}>;
/**
 * Generates risk mitigation recommendations.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {HazardClassification[]} hazards - Identified hazards
 * @param {any} MitigationModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<MitigationRecommendation[]>} Mitigation recommendations
 */
export declare const generateMitigationRecommendations: (riskId: string, hazards: HazardClassification[], MitigationModel: any, transaction?: Transaction) => Promise<MitigationRecommendation[]>;
/**
 * Integrates third-party risk data (ISO, Verisk).
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {string} provider - Data provider
 * @param {Record<string, any>} requestData - Request parameters
 * @param {any} ThirdPartyDataModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<ThirdPartyRiskData>} Third-party risk data
 */
export declare const integrateThirdPartyRiskData: (riskId: string, provider: "ISO" | "Verisk" | "CoreLogic" | "RMS" | "AIR", requestData: Record<string, any>, ThirdPartyDataModel: any, transaction?: Transaction) => Promise<ThirdPartyRiskData>;
/**
 * Retrieves active risk scores with filtering.
 *
 * @param {Record<string, any>} filters - Filter criteria
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskScore[]>} Filtered risk scores
 */
export declare const getActiveRiskScores: (filters: Record<string, any>, RiskScoreModel: any, transaction?: Transaction) => Promise<RiskScore[]>;
/**
 * Retrieves hazards for a specific risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<HazardClassification[]>} Hazards for risk
 */
export declare const getHazardsByRisk: (riskId: string, HazardModel: any, transaction?: Transaction) => Promise<HazardClassification[]>;
/**
 * Calculates risk correlation matrix across portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, Record<string, number>>>} Correlation matrix
 */
export declare const calculateRiskCorrelationMatrix: (portfolioId: string, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, Record<string, number>>>;
/**
 * Performs stress testing on risk portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Record<string, any>} stressScenario - Stress test scenario
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Stress test results
 */
export declare const performStressTesting: (portfolioId: string, stressScenario: Record<string, any>, PolicyModel: any, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Analyzes risk trends over time.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {number} periodMonths - Analysis period in months
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Risk trend data
 */
export declare const analyzeRiskTrends: (lineOfBusiness: string, periodMonths: number, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>[]>;
/**
 * Performs peer benchmarking analysis.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Benchmark comparison
 */
export declare const benchmarkAgainstPeers: (riskId: string, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Generates risk heat map data.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Heat map data
 */
export declare const generateRiskHeatMap: (portfolioId: string, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Calculates risk-adjusted return metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Risk-adjusted return metrics
 */
export declare const calculateRiskAdjustedReturn: (portfolioId: string, PolicyModel: any, ClaimModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Performs Monte Carlo simulation for risk modeling.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {number} iterations - Number of simulation iterations
 * @param {Record<string, any>} parameters - Simulation parameters
 * @returns {Promise<Record<string, any>>} Simulation results
 */
export declare const performMonteCarloSimulation: (riskId: string, iterations: number, parameters: Record<string, any>) => Promise<Record<string, any>>;
/**
 * Analyzes emerging risk patterns.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {number} lookbackDays - Analysis period in days
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Emerging risk patterns
 */
export declare const analyzeEmergingRisks: (lineOfBusiness: string, lookbackDays: number, RiskScoreModel: any, HazardModel: any, transaction?: Transaction) => Promise<Record<string, any>[]>;
/**
 * Performs scenario analysis for risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>[]} scenarios - Analysis scenarios
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Scenario analysis results
 */
export declare const performScenarioAnalysis: (riskId: string, scenarios: Record<string, any>[], RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>[]>;
/**
 * Generates comprehensive risk dashboard metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Dashboard metrics
 */
export declare const generateRiskDashboard: (portfolioId: string, PolicyModel: any, RiskScoreModel: any, HazardModel: any, ClaimModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Validates risk assessment completeness.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} ExposureAnalysisModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<{ complete: boolean; missingComponents: string[] }>} Validation results
 */
export declare const validateRiskAssessment: (riskId: string, RiskScoreModel: any, HazardModel: any, ExposureAnalysisModel: any, transaction?: Transaction) => Promise<{
    complete: boolean;
    missingComponents: string[];
}>;
/**
 * Archives expired risk assessments.
 *
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<number>} Number of archived assessments
 */
export declare const archiveExpiredRiskAssessments: (RiskScoreModel: any, transaction?: Transaction) => Promise<number>;
/**
 * Recalculates risk scores for portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<number>} Number of recalculated scores
 */
export declare const recalculatePortfolioRiskScores: (portfolioId: string, PolicyModel: any, RiskScoreModel: any, HazardModel: any, transaction?: Transaction) => Promise<number>;
/**
 * Exports risk assessment data for reporting.
 *
 * @param {string[]} riskIds - Risk assessment identifiers
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} ExposureAnalysisModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Export data
 */
export declare const exportRiskAssessmentData: (riskIds: string[], RiskScoreModel: any, HazardModel: any, ExposureAnalysisModel: any, transaction?: Transaction) => Promise<Record<string, any>[]>;
/**
 * Compares risk assessments across time periods.
 *
 * @param {string} policyId - Policy identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Comparison results
 */
export declare const compareRiskAssessmentsOverTime: (policyId: string, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Identifies high-risk policies requiring attention.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} High-risk policies
 */
export declare const identifyHighRiskPolicies: (portfolioId: string, PolicyModel: any, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>[]>;
/**
 * Generates risk improvement action plan.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} MitigationModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Action plan
 */
export declare const generateRiskImprovementPlan: (riskId: string, RiskScoreModel: any, HazardModel: any, MitigationModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Analyzes risk appetite compliance across portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} RiskAppetiteModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Compliance analysis
 */
export declare const analyzeRiskAppetiteCompliance: (portfolioId: string, PolicyModel: any, RiskScoreModel: any, RiskAppetiteModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Performs what-if analysis for risk changes.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>} proposedChanges - Proposed risk factor changes
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} What-if analysis results
 */
export declare const performWhatIfAnalysis: (riskId: string, proposedChanges: Record<string, any>, RiskScoreModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Generates regulatory risk reporting data.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Regulatory report data
 */
export declare const generateRegulatoryRiskReport: (portfolioId: string, PolicyModel: any, RiskScoreModel: any, ClaimModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
/**
 * Calculates catastrophe loss estimates for portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string[]} eventTypes - Catastrophe event types
 * @param {any} PolicyModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Catastrophe loss estimates
 */
export declare const calculateCatastropheLossEstimates: (portfolioId: string, eventTypes: string[], PolicyModel: any, transaction?: Transaction) => Promise<Record<string, any>[]>;
/**
 * Performs reinsurance optimization analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Record<string, any>} reinsuranceOptions - Reinsurance program options
 * @param {any} PolicyModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Reinsurance optimization results
 */
export declare const optimizeReinsurance: (portfolioId: string, reinsuranceOptions: Record<string, any>, PolicyModel: any, ClaimModel: any, transaction?: Transaction) => Promise<Record<string, any>>;
export {};
//# sourceMappingURL=risk-assessment-kit.d.ts.map