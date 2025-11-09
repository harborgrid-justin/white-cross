"use strict";
/**
 * LOC: LIQANALYSIS-LQ8C9A
 * File: /reuse/trading/liquidity-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - decimal.js (arbitrary precision mathematics)
 *
 * DOWNSTREAM (imported by):
 *   - Trading analytics services
 *   - Market microstructure analysis modules
 *   - Risk management systems
 *   - Algorithmic trading engines
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBidAskSpread = calculateBidAskSpread;
exports.calculateRelativeSpread = calculateRelativeSpread;
exports.calculatePercentageSpread = calculatePercentageSpread;
exports.calculateQuotedSpread = calculateQuotedSpread;
exports.calculateEffectiveSpread = calculateEffectiveSpread;
exports.calculateRealizedSpread = calculateRealizedSpread;
exports.calculatePriceImpactSpread = calculatePriceImpactSpread;
exports.measureMarketDepth = measureMarketDepth;
exports.measureBidDepth = measureBidDepth;
exports.measureAskDepth = measureAskDepth;
exports.calculateOrderBookImbalance = calculateOrderBookImbalance;
exports.calculateVWAP = calculateVWAP;
exports.calculateTWAP = calculateTWAP;
exports.calculateTurnoverRatio = calculateTurnoverRatio;
exports.calculateAmihudIlliquidity = calculateAmihudIlliquidity;
exports.calculateRollSpread = calculateRollSpread;
exports.calculateKyleLambda = calculateKyleLambda;
exports.calculatePastorStambaughLiquidity = calculatePastorStambaughLiquidity;
exports.calculateCorwinSchultzSpread = calculateCorwinSchultzSpread;
exports.calculateInformationShare = calculateInformationShare;
exports.calculateLiquidityAdjustedVaR = calculateLiquidityAdjustedVaR;
exports.calculateLiquidityCoverageRatio = calculateLiquidityCoverageRatio;
exports.calculateNetStableFundingRatio = calculateNetStableFundingRatio;
exports.calculateHuiHeubelRatio = calculateHuiHeubelRatio;
exports.calculateEffectiveTick = calculateEffectiveTick;
exports.calculateRelativeSpreadMeasure = calculateRelativeSpreadMeasure;
exports.calculateVolumeStatistics = calculateVolumeStatistics;
exports.calculateVolumeProfile = calculateVolumeProfile;
exports.calculateShareTurnoverRate = calculateShareTurnoverRate;
exports.measureVolumeVolatility = measureVolumeVolatility;
exports.detectUnusualVolume = detectUnusualVolume;
exports.calculateRelativeVolume = calculateRelativeVolume;
exports.calculateDollarVolume = calculateDollarVolume;
exports.calculateVolumeWeightedLiquidityScore = calculateVolumeWeightedLiquidityScore;
exports.estimateTemporaryPriceImpact = estimateTemporaryPriceImpact;
exports.estimatePermanentPriceImpact = estimatePermanentPriceImpact;
exports.calculateSquareRootPriceImpact = calculateSquareRootPriceImpact;
exports.calculateLinearPriceImpact = calculateLinearPriceImpact;
exports.calculateMarketImpactCost = calculateMarketImpactCost;
exports.estimateSlippage = estimateSlippage;
exports.calculateImplementationShortfall = calculateImplementationShortfall;
exports.calculateAlmgrenChrissTrajectory = calculateAlmgrenChrissTrajectory;
exports.detectUShapedPattern = detectUShapedPattern;
exports.analyzeAuctionLiquidity = analyzeAuctionLiquidity;
exports.detectLunchHourDip = detectLunchHourDip;
exports.analyzeSeasonalLiquidity = analyzeSeasonalLiquidity;
exports.calculateTimeOfDayLiquidityScore = calculateTimeOfDayLiquidityScore;
exports.calculateLiquidityCorrelation = calculateLiquidityCorrelation;
exports.measureLiquiditySpillover = measureLiquiditySpillover;
exports.calculateCommonalityInLiquidity = calculateCommonalityInLiquidity;
exports.detectFlightToLiquidity = detectFlightToLiquidity;
exports.calculateLiquidityRiskPremium = calculateLiquidityRiskPremium;
exports.calculateLiquidityAtRisk = calculateLiquidityAtRisk;
exports.assessFundingLiquidityRisk = assessFundingLiquidityRisk;
exports.assessMarketLiquidityRisk = assessMarketLiquidityRisk;
exports.performLiquidityStressTest = performLiquidityStressTest;
exports.analyzeLiquidityGap = analyzeLiquidityGap;
/**
 * File: /reuse/trading/liquidity-analysis-kit.ts
 * Locator: WC-TRADING-LIQUIDITY-001
 * Purpose: Bloomberg Terminal-Level Liquidity Analytics - Market microstructure, liquidity risk, trading cost analysis
 *
 * Upstream: Independent trading analytics module
 * Downstream: ../backend/*, Trading controllers, Risk services, Market data processors
 * Dependencies: TypeScript 5.x, Node 18+, Decimal.js
 * Exports: 53 utility functions for liquidity analysis, spread calculation, market depth, volume analytics, price impact, intraday patterns
 *
 * LLM Context: Institutional-grade liquidity analytics competing with Bloomberg Terminal (LIQUID, VWAP, TWAP functions).
 * Provides comprehensive market microstructure analysis including bid-ask spreads, market depth measurement,
 * academic liquidity measures (Amihud illiquidity ratio, Roll's spread estimator, Kyle's lambda),
 * volume and turnover analytics, price impact models, intraday liquidity patterns, cross-asset correlations,
 * and liquidity risk metrics. All calculations use arbitrary precision arithmetic for institutional accuracy.
 */
const decimal_js_1 = __importDefault(require("decimal.js"));
// ============================================================================
// BASIC LIQUIDITY METRICS
// ============================================================================
/**
 * Calculate absolute bid-ask spread
 * Bloomberg Equivalent: SPREAD <GO>
 *
 * @param quote - Market quote with bid and ask prices
 * @returns Absolute spread in price units
 * @throws Error if bid or ask price is invalid
 * @example
 * const spread = calculateBidAskSpread({ bidPrice: 99.50, askPrice: 99.55, ... });
 * // spread = 0.05
 */
function calculateBidAskSpread(quote) {
    if (quote.bidPrice <= 0 || quote.askPrice <= 0) {
        throw new Error('Bid and ask prices must be positive');
    }
    if (quote.askPrice < quote.bidPrice) {
        throw new Error('Ask price must be greater than or equal to bid price');
    }
    return new decimal_js_1.default(quote.askPrice).minus(quote.bidPrice);
}
/**
 * Calculate relative bid-ask spread (percentage of midpoint)
 * Bloomberg Equivalent: SPREAD_PCT <GO>
 *
 * Formula: RelativeSpread = (Ask - Bid) / Midpoint
 *
 * @param quote - Market quote with bid and ask prices
 * @returns Relative spread as decimal (e.g., 0.001 = 0.1%)
 * @throws Error if bid or ask price is invalid
 */
function calculateRelativeSpread(quote) {
    const spread = calculateBidAskSpread(quote);
    const midpoint = new decimal_js_1.default(quote.bidPrice).plus(quote.askPrice).div(2);
    if (midpoint.isZero()) {
        throw new Error('Midpoint cannot be zero');
    }
    return spread.div(midpoint);
}
/**
 * Calculate percentage spread
 *
 * Formula: PercentageSpread = 100 * (Ask - Bid) / Midpoint
 *
 * @param quote - Market quote with bid and ask prices
 * @returns Percentage spread (e.g., 0.1 for 0.1%)
 */
function calculatePercentageSpread(quote) {
    return calculateRelativeSpread(quote).times(100);
}
/**
 * Calculate quoted spread (half-spread)
 *
 * Formula: QuotedSpread = (Ask - Bid) / 2
 *
 * @param quote - Market quote
 * @returns Half of the bid-ask spread
 */
function calculateQuotedSpread(quote) {
    return calculateBidAskSpread(quote).div(2);
}
/**
 * Calculate effective spread (actual trading cost)
 * Bloomberg Equivalent: EFFECTIVE_SPREAD <GO>
 *
 * Formula: EffectiveSpread = 2 * |Trade Price - Midpoint|
 *
 * @param trade - Trade execution data
 * @param quote - Market quote at trade time
 * @returns Effective spread in price units
 */
function calculateEffectiveSpread(trade, quote) {
    const midpoint = new decimal_js_1.default(quote.bidPrice).plus(quote.askPrice).div(2);
    const deviation = new decimal_js_1.default(trade.price).minus(midpoint).abs();
    return deviation.times(2);
}
/**
 * Calculate realized spread (revenue to liquidity provider)
 *
 * Formula: RealizedSpread = 2 * Direction * (Trade Price - Midpoint_t+δ)
 * where Direction = 1 for buy, -1 for sell
 *
 * @param trade - Trade execution data
 * @param quoteAtTrade - Quote at trade execution
 * @param quoteAfter - Quote after time interval δ
 * @returns Realized spread
 */
function calculateRealizedSpread(trade, quoteAtTrade, quoteAfter) {
    const direction = trade.side === 'buy' ? 1 : -1;
    const midpointAfter = new decimal_js_1.default(quoteAfter.bidPrice).plus(quoteAfter.askPrice).div(2);
    const tradePrice = new decimal_js_1.default(trade.price);
    return new decimal_js_1.default(direction).times(tradePrice.minus(midpointAfter)).times(2);
}
/**
 * Calculate price impact spread (permanent price movement)
 *
 * Formula: PriceImpact = 2 * Direction * (Midpoint_t+δ - Midpoint_t)
 *
 * @param trade - Trade execution
 * @param quoteBefore - Quote before trade
 * @param quoteAfter - Quote after trade
 * @returns Price impact in spread units
 */
function calculatePriceImpactSpread(trade, quoteBefore, quoteAfter) {
    const direction = trade.side === 'buy' ? 1 : -1;
    const midpointBefore = new decimal_js_1.default(quoteBefore.bidPrice).plus(quoteBefore.askPrice).div(2);
    const midpointAfter = new decimal_js_1.default(quoteAfter.bidPrice).plus(quoteAfter.askPrice).div(2);
    return new decimal_js_1.default(direction).times(midpointAfter.minus(midpointBefore)).times(2);
}
/**
 * Measure total market depth at best bid and ask
 * Bloomberg Equivalent: DEPTH <GO>
 *
 * @param quote - Market quote with bid and ask sizes
 * @returns Total depth (bid size + ask size)
 */
function measureMarketDepth(quote) {
    if (quote.bidSize < 0 || quote.askSize < 0) {
        throw new Error('Bid and ask sizes must be non-negative');
    }
    return new decimal_js_1.default(quote.bidSize).plus(quote.askSize);
}
/**
 * Measure bid-side market depth
 *
 * @param quote - Market quote
 * @returns Bid-side depth
 */
function measureBidDepth(quote) {
    if (quote.bidSize < 0) {
        throw new Error('Bid size must be non-negative');
    }
    return new decimal_js_1.default(quote.bidSize);
}
/**
 * Measure ask-side market depth
 *
 * @param quote - Market quote
 * @returns Ask-side depth
 */
function measureAskDepth(quote) {
    if (quote.askSize < 0) {
        throw new Error('Ask size must be non-negative');
    }
    return new decimal_js_1.default(quote.askSize);
}
/**
 * Calculate order book imbalance
 *
 * Formula: Imbalance = (BidSize - AskSize) / (BidSize + AskSize)
 * Range: [-1, 1] where 1 = all bids, -1 = all asks
 *
 * @param quote - Market quote
 * @returns Order book imbalance
 */
function calculateOrderBookImbalance(quote) {
    const bidSize = new decimal_js_1.default(quote.bidSize);
    const askSize = new decimal_js_1.default(quote.askSize);
    const totalSize = bidSize.plus(askSize);
    if (totalSize.isZero()) {
        return new decimal_js_1.default(0);
    }
    return bidSize.minus(askSize).div(totalSize);
}
/**
 * Calculate Volume-Weighted Average Price (VWAP)
 * Bloomberg Equivalent: VWAP <GO>
 *
 * Formula: VWAP = Σ(Price_i * Volume_i) / Σ(Volume_i)
 *
 * @param trades - Array of trade executions
 * @returns VWAP price
 * @throws Error if no trades or total volume is zero
 */
function calculateVWAP(trades) {
    if (trades.length === 0) {
        throw new Error('Cannot calculate VWAP with no trades');
    }
    let totalValue = new decimal_js_1.default(0);
    let totalVolume = new decimal_js_1.default(0);
    for (const trade of trades) {
        const value = new decimal_js_1.default(trade.price).times(trade.size);
        totalValue = totalValue.plus(value);
        totalVolume = totalVolume.plus(trade.size);
    }
    if (totalVolume.isZero()) {
        throw new Error('Total volume cannot be zero');
    }
    return totalValue.div(totalVolume);
}
/**
 * Calculate Time-Weighted Average Price (TWAP)
 * Bloomberg Equivalent: TWAP <GO>
 *
 * Formula: TWAP = Σ(Price_i) / N
 *
 * @param prices - Array of prices sampled at regular intervals
 * @returns TWAP price
 * @throws Error if no prices provided
 */
function calculateTWAP(prices) {
    if (prices.length === 0) {
        throw new Error('Cannot calculate TWAP with no prices');
    }
    let sum = new decimal_js_1.default(0);
    for (const price of prices) {
        sum = sum.plus(price);
    }
    return sum.div(prices.length);
}
/**
 * Calculate turnover ratio (trading activity relative to shares outstanding)
 * Bloomberg Equivalent: TURNOVER <GO>
 *
 * Formula: Turnover = Volume / SharesOutstanding
 *
 * @param volume - Trading volume
 * @param sharesOutstanding - Total shares outstanding
 * @returns Turnover ratio
 * @throws Error if shares outstanding is zero
 */
function calculateTurnoverRatio(volume, sharesOutstanding) {
    if (sharesOutstanding <= 0) {
        throw new Error('Shares outstanding must be positive');
    }
    return new decimal_js_1.default(volume).div(sharesOutstanding);
}
// ============================================================================
// ADVANCED LIQUIDITY MEASURES
// ============================================================================
/**
 * Calculate Amihud illiquidity ratio
 * Reference: Amihud, Y. (2002). "Illiquidity and stock returns"
 * Bloomberg Equivalent: AMIHUD <GO>
 *
 * Formula: ILLIQ = (1/N) * Σ(|Return_t| / DollarVolume_t)
 * Interpretation: Higher values indicate greater illiquidity
 *
 * @param bars - OHLCV bars with price and volume data
 * @returns Amihud illiquidity ratio (higher = less liquid)
 * @throws Error if insufficient data
 */
function calculateAmihudIlliquidity(bars) {
    if (bars.length < 2) {
        throw new Error('Need at least 2 bars to calculate Amihud ratio');
    }
    let sumIlliquidity = new decimal_js_1.default(0);
    for (let i = 1; i < bars.length; i++) {
        const prevClose = new decimal_js_1.default(bars[i - 1].close);
        const currentClose = new decimal_js_1.default(bars[i].close);
        const dollarVolume = new decimal_js_1.default(bars[i].close).times(bars[i].volume);
        if (dollarVolume.isZero() || prevClose.isZero()) {
            continue;
        }
        const returnPct = currentClose.minus(prevClose).div(prevClose).abs();
        const dailyIlliquidity = returnPct.div(dollarVolume);
        sumIlliquidity = sumIlliquidity.plus(dailyIlliquidity);
    }
    return sumIlliquidity.div(bars.length - 1);
}
/**
 * Calculate Roll's spread estimator (from serial covariance)
 * Reference: Roll, R. (1984). "A Simple Implicit Measure of the Effective Bid-Ask Spread"
 *
 * Formula: Spread = 2 * sqrt(-Cov(ΔP_t, ΔP_t-1))
 * where ΔP is the price change
 *
 * @param prices - Array of transaction prices
 * @returns Estimated effective spread (0 if covariance is positive)
 */
function calculateRollSpread(prices) {
    if (prices.length < 3) {
        throw new Error('Need at least 3 prices to calculate Roll spread');
    }
    const priceChanges = [];
    for (let i = 1; i < prices.length; i++) {
        priceChanges.push(new decimal_js_1.default(prices[i]).minus(prices[i - 1]));
    }
    // Calculate serial covariance
    let sumProduct = new decimal_js_1.default(0);
    for (let i = 1; i < priceChanges.length; i++) {
        sumProduct = sumProduct.plus(priceChanges[i].times(priceChanges[i - 1]));
    }
    const covariance = sumProduct.div(priceChanges.length - 1);
    // If covariance is positive, return 0 (model assumption violated)
    if (covariance.greaterThanOrEqualTo(0)) {
        return new decimal_js_1.default(0);
    }
    // Spread = 2 * sqrt(-covariance)
    return new decimal_js_1.default(2).times(covariance.neg().sqrt());
}
/**
 * Calculate Kyle's lambda (price impact coefficient)
 * Reference: Kyle, A. (1985). "Continuous Auctions and Insider Trading"
 *
 * Formula: λ = Cov(ΔP, Q) / Var(Q)
 * where ΔP is price change and Q is signed order flow
 *
 * @param trades - Array of trades with prices and signed quantities
 * @returns Kyle's lambda (price impact per unit volume)
 */
function calculateKyleLambda(trades) {
    if (trades.length < 2) {
        throw new Error('Need at least 2 trades to calculate Kyle lambda');
    }
    const priceChanges = [];
    const signedVolumes = [];
    for (let i = 1; i < trades.length; i++) {
        const priceChange = new decimal_js_1.default(trades[i].price).minus(trades[i - 1].price);
        const signedVolume = new decimal_js_1.default(trades[i].size).times(trades[i].side === 'buy' ? 1 : -1);
        priceChanges.push(priceChange);
        signedVolumes.push(signedVolume);
    }
    // Calculate means
    const meanPriceChange = priceChanges.reduce((sum, val) => sum.plus(val), new decimal_js_1.default(0)).div(priceChanges.length);
    const meanVolume = signedVolumes.reduce((sum, val) => sum.plus(val), new decimal_js_1.default(0)).div(signedVolumes.length);
    // Calculate covariance and variance
    let covariance = new decimal_js_1.default(0);
    let variance = new decimal_js_1.default(0);
    for (let i = 0; i < priceChanges.length; i++) {
        const priceDeviation = priceChanges[i].minus(meanPriceChange);
        const volumeDeviation = signedVolumes[i].minus(meanVolume);
        covariance = covariance.plus(priceDeviation.times(volumeDeviation));
        variance = variance.plus(volumeDeviation.pow(2));
    }
    if (variance.isZero()) {
        throw new Error('Volume variance is zero');
    }
    return covariance.div(variance);
}
/**
 * Calculate Pastor-Stambaugh liquidity measure
 * Reference: Pastor & Stambaugh (2003). "Liquidity Risk and Expected Stock Returns"
 *
 * Measures return reversal following high volume (price impact)
 *
 * @param bars - OHLCV bars
 * @returns Pastor-Stambaugh liquidity measure
 */
function calculatePastorStambaughLiquidity(bars) {
    if (bars.length < 3) {
        throw new Error('Need at least 3 bars for Pastor-Stambaugh measure');
    }
    const returns = [];
    const volumes = [];
    const signedVolumes = [];
    for (let i = 1; i < bars.length; i++) {
        const ret = new decimal_js_1.default(bars[i].close).div(bars[i - 1].close).minus(1);
        const vol = new decimal_js_1.default(bars[i].volume);
        const signedVol = ret.greaterThan(0) ? vol : vol.neg();
        returns.push(ret);
        volumes.push(vol);
        signedVolumes.push(signedVol);
    }
    // Regression of return[t+1] on volume[t] and return[t]
    // Simplified: correlation between future returns and current signed volume
    if (returns.length < 2) {
        return new decimal_js_1.default(0);
    }
    let sumProduct = new decimal_js_1.default(0);
    let sumVolumeSquared = new decimal_js_1.default(0);
    for (let i = 0; i < returns.length - 1; i++) {
        sumProduct = sumProduct.plus(returns[i + 1].times(signedVolumes[i]));
        sumVolumeSquared = sumVolumeSquared.plus(signedVolumes[i].pow(2));
    }
    if (sumVolumeSquared.isZero()) {
        return new decimal_js_1.default(0);
    }
    return sumProduct.div(sumVolumeSquared).neg(); // Negative sign: higher = more liquid
}
/**
 * Calculate Corwin-Schultz spread estimator (from high-low prices)
 * Reference: Corwin & Schultz (2012). "A Simple Way to Estimate Bid-Ask Spreads from Daily High and Low Prices"
 *
 * @param bars - OHLCV bars with high and low prices
 * @returns Estimated bid-ask spread
 */
function calculateCorwinSchultzSpread(bars) {
    if (bars.length < 2) {
        throw new Error('Need at least 2 bars for Corwin-Schultz spread');
    }
    let sumAlpha = new decimal_js_1.default(0);
    let count = 0;
    for (let i = 1; i < bars.length; i++) {
        const highLowRatio1 = new decimal_js_1.default(bars[i - 1].high).div(bars[i - 1].low);
        const highLowRatio2 = new decimal_js_1.default(bars[i].high).div(bars[i].low);
        if (highLowRatio1.lessThanOrEqualTo(0) || highLowRatio2.lessThanOrEqualTo(0)) {
            continue;
        }
        const beta = highLowRatio1.ln().pow(2).plus(highLowRatio2.ln().pow(2));
        const highHigh = decimal_js_1.default.max(bars[i - 1].high, bars[i].high);
        const lowLow = decimal_js_1.default.min(bars[i - 1].low, bars[i].low);
        const gamma = new decimal_js_1.default(highHigh).div(lowLow).ln().pow(2);
        const alpha = (new decimal_js_1.default(2).times(beta).minus(beta.sqrt()).minus(gamma.sqrt()))
            .div(new decimal_js_1.default(3).minus(new decimal_js_1.default(2).times(decimal_js_1.default.sqrt(2))));
        if (alpha.greaterThan(0)) {
            sumAlpha = sumAlpha.plus(alpha.sqrt());
            count++;
        }
    }
    if (count === 0) {
        return new decimal_js_1.default(0);
    }
    return new decimal_js_1.default(2).times(sumAlpha.div(count).exp().minus(1))
        .div(new decimal_js_1.default(1).plus(sumAlpha.div(count).exp()));
}
/**
 * Calculate Hasbrouck's information share
 * Measures a market's contribution to price discovery
 * Reference: Hasbrouck, J. (1995). "One Security, Many Markets"
 *
 * Simplified version using variance contribution
 *
 * @param marketReturns - Returns from this market
 * @param totalReturns - Returns from all markets combined
 * @returns Information share (0-1)
 */
function calculateInformationShare(marketReturns, totalReturns) {
    if (marketReturns.length !== totalReturns.length || marketReturns.length === 0) {
        throw new Error('Return arrays must have equal length and be non-empty');
    }
    const marketVariance = calculateVariance(marketReturns);
    const totalVariance = calculateVariance(totalReturns);
    if (totalVariance.isZero()) {
        return new decimal_js_1.default(0);
    }
    return marketVariance.div(totalVariance);
}
/**
 * Calculate Liquidity-Adjusted Value-at-Risk (L-VaR)
 * Incorporates liquidity risk into VaR calculation
 *
 * @param position - Position size
 * @param price - Current price
 * @param volatility - Price volatility (annualized)
 * @param spread - Bid-ask spread (as percentage)
 * @param confidenceLevel - Confidence level (e.g., 0.95 for 95%)
 * @returns Liquidity-adjusted VaR
 */
function calculateLiquidityAdjustedVaR(position, price, volatility, spread, confidenceLevel = 0.95) {
    // Z-score for confidence level (approximation for 95% and 99%)
    const zScore = confidenceLevel >= 0.99 ? 2.33 : 1.645;
    const positionValue = new decimal_js_1.default(position).times(price);
    const volatilityDaily = new decimal_js_1.default(volatility).div(decimal_js_1.default.sqrt(252)); // Assuming 252 trading days
    const marketRiskVaR = positionValue.times(volatilityDaily).times(zScore);
    // Liquidity cost: half-spread times position value
    const liquidityCost = positionValue.times(spread).div(2);
    return marketRiskVaR.plus(liquidityCost);
}
/**
 * Calculate Liquidity Coverage Ratio (LCR)
 * Basel III liquidity metric
 *
 * Formula: LCR = High Quality Liquid Assets / Net Cash Outflows (30 days)
 * Regulatory minimum: 100%
 *
 * @param highQualityLiquidAssets - HQLA amount
 * @param netCashOutflows30Days - Expected net cash outflows over 30 days
 * @returns LCR as percentage
 */
function calculateLiquidityCoverageRatio(highQualityLiquidAssets, netCashOutflows30Days) {
    if (netCashOutflows30Days <= 0) {
        throw new Error('Net cash outflows must be positive');
    }
    return new decimal_js_1.default(highQualityLiquidAssets).div(netCashOutflows30Days).times(100);
}
/**
 * Calculate Net Stable Funding Ratio (NSFR)
 * Basel III long-term structural liquidity metric
 *
 * Formula: NSFR = Available Stable Funding / Required Stable Funding
 * Regulatory minimum: 100%
 *
 * @param availableStableFunding - ASF amount
 * @param requiredStableFunding - RSF amount
 * @returns NSFR as percentage
 */
function calculateNetStableFundingRatio(availableStableFunding, requiredStableFunding) {
    if (requiredStableFunding <= 0) {
        throw new Error('Required stable funding must be positive');
    }
    return new decimal_js_1.default(availableStableFunding).div(requiredStableFunding).times(100);
}
/**
 * Calculate Hui-Heubel liquidity ratio
 * Reference: Hui & Heubel (1984)
 *
 * Formula: HHL = (High - Low) / (Volume / SharesOutstanding)
 * Lower values indicate higher liquidity
 *
 * @param bar - OHLCV bar
 * @param sharesOutstanding - Total shares outstanding
 * @returns Hui-Heubel ratio (lower = more liquid)
 */
function calculateHuiHeubelRatio(bar, sharesOutstanding) {
    const priceRange = new decimal_js_1.default(bar.high).minus(bar.low);
    const turnover = new decimal_js_1.default(bar.volume).div(sharesOutstanding);
    if (turnover.isZero()) {
        throw new Error('Turnover cannot be zero');
    }
    return priceRange.div(turnover);
}
/**
 * Calculate effective tick metric
 * Measures granularity of price quotes
 *
 * @param prices - Array of observed prices
 * @returns Effective tick size
 */
function calculateEffectiveTick(prices) {
    if (prices.length < 2) {
        throw new Error('Need at least 2 prices');
    }
    const uniquePrices = Array.from(new Set(prices)).sort((a, b) => a - b);
    if (uniquePrices.length < 2) {
        return new decimal_js_1.default(0);
    }
    let minDifference = new decimal_js_1.default(Number.MAX_VALUE);
    for (let i = 1; i < uniquePrices.length; i++) {
        const diff = new decimal_js_1.default(uniquePrices[i]).minus(uniquePrices[i - 1]);
        if (diff.greaterThan(0) && diff.lessThan(minDifference)) {
            minDifference = diff;
        }
    }
    return minDifference;
}
/**
 * Calculate relative spread measure (RSM)
 * Normalized spread for cross-asset comparison
 *
 * @param spread - Absolute spread
 * @param price - Asset price
 * @param volatility - Price volatility
 * @returns Relative spread measure
 */
function calculateRelativeSpreadMeasure(spread, price, volatility) {
    if (price <= 0) {
        throw new Error('Price must be positive');
    }
    if (volatility <= 0) {
        throw new Error('Volatility must be positive');
    }
    const relativeSpread = new decimal_js_1.default(spread).div(price);
    return relativeSpread.div(volatility);
}
// ============================================================================
// VOLUME & TURNOVER ANALYTICS
// ============================================================================
/**
 * Calculate volume statistics (mean, median, standard deviation)
 *
 * @param volumes - Array of volume data
 * @returns Volume statistics
 */
function calculateVolumeStatistics(volumes) {
    if (volumes.length === 0) {
        throw new Error('Need at least one volume data point');
    }
    const sorted = [...volumes].sort((a, b) => a - b);
    const mean = volumes.reduce((sum, v) => sum.plus(v), new decimal_js_1.default(0)).div(volumes.length);
    const median = sorted.length % 2 === 0
        ? new decimal_js_1.default(sorted[sorted.length / 2 - 1]).plus(sorted[sorted.length / 2]).div(2)
        : new decimal_js_1.default(sorted[Math.floor(sorted.length / 2)]);
    const variance = volumes
        .reduce((sum, v) => sum.plus(new decimal_js_1.default(v).minus(mean).pow(2)), new decimal_js_1.default(0))
        .div(volumes.length);
    const stdDev = variance.sqrt();
    return {
        mean,
        median,
        stdDev,
        min: new decimal_js_1.default(sorted[0]),
        max: new decimal_js_1.default(sorted[sorted.length - 1])
    };
}
/**
 * Calculate intraday volume profile
 * Bloomberg Equivalent: VOLUME_PROFILE <GO>
 *
 * @param bars - Intraday OHLCV bars
 * @returns Volume profile by time period
 */
function calculateVolumeProfile(bars) {
    const profile = new Map();
    for (const bar of bars) {
        const hour = bar.timestamp.getHours();
        const currentVolume = profile.get(hour) || new decimal_js_1.default(0);
        profile.set(hour, currentVolume.plus(bar.volume));
    }
    return profile;
}
/**
 * Calculate share turnover rate
 *
 * Formula: Turnover Rate = (Volume / Shares Outstanding) * 100
 *
 * @param volume - Trading volume
 * @param sharesOutstanding - Total shares outstanding
 * @returns Turnover rate as percentage
 */
function calculateShareTurnoverRate(volume, sharesOutstanding) {
    return calculateTurnoverRatio(volume, sharesOutstanding).times(100);
}
/**
 * Measure volume volatility
 *
 * @param volumes - Historical volume data
 * @returns Volume volatility (standard deviation / mean)
 */
function measureVolumeVolatility(volumes) {
    const stats = calculateVolumeStatistics(volumes);
    if (stats.mean.isZero()) {
        throw new Error('Mean volume cannot be zero');
    }
    return stats.stdDev.div(stats.mean);
}
/**
 * Detect unusual volume patterns
 * Identifies volume spikes beyond threshold
 *
 * @param currentVolume - Current period volume
 * @param historicalVolumes - Historical volume data
 * @param threshold - Number of standard deviations (default: 2)
 * @returns True if volume is unusual
 */
function detectUnusualVolume(currentVolume, historicalVolumes, threshold = 2) {
    const stats = calculateVolumeStatistics(historicalVolumes);
    const current = new decimal_js_1.default(currentVolume);
    const zScore = current.minus(stats.mean).div(stats.stdDev).abs();
    return zScore.greaterThan(threshold);
}
/**
 * Calculate relative volume (RVol)
 * Bloomberg Equivalent: RVOL <GO>
 *
 * Formula: RVol = Current Volume / Average Volume
 *
 * @param currentVolume - Current period volume
 * @param historicalVolumes - Historical volume data
 * @returns Relative volume ratio
 */
function calculateRelativeVolume(currentVolume, historicalVolumes) {
    const stats = calculateVolumeStatistics(historicalVolumes);
    if (stats.mean.isZero()) {
        throw new Error('Average volume cannot be zero');
    }
    return new decimal_js_1.default(currentVolume).div(stats.mean);
}
/**
 * Compute dollar volume
 *
 * @param volume - Share volume
 * @param price - Price per share
 * @returns Dollar volume
 */
function calculateDollarVolume(volume, price) {
    return new decimal_js_1.default(volume).times(price);
}
/**
 * Calculate volume-weighted liquidity score
 * Combines multiple liquidity metrics with volume weighting
 *
 * @param spread - Bid-ask spread
 * @param depth - Market depth
 * @param volume - Trading volume
 * @param weights - Weights for each component
 * @returns Composite liquidity score (higher = more liquid)
 */
function calculateVolumeWeightedLiquidityScore(spread, depth, volume, weights = { spread: 0.4, depth: 0.3, volume: 0.3 }) {
    // Normalize components (inverse spread for liquidity)
    const spreadScore = new decimal_js_1.default(1).div(new decimal_js_1.default(spread).plus(0.0001)); // Avoid division by zero
    const depthScore = new decimal_js_1.default(depth);
    const volumeScore = new decimal_js_1.default(volume);
    // Weighted combination
    const score = spreadScore.times(weights.spread)
        .plus(depthScore.times(weights.depth))
        .plus(volumeScore.times(weights.volume));
    return score;
}
// ============================================================================
// PRICE IMPACT ANALYSIS
// ============================================================================
/**
 * Estimate temporary price impact
 *
 * Formula: Temporary Impact = α * (Volume / ADV)^β
 * where ADV = Average Daily Volume
 *
 * @param tradeVolume - Trade size
 * @param averageDailyVolume - Average daily volume
 * @param alpha - Market impact coefficient (default: 0.1)
 * @param beta - Market impact exponent (default: 0.6)
 * @returns Temporary price impact as percentage
 */
function estimateTemporaryPriceImpact(tradeVolume, averageDailyVolume, alpha = 0.1, beta = 0.6) {
    if (averageDailyVolume <= 0) {
        throw new Error('Average daily volume must be positive');
    }
    const volumeRatio = new decimal_js_1.default(tradeVolume).div(averageDailyVolume);
    return new decimal_js_1.default(alpha).times(volumeRatio.pow(beta));
}
/**
 * Estimate permanent price impact
 *
 * Formula: Permanent Impact = γ * (Volume / ADV)
 *
 * @param tradeVolume - Trade size
 * @param averageDailyVolume - Average daily volume
 * @param gamma - Permanent impact coefficient (default: 0.05)
 * @returns Permanent price impact as percentage
 */
function estimatePermanentPriceImpact(tradeVolume, averageDailyVolume, gamma = 0.05) {
    if (averageDailyVolume <= 0) {
        throw new Error('Average daily volume must be positive');
    }
    const volumeRatio = new decimal_js_1.default(tradeVolume).div(averageDailyVolume);
    return new decimal_js_1.default(gamma).times(volumeRatio);
}
/**
 * Calculate square-root price impact model
 * Reference: Barra model, widely used in institutional trading
 *
 * Formula: Impact = σ * sqrt(Volume / ADV)
 * where σ is daily volatility
 *
 * @param tradeVolume - Trade size
 * @param averageDailyVolume - Average daily volume
 * @param dailyVolatility - Daily price volatility
 * @returns Price impact as percentage
 */
function calculateSquareRootPriceImpact(tradeVolume, averageDailyVolume, dailyVolatility) {
    if (averageDailyVolume <= 0) {
        throw new Error('Average daily volume must be positive');
    }
    const volumeRatio = new decimal_js_1.default(tradeVolume).div(averageDailyVolume);
    return new decimal_js_1.default(dailyVolatility).times(volumeRatio.sqrt());
}
/**
 * Calculate linear price impact model
 *
 * Formula: Impact = λ * Volume
 * where λ is Kyle's lambda
 *
 * @param tradeVolume - Trade size
 * @param kyleLambda - Price impact coefficient
 * @returns Price impact in price units
 */
function calculateLinearPriceImpact(tradeVolume, kyleLambda) {
    return new decimal_js_1.default(kyleLambda).times(tradeVolume);
}
/**
 * Calculate total market impact cost
 *
 * Includes both spread crossing and price impact
 *
 * @param tradeVolume - Trade size
 * @param price - Current price
 * @param spread - Bid-ask spread
 * @param temporaryImpact - Temporary price impact (%)
 * @param permanentImpact - Permanent price impact (%)
 * @returns Total market impact cost in currency units
 */
function calculateMarketImpactCost(tradeVolume, price, spread, temporaryImpact, permanentImpact) {
    const tradeValue = new decimal_js_1.default(tradeVolume).times(price);
    // Spread cost: half-spread times trade value
    const spreadCost = tradeValue.times(spread).div(2);
    // Temporary impact cost
    const tempCost = tradeValue.times(temporaryImpact);
    // Permanent impact cost
    const permCost = tradeValue.times(permanentImpact);
    return spreadCost.plus(tempCost).plus(permCost);
}
/**
 * Estimate slippage for market order
 *
 * @param orderSize - Order size
 * @param orderBook - Current order book
 * @param midPrice - Current mid price
 * @returns Estimated slippage as percentage
 */
function estimateSlippage(orderSize, orderBook, midPrice) {
    let remainingSize = orderSize;
    let totalCost = new decimal_js_1.default(0);
    // Use asks for buy orders
    const levels = [...orderBook.asks].sort((a, b) => a.price - b.price);
    for (const level of levels) {
        if (remainingSize <= 0)
            break;
        const fillSize = Math.min(remainingSize, level.size);
        totalCost = totalCost.plus(new decimal_js_1.default(fillSize).times(level.price));
        remainingSize -= fillSize;
    }
    if (remainingSize > 0) {
        throw new Error('Order size exceeds available liquidity');
    }
    const averageFillPrice = totalCost.div(orderSize);
    const slippage = averageFillPrice.minus(midPrice).div(midPrice).abs();
    return slippage;
}
/**
 * Calculate implementation shortfall
 * Bloomberg Equivalent: IS <GO>
 *
 * Formula: IS = (Execution Price - Decision Price) / Decision Price
 *
 * @param executionPrice - Actual execution price (VWAP)
 * @param decisionPrice - Price when decision was made
 * @param side - Trade side
 * @returns Implementation shortfall as percentage
 */
function calculateImplementationShortfall(executionPrice, decisionPrice, side) {
    const execution = new decimal_js_1.default(executionPrice);
    const decision = new decimal_js_1.default(decisionPrice);
    const shortfall = side === 'buy'
        ? execution.minus(decision).div(decision)
        : decision.minus(execution).div(decision);
    return shortfall;
}
/**
 * Calculate Almgren-Chriss optimal execution trajectory
 * Reference: Almgren & Chriss (2000). "Optimal Execution of Portfolio Transactions"
 *
 * Simplified version: linear trajectory
 *
 * @param totalVolume - Total volume to execute
 * @param timeHorizon - Execution time horizon (in periods)
 * @param riskAversion - Risk aversion parameter (0-1)
 * @returns Array of volume amounts to trade in each period
 */
function calculateAlmgrenChrissTrajectory(totalVolume, timeHorizon, riskAversion = 0.5) {
    if (timeHorizon <= 0) {
        throw new Error('Time horizon must be positive');
    }
    const trajectory = [];
    const volumePerPeriod = new decimal_js_1.default(totalVolume).div(timeHorizon);
    // Simplified linear trajectory (more sophisticated version uses exponential decay)
    for (let i = 0; i < timeHorizon; i++) {
        trajectory.push(volumePerPeriod);
    }
    return trajectory;
}
// ============================================================================
// INTRADAY LIQUIDITY PATTERNS
// ============================================================================
/**
 * Detect U-shaped intraday liquidity pattern
 * Higher liquidity at open/close, lower at midday
 *
 * @param quotes - Intraday quotes
 * @returns Intraday pattern analysis
 */
function detectUShapedPattern(quotes) {
    const hourlyData = new Map();
    for (const quote of quotes) {
        const hour = quote.timestamp.getHours();
        if (!hourlyData.has(hour)) {
            hourlyData.set(hour, { spreads: [], volumes: [] });
        }
        const data = hourlyData.get(hour);
        data.spreads.push(calculateRelativeSpread(quote));
        if (quote.lastSize !== undefined) {
            data.volumes.push(new decimal_js_1.default(quote.lastSize));
        }
    }
    const patterns = [];
    for (const [hour, data] of hourlyData) {
        const avgSpread = data.spreads.reduce((sum, s) => sum.plus(s), new decimal_js_1.default(0)).div(data.spreads.length);
        const avgVolume = data.volumes.length > 0
            ? data.volumes.reduce((sum, v) => sum.plus(v), new decimal_js_1.default(0)).div(data.volumes.length)
            : new decimal_js_1.default(0);
        // Lower spread = higher liquidity
        const isHighLiquidity = avgSpread.lessThan(0.001); // 0.1% threshold
        patterns.push({
            hourOfDay: hour,
            averageSpread: avgSpread,
            averageVolume: avgVolume,
            averageLiquidity: new decimal_js_1.default(1).div(avgSpread.plus(0.0001)), // Inverse spread
            isHighLiquidity
        });
    }
    return patterns.sort((a, b) => a.hourOfDay - b.hourOfDay);
}
/**
 * Analyze opening/closing auction liquidity
 *
 * @param openingQuotes - Quotes during opening auction
 * @param closingQuotes - Quotes during closing auction
 * @returns Auction liquidity comparison
 */
function analyzeAuctionLiquidity(openingQuotes, closingQuotes) {
    if (openingQuotes.length === 0 || closingQuotes.length === 0) {
        throw new Error('Need quotes for both opening and closing auctions');
    }
    const openingSpreads = openingQuotes.map(q => calculateRelativeSpread(q));
    const closingSpreads = closingQuotes.map(q => calculateRelativeSpread(q));
    const openingSpread = openingSpreads.reduce((sum, s) => sum.plus(s), new decimal_js_1.default(0)).div(openingSpreads.length);
    const closingSpread = closingSpreads.reduce((sum, s) => sum.plus(s), new decimal_js_1.default(0)).div(closingSpreads.length);
    const openingDepths = openingQuotes.map(q => measureMarketDepth(q));
    const closingDepths = closingQuotes.map(q => measureMarketDepth(q));
    const openingDepth = openingDepths.reduce((sum, d) => sum.plus(d), new decimal_js_1.default(0)).div(openingDepths.length);
    const closingDepth = closingDepths.reduce((sum, d) => sum.plus(d), new decimal_js_1.default(0)).div(closingDepths.length);
    // Lower spread = higher liquidity
    const spreadDiff = openingSpread.minus(closingSpread);
    const comparison = spreadDiff.abs().lessThan(0.0001)
        ? 'similar'
        : spreadDiff.greaterThan(0)
            ? 'closing_more_liquid'
            : 'opening_more_liquid';
    return {
        openingSpread,
        closingSpread,
        openingDepth,
        closingDepth,
        comparison
    };
}
/**
 * Detect lunch-hour liquidity dip
 * Common pattern: reduced liquidity during lunch hours
 *
 * @param quotes - Full day quotes
 * @param lunchHours - Array of lunch hour times (default: [12, 13])
 * @returns True if significant liquidity dip detected
 */
function detectLunchHourDip(quotes, lunchHours = [12, 13]) {
    const hourlyLiquidity = new Map();
    for (const quote of quotes) {
        const hour = quote.timestamp.getHours();
        if (!hourlyLiquidity.has(hour)) {
            hourlyLiquidity.set(hour, []);
        }
        // Liquidity = 1 / spread
        const spread = calculateRelativeSpread(quote);
        const liquidity = new decimal_js_1.default(1).div(spread.plus(0.0001));
        hourlyLiquidity.get(hour).push(liquidity);
    }
    // Calculate average liquidity for lunch hours vs. other hours
    let lunchLiquidity = new decimal_js_1.default(0);
    let lunchCount = 0;
    let otherLiquidity = new decimal_js_1.default(0);
    let otherCount = 0;
    for (const [hour, liquidities] of hourlyLiquidity) {
        const avgLiquidity = liquidities.reduce((sum, l) => sum.plus(l), new decimal_js_1.default(0)).div(liquidities.length);
        if (lunchHours.includes(hour)) {
            lunchLiquidity = lunchLiquidity.plus(avgLiquidity);
            lunchCount++;
        }
        else {
            otherLiquidity = otherLiquidity.plus(avgLiquidity);
            otherCount++;
        }
    }
    if (lunchCount === 0 || otherCount === 0) {
        return false;
    }
    const avgLunchLiquidity = lunchLiquidity.div(lunchCount);
    const avgOtherLiquidity = otherLiquidity.div(otherCount);
    // Dip detected if lunch liquidity is significantly lower (>20%)
    return avgLunchLiquidity.lessThan(avgOtherLiquidity.times(0.8));
}
/**
 * Analyze seasonal liquidity patterns
 * Detects day-of-week or month-of-year patterns
 *
 * @param quotes - Historical quotes with timestamps
 * @param groupBy - 'day' or 'month'
 * @returns Liquidity by period
 */
function analyzeSeasonalLiquidity(quotes, groupBy = 'day') {
    const periodLiquidity = new Map();
    for (const quote of quotes) {
        const period = groupBy === 'day'
            ? quote.timestamp.getDay() // 0 = Sunday, 6 = Saturday
            : quote.timestamp.getMonth(); // 0 = January, 11 = December
        if (!periodLiquidity.has(period)) {
            periodLiquidity.set(period, []);
        }
        const spread = calculateRelativeSpread(quote);
        const liquidity = new decimal_js_1.default(1).div(spread.plus(0.0001));
        periodLiquidity.get(period).push(liquidity);
    }
    const avgLiquidity = new Map();
    for (const [period, liquidities] of periodLiquidity) {
        const avg = liquidities.reduce((sum, l) => sum.plus(l), new decimal_js_1.default(0)).div(liquidities.length);
        avgLiquidity.set(period, avg);
    }
    return avgLiquidity;
}
/**
 * Calculate time-of-day liquidity score
 *
 * @param quote - Current quote
 * @param historicalPatterns - Historical intraday patterns
 * @returns Liquidity score relative to typical time-of-day (0-100)
 */
function calculateTimeOfDayLiquidityScore(quote, historicalPatterns) {
    const hour = quote.timestamp.getHours();
    const pattern = historicalPatterns.find(p => p.hourOfDay === hour);
    if (!pattern) {
        return new decimal_js_1.default(50); // Neutral score if no pattern data
    }
    const currentSpread = calculateRelativeSpread(quote);
    const currentLiquidity = new decimal_js_1.default(1).div(currentSpread.plus(0.0001));
    // Score: current liquidity relative to historical average
    // Higher score = better liquidity than usual
    const relativeScore = currentLiquidity.div(pattern.averageLiquidity.plus(0.0001)).times(50);
    // Cap at 100
    return decimal_js_1.default.min(relativeScore, 100);
}
// ============================================================================
// CROSS-ASSET ANALYTICS
// ============================================================================
/**
 * Calculate cross-asset liquidity correlation
 * Measures how liquidity moves together across assets
 *
 * @param asset1Spreads - Spread time series for asset 1
 * @param asset2Spreads - Spread time series for asset 2
 * @returns Correlation coefficient (-1 to 1)
 */
function calculateLiquidityCorrelation(asset1Spreads, asset2Spreads) {
    if (asset1Spreads.length !== asset2Spreads.length || asset1Spreads.length < 2) {
        throw new Error('Spread arrays must have equal length >= 2');
    }
    const n = asset1Spreads.length;
    const mean1 = asset1Spreads.reduce((sum, s) => sum + s, 0) / n;
    const mean2 = asset2Spreads.reduce((sum, s) => sum + s, 0) / n;
    let covariance = new decimal_js_1.default(0);
    let variance1 = new decimal_js_1.default(0);
    let variance2 = new decimal_js_1.default(0);
    for (let i = 0; i < n; i++) {
        const dev1 = new decimal_js_1.default(asset1Spreads[i]).minus(mean1);
        const dev2 = new decimal_js_1.default(asset2Spreads[i]).minus(mean2);
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
 * Measure liquidity spillover effects
 * How liquidity shocks in one asset affect another
 * Reference: Diebold & Yilmaz (2009) spillover index
 *
 * Simplified version using Granger-causality-style approach
 *
 * @param sourceSpreads - Spread changes in source asset
 * @param targetSpreads - Spread changes in target asset
 * @param lag - Number of periods to lag (default: 1)
 * @returns Spillover coefficient
 */
function measureLiquiditySpillover(sourceSpreads, targetSpreads, lag = 1) {
    if (sourceSpreads.length !== targetSpreads.length || sourceSpreads.length <= lag) {
        throw new Error(`Need at least ${lag + 1} observations`);
    }
    // Simple regression: targetSpread[t] ~ sourceSpread[t-lag]
    let sumXY = new decimal_js_1.default(0);
    let sumX2 = new decimal_js_1.default(0);
    for (let i = lag; i < sourceSpreads.length; i++) {
        const x = new decimal_js_1.default(sourceSpreads[i - lag]);
        const y = new decimal_js_1.default(targetSpreads[i]);
        sumXY = sumXY.plus(x.times(y));
        sumX2 = sumX2.plus(x.pow(2));
    }
    if (sumX2.isZero()) {
        return new decimal_js_1.default(0);
    }
    return sumXY.div(sumX2);
}
/**
 * Calculate commonality in liquidity
 * Reference: Chordia, Roll & Subrahmanyam (2000)
 *
 * Measures how much individual asset liquidity co-moves with market liquidity
 *
 * @param assetSpreads - Individual asset spread changes
 * @param marketSpreads - Market-wide average spread changes
 * @returns Commonality coefficient (R²)
 */
function calculateCommonalityInLiquidity(assetSpreads, marketSpreads) {
    const correlation = calculateLiquidityCorrelation(assetSpreads, marketSpreads);
    return correlation.pow(2); // R² = correlation²
}
/**
 * Detect flight-to-liquidity events
 * Identifies periods when investors flee to more liquid assets
 *
 * @param liquidAssetVolume - Volume in liquid assets
 * @param illiquidAssetVolume - Volume in illiquid assets
 * @param threshold - Z-score threshold for detection (default: 2)
 * @returns True if flight-to-liquidity detected
 */
function detectFlightToLiquidity(liquidAssetVolume, illiquidAssetVolume, threshold = 2) {
    if (liquidAssetVolume.length !== illiquidAssetVolume.length || liquidAssetVolume.length < 2) {
        throw new Error('Volume arrays must have equal length >= 2');
    }
    // Calculate volume ratios
    const ratios = [];
    for (let i = 0; i < liquidAssetVolume.length; i++) {
        if (illiquidAssetVolume[i] === 0)
            continue;
        ratios.push(liquidAssetVolume[i] / illiquidAssetVolume[i]);
    }
    if (ratios.length < 2) {
        return false;
    }
    const stats = calculateVolumeStatistics(ratios);
    const currentRatio = ratios[ratios.length - 1];
    const zScore = new decimal_js_1.default(currentRatio).minus(stats.mean).div(stats.stdDev).abs();
    return zScore.greaterThan(threshold);
}
// ============================================================================
// LIQUIDITY RISK METRICS
// ============================================================================
/**
 * Calculate liquidity risk premium
 * Expected return premium for holding illiquid assets
 *
 * @param assetReturn - Asset return
 * @param riskFreeRate - Risk-free rate
 * @param liquidityMeasure - Illiquidity measure (e.g., Amihud ratio)
 * @param marketRiskPremium - Market risk premium
 * @returns Liquidity risk premium
 */
function calculateLiquidityRiskPremium(assetReturn, riskFreeRate, liquidityMeasure, marketRiskPremium) {
    const excessReturn = new decimal_js_1.default(assetReturn).minus(riskFreeRate);
    const marketPremium = new decimal_js_1.default(marketRiskPremium);
    const liquidityPremium = excessReturn.minus(marketPremium);
    return liquidityPremium;
}
/**
 * Calculate Liquidity-at-Risk (LaR)
 * Probability that liquidity will fall below threshold
 *
 * @param currentLiquidity - Current liquidity level
 * @param liquidityVolatility - Liquidity volatility
 * @param confidenceLevel - Confidence level (e.g., 0.95)
 * @returns Minimum expected liquidity at confidence level
 */
function calculateLiquidityAtRisk(currentLiquidity, liquidityVolatility, confidenceLevel = 0.95) {
    const zScore = confidenceLevel >= 0.99 ? 2.33 : 1.645;
    const liquidity = new decimal_js_1.default(currentLiquidity);
    const volatility = new decimal_js_1.default(liquidityVolatility);
    return liquidity.minus(volatility.times(zScore));
}
/**
 * Assess funding liquidity risk
 * Risk of not being able to meet payment obligations
 *
 * @param cashReserves - Available cash reserves
 * @param expectedOutflows - Expected cash outflows
 * @param contingentLiabilities - Contingent liabilities
 * @returns Funding risk score (0-100, higher = more risk)
 */
function assessFundingLiquidityRisk(cashReserves, expectedOutflows, contingentLiabilities) {
    const reserves = new decimal_js_1.default(cashReserves);
    const outflows = new decimal_js_1.default(expectedOutflows);
    const contingent = new decimal_js_1.default(contingentLiabilities);
    const totalObligations = outflows.plus(contingent);
    if (totalObligations.isZero()) {
        return new decimal_js_1.default(0);
    }
    const coverage = reserves.div(totalObligations);
    // Convert coverage to risk score (inverse relationship)
    // Coverage < 1 = high risk (100), Coverage > 2 = low risk (0)
    if (coverage.lessThan(1)) {
        return new decimal_js_1.default(100);
    }
    else if (coverage.greaterThan(2)) {
        return new decimal_js_1.default(0);
    }
    else {
        return new decimal_js_1.default(100).times(new decimal_js_1.default(2).minus(coverage));
    }
}
/**
 * Assess market liquidity risk
 * Risk of adverse price movement when unwinding positions
 *
 * @param positionSize - Size of position
 * @param averageDailyVolume - Average daily trading volume
 * @param volatility - Price volatility
 * @returns Market liquidity risk score (0-100)
 */
function assessMarketLiquidityRisk(positionSize, averageDailyVolume, volatility) {
    const size = new decimal_js_1.default(positionSize);
    const adv = new decimal_js_1.default(averageDailyVolume);
    const vol = new decimal_js_1.default(volatility);
    // Position as % of ADV
    const positionRatio = size.div(adv.plus(1)); // Avoid division by zero
    // Risk increases with position size and volatility
    const baseRisk = positionRatio.times(100);
    const volatilityAdjustment = vol.times(100);
    const totalRisk = baseRisk.plus(volatilityAdjustment);
    return decimal_js_1.default.min(totalRisk, 100);
}
/**
 * Perform liquidity stress test
 * Simulates liquidity under adverse scenarios
 *
 * @param currentLiquidity - Current liquidity metrics
 * @param stressScenario - Stress scenario parameters
 * @returns Stressed liquidity metrics
 */
function performLiquidityStressTest(currentLiquidity, stressScenario) {
    const stressedSpread = currentLiquidity.spread.times(new decimal_js_1.default(1).plus(stressScenario.spreadIncrease));
    const stressedDepth = currentLiquidity.depth.times(new decimal_js_1.default(1).minus(stressScenario.depthDecrease));
    const stressedTurnover = currentLiquidity.turnover.times(new decimal_js_1.default(1).minus(stressScenario.turnoverDecrease));
    return {
        spread: stressedSpread,
        relativeSpread: currentLiquidity.relativeSpread.times(new decimal_js_1.default(1).plus(stressScenario.spreadIncrease)),
        depth: stressedDepth,
        turnover: stressedTurnover,
        timestamp: new Date()
    };
}
/**
 * Analyze liquidity gap
 * Difference between liquidity needs and available liquidity
 *
 * @param requiredLiquidity - Liquidity needed for operations
 * @param availableLiquidity - Current available liquidity
 * @param timeHorizon - Time horizon in days
 * @returns Liquidity gap analysis
 */
function analyzeLiquidityGap(requiredLiquidity, availableLiquidity, timeHorizon) {
    const required = new decimal_js_1.default(requiredLiquidity);
    const available = new decimal_js_1.default(availableLiquidity);
    const gap = required.minus(available);
    const gapRatio = gap.div(required.plus(0.0001)); // Avoid division by zero
    const isAdequate = gap.lessThanOrEqualTo(0);
    let daysToShortfall = null;
    if (!isAdequate && timeHorizon > 0) {
        const dailyBurn = gap.div(timeHorizon);
        daysToShortfall = available.div(dailyBurn.plus(0.0001));
    }
    return {
        gap,
        gapRatio,
        isAdequate,
        daysToShortfall
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculate variance helper function
 *
 * @param values - Array of values
 * @returns Variance
 */
function calculateVariance(values) {
    if (values.length === 0) {
        return new decimal_js_1.default(0);
    }
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values
        .reduce((sum, v) => sum.plus(new decimal_js_1.default(v).minus(mean).pow(2)), new decimal_js_1.default(0))
        .div(values.length);
    return variance;
}
//# sourceMappingURL=liquidity-analysis-kit.js.map