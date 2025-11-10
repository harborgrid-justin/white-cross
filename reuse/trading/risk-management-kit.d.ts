/**
 * LOC: TRADE-RISK-001
 * File: /reuse/trading/risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../math-utilities-kit.ts
 *   - ./portfolio-analytics-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend trading services
 *   - Risk management controllers
 *   - Compliance dashboards
 *   - Trading limit monitors
 */
/**
 * File: /reuse/trading/risk-management-kit.ts
 * Locator: WC-TRADE-RISK-001
 * Purpose: Comprehensive Risk Management & Analytics Utilities - Bloomberg Terminal-level risk system
 *
 * Upstream: Error handling, validation, mathematical utilities, portfolio analytics
 * Downstream: ../backend/*, Trading services, risk controllers, compliance dashboards, limit monitoring
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for market risk, credit risk, counterparty risk, operational risk, liquidity risk,
 * concentration risk, Greek calculations (Delta, Gamma, Vega, Theta, Rho), margin calculations, risk limits
 *
 * LLM Context: Enterprise-grade risk management system competing with Bloomberg Terminal RISK function.
 * Provides market risk metrics (VaR, CVaR, stress testing), credit risk assessment (PD, LGD, EAD), counterparty risk,
 * operational risk tracking, liquidity risk analysis, concentration metrics, option Greeks calculations, margin requirements,
 * risk limit monitoring, exposure tracking, and comprehensive risk reporting dashboards.
 */
import { Sequelize } from 'sequelize';
interface RiskMetrics {
    portfolioId: string;
    calculationDate: Date;
    marketRisk: MarketRiskMetrics;
    creditRisk: CreditRiskMetrics;
    operationalRisk: OperationalRiskMetrics;
    liquidityRisk: LiquidityRiskMetrics;
    concentrationRisk: ConcentrationRiskMetrics;
    aggregateRisk: AggregateRiskMetrics;
}
interface MarketRiskMetrics {
    valueAtRisk: number;
    conditionalVaR: number;
    expectedShortfall: number;
    volatility: number;
    beta: number;
    correlationRisk: number;
    stressTestLoss: number;
    scenarioLoss: number;
}
interface CreditRiskMetrics {
    totalExposure: number;
    expectedLoss: number;
    unexpectedLoss: number;
    creditVaR: number;
    defaultProbability: number;
    lossGivenDefault: number;
    exposureAtDefault: number;
    creditRating: string;
}
interface OperationalRiskMetrics {
    operationalVaR: number;
    lossFrequency: number;
    lossSeverity: number;
    expectedAnnualLoss: number;
    keyRiskIndicators: Array<{
        indicator: string;
        value: number;
        threshold: number;
        status: string;
    }>;
    incidentCount: number;
    controlEffectiveness: number;
}
interface LiquidityRiskMetrics {
    liquidityRatio: number;
    cashRatio: number;
    quickRatio: number;
    liquidityGap: number;
    fundingRatio: number;
    liquidityBuffer: number;
    timeToLiquidate: number;
    marketImpactCost: number;
}
interface ConcentrationRiskMetrics {
    herfindahlIndex: number;
    top5Concentration: number;
    top10Concentration: number;
    sectorConcentration: Array<{
        sector: string;
        exposure: number;
        percentage: number;
    }>;
    geographicConcentration: Array<{
        region: string;
        exposure: number;
        percentage: number;
    }>;
    counterpartyConcentration: Array<{
        counterparty: string;
        exposure: number;
        percentage: number;
    }>;
}
interface AggregateRiskMetrics {
    totalRiskCapital: number;
    riskAdjustedReturn: number;
    economicCapital: number;
    regulatoryCapital: number;
    capitalAdequacyRatio: number;
    leverageRatio: number;
    riskAppetite: string;
    riskUtilization: number;
}
interface GreekMetrics {
    securityId: string;
    optionType: 'CALL' | 'PUT';
    underlyingPrice: number;
    strikePrice: number;
    timeToExpiry: number;
    volatility: number;
    riskFreeRate: number;
    delta: number;
    gamma: number;
    vega: number;
    theta: number;
    rho: number;
    lambda: number;
    epsilon: number;
}
interface RiskLimit {
    limitId: string;
    limitType: 'VaR' | 'EXPOSURE' | 'CONCENTRATION' | 'LEVERAGE' | 'POSITION_SIZE' | 'DELTA' | 'VOLATILITY';
    limitName: string;
    limitValue: number;
    currentValue: number;
    utilization: number;
    warningThreshold: number;
    breachThreshold: number;
    status: 'NORMAL' | 'WARNING' | 'BREACH';
    scope: string;
    approver: string | null;
}
interface RiskReport {
    reportId: string;
    reportDate: Date;
    portfolioId: string;
    riskMetrics: RiskMetrics;
    limitBreaches: RiskLimit[];
    recommendations: string[];
    executiveSummary: string;
}
/**
 * Sequelize model for Risk Metrics with time series tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskMetrics model
 *
 * @example
 * ```typescript
 * const RiskMetrics = createRiskMetricsModel(sequelize);
 * const metrics = await RiskMetrics.create({
 *   portfolioId: 'PORT-001',
 *   valueAtRisk: 250000,
 *   creditExposure: 5000000
 * });
 * ```
 */
export declare const createRiskMetricsModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        portfolioId: string;
        calculationDate: Date;
        valueAtRisk: number;
        conditionalVaR: number;
        expectedShortfall: number;
        marketVolatility: number;
        creditExposure: number;
        creditVaR: number;
        operationalVaR: number;
        liquidityRatio: number;
        concentrationIndex: number;
        totalRiskCapital: number;
        capitalAdequacyRatio: number;
        limitBreaches: number;
        riskScore: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Margin Requirements with real-time tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MarginRequirement model
 *
 * @example
 * ```typescript
 * const MarginRequirement = createMarginRequirementModel(sequelize);
 * const margin = await MarginRequirement.create({
 *   accountId: 'ACC-001',
 *   portfolioId: 'PORT-001',
 *   initialMargin: 500000,
 *   maintenanceMargin: 350000
 * });
 * ```
 */
export declare const createMarginRequirementModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountId: string;
        portfolioId: string;
        calculationDate: Date;
        initialMargin: number;
        maintenanceMargin: number;
        variationMargin: number;
        totalMargin: number;
        cashCollateral: number;
        securitiesCollateral: number;
        availableMargin: number;
        marginUtilization: number;
        marginCall: boolean;
        marginCallAmount: number;
        marginCallDate: Date | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Risk Limits with monitoring and alerting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskLimit model
 *
 * @example
 * ```typescript
 * const RiskLimit = createRiskLimitModel(sequelize);
 * const limit = await RiskLimit.create({
 *   limitType: 'VaR',
 *   limitName: 'Portfolio VaR Limit',
 *   limitValue: 1000000,
 *   warningThreshold: 0.8
 * });
 * ```
 */
export declare const createRiskLimitModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        limitId: string;
        limitType: string;
        limitName: string;
        limitDescription: string | null;
        scope: string;
        scopeId: string;
        limitValue: number;
        currentValue: number;
        utilization: number;
        warningThreshold: number;
        breachThreshold: number;
        status: string;
        lastChecked: Date;
        lastBreach: Date | null;
        breachCount: number;
        approver: string | null;
        enabled: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Calculates market Value at Risk (VaR) using historical simulation.
 *
 * @param {number[]} returns - Historical returns
 * @param {number} confidenceLevel - Confidence level (0.95, 0.99)
 * @param {number} portfolioValue - Current portfolio value
 * @param {number} [timeHorizon=1] - Time horizon in days
 * @returns {Promise<number>} VaR in currency units
 *
 * @example
 * ```typescript
 * const var95 = await calculateMarketVaR(returns, 0.95, 10000000, 1);
 * console.log(`1-day 95% VaR: $${var95.toFixed(2)}`);
 * ```
 */
export declare const calculateMarketVaR: (returns: number[], confidenceLevel: number, portfolioValue: number, timeHorizon?: number) => Promise<number>;
/**
 * Calculates parametric VaR using variance-covariance method.
 *
 * @param {number} expectedReturn - Expected portfolio return
 * @param {number} volatility - Portfolio volatility
 * @param {number} confidenceLevel - Confidence level
 * @param {number} portfolioValue - Portfolio value
 * @param {number} [timeHorizon=1] - Time horizon in days
 * @returns {Promise<number>} Parametric VaR
 *
 * @example
 * ```typescript
 * const paramVaR = await calculateParametricVaR(0.08, 0.15, 0.99, 10000000, 1);
 * ```
 */
export declare const calculateParametricVaR: (expectedReturn: number, volatility: number, confidenceLevel: number, portfolioValue: number, timeHorizon?: number) => Promise<number>;
/**
 * Calculates incremental VaR for a new position.
 *
 * @param {number} portfolioVaR - Current portfolio VaR
 * @param {number} newPosition - Size of new position
 * @param {number} positionVolatility - Volatility of new position
 * @param {number} correlation - Correlation with portfolio
 * @returns {Promise<number>} Incremental VaR
 *
 * @example
 * ```typescript
 * const incVaR = await calculateIncrementalVaR(250000, 1000000, 0.20, 0.7);
 * console.log(`Adding position increases VaR by $${incVaR}`);
 * ```
 */
export declare const calculateIncrementalVaR: (portfolioVaR: number, newPosition: number, positionVolatility: number, correlation: number) => Promise<number>;
/**
 * Calculates component VaR (contribution of each position to portfolio VaR).
 *
 * @param {Array<{ securityId: string; value: number; beta: number }>} positions - Portfolio positions
 * @param {number} portfolioVaR - Portfolio VaR
 * @returns {Promise<Array<{ securityId: string; componentVaR: number; percentageContribution: number }>>} Component VaR breakdown
 *
 * @example
 * ```typescript
 * const compVaR = await calculateComponentVaR(positions, 250000);
 * compVaR.forEach(c => console.log(`${c.securityId}: ${c.percentageContribution}%`));
 * ```
 */
export declare const calculateComponentVaR: (positions: Array<{
    securityId: string;
    value: number;
    beta: number;
}>, portfolioVaR: number) => Promise<Array<{
    securityId: string;
    componentVaR: number;
    percentageContribution: number;
}>>;
/**
 * Performs VaR backtesting to validate model accuracy.
 *
 * @param {number[]} forecastedVaR - Historical VaR forecasts
 * @param {number[]} actualLosses - Actual portfolio losses
 * @param {number} confidenceLevel - Confidence level used
 * @returns {Promise<{ violations: number; violationRate: number; trafficLight: string; accurate: boolean }>} Backtest results
 *
 * @example
 * ```typescript
 * const backtest = await performVaRBacktesting(forecasts, actuals, 0.95);
 * console.log(`VaR violations: ${backtest.violations}, Status: ${backtest.trafficLight}`);
 * ```
 */
export declare const performVaRBacktesting: (forecastedVaR: number[], actualLosses: number[], confidenceLevel: number) => Promise<{
    violations: number;
    violationRate: number;
    trafficLight: string;
    accurate: boolean;
}>;
/**
 * Calculates Expected Tail Loss (ETL) / Expected Shortfall.
 *
 * @param {number[]} returns - Historical returns
 * @param {number} confidenceLevel - Confidence level
 * @param {number} portfolioValue - Portfolio value
 * @returns {Promise<number>} Expected Tail Loss
 *
 * @example
 * ```typescript
 * const etl = await calculateExpectedTailLoss(returns, 0.95, 10000000);
 * console.log(`Expected shortfall: $${etl}`);
 * ```
 */
export declare const calculateExpectedTailLoss: (returns: number[], confidenceLevel: number, portfolioValue: number) => Promise<number>;
/**
 * Calculates market volatility using EWMA (Exponentially Weighted Moving Average).
 *
 * @param {number[]} returns - Historical returns
 * @param {number} [lambda=0.94] - Decay factor (RiskMetrics standard is 0.94)
 * @returns {Promise<number>} EWMA volatility
 *
 * @example
 * ```typescript
 * const volatility = await calculateMarketVolatility(returns, 0.94);
 * console.log(`EWMA volatility: ${(volatility * 100).toFixed(2)}%`);
 * ```
 */
export declare const calculateMarketVolatility: (returns: number[], lambda?: number) => Promise<number>;
/**
 * Analyzes correlation breakdown during stress events.
 *
 * @param {number[][]} correlationMatrixNormal - Normal market correlation matrix
 * @param {number[][]} correlationMatrixStress - Stress period correlation matrix
 * @returns {Promise<{ averageIncrease: number; maxIncrease: number; breakdownOccurred: boolean }>} Correlation breakdown analysis
 *
 * @example
 * ```typescript
 * const breakdown = await analyzeCorrelationBreakdown(normalCorr, stressCorr);
 * if (breakdown.breakdownOccurred) {
 *   console.log(`Correlation increased by ${breakdown.averageIncrease}%`);
 * }
 * ```
 */
export declare const analyzeCorrelationBreakdown: (correlationMatrixNormal: number[][], correlationMatrixStress: number[][]) => Promise<{
    averageIncrease: number;
    maxIncrease: number;
    breakdownOccurred: boolean;
}>;
/**
 * Calculates Probability of Default (PD) using Merton model.
 *
 * @param {number} assetValue - Firm's asset value
 * @param {number} debtValue - Firm's debt value
 * @param {number} assetVolatility - Asset volatility
 * @param {number} timeHorizon - Time horizon (years)
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Probability of default
 *
 * @example
 * ```typescript
 * const pd = await calculateProbabilityOfDefault(100000000, 60000000, 0.25, 1, 0.03);
 * console.log(`Probability of default: ${(pd * 100).toFixed(2)}%`);
 * ```
 */
export declare const calculateProbabilityOfDefault: (assetValue: number, debtValue: number, assetVolatility: number, timeHorizon: number, riskFreeRate: number) => Promise<number>;
/**
 * Calculates Loss Given Default (LGD) based on recovery rates.
 *
 * @param {number} exposureAtDefault - Exposure at default
 * @param {number} recoveryRate - Expected recovery rate (0-1)
 * @param {number} [discountRate=0] - Discount rate for recovery timing
 * @returns {Promise<number>} Loss Given Default
 *
 * @example
 * ```typescript
 * const lgd = await calculateLossGivenDefault(5000000, 0.40, 0.05);
 * console.log(`Loss Given Default: $${lgd}`);
 * ```
 */
export declare const calculateLossGivenDefault: (exposureAtDefault: number, recoveryRate: number, discountRate?: number) => Promise<number>;
/**
 * Calculates Exposure at Default (EAD) for credit facilities.
 *
 * @param {number} currentExposure - Current drawn amount
 * @param {number} commitmentAmount - Total commitment/limit
 * @param {number} creditConversionFactor - Probability of drawdown on default (0-1)
 * @returns {Promise<number>} Exposure at Default
 *
 * @example
 * ```typescript
 * const ead = await calculateExposureAtDefault(3000000, 5000000, 0.75);
 * console.log(`Exposure at Default: $${ead}`);
 * ```
 */
export declare const calculateExposureAtDefault: (currentExposure: number, commitmentAmount: number, creditConversionFactor: number) => Promise<number>;
/**
 * Calculates Expected Loss (EL) for credit exposure.
 *
 * @param {number} probabilityOfDefault - PD (0-1)
 * @param {number} lossGivenDefault - LGD amount
 * @param {number} exposureAtDefault - EAD amount
 * @returns {Promise<number>} Expected Loss
 *
 * @example
 * ```typescript
 * const el = await calculateExpectedLoss(0.02, 3000000, 5000000);
 * console.log(`Expected Loss: $${el}`);
 * ```
 */
export declare const calculateExpectedLoss: (probabilityOfDefault: number, lossGivenDefault: number, exposureAtDefault: number) => Promise<number>;
/**
 * Calculates Credit Value at Risk (Credit VaR).
 *
 * @param {number} expectedLoss - Expected loss
 * @param {number} unexpectedLoss - Unexpected loss (standard deviation)
 * @param {number} confidenceLevel - Confidence level
 * @returns {Promise<number>} Credit VaR
 *
 * @example
 * ```typescript
 * const creditVaR = await calculateCreditVaR(100000, 500000, 0.99);
 * console.log(`Credit VaR: $${creditVaR}`);
 * ```
 */
export declare const calculateCreditVaR: (expectedLoss: number, unexpectedLoss: number, confidenceLevel: number) => Promise<number>;
/**
 * Calculates Current Exposure for derivatives.
 *
 * @param {number} markToMarket - Current mark-to-market value
 * @param {number} collateralHeld - Collateral held
 * @returns {Promise<number>} Current exposure
 *
 * @example
 * ```typescript
 * const exposure = await calculateCurrentExposure(1500000, 500000);
 * console.log(`Current exposure: $${exposure}`);
 * ```
 */
export declare const calculateCurrentExposure: (markToMarket: number, collateralHeld: number) => Promise<number>;
/**
 * Calculates Potential Future Exposure (PFE) using Monte Carlo.
 *
 * @param {number} currentExposure - Current exposure
 * @param {number} volatility - Market volatility
 * @param {number} timeToMaturity - Time to maturity (years)
 * @param {number} confidenceLevel - Confidence level
 * @param {number} [simulations=10000] - Number of simulations
 * @returns {Promise<number>} Potential Future Exposure
 *
 * @example
 * ```typescript
 * const pfe = await calculatePotentialFutureExposure(1000000, 0.20, 1, 0.95, 10000);
 * console.log(`95% PFE: $${pfe}`);
 * ```
 */
export declare const calculatePotentialFutureExposure: (currentExposure: number, volatility: number, timeToMaturity: number, confidenceLevel: number, simulations?: number) => Promise<number>;
/**
 * Calculates Credit Valuation Adjustment (CVA).
 *
 * @param {number} exposure - Expected positive exposure
 * @param {number} probabilityOfDefault - Counterparty PD
 * @param {number} lossGivenDefault - LGD rate (0-1)
 * @param {number} discountFactor - Discount factor
 * @returns {Promise<number>} CVA amount
 *
 * @example
 * ```typescript
 * const cva = await calculateCVA(2000000, 0.03, 0.60, 0.95);
 * console.log(`CVA: $${cva}`);
 * ```
 */
export declare const calculateCVA: (exposure: number, probabilityOfDefault: number, lossGivenDefault: number, discountFactor: number) => Promise<number>;
/**
 * Calculates Debt Valuation Adjustment (DVA).
 *
 * @param {number} exposure - Expected negative exposure (from counterparty perspective)
 * @param {number} ownPD - Own probability of default
 * @param {number} lossGivenDefault - LGD rate
 * @param {number} discountFactor - Discount factor
 * @returns {Promise<number>} DVA amount
 *
 * @example
 * ```typescript
 * const dva = await calculateDVA(1500000, 0.01, 0.60, 0.95);
 * console.log(`DVA: $${dva}`);
 * ```
 */
export declare const calculateDVA: (exposure: number, ownPD: number, lossGivenDefault: number, discountFactor: number) => Promise<number>;
/**
 * Calculates Wrong Way Risk adjustment.
 *
 * @param {number} exposure - Counterparty exposure
 * @param {number} correlation - Correlation between exposure and counterparty creditworthiness
 * @returns {Promise<{ adjustedExposure: number; riskMultiplier: number }>} Wrong way risk adjustment
 *
 * @example
 * ```typescript
 * const wwrAdj = await calculateWrongWayRisk(2000000, 0.5);
 * console.log(`Adjusted exposure: $${wwrAdj.adjustedExposure}`);
 * ```
 */
export declare const calculateWrongWayRisk: (exposure: number, correlation: number) => Promise<{
    adjustedExposure: number;
    riskMultiplier: number;
}>;
/**
 * Calculates Operational VaR using Loss Distribution Approach (LDA).
 *
 * @param {number[]} historicalLosses - Historical operational losses
 * @param {number} confidenceLevel - Confidence level
 * @returns {Promise<number>} Operational VaR
 *
 * @example
 * ```typescript
 * const opVaR = await calculateOperationalVaR(losses, 0.99);
 * console.log(`Operational VaR: $${opVaR}`);
 * ```
 */
export declare const calculateOperationalVaR: (historicalLosses: number[], confidenceLevel: number) => Promise<number>;
/**
 * Analyzes Key Risk Indicators (KRIs) for operational risk.
 *
 * @param {Array<{ indicator: string; value: number; threshold: number; trend: number[] }>} kris - KRIs to analyze
 * @returns {Promise<Array<{ indicator: string; value: number; threshold: number; status: string; trend: string }>>} KRI analysis
 *
 * @example
 * ```typescript
 * const kriAnalysis = await analyzeKeyRiskIndicators(kris);
 * const breaches = kriAnalysis.filter(k => k.status === 'BREACH');
 * ```
 */
export declare const analyzeKeyRiskIndicators: (kris: Array<{
    indicator: string;
    value: number;
    threshold: number;
    trend: number[];
}>) => Promise<Array<{
    indicator: string;
    value: number;
    threshold: number;
    status: string;
    trend: string;
}>>;
/**
 * Calculates expected annual operational loss.
 *
 * @param {number} lossFrequency - Average number of losses per year
 * @param {number} averageLossSeverity - Average loss amount
 * @returns {Promise<number>} Expected annual loss
 *
 * @example
 * ```typescript
 * const eal = await calculateExpectedAnnualLoss(12, 50000);
 * console.log(`Expected annual operational loss: $${eal}`);
 * ```
 */
export declare const calculateExpectedAnnualLoss: (lossFrequency: number, averageLossSeverity: number) => Promise<number>;
/**
 * Assesses control effectiveness for operational risk mitigation.
 *
 * @param {Array<{ control: string; designEffectiveness: number; operatingEffectiveness: number }>} controls - Controls to assess
 * @returns {Promise<Array<{ control: string; overallEffectiveness: number; rating: string }>>} Control assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessControlEffectiveness(controls);
 * const ineffective = assessment.filter(c => c.rating === 'INEFFECTIVE');
 * ```
 */
export declare const assessControlEffectiveness: (controls: Array<{
    control: string;
    designEffectiveness: number;
    operatingEffectiveness: number;
}>) => Promise<Array<{
    control: string;
    overallEffectiveness: number;
    rating: string;
}>>;
/**
 * Tracks operational risk incidents and trends.
 *
 * @param {Array<{ date: Date; category: string; severity: string; loss: number }>} incidents - Incident data
 * @param {number} lookbackDays - Lookback period in days
 * @returns {Promise<{ totalIncidents: number; totalLoss: number; byCategory: Record<string, number>; trend: string }>} Incident tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackOperationalIncidents(incidents, 90);
 * console.log(`${tracking.totalIncidents} incidents, trend: ${tracking.trend}`);
 * ```
 */
export declare const trackOperationalIncidents: (incidents: Array<{
    date: Date;
    category: string;
    severity: string;
    loss: number;
}>, lookbackDays: number) => Promise<{
    totalIncidents: number;
    totalLoss: number;
    byCategory: Record<string, number>;
    trend: string;
}>;
/**
 * Calculates Liquidity Coverage Ratio (LCR).
 *
 * @param {number} highQualityLiquidAssets - HQLA amount
 * @param {number} netCashOutflows30Days - Expected net outflows over 30 days
 * @returns {Promise<number>} LCR ratio (should be >= 100%)
 *
 * @example
 * ```typescript
 * const lcr = await calculateLiquidityCoverageRatio(50000000, 40000000);
 * console.log(`LCR: ${lcr}%`);
 * ```
 */
export declare const calculateLiquidityCoverageRatio: (highQualityLiquidAssets: number, netCashOutflows30Days: number) => Promise<number>;
/**
 * Calculates Net Stable Funding Ratio (NSFR).
 *
 * @param {number} availableStableFunding - ASF amount
 * @param {number} requiredStableFunding - RSF amount
 * @returns {Promise<number>} NSFR ratio (should be >= 100%)
 *
 * @example
 * ```typescript
 * const nsfr = await calculateNetStableFundingRatio(75000000, 70000000);
 * console.log(`NSFR: ${nsfr}%`);
 * ```
 */
export declare const calculateNetStableFundingRatio: (availableStableFunding: number, requiredStableFunding: number) => Promise<number>;
/**
 * Analyzes liquidity gap by time buckets.
 *
 * @param {Array<{ bucket: string; inflows: number; outflows: number }>} cashFlows - Cash flows by time bucket
 * @returns {Promise<Array<{ bucket: string; netFlow: number; cumulativeGap: number }>>} Liquidity gap analysis
 *
 * @example
 * ```typescript
 * const gap = await analyzeLiquidityGap(cashFlows);
 * const negative = gap.filter(g => g.cumulativeGap < 0);
 * ```
 */
export declare const analyzeLiquidityGap: (cashFlows: Array<{
    bucket: string;
    inflows: number;
    outflows: number;
}>) => Promise<Array<{
    bucket: string;
    netFlow: number;
    cumulativeGap: number;
}>>;
/**
 * Estimates time to liquidate positions.
 *
 * @param {Array<{ securityId: string; quantity: number; averageDailyVolume: number; marketImpact: number }>} positions - Positions to liquidate
 * @param {number} [maxDailyVolumePercent=0.25] - Max % of daily volume to trade
 * @returns {Promise<Array<{ securityId: string; daysToLiquidate: number; estimatedCost: number }>>} Liquidation timeline
 *
 * @example
 * ```typescript
 * const timeline = await estimateTimeToLiquidate(positions, 0.25);
 * timeline.forEach(t => console.log(`${t.securityId}: ${t.daysToLiquidate} days`));
 * ```
 */
export declare const estimateTimeToLiquidate: (positions: Array<{
    securityId: string;
    quantity: number;
    averageDailyVolume: number;
    marketImpact: number;
}>, maxDailyVolumePercent?: number) => Promise<Array<{
    securityId: string;
    daysToLiquidate: number;
    estimatedCost: number;
}>>;
/**
 * Calculates market impact cost of liquidation.
 *
 * @param {number} positionSize - Size of position to liquidate
 * @param {number} averageDailyVolume - Average daily volume
 * @param {number} volatility - Price volatility
 * @returns {Promise<{ permanentImpact: number; temporaryImpact: number; totalImpact: number }>} Market impact analysis
 *
 * @example
 * ```typescript
 * const impact = await calculateMarketImpactCost(1000000, 5000000, 0.02);
 * console.log(`Total impact: ${impact.totalImpact}%`);
 * ```
 */
export declare const calculateMarketImpactCost: (positionSize: number, averageDailyVolume: number, volatility: number) => Promise<{
    permanentImpact: number;
    temporaryImpact: number;
    totalImpact: number;
}>;
/**
 * Calculates portfolio concentration using Herfindahl-Hirschman Index (HHI).
 *
 * @param {Array<{ id: string; weight: number }>} holdings - Portfolio holdings with weights
 * @returns {Promise<{ hhi: number; effectiveN: number; concentrationLevel: string }>} HHI analysis
 *
 * @example
 * ```typescript
 * const hhi = await calculateHerfindahlIndex(holdings);
 * console.log(`HHI: ${hhi.hhi}, Effective N: ${hhi.effectiveN}`);
 * ```
 */
export declare const calculateHerfindahlIndex: (holdings: Array<{
    id: string;
    weight: number;
}>) => Promise<{
    hhi: number;
    effectiveN: number;
    concentrationLevel: string;
}>;
/**
 * Analyzes sector concentration risk.
 *
 * @param {Array<{ sector: string; exposure: number }>} sectorExposures - Exposures by sector
 * @param {number} totalExposure - Total portfolio exposure
 * @param {number} [maxSectorLimit=0.25] - Maximum allowed sector concentration
 * @returns {Promise<Array<{ sector: string; percentage: number; excess: number; breach: boolean }>>} Sector concentration analysis
 *
 * @example
 * ```typescript
 * const sectorRisk = await analyzeSectorConcentration(exposures, total, 0.25);
 * const breaches = sectorRisk.filter(s => s.breach);
 * ```
 */
export declare const analyzeSectorConcentration: (sectorExposures: Array<{
    sector: string;
    exposure: number;
}>, totalExposure: number, maxSectorLimit?: number) => Promise<Array<{
    sector: string;
    percentage: number;
    excess: number;
    breach: boolean;
}>>;
/**
 * Analyzes geographic concentration risk.
 *
 * @param {Array<{ region: string; exposure: number }>} regionalExposures - Exposures by region
 * @param {number} totalExposure - Total portfolio exposure
 * @returns {Promise<Array<{ region: string; percentage: number; riskRating: string }>>} Geographic concentration analysis
 *
 * @example
 * ```typescript
 * const geoRisk = await analyzeGeographicConcentration(exposures, total);
 * const emerging = geoRisk.filter(r => r.riskRating === 'HIGH');
 * ```
 */
export declare const analyzeGeographicConcentration: (regionalExposures: Array<{
    region: string;
    exposure: number;
}>, totalExposure: number) => Promise<Array<{
    region: string;
    percentage: number;
    riskRating: string;
}>>;
/**
 * Analyzes counterparty concentration risk.
 *
 * @param {Array<{ counterparty: string; exposure: number; creditRating: string }>} counterpartyExposures - Counterparty exposures
 * @param {number} totalExposure - Total exposure
 * @param {number} [maxCounterpartyLimit=0.10] - Max single counterparty limit
 * @returns {Promise<Array<{ counterparty: string; percentage: number; creditRating: string; breach: boolean }>>} Counterparty concentration
 *
 * @example
 * ```typescript
 * const cpRisk = await analyzeCounterpartyConcentration(exposures, total, 0.10);
 * const highRiskCP = cpRisk.filter(cp => cp.breach && cp.creditRating === 'BBB');
 * ```
 */
export declare const analyzeCounterpartyConcentration: (counterpartyExposures: Array<{
    counterparty: string;
    exposure: number;
    creditRating: string;
}>, totalExposure: number, maxCounterpartyLimit?: number) => Promise<Array<{
    counterparty: string;
    percentage: number;
    creditRating: string;
    breach: boolean;
}>>;
/**
 * Calculates concentration limits based on credit quality.
 *
 * @param {string} creditRating - Credit rating
 * @param {number} baseLimit - Base concentration limit
 * @returns {Promise<{ limit: number; rationale: string }>} Adjusted concentration limit
 *
 * @example
 * ```typescript
 * const limit = await calculateConcentrationLimits('AA', 0.10);
 * console.log(`${limit.limit * 100}% limit - ${limit.rationale}`);
 * ```
 */
export declare const calculateConcentrationLimits: (creditRating: string, baseLimit: number) => Promise<{
    limit: number;
    rationale: string;
}>;
/**
 * Calculates option Delta (sensitivity to underlying price).
 *
 * @param {string} optionType - 'CALL' or 'PUT'
 * @param {number} underlyingPrice - Current underlying price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time to expiry (years)
 * @param {number} volatility - Implied volatility
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Delta value
 *
 * @example
 * ```typescript
 * const delta = await calculateDelta('CALL', 100, 100, 0.25, 0.20, 0.03);
 * console.log(`Delta: ${delta.toFixed(4)}`);
 * ```
 */
export declare const calculateDelta: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
/**
 * Calculates option Gamma (rate of change of Delta).
 *
 * @param {number} underlyingPrice - Current underlying price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time to expiry (years)
 * @param {number} volatility - Implied volatility
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Gamma value
 *
 * @example
 * ```typescript
 * const gamma = await calculateGamma(100, 100, 0.25, 0.20, 0.03);
 * console.log(`Gamma: ${gamma.toFixed(6)}`);
 * ```
 */
export declare const calculateGamma: (underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
/**
 * Calculates option Vega (sensitivity to volatility).
 *
 * @param {number} underlyingPrice - Current underlying price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time to expiry (years)
 * @param {number} volatility - Implied volatility
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Vega value
 *
 * @example
 * ```typescript
 * const vega = await calculateVega(100, 100, 0.25, 0.20, 0.03);
 * console.log(`Vega: ${vega.toFixed(4)}`);
 * ```
 */
export declare const calculateVega: (underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
/**
 * Calculates option Theta (time decay).
 *
 * @param {string} optionType - 'CALL' or 'PUT'
 * @param {number} underlyingPrice - Current underlying price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time to expiry (years)
 * @param {number} volatility - Implied volatility
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Theta value (per day)
 *
 * @example
 * ```typescript
 * const theta = await calculateTheta('CALL', 100, 100, 0.25, 0.20, 0.03);
 * console.log(`Daily theta: $${theta.toFixed(2)}`);
 * ```
 */
export declare const calculateTheta: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
/**
 * Calculates option Rho (sensitivity to interest rates).
 *
 * @param {string} optionType - 'CALL' or 'PUT'
 * @param {number} underlyingPrice - Current underlying price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time to expiry (years)
 * @param {number} volatility - Implied volatility
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Rho value
 *
 * @example
 * ```typescript
 * const rho = await calculateRho('CALL', 100, 100, 0.25, 0.20, 0.03);
 * console.log(`Rho: ${rho.toFixed(4)}`);
 * ```
 */
export declare const calculateRho: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
/**
 * Calculates all Greeks for an option position.
 *
 * @param {string} optionType - 'CALL' or 'PUT'
 * @param {number} underlyingPrice - Current underlying price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time to expiry (years)
 * @param {number} volatility - Implied volatility
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<GreekMetrics>} All Greek values
 *
 * @example
 * ```typescript
 * const greeks = await calculateAllGreeks('CALL', 100, 100, 0.25, 0.20, 0.03);
 * console.log(`Delta: ${greeks.delta}, Gamma: ${greeks.gamma}, Vega: ${greeks.vega}`);
 * ```
 */
export declare const calculateAllGreeks: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<Omit<GreekMetrics, "securityId" | "lambda" | "epsilon">>;
/**
 * Calculates portfolio-level Greeks aggregation.
 *
 * @param {Array<GreekMetrics & { quantity: number }>} optionPositions - Option positions with quantities
 * @returns {Promise<{ totalDelta: number; totalGamma: number; totalVega: number; totalTheta: number }>} Portfolio Greeks
 *
 * @example
 * ```typescript
 * const portfolioGreeks = await calculatePortfolioGreeks(positions);
 * console.log(`Portfolio delta: ${portfolioGreeks.totalDelta}`);
 * ```
 */
export declare const calculatePortfolioGreeks: (optionPositions: Array<Omit<GreekMetrics, "securityId" | "lambda" | "epsilon"> & {
    quantity: number;
}>) => Promise<{
    totalDelta: number;
    totalGamma: number;
    totalVega: number;
    totalTheta: number;
}>;
/**
 * Calculates initial margin requirement using SPAN methodology.
 *
 * @param {number} positionValue - Position value
 * @param {number} volatility - Historical volatility
 * @param {number} priceScenarios - Number of price scenarios
 * @returns {Promise<number>} Initial margin requirement
 *
 * @example
 * ```typescript
 * const initialMargin = await calculateInitialMargin(1000000, 0.20, 16);
 * console.log(`Initial margin: $${initialMargin}`);
 * ```
 */
export declare const calculateInitialMargin: (positionValue: number, volatility: number, priceScenarios: number) => Promise<number>;
/**
 * Calculates maintenance margin requirement.
 *
 * @param {number} initialMargin - Initial margin
 * @param {number} [maintenanceRatio=0.70] - Maintenance to initial ratio
 * @returns {Promise<number>} Maintenance margin requirement
 *
 * @example
 * ```typescript
 * const maintenanceMargin = await calculateMaintenanceMargin(500000, 0.70);
 * console.log(`Maintenance margin: $${maintenanceMargin}`);
 * ```
 */
export declare const calculateMaintenanceMargin: (initialMargin: number, maintenanceRatio?: number) => Promise<number>;
/**
 * Calculates variation margin for marked-to-market positions.
 *
 * @param {number} previousMTM - Previous mark-to-market value
 * @param {number} currentMTM - Current mark-to-market value
 * @param {number} collateralHeld - Collateral currently held
 * @returns {Promise<{ variationMargin: number; marginCall: boolean; amountDue: number }>} Variation margin calculation
 *
 * @example
 * ```typescript
 * const varMargin = await calculateVariationMargin(1000000, 950000, 100000);
 * if (varMargin.marginCall) {
 *   console.log(`Margin call: $${varMargin.amountDue}`);
 * }
 * ```
 */
export declare const calculateVariationMargin: (previousMTM: number, currentMTM: number, collateralHeld: number) => Promise<{
    variationMargin: number;
    marginCall: boolean;
    amountDue: number;
}>;
/**
 * Monitors risk limits and identifies breaches.
 *
 * @param {RiskLimit[]} limits - Risk limits to monitor
 * @param {Record<string, number>} currentValues - Current values for each limit
 * @returns {Promise<Array<RiskLimit & { breached: boolean; utilizationPercent: number }>>} Limit monitoring results
 *
 * @example
 * ```typescript
 * const monitoring = await monitorRiskLimits(limits, currentValues);
 * const breaches = monitoring.filter(m => m.breached);
 * breaches.forEach(b => console.log(`BREACH: ${b.limitName}`));
 * ```
 */
export declare const monitorRiskLimits: (limits: RiskLimit[], currentValues: Record<string, number>) => Promise<Array<RiskLimit & {
    breached: boolean;
    utilizationPercent: number;
}>>;
/**
 * Generates comprehensive risk dashboard report.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {Date} reportDate - Report date
 * @returns {Promise<RiskReport>} Comprehensive risk report
 *
 * @example
 * ```typescript
 * const dashboard = await generateRiskDashboard('PORT-001', new Date());
 * console.log(dashboard.executiveSummary);
 * dashboard.limitBreaches.forEach(b => console.log(`ALERT: ${b.limitName}`));
 * ```
 */
export declare const generateRiskDashboard: (portfolioId: string, reportDate: Date) => Promise<RiskReport>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createRiskMetricsModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            portfolioId: string;
            calculationDate: Date;
            valueAtRisk: number;
            conditionalVaR: number;
            expectedShortfall: number;
            marketVolatility: number;
            creditExposure: number;
            creditVaR: number;
            operationalVaR: number;
            liquidityRatio: number;
            concentrationIndex: number;
            totalRiskCapital: number;
            capitalAdequacyRatio: number;
            limitBreaches: number;
            riskScore: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createMarginRequirementModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountId: string;
            portfolioId: string;
            calculationDate: Date;
            initialMargin: number;
            maintenanceMargin: number;
            variationMargin: number;
            totalMargin: number;
            cashCollateral: number;
            securitiesCollateral: number;
            availableMargin: number;
            marginUtilization: number;
            marginCall: boolean;
            marginCallAmount: number;
            marginCallDate: Date | null;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRiskLimitModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            limitId: string;
            limitType: string;
            limitName: string;
            limitDescription: string | null;
            scope: string;
            scopeId: string;
            limitValue: number;
            currentValue: number;
            utilization: number;
            warningThreshold: number;
            breachThreshold: number;
            status: string;
            lastChecked: Date;
            lastBreach: Date | null;
            breachCount: number;
            approver: string | null;
            enabled: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    calculateMarketVaR: (returns: number[], confidenceLevel: number, portfolioValue: number, timeHorizon?: number) => Promise<number>;
    calculateParametricVaR: (expectedReturn: number, volatility: number, confidenceLevel: number, portfolioValue: number, timeHorizon?: number) => Promise<number>;
    calculateIncrementalVaR: (portfolioVaR: number, newPosition: number, positionVolatility: number, correlation: number) => Promise<number>;
    calculateComponentVaR: (positions: Array<{
        securityId: string;
        value: number;
        beta: number;
    }>, portfolioVaR: number) => Promise<Array<{
        securityId: string;
        componentVaR: number;
        percentageContribution: number;
    }>>;
    performVaRBacktesting: (forecastedVaR: number[], actualLosses: number[], confidenceLevel: number) => Promise<{
        violations: number;
        violationRate: number;
        trafficLight: string;
        accurate: boolean;
    }>;
    calculateExpectedTailLoss: (returns: number[], confidenceLevel: number, portfolioValue: number) => Promise<number>;
    calculateMarketVolatility: (returns: number[], lambda?: number) => Promise<number>;
    analyzeCorrelationBreakdown: (correlationMatrixNormal: number[][], correlationMatrixStress: number[][]) => Promise<{
        averageIncrease: number;
        maxIncrease: number;
        breakdownOccurred: boolean;
    }>;
    calculateProbabilityOfDefault: (assetValue: number, debtValue: number, assetVolatility: number, timeHorizon: number, riskFreeRate: number) => Promise<number>;
    calculateLossGivenDefault: (exposureAtDefault: number, recoveryRate: number, discountRate?: number) => Promise<number>;
    calculateExposureAtDefault: (currentExposure: number, commitmentAmount: number, creditConversionFactor: number) => Promise<number>;
    calculateExpectedLoss: (probabilityOfDefault: number, lossGivenDefault: number, exposureAtDefault: number) => Promise<number>;
    calculateCreditVaR: (expectedLoss: number, unexpectedLoss: number, confidenceLevel: number) => Promise<number>;
    calculateCurrentExposure: (markToMarket: number, collateralHeld: number) => Promise<number>;
    calculatePotentialFutureExposure: (currentExposure: number, volatility: number, timeToMaturity: number, confidenceLevel: number, simulations?: number) => Promise<number>;
    calculateCVA: (exposure: number, probabilityOfDefault: number, lossGivenDefault: number, discountFactor: number) => Promise<number>;
    calculateDVA: (exposure: number, ownPD: number, lossGivenDefault: number, discountFactor: number) => Promise<number>;
    calculateWrongWayRisk: (exposure: number, correlation: number) => Promise<{
        adjustedExposure: number;
        riskMultiplier: number;
    }>;
    calculateOperationalVaR: (historicalLosses: number[], confidenceLevel: number) => Promise<number>;
    analyzeKeyRiskIndicators: (kris: Array<{
        indicator: string;
        value: number;
        threshold: number;
        trend: number[];
    }>) => Promise<Array<{
        indicator: string;
        value: number;
        threshold: number;
        status: string;
        trend: string;
    }>>;
    calculateExpectedAnnualLoss: (lossFrequency: number, averageLossSeverity: number) => Promise<number>;
    assessControlEffectiveness: (controls: Array<{
        control: string;
        designEffectiveness: number;
        operatingEffectiveness: number;
    }>) => Promise<Array<{
        control: string;
        overallEffectiveness: number;
        rating: string;
    }>>;
    trackOperationalIncidents: (incidents: Array<{
        date: Date;
        category: string;
        severity: string;
        loss: number;
    }>, lookbackDays: number) => Promise<{
        totalIncidents: number;
        totalLoss: number;
        byCategory: Record<string, number>;
        trend: string;
    }>;
    calculateLiquidityCoverageRatio: (highQualityLiquidAssets: number, netCashOutflows30Days: number) => Promise<number>;
    calculateNetStableFundingRatio: (availableStableFunding: number, requiredStableFunding: number) => Promise<number>;
    analyzeLiquidityGap: (cashFlows: Array<{
        bucket: string;
        inflows: number;
        outflows: number;
    }>) => Promise<Array<{
        bucket: string;
        netFlow: number;
        cumulativeGap: number;
    }>>;
    estimateTimeToLiquidate: (positions: Array<{
        securityId: string;
        quantity: number;
        averageDailyVolume: number;
        marketImpact: number;
    }>, maxDailyVolumePercent?: number) => Promise<Array<{
        securityId: string;
        daysToLiquidate: number;
        estimatedCost: number;
    }>>;
    calculateMarketImpactCost: (positionSize: number, averageDailyVolume: number, volatility: number) => Promise<{
        permanentImpact: number;
        temporaryImpact: number;
        totalImpact: number;
    }>;
    calculateHerfindahlIndex: (holdings: Array<{
        id: string;
        weight: number;
    }>) => Promise<{
        hhi: number;
        effectiveN: number;
        concentrationLevel: string;
    }>;
    analyzeSectorConcentration: (sectorExposures: Array<{
        sector: string;
        exposure: number;
    }>, totalExposure: number, maxSectorLimit?: number) => Promise<Array<{
        sector: string;
        percentage: number;
        excess: number;
        breach: boolean;
    }>>;
    analyzeGeographicConcentration: (regionalExposures: Array<{
        region: string;
        exposure: number;
    }>, totalExposure: number) => Promise<Array<{
        region: string;
        percentage: number;
        riskRating: string;
    }>>;
    analyzeCounterpartyConcentration: (counterpartyExposures: Array<{
        counterparty: string;
        exposure: number;
        creditRating: string;
    }>, totalExposure: number, maxCounterpartyLimit?: number) => Promise<Array<{
        counterparty: string;
        percentage: number;
        creditRating: string;
        breach: boolean;
    }>>;
    calculateConcentrationLimits: (creditRating: string, baseLimit: number) => Promise<{
        limit: number;
        rationale: string;
    }>;
    calculateDelta: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
    calculateGamma: (underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
    calculateVega: (underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
    calculateTheta: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
    calculateRho: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<number>;
    calculateAllGreeks: (optionType: string, underlyingPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number) => Promise<Omit<GreekMetrics, "securityId" | "lambda" | "epsilon">>;
    calculatePortfolioGreeks: (optionPositions: Array<Omit<GreekMetrics, "securityId" | "lambda" | "epsilon"> & {
        quantity: number;
    }>) => Promise<{
        totalDelta: number;
        totalGamma: number;
        totalVega: number;
        totalTheta: number;
    }>;
    calculateInitialMargin: (positionValue: number, volatility: number, priceScenarios: number) => Promise<number>;
    calculateMaintenanceMargin: (initialMargin: number, maintenanceRatio?: number) => Promise<number>;
    calculateVariationMargin: (previousMTM: number, currentMTM: number, collateralHeld: number) => Promise<{
        variationMargin: number;
        marginCall: boolean;
        amountDue: number;
    }>;
    monitorRiskLimits: (limits: RiskLimit[], currentValues: Record<string, number>) => Promise<Array<RiskLimit & {
        breached: boolean;
        utilizationPercent: number;
    }>>;
    generateRiskDashboard: (portfolioId: string, reportDate: Date) => Promise<RiskReport>;
};
export default _default;
//# sourceMappingURL=risk-management-kit.d.ts.map