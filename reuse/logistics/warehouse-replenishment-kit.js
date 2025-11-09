"use strict";
/**
 * LOC: WMS-REPL-001
 * File: /reuse/logistics/warehouse-replenishment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse management services
 *   - Inventory controllers
 *   - Replenishment schedulers
 *   - Task management systems
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitOfMeasure = exports.PickZoneType = exports.ReplenishmentTaskStatus = exports.ReplenishmentPriority = exports.ReplenishmentMethod = void 0;
exports.createReplenishmentRule = createReplenishmentRule;
exports.createMinMaxLevel = createMinMaxLevel;
exports.updateReplenishmentRule = updateReplenishmentRule;
exports.validateReplenishmentRule = validateReplenishmentRule;
exports.calculateOptimalMinMax = calculateOptimalMinMax;
exports.createZoneReplenishment = createZoneReplenishment;
exports.applyReplenishmentRules = applyReplenishmentRules;
exports.checkMinMaxTrigger = checkMinMaxTrigger;
exports.createReplenishmentTrigger = createReplenishmentTrigger;
exports.evaluateDemandTrigger = evaluateDemandTrigger;
exports.evaluateTimeTrigger = evaluateTimeTrigger;
exports.checkStockoutCondition = checkStockoutCondition;
exports.evaluateWaveTrigger = evaluateWaveTrigger;
exports.calculateReplenishmentPriority = calculateReplenishmentPriority;
exports.batchReplenishmentTriggers = batchReplenishmentTriggers;
exports.generateReplenishmentTask = generateReplenishmentTask;
exports.findOptimalSourceLocation = findOptimalSourceLocation;
exports.generateWaveReplenishmentTasks = generateWaveReplenishmentTasks;
exports.optimizeTaskSequence = optimizeTaskSequence;
exports.calculateTaskDuration = calculateTaskDuration;
exports.validateTaskFeasibility = validateTaskFeasibility;
exports.createReplenishmentWave = createReplenishmentWave;
exports.splitReplenishmentTask = splitReplenishmentTask;
exports.assignReplenishmentTask = assignReplenishmentTask;
exports.startReplenishmentTask = startReplenishmentTask;
exports.completeReplenishmentTask = completeReplenishmentTask;
exports.cancelReplenishmentTask = cancelReplenishmentTask;
exports.updatePickLocationInventory = updatePickLocationInventory;
exports.updateReserveLocationInventory = updateReserveLocationInventory;
exports.processTaskCompletion = processTaskCompletion;
exports.calculateReplenishmentMetrics = calculateReplenishmentMetrics;
exports.analyzeZonePerformance = analyzeZonePerformance;
exports.calculateServiceLevel = calculateServiceLevel;
exports.generateEfficiencyReport = generateEfficiencyReport;
exports.identifyReplenishmentBottlenecks = identifyReplenishmentBottlenecks;
exports.forecastReplenishmentDemand = forecastReplenishmentDemand;
exports.exportReplenishmentToCSV = exportReplenishmentToCSV;
/**
 * File: /reuse/logistics/warehouse-replenishment-kit.ts
 * Locator: WC-LOGISTICS-WMS-REPL-001
 * Purpose: Comprehensive Warehouse Replenishment Management - Complete replenishment lifecycle for warehouse operations
 *
 * Upstream: Independent utility module for warehouse replenishment operations
 * Downstream: ../backend/logistics/*, WMS modules, Inventory services, Task schedulers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 37 utility functions for replenishment rules, triggers, task generation, execution, and monitoring
 *
 * LLM Context: Enterprise-grade warehouse replenishment utilities to compete with JD Edwards EnterpriseOne WMS.
 * Provides comprehensive replenishment management including min/max rules, demand-based triggers, wave replenishment,
 * zone-based strategies, bulk and case picking optimization, directed task generation, real-time inventory monitoring,
 * performance analytics, and compliance tracking for warehouse operations.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Replenishment method enumeration
 */
var ReplenishmentMethod;
(function (ReplenishmentMethod) {
    ReplenishmentMethod["MIN_MAX"] = "MIN_MAX";
    ReplenishmentMethod["DEMAND_BASED"] = "DEMAND_BASED";
    ReplenishmentMethod["WAVE_BASED"] = "WAVE_BASED";
    ReplenishmentMethod["TIME_BASED"] = "TIME_BASED";
    ReplenishmentMethod["KANBAN"] = "KANBAN";
    ReplenishmentMethod["DIRECTED"] = "DIRECTED";
    ReplenishmentMethod["OPPORTUNISTIC"] = "OPPORTUNISTIC";
})(ReplenishmentMethod || (exports.ReplenishmentMethod = ReplenishmentMethod = {}));
/**
 * Replenishment priority levels
 */
var ReplenishmentPriority;
(function (ReplenishmentPriority) {
    ReplenishmentPriority["CRITICAL"] = "CRITICAL";
    ReplenishmentPriority["HIGH"] = "HIGH";
    ReplenishmentPriority["MEDIUM"] = "MEDIUM";
    ReplenishmentPriority["LOW"] = "LOW";
    ReplenishmentPriority["SCHEDULED"] = "SCHEDULED";
})(ReplenishmentPriority || (exports.ReplenishmentPriority = ReplenishmentPriority = {}));
/**
 * Replenishment task status
 */
var ReplenishmentTaskStatus;
(function (ReplenishmentTaskStatus) {
    ReplenishmentTaskStatus["PENDING"] = "PENDING";
    ReplenishmentTaskStatus["ASSIGNED"] = "ASSIGNED";
    ReplenishmentTaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ReplenishmentTaskStatus["COMPLETED"] = "COMPLETED";
    ReplenishmentTaskStatus["CANCELLED"] = "CANCELLED";
    ReplenishmentTaskStatus["FAILED"] = "FAILED";
})(ReplenishmentTaskStatus || (exports.ReplenishmentTaskStatus = ReplenishmentTaskStatus = {}));
/**
 * Pick zone types
 */
var PickZoneType;
(function (PickZoneType) {
    PickZoneType["FAST_PICK"] = "FAST_PICK";
    PickZoneType["BULK_PICK"] = "BULK_PICK";
    PickZoneType["CASE_PICK"] = "CASE_PICK";
    PickZoneType["EACH_PICK"] = "EACH_PICK";
    PickZoneType["PALLET_PICK"] = "PALLET_PICK";
})(PickZoneType || (exports.PickZoneType = PickZoneType = {}));
/**
 * Unit of measure for inventory
 */
var UnitOfMeasure;
(function (UnitOfMeasure) {
    UnitOfMeasure["EACH"] = "EACH";
    UnitOfMeasure["CASE"] = "CASE";
    UnitOfMeasure["PALLET"] = "PALLET";
    UnitOfMeasure["BOX"] = "BOX";
    UnitOfMeasure["CARTON"] = "CARTON";
})(UnitOfMeasure || (exports.UnitOfMeasure = UnitOfMeasure = {}));
// ============================================================================
// SECTION 1: RULE CONFIGURATION (Functions 1-7)
// ============================================================================
/**
 * 1. Creates a new replenishment rule.
 *
 * @param {Partial<ReplenishmentRule>} ruleData - Rule configuration data
 * @returns {ReplenishmentRule} New replenishment rule
 *
 * @example
 * ```typescript
 * const rule = createReplenishmentRule({
 *   ruleName: 'Fast Pick Min/Max',
 *   method: ReplenishmentMethod.MIN_MAX,
 *   priority: ReplenishmentPriority.HIGH,
 *   zoneIds: ['ZONE-FAST-01'],
 *   isActive: true
 * });
 * ```
 */
function createReplenishmentRule(ruleData) {
    const ruleId = `RULE-${crypto.randomUUID()}`;
    const now = new Date();
    return {
        ruleId,
        ruleName: ruleData.ruleName || 'New Rule',
        method: ruleData.method || ReplenishmentMethod.MIN_MAX,
        priority: ruleData.priority || ReplenishmentPriority.MEDIUM,
        zoneIds: ruleData.zoneIds,
        productCategories: ruleData.productCategories,
        specificProducts: ruleData.specificProducts,
        isActive: ruleData.isActive !== undefined ? ruleData.isActive : true,
        scheduleConfig: ruleData.scheduleConfig,
        thresholds: ruleData.thresholds,
        constraints: ruleData.constraints,
        createdAt: now,
        updatedAt: now,
        metadata: ruleData.metadata,
    };
}
/**
 * 2. Creates min/max inventory levels for a location.
 *
 * @param {Partial<MinMaxLevel>} levelData - Min/max level data
 * @returns {MinMaxLevel} New min/max level configuration
 *
 * @example
 * ```typescript
 * const level = createMinMaxLevel({
 *   productId: 'PROD-001',
 *   sku: 'SKU-12345',
 *   locationId: 'LOC-FP-01',
 *   minQuantity: 50,
 *   maxQuantity: 200,
 *   reorderPoint: 75,
 *   replenishmentQuantity: 150
 * });
 * ```
 */
function createMinMaxLevel(levelData) {
    const levelId = `LEVEL-${crypto.randomUUID()}`;
    const now = new Date();
    return {
        levelId,
        productId: levelData.productId || '',
        sku: levelData.sku || '',
        locationId: levelData.locationId || '',
        minQuantity: levelData.minQuantity || 0,
        maxQuantity: levelData.maxQuantity || 0,
        reorderPoint: levelData.reorderPoint || levelData.minQuantity || 0,
        replenishmentQuantity: levelData.replenishmentQuantity ||
            (levelData.maxQuantity || 0) - (levelData.minQuantity || 0),
        unitOfMeasure: levelData.unitOfMeasure || UnitOfMeasure.EACH,
        leadTime: levelData.leadTime,
        safetyStock: levelData.safetyStock,
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * 3. Updates an existing replenishment rule.
 *
 * @param {ReplenishmentRule} rule - Existing rule
 * @param {Partial<ReplenishmentRule>} updates - Updates to apply
 * @returns {ReplenishmentRule} Updated rule
 *
 * @example
 * ```typescript
 * const updated = updateReplenishmentRule(rule, {
 *   priority: ReplenishmentPriority.CRITICAL,
 *   isActive: false
 * });
 * ```
 */
function updateReplenishmentRule(rule, updates) {
    return {
        ...rule,
        ...updates,
        ruleId: rule.ruleId, // Preserve ID
        createdAt: rule.createdAt, // Preserve creation date
        updatedAt: new Date(),
    };
}
/**
 * 4. Validates replenishment rule configuration.
 *
 * @param {ReplenishmentRule} rule - Rule to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateReplenishmentRule(rule);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
function validateReplenishmentRule(rule) {
    const errors = [];
    if (!rule.ruleName || rule.ruleName.trim().length === 0) {
        errors.push('Rule name is required');
    }
    if (!rule.method) {
        errors.push('Replenishment method is required');
    }
    if (!rule.zoneIds?.length && !rule.productCategories?.length && !rule.specificProducts?.length) {
        errors.push('Rule must target at least one zone, category, or product');
    }
    if (rule.constraints) {
        if (rule.constraints.minReplenishmentQty && rule.constraints.maxReplenishmentQty) {
            if (rule.constraints.minReplenishmentQty > rule.constraints.maxReplenishmentQty) {
                errors.push('Minimum replenishment quantity cannot exceed maximum');
            }
        }
    }
    if (rule.method === ReplenishmentMethod.TIME_BASED && !rule.scheduleConfig) {
        errors.push('Time-based method requires schedule configuration');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * 5. Calculates optimal min/max levels based on demand history.
 *
 * @param {object} demandData - Historical demand data
 * @returns {object} Calculated min/max levels
 *
 * @example
 * ```typescript
 * const levels = calculateOptimalMinMax({
 *   averageDailyDemand: 45,
 *   leadTimeDays: 2,
 *   serviceLevel: 0.95,
 *   demandVariability: 0.15
 * });
 * ```
 */
function calculateOptimalMinMax(demandData) {
    const { averageDailyDemand, leadTimeDays, serviceLevel, demandVariability } = demandData;
    // Z-score for service level (simplified approximation)
    const zScore = serviceLevel >= 0.95 ? 1.65 :
        serviceLevel >= 0.90 ? 1.28 : 1.0;
    // Calculate safety stock
    const leadTimeDemand = averageDailyDemand * leadTimeDays;
    const standardDeviation = averageDailyDemand * demandVariability;
    const safetyStock = Math.ceil(zScore * standardDeviation * Math.sqrt(leadTimeDays));
    // Calculate reorder point
    const reorderPoint = Math.ceil(leadTimeDemand + safetyStock);
    // Calculate min quantity (safety stock + buffer)
    const minQuantity = Math.ceil(safetyStock * 1.5);
    // Calculate max quantity (enough for lead time + review period)
    const reviewPeriod = 1; // days
    const maxQuantity = Math.ceil((averageDailyDemand * (leadTimeDays + reviewPeriod)) + safetyStock);
    return {
        minQuantity,
        maxQuantity,
        reorderPoint,
        safetyStock,
    };
}
/**
 * 6. Creates zone replenishment configuration.
 *
 * @param {Partial<ZoneReplenishment>} zoneData - Zone configuration data
 * @returns {ZoneReplenishment} Zone replenishment configuration
 *
 * @example
 * ```typescript
 * const zone = createZoneReplenishment({
 *   zoneName: 'Fast Pick Zone A',
 *   zoneType: PickZoneType.FAST_PICK,
 *   replenishmentMethod: ReplenishmentMethod.MIN_MAX,
 *   targetServiceLevel: 98
 * });
 * ```
 */
function createZoneReplenishment(zoneData) {
    const zoneId = zoneData.zoneId || `ZONE-${crypto.randomUUID()}`;
    const now = new Date();
    const defaultBulkConfig = {
        zoneId,
        minPalletQuantity: 1,
        maxPalletQuantity: 10,
        preferredEquipment: ['FORKLIFT', 'PALLET_JACK'],
    };
    const defaultCaseConfig = {
        zoneId,
        casesPerReplenishment: 10,
        minCaseThreshold: 2,
        conveyorCompatible: true,
    };
    return {
        zoneId,
        zoneName: zoneData.zoneName || 'Unnamed Zone',
        zoneType: zoneData.zoneType || PickZoneType.EACH_PICK,
        replenishmentMethod: zoneData.replenishmentMethod || ReplenishmentMethod.MIN_MAX,
        priority: zoneData.priority || ReplenishmentPriority.MEDIUM,
        targetServiceLevel: zoneData.targetServiceLevel || 95,
        currentServiceLevel: zoneData.currentServiceLevel,
        avgReplenishmentTime: zoneData.avgReplenishmentTime,
        activeTaskCount: zoneData.activeTaskCount || 0,
        pendingTaskCount: zoneData.pendingTaskCount || 0,
        configuration: zoneData.configuration ||
            (zoneData.zoneType === PickZoneType.BULK_PICK ? defaultBulkConfig : defaultCaseConfig),
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * 7. Applies business rules to filter and prioritize replenishment needs.
 *
 * @param {PickLocation[]} locations - Pick locations to evaluate
 * @param {ReplenishmentRule[]} rules - Active replenishment rules
 * @returns {PickLocation[]} Filtered and prioritized locations
 *
 * @example
 * ```typescript
 * const prioritized = applyReplenishmentRules(allLocations, activeRules);
 * ```
 */
function applyReplenishmentRules(locations, rules) {
    const activeRules = rules.filter(rule => rule.isActive);
    return locations
        .filter(location => {
        // Check if location matches any active rule
        return activeRules.some(rule => {
            if (rule.zoneIds && !rule.zoneIds.includes(location.zoneId)) {
                return false;
            }
            if (rule.specificProducts && location.productId &&
                !rule.specificProducts.includes(location.productId)) {
                return false;
            }
            return true;
        });
    })
        .sort((a, b) => {
        // Sort by current quantity (lowest first for replenishment priority)
        const utilizationA = a.currentQuantity / a.capacity;
        const utilizationB = b.currentQuantity / b.capacity;
        return utilizationA - utilizationB;
    });
}
// ============================================================================
// SECTION 2: TRIGGER EVALUATION (Functions 8-15)
// ============================================================================
/**
 * 8. Evaluates if a pick location needs replenishment based on min/max levels.
 *
 * @param {PickLocation} location - Pick location to evaluate
 * @param {MinMaxLevel} minMaxLevel - Min/max configuration
 * @returns {boolean} True if replenishment is needed
 *
 * @example
 * ```typescript
 * const needsRepl = checkMinMaxTrigger(pickLocation, minMaxConfig);
 * ```
 */
function checkMinMaxTrigger(location, minMaxLevel) {
    return location.currentQuantity <= minMaxLevel.reorderPoint;
}
/**
 * 9. Creates a replenishment trigger event.
 *
 * @param {object} triggerData - Trigger event data
 * @returns {ReplenishmentTrigger} Replenishment trigger
 *
 * @example
 * ```typescript
 * const trigger = createReplenishmentTrigger({
 *   triggerType: 'THRESHOLD',
 *   productId: 'PROD-001',
 *   sku: 'SKU-12345',
 *   locationId: 'LOC-FP-01',
 *   currentQuantity: 25,
 *   requiredQuantity: 150,
 *   priority: ReplenishmentPriority.HIGH,
 *   reason: 'Below reorder point'
 * });
 * ```
 */
function createReplenishmentTrigger(triggerData) {
    return {
        triggerId: `TRIG-${crypto.randomUUID()}`,
        triggerType: triggerData.triggerType,
        productId: triggerData.productId,
        sku: triggerData.sku,
        locationId: triggerData.locationId,
        currentQuantity: triggerData.currentQuantity,
        requiredQuantity: triggerData.requiredQuantity,
        priority: triggerData.priority,
        reason: triggerData.reason,
        createdAt: new Date(),
        metadata: triggerData.metadata,
    };
}
/**
 * 10. Evaluates demand-based replenishment triggers.
 *
 * @param {PickLocation} location - Pick location
 * @param {number} forecastedDemand - Forecasted demand for period
 * @param {number} demandHorizon - Time horizon in hours
 * @returns {object} Trigger evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateDemandTrigger(location, 120, 24);
 * if (result.shouldTrigger) {
 *   console.log('Replenishment needed:', result.reason);
 * }
 * ```
 */
function evaluateDemandTrigger(location, forecastedDemand, demandHorizon) {
    const currentStock = location.currentQuantity;
    const capacity = location.capacity;
    // Will current stock cover forecasted demand?
    if (currentStock < forecastedDemand) {
        const shortfall = forecastedDemand - currentStock;
        const urgency = shortfall > forecastedDemand * 0.5
            ? ReplenishmentPriority.CRITICAL
            : ReplenishmentPriority.HIGH;
        return {
            shouldTrigger: true,
            reason: `Current stock (${currentStock}) insufficient for forecasted demand (${forecastedDemand}) over ${demandHorizon}h`,
            urgency,
            recommendedQuantity: Math.min(capacity, forecastedDemand * 1.2), // 120% of forecast
        };
    }
    return {
        shouldTrigger: false,
    };
}
/**
 * 11. Evaluates time-based replenishment triggers.
 *
 * @param {ReplenishmentRule} rule - Replenishment rule with schedule
 * @param {Date} currentTime - Current time
 * @returns {boolean} True if scheduled trigger should fire
 *
 * @example
 * ```typescript
 * const shouldRun = evaluateTimeTrigger(rule, new Date());
 * ```
 */
function evaluateTimeTrigger(rule, currentTime) {
    if (!rule.scheduleConfig || !rule.isActive) {
        return false;
    }
    const { frequency, scheduledTimes, daysOfWeek } = rule.scheduleConfig;
    // Check day of week
    if (daysOfWeek && daysOfWeek.length > 0) {
        const currentDay = currentTime.getDay();
        if (!daysOfWeek.includes(currentDay)) {
            return false;
        }
    }
    // Check scheduled times
    if (scheduledTimes && scheduledTimes.length > 0) {
        const currentTimeStr = currentTime.toTimeString().substring(0, 5); // HH:MM
        return scheduledTimes.some(time => time === currentTimeStr);
    }
    // For HOURLY frequency without specific times
    if (frequency === 'HOURLY') {
        return currentTime.getMinutes() === 0;
    }
    return false;
}
/**
 * 12. Checks for stockout conditions and generates critical triggers.
 *
 * @param {PickLocation} location - Pick location
 * @param {MinMaxLevel} minMaxLevel - Min/max configuration
 * @returns {ReplenishmentTrigger | null} Critical trigger or null
 *
 * @example
 * ```typescript
 * const criticalTrigger = checkStockoutCondition(location, minMaxConfig);
 * if (criticalTrigger) {
 *   // Handle critical replenishment
 * }
 * ```
 */
function checkStockoutCondition(location, minMaxLevel) {
    const criticalThreshold = minMaxLevel.safetyStock || minMaxLevel.minQuantity * 0.2;
    if (location.currentQuantity <= criticalThreshold) {
        return createReplenishmentTrigger({
            triggerType: 'THRESHOLD',
            productId: location.productId || '',
            sku: location.sku || '',
            locationId: location.locationId,
            currentQuantity: location.currentQuantity,
            requiredQuantity: minMaxLevel.maxQuantity,
            priority: ReplenishmentPriority.CRITICAL,
            reason: 'STOCKOUT IMMINENT - Critical low stock',
            metadata: {
                threshold: criticalThreshold,
                capacityUtilization: location.currentQuantity / location.capacity,
            },
        });
    }
    return null;
}
/**
 * 13. Evaluates wave replenishment triggers for batch processing.
 *
 * @param {PickLocation[]} locations - Pick locations in zone
 * @param {ZoneReplenishment} zone - Zone configuration
 * @returns {PickLocation[]} Locations that should be included in wave
 *
 * @example
 * ```typescript
 * const waveLocations = evaluateWaveTrigger(zoneLocations, zoneConfig);
 * ```
 */
function evaluateWaveTrigger(locations, zone) {
    return locations.filter(location => {
        const utilizationRate = location.currentQuantity / location.capacity;
        // Include in wave if below 40% capacity
        if (utilizationRate < 0.4) {
            return true;
        }
        // Include if active picking might cause stockout soon
        if (utilizationRate < 0.6 && location.zoneType === PickZoneType.FAST_PICK) {
            return true;
        }
        return false;
    });
}
/**
 * 14. Calculates replenishment priority based on multiple factors.
 *
 * @param {object} factors - Priority calculation factors
 * @returns {ReplenishmentPriority} Calculated priority
 *
 * @example
 * ```typescript
 * const priority = calculateReplenishmentPriority({
 *   currentStock: 15,
 *   minQuantity: 50,
 *   demandRate: 25,
 *   isHighVelocity: true
 * });
 * ```
 */
function calculateReplenishmentPriority(factors) {
    const { currentStock, minQuantity, demandRate, isHighVelocity, hasBackorders, expirationRisk } = factors;
    // Calculate hours until stockout
    const hoursUntilStockout = currentStock / (demandRate || 1);
    // Critical conditions
    if (hasBackorders || currentStock === 0 || hoursUntilStockout < 1) {
        return ReplenishmentPriority.CRITICAL;
    }
    // High priority conditions
    if (hoursUntilStockout < 4 || (isHighVelocity && currentStock < minQuantity)) {
        return ReplenishmentPriority.HIGH;
    }
    // Medium priority
    if (currentStock < minQuantity || hoursUntilStockout < 24) {
        return ReplenishmentPriority.MEDIUM;
    }
    // Low priority
    return ReplenishmentPriority.LOW;
}
/**
 * 15. Batches multiple triggers into a consolidated evaluation.
 *
 * @param {ReplenishmentTrigger[]} triggers - Individual triggers
 * @param {number} maxBatchSize - Maximum triggers per batch
 * @returns {ReplenishmentTrigger[][]} Batched triggers
 *
 * @example
 * ```typescript
 * const batches = batchReplenishmentTriggers(allTriggers, 50);
 * ```
 */
function batchReplenishmentTriggers(triggers, maxBatchSize = 50) {
    // Sort by priority first
    const sorted = [...triggers].sort((a, b) => {
        const priorityOrder = {
            [ReplenishmentPriority.CRITICAL]: 0,
            [ReplenishmentPriority.HIGH]: 1,
            [ReplenishmentPriority.MEDIUM]: 2,
            [ReplenishmentPriority.LOW]: 3,
            [ReplenishmentPriority.SCHEDULED]: 4,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    const batches = [];
    for (let i = 0; i < sorted.length; i += maxBatchSize) {
        batches.push(sorted.slice(i, i + maxBatchSize));
    }
    return batches;
}
// ============================================================================
// SECTION 3: TASK GENERATION (Functions 16-23)
// ============================================================================
/**
 * 16. Generates a replenishment task from a trigger.
 *
 * @param {ReplenishmentTrigger} trigger - Replenishment trigger
 * @param {ReserveLocation} sourceLocation - Source location with inventory
 * @param {PickLocation} destinationLocation - Destination pick location
 * @returns {ReplenishmentTask} Generated task
 *
 * @example
 * ```typescript
 * const task = generateReplenishmentTask(trigger, reserveLoc, pickLoc);
 * ```
 */
function generateReplenishmentTask(trigger, sourceLocation, destinationLocation) {
    const taskId = `TASK-${crypto.randomUUID()}`;
    const taskNumber = generateTaskNumber();
    // Calculate quantity to move
    const availableSpace = destinationLocation.capacity - destinationLocation.currentQuantity;
    const requestedQuantity = trigger.requiredQuantity;
    const availableQuantity = sourceLocation.currentQuantity;
    const quantity = Math.min(availableSpace, requestedQuantity, availableQuantity);
    return {
        taskId,
        taskNumber,
        productId: trigger.productId,
        sku: trigger.sku,
        productName: '', // Would be populated from product service
        sourceLocationId: sourceLocation.locationId,
        sourceLocation,
        destinationLocationId: destinationLocation.locationId,
        destinationLocation,
        quantity,
        unitOfMeasure: destinationLocation.unitOfMeasure,
        priority: trigger.priority,
        status: ReplenishmentTaskStatus.PENDING,
        triggerId: trigger.triggerId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 17. Finds optimal source location for replenishment.
 *
 * @param {ReserveLocation[]} reserveLocations - Available reserve locations
 * @param {string} productId - Product ID needed
 * @param {number} quantity - Quantity needed
 * @returns {ReserveLocation | null} Best source location or null
 *
 * @example
 * ```typescript
 * const source = findOptimalSourceLocation(reserves, 'PROD-001', 150);
 * ```
 */
function findOptimalSourceLocation(reserveLocations, productId, quantity) {
    // Filter to matching product with sufficient quantity
    const candidates = reserveLocations.filter(loc => loc.productId === productId &&
        loc.currentQuantity >= quantity &&
        !loc.isAllocated);
    if (candidates.length === 0) {
        return null;
    }
    // Sort by FEFO (First Expired, First Out) if expiration dates exist
    // Otherwise by received date (FIFO)
    return candidates.sort((a, b) => {
        if (a.expirationDate && b.expirationDate) {
            return a.expirationDate.getTime() - b.expirationDate.getTime();
        }
        return a.receivedDate.getTime() - b.receivedDate.getTime();
    })[0];
}
/**
 * 18. Generates multiple tasks for wave replenishment.
 *
 * @param {PickLocation[]} locations - Pick locations to replenish
 * @param {ReserveLocation[]} reserves - Available reserve locations
 * @param {string} waveId - Wave identifier
 * @returns {ReplenishmentTask[]} Generated tasks
 *
 * @example
 * ```typescript
 * const tasks = generateWaveReplenishmentTasks(pickLocs, reserves, 'WAVE-001');
 * ```
 */
function generateWaveReplenishmentTasks(locations, reserves, waveId) {
    const tasks = [];
    for (const location of locations) {
        if (!location.productId || !location.sku)
            continue;
        const neededQuantity = location.capacity - location.currentQuantity;
        const source = findOptimalSourceLocation(reserves, location.productId, neededQuantity);
        if (source) {
            const trigger = createReplenishmentTrigger({
                triggerType: 'WAVE',
                productId: location.productId,
                sku: location.sku,
                locationId: location.locationId,
                currentQuantity: location.currentQuantity,
                requiredQuantity: neededQuantity,
                priority: ReplenishmentPriority.MEDIUM,
                reason: `Wave replenishment - ${waveId}`,
                metadata: { waveId },
            });
            const task = generateReplenishmentTask(trigger, source, location);
            task.waveId = waveId;
            tasks.push(task);
        }
    }
    return tasks;
}
/**
 * 19. Optimizes task sequence for efficient execution.
 *
 * @param {ReplenishmentTask[]} tasks - Tasks to optimize
 * @returns {ReplenishmentTask[]} Optimized task sequence
 *
 * @example
 * ```typescript
 * const optimized = optimizeTaskSequence(allTasks);
 * ```
 */
function optimizeTaskSequence(tasks) {
    // Sort by priority first, then by location proximity
    return [...tasks].sort((a, b) => {
        // Priority order
        const priorityOrder = {
            [ReplenishmentPriority.CRITICAL]: 0,
            [ReplenishmentPriority.HIGH]: 1,
            [ReplenishmentPriority.MEDIUM]: 2,
            [ReplenishmentPriority.LOW]: 3,
            [ReplenishmentPriority.SCHEDULED]: 4,
        };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Then by zone to minimize travel
        if (a.destinationLocation.zoneId !== b.destinationLocation.zoneId) {
            return a.destinationLocation.zoneId.localeCompare(b.destinationLocation.zoneId);
        }
        // Then by aisle
        return a.destinationLocation.aisle.localeCompare(b.destinationLocation.aisle);
    });
}
/**
 * 20. Calculates estimated task completion time.
 *
 * @param {ReplenishmentTask} task - Replenishment task
 * @returns {number} Estimated duration in minutes
 *
 * @example
 * ```typescript
 * const duration = calculateTaskDuration(task);
 * console.log(`Estimated: ${duration} minutes`);
 * ```
 */
function calculateTaskDuration(task) {
    // Base time for task setup and confirmation
    let duration = 2;
    // Travel time based on unit of measure (proxy for distance/equipment)
    switch (task.unitOfMeasure) {
        case UnitOfMeasure.PALLET:
            duration += 8; // Forklift operation
            break;
        case UnitOfMeasure.CASE:
            duration += 5; // Pallet jack or cart
            break;
        case UnitOfMeasure.EACH:
            duration += 3; // Hand carry
            break;
        default:
            duration += 5;
    }
    // Additional time based on quantity
    const quantityTime = Math.ceil(task.quantity / 50) * 2;
    duration += quantityTime;
    return duration;
}
/**
 * 21. Validates task feasibility before assignment.
 *
 * @param {ReplenishmentTask} task - Task to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTaskFeasibility(task);
 * if (!result.feasible) {
 *   console.error('Issues:', result.issues);
 * }
 * ```
 */
function validateTaskFeasibility(task) {
    const issues = [];
    // Check source has sufficient quantity
    if (task.sourceLocation.currentQuantity < task.quantity) {
        issues.push('Insufficient quantity at source location');
    }
    // Check destination has capacity
    const destinationAvailable = task.destinationLocation.capacity -
        task.destinationLocation.currentQuantity;
    if (destinationAvailable < task.quantity) {
        issues.push('Insufficient capacity at destination location');
    }
    // Check UOM compatibility
    if (task.sourceLocation.unitOfMeasure !== task.destinationLocation.unitOfMeasure) {
        issues.push('Unit of measure mismatch between source and destination');
    }
    // Check if source is allocated to another task
    if (task.sourceLocation.isAllocated) {
        issues.push('Source location is already allocated');
    }
    return {
        feasible: issues.length === 0,
        issues,
    };
}
/**
 * 22. Creates a wave replenishment batch.
 *
 * @param {ReplenishmentTask[]} tasks - Tasks to include in wave
 * @param {string} waveType - Type of wave
 * @returns {WaveReplenishment} Wave replenishment batch
 *
 * @example
 * ```typescript
 * const wave = createReplenishmentWave(tasks, 'SCHEDULED');
 * ```
 */
function createReplenishmentWave(tasks, waveType) {
    const waveId = `WAVE-${crypto.randomUUID()}`;
    const waveNumber = generateWaveNumber();
    const zoneIds = [...new Set(tasks.map(t => t.destinationLocation.zoneId))];
    const totalQuantity = tasks.reduce((sum, t) => sum + t.quantity, 0);
    return {
        waveId,
        waveNumber,
        waveType,
        scheduledStartTime: new Date(),
        zoneIds,
        tasks,
        status: 'PENDING',
        totalQuantity,
        completedQuantity: 0,
    };
}
/**
 * 23. Splits large task into multiple smaller tasks.
 *
 * @param {ReplenishmentTask} task - Large task to split
 * @param {number} maxQuantityPerTask - Maximum quantity per task
 * @returns {ReplenishmentTask[]} Split tasks
 *
 * @example
 * ```typescript
 * const splitTasks = splitReplenishmentTask(largeTask, 100);
 * ```
 */
function splitReplenishmentTask(task, maxQuantityPerTask) {
    if (task.quantity <= maxQuantityPerTask) {
        return [task];
    }
    const taskCount = Math.ceil(task.quantity / maxQuantityPerTask);
    const tasks = [];
    let remainingQuantity = task.quantity;
    for (let i = 0; i < taskCount; i++) {
        const quantity = Math.min(maxQuantityPerTask, remainingQuantity);
        const splitTask = {
            ...task,
            taskId: `TASK-${crypto.randomUUID()}`,
            taskNumber: generateTaskNumber(),
            quantity,
            metadata: {
                ...task.metadata,
                splitFrom: task.taskId,
                splitIndex: i + 1,
                splitTotal: taskCount,
            },
        };
        tasks.push(splitTask);
        remainingQuantity -= quantity;
    }
    return tasks;
}
// ============================================================================
// SECTION 4: TASK EXECUTION (Functions 24-30)
// ============================================================================
/**
 * 24. Assigns replenishment task to a worker.
 *
 * @param {ReplenishmentTask} task - Task to assign
 * @param {string} workerId - Worker ID
 * @returns {ReplenishmentTask} Assigned task
 *
 * @example
 * ```typescript
 * const assigned = assignReplenishmentTask(task, 'WORKER-123');
 * ```
 */
function assignReplenishmentTask(task, workerId) {
    if (task.status !== ReplenishmentTaskStatus.PENDING) {
        throw new Error('Only pending tasks can be assigned');
    }
    return {
        ...task,
        status: ReplenishmentTaskStatus.ASSIGNED,
        assignedTo: workerId,
        assignedAt: new Date(),
        updatedAt: new Date(),
        estimatedDuration: calculateTaskDuration(task),
    };
}
/**
 * 25. Starts execution of an assigned task.
 *
 * @param {ReplenishmentTask} task - Assigned task
 * @returns {ReplenishmentTask} Started task
 *
 * @example
 * ```typescript
 * const started = startReplenishmentTask(task);
 * ```
 */
function startReplenishmentTask(task) {
    if (task.status !== ReplenishmentTaskStatus.ASSIGNED) {
        throw new Error('Only assigned tasks can be started');
    }
    return {
        ...task,
        status: ReplenishmentTaskStatus.IN_PROGRESS,
        startedAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 26. Completes a replenishment task.
 *
 * @param {ReplenishmentTask} task - Task in progress
 * @param {number} actualQuantity - Actual quantity moved
 * @returns {ReplenishmentTask} Completed task
 *
 * @example
 * ```typescript
 * const completed = completeReplenishmentTask(task, 150);
 * ```
 */
function completeReplenishmentTask(task, actualQuantity) {
    if (task.status !== ReplenishmentTaskStatus.IN_PROGRESS) {
        throw new Error('Only in-progress tasks can be completed');
    }
    const completedAt = new Date();
    const actualDuration = task.startedAt
        ? Math.round((completedAt.getTime() - task.startedAt.getTime()) / 60000)
        : undefined;
    return {
        ...task,
        status: ReplenishmentTaskStatus.COMPLETED,
        completedAt,
        actualDuration,
        quantity: actualQuantity || task.quantity,
        updatedAt: new Date(),
    };
}
/**
 * 27. Cancels a replenishment task.
 *
 * @param {ReplenishmentTask} task - Task to cancel
 * @param {string} reason - Cancellation reason
 * @returns {ReplenishmentTask} Cancelled task
 *
 * @example
 * ```typescript
 * const cancelled = cancelReplenishmentTask(task, 'No longer needed');
 * ```
 */
function cancelReplenishmentTask(task, reason) {
    if (task.status === ReplenishmentTaskStatus.COMPLETED) {
        throw new Error('Cannot cancel completed tasks');
    }
    return {
        ...task,
        status: ReplenishmentTaskStatus.CANCELLED,
        notes: `${task.notes ? task.notes + '\n' : ''}CANCELLED: ${reason}`,
        updatedAt: new Date(),
    };
}
/**
 * 28. Updates pick location inventory after replenishment.
 *
 * @param {PickLocation} location - Pick location
 * @param {number} quantityAdded - Quantity added
 * @returns {PickLocation} Updated location
 *
 * @example
 * ```typescript
 * const updated = updatePickLocationInventory(location, 150);
 * ```
 */
function updatePickLocationInventory(location, quantityAdded) {
    const newQuantity = location.currentQuantity + quantityAdded;
    if (newQuantity > location.capacity) {
        throw new Error('Replenishment would exceed location capacity');
    }
    return {
        ...location,
        currentQuantity: newQuantity,
    };
}
/**
 * 29. Updates reserve location inventory after replenishment.
 *
 * @param {ReserveLocation} location - Reserve location
 * @param {number} quantityRemoved - Quantity removed
 * @returns {ReserveLocation} Updated location
 *
 * @example
 * ```typescript
 * const updated = updateReserveLocationInventory(location, 150);
 * ```
 */
function updateReserveLocationInventory(location, quantityRemoved) {
    const newQuantity = location.currentQuantity - quantityRemoved;
    if (newQuantity < 0) {
        throw new Error('Cannot remove more inventory than available');
    }
    return {
        ...location,
        currentQuantity: newQuantity,
        isAllocated: false, // Release allocation after completion
    };
}
/**
 * 30. Validates and processes task completion with inventory updates.
 *
 * @param {ReplenishmentTask} task - Task to complete
 * @param {number} actualQuantity - Actual quantity moved
 * @returns {object} Completion result with inventory updates
 *
 * @example
 * ```typescript
 * const result = processTaskCompletion(task, 150);
 * ```
 */
function processTaskCompletion(task, actualQuantity) {
    const variance = actualQuantity - task.quantity;
    const completedTask = completeReplenishmentTask(task, actualQuantity);
    const sourceUpdate = updateReserveLocationInventory(task.sourceLocation, actualQuantity);
    const destinationUpdate = updatePickLocationInventory(task.destinationLocation, actualQuantity);
    return {
        task: completedTask,
        sourceUpdate,
        destinationUpdate,
        variance,
    };
}
// ============================================================================
// SECTION 5: PERFORMANCE MONITORING (Functions 31-37)
// ============================================================================
/**
 * 31. Calculates replenishment performance metrics for a period.
 *
 * @param {ReplenishmentTask[]} tasks - Tasks in period
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {ReplenishmentMetrics} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateReplenishmentMetrics(tasks, startDate, endDate);
 * ```
 */
function calculateReplenishmentMetrics(tasks, periodStart, periodEnd) {
    const periodTasks = tasks.filter(t => t.createdAt >= periodStart && t.createdAt <= periodEnd);
    const completed = periodTasks.filter(t => t.status === ReplenishmentTaskStatus.COMPLETED);
    const cancelled = periodTasks.filter(t => t.status === ReplenishmentTaskStatus.CANCELLED);
    const totalCompletionTime = completed.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
    const avgCompletionTime = completed.length > 0
        ? totalCompletionTime / completed.length
        : 0;
    const onTimeCompletions = completed.filter(t => !t.estimatedDuration || (t.actualDuration || 0) <= t.estimatedDuration).length;
    const accuracyRate = completed.length > 0
        ? (onTimeCompletions / completed.length) * 100
        : 0;
    return {
        periodStart,
        periodEnd,
        totalTasksCreated: periodTasks.length,
        totalTasksCompleted: completed.length,
        totalTasksCancelled: cancelled.length,
        averageCompletionTime: avgCompletionTime,
        stockoutsAvoided: 0, // Would need additional data
        stockoutsOccurred: 0, // Would need additional data
        serviceLevel: completed.length > 0 ? (completed.length / periodTasks.length) * 100 : 0,
        utilizationRate: 0, // Would need worker availability data
        accuracyRate,
    };
}
/**
 * 32. Analyzes zone-level replenishment performance.
 *
 * @param {ReplenishmentTask[]} tasks - All tasks
 * @param {string} zoneId - Zone to analyze
 * @returns {object} Zone performance analysis
 *
 * @example
 * ```typescript
 * const zonePerf = analyzeZonePerformance(allTasks, 'ZONE-FP-01');
 * ```
 */
function analyzeZonePerformance(tasks, zoneId) {
    const zoneTasks = tasks.filter(t => t.destinationLocation.zoneId === zoneId);
    const completed = zoneTasks.filter(t => t.status === ReplenishmentTaskStatus.COMPLETED);
    const avgCompletionTime = completed.length > 0
        ? completed.reduce((sum, t) => sum + (t.actualDuration || 0), 0) / completed.length
        : 0;
    const priorityBreakdown = zoneTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});
    return {
        zoneId,
        totalTasks: zoneTasks.length,
        completedTasks: completed.length,
        avgCompletionTime,
        priorityBreakdown,
        completionRate: zoneTasks.length > 0 ? (completed.length / zoneTasks.length) * 100 : 0,
    };
}
/**
 * 33. Tracks service level achievement for pick locations.
 *
 * @param {PickLocation[]} locations - Pick locations
 * @param {MinMaxLevel[]} minMaxLevels - Min/max configurations
 * @returns {object} Service level metrics
 *
 * @example
 * ```typescript
 * const serviceLevel = calculateServiceLevel(locations, minMaxConfigs);
 * ```
 */
function calculateServiceLevel(locations, minMaxLevels) {
    let inStock = 0;
    let atRisk = 0;
    let stockedOut = 0;
    const zoneMetrics = {};
    for (const location of locations) {
        const minMax = minMaxLevels.find(mm => mm.locationId === location.locationId);
        if (!minMax)
            continue;
        const isInStock = location.currentQuantity >= minMax.minQuantity;
        const isStockedOut = location.currentQuantity === 0;
        const isAtRisk = location.currentQuantity <= minMax.reorderPoint && !isStockedOut;
        if (isStockedOut)
            stockedOut++;
        else if (isAtRisk)
            atRisk++;
        else if (isInStock)
            inStock++;
        // Track by zone
        if (!zoneMetrics[location.zoneId]) {
            zoneMetrics[location.zoneId] = { inStock: 0, total: 0 };
        }
        zoneMetrics[location.zoneId].total++;
        if (isInStock) {
            zoneMetrics[location.zoneId].inStock++;
        }
    }
    const byZone = {};
    for (const [zoneId, metrics] of Object.entries(zoneMetrics)) {
        byZone[zoneId] = metrics.total > 0 ? (metrics.inStock / metrics.total) * 100 : 0;
    }
    const total = locations.length;
    const overallServiceLevel = total > 0 ? (inStock / total) * 100 : 0;
    return {
        overallServiceLevel,
        locationsInStock: inStock,
        locationsAtRisk: atRisk,
        locationsStockedOut: stockedOut,
        byZone,
    };
}
/**
 * 34. Generates replenishment efficiency report.
 *
 * @param {ReplenishmentTask[]} tasks - Tasks to analyze
 * @returns {object} Efficiency report
 *
 * @example
 * ```typescript
 * const report = generateEfficiencyReport(completedTasks);
 * ```
 */
function generateEfficiencyReport(tasks) {
    const completed = tasks.filter(t => t.status === ReplenishmentTaskStatus.COMPLETED && t.actualDuration);
    const totalDuration = completed.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
    const avgDuration = completed.length > 0 ? totalDuration / completed.length : 0;
    // Estimated vs Actual
    const withEstimates = completed.filter(t => t.estimatedDuration);
    const variances = withEstimates.map(t => (t.actualDuration || 0) - (t.estimatedDuration || 0));
    const avgVariance = variances.length > 0
        ? variances.reduce((sum, v) => sum + v, 0) / variances.length
        : 0;
    const overEstimate = withEstimates.filter(t => (t.actualDuration || 0) < (t.estimatedDuration || 0)).length;
    const underEstimate = withEstimates.length - overEstimate;
    // Productivity
    const totalUnits = completed.reduce((sum, t) => sum + t.quantity, 0);
    const totalHours = totalDuration / 60;
    const unitsPerHour = totalHours > 0 ? totalUnits / totalHours : 0;
    const tasksPerHour = totalHours > 0 ? completed.length / totalHours : 0;
    // By priority
    const priorityPerformance = {};
    for (const priority of Object.values(ReplenishmentPriority)) {
        const priorityTasks = completed.filter(t => t.priority === priority);
        const priorityDuration = priorityTasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
        priorityPerformance[priority] = {
            count: priorityTasks.length,
            avgDuration: priorityTasks.length > 0 ? priorityDuration / priorityTasks.length : 0,
        };
    }
    return {
        totalTasksAnalyzed: completed.length,
        averageTaskDuration: avgDuration,
        estimatedVsActual: {
            averageVariance: avgVariance,
            tasksOverEstimate: overEstimate,
            tasksUnderEstimate: underEstimate,
        },
        productivityMetrics: {
            unitsPerHour,
            tasksPerHour,
        },
        priorityPerformance,
    };
}
/**
 * 35. Identifies replenishment bottlenecks and issues.
 *
 * @param {ReplenishmentTask[]} tasks - Tasks to analyze
 * @param {ZoneReplenishment[]} zones - Zone configurations
 * @returns {object} Bottleneck analysis
 *
 * @example
 * ```typescript
 * const bottlenecks = identifyReplenishmentBottlenecks(tasks, zones);
 * ```
 */
function identifyReplenishmentBottlenecks(tasks, zones) {
    // Find slow zones
    const zoneMetrics = new Map();
    for (const task of tasks) {
        if (task.status === ReplenishmentTaskStatus.COMPLETED && task.actualDuration) {
            const zoneId = task.destinationLocation.zoneId;
            const current = zoneMetrics.get(zoneId) || { totalDuration: 0, count: 0 };
            zoneMetrics.set(zoneId, {
                totalDuration: current.totalDuration + task.actualDuration,
                count: current.count + 1,
            });
        }
    }
    const slowZones = Array.from(zoneMetrics.entries())
        .map(([zoneId, metrics]) => ({
        zoneId,
        avgDuration: metrics.totalDuration / metrics.count,
        taskCount: metrics.count,
    }))
        .sort((a, b) => b.avgDuration - a.avgDuration)
        .slice(0, 5);
    // High cancellation areas
    const zoneCancellations = new Map();
    for (const task of tasks) {
        const zoneId = task.destinationLocation.zoneId;
        const current = zoneCancellations.get(zoneId) || { cancelled: 0, total: 0 };
        zoneCancellations.set(zoneId, {
            cancelled: current.cancelled + (task.status === ReplenishmentTaskStatus.CANCELLED ? 1 : 0),
            total: current.total + 1,
        });
    }
    const highCancellationAreas = Array.from(zoneCancellations.entries())
        .map(([zoneId, metrics]) => ({
        zoneId,
        cancellationRate: (metrics.cancelled / metrics.total) * 100,
    }))
        .filter(z => z.cancellationRate > 10)
        .sort((a, b) => b.cancellationRate - a.cancellationRate);
    // Overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(task => {
        if (task.status !== ReplenishmentTaskStatus.IN_PROGRESS)
            return false;
        if (!task.startedAt || !task.estimatedDuration)
            return false;
        const expectedEnd = new Date(task.startedAt.getTime() + task.estimatedDuration * 60000);
        return now > expectedEnd;
    });
    // Recurring issues (products frequently cancelled or failed)
    const productIssues = new Map();
    for (const task of tasks) {
        if (task.status === ReplenishmentTaskStatus.CANCELLED ||
            task.status === ReplenishmentTaskStatus.FAILED) {
            const count = productIssues.get(task.productId) || 0;
            productIssues.set(task.productId, count + 1);
        }
    }
    const recurringIssues = Array.from(productIssues.entries())
        .map(([productId, issueCount]) => ({ productId, issueCount }))
        .filter(p => p.issueCount >= 3)
        .sort((a, b) => b.issueCount - a.issueCount);
    return {
        slowZones,
        highCancellationAreas,
        overdueTasks,
        recurringIssues,
    };
}
/**
 * 36. Forecasts future replenishment demand.
 *
 * @param {PickLocation[]} locations - Pick locations
 * @param {ReplenishmentTask[]} historicalTasks - Historical task data
 * @param {number} forecastHorizon - Hours to forecast
 * @returns {object} Demand forecast
 *
 * @example
 * ```typescript
 * const forecast = forecastReplenishmentDemand(locations, history, 24);
 * ```
 */
function forecastReplenishmentDemand(locations, historicalTasks, forecastHorizon) {
    // Calculate historical daily averages
    const completedTasks = historicalTasks.filter(t => t.status === ReplenishmentTaskStatus.COMPLETED);
    if (completedTasks.length === 0) {
        return {
            forecastHorizon,
            estimatedTaskCount: 0,
            estimatedTotalQuantity: 0,
            byZone: {},
            byPriority: {},
        };
    }
    const tasksPerDay = completedTasks.length / 30; // Assuming 30 days of history
    const quantityPerDay = completedTasks.reduce((sum, t) => sum + t.quantity, 0) / 30;
    const forecastDays = forecastHorizon / 24;
    const estimatedTaskCount = Math.ceil(tasksPerDay * forecastDays);
    const estimatedTotalQuantity = Math.ceil(quantityPerDay * forecastDays);
    // Forecast by zone
    const zoneMetrics = new Map();
    for (const task of completedTasks) {
        const zoneId = task.destinationLocation.zoneId;
        const current = zoneMetrics.get(zoneId) || { tasks: 0, quantity: 0 };
        zoneMetrics.set(zoneId, {
            tasks: current.tasks + 1,
            quantity: current.quantity + task.quantity,
        });
    }
    const byZone = {};
    for (const [zoneId, metrics] of zoneMetrics.entries()) {
        byZone[zoneId] = {
            taskCount: Math.ceil((metrics.tasks / 30) * forecastDays),
            totalQuantity: Math.ceil((metrics.quantity / 30) * forecastDays),
        };
    }
    // Forecast by priority
    const priorityDist = completedTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});
    const byPriority = {};
    for (const [priority, count] of Object.entries(priorityDist)) {
        byPriority[priority] =
            Math.ceil((count / 30) * forecastDays);
    }
    return {
        forecastHorizon,
        estimatedTaskCount,
        estimatedTotalQuantity,
        byZone,
        byPriority,
    };
}
/**
 * 37. Exports replenishment data to CSV format.
 *
 * @param {ReplenishmentTask[]} tasks - Tasks to export
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportReplenishmentToCSV(tasks);
 * fs.writeFileSync('replenishment-report.csv', csv);
 * ```
 */
function exportReplenishmentToCSV(tasks) {
    const headers = [
        'Task ID',
        'Task Number',
        'Product ID',
        'SKU',
        'Source Location',
        'Destination Location',
        'Zone',
        'Quantity',
        'UOM',
        'Priority',
        'Status',
        'Assigned To',
        'Created At',
        'Completed At',
        'Estimated Duration (min)',
        'Actual Duration (min)',
    ];
    let csv = headers.join(',') + '\n';
    for (const task of tasks) {
        const row = [
            task.taskId,
            task.taskNumber,
            task.productId,
            task.sku,
            task.sourceLocation.locationCode,
            task.destinationLocation.locationCode,
            task.destinationLocation.zoneId,
            task.quantity.toString(),
            task.unitOfMeasure,
            task.priority,
            task.status,
            task.assignedTo || '',
            task.createdAt.toISOString(),
            task.completedAt?.toISOString() || '',
            task.estimatedDuration?.toString() || '',
            task.actualDuration?.toString() || '',
        ];
        csv += row.map(field => `"${field}"`).join(',') + '\n';
    }
    return csv;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique task number.
 */
function generateTaskNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-6);
    return `REPL-${dateStr}-${timeStr}`;
}
/**
 * Helper: Generates unique wave number.
 */
function generateWaveNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-4);
    return `WAVE-${dateStr}-${timeStr}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Rule Configuration
    createReplenishmentRule,
    createMinMaxLevel,
    updateReplenishmentRule,
    validateReplenishmentRule,
    calculateOptimalMinMax,
    createZoneReplenishment,
    applyReplenishmentRules,
    // Trigger Evaluation
    checkMinMaxTrigger,
    createReplenishmentTrigger,
    evaluateDemandTrigger,
    evaluateTimeTrigger,
    checkStockoutCondition,
    evaluateWaveTrigger,
    calculateReplenishmentPriority,
    batchReplenishmentTriggers,
    // Task Generation
    generateReplenishmentTask,
    findOptimalSourceLocation,
    generateWaveReplenishmentTasks,
    optimizeTaskSequence,
    calculateTaskDuration,
    validateTaskFeasibility,
    createReplenishmentWave,
    splitReplenishmentTask,
    // Task Execution
    assignReplenishmentTask,
    startReplenishmentTask,
    completeReplenishmentTask,
    cancelReplenishmentTask,
    updatePickLocationInventory,
    updateReserveLocationInventory,
    processTaskCompletion,
    // Performance Monitoring
    calculateReplenishmentMetrics,
    analyzeZonePerformance,
    calculateServiceLevel,
    generateEfficiencyReport,
    identifyReplenishmentBottlenecks,
    forecastReplenishmentDemand,
    exportReplenishmentToCSV,
};
//# sourceMappingURL=warehouse-replenishment-kit.js.map