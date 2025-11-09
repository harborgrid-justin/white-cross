"use strict";
/**
 * Technical Analysis Kit - Bloomberg Terminal-Level Analytics
 *
 * A comprehensive library of production-ready technical analysis functions
 * for financial market analysis. All calculations are implemented from first
 * principles with strict type safety, comprehensive error handling, and
 * institutional-grade accuracy.
 *
 * @module technical-analysis-kit
 * @author TypeScript Architect
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSMA = calculateSMA;
exports.calculateEMA = calculateEMA;
exports.calculateWMA = calculateWMA;
exports.calculateVWMA = calculateVWMA;
exports.calculateDEMA = calculateDEMA;
exports.calculateTEMA = calculateTEMA;
exports.calculateHMA = calculateHMA;
exports.calculateRSI = calculateRSI;
exports.calculateMACD = calculateMACD;
exports.calculateStochastic = calculateStochastic;
exports.calculateROC = calculateROC;
exports.calculateWilliamsR = calculateWilliamsR;
exports.calculateCCI = calculateCCI;
exports.calculateMFI = calculateMFI;
exports.calculateMomentum = calculateMomentum;
exports.calculateBollingerBands = calculateBollingerBands;
exports.calculateATR = calculateATR;
exports.calculateKeltnerChannels = calculateKeltnerChannels;
exports.calculateStandardDeviation = calculateStandardDeviation;
exports.calculateHistoricVolatility = calculateHistoricVolatility;
exports.calculateDonchianChannels = calculateDonchianChannels;
exports.calculateADX = calculateADX;
exports.calculateAroon = calculateAroon;
exports.calculateParabolicSAR = calculateParabolicSAR;
exports.calculateSupertrend = calculateSupertrend;
exports.calculateLinearRegression = calculateLinearRegression;
exports.calculateOBV = calculateOBV;
exports.calculateVWAP = calculateVWAP;
exports.calculateVPT = calculateVPT;
exports.calculateAccumulationDistribution = calculateAccumulationDistribution;
exports.calculateChaikinMoneyFlow = calculateChaikinMoneyFlow;
exports.calculateFibonacciRetracement = calculateFibonacciRetracement;
exports.calculateFibonacciExtension = calculateFibonacciExtension;
exports.calculateFibonacciFan = calculateFibonacciFan;
exports.calculateFibonacciArcs = calculateFibonacciArcs;
exports.calculatePivotPoints = calculatePivotPoints;
exports.calculateFibonacciPivots = calculateFibonacciPivots;
exports.calculateCamarillaPivots = calculateCamarillaPivots;
exports.identifySupportResistance = identifySupportResistance;
exports.calculateIchimoku = calculateIchimoku;
exports.detectDoji = detectDoji;
exports.detectHammer = detectHammer;
exports.detectEngulfing = detectEngulfing;
exports.detectMorningEveningStar = detectMorningEveningStar;
exports.detectHarami = detectHarami;
exports.detectShootingStar = detectShootingStar;
exports.detectHangingMan = detectHangingMan;
// ============================================================================
// Moving Averages
// ============================================================================
/**
 * Calculates Simple Moving Average (SMA)
 *
 * @param data - Array of numbers (typically closing prices)
 * @param period - Number of periods for the moving average
 * @returns Array of SMA values (padded with NaN for initial periods)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [10, 11, 12, 13, 14, 15];
 * const sma = calculateSMA(prices, 3);
 * // Returns: [NaN, NaN, 11, 12, 13, 14]
 */
function calculateSMA(data, period) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be a positive integer.`);
    }
    if (data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    if (period > data.length) {
        throw new Error(`Period ${period} exceeds data length ${data.length}`);
    }
    const result = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j];
        }
        result.push(sum / period);
    }
    return result;
}
/**
 * Calculates Exponential Moving Average (EMA)
 *
 * EMA gives more weight to recent prices using an exponential decay factor.
 *
 * @param data - Array of numbers (typically closing prices)
 * @param period - Number of periods for the moving average
 * @returns Array of EMA values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [22, 23, 24, 25, 26];
 * const ema = calculateEMA(prices, 3);
 */
function calculateEMA(data, period) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be a positive integer.`);
    }
    if (data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    const multiplier = 2 / (period + 1);
    const result = new Array(period - 1).fill(NaN);
    // First EMA is SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[i];
    }
    let ema = sum / period;
    result.push(ema);
    // Subsequent EMAs
    for (let i = period; i < data.length; i++) {
        ema = (data[i] - ema) * multiplier + ema;
        result.push(ema);
    }
    return result;
}
/**
 * Calculates Weighted Moving Average (WMA)
 *
 * WMA applies linearly increasing weights to recent prices.
 *
 * @param data - Array of numbers (typically closing prices)
 * @param period - Number of periods for the moving average
 * @returns Array of WMA values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [10, 11, 12, 13, 14];
 * const wma = calculateWMA(prices, 3);
 */
function calculateWMA(data, period) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be a positive integer.`);
    }
    if (data.length === 0) {
        throw new Error('Data array cannot be empty');
    }
    if (period > data.length) {
        throw new Error(`Period ${period} exceeds data length ${data.length}`);
    }
    const result = new Array(period - 1).fill(NaN);
    const denominator = (period * (period + 1)) / 2;
    for (let i = period - 1; i < data.length; i++) {
        let weightedSum = 0;
        for (let j = 0; j < period; j++) {
            weightedSum += data[i - j] * (period - j);
        }
        result.push(weightedSum / denominator);
    }
    return result;
}
/**
 * Calculates Volume-Weighted Moving Average (VWMA)
 *
 * @param prices - Array of price data points
 * @param period - Number of periods for the moving average
 * @returns Array of VWMA values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [
 *   { timestamp: 1, open: 100, high: 105, low: 99, close: 103, volume: 1000 },
 *   { timestamp: 2, open: 103, high: 108, low: 102, close: 107, volume: 1200 }
 * ];
 * const vwma = calculateVWMA(data, 2);
 */
function calculateVWMA(prices, period) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be a positive integer.`);
    }
    if (prices.length === 0) {
        throw new Error('Price data cannot be empty');
    }
    const result = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < prices.length; i++) {
        let volumeSum = 0;
        let priceVolumeSum = 0;
        for (let j = 0; j < period; j++) {
            const point = prices[i - j];
            volumeSum += point.volume;
            priceVolumeSum += point.close * point.volume;
        }
        if (volumeSum === 0) {
            result.push(NaN);
        }
        else {
            result.push(priceVolumeSum / volumeSum);
        }
    }
    return result;
}
/**
 * Calculates Double Exponential Moving Average (DEMA)
 *
 * DEMA reduces lag by applying EMA twice with a specific formula.
 *
 * @param data - Array of numbers (typically closing prices)
 * @param period - Number of periods for the moving average
 * @returns Array of DEMA values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [10, 11, 12, 13, 14, 15, 16];
 * const dema = calculateDEMA(prices, 3);
 */
function calculateDEMA(data, period) {
    const ema1 = calculateEMA(data, period);
    const ema2 = calculateEMA(ema1.filter(v => !Number.isNaN(v)), period);
    const result = [];
    const offset = (period - 1) * 2;
    for (let i = 0; i < data.length; i++) {
        if (i < offset) {
            result.push(NaN);
        }
        else {
            const ema2Index = i - (period - 1);
            result.push(2 * ema1[i] - ema2[ema2Index]);
        }
    }
    return result;
}
/**
 * Calculates Triple Exponential Moving Average (TEMA)
 *
 * TEMA further reduces lag by applying EMA three times.
 *
 * @param data - Array of numbers (typically closing prices)
 * @param period - Number of periods for the moving average
 * @returns Array of TEMA values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [10, 11, 12, 13, 14, 15, 16, 17, 18];
 * const tema = calculateTEMA(prices, 3);
 */
function calculateTEMA(data, period) {
    const ema1 = calculateEMA(data, period);
    const ema2 = calculateEMA(ema1.filter(v => !Number.isNaN(v)), period);
    const ema3 = calculateEMA(ema2.filter(v => !Number.isNaN(v)), period);
    const result = [];
    const offset = (period - 1) * 3;
    for (let i = 0; i < data.length; i++) {
        if (i < offset) {
            result.push(NaN);
        }
        else {
            const ema2Index = i - (period - 1);
            const ema3Index = i - (period - 1) * 2;
            result.push(3 * ema1[i] - 3 * ema2[ema2Index] + ema3[ema3Index]);
        }
    }
    return result;
}
/**
 * Calculates Hull Moving Average (HMA)
 *
 * HMA significantly reduces lag while improving smoothness.
 *
 * @param data - Array of numbers (typically closing prices)
 * @param period - Number of periods for the moving average
 * @returns Array of HMA values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [10, 11, 12, 13, 14, 15, 16, 17];
 * const hma = calculateHMA(prices, 4);
 */
function calculateHMA(data, period) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be a positive integer.`);
    }
    const halfPeriod = Math.floor(period / 2);
    const sqrtPeriod = Math.floor(Math.sqrt(period));
    const wma1 = calculateWMA(data, halfPeriod);
    const wma2 = calculateWMA(data, period);
    const rawHMA = [];
    for (let i = 0; i < data.length; i++) {
        if (Number.isNaN(wma1[i]) || Number.isNaN(wma2[i])) {
            rawHMA.push(NaN);
        }
        else {
            rawHMA.push(2 * wma1[i] - wma2[i]);
        }
    }
    const validRawHMA = rawHMA.filter(v => !Number.isNaN(v));
    const hma = calculateWMA(validRawHMA, sqrtPeriod);
    const result = new Array(data.length - validRawHMA.length).fill(NaN);
    return result.concat(hma);
}
// ============================================================================
// Momentum Indicators
// ============================================================================
/**
 * Calculates Relative Strength Index (RSI)
 *
 * RSI measures the magnitude of recent price changes to evaluate
 * overbought or oversold conditions.
 *
 * @param data - Array of closing prices
 * @param period - Number of periods (typically 14)
 * @returns Array of RSI values (0-100)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [44, 44.34, 44.09, 43.61, 44.33, 44.83, 45.10, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61, 46.28, 46.28];
 * const rsi = calculateRSI(prices, 14);
 */
function calculateRSI(data, period = 14) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be a positive integer.`);
    }
    if (data.length < period + 1) {
        throw new Error(`Insufficient data: need at least ${period + 1} points`);
    }
    const result = new Array(period).fill(NaN);
    // Calculate initial average gain and loss
    let avgGain = 0;
    let avgLoss = 0;
    for (let i = 1; i <= period; i++) {
        const change = data[i] - data[i - 1];
        if (change > 0) {
            avgGain += change;
        }
        else {
            avgLoss += Math.abs(change);
        }
    }
    avgGain /= period;
    avgLoss /= period;
    // First RSI
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(100 - (100 / (1 + rs)));
    // Subsequent RSI values using smoothed averages
    for (let i = period + 1; i < data.length; i++) {
        const change = data[i] - data[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? Math.abs(change) : 0;
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
        const currentRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
        result.push(100 - (100 / (1 + currentRS)));
    }
    return result;
}
/**
 * Calculates MACD (Moving Average Convergence Divergence)
 *
 * MACD shows the relationship between two moving averages of prices.
 *
 * @param data - Array of closing prices
 * @param fastPeriod - Fast EMA period (typically 12)
 * @param slowPeriod - Slow EMA period (typically 26)
 * @param signalPeriod - Signal line EMA period (typically 9)
 * @returns MACD line, signal line, and histogram
 * @throws Error if periods are invalid or data is empty
 *
 * @example
 * const prices = [...prices];
 * const macd = calculateMACD(prices, 12, 26, 9);
 */
function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (fastPeriod >= slowPeriod) {
        throw new Error('Fast period must be less than slow period');
    }
    if (data.length < slowPeriod) {
        throw new Error(`Insufficient data: need at least ${slowPeriod} points`);
    }
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);
    const macdLine = [];
    for (let i = 0; i < data.length; i++) {
        if (Number.isNaN(fastEMA[i]) || Number.isNaN(slowEMA[i])) {
            macdLine.push(NaN);
        }
        else {
            macdLine.push(fastEMA[i] - slowEMA[i]);
        }
    }
    const validMACDLine = macdLine.filter(v => !Number.isNaN(v));
    const signalEMA = calculateEMA(validMACDLine, signalPeriod);
    const signalLine = new Array(macdLine.length - validMACDLine.length).fill(NaN);
    signalLine.push(...signalEMA);
    const histogram = [];
    for (let i = 0; i < macdLine.length; i++) {
        if (Number.isNaN(macdLine[i]) || Number.isNaN(signalLine[i])) {
            histogram.push(NaN);
        }
        else {
            histogram.push(macdLine[i] - signalLine[i]);
        }
    }
    return {
        macd: macdLine,
        signal: signalLine,
        histogram: histogram
    };
}
/**
 * Calculates Stochastic Oscillator
 *
 * Compares a particular closing price to a range of prices over time.
 *
 * @param prices - Array of price data points
 * @param kPeriod - %K period (typically 14)
 * @param dPeriod - %D smoothing period (typically 3)
 * @returns %K and %D lines
 * @throws Error if periods are invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const stoch = calculateStochastic(data, 14, 3);
 */
function calculateStochastic(prices, kPeriod = 14, dPeriod = 3) {
    if (kPeriod <= 0 || !Number.isInteger(kPeriod)) {
        throw new Error(`Invalid K period: ${kPeriod}`);
    }
    if (prices.length < kPeriod) {
        throw new Error(`Insufficient data: need at least ${kPeriod} points`);
    }
    const kLine = new Array(kPeriod - 1).fill(NaN);
    for (let i = kPeriod - 1; i < prices.length; i++) {
        let highestHigh = -Infinity;
        let lowestLow = Infinity;
        for (let j = 0; j < kPeriod; j++) {
            const point = prices[i - j];
            highestHigh = Math.max(highestHigh, point.high);
            lowestLow = Math.min(lowestLow, point.low);
        }
        const range = highestHigh - lowestLow;
        if (range === 0) {
            kLine.push(50); // Neutral when no range
        }
        else {
            const k = ((prices[i].close - lowestLow) / range) * 100;
            kLine.push(k);
        }
    }
    const validK = kLine.filter(v => !Number.isNaN(v));
    const dLine = calculateSMA(validK, dPeriod);
    const dLinePadded = new Array(kLine.length - validK.length).fill(NaN).concat(dLine);
    return {
        k: kLine,
        d: dLinePadded
    };
}
/**
 * Calculates Rate of Change (ROC)
 *
 * Measures the percentage change in price between current and n periods ago.
 *
 * @param data - Array of closing prices
 * @param period - Number of periods (typically 12)
 * @returns Array of ROC values (as percentages)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [100, 102, 104, 103, 105];
 * const roc = calculateROC(prices, 3);
 */
function calculateROC(data, period = 12) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be a positive integer.`);
    }
    if (data.length <= period) {
        throw new Error(`Insufficient data: need more than ${period} points`);
    }
    const result = new Array(period).fill(NaN);
    for (let i = period; i < data.length; i++) {
        const oldPrice = data[i - period];
        if (oldPrice === 0) {
            result.push(NaN);
        }
        else {
            const roc = ((data[i] - oldPrice) / oldPrice) * 100;
            result.push(roc);
        }
    }
    return result;
}
/**
 * Calculates Williams %R
 *
 * Momentum indicator measuring overbought/oversold levels.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 14)
 * @returns Array of Williams %R values (-100 to 0)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const williamsR = calculateWilliamsR(data, 14);
 */
function calculateWilliamsR(prices, period = 14) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    const result = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < prices.length; i++) {
        let highestHigh = -Infinity;
        let lowestLow = Infinity;
        for (let j = 0; j < period; j++) {
            const point = prices[i - j];
            highestHigh = Math.max(highestHigh, point.high);
            lowestLow = Math.min(lowestLow, point.low);
        }
        const range = highestHigh - lowestLow;
        if (range === 0) {
            result.push(-50); // Neutral
        }
        else {
            const wr = ((highestHigh - prices[i].close) / range) * -100;
            result.push(wr);
        }
    }
    return result;
}
/**
 * Calculates Commodity Channel Index (CCI)
 *
 * Measures the difference between current price and average price.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 20)
 * @returns Array of CCI values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const cci = calculateCCI(data, 20);
 */
function calculateCCI(prices, period = 20) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    // Calculate typical price
    const typicalPrices = prices.map(p => (p.high + p.low + p.close) / 3);
    const result = new Array(period - 1).fill(NaN);
    const constant = 0.015;
    for (let i = period - 1; i < typicalPrices.length; i++) {
        // Calculate SMA of typical price
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += typicalPrices[i - j];
        }
        const sma = sum / period;
        // Calculate mean deviation
        let deviationSum = 0;
        for (let j = 0; j < period; j++) {
            deviationSum += Math.abs(typicalPrices[i - j] - sma);
        }
        const meanDeviation = deviationSum / period;
        if (meanDeviation === 0) {
            result.push(0);
        }
        else {
            const cci = (typicalPrices[i] - sma) / (constant * meanDeviation);
            result.push(cci);
        }
    }
    return result;
}
/**
 * Calculates Money Flow Index (MFI)
 *
 * Volume-weighted RSI measuring buying and selling pressure.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 14)
 * @returns Array of MFI values (0-100)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const mfi = calculateMFI(data, 14);
 */
function calculateMFI(prices, period = 14) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period + 1) {
        throw new Error(`Insufficient data: need at least ${period + 1} points`);
    }
    // Calculate typical price and money flow
    const typicalPrices = prices.map(p => (p.high + p.low + p.close) / 3);
    const moneyFlow = typicalPrices.map((tp, i) => tp * prices[i].volume);
    const result = new Array(period).fill(NaN);
    for (let i = period; i < prices.length; i++) {
        let positiveFlow = 0;
        let negativeFlow = 0;
        for (let j = 1; j <= period; j++) {
            const idx = i - period + j;
            if (typicalPrices[idx] > typicalPrices[idx - 1]) {
                positiveFlow += moneyFlow[idx];
            }
            else if (typicalPrices[idx] < typicalPrices[idx - 1]) {
                negativeFlow += moneyFlow[idx];
            }
        }
        if (negativeFlow === 0) {
            result.push(100);
        }
        else {
            const moneyFlowRatio = positiveFlow / negativeFlow;
            const mfi = 100 - (100 / (1 + moneyFlowRatio));
            result.push(mfi);
        }
    }
    return result;
}
/**
 * Calculates Momentum Indicator
 *
 * Measures the rate of price change over a specified period.
 *
 * @param data - Array of closing prices
 * @param period - Number of periods (typically 10)
 * @returns Array of momentum values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [100, 102, 104, 103, 105, 107];
 * const momentum = calculateMomentum(prices, 4);
 */
function calculateMomentum(data, period = 10) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (data.length <= period) {
        throw new Error(`Insufficient data: need more than ${period} points`);
    }
    const result = new Array(period).fill(NaN);
    for (let i = period; i < data.length; i++) {
        result.push(data[i] - data[i - period]);
    }
    return result;
}
// ============================================================================
// Volatility Indicators
// ============================================================================
/**
 * Calculates Bollinger Bands
 *
 * Volatility bands placed above and below a moving average.
 *
 * @param data - Array of closing prices
 * @param period - Number of periods (typically 20)
 * @param stdDev - Number of standard deviations (typically 2)
 * @returns Upper band, middle band (SMA), and lower band
 * @throws Error if parameters are invalid or data is empty
 *
 * @example
 * const prices = [...prices];
 * const bb = calculateBollingerBands(prices, 20, 2);
 */
function calculateBollingerBands(data, period = 20, stdDev = 2) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (stdDev <= 0) {
        throw new Error(`Invalid standard deviation: ${stdDev}`);
    }
    if (data.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    const middle = calculateSMA(data, period);
    const upper = [];
    const lower = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            upper.push(NaN);
            lower.push(NaN);
        }
        else {
            // Calculate standard deviation for this window
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += Math.pow(data[i - j] - middle[i], 2);
            }
            const sd = Math.sqrt(sum / period);
            upper.push(middle[i] + (stdDev * sd));
            lower.push(middle[i] - (stdDev * sd));
        }
    }
    return { upper, middle, lower };
}
/**
 * Calculates Average True Range (ATR)
 *
 * Measures market volatility by decomposing the entire range of an asset price.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 14)
 * @returns Array of ATR values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const atr = calculateATR(data, 14);
 */
function calculateATR(prices, period = 14) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period + 1) {
        throw new Error(`Insufficient data: need at least ${period + 1} points`);
    }
    // Calculate True Range
    const tr = [NaN];
    for (let i = 1; i < prices.length; i++) {
        const high = prices[i].high;
        const low = prices[i].low;
        const prevClose = prices[i - 1].close;
        const trueRange = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
        tr.push(trueRange);
    }
    // Calculate ATR using smoothed moving average
    const result = new Array(period).fill(NaN);
    // First ATR is simple average
    let sum = 0;
    for (let i = 1; i <= period; i++) {
        sum += tr[i];
    }
    let atr = sum / period;
    result.push(atr);
    // Subsequent ATR values use smoothing
    for (let i = period + 1; i < prices.length; i++) {
        atr = (atr * (period - 1) + tr[i]) / period;
        result.push(atr);
    }
    return result;
}
/**
 * Calculates Keltner Channels
 *
 * Volatility-based envelopes set above and below an EMA.
 *
 * @param prices - Array of price data points
 * @param period - EMA period (typically 20)
 * @param atrPeriod - ATR period (typically 10)
 * @param multiplier - ATR multiplier (typically 2)
 * @returns Upper, middle, and lower channels
 * @throws Error if parameters are invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const keltner = calculateKeltnerChannels(data, 20, 10, 2);
 */
function calculateKeltnerChannels(prices, period = 20, atrPeriod = 10, multiplier = 2) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    const closePrices = prices.map(p => p.close);
    const middle = calculateEMA(closePrices, period);
    const atr = calculateATR(prices, atrPeriod);
    const upper = [];
    const lower = [];
    for (let i = 0; i < prices.length; i++) {
        if (Number.isNaN(middle[i]) || Number.isNaN(atr[i])) {
            upper.push(NaN);
            lower.push(NaN);
        }
        else {
            upper.push(middle[i] + (multiplier * atr[i]));
            lower.push(middle[i] - (multiplier * atr[i]));
        }
    }
    return { upper, middle, lower };
}
/**
 * Calculates Standard Deviation
 *
 * Measures the amount of variation or dispersion of prices.
 *
 * @param data - Array of numbers
 * @param period - Number of periods
 * @returns Array of standard deviation values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [10, 12, 11, 13, 14, 12];
 * const stdDev = calculateStandardDeviation(prices, 5);
 */
function calculateStandardDeviation(data, period) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (data.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    const result = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j];
        }
        const mean = sum / period;
        let variance = 0;
        for (let j = 0; j < period; j++) {
            variance += Math.pow(data[i - j] - mean, 2);
        }
        result.push(Math.sqrt(variance / period));
    }
    return result;
}
/**
 * Calculates Historic Volatility
 *
 * Annualized standard deviation of logarithmic returns.
 *
 * @param data - Array of closing prices
 * @param period - Number of periods (typically 30)
 * @param tradingDaysPerYear - Trading days per year (typically 252)
 * @returns Array of historic volatility values (annualized percentages)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [...prices];
 * const hv = calculateHistoricVolatility(prices, 30, 252);
 */
function calculateHistoricVolatility(data, period = 30, tradingDaysPerYear = 252) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (data.length < period + 1) {
        throw new Error(`Insufficient data: need at least ${period + 1} points`);
    }
    // Calculate logarithmic returns
    const logReturns = [NaN];
    for (let i = 1; i < data.length; i++) {
        if (data[i - 1] <= 0 || data[i] <= 0) {
            logReturns.push(NaN);
        }
        else {
            logReturns.push(Math.log(data[i] / data[i - 1]));
        }
    }
    const result = new Array(period).fill(NaN);
    for (let i = period; i < logReturns.length; i++) {
        let sum = 0;
        let count = 0;
        // Calculate mean
        for (let j = 0; j < period; j++) {
            if (!Number.isNaN(logReturns[i - j])) {
                sum += logReturns[i - j];
                count++;
            }
        }
        if (count === 0) {
            result.push(NaN);
            continue;
        }
        const mean = sum / count;
        // Calculate variance
        let variance = 0;
        for (let j = 0; j < period; j++) {
            if (!Number.isNaN(logReturns[i - j])) {
                variance += Math.pow(logReturns[i - j] - mean, 2);
            }
        }
        const stdDev = Math.sqrt(variance / count);
        const annualizedVolatility = stdDev * Math.sqrt(tradingDaysPerYear) * 100;
        result.push(annualizedVolatility);
    }
    return result;
}
/**
 * Calculates Donchian Channels
 *
 * Shows the highest high and lowest low over a specified period.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 20)
 * @returns Upper channel, middle line, and lower channel
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const donchian = calculateDonchianChannels(data, 20);
 */
function calculateDonchianChannels(prices, period = 20) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    const upper = new Array(period - 1).fill(NaN);
    const lower = new Array(period - 1).fill(NaN);
    const middle = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < prices.length; i++) {
        let highestHigh = -Infinity;
        let lowestLow = Infinity;
        for (let j = 0; j < period; j++) {
            highestHigh = Math.max(highestHigh, prices[i - j].high);
            lowestLow = Math.min(lowestLow, prices[i - j].low);
        }
        upper.push(highestHigh);
        lower.push(lowestLow);
        middle.push((highestHigh + lowestLow) / 2);
    }
    return { upper, middle, lower };
}
// ============================================================================
// Trend Indicators
// ============================================================================
/**
 * Calculates Average Directional Index (ADX)
 *
 * Measures the strength of a trend regardless of direction.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 14)
 * @returns Array of ADX values (0-100)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const adx = calculateADX(data, 14);
 */
function calculateADX(prices, period = 14) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period * 2) {
        throw new Error(`Insufficient data: need at least ${period * 2} points`);
    }
    // Calculate +DM, -DM, and TR
    const plusDM = [NaN];
    const minusDM = [NaN];
    const tr = [NaN];
    for (let i = 1; i < prices.length; i++) {
        const highDiff = prices[i].high - prices[i - 1].high;
        const lowDiff = prices[i - 1].low - prices[i].low;
        plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
        minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);
        tr.push(Math.max(prices[i].high - prices[i].low, Math.abs(prices[i].high - prices[i - 1].close), Math.abs(prices[i].low - prices[i - 1].close)));
    }
    const result = new Array(period * 2 - 1).fill(NaN);
    // Calculate smoothed +DM, -DM, and TR
    let smoothedPlusDM = 0;
    let smoothedMinusDM = 0;
    let smoothedTR = 0;
    for (let i = 1; i <= period; i++) {
        smoothedPlusDM += plusDM[i];
        smoothedMinusDM += minusDM[i];
        smoothedTR += tr[i];
    }
    const plusDI = [];
    const minusDI = [];
    for (let i = period; i < prices.length; i++) {
        if (i > period) {
            smoothedPlusDM = smoothedPlusDM - (smoothedPlusDM / period) + plusDM[i];
            smoothedMinusDM = smoothedMinusDM - (smoothedMinusDM / period) + minusDM[i];
            smoothedTR = smoothedTR - (smoothedTR / period) + tr[i];
        }
        const pdi = smoothedTR === 0 ? 0 : (smoothedPlusDM / smoothedTR) * 100;
        const mdi = smoothedTR === 0 ? 0 : (smoothedMinusDM / smoothedTR) * 100;
        plusDI.push(pdi);
        minusDI.push(mdi);
    }
    // Calculate DX and ADX
    const dx = [];
    for (let i = 0; i < plusDI.length; i++) {
        const sum = plusDI[i] + minusDI[i];
        if (sum === 0) {
            dx.push(0);
        }
        else {
            dx.push((Math.abs(plusDI[i] - minusDI[i]) / sum) * 100);
        }
    }
    // First ADX is average of first 'period' DX values
    let adxSum = 0;
    for (let i = 0; i < period && i < dx.length; i++) {
        adxSum += dx[i];
    }
    let adx = adxSum / period;
    result.push(adx);
    // Subsequent ADX values
    for (let i = period; i < dx.length; i++) {
        adx = (adx * (period - 1) + dx[i]) / period;
        result.push(adx);
    }
    return result;
}
/**
 * Calculates Aroon Indicator
 *
 * Identifies trend changes and strength by measuring time between highs and lows.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 25)
 * @returns Aroon Up and Aroon Down lines
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const aroon = calculateAroon(data, 25);
 */
function calculateAroon(prices, period = 25) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    const up = new Array(period - 1).fill(NaN);
    const down = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < prices.length; i++) {
        let highestIdx = 0;
        let lowestIdx = 0;
        let highestHigh = -Infinity;
        let lowestLow = Infinity;
        for (let j = 0; j < period; j++) {
            const idx = i - j;
            if (prices[idx].high >= highestHigh) {
                highestHigh = prices[idx].high;
                highestIdx = j;
            }
            if (prices[idx].low <= lowestLow) {
                lowestLow = prices[idx].low;
                lowestIdx = j;
            }
        }
        up.push(((period - highestIdx) / period) * 100);
        down.push(((period - lowestIdx) / period) * 100);
    }
    return { up, down };
}
/**
 * Calculates Parabolic SAR (Stop and Reverse)
 *
 * Provides potential entry and exit points by plotting points on a chart.
 *
 * @param prices - Array of price data points
 * @param accelerationFactor - Initial acceleration factor (typically 0.02)
 * @param maxAcceleration - Maximum acceleration factor (typically 0.20)
 * @returns Array of SAR values
 * @throws Error if parameters are invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const sar = calculateParabolicSAR(data, 0.02, 0.20);
 */
function calculateParabolicSAR(prices, accelerationFactor = 0.02, maxAcceleration = 0.20) {
    if (prices.length < 2) {
        throw new Error('Insufficient data: need at least 2 points');
    }
    if (accelerationFactor <= 0 || accelerationFactor > maxAcceleration) {
        throw new Error('Invalid acceleration factor');
    }
    const result = [];
    let isUptrend = prices[1].close > prices[0].close;
    let sar = isUptrend ? prices[0].low : prices[0].high;
    let ep = isUptrend ? prices[0].high : prices[0].low;
    let af = accelerationFactor;
    result.push(sar);
    for (let i = 1; i < prices.length; i++) {
        const prevSAR = sar;
        // Calculate new SAR
        sar = prevSAR + af * (ep - prevSAR);
        // Check for reversal
        if (isUptrend) {
            if (prices[i].low <= sar) {
                isUptrend = false;
                sar = ep;
                ep = prices[i].low;
                af = accelerationFactor;
            }
            else {
                if (prices[i].high > ep) {
                    ep = prices[i].high;
                    af = Math.min(af + accelerationFactor, maxAcceleration);
                }
                // Ensure SAR doesn't go above previous two lows
                sar = Math.min(sar, prices[i - 1].low);
                if (i > 1) {
                    sar = Math.min(sar, prices[i - 2].low);
                }
            }
        }
        else {
            if (prices[i].high >= sar) {
                isUptrend = true;
                sar = ep;
                ep = prices[i].high;
                af = accelerationFactor;
            }
            else {
                if (prices[i].low < ep) {
                    ep = prices[i].low;
                    af = Math.min(af + accelerationFactor, maxAcceleration);
                }
                // Ensure SAR doesn't go below previous two highs
                sar = Math.max(sar, prices[i - 1].high);
                if (i > 1) {
                    sar = Math.max(sar, prices[i - 2].high);
                }
            }
        }
        result.push(sar);
    }
    return result;
}
/**
 * Calculates Supertrend Indicator
 *
 * Trend-following indicator similar to moving averages.
 *
 * @param prices - Array of price data points
 * @param period - ATR period (typically 10)
 * @param multiplier - ATR multiplier (typically 3)
 * @returns Supertrend values and trend direction
 * @throws Error if parameters are invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const supertrend = calculateSupertrend(data, 10, 3);
 */
function calculateSupertrend(prices, period = 10, multiplier = 3) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (multiplier <= 0) {
        throw new Error(`Invalid multiplier: ${multiplier}`);
    }
    const atr = calculateATR(prices, period);
    const supertrend = [];
    const direction = [];
    for (let i = 0; i < prices.length; i++) {
        if (Number.isNaN(atr[i])) {
            supertrend.push(NaN);
            direction.push(NaN);
            continue;
        }
        const hl2 = (prices[i].high + prices[i].low) / 2;
        const basicUpperBand = hl2 + (multiplier * atr[i]);
        const basicLowerBand = hl2 - (multiplier * atr[i]);
        let finalUpperBand = basicUpperBand;
        let finalLowerBand = basicLowerBand;
        if (i > 0 && !Number.isNaN(supertrend[i - 1])) {
            finalUpperBand = basicUpperBand < supertrend[i - 1] || prices[i - 1].close > supertrend[i - 1]
                ? basicUpperBand
                : supertrend[i - 1];
            finalLowerBand = basicLowerBand > supertrend[i - 1] || prices[i - 1].close < supertrend[i - 1]
                ? basicLowerBand
                : supertrend[i - 1];
        }
        let currentSupertrend;
        let currentDirection;
        if (i === 0 || Number.isNaN(supertrend[i - 1])) {
            currentSupertrend = finalUpperBand;
            currentDirection = -1;
        }
        else if (supertrend[i - 1] === finalUpperBand) {
            currentSupertrend = prices[i].close <= finalUpperBand ? finalUpperBand : finalLowerBand;
            currentDirection = prices[i].close <= finalUpperBand ? -1 : 1;
        }
        else {
            currentSupertrend = prices[i].close >= finalLowerBand ? finalLowerBand : finalUpperBand;
            currentDirection = prices[i].close >= finalLowerBand ? 1 : -1;
        }
        supertrend.push(currentSupertrend);
        direction.push(currentDirection);
    }
    return { supertrend, direction };
}
/**
 * Calculates Linear Regression
 *
 * Fits a linear trend line to price data.
 *
 * @param data - Array of numbers (typically closing prices)
 * @param period - Number of periods
 * @returns Array of linear regression values
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const prices = [10, 11, 12, 11, 13, 14];
 * const linreg = calculateLinearRegression(prices, 5);
 */
function calculateLinearRegression(data, period) {
    if (period <= 1 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}. Must be greater than 1.`);
    }
    if (data.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    const result = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < data.length; i++) {
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumX2 = 0;
        for (let j = 0; j < period; j++) {
            const x = j;
            const y = data[i - period + 1 + j];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }
        const n = period;
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        // Return the regression value at the current point
        result.push(slope * (period - 1) + intercept);
    }
    return result;
}
// ============================================================================
// Volume Indicators
// ============================================================================
/**
 * Calculates On-Balance Volume (OBV)
 *
 * Relates volume to price change to measure buying and selling pressure.
 *
 * @param prices - Array of price data points
 * @returns Array of OBV values
 * @throws Error if data is empty
 *
 * @example
 * const data = [...priceData];
 * const obv = calculateOBV(data);
 */
function calculateOBV(prices) {
    if (prices.length === 0) {
        throw new Error('Price data cannot be empty');
    }
    const result = [0];
    let obv = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i].close > prices[i - 1].close) {
            obv += prices[i].volume;
        }
        else if (prices[i].close < prices[i - 1].close) {
            obv -= prices[i].volume;
        }
        result.push(obv);
    }
    return result;
}
/**
 * Calculates Volume-Weighted Average Price (VWAP)
 *
 * Provides the average price weighted by volume.
 *
 * @param prices - Array of price data points (should represent single trading day)
 * @returns Array of cumulative VWAP values
 * @throws Error if data is empty
 *
 * @example
 * const data = [...dayPriceData];
 * const vwap = calculateVWAP(data);
 */
function calculateVWAP(prices) {
    if (prices.length === 0) {
        throw new Error('Price data cannot be empty');
    }
    const result = [];
    let cumulativePV = 0;
    let cumulativeVolume = 0;
    for (let i = 0; i < prices.length; i++) {
        const typicalPrice = (prices[i].high + prices[i].low + prices[i].close) / 3;
        cumulativePV += typicalPrice * prices[i].volume;
        cumulativeVolume += prices[i].volume;
        if (cumulativeVolume === 0) {
            result.push(NaN);
        }
        else {
            result.push(cumulativePV / cumulativeVolume);
        }
    }
    return result;
}
/**
 * Calculates Volume Price Trend (VPT)
 *
 * Combines price and volume to show cumulative volume based on price changes.
 *
 * @param prices - Array of price data points
 * @returns Array of VPT values
 * @throws Error if data is empty
 *
 * @example
 * const data = [...priceData];
 * const vpt = calculateVPT(data);
 */
function calculateVPT(prices) {
    if (prices.length === 0) {
        throw new Error('Price data cannot be empty');
    }
    const result = [0];
    let vpt = 0;
    for (let i = 1; i < prices.length; i++) {
        const priceChange = (prices[i].close - prices[i - 1].close) / prices[i - 1].close;
        vpt += prices[i].volume * priceChange;
        result.push(vpt);
    }
    return result;
}
/**
 * Calculates Accumulation/Distribution Line
 *
 * Measures cumulative flow of money into and out of a security.
 *
 * @param prices - Array of price data points
 * @returns Array of A/D Line values
 * @throws Error if data is empty
 *
 * @example
 * const data = [...priceData];
 * const ad = calculateAccumulationDistribution(data);
 */
function calculateAccumulationDistribution(prices) {
    if (prices.length === 0) {
        throw new Error('Price data cannot be empty');
    }
    const result = [];
    let ad = 0;
    for (let i = 0; i < prices.length; i++) {
        const range = prices[i].high - prices[i].low;
        if (range === 0) {
            result.push(ad);
        }
        else {
            const moneyFlowMultiplier = ((prices[i].close - prices[i].low) - (prices[i].high - prices[i].close)) / range;
            const moneyFlowVolume = moneyFlowMultiplier * prices[i].volume;
            ad += moneyFlowVolume;
            result.push(ad);
        }
    }
    return result;
}
/**
 * Calculates Chaikin Money Flow (CMF)
 *
 * Measures the amount of Money Flow Volume over a specific period.
 *
 * @param prices - Array of price data points
 * @param period - Number of periods (typically 20 or 21)
 * @returns Array of CMF values (-1 to +1)
 * @throws Error if period is invalid or data is empty
 *
 * @example
 * const data = [...priceData];
 * const cmf = calculateChaikinMoneyFlow(data, 20);
 */
function calculateChaikinMoneyFlow(prices, period = 20) {
    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`Invalid period: ${period}`);
    }
    if (prices.length < period) {
        throw new Error(`Insufficient data: need at least ${period} points`);
    }
    const result = new Array(period - 1).fill(NaN);
    for (let i = period - 1; i < prices.length; i++) {
        let sumMoneyFlowVolume = 0;
        let sumVolume = 0;
        for (let j = 0; j < period; j++) {
            const idx = i - j;
            const range = prices[idx].high - prices[idx].low;
            if (range === 0) {
                continue;
            }
            const moneyFlowMultiplier = ((prices[idx].close - prices[idx].low) - (prices[idx].high - prices[idx].close)) / range;
            const moneyFlowVolume = moneyFlowMultiplier * prices[idx].volume;
            sumMoneyFlowVolume += moneyFlowVolume;
            sumVolume += prices[idx].volume;
        }
        if (sumVolume === 0) {
            result.push(0);
        }
        else {
            result.push(sumMoneyFlowVolume / sumVolume);
        }
    }
    return result;
}
// ============================================================================
// Fibonacci Analysis
// ============================================================================
/**
 * Calculates Fibonacci Retracement Levels
 *
 * Identifies potential support and resistance levels based on Fibonacci ratios.
 *
 * @param high - Highest price point in the trend
 * @param low - Lowest price point in the trend
 * @returns Object containing all Fibonacci retracement levels
 *
 * @example
 * const levels = calculateFibonacciRetracement(150, 100);
 * // Returns: { level0: 100, level236: 111.8, level382: 119.1, ... }
 */
function calculateFibonacciRetracement(high, low) {
    if (high <= low) {
        throw new Error('High must be greater than low');
    }
    const diff = high - low;
    return {
        level0: low,
        level236: low + diff * 0.236,
        level382: low + diff * 0.382,
        level500: low + diff * 0.500,
        level618: low + diff * 0.618,
        level786: low + diff * 0.786,
        level100: high
    };
}
/**
 * Calculates Fibonacci Extension Levels
 *
 * Projects potential price targets beyond the current trend.
 *
 * @param high - Highest price point in the trend
 * @param low - Lowest price point in the trend
 * @param retracementLevel - Current retracement level price
 * @returns Object containing Fibonacci extension levels
 *
 * @example
 * const extensions = calculateFibonacciExtension(150, 100, 120);
 */
function calculateFibonacciExtension(high, low, retracementLevel) {
    if (high <= low) {
        throw new Error('High must be greater than low');
    }
    const diff = high - low;
    return {
        ext618: retracementLevel + diff * 0.618,
        ext1000: retracementLevel + diff * 1.000,
        ext1618: retracementLevel + diff * 1.618,
        ext2618: retracementLevel + diff * 2.618
    };
}
/**
 * Calculates Fibonacci Fan Lines
 *
 * Creates trend lines based on Fibonacci ratios.
 *
 * @param startPrice - Starting price point
 * @param endPrice - Ending price point
 * @param startIndex - Starting index (time)
 * @param endIndex - Ending index (time)
 * @returns Functions for each fan line that calculate price at given index
 *
 * @example
 * const fan = calculateFibonacciFan(100, 150, 0, 50);
 * const priceAt25 = fan.line382(25);
 */
function calculateFibonacciFan(startPrice, endPrice, startIndex, endIndex) {
    if (endIndex <= startIndex) {
        throw new Error('End index must be greater than start index');
    }
    const priceRange = endPrice - startPrice;
    const indexRange = endIndex - startIndex;
    const createLine = (ratio) => (index) => {
        const progress = (index - startIndex) / indexRange;
        return startPrice + priceRange * ratio * progress;
    };
    return {
        line236: createLine(0.236),
        line382: createLine(0.382),
        line500: createLine(0.500),
        line618: createLine(0.618)
    };
}
/**
 * Calculates Fibonacci Arc Levels
 *
 * Creates curved support/resistance levels based on Fibonacci ratios.
 *
 * @param startPrice - Starting price point
 * @param endPrice - Ending price point
 * @param startIndex - Starting index (time)
 * @param endIndex - Ending index (time)
 * @returns Functions for each arc that calculate price at given index
 *
 * @example
 * const arcs = calculateFibonacciArcs(100, 150, 0, 50);
 * const priceAt30 = arcs.arc382(30);
 */
function calculateFibonacciArcs(startPrice, endPrice, startIndex, endIndex) {
    if (endIndex <= startIndex) {
        throw new Error('End index must be greater than start index');
    }
    const priceRange = Math.abs(endPrice - startPrice);
    const indexRange = endIndex - startIndex;
    const isUptrend = endPrice > startPrice;
    const createArc = (ratio) => (index) => {
        const radius = priceRange * ratio;
        const timeProgress = (index - startIndex) / indexRange;
        if (timeProgress < 0 || timeProgress > 1) {
            return NaN;
        }
        const angle = timeProgress * Math.PI;
        const arcHeight = radius * Math.sin(angle);
        return isUptrend
            ? startPrice + arcHeight
            : startPrice - arcHeight;
    };
    return {
        arc382: createArc(0.382),
        arc500: createArc(0.500),
        arc618: createArc(0.618)
    };
}
// ============================================================================
// Pivot Points & Support/Resistance
// ============================================================================
/**
 * Calculates Standard Pivot Points
 *
 * Classic pivot point calculation used to identify potential support and resistance levels.
 *
 * @param high - Previous period high
 * @param low - Previous period low
 * @param close - Previous period close
 * @returns Pivot point and support/resistance levels
 *
 * @example
 * const pivots = calculatePivotPoints(152.50, 148.20, 151.00);
 */
function calculatePivotPoints(high, low, close) {
    if (high < low) {
        throw new Error('High cannot be less than low');
    }
    const pivot = (high + low + close) / 3;
    return {
        pivot,
        r1: 2 * pivot - low,
        r2: pivot + (high - low),
        r3: high + 2 * (pivot - low),
        s1: 2 * pivot - high,
        s2: pivot - (high - low),
        s3: low - 2 * (high - pivot)
    };
}
/**
 * Calculates Fibonacci Pivot Points
 *
 * Pivot points based on Fibonacci ratios.
 *
 * @param high - Previous period high
 * @param low - Previous period low
 * @param close - Previous period close
 * @returns Fibonacci-based pivot levels
 *
 * @example
 * const fibPivots = calculateFibonacciPivots(152.50, 148.20, 151.00);
 */
function calculateFibonacciPivots(high, low, close) {
    if (high < low) {
        throw new Error('High cannot be less than low');
    }
    const pivot = (high + low + close) / 3;
    const range = high - low;
    return {
        pivot,
        r1: pivot + range * 0.382,
        r2: pivot + range * 0.618,
        r3: pivot + range * 1.000,
        s1: pivot - range * 0.382,
        s2: pivot - range * 0.618,
        s3: pivot - range * 1.000
    };
}
/**
 * Calculates Camarilla Pivot Points
 *
 * Intraday pivot points that identify potential reversal points.
 *
 * @param high - Previous period high
 * @param low - Previous period low
 * @param close - Previous period close
 * @returns Camarilla pivot levels
 *
 * @example
 * const camarilla = calculateCamarillaPivots(152.50, 148.20, 151.00);
 */
function calculateCamarillaPivots(high, low, close) {
    if (high < low) {
        throw new Error('High cannot be less than low');
    }
    const range = high - low;
    const pivot = close;
    return {
        pivot,
        r1: close + range * 1.1 / 12,
        r2: close + range * 1.1 / 6,
        r3: close + range * 1.1 / 4,
        s1: close - range * 1.1 / 12,
        s2: close - range * 1.1 / 6,
        s3: close - range * 1.1 / 4
    };
}
/**
 * Identifies Support and Resistance Levels
 *
 * Finds significant price levels where the price has historically reversed.
 *
 * @param prices - Array of price data points
 * @param lookback - Number of periods to look back (typically 20-50)
 * @param threshold - Minimum number of touches to confirm level (typically 2-3)
 * @returns Arrays of support and resistance levels
 *
 * @example
 * const data = [...priceData];
 * const levels = identifySupportResistance(data, 50, 3);
 */
function identifySupportResistance(prices, lookback = 50, threshold = 2) {
    if (prices.length < lookback) {
        throw new Error(`Insufficient data: need at least ${lookback} points`);
    }
    const support = [];
    const resistance = [];
    const tolerance = 0.01; // 1% tolerance for level matching
    // Find local minima (potential support)
    for (let i = 2; i < prices.length - 2; i++) {
        const isLocalMin = prices[i].low < prices[i - 1].low &&
            prices[i].low < prices[i - 2].low &&
            prices[i].low < prices[i + 1].low &&
            prices[i].low < prices[i + 2].low;
        if (isLocalMin) {
            const level = prices[i].low;
            let touches = 1;
            // Count touches within lookback period
            const start = Math.max(0, i - lookback);
            const end = Math.min(prices.length, i + lookback);
            for (let j = start; j < end; j++) {
                if (j !== i && Math.abs(prices[j].low - level) / level < tolerance) {
                    touches++;
                }
            }
            if (touches >= threshold && !support.some(s => Math.abs(s - level) / level < tolerance)) {
                support.push(level);
            }
        }
    }
    // Find local maxima (potential resistance)
    for (let i = 2; i < prices.length - 2; i++) {
        const isLocalMax = prices[i].high > prices[i - 1].high &&
            prices[i].high > prices[i - 2].high &&
            prices[i].high > prices[i + 1].high &&
            prices[i].high > prices[i + 2].high;
        if (isLocalMax) {
            const level = prices[i].high;
            let touches = 1;
            // Count touches within lookback period
            const start = Math.max(0, i - lookback);
            const end = Math.min(prices.length, i + lookback);
            for (let j = start; j < end; j++) {
                if (j !== i && Math.abs(prices[j].high - level) / level < tolerance) {
                    touches++;
                }
            }
            if (touches >= threshold && !resistance.some(r => Math.abs(r - level) / level < tolerance)) {
                resistance.push(level);
            }
        }
    }
    return {
        support: support.sort((a, b) => b - a),
        resistance: resistance.sort((a, b) => a - b)
    };
}
// ============================================================================
// Ichimoku Cloud
// ============================================================================
/**
 * Calculates Ichimoku Cloud Components
 *
 * Comprehensive indicator showing support, resistance, trend direction, and momentum.
 *
 * @param prices - Array of price data points
 * @param tenkanPeriod - Conversion Line period (typically 9)
 * @param kijunPeriod - Base Line period (typically 26)
 * @param senkouSpanBPeriod - Leading Span B period (typically 52)
 * @param displacement - Displacement for cloud (typically 26)
 * @returns All Ichimoku Cloud components
 *
 * @example
 * const data = [...priceData];
 * const ichimoku = calculateIchimoku(data, 9, 26, 52, 26);
 */
function calculateIchimoku(prices, tenkanPeriod = 9, kijunPeriod = 26, senkouSpanBPeriod = 52, displacement = 26) {
    if (prices.length < Math.max(tenkanPeriod, kijunPeriod, senkouSpanBPeriod)) {
        throw new Error('Insufficient data for Ichimoku calculation');
    }
    const calculateHighLowAverage = (startIdx, period) => {
        let highest = -Infinity;
        let lowest = Infinity;
        for (let i = 0; i < period && startIdx - i >= 0; i++) {
            highest = Math.max(highest, prices[startIdx - i].high);
            lowest = Math.min(lowest, prices[startIdx - i].low);
        }
        return (highest + lowest) / 2;
    };
    const tenkanSen = [];
    const kijunSen = [];
    const senkouSpanA = [];
    const senkouSpanB = [];
    const chikouSpan = [];
    for (let i = 0; i < prices.length; i++) {
        // Tenkan-sen (Conversion Line)
        if (i >= tenkanPeriod - 1) {
            tenkanSen.push(calculateHighLowAverage(i, tenkanPeriod));
        }
        else {
            tenkanSen.push(NaN);
        }
        // Kijun-sen (Base Line)
        if (i >= kijunPeriod - 1) {
            kijunSen.push(calculateHighLowAverage(i, kijunPeriod));
        }
        else {
            kijunSen.push(NaN);
        }
        // Senkou Span A (Leading Span A)
        if (i >= kijunPeriod - 1) {
            const spanA = (tenkanSen[i] + kijunSen[i]) / 2;
            senkouSpanA.push(spanA);
        }
        else {
            senkouSpanA.push(NaN);
        }
        // Senkou Span B (Leading Span B)
        if (i >= senkouSpanBPeriod - 1) {
            senkouSpanB.push(calculateHighLowAverage(i, senkouSpanBPeriod));
        }
        else {
            senkouSpanB.push(NaN);
        }
        // Chikou Span (Lagging Span) - displaced backwards
        chikouSpan.push(prices[i].close);
    }
    // Apply displacement to Senkou Spans (shift forward)
    const displacedSenkouA = new Array(displacement).fill(NaN).concat(senkouSpanA);
    const displacedSenkouB = new Array(displacement).fill(NaN).concat(senkouSpanB);
    // Trim to match original length
    displacedSenkouA.length = prices.length;
    displacedSenkouB.length = prices.length;
    return {
        tenkanSen,
        kijunSen,
        senkouSpanA: displacedSenkouA,
        senkouSpanB: displacedSenkouB,
        chikouSpan
    };
}
// ============================================================================
// Candlestick Pattern Recognition
// ============================================================================
/**
 * Detects Doji Candlestick Pattern
 *
 * Identifies when open and close prices are nearly equal.
 *
 * @param candle - Single price point
 * @param threshold - Maximum body-to-range ratio to consider as Doji (typically 0.1)
 * @returns True if Doji pattern detected
 *
 * @example
 * const candle = { timestamp: 1, open: 100, high: 102, low: 99, close: 100.5, volume: 1000 };
 * const isDoji = detectDoji(candle);
 */
function detectDoji(candle, threshold = 0.1) {
    const range = candle.high - candle.low;
    if (range === 0)
        return true;
    const bodySize = Math.abs(candle.close - candle.open);
    return (bodySize / range) <= threshold;
}
/**
 * Detects Hammer Candlestick Pattern
 *
 * Bullish reversal pattern with small body at top and long lower shadow.
 *
 * @param candle - Single price point
 * @param prevCandles - Previous 2-3 candles for context
 * @returns Detection result with pattern strength
 *
 * @example
 * const current = { timestamp: 3, open: 100, high: 102, low: 95, close: 101, volume: 1000 };
 * const prev = [...previousCandles];
 * const hammer = detectHammer(current, prev);
 */
function detectHammer(candle, prevCandles) {
    const range = candle.high - candle.low;
    if (range === 0)
        return null;
    const body = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    // Hammer criteria
    const hasSmallBody = body / range < 0.3;
    const hasLongLowerShadow = lowerShadow > body * 2;
    const hasSmallUpperShadow = upperShadow < body * 0.5;
    // Check if in downtrend
    const isInDowntrend = prevCandles.length >= 2 &&
        prevCandles[prevCandles.length - 1].close < prevCandles[0].close;
    if (hasSmallBody && hasLongLowerShadow && hasSmallUpperShadow) {
        const strength = isInDowntrend ? 'strong' : 'moderate';
        return {
            pattern: 'Hammer',
            strength: strength,
            bullish: true
        };
    }
    return null;
}
/**
 * Detects Bullish/Bearish Engulfing Pattern
 *
 * Two-candle pattern where second candle completely engulfs the first.
 *
 * @param candle1 - First (earlier) candle
 * @param candle2 - Second (current) candle
 * @returns Detection result or null
 *
 * @example
 * const prev = { timestamp: 1, open: 100, high: 102, low: 99, close: 99.5, volume: 1000 };
 * const curr = { timestamp: 2, open: 99, high: 103, low: 98, close: 102, volume: 1200 };
 * const engulfing = detectEngulfing(prev, curr);
 */
function detectEngulfing(candle1, candle2) {
    const body1Open = candle1.open;
    const body1Close = candle1.close;
    const body2Open = candle2.open;
    const body2Close = candle2.close;
    // Bullish Engulfing
    if (body1Close < body1Open && body2Close > body2Open) {
        if (body2Close > body1Open && body2Open < body1Close) {
            return {
                pattern: 'Bullish Engulfing',
                strength: 'strong',
                bullish: true
            };
        }
    }
    // Bearish Engulfing
    if (body1Close > body1Open && body2Close < body2Open) {
        if (body2Open > body1Close && body2Close < body1Open) {
            return {
                pattern: 'Bearish Engulfing',
                strength: 'strong',
                bullish: false
            };
        }
    }
    return null;
}
/**
 * Detects Morning Star / Evening Star Pattern
 *
 * Three-candle reversal pattern.
 *
 * @param candles - Array of exactly 3 consecutive candles
 * @returns Detection result or null
 *
 * @example
 * const threeCandles = [candle1, candle2, candle3];
 * const star = detectMorningEveningStar(threeCandles);
 */
function detectMorningEveningStar(candles) {
    if (candles.length !== 3) {
        throw new Error('Exactly 3 candles required');
    }
    const [c1, c2, c3] = candles;
    const body1 = Math.abs(c1.close - c1.open);
    const body2 = Math.abs(c2.close - c2.open);
    const body3 = Math.abs(c3.close - c3.open);
    // Morning Star (Bullish)
    if (c1.close < c1.open && c3.close > c3.open) {
        const hasGapDown = c2.high < c1.close;
        const hasGapUp = c3.open > c2.high;
        const hasSmallMiddle = body2 < body1 * 0.3 && body2 < body3 * 0.3;
        const thirdClosesHigh = c3.close > (c1.open + c1.close) / 2;
        if (hasSmallMiddle && thirdClosesHigh && (hasGapDown || hasGapUp)) {
            return {
                pattern: 'Morning Star',
                strength: 'strong',
                bullish: true
            };
        }
    }
    // Evening Star (Bearish)
    if (c1.close > c1.open && c3.close < c3.open) {
        const hasGapUp = c2.low > c1.close;
        const hasGapDown = c3.open < c2.low;
        const hasSmallMiddle = body2 < body1 * 0.3 && body2 < body3 * 0.3;
        const thirdClosesLow = c3.close < (c1.open + c1.close) / 2;
        if (hasSmallMiddle && thirdClosesLow && (hasGapUp || hasGapDown)) {
            return {
                pattern: 'Evening Star',
                strength: 'strong',
                bullish: false
            };
        }
    }
    return null;
}
/**
 * Detects Harami Pattern
 *
 * Two-candle pattern where second candle is contained within first candle's body.
 *
 * @param candle1 - First (earlier) candle
 * @param candle2 - Second (current) candle
 * @returns Detection result or null
 *
 * @example
 * const prev = { timestamp: 1, open: 95, high: 105, low: 94, close: 104, volume: 1000 };
 * const curr = { timestamp: 2, open: 102, high: 103, low: 101, close: 101.5, volume: 800 };
 * const harami = detectHarami(prev, curr);
 */
function detectHarami(candle1, candle2) {
    const body1High = Math.max(candle1.open, candle1.close);
    const body1Low = Math.min(candle1.open, candle1.close);
    const body2High = Math.max(candle2.open, candle2.close);
    const body2Low = Math.min(candle2.open, candle2.close);
    // Check if second candle is inside first candle's body
    if (body2High < body1High && body2Low > body1Low) {
        // Bullish Harami
        if (candle1.close < candle1.open && candle2.close > candle2.open) {
            return {
                pattern: 'Bullish Harami',
                strength: 'moderate',
                bullish: true
            };
        }
        // Bearish Harami
        if (candle1.close > candle1.open && candle2.close < candle2.open) {
            return {
                pattern: 'Bearish Harami',
                strength: 'moderate',
                bullish: false
            };
        }
    }
    return null;
}
/**
 * Detects Shooting Star Pattern
 *
 * Bearish reversal pattern with small body at bottom and long upper shadow.
 *
 * @param candle - Single price point
 * @param prevCandles - Previous 2-3 candles for context
 * @returns Detection result or null
 *
 * @example
 * const current = { timestamp: 3, open: 100, high: 108, low: 99, close: 101, volume: 1000 };
 * const prev = [...previousCandles];
 * const shootingStar = detectShootingStar(current, prev);
 */
function detectShootingStar(candle, prevCandles) {
    const range = candle.high - candle.low;
    if (range === 0)
        return null;
    const body = Math.abs(candle.close - candle.open);
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    // Shooting Star criteria
    const hasSmallBody = body / range < 0.3;
    const hasLongUpperShadow = upperShadow > body * 2;
    const hasSmallLowerShadow = lowerShadow < body * 0.5;
    // Check if in uptrend
    const isInUptrend = prevCandles.length >= 2 &&
        prevCandles[prevCandles.length - 1].close > prevCandles[0].close;
    if (hasSmallBody && hasLongUpperShadow && hasSmallLowerShadow) {
        const strength = isInUptrend ? 'strong' : 'moderate';
        return {
            pattern: 'Shooting Star',
            strength: strength,
            bullish: false
        };
    }
    return null;
}
/**
 * Detects Hanging Man Pattern
 *
 * Bearish reversal pattern similar to hammer but appears in uptrend.
 *
 * @param candle - Single price point
 * @param prevCandles - Previous candles showing uptrend
 * @returns Detection result or null
 *
 * @example
 * const current = { timestamp: 3, open: 100, high: 102, low: 95, close: 101, volume: 1000 };
 * const prev = [...uptrendCandles];
 * const hangingMan = detectHangingMan(current, prev);
 */
function detectHangingMan(candle, prevCandles) {
    const range = candle.high - candle.low;
    if (range === 0)
        return null;
    const body = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    // Hanging Man has same structure as Hammer
    const hasSmallBody = body / range < 0.3;
    const hasLongLowerShadow = lowerShadow > body * 2;
    const hasSmallUpperShadow = upperShadow < body * 0.5;
    // MUST be in uptrend (this is what differentiates it from Hammer)
    const isInUptrend = prevCandles.length >= 2 &&
        prevCandles[prevCandles.length - 1].close > prevCandles[0].close;
    if (hasSmallBody && hasLongLowerShadow && hasSmallUpperShadow && isInUptrend) {
        return {
            pattern: 'Hanging Man',
            strength: 'strong',
            bullish: false
        };
    }
    return null;
}
//# sourceMappingURL=technical-analysis-kit.js.map