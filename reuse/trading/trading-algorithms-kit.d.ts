/**
 * LOC: TRDALGKIT001
 * File: /reuse/trading/trading-algorithms-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable algorithmic trading utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Trading execution engines
 *   - Algorithmic order management systems (OMS)
 *   - Portfolio management systems (PMS)
 *   - Execution analytics platforms
 */
/**
 * File: /reuse/trading/trading-algorithms-kit.ts
 * Locator: WC-UTL-TRDALGKIT-001
 * Purpose: Institutional-grade algorithmic trading strategies and execution algorithms
 *
 * Upstream: Independent utility module for algorithmic trading
 * Downstream: ../backend/*, Trading systems, execution platforms, portfolio managers
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for algorithmic trading execution, statistical strategies, market making, risk management
 *
 * LLM Context: Comprehensive algorithmic trading toolkit for implementing production-ready execution strategies.
 * Provides TWAP, VWAP, POV, Implementation Shortfall, Arrival Price algorithms, dark pool routing, smart order routing,
 * pairs trading, statistical arbitrage, mean reversion, momentum strategies, market making, and risk analytics.
 * Designed for institutional trading desks, hedge funds, and quantitative trading operations.
 */
/**
 * Branded type for prices to prevent mixing with other numeric types
 */
export type Price = number & {
    readonly __brand: 'Price';
};
/**
 * Branded type for quantities/shares to prevent mixing with prices
 */
export type Quantity = number & {
    readonly __brand: 'Quantity';
};
/**
 * Branded type for basis points (1/100th of a percent)
 */
export type BasisPoints = number & {
    readonly __brand: 'BasisPoints';
};
/**
 * Branded type for timestamps in milliseconds since epoch
 */
export type Timestamp = number & {
    readonly __brand: 'Timestamp';
};
/**
 * Helper to create Price branded type
 */
export declare const asPrice: (value: number) => Price;
/**
 * Helper to create Quantity branded type
 */
export declare const asQuantity: (value: number) => Quantity;
/**
 * Helper to create BasisPoints branded type
 */
export declare const asBasisPoints: (value: number) => BasisPoints;
/**
 * Helper to create Timestamp branded type
 */
export declare const asTimestamp: (value: number) => Timestamp;
export type OrderSide = 'BUY' | 'SELL';
export interface MarketOrder {
    type: 'MARKET';
    side: OrderSide;
    quantity: Quantity;
    symbol: string;
    timestamp: Timestamp;
}
export interface LimitOrder {
    type: 'LIMIT';
    side: OrderSide;
    quantity: Quantity;
    limitPrice: Price;
    symbol: string;
    timestamp: Timestamp;
    timeInForce: 'DAY' | 'GTC' | 'IOC' | 'FOK';
}
export interface StopOrder {
    type: 'STOP';
    side: OrderSide;
    quantity: Quantity;
    stopPrice: Price;
    limitPrice?: Price;
    symbol: string;
    timestamp: Timestamp;
}
export interface MOOOrder {
    type: 'MOO';
    side: OrderSide;
    quantity: Quantity;
    symbol: string;
}
export interface MOCOrder {
    type: 'MOC';
    side: OrderSide;
    quantity: Quantity;
    symbol: string;
}
export type Order = MarketOrder | LimitOrder | StopOrder | MOOOrder | MOCOrder;
export interface VenueExchange {
    type: 'EXCHANGE';
    exchangeCode: string;
    fees: BasisPoints;
    latencyMs: number;
}
export interface VenueDarkPool {
    type: 'DARK_POOL';
    poolName: string;
    minimumSize: Quantity;
    fees: BasisPoints;
}
export interface VenueATS {
    type: 'ATS';
    atsId: string;
    fees: BasisPoints;
}
export type Venue = VenueExchange | VenueDarkPool | VenueATS;
export interface Quote {
    symbol: string;
    bidPrice: Price;
    bidSize: Quantity;
    askPrice: Price;
    askSize: Quantity;
    timestamp: Timestamp;
}
export interface Trade {
    symbol: string;
    price: Price;
    quantity: Quantity;
    timestamp: Timestamp;
    side?: OrderSide;
}
export interface Bar {
    symbol: string;
    open: Price;
    high: Price;
    low: Price;
    close: Price;
    volume: Quantity;
    timestamp: Timestamp;
    vwap?: Price;
}
export interface OrderBookLevel {
    price: Price;
    quantity: Quantity;
    orderCount: number;
}
export interface OrderBook {
    symbol: string;
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    timestamp: Timestamp;
}
export interface TWAPParams {
    symbol: string;
    side: OrderSide;
    totalQuantity: Quantity;
    startTime: Timestamp;
    endTime: Timestamp;
    numberOfSlices: number;
    priceLimit?: Price;
}
export interface VWAPParams {
    symbol: string;
    side: OrderSide;
    totalQuantity: Quantity;
    startTime: Timestamp;
    endTime: Timestamp;
    historicalVolume: number[];
    priceLimit?: Price;
}
export interface POVParams {
    symbol: string;
    side: OrderSide;
    totalQuantity: Quantity;
    targetParticipationRate: number;
    minParticipationRate: number;
    maxParticipationRate: number;
    priceLimit?: Price;
}
export interface ImplementationShortfallParams {
    symbol: string;
    side: OrderSide;
    totalQuantity: Quantity;
    arrivalPrice: Price;
    riskAversion: number;
    volatility: number;
    duration: number;
}
export interface ArrivalPriceParams {
    symbol: string;
    side: OrderSide;
    totalQuantity: Quantity;
    arrivalPrice: Price;
    urgency: number;
    currentTime: Timestamp;
}
export interface ExecutionSlice {
    timestamp: Timestamp;
    quantity: Quantity;
    limitPrice?: Price;
    venueAllocation?: Array<{
        venue: Venue;
        quantity: Quantity;
    }>;
    urgency: number;
}
export interface ExecutionSchedule {
    slices: ExecutionSlice[];
    algorithm: string;
    totalQuantity: Quantity;
    estimatedDuration: number;
    estimatedCost: BasisPoints;
}
/**
 * Calculate Time-Weighted Average Price (TWAP) execution schedule
 * Divides order into equal time slices for minimal market impact
 *
 * @param params - TWAP algorithm parameters
 * @returns Execution schedule with equal-sized slices over time
 * @throws Error if endTime <= startTime or numberOfSlices < 1
 *
 * @example
 * const schedule = calculateTWAPSlice({
 *   symbol: 'AAPL',
 *   side: 'BUY',
 *   totalQuantity: asQuantity(10000),
 *   startTime: asTimestamp(Date.now()),
 *   endTime: asTimestamp(Date.now() + 3600000),
 *   numberOfSlices: 12
 * });
 */
export declare function calculateTWAPSlice(params: TWAPParams): ExecutionSchedule;
/**
 * Calculate Volume-Weighted Average Price (VWAP) execution schedule
 * Aligns execution with historical intraday volume patterns
 *
 * @param params - VWAP algorithm parameters with historical volume profile
 * @returns Execution schedule weighted by expected volume distribution
 * @throws Error if historical volume data is invalid or empty
 *
 * Reference: Berkowitz, S. A., Logue, D. E., & Noser, E. A. (1988).
 * "The total cost of transactions on the NYSE." The Journal of Finance.
 */
export declare function calculateVWAPSlice(params: VWAPParams): ExecutionSchedule;
/**
 * Calculate Percentage of Volume (POV) execution schedule
 * Maintains target participation rate relative to market volume
 *
 * @param params - POV algorithm parameters with participation constraints
 * @returns Adaptive execution schedule based on market volume
 *
 * Note: Actual execution requires real-time volume monitoring and adjustment
 */
export declare function calculatePOVSlice(params: POVParams): ExecutionSchedule;
/**
 * Calculate Implementation Shortfall (Almgren-Chriss) optimal execution
 * Balances market impact cost against timing risk
 *
 * @param params - Implementation shortfall parameters (arrival price, risk aversion, volatility)
 * @returns Optimal execution trajectory minimizing expected cost + risk penalty
 *
 * Reference: Almgren, R., & Chriss, N. (2001).
 * "Optimal execution of portfolio transactions." Journal of Risk, 3, 5-40.
 *
 * Formula: Optimal trajectory is exponential decay based on:
 * - Temporary impact (proportional to trade rate)
 * - Permanent impact (proportional to cumulative quantity)
 * - Volatility risk (variance of price changes)
 * - Risk aversion parameter λ
 */
export declare function calculateImplementationShortfall(params: ImplementationShortfallParams): ExecutionSchedule;
/**
 * Calculate Arrival Price algorithm execution
 * Aims to minimize deviation from arrival price benchmark
 *
 * @param params - Arrival price parameters with urgency factor
 * @returns Front-loaded execution schedule for arrival price optimization
 */
export declare function calculateArrivalPrice(params: ArrivalPriceParams): ExecutionSchedule;
/**
 * Optimize dark pool routing for block trades
 * Selects dark pools based on size requirements, fees, and fill probability
 *
 * @param quantity - Order quantity to route
 * @param availablePools - Array of available dark pool venues
 * @param fillProbabilities - Estimated fill probability for each pool
 * @returns Ranked list of dark pool venues with allocation recommendations
 */
export declare function optimizeDarkPoolRouting(quantity: Quantity, availablePools: VenueDarkPool[], fillProbabilities: number[]): Array<{
    venue: VenueDarkPool;
    allocation: Quantity;
    score: number;
}>;
/**
 * Calculate smart order routing across multiple venues
 * Optimizes venue selection based on liquidity, fees, and latency
 *
 * @param order - Order to route
 * @param venues - Available execution venues
 * @param liquidityEstimates - Estimated available liquidity at each venue
 * @returns Optimal venue allocation minimizing total execution cost
 */
export declare function calculateSmartOrderRoute(order: Order, venues: Venue[], liquidityEstimates: Quantity[]): Array<{
    venue: Venue;
    quantity: Quantity;
    estimatedCost: BasisPoints;
}>;
/**
 * Estimate execution schedule for general orders
 * Provides initial execution plan before algorithm-specific optimization
 *
 * @param order - Order to schedule
 * @param executionHorizon - Time horizon for execution in milliseconds
 * @returns Basic execution schedule for further refinement
 */
export declare function estimateExecutionSchedule(order: Order, executionHorizon: number): ExecutionSchedule;
export interface PairsTradingSignal {
    symbol1: string;
    symbol2: string;
    spreadZScore: number;
    signal: 'LONG_SPREAD' | 'SHORT_SPREAD' | 'NEUTRAL';
    hedge_ratio: number;
    confidence: number;
}
/**
 * Calculate pairs trading signal based on mean-reverting spread
 *
 * @param symbol1 - First symbol in pair
 * @param symbol2 - Second symbol in pair
 * @param price1 - Current price of symbol1
 * @param price2 - Current price of symbol2
 * @param hedgeRatio - Hedge ratio (beta) between symbols
 * @param spreadMean - Historical mean of the spread
 * @param spreadStd - Historical standard deviation of the spread
 * @param entryThreshold - Z-score threshold for entry (default 2.0)
 * @returns Pairs trading signal with entry/exit recommendations
 *
 * Reference: Gatev, E., Goetzmann, W. N., & Rouwenhorst, K. G. (2006).
 * "Pairs trading: Performance of a relative-value arbitrage rule."
 */
export declare function calculatePairsTradingSignal(symbol1: string, symbol2: string, price1: Price, price2: Price, hedgeRatio: number, spreadMean: number, spreadStd: number, entryThreshold?: number): PairsTradingSignal;
/**
 * Calculate cointegration metrics for pair selection
 * Uses Augmented Dickey-Fuller test statistic approximation
 *
 * @param prices1 - Historical prices for symbol1
 * @param prices2 - Historical prices for symbol2
 * @returns Cointegration statistics including hedge ratio and half-life
 */
export declare function calculateCointegrationMetrics(prices1: Price[], prices2: Price[]): {
    hedgeRatio: number;
    halfLife: number;
    correlation: number;
    meanSpread: number;
    stdSpread: number;
};
/**
 * Calculate mean reversion signal using z-score
 *
 * @param currentPrice - Current asset price
 * @param historicalPrices - Historical price series
 * @param lookbackPeriod - Number of periods for mean/std calculation
 * @param entryThreshold - Z-score threshold for signal generation
 * @returns Mean reversion signal (-1: sell, 0: hold, 1: buy) and z-score
 */
export declare function calculateMeanReversionSignal(currentPrice: Price, historicalPrices: Price[], lookbackPeriod: number, entryThreshold?: number): {
    signal: -1 | 0 | 1;
    zScore: number;
    mean: Price;
    std: number;
};
/**
 * Calculate z-score for price normalization
 *
 * @param value - Current value to normalize
 * @param mean - Historical mean
 * @param std - Historical standard deviation
 * @returns Standardized z-score
 */
export declare function calculateZScore(value: number, mean: number, std: number): number;
/**
 * Calculate Ornstein-Uhlenbeck process parameters for mean reversion modeling
 * Estimates mean reversion speed (theta) and long-term mean (mu)
 *
 * @param prices - Historical price series
 * @returns OU process parameters (theta: mean reversion speed, mu: long-term mean, sigma: volatility)
 *
 * dX = theta * (mu - X) * dt + sigma * dW
 */
export declare function calculateOrnsteinUhlenbeck(prices: Price[]): {
    theta: number;
    mu: Price;
    sigma: number;
};
/**
 * Calculate momentum signal using rate of change
 *
 * @param prices - Historical price series
 * @param momentumPeriod - Lookback period for momentum calculation
 * @returns Momentum signal (-1: negative, 0: neutral, 1: positive) and momentum value
 */
export declare function calculateMomentumSignal(prices: Price[], momentumPeriod: number): {
    signal: -1 | 0 | 1;
    momentum: number;
    rateOfChange: number;
};
/**
 * Calculate moving average crossover signal
 * Classic technical analysis indicator
 *
 * @param prices - Historical price series
 * @param shortPeriod - Short moving average period
 * @param longPeriod - Long moving average period
 * @returns Crossover signal (1: bullish, -1: bearish, 0: neutral)
 */
export declare function calculateMovingAverageCrossover(prices: Price[], shortPeriod: number, longPeriod: number): {
    signal: -1 | 0 | 1;
    shortMA: Price;
    longMA: Price;
};
/**
 * Calculate Relative Strength Index (RSI)
 * Momentum oscillator measuring speed and change of price movements
 *
 * @param prices - Historical price series
 * @param period - RSI calculation period (typically 14)
 * @returns RSI value (0-100) and overbought/oversold signal
 */
export declare function calculateRSI(prices: Price[], period?: number): {
    rsi: number;
    signal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
};
/**
 * Calculate Bollinger Bands
 * Volatility bands placed above and below moving average
 *
 * @param prices - Historical price series
 * @param period - Moving average period (typically 20)
 * @param stdDevMultiplier - Standard deviation multiplier (typically 2)
 * @returns Bollinger Bands (upper, middle, lower) and current position
 */
export declare function calculateBollingerBands(prices: Price[], period?: number, stdDevMultiplier?: number): {
    upper: Price;
    middle: Price;
    lower: Price;
    percentB: number;
    bandwidth: number;
};
/**
 * Calculate Average True Range (ATR)
 * Measure of market volatility
 *
 * @param bars - Historical OHLC bars
 * @param period - ATR period (typically 14)
 * @returns ATR value and current volatility assessment
 */
export declare function calculateATR(bars: Bar[], period?: number): {
    atr: number;
    volatility: 'HIGH' | 'MEDIUM' | 'LOW';
};
/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * Trend-following momentum indicator
 *
 * @param prices - Historical price series
 * @param fastPeriod - Fast EMA period (typically 12)
 * @param slowPeriod - Slow EMA period (typically 26)
 * @param signalPeriod - Signal line period (typically 9)
 * @returns MACD line, signal line, histogram, and crossover signal
 */
export declare function calculateMACD(prices: Price[], fastPeriod?: number, slowPeriod?: number, signalPeriod?: number): {
    macd: number;
    signal: number;
    histogram: number;
    crossover: 'BULLISH' | 'BEARISH' | 'NONE';
};
/**
 * Calculate Stochastic Oscillator
 * Momentum indicator comparing closing price to price range
 *
 * @param bars - Historical OHLC bars
 * @param period - %K period (typically 14)
 * @param smoothK - %K smoothing period (typically 3)
 * @param smoothD - %D smoothing period (typically 3)
 * @returns Stochastic %K, %D values and overbought/oversold signal
 */
export declare function calculateStochasticOscillator(bars: Bar[], period?: number, smoothK?: number, smoothD?: number): {
    percentK: number;
    percentD: number;
    signal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
};
export interface MarketMakingQuotes {
    bidPrice: Price;
    bidSize: Quantity;
    askPrice: Price;
    askSize: Quantity;
    spread: BasisPoints;
    skew: number;
}
/**
 * Calculate market making two-sided quotes
 * Provides bid/ask quotes with inventory risk adjustment
 *
 * @param midPrice - Current mid price
 * @param inventoryPosition - Current inventory position (positive = long, negative = short)
 * @param targetSpread - Target bid-ask spread in basis points
 * @param inventoryLimit - Maximum inventory limit
 * @param quoteSize - Size for each quote
 * @returns Two-sided market making quotes with inventory skew
 *
 * Reference: Avellaneda, M., & Stoikov, S. (2008).
 * "High-frequency trading in a limit order book." Quantitative Finance.
 */
export declare function calculateMarketMakingQuotes(midPrice: Price, inventoryPosition: Quantity, targetSpread: BasisPoints, inventoryLimit: Quantity, quoteSize: Quantity): MarketMakingQuotes;
/**
 * Calculate inventory risk for market maker
 * Estimates risk based on position, volatility, and time horizon
 *
 * @param inventoryPosition - Current inventory position
 * @param volatility - Asset volatility (annualized)
 * @param timeHorizon - Risk measurement time horizon in days
 * @param confidence - Confidence level for risk calculation (e.g., 0.95)
 * @returns Value at risk and inventory risk score
 */
export declare function calculateInventoryRisk(inventoryPosition: Quantity, volatility: number, timeHorizon: number, confidence?: number): {
    valueAtRisk: number;
    riskScore: number;
};
/**
 * Optimize quote spread for market making
 * Balances adverse selection risk against fill probability
 *
 * @param orderFlow - Recent order flow imbalance (-1 to 1)
 * @param volatility - Current market volatility
 * @param competitionSpread - Competitor spread in basis points
 * @param minSpread - Minimum allowable spread
 * @returns Optimal spread in basis points
 */
export declare function optimizeQuoteSpread(orderFlow: number, volatility: number, competitionSpread: BasisPoints, minSpread: BasisPoints): BasisPoints;
/**
 * Calculate liquidity score for a venue
 * Assesses venue quality based on depth, spread, and fill rates
 *
 * @param depth - Total depth (bid + ask size)
 * @param spread - Current bid-ask spread in basis points
 * @param fillRate - Historical fill rate (0-1)
 * @param recentVolume - Recent trading volume
 * @returns Composite liquidity score (0-100)
 */
export declare function calculateLiquidityScore(depth: Quantity, spread: BasisPoints, fillRate: number, recentVolume: Quantity): number;
/**
 * Estimate adverse selection risk
 * Probability that counterparty has superior information
 *
 * @param orderImbalance - Order book imbalance (-1 to 1)
 * @param priceVolatility - Recent price volatility
 * @param orderSize - Size of incoming order
 * @param averageOrderSize - Average market order size
 * @returns Adverse selection probability (0-1)
 */
export declare function estimateAdverseSelection(orderImbalance: number, priceVolatility: number, orderSize: Quantity, averageOrderSize: Quantity): number;
/**
 * Calculate optimal quoting probability
 * Determines when to quote based on market conditions
 *
 * @param inventoryPosition - Current inventory
 * @param inventoryLimit - Maximum inventory
 * @param marketVolatility - Current volatility
 * @param profitability - Recent profitability score (0-1)
 * @returns Quoting probability (0-1) for each side
 */
export declare function calculateQuotingProbability(inventoryPosition: Quantity, inventoryLimit: Quantity, marketVolatility: number, profitability: number): {
    bidProbability: number;
    askProbability: number;
};
/**
 * Optimize order size for market making
 * Determines optimal quote size based on risk and liquidity
 *
 * @param maxPosition - Maximum position limit
 * @param currentPosition - Current inventory position
 * @param riskLimit - Maximum risk tolerance
 * @param volatility - Asset volatility
 * @returns Optimal quote size
 */
export declare function optimizeOrderSize(maxPosition: Quantity, currentPosition: Quantity, riskLimit: number, volatility: number): Quantity;
/**
 * Calculate reserve price for hidden liquidity
 * Determines price at which to place hidden/iceberg orders
 *
 * @param midPrice - Current mid price
 * @param side - Order side
 * @param estimatedImpact - Estimated price impact of full order
 * @param urgency - Execution urgency (0-1)
 * @returns Reserve price for hidden order
 */
export declare function calculateReservePrice(midPrice: Price, side: OrderSide, estimatedImpact: BasisPoints, urgency: number): Price;
/**
 * Calculate iceberg order slicing strategy
 * Hides order size by displaying only small visible portion
 *
 * @param totalQuantity - Total order quantity
 * @param visibleRatio - Ratio of visible quantity (0-1)
 * @param numberOfRefills - Number of refill cycles
 * @returns Iceberg order schedule with visible/hidden quantities
 */
export declare function calculateIcebergOrder(totalQuantity: Quantity, visibleRatio: number, numberOfRefills: number): Array<{
    visible: Quantity;
    hidden: Quantity;
}>;
/**
 * Optimize child order timing
 * Determines optimal timing for child orders in parent algorithm
 *
 * @param parentQuantity - Parent order quantity
 * @param marketVolatility - Current market volatility
 * @param timeRemaining - Time remaining for execution (ms)
 * @param completionRatio - Current completion ratio (0-1)
 * @returns Recommended timing for next child order
 */
export declare function optimizeChildOrderTiming(parentQuantity: Quantity, marketVolatility: number, timeRemaining: number, completionRatio: number): {
    delayMs: number;
    recommendedSize: Quantity;
};
/**
 * Calculate participation rate for execution
 * Determines how aggressively to participate in market volume
 *
 * @param remainingQuantity - Quantity remaining to execute
 * @param recentMarketVolume - Recent market volume
 * @param timeRemaining - Time remaining for execution (ms)
 * @param urgency - Execution urgency (0-1)
 * @returns Target participation rate (0-1)
 */
export declare function calculateParticipationRate(remainingQuantity: Quantity, recentMarketVolume: Quantity, timeRemaining: number, urgency: number): number;
/**
 * Estimate fill probability for limit order
 * Predicts likelihood of limit order execution
 *
 * @param limitPrice - Limit price of order
 * @param side - Order side
 * @param currentBid - Current best bid
 * @param currentAsk - Current best ask
 * @param volatility - Recent price volatility
 * @returns Fill probability (0-1)
 */
export declare function estimateFillProbability(limitPrice: Price, side: OrderSide, currentBid: Price, currentAsk: Price, volatility: number): number;
/**
 * Calculate urgency premium for execution
 * Additional cost for faster execution
 *
 * @param normalCost - Normal execution cost in basis points
 * @param urgency - Urgency level (0-1)
 * @param volatility - Market volatility
 * @returns Total cost including urgency premium
 */
export declare function calculateUrgencyPremium(normalCost: BasisPoints, urgency: number, volatility: number): BasisPoints;
/**
 * Optimize venue allocation across multiple venues
 * Distributes order quantity to minimize total cost
 *
 * @param totalQuantity - Total quantity to execute
 * @param venues - Available venues with characteristics
 * @param liquidityEstimates - Available liquidity at each venue
 * @param costEstimates - Estimated execution cost at each venue (bp)
 * @returns Optimal allocation across venues
 */
export declare function optimizeVenueAllocation(totalQuantity: Quantity, venues: Venue[], liquidityEstimates: Quantity[], costEstimates: BasisPoints[]): Array<{
    venue: Venue;
    quantity: Quantity;
    cost: BasisPoints;
}>;
/**
 * Calculate post-only execution strategy
 * Passive strategy that only adds liquidity, never takes
 *
 * @param side - Order side
 * @param quantity - Order quantity
 * @param currentBid - Current best bid
 * @param currentAsk - Current best ask
 * @param tickSize - Minimum price increment
 * @returns Post-only limit price that improves current quote
 */
export declare function calculatePostOnlyStrategy(side: OrderSide, quantity: Quantity, currentBid: Price, currentAsk: Price, tickSize: number): {
    limitPrice: Price;
    strategy: 'JOIN' | 'IMPROVE';
};
/**
 * Estimate queue position in limit order book
 * Predicts position in queue for limit order at price level
 *
 * @param orderSize - Size of our order
 * @param levelSize - Total size at price level
 * @param levelOrderCount - Number of orders at price level
 * @param arrivalTime - Time our order arrived
 * @param levelFormationTime - Time price level formed
 * @returns Estimated queue position and fill time
 */
export declare function estimateQueuePosition(orderSize: Quantity, levelSize: Quantity, levelOrderCount: number, arrivalTime: Timestamp, levelFormationTime: Timestamp): {
    queuePosition: number;
    estimatedFillTime: number;
};
/**
 * Calculate pegged order pricing
 * Dynamically adjusts limit price relative to reference price
 *
 * @param referencePrice - Reference price (mid, best bid/ask, etc.)
 * @param side - Order side
 * @param offset - Offset from reference in basis points
 * @param tickSize - Minimum price increment
 * @returns Pegged limit price
 */
export declare function calculatePeggedOrder(referencePrice: Price, side: OrderSide, offset: BasisPoints, tickSize: number): Price;
/**
 * Optimize execution time horizon
 * Determines optimal duration for order execution
 *
 * @param orderSize - Order size
 * @param averageDailyVolume - Average daily trading volume
 * @param urgency - Execution urgency (0-1)
 * @param volatility - Market volatility
 * @returns Optimal execution horizon in milliseconds
 */
export declare function optimizeExecutionHorizon(orderSize: Quantity, averageDailyVolume: Quantity, urgency: number, volatility: number): number;
/**
 * Calculate Value at Risk (VaR) using historical method
 *
 * @param returns - Historical returns series
 * @param confidence - Confidence level (e.g., 0.95 for 95%)
 * @returns VaR estimate at specified confidence level
 */
export declare function calculateVaR(returns: number[], confidence?: number): number;
/**
 * Calculate Expected Shortfall (Conditional VaR)
 * Average loss beyond VaR threshold
 *
 * @param returns - Historical returns series
 * @param confidence - Confidence level (e.g., 0.95)
 * @returns Expected Shortfall (CVaR)
 */
export declare function calculateExpectedShortfall(returns: number[], confidence?: number): number;
/**
 * Calculate portfolio beta relative to benchmark
 *
 * @param portfolioReturns - Portfolio returns series
 * @param benchmarkReturns - Benchmark returns series
 * @returns Portfolio beta
 */
export declare function calculatePortfolioBeta(portfolioReturns: number[], benchmarkReturns: number[]): number;
/**
 * Calculate correlation matrix for asset returns
 *
 * @param returnsMatrix - Array of return series for each asset
 * @returns Correlation matrix
 */
export declare function calculateCorrelationMatrix(returnsMatrix: number[][]): number[][];
/**
 * Estimate volatility using EWMA (Exponentially Weighted Moving Average)
 *
 * @param returns - Historical returns series
 * @param lambda - Decay factor (typically 0.94 for daily data)
 * @returns Current volatility estimate
 */
export declare function estimateVolatility(returns: number[], lambda?: number): number;
/**
 * Calculate Sharpe Ratio
 * Risk-adjusted return metric
 *
 * @param returns - Portfolio returns series
 * @param riskFreeRate - Risk-free rate (annualized)
 * @returns Sharpe ratio
 */
export declare function calculateSharpeRatio(returns: number[], riskFreeRate?: number): number;
/**
 * Calculate Maximum Drawdown
 * Largest peak-to-trough decline
 *
 * @param cumulativeReturns - Cumulative returns series
 * @returns Maximum drawdown (as positive percentage)
 */
export declare function calculateMaxDrawdown(cumulativeReturns: number[]): number;
//# sourceMappingURL=trading-algorithms-kit.d.ts.map