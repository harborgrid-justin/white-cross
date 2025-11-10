"use strict";
/**
 * LOC: FXTRDK001
 * File: /reuse/trading/fx-currency-trading-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - FX trading services
 *   - Risk management systems
 *   - Trading execution platforms
 *   - Market analytics dashboards
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFXSpotMid = calculateFXSpotMid;
exports.calculateFXSpotBidAsk = calculateFXSpotBidAsk;
exports.calculateFXSpotLiquidityAdjusted = calculateFXSpotLiquidityAdjusted;
exports.calculateFXSpotVWAP = calculateFXSpotVWAP;
exports.calculateFXSpotTWAP = calculateFXSpotTWAP;
exports.calculateFXSpotBestExecution = calculateFXSpotBestExecution;
exports.calculateFXForwardPoints = calculateFXForwardPoints;
exports.calculateFXOutrightForward = calculateFXOutrightForward;
exports.calculateFXImpliedYield = calculateFXImpliedYield;
exports.calculateFXForwardPremiumDiscount = calculateFXForwardPremiumDiscount;
exports.calculateFXForwardSettlement = calculateFXForwardSettlement;
exports.calculateFXForwardBreakeven = calculateFXForwardBreakeven;
exports.calculateCrossCurrencyRate = calculateCrossCurrencyRate;
exports.detectTriangularArbitrage = detectTriangularArbitrage;
exports.calculateSyntheticPair = calculateSyntheticPair;
exports.calculateCrossCurrencyBasis = calculateCrossCurrencyBasis;
exports.optimizeCrossCurrencyPath = optimizeCrossCurrencyPath;
exports.calculateFXSwapPoints = calculateFXSwapPoints;
exports.calculateFXSwapNearFarLegs = calculateFXSwapNearFarLegs;
exports.calculateFXTomNext = calculateFXTomNext;
exports.calculateFXSpotNext = calculateFXSpotNext;
exports.calculateFXSwapImpliedRate = calculateFXSwapImpliedRate;
exports.convertCurrencyPair = convertCurrencyPair;
exports.normalizeCurrencyPair = normalizeCurrencyPair;
exports.validateCurrencyPair = validateCurrencyPair;
exports.getCurrencyPairPrecision = getCurrencyPairPrecision;
exports.formatCurrencyAmount = formatCurrencyAmount;
exports.calculateFXVanillaOptionPrice = calculateFXVanillaOptionPrice;
exports.calculateFXDigitalOptionPrice = calculateFXDigitalOptionPrice;
exports.calculateFXOptionDelta = calculateFXOptionDelta;
exports.calculateFXOptionGamma = calculateFXOptionGamma;
exports.calculateFXOptionVega = calculateFXOptionVega;
exports.calculateFXOptionTheta = calculateFXOptionTheta;
exports.calculateFXOptionRho = calculateFXOptionRho;
exports.calculateFXOptionImpliedVolatility = calculateFXOptionImpliedVolatility;
exports.calculateFXImpliedVolatility = calculateFXImpliedVolatility;
exports.constructFXVolatilitySurface = constructFXVolatilitySurface;
exports.interpolateFXVolatilitySurface = interpolateFXVolatilitySurface;
exports.calculateFXVolatilitySmile = calculateFXVolatilitySmile;
exports.calculateFXATMVolatility = calculateFXATMVolatility;
exports.calculateFXRiskReversalButterfly = calculateFXRiskReversalButterfly;
exports.calculateCurrencyCorrelationMatrix = calculateCurrencyCorrelationMatrix;
exports.calculateRollingCurrencyCorrelation = calculateRollingCurrencyCorrelation;
exports.detectCorrelationRegimeChange = detectCorrelationRegimeChange;
exports.calculateCurrencyBeta = calculateCurrencyBeta;
exports.calculateDeltaHedge = calculateDeltaHedge;
exports.calculatePortfolioHedge = calculatePortfolioHedge;
exports.calculateOptimalHedgeRatio = calculateOptimalHedgeRatio;
exports.calculateHedgeEffectiveness = calculateHedgeEffectiveness;
exports.rebalanceDeltaHedge = rebalanceDeltaHedge;
exports.constructCurrencyBasket = constructCurrencyBasket;
exports.rebalanceCurrencyBasket = rebalanceCurrencyBasket;
exports.calculateBasketPerformanceAttribution = calculateBasketPerformanceAttribution;
exports.calculateBasketVolatility = calculateBasketVolatility;
exports.calculateFXCarryReturn = calculateFXCarryReturn;
exports.calculateFXFundingCost = calculateFXFundingCost;
exports.calculateFXRollYield = calculateFXRollYield;
exports.rankCurrencyCarry = rankCurrencyCarry;
exports.aggregateFXRatesMultiSource = aggregateFXRatesMultiSource;
exports.calculateFXRateVWAP = calculateFXRateVWAP;
exports.calculateFXRateTWAP = calculateFXRateTWAP;
exports.selectBestFXExecution = selectBestFXExecution;
// ============================================================================
// FX SPOT PRICING FUNCTIONS (6 functions)
// ============================================================================
/**
 * Calculate FX spot mid-market rate
 *
 * @param bid - Bid price
 * @param ask - Ask price
 * @returns Mid-market rate
 *
 * @example
 * ```typescript
 * const mid = calculateFXSpotMid(1.1850, 1.1852);
 * // Returns: 1.1851
 * ```
 */
function calculateFXSpotMid(bid, ask) {
    if (bid <= 0 || ask <= 0) {
        throw new Error('Bid and ask prices must be positive');
    }
    if (bid > ask) {
        throw new Error('Bid price cannot exceed ask price');
    }
    return (bid + ask) / 2;
}
/**
 * Calculate FX spot bid/ask spread in pips
 *
 * @param bid - Bid price
 * @param ask - Ask price
 * @param pipSize - Pip size for the currency pair
 * @returns Spread in pips
 *
 * @example
 * ```typescript
 * const spread = calculateFXSpotBidAsk(1.1850, 1.1852, 0.0001);
 * // Returns: 2 (pips)
 * ```
 */
function calculateFXSpotBidAsk(bid, ask, pipSize) {
    if (bid <= 0 || ask <= 0) {
        throw new Error('Bid and ask prices must be positive');
    }
    if (bid > ask) {
        throw new Error('Bid price cannot exceed ask price');
    }
    if (pipSize <= 0) {
        throw new Error('Pip size must be positive');
    }
    return (ask - bid) / pipSize;
}
/**
 * Calculate liquidity-adjusted FX spot price
 * Adjusts price based on order size relative to available liquidity
 *
 * @param quote - FX spot quote
 * @param orderSize - Order size in base currency
 * @param liquidityImpactFactor - Liquidity impact factor (typically 0.001-0.01)
 * @returns Adjusted price considering liquidity impact
 *
 * @example
 * ```typescript
 * const quote: FXSpotQuote = { mid: 1.1851, liquidityDepth: 1000000, ... };
 * const adjustedPrice = calculateFXSpotLiquidityAdjusted(quote, 500000, 0.005);
 * // Returns price adjusted for 50% of available liquidity
 * ```
 */
function calculateFXSpotLiquidityAdjusted(quote, orderSize, liquidityImpactFactor = 0.005) {
    if (orderSize <= 0) {
        throw new Error('Order size must be positive');
    }
    if (!quote.liquidityDepth || quote.liquidityDepth <= 0) {
        return quote.mid; // No liquidity data, return mid price
    }
    const liquidityRatio = orderSize / quote.liquidityDepth;
    const impact = liquidityImpactFactor * liquidityRatio;
    // Price moves against the trader for large orders
    return quote.mid * (1 + impact);
}
/**
 * Calculate volume-weighted average price (VWAP) from multiple quotes
 *
 * @param quotes - Array of FX spot quotes with volumes
 * @param volumes - Corresponding volumes for each quote
 * @returns VWAP
 *
 * @example
 * ```typescript
 * const quotes = [
 *   { mid: 1.1850, ... },
 *   { mid: 1.1852, ... },
 *   { mid: 1.1851, ... }
 * ];
 * const volumes = [1000000, 2000000, 1500000];
 * const vwap = calculateFXSpotVWAP(quotes, volumes);
 * ```
 */
function calculateFXSpotVWAP(quotes, volumes) {
    if (quotes.length === 0) {
        throw new Error('Quotes array cannot be empty');
    }
    if (quotes.length !== volumes.length) {
        throw new Error('Quotes and volumes arrays must have same length');
    }
    let totalValue = 0;
    let totalVolume = 0;
    for (let i = 0; i < quotes.length; i++) {
        if (volumes[i] < 0) {
            throw new Error('Volumes must be non-negative');
        }
        totalValue += quotes[i].mid * volumes[i];
        totalVolume += volumes[i];
    }
    if (totalVolume === 0) {
        throw new Error('Total volume cannot be zero');
    }
    return totalValue / totalVolume;
}
/**
 * Calculate time-weighted average price (TWAP) from time series of quotes
 *
 * @param quotes - Array of FX spot quotes with timestamps
 * @param startTime - Start of TWAP period
 * @param endTime - End of TWAP period
 * @returns TWAP
 *
 * @example
 * ```typescript
 * const quotes = [
 *   { mid: 1.1850, timestamp: new Date('2025-01-01T09:00:00Z'), ... },
 *   { mid: 1.1852, timestamp: new Date('2025-01-01T10:00:00Z'), ... }
 * ];
 * const twap = calculateFXSpotTWAP(quotes, quotes[0].timestamp, quotes[1].timestamp);
 * ```
 */
function calculateFXSpotTWAP(quotes, startTime, endTime) {
    if (quotes.length === 0) {
        throw new Error('Quotes array cannot be empty');
    }
    if (startTime >= endTime) {
        throw new Error('Start time must be before end time');
    }
    // Filter quotes within time range
    const filteredQuotes = quotes
        .filter(q => q.timestamp >= startTime && q.timestamp <= endTime)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    if (filteredQuotes.length === 0) {
        throw new Error('No quotes found within specified time range');
    }
    if (filteredQuotes.length === 1) {
        return filteredQuotes[0].mid;
    }
    let weightedSum = 0;
    const totalPeriod = endTime.getTime() - startTime.getTime();
    for (let i = 0; i < filteredQuotes.length - 1; i++) {
        const duration = filteredQuotes[i + 1].timestamp.getTime() - filteredQuotes[i].timestamp.getTime();
        weightedSum += filteredQuotes[i].mid * duration;
    }
    // Add last quote weighted to end time
    const lastDuration = endTime.getTime() - filteredQuotes[filteredQuotes.length - 1].timestamp.getTime();
    weightedSum += filteredQuotes[filteredQuotes.length - 1].mid * lastDuration;
    return weightedSum / totalPeriod;
}
/**
 * Select best FX execution price from multiple sources
 * Considers price, spread, liquidity, and source reliability
 *
 * @param sources - Array of rate sources
 * @param side - Trade side ('buy' or 'sell')
 * @param size - Order size in base currency
 * @returns Best execution source
 *
 * @example
 * ```typescript
 * const sources: RateSource[] = [
 *   { name: 'Bank A', quote: {...}, reliability: 0.95, latency: 50 },
 *   { name: 'Bank B', quote: {...}, reliability: 0.98, latency: 30 }
 * ];
 * const best = calculateFXSpotBestExecution(sources, 'buy', 1000000);
 * ```
 */
function calculateFXSpotBestExecution(sources, side, size) {
    if (sources.length === 0) {
        throw new Error('Sources array cannot be empty');
    }
    if (size <= 0) {
        throw new Error('Size must be positive');
    }
    let bestSource = null;
    let bestScore = -Infinity;
    for (const source of sources) {
        const price = side === 'buy' ? source.quote.ask : source.quote.bid;
        const spread = source.quote.spread;
        const liquidity = source.quote.liquidityDepth || size;
        // Calculate execution score (higher is better for sell, lower is better for buy)
        // Factor in price, spread, reliability, and latency
        const liquidityScore = Math.min(size / liquidity, 1);
        const reliabilityScore = source.reliability;
        const latencyScore = 1 / (1 + source.latency / 100);
        let score = reliabilityScore * 0.4 + liquidityScore * 0.3 + latencyScore * 0.3;
        // Adjust for price (for buy, prefer lower ask; for sell, prefer higher bid)
        if (side === 'buy') {
            score = score / price; // Lower price = higher score
        }
        else {
            score = score * price; // Higher price = higher score
        }
        if (score > bestScore) {
            bestScore = score;
            bestSource = source;
        }
    }
    if (!bestSource) {
        throw new Error('No suitable execution source found');
    }
    return bestSource;
}
// ============================================================================
// FX FORWARD PRICING FUNCTIONS (6 functions)
// ============================================================================
/**
 * Calculate FX forward points using interest rate parity
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency interest rate (annualized)
 * @param quoteRate - Quote currency interest rate (annualized)
 * @param tenor - Tenor in days
 * @returns Forward points
 *
 * @example
 * ```typescript
 * const forwardPoints = calculateFXForwardPoints(1.1850, 0.05, 0.02, 90);
 * // Returns forward points for 90-day EUR/USD forward
 * ```
 */
function calculateFXForwardPoints(spotRate, baseRate, quoteRate, tenor) {
    if (spotRate <= 0) {
        throw new Error('Spot rate must be positive');
    }
    if (tenor <= 0) {
        throw new Error('Tenor must be positive');
    }
    const yearFraction = tenor / 365;
    const forwardRate = spotRate * ((1 + quoteRate * yearFraction) / (1 + baseRate * yearFraction));
    return forwardRate - spotRate;
}
/**
 * Calculate outright FX forward rate
 *
 * @param spotRate - Current spot rate
 * @param forwardPoints - Forward points
 * @returns Outright forward rate
 *
 * @example
 * ```typescript
 * const outrightForward = calculateFXOutrightForward(1.1850, 0.0035);
 * // Returns: 1.1885
 * ```
 */
function calculateFXOutrightForward(spotRate, forwardPoints) {
    if (spotRate <= 0) {
        throw new Error('Spot rate must be positive');
    }
    return spotRate + forwardPoints;
}
/**
 * Calculate implied yield from FX forward rate
 *
 * @param spotRate - Current spot rate
 * @param forwardRate - Forward rate
 * @param tenor - Tenor in days
 * @param knownRate - Known interest rate (either base or quote)
 * @param isBaseRate - True if knownRate is base currency rate, false if quote currency rate
 * @returns Implied interest rate (annualized)
 *
 * @example
 * ```typescript
 * const impliedRate = calculateFXImpliedYield(1.1850, 1.1885, 90, 0.02, false);
 * // Returns implied base currency rate given quote currency rate
 * ```
 */
function calculateFXImpliedYield(spotRate, forwardRate, tenor, knownRate, isBaseRate) {
    if (spotRate <= 0 || forwardRate <= 0) {
        throw new Error('Spot and forward rates must be positive');
    }
    if (tenor <= 0) {
        throw new Error('Tenor must be positive');
    }
    const yearFraction = tenor / 365;
    if (isBaseRate) {
        // Known base rate, solve for quote rate
        // forwardRate = spotRate * ((1 + quoteRate * T) / (1 + baseRate * T))
        // quoteRate = ((forwardRate / spotRate) * (1 + baseRate * T) - 1) / T
        return ((forwardRate / spotRate) * (1 + knownRate * yearFraction) - 1) / yearFraction;
    }
    else {
        // Known quote rate, solve for base rate
        // baseRate = ((1 + quoteRate * T) / (forwardRate / spotRate) - 1) / T
        return ((1 + knownRate * yearFraction) / (forwardRate / spotRate) - 1) / yearFraction;
    }
}
/**
 * Calculate FX forward premium or discount
 *
 * @param spotRate - Current spot rate
 * @param forwardRate - Forward rate
 * @returns Premium (positive) or discount (negative) as percentage
 *
 * @example
 * ```typescript
 * const premium = calculateFXForwardPremiumDiscount(1.1850, 1.1885);
 * // Returns: 0.295% (premium)
 * ```
 */
function calculateFXForwardPremiumDiscount(spotRate, forwardRate) {
    if (spotRate <= 0 || forwardRate <= 0) {
        throw new Error('Spot and forward rates must be positive');
    }
    return ((forwardRate - spotRate) / spotRate) * 100;
}
/**
 * Calculate FX forward settlement amount
 *
 * @param notional - Notional amount in base currency
 * @param forwardRate - Forward rate
 * @param side - Trade side ('buy' or 'sell')
 * @returns Settlement amount in quote currency
 *
 * @example
 * ```typescript
 * const settlement = calculateFXForwardSettlement(1000000, 1.1885, 'buy');
 * // Returns: 1,188,500 (buying 1M EUR at 1.1885 costs 1,188,500 USD)
 * ```
 */
function calculateFXForwardSettlement(notional, forwardRate, side) {
    if (notional <= 0) {
        throw new Error('Notional must be positive');
    }
    if (forwardRate <= 0) {
        throw new Error('Forward rate must be positive');
    }
    const settlement = notional * forwardRate;
    return side === 'buy' ? settlement : -settlement;
}
/**
 * Calculate FX forward breakeven rate
 * Rate at which profit/loss is zero considering spot movement
 *
 * @param forwardRate - Forward rate at inception
 * @param currentSpot - Current spot rate
 * @param tenor - Remaining tenor in days
 * @param baseRate - Base currency interest rate
 * @param quoteRate - Quote currency interest rate
 * @returns Breakeven spot rate at maturity
 *
 * @example
 * ```typescript
 * const breakeven = calculateFXForwardBreakeven(1.1885, 1.1850, 45, 0.05, 0.02);
 * ```
 */
function calculateFXForwardBreakeven(forwardRate, currentSpot, tenor, baseRate, quoteRate) {
    if (forwardRate <= 0 || currentSpot <= 0) {
        throw new Error('Forward and spot rates must be positive');
    }
    if (tenor < 0) {
        throw new Error('Tenor cannot be negative');
    }
    if (tenor === 0) {
        return forwardRate;
    }
    // Breakeven is the forward rate at inception
    // At maturity, if spot = forward rate, P&L = 0
    return forwardRate;
}
// ============================================================================
// CROSS-CURRENCY CALCULATIONS (5 functions)
// ============================================================================
/**
 * Calculate cross-currency rate from two currency pairs
 *
 * @param rate1 - First currency pair rate
 * @param rate2 - Second currency pair rate
 * @param pair1 - First currency pair
 * @param pair2 - Second currency pair
 * @param targetPair - Target cross currency pair
 * @returns Cross rate
 *
 * @example
 * ```typescript
 * // Calculate EUR/GBP from EUR/USD and GBP/USD
 * const eurGbp = calculateCrossCurrencyRate(
 *   1.1850, // EUR/USD
 *   1.2700, // GBP/USD
 *   { base: 'EUR', quote: 'USD', ... },
 *   { base: 'GBP', quote: 'USD', ... },
 *   { base: 'EUR', quote: 'GBP', ... }
 * );
 * // Returns: EUR/GBP = EUR/USD / GBP/USD = 0.9331
 * ```
 */
function calculateCrossCurrencyRate(rate1, rate2, pair1, pair2, targetPair) {
    if (rate1 <= 0 || rate2 <= 0) {
        throw new Error('Rates must be positive');
    }
    // Find common currency and calculate cross rate
    // Example: EUR/USD = 1.1850, GBP/USD = 1.2700
    // EUR/GBP = (EUR/USD) / (GBP/USD) = 1.1850 / 1.2700
    if (pair1.quote === pair2.quote) {
        // Both pairs quote in same currency (e.g., EUR/USD and GBP/USD)
        if (targetPair.base === pair1.base && targetPair.quote === pair2.base) {
            return rate1 / rate2;
        }
        else if (targetPair.base === pair2.base && targetPair.quote === pair1.base) {
            return rate2 / rate1;
        }
    }
    else if (pair1.quote === pair2.base) {
        // First pair's quote is second pair's base (e.g., EUR/USD and USD/JPY)
        if (targetPair.base === pair1.base && targetPair.quote === pair2.quote) {
            return rate1 * rate2;
        }
    }
    else if (pair1.base === pair2.base) {
        // Both pairs have same base (e.g., USD/EUR and USD/GBP)
        if (targetPair.base === pair1.quote && targetPair.quote === pair2.quote) {
            return rate2 / rate1;
        }
        else if (targetPair.base === pair2.quote && targetPair.quote === pair1.quote) {
            return rate1 / rate2;
        }
    }
    throw new Error('Cannot calculate cross rate from provided pairs');
}
/**
 * Detect triangular arbitrage opportunity
 *
 * @param rate1 - First pair rate
 * @param rate2 - Second pair rate
 * @param rate3 - Third pair rate (cross rate)
 * @param threshold - Minimum profit threshold (in percentage)
 * @returns Arbitrage opportunity details or null
 *
 * @example
 * ```typescript
 * const arb = detectTriangularArbitrage(
 *   1.1850, // EUR/USD
 *   1.2700, // GBP/USD
 *   0.9300, // EUR/GBP (market)
 *   0.1 // 0.1% threshold
 * );
 * // If synthetic EUR/GBP (0.9331) differs from market (0.9300), returns arbitrage opportunity
 * ```
 */
function detectTriangularArbitrage(rate1, rate2, rate3Market, threshold = 0.1) {
    if (rate1 <= 0 || rate2 <= 0 || rate3Market <= 0) {
        throw new Error('Rates must be positive');
    }
    // Calculate synthetic cross rate
    const rate3Synthetic = rate1 / rate2;
    // Calculate arbitrage profit percentage
    const profit = ((rate3Synthetic - rate3Market) / rate3Market) * 100;
    const exists = Math.abs(profit) > threshold;
    return {
        exists,
        profit,
        syntheticRate: rate3Synthetic
    };
}
/**
 * Calculate synthetic currency pair rate
 *
 * @param throughCurrency - Intermediate currency
 * @param baseCurrency - Base currency
 * @param quoteCurrency - Quote currency
 * @param rates - Map of available currency pair rates
 * @returns Synthetic rate
 *
 * @example
 * ```typescript
 * const rates = new Map([
 *   ['EUR/USD', 1.1850],
 *   ['USD/JPY', 110.50]
 * ]);
 * const eurJpy = calculateSyntheticPair('USD', 'EUR', 'JPY', rates);
 * // Returns: EUR/JPY = EUR/USD * USD/JPY = 130.9425
 * ```
 */
function calculateSyntheticPair(throughCurrency, baseCurrency, quoteCurrency, rates) {
    const pair1Key = `${baseCurrency}/${throughCurrency}`;
    const pair2Key = `${throughCurrency}/${quoteCurrency}`;
    const pair1InvKey = `${throughCurrency}/${baseCurrency}`;
    const pair2InvKey = `${quoteCurrency}/${throughCurrency}`;
    let rate1;
    let rate2;
    // Find rates (either direct or inverted)
    if (rates.has(pair1Key)) {
        rate1 = rates.get(pair1Key);
    }
    else if (rates.has(pair1InvKey)) {
        rate1 = 1 / rates.get(pair1InvKey);
    }
    if (rates.has(pair2Key)) {
        rate2 = rates.get(pair2Key);
    }
    else if (rates.has(pair2InvKey)) {
        rate2 = 1 / rates.get(pair2InvKey);
    }
    if (!rate1 || !rate2) {
        throw new Error('Required rates not found for synthetic pair calculation');
    }
    return rate1 * rate2;
}
/**
 * Calculate cross-currency basis spread
 * Difference between direct market rate and synthetic rate via currency swap
 *
 * @param directRate - Direct market cross rate
 * @param syntheticRate - Synthetic rate via swap
 * @returns Basis spread in basis points
 *
 * @example
 * ```typescript
 * const basis = calculateCrossCurrencyBasis(0.9300, 0.9331);
 * // Returns basis spread in bps
 * ```
 */
function calculateCrossCurrencyBasis(directRate, syntheticRate) {
    if (directRate <= 0 || syntheticRate <= 0) {
        throw new Error('Rates must be positive');
    }
    return ((syntheticRate - directRate) / directRate) * 10000; // Convert to basis points
}
/**
 * Optimize cross-currency conversion path
 * Find the most cost-effective path through multiple currency pairs
 *
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param rates - Available currency pair rates with spreads
 * @param amount - Amount to convert
 * @returns Optimal conversion path and final amount
 *
 * @example
 * ```typescript
 * const rates = new Map([
 *   ['EUR/USD', { mid: 1.1850, spread: 0.0002 }],
 *   ['USD/JPY', { mid: 110.50, spread: 0.02 }],
 *   ['EUR/JPY', { mid: 130.50, spread: 0.05 }]
 * ]);
 * const path = optimizeCrossCurrencyPath('EUR', 'JPY', rates, 1000000);
 * // Returns optimal path: either direct EUR/JPY or via EUR/USD/JPY
 * ```
 */
function optimizeCrossCurrencyPath(fromCurrency, toCurrency, rates, amount) {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    // For simplicity, compare direct vs. USD path (most common scenario)
    const directKey = `${fromCurrency}/${toCurrency}`;
    const directInvKey = `${toCurrency}/${fromCurrency}`;
    const viaUSDKey1 = `${fromCurrency}/USD`;
    const viaUSDKey2 = `USD/${toCurrency}`;
    const viaUSDInv1 = `USD/${fromCurrency}`;
    const viaUSDInv2 = `${toCurrency}/USD`;
    let directRate;
    let usdRate1;
    let usdRate2;
    // Check direct rate
    if (rates.has(directKey)) {
        directRate = rates.get(directKey);
    }
    else if (rates.has(directInvKey)) {
        const invRate = rates.get(directInvKey);
        directRate = { mid: 1 / invRate.mid, spread: invRate.spread / (invRate.mid * invRate.mid) };
    }
    // Check USD path
    if (rates.has(viaUSDKey1)) {
        usdRate1 = rates.get(viaUSDKey1);
    }
    else if (rates.has(viaUSDInv1)) {
        const invRate = rates.get(viaUSDInv1);
        usdRate1 = { mid: 1 / invRate.mid, spread: invRate.spread / (invRate.mid * invRate.mid) };
    }
    if (rates.has(viaUSDKey2)) {
        usdRate2 = rates.get(viaUSDKey2);
    }
    else if (rates.has(viaUSDInv2)) {
        const invRate = rates.get(viaUSDInv2);
        usdRate2 = { mid: 1 / invRate.mid, spread: invRate.spread / (invRate.mid * invRate.mid) };
    }
    const results = [];
    // Calculate direct path
    if (directRate) {
        const effectiveRate = directRate.mid - directRate.spread / 2; // Account for spread
        const finalAmount = amount * effectiveRate;
        const totalCost = amount * directRate.spread;
        results.push({
            path: [fromCurrency, toCurrency],
            finalAmount,
            totalCost
        });
    }
    // Calculate USD path
    if (usdRate1 && usdRate2) {
        const effectiveRate1 = usdRate1.mid - usdRate1.spread / 2;
        const effectiveRate2 = usdRate2.mid - usdRate2.spread / 2;
        const usdAmount = amount * effectiveRate1;
        const finalAmount = usdAmount * effectiveRate2;
        const totalCost = amount * usdRate1.spread + usdAmount * usdRate2.spread;
        results.push({
            path: [fromCurrency, 'USD', toCurrency],
            finalAmount,
            totalCost
        });
    }
    if (results.length === 0) {
        throw new Error('No conversion path found');
    }
    // Return path with highest final amount (lowest total cost)
    return results.reduce((best, current) => current.finalAmount > best.finalAmount ? current : best);
}
// ============================================================================
// FX SWAP PRICING FUNCTIONS (5 functions)
// ============================================================================
/**
 * Calculate FX swap points
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency interest rate
 * @param quoteRate - Quote currency interest rate
 * @param nearTenor - Near leg tenor in days
 * @param farTenor - Far leg tenor in days
 * @returns Swap points
 *
 * @example
 * ```typescript
 * const swapPoints = calculateFXSwapPoints(1.1850, 0.05, 0.02, 1, 7);
 * // Returns swap points for 1-week swap (tom-next to 1-week)
 * ```
 */
function calculateFXSwapPoints(spotRate, baseRate, quoteRate, nearTenor, farTenor) {
    if (spotRate <= 0) {
        throw new Error('Spot rate must be positive');
    }
    if (nearTenor < 0 || farTenor <= nearTenor) {
        throw new Error('Invalid tenor: far tenor must be greater than near tenor');
    }
    const nearPoints = calculateFXForwardPoints(spotRate, baseRate, quoteRate, nearTenor);
    const farPoints = calculateFXForwardPoints(spotRate, baseRate, quoteRate, farTenor);
    return farPoints - nearPoints;
}
/**
 * Calculate FX swap near and far leg rates
 *
 * @param spotRate - Current spot rate
 * @param swapPoints - Swap points
 * @param nearForwardPoints - Near leg forward points
 * @returns Near and far leg rates
 *
 * @example
 * ```typescript
 * const legs = calculateFXSwapNearFarLegs(1.1850, 0.0012, 0.0003);
 * // Returns: { nearLeg: 1.1853, farLeg: 1.1865 }
 * ```
 */
function calculateFXSwapNearFarLegs(spotRate, swapPoints, nearForwardPoints) {
    if (spotRate <= 0) {
        throw new Error('Spot rate must be positive');
    }
    const nearLeg = spotRate + nearForwardPoints;
    const farLeg = nearLeg + swapPoints;
    return { nearLeg, farLeg };
}
/**
 * Calculate tom-next swap rate
 * Swap from tomorrow to spot date (typically 2 business days)
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency overnight rate
 * @param quoteRate - Quote currency overnight rate
 * @returns Tom-next swap points
 *
 * @example
 * ```typescript
 * const tomNext = calculateFXTomNext(1.1850, 0.05, 0.02);
 * ```
 */
function calculateFXTomNext(spotRate, baseRate, quoteRate) {
    if (spotRate <= 0) {
        throw new Error('Spot rate must be positive');
    }
    // Tom-next is typically 1 day swap
    return calculateFXSwapPoints(spotRate, baseRate, quoteRate, 0, 1);
}
/**
 * Calculate spot-next swap rate
 * Swap from spot date to next business day
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency overnight rate
 * @param quoteRate - Quote currency overnight rate
 * @returns Spot-next swap points
 *
 * @example
 * ```typescript
 * const spotNext = calculateFXSpotNext(1.1850, 0.05, 0.02);
 * ```
 */
function calculateFXSpotNext(spotRate, baseRate, quoteRate) {
    if (spotRate <= 0) {
        throw new Error('Spot rate must be positive');
    }
    // Spot-next: from spot (T+2) to T+3
    return calculateFXSwapPoints(spotRate, baseRate, quoteRate, 2, 3);
}
/**
 * Calculate implied rate from FX swap
 *
 * @param spotRate - Current spot rate
 * @param swapPoints - Swap points
 * @param tenor - Swap tenor in days
 * @param knownRate - Known interest rate (either base or quote)
 * @param isBaseRate - True if knownRate is base currency rate
 * @returns Implied interest rate
 *
 * @example
 * ```typescript
 * const impliedRate = calculateFXSwapImpliedRate(1.1850, 0.0012, 7, 0.02, false);
 * // Returns implied base rate given quote rate and swap points
 * ```
 */
function calculateFXSwapImpliedRate(spotRate, swapPoints, tenor, knownRate, isBaseRate) {
    if (spotRate <= 0) {
        throw new Error('Spot rate must be positive');
    }
    if (tenor <= 0) {
        throw new Error('Tenor must be positive');
    }
    const forwardRate = spotRate + swapPoints;
    return calculateFXImpliedYield(spotRate, forwardRate, tenor, knownRate, isBaseRate);
}
// ============================================================================
// CURRENCY PAIR CONVERSION FUNCTIONS (5 functions)
// ============================================================================
/**
 * Convert amount between currency pairs
 *
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param rate - Exchange rate
 * @param isInverted - True if rate is inverted (e.g., using USD/EUR for EUR/USD conversion)
 * @returns Converted amount
 *
 * @example
 * ```typescript
 * const usdAmount = convertCurrencyPair(1000000, 'EUR', 'USD', 1.1850, false);
 * // Returns: 1,185,000 USD
 * ```
 */
function convertCurrencyPair(amount, fromCurrency, toCurrency, rate, isInverted = false) {
    if (amount < 0) {
        throw new Error('Amount cannot be negative');
    }
    if (rate <= 0) {
        throw new Error('Exchange rate must be positive');
    }
    if (fromCurrency === toCurrency) {
        return amount;
    }
    return isInverted ? amount / rate : amount * rate;
}
/**
 * Normalize currency pair to market convention
 *
 * @param base - Base currency
 * @param quote - Quote currency
 * @returns Normalized currency pair with convention indicator
 *
 * @example
 * ```typescript
 * const normalized = normalizeCurrencyPair('USD', 'EUR');
 * // Returns: { base: 'EUR', quote: 'USD', isInverted: true }
 * // Market convention is EUR/USD, not USD/EUR
 * ```
 */
function normalizeCurrencyPair(base, quote) {
    // Major currency hierarchy for market convention
    const majorCurrencies = ['EUR', 'GBP', 'AUD', 'NZD', 'USD', 'CAD', 'CHF', 'JPY'];
    const baseIndex = majorCurrencies.indexOf(base);
    const quoteIndex = majorCurrencies.indexOf(quote);
    // If both are major currencies, use hierarchy
    if (baseIndex !== -1 && quoteIndex !== -1) {
        if (baseIndex < quoteIndex) {
            return { base, quote, isInverted: false };
        }
        else {
            return { base: quote, quote: base, isInverted: true };
        }
    }
    // If only one is major, major should be base (except for USD)
    if (baseIndex !== -1 && quoteIndex === -1) {
        if (base === 'USD') {
            return { base: quote, quote: base, isInverted: true };
        }
        return { base, quote, isInverted: false };
    }
    if (baseIndex === -1 && quoteIndex !== -1) {
        if (quote === 'USD') {
            return { base, quote, isInverted: false };
        }
        return { base: quote, quote: base, isInverted: true };
    }
    // Both are exotic, keep as is
    return { base, quote, isInverted: false };
}
/**
 * Validate currency pair
 *
 * @param pair - Currency pair to validate
 * @returns Validation result with error messages
 *
 * @example
 * ```typescript
 * const validation = validateCurrencyPair({ base: 'EUR', quote: 'USD', ... });
 * // Returns: { isValid: true, errors: [] }
 * ```
 */
function validateCurrencyPair(pair) {
    const errors = [];
    if (!pair.base || pair.base.length !== 3) {
        errors.push('Base currency must be 3-character ISO code');
    }
    if (!pair.quote || pair.quote.length !== 3) {
        errors.push('Quote currency must be 3-character ISO code');
    }
    if (pair.base === pair.quote) {
        errors.push('Base and quote currencies must be different');
    }
    if (pair.precision < 0 || pair.precision > 10) {
        errors.push('Precision must be between 0 and 10');
    }
    if (pair.pipSize <= 0) {
        errors.push('Pip size must be positive');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Get currency pair precision based on market conventions
 *
 * @param pair - Currency pair
 * @returns Precision (decimal places) and pip size
 *
 * @example
 * ```typescript
 * const precision = getCurrencyPairPrecision({ base: 'EUR', quote: 'USD', ... });
 * // Returns: { precision: 4, pipSize: 0.0001 }
 *
 * const jpyPrecision = getCurrencyPairPrecision({ base: 'USD', quote: 'JPY', ... });
 * // Returns: { precision: 2, pipSize: 0.01 }
 * ```
 */
function getCurrencyPairPrecision(pair) {
    // JPY pairs typically have 2 decimal places
    if (pair.quote === 'JPY' || pair.base === 'JPY') {
        return { precision: 2, pipSize: 0.01 };
    }
    // Most other pairs have 4 decimal places
    return { precision: 4, pipSize: 0.0001 };
}
/**
 * Format currency amount according to currency conventions
 *
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param precision - Decimal precision (optional, uses currency default if not provided)
 * @returns Formatted amount string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrencyAmount(1234567.89, 'USD', 2);
 * // Returns: "1,234,567.89"
 * ```
 */
function formatCurrencyAmount(amount, currency, precision) {
    const defaultPrecision = currency === 'JPY' ? 0 : 2;
    const decimals = precision !== undefined ? precision : defaultPrecision;
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}
// ============================================================================
// FX OPTIONS PRICING FUNCTIONS (8 functions)
// ============================================================================
/**
 * Calculate FX vanilla option price using Garman-Kohlhagen model
 *
 * @param option - FX option specification
 * @returns Option price and Greeks
 *
 * @example
 * ```typescript
 * const option: FXOption = {
 *   type: 'call',
 *   strike: 1.2000,
 *   spot: 1.1850,
 *   timeToExpiry: 0.25, // 3 months
 *   volatility: 0.10,
 *   domesticRate: 0.02,
 *   foreignRate: 0.05,
 *   style: 'european'
 * };
 * const pricing = calculateFXVanillaOptionPrice(option);
 * ```
 */
function calculateFXVanillaOptionPrice(option) {
    if (option.spot <= 0 || option.strike <= 0) {
        throw new Error('Spot and strike must be positive');
    }
    if (option.timeToExpiry <= 0) {
        throw new Error('Time to expiry must be positive');
    }
    if (option.volatility <= 0) {
        throw new Error('Volatility must be positive');
    }
    const S = option.spot;
    const K = option.strike;
    const T = option.timeToExpiry;
    const σ = option.volatility;
    const rd = option.domesticRate;
    const rf = option.foreignRate;
    // Calculate d1 and d2
    const d1 = (Math.log(S / K) + (rd - rf + 0.5 * σ * σ) * T) / (σ * Math.sqrt(T));
    const d2 = d1 - σ * Math.sqrt(T);
    // Standard normal CDF
    const N = (x) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - prob : prob;
    };
    // Standard normal PDF
    const n = (x) => {
        return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    };
    let premium;
    const discountDomestic = Math.exp(-rd * T);
    const discountForeign = Math.exp(-rf * T);
    if (option.type === 'call') {
        premium = S * discountForeign * N(d1) - K * discountDomestic * N(d2);
    }
    else {
        premium = K * discountDomestic * N(-d2) - S * discountForeign * N(-d1);
    }
    // Calculate Greeks
    const delta = option.type === 'call'
        ? discountForeign * N(d1)
        : discountForeign * (N(d1) - 1);
    const gamma = discountForeign * n(d1) / (S * σ * Math.sqrt(T));
    const vega = S * discountForeign * n(d1) * Math.sqrt(T) / 100; // Per 1% change in vol
    const theta = option.type === 'call'
        ? (-S * discountForeign * n(d1) * σ / (2 * Math.sqrt(T))
            - rd * K * discountDomestic * N(d2)
            + rf * S * discountForeign * N(d1)) / 365
        : (-S * discountForeign * n(d1) * σ / (2 * Math.sqrt(T))
            + rd * K * discountDomestic * N(-d2)
            - rf * S * discountForeign * N(-d1)) / 365;
    const rho = option.type === 'call'
        ? K * T * discountDomestic * N(d2) / 100 // Per 1% change in rate
        : -K * T * discountDomestic * N(-d2) / 100;
    const rhoForeign = option.type === 'call'
        ? -S * T * discountForeign * N(d1) / 100
        : S * T * discountForeign * N(-d1) / 100;
    const intrinsicValue = option.type === 'call'
        ? Math.max(S - K, 0)
        : Math.max(K - S, 0);
    const timeValue = premium - intrinsicValue;
    return {
        premium,
        greeks: { delta, gamma, vega, theta, rho, rhoForeign },
        intrinsicValue,
        timeValue
    };
}
/**
 * Calculate FX digital option price
 *
 * @param option - FX option specification
 * @param payout - Payout amount if option finishes in the money
 * @returns Digital option price
 *
 * @example
 * ```typescript
 * const digitalPrice = calculateFXDigitalOptionPrice(option, 1.0);
 * // Returns price of binary option that pays 1.0 if spot > strike at expiry
 * ```
 */
function calculateFXDigitalOptionPrice(option, payout) {
    if (option.spot <= 0 || option.strike <= 0) {
        throw new Error('Spot and strike must be positive');
    }
    if (option.timeToExpiry <= 0) {
        throw new Error('Time to expiry must be positive');
    }
    if (payout <= 0) {
        throw new Error('Payout must be positive');
    }
    const S = option.spot;
    const K = option.strike;
    const T = option.timeToExpiry;
    const σ = option.volatility;
    const rd = option.domesticRate;
    const rf = option.foreignRate;
    const d2 = (Math.log(S / K) + (rd - rf - 0.5 * σ * σ) * T) / (σ * Math.sqrt(T));
    const N = (x) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - prob : prob;
    };
    const discountDomestic = Math.exp(-rd * T);
    if (option.type === 'call') {
        return payout * discountDomestic * N(d2);
    }
    else {
        return payout * discountDomestic * N(-d2);
    }
}
/**
 * Calculate FX option delta
 *
 * @param option - FX option specification
 * @returns Delta (rate of change of option price with respect to spot)
 *
 * @example
 * ```typescript
 * const delta = calculateFXOptionDelta(option);
 * // Returns delta: ~0.45 for ATM call
 * ```
 */
function calculateFXOptionDelta(option) {
    const pricing = calculateFXVanillaOptionPrice(option);
    return pricing.greeks.delta;
}
/**
 * Calculate FX option gamma
 *
 * @param option - FX option specification
 * @returns Gamma (rate of change of delta with respect to spot)
 *
 * @example
 * ```typescript
 * const gamma = calculateFXOptionGamma(option);
 * ```
 */
function calculateFXOptionGamma(option) {
    const pricing = calculateFXVanillaOptionPrice(option);
    return pricing.greeks.gamma;
}
/**
 * Calculate FX option vega
 *
 * @param option - FX option specification
 * @returns Vega (rate of change of option price with respect to volatility)
 *
 * @example
 * ```typescript
 * const vega = calculateFXOptionVega(option);
 * // Returns vega: change in option price per 1% change in volatility
 * ```
 */
function calculateFXOptionVega(option) {
    const pricing = calculateFXVanillaOptionPrice(option);
    return pricing.greeks.vega;
}
/**
 * Calculate FX option theta
 *
 * @param option - FX option specification
 * @returns Theta (rate of change of option price with respect to time)
 *
 * @example
 * ```typescript
 * const theta = calculateFXOptionTheta(option);
 * // Returns theta: change in option price per day
 * ```
 */
function calculateFXOptionTheta(option) {
    const pricing = calculateFXVanillaOptionPrice(option);
    return pricing.greeks.theta;
}
/**
 * Calculate FX option rho
 *
 * @param option - FX option specification
 * @returns Rho (rate of change of option price with respect to domestic interest rate)
 *
 * @example
 * ```typescript
 * const rho = calculateFXOptionRho(option);
 * // Returns rho: change in option price per 1% change in domestic rate
 * ```
 */
function calculateFXOptionRho(option) {
    const pricing = calculateFXVanillaOptionPrice(option);
    return pricing.greeks.rho;
}
/**
 * Calculate FX option implied volatility using Newton-Raphson method
 *
 * @param option - FX option specification (without volatility)
 * @param marketPrice - Observed market price
 * @param maxIterations - Maximum iterations for convergence
 * @param tolerance - Convergence tolerance
 * @returns Implied volatility
 *
 * @example
 * ```typescript
 * const impliedVol = calculateFXOptionImpliedVolatility(
 *   { ...option, volatility: 0.10 }, // Initial guess
 *   0.0250, // Market price
 *   100,
 *   0.0001
 * );
 * ```
 */
function calculateFXOptionImpliedVolatility(option, marketPrice, maxIterations = 100, tolerance = 0.0001) {
    if (marketPrice <= 0) {
        throw new Error('Market price must be positive');
    }
    let sigma = option.volatility || 0.20; // Initial guess: 20% volatility
    for (let i = 0; i < maxIterations; i++) {
        const testOption = { ...option, volatility: sigma };
        const pricing = calculateFXVanillaOptionPrice(testOption);
        const priceDiff = pricing.premium - marketPrice;
        if (Math.abs(priceDiff) < tolerance) {
            return sigma;
        }
        // Newton-Raphson: σ_new = σ_old - f(σ) / f'(σ)
        // f(σ) = theoreticalPrice - marketPrice
        // f'(σ) = vega
        const vega = pricing.greeks.vega;
        if (Math.abs(vega) < 1e-10) {
            throw new Error('Vega too small for convergence');
        }
        sigma = sigma - priceDiff / (vega * 100); // vega is per 1% change
        // Keep sigma positive and reasonable
        sigma = Math.max(0.001, Math.min(sigma, 2.0));
    }
    throw new Error('Implied volatility did not converge');
}
// ============================================================================
// FX VOLATILITY ANALYSIS FUNCTIONS (6 functions)
// ============================================================================
/**
 * Calculate FX implied volatility from market prices
 * (Wrapper around calculateFXOptionImpliedVolatility for consistency)
 *
 * @param option - FX option specification
 * @param marketPrice - Market option price
 * @returns Implied volatility
 */
function calculateFXImpliedVolatility(option, marketPrice) {
    return calculateFXOptionImpliedVolatility(option, marketPrice);
}
/**
 * Construct FX volatility surface from market quotes
 *
 * @param pair - Currency pair
 * @param spotRate - Current spot rate
 * @param quotes - Market volatility quotes (ATM, RR, BF by tenor)
 * @param tenors - Tenors in years
 * @returns Volatility surface
 *
 * @example
 * ```typescript
 * const surface = constructFXVolatilitySurface(
 *   eurUsdPair,
 *   1.1850,
 *   {
 *     atm: [0.08, 0.09, 0.10], // ATM vols for each tenor
 *     rr25: [0.005, 0.006, 0.007], // 25-delta risk reversals
 *     bf25: [0.002, 0.0025, 0.003] // 25-delta butterflies
 *   },
 *   [0.25, 0.5, 1.0] // 3M, 6M, 1Y
 * );
 * ```
 */
function constructFXVolatilitySurface(pair, spotRate, quotes, tenors) {
    if (quotes.atm.length !== tenors.length ||
        quotes.rr25.length !== tenors.length ||
        quotes.bf25.length !== tenors.length) {
        throw new Error('All quote arrays must match tenors length');
    }
    const points = [];
    const atmVolatilities = new Map();
    const riskReversals = new Map();
    const butterflies = new Map();
    for (let i = 0; i < tenors.length; i++) {
        const tenor = tenors[i];
        const atmVol = quotes.atm[i];
        const rr = quotes.rr25[i];
        const bf = quotes.bf25[i];
        atmVolatilities.set(tenor, atmVol);
        riskReversals.set(tenor, rr);
        butterflies.set(tenor, bf);
        // Calculate 25-delta call and put volatilities
        // vol(call 25d) = ATM + 0.5 * RR + BF
        // vol(put 25d) = ATM - 0.5 * RR + BF
        const vol25Call = atmVol + 0.5 * rr + bf;
        const vol25Put = atmVol - 0.5 * rr + bf;
        // Add surface points
        // Note: Strike calculation would require more complex delta-to-strike conversion
        // For now, use relative strikes
        points.push({ strike: spotRate, tenor, volatility: atmVol, delta: 0.5 });
        points.push({ strike: spotRate * 1.05, tenor, volatility: vol25Call, delta: 0.25 });
        points.push({ strike: spotRate * 0.95, tenor, volatility: vol25Put, delta: -0.25 });
    }
    return {
        pair,
        points,
        atmVolatilities,
        riskReversals,
        butterflies,
        timestamp: new Date()
    };
}
/**
 * Interpolate FX volatility surface for specific strike and tenor
 *
 * @param surface - Volatility surface
 * @param strike - Strike price
 * @param tenor - Tenor in years
 * @param method - Interpolation method ('linear' or 'cubic')
 * @returns Interpolated volatility
 *
 * @example
 * ```typescript
 * const vol = interpolateFXVolatilitySurface(surface, 1.2000, 0.75, 'linear');
 * // Returns interpolated volatility for strike 1.2000 at 9-month tenor
 * ```
 */
function interpolateFXVolatilitySurface(surface, strike, tenor, method = 'linear') {
    if (strike <= 0) {
        throw new Error('Strike must be positive');
    }
    if (tenor <= 0) {
        throw new Error('Tenor must be positive');
    }
    // Find surrounding points
    const relevantPoints = surface.points.filter(p => Math.abs(p.tenor - tenor) < 0.01 // Same tenor (within tolerance)
    ).sort((a, b) => a.strike - b.strike);
    if (relevantPoints.length < 2) {
        // Not enough points for exact tenor, need to interpolate in tenor dimension too
        // For simplicity, use nearest ATM volatility
        const atmVols = Array.from(surface.atmVolatilities.entries()).sort((a, b) => a[0] - b[0]);
        if (atmVols.length === 0) {
            throw new Error('No ATM volatilities available');
        }
        // Linear interpolation in tenor
        for (let i = 0; i < atmVols.length - 1; i++) {
            const [t1, vol1] = atmVols[i];
            const [t2, vol2] = atmVols[i + 1];
            if (tenor >= t1 && tenor <= t2) {
                const weight = (tenor - t1) / (t2 - t1);
                return vol1 + weight * (vol2 - vol1);
            }
        }
        // Extrapolate if outside range
        if (tenor < atmVols[0][0]) {
            return atmVols[0][1];
        }
        return atmVols[atmVols.length - 1][1];
    }
    // Linear interpolation in strike dimension
    if (method === 'linear') {
        for (let i = 0; i < relevantPoints.length - 1; i++) {
            const p1 = relevantPoints[i];
            const p2 = relevantPoints[i + 1];
            if (strike >= p1.strike && strike <= p2.strike) {
                const weight = (strike - p1.strike) / (p2.strike - p1.strike);
                return p1.volatility + weight * (p2.volatility - p1.volatility);
            }
        }
        // Extrapolate if outside strike range
        if (strike < relevantPoints[0].strike) {
            return relevantPoints[0].volatility;
        }
        return relevantPoints[relevantPoints.length - 1].volatility;
    }
    // Cubic interpolation would go here
    throw new Error('Cubic interpolation not yet implemented');
}
/**
 * Calculate FX volatility smile for specific tenor
 *
 * @param surface - Volatility surface
 * @param tenor - Tenor in years
 * @param strikes - Array of strikes to calculate smile
 * @returns Volatility smile (volatility by strike)
 *
 * @example
 * ```typescript
 * const smile = calculateFXVolatilitySmile(surface, 0.25, [1.15, 1.17, 1.19, 1.21, 1.23]);
 * // Returns volatility smile for 3-month tenor
 * ```
 */
function calculateFXVolatilitySmile(surface, tenor, strikes) {
    return strikes.map(strike => ({
        strike,
        volatility: interpolateFXVolatilitySurface(surface, strike, tenor)
    }));
}
/**
 * Calculate FX ATM volatility for specific tenor
 *
 * @param surface - Volatility surface
 * @param tenor - Tenor in years
 * @returns ATM volatility
 *
 * @example
 * ```typescript
 * const atmVol = calculateFXATMVolatility(surface, 0.25);
 * // Returns 3-month ATM volatility
 * ```
 */
function calculateFXATMVolatility(surface, tenor) {
    // Check if exact tenor exists
    if (surface.atmVolatilities.has(tenor)) {
        return surface.atmVolatilities.get(tenor);
    }
    // Interpolate between tenors
    const tenors = Array.from(surface.atmVolatilities.keys()).sort((a, b) => a - b);
    for (let i = 0; i < tenors.length - 1; i++) {
        const t1 = tenors[i];
        const t2 = tenors[i + 1];
        if (tenor >= t1 && tenor <= t2) {
            const vol1 = surface.atmVolatilities.get(t1);
            const vol2 = surface.atmVolatilities.get(t2);
            const weight = (tenor - t1) / (t2 - t1);
            return vol1 + weight * (vol2 - vol1);
        }
    }
    // Extrapolate if outside range
    if (tenor < tenors[0]) {
        return surface.atmVolatilities.get(tenors[0]);
    }
    return surface.atmVolatilities.get(tenors[tenors.length - 1]);
}
/**
 * Calculate FX risk reversal and butterfly for tenor
 *
 * @param surface - Volatility surface
 * @param tenor - Tenor in years
 * @returns Risk reversal and butterfly spreads
 *
 * @example
 * ```typescript
 * const { riskReversal, butterfly } = calculateFXRiskReversalButterfly(surface, 0.25);
 * // RR: vol(25d call) - vol(25d put)
 * // BF: 0.5 * (vol(25d call) + vol(25d put)) - vol(ATM)
 * ```
 */
function calculateFXRiskReversalButterfly(surface, tenor) {
    // Check if exact tenor exists
    if (surface.riskReversals.has(tenor) && surface.butterflies.has(tenor)) {
        return {
            riskReversal: surface.riskReversals.get(tenor),
            butterfly: surface.butterflies.get(tenor)
        };
    }
    // Interpolate
    const tenors = Array.from(surface.riskReversals.keys()).sort((a, b) => a - b);
    for (let i = 0; i < tenors.length - 1; i++) {
        const t1 = tenors[i];
        const t2 = tenors[i + 1];
        if (tenor >= t1 && tenor <= t2) {
            const weight = (tenor - t1) / (t2 - t1);
            const rr1 = surface.riskReversals.get(t1);
            const rr2 = surface.riskReversals.get(t2);
            const riskReversal = rr1 + weight * (rr2 - rr1);
            const bf1 = surface.butterflies.get(t1);
            const bf2 = surface.butterflies.get(t2);
            const butterfly = bf1 + weight * (bf2 - bf1);
            return { riskReversal, butterfly };
        }
    }
    // Extrapolate
    if (tenor < tenors[0]) {
        return {
            riskReversal: surface.riskReversals.get(tenors[0]),
            butterfly: surface.butterflies.get(tenors[0])
        };
    }
    return {
        riskReversal: surface.riskReversals.get(tenors[tenors.length - 1]),
        butterfly: surface.butterflies.get(tenors[tenors.length - 1])
    };
}
// ============================================================================
// CURRENCY CORRELATION FUNCTIONS (4 functions)
// ============================================================================
/**
 * Calculate currency correlation matrix
 *
 * @param returns - Array of currency pair returns (time series)
 * @param pairs - Array of currency pairs
 * @returns Correlation matrix
 *
 * @example
 * ```typescript
 * const returns = [
 *   [0.001, -0.002, 0.003], // EUR/USD, GBP/USD, USD/JPY returns at time 1
 *   [0.002, 0.001, -0.001], // Returns at time 2
 *   // ... more time periods
 * ];
 * const matrix = calculateCurrencyCorrelationMatrix(returns, [eurUsd, gbpUsd, usdJpy]);
 * ```
 */
function calculateCurrencyCorrelationMatrix(returns, pairs) {
    if (returns.length === 0) {
        throw new Error('Returns array cannot be empty');
    }
    if (returns[0].length !== pairs.length) {
        throw new Error('Number of return series must match number of pairs');
    }
    const n = pairs.length;
    const correlationMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    // Calculate correlation for each pair
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            if (i === j) {
                correlationMatrix[i][j] = 1.0;
            }
            else {
                const series1 = returns.map(r => r[i]);
                const series2 = returns.map(r => r[j]);
                const correlation = calculatePearsonCorrelation(series1, series2);
                correlationMatrix[i][j] = correlation;
                correlationMatrix[j][i] = correlation; // Symmetric
            }
        }
    }
    return correlationMatrix;
}
/**
 * Helper: Calculate Pearson correlation coefficient
 */
function calculatePearsonCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) {
        throw new Error('Series must have same non-zero length');
    }
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    let numerator = 0;
    let sumSqX = 0;
    let sumSqY = 0;
    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;
        numerator += dx * dy;
        sumSqX += dx * dx;
        sumSqY += dy * dy;
    }
    if (sumSqX === 0 || sumSqY === 0) {
        return 0;
    }
    return numerator / Math.sqrt(sumSqX * sumSqY);
}
/**
 * Calculate rolling currency correlation
 *
 * @param returns1 - First currency pair returns (time series)
 * @param returns2 - Second currency pair returns (time series)
 * @param window - Rolling window size
 * @returns Rolling correlation time series
 *
 * @example
 * ```typescript
 * const rolling = calculateRollingCurrencyCorrelation(eurUsdReturns, gbpUsdReturns, 30);
 * // Returns 30-period rolling correlation
 * ```
 */
function calculateRollingCurrencyCorrelation(returns1, returns2, window) {
    if (returns1.length !== returns2.length) {
        throw new Error('Return series must have same length');
    }
    if (window <= 1) {
        throw new Error('Window must be greater than 1');
    }
    if (returns1.length < window) {
        throw new Error('Return series shorter than window');
    }
    const rollingCorr = [];
    for (let i = window - 1; i < returns1.length; i++) {
        const window1 = returns1.slice(i - window + 1, i + 1);
        const window2 = returns2.slice(i - window + 1, i + 1);
        rollingCorr.push(calculatePearsonCorrelation(window1, window2));
    }
    return rollingCorr;
}
/**
 * Detect correlation regime change
 * Identifies significant shifts in currency pair correlation
 *
 * @param rollingCorr - Rolling correlation time series
 * @param threshold - Threshold for regime change detection
 * @returns Regime change points and statistics
 *
 * @example
 * ```typescript
 * const regimes = detectCorrelationRegimeChange(rollingCorr, 0.3);
 * // Returns indices where correlation changed by more than 0.3
 * ```
 */
function detectCorrelationRegimeChange(rollingCorr, threshold = 0.3) {
    if (rollingCorr.length < 2) {
        throw new Error('Need at least 2 correlation values');
    }
    const regimeChanges = [];
    for (let i = 1; i < rollingCorr.length; i++) {
        const change = Math.abs(rollingCorr[i] - rollingCorr[i - 1]);
        if (change > threshold) {
            regimeChanges.push({
                index: i,
                oldCorr: rollingCorr[i - 1],
                newCorr: rollingCorr[i],
                change
            });
        }
    }
    return regimeChanges;
}
/**
 * Calculate currency beta (systematic risk relative to a benchmark)
 *
 * @param currencyReturns - Currency pair returns
 * @param benchmarkReturns - Benchmark returns (e.g., DXY index)
 * @returns Beta coefficient
 *
 * @example
 * ```typescript
 * const beta = calculateCurrencyBeta(eurUsdReturns, dxyReturns);
 * // Returns how much EUR/USD moves relative to DXY
 * ```
 */
function calculateCurrencyBeta(currencyReturns, benchmarkReturns) {
    if (currencyReturns.length !== benchmarkReturns.length) {
        throw new Error('Return series must have same length');
    }
    if (currencyReturns.length === 0) {
        throw new Error('Return series cannot be empty');
    }
    const meanBenchmark = benchmarkReturns.reduce((a, b) => a + b, 0) / benchmarkReturns.length;
    let covariance = 0;
    let benchmarkVariance = 0;
    for (let i = 0; i < currencyReturns.length; i++) {
        const benchmarkDev = benchmarkReturns[i] - meanBenchmark;
        covariance += currencyReturns[i] * benchmarkDev;
        benchmarkVariance += benchmarkDev * benchmarkDev;
    }
    if (benchmarkVariance === 0) {
        throw new Error('Benchmark has zero variance');
    }
    return covariance / benchmarkVariance;
}
// ============================================================================
// FX HEDGING STRATEGIES (5 functions)
// ============================================================================
/**
 * Calculate delta hedge for FX options portfolio
 *
 * @param positions - Array of option positions with Greeks
 * @param spotPrice - Current spot price
 * @returns Required hedge amount in base currency
 *
 * @example
 * ```typescript
 * const hedge = calculateDeltaHedge([
 *   { notional: 1000000, delta: 0.5 },
 *   { notional: -500000, delta: -0.3 }
 * ], 1.1850);
 * ```
 */
function calculateDeltaHedge(positions, spotPrice) {
    if (spotPrice <= 0) {
        throw new Error('Spot price must be positive');
    }
    let totalDelta = 0;
    for (const pos of positions) {
        totalDelta += pos.notional * pos.delta;
    }
    // Hedge amount is negative of portfolio delta
    return -totalDelta;
}
/**
 * Calculate portfolio hedge using minimum variance approach
 *
 * @param exposures - Array of currency exposures
 * @param correlationMatrix - Correlation matrix between currencies
 * @param volatilities - Volatility of each currency
 * @returns Optimal hedge ratios for each currency
 *
 * @example
 * ```typescript
 * const hedge = calculatePortfolioHedge(
 *   [1000000, -500000, 300000],
 *   [[1, 0.7, -0.3], [0.7, 1, -0.1], [-0.3, -0.1, 1]],
 *   [0.10, 0.12, 0.15]
 * );
 * ```
 */
function calculatePortfolioHedge(exposures, correlationMatrix, volatilities) {
    const n = exposures.length;
    if (correlationMatrix.length !== n || volatilities.length !== n) {
        throw new Error('Dimensions must match');
    }
    // Convert correlation matrix to covariance matrix
    const covarianceMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            covarianceMatrix[i][j] = correlationMatrix[i][j] * volatilities[i] * volatilities[j];
        }
    }
    // Calculate portfolio variance
    let portfolioVariance = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            portfolioVariance += exposures[i] * exposures[j] * covarianceMatrix[i][j];
        }
    }
    // Optimal hedge ratios (simplified - assumes hedging each exposure independently)
    const hedgeRatios = [];
    for (let i = 0; i < n; i++) {
        // Minimum variance hedge ratio
        const hedgeRatio = exposures[i] < 0 ? 1.0 : -1.0;
        hedgeRatios.push(hedgeRatio);
    }
    return hedgeRatios;
}
/**
 * Calculate optimal hedge ratio using regression
 *
 * @param spotReturns - Spot position returns (time series)
 * @param hedgeReturns - Hedge instrument returns (time series)
 * @returns Optimal hedge ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateOptimalHedgeRatio(eurUsdSpotReturns, eurUsdFuturesReturns);
 * // Returns optimal number of futures contracts per unit of spot exposure
 * ```
 */
function calculateOptimalHedgeRatio(spotReturns, hedgeReturns) {
    if (spotReturns.length !== hedgeReturns.length) {
        throw new Error('Return series must have same length');
    }
    // Optimal hedge ratio = Cov(spot, hedge) / Var(hedge)
    const meanSpot = spotReturns.reduce((a, b) => a + b, 0) / spotReturns.length;
    const meanHedge = hedgeReturns.reduce((a, b) => a + b, 0) / hedgeReturns.length;
    let covariance = 0;
    let hedgeVariance = 0;
    for (let i = 0; i < spotReturns.length; i++) {
        const spotDev = spotReturns[i] - meanSpot;
        const hedgeDev = hedgeReturns[i] - meanHedge;
        covariance += spotDev * hedgeDev;
        hedgeVariance += hedgeDev * hedgeDev;
    }
    if (hedgeVariance === 0) {
        throw new Error('Hedge instrument has zero variance');
    }
    return covariance / hedgeVariance;
}
/**
 * Calculate hedge effectiveness (R-squared)
 *
 * @param spotReturns - Spot position returns
 * @param hedgedReturns - Hedged portfolio returns
 * @returns Hedge effectiveness (0-1, where 1 is perfect hedge)
 *
 * @example
 * ```typescript
 * const effectiveness = calculateHedgeEffectiveness(spotReturns, hedgedReturns);
 * // Returns 0.95 for 95% effective hedge
 * ```
 */
function calculateHedgeEffectiveness(spotReturns, hedgedReturns) {
    if (spotReturns.length !== hedgedReturns.length) {
        throw new Error('Return series must have same length');
    }
    const correlation = calculatePearsonCorrelation(spotReturns, hedgedReturns);
    return correlation * correlation; // R-squared
}
/**
 * Rebalance delta hedge based on gamma exposure
 *
 * @param currentDelta - Current portfolio delta
 * @param targetDelta - Target delta (typically 0 for delta-neutral)
 * @param spotPrice - Current spot price
 * @param spotMove - Expected spot price movement
 * @param gamma - Portfolio gamma
 * @returns Rebalancing trade size
 *
 * @example
 * ```typescript
 * const rebalance = rebalanceDeltaHedge(5000, 0, 1.1850, 0.0020, 1500);
 * // Returns amount to trade to restore delta neutrality after spot move
 * ```
 */
function rebalanceDeltaHedge(currentDelta, targetDelta, spotPrice, spotMove, gamma) {
    if (spotPrice <= 0) {
        throw new Error('Spot price must be positive');
    }
    // Delta changes by gamma * spot move
    const deltaChange = gamma * spotMove;
    const newDelta = currentDelta + deltaChange;
    // Trade needed to get back to target
    return targetDelta - newDelta;
}
// ============================================================================
// CURRENCY BASKET ANALYTICS (4 functions)
// ============================================================================
/**
 * Construct currency basket with specified weights
 *
 * @param basket - Currency basket specification
 * @param rates - Current exchange rates (vs base currency)
 * @returns Basket value and composition
 *
 * @example
 * ```typescript
 * const basket: CurrencyBasket = {
 *   name: 'Custom SDR',
 *   components: [
 *     { currency: 'USD', weight: 0.40 },
 *     { currency: 'EUR', weight: 0.30 },
 *     { currency: 'GBP', weight: 0.20 },
 *     { currency: 'JPY', weight: 0.10 }
 *   ],
 *   baseCurrency: 'USD',
 *   rebalanceFrequency: 30
 * };
 * const rates = new Map([['EUR', 1.1850], ['GBP', 1.2700], ['JPY', 0.0091]]);
 * const basketValue = constructCurrencyBasket(basket, rates);
 * ```
 */
function constructCurrencyBasket(basket, rates) {
    let totalWeight = 0;
    const composition = new Map();
    for (const component of basket.components) {
        totalWeight += component.weight;
        if (component.currency === basket.baseCurrency) {
            composition.set(component.currency, component.weight);
        }
        else {
            const rate = rates.get(component.currency);
            if (!rate) {
                throw new Error(`Rate not found for ${component.currency}`);
            }
            composition.set(component.currency, component.weight * rate);
        }
    }
    if (Math.abs(totalWeight - 1.0) > 0.001) {
        throw new Error('Basket weights must sum to 1.0');
    }
    let basketValue = 0;
    for (const [, value] of composition) {
        basketValue += value;
    }
    return { value: basketValue, composition };
}
/**
 * Rebalance currency basket to target weights
 *
 * @param currentComposition - Current basket composition
 * @param targetWeights - Target weights for each currency
 * @param currentRates - Current exchange rates
 * @returns Required trades to rebalance
 *
 * @example
 * ```typescript
 * const trades = rebalanceCurrencyBasket(currentComp, targetWeights, rates);
 * // Returns buy/sell amounts for each currency
 * ```
 */
function rebalanceCurrencyBasket(currentComposition, targetWeights, currentRates) {
    const trades = new Map();
    // Calculate total current value
    let totalValue = 0;
    for (const [, amount] of currentComposition) {
        totalValue += amount;
    }
    // Calculate required amounts for target weights
    for (const [currency, targetWeight] of targetWeights) {
        const targetAmount = totalValue * targetWeight;
        const currentAmount = currentComposition.get(currency) || 0;
        const trade = targetAmount - currentAmount;
        if (Math.abs(trade) > 0.01) { // Only include material trades
            trades.set(currency, trade);
        }
    }
    return trades;
}
/**
 * Calculate currency basket performance attribution
 *
 * @param basketReturns - Basket returns
 * @param componentReturns - Returns of each component
 * @param weights - Component weights
 * @returns Performance attribution by component
 *
 * @example
 * ```typescript
 * const attribution = calculateBasketPerformanceAttribution(
 *   0.025, // 2.5% total return
 *   [0.03, 0.02, 0.01, 0.04], // Component returns
 *   [0.40, 0.30, 0.20, 0.10] // Weights
 * );
 * ```
 */
function calculateBasketPerformanceAttribution(basketReturns, componentReturns, weights) {
    if (componentReturns.length !== weights.length) {
        throw new Error('Component returns and weights must have same length');
    }
    const attribution = [];
    for (let i = 0; i < componentReturns.length; i++) {
        const contribution = componentReturns[i] * weights[i];
        const percentage = basketReturns !== 0 ? (contribution / basketReturns) * 100 : 0;
        attribution.push({
            index: i,
            contribution,
            percentage
        });
    }
    return attribution;
}
/**
 * Calculate currency basket volatility
 *
 * @param componentVolatilities - Volatility of each component
 * @param weights - Component weights
 * @param correlationMatrix - Correlation matrix between components
 * @returns Basket volatility
 *
 * @example
 * ```typescript
 * const basketVol = calculateBasketVolatility(
 *   [0.10, 0.12, 0.08, 0.15],
 *   [0.40, 0.30, 0.20, 0.10],
 *   correlationMatrix
 * );
 * ```
 */
function calculateBasketVolatility(componentVolatilities, weights, correlationMatrix) {
    const n = weights.length;
    if (componentVolatilities.length !== n || correlationMatrix.length !== n) {
        throw new Error('Dimensions must match');
    }
    let variance = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            variance += weights[i] * weights[j] * componentVolatilities[i] *
                componentVolatilities[j] * correlationMatrix[i][j];
        }
    }
    return Math.sqrt(variance);
}
// ============================================================================
// FX CARRY TRADE ANALYTICS (4 functions)
// ============================================================================
/**
 * Calculate FX carry trade return
 *
 * @param trade - Carry trade specification
 * @param holdingPeriod - Holding period in days
 * @param spotChange - Spot rate change over period (optional)
 * @returns Carry return (interest differential + spot change)
 *
 * @example
 * ```typescript
 * const carryTrade: CarryTrade = {
 *   fundingCurrency: 'JPY',
 *   targetCurrency: 'AUD',
 *   fundingRate: 0.001, // 0.1% JPY rate
 *   targetRate: 0.045, // 4.5% AUD rate
 *   spotRate: 95.50,
 *   leverage: 1.0
 * };
 * const returns = calculateFXCarryReturn(carryTrade, 365);
 * // Returns ~4.4% annual carry (4.5% - 0.1%)
 * ```
 */
function calculateFXCarryReturn(trade, holdingPeriod, spotChange = 0) {
    if (holdingPeriod <= 0) {
        throw new Error('Holding period must be positive');
    }
    const yearFraction = holdingPeriod / 365;
    // Interest differential (carry)
    const carry = (trade.targetRate - trade.fundingRate) * yearFraction;
    // Total return = carry + spot change
    const totalReturn = (carry + spotChange) * trade.leverage;
    return totalReturn;
}
/**
 * Calculate FX carry trade funding cost
 *
 * @param trade - Carry trade specification
 * @param notional - Notional amount in target currency
 * @param holdingPeriod - Holding period in days
 * @returns Total funding cost
 *
 * @example
 * ```typescript
 * const fundingCost = calculateFXFundingCost(carryTrade, 1000000, 365);
 * ```
 */
function calculateFXFundingCost(trade, notional, holdingPeriod) {
    if (notional <= 0) {
        throw new Error('Notional must be positive');
    }
    if (holdingPeriod <= 0) {
        throw new Error('Holding period must be positive');
    }
    const yearFraction = holdingPeriod / 365;
    // Convert notional to funding currency
    const fundingNotional = notional / trade.spotRate;
    // Funding cost
    return fundingNotional * trade.fundingRate * yearFraction * trade.leverage;
}
/**
 * Calculate FX roll yield
 *
 * @param spotRate - Current spot rate
 * @param forwardRate - Forward rate for roll date
 * @param holdingPeriod - Holding period in days
 * @returns Annualized roll yield
 *
 * @example
 * ```typescript
 * const rollYield = calculateFXRollYield(1.1850, 1.1880, 30);
 * // Returns annualized yield from rolling forward contracts
 * ```
 */
function calculateFXRollYield(spotRate, forwardRate, holdingPeriod) {
    if (spotRate <= 0 || forwardRate <= 0) {
        throw new Error('Rates must be positive');
    }
    if (holdingPeriod <= 0) {
        throw new Error('Holding period must be positive');
    }
    const periodReturn = (forwardRate - spotRate) / spotRate;
    const annualizationFactor = 365 / holdingPeriod;
    return periodReturn * annualizationFactor;
}
/**
 * Rank currency pairs by carry trade attractiveness
 *
 * @param pairs - Array of carry trade specifications
 * @param riskAdjust - Whether to adjust for volatility (Sharpe-like ranking)
 * @param volatilities - Volatilities for risk adjustment (if riskAdjust = true)
 * @returns Ranked carry trades
 *
 * @example
 * ```typescript
 * const ranked = rankCurrencyCarry(carryTrades, true, [0.08, 0.12, 0.10]);
 * // Returns carry trades ranked by risk-adjusted returns
 * ```
 */
function rankCurrencyCarry(pairs, riskAdjust = false, volatilities) {
    if (riskAdjust && (!volatilities || volatilities.length !== pairs.length)) {
        throw new Error('Volatilities required for risk adjustment');
    }
    const scored = pairs.map((trade, index) => {
        const carry = trade.targetRate - trade.fundingRate;
        let score = carry;
        if (riskAdjust && volatilities) {
            score = carry / volatilities[index]; // Sharpe-like ratio
        }
        return { trade, score, rank: 0 };
    });
    // Sort by score (descending)
    scored.sort((a, b) => b.score - a.score);
    // Assign ranks
    scored.forEach((item, index) => {
        item.rank = index + 1;
    });
    return scored;
}
// ============================================================================
// REAL-TIME RATE AGGREGATION (4 functions)
// ============================================================================
/**
 * Aggregate FX rates from multiple sources
 *
 * @param sources - Array of rate sources
 * @param method - Aggregation method ('mean', 'median', 'vwap', 'best')
 * @returns Aggregated rate
 *
 * @example
 * ```typescript
 * const aggregated = aggregateFXRatesMultiSource(sources, 'median');
 * // Returns median rate across all sources
 * ```
 */
function aggregateFXRatesMultiSource(sources, method = 'mean') {
    if (sources.length === 0) {
        throw new Error('Sources array cannot be empty');
    }
    const rates = sources.map(s => s.quote.mid);
    switch (method) {
        case 'mean': {
            return rates.reduce((a, b) => a + b, 0) / rates.length;
        }
        case 'median': {
            const sorted = [...rates].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];
        }
        case 'vwap': {
            // Weight by liquidity depth
            let totalValue = 0;
            let totalLiquidity = 0;
            for (const source of sources) {
                const liquidity = source.quote.liquidityDepth || 1;
                totalValue += source.quote.mid * liquidity;
                totalLiquidity += liquidity;
            }
            return totalLiquidity > 0 ? totalValue / totalLiquidity : rates[0];
        }
        case 'best': {
            // Best = highest reliability, lowest latency, tightest spread
            let bestSource = sources[0];
            let bestScore = -Infinity;
            for (const source of sources) {
                const score = source.reliability * 0.5 +
                    (1 / (1 + source.latency / 100)) * 0.3 +
                    (1 / (1 + source.quote.spread)) * 0.2;
                if (score > bestScore) {
                    bestScore = score;
                    bestSource = source;
                }
            }
            return bestSource.quote.mid;
        }
        default:
            throw new Error(`Unknown aggregation method: ${method}`);
    }
}
/**
 * Calculate VWAP from real-time rate stream
 *
 * @param quotes - Array of quotes with volumes
 * @param volumes - Corresponding volumes
 * @param startTime - Start of VWAP period
 * @param endTime - End of VWAP period
 * @returns VWAP over specified period
 *
 * @example
 * ```typescript
 * const vwap = calculateFXRateVWAP(quotes, volumes, startTime, endTime);
 * ```
 */
function calculateFXRateVWAP(quotes, volumes, startTime, endTime) {
    if (quotes.length !== volumes.length) {
        throw new Error('Quotes and volumes must have same length');
    }
    const filtered = quotes
        .map((q, i) => ({ quote: q, volume: volumes[i] }))
        .filter(item => item.quote.timestamp >= startTime && item.quote.timestamp <= endTime);
    if (filtered.length === 0) {
        throw new Error('No quotes in specified time range');
    }
    let totalValue = 0;
    let totalVolume = 0;
    for (const item of filtered) {
        totalValue += item.quote.mid * item.volume;
        totalVolume += item.volume;
    }
    if (totalVolume === 0) {
        throw new Error('Total volume is zero');
    }
    return totalValue / totalVolume;
}
/**
 * Calculate TWAP from real-time rate stream
 *
 * @param quotes - Array of quotes
 * @param startTime - Start of TWAP period
 * @param endTime - End of TWAP period
 * @param samplingInterval - Sampling interval in milliseconds (optional)
 * @returns TWAP over specified period
 *
 * @example
 * ```typescript
 * const twap = calculateFXRateTWAP(quotes, startTime, endTime, 1000);
 * // Returns TWAP with 1-second sampling
 * ```
 */
function calculateFXRateTWAP(quotes, startTime, endTime, samplingInterval) {
    return calculateFXSpotTWAP(quotes, startTime, endTime);
}
/**
 * Select best FX execution source
 *
 * @param sources - Available rate sources
 * @param side - Trade side ('buy' or 'sell')
 * @param size - Order size
 * @param preferences - Execution preferences
 * @returns Best execution source with score
 *
 * @example
 * ```typescript
 * const best = selectBestFXExecution(sources, 'buy', 1000000, {
 *   prioritizePrice: 0.5,
 *   prioritizeLiquidity: 0.3,
 *   prioritizeSpeed: 0.2
 * });
 * ```
 */
function selectBestFXExecution(sources, side, size, preferences = { prioritizePrice: 0.5, prioritizeLiquidity: 0.3, prioritizeSpeed: 0.2 }) {
    if (sources.length === 0) {
        throw new Error('Sources array cannot be empty');
    }
    const weights = preferences;
    const totalWeight = weights.prioritizePrice + weights.prioritizeLiquidity + weights.prioritizeSpeed;
    if (Math.abs(totalWeight - 1.0) > 0.001) {
        throw new Error('Preference weights must sum to 1.0');
    }
    let bestSource = sources[0];
    let bestScore = -Infinity;
    for (const source of sources) {
        const price = side === 'buy' ? source.quote.ask : source.quote.bid;
        // Normalize scores (0-1)
        const priceScore = side === 'buy'
            ? 1 / price // Lower price is better for buy
            : price; // Higher price is better for sell
        const liquidityScore = source.quote.liquidityDepth
            ? Math.min(source.quote.liquidityDepth / size, 1.0)
            : 0.5;
        const speedScore = 1 / (1 + source.latency / 100);
        const score = priceScore * weights.prioritizePrice +
            liquidityScore * weights.prioritizeLiquidity +
            speedScore * weights.prioritizeSpeed;
        if (score > bestScore) {
            bestScore = score;
            bestSource = source;
        }
    }
    return { source: bestSource, score: bestScore };
}
//# sourceMappingURL=fx-currency-trading-kit.js.map