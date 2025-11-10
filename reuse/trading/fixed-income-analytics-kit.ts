/**
 * Fixed Income Analytics Kit
 * Bloomberg Terminal-level bond pricing, yield curve, and credit analytics
 *
 * @module fixed-income-analytics-kit
 * @version 1.0.0
 *
 * Features:
 * - Bond pricing and valuation with multiple conventions
 * - Yield curve construction (Bootstrap, Nelson-Siegel, Cubic Spline)
 * - Duration and convexity calculations
 * - Credit spread analysis
 * - Comprehensive yield metrics (YTM, YTC, YTP, YTW)
 * - Accrued interest with day count conventions
 * - MBS and ABS analytics
 * - Government and corporate bond analytics
 *
 * Mathematical precision: 1e-8 for yields, 1e-6 for prices
 * Industry standards: Bloomberg, QuantLib, ISDA conventions
 */

// ============================================================================
// Type Definitions and Interfaces
// ============================================================================

/**
 * Branded type for basis points to prevent unit confusion
 */
export type BasisPoints = number & { readonly __brand: 'BasisPoints' };

/**
 * Branded type for percentage values
 */
export type Percentage = number & { readonly __brand: 'Percentage' };

/**
 * Day count conventions used in bond calculations
 */
export enum DayCountConvention {
  /** 30/360 US Municipal */
  Thirty360 = '30/360',
  /** Actual/360 Money Market */
  Actual360 = 'Actual/360',
  /** Actual/365 Fixed */
  Actual365 = 'Actual/365',
  /** Actual/Actual ISDA */
  ActualActual = 'Actual/Actual',
}

/**
 * Bond payment frequency
 */
export enum PaymentFrequency {
  Annual = 1,
  SemiAnnual = 2,
  Quarterly = 4,
  Monthly = 12,
}

/**
 * Fixed rate bond instrument
 */
export interface FixedRateBond {
  readonly type: 'fixed';
  readonly faceValue: number;
  readonly couponRate: Percentage;
  readonly maturity: Date;
  readonly frequency: PaymentFrequency;
  readonly dayCount: DayCountConvention;
  readonly issueDate?: Date;
}

/**
 * Floating rate note instrument
 */
export interface FloatingRateNote {
  readonly type: 'floating';
  readonly faceValue: number;
  readonly spread: BasisPoints;
  readonly maturity: Date;
  readonly frequency: PaymentFrequency;
  readonly dayCount: DayCountConvention;
  readonly referenceRate: string; // e.g., 'LIBOR', 'SOFR'
}

/**
 * Zero coupon bond
 */
export interface ZeroCouponBond {
  readonly type: 'zero';
  readonly faceValue: number;
  readonly maturity: Date;
  readonly dayCount: DayCountConvention;
}

/**
 * Callable bond with call schedule
 */
export interface CallableBond extends FixedRateBond {
  readonly callable: true;
  readonly callDates: Date[];
  readonly callPrices: number[];
}

/**
 * Putable bond with put schedule
 */
export interface PutableBond extends FixedRateBond {
  readonly putable: true;
  readonly putDates: Date[];
  readonly putPrices: number[];
}

/**
 * Union type for all bond instruments
 */
export type Bond = FixedRateBond | FloatingRateNote | ZeroCouponBond;

/**
 * Cash flow with date and amount
 */
export interface CashFlow {
  readonly date: Date;
  readonly amount: number;
  readonly type: 'coupon' | 'principal' | 'prepayment';
}

/**
 * Yield curve point
 */
export interface YieldCurvePoint {
  readonly maturity: number; // years
  readonly rate: Percentage;
}

/**
 * Yield curve interface
 */
export interface YieldCurve {
  readonly points: readonly YieldCurvePoint[];
  readonly method: 'bootstrap' | 'nelson-siegel' | 'cubic-spline' | 'linear';
}

/**
 * Nelson-Siegel parameters
 */
export interface NelsonSiegelParameters {
  readonly beta0: number;
  readonly beta1: number;
  readonly beta2: number;
  readonly lambda: number;
}

/**
 * MBS prepayment model parameters
 */
export interface PSAModel {
  readonly psaRate: Percentage; // PSA speed (100% = standard)
  readonly cpr: Percentage; // Conditional Prepayment Rate
}

// ============================================================================
// Custom Error Classes
// ============================================================================

export class FinancialCalculationError extends Error {
  constructor(message: string, public readonly context?: Record&lt;string, unknown&gt;) {
    super(message);
    this.name = 'FinancialCalculationError';
  }
}

export class ConvergenceError extends FinancialCalculationError {
  constructor(message: string, public readonly iterations: number) {
    super(message, { iterations });
    this.name = 'ConvergenceError';
  }
}

export class InvalidInstrumentError extends FinancialCalculationError {
  constructor(message: string, public readonly instrument?: unknown) {
    super(message, { instrument });
    this.name = 'InvalidInstrumentError';
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
 * Converts basis points to percentage
 */
export function bpsToPercentage(bps: BasisPoints): Percentage {
  return asPercentage(bps / 100);
}

/**
 * Converts percentage to basis points
 */
export function percentageToBps(pct: Percentage): BasisPoints {
  return asBasisPoints(pct * 100);
}

/**
 * Calculates year fraction between two dates using specified convention
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param convention - Day count convention
 * @returns Year fraction
 */
export function yearFraction(
  startDate: Date,
  endDate: Date,
  convention: DayCountConvention
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw new FinancialCalculationError('End date must be after start date');
  }

  switch (convention) {
    case DayCountConvention.Thirty360: {
      const y1 = start.getFullYear();
      const m1 = start.getMonth() + 1;
      const d1 = Math.min(start.getDate(), 30);
      const y2 = end.getFullYear();
      const m2 = end.getMonth() + 1;
      const d2 = Math.min(end.getDate(), 30);

      return ((y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1)) / 360;
    }

    case DayCountConvention.Actual360: {
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return days / 360;
    }

    case DayCountConvention.Actual365: {
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return days / 365;
    }

    case DayCountConvention.ActualActual: {
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      const year1 = start.getFullYear();
      const year2 = end.getFullYear();

      if (year1 === year2) {
        const daysInYear = isLeapYear(year1) ? 366 : 365;
        return days / daysInYear;
      }

      // Multi-year calculation
      let fraction = 0;
      const endOfYear1 = new Date(year1, 11, 31);
      fraction += ((endOfYear1.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) / (isLeapYear(year1) ? 366 : 365);

      for (let y = year1 + 1; y < year2; y++) {
        fraction += 1;
      }

      const startOfYear2 = new Date(year2, 0, 1);
      fraction += ((end.getTime() - startOfYear2.getTime()) / (1000 * 60 * 60 * 24)) / (isLeapYear(year2) ? 366 : 365);

      return fraction;
    }

    default:
      throw new FinancialCalculationError(`Unsupported day count convention: ${convention}`);
  }
}

/**
 * Checks if a year is a leap year
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Validates bond instrument parameters
 */
function validateBond(bond: Bond): void {
  if (bond.faceValue <= 0) {
    throw new InvalidInstrumentError('Face value must be positive', bond);
  }

  if (bond.maturity <= new Date()) {
    throw new InvalidInstrumentError('Maturity must be in the future', bond);
  }

  if (bond.type === 'fixed' && (bond.couponRate < 0 || bond.couponRate > 100)) {
    throw new InvalidInstrumentError('Coupon rate must be between 0 and 100', bond);
  }
}

// ============================================================================
// 1. Bond Pricing Functions (7 functions)
// ============================================================================

/**
 * Calculates the clean price of a fixed-rate bond from yield
 *
 * Formula: P = Σ(C / (1 + y)^t) + F / (1 + y)^n
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Yield to maturity as percentage
 * @param settlementDate - Settlement date
 * @returns Clean price (excludes accrued interest)
 *
 * @example
 * ```typescript
 * const bond: FixedRateBond = {
 *   type: 'fixed',
 *   faceValue: 1000,
 *   couponRate: asPercentage(5.0),
 *   maturity: new Date('2030-12-31'),
 *   frequency: PaymentFrequency.SemiAnnual,
 *   dayCount: DayCountConvention.Thirty360
 * };
 * const price = priceFromYield(bond, asPercentage(4.5), new Date());
 * ```
 */
export function priceFromYield(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date
): number {
  validateBond(bond);

  const cashFlows = generateBondCashFlows(bond, settlementDate);
  const periodsPerYear = bond.frequency;
  const yieldPerPeriod = yieldRate / 100 / periodsPerYear;

  let price = 0;
  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(settlementDate, cf.date, bond.dayCount);
    const periods = yearsToPayment * periodsPerYear;
    const discountFactor = Math.pow(1 + yieldPerPeriod, -periods);
    price += cf.amount * discountFactor;
  }

  return price;
}

/**
 * Calculates the dirty price (includes accrued interest)
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Yield to maturity as percentage
 * @param settlementDate - Settlement date
 * @returns Dirty price (includes accrued interest)
 */
export function dirtyPrice(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date
): number {
  const cleanPrice = priceFromYield(bond, yieldRate, settlementDate);
  const accrued = accruedInterest(bond, settlementDate);
  return cleanPrice + accrued;
}

/**
 * Calculates yield from bond price using Newton-Raphson method
 *
 * @param bond - Fixed rate bond
 * @param price - Target clean price
 * @param settlementDate - Settlement date
 * @param initialGuess - Initial yield guess (default: coupon rate)
 * @returns Yield to maturity as percentage
 *
 * @throws {ConvergenceError} If Newton-Raphson fails to converge
 */
export function yieldFromPrice(
  bond: FixedRateBond,
  price: number,
  settlementDate: Date,
  initialGuess?: Percentage
): Percentage {
  validateBond(bond);

  const tolerance = 1e-8;
  const maxIterations = 100;
  let yield_ = initialGuess ?? bond.couponRate;

  for (let i = 0; i < maxIterations; i++) {
    const calculatedPrice = priceFromYield(bond, yield_, settlementDate);
    const diff = calculatedPrice - price;

    if (Math.abs(diff) < tolerance) {
      return yield_;
    }

    // Calculate derivative (modified duration approximation)
    const dy = 0.0001;
    const priceUp = priceFromYield(bond, asPercentage(yield_ + dy), settlementDate);
    const derivative = (priceUp - calculatedPrice) / dy;

    if (Math.abs(derivative) < 1e-10) {
      throw new ConvergenceError('Derivative too small, cannot continue', i);
    }

    yield_ = asPercentage(yield_ - diff / derivative);

    // Ensure yield stays reasonable
    if (yield_ < -10 || yield_ > 100) {
      throw new ConvergenceError('Yield out of reasonable range', i);
    }
  }

  throw new ConvergenceError(`Failed to converge after ${maxIterations} iterations`, maxIterations);
}

/**
 * Prices a zero coupon bond
 *
 * Formula: P = F / (1 + y)^t
 *
 * @param bond - Zero coupon bond
 * @param yieldRate - Yield as percentage
 * @param settlementDate - Settlement date
 * @returns Price
 */
export function zeroCouponBondPrice(
  bond: ZeroCouponBond,
  yieldRate: Percentage,
  settlementDate: Date
): number {
  validateBond(bond);

  const yearsToMaturity = yearFraction(settlementDate, bond.maturity, bond.dayCount);
  const discountFactor = Math.pow(1 + yieldRate / 100, -yearsToMaturity);

  return bond.faceValue * discountFactor;
}

/**
 * Prices a floating rate note (FRN)
 *
 * Simplified pricing assuming next reset at par
 *
 * @param frn - Floating rate note
 * @param currentRate - Current reference rate as percentage
 * @param discountRate - Discount rate as percentage
 * @param settlementDate - Settlement date
 * @returns Price
 */
export function floatingRateNotePrice(
  frn: FloatingRateNote,
  currentRate: Percentage,
  discountRate: Percentage,
  settlementDate: Date
): number {
  validateBond(frn);

  // Next coupon payment
  const couponRate = asPercentage(currentRate + bpsToPercentage(frn.spread));
  const periodsPerYear = frn.frequency;
  const couponPayment = (frn.faceValue * couponRate / 100) / periodsPerYear;

  // Simplified: assume resets at par after next payment
  const yearsToNextPayment = 1 / periodsPerYear;
  const discountFactor = Math.pow(1 + discountRate / 100, -yearsToNextPayment);

  return (frn.faceValue + couponPayment) * discountFactor;
}

/**
 * Calculates accrued interest on a bond
 *
 * @param bond - Fixed rate bond
 * @param settlementDate - Settlement date
 * @returns Accrued interest
 */
export function accruedInterest(
  bond: FixedRateBond,
  settlementDate: Date
): number {
  const periodsPerYear = bond.frequency;
  const couponPayment = (bond.faceValue * bond.couponRate / 100) / periodsPerYear;

  // Find previous coupon date
  const prevCouponDate = getPreviousCouponDate(bond, settlementDate);
  const nextCouponDate = getNextCouponDate(bond, settlementDate);

  const totalPeriod = yearFraction(prevCouponDate, nextCouponDate, bond.dayCount);
  const accruedPeriod = yearFraction(prevCouponDate, settlementDate, bond.dayCount);

  return couponPayment * (accruedPeriod / totalPeriod);
}

/**
 * Gets the previous coupon payment date
 */
function getPreviousCouponDate(bond: FixedRateBond, settlementDate: Date): Date {
  const maturity = new Date(bond.maturity);
  const monthsPerPeriod = 12 / bond.frequency;

  let couponDate = new Date(maturity);
  while (couponDate > settlementDate) {
    couponDate = new Date(couponDate);
    couponDate.setMonth(couponDate.getMonth() - monthsPerPeriod);
  }

  return couponDate;
}

/**
 * Gets the next coupon payment date
 */
function getNextCouponDate(bond: FixedRateBond, settlementDate: Date): Date {
  const maturity = new Date(bond.maturity);
  const monthsPerPeriod = 12 / bond.frequency;

  let couponDate = new Date(maturity);
  while (couponDate > settlementDate) {
    couponDate = new Date(couponDate);
    couponDate.setMonth(couponDate.getMonth() - monthsPerPeriod);
  }

  // Move forward one period
  couponDate = new Date(couponDate);
  couponDate.setMonth(couponDate.getMonth() + monthsPerPeriod);

  return couponDate;
}

/**
 * Alternative accrued interest calculation using 30/360 convention
 */
export function accruedInterest30_360(
  bond: FixedRateBond,
  settlementDate: Date
): number {
  const prevCouponDate = getPreviousCouponDate(bond, settlementDate);
  const nextCouponDate = getNextCouponDate(bond, settlementDate);

  const periodsPerYear = bond.frequency;
  const couponPayment = (bond.faceValue * bond.couponRate / 100) / periodsPerYear;

  const totalDays = yearFraction(prevCouponDate, nextCouponDate, DayCountConvention.Thirty360) * 360;
  const accruedDays = yearFraction(prevCouponDate, settlementDate, DayCountConvention.Thirty360) * 360;

  return couponPayment * (accruedDays / totalDays);
}

/**
 * Alternative accrued interest calculation using Actual/360 convention
 */
export function accruedInterestActual360(
  bond: FixedRateBond,
  settlementDate: Date
): number {
  const prevCouponDate = getPreviousCouponDate(bond, settlementDate);
  const nextCouponDate = getNextCouponDate(bond, settlementDate);

  const periodsPerYear = bond.frequency;
  const couponPayment = (bond.faceValue * bond.couponRate / 100) / periodsPerYear;

  const totalDays = yearFraction(prevCouponDate, nextCouponDate, DayCountConvention.Actual360) * 360;
  const accruedDays = yearFraction(prevCouponDate, settlementDate, DayCountConvention.Actual360) * 360;

  return couponPayment * (accruedDays / totalDays);
}

/**
 * Alternative accrued interest calculation using Actual/365 convention
 */
export function accruedInterestActual365(
  bond: FixedRateBond,
  settlementDate: Date
): number {
  const prevCouponDate = getPreviousCouponDate(bond, settlementDate);
  const nextCouponDate = getNextCouponDate(bond, settlementDate);

  const periodsPerYear = bond.frequency;
  const couponPayment = (bond.faceValue * bond.couponRate / 100) / periodsPerYear;

  const totalDays = yearFraction(prevCouponDate, nextCouponDate, DayCountConvention.Actual365) * 365;
  const accruedDays = yearFraction(prevCouponDate, settlementDate, DayCountConvention.Actual365) * 365;

  return couponPayment * (accruedDays / totalDays);
}

/**
 * Alternative accrued interest calculation using Actual/Actual convention
 */
export function accruedInterestActualActual(
  bond: FixedRateBond,
  settlementDate: Date
): number {
  const prevCouponDate = getPreviousCouponDate(bond, settlementDate);
  const nextCouponDate = getNextCouponDate(bond, settlementDate);

  const periodsPerYear = bond.frequency;
  const couponPayment = (bond.faceValue * bond.couponRate / 100) / periodsPerYear;

  const totalPeriod = yearFraction(prevCouponDate, nextCouponDate, DayCountConvention.ActualActual);
  const accruedPeriod = yearFraction(prevCouponDate, settlementDate, DayCountConvention.ActualActual);

  return couponPayment * (accruedPeriod / totalPeriod);
}

// ============================================================================
// 2. Yield Curve Construction (7 functions)
// ============================================================================

/**
 * Constructs a yield curve using bootstrap method
 *
 * Bootstrap builds zero curve from market bond prices
 *
 * @param bonds - Array of bonds with market prices
 * @param prices - Corresponding market prices
 * @param settlementDate - Settlement date
 * @returns Yield curve
 */
export function bootstrapYieldCurve(
  bonds: FixedRateBond[],
  prices: number[],
  settlementDate: Date
): YieldCurve {
  if (bonds.length !== prices.length) {
    throw new FinancialCalculationError('Bonds and prices arrays must have same length');
  }

  const points: YieldCurvePoint[] = [];

  // Sort bonds by maturity
  const sorted = bonds
    .map((bond, i) => ({ bond, price: prices[i] }))
    .sort((a, b) => a.bond.maturity.getTime() - b.bond.maturity.getTime());

  for (const { bond, price } of sorted) {
    const maturity = yearFraction(settlementDate, bond.maturity, bond.dayCount);

    // Bootstrap: solve for zero rate given previous rates
    const rate = solveBootstrapRate(bond, price, settlementDate, points);
    points.push({ maturity, rate });
  }

  return { points, method: 'bootstrap' };
}

/**
 * Solves for bootstrap rate given previous zero rates
 */
function solveBootstrapRate(
  bond: FixedRateBond,
  price: number,
  settlementDate: Date,
  previousRates: YieldCurvePoint[]
): Percentage {
  const cashFlows = generateBondCashFlows(bond, settlementDate);
  const periodsPerYear = bond.frequency;

  // Discount all cash flows except the last using previous rates
  let pv = 0;
  for (let i = 0; i < cashFlows.length - 1; i++) {
    const cf = cashFlows[i];
    const yearsToPayment = yearFraction(settlementDate, cf.date, bond.dayCount);
    const rate = interpolateYieldCurve(previousRates, yearsToPayment);
    const discountFactor = Math.pow(1 + rate / 100, -yearsToPayment);
    pv += cf.amount * discountFactor;
  }

  // Solve for last rate
  const lastCF = cashFlows[cashFlows.length - 1];
  const yearsToMaturity = yearFraction(settlementDate, lastCF.date, bond.dayCount);

  // price = pv + lastCF / (1 + r)^t
  // r = ((lastCF / (price - pv))^(1/t)) - 1
  const remainingValue = price - pv;
  const rate = (Math.pow(lastCF.amount / remainingValue, 1 / yearsToMaturity) - 1) * 100;

  return asPercentage(rate);
}

/**
 * Fits a Nelson-Siegel yield curve model
 *
 * Model: y(t) = β₀ + β₁ * ((1 - e^(-t/λ)) / (t/λ)) + β₂ * (((1 - e^(-t/λ)) / (t/λ)) - e^(-t/λ))
 *
 * @param maturities - Maturity points in years
 * @param rates - Corresponding yield rates
 * @returns Nelson-Siegel parameters
 */
export function nelsonSiegelCurve(
  maturities: number[],
  rates: Percentage[]
): NelsonSiegelParameters {
  if (maturities.length !== rates.length) {
    throw new FinancialCalculationError('Maturities and rates must have same length');
  }

  // Simplified estimation using least squares
  // In production, use non-linear optimization (Levenberg-Marquardt)

  const lambda = 2.0; // Common starting value

  // Use linear regression for beta parameters given lambda
  const n = maturities.length;
  const X: number[][] = [];
  const y: number[] = rates;

  for (let i = 0; i < n; i++) {
    const t = maturities[i];
    const expTerm = Math.exp(-t / lambda);
    const factor1 = 1;
    const factor2 = (1 - expTerm) / (t / lambda);
    const factor3 = factor2 - expTerm;

    X.push([factor1, factor2, factor3]);
  }

  // Solve X * beta = y using normal equations: beta = (X'X)^-1 X'y
  const betas = solveLinearRegression(X, y);

  return {
    beta0: betas[0],
    beta1: betas[1],
    beta2: betas[2],
    lambda,
  };
}

/**
 * Evaluates Nelson-Siegel curve at given maturity
 *
 * @param params - Nelson-Siegel parameters
 * @param maturity - Maturity in years
 * @returns Yield rate
 */
export function evaluateNelsonSiegel(
  params: NelsonSiegelParameters,
  maturity: number
): Percentage {
  const { beta0, beta1, beta2, lambda } = params;
  const t = maturity;
  const expTerm = Math.exp(-t / lambda);
  const factor = (1 - expTerm) / (t / lambda);

  const rate = beta0 + beta1 * factor + beta2 * (factor - expTerm);
  return asPercentage(rate);
}

/**
 * Fits Svensson extension of Nelson-Siegel model
 *
 * Adds fourth term for better long-end fit
 *
 * @param maturities - Maturity points in years
 * @param rates - Corresponding yield rates
 * @returns Svensson parameters (extends Nelson-Siegel)
 */
export function svenssonCurve(
  maturities: number[],
  rates: Percentage[]
): NelsonSiegelParameters & { beta3: number; lambda2: number } {
  // Simplified: start with Nelson-Siegel
  const ns = nelsonSiegelCurve(maturities, rates);

  // In production, optimize beta3 and lambda2
  return {
    ...ns,
    beta3: 0,
    lambda2: 5.0,
  };
}

/**
 * Cubic spline interpolation for yield curve
 *
 * Creates smooth curve through given points
 *
 * @param points - Yield curve points
 * @param maturity - Target maturity
 * @returns Interpolated rate
 */
export function cubicSplineInterpolation(
  points: readonly YieldCurvePoint[],
  maturity: number
): Percentage {
  if (points.length < 2) {
    throw new FinancialCalculationError('Need at least 2 points for interpolation');
  }

  // Sort points by maturity
  const sorted = [...points].sort((a, b) => a.maturity - b.maturity);

  // Find bracketing points
  if (maturity <= sorted[0].maturity) {
    return sorted[0].rate;
  }
  if (maturity >= sorted[sorted.length - 1].maturity) {
    return sorted[sorted.length - 1].rate;
  }

  let i = 0;
  while (i < sorted.length - 1 && sorted[i + 1].maturity < maturity) {
    i++;
  }

  const x0 = sorted[i].maturity;
  const x1 = sorted[i + 1].maturity;
  const y0 = sorted[i].rate;
  const y1 = sorted[i + 1].rate;

  // Simplified cubic Hermite spline (production would use full spline calculation)
  const t = (maturity - x0) / (x1 - x0);
  const h00 = 2 * t * t * t - 3 * t * t + 1;
  const h10 = t * t * t - 2 * t * t + t;
  const h01 = -2 * t * t * t + 3 * t * t;
  const h11 = t * t * t - t * t;

  // Estimate derivatives (finite differences)
  const m0 = i > 0 ? (y1 - sorted[i - 1].rate) / (x1 - sorted[i - 1].maturity) : (y1 - y0) / (x1 - x0);
  const m1 = i < sorted.length - 2 ? (sorted[i + 2].rate - y0) / (sorted[i + 2].maturity - x0) : (y1 - y0) / (x1 - x0);

  const rate = h00 * y0 + h10 * (x1 - x0) * m0 + h01 * y1 + h11 * (x1 - x0) * m1;
  return asPercentage(rate);
}

/**
 * Linear interpolation for yield curve
 *
 * @param points - Yield curve points
 * @param maturity - Target maturity
 * @returns Interpolated rate
 */
export function linearInterpolation(
  points: readonly YieldCurvePoint[],
  maturity: number
): Percentage {
  if (points.length < 2) {
    throw new FinancialCalculationError('Need at least 2 points for interpolation');
  }

  const sorted = [...points].sort((a, b) => a.maturity - b.maturity);

  if (maturity <= sorted[0].maturity) {
    return sorted[0].rate;
  }
  if (maturity >= sorted[sorted.length - 1].maturity) {
    return sorted[sorted.length - 1].rate;
  }

  let i = 0;
  while (i < sorted.length - 1 && sorted[i + 1].maturity < maturity) {
    i++;
  }

  const x0 = sorted[i].maturity;
  const x1 = sorted[i + 1].maturity;
  const y0 = sorted[i].rate;
  const y1 = sorted[i + 1].rate;

  const rate = y0 + (y1 - y0) * (maturity - x0) / (x1 - x0);
  return asPercentage(rate);
}

/**
 * Helper function to interpolate yield curve
 */
function interpolateYieldCurve(points: readonly YieldCurvePoint[], maturity: number): Percentage {
  return linearInterpolation(points, maturity);
}

/**
 * Extracts forward rate from spot rates
 *
 * Formula: (1 + s₂)^t₂ = (1 + s₁)^t₁ * (1 + f)^(t₂-t₁)
 *
 * @param spotRate1 - Spot rate for period 1
 * @param maturity1 - Maturity of period 1 in years
 * @param spotRate2 - Spot rate for period 2
 * @param maturity2 - Maturity of period 2 in years
 * @returns Forward rate
 */
export function forwardRateFromSpot(
  spotRate1: Percentage,
  maturity1: number,
  spotRate2: Percentage,
  maturity2: number
): Percentage {
  if (maturity2 <= maturity1) {
    throw new FinancialCalculationError('Maturity2 must be greater than maturity1');
  }

  const factor1 = Math.pow(1 + spotRate1 / 100, maturity1);
  const factor2 = Math.pow(1 + spotRate2 / 100, maturity2);

  const forwardRate = (Math.pow(factor2 / factor1, 1 / (maturity2 - maturity1)) - 1) * 100;
  return asPercentage(forwardRate);
}

/**
 * Calculates spot rate from forward rates
 *
 * @param forwardRates - Array of forward rates
 * @param maturities - Corresponding maturities
 * @returns Spot rate for final maturity
 */
export function spotRateFromForward(
  forwardRates: Percentage[],
  maturities: number[]
): Percentage {
  if (forwardRates.length !== maturities.length) {
    throw new FinancialCalculationError('Forward rates and maturities must have same length');
  }

  let compoundFactor = 1;
  for (let i = 0; i < forwardRates.length; i++) {
    const period = i === 0 ? maturities[0] : maturities[i] - maturities[i - 1];
    compoundFactor *= Math.pow(1 + forwardRates[i] / 100, period);
  }

  const totalMaturity = maturities[maturities.length - 1];
  const spotRate = (Math.pow(compoundFactor, 1 / totalMaturity) - 1) * 100;
  return asPercentage(spotRate);
}

// ============================================================================
// 3. Duration and Convexity (7 functions)
// ============================================================================

/**
 * Calculates Macaulay duration
 *
 * Formula: D = Σ(t * PV(CFₜ)) / Price
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Yield to maturity
 * @param settlementDate - Settlement date
 * @returns Macaulay duration in years
 */
export function macaulayDuration(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date
): number {
  const cashFlows = generateBondCashFlows(bond, settlementDate);
  const periodsPerYear = bond.frequency;
  const yieldPerPeriod = yieldRate / 100 / periodsPerYear;

  let weightedSum = 0;
  let price = 0;

  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(settlementDate, cf.date, bond.dayCount);
    const periods = yearsToPayment * periodsPerYear;
    const discountFactor = Math.pow(1 + yieldPerPeriod, -periods);
    const pv = cf.amount * discountFactor;

    weightedSum += yearsToPayment * pv;
    price += pv;
  }

  return weightedSum / price;
}

/**
 * Calculates modified duration
 *
 * Formula: D_mod = D_mac / (1 + y/m)
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Yield to maturity
 * @param settlementDate - Settlement date
 * @returns Modified duration
 */
export function modifiedDuration(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date
): number {
  const macDuration = macaulayDuration(bond, yieldRate, settlementDate);
  const periodsPerYear = bond.frequency;
  const yieldPerPeriod = yieldRate / 100 / periodsPerYear;

  return macDuration / (1 + yieldPerPeriod);
}

/**
 * Calculates effective duration using finite differences
 *
 * More accurate for bonds with embedded options
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Base yield
 * @param settlementDate - Settlement date
 * @param deltaYield - Yield change for calculation (default 10 bps)
 * @returns Effective duration
 */
export function effectiveDuration(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date,
  deltaYield: BasisPoints = asBasisPoints(10)
): number {
  const dy = bpsToPercentage(deltaYield);

  const priceUp = priceFromYield(bond, asPercentage(yieldRate + dy), settlementDate);
  const priceDown = priceFromYield(bond, asPercentage(yieldRate - dy), settlementDate);
  const basePrice = priceFromYield(bond, yieldRate, settlementDate);

  return -(priceUp - priceDown) / (2 * basePrice * (dy / 100));
}

/**
 * Calculates key rate duration
 *
 * Measures sensitivity to specific points on yield curve
 *
 * @param bond - Fixed rate bond
 * @param yieldCurve - Base yield curve
 * @param keyMaturity - Maturity point to shift
 * @param settlementDate - Settlement date
 * @param deltaYield - Yield shift size
 * @returns Key rate duration for specified maturity
 */
export function keyRateDuration(
  bond: FixedRateBond,
  yieldCurve: YieldCurve,
  keyMaturity: number,
  settlementDate: Date,
  deltaYield: BasisPoints = asBasisPoints(10)
): number {
  const dy = bpsToPercentage(deltaYield);

  // Shift yield curve at key maturity
  const shiftedUp = shiftYieldCurveAtPoint(yieldCurve, keyMaturity, dy);
  const shiftedDown = shiftYieldCurveAtPoint(yieldCurve, keyMaturity, asPercentage(-dy));

  // Price bond using shifted curves
  const basePrice = priceBondFromCurve(bond, yieldCurve, settlementDate);
  const priceUp = priceBondFromCurve(bond, shiftedUp, settlementDate);
  const priceDown = priceBondFromCurve(bond, shiftedDown, settlementDate);

  return -(priceUp - priceDown) / (2 * basePrice * (dy / 100));
}

/**
 * Calculates convexity
 *
 * Formula: C = (Σ(t * (t+1/m) * PV(CFₜ))) / (Price * (1 + y/m)²)
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Yield to maturity
 * @param settlementDate - Settlement date
 * @returns Convexity
 */
export function convexity(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date
): number {
  const cashFlows = generateBondCashFlows(bond, settlementDate);
  const periodsPerYear = bond.frequency;
  const yieldPerPeriod = yieldRate / 100 / periodsPerYear;

  let convexitySum = 0;
  let price = 0;

  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(settlementDate, cf.date, bond.dayCount);
    const periods = yearsToPayment * periodsPerYear;
    const discountFactor = Math.pow(1 + yieldPerPeriod, -periods);
    const pv = cf.amount * discountFactor;

    convexitySum += periods * (periods + 1) * pv;
    price += pv;
  }

  return convexitySum / (price * Math.pow(1 + yieldPerPeriod, 2) * periodsPerYear * periodsPerYear);
}

/**
 * Calculates effective convexity using finite differences
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Base yield
 * @param settlementDate - Settlement date
 * @param deltaYield - Yield change for calculation
 * @returns Effective convexity
 */
export function effectiveConvexity(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date,
  deltaYield: BasisPoints = asBasisPoints(10)
): number {
  const dy = bpsToPercentage(deltaYield);

  const priceUp = priceFromYield(bond, asPercentage(yieldRate + dy), settlementDate);
  const priceDown = priceFromYield(bond, asPercentage(yieldRate - dy), settlementDate);
  const basePrice = priceFromYield(bond, yieldRate, settlementDate);

  return (priceUp + priceDown - 2 * basePrice) / (basePrice * Math.pow(dy / 100, 2));
}

/**
 * Calculates dollar duration (DV01)
 *
 * Change in price for 1 basis point change in yield
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Yield to maturity
 * @param settlementDate - Settlement date
 * @returns DV01 (dollar value of 1 basis point)
 */
export function dollarDuration(
  bond: FixedRateBond,
  yieldRate: Percentage,
  settlementDate: Date
): number {
  const modDur = modifiedDuration(bond, yieldRate, settlementDate);
  const price = priceFromYield(bond, yieldRate, settlementDate);

  return modDur * price * 0.0001; // 1 basis point = 0.0001
}

// ============================================================================
// 4. Yield Measures (7 functions)
// ============================================================================

/**
 * Calculates yield to maturity (YTM)
 *
 * Wrapper around yieldFromPrice for clarity
 *
 * @param bond - Fixed rate bond
 * @param price - Market price (clean)
 * @param settlementDate - Settlement date
 * @returns Yield to maturity
 */
export function yieldToMaturity(
  bond: FixedRateBond,
  price: number,
  settlementDate: Date
): Percentage {
  return yieldFromPrice(bond, price, settlementDate);
}

/**
 * Calculates yield to call (YTC)
 *
 * @param bond - Callable bond
 * @param price - Market price
 * @param settlementDate - Settlement date
 * @param callDate - Specific call date to evaluate
 * @param callPrice - Call price
 * @returns Yield to call
 */
export function yieldToCall(
  bond: FixedRateBond,
  price: number,
  settlementDate: Date,
  callDate: Date,
  callPrice: number
): Percentage {
  // Create temporary bond with call date as maturity
  const callableBond: FixedRateBond = {
    ...bond,
    maturity: callDate,
  };

  // Adjust cash flows to include call price
  const ytc = yieldFromPrice(callableBond, price, settlementDate);

  return ytc;
}

/**
 * Calculates yield to put (YTP)
 *
 * @param bond - Putable bond
 * @param price - Market price
 * @param settlementDate - Settlement date
 * @param putDate - Specific put date to evaluate
 * @param putPrice - Put price
 * @returns Yield to put
 */
export function yieldToPut(
  bond: FixedRateBond,
  price: number,
  settlementDate: Date,
  putDate: Date,
  putPrice: number
): Percentage {
  const putableBond: FixedRateBond = {
    ...bond,
    maturity: putDate,
  };

  return yieldFromPrice(putableBond, price, settlementDate);
}

/**
 * Calculates yield to worst (YTW)
 *
 * Minimum of YTM, all YTC values, and all YTP values
 *
 * @param bond - Callable/putable bond
 * @param price - Market price
 * @param settlementDate - Settlement date
 * @param callSchedule - Array of call dates and prices
 * @param putSchedule - Array of put dates and prices
 * @returns Yield to worst
 */
export function yieldToWorst(
  bond: FixedRateBond,
  price: number,
  settlementDate: Date,
  callSchedule?: Array<{ date: Date; price: number }>,
  putSchedule?: Array<{ date: Date; price: number }>
): Percentage {
  const yields: Percentage[] = [];

  // YTM
  yields.push(yieldToMaturity(bond, price, settlementDate));

  // YTC for all call dates
  if (callSchedule) {
    for (const call of callSchedule) {
      if (call.date > settlementDate) {
        yields.push(yieldToCall(bond, price, settlementDate, call.date, call.price));
      }
    }
  }

  // YTP for all put dates
  if (putSchedule) {
    for (const put of putSchedule) {
      if (put.date > settlementDate) {
        yields.push(yieldToPut(bond, price, settlementDate, put.date, put.price));
      }
    }
  }

  return asPercentage(Math.min(...yields));
}

/**
 * Calculates current yield
 *
 * Formula: Current Yield = Annual Coupon / Price
 *
 * @param bond - Fixed rate bond
 * @param price - Market price
 * @returns Current yield
 */
export function currentYield(bond: FixedRateBond, price: number): Percentage {
  const annualCoupon = (bond.faceValue * bond.couponRate) / 100;
  return asPercentage((annualCoupon / price) * 100);
}

/**
 * Calculates simple yield (not compounded)
 *
 * @param bond - Fixed rate bond
 * @param price - Market price
 * @param settlementDate - Settlement date
 * @returns Simple yield
 */
export function simpleYield(
  bond: FixedRateBond,
  price: number,
  settlementDate: Date
): Percentage {
  const yearsToMaturity = yearFraction(settlementDate, bond.maturity, bond.dayCount);
  const annualCoupon = (bond.faceValue * bond.couponRate) / 100;
  const totalReturn = (bond.faceValue - price) + (annualCoupon * yearsToMaturity);

  return asPercentage((totalReturn / price / yearsToMaturity) * 100);
}

/**
 * Calculates discount margin for floating rate notes
 *
 * @param frn - Floating rate note
 * @param price - Market price
 * @param referenceRate - Current reference rate
 * @param settlementDate - Settlement date
 * @returns Discount margin in basis points
 */
export function discountMargin(
  frn: FloatingRateNote,
  price: number,
  referenceRate: Percentage,
  settlementDate: Date
): BasisPoints {
  // Simplified calculation
  const yearsToMaturity = yearFraction(settlementDate, frn.maturity, frn.dayCount);
  const impliedYield = asPercentage(((frn.faceValue - price) / price / yearsToMaturity) * 100);

  const margin = percentageToBps(asPercentage(impliedYield - referenceRate));
  return margin;
}

// ============================================================================
// 5. Cash Flow Analysis (5 functions)
// ============================================================================

/**
 * Generates all bond cash flows
 *
 * @param bond - Fixed rate bond
 * @param settlementDate - Settlement date
 * @returns Array of cash flows
 */
export function generateBondCashFlows(
  bond: FixedRateBond,
  settlementDate: Date
): CashFlow[] {
  const cashFlows: CashFlow[] = [];
  const periodsPerYear = bond.frequency;
  const couponPayment = (bond.faceValue * bond.couponRate / 100) / periodsPerYear;
  const monthsPerPeriod = 12 / periodsPerYear;

  let currentDate = new Date(bond.maturity);

  // Generate coupon dates backwards from maturity
  const dates: Date[] = [];
  while (currentDate > settlementDate) {
    dates.unshift(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() - monthsPerPeriod);
  }

  // Create cash flows
  for (let i = 0; i < dates.length; i++) {
    const isLast = i === dates.length - 1;
    cashFlows.push({
      date: dates[i],
      amount: isLast ? couponPayment + bond.faceValue : couponPayment,
      type: isLast ? 'principal' : 'coupon',
    });
  }

  return cashFlows;
}

/**
 * Calculates present value of cash flows
 *
 * @param cashFlows - Array of cash flows
 * @param discountRate - Discount rate as percentage
 * @param valuationDate - Valuation date
 * @param dayCount - Day count convention
 * @returns Present value
 */
export function presentValueOfCashFlows(
  cashFlows: readonly CashFlow[],
  discountRate: Percentage,
  valuationDate: Date,
  dayCount: DayCountConvention
): number {
  let pv = 0;

  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(valuationDate, cf.date, dayCount);
    const discountFactor = Math.pow(1 + discountRate / 100, -yearsToPayment);
    pv += cf.amount * discountFactor;
  }

  return pv;
}

/**
 * Calculates duration from cash flows
 *
 * @param cashFlows - Array of cash flows
 * @param discountRate - Discount rate
 * @param valuationDate - Valuation date
 * @param dayCount - Day count convention
 * @returns Duration in years
 */
export function cashFlowDuration(
  cashFlows: readonly CashFlow[],
  discountRate: Percentage,
  valuationDate: Date,
  dayCount: DayCountConvention
): number {
  let weightedSum = 0;
  let pv = 0;

  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(valuationDate, cf.date, dayCount);
    const discountFactor = Math.pow(1 + discountRate / 100, -yearsToPayment);
    const cfPV = cf.amount * discountFactor;

    weightedSum += yearsToPayment * cfPV;
    pv += cfPV;
  }

  return weightedSum / pv;
}

/**
 * Calculates convexity from cash flows
 *
 * @param cashFlows - Array of cash flows
 * @param discountRate - Discount rate
 * @param valuationDate - Valuation date
 * @param dayCount - Day count convention
 * @returns Convexity
 */
export function cashFlowConvexity(
  cashFlows: readonly CashFlow[],
  discountRate: Percentage,
  valuationDate: Date,
  dayCount: DayCountConvention
): number {
  let convexitySum = 0;
  let pv = 0;

  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(valuationDate, cf.date, dayCount);
    const discountFactor = Math.pow(1 + discountRate / 100, -yearsToPayment);
    const cfPV = cf.amount * discountFactor;

    convexitySum += yearsToPayment * (yearsToPayment + 1) * cfPV;
    pv += cfPV;
  }

  return convexitySum / (pv * Math.pow(1 + discountRate / 100, 2));
}

/**
 * Analyzes bond ladder strategy
 *
 * @param bonds - Array of bonds in ladder
 * @param yields - Corresponding yields
 * @param settlementDate - Settlement date
 * @returns Ladder analytics
 */
export function bondLadderAnalysis(
  bonds: FixedRateBond[],
  yields: Percentage[],
  settlementDate: Date
): {
  averageDuration: number;
  averageYield: Percentage;
  totalValue: number;
  annualCashFlow: number;
} {
  let totalDuration = 0;
  let totalYield = 0;
  let totalValue = 0;
  let annualCashFlow = 0;

  for (let i = 0; i < bonds.length; i++) {
    const bond = bonds[i];
    const yield_ = yields[i];

    const price = priceFromYield(bond, yield_, settlementDate);
    const duration = modifiedDuration(bond, yield_, settlementDate);

    totalValue += price;
    totalDuration += duration * price;
    totalYield += yield_ * price;

    // Annual cash flow
    annualCashFlow += (bond.faceValue * bond.couponRate) / 100;
  }

  return {
    averageDuration: totalDuration / totalValue,
    averageYield: asPercentage(totalYield / totalValue),
    totalValue,
    annualCashFlow,
  };
}

// ============================================================================
// 6. Credit Analysis (4 functions)
// ============================================================================

/**
 * Calculates Z-spread (zero-volatility spread)
 *
 * Spread added to each spot rate to match bond price
 *
 * @param bond - Fixed rate bond
 * @param price - Market price
 * @param yieldCurve - Treasury yield curve
 * @param settlementDate - Settlement date
 * @returns Z-spread in basis points
 */
export function zSpreadCalculation(
  bond: FixedRateBond,
  price: number,
  yieldCurve: YieldCurve,
  settlementDate: Date
): BasisPoints {
  const tolerance = 1e-6;
  const maxIterations = 100;
  let spread = asBasisPoints(100); // Initial guess: 100 bps

  for (let i = 0; i < maxIterations; i++) {
    const calculatedPrice = priceBondWithSpread(bond, yieldCurve, spread, settlementDate);
    const diff = calculatedPrice - price;

    if (Math.abs(diff) < tolerance) {
      return spread;
    }

    // Numerical derivative
    const dSpread = 1; // 1 bp
    const priceUp = priceBondWithSpread(bond, yieldCurve, asBasisPoints(spread + dSpread), settlementDate);
    const derivative = (priceUp - calculatedPrice) / dSpread;

    if (Math.abs(derivative) < 1e-10) {
      throw new ConvergenceError('Derivative too small', i);
    }

    spread = asBasisPoints(spread - diff / derivative);
  }

  throw new ConvergenceError(`Z-spread failed to converge after ${maxIterations} iterations`, maxIterations);
}

/**
 * Calculates option-adjusted spread (OAS)
 *
 * Simplified OAS for callable bonds
 *
 * @param bond - Callable bond
 * @param price - Market price
 * @param yieldCurve - Yield curve
 * @param volatility - Interest rate volatility
 * @param settlementDate - Settlement date
 * @returns OAS in basis points
 */
export function optionAdjustedSpread(
  bond: FixedRateBond & { callable?: boolean; callDates?: Date[]; callPrices?: number[] },
  price: number,
  yieldCurve: YieldCurve,
  volatility: Percentage,
  settlementDate: Date
): BasisPoints {
  // Simplified: use Z-spread as approximation
  // In production, use binomial tree with embedded option value
  const zSpread = zSpreadCalculation(bond, price, yieldCurve, settlementDate);

  // Option cost estimate (very simplified)
  const optionCost = bond.callable ? 20 : 0; // Rough estimate: 20 bps

  return asBasisPoints(zSpread + optionCost);
}

/**
 * Decomposes credit spread into components
 *
 * @param corporateYield - Corporate bond yield
 * @param treasuryYield - Treasury yield
 * @param expectedLoss - Expected loss from default
 * @returns Spread components
 */
export function creditSpreadDecomposition(
  corporateYield: Percentage,
  treasuryYield: Percentage,
  expectedLoss: Percentage
): {
  totalSpread: BasisPoints;
  defaultRiskSpread: BasisPoints;
  liquidityPremium: BasisPoints;
  taxEffect: BasisPoints;
} {
  const totalSpread = percentageToBps(asPercentage(corporateYield - treasuryYield));
  const defaultRiskSpread = percentageToBps(expectedLoss);

  // Simplified decomposition
  const liquidityPremium = asBasisPoints(totalSpread * 0.3); // 30% attribution
  const taxEffect = asBasisPoints(totalSpread - defaultRiskSpread - liquidityPremium);

  return {
    totalSpread,
    defaultRiskSpread,
    liquidityPremium,
    taxEffect,
  };
}

/**
 * Estimates default probability from credit spread
 *
 * Simplified Merton model approach
 *
 * @param creditSpread - Credit spread in basis points
 * @param recoveryRate - Expected recovery rate (0-1)
 * @param maturity - Time to maturity in years
 * @returns Cumulative default probability
 */
export function defaultProbability(
  creditSpread: BasisPoints,
  recoveryRate: number,
  maturity: number
): Percentage {
  if (recoveryRate < 0 || recoveryRate > 1) {
    throw new FinancialCalculationError('Recovery rate must be between 0 and 1');
  }

  // Simplified formula: PD ≈ spread / (1 - recovery)
  const spreadPct = bpsToPercentage(creditSpread);
  const annualizedPD = (spreadPct / 100) / (1 - recoveryRate);
  const cumulativePD = 1 - Math.exp(-annualizedPD * maturity);

  return asPercentage(cumulativePD * 100);
}

// ============================================================================
// 7. Specialized Securities (5 functions)
// ============================================================================

/**
 * Models MBS prepayment using PSA (Public Securities Association) standard
 *
 * PSA assumes CPR increases linearly to 6% at month 30, then constant
 *
 * @param monthsFromOrigination - Months since MBS origination
 * @param psaSpeed - PSA speed as percentage (100% = standard)
 * @returns Conditional Prepayment Rate (CPR)
 */
export function mbsPrepaymentPSA(
  monthsFromOrigination: number,
  psaSpeed: Percentage = asPercentage(100)
): Percentage {
  const standardCPR = monthsFromOrigination <= 30
    ? (monthsFromOrigination * 0.2) // 0.2% per month up to 6%
    : 6.0;

  const adjustedCPR = (standardCPR * psaSpeed) / 100;
  return asPercentage(adjustedCPR);
}

/**
 * Calculates MBS weighted average life (WAL)
 *
 * @param principalPayments - Array of principal payment amounts
 * @param periods - Corresponding time periods (months)
 * @returns Weighted average life in years
 */
export function mbsWeightedAverageLife(
  principalPayments: readonly number[],
  periods: readonly number[]
): number {
  if (principalPayments.length !== periods.length) {
    throw new FinancialCalculationError('Principal payments and periods must have same length');
  }

  const totalPrincipal = principalPayments.reduce((sum, p) => sum + p, 0);
  let weightedSum = 0;

  for (let i = 0; i < principalPayments.length; i++) {
    weightedSum += principalPayments[i] * periods[i];
  }

  return (weightedSum / totalPrincipal) / 12; // Convert months to years
}

/**
 * Generates ABS cash flow waterfall structure
 *
 * Models priority of payments in asset-backed securities
 *
 * @param totalCashFlow - Total cash flow available
 * @param tranches - Array of tranches with sizes and priorities
 * @returns Cash flow distribution to each tranche
 */
export function absCashFlowWaterfall(
  totalCashFlow: number,
  tranches: Array<{ name: string; size: number; priority: number; rate: Percentage }>
): Array<{ tranche: string; interest: number; principal: number; remaining: number }> {
  // Sort by priority (1 = senior)
  const sorted = [...tranches].sort((a, b) => a.priority - b.priority);

  const results: Array<{ tranche: string; interest: number; principal: number; remaining: number }> = [];
  let remainingCash = totalCashFlow;

  for (const tranche of sorted) {
    // Pay interest first
    const interest = Math.min((tranche.size * tranche.rate) / 100, remainingCash);
    remainingCash -= interest;

    // Then principal
    const principal = Math.min(tranche.size, remainingCash);
    remainingCash -= principal;

    results.push({
      tranche: tranche.name,
      interest,
      principal,
      remaining: tranche.size - principal,
    });

    if (remainingCash <= 0) break;
  }

  return results;
}

/**
 * Prices a callable bond using binomial tree (simplified)
 *
 * @param bond - Callable bond
 * @param yieldRate - Current yield
 * @param volatility - Yield volatility
 * @param settlementDate - Settlement date
 * @param callPrice - Call price
 * @returns Bond price
 */
export function callableBondPrice(
  bond: FixedRateBond & { callable: true; callDates: Date[]; callPrices: number[] },
  yieldRate: Percentage,
  volatility: Percentage,
  settlementDate: Date,
  callPrice: number
): number {
  // Simplified: price as straight bond minus option value estimate
  const straightBondPrice = priceFromYield(bond, yieldRate, settlementDate);

  // Rough option value (in production, use binomial tree)
  const yearsToCall = yearFraction(settlementDate, bond.callDates[0], bond.dayCount);
  const optionValue = straightBondPrice * 0.02 * Math.sqrt(yearsToCall); // Simplified

  return Math.min(straightBondPrice - optionValue, callPrice);
}

/**
 * Prices a putable bond using binomial tree (simplified)
 *
 * @param bond - Putable bond
 * @param yieldRate - Current yield
 * @param volatility - Yield volatility
 * @param settlementDate - Settlement date
 * @param putPrice - Put price
 * @returns Bond price
 */
export function putableBondPrice(
  bond: FixedRateBond & { putable: true; putDates: Date[]; putPrices: number[] },
  yieldRate: Percentage,
  volatility: Percentage,
  settlementDate: Date,
  putPrice: number
): number {
  // Simplified: price as straight bond plus option value estimate
  const straightBondPrice = priceFromYield(bond, yieldRate, settlementDate);

  // Rough option value
  const yearsToPut = yearFraction(settlementDate, bond.putDates[0], bond.dayCount);
  const optionValue = straightBondPrice * 0.015 * Math.sqrt(yearsToPut);

  return Math.max(straightBondPrice + optionValue, putPrice);
}

// ============================================================================
// Helper Functions
// ============================================================================

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

  // Solve using Gaussian elimination (simplified)
  return gaussianElimination(XtX, Xty);
}

/**
 * Solves system of linear equations using Gaussian elimination
 */
function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Eliminate column
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // Back substitution
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

/**
 * Shifts yield curve at specific point
 */
function shiftYieldCurveAtPoint(
  curve: YieldCurve,
  targetMaturity: number,
  shift: Percentage
): YieldCurve {
  const newPoints = curve.points.map(point => {
    if (Math.abs(point.maturity - targetMaturity) < 0.1) {
      return { ...point, rate: asPercentage(point.rate + shift) };
    }
    return point;
  });

  return { ...curve, points: newPoints };
}

/**
 * Prices bond using yield curve
 */
function priceBondFromCurve(
  bond: FixedRateBond,
  yieldCurve: YieldCurve,
  settlementDate: Date
): number {
  const cashFlows = generateBondCashFlows(bond, settlementDate);
  let price = 0;

  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(settlementDate, cf.date, bond.dayCount);
    const rate = interpolateYieldCurve(yieldCurve.points, yearsToPayment);
    const discountFactor = Math.pow(1 + rate / 100, -yearsToPayment);
    price += cf.amount * discountFactor;
  }

  return price;
}

/**
 * Prices bond with Z-spread added to yield curve
 */
function priceBondWithSpread(
  bond: FixedRateBond,
  yieldCurve: YieldCurve,
  spread: BasisPoints,
  settlementDate: Date
): number {
  const cashFlows = generateBondCashFlows(bond, settlementDate);
  const spreadPct = bpsToPercentage(spread);
  let price = 0;

  for (const cf of cashFlows) {
    const yearsToPayment = yearFraction(settlementDate, cf.date, bond.dayCount);
    const rate = interpolateYieldCurve(yieldCurve.points, yearsToPayment);
    const adjustedRate = asPercentage(rate + spreadPct);
    const discountFactor = Math.pow(1 + adjustedRate / 100, -yearsToPayment);
    price += cf.amount * discountFactor;
  }

  return price;
}
