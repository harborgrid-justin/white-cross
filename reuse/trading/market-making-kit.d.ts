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
import Decimal from 'decimal.js';
type Price = Decimal & {
    readonly __brand: 'Price';
};
type Quantity = Decimal & {
    readonly __brand: 'Quantity';
};
type Spread = Decimal & {
    readonly __brand: 'Spread';
};
type BasisPoints = Decimal & {
    readonly __brand: 'BasisPoints';
};
type Delta = Decimal & {
    readonly __brand: 'Delta';
};
type InventoryValue = Decimal & {
    readonly __brand: 'InventoryValue';
};
type PnL = Decimal & {
    readonly __brand: 'PnL';
};
type Percentage = Decimal & {
    readonly __brand: 'Percentage';
};
type RebateAmount = Decimal & {
    readonly __brand: 'RebateAmount';
};
/**
 * Market maker quote with two-sided pricing
 */
export interface MarketMakerQuote {
    quoteId: string;
    instrumentId: string;
    symbol: string;
    timestamp: Date;
    bidPrice: Price;
    bidSize: Quantity;
    askPrice: Price;
    askSize: Quantity;
    spread: Spread;
    spreadBps: BasisPoints;
    midPrice: Price;
    skew: Decimal;
    quoteState: 'ACTIVE' | 'INACTIVE' | 'PAUSED' | 'WITHDRAWN';
    quoteDuration: number;
    quoteSource: 'ALGORITHM' | 'MANUAL' | 'HYBRID';
}
/**
 * Quote obligation parameters for regulatory compliance
 */
export interface QuoteObligation {
    instrumentId: string;
    minQuoteTime: number;
    maxSpreadBps: BasisPoints;
    minQuoteSize: Quantity;
    maxAwayFromMarket: BasisPoints;
    obligationMet: boolean;
    currentUptime: number;
    violations: QuoteViolation[];
}
/**
 * Quote obligation violation record
 */
export interface QuoteViolation {
    violationId: string;
    timestamp: Date;
    type: 'SPREAD_EXCEEDED' | 'SIZE_TOO_SMALL' | 'AWAY_FROM_MARKET' | 'DOWNTIME_EXCEEDED';
    details: string;
    severity: 'WARNING' | 'MINOR' | 'MAJOR' | 'CRITICAL';
}
/**
 * Market maker inventory position
 */
export interface MarketMakerInventory {
    instrumentId: string;
    symbol: string;
    currentPosition: Quantity;
    targetPosition: Quantity;
    maxPosition: Quantity;
    minPosition: Quantity;
    inventoryValue: InventoryValue;
    averageCost: Price;
    unrealizedPnL: PnL;
    delta: Delta;
    inventoryRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    needsHedging: boolean;
    recommendedHedgeSize: Quantity;
}
/**
 * Market maker P&L attribution
 */
export interface MarketMakerPnL {
    marketMakerId: string;
    instrumentId: string;
    period: 'INTRADAY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    timestamp: Date;
    spreadCapture: PnL;
    inventoryPnL: PnL;
    rebateIncome: RebateAmount;
    adverseSelectionLoss: PnL;
    hedgingCosts: PnL;
    totalPnL: PnL;
    returnOnCapital: Percentage;
    sharpeRatio: Decimal;
}
/**
 * Spread optimization parameters
 */
export interface SpreadOptimizationParams {
    baseSpreadBps: BasisPoints;
    volatilityAdjustment: Decimal;
    inventoryAdjustment: Decimal;
    competitionAdjustment: Decimal;
    adverseSelectionAdjustment: Decimal;
    timeOfDayAdjustment: Decimal;
    optimalSpreadBps: BasisPoints;
    confidence: Percentage;
}
/**
 * Quote stuffing detection metrics
 */
export interface QuoteStuffingMetrics {
    instrumentId: string;
    timestamp: Date;
    quoteRate: number;
    cancelRate: number;
    quoteToTradeRatio: Decimal;
    averageQuoteLifetime: number;
    isStuffing: boolean;
    stuffingScore: Decimal;
    action: 'NONE' | 'THROTTLE' | 'WARN' | 'BLOCK';
}
/**
 * Market maker rebate structure
 */
export interface RebateStructure {
    exchange: string;
    instrumentType: 'EQUITY' | 'OPTION' | 'FUTURE' | 'FOREX' | 'CRYPTO';
    makerRebate: RebateAmount;
    takerFee: RebateAmount;
    volumeTiers: VolumeTier[];
    minimumQuoteTime: number;
    minimumSpreadBps: BasisPoints;
}
/**
 * Volume tier for rebate calculation
 */
export interface VolumeTier {
    minVolume: Quantity;
    maxVolume: Quantity;
    rebateMultiplier: Decimal;
}
/**
 * Adverse selection detection result
 */
export interface AdverseSelectionMetrics {
    instrumentId: string;
    timestamp: Date;
    fillRate: Percentage;
    adverseMovement: Price;
    winRate: Percentage;
    adverseSelectionRatio: Decimal;
    isHighRisk: boolean;
    recommendedAction: 'WIDEN_SPREAD' | 'REDUCE_SIZE' | 'PAUSE_QUOTING' | 'CONTINUE';
}
/**
 * Automated Market Maker (AMM) state
 */
export interface AMMState {
    poolId: string;
    algorithm: 'CONSTANT_PRODUCT' | 'CONSTANT_SUM' | 'HYBRID' | 'CONCENTRATED_LIQUIDITY';
    asset1: string;
    asset2: string;
    reserve1: Quantity;
    reserve2: Quantity;
    liquidityTokenSupply: Quantity;
    feePercentage: Percentage;
    kValue?: Decimal;
    price: Price;
    virtualLiquidity: Decimal;
}
/**
 * Liquidity provision strategy
 */
export interface LiquidityProvisionStrategy {
    strategyId: string;
    type: 'PASSIVE' | 'AGGRESSIVE' | 'ADAPTIVE' | 'MARKET_NEUTRAL';
    instrumentId: string;
    targetSpreadBps: BasisPoints;
    quoteSize: Quantity;
    maxInventory: Quantity;
    hedgingEnabled: boolean;
    riskAdjustment: 'LOW' | 'MEDIUM' | 'HIGH';
    rebalanceFrequency: number;
}
/**
 * Market maker performance metrics
 */
export interface MarketMakerPerformance {
    marketMakerId: string;
    period: Date;
    instrumentId: string;
    totalQuotes: number;
    activeTrades: number;
    fillRate: Percentage;
    averageSpreadCaptured: BasisPoints;
    totalVolume: Quantity;
    marketShare: Percentage;
    uptimePercentage: Percentage;
    profitPerTrade: PnL;
    riskAdjustedReturn: Decimal;
    quotingEfficiency: Percentage;
}
/**
 * Quote update decision
 */
export interface QuoteUpdateDecision {
    shouldUpdate: boolean;
    reason: 'MARKET_MOVE' | 'INVENTORY_CHANGE' | 'COMPETITION' | 'TIME_DECAY' | 'VOLATILITY_SHIFT' | 'NONE';
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    newBidPrice?: Price;
    newAskPrice?: Price;
    newBidSize?: Quantity;
    newAskSize?: Quantity;
}
/**
 * Order book level for market making
 */
export interface OrderBookLevel {
    price: Price;
    quantity: Quantity;
    orderCount: number;
    isOwnQuote: boolean;
}
/**
 * Market maker order book state
 */
export interface MarketMakerOrderBook {
    instrumentId: string;
    timestamp: Date;
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    ownBidLevels: number;
    ownAskLevels: number;
    competitorBids: number;
    competitorAsks: number;
    bestCompetitorBid: Price;
    bestCompetitorAsk: Price;
    marketDepth: Quantity;
}
/**
 * Delta hedge position
 */
export interface DeltaHedgePosition {
    instrumentId: string;
    underlyingSymbol: string;
    currentDelta: Delta;
    targetDelta: Delta;
    hedgeRequired: Quantity;
    hedgeInstrument: string;
    hedgeCost: Price;
    hedgeEfficiency: Percentage;
}
/**
 * Quote skew parameters
 */
export interface QuoteSkewParams {
    inventoryPosition: Quantity;
    targetPosition: Quantity;
    maxPosition: Quantity;
    currentVolatility: Decimal;
    riskAversion: Decimal;
    skewMultiplier: Decimal;
    bidSkew: BasisPoints;
    askSkew: BasisPoints;
}
/**
 * Market impact estimation
 */
export interface MarketImpactEstimate {
    orderSize: Quantity;
    side: 'BUY' | 'SELL';
    estimatedImpact: BasisPoints;
    permanentImpact: BasisPoints;
    temporaryImpact: BasisPoints;
    confidenceInterval: [BasisPoints, BasisPoints];
    recommendedSlicing: number;
}
/**
 * Competitor market maker analysis
 */
export interface CompetitorAnalysis {
    instrumentId: string;
    timestamp: Date;
    competitors: CompetitorMetrics[];
    marketConcentration: Decimal;
    averageCompetitorSpread: BasisPoints;
    ownRanking: number;
    marketShareOpportunity: Percentage;
    competitiveAdvantage: 'PRICE' | 'SIZE' | 'SPEED' | 'NONE';
}
/**
 * Individual competitor metrics
 */
export interface CompetitorMetrics {
    competitorId: string;
    marketShare: Percentage;
    averageSpread: BasisPoints;
    averageSize: Quantity;
    quoteUptime: Percentage;
    responseTime: number;
    aggressiveness: 'LOW' | 'MEDIUM' | 'HIGH';
}
/**
 * Generate a two-sided market maker quote
 * Creates bid and ask quotes with specified spread and size
 *
 * @param params - Quote generation parameters
 * @returns Market maker quote
 */
export declare function generateTwoSidedQuote(params: {
    instrumentId: string;
    symbol: string;
    midPrice: Price;
    spreadBps: BasisPoints;
    bidSize: Quantity;
    askSize: Quantity;
    skew?: Decimal;
}): MarketMakerQuote;
/**
 * Calculate optimal quote spread based on market conditions
 * Uses volatility, inventory, competition, and adverse selection
 *
 * @param params - Spread optimization inputs
 * @returns Optimal spread parameters
 */
export declare function calculateOptimalSpread(params: {
    baseSpreadBps: BasisPoints;
    volatility: Decimal;
    inventoryRatio: Decimal;
    competitorSpreadBps: BasisPoints;
    adverseSelectionRate: Percentage;
    timeOfDay: Date;
}): SpreadOptimizationParams;
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
export declare function determineQuoteUpdate(currentQuote: MarketMakerQuote, marketMidPrice: Price, inventory: MarketMakerInventory, threshold: BasisPoints): QuoteUpdateDecision;
/**
 * Calculate quote skew based on inventory position
 * Skews quotes to reduce inventory risk
 *
 * @param inventory - Current inventory
 * @param volatility - Current volatility
 * @param riskAversion - Risk aversion parameter (0-1)
 * @returns Quote skew parameters
 */
export declare function calculateInventorySkew(inventory: MarketMakerInventory, volatility: Decimal, riskAversion: Decimal): QuoteSkewParams;
/**
 * Check if quote obligations are being met
 * Monitors regulatory requirements for market makers
 *
 * @param obligation - Quote obligation parameters
 * @param currentQuote - Current active quote
 * @returns Updated obligation status
 */
export declare function checkQuoteObligation(obligation: QuoteObligation, currentQuote: MarketMakerQuote | null): QuoteObligation;
/**
 * Calculate quote uptime percentage
 * Measures percentage of time quotes were active
 *
 * @param quotes - Historical quotes
 * @param startTime - Period start
 * @param endTime - Period end
 * @returns Uptime percentage
 */
export declare function calculateQuoteUptime(quotes: MarketMakerQuote[], startTime: Date, endTime: Date): Percentage;
/**
 * Validate quote against NBBO (National Best Bid and Offer)
 * Ensures quote is within acceptable distance from market
 *
 * @param quote - Market maker quote
 * @param nbbo - National best bid and offer
 * @param maxDeviation - Maximum allowed deviation in bps
 * @returns Validation result
 */
export declare function validateQuoteAgainstNBBO(quote: MarketMakerQuote, nbbo: {
    bestBid: Price;
    bestAsk: Price;
}, maxDeviation: BasisPoints): {
    valid: boolean;
    reason?: string;
};
/**
 * Update market maker inventory after trade execution
 * Tracks position, P&L, and risk metrics
 *
 * @param inventory - Current inventory
 * @param trade - Executed trade
 * @param currentPrice - Current market price
 * @returns Updated inventory
 */
export declare function updateInventoryPosition(inventory: MarketMakerInventory, trade: {
    side: 'BUY' | 'SELL';
    quantity: Quantity;
    price: Price;
}, currentPrice: Price): MarketMakerInventory;
/**
 * Calculate inventory risk score
 * Measures risk exposure from current inventory
 *
 * @param inventory - Current inventory
 * @param volatility - Price volatility
 * @param liquidationTime - Expected time to liquidate (hours)
 * @returns Risk score (0-100)
 */
export declare function calculateInventoryRisk(inventory: MarketMakerInventory, volatility: Decimal, liquidationTime: number): Decimal;
/**
 * Determine optimal hedge for inventory position
 * Calculates hedge instrument and size
 *
 * @param inventory - Current inventory
 * @param hedgeInstruments - Available hedging instruments
 * @returns Recommended hedge position
 */
export declare function determineOptimalHedge(inventory: MarketMakerInventory, hedgeInstruments: Array<{
    symbol: string;
    delta: Delta;
    cost: Price;
    liquidity: Quantity;
}>): DeltaHedgePosition | null;
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
export declare function calculateMarketMakerPnL(params: {
    marketMakerId: string;
    instrumentId: string;
    trades: Array<{
        side: 'BUY' | 'SELL';
        quantity: Quantity;
        price: Price;
        quoteId: string;
    }>;
    quotes: MarketMakerQuote[];
    rebates: RebateAmount;
    hedgingCosts: PnL;
    period: 'INTRADAY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}): MarketMakerPnL;
/**
 * Calculate spread capture efficiency
 * Measures how much of theoretical spread is actually captured
 *
 * @param theoreticalSpread - Quoted spread
 * @param actualSpreadCapture - Realized spread capture
 * @param volume - Trading volume
 * @returns Capture efficiency percentage
 */
export declare function calculateSpreadCaptureEfficiency(theoreticalSpread: Spread, actualSpreadCapture: PnL, volume: Quantity): Percentage;
/**
 * Detect potential quote stuffing activity
 * Identifies excessive quote/cancel behavior
 *
 * @param quotes - Recent quotes
 * @param trades - Recent trades
 * @param windowSeconds - Analysis window in seconds
 * @returns Quote stuffing metrics
 */
export declare function detectQuoteStuffing(instrumentId: string, quotes: MarketMakerQuote[], trades: Array<{
    timestamp: Date;
}>, windowSeconds: number): QuoteStuffingMetrics;
/**
 * Calculate optimal quote update frequency
 * Balances responsiveness with quote stuffing prevention
 *
 * @param marketVolatility - Current market volatility
 * @param competition - Number of competing market makers
 * @param inventoryRisk - Current inventory risk level
 * @returns Recommended update frequency in milliseconds
 */
export declare function calculateOptimalQuoteFrequency(marketVolatility: Decimal, competition: number, inventoryRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): number;
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
export declare function calculateMarketMakerRebates(structure: RebateStructure, volume: Quantity, quoteUptime: Percentage, averageSpread: BasisPoints): RebateAmount;
/**
 * Estimate rebate income for quote
 * Projects rebate earnings based on expected fill rate
 *
 * @param quote - Market maker quote
 * @param rebatePerShare - Rebate per share
 * @param expectedFillRate - Expected fill rate (0-1)
 * @returns Estimated rebate income
 */
export declare function estimateRebateIncome(quote: MarketMakerQuote, rebatePerShare: RebateAmount, expectedFillRate: Percentage): RebateAmount;
/**
 * Detect adverse selection in market making
 * Identifies when informed traders are picking off quotes
 *
 * @param trades - Recent trades
 * @param priceMovements - Post-trade price movements
 * @param windowSize - Number of trades to analyze
 * @returns Adverse selection metrics
 */
export declare function detectAdverseSelection(instrumentId: string, trades: Array<{
    side: 'BUY' | 'SELL';
    price: Price;
    timestamp: Date;
}>, priceMovements: Array<{
    tradeTimestamp: Date;
    priceChangeAfter: Decimal;
}>, windowSize: number): AdverseSelectionMetrics;
/**
 * Calculate adverse selection cost
 * Estimates cost of being picked off by informed traders
 *
 * @param trades - Executed trades
 * @param postTradePrices - Prices after each trade
 * @param horizonMinutes - Time horizon for measuring adverse movement
 * @returns Adverse selection cost
 */
export declare function calculateAdverseSelectionCost(trades: Array<{
    side: 'BUY' | 'SELL';
    price: Price;
    quantity: Quantity;
}>, postTradePrices: Price[], horizonMinutes: number): PnL;
/**
 * Calculate constant product AMM price
 * Implements x * y = k curve (Uniswap-style)
 *
 * @param state - AMM pool state
 * @param tradeAmount - Amount to trade
 * @param tradeAsset - Asset being traded (1 or 2)
 * @returns Output amount and new state
 */
export declare function calculateConstantProductAMM(state: AMMState, tradeAmount: Quantity, tradeAsset: 1 | 2): {
    outputAmount: Quantity;
    newState: AMMState;
    effectivePrice: Price;
};
/**
 * Calculate constant sum AMM price
 * Implements x + y = k curve (stable swap)
 *
 * @param state - AMM pool state
 * @param tradeAmount - Amount to trade
 * @param tradeAsset - Asset being traded
 * @returns Output amount (1:1 swap minus fees)
 */
export declare function calculateConstantSumAMM(state: AMMState, tradeAmount: Quantity, tradeAsset: 1 | 2): {
    outputAmount: Quantity;
    newState: AMMState;
    effectivePrice: Price;
};
/**
 * Calculate hybrid AMM price
 * Combines constant product and constant sum for optimal pricing
 *
 * @param state - AMM pool state
 * @param tradeAmount - Amount to trade
 * @param tradeAsset - Asset being traded
 * @returns Output amount and new state
 */
export declare function calculateHybridAMM(state: AMMState, tradeAmount: Quantity, tradeAsset: 1 | 2): {
    outputAmount: Quantity;
    newState: AMMState;
    effectivePrice: Price;
};
/**
 * Calculate AMM liquidity provider share
 * Computes LP tokens for liquidity provision
 *
 * @param state - Current AMM state
 * @param asset1Amount - Amount of asset 1 to deposit
 * @param asset2Amount - Amount of asset 2 to deposit
 * @returns LP tokens issued
 */
export declare function calculateAMMLiquidityShare(state: AMMState, asset1Amount: Quantity, asset2Amount: Quantity): Quantity;
/**
 * Calculate comprehensive market maker performance metrics
 * Analyzes efficiency, profitability, and market presence
 *
 * @param params - Performance calculation parameters
 * @returns Performance metrics
 */
export declare function calculateMarketMakerPerformance(params: {
    marketMakerId: string;
    instrumentId: string;
    period: Date;
    quotes: MarketMakerQuote[];
    trades: Array<{
        timestamp: Date;
        pnl: PnL;
    }>;
    totalVolume: Quantity;
    marketTotalVolume: Quantity;
}): MarketMakerPerformance;
/**
 * Analyze market maker quote quality
 * Measures spread tightness, size, and consistency
 *
 * @param quotes - Historical quotes
 * @returns Quality score (0-100)
 */
export declare function analyzeQuoteQuality(quotes: MarketMakerQuote[]): {
    qualityScore: Decimal;
    spreadConsistency: Decimal;
    sizeConsistency: Decimal;
    uptimeScore: Decimal;
};
/**
 * Estimate market impact of market maker quote
 * Predicts how quote will affect market price
 *
 * @param quote - Proposed quote
 * @param orderBook - Current order book
 * @param liquidityFactor - Market liquidity measure
 * @returns Market impact estimate
 */
export declare function estimateMarketImpact(quote: MarketMakerQuote, orderBook: {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
}, liquidityFactor: Decimal): MarketImpactEstimate;
/**
 * Analyze competitor market makers
 * Identifies and evaluates competing market makers
 *
 * @param instrumentId - Instrument being analyzed
 * @param orderBook - Current order book with participant IDs
 * @param marketVolume - Total market volume
 * @returns Competitor analysis
 */
export declare function analyzeCompetitors(instrumentId: string, orderBook: MarketMakerOrderBook, marketVolume: Quantity, ownMarketShare: Percentage): CompetitorAnalysis;
/**
 * Calculate competitive positioning score
 * Measures market maker's competitive strength
 *
 * @param performance - Market maker performance
 * @param competitorAnalysis - Competitor analysis
 * @returns Competitive score (0-100)
 */
export declare function calculateCompetitiveScore(performance: MarketMakerPerformance, competitorAnalysis: CompetitorAnalysis): Decimal;
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
export declare function recommendMarketMakingStrategy(inventory: MarketMakerInventory, performance: MarketMakerPerformance, adverseSelection: AdverseSelectionMetrics, competition: CompetitorAnalysis): LiquidityProvisionStrategy;
/**
 * Calculate order book depth at price level
 * Measures available liquidity at specific price
 *
 * @param orderBook - Market maker order book
 * @param targetPrice - Price level to measure
 * @param side - Bid or ask side
 * @returns Cumulative depth at price level
 */
export declare function calculateDepthAtPrice(orderBook: MarketMakerOrderBook, targetPrice: Price, side: 'BID' | 'ASK'): Quantity;
/**
 * Optimize quote placement in order book
 * Determines best price levels to maximize fill probability
 *
 * @param orderBook - Current order book
 * @param desiredSpread - Target spread in bps
 * @param aggression - Aggression level (0-1)
 * @returns Optimal bid and ask prices
 */
export declare function optimizeQuotePlacement(orderBook: MarketMakerOrderBook, desiredSpread: BasisPoints, aggression: Decimal): {
    bidPrice: Price;
    askPrice: Price;
};
/**
 * Calculate order book pressure
 * Measures buying vs selling pressure from order book
 *
 * @param orderBook - Market maker order book
 * @param levels - Number of levels to analyze
 * @returns Pressure score (-1 = sell pressure, +1 = buy pressure)
 */
export declare function calculateOrderBookPressure(orderBook: MarketMakerOrderBook, levels?: number): Decimal;
/**
 * Detect order book toxicity
 * Identifies abnormal order book conditions
 *
 * @param orderBook - Current order book
 * @param historicalBooks - Historical order books for comparison
 * @returns Toxicity score (0-100, higher = more toxic)
 */
export declare function detectOrderBookToxicity(orderBook: MarketMakerOrderBook, historicalBooks: MarketMakerOrderBook[]): Decimal;
/**
 * Calculate optimal quote size based on order book
 * Sizes quotes to match market depth
 *
 * @param orderBook - Current order book
 * @param targetPercentage - Target percentage of top-of-book
 * @param maxSize - Maximum allowed size
 * @returns Optimal quote sizes
 */
export declare function calculateOptimalQuoteSize(orderBook: MarketMakerOrderBook, targetPercentage: Percentage, maxSize: Quantity): {
    bidSize: Quantity;
    askSize: Quantity;
};
/**
 * Calculate delta exposure from market making positions
 * Computes net delta across all positions
 *
 * @param positions - Array of market maker inventories
 * @returns Total delta exposure
 */
export declare function calculateTotalDeltaExposure(positions: MarketMakerInventory[]): Delta;
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
export declare function generateDeltaHedgingPlan(currentDelta: Delta, targetDelta: Delta, hedgeInstrument: {
    symbol: string;
    delta: Delta;
    minSize: Quantity;
}, maxSliceSize: Quantity): Array<{
    size: Quantity;
    side: 'BUY' | 'SELL';
}>;
/**
 * Calculate hedging efficiency
 * Measures cost-effectiveness of hedge
 *
 * @param hedgeCost - Total cost of hedging
 * @param riskReduction - Amount of risk reduced
 * @param timeHorizon - Time horizon in hours
 * @returns Efficiency ratio
 */
export declare function calculateHedgingEfficiency(hedgeCost: PnL, riskReduction: Decimal, timeHorizon: number): Decimal;
/**
 * Determine dynamic hedge ratio
 * Calculates optimal hedge ratio based on market conditions
 *
 * @param volatility - Current volatility
 * @param correlation - Correlation between asset and hedge
 * @param riskTolerance - Risk tolerance (0-1)
 * @returns Optimal hedge ratio
 */
export declare function determineDynamicHedgeRatio(volatility: Decimal, correlation: Decimal, riskTolerance: Decimal): Decimal;
/**
 * Calculate volatility-adjusted spread
 * Widens spread during high volatility periods
 *
 * @param baseSpread - Base spread in bps
 * @param currentVolatility - Current volatility
 * @param targetVolatility - Target/normal volatility
 * @returns Adjusted spread
 */
export declare function calculateVolatilityAdjustedSpread(baseSpread: BasisPoints, currentVolatility: Decimal, targetVolatility: Decimal): BasisPoints;
/**
 * Calculate time-of-day spread adjustment
 * Adjusts spread based on intraday patterns
 *
 * @param baseSpread - Base spread
 * @param currentTime - Current time
 * @param sessionType - Trading session type
 * @returns Adjusted spread
 */
export declare function calculateTimeOfDaySpreadAdjustment(baseSpread: BasisPoints, currentTime: Date, sessionType: 'PRE_MARKET' | 'OPEN' | 'MID_DAY' | 'CLOSE' | 'POST_MARKET'): BasisPoints;
/**
 * Calculate spread based on order flow toxicity
 * Widens spread when detecting toxic order flow
 *
 * @param baseSpread - Base spread
 * @param toxicityScore - Order flow toxicity (0-100)
 * @returns Adjusted spread
 */
export declare function calculateToxicityAdjustedSpread(baseSpread: BasisPoints, toxicityScore: Decimal): BasisPoints;
/**
 * Optimize spread for profit maximization
 * Finds spread that maximizes expected profit
 *
 * @param fillProbabilities - Fill probabilities at different spreads
 * @param spreadLevels - Spread levels in bps
 * @param expectedVolume - Expected trading volume
 * @returns Optimal spread
 */
export declare function optimizeSpreadForProfit(fillProbabilities: Decimal[], spreadLevels: BasisPoints[], expectedVolume: Quantity): BasisPoints;
/**
 * Calculate quote response time
 * Measures how quickly quotes are updated after market changes
 *
 * @param marketUpdates - Market update timestamps
 * @param quoteUpdates - Quote update timestamps
 * @returns Average response time in milliseconds
 */
export declare function calculateQuoteResponseTime(marketUpdates: Date[], quoteUpdates: Date[]): number;
/**
 * Calculate realized volatility from quote changes
 * Measures actual volatility of quoted prices
 *
 * @param quotes - Historical quotes
 * @returns Realized volatility (annualized)
 */
export declare function calculateRealizedVolatility(quotes: MarketMakerQuote[]): Decimal;
/**
 * Calculate market maker win rate
 * Percentage of profitable trades
 *
 * @param trades - Trade history with P&L
 * @returns Win rate percentage
 */
export declare function calculateWinRate(trades: Array<{
    pnl: PnL;
}>): Percentage;
/**
 * Calculate average holding period
 * Average time between opening and closing positions
 *
 * @param positions - Position history with timestamps
 * @returns Average holding period in hours
 */
export declare function calculateAverageHoldingPeriod(positions: Array<{
    openTime: Date;
    closeTime: Date;
}>): number;
/**
 * Calculate quote stability score
 * Measures how stable quotes remain over time
 *
 * @param quotes - Historical quotes
 * @param windowMinutes - Time window to analyze
 * @returns Stability score (0-100)
 */
export declare function calculateQuoteStability(quotes: MarketMakerQuote[], windowMinutes: number): Decimal;
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
export declare function calculateMarketMakingVaR(inventory: MarketMakerInventory, volatility: Decimal, confidenceLevel: Decimal, timeHorizon: number): PnL;
/**
 * Detect inventory limit breach
 * Checks if inventory exceeds risk limits
 *
 * @param inventory - Current inventory
 * @param limits - Inventory limits
 * @returns Breach status and severity
 */
export declare function detectInventoryLimitBreach(inventory: MarketMakerInventory, limits: {
    warning: Quantity;
    critical: Quantity;
}): {
    breached: boolean;
    severity: 'NONE' | 'WARNING' | 'CRITICAL';
    excessAmount: Quantity;
};
/**
 * Calculate concentration risk
 * Measures risk from concentrated positions
 *
 * @param inventories - All market making inventories
 * @param totalCapital - Total capital allocated
 * @returns Concentration score (0-100)
 */
export declare function calculateConcentrationRisk(inventories: MarketMakerInventory[], totalCapital: InventoryValue): Decimal;
/**
 * Calculate stress test scenario
 * Simulates inventory P&L under extreme market conditions
 *
 * @param inventory - Current inventory
 * @param priceShockPercent - Price shock percentage
 * @param volatilityShockMultiplier - Volatility increase multiplier
 * @returns Stressed P&L
 */
export declare function calculateStressTestScenario(inventory: MarketMakerInventory, priceShockPercent: Percentage, volatilityShockMultiplier: Decimal): {
    stressedPnL: PnL;
    stressedInventoryValue: InventoryValue;
    capitalImpact: Percentage;
};
export {};
//# sourceMappingURL=market-making-kit.d.ts.map