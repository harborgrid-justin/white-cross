/**
 * LOC: PROP-EM-001
 * File: /reuse/property/property-energy-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Energy monitoring systems
 *   - Sustainability tracking modules
 */
/**
 * File: /reuse/property/property-energy-management-kit.ts
 * Locator: WC-PROP-EM-001
 * Purpose: Energy Management Kit - Comprehensive energy monitoring, optimization, and cost reduction
 *
 * Upstream: Independent utility module for property energy operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for energy management, optimization, demand response, and analytics
 *
 * LLM Context: Enterprise-grade energy management utilities for property management systems.
 * Provides utility meter tracking, energy usage analytics, demand response, cost optimization,
 * peak load management, benchmarking, HVAC optimization, lighting control, efficiency projects,
 * and utility bill management. Essential for reducing energy costs, improving sustainability,
 * meeting environmental goals, and optimizing building performance.
 */
interface EnergyMeter {
    id: string;
    propertyId: string;
    meterType: MeterType;
    meterNumber: string;
    utilityProvider: string;
    utilityAccountNumber: string;
    location: string;
    installDate: Date;
    lastReadDate?: Date;
    currentReading?: number;
    unit: EnergyUnit;
    multiplier: number;
    isActive: boolean;
    communicationType: 'manual' | 'ami' | 'smart' | 'submeter';
    readingFrequency: ReadingFrequency;
    metadata?: Record<string, unknown>;
}
type MeterType = 'electric' | 'gas' | 'water' | 'steam' | 'chilled_water' | 'solar' | 'wind' | 'battery_storage';
type EnergyUnit = 'kwh' | 'mwh' | 'therm' | 'ccf' | 'mcf' | 'gallon' | 'kbtu' | 'ton_hour';
type ReadingFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
interface MeterReading {
    id: string;
    meterId: string;
    timestamp: Date;
    reading: number;
    consumption?: number;
    cost?: number;
    demand?: number;
    powerFactor?: number;
    readBy?: string;
    readMethod: 'manual' | 'automatic' | 'estimated';
    isValidated: boolean;
    anomalyDetected?: boolean;
    notes?: string;
}
interface EnergyUsage {
    propertyId: string;
    period: DateRange;
    totalConsumption: number;
    totalCost: number;
    byMeterType: Record<MeterType, {
        consumption: number;
        cost: number;
    }>;
    peakDemand?: number;
    peakDemandTime?: Date;
    averageDailyUsage: number;
    weatherNormalized?: number;
    baselineComparison?: {
        change: number;
        percentChange: number;
    };
}
interface DateRange {
    start: Date;
    end: Date;
}
interface EnergyBill {
    id: string;
    propertyId: string;
    meterId: string;
    utilityProvider: string;
    billDate: Date;
    periodStart: Date;
    periodEnd: Date;
    totalAmount: number;
    consumption: number;
    unit: EnergyUnit;
    breakdown: BillBreakdown;
    peakDemand?: number;
    powerFactor?: number;
    dueDate: Date;
    isPaid: boolean;
    paidDate?: Date;
    attachments?: string[];
    tags?: string[];
}
interface BillBreakdown {
    energyCharges: number;
    demandCharges: number;
    deliveryCharges: number;
    taxes: number;
    fees: number;
    credits: number;
    adjustments: number;
}
interface DemandResponseEvent {
    id: string;
    propertyId: string;
    eventType: 'peak_shaving' | 'load_curtailment' | 'grid_support' | 'pricing_response';
    startTime: Date;
    endTime: Date;
    targetReduction: number;
    actualReduction?: number;
    incentiveAmount?: number;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    participatingEquipment: string[];
    strategyUsed?: string[];
}
interface PeakLoadPeriod {
    propertyId: string;
    date: Date;
    peakDemand: number;
    peakTime: Date;
    duration: number;
    costImpact: number;
    contributingLoads: Array<{
        equipment: string;
        contribution: number;
        percentOfPeak: number;
    }>;
}
interface EnergyBenchmark {
    propertyId: string;
    period: DateRange;
    metrics: {
        eui: number;
        costPerSqFt: number;
        emissionsPerSqFt: number;
        waterUsePerSqFt?: number;
    };
    percentile: number;
    score: number;
    comparison: {
        similar_buildings_average: number;
        best_in_class: number;
        improvement_potential: number;
    };
}
interface HVACOptimization {
    propertyId: string;
    zoneId?: string;
    recommendations: Array<{
        type: 'temperature_setpoint' | 'schedule' | 'equipment_upgrade' | 'maintenance' | 'control_strategy';
        description: string;
        estimatedSavings: number;
        estimatedCostSavings: number;
        implementationCost: number;
        paybackPeriod: number;
        priority: 'high' | 'medium' | 'low';
    }>;
    currentSettings: {
        coolingSetpoint: number;
        heatingSetpoint: number;
        schedule: string;
        occupancySensing: boolean;
    };
    optimalSettings: {
        coolingSetpoint: number;
        heatingSetpoint: number;
        schedule: string;
        occupancySensing: boolean;
    };
}
interface LightingControl {
    id: string;
    propertyId: string;
    zoneId: string;
    zoneName: string;
    controlType: 'manual' | 'scheduled' | 'occupancy' | 'daylight' | 'smart';
    status: 'on' | 'off' | 'dimmed' | 'auto';
    brightness?: number;
    occupancyDetected?: boolean;
    schedule?: {
        onTime: string;
        offTime: string;
        daysActive: number[];
    };
    energyUsage: number;
    connectedFixtures: number;
    lastUpdate: Date;
}
interface EnergyEfficiencyProject {
    id: string;
    propertyId: string;
    name: string;
    category: ProjectCategory;
    description: string;
    status: ProjectStatus;
    proposedDate: Date;
    approvalDate?: Date;
    completionDate?: Date;
    estimatedCost: number;
    actualCost?: number;
    estimatedAnnualSavings: number;
    estimatedCostSavings: number;
    actualAnnualSavings?: number;
    paybackPeriod: number;
    roi: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    incentivesAvailable?: Array<{
        program: string;
        amount: number;
        status: 'applied' | 'approved' | 'received';
    }>;
    measurementPlan?: string;
}
type ProjectCategory = 'lighting_retrofit' | 'hvac_upgrade' | 'insulation' | 'windows' | 'renewable_energy' | 'building_controls' | 'water_efficiency' | 'equipment_replacement' | 'behavioral_program';
type ProjectStatus = 'proposed' | 'under_review' | 'approved' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
interface EnergyAlert {
    id: string;
    propertyId: string;
    type: AlertType;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    detectedAt: Date;
    resolvedAt?: Date;
    value: number;
    threshold: number;
    affectedMeters?: string[];
    recommendations?: string[];
}
type AlertType = 'high_consumption' | 'unusual_pattern' | 'meter_failure' | 'cost_spike' | 'demand_peak' | 'efficiency_drop' | 'billing_anomaly';
interface WeatherData {
    date: Date;
    avgTemperature: number;
    heatingDegreeDays: number;
    coolingDegreeDays: number;
    humidity?: number;
    conditions?: string;
}
interface CostOptimization {
    propertyId: string;
    currentRate: {
        structure: 'flat' | 'tiered' | 'time_of_use' | 'demand';
        averageRate: number;
        demandCharge?: number;
    };
    recommendations: Array<{
        strategy: string;
        description: string;
        estimatedSavings: number;
        implementationComplexity: 'low' | 'medium' | 'high';
        requiresUtilityApproval: boolean;
    }>;
    alternativeRates?: Array<{
        name: string;
        estimatedCost: number;
        savings: number;
    }>;
}
/**
 * Registers a new utility meter for a property.
 *
 * @param {Partial<EnergyMeter>} meterData - Meter registration data
 * @returns {EnergyMeter} Registered meter
 *
 * @example
 * ```typescript
 * const meter = registerUtilityMeter({
 *   propertyId: 'PROP-001',
 *   meterType: 'electric',
 *   meterNumber: 'E123456789',
 *   utilityProvider: 'City Electric',
 *   utilityAccountNumber: 'ACC-999888',
 *   location: 'Main Building - Utility Room',
 *   unit: 'kwh',
 *   communicationType: 'ami',
 *   readingFrequency: 'hourly'
 * });
 * ```
 */
export declare const registerUtilityMeter: (meterData: Partial<EnergyMeter>) => EnergyMeter;
/**
 * Records a meter reading with automatic consumption calculation.
 *
 * @param {string} meterId - Meter ID
 * @param {number} reading - Meter reading value
 * @param {Date} timestamp - Reading timestamp
 * @param {MeterReading | undefined} previousReading - Previous reading for consumption calc
 * @param {string} readMethod - Reading method
 * @returns {MeterReading} Meter reading record
 *
 * @example
 * ```typescript
 * const reading = recordMeterReading(
 *   'METER-123',
 *   45678.5,
 *   new Date(),
 *   previousReading,
 *   'automatic'
 * );
 * // Returns: Reading with calculated consumption
 * ```
 */
export declare const recordMeterReading: (meterId: string, reading: number, timestamp: Date, previousReading?: MeterReading, readMethod?: "manual" | "automatic" | "estimated") => MeterReading;
/**
 * Validates meter reading for anomalies and errors.
 *
 * @param {MeterReading} reading - Reading to validate
 * @param {MeterReading[]} historicalReadings - Historical readings for comparison
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateMeterReading(newReading, historicalData);
 * if (!validation.isValid) {
 *   console.log('Anomalies:', validation.anomalies);
 * }
 * ```
 */
export declare const validateMeterReading: (reading: MeterReading, historicalReadings: MeterReading[]) => {
    isValid: boolean;
    anomalies: string[];
    confidence: number;
};
/**
 * Imports bulk meter readings from external systems.
 *
 * @param {Array<{meterId: string, reading: number, timestamp: Date}>} readings - Bulk readings
 * @returns {Promise<{imported: number, failed: number, errors: string[]}>} Import results
 *
 * @example
 * ```typescript
 * const result = await importBulkMeterReadings(csvReadings);
 * console.log(`Imported ${result.imported} readings, ${result.failed} failed`);
 * ```
 */
export declare const importBulkMeterReadings: (readings: Array<{
    meterId: string;
    reading: number;
    timestamp: Date;
}>) => Promise<{
    imported: number;
    failed: number;
    errors: string[];
}>;
/**
 * Gets meter readings for a specific time period.
 *
 * @param {string} meterId - Meter ID
 * @param {DateRange} period - Time period
 * @param {MeterReading[]} allReadings - All available readings
 * @returns {MeterReading[]} Filtered readings
 *
 * @example
 * ```typescript
 * const readings = getMeterReadingsByPeriod(
 *   'METER-123',
 *   { start: new Date('2025-11-01'), end: new Date('2025-11-30') },
 *   allReadings
 * );
 * ```
 */
export declare const getMeterReadingsByPeriod: (meterId: string, period: DateRange, allReadings: MeterReading[]) => MeterReading[];
/**
 * Calculates total energy usage for a property over a period.
 *
 * @param {string} propertyId - Property ID
 * @param {DateRange} period - Analysis period
 * @param {MeterReading[]} readings - Meter readings
 * @param {EnergyMeter[]} meters - Meters
 * @returns {EnergyUsage} Energy usage summary
 *
 * @example
 * ```typescript
 * const usage = calculateEnergyUsage(
 *   'PROP-001',
 *   { start: new Date('2025-11-01'), end: new Date('2025-11-30') },
 *   readings,
 *   meters
 * );
 * console.log(`Total consumption: ${usage.totalConsumption} kWh`);
 * ```
 */
export declare const calculateEnergyUsage: (propertyId: string, period: DateRange, readings: MeterReading[], meters: EnergyMeter[]) => EnergyUsage;
/**
 * Analyzes energy consumption patterns and identifies trends.
 *
 * @param {MeterReading[]} readings - Historical readings
 * @param {string} interval - Analysis interval
 * @returns {object} Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = analyzeConsumptionPatterns(readings, 'daily');
 * console.log('Peak usage hour:', patterns.peakHour);
 * ```
 */
export declare const analyzeConsumptionPatterns: (readings: MeterReading[], interval: "hourly" | "daily" | "weekly" | "monthly") => {
    trend: "increasing" | "decreasing" | "stable";
    peakPeriod?: string;
    averageConsumption: number;
    variability: number;
};
/**
 * Performs weather normalization on energy consumption data.
 *
 * @param {number} consumption - Actual consumption
 * @param {WeatherData} actualWeather - Actual weather data
 * @param {WeatherData} normalWeather - Normal weather data
 * @returns {number} Weather-normalized consumption
 *
 * @example
 * ```typescript
 * const normalized = normalizeEnergyConsumption(
 *   15000,
 *   { date: new Date(), avgTemperature: 85, heatingDegreeDays: 0, coolingDegreeDays: 20 },
 *   { date: new Date(), avgTemperature: 75, heatingDegreeDays: 0, coolingDegreeDays: 10 }
 * );
 * ```
 */
export declare const normalizeEnergyConsumption: (consumption: number, actualWeather: WeatherData, normalWeather: WeatherData) => number;
/**
 * Compares energy usage to baseline period.
 *
 * @param {EnergyUsage} current - Current period usage
 * @param {EnergyUsage} baseline - Baseline period usage
 * @returns {object} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = compareToBaseline(currentUsage, baselineUsage);
 * console.log(`Usage changed by ${comparison.percentChange}%`);
 * ```
 */
export declare const compareToBaseline: (current: EnergyUsage, baseline: EnergyUsage) => {
    absoluteChange: number;
    percentChange: number;
    costChange: number;
    costPercentChange: number;
    status: "improved" | "declined" | "stable";
};
/**
 * Generates comprehensive energy analytics report.
 *
 * @param {string} propertyId - Property ID
 * @param {DateRange} period - Reporting period
 * @param {MeterReading[]} readings - Meter readings
 * @param {EnergyMeter[]} meters - Meters
 * @returns {object} Analytics report
 *
 * @example
 * ```typescript
 * const report = generateEnergyAnalytics(
 *   'PROP-001',
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-30') },
 *   readings,
 *   meters
 * );
 * ```
 */
export declare const generateEnergyAnalytics: (propertyId: string, period: DateRange, readings: MeterReading[], meters: EnergyMeter[]) => object;
/**
 * Creates a demand response event.
 *
 * @param {Partial<DemandResponseEvent>} eventData - Event data
 * @returns {DemandResponseEvent} Created event
 *
 * @example
 * ```typescript
 * const event = createDemandResponseEvent({
 *   propertyId: 'PROP-001',
 *   eventType: 'peak_shaving',
 *   startTime: new Date('2025-11-08T14:00:00'),
 *   endTime: new Date('2025-11-08T18:00:00'),
 *   targetReduction: 250,
 *   participatingEquipment: ['HVAC-1', 'HVAC-2', 'Lighting-Zone-A']
 * });
 * ```
 */
export declare const createDemandResponseEvent: (eventData: Partial<DemandResponseEvent>) => DemandResponseEvent;
/**
 * Calculates demand response performance.
 *
 * @param {DemandResponseEvent} event - Demand response event
 * @param {number} baselineLoad - Baseline load (kW)
 * @param {number} actualLoad - Actual load during event (kW)
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = calculateDemandResponsePerformance(event, 500, 275);
 * console.log(`Achieved ${performance.reductionPercent}% reduction`);
 * ```
 */
export declare const calculateDemandResponsePerformance: (event: DemandResponseEvent, baselineLoad: number, actualLoad: number) => {
    actualReduction: number;
    targetReduction: number;
    reductionPercent: number;
    targetAchievement: number;
    status: "exceeded" | "met" | "partial" | "failed";
};
/**
 * Identifies optimal equipment for demand response.
 *
 * @param {string} propertyId - Property ID
 * @param {number} targetReduction - Target reduction (kW)
 * @param {Array<{id: string, type: string, load: number, priority: number}>} equipment - Available equipment
 * @returns {string[]} Selected equipment IDs
 *
 * @example
 * ```typescript
 * const equipment = selectDemandResponseEquipment('PROP-001', 200, availableEquipment);
 * console.log('Participating equipment:', equipment);
 * ```
 */
export declare const selectDemandResponseEquipment: (propertyId: string, targetReduction: number, equipment: Array<{
    id: string;
    type: string;
    load: number;
    priority: number;
}>) => string[];
/**
 * Schedules automated demand response actions.
 *
 * @param {DemandResponseEvent} event - DR event
 * @param {object} automationConfig - Automation configuration
 * @returns {object} Scheduled actions
 *
 * @example
 * ```typescript
 * const actions = scheduleAutomatedDemandResponse(event, {
 *   preConditioningMinutes: 30,
 *   curtailmentStrategy: 'gradual',
 *   recoveryStrategy: 'staggered'
 * });
 * ```
 */
export declare const scheduleAutomatedDemandResponse: (event: DemandResponseEvent, automationConfig: {
    preConditioningMinutes?: number;
    curtailmentStrategy?: "immediate" | "gradual";
    recoveryStrategy?: "immediate" | "staggered";
}) => object;
/**
 * Analyzes utility rate structure and identifies optimization opportunities.
 *
 * @param {string} propertyId - Property ID
 * @param {object} currentRate - Current rate structure
 * @param {MeterReading[]} readings - Historical readings
 * @returns {CostOptimization} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = analyzeRateStructure('PROP-001', {
 *   structure: 'time_of_use',
 *   averageRate: 0.12,
 *   demandCharge: 15.50
 * }, readings);
 * ```
 */
export declare const analyzeRateStructure: (propertyId: string, currentRate: {
    structure: "flat" | "tiered" | "time_of_use" | "demand";
    averageRate: number;
    demandCharge?: number;
}, readings: MeterReading[]) => CostOptimization;
/**
 * Calculates optimal load shifting schedule.
 *
 * @param {MeterReading[]} readings - Historical readings
 * @param {object} rateSchedule - Time-of-use rate schedule
 * @returns {object} Load shifting recommendations
 *
 * @example
 * ```typescript
 * const schedule = calculateLoadShifting(readings, {
 *   peak: { hours: [14, 15, 16, 17, 18], rate: 0.25 },
 *   offPeak: { hours: [0, 1, 2, 3, 4, 5, 22, 23], rate: 0.08 }
 * });
 * ```
 */
export declare const calculateLoadShifting: (readings: MeterReading[], rateSchedule: {
    peak: {
        hours: number[];
        rate: number;
    };
    offPeak: {
        hours: number[];
        rate: number;
    };
}) => {
    shiftableLoad: number;
    potentialSavings: number;
    recommendedShifts: Array<{
        from: string;
        to: string;
        load: number;
        savings: number;
    }>;
};
/**
 * Evaluates energy procurement options.
 *
 * @param {number} annualConsumption - Annual consumption (kWh)
 * @param {number} currentRate - Current rate ($/kWh)
 * @param {Array<{provider: string, rate: number, term: number}>} alternatives - Alternative providers
 * @returns {object} Procurement analysis
 *
 * @example
 * ```typescript
 * const analysis = evaluateEnergyProcurement(1000000, 0.12, [
 *   { provider: 'Green Energy Co', rate: 0.11, term: 36 },
 *   { provider: 'Budget Power', rate: 0.105, term: 24 }
 * ]);
 * ```
 */
export declare const evaluateEnergyProcurement: (annualConsumption: number, currentRate: number, alternatives: Array<{
    provider: string;
    rate: number;
    term: number;
}>) => {
    currentAnnualCost: number;
    alternatives: Array<{
        provider: string;
        rate: number;
        term: number;
        annualCost: number;
        savings: number;
        savingsPercent: number;
    }>;
    bestOption: string | null;
};
/**
 * Calculates power factor correction savings.
 *
 * @param {number} currentPowerFactor - Current power factor (0-1)
 * @param {number} targetPowerFactor - Target power factor (0-1)
 * @param {number} averageDemand - Average demand (kW)
 * @param {number} penaltyRate - Penalty rate for low power factor ($/kVAR)
 * @returns {object} Correction analysis
 *
 * @example
 * ```typescript
 * const correction = calculatePowerFactorCorrection(0.75, 0.95, 500, 2.50);
 * console.log(`Annual savings: $${correction.annualSavings}`);
 * ```
 */
export declare const calculatePowerFactorCorrection: (currentPowerFactor: number, targetPowerFactor: number, averageDemand: number, penaltyRate: number) => {
    currentReactivePower: number;
    targetReactivePower: number;
    reductionNeeded: number;
    monthlySavings: number;
    annualSavings: number;
};
/**
 * Identifies peak load periods for a property.
 *
 * @param {string} propertyId - Property ID
 * @param {MeterReading[]} readings - Meter readings with demand data
 * @param {number} threshold - Peak threshold (kW)
 * @returns {PeakLoadPeriod[]} Peak load periods
 *
 * @example
 * ```typescript
 * const peaks = identifyPeakLoadPeriods('PROP-001', readings, 500);
 * console.log(`Found ${peaks.length} peak periods`);
 * ```
 */
export declare const identifyPeakLoadPeriods: (propertyId: string, readings: MeterReading[], threshold: number) => PeakLoadPeriod[];
/**
 * Analyzes peak load contributing factors.
 *
 * @param {PeakLoadPeriod} peak - Peak load period
 * @param {MeterReading[]} submeterReadings - Submeter readings
 * @returns {Array<{equipment: string, contribution: number, percent: number}>} Contributing loads
 *
 * @example
 * ```typescript
 * const contributors = analyzePeakContributors(peakPeriod, submeterReadings);
 * console.log('Top contributor:', contributors[0].equipment);
 * ```
 */
export declare const analyzePeakContributors: (peak: PeakLoadPeriod, submeterReadings: MeterReading[]) => Array<{
    equipment: string;
    contribution: number;
    percent: number;
}>;
/**
 * Generates peak shaving recommendations.
 *
 * @param {PeakLoadPeriod[]} peaks - Historical peak periods
 * @param {number} targetReduction - Target reduction (kW)
 * @returns {object} Peak shaving strategy
 *
 * @example
 * ```typescript
 * const strategy = generatePeakShavingStrategy(historicalPeaks, 100);
 * console.log('Recommended actions:', strategy.actions);
 * ```
 */
export declare const generatePeakShavingStrategy: (peaks: PeakLoadPeriod[], targetReduction: number) => {
    targetReduction: number;
    estimatedSavings: number;
    actions: Array<{
        action: string;
        expectedReduction: number;
        implementationCost: "low" | "medium" | "high";
    }>;
};
/**
 * Monitors real-time demand and triggers alerts.
 *
 * @param {number} currentDemand - Current demand (kW)
 * @param {number} peakThreshold - Peak threshold (kW)
 * @param {number} warningThreshold - Warning threshold (kW)
 * @returns {EnergyAlert | null} Alert if threshold exceeded
 *
 * @example
 * ```typescript
 * const alert = monitorPeakDemand(525, 500, 450);
 * if (alert) {
 *   console.log('ALERT:', alert.message);
 * }
 * ```
 */
export declare const monitorPeakDemand: (currentDemand: number, peakThreshold: number, warningThreshold: number) => EnergyAlert | null;
/**
 * Calculates Energy Use Intensity (EUI) for benchmarking.
 *
 * @param {number} annualEnergyUse - Annual energy use (kBTU)
 * @param {number} buildingArea - Building area (sq ft)
 * @returns {number} EUI (kBTU/sq ft/year)
 *
 * @example
 * ```typescript
 * const eui = calculateEUI(15000000, 250000);
 * console.log(`EUI: ${eui} kBTU/sq ft/year`);
 * ```
 */
export declare const calculateEUI: (annualEnergyUse: number, buildingArea: number) => number;
/**
 * Generates comprehensive energy benchmark report.
 *
 * @param {string} propertyId - Property ID
 * @param {EnergyUsage} usage - Energy usage data
 * @param {number} buildingArea - Building area (sq ft)
 * @param {string} buildingType - Building type
 * @returns {EnergyBenchmark} Benchmark report
 *
 * @example
 * ```typescript
 * const benchmark = generateEnergyBenchmark(
 *   'PROP-001',
 *   annualUsage,
 *   250000,
 *   'office'
 * );
 * console.log(`Energy Star Score: ${benchmark.score}`);
 * ```
 */
export declare const generateEnergyBenchmark: (propertyId: string, usage: EnergyUsage, buildingArea: number, buildingType: string) => EnergyBenchmark;
/**
 * Compares property performance to portfolio average.
 *
 * @param {EnergyBenchmark} propertyBenchmark - Property benchmark
 * @param {EnergyBenchmark[]} portfolioBenchmarks - Portfolio benchmarks
 * @returns {object} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = compareToPortfolio(propertyBenchmark, portfolioBenchmarks);
 * console.log(`Property ranks ${comparison.rank} out of ${comparison.total}`);
 * ```
 */
export declare const compareToPortfolio: (propertyBenchmark: EnergyBenchmark, portfolioBenchmarks: EnergyBenchmark[]) => {
    portfolioAvgEUI: number;
    propertyEUI: number;
    percentDifference: number;
    rank: number;
    total: number;
    status: "top_performer" | "above_average" | "below_average" | "needs_improvement";
};
/**
 * Tracks benchmark progress over time.
 *
 * @param {EnergyBenchmark[]} historicalBenchmarks - Historical benchmarks (chronological)
 * @returns {object} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = trackBenchmarkProgress(historicalBenchmarks);
 * console.log(`EUI trend: ${progress.euiTrend}`);
 * ```
 */
export declare const trackBenchmarkProgress: (historicalBenchmarks: EnergyBenchmark[]) => {
    euiTrend: "improving" | "stable" | "declining";
    scoreTrend: "improving" | "stable" | "declining";
    improvements: Array<{
        period: string;
        euiChange: number;
        scoreChange: number;
    }>;
};
/**
 * Analyzes HVAC performance and generates optimization recommendations.
 *
 * @param {string} propertyId - Property ID
 * @param {object} currentSettings - Current HVAC settings
 * @param {MeterReading[]} energyData - Energy consumption data
 * @param {WeatherData[]} weatherData - Weather data
 * @returns {HVACOptimization} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = analyzeHVACPerformance('PROP-001', {
 *   coolingSetpoint: 72,
 *   heatingSetpoint: 68,
 *   schedule: '24/7',
 *   occupancySensing: false
 * }, energyData, weatherData);
 * ```
 */
export declare const analyzeHVACPerformance: (propertyId: string, currentSettings: {
    coolingSetpoint: number;
    heatingSetpoint: number;
    schedule: string;
    occupancySensing: boolean;
}, energyData: MeterReading[], weatherData: WeatherData[]) => HVACOptimization;
/**
 * Calculates optimal HVAC setpoints based on occupancy and weather.
 *
 * @param {boolean} isOccupied - Is space occupied
 * @param {number} outsideTemp - Outside temperature (F)
 * @param {string} season - Season
 * @returns {object} Optimal setpoints
 *
 * @example
 * ```typescript
 * const setpoints = calculateOptimalSetpoints(true, 85, 'summer');
 * console.log(`Cooling setpoint: ${setpoints.cooling}°F`);
 * ```
 */
export declare const calculateOptimalSetpoints: (isOccupied: boolean, outsideTemp: number, season: "summer" | "winter" | "spring" | "fall") => {
    cooling: number;
    heating: number;
    reason: string;
};
/**
 * Estimates HVAC equipment efficiency and replacement ROI.
 *
 * @param {object} currentEquipment - Current equipment specs
 * @param {object} proposedEquipment - Proposed equipment specs
 * @param {number} annualRuntime - Annual runtime (hours)
 * @param {number} energyRate - Energy rate ($/kWh)
 * @returns {object} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = estimateHVACUpgradeROI(
 *   { type: 'chiller', capacity: 500, efficiency: 0.65 },
 *   { type: 'chiller', capacity: 500, efficiency: 0.52 },
 *   4000,
 *   0.12
 * );
 * ```
 */
export declare const estimateHVACUpgradeROI: (currentEquipment: {
    type: string;
    capacity: number;
    efficiency: number;
}, proposedEquipment: {
    type: string;
    capacity: number;
    efficiency: number;
    cost: number;
}, annualRuntime: number, energyRate: number) => {
    currentAnnualCost: number;
    proposedAnnualCost: number;
    annualSavings: number;
    equipmentCost: number;
    simplePayback: number;
    roi: number;
};
/**
 * Creates a lighting control zone.
 *
 * @param {Partial<LightingControl>} controlData - Control zone data
 * @returns {LightingControl} Created control zone
 *
 * @example
 * ```typescript
 * const zone = createLightingZone({
 *   propertyId: 'PROP-001',
 *   zoneId: 'ZONE-A',
 *   zoneName: 'Open Office Area',
 *   controlType: 'occupancy',
 *   connectedFixtures: 48
 * });
 * ```
 */
export declare const createLightingZone: (controlData: Partial<LightingControl>) => LightingControl;
/**
 * Calculates lighting energy savings from controls.
 *
 * @param {number} baselineUsage - Baseline usage without controls (kWh/year)
 * @param {string} controlType - Type of controls implemented
 * @returns {object} Savings calculation
 *
 * @example
 * ```typescript
 * const savings = calculateLightingSavings(50000, 'occupancy');
 * console.log(`Annual savings: ${savings.annualSavings} kWh`);
 * ```
 */
export declare const calculateLightingSavings: (baselineUsage: number, controlType: "manual" | "scheduled" | "occupancy" | "daylight" | "smart") => {
    annualSavings: number;
    savingsPercent: number;
    costSavings: number;
};
/**
 * Optimizes lighting schedule based on occupancy patterns.
 *
 * @param {Array<{hour: number, occupancy: number}>} occupancyData - Hourly occupancy data (0-100%)
 * @returns {object} Optimized schedule
 *
 * @example
 * ```typescript
 * const schedule = optimizeLightingSchedule(historicalOccupancy);
 * console.log('Lights on:', schedule.onTime);
 * ```
 */
export declare const optimizeLightingSchedule: (occupancyData: Array<{
    hour: number;
    occupancy: number;
}>) => {
    onTime: string;
    offTime: string;
    daysActive: number[];
    estimatedSavings: number;
};
/**
 * Analyzes daylight harvesting opportunities.
 *
 * @param {string} zoneId - Zone ID
 * @param {number} windowArea - Window area (sq ft)
 * @param {string} orientation - Window orientation
 * @param {number} baselineLightingLoad - Baseline lighting load (W)
 * @returns {object} Daylight harvesting analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeDaylightHarvesting('ZONE-A', 500, 'south', 5000);
 * console.log(`Potential savings: ${analysis.potentialSavings}%`);
 * ```
 */
export declare const analyzeDaylightHarvesting: (zoneId: string, windowArea: number, orientation: "north" | "south" | "east" | "west", baselineLightingLoad: number) => {
    zoneId: string;
    potentialSavings: number;
    recommendedSensors: number;
    estimatedCost: number;
    paybackPeriod: number;
};
/**
 * Creates an energy efficiency project proposal.
 *
 * @param {Partial<EnergyEfficiencyProject>} projectData - Project data
 * @returns {EnergyEfficiencyProject} Created project
 *
 * @example
 * ```typescript
 * const project = createEfficiencyProject({
 *   propertyId: 'PROP-001',
 *   name: 'LED Lighting Retrofit',
 *   category: 'lighting_retrofit',
 *   estimatedCost: 75000,
 *   estimatedAnnualSavings: 125000,
 *   estimatedCostSavings: 15000
 * });
 * ```
 */
export declare const createEfficiencyProject: (projectData: Partial<EnergyEfficiencyProject>) => EnergyEfficiencyProject;
/**
 * Prioritizes energy efficiency projects by ROI and impact.
 *
 * @param {EnergyEfficiencyProject[]} projects - Array of projects
 * @returns {EnergyEfficiencyProject[]} Prioritized projects
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeEfficiencyProjects(allProjects);
 * console.log('Top project:', prioritized[0].name);
 * ```
 */
export declare const prioritizeEfficiencyProjects: (projects: EnergyEfficiencyProject[]) => EnergyEfficiencyProject[];
/**
 * Tracks energy efficiency project performance.
 *
 * @param {EnergyEfficiencyProject} project - Project
 * @param {number} actualAnnualSavings - Measured annual savings (kWh)
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = trackProjectPerformance(project, 130000);
 * console.log(`Achieved ${performance.savingsAchievement}% of target`);
 * ```
 */
export declare const trackProjectPerformance: (project: EnergyEfficiencyProject, actualAnnualSavings: number) => {
    estimatedSavings: number;
    actualSavings: number;
    savingsAchievement: number;
    estimatedPayback: number;
    actualPayback: number;
    status: "exceeding" | "on_target" | "underperforming";
};
/**
 * Identifies available utility rebates and incentives.
 *
 * @param {ProjectCategory} category - Project category
 * @param {number} projectCost - Project cost
 * @param {string} utilityProvider - Utility provider
 * @returns {Array<object>} Available incentives
 *
 * @example
 * ```typescript
 * const incentives = identifyUtilityIncentives('lighting_retrofit', 75000, 'City Electric');
 * console.log(`Total incentives: $${incentives.reduce((sum, i) => sum + i.amount, 0)}`);
 * ```
 */
export declare const identifyUtilityIncentives: (category: ProjectCategory, projectCost: number, utilityProvider: string) => Array<{
    program: string;
    amount: number;
    description: string;
    eligibility: string;
}>;
/**
 * Records a utility bill.
 *
 * @param {Partial<EnergyBill>} billData - Bill data
 * @returns {EnergyBill} Created bill record
 *
 * @example
 * ```typescript
 * const bill = recordUtilityBill({
 *   propertyId: 'PROP-001',
 *   meterId: 'METER-123',
 *   utilityProvider: 'City Electric',
 *   billDate: new Date('2025-11-01'),
 *   periodStart: new Date('2025-10-01'),
 *   periodEnd: new Date('2025-10-31'),
 *   totalAmount: 4567.89,
 *   consumption: 38000,
 *   unit: 'kwh'
 * });
 * ```
 */
export declare const recordUtilityBill: (billData: Partial<EnergyBill>) => EnergyBill;
/**
 * Validates utility bill for errors and anomalies.
 *
 * @param {EnergyBill} bill - Bill to validate
 * @param {EnergyBill[]} historicalBills - Historical bills for comparison
 * @returns {object} Validation results
 *
 * @example
 * ```typescript
 * const validation = validateUtilityBill(newBill, historicalBills);
 * if (!validation.isValid) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare const validateUtilityBill: (bill: EnergyBill, historicalBills: EnergyBill[]) => {
    isValid: boolean;
    issues: string[];
    warnings: string[];
    confidence: number;
};
/**
 * Analyzes utility bill trends and cost drivers.
 *
 * @param {EnergyBill[]} bills - Historical bills (chronological)
 * @returns {object} Bill analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeUtilityBillTrends(historicalBills);
 * console.log('Cost trend:', analysis.costTrend);
 * ```
 */
export declare const analyzeUtilityBillTrends: (bills: EnergyBill[]) => {
    costTrend: "increasing" | "decreasing" | "stable";
    consumptionTrend: "increasing" | "decreasing" | "stable";
    avgMonthlyConsumption: number;
    avgMonthlyCost: number;
    primaryCostDriver: string;
};
/**
 * Generates utility cost forecast.
 *
 * @param {EnergyBill[]} historicalBills - Historical bills
 * @param {number} forecastMonths - Months to forecast
 * @returns {Array<{month: string, estimatedConsumption: number, estimatedCost: number}>} Forecast
 *
 * @example
 * ```typescript
 * const forecast = forecastUtilityCosts(historicalBills, 12);
 * console.log('Next month estimate:', forecast[0].estimatedCost);
 * ```
 */
export declare const forecastUtilityCosts: (historicalBills: EnergyBill[], forecastMonths: number) => Array<{
    month: string;
    estimatedConsumption: number;
    estimatedCost: number;
}>;
export {};
//# sourceMappingURL=property-energy-management-kit.d.ts.map