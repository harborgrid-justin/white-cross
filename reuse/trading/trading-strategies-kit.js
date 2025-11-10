"use strict";
/**
 * LOC: TRD-STRAT-001
 * File: /reuse/trading/trading-strategies-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Op)
 *   - decimal.js (Decimal for precise calculations)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/strategies/*
 *   - backend/controllers/trading-strategy.controller.ts
 *   - backend/services/strategy-execution.service.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVolatility = exports.createScore = exports.createPercentage = exports.createVolume = exports.createQuantity = exports.createPrice = void 0;
exports.calculateRSI = calculateRSI;
exports.calculateMACD = calculateMACD;
exports.generateMomentumSignal = generateMomentumSignal;
exports.calculateSMA = calculateSMA;
exports.calculateEMA = calculateEMA;
exports.calculateWMA = calculateWMA;
exports.generateMovingAverageCrossoverSignal = generateMovingAverageCrossoverSignal;
exports.calculateROC = calculateROC;
exports.calculateStochastic = calculateStochastic;
exports.calculateBollingerBands = calculateBollingerBands;
exports.generateBollingerBandSignal = generateBollingerBandSignal;
exports.calculateZScore = calculateZScore;
exports.calculateCorrelation = calculateCorrelation;
exports.generatePairsTradingSignal = generatePairsTradingSignal;
exports.calculateCointegration = calculateCointegration;
exports.detectPriceBreakout = detectPriceBreakout;
exports.detectVolumeBreakout = detectVolumeBreakout;
exports.calculateDonchianChannels = calculateDonchianChannels;
exports.generateDonchianBreakoutSignal = generateDonchianBreakoutSignal;
exports.calculateADX = calculateADX;
exports.calculateSupertrend = calculateSupertrend;
exports.generateTrendFollowingSignal = generateTrendFollowingSignal;
exports.detectStatisticalArbitrage = detectStatisticalArbitrage;
exports.calculateTriangularArbitrage = calculateTriangularArbitrage;
exports.analyzeMergerArbitrage = analyzeMergerArbitrage;
exports.createCoveredCallStrategy = createCoveredCallStrategy;
exports.createProtectivePutStrategy = createProtectivePutStrategy;
exports.createCollarStrategy = createCollarStrategy;
exports.createStraddleStrategy = createStraddleStrategy;
exports.createStrangleStrategy = createStrangleStrategy;
exports.createIronCondorStrategy = createIronCondorStrategy;
exports.createButterflyStrategy = createButterflyStrategy;
exports.backtestStrategy = backtestStrategy;
exports.calculatePerformanceMetrics = calculatePerformanceMetrics;
const decimal_js_1 = __importDefault(require("decimal.js"));
const createPrice = (value) => new decimal_js_1.default(value);
exports.createPrice = createPrice;
const createQuantity = (value) => new decimal_js_1.default(value);
exports.createQuantity = createQuantity;
const createVolume = (value) => new decimal_js_1.default(value);
exports.createVolume = createVolume;
const createPercentage = (value) => new decimal_js_1.default(value);
exports.createPercentage = createPercentage;
const createScore = (value) => new decimal_js_1.default(value);
exports.createScore = createScore;
const createVolatility = (value) => new decimal_js_1.default(value);
exports.createVolatility = createVolatility;
// ============================================================================
// MOMENTUM STRATEGIES
// ============================================================================
/**
 * Calculate Relative Strength Index (RSI) for momentum analysis
 * @param prices - Array of price data points
 * @param period - Lookback period (typically 14)
 * @returns RSI indicator with overbought/oversold signals
 *
 * @example
 * const prices = historicalPrices.map(p => p.close);
 * const rsi = calculateRSI(prices, 14);
 * if (rsi.isOversold) {
 *   // Consider buying opportunity
 * }
 */
function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) {
        throw new Error(`Insufficient data: need at least ${period + 1} prices`);
    }
    const gains = [];
    const losses = [];
    for (let i = 1; i < prices.length; i++) {
        const change = prices[i].minus(prices[i - 1]);
        gains.push(change.greaterThan(0) ? change : new decimal_js_1.default(0));
        losses.push(change.lessThan(0) ? change.abs() : new decimal_js_1.default(0));
    }
    const avgGain = gains.slice(0, period).reduce((a, b) => a.plus(b), new decimal_js_1.default(0)).div(period);
    const avgLoss = losses.slice(0, period).reduce((a, b) => a.plus(b), new decimal_js_1.default(0)).div(period);
    let currentAvgGain = avgGain;
    let currentAvgLoss = avgLoss;
    for (let i = period; i < gains.length; i++) {
        currentAvgGain = currentAvgGain.times(period - 1).plus(gains[i]).div(period);
        currentAvgLoss = currentAvgLoss.times(period - 1).plus(losses[i]).div(period);
    }
    const rs = currentAvgLoss.equals(0) ? new decimal_js_1.default(100) : currentAvgGain.div(currentAvgLoss);
    const rsi = new decimal_js_1.default(100).minus(new decimal_js_1.default(100).div(new decimal_js_1.default(1).plus(rs)));
    return {
        rsi: rsi,
        isOverbought: rsi.greaterThan(70),
        isOversold: rsi.lessThan(30),
    };
}
/**
 * Calculate MACD (Moving Average Convergence Divergence) for trend and momentum
 * @param prices - Array of closing prices
 * @param fastPeriod - Fast EMA period (typically 12)
 * @param slowPeriod - Slow EMA period (typically 26)
 * @param signalPeriod - Signal line period (typically 9)
 * @returns MACD indicator with histogram
 */
function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (prices.length < slowPeriod) {
        throw new Error(`Insufficient data: need at least ${slowPeriod} prices`);
    }
    const fastEMA = calculateEMA(prices, fastPeriod);
    const slowEMA = calculateEMA(prices, slowPeriod);
    const macdLine = fastEMA.minus(slowEMA);
    // Calculate signal line (EMA of MACD)
    const macdValues = [macdLine];
    const signalLine = calculateEMA(macdValues, signalPeriod);
    const histogram = macdLine.minus(signalLine);
    return {
        macd: macdLine,
        signal: signalLine,
        histogram,
    };
}
/**
 * Generate momentum-based trading signal using RSI and MACD
 * @param marketData - Historical market data
 * @param rsiPeriod - RSI period
 * @param macdFast - MACD fast period
 * @param macdSlow - MACD slow period
 * @param macdSignal - MACD signal period
 * @returns Trading signal based on momentum indicators
 */
function generateMomentumSignal(marketData, rsiPeriod = 14, macdFast = 12, macdSlow = 26, macdSignal = 9) {
    const prices = marketData.map(d => d.close);
    const rsi = calculateRSI(prices, rsiPeriod);
    const macd = calculateMACD(prices, macdFast, macdSlow, macdSignal);
    let signalType = 'HOLD';
    let strength = createScore(50);
    let confidence = createPercentage(50);
    // Strong buy: RSI oversold + MACD bullish crossover
    if (rsi.isOversold && macd.histogram.greaterThan(0) && macd.macd.greaterThan(macd.signal)) {
        signalType = 'STRONG_BUY';
        strength = createScore(90);
        confidence = createPercentage(85);
    }
    // Buy: RSI below 50 + MACD bullish
    else if (rsi.rsi.lessThan(50) && macd.macd.greaterThan(macd.signal)) {
        signalType = 'BUY';
        strength = createScore(70);
        confidence = createPercentage(70);
    }
    // Strong sell: RSI overbought + MACD bearish crossover
    else if (rsi.isOverbought && macd.histogram.lessThan(0) && macd.macd.lessThan(macd.signal)) {
        signalType = 'STRONG_SELL';
        strength = createScore(90);
        confidence = createPercentage(85);
    }
    // Sell: RSI above 50 + MACD bearish
    else if (rsi.rsi.greaterThan(50) && macd.macd.lessThan(macd.signal)) {
        signalType = 'SELL';
        strength = createScore(70);
        confidence = createPercentage(70);
    }
    const latestData = marketData[marketData.length - 1];
    return {
        signalId: `MOM-${Date.now()}`,
        strategyType: 'momentum',
        strategyName: 'RSI-MACD Momentum',
        instrumentId: latestData.instrumentId,
        symbol: latestData.symbol,
        signalType,
        strength,
        confidence,
        timestamp: new Date(),
        entryPrice: latestData.close,
        metadata: { rsi: rsi.rsi, macd: macd.macd, signal: macd.signal },
    };
}
/**
 * Calculate Simple Moving Average (SMA)
 * @param prices - Array of prices
 * @param period - Period for averaging
 * @returns SMA value
 */
function calculateSMA(prices, period) {
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} prices`);
    }
    const relevantPrices = prices.slice(-period);
    const sum = relevantPrices.reduce((acc, price) => acc.plus(price), new decimal_js_1.default(0));
    return sum.div(period);
}
/**
 * Calculate Exponential Moving Average (EMA)
 * @param prices - Array of prices
 * @param period - Period for averaging
 * @returns EMA value
 */
function calculateEMA(prices, period) {
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} prices`);
    }
    const multiplier = new decimal_js_1.default(2).div(period + 1);
    let ema = calculateSMA(prices.slice(0, period), period);
    for (let i = period; i < prices.length; i++) {
        ema = prices[i].minus(ema).times(multiplier).plus(ema);
    }
    return ema;
}
/**
 * Calculate Weighted Moving Average (WMA)
 * @param prices - Array of prices
 * @param period - Period for averaging
 * @returns WMA value
 */
function calculateWMA(prices, period) {
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} prices`);
    }
    const relevantPrices = prices.slice(-period);
    let numerator = new decimal_js_1.default(0);
    let denominator = new decimal_js_1.default(0);
    for (let i = 0; i < period; i++) {
        const weight = new decimal_js_1.default(i + 1);
        numerator = numerator.plus(relevantPrices[i].times(weight));
        denominator = denominator.plus(weight);
    }
    return numerator.div(denominator);
}
/**
 * Generate moving average crossover signal
 * @param prices - Historical prices
 * @param shortPeriod - Short MA period
 * @param longPeriod - Long MA period
 * @param maType - Type of moving average ('SMA' | 'EMA' | 'WMA')
 * @returns Trading signal based on crossover
 */
function generateMovingAverageCrossoverSignal(prices, shortPeriod = 50, longPeriod = 200, maType = 'EMA') {
    const calculateMA = maType === 'SMA' ? calculateSMA : maType === 'EMA' ? calculateEMA : calculateWMA;
    const shortMA = calculateMA(prices, shortPeriod);
    const longMA = calculateMA(prices, longPeriod);
    const prevShortMA = calculateMA(prices.slice(0, -1), shortPeriod);
    const prevLongMA = calculateMA(prices.slice(0, -1), longPeriod);
    // Golden cross: short MA crosses above long MA
    if (prevShortMA.lessThanOrEqualTo(prevLongMA) &&
        shortMA.greaterThan(longMA)) {
        return 'STRONG_BUY';
    }
    // Death cross: short MA crosses below long MA
    if (prevShortMA.greaterThanOrEqualTo(prevLongMA) &&
        shortMA.lessThan(longMA)) {
        return 'STRONG_SELL';
    }
    // Trending up: short MA above long MA
    if (shortMA.greaterThan(longMA)) {
        return 'BUY';
    }
    // Trending down: short MA below long MA
    if (shortMA.lessThan(longMA)) {
        return 'SELL';
    }
    return 'HOLD';
}
/**
 * Calculate Rate of Change (ROC) momentum indicator
 * @param prices - Array of prices
 * @param period - Lookback period
 * @returns ROC as percentage
 */
function calculateROC(prices, period) {
    if (prices.length < period + 1) {
        throw new Error(`Insufficient data: need at least ${period + 1} prices`);
    }
    const currentPrice = prices[prices.length - 1];
    const pastPrice = prices[prices.length - 1 - period];
    const roc = currentPrice.minus(pastPrice).div(pastPrice).times(100);
    return roc;
}
/**
 * Calculate Stochastic Oscillator for momentum
 * @param marketData - Array of OHLC data
 * @param period - Lookback period (typically 14)
 * @param smoothK - %K smoothing period
 * @param smoothD - %D smoothing period
 * @returns Stochastic oscillator values
 */
function calculateStochastic(marketData, period = 14, smoothK = 3, smoothD = 3) {
    if (marketData.length < period) {
        throw new Error(`Insufficient data: need at least ${period} data points`);
    }
    const recentData = marketData.slice(-period);
    const currentClose = marketData[marketData.length - 1].close;
    const lowestLow = recentData.reduce((min, d) => d.low.lessThan(min) ? d.low : min, recentData[0].low);
    const highestHigh = recentData.reduce((max, d) => d.high.greaterThan(max) ? d.high : max, recentData[0].high);
    const percentK = currentClose.minus(lowestLow).div(highestHigh.minus(lowestLow)).times(100);
    // In production, would smooth %K and calculate %D properly
    const percentD = percentK; // Simplified
    return {
        percentK: percentK,
        percentD: percentD,
        isOverbought: percentK.greaterThan(80),
        isOversold: percentK.lessThan(20),
    };
}
// ============================================================================
// MEAN REVERSION STRATEGIES
// ============================================================================
/**
 * Calculate Bollinger Bands for mean reversion analysis
 * @param prices - Array of closing prices
 * @param period - Period for SMA (typically 20)
 * @param stdDev - Number of standard deviations (typically 2)
 * @returns Bollinger Bands with upper, middle, lower bands
 */
function calculateBollingerBands(prices, period = 20, stdDev = 2) {
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} prices`);
    }
    const sma = calculateSMA(prices, period);
    const relevantPrices = prices.slice(-period);
    // Calculate standard deviation
    const squaredDiffs = relevantPrices.map(p => p.minus(sma).pow(2));
    const variance = squaredDiffs.reduce((sum, sq) => sum.plus(sq), new decimal_js_1.default(0)).div(period);
    const standardDeviation = variance.sqrt();
    const upper = sma.plus(standardDeviation.times(stdDev));
    const lower = sma.minus(standardDeviation.times(stdDev));
    const currentPrice = prices[prices.length - 1];
    const percentB = currentPrice.minus(lower).div(upper.minus(lower)).times(100);
    const bandwidth = upper.minus(lower).div(sma).times(100);
    return {
        upper: upper,
        middle: sma,
        lower: lower,
        bandwidth: bandwidth,
        percentB: percentB,
    };
}
/**
 * Generate mean reversion signal using Bollinger Bands
 * @param prices - Historical prices
 * @param period - Bollinger Band period
 * @param stdDev - Standard deviation multiplier
 * @returns Trading signal based on mean reversion
 */
function generateBollingerBandSignal(prices, period = 20, stdDev = 2) {
    const bb = calculateBollingerBands(prices, period, stdDev);
    const currentPrice = prices[prices.length - 1];
    let signalType = 'HOLD';
    let strength = createScore(50);
    let confidence = createPercentage(50);
    const percentB = bb.percentB;
    // Strong buy: Price touches or breaks lower band
    if (percentB.lessThanOrEqualTo(0)) {
        signalType = 'STRONG_BUY';
        strength = createScore(95);
        confidence = createPercentage(90);
    }
    // Buy: Price near lower band
    else if (percentB.lessThan(20)) {
        signalType = 'BUY';
        strength = createScore(75);
        confidence = createPercentage(75);
    }
    // Strong sell: Price touches or breaks upper band
    else if (percentB.greaterThanOrEqualTo(100)) {
        signalType = 'STRONG_SELL';
        strength = createScore(95);
        confidence = createPercentage(90);
    }
    // Sell: Price near upper band
    else if (percentB.greaterThan(80)) {
        signalType = 'SELL';
        strength = createScore(75);
        confidence = createPercentage(75);
    }
    return {
        signalId: `BB-${Date.now()}`,
        strategyType: 'mean_reversion',
        strategyName: 'Bollinger Band Mean Reversion',
        instrumentId: '',
        symbol: '',
        signalType,
        strength,
        confidence,
        timestamp: new Date(),
        entryPrice: currentPrice,
        targetPrice: bb.middle,
        metadata: { upper: bb.upper, middle: bb.middle, lower: bb.lower, percentB: bb.percentB },
    };
}
/**
 * Calculate Z-Score for mean reversion
 * @param prices - Array of prices
 * @param period - Lookback period
 * @returns Z-score indicating standard deviations from mean
 */
function calculateZScore(prices, period = 20) {
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} prices`);
    }
    const mean = calculateSMA(prices, period);
    const relevantPrices = prices.slice(-period);
    const squaredDiffs = relevantPrices.map(p => p.minus(mean).pow(2));
    const variance = squaredDiffs.reduce((sum, sq) => sum.plus(sq), new decimal_js_1.default(0)).div(period);
    const stdDev = variance.sqrt();
    const currentPrice = prices[prices.length - 1];
    const zScore = currentPrice.minus(mean).div(stdDev);
    return zScore;
}
/**
 * Calculate correlation coefficient for pairs trading
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @returns Correlation coefficient (-1 to 1)
 */
function calculateCorrelation(pricesA, pricesB) {
    if (pricesA.length !== pricesB.length || pricesA.length < 2) {
        throw new Error('Price arrays must be same length and have at least 2 data points');
    }
    const n = pricesA.length;
    const meanA = pricesA.reduce((sum, p) => sum.plus(p), new decimal_js_1.default(0)).div(n);
    const meanB = pricesB.reduce((sum, p) => sum.plus(p), new decimal_js_1.default(0)).div(n);
    let numerator = new decimal_js_1.default(0);
    let sumSqA = new decimal_js_1.default(0);
    let sumSqB = new decimal_js_1.default(0);
    for (let i = 0; i < n; i++) {
        const diffA = pricesA[i].minus(meanA);
        const diffB = pricesB[i].minus(meanB);
        numerator = numerator.plus(diffA.times(diffB));
        sumSqA = sumSqA.plus(diffA.pow(2));
        sumSqB = sumSqB.plus(diffB.pow(2));
    }
    const denominator = sumSqA.sqrt().times(sumSqB.sqrt());
    return denominator.equals(0) ? new decimal_js_1.default(0) : numerator.div(denominator);
}
/**
 * Generate pairs trading signal based on spread Z-score
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @param hedgeRatio - Hedge ratio for the pair
 * @param entryThreshold - Z-score threshold for entry (typically 2)
 * @param exitThreshold - Z-score threshold for exit (typically 0)
 * @returns Pairs trading signal
 */
function generatePairsTradingSignal(pricesA, pricesB, hedgeRatio, entryThreshold = 2, exitThreshold = 0) {
    // Calculate spread: A - (hedgeRatio * B)
    const spreads = pricesA.map((pA, i) => pA.minus(pricesB[i].times(hedgeRatio)));
    const zScore = calculateZScore(spreads, 20);
    let signalA = 'HOLD';
    let signalB = 'HOLD';
    // Spread is too high: Short A, Long B
    if (zScore.greaterThan(entryThreshold)) {
        signalA = 'SELL';
        signalB = 'BUY';
    }
    // Spread is too low: Long A, Short B
    else if (zScore.lessThan(-entryThreshold)) {
        signalA = 'BUY';
        signalB = 'SELL';
    }
    // Spread converged: Exit positions
    else if (zScore.abs().lessThan(exitThreshold)) {
        signalA = 'HOLD';
        signalB = 'HOLD';
    }
    return { signalA, signalB, spreadZScore: zScore };
}
/**
 * Calculate cointegration test for pairs trading
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @returns Hedge ratio and cointegration score
 */
function calculateCointegration(pricesA, pricesB) {
    if (pricesA.length !== pricesB.length || pricesA.length < 30) {
        throw new Error('Need at least 30 paired observations for cointegration test');
    }
    // Simple linear regression to find hedge ratio: A = beta * B + alpha
    const n = pricesA.length;
    const sumB = pricesB.reduce((sum, p) => sum.plus(p), new decimal_js_1.default(0));
    const sumA = pricesA.reduce((sum, p) => sum.plus(p), new decimal_js_1.default(0));
    const sumBB = pricesB.reduce((sum, p) => sum.plus(p.pow(2)), new decimal_js_1.default(0));
    const sumAB = pricesA.reduce((sum, pA, i) => sum.plus(pA.times(pricesB[i])), new decimal_js_1.default(0));
    const hedgeRatio = (new decimal_js_1.default(n).times(sumAB).minus(sumB.times(sumA)))
        .div(new decimal_js_1.default(n).times(sumBB).minus(sumB.pow(2)));
    // Calculate residuals
    const residuals = pricesA.map((pA, i) => pA.minus(pricesB[i].times(hedgeRatio)));
    // Simplified cointegration test (in production, use Augmented Dickey-Fuller test)
    const residualMean = residuals.reduce((sum, r) => sum.plus(r), new decimal_js_1.default(0)).div(n);
    const variance = residuals.reduce((sum, r) => sum.plus(r.minus(residualMean).pow(2)), new decimal_js_1.default(0)).div(n);
    const score = residualMean.div(variance.sqrt()).abs();
    return {
        hedgeRatio,
        score,
        isCointegrated: score.lessThan(0.05), // Simplified threshold
    };
}
// ============================================================================
// BREAKOUT STRATEGIES
// ============================================================================
/**
 * Detect price breakout from range
 * @param marketData - Historical OHLC data
 * @param lookbackPeriod - Period for range detection
 * @param volumeConfirmation - Require volume confirmation
 * @returns Breakout signal
 */
function detectPriceBreakout(marketData, lookbackPeriod = 20, volumeConfirmation = true) {
    if (marketData.length < lookbackPeriod + 1) {
        throw new Error(`Insufficient data: need at least ${lookbackPeriod + 1} data points`);
    }
    const historicalData = marketData.slice(-(lookbackPeriod + 1), -1);
    const currentData = marketData[marketData.length - 1];
    const rangeHigh = historicalData.reduce((max, d) => d.high.greaterThan(max) ? d.high : max, historicalData[0].high);
    const rangeLow = historicalData.reduce((min, d) => d.low.lessThan(min) ? d.low : min, historicalData[0].low);
    const avgVolume = historicalData.reduce((sum, d) => sum.plus(d.volume), new decimal_js_1.default(0))
        .div(lookbackPeriod);
    const volumeConfirmed = !volumeConfirmation ||
        currentData.volume.greaterThan(avgVolume.times(1.5));
    // Upward breakout
    if (currentData.close.greaterThan(rangeHigh) && volumeConfirmed) {
        return {
            signalId: `BREAKOUT-UP-${Date.now()}`,
            strategyType: 'breakout',
            strategyName: 'Price Breakout',
            instrumentId: currentData.instrumentId,
            symbol: currentData.symbol,
            signalType: 'STRONG_BUY',
            strength: createScore(90),
            confidence: createPercentage(85),
            timestamp: new Date(),
            entryPrice: currentData.close,
            stopLoss: rangeHigh,
            metadata: { rangeHigh, rangeLow, breakoutType: 'upward' },
        };
    }
    // Downward breakout
    if (currentData.close.lessThan(rangeLow) && volumeConfirmed) {
        return {
            signalId: `BREAKOUT-DOWN-${Date.now()}`,
            strategyType: 'breakout',
            strategyName: 'Price Breakout',
            instrumentId: currentData.instrumentId,
            symbol: currentData.symbol,
            signalType: 'STRONG_SELL',
            strength: createScore(90),
            confidence: createPercentage(85),
            timestamp: new Date(),
            entryPrice: currentData.close,
            stopLoss: rangeLow,
            metadata: { rangeHigh, rangeLow, breakoutType: 'downward' },
        };
    }
    return null;
}
/**
 * Detect volume breakout
 * @param marketData - Historical OHLC data
 * @param lookbackPeriod - Period for average volume calculation
 * @param volumeMultiplier - Multiplier for volume breakout (typically 2-3)
 * @returns Volume breakout indicator
 */
function detectVolumeBreakout(marketData, lookbackPeriod = 20, volumeMultiplier = 2) {
    if (marketData.length < lookbackPeriod + 1) {
        throw new Error(`Insufficient data: need at least ${lookbackPeriod + 1} data points`);
    }
    const historicalData = marketData.slice(-(lookbackPeriod + 1), -1);
    const currentData = marketData[marketData.length - 1];
    const avgVolume = historicalData.reduce((sum, d) => sum.plus(d.volume), new decimal_js_1.default(0))
        .div(lookbackPeriod);
    const multiplier = currentData.volume.div(avgVolume);
    const isBreakout = multiplier.greaterThanOrEqualTo(volumeMultiplier);
    return {
        isBreakout,
        currentVolume: currentData.volume,
        avgVolume,
        multiplier,
    };
}
/**
 * Calculate Donchian Channels for breakout trading
 * @param marketData - Historical OHLC data
 * @param period - Channel period (typically 20)
 * @returns Donchian channel upper and lower bounds
 */
function calculateDonchianChannels(marketData, period = 20) {
    if (marketData.length < period) {
        throw new Error(`Insufficient data: need at least ${period} data points`);
    }
    const recentData = marketData.slice(-period);
    const upper = recentData.reduce((max, d) => d.high.greaterThan(max) ? d.high : max, recentData[0].high);
    const lower = recentData.reduce((min, d) => d.low.lessThan(min) ? d.low : min, recentData[0].low);
    const middle = upper.plus(lower).div(2);
    return {
        upper: upper,
        lower: lower,
        middle: middle,
    };
}
/**
 * Generate Donchian Channel breakout signal
 * @param marketData - Historical OHLC data
 * @param period - Channel period
 * @returns Trading signal based on Donchian breakout
 */
function generateDonchianBreakoutSignal(marketData, period = 20) {
    const channels = calculateDonchianChannels(marketData, period);
    const currentData = marketData[marketData.length - 1];
    // Breakout above upper channel
    if (currentData.close.greaterThan(channels.upper)) {
        return {
            signalId: `DONCHIAN-UP-${Date.now()}`,
            strategyType: 'breakout',
            strategyName: 'Donchian Channel Breakout',
            instrumentId: currentData.instrumentId,
            symbol: currentData.symbol,
            signalType: 'STRONG_BUY',
            strength: createScore(85),
            confidence: createPercentage(80),
            timestamp: new Date(),
            entryPrice: currentData.close,
            stopLoss: channels.middle,
            metadata: { upper: channels.upper, lower: channels.lower },
        };
    }
    // Breakout below lower channel
    if (currentData.close.lessThan(channels.lower)) {
        return {
            signalId: `DONCHIAN-DOWN-${Date.now()}`,
            strategyType: 'breakout',
            strategyName: 'Donchian Channel Breakout',
            instrumentId: currentData.instrumentId,
            symbol: currentData.symbol,
            signalType: 'STRONG_SELL',
            strength: createScore(85),
            confidence: createPercentage(80),
            timestamp: new Date(),
            entryPrice: currentData.close,
            stopLoss: channels.middle,
            metadata: { upper: channels.upper, lower: channels.lower },
        };
    }
    return null;
}
// ============================================================================
// TREND FOLLOWING STRATEGIES
// ============================================================================
/**
 * Calculate Average Directional Index (ADX) for trend strength
 * @param marketData - Historical OHLC data
 * @param period - ADX period (typically 14)
 * @returns ADX value and trend strength
 */
function calculateADX(marketData, period = 14) {
    if (marketData.length < period + 1) {
        throw new Error(`Insufficient data: need at least ${period + 1} data points`);
    }
    // Simplified ADX calculation (production would use full ATR-based calculation)
    const trueRanges = marketData.slice(1).map((data, i) => {
        const prevClose = marketData[i].close;
        const high = data.high;
        const low = data.low;
        const tr1 = high.minus(low);
        const tr2 = high.minus(prevClose).abs();
        const tr3 = low.minus(prevClose).abs();
        return decimal_js_1.default.max(tr1, tr2, tr3);
    });
    const atr = trueRanges.slice(-period).reduce((sum, tr) => sum.plus(tr), new decimal_js_1.default(0)).div(period);
    // Simplified ADX (in production, calculate +DI, -DI, and DX properly)
    const adx = atr.div(marketData[marketData.length - 1].close).times(100);
    let trendStrength;
    if (adx.lessThan(25))
        trendStrength = 'weak';
    else if (adx.lessThan(50))
        trendStrength = 'moderate';
    else if (adx.lessThan(75))
        trendStrength = 'strong';
    else
        trendStrength = 'very_strong';
    return {
        adx,
        trending: adx.greaterThan(25),
        trendStrength,
    };
}
/**
 * Calculate Supertrend indicator
 * @param marketData - Historical OHLC data
 * @param period - ATR period
 * @param multiplier - ATR multiplier
 * @returns Supertrend value and direction
 */
function calculateSupertrend(marketData, period = 10, multiplier = 3) {
    if (marketData.length < period) {
        throw new Error(`Insufficient data: need at least ${period} data points`);
    }
    // Calculate ATR
    const trueRanges = marketData.slice(1).map((data, i) => {
        const prevClose = marketData[i].close;
        const high = data.high;
        const low = data.low;
        const tr1 = high.minus(low);
        const tr2 = high.minus(prevClose).abs();
        const tr3 = low.minus(prevClose).abs();
        return decimal_js_1.default.max(tr1, tr2, tr3);
    });
    const atr = trueRanges.slice(-period).reduce((sum, tr) => sum.plus(tr), new decimal_js_1.default(0)).div(period);
    const currentData = marketData[marketData.length - 1];
    const hl2 = (currentData.high.plus(currentData.low)).div(2);
    const basicUpperBand = hl2.plus(atr.times(multiplier));
    const basicLowerBand = hl2.minus(atr.times(multiplier));
    // Simplified Supertrend (production would track previous bands and flips)
    const currentClose = currentData.close;
    const direction = currentClose.greaterThan(hl2) ? 'up' : 'down';
    const supertrend = direction === 'up' ? basicLowerBand : basicUpperBand;
    return {
        supertrend: supertrend,
        direction,
    };
}
/**
 * Generate trend following signal using ADX and Supertrend
 * @param marketData - Historical OHLC data
 * @param adxPeriod - ADX period
 * @param stPeriod - Supertrend period
 * @param stMultiplier - Supertrend multiplier
 * @returns Trend following signal
 */
function generateTrendFollowingSignal(marketData, adxPeriod = 14, stPeriod = 10, stMultiplier = 3) {
    const adx = calculateADX(marketData, adxPeriod);
    const supertrend = calculateSupertrend(marketData, stPeriod, stMultiplier);
    const currentData = marketData[marketData.length - 1];
    let signalType = 'HOLD';
    let strength = createScore(50);
    let confidence = createPercentage(50);
    // Strong trend up
    if (adx.trending && supertrend.direction === 'up') {
        signalType = adx.trendStrength === 'very_strong' ? 'STRONG_BUY' : 'BUY';
        strength = createScore(adx.trendStrength === 'very_strong' ? 90 : 70);
        confidence = createPercentage(adx.adx.toNumber());
    }
    // Strong trend down
    else if (adx.trending && supertrend.direction === 'down') {
        signalType = adx.trendStrength === 'very_strong' ? 'STRONG_SELL' : 'SELL';
        strength = createScore(adx.trendStrength === 'very_strong' ? 90 : 70);
        confidence = createPercentage(adx.adx.toNumber());
    }
    return {
        signalId: `TREND-${Date.now()}`,
        strategyType: 'trend_following',
        strategyName: 'ADX-Supertrend Trend Following',
        instrumentId: currentData.instrumentId,
        symbol: currentData.symbol,
        signalType,
        strength,
        confidence,
        timestamp: new Date(),
        entryPrice: currentData.close,
        stopLoss: supertrend.supertrend,
        metadata: { adx: adx.adx, trendStrength: adx.trendStrength, supertrendDirection: supertrend.direction },
    };
}
// ============================================================================
// ARBITRAGE STRATEGIES
// ============================================================================
/**
 * Detect statistical arbitrage opportunity
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @param zScoreThreshold - Z-score threshold for entry
 * @returns Statistical arbitrage signal
 */
function detectStatisticalArbitrage(pricesA, pricesB, zScoreThreshold = 2) {
    const cointegration = calculateCointegration(pricesA, pricesB);
    if (!cointegration.isCointegrated) {
        return { opportunity: false, zScore: new decimal_js_1.default(0), action: 'none' };
    }
    const spreads = pricesA.map((pA, i) => pA.minus(pricesB[i].times(cointegration.hedgeRatio)));
    const zScore = calculateZScore(spreads, 20);
    let action = 'none';
    let opportunity = false;
    if (zScore.greaterThan(zScoreThreshold)) {
        opportunity = true;
        action = 'short_A_long_B';
    }
    else if (zScore.lessThan(-zScoreThreshold)) {
        opportunity = true;
        action = 'long_A_short_B';
    }
    return { opportunity, zScore, action };
}
/**
 * Calculate triangular arbitrage opportunity in FX
 * @param rateAB - Exchange rate A/B
 * @param rateBC - Exchange rate B/C
 * @param rateCA - Exchange rate C/A
 * @returns Arbitrage opportunity and profit percentage
 */
function calculateTriangularArbitrage(rateAB, rateBC, rateCA) {
    // Forward: A -> B -> C -> A
    const forwardResult = new decimal_js_1.default(1).times(rateAB).times(rateBC).times(rateCA);
    const forwardProfit = forwardResult.minus(1).times(100);
    // Reverse: A -> C -> B -> A
    const reverseResult = new decimal_js_1.default(1).div(rateCA).div(rateBC).div(rateAB);
    const reverseProfit = reverseResult.minus(1).times(100);
    // Need profit > transaction costs (typically 0.1-0.2%)
    const minProfitThreshold = new decimal_js_1.default(0.2);
    if (forwardProfit.greaterThan(minProfitThreshold)) {
        return {
            opportunity: true,
            profitPercent: forwardProfit,
            direction: 'forward',
        };
    }
    if (reverseProfit.greaterThan(minProfitThreshold)) {
        return {
            opportunity: true,
            profitPercent: reverseProfit,
            direction: 'reverse',
        };
    }
    return {
        opportunity: false,
        profitPercent: createPercentage(0),
        direction: 'none',
    };
}
/**
 * Detect merger arbitrage opportunity
 * @param targetPrice - Target company price
 * @param acquirerPrice - Acquirer company price
 * @param offerPrice - Offer price per share
 * @param exchangeRatio - Stock exchange ratio (if stock deal)
 * @param dealProbability - Estimated probability of deal completion
 * @returns Merger arbitrage analysis
 */
function analyzeMergerArbitrage(targetPrice, acquirerPrice, offerPrice, exchangeRatio, dealProbability) {
    // Calculate deal value
    const dealValue = exchangeRatio
        ? acquirerPrice.times(exchangeRatio)
        : offerPrice;
    const spread = dealValue.minus(targetPrice);
    const spreadPercent = spread.div(targetPrice).times(100);
    // Risk-adjusted expected return
    const successReturn = spreadPercent;
    const failureReturn = new decimal_js_1.default(-10); // Assume 10% loss if deal breaks
    const expectedReturn = successReturn.times(dealProbability.div(100))
        .plus(failureReturn.times(new decimal_js_1.default(1).minus(dealProbability.div(100))));
    let recommendation = 'HOLD';
    if (expectedReturn.greaterThan(5) && dealProbability.greaterThan(70)) {
        recommendation = 'BUY'; // Buy target, potentially short acquirer if stock deal
    }
    else if (spreadPercent.lessThan(1)) {
        recommendation = 'SELL'; // Spread too narrow
    }
    return {
        spread,
        spreadPercent,
        expectedReturn,
        recommendation,
    };
}
// ============================================================================
// OPTIONS STRATEGIES
// ============================================================================
/**
 * Create covered call strategy
 * @param underlyingSymbol - Underlying stock symbol
 * @param underlyingPrice - Current stock price
 * @param strikePrice - Call option strike price
 * @param premium - Call option premium received
 * @param expiration - Option expiration date
 * @param quantity - Number of contracts
 * @returns Covered call strategy details
 */
function createCoveredCallStrategy(underlyingSymbol, underlyingPrice, strikePrice, premium, expiration, quantity = createQuantity(1)) {
    const netPremium = premium.times(quantity).times(100); // Options are per 100 shares
    const maxProfit = strikePrice.minus(underlyingPrice)
        .times(quantity).times(100).plus(netPremium);
    const maxLoss = underlyingPrice.times(quantity).times(100).minus(netPremium);
    const breakEven = underlyingPrice.minus(premium);
    return {
        strategyId: `CC-${Date.now()}`,
        strategyName: 'Covered Call',
        underlyingSymbol,
        legs: [
            {
                legId: '1',
                optionType: 'CALL',
                action: 'SELL',
                strike: strikePrice,
                expiration,
                quantity,
                premium,
            },
        ],
        netPremium,
        maxProfit,
        maxLoss,
        breakEvenPoints: [breakEven],
        greeks: {
            delta: new decimal_js_1.default(-0.5).times(quantity),
            gamma: new decimal_js_1.default(-0.05).times(quantity),
            theta: new decimal_js_1.default(0.05).times(quantity),
            vega: new decimal_js_1.default(-0.1).times(quantity),
            rho: new decimal_js_1.default(-0.01).times(quantity),
        },
    };
}
/**
 * Create protective put strategy
 * @param underlyingSymbol - Underlying stock symbol
 * @param underlyingPrice - Current stock price
 * @param strikePrice - Put option strike price
 * @param premium - Put option premium paid
 * @param expiration - Option expiration date
 * @param quantity - Number of contracts
 * @returns Protective put strategy details
 */
function createProtectivePutStrategy(underlyingSymbol, underlyingPrice, strikePrice, premium, expiration, quantity = createQuantity(1)) {
    const netPremium = premium.times(quantity).times(100).negated(); // Cost
    const maxLoss = underlyingPrice.minus(strikePrice)
        .times(quantity).times(100).plus(premium.times(quantity).times(100));
    const maxProfit = new decimal_js_1.default(Infinity); // Unlimited upside
    const breakEven = underlyingPrice.plus(premium);
    return {
        strategyId: `PP-${Date.now()}`,
        strategyName: 'Protective Put',
        underlyingSymbol,
        legs: [
            {
                legId: '1',
                optionType: 'PUT',
                action: 'BUY',
                strike: strikePrice,
                expiration,
                quantity,
                premium,
            },
        ],
        netPremium,
        maxProfit,
        maxLoss,
        breakEvenPoints: [breakEven],
        greeks: {
            delta: new decimal_js_1.default(0.5).times(quantity),
            gamma: new decimal_js_1.default(0.05).times(quantity),
            theta: new decimal_js_1.default(-0.05).times(quantity),
            vega: new decimal_js_1.default(0.1).times(quantity),
            rho: new decimal_js_1.default(0.01).times(quantity),
        },
    };
}
/**
 * Create collar strategy (protective put + covered call)
 * @param underlyingSymbol - Underlying stock symbol
 * @param underlyingPrice - Current stock price
 * @param putStrike - Put option strike price
 * @param callStrike - Call option strike price
 * @param putPremium - Put option premium paid
 * @param callPremium - Call option premium received
 * @param expiration - Option expiration date
 * @param quantity - Number of contracts
 * @returns Collar strategy details
 */
function createCollarStrategy(underlyingSymbol, underlyingPrice, putStrike, callStrike, putPremium, callPremium, expiration, quantity = createQuantity(1)) {
    const netPremium = callPremium.minus(putPremium).times(quantity).times(100);
    const maxProfit = callStrike.minus(underlyingPrice)
        .times(quantity).times(100).plus(netPremium);
    const maxLoss = underlyingPrice.minus(putStrike)
        .times(quantity).times(100).minus(netPremium);
    return {
        strategyId: `COLLAR-${Date.now()}`,
        strategyName: 'Collar',
        underlyingSymbol,
        legs: [
            {
                legId: '1',
                optionType: 'PUT',
                action: 'BUY',
                strike: putStrike,
                expiration,
                quantity,
                premium: putPremium,
            },
            {
                legId: '2',
                optionType: 'CALL',
                action: 'SELL',
                strike: callStrike,
                expiration,
                quantity,
                premium: callPremium,
            },
        ],
        netPremium,
        maxProfit,
        maxLoss,
        breakEvenPoints: [],
        greeks: {
            delta: new decimal_js_1.default(0),
            gamma: new decimal_js_1.default(0),
            theta: new decimal_js_1.default(0),
            vega: new decimal_js_1.default(0),
            rho: new decimal_js_1.default(0),
        },
    };
}
/**
 * Create long straddle strategy (buy call + buy put at same strike)
 * @param underlyingSymbol - Underlying stock symbol
 * @param underlyingPrice - Current stock price
 * @param strikePrice - Strike price for both options
 * @param callPremium - Call option premium paid
 * @param putPremium - Put option premium paid
 * @param expiration - Option expiration date
 * @param quantity - Number of contracts
 * @returns Straddle strategy details
 */
function createStraddleStrategy(underlyingSymbol, underlyingPrice, strikePrice, callPremium, putPremium, expiration, quantity = createQuantity(1)) {
    const totalPremium = callPremium.plus(putPremium);
    const netPremium = totalPremium.times(quantity).times(100).negated();
    const maxLoss = totalPremium.times(quantity).times(100);
    const maxProfit = new decimal_js_1.default(Infinity); // Unlimited if large move
    const breakEvenUpper = strikePrice.plus(totalPremium);
    const breakEvenLower = strikePrice.minus(totalPremium);
    return {
        strategyId: `STRADDLE-${Date.now()}`,
        strategyName: 'Long Straddle',
        underlyingSymbol,
        legs: [
            {
                legId: '1',
                optionType: 'CALL',
                action: 'BUY',
                strike: strikePrice,
                expiration,
                quantity,
                premium: callPremium,
            },
            {
                legId: '2',
                optionType: 'PUT',
                action: 'BUY',
                strike: strikePrice,
                expiration,
                quantity,
                premium: putPremium,
            },
        ],
        netPremium,
        maxProfit,
        maxLoss,
        breakEvenPoints: [breakEvenLower, breakEvenUpper],
        greeks: {
            delta: new decimal_js_1.default(0),
            gamma: new decimal_js_1.default(0.1).times(quantity),
            theta: new decimal_js_1.default(-0.1).times(quantity),
            vega: new decimal_js_1.default(0.2).times(quantity),
            rho: new decimal_js_1.default(0),
        },
    };
}
/**
 * Create long strangle strategy (buy OTM call + buy OTM put)
 * @param underlyingSymbol - Underlying stock symbol
 * @param underlyingPrice - Current stock price
 * @param callStrike - Call strike price (above current)
 * @param putStrike - Put strike price (below current)
 * @param callPremium - Call option premium paid
 * @param putPremium - Put option premium paid
 * @param expiration - Option expiration date
 * @param quantity - Number of contracts
 * @returns Strangle strategy details
 */
function createStrangleStrategy(underlyingSymbol, underlyingPrice, callStrike, putStrike, callPremium, putPremium, expiration, quantity = createQuantity(1)) {
    const totalPremium = callPremium.plus(putPremium);
    const netPremium = totalPremium.times(quantity).times(100).negated();
    const maxLoss = totalPremium.times(quantity).times(100);
    const maxProfit = new decimal_js_1.default(Infinity);
    const breakEvenUpper = callStrike.plus(totalPremium);
    const breakEvenLower = putStrike.minus(totalPremium);
    return {
        strategyId: `STRANGLE-${Date.now()}`,
        strategyName: 'Long Strangle',
        underlyingSymbol,
        legs: [
            {
                legId: '1',
                optionType: 'CALL',
                action: 'BUY',
                strike: callStrike,
                expiration,
                quantity,
                premium: callPremium,
            },
            {
                legId: '2',
                optionType: 'PUT',
                action: 'BUY',
                strike: putStrike,
                expiration,
                quantity,
                premium: putPremium,
            },
        ],
        netPremium,
        maxProfit,
        maxLoss,
        breakEvenPoints: [breakEvenLower, breakEvenUpper],
        greeks: {
            delta: new decimal_js_1.default(0),
            gamma: new decimal_js_1.default(0.08).times(quantity),
            theta: new decimal_js_1.default(-0.08).times(quantity),
            vega: new decimal_js_1.default(0.18).times(quantity),
            rho: new decimal_js_1.default(0),
        },
    };
}
/**
 * Create iron condor strategy (sell OTM strangle + buy farther OTM strangle)
 * @param underlyingSymbol - Underlying stock symbol
 * @param sellCallStrike - Sold call strike
 * @param buyCallStrike - Bought call strike
 * @param sellPutStrike - Sold put strike
 * @param buyPutStrike - Bought put strike
 * @param premiums - Premiums for each leg
 * @param expiration - Option expiration date
 * @param quantity - Number of contracts
 * @returns Iron condor strategy details
 */
function createIronCondorStrategy(underlyingSymbol, sellCallStrike, buyCallStrike, sellPutStrike, buyPutStrike, premiums, expiration, quantity = createQuantity(1)) {
    const netPremium = premiums.sellCall.plus(premiums.sellPut)
        .minus(premiums.buyCall).minus(premiums.buyPut)
        .times(quantity).times(100);
    const maxProfit = netPremium;
    const maxLoss = buyCallStrike.minus(sellCallStrike)
        .times(quantity).times(100).minus(netPremium);
    return {
        strategyId: `IC-${Date.now()}`,
        strategyName: 'Iron Condor',
        underlyingSymbol,
        legs: [
            {
                legId: '1',
                optionType: 'CALL',
                action: 'SELL',
                strike: sellCallStrike,
                expiration,
                quantity,
                premium: premiums.sellCall,
            },
            {
                legId: '2',
                optionType: 'CALL',
                action: 'BUY',
                strike: buyCallStrike,
                expiration,
                quantity,
                premium: premiums.buyCall,
            },
            {
                legId: '3',
                optionType: 'PUT',
                action: 'SELL',
                strike: sellPutStrike,
                expiration,
                quantity,
                premium: premiums.sellPut,
            },
            {
                legId: '4',
                optionType: 'PUT',
                action: 'BUY',
                strike: buyPutStrike,
                expiration,
                quantity,
                premium: premiums.buyPut,
            },
        ],
        netPremium,
        maxProfit,
        maxLoss,
        breakEvenPoints: [],
        greeks: {
            delta: new decimal_js_1.default(0),
            gamma: new decimal_js_1.default(-0.02).times(quantity),
            theta: new decimal_js_1.default(0.05).times(quantity),
            vega: new decimal_js_1.default(-0.05).times(quantity),
            rho: new decimal_js_1.default(0),
        },
    };
}
/**
 * Create butterfly spread strategy
 * @param underlyingSymbol - Underlying stock symbol
 * @param lowerStrike - Lower strike price
 * @param middleStrike - Middle strike price (ATM)
 * @param upperStrike - Upper strike price
 * @param premiums - Premiums for each leg
 * @param optionType - 'CALL' or 'PUT' butterfly
 * @param expiration - Option expiration date
 * @param quantity - Number of contracts
 * @returns Butterfly spread strategy details
 */
function createButterflyStrategy(underlyingSymbol, lowerStrike, middleStrike, upperStrike, premiums, optionType, expiration, quantity = createQuantity(1)) {
    const netPremium = premiums.lower.plus(premiums.upper)
        .minus(premiums.middle.times(2))
        .times(quantity).times(100).negated();
    const maxProfit = middleStrike.minus(lowerStrike)
        .times(quantity).times(100).minus(netPremium.abs());
    const maxLoss = netPremium.abs();
    return {
        strategyId: `BUTTERFLY-${Date.now()}`,
        strategyName: `${optionType} Butterfly`,
        underlyingSymbol,
        legs: [
            {
                legId: '1',
                optionType,
                action: 'BUY',
                strike: lowerStrike,
                expiration,
                quantity,
                premium: premiums.lower,
            },
            {
                legId: '2',
                optionType,
                action: 'SELL',
                strike: middleStrike,
                expiration,
                quantity: createQuantity(quantity.times(2).toNumber()),
                premium: premiums.middle,
            },
            {
                legId: '3',
                optionType,
                action: 'BUY',
                strike: upperStrike,
                expiration,
                quantity,
                premium: premiums.upper,
            },
        ],
        netPremium,
        maxProfit,
        maxLoss,
        breakEvenPoints: [],
        greeks: {
            delta: new decimal_js_1.default(0),
            gamma: new decimal_js_1.default(0.03).times(quantity),
            theta: new decimal_js_1.default(-0.02).times(quantity),
            vega: new decimal_js_1.default(-0.03).times(quantity),
            rho: new decimal_js_1.default(0),
        },
    };
}
// ============================================================================
// BACKTESTING FRAMEWORK
// ============================================================================
/**
 * Backtest a trading strategy
 * @param strategyFunction - Function that generates signals from market data
 * @param historicalData - Historical market data
 * @param initialCapital - Starting capital
 * @param positionSize - Position size per trade (as fraction of capital)
 * @param commission - Commission per trade
 * @returns Backtest results with performance metrics
 */
function backtestStrategy(strategyFunction, historicalData, initialCapital, positionSize = new decimal_js_1.default(0.1), commission = new decimal_js_1.default(5)) {
    let capital = initialCapital;
    let position = null;
    const trades = [];
    const equityCurve = [];
    for (let i = 50; i < historicalData.length; i++) {
        const dataSlice = historicalData.slice(0, i + 1);
        const currentData = dataSlice[dataSlice.length - 1];
        // Update equity curve
        let currentEquity = capital;
        if (position) {
            const currentPrice = currentData.close;
            const entryPrice = position.entryPrice;
            const positionValue = position.quantity.times(position.side === 'LONG'
                ? currentPrice.minus(entryPrice)
                : entryPrice.minus(currentPrice));
            currentEquity = capital.plus(positionValue);
        }
        equityCurve.push({ date: currentData.timestamp, equity: currentEquity });
        // Generate signal
        const signal = strategyFunction(dataSlice);
        if (!signal)
            continue;
        // Entry logic
        if (!position && (signal.signalType === 'BUY' || signal.signalType === 'STRONG_BUY')) {
            const positionCapital = capital.times(positionSize);
            const quantity = positionCapital.div(currentData.close);
            position = {
                side: 'LONG',
                entryPrice: currentData.close,
                entryDate: currentData.timestamp,
                quantity,
            };
            capital = capital.minus(commission);
        }
        else if (!position && (signal.signalType === 'SELL' || signal.signalType === 'STRONG_SELL')) {
            const positionCapital = capital.times(positionSize);
            const quantity = positionCapital.div(currentData.close);
            position = {
                side: 'SHORT',
                entryPrice: currentData.close,
                entryDate: currentData.timestamp,
                quantity,
            };
            capital = capital.minus(commission);
        }
        // Exit logic
        if (position &&
            ((position.side === 'LONG' && (signal.signalType === 'SELL' || signal.signalType === 'STRONG_SELL')) ||
                (position.side === 'SHORT' && (signal.signalType === 'BUY' || signal.signalType === 'STRONG_BUY')))) {
            const exitPrice = currentData.close;
            const pnl = position.quantity.times(position.side === 'LONG'
                ? exitPrice.minus(position.entryPrice)
                : position.entryPrice.minus(exitPrice)).minus(commission);
            const pnlPercent = pnl.div(position.quantity.times(position.entryPrice)).times(100);
            const holdingPeriod = Math.floor((currentData.timestamp.getTime() - position.entryDate.getTime()) / (1000 * 60 * 60 * 24));
            trades.push({
                tradeId: `TRADE-${trades.length + 1}`,
                instrumentId: currentData.instrumentId,
                entryDate: position.entryDate,
                exitDate: currentData.timestamp,
                entryPrice: position.entryPrice,
                exitPrice,
                quantity: position.quantity,
                side: position.side,
                pnl,
                pnlPercent,
                holdingPeriod,
            });
            capital = capital.plus(pnl);
            position = null;
        }
    }
    // Calculate performance metrics
    const finalCapital = capital;
    const totalReturn = finalCapital.minus(initialCapital).div(initialCapital).times(100);
    const tradingDays = (historicalData[historicalData.length - 1].timestamp.getTime() -
        historicalData[0].timestamp.getTime()) / (1000 * 60 * 60 * 24);
    const years = tradingDays / 252;
    const annualizedReturn = finalCapital.div(initialCapital).pow(1 / years).minus(1).times(100);
    const winningTrades = trades.filter(t => t.pnl.greaterThan(0)).length;
    const losingTrades = trades.filter(t => t.pnl.lessThan(0)).length;
    const winRate = trades.length > 0
        ? new decimal_js_1.default(winningTrades).div(trades.length).times(100)
        : createPercentage(0);
    const avgWin = winningTrades > 0
        ? trades.filter(t => t.pnl.greaterThan(0)).reduce((sum, t) => sum.plus(t.pnl), new decimal_js_1.default(0)).div(winningTrades)
        : new decimal_js_1.default(0);
    const avgLoss = losingTrades > 0
        ? trades.filter(t => t.pnl.lessThan(0)).reduce((sum, t) => sum.plus(t.pnl.abs()), new decimal_js_1.default(0)).div(losingTrades)
        : new decimal_js_1.default(0);
    const profitFactor = avgLoss.greaterThan(0) ? avgWin.div(avgLoss) : new decimal_js_1.default(0);
    // Calculate Sharpe ratio (simplified)
    const returns = equityCurve.slice(1).map((e, i) => e.equity.minus(equityCurve[i].equity).div(equityCurve[i].equity));
    const avgReturn = returns.reduce((sum, r) => sum.plus(r), new decimal_js_1.default(0)).div(returns.length);
    const variance = returns.reduce((sum, r) => sum.plus(r.minus(avgReturn).pow(2)), new decimal_js_1.default(0)).div(returns.length);
    const stdDev = variance.sqrt();
    const sharpeRatio = stdDev.greaterThan(0) ? avgReturn.div(stdDev).times(Math.sqrt(252)) : new decimal_js_1.default(0);
    // Calculate max drawdown
    let maxDrawdown = new decimal_js_1.default(0);
    let peak = equityCurve[0].equity;
    for (const point of equityCurve) {
        if (point.equity.greaterThan(peak)) {
            peak = point.equity;
        }
        const drawdown = peak.minus(point.equity).div(peak).times(100);
        if (drawdown.greaterThan(maxDrawdown)) {
            maxDrawdown = drawdown;
        }
    }
    return {
        strategyId: `BACKTEST-${Date.now()}`,
        startDate: historicalData[0].timestamp,
        endDate: historicalData[historicalData.length - 1].timestamp,
        initialCapital,
        finalCapital,
        totalReturn,
        annualizedReturn,
        sharpeRatio,
        sortinoRatio: sharpeRatio, // Simplified
        maxDrawdown: maxDrawdown,
        winRate,
        profitFactor,
        totalTrades: trades.length,
        winningTrades,
        losingTrades,
        avgWinAmount: avgWin,
        avgLossAmount: avgLoss,
        trades,
        equityCurve,
        metrics: {
            avgHoldingPeriod: trades.length > 0
                ? trades.reduce((sum, t) => sum + t.holdingPeriod, 0) / trades.length
                : 0,
        },
    };
}
/**
 * Calculate strategy performance metrics
 * @param backtestResult - Backtest result to analyze
 * @returns Detailed performance metrics
 */
function calculatePerformanceMetrics(backtestResult) {
    const { trades, equityCurve, initialCapital, finalCapital } = backtestResult;
    // Return metrics
    const totalReturn = finalCapital.minus(initialCapital).div(initialCapital);
    const avgTradeReturn = trades.length > 0
        ? trades.reduce((sum, t) => sum.plus(t.pnlPercent), new decimal_js_1.default(0)).div(trades.length)
        : new decimal_js_1.default(0);
    // Risk metrics
    const returns = equityCurve.slice(1).map((e, i) => e.equity.minus(equityCurve[i].equity).div(equityCurve[i].equity));
    const avgDailyReturn = returns.reduce((sum, r) => sum.plus(r), new decimal_js_1.default(0)).div(returns.length);
    const variance = returns.reduce((sum, r) => sum.plus(r.minus(avgDailyReturn).pow(2)), new decimal_js_1.default(0))
        .div(returns.length);
    const volatility = variance.sqrt().times(Math.sqrt(252));
    const downside = returns.filter(r => r.lessThan(0));
    const downsideVariance = downside.length > 0
        ? downside.reduce((sum, r) => sum.plus(r.pow(2)), new decimal_js_1.default(0)).div(downside.length)
        : new decimal_js_1.default(0);
    const downsideDeviation = downsideVariance.sqrt();
    // Efficiency metrics
    const calmarRatio = backtestResult.maxDrawdown.greaterThan(0)
        ? backtestResult.annualizedReturn.div(backtestResult.maxDrawdown)
        : new decimal_js_1.default(0);
    return {
        returnMetrics: {
            totalReturn,
            avgTradeReturn,
            bestTrade: trades.length > 0
                ? trades.reduce((max, t) => t.pnl.greaterThan(max) ? t.pnl : max, trades[0].pnl)
                : new decimal_js_1.default(0),
            worstTrade: trades.length > 0
                ? trades.reduce((min, t) => t.pnl.lessThan(min) ? t.pnl : min, trades[0].pnl)
                : new decimal_js_1.default(0),
        },
        riskMetrics: {
            volatility,
            downsideDeviation,
            maxConsecutiveLosses: new decimal_js_1.default(calculateMaxConsecutiveLosses(trades)),
            maxConsecutiveWins: new decimal_js_1.default(calculateMaxConsecutiveWins(trades)),
        },
        efficiencyMetrics: {
            sharpeRatio: backtestResult.sharpeRatio,
            sortinoRatio: downsideDeviation.greaterThan(0)
                ? avgDailyReturn.div(downsideDeviation).times(Math.sqrt(252))
                : new decimal_js_1.default(0),
            calmarRatio,
            profitFactor: backtestResult.profitFactor,
        },
    };
}
/**
 * Helper function to calculate maximum consecutive losses
 */
function calculateMaxConsecutiveLosses(trades) {
    let maxLosses = 0;
    let currentLosses = 0;
    for (const trade of trades) {
        if (trade.pnl.lessThan(0)) {
            currentLosses++;
            maxLosses = Math.max(maxLosses, currentLosses);
        }
        else {
            currentLosses = 0;
        }
    }
    return maxLosses;
}
/**
 * Helper function to calculate maximum consecutive wins
 */
function calculateMaxConsecutiveWins(trades) {
    let maxWins = 0;
    let currentWins = 0;
    for (const trade of trades) {
        if (trade.pnl.greaterThan(0)) {
            currentWins++;
            maxWins = Math.max(maxWins, currentWins);
        }
        else {
            currentWins = 0;
        }
    }
    return maxWins;
}
//# sourceMappingURL=trading-strategies-kit.js.map