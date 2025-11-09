"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPercentage = exports.createNotional = exports.createQuantity = exports.createPrice = exports.createPnL = void 0;
exports.calculatePositionPnL = calculatePositionPnL;
exports.calculatePortfolioPnL = calculatePortfolioPnL;
exports.updatePnLSnapshot = updatePnLSnapshot;
exports.calculateUnrealizedPnL = calculateUnrealizedPnL;
exports.calculateUnrealizedPnLChange = calculateUnrealizedPnLChange;
exports.calculateRealizedPnL = calculateRealizedPnL;
exports.aggregateRealizedPnL = aggregateRealizedPnL;
exports.calculateCumulativeRealizedPnL = calculateCumulativeRealizedPnL;
exports.performMarkToMarket = performMarkToMarket;
exports.calculateMTMPnL = calculateMTMPnL;
exports.analyzeIntradayPnL = analyzeIntradayPnL;
exports.calculateHourlyPnL = calculateHourlyPnL;
exports.attributePnLByStrategy = attributePnLByStrategy;
exports.attributePnLByAssetClass = attributePnLByAssetClass;
exports.attributePnLByTrader = attributePnLByTrader;
exports.multiDimensionalAttribution = multiDimensionalAttribution;
exports.calculateFXTransactionPnL = calculateFXTransactionPnL;
exports.calculateFXTranslationAdjustments = calculateFXTranslationAdjustments;
exports.createTaxLot = createTaxLot;
exports.allocateTaxLotsFIFO = allocateTaxLotsFIFO;
exports.allocateTaxLotsLIFO = allocateTaxLotsLIFO;
exports.calculateAverageCost = calculateAverageCost;
exports.reconcilePnL = reconcilePnL;
exports.identifyReconciliationBreaks = identifyReconciliationBreaks;
exports.generatePnLReport = generatePnLReport;
exports.calculateMTDPnL = calculateMTDPnL;
exports.calculateYTDPnL = calculateYTDPnL;
exports.calculateInceptionPnL = calculateInceptionPnL;
const decimal_js_1 = __importDefault(require("decimal.js"));
const createPrice = (value) => new decimal_js_1.default(value);
exports.createPrice = createPrice;
const createQuantity = (value) => new decimal_js_1.default(value);
exports.createQuantity = createQuantity;
const createPnL = (value) => new decimal_js_1.default(value);
exports.createPnL = createPnL;
const createNotional = (value) => new decimal_js_1.default(value);
exports.createNotional = createNotional;
const createPercentage = (value) => new decimal_js_1.default(value);
exports.createPercentage = createPercentage;
// ============================================================================
// REAL-TIME P&L CALCULATION
// ============================================================================
/**
 * Calculate real-time P&L for a position
 * @param position - Position to calculate P&L for
 * @param currentPrice - Current market price
 * @returns Position P&L details
 */
function calculatePositionPnL(position, currentPrice) {
    const currentValue = position.quantity.times(currentPrice);
    const costBasis = position.costBasis;
    const unrealizedPnL = position.side === 'LONG'
        ? currentValue.minus(costBasis)
        : costBasis.minus(currentValue);
    const realizedPnL = createPnL(0); // Would come from trade history
    const totalPnL = unrealizedPnL;
    const returnPercent = costBasis.equals(0)
        ? createPercentage(0)
        : totalPnL.div(costBasis).times(100);
    return {
        positionId: position.positionId,
        instrumentId: position.instrumentId,
        symbol: position.symbol,
        realizedPnL,
        unrealizedPnL: unrealizedPnL,
        totalPnL,
        returnPercent,
        costBasis,
        currentValue,
        quantity: position.quantity,
        averagePrice: position.averagePrice,
        currentPrice,
    };
}
/**
 * Calculate portfolio-level real-time P&L
 * @param positions - All positions in portfolio
 * @param currentPrices - Map of instrument ID to current price
 * @returns Portfolio P&L snapshot
 */
function calculatePortfolioPnL(positions, currentPrices, portfolioId, accountId) {
    const positionsPnL = [];
    let totalRealizedPnL = new decimal_js_1.default(0);
    let totalUnrealizedPnL = new decimal_js_1.default(0);
    let totalFees = new decimal_js_1.default(0);
    let totalCommissions = new decimal_js_1.default(0);
    for (const position of positions) {
        const currentPrice = currentPrices.get(position.instrumentId) || position.currentPrice;
        const positionPnL = calculatePositionPnL(position, currentPrice);
        positionsPnL.push(positionPnL);
        totalRealizedPnL = totalRealizedPnL.plus(positionPnL.realizedPnL);
        totalUnrealizedPnL = totalUnrealizedPnL.plus(positionPnL.unrealizedPnL);
    }
    const totalPnL = totalRealizedPnL.plus(totalUnrealizedPnL);
    const netPnL = totalPnL.minus(totalFees).minus(totalCommissions);
    const totalCostBasis = positions.reduce((sum, p) => sum.plus(p.costBasis), new decimal_js_1.default(0));
    const returnPercent = totalCostBasis.equals(0)
        ? createPercentage(0)
        : netPnL.div(totalCostBasis).times(100);
    return {
        snapshotId: `SNAP-${Date.now()}`,
        portfolioId,
        accountId,
        timestamp: new Date(),
        realizedPnL: totalRealizedPnL,
        unrealizedPnL: totalUnrealizedPnL,
        totalPnL: totalPnL,
        fees: totalFees,
        commissions: totalCommissions,
        netPnL: netPnL,
        returnPercent,
        positions: positionsPnL,
    };
}
/**
 * Update P&L with new market data (tick-by-tick)
 * @param previousSnapshot - Previous P&L snapshot
 * @param priceUpdates - Map of price updates
 * @returns Updated P&L snapshot
 */
function updatePnLSnapshot(previousSnapshot, priceUpdates) {
    const updatedPositions = previousSnapshot.positions.map(positionPnL => {
        const newPrice = priceUpdates.get(positionPnL.instrumentId);
        if (!newPrice)
            return positionPnL;
        const newValue = positionPnL.quantity.times(newPrice);
        const newUnrealizedPnL = newValue.minus(positionPnL.costBasis);
        const newTotalPnL = positionPnL.realizedPnL.plus(newUnrealizedPnL);
        const newReturnPercent = positionPnL.costBasis.equals(0)
            ? createPercentage(0)
            : newTotalPnL.div(positionPnL.costBasis).times(100);
        return {
            ...positionPnL,
            currentPrice: newPrice,
            currentValue: newValue,
            unrealizedPnL: newUnrealizedPnL,
            totalPnL: newTotalPnL,
            returnPercent: newReturnPercent,
        };
    });
    const totalUnrealizedPnL = updatedPositions.reduce((sum, p) => sum.plus(p.unrealizedPnL), new decimal_js_1.default(0));
    const totalPnL = previousSnapshot.realizedPnL.plus(totalUnrealizedPnL);
    const netPnL = totalPnL.minus(previousSnapshot.fees)
        .minus(previousSnapshot.commissions);
    const totalCostBasis = updatedPositions.reduce((sum, p) => sum.plus(p.costBasis), new decimal_js_1.default(0));
    const returnPercent = totalCostBasis.equals(0)
        ? createPercentage(0)
        : netPnL.div(totalCostBasis).times(100);
    return {
        ...previousSnapshot,
        snapshotId: `SNAP-${Date.now()}`,
        timestamp: new Date(),
        unrealizedPnL: totalUnrealizedPnL,
        totalPnL,
        netPnL,
        returnPercent,
        positions: updatedPositions,
    };
}
// ============================================================================
// UNREALIZED P&L TRACKING
// ============================================================================
/**
 * Calculate unrealized P&L for open position
 * @param position - Open position
 * @param currentPrice - Current market price
 * @returns Unrealized P&L record
 */
function calculateUnrealizedPnL(position, currentPrice) {
    const marketValue = position.quantity.times(currentPrice);
    const unrealizedPnL = position.side === 'LONG'
        ? marketValue.minus(position.costBasis)
        : position.costBasis.minus(marketValue);
    const returnPercent = position.costBasis.equals(0)
        ? createPercentage(0)
        : unrealizedPnL.div(position.costBasis).times(100);
    const daysHeld = Math.floor((new Date().getTime() - position.entryDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
        positionId: position.positionId,
        instrumentId: position.instrumentId,
        symbol: position.symbol,
        quantity: position.quantity,
        costBasis: position.costBasis,
        currentPrice,
        marketValue,
        unrealizedPnL: unrealizedPnL,
        returnPercent,
        daysHeld,
        currency: position.currency,
    };
}
/**
 * Track unrealized P&L changes over time
 * @param currentUnrealized - Current unrealized P&L
 * @param previousUnrealized - Previous unrealized P&L
 * @returns Change in unrealized P&L
 */
function calculateUnrealizedPnLChange(currentUnrealized, previousUnrealized) {
    const change = currentUnrealized.minus(previousUnrealized);
    const changePercent = previousUnrealized.equals(0)
        ? createPercentage(0)
        : change.div(previousUnrealized.abs()).times(100);
    let direction;
    if (change.greaterThan(0)) {
        direction = 'IMPROVED';
    }
    else if (change.lessThan(0)) {
        direction = 'DETERIORATED';
    }
    else {
        direction = 'UNCHANGED';
    }
    return { change, changePercent, direction };
}
// ============================================================================
// REALIZED P&L COMPUTATION
// ============================================================================
/**
 * Calculate realized P&L for closed trade
 * @param openTrade - Opening trade execution
 * @param closeTrade - Closing trade execution
 * @returns Realized P&L record
 */
function calculateRealizedPnL(openTrade, closeTrade) {
    if (openTrade.instrumentId !== closeTrade.instrumentId) {
        throw new Error('Open and close trades must be for same instrument');
    }
    const quantity = decimal_js_1.default.min(openTrade.quantity, closeTrade.quantity);
    let grossPnL;
    if (openTrade.side === 'LONG') {
        // Long position: profit = (sell price - buy price) * quantity
        grossPnL = closeTrade.executionPrice.minus(openTrade.executionPrice)
            .times(quantity);
    }
    else {
        // Short position: profit = (sell price - buy price) * quantity (sold first, bought later)
        grossPnL = openTrade.executionPrice.minus(closeTrade.executionPrice)
            .times(quantity);
    }
    const totalCommissions = openTrade.commission.plus(closeTrade.commission);
    const totalFees = openTrade.fees.plus(closeTrade.fees);
    const netPnL = grossPnL.minus(totalCommissions).minus(totalFees);
    const costBasis = openTrade.executionPrice.times(quantity);
    const returnPercent = costBasis.equals(0)
        ? createPercentage(0)
        : netPnL.div(costBasis).times(100);
    const holdingPeriod = Math.floor((closeTrade.executionTime.getTime() - openTrade.executionTime.getTime()) / (1000 * 60 * 60 * 24));
    return {
        recordId: `RPL-${Date.now()}`,
        instrumentId: openTrade.instrumentId,
        symbol: openTrade.symbol,
        closeDate: closeTrade.executionTime,
        openDate: openTrade.executionTime,
        quantity,
        openPrice: openTrade.executionPrice,
        closePrice: closeTrade.executionPrice,
        grossPnL: grossPnL,
        commissions: totalCommissions,
        fees: totalFees,
        netPnL: netPnL,
        holdingPeriod,
        returnPercent,
        taxLotMethod: 'FIFO',
        currency: openTrade.currency,
    };
}
/**
 * Aggregate realized P&L for period
 * @param realizedPnLRecords - All realized P&L records
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Aggregated realized P&L
 */
function aggregateRealizedPnL(realizedPnLRecords, startDate, endDate) {
    const periodRecords = realizedPnLRecords.filter(r => r.closeDate >= startDate && r.closeDate <= endDate);
    const totalGrossPnL = periodRecords.reduce((sum, r) => sum.plus(r.grossPnL), new decimal_js_1.default(0));
    const totalNetPnL = periodRecords.reduce((sum, r) => sum.plus(r.netPnL), new decimal_js_1.default(0));
    const totalCommissions = periodRecords.reduce((sum, r) => sum.plus(r.commissions), new decimal_js_1.default(0));
    const totalFees = periodRecords.reduce((sum, r) => sum.plus(r.fees), new decimal_js_1.default(0));
    const winningTrades = periodRecords.filter(r => r.netPnL.greaterThan(0)).length;
    const losingTrades = periodRecords.filter(r => r.netPnL.lessThan(0)).length;
    const winRate = periodRecords.length > 0
        ? new decimal_js_1.default(winningTrades).div(periodRecords.length).times(100)
        : createPercentage(0);
    const wins = periodRecords.filter(r => r.netPnL.greaterThan(0));
    const losses = periodRecords.filter(r => r.netPnL.lessThan(0));
    const avgWin = wins.length > 0
        ? wins.reduce((sum, r) => sum.plus(r.netPnL), new decimal_js_1.default(0)).div(wins.length)
        : createPnL(0);
    const avgLoss = losses.length > 0
        ? losses.reduce((sum, r) => sum.plus(r.netPnL), new decimal_js_1.default(0)).div(losses.length)
        : createPnL(0);
    return {
        totalGrossPnL,
        totalNetPnL,
        totalCommissions,
        totalFees,
        tradeCount: periodRecords.length,
        winningTrades,
        losingTrades,
        winRate,
        avgWin,
        avgLoss,
    };
}
/**
 * Calculate cumulative realized P&L
 * @param realizedPnLRecords - All realized P&L records
 * @returns Cumulative P&L over time
 */
function calculateCumulativeRealizedPnL(realizedPnLRecords) {
    const sorted = [...realizedPnLRecords].sort((a, b) => a.closeDate.getTime() - b.closeDate.getTime());
    let cumulative = new decimal_js_1.default(0);
    const result = [];
    for (const record of sorted) {
        cumulative = cumulative.plus(record.netPnL);
        result.push({
            date: record.closeDate,
            cumulativePnL: cumulative,
            tradePnL: record.netPnL,
        });
    }
    return result;
}
// ============================================================================
// MARK-TO-MARKET VALUATIONS
// ============================================================================
/**
 * Perform mark-to-market valuation
 * @param position - Position to value
 * @param marketPrice - Current market price
 * @param pricingSource - Source of pricing
 * @param priorPrice - Prior valuation price
 * @returns MTM valuation
 */
function performMarkToMarket(position, marketPrice, pricingSource, priorPrice) {
    const marketValue = position.quantity.times(marketPrice);
    const priorMarketValue = priorPrice
        ? position.quantity.times(priorPrice)
        : marketValue;
    const mtmPnL = marketValue.minus(priorMarketValue);
    const confidence = pricingSource === 'MARKET' ? createPercentage(95) :
        pricingSource === 'VENDOR' ? createPercentage(85) :
            pricingSource === 'MODEL' ? createPercentage(70) :
                createPercentage(50);
    return {
        instrumentId: position.instrumentId,
        symbol: position.symbol,
        quantity: position.quantity,
        valuationPrice: marketPrice,
        pricingSource,
        marketValue,
        priorMarketValue,
        mtmPnL,
        timestamp: new Date(),
        confidence,
    };
}
/**
 * Calculate MTM P&L for portfolio
 * @param valuations - All MTM valuations
 * @returns Total MTM P&L
 */
function calculateMTMPnL(valuations) {
    const totalMTMPnL = valuations.reduce((sum, v) => sum.plus(v.mtmPnL), new decimal_js_1.default(0));
    const byPricingSource = new Map();
    for (const source of ['MARKET', 'MODEL', 'VENDOR', 'MANUAL']) {
        const sourcePnL = valuations
            .filter(v => v.pricingSource === source)
            .reduce((sum, v) => sum.plus(v.mtmPnL), new decimal_js_1.default(0));
        if (!sourcePnL.equals(0)) {
            byPricingSource.set(source, sourcePnL);
        }
    }
    const highConfidence = valuations
        .filter(v => v.confidence.greaterThanOrEqualTo(80))
        .reduce((sum, v) => sum.plus(v.mtmPnL), new decimal_js_1.default(0));
    const lowConfidence = valuations
        .filter(v => v.confidence.lessThan(80))
        .reduce((sum, v) => sum.plus(v.mtmPnL), new decimal_js_1.default(0));
    return {
        totalMTMPnL,
        byPricingSource,
        highConfidence,
        lowConfidence,
    };
}
// ============================================================================
// INTRADAY P&L ANALYSIS
// ============================================================================
/**
 * Track intraday P&L
 * @param snapshots - Intraday P&L snapshots
 * @returns Intraday P&L analysis
 */
function analyzeIntradayPnL(snapshots) {
    const sorted = [...snapshots].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const intradayData = [];
    let cumulativePnL = new decimal_js_1.default(0);
    let highWaterMark = new decimal_js_1.default(0);
    let lowWaterMark = new decimal_js_1.default(0);
    let peakTime = sorted[0]?.timestamp || new Date();
    let troughTime = sorted[0]?.timestamp || new Date();
    for (let i = 0; i < sorted.length; i++) {
        const snapshot = sorted[i];
        const periodPnL = i === 0
            ? snapshot.totalPnL
            : snapshot.totalPnL.minus(sorted[i - 1].totalPnL);
        cumulativePnL = snapshot.totalPnL;
        if (cumulativePnL.greaterThan(highWaterMark)) {
            highWaterMark = cumulativePnL;
            peakTime = snapshot.timestamp;
        }
        if (cumulativePnL.lessThan(lowWaterMark)) {
            lowWaterMark = cumulativePnL;
            troughTime = snapshot.timestamp;
        }
        const drawdown = highWaterMark.minus(cumulativePnL);
        intradayData.push({
            timestamp: snapshot.timestamp,
            cumulativePnL: cumulativePnL,
            periodPnL,
            highWaterMark: highWaterMark,
            lowWaterMark: lowWaterMark,
            drawdown: drawdown,
            peakTime,
            troughTime,
        });
    }
    return intradayData;
}
/**
 * Calculate hourly P&L breakdown
 * @param snapshots - Intraday snapshots
 * @returns Hourly P&L data
 */
function calculateHourlyPnL(snapshots) {
    const hourlyPnL = new Map();
    for (let hour = 0; hour < 24; hour++) {
        const hourSnapshots = snapshots.filter(s => s.timestamp.getHours() === hour);
        if (hourSnapshots.length === 0)
            continue;
        const hourPnL = hourSnapshots.reduce((sum, s) => sum.plus(s.totalPnL), new decimal_js_1.default(0)).div(hourSnapshots.length);
        hourlyPnL.set(hour, hourPnL);
    }
    return hourlyPnL;
}
// ============================================================================
// P&L ATTRIBUTION
// ============================================================================
/**
 * Attribute P&L by strategy
 * @param realizedPnL - All realized P&L records
 * @param trades - All trade executions
 * @returns Strategy attribution
 */
function attributePnLByStrategy(realizedPnL, trades) {
    const strategyPnL = new Map();
    for (const record of realizedPnL) {
        const trade = trades.find(t => t.instrumentId === record.instrumentId);
        const strategyId = trade?.strategyId || 'UNKNOWN';
        const current = strategyPnL.get(strategyId) || { pnl: new decimal_js_1.default(0), tradeCount: 0 };
        strategyPnL.set(strategyId, {
            pnl: current.pnl.plus(record.netPnL),
            tradeCount: current.tradeCount + 1,
        });
    }
    const totalPnL = realizedPnL.reduce((sum, r) => sum.plus(r.netPnL), new decimal_js_1.default(0));
    const attributions = [];
    for (const [strategy, data] of strategyPnL.entries()) {
        const percentOfTotal = totalPnL.equals(0)
            ? createPercentage(0)
            : data.pnl.div(totalPnL).times(100);
        attributions.push({
            dimension: 'strategy',
            category: strategy,
            pnl: data.pnl,
            percentOfTotal,
            tradeCount: data.tradeCount,
            avgPnLPerTrade: data.pnl.div(data.tradeCount),
        });
    }
    return {
        totalPnL,
        attributions: attributions.sort((a, b) => b.pnl.comparedTo(a.pnl)),
        unexplained: createPnL(0),
        timestamp: new Date(),
    };
}
/**
 * Attribute P&L by asset class
 * @param positions - All positions
 * @param positionsPnL - P&L for each position
 * @returns Asset class attribution
 */
function attributePnLByAssetClass(positions, positionsPnL) {
    const assetClassPnL = new Map();
    for (const positionPnL of positionsPnL) {
        const position = positions.find(p => p.positionId === positionPnL.positionId);
        if (!position)
            continue;
        const current = assetClassPnL.get(position.assetClass) || { pnl: new decimal_js_1.default(0), count: 0 };
        assetClassPnL.set(position.assetClass, {
            pnl: current.pnl.plus(positionPnL.totalPnL),
            count: current.count + 1,
        });
    }
    const totalPnL = positionsPnL.reduce((sum, p) => sum.plus(p.totalPnL), new decimal_js_1.default(0));
    const attributions = [];
    for (const [assetClass, data] of assetClassPnL.entries()) {
        const percentOfTotal = totalPnL.equals(0)
            ? createPercentage(0)
            : data.pnl.div(totalPnL).times(100);
        attributions.push({
            dimension: 'assetClass',
            category: assetClass,
            pnl: data.pnl,
            percentOfTotal,
            tradeCount: data.count,
            avgPnLPerTrade: data.pnl.div(data.count),
        });
    }
    return {
        totalPnL,
        attributions: attributions.sort((a, b) => b.pnl.comparedTo(a.pnl)),
        unexplained: createPnL(0),
        timestamp: new Date(),
    };
}
/**
 * Attribute P&L by trader
 * @param realizedPnL - All realized P&L records
 * @param trades - All trade executions
 * @returns Trader attribution
 */
function attributePnLByTrader(realizedPnL, trades) {
    const traderPnL = new Map();
    for (const record of realizedPnL) {
        const trade = trades.find(t => t.instrumentId === record.instrumentId);
        const traderId = trade?.traderId || 'UNKNOWN';
        const current = traderPnL.get(traderId) || { pnl: new decimal_js_1.default(0), tradeCount: 0 };
        traderPnL.set(traderId, {
            pnl: current.pnl.plus(record.netPnL),
            tradeCount: current.tradeCount + 1,
        });
    }
    const totalPnL = realizedPnL.reduce((sum, r) => sum.plus(r.netPnL), new decimal_js_1.default(0));
    const attributions = [];
    for (const [trader, data] of traderPnL.entries()) {
        const percentOfTotal = totalPnL.equals(0)
            ? createPercentage(0)
            : data.pnl.div(totalPnL).times(100);
        attributions.push({
            dimension: 'trader',
            category: trader,
            pnl: data.pnl,
            percentOfTotal,
            tradeCount: data.tradeCount,
            avgPnLPerTrade: data.pnl.div(data.tradeCount),
        });
    }
    return {
        totalPnL,
        attributions: attributions.sort((a, b) => b.pnl.comparedTo(a.pnl)),
        unexplained: createPnL(0),
        timestamp: new Date(),
    };
}
/**
 * Multi-dimensional P&L attribution
 * @param positions - All positions
 * @param positionsPnL - P&L for each position
 * @param trades - All trade executions
 * @param dimensions - Dimensions to attribute by
 * @returns Multi-dimensional attribution
 */
function multiDimensionalAttribution(positions, positionsPnL, trades, dimensions) {
    const results = new Map();
    for (const dimension of dimensions) {
        let attribution;
        switch (dimension) {
            case 'assetClass':
                attribution = attributePnLByAssetClass(positions, positionsPnL);
                break;
            case 'sector':
                attribution = attributePnLBySector(positions, positionsPnL);
                break;
            case 'geography':
                attribution = attributePnLByGeography(positions, positionsPnL);
                break;
            default:
                attribution = {
                    totalPnL: createPnL(0),
                    attributions: [],
                    unexplained: createPnL(0),
                    timestamp: new Date(),
                };
        }
        results.set(dimension, attribution);
    }
    return results;
}
/**
 * Attribute P&L by sector
 */
function attributePnLBySector(positions, positionsPnL) {
    const sectorPnL = new Map();
    for (const positionPnL of positionsPnL) {
        const position = positions.find(p => p.positionId === positionPnL.positionId);
        if (!position)
            continue;
        const sector = position.metadata?.sector || 'UNKNOWN';
        const current = sectorPnL.get(sector) || { pnl: new decimal_js_1.default(0), count: 0 };
        sectorPnL.set(sector, {
            pnl: current.pnl.plus(positionPnL.totalPnL),
            count: current.count + 1,
        });
    }
    const totalPnL = positionsPnL.reduce((sum, p) => sum.plus(p.totalPnL), new decimal_js_1.default(0));
    const attributions = [];
    for (const [sector, data] of sectorPnL.entries()) {
        const percentOfTotal = totalPnL.equals(0)
            ? createPercentage(0)
            : data.pnl.div(totalPnL).times(100);
        attributions.push({
            dimension: 'sector',
            category: sector,
            pnl: data.pnl,
            percentOfTotal,
            tradeCount: data.count,
            avgPnLPerTrade: data.pnl.div(data.count),
        });
    }
    return {
        totalPnL,
        attributions,
        unexplained: createPnL(0),
        timestamp: new Date(),
    };
}
/**
 * Attribute P&L by geography
 */
function attributePnLByGeography(positions, positionsPnL) {
    const geoPnL = new Map();
    for (const positionPnL of positionsPnL) {
        const position = positions.find(p => p.positionId === positionPnL.positionId);
        if (!position)
            continue;
        const geography = position.metadata?.geography || 'UNKNOWN';
        const current = geoPnL.get(geography) || { pnl: new decimal_js_1.default(0), count: 0 };
        geoPnL.set(geography, {
            pnl: current.pnl.plus(positionPnL.totalPnL),
            count: current.count + 1,
        });
    }
    const totalPnL = positionsPnL.reduce((sum, p) => sum.plus(p.totalPnL), new decimal_js_1.default(0));
    const attributions = [];
    for (const [geography, data] of geoPnL.entries()) {
        const percentOfTotal = totalPnL.equals(0)
            ? createPercentage(0)
            : data.pnl.div(totalPnL).times(100);
        attributions.push({
            dimension: 'geography',
            category: geography,
            pnl: data.pnl,
            percentOfTotal,
            tradeCount: data.count,
            avgPnLPerTrade: data.pnl.div(data.count),
        });
    }
    return {
        totalPnL,
        attributions,
        unexplained: createPnL(0),
        timestamp: new Date(),
    };
}
// ============================================================================
// CURRENCY P&L CALCULATIONS
// ============================================================================
/**
 * Calculate FX transaction gains/losses
 * @param trades - Trades in foreign currency
 * @param fxRates - FX rates at trade time
 * @param settlementFxRates - FX rates at settlement
 * @returns Transaction FX P&L
 */
function calculateFXTransactionPnL(trades, fxRates, settlementFxRates) {
    const currencyPnL = new Map();
    for (const trade of trades) {
        if (trade.currency === 'USD')
            continue; // Assuming USD as base
        const tradeRate = fxRates.get(trade.currency) || new decimal_js_1.default(1);
        const settlementRate = settlementFxRates.get(trade.currency) || new decimal_js_1.default(1);
        const tradeAmount = trade.quantity.times(trade.executionPrice);
        const fxGainLoss = tradeAmount.times(settlementRate.minus(tradeRate));
        const current = currencyPnL.get(trade.currency) || new decimal_js_1.default(0);
        currencyPnL.set(trade.currency, current.plus(fxGainLoss));
    }
    const result = [];
    for (const [currency, transactionGains] of currencyPnL.entries()) {
        result.push({
            currency,
            transactionGains: transactionGains,
            translationAdjustments: createPnL(0), // Would calculate from position revaluations
            totalFxPnL: transactionGains,
            percentOfTotalPnL: createPercentage(0), // Would calculate with total P&L
        });
    }
    return result;
}
/**
 * Calculate FX translation adjustments for positions
 * @param positions - Positions in foreign currencies
 * @param priorFxRates - FX rates from prior period
 * @param currentFxRates - Current FX rates
 * @returns Translation adjustments
 */
function calculateFXTranslationAdjustments(positions, priorFxRates, currentFxRates) {
    const translationPnL = new Map();
    for (const position of positions) {
        if (position.currency === 'USD')
            continue;
        const priorRate = priorFxRates.get(position.currency) || new decimal_js_1.default(1);
        const currentRate = currentFxRates.get(position.currency) || new decimal_js_1.default(1);
        const positionValue = position.marketValue;
        const translation = positionValue.times(currentRate.minus(priorRate));
        const current = translationPnL.get(position.currency) || new decimal_js_1.default(0);
        translationPnL.set(position.currency, current.plus(translation));
    }
    const result = [];
    for (const [currency, translationAdj] of translationPnL.entries()) {
        result.push({
            currency,
            transactionGains: createPnL(0),
            translationAdjustments: translationAdj,
            totalFxPnL: translationAdj,
            percentOfTotalPnL: createPercentage(0),
        });
    }
    return result;
}
// ============================================================================
// TAX LOT ACCOUNTING
// ============================================================================
/**
 * Create tax lot from purchase
 * @param trade - Purchase trade
 * @returns New tax lot
 */
function createTaxLot(trade) {
    const costBasis = trade.quantity.times(trade.executionPrice)
        .plus(trade.commission).plus(trade.fees);
    return {
        lotId: `LOT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        instrumentId: trade.instrumentId,
        symbol: trade.symbol,
        acquisitionDate: trade.executionTime,
        quantity: trade.quantity,
        costBasis,
        averageCost: costBasis.div(trade.quantity),
        remainingQuantity: trade.quantity,
        remainingCostBasis: costBasis,
        status: 'OPEN',
    };
}
/**
 * Allocate sale to tax lots using FIFO
 * @param taxLots - Available tax lots
 * @param saleQuantity - Quantity being sold
 * @param salePrice - Sale price
 * @returns Tax lot allocations
 */
function allocateTaxLotsFIFO(taxLots, saleQuantity, salePrice, saleDate) {
    const sorted = [...taxLots]
        .filter(lot => lot.status !== 'CLOSED')
        .sort((a, b) => a.acquisitionDate.getTime() - b.acquisitionDate.getTime());
    const allocations = [];
    let remainingToSell = saleQuantity;
    for (const lot of sorted) {
        if (remainingToSell.lessThanOrEqualTo(0))
            break;
        const quantityFromLot = decimal_js_1.default.min(lot.remainingQuantity, remainingToSell);
        const costBasisFromLot = lot.averageCost.times(quantityFromLot);
        const proceeds = salePrice.times(quantityFromLot);
        const realizedPnL = proceeds.minus(costBasisFromLot);
        const holdingPeriod = Math.floor((saleDate.getTime() - lot.acquisitionDate.getTime()) / (1000 * 60 * 60 * 24));
        const taxTreatment = holdingPeriod >= 365 ? 'LONG_TERM' : 'SHORT_TERM';
        allocations.push({
            lotId: lot.lotId,
            quantityUsed: quantityFromLot,
            costBasisUsed: costBasisFromLot,
            realizedPnL,
            holdingPeriod,
            taxTreatment,
        });
        remainingToSell = remainingToSell.minus(quantityFromLot);
    }
    if (remainingToSell.greaterThan(0)) {
        throw new Error(`Insufficient tax lots: ${remainingToSell.toString()} shares remaining`);
    }
    return allocations;
}
/**
 * Allocate sale to tax lots using LIFO
 * @param taxLots - Available tax lots
 * @param saleQuantity - Quantity being sold
 * @param salePrice - Sale price
 * @param saleDate - Sale date
 * @returns Tax lot allocations
 */
function allocateTaxLotsLIFO(taxLots, saleQuantity, salePrice, saleDate) {
    const sorted = [...taxLots]
        .filter(lot => lot.status !== 'CLOSED')
        .sort((a, b) => b.acquisitionDate.getTime() - a.acquisitionDate.getTime()); // Reverse sort
    return allocateTaxLotsFIFO(sorted.map(lot => ({ ...lot })), saleQuantity, salePrice, saleDate);
}
/**
 * Calculate average cost basis
 * @param taxLots - All tax lots for instrument
 * @returns Average cost per share
 */
function calculateAverageCost(taxLots) {
    const openLots = taxLots.filter(lot => lot.status !== 'CLOSED');
    const totalQuantity = openLots.reduce((sum, lot) => sum.plus(lot.remainingQuantity), new decimal_js_1.default(0));
    const totalCostBasis = openLots.reduce((sum, lot) => sum.plus(lot.remainingCostBasis), new decimal_js_1.default(0));
    return totalQuantity.equals(0)
        ? createPrice(0)
        : totalCostBasis.div(totalQuantity);
}
// ============================================================================
// P&L RECONCILIATION
// ============================================================================
/**
 * Reconcile book P&L vs street P&L
 * @param bookPnL - Internal book P&L
 * @param streetPnL - Broker/custodian P&L
 * @param tolerance - Acceptable variance threshold
 * @returns Reconciliation result
 */
function reconcilePnL(bookPnL, streetPnL, tolerance = new decimal_js_1.default(0.01) // 1 cent
) {
    const variance = bookPnL.minus(streetPnL);
    const variancePercent = streetPnL.equals(0)
        ? createPercentage(0)
        : variance.div(streetPnL.abs()).times(100);
    const status = variance.abs().lessThanOrEqualTo(tolerance) ? 'MATCHED' : 'BROKEN';
    return {
        reconciliationId: `RECON-${Date.now()}`,
        date: new Date(),
        bookPnL,
        streetPnL,
        variance: variance,
        variancePercent,
        breaks: [],
        status,
    };
}
/**
 * Identify reconciliation breaks
 * @param bookPositions - Internal book positions
 * @param streetPositions - Broker positions
 * @returns List of breaks
 */
function identifyReconciliationBreaks(bookPositions, streetPositions) {
    const breaks = [];
    // Check all book positions
    for (const [instrumentId, bookPos] of bookPositions.entries()) {
        const streetPos = streetPositions.get(instrumentId);
        if (!streetPos) {
            breaks.push({
                breakId: `BRK-${Date.now()}-${instrumentId}`,
                type: 'POSITION',
                instrumentId,
                symbol: bookPos.symbol,
                bookValue: bookPos.quantity,
                streetValue: new decimal_js_1.default(0),
                difference: bookPos.quantity,
                explanation: 'Position exists in book but not on street',
            });
            continue;
        }
        // Check quantity mismatch
        if (!bookPos.quantity.equals(streetPos.quantity)) {
            breaks.push({
                breakId: `BRK-${Date.now()}-${instrumentId}-QTY`,
                type: 'POSITION',
                instrumentId,
                symbol: bookPos.symbol,
                bookValue: bookPos.quantity,
                streetValue: streetPos.quantity,
                difference: bookPos.quantity.minus(streetPos.quantity),
                explanation: 'Quantity mismatch',
            });
        }
        // Check price mismatch
        if (!bookPos.currentPrice.equals(streetPos.price)) {
            breaks.push({
                breakId: `BRK-${Date.now()}-${instrumentId}-PRC`,
                type: 'PRICE',
                instrumentId,
                symbol: bookPos.symbol,
                bookValue: bookPos.currentPrice,
                streetValue: streetPos.price,
                difference: bookPos.currentPrice.minus(streetPos.price),
                explanation: 'Price mismatch',
            });
        }
    }
    // Check for positions on street but not in book
    for (const [instrumentId, streetPos] of streetPositions.entries()) {
        if (!bookPositions.has(instrumentId)) {
            breaks.push({
                breakId: `BRK-${Date.now()}-${instrumentId}`,
                type: 'POSITION',
                instrumentId,
                symbol: instrumentId,
                bookValue: new decimal_js_1.default(0),
                streetValue: streetPos.quantity,
                difference: streetPos.quantity.negated(),
                explanation: 'Position exists on street but not in book',
            });
        }
    }
    return breaks;
}
// ============================================================================
// HISTORICAL P&L REPORTING
// ============================================================================
/**
 * Generate P&L report for period
 * @param snapshots - All P&L snapshots
 * @param startDate - Period start
 * @param endDate - Period end
 * @param portfolioId - Portfolio ID
 * @param reportType - Report type
 * @returns P&L report
 */
function generatePnLReport(snapshots, startDate, endDate, portfolioId, reportType) {
    const periodSnapshots = snapshots.filter(s => s.timestamp >= startDate && s.timestamp <= endDate && s.portfolioId === portfolioId);
    if (periodSnapshots.length === 0) {
        throw new Error('No snapshots found for period');
    }
    const firstSnapshot = periodSnapshots[0];
    const lastSnapshot = periodSnapshots[periodSnapshots.length - 1];
    const totalPnL = lastSnapshot.totalPnL.minus(firstSnapshot.totalPnL);
    const realizedPnL = lastSnapshot.realizedPnL.minus(firstSnapshot.realizedPnL);
    const unrealizedPnL = lastSnapshot.unrealizedPnL;
    const fees = periodSnapshots.reduce((sum, s) => sum.plus(s.fees), new decimal_js_1.default(0));
    const commissions = periodSnapshots.reduce((sum, s) => sum.plus(s.commissions), new decimal_js_1.default(0));
    const netPnL = totalPnL.minus(fees).minus(commissions);
    // Calculate return percentage (simplified - would use time-weighted return in production)
    const returnPercent = lastSnapshot.returnPercent;
    // Find best and worst days
    const dailyPnL = periodSnapshots.map((snapshot, i) => ({
        date: snapshot.timestamp,
        pnl: i === 0
            ? snapshot.totalPnL
            : snapshot.totalPnL.minus(periodSnapshots[i - 1].totalPnL),
    }));
    const bestDay = dailyPnL.reduce((best, day) => day.pnl.greaterThan(best.pnl) ? day : best);
    const worstDay = dailyPnL.reduce((worst, day) => day.pnl.lessThan(worst.pnl) ? day : worst);
    const winningDays = dailyPnL.filter(d => d.pnl.greaterThan(0)).length;
    const winRate = dailyPnL.length > 0
        ? new decimal_js_1.default(winningDays).div(dailyPnL.length).times(100)
        : createPercentage(0);
    return {
        reportId: `RPT-${Date.now()}`,
        reportType,
        startDate,
        endDate,
        portfolioId,
        totalPnL,
        realizedPnL,
        unrealizedPnL,
        fees,
        commissions,
        netPnL,
        returnPercent,
        winRate,
        bestDay,
        worstDay,
        dailyPnL,
    };
}
/**
 * Calculate MTD (Month-to-Date) P&L
 * @param snapshots - All snapshots
 * @param portfolioId - Portfolio ID
 * @returns MTD P&L
 */
function calculateMTDPnL(snapshots, portfolioId) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const report = generatePnLReport(snapshots, monthStart, now, portfolioId, 'MONTHLY');
    return report.totalPnL;
}
/**
 * Calculate YTD (Year-to-Date) P&L
 * @param snapshots - All snapshots
 * @param portfolioId - Portfolio ID
 * @returns YTD P&L
 */
function calculateYTDPnL(snapshots, portfolioId) {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const report = generatePnLReport(snapshots, yearStart, now, portfolioId, 'YEARLY');
    return report.totalPnL;
}
/**
 * Calculate since-inception P&L
 * @param snapshots - All snapshots
 * @param portfolioId - Portfolio ID
 * @param inceptionDate - Portfolio inception date
 * @returns Since-inception P&L
 */
function calculateInceptionPnL(snapshots, portfolioId, inceptionDate) {
    const now = new Date();
    const report = generatePnLReport(snapshots, inceptionDate, now, portfolioId, 'INCEPTION');
    return report.totalPnL;
}
//# sourceMappingURL=pnl-calculation-kit.js.map