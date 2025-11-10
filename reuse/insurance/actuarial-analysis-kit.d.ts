/**
 * LOC: INS-ACTUARIAL-001
 * File: /reuse/insurance/actuarial-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance backend services
 *   - Pricing and rating modules
 *   - Risk management services
 *   - Reserving and financial systems
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Actuarial metric type
 */
export declare enum ActuarialMetricType {
    LOSS_RATIO = "loss_ratio",
    COMBINED_RATIO = "combined_ratio",
    EXPENSE_RATIO = "expense_ratio",
    PURE_PREMIUM = "pure_premium",
    ULTIMATE_LOSS = "ultimate_loss",
    IBNR_RESERVE = "ibnr_reserve",
    CASE_RESERVE = "case_reserve",
    CREDIBILITY_FACTOR = "credibility_factor",
    EXPERIENCE_MOD = "experience_mod",
    LOSS_DEVELOPMENT = "loss_development",
    FREQUENCY = "frequency",
    SEVERITY = "severity"
}
/**
 * Development period type
 */
export declare enum DevelopmentPeriod {
    MONTHS_12 = "12_months",
    MONTHS_24 = "24_months",
    MONTHS_36 = "36_months",
    MONTHS_48 = "48_months",
    MONTHS_60 = "60_months",
    MONTHS_72 = "72_months",
    MONTHS_84 = "84_months",
    MONTHS_96 = "96_months",
    MONTHS_108 = "108_months",
    MONTHS_120 = "120_months",
    ULTIMATE = "ultimate"
}
/**
 * Valuation method
 */
export declare enum ValuationMethod {
    PAID_LOSS = "paid_loss",
    INCURRED_LOSS = "incurred_loss",
    REPORTED_LOSS = "reported_loss",
    CASE_INCURRED = "case_incurred",
    EXPECTED_LOSS = "expected_loss"
}
/**
 * Distribution type
 */
export declare enum DistributionType {
    NORMAL = "normal",
    LOGNORMAL = "lognormal",
    GAMMA = "gamma",
    PARETO = "pareto",
    WEIBULL = "weibull",
    EXPONENTIAL = "exponential",
    POISSON = "poisson",
    NEGATIVE_BINOMIAL = "negative_binomial"
}
/**
 * Credibility method
 */
export declare enum CredibilityMethod {
    FULL_CREDIBILITY = "full_credibility",
    PARTIAL_CREDIBILITY = "partial_credibility",
    LIMITED_FLUCTUATION = "limited_fluctuation",
    BUHLMANN = "buhlmann",
    GREATEST_ACCURACY = "greatest_accuracy"
}
/**
 * Rate adequacy status
 */
export declare enum RateAdequacyStatus {
    ADEQUATE = "adequate",
    INADEQUATE = "inadequate",
    EXCESSIVE = "excessive",
    MARGINALLY_ADEQUATE = "marginally_adequate",
    REQUIRES_REVISION = "requires_revision"
}
/**
 * Loss ratio calculation data
 */
export interface LossRatioData {
    periodStart: Date;
    periodEnd: Date;
    productLine?: string;
    geography?: string;
    policyType?: string;
    includeDevelopment?: boolean;
}
/**
 * Loss ratio result
 */
export interface LossRatioResult {
    earnedPremium: number;
    incurredLoss: number;
    lossRatio: number;
    lossRatioPercentage: number;
    claimCount: number;
    averageClaimCost: number;
    periodStart: Date;
    periodEnd: Date;
    calculatedAt: Date;
}
/**
 * Combined ratio result
 */
export interface CombinedRatioResult {
    earnedPremium: number;
    incurredLoss: number;
    expenseAmount: number;
    lossRatio: number;
    expenseRatio: number;
    combinedRatio: number;
    underwritingProfit: number;
    profitMargin: number;
    calculatedAt: Date;
}
/**
 * Pure premium calculation data
 */
export interface PurePremiumData {
    exposureBase: number;
    incurredLosses: number;
    claimCount: number;
    periodStart: Date;
    periodEnd: Date;
    productLine: string;
}
/**
 * Loss development factor data
 */
export interface LossDevFactorData {
    accidentYear: number;
    valuationDate: Date;
    developmentMonth: number;
    paidLoss: number;
    caseReserves: number;
    incurredLoss: number;
    reportedClaimCount: number;
}
/**
 * IBNR reserve calculation
 */
export interface IBNRReserveData {
    accidentYear: number;
    reportedLosses: number;
    ultimateLosses: number;
    paidLosses: number;
    caseReserves: number;
    developmentAge: number;
}
/**
 * Severity distribution result
 */
export interface SeverityDistribution {
    distributionType: DistributionType;
    mean: number;
    median: number;
    mode: number;
    standardDeviation: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    percentile50: number;
    percentile75: number;
    percentile90: number;
    percentile95: number;
    percentile99: number;
    maxLoss: number;
    minLoss: number;
    sampleSize: number;
}
/**
 * Frequency analysis result
 */
export interface FrequencyAnalysis {
    exposures: number;
    claimCount: number;
    frequency: number;
    expectedClaims: number;
    actualVsExpected: number;
    varianceToExpected: number;
    confidenceInterval: {
        lower: number;
        upper: number;
        confidenceLevel: number;
    };
}
/**
 * Credibility weighting result
 */
export interface CredibilityWeighting {
    credibilityFactor: number;
    credibilityMethod: CredibilityMethod;
    actualExperience: number;
    expectedExperience: number;
    creditedValue: number;
    exposureCount: number;
    fullCredibilityStandard: number;
    isFullCredibility: boolean;
}
/**
 * Experience modification data
 */
export interface ExperienceModData {
    actualLosses: number;
    expectedLosses: number;
    actualPrimaryLosses: number;
    expectedPrimaryLosses: number;
    ballastValue: number;
    weightingFactor: number;
}
/**
 * Rate adequacy analysis
 */
export interface RateAdequacyAnalysis {
    currentRate: number;
    indicatedRate: number;
    rateChange: number;
    rateChangePercentage: number;
    adequacyStatus: RateAdequacyStatus;
    lossRatio: number;
    targetLossRatio: number;
    expenseRatio: number;
    targetCombinedRatio: number;
    profitMargin: number;
    recommendation: string;
}
/**
 * Ultimate loss projection
 */
export interface UltimateLossProjection {
    accidentYear: number;
    reportedLosses: number;
    paidLosses: number;
    caseReserves: number;
    projectedUltimateLoss: number;
    ibnrReserve: number;
    developmentMethod: string;
    confidenceInterval: {
        lower: number;
        upper: number;
        confidenceLevel: number;
    };
    calculatedAt: Date;
}
/**
 * Retention analysis result
 */
export interface RetentionAnalysis {
    productLine: string;
    totalPoliciesStart: number;
    renewedPolicies: number;
    cancelledPolicies: number;
    nonRenewedPolicies: number;
    retentionRate: number;
    cancellationRate: number;
    nonRenewalRate: number;
    averageTenure: number;
    lifetimeValue: number;
}
/**
 * Reinsurance optimization result
 */
export interface ReinsuranceOptimization {
    retentionAmount: number;
    cededAmount: number;
    reinsurerShare: number;
    cededPremium: number;
    cedingCommission: number;
    netCost: number;
    riskReduction: number;
    capitalRelief: number;
    returnOnCapital: number;
    recommendation: string;
}
/**
 * Actuarial calculation model
 */
export declare class ActuarialCalculation extends Model {
    id: string;
    calculation_type: ActuarialMetricType;
    accident_year: number;
    valuation_date: Date;
    product_line: string;
    earned_premium: number;
    incurred_loss: number;
    paid_loss: number;
    case_reserves: number;
    ibnr_reserves: number;
    loss_ratio: number;
    combined_ratio: number;
    development_factor: number;
    calculation_details: Record<string, any>;
    calculated_by: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
/**
 * Calculates loss ratio for a given period
 *
 * @param data - Loss ratio calculation parameters
 * @param transaction - Optional database transaction
 * @returns Loss ratio analysis result
 *
 * @example
 * ```typescript
 * const lossRatio = await calculateLossRatio({
 *   periodStart: new Date('2024-01-01'),
 *   periodEnd: new Date('2024-12-31'),
 *   productLine: 'auto',
 *   includeDevelopment: true
 * });
 * console.log(`Loss Ratio: ${lossRatio.lossRatioPercentage}%`);
 * ```
 */
export declare function calculateLossRatio(data: LossRatioData, transaction?: Transaction): Promise<LossRatioResult>;
/**
 * Calculates trending loss ratio over multiple periods
 */
export declare function calculateLossRatioTrend(startDate: Date, endDate: Date, intervalMonths: number, productLine?: string, transaction?: Transaction): Promise<LossRatioResult[]>;
/**
 * Calculates combined ratio (loss ratio + expense ratio)
 */
export declare function calculateCombinedRatio(periodStart: Date, periodEnd: Date, productLine?: string, transaction?: Transaction): Promise<CombinedRatioResult>;
/**
 * Calculates pure premium (loss cost per exposure)
 */
export declare function calculatePurePremium(data: PurePremiumData, transaction?: Transaction): Promise<number>;
/**
 * Develops pure premium with trend factors
 */
export declare function developPurePremium(basePurePremium: number, trendFactor: number, periods: number): Promise<number>;
/**
 * Calculates credibility-weighted pure premium
 */
export declare function calculateCreditedPurePremium(actualPurePremium: number, expectedPurePremium: number, credibilityFactor: number): Promise<number>;
/**
 * Calculates age-to-age loss development factors
 */
export declare function calculateAgeToAgeDevelopmentFactors(accidentYear: number, productLine: string, transaction?: Transaction): Promise<Map<number, number>>;
/**
 * Calculates age-to-ultimate loss development factors
 */
export declare function calculateAgeToUltimateDevelopmentFactor(ageMonths: number, ageToAgeFactors: Map<number, number>): Promise<number>;
/**
 * Calculates selected loss development factors using averaging methods
 */
export declare function calculateSelectedDevelopmentFactors(historicalFactors: number[][], method?: 'simple' | 'weighted' | 'geometric'): Promise<number[]>;
/**
 * Calculates IBNR reserves using chain ladder method
 */
export declare function calculateIBNRReserves(data: IBNRReserveData, developmentFactors: number[], transaction?: Transaction): Promise<number>;
/**
 * Calculates IBNR using Bornhuetter-Ferguson method
 */
export declare function calculateBornhuetterFergusonIBNR(earnedPremium: number, expectedLossRatio: number, reportedLosses: number, percentReported: number): Promise<number>;
/**
 * Calculates total reserves (case + IBNR)
 */
export declare function calculateTotalReserves(caseReserves: number, ibnrReserves: number, additionalExpenseReserves?: number): Promise<number>;
/**
 * Analyzes claim severity distribution
 */
export declare function analyzeSeverityDistribution(claimAmounts: number[], distributionType?: DistributionType): Promise<SeverityDistribution>;
/**
 * Calculates expected severity from distribution parameters
 */
export declare function calculateExpectedSeverity(distributionType: DistributionType, parameters: Record<string, number>): Promise<number>;
/**
 * Fits severity distribution to claim data
 */
export declare function fitSeverityDistribution(claimAmounts: number[], distributionType: DistributionType): Promise<Record<string, number>>;
/**
 * Analyzes claim frequency
 */
export declare function analyzeClaimFrequency(exposures: number, claimCount: number, confidenceLevel?: number): Promise<FrequencyAnalysis>;
/**
 * Calculates frequency trend over time
 */
export declare function calculateFrequencyTrend(historicalData: Array<{
    exposures: number;
    claimCount: number;
    year: number;
}>): Promise<number>;
/**
 * Projects future claim frequency
 */
export declare function projectClaimFrequency(currentFrequency: number, trendFactor: number, periods: number): Promise<number>;
/**
 * Calculates credibility weighting
 */
export declare function calculateCredibility(exposureCount: number, fullCredibilityStandard: number, method?: CredibilityMethod): Promise<number>;
/**
 * Applies credibility weighting to blend actual and expected values
 */
export declare function applyCredibilityWeighting(actualExperience: number, expectedExperience: number, credibilityFactor: number): Promise<CredibilityWeighting>;
/**
 * Calculates experience modification factor (workers compensation style)
 */
export declare function calculateExperienceMod(data: ExperienceModData): Promise<number>;
/**
 * Calculates three-year average experience mod
 */
export declare function calculateThreeYearAverageExperienceMod(year1Mod: number, year2Mod: number, year3Mod: number): Promise<number>;
/**
 * Performs rate adequacy analysis
 */
export declare function performRateAdequacyAnalysis(earnedPremium: number, incurredLoss: number, expenses: number, targetCombinedRatio: number, transaction?: Transaction): Promise<RateAdequacyAnalysis>;
/**
 * Tests rate adequacy by coverage type
 */
export declare function testRateAdequacyByCoverage(coverageType: string, periodStart: Date, periodEnd: Date, targetCombinedRatio: number, transaction?: Transaction): Promise<RateAdequacyAnalysis>;
/**
 * Projects ultimate losses using development method
 */
export declare function projectUltimateLosses(accidentYear: number, reportedLosses: number, developmentAge: number, developmentFactors: number[], method?: 'chain_ladder' | 'bornhuetter_ferguson'): Promise<UltimateLossProjection>;
/**
 * Projects ultimate losses for all open accident years
 */
export declare function projectAllAccidentYears(currentYear: number, yearsToProject: number, developmentFactors: number[], transaction?: Transaction): Promise<UltimateLossProjection[]>;
/**
 * Analyzes policy retention rates
 */
export declare function analyzeRetention(productLine: string, periodStart: Date, periodEnd: Date, transaction?: Transaction): Promise<RetentionAnalysis>;
/**
 * Calculates cohort retention over time
 */
export declare function calculateCohortRetention(cohortStartDate: Date, monthsToAnalyze: number): Promise<Map<number, number>>;
/**
 * Optimizes reinsurance retention levels
 */
export declare function optimizeReinsuranceRetention(grossPremium: number, expectedLossRatio: number, capitalRequirement: number, reinsurerPricing: {
    retentionLevel: number;
    rate: number;
}[]): Promise<ReinsuranceOptimization>;
/**
 * Calculates reinsurance recovery on a claim
 */
export declare function calculateReinsuranceRecovery(claimAmount: number, retentionLimit: number, reinsurerShare: number): Promise<number>;
/**
 * Models catastrophe reinsurance need
 */
export declare function modelCatastropheReinsuranceNeed(portfolioValue: number, catExposure: number, pmlLevel: number, // 1-in-X year event
availableCapital: number): Promise<{
    recommendedCoverage: number;
    attachmentPoint: number;
    layers: number;
}>;
//# sourceMappingURL=actuarial-analysis-kit.d.ts.map