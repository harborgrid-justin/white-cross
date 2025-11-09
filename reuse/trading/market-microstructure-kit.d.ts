/**
 * LOC: MKTMICRO001
 * File: /reuse/trading/market-microstructure-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable market microstructure utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Trading execution analytics
 *   - Transaction cost analysis platforms
 *   - Market surveillance systems
 *   - Trading desk analytics
 */
/**
 * File: /reuse/trading/market-microstructure-kit.ts
 * Locator: WC-UTL-MKTMICRO-001
 * Purpose: Institutional-grade market microstructure analysis and transaction cost analytics
 *
 * Upstream: Independent utility module for market microstructure analysis
 * Downstream: ../backend/*, TCA systems, execution analytics, market surveillance, regulatory reporting
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for order book analysis, spread analytics, price impact modeling, TCA, execution quality
 *
 * LLM Context: Comprehensive market microstructure toolkit for implementing production-ready market analysis.
 * Provides order book analytics, bid-ask spread analysis, market depth visualization, price impact models,
 * transaction cost analysis (TCA), slippage estimation, order flow analytics, limit order book dynamics,
 * execution quality metrics, and market fragmentation analysis. Designed for institutional trading operations,
 * regulatory compliance (MiFID II TCA), and best execution analysis.
 */
/**
 * Branded type for prices
 */
export type Price = number & {
    readonly __brand: 'Price';
};
/**
 * Branded type for quantities
 */
export type Quantity = number & {
    readonly __brand: 'Quantity';
};
/**
 * Branded type for basis points
 */
export type BasisPoints = number & {
    readonly __brand: 'BasisPoints';
};
/**
 * Branded type for timestamps
 */
export type Timestamp = number & {
    readonly __brand: 'Timestamp';
};
export declare const asPrice: (value: number) => Price;
export declare const asQuantity: (value: number) => Quantity;
export declare const asBasisPoints: (value: number) => BasisPoints;
export declare const asTimestamp: (value: number) => Timestamp;
export type OrderSide = 'BUY' | 'SELL';
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
    venue?: string;
}
export interface Fill {
    price: Price;
    quantity: Quantity;
    timestamp: Timestamp;
    venue: string;
    fees: BasisPoints;
}
export interface TCAReport {
    symbol: string;
    side: OrderSide;
    totalQuantity: Quantity;
    averageFillPrice: Price;
    benchmarkPrice: Price;
    implementationShortfall: BasisPoints;
    arrivalCost: BasisPoints;
    vwapCost: BasisPoints;
    slippage: BasisPoints;
    marketImpact: BasisPoints;
    timingCost: BasisPoints;
    opportunityCost: BasisPoints;
    totalCost: BasisPoints;
    executionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}
export interface PriceImpactModel {
    permanent: number;
    temporary: number;
    volumePower: number;
    estimatedImpact: BasisPoints;
}
export interface MarketDepthProfile {
    levels: number;
    totalBidSize: Quantity;
    totalAskSize: Quantity;
    cumulativeBidValue: number;
    cumulativeAskValue: number;
    depthImbalance: number;
    averageSpreadByLevel: BasisPoints[];
}
/**
 * Parse and validate order book data
 * Ensures order book integrity (bids descending, asks ascending, no crossed quotes)
 *
 * @param rawOrderBook - Raw order book data
 * @returns Validated and sorted order book
 * @throws Error if order book is invalid (crossed quotes, negative sizes)
 */
export declare function parseOrderBook(rawOrderBook: OrderBook): OrderBook;
/**
 * Calculate mid price (average of best bid and ask)
 *
 * @param orderBook - Order book
 * @returns Mid price
 * @throws Error if order book is empty
 */
export declare function calculateMidPrice(orderBook: OrderBook): Price;
/**
 * Calculate volume-weighted mid price
 * More accurate than simple mid when sizes are imbalanced
 *
 * @param orderBook - Order book
 * @returns Volume-weighted mid price
 */
export declare function calculateWeightedMidPrice(orderBook: OrderBook): Price;
/**
 * Calculate order book imbalance
 * Measures supply/demand pressure
 *
 * @param orderBook - Order book
 * @param depth - Number of levels to include (default: 5)
 * @returns Imbalance ratio (-1 = heavy ask pressure, +1 = heavy bid pressure, 0 = balanced)
 */
export declare function calculateOrderBookImbalance(orderBook: OrderBook, depth?: number): number;
/**
 * Calculate book depth at specified levels
 * Provides cumulative size available at each price level
 *
 * @param orderBook - Order book
 * @param numberOfLevels - Number of levels to analyze
 * @returns Depth profile with cumulative sizes
 */
export declare function calculateBookDepth(orderBook: OrderBook, numberOfLevels?: number): MarketDepthProfile;
/**
 * Estimate liquidity profile (cumulative size vs price)
 * Shows how much liquidity is available within price range
 *
 * @param orderBook - Order book
 * @param priceRange - Price range from mid in basis points
 * @returns Cumulative liquidity within price range for each side
 */
export declare function estimateLiquidityProfile(orderBook: OrderBook, priceRange: BasisPoints): {
    bidLiquidity: Quantity;
    askLiquidity: Quantity;
    totalLiquidity: Quantity;
};
/**
 * Calculate best bid and ask (top of book)
 *
 * @param orderBook - Order book
 * @returns Best bid/ask prices and sizes
 */
export declare function calculateBestBidAsk(orderBook: OrderBook): {
    bestBid: Price;
    bestBidSize: Quantity;
    bestAsk: Price;
    bestAskSize: Quantity;
};
/**
 * Analyze order book slope (price-quantity relationship)
 * Steeper slope = less liquid, flatter slope = more liquid
 *
 * @param orderBook - Order book
 * @param levels - Number of levels to analyze
 * @returns Slope coefficients for bid and ask sides
 */
export declare function analyzeOrderBookSlope(orderBook: OrderBook, levels?: number): {
    bidSlope: number;
    askSlope: number;
    liquidity: 'HIGH' | 'MEDIUM' | 'LOW';
};
/**
 * Detect order book patterns (support/resistance levels)
 * Identifies significant price levels with large quantity
 *
 * @param orderBook - Order book
 * @param threshold - Quantity threshold for significant level (as ratio of average)
 * @returns Detected support (bid) and resistance (ask) levels
 */
export declare function detectOrderBookPattern(orderBook: OrderBook, threshold?: number): {
    supportLevels: OrderBookLevel[];
    resistanceLevels: OrderBookLevel[];
};
/**
 * Calculate microprice (information-adjusted mid price)
 * Uses order book depth to estimate "true" price
 *
 * @param orderBook - Order book
 * @returns Microprice estimate
 *
 * Reference: Stoikov, S. (2018). "The Micro-Price: A High-Frequency Estimator of Future Prices"
 * Formula: microprice = (ask * bidSize + bid * askSize) / (bidSize + askSize)
 */
export declare function calculateMicroPrice(orderBook: OrderBook): Price;
/**
 * Calculate absolute bid-ask spread
 *
 * @param quote - Current quote
 * @returns Absolute spread in price units
 */
export declare function calculateBidAskSpread(quote: Quote): Price;
/**
 * Calculate relative spread (percentage spread)
 *
 * @param quote - Current quote
 * @returns Spread as percentage of mid price in basis points
 */
export declare function calculateRelativeSpread(quote: Quote): BasisPoints;
/**
 * Calculate effective spread
 * Measures actual cost paid relative to mid price at trade time
 *
 * @param trade - Executed trade
 * @param midPriceAtTrade - Mid price at time of trade
 * @returns Effective spread in basis points
 */
export declare function calculateEffectiveSpread(trade: Trade, midPriceAtTrade: Price): BasisPoints;
/**
 * Calculate realized spread
 * Measures price reversion after trade (temporary vs permanent impact)
 *
 * @param trade - Executed trade
 * @param midPriceAtTrade - Mid price at time of trade
 * @param midPriceAfter - Mid price after delay (e.g., 5 minutes)
 * @returns Realized spread in basis points
 */
export declare function calculateRealizedSpread(trade: Trade, midPriceAtTrade: Price, midPriceAfter: Price): BasisPoints;
/**
 * Estimate price impact using square-root model
 * Impact proportional to sqrt(quantity / daily volume)
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily trading volume
 * @param volatility - Asset volatility (annualized)
 * @param currentPrice - Current price
 * @returns Estimated price impact in basis points
 *
 * Reference: Almgren et al. (2005). "Direct estimation of equity market impact"
 */
export declare function estimatePriceImpact(quantity: Quantity, averageDailyVolume: Quantity, volatility: number, currentPrice: Price): BasisPoints;
/**
 * Calculate permanent price impact (information component)
 * Persistent price change due to order information content
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily volume
 * @param volatility - Asset volatility
 * @returns Permanent impact in basis points
 */
export declare function calculatePermanentImpact(quantity: Quantity, averageDailyVolume: Quantity, volatility: number): BasisPoints;
/**
 * Calculate temporary price impact (liquidity component)
 * Transient price change that reverts after execution
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily volume
 * @param executionTime - Time taken to execute (milliseconds)
 * @returns Temporary impact in basis points
 */
export declare function calculateTemporaryImpact(quantity: Quantity, averageDailyVolume: Quantity, executionTime: number): BasisPoints;
/**
 * Model market impact using power law
 * Flexible impact model with calibrated parameters
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily volume
 * @param volatility - Asset volatility
 * @param permanent - Permanent impact coefficient (default 0.1)
 * @param temporary - Temporary impact coefficient (default 0.5)
 * @param power - Power law exponent (default 0.6)
 * @returns Price impact model with estimated impact
 */
export declare function modelMarketImpact(quantity: Quantity, averageDailyVolume: Quantity, volatility: number, permanent?: number, temporary?: number, power?: number): PriceImpactModel;
/**
 * Calculate Implementation Shortfall cost
 * Difference between decision price and average execution price
 *
 * @param decisionPrice - Price when decision to trade was made
 * @param fills - Array of fills
 * @param side - Order side
 * @returns Implementation shortfall in basis points
 */
export declare function calculateImplementationShortfallCost(decisionPrice: Price, fills: Fill[], side: OrderSide): BasisPoints;
/**
 * Calculate arrival cost (cost vs arrival price)
 *
 * @param arrivalPrice - Price at order arrival
 * @param fills - Array of fills
 * @param side - Order side
 * @returns Arrival cost in basis points
 */
export declare function calculateArrivalCost(arrivalPrice: Price, fills: Fill[], side: OrderSide): BasisPoints;
/**
 * Calculate VWAP cost (deviation from volume-weighted average price)
 *
 * @param fills - Array of fills
 * @param marketTrades - Market trades during execution period
 * @param side - Order side
 * @returns VWAP cost in basis points
 */
export declare function calculateVWAPCost(fills: Fill[], marketTrades: Trade[], side: OrderSide): BasisPoints;
/**
 * Calculate slippage (difference between expected and actual execution price)
 *
 * @param expectedPrice - Expected execution price
 * @param fills - Array of fills
 * @param side - Order side
 * @returns Slippage in basis points
 */
export declare function calculateSlippage(expectedPrice: Price, fills: Fill[], side: OrderSide): BasisPoints;
/**
 * Estimate opportunity cost (cost of unfilled quantity)
 *
 * @param orderQuantity - Total order quantity
 * @param filledQuantity - Filled quantity
 * @param orderPrice - Order price
 * @param finalPrice - Final market price
 * @param side - Order side
 * @returns Opportunity cost in basis points
 */
export declare function estimateOpportunityCost(orderQuantity: Quantity, filledQuantity: Quantity, orderPrice: Price, finalPrice: Price, side: OrderSide): BasisPoints;
/**
 * Calculate timing cost (cost of execution timing vs benchmark)
 *
 * @param fills - Array of fills
 * @param benchmarkPrice - Benchmark price (e.g., arrival, VWAP)
 * @param side - Order side
 * @returns Timing cost in basis points
 */
export declare function calculateTimingCost(fills: Fill[], benchmarkPrice: Price, side: OrderSide): BasisPoints;
/**
 * Calculate market impact cost component
 *
 * @param fills - Array of fills
 * @param benchmarkPrice - Pre-trade benchmark price
 * @param side - Order side
 * @returns Market impact cost in basis points
 */
export declare function calculateMarketImpactCost(fills: Fill[], benchmarkPrice: Price, side: OrderSide): BasisPoints;
/**
 * Analyze fill quality metrics
 *
 * @param fills - Array of fills
 * @param orderQuantity - Total order quantity
 * @returns Fill quality metrics
 */
export declare function analyzeFillQuality(fills: Fill[], orderQuantity: Quantity): {
    fillRate: number;
    averagePrice: Price;
    priceStdDev: number;
    numberOfVenues: number;
    averageFillSize: Quantity;
    totalFees: BasisPoints;
};
/**
 * Calculate price reversion after trade
 * Measures how much price reverts after execution (indicates temporary impact)
 *
 * @param fills - Array of fills
 * @param priceAfterExecution - Price after execution window
 * @param side - Order side
 * @returns Reversion in basis points (positive = favorable reversion)
 */
export declare function calculateReversion(fills: Fill[], priceAfterExecution: Price, side: OrderSide): BasisPoints;
/**
 * Estimate total transaction cost analysis
 * Comprehensive TCA combining all cost components
 *
 * @param params - TCA calculation parameters
 * @returns Comprehensive TCA report
 */
export declare function estimateTotalTCA(params: {
    symbol: string;
    side: OrderSide;
    orderQuantity: Quantity;
    fills: Fill[];
    decisionPrice: Price;
    arrivalPrice: Price;
    marketVWAP: Price;
    priceAfterExecution: Price;
}): TCAReport;
/**
 * Benchmark execution against multiple benchmarks
 *
 * @param fills - Array of fills
 * @param benchmarks - Map of benchmark names to prices
 * @param side - Order side
 * @returns Cost relative to each benchmark
 */
export declare function benchmarkExecution(fills: Fill[], benchmarks: {
    [benchmarkName: string]: Price;
}, side: OrderSide): {
    [benchmarkName: string]: BasisPoints;
};
/**
 * Generate comprehensive TCA report with formatted output
 *
 * @param tcaReport - TCA report data
 * @returns Formatted TCA report string
 */
export declare function generateTCAReport(tcaReport: TCAReport): string;
/**
 * Analyze order flow imbalance
 * Measures buy vs sell pressure
 *
 * @param trades - Recent trades
 * @param timeWindow - Time window in milliseconds
 * @returns Order flow imbalance (-1 to 1, negative = sell pressure, positive = buy pressure)
 */
export declare function analyzeOrderFlow(trades: Trade[], timeWindow: number): {
    imbalance: number;
    buyVolume: Quantity;
    sellVolume: Quantity;
    totalVolume: Quantity;
};
/**
 * Calculate intraday volume profile
 * Distribution of volume across trading day
 *
 * @param trades - Historical trades
 * @param buckets - Number of time buckets (default 30-minute intervals = 13 buckets)
 * @returns Volume distribution by time bucket
 */
export declare function calculateVolumeProfile(trades: Trade[], buckets?: number): number[];
/**
 * Estimate probability of informed trading
 * Higher probability suggests more adverse selection risk
 *
 * @param orderFlowImbalance - Recent order flow imbalance
 * @param volatility - Current volatility
 * @param spreadWidening - Recent spread widening (0-1)
 * @returns Probability estimate (0-1)
 */
export declare function estimateInformedTrading(orderFlowImbalance: number, volatility: number, spreadWidening: number): number;
/**
 * Calculate PIN (Probability of Informed Trading) metric
 * Academic measure of information asymmetry
 *
 * @param buyVolume - Total buy volume
 * @param sellVolume - Total sell volume
 * @param days - Number of trading days
 * @returns Simplified PIN estimate
 *
 * Reference: Easley, D., Kiefer, N. M., O'Hara, M., & Paperman, J. B. (1996).
 * "Liquidity, information, and infrequently traded stocks." The Journal of Finance.
 */
export declare function calculatePINMetric(buyVolume: Quantity, sellVolume: Quantity, days: number): number;
/**
 * Analyze trade direction (classify trades as buy or sell)
 * Uses Lee-Ready algorithm
 *
 * @param trade - Trade to classify
 * @param quote - Quote at trade time
 * @returns Classified trade direction
 *
 * Reference: Lee, C., & Ready, M. J. (1991). "Inferring trade direction from intraday data."
 */
export declare function analyzeTradeDirection(trade: Trade, quote: Quote): 'BUY' | 'SELL' | 'UNKNOWN';
/**
 * Calculate effective tick size
 * Actual minimum price increment observed in market
 *
 * @param trades - Recent trades
 * @returns Effective tick size
 */
export declare function calculateEffectiveTickSize(trades: Trade[]): Price;
/**
 * Estimate hidden liquidity in order book
 * Infers presence of iceberg/hidden orders
 *
 * @param trades - Recent trades
 * @param orderBook - Current order book
 * @returns Estimated hidden liquidity ratio
 */
export declare function estimateHiddenLiquidity(trades: Trade[], orderBook: OrderBook): number;
/**
 * Analyze market fragmentation across venues
 *
 * @param tradesByVenue - Map of venue to trades
 * @returns Fragmentation metrics
 */
export declare function analyzeMarketFragmentation(tradesByVenue: {
    [venue: string]: Trade[];
}): {
    numberOfVenues: number;
    herfindahlIndex: number;
    volumeDistribution: {
        [venue: string]: number;
    };
    largestVenueShare: number;
};
/**
 * Compare lit vs dark pool execution quality
 *
 * @param litFills - Fills from lit venues
 * @param darkFills - Fills from dark venues
 * @param benchmarkPrice - Benchmark price
 * @param side - Order side
 * @returns Comparison metrics
 */
export declare function compareLitDarkExecution(litFills: Fill[], darkFills: Fill[], benchmarkPrice: Price, side: OrderSide): {
    litAvgPrice: Price;
    darkAvgPrice: Price;
    litCost: BasisPoints;
    darkCost: BasisPoints;
    litFillRate: number;
    darkFillRate: number;
    recommendation: 'LIT' | 'DARK' | 'MIXED';
};
/**
 * Calculate execution shortfall (performance vs benchmark)
 *
 * @param fills - Execution fills
 * @param benchmarkPrice - Benchmark price
 * @param side - Order side
 * @returns Execution shortfall in basis points (negative = outperformed)
 */
export declare function calculateExecutionShortfall(fills: Fill[], benchmarkPrice: Price, side: OrderSide): BasisPoints;
/**
 * Model limit order book dynamics
 * Estimates order arrival rates and cancellation rates
 *
 * @param orderBookSnapshots - Time series of order book snapshots
 * @returns LOB dynamics model parameters
 */
export declare function modelLimitOrderDynamics(orderBookSnapshots: OrderBook[]): {
    bidArrivalRate: number;
    askArrivalRate: number;
    bidCancellationRate: number;
    askCancellationRate: number;
};
/**
 * Estimate queue jumping probability
 * Likelihood of orders jumping ahead in queue
 *
 * @param orderBookSnapshots - Time series of order book snapshots
 * @returns Queue jumping probability estimate
 */
export declare function estimateQueueJumping(orderBookSnapshots: OrderBook[]): number;
/**
 * Calculate market resiliency
 * Speed at which market recovers from shocks
 *
 * @param priceShock - Magnitude of price shock
 * @param recoveryTimes - Time taken to recover (milliseconds)
 * @returns Average recovery rate
 */
export declare function calculateResiliency(priceShock: Price, recoveryTimes: number[]): number;
/**
 * Analyze tick-by-tick data for microstructure insights
 *
 * @param trades - Tick data
 * @returns Microstructure statistics
 */
export declare function analyzeTickData(trades: Trade[]): {
    avgTradeSize: Quantity;
    tradeFrequency: number;
    priceVolatility: number;
    tickDirection: number;
};
/**
 * Estimate information share (Hasbrouck)
 * Contribution of venue to price discovery
 *
 * @param venueReturns - Returns series for each venue
 * @returns Information share for each venue
 *
 * Reference: Hasbrouck, J. (1995). "One security, many markets: Determining the contributions to price discovery."
 */
export declare function estimateInformationShare(venueReturns: number[][]): number[];
//# sourceMappingURL=market-microstructure-kit.d.ts.map