"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFuturesFairValue = calculateFuturesFairValue;
exports.calculateCostOfCarry = calculateCostOfCarry;
exports.calculateFuturesConvergence = calculateFuturesConvergence;
exports.calculateFuturesBasis = calculateFuturesBasis;
exports.calculateRollYield = calculateRollYield;
exports.calculateFuturesImpliedRate = calculateFuturesImpliedRate;
exports.adjustCommodityQuality = adjustCommodityQuality;
exports.calculateLocationDifferential = calculateLocationDifferential;
exports.calculateDeliveryCost = calculateDeliveryCost;
exports.calculateStorageCost = calculateStorageCost;
exports.validatePhysicalDelivery = validatePhysicalDelivery;
exports.calculateWTIBrentSpread = calculateWTIBrentSpread;
exports.calculateCrackSpread = calculateCrackSpread;
exports.calculateSparkSpread = calculateSparkSpread;
exports.calculateNaturalGasHeatRate = calculateNaturalGasHeatRate;
exports.calculateEnergyBasisDifferential = calculateEnergyBasisDifferential;
exports.calculatePowerLoadShape = calculatePowerLoadShape;
exports.optimizeEnergyStorage = optimizeEnergyStorage;
exports.calculateEnergyTransportCost = calculateEnergyTransportCost;
exports.calculatePreciousMetalLease = calculatePreciousMetalLease;
exports.calculateBaseMetalPremium = calculateBaseMetalPremium;
exports.calculateLMEWarehouseFinancing = calculateLMEWarehouseFinancing;
exports.calculateMetalsPurityAdjustment = calculateMetalsPurityAdjustment;
exports.calculateGoldSilverRatio = calculateGoldSilverRatio;
exports.calculateMetalsCarryTrade = calculateMetalsCarryTrade;
exports.calculateGrainBasisPattern = calculateGrainBasisPattern;
exports.calculateCropCalendarImpact = calculateCropCalendarImpact;
exports.calculateLivestockCostOfGain = calculateLivestockCostOfGain;
exports.adjustCommodityGrade = adjustCommodityGrade;
exports.calculateSoftsCertificationPremium = calculateSoftsCertificationPremium;
exports.calculateCalendarSpread = calculateCalendarSpread;
exports.calculateInterCommoditySpread = calculateInterCommoditySpread;
exports.calculateLocationSpread = calculateLocationSpread;
exports.calculateQualitySpread = calculateQualitySpread;
exports.optimizeSpreadExecution = optimizeSpreadExecution;
exports.calculateSpreadRollCost = calculateSpreadRollCost;
exports.detectContangoBackwardation = detectContangoBackwardation;
exports.calculateTermStructureSlope = calculateTermStructureSlope;
exports.calculateRollYieldFromCurve = calculateRollYieldFromCurve;
exports.analyzeCurvePositioning = analyzeCurvePositioning;
exports.forecastCurveEvolution = forecastCurveEvolution;
exports.calculateStorageEconomics = calculateStorageEconomics;
exports.calculateTransportationCost = calculateTransportationCost;
exports.optimizeLocationArbitrage = optimizeLocationArbitrage;
exports.calculateWarehouseFinancing = calculateWarehouseFinancing;
exports.analyzeLogisticsConstraints = analyzeLogisticsConstraints;
exports.calculateMinimumVarianceHedge = calculateMinimumVarianceHedge;
exports.calculateCrossHedgeRatio = calculateCrossHedgeRatio;
exports.calculateBasisRisk = calculateBasisRisk;
exports.optimizeDynamicHedge = optimizeDynamicHedge;
exports.extractSeasonalPattern = extractSeasonalPattern;
exports.calculateYearOverYearPattern = calculateYearOverYearPattern;
exports.deseasonalizeCommodityPrice = deseasonalizeCommodityPrice;
exports.forecastSeasonalTrend = forecastSeasonalTrend;
exports.constructCommodityIndex = constructCommodityIndex;
exports.calculateIndexWeights = calculateIndexWeights;
exports.implementIndexRoll = implementIndexRoll;
exports.replicateCommodityIndex = replicateCommodityIndex;
// ============================================================================
// COMMODITY FUTURES PRICING FUNCTIONS (6 functions)
// ============================================================================
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
function calculateFuturesFairValue(spotPrice, storageCostPerYear, financingRate, convenienceYield, timeToMaturity) {
    if (spotPrice <= 0) {
        throw new Error('Spot price must be positive');
    }
    if (timeToMaturity < 0) {
        throw new Error('Time to maturity cannot be negative');
    }
    // F = S * e^((r + u - y) * T)
    // where: r = financing rate, u = storage cost, y = convenience yield, T = time
    const costOfCarryRate = financingRate + (storageCostPerYear / spotPrice) - convenienceYield;
    return spotPrice * Math.exp(costOfCarryRate * timeToMaturity);
}
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
function calculateCostOfCarry(spotPrice, futuresPrice, timeToMaturity) {
    if (spotPrice <= 0 || futuresPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    if (timeToMaturity <= 0) {
        throw new Error('Time to maturity must be positive');
    }
    // (F / S) = e^(r * T)
    // r = ln(F / S) / T
    return Math.log(futuresPrice / spotPrice) / timeToMaturity;
}
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
function calculateFuturesConvergence(currentFuturesPrice, spotPrice, daysToMaturity, initialBasis) {
    if (currentFuturesPrice <= 0 || spotPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    if (daysToMaturity < 0) {
        throw new Error('Days to maturity cannot be negative');
    }
    const currentBasis = currentFuturesPrice - spotPrice;
    const basisDecay = initialBasis - currentBasis;
    // Convergence rate (basis decay per day)
    const convergenceRate = daysToMaturity > 0 ? currentBasis / daysToMaturity : 0;
    // Expected basis at maturity (should be close to zero)
    const expectedBasisAtMaturity = daysToMaturity * convergenceRate;
    return {
        currentBasis,
        basisDecay,
        convergenceRate,
        expectedBasisAtMaturity
    };
}
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
function calculateFuturesBasis(futuresPrice, spotPrice, asPercentage = false) {
    if (futuresPrice <= 0 || spotPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    const basis = futuresPrice - spotPrice;
    return asPercentage ? (basis / spotPrice) * 100 : basis;
}
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
function calculateRollYield(nearMonthPrice, farMonthPrice, daysToNearExpiry, daysBetweenContracts) {
    if (nearMonthPrice <= 0 || farMonthPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    if (daysToNearExpiry < 0 || daysBetweenContracts <= 0) {
        throw new Error('Invalid days parameters');
    }
    // Roll yield = (near - far) / far
    const rollReturn = (nearMonthPrice - farMonthPrice) / farMonthPrice;
    // Annualize
    const annualizationFactor = 365 / daysBetweenContracts;
    return rollReturn * annualizationFactor;
}
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
function calculateFuturesImpliedRate(spotPrice, futuresPrice, timeToMaturity, storageCost, convenienceYield) {
    if (spotPrice <= 0 || futuresPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    if (timeToMaturity <= 0) {
        throw new Error('Time to maturity must be positive');
    }
    // F = S * e^((r + u - y) * T)
    // r = (ln(F/S) / T) - u + y
    const totalCarry = Math.log(futuresPrice / spotPrice) / timeToMaturity;
    const storageRate = storageCost / spotPrice;
    return totalCarry - storageRate + convenienceYield;
}
// ============================================================================
// PHYSICAL COMMODITY ANALYTICS (5 functions)
// ============================================================================
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
function adjustCommodityQuality(basePrice, actualQuality, standardQuality, qualityPremiums) {
    if (basePrice <= 0) {
        throw new Error('Base price must be positive');
    }
    let totalAdjustment = 0;
    for (const metric in actualQuality) {
        if (standardQuality[metric] !== undefined && qualityPremiums[metric] !== undefined) {
            const qualityDiff = actualQuality[metric] - standardQuality[metric];
            totalAdjustment += qualityDiff * qualityPremiums[metric];
        }
    }
    return basePrice + totalAdjustment;
}
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
function calculateLocationDifferential(benchmarkPrice, transportCost, localSupplyDemand = 0) {
    if (benchmarkPrice <= 0) {
        throw new Error('Benchmark price must be positive');
    }
    if (transportCost < 0) {
        throw new Error('Transport cost cannot be negative');
    }
    if (localSupplyDemand < -1 || localSupplyDemand > 1) {
        throw new Error('Local supply/demand factor must be between -1 and 1');
    }
    const transportAdjustedPrice = benchmarkPrice + transportCost;
    const localAdjustment = transportAdjustedPrice * localSupplyDemand;
    return transportAdjustedPrice + localAdjustment;
}
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
function calculateDeliveryCost(quantity, transportCost, loadingCost, unloadingCost, insuranceCost, inspectionCost) {
    if (quantity <= 0) {
        throw new Error('Quantity must be positive');
    }
    if (transportCost < 0 || loadingCost < 0 || unloadingCost < 0 ||
        insuranceCost < 0 || inspectionCost < 0) {
        throw new Error('Costs cannot be negative');
    }
    const variableCostPerUnit = transportCost + loadingCost + unloadingCost + insuranceCost;
    const totalVariableCost = quantity * variableCostPerUnit;
    return totalVariableCost + inspectionCost;
}
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
function calculateStorageCost(quantity, storageCostPerMonth, months, insuranceRate, commodityValue, financingRate) {
    if (quantity <= 0 || commodityValue <= 0) {
        throw new Error('Quantity and commodity value must be positive');
    }
    if (months < 0) {
        throw new Error('Months cannot be negative');
    }
    if (storageCostPerMonth < 0 || insuranceRate < 0 || financingRate < 0) {
        throw new Error('Cost rates cannot be negative');
    }
    const directStorageCost = quantity * storageCostPerMonth * months;
    const insuranceCost = quantity * commodityValue * insuranceRate * (months / 12);
    const financingCost = quantity * commodityValue * financingRate * (months / 12);
    return directStorageCost + insuranceCost + financingCost;
}
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
function validatePhysicalDelivery(physical, contractSpecs) {
    const issues = [];
    // Check each specification against contract requirements
    for (const spec in contractSpecs) {
        const contractValue = contractSpecs[spec];
        const actualValue = physical.specs[spec];
        if (actualValue === undefined) {
            issues.push(`Missing specification: ${spec}`);
            continue;
        }
        // Numeric comparison for max/min specifications
        if (spec.startsWith('max') && typeof contractValue === 'number' && typeof actualValue === 'number') {
            if (actualValue > contractValue) {
                issues.push(`${spec}: ${actualValue} exceeds maximum ${contractValue}`);
            }
        }
        else if (spec.startsWith('min') && typeof contractValue === 'number' && typeof actualValue === 'number') {
            if (actualValue < contractValue) {
                issues.push(`${spec}: ${actualValue} below minimum ${contractValue}`);
            }
        }
        else if (contractValue !== actualValue) {
            issues.push(`${spec}: ${actualValue} does not match required ${contractValue}`);
        }
    }
    return {
        isValid: issues.length === 0,
        issues
    };
}
// ============================================================================
// ENERGY TRADING FUNCTIONS (8 functions)
// ============================================================================
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
function calculateWTIBrentSpread(wtiPrice, brentPrice) {
    if (wtiPrice <= 0 || brentPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    return wtiPrice - brentPrice;
}
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
function calculateCrackSpread(crudePrice, gasolinePrice, distillatePrice, ratio = [3, 2, 1]) {
    if (crudePrice <= 0 || gasolinePrice <= 0 || distillatePrice <= 0) {
        throw new Error('Prices must be positive');
    }
    const [crudeBarrels, gasBarrels, distBarrels] = ratio;
    // Revenue from products
    const productRevenue = (gasBarrels * gasolinePrice) + (distBarrels * distillatePrice);
    // Cost of crude
    const crudeCost = crudeBarrels * crudePrice;
    // Crack spread per barrel of crude
    return (productRevenue - crudeCost) / crudeBarrels;
}
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
function calculateSparkSpread(powerPrice, gasPrice, heatRate, variableOM = 0) {
    if (powerPrice < 0 || gasPrice < 0 || heatRate <= 0) {
        throw new Error('Invalid inputs: prices cannot be negative, heat rate must be positive');
    }
    // Spark spread = Power price - (Gas price * Heat rate) - Variable O&M
    return powerPrice - (gasPrice * heatRate) - variableOM;
}
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
function calculateNaturalGasHeatRate(mmbtuInput, mwhOutput) {
    if (mmbtuInput <= 0 || mwhOutput <= 0) {
        throw new Error('Inputs and outputs must be positive');
    }
    return mmbtuInput / mwhOutput;
}
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
function calculateEnergyBasisDifferential(hubPrice, deliveryPointPrice, transportCost) {
    if (hubPrice < 0 || deliveryPointPrice < 0 || transportCost < 0) {
        throw new Error('Prices and costs cannot be negative');
    }
    // Basis = Delivery point - Hub - Transport
    return deliveryPointPrice - hubPrice - transportCost;
}
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
function calculatePowerLoadShape(hourlyPrices, generationProfile) {
    if (hourlyPrices.length !== 24 || generationProfile.length !== 24) {
        throw new Error('Must provide 24 hours of data');
    }
    let totalRevenue = 0;
    let totalGeneration = 0;
    for (let i = 0; i < 24; i++) {
        totalRevenue += hourlyPrices[i] * generationProfile[i];
        totalGeneration += generationProfile[i];
    }
    const averagePrice = totalGeneration > 0 ? totalRevenue / totalGeneration : 0;
    const maxGeneration = Math.max(...generationProfile);
    const loadFactor = maxGeneration > 0 ? totalGeneration / (24 * maxGeneration) : 0;
    return {
        totalRevenue,
        averagePrice,
        loadFactor
    };
}
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
function optimizeEnergyStorage(hourlyPrices, storageCapacity, maxChargeRate, maxDischargeRate, roundTripEfficiency) {
    if (hourlyPrices.length !== 24) {
        throw new Error('Must provide 24 hours of prices');
    }
    if (storageCapacity <= 0 || maxChargeRate <= 0 || maxDischargeRate <= 0) {
        throw new Error('Storage parameters must be positive');
    }
    if (roundTripEfficiency <= 0 || roundTripEfficiency > 1) {
        throw new Error('Round-trip efficiency must be between 0 and 1');
    }
    // Simple greedy algorithm: charge during lowest prices, discharge during highest
    const priceHours = hourlyPrices.map((price, hour) => ({ price, hour }));
    const sortedByPrice = [...priceHours].sort((a, b) => a.price - b.price);
    const schedule = [];
    let currentCharge = 0;
    let totalProfit = 0;
    // Initialize schedule with idle
    for (let i = 0; i < 24; i++) {
        schedule.push({ hour: i, action: 'idle', mwh: 0 });
    }
    // Charge during cheapest hours (up to capacity)
    let chargedMWh = 0;
    for (const { hour, price } of sortedByPrice) {
        if (chargedMWh >= storageCapacity)
            break;
        const chargeAmount = Math.min(maxChargeRate, storageCapacity - chargedMWh);
        schedule[hour] = { hour, action: 'charge', mwh: chargeAmount };
        chargedMWh += chargeAmount;
        currentCharge += chargeAmount;
        totalProfit -= chargeAmount * price; // Cost of charging
    }
    // Discharge during most expensive hours
    const sortedByPriceDesc = [...priceHours].sort((a, b) => b.price - a.price);
    let dischargedMWh = 0;
    for (const { hour, price } of sortedByPriceDesc) {
        if (schedule[hour].action === 'charge')
            continue; // Already charging this hour
        if (dischargedMWh >= chargedMWh * roundTripEfficiency)
            break;
        const dischargeAmount = Math.min(maxDischargeRate, (chargedMWh * roundTripEfficiency) - dischargedMWh);
        schedule[hour] = { hour, action: 'discharge', mwh: dischargeAmount };
        dischargedMWh += dischargeAmount;
        totalProfit += dischargeAmount * price; // Revenue from discharging
    }
    return { schedule, profit: totalProfit };
}
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
function calculateEnergyTransportCost(volume, distance, mode, unitCostPerMile) {
    if (volume <= 0 || distance < 0) {
        throw new Error('Volume must be positive, distance non-negative');
    }
    if (unitCostPerMile < 0) {
        throw new Error('Unit cost cannot be negative');
    }
    return volume * distance * unitCostPerMile;
}
// ============================================================================
// METALS TRADING FUNCTIONS (6 functions)
// ============================================================================
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
function calculatePreciousMetalLease(spotPrice, forwardPrice, timeToMaturity, financingRate) {
    if (spotPrice <= 0 || forwardPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    if (timeToMaturity <= 0) {
        throw new Error('Time to maturity must be positive');
    }
    // F = S * e^((r - lease) * T)
    // lease = r - ln(F/S) / T
    const forwardDiscount = Math.log(forwardPrice / spotPrice) / timeToMaturity;
    return financingRate - forwardDiscount;
}
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
function calculateBaseMetalPremium(physicalPrice, lmePrice, deliveryPremium = 0) {
    if (physicalPrice < 0 || lmePrice < 0) {
        throw new Error('Prices cannot be negative');
    }
    return physicalPrice - lmePrice - deliveryPremium;
}
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
function calculateLMEWarehouseFinancing(metalValue, quantity, storageDays, warehouseRent, financingRate, loadOutFee) {
    if (metalValue <= 0 || quantity <= 0) {
        throw new Error('Metal value and quantity must be positive');
    }
    if (storageDays < 0 || warehouseRent < 0 || loadOutFee < 0) {
        throw new Error('Costs cannot be negative');
    }
    // Storage cost
    const storageCost = quantity * warehouseRent * storageDays;
    // Financing cost for capital tied up
    const capitalCost = metalValue * quantity * financingRate * (storageDays / 365);
    // Load-out fee
    const loadOut = quantity * loadOutFee;
    return storageCost + capitalCost + loadOut;
}
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
function calculateMetalsPurityAdjustment(basePrice, standardPurity, actualPurity, weight) {
    if (basePrice <= 0 || weight <= 0) {
        throw new Error('Price and weight must be positive');
    }
    if (standardPurity <= 0 || standardPurity > 1 || actualPurity <= 0 || actualPurity > 1) {
        throw new Error('Purity must be between 0 and 1');
    }
    // Calculate fine weight (pure metal content)
    const standardFineWeight = weight * standardPurity;
    const actualFineWeight = weight * actualPurity;
    // Adjust price based on actual fine content
    return (actualFineWeight / standardFineWeight) * basePrice * weight;
}
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
function calculateGoldSilverRatio(goldPrice, silverPrice) {
    if (goldPrice <= 0 || silverPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    return goldPrice / silverPrice;
}
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
function calculateMetalsCarryTrade(spotPrice, forwardPrice, storageCost, financingRate, timeToMaturity) {
    if (spotPrice <= 0 || forwardPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    if (timeToMaturity <= 0) {
        throw new Error('Time to maturity must be positive');
    }
    // Theoretical forward = Spot * (1 + r*T) + storage
    const theoreticalForward = spotPrice * (1 + financingRate * timeToMaturity) + storageCost;
    // Carry profit = actual forward - theoretical forward
    return forwardPrice - theoreticalForward;
}
// ============================================================================
// AGRICULTURAL COMMODITIES (5 functions)
// ============================================================================
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
function calculateGrainBasisPattern(cashPrices, futuresPrices, harvestMonths) {
    if (cashPrices.length !== futuresPrices.length) {
        throw new Error('Cash and futures price arrays must have same length');
    }
    if (cashPrices.length === 0) {
        throw new Error('Price arrays cannot be empty');
    }
    const basis = cashPrices.map((cash, i) => cash - futuresPrices[i]);
    // Calculate average basis
    const averageBasis = basis.reduce((sum, b) => sum + b, 0) / basis.length;
    // Separate harvest and non-harvest basis (simplified - would need dates)
    const harvestBasis = averageBasis * 0.85; // Typically weaker during harvest
    const nonHarvestBasis = averageBasis * 1.15; // Typically stronger off-season
    // Calculate basis volatility
    const variance = basis.reduce((sum, b) => sum + Math.pow(b - averageBasis, 2), 0) / basis.length;
    const basisVolatility = Math.sqrt(variance);
    return {
        averageBasis,
        harvestBasis,
        nonHarvestBasis,
        basisVolatility
    };
}
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
function calculateCropCalendarImpact(currentMonth, plantingMonths, harvestMonths, averagePrice) {
    if (currentMonth < 1 || currentMonth > 12) {
        throw new Error('Month must be between 1 and 12');
    }
    if (averagePrice <= 0) {
        throw new Error('Average price must be positive');
    }
    let priceFactor = 1.0;
    let seasonalPhase = 'neutral';
    if (plantingMonths.includes(currentMonth)) {
        priceFactor = 1.05; // Slight premium during planting (weather risk)
        seasonalPhase = 'planting';
    }
    else if (harvestMonths.includes(currentMonth)) {
        priceFactor = 0.90; // Discount during harvest (supply pressure)
        seasonalPhase = 'harvest';
    }
    else if (currentMonth > Math.max(...harvestMonths) || currentMonth < Math.min(...plantingMonths)) {
        priceFactor = 1.10; // Premium during storage season
        seasonalPhase = 'storage';
    }
    else {
        priceFactor = 1.03; // Moderate premium during growing season
        seasonalPhase = 'growing';
    }
    return { priceFactor, seasonalPhase };
}
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
function calculateLivestockCostOfGain(currentWeight, targetWeight, feedCostPerPound, daysOnFeed, otherCosts) {
    if (currentWeight <= 0 || targetWeight <= currentWeight) {
        throw new Error('Invalid weights');
    }
    if (feedCostPerPound < 0 || otherCosts < 0 || daysOnFeed <= 0) {
        throw new Error('Invalid cost or time parameters');
    }
    const weightGain = targetWeight - currentWeight;
    const feedCost = weightGain * feedCostPerPound;
    const otherTotalCost = daysOnFeed * otherCosts;
    const totalCost = feedCost + otherTotalCost;
    const costPerPound = totalCost / weightGain;
    const breakEvenPrice = totalCost / targetWeight;
    return {
        totalCost,
        costPerPound,
        breakEvenPrice
    };
}
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
function adjustCommodityGrade(basePrice, actualGrade, standardGrade, premiumDiscountTable) {
    if (basePrice <= 0) {
        throw new Error('Base price must be positive');
    }
    const standardAdjustment = premiumDiscountTable[standardGrade] || 0;
    const actualAdjustment = premiumDiscountTable[actualGrade];
    if (actualAdjustment === undefined) {
        throw new Error(`Grade ${actualGrade} not found in premium/discount table`);
    }
    const netAdjustment = actualAdjustment - standardAdjustment;
    return basePrice + netAdjustment;
}
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
function calculateSoftsCertificationPremium(basePrice, certificationType, premiumPercentage) {
    if (basePrice <= 0) {
        throw new Error('Base price must be positive');
    }
    if (premiumPercentage < 0) {
        throw new Error('Premium percentage cannot be negative');
    }
    return basePrice * (1 + premiumPercentage);
}
// ============================================================================
// COMMODITY SPREAD TRADING (6 functions)
// ============================================================================
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
function calculateCalendarSpread(nearMonthPrice, farMonthPrice, spreadType = 'price') {
    if (nearMonthPrice <= 0 || farMonthPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    const spread = nearMonthPrice - farMonthPrice;
    return spreadType === 'percentage' ? (spread / farMonthPrice) * 100 : spread;
}
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
function calculateInterCommoditySpread(commodity1Price, commodity2Price, historicalRatio) {
    if (commodity1Price <= 0 || commodity2Price <= 0) {
        throw new Error('Prices must be positive');
    }
    if (historicalRatio <= 0) {
        throw new Error('Historical ratio must be positive');
    }
    const currentRatio = commodity1Price / commodity2Price;
    const spreadFromHistorical = currentRatio - historicalRatio;
    const percentageDeviation = (spreadFromHistorical / historicalRatio) * 100;
    return {
        currentRatio,
        spreadFromHistorical,
        percentageDeviation
    };
}
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
function calculateLocationSpread(location1Price, location2Price, transportCost) {
    if (location1Price < 0 || location2Price < 0 || transportCost < 0) {
        throw new Error('Prices and costs cannot be negative');
    }
    const spread = location1Price - location2Price;
    const arbitrageOpportunity = spread - transportCost;
    const isProfitable = arbitrageOpportunity > 0;
    return {
        spread,
        arbitrageOpportunity,
        isProfitable
    };
}
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
function calculateQualitySpread(premiumGradePrice, standardGradePrice, qualityDifferential) {
    if (premiumGradePrice < 0 || standardGradePrice < 0) {
        throw new Error('Prices cannot be negative');
    }
    const actualSpread = premiumGradePrice - standardGradePrice;
    const expectedSpread = qualityDifferential;
    const spreadAnomaly = actualSpread - expectedSpread;
    return {
        actualSpread,
        expectedSpread,
        spreadAnomaly
    };
}
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
function optimizeSpreadExecution(longLegBid, longLegAsk, shortLegBid, shortLegAsk, targetSpread) {
    if (longLegBid <= 0 || longLegAsk <= 0 || shortLegBid <= 0 || shortLegAsk <= 0) {
        throw new Error('Prices must be positive');
    }
    if (longLegBid > longLegAsk || shortLegBid > shortLegAsk) {
        throw new Error('Bid cannot exceed ask');
    }
    // Best achievable spread: buy long leg at ask, sell short leg at bid
    const bestSpread = longLegAsk - shortLegBid;
    // Execution cost (total spread paid)
    const longLegSpread = longLegAsk - longLegBid;
    const shortLegSpread = shortLegAsk - shortLegBid;
    const executionCost = longLegSpread + shortLegSpread;
    // Recommendation
    const spreadDiff = bestSpread - targetSpread;
    let recommendation = 'Execute spread';
    if (Math.abs(spreadDiff) > executionCost * 2) {
        recommendation = 'Wait for better spread levels';
    }
    else if (Math.abs(spreadDiff) < executionCost * 0.5) {
        recommendation = 'Execute immediately';
    }
    return {
        bestSpread,
        executionCost,
        recommendation
    };
}
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
function calculateSpreadRollCost(currentSpread, rollSpread, rollCommission, contracts) {
    if (contracts <= 0) {
        throw new Error('Contracts must be positive');
    }
    if (rollCommission < 0) {
        throw new Error('Commission cannot be negative');
    }
    const spreadSlippage = rollSpread - currentSpread;
    const commissionCost = rollCommission * contracts * 2; // Both legs
    return (spreadSlippage * contracts) + commissionCost;
}
// ============================================================================
// CONTANGO AND BACKWARDATION ANALYSIS (5 functions)
// ============================================================================
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
function detectContangoBackwardation(termStructure) {
    if (termStructure.curve.length < 2) {
        throw new Error('Term structure must have at least 2 points');
    }
    // Calculate average slope
    let totalSlope = 0;
    let slopeCount = 0;
    for (let i = 0; i < termStructure.curve.length - 1; i++) {
        const p1 = termStructure.curve[i];
        const p2 = termStructure.curve[i + 1];
        const priceDiff = p2.price - p1.price;
        const timeDiff = p2.daysToMaturity - p1.daysToMaturity;
        if (timeDiff > 0) {
            totalSlope += priceDiff / timeDiff;
            slopeCount++;
        }
    }
    const averageSlope = slopeCount > 0 ? totalSlope / slopeCount : 0;
    let shape;
    let strength;
    if (averageSlope > 0.01) {
        shape = 'contango';
    }
    else if (averageSlope < -0.01) {
        shape = 'backwardation';
    }
    else {
        shape = 'flat';
    }
    // Determine strength
    const absSlopePct = Math.abs(averageSlope / termStructure.spotPrice) * 100;
    if (absSlopePct > 0.5) {
        strength = 'strong';
    }
    else if (absSlopePct > 0.2) {
        strength = 'moderate';
    }
    else {
        strength = 'weak';
    }
    return {
        shape,
        slope: averageSlope,
        strength
    };
}
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
function calculateTermStructureSlope(nearPrice, farPrice, daysBetween) {
    if (nearPrice <= 0 || farPrice <= 0) {
        throw new Error('Prices must be positive');
    }
    if (daysBetween <= 0) {
        throw new Error('Days between must be positive');
    }
    const priceChange = farPrice - nearPrice;
    const dailySlope = priceChange / daysBetween;
    // Annualize
    return dailySlope * 365;
}
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
function calculateRollYieldFromCurve(termStructure, rollHorizon) {
    if (rollHorizon <= 0) {
        throw new Error('Roll horizon must be positive');
    }
    // Find contracts around roll horizon
    const sorted = [...termStructure.curve].sort((a, b) => a.daysToMaturity - b.daysToMaturity);
    let nearContract = sorted[0];
    let farContract = sorted[1];
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].daysToMaturity <= rollHorizon && sorted[i + 1].daysToMaturity > rollHorizon) {
            nearContract = sorted[i];
            farContract = sorted[i + 1];
            break;
        }
    }
    // Roll yield = (near - far) / far, annualized
    const rollReturn = (nearContract.price - farContract.price) / farContract.price;
    const annualizationFactor = 365 / rollHorizon;
    return rollReturn * annualizationFactor;
}
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
function analyzeCurvePositioning(termStructure, targetMaturity) {
    if (targetMaturity <= 0) {
        throw new Error('Target maturity must be positive');
    }
    // Find contracts bracketing target maturity
    const sorted = [...termStructure.curve].sort((a, b) => a.daysToMaturity - b.daysToMaturity);
    let lowerContract = sorted[0];
    let upperContract = sorted[sorted.length - 1];
    let targetContract = sorted[0];
    for (let i = 0; i < sorted.length; i++) {
        if (Math.abs(sorted[i].daysToMaturity - targetMaturity) <
            Math.abs(targetContract.daysToMaturity - targetMaturity)) {
            targetContract = sorted[i];
        }
        if (sorted[i].daysToMaturity <= targetMaturity) {
            lowerContract = sorted[i];
        }
        if (sorted[i].daysToMaturity >= targetMaturity && upperContract.daysToMaturity > sorted[i].daysToMaturity) {
            upperContract = sorted[i];
        }
    }
    // Linear interpolation for fair value
    let fairValue;
    if (lowerContract.daysToMaturity === upperContract.daysToMaturity) {
        fairValue = lowerContract.price;
    }
    else {
        const weight = (targetMaturity - lowerContract.daysToMaturity) /
            (upperContract.daysToMaturity - lowerContract.daysToMaturity);
        fairValue = lowerContract.price + weight * (upperContract.price - lowerContract.price);
    }
    const marketPrice = targetContract.price;
    const richCheap = marketPrice - fairValue;
    let recommendation = 'Fair value';
    if (richCheap > fairValue * 0.01) {
        recommendation = 'Rich - consider selling';
    }
    else if (richCheap < -fairValue * 0.01) {
        recommendation = 'Cheap - consider buying';
    }
    return {
        fairValue,
        marketPrice,
        richCheap,
        recommendation
    };
}
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
function forecastCurveEvolution(historicalCurves, forecastHorizon) {
    if (historicalCurves.length === 0) {
        throw new Error('Historical curves cannot be empty');
    }
    if (forecastHorizon <= 0) {
        throw new Error('Forecast horizon must be positive');
    }
    // Analyze historical curve shapes
    let contangoCount = 0;
    let backwardationCount = 0;
    let flatCount = 0;
    let totalSlope = 0;
    for (const curve of historicalCurves) {
        if (curve.shape === 'contango')
            contangoCount++;
        else if (curve.shape === 'backwardation')
            backwardationCount++;
        else
            flatCount++;
        // Calculate slope
        if (curve.curve.length >= 2) {
            const slope = (curve.curve[1].price - curve.curve[0].price) /
                (curve.curve[1].daysToMaturity - curve.curve[0].daysToMaturity);
            totalSlope += slope;
        }
    }
    const total = historicalCurves.length;
    const expectedSlope = totalSlope / total;
    // Determine most likely shape
    let expectedShape;
    let maxCount = Math.max(contangoCount, backwardationCount, flatCount);
    let confidence = maxCount / total;
    if (contangoCount === maxCount) {
        expectedShape = 'contango';
    }
    else if (backwardationCount === maxCount) {
        expectedShape = 'backwardation';
    }
    else {
        expectedShape = 'flat';
    }
    return {
        expectedShape,
        confidence,
        expectedSlope
    };
}
// ============================================================================
// STORAGE AND TRANSPORT COST ANALYSIS (5 functions)
// ============================================================================
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
function calculateStorageEconomics(commodity, quantity, storageCost, expectedPriceAppreciation, months) {
    if (quantity <= 0 || months < 0) {
        throw new Error('Quantity must be positive, months non-negative');
    }
    const storageFee = quantity * storageCost.costPerUnitPerMonth * months;
    const insurance = quantity * storageCost.insuranceCost * months;
    const financing = quantity * storageCost.financingRate * (months / 12);
    const totalCost = storageFee + insurance + financing;
    const breakEvenAppreciation = totalCost / quantity;
    const profitLoss = (expectedPriceAppreciation * quantity) - totalCost;
    const isProfitable = profitLoss > 0;
    return {
        totalCost,
        breakEvenAppreciation,
        profitLoss,
        isProfitable
    };
}
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
function calculateTransportationCost(transport, quantity) {
    if (quantity <= 0) {
        throw new Error('Quantity must be positive');
    }
    return quantity * transport.costPerUnit;
}
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
function optimizeLocationArbitrage(sourcePrice, destPrice, transportCost, quantity, storageCost = 0) {
    if (sourcePrice < 0 || destPrice < 0 || transportCost < 0 || quantity <= 0) {
        throw new Error('Invalid parameters');
    }
    const grossSpread = destPrice - sourcePrice;
    const netSpread = grossSpread - transportCost - storageCost;
    const totalProfit = netSpread * quantity;
    const isProfitable = totalProfit > 0;
    const investment = (sourcePrice + transportCost + storageCost) * quantity;
    const roi = investment > 0 ? (totalProfit / investment) * 100 : 0;
    return {
        grossSpread,
        netSpread,
        totalProfit,
        isProfitable,
        roi
    };
}
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
function calculateWarehouseFinancing(commodityValue, quantity, warehouseCost, days, financingRate) {
    if (commodityValue <= 0 || quantity <= 0 || days < 0) {
        throw new Error('Invalid parameters');
    }
    const storageCost = quantity * warehouseCost * days;
    const financingCost = commodityValue * quantity * financingRate * (days / 365);
    return storageCost + financingCost;
}
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
function analyzeLogisticsConstraints(availableCapacity, requiredCapacity, leadTime, urgency) {
    if (requiredCapacity <= 0 || availableCapacity < 0) {
        throw new Error('Invalid capacity values');
    }
    if (urgency < 1 || urgency > 10) {
        throw new Error('Urgency must be between 1 and 10');
    }
    const capacityUtilization = requiredCapacity / availableCapacity;
    const isFeasible = capacityUtilization <= 1.0;
    let bottleneck = 'None';
    let recommendation = 'Execute as planned';
    if (!isFeasible) {
        bottleneck = 'Capacity';
        recommendation = 'Secure additional capacity or reduce volume';
    }
    else if (leadTime < 7 && urgency > 7) {
        bottleneck = 'Time';
        recommendation = 'Expedite shipment or adjust timeline';
    }
    else if (capacityUtilization > 0.9) {
        bottleneck = 'Tight capacity';
        recommendation = 'Book capacity immediately';
    }
    return {
        isFeasible,
        capacityUtilization,
        bottleneck,
        recommendation
    };
}
// ============================================================================
// COMMODITY HEDGE RATIOS (4 functions)
// ============================================================================
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
function calculateMinimumVarianceHedge(spotReturns, futuresReturns) {
    if (spotReturns.length !== futuresReturns.length) {
        throw new Error('Return series must have same length');
    }
    if (spotReturns.length < 2) {
        throw new Error('Need at least 2 observations');
    }
    // Calculate covariance and variance
    const meanSpot = spotReturns.reduce((a, b) => a + b, 0) / spotReturns.length;
    const meanFutures = futuresReturns.reduce((a, b) => a + b, 0) / futuresReturns.length;
    let covariance = 0;
    let futuresVariance = 0;
    for (let i = 0; i < spotReturns.length; i++) {
        const spotDev = spotReturns[i] - meanSpot;
        const futuresDev = futuresReturns[i] - meanFutures;
        covariance += spotDev * futuresDev;
        futuresVariance += futuresDev * futuresDev;
    }
    if (futuresVariance === 0) {
        throw new Error('Futures have zero variance');
    }
    const optimalRatio = covariance / futuresVariance;
    // Calculate correlation for effectiveness
    let spotVariance = 0;
    for (let i = 0; i < spotReturns.length; i++) {
        const spotDev = spotReturns[i] - meanSpot;
        spotVariance += spotDev * spotDev;
    }
    const correlation = covariance / Math.sqrt(spotVariance * futuresVariance);
    const effectiveness = correlation * correlation; // R-squared
    // Basis risk
    const basisRisk = 1 - effectiveness;
    return {
        optimalRatio,
        effectiveness,
        basisRisk,
        recommendedContracts: Math.round(optimalRatio) // Simplified
    };
}
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
function calculateCrossHedgeRatio(exposureReturns, hedgeReturns, exposureVolatility, hedgeVolatility, correlation) {
    if (exposureReturns.length !== hedgeReturns.length) {
        throw new Error('Return series must have same length');
    }
    if (exposureVolatility <= 0 || hedgeVolatility <= 0) {
        throw new Error('Volatilities must be positive');
    }
    if (correlation < -1 || correlation > 1) {
        throw new Error('Correlation must be between -1 and 1');
    }
    // Cross-hedge ratio = (σ_exposure / σ_hedge) * ρ
    const optimalRatio = (exposureVolatility / hedgeVolatility) * correlation;
    const effectiveness = correlation * correlation;
    const basisRisk = 1 - effectiveness;
    return {
        optimalRatio,
        effectiveness,
        basisRisk,
        recommendedContracts: Math.round(Math.abs(optimalRatio))
    };
}
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
function calculateBasisRisk(spotPrices, futuresPrices) {
    if (spotPrices.length !== futuresPrices.length) {
        throw new Error('Price series must have same length');
    }
    if (spotPrices.length < 2) {
        throw new Error('Need at least 2 observations');
    }
    // Calculate basis series
    const basis = spotPrices.map((spot, i) => spot - futuresPrices[i]);
    const meanBasis = basis.reduce((a, b) => a + b, 0) / basis.length;
    // Calculate basis volatility
    const variance = basis.reduce((sum, b) => sum + Math.pow(b - meanBasis, 2), 0) / basis.length;
    const basisVolatility = Math.sqrt(variance);
    const minBasis = Math.min(...basis);
    const maxBasis = Math.max(...basis);
    // Basis risk score (0-100, higher = more risk)
    const avgPrice = spotPrices.reduce((a, b) => a + b, 0) / spotPrices.length;
    const basisRiskScore = Math.min((basisVolatility / avgPrice) * 1000, 100);
    return {
        meanBasis,
        basisVolatility,
        basisRange: { min: minBasis, max: maxBasis },
        basisRiskScore
    };
}
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
function optimizeDynamicHedge(currentPosition, currentHedge, targetHedgeRatio, rebalanceThreshold) {
    if (currentPosition === 0) {
        throw new Error('Current position cannot be zero');
    }
    if (targetHedgeRatio < 0 || targetHedgeRatio > 1) {
        throw new Error('Target hedge ratio must be between 0 and 1');
    }
    const currentRatio = Math.abs(currentHedge / currentPosition);
    const targetHedge = currentPosition * targetHedgeRatio;
    const adjustment = targetHedge - currentHedge;
    const ratioDiff = Math.abs(currentRatio - targetHedgeRatio);
    const shouldRebalance = ratioDiff > rebalanceThreshold;
    return {
        currentRatio,
        targetHedge,
        adjustment,
        shouldRebalance
    };
}
// ============================================================================
// SEASONAL PATTERN ANALYSIS (4 functions)
// ============================================================================
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
function extractSeasonalPattern(monthlyPrices, yearsOfData) {
    if (monthlyPrices.length !== yearsOfData * 12) {
        throw new Error('Monthly prices must match years of data (12 * years)');
    }
    if (yearsOfData < 2) {
        throw new Error('Need at least 2 years of data');
    }
    // Calculate average price for each month across all years
    const monthlyFactors = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);
    for (let i = 0; i < monthlyPrices.length; i++) {
        const month = i % 12;
        monthlyFactors[month] += monthlyPrices[i];
        monthlyCounts[month]++;
    }
    // Calculate average for each month
    for (let m = 0; m < 12; m++) {
        monthlyFactors[m] = monthlyCounts[m] > 0 ? monthlyFactors[m] / monthlyCounts[m] : 0;
    }
    // Normalize to overall average
    const overallAvg = monthlyFactors.reduce((a, b) => a + b, 0) / 12;
    for (let m = 0; m < 12; m++) {
        monthlyFactors[m] = monthlyFactors[m] / overallAvg;
    }
    // Calculate confidence (inverse of variance)
    let variance = 0;
    for (let m = 0; m < 12; m++) {
        variance += Math.pow(monthlyFactors[m] - 1, 2);
    }
    const confidence = Math.max(0, 1 - variance);
    return {
        commodity: 'Generic',
        monthlyFactors,
        confidence,
        yearsOfData
    };
}
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
function calculateYearOverYearPattern(currentYearPrices, priorYearPrices) {
    if (currentYearPrices.length !== priorYearPrices.length) {
        throw new Error('Price arrays must have same length');
    }
    if (currentYearPrices.length === 0) {
        throw new Error('Price arrays cannot be empty');
    }
    const yoyChanges = currentYearPrices.map((current, i) => {
        const prior = priorYearPrices[i];
        return prior > 0 ? ((current - prior) / prior) * 100 : 0;
    });
    const averageChange = yoyChanges.reduce((a, b) => a + b, 0) / yoyChanges.length;
    const maxChange = Math.max(...yoyChanges);
    const minChange = Math.min(...yoyChanges);
    return {
        yoyChanges,
        averageChange,
        maxChange,
        minChange
    };
}
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
function deseasonalizeCommodityPrice(prices, seasonalPattern) {
    if (prices.length === 0) {
        throw new Error('Prices array cannot be empty');
    }
    return prices.map((price, i) => {
        const month = i % 12;
        const factor = seasonalPattern.monthlyFactors[month];
        return factor > 0 ? price / factor : price;
    });
}
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
function forecastSeasonalTrend(seasonalPattern, basePrice, forecastMonths) {
    if (basePrice <= 0) {
        throw new Error('Base price must be positive');
    }
    if (forecastMonths <= 0) {
        throw new Error('Forecast months must be positive');
    }
    const forecast = [];
    for (let i = 0; i < forecastMonths; i++) {
        const month = i % 12;
        const factor = seasonalPattern.monthlyFactors[month];
        forecast.push(basePrice * factor);
    }
    return forecast;
}
// ============================================================================
// COMMODITY INDEX CONSTRUCTION (4 functions)
// ============================================================================
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
function constructCommodityIndex(index, componentPrices) {
    let indexValue = 0;
    let totalWeight = 0;
    for (const component of index.components) {
        const price = componentPrices.get(component.commodity);
        if (!price) {
            throw new Error(`Price not found for ${component.commodity}`);
        }
        indexValue += price * component.weight;
        totalWeight += component.weight;
    }
    // Normalize if needed
    if (Math.abs(totalWeight - 1.0) > 0.001) {
        indexValue = indexValue / totalWeight;
    }
    return indexValue;
}
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
function calculateIndexWeights(components, methodology) {
    if (components.length === 0) {
        throw new Error('Components array cannot be empty');
    }
    const weights = new Map();
    switch (methodology) {
        case 'equal-weight': {
            const weight = 1.0 / components.length;
            components.forEach(comp => weights.set(comp.commodity, weight));
            break;
        }
        case 'production-weight':
        case 'liquidity-weight':
        case 'market-cap-weight': {
            const totalValue = components.reduce((sum, comp) => sum + comp.value, 0);
            if (totalValue === 0) {
                throw new Error('Total value cannot be zero for value-weighted index');
            }
            components.forEach(comp => {
                weights.set(comp.commodity, comp.value / totalValue);
            });
            break;
        }
        default:
            throw new Error(`Unknown methodology: ${methodology}`);
    }
    return weights;
}
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
function implementIndexRoll(currentContracts, rollSchedule, daysToExpiry, rollMethod) {
    if (rollSchedule < 0 || daysToExpiry < 0) {
        throw new Error('Days cannot be negative');
    }
    const shouldRoll = daysToExpiry <= rollSchedule;
    let rollPercentage = 0;
    const targetContracts = [];
    if (shouldRoll) {
        switch (rollMethod) {
            case 'front-month':
                // Roll 100% on roll day
                rollPercentage = daysToExpiry === rollSchedule ? 1.0 : 0;
                break;
            case 'optimized':
                // Gradual roll over 5 days
                if (daysToExpiry <= rollSchedule && daysToExpiry > 0) {
                    rollPercentage = (rollSchedule - daysToExpiry + 1) / rollSchedule;
                }
                else {
                    rollPercentage = 1.0;
                }
                break;
            case 'constant-maturity':
                // Always maintain constant maturity (e.g., 3-month)
                rollPercentage = 1.0 / 30; // Roll 1/30th daily for monthly contracts
                break;
        }
        // Determine target contracts (simplified - next month)
        currentContracts.forEach(contract => {
            targetContracts.push(`${contract.symbol}_Next`);
        });
    }
    return {
        shouldRoll,
        rollPercentage: Math.min(rollPercentage, 1.0),
        targetContracts
    };
}
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
function replicateCommodityIndex(indexValue, indexComposition, availableFunds, contractSizes) {
    if (indexValue <= 0 || availableFunds <= 0) {
        throw new Error('Index value and available funds must be positive');
    }
    const contracts = new Map();
    let totalCost = 0;
    // Calculate contracts needed for each commodity
    for (const component of indexComposition.components) {
        const contractSize = contractSizes.get(component.commodity);
        if (!contractSize) {
            throw new Error(`Contract size not found for ${component.commodity}`);
        }
        // Target allocation
        const targetAllocation = availableFunds * component.weight;
        // Approximate contract price (simplified)
        const contractPrice = targetAllocation / contractSize;
        // Number of contracts (rounded)
        const numContracts = Math.round(targetAllocation / (contractPrice * contractSize));
        contracts.set(component.commodity, numContracts);
        totalCost += numContracts * contractPrice * contractSize;
    }
    // Calculate tracking error (simplified)
    const trackingError = Math.abs(totalCost - availableFunds) / availableFunds;
    return {
        contracts,
        totalCost,
        trackingError
    };
}
//# sourceMappingURL=commodities-trading-kit.js.map