/**
 * AML Risk Scoring and Assessment Kit
 *
 * Enterprise-grade Anti-Money Laundering (AML) risk assessment system with
 * comprehensive scoring algorithms, dynamic weighting, and risk-based controls.
 *
 * Features:
 * - Multi-dimensional customer risk scoring
 * - Transaction-level risk assessment
 * - Geographic and channel risk evaluation
 * - Composite risk rating with factor weighting
 * - Risk tier assignment and controls
 * - Mitigation strategy generation
 * - Inherent vs residual risk analysis
 * - Risk appetite framework alignment
 * - Enterprise aggregation and monitoring
 * - Dynamic model updates and learning
 *
 * @module aml-risk-scoring-assessment-kit
 */
/**
 * Core AML risk score (0-100, where 100 is highest risk)
 */
export type RiskScore = number & {
    readonly __brand: 'RiskScore';
};
/**
 * Risk tier classification
 */
export type RiskTier = 'Low' | 'Medium' | 'High' | 'Critical';
/**
 * Risk category enumeration
 */
export declare enum RiskCategory {
    CustomerProfile = "CUSTOMER_PROFILE",
    TransactionBehavior = "TRANSACTION_BEHAVIOR",
    ProductService = "PRODUCT_SERVICE",
    Geographic = "GEOGRAPHIC",
    ChannelDelivery = "CHANNEL_DELIVERY",
    ComplianceHistory = "COMPLIANCE_HISTORY",
    BusinessStructure = "BUSINESS_STRUCTURE"
}
/**
 * Customer profile data for AML assessment
 */
export interface CustomerProfile {
    customerId: string;
    customerType: 'Individual' | 'SME' | 'Corporate' | 'Financial Institution' | 'NGO' | 'Unknown';
    incorporationDate?: Date;
    registeredCountries: string[];
    businessActivities: string[];
    ownershipStructure: 'Direct' | 'Opaque' | 'Mixed';
    pep: boolean;
    sanctionMatches: number;
    complianceRating: number;
    previousALerts: number;
    yearlyTransactionVolume: number;
}
/**
 * Transaction details for risk assessment
 */
export interface TransactionRecord {
    transactionId: string;
    customerId: string;
    amount: number;
    currency: string;
    transactionDate: Date;
    transactionType: 'Wire' | 'Card' | 'ACH' | 'Cash' | 'Crypto' | 'Other';
    direction: 'Inbound' | 'Outbound';
    counterpartyCountry: string;
    counterpartyType: 'Individual' | 'Business' | 'Unknown';
    purpose: string;
    settlementTime: number;
}
/**
 * Product/service information
 */
export interface ProductService {
    productId: string;
    category: string;
    inherentRiskLevel: 'Low' | 'Medium' | 'High';
    regulatoryRestrictions: string[];
    typicalAmlControls: string[];
}
/**
 * Geographic region risk data
 */
export interface GeographicRegion {
    countryCode: string;
    countryName: string;
    amlIndex: number;
    corruptionIndex: number;
    sanctionedCountry: boolean;
    financialCenterStatus: boolean;
    instabilityIndex: number;
}
/**
 * Risk factor weight configuration
 */
export interface RiskFactorWeights {
    customerProfileWeight: number;
    transactionBehaviorWeight: number;
    productServiceWeight: number;
    geographicWeight: number;
    channelWeight: number;
    complianceHistoryWeight: number;
    businessStructureWeight: number;
}
/**
 * Composite risk assessment result
 */
export interface CompositeRiskAssessment {
    customerId: string;
    overallRiskScore: RiskScore;
    riskTier: RiskTier;
    componentScores: {
        [key in RiskCategory]?: number;
    };
    applicableControls: string[];
    mitigationStrategies: string[];
    inherentRisk: RiskScore;
    residualRisk: RiskScore;
    lastAssessmentDate: Date;
    nextReviewDate: Date;
}
/**
 * Risk matrix for visualization
 */
export interface RiskMatrix {
    rows: Array<{
        factor: string;
        score: number;
        tier: RiskTier;
    }>;
    columns: {
        probability: number[];
        impact: number[];
    };
    crossFactorCorrelations: Map<string, number>;
}
/**
 * Dynamic risk model with learning capability
 */
export interface DynamicRiskModel {
    modelId: string;
    version: string;
    lastTrainingDate: Date;
    factorImportance: Map<string, number>;
    historicalAccuracy: number;
    falsePositiveRate: number;
}
/**
 * Risk-based control framework
 */
export interface RiskBasedControl {
    controlId: string;
    riskTierApplicable: RiskTier[];
    controlType: string;
    frequency: 'Monthly' | 'Quarterly' | 'Annually' | 'Continuous';
    description: string;
}
/**
 * Risk appetite configuration
 */
export interface RiskAppetite {
    maxAcceptableRiskScore: number;
    acceptableRiskTiers: RiskTier[];
    riskToleranceByCategory: Map<RiskCategory, number>;
    escalationThresholds: Map<RiskTier, number>;
}
/**
 * Enterprise risk aggregation view
 */
export interface EnterpriseRiskView {
    aggregatedDate: Date;
    totalCustomers: number;
    riskDistribution: {
        [key in RiskTier]: number;
    };
    highestRiskCustomers: string[];
    portfolioRiskScore: RiskScore;
    complianceStatus: 'Pass' | 'Fail' | 'Needs Review';
    recommendedActions: string[];
}
/**
 * Create a valid RiskScore from a number
 * @param score - Numeric score (0-100)
 * @returns RiskScore branded type
 * @throws Error if score is not in valid range
 */
export declare function createRiskScore(score: number): RiskScore;
/**
 * Determine risk tier from score
 * @param score - Risk score (0-100)
 * @returns Appropriate RiskTier
 */
export declare function scoreToRiskTier(score: RiskScore): RiskTier;
/**
 * Validate geographic risk data
 * @param region - Geographic region to validate
 * @returns Validation result with any errors
 */
export declare function validateGeographicData(region: Partial<GeographicRegion>): {
    valid: boolean;
    errors: string[];
};
/**
 * Normalize risk score to standard scale
 * @param score - Raw score value
 * @param min - Minimum possible value
 * @param max - Maximum possible value
 * @returns Normalized score between 0-100
 */
export declare function normalizeRiskScore(score: number, min: number, max: number): RiskScore;
/**
 * Calculate customer profile risk score
 * Evaluates inherent risk based on customer characteristics
 * @param profile - Customer profile data
 * @returns Risk score component (0-100)
 */
export declare function calculateCustomerProfileRisk(profile: CustomerProfile): number;
/**
 * Calculate customer tenure risk
 * Newer customers typically have higher risk
 * @param incorporationDate - Customer incorporation/onboarding date
 * @returns Risk score component (0-100)
 */
export declare function calculateCustomerTenureRisk(incorporationDate: Date): number;
/**
 * Calculate beneficial ownership complexity risk
 * Complex ownership structures increase risk
 * @param ownershipLayers - Number of ownership layers
 * @param jurisdictionCount - Number of different jurisdictions
 * @returns Risk score component (0-100)
 */
export declare function calculateBeneficialOwnershipRisk(ownershipLayers: number, jurisdictionCount: number): number;
/**
 * Calculate business activity risk
 * Certain industries are inherently higher risk
 * @param activities - List of business activities
 * @returns Risk score component (0-100)
 */
export declare function calculateBusinessActivityRisk(activities: string[]): number;
/**
 * Calculate customer relationship risk based on counterparty profile
 * @param counterpartyCountries - Countries where customer conducts business
 * @param geographicRegions - Reference geographic risk data
 * @returns Risk score component (0-100)
 */
export declare function calculateCounterpartyGeographicRisk(counterpartyCountries: string[], geographicRegions: Map<string, GeographicRegion>): number;
/**
 * Calculate transaction amount risk
 * Unusual amounts indicate elevated risk
 * @param amount - Transaction amount
 * @param customerAverageTransaction - Customer's typical transaction size
 * @returns Risk score component (0-100)
 */
export declare function calculateTransactionAmountRisk(amount: number, customerAverageTransaction: number): number;
/**
 * Calculate transaction frequency risk
 * Sudden changes in activity level indicate risk
 * @param transactionFrequency - Transactions per month
 * @param historicalFrequency - Customer's historical monthly average
 * @returns Risk score component (0-100)
 */
export declare function calculateTransactionFrequencyRisk(transactionFrequency: number, historicalFrequency: number): number;
/**
 * Calculate transaction type risk
 * Certain transaction types carry inherent risk
 * @param transactionType - Type of transaction
 * @returns Risk score component (0-100)
 */
export declare function calculateTransactionTypeRisk(transactionType: string): number;
/**
 * Calculate transaction timing risk
 * Off-hours or unusual timing patterns indicate risk
 * @param transactionDate - Date and time of transaction
 * @returns Risk score component (0-100)
 */
export declare function calculateTransactionTimingRisk(transactionDate: Date): number;
/**
 * Calculate settlement speed risk
 * Rapid or delayed settlements may indicate risk
 * @param settlementHours - Time to settlement
 * @returns Risk score component (0-100)
 */
export declare function calculateSettlementSpeedRisk(settlementHours: number): number;
/**
 * Calculate transaction pattern anomaly risk
 * Detects deviations from normal customer behavior
 * @param currentTransaction - Current transaction
 * @param historicalAverages - Customer's historical transaction profile
 * @returns Risk score component (0-100)
 */
export declare function calculateTransactionPatternAnomalyRisk(currentTransaction: TransactionRecord, historicalAverages: {
    avgAmount: number;
    avgFrequency: number;
    mostCommonCountries: string[];
    mostCommonTypes: string[];
    stdDeviation: number;
}): number;
/**
 * Calculate product inherent risk
 * Products themselves carry inherent AML risk
 * @param product - Product or service information
 * @returns Risk score component (0-100)
 */
export declare function calculateProductInherentRisk(product: ProductService): number;
/**
 * Calculate product usage risk
 * How the product is used affects overall risk
 * @param transactionVolume - Annual transaction volume through product
 * @param avgTransactionSize - Average transaction size
 * @param typicalMarketBehavior - Expected behavior for product type
 * @returns Risk score component (0-100)
 */
export declare function calculateProductUsageRisk(transactionVolume: number, avgTransactionSize: number, typicalMarketBehavior: {
    typicalVolumeRange: [number, number];
    typicalSizeRange: [number, number];
}): number;
/**
 * Calculate product control adequacy
 * Evaluates if existing controls match risk level
 * @param product - Product information
 * @param appliedControls - Controls actually applied
 * @returns Risk score component (0-100, lower is better control)
 */
export declare function calculateProductControlAdequacy(product: ProductService, appliedControls: string[]): number;
/**
 * Calculate jurisdiction risk score
 * Comprehensive geographic risk assessment
 * @param regions - Geographic regions involved
 * @returns Risk score component (0-100)
 */
export declare function calculateJurisdictionRisk(regions: GeographicRegion[]): number;
/**
 * Calculate high-risk jurisdiction exposure
 * Quantifies exposure to problematic jurisdictions
 * @param jurisdictions - List of jurisdiction codes
 * @param highRiskList - List of high-risk jurisdiction codes
 * @returns Risk score component (0-100)
 */
export declare function calculateHighRiskJurisdictionExposure(jurisdictions: string[], highRiskList: string[]): number;
/**
 * Calculate sanction regime exposure
 * Evaluates exposure to sanctioned countries/entities
 * @param exposedCountries - Countries with business relationships
 * @param sanctionedCountries - Known sanctioned jurisdictions
 * @returns Risk score component (0-100)
 */
export declare function calculateSanctionRegimeExposure(exposedCountries: string[], sanctionedCountries: string[]): number;
/**
 * Calculate distribution channel risk
 * Different delivery channels have inherent risk profiles
 * @param channel - Distribution channel type
 * @returns Risk score component (0-100)
 */
export declare function calculateChannelRisk(channel: string): number;
/**
 * Calculate third-party risk
 * Evaluates risks from intermediaries and partners
 * @param thirdPartyName - Name of third-party provider
 * @param riskRating - Third-party's own risk rating (0-100)
 * @param complianceTrack - Third-party's compliance history
 * @returns Risk score component (0-100)
 */
export declare function calculateThirdPartyRisk(thirdPartyName: string, riskRating: number, complianceTrack: 'Good' | 'Fair' | 'Poor'): number;
/**
 * Calculate digital channel risk
 * Digital channels may have unique security/compliance risks
 * @param isOnline - Whether transaction is online
 * @param encryptionLevel - Encryption standard used
 * @param authenticationFactor - Number of authentication factors
 * @returns Risk score component (0-100)
 */
export declare function calculateDigitalChannelRisk(isOnline: boolean, encryptionLevel: 'None' | 'Basic' | 'Standard' | 'Enhanced', authenticationFactor: number): number;
/**
 * Calculate composite AML risk score
 * Combines multiple risk dimensions with configurable weights
 * @param componentScores - Individual risk component scores
 * @param weights - Weight configuration for each component
 * @returns Overall composite risk score (0-100)
 */
export declare function calculateCompositeRiskScore(componentScores: Partial<Record<RiskCategory, number>>, weights: Partial<RiskFactorWeights>): RiskScore;
/**
 * Apply risk modifier based on temporal factors
 * Recent events may temporarily increase risk
 * @param baseScore - Base composite risk score
 * @param recentAnomalies - Number of recent suspicious transactions
 * @param monthsSinceLastReview - Time since last assessment
 * @returns Adjusted risk score
 */
export declare function applyTemporalRiskModifier(baseScore: RiskScore, recentAnomalies: number, monthsSinceLastReview: number): RiskScore;
/**
 * Create comprehensive risk matrix
 * Visualizes risk across multiple factors
 * @param factors - Risk factors with scores
 * @returns Risk matrix structure
 */
export declare function createRiskMatrix(factors: Array<{
    name: string;
    score: number;
}>): RiskMatrix;
/**
 * Update factor weights based on model performance
 * Allows machine learning-driven optimization
 * @param currentWeights - Current weight configuration
 * @param performanceMetrics - Model accuracy metrics
 * @returns Updated weight configuration
 */
export declare function updateFactorWeights(currentWeights: RiskFactorWeights, performanceMetrics: {
    customerProfileAccuracy: number;
    transactionBehaviorAccuracy: number;
    productServiceAccuracy: number;
    geographicAccuracy: number;
    channelAccuracy: number;
}): RiskFactorWeights;
/**
 * Calculate model drift detection
 * Identifies when risk model performance degrades
 * @param historicalAccuracy - Model's historical accuracy
 * @param recentAccuracy - Recent period accuracy
 * @param threshold - Drift threshold (default 0.05 = 5%)
 * @returns Drift detection result
 */
export declare function detectModelDrift(historicalAccuracy: number, recentAccuracy: number, threshold?: number): {
    driftDetected: boolean;
    degradation: number;
    recommendation: string;
};
/**
 * Reweight factors based on recent transaction data
 * Adapts model to changing risk landscape
 * @param baseWeights - Starting weights
 * @param recentTransactions - Recent transaction sample
 * @returns Adapted weights
 */
export declare function adaptWeightsToRecentActivity(baseWeights: RiskFactorWeights, recentTransactions: TransactionRecord[]): RiskFactorWeights;
/**
 * Assign customer to risk tier with controls
 * Determines appropriate control level and monitoring
 * @param riskScore - Overall risk score
 * @returns Tier with recommended controls
 */
export declare function assignRiskTierWithControls(riskScore: RiskScore): {
    tier: RiskTier;
    controls: string[];
    reviewFrequency: string;
};
/**
 * Apply dynamic control adjustments
 * Modifies controls based on specific risk factors
 * @param baseControls - Standard controls for tier
 * @param riskFactors - Specific risk factors present
 * @returns Adjusted control list
 */
export declare function applyDynamicControlAdjustments(baseControls: string[], riskFactors: string[]): string[];
/**
 * Generate risk mitigation strategies
 * Recommends actions to reduce identified risks
 * @param riskScore - Current risk score
 * @param riskFactors - Specific risk factors identified
 * @param customerType - Type of customer
 * @returns List of mitigation strategies
 */
export declare function generateMitigationStrategies(riskScore: RiskScore, riskFactors: string[], customerType: string): string[];
/**
 * Calculate mitigation effectiveness
 * Estimates how much risk is reduced by mitigations
 * @param baseRiskScore - Risk before mitigations
 * @param appliedMitigations - List of applied mitigation strategies
 * @returns Residual risk score
 */
export declare function calculateMitigationEffectiveness(baseRiskScore: RiskScore, appliedMitigations: string[]): RiskScore;
/**
 * Calculate inherent risk
 * Risk before any controls are applied
 * @param profile - Customer profile
 * @param transactions - Recent transactions
 * @param products - Products used
 * @returns Inherent risk score
 */
export declare function calculateInherentRisk(profile: CustomerProfile, transactions: TransactionRecord[], products: ProductService[]): RiskScore;
/**
 * Calculate residual risk
 * Risk remaining after all controls are applied
 * @param inherentRisk - Inherent risk score
 * @param appliedControls - Controls in place
 * @param controlEffectiveness - Map of control to effectiveness (0-1)
 * @returns Residual risk score
 */
export declare function calculateResidualRisk(inherentRisk: RiskScore, appliedControls: string[], controlEffectiveness?: Map<string, number>): RiskScore;
/**
 * Compare inherent vs residual risk
 * Determines if controls are adequate
 * @param inherentRisk - Risk without controls
 * @param residualRisk - Risk with controls
 * @param acceptableResidualLevel - Target residual risk level
 * @returns Analysis result
 */
export declare function analyzeRiskReduction(inherentRisk: RiskScore, residualRisk: RiskScore, acceptableResidualLevel: RiskScore): {
    controlAdequate: boolean;
    riskReduction: number;
    reductionPercentage: number;
    recommendation: string;
};
/**
 * Create default risk appetite framework
 * Sets organization-wide risk tolerance
 * @param riskTolerance - Organization's risk tolerance (0-100)
 * @returns Risk appetite configuration
 */
export declare function createRiskAppetiteFramework(riskTolerance: number): RiskAppetite;
/**
 * Evaluate appetite alignment
 * Determines if risk assessment aligns with appetite
 * @param riskScore - Current risk score
 * @param appetite - Risk appetite framework
 * @returns Alignment analysis
 */
export declare function evaluateAppetiteAlignment(riskScore: RiskScore, appetite: RiskAppetite): {
    withinAppetite: boolean;
    breachSeverity: 'None' | 'Minor' | 'Moderate' | 'Severe';
    action: string;
};
/**
 * Calculate portfolio risk vs appetite
 * Aggregates customer risks against organization appetite
 * @param customerRisks - Array of individual customer risk scores
 * @param appetite - Risk appetite framework
 * @returns Portfolio assessment
 */
export declare function evaluatePortfolioVsAppetite(customerRisks: RiskScore[], appetite: RiskAppetite): {
    portfolioRiskScore: RiskScore;
    percentageWithinAppetite: number;
    percentageExceeding: number;
    recommendation: string;
};
/**
 * Aggregate customer risk assessments
 * Creates enterprise-wide risk view
 * @param customerAssessments - Individual customer risk assessments
 * @param assessmentDate - Date of aggregation
 * @returns Enterprise risk aggregation
 */
export declare function aggregateEnterpriseRisk(customerAssessments: CompositeRiskAssessment[], assessmentDate: Date): EnterpriseRiskView;
/**
 * Calculate concentration risk
 * Identifies over-exposure to specific risk factors
 * @param assessments - Customer risk assessments
 * @param concentrationThreshold - Threshold for concern (e.g., 0.30 = 30%)
 * @returns Concentration risk analysis
 */
export declare function calculateConcentrationRisk(assessments: CompositeRiskAssessment[], concentrationThreshold?: number): {
    customerConcentration: {
        customerId: string;
        proportion: number;
    }[];
    riskTierConcentration: {
        tier: RiskTier;
        proportion: number;
    }[];
    concernAreas: string[];
};
/**
 * Generate enterprise risk report
 * Comprehensive view of organizational AML risk
 * @param enterpriseView - Aggregated enterprise risk data
 * @param appetite - Risk appetite framework
 * @returns Formatted risk report
 */
export declare function generateEnterpriseRiskReport(enterpriseView: EnterpriseRiskView, appetite: RiskAppetite): {
    summary: string;
    keyMetrics: Record<string, string | number>;
    riskArea: string;
    recommendations: string[];
};
/**
 * Perform stress testing on risk portfolio
 * Evaluates portfolio resilience to scenario changes
 * @param assessments - Current customer assessments
 * @param scenario - Risk scenario (geographic escalation, recession, etc.)
 * @returns Stressed risk metrics
 */
export declare function performPortfolioStressTest(assessments: CompositeRiskAssessment[], scenario: 'Geographic Escalation' | 'Economic Downturn' | 'Regulatory Tightening' | 'Data Breach'): {
    stressedPortfolioScore: RiskScore;
    affectedCustomers: number;
    recommendation: string;
};
/**
 * Identify systemic risk factors
 * Finds correlated risk increases across portfolio
 * @param assessments - Customer assessments over time
 * @param timeWindow - Time period to analyze (days)
 * @returns Systemic risk analysis
 */
export declare function identifySystemicRiskFactors(assessments: Array<{
    date: Date;
    assessment: CompositeRiskAssessment;
}>, timeWindow?: number): {
    systemicFactors: string[];
    correlationStrength: number;
    affectedCustomerProportion: number;
    alert: string;
};
//# sourceMappingURL=aml-risk-scoring-assessment-kit.d.ts.map