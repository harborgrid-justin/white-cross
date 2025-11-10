/**
 * LOC: CMDTRDK001
 * File: /reuse/trading/commodities-trading-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Commodity trading services
 *   - Risk management systems
 *   - Physical commodity platforms
 *   - Market analytics dashboards
 */
/**
 * File: /reuse/trading/commodities-trading-kit.ts
 * Locator: WC-TRAD-COMMOD-001
 * Purpose: Bloomberg Terminal-quality Commodities Trading Analytics - futures, physical, energy, metals, agricultural, spreads, contango/backwardation analysis
 *
 * Upstream: Independent utility module for professional commodity trading and analytics
 * Downstream: ../backend/*, Trading platforms, risk systems, physical commodity operations, market data services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 58 utility functions for commodity futures pricing, physical commodity analytics, energy trading (Oil/Gas/Power),
 * metals trading, agricultural commodities, spread trading, contango/backwardation analysis, storage and transport cost analytics,
 * commodity hedge ratios, seasonal pattern analysis, and commodity index construction
 *
 * LLM Context: Comprehensive Bloomberg Terminal-quality commodity trading utilities for implementing production-ready commodity futures,
 * physical delivery, derivatives pricing, and market analytics. Provides professional trader-grade accuracy for energy markets
 * (WTI/Brent oil, natural gas, power), metals markets (precious and base metals, LME), agricultural commodities (grains, softs, livestock),
 * spread trading (calendar, inter-commodity, location), term structure analysis, storage economics, hedge ratio optimization,
 * seasonal pattern extraction, and commodity index methodologies.
 */
/** Commodity asset class */
export type CommodityClass = 'Energy' | 'Metals' | 'Agricultural' | 'Livestock' | 'Softs';
/** Commodity subcategory */
export type CommodityType = 'Crude Oil' | 'Natural Gas' | 'Gasoline' | 'Heating Oil' | 'Coal' | 'Power' | 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Copper' | 'Aluminum' | 'Zinc' | 'Nickel' | 'Lead' | 'Corn' | 'Wheat' | 'Soybeans' | 'Rice' | 'Cotton' | 'Sugar' | 'Coffee' | 'Cocoa' | 'Live Cattle' | 'Feeder Cattle' | 'Lean Hogs';
/** Commodity contract specification */
export interface CommodityContract {
    symbol: string;
    type: CommodityType;
    class: CommodityClass;
    exchange: string;
    /** Contract size (e.g., 1000 barrels for WTI) */
    contractSize: number;
    /** Pricing unit (e.g., 'USD/barrel', 'USD/ton') */
    pricingUnit: string;
    /** Tick size (minimum price movement) */
    tickSize: number;
    /** Tick value in USD */
    tickValue: number;
    /** Delivery month */
    deliveryMonth: Date;
    /** First notice day */
    firstNoticeDay?: Date;
    /** Last trading day */
    lastTradingDay: Date;
}
/** Commodity futures quote */
export interface CommodityFuturesQuote {
    contract: CommodityContract;
    bid: number;
    ask: number;
    last: number;
    settle: number;
    volume: number;
    openInterest: number;
    timestamp: Date;
}
/** Physical commodity specification */
export interface PhysicalCommodity {
    type: CommodityType;
    /** Quality grade (e.g., 'Light Sweet' for crude oil) */
    grade: string;
    /** Delivery location */
    location: string;
    /** Quality specifications */
    specs: {
        [key: string]: number | string;
    };
}
/** Energy product specification */
export interface EnergyProduct {
    product: 'WTI' | 'Brent' | 'Natural Gas' | 'RBOB' | 'Heating Oil' | 'Power';
    /** API gravity for crude oil */
    apiGravity?: number;
    /** Sulfur content percentage */
    sulfurContent?: number;
    /** Heat content (MMBtu) for natural gas */
    heatContent?: number;
    /** Delivery point */
    deliveryPoint: string;
}
/** Metals specification */
export interface MetalsProduct {
    metal: 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Copper' | 'Aluminum' | 'Zinc' | 'Nickel' | 'Lead';
    /** Purity (e.g., 0.999 for gold) */
    purity: number;
    /** Form (e.g., 'bars', 'cathodes') */
    form: string;
    /** LME brand certification (for base metals) */
    lmeBrand?: string;
    /** Delivery location */
    deliveryLocation: string;
}
/** Agricultural commodity specification */
export interface AgriculturalProduct {
    crop: 'Corn' | 'Wheat' | 'Soybeans' | 'Rice' | 'Cotton' | 'Sugar' | 'Coffee' | 'Cocoa';
    /** Crop grade (e.g., '#2 Yellow' for corn) */
    grade: string;
    /** Harvest year */
    harvestYear: number;
    /** Moisture content percentage */
    moistureContent?: number;
    /** Test weight */
    testWeight?: number;
}
/** Commodity spread */
export interface CommoditySpread {
    /** Spread type */
    type: 'calendar' | 'inter-commodity' | 'location' | 'quality' | 'crack' | 'spark' | 'crush';
    /** Long leg contract */
    longLeg: CommodityContract;
    /** Short leg contract */
    shortLeg: CommodityContract;
    /** Spread value */
    spreadValue: number;
    /** Spread ratio (e.g., 3:2:1 for crack spread) */
    ratio?: number[];
}
/** Term structure point */
export interface TermStructurePoint {
    maturity: Date;
    /** Days to maturity */
    daysToMaturity: number;
    price: number;
    impliedYield?: number;
}
/** Commodity term structure (forward curve) */
export interface TermStructure {
    commodity: CommodityType;
    curve: TermStructurePoint[];
    /** Spot price */
    spotPrice: number;
    /** Curve shape: 'contango', 'backwardation', 'flat' */
    shape: 'contango' | 'backwardation' | 'flat';
    timestamp: Date;
}
/** Storage cost specification */
export interface StorageCost {
    commodity: CommodityType;
    location: string;
    /** Cost per unit per month */
    costPerUnitPerMonth: number;
    /** Insurance cost per unit per month */
    insuranceCost: number;
    /** Financing cost (annualized) */
    financingRate: number;
    /** Capacity in units */
    capacity: number;
    /** Current utilization percentage */
    utilization: number;
}
/** Transportation cost specification */
export interface TransportationCost {
    commodity: CommodityType;
    fromLocation: string;
    toLocation: string;
    /** Distance in miles or kilometers */
    distance: number;
    /** Mode of transport */
    mode: 'pipeline' | 'rail' | 'truck' | 'ship' | 'barge';
    /** Cost per unit */
    costPerUnit: number;
    /** Transit time in days */
    transitTime: number;
}
/** Seasonal pattern data */
export interface SeasonalPattern {
    commodity: CommodityType;
    /** Monthly factors (12 values, one per month) */
    monthlyFactors: number[];
    /** Confidence interval */
    confidence: number;
    /** Years of data used */
    yearsOfData: number;
}
/** Commodity index specification */
export interface CommodityIndex {
    name: string;
    components: Array<{
        commodity: CommodityType;
        weight: number;
        contract: CommodityContract;
    }>;
    /** Index methodology */
    methodology: 'equal-weight' | 'production-weight' | 'liquidity-weight' | 'market-cap-weight';
    /** Roll methodology */
    rollMethod: 'front-month' | 'optimized' | 'constant-maturity';
    /** Rebalance frequency in days */
    rebalanceFrequency: number;
}
/** Hedge ratio calculation result */
export interface CommodityHedgeResult {
    optimalRatio: number;
    effectiveness: number;
    basisRisk: number;
    recommendedContracts: number;
}
/**
 * Calculate commodity futures fair value using cost of carry model
 *
 * @param spotPrice - Current spot price
 * @param storageCostPerYear - Annual storage cost per unit
 * @param financingRate - Annual financing rate
 * @param convenienceYield - Convenience yield (annualized)
 * @param timeToMaturity - Time to maturity in years
 * @returns Fair value of futures contract
 *
 * @example
 * ```typescript
 * const fairValue = calculateFuturesFairValue(
 *   50.00, // $50 spot price
 *   2.50,  // $2.50 storage cost per year
 *   0.05,  // 5% financing rate
 *   0.02,  // 2% convenience yield
 *   0.25   // 3 months to maturity
 * );
 * // Returns futures fair value
 * ```
 */
export declare function calculateFuturesFairValue(spotPrice: number, storageCostPerYear: number, financingRate: number, convenienceYield: number, timeToMaturity: number): number;
/**
 * Calculate cost of carry for commodity futures
 *
 * @param spotPrice - Current spot price
 * @param futuresPrice - Futures price
 * @param timeToMaturity - Time to maturity in years
 * @returns Implied cost of carry (annualized)
 *
 * @example
 * ```typescript
 * const costOfCarry = calculateCostOfCarry(50.00, 51.25, 0.25);
 * // Returns annualized cost of carry rate
 * ```
 */
export declare function calculateCostOfCarry(spotPrice: number, futuresPrice: number, timeToMaturity: number): number;
/**
 * Calculate futures convergence to spot
 * Analyzes how futures price converges to spot as maturity approaches
 *
 * @param currentFuturesPrice - Current futures price
 * @param spotPrice - Current spot price
 * @param daysToMaturity - Days remaining to maturity
 * @param initialBasis - Initial basis at contract inception
 * @returns Convergence metrics
 *
 * @example
 * ```typescript
 * const convergence = calculateFuturesConvergence(50.50, 50.00, 10, 2.00);
 * // Analyzes convergence pattern as contract approaches maturity
 * ```
 */
export declare function calculateFuturesConvergence(currentFuturesPrice: number, spotPrice: number, daysToMaturity: number, initialBasis: number): {
    currentBasis: number;
    basisDecay: number;
    convergenceRate: number;
    expectedBasisAtMaturity: number;
};
/**
 * Calculate futures basis (difference between futures and spot)
 *
 * @param futuresPrice - Futures price
 * @param spotPrice - Spot price
 * @param asPercentage - Return as percentage of spot price
 * @returns Basis (futures - spot)
 *
 * @example
 * ```typescript
 * const basis = calculateFuturesBasis(51.25, 50.00, false);
 * // Returns: 1.25
 *
 * const basisPct = calculateFuturesBasis(51.25, 50.00, true);
 * // Returns: 2.5 (%)
 * ```
 */
export declare function calculateFuturesBasis(futuresPrice: number, spotPrice: number, asPercentage?: boolean): number;
/**
 * Calculate roll yield from futures term structure
 *
 * @param nearMonthPrice - Near month futures price
 * @param farMonthPrice - Far month futures price
 * @param daysToNearExpiry - Days to near contract expiry
 * @param daysBetweenContracts - Days between near and far contract expiries
 * @returns Annualized roll yield
 *
 * @example
 * ```typescript
 * const rollYield = calculateRollYield(50.00, 52.00, 30, 30);
 * // Returns annualized yield from rolling futures contracts
 * ```
 */
export declare function calculateRollYield(nearMonthPrice: number, farMonthPrice: number, daysToNearExpiry: number, daysBetweenContracts: number): number;
/**
 * Calculate implied financing rate from futures prices
 *
 * @param spotPrice - Spot price
 * @param futuresPrice - Futures price
 * @param timeToMaturity - Time to maturity in years
 * @param storageCost - Known storage cost (annualized per unit)
 * @param convenienceYield - Known convenience yield (annualized)
 * @returns Implied financing rate
 *
 * @example
 * ```typescript
 * const impliedRate = calculateFuturesImpliedRate(50.00, 51.25, 0.25, 2.00, 0.02);
 * // Returns implied financing rate embedded in futures price
 * ```
 */
export declare function calculateFuturesImpliedRate(spotPrice: number, futuresPrice: number, timeToMaturity: number, storageCost: number, convenienceYield: number): number;
/**
 * Adjust commodity price for quality differentials
 *
 * @param basePrice - Base price for standard quality
 * @param actualQuality - Actual quality metrics
 * @param standardQuality - Standard quality metrics
 * @param qualityPremiums - Premium/discount per quality point
 * @returns Quality-adjusted price
 *
 * @example
 * ```typescript
 * const adjustedPrice = adjustCommodityQuality(
 *   50.00,
 *   { protein: 12.5, moisture: 14.0 },
 *   { protein: 12.0, moisture: 15.0 },
 *   { protein: 0.10, moisture: -0.05 }
 * );
 * // Returns price adjusted for quality differences
 * ```
 */
export declare function adjustCommodityQuality(basePrice: number, actualQuality: {
    [key: string]: number;
}, standardQuality: {
    [key: string]: number;
}, qualityPremiums: {
    [key: string]: number;
}): number;
/**
 * Calculate location price differential
 *
 * @param benchmarkPrice - Benchmark location price
 * @param transportCost - Transportation cost from benchmark to delivery location
 * @param localSupplyDemand - Local supply/demand adjustment factor (-1 to 1)
 * @returns Location-adjusted price
 *
 * @example
 * ```typescript
 * const localPrice = calculateLocationDifferential(
 *   50.00,  // Benchmark price
 *   2.50,   // Transport cost
 *   0.10    // 10% premium due to local demand
 * );
 * // Returns price at delivery location
 * ```
 */
export declare function calculateLocationDifferential(benchmarkPrice: number, transportCost: number, localSupplyDemand?: number): number;
/**
 * Calculate physical delivery cost
 *
 * @param quantity - Quantity to deliver
 * @param transportCost - Transportation cost per unit
 * @param loadingCost - Loading cost per unit
 * @param unloadingCost - Unloading cost per unit
 * @param insuranceCost - Insurance cost per unit
 * @param inspectionCost - Quality inspection cost (fixed)
 * @returns Total delivery cost
 *
 * @example
 * ```typescript
 * const deliveryCost = calculateDeliveryCost(
 *   10000,  // 10,000 units
 *   2.50,   // $2.50 transport per unit
 *   0.25,   // $0.25 loading per unit
 *   0.25,   // $0.25 unloading per unit
 *   0.10,   // $0.10 insurance per unit
 *   500     // $500 fixed inspection cost
 * );
 * ```
 */
export declare function calculateDeliveryCost(quantity: number, transportCost: number, loadingCost: number, unloadingCost: number, insuranceCost: number, inspectionCost: number): number;
/**
 * Calculate commodity storage cost economics
 *
 * @param quantity - Quantity to store
 * @param storageCostPerMonth - Storage cost per unit per month
 * @param months - Number of months to store
 * @param insuranceRate - Insurance as percentage of commodity value per year
 * @param commodityValue - Value per unit
 * @param financingRate - Financing rate (annualized)
 * @returns Total storage cost
 *
 * @example
 * ```typescript
 * const storageCost = calculateStorageCost(
 *   5000,   // 5,000 units
 *   0.50,   // $0.50 per unit per month
 *   6,      // 6 months
 *   0.02,   // 2% insurance rate per year
 *   50.00,  // $50 per unit value
 *   0.05    // 5% financing rate
 * );
 * ```
 */
export declare function calculateStorageCost(quantity: number, storageCostPerMonth: number, months: number, insuranceRate: number, commodityValue: number, financingRate: number): number;
/**
 * Validate physical delivery specifications
 *
 * @param physical - Physical commodity specification
 * @param contractSpecs - Contract specifications
 * @returns Validation result with any issues
 *
 * @example
 * ```typescript
 * const validation = validatePhysicalDelivery(
 *   { type: 'Corn', grade: '#2 Yellow', specs: { moisture: 14.5 } },
 *   { maxMoisture: 15.0, minTestWeight: 56.0 }
 * );
 * ```
 */
export declare function validatePhysicalDelivery(physical: PhysicalCommodity, contractSpecs: {
    [key: string]: number | string;
}): {
    isValid: boolean;
    issues: string[];
};
/**
 * Calculate WTI-Brent crude oil spread
 *
 * @param wtiPrice - WTI crude oil price
 * @param brentPrice - Brent crude oil price
 * @returns Spread value (WTI - Brent)
 *
 * @example
 * ```typescript
 * const spread = calculateWTIBrentSpread(75.50, 78.20);
 * // Returns: -2.70 (WTI trading at discount to Brent)
 * ```
 */
export declare function calculateWTIBrentSpread(wtiPrice: number, brentPrice: number): number;
/**
 * Calculate refinery crack spread (3-2-1)
 * Measures refinery margin: 3 barrels crude to 2 barrels gasoline + 1 barrel distillate
 *
 * @param crudePrice - Crude oil price per barrel
 * @param gasolinePrice - Gasoline price per barrel
 * @param distillatePrice - Distillate (heating oil/diesel) price per barrel
 * @param ratio - Crack ratio (default 3:2:1)
 * @returns Crack spread value
 *
 * @example
 * ```typescript
 * const crackSpread = calculateCrackSpread(
 *   75.00,  // Crude price
 *   95.00,  // Gasoline price
 *   85.00,  // Distillate price
 *   [3, 2, 1] // 3-2-1 crack
 * );
 * // Returns refinery margin per barrel of crude processed
 * ```
 */
export declare function calculateCrackSpread(crudePrice: number, gasolinePrice: number, distillatePrice: number, ratio?: [number, number, number]): number;
/**
 * Calculate spark spread (power generation margin)
 * Measures profit from burning natural gas to generate electricity
 *
 * @param powerPrice - Power price per MWh
 * @param gasPrice - Natural gas price per MMBtu
 * @param heatRate - Plant heat rate (MMBtu per MWh)
 * @param variableOM - Variable O&M cost per MWh
 * @returns Spark spread (power margin)
 *
 * @example
 * ```typescript
 * const sparkSpread = calculateSparkSpread(
 *   40.00,  // $40/MWh power price
 *   3.50,   // $3.50/MMBtu gas price
 *   7.5,    // 7.5 MMBtu/MWh heat rate
 *   2.00    // $2/MWh variable O&M
 * );
 * // Returns profit per MWh generated
 * ```
 */
export declare function calculateSparkSpread(powerPrice: number, gasPrice: number, heatRate: number, variableOM?: number): number;
/**
 * Calculate natural gas heat rate
 * Efficiency of converting gas to electricity
 *
 * @param mmbtuInput - MMBtu of gas input
 * @param mwhOutput - MWh of electricity output
 * @returns Heat rate (MMBtu/MWh)
 *
 * @example
 * ```typescript
 * const heatRate = calculateNaturalGasHeatRate(7500, 1000);
 * // Returns: 7.5 MMBtu/MWh
 * ```
 */
export declare function calculateNaturalGasHeatRate(mmbtuInput: number, mwhOutput: number): number;
/**
 * Calculate energy basis differential
 * Price difference between delivery points
 *
 * @param hubPrice - Price at major hub (e.g., Henry Hub for gas)
 * @param deliveryPointPrice - Price at delivery point
 * @param transportCost - Transportation cost
 * @returns Basis differential
 *
 * @example
 * ```typescript
 * const basis = calculateEnergyBasisDifferential(
 *   3.50,   // Henry Hub price
 *   3.75,   // Delivery point price
 *   0.20    // Transport cost
 * );
 * // Returns basis differential
 * ```
 */
export declare function calculateEnergyBasisDifferential(hubPrice: number, deliveryPointPrice: number, transportCost: number): number;
/**
 * Calculate power load shape value
 * Value of power generation matching demand profile
 *
 * @param hourlyPrices - 24-hour power prices
 * @param generationProfile - 24-hour generation profile (MWh per hour)
 * @returns Total revenue and load factor
 *
 * @example
 * ```typescript
 * const loadShape = calculatePowerLoadShape(
 *   [30, 28, ..., 45, 50], // 24 hourly prices
 *   [100, 100, ..., 150, 150] // 24 hourly generation MWh
 * );
 * ```
 */
export declare function calculatePowerLoadShape(hourlyPrices: number[], generationProfile: number[]): {
    totalRevenue: number;
    averagePrice: number;
    loadFactor: number;
};
/**
 * Optimize energy storage dispatch
 * Determine optimal charge/discharge schedule for storage
 *
 * @param hourlyPrices - 24-hour power prices
 * @param storageCapacity - Storage capacity in MWh
 * @param maxChargeRate - Maximum charge rate in MW
 * @param maxDischargeRate - Maximum discharge rate in MW
 * @param roundTripEfficiency - Round-trip efficiency (0-1)
 * @returns Optimal dispatch schedule and profit
 *
 * @example
 * ```typescript
 * const dispatch = optimizeEnergyStorage(
 *   [30, 28, ..., 45, 50], // 24 hourly prices
 *   100,   // 100 MWh capacity
 *   25,    // 25 MW charge rate
 *   25,    // 25 MW discharge rate
 *   0.85   // 85% round-trip efficiency
 * );
 * ```
 */
export declare function optimizeEnergyStorage(hourlyPrices: number[], storageCapacity: number, maxChargeRate: number, maxDischargeRate: number, roundTripEfficiency: number): {
    schedule: Array<{
        hour: number;
        action: 'charge' | 'discharge' | 'idle';
        mwh: number;
    }>;
    profit: number;
};
/**
 * Calculate energy transportation cost
 *
 * @param volume - Volume to transport (barrels, MMBtu, MWh)
 * @param distance - Distance in miles
 * @param mode - Transportation mode
 * @param unitCostPerMile - Cost per unit per mile
 * @returns Total transportation cost
 *
 * @example
 * ```typescript
 * const transportCost = calculateEnergyTransportCost(
 *   10000,     // 10,000 barrels
 *   500,       // 500 miles
 *   'pipeline',
 *   0.001      // $0.001 per barrel per mile
 * );
 * ```
 */
export declare function calculateEnergyTransportCost(volume: number, distance: number, mode: 'pipeline' | 'rail' | 'truck' | 'ship', unitCostPerMile: number): number;
/**
 * Calculate precious metal lease rate
 *
 * @param spotPrice - Spot price of metal
 * @param forwardPrice - Forward price of metal
 * @param timeToMaturity - Time to maturity in years
 * @param financingRate - Risk-free financing rate
 * @returns Implied lease rate (annualized)
 *
 * @example
 * ```typescript
 * const leaseRate = calculatePreciousMetalLease(
 *   1800,   // $1800/oz gold spot
 *   1795,   // $1795/oz forward
 *   1.0,    // 1 year
 *   0.05    // 5% financing rate
 * );
 * // Returns implied gold lease rate
 * ```
 */
export declare function calculatePreciousMetalLease(spotPrice: number, forwardPrice: number, timeToMaturity: number, financingRate: number): number;
/**
 * Calculate base metal premium over LME
 *
 * @param physicalPrice - Physical delivery price
 * @param lmePrice - LME cash or 3-month price
 * @param deliveryPremium - Known delivery premium component
 * @returns Net premium over LME
 *
 * @example
 * ```typescript
 * const premium = calculateBaseMetalPremium(
 *   8500,  // Physical copper price per ton
 *   8200,  // LME copper 3-month price
 *   150    // Delivery premium
 * );
 * // Returns net premium of $150/ton
 * ```
 */
export declare function calculateBaseMetalPremium(physicalPrice: number, lmePrice: number, deliveryPremium?: number): number;
/**
 * Calculate LME warehouse financing cost
 *
 * @param metalValue - Value of metal per ton
 * @param quantity - Quantity in tons
 * @param storageDays - Days in warehouse
 * @param warehouseRent - Warehouse rent per ton per day
 * @param financingRate - Financing rate (annualized)
 * @param loadOutFee - Load-out fee per ton
 * @returns Total warehouse financing cost
 *
 * @example
 * ```typescript
 * const cost = calculateLMEWarehouseFinancing(
 *   8000,   // $8000/ton copper value
 *   100,    // 100 tons
 *   90,     // 90 days storage
 *   0.50,   // $0.50/ton/day rent
 *   0.06,   // 6% financing rate
 *   15      // $15/ton load-out
 * );
 * ```
 */
export declare function calculateLMEWarehouseFinancing(metalValue: number, quantity: number, storageDays: number, warehouseRent: number, financingRate: number, loadOutFee: number): number;
/**
 * Adjust metal price for purity
 *
 * @param basePrice - Price for standard purity
 * @param standardPurity - Standard purity (e.g., 0.999 for gold)
 * @param actualPurity - Actual purity
 * @param weight - Weight in standard units
 * @returns Purity-adjusted price
 *
 * @example
 * ```typescript
 * const adjusted = calculateMetalsPurityAdjustment(
 *   1800,   // $1800/oz for .999 gold
 *   0.999,  // Standard .999 purity
 *   0.995,  // Actual .995 purity
 *   10      // 10 oz
 * );
 * ```
 */
export declare function calculateMetalsPurityAdjustment(basePrice: number, standardPurity: number, actualPurity: number, weight: number): number;
/**
 * Calculate gold-silver ratio
 *
 * @param goldPrice - Gold price per ounce
 * @param silverPrice - Silver price per ounce
 * @returns Gold-silver ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateGoldSilverRatio(1800, 24);
 * // Returns: 75 (ratio of gold to silver price)
 * ```
 */
export declare function calculateGoldSilverRatio(goldPrice: number, silverPrice: number): number;
/**
 * Calculate metals carry trade opportunity
 *
 * @param spotPrice - Spot price
 * @param forwardPrice - Forward price
 * @param storageCost - Storage cost per unit
 * @param financingRate - Financing rate (annualized)
 * @param timeToMaturity - Time to maturity in years
 * @returns Carry trade profit potential
 *
 * @example
 * ```typescript
 * const carry = calculateMetalsCarryTrade(
 *   1800,   // Spot gold
 *   1810,   // Forward gold
 *   5,      // $5/oz storage cost
 *   0.05,   // 5% financing rate
 *   1.0     // 1 year
 * );
 * ```
 */
export declare function calculateMetalsCarryTrade(spotPrice: number, forwardPrice: number, storageCost: number, financingRate: number, timeToMaturity: number): number;
/**
 * Calculate grain basis pattern
 * Analyze historical basis between cash and futures
 *
 * @param cashPrices - Historical cash prices
 * @param futuresPrices - Corresponding futures prices
 * @param harvestMonths - Months of harvest (for seasonal analysis)
 * @returns Basis statistics and pattern
 *
 * @example
 * ```typescript
 * const basisPattern = calculateGrainBasisPattern(
 *   [5.50, 5.45, 5.60, ...],
 *   [5.75, 5.70, 5.85, ...],
 *   [9, 10] // Sept-Oct harvest
 * );
 * ```
 */
export declare function calculateGrainBasisPattern(cashPrices: number[], futuresPrices: number[], harvestMonths: number[]): {
    averageBasis: number;
    harvestBasis: number;
    nonHarvestBasis: number;
    basisVolatility: number;
};
/**
 * Calculate crop calendar impact on prices
 *
 * @param currentMonth - Current month (1-12)
 * @param plantingMonths - Planting months
 * @param harvestMonths - Harvest months
 * @param averagePrice - Average annual price
 * @returns Expected price adjustment factor
 *
 * @example
 * ```typescript
 * const priceAdjustment = calculateCropCalendarImpact(
 *   8,        // August
 *   [4, 5],   // April-May planting
 *   [9, 10],  // Sept-Oct harvest
 *   5.50      // Average price
 * );
 * // Returns expected price factor for pre-harvest period
 * ```
 */
export declare function calculateCropCalendarImpact(currentMonth: number, plantingMonths: number[], harvestMonths: number[], averagePrice: number): {
    priceFactor: number;
    seasonalPhase: string;
};
/**
 * Calculate livestock cost of gain
 *
 * @param currentWeight - Current animal weight (lbs)
 * @param targetWeight - Target market weight (lbs)
 * @param feedCostPerPound - Feed cost per pound of weight gain
 * @param daysOnFeed - Expected days on feed
 * @param otherCosts - Other costs per day
 * @returns Total cost of gain and break-even price
 *
 * @example
 * ```typescript
 * const costOfGain = calculateLivestockCostOfGain(
 *   750,    // 750 lbs current
 *   1250,   // 1250 lbs target
 *   0.65,   // $0.65/lb feed cost
 *   180,    // 180 days on feed
 *   0.50    // $0.50/day other costs
 * );
 * ```
 */
export declare function calculateLivestockCostOfGain(currentWeight: number, targetWeight: number, feedCostPerPound: number, daysOnFeed: number, otherCosts: number): {
    totalCost: number;
    costPerPound: number;
    breakEvenPrice: number;
};
/**
 * Adjust commodity price for grade differences
 *
 * @param basePrice - Base price for standard grade
 * @param actualGrade - Actual commodity grade
 * @param standardGrade - Standard grade
 * @param premiumDiscountTable - Grade premium/discount table
 * @returns Grade-adjusted price
 *
 * @example
 * ```typescript
 * const adjusted = adjustCommodityGrade(
 *   5.50,           // Base price
 *   '#2 Yellow',    // Actual grade
 *   '#1 Yellow',    // Standard grade
 *   { '#2 Yellow': -0.05, '#1 Yellow': 0.00, '#3 Yellow': -0.10 }
 * );
 * ```
 */
export declare function adjustCommodityGrade(basePrice: number, actualGrade: string, standardGrade: string, premiumDiscountTable: {
    [grade: string]: number;
}): number;
/**
 * Calculate soft commodity certification premium
 *
 * @param basePrice - Base price for non-certified
 * @param certificationType - Type of certification (e.g., 'Organic', 'Fair Trade', 'Rainforest Alliance')
 * @param premiumPercentage - Premium percentage for certification
 * @returns Certified price
 *
 * @example
 * ```typescript
 * const certifiedPrice = calculateSoftsCertificationPremium(
 *   150.00,      // $150/bag coffee
 *   'Organic',
 *   0.25         // 25% organic premium
 * );
 * // Returns: $187.50
 * ```
 */
export declare function calculateSoftsCertificationPremium(basePrice: number, certificationType: string, premiumPercentage: number): number;
/**
 * Calculate calendar spread
 *
 * @param nearMonthPrice - Near month futures price
 * @param farMonthPrice - Far month futures price
 * @param spreadType - 'price' or 'percentage'
 * @returns Calendar spread value
 *
 * @example
 * ```typescript
 * const spread = calculateCalendarSpread(50.00, 52.00, 'price');
 * // Returns: -2.00 (contango)
 * ```
 */
export declare function calculateCalendarSpread(nearMonthPrice: number, farMonthPrice: number, spreadType?: 'price' | 'percentage'): number;
/**
 * Calculate inter-commodity spread
 *
 * @param commodity1Price - First commodity price
 * @param commodity2Price - Second commodity price
 * @param historicalRatio - Historical price ratio
 * @returns Spread deviation from historical
 *
 * @example
 * ```typescript
 * const spread = calculateInterCommoditySpread(
 *   8500,  // Copper price
 *   2500,  // Aluminum price
 *   3.4    // Historical Cu/Al ratio
 * );
 * ```
 */
export declare function calculateInterCommoditySpread(commodity1Price: number, commodity2Price: number, historicalRatio: number): {
    currentRatio: number;
    spreadFromHistorical: number;
    percentageDeviation: number;
};
/**
 * Calculate location spread
 *
 * @param location1Price - Price at location 1
 * @param location2Price - Price at location 2
 * @param transportCost - Cost to transport between locations
 * @returns Location arbitrage opportunity
 *
 * @example
 * ```typescript
 * const locSpread = calculateLocationSpread(
 *   52.00,  // Location A price
 *   50.00,  // Location B price
 *   1.50    // Transport cost A to B
 * );
 * // Returns arbitrage opportunity analysis
 * ```
 */
export declare function calculateLocationSpread(location1Price: number, location2Price: number, transportCost: number): {
    spread: number;
    arbitrageOpportunity: number;
    isProfitable: boolean;
};
/**
 * Calculate quality spread
 *
 * @param premiumGradePrice - Premium grade price
 * @param standardGradePrice - Standard grade price
 * @param qualityDifferential - Expected quality differential
 * @returns Quality spread analysis
 *
 * @example
 * ```typescript
 * const qualSpread = calculateQualitySpread(
 *   5.75,   // #1 grade price
 *   5.50,   // #2 grade price
 *   0.20    // Expected differential
 * );
 * ```
 */
export declare function calculateQualitySpread(premiumGradePrice: number, standardGradePrice: number, qualityDifferential: number): {
    actualSpread: number;
    expectedSpread: number;
    spreadAnomaly: number;
};
/**
 * Optimize spread execution
 *
 * @param longLegBid - Long leg bid price
 * @param longLegAsk - Long leg ask price
 * @param shortLegBid - Short leg bid price
 * @param shortLegAsk - Short leg ask price
 * @param targetSpread - Target spread value
 * @returns Optimal execution strategy
 *
 * @example
 * ```typescript
 * const execution = optimizeSpreadExecution(
 *   50.00, 50.05,  // Long leg bid/ask
 *   52.00, 52.05,  // Short leg bid/ask
 *   -2.00          // Target spread
 * );
 * ```
 */
export declare function optimizeSpreadExecution(longLegBid: number, longLegAsk: number, shortLegBid: number, shortLegAsk: number, targetSpread: number): {
    bestSpread: number;
    executionCost: number;
    recommendation: string;
};
/**
 * Calculate spread roll cost
 *
 * @param currentSpread - Current spread value
 * @param rollSpread - Spread after rolling to next contract
 * @param rollCommission - Commission cost for roll transaction
 * @param contracts - Number of contracts
 * @returns Total roll cost
 *
 * @example
 * ```typescript
 * const rollCost = calculateSpreadRollCost(
 *   -2.00,  // Current spread
 *   -2.10,  // Spread after roll
 *   25,     // $25 commission per contract
 *   10      // 10 contracts
 * );
 * ```
 */
export declare function calculateSpreadRollCost(currentSpread: number, rollSpread: number, rollCommission: number, contracts: number): number;
/**
 * Detect contango or backwardation in term structure
 *
 * @param termStructure - Commodity term structure
 * @returns Market structure analysis
 *
 * @example
 * ```typescript
 * const structure = detectContangoBackwardation({
 *   commodity: 'Crude Oil',
 *   curve: [...],
 *   spotPrice: 75.00,
 *   shape: 'contango',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare function detectContangoBackwardation(termStructure: TermStructure): {
    shape: 'contango' | 'backwardation' | 'flat';
    slope: number;
    strength: 'strong' | 'moderate' | 'weak';
};
/**
 * Calculate term structure slope
 *
 * @param nearPrice - Near contract price
 * @param farPrice - Far contract price
 * @param daysBetween - Days between contracts
 * @returns Annualized slope
 *
 * @example
 * ```typescript
 * const slope = calculateTermStructureSlope(50.00, 52.00, 90);
 * // Returns annualized slope of term structure
 * ```
 */
export declare function calculateTermStructureSlope(nearPrice: number, farPrice: number, daysBetween: number): number;
/**
 * Calculate roll yield from forward curve
 *
 * @param termStructure - Term structure
 * @param rollHorizon - Roll horizon in days
 * @returns Expected roll yield
 *
 * @example
 * ```typescript
 * const rollYield = calculateRollYieldFromCurve(termStructure, 30);
 * // Returns expected yield from rolling futures monthly
 * ```
 */
export declare function calculateRollYieldFromCurve(termStructure: TermStructure, rollHorizon: number): number;
/**
 * Analyze curve positioning (relative value along curve)
 *
 * @param termStructure - Term structure
 * @param targetMaturity - Target maturity in days
 * @returns Relative value analysis
 *
 * @example
 * ```typescript
 * const positioning = analyzeCurvePositioning(termStructure, 180);
 * // Analyzes whether 6-month contract is cheap/rich vs curve
 * ```
 */
export declare function analyzeCurvePositioning(termStructure: TermStructure, targetMaturity: number): {
    fairValue: number;
    marketPrice: number;
    richCheap: number;
    recommendation: string;
};
/**
 * Forecast curve evolution
 *
 * @param historicalCurves - Historical term structures
 * @param forecastHorizon - Forecast horizon in days
 * @returns Forecast of curve shape
 *
 * @example
 * ```typescript
 * const forecast = forecastCurveEvolution(historicalCurves, 30);
 * // Forecasts curve shape 30 days forward
 * ```
 */
export declare function forecastCurveEvolution(historicalCurves: TermStructure[], forecastHorizon: number): {
    expectedShape: 'contango' | 'backwardation' | 'flat';
    confidence: number;
    expectedSlope: number;
};
/**
 * Calculate storage economics
 *
 * @param commodity - Commodity type
 * @param quantity - Quantity to store
 * @param storageCost - Storage cost details
 * @param expectedPriceAppreciation - Expected price appreciation
 * @param months - Storage period in months
 * @returns Storage profitability analysis
 *
 * @example
 * ```typescript
 * const economics = calculateStorageEconomics(
 *   'Crude Oil',
 *   10000,
 *   { costPerUnitPerMonth: 0.50, insuranceCost: 0.10, financingRate: 0.05, ... },
 *   2.00,
 *   6
 * );
 * ```
 */
export declare function calculateStorageEconomics(commodity: CommodityType, quantity: number, storageCost: StorageCost, expectedPriceAppreciation: number, months: number): {
    totalCost: number;
    breakEvenAppreciation: number;
    profitLoss: number;
    isProfitable: boolean;
};
/**
 * Calculate transportation cost
 *
 * @param transport - Transportation specification
 * @param quantity - Quantity to transport
 * @returns Total transportation cost
 *
 * @example
 * ```typescript
 * const cost = calculateTransportationCost(
 *   {
 *     commodity: 'Crude Oil',
 *     fromLocation: 'Cushing, OK',
 *     toLocation: 'Houston, TX',
 *     distance: 450,
 *     mode: 'pipeline',
 *     costPerUnit: 0.50,
 *     transitTime: 3
 *   },
 *   10000
 * );
 * ```
 */
export declare function calculateTransportationCost(transport: TransportationCost, quantity: number): number;
/**
 * Optimize location arbitrage
 *
 * @param sourcePrice - Price at source location
 * @param destPrice - Price at destination location
 * @param transportCost - Transportation cost per unit
 * @param quantity - Available quantity
 * @param storageCost - Storage cost at destination
 * @returns Arbitrage opportunity analysis
 *
 * @example
 * ```typescript
 * const arb = optimizeLocationArbitrage(
 *   50.00,  // Source price
 *   53.00,  // Destination price
 *   1.50,   // Transport cost
 *   10000,  // Quantity
 *   0       // No storage needed
 * );
 * ```
 */
export declare function optimizeLocationArbitrage(sourcePrice: number, destPrice: number, transportCost: number, quantity: number, storageCost?: number): {
    grossSpread: number;
    netSpread: number;
    totalProfit: number;
    isProfitable: boolean;
    roi: number;
};
/**
 * Calculate warehouse financing cost
 *
 * @param commodityValue - Value of commodity per unit
 * @param quantity - Quantity in warehouse
 * @param warehouseCost - Warehouse cost per unit per day
 * @param days - Days in warehouse
 * @param financingRate - Annual financing rate
 * @returns Total warehouse financing cost
 *
 * @example
 * ```typescript
 * const warehouseCost = calculateWarehouseFinancing(
 *   8000,   // $8000/ton commodity value
 *   100,    // 100 tons
 *   0.50,   // $0.50/ton/day
 *   90,     // 90 days
 *   0.06    // 6% annual rate
 * );
 * ```
 */
export declare function calculateWarehouseFinancing(commodityValue: number, quantity: number, warehouseCost: number, days: number, financingRate: number): number;
/**
 * Analyze logistics constraints
 *
 * @param availableCapacity - Available transport/storage capacity
 * @param requiredCapacity - Required capacity
 * @param leadTime - Lead time in days
 * @param urgency - Urgency level (1-10)
 * @returns Logistics feasibility analysis
 *
 * @example
 * ```typescript
 * const logistics = analyzeLogisticsConstraints(
 *   8000,   // Available capacity
 *   10000,  // Required capacity
 *   14,     // 14 days lead time
 *   8       // High urgency
 * );
 * ```
 */
export declare function analyzeLogisticsConstraints(availableCapacity: number, requiredCapacity: number, leadTime: number, urgency: number): {
    isFeasible: boolean;
    capacityUtilization: number;
    bottleneck: string;
    recommendation: string;
};
/**
 * Calculate minimum variance hedge ratio
 *
 * @param spotReturns - Spot position returns (time series)
 * @param futuresReturns - Futures returns (time series)
 * @returns Optimal minimum variance hedge ratio
 *
 * @example
 * ```typescript
 * const hedgeRatio = calculateMinimumVarianceHedge(spotReturns, futuresReturns);
 * ```
 */
export declare function calculateMinimumVarianceHedge(spotReturns: number[], futuresReturns: number[]): CommodityHedgeResult;
/**
 * Calculate cross-hedge ratio
 *
 * @param exposureReturns - Exposure returns (commodity to be hedged)
 * @param hedgeReturns - Hedge instrument returns (related commodity)
 * @param exposureVolatility - Exposure volatility
 * @param hedgeVolatility - Hedge instrument volatility
 * @param correlation - Correlation between exposure and hedge
 * @returns Cross-hedge ratio
 *
 * @example
 * ```typescript
 * const crossHedge = calculateCrossHedgeRatio(
 *   jetFuelReturns,
 *   heatingOilReturns,
 *   0.25,  // Jet fuel volatility
 *   0.22,  // Heating oil volatility
 *   0.85   // Correlation
 * );
 * ```
 */
export declare function calculateCrossHedgeRatio(exposureReturns: number[], hedgeReturns: number[], exposureVolatility: number, hedgeVolatility: number, correlation: number): CommodityHedgeResult;
/**
 * Quantify basis risk
 *
 * @param spotPrices - Historical spot prices
 * @param futuresPrices - Historical futures prices
 * @returns Basis risk metrics
 *
 * @example
 * ```typescript
 * const basisRisk = calculateBasisRisk(spotPrices, futuresPrices);
 * ```
 */
export declare function calculateBasisRisk(spotPrices: number[], futuresPrices: number[]): {
    meanBasis: number;
    basisVolatility: number;
    basisRange: {
        min: number;
        max: number;
    };
    basisRiskScore: number;
};
/**
 * Optimize dynamic hedge
 *
 * @param currentPosition - Current position size
 * @param currentHedge - Current hedge size
 * @param targetHedgeRatio - Target hedge ratio
 * @param rebalanceThreshold - Threshold for rebalancing (%)
 * @returns Rebalancing recommendation
 *
 * @example
 * ```typescript
 * const rebalance = optimizeDynamicHedge(
 *   10000,   // Current position
 *   8000,    // Current hedge
 *   0.85,    // Target 85% hedge ratio
 *   0.05     // 5% rebalance threshold
 * );
 * ```
 */
export declare function optimizeDynamicHedge(currentPosition: number, currentHedge: number, targetHedgeRatio: number, rebalanceThreshold: number): {
    currentRatio: number;
    targetHedge: number;
    adjustment: number;
    shouldRebalance: boolean;
};
/**
 * Extract seasonal pattern from historical prices
 *
 * @param monthlyPrices - Monthly price series (multiple years)
 * @param yearsOfData - Number of years in dataset
 * @returns Seasonal pattern
 *
 * @example
 * ```typescript
 * const seasonal = extractSeasonalPattern(
 *   [5.50, 5.45, 5.60, ...], // 60 months of data (5 years)
 *   5
 * );
 * ```
 */
export declare function extractSeasonalPattern(monthlyPrices: number[], yearsOfData: number): SeasonalPattern;
/**
 * Calculate year-over-year price pattern
 *
 * @param currentYearPrices - Current year monthly prices
 * @param priorYearPrices - Prior year monthly prices
 * @returns YoY pattern analysis
 *
 * @example
 * ```typescript
 * const yoy = calculateYearOverYearPattern(
 *   [5.50, 5.55, 5.60, ...], // Current year
 *   [5.30, 5.35, 5.40, ...]  // Prior year
 * );
 * ```
 */
export declare function calculateYearOverYearPattern(currentYearPrices: number[], priorYearPrices: number[]): {
    yoyChanges: number[];
    averageChange: number;
    maxChange: number;
    minChange: number;
};
/**
 * Deseasonalize commodity prices
 *
 * @param prices - Actual prices
 * @param seasonalPattern - Seasonal pattern factors
 * @returns Deseasonalized prices
 *
 * @example
 * ```typescript
 * const deseasonalized = deseasonalizeCommodityPrice(
 *   [5.50, 5.45, 5.60],
 *   seasonalPattern
 * );
 * ```
 */
export declare function deseasonalizeCommodityPrice(prices: number[], seasonalPattern: SeasonalPattern): number[];
/**
 * Forecast seasonal trend
 *
 * @param seasonalPattern - Historical seasonal pattern
 * @param basePrice - Current base price
 * @param forecastMonths - Number of months to forecast
 * @returns Forecasted prices
 *
 * @example
 * ```typescript
 * const forecast = forecastSeasonalTrend(
 *   seasonalPattern,
 *   5.50,  // Current base price
 *   12     // Forecast 12 months
 * );
 * ```
 */
export declare function forecastSeasonalTrend(seasonalPattern: SeasonalPattern, basePrice: number, forecastMonths: number): number[];
/**
 * Construct commodity index
 *
 * @param index - Index specification
 * @param componentPrices - Current component prices
 * @returns Index value
 *
 * @example
 * ```typescript
 * const indexValue = constructCommodityIndex(
 *   commodityIndex,
 *   new Map([
 *     ['Crude Oil', 75.00],
 *     ['Gold', 1800],
 *     ['Copper', 8500]
 *   ])
 * );
 * ```
 */
export declare function constructCommodityIndex(index: CommodityIndex, componentPrices: Map<string, number>): number;
/**
 * Calculate commodity index weights
 *
 * @param components - Index components with base values
 * @param methodology - Weighting methodology
 * @returns Calculated weights
 *
 * @example
 * ```typescript
 * const weights = calculateIndexWeights(
 *   [
 *     { commodity: 'Crude Oil', marketCap: 1000000, production: 500 },
 *     { commodity: 'Gold', marketCap: 800000, production: 100 }
 *   ],
 *   'market-cap-weight'
 * );
 * ```
 */
export declare function calculateIndexWeights(components: Array<{
    commodity: CommodityType;
    value: number;
}>, methodology: 'equal-weight' | 'production-weight' | 'liquidity-weight' | 'market-cap-weight'): Map<CommodityType, number>;
/**
 * Implement index roll methodology
 *
 * @param currentContracts - Current index contracts
 * @param rollSchedule - Roll schedule (days before expiry)
 * @param daysToExpiry - Days to current contract expiry
 * @param rollMethod - Roll methodology
 * @returns Roll instructions
 *
 * @example
 * ```typescript
 * const rollInstructions = implementIndexRoll(
 *   currentContracts,
 *   5,    // Roll 5 days before expiry
 *   7,    // 7 days to expiry
 *   'optimized'
 * );
 * ```
 */
export declare function implementIndexRoll(currentContracts: CommodityContract[], rollSchedule: number, daysToExpiry: number, rollMethod: 'front-month' | 'optimized' | 'constant-maturity'): {
    shouldRoll: boolean;
    rollPercentage: number;
    targetContracts: string[];
};
/**
 * Replicate commodity index
 *
 * @param indexValue - Target index value
 * @param indexComposition - Index composition
 * @param availableFunds - Available funds for replication
 * @param contractSizes - Contract sizes for each commodity
 * @returns Replication portfolio
 *
 * @example
 * ```typescript
 * const portfolio = replicateCommodityIndex(
 *   1000,
 *   commodityIndex,
 *   100000,
 *   new Map([['Crude Oil', 1000], ['Gold', 100]])
 * );
 * ```
 */
export declare function replicateCommodityIndex(indexValue: number, indexComposition: CommodityIndex, availableFunds: number, contractSizes: Map<string, number>): {
    contracts: Map<CommodityType, number>;
    totalCost: number;
    trackingError: number;
};
//# sourceMappingURL=commodities-trading-kit.d.ts.map