/**
 * LOC: TRADE-PORT-001
 * File: /reuse/trading/portfolio-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../math-utilities-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend trading services
 *   - Portfolio management controllers
 *   - Analytics dashboards
 *   - Risk management services
 */
/**
 * File: /reuse/trading/portfolio-analytics-kit.ts
 * Locator: WC-TRADE-PORT-001
 * Purpose: Comprehensive Portfolio Analytics & Management Utilities - Bloomberg Terminal-level trading system
 *
 * Upstream: Error handling, validation, mathematical utilities
 * Downstream: ../backend/*, Trading services, portfolio controllers, analytics dashboards, risk management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for portfolio construction, optimization, performance attribution, risk-adjusted returns,
 * rebalancing, asset allocation, factor analysis, benchmark tracking, stress testing, scenario analysis, Monte Carlo simulation
 *
 * LLM Context: Enterprise-grade portfolio analytics system competing with Bloomberg Terminal PORT function.
 * Provides portfolio construction, optimization algorithms, performance attribution, risk-adjusted return metrics (Sharpe, Sortino, Calmar),
 * rebalancing strategies, asset allocation, factor analysis, benchmark tracking, stress testing, scenario analysis, Monte Carlo simulation,
 * VaR/CVaR calculations, drawdown analysis, and comprehensive portfolio risk metrics.
 */
import { Sequelize } from 'sequelize';
interface Portfolio {
    portfolioId: string;
    portfolioName: string;
    portfolioType: 'EQUITY' | 'FIXED_INCOME' | 'BALANCED' | 'ALTERNATIVE' | 'MULTI_ASSET';
    managerId: string;
    inceptionDate: Date;
    baseCurrency: string;
    benchmarkId: string;
    totalValue: number;
    cashPosition: number;
    holdings: PortfolioHolding[];
    constraints?: PortfolioConstraints;
}
interface PortfolioHolding {
    securityId: string;
    securityName: string;
    assetClass: 'EQUITY' | 'FIXED_INCOME' | 'COMMODITY' | 'CURRENCY' | 'DERIVATIVE' | 'ALTERNATIVE';
    quantity: number;
    marketValue: number;
    costBasis: number;
    weight: number;
    unrealizedGainLoss: number;
    sector?: string;
    region?: string;
}
interface PortfolioConstraints {
    maxPositionSize: number;
    minPositionSize: number;
    maxSectorExposure: number;
    maxRegionExposure: number;
    minDiversification: number;
    allowedAssetClasses: string[];
    prohibitedSecurities?: string[];
    targetTurnover?: number;
}
interface PerformanceAttribution {
    portfolioId: string;
    period: string;
    totalReturn: number;
    benchmarkReturn: number;
    activeReturn: number;
    allocationEffect: number;
    selectionEffect: number;
    interactionEffect: number;
    currencyEffect: number;
    sectorAttribution: Array<{
        sector: string;
        contribution: number;
    }>;
    securityAttribution: Array<{
        securityId: string;
        contribution: number;
    }>;
}
interface RiskAdjustedMetrics {
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    treynorRatio: number;
    jensenAlpha: number;
    modiglianiM2: number;
    informationRatio: number;
}
interface RebalancingPlan {
    portfolioId: string;
    rebalanceDate: Date;
    rebalanceType: 'THRESHOLD' | 'CALENDAR' | 'TACTICAL' | 'STRATEGIC';
    trades: Array<{
        securityId: string;
        action: 'BUY' | 'SELL';
        quantity: number;
        currentWeight: number;
        targetWeight: number;
        estimatedCost: number;
    }>;
    totalTurnover: number;
    estimatedCosts: number;
    taxImpact?: number;
}
interface AssetAllocation {
    portfolioId: string;
    allocationDate: Date;
    strategy: 'STRATEGIC' | 'TACTICAL' | 'DYNAMIC' | 'RISK_PARITY' | 'BLACK_LITTERMAN';
    allocations: Array<{
        assetClass: string;
        currentWeight: number;
        targetWeight: number;
        minWeight: number;
        maxWeight: number;
    }>;
    expectedReturn: number;
    expectedVolatility: number;
    expectedSharpe: number;
}
interface FactorExposure {
    portfolioId: string;
    analysisDate: Date;
    factors: Array<{
        factorName: string;
        factorType: 'MARKET' | 'SIZE' | 'VALUE' | 'MOMENTUM' | 'QUALITY' | 'VOLATILITY' | 'GROWTH';
        exposure: number;
        tStat: number;
        pValue: number;
    }>;
    rSquared: number;
    adjustedRSquared: number;
    residualVolatility: number;
}
interface BenchmarkComparison {
    portfolioId: string;
    benchmarkId: string;
    period: string;
    portfolioReturn: number;
    benchmarkReturn: number;
    activeReturn: number;
    trackingError: number;
    informationRatio: number;
    upCapture: number;
    downCapture: number;
    betaToIndex: number;
}
interface StressTestResult {
    portfolioId: string;
    scenarioName: string;
    scenarioType: 'HISTORICAL' | 'HYPOTHETICAL' | 'MONTE_CARLO';
    portfolioValue: number;
    stressedValue: number;
    valueLoss: number;
    percentageLoss: number;
    worstHolding: {
        securityId: string;
        loss: number;
    };
    correlationBreakdown: boolean;
}
interface ScenarioAnalysis {
    portfolioId: string;
    scenarioName: string;
    assumptions: Array<{
        variable: string;
        baseCase: number;
        stressCase: number;
    }>;
    baseValue: number;
    stressValue: number;
    impactAnalysis: Array<{
        holding: string;
        impact: number;
    }>;
    probabilityOfLoss: number;
}
interface MonteCarloSimulation {
    portfolioId: string;
    simulationId: string;
    iterations: number;
    timeHorizon: number;
    initialValue: number;
    meanFinalValue: number;
    medianFinalValue: number;
    percentile5: number;
    percentile25: number;
    percentile75: number;
    percentile95: number;
    probabilityOfLoss: number;
    expectedShortfall: number;
    paths?: number[][];
}
interface VaRResult {
    portfolioId: string;
    calculationDate: Date;
    confidenceLevel: number;
    timeHorizon: number;
    method: 'HISTORICAL' | 'PARAMETRIC' | 'MONTE_CARLO';
    valueAtRisk: number;
    conditionalVaR: number;
    expectedShortfall: number;
    percentageVaR: number;
}
interface OptimizationResult {
    portfolioId: string;
    optimizationType: 'MEAN_VARIANCE' | 'MIN_VARIANCE' | 'MAX_SHARPE' | 'RISK_PARITY' | 'BLACK_LITTERMAN';
    optimalWeights: Array<{
        securityId: string;
        weight: number;
    }>;
    expectedReturn: number;
    expectedVolatility: number;
    sharpeRatio: number;
    constraints: Record<string, any>;
    efficient: boolean;
}
interface DrawdownAnalysis {
    portfolioId: string;
    period: string;
    maxDrawdown: number;
    maxDrawdownDate: Date;
    recoveryDate: Date | null;
    drawdownDuration: number;
    recoveryDuration: number | null;
    currentDrawdown: number;
    averageDrawdown: number;
    drawdownPeriods: Array<{
        startDate: Date;
        endDate: Date;
        depth: number;
        duration: number;
    }>;
}
/**
 * Sequelize model for Portfolio with holdings and constraints.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Portfolio model
 *
 * @example
 * ```typescript
 * const Portfolio = createPortfolioModel(sequelize);
 * const portfolio = await Portfolio.create({
 *   portfolioName: 'Growth Portfolio',
 *   portfolioType: 'EQUITY',
 *   managerId: 'MGR-001',
 *   baseCurrency: 'USD'
 * });
 * ```
 */
export declare const createPortfolioModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        portfolioId: string;
        portfolioName: string;
        portfolioType: string;
        managerId: string;
        inceptionDate: Date;
        baseCurrency: string;
        benchmarkId: string;
        totalValue: number;
        cashPosition: number;
        numberOfHoldings: number;
        constraints: Record<string, any>;
        strategy: string | null;
        riskProfile: string;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Portfolio Holdings with position tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PortfolioHolding model
 *
 * @example
 * ```typescript
 * const PortfolioHolding = createPortfolioHoldingModel(sequelize);
 * const holding = await PortfolioHolding.create({
 *   portfolioId: 'PORT-001',
 *   securityId: 'AAPL',
 *   quantity: 100,
 *   marketValue: 17500
 * });
 * ```
 */
export declare const createPortfolioHoldingModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        portfolioId: string;
        securityId: string;
        securityName: string;
        assetClass: string;
        sector: string | null;
        region: string | null;
        quantity: number;
        marketPrice: number;
        marketValue: number;
        costBasis: number;
        averageCost: number;
        weight: number;
        unrealizedGainLoss: number;
        unrealizedGainLossPercent: number;
        lastUpdated: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Performance Metrics with time series tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceMetrics model
 *
 * @example
 * ```typescript
 * const PerformanceMetrics = createPerformanceMetricsModel(sequelize);
 * const metrics = await PerformanceMetrics.create({
 *   portfolioId: 'PORT-001',
 *   period: '2025-Q1',
 *   totalReturn: 12.5,
 *   sharpeRatio: 1.8
 * });
 * ```
 */
export declare const createPerformanceMetricsModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        portfolioId: string;
        period: string;
        periodType: string;
        periodStart: Date;
        periodEnd: Date;
        totalReturn: number;
        annualizedReturn: number;
        volatility: number;
        sharpeRatio: number;
        sortinoRatio: number;
        calmarRatio: number;
        maxDrawdown: number;
        alpha: number;
        beta: number;
        informationRatio: number;
        trackingError: number;
        winRate: number;
        calculatedAt: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Constructs optimal portfolio using mean-variance optimization (Markowitz).
 *
 * @param {string[]} securityIds - Securities to include
 * @param {number[][]} covarianceMatrix - Covariance matrix
 * @param {number[]} expectedReturns - Expected returns for each security
 * @param {object} [constraints] - Optimization constraints
 * @returns {Promise<OptimizationResult>} Optimal portfolio weights
 *
 * @example
 * ```typescript
 * const optimal = await constructOptimalPortfolio(
 *   ['AAPL', 'MSFT', 'GOOGL'],
 *   [[0.04, 0.01, 0.02], [0.01, 0.05, 0.015], [0.02, 0.015, 0.045]],
 *   [0.12, 0.15, 0.14],
 *   { minWeight: 0.05, maxWeight: 0.4 }
 * );
 * ```
 */
export declare const constructOptimalPortfolio: (securityIds: string[], covarianceMatrix: number[][], expectedReturns: number[], constraints?: Record<string, any>) => Promise<OptimizationResult>;
/**
 * Calculates efficient frontier for given securities.
 *
 * @param {string[]} securityIds - Securities to analyze
 * @param {number[][]} covarianceMatrix - Covariance matrix
 * @param {number[]} expectedReturns - Expected returns
 * @param {number} [points=20] - Number of frontier points
 * @returns {Promise<Array<{ return: number; volatility: number; weights: number[] }>>} Efficient frontier
 *
 * @example
 * ```typescript
 * const frontier = await calculateEfficientFrontier(securities, covMatrix, returns, 25);
 * ```
 */
export declare const calculateEfficientFrontier: (securityIds: string[], covarianceMatrix: number[][], expectedReturns: number[], points?: number) => Promise<Array<{
    return: number;
    volatility: number;
    weights: number[];
}>>;
/**
 * Optimizes portfolio for maximum Sharpe ratio.
 *
 * @param {string[]} securityIds - Securities to include
 * @param {number[][]} covarianceMatrix - Covariance matrix
 * @param {number[]} expectedReturns - Expected returns
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<OptimizationResult>} Max Sharpe portfolio
 *
 * @example
 * ```typescript
 * const maxSharpe = await optimizeForMaxSharpe(securities, covMatrix, returns, 0.03);
 * ```
 */
export declare const optimizeForMaxSharpe: (securityIds: string[], covarianceMatrix: number[][], expectedReturns: number[], riskFreeRate: number) => Promise<OptimizationResult>;
/**
 * Optimizes portfolio for minimum variance.
 *
 * @param {string[]} securityIds - Securities to include
 * @param {number[][]} covarianceMatrix - Covariance matrix
 * @param {object} [constraints] - Optimization constraints
 * @returns {Promise<OptimizationResult>} Minimum variance portfolio
 *
 * @example
 * ```typescript
 * const minVar = await optimizeForMinVariance(securities, covMatrix);
 * ```
 */
export declare const optimizeForMinVariance: (securityIds: string[], covarianceMatrix: number[][], constraints?: Record<string, any>) => Promise<OptimizationResult>;
/**
 * Implements risk parity portfolio allocation.
 *
 * @param {string[]} securityIds - Securities to include
 * @param {number[][]} covarianceMatrix - Covariance matrix
 * @returns {Promise<OptimizationResult>} Risk parity portfolio
 *
 * @example
 * ```typescript
 * const riskParity = await implementRiskParity(securities, covMatrix);
 * ```
 */
export declare const implementRiskParity: (securityIds: string[], covarianceMatrix: number[][]) => Promise<OptimizationResult>;
/**
 * Applies Black-Litterman model for portfolio optimization.
 *
 * @param {string[]} securityIds - Securities to include
 * @param {number[][]} covarianceMatrix - Covariance matrix
 * @param {number[]} marketWeights - Market capitalization weights
 * @param {Array<{ securityId: string; view: number; confidence: number }>} views - Investor views
 * @returns {Promise<OptimizationResult>} Black-Litterman portfolio
 *
 * @example
 * ```typescript
 * const blPortfolio = await applyBlackLitterman(securities, covMatrix, mktWeights, [
 *   { securityId: 'AAPL', view: 0.15, confidence: 0.8 }
 * ]);
 * ```
 */
export declare const applyBlackLitterman: (securityIds: string[], covarianceMatrix: number[][], marketWeights: number[], views: Array<{
    securityId: string;
    view: number;
    confidence: number;
}>) => Promise<OptimizationResult>;
/**
 * Validates portfolio against investment constraints.
 *
 * @param {Portfolio} portfolio - Portfolio to validate
 * @param {PortfolioConstraints} constraints - Constraints to validate against
 * @returns {Promise<{ valid: boolean; violations: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePortfolioConstraints(portfolio, constraints);
 * if (!validation.valid) {
 *   console.error('Constraint violations:', validation.violations);
 * }
 * ```
 */
export declare const validatePortfolioConstraints: (portfolio: Portfolio, constraints: PortfolioConstraints) => Promise<{
    valid: boolean;
    violations: string[];
}>;
/**
 * Calculates portfolio diversification metrics (Herfindahl index, effective N).
 *
 * @param {PortfolioHolding[]} holdings - Portfolio holdings
 * @returns {Promise<{ herfindahlIndex: number; effectiveN: number; concentrationRatio: number }>} Diversification metrics
 *
 * @example
 * ```typescript
 * const diversification = await calculateDiversificationMetrics(portfolio.holdings);
 * console.log(`Effective number of holdings: ${diversification.effectiveN}`);
 * ```
 */
export declare const calculateDiversificationMetrics: (holdings: PortfolioHolding[]) => Promise<{
    herfindahlIndex: number;
    effectiveN: number;
    concentrationRatio: number;
}>;
/**
 * Performs Brinson-Fachler performance attribution analysis.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {string} benchmarkId - Benchmark ID
 * @param {string} period - Analysis period
 * @returns {Promise<PerformanceAttribution>} Attribution analysis
 *
 * @example
 * ```typescript
 * const attribution = await performBrinsonAttribution('PORT-001', 'SPX', '2025-Q1');
 * console.log(`Selection effect: ${attribution.selectionEffect}%`);
 * ```
 */
export declare const performBrinsonAttribution: (portfolioId: string, benchmarkId: string, period: string) => Promise<PerformanceAttribution>;
/**
 * Calculates sector-level contribution to portfolio return.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {string} period - Analysis period
 * @returns {Promise<Array<{ sector: string; weight: number; return: number; contribution: number }>>} Sector attribution
 *
 * @example
 * ```typescript
 * const sectorContrib = await calculateSectorAttribution('PORT-001', '2025-Q1');
 * ```
 */
export declare const calculateSectorAttribution: (portfolioId: string, period: string) => Promise<Array<{
    sector: string;
    weight: number;
    return: number;
    contribution: number;
}>>;
/**
 * Calculates security-level contribution to portfolio return.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {string} period - Analysis period
 * @param {number} [topN=10] - Number of top contributors to return
 * @returns {Promise<Array<{ securityId: string; weight: number; return: number; contribution: number }>>} Security attribution
 *
 * @example
 * ```typescript
 * const top10 = await calculateSecurityAttribution('PORT-001', '2025-Q1', 10);
 * ```
 */
export declare const calculateSecurityAttribution: (portfolioId: string, period: string, topN?: number) => Promise<Array<{
    securityId: string;
    weight: number;
    return: number;
    contribution: number;
}>>;
/**
 * Analyzes allocation effect (asset allocation decisions).
 *
 * @param {PortfolioHolding[]} portfolioHoldings - Portfolio holdings
 * @param {PortfolioHolding[]} benchmarkHoldings - Benchmark holdings
 * @param {number[]} returns - Sector/security returns
 * @returns {Promise<{ totalAllocationEffect: number; sectorEffects: Array<{ sector: string; effect: number }> }>} Allocation effect
 *
 * @example
 * ```typescript
 * const allocationEffect = await analyzeAllocationEffect(portHoldings, bmkHoldings, returns);
 * ```
 */
export declare const analyzeAllocationEffect: (portfolioHoldings: PortfolioHolding[], benchmarkHoldings: PortfolioHolding[], returns: number[]) => Promise<{
    totalAllocationEffect: number;
    sectorEffects: Array<{
        sector: string;
        effect: number;
    }>;
}>;
/**
 * Analyzes selection effect (security selection decisions).
 *
 * @param {PortfolioHolding[]} portfolioHoldings - Portfolio holdings
 * @param {PortfolioHolding[]} benchmarkHoldings - Benchmark holdings
 * @param {number[]} returns - Security returns
 * @returns {Promise<{ totalSelectionEffect: number; securityEffects: Array<{ securityId: string; effect: number }> }>} Selection effect
 *
 * @example
 * ```typescript
 * const selectionEffect = await analyzeSelectionEffect(portHoldings, bmkHoldings, returns);
 * ```
 */
export declare const analyzeSelectionEffect: (portfolioHoldings: PortfolioHolding[], benchmarkHoldings: PortfolioHolding[], returns: number[]) => Promise<{
    totalSelectionEffect: number;
    securityEffects: Array<{
        securityId: string;
        effect: number;
    }>;
}>;
/**
 * Calculates Sharpe ratio (risk-adjusted return).
 *
 * @param {number[]} returns - Portfolio returns time series
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Sharpe ratio
 *
 * @example
 * ```typescript
 * const sharpe = await calculateSharpeRatio([0.05, 0.08, 0.03, 0.12, 0.07], 0.03);
 * console.log(`Sharpe ratio: ${sharpe.toFixed(2)}`);
 * ```
 */
export declare const calculateSharpeRatio: (returns: number[], riskFreeRate: number) => Promise<number>;
/**
 * Calculates Sortino ratio (downside risk-adjusted return).
 *
 * @param {number[]} returns - Portfolio returns time series
 * @param {number} targetReturn - Minimum acceptable return
 * @returns {Promise<number>} Sortino ratio
 *
 * @example
 * ```typescript
 * const sortino = await calculateSortinoRatio(returns, 0.02);
 * console.log(`Sortino ratio: ${sortino.toFixed(2)}`);
 * ```
 */
export declare const calculateSortinoRatio: (returns: number[], targetReturn: number) => Promise<number>;
/**
 * Calculates Calmar ratio (return over maximum drawdown).
 *
 * @param {number[]} returns - Portfolio returns time series
 * @returns {Promise<number>} Calmar ratio
 *
 * @example
 * ```typescript
 * const calmar = await calculateCalmarRatio(returns);
 * console.log(`Calmar ratio: ${calmar.toFixed(2)}`);
 * ```
 */
export declare const calculateCalmarRatio: (returns: number[]) => Promise<number>;
/**
 * Calculates Treynor ratio (return per unit of systematic risk).
 *
 * @param {number[]} returns - Portfolio returns time series
 * @param {number[]} marketReturns - Market returns time series
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<number>} Treynor ratio
 *
 * @example
 * ```typescript
 * const treynor = await calculateTreynorRatio(portReturns, mktReturns, 0.03);
 * ```
 */
export declare const calculateTreynorRatio: (returns: number[], marketReturns: number[], riskFreeRate: number) => Promise<number>;
/**
 * Calculates comprehensive risk-adjusted performance metrics.
 *
 * @param {number[]} returns - Portfolio returns time series
 * @param {number[]} marketReturns - Market returns time series
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {Promise<RiskAdjustedMetrics>} Comprehensive risk-adjusted metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateRiskAdjustedMetrics(portReturns, mktReturns, 0.03);
 * console.log(`Sharpe: ${metrics.sharpeRatio}, Sortino: ${metrics.sortinoRatio}`);
 * ```
 */
export declare const calculateRiskAdjustedMetrics: (returns: number[], marketReturns: number[], riskFreeRate: number) => Promise<RiskAdjustedMetrics>;
/**
 * Generates threshold-based rebalancing plan.
 *
 * @param {Portfolio} portfolio - Current portfolio
 * @param {AssetAllocation} targetAllocation - Target allocation
 * @param {number} threshold - Rebalancing threshold (percentage)
 * @returns {Promise<RebalancingPlan>} Rebalancing plan
 *
 * @example
 * ```typescript
 * const rebalancePlan = await generateRebalancingPlan(portfolio, target, 5.0);
 * console.log(`Total turnover: ${rebalancePlan.totalTurnover}%`);
 * ```
 */
export declare const generateRebalancingPlan: (portfolio: Portfolio, targetAllocation: AssetAllocation, threshold: number) => Promise<RebalancingPlan>;
/**
 * Implements calendar-based rebalancing strategy.
 *
 * @param {Portfolio} portfolio - Current portfolio
 * @param {AssetAllocation} targetAllocation - Target allocation
 * @param {string} frequency - Rebalancing frequency ('MONTHLY' | 'QUARTERLY' | 'ANNUALLY')
 * @returns {Promise<RebalancingPlan>} Calendar rebalancing plan
 *
 * @example
 * ```typescript
 * const plan = await implementCalendarRebalancing(portfolio, target, 'QUARTERLY');
 * ```
 */
export declare const implementCalendarRebalancing: (portfolio: Portfolio, targetAllocation: AssetAllocation, frequency: string) => Promise<RebalancingPlan>;
/**
 * Optimizes rebalancing for tax efficiency.
 *
 * @param {Portfolio} portfolio - Current portfolio
 * @param {AssetAllocation} targetAllocation - Target allocation
 * @param {number} taxRate - Capital gains tax rate
 * @returns {Promise<RebalancingPlan>} Tax-efficient rebalancing plan
 *
 * @example
 * ```typescript
 * const taxEfficientPlan = await optimizeRebalancingForTaxes(portfolio, target, 0.20);
 * console.log(`Estimated tax impact: $${taxEfficientPlan.taxImpact}`);
 * ```
 */
export declare const optimizeRebalancingForTaxes: (portfolio: Portfolio, targetAllocation: AssetAllocation, taxRate: number) => Promise<RebalancingPlan>;
/**
 * Calculates optimal rebalancing frequency.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {number} transactionCosts - Transaction costs (basis points)
 * @param {number} expectedVolatility - Expected portfolio volatility
 * @returns {Promise<{ optimalFrequency: string; expectedBenefit: number }>} Optimal frequency analysis
 *
 * @example
 * ```typescript
 * const optimal = await calculateOptimalRebalancingFrequency('PORT-001', 10, 15);
 * console.log(`Optimal frequency: ${optimal.optimalFrequency}`);
 * ```
 */
export declare const calculateOptimalRebalancingFrequency: (portfolioId: string, transactionCosts: number, expectedVolatility: number) => Promise<{
    optimalFrequency: string;
    expectedBenefit: number;
}>;
/**
 * Simulates rebalancing impact on portfolio performance.
 *
 * @param {Portfolio} portfolio - Portfolio to simulate
 * @param {RebalancingPlan} plan - Rebalancing plan
 * @param {number} periods - Number of periods to simulate
 * @returns {Promise<{ expectedReturn: number; expectedVolatility: number; sharpeImprovement: number }>} Simulation results
 *
 * @example
 * ```typescript
 * const impact = await simulateRebalancingImpact(portfolio, plan, 12);
 * console.log(`Sharpe improvement: ${impact.sharpeImprovement}`);
 * ```
 */
export declare const simulateRebalancingImpact: (portfolio: Portfolio, plan: RebalancingPlan, periods: number) => Promise<{
    expectedReturn: number;
    expectedVolatility: number;
    sharpeImprovement: number;
}>;
/**
 * Determines strategic asset allocation based on risk tolerance.
 *
 * @param {string} riskProfile - Risk profile ('CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE')
 * @param {number} timeHorizon - Investment time horizon (years)
 * @param {number} targetReturn - Target annual return
 * @returns {Promise<AssetAllocation>} Strategic asset allocation
 *
 * @example
 * ```typescript
 * const allocation = await determineStrategicAllocation('MODERATE', 10, 8.0);
 * ```
 */
export declare const determineStrategicAllocation: (riskProfile: string, timeHorizon: number, targetReturn: number) => Promise<AssetAllocation>;
/**
 * Implements tactical asset allocation based on market views.
 *
 * @param {AssetAllocation} strategicAllocation - Strategic allocation
 * @param {Array<{ assetClass: string; view: number }>} marketViews - Tactical market views
 * @param {number} maxDeviation - Maximum deviation from strategic allocation
 * @returns {Promise<AssetAllocation>} Tactical asset allocation
 *
 * @example
 * ```typescript
 * const tactical = await implementTacticalAllocation(strategic, [
 *   { assetClass: 'EQUITY', view: 1.5 }
 * ], 10);
 * ```
 */
export declare const implementTacticalAllocation: (strategicAllocation: AssetAllocation, marketViews: Array<{
    assetClass: string;
    view: number;
}>, maxDeviation: number) => Promise<AssetAllocation>;
/**
 * Implements dynamic asset allocation based on market conditions.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {object} marketConditions - Current market conditions
 * @returns {Promise<AssetAllocation>} Dynamic asset allocation
 *
 * @example
 * ```typescript
 * const dynamic = await implementDynamicAllocation('PORT-001', {
 *   volatility: 'HIGH',
 *   trend: 'BULLISH',
 *   valuationLevel: 'FAIR'
 * });
 * ```
 */
export declare const implementDynamicAllocation: (portfolioId: string, marketConditions: Record<string, any>) => Promise<AssetAllocation>;
/**
 * Calculates glide path for target-date portfolios.
 *
 * @param {number} currentAge - Current age
 * @param {number} retirementAge - Retirement age
 * @param {number} targetAge - Target age for calculation
 * @returns {Promise<AssetAllocation>} Age-appropriate allocation
 *
 * @example
 * ```typescript
 * const glidePath = await calculateGlidePath(35, 65, 35);
 * console.log(`Equity allocation: ${glidePath.allocations[0].targetWeight}%`);
 * ```
 */
export declare const calculateGlidePath: (currentAge: number, retirementAge: number, targetAge: number) => Promise<AssetAllocation>;
/**
 * Optimizes allocation for liability-driven investing (LDI).
 *
 * @param {Array<{ date: Date; amount: number }>} liabilities - Future liabilities
 * @param {number} currentAssets - Current asset value
 * @param {number} riskTolerance - Risk tolerance (0-1)
 * @returns {Promise<AssetAllocation>} LDI-optimized allocation
 *
 * @example
 * ```typescript
 * const ldiAllocation = await optimizeForLiabilityMatching(liabilities, 10000000, 0.3);
 * ```
 */
export declare const optimizeForLiabilityMatching: (liabilities: Array<{
    date: Date;
    amount: number;
}>, currentAssets: number, riskTolerance: number) => Promise<AssetAllocation>;
/**
 * Performs multi-factor regression analysis (Fama-French, Carhart).
 *
 * @param {number[]} portfolioReturns - Portfolio returns
 * @param {Record<string, number[]>} factorReturns - Factor returns (market, size, value, momentum, etc.)
 * @returns {Promise<FactorExposure>} Factor exposure analysis
 *
 * @example
 * ```typescript
 * const factorAnalysis = await performFactorAnalysis(returns, {
 *   market: mktReturns,
 *   size: smbReturns,
 *   value: hmlReturns,
 *   momentum: momReturns
 * });
 * ```
 */
export declare const performFactorAnalysis: (portfolioReturns: number[], factorReturns: Record<string, number[]>) => Promise<FactorExposure>;
/**
 * Calculates factor loadings (betas) for portfolio.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {string[]} factorNames - Factor names to analyze
 * @returns {Promise<Array<{ factor: string; loading: number; tStat: number; pValue: number }>>} Factor loadings
 *
 * @example
 * ```typescript
 * const loadings = await calculateFactorLoadings('PORT-001', ['MARKET', 'SIZE', 'VALUE']);
 * ```
 */
export declare const calculateFactorLoadings: (portfolioId: string, factorNames: string[]) => Promise<Array<{
    factor: string;
    loading: number;
    tStat: number;
    pValue: number;
}>>;
/**
 * Analyzes style drift from target factor exposures.
 *
 * @param {FactorExposure} currentExposure - Current factor exposure
 * @param {FactorExposure} targetExposure - Target factor exposure
 * @returns {Promise<Array<{ factor: string; drift: number; significant: boolean }>>} Style drift analysis
 *
 * @example
 * ```typescript
 * const drift = await analyzeStyleDrift(current, target);
 * const significantDrifts = drift.filter(d => d.significant);
 * ```
 */
export declare const analyzeStyleDrift: (currentExposure: FactorExposure, targetExposure: FactorExposure) => Promise<Array<{
    factor: string;
    drift: number;
    significant: boolean;
}>>;
/**
 * Decomposes portfolio risk by factor contributions.
 *
 * @param {FactorExposure} factorExposure - Factor exposure
 * @param {number[][]} factorCovarianceMatrix - Factor covariance matrix
 * @returns {Promise<Array<{ factor: string; riskContribution: number; percentageOfRisk: number }>>} Risk decomposition
 *
 * @example
 * ```typescript
 * const riskDecomp = await decomposeRiskByFactors(exposure, covMatrix);
 * console.log(`Market risk contribution: ${riskDecomp[0].percentageOfRisk}%`);
 * ```
 */
export declare const decomposeRiskByFactors: (factorExposure: FactorExposure, factorCovarianceMatrix: number[][]) => Promise<Array<{
    factor: string;
    riskContribution: number;
    percentageOfRisk: number;
}>>;
/**
 * Identifies tilts towards specific investment styles/factors.
 *
 * @param {FactorExposure} factorExposure - Factor exposure
 * @param {number} threshold - Threshold for significant tilt
 * @returns {Promise<Array<{ factor: string; tilt: number; direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }>>} Factor tilts
 *
 * @example
 * ```typescript
 * const tilts = await identifyFactorTilts(exposure, 0.3);
 * const valueTilt = tilts.find(t => t.factor === 'VALUE');
 * ```
 */
export declare const identifyFactorTilts: (factorExposure: FactorExposure, threshold: number) => Promise<Array<{
    factor: string;
    tilt: number;
    direction: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
}>>;
/**
 * Calculates tracking error vs benchmark.
 *
 * @param {number[]} portfolioReturns - Portfolio returns
 * @param {number[]} benchmarkReturns - Benchmark returns
 * @returns {Promise<number>} Annualized tracking error
 *
 * @example
 * ```typescript
 * const te = await calculateTrackingError(portReturns, bmkReturns);
 * console.log(`Tracking error: ${te.toFixed(2)}%`);
 * ```
 */
export declare const calculateTrackingError: (portfolioReturns: number[], benchmarkReturns: number[]) => Promise<number>;
/**
 * Calculates information ratio vs benchmark.
 *
 * @param {number[]} portfolioReturns - Portfolio returns
 * @param {number[]} benchmarkReturns - Benchmark returns
 * @returns {Promise<number>} Information ratio
 *
 * @example
 * ```typescript
 * const ir = await calculateInformationRatio(portReturns, bmkReturns);
 * console.log(`Information ratio: ${ir.toFixed(2)}`);
 * ```
 */
export declare const calculateInformationRatio: (portfolioReturns: number[], benchmarkReturns: number[]) => Promise<number>;
/**
 * Analyzes up/down capture ratios vs benchmark.
 *
 * @param {number[]} portfolioReturns - Portfolio returns
 * @param {number[]} benchmarkReturns - Benchmark returns
 * @returns {Promise<{ upCapture: number; downCapture: number; captureRatio: number }>} Capture ratios
 *
 * @example
 * ```typescript
 * const capture = await analyzeUpDownCapture(portReturns, bmkReturns);
 * console.log(`Up capture: ${capture.upCapture}%, Down capture: ${capture.downCapture}%`);
 * ```
 */
export declare const analyzeUpDownCapture: (portfolioReturns: number[], benchmarkReturns: number[]) => Promise<{
    upCapture: number;
    downCapture: number;
    captureRatio: number;
}>;
/**
 * Generates comprehensive benchmark comparison report.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {string} benchmarkId - Benchmark ID
 * @param {string} period - Analysis period
 * @returns {Promise<BenchmarkComparison>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const comparison = await generateBenchmarkComparison('PORT-001', 'SPX', '2025-Q1');
 * ```
 */
export declare const generateBenchmarkComparison: (portfolioId: string, benchmarkId: string, period: string) => Promise<BenchmarkComparison>;
/**
 * Performs historical stress test (e.g., 2008 crisis, COVID-19).
 *
 * @param {Portfolio} portfolio - Portfolio to stress test
 * @param {string} historicalEvent - Historical event ('2008_CRISIS' | 'COVID_2020' | 'DOT_COM_BUST')
 * @returns {Promise<StressTestResult>} Stress test results
 *
 * @example
 * ```typescript
 * const stressTest = await performHistoricalStressTest(portfolio, '2008_CRISIS');
 * console.log(`Portfolio loss: ${stressTest.percentageLoss}%`);
 * ```
 */
export declare const performHistoricalStressTest: (portfolio: Portfolio, historicalEvent: string) => Promise<StressTestResult>;
/**
 * Runs hypothetical stress scenarios.
 *
 * @param {Portfolio} portfolio - Portfolio to stress test
 * @param {object} scenario - Scenario parameters
 * @returns {Promise<StressTestResult>} Stress test results
 *
 * @example
 * ```typescript
 * const result = await runHypotheticalStressScenario(portfolio, {
 *   equityShock: -0.30,
 *   bondShock: -0.10,
 *   volatilityShock: 2.0
 * });
 * ```
 */
export declare const runHypotheticalStressScenario: (portfolio: Portfolio, scenario: Record<string, any>) => Promise<StressTestResult>;
/**
 * Analyzes portfolio sensitivity to multiple risk factors.
 *
 * @param {Portfolio} portfolio - Portfolio to analyze
 * @param {Array<{ factor: string; shock: number }>} factorShocks - Factor shocks to apply
 * @returns {Promise<ScenarioAnalysis>} Scenario analysis
 *
 * @example
 * ```typescript
 * const sensitivity = await analyzeScenarioSensitivity(portfolio, [
 *   { factor: 'interestRates', shock: 0.02 },
 *   { factor: 'inflation', shock: 0.03 }
 * ]);
 * ```
 */
export declare const analyzeScenarioSensitivity: (portfolio: Portfolio, factorShocks: Array<{
    factor: string;
    shock: number;
}>) => Promise<ScenarioAnalysis>;
/**
 * Generates reverse stress test (identifies scenarios that would cause unacceptable loss).
 *
 * @param {Portfolio} portfolio - Portfolio to analyze
 * @param {number} maxAcceptableLoss - Maximum acceptable loss (percentage)
 * @returns {Promise<Array<{ scenario: string; probability: number; impact: number }>>} Reverse stress scenarios
 *
 * @example
 * ```typescript
 * const reverseStress = await generateReverseStressTest(portfolio, -20);
 * console.log(`Scenarios that could cause ${maxAcceptableLoss}% loss:`);
 * reverseStress.forEach(s => console.log(`${s.scenario}: ${s.probability}% probability`));
 * ```
 */
export declare const generateReverseStressTest: (portfolio: Portfolio, maxAcceptableLoss: number) => Promise<Array<{
    scenario: string;
    probability: number;
    impact: number;
}>>;
/**
 * Runs Monte Carlo simulation for portfolio returns.
 *
 * @param {Portfolio} portfolio - Portfolio to simulate
 * @param {number} iterations - Number of simulation iterations
 * @param {number} timeHorizon - Time horizon (years)
 * @param {object} [assumptions] - Simulation assumptions
 * @returns {Promise<MonteCarloSimulation>} Monte Carlo results
 *
 * @example
 * ```typescript
 * const simulation = await runMonteCarloSimulation(portfolio, 10000, 10, {
 *   expectedReturn: 0.08,
 *   volatility: 0.15
 * });
 * console.log(`5th percentile outcome: $${simulation.percentile5}`);
 * ```
 */
export declare const runMonteCarloSimulation: (portfolio: Portfolio, iterations: number, timeHorizon: number, assumptions?: Record<string, any>) => Promise<MonteCarloSimulation>;
/**
 * Calculates Value at Risk (VaR) using multiple methods.
 *
 * @param {number[]} returns - Historical returns
 * @param {number} confidenceLevel - Confidence level (e.g., 0.95, 0.99)
 * @param {number} timeHorizon - Time horizon in days
 * @param {string} method - Calculation method ('HISTORICAL' | 'PARAMETRIC' | 'MONTE_CARLO')
 * @returns {Promise<VaRResult>} VaR calculation results
 *
 * @example
 * ```typescript
 * const var95 = await calculateValueAtRisk(returns, 0.95, 1, 'HISTORICAL');
 * console.log(`1-day 95% VaR: $${var95.valueAtRisk}`);
 * ```
 */
export declare const calculateValueAtRisk: (returns: number[], confidenceLevel: number, timeHorizon: number, method: string) => Promise<VaRResult>;
/**
 * Calculates Conditional Value at Risk (CVaR / Expected Shortfall).
 *
 * @param {number[]} returns - Historical returns
 * @param {number} confidenceLevel - Confidence level
 * @returns {Promise<number>} CVaR value
 *
 * @example
 * ```typescript
 * const cvar = await calculateConditionalVaR(returns, 0.95);
 * console.log(`Expected shortfall: ${cvar}%`);
 * ```
 */
export declare const calculateConditionalVaR: (returns: number[], confidenceLevel: number) => Promise<number>;
/**
 * Analyzes maximum drawdown and recovery patterns.
 *
 * @param {number[]} returns - Portfolio returns time series
 * @returns {Promise<DrawdownAnalysis>} Drawdown analysis
 *
 * @example
 * ```typescript
 * const drawdown = await analyzeMaxDrawdown(returns);
 * console.log(`Max drawdown: ${drawdown.maxDrawdown}%`);
 * console.log(`Recovery took ${drawdown.recoveryDuration} days`);
 * ```
 */
export declare const analyzeMaxDrawdown: (returns: number[]) => Promise<DrawdownAnalysis>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createPortfolioModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            portfolioId: string;
            portfolioName: string;
            portfolioType: string;
            managerId: string;
            inceptionDate: Date;
            baseCurrency: string;
            benchmarkId: string;
            totalValue: number;
            cashPosition: number;
            numberOfHoldings: number;
            constraints: Record<string, any>;
            strategy: string | null;
            riskProfile: string;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPortfolioHoldingModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            portfolioId: string;
            securityId: string;
            securityName: string;
            assetClass: string;
            sector: string | null;
            region: string | null;
            quantity: number;
            marketPrice: number;
            marketValue: number;
            costBasis: number;
            averageCost: number;
            weight: number;
            unrealizedGainLoss: number;
            unrealizedGainLossPercent: number;
            lastUpdated: Date;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPerformanceMetricsModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            portfolioId: string;
            period: string;
            periodType: string;
            periodStart: Date;
            periodEnd: Date;
            totalReturn: number;
            annualizedReturn: number;
            volatility: number;
            sharpeRatio: number;
            sortinoRatio: number;
            calmarRatio: number;
            maxDrawdown: number;
            alpha: number;
            beta: number;
            informationRatio: number;
            trackingError: number;
            winRate: number;
            calculatedAt: Date;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    constructOptimalPortfolio: (securityIds: string[], covarianceMatrix: number[][], expectedReturns: number[], constraints?: Record<string, any>) => Promise<OptimizationResult>;
    calculateEfficientFrontier: (securityIds: string[], covarianceMatrix: number[][], expectedReturns: number[], points?: number) => Promise<Array<{
        return: number;
        volatility: number;
        weights: number[];
    }>>;
    optimizeForMaxSharpe: (securityIds: string[], covarianceMatrix: number[][], expectedReturns: number[], riskFreeRate: number) => Promise<OptimizationResult>;
    optimizeForMinVariance: (securityIds: string[], covarianceMatrix: number[][], constraints?: Record<string, any>) => Promise<OptimizationResult>;
    implementRiskParity: (securityIds: string[], covarianceMatrix: number[][]) => Promise<OptimizationResult>;
    applyBlackLitterman: (securityIds: string[], covarianceMatrix: number[][], marketWeights: number[], views: Array<{
        securityId: string;
        view: number;
        confidence: number;
    }>) => Promise<OptimizationResult>;
    validatePortfolioConstraints: (portfolio: Portfolio, constraints: PortfolioConstraints) => Promise<{
        valid: boolean;
        violations: string[];
    }>;
    calculateDiversificationMetrics: (holdings: PortfolioHolding[]) => Promise<{
        herfindahlIndex: number;
        effectiveN: number;
        concentrationRatio: number;
    }>;
    performBrinsonAttribution: (portfolioId: string, benchmarkId: string, period: string) => Promise<PerformanceAttribution>;
    calculateSectorAttribution: (portfolioId: string, period: string) => Promise<Array<{
        sector: string;
        weight: number;
        return: number;
        contribution: number;
    }>>;
    calculateSecurityAttribution: (portfolioId: string, period: string, topN?: number) => Promise<Array<{
        securityId: string;
        weight: number;
        return: number;
        contribution: number;
    }>>;
    analyzeAllocationEffect: (portfolioHoldings: PortfolioHolding[], benchmarkHoldings: PortfolioHolding[], returns: number[]) => Promise<{
        totalAllocationEffect: number;
        sectorEffects: Array<{
            sector: string;
            effect: number;
        }>;
    }>;
    analyzeSelectionEffect: (portfolioHoldings: PortfolioHolding[], benchmarkHoldings: PortfolioHolding[], returns: number[]) => Promise<{
        totalSelectionEffect: number;
        securityEffects: Array<{
            securityId: string;
            effect: number;
        }>;
    }>;
    calculateSharpeRatio: (returns: number[], riskFreeRate: number) => Promise<number>;
    calculateSortinoRatio: (returns: number[], targetReturn: number) => Promise<number>;
    calculateCalmarRatio: (returns: number[]) => Promise<number>;
    calculateTreynorRatio: (returns: number[], marketReturns: number[], riskFreeRate: number) => Promise<number>;
    calculateRiskAdjustedMetrics: (returns: number[], marketReturns: number[], riskFreeRate: number) => Promise<RiskAdjustedMetrics>;
    generateRebalancingPlan: (portfolio: Portfolio, targetAllocation: AssetAllocation, threshold: number) => Promise<RebalancingPlan>;
    implementCalendarRebalancing: (portfolio: Portfolio, targetAllocation: AssetAllocation, frequency: string) => Promise<RebalancingPlan>;
    optimizeRebalancingForTaxes: (portfolio: Portfolio, targetAllocation: AssetAllocation, taxRate: number) => Promise<RebalancingPlan>;
    calculateOptimalRebalancingFrequency: (portfolioId: string, transactionCosts: number, expectedVolatility: number) => Promise<{
        optimalFrequency: string;
        expectedBenefit: number;
    }>;
    simulateRebalancingImpact: (portfolio: Portfolio, plan: RebalancingPlan, periods: number) => Promise<{
        expectedReturn: number;
        expectedVolatility: number;
        sharpeImprovement: number;
    }>;
    determineStrategicAllocation: (riskProfile: string, timeHorizon: number, targetReturn: number) => Promise<AssetAllocation>;
    implementTacticalAllocation: (strategicAllocation: AssetAllocation, marketViews: Array<{
        assetClass: string;
        view: number;
    }>, maxDeviation: number) => Promise<AssetAllocation>;
    implementDynamicAllocation: (portfolioId: string, marketConditions: Record<string, any>) => Promise<AssetAllocation>;
    calculateGlidePath: (currentAge: number, retirementAge: number, targetAge: number) => Promise<AssetAllocation>;
    optimizeForLiabilityMatching: (liabilities: Array<{
        date: Date;
        amount: number;
    }>, currentAssets: number, riskTolerance: number) => Promise<AssetAllocation>;
    performFactorAnalysis: (portfolioReturns: number[], factorReturns: Record<string, number[]>) => Promise<FactorExposure>;
    calculateFactorLoadings: (portfolioId: string, factorNames: string[]) => Promise<Array<{
        factor: string;
        loading: number;
        tStat: number;
        pValue: number;
    }>>;
    analyzeStyleDrift: (currentExposure: FactorExposure, targetExposure: FactorExposure) => Promise<Array<{
        factor: string;
        drift: number;
        significant: boolean;
    }>>;
    decomposeRiskByFactors: (factorExposure: FactorExposure, factorCovarianceMatrix: number[][]) => Promise<Array<{
        factor: string;
        riskContribution: number;
        percentageOfRisk: number;
    }>>;
    identifyFactorTilts: (factorExposure: FactorExposure, threshold: number) => Promise<Array<{
        factor: string;
        tilt: number;
        direction: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
    }>>;
    calculateTrackingError: (portfolioReturns: number[], benchmarkReturns: number[]) => Promise<number>;
    calculateInformationRatio: (portfolioReturns: number[], benchmarkReturns: number[]) => Promise<number>;
    analyzeUpDownCapture: (portfolioReturns: number[], benchmarkReturns: number[]) => Promise<{
        upCapture: number;
        downCapture: number;
        captureRatio: number;
    }>;
    generateBenchmarkComparison: (portfolioId: string, benchmarkId: string, period: string) => Promise<BenchmarkComparison>;
    performHistoricalStressTest: (portfolio: Portfolio, historicalEvent: string) => Promise<StressTestResult>;
    runHypotheticalStressScenario: (portfolio: Portfolio, scenario: Record<string, any>) => Promise<StressTestResult>;
    analyzeScenarioSensitivity: (portfolio: Portfolio, factorShocks: Array<{
        factor: string;
        shock: number;
    }>) => Promise<ScenarioAnalysis>;
    generateReverseStressTest: (portfolio: Portfolio, maxAcceptableLoss: number) => Promise<Array<{
        scenario: string;
        probability: number;
        impact: number;
    }>>;
    runMonteCarloSimulation: (portfolio: Portfolio, iterations: number, timeHorizon: number, assumptions?: Record<string, any>) => Promise<MonteCarloSimulation>;
    calculateValueAtRisk: (returns: number[], confidenceLevel: number, timeHorizon: number, method: string) => Promise<VaRResult>;
    calculateConditionalVaR: (returns: number[], confidenceLevel: number) => Promise<number>;
    analyzeMaxDrawdown: (returns: number[]) => Promise<DrawdownAnalysis>;
};
export default _default;
//# sourceMappingURL=portfolio-analytics-kit.d.ts.map