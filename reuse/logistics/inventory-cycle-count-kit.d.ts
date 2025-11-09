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
/**
 * ABC classification for inventory items
 */
export declare enum ABCClassification {
    A = "A",// High value, 80% of value, 20% of items
    B = "B",// Medium value, 15% of value, 30% of items
    C = "C"
}
/**
 * Count frequency based on ABC classification
 */
export declare enum CountFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMI_ANNUAL = "SEMI_ANNUAL",
    ANNUAL = "ANNUAL"
}
/**
 * Count status enumeration
 */
export declare enum CountStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    RECOUNT_REQUIRED = "RECOUNT_REQUIRED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
/**
 * Count type enumeration
 */
export declare enum CountType {
    CYCLE_COUNT = "CYCLE_COUNT",
    PHYSICAL_INVENTORY = "PHYSICAL_INVENTORY",
    SPOT_CHECK = "SPOT_CHECK",
    WALL_TO_WALL = "WALL_TO_WALL",
    RECOUNT = "RECOUNT"
}
/**
 * Variance resolution action
 */
export declare enum VarianceAction {
    ACCEPT = "ACCEPT",
    REJECT = "REJECT",
    RECOUNT = "RECOUNT",
    INVESTIGATE = "INVESTIGATE",
    ADJUST = "ADJUST"
}
/**
 * Inventory item for cycle counting
 */
export interface InventoryItem {
    itemId: string;
    sku: string;
    description: string;
    warehouseId: string;
    locationId: string;
    binLocation?: string;
    lotNumber?: string;
    serialNumber?: string;
    currentQuantity: number;
    unitOfMeasure: string;
    unitCost: number;
    totalValue: number;
    abcClassification: ABCClassification;
    lastCountDate?: Date;
    lastCountQuantity?: number;
    metadata?: Record<string, any>;
}
/**
 * ABC analysis criteria
 */
export interface ABCAnalysisCriteria {
    items: InventoryItem[];
    valueThresholds: {
        classA: number;
        classB: number;
        classC: number;
    };
    quantityThresholds?: {
        classA: number;
        classB: number;
        classC: number;
    };
}
/**
 * Cycle count schedule
 */
export interface CycleCountSchedule {
    scheduleId: string;
    warehouseId: string;
    abcClassification: ABCClassification;
    frequency: CountFrequency;
    itemCount: number;
    daysPerCount: number;
    itemsPerDay: number;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Count plan
 */
export interface CountPlan {
    planId: string;
    warehouseId: string;
    countType: CountType;
    scheduledDate: Date;
    assignedTo?: string;
    items: CountPlanItem[];
    status: CountStatus;
    totalItems: number;
    totalValue: number;
    estimatedDuration: number;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Count plan item
 */
export interface CountPlanItem {
    planItemId: string;
    itemId: string;
    sku: string;
    description: string;
    locationId: string;
    binLocation?: string;
    expectedQuantity: number;
    unitOfMeasure: string;
    abcClassification: ABCClassification;
    isBlindCount: boolean;
    priority: number;
    metadata?: Record<string, any>;
}
/**
 * Count sheet (assigned to counter)
 */
export interface CountSheet {
    sheetId: string;
    planId: string;
    warehouseId: string;
    assignedTo: string;
    countType: CountType;
    scheduledDate: Date;
    tasks: CountTask[];
    status: CountStatus;
    totalTasks: number;
    completedTasks: number;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Individual count task
 */
export interface CountTask {
    taskId: string;
    sheetId: string;
    itemId: string;
    sku: string;
    description: string;
    locationId: string;
    binLocation?: string;
    expectedQuantity?: number;
    countedQuantity?: number;
    unitOfMeasure: string;
    isBlindCount: boolean;
    status: CountStatus;
    countedAt?: Date;
    countedBy?: string;
    notes?: string;
    photoUrls?: string[];
    metadata?: Record<string, any>;
}
/**
 * Count variance
 */
export interface CountVariance {
    varianceId: string;
    countTaskId: string;
    itemId: string;
    sku: string;
    locationId: string;
    expectedQuantity: number;
    countedQuantity: number;
    varianceQuantity: number;
    variancePercentage: number;
    unitCost: number;
    varianceValue: number;
    action: VarianceAction;
    status: CountStatus;
    investigatedBy?: string;
    resolution?: string;
    adjustmentId?: string;
    createdAt: Date;
    resolvedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Inventory adjustment from count
 */
export interface InventoryAdjustment {
    adjustmentId: string;
    varianceId: string;
    itemId: string;
    sku: string;
    warehouseId: string;
    locationId: string;
    adjustmentType: 'INCREASE' | 'DECREASE';
    quantity: number;
    unitCost: number;
    totalValue: number;
    reason: string;
    approvedBy?: string;
    postedAt?: Date;
    glAccount?: string;
    metadata?: Record<string, any>;
}
/**
 * Count accuracy metrics
 */
export interface CountAccuracyMetrics {
    warehouseId: string;
    periodStart: Date;
    periodEnd: Date;
    totalCounts: number;
    totalItems: number;
    totalValue: number;
    itemsWithVariance: number;
    varianceCount: number;
    totalVarianceValue: number;
    averageVariancePercentage: number;
    accuracyRate: number;
    byABCClass: Record<ABCClassification, {
        totalCounts: number;
        itemsWithVariance: number;
        accuracyRate: number;
        averageVariance: number;
    }>;
    byLocation: Record<string, {
        totalCounts: number;
        itemsWithVariance: number;
        accuracyRate: number;
    }>;
    byCounter: Record<string, {
        totalCounts: number;
        itemsWithVariance: number;
        accuracyRate: number;
    }>;
}
/**
 * Count performance metrics
 */
export interface CountPerformanceMetrics {
    counterId: string;
    counterName: string;
    periodStart: Date;
    periodEnd: Date;
    totalCountsAssigned: number;
    totalCountsCompleted: number;
    completionRate: number;
    averageCountTime: number;
    totalItemsCounted: number;
    itemsPerHour: number;
    accuracyRate: number;
    varianceRate: number;
}
/**
 * Variance threshold configuration
 */
export interface VarianceThreshold {
    warehouseId: string;
    abcClassification?: ABCClassification;
    quantityThreshold?: number;
    percentageThreshold?: number;
    valueThreshold?: number;
    autoApproveBelow?: boolean;
    requireRecountAbove?: boolean;
}
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
export declare function performABCAnalysis(criteria: ABCAnalysisCriteria): InventoryItem[];
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
export declare function createCycleCountSchedule(warehouseId: string, classification: ABCClassification, frequency: CountFrequency, itemCount: number): CycleCountSchedule;
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
export declare function generateCountFrequencies(items: InventoryItem[]): Record<ABCClassification, CountFrequency>;
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
export declare function calculateNextCountDate(item: InventoryItem, frequency: CountFrequency): Date;
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
export declare function generateCountCalendar(schedules: CycleCountSchedule[], year: number): Array<{
    date: Date;
    warehouseId: string;
    abcClassification: ABCClassification;
    estimatedItems: number;
}>;
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
export declare function getItemsDueForCount(items: InventoryItem[], frequencies: Record<ABCClassification, CountFrequency>, asOfDate?: Date): InventoryItem[];
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
export declare function balanceCountWorkload(items: InventoryItem[], workDays: number): Array<{
    day: number;
    items: InventoryItem[];
    totalValue: number;
    estimatedTime: number;
}>;
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
export declare function updateScheduleProgress(schedule: CycleCountSchedule, itemsCounted: number): CycleCountSchedule;
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
export declare function createCountPlan(warehouseId: string, countType: CountType, items: InventoryItem[], scheduledDate: Date): CountPlan;
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
export declare function generateCountPlanFromSchedule(schedule: CycleCountSchedule, availableItems: InventoryItem[], date: Date): CountPlan;
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
export declare function assignCountPlan(plan: CountPlan, counterId: string): CountPlan;
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
export declare function splitCountPlanToSheets(plan: CountPlan, sheetsCount: number): CountSheet[];
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
export declare function optimizeCountRoute(items: CountPlanItem[]): CountPlanItem[];
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
export declare function validateCountPlan(plan: CountPlan): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
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
export declare function generateCountPlanSummary(plan: CountPlan): {
    planId: string;
    warehouseId: string;
    countType: CountType;
    scheduledDate: Date;
    totalItems: number;
    totalValue: number;
    byABCClass: Record<ABCClassification, number>;
    byLocation: Record<string, number>;
    blindCountItems: number;
    estimatedDuration: number;
};
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
export declare function cancelCountPlan(plan: CountPlan, reason: string): CountPlan;
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
export declare function startCountSheet(sheet: CountSheet, counterId: string): CountSheet;
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
export declare function recordCount(task: CountTask, countedQuantity: number, counterId: string, notes?: string): CountTask;
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
export declare function validateBlindCount(task: CountTask, expectedQuantity: number): {
    isMatch: boolean;
    variance: number;
    variancePercentage: number;
    requiresRecount: boolean;
};
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
export declare function updateCountSheetProgress(sheet: CountSheet, updatedTask: CountTask): CountSheet;
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
export declare function completeCountSheet(sheet: CountSheet): CountSheet;
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
export declare function addCountPhotos(task: CountTask, photoUrls: string[]): CountTask;
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
export declare function flagForRecount(task: CountTask, reason: string): CountTask;
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
export declare function calculateCountProgress(sheet: CountSheet): number;
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
export declare function identifyVariances(tasks: CountTask[], inventory: InventoryItem[]): CountVariance[];
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
export declare function applyVarianceThreshold(variance: CountVariance, threshold: VarianceThreshold): {
    exceedsThreshold: boolean;
    autoApprove: boolean;
    requiresRecount: boolean;
    recommendedAction: VarianceAction;
};
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
export declare function categorizeVarianceSeverity(variance: CountVariance): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
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
export declare function generateVarianceInvestigationReport(variance: CountVariance, item: InventoryItem): {
    varianceId: string;
    severity: string;
    itemDetails: {
        sku: string;
        description: string;
        abcClassification: ABCClassification;
        location: string;
    };
    variance: {
        expected: number;
        counted: number;
        difference: number;
        percentage: number;
        value: number;
    };
    history: {
        lastCountDate?: Date;
        lastCountQuantity?: number;
        daysSinceLastCount?: number;
    };
    recommendations: string[];
};
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
export declare function approveVariance(variance: CountVariance, approverId: string, resolution: string): CountVariance;
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
export declare function rejectVariance(variance: CountVariance, rejectedBy: string, reason: string): CountVariance;
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
export declare function createInventoryAdjustment(variance: CountVariance, warehouseId: string, glAccount: string): InventoryAdjustment;
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
export declare function calculateVarianceImpact(variances: CountVariance[]): {
    totalVariances: number;
    positiveVariances: number;
    negativeVariances: number;
    totalPositiveValue: number;
    totalNegativeValue: number;
    netVarianceValue: number;
    averageVariancePercentage: number;
};
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
export declare function calculateCountAccuracyMetrics(sheets: CountSheet[], variances: CountVariance[], periodStart: Date, periodEnd: Date): CountAccuracyMetrics;
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
export declare function calculateCounterPerformance(counterId: string, sheets: CountSheet[], variances: CountVariance[], periodStart: Date, periodEnd: Date): CountPerformanceMetrics;
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
export declare function generateAccuracyTrend(metrics: CountAccuracyMetrics[]): {
    currentAccuracy: number;
    previousAccuracy: number;
    trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    changePercentage: number;
    averageAccuracy: number;
};
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
export declare function identifyTopVarianceItems(variances: CountVariance[], limit?: number): Array<{
    itemId: string;
    sku: string;
    occurrences: number;
    totalVarianceValue: number;
    averageVariancePercentage: number;
}>;
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
export declare function calculateInventoryRecordAccuracy(totalItems: number, itemsWithVariance: number): number;
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
export declare function generateVarianceHeatmap(variances: CountVariance[]): Array<{
    locationId: string;
    varianceCount: number;
    totalVarianceValue: number;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}>;
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
export declare function exportCountResultsToCSV(sheets: CountSheet[], variances: CountVariance[]): string;
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
export declare function generateCycleCountDashboard(data: {
    schedules: CycleCountSchedule[];
    plans: CountPlan[];
    sheets: CountSheet[];
    variances: CountVariance[];
    metrics: CountAccuracyMetrics;
}): {
    overview: {
        activeSchedules: number;
        pendingPlans: number;
        inProgressCounts: number;
        completedToday: number;
    };
    accuracy: {
        overallAccuracy: number;
        varianceCount: number;
        totalVarianceValue: number;
        trend: string;
    };
    productivity: {
        totalItemsCounted: number;
        averageCountTime: number;
        countersActive: number;
    };
    topIssues: Array<{
        type: string;
        description: string;
        severity: string;
        count: number;
    }>;
};
declare const _default: {
    performABCAnalysis: typeof performABCAnalysis;
    createCycleCountSchedule: typeof createCycleCountSchedule;
    generateCountFrequencies: typeof generateCountFrequencies;
    calculateNextCountDate: typeof calculateNextCountDate;
    generateCountCalendar: typeof generateCountCalendar;
    getItemsDueForCount: typeof getItemsDueForCount;
    balanceCountWorkload: typeof balanceCountWorkload;
    updateScheduleProgress: typeof updateScheduleProgress;
    createCountPlan: typeof createCountPlan;
    generateCountPlanFromSchedule: typeof generateCountPlanFromSchedule;
    assignCountPlan: typeof assignCountPlan;
    splitCountPlanToSheets: typeof splitCountPlanToSheets;
    optimizeCountRoute: typeof optimizeCountRoute;
    validateCountPlan: typeof validateCountPlan;
    generateCountPlanSummary: typeof generateCountPlanSummary;
    cancelCountPlan: typeof cancelCountPlan;
    startCountSheet: typeof startCountSheet;
    recordCount: typeof recordCount;
    validateBlindCount: typeof validateBlindCount;
    updateCountSheetProgress: typeof updateCountSheetProgress;
    completeCountSheet: typeof completeCountSheet;
    addCountPhotos: typeof addCountPhotos;
    flagForRecount: typeof flagForRecount;
    calculateCountProgress: typeof calculateCountProgress;
    identifyVariances: typeof identifyVariances;
    applyVarianceThreshold: typeof applyVarianceThreshold;
    categorizeVarianceSeverity: typeof categorizeVarianceSeverity;
    generateVarianceInvestigationReport: typeof generateVarianceInvestigationReport;
    approveVariance: typeof approveVariance;
    rejectVariance: typeof rejectVariance;
    createInventoryAdjustment: typeof createInventoryAdjustment;
    calculateVarianceImpact: typeof calculateVarianceImpact;
    calculateCountAccuracyMetrics: typeof calculateCountAccuracyMetrics;
    calculateCounterPerformance: typeof calculateCounterPerformance;
    generateAccuracyTrend: typeof generateAccuracyTrend;
    identifyTopVarianceItems: typeof identifyTopVarianceItems;
    calculateInventoryRecordAccuracy: typeof calculateInventoryRecordAccuracy;
    generateVarianceHeatmap: typeof generateVarianceHeatmap;
    exportCountResultsToCSV: typeof exportCountResultsToCSV;
    generateCycleCountDashboard: typeof generateCycleCountDashboard;
};
export default _default;
//# sourceMappingURL=inventory-cycle-count-kit.d.ts.map