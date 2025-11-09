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
/**
 * Branded type for basis points
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
 * Branded type for volatility (annualized)
 */
export type Volatility = number & {
    readonly __brand: 'Volatility';
};
/**
 * Option type
 */
export declare enum OptionType {
    Call = "call",
    Put = "put"
}
/**
 * Option style
 */
export declare enum OptionStyle {
    European = "european",
    American = "american",
    Bermudan = "bermudan"
}
/**
 * Barrier option type
 */
export declare enum BarrierType {
    UpAndOut = "up-and-out",
    DownAndOut = "down-and-out",
    UpAndIn = "up-and-in",
    DownAndIn = "down-and-in"
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
    readonly timeToExpiry: number;
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
    readonly charm?: number;
    readonly vanna?: number;
    readonly volga?: number;
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
    readonly frequency: number;
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
    readonly alpha: number;
    readonly beta: number;
    readonly rho: number;
    readonly nu: number;
}
export declare class DerivativePricingError extends Error {
    readonly context?: Record & lt;
    constructor(message: string, context?: Record & lt, string: any, unknown: any, : any, gt: any);
}
export declare class ConvergenceError extends DerivativePricingError {
    readonly iterations: number;
    constructor(message: string, iterations: number);
}
export declare class InvalidParameterError extends DerivativePricingError {
    readonly parameter?: string | undefined;
    constructor(message: string, parameter?: string | undefined);
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
 * Creates a branded Volatility value
 */
export declare function asVolatility(value: number): Volatility;
/**
 * Converts basis points to percentage
 */
export declare function bpsToPercentage(bps: BasisPoints): Percentage;
/**
 * Standard normal cumulative distribution function (CDF)
 *
 * Uses Abramowitz and Stegun approximation (error < 7.5e-8)
 *
 * @param x - Input value
 * @returns N(x)
 */
export declare function cumulativeNormalDistribution(x: number): number;
/**
 * Standard normal probability density function (PDF)
 *
 * @param x - Input value
 * @returns n(x)
 */
export declare function normalDensity(x: number): number;
/**
 * Calculates year fraction between two dates
 */
export declare function yearFraction(startDate: Date, endDate: Date): number;
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
export declare function blackScholesCall(data: OptionMarketData): number;
/**
 * Black-Scholes European put option pricing
 *
 * Formula: P = Ke⁻ʳᵀN(-d₂) - S₀N(-d₁)
 *
 * @param data - Market data
 * @returns Put option price
 */
export declare function blackScholesPut(data: OptionMarketData): number;
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
export declare function black76FuturesOption(futuresPrice: number, strike: number, timeToExpiry: number, riskFreeRate: Percentage, volatility: Volatility, optionType: OptionType): number;
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
export declare function binomialTreeCRR(data: OptionMarketData, optionType: OptionType, style: OptionStyle, steps?: number): number;
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
export declare function binomialTreeJR(data: OptionMarketData, optionType: OptionType, style: OptionStyle, steps?: number): number;
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
export declare function monteCarloEuropean(data: OptionMarketData, optionType: OptionType, paths?: number, seed?: number): number;
/**
 * Monte Carlo Asian option pricing (arithmetic average)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @param observations - Number of averaging observations
 * @param paths - Number of simulation paths
 * @returns Option price
 */
export declare function monteCarloAsian(data: OptionMarketData, optionType: OptionType, observations: number, paths?: number): number;
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
export declare function monteCarloBarrier(data: OptionMarketData, barrierType: BarrierType, barrier: number, optionType: OptionType, paths?: number, steps?: number): number;
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
export declare function americanOptionBinomial(data: OptionMarketData, optionType: OptionType, steps?: number): number;
/**
 * Calculates option delta
 *
 * Delta = ∂V/∂S (sensitivity to underlying price)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Delta
 */
export declare function calculateDelta(data: OptionMarketData, optionType: OptionType): number;
/**
 * Calculates option gamma
 *
 * Gamma = ∂²V/∂S² (rate of change of delta)
 *
 * @param data - Market data
 * @returns Gamma (same for calls and puts)
 */
export declare function calculateGamma(data: OptionMarketData): number;
/**
 * Calculates option vega
 *
 * Vega = ∂V/∂σ (sensitivity to volatility)
 *
 * @param data - Market data
 * @returns Vega (same for calls and puts)
 */
export declare function calculateVega(data: OptionMarketData): number;
/**
 * Calculates option theta
 *
 * Theta = ∂V/∂t (time decay)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Theta (per day)
 */
export declare function calculateTheta(data: OptionMarketData, optionType: OptionType): number;
/**
 * Calculates option rho
 *
 * Rho = ∂V/∂r (sensitivity to interest rate)
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Rho (per 1% change in rate)
 */
export declare function calculateRho(data: OptionMarketData, optionType: OptionType): number;
/**
 * Calculates charm (delta decay)
 *
 * Charm = ∂Delta/∂t
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Charm
 */
export declare function calculateCharm(data: OptionMarketData, optionType: OptionType): number;
/**
 * Calculates vanna (cross derivative of delta and vega)
 *
 * Vanna = ∂Delta/∂σ = ∂Vega/∂S
 *
 * @param data - Market data
 * @returns Vanna
 */
export declare function calculateVanna(data: OptionMarketData): number;
/**
 * Calculates volga (vega convexity)
 *
 * Volga = ∂Vega/∂σ = ∂²V/∂σ²
 *
 * @param data - Market data
 * @returns Volga
 */
export declare function calculateVolga(data: OptionMarketData): number;
/**
 * Calculates all Greeks for an option
 *
 * @param data - Market data
 * @param optionType - Call or Put
 * @returns Complete Greeks set
 */
export declare function portfolioGreeks(data: OptionMarketData, optionType: OptionType): Greeks;
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
export declare function impliedVolatilityFromDelta(targetDelta: number, data: Omit<OptionMarketData, 'volatility'>, optionType: OptionType): Volatility;
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
export declare function commodityFuturesPrice(spot: number, riskFreeRate: Percentage, convenienceYield: Percentage, storageRate: Percentage, timeToExpiry: number): number;
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
export declare function indexFuturesPrice(spot: number, riskFreeRate: Percentage, dividendYield: Percentage, timeToExpiry: number): number;
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
export declare function bondFuturesPrice(bondPrice: number, conversionFactor: number, accrued: number, repoRate: Percentage, timeToExpiry: number): number;
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
export declare function currencyFuturesPrice(spot: number, domesticRate: Percentage, foreignRate: Percentage, timeToExpiry: number): number;
/**
 * Interest rate swap valuation
 *
 * @param swap - IRS details
 * @param discountCurve - Discount curve (zero rates)
 * @param forecastCurve - Forecast curve for floating rates
 * @param valuationDate - Valuation date
 * @returns Swap value (positive = receive fixed)
 */
export declare function interestRateSwapValue(swap: InterestRateSwap, discountCurve: Array<{
    maturity: number;
    rate: Percentage;
}>, forecastCurve: Array<{
    maturity: number;
    rate: Percentage;
}>, valuationDate: Date): number;
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
export declare function swapParRate(notional: number, maturity: number, frequency: number, discountCurve: Array<{
    maturity: number;
    rate: Percentage;
}>): Percentage;
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
export declare function crossCurrencySwapValue(notionalDomestic: number, notionalForeign: number, domesticRate: Percentage, foreignRate: Percentage, spotFX: number, maturity: number, frequency: number, discountCurveDomestic: Array<{
    maturity: number;
    rate: Percentage;
}>, discountCurveForeign: Array<{
    maturity: number;
    rate: Percentage;
}>): number;
/**
 * Credit default swap pricing
 *
 * @param cds - CDS details
 * @param defaultProbability - Cumulative default probability
 * @param discountCurve - Risk-free discount curve
 * @param valuationDate - Valuation date
 * @returns CDS value
 */
export declare function creditDefaultSwapPrice(cds: CreditDefaultSwap, defaultProbability: Percentage, discountCurve: Array<{
    maturity: number;
    rate: Percentage;
}>, valuationDate: Date): number;
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
export declare function cdsSpreadCalculation(notional: number, defaultProbability: Percentage, recoveryRate: Percentage, maturity: number, discountCurve: Array<{
    maturity: number;
    rate: Percentage;
}>): BasisPoints;
/**
 * FX swap points calculation
 *
 * @param spot - Spot FX rate
 * @param domesticRate - Domestic interest rate
 * @param foreignRate - Foreign interest rate
 * @param days - Number of days
 * @returns Swap points (forward - spot)
 */
export declare function fxSwapPoints(spot: number, domesticRate: Percentage, foreignRate: Percentage, days: number): number;
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
export declare function totalReturnSwap(notional: number, assetReturn: Percentage, fundingSpread: BasisPoints, referenceRate: Percentage, maturity: number): number;
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
export declare function barrierOptionUpAndOut(data: OptionMarketData, barrier: number, rebate: number, optionType: OptionType): number;
/**
 * Barrier option pricing - Down-and-Out
 *
 * @param data - Market data
 * @param barrier - Barrier level
 * @param rebate - Rebate paid if barrier hit
 * @param optionType - Call or Put
 * @returns Option price
 */
export declare function barrierOptionDownAndOut(data: OptionMarketData, barrier: number, rebate: number, optionType: OptionType): number;
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
export declare function asianOptionAnalytic(data: OptionMarketData, observations: number, optionType: OptionType): number;
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
export declare function digitalOption(data: OptionMarketData, payout: number, optionType: OptionType): number;
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
export declare function lookbackOption(data: OptionMarketData, optionType: OptionType, paths?: number, steps?: number): number;
/**
 * Calculates payoff for option strategy at expiry
 *
 * @param strategy - Array of options with positions
 * @param spotPrices - Array of spot prices to evaluate
 * @returns Payoff profile
 */
export declare function strategyPayoff(strategy: Array<{
    option: EuropeanOption;
    position: number;
}>, spotPrices: number[]): Array<{
    spot: number;
    payoff: number;
}>;
/**
 * Calculates Greeks for option strategy
 *
 * @param strategy - Array of options with positions and market data
 * @returns Aggregated Greeks
 */
export declare function strategyGreeks(strategy: Array<{
    option: EuropeanOption;
    position: number;
    marketData: OptionMarketData;
}>): Greeks;
/**
 * Calculates break-even points for option strategy
 *
 * @param strategy - Array of options with positions and prices
 * @returns Break-even spot prices
 */
export declare function breakEvenAnalysis(strategy: Array<{
    option: EuropeanOption;
    position: number;
    price: number;
}>): number[];
/**
 * Calculates maximum profit and loss for strategy
 *
 * @param strategy - Array of options with positions and prices
 * @returns Max profit, max loss, and spot prices where they occur
 */
export declare function maxProfitLoss(strategy: Array<{
    option: EuropeanOption;
    position: number;
    price: number;
}>): {
    maxProfit: number;
    maxProfitAt: number;
    maxLoss: number;
    maxLossAt: number;
};
/**
 * Calculates implied volatility using Newton-Raphson
 *
 * @param marketPrice - Observed option price
 * @param data - Market data without volatility
 * @param optionType - Call or Put
 * @returns Implied volatility
 */
export declare function impliedVolatilityNewton(marketPrice: number, data: Omit<OptionMarketData, 'volatility'>, optionType: OptionType): Volatility;
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
export declare function impliedVolatilityBrent(marketPrice: number, data: Omit<OptionMarketData, 'volatility'>, optionType: OptionType): Volatility;
/**
 * Fits volatility smile using polynomial
 *
 * @param smilePoints - Observed strike-volatility pairs
 * @param degree - Polynomial degree (default 2 for quadratic)
 * @returns Polynomial coefficients
 */
export declare function volatilitySmileFit(smilePoints: readonly VolatilitySmilePoint[], degree?: number): number[];
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
export declare function sabrVolatilitySurface(params: SABRParameters, forward: number, strike: number, timeToExpiry: number): Volatility;
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
export declare function historicalVolatility(prices: readonly number[], method?: 'close-to-close' | 'parkinson' | 'garman-klass', annualizationFactor?: number): Volatility;
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
export declare function valueAtRiskParametric(portfolioValue: number, expectedReturn: Percentage, volatility: Volatility, confidenceLevel: number, timeHorizon: number): number;
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
export declare function expectedShortfall(portfolioValue: number, expectedReturn: Percentage, volatility: Volatility, confidenceLevel: number, timeHorizon: number): number;
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
export declare function scenarioAnalysis(baseValue: number, scenarios: Array<{
    name: string;
    spotChange: Percentage;
    volChange?: Percentage;
    rateChange?: Percentage;
}>, sensitivities: {
    delta: number;
    gamma: number;
    vega?: number;
    rho?: number;
}): Array<{
    scenario: string;
    value: number;
    pnl: number;
}>;
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
export declare function stressTestFramework(baseValue: number, stressTests: Array<{
    name: string;
    spotChange: Percentage;
    volChange: Percentage;
    rateChange: Percentage;
}>, sensitivities: Greeks): Array<{
    test: string;
    value: number;
    pnl: number;
    percentChange: number;
}>;
//# sourceMappingURL=derivatives-pricing-kit.d.ts.map