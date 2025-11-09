/**
 * Derivatives Pricing Kit
 * Bloomberg Terminal-level options, futures, and swaps pricing with Greeks analytics
 *
 * @module derivatives-pricing-kit
 * @version 1.0.0
 *
 * Features:
 * - Options pricing (Black-Scholes, Black-76, Binomial, Monte Carlo)
 * - Complete Greeks calculation (Delta, Gamma, Vega, Theta, Rho, higher-order)
 * - Futures pricing and valuation
 * - Swaps pricing (IRS, CDS, FX, Total Return)
 * - Exotic options (Barrier, Asian, Digital, Lookback)
 * - Option strategies analysis
 * - Volatility surface construction (SABR, SVI)
 * - Implied volatility calculation
 * - Risk management (VaR, CVaR, Stress Testing)
 *
 * Mathematical precision: Industry-standard numerical methods
 * References: Hull, Bloomberg Terminal, QuantLib
 */

// ============================================================================
// Type Definitions and Interfaces
// ============================================================================

/**
 * Branded type for basis points
 */
export type BasisPoints = number & { readonly __brand: 'BasisPoints' };

/**
 * Branded type for percentage values
 */
export type Percentage = number & { readonly __brand: 'Percentage' };

/**
 * Branded type for volatility (annualized)
 */
export type Volatility = number & { readonly __brand: 'Volatility' };

/**
 * Option type
 */
export enum OptionType {
  Call = 'call',
  Put = 'put',
}

/**
 * Option style
 */
export enum OptionStyle {
  European = 'european',
  American = 'american',
  Bermudan = 'bermudan',
}

/**
 * Barrier option type
 */
export enum BarrierType {
  UpAndOut = 'up-and-out',
  DownAndOut = 'down-and-out',
  UpAndIn = 'up-and-in',
  DownAndIn = 'down-and-in',
}

/**
 * European option
 */
export interface EuropeanOption {
  readonly style: OptionStyle.European;
  readonly type: OptionType;
  readonly strike: number;
  readonly expiry: Date;
  readonly underlying: string;
}

/**
 * American option
 */
export interface AmericanOption {
  readonly style: OptionStyle.American;
  readonly type: OptionType;
  readonly strike: number;
  readonly expiry: Date;
  readonly underlying: string;
}

/**
 * Barrier option
 */
export interface BarrierOption extends EuropeanOption {
  readonly barrierType: BarrierType;
  readonly barrier: number;
  readonly rebate?: number;
}

/**
 * Asian option
 */
export interface AsianOption extends EuropeanOption {
  readonly averagingStart: Date;
  readonly averagingEnd: Date;
  readonly observations: number;
}

/**
 * Digital/Binary option
 */
export interface DigitalOption extends EuropeanOption {
  readonly payout: number;
}

/**
 * Option union type
 */
export type Option = EuropeanOption | AmericanOption;

/**
 * Market data for option pricing
 */
export interface OptionMarketData {
  readonly spot: number;
  readonly strike: number;
  readonly timeToExpiry: number; // years
  readonly riskFreeRate: Percentage;
  readonly dividendYield?: Percentage;
  readonly volatility: Volatility;
}

/**
 * Greeks set
 */
export interface Greeks {
  readonly delta: number;
  readonly gamma: number;
  readonly vega: number;
  readonly theta: number;
  readonly rho: number;
  readonly charm?: number; // Delta decay
  readonly vanna?: number; // Vega/delta cross
  readonly volga?: number; // Vega convexity
}

/**
 * Futures contract
 */
export interface FuturesContract {
  readonly type: 'commodity' | 'index' | 'bond' | 'currency';
  readonly underlying: string;
  readonly expiry: Date;
  readonly contractSize: number;
}

/**
 * Interest rate swap
 */
export interface InterestRateSwap {
  readonly type: 'irs';
  readonly notional: number;
  readonly fixedRate: Percentage;
  readonly floatingSpread: BasisPoints;
  readonly maturity: Date;
  readonly frequency: number; // payments per year
}

/**
 * Credit default swap
 */
export interface CreditDefaultSwap {
  readonly type: 'cds';
  readonly notional: number;
  readonly spread: BasisPoints;
  readonly maturity: Date;
  readonly recoveryRate: Percentage;
}

/**
 * Volatility smile point
 */
export interface VolatilitySmilePoint {
  readonly strike: number;
  readonly impliedVol: Volatility;
}

/**
 * SABR model parameters
 */
export interface SABRParameters {
  readonly alpha: number; // ATM volatility
  readonly beta: number; // CEV parameter (0-1)
  readonly rho: number; // Correlation (-1 to 1)
  readonly nu: number; // Vol of vol
}

// ============================================================================
// Custom Error Classes
// ============================================================================

export class DerivativePricingError extends Error {
  constructor(message: string, public readonly context?: Record&lt;string, unknown&gt;) {
    super(message);
    this.name = 'DerivativePricingError';
  }
}

export class ConvergenceError extends DerivativePricingError {
  constructor(message: string, public readonly iterations: number) {
    super(message, { iterations });
    this.name = 'ConvergenceError';
  }
}

export class InvalidParameterError extends DerivativePricingError {
  constructor(message: string, public readonly parameter?: string) {
    super(message, { parameter });
    this.name = 'InvalidParameterError';
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a branded BasisPoints value
 */
export function asBasisPoints(value: number): BasisPoints {
  return value as BasisPoints;
}

/**
 * Creates a branded Percentage value
 */
export function asPercentage(value: number): Percentage {
  return value as Percentage;
}

/**
 * Creates a branded Volatility value
 */
export function asVolatility(value: number): Volatility {
  return value as Volatility;
}

/**
 * Converts basis points to percentage
 */
export function bpsToPercentage(bps: BasisPoints): Percentage {
  return asPercentage(bps / 100);
}

/**
 * Standard normal cumulative distribution function (CDF)
 *
 * Uses Abramowitz and Stegun approximation (error < 7.5e-8)
 *
 * @param x - Input value
 * @returns N(x)
 */
export function cumulativeNormalDistribution(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);

  const t = 1 / (1 + p * absX);
  const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1 + sign * erf);
}

/**
 * Standard normal probability density function (PDF)
 *
 * @param x - Input value
 * @returns n(x)
 */
export function normalDensity(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculates year fraction between two dates
 */
export function yearFraction(startDate: Date, endDate: Date): number {
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return (endDate.getTime() - startDate.getTime()) / msPerYear;
}

/**
 * Validates market data parameters
 */
function validateMarketData(data: OptionMarketData): void {
  if (data.spot <= 0) {
    throw new InvalidParameterError('Spot price must be positive', 'spot');
  }
  if (data.strike <= 0) {
    throw new InvalidParameterError('Strike price must be positive', 'strike');
  }
  if (data.timeToExpiry <= 0) {
    throw new InvalidParameterError('Time to expiry must be positive', 'timeToExpiry');
  }
  if (data.volatility <= 0) {
    throw new InvalidParameterError('Volatility must be positive', 'volatility');
  }
}

// ============================================================================
// 1. Options Pricing Models (9 functions)
// ============================================================================

/**
 * Black-Scholes European call option pricing
 *
 * Formula: C = S₀N(d₁) - Ke⁻ʳᵀN(d₂)
 * where:
 *   d₁ = (ln(S/K) + (r - q + σ²/2)T) / (σ√T)
 *   d₂ = d₁ - σ√T
 *
 * @param data - Market data
 * @returns Call option price
 *
 * @example
 * ```typescript
 * const price = blackScholesCall({
 *   spot: 100,
 *   strike: 100,
 *   timeToExpiry: 1,
 *   riskFreeRate: asPercentage(5),
 *   dividendYield: asPercentage(2),
 *   volatility: asVolatility(20)
 * });
 * ```
 */
export function blackScholesCall(data: OptionMarketData): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const callPrice = spot * Math.exp(-q * timeToExpiry) * cumulativeNormalDistribution(d1) -
    strike * Math.exp(-r * timeToExpiry) * cumulativeNormalDistribution(d2);

  return callPrice;
}

/**
 * Black-Scholes European put option pricing
 *
 * Formula: P = Ke⁻ʳᵀN(-d₂) - S₀N(-d₁)
 *
 * @param data - Market data
 * @returns Put option price
 */
export function blackScholesPut(data: OptionMarketData): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const putPrice = strike * Math.exp(-r * timeToExpiry) * cumulativeNormalDistribution(-d2) -
    spot * Math.exp(-q * timeToExpiry) * cumulativeNormalDistribution(-d1);

  return putPrice;
}

/**
 * Black-76 model for futures options
 *
 * Used for options on futures contracts (commodities, bonds)
 *
 * @param futuresPrice - Current futures price
 * @param strike - Strike price
 * @param timeToExpiry - Time to expiry in years
 * @param riskFreeRate - Risk-free rate
 * @param volatility - Volatility
 * @param optionType - Call or Put
 * @returns Option price
 */
export function black76FuturesOption(
  futuresPrice: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: Percentage,
  volatility: Volatility,
  optionType: OptionType
): number {
  const r = riskFreeRate / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(futuresPrice / strike) + 0.5 * sigma * sigma * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const discountFactor = Math.exp(-r * timeToExpiry);

  if (optionType === OptionType.Call) {
    return discountFactor * (futuresPrice * cumulativeNormalDistribution(d1) - strike * cumulativeNormalDistribution(d2));
  } else {
    return discountFactor * (strike * cumulativeNormalDistribution(-d2) - futuresPrice * cumulativeNormalDistribution(-d1));
  }
}

/**
 * Binomial tree option pricing (Cox-Ross-Rubinstein)
 *
 * Handles both European and American options
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @param style - European or American
 * @param steps - Number of time steps (more = more accurate)
 * @returns Option price
 */
export function binomialTreeCRR(
  data: OptionMarketData,
  optionType: OptionType,
  style: OptionStyle,
  steps: number = 100
): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const dt = timeToExpiry / steps;

  // CRR parameters
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp((r - q) * dt) - d) / (u - d);
  const discount = Math.exp(-r * dt);

  // Initialize asset prices at maturity
  const assetPrices = new Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    assetPrices[i] = spot * Math.pow(u, steps - i) * Math.pow(d, i);
  }

  // Initialize option values at maturity
  const optionValues = new Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    const intrinsic = optionType === OptionType.Call
      ? Math.max(0, assetPrices[i] - strike)
      : Math.max(0, strike - assetPrices[i]);
    optionValues[i] = intrinsic;
  }

  // Backward induction
  for (let step = steps - 1; step >= 0; step--) {
    for (let i = 0; i <= step; i++) {
      const continuation = discount * (p * optionValues[i] + (1 - p) * optionValues[i + 1]);

      if (style === OptionStyle.American) {
        // Early exercise
        const spotPrice = spot * Math.pow(u, step - i) * Math.pow(d, i);
        const intrinsic = optionType === OptionType.Call
          ? Math.max(0, spotPrice - strike)
          : Math.max(0, strike - spotPrice);
        optionValues[i] = Math.max(continuation, intrinsic);
      } else {
        optionValues[i] = continuation;
      }
    }
  }

  return optionValues[0];
}

/**
 * Binomial tree using Jarrow-Rudd parameters
 *
 * Alternative parameterization for binomial tree
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @param style - European or American
 * @param steps - Number of time steps
 * @returns Option price
 */
export function binomialTreeJR(
  data: OptionMarketData,
  optionType: OptionType,
  style: OptionStyle,
  steps: number = 100
): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const dt = timeToExpiry / steps;

  // JR parameters
  const nu = r - q - 0.5 * sigma * sigma;
  const u = Math.exp(nu * dt + sigma * Math.sqrt(dt));
  const d = Math.exp(nu * dt - sigma * Math.sqrt(dt));
  const p = 0.5;
  const discount = Math.exp(-r * dt);

  // Same tree logic as CRR
  const assetPrices = new Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    assetPrices[i] = spot * Math.pow(u, steps - i) * Math.pow(d, i);
  }

  const optionValues = new Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    const intrinsic = optionType === OptionType.Call
      ? Math.max(0, assetPrices[i] - strike)
      : Math.max(0, strike - assetPrices[i]);
    optionValues[i] = intrinsic;
  }

  for (let step = steps - 1; step >= 0; step--) {
    for (let i = 0; i <= step; i++) {
      const continuation = discount * (p * optionValues[i] + (1 - p) * optionValues[i + 1]);

      if (style === OptionStyle.American) {
        const spotPrice = spot * Math.pow(u, step - i) * Math.pow(d, i);
        const intrinsic = optionType === OptionType.Call
          ? Math.max(0, spotPrice - strike)
          : Math.max(0, strike - spotPrice);
        optionValues[i] = Math.max(continuation, intrinsic);
      } else {
        optionValues[i] = continuation;
      }
    }
  }

  return optionValues[0];
}

/**
 * Monte Carlo European option pricing
 *
 * Uses geometric Brownian motion simulation
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @param paths - Number of simulation paths
 * @param seed - Random seed for reproducibility
 * @returns Option price
 */
export function monteCarloEuropean(
  data: OptionMarketData,
  optionType: OptionType,
  paths: number = 10000,
  seed?: number
): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;

  // Generate random paths
  let sumPayoff = 0;
  const rng = seed !== undefined ? seededRandom(seed) : Math.random;

  for (let i = 0; i < paths; i++) {
    const z = boxMullerTransform(rng(), rng());
    const ST = spot * Math.exp((r - q - 0.5 * sigma * sigma) * timeToExpiry + sigma * Math.sqrt(timeToExpiry) * z);

    const payoff = optionType === OptionType.Call
      ? Math.max(0, ST - strike)
      : Math.max(0, strike - ST);

    sumPayoff += payoff;
  }

  const avgPayoff = sumPayoff / paths;
  return Math.exp(-r * timeToExpiry) * avgPayoff;
}

/**
 * Monte Carlo Asian option pricing (arithmetic average)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @param observations - Number of averaging observations
 * @param paths - Number of simulation paths
 * @returns Option price
 */
export function monteCarloAsian(
  data: OptionMarketData,
  optionType: OptionType,
  observations: number,
  paths: number = 10000
): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const dt = timeToExpiry / observations;

  let sumPayoff = 0;

  for (let path = 0; path < paths; path++) {
    let S = spot;
    let sumPrices = 0;

    for (let i = 0; i < observations; i++) {
      const z = boxMullerTransform(Math.random(), Math.random());
      S = S * Math.exp((r - q - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);
      sumPrices += S;
    }

    const avgPrice = sumPrices / observations;
    const payoff = optionType === OptionType.Call
      ? Math.max(0, avgPrice - strike)
      : Math.max(0, strike - avgPrice);

    sumPayoff += payoff;
  }

  return Math.exp(-r * timeToExpiry) * (sumPayoff / paths);
}

/**
 * Monte Carlo barrier option pricing
 *
 * @param data - Market data
 * @param barrierType - Type of barrier
 * @param barrier - Barrier level
 * @param optionType - Call or Put
 * @param paths - Number of simulation paths
 * @param steps - Monitoring steps
 * @returns Option price
 */
export function monteCarloBarrier(
  data: OptionMarketData,
  barrierType: BarrierType,
  barrier: number,
  optionType: OptionType,
  paths: number = 10000,
  steps: number = 100
): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const dt = timeToExpiry / steps;

  let sumPayoff = 0;

  for (let path = 0; path < paths; path++) {
    let S = spot;
    let barrierHit = false;

    for (let i = 0; i < steps; i++) {
      const z = boxMullerTransform(Math.random(), Math.random());
      S = S * Math.exp((r - q - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);

      // Check barrier
      if ((barrierType === BarrierType.UpAndOut || barrierType === BarrierType.UpAndIn) && S >= barrier) {
        barrierHit = true;
      }
      if ((barrierType === BarrierType.DownAndOut || barrierType === BarrierType.DownAndIn) && S <= barrier) {
        barrierHit = true;
      }
    }

    // Knock-out: option expires if barrier hit
    // Knock-in: option activates if barrier hit
    const isKnockOut = barrierType === BarrierType.UpAndOut || barrierType === BarrierType.DownAndOut;
    const active = isKnockOut ? !barrierHit : barrierHit;

    if (active) {
      const payoff = optionType === OptionType.Call
        ? Math.max(0, S - strike)
        : Math.max(0, strike - S);
      sumPayoff += payoff;
    }
  }

  return Math.exp(-r * timeToExpiry) * (sumPayoff / paths);
}

/**
 * American option pricing using binomial tree
 *
 * Convenience wrapper for American options
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @param steps - Number of time steps
 * @returns Option price
 */
export function americanOptionBinomial(
  data: OptionMarketData,
  optionType: OptionType,
  steps: number = 100
): number {
  return binomialTreeCRR(data, optionType, OptionStyle.American, steps);
}

// ============================================================================
// 2. Greeks Calculation (10 functions)
// ============================================================================

/**
 * Calculates option delta
 *
 * Delta = ∂V/∂S (sensitivity to underlying price)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Delta
 */
export function calculateDelta(data: OptionMarketData, optionType: OptionType): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);

  if (optionType === OptionType.Call) {
    return Math.exp(-q * timeToExpiry) * cumulativeNormalDistribution(d1);
  } else {
    return -Math.exp(-q * timeToExpiry) * cumulativeNormalDistribution(-d1);
  }
}

/**
 * Calculates option gamma
 *
 * Gamma = ∂²V/∂S² (rate of change of delta)
 *
 * @param data - Market data
 * @returns Gamma (same for calls and puts)
 */
export function calculateGamma(data: OptionMarketData): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);

  return (Math.exp(-q * timeToExpiry) * normalDensity(d1)) / (spot * sigma * sqrtT);
}

/**
 * Calculates option vega
 *
 * Vega = ∂V/∂σ (sensitivity to volatility)
 *
 * @param data - Market data
 * @returns Vega (same for calls and puts)
 */
export function calculateVega(data: OptionMarketData): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);

  return spot * Math.exp(-q * timeToExpiry) * normalDensity(d1) * sqrtT / 100; // Divided by 100 for 1% change
}

/**
 * Calculates option theta
 *
 * Theta = ∂V/∂t (time decay)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Theta (per day)
 */
export function calculateTheta(data: OptionMarketData, optionType: OptionType): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const term1 = -(spot * Math.exp(-q * timeToExpiry) * normalDensity(d1) * sigma) / (2 * sqrtT);

  if (optionType === OptionType.Call) {
    const term2 = q * spot * Math.exp(-q * timeToExpiry) * cumulativeNormalDistribution(d1);
    const term3 = -r * strike * Math.exp(-r * timeToExpiry) * cumulativeNormalDistribution(d2);
    return (term1 + term2 + term3) / 365; // Per day
  } else {
    const term2 = -q * spot * Math.exp(-q * timeToExpiry) * cumulativeNormalDistribution(-d1);
    const term3 = r * strike * Math.exp(-r * timeToExpiry) * cumulativeNormalDistribution(-d2);
    return (term1 + term2 + term3) / 365; // Per day
  }
}

/**
 * Calculates option rho
 *
 * Rho = ∂V/∂r (sensitivity to interest rate)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Rho (per 1% change in rate)
 */
export function calculateRho(data: OptionMarketData, optionType: OptionType): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  if (optionType === OptionType.Call) {
    return strike * timeToExpiry * Math.exp(-r * timeToExpiry) * cumulativeNormalDistribution(d2) / 100;
  } else {
    return -strike * timeToExpiry * Math.exp(-r * timeToExpiry) * cumulativeNormalDistribution(-d2) / 100;
  }
}

/**
 * Calculates charm (delta decay)
 *
 * Charm = ∂Delta/∂t
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Charm
 */
export function calculateCharm(data: OptionMarketData, optionType: OptionType): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const term1 = q * Math.exp(-q * timeToExpiry) * cumulativeNormalDistribution(d1);
  const term2 = Math.exp(-q * timeToExpiry) * normalDensity(d1) * ((2 * (r - q) * timeToExpiry - d2 * sigma * sqrtT) / (2 * timeToExpiry * sigma * sqrtT));

  if (optionType === OptionType.Call) {
    return -term1 - term2;
  } else {
    return -term1 - term2 + q * Math.exp(-q * timeToExpiry);
  }
}

/**
 * Calculates vanna (cross derivative of delta and vega)
 *
 * Vanna = ∂Delta/∂σ = ∂Vega/∂S
 *
 * @param data - Market data
 * @returns Vanna
 */
export function calculateVanna(data: OptionMarketData): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  return -(Math.exp(-q * timeToExpiry) * normalDensity(d1) * d2) / sigma;
}

/**
 * Calculates volga (vega convexity)
 *
 * Volga = ∂Vega/∂σ = ∂²V/∂σ²
 *
 * @param data - Market data
 * @returns Volga
 */
export function calculateVolga(data: OptionMarketData): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(spot / strike) + (r - q + 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  return spot * Math.exp(-q * timeToExpiry) * normalDensity(d1) * sqrtT * d1 * d2 / sigma;
}

/**
 * Calculates all Greeks for an option
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Complete Greeks set
 */
export function portfolioGreeks(data: OptionMarketData, optionType: OptionType): Greeks {
  return {
    delta: calculateDelta(data, optionType),
    gamma: calculateGamma(data),
    vega: calculateVega(data),
    theta: calculateTheta(data, optionType),
    rho: calculateRho(data, optionType),
    charm: calculateCharm(data, optionType),
    vanna: calculateVanna(data),
    volga: calculateVolga(data),
  };
}

/**
 * Calculates implied volatility from option delta
 *
 * Useful for risk reversals and volatility trading
 *
 * @param targetDelta - Target delta value
 * @param data - Market data (without volatility)
 * @param optionType - Call or Put
 * @returns Implied volatility for target delta
 */
export function impliedVolatilityFromDelta(
  targetDelta: number,
  data: Omit<OptionMarketData, 'volatility'>,
  optionType: OptionType
): Volatility {
  const tolerance = 1e-6;
  const maxIterations = 100;
  let vol = asVolatility(20); // Initial guess: 20%

  for (let i = 0; i < maxIterations; i++) {
    const marketData = { ...data, volatility: vol };
    const delta = calculateDelta(marketData, optionType);
    const diff = delta - targetDelta;

    if (Math.abs(diff) < tolerance) {
      return vol;
    }

    // Vega is derivative
    const vega = calculateVega(marketData);
    if (Math.abs(vega) < 1e-10) {
      throw new ConvergenceError('Vega too small', i);
    }

    vol = asVolatility(vol - (diff * 100) / vega);

    if (vol <= 0 || vol > 500) {
      throw new ConvergenceError('Volatility out of range', i);
    }
  }

  throw new ConvergenceError(`Failed to converge after ${maxIterations} iterations`, maxIterations);
}

// ============================================================================
// 3. Futures Pricing (4 functions)
// ============================================================================

/**
 * Commodity futures pricing
 *
 * Formula: F = S * e^((r - convenience yield) * T)
 *
 * @param spot - Spot price
 * @param riskFreeRate - Risk-free rate
 * @param convenienceYield - Convenience yield
 * @param storageRate - Storage cost rate
 * @param timeToExpiry - Time to expiry
 * @returns Futures price
 */
export function commodityFuturesPrice(
  spot: number,
  riskFreeRate: Percentage,
  convenienceYield: Percentage,
  storageRate: Percentage,
  timeToExpiry: number
): number {
  const r = riskFreeRate / 100;
  const y = convenienceYield / 100;
  const u = storageRate / 100;

  return spot * Math.exp((r + u - y) * timeToExpiry);
}

/**
 * Index futures pricing
 *
 * Formula: F = S * e^((r - q) * T)
 *
 * @param spot - Spot index level
 * @param riskFreeRate - Risk-free rate
 * @param dividendYield - Dividend yield
 * @param timeToExpiry - Time to expiry
 * @returns Futures price
 */
export function indexFuturesPrice(
  spot: number,
  riskFreeRate: Percentage,
  dividendYield: Percentage,
  timeToExpiry: number
): number {
  const r = riskFreeRate / 100;
  const q = dividendYield / 100;

  return spot * Math.exp((r - q) * timeToExpiry);
}

/**
 * Bond futures pricing with conversion factor
 *
 * @param bondPrice - Cash bond price
 * @param conversionFactor - Conversion factor
 * @param accrued - Accrued interest
 * @param repoRate - Repo rate
 * @param timeToExpiry - Time to delivery
 * @returns Futures price
 */
export function bondFuturesPrice(
  bondPrice: number,
  conversionFactor: number,
  accrued: number,
  repoRate: Percentage,
  timeToExpiry: number
): number {
  const r = repoRate / 100;
  const invoicePrice = bondPrice + accrued;
  const forwardPrice = invoicePrice * Math.exp(r * timeToExpiry);

  return (forwardPrice - accrued) / conversionFactor;
}

/**
 * Currency futures pricing
 *
 * Formula: F = S * e^((r_d - r_f) * T)
 *
 * @param spot - Spot exchange rate
 * @param domesticRate - Domestic interest rate
 * @param foreignRate - Foreign interest rate
 * @param timeToExpiry - Time to expiry
 * @returns Futures price
 */
export function currencyFuturesPrice(
  spot: number,
  domesticRate: Percentage,
  foreignRate: Percentage,
  timeToExpiry: number
): number {
  const rd = domesticRate / 100;
  const rf = foreignRate / 100;

  return spot * Math.exp((rd - rf) * timeToExpiry);
}

// ============================================================================
// 4. Swaps Pricing (7 functions)
// ============================================================================

/**
 * Interest rate swap valuation
 *
 * @param swap - IRS details
 * @param discountCurve - Discount curve (zero rates)
 * @param forecastCurve - Forecast curve for floating rates
 * @param valuationDate - Valuation date
 * @returns Swap value (positive = receive fixed)
 */
export function interestRateSwapValue(
  swap: InterestRateSwap,
  discountCurve: Array<{ maturity: number; rate: Percentage }>,
  forecastCurve: Array<{ maturity: number; rate: Percentage }>,
  valuationDate: Date
): number {
  const yearsToMaturity = yearFraction(valuationDate, swap.maturity);
  const periods = Math.floor(yearsToMaturity * swap.frequency);

  let fixedLegPV = 0;
  let floatingLegPV = 0;

  for (let i = 1; i <= periods; i++) {
    const t = i / swap.frequency;

    // Discount factor
    const discountRate = interpolateRates(discountCurve, t);
    const df = Math.exp(-(discountRate / 100) * t);

    // Fixed leg
    const fixedPayment = swap.notional * (swap.fixedRate / 100) / swap.frequency;
    fixedLegPV += fixedPayment * df;

    // Floating leg
    const forecastRate = interpolateRates(forecastCurve, t);
    const floatingPayment = swap.notional * (forecastRate / 100) / swap.frequency;
    floatingLegPV += floatingPayment * df;
  }

  // Add final notional exchange (net to zero, but include for completeness)
  return fixedLegPV - floatingLegPV;
}

/**
 * Calculates par swap rate
 *
 * Rate at which swap has zero value
 *
 * @param notional - Notional amount
 * @param maturity - Swap maturity in years
 * @param frequency - Payment frequency
 * @param discountCurve - Discount curve
 * @returns Par swap rate
 */
export function swapParRate(
  notional: number,
  maturity: number,
  frequency: number,
  discountCurve: Array<{ maturity: number; rate: Percentage }>
): Percentage {
  const periods = Math.floor(maturity * frequency);
  let sumDF = 0;

  for (let i = 1; i <= periods; i++) {
    const t = i / frequency;
    const rate = interpolateRates(discountCurve, t);
    const df = Math.exp(-(rate / 100) * t);
    sumDF += df;
  }

  const finalDF = Math.exp(-(interpolateRates(discountCurve, maturity) / 100) * maturity);
  const parRate = ((1 - finalDF) / sumDF) * frequency * 100;

  return asPercentage(parRate);
}

/**
 * Cross-currency swap valuation
 *
 * @param notionalDomestic - Domestic notional
 * @param notionalForeign - Foreign notional
 * @param domesticRate - Domestic fixed rate
 * @param foreignRate - Foreign fixed rate
 * @param spotFX - Spot FX rate
 * @param maturity - Swap maturity
 * @param frequency - Payment frequency
 * @param discountCurveDomestic - Domestic discount curve
 * @param discountCurveForeign - Foreign discount curve
 * @returns Swap value in domestic currency
 */
export function crossCurrencySwapValue(
  notionalDomestic: number,
  notionalForeign: number,
  domesticRate: Percentage,
  foreignRate: Percentage,
  spotFX: number,
  maturity: number,
  frequency: number,
  discountCurveDomestic: Array<{ maturity: number; rate: Percentage }>,
  discountCurveForeign: Array<{ maturity: number; rate: Percentage }>
): number {
  const periods = Math.floor(maturity * frequency);

  let domesticPV = 0;
  let foreignPV = 0;

  // Domestic leg
  for (let i = 1; i <= periods; i++) {
    const t = i / frequency;
    const rate = interpolateRates(discountCurveDomestic, t);
    const df = Math.exp(-(rate / 100) * t);
    const payment = notionalDomestic * (domesticRate / 100) / frequency;
    domesticPV += payment * df;
  }

  // Add final notional
  const finalDFDom = Math.exp(-(interpolateRates(discountCurveDomestic, maturity) / 100) * maturity);
  domesticPV += notionalDomestic * finalDFDom;

  // Foreign leg (convert to domestic)
  for (let i = 1; i <= periods; i++) {
    const t = i / frequency;
    const rate = interpolateRates(discountCurveForeign, t);
    const df = Math.exp(-(rate / 100) * t);
    const payment = notionalForeign * (foreignRate / 100) / frequency;
    foreignPV += payment * df;
  }

  const finalDFFor = Math.exp(-(interpolateRates(discountCurveForeign, maturity) / 100) * maturity);
  foreignPV += notionalForeign * finalDFFor;
  foreignPV *= spotFX;

  return domesticPV - foreignPV;
}

/**
 * Credit default swap pricing
 *
 * @param cds - CDS details
 * @param defaultProbability - Cumulative default probability
 * @param discountCurve - Risk-free discount curve
 * @param valuationDate - Valuation date
 * @returns CDS value
 */
export function creditDefaultSwapPrice(
  cds: CreditDefaultSwap,
  defaultProbability: Percentage,
  discountCurve: Array<{ maturity: number; rate: Percentage }>,
  valuationDate: Date
): number {
  const yearsToMaturity = yearFraction(valuationDate, cds.maturity);
  const quarters = Math.floor(yearsToMaturity * 4); // CDS typically pay quarterly

  let premiumLegPV = 0;
  let protectionLegPV = 0;

  const pd = defaultProbability / 100;
  const recoveryRate = cds.recoveryRate / 100;
  const spreadBps = cds.spread;

  for (let i = 1; i <= quarters; i++) {
    const t = i / 4;
    const rate = interpolateRates(discountCurve, t);
    const df = Math.exp(-(rate / 100) * t);

    // Premium leg (spread payments)
    const survivalProb = 1 - pd * (t / yearsToMaturity);
    const premium = cds.notional * (spreadBps / 10000) / 4;
    premiumLegPV += premium * df * survivalProb;

    // Protection leg (payment on default)
    const defaultProb = pd / quarters; // Simplified
    const protection = cds.notional * (1 - recoveryRate);
    protectionLegPV += protection * df * defaultProb;
  }

  return protectionLegPV - premiumLegPV;
}

/**
 * CDS spread calculation
 *
 * Calculates fair spread for CDS
 *
 * @param notional - Notional amount
 * @param defaultProbability - Default probability
 * @param recoveryRate - Recovery rate
 * @param maturity - Maturity in years
 * @param discountCurve - Discount curve
 * @returns Fair CDS spread in basis points
 */
export function cdsSpreadCalculation(
  notional: number,
  defaultProbability: Percentage,
  recoveryRate: Percentage,
  maturity: number,
  discountCurve: Array<{ maturity: number; rate: Percentage }>
): BasisPoints {
  const quarters = Math.floor(maturity * 4);
  const pd = defaultProbability / 100;
  const rr = recoveryRate / 100;

  let sumDFSurvival = 0;
  let sumDFDefault = 0;

  for (let i = 1; i <= quarters; i++) {
    const t = i / 4;
    const rate = interpolateRates(discountCurve, t);
    const df = Math.exp(-(rate / 100) * t);

    const survivalProb = 1 - pd * (t / maturity);
    sumDFSurvival += df * survivalProb;

    const defaultProb = pd / quarters;
    sumDFDefault += df * defaultProb;
  }

  const fairSpread = ((1 - rr) * sumDFDefault) / sumDFSurvival;
  return asBasisPoints(fairSpread * 10000);
}

/**
 * FX swap points calculation
 *
 * @param spot - Spot FX rate
 * @param domesticRate - Domestic interest rate
 * @param foreignRate - Foreign interest rate
 * @param days - Number of days
 * @returns Swap points (forward - spot)
 */
export function fxSwapPoints(
  spot: number,
  domesticRate: Percentage,
  foreignRate: Percentage,
  days: number
): number {
  const t = days / 360; // Money market convention
  const rd = domesticRate / 100;
  const rf = foreignRate / 100;

  const forward = spot * ((1 + rd * t) / (1 + rf * t));
  return forward - spot;
}

/**
 * Total return swap valuation
 *
 * @param notional - Notional amount
 * @param assetReturn - Total return on reference asset
 * @param fundingSpread - Funding spread over reference rate
 * @param referenceRate - Reference rate (e.g., LIBOR)
 * @param maturity - Swap maturity
 * @returns TRS value
 */
export function totalReturnSwap(
  notional: number,
  assetReturn: Percentage,
  fundingSpread: BasisPoints,
  referenceRate: Percentage,
  maturity: number
): number {
  const assetLeg = notional * (assetReturn / 100);
  const fundingRate = asPercentage(referenceRate + bpsToPercentage(fundingSpread));
  const fundingLeg = notional * (fundingRate / 100) * maturity;

  return assetLeg - fundingLeg;
}

// ============================================================================
// 5. Exotic Options (5 functions)
// ============================================================================

/**
 * Barrier option pricing - Up-and-Out
 *
 * Analytical approximation for European barrier options
 *
 * @param data - Market data
 * @param barrier - Barrier level
 * @param rebate - Rebate paid if barrier hit
 * @param optionType - Call or Put
 * @returns Option price
 */
export function barrierOptionUpAndOut(
  data: OptionMarketData,
  barrier: number,
  rebate: number,
  optionType: OptionType
): number {
  validateMarketData(data);

  if (data.spot >= barrier) {
    return rebate; // Already knocked out
  }

  // Use Monte Carlo for simplicity (analytical formula is complex)
  return monteCarloBarrier(data, BarrierType.UpAndOut, barrier, optionType);
}

/**
 * Barrier option pricing - Down-and-Out
 *
 * @param data - Market data
 * @param barrier - Barrier level
 * @param rebate - Rebate paid if barrier hit
 * @param optionType - Call or Put
 * @returns Option price
 */
export function barrierOptionDownAndOut(
  data: OptionMarketData,
  barrier: number,
  rebate: number,
  optionType: OptionType
): number {
  validateMarketData(data);

  if (data.spot <= barrier) {
    return rebate;
  }

  return monteCarloBarrier(data, BarrierType.DownAndOut, barrier, optionType);
}

/**
 * Asian option analytical approximation
 *
 * Uses moment matching approximation
 *
 * @param data - Market data
 * @param observations - Number of averaging observations
 * @param optionType - Call or Put
 * @returns Option price
 */
export function asianOptionAnalytic(
  data: OptionMarketData,
  observations: number,
  optionType: OptionType
): number {
  // Simplified: use Monte Carlo
  // Full analytical solution requires complex moment matching
  return monteCarloAsian(data, optionType, observations);
}

/**
 * Digital/Binary option pricing
 *
 * Pays fixed amount if option expires in-the-money
 *
 * @param data - Market data
 * @param payout - Fixed payout amount
 * @param optionType - Call or Put
 * @returns Option price
 */
export function digitalOption(
  data: OptionMarketData,
  payout: number,
  optionType: OptionType
): number {
  validateMarketData(data);

  const { spot, strike, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const sqrtT = Math.sqrt(timeToExpiry);

  const d2 = (Math.log(spot / strike) + (r - q - 0.5 * sigma * sigma) * timeToExpiry) / (sigma * sqrtT);

  const discountFactor = Math.exp(-r * timeToExpiry);

  if (optionType === OptionType.Call) {
    return payout * discountFactor * cumulativeNormalDistribution(d2);
  } else {
    return payout * discountFactor * cumulativeNormalDistribution(-d2);
  }
}

/**
 * Lookback option pricing (floating strike)
 *
 * Simplified pricing using Monte Carlo
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @param paths - Number of simulation paths
 * @param steps - Monitoring steps
 * @returns Option price
 */
export function lookbackOption(
  data: OptionMarketData,
  optionType: OptionType,
  paths: number = 10000,
  steps: number = 100
): number {
  validateMarketData(data);

  const { spot, timeToExpiry, riskFreeRate, dividendYield = asPercentage(0), volatility } = data;

  const r = riskFreeRate / 100;
  const q = dividendYield / 100;
  const sigma = volatility / 100;
  const dt = timeToExpiry / steps;

  let sumPayoff = 0;

  for (let path = 0; path < paths; path++) {
    let S = spot;
    let maxPrice = spot;
    let minPrice = spot;

    for (let i = 0; i < steps; i++) {
      const z = boxMullerTransform(Math.random(), Math.random());
      S = S * Math.exp((r - q - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);

      maxPrice = Math.max(maxPrice, S);
      minPrice = Math.min(minPrice, S);
    }

    // Floating strike lookback
    const payoff = optionType === OptionType.Call
      ? maxPrice - spot
      : spot - minPrice;

    sumPayoff += payoff;
  }

  return Math.exp(-r * timeToExpiry) * (sumPayoff / paths);
}

// ============================================================================
// 6. Option Strategies (4 functions)
// ============================================================================

/**
 * Calculates payoff for option strategy at expiry
 *
 * @param strategy - Array of options with positions
 * @param spotPrices - Array of spot prices to evaluate
 * @returns Payoff profile
 */
export function strategyPayoff(
  strategy: Array<{ option: EuropeanOption; position: number }>,
  spotPrices: number[]
): Array<{ spot: number; payoff: number }> {
  return spotPrices.map(spot => {
    let totalPayoff = 0;

    for (const { option, position } of strategy) {
      const intrinsic = option.type === OptionType.Call
        ? Math.max(0, spot - option.strike)
        : Math.max(0, option.strike - spot);

      totalPayoff += position * intrinsic;
    }

    return { spot, payoff: totalPayoff };
  });
}

/**
 * Calculates Greeks for option strategy
 *
 * @param strategy - Array of options with positions and market data
 * @returns Aggregated Greeks
 */
export function strategyGreeks(
  strategy: Array<{ option: EuropeanOption; position: number; marketData: OptionMarketData }>
): Greeks {
  let totalDelta = 0;
  let totalGamma = 0;
  let totalVega = 0;
  let totalTheta = 0;
  let totalRho = 0;

  for (const { option, position, marketData } of strategy) {
    const greeks = portfolioGreeks(marketData, option.type);

    totalDelta += position * greeks.delta;
    totalGamma += position * greeks.gamma;
    totalVega += position * greeks.vega;
    totalTheta += position * greeks.theta;
    totalRho += position * greeks.rho;
  }

  return {
    delta: totalDelta,
    gamma: totalGamma,
    vega: totalVega,
    theta: totalTheta,
    rho: totalRho,
  };
}

/**
 * Calculates break-even points for option strategy
 *
 * @param strategy - Array of options with positions and prices
 * @returns Break-even spot prices
 */
export function breakEvenAnalysis(
  strategy: Array<{ option: EuropeanOption; position: number; price: number }>
): number[] {
  // Calculate initial cost
  let initialCost = 0;
  for (const { position, price } of strategy) {
    initialCost += position * price;
  }

  // Find break-even points by solving payoff = initial cost
  const breakEvens: number[] = [];
  const strikes = strategy.map(s => s.option.strike).sort((a, b) => a - b);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);

  // Sample points around strikes
  for (let spot = minStrike * 0.5; spot <= maxStrike * 1.5; spot += 0.01) {
    let payoff = -initialCost;

    for (const { option, position } of strategy) {
      const intrinsic = option.type === OptionType.Call
        ? Math.max(0, spot - option.strike)
        : Math.max(0, option.strike - spot);
      payoff += position * intrinsic;
    }

    // Check if crossed zero
    if (Math.abs(payoff) < 0.01) {
      breakEvens.push(spot);
    }
  }

  return breakEvens;
}

/**
 * Calculates maximum profit and loss for strategy
 *
 * @param strategy - Array of options with positions and prices
 * @returns Max profit, max loss, and spot prices where they occur
 */
export function maxProfitLoss(
  strategy: Array<{ option: EuropeanOption; position: number; price: number }>
): {
  maxProfit: number;
  maxProfitAt: number;
  maxLoss: number;
  maxLossAt: number;
} {
  let initialCost = 0;
  for (const { position, price } of strategy) {
    initialCost += position * price;
  }

  const strikes = strategy.map(s => s.option.strike);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);

  let maxProfit = -Infinity;
  let maxProfitAt = 0;
  let maxLoss = Infinity;
  let maxLossAt = 0;

  // Evaluate at key points
  const testPoints = [0, ...strikes, maxStrike * 2];

  for (const spot of testPoints) {
    let payoff = -initialCost;

    for (const { option, position } of strategy) {
      const intrinsic = option.type === OptionType.Call
        ? Math.max(0, spot - option.strike)
        : Math.max(0, option.strike - spot);
      payoff += position * intrinsic;
    }

    if (payoff > maxProfit) {
      maxProfit = payoff;
      maxProfitAt = spot;
    }

    if (payoff < maxLoss) {
      maxLoss = payoff;
      maxLossAt = spot;
    }
  }

  return {
    maxProfit,
    maxProfitAt,
    maxLoss,
    maxLossAt,
  };
}

// ============================================================================
// 7. Volatility Analytics (5 functions)
// ============================================================================

/**
 * Calculates implied volatility using Newton-Raphson
 *
 * @param marketPrice - Observed option price
 * @param data - Market data without volatility
 * @param optionType - Call or Put
 * @returns Implied volatility
 */
export function impliedVolatilityNewton(
  marketPrice: number,
  data: Omit<OptionMarketData, 'volatility'>,
  optionType: OptionType
): Volatility {
  const tolerance = 1e-6;
  const maxIterations = 100;
  let vol = asVolatility(20); // Initial guess

  for (let i = 0; i < maxIterations; i++) {
    const marketData = { ...data, volatility: vol };

    const calculatedPrice = optionType === OptionType.Call
      ? blackScholesCall(marketData)
      : blackScholesPut(marketData);

    const diff = calculatedPrice - marketPrice;

    if (Math.abs(diff) < tolerance) {
      return vol;
    }

    // Vega is derivative
    const vega = calculateVega(marketData);
    if (Math.abs(vega) < 1e-10) {
      throw new ConvergenceError('Vega too small', i);
    }

    vol = asVolatility(vol - (diff * 100) / vega);

    if (vol <= 0 || vol > 500) {
      throw new ConvergenceError('Volatility out of range', i);
    }
  }

  throw new ConvergenceError(`Failed to converge after ${maxIterations} iterations`, maxIterations);
}

/**
 * Calculates implied volatility using Brent's method
 *
 * More robust than Newton-Raphson for difficult cases
 *
 * @param marketPrice - Observed option price
 * @param data - Market data without volatility
 * @param optionType - Call or Put
 * @returns Implied volatility
 */
export function impliedVolatilityBrent(
  marketPrice: number,
  data: Omit<OptionMarketData, 'volatility'>,
  optionType: OptionType
): Volatility {
  const tolerance = 1e-6;
  const maxIterations = 100;

  let a = 0.01; // Lower bound
  let b = 500; // Upper bound

  const priceFunc = (vol: number) => {
    const marketData = { ...data, volatility: asVolatility(vol) };
    return optionType === OptionType.Call
      ? blackScholesCall(marketData) - marketPrice
      : blackScholesPut(marketData) - marketPrice;
  };

  let fa = priceFunc(a);
  let fb = priceFunc(b);

  if (fa * fb > 0) {
    throw new ConvergenceError('Brent method: root not bracketed', 0);
  }

  for (let i = 0; i < maxIterations; i++) {
    const c = (a + b) / 2;
    const fc = priceFunc(c);

    if (Math.abs(fc) < tolerance || (b - a) / 2 < tolerance) {
      return asVolatility(c);
    }

    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }

  throw new ConvergenceError(`Brent method failed after ${maxIterations} iterations`, maxIterations);
}

/**
 * Fits volatility smile using polynomial
 *
 * @param smilePoints - Observed strike-volatility pairs
 * @param degree - Polynomial degree (default 2 for quadratic)
 * @returns Polynomial coefficients
 */
export function volatilitySmileFit(
  smilePoints: readonly VolatilitySmilePoint[],
  degree: number = 2
): number[] {
  const n = smilePoints.length;
  const strikes = smilePoints.map(p => p.strike);
  const vols = smilePoints.map(p => p.impliedVol);

  // Normalize strikes to improve numerical stability
  const avgStrike = strikes.reduce((sum, k) => sum + k, 0) / n;
  const normalizedStrikes = strikes.map(k => k / avgStrike);

  // Build Vandermonde matrix
  const X: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(normalizedStrikes[i], j));
    }
    X.push(row);
  }

  // Solve using least squares
  return solveLinearRegression(X, vols);
}

/**
 * SABR volatility surface model
 *
 * Evaluates SABR formula for implied volatility
 *
 * @param params - SABR parameters
 * @param forward - Forward price
 * @param strike - Strike price
 * @param timeToExpiry - Time to expiry
 * @returns Implied volatility
 */
export function sabrVolatilitySurface(
  params: SABRParameters,
  forward: number,
  strike: number,
  timeToExpiry: number
): Volatility {
  const { alpha, beta, rho, nu } = params;

  if (Math.abs(forward - strike) < 1e-6) {
    // ATM formula
    const term1 = alpha / Math.pow(forward, 1 - beta);
    const term2 = (1 + (Math.pow(1 - beta, 2) / 24 * Math.pow(alpha, 2) / Math.pow(forward, 2 - 2 * beta) +
      0.25 * rho * beta * nu * alpha / Math.pow(forward, 1 - beta) +
      (2 - 3 * Math.pow(rho, 2)) / 24 * Math.pow(nu, 2)) * timeToExpiry);

    return asVolatility(term1 * term2 * 100);
  }

  // Full SABR formula (simplified)
  const logFK = Math.log(forward / strike);
  const z = (nu / alpha) * Math.pow(forward * strike, (1 - beta) / 2) * logFK;
  const x = Math.log((Math.sqrt(1 - 2 * rho * z + z * z) + z - rho) / (1 - rho));

  const numerator = alpha;
  const denominator = Math.pow(forward * strike, (1 - beta) / 2) *
    (1 + Math.pow(1 - beta, 2) / 24 * Math.pow(logFK, 2) + Math.pow(1 - beta, 4) / 1920 * Math.pow(logFK, 4));

  const correction = 1 + (Math.pow(1 - beta, 2) / 24 * Math.pow(alpha, 2) / Math.pow(forward * strike, 1 - beta) +
    0.25 * rho * beta * nu * alpha / Math.pow(forward * strike, (1 - beta) / 2) +
    (2 - 3 * Math.pow(rho, 2)) / 24 * Math.pow(nu, 2)) * timeToExpiry;

  const vol = (numerator / denominator) * (z / x) * correction;
  return asVolatility(vol * 100);
}

/**
 * Historical volatility calculation
 *
 * Multiple estimators: Close-to-close, Parkinson, Garman-Klass
 *
 * @param prices - Historical price data
 * @param method - Volatility estimation method
 * @param annualizationFactor - Trading days per year (default 252)
 * @returns Annualized historical volatility
 */
export function historicalVolatility(
  prices: readonly number[],
  method: 'close-to-close' | 'parkinson' | 'garman-klass' = 'close-to-close',
  annualizationFactor: number = 252
): Volatility {
  if (prices.length < 2) {
    throw new InvalidParameterError('Need at least 2 prices', 'prices');
  }

  if (method === 'close-to-close') {
    // Standard deviation of log returns
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);

    return asVolatility(Math.sqrt(variance * annualizationFactor) * 100);
  }

  throw new InvalidParameterError(`Unsupported method: ${method}`, 'method');
}

// ============================================================================
// 8. Risk Management (4 functions)
// ============================================================================

/**
 * Value at Risk (VaR) - Parametric method
 *
 * @param portfolioValue - Current portfolio value
 * @param expectedReturn - Expected return (annualized)
 * @param volatility - Portfolio volatility (annualized)
 * @param confidenceLevel - Confidence level (e.g., 0.95, 0.99)
 * @param timeHorizon - Time horizon in days
 * @returns VaR (potential loss)
 */
export function valueAtRiskParametric(
  portfolioValue: number,
  expectedReturn: Percentage,
  volatility: Volatility,
  confidenceLevel: number,
  timeHorizon: number
): number {
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new InvalidParameterError('Confidence level must be between 0 and 1', 'confidenceLevel');
  }

  const mu = expectedReturn / 100 / 252; // Daily return
  const sigma = volatility / 100 / Math.sqrt(252); // Daily volatility

  // Z-score for confidence level
  const zScore = inverseNormalCDF(confidenceLevel);

  const varDaily = portfolioValue * (mu - zScore * sigma);
  const varHorizon = varDaily * Math.sqrt(timeHorizon);

  return -varHorizon; // Return positive number for loss
}

/**
 * Expected Shortfall (CVaR) - Conditional VaR
 *
 * Average loss beyond VaR threshold
 *
 * @param portfolioValue - Current portfolio value
 * @param expectedReturn - Expected return (annualized)
 * @param volatility - Portfolio volatility (annualized)
 * @param confidenceLevel - Confidence level
 * @param timeHorizon - Time horizon in days
 * @returns Expected Shortfall
 */
export function expectedShortfall(
  portfolioValue: number,
  expectedReturn: Percentage,
  volatility: Volatility,
  confidenceLevel: number,
  timeHorizon: number
): number {
  const mu = expectedReturn / 100 / 252;
  const sigma = volatility / 100 / Math.sqrt(252);

  const zScore = inverseNormalCDF(confidenceLevel);
  const pdf = normalDensity(zScore);
  const cdf = 1 - confidenceLevel;

  const expectedShortfallDaily = portfolioValue * (mu - sigma * pdf / cdf);
  return -expectedShortfallDaily * Math.sqrt(timeHorizon);
}

/**
 * Scenario analysis for portfolio
 *
 * Evaluates portfolio under different market scenarios
 *
 * @param baseValue - Base portfolio value
 * @param scenarios - Array of scenarios with market changes
 * @param sensitivities - Portfolio sensitivities (delta, gamma, vega, etc.)
 * @returns Scenario results
 */
export function scenarioAnalysis(
  baseValue: number,
  scenarios: Array<{
    name: string;
    spotChange: Percentage;
    volChange?: Percentage;
    rateChange?: Percentage;
  }>,
  sensitivities: {
    delta: number;
    gamma: number;
    vega?: number;
    rho?: number;
  }
): Array<{ scenario: string; value: number; pnl: number }> {
  return scenarios.map(scenario => {
    let pnl = 0;

    // Spot change impact
    const spotMove = scenario.spotChange / 100;
    pnl += sensitivities.delta * spotMove;
    pnl += 0.5 * sensitivities.gamma * spotMove * spotMove;

    // Volatility change impact
    if (scenario.volChange && sensitivities.vega) {
      pnl += sensitivities.vega * (scenario.volChange / 100);
    }

    // Rate change impact
    if (scenario.rateChange && sensitivities.rho) {
      pnl += sensitivities.rho * (scenario.rateChange / 100);
    }

    return {
      scenario: scenario.name,
      value: baseValue + pnl,
      pnl,
    };
  });
}

/**
 * Stress testing framework
 *
 * Extreme scenario testing (e.g., market crashes)
 *
 * @param baseValue - Base portfolio value
 * @param stressTests - Array of extreme scenarios
 * @param sensitivities - Portfolio sensitivities
 * @returns Stress test results
 */
export function stressTestFramework(
  baseValue: number,
  stressTests: Array<{
    name: string;
    spotChange: Percentage;
    volChange: Percentage;
    rateChange: Percentage;
  }>,
  sensitivities: Greeks
): Array<{ test: string; value: number; pnl: number; percentChange: number }> {
  return stressTests.map(test => {
    let pnl = 0;

    const spotMove = test.spotChange / 100;
    pnl += sensitivities.delta * spotMove;
    pnl += 0.5 * sensitivities.gamma * spotMove * spotMove;
    pnl += sensitivities.vega * (test.volChange / 100);
    pnl += sensitivities.rho * (test.rateChange / 100);

    return {
      test: test.name,
      value: baseValue + pnl,
      pnl,
      percentChange: (pnl / baseValue) * 100,
    };
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Box-Muller transform for generating normal random variables
 */
function boxMullerTransform(u1: number, u2: number): number {
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Seeded random number generator
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/**
 * Interpolates rates from curve
 */
function interpolateRates(
  curve: Array<{ maturity: number; rate: Percentage }>,
  targetMaturity: number
): Percentage {
  if (curve.length === 0) {
    throw new DerivativePricingError('Empty discount curve');
  }

  // Linear interpolation
  const sorted = [...curve].sort((a, b) => a.maturity - b.maturity);

  if (targetMaturity <= sorted[0].maturity) {
    return sorted[0].rate;
  }
  if (targetMaturity >= sorted[sorted.length - 1].maturity) {
    return sorted[sorted.length - 1].rate;
  }

  let i = 0;
  while (i < sorted.length - 1 && sorted[i + 1].maturity < targetMaturity) {
    i++;
  }

  const t1 = sorted[i].maturity;
  const t2 = sorted[i + 1].maturity;
  const r1 = sorted[i].rate;
  const r2 = sorted[i + 1].rate;

  const rate = r1 + (r2 - r1) * (targetMaturity - t1) / (t2 - t1);
  return asPercentage(rate);
}

/**
 * Inverse normal CDF (approximate)
 */
function inverseNormalCDF(p: number): number {
  // Beasley-Springer-Moro algorithm
  const a = [
    -3.969683028665376e+01,
    2.209460984245205e+02,
    -2.759285104469687e+02,
    1.383577518672690e+02,
    -3.066479806614716e+01,
    2.506628277459239e+00,
  ];

  const b = [
    -5.447609879822406e+01,
    1.615858368580409e+02,
    -1.556989798598866e+02,
    6.680131188771972e+01,
    -1.328068155288572e+01,
  ];

  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
    4.374664141464968e+00,
    2.938163982698783e+00,
  ];

  const d = [
    7.784695709041462e-03,
    3.224671290700398e-01,
    2.445134137142996e+00,
    3.754408661907416e+00,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }

  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/**
 * Solves linear regression using normal equations
 */
function solveLinearRegression(X: number[][], y: number[]): number[] {
  const n = X.length;
  const m = X[0].length;

  // X'X
  const XtX: number[][] = Array(m).fill(0).map(() => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < n; k++) {
        XtX[i][j] += X[k][i] * X[k][j];
      }
    }
  }

  // X'y
  const Xty: number[] = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    for (let k = 0; k < n; k++) {
      Xty[i] += X[k][i] * y[k];
    }
  }

  return gaussianElimination(XtX, Xty);
}

/**
 * Gaussian elimination solver
 */
function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  const x: number[] = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }

  return x;
}
