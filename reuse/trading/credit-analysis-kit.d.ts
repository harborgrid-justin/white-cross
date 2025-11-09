/**
 * LOC: CREDITANALYSIS-LQ8C9A
 * File: /reuse/trading/credit-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - decimal.js (arbitrary precision mathematics)
 *
 * DOWNSTREAM (imported by):
 *   - Credit risk controllers
 *   - Fixed income analytics services
 *   - Portfolio management systems
 *   - Counterparty risk modules
 */
/**
 * File: /reuse/trading/credit-analysis-kit.ts
 * Locator: WC-TRADING-CREDIT-001
 * Purpose: Bloomberg Terminal-Level Credit Analytics - Credit risk modeling, CDS analytics, counterparty risk
 *
 * Upstream: Independent credit analytics module
 * Downstream: ../backend/*, Credit controllers, Risk services, Fixed income processors
 * Dependencies: TypeScript 5.x, Node 18+, Decimal.js
 * Exports: 62 utility functions for credit analysis, default probability, spread analytics, CDS pricing, recovery rates, CVA/DVA
 *
 * LLM Context: Institutional-grade credit analytics competing with Bloomberg Terminal (CDSW, DRSK, CDSD functions).
 * Provides comprehensive credit risk assessment including credit scoring, rating models, structural models (Merton, KMV),
 * reduced-form models, credit spread analysis, CDS pricing and Greeks, recovery rate estimation, credit migration matrices,
 * CVA/DVA calculations, portfolio credit risk, and counterparty exposure analytics. All calculations use arbitrary
 * precision arithmetic for institutional accuracy.
 */
import Decimal from 'decimal.js';
/**
 * Credit rating classification
 */
export type CreditRating = 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+' | 'A' | 'A-' | 'BBB+' | 'BBB' | 'BBB-' | 'BB+' | 'BB' | 'BB-' | 'B+' | 'B' | 'B-' | 'CCC+' | 'CCC' | 'CCC-' | 'CC' | 'C' | 'D';
/**
 * Financial statement data
 */
export interface FinancialData {
    totalAssets: number;
    totalLiabilities: number;
    currentAssets: number;
    currentLiabilities: number;
    equity: number;
    ebitda: number;
    netIncome: number;
    revenue: number;
    interestExpense: number;
    cashFlow: number;
    workingCapital: number;
    retainedEarnings: number;
    marketCapitalization?: number;
}
/**
 * Credit metrics result
 */
export interface CreditMetrics {
    creditScore: number;
    rating: CreditRating;
    probabilityOfDefault: Decimal;
    expectedLoss: Decimal;
    recoveryRate: Decimal;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Bond pricing data
 */
export interface BondData {
    faceValue: number;
    couponRate: number;
    maturity: number;
    currentPrice: number;
    frequency: number;
    yieldToMaturity?: number;
}
/**
 * CDS contract data
 */
export interface CDSContract {
    notional: number;
    spread: number;
    maturity: number;
    recoveryRate: number;
    frequency: number;
    upfront?: number;
}
/**
 * Default probability term structure
 */
export interface DefaultProbabilityCurve {
    tenors: number[];
    probabilities: Decimal[];
    marginalProbabilities: Decimal[];
}
/**
 * Credit migration matrix
 */
export interface MigrationMatrix {
    ratings: CreditRating[];
    transitionProbabilities: number[][];
    timeHorizon: number;
}
/**
 * CVA calculation result
 */
export interface CVAResult {
    cva: Decimal;
    dva: Decimal;
    bilateralCVA: Decimal;
    expectedExposure: Decimal[];
    discountedExposure: Decimal[];
}
/**
 * Counterparty exposure profile
 */
export interface ExposureProfile {
    timestamps: Date[];
    expectedExposure: Decimal[];
    potentialFutureExposure: Decimal[];
    expectedPositiveExposure: Decimal;
    maxPFE: Decimal;
}
/**
 * Portfolio credit metrics
 */
export interface PortfolioCreditMetrics {
    expectedLoss: Decimal;
    unexpectedLoss: Decimal;
    valueAtRisk: Decimal;
    expectedShortfall: Decimal;
    diversificationBenefit: Decimal;
}
/**
 * Calculate Altman Z-Score for bankruptcy prediction
 * Reference: Altman, E. (1968). "Financial Ratios, Discriminant Analysis and the Prediction of Corporate Bankruptcy"
 * Bloomberg Equivalent: FGRS <GO>
 *
 * Formula: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 1.0*X5
 * where:
 *   X1 = Working Capital / Total Assets
 *   X2 = Retained Earnings / Total Assets
 *   X3 = EBIT / Total Assets
 *   X4 = Market Value of Equity / Book Value of Total Liabilities
 *   X5 = Sales / Total Assets
 *
 * Interpretation:
 *   Z > 2.99: Safe zone
 *   1.81 < Z < 2.99: Gray zone
 *   Z < 1.81: Distress zone
 *
 * @param data - Financial statement data
 * @returns Z-Score
 */
export declare function calculateAltmanZScore(data: FinancialData): Decimal;
/**
 * Calculate credit score using multiple financial ratios
 * Custom multi-factor scoring model
 *
 * @param data - Financial data
 * @returns Credit score (0-1000, higher is better)
 */
export declare function calculateCreditScore(data: FinancialData): number;
/**
 * Assign credit rating based on credit score
 * Maps numerical score to agency-style rating
 *
 * @param creditScore - Credit score (0-1000)
 * @returns Credit rating
 */
export declare function assignCreditRating(creditScore: number): CreditRating;
/**
 * Calculate distance-to-default (Merton model)
 * Reference: Merton, R. (1974). "On the Pricing of Corporate Debt"
 * Bloomberg Equivalent: DRSK <GO>
 *
 * Formula: DD = (ln(V/D) + (μ - 0.5*σ²)*T) / (σ*√T)
 * where V = asset value, D = debt, μ = asset return, σ = asset volatility, T = time
 *
 * @param assetValue - Market value of assets
 * @param debtValue - Face value of debt
 * @param assetVolatility - Volatility of assets (annualized)
 * @param timeToMaturity - Time to debt maturity (years)
 * @param riskFreeRate - Risk-free rate
 * @returns Distance-to-default (number of standard deviations)
 */
export declare function calculateDistanceToDefault(assetValue: number, debtValue: number, assetVolatility: number, timeToMaturity: number, riskFreeRate: number): Decimal;
/**
 * Classify credit quality based on metrics
 *
 * @param metrics - Credit metrics
 * @returns Credit quality classification
 */
export declare function classifyCreditQuality(metrics: CreditMetrics): string;
/**
 * Calculate rating transition probability
 * Probability of moving from one rating to another
 *
 * @param currentRating - Current credit rating
 * @param targetRating - Target credit rating
 * @param migrationMatrix - Credit migration matrix
 * @returns Transition probability
 */
export declare function calculateRatingTransitionProbability(currentRating: CreditRating, targetRating: CreditRating, migrationMatrix: MigrationMatrix): Decimal;
/**
 * Normalize credit score to 0-1 range
 *
 * @param score - Raw credit score
 * @param minScore - Minimum possible score
 * @param maxScore - Maximum possible score
 * @returns Normalized score (0-1)
 */
export declare function normalizeCreditScore(score: number, minScore?: number, maxScore?: number): Decimal;
/**
 * Calculate multi-factor credit score
 * Weighted combination of multiple credit factors
 *
 * @param factors - Credit factor scores
 * @param weights - Weights for each factor
 * @returns Weighted credit score
 */
export declare function calculateMultiFactorScore(factors: {
    [key: string]: number;
}, weights: {
    [key: string]: number;
}): Decimal;
/**
 * Calculate default probability using Merton structural model
 * Reference: Merton (1974)
 * Bloomberg Equivalent: DRSK <GO>
 *
 * Formula: PD = N(-DD)
 * where N is the cumulative standard normal distribution and DD is distance-to-default
 *
 * @param assetValue - Market value of assets
 * @param debtValue - Face value of debt
 * @param assetVolatility - Asset volatility
 * @param timeToMaturity - Time to maturity (years)
 * @param riskFreeRate - Risk-free rate
 * @returns Probability of default
 */
export declare function calculateMertonDefaultProbability(assetValue: number, debtValue: number, assetVolatility: number, timeToMaturity: number, riskFreeRate: number): Decimal;
/**
 * Calculate KMV-Merton expected default frequency (EDF)
 * Enhanced Merton model used by Moody's KMV
 *
 * @param assetValue - Market value of assets
 * @param debtValue - Short-term debt + 0.5 * long-term debt
 * @param assetVolatility - Asset volatility
 * @param timeHorizon - Forecast horizon (typically 1 year)
 * @param assetReturn - Expected asset return
 * @returns Expected default frequency
 */
export declare function calculateKMVDefaultProbability(assetValue: number, debtValue: number, assetVolatility: number, timeHorizon: number, assetReturn: number): Decimal;
/**
 * Calculate Black-Cox first passage default probability
 * Reference: Black & Cox (1976)
 *
 * Accounts for default at any time before maturity
 *
 * @param assetValue - Current asset value
 * @param barrier - Default barrier (debt level)
 * @param assetVolatility - Asset volatility
 * @param timeHorizon - Time horizon (years)
 * @param assetDrift - Asset drift rate
 * @returns First passage default probability
 */
export declare function calculateBlackCoxDefaultProbability(assetValue: number, barrier: number, assetVolatility: number, timeHorizon: number, assetDrift: number): Decimal;
/**
 * Calculate reduced-form hazard rate model default probability
 * Reference: Jarrow & Turnbull (1995), Duffie & Singleton (1999)
 *
 * Formula: PD(t) = 1 - exp(-λ*t)
 * where λ is the hazard rate (intensity)
 *
 * @param hazardRate - Constant hazard rate (intensity of default)
 * @param timeHorizon - Time horizon (years)
 * @returns Cumulative default probability
 */
export declare function calculateReducedFormDefaultProbability(hazardRate: number, timeHorizon: number): Decimal;
/**
 * Calculate CreditRisk+ default probability
 * Reference: Credit Suisse (1997)
 *
 * Simplified actuarial approach
 *
 * @param expectedDefaultRate - Expected default rate for the segment
 * @param volatilityOfDefaultRate - Volatility of default rate
 * @returns Default probability distribution parameters
 */
export declare function calculateCreditRiskPlusModel(expectedDefaultRate: number, volatilityOfDefaultRate: number): {
    mean: Decimal;
    variance: Decimal;
};
/**
 * Calculate naive historical default probability
 * Simple historical frequency approach
 *
 * @param defaults - Number of defaults
 * @param totalObligors - Total number of obligors
 * @returns Historical default probability
 */
export declare function calculateHistoricalDefaultProbability(defaults: number, totalObligors: number): Decimal;
/**
 * Calculate implied default probability from CDS spread
 * Bloomberg Equivalent: CDSW <GO>
 *
 * Formula (simplified): PD ≈ CDS Spread / (1 - Recovery Rate)
 *
 * @param cdsSpread - CDS spread in basis points
 * @param recoveryRate - Expected recovery rate (0-1)
 * @returns Implied annual default probability
 */
export declare function calculateImpliedDefaultProbabilityFromCDS(cdsSpread: number, recoveryRate: number): Decimal;
/**
 * Calculate implied default probability from bond spread
 *
 * @param bondSpread - Credit spread over risk-free rate (in bps)
 * @param recoveryRate - Expected recovery rate (0-1)
 * @returns Implied annual default probability
 */
export declare function calculateImpliedDefaultProbabilityFromBond(bondSpread: number, recoveryRate: number): Decimal;
/**
 * Calculate forward default probability
 * Default probability between two future dates
 *
 * Formula: Forward PD = (PD_t2 - PD_t1) / (1 - PD_t1)
 *
 * @param cumulativePD_t1 - Cumulative PD to time t1
 * @param cumulativePD_t2 - Cumulative PD to time t2
 * @returns Forward default probability between t1 and t2
 */
export declare function calculateForwardDefaultProbability(cumulativePD_t1: number, cumulativePD_t2: number): Decimal;
/**
 * Calculate marginal (period) default probability
 * Probability of default in a specific period, given survival to that period
 *
 * @param cumulativePDs - Array of cumulative default probabilities
 * @returns Array of marginal default probabilities
 */
export declare function calculateMarginalDefaultProbabilities(cumulativePDs: number[]): Decimal[];
/**
 * Calculate credit spread over benchmark
 * Bloomberg Equivalent: YAS <GO>
 *
 * @param bondYield - Corporate bond yield
 * @param benchmarkYield - Risk-free benchmark yield
 * @returns Credit spread in basis points
 */
export declare function calculateCreditSpread(bondYield: number, benchmarkYield: number): Decimal;
/**
 * Calculate Z-spread (zero-volatility spread)
 * Spread over the entire Treasury spot curve
 *
 * Simplified version: constant spread added to each spot rate
 *
 * @param bondPrice - Current bond price
 * @param cashFlows - Array of bond cash flows
 * @param spotRates - Array of spot rates for each period
 * @param initialGuess - Initial guess for Z-spread (bps)
 * @returns Z-spread in basis points
 */
export declare function calculateZSpread(bondPrice: number, cashFlows: number[], spotRates: number[], initialGuess?: number): Decimal;
/**
 * Calculate option-adjusted spread (OAS)
 * Spread adjusted for embedded options
 *
 * Simplified: Z-spread minus option value
 *
 * @param zSpread - Z-spread in basis points
 * @param optionValue - Value of embedded option (in bps)
 * @returns OAS in basis points
 */
export declare function calculateOptionAdjustedSpread(zSpread: number, optionValue: number): Decimal;
/**
 * Calculate asset swap spread
 * Spread over LIBOR/SOFR in an asset swap
 *
 * @param bondYield - Bond yield
 * @param swapRate - Interest rate swap rate
 * @returns Asset swap spread in basis points
 */
export declare function calculateAssetSwapSpread(bondYield: number, swapRate: number): Decimal;
/**
 * Calculate credit spread duration (CS01)
 * Price sensitivity to 1bp change in credit spread
 *
 * @param bondPrice - Current bond price
 * @param bondDuration - Modified duration
 * @returns CS01 (price change per 1bp spread move)
 */
export declare function calculateCreditSpreadDuration(bondPrice: number, bondDuration: number): Decimal;
/**
 * Calculate credit spread DV01
 * Dollar value of 1bp spread change
 *
 * @param notional - Notional amount
 * @param duration - Modified duration
 * @returns DV01
 */
export declare function calculateCreditSpreadDV01(notional: number, duration: number): Decimal;
/**
 * Build credit spread curve
 * Interpolated spread curve across maturities
 *
 * @param tenors - Array of tenors (years)
 * @param spreads - Array of spreads (bps)
 * @param interpolationTenor - Tenor to interpolate
 * @returns Interpolated spread
 */
export declare function interpolateCreditSpreadCurve(tenors: number[], spreads: number[], interpolationTenor: number): Decimal;
/**
 * Calculate CDS fair spread
 * Bloomberg Equivalent: CDSW <GO>
 *
 * Formula: Fair Spread = (1 - R) * Σ(PD_t * DF_t) / Σ(Surv_t * DF_t)
 * where R = recovery rate, PD = default probability, DF = discount factor, Surv = survival probability
 *
 * @param defaultCurve - Default probability curve
 * @param discountRates - Risk-free discount rates
 * @param recoveryRate - Recovery rate (0-1)
 * @param frequency - Payment frequency per year
 * @returns Fair CDS spread in basis points
 */
export declare function calculateCDSFairSpread(defaultCurve: DefaultProbabilityCurve, discountRates: number[], recoveryRate: number, frequency?: number): Decimal;
/**
 * Calculate CDS present value
 * Bloomberg Equivalent: CDSW <GO>
 *
 * @param contract - CDS contract details
 * @param defaultCurve - Default probability curve
 * @param discountRates - Discount rates
 * @returns CDS present value
 */
export declare function calculateCDSPresentValue(contract: CDSContract, defaultCurve: DefaultProbabilityCurve, discountRates: number[]): Decimal;
/**
 * Calculate CDS upfront payment
 *
 * @param fairSpread - Fair CDS spread (bps)
 * @param contractSpread - Actual contract spread (bps)
 * @param notional - Notional amount
 * @param duration - CDS duration
 * @returns Upfront payment
 */
export declare function calculateCDSUpfront(fairSpread: number, contractSpread: number, notional: number, duration: number): Decimal;
/**
 * Calculate CDS duration (CS01)
 * Bloomberg Equivalent: RISK <GO>
 *
 * Sensitivity to 1bp change in spread
 *
 * @param contract - CDS contract
 * @param defaultCurve - Default probability curve
 * @param discountRates - Discount rates
 * @returns CS01
 */
export declare function calculateCDSDuration(contract: CDSContract, defaultCurve: DefaultProbabilityCurve, discountRates: number[]): Decimal;
/**
 * Calculate CDS convexity
 * Second-order sensitivity to spread changes
 *
 * @param contract - CDS contract
 * @param defaultCurve - Default probability curve
 * @param discountRates - Discount rates
 * @returns Convexity
 */
export declare function calculateCDSConvexity(contract: CDSContract, defaultCurve: DefaultProbabilityCurve, discountRates: number[]): Decimal;
/**
 * Calculate CDS price from spread
 *
 * @param spread - CDS spread (bps)
 * @param recoveryRate - Recovery rate (0-1)
 * @param maturity - Time to maturity (years)
 * @param riskFreeRate - Risk-free rate
 * @returns CDS price (as % of notional)
 */
export declare function calculateCDSPriceFromSpread(spread: number, recoveryRate: number, maturity: number, riskFreeRate: number): Decimal;
/**
 * Calculate CDS spread from price
 *
 * @param price - CDS price (as % of notional)
 * @param recoveryRate - Recovery rate
 * @param maturity - Time to maturity (years)
 * @param riskFreeRate - Risk-free rate
 * @returns CDS spread in basis points
 */
export declare function calculateCDSSpreadFromPrice(price: number, recoveryRate: number, maturity: number, riskFreeRate: number): Decimal;
/**
 * Price CDS index
 * Average of constituent CDS spreads
 *
 * @param constituentSpreads - Array of CDS spreads (bps)
 * @param weights - Weights for each constituent
 * @returns Index spread in basis points
 */
export declare function priceCDSIndex(constituentSpreads: number[], weights?: number[]): Decimal;
/**
 * Calculate CDS basis (bond-CDS basis)
 * Bloomberg Equivalent: CBAS <GO>
 *
 * Formula: Basis = Bond Spread - CDS Spread
 *
 * @param bondSpread - Corporate bond spread (bps)
 * @param cdsSpread - CDS spread (bps)
 * @returns CDS basis in basis points
 */
export declare function calculateCDSBasis(bondSpread: number, cdsSpread: number): Decimal;
/**
 * Bootstrap CDS curve from market quotes
 * Extract default probabilities from CDS spreads
 *
 * @param tenors - CDS maturities (years)
 * @param spreads - CDS spreads (bps)
 * @param recoveryRate - Recovery rate (0-1)
 * @param discountRates - Discount rates
 * @returns Default probability curve
 */
export declare function bootstrapCDSCurve(tenors: number[], spreads: number[], recoveryRate: number, discountRates: number[]): DefaultProbabilityCurve;
/**
 * Estimate historical recovery rate
 * Based on historical default data
 *
 * @param recoveredAmounts - Array of recovered amounts
 * @param exposureAtDefaults - Array of exposures at default
 * @returns Average recovery rate
 */
export declare function estimateHistoricalRecoveryRate(recoveredAmounts: number[], exposureAtDefaults: number[]): Decimal;
/**
 * Get industry-average recovery rates
 * Based on Moody's/S&P historical data
 *
 * @param seniority - Debt seniority class
 * @returns Industry-average recovery rate
 */
export declare function getIndustryAverageRecoveryRate(seniority: 'senior-secured' | 'senior-unsecured' | 'subordinated' | 'junior'): Decimal;
/**
 * Estimate seniority-based recovery rate
 * Adjusted for collateral and priority
 *
 * @param seniority - Debt seniority
 * @param collateralValue - Value of collateral
 * @param exposureAtDefault - Exposure at default
 * @returns Estimated recovery rate
 */
export declare function estimateSeniorityRecoveryRate(seniority: 'senior-secured' | 'senior-unsecured' | 'subordinated' | 'junior', collateralValue: number, exposureAtDefault: number): Decimal;
/**
 * Calculate market-implied recovery rate
 * Derived from CDS and bond prices
 *
 * Formula: R = 1 - (CDS Spread / Bond Spread)
 *
 * @param cdsSpread - CDS spread (bps)
 * @param bondSpread - Bond spread (bps)
 * @returns Market-implied recovery rate
 */
export declare function calculateMarketImpliedRecoveryRate(cdsSpread: number, bondSpread: number): Decimal;
/**
 * Model stochastic recovery rate
 * Beta distribution parameters for recovery rate uncertainty
 *
 * @param meanRecovery - Mean recovery rate
 * @param volatility - Recovery rate volatility
 * @returns Beta distribution parameters (alpha, beta)
 */
export declare function modelStochasticRecovery(meanRecovery: number, volatility: number): {
    alpha: Decimal;
    beta: Decimal;
};
/**
 * Build credit migration matrix from historical data
 *
 * @param transitions - Array of rating transitions [from, to]
 * @param ratings - List of possible ratings
 * @param timeHorizon - Time horizon (years)
 * @returns Migration matrix
 */
export declare function buildMigrationMatrix(transitions: Array<[CreditRating, CreditRating]>, ratings: CreditRating[], timeHorizon: number): MigrationMatrix;
/**
 * Calculate expected credit migration
 * Expected rating change over time
 *
 * @param currentRating - Current rating
 * @param migrationMatrix - Migration matrix
 * @returns Expected rating after time horizon
 */
export declare function calculateExpectedMigration(currentRating: CreditRating, migrationMatrix: MigrationMatrix): Map<CreditRating, Decimal>;
/**
 * Analyze rating drift
 * Tendency to upgrade or downgrade over time
 *
 * @param migrationMatrix - Migration matrix
 * @param currentRating - Current rating
 * @returns Drift score (positive = upgrade tendency, negative = downgrade)
 */
export declare function analyzeRatingDrift(migrationMatrix: MigrationMatrix, currentRating: CreditRating): Decimal;
/**
 * Calculate upgrade probability
 *
 * @param currentRating - Current rating
 * @param migrationMatrix - Migration matrix
 * @returns Probability of upgrade
 */
export declare function calculateUpgradeProbability(currentRating: CreditRating, migrationMatrix: MigrationMatrix): Decimal;
/**
 * Calculate downgrade probability
 *
 * @param currentRating - Current rating
 * @param migrationMatrix - Migration matrix
 * @returns Probability of downgrade
 */
export declare function calculateDowngradeProbability(currentRating: CreditRating, migrationMatrix: MigrationMatrix): Decimal;
/**
 * Calculate time-to-default distribution
 * Distribution of default times
 *
 * @param hazardRates - Hazard rates over time
 * @param timeSteps - Time steps
 * @returns Probability density of default at each time
 */
export declare function calculateTimeToDefaultDistribution(hazardRates: number[], timeSteps: number[]): Decimal[];
/**
 * Calculate Credit Value Adjustment (CVA)
 * Bloomberg Equivalent: CVA <GO>
 *
 * Formula: CVA = LGD * Σ(EE_t * PD_t * DF_t)
 * where EE = expected exposure, PD = default probability, DF = discount factor
 *
 * @param exposureProfile - Expected exposure over time
 * @param defaultCurve - Default probability curve
 * @param recoveryRate - Recovery rate (0-1)
 * @param discountRates - Discount rates
 * @returns CVA amount
 */
export declare function calculateCVA(exposureProfile: Decimal[], defaultCurve: DefaultProbabilityCurve, recoveryRate: number, discountRates: number[]): Decimal;
/**
 * Calculate Debt Value Adjustment (DVA)
 * Own credit risk benefit
 *
 * Formula: DVA = LGD * Σ(NE_t * PD_own_t * DF_t)
 * where NE = negative exposure (when we owe counterparty)
 *
 * @param exposureProfile - Expected exposure (negative for DVA)
 * @param ownDefaultCurve - Own default probability curve
 * @param ownRecoveryRate - Own recovery rate
 * @param discountRates - Discount rates
 * @returns DVA amount
 */
export declare function calculateDVA(exposureProfile: Decimal[], ownDefaultCurve: DefaultProbabilityCurve, ownRecoveryRate: number, discountRates: number[]): Decimal;
/**
 * Calculate Bilateral CVA
 * Net credit risk adjustment accounting for both parties' credit risk
 *
 * Formula: Bilateral CVA = CVA - DVA
 *
 * @param cva - Credit value adjustment
 * @param dva - Debt value adjustment
 * @returns Bilateral CVA
 */
export declare function calculateBilateralCVA(cva: Decimal, dva: Decimal): Decimal;
/**
 * Calculate CVA sensitivities (Greeks)
 *
 * @param baseExposure - Base exposure profile
 * @param defaultCurve - Default probability curve
 * @param recoveryRate - Recovery rate
 * @param discountRates - Discount rates
 * @param shockSize - Size of shock for sensitivity (default: 1%)
 * @returns CVA sensitivities
 */
export declare function calculateCVASensitivities(baseExposure: Decimal[], defaultCurve: DefaultProbabilityCurve, recoveryRate: number, discountRates: number[], shockSize?: number): {
    exposureDelta: Decimal;
    spreadDelta: Decimal;
    recoveryDelta: Decimal;
};
/**
 * Adjust CVA for wrong-way risk
 * When exposure and default probability are positively correlated
 *
 * @param baseCVA - Base CVA without wrong-way risk
 * @param correlation - Correlation between exposure and default (0-1)
 * @returns Adjusted CVA
 */
export declare function adjustCVAForWrongWayRisk(baseCVA: Decimal, correlation: number): Decimal;
/**
 * Calculate Collateral Value Adjustment
 * Reduction in CVA due to collateral posting
 *
 * @param cvaWithoutCollateral - CVA without collateral
 * @param collateralAmount - Amount of collateral posted
 * @param averageExposure - Average exposure
 * @returns CVA with collateral adjustment
 */
export declare function calculateCollateralValueAdjustment(cvaWithoutCollateral: Decimal, collateralAmount: number, averageExposure: number): Decimal;
/**
 * Calculate portfolio default correlation
 * Using Gaussian copula
 *
 * @param asset1Returns - Returns for asset 1
 * @param asset2Returns - Returns for asset 2
 * @returns Default correlation
 */
export declare function calculatePortfolioDefaultCorrelation(asset1Returns: number[], asset2Returns: number[]): Decimal;
/**
 * Calculate portfolio loss distribution using Gaussian copula
 * Simplified one-factor model
 *
 * @param exposures - Array of exposures
 * @param defaultProbabilities - Array of default probabilities
 * @param recoveryRates - Array of recovery rates
 * @param correlation - Asset correlation
 * @param numSimulations - Number of Monte Carlo simulations
 * @returns Portfolio loss percentiles
 */
export declare function calculatePortfolioLossDistribution(exposures: number[], defaultProbabilities: number[], recoveryRates: number[], correlation: number, numSimulations?: number): {
    mean: Decimal;
    stdDev: Decimal;
    percentile95: Decimal;
    percentile99: Decimal;
};
/**
 * Calculate portfolio expected loss
 *
 * @param exposures - Array of exposures
 * @param defaultProbabilities - Array of default probabilities
 * @param lossGivenDefaults - Array of loss given default rates
 * @returns Total expected loss
 */
export declare function calculatePortfolioExpectedLoss(exposures: number[], defaultProbabilities: number[], lossGivenDefaults: number[]): Decimal;
/**
 * Calculate portfolio unexpected loss (economic capital)
 *
 * @param portfolioLossDistribution - Portfolio loss distribution
 * @returns Unexpected loss at 99% confidence
 */
export declare function calculatePortfolioUnexpectedLoss(portfolioLossDistribution: {
    mean: Decimal;
    percentile99: Decimal;
}): Decimal;
/**
 * Allocate economic capital to portfolio positions
 * Using Euler allocation principle
 *
 * @param exposures - Array of exposures
 * @param marginalRisks - Marginal risk contributions
 * @param totalCapital - Total economic capital
 * @returns Allocated capital per position
 */
export declare function allocateEconomicCapital(exposures: number[], marginalRisks: number[], totalCapital: number): Decimal[];
/**
 * Calculate Expected Exposure (EE)
 * Average exposure at each future time point
 *
 * @param exposureScenarios - Array of exposure paths (simulations)
 * @returns Expected exposure profile
 */
export declare function calculateExpectedExposure(exposureScenarios: number[][]): Decimal[];
/**
 * Calculate Potential Future Exposure (PFE)
 * High percentile of exposure distribution (typically 95% or 97.5%)
 *
 * @param exposureScenarios - Array of exposure paths
 * @param percentile - Percentile level (default: 0.95)
 * @returns PFE profile
 */
export declare function calculatePotentialFutureExposure(exposureScenarios: number[][], percentile?: number): Decimal[];
/**
 * Calculate Expected Positive Exposure (EPE)
 * Time-weighted average of expected exposures
 *
 * @param expectedExposure - Expected exposure profile
 * @param timeSteps - Time steps (years)
 * @returns EPE (scalar)
 */
export declare function calculateExpectedPositiveExposure(expectedExposure: Decimal[], timeSteps: number[]): Decimal;
/**
 * Calculate Exposure at Default (EAD)
 * Expected exposure at time of counterparty default
 *
 * @param expectedExposure - Expected exposure profile
 * @param defaultCurve - Default probability curve
 * @returns EAD
 */
export declare function calculateExposureAtDefault(expectedExposure: Decimal[], defaultCurve: DefaultProbabilityCurve): Decimal;
/**
 * Build credit exposure profile
 *
 * @param exposureScenarios - Monte Carlo exposure scenarios
 * @param timestamps - Time points
 * @param defaultCurve - Default probability curve
 * @returns Comprehensive exposure profile
 */
export declare function buildCreditExposureProfile(exposureScenarios: number[][], timestamps: Date[], defaultCurve: DefaultProbabilityCurve): ExposureProfile;
export { calculateAltmanZScore, calculateCreditScore, assignCreditRating, calculateDistanceToDefault, classifyCreditQuality, calculateRatingTransitionProbability, normalizeCreditScore, calculateMultiFactorScore, calculateMertonDefaultProbability, calculateKMVDefaultProbability, calculateBlackCoxDefaultProbability, calculateReducedFormDefaultProbability, calculateCreditRiskPlusModel, calculateHistoricalDefaultProbability, calculateImpliedDefaultProbabilityFromCDS, calculateImpliedDefaultProbabilityFromBond, calculateForwardDefaultProbability, calculateMarginalDefaultProbabilities, calculateCreditSpread, calculateZSpread, calculateOptionAdjustedSpread, calculateAssetSwapSpread, calculateCreditSpreadDuration, calculateCreditSpreadDV01, interpolateCreditSpreadCurve, calculateCDSFairSpread, calculateCDSPresentValue, calculateCDSUpfront, calculateCDSDuration, calculateCDSConvexity, calculateCDSPriceFromSpread, calculateCDSSpreadFromPrice, priceCDSIndex, calculateCDSBasis, bootstrapCDSCurve, estimateHistoricalRecoveryRate, getIndustryAverageRecoveryRate, estimateSeniorityRecoveryRate, calculateMarketImpliedRecoveryRate, modelStochasticRecovery, buildMigrationMatrix, calculateExpectedMigration, analyzeRatingDrift, calculateUpgradeProbability, calculateDowngradeProbability, calculateTimeToDefaultDistribution, calculateCVA, calculateDVA, calculateBilateralCVA, calculateCVASensitivities, adjustCVAForWrongWayRisk, calculateCollateralValueAdjustment, calculatePortfolioDefaultCorrelation, calculatePortfolioLossDistribution, calculatePortfolioExpectedLoss, calculatePortfolioUnexpectedLoss, allocateEconomicCapital, calculateExpectedExposure, calculatePotentialFutureExposure, calculateExpectedPositiveExposure, calculateExposureAtDefault, buildCreditExposureProfile };
//# sourceMappingURL=credit-analysis-kit.d.ts.map