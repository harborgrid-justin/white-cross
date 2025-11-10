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
/**
 * Replenishment method enumeration
 */
export declare enum ReplenishmentMethod {
    MIN_MAX = "MIN_MAX",
    DEMAND_BASED = "DEMAND_BASED",
    WAVE_BASED = "WAVE_BASED",
    TIME_BASED = "TIME_BASED",
    KANBAN = "KANBAN",
    DIRECTED = "DIRECTED",
    OPPORTUNISTIC = "OPPORTUNISTIC"
}
/**
 * Replenishment priority levels
 */
export declare enum ReplenishmentPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    SCHEDULED = "SCHEDULED"
}
/**
 * Replenishment task status
 */
export declare enum ReplenishmentTaskStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED"
}
/**
 * Pick zone types
 */
export declare enum PickZoneType {
    FAST_PICK = "FAST_PICK",
    BULK_PICK = "BULK_PICK",
    CASE_PICK = "CASE_PICK",
    EACH_PICK = "EACH_PICK",
    PALLET_PICK = "PALLET_PICK"
}
/**
 * Unit of measure for inventory
 */
export declare enum UnitOfMeasure {
    EACH = "EACH",
    CASE = "CASE",
    PALLET = "PALLET",
    BOX = "BOX",
    CARTON = "CARTON"
}
/**
 * Pick location in warehouse
 */
export interface PickLocation {
    locationId: string;
    locationCode: string;
    zoneId: string;
    zoneType: PickZoneType;
    aisle: string;
    bay: string;
    level: string;
    position: string;
    capacity: number;
    currentQuantity: number;
    unitOfMeasure: UnitOfMeasure;
    productId?: string;
    sku?: string;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Reserve/bulk storage location
 */
export interface ReserveLocation {
    locationId: string;
    locationCode: string;
    zoneId: string;
    warehouseArea: string;
    capacity: number;
    currentQuantity: number;
    unitOfMeasure: UnitOfMeasure;
    productId: string;
    sku: string;
    lotNumber?: string;
    expirationDate?: Date;
    receivedDate: Date;
    isAllocated: boolean;
    metadata?: Record<string, any>;
}
/**
 * Min/max inventory levels
 */
export interface MinMaxLevel {
    levelId: string;
    productId: string;
    sku: string;
    locationId: string;
    minQuantity: number;
    maxQuantity: number;
    reorderPoint: number;
    replenishmentQuantity: number;
    unitOfMeasure: UnitOfMeasure;
    leadTime?: number;
    safetyStock?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Replenishment rule configuration
 */
export interface ReplenishmentRule {
    ruleId: string;
    ruleName: string;
    method: ReplenishmentMethod;
    priority: ReplenishmentPriority;
    zoneIds?: string[];
    productCategories?: string[];
    specificProducts?: string[];
    isActive: boolean;
    scheduleConfig?: {
        frequency: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'ON_DEMAND';
        scheduledTimes?: string[];
        daysOfWeek?: number[];
    };
    thresholds?: {
        minStockLevel?: number;
        criticalLevel?: number;
        maxDemandRate?: number;
    };
    constraints?: {
        maxTasksPerCycle?: number;
        minReplenishmentQty?: number;
        maxReplenishmentQty?: number;
        allowPartialReplenishment?: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Replenishment trigger event
 */
export interface ReplenishmentTrigger {
    triggerId: string;
    triggerType: 'THRESHOLD' | 'SCHEDULED' | 'DEMAND' | 'MANUAL' | 'WAVE';
    productId: string;
    sku: string;
    locationId: string;
    currentQuantity: number;
    requiredQuantity: number;
    priority: ReplenishmentPriority;
    reason: string;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Replenishment task
 */
export interface ReplenishmentTask {
    taskId: string;
    taskNumber: string;
    productId: string;
    sku: string;
    productName: string;
    sourceLocationId: string;
    sourceLocation: ReserveLocation;
    destinationLocationId: string;
    destinationLocation: PickLocation;
    quantity: number;
    unitOfMeasure: UnitOfMeasure;
    priority: ReplenishmentPriority;
    status: ReplenishmentTaskStatus;
    assignedTo?: string;
    assignedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    estimatedDuration?: number;
    actualDuration?: number;
    triggerId?: string;
    waveId?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Bulk picking configuration
 */
export interface BulkPickingConfig {
    zoneId: string;
    minPalletQuantity: number;
    maxPalletQuantity: number;
    preferredEquipment: string[];
    accessRestrictions?: string[];
    operatingHours?: {
        start: string;
        end: string;
    };
}
/**
 * Case picking configuration
 */
export interface CasePickingConfig {
    zoneId: string;
    casesPerReplenishment: number;
    minCaseThreshold: number;
    conveyorCompatible: boolean;
    stackingRules?: {
        maxStackHeight: number;
        allowMixedProducts: boolean;
    };
}
/**
 * Zone replenishment configuration
 */
export interface ZoneReplenishment {
    zoneId: string;
    zoneName: string;
    zoneType: PickZoneType;
    replenishmentMethod: ReplenishmentMethod;
    priority: ReplenishmentPriority;
    targetServiceLevel: number;
    currentServiceLevel?: number;
    avgReplenishmentTime?: number;
    activeTaskCount?: number;
    pendingTaskCount?: number;
    configuration: BulkPickingConfig | CasePickingConfig;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Replenishment performance metrics
 */
export interface ReplenishmentMetrics {
    periodStart: Date;
    periodEnd: Date;
    totalTasksCreated: number;
    totalTasksCompleted: number;
    totalTasksCancelled: number;
    averageCompletionTime: number;
    stockoutsAvoided: number;
    stockoutsOccurred: number;
    serviceLevel: number;
    utilizationRate: number;
    accuracyRate: number;
    byZone?: Record<string, {
        tasksCompleted: number;
        avgCompletionTime: number;
        serviceLevel: number;
    }>;
    byPriority?: Record<ReplenishmentPriority, {
        tasksCreated: number;
        tasksCompleted: number;
        avgCompletionTime: number;
    }>;
}
/**
 * Wave replenishment configuration
 */
export interface WaveReplenishment {
    waveId: string;
    waveNumber: string;
    waveType: 'SCHEDULED' | 'DEMAND' | 'MIXED';
    scheduledStartTime: Date;
    actualStartTime?: Date;
    completedAt?: Date;
    zoneIds: string[];
    tasks: ReplenishmentTask[];
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    totalQuantity: number;
    completedQuantity: number;
    metadata?: Record<string, any>;
}
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
export declare function createReplenishmentRule(ruleData: Partial<ReplenishmentRule>): ReplenishmentRule;
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
export declare function createMinMaxLevel(levelData: Partial<MinMaxLevel>): MinMaxLevel;
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
export declare function updateReplenishmentRule(rule: ReplenishmentRule, updates: Partial<ReplenishmentRule>): ReplenishmentRule;
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
export declare function validateReplenishmentRule(rule: ReplenishmentRule): {
    valid: boolean;
    errors: string[];
};
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
export declare function calculateOptimalMinMax(demandData: {
    averageDailyDemand: number;
    leadTimeDays: number;
    serviceLevel: number;
    demandVariability: number;
}): {
    minQuantity: number;
    maxQuantity: number;
    reorderPoint: number;
    safetyStock: number;
};
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
export declare function createZoneReplenishment(zoneData: Partial<ZoneReplenishment>): ZoneReplenishment;
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
export declare function applyReplenishmentRules(locations: PickLocation[], rules: ReplenishmentRule[]): PickLocation[];
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
export declare function checkMinMaxTrigger(location: PickLocation, minMaxLevel: MinMaxLevel): boolean;
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
export declare function createReplenishmentTrigger(triggerData: {
    triggerType: 'THRESHOLD' | 'SCHEDULED' | 'DEMAND' | 'MANUAL' | 'WAVE';
    productId: string;
    sku: string;
    locationId: string;
    currentQuantity: number;
    requiredQuantity: number;
    priority: ReplenishmentPriority;
    reason: string;
    metadata?: Record<string, any>;
}): ReplenishmentTrigger;
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
export declare function evaluateDemandTrigger(location: PickLocation, forecastedDemand: number, demandHorizon: number): {
    shouldTrigger: boolean;
    reason?: string;
    urgency?: ReplenishmentPriority;
    recommendedQuantity?: number;
};
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
export declare function evaluateTimeTrigger(rule: ReplenishmentRule, currentTime: Date): boolean;
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
export declare function checkStockoutCondition(location: PickLocation, minMaxLevel: MinMaxLevel): ReplenishmentTrigger | null;
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
export declare function evaluateWaveTrigger(locations: PickLocation[], zone: ZoneReplenishment): PickLocation[];
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
export declare function calculateReplenishmentPriority(factors: {
    currentStock: number;
    minQuantity: number;
    demandRate: number;
    isHighVelocity?: boolean;
    hasBackorders?: boolean;
    expirationRisk?: boolean;
}): ReplenishmentPriority;
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
export declare function batchReplenishmentTriggers(triggers: ReplenishmentTrigger[], maxBatchSize?: number): ReplenishmentTrigger[][];
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
export declare function generateReplenishmentTask(trigger: ReplenishmentTrigger, sourceLocation: ReserveLocation, destinationLocation: PickLocation): ReplenishmentTask;
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
export declare function findOptimalSourceLocation(reserveLocations: ReserveLocation[], productId: string, quantity: number): ReserveLocation | null;
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
export declare function generateWaveReplenishmentTasks(locations: PickLocation[], reserves: ReserveLocation[], waveId: string): ReplenishmentTask[];
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
export declare function optimizeTaskSequence(tasks: ReplenishmentTask[]): ReplenishmentTask[];
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
export declare function calculateTaskDuration(task: ReplenishmentTask): number;
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
export declare function validateTaskFeasibility(task: ReplenishmentTask): {
    feasible: boolean;
    issues: string[];
};
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
export declare function createReplenishmentWave(tasks: ReplenishmentTask[], waveType: 'SCHEDULED' | 'DEMAND' | 'MIXED'): WaveReplenishment;
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
export declare function splitReplenishmentTask(task: ReplenishmentTask, maxQuantityPerTask: number): ReplenishmentTask[];
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
export declare function assignReplenishmentTask(task: ReplenishmentTask, workerId: string): ReplenishmentTask;
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
export declare function startReplenishmentTask(task: ReplenishmentTask): ReplenishmentTask;
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
export declare function completeReplenishmentTask(task: ReplenishmentTask, actualQuantity?: number): ReplenishmentTask;
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
export declare function cancelReplenishmentTask(task: ReplenishmentTask, reason: string): ReplenishmentTask;
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
export declare function updatePickLocationInventory(location: PickLocation, quantityAdded: number): PickLocation;
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
export declare function updateReserveLocationInventory(location: ReserveLocation, quantityRemoved: number): ReserveLocation;
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
export declare function processTaskCompletion(task: ReplenishmentTask, actualQuantity: number): {
    task: ReplenishmentTask;
    sourceUpdate: ReserveLocation;
    destinationUpdate: PickLocation;
    variance: number;
};
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
export declare function calculateReplenishmentMetrics(tasks: ReplenishmentTask[], periodStart: Date, periodEnd: Date): ReplenishmentMetrics;
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
export declare function analyzeZonePerformance(tasks: ReplenishmentTask[], zoneId: string): {
    zoneId: string;
    totalTasks: number;
    completedTasks: number;
    avgCompletionTime: number;
    priorityBreakdown: Record<ReplenishmentPriority, number>;
    completionRate: number;
};
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
export declare function calculateServiceLevel(locations: PickLocation[], minMaxLevels: MinMaxLevel[]): {
    overallServiceLevel: number;
    locationsInStock: number;
    locationsAtRisk: number;
    locationsStockedOut: number;
    byZone: Record<string, number>;
};
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
export declare function generateEfficiencyReport(tasks: ReplenishmentTask[]): {
    totalTasksAnalyzed: number;
    averageTaskDuration: number;
    estimatedVsActual: {
        averageVariance: number;
        tasksOverEstimate: number;
        tasksUnderEstimate: number;
    };
    productivityMetrics: {
        unitsPerHour: number;
        tasksPerHour: number;
    };
    priorityPerformance: Record<ReplenishmentPriority, {
        count: number;
        avgDuration: number;
    }>;
};
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
export declare function identifyReplenishmentBottlenecks(tasks: ReplenishmentTask[], zones: ZoneReplenishment[]): {
    slowZones: Array<{
        zoneId: string;
        avgDuration: number;
        taskCount: number;
    }>;
    highCancellationAreas: Array<{
        zoneId: string;
        cancellationRate: number;
    }>;
    overdueTasks: ReplenishmentTask[];
    recurringIssues: Array<{
        productId: string;
        issueCount: number;
    }>;
};
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
export declare function forecastReplenishmentDemand(locations: PickLocation[], historicalTasks: ReplenishmentTask[], forecastHorizon: number): {
    forecastHorizon: number;
    estimatedTaskCount: number;
    estimatedTotalQuantity: number;
    byZone: Record<string, {
        taskCount: number;
        totalQuantity: number;
    }>;
    byPriority: Record<ReplenishmentPriority, number>;
};
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
export declare function exportReplenishmentToCSV(tasks: ReplenishmentTask[]): string;
declare const _default: {
    createReplenishmentRule: typeof createReplenishmentRule;
    createMinMaxLevel: typeof createMinMaxLevel;
    updateReplenishmentRule: typeof updateReplenishmentRule;
    validateReplenishmentRule: typeof validateReplenishmentRule;
    calculateOptimalMinMax: typeof calculateOptimalMinMax;
    createZoneReplenishment: typeof createZoneReplenishment;
    applyReplenishmentRules: typeof applyReplenishmentRules;
    checkMinMaxTrigger: typeof checkMinMaxTrigger;
    createReplenishmentTrigger: typeof createReplenishmentTrigger;
    evaluateDemandTrigger: typeof evaluateDemandTrigger;
    evaluateTimeTrigger: typeof evaluateTimeTrigger;
    checkStockoutCondition: typeof checkStockoutCondition;
    evaluateWaveTrigger: typeof evaluateWaveTrigger;
    calculateReplenishmentPriority: typeof calculateReplenishmentPriority;
    batchReplenishmentTriggers: typeof batchReplenishmentTriggers;
    generateReplenishmentTask: typeof generateReplenishmentTask;
    findOptimalSourceLocation: typeof findOptimalSourceLocation;
    generateWaveReplenishmentTasks: typeof generateWaveReplenishmentTasks;
    optimizeTaskSequence: typeof optimizeTaskSequence;
    calculateTaskDuration: typeof calculateTaskDuration;
    validateTaskFeasibility: typeof validateTaskFeasibility;
    createReplenishmentWave: typeof createReplenishmentWave;
    splitReplenishmentTask: typeof splitReplenishmentTask;
    assignReplenishmentTask: typeof assignReplenishmentTask;
    startReplenishmentTask: typeof startReplenishmentTask;
    completeReplenishmentTask: typeof completeReplenishmentTask;
    cancelReplenishmentTask: typeof cancelReplenishmentTask;
    updatePickLocationInventory: typeof updatePickLocationInventory;
    updateReserveLocationInventory: typeof updateReserveLocationInventory;
    processTaskCompletion: typeof processTaskCompletion;
    calculateReplenishmentMetrics: typeof calculateReplenishmentMetrics;
    analyzeZonePerformance: typeof analyzeZonePerformance;
    calculateServiceLevel: typeof calculateServiceLevel;
    generateEfficiencyReport: typeof generateEfficiencyReport;
    identifyReplenishmentBottlenecks: typeof identifyReplenishmentBottlenecks;
    forecastReplenishmentDemand: typeof forecastReplenishmentDemand;
    exportReplenishmentToCSV: typeof exportReplenishmentToCSV;
};
export default _default;
//# sourceMappingURL=warehouse-replenishment-kit.d.ts.map