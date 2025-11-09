"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRiskValue = exports.createExposure = exports.createPercentage = exports.createNotional = exports.createQuantity = exports.createPrice = void 0;
exports.createPosition = createPosition;
exports.updatePositionPrice = updatePositionPrice;
exports.increasePosition = increasePosition;
exports.reducePosition = reducePosition;
exports.closePosition = closePosition;
exports.getOpenPositions = getOpenPositions;
exports.getPositionByInstrument = getPositionByInstrument;
exports.aggregatePositions = aggregatePositions;
exports.aggregateByPortfolio = aggregateByPortfolio;
exports.calculatePortfolioTotals = calculatePortfolioTotals;
exports.calculateNetExposure = calculateNetExposure;
exports.calculateGrossExposure = calculateGrossExposure;
exports.calculateLongExposure = calculateLongExposure;
exports.calculateShortExposure = calculateShortExposure;
exports.generateExposureReport = generateExposureReport;
exports.calculateLongShortRatio = calculateLongShortRatio;
exports.analyzeLongShortBalance = analyzeLongShortBalance;
exports.checkPositionLimits = checkPositionLimits;
exports.calculateLimitUtilization = calculateLimitUtilization;
exports.calculateFixedFractionalSize = calculateFixedFractionalSize;
exports.calculateKellyCriterionSize = calculateKellyCriterionSize;
exports.calculateVolatilityBasedSize = calculateVolatilityBasedSize;
exports.calculateRiskParitySize = calculateRiskParitySize;
exports.generateRebalanceRecommendations = generateRebalanceRecommendations;
exports.calculateRebalancingCosts = calculateRebalancingCosts;
exports.calculatePositionVaR = calculatePositionVaR;
exports.calculateExpectedShortfall = calculateExpectedShortfall;
exports.calculatePositionBeta = calculatePositionBeta;
exports.analyzeConcentration = analyzeConcentration;
exports.calculateCurrencyExposure = calculateCurrencyExposure;
exports.convertToBaseCurrency = convertToBaseCurrency;
const decimal_js_1 = __importDefault(require("decimal.js"));
const createPrice = (value) => new decimal_js_1.default(value);
exports.createPrice = createPrice;
const createQuantity = (value) => new decimal_js_1.default(value);
exports.createQuantity = createQuantity;
const createNotional = (value) => new decimal_js_1.default(value);
exports.createNotional = createNotional;
const createPercentage = (value) => new decimal_js_1.default(value);
exports.createPercentage = createPercentage;
const createExposure = (value) => new decimal_js_1.default(value);
exports.createExposure = createExposure;
const createRiskValue = (value) => new decimal_js_1.default(value);
exports.createRiskValue = createRiskValue;
// ============================================================================
// POSITION TRACKING AND MONITORING
// ============================================================================
/**
 * Create a new position record
 * @param positionData - Position data
 * @returns Created position
 */
function createPosition(positionData) {
    const marketValue = positionData.quantity.times(positionData.currentPrice);
    const costBasis = positionData.quantity.times(positionData.averagePrice);
    const unrealizedPnL = marketValue.minus(costBasis);
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
function updatePositionPrice(position, newPrice) {
    const marketValue = position.quantity.times(newPrice);
    const unrealizedPnL = marketValue.minus(position.costBasis);
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
function increasePosition(position, additionalQuantity, executionPrice) {
    const newQuantity = position.quantity.plus(additionalQuantity);
    const additionalCost = additionalQuantity.times(executionPrice);
    const newCostBasis = position.costBasis.plus(additionalCost);
    const newAveragePrice = newCostBasis.div(newQuantity);
    const newMarketValue = newQuantity.times(position.currentPrice);
    const unrealizedPnL = newMarketValue.minus(newCostBasis);
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
function reducePosition(position, quantityToClose, executionPrice) {
    if (quantityToClose.greaterThan(position.quantity)) {
        throw new Error('Cannot close more than current position size');
    }
    const remainingQuantity = position.quantity.minus(quantityToClose);
    const closedCost = position.averagePrice.times(quantityToClose);
    const closedProceeds = executionPrice.times(quantityToClose);
    const realizedPnL = position.side === 'LONG'
        ? closedProceeds.minus(closedCost)
        : closedCost.minus(closedProceeds);
    const newCostBasis = position.costBasis.minus(closedCost);
    const newMarketValue = remainingQuantity.times(position.currentPrice);
    const unrealizedPnL = newMarketValue.minus(newCostBasis);
    const updatedPosition = {
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
function closePosition(position, executionPrice) {
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
function getOpenPositions(positions, accountId) {
    return positions.filter(p => p.status === 'OPEN' &&
        (accountId === undefined || p.accountId === accountId));
}
/**
 * Get position by instrument
 * @param positions - All positions
 * @param instrumentId - Instrument identifier
 * @param accountId - Optional account filter
 * @returns Position or null
 */
function getPositionByInstrument(positions, instrumentId, accountId) {
    return positions.find(p => p.instrumentId === instrumentId &&
        p.status === 'OPEN' &&
        (accountId === undefined || p.accountId === accountId)) || null;
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
function aggregatePositions(positions, groupBy = 'instrument') {
    const groups = new Map();
    for (const position of positions) {
        const key = groupBy === 'instrument' ? position.instrumentId :
            groupBy === 'assetClass' ? position.assetClass :
                position.metadata?.sector || 'UNKNOWN';
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(position);
    }
    const aggregated = [];
    for (const [key, positionGroup] of groups.entries()) {
        const totalQuantity = positionGroup.reduce((sum, p) => sum.plus(p.side === 'LONG' ? p.quantity : p.quantity.negated()), new decimal_js_1.default(0));
        const totalCost = positionGroup.reduce((sum, p) => sum.plus(p.costBasis), new decimal_js_1.default(0));
        const totalMarketValue = positionGroup.reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
        const weightedAvgPrice = totalQuantity.equals(0)
            ? createPrice(0)
            : totalCost.div(totalQuantity.abs());
        const totalUnrealizedPnL = positionGroup.reduce((sum, p) => sum.plus(p.unrealizedPnL), new decimal_js_1.default(0));
        const netExposure = positionGroup.reduce((sum, p) => sum.plus(p.side === 'LONG'
            ? p.marketValue
            : p.marketValue.negated()), new decimal_js_1.default(0));
        aggregated.push({
            instrumentId: groupBy === 'instrument' ? key : '',
            symbol: positionGroup[0].symbol,
            assetClass: positionGroup[0].assetClass,
            totalQuantity,
            weightedAvgPrice,
            totalMarketValue,
            totalCostBasis: totalCost,
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
function aggregateByPortfolio(positions, portfolioId) {
    const portfolioPositions = positions.filter(p => p.portfolioId === portfolioId);
    return aggregatePositions(portfolioPositions, 'instrument');
}
/**
 * Calculate portfolio totals
 * @param positions - All positions in portfolio
 * @returns Portfolio totals
 */
function calculatePortfolioTotals(positions) {
    const totalMarketValue = positions.reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
    const totalCostBasis = positions.reduce((sum, p) => sum.plus(p.costBasis), new decimal_js_1.default(0));
    const totalUnrealizedPnL = positions.reduce((sum, p) => sum.plus(p.unrealizedPnL), new decimal_js_1.default(0));
    const totalReturnPercent = totalCostBasis.equals(0)
        ? createPercentage(0)
        : totalUnrealizedPnL.div(totalCostBasis).times(100);
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
function calculateNetExposure(positions) {
    return positions.reduce((net, p) => {
        const exposure = p.marketValue;
        return p.side === 'LONG'
            ? net.plus(exposure)
            : net.minus(exposure);
    }, new decimal_js_1.default(0));
}
/**
 * Calculate gross exposure for portfolio
 * @param positions - All positions
 * @returns Gross exposure (sum of absolute values)
 */
function calculateGrossExposure(positions) {
    return positions.reduce((sum, p) => sum.plus(p.marketValue.abs()), new decimal_js_1.default(0));
}
/**
 * Calculate long exposure
 * @param positions - All positions
 * @returns Total long exposure
 */
function calculateLongExposure(positions) {
    return positions
        .filter(p => p.side === 'LONG')
        .reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
}
/**
 * Calculate short exposure
 * @param positions - All positions
 * @returns Total short exposure (as positive number)
 */
function calculateShortExposure(positions) {
    return positions
        .filter(p => p.side === 'SHORT')
        .reduce((sum, p) => sum.plus(p.marketValue.abs()), new decimal_js_1.default(0));
}
/**
 * Generate comprehensive exposure report
 * @param positions - All positions
 * @param portfolioValue - Total portfolio value
 * @returns Detailed exposure report
 */
function generateExposureReport(positions, portfolioValue) {
    const longExposure = calculateLongExposure(positions);
    const shortExposure = calculateShortExposure(positions);
    const grossExposure = longExposure.plus(shortExposure);
    const netExposure = longExposure.minus(shortExposure);
    const leverage = portfolioValue.equals(0)
        ? new decimal_js_1.default(0)
        : grossExposure.div(portfolioValue);
    // By asset class
    const byAssetClass = new Map();
    for (const assetClass of ['EQUITY', 'FIXED_INCOME', 'COMMODITY', 'FX', 'DERIVATIVE', 'CRYPTO', 'CASH']) {
        const classPositions = positions.filter(p => p.assetClass === assetClass);
        const classExposure = calculateNetExposure(classPositions);
        if (!classExposure.equals(0)) {
            byAssetClass.set(assetClass, classExposure);
        }
    }
    // By sector
    const bySector = new Map();
    const sectorGroups = new Map();
    for (const position of positions) {
        const sector = position.metadata?.sector || 'UNKNOWN';
        if (!sectorGroups.has(sector)) {
            sectorGroups.set(sector, []);
        }
        sectorGroups.get(sector).push(position);
    }
    for (const [sector, sectorPositions] of sectorGroups.entries()) {
        bySector.set(sector, calculateNetExposure(sectorPositions));
    }
    // By geography
    const byGeography = new Map();
    const geoGroups = new Map();
    for (const position of positions) {
        const geography = position.metadata?.geography || 'UNKNOWN';
        if (!geoGroups.has(geography)) {
            geoGroups.set(geography, []);
        }
        geoGroups.get(geography).push(position);
    }
    for (const [geo, geoPositions] of geoGroups.entries()) {
        byGeography.set(geo, calculateNetExposure(geoPositions));
    }
    // By instrument
    const byInstrument = new Map();
    for (const position of positions) {
        const currentExposure = byInstrument.get(position.instrumentId) || createExposure(0);
        const positionExposure = position.side === 'LONG'
            ? position.marketValue
            : position.marketValue.negated();
        byInstrument.set(position.instrumentId, currentExposure.plus(positionExposure));
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
function calculateLongShortRatio(positions) {
    const longExp = calculateLongExposure(positions);
    const shortExp = calculateShortExposure(positions);
    if (shortExp.equals(0)) {
        return longExp.greaterThan(0) ? new decimal_js_1.default(Infinity) : new decimal_js_1.default(0);
    }
    return longExp.div(shortExp);
}
/**
 * Analyze long/short balance
 * @param positions - All positions
 * @returns Long/short analysis
 */
function analyzeLongShortBalance(positions) {
    const longExposure = calculateLongExposure(positions);
    const shortExposure = calculateShortExposure(positions);
    const netExposure = longExposure.minus(shortExposure);
    const ratio = calculateLongShortRatio(positions);
    const totalExposure = longExposure.plus(shortExposure);
    const longPercentage = totalExposure.equals(0)
        ? createPercentage(0)
        : longExposure.div(totalExposure).times(100);
    const shortPercentage = totalExposure.equals(0)
        ? createPercentage(0)
        : shortExposure.div(totalExposure).times(100);
    let balance;
    if (netExposure.abs().lessThan(totalExposure.times(0.1))) {
        balance = 'NEUTRAL';
    }
    else if (ratio.greaterThan(1.3)) {
        balance = 'LONG_HEAVY';
    }
    else if (ratio.lessThan(0.7)) {
        balance = 'SHORT_HEAVY';
    }
    else {
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
function checkPositionLimits(position, limits) {
    const violations = [];
    const warnings = [];
    for (const limit of limits) {
        const currentValue = position.marketValue;
        const currentPercent = createPercentage(0); // Would calculate against portfolio in production
        // Check hard limits
        if (limit.limitType === 'HARD') {
            if (currentValue.greaterThan(limit.maxNotional)) {
                violations.push({
                    limitId: limit.limitId,
                    limitType: 'HARD',
                    scope: limit.scope,
                    category: limit.category,
                    currentValue,
                    limitValue: limit.maxNotional,
                    excess: currentValue.minus(limit.maxNotional),
                    severity: 'CRITICAL',
                });
            }
        }
        // Check soft limits (warnings)
        if (limit.limitType === 'SOFT' || limit.limitType === 'WARNING') {
            const utilization = currentValue.div(limit.maxNotional).times(100);
            if (utilization.greaterThan(80)) {
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
function calculateLimitUtilization(positions, limit) {
    let currentValue = new decimal_js_1.default(0);
    // Aggregate based on limit scope
    switch (limit.scope) {
        case 'POSITION':
            const position = positions.find(p => p.instrumentId === limit.category);
            currentValue = position ? position.marketValue : new decimal_js_1.default(0);
            break;
        case 'SECTOR':
            currentValue = positions
                .filter(p => p.metadata?.sector === limit.category)
                .reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
            break;
        case 'ASSET_CLASS':
            currentValue = positions
                .filter(p => p.assetClass === limit.category)
                .reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
            break;
        case 'PORTFOLIO':
        case 'ACCOUNT':
            currentValue = positions.reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
            break;
    }
    return currentValue.div(limit.maxNotional).times(100);
}
// ============================================================================
// POSITION SIZING ALGORITHMS
// ============================================================================
/**
 * Calculate position size using fixed fractional method
 * @param params - Sizing parameters
 * @returns Recommended position size
 */
function calculateFixedFractionalSize(params) {
    if (params.strategy !== 'FIXED_FRACTIONAL') {
        throw new Error('Invalid strategy for fixed fractional sizing');
    }
    const riskPerTrade = params.riskPerTrade || createPercentage(2);
    const riskAmount = params.portfolioValue.times(riskPerTrade.div(100));
    const stopLossDistance = params.stopLoss
        ? params.entryPrice.minus(params.stopLoss).abs()
        : params.entryPrice.times(0.05); // Default 5% stop
    const quantity = riskAmount.div(stopLossDistance);
    const notional = quantity.times(params.entryPrice);
    const percentOfPortfolio = notional.div(params.portfolioValue).times(100);
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
function calculateKellyCriterionSize(params) {
    if (params.strategy !== 'KELLY_CRITERION') {
        throw new Error('Invalid strategy for Kelly Criterion sizing');
    }
    if (!params.winRate || !params.avgWinLoss) {
        throw new Error('Kelly Criterion requires winRate and avgWinLoss');
    }
    const winRate = params.winRate.div(100);
    const loseRate = new decimal_js_1.default(1).minus(winRate);
    const avgWinLoss = params.avgWinLoss;
    // Kelly % = (W * R - L) / R
    // W = win probability, L = loss probability, R = win/loss ratio
    const kellyPercent = winRate.times(avgWinLoss).minus(loseRate).div(avgWinLoss);
    // Use half-Kelly for safety
    const fractionalKelly = kellyPercent.div(2);
    const positionSize = fractionalKelly.greaterThan(0)
        ? fractionalKelly
        : new decimal_js_1.default(0);
    const notional = params.portfolioValue.times(positionSize);
    const quantity = notional.div(params.entryPrice);
    return {
        recommendedQuantity: quantity,
        recommendedNotional: notional,
        percentOfPortfolio: positionSize.times(100),
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
function calculateVolatilityBasedSize(params) {
    if (params.strategy !== 'VOLATILITY_BASED') {
        throw new Error('Invalid strategy for volatility-based sizing');
    }
    if (!params.instrumentVolatility || !params.volatilityTarget) {
        throw new Error('Volatility-based sizing requires instrumentVolatility and volatilityTarget');
    }
    // Scale position inversely with volatility
    const scalingFactor = params.volatilityTarget.div(params.instrumentVolatility);
    const baseAllocation = new decimal_js_1.default(0.1); // 10% base
    const adjustedAllocation = baseAllocation.times(scalingFactor);
    // Cap at 25%
    const finalAllocation = decimal_js_1.default.min(adjustedAllocation, new decimal_js_1.default(0.25));
    const notional = params.portfolioValue.times(finalAllocation);
    const quantity = notional.div(params.entryPrice);
    return {
        recommendedQuantity: quantity,
        recommendedNotional: notional,
        percentOfPortfolio: finalAllocation.times(100),
        riskAmount: notional.times(params.instrumentVolatility.div(100)),
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
function calculateRiskParitySize(params, allPositions) {
    if (params.strategy !== 'RISK_PARITY') {
        throw new Error('Invalid strategy for risk parity sizing');
    }
    // In risk parity, allocate capital such that each position contributes equally to portfolio risk
    // Simplified: weight inversely proportional to volatility
    const numPositions = allPositions.length + 1; // Include new position
    const targetRiskContribution = new decimal_js_1.default(1).div(numPositions);
    const instrumentVol = params.instrumentVolatility || createPercentage(20);
    const weight = targetRiskContribution.div(instrumentVol.div(100));
    const notional = params.portfolioValue.times(weight);
    const quantity = notional.div(params.entryPrice);
    return {
        recommendedQuantity: quantity,
        recommendedNotional: notional,
        percentOfPortfolio: weight.times(100),
        riskAmount: notional.times(instrumentVol.div(100)),
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
function generateRebalanceRecommendations(currentPositions, targetWeights, portfolioValue, rebalanceThreshold = createPercentage(5)) {
    const recommendations = [];
    // Calculate current weights
    const currentWeights = new Map();
    for (const position of currentPositions) {
        const weight = position.marketValue.div(portfolioValue).times(100);
        currentWeights.set(position.instrumentId, weight);
    }
    // Compare with target weights
    for (const [instrumentId, targetWeight] of targetWeights.entries()) {
        const currentWeight = currentWeights.get(instrumentId) || createPercentage(0);
        const drift = targetWeight.minus(currentWeight);
        if (drift.abs().greaterThan(rebalanceThreshold)) {
            const position = currentPositions.find(p => p.instrumentId === instrumentId);
            const targetNotional = portfolioValue.times(targetWeight.div(100));
            const currentNotional = position ? position.marketValue : createNotional(0);
            const notionalDiff = targetNotional.minus(currentNotional);
            const action = notionalDiff.greaterThan(0) ? 'BUY' :
                notionalDiff.lessThan(0) ? 'SELL' : 'HOLD';
            const currentPrice = position?.currentPrice || createPrice(100); // Would fetch from market data
            const quantity = notionalDiff.abs().div(currentPrice);
            const priority = drift.abs().greaterThan(rebalanceThreshold.times(2)) ? 'HIGH' :
                drift.abs().greaterThan(rebalanceThreshold) ? 'MEDIUM' : 'LOW';
            recommendations.push({
                instrumentId,
                symbol: position?.symbol || instrumentId,
                currentWeight,
                targetWeight,
                drift,
                action,
                quantity,
                notionalValue: notionalDiff.abs(),
                priority,
            });
        }
    }
    return recommendations.sort((a, b) => b.drift.abs().comparedTo(a.drift.abs()));
}
/**
 * Calculate rebalancing costs
 * @param recommendations - Rebalancing recommendations
 * @param commissionRate - Commission rate (percentage)
 * @param spreadCost - Bid-ask spread cost (percentage)
 * @returns Total rebalancing cost
 */
function calculateRebalancingCosts(recommendations, commissionRate = createPercentage(0.1), spreadCost = createPercentage(0.05)) {
    const totalNotional = recommendations.reduce((sum, rec) => sum.plus(rec.notionalValue), new decimal_js_1.default(0));
    const totalCommissions = totalNotional.times(commissionRate.div(100));
    const totalSpreadCostValue = totalNotional.times(spreadCost.div(100));
    const totalCost = totalCommissions.plus(totalSpreadCostValue);
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
function calculatePositionVaR(position, historicalReturns, confidenceLevel = 0.95) {
    if (historicalReturns.length < 30) {
        throw new Error('Need at least 30 historical returns for VaR calculation');
    }
    // Sort returns
    const sortedReturns = [...historicalReturns].sort((a, b) => a.comparedTo(b));
    // Get percentile
    const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    const percentileReturn = sortedReturns[index];
    // VaR = position value * percentile return
    const var95 = position.marketValue.times(percentileReturn.abs());
    return var95;
}
/**
 * Calculate Expected Shortfall (Conditional VaR)
 * @param position - Position to analyze
 * @param historicalReturns - Historical returns
 * @param confidenceLevel - Confidence level
 * @returns Expected Shortfall value
 */
function calculateExpectedShortfall(position, historicalReturns, confidenceLevel = 0.95) {
    const sortedReturns = [...historicalReturns].sort((a, b) => a.comparedTo(b));
    const cutoffIndex = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    // Average of all returns worse than VaR
    const tailReturns = sortedReturns.slice(0, cutoffIndex);
    const avgTailReturn = tailReturns.reduce((sum, r) => sum.plus(r), new decimal_js_1.default(0))
        .div(tailReturns.length);
    const es = position.marketValue.times(avgTailReturn.abs());
    return es;
}
/**
 * Calculate position beta against benchmark
 * @param positionReturns - Position returns
 * @param benchmarkReturns - Benchmark returns
 * @returns Beta coefficient
 */
function calculatePositionBeta(positionReturns, benchmarkReturns) {
    if (positionReturns.length !== benchmarkReturns.length || positionReturns.length < 20) {
        throw new Error('Need at least 20 paired returns for beta calculation');
    }
    const n = positionReturns.length;
    const avgPosition = positionReturns.reduce((sum, r) => sum.plus(r), new decimal_js_1.default(0)).div(n);
    const avgBenchmark = benchmarkReturns.reduce((sum, r) => sum.plus(r), new decimal_js_1.default(0)).div(n);
    let covariance = new decimal_js_1.default(0);
    let benchmarkVariance = new decimal_js_1.default(0);
    for (let i = 0; i < n; i++) {
        const positionDiff = positionReturns[i].minus(avgPosition);
        const benchmarkDiff = benchmarkReturns[i].minus(avgBenchmark);
        covariance = covariance.plus(positionDiff.times(benchmarkDiff));
        benchmarkVariance = benchmarkVariance.plus(benchmarkDiff.pow(2));
    }
    covariance = covariance.div(n);
    benchmarkVariance = benchmarkVariance.div(n);
    return benchmarkVariance.equals(0) ? new decimal_js_1.default(0) : covariance.div(benchmarkVariance);
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
function analyzeConcentration(positions, portfolioValue, limits) {
    // Sort positions by market value descending
    const sortedPositions = [...positions].sort((a, b) => b.marketValue.comparedTo(a.marketValue));
    // Single position concentration
    const singlePositionMax = sortedPositions.length > 0
        ? sortedPositions[0].marketValue.div(portfolioValue).times(100)
        : createPercentage(0);
    // Top 5 concentration
    const top5Value = sortedPositions.slice(0, 5).reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
    const top5Concentration = top5Value.div(portfolioValue).times(100);
    // Top 10 concentration
    const top10Value = sortedPositions.slice(0, 10).reduce((sum, p) => sum.plus(p.marketValue), new decimal_js_1.default(0));
    const top10Concentration = top10Value.div(portfolioValue).times(100);
    // Herfindahl-Hirschman Index (sum of squared weights)
    const herfindahlIndex = positions.reduce((sum, p) => {
        const weight = p.marketValue.div(portfolioValue);
        return sum.plus(weight.pow(2));
    }, new decimal_js_1.default(0));
    const effectiveN = herfindahlIndex.greaterThan(0) ? new decimal_js_1.default(1).div(herfindahlIndex) : new decimal_js_1.default(0);
    // Check for breaches
    const breaches = [];
    if (singlePositionMax.greaterThan(limits.singlePosition)) {
        breaches.push({
            type: 'SINGLE_POSITION',
            identifier: sortedPositions[0].symbol,
            currentConcentration: singlePositionMax,
            limit: limits.singlePosition,
            excess: singlePositionMax.minus(limits.singlePosition),
        });
    }
    if (top5Concentration.greaterThan(limits.top5)) {
        breaches.push({
            type: 'SINGLE_POSITION',
            identifier: 'Top 5 Positions',
            currentConcentration: top5Concentration,
            limit: limits.top5,
            excess: top5Concentration.minus(limits.top5),
        });
    }
    if (top10Concentration.greaterThan(limits.top10)) {
        breaches.push({
            type: 'SINGLE_POSITION',
            identifier: 'Top 10 Positions',
            currentConcentration: top10Concentration,
            limit: limits.top10,
            excess: top10Concentration.minus(limits.top10),
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
function calculateCurrencyExposure(positions, portfolioValue, fxRates) {
    const currencyGroups = new Map();
    for (const position of positions) {
        if (!currencyGroups.has(position.currency)) {
            currencyGroups.set(position.currency, []);
        }
        currencyGroups.get(position.currency).push(position);
    }
    const exposures = [];
    for (const [currency, currencyPositions] of currencyGroups.entries()) {
        const fxRate = fxRates.get(currency) || new decimal_js_1.default(1);
        const currencyExposure = currencyPositions.reduce((sum, p) => sum.plus(p.marketValue.times(fxRate)), new decimal_js_1.default(0));
        const percentOfPortfolio = currencyExposure.div(portfolioValue).times(100);
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
    return exposures.sort((a, b) => b.exposure.comparedTo(a.exposure));
}
/**
 * Convert position to base currency
 * @param position - Position in foreign currency
 * @param fxRate - FX rate to base currency
 * @returns Position value in base currency
 */
function convertToBaseCurrency(position, fxRate) {
    return position.marketValue.times(fxRate);
}
//# sourceMappingURL=position-management-kit.js.map