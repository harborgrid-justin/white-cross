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

// ============================================================================
// TYPE DEFINITIONS - BRANDED TYPES FOR TYPE SAFETY
// ============================================================================

/**
 * Branded type for prices to prevent mixing with other numeric types
 */
export type Price = number & { readonly __brand: 'Price' };

/**
 * Branded type for quantities/shares to prevent mixing with prices
 */
export type Quantity = number & { readonly __brand: 'Quantity' };

/**
 * Branded type for basis points (1/100th of a percent)
 */
export type BasisPoints = number & { readonly __brand: 'BasisPoints' };

/**
 * Branded type for timestamps in milliseconds since epoch
 */
export type Timestamp = number & { readonly __brand: 'Timestamp' };

/**
 * Helper to create Price branded type
 */
export const asPrice = (value: number): Price => value as Price;

/**
 * Helper to create Quantity branded type
 */
export const asQuantity = (value: number): Quantity => value as Quantity;

/**
 * Helper to create BasisPoints branded type
 */
export const asBasisPoints = (value: number): BasisPoints => value as BasisPoints;

/**
 * Helper to create Timestamp branded type
 */
export const asTimestamp = (value: number): Timestamp => value as Timestamp;

// ============================================================================
// DISCRIMINATED UNIONS FOR ORDERS AND VENUES
// ============================================================================

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
  type: 'MOO'; // Market-on-Open
  side: OrderSide;
  quantity: Quantity;
  symbol: string;
}

export interface MOCOrder {
  type: 'MOC'; // Market-on-Close
  side: OrderSide;
  quantity: Quantity;
  symbol: string;
}

export type Order = MarketOrder | LimitOrder | StopOrder | MOOOrder | MOCOrder;

export interface VenueExchange {
  type: 'EXCHANGE';
  exchangeCode: string; // e.g., 'NYSE', 'NASDAQ', 'ARCA'
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
  type: 'ATS'; // Alternative Trading System
  atsId: string;
  fees: BasisPoints;
}

export type Venue = VenueExchange | VenueDarkPool | VenueATS;

// ============================================================================
// MARKET DATA STRUCTURES
// ============================================================================

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

// ============================================================================
// EXECUTION ALGORITHM PARAMETERS
// ============================================================================

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
  historicalVolume: number[]; // Historical intraday volume profile
  priceLimit?: Price;
}

export interface POVParams {
  symbol: string;
  side: OrderSide;
  totalQuantity: Quantity;
  targetParticipationRate: number; // 0.0 to 1.0 (percentage of market volume)
  minParticipationRate: number;
  maxParticipationRate: number;
  priceLimit?: Price;
}

export interface ImplementationShortfallParams {
  symbol: string;
  side: OrderSide;
  totalQuantity: Quantity;
  arrivalPrice: Price;
  riskAversion: number; // Lambda parameter (0 = aggressive, high = passive)
  volatility: number; // Estimated price volatility
  duration: number; // Execution duration in milliseconds
}

export interface ArrivalPriceParams {
  symbol: string;
  side: OrderSide;
  totalQuantity: Quantity;
  arrivalPrice: Price;
  urgency: number; // 0.0 to 1.0 (0 = patient, 1 = urgent)
  currentTime: Timestamp;
}

// ============================================================================
// EXECUTION SLICE RESULTS
// ============================================================================

export interface ExecutionSlice {
  timestamp: Timestamp;
  quantity: Quantity;
  limitPrice?: Price;
  venueAllocation?: Array<{ venue: Venue; quantity: Quantity }>;
  urgency: number;
}

export interface ExecutionSchedule {
  slices: ExecutionSlice[];
  algorithm: string;
  totalQuantity: Quantity;
  estimatedDuration: number;
  estimatedCost: BasisPoints;
}

// ============================================================================
// EXECUTION ALGORITHMS - TWAP/VWAP/POV/IS
// ============================================================================

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
export function calculateTWAPSlice(params: TWAPParams): ExecutionSchedule {
  if (params.endTime <= params.startTime) {
    throw new Error('End time must be after start time');
  }
  if (params.numberOfSlices < 1) {
    throw new Error('Number of slices must be at least 1');
  }
  if (params.totalQuantity <= 0) {
    throw new Error('Total quantity must be positive');
  }

  const duration = params.endTime - params.startTime;
  const sliceInterval = duration / params.numberOfSlices;
  const sliceQuantity = asQuantity(params.totalQuantity / params.numberOfSlices);

  const slices: ExecutionSlice[] = [];
  for (let i = 0; i < params.numberOfSlices; i++) {
    slices.push({
      timestamp: asTimestamp(params.startTime + i * sliceInterval),
      quantity: sliceQuantity,
      limitPrice: params.priceLimit,
      urgency: 0.5, // Neutral urgency for TWAP
    });
  }

  return {
    slices,
    algorithm: 'TWAP',
    totalQuantity: params.totalQuantity,
    estimatedDuration: duration,
    estimatedCost: asBasisPoints(10), // Typical TWAP cost ~10bp
  };
}

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
export function calculateVWAPSlice(params: VWAPParams): ExecutionSchedule {
  if (!params.historicalVolume || params.historicalVolume.length === 0) {
    throw new Error('Historical volume data is required');
  }
  if (params.totalQuantity <= 0) {
    throw new Error('Total quantity must be positive');
  }

  const totalHistoricalVolume = params.historicalVolume.reduce((sum, vol) => sum + vol, 0);
  if (totalHistoricalVolume <= 0) {
    throw new Error('Total historical volume must be positive');
  }

  const duration = params.endTime - params.startTime;
  const numberOfSlices = params.historicalVolume.length;
  const sliceInterval = duration / numberOfSlices;

  const slices: ExecutionSlice[] = params.historicalVolume.map((volume, index) => {
    const volumeWeight = volume / totalHistoricalVolume;
    const sliceQuantity = asQuantity(params.totalQuantity * volumeWeight);

    return {
      timestamp: asTimestamp(params.startTime + index * sliceInterval),
      quantity: sliceQuantity,
      limitPrice: params.priceLimit,
      urgency: volumeWeight, // Higher urgency during high-volume periods
    };
  });

  return {
    slices,
    algorithm: 'VWAP',
    totalQuantity: params.totalQuantity,
    estimatedDuration: duration,
    estimatedCost: asBasisPoints(8), // VWAP typically lower cost than TWAP
  };
}

/**
 * Calculate Percentage of Volume (POV) execution schedule
 * Maintains target participation rate relative to market volume
 *
 * @param params - POV algorithm parameters with participation constraints
 * @returns Adaptive execution schedule based on market volume
 *
 * Note: Actual execution requires real-time volume monitoring and adjustment
 */
export function calculatePOVSlice(params: POVParams): ExecutionSchedule {
  if (params.targetParticipationRate <= 0 || params.targetParticipationRate > 1) {
    throw new Error('Target participation rate must be between 0 and 1');
  }
  if (params.minParticipationRate < 0 || params.maxParticipationRate > 1) {
    throw new Error('Participation rate bounds must be between 0 and 1');
  }
  if (params.minParticipationRate > params.maxParticipationRate) {
    throw new Error('Min participation rate cannot exceed max participation rate');
  }

  // POV requires real-time adaptation, provide initial guideline slices
  const estimatedDuration = 3600000; // Assume 1 hour execution horizon
  const numberOfSlices = 20;
  const sliceInterval = estimatedDuration / numberOfSlices;
  const sliceQuantity = asQuantity(params.totalQuantity / numberOfSlices);

  const slices: ExecutionSlice[] = [];
  for (let i = 0; i < numberOfSlices; i++) {
    slices.push({
      timestamp: asTimestamp(Date.now() + i * sliceInterval),
      quantity: sliceQuantity,
      limitPrice: params.priceLimit,
      urgency: params.targetParticipationRate,
    });
  }

  return {
    slices,
    algorithm: 'POV',
    totalQuantity: params.totalQuantity,
    estimatedDuration,
    estimatedCost: asBasisPoints(12), // POV can have higher impact due to aggressive participation
  };
}

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
export function calculateImplementationShortfall(params: ImplementationShortfallParams): ExecutionSchedule {
  if (params.totalQuantity <= 0) {
    throw new Error('Total quantity must be positive');
  }
  if (params.riskAversion < 0) {
    throw new Error('Risk aversion must be non-negative');
  }
  if (params.volatility <= 0) {
    throw new Error('Volatility must be positive');
  }
  if (params.duration <= 0) {
    throw new Error('Duration must be positive');
  }

  // Almgren-Chriss parameters
  const lambda = params.riskAversion;
  const sigma = params.volatility;
  const T = params.duration / 1000; // Convert to seconds
  const X = params.totalQuantity;

  // Simplified permanent and temporary impact coefficients
  const eta = 0.1; // Permanent impact
  const gamma = 0.01; // Temporary impact

  // Calculate kappa (trade-off between risk and impact)
  const kappa = Math.sqrt((lambda * sigma * sigma) / gamma);

  // Helper function for sinh (hyperbolic sine)
  const sinh = (x: number): number => (Math.exp(x) - Math.exp(-x)) / 2;

  // Optimal trading rate decays exponentially: n(t) = sinh(kappa * (T - t)) / sinh(kappa * T)
  const numberOfSlices = 20;
  const dt = T / numberOfSlices;

  const slices: ExecutionSlice[] = [];
  let remainingQuantity = X;

  for (let i = 0; i < numberOfSlices; i++) {
    const t = i * dt;
    const trajectoryFraction = sinh(kappa * (T - t)) / sinh(kappa * T);
    const targetRemaining = X * trajectoryFraction;
    const sliceQuantity = asQuantity(Math.max(0, remainingQuantity - asQuantity(targetRemaining)));

    if (sliceQuantity > 0) {
      slices.push({
        timestamp: asTimestamp(Date.now() + i * dt * 1000),
        quantity: sliceQuantity,
        urgency: 1 - trajectoryFraction, // Higher urgency as trajectory decays
      });
      remainingQuantity = asQuantity(remainingQuantity - sliceQuantity);
    }
  }

  // Add final slice for any remaining quantity
  if (remainingQuantity > 0) {
    slices.push({
      timestamp: asTimestamp(Date.now() + T * 1000),
      quantity: remainingQuantity,
      urgency: 1.0,
    });
  }

  // Estimate total cost (permanent impact + temporary impact + risk cost)
  const permanentImpactCost = eta * (X / (params.arrivalPrice * 10000)); // Convert to bp
  const temporaryImpactCost = gamma * (X / T) / (params.arrivalPrice * 10000);
  const riskCost = lambda * sigma * sigma * T * (X / params.arrivalPrice) / 10000;
  const estimatedCost = asBasisPoints((permanentImpactCost + temporaryImpactCost + riskCost) * 10000);

  return {
    slices,
    algorithm: 'ImplementationShortfall',
    totalQuantity: params.totalQuantity,
    estimatedDuration: params.duration,
    estimatedCost,
  };
}

/**
 * Calculate Arrival Price algorithm execution
 * Aims to minimize deviation from arrival price benchmark
 *
 * @param params - Arrival price parameters with urgency factor
 * @returns Front-loaded execution schedule for arrival price optimization
 */
export function calculateArrivalPrice(params: ArrivalPriceParams): ExecutionSchedule {
  if (params.totalQuantity <= 0) {
    throw new Error('Total quantity must be positive');
  }
  if (params.urgency < 0 || params.urgency > 1) {
    throw new Error('Urgency must be between 0 and 1');
  }

  // Arrival price algorithm front-loads execution based on urgency
  const numberOfSlices = 10;
  const slices: ExecutionSlice[] = [];
  let remainingQuantity = params.totalQuantity;

  for (let i = 0; i < numberOfSlices; i++) {
    // Exponential decay with urgency parameter
    const weight = Math.exp(-params.urgency * i);
    const totalWeight = (1 - Math.exp(-params.urgency * numberOfSlices)) / (1 - Math.exp(-params.urgency));
    const sliceQuantity = asQuantity((params.totalQuantity * weight) / totalWeight);

    if (sliceQuantity > 0 && remainingQuantity > 0) {
      const actualQuantity = asQuantity(Math.min(sliceQuantity, remainingQuantity));
      slices.push({
        timestamp: asTimestamp(params.currentTime + i * 60000), // 1-minute intervals
        quantity: actualQuantity,
        limitPrice: params.arrivalPrice,
        urgency: params.urgency,
      });
      remainingQuantity = asQuantity(remainingQuantity - actualQuantity);
    }
  }

  return {
    slices,
    algorithm: 'ArrivalPrice',
    totalQuantity: params.totalQuantity,
    estimatedDuration: numberOfSlices * 60000,
    estimatedCost: asBasisPoints(15), // Arrival price can have higher cost due to immediacy
  };
}

/**
 * Optimize dark pool routing for block trades
 * Selects dark pools based on size requirements, fees, and fill probability
 *
 * @param quantity - Order quantity to route
 * @param availablePools - Array of available dark pool venues
 * @param fillProbabilities - Estimated fill probability for each pool
 * @returns Ranked list of dark pool venues with allocation recommendations
 */
export function optimizeDarkPoolRouting(
  quantity: Quantity,
  availablePools: VenueDarkPool[],
  fillProbabilities: number[]
): Array<{ venue: VenueDarkPool; allocation: Quantity; score: number }> {
  if (availablePools.length !== fillProbabilities.length) {
    throw new Error('Fill probabilities must match number of pools');
  }
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }

  const scored = availablePools.map((pool, index) => {
    const fillProb = fillProbabilities[index];
    const feesPenalty = pool.fees / 10000; // Convert basis points to decimal
    const sizeFit = quantity >= pool.minimumSize ? 1.0 : 0.0;

    // Score = fill probability * size fit - fees penalty
    const score = fillProb * sizeFit - feesPenalty;

    return {
      venue: pool,
      allocation: asQuantity(quantity * fillProb * 0.5), // Allocate proportional to probability
      score,
    };
  });

  // Sort by score descending
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Calculate smart order routing across multiple venues
 * Optimizes venue selection based on liquidity, fees, and latency
 *
 * @param order - Order to route
 * @param venues - Available execution venues
 * @param liquidityEstimates - Estimated available liquidity at each venue
 * @returns Optimal venue allocation minimizing total execution cost
 */
export function calculateSmartOrderRoute(
  order: Order,
  venues: Venue[],
  liquidityEstimates: Quantity[]
): Array<{ venue: Venue; quantity: Quantity; estimatedCost: BasisPoints }> {
  if (venues.length !== liquidityEstimates.length) {
    throw new Error('Liquidity estimates must match number of venues');
  }

  const totalQuantity = order.quantity;
  const allocations: Array<{ venue: Venue; quantity: Quantity; estimatedCost: BasisPoints }> = [];

  // Simple greedy allocation: prioritize by fees, then liquidity
  const rankedVenues = venues.map((venue, index) => ({
    venue,
    liquidity: liquidityEstimates[index],
    fees: venue.fees,
  })).sort((a, b) => {
    // Primary sort: fees (ascending)
    if (a.fees !== b.fees) return a.fees - b.fees;
    // Secondary sort: liquidity (descending)
    return b.liquidity - a.liquidity;
  });

  let remainingQuantity = totalQuantity;

  for (const { venue, liquidity, fees } of rankedVenues) {
    if (remainingQuantity <= 0) break;

    const allocation = asQuantity(Math.min(remainingQuantity, liquidity));
    if (allocation > 0) {
      allocations.push({
        venue,
        quantity: allocation,
        estimatedCost: fees,
      });
      remainingQuantity = asQuantity(remainingQuantity - allocation);
    }
  }

  return allocations;
}

/**
 * Estimate execution schedule for general orders
 * Provides initial execution plan before algorithm-specific optimization
 *
 * @param order - Order to schedule
 * @param executionHorizon - Time horizon for execution in milliseconds
 * @returns Basic execution schedule for further refinement
 */
export function estimateExecutionSchedule(
  order: Order,
  executionHorizon: number
): ExecutionSchedule {
  if (executionHorizon <= 0) {
    throw new Error('Execution horizon must be positive');
  }

  const numberOfSlices = Math.min(10, Math.ceil(executionHorizon / 60000)); // Max 10 slices or 1 per minute
  const sliceInterval = executionHorizon / numberOfSlices;
  const sliceQuantity = asQuantity(order.quantity / numberOfSlices);

  const slices: ExecutionSlice[] = [];
  for (let i = 0; i < numberOfSlices; i++) {
    slices.push({
      timestamp: asTimestamp(Date.now() + i * sliceInterval),
      quantity: sliceQuantity,
      urgency: 0.5,
    });
  }

  return {
    slices,
    algorithm: 'BasicSchedule',
    totalQuantity: order.quantity,
    estimatedDuration: executionHorizon,
    estimatedCost: asBasisPoints(10),
  };
}

// ============================================================================
// STATISTICAL TRADING STRATEGIES
// ============================================================================

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
export function calculatePairsTradingSignal(
  symbol1: string,
  symbol2: string,
  price1: Price,
  price2: Price,
  hedgeRatio: number,
  spreadMean: number,
  spreadStd: number,
  entryThreshold: number = 2.0
): PairsTradingSignal {
  if (spreadStd <= 0) {
    throw new Error('Spread standard deviation must be positive');
  }

  const currentSpread = price1 - hedgeRatio * price2;
  const zScore = (currentSpread - spreadMean) / spreadStd;

  let signal: 'LONG_SPREAD' | 'SHORT_SPREAD' | 'NEUTRAL';
  if (zScore > entryThreshold) {
    signal = 'SHORT_SPREAD'; // Spread too high, short symbol1, long symbol2
  } else if (zScore < -entryThreshold) {
    signal = 'LONG_SPREAD'; // Spread too low, long symbol1, short symbol2
  } else {
    signal = 'NEUTRAL';
  }

  return {
    symbol1,
    symbol2,
    spreadZScore: zScore,
    signal,
    hedge_ratio: hedgeRatio,
    confidence: Math.abs(zScore) / entryThreshold,
  };
}

/**
 * Calculate cointegration metrics for pair selection
 * Uses Augmented Dickey-Fuller test statistic approximation
 *
 * @param prices1 - Historical prices for symbol1
 * @param prices2 - Historical prices for symbol2
 * @returns Cointegration statistics including hedge ratio and half-life
 */
export function calculateCointegrationMetrics(
  prices1: Price[],
  prices2: Price[]
): {
  hedgeRatio: number;
  halfLife: number;
  correlation: number;
  meanSpread: number;
  stdSpread: number;
} {
  if (prices1.length !== prices2.length || prices1.length < 20) {
    throw new Error('Price arrays must have equal length and at least 20 observations');
  }

  const n = prices1.length;

  // Calculate hedge ratio via linear regression
  const meanPrice1 = prices1.reduce((sum, p) => sum + p, 0) / n;
  const meanPrice2 = prices2.reduce((sum, p) => sum + p, 0) / n;

  let covariance = 0;
  let variance2 = 0;

  for (let i = 0; i < n; i++) {
    const dev1 = prices1[i] - meanPrice1;
    const dev2 = prices2[i] - meanPrice2;
    covariance += dev1 * dev2;
    variance2 += dev2 * dev2;
  }

  const hedgeRatio = covariance / variance2;

  // Calculate spread
  const spreads = prices1.map((p1, i) => p1 - hedgeRatio * prices2[i]);
  const meanSpread = spreads.reduce((sum, s) => sum + s, 0) / n;
  const variance = spreads.reduce((sum, s) => sum + Math.pow(s - meanSpread, 2), 0) / n;
  const stdSpread = Math.sqrt(variance);

  // Estimate half-life of mean reversion (simplified AR(1) model)
  let sumLaggedSpread = 0;
  let sumCurrentSpread = 0;
  for (let i = 1; i < n; i++) {
    sumLaggedSpread += (spreads[i] - meanSpread) * (spreads[i - 1] - meanSpread);
    sumCurrentSpread += Math.pow(spreads[i - 1] - meanSpread, 2);
  }
  const phi = sumLaggedSpread / sumCurrentSpread;
  const halfLife = -Math.log(2) / Math.log(phi);

  // Calculate correlation
  const correlation = covariance / (Math.sqrt(variance2) * stdSpread * Math.sqrt(n));

  return {
    hedgeRatio,
    halfLife: Math.max(1, halfLife), // Ensure positive half-life
    correlation,
    meanSpread,
    stdSpread,
  };
}

/**
 * Calculate mean reversion signal using z-score
 *
 * @param currentPrice - Current asset price
 * @param historicalPrices - Historical price series
 * @param lookbackPeriod - Number of periods for mean/std calculation
 * @param entryThreshold - Z-score threshold for signal generation
 * @returns Mean reversion signal (-1: sell, 0: hold, 1: buy) and z-score
 */
export function calculateMeanReversionSignal(
  currentPrice: Price,
  historicalPrices: Price[],
  lookbackPeriod: number,
  entryThreshold: number = 2.0
): { signal: -1 | 0 | 1; zScore: number; mean: Price; std: number } {
  if (historicalPrices.length < lookbackPeriod) {
    throw new Error('Insufficient historical data for lookback period');
  }

  const recentPrices = historicalPrices.slice(-lookbackPeriod);
  const mean = asPrice(recentPrices.reduce((sum, p) => sum + p, 0) / lookbackPeriod);
  const variance = recentPrices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / lookbackPeriod;
  const std = Math.sqrt(variance);

  if (std === 0) {
    return { signal: 0, zScore: 0, mean, std };
  }

  const zScore = (currentPrice - mean) / std;

  let signal: -1 | 0 | 1;
  if (zScore > entryThreshold) {
    signal = -1; // Price too high, expect reversion down
  } else if (zScore < -entryThreshold) {
    signal = 1; // Price too low, expect reversion up
  } else {
    signal = 0;
  }

  return { signal, zScore, mean, std };
}

/**
 * Calculate z-score for price normalization
 *
 * @param value - Current value to normalize
 * @param mean - Historical mean
 * @param std - Historical standard deviation
 * @returns Standardized z-score
 */
export function calculateZScore(value: number, mean: number, std: number): number {
  if (std <= 0) {
    throw new Error('Standard deviation must be positive');
  }
  return (value - mean) / std;
}

/**
 * Calculate Ornstein-Uhlenbeck process parameters for mean reversion modeling
 * Estimates mean reversion speed (theta) and long-term mean (mu)
 *
 * @param prices - Historical price series
 * @returns OU process parameters (theta: mean reversion speed, mu: long-term mean, sigma: volatility)
 *
 * dX = theta * (mu - X) * dt + sigma * dW
 */
export function calculateOrnsteinUhlenbeck(
  prices: Price[]
): { theta: number; mu: Price; sigma: number } {
  if (prices.length < 10) {
    throw new Error('At least 10 price observations required');
  }

  const n = prices.length;
  const mu = asPrice(prices.reduce((sum, p) => sum + p, 0) / n);

  // Estimate theta using discrete approximation
  let sumProduct = 0;
  let sumSquared = 0;

  for (let i = 1; i < n; i++) {
    const dX = prices[i] - prices[i - 1];
    const X_minus_mu = prices[i - 1] - mu;
    sumProduct += dX * X_minus_mu;
    sumSquared += X_minus_mu * X_minus_mu;
  }

  const theta = -sumProduct / sumSquared;

  // Estimate sigma (volatility of residuals)
  let sumResidualSquared = 0;
  for (let i = 1; i < n; i++) {
    const dX = prices[i] - prices[i - 1];
    const expectedDX = theta * (mu - prices[i - 1]);
    const residual = dX - expectedDX;
    sumResidualSquared += residual * residual;
  }
  const sigma = Math.sqrt(sumResidualSquared / (n - 1));

  return {
    theta: Math.max(0, theta), // Ensure non-negative mean reversion speed
    mu,
    sigma,
  };
}

/**
 * Calculate momentum signal using rate of change
 *
 * @param prices - Historical price series
 * @param momentumPeriod - Lookback period for momentum calculation
 * @returns Momentum signal (-1: negative, 0: neutral, 1: positive) and momentum value
 */
export function calculateMomentumSignal(
  prices: Price[],
  momentumPeriod: number
): { signal: -1 | 0 | 1; momentum: number; rateOfChange: number } {
  if (prices.length < momentumPeriod + 1) {
    throw new Error('Insufficient price data for momentum period');
  }

  const currentPrice = prices[prices.length - 1];
  const pastPrice = prices[prices.length - 1 - momentumPeriod];

  if (pastPrice === 0) {
    throw new Error('Past price cannot be zero');
  }

  const rateOfChange = (currentPrice - pastPrice) / pastPrice;
  const momentum = currentPrice - pastPrice;

  const threshold = 0.02; // 2% threshold for signal
  let signal: -1 | 0 | 1;
  if (rateOfChange > threshold) {
    signal = 1; // Strong positive momentum
  } else if (rateOfChange < -threshold) {
    signal = -1; // Strong negative momentum
  } else {
    signal = 0;
  }

  return { signal, momentum, rateOfChange };
}

/**
 * Calculate moving average crossover signal
 * Classic technical analysis indicator
 *
 * @param prices - Historical price series
 * @param shortPeriod - Short moving average period
 * @param longPeriod - Long moving average period
 * @returns Crossover signal (1: bullish, -1: bearish, 0: neutral)
 */
export function calculateMovingAverageCrossover(
  prices: Price[],
  shortPeriod: number,
  longPeriod: number
): { signal: -1 | 0 | 1; shortMA: Price; longMA: Price } {
  if (prices.length < longPeriod) {
    throw new Error('Insufficient price data for long period MA');
  }
  if (shortPeriod >= longPeriod) {
    throw new Error('Short period must be less than long period');
  }

  const recentPrices = prices.slice(-longPeriod);

  const shortMA = asPrice(
    recentPrices.slice(-shortPeriod).reduce((sum, p) => sum + p, 0) / shortPeriod
  );

  const longMA = asPrice(recentPrices.reduce((sum, p) => sum + p, 0) / longPeriod);

  const previousShortMA = asPrice(
    prices.slice(-longPeriod - 1, -1).slice(-shortPeriod).reduce((sum, p) => sum + p, 0) / shortPeriod
  );

  const previousLongMA = asPrice(
    prices.slice(-longPeriod - 1, -1).reduce((sum, p) => sum + p, 0) / longPeriod
  );

  let signal: -1 | 0 | 1 = 0;

  // Bullish crossover: short MA crosses above long MA
  if (previousShortMA <= previousLongMA && shortMA > longMA) {
    signal = 1;
  }
  // Bearish crossover: short MA crosses below long MA
  else if (previousShortMA >= previousLongMA && shortMA < longMA) {
    signal = -1;
  }

  return { signal, shortMA, longMA };
}

/**
 * Calculate Relative Strength Index (RSI)
 * Momentum oscillator measuring speed and change of price movements
 *
 * @param prices - Historical price series
 * @param period - RSI calculation period (typically 14)
 * @returns RSI value (0-100) and overbought/oversold signal
 */
export function calculateRSI(
  prices: Price[],
  period: number = 14
): { rsi: number; signal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL' } {
  if (prices.length < period + 1) {
    throw new Error('Insufficient price data for RSI calculation');
  }

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) {
    return { rsi: 100, signal: 'OVERBOUGHT' };
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  let signal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
  if (rsi > 70) {
    signal = 'OVERBOUGHT';
  } else if (rsi < 30) {
    signal = 'OVERSOLD';
  } else {
    signal = 'NEUTRAL';
  }

  return { rsi, signal };
}

/**
 * Calculate Bollinger Bands
 * Volatility bands placed above and below moving average
 *
 * @param prices - Historical price series
 * @param period - Moving average period (typically 20)
 * @param stdDevMultiplier - Standard deviation multiplier (typically 2)
 * @returns Bollinger Bands (upper, middle, lower) and current position
 */
export function calculateBollingerBands(
  prices: Price[],
  period: number = 20,
  stdDevMultiplier: number = 2
): {
  upper: Price;
  middle: Price;
  lower: Price;
  percentB: number;
  bandwidth: number;
} {
  if (prices.length < period) {
    throw new Error('Insufficient price data for Bollinger Bands');
  }

  const recentPrices = prices.slice(-period);
  const middle = asPrice(recentPrices.reduce((sum, p) => sum + p, 0) / period);

  const variance = recentPrices.reduce((sum, p) => sum + Math.pow(p - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = asPrice(middle + stdDevMultiplier * stdDev);
  const lower = asPrice(middle - stdDevMultiplier * stdDev);

  const currentPrice = prices[prices.length - 1];
  const percentB = (upper - lower) !== 0 ? (currentPrice - lower) / (upper - lower) : 0.5;
  const bandwidth = ((upper - lower) / middle) * 100;

  return { upper, middle, lower, percentB, bandwidth };
}

/**
 * Calculate Average True Range (ATR)
 * Measure of market volatility
 *
 * @param bars - Historical OHLC bars
 * @param period - ATR period (typically 14)
 * @returns ATR value and current volatility assessment
 */
export function calculateATR(
  bars: Bar[],
  period: number = 14
): { atr: number; volatility: 'HIGH' | 'MEDIUM' | 'LOW' } {
  if (bars.length < period + 1) {
    throw new Error('Insufficient bar data for ATR calculation');
  }

  const trueRanges: number[] = [];

  for (let i = bars.length - period; i < bars.length; i++) {
    const high = bars[i].high;
    const low = bars[i].low;
    const prevClose = i > 0 ? bars[i - 1].close : bars[i].open;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    trueRanges.push(tr);
  }

  const atr = trueRanges.reduce((sum, tr) => sum + tr, 0) / period;

  // Classify volatility based on ATR as percentage of price
  const currentPrice = bars[bars.length - 1].close;
  const atrPercent = (atr / currentPrice) * 100;

  let volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  if (atrPercent > 3) {
    volatility = 'HIGH';
  } else if (atrPercent > 1) {
    volatility = 'MEDIUM';
  } else {
    volatility = 'LOW';
  }

  return { atr, volatility };
}

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
export function calculateMACD(
  prices: Price[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): {
  macd: number;
  signal: number;
  histogram: number;
  crossover: 'BULLISH' | 'BEARISH' | 'NONE';
} {
  if (prices.length < slowPeriod + signalPeriod) {
    throw new Error('Insufficient price data for MACD calculation');
  }

  // Calculate EMAs
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  const macdLine = fastEMA - slowEMA;

  // Calculate signal line (EMA of MACD)
  const macdHistory: number[] = [];
  for (let i = slowPeriod; i <= prices.length; i++) {
    const fastEMA_i = calculateEMA(prices.slice(0, i), fastPeriod);
    const slowEMA_i = calculateEMA(prices.slice(0, i), slowPeriod);
    macdHistory.push(fastEMA_i - slowEMA_i);
  }

  const signalLine = calculateEMA(macdHistory.map(m => asPrice(m)), signalPeriod);
  const histogram = macdLine - signalLine;

  // Detect crossover
  const prevMACD = macdHistory[macdHistory.length - 2];
  const prevSignal =
    macdHistory.length > signalPeriod
      ? calculateEMA(macdHistory.slice(0, -1).map(m => asPrice(m)), signalPeriod)
      : signalLine;

  let crossover: 'BULLISH' | 'BEARISH' | 'NONE' = 'NONE';
  if (prevMACD <= prevSignal && macdLine > signalLine) {
    crossover = 'BULLISH';
  } else if (prevMACD >= prevSignal && macdLine < signalLine) {
    crossover = 'BEARISH';
  }

  return { macd: macdLine, signal: signalLine, histogram, crossover };
}

/**
 * Helper: Calculate Exponential Moving Average (EMA)
 */
function calculateEMA(prices: Price[], period: number): number {
  if (prices.length < period) {
    throw new Error('Insufficient data for EMA');
  }

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((sum, p) => sum + p, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

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
export function calculateStochasticOscillator(
  bars: Bar[],
  period: number = 14,
  smoothK: number = 3,
  smoothD: number = 3
): {
  percentK: number;
  percentD: number;
  signal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
} {
  if (bars.length < period + smoothK + smoothD) {
    throw new Error('Insufficient bar data for Stochastic calculation');
  }

  // Calculate raw %K values
  const rawK: number[] = [];
  for (let i = period - 1; i < bars.length; i++) {
    const recentBars = bars.slice(i - period + 1, i + 1);
    const high = Math.max(...recentBars.map(b => b.high));
    const low = Math.min(...recentBars.map(b => b.low));
    const close = bars[i].close;

    const k = (high - low) !== 0 ? ((close - low) / (high - low)) * 100 : 50;
    rawK.push(k);
  }

  // Smooth %K
  const smoothedK = rawK.slice(-smoothK).reduce((sum, k) => sum + k, 0) / smoothK;

  // Calculate %D (moving average of %K)
  const recentK = rawK.slice(-smoothD);
  const percentD = recentK.reduce((sum, k) => sum + k, 0) / smoothD;

  let signal: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
  if (smoothedK > 80 && percentD > 80) {
    signal = 'OVERBOUGHT';
  } else if (smoothedK < 20 && percentD < 20) {
    signal = 'OVERSOLD';
  } else {
    signal = 'NEUTRAL';
  }

  return { percentK: smoothedK, percentD, signal };
}

// ============================================================================
// MARKET MAKING AND LIQUIDITY
// ============================================================================

export interface MarketMakingQuotes {
  bidPrice: Price;
  bidSize: Quantity;
  askPrice: Price;
  askSize: Quantity;
  spread: BasisPoints;
  skew: number; // Inventory skew adjustment
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
export function calculateMarketMakingQuotes(
  midPrice: Price,
  inventoryPosition: Quantity,
  targetSpread: BasisPoints,
  inventoryLimit: Quantity,
  quoteSize: Quantity
): MarketMakingQuotes {
  if (midPrice <= 0) {
    throw new Error('Mid price must be positive');
  }
  if (targetSpread <= 0) {
    throw new Error('Target spread must be positive');
  }
  if (inventoryLimit <= 0) {
    throw new Error('Inventory limit must be positive');
  }

  // Calculate inventory skew (shift quotes based on inventory position)
  const inventoryRatio = inventoryPosition / inventoryLimit;
  const skew = inventoryRatio * 0.5; // Skew up to 50% of spread

  const spreadInPrice = (midPrice * targetSpread) / 10000;
  const halfSpread = spreadInPrice / 2;

  // Adjust quotes for inventory: if long, widen ask and tighten bid
  const bidPrice = asPrice(midPrice - halfSpread * (1 + skew));
  const askPrice = asPrice(midPrice + halfSpread * (1 - skew));

  return {
    bidPrice,
    bidSize: quoteSize,
    askPrice,
    askSize: quoteSize,
    spread: targetSpread,
    skew,
  };
}

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
export function calculateInventoryRisk(
  inventoryPosition: Quantity,
  volatility: number,
  timeHorizon: number,
  confidence: number = 0.95
): { valueAtRisk: number; riskScore: number } {
  if (volatility < 0) {
    throw new Error('Volatility must be non-negative');
  }
  if (timeHorizon <= 0) {
    throw new Error('Time horizon must be positive');
  }
  if (confidence <= 0 || confidence >= 1) {
    throw new Error('Confidence must be between 0 and 1');
  }

  // Convert annual volatility to time horizon volatility
  const periodVolatility = volatility * Math.sqrt(timeHorizon / 252);

  // Calculate VaR using normal distribution approximation
  // z-score for 95% confidence ≈ 1.645, for 99% ≈ 2.326
  const zScore = confidence === 0.95 ? 1.645 : 2.326;
  const valueAtRisk = Math.abs(inventoryPosition) * periodVolatility * zScore;

  // Risk score: normalized by position size and volatility
  const riskScore = Math.abs(inventoryPosition) * volatility;

  return { valueAtRisk, riskScore };
}

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
export function optimizeQuoteSpread(
  orderFlow: number,
  volatility: number,
  competitionSpread: BasisPoints,
  minSpread: BasisPoints
): BasisPoints {
  if (orderFlow < -1 || orderFlow > 1) {
    throw new Error('Order flow must be between -1 and 1');
  }
  if (volatility < 0) {
    throw new Error('Volatility must be non-negative');
  }

  // Widen spread during high volatility or adverse flow
  const volatilityAdjustment = volatility * 100; // Scale volatility to bp
  const flowAdjustment = Math.abs(orderFlow) * 5; // Up to 5bp adjustment

  const optimalSpread = Math.max(
    minSpread,
    competitionSpread * 0.9 + volatilityAdjustment + flowAdjustment
  );

  return asBasisPoints(optimalSpread);
}

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
export function calculateLiquidityScore(
  depth: Quantity,
  spread: BasisPoints,
  fillRate: number,
  recentVolume: Quantity
): number {
  if (fillRate < 0 || fillRate > 1) {
    throw new Error('Fill rate must be between 0 and 1');
  }

  // Normalize components
  const depthScore = Math.min(100, (depth / 10000) * 100); // Assume 10k shares = max score
  const spreadScore = Math.max(0, 100 - spread); // Tighter spread = higher score
  const fillScore = fillRate * 100;
  const volumeScore = Math.min(100, (recentVolume / 100000) * 100); // 100k volume = max

  // Weighted average
  const liquidityScore =
    depthScore * 0.3 + spreadScore * 0.3 + fillScore * 0.2 + volumeScore * 0.2;

  return Math.min(100, Math.max(0, liquidityScore));
}

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
export function estimateAdverseSelection(
  orderImbalance: number,
  priceVolatility: number,
  orderSize: Quantity,
  averageOrderSize: Quantity
): number {
  if (orderImbalance < -1 || orderImbalance > 1) {
    throw new Error('Order imbalance must be between -1 and 1');
  }

  // High imbalance + high volatility + large order = higher adverse selection risk
  const imbalanceRisk = Math.abs(orderImbalance) * 0.4;
  const volatilityRisk = Math.min(1, priceVolatility * 10) * 0.3;
  const sizeRisk = averageOrderSize > 0 ? Math.min(1, orderSize / averageOrderSize / 5) * 0.3 : 0;

  return Math.min(1, imbalanceRisk + volatilityRisk + sizeRisk);
}

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
export function calculateQuotingProbability(
  inventoryPosition: Quantity,
  inventoryLimit: Quantity,
  marketVolatility: number,
  profitability: number
): { bidProbability: number; askProbability: number } {
  if (profitability < 0 || profitability > 1) {
    throw new Error('Profitability must be between 0 and 1');
  }

  const inventoryRatio = inventoryPosition / inventoryLimit;

  // Reduce bidding if long, reduce asking if short
  const bidProbability = Math.max(
    0,
    Math.min(1, profitability * (1 - inventoryRatio) * (1 - marketVolatility * 0.5))
  );

  const askProbability = Math.max(
    0,
    Math.min(1, profitability * (1 + inventoryRatio) * (1 - marketVolatility * 0.5))
  );

  return { bidProbability, askProbability };
}

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
export function optimizeOrderSize(
  maxPosition: Quantity,
  currentPosition: Quantity,
  riskLimit: number,
  volatility: number
): Quantity {
  if (riskLimit <= 0) {
    throw new Error('Risk limit must be positive');
  }

  const availableCapacity = maxPosition - Math.abs(currentPosition);
  const volatilityAdjustedSize = riskLimit / volatility;

  const optimalSize = Math.min(availableCapacity, volatilityAdjustedSize);

  return asQuantity(Math.max(0, optimalSize));
}

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
export function calculateReservePrice(
  midPrice: Price,
  side: OrderSide,
  estimatedImpact: BasisPoints,
  urgency: number
): Price {
  if (urgency < 0 || urgency > 1) {
    throw new Error('Urgency must be between 0 and 1');
  }

  const impactInPrice = (midPrice * estimatedImpact) / 10000;
  const urgencyAdjustment = impactInPrice * urgency;

  if (side === 'BUY') {
    return asPrice(midPrice + urgencyAdjustment);
  } else {
    return asPrice(midPrice - urgencyAdjustment);
  }
}

// ============================================================================
// ADVANCED EXECUTION STRATEGIES
// ============================================================================

/**
 * Calculate iceberg order slicing strategy
 * Hides order size by displaying only small visible portion
 *
 * @param totalQuantity - Total order quantity
 * @param visibleRatio - Ratio of visible quantity (0-1)
 * @param numberOfRefills - Number of refill cycles
 * @returns Iceberg order schedule with visible/hidden quantities
 */
export function calculateIcebergOrder(
  totalQuantity: Quantity,
  visibleRatio: number,
  numberOfRefills: number
): Array<{ visible: Quantity; hidden: Quantity }> {
  if (visibleRatio <= 0 || visibleRatio > 1) {
    throw new Error('Visible ratio must be between 0 and 1');
  }
  if (numberOfRefills < 1) {
    throw new Error('Number of refills must be at least 1');
  }

  const visiblePerSlice = asQuantity((totalQuantity * visibleRatio) / numberOfRefills);
  const totalVisible = visiblePerSlice * numberOfRefills;
  const totalHidden = asQuantity(totalQuantity - totalVisible);

  const slices: Array<{ visible: Quantity; hidden: Quantity }> = [];
  for (let i = 0; i < numberOfRefills; i++) {
    slices.push({
      visible: visiblePerSlice,
      hidden: asQuantity(totalHidden / numberOfRefills),
    });
  }

  return slices;
}

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
export function optimizeChildOrderTiming(
  parentQuantity: Quantity,
  marketVolatility: number,
  timeRemaining: number,
  completionRatio: number
): { delayMs: number; recommendedSize: Quantity } {
  if (completionRatio < 0 || completionRatio > 1) {
    throw new Error('Completion ratio must be between 0 and 1');
  }
  if (timeRemaining < 0) {
    throw new Error('Time remaining must be non-negative');
  }

  const remainingQuantity = asQuantity(parentQuantity * (1 - completionRatio));

  // Higher volatility = wait longer between orders
  const baseDelay = 30000; // 30 seconds
  const volatilityMultiplier = 1 + marketVolatility;
  const delayMs = baseDelay * volatilityMultiplier;

  // Size inversely proportional to remaining time (urgency increases)
  const urgencyFactor = timeRemaining > 0 ? 1 / (timeRemaining / 60000) : 1;
  const recommendedSize = asQuantity(Math.min(remainingQuantity, parentQuantity * 0.1 * urgencyFactor));

  return { delayMs: Math.min(300000, delayMs), recommendedSize }; // Max 5min delay
}

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
export function calculateParticipationRate(
  remainingQuantity: Quantity,
  recentMarketVolume: Quantity,
  timeRemaining: number,
  urgency: number
): number {
  if (urgency < 0 || urgency > 1) {
    throw new Error('Urgency must be between 0 and 1');
  }

  if (recentMarketVolume === 0 || timeRemaining === 0) {
    return 0.1; // Default conservative rate
  }

  // Required participation rate to complete on time
  const requiredRate = (remainingQuantity / recentMarketVolume) * (60000 / timeRemaining);

  // Adjust by urgency
  const targetRate = requiredRate * (0.5 + urgency * 0.5);

  // Cap at reasonable limits (5-40%)
  return Math.min(0.4, Math.max(0.05, targetRate));
}

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
export function estimateFillProbability(
  limitPrice: Price,
  side: OrderSide,
  currentBid: Price,
  currentAsk: Price,
  volatility: number
): number {
  const midPrice = (currentBid + currentAsk) / 2;
  const spread = currentAsk - currentBid;

  let distance: number;
  if (side === 'BUY') {
    distance = currentAsk - limitPrice;
  } else {
    distance = limitPrice - currentBid;
  }

  // Probability decreases with distance from market and increases with volatility
  const normalizedDistance = distance / (spread + volatility * midPrice);

  // Sigmoid function for probability
  const fillProbability = 1 / (1 + Math.exp(normalizedDistance * 5));

  return Math.min(1, Math.max(0, fillProbability));
}

/**
 * Calculate urgency premium for execution
 * Additional cost for faster execution
 *
 * @param normalCost - Normal execution cost in basis points
 * @param urgency - Urgency level (0-1)
 * @param volatility - Market volatility
 * @returns Total cost including urgency premium
 */
export function calculateUrgencyPremium(
  normalCost: BasisPoints,
  urgency: number,
  volatility: number
): BasisPoints {
  if (urgency < 0 || urgency > 1) {
    throw new Error('Urgency must be between 0 and 1');
  }

  // Premium increases quadratically with urgency
  const urgencyPremium = normalCost * urgency * urgency * 2;

  // Additional volatility cost
  const volatilityCost = volatility * 100 * urgency;

  return asBasisPoints(normalCost + urgencyPremium + volatilityCost);
}

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
export function optimizeVenueAllocation(
  totalQuantity: Quantity,
  venues: Venue[],
  liquidityEstimates: Quantity[],
  costEstimates: BasisPoints[]
): Array<{ venue: Venue; quantity: Quantity; cost: BasisPoints }> {
  if (venues.length !== liquidityEstimates.length || venues.length !== costEstimates.length) {
    throw new Error('Venues, liquidity, and cost arrays must have equal length');
  }

  // Sort venues by cost (ascending)
  const sorted = venues
    .map((venue, i) => ({
      venue,
      liquidity: liquidityEstimates[i],
      cost: costEstimates[i],
    }))
    .sort((a, b) => a.cost - b.cost);

  const allocations: Array<{ venue: Venue; quantity: Quantity; cost: BasisPoints }> = [];
  let remaining = totalQuantity;

  // Greedy allocation: fill cheapest venues first
  for (const { venue, liquidity, cost } of sorted) {
    if (remaining <= 0) break;

    const allocation = asQuantity(Math.min(remaining, liquidity));
    if (allocation > 0) {
      allocations.push({ venue, quantity: allocation, cost });
      remaining = asQuantity(remaining - allocation);
    }
  }

  return allocations;
}

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
export function calculatePostOnlyStrategy(
  side: OrderSide,
  quantity: Quantity,
  currentBid: Price,
  currentAsk: Price,
  tickSize: number
): { limitPrice: Price; strategy: 'JOIN' | 'IMPROVE' } {
  if (tickSize <= 0) {
    throw new Error('Tick size must be positive');
  }

  let limitPrice: Price;
  let strategy: 'JOIN' | 'IMPROVE';

  if (side === 'BUY') {
    // For buy, can join bid or improve it
    const improveBid = asPrice(currentBid + tickSize);
    if (improveBid < currentAsk) {
      limitPrice = improveBid;
      strategy = 'IMPROVE';
    } else {
      limitPrice = currentBid;
      strategy = 'JOIN';
    }
  } else {
    // For sell, can join ask or improve it
    const improveAsk = asPrice(currentAsk - tickSize);
    if (improveAsk > currentBid) {
      limitPrice = improveAsk;
      strategy = 'IMPROVE';
    } else {
      limitPrice = currentAsk;
      strategy = 'JOIN';
    }
  }

  return { limitPrice, strategy };
}

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
export function estimateQueuePosition(
  orderSize: Quantity,
  levelSize: Quantity,
  levelOrderCount: number,
  arrivalTime: Timestamp,
  levelFormationTime: Timestamp
): { queuePosition: number; estimatedFillTime: number } {
  // Time priority: later arrival = worse position
  const timeSinceFormation = arrivalTime - levelFormationTime;
  const assumedFIFO = true; // Most exchanges use price-time priority

  let queuePosition: number;
  if (assumedFIFO) {
    // Assume uniform distribution of arrival times
    queuePosition = (timeSinceFormation / 1000) * levelOrderCount;
  } else {
    // Pro-rata allocation (size-based)
    queuePosition = (orderSize / levelSize) * levelOrderCount;
  }

  // Estimate fill time based on position and typical execution rate
  const avgFillRate = 100; // shares per second (example)
  const estimatedFillTime = (queuePosition * levelSize) / (avgFillRate * levelOrderCount);

  return {
    queuePosition: Math.max(1, Math.min(levelOrderCount, queuePosition)),
    estimatedFillTime: estimatedFillTime * 1000, // Convert to ms
  };
}

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
export function calculatePeggedOrder(
  referencePrice: Price,
  side: OrderSide,
  offset: BasisPoints,
  tickSize: number
): Price {
  const offsetInPrice = (referencePrice * offset) / 10000;

  let peggedPrice: number;
  if (side === 'BUY') {
    peggedPrice = referencePrice - offsetInPrice;
  } else {
    peggedPrice = referencePrice + offsetInPrice;
  }

  // Round to tick size
  const roundedPrice = Math.round(peggedPrice / tickSize) * tickSize;

  return asPrice(roundedPrice);
}

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
export function optimizeExecutionHorizon(
  orderSize: Quantity,
  averageDailyVolume: Quantity,
  urgency: number,
  volatility: number
): number {
  if (urgency < 0 || urgency > 1) {
    throw new Error('Urgency must be between 0 and 1');
  }

  // Size as fraction of ADV
  const advRatio = orderSize / averageDailyVolume;

  // Base horizon: larger orders relative to ADV need more time
  const baseHorizonMinutes = advRatio * 390; // 390 = trading day in minutes

  // Adjust for urgency (high urgency = shorter horizon)
  const urgencyFactor = 1 - urgency * 0.7;

  // Adjust for volatility (high volatility = shorter horizon to reduce risk)
  const volatilityFactor = 1 - Math.min(0.5, volatility * 10);

  const optimalMinutes = baseHorizonMinutes * urgencyFactor * volatilityFactor;

  // Convert to milliseconds and bound between 1 minute and 6 hours
  return Math.min(21600000, Math.max(60000, optimalMinutes * 60000));
}

// ============================================================================
// RISK MANAGEMENT AND PORTFOLIO
// ============================================================================

/**
 * Calculate Value at Risk (VaR) using historical method
 *
 * @param returns - Historical returns series
 * @param confidence - Confidence level (e.g., 0.95 for 95%)
 * @returns VaR estimate at specified confidence level
 */
export function calculateVaR(returns: number[], confidence: number = 0.95): number {
  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }
  if (confidence <= 0 || confidence >= 1) {
    throw new Error('Confidence must be between 0 and 1');
  }

  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);

  return -sorted[index]; // VaR is positive loss
}

/**
 * Calculate Expected Shortfall (Conditional VaR)
 * Average loss beyond VaR threshold
 *
 * @param returns - Historical returns series
 * @param confidence - Confidence level (e.g., 0.95)
 * @returns Expected Shortfall (CVaR)
 */
export function calculateExpectedShortfall(returns: number[], confidence: number = 0.95): number {
  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }

  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);

  const tailReturns = sorted.slice(0, index);
  const avgTailReturn = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;

  return -avgTailReturn;
}

/**
 * Calculate portfolio beta relative to benchmark
 *
 * @param portfolioReturns - Portfolio returns series
 * @param benchmarkReturns - Benchmark returns series
 * @returns Portfolio beta
 */
export function calculatePortfolioBeta(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): number {
  if (portfolioReturns.length !== benchmarkReturns.length) {
    throw new Error('Return series must have equal length');
  }

  const n = portfolioReturns.length;
  const meanPortfolio = portfolioReturns.reduce((sum, r) => sum + r, 0) / n;
  const meanBenchmark = benchmarkReturns.reduce((sum, r) => sum + r, 0) / n;

  let covariance = 0;
  let benchmarkVariance = 0;

  for (let i = 0; i < n; i++) {
    covariance += (portfolioReturns[i] - meanPortfolio) * (benchmarkReturns[i] - meanBenchmark);
    benchmarkVariance += Math.pow(benchmarkReturns[i] - meanBenchmark, 2);
  }

  if (benchmarkVariance === 0) {
    throw new Error('Benchmark variance cannot be zero');
  }

  return covariance / benchmarkVariance;
}

/**
 * Calculate correlation matrix for asset returns
 *
 * @param returnsMatrix - Array of return series for each asset
 * @returns Correlation matrix
 */
export function calculateCorrelationMatrix(returnsMatrix: number[][]): number[][] {
  if (returnsMatrix.length === 0) {
    throw new Error('Returns matrix cannot be empty');
  }

  const n = returnsMatrix.length;
  const correlationMatrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      correlationMatrix[i][j] = 0;
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        correlationMatrix[i][j] = 1.0;
      } else {
        correlationMatrix[i][j] = calculateCorrelation(returnsMatrix[i], returnsMatrix[j]);
      }
    }
  }

  return correlationMatrix;
}

/**
 * Helper: Calculate correlation between two return series
 */
function calculateCorrelation(returns1: number[], returns2: number[]): number {
  if (returns1.length !== returns2.length) {
    throw new Error('Return series must have equal length');
  }

  const n = returns1.length;
  const mean1 = returns1.reduce((sum, r) => sum + r, 0) / n;
  const mean2 = returns2.reduce((sum, r) => sum + r, 0) / n;

  let covariance = 0;
  let variance1 = 0;
  let variance2 = 0;

  for (let i = 0; i < n; i++) {
    const dev1 = returns1[i] - mean1;
    const dev2 = returns2[i] - mean2;
    covariance += dev1 * dev2;
    variance1 += dev1 * dev1;
    variance2 += dev2 * dev2;
  }

  const std1 = Math.sqrt(variance1 / n);
  const std2 = Math.sqrt(variance2 / n);

  if (std1 === 0 || std2 === 0) {
    return 0;
  }

  return covariance / (n * std1 * std2);
}

/**
 * Estimate volatility using EWMA (Exponentially Weighted Moving Average)
 *
 * @param returns - Historical returns series
 * @param lambda - Decay factor (typically 0.94 for daily data)
 * @returns Current volatility estimate
 */
export function estimateVolatility(returns: number[], lambda: number = 0.94): number {
  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }
  if (lambda <= 0 || lambda >= 1) {
    throw new Error('Lambda must be between 0 and 1');
  }

  let variance = returns[0] * returns[0]; // Initialize with first squared return

  for (let i = 1; i < returns.length; i++) {
    variance = lambda * variance + (1 - lambda) * returns[i] * returns[i];
  }

  return Math.sqrt(variance);
}

/**
 * Calculate Sharpe Ratio
 * Risk-adjusted return metric
 *
 * @param returns - Portfolio returns series
 * @param riskFreeRate - Risk-free rate (annualized)
 * @returns Sharpe ratio
 */
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }

  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) {
    return 0;
  }

  // Annualize assuming daily returns
  const annualizedReturn = meanReturn * 252;
  const annualizedStdDev = stdDev * Math.sqrt(252);

  return (annualizedReturn - riskFreeRate) / annualizedStdDev;
}

/**
 * Calculate Maximum Drawdown
 * Largest peak-to-trough decline
 *
 * @param cumulativeReturns - Cumulative returns series
 * @returns Maximum drawdown (as positive percentage)
 */
export function calculateMaxDrawdown(cumulativeReturns: number[]): number {
  if (cumulativeReturns.length === 0) {
    throw new Error('Cumulative returns array cannot be empty');
  }

  let maxDrawdown = 0;
  let peak = cumulativeReturns[0];

  for (const value of cumulativeReturns) {
    if (value > peak) {
      peak = value;
    }

    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}
