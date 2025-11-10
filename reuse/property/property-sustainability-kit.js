"use strict";
/**
 * LOC: PROP-SUS-001
 * File: /reuse/property/property-sustainability-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Environmental compliance modules
 *   - ESG reporting systems
 *   - Sustainability tracking applications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSustainabilityReport = exports.generateSustainabilityDashboard = exports.assessMateriality = exports.mapMetricsToFrameworks = exports.generateESGBenchmarkReport = exports.calculateESGScore = exports.initiateSustainabilityReport = exports.optimizeRenewableUtilization = exports.projectRenewableGeneration = exports.configureGridIntegration = exports.calculateRenewableROI = exports.recordRenewableSystem = exports.generateComplianceCalendar = exports.updateAuditFindings = exports.analyzeComplianceRisk = exports.scheduleAudit = exports.recordCompliance = exports.alignWithSDGs = exports.calculateRequiredPace = exports.evaluateGoalStatus = exports.updateGoalProgress = exports.createSustainabilityGoal = exports.compareCertificationStandards = exports.calculateCertificationCosts = exports.assessCertificationReadiness = exports.recordGreenCertification = exports.calculateWasteCostAvoidance = exports.analyzeWasteComposition = exports.createRecyclingProgram = exports.calculateWasteDiversion = exports.recordWasteStream = exports.estimateEnergySavings = exports.calculateWaterConservationPotential = exports.detectEnergyAnomalies = exports.createWaterMetric = exports.createEnergyMetric = exports.projectCarbonEmissions = exports.calculateCarbonIntensity = exports.recordCarbonOffset = exports.convertEnergyToCO2 = exports.calculateCarbonFootprint = void 0;
Finding[];
overallRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'critical';
nonConformances: number;
correctiveActions: string[];
nextAuditDue: Date;
report ?  : string;
// ============================================================================
// CARBON FOOTPRINT TRACKING - 5 FUNCTIONS
// ============================================================================
/**
 * Calculates total carbon footprint with scope breakdown.
 *
 * @param {Record<EmissionSource, number>} emissions - Emissions by source
 * @param {number} offsetQuantity - Offsets applied in metric tons CO2e
 * @returns {CarbonFootprint} Complete carbon footprint analysis
 *
 * @example
 * ```typescript
 * const footprint = calculateCarbonFootprint(
 *   {
 *     electricity: 500,
 *     natural_gas: 150,
 *     waste: 25
 *   },
 *   50
 * );
 * ```
 */
const calculateCarbonFootprint = (emissions, offsetQuantity = 0) => {
    const scope1Sources = [
        'natural_gas',
        'fuel_oil',
        'propane',
        'refrigerants',
        'business_travel',
    ];
    const scope2Sources = ['electricity', 'purchased_steam'];
    const scope3Sources = ['water', 'waste', 'commuting'];
    const scope1 = scope1Sources.reduce((sum, src) => sum + (emissions[src] || 0), 0);
    const scope2 = scope2Sources.reduce((sum, src) => sum + (emissions[src] || 0), 0);
    const scope3 = scope3Sources.reduce((sum, src) => sum + (emissions[src] || 0), 0);
    const totalEmissions = scope1 + scope2 + scope3;
    const netEmissions = Math.max(0, totalEmissions - offsetQuantity);
    return {
        period: { start: new Date(), end: new Date() },
        totalEmissions,
        scope1Emissions: scope1,
        scope2Emissions: scope2,
        scope3Emissions: scope3,
        bySource: emissions,
        offsetsApplied: offsetQuantity,
        netEmissions,
        intensity: 0,
        lastCalculated: new Date(),
    };
};
exports.calculateCarbonFootprint = calculateCarbonFootprint;
/**
 * Converts energy consumption to CO2 equivalent using emission factors.
 *
 * @param {string} energyType - Type of energy (electricity, gas, etc.)
 * @param {number} quantity - Quantity consumed
 * @param {string} unit - Unit of measurement
 * @param {string} region - Geographic region for emission factor
 * @returns {number} CO2 equivalent in metric tons
 *
 * @example
 * ```typescript
 * const co2 = convertEnergyToCO2('electricity', 1000, 'kwh', 'US_Northeast');
 * console.log(co2); // ~0.4 metric tons
 * ```
 */
const convertEnergyToCO2 = (energyType, quantity, unit, region) => {
    const emissionFactors = {
        US_Northeast: { electricity_kwh: 0.000366, natural_gas_therm: 0.00536 },
        US_Southeast: { electricity_kwh: 0.000404, natural_gas_therm: 0.00536 },
        US_Midwest: { electricity_kwh: 0.000485, natural_gas_therm: 0.00536 },
        US_Southwest: { electricity_kwh: 0.000381, natural_gas_therm: 0.00536 },
        US_West: { electricity_kwh: 0.000245, natural_gas_therm: 0.00536 },
        EU: { electricity_kwh: 0.000233, natural_gas_therm: 0.00536 },
        ASIA: { electricity_kwh: 0.000531, natural_gas_therm: 0.00536 },
    };
    const key = `${energyType}_${unit}`;
    const factor = emissionFactors[region]?.[key] || 0.0004;
    return quantity * factor;
};
exports.convertEnergyToCO2 = convertEnergyToCO2;
/**
 * Tracks and validates carbon offset transactions.
 *
 * @param {Partial<CarbonOffset>} offsetData - Offset transaction details
 * @returns {CarbonOffset} Recorded offset
 *
 * @example
 * ```typescript
 * const offset = recordCarbonOffset({
 *   propertyId: 'PROP-001',
 *   offsetType: 'renewable_energy',
 *   provider: 'Carbon Trust',
 *   certificateNumber: 'CT-2024-001',
 *   vintage: 2024,
 *   quantity: 100,
 *   unitCost: 15
 * });
 * ```
 */
const recordCarbonOffset = (offsetData) => ({
    id: offsetData.id || `OFFSET-${Date.now()}`,
    propertyId: offsetData.propertyId,
    offsetType: offsetData.offsetType,
    provider: offsetData.provider,
    certificateNumber: offsetData.certificateNumber,
    vintage: offsetData.vintage,
    quantity: offsetData.quantity,
    unitCost: offsetData.unitCost,
    totalCost: (offsetData.quantity || 0) * (offsetData.unitCost || 0),
    verificationStandard: offsetData.verificationStandard || 'VCS',
    retirementDate: offsetData.retirementDate || new Date(),
    isRetired: offsetData.isRetired || false,
    metadata: offsetData.metadata,
});
exports.recordCarbonOffset = recordCarbonOffset;
/**
 * Calculates carbon intensity per square foot of property.
 *
 * @param {number} totalEmissions - Total emissions in metric tons CO2e
 * @param {number} propertySquareFeet - Property size in square feet
 * @returns {number} Carbon intensity metric
 *
 * @example
 * ```typescript
 * const intensity = calculateCarbonIntensity(500, 50000);
 * console.log(intensity); // 0.01 metric tons CO2e/sqft
 * ```
 */
const calculateCarbonIntensity = (totalEmissions, propertySquareFeet) => {
    if (propertySquareFeet <= 0)
        return 0;
    return totalEmissions / propertySquareFeet;
};
exports.calculateCarbonIntensity = calculateCarbonIntensity;
/**
 * Projects future carbon emissions based on historical trends.
 *
 * @param {number[]} historicalEmissions - Previous years' emissions
 * @param {number} yearsAhead - Years to project forward
 * @param {number} changeRate - Expected annual change rate (-0.05 for 5% reduction)
 * @returns {number[]} Projected emissions for future years
 *
 * @example
 * ```typescript
 * const projections = projectCarbonEmissions([500, 480, 460], 5, -0.04);
 * // Returns array of 5 projected values
 * ```
 */
const projectCarbonEmissions = (historicalEmissions, yearsAhead, changeRate = 0) => {
    if (historicalEmissions.length === 0)
        return [];
    const lastValue = historicalEmissions[historicalEmissions.length - 1];
    const projections = [];
    let currentValue = lastValue;
    for (let i = 0; i < yearsAhead; i++) {
        currentValue = currentValue * (1 + changeRate);
        projections.push(Math.max(0, currentValue));
    }
    return projections;
};
exports.projectCarbonEmissions = projectCarbonEmissions;
// ============================================================================
// ENERGY & WATER MONITORING - 5 FUNCTIONS
// ============================================================================
/**
 * Creates comprehensive energy consumption metric snapshot.
 *
 * @param {Partial<EnergyConsumptionMetric>} data - Energy consumption data
 * @returns {EnergyConsumptionMetric} Complete energy metrics
 *
 * @example
 * ```typescript
 * const metrics = createEnergyMetric({
 *   electricity: { consumption: 50000, cost: 5000, renewable: 10000 }
 * });
 * ```
 */
const createEnergyMetric = (data) => {
    const totalBtu = (data.electricity?.consumption || 0) * 3.412 +
        (data.naturalGas?.consumption || 0) * 100000 +
        (data.otherFuels?.reduce((sum, f) => sum + (f.consumption || 0), 0) || 0) * 100000;
    return {
        propertyId: data.propertyId || '',
        period: data.period || { start: new Date(), end: new Date() },
        electricity: {
            consumption: data.electricity?.consumption || 0,
            cost: data.electricity?.cost || 0,
            renewable: data.electricity?.renewable || 0,
            renewablePercent: data.electricity?.renewablePercent || 0,
        },
        naturalGas: {
            consumption: data.naturalGas?.consumption || 0,
            cost: data.naturalGas?.cost || 0,
        },
        otherFuels: data.otherFuels || [],
        totalEnergyUsage: totalBtu,
        energyIntensity: 0,
    };
};
exports.createEnergyMetric = createEnergyMetric;
/**
 * Calculates water usage metrics and conservation potential.
 *
 * @param {Partial<WaterUsageMetric>} data - Water usage data
 * @returns {WaterUsageMetric} Complete water metrics
 *
 * @example
 * ```typescript
 * const water = createWaterMetric({
 *   freshWaterConsumption: 500000,
 *   recycledWaterUsage: 50000
 * });
 * ```
 */
const createWaterMetric = (data) => {
    const freshUsage = data.freshWaterConsumption || 0;
    const recycledUsage = data.recycledWaterUsage || 0;
    const rainwater = data.rainwaterHarvested || 0;
    const totalUsage = freshUsage + recycledUsage + rainwater;
    const reuseRate = totalUsage > 0 ? ((recycledUsage + rainwater) / totalUsage) * 100 : 0;
    return {
        propertyId: data.propertyId || '',
        period: data.period || { start: new Date(), end: new Date() },
        freshWaterConsumption: freshUsage,
        recycledWaterUsage: recycledUsage,
        rainwaterHarvested: rainwater,
        totalWaterUsage: totalUsage,
        waterIntensity: 0,
        wasteWaterGenerated: data.wasteWaterGenerated || 0,
        waterTreatedOnsite: data.waterTreatedOnsite || false,
        waterReuseRate: reuseRate,
        cost: data.cost || 0,
    };
};
exports.createWaterMetric = createWaterMetric;
/**
 * Detects anomalies in energy consumption patterns.
 *
 * @param {number[]} dailyConsumption - Daily consumption readings
 * @param {number} stdDevThreshold - Standard deviations for anomaly detection
 * @returns {Array<{date: number; value: number; anomaly: boolean}>} Flagged anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectEnergyAnomalies([100, 105, 102, 104, 500, 103], 2);
 * // Flags the 500 value as anomaly
 * ```
 */
const detectEnergyAnomalies = (dailyConsumption, stdDevThreshold = 2) => {
    if (dailyConsumption.length < 3) {
        return dailyConsumption.map((val, idx) => ({
            date: idx,
            value: val,
            anomaly: false,
        }));
    }
    const mean = dailyConsumption.reduce((a, b) => a + b) / dailyConsumption.length;
    const variance = dailyConsumption.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        dailyConsumption.length;
    const stdDev = Math.sqrt(variance);
    const threshold = mean + stdDev * stdDevThreshold;
    return dailyConsumption.map((val, idx) => ({
        date: idx,
        value: val,
        anomaly: Math.abs(val - mean) > stdDev * stdDevThreshold,
    }));
};
exports.detectEnergyAnomalies = detectEnergyAnomalies;
/**
 * Calculates water conservation opportunity score.
 *
 * @param {WaterUsageMetric} metric - Current water usage metrics
 * @param {number} benchmarkConsumption - Industry benchmark consumption
 * @returns {number} Conservation opportunity score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateWaterConservationPotential(waterMetric, 350000);
 * ```
 */
const calculateWaterConservationPotential = (metric, benchmarkConsumption) => {
    const currentUsage = metric.totalWaterUsage;
    if (currentUsage <= benchmarkConsumption)
        return 100;
    const excess = currentUsage - benchmarkConsumption;
    const percentOverBenchmark = (excess / benchmarkConsumption) * 100;
    const score = Math.max(0, 100 - percentOverBenchmark);
    return Math.round(score);
};
exports.calculateWaterConservationPotential = calculateWaterConservationPotential;
/**
 * Estimates energy savings from conservation measures.
 *
 * @param {EnergyConsumptionMetric} baseline - Baseline energy consumption
 * @param {Array<{measure: string; savingsPercent: number}>} measures - Conservation measures
 * @returns {object} Projected savings summary
 *
 * @example
 * ```typescript
 * const savings = estimateEnergySavings(baseline, [
 *   { measure: 'LED retrofit', savingsPercent: 15 },
 *   { measure: 'HVAC optimization', savingsPercent: 10 }
 * ]);
 * ```
 */
const estimateEnergySavings = (baseline, measures) => {
    const totalSavingsPercent = measures.reduce((sum, m) => sum + m.savingsPercent, 0);
    const electricitySavings = baseline.electricity.consumption * (totalSavingsPercent / 100);
    const gasSavings = baseline.naturalGas.consumption * (totalSavingsPercent / 100);
    const costSavings = electricitySavings * (baseline.electricity.cost / baseline.electricity.consumption) +
        gasSavings * (baseline.naturalGas.cost / baseline.naturalGas.consumption);
    return {
        totalSavingsPercent,
        savedKwh: electricitySavings,
        savedTherms: gasSavings,
        savingsByCurrency: costSavings,
        measures: measures.map((m) => ({
            ...m,
            kwhSaved: baseline.electricity.consumption * (m.savingsPercent / 100),
        })),
    };
};
exports.estimateEnergySavings = estimateEnergySavings;
// ============================================================================
// WASTE MANAGEMENT & RECYCLING - 5 FUNCTIONS
// ============================================================================
/**
 * Records waste stream data with categorization.
 *
 * @param {Partial<WasteStream>} data - Waste stream information
 * @returns {WasteStream} Recorded waste stream
 *
 * @example
 * ```typescript
 * const waste = recordWasteStream({
 *   propertyId: 'PROP-001',
 *   wasteType: 'paper',
 *   quantity: 10,
 *   disposalMethod: 'recycling'
 * });
 * ```
 */
const recordWasteStream = (data) => ({
    id: data.id || `WASTE-${Date.now()}`,
    propertyId: data.propertyId,
    wasteType: data.wasteType,
    description: data.description || '',
    quantity: data.quantity,
    unit: data.unit || 'metric_ton',
    disposalMethod: data.disposalMethod,
    vendor: data.vendor,
    cost: data.cost || 0,
    recycleContent: data.recycleContent || 0,
    isHazardous: data.isHazardous || false,
    recordedDate: data.recordedDate || new Date(),
    fiscalYear: data.fiscalYear || new Date().getFullYear(),
});
exports.recordWasteStream = recordWasteStream;
/**
 * Calculates waste diversion rate and landfill reduction.
 *
 * @param {WasteStream[]} wasteStreams - All waste streams for period
 * @returns {object} Waste diversion metrics
 *
 * @example
 * ```typescript
 * const diversion = calculateWasteDiversion(wasteData);
 * ```
 */
const calculateWasteDiversion = (wasteStreams) => {
    const totalWaste = wasteStreams.reduce((sum, w) => sum + w.quantity, 0);
    const divertedWaste = wasteStreams
        .filter((w) => w.disposalMethod !== 'landfill')
        .reduce((sum, w) => sum + w.quantity, 0);
    const landfillWaste = wasteStreams
        .filter((w) => w.disposalMethod === 'landfill')
        .reduce((sum, w) => sum + w.quantity, 0);
    const diversionRate = totalWaste > 0 ? (divertedWaste / totalWaste) * 100 : 0;
    const costSavings = wasteStreams
        .filter((w) => w.disposalMethod === 'recycling' || w.disposalMethod === 'donation')
        .reduce((sum, w) => sum + w.cost, 0);
    return {
        totalWaste,
        divertedWaste,
        landfillWaste,
        diversionRate: Math.round(diversionRate),
        costSavings,
    };
};
exports.calculateWasteDiversion = calculateWasteDiversion;
/**
 * Creates recycling program tracking record.
 *
 * @param {Partial<RecyclingProgram>} data - Program information
 * @returns {RecyclingProgram} Recycling program record
 *
 * @example
 * ```typescript
 * const program = createRecyclingProgram({
 *   propertyId: 'PROP-001',
 *   name: 'Comprehensive Recycling Initiative',
 *   wasteTypesIncluded: ['paper', 'plastic', 'glass']
 * });
 * ```
 */
const createRecyclingProgram = (data) => ({
    id: data.id || `RECYCLE-${Date.now()}`,
    propertyId: data.propertyId,
    name: data.name,
    status: data.status || 'active',
    wasteTypesIncluded: data.wasteTypesIncluded || [],
    recyclingRate: data.recyclingRate || 0,
    materialsDivertedFromLandfill: data.materialsDivertedFromLandfill || 0,
    annualSavings: data.annualSavings || 0,
    participantCount: data.participantCount,
    launchDate: data.launchDate || new Date(),
    targetRecyclingRate: data.targetRecyclingRate || 75,
});
exports.createRecyclingProgram = createRecyclingProgram;
/**
 * Analyzes waste composition and hazard levels.
 *
 * @param {WasteStream[]} wasteStreams - Waste streams to analyze
 * @returns {object} Composition and hazard analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeWasteComposition(wasteData);
 * ```
 */
const analyzeWasteComposition = (wasteStreams) => {
    const byType = {};
    const costByType = {};
    let hazardousTotal = 0;
    wasteStreams.forEach((w) => {
        byType[w.wasteType] = (byType[w.wasteType] || 0) + w.quantity;
        costByType[w.wasteType] = (costByType[w.wasteType] || 0) + w.cost;
        if (w.isHazardous)
            hazardousTotal += w.quantity;
    });
    const totalWaste = Object.values(byType).reduce((a, b) => a + b, 0);
    const highestVolume = Object.entries(byType).sort(([, a], [, b]) => b - a)[0]?.[0];
    return {
        byType,
        hazardousWaste: hazardousTotal,
        hazardousPercent: totalWaste > 0 ? (hazardousTotal / totalWaste) * 100 : 0,
        highestVolumeWaste: highestVolume,
        costByWasteType: costByType,
    };
};
exports.analyzeWasteComposition = analyzeWasteComposition;
/**
 * Calculates cost avoidance from waste reduction initiatives.
 *
 * @param {WasteStream[]} baseline - Baseline waste streams
 * @param {WasteStream[]} current - Current waste streams
 * @param {number} landfillCostPerTon - Landfill disposal cost
 * @returns {object} Cost avoidance summary
 *
 * @example
 * ```typescript
 * const savings = calculateWasteCostAvoidance(baseline, current, 75);
 * ```
 */
const calculateWasteCostAvoidance = (baseline, current, landfillCostPerTon) => {
    const baselineTotal = baseline.reduce((sum, w) => sum + w.quantity, 0);
    const currentTotal = current.reduce((sum, w) => sum + w.quantity, 0);
    const reducedWaste = baselineTotal - currentTotal;
    const avoidedCosts = reducedWaste * landfillCostPerTon;
    return {
        baselineWaste: baselineTotal,
        currentWaste: currentTotal,
        reducedWaste,
        avoidedCosts: Math.max(0, avoidedCosts),
        reductionPercent: baselineTotal > 0 ? (reducedWaste / baselineTotal) * 100 : 0,
    };
};
exports.calculateWasteCostAvoidance = calculateWasteCostAvoidance;
// ============================================================================
// GREEN BUILDING CERTIFICATIONS - 4 FUNCTIONS
// ============================================================================
/**
 * Registers or updates green building certification.
 *
 * @param {Partial<GreenCertification>} data - Certification details
 * @returns {GreenCertification} Certification record
 *
 * @example
 * ```typescript
 * const cert = recordGreenCertification({
 *   propertyId: 'PROP-001',
 *   certificationName: 'LEED',
 *   certificationLevel: 'Gold',
 *   achievementScore: 75
 * });
 * ```
 */
const recordGreenCertification = (data) => ({
    id: data.id || `CERT-${Date.now()}`,
    propertyId: data.propertyId,
    certificationName: data.certificationName,
    certificationLevel: data.certificationLevel,
    certifyingBody: data.certifyingBody || '',
    issueDate: data.issueDate || new Date(),
    expirationDate: data.expirationDate,
    isActive: data.isActive !== false,
    achievementScore: data.achievementScore,
    scoreMetricType: data.scoreMetricType || 'percentage',
    totalScore: data.totalScore,
    certificationNumber: data.certificationNumber,
    auditDate: data.auditDate,
    nextAuditDue: data.nextAuditDue,
    costs: {
        applicationFee: data.costs?.applicationFee || 0,
        annualFee: data.costs?.annualFee || 0,
        auditFee: data.costs?.auditFee,
    },
});
exports.recordGreenCertification = recordGreenCertification;
/**
 * Evaluates progress toward certification requirements.
 *
 * @param {GreenCertification} cert - Certification record
 * @param {Record<string, number>} criteriaCompletion - Criterion completion status
 * @returns {object} Certification readiness assessment
 *
 * @example
 * ```typescript
 * const readiness = assessCertificationReadiness(cert, {
 *   'Energy Performance': 85,
 *   'Water Efficiency': 70
 * });
 * ```
 */
const assessCertificationReadiness = (cert, criteriaCompletion) => {
    const values = Object.values(criteriaCompletion);
    const overallReadiness = values.length > 0 ? Math.round(values.reduce((a, b) => a + b) / values.length) : 0;
    const gaps = Object.entries(criteriaCompletion)
        .filter(([, percent]) => percent < 100)
        .map(([criterion, percent]) => ({ criterion, completionPercent: percent }));
    return {
        criteria: criteriaCompletion,
        overallReadiness,
        readyForCertification: overallReadiness >= 90,
        gapsRemaining: gaps,
    };
};
exports.assessCertificationReadiness = assessCertificationReadiness;
/**
 * Calculates certification maintenance and renewal costs.
 *
 * @param {GreenCertification[]} certifications - Active certifications
 * @param {number} yearsProjection - Years to project costs
 * @returns {object} Cost analysis and recommendations
 *
 * @example
 * ```typescript
 * const costs = calculateCertificationCosts(certs, 5);
 * ```
 */
const calculateCertificationCosts = (certifications, yearsProjection = 1) => {
    let annualCosts = 0;
    const costByType = {};
    certifications.forEach((c) => {
        const annualCost = (c.costs.annualFee || 0) + (c.costs.auditFee || 0) / 3;
        annualCosts += annualCost;
        costByType[c.certificationName] = annualCost;
    });
    const upcomingRenewals = certifications
        .filter((c) => c.expirationDate)
        .map((c) => ({
        cert: c.certificationName,
        renewalDate: c.expirationDate,
        cost: (c.costs.applicationFee || 0) + (c.costs.annualFee || 0),
    }));
    return {
        annualCosts,
        projectedCosts: annualCosts * yearsProjection,
        costByType,
        renewal: upcomingRenewals,
    };
};
exports.calculateCertificationCosts = calculateCertificationCosts;
/**
 * Compares multiple certification standards and recommendations.
 *
 * @param {CertificationType[]} certifications - Certifications to compare
 * @param {object} propertyProfile - Property characteristics
 * @returns {Array<{cert: CertificationType; alignment: number; pros: string[]; cons: string[]}>}
 *
 * @example
 * ```typescript
 * const comparison = compareCertificationStandards(
 *   ['LEED', 'BREEAM', 'ENERGY_STAR'],
 *   { squareFeet: 100000, type: 'office' }
 * );
 * ```
 */
const compareCertificationStandards = (certifications, propertyProfile) => {
    const alignmentScores = {
        LEED: propertyProfile.type === 'office' ? 95 : 70,
        BREEAM: propertyProfile.type === 'commercial' ? 90 : 75,
        ENERGY_STAR: 85,
        Green_Globes: 80,
        Fitwel: propertyProfile.type === 'office' ? 90 : 60,
        Living_Building_Challenge: 75,
        WELL: propertyProfile.type === 'office' ? 95 : 65,
        ISO_14001: 85,
        B_Corp: 70,
        Net_Zero_Ready: 80,
        Climate_Pledge_Arena: 65,
        Carbon_Trust: 75,
        SITES: propertyProfile.type === 'commercial' ? 80 : 70,
    };
    return certifications.map((cert) => ({
        cert,
        alignment: alignmentScores[cert] || 70,
        pros: [`Recognized standard for ${cert}`, 'Credible third-party validation'],
        cons: ['Costs associated', 'Audit requirements'],
    }));
};
exports.compareCertificationStandards = compareCertificationStandards;
// ============================================================================
// SUSTAINABILITY GOALS & TARGETS - 5 FUNCTIONS
// ============================================================================
/**
 * Creates a sustainability goal with progress tracking.
 *
 * @param {Partial<SustainabilityGoal>} data - Goal definition
 * @returns {SustainabilityGoal} Goal record
 *
 * @example
 * ```typescript
 * const goal = createSustainabilityGoal({
 *   propertyId: 'PROP-001',
 *   goalType: 'reduction',
 *   category: 'carbon_neutrality',
 *   targetValue: 50,
 *   targetUnit: 'percent',
 *   baselineValue: 100,
 *   baselineYear: 2020,
 *   deadline: new Date('2030-12-31')
 * });
 * ```
 */
const createSustainabilityGoal = (data) => ({
    id: data.id || `GOAL-${Date.now()}`,
    propertyId: data.propertyId,
    goalType: data.goalType,
    category: data.category,
    description: data.description || '',
    targetValue: data.targetValue,
    targetUnit: data.targetUnit,
    baselineValue: data.baselineValue,
    baselineYear: data.baselineYear,
    deadline: data.deadline,
    priority: data.priority || 'medium',
    status: data.status || 'proposed',
    scienceBasedTarget: data.scienceBasedTarget || false,
    alignmentWithSDGs: data.alignmentWithSDGs,
    owningDepartment: data.owningDepartment,
    progressCheckpoints: data.progressCheckpoints || [],
    currentProgress: data.currentProgress,
    completionPercentage: data.completionPercentage,
});
exports.createSustainabilityGoal = createSustainabilityGoal;
/**
 * Updates goal progress and calculates completion percentage.
 *
 * @param {SustainabilityGoal} goal - Goal to update
 * @param {number} currentValue - Current achievement value
 * @returns {SustainabilityGoal} Updated goal with progress
 *
 * @example
 * ```typescript
 * const updated = updateGoalProgress(goal, 45);
 * ```
 */
const updateGoalProgress = (goal, currentValue) => {
    const targetReduction = Math.abs(goal.targetValue - goal.baselineValue);
    const currentReduction = Math.abs(goal.baselineValue - currentValue);
    const completionPercent = targetReduction > 0 ? Math.min(100, (currentReduction / targetReduction) * 100) : 0;
    return {
        ...goal,
        currentProgress: currentValue,
        completionPercentage: Math.round(completionPercent),
        progressCheckpoints: [
            ...goal.progressCheckpoints,
            {
                checkpointDate: new Date(),
                targetValue: goal.targetValue,
                actualValue: currentValue,
                percentComplete: Math.round(completionPercent),
                lastUpdated: new Date(),
            },
        ],
    };
};
exports.updateGoalProgress = updateGoalProgress;
/**
 * Evaluates goal achievement status with timeline analysis.
 *
 * @param {SustainabilityGoal} goal - Goal to evaluate
 * @returns {object} Achievement status and trajectory
 *
 * @example
 * ```typescript
 * const status = evaluateGoalStatus(goal);
 * ```
 */
const evaluateGoalStatus = (goal) => {
    const today = new Date();
    const yearsToDeadline = (goal.deadline.getTime() - today.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const percentComplete = goal.completionPercentage || 0;
    const expectedProgressByNow = yearsToDeadline > 0 ? 100 - (yearsToDeadline / 10) * 100 : 100;
    let trajectory;
    if (percentComplete > expectedProgressByNow + 10) {
        trajectory = 'ahead_of_schedule';
    }
    else if (percentComplete >= expectedProgressByNow - 10) {
        trajectory = 'on_track';
    }
    else if (percentComplete >= expectedProgressByNow - 25) {
        trajectory = 'at_risk';
    }
    else {
        trajectory = 'off_track';
    }
    const actions = [];
    if (trajectory === 'off_track') {
        actions.push('Escalate to management', 'Increase resources', 'Review implementation plan');
    }
    else if (trajectory === 'at_risk') {
        actions.push('Monitor progress closely', 'Adjust timeline if needed');
    }
    return {
        status: goal.status,
        trajectory,
        percentToTarget: percentComplete,
        yearsRemaining: Math.max(0, yearsToDeadline),
        recommendedActions: actions,
    };
};
exports.evaluateGoalStatus = evaluateGoalStatus;
/**
 * Calculates required progress pace to meet goals.
 *
 * @param {SustainabilityGoal} goal - Goal with deadline
 * @param {number} currentProgress - Current progress value
 * @returns {object} Required pacing and milestone schedule
 *
 * @example
 * ```typescript
 * const pacing = calculateRequiredPace(goal, 30);
 * ```
 */
const calculateRequiredPace = (goal, currentProgress) => {
    const today = new Date();
    const monthsRemaining = (goal.deadline.getFullYear() - today.getFullYear()) * 12 +
        (goal.deadline.getMonth() - today.getMonth());
    const remainingReduction = Math.abs(goal.targetValue - currentProgress);
    const requiredPerMonth = monthsRemaining > 0 ? remainingReduction / monthsRemaining : 0;
    const requiredPerQuarter = requiredPerMonth * 3;
    const annualTarget = requiredPerMonth * 12;
    const milestones = [];
    for (let i = 1; i <= 4; i++) {
        const milestoneDate = new Date(today);
        milestoneDate.setMonth(milestoneDate.getMonth() + Math.floor(monthsRemaining / 4) * i);
        milestones.push({
            date: milestoneDate,
            targetValue: currentProgress + remainingReduction * (i / 4),
        });
    }
    return {
        requiredReductionPerMonth: Math.round(requiredPerMonth * 100) / 100,
        requiredReductionPerQuarter: Math.round(requiredPerQuarter * 100) / 100,
        annualTarget: Math.round(annualTarget * 100) / 100,
        milestoneDates: milestones,
    };
};
exports.calculateRequiredPace = calculateRequiredPace;
/**
 * Compares goal alignment with UN Sustainable Development Goals.
 *
 * @param {SustainabilityGoal[]} goals - Portfolio of sustainability goals
 * @returns {Record<string, SustainabilityGoal[]>} Goals mapped to SDGs
 *
 * @example
 * ```typescript
 * const sdgAlignment = alignWithSDGs(goals);
 * ```
 */
const alignWithSDGs = (goals) => {
    const sdgMap = {
        'SDG 7 - Affordable and Clean Energy': [],
        'SDG 12 - Responsible Consumption': [],
        'SDG 13 - Climate Action': [],
        'SDG 15 - Life on Land': [],
        'SDG 6 - Clean Water': [],
    };
    goals.forEach((goal) => {
        const alignments = goal.alignmentWithSDGs || [];
        alignments.forEach((sdg) => {
            if (sdgMap[sdg]) {
                sdgMap[sdg].push(goal);
            }
        });
    });
    return sdgMap;
};
exports.alignWithSDGs = alignWithSDGs;
// ============================================================================
// ENVIRONMENTAL COMPLIANCE & AUDITS - 5 FUNCTIONS
// ============================================================================
/**
 * Registers environmental compliance requirement.
 *
 * @param {Partial<EnvironmentalCompliance>} data - Compliance details
 * @returns {EnvironmentalCompliance} Compliance record
 *
 * @example
 * ```typescript
 * const compliance = recordCompliance({
 *   propertyId: 'PROP-001',
 *   regulationType: 'emissions_reporting',
 *   requirement: 'Annual greenhouse gas emissions disclosure',
 *   deadline: new Date('2024-12-31')
 * });
 * ```
 */
const recordCompliance = (data) => ({
    id: data.id || `COMP-${Date.now()}`,
    propertyId: data.propertyId,
    regulationType: data.regulationType,
    jurisdiction: data.jurisdiction || '',
    requirement: data.requirement,
    deadline: data.deadline,
    status: data.status || 'in_progress',
    percentComplete: data.percentComplete || 0,
    riskLevel: data.riskLevel || 'medium',
    responsibleParty: data.responsibleParty,
    requiredDocumentation: data.requiredDocumentation || [],
    submissionDate: data.submissionDate,
    lastAuditDate: data.lastAuditDate,
    nextAuditDue: data.nextAuditDue,
    associatedCosts: data.associatedCosts,
    notes: data.notes,
});
exports.recordCompliance = recordCompliance;
/**
 * Schedules and tracks environmental audits.
 *
 * @param {Partial<EnvironmentalAudit>} data - Audit details
 * @returns {EnvironmentalAudit} Audit record
 *
 * @example
 * ```typescript
 * const audit = scheduleAudit({
 *   propertyId: 'PROP-001',
 *   auditType: 'energy_audit',
 *   auditedBy: 'Certified Auditor'
 * });
 * ```
 */
const scheduleAudit = (data) => {
    const nextAudit = new Date();
    nextAudit.setFullYear(nextAudit.getFullYear() + 1);
    return {
        id: data.id || `AUDIT-${Date.now()}`,
        propertyId: data.propertyId,
        auditType: data.auditType,
        auditDate: data.auditDate || new Date(),
        auditedBy: data.auditedBy,
        findings: data.findings || [],
        overallRating: data.overallRating || 'satisfactory',
        nonConformances: data.nonConformances || 0,
        correctiveActions: data.correctiveActions || [],
        nextAuditDue: data.nextAuditDue || nextAudit,
        report: data.report,
    };
};
exports.scheduleAudit = scheduleAudit;
/**
 * Calculates compliance risk and prioritizes requirements.
 *
 * @param {EnvironmentalCompliance[]} requirements - All compliance requirements
 * @returns {object} Risk analysis and prioritization matrix
 *
 * @example
 * ```typescript
 * const riskAnalysis = analyzeComplianceRisk(requirements);
 * ```
 */
const analyzeComplianceRisk = (requirements) => {
    const today = new Date();
    const criticalItems = requirements.filter((r) => r.riskLevel === 'critical');
    const atRiskItems = requirements.filter((r) => (r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000) < 90 &&
        r.status !== 'compliant');
    const overallRisk = criticalItems.length > 0 ? 'high' : atRiskItems.length > 0 ? 'medium' : 'low';
    const priorities = requirements
        .filter((r) => r.status !== 'compliant')
        .map((r) => ({
        requirement: r.requirement,
        daysUntilDeadline: Math.ceil((r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)),
        riskLevel: r.riskLevel,
    }))
        .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)
        .slice(0, 5);
    return {
        criticalItems,
        atRiskCount: atRiskItems.length,
        overallRisk,
        recommendedPriorities: priorities,
    };
};
exports.analyzeComplianceRisk = analyzeComplianceRisk;
/**
 * Tracks audit findings and corrective action progress.
 *
 * @param {EnvironmentalAudit} audit - Completed audit
 * @param {AuditFinding[]} updatedFindings - Finding updates with completion status
 * @returns {EnvironmentalAudit} Updated audit record
 *
 * @example
 * ```typescript
 * const updated = updateAuditFindings(audit, findings);
 * ```
 */
const updateAuditFindings = (audit, updatedFindings) => {
    const completedActions = updatedFindings.filter((f) => f.completionDate).length;
    const remainingActions = updatedFindings.filter((f) => !f.completionDate).length;
    return {
        ...audit,
        findings: updatedFindings,
        nonConformances: updatedFindings.filter((f) => f.severity === 'critical' || f.severity === 'major').length,
        correctiveActions: updatedFindings
            .filter((f) => f.correctionRequired)
            .map((f) => `${f.description} - ${f.completionDate ? 'Completed' : 'In Progress'}`),
    };
};
exports.updateAuditFindings = updateAuditFindings;
/**
 * Generates compliance calendar with deadline tracking.
 *
 * @param {EnvironmentalCompliance[]} requirements - Compliance requirements
 * @param {number} months - Number of months to project
 * @returns {object} Calendar of upcoming deadlines
 *
 * @example
 * ```typescript
 * const calendar = generateComplianceCalendar(requirements, 12);
 * ```
 */
const generateComplianceCalendar = (requirements, months = 12) => {
    const calendar = {};
    const today = new Date();
    requirements.forEach((req) => {
        const monthKey = `${req.deadline.getFullYear()}-${String(req.deadline.getMonth() + 1).padStart(2, '0')}`;
        if (!calendar[monthKey])
            calendar[monthKey] = [];
        calendar[monthKey].push(req);
    });
    const upcomingDeadlines = requirements
        .filter((r) => r.deadline >= today &&
        (r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000) <= months * 30)
        .map((r) => ({
        requirement: r.requirement,
        deadline: r.deadline,
        daysRemaining: Math.ceil((r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)),
    }))
        .sort((a, b) => a.daysRemaining - b.daysRemaining);
    const overdue = requirements.filter((r) => r.deadline < today && r.status !== 'compliant');
    return {
        calendar,
        upcomingDeadlines,
        overduDeadlines: overdue,
    };
};
exports.generateComplianceCalendar = generateComplianceCalendar;
// ============================================================================
// RENEWABLE ENERGY INTEGRATION - 5 FUNCTIONS
// ============================================================================
/**
 * Records renewable energy system installation and performance.
 *
 * @param {Partial<RenewableEnergySystem>} data - System details
 * @returns {RenewableEnergySystem} System record
 *
 * @example
 * ```typescript
 * const solar = recordRenewableSystem({
 *   propertyId: 'PROP-001',
 *   systemType: 'solar_pv',
 *   capacity: 50,
 *   annualProduction: 65000
 * });
 * ```
 */
const recordRenewableSystem = (data) => ({
    id: data.id || `RENEW-${Date.now()}`,
    propertyId: data.propertyId,
    systemType: data.systemType,
    capacity: data.capacity,
    installedDate: data.installedDate || new Date(),
    status: data.status || 'operational',
    annualProduction: data.annualProduction,
    actualProduction: data.actualProduction,
    performanceRatio: data.performanceRatio,
    investmentCost: data.investmentCost,
    incentivesReceived: data.incentivesReceived,
    paybackPeriod: data.paybackPeriod,
    lifespan: data.lifespan || 25,
    monitoring: {
        realtime: data.monitoring?.realtime || false,
        lastUpdate: data.monitoring?.lastUpdate || new Date(),
        currentOutput: data.monitoring?.currentOutput,
    },
});
exports.recordRenewableSystem = recordRenewableSystem;
/**
 * Calculates renewable energy return on investment and payback.
 *
 * @param {RenewableEnergySystem} system - Renewable system
 * @param {number} electricityRate - $/kWh rate
 * @returns {object} Financial analysis
 *
 * @example
 * ```typescript
 * const roi = calculateRenewableROI(solar, 0.12);
 * ```
 */
const calculateRenewableROI = (system, electricityRate) => {
    const annualProduction = system.actualProduction || system.annualProduction;
    const annualSavings = annualProduction * electricityRate;
    const investment = system.investmentCost || 0;
    const incentives = system.incentivesReceived || 0;
    const netInvestment = investment - incentives;
    const payback = netInvestment > 0 ? netInvestment / Math.max(annualSavings, 0.01) : 0;
    const roi = (annualSavings / Math.max(netInvestment, 1)) * 100;
    const npv = annualSavings * 25 - netInvestment;
    return {
        annualProduction,
        annualSavings: Math.round(annualSavings),
        investmentCost: investment,
        netInvestment,
        paybackPeriod: Math.round(payback * 10) / 10,
        roi: Math.round(roi),
        npv25Year: npv,
    };
};
exports.calculateRenewableROI = calculateRenewableROI;
/**
 * Configures grid integration and demand response capabilities.
 *
 * @param {Partial<GridIntegration>} data - Grid settings
 * @returns {GridIntegration} Grid integration record
 *
 * @example
 * ```typescript
 * const gridIntegration = configureGridIntegration({
 *   propertyId: 'PROP-001',
 *   exportCapability: true,
 *   demandResponseParticipation: true
 * });
 * ```
 */
const configureGridIntegration = (data) => ({
    propertyId: data.propertyId,
    exportCapability: data.exportCapability || false,
    gridConnected: data.gridConnected || false,
    netMeteringAvailable: data.netMeteringAvailable || false,
    demandResponseParticipation: data.demandResponseParticipation || false,
    virtualPowerPlantMember: data.virtualPowerPlantMember || false,
    microGridParticipation: data.microGridParticipation || false,
    peakShavingCapability: data.peakShavingCapability || 0,
    demandFlexibilityScore: data.demandFlexibilityScore,
    gridServicesRevenue: data.gridServicesRevenue,
});
exports.configureGridIntegration = configureGridIntegration;
/**
 * Projects renewable energy generation with weather and performance factors.
 *
 * @param {RenewableEnergySystem} system - System configuration
 * @param {number} yearsAhead - Years to project
 * @param {number} performanceDegradation - Annual performance loss percentage
 * @returns {number[]} Projected annual production
 *
 * @example
 * ```typescript
 * const projections = projectRenewableGeneration(solar, 25, 0.005);
 * ```
 */
const projectRenewableGeneration = (system, yearsAhead, performanceDegradation = 0.005) => {
    const projections = [];
    let currentProduction = system.annualProduction;
    for (let i = 0; i < yearsAhead; i++) {
        currentProduction = currentProduction * (1 - performanceDegradation);
        projections.push(Math.max(0, currentProduction));
    }
    return projections;
};
exports.projectRenewableGeneration = projectRenewableGeneration;
/**
 * Optimizes renewable energy utilization with battery storage modeling.
 *
 * @param {RenewableEnergySystem} renewable - Renewable system
 * @param {number} storageCapacity - Battery storage in kWh
 * @param {number} consumptionProfile - Average hourly consumption
 * @returns {object} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = optimizeRenewableUtilization(solar, 200, 10);
 * ```
 */
const optimizeRenewableUtilization = (renewable, storageCapacity, consumptionProfile) => {
    const annualProduction = renewable.annualProduction;
    const avgHourlyProduction = annualProduction / 8760;
    const selfConsumptionRate = Math.min(100, (consumptionProfile / Math.max(avgHourlyProduction, 1)) * 100);
    const gridExport = Math.max(0, avgHourlyProduction - consumptionProfile);
    const recommendedStorage = Math.max(0, (gridExport * 4 - storageCapacity) * 8);
    const peakShaving = Math.min(gridExport, storageCapacity / 4);
    return {
        selfConsumptionRate: Math.round(selfConsumptionRate),
        gridExportCapacity: Math.round(gridExport),
        storageRecommendation: Math.round(recommendedStorage),
        optimizedSchedule: `Store excess during peak production (${avgHourlyProduction > consumptionProfile ? 'Daytime' : 'Nighttime'}), discharge during high consumption`,
        peakShavingPotential: Math.round(peakShaving),
    };
};
exports.optimizeRenewableUtilization = optimizeRenewableUtilization;
// ============================================================================
// SUSTAINABILITY REPORTING & ESG - 6 FUNCTIONS
// ============================================================================
/**
 * Creates comprehensive sustainability report structure.
 *
 * @param {Partial<SustainabilityReport>} data - Report details
 * @returns {SustainabilityReport} Report skeleton
 *
 * @example
 * ```typescript
 * const report = initiateSustainabilityReport({
 *   propertyId: 'PROP-001',
 *   reportingYear: 2024,
 *   reportType: 'annual_sustainability',
 *   frameworksUsed: ['GRI', 'SASB']
 * });
 * ```
 */
const initiateSustainabilityReport = (data) => ({
    id: data.id || `REPORT-${Date.now()}`,
    propertyId: data.propertyId,
    portfolioId: data.portfolioId,
    reportingYear: data.reportingYear || new Date().getFullYear(),
    reportType: data.reportType,
    frameworksUsed: data.frameworksUsed || [],
    sections: data.sections || [],
    environmentalMetrics: data.environmentalMetrics || {
        carboneFootprint: 0,
        energyConsumption: 0,
        renewableEnergyPercentage: 0,
        waterConsumption: 0,
        wasteGenerated: 0,
        wasteRecycled: 0,
        wasteRecyclingRate: 0,
        hazardousWaste: 0,
    },
    socialMetrics: data.socialMetrics,
    governanceMetrics: data.governanceMetrics,
    stakeholderEngagement: data.stakeholderEngagement,
    assuranceLevel: data.assuranceLevel,
    externalAssurance: data.externalAssurance || false,
    assuranceProvider: data.assuranceProvider,
});
exports.initiateSustainabilityReport = initiateSustainabilityReport;
/**
 * Calculates ESG (Environmental, Social, Governance) score.
 *
 * @param {EnvironmentalMetrics} env - Environmental metrics
 * @param {SocialMetrics} social - Social metrics
 * @param {GovernanceMetrics} gov - Governance metrics
 * @returns {ESGScore} Composite ESG score
 *
 * @example
 * ```typescript
 * const esgScore = calculateESGScore(envMetrics, socialMetrics, govMetrics);
 * ```
 */
const calculateESGScore = (env, social, gov) => {
    // Environmental scoring (0-100)
    const energyScore = Math.min(100, ((env.renewableEnergyPercentage || 0) / 100) * 100);
    const wasteScore = Math.min(100, (env.wasteRecyclingRate || 0));
    const environmentalScore = Math.round((energyScore + wasteScore) / 2);
    // Social scoring (0-100)
    const socialScore = Math.round(((social?.femaleLeadershipPercentage || 50) / 100) * 50 +
        ((social?.communityInvestment || 0) > 0 ? 50 : 0));
    // Governance scoring (0-100)
    const govScore = Math.round(((gov?.boardDiversity || 50) / 100) * 50 +
        (gov?.whistleblowerMechanismInPlace ? 50 : 0));
    const overallScore = Math.round((environmentalScore * 0.5 + socialScore * 0.25 + govScore * 0.25));
    return {
        evaluationDate: new Date(),
        overallScore,
        environmentalScore,
        socialScore,
        governanceScore: govScore,
        improvementAreas: [],
        strengths: [],
    };
};
exports.calculateESGScore = calculateESGScore;
/**
 * Generates ESG report with benchmarking.
 *
 * @param {ESGScore} score - ESG score
 * @param {object} benchmarks - Industry benchmarks
 * @returns {object} ESG report with comparisons
 *
 * @example
 * ```typescript
 * const report = generateESGBenchmarkReport(score, benchmarks);
 * ```
 */
const generateESGBenchmarkReport = (score, benchmarks) => {
    const gap = {
        overall: benchmarks.industryAverage - score.overallScore,
        environmental: benchmarks.industryAverage - score.environmentalScore,
        social: benchmarks.industryAverage - score.socialScore,
        governance: benchmarks.industryAverage - score.governanceScore,
    };
    const recommendations = [];
    if (gap.environmental > 10) {
        recommendations.push('Strengthen environmental initiatives to meet industry standards');
    }
    if (gap.social > 10) {
        recommendations.push('Enhance social responsibility programs');
    }
    if (gap.governance > 10) {
        recommendations.push('Improve governance structures and transparency');
    }
    const percentile = Math.round(((benchmarks.topQuartile - score.overallScore) /
        (benchmarks.topQuartile - benchmarks.industryAverage)) *
        100);
    return {
        score,
        benchmarks: {
            industryAverage: benchmarks.industryAverage,
            peerAverage: benchmarks.peerAverage,
            topQuartile: benchmarks.topQuartile,
        },
        performanceGap: gap,
        percentile: Math.max(0, Math.min(100, percentile)),
        recommendations,
    };
};
exports.generateESGBenchmarkReport = generateESGBenchmarkReport;
/**
 * Maps metrics to reporting frameworks (GRI, SASB, TCFD, etc.).
 *
 * @param {EnvironmentalMetrics} metrics - Environmental metrics
 * @param {ReportingFramework[]} frameworks - Frameworks to map to
 * @returns {Record<string, Record<string, unknown>>} Framework-mapped metrics
 *
 * @example
 * ```typescript
 * const mapped = mapMetricsToFrameworks(metrics, ['GRI', 'SASB']);
 * ```
 */
const mapMetricsToFrameworks = (metrics, frameworks) => {
    const mappings = {};
    frameworks.forEach((framework) => {
        if (framework === 'GRI') {
            mappings.GRI = {
                '305-1': metrics.scope1Emissions || 0,
                '305-2': metrics.scope2Emissions || 0,
                '306-3': metrics.wasteGenerated,
                '303-3': metrics.waterConsumption,
            };
        }
        else if (framework === 'SASB') {
            mappings.SASB = {
                'Energy_Management': metrics.energyConsumption,
                'GHG_Emissions': metrics.carboneFootprint,
                'Waste_Hazardous_Materials': metrics.hazardousWaste,
            };
        }
        else if (framework === 'TCFD') {
            mappings.TCFD = {
                'Scope 1': 0,
                'Scope 2': 0,
                'Climate Risks': 'To be assessed',
            };
        }
    });
    return mappings;
};
exports.mapMetricsToFrameworks = mapMetricsToFrameworks;
/**
 * Calculates materiality assessment for sustainability reporting.
 *
 * @param {Record<string, number>} metrics - All potential metrics
 * @param {Record<string, number>} stakeholderPriority - Stakeholder priorities (0-100)
 * @param {Record<string, number>} businessImpact - Business impact scores (0-100)
 * @returns {object} Materiality matrix and priorities
 *
 * @example
 * ```typescript
 * const materiality = assessMateriality(metrics, priorities, impacts);
 * ```
 */
const assessMateriality = (metrics, stakeholderPriority, businessImpact) => {
    const materialTopics = Object.keys(metrics).map((topic) => {
        const stakeholderScore = stakeholderPriority[topic] || 0;
        const impactScore = businessImpact[topic] || 0;
        const materiality = (stakeholderScore + impactScore) / 2;
        return {
            topic,
            materiality,
            stakeholderConcern: stakeholderScore,
            businessImpact: impactScore,
        };
    });
    const sorted = materialTopics.sort((a, b) => b.materiality - a.materiality);
    const reportingPriority = sorted.map(({ topic, materiality }) => {
        let priority;
        if (materiality >= 80)
            priority = 'critical';
        else if (materiality >= 60)
            priority = 'high';
        else if (materiality >= 40)
            priority = 'medium';
        else
            priority = 'low';
        return { topic, priority };
    });
    return {
        materialTopics: sorted,
        reportingPriority,
    };
};
exports.assessMateriality = assessMateriality;
// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS - 2 FUNCTIONS
// ============================================================================
/**
 * Generates sustainability performance dashboard metrics.
 *
 * @param {CarbonFootprint} carbon - Carbon footprint data
 * @param {EnergyConsumptionMetric} energy - Energy metrics
 * @param {WaterUsageMetric} water - Water metrics
 * @returns {object} Unified sustainability dashboard
 *
 * @example
 * ```typescript
 * const dashboard = generateSustainabilityDashboard(carbon, energy, water);
 * ```
 */
const generateSustainabilityDashboard = (carbon, energy, water) => {
    const renewablePercent = (energy.electricity.renewable / energy.electricity.consumption) * 100;
    const waterBenchmark = 50000;
    const waterEfficiency = Math.min(100, ((waterBenchmark - water.totalWaterUsage) / waterBenchmark) * 100);
    return {
        totalCarbonFootprint: Math.round(carbon.netEmissions),
        renewableEnergyPercent: Math.round(renewablePercent),
        waterEfficiency: Math.max(0, Math.round(waterEfficiency)),
        costSavings: Math.round(energy.electricity.cost * 0.1 + water.cost * 0.15),
        trendDirection: 'improving',
        keyMetrics: {
            carbonIntensity: carbon.intensity,
            energyIntensity: energy.energyIntensity,
            waterIntensity: water.waterIntensity,
            offsetsApplied: carbon.offsetsApplied,
        },
    };
};
exports.generateSustainabilityDashboard = generateSustainabilityDashboard;
/**
 * Exports sustainability data in standard formats for reporting.
 *
 * @param {SustainabilityReport} report - Complete report
 * @param {string} format - Export format ('json' | 'csv' | 'pdf_ready')
 * @returns {string} Formatted report data
 *
 * @example
 * ```typescript
 * const exported = exportSustainabilityReport(report, 'json');
 * ```
 */
const exportSustainabilityReport = (report, format = 'json') => {
    if (format === 'json') {
        return JSON.stringify(report, null, 2);
    }
    else if (format === 'csv') {
        const headers = [
            'Report Type',
            'Year',
            'Carbon Footprint',
            'Energy Consumption',
            'Water Consumption',
            'Waste Generated',
            'Recycling Rate',
        ];
        const values = [
            report.reportType,
            report.reportingYear,
            report.environmentalMetrics.carboneFootprint,
            report.environmentalMetrics.energyConsumption,
            report.environmentalMetrics.waterConsumption,
            report.environmentalMetrics.wasteGenerated,
            report.environmentalMetrics.wasteRecyclingRate,
        ];
        return `${headers.join(',')}\n${values.join(',')}`;
    }
    else {
        // PDF-ready format
        return `
SUSTAINABILITY REPORT ${report.reportingYear}
=====================================
Report Type: ${report.reportType}
Frameworks: ${report.frameworksUsed.join(', ')}

ENVIRONMENTAL METRICS
Carbon Footprint: ${report.environmentalMetrics.carboneFootprint} metric tons CO2e
Energy Consumption: ${report.environmentalMetrics.energyConsumption} kWh
Water Usage: ${report.environmentalMetrics.waterConsumption} gallons
Waste Generated: ${report.environmentalMetrics.wasteGenerated} tons
Recycling Rate: ${report.environmentalMetrics.wasteRecyclingRate}%
    `.trim();
    }
};
exports.exportSustainabilityReport = exportSustainabilityReport;
exports.default = {
    calculateCarbonFootprint: exports.calculateCarbonFootprint,
    convertEnergyToCO2: exports.convertEnergyToCO2,
    recordCarbonOffset: exports.recordCarbonOffset,
    calculateCarbonIntensity: exports.calculateCarbonIntensity,
    projectCarbonEmissions: exports.projectCarbonEmissions,
    createEnergyMetric: exports.createEnergyMetric,
    createWaterMetric: exports.createWaterMetric,
    detectEnergyAnomalies: exports.detectEnergyAnomalies,
    calculateWaterConservationPotential: exports.calculateWaterConservationPotential,
    estimateEnergySavings: exports.estimateEnergySavings,
    recordWasteStream: exports.recordWasteStream,
    calculateWasteDiversion: exports.calculateWasteDiversion,
    createRecyclingProgram: exports.createRecyclingProgram,
    analyzeWasteComposition: exports.analyzeWasteComposition,
    calculateWasteCostAvoidance: exports.calculateWasteCostAvoidance,
    recordGreenCertification: exports.recordGreenCertification,
    assessCertificationReadiness: exports.assessCertificationReadiness,
    calculateCertificationCosts: exports.calculateCertificationCosts,
    compareCertificationStandards: exports.compareCertificationStandards,
    createSustainabilityGoal: exports.createSustainabilityGoal,
    updateGoalProgress: exports.updateGoalProgress,
    evaluateGoalStatus: exports.evaluateGoalStatus,
    calculateRequiredPace: exports.calculateRequiredPace,
    alignWithSDGs: exports.alignWithSDGs,
    recordCompliance: exports.recordCompliance,
    scheduleAudit: exports.scheduleAudit,
    analyzeComplianceRisk: exports.analyzeComplianceRisk,
    updateAuditFindings: exports.updateAuditFindings,
    generateComplianceCalendar: exports.generateComplianceCalendar,
    recordRenewableSystem: exports.recordRenewableSystem,
    calculateRenewableROI: exports.calculateRenewableROI,
    configureGridIntegration: exports.configureGridIntegration,
    projectRenewableGeneration: exports.projectRenewableGeneration,
    optimizeRenewableUtilization: exports.optimizeRenewableUtilization,
    initiateSustainabilityReport: exports.initiateSustainabilityReport,
    calculateESGScore: exports.calculateESGScore,
    generateESGBenchmarkReport: exports.generateESGBenchmarkReport,
    mapMetricsToFrameworks: exports.mapMetricsToFrameworks,
    assessMateriality: exports.assessMateriality,
    generateSustainabilityDashboard: exports.generateSustainabilityDashboard,
    exportSustainabilityReport: exports.exportSustainabilityReport,
};
//# sourceMappingURL=property-sustainability-kit.js.map