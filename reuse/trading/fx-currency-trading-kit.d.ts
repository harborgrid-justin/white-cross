/**
 * LOC: FXTRDK001
 * File: /reuse/trading/fx-currency-trading-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - FX trading services
 *   - Risk management systems
 *   - Trading execution platforms
 *   - Market analytics dashboards
 */
/**
 * File: /reuse/trading/fx-currency-trading-kit.ts
 * Locator: WC-TRAD-FXCURR-001
 * Purpose: Bloomberg Terminal-quality FX Currency Trading Analytics - spot pricing, forwards, options, volatility, hedging, carry trade analysis
 *
 * Upstream: Independent utility module for professional FX trading and analytics
 * Downstream: ../backend/*, Trading platforms, risk systems, execution engines, market data services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 56 utility functions for FX spot pricing, forward pricing, cross-currency calculations, FX swaps, options pricing with Greeks,
 * volatility surface analytics, currency correlation, hedging strategies, basket analytics, carry trade analysis, real-time rate aggregation
 *
 * LLM Context: Comprehensive Bloomberg Terminal-quality FX trading utilities for implementing production-ready currency trading,
 * derivatives pricing, risk management, and market analytics. Provides professional trader-grade accuracy for FX spot markets,
 * forward/swap pricing, vanilla and exotic options with full Greeks, volatility surface construction and interpolation,
 * correlation analysis, optimal hedging, currency baskets, carry trade analytics, and multi-source rate aggregation for best execution.
 */
/** Currency code following ISO 4217 standard */
export type CurrencyCode = string & {
    readonly __brand: 'CurrencyCode';
};
/** Currency pair representation (e.g., 'EUR/USD', 'USD/JPY') */
export interface CurrencyPair {
    base: CurrencyCode;
    quote: CurrencyCode;
    /** Market convention (e.g., 'EURUSD', 'EUR/USD') */
    symbol: string;
    /** Decimal precision for pricing */
    precision: number;
    /** Pip size (typically 0.0001 for major pairs, 0.01 for JPY pairs) */
    pipSize: number;
}
/** FX spot quote with bid/ask spread */
export interface FXSpotQuote {
    pair: CurrencyPair;
    bid: number;
    ask: number;
    mid: number;
    spread: number;
    timestamp: Date;
    source: string;
    /** Liquidity depth in base currency */
    liquidityDepth?: number;
}
/** FX forward quote */
export interface FXForwardQuote {
    pair: CurrencyPair;
    spotRate: number;
    forwardPoints: number;
    outrightForward: number;
    /** Tenor in days */
    tenor: number;
    /** Settlement date */
    settlementDate: Date;
    /** Base currency interest rate (annualized) */
    baseRate: number;
    /** Quote currency interest rate (annualized) */
    quoteRate: number;
    timestamp: Date;
}
/** FX swap quote with near and far legs */
export interface FXSwapQuote {
    pair: CurrencyPair;
    nearLegRate: number;
    farLegRate: number;
    swapPoints: number;
    nearTenor: number;
    farTenor: number;
    nearDate: Date;
    farDate: Date;
    timestamp: Date;
}
/** FX option specification */
export interface FXOption {
    pair: CurrencyPair;
    /** Option type */
    type: 'call' | 'put';
    /** Strike price */
    strike: number;
    /** Spot price */
    spot: number;
    /** Time to expiry in years */
    timeToExpiry: number;
    /** Implied volatility (annualized) */
    volatility: number;
    /** Domestic interest rate (annualized) */
    domesticRate: number;
    /** Foreign interest rate (annualized) */
    foreignRate: number;
    /** Option style */
    style: 'european' | 'american';
}
/** FX option Greeks */
export interface FXOptionGreeks {
    delta: number;
    gamma: number;
    vega: number;
    theta: number;
    rho: number;
    /** Rho with respect to foreign interest rate */
    rhoForeign: number;
}
/** FX option pricing result */
export interface FXOptionPrice {
    premium: number;
    greeks: FXOptionGreeks;
    intrinsicValue: number;
    timeValue: number;
}
/** Volatility surface point */
export interface VolatilitySurfacePoint {
    strike: number;
    /** Time to expiry in years */
    tenor: number;
    /** Implied volatility */
    volatility: number;
    /** Delta (for delta-based surface representation) */
    delta?: number;
}
/** Complete volatility surface */
export interface VolatilitySurface {
    pair: CurrencyPair;
    points: VolatilitySurfacePoint[];
    /** ATM volatility by tenor */
    atmVolatilities: Map<number, number>;
    /** Risk reversal by tenor (25-delta call - 25-delta put) */
    riskReversals: Map<number, number>;
    /** Butterfly by tenor (average of 25-delta call and put minus ATM) */
    butterflies: Map<number, number>;
    timestamp: Date;
}
/** Currency correlation data */
export interface CurrencyCorrelation {
    pair1: CurrencyPair;
    pair2: CurrencyPair;
    correlation: number;
    /** Period in days over which correlation is calculated */
    period: number;
    timestamp: Date;
}
/** Hedge calculation result */
export interface HedgeResult {
    /** Hedge ratio */
    ratio: number;
    /** Notional amount to hedge */
    notional: number;
    /** Hedge currency pair */
    hedgePair: CurrencyPair;
    /** Hedge effectiveness (R-squared) */
    effectiveness: number;
    /** Residual risk (unhedged variance) */
    residualRisk: number;
}
/** Currency basket specification */
export interface CurrencyBasket {
    name: string;
    /** Basket components with weights */
    components: Array<{
        currency: CurrencyCode;
        weight: number;
    }>;
    /** Base currency for basket valuation */
    baseCurrency: CurrencyCode;
    /** Rebalancing frequency in days */
    rebalanceFrequency: number;
}
/** Carry trade specification */
export interface CarryTrade {
    fundingCurrency: CurrencyCode;
    targetCurrency: CurrencyCode;
    /** Funding currency interest rate (annualized) */
    fundingRate: number;
    /** Target currency interest rate (annualized) */
    targetRate: number;
    /** Spot exchange rate */
    spotRate: number;
    /** Leverage factor */
    leverage: number;
}
/** Market data aggregation source */
export interface RateSource {
    name: string;
    quote: FXSpotQuote;
    /** Reliability score (0-1) */
    reliability: number;
    /** Latency in milliseconds */
    latency: number;
}
/**
 * Calculate FX spot mid-market rate
 *
 * @param bid - Bid price
 * @param ask - Ask price
 * @returns Mid-market rate
 *
 * @example
 * ```typescript
 * const mid = calculateFXSpotMid(1.1850, 1.1852);
 * // Returns: 1.1851
 * ```
 */
export declare function calculateFXSpotMid(bid: number, ask: number): number;
/**
 * Calculate FX spot bid/ask spread in pips
 *
 * @param bid - Bid price
 * @param ask - Ask price
 * @param pipSize - Pip size for the currency pair
 * @returns Spread in pips
 *
 * @example
 * ```typescript
 * const spread = calculateFXSpotBidAsk(1.1850, 1.1852, 0.0001);
 * // Returns: 2 (pips)
 * ```
 */
export declare function calculateFXSpotBidAsk(bid: number, ask: number, pipSize: number): number;
/**
 * Calculate liquidity-adjusted FX spot price
 * Adjusts price based on order size relative to available liquidity
 *
 * @param quote - FX spot quote
 * @param orderSize - Order size in base currency
 * @param liquidityImpactFactor - Liquidity impact factor (typically 0.001-0.01)
 * @returns Adjusted price considering liquidity impact
 *
 * @example
 * ```typescript
 * const quote: FXSpotQuote = { mid: 1.1851, liquidityDepth: 1000000, ... };
 * const adjustedPrice = calculateFXSpotLiquidityAdjusted(quote, 500000, 0.005);
 * // Returns price adjusted for 50% of available liquidity
 * ```
 */
export declare function calculateFXSpotLiquidityAdjusted(quote: FXSpotQuote, orderSize: number, liquidityImpactFactor?: number): number;
/**
 * Calculate volume-weighted average price (VWAP) from multiple quotes
 *
 * @param quotes - Array of FX spot quotes with volumes
 * @param volumes - Corresponding volumes for each quote
 * @returns VWAP
 *
 * @example
 * ```typescript
 * const quotes = [
 *   { mid: 1.1850, ... },
 *   { mid: 1.1852, ... },
 *   { mid: 1.1851, ... }
 * ];
 * const volumes = [1000000, 2000000, 1500000];
 * const vwap = calculateFXSpotVWAP(quotes, volumes);
 * ```
 */
export declare function calculateFXSpotVWAP(quotes: FXSpotQuote[], volumes: number[]): number;
/**
 * Calculate time-weighted average price (TWAP) from time series of quotes
 *
 * @param quotes - Array of FX spot quotes with timestamps
 * @param startTime - Start of TWAP period
 * @param endTime - End of TWAP period
 * @returns TWAP
 *
 * @example
 * ```typescript
 * const quotes = [
 *   { mid: 1.1850, timestamp: new Date('2025-01-01T09:00:00Z'), ... },
 *   { mid: 1.1852, timestamp: new Date('2025-01-01T10:00:00Z'), ... }
 * ];
 * const twap = calculateFXSpotTWAP(quotes, quotes[0].timestamp, quotes[1].timestamp);
 * ```
 */
export declare function calculateFXSpotTWAP(quotes: FXSpotQuote[], startTime: Date, endTime: Date): number;
/**
 * Select best FX execution price from multiple sources
 * Considers price, spread, liquidity, and source reliability
 *
 * @param sources - Array of rate sources
 * @param side - Trade side ('buy' or 'sell')
 * @param size - Order size in base currency
 * @returns Best execution source
 *
 * @example
 * ```typescript
 * const sources: RateSource[] = [
 *   { name: 'Bank A', quote: {...}, reliability: 0.95, latency: 50 },
 *   { name: 'Bank B', quote: {...}, reliability: 0.98, latency: 30 }
 * ];
 * const best = calculateFXSpotBestExecution(sources, 'buy', 1000000);
 * ```
 */
export declare function calculateFXSpotBestExecution(sources: RateSource[], side: 'buy' | 'sell', size: number): RateSource;
/**
 * Calculate FX forward points using interest rate parity
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency interest rate (annualized)
 * @param quoteRate - Quote currency interest rate (annualized)
 * @param tenor - Tenor in days
 * @returns Forward points
 *
 * @example
 * ```typescript
 * const forwardPoints = calculateFXForwardPoints(1.1850, 0.05, 0.02, 90);
 * // Returns forward points for 90-day EUR/USD forward
 * ```
 */
export declare function calculateFXForwardPoints(spotRate: number, baseRate: number, quoteRate: number, tenor: number): number;
/**
 * Calculate outright FX forward rate
 *
 * @param spotRate - Current spot rate
 * @param forwardPoints - Forward points
 * @returns Outright forward rate
 *
 * @example
 * ```typescript
 * const outrightForward = calculateFXOutrightForward(1.1850, 0.0035);
 * // Returns: 1.1885
 * ```
 */
export declare function calculateFXOutrightForward(spotRate: number, forwardPoints: number): number;
/**
 * Calculate implied yield from FX forward rate
 *
 * @param spotRate - Current spot rate
 * @param forwardRate - Forward rate
 * @param tenor - Tenor in days
 * @param knownRate - Known interest rate (either base or quote)
 * @param isBaseRate - True if knownRate is base currency rate, false if quote currency rate
 * @returns Implied interest rate (annualized)
 *
 * @example
 * ```typescript
 * const impliedRate = calculateFXImpliedYield(1.1850, 1.1885, 90, 0.02, false);
 * // Returns implied base currency rate given quote currency rate
 * ```
 */
export declare function calculateFXImpliedYield(spotRate: number, forwardRate: number, tenor: number, knownRate: number, isBaseRate: boolean): number;
/**
 * Calculate FX forward premium or discount
 *
 * @param spotRate - Current spot rate
 * @param forwardRate - Forward rate
 * @returns Premium (positive) or discount (negative) as percentage
 *
 * @example
 * ```typescript
 * const premium = calculateFXForwardPremiumDiscount(1.1850, 1.1885);
 * // Returns: 0.295% (premium)
 * ```
 */
export declare function calculateFXForwardPremiumDiscount(spotRate: number, forwardRate: number): number;
/**
 * Calculate FX forward settlement amount
 *
 * @param notional - Notional amount in base currency
 * @param forwardRate - Forward rate
 * @param side - Trade side ('buy' or 'sell')
 * @returns Settlement amount in quote currency
 *
 * @example
 * ```typescript
 * const settlement = calculateFXForwardSettlement(1000000, 1.1885, 'buy');
 * // Returns: 1,188,500 (buying 1M EUR at 1.1885 costs 1,188,500 USD)
 * ```
 */
export declare function calculateFXForwardSettlement(notional: number, forwardRate: number, side: 'buy' | 'sell'): number;
/**
 * Calculate FX forward breakeven rate
 * Rate at which profit/loss is zero considering spot movement
 *
 * @param forwardRate - Forward rate at inception
 * @param currentSpot - Current spot rate
 * @param tenor - Remaining tenor in days
 * @param baseRate - Base currency interest rate
 * @param quoteRate - Quote currency interest rate
 * @returns Breakeven spot rate at maturity
 *
 * @example
 * ```typescript
 * const breakeven = calculateFXForwardBreakeven(1.1885, 1.1850, 45, 0.05, 0.02);
 * ```
 */
export declare function calculateFXForwardBreakeven(forwardRate: number, currentSpot: number, tenor: number, baseRate: number, quoteRate: number): number;
/**
 * Calculate cross-currency rate from two currency pairs
 *
 * @param rate1 - First currency pair rate
 * @param rate2 - Second currency pair rate
 * @param pair1 - First currency pair
 * @param pair2 - Second currency pair
 * @param targetPair - Target cross currency pair
 * @returns Cross rate
 *
 * @example
 * ```typescript
 * // Calculate EUR/GBP from EUR/USD and GBP/USD
 * const eurGbp = calculateCrossCurrencyRate(
 *   1.1850, // EUR/USD
 *   1.2700, // GBP/USD
 *   { base: 'EUR', quote: 'USD', ... },
 *   { base: 'GBP', quote: 'USD', ... },
 *   { base: 'EUR', quote: 'GBP', ... }
 * );
 * // Returns: EUR/GBP = EUR/USD / GBP/USD = 0.9331
 * ```
 */
export declare function calculateCrossCurrencyRate(rate1: number, rate2: number, pair1: CurrencyPair, pair2: CurrencyPair, targetPair: CurrencyPair): number;
/**
 * Detect triangular arbitrage opportunity
 *
 * @param rate1 - First pair rate
 * @param rate2 - Second pair rate
 * @param rate3 - Third pair rate (cross rate)
 * @param threshold - Minimum profit threshold (in percentage)
 * @returns Arbitrage opportunity details or null
 *
 * @example
 * ```typescript
 * const arb = detectTriangularArbitrage(
 *   1.1850, // EUR/USD
 *   1.2700, // GBP/USD
 *   0.9300, // EUR/GBP (market)
 *   0.1 // 0.1% threshold
 * );
 * // If synthetic EUR/GBP (0.9331) differs from market (0.9300), returns arbitrage opportunity
 * ```
 */
export declare function detectTriangularArbitrage(rate1: number, rate2: number, rate3Market: number, threshold?: number): {
    exists: boolean;
    profit: number;
    syntheticRate: number;
} | null;
/**
 * Calculate synthetic currency pair rate
 *
 * @param throughCurrency - Intermediate currency
 * @param baseCurrency - Base currency
 * @param quoteCurrency - Quote currency
 * @param rates - Map of available currency pair rates
 * @returns Synthetic rate
 *
 * @example
 * ```typescript
 * const rates = new Map([
 *   ['EUR/USD', 1.1850],
 *   ['USD/JPY', 110.50]
 * ]);
 * const eurJpy = calculateSyntheticPair('USD', 'EUR', 'JPY', rates);
 * // Returns: EUR/JPY = EUR/USD * USD/JPY = 130.9425
 * ```
 */
export declare function calculateSyntheticPair(throughCurrency: CurrencyCode, baseCurrency: CurrencyCode, quoteCurrency: CurrencyCode, rates: Map<string, number>): number;
/**
 * Calculate cross-currency basis spread
 * Difference between direct market rate and synthetic rate via currency swap
 *
 * @param directRate - Direct market cross rate
 * @param syntheticRate - Synthetic rate via swap
 * @returns Basis spread in basis points
 *
 * @example
 * ```typescript
 * const basis = calculateCrossCurrencyBasis(0.9300, 0.9331);
 * // Returns basis spread in bps
 * ```
 */
export declare function calculateCrossCurrencyBasis(directRate: number, syntheticRate: number): number;
/**
 * Optimize cross-currency conversion path
 * Find the most cost-effective path through multiple currency pairs
 *
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param rates - Available currency pair rates with spreads
 * @param amount - Amount to convert
 * @returns Optimal conversion path and final amount
 *
 * @example
 * ```typescript
 * const rates = new Map([
 *   ['EUR/USD', { mid: 1.1850, spread: 0.0002 }],
 *   ['USD/JPY', { mid: 110.50, spread: 0.02 }],
 *   ['EUR/JPY', { mid: 130.50, spread: 0.05 }]
 * ]);
 * const path = optimizeCrossCurrencyPath('EUR', 'JPY', rates, 1000000);
 * // Returns optimal path: either direct EUR/JPY or via EUR/USD/JPY
 * ```
 */
export declare function optimizeCrossCurrencyPath(fromCurrency: CurrencyCode, toCurrency: CurrencyCode, rates: Map<string, {
    mid: number;
    spread: number;
}>, amount: number): {
    path: string[];
    finalAmount: number;
    totalCost: number;
};
/**
 * Calculate FX swap points
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency interest rate
 * @param quoteRate - Quote currency interest rate
 * @param nearTenor - Near leg tenor in days
 * @param farTenor - Far leg tenor in days
 * @returns Swap points
 *
 * @example
 * ```typescript
 * const swapPoints = calculateFXSwapPoints(1.1850, 0.05, 0.02, 1, 7);
 * // Returns swap points for 1-week swap (tom-next to 1-week)
 * ```
 */
export declare function calculateFXSwapPoints(spotRate: number, baseRate: number, quoteRate: number, nearTenor: number, farTenor: number): number;
/**
 * Calculate FX swap near and far leg rates
 *
 * @param spotRate - Current spot rate
 * @param swapPoints - Swap points
 * @param nearForwardPoints - Near leg forward points
 * @returns Near and far leg rates
 *
 * @example
 * ```typescript
 * const legs = calculateFXSwapNearFarLegs(1.1850, 0.0012, 0.0003);
 * // Returns: { nearLeg: 1.1853, farLeg: 1.1865 }
 * ```
 */
export declare function calculateFXSwapNearFarLegs(spotRate: number, swapPoints: number, nearForwardPoints: number): {
    nearLeg: number;
    farLeg: number;
};
/**
 * Calculate tom-next swap rate
 * Swap from tomorrow to spot date (typically 2 business days)
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency overnight rate
 * @param quoteRate - Quote currency overnight rate
 * @returns Tom-next swap points
 *
 * @example
 * ```typescript
 * const tomNext = calculateFXTomNext(1.1850, 0.05, 0.02);
 * ```
 */
export declare function calculateFXTomNext(spotRate: number, baseRate: number, quoteRate: number): number;
/**
 * Calculate spot-next swap rate
 * Swap from spot date to next business day
 *
 * @param spotRate - Current spot rate
 * @param baseRate - Base currency overnight rate
 * @param quoteRate - Quote currency overnight rate
 * @returns Spot-next swap points
 *
 * @example
 * ```typescript
 * const spotNext = calculateFXSpotNext(1.1850, 0.05, 0.02);
 * ```
 */
export declare function calculateFXSpotNext(spotRate: number, baseRate: number, quoteRate: number): number;
/**
 * Calculate implied rate from FX swap
 *
 * @param spotRate - Current spot rate
 * @param swapPoints - Swap points
 * @param tenor - Swap tenor in days
 * @param knownRate - Known interest rate (either base or quote)
 * @param isBaseRate - True if knownRate is base currency rate
 * @returns Implied interest rate
 *
 * @example
 * ```typescript
 * const impliedRate = calculateFXSwapImpliedRate(1.1850, 0.0012, 7, 0.02, false);
 * // Returns implied base rate given quote rate and swap points
 * ```
 */
export declare function calculateFXSwapImpliedRate(spotRate: number, swapPoints: number, tenor: number, knownRate: number, isBaseRate: boolean): number;
/**
 * Convert amount between currency pairs
 *
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param rate - Exchange rate
 * @param isInverted - True if rate is inverted (e.g., using USD/EUR for EUR/USD conversion)
 * @returns Converted amount
 *
 * @example
 * ```typescript
 * const usdAmount = convertCurrencyPair(1000000, 'EUR', 'USD', 1.1850, false);
 * // Returns: 1,185,000 USD
 * ```
 */
export declare function convertCurrencyPair(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode, rate: number, isInverted?: boolean): number;
/**
 * Normalize currency pair to market convention
 *
 * @param base - Base currency
 * @param quote - Quote currency
 * @returns Normalized currency pair with convention indicator
 *
 * @example
 * ```typescript
 * const normalized = normalizeCurrencyPair('USD', 'EUR');
 * // Returns: { base: 'EUR', quote: 'USD', isInverted: true }
 * // Market convention is EUR/USD, not USD/EUR
 * ```
 */
export declare function normalizeCurrencyPair(base: CurrencyCode, quote: CurrencyCode): {
    base: CurrencyCode;
    quote: CurrencyCode;
    isInverted: boolean;
};
/**
 * Validate currency pair
 *
 * @param pair - Currency pair to validate
 * @returns Validation result with error messages
 *
 * @example
 * ```typescript
 * const validation = validateCurrencyPair({ base: 'EUR', quote: 'USD', ... });
 * // Returns: { isValid: true, errors: [] }
 * ```
 */
export declare function validateCurrencyPair(pair: CurrencyPair): {
    isValid: boolean;
    errors: string[];
};
/**
 * Get currency pair precision based on market conventions
 *
 * @param pair - Currency pair
 * @returns Precision (decimal places) and pip size
 *
 * @example
 * ```typescript
 * const precision = getCurrencyPairPrecision({ base: 'EUR', quote: 'USD', ... });
 * // Returns: { precision: 4, pipSize: 0.0001 }
 *
 * const jpyPrecision = getCurrencyPairPrecision({ base: 'USD', quote: 'JPY', ... });
 * // Returns: { precision: 2, pipSize: 0.01 }
 * ```
 */
export declare function getCurrencyPairPrecision(pair: CurrencyPair): {
    precision: number;
    pipSize: number;
};
/**
 * Format currency amount according to currency conventions
 *
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param precision - Decimal precision (optional, uses currency default if not provided)
 * @returns Formatted amount string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrencyAmount(1234567.89, 'USD', 2);
 * // Returns: "1,234,567.89"
 * ```
 */
export declare function formatCurrencyAmount(amount: number, currency: CurrencyCode, precision?: number): string;
/**
 * Calculate FX vanilla option price using Garman-Kohlhagen model
 *
 * @param option - FX option specification
 * @returns Option price and Greeks
 *
 * @example
 * ```typescript
 * const option: FXOption = {
 *   type: 'call',
 *   strike: 1.2000,
 *   spot: 1.1850,
 *   timeToExpiry: 0.25, // 3 months
 *   volatility: 0.10,
 *   domesticRate: 0.02,
 *   foreignRate: 0.05,
 *   style: 'european'
 * };
 * const pricing = calculateFXVanillaOptionPrice(option);
 * ```
 */
export declare function calculateFXVanillaOptionPrice(option: FXOption): FXOptionPrice;
/**
 * Calculate FX digital option price
 *
 * @param option - FX option specification
 * @param payout - Payout amount if option finishes in the money
 * @returns Digital option price
 *
 * @example
 * ```typescript
 * const digitalPrice = calculateFXDigitalOptionPrice(option, 1.0);
 * // Returns price of binary option that pays 1.0 if spot > strike at expiry
 * ```
 */
export declare function calculateFXDigitalOptionPrice(option: FXOption, payout: number): number;
/**
 * Calculate FX option delta
 *
 * @param option - FX option specification
 * @returns Delta (rate of change of option price with respect to spot)
 *
 * @example
 * ```typescript
 * const delta = calculateFXOptionDelta(option);
 * // Returns delta: ~0.45 for ATM call
 * ```
 */
export declare function calculateFXOptionDelta(option: FXOption): number;
/**
 * Calculate FX option gamma
 *
 * @param option - FX option specification
 * @returns Gamma (rate of change of delta with respect to spot)
 *
 * @example
 * ```typescript
 * const gamma = calculateFXOptionGamma(option);
 * ```
 */
export declare function calculateFXOptionGamma(option: FXOption): number;
/**
 * Calculate FX option vega
 *
 * @param option - FX option specification
 * @returns Vega (rate of change of option price with respect to volatility)
 *
 * @example
 * ```typescript
 * const vega = calculateFXOptionVega(option);
 * // Returns vega: change in option price per 1% change in volatility
 * ```
 */
export declare function calculateFXOptionVega(option: FXOption): number;
/**
 * Calculate FX option theta
 *
 * @param option - FX option specification
 * @returns Theta (rate of change of option price with respect to time)
 *
 * @example
 * ```typescript
 * const theta = calculateFXOptionTheta(option);
 * // Returns theta: change in option price per day
 * ```
 */
export declare function calculateFXOptionTheta(option: FXOption): number;
/**
 * Calculate FX option rho
 *
 * @param option - FX option specification
 * @returns Rho (rate of change of option price with respect to domestic interest rate)
 *
 * @example
 * ```typescript
 * const rho = calculateFXOptionRho(option);
 * // Returns rho: change in option price per 1% change in domestic rate
 * ```
 */
export declare function calculateFXOptionRho(option: FXOption): number;
/**
 * Calculate FX option implied volatility using Newton-Raphson method
 *
 * @param option - FX option specification (without volatility)
 * @param marketPrice - Observed market price
 * @param maxIterations - Maximum iterations for convergence
 * @param tolerance - Convergence tolerance
 * @returns Implied volatility
 *
 * @example
 * ```typescript
 * const impliedVol = calculateFXOptionImpliedVolatility(
 *   { ...option, volatility: 0.10 }, // Initial guess
 *   0.0250, // Market price
 *   100,
 *   0.0001
 * );
 * ```
 */
export declare function calculateFXOptionImpliedVolatility(option: FXOption, marketPrice: number, maxIterations?: number, tolerance?: number): number;
/**
 * Calculate FX implied volatility from market prices
 * (Wrapper around calculateFXOptionImpliedVolatility for consistency)
 *
 * @param option - FX option specification
 * @param marketPrice - Market option price
 * @returns Implied volatility
 */
export declare function calculateFXImpliedVolatility(option: FXOption, marketPrice: number): number;
/**
 * Construct FX volatility surface from market quotes
 *
 * @param pair - Currency pair
 * @param spotRate - Current spot rate
 * @param quotes - Market volatility quotes (ATM, RR, BF by tenor)
 * @param tenors - Tenors in years
 * @returns Volatility surface
 *
 * @example
 * ```typescript
 * const surface = constructFXVolatilitySurface(
 *   eurUsdPair,
 *   1.1850,
 *   {
 *     atm: [0.08, 0.09, 0.10], // ATM vols for each tenor
 *     rr25: [0.005, 0.006, 0.007], // 25-delta risk reversals
 *     bf25: [0.002, 0.0025, 0.003] // 25-delta butterflies
 *   },
 *   [0.25, 0.5, 1.0] // 3M, 6M, 1Y
 * );
 * ```
 */
export declare function constructFXVolatilitySurface(pair: CurrencyPair, spotRate: number, quotes: {
    atm: number[];
    rr25: number[];
    bf25: number[];
}, tenors: number[]): VolatilitySurface;
/**
 * Interpolate FX volatility surface for specific strike and tenor
 *
 * @param surface - Volatility surface
 * @param strike - Strike price
 * @param tenor - Tenor in years
 * @param method - Interpolation method ('linear' or 'cubic')
 * @returns Interpolated volatility
 *
 * @example
 * ```typescript
 * const vol = interpolateFXVolatilitySurface(surface, 1.2000, 0.75, 'linear');
 * // Returns interpolated volatility for strike 1.2000 at 9-month tenor
 * ```
 */
export declare function interpolateFXVolatilitySurface(surface: VolatilitySurface, strike: number, tenor: number, method?: 'linear' | 'cubic'): number;
/**
 * Calculate FX volatility smile for specific tenor
 *
 * @param surface - Volatility surface
 * @param tenor - Tenor in years
 * @param strikes - Array of strikes to calculate smile
 * @returns Volatility smile (volatility by strike)
 *
 * @example
 * ```typescript
 * const smile = calculateFXVolatilitySmile(surface, 0.25, [1.15, 1.17, 1.19, 1.21, 1.23]);
 * // Returns volatility smile for 3-month tenor
 * ```
 */
export declare function calculateFXVolatilitySmile(surface: VolatilitySurface, tenor: number, strikes: number[]): Array<{
    strike: number;
    volatility: number;
}>;
/**
 * Calculate FX ATM volatility for specific tenor
 *
 * @param surface - Volatility surface
 * @param tenor - Tenor in years
 * @returns ATM volatility
 *
 * @example
 * ```typescript
 * const atmVol = calculateFXATMVolatility(surface, 0.25);
 * // Returns 3-month ATM volatility
 * ```
 */
export declare function calculateFXATMVolatility(surface: VolatilitySurface, tenor: number): number;
/**
 * Calculate FX risk reversal and butterfly for tenor
 *
 * @param surface - Volatility surface
 * @param tenor - Tenor in years
 * @returns Risk reversal and butterfly spreads
 *
 * @example
 * ```typescript
 * const { riskReversal, butterfly } = calculateFXRiskReversalButterfly(surface, 0.25);
 * // RR: vol(25d call) - vol(25d put)
 * // BF: 0.5 * (vol(25d call) + vol(25d put)) - vol(ATM)
 * ```
 */
export declare function calculateFXRiskReversalButterfly(surface: VolatilitySurface, tenor: number): {
    riskReversal: number;
    butterfly: number;
};
/**
 * Calculate currency correlation matrix
 *
 * @param returns - Array of currency pair returns (time series)
 * @param pairs - Array of currency pairs
 * @returns Correlation matrix
 *
 * @example
 * ```typescript
 * const returns = [
 *   [0.001, -0.002, 0.003], // EUR/USD, GBP/USD, USD/JPY returns at time 1
 *   [0.002, 0.001, -0.001], // Returns at time 2
 *   // ... more time periods
 * ];
 * const matrix = calculateCurrencyCorrelationMatrix(returns, [eurUsd, gbpUsd, usdJpy]);
 * ```
 */
export declare function calculateCurrencyCorrelationMatrix(returns: number[][], pairs: CurrencyPair[]): number[][];
/**
 * Calculate rolling currency correlation
 *
 * @param returns1 - First currency pair returns (time series)
 * @param returns2 - Second currency pair returns (time series)
 * @param window - Rolling window size
 * @returns Rolling correlation time series
 *
 * @example
 * ```typescript
 * const rolling = calculateRollingCurrencyCorrelation(eurUsdReturns, gbpUsdReturns, 30);
 * // Returns 30-period rolling correlation
 * ```
 */
export declare function calculateRollingCurrencyCorrelation(returns1: number[], returns2: number[], window: number): number[];
/**
 * Detect correlation regime change
 * Identifies significant shifts in currency pair correlation
 *
 * @param rollingCorr - Rolling correlation time series
 * @param threshold - Threshold for regime change detection
 * @returns Regime change points and statistics
 *
 * @example
 * ```typescript
 * const regimes = detectCorrelationRegimeChange(rollingCorr, 0.3);
 * // Returns indices where correlation changed by more than 0.3
 * ```
 */
export declare function detectCorrelationRegimeChange(rollingCorr: number[], threshold?: number): Array<{
    index: number;
    oldCorr: number;
    newCorr: number;
    change: number;
}>;
/**
 * Calculate currency beta (systematic risk relative to a benchmark)
 *
 * @param currencyReturns - Currency pair returns
 * @param benchmarkReturns - Benchmark returns (e.g., DXY index)
 * @returns Beta coefficient
 *
 * @example
 * ```typescript
 * const beta = calculateCurrencyBeta(eurUsdReturns, dxyReturns);
 * // Returns how much EUR/USD moves relative to DXY
 * ```
 */
export declare function calculateCurrencyBeta(currencyReturns: number[], benchmarkReturns: number[]): number;
/**
 * Calculate delta hedge for FX options portfolio
 *
 * @param positions - Array of option positions with Greeks
 * @param spotPrice - Current spot price
 * @returns Required hedge amount in base currency
 *
 * @example
 * ```typescript
 * const hedge = calculateDeltaHedge([
 *   { notional: 1000000, delta: 0.5 },
 *   { notional: -500000, delta: -0.3 }
 * ], 1.1850);
 * ```
 */
export declare function calculateDeltaHedge(positions: Array<{
    notional: number;
    delta: number;
}>, spotPrice: number): number;
/**
 * Calculate portfolio hedge using minimum variance approach
 *
 * @param exposures - Array of currency exposures
 * @param correlationMatrix - Correlation matrix between currencies
 * @param volatilities - Volatility of each currency
 * @returns Optimal hedge ratios for each currency
 *
 * @example
 * ```typescript
 * const hedge = calculatePortfolioHedge(
 *   [1000000, -500000, 300000],
 *   [[1, 0.7, -0.3], [0.7, 1, -0.1], [-0.3, -0.1, 1]],
 *   [0.10, 0.12, 0.15]
 * );
 * ```
 */
export declare function calculatePortfolioHedge(exposures: number[], correlationMatrix: number[][], volatilities: number[]): number[];
/**
 * Calculate optimal hedge ratio using regression
 *
 * @param spotReturns - Spot position returns (time series)
 * @param hedgeReturns - Hedge instrument returns (time series)
 * @returns Optimal hedge ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateOptimalHedgeRatio(eurUsdSpotReturns, eurUsdFuturesReturns);
 * // Returns optimal number of futures contracts per unit of spot exposure
 * ```
 */
export declare function calculateOptimalHedgeRatio(spotReturns: number[], hedgeReturns: number[]): number;
/**
 * Calculate hedge effectiveness (R-squared)
 *
 * @param spotReturns - Spot position returns
 * @param hedgedReturns - Hedged portfolio returns
 * @returns Hedge effectiveness (0-1, where 1 is perfect hedge)
 *
 * @example
 * ```typescript
 * const effectiveness = calculateHedgeEffectiveness(spotReturns, hedgedReturns);
 * // Returns 0.95 for 95% effective hedge
 * ```
 */
export declare function calculateHedgeEffectiveness(spotReturns: number[], hedgedReturns: number[]): number;
/**
 * Rebalance delta hedge based on gamma exposure
 *
 * @param currentDelta - Current portfolio delta
 * @param targetDelta - Target delta (typically 0 for delta-neutral)
 * @param spotPrice - Current spot price
 * @param spotMove - Expected spot price movement
 * @param gamma - Portfolio gamma
 * @returns Rebalancing trade size
 *
 * @example
 * ```typescript
 * const rebalance = rebalanceDeltaHedge(5000, 0, 1.1850, 0.0020, 1500);
 * // Returns amount to trade to restore delta neutrality after spot move
 * ```
 */
export declare function rebalanceDeltaHedge(currentDelta: number, targetDelta: number, spotPrice: number, spotMove: number, gamma: number): number;
/**
 * Construct currency basket with specified weights
 *
 * @param basket - Currency basket specification
 * @param rates - Current exchange rates (vs base currency)
 * @returns Basket value and composition
 *
 * @example
 * ```typescript
 * const basket: CurrencyBasket = {
 *   name: 'Custom SDR',
 *   components: [
 *     { currency: 'USD', weight: 0.40 },
 *     { currency: 'EUR', weight: 0.30 },
 *     { currency: 'GBP', weight: 0.20 },
 *     { currency: 'JPY', weight: 0.10 }
 *   ],
 *   baseCurrency: 'USD',
 *   rebalanceFrequency: 30
 * };
 * const rates = new Map([['EUR', 1.1850], ['GBP', 1.2700], ['JPY', 0.0091]]);
 * const basketValue = constructCurrencyBasket(basket, rates);
 * ```
 */
export declare function constructCurrencyBasket(basket: CurrencyBasket, rates: Map<string, number>): {
    value: number;
    composition: Map<CurrencyCode, number>;
};
/**
 * Rebalance currency basket to target weights
 *
 * @param currentComposition - Current basket composition
 * @param targetWeights - Target weights for each currency
 * @param currentRates - Current exchange rates
 * @returns Required trades to rebalance
 *
 * @example
 * ```typescript
 * const trades = rebalanceCurrencyBasket(currentComp, targetWeights, rates);
 * // Returns buy/sell amounts for each currency
 * ```
 */
export declare function rebalanceCurrencyBasket(currentComposition: Map<CurrencyCode, number>, targetWeights: Map<CurrencyCode, number>, currentRates: Map<string, number>): Map<CurrencyCode, number>;
/**
 * Calculate currency basket performance attribution
 *
 * @param basketReturns - Basket returns
 * @param componentReturns - Returns of each component
 * @param weights - Component weights
 * @returns Performance attribution by component
 *
 * @example
 * ```typescript
 * const attribution = calculateBasketPerformanceAttribution(
 *   0.025, // 2.5% total return
 *   [0.03, 0.02, 0.01, 0.04], // Component returns
 *   [0.40, 0.30, 0.20, 0.10] // Weights
 * );
 * ```
 */
export declare function calculateBasketPerformanceAttribution(basketReturns: number, componentReturns: number[], weights: number[]): Array<{
    index: number;
    contribution: number;
    percentage: number;
}>;
/**
 * Calculate currency basket volatility
 *
 * @param componentVolatilities - Volatility of each component
 * @param weights - Component weights
 * @param correlationMatrix - Correlation matrix between components
 * @returns Basket volatility
 *
 * @example
 * ```typescript
 * const basketVol = calculateBasketVolatility(
 *   [0.10, 0.12, 0.08, 0.15],
 *   [0.40, 0.30, 0.20, 0.10],
 *   correlationMatrix
 * );
 * ```
 */
export declare function calculateBasketVolatility(componentVolatilities: number[], weights: number[], correlationMatrix: number[][]): number;
/**
 * Calculate FX carry trade return
 *
 * @param trade - Carry trade specification
 * @param holdingPeriod - Holding period in days
 * @param spotChange - Spot rate change over period (optional)
 * @returns Carry return (interest differential + spot change)
 *
 * @example
 * ```typescript
 * const carryTrade: CarryTrade = {
 *   fundingCurrency: 'JPY',
 *   targetCurrency: 'AUD',
 *   fundingRate: 0.001, // 0.1% JPY rate
 *   targetRate: 0.045, // 4.5% AUD rate
 *   spotRate: 95.50,
 *   leverage: 1.0
 * };
 * const returns = calculateFXCarryReturn(carryTrade, 365);
 * // Returns ~4.4% annual carry (4.5% - 0.1%)
 * ```
 */
export declare function calculateFXCarryReturn(trade: CarryTrade, holdingPeriod: number, spotChange?: number): number;
/**
 * Calculate FX carry trade funding cost
 *
 * @param trade - Carry trade specification
 * @param notional - Notional amount in target currency
 * @param holdingPeriod - Holding period in days
 * @returns Total funding cost
 *
 * @example
 * ```typescript
 * const fundingCost = calculateFXFundingCost(carryTrade, 1000000, 365);
 * ```
 */
export declare function calculateFXFundingCost(trade: CarryTrade, notional: number, holdingPeriod: number): number;
/**
 * Calculate FX roll yield
 *
 * @param spotRate - Current spot rate
 * @param forwardRate - Forward rate for roll date
 * @param holdingPeriod - Holding period in days
 * @returns Annualized roll yield
 *
 * @example
 * ```typescript
 * const rollYield = calculateFXRollYield(1.1850, 1.1880, 30);
 * // Returns annualized yield from rolling forward contracts
 * ```
 */
export declare function calculateFXRollYield(spotRate: number, forwardRate: number, holdingPeriod: number): number;
/**
 * Rank currency pairs by carry trade attractiveness
 *
 * @param pairs - Array of carry trade specifications
 * @param riskAdjust - Whether to adjust for volatility (Sharpe-like ranking)
 * @param volatilities - Volatilities for risk adjustment (if riskAdjust = true)
 * @returns Ranked carry trades
 *
 * @example
 * ```typescript
 * const ranked = rankCurrencyCarry(carryTrades, true, [0.08, 0.12, 0.10]);
 * // Returns carry trades ranked by risk-adjusted returns
 * ```
 */
export declare function rankCurrencyCarry(pairs: CarryTrade[], riskAdjust?: boolean, volatilities?: number[]): Array<{
    trade: CarryTrade;
    score: number;
    rank: number;
}>;
/**
 * Aggregate FX rates from multiple sources
 *
 * @param sources - Array of rate sources
 * @param method - Aggregation method ('mean', 'median', 'vwap', 'best')
 * @returns Aggregated rate
 *
 * @example
 * ```typescript
 * const aggregated = aggregateFXRatesMultiSource(sources, 'median');
 * // Returns median rate across all sources
 * ```
 */
export declare function aggregateFXRatesMultiSource(sources: RateSource[], method?: 'mean' | 'median' | 'vwap' | 'best'): number;
/**
 * Calculate VWAP from real-time rate stream
 *
 * @param quotes - Array of quotes with volumes
 * @param volumes - Corresponding volumes
 * @param startTime - Start of VWAP period
 * @param endTime - End of VWAP period
 * @returns VWAP over specified period
 *
 * @example
 * ```typescript
 * const vwap = calculateFXRateVWAP(quotes, volumes, startTime, endTime);
 * ```
 */
export declare function calculateFXRateVWAP(quotes: FXSpotQuote[], volumes: number[], startTime: Date, endTime: Date): number;
/**
 * Calculate TWAP from real-time rate stream
 *
 * @param quotes - Array of quotes
 * @param startTime - Start of TWAP period
 * @param endTime - End of TWAP period
 * @param samplingInterval - Sampling interval in milliseconds (optional)
 * @returns TWAP over specified period
 *
 * @example
 * ```typescript
 * const twap = calculateFXRateTWAP(quotes, startTime, endTime, 1000);
 * // Returns TWAP with 1-second sampling
 * ```
 */
export declare function calculateFXRateTWAP(quotes: FXSpotQuote[], startTime: Date, endTime: Date, samplingInterval?: number): number;
/**
 * Select best FX execution source
 *
 * @param sources - Available rate sources
 * @param side - Trade side ('buy' or 'sell')
 * @param size - Order size
 * @param preferences - Execution preferences
 * @returns Best execution source with score
 *
 * @example
 * ```typescript
 * const best = selectBestFXExecution(sources, 'buy', 1000000, {
 *   prioritizePrice: 0.5,
 *   prioritizeLiquidity: 0.3,
 *   prioritizeSpeed: 0.2
 * });
 * ```
 */
export declare function selectBestFXExecution(sources: RateSource[], side: 'buy' | 'sell', size: number, preferences?: {
    prioritizePrice: number;
    prioritizeLiquidity: number;
    prioritizeSpeed: number;
}): {
    source: RateSource;
    score: number;
};
//# sourceMappingURL=fx-currency-trading-kit.d.ts.map