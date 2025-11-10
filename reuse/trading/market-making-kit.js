"use strict";
/**
 * LOC: TRD-MM-025
 * File: /reuse/trading/market-making-kit.ts
 *
 * UPSTREAM (imports from):
 *   - decimal.js (Decimal for precise calculations)
 *   - ./market-microstructure-kit.ts (order book types, microstructure analysis)
 *   - ./liquidity-analysis-kit.ts (liquidity metrics)
 *   - ./risk-management-kit.ts (risk limits, position limits)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/market-making/*
 *   - backend/controllers/market-maker.controller.ts
 *   - backend/services/market-making.service.ts
 *   - backend/services/liquidity-provision.service.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTwoSidedQuote = generateTwoSidedQuote;
exports.calculateOptimalSpread = calculateOptimalSpread;
exports.determineQuoteUpdate = determineQuoteUpdate;
exports.calculateInventorySkew = calculateInventorySkew;
exports.checkQuoteObligation = checkQuoteObligation;
exports.calculateQuoteUptime = calculateQuoteUptime;
exports.validateQuoteAgainstNBBO = validateQuoteAgainstNBBO;
exports.updateInventoryPosition = updateInventoryPosition;
exports.calculateInventoryRisk = calculateInventoryRisk;
exports.determineOptimalHedge = determineOptimalHedge;
exports.calculateMarketMakerPnL = calculateMarketMakerPnL;
exports.calculateSpreadCaptureEfficiency = calculateSpreadCaptureEfficiency;
exports.detectQuoteStuffing = detectQuoteStuffing;
exports.calculateOptimalQuoteFrequency = calculateOptimalQuoteFrequency;
exports.calculateMarketMakerRebates = calculateMarketMakerRebates;
exports.estimateRebateIncome = estimateRebateIncome;
exports.detectAdverseSelection = detectAdverseSelection;
exports.calculateAdverseSelectionCost = calculateAdverseSelectionCost;
exports.calculateConstantProductAMM = calculateConstantProductAMM;
exports.calculateConstantSumAMM = calculateConstantSumAMM;
exports.calculateHybridAMM = calculateHybridAMM;
exports.calculateAMMLiquidityShare = calculateAMMLiquidityShare;
exports.calculateMarketMakerPerformance = calculateMarketMakerPerformance;
exports.analyzeQuoteQuality = analyzeQuoteQuality;
exports.estimateMarketImpact = estimateMarketImpact;
exports.analyzeCompetitors = analyzeCompetitors;
exports.calculateCompetitiveScore = calculateCompetitiveScore;
exports.recommendMarketMakingStrategy = recommendMarketMakingStrategy;
exports.calculateDepthAtPrice = calculateDepthAtPrice;
exports.optimizeQuotePlacement = optimizeQuotePlacement;
exports.calculateOrderBookPressure = calculateOrderBookPressure;
exports.detectOrderBookToxicity = detectOrderBookToxicity;
exports.calculateOptimalQuoteSize = calculateOptimalQuoteSize;
exports.calculateTotalDeltaExposure = calculateTotalDeltaExposure;
exports.generateDeltaHedgingPlan = generateDeltaHedgingPlan;
exports.calculateHedgingEfficiency = calculateHedgingEfficiency;
exports.determineDynamicHedgeRatio = determineDynamicHedgeRatio;
exports.calculateVolatilityAdjustedSpread = calculateVolatilityAdjustedSpread;
exports.calculateTimeOfDaySpreadAdjustment = calculateTimeOfDaySpreadAdjustment;
exports.calculateToxicityAdjustedSpread = calculateToxicityAdjustedSpread;
exports.optimizeSpreadForProfit = optimizeSpreadForProfit;
exports.calculateQuoteResponseTime = calculateQuoteResponseTime;
exports.calculateRealizedVolatility = calculateRealizedVolatility;
exports.calculateWinRate = calculateWinRate;
exports.calculateAverageHoldingPeriod = calculateAverageHoldingPeriod;
exports.calculateQuoteStability = calculateQuoteStability;
exports.calculateMarketMakingVaR = calculateMarketMakingVaR;
exports.detectInventoryLimitBreach = detectInventoryLimitBreach;
exports.calculateConcentrationRisk = calculateConcentrationRisk;
exports.calculateStressTestScenario = calculateStressTestScenario;
/**
 * File: /reuse/trading/market-making-kit.ts
 * Locator: WC-TRD-MM-025
 * Purpose: Bloomberg Terminal-Level Market Making - quote generation, inventory management, AMM algorithms, spread optimization
 *
 * Upstream: Decimal.js, market-microstructure-kit, liquidity-analysis-kit, risk-management-kit
 * Downstream: Trading controllers, market making services, liquidity provision systems, compliance
 * Dependencies: TypeScript 5.x, Node 18+, Decimal.js
 * Exports: 50 production-ready functions for market making, quote generation, inventory management, spread optimization, AMM
 *
 * LLM Context: Institutional-grade market making utilities competing with Bloomberg Terminal.
 * Provides comprehensive market maker functionality including two-sided quote generation, spread management,
 * inventory risk controls, quote obligation monitoring, P&L attribution, spread optimization algorithms,
 * quote stuffing prevention, market maker rebates calculation, adverse selection detection and mitigation,
 * automated market making (AMM) algorithms (constant product, constant sum, hybrid), liquidity provision strategies,
 * performance analytics, quote update frequency optimization, delta hedging, quote skewing based on inventory,
 * market impact minimization, and competition analysis. All calculations use arbitrary precision arithmetic.
 */
const decimal_js_1 = __importDefault(require("decimal.js"));
const asPrice = (value) => new decimal_js_1.default(value);
const asQuantity = (value) => new decimal_js_1.default(value);
const asSpread = (value) => new decimal_js_1.default(value);
const asBasisPoints = (value) => new decimal_js_1.default(value);
const asDelta = (value) => new decimal_js_1.default(value);
const asInventoryValue = (value) => new decimal_js_1.default(value);
const asPnL = (value) => new decimal_js_1.default(value);
const asPercentage = (value) => new decimal_js_1.default(value);
const asRebateAmount = (value) => new decimal_js_1.default(value);
// ============================================================================
// QUOTE GENERATION FUNCTIONS
// ============================================================================
/**
 * Generate a two-sided market maker quote
 * Creates bid and ask quotes with specified spread and size
 *
 * @param params - Quote generation parameters
 * @returns Market maker quote
 */
function generateTwoSidedQuote(params) {
    const { instrumentId, symbol, midPrice, spreadBps, bidSize, askSize, skew = new decimal_js_1.default(0) } = params;
    const midDecimal = new decimal_js_1.default(midPrice);
    const spreadDecimal = new decimal_js_1.default(spreadBps);
    const skewDecimal = new decimal_js_1.default(skew);
    // Calculate half spread in price terms
    const halfSpreadPrice = midDecimal.mul(spreadDecimal).div(20000); // divide by 20000 = (2 * 10000)
    // Apply skew: positive skew widens ask, negative widens bid
    const skewAdjustment = halfSpreadPrice.mul(skewDecimal);
    const bidPrice = asPrice(midDecimal.sub(halfSpreadPrice).sub(skewAdjustment));
    const askPrice = asPrice(midDecimal.add(halfSpreadPrice).add(skewAdjustment));
    const actualSpread = asSpread(askPrice.sub(bidPrice));
    const actualSpreadBps = asBasisPoints(actualSpread.div(midDecimal).mul(10000));
    return {
        quoteId: `Q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        instrumentId,
        symbol,
        timestamp: new Date(),
        bidPrice,
        bidSize,
        askPrice,
        askSize,
        spread: actualSpread,
        spreadBps: actualSpreadBps,
        midPrice,
        skew: skewDecimal,
        quoteState: 'ACTIVE',
        quoteDuration: 0,
        quoteSource: 'ALGORITHM',
    };
}
/**
 * Calculate optimal quote spread based on market conditions
 * Uses volatility, inventory, competition, and adverse selection
 *
 * @param params - Spread optimization inputs
 * @returns Optimal spread parameters
 */
function calculateOptimalSpread(params) {
    const { baseSpreadBps, volatility, inventoryRatio, competitorSpreadBps, adverseSelectionRate, timeOfDay, } = params;
    const baseDecimal = new decimal_js_1.default(baseSpreadBps);
    // Volatility adjustment: higher vol = wider spread
    const volAdjustment = new decimal_js_1.default(volatility).mul(0.5);
    // Inventory adjustment: larger inventory = wider spread on inventory side
    const invAdjustment = new decimal_js_1.default(inventoryRatio).abs().mul(0.3);
    // Competition adjustment: stay competitive
    const competitorDecimal = new decimal_js_1.default(competitorSpreadBps);
    const competitionAdjustment = competitorDecimal.sub(baseDecimal).mul(0.2);
    // Adverse selection adjustment: higher adverse selection = wider spread
    const adverseDecimal = new decimal_js_1.default(adverseSelectionRate);
    const adverseAdjustment = adverseDecimal.mul(0.4);
    // Time of day adjustment: widen at open/close
    const hour = timeOfDay.getHours();
    const minute = timeOfDay.getMinutes();
    const timeScore = (hour === 9 && minute < 45) || (hour === 15 && minute >= 30) ? 0.2 : 0;
    const timeAdjustment = new decimal_js_1.default(timeScore);
    // Calculate optimal spread
    const optimalSpread = baseDecimal
        .mul(new decimal_js_1.default(1).add(volAdjustment))
        .mul(new decimal_js_1.default(1).add(invAdjustment))
        .add(competitionAdjustment)
        .mul(new decimal_js_1.default(1).add(adverseAdjustment))
        .mul(new decimal_js_1.default(1).add(timeAdjustment));
    // Ensure minimum spread
    const finalSpread = decimal_js_1.default.max(optimalSpread, baseDecimal.mul(0.5));
    return {
        baseSpreadBps,
        volatilityAdjustment: volAdjustment,
        inventoryAdjustment: invAdjustment,
        competitionAdjustment: competitionAdjustment,
        adverseSelectionAdjustment: adverseAdjustment,
        timeOfDayAdjustment: timeAdjustment,
        optimalSpreadBps: asBasisPoints(finalSpread),
        confidence: asPercentage(new decimal_js_1.default(0.85)),
    };
}
/**
 * Update quote based on market conditions
 * Determines if quote should be updated and calculates new prices
 *
 * @param currentQuote - Current active quote
 * @param marketMidPrice - Current market mid price
 * @param inventory - Current inventory position
 * @param threshold - Update threshold in basis points
 * @returns Quote update decision
 */
function determineQuoteUpdate(currentQuote, marketMidPrice, inventory, threshold) {
    const currentMid = new decimal_js_1.default(currentQuote.midPrice);
    const newMid = new decimal_js_1.default(marketMidPrice);
    const thresholdDecimal = new decimal_js_1.default(threshold);
    // Calculate price movement in bps
    const priceMoveBps = newMid.sub(currentMid).div(currentMid).mul(10000).abs();
    // Check if market has moved significantly
    if (priceMoveBps.gte(thresholdDecimal)) {
        const halfSpread = new decimal_js_1.default(currentQuote.spread).div(2);
        return {
            shouldUpdate: true,
            reason: 'MARKET_MOVE',
            urgency: priceMoveBps.gte(thresholdDecimal.mul(2)) ? 'HIGH' : 'MEDIUM',
            newBidPrice: asPrice(newMid.sub(halfSpread)),
            newAskPrice: asPrice(newMid.add(halfSpread)),
            newBidSize: currentQuote.bidSize,
            newAskSize: currentQuote.askSize,
        };
    }
    // Check inventory risk
    const inventoryRatio = new decimal_js_1.default(inventory.currentPosition)
        .div(inventory.maxPosition)
        .abs();
    if (inventoryRatio.gte(0.8)) {
        return {
            shouldUpdate: true,
            reason: 'INVENTORY_CHANGE',
            urgency: 'HIGH',
            newBidPrice: currentQuote.bidPrice,
            newAskPrice: currentQuote.askPrice,
            newBidSize: currentQuote.bidSize,
            newAskSize: currentQuote.askSize,
        };
    }
    // Check quote age
    const quoteAge = Date.now() - currentQuote.timestamp.getTime();
    if (quoteAge > 5000) {
        // 5 seconds
        return {
            shouldUpdate: true,
            reason: 'TIME_DECAY',
            urgency: 'LOW',
            newBidPrice: currentQuote.bidPrice,
            newAskPrice: currentQuote.askPrice,
            newBidSize: currentQuote.bidSize,
            newAskSize: currentQuote.askSize,
        };
    }
    return {
        shouldUpdate: false,
        reason: 'NONE',
        urgency: 'LOW',
    };
}
/**
 * Calculate quote skew based on inventory position
 * Skews quotes to reduce inventory risk
 *
 * @param inventory - Current inventory
 * @param volatility - Current volatility
 * @param riskAversion - Risk aversion parameter (0-1)
 * @returns Quote skew parameters
 */
function calculateInventorySkew(inventory, volatility, riskAversion) {
    const currentPos = new decimal_js_1.default(inventory.currentPosition);
    const targetPos = new decimal_js_1.default(inventory.targetPosition);
    const maxPos = new decimal_js_1.default(inventory.maxPosition);
    // Calculate inventory deviation from target
    const inventoryDeviation = currentPos.sub(targetPos);
    const inventoryRatio = inventoryDeviation.div(maxPos);
    // Skew multiplier increases with inventory and risk aversion
    const skewMultiplier = inventoryRatio.mul(riskAversion).mul(volatility);
    // Positive inventory (long) -> widen ask, tighten bid
    // Negative inventory (short) -> widen bid, tighten ask
    const bidSkew = asBasisPoints(skewMultiplier.mul(-10)); // Negative skew widens bid when short
    const askSkew = asBasisPoints(skewMultiplier.mul(10)); // Positive skew widens ask when long
    return {
        inventoryPosition: inventory.currentPosition,
        targetPosition: inventory.targetPosition,
        maxPosition: inventory.maxPosition,
        currentVolatility: volatility,
        riskAversion,
        skewMultiplier,
        bidSkew,
        askSkew,
    };
}
// ============================================================================
// QUOTE OBLIGATION AND COMPLIANCE FUNCTIONS
// ============================================================================
/**
 * Check if quote obligations are being met
 * Monitors regulatory requirements for market makers
 *
 * @param obligation - Quote obligation parameters
 * @param currentQuote - Current active quote
 * @returns Updated obligation status
 */
function checkQuoteObligation(obligation, currentQuote) {
    const now = new Date();
    const violations = [...obligation.violations];
    // Check if quote is active
    if (!currentQuote || currentQuote.quoteState !== 'ACTIVE') {
        // Could be violation depending on total downtime
        return { ...obligation, obligationMet: false };
    }
    // Check spread width
    const spreadBps = new decimal_js_1.default(currentQuote.spreadBps);
    const maxSpread = new decimal_js_1.default(obligation.maxSpreadBps);
    if (spreadBps.gt(maxSpread)) {
        violations.push({
            violationId: `V-${Date.now()}`,
            timestamp: now,
            type: 'SPREAD_EXCEEDED',
            details: `Spread ${spreadBps} bps exceeds max ${maxSpread} bps`,
            severity: 'MINOR',
        });
    }
    // Check quote size
    const minSize = new decimal_js_1.default(obligation.minQuoteSize);
    const bidSize = new decimal_js_1.default(currentQuote.bidSize);
    const askSize = new decimal_js_1.default(currentQuote.askSize);
    if (bidSize.lt(minSize) || askSize.lt(minSize)) {
        violations.push({
            violationId: `V-${Date.now()}`,
            timestamp: now,
            type: 'SIZE_TOO_SMALL',
            details: `Quote size below minimum ${minSize}`,
            severity: 'MAJOR',
        });
    }
    // Check uptime requirement
    const requiredUptime = obligation.minQuoteTime;
    const currentUptime = obligation.currentUptime;
    const obligationMet = currentUptime >= requiredUptime && violations.length === 0;
    return {
        ...obligation,
        violations,
        obligationMet,
    };
}
/**
 * Calculate quote uptime percentage
 * Measures percentage of time quotes were active
 *
 * @param quotes - Historical quotes
 * @param startTime - Period start
 * @param endTime - Period end
 * @returns Uptime percentage
 */
function calculateQuoteUptime(quotes, startTime, endTime) {
    const totalTime = endTime.getTime() - startTime.getTime();
    let activeTime = 0;
    for (let i = 0; i < quotes.length; i++) {
        const quote = quotes[i];
        if (quote.quoteState !== 'ACTIVE')
            continue;
        const quoteStart = quote.timestamp.getTime();
        const quoteEnd = i < quotes.length - 1 ? quotes[i + 1].timestamp.getTime() : endTime.getTime();
        // Only count time within the period
        const effectiveStart = Math.max(quoteStart, startTime.getTime());
        const effectiveEnd = Math.min(quoteEnd, endTime.getTime());
        if (effectiveEnd > effectiveStart) {
            activeTime += effectiveEnd - effectiveStart;
        }
    }
    const uptimePercent = totalTime > 0 ? (activeTime / totalTime) * 100 : 0;
    return asPercentage(new decimal_js_1.default(uptimePercent));
}
/**
 * Validate quote against NBBO (National Best Bid and Offer)
 * Ensures quote is within acceptable distance from market
 *
 * @param quote - Market maker quote
 * @param nbbo - National best bid and offer
 * @param maxDeviation - Maximum allowed deviation in bps
 * @returns Validation result
 */
function validateQuoteAgainstNBBO(quote, nbbo, maxDeviation) {
    const quoteBid = new decimal_js_1.default(quote.bidPrice);
    const quoteAsk = new decimal_js_1.default(quote.askPrice);
    const nbboBid = new decimal_js_1.default(nbbo.bestBid);
    const nbboAsk = new decimal_js_1.default(nbbo.bestAsk);
    const maxDev = new decimal_js_1.default(maxDeviation);
    // Calculate mid price
    const nbboMid = nbboBid.add(nbboAsk).div(2);
    // Check bid deviation
    const bidDeviation = nbboMid.sub(quoteBid).div(nbboMid).mul(10000).abs();
    if (bidDeviation.gt(maxDev)) {
        return {
            valid: false,
            reason: `Bid ${quoteBid} is ${bidDeviation} bps from NBBO mid, max allowed ${maxDev} bps`,
        };
    }
    // Check ask deviation
    const askDeviation = quoteAsk.sub(nbboMid).div(nbboMid).mul(10000).abs();
    if (askDeviation.gt(maxDev)) {
        return {
            valid: false,
            reason: `Ask ${quoteAsk} is ${askDeviation} bps from NBBO mid, max allowed ${maxDev} bps`,
        };
    }
    // Ensure quote doesn't cross NBBO
    if (quoteBid.gt(nbboAsk)) {
        return { valid: false, reason: 'Bid crosses NBBO ask' };
    }
    if (quoteAsk.lt(nbboBid)) {
        return { valid: false, reason: 'Ask crosses NBBO bid' };
    }
    return { valid: true };
}
// ============================================================================
// INVENTORY MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Update market maker inventory after trade execution
 * Tracks position, P&L, and risk metrics
 *
 * @param inventory - Current inventory
 * @param trade - Executed trade
 * @param currentPrice - Current market price
 * @returns Updated inventory
 */
function updateInventoryPosition(inventory, trade, currentPrice) {
    const currentPos = new decimal_js_1.default(inventory.currentPosition);
    const avgCost = new decimal_js_1.default(inventory.averageCost);
    const tradeQty = new decimal_js_1.default(trade.quantity);
    const tradePrice = new decimal_js_1.default(trade.price);
    const marketPrice = new decimal_js_1.default(currentPrice);
    // Update position
    const newPosition = trade.side === 'BUY' ? currentPos.add(tradeQty) : currentPos.sub(tradeQty);
    // Update average cost using FIFO/weighted average
    let newAvgCost;
    if (newPosition.isZero()) {
        newAvgCost = new decimal_js_1.default(0);
    }
    else if ((trade.side === 'BUY' && currentPos.gte(0)) ||
        (trade.side === 'SELL' && currentPos.lte(0))) {
        // Adding to position
        const currentValue = currentPos.abs().mul(avgCost);
        const tradeValue = tradeQty.mul(tradePrice);
        const totalValue = currentValue.add(tradeValue);
        const totalQty = currentPos.abs().add(tradeQty);
        newAvgCost = totalValue.div(totalQty);
    }
    else {
        // Reducing position - keep same average cost
        newAvgCost = avgCost;
    }
    // Calculate inventory value and unrealized P&L
    const inventoryValue = asInventoryValue(newPosition.abs().mul(marketPrice));
    const costBasis = newPosition.abs().mul(newAvgCost);
    const unrealizedPnL = asPnL(newPosition.gte(0)
        ? inventoryValue.sub(costBasis)
        : costBasis.sub(inventoryValue));
    // Assess inventory risk
    const positionRatio = newPosition.abs().div(inventory.maxPosition);
    let inventoryRisk;
    if (positionRatio.lt(0.3))
        inventoryRisk = 'LOW';
    else if (positionRatio.lt(0.6))
        inventoryRisk = 'MEDIUM';
    else if (positionRatio.lt(0.9))
        inventoryRisk = 'HIGH';
    else
        inventoryRisk = 'CRITICAL';
    // Check if hedging is needed
    const needsHedging = positionRatio.gt(0.5);
    const recommendedHedgeSize = needsHedging
        ? asQuantity(newPosition.sub(inventory.targetPosition).abs())
        : asQuantity(0);
    return {
        ...inventory,
        currentPosition: asQuantity(newPosition),
        inventoryValue,
        averageCost: asPrice(newAvgCost),
        unrealizedPnL,
        delta: asDelta(newPosition), // Simplified: delta = position for spot
        inventoryRisk,
        needsHedging,
        recommendedHedgeSize,
    };
}
/**
 * Calculate inventory risk score
 * Measures risk exposure from current inventory
 *
 * @param inventory - Current inventory
 * @param volatility - Price volatility
 * @param liquidationTime - Expected time to liquidate (hours)
 * @returns Risk score (0-100)
 */
function calculateInventoryRisk(inventory, volatility, liquidationTime) {
    const position = new decimal_js_1.default(inventory.currentPosition);
    const maxPos = new decimal_js_1.default(inventory.maxPosition);
    const invValue = new decimal_js_1.default(inventory.inventoryValue);
    const vol = new decimal_js_1.default(volatility);
    // Position size component (0-40 points)
    const positionRatio = position.abs().div(maxPos);
    const positionScore = positionRatio.mul(40);
    // Volatility component (0-30 points)
    const volScore = vol.mul(300).clamp(0, 30);
    // Liquidation time component (0-30 points)
    const liquidationScore = new decimal_js_1.default(Math.min(liquidationTime / 10, 1)).mul(30);
    // Total risk score
    const riskScore = positionScore.add(volScore).add(liquidationScore);
    return riskScore.clamp(0, 100);
}
/**
 * Determine optimal hedge for inventory position
 * Calculates hedge instrument and size
 *
 * @param inventory - Current inventory
 * @param hedgeInstruments - Available hedging instruments
 * @returns Recommended hedge position
 */
function determineOptimalHedge(inventory, hedgeInstruments) {
    const currentDelta = new decimal_js_1.default(inventory.delta);
    const targetDelta = asDelta(0); // Target neutral delta
    if (currentDelta.abs().lt(0.1)) {
        return null; // Already hedged
    }
    // Find best hedge instrument (highest liquidity, lowest cost)
    let bestHedge = hedgeInstruments[0];
    let bestScore = new decimal_js_1.default(0);
    for (const instrument of hedgeInstruments) {
        const liquidity = new decimal_js_1.default(instrument.liquidity);
        const cost = new decimal_js_1.default(instrument.cost);
        // Score based on liquidity/cost ratio
        const score = liquidity.div(cost.add(1)); // Add 1 to avoid division by zero
        if (score.gt(bestScore)) {
            bestScore = score;
            bestHedge = instrument;
        }
    }
    // Calculate hedge quantity
    const hedgeDelta = new decimal_js_1.default(bestHedge.delta);
    const hedgeQty = currentDelta.div(hedgeDelta).abs();
    // Hedge efficiency
    const hedgeEfficiency = asPercentage(new decimal_js_1.default(1).sub(hedgeQty.mul(bestHedge.cost).div(inventory.inventoryValue).abs()));
    return {
        instrumentId: inventory.instrumentId,
        underlyingSymbol: inventory.symbol,
        currentDelta: inventory.delta,
        targetDelta,
        hedgeRequired: asQuantity(hedgeQty),
        hedgeInstrument: bestHedge.symbol,
        hedgeCost: bestHedge.cost,
        hedgeEfficiency,
    };
}
// ============================================================================
// P&L ATTRIBUTION FUNCTIONS
// ============================================================================
/**
 * Calculate market maker P&L attribution
 * Breaks down P&L by source (spread, inventory, rebates, etc.)
 *
 * @param trades - Executed trades
 * @param quotes - Historical quotes
 * @param rebates - Exchange rebates earned
 * @param hedgingCosts - Costs of delta hedging
 * @param period - Analysis period
 * @returns P&L attribution
 */
function calculateMarketMakerPnL(params) {
    const { marketMakerId, instrumentId, trades, quotes, rebates, hedgingCosts, period } = params;
    // Calculate spread capture
    let spreadCapture = new decimal_js_1.default(0);
    for (const trade of trades) {
        const quote = quotes.find((q) => q.quoteId === trade.quoteId);
        if (!quote)
            continue;
        const tradePrice = new decimal_js_1.default(trade.price);
        const midPrice = new decimal_js_1.default(quote.midPrice);
        if (trade.side === 'BUY') {
            // Bought on bid, capture = mid - bid
            spreadCapture = spreadCapture.add(midPrice.sub(tradePrice).mul(trade.quantity));
        }
        else {
            // Sold on ask, capture = ask - mid
            spreadCapture = spreadCapture.add(tradePrice.sub(midPrice).mul(trade.quantity));
        }
    }
    // Calculate inventory P&L (simplified - should track actual position changes)
    let inventoryPnL = new decimal_js_1.default(0);
    for (let i = 1; i < trades.length; i++) {
        const prevTrade = trades[i - 1];
        const currTrade = trades[i];
        if (prevTrade.side !== currTrade.side) {
            const priceDiff = prevTrade.side === 'BUY'
                ? currTrade.price.sub(prevTrade.price)
                : prevTrade.price.sub(currTrade.price);
            const qty = decimal_js_1.default.min(prevTrade.quantity, currTrade.quantity);
            inventoryPnL = inventoryPnL.add(priceDiff.mul(qty));
        }
    }
    // Adverse selection loss (estimate based on post-trade price movement)
    const adverseSelectionLoss = asPnL(spreadCapture.mul(-0.15)); // Estimate 15% of spread
    // Total P&L
    const totalPnL = asPnL(spreadCapture
        .add(inventoryPnL)
        .add(rebates)
        .add(adverseSelectionLoss)
        .sub(hedgingCosts));
    // Calculate return metrics (simplified)
    const totalVolume = trades.reduce((sum, t) => sum.add(t.quantity.mul(t.price)), new decimal_js_1.default(0));
    const returnOnCapital = asPercentage(totalPnL.div(totalVolume.add(1)).mul(100));
    return {
        marketMakerId,
        instrumentId,
        period,
        timestamp: new Date(),
        spreadCapture: asPnL(spreadCapture),
        inventoryPnL: asPnL(inventoryPnL),
        rebateIncome: rebates,
        adverseSelectionLoss,
        hedgingCosts,
        totalPnL,
        returnOnCapital,
        sharpeRatio: new decimal_js_1.default(0), // Would need returns series to calculate
    };
}
/**
 * Calculate spread capture efficiency
 * Measures how much of theoretical spread is actually captured
 *
 * @param theoreticalSpread - Quoted spread
 * @param actualSpreadCapture - Realized spread capture
 * @param volume - Trading volume
 * @returns Capture efficiency percentage
 */
function calculateSpreadCaptureEfficiency(theoreticalSpread, actualSpreadCapture, volume) {
    const theoretical = new decimal_js_1.default(theoreticalSpread);
    const actual = new decimal_js_1.default(actualSpreadCapture);
    const vol = new decimal_js_1.default(volume);
    const theoreticalTotal = theoretical.mul(vol);
    if (theoreticalTotal.isZero()) {
        return asPercentage(0);
    }
    const efficiency = actual.div(theoreticalTotal).mul(100);
    return asPercentage(efficiency.clamp(0, 100));
}
// ============================================================================
// QUOTE STUFFING PREVENTION
// ============================================================================
/**
 * Detect potential quote stuffing activity
 * Identifies excessive quote/cancel behavior
 *
 * @param quotes - Recent quotes
 * @param trades - Recent trades
 * @param windowSeconds - Analysis window in seconds
 * @returns Quote stuffing metrics
 */
function detectQuoteStuffing(instrumentId, quotes, trades, windowSeconds) {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowSeconds * 1000);
    // Filter to window
    const recentQuotes = quotes.filter((q) => q.timestamp >= windowStart);
    const recentTrades = trades.filter((t) => t.timestamp >= windowStart);
    // Calculate rates
    const quoteRate = recentQuotes.length / windowSeconds;
    const tradeRate = recentTrades.length / windowSeconds;
    // Count cancels (inactive quotes)
    const cancels = recentQuotes.filter((q) => q.quoteState === 'WITHDRAWN').length;
    const cancelRate = cancels / windowSeconds;
    // Quote to trade ratio
    const quoteToTradeRatio = new decimal_js_1.default(recentTrades.length > 0 ? recentQuotes.length / recentTrades.length : recentQuotes.length);
    // Calculate average quote lifetime
    let totalLifetime = 0;
    for (const quote of recentQuotes) {
        totalLifetime += quote.quoteDuration;
    }
    const averageQuoteLifetime = recentQuotes.length > 0 ? totalLifetime / recentQuotes.length : 0;
    // Stuffing score calculation
    let stuffingScore = new decimal_js_1.default(0);
    // High quote rate indicator
    if (quoteRate > 100)
        stuffingScore = stuffingScore.add(30);
    else if (quoteRate > 50)
        stuffingScore = stuffingScore.add(15);
    // High cancel rate indicator
    if (cancelRate > 50)
        stuffingScore = stuffingScore.add(30);
    else if (cancelRate > 25)
        stuffingScore = stuffingScore.add(15);
    // High quote-to-trade ratio indicator
    if (quoteToTradeRatio.gt(100))
        stuffingScore = stuffingScore.add(25);
    else if (quoteToTradeRatio.gt(50))
        stuffingScore = stuffingScore.add(12);
    // Short quote lifetime indicator
    if (averageQuoteLifetime < 100)
        stuffingScore = stuffingScore.add(15);
    else if (averageQuoteLifetime < 500)
        stuffingScore = stuffingScore.add(7);
    const isStuffing = stuffingScore.gte(50);
    let action;
    if (stuffingScore.gte(80))
        action = 'BLOCK';
    else if (stuffingScore.gte(60))
        action = 'THROTTLE';
    else if (stuffingScore.gte(40))
        action = 'WARN';
    else
        action = 'NONE';
    return {
        instrumentId,
        timestamp: now,
        quoteRate,
        cancelRate,
        quoteToTradeRatio,
        averageQuoteLifetime,
        isStuffing,
        stuffingScore,
        action,
    };
}
/**
 * Calculate optimal quote update frequency
 * Balances responsiveness with quote stuffing prevention
 *
 * @param marketVolatility - Current market volatility
 * @param competition - Number of competing market makers
 * @param inventoryRisk - Current inventory risk level
 * @returns Recommended update frequency in milliseconds
 */
function calculateOptimalQuoteFrequency(marketVolatility, competition, inventoryRisk) {
    const vol = new decimal_js_1.default(marketVolatility);
    // Base frequency: 1 second
    let frequencyMs = 1000;
    // Adjust for volatility (higher vol = more frequent updates)
    const volMultiplier = new decimal_js_1.default(1).sub(vol.mul(0.5)).clamp(0.5, 1.5);
    frequencyMs = frequencyMs * volMultiplier.toNumber();
    // Adjust for competition (more competition = more frequent)
    const compMultiplier = 1 / Math.max(1, Math.log10(competition + 1));
    frequencyMs = frequencyMs * compMultiplier;
    // Adjust for inventory risk (higher risk = more frequent rebalancing)
    const riskMultipliers = {
        LOW: 1.5,
        MEDIUM: 1.0,
        HIGH: 0.7,
        CRITICAL: 0.5,
    };
    frequencyMs = frequencyMs * riskMultipliers[inventoryRisk];
    // Minimum 100ms to prevent stuffing, maximum 10s
    return Math.max(100, Math.min(10000, frequencyMs));
}
// ============================================================================
// REBATE CALCULATION
// ============================================================================
/**
 * Calculate market maker rebates
 * Computes exchange rebates based on volume and quote quality
 *
 * @param structure - Rebate structure
 * @param volume - Trading volume
 * @param quoteUptime - Quote uptime percentage
 * @param averageSpread - Average quoted spread
 * @returns Rebate amount
 */
function calculateMarketMakerRebates(structure, volume, quoteUptime, averageSpread) {
    const vol = new decimal_js_1.default(volume);
    const uptime = new decimal_js_1.default(quoteUptime);
    const spread = new decimal_js_1.default(averageSpread);
    // Find applicable volume tier
    let tierMultiplier = new decimal_js_1.default(1);
    for (const tier of structure.volumeTiers) {
        const minVol = new decimal_js_1.default(tier.minVolume);
        const maxVol = new decimal_js_1.default(tier.maxVolume);
        if (vol.gte(minVol) && vol.lte(maxVol)) {
            tierMultiplier = tier.rebateMultiplier;
            break;
        }
    }
    // Base rebate
    const baseRebate = new decimal_js_1.default(structure.makerRebate);
    let totalRebate = baseRebate.mul(vol).mul(tierMultiplier);
    // Reduce rebate if uptime requirement not met
    const minUptime = new decimal_js_1.default(structure.minimumQuoteTime);
    if (uptime.lt(minUptime)) {
        const uptimePenalty = uptime.div(minUptime);
        totalRebate = totalRebate.mul(uptimePenalty);
    }
    // Reduce rebate if spread too wide
    const minSpread = new decimal_js_1.default(structure.minimumSpreadBps);
    if (spread.gt(minSpread.mul(2))) {
        // Spread more than 2x minimum
        totalRebate = totalRebate.mul(0.5);
    }
    return asRebateAmount(totalRebate);
}
/**
 * Estimate rebate income for quote
 * Projects rebate earnings based on expected fill rate
 *
 * @param quote - Market maker quote
 * @param rebatePerShare - Rebate per share
 * @param expectedFillRate - Expected fill rate (0-1)
 * @returns Estimated rebate income
 */
function estimateRebateIncome(quote, rebatePerShare, expectedFillRate) {
    const bidSize = new decimal_js_1.default(quote.bidSize);
    const askSize = new decimal_js_1.default(quote.askSize);
    const totalSize = bidSize.add(askSize);
    const rebate = new decimal_js_1.default(rebatePerShare);
    const fillRate = new decimal_js_1.default(expectedFillRate).div(100);
    const estimatedIncome = totalSize.mul(rebate).mul(fillRate);
    return asRebateAmount(estimatedIncome);
}
// ============================================================================
// ADVERSE SELECTION DETECTION
// ============================================================================
/**
 * Detect adverse selection in market making
 * Identifies when informed traders are picking off quotes
 *
 * @param trades - Recent trades
 * @param priceMovements - Post-trade price movements
 * @param windowSize - Number of trades to analyze
 * @returns Adverse selection metrics
 */
function detectAdverseSelection(instrumentId, trades, priceMovements, windowSize) {
    const recentTrades = trades.slice(-windowSize);
    // Calculate fill rate (simplified - would need quote data)
    const fillRate = asPercentage(100); // Placeholder
    // Calculate adverse movement
    let totalAdverseMovement = new decimal_js_1.default(0);
    let adverseCount = 0;
    for (const movement of priceMovements.slice(-windowSize)) {
        const trade = recentTrades.find((t) => t.timestamp.getTime() === movement.tradeTimestamp.getTime());
        if (!trade)
            continue;
        // Adverse movement: price moves against the market maker
        // If MM sold (trade.side = SELL from MM perspective), adverse = positive price movement
        // If MM bought (trade.side = BUY), adverse = negative price movement
        const isAdverse = (trade.side === 'SELL' && movement.priceChangeAfter.gt(0)) ||
            (trade.side === 'BUY' && movement.priceChangeAfter.lt(0));
        if (isAdverse) {
            totalAdverseMovement = totalAdverseMovement.add(movement.priceChangeAfter.abs());
            adverseCount++;
        }
    }
    const averageAdverseMovement = asPrice(recentTrades.length > 0 ? totalAdverseMovement.div(recentTrades.length) : 0);
    // Win rate: percentage of profitable trades
    const winRate = asPercentage(recentTrades.length > 0 ? ((recentTrades.length - adverseCount) / recentTrades.length) * 100 : 50);
    // Adverse selection ratio: higher means more adverse selection
    const adverseSelectionRatio = new decimal_js_1.default(adverseCount).div(recentTrades.length || 1);
    const isHighRisk = adverseSelectionRatio.gt(0.4); // >40% adverse fills
    let recommendedAction;
    if (adverseSelectionRatio.gt(0.6))
        recommendedAction = 'PAUSE_QUOTING';
    else if (adverseSelectionRatio.gt(0.5))
        recommendedAction = 'REDUCE_SIZE';
    else if (adverseSelectionRatio.gt(0.4))
        recommendedAction = 'WIDEN_SPREAD';
    else
        recommendedAction = 'CONTINUE';
    return {
        instrumentId,
        timestamp: new Date(),
        fillRate,
        adverseMovement: averageAdverseMovement,
        winRate,
        adverseSelectionRatio,
        isHighRisk,
        recommendedAction,
    };
}
/**
 * Calculate adverse selection cost
 * Estimates cost of being picked off by informed traders
 *
 * @param trades - Executed trades
 * @param postTradePrices - Prices after each trade
 * @param horizonMinutes - Time horizon for measuring adverse movement
 * @returns Adverse selection cost
 */
function calculateAdverseSelectionCost(trades, postTradePrices, horizonMinutes) {
    let totalCost = new decimal_js_1.default(0);
    for (let i = 0; i < trades.length && i < postTradePrices.length; i++) {
        const trade = trades[i];
        const postPrice = new decimal_js_1.default(postTradePrices[i]);
        const tradePrice = new decimal_js_1.default(trade.price);
        const quantity = new decimal_js_1.default(trade.quantity);
        // Cost is adverse price movement * quantity
        if (trade.side === 'BUY') {
            // Bought, adverse if price drops
            const priceDrop = tradePrice.sub(postPrice);
            if (priceDrop.gt(0)) {
                totalCost = totalCost.add(priceDrop.mul(quantity));
            }
        }
        else {
            // Sold, adverse if price rises
            const priceRise = postPrice.sub(tradePrice);
            if (priceRise.gt(0)) {
                totalCost = totalCost.add(priceRise.mul(quantity));
            }
        }
    }
    return asPnL(totalCost.neg()); // Negative because it's a cost
}
// ============================================================================
// AUTOMATED MARKET MAKING (AMM) ALGORITHMS
// ============================================================================
/**
 * Calculate constant product AMM price
 * Implements x * y = k curve (Uniswap-style)
 *
 * @param state - AMM pool state
 * @param tradeAmount - Amount to trade
 * @param tradeAsset - Asset being traded (1 or 2)
 * @returns Output amount and new state
 */
function calculateConstantProductAMM(state, tradeAmount, tradeAsset) {
    const reserve1 = new decimal_js_1.default(state.reserve1);
    const reserve2 = new decimal_js_1.default(state.reserve2);
    const amount = new decimal_js_1.default(tradeAmount);
    const fee = new decimal_js_1.default(state.feePercentage).div(100);
    // Calculate k = x * y
    const k = reserve1.mul(reserve2);
    // Apply fee
    const amountAfterFee = amount.mul(new decimal_js_1.default(1).sub(fee));
    let outputAmount;
    let newReserve1;
    let newReserve2;
    if (tradeAsset === 1) {
        // Trading asset 1 for asset 2
        newReserve1 = reserve1.add(amountAfterFee);
        newReserve2 = k.div(newReserve1);
        outputAmount = reserve2.sub(newReserve2);
    }
    else {
        // Trading asset 2 for asset 1
        newReserve2 = reserve2.add(amountAfterFee);
        newReserve1 = k.div(newReserve2);
        outputAmount = reserve1.sub(newReserve1);
    }
    const effectivePrice = asPrice(amount.div(outputAmount));
    const newState = {
        ...state,
        reserve1: asQuantity(newReserve1),
        reserve2: asQuantity(newReserve2),
        kValue: k,
        price: tradeAsset === 1 ? asPrice(newReserve2.div(newReserve1)) : asPrice(newReserve1.div(newReserve2)),
    };
    return {
        outputAmount: asQuantity(outputAmount),
        newState,
        effectivePrice,
    };
}
/**
 * Calculate constant sum AMM price
 * Implements x + y = k curve (stable swap)
 *
 * @param state - AMM pool state
 * @param tradeAmount - Amount to trade
 * @param tradeAsset - Asset being traded
 * @returns Output amount (1:1 swap minus fees)
 */
function calculateConstantSumAMM(state, tradeAmount, tradeAsset) {
    const reserve1 = new decimal_js_1.default(state.reserve1);
    const reserve2 = new decimal_js_1.default(state.reserve2);
    const amount = new decimal_js_1.default(tradeAmount);
    const fee = new decimal_js_1.default(state.feePercentage).div(100);
    // Apply fee
    const amountAfterFee = amount.mul(new decimal_js_1.default(1).sub(fee));
    // Constant sum: output = input (1:1) after fees
    const outputAmount = amountAfterFee;
    const newReserve1 = tradeAsset === 1 ? reserve1.add(amount) : reserve1.sub(outputAmount);
    const newReserve2 = tradeAsset === 2 ? reserve2.add(amount) : reserve2.sub(outputAmount);
    const newState = {
        ...state,
        reserve1: asQuantity(newReserve1),
        reserve2: asQuantity(newReserve2),
        price: asPrice(1), // Always 1:1 for constant sum
    };
    return {
        outputAmount: asQuantity(outputAmount),
        newState,
        effectivePrice: asPrice(1),
    };
}
/**
 * Calculate hybrid AMM price
 * Combines constant product and constant sum for optimal pricing
 *
 * @param state - AMM pool state
 * @param tradeAmount - Amount to trade
 * @param tradeAsset - Asset being traded
 * @returns Output amount and new state
 */
function calculateHybridAMM(state, tradeAmount, tradeAsset) {
    const reserve1 = new decimal_js_1.default(state.reserve1);
    const reserve2 = new decimal_js_1.default(state.reserve2);
    const amount = new decimal_js_1.default(tradeAmount);
    const fee = new decimal_js_1.default(state.feePercentage).div(100);
    // Hybrid curve: use constant sum near balance, constant product away from balance
    const balanceRatio = reserve1.div(reserve2);
    const weight = new decimal_js_1.default(1).sub(balanceRatio.sub(1).abs().clamp(0, 0.5).mul(2)); // 1 at balance, 0 at extremes
    // Calculate both outputs
    const constantSumResult = calculateConstantSumAMM(state, tradeAmount, tradeAsset);
    const constantProductResult = calculateConstantProductAMM(state, tradeAmount, tradeAsset);
    // Weighted average
    const outputAmount = asQuantity(new decimal_js_1.default(constantSumResult.outputAmount)
        .mul(weight)
        .add(new decimal_js_1.default(constantProductResult.outputAmount).mul(new decimal_js_1.default(1).sub(weight))));
    const newReserve1 = tradeAsset === 1
        ? reserve1.add(amount)
        : reserve1.sub(outputAmount);
    const newReserve2 = tradeAsset === 2
        ? reserve2.add(amount)
        : reserve2.sub(outputAmount);
    const effectivePrice = asPrice(amount.div(outputAmount));
    const newState = {
        ...state,
        reserve1: asQuantity(newReserve1),
        reserve2: asQuantity(newReserve2),
        price: asPrice(newReserve2.div(newReserve1)),
    };
    return {
        outputAmount,
        newState,
        effectivePrice,
    };
}
/**
 * Calculate AMM liquidity provider share
 * Computes LP tokens for liquidity provision
 *
 * @param state - Current AMM state
 * @param asset1Amount - Amount of asset 1 to deposit
 * @param asset2Amount - Amount of asset 2 to deposit
 * @returns LP tokens issued
 */
function calculateAMMLiquidityShare(state, asset1Amount, asset2Amount) {
    const reserve1 = new decimal_js_1.default(state.reserve1);
    const reserve2 = new decimal_js_1.default(state.reserve2);
    const supply = new decimal_js_1.default(state.liquidityTokenSupply);
    const amount1 = new decimal_js_1.default(asset1Amount);
    const amount2 = new decimal_js_1.default(asset2Amount);
    if (supply.isZero()) {
        // Initial liquidity: LP tokens = sqrt(x * y)
        return asQuantity(amount1.mul(amount2).sqrt());
    }
    // Proportional liquidity: LP tokens = min(amount1/reserve1, amount2/reserve2) * supply
    const ratio1 = amount1.div(reserve1);
    const ratio2 = amount2.div(reserve2);
    const minRatio = decimal_js_1.default.min(ratio1, ratio2);
    return asQuantity(minRatio.mul(supply));
}
// ============================================================================
// PERFORMANCE ANALYTICS
// ============================================================================
/**
 * Calculate comprehensive market maker performance metrics
 * Analyzes efficiency, profitability, and market presence
 *
 * @param params - Performance calculation parameters
 * @returns Performance metrics
 */
function calculateMarketMakerPerformance(params) {
    const { marketMakerId, instrumentId, period, quotes, trades, totalVolume, marketTotalVolume } = params;
    // Calculate metrics
    const totalQuotes = quotes.length;
    const activeTrades = trades.length;
    const fillRate = asPercentage(totalQuotes > 0 ? (activeTrades / totalQuotes) * 100 : 0);
    // Calculate average spread captured
    const activeQuotes = quotes.filter((q) => q.quoteState === 'ACTIVE');
    const totalSpread = activeQuotes.reduce((sum, q) => sum.add(q.spreadBps), new decimal_js_1.default(0));
    const averageSpreadCaptured = asBasisPoints(activeQuotes.length > 0 ? totalSpread.div(activeQuotes.length) : 0);
    // Market share
    const vol = new decimal_js_1.default(totalVolume);
    const marketVol = new decimal_js_1.default(marketTotalVolume);
    const marketShare = asPercentage(marketVol.gt(0) ? vol.div(marketVol).mul(100) : 0);
    // Uptime percentage
    const totalTime = quotes.length > 0
        ? quotes[quotes.length - 1].timestamp.getTime() - quotes[0].timestamp.getTime()
        : 0;
    const activeTime = activeQuotes.reduce((sum, q) => sum + q.quoteDuration, 0);
    const uptimePercentage = asPercentage(totalTime > 0 ? (activeTime / totalTime) * 100 : 0);
    // Profit per trade
    const totalPnL = trades.reduce((sum, t) => sum.add(t.pnl), new decimal_js_1.default(0));
    const profitPerTrade = asPnL(activeTrades > 0 ? totalPnL.div(activeTrades) : 0);
    // Risk-adjusted return (simplified Sharpe-like metric)
    const returns = trades.map((t) => new decimal_js_1.default(t.pnl));
    const avgReturn = returns.length > 0
        ? returns.reduce((sum, r) => sum.add(r), new decimal_js_1.default(0)).div(returns.length)
        : new decimal_js_1.default(0);
    const variance = returns.length > 1
        ? returns.reduce((sum, r) => sum.add(r.sub(avgReturn).pow(2)), new decimal_js_1.default(0)).div(returns.length - 1)
        : new decimal_js_1.default(1);
    const stdDev = variance.sqrt();
    const riskAdjustedReturn = stdDev.gt(0) ? avgReturn.div(stdDev) : new decimal_js_1.default(0);
    // Quoting efficiency
    const quotingEfficiency = asPercentage(vol.gt(0) ? totalPnL.div(vol).mul(100).abs() : 0);
    return {
        marketMakerId,
        period,
        instrumentId,
        totalQuotes,
        activeTrades,
        fillRate,
        averageSpreadCaptured,
        totalVolume,
        marketShare,
        uptimePercentage,
        profitPerTrade,
        riskAdjustedReturn,
        quotingEfficiency,
    };
}
/**
 * Analyze market maker quote quality
 * Measures spread tightness, size, and consistency
 *
 * @param quotes - Historical quotes
 * @returns Quality score (0-100)
 */
function analyzeQuoteQuality(quotes) {
    if (quotes.length === 0) {
        return {
            qualityScore: new decimal_js_1.default(0),
            spreadConsistency: new decimal_js_1.default(0),
            sizeConsistency: new decimal_js_1.default(0),
            uptimeScore: new decimal_js_1.default(0),
        };
    }
    // Calculate spread consistency (lower variance = better)
    const spreads = quotes.map((q) => new decimal_js_1.default(q.spreadBps));
    const avgSpread = spreads.reduce((sum, s) => sum.add(s), new decimal_js_1.default(0)).div(spreads.length);
    const spreadVariance = spreads
        .reduce((sum, s) => sum.add(s.sub(avgSpread).pow(2)), new decimal_js_1.default(0))
        .div(spreads.length);
    const spreadStdDev = spreadVariance.sqrt();
    const spreadConsistency = new decimal_js_1.default(100).sub(spreadStdDev.div(avgSpread.add(1)).mul(100)).clamp(0, 100);
    // Calculate size consistency
    const sizes = quotes.flatMap((q) => [
        new decimal_js_1.default(q.bidSize),
        new decimal_js_1.default(q.askSize),
    ]);
    const avgSize = sizes.reduce((sum, s) => sum.add(s), new decimal_js_1.default(0)).div(sizes.length);
    const sizeVariance = sizes
        .reduce((sum, s) => sum.add(s.sub(avgSize).pow(2)), new decimal_js_1.default(0))
        .div(sizes.length);
    const sizeStdDev = sizeVariance.sqrt();
    const sizeConsistency = new decimal_js_1.default(100).sub(sizeStdDev.div(avgSize.add(1)).mul(100)).clamp(0, 100);
    // Calculate uptime score
    const activeQuotes = quotes.filter((q) => q.quoteState === 'ACTIVE').length;
    const uptimeScore = new decimal_js_1.default(activeQuotes).div(quotes.length).mul(100);
    // Overall quality score
    const qualityScore = spreadConsistency
        .add(sizeConsistency)
        .add(uptimeScore)
        .div(3);
    return {
        qualityScore,
        spreadConsistency,
        sizeConsistency,
        uptimeScore,
    };
}
// ============================================================================
// MARKET IMPACT AND COMPETITION
// ============================================================================
/**
 * Estimate market impact of market maker quote
 * Predicts how quote will affect market price
 *
 * @param quote - Proposed quote
 * @param orderBook - Current order book
 * @param liquidityFactor - Market liquidity measure
 * @returns Market impact estimate
 */
function estimateMarketImpact(quote, orderBook, liquidityFactor) {
    const bidSize = new decimal_js_1.default(quote.bidSize);
    const askSize = new decimal_js_1.default(quote.askSize);
    const totalSize = bidSize.add(askSize);
    // Calculate order book depth
    const bidDepth = orderBook.bids
        .slice(0, 10)
        .reduce((sum, level) => sum.add(level.quantity), new decimal_js_1.default(0));
    const askDepth = orderBook.asks
        .slice(0, 10)
        .reduce((sum, level) => sum.add(level.quantity), new decimal_js_1.default(0));
    const totalDepth = bidDepth.add(askDepth);
    // Impact proportional to size relative to depth
    const sizeRatio = totalSize.div(totalDepth.add(1));
    const liquidityAdj = new decimal_js_1.default(1).div(liquidityFactor.add(1));
    // Estimate impact in basis points
    const estimatedImpact = asBasisPoints(sizeRatio.mul(liquidityAdj).mul(100));
    // Permanent vs temporary impact (60% temporary, 40% permanent)
    const temporaryImpact = asBasisPoints(estimatedImpact.mul(0.6));
    const permanentImpact = asBasisPoints(estimatedImpact.mul(0.4));
    // Confidence interval (±30%)
    const lowerBound = asBasisPoints(estimatedImpact.mul(0.7));
    const upperBound = asBasisPoints(estimatedImpact.mul(1.3));
    // Recommended slicing
    const recommendedSlicing = sizeRatio.gt(0.1) ? Math.ceil(sizeRatio.mul(20).toNumber()) : 1;
    return {
        orderSize: asQuantity(totalSize),
        side: 'BUY', // Simplified
        estimatedImpact,
        permanentImpact,
        temporaryImpact,
        confidenceInterval: [lowerBound, upperBound],
        recommendedSlicing,
    };
}
/**
 * Analyze competitor market makers
 * Identifies and evaluates competing market makers
 *
 * @param instrumentId - Instrument being analyzed
 * @param orderBook - Current order book with participant IDs
 * @param marketVolume - Total market volume
 * @returns Competitor analysis
 */
function analyzeCompetitors(instrumentId, orderBook, marketVolume, ownMarketShare) {
    const competitors = [];
    // Analyze order book to identify competitors
    const competitorBids = orderBook.bids.filter((b) => !b.isOwnQuote);
    const competitorAsks = orderBook.asks.filter((a) => !a.isOwnQuote);
    const totalCompetitorOrders = competitorBids.length + competitorAsks.length;
    // Simplified competitor metrics (in production, would track by firm ID)
    if (totalCompetitorOrders > 0) {
        const avgCompetitorSpread = new decimal_js_1.default(orderBook.bestCompetitorAsk)
            .sub(orderBook.bestCompetitorBid);
        const avgCompetitorSize = competitorBids
            .concat(competitorAsks)
            .reduce((sum, level) => sum.add(level.quantity), new decimal_js_1.default(0))
            .div(totalCompetitorOrders);
        competitors.push({
            competitorId: 'AGGREGATE_COMPETITORS',
            marketShare: asPercentage(new decimal_js_1.default(100).sub(ownMarketShare)),
            averageSpread: asBasisPoints(avgCompetitorSpread.div(orderBook.bestCompetitorBid).mul(10000)),
            averageSize: asQuantity(avgCompetitorSize),
            quoteUptime: asPercentage(85), // Estimate
            responseTime: 150, // Estimate in ms
            aggressiveness: 'MEDIUM',
        });
    }
    // Calculate market concentration (Herfindahl index)
    const ownShare = new decimal_js_1.default(ownMarketShare).div(100);
    const competitorShare = new decimal_js_1.default(1).sub(ownShare);
    const marketConcentration = ownShare.pow(2).add(competitorShare.pow(2));
    // Average competitor spread
    const averageCompetitorSpread = competitors.length > 0
        ? competitors[0].averageSpread
        : asBasisPoints(0);
    // Own ranking (simplified)
    const ownRanking = 1;
    // Market share opportunity
    const marketShareOpportunity = asPercentage(new decimal_js_1.default(100).sub(ownMarketShare).mul(0.3) // 30% of remaining share is realistic target
    );
    // Competitive advantage
    let competitiveAdvantage = 'NONE';
    if (competitors.length > 0) {
        const comp = competitors[0];
        const ownSpreadEstimate = new decimal_js_1.default(10); // Placeholder
        if (ownSpreadEstimate.lt(comp.averageSpread))
            competitiveAdvantage = 'PRICE';
    }
    return {
        instrumentId,
        timestamp: new Date(),
        competitors,
        marketConcentration,
        averageCompetitorSpread,
        ownRanking,
        marketShareOpportunity,
        competitiveAdvantage,
    };
}
/**
 * Calculate competitive positioning score
 * Measures market maker's competitive strength
 *
 * @param performance - Market maker performance
 * @param competitorAnalysis - Competitor analysis
 * @returns Competitive score (0-100)
 */
function calculateCompetitiveScore(performance, competitorAnalysis) {
    let score = new decimal_js_1.default(0);
    // Market share component (0-30 points)
    const marketShareScore = new decimal_js_1.default(performance.marketShare).mul(0.3).clamp(0, 30);
    score = score.add(marketShareScore);
    // Spread competitiveness (0-25 points)
    if (competitorAnalysis.competitors.length > 0) {
        const ownSpread = new decimal_js_1.default(performance.averageSpreadCaptured);
        const compSpread = new decimal_js_1.default(competitorAnalysis.averageCompetitorSpread);
        const spreadAdvantage = compSpread.sub(ownSpread).div(compSpread.add(1));
        const spreadScore = spreadAdvantage.mul(25).clamp(0, 25);
        score = score.add(spreadScore);
    }
    // Uptime component (0-20 points)
    const uptimeScore = new decimal_js_1.default(performance.uptimePercentage).mul(0.2).clamp(0, 20);
    score = score.add(uptimeScore);
    // Profitability component (0-25 points)
    const profitScore = new decimal_js_1.default(performance.quotingEfficiency).mul(0.25).clamp(0, 25);
    score = score.add(profitScore);
    return score.clamp(0, 100);
}
/**
 * Generate market making strategy recommendation
 * Suggests optimal strategy based on current conditions
 *
 * @param inventory - Current inventory
 * @param performance - Recent performance
 * @param adverseSelection - Adverse selection metrics
 * @param competition - Competitor analysis
 * @returns Strategy recommendation
 */
function recommendMarketMakingStrategy(inventory, performance, adverseSelection, competition) {
    let strategyType = 'ADAPTIVE';
    let targetSpreadBps = asBasisPoints(10);
    let quoteSize = asQuantity(100);
    let maxInventory = inventory.maxPosition;
    let hedgingEnabled = false;
    let riskAdjustment = 'MEDIUM';
    // Assess inventory risk
    const inventoryRatio = new decimal_js_1.default(inventory.currentPosition)
        .abs()
        .div(inventory.maxPosition);
    if (inventoryRatio.gt(0.7)) {
        // High inventory - be passive, widen spreads, hedge
        strategyType = 'PASSIVE';
        targetSpreadBps = asBasisPoints(20);
        hedgingEnabled = true;
        riskAdjustment = 'HIGH';
    }
    else if (adverseSelection.isHighRisk) {
        // High adverse selection - widen spreads, reduce size
        strategyType = 'PASSIVE';
        targetSpreadBps = asBasisPoints(15);
        quoteSize = asQuantity(50);
        riskAdjustment = 'HIGH';
    }
    else if (new decimal_js_1.default(competition.marketShareOpportunity).gt(20)) {
        // Market share opportunity - be aggressive
        strategyType = 'AGGRESSIVE';
        targetSpreadBps = asBasisPoints(8);
        quoteSize = asQuantity(200);
        riskAdjustment = 'LOW';
    }
    else if (new decimal_js_1.default(performance.fillRate).lt(20)) {
        // Low fill rate - tighten spreads
        strategyType = 'AGGRESSIVE';
        targetSpreadBps = asBasisPoints(7);
    }
    else {
        // Normal conditions - adaptive
        strategyType = 'ADAPTIVE';
        targetSpreadBps = asBasisPoints(10);
        quoteSize = asQuantity(100);
        riskAdjustment = 'MEDIUM';
    }
    return {
        strategyId: `STRAT-${Date.now()}`,
        type: strategyType,
        instrumentId: inventory.instrumentId,
        targetSpreadBps,
        quoteSize,
        maxInventory,
        hedgingEnabled,
        riskAdjustment,
        rebalanceFrequency: 5, // seconds
    };
}
// ============================================================================
// ORDER BOOK MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Calculate order book depth at price level
 * Measures available liquidity at specific price
 *
 * @param orderBook - Market maker order book
 * @param targetPrice - Price level to measure
 * @param side - Bid or ask side
 * @returns Cumulative depth at price level
 */
function calculateDepthAtPrice(orderBook, targetPrice, side) {
    const levels = side === 'BID' ? orderBook.bids : orderBook.asks;
    const target = new decimal_js_1.default(targetPrice);
    let cumulativeDepth = new decimal_js_1.default(0);
    for (const level of levels) {
        const levelPrice = new decimal_js_1.default(level.price);
        if (side === 'BID' && levelPrice.gte(target)) {
            cumulativeDepth = cumulativeDepth.add(level.quantity);
        }
        else if (side === 'ASK' && levelPrice.lte(target)) {
            cumulativeDepth = cumulativeDepth.add(level.quantity);
        }
    }
    return asQuantity(cumulativeDepth);
}
/**
 * Optimize quote placement in order book
 * Determines best price levels to maximize fill probability
 *
 * @param orderBook - Current order book
 * @param desiredSpread - Target spread in bps
 * @param aggression - Aggression level (0-1)
 * @returns Optimal bid and ask prices
 */
function optimizeQuotePlacement(orderBook, desiredSpread, aggression) {
    const bestBid = new decimal_js_1.default(orderBook.bestCompetitorBid);
    const bestAsk = new decimal_js_1.default(orderBook.bestCompetitorAsk);
    const midPrice = bestBid.add(bestAsk).div(2);
    const spreadDecimal = new decimal_js_1.default(desiredSpread);
    const halfSpread = midPrice.mul(spreadDecimal).div(20000);
    // Aggression: 0 = passive (wider), 1 = aggressive (tighter)
    const aggressionFactor = new decimal_js_1.default(aggression).clamp(0, 1);
    // Adjust placement based on aggression
    const bidImprovement = halfSpread.mul(aggressionFactor).mul(0.5);
    const askImprovement = halfSpread.mul(aggressionFactor).mul(0.5);
    const optimalBid = midPrice.sub(halfSpread).add(bidImprovement);
    const optimalAsk = midPrice.add(halfSpread).sub(askImprovement);
    // Ensure we don't cross the book
    const finalBid = decimal_js_1.default.min(optimalBid, bestAsk.mul(0.9999));
    const finalAsk = decimal_js_1.default.max(optimalAsk, bestBid.mul(1.0001));
    return {
        bidPrice: asPrice(finalBid),
        askPrice: asPrice(finalAsk),
    };
}
/**
 * Calculate order book pressure
 * Measures buying vs selling pressure from order book
 *
 * @param orderBook - Market maker order book
 * @param levels - Number of levels to analyze
 * @returns Pressure score (-1 = sell pressure, +1 = buy pressure)
 */
function calculateOrderBookPressure(orderBook, levels = 5) {
    const bidLevels = orderBook.bids.slice(0, levels);
    const askLevels = orderBook.asks.slice(0, levels);
    const bidVolume = bidLevels.reduce((sum, level) => sum.add(level.quantity), new decimal_js_1.default(0));
    const askVolume = askLevels.reduce((sum, level) => sum.add(level.quantity), new decimal_js_1.default(0));
    const totalVolume = bidVolume.add(askVolume);
    if (totalVolume.isZero()) {
        return new decimal_js_1.default(0);
    }
    return bidVolume.sub(askVolume).div(totalVolume);
}
/**
 * Detect order book toxicity
 * Identifies abnormal order book conditions
 *
 * @param orderBook - Current order book
 * @param historicalBooks - Historical order books for comparison
 * @returns Toxicity score (0-100, higher = more toxic)
 */
function detectOrderBookToxicity(orderBook, historicalBooks) {
    let toxicityScore = new decimal_js_1.default(0);
    // Check for very wide spread
    const spread = new decimal_js_1.default(orderBook.bestCompetitorAsk).sub(orderBook.bestCompetitorBid);
    const midPrice = new decimal_js_1.default(orderBook.bestCompetitorBid)
        .add(orderBook.bestCompetitorAsk)
        .div(2);
    const spreadBps = spread.div(midPrice).mul(10000);
    if (spreadBps.gt(100))
        toxicityScore = toxicityScore.add(30);
    else if (spreadBps.gt(50))
        toxicityScore = toxicityScore.add(15);
    // Check for shallow depth
    const totalDepth = new decimal_js_1.default(orderBook.marketDepth);
    if (historicalBooks.length > 0) {
        const avgHistoricalDepth = historicalBooks.reduce((sum, book) => sum.add(book.marketDepth), new decimal_js_1.default(0)).div(historicalBooks.length);
        if (totalDepth.lt(avgHistoricalDepth.mul(0.3)))
            toxicityScore = toxicityScore.add(40);
        else if (totalDepth.lt(avgHistoricalDepth.mul(0.5)))
            toxicityScore = toxicityScore.add(20);
    }
    // Check for order book imbalance
    const pressure = calculateOrderBookPressure(orderBook, 10);
    if (pressure.abs().gt(0.7))
        toxicityScore = toxicityScore.add(30);
    else if (pressure.abs().gt(0.5))
        toxicityScore = toxicityScore.add(15);
    return toxicityScore.clamp(0, 100);
}
/**
 * Calculate optimal quote size based on order book
 * Sizes quotes to match market depth
 *
 * @param orderBook - Current order book
 * @param targetPercentage - Target percentage of top-of-book
 * @param maxSize - Maximum allowed size
 * @returns Optimal quote sizes
 */
function calculateOptimalQuoteSize(orderBook, targetPercentage, maxSize) {
    const targetPct = new decimal_js_1.default(targetPercentage).div(100);
    const max = new decimal_js_1.default(maxSize);
    // Get top of book sizes
    const topBidSize = orderBook.bids.length > 0 ? new decimal_js_1.default(orderBook.bids[0].quantity) : new decimal_js_1.default(100);
    const topAskSize = orderBook.asks.length > 0 ? new decimal_js_1.default(orderBook.asks[0].quantity) : new decimal_js_1.default(100);
    // Calculate optimal sizes
    let bidSize = topBidSize.mul(targetPct);
    let askSize = topAskSize.mul(targetPct);
    // Apply maximum
    bidSize = decimal_js_1.default.min(bidSize, max);
    askSize = decimal_js_1.default.min(askSize, max);
    // Ensure minimum viable size
    bidSize = decimal_js_1.default.max(bidSize, 1);
    askSize = decimal_js_1.default.max(askSize, 1);
    return {
        bidSize: asQuantity(bidSize),
        askSize: asQuantity(askSize),
    };
}
// ============================================================================
// DELTA HEDGING FUNCTIONS
// ============================================================================
/**
 * Calculate delta exposure from market making positions
 * Computes net delta across all positions
 *
 * @param positions - Array of market maker inventories
 * @returns Total delta exposure
 */
function calculateTotalDeltaExposure(positions) {
    const totalDelta = positions.reduce((sum, pos) => sum.add(pos.delta), new decimal_js_1.default(0));
    return asDelta(totalDelta);
}
/**
 * Generate delta hedging plan
 * Creates execution plan for hedging delta exposure
 *
 * @param currentDelta - Current delta exposure
 * @param targetDelta - Target delta (usually 0)
 * @param hedgeInstrument - Instrument to use for hedging
 * @param maxSliceSize - Maximum size per trade
 * @returns Hedging execution plan
 */
function generateDeltaHedgingPlan(currentDelta, targetDelta, hedgeInstrument, maxSliceSize) {
    const deltaDiff = new decimal_js_1.default(currentDelta).sub(targetDelta);
    const instrumentDelta = new decimal_js_1.default(hedgeInstrument.delta);
    if (deltaDiff.abs().lt(0.01)) {
        return []; // Already hedged
    }
    const totalHedgeSize = deltaDiff.div(instrumentDelta).abs();
    const maxSlice = new decimal_js_1.default(maxSliceSize);
    const minSize = new decimal_js_1.default(hedgeInstrument.minSize);
    const plan = [];
    let remainingSize = totalHedgeSize;
    const side = deltaDiff.gt(0) ? 'SELL' : 'BUY';
    while (remainingSize.gte(minSize)) {
        const sliceSize = decimal_js_1.default.min(remainingSize, maxSlice);
        plan.push({
            size: asQuantity(sliceSize),
            side,
        });
        remainingSize = remainingSize.sub(sliceSize);
    }
    return plan;
}
/**
 * Calculate hedging efficiency
 * Measures cost-effectiveness of hedge
 *
 * @param hedgeCost - Total cost of hedging
 * @param riskReduction - Amount of risk reduced
 * @param timeHorizon - Time horizon in hours
 * @returns Efficiency ratio
 */
function calculateHedgingEfficiency(hedgeCost, riskReduction, timeHorizon) {
    const cost = new decimal_js_1.default(hedgeCost).abs();
    const risk = new decimal_js_1.default(riskReduction);
    if (cost.isZero()) {
        return new decimal_js_1.default(Infinity);
    }
    // Efficiency = risk reduction / (cost * sqrt(time))
    const timeAdjustment = new decimal_js_1.default(timeHorizon).sqrt();
    const efficiency = risk.div(cost.mul(timeAdjustment));
    return efficiency;
}
/**
 * Determine dynamic hedge ratio
 * Calculates optimal hedge ratio based on market conditions
 *
 * @param volatility - Current volatility
 * @param correlation - Correlation between asset and hedge
 * @param riskTolerance - Risk tolerance (0-1)
 * @returns Optimal hedge ratio
 */
function determineDynamicHedgeRatio(volatility, correlation, riskTolerance) {
    const vol = new decimal_js_1.default(volatility);
    const corr = new decimal_js_1.default(correlation).clamp(-1, 1);
    const risk = new decimal_js_1.default(riskTolerance).clamp(0, 1);
    // Base hedge ratio from correlation
    let hedgeRatio = corr.abs();
    // Adjust for volatility (higher vol = higher hedge)
    const volAdjustment = new decimal_js_1.default(1).add(vol.mul(0.5));
    hedgeRatio = hedgeRatio.mul(volAdjustment);
    // Adjust for risk tolerance (lower tolerance = higher hedge)
    const riskAdjustment = new decimal_js_1.default(1).sub(risk.mul(0.3));
    hedgeRatio = hedgeRatio.mul(riskAdjustment);
    return hedgeRatio.clamp(0, 1);
}
// ============================================================================
// SPREAD OPTIMIZATION FUNCTIONS
// ============================================================================
/**
 * Calculate volatility-adjusted spread
 * Widens spread during high volatility periods
 *
 * @param baseSpread - Base spread in bps
 * @param currentVolatility - Current volatility
 * @param targetVolatility - Target/normal volatility
 * @returns Adjusted spread
 */
function calculateVolatilityAdjustedSpread(baseSpread, currentVolatility, targetVolatility) {
    const base = new decimal_js_1.default(baseSpread);
    const currentVol = new decimal_js_1.default(currentVolatility);
    const targetVol = new decimal_js_1.default(targetVolatility);
    if (targetVol.isZero()) {
        return baseSpread;
    }
    const volRatio = currentVol.div(targetVol);
    const adjustedSpread = base.mul(volRatio);
    return asBasisPoints(adjustedSpread);
}
/**
 * Calculate time-of-day spread adjustment
 * Adjusts spread based on intraday patterns
 *
 * @param baseSpread - Base spread
 * @param currentTime - Current time
 * @param sessionType - Trading session type
 * @returns Adjusted spread
 */
function calculateTimeOfDaySpreadAdjustment(baseSpread, currentTime, sessionType) {
    const base = new decimal_js_1.default(baseSpread);
    const adjustments = {
        PRE_MARKET: new decimal_js_1.default(1.5),
        OPEN: new decimal_js_1.default(1.3),
        MID_DAY: new decimal_js_1.default(1.0),
        CLOSE: new decimal_js_1.default(1.4),
        POST_MARKET: new decimal_js_1.default(1.6),
    };
    const multiplier = adjustments[sessionType];
    return asBasisPoints(base.mul(multiplier));
}
/**
 * Calculate spread based on order flow toxicity
 * Widens spread when detecting toxic order flow
 *
 * @param baseSpread - Base spread
 * @param toxicityScore - Order flow toxicity (0-100)
 * @returns Adjusted spread
 */
function calculateToxicityAdjustedSpread(baseSpread, toxicityScore) {
    const base = new decimal_js_1.default(baseSpread);
    const toxicity = new decimal_js_1.default(toxicityScore).div(100); // Normalize to 0-1
    // Widen spread linearly with toxicity, up to 3x at max toxicity
    const multiplier = new decimal_js_1.default(1).add(toxicity.mul(2));
    return asBasisPoints(base.mul(multiplier));
}
/**
 * Optimize spread for profit maximization
 * Finds spread that maximizes expected profit
 *
 * @param fillProbabilities - Fill probabilities at different spreads
 * @param spreadLevels - Spread levels in bps
 * @param expectedVolume - Expected trading volume
 * @returns Optimal spread
 */
function optimizeSpreadForProfit(fillProbabilities, spreadLevels, expectedVolume) {
    if (fillProbabilities.length !== spreadLevels.length || fillProbabilities.length === 0) {
        throw new Error('Fill probabilities and spread levels must have same length');
    }
    const volume = new decimal_js_1.default(expectedVolume);
    let maxProfit = new decimal_js_1.default(-Infinity);
    let optimalSpread = spreadLevels[0];
    for (let i = 0; i < spreadLevels.length; i++) {
        const spread = new decimal_js_1.default(spreadLevels[i]);
        const fillProb = new decimal_js_1.default(fillProbabilities[i]);
        // Expected profit = spread * fill probability * volume
        const expectedProfit = spread.mul(fillProb).mul(volume);
        if (expectedProfit.gt(maxProfit)) {
            maxProfit = expectedProfit;
            optimalSpread = spreadLevels[i];
        }
    }
    return optimalSpread;
}
// ============================================================================
// PERFORMANCE MONITORING FUNCTIONS
// ============================================================================
/**
 * Calculate quote response time
 * Measures how quickly quotes are updated after market changes
 *
 * @param marketUpdates - Market update timestamps
 * @param quoteUpdates - Quote update timestamps
 * @returns Average response time in milliseconds
 */
function calculateQuoteResponseTime(marketUpdates, quoteUpdates) {
    if (marketUpdates.length === 0 || quoteUpdates.length === 0) {
        return 0;
    }
    let totalResponseTime = 0;
    let count = 0;
    for (const marketUpdate of marketUpdates) {
        // Find next quote update after this market update
        const nextQuote = quoteUpdates.find((q) => q.getTime() > marketUpdate.getTime());
        if (nextQuote) {
            totalResponseTime += nextQuote.getTime() - marketUpdate.getTime();
            count++;
        }
    }
    return count > 0 ? totalResponseTime / count : 0;
}
/**
 * Calculate realized volatility from quote changes
 * Measures actual volatility of quoted prices
 *
 * @param quotes - Historical quotes
 * @returns Realized volatility (annualized)
 */
function calculateRealizedVolatility(quotes) {
    if (quotes.length < 2) {
        return new decimal_js_1.default(0);
    }
    const returns = [];
    for (let i = 1; i < quotes.length; i++) {
        const prevMid = new decimal_js_1.default(quotes[i - 1].midPrice);
        const currMid = new decimal_js_1.default(quotes[i].midPrice);
        if (prevMid.gt(0)) {
            const logReturn = currMid.div(prevMid).ln();
            returns.push(logReturn);
        }
    }
    if (returns.length === 0) {
        return new decimal_js_1.default(0);
    }
    // Calculate variance
    const mean = returns.reduce((sum, r) => sum.add(r), new decimal_js_1.default(0)).div(returns.length);
    const variance = returns
        .reduce((sum, r) => sum.add(r.sub(mean).pow(2)), new decimal_js_1.default(0))
        .div(returns.length);
    // Annualize (assuming quotes are per second, scale to annual)
    const volatility = variance.sqrt().mul(Math.sqrt(252 * 6.5 * 3600)); // Trading days * hours * seconds
    return volatility;
}
/**
 * Calculate market maker win rate
 * Percentage of profitable trades
 *
 * @param trades - Trade history with P&L
 * @returns Win rate percentage
 */
function calculateWinRate(trades) {
    if (trades.length === 0) {
        return asPercentage(0);
    }
    const winningTrades = trades.filter((t) => new decimal_js_1.default(t.pnl).gt(0)).length;
    const winRate = (winningTrades / trades.length) * 100;
    return asPercentage(winRate);
}
/**
 * Calculate average holding period
 * Average time between opening and closing positions
 *
 * @param positions - Position history with timestamps
 * @returns Average holding period in hours
 */
function calculateAverageHoldingPeriod(positions) {
    if (positions.length === 0) {
        return 0;
    }
    const totalHoldingTime = positions.reduce((sum, pos) => {
        return sum + (pos.closeTime.getTime() - pos.openTime.getTime());
    }, 0);
    const avgMilliseconds = totalHoldingTime / positions.length;
    return avgMilliseconds / (1000 * 60 * 60); // Convert to hours
}
/**
 * Calculate quote stability score
 * Measures how stable quotes remain over time
 *
 * @param quotes - Historical quotes
 * @param windowMinutes - Time window to analyze
 * @returns Stability score (0-100)
 */
function calculateQuoteStability(quotes, windowMinutes) {
    if (quotes.length < 2) {
        return new decimal_js_1.default(100);
    }
    const windowMs = windowMinutes * 60 * 1000;
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);
    const recentQuotes = quotes.filter((q) => q.timestamp >= windowStart);
    if (recentQuotes.length < 2) {
        return new decimal_js_1.default(100);
    }
    // Calculate coefficient of variation for spread
    const spreads = recentQuotes.map((q) => new decimal_js_1.default(q.spreadBps));
    const avgSpread = spreads.reduce((sum, s) => sum.add(s), new decimal_js_1.default(0)).div(spreads.length);
    const variance = spreads
        .reduce((sum, s) => sum.add(s.sub(avgSpread).pow(2)), new decimal_js_1.default(0))
        .div(spreads.length);
    const stdDev = variance.sqrt();
    const coefficientOfVariation = avgSpread.gt(0) ? stdDev.div(avgSpread) : new decimal_js_1.default(0);
    // Stability score: 100 * (1 - CV), clamped to 0-100
    const stabilityScore = new decimal_js_1.default(100).mul(new decimal_js_1.default(1).sub(coefficientOfVariation));
    return stabilityScore.clamp(0, 100);
}
// ============================================================================
// RISK MONITORING FUNCTIONS
// ============================================================================
/**
 * Calculate Value at Risk (VaR) for market making inventory
 * Estimates potential loss at given confidence level
 *
 * @param inventory - Current inventory
 * @param volatility - Price volatility
 * @param confidenceLevel - Confidence level (e.g., 0.95)
 * @param timeHorizon - Time horizon in days
 * @returns VaR amount
 */
function calculateMarketMakingVaR(inventory, volatility, confidenceLevel, timeHorizon) {
    const position = new decimal_js_1.default(inventory.currentPosition);
    const price = new decimal_js_1.default(inventory.inventoryValue).div(position.abs().add(1));
    const vol = new decimal_js_1.default(volatility);
    const confidence = new decimal_js_1.default(confidenceLevel).clamp(0, 0.9999);
    // Z-score for confidence level (approximate)
    const zScore = confidence.gte(0.99)
        ? new decimal_js_1.default(2.33)
        : confidence.gte(0.95)
            ? new decimal_js_1.default(1.65)
            : new decimal_js_1.default(1.28);
    // VaR = position * price * volatility * z-score * sqrt(time)
    const timeAdjustment = new decimal_js_1.default(timeHorizon).sqrt();
    const varAmount = position.abs().mul(price).mul(vol).mul(zScore).mul(timeAdjustment);
    return asPnL(varAmount.neg());
}
/**
 * Detect inventory limit breach
 * Checks if inventory exceeds risk limits
 *
 * @param inventory - Current inventory
 * @param limits - Inventory limits
 * @returns Breach status and severity
 */
function detectInventoryLimitBreach(inventory, limits) {
    const position = new decimal_js_1.default(inventory.currentPosition).abs();
    const warning = new decimal_js_1.default(limits.warning);
    const critical = new decimal_js_1.default(limits.critical);
    if (position.gte(critical)) {
        return {
            breached: true,
            severity: 'CRITICAL',
            excessAmount: asQuantity(position.sub(critical)),
        };
    }
    else if (position.gte(warning)) {
        return {
            breached: true,
            severity: 'WARNING',
            excessAmount: asQuantity(position.sub(warning)),
        };
    }
    return {
        breached: false,
        severity: 'NONE',
        excessAmount: asQuantity(0),
    };
}
/**
 * Calculate concentration risk
 * Measures risk from concentrated positions
 *
 * @param inventories - All market making inventories
 * @param totalCapital - Total capital allocated
 * @returns Concentration score (0-100)
 */
function calculateConcentrationRisk(inventories, totalCapital) {
    if (inventories.length === 0) {
        return new decimal_js_1.default(0);
    }
    const capital = new decimal_js_1.default(totalCapital);
    const positions = inventories.map((inv) => new decimal_js_1.default(inv.inventoryValue));
    // Calculate Herfindahl index (sum of squared shares)
    const shares = positions.map((pos) => pos.div(capital));
    const herfindahl = shares.reduce((sum, share) => sum.add(share.pow(2)), new decimal_js_1.default(0));
    // Convert to 0-100 scale (1/n = perfectly diversified, 1 = fully concentrated)
    const maxConcentration = new decimal_js_1.default(1);
    const minConcentration = new decimal_js_1.default(1).div(inventories.length);
    const range = maxConcentration.sub(minConcentration);
    if (range.isZero()) {
        return new decimal_js_1.default(0);
    }
    const concentrationScore = herfindahl.sub(minConcentration).div(range).mul(100);
    return concentrationScore.clamp(0, 100);
}
/**
 * Calculate stress test scenario
 * Simulates inventory P&L under extreme market conditions
 *
 * @param inventory - Current inventory
 * @param priceShockPercent - Price shock percentage
 * @param volatilityShockMultiplier - Volatility increase multiplier
 * @returns Stressed P&L
 */
function calculateStressTestScenario(inventory, priceShockPercent, volatilityShockMultiplier) {
    const position = new decimal_js_1.default(inventory.currentPosition);
    const currentValue = new decimal_js_1.default(inventory.inventoryValue);
    const shock = new decimal_js_1.default(priceShockPercent).div(100);
    // Apply price shock (negative shock for long position hurts, positive helps)
    const priceMultiplier = new decimal_js_1.default(1).add(shock.mul(position.gt(0) ? -1 : 1));
    const stressedValue = currentValue.mul(priceMultiplier);
    const stressedPnL = asPnL(stressedValue.sub(currentValue));
    const capitalImpact = asPercentage(currentValue.gt(0) ? stressedPnL.div(currentValue).mul(100).abs() : new decimal_js_1.default(0));
    return {
        stressedPnL,
        stressedInventoryValue: asInventoryValue(stressedValue),
        capitalImpact,
    };
}
//# sourceMappingURL=market-making-kit.js.map