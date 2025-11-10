/**
 * LOC: TRD-PNL-003
 * File: /reuse/trading/pnl-calculation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Op, Transaction)
 *   - decimal.js (Decimal for precise calculations)
 *   - ./position-management-kit.ts (Position types)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/accounting/*
 *   - backend/controllers/pnl.controller.ts
 *   - backend/services/pnl-calculation.service.ts
 */
import Decimal from 'decimal.js';
import type { Position, PositionSide } from './position-management-kit';
type Price = Decimal & {
    readonly __brand: 'Price';
};
type Quantity = Decimal & {
    readonly __brand: 'Quantity';
};
type PnL = Decimal & {
    readonly __brand: 'PnL';
};
type NotionalValue = Decimal & {
    readonly __brand: 'NotionalValue';
};
type Percentage = Decimal & {
    readonly __brand: 'Percentage';
};
declare const createPrice: (value: Decimal.Value) => Price;
declare const createQuantity: (value: Decimal.Value) => Quantity;
declare const createPnL: (value: Decimal.Value) => PnL;
declare const createNotional: (value: Decimal.Value) => NotionalValue;
declare const createPercentage: (value: Decimal.Value) => Percentage;
interface PnLSnapshot {
    snapshotId: string;
    portfolioId: string;
    accountId: string;
    timestamp: Date;
    realizedPnL: PnL;
    unrealizedPnL: PnL;
    totalPnL: PnL;
    fees: PnL;
    commissions: PnL;
    netPnL: PnL;
    returnPercent: Percentage;
    positions: PositionPnL[];
}
interface PositionPnL {
    positionId: string;
    instrumentId: string;
    symbol: string;
    realizedPnL: PnL;
    unrealizedPnL: PnL;
    totalPnL: PnL;
    returnPercent: Percentage;
    costBasis: NotionalValue;
    currentValue: NotionalValue;
    quantity: Quantity;
    averagePrice: Price;
    currentPrice: Price;
}
interface TradeExecution {
    tradeId: string;
    instrumentId: string;
    symbol: string;
    side: PositionSide;
    quantity: Quantity;
    executionPrice: Price;
    executionTime: Date;
    commission: Decimal;
    fees: Decimal;
    currency: string;
    accountId: string;
    strategyId?: string;
    traderId?: string;
}
interface RealizedPnLRecord {
    recordId: string;
    instrumentId: string;
    symbol: string;
    closeDate: Date;
    openDate: Date;
    quantity: Quantity;
    openPrice: Price;
    closePrice: Price;
    grossPnL: PnL;
    commissions: Decimal;
    fees: Decimal;
    netPnL: PnL;
    holdingPeriod: number;
    returnPercent: Percentage;
    taxLotMethod: 'FIFO' | 'LIFO' | 'AVERAGE_COST' | 'SPECIFIC_ID';
    currency: string;
}
interface UnrealizedPnLRecord {
    positionId: string;
    instrumentId: string;
    symbol: string;
    quantity: Quantity;
    costBasis: NotionalValue;
    currentPrice: Price;
    marketValue: NotionalValue;
    unrealizedPnL: PnL;
    returnPercent: Percentage;
    daysHeld: number;
    currency: string;
}
interface MarkToMarketValuation {
    instrumentId: string;
    symbol: string;
    quantity: Quantity;
    valuationPrice: Price;
    pricingSource: 'MARKET' | 'MODEL' | 'VENDOR' | 'MANUAL';
    marketValue: NotionalValue;
    priorMarketValue: NotionalValue;
    mtmPnL: PnL;
    timestamp: Date;
    confidence: Percentage;
}
interface IntradayPnL {
    timestamp: Date;
    cumulativePnL: PnL;
    periodPnL: PnL;
    highWaterMark: PnL;
    lowWaterMark: PnL;
    drawdown: PnL;
    peakTime: Date;
    troughTime: Date;
}
interface AttributionResult {
    totalPnL: PnL;
    attributions: Attribution[];
    unexplained: PnL;
    timestamp: Date;
}
interface Attribution {
    dimension: string;
    category: string;
    pnl: PnL;
    percentOfTotal: Percentage;
    tradeCount: number;
    avgPnLPerTrade: PnL;
}
interface CurrencyPnL {
    currency: string;
    transactionGains: PnL;
    translationAdjustments: PnL;
    totalFxPnL: PnL;
    percentOfTotalPnL: Percentage;
}
interface TaxLot {
    lotId: string;
    instrumentId: string;
    symbol: string;
    acquisitionDate: Date;
    quantity: Quantity;
    costBasis: NotionalValue;
    averageCost: Price;
    remainingQuantity: Quantity;
    remainingCostBasis: NotionalValue;
    status: 'OPEN' | 'CLOSED' | 'PARTIAL';
}
interface TaxLotAllocation {
    lotId: string;
    quantityUsed: Quantity;
    costBasisUsed: NotionalValue;
    realizedPnL: PnL;
    holdingPeriod: number;
    taxTreatment: 'SHORT_TERM' | 'LONG_TERM';
}
interface ReconciliationResult {
    reconciliationId: string;
    date: Date;
    bookPnL: PnL;
    streetPnL: PnL;
    variance: PnL;
    variancePercent: Percentage;
    breaks: ReconciliationBreak[];
    status: 'MATCHED' | 'BROKEN' | 'INVESTIGATING' | 'RESOLVED';
}
interface ReconciliationBreak {
    breakId: string;
    type: 'POSITION' | 'PRICE' | 'TRADE' | 'CORPORATE_ACTION' | 'FEE';
    instrumentId: string;
    symbol: string;
    bookValue: Decimal;
    streetValue: Decimal;
    difference: Decimal;
    explanation?: string;
    resolution?: string;
}
interface PnLReport {
    reportId: string;
    reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'INCEPTION';
    startDate: Date;
    endDate: Date;
    portfolioId: string;
    accountId?: string;
    totalPnL: PnL;
    realizedPnL: PnL;
    unrealizedPnL: PnL;
    fees: PnL;
    commissions: PnL;
    netPnL: PnL;
    returnPercent: Percentage;
    benchmarkReturn?: Percentage;
    excessReturn?: Percentage;
    winRate: Percentage;
    bestDay: {
        date: Date;
        pnl: PnL;
    };
    worstDay: {
        date: Date;
        pnl: PnL;
    };
    dailyPnL: Array<{
        date: Date;
        pnl: PnL;
    }>;
}
/**
 * Calculate real-time P&L for a position
 * @param position - Position to calculate P&L for
 * @param currentPrice - Current market price
 * @returns Position P&L details
 */
export declare function calculatePositionPnL(position: Position, currentPrice: Price): PositionPnL;
/**
 * Calculate portfolio-level real-time P&L
 * @param positions - All positions in portfolio
 * @param currentPrices - Map of instrument ID to current price
 * @returns Portfolio P&L snapshot
 */
export declare function calculatePortfolioPnL(positions: Position[], currentPrices: Map<string, Price>, portfolioId: string, accountId: string): PnLSnapshot;
/**
 * Update P&L with new market data (tick-by-tick)
 * @param previousSnapshot - Previous P&L snapshot
 * @param priceUpdates - Map of price updates
 * @returns Updated P&L snapshot
 */
export declare function updatePnLSnapshot(previousSnapshot: PnLSnapshot, priceUpdates: Map<string, Price>): PnLSnapshot;
/**
 * Calculate unrealized P&L for open position
 * @param position - Open position
 * @param currentPrice - Current market price
 * @returns Unrealized P&L record
 */
export declare function calculateUnrealizedPnL(position: Position, currentPrice: Price): UnrealizedPnLRecord;
/**
 * Track unrealized P&L changes over time
 * @param currentUnrealized - Current unrealized P&L
 * @param previousUnrealized - Previous unrealized P&L
 * @returns Change in unrealized P&L
 */
export declare function calculateUnrealizedPnLChange(currentUnrealized: PnL, previousUnrealized: PnL): {
    change: PnL;
    changePercent: Percentage;
    direction: 'IMPROVED' | 'DETERIORATED' | 'UNCHANGED';
};
/**
 * Calculate realized P&L for closed trade
 * @param openTrade - Opening trade execution
 * @param closeTrade - Closing trade execution
 * @returns Realized P&L record
 */
export declare function calculateRealizedPnL(openTrade: TradeExecution, closeTrade: TradeExecution): RealizedPnLRecord;
/**
 * Aggregate realized P&L for period
 * @param realizedPnLRecords - All realized P&L records
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Aggregated realized P&L
 */
export declare function aggregateRealizedPnL(realizedPnLRecords: RealizedPnLRecord[], startDate: Date, endDate: Date): {
    totalGrossPnL: PnL;
    totalNetPnL: PnL;
    totalCommissions: Decimal;
    totalFees: Decimal;
    tradeCount: number;
    winningTrades: number;
    losingTrades: number;
    winRate: Percentage;
    avgWin: PnL;
    avgLoss: PnL;
};
/**
 * Calculate cumulative realized P&L
 * @param realizedPnLRecords - All realized P&L records
 * @returns Cumulative P&L over time
 */
export declare function calculateCumulativeRealizedPnL(realizedPnLRecords: RealizedPnLRecord[]): Array<{
    date: Date;
    cumulativePnL: PnL;
    tradePnL: PnL;
}>;
/**
 * Perform mark-to-market valuation
 * @param position - Position to value
 * @param marketPrice - Current market price
 * @param pricingSource - Source of pricing
 * @param priorPrice - Prior valuation price
 * @returns MTM valuation
 */
export declare function performMarkToMarket(position: Position, marketPrice: Price, pricingSource: 'MARKET' | 'MODEL' | 'VENDOR' | 'MANUAL', priorPrice?: Price): MarkToMarketValuation;
/**
 * Calculate MTM P&L for portfolio
 * @param valuations - All MTM valuations
 * @returns Total MTM P&L
 */
export declare function calculateMTMPnL(valuations: MarkToMarketValuation[]): {
    totalMTMPnL: PnL;
    byPricingSource: Map<string, PnL>;
    highConfidence: PnL;
    lowConfidence: PnL;
};
/**
 * Track intraday P&L
 * @param snapshots - Intraday P&L snapshots
 * @returns Intraday P&L analysis
 */
export declare function analyzeIntradayPnL(snapshots: PnLSnapshot[]): IntradayPnL[];
/**
 * Calculate hourly P&L breakdown
 * @param snapshots - Intraday snapshots
 * @returns Hourly P&L data
 */
export declare function calculateHourlyPnL(snapshots: PnLSnapshot[]): Map<number, PnL>;
/**
 * Attribute P&L by strategy
 * @param realizedPnL - All realized P&L records
 * @param trades - All trade executions
 * @returns Strategy attribution
 */
export declare function attributePnLByStrategy(realizedPnL: RealizedPnLRecord[], trades: TradeExecution[]): AttributionResult;
/**
 * Attribute P&L by asset class
 * @param positions - All positions
 * @param positionsPnL - P&L for each position
 * @returns Asset class attribution
 */
export declare function attributePnLByAssetClass(positions: Position[], positionsPnL: PositionPnL[]): AttributionResult;
/**
 * Attribute P&L by trader
 * @param realizedPnL - All realized P&L records
 * @param trades - All trade executions
 * @returns Trader attribution
 */
export declare function attributePnLByTrader(realizedPnL: RealizedPnLRecord[], trades: TradeExecution[]): AttributionResult;
/**
 * Multi-dimensional P&L attribution
 * @param positions - All positions
 * @param positionsPnL - P&L for each position
 * @param trades - All trade executions
 * @param dimensions - Dimensions to attribute by
 * @returns Multi-dimensional attribution
 */
export declare function multiDimensionalAttribution(positions: Position[], positionsPnL: PositionPnL[], trades: TradeExecution[], dimensions: Array<'strategy' | 'assetClass' | 'sector' | 'geography' | 'trader'>): Map<string, AttributionResult>;
/**
 * Calculate FX transaction gains/losses
 * @param trades - Trades in foreign currency
 * @param fxRates - FX rates at trade time
 * @param settlementFxRates - FX rates at settlement
 * @returns Transaction FX P&L
 */
export declare function calculateFXTransactionPnL(trades: TradeExecution[], fxRates: Map<string, Decimal>, settlementFxRates: Map<string, Decimal>): CurrencyPnL[];
/**
 * Calculate FX translation adjustments for positions
 * @param positions - Positions in foreign currencies
 * @param priorFxRates - FX rates from prior period
 * @param currentFxRates - Current FX rates
 * @returns Translation adjustments
 */
export declare function calculateFXTranslationAdjustments(positions: Position[], priorFxRates: Map<string, Decimal>, currentFxRates: Map<string, Decimal>): CurrencyPnL[];
/**
 * Create tax lot from purchase
 * @param trade - Purchase trade
 * @returns New tax lot
 */
export declare function createTaxLot(trade: TradeExecution): TaxLot;
/**
 * Allocate sale to tax lots using FIFO
 * @param taxLots - Available tax lots
 * @param saleQuantity - Quantity being sold
 * @param salePrice - Sale price
 * @returns Tax lot allocations
 */
export declare function allocateTaxLotsFIFO(taxLots: TaxLot[], saleQuantity: Quantity, salePrice: Price, saleDate: Date): TaxLotAllocation[];
/**
 * Allocate sale to tax lots using LIFO
 * @param taxLots - Available tax lots
 * @param saleQuantity - Quantity being sold
 * @param salePrice - Sale price
 * @param saleDate - Sale date
 * @returns Tax lot allocations
 */
export declare function allocateTaxLotsLIFO(taxLots: TaxLot[], saleQuantity: Quantity, salePrice: Price, saleDate: Date): TaxLotAllocation[];
/**
 * Calculate average cost basis
 * @param taxLots - All tax lots for instrument
 * @returns Average cost per share
 */
export declare function calculateAverageCost(taxLots: TaxLot[]): Price;
/**
 * Reconcile book P&L vs street P&L
 * @param bookPnL - Internal book P&L
 * @param streetPnL - Broker/custodian P&L
 * @param tolerance - Acceptable variance threshold
 * @returns Reconciliation result
 */
export declare function reconcilePnL(bookPnL: PnL, streetPnL: PnL, tolerance?: Decimal): ReconciliationResult;
/**
 * Identify reconciliation breaks
 * @param bookPositions - Internal book positions
 * @param streetPositions - Broker positions
 * @returns List of breaks
 */
export declare function identifyReconciliationBreaks(bookPositions: Map<string, Position>, streetPositions: Map<string, {
    quantity: Quantity;
    price: Price;
}>): ReconciliationBreak[];
/**
 * Generate P&L report for period
 * @param snapshots - All P&L snapshots
 * @param startDate - Period start
 * @param endDate - Period end
 * @param portfolioId - Portfolio ID
 * @param reportType - Report type
 * @returns P&L report
 */
export declare function generatePnLReport(snapshots: PnLSnapshot[], startDate: Date, endDate: Date, portfolioId: string, reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'INCEPTION'): PnLReport;
/**
 * Calculate MTD (Month-to-Date) P&L
 * @param snapshots - All snapshots
 * @param portfolioId - Portfolio ID
 * @returns MTD P&L
 */
export declare function calculateMTDPnL(snapshots: PnLSnapshot[], portfolioId: string): PnL;
/**
 * Calculate YTD (Year-to-Date) P&L
 * @param snapshots - All snapshots
 * @param portfolioId - Portfolio ID
 * @returns YTD P&L
 */
export declare function calculateYTDPnL(snapshots: PnLSnapshot[], portfolioId: string): PnL;
/**
 * Calculate since-inception P&L
 * @param snapshots - All snapshots
 * @param portfolioId - Portfolio ID
 * @param inceptionDate - Portfolio inception date
 * @returns Since-inception P&L
 */
export declare function calculateInceptionPnL(snapshots: PnLSnapshot[], portfolioId: string, inceptionDate: Date): PnL;
export type { PnLSnapshot, PositionPnL, TradeExecution, RealizedPnLRecord, UnrealizedPnLRecord, MarkToMarketValuation, IntradayPnL, AttributionResult, Attribution, CurrencyPnL, TaxLot, TaxLotAllocation, ReconciliationResult, ReconciliationBreak, PnLReport, PnL, Price, Quantity, NotionalValue, Percentage, };
export { createPnL, createPrice, createQuantity, createNotional, createPercentage, };
//# sourceMappingURL=pnl-calculation-kit.d.ts.map