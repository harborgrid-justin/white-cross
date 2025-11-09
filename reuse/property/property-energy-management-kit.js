"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.forecastUtilityCosts = exports.analyzeUtilityBillTrends = exports.validateUtilityBill = exports.recordUtilityBill = exports.identifyUtilityIncentives = exports.trackProjectPerformance = exports.prioritizeEfficiencyProjects = exports.createEfficiencyProject = exports.analyzeDaylightHarvesting = exports.optimizeLightingSchedule = exports.calculateLightingSavings = exports.createLightingZone = exports.estimateHVACUpgradeROI = exports.calculateOptimalSetpoints = exports.analyzeHVACPerformance = exports.trackBenchmarkProgress = exports.compareToPortfolio = exports.generateEnergyBenchmark = exports.calculateEUI = exports.monitorPeakDemand = exports.generatePeakShavingStrategy = exports.analyzePeakContributors = exports.identifyPeakLoadPeriods = exports.calculatePowerFactorCorrection = exports.evaluateEnergyProcurement = exports.calculateLoadShifting = exports.analyzeRateStructure = exports.scheduleAutomatedDemandResponse = exports.selectDemandResponseEquipment = exports.calculateDemandResponsePerformance = exports.createDemandResponseEvent = exports.generateEnergyAnalytics = exports.compareToBaseline = exports.normalizeEnergyConsumption = exports.analyzeConsumptionPatterns = exports.calculateEnergyUsage = exports.getMeterReadingsByPeriod = exports.importBulkMeterReadings = exports.validateMeterReading = exports.recordMeterReading = exports.registerUtilityMeter = void 0;
// ============================================================================
// UTILITY METER DATA COLLECTION
// ============================================================================
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
const registerUtilityMeter = (meterData) => {
    return {
        id: meterData.id || `METER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: meterData.propertyId,
        meterType: meterData.meterType,
        meterNumber: meterData.meterNumber,
        utilityProvider: meterData.utilityProvider,
        utilityAccountNumber: meterData.utilityAccountNumber,
        location: meterData.location || 'Unknown',
        installDate: meterData.installDate || new Date(),
        lastReadDate: meterData.lastReadDate,
        currentReading: meterData.currentReading,
        unit: meterData.unit || 'kwh',
        multiplier: meterData.multiplier || 1,
        isActive: meterData.isActive !== false,
        communicationType: meterData.communicationType || 'manual',
        readingFrequency: meterData.readingFrequency || 'monthly',
        metadata: meterData.metadata || {},
    };
};
exports.registerUtilityMeter = registerUtilityMeter;
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
const recordMeterReading = (meterId, reading, timestamp, previousReading, readMethod = 'manual') => {
    let consumption;
    if (previousReading) {
        consumption = reading - previousReading.reading;
        // Handle meter rollover (e.g., 99999 -> 00000)
        if (consumption < 0) {
            consumption = (100000 - previousReading.reading) + reading;
        }
    }
    return {
        id: `READ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        meterId,
        timestamp,
        reading,
        consumption,
        readBy: undefined,
        readMethod,
        isValidated: readMethod === 'automatic',
        anomalyDetected: false,
    };
};
exports.recordMeterReading = recordMeterReading;
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
const validateMeterReading = (reading, historicalReadings) => {
    const anomalies = [];
    // Check for negative consumption
    if (reading.consumption !== undefined && reading.consumption < 0) {
        anomalies.push('Negative consumption detected');
    }
    // Check for unusually high consumption
    if (historicalReadings.length >= 3 && reading.consumption !== undefined) {
        const avgConsumption = historicalReadings
            .filter(r => r.consumption !== undefined)
            .slice(-30) // Last 30 readings
            .reduce((sum, r) => sum + r.consumption, 0) / historicalReadings.length;
        const stdDev = Math.sqrt(historicalReadings
            .filter(r => r.consumption !== undefined)
            .slice(-30)
            .reduce((sum, r) => sum + Math.pow(r.consumption - avgConsumption, 2), 0) /
            historicalReadings.length);
        // Flag if more than 3 standard deviations from mean
        if (Math.abs(reading.consumption - avgConsumption) > 3 * stdDev) {
            anomalies.push('Consumption significantly deviates from historical pattern');
        }
    }
    // Check for zero or very low consumption (possible meter failure)
    if (reading.consumption !== undefined && reading.consumption < 0.01) {
        anomalies.push('Zero or near-zero consumption detected');
    }
    const confidence = anomalies.length === 0 ? 100 : Math.max(0, 100 - anomalies.length * 25);
    return {
        isValid: anomalies.length === 0,
        anomalies,
        confidence,
    };
};
exports.validateMeterReading = validateMeterReading;
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
const importBulkMeterReadings = async (readings) => {
    let imported = 0;
    let failed = 0;
    const errors = [];
    for (const reading of readings) {
        try {
            // Validate reading data
            if (!reading.meterId || reading.reading === undefined || !reading.timestamp) {
                throw new Error('Invalid reading data');
            }
            // In production, this would save to database
            imported++;
        }
        catch (error) {
            failed++;
            errors.push(`Failed to import reading for meter ${reading.meterId}: ${error}`);
        }
    }
    return { imported, failed, errors };
};
exports.importBulkMeterReadings = importBulkMeterReadings;
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
const getMeterReadingsByPeriod = (meterId, period, allReadings) => {
    return allReadings.filter(r => r.meterId === meterId &&
        r.timestamp >= period.start &&
        r.timestamp <= period.end);
};
exports.getMeterReadingsByPeriod = getMeterReadingsByPeriod;
// ============================================================================
// ENERGY USAGE ANALYTICS
// ============================================================================
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
const calculateEnergyUsage = (propertyId, period, readings, meters) => {
    const propertyMeters = meters.filter(m => m.propertyId === propertyId);
    let totalConsumption = 0;
    let totalCost = 0;
    const byMeterType = {};
    for (const meter of propertyMeters) {
        const meterReadings = readings.filter(r => r.meterId === meter.id &&
            r.timestamp >= period.start &&
            r.timestamp <= period.end &&
            r.consumption !== undefined);
        const consumption = meterReadings.reduce((sum, r) => sum + (r.consumption || 0), 0);
        const cost = meterReadings.reduce((sum, r) => sum + (r.cost || 0), 0);
        totalConsumption += consumption;
        totalCost += cost;
        if (!byMeterType[meter.meterType]) {
            byMeterType[meter.meterType] = { consumption: 0, cost: 0 };
        }
        byMeterType[meter.meterType].consumption += consumption;
        byMeterType[meter.meterType].cost += cost;
    }
    const days = Math.ceil((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24));
    const averageDailyUsage = days > 0 ? totalConsumption / days : 0;
    return {
        propertyId,
        period,
        totalConsumption: Math.round(totalConsumption * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        byMeterType: byMeterType,
        averageDailyUsage: Math.round(averageDailyUsage * 100) / 100,
    };
};
exports.calculateEnergyUsage = calculateEnergyUsage;
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
const analyzeConsumptionPatterns = (readings, interval) => {
    if (readings.length < 2) {
        return {
            trend: 'stable',
            averageConsumption: 0,
            variability: 0,
        };
    }
    const consumptions = readings
        .filter(r => r.consumption !== undefined)
        .map(r => r.consumption);
    const avgConsumption = consumptions.reduce((a, b) => a + b, 0) / consumptions.length;
    // Calculate trend using simple linear regression
    const n = consumptions.length;
    const indices = consumptions.map((_, i) => i);
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = consumptions.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * consumptions[i], 0);
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let trend;
    if (Math.abs(slope) < 0.01) {
        trend = 'stable';
    }
    else if (slope > 0) {
        trend = 'increasing';
    }
    else {
        trend = 'decreasing';
    }
    // Calculate variability (coefficient of variation)
    const stdDev = Math.sqrt(consumptions.reduce((sum, val) => sum + Math.pow(val - avgConsumption, 2), 0) / n);
    const variability = avgConsumption > 0 ? (stdDev / avgConsumption) * 100 : 0;
    return {
        trend,
        averageConsumption: Math.round(avgConsumption * 100) / 100,
        variability: Math.round(variability * 100) / 100,
    };
};
exports.analyzeConsumptionPatterns = analyzeConsumptionPatterns;
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
const normalizeEnergyConsumption = (consumption, actualWeather, normalWeather) => {
    // Simple degree-day based normalization
    const actualDegreeDays = actualWeather.heatingDegreeDays + actualWeather.coolingDegreeDays;
    const normalDegreeDays = normalWeather.heatingDegreeDays + normalWeather.coolingDegreeDays;
    if (actualDegreeDays === 0) {
        return consumption;
    }
    const normalized = consumption * (normalDegreeDays / actualDegreeDays);
    return Math.round(normalized * 100) / 100;
};
exports.normalizeEnergyConsumption = normalizeEnergyConsumption;
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
const compareToBaseline = (current, baseline) => {
    const absoluteChange = current.totalConsumption - baseline.totalConsumption;
    const percentChange = baseline.totalConsumption > 0
        ? (absoluteChange / baseline.totalConsumption) * 100
        : 0;
    const costChange = current.totalCost - baseline.totalCost;
    const costPercentChange = baseline.totalCost > 0
        ? (costChange / baseline.totalCost) * 100
        : 0;
    let status;
    if (percentChange < -2) {
        status = 'improved';
    }
    else if (percentChange > 2) {
        status = 'declined';
    }
    else {
        status = 'stable';
    }
    return {
        absoluteChange: Math.round(absoluteChange * 100) / 100,
        percentChange: Math.round(percentChange * 100) / 100,
        costChange: Math.round(costChange * 100) / 100,
        costPercentChange: Math.round(costPercentChange * 100) / 100,
        status,
    };
};
exports.compareToBaseline = compareToBaseline;
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
const generateEnergyAnalytics = (propertyId, period, readings, meters) => {
    const usage = (0, exports.calculateEnergyUsage)(propertyId, period, readings, meters);
    const propertyReadings = readings.filter(r => meters.some(m => m.propertyId === propertyId && m.id === r.meterId));
    const patterns = (0, exports.analyzeConsumptionPatterns)(propertyReadings, 'daily');
    return {
        propertyId,
        period,
        summary: usage,
        patterns,
        generatedAt: new Date(),
    };
};
exports.generateEnergyAnalytics = generateEnergyAnalytics;
// ============================================================================
// DEMAND RESPONSE MANAGEMENT
// ============================================================================
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
const createDemandResponseEvent = (eventData) => {
    return {
        id: eventData.id || `DR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: eventData.propertyId,
        eventType: eventData.eventType || 'peak_shaving',
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        targetReduction: eventData.targetReduction,
        actualReduction: eventData.actualReduction,
        incentiveAmount: eventData.incentiveAmount,
        status: eventData.status || 'scheduled',
        participatingEquipment: eventData.participatingEquipment || [],
        strategyUsed: eventData.strategyUsed,
    };
};
exports.createDemandResponseEvent = createDemandResponseEvent;
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
const calculateDemandResponsePerformance = (event, baselineLoad, actualLoad) => {
    const actualReduction = baselineLoad - actualLoad;
    const reductionPercent = baselineLoad > 0 ? (actualReduction / baselineLoad) * 100 : 0;
    const targetAchievement = event.targetReduction > 0
        ? (actualReduction / event.targetReduction) * 100
        : 0;
    let status;
    if (targetAchievement >= 100) {
        status = 'exceeded';
    }
    else if (targetAchievement >= 90) {
        status = 'met';
    }
    else if (targetAchievement >= 50) {
        status = 'partial';
    }
    else {
        status = 'failed';
    }
    return {
        actualReduction: Math.round(actualReduction * 100) / 100,
        targetReduction: event.targetReduction,
        reductionPercent: Math.round(reductionPercent * 100) / 100,
        targetAchievement: Math.round(targetAchievement * 100) / 100,
        status,
    };
};
exports.calculateDemandResponsePerformance = calculateDemandResponsePerformance;
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
const selectDemandResponseEquipment = (propertyId, targetReduction, equipment) => {
    // Sort by priority (lower number = higher priority to shed)
    const sorted = [...equipment].sort((a, b) => a.priority - b.priority);
    const selected = [];
    let totalReduction = 0;
    for (const item of sorted) {
        if (totalReduction >= targetReduction) {
            break;
        }
        selected.push(item.id);
        totalReduction += item.load;
    }
    return selected;
};
exports.selectDemandResponseEquipment = selectDemandResponseEquipment;
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
const scheduleAutomatedDemandResponse = (event, automationConfig) => {
    const preConditioningMinutes = automationConfig.preConditioningMinutes || 30;
    const preConditioningStart = new Date(event.startTime.getTime() - preConditioningMinutes * 60 * 1000);
    return {
        eventId: event.id,
        actions: [
            {
                type: 'pre_conditioning',
                scheduledTime: preConditioningStart,
                description: 'Pre-cool or pre-heat spaces before curtailment',
            },
            {
                type: 'curtailment_start',
                scheduledTime: event.startTime,
                strategy: automationConfig.curtailmentStrategy || 'gradual',
                equipment: event.participatingEquipment,
            },
            {
                type: 'curtailment_end',
                scheduledTime: event.endTime,
                strategy: automationConfig.recoveryStrategy || 'staggered',
                equipment: event.participatingEquipment,
            },
        ],
    };
};
exports.scheduleAutomatedDemandResponse = scheduleAutomatedDemandResponse;
// ============================================================================
// ENERGY COST OPTIMIZATION
// ============================================================================
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
const analyzeRateStructure = (propertyId, currentRate, readings) => {
    const recommendations = [];
    // Analyze peak demand reduction potential
    if (currentRate.demandCharge && currentRate.demandCharge > 0) {
        const peakReadings = readings
            .filter(r => r.demand !== undefined)
            .sort((a, b) => (b.demand || 0) - (a.demand || 0))
            .slice(0, 5);
        if (peakReadings.length > 0) {
            const avgPeak = peakReadings.reduce((sum, r) => sum + (r.demand || 0), 0) / peakReadings.length;
            const potentialReduction = avgPeak * 0.15; // Assume 15% reduction possible
            const annualSavings = potentialReduction * currentRate.demandCharge * 12;
            recommendations.push({
                strategy: 'Peak Demand Management',
                description: `Reduce peak demand by ${potentialReduction.toFixed(1)} kW through load shifting and control strategies`,
                estimatedSavings: Math.round(annualSavings * 100) / 100,
                implementationComplexity: 'medium',
                requiresUtilityApproval: false,
            });
        }
    }
    // Time-of-use optimization
    if (currentRate.structure === 'time_of_use' || currentRate.structure === 'tiered') {
        recommendations.push({
            strategy: 'Load Shifting',
            description: 'Shift non-critical loads to off-peak hours to reduce energy costs',
            estimatedSavings: readings.length * currentRate.averageRate * 0.1 * 365, // Estimated 10% savings
            implementationComplexity: 'low',
            requiresUtilityApproval: false,
        });
    }
    return {
        propertyId,
        currentRate,
        recommendations,
    };
};
exports.analyzeRateStructure = analyzeRateStructure;
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
const calculateLoadShifting = (readings, rateSchedule) => {
    // Simplified load shifting analysis
    const peakHours = rateSchedule.peak.hours;
    const offPeakHours = rateSchedule.offPeak.hours;
    const peakReadings = readings.filter(r => {
        const hour = r.timestamp.getHours();
        return peakHours.includes(hour);
    });
    const avgPeakLoad = peakReadings.length > 0
        ? peakReadings.reduce((sum, r) => sum + (r.consumption || 0), 0) / peakReadings.length
        : 0;
    // Assume 30% of peak load is shiftable
    const shiftableLoad = avgPeakLoad * 0.3;
    const savingsPerKwh = rateSchedule.peak.rate - rateSchedule.offPeak.rate;
    const potentialSavings = shiftableLoad * savingsPerKwh * 365;
    return {
        shiftableLoad: Math.round(shiftableLoad * 100) / 100,
        potentialSavings: Math.round(potentialSavings * 100) / 100,
        recommendedShifts: [
            {
                from: `${peakHours[0]}:00 - ${peakHours[peakHours.length - 1]}:00`,
                to: `${offPeakHours[0]}:00 - ${offPeakHours[offPeakHours.length - 1]}:00`,
                load: shiftableLoad,
                savings: potentialSavings,
            },
        ],
    };
};
exports.calculateLoadShifting = calculateLoadShifting;
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
const evaluateEnergyProcurement = (annualConsumption, currentRate, alternatives) => {
    const currentAnnualCost = annualConsumption * currentRate;
    const evaluatedAlternatives = alternatives.map(alt => {
        const annualCost = annualConsumption * alt.rate;
        const savings = currentAnnualCost - annualCost;
        const savingsPercent = currentAnnualCost > 0 ? (savings / currentAnnualCost) * 100 : 0;
        return {
            provider: alt.provider,
            rate: alt.rate,
            term: alt.term,
            annualCost: Math.round(annualCost * 100) / 100,
            savings: Math.round(savings * 100) / 100,
            savingsPercent: Math.round(savingsPercent * 100) / 100,
        };
    });
    evaluatedAlternatives.sort((a, b) => b.savings - a.savings);
    return {
        currentAnnualCost: Math.round(currentAnnualCost * 100) / 100,
        alternatives: evaluatedAlternatives,
        bestOption: evaluatedAlternatives.length > 0 ? evaluatedAlternatives[0].provider : null,
    };
};
exports.evaluateEnergyProcurement = evaluateEnergyProcurement;
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
const calculatePowerFactorCorrection = (currentPowerFactor, targetPowerFactor, averageDemand, penaltyRate) => {
    // Calculate reactive power (kVAR)
    const currentReactivePower = averageDemand * Math.tan(Math.acos(currentPowerFactor));
    const targetReactivePower = averageDemand * Math.tan(Math.acos(targetPowerFactor));
    const reductionNeeded = currentReactivePower - targetReactivePower;
    const monthlySavings = reductionNeeded * penaltyRate;
    const annualSavings = monthlySavings * 12;
    return {
        currentReactivePower: Math.round(currentReactivePower * 100) / 100,
        targetReactivePower: Math.round(targetReactivePower * 100) / 100,
        reductionNeeded: Math.round(reductionNeeded * 100) / 100,
        monthlySavings: Math.round(monthlySavings * 100) / 100,
        annualSavings: Math.round(annualSavings * 100) / 100,
    };
};
exports.calculatePowerFactorCorrection = calculatePowerFactorCorrection;
// ============================================================================
// PEAK LOAD MANAGEMENT
// ============================================================================
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
const identifyPeakLoadPeriods = (propertyId, readings, threshold) => {
    const peakPeriods = [];
    // Find readings exceeding threshold
    const peakReadings = readings
        .filter(r => r.demand !== undefined && r.demand >= threshold)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    // Group consecutive peaks
    for (const reading of peakReadings) {
        if (!reading.demand)
            continue;
        peakPeriods.push({
            propertyId,
            date: reading.timestamp,
            peakDemand: reading.demand,
            peakTime: reading.timestamp,
            duration: 15, // Assume 15-minute intervals
            costImpact: 0, // Would be calculated based on rate structure
            contributingLoads: [], // Would be populated from submetering data
        });
    }
    return peakPeriods;
};
exports.identifyPeakLoadPeriods = identifyPeakLoadPeriods;
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
const analyzePeakContributors = (peak, submeterReadings) => {
    // Find submeter readings closest to peak time
    const peakTimeReadings = submeterReadings
        .filter(r => {
        const timeDiff = Math.abs(r.timestamp.getTime() - peak.peakTime.getTime());
        return timeDiff < 15 * 60 * 1000; // Within 15 minutes
    })
        .filter(r => r.demand !== undefined);
    const contributors = peakTimeReadings.map(r => ({
        equipment: r.meterId,
        contribution: r.demand || 0,
        percent: peak.peakDemand > 0 ? ((r.demand || 0) / peak.peakDemand) * 100 : 0,
    }));
    // Sort by contribution
    contributors.sort((a, b) => b.contribution - a.contribution);
    return contributors;
};
exports.analyzePeakContributors = analyzePeakContributors;
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
const generatePeakShavingStrategy = (peaks, targetReduction) => {
    const actions = [];
    // Analyze peak patterns
    const avgPeak = peaks.reduce((sum, p) => sum + p.peakDemand, 0) / peaks.length;
    const peakTimes = peaks.map(p => p.peakTime.getHours());
    const mostCommonHour = peakTimes.sort((a, b) => peakTimes.filter(v => v === a).length - peakTimes.filter(v => v === b).length).pop();
    // Generate recommendations
    if (targetReduction > avgPeak * 0.2) {
        actions.push({
            action: 'Install on-site battery storage for peak shaving',
            expectedReduction: targetReduction * 0.6,
            implementationCost: 'high',
        });
    }
    actions.push({
        action: `Implement demand response during peak hours (around ${mostCommonHour}:00)`,
        expectedReduction: targetReduction * 0.3,
        implementationCost: 'low',
    });
    actions.push({
        action: 'Optimize HVAC scheduling to reduce cooling load during peak periods',
        expectedReduction: targetReduction * 0.2,
        implementationCost: 'low',
    });
    actions.push({
        action: 'Implement lighting controls to reduce peak load',
        expectedReduction: targetReduction * 0.1,
        implementationCost: 'medium',
    });
    // Estimate savings based on typical demand charges
    const estimatedSavings = targetReduction * 15 * 12; // $15/kW/month * 12 months
    return {
        targetReduction,
        estimatedSavings: Math.round(estimatedSavings * 100) / 100,
        actions,
    };
};
exports.generatePeakShavingStrategy = generatePeakShavingStrategy;
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
const monitorPeakDemand = (currentDemand, peakThreshold, warningThreshold) => {
    if (currentDemand >= peakThreshold) {
        return {
            id: `ALERT-${Date.now()}`,
            propertyId: 'PROP-001', // Would be passed as parameter
            type: 'demand_peak',
            severity: 'critical',
            message: `Demand has exceeded peak threshold: ${currentDemand} kW (threshold: ${peakThreshold} kW)`,
            detectedAt: new Date(),
            value: currentDemand,
            threshold: peakThreshold,
            recommendations: [
                'Immediately shed non-critical loads',
                'Activate demand response plan',
                'Consider starting backup generation',
            ],
        };
    }
    else if (currentDemand >= warningThreshold) {
        return {
            id: `ALERT-${Date.now()}`,
            propertyId: 'PROP-001',
            type: 'demand_peak',
            severity: 'warning',
            message: `Demand approaching peak threshold: ${currentDemand} kW (warning: ${warningThreshold} kW)`,
            detectedAt: new Date(),
            value: currentDemand,
            threshold: warningThreshold,
            recommendations: [
                'Prepare to shed non-critical loads',
                'Review demand response options',
                'Monitor closely for next 15 minutes',
            ],
        };
    }
    return null;
};
exports.monitorPeakDemand = monitorPeakDemand;
// ============================================================================
// ENERGY BENCHMARKING
// ============================================================================
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
const calculateEUI = (annualEnergyUse, buildingArea) => {
    if (buildingArea <= 0) {
        return 0;
    }
    return Math.round((annualEnergyUse / buildingArea) * 100) / 100;
};
exports.calculateEUI = calculateEUI;
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
const generateEnergyBenchmark = (propertyId, usage, buildingArea, buildingType) => {
    // Convert kWh to kBTU (1 kWh = 3.412 kBTU)
    const annualEnergyKBTU = usage.totalConsumption * 3.412;
    const eui = (0, exports.calculateEUI)(annualEnergyKBTU, buildingArea);
    const costPerSqFt = buildingArea > 0 ? usage.totalCost / buildingArea : 0;
    // Typical EUI ranges by building type (simplified)
    const typicalEUI = {
        office: { average: 80, best: 40 },
        retail: { average: 90, best: 45 },
        multifamily: { average: 65, best: 35 },
        warehouse: { average: 35, best: 20 },
        hospital: { average: 220, best: 150 },
    };
    const benchmarkData = typicalEUI[buildingType] || typicalEUI.office;
    // Calculate percentile (simplified - would use actual database in production)
    const percentile = eui < benchmarkData.best ? 90 : eui < benchmarkData.average ? 60 : 30;
    // Calculate Energy Star-like score
    const score = Math.min(100, Math.max(0, 100 - ((eui / benchmarkData.average) - 0.5) * 100));
    // Estimate emissions (simplified - 0.92 lbs CO2e per kWh for average US grid)
    const emissionsPerSqFt = (usage.totalConsumption * 0.92 * 0.453592) / buildingArea; // Convert to kg
    return {
        propertyId,
        period: usage.period,
        metrics: {
            eui: Math.round(eui * 100) / 100,
            costPerSqFt: Math.round(costPerSqFt * 100) / 100,
            emissionsPerSqFt: Math.round(emissionsPerSqFt * 100) / 100,
        },
        percentile: Math.round(percentile),
        score: Math.round(score),
        comparison: {
            similar_buildings_average: benchmarkData.average,
            best_in_class: benchmarkData.best,
            improvement_potential: Math.max(0, (eui - benchmarkData.best) * buildingArea),
        },
    };
};
exports.generateEnergyBenchmark = generateEnergyBenchmark;
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
const compareToPortfolio = (propertyBenchmark, portfolioBenchmarks) => {
    const avgEUI = portfolioBenchmarks.reduce((sum, b) => sum + b.metrics.eui, 0) / portfolioBenchmarks.length;
    const percentDifference = avgEUI > 0
        ? ((propertyBenchmark.metrics.eui - avgEUI) / avgEUI) * 100
        : 0;
    // Rank properties (lower EUI is better)
    const sorted = [...portfolioBenchmarks].sort((a, b) => a.metrics.eui - b.metrics.eui);
    const rank = sorted.findIndex(b => b.propertyId === propertyBenchmark.propertyId) + 1;
    let status;
    if (rank <= portfolioBenchmarks.length * 0.25) {
        status = 'top_performer';
    }
    else if (rank <= portfolioBenchmarks.length * 0.5) {
        status = 'above_average';
    }
    else if (rank <= portfolioBenchmarks.length * 0.75) {
        status = 'below_average';
    }
    else {
        status = 'needs_improvement';
    }
    return {
        portfolioAvgEUI: Math.round(avgEUI * 100) / 100,
        propertyEUI: propertyBenchmark.metrics.eui,
        percentDifference: Math.round(percentDifference * 100) / 100,
        rank,
        total: portfolioBenchmarks.length,
        status,
    };
};
exports.compareToPortfolio = compareToPortfolio;
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
const trackBenchmarkProgress = (historicalBenchmarks) => {
    if (historicalBenchmarks.length < 2) {
        return {
            euiTrend: 'stable',
            scoreTrend: 'stable',
            improvements: [],
        };
    }
    const sorted = [...historicalBenchmarks].sort((a, b) => a.period.start.getTime() - b.period.start.getTime());
    const improvements = [];
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        improvements.push({
            period: `${curr.period.start.toISOString().substring(0, 7)}`,
            euiChange: curr.metrics.eui - prev.metrics.eui,
            scoreChange: curr.score - prev.score,
        });
    }
    // Determine trends
    const recentEUIChange = improvements.slice(-3).reduce((sum, i) => sum + i.euiChange, 0);
    const recentScoreChange = improvements.slice(-3).reduce((sum, i) => sum + i.scoreChange, 0);
    const euiTrend = recentEUIChange < -2 ? 'improving' : recentEUIChange > 2 ? 'declining' : 'stable';
    const scoreTrend = recentScoreChange > 2 ? 'improving' : recentScoreChange < -2 ? 'declining' : 'stable';
    return {
        euiTrend,
        scoreTrend,
        improvements,
    };
};
exports.trackBenchmarkProgress = trackBenchmarkProgress;
// ============================================================================
// HVAC OPTIMIZATION
// ============================================================================
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
const analyzeHVACPerformance = (propertyId, currentSettings, energyData, weatherData) => {
    const recommendations = [];
    // Temperature setpoint optimization
    if (currentSettings.coolingSetpoint < 74) {
        const setpointIncrease = 74 - currentSettings.coolingSetpoint;
        const savingsPerDegree = energyData.reduce((sum, r) => sum + (r.consumption || 0), 0) * 0.03; // 3% per degree
        const annualSavings = savingsPerDegree * setpointIncrease;
        recommendations.push({
            type: 'temperature_setpoint',
            description: `Increase cooling setpoint to 74°F (currently ${currentSettings.coolingSetpoint}°F)`,
            estimatedSavings: Math.round(annualSavings),
            estimatedCostSavings: Math.round(annualSavings * 0.12), // Assume $0.12/kWh
            implementationCost: 0,
            paybackPeriod: 0,
            priority: 'high',
        });
    }
    // Occupancy-based controls
    if (!currentSettings.occupancySensing) {
        const potentialSavings = energyData.reduce((sum, r) => sum + (r.consumption || 0), 0) * 0.15;
        recommendations.push({
            type: 'control_strategy',
            description: 'Implement occupancy-based HVAC controls',
            estimatedSavings: Math.round(potentialSavings),
            estimatedCostSavings: Math.round(potentialSavings * 0.12),
            implementationCost: 5000,
            paybackPeriod: 5000 / (potentialSavings * 0.12),
            priority: 'medium',
        });
    }
    // Schedule optimization
    if (currentSettings.schedule === '24/7') {
        const scheduleSavings = energyData.reduce((sum, r) => sum + (r.consumption || 0), 0) * 0.20;
        recommendations.push({
            type: 'schedule',
            description: 'Implement optimized HVAC schedule based on occupancy patterns',
            estimatedSavings: Math.round(scheduleSavings),
            estimatedCostSavings: Math.round(scheduleSavings * 0.12),
            implementationCost: 0,
            paybackPeriod: 0,
            priority: 'high',
        });
    }
    return {
        propertyId,
        recommendations,
        currentSettings,
        optimalSettings: {
            coolingSetpoint: 74,
            heatingSetpoint: 70,
            schedule: 'Occupied hours + setback',
            occupancySensing: true,
        },
    };
};
exports.analyzeHVACPerformance = analyzeHVACPerformance;
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
const calculateOptimalSetpoints = (isOccupied, outsideTemp, season) => {
    let cooling;
    let heating;
    let reason;
    if (isOccupied) {
        // Occupied setpoints
        if (season === 'summer') {
            cooling = outsideTemp > 95 ? 76 : 74;
            heating = 70;
            reason = outsideTemp > 95
                ? 'High outdoor temperature - slightly higher setpoint for efficiency'
                : 'Standard occupied cooling setpoint';
        }
        else if (season === 'winter') {
            cooling = 76;
            heating = outsideTemp < 20 ? 68 : 70;
            reason = outsideTemp < 20
                ? 'Very cold outdoor temperature - slightly lower setpoint for efficiency'
                : 'Standard occupied heating setpoint';
        }
        else {
            cooling = 75;
            heating = 69;
            reason = 'Mild weather - moderate setpoints';
        }
    }
    else {
        // Unoccupied setpoints (setback)
        if (season === 'summer') {
            cooling = 82;
            heating = 65;
            reason = 'Unoccupied - cooling setback to reduce energy use';
        }
        else if (season === 'winter') {
            cooling = 85;
            heating = 62;
            reason = 'Unoccupied - heating setback to reduce energy use';
        }
        else {
            cooling = 80;
            heating = 65;
            reason = 'Unoccupied - moderate setback';
        }
    }
    return { cooling, heating, reason };
};
exports.calculateOptimalSetpoints = calculateOptimalSetpoints;
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
const estimateHVACUpgradeROI = (currentEquipment, proposedEquipment, annualRuntime, energyRate) => {
    // Calculate annual energy consumption (simplified)
    const currentAnnualKWh = currentEquipment.capacity * currentEquipment.efficiency * annualRuntime;
    const proposedAnnualKWh = proposedEquipment.capacity * proposedEquipment.efficiency * annualRuntime;
    const currentAnnualCost = currentAnnualKWh * energyRate;
    const proposedAnnualCost = proposedAnnualKWh * energyRate;
    const annualSavings = currentAnnualCost - proposedAnnualCost;
    const simplePayback = annualSavings > 0 ? proposedEquipment.cost / annualSavings : Infinity;
    const roi = proposedEquipment.cost > 0 ? (annualSavings / proposedEquipment.cost) * 100 : 0;
    return {
        currentAnnualCost: Math.round(currentAnnualCost * 100) / 100,
        proposedAnnualCost: Math.round(proposedAnnualCost * 100) / 100,
        annualSavings: Math.round(annualSavings * 100) / 100,
        equipmentCost: proposedEquipment.cost,
        simplePayback: Math.round(simplePayback * 100) / 100,
        roi: Math.round(roi * 100) / 100,
    };
};
exports.estimateHVACUpgradeROI = estimateHVACUpgradeROI;
// ============================================================================
// LIGHTING CONTROL INTEGRATION
// ============================================================================
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
const createLightingZone = (controlData) => {
    return {
        id: controlData.id || `LIGHT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: controlData.propertyId,
        zoneId: controlData.zoneId,
        zoneName: controlData.zoneName,
        controlType: controlData.controlType || 'manual',
        status: controlData.status || 'auto',
        brightness: controlData.brightness,
        occupancyDetected: controlData.occupancyDetected,
        schedule: controlData.schedule,
        energyUsage: controlData.energyUsage || 0,
        connectedFixtures: controlData.connectedFixtures || 0,
        lastUpdate: new Date(),
    };
};
exports.createLightingZone = createLightingZone;
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
const calculateLightingSavings = (baselineUsage, controlType) => {
    // Typical savings percentages by control type
    const savingsFactors = {
        manual: 0,
        scheduled: 0.25,
        occupancy: 0.35,
        daylight: 0.40,
        smart: 0.50,
    };
    const savingsPercent = savingsFactors[controlType] * 100;
    const annualSavings = baselineUsage * savingsFactors[controlType];
    const costSavings = annualSavings * 0.12; // Assume $0.12/kWh
    return {
        annualSavings: Math.round(annualSavings),
        savingsPercent: Math.round(savingsPercent),
        costSavings: Math.round(costSavings * 100) / 100,
    };
};
exports.calculateLightingSavings = calculateLightingSavings;
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
const optimizeLightingSchedule = (occupancyData) => {
    // Find first hour with >20% occupancy
    const firstOccupied = occupancyData.find(d => d.occupancy > 20);
    const onTime = firstOccupied ? `${firstOccupied.hour}:00` : '07:00';
    // Find last hour with >20% occupancy
    const lastOccupied = [...occupancyData].reverse().find(d => d.occupancy > 20);
    const offTime = lastOccupied ? `${lastOccupied.hour + 1}:00` : '18:00';
    // Estimate savings from reduced runtime
    const scheduledHours = occupancyData.filter(d => d.occupancy > 20).length;
    const savingsPercent = ((24 - scheduledHours) / 24) * 100;
    return {
        onTime,
        offTime,
        daysActive: [1, 2, 3, 4, 5], // Monday-Friday
        estimatedSavings: Math.round(savingsPercent),
    };
};
exports.optimizeLightingSchedule = optimizeLightingSchedule;
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
const analyzeDaylightHarvesting = (zoneId, windowArea, orientation, baselineLightingLoad) => {
    // Daylight potential by orientation
    const daylightFactors = {
        south: 0.45,
        east: 0.35,
        west: 0.35,
        north: 0.25,
    };
    const daylightFactor = daylightFactors[orientation];
    const potentialSavings = daylightFactor * 100;
    // Estimate sensors needed (1 per 400 sq ft window area)
    const recommendedSensors = Math.ceil(windowArea / 400);
    const estimatedCost = recommendedSensors * 500; // $500 per sensor installed
    const annualSavings = (baselineLightingLoad * daylightFactor * 2500 * 0.12) / 1000; // 2500 hours/year, $0.12/kWh
    const paybackPeriod = annualSavings > 0 ? estimatedCost / annualSavings : Infinity;
    return {
        zoneId,
        potentialSavings: Math.round(potentialSavings),
        recommendedSensors,
        estimatedCost,
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    };
};
exports.analyzeDaylightHarvesting = analyzeDaylightHarvesting;
// ============================================================================
// ENERGY EFFICIENCY PROJECTS
// ============================================================================
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
const createEfficiencyProject = (projectData) => {
    const paybackPeriod = projectData.estimatedCostSavings && projectData.estimatedCostSavings > 0
        ? (projectData.estimatedCost || 0) / projectData.estimatedCostSavings
        : Infinity;
    const roi = projectData.estimatedCost && projectData.estimatedCost > 0
        ? ((projectData.estimatedCostSavings || 0) / projectData.estimatedCost) * 100
        : 0;
    return {
        id: projectData.id || `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: projectData.propertyId,
        name: projectData.name,
        category: projectData.category,
        description: projectData.description || '',
        status: projectData.status || 'proposed',
        proposedDate: projectData.proposedDate || new Date(),
        approvalDate: projectData.approvalDate,
        completionDate: projectData.completionDate,
        estimatedCost: projectData.estimatedCost || 0,
        actualCost: projectData.actualCost,
        estimatedAnnualSavings: projectData.estimatedAnnualSavings || 0,
        estimatedCostSavings: projectData.estimatedCostSavings || 0,
        actualAnnualSavings: projectData.actualAnnualSavings,
        paybackPeriod: Math.round(paybackPeriod * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        priority: projectData.priority || 'medium',
        incentivesAvailable: projectData.incentivesAvailable,
        measurementPlan: projectData.measurementPlan,
    };
};
exports.createEfficiencyProject = createEfficiencyProject;
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
const prioritizeEfficiencyProjects = (projects) => {
    return [...projects].sort((a, b) => {
        // Priority scoring: ROI (40%), Annual Savings (30%), Payback Period (30%)
        const scoreA = a.roi * 0.4 +
            (a.estimatedCostSavings / 10000) * 0.3 +
            (10 / Math.max(0.1, a.paybackPeriod)) * 30;
        const scoreB = b.roi * 0.4 +
            (b.estimatedCostSavings / 10000) * 0.3 +
            (10 / Math.max(0.1, b.paybackPeriod)) * 30;
        return scoreB - scoreA;
    });
};
exports.prioritizeEfficiencyProjects = prioritizeEfficiencyProjects;
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
const trackProjectPerformance = (project, actualAnnualSavings) => {
    const savingsAchievement = project.estimatedAnnualSavings > 0
        ? (actualAnnualSavings / project.estimatedAnnualSavings) * 100
        : 0;
    const actualCostSavings = actualAnnualSavings * 0.12; // Assume $0.12/kWh
    const actualPayback = actualCostSavings > 0 ? (project.actualCost || project.estimatedCost) / actualCostSavings : Infinity;
    let status;
    if (savingsAchievement >= 100) {
        status = 'exceeding';
    }
    else if (savingsAchievement >= 85) {
        status = 'on_target';
    }
    else {
        status = 'underperforming';
    }
    return {
        estimatedSavings: project.estimatedAnnualSavings,
        actualSavings: actualAnnualSavings,
        savingsAchievement: Math.round(savingsAchievement),
        estimatedPayback: project.paybackPeriod,
        actualPayback: Math.round(actualPayback * 100) / 100,
        status,
    };
};
exports.trackProjectPerformance = trackProjectPerformance;
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
const identifyUtilityIncentives = (category, projectCost, utilityProvider) => {
    // This would integrate with actual utility incentive databases
    // Simplified example data
    const incentivePrograms = {
        lighting_retrofit: [
            {
                program: 'Commercial Lighting Rebate',
                percentOfCost: 0.25,
                maxAmount: 50000,
                description: 'Rebate for LED lighting upgrades',
            },
        ],
        hvac_upgrade: [
            {
                program: 'HVAC Efficiency Incentive',
                percentOfCost: 0.20,
                maxAmount: 100000,
                description: 'Incentive for high-efficiency HVAC equipment',
            },
        ],
        renewable_energy: [
            {
                program: 'Solar Investment Tax Credit',
                percentOfCost: 0.30,
                maxAmount: Infinity,
                description: 'Federal solar ITC',
            },
            {
                program: 'State Solar Rebate',
                percentOfCost: 0.15,
                maxAmount: 75000,
                description: 'State-level solar rebate program',
            },
        ],
        building_controls: [
            {
                program: 'Smart Building Controls',
                percentOfCost: 0.30,
                maxAmount: 25000,
                description: 'Rebate for building automation systems',
            },
        ],
        insulation: [],
        windows: [],
        water_efficiency: [],
        equipment_replacement: [],
        behavioral_program: [],
    };
    const programs = incentivePrograms[category] || [];
    return programs.map(prog => {
        const calculatedAmount = projectCost * prog.percentOfCost;
        const amount = Math.min(calculatedAmount, prog.maxAmount);
        return {
            program: prog.program,
            amount: Math.round(amount * 100) / 100,
            description: prog.description,
            eligibility: `Available from ${utilityProvider}`,
        };
    });
};
exports.identifyUtilityIncentives = identifyUtilityIncentives;
// ============================================================================
// UTILITY BILL MANAGEMENT
// ============================================================================
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
const recordUtilityBill = (billData) => {
    return {
        id: billData.id || `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: billData.propertyId,
        meterId: billData.meterId,
        utilityProvider: billData.utilityProvider,
        billDate: billData.billDate,
        periodStart: billData.periodStart,
        periodEnd: billData.periodEnd,
        totalAmount: billData.totalAmount,
        consumption: billData.consumption,
        unit: billData.unit || 'kwh',
        breakdown: billData.breakdown || {
            energyCharges: 0,
            demandCharges: 0,
            deliveryCharges: 0,
            taxes: 0,
            fees: 0,
            credits: 0,
            adjustments: 0,
        },
        peakDemand: billData.peakDemand,
        powerFactor: billData.powerFactor,
        dueDate: billData.dueDate,
        isPaid: billData.isPaid || false,
        paidDate: billData.paidDate,
        attachments: billData.attachments || [],
        tags: billData.tags || [],
    };
};
exports.recordUtilityBill = recordUtilityBill;
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
const validateUtilityBill = (bill, historicalBills) => {
    const issues = [];
    const warnings = [];
    // Check breakdown totals
    const breakdownTotal = bill.breakdown.energyCharges +
        bill.breakdown.demandCharges +
        bill.breakdown.deliveryCharges +
        bill.breakdown.taxes +
        bill.breakdown.fees +
        bill.breakdown.credits +
        bill.breakdown.adjustments;
    if (Math.abs(breakdownTotal - bill.totalAmount) > 0.01) {
        issues.push(`Breakdown total (${breakdownTotal}) doesn't match bill total (${bill.totalAmount})`);
    }
    // Compare to historical average
    if (historicalBills.length >= 3) {
        const avgConsumption = historicalBills.reduce((sum, b) => sum + b.consumption, 0) / historicalBills.length;
        const variance = Math.abs((bill.consumption - avgConsumption) / avgConsumption);
        if (variance > 0.5) {
            warnings.push(`Consumption varies significantly from average (${Math.round(variance * 100)}% difference)`);
        }
        const avgCost = historicalBills.reduce((sum, b) => sum + b.totalAmount, 0) / historicalBills.length;
        const costVariance = Math.abs((bill.totalAmount - avgCost) / avgCost);
        if (costVariance > 0.5) {
            warnings.push(`Cost varies significantly from average (${Math.round(costVariance * 100)}% difference)`);
        }
    }
    // Check for unusual rate
    const effectiveRate = bill.consumption > 0 ? bill.totalAmount / bill.consumption : 0;
    if (effectiveRate > 0.50) {
        warnings.push(`Unusually high effective rate: $${effectiveRate.toFixed(3)}/kWh`);
    }
    const confidence = issues.length === 0 && warnings.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 30 + warnings.length * 10));
    return {
        isValid: issues.length === 0,
        issues,
        warnings,
        confidence,
    };
};
exports.validateUtilityBill = validateUtilityBill;
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
const analyzeUtilityBillTrends = (bills) => {
    if (bills.length < 2) {
        return {
            costTrend: 'stable',
            consumptionTrend: 'stable',
            avgMonthlyConsumption: 0,
            avgMonthlyCost: 0,
            primaryCostDriver: 'unknown',
        };
    }
    const sorted = [...bills].sort((a, b) => a.billDate.getTime() - b.billDate.getTime());
    // Calculate trends
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    const firstHalfAvgCost = firstHalf.reduce((sum, b) => sum + b.totalAmount, 0) / firstHalf.length;
    const secondHalfAvgCost = secondHalf.reduce((sum, b) => sum + b.totalAmount, 0) / secondHalf.length;
    const costTrend = secondHalfAvgCost > firstHalfAvgCost * 1.05
        ? 'increasing'
        : secondHalfAvgCost < firstHalfAvgCost * 0.95
            ? 'decreasing'
            : 'stable';
    const firstHalfAvgConsumption = firstHalf.reduce((sum, b) => sum + b.consumption, 0) / firstHalf.length;
    const secondHalfAvgConsumption = secondHalf.reduce((sum, b) => sum + b.consumption, 0) / secondHalf.length;
    const consumptionTrend = secondHalfAvgConsumption > firstHalfAvgConsumption * 1.05
        ? 'increasing'
        : secondHalfAvgConsumption < firstHalfAvgConsumption * 0.95
            ? 'decreasing'
            : 'stable';
    const avgMonthlyConsumption = bills.reduce((sum, b) => sum + b.consumption, 0) / bills.length;
    const avgMonthlyCost = bills.reduce((sum, b) => sum + b.totalAmount, 0) / bills.length;
    // Identify primary cost driver
    const avgBreakdown = {
        energyCharges: bills.reduce((sum, b) => sum + b.breakdown.energyCharges, 0) / bills.length,
        demandCharges: bills.reduce((sum, b) => sum + b.breakdown.demandCharges, 0) / bills.length,
        deliveryCharges: bills.reduce((sum, b) => sum + b.breakdown.deliveryCharges, 0) / bills.length,
    };
    let primaryCostDriver = 'energy_charges';
    let maxCharge = avgBreakdown.energyCharges;
    if (avgBreakdown.demandCharges > maxCharge) {
        primaryCostDriver = 'demand_charges';
        maxCharge = avgBreakdown.demandCharges;
    }
    if (avgBreakdown.deliveryCharges > maxCharge) {
        primaryCostDriver = 'delivery_charges';
    }
    return {
        costTrend,
        consumptionTrend,
        avgMonthlyConsumption: Math.round(avgMonthlyConsumption),
        avgMonthlyCost: Math.round(avgMonthlyCost * 100) / 100,
        primaryCostDriver,
    };
};
exports.analyzeUtilityBillTrends = analyzeUtilityBillTrends;
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
const forecastUtilityCosts = (historicalBills, forecastMonths) => {
    if (historicalBills.length < 3) {
        return [];
    }
    const sorted = [...historicalBills].sort((a, b) => a.billDate.getTime() - b.billDate.getTime());
    // Simple moving average forecast
    const avgConsumption = sorted.slice(-12).reduce((sum, b) => sum + b.consumption, 0) / Math.min(12, sorted.length);
    const avgCost = sorted.slice(-12).reduce((sum, b) => sum + b.totalAmount, 0) / Math.min(12, sorted.length);
    const forecast = [];
    const lastBillDate = sorted[sorted.length - 1].billDate;
    for (let i = 1; i <= forecastMonths; i++) {
        const forecastDate = new Date(lastBillDate);
        forecastDate.setMonth(forecastDate.getMonth() + i);
        // Apply seasonal adjustment (simplified)
        const month = forecastDate.getMonth();
        let seasonalFactor = 1.0;
        // Summer months (June-August): higher usage
        if (month >= 5 && month <= 7) {
            seasonalFactor = 1.2;
        }
        // Winter months (December-February): higher usage
        else if (month === 11 || month <= 1) {
            seasonalFactor = 1.15;
        }
        // Spring/Fall: lower usage
        else {
            seasonalFactor = 0.9;
        }
        forecast.push({
            month: forecastDate.toISOString().substring(0, 7),
            estimatedConsumption: Math.round(avgConsumption * seasonalFactor),
            estimatedCost: Math.round(avgCost * seasonalFactor * 100) / 100,
        });
    }
    return forecast;
};
exports.forecastUtilityCosts = forecastUtilityCosts;
//# sourceMappingURL=property-energy-management-kit.js.map