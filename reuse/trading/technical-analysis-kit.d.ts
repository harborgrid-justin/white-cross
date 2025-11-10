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
/**
 * Represents a single price data point (OHLCV)
 */
export interface PricePoint {
    /** Unix timestamp in milliseconds */
    timestamp: number;
    /** Opening price */
    open: number;
    /** Highest price */
    high: number;
    /** Lowest price */
    low: number;
    /** Closing price */
    close: number;
    /** Trading volume */
    volume: number;
}
/**
 * Result type for calculations that may fail
 */
export type CalculationResult<T> = {
    success: true;
    value: T;
} | {
    success: false;
    error: string;
};
/**
 * Bollinger Bands calculation result
 */
export interface BollingerBands {
    upper: number[];
    middle: number[];
    lower: number[];
}
/**
 * MACD indicator result
 */
export interface MACDResult {
    macd: number[];
    signal: number[];
    histogram: number[];
}
/**
 * Stochastic Oscillator result
 */
export interface StochasticResult {
    k: number[];
    d: number[];
}
/**
 * Ichimoku Cloud result
 */
export interface IchimokuCloud {
    tenkanSen: number[];
    kijunSen: number[];
    senkouSpanA: number[];
    senkouSpanB: number[];
    chikouSpan: number[];
}
/**
 * Fibonacci levels
 */
export interface FibonacciLevels {
    level0: number;
    level236: number;
    level382: number;
    level500: number;
    level618: number;
    level786: number;
    level100: number;
}
/**
 * Pivot points
 */
export interface PivotPoints {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
}
/**
 * Candlestick pattern detection result
 */
export interface CandlestickPattern {
    pattern: string;
    strength: 'weak' | 'moderate' | 'strong';
    bullish: boolean;
}
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
export declare function calculateSMA(data: readonly number[], period: number): number[];
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
export declare function calculateEMA(data: readonly number[], period: number): number[];
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
export declare function calculateWMA(data: readonly number[], period: number): number[];
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
export declare function calculateVWMA(prices: readonly PricePoint[], period: number): number[];
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
export declare function calculateDEMA(data: readonly number[], period: number): number[];
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
export declare function calculateTEMA(data: readonly number[], period: number): number[];
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
export declare function calculateHMA(data: readonly number[], period: number): number[];
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
export declare function calculateRSI(data: readonly number[], period?: number): number[];
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
export declare function calculateMACD(data: readonly number[], fastPeriod?: number, slowPeriod?: number, signalPeriod?: number): MACDResult;
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
export declare function calculateStochastic(prices: readonly PricePoint[], kPeriod?: number, dPeriod?: number): StochasticResult;
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
export declare function calculateROC(data: readonly number[], period?: number): number[];
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
export declare function calculateWilliamsR(prices: readonly PricePoint[], period?: number): number[];
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
export declare function calculateCCI(prices: readonly PricePoint[], period?: number): number[];
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
export declare function calculateMFI(prices: readonly PricePoint[], period?: number): number[];
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
export declare function calculateMomentum(data: readonly number[], period?: number): number[];
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
export declare function calculateBollingerBands(data: readonly number[], period?: number, stdDev?: number): BollingerBands;
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
export declare function calculateATR(prices: readonly PricePoint[], period?: number): number[];
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
export declare function calculateKeltnerChannels(prices: readonly PricePoint[], period?: number, atrPeriod?: number, multiplier?: number): {
    upper: number[];
    middle: number[];
    lower: number[];
};
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
export declare function calculateStandardDeviation(data: readonly number[], period: number): number[];
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
export declare function calculateHistoricVolatility(data: readonly number[], period?: number, tradingDaysPerYear?: number): number[];
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
export declare function calculateDonchianChannels(prices: readonly PricePoint[], period?: number): {
    upper: number[];
    middle: number[];
    lower: number[];
};
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
export declare function calculateADX(prices: readonly PricePoint[], period?: number): number[];
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
export declare function calculateAroon(prices: readonly PricePoint[], period?: number): {
    up: number[];
    down: number[];
};
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
export declare function calculateParabolicSAR(prices: readonly PricePoint[], accelerationFactor?: number, maxAcceleration?: number): number[];
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
export declare function calculateSupertrend(prices: readonly PricePoint[], period?: number, multiplier?: number): {
    supertrend: number[];
    direction: number[];
};
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
export declare function calculateLinearRegression(data: readonly number[], period: number): number[];
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
export declare function calculateOBV(prices: readonly PricePoint[]): number[];
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
export declare function calculateVWAP(prices: readonly PricePoint[]): number[];
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
export declare function calculateVPT(prices: readonly PricePoint[]): number[];
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
export declare function calculateAccumulationDistribution(prices: readonly PricePoint[]): number[];
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
export declare function calculateChaikinMoneyFlow(prices: readonly PricePoint[], period?: number): number[];
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
export declare function calculateFibonacciRetracement(high: number, low: number): FibonacciLevels;
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
export declare function calculateFibonacciExtension(high: number, low: number, retracementLevel: number): {
    ext618: number;
    ext1000: number;
    ext1618: number;
    ext2618: number;
};
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
export declare function calculateFibonacciFan(startPrice: number, endPrice: number, startIndex: number, endIndex: number): {
    line236: (index: number) => number;
    line382: (index: number) => number;
    line500: (index: number) => number;
    line618: (index: number) => number;
};
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
export declare function calculateFibonacciArcs(startPrice: number, endPrice: number, startIndex: number, endIndex: number): {
    arc382: (index: number) => number;
    arc500: (index: number) => number;
    arc618: (index: number) => number;
};
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
export declare function calculatePivotPoints(high: number, low: number, close: number): PivotPoints;
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
export declare function calculateFibonacciPivots(high: number, low: number, close: number): PivotPoints;
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
export declare function calculateCamarillaPivots(high: number, low: number, close: number): PivotPoints;
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
export declare function identifySupportResistance(prices: readonly PricePoint[], lookback?: number, threshold?: number): {
    support: number[];
    resistance: number[];
};
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
export declare function calculateIchimoku(prices: readonly PricePoint[], tenkanPeriod?: number, kijunPeriod?: number, senkouSpanBPeriod?: number, displacement?: number): IchimokuCloud;
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
export declare function detectDoji(candle: PricePoint, threshold?: number): boolean;
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
export declare function detectHammer(candle: PricePoint, prevCandles: readonly PricePoint[]): CandlestickPattern | null;
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
export declare function detectEngulfing(candle1: PricePoint, candle2: PricePoint): CandlestickPattern | null;
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
export declare function detectMorningEveningStar(candles: readonly [PricePoint, PricePoint, PricePoint]): CandlestickPattern | null;
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
export declare function detectHarami(candle1: PricePoint, candle2: PricePoint): CandlestickPattern | null;
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
export declare function detectShootingStar(candle: PricePoint, prevCandles: readonly PricePoint[]): CandlestickPattern | null;
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
export declare function detectHangingMan(candle: PricePoint, prevCandles: readonly PricePoint[]): CandlestickPattern | null;
//# sourceMappingURL=technical-analysis-kit.d.ts.map