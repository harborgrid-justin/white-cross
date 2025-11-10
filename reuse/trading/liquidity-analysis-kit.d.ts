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
import Decimal from 'decimal.js';
/**
 * Market quote data structure
 */
export interface MarketQuote {
    timestamp: Date;
    bidPrice: number;
    askPrice: number;
    bidSize: number;
    askSize: number;
    lastPrice?: number;
    lastSize?: number;
}
/**
 * Trade execution data
 */
export interface TradeData {
    timestamp: Date;
    price: number;
    size: number;
    side: 'buy' | 'sell';
    isMarketOrder?: boolean;
}
/**
 * Order book snapshot
 */
export interface OrderBook {
    timestamp: Date;
    bids: Array<{
        price: number;
        size: number;
    }>;
    asks: Array<{
        price: number;
        size: number;
    }>;
}
/**
 * OHLCV bar data
 */
export interface OHLCVBar {
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
/**
 * Liquidity metrics result
 */
export interface LiquidityMetrics {
    spread: Decimal;
    relativeSpread: Decimal;
    depth: Decimal;
    turnover: Decimal;
    timestamp: Date;
}
/**
 * Price impact result
 */
export interface PriceImpact {
    temporary: Decimal;
    permanent: Decimal;
    total: Decimal;
    slippage: Decimal;
}
/**
 * Intraday pattern analysis
 */
export interface IntradayPattern {
    hourOfDay: number;
    averageSpread: Decimal;
    averageVolume: Decimal;
    averageLiquidity: Decimal;
    isHighLiquidity: boolean;
}
/**
 * Liquidity risk metrics
 */
export interface LiquidityRiskMetrics {
    liquidityAtRisk: Decimal;
    liquidityGap: Decimal;
    fundingRisk: Decimal;
    marketRisk: Decimal;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Volume profile data
 */
export interface VolumeProfile {
    totalVolume: Decimal;
    meanVolume: Decimal;
    medianVolume: Decimal;
    stdDevVolume: Decimal;
    relativeVolume: Decimal;
    isUnusual: boolean;
}
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
export declare function calculateBidAskSpread(quote: MarketQuote): Decimal;
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
export declare function calculateRelativeSpread(quote: MarketQuote): Decimal;
/**
 * Calculate percentage spread
 *
 * Formula: PercentageSpread = 100 * (Ask - Bid) / Midpoint
 *
 * @param quote - Market quote with bid and ask prices
 * @returns Percentage spread (e.g., 0.1 for 0.1%)
 */
export declare function calculatePercentageSpread(quote: MarketQuote): Decimal;
/**
 * Calculate quoted spread (half-spread)
 *
 * Formula: QuotedSpread = (Ask - Bid) / 2
 *
 * @param quote - Market quote
 * @returns Half of the bid-ask spread
 */
export declare function calculateQuotedSpread(quote: MarketQuote): Decimal;
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
export declare function calculateEffectiveSpread(trade: TradeData, quote: MarketQuote): Decimal;
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
export declare function calculateRealizedSpread(trade: TradeData, quoteAtTrade: MarketQuote, quoteAfter: MarketQuote): Decimal;
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
export declare function calculatePriceImpactSpread(trade: TradeData, quoteBefore: MarketQuote, quoteAfter: MarketQuote): Decimal;
/**
 * Measure total market depth at best bid and ask
 * Bloomberg Equivalent: DEPTH <GO>
 *
 * @param quote - Market quote with bid and ask sizes
 * @returns Total depth (bid size + ask size)
 */
export declare function measureMarketDepth(quote: MarketQuote): Decimal;
/**
 * Measure bid-side market depth
 *
 * @param quote - Market quote
 * @returns Bid-side depth
 */
export declare function measureBidDepth(quote: MarketQuote): Decimal;
/**
 * Measure ask-side market depth
 *
 * @param quote - Market quote
 * @returns Ask-side depth
 */
export declare function measureAskDepth(quote: MarketQuote): Decimal;
/**
 * Calculate order book imbalance
 *
 * Formula: Imbalance = (BidSize - AskSize) / (BidSize + AskSize)
 * Range: [-1, 1] where 1 = all bids, -1 = all asks
 *
 * @param quote - Market quote
 * @returns Order book imbalance
 */
export declare function calculateOrderBookImbalance(quote: MarketQuote): Decimal;
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
export declare function calculateVWAP(trades: TradeData[]): Decimal;
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
export declare function calculateTWAP(prices: number[]): Decimal;
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
export declare function calculateTurnoverRatio(volume: number, sharesOutstanding: number): Decimal;
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
export declare function calculateAmihudIlliquidity(bars: OHLCVBar[]): Decimal;
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
export declare function calculateRollSpread(prices: number[]): Decimal;
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
export declare function calculateKyleLambda(trades: TradeData[]): Decimal;
/**
 * Calculate Pastor-Stambaugh liquidity measure
 * Reference: Pastor & Stambaugh (2003). "Liquidity Risk and Expected Stock Returns"
 *
 * Measures return reversal following high volume (price impact)
 *
 * @param bars - OHLCV bars
 * @returns Pastor-Stambaugh liquidity measure
 */
export declare function calculatePastorStambaughLiquidity(bars: OHLCVBar[]): Decimal;
/**
 * Calculate Corwin-Schultz spread estimator (from high-low prices)
 * Reference: Corwin & Schultz (2012). "A Simple Way to Estimate Bid-Ask Spreads from Daily High and Low Prices"
 *
 * @param bars - OHLCV bars with high and low prices
 * @returns Estimated bid-ask spread
 */
export declare function calculateCorwinSchultzSpread(bars: OHLCVBar[]): Decimal;
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
export declare function calculateInformationShare(marketReturns: number[], totalReturns: number[]): Decimal;
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
export declare function calculateLiquidityAdjustedVaR(position: number, price: number, volatility: number, spread: number, confidenceLevel?: number): Decimal;
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
export declare function calculateLiquidityCoverageRatio(highQualityLiquidAssets: number, netCashOutflows30Days: number): Decimal;
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
export declare function calculateNetStableFundingRatio(availableStableFunding: number, requiredStableFunding: number): Decimal;
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
export declare function calculateHuiHeubelRatio(bar: OHLCVBar, sharesOutstanding: number): Decimal;
/**
 * Calculate effective tick metric
 * Measures granularity of price quotes
 *
 * @param prices - Array of observed prices
 * @returns Effective tick size
 */
export declare function calculateEffectiveTick(prices: number[]): Decimal;
/**
 * Calculate relative spread measure (RSM)
 * Normalized spread for cross-asset comparison
 *
 * @param spread - Absolute spread
 * @param price - Asset price
 * @param volatility - Price volatility
 * @returns Relative spread measure
 */
export declare function calculateRelativeSpreadMeasure(spread: number, price: number, volatility: number): Decimal;
/**
 * Calculate volume statistics (mean, median, standard deviation)
 *
 * @param volumes - Array of volume data
 * @returns Volume statistics
 */
export declare function calculateVolumeStatistics(volumes: number[]): {
    mean: Decimal;
    median: Decimal;
    stdDev: Decimal;
    min: Decimal;
    max: Decimal;
};
/**
 * Calculate intraday volume profile
 * Bloomberg Equivalent: VOLUME_PROFILE <GO>
 *
 * @param bars - Intraday OHLCV bars
 * @returns Volume profile by time period
 */
export declare function calculateVolumeProfile(bars: OHLCVBar[]): Map<number, Decimal>;
/**
 * Calculate share turnover rate
 *
 * Formula: Turnover Rate = (Volume / Shares Outstanding) * 100
 *
 * @param volume - Trading volume
 * @param sharesOutstanding - Total shares outstanding
 * @returns Turnover rate as percentage
 */
export declare function calculateShareTurnoverRate(volume: number, sharesOutstanding: number): Decimal;
/**
 * Measure volume volatility
 *
 * @param volumes - Historical volume data
 * @returns Volume volatility (standard deviation / mean)
 */
export declare function measureVolumeVolatility(volumes: number[]): Decimal;
/**
 * Detect unusual volume patterns
 * Identifies volume spikes beyond threshold
 *
 * @param currentVolume - Current period volume
 * @param historicalVolumes - Historical volume data
 * @param threshold - Number of standard deviations (default: 2)
 * @returns True if volume is unusual
 */
export declare function detectUnusualVolume(currentVolume: number, historicalVolumes: number[], threshold?: number): boolean;
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
export declare function calculateRelativeVolume(currentVolume: number, historicalVolumes: number[]): Decimal;
/**
 * Compute dollar volume
 *
 * @param volume - Share volume
 * @param price - Price per share
 * @returns Dollar volume
 */
export declare function calculateDollarVolume(volume: number, price: number): Decimal;
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
export declare function calculateVolumeWeightedLiquidityScore(spread: number, depth: number, volume: number, weights?: {
    spread: number;
    depth: number;
    volume: number;
}): Decimal;
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
export declare function estimateTemporaryPriceImpact(tradeVolume: number, averageDailyVolume: number, alpha?: number, beta?: number): Decimal;
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
export declare function estimatePermanentPriceImpact(tradeVolume: number, averageDailyVolume: number, gamma?: number): Decimal;
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
export declare function calculateSquareRootPriceImpact(tradeVolume: number, averageDailyVolume: number, dailyVolatility: number): Decimal;
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
export declare function calculateLinearPriceImpact(tradeVolume: number, kyleLambda: number): Decimal;
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
export declare function calculateMarketImpactCost(tradeVolume: number, price: number, spread: number, temporaryImpact: number, permanentImpact: number): Decimal;
/**
 * Estimate slippage for market order
 *
 * @param orderSize - Order size
 * @param orderBook - Current order book
 * @param midPrice - Current mid price
 * @returns Estimated slippage as percentage
 */
export declare function estimateSlippage(orderSize: number, orderBook: OrderBook, midPrice: number): Decimal;
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
export declare function calculateImplementationShortfall(executionPrice: number, decisionPrice: number, side: 'buy' | 'sell'): Decimal;
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
export declare function calculateAlmgrenChrissTrajectory(totalVolume: number, timeHorizon: number, riskAversion?: number): Decimal[];
/**
 * Detect U-shaped intraday liquidity pattern
 * Higher liquidity at open/close, lower at midday
 *
 * @param quotes - Intraday quotes
 * @returns Intraday pattern analysis
 */
export declare function detectUShapedPattern(quotes: MarketQuote[]): IntradayPattern[];
/**
 * Analyze opening/closing auction liquidity
 *
 * @param openingQuotes - Quotes during opening auction
 * @param closingQuotes - Quotes during closing auction
 * @returns Auction liquidity comparison
 */
export declare function analyzeAuctionLiquidity(openingQuotes: MarketQuote[], closingQuotes: MarketQuote[]): {
    openingSpread: Decimal;
    closingSpread: Decimal;
    openingDepth: Decimal;
    closingDepth: Decimal;
    comparison: 'opening_more_liquid' | 'closing_more_liquid' | 'similar';
};
/**
 * Detect lunch-hour liquidity dip
 * Common pattern: reduced liquidity during lunch hours
 *
 * @param quotes - Full day quotes
 * @param lunchHours - Array of lunch hour times (default: [12, 13])
 * @returns True if significant liquidity dip detected
 */
export declare function detectLunchHourDip(quotes: MarketQuote[], lunchHours?: number[]): boolean;
/**
 * Analyze seasonal liquidity patterns
 * Detects day-of-week or month-of-year patterns
 *
 * @param quotes - Historical quotes with timestamps
 * @param groupBy - 'day' or 'month'
 * @returns Liquidity by period
 */
export declare function analyzeSeasonalLiquidity(quotes: MarketQuote[], groupBy?: 'day' | 'month'): Map<number, Decimal>;
/**
 * Calculate time-of-day liquidity score
 *
 * @param quote - Current quote
 * @param historicalPatterns - Historical intraday patterns
 * @returns Liquidity score relative to typical time-of-day (0-100)
 */
export declare function calculateTimeOfDayLiquidityScore(quote: MarketQuote, historicalPatterns: IntradayPattern[]): Decimal;
/**
 * Calculate cross-asset liquidity correlation
 * Measures how liquidity moves together across assets
 *
 * @param asset1Spreads - Spread time series for asset 1
 * @param asset2Spreads - Spread time series for asset 2
 * @returns Correlation coefficient (-1 to 1)
 */
export declare function calculateLiquidityCorrelation(asset1Spreads: number[], asset2Spreads: number[]): Decimal;
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
export declare function measureLiquiditySpillover(sourceSpreads: number[], targetSpreads: number[], lag?: number): Decimal;
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
export declare function calculateCommonalityInLiquidity(assetSpreads: number[], marketSpreads: number[]): Decimal;
/**
 * Detect flight-to-liquidity events
 * Identifies periods when investors flee to more liquid assets
 *
 * @param liquidAssetVolume - Volume in liquid assets
 * @param illiquidAssetVolume - Volume in illiquid assets
 * @param threshold - Z-score threshold for detection (default: 2)
 * @returns True if flight-to-liquidity detected
 */
export declare function detectFlightToLiquidity(liquidAssetVolume: number[], illiquidAssetVolume: number[], threshold?: number): boolean;
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
export declare function calculateLiquidityRiskPremium(assetReturn: number, riskFreeRate: number, liquidityMeasure: number, marketRiskPremium: number): Decimal;
/**
 * Calculate Liquidity-at-Risk (LaR)
 * Probability that liquidity will fall below threshold
 *
 * @param currentLiquidity - Current liquidity level
 * @param liquidityVolatility - Liquidity volatility
 * @param confidenceLevel - Confidence level (e.g., 0.95)
 * @returns Minimum expected liquidity at confidence level
 */
export declare function calculateLiquidityAtRisk(currentLiquidity: number, liquidityVolatility: number, confidenceLevel?: number): Decimal;
/**
 * Assess funding liquidity risk
 * Risk of not being able to meet payment obligations
 *
 * @param cashReserves - Available cash reserves
 * @param expectedOutflows - Expected cash outflows
 * @param contingentLiabilities - Contingent liabilities
 * @returns Funding risk score (0-100, higher = more risk)
 */
export declare function assessFundingLiquidityRisk(cashReserves: number, expectedOutflows: number, contingentLiabilities: number): Decimal;
/**
 * Assess market liquidity risk
 * Risk of adverse price movement when unwinding positions
 *
 * @param positionSize - Size of position
 * @param averageDailyVolume - Average daily trading volume
 * @param volatility - Price volatility
 * @returns Market liquidity risk score (0-100)
 */
export declare function assessMarketLiquidityRisk(positionSize: number, averageDailyVolume: number, volatility: number): Decimal;
/**
 * Perform liquidity stress test
 * Simulates liquidity under adverse scenarios
 *
 * @param currentLiquidity - Current liquidity metrics
 * @param stressScenario - Stress scenario parameters
 * @returns Stressed liquidity metrics
 */
export declare function performLiquidityStressTest(currentLiquidity: LiquidityMetrics, stressScenario: {
    spreadIncrease: number;
    depthDecrease: number;
    turnoverDecrease: number;
}): LiquidityMetrics;
/**
 * Analyze liquidity gap
 * Difference between liquidity needs and available liquidity
 *
 * @param requiredLiquidity - Liquidity needed for operations
 * @param availableLiquidity - Current available liquidity
 * @param timeHorizon - Time horizon in days
 * @returns Liquidity gap analysis
 */
export declare function analyzeLiquidityGap(requiredLiquidity: number, availableLiquidity: number, timeHorizon: number): {
    gap: Decimal;
    gapRatio: Decimal;
    isAdequate: boolean;
    daysToShortfall: Decimal | null;
};
export { calculateBidAskSpread, calculateRelativeSpread, calculatePercentageSpread, calculateQuotedSpread, calculateEffectiveSpread, calculateRealizedSpread, calculatePriceImpactSpread, measureMarketDepth, measureBidDepth, measureAskDepth, calculateOrderBookImbalance, calculateVWAP, calculateTWAP, calculateTurnoverRatio, calculateAmihudIlliquidity, calculateRollSpread, calculateKyleLambda, calculatePastorStambaughLiquidity, calculateCorwinSchultzSpread, calculateInformationShare, calculateLiquidityAdjustedVaR, calculateLiquidityCoverageRatio, calculateNetStableFundingRatio, calculateHuiHeubelRatio, calculateEffectiveTick, calculateRelativeSpreadMeasure, calculateVolumeStatistics, calculateVolumeProfile, calculateShareTurnoverRate, measureVolumeVolatility, detectUnusualVolume, calculateRelativeVolume, calculateDollarVolume, calculateVolumeWeightedLiquidityScore, estimateTemporaryPriceImpact, estimatePermanentPriceImpact, calculateSquareRootPriceImpact, calculateLinearPriceImpact, calculateMarketImpactCost, estimateSlippage, calculateImplementationShortfall, calculateAlmgrenChrissTrajectory, detectUShapedPattern, analyzeAuctionLiquidity, detectLunchHourDip, analyzeSeasonalLiquidity, calculateTimeOfDayLiquidityScore, calculateLiquidityCorrelation, measureLiquiditySpillover, calculateCommonalityInLiquidity, detectFlightToLiquidity, calculateLiquidityRiskPremium, calculateLiquidityAtRisk, assessFundingLiquidityRisk, assessMarketLiquidityRisk, performLiquidityStressTest, analyzeLiquidityGap };
//# sourceMappingURL=liquidity-analysis-kit.d.ts.map