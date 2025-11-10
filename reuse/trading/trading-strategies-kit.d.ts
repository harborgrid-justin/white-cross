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
import Decimal from 'decimal.js';
type Price = Decimal & {
    readonly __brand: 'Price';
};
type Quantity = Decimal & {
    readonly __brand: 'Quantity';
};
type Volume = Decimal & {
    readonly __brand: 'Volume';
};
type Percentage = Decimal & {
    readonly __brand: 'Percentage';
};
type Score = Decimal & {
    readonly __brand: 'Score';
};
type Volatility = Decimal & {
    readonly __brand: 'Volatility';
};
declare const createPrice: (value: Decimal.Value) => Price;
declare const createQuantity: (value: Decimal.Value) => Quantity;
declare const createVolume: (value: Decimal.Value) => Volume;
declare const createPercentage: (value: Decimal.Value) => Percentage;
declare const createScore: (value: Decimal.Value) => Score;
declare const createVolatility: (value: Decimal.Value) => Volatility;
interface MarketData {
    instrumentId: string;
    symbol: string;
    timestamp: Date;
    open: Price;
    high: Price;
    low: Price;
    close: Price;
    volume: Volume;
    adjustedClose?: Price;
    bid?: Price;
    ask?: Price;
    bidSize?: Quantity;
    askSize?: Quantity;
}
interface OHLCVData extends MarketData {
    period: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';
}
type SignalType = 'BUY' | 'SELL' | 'HOLD' | 'STRONG_BUY' | 'STRONG_SELL';
type StrategyType = 'momentum' | 'mean_reversion' | 'breakout' | 'trend_following' | 'arbitrage' | 'options' | 'spread' | 'volatility' | 'event_driven' | 'factor_based' | 'multi_asset';
interface TradingSignal {
    signalId: string;
    strategyType: StrategyType;
    strategyName: string;
    instrumentId: string;
    symbol: string;
    signalType: SignalType;
    strength: Score;
    confidence: Percentage;
    timestamp: Date;
    entryPrice: Price;
    targetPrice?: Price;
    stopLoss?: Price;
    timeHorizon?: number;
    metadata: Record<string, any>;
}
interface StrategyParameters {
    strategyId: string;
    strategyType: StrategyType;
    instrumentIds: string[];
    lookbackPeriod: number;
    rebalanceFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    maxPositions: number;
    capitalAllocation: Decimal;
    parameters: Record<string, any>;
}
interface BacktestResult {
    strategyId: string;
    startDate: Date;
    endDate: Date;
    initialCapital: Decimal;
    finalCapital: Decimal;
    totalReturn: Percentage;
    annualizedReturn: Percentage;
    sharpeRatio: Decimal;
    sortinoRatio: Decimal;
    maxDrawdown: Percentage;
    winRate: Percentage;
    profitFactor: Decimal;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    avgWinAmount: Decimal;
    avgLossAmount: Decimal;
    trades: BacktestTrade[];
    equityCurve: Array<{
        date: Date;
        equity: Decimal;
    }>;
    metrics: Record<string, any>;
}
interface BacktestTrade {
    tradeId: string;
    instrumentId: string;
    entryDate: Date;
    exitDate: Date;
    entryPrice: Price;
    exitPrice: Price;
    quantity: Quantity;
    side: 'LONG' | 'SHORT';
    pnl: Decimal;
    pnlPercent: Percentage;
    holdingPeriod: number;
}
interface Indicator {
    name: string;
    value: Decimal;
    timestamp: Date;
    metadata?: Record<string, any>;
}
interface MovingAverageData {
    sma: Price;
    ema: Price;
    wma: Price;
}
interface BollingerBands {
    upper: Price;
    middle: Price;
    lower: Price;
    bandwidth: Percentage;
    percentB: Percentage;
}
interface MACDIndicator {
    macd: Decimal;
    signal: Decimal;
    histogram: Decimal;
}
interface RSIIndicator {
    rsi: Score;
    isOverbought: boolean;
    isOversold: boolean;
}
interface OptionsStrategy {
    strategyId: string;
    strategyName: string;
    underlyingSymbol: string;
    legs: OptionsLeg[];
    netPremium: Decimal;
    maxProfit: Decimal;
    maxLoss: Decimal;
    breakEvenPoints: Price[];
    greeks: OptionsGreeks;
}
interface OptionsLeg {
    legId: string;
    optionType: 'CALL' | 'PUT';
    action: 'BUY' | 'SELL';
    strike: Price;
    expiration: Date;
    quantity: Quantity;
    premium: Decimal;
}
interface OptionsGreeks {
    delta: Decimal;
    gamma: Decimal;
    theta: Decimal;
    vega: Decimal;
    rho: Decimal;
}
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
export declare function calculateRSI(prices: Price[], period?: number): RSIIndicator;
/**
 * Calculate MACD (Moving Average Convergence Divergence) for trend and momentum
 * @param prices - Array of closing prices
 * @param fastPeriod - Fast EMA period (typically 12)
 * @param slowPeriod - Slow EMA period (typically 26)
 * @param signalPeriod - Signal line period (typically 9)
 * @returns MACD indicator with histogram
 */
export declare function calculateMACD(prices: Price[], fastPeriod?: number, slowPeriod?: number, signalPeriod?: number): MACDIndicator;
/**
 * Generate momentum-based trading signal using RSI and MACD
 * @param marketData - Historical market data
 * @param rsiPeriod - RSI period
 * @param macdFast - MACD fast period
 * @param macdSlow - MACD slow period
 * @param macdSignal - MACD signal period
 * @returns Trading signal based on momentum indicators
 */
export declare function generateMomentumSignal(marketData: MarketData[], rsiPeriod?: number, macdFast?: number, macdSlow?: number, macdSignal?: number): TradingSignal;
/**
 * Calculate Simple Moving Average (SMA)
 * @param prices - Array of prices
 * @param period - Period for averaging
 * @returns SMA value
 */
export declare function calculateSMA(prices: Price[], period: number): Price;
/**
 * Calculate Exponential Moving Average (EMA)
 * @param prices - Array of prices
 * @param period - Period for averaging
 * @returns EMA value
 */
export declare function calculateEMA(prices: Price[], period: number): Price;
/**
 * Calculate Weighted Moving Average (WMA)
 * @param prices - Array of prices
 * @param period - Period for averaging
 * @returns WMA value
 */
export declare function calculateWMA(prices: Price[], period: number): Price;
/**
 * Generate moving average crossover signal
 * @param prices - Historical prices
 * @param shortPeriod - Short MA period
 * @param longPeriod - Long MA period
 * @param maType - Type of moving average ('SMA' | 'EMA' | 'WMA')
 * @returns Trading signal based on crossover
 */
export declare function generateMovingAverageCrossoverSignal(prices: Price[], shortPeriod?: number, longPeriod?: number, maType?: 'SMA' | 'EMA' | 'WMA'): SignalType;
/**
 * Calculate Rate of Change (ROC) momentum indicator
 * @param prices - Array of prices
 * @param period - Lookback period
 * @returns ROC as percentage
 */
export declare function calculateROC(prices: Price[], period: number): Percentage;
/**
 * Calculate Stochastic Oscillator for momentum
 * @param marketData - Array of OHLC data
 * @param period - Lookback period (typically 14)
 * @param smoothK - %K smoothing period
 * @param smoothD - %D smoothing period
 * @returns Stochastic oscillator values
 */
export declare function calculateStochastic(marketData: MarketData[], period?: number, smoothK?: number, smoothD?: number): {
    percentK: Percentage;
    percentD: Percentage;
    isOverbought: boolean;
    isOversold: boolean;
};
/**
 * Calculate Bollinger Bands for mean reversion analysis
 * @param prices - Array of closing prices
 * @param period - Period for SMA (typically 20)
 * @param stdDev - Number of standard deviations (typically 2)
 * @returns Bollinger Bands with upper, middle, lower bands
 */
export declare function calculateBollingerBands(prices: Price[], period?: number, stdDev?: number): BollingerBands;
/**
 * Generate mean reversion signal using Bollinger Bands
 * @param prices - Historical prices
 * @param period - Bollinger Band period
 * @param stdDev - Standard deviation multiplier
 * @returns Trading signal based on mean reversion
 */
export declare function generateBollingerBandSignal(prices: Price[], period?: number, stdDev?: number): TradingSignal;
/**
 * Calculate Z-Score for mean reversion
 * @param prices - Array of prices
 * @param period - Lookback period
 * @returns Z-score indicating standard deviations from mean
 */
export declare function calculateZScore(prices: Price[], period?: number): Decimal;
/**
 * Calculate correlation coefficient for pairs trading
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @returns Correlation coefficient (-1 to 1)
 */
export declare function calculateCorrelation(pricesA: Price[], pricesB: Price[]): Decimal;
/**
 * Generate pairs trading signal based on spread Z-score
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @param hedgeRatio - Hedge ratio for the pair
 * @param entryThreshold - Z-score threshold for entry (typically 2)
 * @param exitThreshold - Z-score threshold for exit (typically 0)
 * @returns Pairs trading signal
 */
export declare function generatePairsTradingSignal(pricesA: Price[], pricesB: Price[], hedgeRatio: Decimal, entryThreshold?: number, exitThreshold?: number): {
    signalA: SignalType;
    signalB: SignalType;
    spreadZScore: Decimal;
};
/**
 * Calculate cointegration test for pairs trading
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @returns Hedge ratio and cointegration score
 */
export declare function calculateCointegration(pricesA: Price[], pricesB: Price[]): {
    hedgeRatio: Decimal;
    score: Decimal;
    isCointegrated: boolean;
};
/**
 * Detect price breakout from range
 * @param marketData - Historical OHLC data
 * @param lookbackPeriod - Period for range detection
 * @param volumeConfirmation - Require volume confirmation
 * @returns Breakout signal
 */
export declare function detectPriceBreakout(marketData: MarketData[], lookbackPeriod?: number, volumeConfirmation?: boolean): TradingSignal | null;
/**
 * Detect volume breakout
 * @param marketData - Historical OHLC data
 * @param lookbackPeriod - Period for average volume calculation
 * @param volumeMultiplier - Multiplier for volume breakout (typically 2-3)
 * @returns Volume breakout indicator
 */
export declare function detectVolumeBreakout(marketData: MarketData[], lookbackPeriod?: number, volumeMultiplier?: number): {
    isBreakout: boolean;
    currentVolume: Volume;
    avgVolume: Volume;
    multiplier: Decimal;
};
/**
 * Calculate Donchian Channels for breakout trading
 * @param marketData - Historical OHLC data
 * @param period - Channel period (typically 20)
 * @returns Donchian channel upper and lower bounds
 */
export declare function calculateDonchianChannels(marketData: MarketData[], period?: number): {
    upper: Price;
    lower: Price;
    middle: Price;
};
/**
 * Generate Donchian Channel breakout signal
 * @param marketData - Historical OHLC data
 * @param period - Channel period
 * @returns Trading signal based on Donchian breakout
 */
export declare function generateDonchianBreakoutSignal(marketData: MarketData[], period?: number): TradingSignal | null;
/**
 * Calculate Average Directional Index (ADX) for trend strength
 * @param marketData - Historical OHLC data
 * @param period - ADX period (typically 14)
 * @returns ADX value and trend strength
 */
export declare function calculateADX(marketData: MarketData[], period?: number): {
    adx: Decimal;
    trending: boolean;
    trendStrength: 'weak' | 'moderate' | 'strong' | 'very_strong';
};
/**
 * Calculate Supertrend indicator
 * @param marketData - Historical OHLC data
 * @param period - ATR period
 * @param multiplier - ATR multiplier
 * @returns Supertrend value and direction
 */
export declare function calculateSupertrend(marketData: MarketData[], period?: number, multiplier?: number): {
    supertrend: Price;
    direction: 'up' | 'down';
};
/**
 * Generate trend following signal using ADX and Supertrend
 * @param marketData - Historical OHLC data
 * @param adxPeriod - ADX period
 * @param stPeriod - Supertrend period
 * @param stMultiplier - Supertrend multiplier
 * @returns Trend following signal
 */
export declare function generateTrendFollowingSignal(marketData: MarketData[], adxPeriod?: number, stPeriod?: number, stMultiplier?: number): TradingSignal;
/**
 * Detect statistical arbitrage opportunity
 * @param pricesA - Prices for asset A
 * @param pricesB - Prices for asset B
 * @param zScoreThreshold - Z-score threshold for entry
 * @returns Statistical arbitrage signal
 */
export declare function detectStatisticalArbitrage(pricesA: Price[], pricesB: Price[], zScoreThreshold?: number): {
    opportunity: boolean;
    zScore: Decimal;
    action: 'long_A_short_B' | 'short_A_long_B' | 'none';
};
/**
 * Calculate triangular arbitrage opportunity in FX
 * @param rateAB - Exchange rate A/B
 * @param rateBC - Exchange rate B/C
 * @param rateCA - Exchange rate C/A
 * @returns Arbitrage opportunity and profit percentage
 */
export declare function calculateTriangularArbitrage(rateAB: Decimal, rateBC: Decimal, rateCA: Decimal): {
    opportunity: boolean;
    profitPercent: Percentage;
    direction: 'forward' | 'reverse' | 'none';
};
/**
 * Detect merger arbitrage opportunity
 * @param targetPrice - Target company price
 * @param acquirerPrice - Acquirer company price
 * @param offerPrice - Offer price per share
 * @param exchangeRatio - Stock exchange ratio (if stock deal)
 * @param dealProbability - Estimated probability of deal completion
 * @returns Merger arbitrage analysis
 */
export declare function analyzeMergerArbitrage(targetPrice: Price, acquirerPrice: Price, offerPrice: Decimal, exchangeRatio: Decimal | null, dealProbability: Percentage): {
    spread: Decimal;
    spreadPercent: Percentage;
    expectedReturn: Percentage;
    recommendation: SignalType;
};
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
export declare function createCoveredCallStrategy(underlyingSymbol: string, underlyingPrice: Price, strikePrice: Price, premium: Decimal, expiration: Date, quantity?: Quantity): OptionsStrategy;
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
export declare function createProtectivePutStrategy(underlyingSymbol: string, underlyingPrice: Price, strikePrice: Price, premium: Decimal, expiration: Date, quantity?: Quantity): OptionsStrategy;
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
export declare function createCollarStrategy(underlyingSymbol: string, underlyingPrice: Price, putStrike: Price, callStrike: Price, putPremium: Decimal, callPremium: Decimal, expiration: Date, quantity?: Quantity): OptionsStrategy;
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
export declare function createStraddleStrategy(underlyingSymbol: string, underlyingPrice: Price, strikePrice: Price, callPremium: Decimal, putPremium: Decimal, expiration: Date, quantity?: Quantity): OptionsStrategy;
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
export declare function createStrangleStrategy(underlyingSymbol: string, underlyingPrice: Price, callStrike: Price, putStrike: Price, callPremium: Decimal, putPremium: Decimal, expiration: Date, quantity?: Quantity): OptionsStrategy;
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
export declare function createIronCondorStrategy(underlyingSymbol: string, sellCallStrike: Price, buyCallStrike: Price, sellPutStrike: Price, buyPutStrike: Price, premiums: {
    sellCall: Decimal;
    buyCall: Decimal;
    sellPut: Decimal;
    buyPut: Decimal;
}, expiration: Date, quantity?: Quantity): OptionsStrategy;
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
export declare function createButterflyStrategy(underlyingSymbol: string, lowerStrike: Price, middleStrike: Price, upperStrike: Price, premiums: {
    lower: Decimal;
    middle: Decimal;
    upper: Decimal;
}, optionType: 'CALL' | 'PUT', expiration: Date, quantity?: Quantity): OptionsStrategy;
/**
 * Backtest a trading strategy
 * @param strategyFunction - Function that generates signals from market data
 * @param historicalData - Historical market data
 * @param initialCapital - Starting capital
 * @param positionSize - Position size per trade (as fraction of capital)
 * @param commission - Commission per trade
 * @returns Backtest results with performance metrics
 */
export declare function backtestStrategy(strategyFunction: (data: MarketData[]) => TradingSignal | null, historicalData: MarketData[], initialCapital: Decimal, positionSize?: Decimal, commission?: Decimal): BacktestResult;
/**
 * Calculate strategy performance metrics
 * @param backtestResult - Backtest result to analyze
 * @returns Detailed performance metrics
 */
export declare function calculatePerformanceMetrics(backtestResult: BacktestResult): {
    returnMetrics: Record<string, Decimal>;
    riskMetrics: Record<string, Decimal>;
    efficiencyMetrics: Record<string, Decimal>;
};
export type { MarketData, OHLCVData, TradingSignal, StrategyParameters, BacktestResult, BacktestTrade, Indicator, MovingAverageData, BollingerBands, MACDIndicator, RSIIndicator, OptionsStrategy, OptionsLeg, OptionsGreeks, SignalType, StrategyType, Price, Quantity, Volume, Percentage, Score, Volatility, };
export { createPrice, createQuantity, createVolume, createPercentage, createScore, createVolatility, };
//# sourceMappingURL=trading-strategies-kit.d.ts.map