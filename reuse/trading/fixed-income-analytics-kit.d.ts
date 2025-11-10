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
/**
 * Branded type for basis points to prevent unit confusion
 */
export type BasisPoints = number & {
    readonly __brand: 'BasisPoints';
};
/**
 * Branded type for percentage values
 */
export type Percentage = number & {
    readonly __brand: 'Percentage';
};
/**
 * Day count conventions used in bond calculations
 */
export declare enum DayCountConvention {
    /** 30/360 US Municipal */
    Thirty360 = "30/360",
    /** Actual/360 Money Market */
    Actual360 = "Actual/360",
    /** Actual/365 Fixed */
    Actual365 = "Actual/365",
    /** Actual/Actual ISDA */
    ActualActual = "Actual/Actual"
}
/**
 * Bond payment frequency
 */
export declare enum PaymentFrequency {
    Annual = 1,
    SemiAnnual = 2,
    Quarterly = 4,
    Monthly = 12
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
    readonly referenceRate: string;
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
    readonly maturity: number;
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
    readonly psaRate: Percentage;
    readonly cpr: Percentage;
}
export declare class FinancialCalculationError extends Error {
    readonly context?: Record & lt;
    constructor(message: string, context?: Record & lt, string: any, unknown: any, : any, gt: any);
}
export declare class ConvergenceError extends FinancialCalculationError {
    readonly iterations: number;
    constructor(message: string, iterations: number);
}
export declare class InvalidInstrumentError extends FinancialCalculationError {
    readonly instrument?: unknown | undefined;
    constructor(message: string, instrument?: unknown | undefined);
}
/**
 * Creates a branded BasisPoints value
 */
export declare function asBasisPoints(value: number): BasisPoints;
/**
 * Creates a branded Percentage value
 */
export declare function asPercentage(value: number): Percentage;
/**
 * Converts basis points to percentage
 */
export declare function bpsToPercentage(bps: BasisPoints): Percentage;
/**
 * Converts percentage to basis points
 */
export declare function percentageToBps(pct: Percentage): BasisPoints;
/**
 * Calculates year fraction between two dates using specified convention
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param convention - Day count convention
 * @returns Year fraction
 */
export declare function yearFraction(startDate: Date, endDate: Date, convention: DayCountConvention): number;
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
export declare function priceFromYield(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date): number;
/**
 * Calculates the dirty price (includes accrued interest)
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Yield to maturity as percentage
 * @param settlementDate - Settlement date
 * @returns Dirty price (includes accrued interest)
 */
export declare function dirtyPrice(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date): number;
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
export declare function yieldFromPrice(bond: FixedRateBond, price: number, settlementDate: Date, initialGuess?: Percentage): Percentage;
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
export declare function zeroCouponBondPrice(bond: ZeroCouponBond, yieldRate: Percentage, settlementDate: Date): number;
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
export declare function floatingRateNotePrice(frn: FloatingRateNote, currentRate: Percentage, discountRate: Percentage, settlementDate: Date): number;
/**
 * Calculates accrued interest on a bond
 *
 * @param bond - Fixed rate bond
 * @param settlementDate - Settlement date
 * @returns Accrued interest
 */
export declare function accruedInterest(bond: FixedRateBond, settlementDate: Date): number;
/**
 * Alternative accrued interest calculation using 30/360 convention
 */
export declare function accruedInterest30_360(bond: FixedRateBond, settlementDate: Date): number;
/**
 * Alternative accrued interest calculation using Actual/360 convention
 */
export declare function accruedInterestActual360(bond: FixedRateBond, settlementDate: Date): number;
/**
 * Alternative accrued interest calculation using Actual/365 convention
 */
export declare function accruedInterestActual365(bond: FixedRateBond, settlementDate: Date): number;
/**
 * Alternative accrued interest calculation using Actual/Actual convention
 */
export declare function accruedInterestActualActual(bond: FixedRateBond, settlementDate: Date): number;
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
export declare function bootstrapYieldCurve(bonds: FixedRateBond[], prices: number[], settlementDate: Date): YieldCurve;
/**
 * Fits a Nelson-Siegel yield curve model
 *
 * Model: y(t) = β₀ + β₁ * ((1 - e^(-t/λ)) / (t/λ)) + β₂ * (((1 - e^(-t/λ)) / (t/λ)) - e^(-t/λ))
 *
 * @param maturities - Maturity points in years
 * @param rates - Corresponding yield rates
 * @returns Nelson-Siegel parameters
 */
export declare function nelsonSiegelCurve(maturities: number[], rates: Percentage[]): NelsonSiegelParameters;
/**
 * Evaluates Nelson-Siegel curve at given maturity
 *
 * @param params - Nelson-Siegel parameters
 * @param maturity - Maturity in years
 * @returns Yield rate
 */
export declare function evaluateNelsonSiegel(params: NelsonSiegelParameters, maturity: number): Percentage;
/**
 * Fits Svensson extension of Nelson-Siegel model
 *
 * Adds fourth term for better long-end fit
 *
 * @param maturities - Maturity points in years
 * @param rates - Corresponding yield rates
 * @returns Svensson parameters (extends Nelson-Siegel)
 */
export declare function svenssonCurve(maturities: number[], rates: Percentage[]): NelsonSiegelParameters & {
    beta3: number;
    lambda2: number;
};
/**
 * Cubic spline interpolation for yield curve
 *
 * Creates smooth curve through given points
 *
 * @param points - Yield curve points
 * @param maturity - Target maturity
 * @returns Interpolated rate
 */
export declare function cubicSplineInterpolation(points: readonly YieldCurvePoint[], maturity: number): Percentage;
/**
 * Linear interpolation for yield curve
 *
 * @param points - Yield curve points
 * @param maturity - Target maturity
 * @returns Interpolated rate
 */
export declare function linearInterpolation(points: readonly YieldCurvePoint[], maturity: number): Percentage;
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
export declare function forwardRateFromSpot(spotRate1: Percentage, maturity1: number, spotRate2: Percentage, maturity2: number): Percentage;
/**
 * Calculates spot rate from forward rates
 *
 * @param forwardRates - Array of forward rates
 * @param maturities - Corresponding maturities
 * @returns Spot rate for final maturity
 */
export declare function spotRateFromForward(forwardRates: Percentage[], maturities: number[]): Percentage;
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
export declare function macaulayDuration(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date): number;
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
export declare function modifiedDuration(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date): number;
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
export declare function effectiveDuration(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date, deltaYield?: BasisPoints): number;
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
export declare function keyRateDuration(bond: FixedRateBond, yieldCurve: YieldCurve, keyMaturity: number, settlementDate: Date, deltaYield?: BasisPoints): number;
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
export declare function convexity(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date): number;
/**
 * Calculates effective convexity using finite differences
 *
 * @param bond - Fixed rate bond
 * @param yieldRate - Base yield
 * @param settlementDate - Settlement date
 * @param deltaYield - Yield change for calculation
 * @returns Effective convexity
 */
export declare function effectiveConvexity(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date, deltaYield?: BasisPoints): number;
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
export declare function dollarDuration(bond: FixedRateBond, yieldRate: Percentage, settlementDate: Date): number;
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
export declare function yieldToMaturity(bond: FixedRateBond, price: number, settlementDate: Date): Percentage;
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
export declare function yieldToCall(bond: FixedRateBond, price: number, settlementDate: Date, callDate: Date, callPrice: number): Percentage;
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
export declare function yieldToPut(bond: FixedRateBond, price: number, settlementDate: Date, putDate: Date, putPrice: number): Percentage;
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
export declare function yieldToWorst(bond: FixedRateBond, price: number, settlementDate: Date, callSchedule?: Array<{
    date: Date;
    price: number;
}>, putSchedule?: Array<{
    date: Date;
    price: number;
}>): Percentage;
/**
 * Calculates current yield
 *
 * Formula: Current Yield = Annual Coupon / Price
 *
 * @param bond - Fixed rate bond
 * @param price - Market price
 * @returns Current yield
 */
export declare function currentYield(bond: FixedRateBond, price: number): Percentage;
/**
 * Calculates simple yield (not compounded)
 *
 * @param bond - Fixed rate bond
 * @param price - Market price
 * @param settlementDate - Settlement date
 * @returns Simple yield
 */
export declare function simpleYield(bond: FixedRateBond, price: number, settlementDate: Date): Percentage;
/**
 * Calculates discount margin for floating rate notes
 *
 * @param frn - Floating rate note
 * @param price - Market price
 * @param referenceRate - Current reference rate
 * @param settlementDate - Settlement date
 * @returns Discount margin in basis points
 */
export declare function discountMargin(frn: FloatingRateNote, price: number, referenceRate: Percentage, settlementDate: Date): BasisPoints;
/**
 * Generates all bond cash flows
 *
 * @param bond - Fixed rate bond
 * @param settlementDate - Settlement date
 * @returns Array of cash flows
 */
export declare function generateBondCashFlows(bond: FixedRateBond, settlementDate: Date): CashFlow[];
/**
 * Calculates present value of cash flows
 *
 * @param cashFlows - Array of cash flows
 * @param discountRate - Discount rate as percentage
 * @param valuationDate - Valuation date
 * @param dayCount - Day count convention
 * @returns Present value
 */
export declare function presentValueOfCashFlows(cashFlows: readonly CashFlow[], discountRate: Percentage, valuationDate: Date, dayCount: DayCountConvention): number;
/**
 * Calculates duration from cash flows
 *
 * @param cashFlows - Array of cash flows
 * @param discountRate - Discount rate
 * @param valuationDate - Valuation date
 * @param dayCount - Day count convention
 * @returns Duration in years
 */
export declare function cashFlowDuration(cashFlows: readonly CashFlow[], discountRate: Percentage, valuationDate: Date, dayCount: DayCountConvention): number;
/**
 * Calculates convexity from cash flows
 *
 * @param cashFlows - Array of cash flows
 * @param discountRate - Discount rate
 * @param valuationDate - Valuation date
 * @param dayCount - Day count convention
 * @returns Convexity
 */
export declare function cashFlowConvexity(cashFlows: readonly CashFlow[], discountRate: Percentage, valuationDate: Date, dayCount: DayCountConvention): number;
/**
 * Analyzes bond ladder strategy
 *
 * @param bonds - Array of bonds in ladder
 * @param yields - Corresponding yields
 * @param settlementDate - Settlement date
 * @returns Ladder analytics
 */
export declare function bondLadderAnalysis(bonds: FixedRateBond[], yields: Percentage[], settlementDate: Date): {
    averageDuration: number;
    averageYield: Percentage;
    totalValue: number;
    annualCashFlow: number;
};
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
export declare function zSpreadCalculation(bond: FixedRateBond, price: number, yieldCurve: YieldCurve, settlementDate: Date): BasisPoints;
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
export declare function optionAdjustedSpread(bond: FixedRateBond & {
    callable?: boolean;
    callDates?: Date[];
    callPrices?: number[];
}, price: number, yieldCurve: YieldCurve, volatility: Percentage, settlementDate: Date): BasisPoints;
/**
 * Decomposes credit spread into components
 *
 * @param corporateYield - Corporate bond yield
 * @param treasuryYield - Treasury yield
 * @param expectedLoss - Expected loss from default
 * @returns Spread components
 */
export declare function creditSpreadDecomposition(corporateYield: Percentage, treasuryYield: Percentage, expectedLoss: Percentage): {
    totalSpread: BasisPoints;
    defaultRiskSpread: BasisPoints;
    liquidityPremium: BasisPoints;
    taxEffect: BasisPoints;
};
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
export declare function defaultProbability(creditSpread: BasisPoints, recoveryRate: number, maturity: number): Percentage;
/**
 * Models MBS prepayment using PSA (Public Securities Association) standard
 *
 * PSA assumes CPR increases linearly to 6% at month 30, then constant
 *
 * @param monthsFromOrigination - Months since MBS origination
 * @param psaSpeed - PSA speed as percentage (100% = standard)
 * @returns Conditional Prepayment Rate (CPR)
 */
export declare function mbsPrepaymentPSA(monthsFromOrigination: number, psaSpeed?: Percentage): Percentage;
/**
 * Calculates MBS weighted average life (WAL)
 *
 * @param principalPayments - Array of principal payment amounts
 * @param periods - Corresponding time periods (months)
 * @returns Weighted average life in years
 */
export declare function mbsWeightedAverageLife(principalPayments: readonly number[], periods: readonly number[]): number;
/**
 * Generates ABS cash flow waterfall structure
 *
 * Models priority of payments in asset-backed securities
 *
 * @param totalCashFlow - Total cash flow available
 * @param tranches - Array of tranches with sizes and priorities
 * @returns Cash flow distribution to each tranche
 */
export declare function absCashFlowWaterfall(totalCashFlow: number, tranches: Array<{
    name: string;
    size: number;
    priority: number;
    rate: Percentage;
}>): Array<{
    tranche: string;
    interest: number;
    principal: number;
    remaining: number;
}>;
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
export declare function callableBondPrice(bond: FixedRateBond & {
    callable: true;
    callDates: Date[];
    callPrices: number[];
}, yieldRate: Percentage, volatility: Percentage, settlementDate: Date, callPrice: number): number;
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
export declare function putableBondPrice(bond: FixedRateBond & {
    putable: true;
    putDates: Date[];
    putPrices: number[];
}, yieldRate: Percentage, volatility: Percentage, settlementDate: Date, putPrice: number): number;
//# sourceMappingURL=fixed-income-analytics-kit.d.ts.map