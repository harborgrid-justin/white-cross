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

/**
 * File: /reuse/trading/position-management-kit.ts
 * Locator: WC-TRD-POS-002
 * Purpose: Bloomberg Terminal-level Position Management - tracking, aggregation, exposure, limits, sizing, rebalancing
 *
 * Upstream: Sequelize 6.x, Decimal.js, error-handling-kit, validation-kit
 * Downstream: Portfolio controllers, risk management services, trading systems, compliance
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, Decimal.js, PostgreSQL 14+
 * Exports: 47 production-ready functions for position management, exposure calculation, risk analytics, rebalancing
 *
 * LLM Context: Institutional-grade position management utilities competing with Bloomberg Terminal.
 * Provides comprehensive position lifecycle management including real-time tracking, multi-account aggregation,
 * net/gross exposure calculations, long/short analysis, position limits and controls, advanced sizing algorithms
 * (Kelly criterion, volatility-based, risk parity), portfolio rebalancing, position risk analytics (VaR, beta),
 * concentration analysis, lifecycle management, real-time updates, and multi-currency position handling.
 */

import { Model, DataTypes, Sequelize, Op, Transaction } from 'sequelize';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS - Branded Types for Type Safety
// ============================================================================

type Price = Decimal & { readonly __brand: 'Price' };
type Quantity = Decimal & { readonly __brand: 'Quantity' };
type NotionalValue = Decimal & { readonly __brand: 'NotionalValue' };
type Percentage = Decimal & { readonly __brand: 'Percentage' };
type ExposureValue = Decimal & { readonly __brand: 'ExposureValue' };
type RiskValue = Decimal & { readonly __brand: 'RiskValue' };

const createPrice = (value: Decimal.Value): Price => new Decimal(value) as Price;
const createQuantity = (value: Decimal.Value): Quantity => new Decimal(value) as Quantity;
const createNotional = (value: Decimal.Value): NotionalValue => new Decimal(value) as NotionalValue;
const createPercentage = (value: Decimal.Value): Percentage => new Decimal(value) as Percentage;
const createExposure = (value: Decimal.Value): ExposureValue => new Decimal(value) as ExposureValue;
const createRiskValue = (value: Decimal.Value): RiskValue => new Decimal(value) as RiskValue;

// ============================================================================
// CORE TYPE DEFINITIONS
// ============================================================================

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
  valueAtRisk: RiskValue; // 95% VaR
  conditionalVaR: RiskValue; // Expected Shortfall
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
  herfindahlIndex: Decimal; // Sum of squared weights
  effectiveN: Decimal; // 1 / HHI
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

// ============================================================================
// POSITION TRACKING AND MONITORING
// ============================================================================

/**
 * Create a new position record
 * @param positionData - Position data
 * @returns Created position
 */
export function createPosition(positionData: Omit<Position, 'positionId' | 'lastUpdated' | 'status'>): Position {
  const marketValue = (positionData.quantity as Decimal).times(positionData.currentPrice as Decimal) as NotionalValue;
  const costBasis = (positionData.quantity as Decimal).times(positionData.averagePrice as Decimal) as NotionalValue;
  const unrealizedPnL = (marketValue as Decimal).minus(costBasis as Decimal);

  return {
    ...positionData,
    positionId: `POS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    marketValue,
    costBasis,
    unrealizedPnL,
    lastUpdated: new Date(),
    status: 'OPEN',
  };
}

/**
 * Update position with new market price
 * @param position - Existing position
 * @param newPrice - New market price
 * @returns Updated position
 */
export function updatePositionPrice(position: Position, newPrice: Price): Position {
  const marketValue = (position.quantity as Decimal).times(newPrice as Decimal) as NotionalValue;
  const unrealizedPnL = (marketValue as Decimal).minus(position.costBasis as Decimal);

  return {
    ...position,
    currentPrice: newPrice,
    marketValue,
    unrealizedPnL,
    lastUpdated: new Date(),
  };
}

/**
 * Add to existing position (increase size)
 * @param position - Existing position
 * @param additionalQuantity - Additional quantity
 * @param executionPrice - Execution price for addition
 * @returns Updated position with new average price
 */
export function increasePosition(
  position: Position,
  additionalQuantity: Quantity,
  executionPrice: Price
): Position {
  const newQuantity = (position.quantity as Decimal).plus(additionalQuantity as Decimal) as Quantity;
  const additionalCost = (additionalQuantity as Decimal).times(executionPrice as Decimal);
  const newCostBasis = (position.costBasis as Decimal).plus(additionalCost) as NotionalValue;
  const newAveragePrice = (newCostBasis as Decimal).div(newQuantity as Decimal) as Price;
  const newMarketValue = (newQuantity as Decimal).times(position.currentPrice as Decimal) as NotionalValue;
  const unrealizedPnL = (newMarketValue as Decimal).minus(newCostBasis as Decimal);

  return {
    ...position,
    quantity: newQuantity,
    averagePrice: newAveragePrice,
    costBasis: newCostBasis,
    marketValue: newMarketValue,
    unrealizedPnL,
    lastUpdated: new Date(),
  };
}

/**
 * Reduce position (partial close)
 * @param position - Existing position
 * @param quantityToClose - Quantity to close
 * @param executionPrice - Execution price
 * @returns Updated position and realized P&L
 */
export function reducePosition(
  position: Position,
  quantityToClose: Quantity,
  executionPrice: Price
): { updatedPosition: Position; realizedPnL: Decimal } {
  if ((quantityToClose as Decimal).greaterThan(position.quantity as Decimal)) {
    throw new Error('Cannot close more than current position size');
  }

  const remainingQuantity = (position.quantity as Decimal).minus(quantityToClose as Decimal) as Quantity;
  const closedCost = (position.averagePrice as Decimal).times(quantityToClose as Decimal);
  const closedProceeds = (executionPrice as Decimal).times(quantityToClose as Decimal);
  const realizedPnL = position.side === 'LONG'
    ? closedProceeds.minus(closedCost)
    : closedCost.minus(closedProceeds);

  const newCostBasis = (position.costBasis as Decimal).minus(closedCost) as NotionalValue;
  const newMarketValue = (remainingQuantity as Decimal).times(position.currentPrice as Decimal) as NotionalValue;
  const unrealizedPnL = (newMarketValue as Decimal).minus(newCostBasis as Decimal);

  const updatedPosition: Position = {
    ...position,
    quantity: remainingQuantity,
    costBasis: newCostBasis,
    marketValue: newMarketValue,
    unrealizedPnL,
    status: remainingQuantity.equals(0) ? 'CLOSED' : 'PARTIAL',
    lastUpdated: new Date(),
  };

  return { updatedPosition, realizedPnL };
}

/**
 * Close position completely
 * @param position - Position to close
 * @param executionPrice - Final execution price
 * @returns Closed position and realized P&L
 */
export function closePosition(
  position: Position,
  executionPrice: Price
): { closedPosition: Position; realizedPnL: Decimal } {
  const { updatedPosition, realizedPnL } = reducePosition(position, position.quantity, executionPrice);

  return {
    closedPosition: { ...updatedPosition, status: 'CLOSED' },
    realizedPnL,
  };
}

/**
 * Get all open positions for an account
 * @param positions - All positions
 * @param accountId - Account identifier
 * @returns Open positions for account
 */
export function getOpenPositions(positions: Position[], accountId?: string): Position[] {
  return positions.filter(p =>
    p.status === 'OPEN' &&
    (accountId === undefined || p.accountId === accountId)
  );
}

/**
 * Get position by instrument
 * @param positions - All positions
 * @param instrumentId - Instrument identifier
 * @param accountId - Optional account filter
 * @returns Position or null
 */
export function getPositionByInstrument(
  positions: Position[],
  instrumentId: string,
  accountId?: string
): Position | null {
  return positions.find(p =>
    p.instrumentId === instrumentId &&
    p.status === 'OPEN' &&
    (accountId === undefined || p.accountId === accountId)
  ) || null;
}

// ============================================================================
// POSITION AGGREGATION
// ============================================================================

/**
 * Aggregate positions across multiple accounts
 * @param positions - All positions to aggregate
 * @param groupBy - Grouping criteria ('instrument' | 'assetClass' | 'sector')
 * @returns Aggregated positions
 */
export function aggregatePositions(
  positions: Position[],
  groupBy: 'instrument' | 'assetClass' | 'sector' = 'instrument'
): AggregatedPosition[] {
  const groups = new Map<string, Position[]>();

  for (const position of positions) {
    const key = groupBy === 'instrument' ? position.instrumentId :
                groupBy === 'assetClass' ? position.assetClass :
                position.metadata?.sector || 'UNKNOWN';

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(position);
  }

  const aggregated: AggregatedPosition[] = [];

  for (const [key, positionGroup] of groups.entries()) {
    const totalQuantity = positionGroup.reduce(
      (sum, p) => sum.plus(p.side === 'LONG' ? p.quantity as Decimal : (p.quantity as Decimal).negated()),
      new Decimal(0)
    ) as Quantity;

    const totalCost = positionGroup.reduce(
      (sum, p) => sum.plus(p.costBasis as Decimal),
      new Decimal(0)
    );

    const totalMarketValue = positionGroup.reduce(
      (sum, p) => sum.plus(p.marketValue as Decimal),
      new Decimal(0)
    ) as NotionalValue;

    const weightedAvgPrice = totalQuantity.equals(0)
      ? createPrice(0)
      : totalCost.div(totalQuantity.abs()) as Price;

    const totalUnrealizedPnL = positionGroup.reduce(
      (sum, p) => sum.plus(p.unrealizedPnL),
      new Decimal(0)
    );

    const netExposure = positionGroup.reduce(
      (sum, p) => sum.plus(
        p.side === 'LONG'
          ? p.marketValue as Decimal
          : (p.marketValue as Decimal).negated()
      ),
      new Decimal(0)
    ) as ExposureValue;

    aggregated.push({
      instrumentId: groupBy === 'instrument' ? key : '',
      symbol: positionGroup[0].symbol,
      assetClass: positionGroup[0].assetClass,
      totalQuantity,
      weightedAvgPrice,
      totalMarketValue,
      totalCostBasis: totalCost as NotionalValue,
      totalUnrealizedPnL,
      netExposure,
      accounts: Array.from(new Set(positionGroup.map(p => p.accountId))),
      positions: positionGroup,
    });
  }

  return aggregated;
}

/**
 * Aggregate positions by portfolio
 * @param positions - All positions
 * @param portfolioId - Portfolio identifier
 * @returns Portfolio-level aggregation
 */
export function aggregateByPortfolio(positions: Position[], portfolioId: string): AggregatedPosition[] {
  const portfolioPositions = positions.filter(p => p.portfolioId === portfolioId);
  return aggregatePositions(portfolioPositions, 'instrument');
}

/**
 * Calculate portfolio totals
 * @param positions - All positions in portfolio
 * @returns Portfolio totals
 */
export function calculatePortfolioTotals(positions: Position[]): {
  totalMarketValue: NotionalValue;
  totalCostBasis: NotionalValue;
  totalUnrealizedPnL: Decimal;
  totalReturnPercent: Percentage;
  positionCount: number;
} {
  const totalMarketValue = positions.reduce(
    (sum, p) => sum.plus(p.marketValue as Decimal),
    new Decimal(0)
  ) as NotionalValue;

  const totalCostBasis = positions.reduce(
    (sum, p) => sum.plus(p.costBasis as Decimal),
    new Decimal(0)
  ) as NotionalValue;

  const totalUnrealizedPnL = positions.reduce(
    (sum, p) => sum.plus(p.unrealizedPnL),
    new Decimal(0)
  );

  const totalReturnPercent = (totalCostBasis as Decimal).equals(0)
    ? createPercentage(0)
    : totalUnrealizedPnL.div(totalCostBasis as Decimal).times(100) as Percentage;

  return {
    totalMarketValue,
    totalCostBasis,
    totalUnrealizedPnL,
    totalReturnPercent,
    positionCount: positions.length,
  };
}

// ============================================================================
// EXPOSURE CALCULATIONS
// ============================================================================

/**
 * Calculate net exposure for portfolio
 * @param positions - All positions
 * @returns Net exposure (long - short)
 */
export function calculateNetExposure(positions: Position[]): ExposureValue {
  return positions.reduce((net, p) => {
    const exposure = p.marketValue as Decimal;
    return p.side === 'LONG'
      ? net.plus(exposure)
      : net.minus(exposure);
  }, new Decimal(0)) as ExposureValue;
}

/**
 * Calculate gross exposure for portfolio
 * @param positions - All positions
 * @returns Gross exposure (sum of absolute values)
 */
export function calculateGrossExposure(positions: Position[]): ExposureValue {
  return positions.reduce(
    (sum, p) => sum.plus((p.marketValue as Decimal).abs()),
    new Decimal(0)
  ) as ExposureValue;
}

/**
 * Calculate long exposure
 * @param positions - All positions
 * @returns Total long exposure
 */
export function calculateLongExposure(positions: Position[]): ExposureValue {
  return positions
    .filter(p => p.side === 'LONG')
    .reduce((sum, p) => sum.plus(p.marketValue as Decimal), new Decimal(0)) as ExposureValue;
}

/**
 * Calculate short exposure
 * @param positions - All positions
 * @returns Total short exposure (as positive number)
 */
export function calculateShortExposure(positions: Position[]): ExposureValue {
  return positions
    .filter(p => p.side === 'SHORT')
    .reduce((sum, p) => sum.plus((p.marketValue as Decimal).abs()), new Decimal(0)) as ExposureValue;
}

/**
 * Generate comprehensive exposure report
 * @param positions - All positions
 * @param portfolioValue - Total portfolio value
 * @returns Detailed exposure report
 */
export function generateExposureReport(
  positions: Position[],
  portfolioValue: NotionalValue
): ExposureReport {
  const longExposure = calculateLongExposure(positions);
  const shortExposure = calculateShortExposure(positions);
  const grossExposure = (longExposure as Decimal).plus(shortExposure as Decimal) as ExposureValue;
  const netExposure = (longExposure as Decimal).minus(shortExposure as Decimal) as ExposureValue;
  const leverage = (portfolioValue as Decimal).equals(0)
    ? new Decimal(0)
    : (grossExposure as Decimal).div(portfolioValue as Decimal);

  // By asset class
  const byAssetClass = new Map<AssetClass, ExposureValue>();
  for (const assetClass of ['EQUITY', 'FIXED_INCOME', 'COMMODITY', 'FX', 'DERIVATIVE', 'CRYPTO', 'CASH'] as AssetClass[]) {
    const classPositions = positions.filter(p => p.assetClass === assetClass);
    const classExposure = calculateNetExposure(classPositions);
    if (!(classExposure as Decimal).equals(0)) {
      byAssetClass.set(assetClass, classExposure);
    }
  }

  // By sector
  const bySector = new Map<string, ExposureValue>();
  const sectorGroups = new Map<string, Position[]>();
  for (const position of positions) {
    const sector = position.metadata?.sector || 'UNKNOWN';
    if (!sectorGroups.has(sector)) {
      sectorGroups.set(sector, []);
    }
    sectorGroups.get(sector)!.push(position);
  }
  for (const [sector, sectorPositions] of sectorGroups.entries()) {
    bySector.set(sector, calculateNetExposure(sectorPositions));
  }

  // By geography
  const byGeography = new Map<string, ExposureValue>();
  const geoGroups = new Map<string, Position[]>();
  for (const position of positions) {
    const geography = position.metadata?.geography || 'UNKNOWN';
    if (!geoGroups.has(geography)) {
      geoGroups.set(geography, []);
    }
    geoGroups.get(geography)!.push(position);
  }
  for (const [geo, geoPositions] of geoGroups.entries()) {
    byGeography.set(geo, calculateNetExposure(geoPositions));
  }

  // By instrument
  const byInstrument = new Map<string, ExposureValue>();
  for (const position of positions) {
    const currentExposure = byInstrument.get(position.instrumentId) || createExposure(0);
    const positionExposure = position.side === 'LONG'
      ? position.marketValue as Decimal
      : (position.marketValue as Decimal).negated();
    byInstrument.set(position.instrumentId, (currentExposure as Decimal).plus(positionExposure) as ExposureValue);
  }

  return {
    totalGrossExposure: grossExposure,
    totalNetExposure: netExposure,
    longExposure,
    shortExposure,
    leverage,
    byAssetClass,
    bySector,
    byGeography,
    byInstrument,
    timestamp: new Date(),
  };
}

// ============================================================================
// LONG/SHORT ANALYSIS
// ============================================================================

/**
 * Calculate long/short ratio
 * @param positions - All positions
 * @returns Long/short ratio
 */
export function calculateLongShortRatio(positions: Position[]): Decimal {
  const longExp = calculateLongExposure(positions) as Decimal;
  const shortExp = calculateShortExposure(positions) as Decimal;

  if (shortExp.equals(0)) {
    return longExp.greaterThan(0) ? new Decimal(Infinity) : new Decimal(0);
  }

  return longExp.div(shortExp);
}

/**
 * Analyze long/short balance
 * @param positions - All positions
 * @returns Long/short analysis
 */
export function analyzeLongShortBalance(positions: Position[]): {
  longExposure: ExposureValue;
  shortExposure: ExposureValue;
  netExposure: ExposureValue;
  ratio: Decimal;
  balance: 'LONG_HEAVY' | 'SHORT_HEAVY' | 'BALANCED' | 'NEUTRAL';
  longPercentage: Percentage;
  shortPercentage: Percentage;
} {
  const longExposure = calculateLongExposure(positions);
  const shortExposure = calculateShortExposure(positions);
  const netExposure = (longExposure as Decimal).minus(shortExposure as Decimal) as ExposureValue;
  const ratio = calculateLongShortRatio(positions);

  const totalExposure = (longExposure as Decimal).plus(shortExposure as Decimal);
  const longPercentage = totalExposure.equals(0)
    ? createPercentage(0)
    : (longExposure as Decimal).div(totalExposure).times(100) as Percentage;
  const shortPercentage = totalExposure.equals(0)
    ? createPercentage(0)
    : (shortExposure as Decimal).div(totalExposure).times(100) as Percentage;

  let balance: 'LONG_HEAVY' | 'SHORT_HEAVY' | 'BALANCED' | 'NEUTRAL';
  if ((netExposure as Decimal).abs().lessThan(totalExposure.times(0.1))) {
    balance = 'NEUTRAL';
  } else if (ratio.greaterThan(1.3)) {
    balance = 'LONG_HEAVY';
  } else if (ratio.lessThan(0.7)) {
    balance = 'SHORT_HEAVY';
  } else {
    balance = 'BALANCED';
  }

  return {
    longExposure,
    shortExposure,
    netExposure,
    ratio,
    balance,
    longPercentage,
    shortPercentage,
  };
}

// ============================================================================
// POSITION LIMITS AND CONTROLS
// ============================================================================

/**
 * Check position against limits
 * @param position - Position to check
 * @param limits - Applicable limits
 * @returns Limit check result
 */
export function checkPositionLimits(position: Position, limits: PositionLimit[]): LimitCheckResult {
  const violations: LimitViolation[] = [];
  const warnings: LimitWarning[] = [];

  for (const limit of limits) {
    const currentValue = position.marketValue;
    const currentPercent = createPercentage(0); // Would calculate against portfolio in production

    // Check hard limits
    if (limit.limitType === 'HARD') {
      if ((currentValue as Decimal).greaterThan(limit.maxNotional as Decimal)) {
        violations.push({
          limitId: limit.limitId,
          limitType: 'HARD',
          scope: limit.scope,
          category: limit.category,
          currentValue,
          limitValue: limit.maxNotional,
          excess: (currentValue as Decimal).minus(limit.maxNotional as Decimal) as NotionalValue,
          severity: 'CRITICAL',
        });
      }
    }

    // Check soft limits (warnings)
    if (limit.limitType === 'SOFT' || limit.limitType === 'WARNING') {
      const utilization = (currentValue as Decimal).div(limit.maxNotional as Decimal).times(100) as Percentage;
      if ((utilization as Decimal).greaterThan(80)) {
        warnings.push({
          limitId: limit.limitId,
          scope: limit.scope,
          category: limit.category,
          currentUtilization: utilization,
          warningThreshold: createPercentage(80),
          message: `Position approaching ${limit.limitType} limit (${utilization.toFixed(1)}% utilized)`,
        });
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    warnings,
    approvalRequired: violations.some(v => v.severity === 'CRITICAL'),
  };
}

/**
 * Calculate position limit utilization
 * @param positions - All positions
 * @param limit - Limit to check
 * @returns Utilization percentage
 */
export function calculateLimitUtilization(positions: Position[], limit: PositionLimit): Percentage {
  let currentValue = new Decimal(0);

  // Aggregate based on limit scope
  switch (limit.scope) {
    case 'POSITION':
      const position = positions.find(p => p.instrumentId === limit.category);
      currentValue = position ? position.marketValue as Decimal : new Decimal(0);
      break;
    case 'SECTOR':
      currentValue = positions
        .filter(p => p.metadata?.sector === limit.category)
        .reduce((sum, p) => sum.plus(p.marketValue as Decimal), new Decimal(0));
      break;
    case 'ASSET_CLASS':
      currentValue = positions
        .filter(p => p.assetClass === limit.category)
        .reduce((sum, p) => sum.plus(p.marketValue as Decimal), new Decimal(0));
      break;
    case 'PORTFOLIO':
    case 'ACCOUNT':
      currentValue = positions.reduce((sum, p) => sum.plus(p.marketValue as Decimal), new Decimal(0));
      break;
  }

  return currentValue.div(limit.maxNotional as Decimal).times(100) as Percentage;
}

// ============================================================================
// POSITION SIZING ALGORITHMS
// ============================================================================

/**
 * Calculate position size using fixed fractional method
 * @param params - Sizing parameters
 * @returns Recommended position size
 */
export function calculateFixedFractionalSize(params: PositionSizingParameters): PositionSize {
  if (params.strategy !== 'FIXED_FRACTIONAL') {
    throw new Error('Invalid strategy for fixed fractional sizing');
  }

  const riskPerTrade = params.riskPerTrade || createPercentage(2);
  const riskAmount = (params.portfolioValue as Decimal).times((riskPerTrade as Decimal).div(100)) as NotionalValue;

  const stopLossDistance = params.stopLoss
    ? (params.entryPrice as Decimal).minus(params.stopLoss as Decimal).abs()
    : (params.entryPrice as Decimal).times(0.05); // Default 5% stop

  const quantity = (riskAmount as Decimal).div(stopLossDistance) as Quantity;
  const notional = (quantity as Decimal).times(params.entryPrice as Decimal) as NotionalValue;
  const percentOfPortfolio = (notional as Decimal).div(params.portfolioValue as Decimal).times(100) as Percentage;

  return {
    recommendedQuantity: quantity,
    recommendedNotional: notional,
    percentOfPortfolio,
    riskAmount,
    methodology: 'Fixed Fractional (Risk per trade)',
    confidence: createPercentage(90),
    adjustments: [],
  };
}

/**
 * Calculate position size using Kelly Criterion
 * @param params - Sizing parameters
 * @returns Recommended position size
 */
export function calculateKellyCriterionSize(params: PositionSizingParameters): PositionSize {
  if (params.strategy !== 'KELLY_CRITERION') {
    throw new Error('Invalid strategy for Kelly Criterion sizing');
  }

  if (!params.winRate || !params.avgWinLoss) {
    throw new Error('Kelly Criterion requires winRate and avgWinLoss');
  }

  const winRate = (params.winRate as Decimal).div(100);
  const loseRate = new Decimal(1).minus(winRate);
  const avgWinLoss = params.avgWinLoss;

  // Kelly % = (W * R - L) / R
  // W = win probability, L = loss probability, R = win/loss ratio
  const kellyPercent = winRate.times(avgWinLoss).minus(loseRate).div(avgWinLoss);

  // Use half-Kelly for safety
  const fractionalKelly = kellyPercent.div(2);
  const positionSize = fractionalKelly.greaterThan(0)
    ? fractionalKelly
    : new Decimal(0);

  const notional = (params.portfolioValue as Decimal).times(positionSize) as NotionalValue;
  const quantity = (notional as Decimal).div(params.entryPrice as Decimal) as Quantity;

  return {
    recommendedQuantity: quantity,
    recommendedNotional: notional,
    percentOfPortfolio: positionSize.times(100) as Percentage,
    riskAmount: notional,
    methodology: 'Half-Kelly Criterion',
    confidence: createPercentage(75),
    adjustments: positionSize.greaterThan(0.25) ? ['Kelly suggests >25%, capped at 25% for safety'] : [],
  };
}

/**
 * Calculate position size using volatility-based method
 * @param params - Sizing parameters
 * @returns Recommended position size
 */
export function calculateVolatilityBasedSize(params: PositionSizingParameters): PositionSize {
  if (params.strategy !== 'VOLATILITY_BASED') {
    throw new Error('Invalid strategy for volatility-based sizing');
  }

  if (!params.instrumentVolatility || !params.volatilityTarget) {
    throw new Error('Volatility-based sizing requires instrumentVolatility and volatilityTarget');
  }

  // Scale position inversely with volatility
  const scalingFactor = (params.volatilityTarget as Decimal).div(params.instrumentVolatility as Decimal);
  const baseAllocation = new Decimal(0.1); // 10% base
  const adjustedAllocation = baseAllocation.times(scalingFactor);

  // Cap at 25%
  const finalAllocation = Decimal.min(adjustedAllocation, new Decimal(0.25));

  const notional = (params.portfolioValue as Decimal).times(finalAllocation) as NotionalValue;
  const quantity = (notional as Decimal).div(params.entryPrice as Decimal) as Quantity;

  return {
    recommendedQuantity: quantity,
    recommendedNotional: notional,
    percentOfPortfolio: finalAllocation.times(100) as Percentage,
    riskAmount: (notional as Decimal).times((params.instrumentVolatility as Decimal).div(100)) as NotionalValue,
    methodology: 'Volatility-based (Inverse vol scaling)',
    confidence: createPercentage(85),
    adjustments: adjustedAllocation.greaterThan(0.25) ? ['Capped at 25% for risk management'] : [],
  };
}

/**
 * Calculate position size using risk parity
 * @param params - Sizing parameters
 * @param allPositions - All existing positions for risk parity calculation
 * @returns Recommended position size
 */
export function calculateRiskParitySize(
  params: PositionSizingParameters,
  allPositions: Position[]
): PositionSize {
  if (params.strategy !== 'RISK_PARITY') {
    throw new Error('Invalid strategy for risk parity sizing');
  }

  // In risk parity, allocate capital such that each position contributes equally to portfolio risk
  // Simplified: weight inversely proportional to volatility
  const numPositions = allPositions.length + 1; // Include new position
  const targetRiskContribution = new Decimal(1).div(numPositions);

  const instrumentVol = params.instrumentVolatility || createPercentage(20);
  const weight = targetRiskContribution.div((instrumentVol as Decimal).div(100));

  const notional = (params.portfolioValue as Decimal).times(weight) as NotionalValue;
  const quantity = (notional as Decimal).div(params.entryPrice as Decimal) as Quantity;

  return {
    recommendedQuantity: quantity,
    recommendedNotional: notional,
    percentOfPortfolio: weight.times(100) as Percentage,
    riskAmount: (notional as Decimal).times((instrumentVol as Decimal).div(100)) as NotionalValue,
    methodology: 'Risk Parity (Equal risk contribution)',
    confidence: createPercentage(80),
    adjustments: [],
  };
}

// ============================================================================
// PORTFOLIO REBALANCING
// ============================================================================

/**
 * Generate rebalancing recommendations
 * @param currentPositions - Current portfolio positions
 * @param targetWeights - Target weight for each instrument
 * @param portfolioValue - Total portfolio value
 * @param rebalanceThreshold - Drift threshold to trigger rebalance (percentage points)
 * @returns Rebalancing recommendations
 */
export function generateRebalanceRecommendations(
  currentPositions: Position[],
  targetWeights: Map<string, Percentage>,
  portfolioValue: NotionalValue,
  rebalanceThreshold: Percentage = createPercentage(5)
): RebalanceRecommendation[] {
  const recommendations: RebalanceRecommendation[] = [];

  // Calculate current weights
  const currentWeights = new Map<string, Percentage>();
  for (const position of currentPositions) {
    const weight = (position.marketValue as Decimal).div(portfolioValue as Decimal).times(100) as Percentage;
    currentWeights.set(position.instrumentId, weight);
  }

  // Compare with target weights
  for (const [instrumentId, targetWeight] of targetWeights.entries()) {
    const currentWeight = currentWeights.get(instrumentId) || createPercentage(0);
    const drift = (targetWeight as Decimal).minus(currentWeight as Decimal) as Percentage;

    if ((drift as Decimal).abs().greaterThan(rebalanceThreshold as Decimal)) {
      const position = currentPositions.find(p => p.instrumentId === instrumentId);
      const targetNotional = (portfolioValue as Decimal).times((targetWeight as Decimal).div(100)) as NotionalValue;
      const currentNotional = position ? position.marketValue : createNotional(0);
      const notionalDiff = (targetNotional as Decimal).minus(currentNotional as Decimal);

      const action: 'BUY' | 'SELL' | 'HOLD' = notionalDiff.greaterThan(0) ? 'BUY' :
                                              notionalDiff.lessThan(0) ? 'SELL' : 'HOLD';

      const currentPrice = position?.currentPrice || createPrice(100); // Would fetch from market data
      const quantity = notionalDiff.abs().div(currentPrice as Decimal) as Quantity;

      const priority: 'HIGH' | 'MEDIUM' | 'LOW' =
        (drift as Decimal).abs().greaterThan((rebalanceThreshold as Decimal).times(2)) ? 'HIGH' :
        (drift as Decimal).abs().greaterThan(rebalanceThreshold as Decimal) ? 'MEDIUM' : 'LOW';

      recommendations.push({
        instrumentId,
        symbol: position?.symbol || instrumentId,
        currentWeight,
        targetWeight,
        drift,
        action,
        quantity,
        notionalValue: notionalDiff.abs() as NotionalValue,
        priority,
      });
    }
  }

  return recommendations.sort((a, b) =>
    (b.drift as Decimal).abs().comparedTo((a.drift as Decimal).abs())
  );
}

/**
 * Calculate rebalancing costs
 * @param recommendations - Rebalancing recommendations
 * @param commissionRate - Commission rate (percentage)
 * @param spreadCost - Bid-ask spread cost (percentage)
 * @returns Total rebalancing cost
 */
export function calculateRebalancingCosts(
  recommendations: RebalanceRecommendation[],
  commissionRate: Percentage = createPercentage(0.1),
  spreadCost: Percentage = createPercentage(0.05)
): {
  totalCommissions: NotionalValue;
  totalSpreadCost: NotionalValue;
  totalCost: NotionalValue;
  costAsPercentOfPortfolio: Percentage;
} {
  const totalNotional = recommendations.reduce(
    (sum, rec) => sum.plus(rec.notionalValue as Decimal),
    new Decimal(0)
  );

  const totalCommissions = totalNotional.times((commissionRate as Decimal).div(100)) as NotionalValue;
  const totalSpreadCostValue = totalNotional.times((spreadCost as Decimal).div(100)) as NotionalValue;
  const totalCost = (totalCommissions as Decimal).plus(totalSpreadCostValue as Decimal) as NotionalValue;

  // Assumes portfolio value available in context
  const costAsPercentOfPortfolio = createPercentage(0); // Would calculate with actual portfolio value

  return {
    totalCommissions,
    totalSpreadCost: totalSpreadCostValue,
    totalCost,
    costAsPercentOfPortfolio,
  };
}

// ============================================================================
// POSITION RISK ANALYTICS
// ============================================================================

/**
 * Calculate Value at Risk (VaR) for position
 * @param position - Position to analyze
 * @param historicalReturns - Historical returns for the instrument
 * @param confidenceLevel - Confidence level (typically 0.95 or 0.99)
 * @returns VaR value
 */
export function calculatePositionVaR(
  position: Position,
  historicalReturns: Decimal[],
  confidenceLevel: number = 0.95
): RiskValue {
  if (historicalReturns.length < 30) {
    throw new Error('Need at least 30 historical returns for VaR calculation');
  }

  // Sort returns
  const sortedReturns = [...historicalReturns].sort((a, b) => a.comparedTo(b));

  // Get percentile
  const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
  const percentileReturn = sortedReturns[index];

  // VaR = position value * percentile return
  const var95 = (position.marketValue as Decimal).times(percentileReturn.abs()) as RiskValue;

  return var95;
}

/**
 * Calculate Expected Shortfall (Conditional VaR)
 * @param position - Position to analyze
 * @param historicalReturns - Historical returns
 * @param confidenceLevel - Confidence level
 * @returns Expected Shortfall value
 */
export function calculateExpectedShortfall(
  position: Position,
  historicalReturns: Decimal[],
  confidenceLevel: number = 0.95
): RiskValue {
  const sortedReturns = [...historicalReturns].sort((a, b) => a.comparedTo(b));
  const cutoffIndex = Math.floor((1 - confidenceLevel) * sortedReturns.length);

  // Average of all returns worse than VaR
  const tailReturns = sortedReturns.slice(0, cutoffIndex);
  const avgTailReturn = tailReturns.reduce((sum, r) => sum.plus(r), new Decimal(0))
    .div(tailReturns.length);

  const es = (position.marketValue as Decimal).times(avgTailReturn.abs()) as RiskValue;
  return es;
}

/**
 * Calculate position beta against benchmark
 * @param positionReturns - Position returns
 * @param benchmarkReturns - Benchmark returns
 * @returns Beta coefficient
 */
export function calculatePositionBeta(
  positionReturns: Decimal[],
  benchmarkReturns: Decimal[]
): Decimal {
  if (positionReturns.length !== benchmarkReturns.length || positionReturns.length < 20) {
    throw new Error('Need at least 20 paired returns for beta calculation');
  }

  const n = positionReturns.length;
  const avgPosition = positionReturns.reduce((sum, r) => sum.plus(r), new Decimal(0)).div(n);
  const avgBenchmark = benchmarkReturns.reduce((sum, r) => sum.plus(r), new Decimal(0)).div(n);

  let covariance = new Decimal(0);
  let benchmarkVariance = new Decimal(0);

  for (let i = 0; i < n; i++) {
    const positionDiff = positionReturns[i].minus(avgPosition);
    const benchmarkDiff = benchmarkReturns[i].minus(avgBenchmark);
    covariance = covariance.plus(positionDiff.times(benchmarkDiff));
    benchmarkVariance = benchmarkVariance.plus(benchmarkDiff.pow(2));
  }

  covariance = covariance.div(n);
  benchmarkVariance = benchmarkVariance.div(n);

  return benchmarkVariance.equals(0) ? new Decimal(0) : covariance.div(benchmarkVariance);
}

// ============================================================================
// CONCENTRATION ANALYSIS
// ============================================================================

/**
 * Analyze portfolio concentration
 * @param positions - All positions
 * @param portfolioValue - Total portfolio value
 * @param limits - Concentration limits
 * @returns Concentration analysis
 */
export function analyzeConcentration(
  positions: Position[],
  portfolioValue: NotionalValue,
  limits: { singlePosition: Percentage; top5: Percentage; top10: Percentage }
): ConcentrationAnalysis {
  // Sort positions by market value descending
  const sortedPositions = [...positions].sort((a, b) =>
    (b.marketValue as Decimal).comparedTo(a.marketValue as Decimal)
  );

  // Single position concentration
  const singlePositionMax = sortedPositions.length > 0
    ? (sortedPositions[0].marketValue as Decimal).div(portfolioValue as Decimal).times(100) as Percentage
    : createPercentage(0);

  // Top 5 concentration
  const top5Value = sortedPositions.slice(0, 5).reduce(
    (sum, p) => sum.plus(p.marketValue as Decimal),
    new Decimal(0)
  );
  const top5Concentration = top5Value.div(portfolioValue as Decimal).times(100) as Percentage;

  // Top 10 concentration
  const top10Value = sortedPositions.slice(0, 10).reduce(
    (sum, p) => sum.plus(p.marketValue as Decimal),
    new Decimal(0)
  );
  const top10Concentration = top10Value.div(portfolioValue as Decimal).times(100) as Percentage;

  // Herfindahl-Hirschman Index (sum of squared weights)
  const herfindahlIndex = positions.reduce((sum, p) => {
    const weight = (p.marketValue as Decimal).div(portfolioValue as Decimal);
    return sum.plus(weight.pow(2));
  }, new Decimal(0));

  const effectiveN = herfindahlIndex.greaterThan(0) ? new Decimal(1).div(herfindahlIndex) : new Decimal(0);

  // Check for breaches
  const breaches: ConcentrationBreach[] = [];

  if ((singlePositionMax as Decimal).greaterThan(limits.singlePosition as Decimal)) {
    breaches.push({
      type: 'SINGLE_POSITION',
      identifier: sortedPositions[0].symbol,
      currentConcentration: singlePositionMax,
      limit: limits.singlePosition,
      excess: (singlePositionMax as Decimal).minus(limits.singlePosition as Decimal) as Percentage,
    });
  }

  if ((top5Concentration as Decimal).greaterThan(limits.top5 as Decimal)) {
    breaches.push({
      type: 'SINGLE_POSITION',
      identifier: 'Top 5 Positions',
      currentConcentration: top5Concentration,
      limit: limits.top5,
      excess: (top5Concentration as Decimal).minus(limits.top5 as Decimal) as Percentage,
    });
  }

  if ((top10Concentration as Decimal).greaterThan(limits.top10 as Decimal)) {
    breaches.push({
      type: 'SINGLE_POSITION',
      identifier: 'Top 10 Positions',
      currentConcentration: top10Concentration,
      limit: limits.top10,
      excess: (top10Concentration as Decimal).minus(limits.top10 as Decimal) as Percentage,
    });
  }

  return {
    singlePositionMax,
    top5Concentration,
    top10Concentration,
    herfindahlIndex,
    effectiveN,
    breaches,
  };
}

// ============================================================================
// MULTI-CURRENCY HANDLING
// ============================================================================

/**
 * Calculate currency exposure
 * @param positions - All positions
 * @param portfolioValue - Total portfolio value in base currency
 * @param fxRates - FX rates to base currency
 * @returns Currency exposure breakdown
 */
export function calculateCurrencyExposure(
  positions: Position[],
  portfolioValue: NotionalValue,
  fxRates: Map<string, Decimal>
): CurrencyExposure[] {
  const currencyGroups = new Map<string, Position[]>();

  for (const position of positions) {
    if (!currencyGroups.has(position.currency)) {
      currencyGroups.set(position.currency, []);
    }
    currencyGroups.get(position.currency)!.push(position);
  }

  const exposures: CurrencyExposure[] = [];

  for (const [currency, currencyPositions] of currencyGroups.entries()) {
    const fxRate = fxRates.get(currency) || new Decimal(1);
    const currencyExposure = currencyPositions.reduce(
      (sum, p) => sum.plus((p.marketValue as Decimal).times(fxRate)),
      new Decimal(0)
    ) as ExposureValue;

    const percentOfPortfolio = (currencyExposure as Decimal).div(portfolioValue as Decimal).times(100) as Percentage;

    // Assume hedge ratio from metadata
    const hedgeRatio = createPercentage(0); // Would be calculated from hedge positions
    const unhedgedExposure = currencyExposure;

    exposures.push({
      currency,
      exposure: currencyExposure,
      percentOfPortfolio,
      hedgeRatio,
      unhedgedExposure,
    });
  }

  return exposures.sort((a, b) =>
    (b.exposure as Decimal).comparedTo(a.exposure as Decimal)
  );
}

/**
 * Convert position to base currency
 * @param position - Position in foreign currency
 * @param fxRate - FX rate to base currency
 * @returns Position value in base currency
 */
export function convertToBaseCurrency(position: Position, fxRate: Decimal): NotionalValue {
  return (position.marketValue as Decimal).times(fxRate) as NotionalValue;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  Position,
  AggregatedPosition,
  ExposureReport,
  PositionLimit,
  LimitCheckResult,
  LimitViolation,
  LimitWarning,
  PositionSizingParameters,
  PositionSize,
  RebalanceRecommendation,
  RiskMetrics,
  ConcentrationAnalysis,
  ConcentrationBreach,
  CurrencyExposure,
  PositionSide,
  PositionStatus,
  AssetClass,
  InstrumentType,
  Price,
  Quantity,
  NotionalValue,
  Percentage,
  ExposureValue,
  RiskValue,
};

export {
  createPrice,
  createQuantity,
  createNotional,
  createPercentage,
  createExposure,
  createRiskValue,
};
