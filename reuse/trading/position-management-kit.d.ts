/**
 * LOC: TRD-POS-002
 * File: /reuse/trading/position-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Op, Transaction)
 *   - decimal.js (Decimal for precise calculations)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/portfolio/*
 *   - backend/controllers/position.controller.ts
 *   - backend/services/position-management.service.ts
 */
import Decimal from 'decimal.js';
type Price = Decimal & {
    readonly __brand: 'Price';
};
type Quantity = Decimal & {
    readonly __brand: 'Quantity';
};
type NotionalValue = Decimal & {
    readonly __brand: 'NotionalValue';
};
type Percentage = Decimal & {
    readonly __brand: 'Percentage';
};
type ExposureValue = Decimal & {
    readonly __brand: 'ExposureValue';
};
type RiskValue = Decimal & {
    readonly __brand: 'RiskValue';
};
declare const createPrice: (value: Decimal.Value) => Price;
declare const createQuantity: (value: Decimal.Value) => Quantity;
declare const createNotional: (value: Decimal.Value) => NotionalValue;
declare const createPercentage: (value: Decimal.Value) => Percentage;
declare const createExposure: (value: Decimal.Value) => ExposureValue;
declare const createRiskValue: (value: Decimal.Value) => RiskValue;
type PositionSide = 'LONG' | 'SHORT';
type PositionStatus = 'OPEN' | 'CLOSED' | 'PARTIAL' | 'PENDING';
type AssetClass = 'EQUITY' | 'FIXED_INCOME' | 'COMMODITY' | 'FX' | 'DERIVATIVE' | 'CRYPTO' | 'CASH';
type InstrumentType = 'STOCK' | 'BOND' | 'OPTION' | 'FUTURE' | 'SWAP' | 'FX_SPOT' | 'FX_FORWARD';
interface Position {
    positionId: string;
    accountId: string;
    portfolioId: string;
    instrumentId: string;
    symbol: string;
    assetClass: AssetClass;
    instrumentType: InstrumentType;
    side: PositionSide;
    quantity: Quantity;
    averagePrice: Price;
    currentPrice: Price;
    marketValue: NotionalValue;
    costBasis: NotionalValue;
    unrealizedPnL: Decimal;
    currency: string;
    entryDate: Date;
    lastUpdated: Date;
    status: PositionStatus;
    metadata: Record<string, any>;
}
interface AggregatedPosition {
    instrumentId: string;
    symbol: string;
    assetClass: AssetClass;
    totalQuantity: Quantity;
    weightedAvgPrice: Price;
    totalMarketValue: NotionalValue;
    totalCostBasis: NotionalValue;
    totalUnrealizedPnL: Decimal;
    netExposure: ExposureValue;
    accounts: string[];
    positions: Position[];
}
interface ExposureReport {
    totalGrossExposure: ExposureValue;
    totalNetExposure: ExposureValue;
    longExposure: ExposureValue;
    shortExposure: ExposureValue;
    leverage: Decimal;
    byAssetClass: Map<AssetClass, ExposureValue>;
    bySector: Map<string, ExposureValue>;
    byGeography: Map<string, ExposureValue>;
    byInstrument: Map<string, ExposureValue>;
    timestamp: Date;
}
interface PositionLimit {
    limitId: string;
    limitType: 'HARD' | 'SOFT' | 'WARNING';
    scope: 'POSITION' | 'SECTOR' | 'ASSET_CLASS' | 'PORTFOLIO' | 'ACCOUNT';
    category: string;
    maxNotional: NotionalValue;
    maxPercentage: Percentage;
    currentNotional: NotionalValue;
    currentPercentage: Percentage;
    utilization: Percentage;
    status: 'OK' | 'WARNING' | 'BREACH';
}
interface LimitCheckResult {
    passed: boolean;
    violations: LimitViolation[];
    warnings: LimitWarning[];
    approvalRequired: boolean;
}
interface LimitViolation {
    limitId: string;
    limitType: 'HARD' | 'SOFT';
    scope: string;
    category: string;
    currentValue: NotionalValue;
    limitValue: NotionalValue;
    excess: NotionalValue;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}
interface LimitWarning {
    limitId: string;
    scope: string;
    category: string;
    currentUtilization: Percentage;
    warningThreshold: Percentage;
    message: string;
}
interface PositionSizingParameters {
    strategy: 'FIXED_FRACTIONAL' | 'KELLY_CRITERION' | 'VOLATILITY_BASED' | 'RISK_PARITY' | 'EQUAL_WEIGHT';
    riskPerTrade?: Percentage;
    winRate?: Percentage;
    avgWinLoss?: Decimal;
    volatilityTarget?: Percentage;
    portfolioValue: NotionalValue;
    stopLoss?: Price;
    entryPrice: Price;
    instrumentVolatility?: Percentage;
}
interface PositionSize {
    recommendedQuantity: Quantity;
    recommendedNotional: NotionalValue;
    percentOfPortfolio: Percentage;
    riskAmount: NotionalValue;
    methodology: string;
    confidence: Percentage;
    adjustments: string[];
}
interface RebalanceRecommendation {
    instrumentId: string;
    symbol: string;
    currentWeight: Percentage;
    targetWeight: Percentage;
    drift: Percentage;
    action: 'BUY' | 'SELL' | 'HOLD';
    quantity: Quantity;
    notionalValue: NotionalValue;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}
interface RiskMetrics {
    valueAtRisk: RiskValue;
    conditionalVaR: RiskValue;
    beta: Decimal;
    sharpeRatio: Decimal;
    volatility: Percentage;
    correlationMatrix?: Map<string, Map<string, Decimal>>;
    trackingError?: Percentage;
    informationRatio?: Decimal;
}
interface ConcentrationAnalysis {
    singlePositionMax: Percentage;
    top5Concentration: Percentage;
    top10Concentration: Percentage;
    herfindahlIndex: Decimal;
    effectiveN: Decimal;
    breaches: ConcentrationBreach[];
}
interface ConcentrationBreach {
    type: 'SINGLE_POSITION' | 'SECTOR' | 'GEOGRAPHY' | 'ASSET_CLASS';
    identifier: string;
    currentConcentration: Percentage;
    limit: Percentage;
    excess: Percentage;
}
interface CurrencyExposure {
    currency: string;
    exposure: ExposureValue;
    percentOfPortfolio: Percentage;
    hedgeRatio: Percentage;
    unhedgedExposure: ExposureValue;
}
/**
 * Create a new position record
 * @param positionData - Position data
 * @returns Created position
 */
export declare function createPosition(positionData: Omit<Position, 'positionId' | 'lastUpdated' | 'status'>): Position;
/**
 * Update position with new market price
 * @param position - Existing position
 * @param newPrice - New market price
 * @returns Updated position
 */
export declare function updatePositionPrice(position: Position, newPrice: Price): Position;
/**
 * Add to existing position (increase size)
 * @param position - Existing position
 * @param additionalQuantity - Additional quantity
 * @param executionPrice - Execution price for addition
 * @returns Updated position with new average price
 */
export declare function increasePosition(position: Position, additionalQuantity: Quantity, executionPrice: Price): Position;
/**
 * Reduce position (partial close)
 * @param position - Existing position
 * @param quantityToClose - Quantity to close
 * @param executionPrice - Execution price
 * @returns Updated position and realized P&L
 */
export declare function reducePosition(position: Position, quantityToClose: Quantity, executionPrice: Price): {
    updatedPosition: Position;
    realizedPnL: Decimal;
};
/**
 * Close position completely
 * @param position - Position to close
 * @param executionPrice - Final execution price
 * @returns Closed position and realized P&L
 */
export declare function closePosition(position: Position, executionPrice: Price): {
    closedPosition: Position;
    realizedPnL: Decimal;
};
/**
 * Get all open positions for an account
 * @param positions - All positions
 * @param accountId - Account identifier
 * @returns Open positions for account
 */
export declare function getOpenPositions(positions: Position[], accountId?: string): Position[];
/**
 * Get position by instrument
 * @param positions - All positions
 * @param instrumentId - Instrument identifier
 * @param accountId - Optional account filter
 * @returns Position or null
 */
export declare function getPositionByInstrument(positions: Position[], instrumentId: string, accountId?: string): Position | null;
/**
 * Aggregate positions across multiple accounts
 * @param positions - All positions to aggregate
 * @param groupBy - Grouping criteria ('instrument' | 'assetClass' | 'sector')
 * @returns Aggregated positions
 */
export declare function aggregatePositions(positions: Position[], groupBy?: 'instrument' | 'assetClass' | 'sector'): AggregatedPosition[];
/**
 * Aggregate positions by portfolio
 * @param positions - All positions
 * @param portfolioId - Portfolio identifier
 * @returns Portfolio-level aggregation
 */
export declare function aggregateByPortfolio(positions: Position[], portfolioId: string): AggregatedPosition[];
/**
 * Calculate portfolio totals
 * @param positions - All positions in portfolio
 * @returns Portfolio totals
 */
export declare function calculatePortfolioTotals(positions: Position[]): {
    totalMarketValue: NotionalValue;
    totalCostBasis: NotionalValue;
    totalUnrealizedPnL: Decimal;
    totalReturnPercent: Percentage;
    positionCount: number;
};
/**
 * Calculate net exposure for portfolio
 * @param positions - All positions
 * @returns Net exposure (long - short)
 */
export declare function calculateNetExposure(positions: Position[]): ExposureValue;
/**
 * Calculate gross exposure for portfolio
 * @param positions - All positions
 * @returns Gross exposure (sum of absolute values)
 */
export declare function calculateGrossExposure(positions: Position[]): ExposureValue;
/**
 * Calculate long exposure
 * @param positions - All positions
 * @returns Total long exposure
 */
export declare function calculateLongExposure(positions: Position[]): ExposureValue;
/**
 * Calculate short exposure
 * @param positions - All positions
 * @returns Total short exposure (as positive number)
 */
export declare function calculateShortExposure(positions: Position[]): ExposureValue;
/**
 * Generate comprehensive exposure report
 * @param positions - All positions
 * @param portfolioValue - Total portfolio value
 * @returns Detailed exposure report
 */
export declare function generateExposureReport(positions: Position[], portfolioValue: NotionalValue): ExposureReport;
/**
 * Calculate long/short ratio
 * @param positions - All positions
 * @returns Long/short ratio
 */
export declare function calculateLongShortRatio(positions: Position[]): Decimal;
/**
 * Analyze long/short balance
 * @param positions - All positions
 * @returns Long/short analysis
 */
export declare function analyzeLongShortBalance(positions: Position[]): {
    longExposure: ExposureValue;
    shortExposure: ExposureValue;
    netExposure: ExposureValue;
    ratio: Decimal;
    balance: 'LONG_HEAVY' | 'SHORT_HEAVY' | 'BALANCED' | 'NEUTRAL';
    longPercentage: Percentage;
    shortPercentage: Percentage;
};
/**
 * Check position against limits
 * @param position - Position to check
 * @param limits - Applicable limits
 * @returns Limit check result
 */
export declare function checkPositionLimits(position: Position, limits: PositionLimit[]): LimitCheckResult;
/**
 * Calculate position limit utilization
 * @param positions - All positions
 * @param limit - Limit to check
 * @returns Utilization percentage
 */
export declare function calculateLimitUtilization(positions: Position[], limit: PositionLimit): Percentage;
/**
 * Calculate position size using fixed fractional method
 * @param params - Sizing parameters
 * @returns Recommended position size
 */
export declare function calculateFixedFractionalSize(params: PositionSizingParameters): PositionSize;
/**
 * Calculate position size using Kelly Criterion
 * @param params - Sizing parameters
 * @returns Recommended position size
 */
export declare function calculateKellyCriterionSize(params: PositionSizingParameters): PositionSize;
/**
 * Calculate position size using volatility-based method
 * @param params - Sizing parameters
 * @returns Recommended position size
 */
export declare function calculateVolatilityBasedSize(params: PositionSizingParameters): PositionSize;
/**
 * Calculate position size using risk parity
 * @param params - Sizing parameters
 * @param allPositions - All existing positions for risk parity calculation
 * @returns Recommended position size
 */
export declare function calculateRiskParitySize(params: PositionSizingParameters, allPositions: Position[]): PositionSize;
/**
 * Generate rebalancing recommendations
 * @param currentPositions - Current portfolio positions
 * @param targetWeights - Target weight for each instrument
 * @param portfolioValue - Total portfolio value
 * @param rebalanceThreshold - Drift threshold to trigger rebalance (percentage points)
 * @returns Rebalancing recommendations
 */
export declare function generateRebalanceRecommendations(currentPositions: Position[], targetWeights: Map<string, Percentage>, portfolioValue: NotionalValue, rebalanceThreshold?: Percentage): RebalanceRecommendation[];
/**
 * Calculate rebalancing costs
 * @param recommendations - Rebalancing recommendations
 * @param commissionRate - Commission rate (percentage)
 * @param spreadCost - Bid-ask spread cost (percentage)
 * @returns Total rebalancing cost
 */
export declare function calculateRebalancingCosts(recommendations: RebalanceRecommendation[], commissionRate?: Percentage, spreadCost?: Percentage): {
    totalCommissions: NotionalValue;
    totalSpreadCost: NotionalValue;
    totalCost: NotionalValue;
    costAsPercentOfPortfolio: Percentage;
};
/**
 * Calculate Value at Risk (VaR) for position
 * @param position - Position to analyze
 * @param historicalReturns - Historical returns for the instrument
 * @param confidenceLevel - Confidence level (typically 0.95 or 0.99)
 * @returns VaR value
 */
export declare function calculatePositionVaR(position: Position, historicalReturns: Decimal[], confidenceLevel?: number): RiskValue;
/**
 * Calculate Expected Shortfall (Conditional VaR)
 * @param position - Position to analyze
 * @param historicalReturns - Historical returns
 * @param confidenceLevel - Confidence level
 * @returns Expected Shortfall value
 */
export declare function calculateExpectedShortfall(position: Position, historicalReturns: Decimal[], confidenceLevel?: number): RiskValue;
/**
 * Calculate position beta against benchmark
 * @param positionReturns - Position returns
 * @param benchmarkReturns - Benchmark returns
 * @returns Beta coefficient
 */
export declare function calculatePositionBeta(positionReturns: Decimal[], benchmarkReturns: Decimal[]): Decimal;
/**
 * Analyze portfolio concentration
 * @param positions - All positions
 * @param portfolioValue - Total portfolio value
 * @param limits - Concentration limits
 * @returns Concentration analysis
 */
export declare function analyzeConcentration(positions: Position[], portfolioValue: NotionalValue, limits: {
    singlePosition: Percentage;
    top5: Percentage;
    top10: Percentage;
}): ConcentrationAnalysis;
/**
 * Calculate currency exposure
 * @param positions - All positions
 * @param portfolioValue - Total portfolio value in base currency
 * @param fxRates - FX rates to base currency
 * @returns Currency exposure breakdown
 */
export declare function calculateCurrencyExposure(positions: Position[], portfolioValue: NotionalValue, fxRates: Map<string, Decimal>): CurrencyExposure[];
/**
 * Convert position to base currency
 * @param position - Position in foreign currency
 * @param fxRate - FX rate to base currency
 * @returns Position value in base currency
 */
export declare function convertToBaseCurrency(position: Position, fxRate: Decimal): NotionalValue;
export type { Position, AggregatedPosition, ExposureReport, PositionLimit, LimitCheckResult, LimitViolation, LimitWarning, PositionSizingParameters, PositionSize, RebalanceRecommendation, RiskMetrics, ConcentrationAnalysis, ConcentrationBreach, CurrencyExposure, PositionSide, PositionStatus, AssetClass, InstrumentType, Price, Quantity, NotionalValue, Percentage, ExposureValue, RiskValue, };
export { createPrice, createQuantity, createNotional, createPercentage, createExposure, createRiskValue, };
//# sourceMappingURL=position-management-kit.d.ts.map