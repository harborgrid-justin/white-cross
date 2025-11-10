"use strict";
/**
 * LOC: INV-CYC-001
 * File: /reuse/logistics/inventory-cycle-count-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Inventory controllers
 *   - Warehouse services
 *   - Cycle count schedulers
 *   - Variance resolution workflows
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
exports.VarianceAction = exports.CountType = exports.CountStatus = exports.CountFrequency = exports.ABCClassification = void 0;
exports.performABCAnalysis = performABCAnalysis;
exports.createCycleCountSchedule = createCycleCountSchedule;
exports.generateCountFrequencies = generateCountFrequencies;
exports.calculateNextCountDate = calculateNextCountDate;
exports.generateCountCalendar = generateCountCalendar;
exports.getItemsDueForCount = getItemsDueForCount;
exports.balanceCountWorkload = balanceCountWorkload;
exports.updateScheduleProgress = updateScheduleProgress;
exports.createCountPlan = createCountPlan;
exports.generateCountPlanFromSchedule = generateCountPlanFromSchedule;
exports.assignCountPlan = assignCountPlan;
exports.splitCountPlanToSheets = splitCountPlanToSheets;
exports.optimizeCountRoute = optimizeCountRoute;
exports.validateCountPlan = validateCountPlan;
exports.generateCountPlanSummary = generateCountPlanSummary;
exports.cancelCountPlan = cancelCountPlan;
exports.startCountSheet = startCountSheet;
exports.recordCount = recordCount;
exports.validateBlindCount = validateBlindCount;
exports.updateCountSheetProgress = updateCountSheetProgress;
exports.completeCountSheet = completeCountSheet;
exports.addCountPhotos = addCountPhotos;
exports.flagForRecount = flagForRecount;
exports.calculateCountProgress = calculateCountProgress;
exports.identifyVariances = identifyVariances;
exports.applyVarianceThreshold = applyVarianceThreshold;
exports.categorizeVarianceSeverity = categorizeVarianceSeverity;
exports.generateVarianceInvestigationReport = generateVarianceInvestigationReport;
exports.approveVariance = approveVariance;
exports.rejectVariance = rejectVariance;
exports.createInventoryAdjustment = createInventoryAdjustment;
exports.calculateVarianceImpact = calculateVarianceImpact;
exports.calculateCountAccuracyMetrics = calculateCountAccuracyMetrics;
exports.calculateCounterPerformance = calculateCounterPerformance;
exports.generateAccuracyTrend = generateAccuracyTrend;
exports.identifyTopVarianceItems = identifyTopVarianceItems;
exports.calculateInventoryRecordAccuracy = calculateInventoryRecordAccuracy;
exports.generateVarianceHeatmap = generateVarianceHeatmap;
exports.exportCountResultsToCSV = exportCountResultsToCSV;
exports.generateCycleCountDashboard = generateCycleCountDashboard;
/**
 * File: /reuse/logistics/inventory-cycle-count-kit.ts
 * Locator: WC-LOGISTICS-INV-CYC-001
 * Purpose: Comprehensive Inventory Cycle Count & Physical Inventory Management
 *
 * Upstream: Independent utility module for cycle counting and physical inventory operations
 * Downstream: ../backend/logistics/*, Inventory modules, Warehouse management, Count schedulers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for cycle counts, ABC analysis, count plans, variance resolution, accuracy metrics
 *
 * LLM Context: Enterprise-grade cycle counting utilities for logistics/warehouse operations to compete with Oracle JDE.
 * Provides comprehensive ABC classification, count schedule generation, count plan creation, count execution tracking,
 * variance analysis and resolution, accuracy metrics calculation, blind counting support, multi-location counting,
 * adjustments workflow, and real-time inventory reconciliation.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * ABC classification for inventory items
 */
var ABCClassification;
(function (ABCClassification) {
    ABCClassification["A"] = "A";
    ABCClassification["B"] = "B";
    ABCClassification["C"] = "C";
})(ABCClassification || (exports.ABCClassification = ABCClassification = {}));
/**
 * Count frequency based on ABC classification
 */
var CountFrequency;
(function (CountFrequency) {
    CountFrequency["DAILY"] = "DAILY";
    CountFrequency["WEEKLY"] = "WEEKLY";
    CountFrequency["MONTHLY"] = "MONTHLY";
    CountFrequency["QUARTERLY"] = "QUARTERLY";
    CountFrequency["SEMI_ANNUAL"] = "SEMI_ANNUAL";
    CountFrequency["ANNUAL"] = "ANNUAL";
})(CountFrequency || (exports.CountFrequency = CountFrequency = {}));
/**
 * Count status enumeration
 */
var CountStatus;
(function (CountStatus) {
    CountStatus["SCHEDULED"] = "SCHEDULED";
    CountStatus["IN_PROGRESS"] = "IN_PROGRESS";
    CountStatus["COMPLETED"] = "COMPLETED";
    CountStatus["CANCELLED"] = "CANCELLED";
    CountStatus["RECOUNT_REQUIRED"] = "RECOUNT_REQUIRED";
    CountStatus["APPROVED"] = "APPROVED";
    CountStatus["REJECTED"] = "REJECTED";
})(CountStatus || (exports.CountStatus = CountStatus = {}));
/**
 * Count type enumeration
 */
var CountType;
(function (CountType) {
    CountType["CYCLE_COUNT"] = "CYCLE_COUNT";
    CountType["PHYSICAL_INVENTORY"] = "PHYSICAL_INVENTORY";
    CountType["SPOT_CHECK"] = "SPOT_CHECK";
    CountType["WALL_TO_WALL"] = "WALL_TO_WALL";
    CountType["RECOUNT"] = "RECOUNT";
})(CountType || (exports.CountType = CountType = {}));
/**
 * Variance resolution action
 */
var VarianceAction;
(function (VarianceAction) {
    VarianceAction["ACCEPT"] = "ACCEPT";
    VarianceAction["REJECT"] = "REJECT";
    VarianceAction["RECOUNT"] = "RECOUNT";
    VarianceAction["INVESTIGATE"] = "INVESTIGATE";
    VarianceAction["ADJUST"] = "ADJUST";
})(VarianceAction || (exports.VarianceAction = VarianceAction = {}));
// ============================================================================
// SECTION 1: COUNT SCHEDULE MANAGEMENT (Functions 1-8)
// ============================================================================
/**
 * 1. Performs ABC analysis on inventory items.
 *
 * @param {ABCAnalysisCriteria} criteria - Analysis criteria
 * @returns {InventoryItem[]} Items with ABC classification
 *
 * @example
 * ```typescript
 * const classified = performABCAnalysis({
 *   items: inventoryItems,
 *   valueThresholds: { classA: 0.80, classB: 0.15, classC: 0.05 }
 * });
 * ```
 */
function performABCAnalysis(criteria) {
    // Sort items by total value (descending)
    const sortedItems = [...criteria.items].sort((a, b) => b.totalValue - a.totalValue);
    const totalValue = sortedItems.reduce((sum, item) => sum + item.totalValue, 0);
    let cumulativeValue = 0;
    let cumulativePercentage = 0;
    return sortedItems.map((item, index) => {
        cumulativeValue += item.totalValue;
        cumulativePercentage = cumulativeValue / totalValue;
        let classification;
        if (cumulativePercentage <= criteria.valueThresholds.classA) {
            classification = ABCClassification.A;
        }
        else if (cumulativePercentage <= criteria.valueThresholds.classA + criteria.valueThresholds.classB) {
            classification = ABCClassification.B;
        }
        else {
            classification = ABCClassification.C;
        }
        return {
            ...item,
            abcClassification: classification,
        };
    });
}
/**
 * 2. Creates cycle count schedule based on ABC classification.
 *
 * @param {string} warehouseId - Warehouse ID
 * @param {ABCClassification} classification - ABC class
 * @param {CountFrequency} frequency - Count frequency
 * @param {number} itemCount - Number of items in class
 * @returns {CycleCountSchedule} Count schedule
 *
 * @example
 * ```typescript
 * const schedule = createCycleCountSchedule('WH-001', ABCClassification.A, CountFrequency.WEEKLY, 50);
 * ```
 */
function createCycleCountSchedule(warehouseId, classification, frequency, itemCount) {
    const daysPerCount = getFrequencyDays(frequency);
    const itemsPerDay = Math.ceil(itemCount / daysPerCount);
    return {
        scheduleId: `SCH-${crypto.randomUUID()}`,
        warehouseId,
        abcClassification: classification,
        frequency,
        itemCount,
        daysPerCount,
        itemsPerDay,
        startDate: new Date(),
        isActive: true,
        createdAt: new Date(),
    };
}
/**
 * 3. Generates recommended count frequencies by ABC class.
 *
 * @param {InventoryItem[]} items - Inventory items with ABC classification
 * @returns {Record<ABCClassification, CountFrequency>} Recommended frequencies
 *
 * @example
 * ```typescript
 * const frequencies = generateCountFrequencies(classifiedItems);
 * // Returns: { A: 'WEEKLY', B: 'MONTHLY', C: 'QUARTERLY' }
 * ```
 */
function generateCountFrequencies(items) {
    const classCounts = {
        [ABCClassification.A]: 0,
        [ABCClassification.B]: 0,
        [ABCClassification.C]: 0,
    };
    items.forEach(item => {
        classCounts[item.abcClassification]++;
    });
    // Standard recommendations
    return {
        [ABCClassification.A]: CountFrequency.WEEKLY,
        [ABCClassification.B]: CountFrequency.MONTHLY,
        [ABCClassification.C]: CountFrequency.QUARTERLY,
    };
}
/**
 * 4. Calculates next count date for an item.
 *
 * @param {InventoryItem} item - Inventory item
 * @param {CountFrequency} frequency - Count frequency
 * @returns {Date} Next count date
 *
 * @example
 * ```typescript
 * const nextDate = calculateNextCountDate(item, CountFrequency.WEEKLY);
 * ```
 */
function calculateNextCountDate(item, frequency) {
    const lastCount = item.lastCountDate || new Date();
    const daysToAdd = getFrequencyDays(frequency);
    const nextDate = new Date(lastCount);
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate;
}
/**
 * 5. Generates annual count calendar.
 *
 * @param {CycleCountSchedule[]} schedules - Count schedules
 * @param {number} year - Calendar year
 * @returns {Array} Count calendar entries
 *
 * @example
 * ```typescript
 * const calendar = generateCountCalendar(schedules, 2024);
 * ```
 */
function generateCountCalendar(schedules, year) {
    const calendar = [];
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    for (const schedule of schedules) {
        if (!schedule.isActive)
            continue;
        let currentDate = new Date(Math.max(schedule.startDate.getTime(), yearStart.getTime()));
        const frequencyDays = getFrequencyDays(schedule.frequency);
        while (currentDate <= yearEnd) {
            calendar.push({
                date: new Date(currentDate),
                warehouseId: schedule.warehouseId,
                abcClassification: schedule.abcClassification,
                estimatedItems: schedule.itemsPerDay,
            });
            currentDate.setDate(currentDate.getDate() + frequencyDays);
        }
    }
    return calendar.sort((a, b) => a.date.getTime() - b.date.getTime());
}
/**
 * 6. Identifies items due for counting.
 *
 * @param {InventoryItem[]} items - Inventory items
 * @param {Record<ABCClassification, CountFrequency>} frequencies - Count frequencies
 * @param {Date} asOfDate - Date to check
 * @returns {InventoryItem[]} Items due for count
 *
 * @example
 * ```typescript
 * const dueItems = getItemsDueForCount(inventory, frequencies, new Date());
 * ```
 */
function getItemsDueForCount(items, frequencies, asOfDate = new Date()) {
    return items.filter(item => {
        if (!item.lastCountDate)
            return true; // Never counted
        const frequency = frequencies[item.abcClassification];
        const nextCountDate = calculateNextCountDate(item, frequency);
        return nextCountDate <= asOfDate;
    });
}
/**
 * 7. Optimizes count schedule to balance workload.
 *
 * @param {InventoryItem[]} items - Items to schedule
 * @param {number} workDays - Number of work days available
 * @returns {Array} Daily count assignments
 *
 * @example
 * ```typescript
 * const balanced = balanceCountWorkload(dueItems, 5);
 * ```
 */
function balanceCountWorkload(items, workDays) {
    const itemsPerDay = Math.ceil(items.length / workDays);
    const assignments = [];
    // Sort by ABC class (count A items first)
    const sortedItems = [...items].sort((a, b) => {
        const order = { A: 1, B: 2, C: 3 };
        return order[a.abcClassification] - order[b.abcClassification];
    });
    for (let day = 0; day < workDays; day++) {
        const start = day * itemsPerDay;
        const end = Math.min(start + itemsPerDay, sortedItems.length);
        const dayItems = sortedItems.slice(start, end);
        assignments.push({
            day: day + 1,
            items: dayItems,
            totalValue: dayItems.reduce((sum, item) => sum + item.totalValue, 0),
            estimatedTime: dayItems.length * 5, // 5 minutes per item estimate
        });
    }
    return assignments;
}
/**
 * 8. Updates schedule after count completion.
 *
 * @param {CycleCountSchedule} schedule - Count schedule
 * @param {number} itemsCounted - Items actually counted
 * @returns {CycleCountSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = updateScheduleProgress(schedule, 15);
 * ```
 */
function updateScheduleProgress(schedule, itemsCounted) {
    return {
        ...schedule,
        metadata: {
            ...schedule.metadata,
            lastCountDate: new Date(),
            totalItemsCounted: (schedule.metadata?.totalItemsCounted || 0) + itemsCounted,
            countCompletions: (schedule.metadata?.countCompletions || 0) + 1,
        },
    };
}
// ============================================================================
// SECTION 2: COUNT PLAN GENERATION (Functions 9-16)
// ============================================================================
/**
 * 9. Creates a cycle count plan.
 *
 * @param {string} warehouseId - Warehouse ID
 * @param {CountType} countType - Type of count
 * @param {InventoryItem[]} items - Items to count
 * @param {Date} scheduledDate - Scheduled date
 * @returns {CountPlan} Count plan
 *
 * @example
 * ```typescript
 * const plan = createCountPlan('WH-001', CountType.CYCLE_COUNT, dueItems, new Date());
 * ```
 */
function createCountPlan(warehouseId, countType, items, scheduledDate) {
    const planItems = items.map((item, index) => ({
        planItemId: crypto.randomUUID(),
        itemId: item.itemId,
        sku: item.sku,
        description: item.description,
        locationId: item.locationId,
        binLocation: item.binLocation,
        expectedQuantity: item.currentQuantity,
        unitOfMeasure: item.unitOfMeasure,
        abcClassification: item.abcClassification,
        isBlindCount: item.abcClassification === ABCClassification.A, // Blind count for high-value items
        priority: item.abcClassification === ABCClassification.A ? 1 :
            item.abcClassification === ABCClassification.B ? 2 : 3,
    }));
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    const estimatedDuration = items.length * 5; // 5 minutes per item
    return {
        planId: `PLAN-${crypto.randomUUID()}`,
        warehouseId,
        countType,
        scheduledDate,
        items: planItems,
        status: CountStatus.SCHEDULED,
        totalItems: items.length,
        totalValue,
        estimatedDuration,
        createdAt: new Date(),
    };
}
/**
 * 10. Generates count plan from schedule.
 *
 * @param {CycleCountSchedule} schedule - Count schedule
 * @param {InventoryItem[]} availableItems - Available items
 * @param {Date} date - Plan date
 * @returns {CountPlan} Generated count plan
 *
 * @example
 * ```typescript
 * const plan = generateCountPlanFromSchedule(schedule, inventory, new Date());
 * ```
 */
function generateCountPlanFromSchedule(schedule, availableItems, date) {
    // Filter items by ABC class and warehouse
    const eligibleItems = availableItems.filter(item => item.abcClassification === schedule.abcClassification &&
        item.warehouseId === schedule.warehouseId);
    // Take itemsPerDay from schedule
    const itemsToCount = eligibleItems.slice(0, schedule.itemsPerDay);
    return createCountPlan(schedule.warehouseId, CountType.CYCLE_COUNT, itemsToCount, date);
}
/**
 * 11. Assigns count plan to counter.
 *
 * @param {CountPlan} plan - Count plan
 * @param {string} counterId - Counter user ID
 * @returns {CountPlan} Assigned plan
 *
 * @example
 * ```typescript
 * const assigned = assignCountPlan(plan, 'USER-123');
 * ```
 */
function assignCountPlan(plan, counterId) {
    return {
        ...plan,
        assignedTo: counterId,
        metadata: {
            ...plan.metadata,
            assignedAt: new Date(),
        },
    };
}
/**
 * 12. Splits count plan into multiple count sheets.
 *
 * @param {CountPlan} plan - Count plan
 * @param {number} sheetsCount - Number of sheets to create
 * @returns {CountSheet[]} Count sheets
 *
 * @example
 * ```typescript
 * const sheets = splitCountPlanToSheets(plan, 3);
 * ```
 */
function splitCountPlanToSheets(plan, sheetsCount) {
    const itemsPerSheet = Math.ceil(plan.items.length / sheetsCount);
    const sheets = [];
    for (let i = 0; i < sheetsCount; i++) {
        const start = i * itemsPerSheet;
        const end = Math.min(start + itemsPerSheet, plan.items.length);
        const sheetItems = plan.items.slice(start, end);
        const tasks = sheetItems.map(item => ({
            taskId: crypto.randomUUID(),
            sheetId: '', // Will be set below
            itemId: item.itemId,
            sku: item.sku,
            description: item.description,
            locationId: item.locationId,
            binLocation: item.binLocation,
            expectedQuantity: item.isBlindCount ? undefined : item.expectedQuantity,
            unitOfMeasure: item.unitOfMeasure,
            isBlindCount: item.isBlindCount,
            status: CountStatus.SCHEDULED,
        }));
        const sheetId = `SHEET-${crypto.randomUUID()}`;
        tasks.forEach(task => task.sheetId = sheetId);
        sheets.push({
            sheetId,
            planId: plan.planId,
            warehouseId: plan.warehouseId,
            assignedTo: plan.assignedTo || '',
            countType: plan.countType,
            scheduledDate: plan.scheduledDate,
            tasks,
            status: CountStatus.SCHEDULED,
            totalTasks: tasks.length,
            completedTasks: 0,
            createdAt: new Date(),
        });
    }
    return sheets;
}
/**
 * 13. Optimizes count route by location.
 *
 * @param {CountPlanItem[]} items - Items to count
 * @returns {CountPlanItem[]} Optimized route
 *
 * @example
 * ```typescript
 * const optimized = optimizeCountRoute(planItems);
 * ```
 */
function optimizeCountRoute(items) {
    // Sort by location, then bin location
    return [...items].sort((a, b) => {
        const locCompare = a.locationId.localeCompare(b.locationId);
        if (locCompare !== 0)
            return locCompare;
        const binA = a.binLocation || '';
        const binB = b.binLocation || '';
        return binA.localeCompare(binB);
    });
}
/**
 * 14. Validates count plan for completeness.
 *
 * @param {CountPlan} plan - Count plan to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCountPlan(plan);
 * if (!result.valid) console.error(result.errors);
 * ```
 */
function validateCountPlan(plan) {
    const errors = [];
    const warnings = [];
    if (!plan.items || plan.items.length === 0) {
        errors.push('Count plan must contain at least one item');
    }
    if (plan.totalItems !== plan.items.length) {
        errors.push('Total items count mismatch');
    }
    if (!plan.warehouseId) {
        errors.push('Warehouse ID is required');
    }
    if (!plan.scheduledDate) {
        errors.push('Scheduled date is required');
    }
    if (plan.scheduledDate < new Date() && plan.status === CountStatus.SCHEDULED) {
        warnings.push('Scheduled date is in the past');
    }
    // Check for duplicate items
    const skuSet = new Set();
    plan.items.forEach(item => {
        if (skuSet.has(item.sku)) {
            warnings.push(`Duplicate SKU found: ${item.sku}`);
        }
        skuSet.add(item.sku);
    });
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * 15. Generates count plan summary report.
 *
 * @param {CountPlan} plan - Count plan
 * @returns {object} Summary report
 *
 * @example
 * ```typescript
 * const summary = generateCountPlanSummary(plan);
 * ```
 */
function generateCountPlanSummary(plan) {
    const byABCClass = {
        [ABCClassification.A]: 0,
        [ABCClassification.B]: 0,
        [ABCClassification.C]: 0,
    };
    const byLocation = {};
    let blindCountItems = 0;
    plan.items.forEach(item => {
        byABCClass[item.abcClassification]++;
        byLocation[item.locationId] = (byLocation[item.locationId] || 0) + 1;
        if (item.isBlindCount)
            blindCountItems++;
    });
    return {
        planId: plan.planId,
        warehouseId: plan.warehouseId,
        countType: plan.countType,
        scheduledDate: plan.scheduledDate,
        totalItems: plan.totalItems,
        totalValue: plan.totalValue,
        byABCClass,
        byLocation,
        blindCountItems,
        estimatedDuration: plan.estimatedDuration,
    };
}
/**
 * 16. Cancels count plan.
 *
 * @param {CountPlan} plan - Count plan to cancel
 * @param {string} reason - Cancellation reason
 * @returns {CountPlan} Cancelled plan
 *
 * @example
 * ```typescript
 * const cancelled = cancelCountPlan(plan, 'Warehouse closed for maintenance');
 * ```
 */
function cancelCountPlan(plan, reason) {
    return {
        ...plan,
        status: CountStatus.CANCELLED,
        metadata: {
            ...plan.metadata,
            cancelledAt: new Date(),
            cancellationReason: reason,
        },
    };
}
// ============================================================================
// SECTION 3: COUNT EXECUTION (Functions 17-24)
// ============================================================================
/**
 * 17. Starts count sheet execution.
 *
 * @param {CountSheet} sheet - Count sheet
 * @param {string} counterId - Counter user ID
 * @returns {CountSheet} Started sheet
 *
 * @example
 * ```typescript
 * const started = startCountSheet(sheet, 'USER-123');
 * ```
 */
function startCountSheet(sheet, counterId) {
    return {
        ...sheet,
        assignedTo: counterId,
        status: CountStatus.IN_PROGRESS,
        startedAt: new Date(),
    };
}
/**
 * 18. Records count for a task.
 *
 * @param {CountTask} task - Count task
 * @param {number} countedQuantity - Counted quantity
 * @param {string} counterId - Counter user ID
 * @param {string} notes - Optional notes
 * @returns {CountTask} Updated task
 *
 * @example
 * ```typescript
 * const updated = recordCount(task, 47, 'USER-123', 'Found extra items in bin');
 * ```
 */
function recordCount(task, countedQuantity, counterId, notes) {
    return {
        ...task,
        countedQuantity,
        countedBy: counterId,
        countedAt: new Date(),
        status: CountStatus.COMPLETED,
        notes,
    };
}
/**
 * 19. Performs blind count validation.
 *
 * @param {CountTask} task - Blind count task
 * @param {number} expectedQuantity - Expected quantity (revealed after count)
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateBlindCount(task, 50);
 * ```
 */
function validateBlindCount(task, expectedQuantity) {
    if (!task.isBlindCount || task.countedQuantity === undefined) {
        throw new Error('Task must be a completed blind count');
    }
    const variance = task.countedQuantity - expectedQuantity;
    const variancePercentage = expectedQuantity === 0 ? 100 :
        Math.abs(variance / expectedQuantity) * 100;
    return {
        isMatch: variance === 0,
        variance,
        variancePercentage,
        requiresRecount: variancePercentage > 5, // 5% threshold
    };
}
/**
 * 20. Updates count sheet progress.
 *
 * @param {CountSheet} sheet - Count sheet
 * @param {CountTask} updatedTask - Updated task
 * @returns {CountSheet} Updated sheet
 *
 * @example
 * ```typescript
 * const updated = updateCountSheetProgress(sheet, completedTask);
 * ```
 */
function updateCountSheetProgress(sheet, updatedTask) {
    const tasks = sheet.tasks.map(t => t.taskId === updatedTask.taskId ? updatedTask : t);
    const completedTasks = tasks.filter(t => t.status === CountStatus.COMPLETED).length;
    const allCompleted = completedTasks === tasks.length;
    return {
        ...sheet,
        tasks,
        completedTasks,
        status: allCompleted ? CountStatus.COMPLETED : CountStatus.IN_PROGRESS,
        completedAt: allCompleted ? new Date() : undefined,
    };
}
/**
 * 21. Completes count sheet.
 *
 * @param {CountSheet} sheet - Count sheet to complete
 * @returns {CountSheet} Completed sheet
 *
 * @example
 * ```typescript
 * const completed = completeCountSheet(sheet);
 * ```
 */
function completeCountSheet(sheet) {
    const incompleteTasks = sheet.tasks.filter(t => t.status !== CountStatus.COMPLETED);
    if (incompleteTasks.length > 0) {
        throw new Error(`Cannot complete sheet: ${incompleteTasks.length} tasks remaining`);
    }
    return {
        ...sheet,
        status: CountStatus.COMPLETED,
        completedAt: new Date(),
    };
}
/**
 * 22. Adds photo evidence to count task.
 *
 * @param {CountTask} task - Count task
 * @param {string[]} photoUrls - Photo URLs
 * @returns {CountTask} Updated task
 *
 * @example
 * ```typescript
 * const updated = addCountPhotos(task, ['https://photos.example.com/count1.jpg']);
 * ```
 */
function addCountPhotos(task, photoUrls) {
    return {
        ...task,
        photoUrls: [...(task.photoUrls || []), ...photoUrls],
    };
}
/**
 * 23. Flags count task for recount.
 *
 * @param {CountTask} task - Count task
 * @param {string} reason - Recount reason
 * @returns {CountTask} Flagged task
 *
 * @example
 * ```typescript
 * const flagged = flagForRecount(task, 'Large variance detected');
 * ```
 */
function flagForRecount(task, reason) {
    return {
        ...task,
        status: CountStatus.RECOUNT_REQUIRED,
        metadata: {
            ...task.metadata,
            recountReason: reason,
            recountFlaggedAt: new Date(),
        },
    };
}
/**
 * 24. Calculates count sheet completion percentage.
 *
 * @param {CountSheet} sheet - Count sheet
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const progress = calculateCountProgress(sheet);
 * // Returns: 75.5
 * ```
 */
function calculateCountProgress(sheet) {
    if (sheet.totalTasks === 0)
        return 0;
    return (sheet.completedTasks / sheet.totalTasks) * 100;
}
// ============================================================================
// SECTION 4: VARIANCE ANALYSIS (Functions 25-32)
// ============================================================================
/**
 * 25. Identifies variances from count results.
 *
 * @param {CountTask[]} tasks - Completed count tasks
 * @param {InventoryItem[]} inventory - Current inventory
 * @returns {CountVariance[]} Identified variances
 *
 * @example
 * ```typescript
 * const variances = identifyVariances(completedTasks, inventory);
 * ```
 */
function identifyVariances(tasks, inventory) {
    const variances = [];
    for (const task of tasks) {
        if (task.countedQuantity === undefined)
            continue;
        const item = inventory.find(i => i.itemId === task.itemId);
        if (!item)
            continue;
        const expectedQuantity = task.expectedQuantity ?? item.currentQuantity;
        const variance = task.countedQuantity - expectedQuantity;
        if (variance !== 0) {
            const variancePercentage = expectedQuantity === 0 ? 100 :
                (Math.abs(variance) / expectedQuantity) * 100;
            variances.push({
                varianceId: `VAR-${crypto.randomUUID()}`,
                countTaskId: task.taskId,
                itemId: task.itemId,
                sku: task.sku,
                locationId: task.locationId,
                expectedQuantity,
                countedQuantity: task.countedQuantity,
                varianceQuantity: variance,
                variancePercentage,
                unitCost: item.unitCost,
                varianceValue: variance * item.unitCost,
                action: VarianceAction.INVESTIGATE,
                status: CountStatus.IN_PROGRESS,
                createdAt: new Date(),
            });
        }
    }
    return variances;
}
/**
 * 26. Applies variance threshold rules.
 *
 * @param {CountVariance} variance - Variance to evaluate
 * @param {VarianceThreshold} threshold - Threshold configuration
 * @returns {object} Threshold evaluation
 *
 * @example
 * ```typescript
 * const result = applyVarianceThreshold(variance, thresholdConfig);
 * ```
 */
function applyVarianceThreshold(variance, threshold) {
    let exceedsThreshold = false;
    if (threshold.quantityThreshold &&
        Math.abs(variance.varianceQuantity) > threshold.quantityThreshold) {
        exceedsThreshold = true;
    }
    if (threshold.percentageThreshold &&
        variance.variancePercentage > threshold.percentageThreshold) {
        exceedsThreshold = true;
    }
    if (threshold.valueThreshold &&
        Math.abs(variance.varianceValue) > threshold.valueThreshold) {
        exceedsThreshold = true;
    }
    const autoApprove = !exceedsThreshold && threshold.autoApproveBelow === true;
    const requiresRecount = exceedsThreshold && threshold.requireRecountAbove === true;
    let recommendedAction;
    if (autoApprove) {
        recommendedAction = VarianceAction.ACCEPT;
    }
    else if (requiresRecount) {
        recommendedAction = VarianceAction.RECOUNT;
    }
    else {
        recommendedAction = VarianceAction.INVESTIGATE;
    }
    return {
        exceedsThreshold,
        autoApprove,
        requiresRecount,
        recommendedAction,
    };
}
/**
 * 27. Categorizes variance by severity.
 *
 * @param {CountVariance} variance - Variance to categorize
 * @returns {string} Severity level
 *
 * @example
 * ```typescript
 * const severity = categorizeVarianceSeverity(variance);
 * // Returns: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
 * ```
 */
function categorizeVarianceSeverity(variance) {
    const absValue = Math.abs(variance.varianceValue);
    const percentage = variance.variancePercentage;
    if (absValue >= 10000 || percentage >= 25) {
        return 'CRITICAL';
    }
    else if (absValue >= 5000 || percentage >= 15) {
        return 'HIGH';
    }
    else if (absValue >= 1000 || percentage >= 10) {
        return 'MEDIUM';
    }
    else {
        return 'LOW';
    }
}
/**
 * 28. Generates variance investigation report.
 *
 * @param {CountVariance} variance - Variance to investigate
 * @param {InventoryItem} item - Inventory item
 * @returns {object} Investigation report
 *
 * @example
 * ```typescript
 * const report = generateVarianceInvestigationReport(variance, item);
 * ```
 */
function generateVarianceInvestigationReport(variance, item) {
    const severity = categorizeVarianceSeverity(variance);
    const daysSinceLastCount = item.lastCountDate ?
        Math.floor((Date.now() - item.lastCountDate.getTime()) / (1000 * 60 * 60 * 24)) : undefined;
    const recommendations = [];
    if (severity === 'CRITICAL' || severity === 'HIGH') {
        recommendations.push('Immediate recount required');
        recommendations.push('Review recent transactions');
        recommendations.push('Check for theft or damage');
    }
    if (variance.variancePercentage > 20) {
        recommendations.push('Review bin location accuracy');
        recommendations.push('Verify item master data');
    }
    return {
        varianceId: variance.varianceId,
        severity,
        itemDetails: {
            sku: item.sku,
            description: item.description,
            abcClassification: item.abcClassification,
            location: item.locationId,
        },
        variance: {
            expected: variance.expectedQuantity,
            counted: variance.countedQuantity,
            difference: variance.varianceQuantity,
            percentage: variance.variancePercentage,
            value: variance.varianceValue,
        },
        history: {
            lastCountDate: item.lastCountDate,
            lastCountQuantity: item.lastCountQuantity,
            daysSinceLastCount,
        },
        recommendations,
    };
}
/**
 * 29. Approves variance for adjustment.
 *
 * @param {CountVariance} variance - Variance to approve
 * @param {string} approverId - Approver user ID
 * @param {string} resolution - Resolution notes
 * @returns {CountVariance} Approved variance
 *
 * @example
 * ```typescript
 * const approved = approveVariance(variance, 'MGR-001', 'Verified physical count');
 * ```
 */
function approveVariance(variance, approverId, resolution) {
    return {
        ...variance,
        action: VarianceAction.ACCEPT,
        status: CountStatus.APPROVED,
        investigatedBy: approverId,
        resolution,
        resolvedAt: new Date(),
    };
}
/**
 * 30. Rejects variance and requires recount.
 *
 * @param {CountVariance} variance - Variance to reject
 * @param {string} rejectedBy - Rejector user ID
 * @param {string} reason - Rejection reason
 * @returns {CountVariance} Rejected variance
 *
 * @example
 * ```typescript
 * const rejected = rejectVariance(variance, 'MGR-001', 'Count appears inaccurate');
 * ```
 */
function rejectVariance(variance, rejectedBy, reason) {
    return {
        ...variance,
        action: VarianceAction.RECOUNT,
        status: CountStatus.REJECTED,
        investigatedBy: rejectedBy,
        resolution: reason,
        resolvedAt: new Date(),
    };
}
/**
 * 31. Creates inventory adjustment from variance.
 *
 * @param {CountVariance} variance - Approved variance
 * @param {string} warehouseId - Warehouse ID
 * @param {string} glAccount - GL account for adjustment
 * @returns {InventoryAdjustment} Inventory adjustment
 *
 * @example
 * ```typescript
 * const adjustment = createInventoryAdjustment(variance, 'WH-001', '5400-001');
 * ```
 */
function createInventoryAdjustment(variance, warehouseId, glAccount) {
    if (variance.status !== CountStatus.APPROVED) {
        throw new Error('Variance must be approved before creating adjustment');
    }
    return {
        adjustmentId: `ADJ-${crypto.randomUUID()}`,
        varianceId: variance.varianceId,
        itemId: variance.itemId,
        sku: variance.sku,
        warehouseId,
        locationId: variance.locationId,
        adjustmentType: variance.varianceQuantity > 0 ? 'INCREASE' : 'DECREASE',
        quantity: Math.abs(variance.varianceQuantity),
        unitCost: variance.unitCost,
        totalValue: Math.abs(variance.varianceValue),
        reason: `Cycle count adjustment: ${variance.resolution || 'Count variance'}`,
        glAccount,
    };
}
/**
 * 32. Calculates total variance impact.
 *
 * @param {CountVariance[]} variances - All variances
 * @returns {object} Variance impact summary
 *
 * @example
 * ```typescript
 * const impact = calculateVarianceImpact(allVariances);
 * ```
 */
function calculateVarianceImpact(variances) {
    const positiveVariances = variances.filter(v => v.varianceQuantity > 0);
    const negativeVariances = variances.filter(v => v.varianceQuantity < 0);
    const totalPositiveValue = positiveVariances.reduce((sum, v) => sum + v.varianceValue, 0);
    const totalNegativeValue = Math.abs(negativeVariances.reduce((sum, v) => sum + v.varianceValue, 0));
    const avgPercentage = variances.length > 0 ?
        variances.reduce((sum, v) => sum + v.variancePercentage, 0) / variances.length : 0;
    return {
        totalVariances: variances.length,
        positiveVariances: positiveVariances.length,
        negativeVariances: negativeVariances.length,
        totalPositiveValue,
        totalNegativeValue,
        netVarianceValue: totalPositiveValue - totalNegativeValue,
        averageVariancePercentage: avgPercentage,
    };
}
// ============================================================================
// SECTION 5: ACCURACY METRICS (Functions 33-40)
// ============================================================================
/**
 * 33. Calculates count accuracy metrics.
 *
 * @param {CountSheet[]} sheets - Completed count sheets
 * @param {CountVariance[]} variances - All variances
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {CountAccuracyMetrics} Accuracy metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateCountAccuracyMetrics(sheets, variances, startDate, endDate);
 * ```
 */
function calculateCountAccuracyMetrics(sheets, variances, periodStart, periodEnd) {
    const completedSheets = sheets.filter(s => s.status === CountStatus.COMPLETED &&
        s.completedAt &&
        s.completedAt >= periodStart &&
        s.completedAt <= periodEnd);
    const totalTasks = completedSheets.reduce((sum, s) => sum + s.totalTasks, 0);
    const itemsWithVariance = new Set(variances.map(v => v.itemId)).size;
    // Calculate by ABC class
    const byABCClass = {
        [ABCClassification.A]: { totalCounts: 0, itemsWithVariance: 0, accuracyRate: 0, averageVariance: 0 },
        [ABCClassification.B]: { totalCounts: 0, itemsWithVariance: 0, accuracyRate: 0, averageVariance: 0 },
        [ABCClassification.C]: { totalCounts: 0, itemsWithVariance: 0, accuracyRate: 0, averageVariance: 0 },
    };
    // Calculate by location
    const byLocation = {};
    // Calculate by counter
    const byCounter = {};
    const totalValue = variances.reduce((sum, v) => sum + Math.abs(v.varianceValue), 0);
    const totalVarianceValue = variances.reduce((sum, v) => sum + Math.abs(v.varianceValue), 0);
    const accuracyRate = totalTasks > 0 ? ((totalTasks - variances.length) / totalTasks) * 100 : 100;
    const avgVariancePercentage = variances.length > 0 ?
        variances.reduce((sum, v) => sum + v.variancePercentage, 0) / variances.length : 0;
    return {
        warehouseId: completedSheets[0]?.warehouseId || '',
        periodStart,
        periodEnd,
        totalCounts: completedSheets.length,
        totalItems: totalTasks,
        totalValue,
        itemsWithVariance,
        varianceCount: variances.length,
        totalVarianceValue,
        averageVariancePercentage: avgVariancePercentage,
        accuracyRate,
        byABCClass,
        byLocation,
        byCounter,
    };
}
/**
 * 34. Calculates counter performance metrics.
 *
 * @param {string} counterId - Counter user ID
 * @param {CountSheet[]} sheets - Count sheets assigned to counter
 * @param {CountVariance[]} variances - Variances from counter's counts
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {CountPerformanceMetrics} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = calculateCounterPerformance('USER-123', sheets, variances, start, end);
 * ```
 */
function calculateCounterPerformance(counterId, sheets, variances, periodStart, periodEnd) {
    const assignedSheets = sheets.filter(s => s.assignedTo === counterId);
    const completedSheets = assignedSheets.filter(s => s.status === CountStatus.COMPLETED);
    const totalItems = completedSheets.reduce((sum, s) => sum + s.totalTasks, 0);
    const totalMinutes = completedSheets.reduce((sum, s) => {
        if (!s.startedAt || !s.completedAt)
            return sum;
        return sum + (s.completedAt.getTime() - s.startedAt.getTime()) / (1000 * 60);
    }, 0);
    const counterVariances = variances.filter(v => completedSheets.some(s => s.tasks.some(t => t.taskId === v.countTaskId)));
    const accuracyRate = totalItems > 0 ? ((totalItems - counterVariances.length) / totalItems) * 100 : 100;
    const varianceRate = totalItems > 0 ? (counterVariances.length / totalItems) * 100 : 0;
    return {
        counterId,
        counterName: '', // Should be populated from user data
        periodStart,
        periodEnd,
        totalCountsAssigned: assignedSheets.length,
        totalCountsCompleted: completedSheets.length,
        completionRate: assignedSheets.length > 0 ?
            (completedSheets.length / assignedSheets.length) * 100 : 0,
        averageCountTime: completedSheets.length > 0 ? totalMinutes / completedSheets.length : 0,
        totalItemsCounted: totalItems,
        itemsPerHour: totalMinutes > 0 ? (totalItems / totalMinutes) * 60 : 0,
        accuracyRate,
        varianceRate,
    };
}
/**
 * 35. Generates accuracy trending report.
 *
 * @param {CountAccuracyMetrics[]} metrics - Historical metrics
 * @returns {object} Trending analysis
 *
 * @example
 * ```typescript
 * const trend = generateAccuracyTrend(historicalMetrics);
 * ```
 */
function generateAccuracyTrend(metrics) {
    if (metrics.length === 0) {
        return {
            currentAccuracy: 0,
            previousAccuracy: 0,
            trend: 'STABLE',
            changePercentage: 0,
            averageAccuracy: 0,
        };
    }
    const sortedMetrics = [...metrics].sort((a, b) => b.periodStart.getTime() - a.periodStart.getTime());
    const currentAccuracy = sortedMetrics[0].accuracyRate;
    const previousAccuracy = sortedMetrics[1]?.accuracyRate || currentAccuracy;
    const changePercentage = previousAccuracy > 0 ?
        ((currentAccuracy - previousAccuracy) / previousAccuracy) * 100 : 0;
    let trend;
    if (changePercentage > 2) {
        trend = 'IMPROVING';
    }
    else if (changePercentage < -2) {
        trend = 'DECLINING';
    }
    else {
        trend = 'STABLE';
    }
    const averageAccuracy = metrics.reduce((sum, m) => sum + m.accuracyRate, 0) / metrics.length;
    return {
        currentAccuracy,
        previousAccuracy,
        trend,
        changePercentage,
        averageAccuracy,
    };
}
/**
 * 36. Identifies top variance items.
 *
 * @param {CountVariance[]} variances - All variances
 * @param {number} limit - Number of items to return
 * @returns {Array} Top variance items
 *
 * @example
 * ```typescript
 * const topItems = identifyTopVarianceItems(variances, 10);
 * ```
 */
function identifyTopVarianceItems(variances, limit = 10) {
    const itemMap = new Map();
    variances.forEach(v => {
        const existing = itemMap.get(v.itemId);
        if (existing) {
            existing.occurrences++;
            existing.totalVarianceValue += Math.abs(v.varianceValue);
            existing.totalVariancePercentage += v.variancePercentage;
        }
        else {
            itemMap.set(v.itemId, {
                itemId: v.itemId,
                sku: v.sku,
                occurrences: 1,
                totalVarianceValue: Math.abs(v.varianceValue),
                totalVariancePercentage: v.variancePercentage,
            });
        }
    });
    return Array.from(itemMap.values())
        .map(item => ({
        ...item,
        averageVariancePercentage: item.totalVariancePercentage / item.occurrences,
    }))
        .sort((a, b) => b.totalVarianceValue - a.totalVarianceValue)
        .slice(0, limit);
}
/**
 * 37. Calculates inventory record accuracy (IRA).
 *
 * @param {number} totalItems - Total items counted
 * @param {number} itemsWithVariance - Items with variances
 * @returns {number} IRA percentage
 *
 * @example
 * ```typescript
 * const ira = calculateInventoryRecordAccuracy(1000, 50);
 * // Returns: 95.0
 * ```
 */
function calculateInventoryRecordAccuracy(totalItems, itemsWithVariance) {
    if (totalItems === 0)
        return 100;
    return ((totalItems - itemsWithVariance) / totalItems) * 100;
}
/**
 * 38. Generates variance heatmap by location.
 *
 * @param {CountVariance[]} variances - All variances
 * @returns {Array} Location variance analysis
 *
 * @example
 * ```typescript
 * const heatmap = generateVarianceHeatmap(variances);
 * ```
 */
function generateVarianceHeatmap(variances) {
    const locationMap = new Map();
    variances.forEach(v => {
        const existing = locationMap.get(v.locationId);
        if (existing) {
            existing.varianceCount++;
            existing.totalVarianceValue += Math.abs(v.varianceValue);
        }
        else {
            locationMap.set(v.locationId, {
                locationId: v.locationId,
                varianceCount: 1,
                totalVarianceValue: Math.abs(v.varianceValue),
            });
        }
    });
    return Array.from(locationMap.values())
        .map(loc => {
        let severity;
        if (loc.totalVarianceValue >= 10000 || loc.varianceCount >= 20) {
            severity = 'CRITICAL';
        }
        else if (loc.totalVarianceValue >= 5000 || loc.varianceCount >= 10) {
            severity = 'HIGH';
        }
        else if (loc.totalVarianceValue >= 1000 || loc.varianceCount >= 5) {
            severity = 'MEDIUM';
        }
        else {
            severity = 'LOW';
        }
        return { ...loc, severity };
    })
        .sort((a, b) => b.totalVarianceValue - a.totalVarianceValue);
}
/**
 * 39. Exports count results to CSV.
 *
 * @param {CountSheet[]} sheets - Count sheets
 * @param {CountVariance[]} variances - Variances
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportCountResultsToCSV(sheets, variances);
 * ```
 */
function exportCountResultsToCSV(sheets, variances) {
    const headers = [
        'Sheet ID',
        'Task ID',
        'SKU',
        'Description',
        'Location',
        'Expected Qty',
        'Counted Qty',
        'Variance',
        'Variance %',
        'Variance Value',
        'Status',
        'Counted By',
        'Counted At',
    ];
    let csv = headers.join(',') + '\n';
    for (const sheet of sheets) {
        for (const task of sheet.tasks) {
            const variance = variances.find(v => v.countTaskId === task.taskId);
            const row = [
                sheet.sheetId,
                task.taskId,
                task.sku,
                `"${task.description}"`,
                task.locationId,
                task.expectedQuantity || '',
                task.countedQuantity || '',
                variance?.varianceQuantity || 0,
                variance?.variancePercentage.toFixed(2) || '0.00',
                variance?.varianceValue.toFixed(2) || '0.00',
                task.status,
                task.countedBy || '',
                task.countedAt?.toISOString() || '',
            ];
            csv += row.join(',') + '\n';
        }
    }
    return csv;
}
/**
 * 40. Generates comprehensive cycle count dashboard.
 *
 * @param {object} data - Dashboard data
 * @returns {object} Dashboard summary
 *
 * @example
 * ```typescript
 * const dashboard = generateCycleCountDashboard({
 *   schedules, plans, sheets, variances, metrics
 * });
 * ```
 */
function generateCycleCountDashboard(data) {
    const activeSchedules = data.schedules.filter(s => s.isActive).length;
    const pendingPlans = data.plans.filter(p => p.status === CountStatus.SCHEDULED).length;
    const inProgressCounts = data.sheets.filter(s => s.status === CountStatus.IN_PROGRESS).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = data.sheets.filter(s => s.status === CountStatus.COMPLETED &&
        s.completedAt &&
        s.completedAt >= today).length;
    const totalItems = data.metrics.totalItems;
    const avgCountTime = data.sheets
        .filter(s => s.startedAt && s.completedAt)
        .reduce((sum, s) => {
        const duration = (s.completedAt.getTime() - s.startedAt.getTime()) / (1000 * 60);
        return sum + duration;
    }, 0) / data.sheets.length;
    const countersActive = new Set(data.sheets.map(s => s.assignedTo)).size;
    // Identify top issues
    const topIssues = [
        ...identifyTopVarianceItems(data.variances, 5).map(item => ({
            type: 'High Variance Item',
            description: `SKU ${item.sku} - ${item.occurrences} occurrences`,
            severity: item.totalVarianceValue > 5000 ? 'CRITICAL' : 'HIGH',
            count: item.occurrences,
        })),
        ...generateVarianceHeatmap(data.variances).slice(0, 3).map(loc => ({
            type: 'Problem Location',
            description: `Location ${loc.locationId} - ${loc.varianceCount} variances`,
            severity: loc.severity,
            count: loc.varianceCount,
        })),
    ].sort((a, b) => {
        const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
    }).slice(0, 5);
    return {
        overview: {
            activeSchedules,
            pendingPlans,
            inProgressCounts,
            completedToday,
        },
        accuracy: {
            overallAccuracy: data.metrics.accuracyRate,
            varianceCount: data.metrics.varianceCount,
            totalVarianceValue: data.metrics.totalVarianceValue,
            trend: 'STABLE', // Would be calculated from historical data
        },
        productivity: {
            totalItemsCounted: totalItems,
            averageCountTime: avgCountTime,
            countersActive,
        },
        topIssues,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Converts count frequency to days.
 */
function getFrequencyDays(frequency) {
    const frequencyMap = {
        [CountFrequency.DAILY]: 1,
        [CountFrequency.WEEKLY]: 7,
        [CountFrequency.MONTHLY]: 30,
        [CountFrequency.QUARTERLY]: 90,
        [CountFrequency.SEMI_ANNUAL]: 180,
        [CountFrequency.ANNUAL]: 365,
    };
    return frequencyMap[frequency];
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Count Schedule Management
    performABCAnalysis,
    createCycleCountSchedule,
    generateCountFrequencies,
    calculateNextCountDate,
    generateCountCalendar,
    getItemsDueForCount,
    balanceCountWorkload,
    updateScheduleProgress,
    // Count Plan Generation
    createCountPlan,
    generateCountPlanFromSchedule,
    assignCountPlan,
    splitCountPlanToSheets,
    optimizeCountRoute,
    validateCountPlan,
    generateCountPlanSummary,
    cancelCountPlan,
    // Count Execution
    startCountSheet,
    recordCount,
    validateBlindCount,
    updateCountSheetProgress,
    completeCountSheet,
    addCountPhotos,
    flagForRecount,
    calculateCountProgress,
    // Variance Analysis
    identifyVariances,
    applyVarianceThreshold,
    categorizeVarianceSeverity,
    generateVarianceInvestigationReport,
    approveVariance,
    rejectVariance,
    createInventoryAdjustment,
    calculateVarianceImpact,
    // Accuracy Metrics
    calculateCountAccuracyMetrics,
    calculateCounterPerformance,
    generateAccuracyTrend,
    identifyTopVarianceItems,
    calculateInventoryRecordAccuracy,
    generateVarianceHeatmap,
    exportCountResultsToCSV,
    generateCycleCountDashboard,
};
//# sourceMappingURL=inventory-cycle-count-kit.js.map