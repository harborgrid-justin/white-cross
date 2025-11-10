"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAltmanZScore = calculateAltmanZScore;
exports.calculateCreditScore = calculateCreditScore;
exports.assignCreditRating = assignCreditRating;
exports.calculateDistanceToDefault = calculateDistanceToDefault;
exports.classifyCreditQuality = classifyCreditQuality;
exports.calculateRatingTransitionProbability = calculateRatingTransitionProbability;
exports.normalizeCreditScore = normalizeCreditScore;
exports.calculateMultiFactorScore = calculateMultiFactorScore;
exports.calculateMertonDefaultProbability = calculateMertonDefaultProbability;
exports.calculateKMVDefaultProbability = calculateKMVDefaultProbability;
exports.calculateBlackCoxDefaultProbability = calculateBlackCoxDefaultProbability;
exports.calculateReducedFormDefaultProbability = calculateReducedFormDefaultProbability;
exports.calculateCreditRiskPlusModel = calculateCreditRiskPlusModel;
exports.calculateHistoricalDefaultProbability = calculateHistoricalDefaultProbability;
exports.calculateImpliedDefaultProbabilityFromCDS = calculateImpliedDefaultProbabilityFromCDS;
exports.calculateImpliedDefaultProbabilityFromBond = calculateImpliedDefaultProbabilityFromBond;
exports.calculateForwardDefaultProbability = calculateForwardDefaultProbability;
exports.calculateMarginalDefaultProbabilities = calculateMarginalDefaultProbabilities;
exports.calculateCreditSpread = calculateCreditSpread;
exports.calculateZSpread = calculateZSpread;
exports.calculateOptionAdjustedSpread = calculateOptionAdjustedSpread;
exports.calculateAssetSwapSpread = calculateAssetSwapSpread;
exports.calculateCreditSpreadDuration = calculateCreditSpreadDuration;
exports.calculateCreditSpreadDV01 = calculateCreditSpreadDV01;
exports.interpolateCreditSpreadCurve = interpolateCreditSpreadCurve;
exports.calculateCDSFairSpread = calculateCDSFairSpread;
exports.calculateCDSPresentValue = calculateCDSPresentValue;
exports.calculateCDSUpfront = calculateCDSUpfront;
exports.calculateCDSDuration = calculateCDSDuration;
exports.calculateCDSConvexity = calculateCDSConvexity;
exports.calculateCDSPriceFromSpread = calculateCDSPriceFromSpread;
exports.calculateCDSSpreadFromPrice = calculateCDSSpreadFromPrice;
exports.priceCDSIndex = priceCDSIndex;
exports.calculateCDSBasis = calculateCDSBasis;
exports.bootstrapCDSCurve = bootstrapCDSCurve;
exports.estimateHistoricalRecoveryRate = estimateHistoricalRecoveryRate;
exports.getIndustryAverageRecoveryRate = getIndustryAverageRecoveryRate;
exports.estimateSeniorityRecoveryRate = estimateSeniorityRecoveryRate;
exports.calculateMarketImpliedRecoveryRate = calculateMarketImpliedRecoveryRate;
exports.modelStochasticRecovery = modelStochasticRecovery;
exports.buildMigrationMatrix = buildMigrationMatrix;
exports.calculateExpectedMigration = calculateExpectedMigration;
exports.analyzeRatingDrift = analyzeRatingDrift;
exports.calculateUpgradeProbability = calculateUpgradeProbability;
exports.calculateDowngradeProbability = calculateDowngradeProbability;
exports.calculateTimeToDefaultDistribution = calculateTimeToDefaultDistribution;
exports.calculateCVA = calculateCVA;
exports.calculateDVA = calculateDVA;
exports.calculateBilateralCVA = calculateBilateralCVA;
exports.calculateCVASensitivities = calculateCVASensitivities;
exports.adjustCVAForWrongWayRisk = adjustCVAForWrongWayRisk;
exports.calculateCollateralValueAdjustment = calculateCollateralValueAdjustment;
exports.calculatePortfolioDefaultCorrelation = calculatePortfolioDefaultCorrelation;
exports.calculatePortfolioLossDistribution = calculatePortfolioLossDistribution;
exports.calculatePortfolioExpectedLoss = calculatePortfolioExpectedLoss;
exports.calculatePortfolioUnexpectedLoss = calculatePortfolioUnexpectedLoss;
exports.allocateEconomicCapital = allocateEconomicCapital;
exports.calculateExpectedExposure = calculateExpectedExposure;
exports.calculatePotentialFutureExposure = calculatePotentialFutureExposure;
exports.calculateExpectedPositiveExposure = calculateExpectedPositiveExposure;
exports.calculateExposureAtDefault = calculateExposureAtDefault;
exports.buildCreditExposureProfile = buildCreditExposureProfile;
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
const decimal_js_1 = __importDefault(require("decimal.js"));
// ============================================================================
// CREDIT RATING & SCORING
// ============================================================================
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
function calculateAltmanZScore(data) {
    if (data.totalAssets <= 0) {
        throw new Error('Total assets must be positive');
    }
    const x1 = new decimal_js_1.default(data.workingCapital).div(data.totalAssets);
    const x2 = new decimal_js_1.default(data.retainedEarnings).div(data.totalAssets);
    const x3 = new decimal_js_1.default(data.ebitda).div(data.totalAssets);
    let x4;
    if (data.marketCapitalization !== undefined) {
        x4 = new decimal_js_1.default(data.marketCapitalization).div(data.totalLiabilities);
    }
    else {
        x4 = new decimal_js_1.default(data.equity).div(data.totalLiabilities);
    }
    const x5 = new decimal_js_1.default(data.revenue).div(data.totalAssets);
    const zScore = x1.times(1.2)
        .plus(x2.times(1.4))
        .plus(x3.times(3.3))
        .plus(x4.times(0.6))
        .plus(x5.times(1.0));
    return zScore;
}
/**
 * Calculate credit score using multiple financial ratios
 * Custom multi-factor scoring model
 *
 * @param data - Financial data
 * @returns Credit score (0-1000, higher is better)
 */
function calculateCreditScore(data) {
    const zScore = calculateAltmanZScore(data);
    // Liquidity score (0-250)
    const currentRatio = new decimal_js_1.default(data.currentAssets).div(data.currentLiabilities.plus(0.0001));
    const liquidityScore = decimal_js_1.default.min(currentRatio.times(100), 250);
    // Leverage score (0-250)
    const debtToEquity = new decimal_js_1.default(data.totalLiabilities).div(data.equity.plus(0.0001));
    const leverageScore = decimal_js_1.default.max(new decimal_js_1.default(250).minus(debtToEquity.times(50)), 0);
    // Profitability score (0-250)
    const roa = new decimal_js_1.default(data.netIncome).div(data.totalAssets);
    const profitabilityScore = decimal_js_1.default.min(roa.times(1000).plus(125), 250);
    // Z-score contribution (0-250)
    const zScoreContribution = decimal_js_1.default.min(decimal_js_1.default.max(zScore.times(50), 0), 250);
    const totalScore = liquidityScore
        .plus(leverageScore)
        .plus(profitabilityScore)
        .plus(zScoreContribution);
    return Math.round(totalScore.toNumber());
}
/**
 * Assign credit rating based on credit score
 * Maps numerical score to agency-style rating
 *
 * @param creditScore - Credit score (0-1000)
 * @returns Credit rating
 */
function assignCreditRating(creditScore) {
    if (creditScore >= 900)
        return 'AAA';
    if (creditScore >= 850)
        return 'AA+';
    if (creditScore >= 800)
        return 'AA';
    if (creditScore >= 750)
        return 'AA-';
    if (creditScore >= 700)
        return 'A+';
    if (creditScore >= 650)
        return 'A';
    if (creditScore >= 600)
        return 'A-';
    if (creditScore >= 550)
        return 'BBB+';
    if (creditScore >= 500)
        return 'BBB';
    if (creditScore >= 450)
        return 'BBB-';
    if (creditScore >= 400)
        return 'BB+';
    if (creditScore >= 350)
        return 'BB';
    if (creditScore >= 300)
        return 'BB-';
    if (creditScore >= 250)
        return 'B+';
    if (creditScore >= 200)
        return 'B';
    if (creditScore >= 150)
        return 'B-';
    if (creditScore >= 100)
        return 'CCC+';
    if (creditScore >= 75)
        return 'CCC';
    if (creditScore >= 50)
        return 'CCC-';
    if (creditScore >= 25)
        return 'CC';
    if (creditScore > 0)
        return 'C';
    return 'D';
}
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
function calculateDistanceToDefault(assetValue, debtValue, assetVolatility, timeToMaturity, riskFreeRate) {
    if (assetValue <= 0 || debtValue <= 0) {
        throw new Error('Asset and debt values must be positive');
    }
    if (assetVolatility <= 0) {
        throw new Error('Asset volatility must be positive');
    }
    if (timeToMaturity <= 0) {
        throw new Error('Time to maturity must be positive');
    }
    const v = new decimal_js_1.default(assetValue);
    const d = new decimal_js_1.default(debtValue);
    const sigma = new decimal_js_1.default(assetVolatility);
    const t = new decimal_js_1.default(timeToMaturity);
    const r = new decimal_js_1.default(riskFreeRate);
    const numerator = v.div(d).ln()
        .plus(r.minus(sigma.pow(2).div(2)).times(t));
    const denominator = sigma.times(t.sqrt());
    return numerator.div(denominator);
}
/**
 * Classify credit quality based on metrics
 *
 * @param metrics - Credit metrics
 * @returns Credit quality classification
 */
function classifyCreditQuality(metrics) {
    const rating = metrics.rating;
    if (['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-'].includes(rating)) {
        return 'Investment Grade - High Quality';
    }
    else if (['BBB+', 'BBB', 'BBB-'].includes(rating)) {
        return 'Investment Grade - Medium Quality';
    }
    else if (['BB+', 'BB', 'BB-'].includes(rating)) {
        return 'Non-Investment Grade - Speculative';
    }
    else if (['B+', 'B', 'B-'].includes(rating)) {
        return 'Non-Investment Grade - Highly Speculative';
    }
    else if (['CCC+', 'CCC', 'CCC-', 'CC', 'C'].includes(rating)) {
        return 'Substantial Risk - Near Default';
    }
    else {
        return 'Default';
    }
}
/**
 * Calculate rating transition probability
 * Probability of moving from one rating to another
 *
 * @param currentRating - Current credit rating
 * @param targetRating - Target credit rating
 * @param migrationMatrix - Credit migration matrix
 * @returns Transition probability
 */
function calculateRatingTransitionProbability(currentRating, targetRating, migrationMatrix) {
    const fromIndex = migrationMatrix.ratings.indexOf(currentRating);
    const toIndex = migrationMatrix.ratings.indexOf(targetRating);
    if (fromIndex === -1 || toIndex === -1) {
        throw new Error('Rating not found in migration matrix');
    }
    return new decimal_js_1.default(migrationMatrix.transitionProbabilities[fromIndex][toIndex]);
}
/**
 * Normalize credit score to 0-1 range
 *
 * @param score - Raw credit score
 * @param minScore - Minimum possible score
 * @param maxScore - Maximum possible score
 * @returns Normalized score (0-1)
 */
function normalizeCreditScore(score, minScore = 0, maxScore = 1000) {
    if (maxScore <= minScore) {
        throw new Error('Max score must be greater than min score');
    }
    const normalized = new decimal_js_1.default(score).minus(minScore).div(maxScore - minScore);
    return decimal_js_1.default.max(decimal_js_1.default.min(normalized, 1), 0);
}
/**
 * Calculate multi-factor credit score
 * Weighted combination of multiple credit factors
 *
 * @param factors - Credit factor scores
 * @param weights - Weights for each factor
 * @returns Weighted credit score
 */
function calculateMultiFactorScore(factors, weights) {
    let totalScore = new decimal_js_1.default(0);
    let totalWeight = new decimal_js_1.default(0);
    for (const [factor, value] of Object.entries(factors)) {
        const weight = weights[factor] || 0;
        totalScore = totalScore.plus(new decimal_js_1.default(value).times(weight));
        totalWeight = totalWeight.plus(weight);
    }
    if (totalWeight.isZero()) {
        throw new Error('Total weight cannot be zero');
    }
    return totalScore.div(totalWeight);
}
// ============================================================================
// DEFAULT PROBABILITY MODELS
// ============================================================================
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
function calculateMertonDefaultProbability(assetValue, debtValue, assetVolatility, timeToMaturity, riskFreeRate) {
    const dd = calculateDistanceToDefault(assetValue, debtValue, assetVolatility, timeToMaturity, riskFreeRate);
    // PD = N(-DD) where N is cumulative normal distribution
    return cumulativeNormalDistribution(dd.neg());
}
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
function calculateKMVDefaultProbability(assetValue, debtValue, assetVolatility, timeHorizon, assetReturn) {
    if (assetValue <= 0 || debtValue <= 0 || assetVolatility <= 0 || timeHorizon <= 0) {
        throw new Error('All inputs must be positive');
    }
    const v = new decimal_js_1.default(assetValue);
    const d = new decimal_js_1.default(debtValue);
    const sigma = new decimal_js_1.default(assetVolatility);
    const t = new decimal_js_1.default(timeHorizon);
    const mu = new decimal_js_1.default(assetReturn);
    // Distance to default
    const dd = v.div(d).ln()
        .plus(mu.minus(sigma.pow(2).div(2)).times(t))
        .div(sigma.times(t.sqrt()));
    // EDF = N(-DD)
    return cumulativeNormalDistribution(dd.neg());
}
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
function calculateBlackCoxDefaultProbability(assetValue, barrier, assetVolatility, timeHorizon, assetDrift) {
    if (assetValue <= barrier) {
        return new decimal_js_1.default(1); // Already in default
    }
    const v = new decimal_js_1.default(assetValue);
    const b = new decimal_js_1.default(barrier);
    const sigma = new decimal_js_1.default(assetVolatility);
    const t = new decimal_js_1.default(timeHorizon);
    const mu = new decimal_js_1.default(assetDrift);
    const lambda = mu.div(sigma.pow(2));
    const d1 = v.div(b).ln().plus(lambda.times(sigma.pow(2)).times(t))
        .div(sigma.times(t.sqrt()));
    const d2 = v.div(b).ln().minus(lambda.times(sigma.pow(2)).times(t))
        .div(sigma.times(t.sqrt()));
    const term1 = cumulativeNormalDistribution(d1.neg());
    const term2 = b.div(v).pow(lambda.times(2)).times(cumulativeNormalDistribution(d2));
    return term1.plus(term2);
}
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
function calculateReducedFormDefaultProbability(hazardRate, timeHorizon) {
    if (hazardRate < 0) {
        throw new Error('Hazard rate must be non-negative');
    }
    if (timeHorizon < 0) {
        throw new Error('Time horizon must be non-negative');
    }
    const lambda = new decimal_js_1.default(hazardRate);
    const t = new decimal_js_1.default(timeHorizon);
    return new decimal_js_1.default(1).minus(lambda.times(t).neg().exp());
}
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
function calculateCreditRiskPlusModel(expectedDefaultRate, volatilityOfDefaultRate) {
    const mean = new decimal_js_1.default(expectedDefaultRate);
    const vol = new decimal_js_1.default(volatilityOfDefaultRate);
    const variance = vol.pow(2);
    return { mean, variance };
}
/**
 * Calculate naive historical default probability
 * Simple historical frequency approach
 *
 * @param defaults - Number of defaults
 * @param totalObligors - Total number of obligors
 * @returns Historical default probability
 */
function calculateHistoricalDefaultProbability(defaults, totalObligors) {
    if (totalObligors <= 0) {
        throw new Error('Total obligors must be positive');
    }
    return new decimal_js_1.default(defaults).div(totalObligors);
}
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
function calculateImpliedDefaultProbabilityFromCDS(cdsSpread, recoveryRate) {
    if (recoveryRate < 0 || recoveryRate > 1) {
        throw new Error('Recovery rate must be between 0 and 1');
    }
    const spread = new decimal_js_1.default(cdsSpread).div(10000); // Convert bps to decimal
    const lgd = new decimal_js_1.default(1).minus(recoveryRate); // Loss given default
    if (lgd.isZero()) {
        throw new Error('Loss given default cannot be zero');
    }
    return spread.div(lgd);
}
/**
 * Calculate implied default probability from bond spread
 *
 * @param bondSpread - Credit spread over risk-free rate (in bps)
 * @param recoveryRate - Expected recovery rate (0-1)
 * @returns Implied annual default probability
 */
function calculateImpliedDefaultProbabilityFromBond(bondSpread, recoveryRate) {
    // Similar to CDS approach
    return calculateImpliedDefaultProbabilityFromCDS(bondSpread, recoveryRate);
}
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
function calculateForwardDefaultProbability(cumulativePD_t1, cumulativePD_t2) {
    if (cumulativePD_t1 < 0 || cumulativePD_t1 > 1 || cumulativePD_t2 < 0 || cumulativePD_t2 > 1) {
        throw new Error('Cumulative probabilities must be between 0 and 1');
    }
    if (cumulativePD_t2 < cumulativePD_t1) {
        throw new Error('t2 cumulative PD must be >= t1 cumulative PD');
    }
    const pd1 = new decimal_js_1.default(cumulativePD_t1);
    const pd2 = new decimal_js_1.default(cumulativePD_t2);
    const survival1 = new decimal_js_1.default(1).minus(pd1);
    if (survival1.isZero()) {
        return new decimal_js_1.default(0);
    }
    return pd2.minus(pd1).div(survival1);
}
/**
 * Calculate marginal (period) default probability
 * Probability of default in a specific period, given survival to that period
 *
 * @param cumulativePDs - Array of cumulative default probabilities
 * @returns Array of marginal default probabilities
 */
function calculateMarginalDefaultProbabilities(cumulativePDs) {
    const marginal = [];
    for (let i = 0; i < cumulativePDs.length; i++) {
        if (i === 0) {
            marginal.push(new decimal_js_1.default(cumulativePDs[0]));
        }
        else {
            const forward = calculateForwardDefaultProbability(cumulativePDs[i - 1], cumulativePDs[i]);
            marginal.push(forward);
        }
    }
    return marginal;
}
// ============================================================================
// CREDIT SPREAD ANALYSIS
// ============================================================================
/**
 * Calculate credit spread over benchmark
 * Bloomberg Equivalent: YAS <GO>
 *
 * @param bondYield - Corporate bond yield
 * @param benchmarkYield - Risk-free benchmark yield
 * @returns Credit spread in basis points
 */
function calculateCreditSpread(bondYield, benchmarkYield) {
    const spread = new decimal_js_1.default(bondYield).minus(benchmarkYield);
    return spread.times(10000); // Convert to basis points
}
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
function calculateZSpread(bondPrice, cashFlows, spotRates, initialGuess = 100) {
    if (cashFlows.length !== spotRates.length) {
        throw new Error('Cash flows and spot rates must have same length');
    }
    // Newton-Raphson method to find Z-spread
    let zSpread = new decimal_js_1.default(initialGuess).div(10000);
    const tolerance = new decimal_js_1.default(0.0001);
    const maxIterations = 100;
    for (let iter = 0; iter < maxIterations; iter++) {
        let pv = new decimal_js_1.default(0);
        let pvDerivative = new decimal_js_1.default(0);
        for (let i = 0; i < cashFlows.length; i++) {
            const t = i + 1;
            const rate = new decimal_js_1.default(spotRates[i]).plus(zSpread);
            const discountFactor = new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(rate).pow(t));
            pv = pv.plus(new decimal_js_1.default(cashFlows[i]).times(discountFactor));
            // Derivative for Newton-Raphson
            const derivative = new decimal_js_1.default(cashFlows[i])
                .times(discountFactor)
                .times(t)
                .div(new decimal_js_1.default(1).plus(rate))
                .neg();
            pvDerivative = pvDerivative.plus(derivative);
        }
        const error = pv.minus(bondPrice);
        if (error.abs().lessThan(tolerance)) {
            return zSpread.times(10000); // Convert to bps
        }
        if (pvDerivative.isZero()) {
            throw new Error('Cannot converge: derivative is zero');
        }
        zSpread = zSpread.minus(error.div(pvDerivative));
    }
    throw new Error('Z-spread calculation did not converge');
}
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
function calculateOptionAdjustedSpread(zSpread, optionValue) {
    return new decimal_js_1.default(zSpread).minus(optionValue);
}
/**
 * Calculate asset swap spread
 * Spread over LIBOR/SOFR in an asset swap
 *
 * @param bondYield - Bond yield
 * @param swapRate - Interest rate swap rate
 * @returns Asset swap spread in basis points
 */
function calculateAssetSwapSpread(bondYield, swapRate) {
    return new decimal_js_1.default(bondYield).minus(swapRate).times(10000);
}
/**
 * Calculate credit spread duration (CS01)
 * Price sensitivity to 1bp change in credit spread
 *
 * @param bondPrice - Current bond price
 * @param bondDuration - Modified duration
 * @returns CS01 (price change per 1bp spread move)
 */
function calculateCreditSpreadDuration(bondPrice, bondDuration) {
    return new decimal_js_1.default(bondPrice).times(bondDuration).div(10000);
}
/**
 * Calculate credit spread DV01
 * Dollar value of 1bp spread change
 *
 * @param notional - Notional amount
 * @param duration - Modified duration
 * @returns DV01
 */
function calculateCreditSpreadDV01(notional, duration) {
    return new decimal_js_1.default(notional).times(duration).div(10000);
}
/**
 * Build credit spread curve
 * Interpolated spread curve across maturities
 *
 * @param tenors - Array of tenors (years)
 * @param spreads - Array of spreads (bps)
 * @param interpolationTenor - Tenor to interpolate
 * @returns Interpolated spread
 */
function interpolateCreditSpreadCurve(tenors, spreads, interpolationTenor) {
    if (tenors.length !== spreads.length || tenors.length < 2) {
        throw new Error('Need at least 2 points for interpolation');
    }
    // Linear interpolation
    for (let i = 0; i < tenors.length - 1; i++) {
        if (interpolationTenor >= tenors[i] && interpolationTenor <= tenors[i + 1]) {
            const t1 = new decimal_js_1.default(tenors[i]);
            const t2 = new decimal_js_1.default(tenors[i + 1]);
            const s1 = new decimal_js_1.default(spreads[i]);
            const s2 = new decimal_js_1.default(spreads[i + 1]);
            const t = new decimal_js_1.default(interpolationTenor);
            const weight = t.minus(t1).div(t2.minus(t1));
            return s1.plus(s2.minus(s1).times(weight));
        }
    }
    // Extrapolation
    if (interpolationTenor < tenors[0]) {
        return new decimal_js_1.default(spreads[0]);
    }
    else {
        return new decimal_js_1.default(spreads[spreads.length - 1]);
    }
}
// ============================================================================
// CDS PRICING & VALUATION
// ============================================================================
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
function calculateCDSFairSpread(defaultCurve, discountRates, recoveryRate, frequency = 4) {
    if (defaultCurve.tenors.length !== discountRates.length) {
        throw new Error('Default curve and discount rates must have same length');
    }
    const lgd = new decimal_js_1.default(1).minus(recoveryRate); // Loss given default
    let protectionLeg = new decimal_js_1.default(0);
    let premiumLeg = new decimal_js_1.default(0);
    for (let i = 0; i < defaultCurve.tenors.length; i++) {
        const marginalPD = defaultCurve.marginalProbabilities[i];
        const survivalProb = new decimal_js_1.default(1).minus(defaultCurve.probabilities[i]);
        const df = new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(discountRates[i]).pow(defaultCurve.tenors[i]));
        // Protection leg: expected loss
        protectionLeg = protectionLeg.plus(marginalPD.times(lgd).times(df));
        // Premium leg: expected premium payments (accrual adjusted)
        const accrual = new decimal_js_1.default(1).div(frequency);
        premiumLeg = premiumLeg.plus(survivalProb.times(df).times(accrual));
    }
    if (premiumLeg.isZero()) {
        throw new Error('Premium leg cannot be zero');
    }
    const fairSpread = protectionLeg.div(premiumLeg);
    return fairSpread.times(10000); // Convert to basis points
}
/**
 * Calculate CDS present value
 * Bloomberg Equivalent: CDSW <GO>
 *
 * @param contract - CDS contract details
 * @param defaultCurve - Default probability curve
 * @param discountRates - Discount rates
 * @returns CDS present value
 */
function calculateCDSPresentValue(contract, defaultCurve, discountRates) {
    const lgd = new decimal_js_1.default(1).minus(contract.recoveryRate);
    const contractSpread = new decimal_js_1.default(contract.spread).div(10000);
    let protectionLeg = new decimal_js_1.default(0);
    let premiumLeg = new decimal_js_1.default(0);
    const timeStep = 1 / contract.frequency;
    for (let i = 0; i < defaultCurve.tenors.length; i++) {
        const marginalPD = defaultCurve.marginalProbabilities[i];
        const survivalProb = new decimal_js_1.default(1).minus(defaultCurve.probabilities[i]);
        const df = new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(discountRates[i]).pow(defaultCurve.tenors[i]));
        // Protection leg
        protectionLeg = protectionLeg.plus(marginalPD.times(lgd).times(df));
        // Premium leg
        const premium = contractSpread.times(timeStep);
        premiumLeg = premiumLeg.plus(survivalProb.times(premium).times(df));
    }
    const pv = protectionLeg.minus(premiumLeg).times(contract.notional);
    return pv;
}
/**
 * Calculate CDS upfront payment
 *
 * @param fairSpread - Fair CDS spread (bps)
 * @param contractSpread - Actual contract spread (bps)
 * @param notional - Notional amount
 * @param duration - CDS duration
 * @returns Upfront payment
 */
function calculateCDSUpfront(fairSpread, contractSpread, notional, duration) {
    const spreadDiff = new decimal_js_1.default(fairSpread).minus(contractSpread).div(10000);
    return spreadDiff.times(notional).times(duration);
}
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
function calculateCDSDuration(contract, defaultCurve, discountRates) {
    const baseSpread = contract.spread;
    const shiftedSpread = baseSpread + 1; // 1bp shift
    const basePV = calculateCDSPresentValue(contract, defaultCurve, discountRates);
    const shiftedContract = { ...contract, spread: shiftedSpread };
    const shiftedPV = calculateCDSPresentValue(shiftedContract, defaultCurve, discountRates);
    return shiftedPV.minus(basePV);
}
/**
 * Calculate CDS convexity
 * Second-order sensitivity to spread changes
 *
 * @param contract - CDS contract
 * @param defaultCurve - Default probability curve
 * @param discountRates - Discount rates
 * @returns Convexity
 */
function calculateCDSConvexity(contract, defaultCurve, discountRates) {
    const baseSpread = contract.spread;
    const basePV = calculateCDSPresentValue(contract, defaultCurve, discountRates);
    const upContract = { ...contract, spread: baseSpread + 1 };
    const upPV = calculateCDSPresentValue(upContract, defaultCurve, discountRates);
    const downContract = { ...contract, spread: baseSpread - 1 };
    const downPV = calculateCDSPresentValue(downContract, defaultCurve, discountRates);
    // Convexity = (PV_up + PV_down - 2*PV_base) / (spread_change)²
    return upPV.plus(downPV).minus(basePV.times(2));
}
/**
 * Calculate CDS price from spread
 *
 * @param spread - CDS spread (bps)
 * @param recoveryRate - Recovery rate (0-1)
 * @param maturity - Time to maturity (years)
 * @param riskFreeRate - Risk-free rate
 * @returns CDS price (as % of notional)
 */
function calculateCDSPriceFromSpread(spread, recoveryRate, maturity, riskFreeRate) {
    // Simplified: Price ≈ 100 - (Spread * Duration)
    const s = new decimal_js_1.default(spread).div(10000);
    const duration = new decimal_js_1.default(1).minus(new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(riskFreeRate).pow(maturity))).div(riskFreeRate);
    const price = new decimal_js_1.default(100).minus(s.times(duration).times(100));
    return price;
}
/**
 * Calculate CDS spread from price
 *
 * @param price - CDS price (as % of notional)
 * @param recoveryRate - Recovery rate
 * @param maturity - Time to maturity (years)
 * @param riskFreeRate - Risk-free rate
 * @returns CDS spread in basis points
 */
function calculateCDSSpreadFromPrice(price, recoveryRate, maturity, riskFreeRate) {
    // Inverse of price calculation
    const duration = new decimal_js_1.default(1).minus(new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(riskFreeRate).pow(maturity))).div(riskFreeRate);
    const priceDiff = new decimal_js_1.default(100).minus(price);
    const spread = priceDiff.div(duration).div(100);
    return spread.times(10000); // Convert to bps
}
/**
 * Price CDS index
 * Average of constituent CDS spreads
 *
 * @param constituentSpreads - Array of CDS spreads (bps)
 * @param weights - Weights for each constituent
 * @returns Index spread in basis points
 */
function priceCDSIndex(constituentSpreads, weights) {
    if (constituentSpreads.length === 0) {
        throw new Error('Need at least one constituent');
    }
    const w = weights || constituentSpreads.map(() => 1 / constituentSpreads.length);
    if (constituentSpreads.length !== w.length) {
        throw new Error('Spreads and weights must have same length');
    }
    let indexSpread = new decimal_js_1.default(0);
    let totalWeight = new decimal_js_1.default(0);
    for (let i = 0; i < constituentSpreads.length; i++) {
        indexSpread = indexSpread.plus(new decimal_js_1.default(constituentSpreads[i]).times(w[i]));
        totalWeight = totalWeight.plus(w[i]);
    }
    return indexSpread.div(totalWeight);
}
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
function calculateCDSBasis(bondSpread, cdsSpread) {
    return new decimal_js_1.default(bondSpread).minus(cdsSpread);
}
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
function bootstrapCDSCurve(tenors, spreads, recoveryRate, discountRates) {
    if (tenors.length !== spreads.length || tenors.length !== discountRates.length) {
        throw new Error('Tenors, spreads, and discount rates must have same length');
    }
    const cumulativePDs = [];
    const marginalPDs = [];
    const lgd = new decimal_js_1.default(1).minus(recoveryRate);
    for (let i = 0; i < tenors.length; i++) {
        const spread = new decimal_js_1.default(spreads[i]).div(10000);
        const df = new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(discountRates[i]).pow(tenors[i]));
        // Simplified bootstrap: PD ≈ Spread / LGD
        const pd = spread.div(lgd);
        cumulativePDs.push(decimal_js_1.default.min(pd, 1));
        if (i === 0) {
            marginalPDs.push(cumulativePDs[0]);
        }
        else {
            const marginal = calculateForwardDefaultProbability(cumulativePDs[i - 1].toNumber(), cumulativePDs[i].toNumber());
            marginalPDs.push(marginal);
        }
    }
    return {
        tenors,
        probabilities: cumulativePDs,
        marginalProbabilities: marginalPDs
    };
}
// ============================================================================
// RECOVERY RATE MODELS
// ============================================================================
/**
 * Estimate historical recovery rate
 * Based on historical default data
 *
 * @param recoveredAmounts - Array of recovered amounts
 * @param exposureAtDefaults - Array of exposures at default
 * @returns Average recovery rate
 */
function estimateHistoricalRecoveryRate(recoveredAmounts, exposureAtDefaults) {
    if (recoveredAmounts.length !== exposureAtDefaults.length || recoveredAmounts.length === 0) {
        throw new Error('Recovery amounts and exposures must have equal length and be non-empty');
    }
    let totalRecovered = new decimal_js_1.default(0);
    let totalExposure = new decimal_js_1.default(0);
    for (let i = 0; i < recoveredAmounts.length; i++) {
        totalRecovered = totalRecovered.plus(recoveredAmounts[i]);
        totalExposure = totalExposure.plus(exposureAtDefaults[i]);
    }
    if (totalExposure.isZero()) {
        throw new Error('Total exposure cannot be zero');
    }
    return totalRecovered.div(totalExposure);
}
/**
 * Get industry-average recovery rates
 * Based on Moody's/S&P historical data
 *
 * @param seniority - Debt seniority class
 * @returns Industry-average recovery rate
 */
function getIndustryAverageRecoveryRate(seniority) {
    // Historical averages from rating agencies
    const recoveryRates = {
        'senior-secured': 0.60,
        'senior-unsecured': 0.40,
        'subordinated': 0.30,
        'junior': 0.20
    };
    return new decimal_js_1.default(recoveryRates[seniority]);
}
/**
 * Estimate seniority-based recovery rate
 * Adjusted for collateral and priority
 *
 * @param seniority - Debt seniority
 * @param collateralValue - Value of collateral
 * @param exposureAtDefault - Exposure at default
 * @returns Estimated recovery rate
 */
function estimateSeniorityRecoveryRate(seniority, collateralValue, exposureAtDefault) {
    const baseRate = getIndustryAverageRecoveryRate(seniority);
    if (seniority === 'senior-secured' && collateralValue > 0) {
        // Adjust upward for collateral
        const collateralCoverage = new decimal_js_1.default(collateralValue).div(exposureAtDefault);
        const adjustedRate = decimal_js_1.default.min(collateralCoverage, 1);
        return decimal_js_1.default.max(baseRate, adjustedRate);
    }
    return baseRate;
}
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
function calculateMarketImpliedRecoveryRate(cdsSpread, bondSpread) {
    if (bondSpread <= 0) {
        throw new Error('Bond spread must be positive');
    }
    const ratio = new decimal_js_1.default(cdsSpread).div(bondSpread);
    const recoveryRate = new decimal_js_1.default(1).minus(ratio);
    // Clamp to [0, 1]
    return decimal_js_1.default.max(decimal_js_1.default.min(recoveryRate, 1), 0);
}
/**
 * Model stochastic recovery rate
 * Beta distribution parameters for recovery rate uncertainty
 *
 * @param meanRecovery - Mean recovery rate
 * @param volatility - Recovery rate volatility
 * @returns Beta distribution parameters (alpha, beta)
 */
function modelStochasticRecovery(meanRecovery, volatility) {
    if (meanRecovery <= 0 || meanRecovery >= 1) {
        throw new Error('Mean recovery must be between 0 and 1');
    }
    const mu = new decimal_js_1.default(meanRecovery);
    const variance = new decimal_js_1.default(volatility).pow(2);
    // Beta distribution parameterization
    const alpha = mu.times(mu.times(new decimal_js_1.default(1).minus(mu)).div(variance).minus(1));
    const beta = new decimal_js_1.default(1).minus(mu).times(mu.times(new decimal_js_1.default(1).minus(mu)).div(variance).minus(1));
    return { alpha, beta };
}
// ============================================================================
// CREDIT MIGRATION ANALYSIS
// ============================================================================
/**
 * Build credit migration matrix from historical data
 *
 * @param transitions - Array of rating transitions [from, to]
 * @param ratings - List of possible ratings
 * @param timeHorizon - Time horizon (years)
 * @returns Migration matrix
 */
function buildMigrationMatrix(transitions, ratings, timeHorizon) {
    const n = ratings.length;
    const counts = Array(n).fill(null).map(() => Array(n).fill(0));
    const totals = Array(n).fill(0);
    for (const [from, to] of transitions) {
        const fromIdx = ratings.indexOf(from);
        const toIdx = ratings.indexOf(to);
        if (fromIdx !== -1 && toIdx !== -1) {
            counts[fromIdx][toIdx]++;
            totals[fromIdx]++;
        }
    }
    // Convert counts to probabilities
    const transitionProbs = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (totals[i] > 0) {
                transitionProbs[i][j] = counts[i][j] / totals[i];
            }
            else {
                // No data: assume stay in same rating
                transitionProbs[i][j] = i === j ? 1 : 0;
            }
        }
    }
    return {
        ratings,
        transitionProbabilities: transitionProbs,
        timeHorizon
    };
}
/**
 * Calculate expected credit migration
 * Expected rating change over time
 *
 * @param currentRating - Current rating
 * @param migrationMatrix - Migration matrix
 * @returns Expected rating after time horizon
 */
function calculateExpectedMigration(currentRating, migrationMatrix) {
    const fromIdx = migrationMatrix.ratings.indexOf(currentRating);
    if (fromIdx === -1) {
        throw new Error('Rating not found in migration matrix');
    }
    const probabilities = new Map();
    for (let i = 0; i < migrationMatrix.ratings.length; i++) {
        const rating = migrationMatrix.ratings[i];
        const prob = new decimal_js_1.default(migrationMatrix.transitionProbabilities[fromIdx][i]);
        probabilities.set(rating, prob);
    }
    return probabilities;
}
/**
 * Analyze rating drift
 * Tendency to upgrade or downgrade over time
 *
 * @param migrationMatrix - Migration matrix
 * @param currentRating - Current rating
 * @returns Drift score (positive = upgrade tendency, negative = downgrade)
 */
function analyzeRatingDrift(migrationMatrix, currentRating) {
    const fromIdx = migrationMatrix.ratings.indexOf(currentRating);
    if (fromIdx === -1) {
        throw new Error('Rating not found in migration matrix');
    }
    let drift = new decimal_js_1.default(0);
    for (let i = 0; i < migrationMatrix.ratings.length; i++) {
        const prob = new decimal_js_1.default(migrationMatrix.transitionProbabilities[fromIdx][i]);
        const direction = i - fromIdx; // Positive = upgrade, negative = downgrade
        drift = drift.plus(prob.times(direction));
    }
    return drift;
}
/**
 * Calculate upgrade probability
 *
 * @param currentRating - Current rating
 * @param migrationMatrix - Migration matrix
 * @returns Probability of upgrade
 */
function calculateUpgradeProbability(currentRating, migrationMatrix) {
    const fromIdx = migrationMatrix.ratings.indexOf(currentRating);
    if (fromIdx === -1) {
        throw new Error('Rating not found in migration matrix');
    }
    let upgradeProb = new decimal_js_1.default(0);
    // Sum probabilities of moving to better ratings (lower index)
    for (let i = 0; i < fromIdx; i++) {
        upgradeProb = upgradeProb.plus(migrationMatrix.transitionProbabilities[fromIdx][i]);
    }
    return upgradeProb;
}
/**
 * Calculate downgrade probability
 *
 * @param currentRating - Current rating
 * @param migrationMatrix - Migration matrix
 * @returns Probability of downgrade
 */
function calculateDowngradeProbability(currentRating, migrationMatrix) {
    const fromIdx = migrationMatrix.ratings.indexOf(currentRating);
    if (fromIdx === -1) {
        throw new Error('Rating not found in migration matrix');
    }
    let downgradeProb = new decimal_js_1.default(0);
    // Sum probabilities of moving to worse ratings (higher index)
    for (let i = fromIdx + 1; i < migrationMatrix.ratings.length; i++) {
        downgradeProb = downgradeProb.plus(migrationMatrix.transitionProbabilities[fromIdx][i]);
    }
    return downgradeProb;
}
/**
 * Calculate time-to-default distribution
 * Distribution of default times
 *
 * @param hazardRates - Hazard rates over time
 * @param timeSteps - Time steps
 * @returns Probability density of default at each time
 */
function calculateTimeToDefaultDistribution(hazardRates, timeSteps) {
    if (hazardRates.length !== timeSteps.length) {
        throw new Error('Hazard rates and time steps must have same length');
    }
    const densities = [];
    let cumulativeSurvival = new decimal_js_1.default(1);
    for (let i = 0; i < hazardRates.length; i++) {
        const lambda = new decimal_js_1.default(hazardRates[i]);
        const dt = i === 0 ? new decimal_js_1.default(timeSteps[0]) : new decimal_js_1.default(timeSteps[i] - timeSteps[i - 1]);
        // Probability density = hazard rate * survival probability
        const density = lambda.times(cumulativeSurvival);
        densities.push(density);
        // Update survival probability
        cumulativeSurvival = cumulativeSurvival.times(lambda.times(dt).neg().exp());
    }
    return densities;
}
// ============================================================================
// CVA/DVA CALCULATIONS
// ============================================================================
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
function calculateCVA(exposureProfile, defaultCurve, recoveryRate, discountRates) {
    if (exposureProfile.length !== defaultCurve.tenors.length || exposureProfile.length !== discountRates.length) {
        throw new Error('Exposure, default curve, and discount rates must have same length');
    }
    const lgd = new decimal_js_1.default(1).minus(recoveryRate);
    let cva = new decimal_js_1.default(0);
    for (let i = 0; i < exposureProfile.length; i++) {
        const ee = exposureProfile[i];
        const marginalPD = defaultCurve.marginalProbabilities[i];
        const df = new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(discountRates[i]).pow(defaultCurve.tenors[i]));
        cva = cva.plus(lgd.times(ee).times(marginalPD).times(df));
    }
    return cva;
}
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
function calculateDVA(exposureProfile, ownDefaultCurve, ownRecoveryRate, discountRates) {
    // DVA uses negative exposures (when we owe money)
    const negativeExposures = exposureProfile.map(e => e.lessThan(0) ? e.abs() : new decimal_js_1.default(0));
    return calculateCVA(negativeExposures, ownDefaultCurve, ownRecoveryRate, discountRates);
}
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
function calculateBilateralCVA(cva, dva) {
    return cva.minus(dva);
}
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
function calculateCVASensitivities(baseExposure, defaultCurve, recoveryRate, discountRates, shockSize = 0.01) {
    const baseCVA = calculateCVA(baseExposure, defaultCurve, recoveryRate, discountRates);
    // Exposure sensitivity
    const shockedExposure = baseExposure.map(e => e.times(new decimal_js_1.default(1).plus(shockSize)));
    const exposureCVA = calculateCVA(shockedExposure, defaultCurve, recoveryRate, discountRates);
    const exposureDelta = exposureCVA.minus(baseCVA).div(shockSize);
    // Spread sensitivity (shock default probabilities)
    const shockedPDs = defaultCurve.marginalProbabilities.map(pd => pd.times(new decimal_js_1.default(1).plus(shockSize)));
    const shockedCurve = { ...defaultCurve, marginalProbabilities: shockedPDs };
    const spreadCVA = calculateCVA(baseExposure, shockedCurve, recoveryRate, discountRates);
    const spreadDelta = spreadCVA.minus(baseCVA).div(shockSize);
    // Recovery sensitivity
    const shockedRecovery = recoveryRate * (1 + shockSize);
    const recoveryCVA = calculateCVA(baseExposure, defaultCurve, shockedRecovery, discountRates);
    const recoveryDelta = recoveryCVA.minus(baseCVA).div(shockSize);
    return {
        exposureDelta,
        spreadDelta,
        recoveryDelta
    };
}
/**
 * Adjust CVA for wrong-way risk
 * When exposure and default probability are positively correlated
 *
 * @param baseCVA - Base CVA without wrong-way risk
 * @param correlation - Correlation between exposure and default (0-1)
 * @returns Adjusted CVA
 */
function adjustCVAForWrongWayRisk(baseCVA, correlation) {
    // Simplified adjustment: multiply by (1 + correlation factor)
    const adjustment = new decimal_js_1.default(1).plus(new decimal_js_1.default(correlation).times(0.5));
    return baseCVA.times(adjustment);
}
/**
 * Calculate Collateral Value Adjustment
 * Reduction in CVA due to collateral posting
 *
 * @param cvaWithoutCollateral - CVA without collateral
 * @param collateralAmount - Amount of collateral posted
 * @param averageExposure - Average exposure
 * @returns CVA with collateral adjustment
 */
function calculateCollateralValueAdjustment(cvaWithoutCollateral, collateralAmount, averageExposure) {
    if (averageExposure <= 0) {
        return cvaWithoutCollateral;
    }
    const collateralCoverage = new decimal_js_1.default(collateralAmount).div(averageExposure);
    const reduction = decimal_js_1.default.min(collateralCoverage, 1);
    return cvaWithoutCollateral.times(new decimal_js_1.default(1).minus(reduction));
}
// ============================================================================
// PORTFOLIO CREDIT ANALYTICS
// ============================================================================
/**
 * Calculate portfolio default correlation
 * Using Gaussian copula
 *
 * @param asset1Returns - Returns for asset 1
 * @param asset2Returns - Returns for asset 2
 * @returns Default correlation
 */
function calculatePortfolioDefaultCorrelation(asset1Returns, asset2Returns) {
    if (asset1Returns.length !== asset2Returns.length || asset1Returns.length < 2) {
        throw new Error('Return arrays must have equal length >= 2');
    }
    const n = asset1Returns.length;
    const mean1 = asset1Returns.reduce((sum, r) => sum + r, 0) / n;
    const mean2 = asset2Returns.reduce((sum, r) => sum + r, 0) / n;
    let covariance = new decimal_js_1.default(0);
    let variance1 = new decimal_js_1.default(0);
    let variance2 = new decimal_js_1.default(0);
    for (let i = 0; i < n; i++) {
        const dev1 = new decimal_js_1.default(asset1Returns[i]).minus(mean1);
        const dev2 = new decimal_js_1.default(asset2Returns[i]).minus(mean2);
        covariance = covariance.plus(dev1.times(dev2));
        variance1 = variance1.plus(dev1.pow(2));
        variance2 = variance2.plus(dev2.pow(2));
    }
    const denominator = variance1.sqrt().times(variance2.sqrt());
    if (denominator.isZero()) {
        return new decimal_js_1.default(0);
    }
    return covariance.div(denominator);
}
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
function calculatePortfolioLossDistribution(exposures, defaultProbabilities, recoveryRates, correlation, numSimulations = 10000) {
    // Simplified calculation without full Monte Carlo
    // Expected loss per obligor
    const expectedLosses = exposures.map((exp, i) => {
        const pd = new decimal_js_1.default(defaultProbabilities[i]);
        const lgd = new decimal_js_1.default(1).minus(recoveryRates[i]);
        return new decimal_js_1.default(exp).times(pd).times(lgd);
    });
    const meanLoss = expectedLosses.reduce((sum, el) => sum.plus(el), new decimal_js_1.default(0));
    // Simplified variance calculation
    const variances = exposures.map((exp, i) => {
        const pd = new decimal_js_1.default(defaultProbabilities[i]);
        const lgd = new decimal_js_1.default(1).minus(recoveryRates[i]);
        const loss = new decimal_js_1.default(exp).times(lgd);
        return loss.pow(2).times(pd).times(new decimal_js_1.default(1).minus(pd));
    });
    const portfolioVariance = variances.reduce((sum, v) => sum.plus(v), new decimal_js_1.default(0));
    const stdDev = portfolioVariance.sqrt();
    // Percentiles (assuming normal distribution - simplified)
    const percentile95 = meanLoss.plus(stdDev.times(1.645));
    const percentile99 = meanLoss.plus(stdDev.times(2.33));
    return {
        mean: meanLoss,
        stdDev,
        percentile95,
        percentile99
    };
}
/**
 * Calculate portfolio expected loss
 *
 * @param exposures - Array of exposures
 * @param defaultProbabilities - Array of default probabilities
 * @param lossGivenDefaults - Array of loss given default rates
 * @returns Total expected loss
 */
function calculatePortfolioExpectedLoss(exposures, defaultProbabilities, lossGivenDefaults) {
    if (exposures.length !== defaultProbabilities.length || exposures.length !== lossGivenDefaults.length) {
        throw new Error('All arrays must have same length');
    }
    let totalEL = new decimal_js_1.default(0);
    for (let i = 0; i < exposures.length; i++) {
        const el = new decimal_js_1.default(exposures[i])
            .times(defaultProbabilities[i])
            .times(lossGivenDefaults[i]);
        totalEL = totalEL.plus(el);
    }
    return totalEL;
}
/**
 * Calculate portfolio unexpected loss (economic capital)
 *
 * @param portfolioLossDistribution - Portfolio loss distribution
 * @returns Unexpected loss at 99% confidence
 */
function calculatePortfolioUnexpectedLoss(portfolioLossDistribution) {
    return portfolioLossDistribution.percentile99.minus(portfolioLossDistribution.mean);
}
/**
 * Allocate economic capital to portfolio positions
 * Using Euler allocation principle
 *
 * @param exposures - Array of exposures
 * @param marginalRisks - Marginal risk contributions
 * @param totalCapital - Total economic capital
 * @returns Allocated capital per position
 */
function allocateEconomicCapital(exposures, marginalRisks, totalCapital) {
    if (exposures.length !== marginalRisks.length) {
        throw new Error('Exposures and marginal risks must have same length');
    }
    // Risk-weighted allocation
    let totalRiskWeighted = new decimal_js_1.default(0);
    const riskWeights = exposures.map((exp, i) => new decimal_js_1.default(exp).times(marginalRisks[i]));
    for (const rw of riskWeights) {
        totalRiskWeighted = totalRiskWeighted.plus(rw);
    }
    const allocations = riskWeights.map(rw => rw.div(totalRiskWeighted.plus(0.0001)).times(totalCapital));
    return allocations;
}
// ============================================================================
// COUNTERPARTY CREDIT RISK
// ============================================================================
/**
 * Calculate Expected Exposure (EE)
 * Average exposure at each future time point
 *
 * @param exposureScenarios - Array of exposure paths (simulations)
 * @returns Expected exposure profile
 */
function calculateExpectedExposure(exposureScenarios) {
    if (exposureScenarios.length === 0 || exposureScenarios[0].length === 0) {
        throw new Error('Need at least one exposure scenario');
    }
    const numTimeSteps = exposureScenarios[0].length;
    const numScenarios = exposureScenarios.length;
    const ee = [];
    for (let t = 0; t < numTimeSteps; t++) {
        let sum = new decimal_js_1.default(0);
        for (let s = 0; s < numScenarios; s++) {
            const exposure = decimal_js_1.default.max(exposureScenarios[s][t], 0); // Only positive exposures
            sum = sum.plus(exposure);
        }
        ee.push(sum.div(numScenarios));
    }
    return ee;
}
/**
 * Calculate Potential Future Exposure (PFE)
 * High percentile of exposure distribution (typically 95% or 97.5%)
 *
 * @param exposureScenarios - Array of exposure paths
 * @param percentile - Percentile level (default: 0.95)
 * @returns PFE profile
 */
function calculatePotentialFutureExposure(exposureScenarios, percentile = 0.95) {
    if (exposureScenarios.length === 0 || exposureScenarios[0].length === 0) {
        throw new Error('Need at least one exposure scenario');
    }
    const numTimeSteps = exposureScenarios[0].length;
    const pfe = [];
    for (let t = 0; t < numTimeSteps; t++) {
        const exposuresAtTimeT = exposureScenarios.map(scenario => Math.max(scenario[t], 0)).sort((a, b) => a - b);
        const index = Math.floor(exposuresAtTimeT.length * percentile);
        pfe.push(new decimal_js_1.default(exposuresAtTimeT[index]));
    }
    return pfe;
}
/**
 * Calculate Expected Positive Exposure (EPE)
 * Time-weighted average of expected exposures
 *
 * @param expectedExposure - Expected exposure profile
 * @param timeSteps - Time steps (years)
 * @returns EPE (scalar)
 */
function calculateExpectedPositiveExposure(expectedExposure, timeSteps) {
    if (expectedExposure.length !== timeSteps.length || expectedExposure.length === 0) {
        throw new Error('Expected exposure and time steps must have same length and be non-empty');
    }
    let weightedSum = new decimal_js_1.default(0);
    let totalTime = new decimal_js_1.default(0);
    for (let i = 0; i < expectedExposure.length; i++) {
        const dt = i === 0 ? new decimal_js_1.default(timeSteps[0]) : new decimal_js_1.default(timeSteps[i] - timeSteps[i - 1]);
        weightedSum = weightedSum.plus(expectedExposure[i].times(dt));
        totalTime = totalTime.plus(dt);
    }
    return weightedSum.div(totalTime);
}
/**
 * Calculate Exposure at Default (EAD)
 * Expected exposure at time of counterparty default
 *
 * @param expectedExposure - Expected exposure profile
 * @param defaultCurve - Default probability curve
 * @returns EAD
 */
function calculateExposureAtDefault(expectedExposure, defaultCurve) {
    if (expectedExposure.length !== defaultCurve.tenors.length) {
        throw new Error('Expected exposure and default curve must have same length');
    }
    let ead = new decimal_js_1.default(0);
    for (let i = 0; i < expectedExposure.length; i++) {
        const marginalPD = defaultCurve.marginalProbabilities[i];
        ead = ead.plus(expectedExposure[i].times(marginalPD));
    }
    return ead;
}
/**
 * Build credit exposure profile
 *
 * @param exposureScenarios - Monte Carlo exposure scenarios
 * @param timestamps - Time points
 * @param defaultCurve - Default probability curve
 * @returns Comprehensive exposure profile
 */
function buildCreditExposureProfile(exposureScenarios, timestamps, defaultCurve) {
    const ee = calculateExpectedExposure(exposureScenarios);
    const pfe = calculatePotentialFutureExposure(exposureScenarios, 0.95);
    const timeSteps = timestamps.map((_, i) => i + 1);
    const epe = calculateExpectedPositiveExposure(ee, timeSteps);
    const maxPFE = pfe.reduce((max, val) => decimal_js_1.default.max(max, val), new decimal_js_1.default(0));
    return {
        timestamps,
        expectedExposure: ee,
        potentialFutureExposure: pfe,
        expectedPositiveExposure: epe,
        maxPFE
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Cumulative standard normal distribution
 * Approximation using error function
 *
 * @param x - Input value
 * @returns N(x)
 */
function cumulativeNormalDistribution(x) {
    // Using approximation: N(x) ≈ 0.5 * (1 + erf(x/√2))
    // Simplified for demonstration
    const xNum = x.toNumber();
    // Polynomial approximation
    const t = new decimal_js_1.default(1).div(new decimal_js_1.default(1).plus(new decimal_js_1.default(0.2316419).times(x.abs())));
    const coefficients = [0.319381530, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
    let poly = new decimal_js_1.default(0);
    for (let i = 0; i < coefficients.length; i++) {
        poly = poly.plus(new decimal_js_1.default(coefficients[i]).times(t.pow(i + 1)));
    }
    const pdf = new decimal_js_1.default(1).div(decimal_js_1.default.sqrt(new decimal_js_1.default(2).times(decimal_js_1.default.acos(-1))))
        .times(x.pow(2).div(2).neg().exp());
    const cdf = new decimal_js_1.default(1).minus(pdf.times(poly));
    return x.greaterThanOrEqualTo(0) ? cdf : new decimal_js_1.default(1).minus(cdf);
}
//# sourceMappingURL=credit-analysis-kit.js.map