/**
 * LOC: LOG-PICK-001
 * File: /reuse/logistics/outbound-order-picking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse controllers
 *   - Order fulfillment services
 *   - Picking operations
 *   - Wave management services
 */
/**
 * Wave status enumeration
 */
export declare enum WaveStatus {
    PLANNED = "PLANNED",
    RELEASED = "RELEASED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ON_HOLD = "ON_HOLD"
}
/**
 * Pick task status enumeration
 */
export declare enum PickTaskStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    PICKED = "PICKED",
    VERIFIED = "VERIFIED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    EXCEPTION = "EXCEPTION"
}
/**
 * Picking strategy types
 */
export declare enum PickingStrategy {
    DISCRETE = "DISCRETE",// Pick one order at a time
    BATCH = "BATCH",// Pick multiple orders together
    ZONE = "ZONE",// Pick within assigned zones
    WAVE = "WAVE",// Pick entire waves
    CLUSTER = "CLUSTER"
}
/**
 * Pick priority levels
 */
export declare enum PickPriority {
    URGENT = "URGENT",
    HIGH = "HIGH",
    NORMAL = "NORMAL",
    LOW = "LOW"
}
/**
 * Pick verification method
 */
export declare enum VerificationMethod {
    BARCODE_SCAN = "BARCODE_SCAN",
    RFID = "RFID",
    MANUAL = "MANUAL",
    VISUAL = "VISUAL",
    WEIGHT = "WEIGHT"
}
/**
 * Exception types
 */
export declare enum PickExceptionType {
    SHORT_PICK = "SHORT_PICK",
    DAMAGED_ITEM = "DAMAGED_ITEM",
    WRONG_ITEM = "WRONG_ITEM",
    LOCATION_EMPTY = "LOCATION_EMPTY",
    QUALITY_ISSUE = "QUALITY_ISSUE",
    CANNOT_LOCATE = "CANNOT_LOCATE",
    OTHER = "OTHER"
}
/**
 * Warehouse location information
 */
export interface WarehouseLocation {
    locationId: string;
    warehouseId: string;
    zone: string;
    aisle: string;
    rack: string;
    shelf: string;
    bin: string;
    barcode?: string;
    coordinates?: {
        x: number;
        y: number;
        z: number;
    };
}
/**
 * Pick wave definition
 */
export interface PickWave {
    waveId: string;
    waveNumber: string;
    warehouseId: string;
    status: WaveStatus;
    strategy: PickingStrategy;
    priority: PickPriority;
    plannedStartTime: Date;
    plannedEndTime: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    orderCount: number;
    lineCount: number;
    unitCount: number;
    pickLists: PickList[];
    criteria: WaveCriteria;
    createdBy: string;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Wave planning criteria
 */
export interface WaveCriteria {
    orderTypes?: string[];
    priorities?: PickPriority[];
    shipByDate?: Date;
    carriers?: string[];
    zones?: string[];
    maxOrders?: number;
    maxLines?: number;
    maxUnits?: number;
}
/**
 * Pick list for a batch or zone
 */
export interface PickList {
    pickListId: string;
    pickListNumber: string;
    waveId: string;
    warehouseId: string;
    strategy: PickingStrategy;
    status: PickTaskStatus;
    priority: PickPriority;
    assignedTo?: string;
    zone?: string;
    tasks: PickTask[];
    routeSequence: number[];
    estimatedTime: number;
    actualTime?: number;
    createdAt: Date;
    assignedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Individual pick task
 */
export interface PickTask {
    taskId: string;
    pickListId: string;
    orderId: string;
    orderLineId: string;
    productId: string;
    sku: string;
    description: string;
    quantityOrdered: number;
    quantityToPick: number;
    quantityPicked: number;
    uom: string;
    fromLocation: WarehouseLocation;
    toLocation?: WarehouseLocation;
    sequence: number;
    status: PickTaskStatus;
    priority: PickPriority;
    verificationMethod: VerificationMethod;
    barcode?: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    pickedBy?: string;
    pickedAt?: Date;
    verifiedBy?: string;
    verifiedAt?: Date;
    exception?: PickException;
    metadata?: Record<string, any>;
}
/**
 * Pick exception information
 */
export interface PickException {
    exceptionId: string;
    taskId: string;
    type: PickExceptionType;
    description: string;
    quantityShort?: number;
    reportedBy: string;
    reportedAt: Date;
    resolvedBy?: string;
    resolvedAt?: Date;
    resolution?: string;
    requiresAction: boolean;
}
/**
 * Pick confirmation data
 */
export interface PickConfirmation {
    confirmationId: string;
    taskId: string;
    pickListId: string;
    productId: string;
    sku: string;
    quantityConfirmed: number;
    locationConfirmed: string;
    verificationMethod: VerificationMethod;
    scanData?: string;
    weight?: number;
    confirmedBy: string;
    confirmedAt: Date;
    accuracy: number;
    discrepancies?: string[];
}
/**
 * Picker assignment
 */
export interface PickerAssignment {
    assignmentId: string;
    pickerId: string;
    pickerName: string;
    pickListId: string;
    waveId: string;
    zone?: string;
    assignedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    status: PickTaskStatus;
    tasksAssigned: number;
    tasksCompleted: number;
}
/**
 * Pick batch for multi-order picking
 */
export interface PickBatch {
    batchId: string;
    batchNumber: string;
    waveId: string;
    pickListIds: string[];
    orderIds: string[];
    strategy: PickingStrategy;
    status: PickTaskStatus;
    totalTasks: number;
    completedTasks: number;
    assignedPickers: string[];
    createdAt: Date;
    completedAt?: Date;
}
/**
 * Route optimization configuration
 */
export interface RouteOptimizationConfig {
    strategy: 'SHORTEST_PATH' | 'ZONE_BASED' | 'SERPENTINE' | 'LARGEST_GAP';
    startLocation?: WarehouseLocation;
    endLocation?: WarehouseLocation;
    avoidAisles?: string[];
    considerTraffic?: boolean;
}
/**
 * Picker performance metrics
 */
export interface PickerPerformance {
    pickerId: string;
    pickerName: string;
    period: {
        start: Date;
        end: Date;
    };
    tasksCompleted: number;
    unitsPickedCount: number;
    linesPickedCount: number;
    accuracy: number;
    averagePickTime: number;
    averageLineTime: number;
    totalHours: number;
    productivity: number;
    errorRate: number;
    exceptions: number;
}
/**
 * Pick accuracy metrics
 */
export interface PickAccuracyMetrics {
    warehouseId: string;
    period: {
        start: Date;
        end: Date;
    };
    totalPicks: number;
    accuratePicks: number;
    accuracy: number;
    shortPicks: number;
    wrongItems: number;
    damagedItems: number;
    qualityIssues: number;
    locationErrors: number;
    byPicker: Map<string, number>;
    byZone: Map<string, number>;
}
/**
 * Wave performance metrics
 */
export interface WavePerformanceMetrics {
    waveId: string;
    waveNumber: string;
    plannedDuration: number;
    actualDuration: number;
    efficiency: number;
    ordersFulfilled: number;
    linesFulfilled: number;
    unitsFulfilled: number;
    accuracy: number;
    pickersUtilized: number;
    averagePickTime: number;
    exceptionsCount: number;
}
/**
 * 1. Creates a new pick wave with planning criteria.
 *
 * @param {string} warehouseId - Warehouse ID
 * @param {WaveCriteria} criteria - Wave planning criteria
 * @param {PickingStrategy} strategy - Picking strategy
 * @param {string} createdBy - User creating the wave
 * @returns {PickWave} New pick wave
 *
 * @example
 * ```typescript
 * const wave = createPickWave('WH-001', {
 *   priorities: [PickPriority.URGENT, PickPriority.HIGH],
 *   shipByDate: new Date('2024-12-31'),
 *   maxOrders: 50,
 *   zones: ['A', 'B']
 * }, PickingStrategy.WAVE, 'USER-123');
 * ```
 */
export declare function createPickWave(warehouseId: string, criteria: WaveCriteria, strategy: PickingStrategy, createdBy: string): PickWave;
/**
 * 2. Adds orders to a pick wave based on criteria.
 *
 * @param {PickWave} wave - Pick wave
 * @param {any[]} orders - Orders to evaluate
 * @returns {PickWave} Updated wave with orders
 *
 * @example
 * ```typescript
 * const updated = addOrdersToWave(wave, availableOrders);
 * ```
 */
export declare function addOrdersToWave(wave: PickWave, orders: any[]): PickWave;
/**
 * 3. Optimizes wave by balancing workload across zones.
 *
 * @param {PickWave} wave - Pick wave to optimize
 * @param {any[]} orders - Orders in wave
 * @returns {object} Optimization result
 *
 * @example
 * ```typescript
 * const result = optimizeWaveWorkload(wave, orders);
 * console.log(`Balanced across ${result.zones.length} zones`);
 * ```
 */
export declare function optimizeWaveWorkload(wave: PickWave, orders: any[]): {
    zones: string[];
    workloadByZone: Map<string, number>;
    estimatedTimeByZone: Map<string, number>;
    balanced: boolean;
};
/**
 * 4. Releases wave for picking execution.
 *
 * @param {PickWave} wave - Wave to release
 * @param {string} releasedBy - User releasing the wave
 * @returns {PickWave} Released wave
 *
 * @example
 * ```typescript
 * const released = releaseWave(wave, 'SUPERVISOR-001');
 * ```
 */
export declare function releaseWave(wave: PickWave, releasedBy: string): PickWave;
/**
 * 5. Calculates wave capacity and utilization.
 *
 * @param {PickWave} wave - Pick wave
 * @param {number} maxCapacity - Maximum capacity (units)
 * @returns {object} Capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = calculateWaveCapacity(wave, 1000);
 * console.log(`Wave is ${capacity.utilizationPercent}% full`);
 * ```
 */
export declare function calculateWaveCapacity(wave: PickWave, maxCapacity: number): {
    currentUnits: number;
    maxCapacity: number;
    available: number;
    utilizationPercent: number;
    canAddOrders: boolean;
};
/**
 * 6. Prioritizes waves based on urgency and deadlines.
 *
 * @param {PickWave[]} waves - Waves to prioritize
 * @returns {PickWave[]} Sorted waves by priority
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeWaves(allWaves);
 * // Process highest priority first
 * ```
 */
export declare function prioritizeWaves(waves: PickWave[]): PickWave[];
/**
 * 7. Splits large wave into smaller manageable waves.
 *
 * @param {PickWave} wave - Wave to split
 * @param {number} maxOrdersPerWave - Maximum orders per split
 * @returns {PickWave[]} Split waves
 *
 * @example
 * ```typescript
 * const splitWaves = splitWave(largeWave, 25);
 * console.log(`Split into ${splitWaves.length} waves`);
 * ```
 */
export declare function splitWave(wave: PickWave, maxOrdersPerWave: number): PickWave[];
/**
 * 8. Merges multiple waves into a single wave.
 *
 * @param {PickWave[]} waves - Waves to merge
 * @param {string} mergedBy - User merging waves
 * @returns {PickWave} Merged wave
 *
 * @example
 * ```typescript
 * const merged = mergeWaves([wave1, wave2, wave3], 'SUPERVISOR-001');
 * ```
 */
export declare function mergeWaves(waves: PickWave[], mergedBy: string): PickWave;
/**
 * 9. Cancels a wave and releases inventory.
 *
 * @param {PickWave} wave - Wave to cancel
 * @param {string} reason - Cancellation reason
 * @param {string} cancelledBy - User cancelling the wave
 * @returns {PickWave} Cancelled wave
 *
 * @example
 * ```typescript
 * const cancelled = cancelWave(wave, 'Orders postponed', 'SUPERVISOR-001');
 * ```
 */
export declare function cancelWave(wave: PickWave, reason: string, cancelledBy: string): PickWave;
/**
 * 10. Generates pick lists from wave based on strategy.
 *
 * @param {PickWave} wave - Pick wave
 * @param {any[]} orders - Orders in wave
 * @param {PickingStrategy} strategy - Picking strategy
 * @returns {PickList[]} Generated pick lists
 *
 * @example
 * ```typescript
 * const pickLists = generatePickLists(wave, orders, PickingStrategy.ZONE);
 * ```
 */
export declare function generatePickLists(wave: PickWave, orders: any[], strategy: PickingStrategy): PickList[];
/**
 * 11. Creates pick tasks from order line items.
 *
 * @param {string} pickListId - Pick list ID
 * @param {any[]} orderLines - Order line items
 * @returns {PickTask[]} Pick tasks
 *
 * @example
 * ```typescript
 * const tasks = createPickTasks('PL-001', orderLines);
 * ```
 */
export declare function createPickTasks(pickListId: string, orderLines: any[]): PickTask[];
/**
 * 12. Optimizes pick list route for efficient picking.
 *
 * @param {PickList} pickList - Pick list to optimize
 * @param {RouteOptimizationConfig} config - Optimization config
 * @returns {PickList} Optimized pick list
 *
 * @example
 * ```typescript
 * const optimized = optimizePickRoute(pickList, {
 *   strategy: 'SERPENTINE',
 *   considerTraffic: true
 * });
 * ```
 */
export declare function optimizePickRoute(pickList: PickList, config: RouteOptimizationConfig): PickList;
/**
 * 13. Allocates inventory to pick tasks.
 *
 * @param {PickTask[]} tasks - Pick tasks
 * @param {any[]} inventory - Available inventory
 * @returns {object} Allocation result
 *
 * @example
 * ```typescript
 * const result = allocateInventoryToTasks(tasks, inventory);
 * console.log(`Allocated ${result.allocated} of ${result.required} units`);
 * ```
 */
export declare function allocateInventoryToTasks(tasks: PickTask[], inventory: any[]): {
    allocated: number;
    required: number;
    shortages: PickTask[];
    allocations: Map<string, any[]>;
};
/**
 * 14. Batches multiple orders for efficient picking.
 *
 * @param {any[]} orders - Orders to batch
 * @param {number} maxOrdersPerBatch - Maximum orders per batch
 * @returns {any[][]} Batched orders
 *
 * @example
 * ```typescript
 * const batches = batchOrders(orders, 5);
 * ```
 */
export declare function batchOrders(orders: any[], maxOrdersPerBatch: number): any[][];
/**
 * 15. Assigns pick list to picker.
 *
 * @param {PickList} pickList - Pick list to assign
 * @param {string} pickerId - Picker ID
 * @returns {PickerAssignment} Assignment record
 *
 * @example
 * ```typescript
 * const assignment = assignPickList(pickList, 'PICKER-001');
 * ```
 */
export declare function assignPickList(pickList: PickList, pickerId: string): PickerAssignment;
/**
 * 16. Groups pick tasks by zone for zone picking.
 *
 * @param {PickTask[]} tasks - All pick tasks
 * @returns {Map<string, PickTask[]>} Tasks grouped by zone
 *
 * @example
 * ```typescript
 * const zoneGroups = groupTasksByZone(tasks);
 * for (const [zone, zoneTasks] of zoneGroups) {
 *   console.log(`Zone ${zone}: ${zoneTasks.length} tasks`);
 * }
 * ```
 */
export declare function groupTasksByZone(tasks: PickTask[]): Map<string, PickTask[]>;
/**
 * 17. Calculates estimated pick time for pick list.
 *
 * @param {PickList} pickList - Pick list
 * @returns {number} Estimated time in minutes
 *
 * @example
 * ```typescript
 * const estimatedTime = calculatePickListTime(pickList);
 * console.log(`Estimated ${estimatedTime} minutes`);
 * ```
 */
export declare function calculatePickListTime(pickList: PickList): number;
/**
 * 18. Generates picking labels for tasks.
 *
 * @param {PickTask} task - Pick task
 * @returns {object} Label data
 *
 * @example
 * ```typescript
 * const label = generatePickingLabel(task);
 * // Print or display label
 * ```
 */
export declare function generatePickingLabel(task: PickTask): {
    taskId: string;
    orderNumber: string;
    sku: string;
    description: string;
    quantity: number;
    location: string;
    barcode: string;
    sequence: number;
};
/**
 * 19. Starts pick task execution.
 *
 * @param {PickTask} task - Pick task to start
 * @param {string} pickerId - Picker ID
 * @returns {PickTask} Started task
 *
 * @example
 * ```typescript
 * const started = startPickTask(task, 'PICKER-001');
 * ```
 */
export declare function startPickTask(task: PickTask, pickerId: string): PickTask;
/**
 * 20. Completes pick task with quantity picked.
 *
 * @param {PickTask} task - Pick task
 * @param {number} quantityPicked - Actual quantity picked
 * @param {string} pickerId - Picker ID
 * @returns {PickTask} Completed task
 *
 * @example
 * ```typescript
 * const completed = completePickTask(task, 10, 'PICKER-001');
 * ```
 */
export declare function completePickTask(task: PickTask, quantityPicked: number, pickerId: string): PickTask;
/**
 * 21. Verifies picked item with barcode scan.
 *
 * @param {PickTask} task - Pick task
 * @param {string} scannedBarcode - Scanned barcode
 * @param {string} verifiedBy - Verifier ID
 * @returns {object} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyPickedItem(task, scannedBarcode, 'PICKER-001');
 * if (!result.verified) {
 *   console.error(result.error);
 * }
 * ```
 */
export declare function verifyPickedItem(task: PickTask, scannedBarcode: string, verifiedBy: string): {
    verified: boolean;
    error?: string;
    task: PickTask;
};
/**
 * 22. Handles partial pick (short pick).
 *
 * @param {PickTask} task - Pick task
 * @param {number} quantityAvailable - Quantity available
 * @param {string} reason - Reason for short pick
 * @param {string} pickerId - Picker ID
 * @returns {PickTask} Updated task with exception
 *
 * @example
 * ```typescript
 * const updated = handlePartialPick(task, 5, 'Only 5 units in location', 'PICKER-001');
 * ```
 */
export declare function handlePartialPick(task: PickTask, quantityAvailable: number, reason: string, pickerId: string): PickTask;
/**
 * 23. Handles item substitution during picking.
 *
 * @param {PickTask} task - Original pick task
 * @param {string} substituteProductId - Substitute product ID
 * @param {string} substituteSku - Substitute SKU
 * @param {string} pickerId - Picker ID
 * @returns {PickTask} Updated task with substitution
 *
 * @example
 * ```typescript
 * const substituted = handleItemSubstitution(task, 'PROD-002', 'SKU-002', 'PICKER-001');
 * ```
 */
export declare function handleItemSubstitution(task: PickTask, substituteProductId: string, substituteSku: string, pickerId: string): PickTask;
/**
 * 24. Records damaged item exception.
 *
 * @param {PickTask} task - Pick task
 * @param {number} damagedQuantity - Quantity damaged
 * @param {string} description - Damage description
 * @param {string} reportedBy - Reporter ID
 * @returns {PickException} Exception record
 *
 * @example
 * ```typescript
 * const exception = recordDamagedItem(task, 2, 'Box crushed', 'PICKER-001');
 * ```
 */
export declare function recordDamagedItem(task: PickTask, damagedQuantity: number, description: string, reportedBy: string): PickException;
/**
 * 25. Handles location empty exception.
 *
 * @param {PickTask} task - Pick task
 * @param {string} pickerId - Picker ID
 * @returns {PickTask} Updated task with exception
 *
 * @example
 * ```typescript
 * const updated = handleLocationEmpty(task, 'PICKER-001');
 * ```
 */
export declare function handleLocationEmpty(task: PickTask, pickerId: string): PickTask;
/**
 * 26. Skips pick task with reason.
 *
 * @param {PickTask} task - Pick task to skip
 * @param {string} reason - Skip reason
 * @param {string} skippedBy - User skipping task
 * @returns {PickTask} Skipped task
 *
 * @example
 * ```typescript
 * const skipped = skipPickTask(task, 'Item not found', 'PICKER-001');
 * ```
 */
export declare function skipPickTask(task: PickTask, reason: string, skippedBy: string): PickTask;
/**
 * 27. Resumes paused pick task.
 *
 * @param {PickTask} task - Paused task
 * @param {string} pickerId - Picker ID
 * @returns {PickTask} Resumed task
 *
 * @example
 * ```typescript
 * const resumed = resumePickTask(pausedTask, 'PICKER-001');
 * ```
 */
export declare function resumePickTask(task: PickTask, pickerId: string): PickTask;
/**
 * 28. Creates pick confirmation record.
 *
 * @param {PickTask} task - Completed pick task
 * @param {VerificationMethod} method - Verification method
 * @param {string} scanData - Scan data (barcode, RFID, etc.)
 * @returns {PickConfirmation} Confirmation record
 *
 * @example
 * ```typescript
 * const confirmation = createPickConfirmation(task, VerificationMethod.BARCODE_SCAN, 'SKU-12345');
 * ```
 */
export declare function createPickConfirmation(task: PickTask, method: VerificationMethod, scanData?: string): PickConfirmation;
/**
 * 29. Validates pick confirmation against task.
 *
 * @param {PickConfirmation} confirmation - Pick confirmation
 * @param {PickTask} task - Original task
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePickConfirmation(confirmation, task);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validatePickConfirmation(confirmation: PickConfirmation, task: PickTask): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 30. Consolidates multiple pick confirmations.
 *
 * @param {PickConfirmation[]} confirmations - Pick confirmations
 * @returns {object} Consolidated summary
 *
 * @example
 * ```typescript
 * const summary = consolidatePickConfirmations(allConfirmations);
 * ```
 */
export declare function consolidatePickConfirmations(confirmations: PickConfirmation[]): {
    totalTasks: number;
    totalUnits: number;
    accurateCount: number;
    discrepancyCount: number;
    overallAccuracy: number;
    byVerificationMethod: Map<VerificationMethod, number>;
};
/**
 * 31. Performs quality check on picked items.
 *
 * @param {PickTask} task - Pick task
 * @param {object} qualityChecks - Quality check criteria
 * @returns {object} Quality check result
 *
 * @example
 * ```typescript
 * const result = performQualityCheck(task, {
 *   checkExpiry: true,
 *   checkDamage: true,
 *   checkQuantity: true
 * });
 * ```
 */
export declare function performQualityCheck(task: PickTask, qualityChecks: {
    checkExpiry?: boolean;
    checkDamage?: boolean;
    checkQuantity?: boolean;
    checkBarcode?: boolean;
}): {
    passed: boolean;
    checks: Array<{
        name: string;
        passed: boolean;
        notes?: string;
    }>;
};
/**
 * 32. Resolves pick exception.
 *
 * @param {PickException} exception - Exception to resolve
 * @param {string} resolution - Resolution description
 * @param {string} resolvedBy - Resolver ID
 * @returns {PickException} Resolved exception
 *
 * @example
 * ```typescript
 * const resolved = resolvePickException(exception, 'Inventory replenished', 'SUPERVISOR-001');
 * ```
 */
export declare function resolvePickException(exception: PickException, resolution: string, resolvedBy: string): PickException;
/**
 * 33. Escalates unresolved exception.
 *
 * @param {PickException} exception - Exception to escalate
 * @param {string} escalatedTo - Escalation target
 * @param {string} notes - Escalation notes
 * @returns {PickException} Escalated exception
 *
 * @example
 * ```typescript
 * const escalated = escalateException(exception, 'WAREHOUSE-MANAGER', 'Requires manager approval');
 * ```
 */
export declare function escalateException(exception: PickException, escalatedTo: string, notes: string): PickException;
/**
 * 34. Generates exception report for pick list.
 *
 * @param {PickList} pickList - Pick list
 * @returns {object} Exception report
 *
 * @example
 * ```typescript
 * const report = generateExceptionReport(pickList);
 * console.log(`${report.exceptionCount} exceptions found`);
 * ```
 */
export declare function generateExceptionReport(pickList: PickList): {
    pickListId: string;
    exceptionCount: number;
    unresolvedCount: number;
    byType: Map<PickExceptionType, number>;
    exceptions: PickException[];
};
/**
 * 35. Validates pick list completion.
 *
 * @param {PickList} pickList - Pick list to validate
 * @returns {object} Completion validation
 *
 * @example
 * ```typescript
 * const validation = validatePickListCompletion(pickList);
 * if (!validation.complete) {
 *   console.log('Incomplete tasks:', validation.incompleteTasks);
 * }
 * ```
 */
export declare function validatePickListCompletion(pickList: PickList): {
    complete: boolean;
    totalTasks: number;
    completedTasks: number;
    incompleteTasks: PickTask[];
    exceptions: number;
};
/**
 * 36. Completes pick list after all tasks done.
 *
 * @param {PickList} pickList - Pick list to complete
 * @param {string} completedBy - User completing list
 * @returns {PickList} Completed pick list
 *
 * @example
 * ```typescript
 * const completed = completePickList(pickList, 'PICKER-001');
 * ```
 */
export declare function completePickList(pickList: PickList, completedBy: string): PickList;
/**
 * 37. Calculates picker performance metrics.
 *
 * @param {string} pickerId - Picker ID
 * @param {PickList[]} pickLists - Completed pick lists
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {PickerPerformance} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = calculatePickerPerformance('PICKER-001', pickLists, startDate, endDate);
 * console.log(`Accuracy: ${(performance.accuracy * 100).toFixed(2)}%`);
 * ```
 */
export declare function calculatePickerPerformance(pickerId: string, pickLists: PickList[], startDate: Date, endDate: Date): PickerPerformance;
/**
 * 38. Calculates pick accuracy metrics for warehouse.
 *
 * @param {string} warehouseId - Warehouse ID
 * @param {PickConfirmation[]} confirmations - Pick confirmations
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {PickAccuracyMetrics} Accuracy metrics
 *
 * @example
 * ```typescript
 * const accuracy = calculatePickAccuracy('WH-001', confirmations, startDate, endDate);
 * console.log(`Overall accuracy: ${(accuracy.accuracy * 100).toFixed(2)}%`);
 * ```
 */
export declare function calculatePickAccuracy(warehouseId: string, confirmations: PickConfirmation[], startDate: Date, endDate: Date): PickAccuracyMetrics;
/**
 * 39. Calculates wave performance metrics.
 *
 * @param {PickWave} wave - Completed pick wave
 * @returns {WavePerformanceMetrics} Wave metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateWavePerformance(wave);
 * console.log(`Wave efficiency: ${(metrics.efficiency * 100).toFixed(2)}%`);
 * ```
 */
export declare function calculateWavePerformance(wave: PickWave): WavePerformanceMetrics;
/**
 * 40. Generates productivity report for date range.
 *
 * @param {PickList[]} pickLists - All pick lists
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {object} Productivity report
 *
 * @example
 * ```typescript
 * const report = generateProductivityReport(pickLists, startDate, endDate);
 * ```
 */
export declare function generateProductivityReport(pickLists: PickList[], startDate: Date, endDate: Date): {
    period: {
        start: Date;
        end: Date;
    };
    totalPickLists: number;
    totalTasks: number;
    totalUnits: number;
    totalHours: number;
    unitsPerHour: number;
    tasksPerHour: number;
    averagePickListTime: number;
    completionRate: number;
};
/**
 * 41. Compares picker performance rankings.
 *
 * @param {PickerPerformance[]} performances - All picker performances
 * @returns {object[]} Ranked pickers
 *
 * @example
 * ```typescript
 * const rankings = rankPickerPerformance(allPerformances);
 * console.log('Top performer:', rankings[0].pickerName);
 * ```
 */
export declare function rankPickerPerformance(performances: PickerPerformance[]): Array<{
    rank: number;
    pickerId: string;
    pickerName: string;
    productivity: number;
    accuracy: number;
    score: number;
}>;
/**
 * 42. Analyzes pick time distribution.
 *
 * @param {PickTask[]} tasks - Completed pick tasks
 * @returns {object} Time distribution analysis
 *
 * @example
 * ```typescript
 * const distribution = analyzePickTimeDistribution(tasks);
 * ```
 */
export declare function analyzePickTimeDistribution(tasks: PickTask[]): {
    averageSeconds: number;
    medianSeconds: number;
    minSeconds: number;
    maxSeconds: number;
    standardDeviation: number;
    percentiles: {
        p50: number;
        p75: number;
        p90: number;
        p95: number;
        p99: number;
    };
};
/**
 * 43. Identifies bottlenecks in picking operations.
 *
 * @param {PickList[]} pickLists - All pick lists
 * @returns {object} Bottleneck analysis
 *
 * @example
 * ```typescript
 * const bottlenecks = identifyPickingBottlenecks(pickLists);
 * console.log('Slowest zones:', bottlenecks.slowestZones);
 * ```
 */
export declare function identifyPickingBottlenecks(pickLists: PickList[]): {
    slowestZones: Array<{
        zone: string;
        averageTime: number;
    }>;
    slowestProducts: Array<{
        sku: string;
        averageTime: number;
    }>;
    highExceptionZones: Array<{
        zone: string;
        exceptionRate: number;
    }>;
    congestionPoints: Array<{
        location: string;
        taskCount: number;
    }>;
};
/**
 * 44. Exports pick metrics to CSV format.
 *
 * @param {PickerPerformance[]} performances - Picker performances
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportPickMetricsToCSV(performances);
 * // Save to file or send to client
 * ```
 */
export declare function exportPickMetricsToCSV(performances: PickerPerformance[]): string;
declare const _default: {
    createPickWave: typeof createPickWave;
    addOrdersToWave: typeof addOrdersToWave;
    optimizeWaveWorkload: typeof optimizeWaveWorkload;
    releaseWave: typeof releaseWave;
    calculateWaveCapacity: typeof calculateWaveCapacity;
    prioritizeWaves: typeof prioritizeWaves;
    splitWave: typeof splitWave;
    mergeWaves: typeof mergeWaves;
    cancelWave: typeof cancelWave;
    generatePickLists: typeof generatePickLists;
    createPickTasks: typeof createPickTasks;
    optimizePickRoute: typeof optimizePickRoute;
    allocateInventoryToTasks: typeof allocateInventoryToTasks;
    batchOrders: typeof batchOrders;
    assignPickList: typeof assignPickList;
    groupTasksByZone: typeof groupTasksByZone;
    calculatePickListTime: typeof calculatePickListTime;
    generatePickingLabel: typeof generatePickingLabel;
    startPickTask: typeof startPickTask;
    completePickTask: typeof completePickTask;
    verifyPickedItem: typeof verifyPickedItem;
    handlePartialPick: typeof handlePartialPick;
    handleItemSubstitution: typeof handleItemSubstitution;
    recordDamagedItem: typeof recordDamagedItem;
    handleLocationEmpty: typeof handleLocationEmpty;
    skipPickTask: typeof skipPickTask;
    resumePickTask: typeof resumePickTask;
    createPickConfirmation: typeof createPickConfirmation;
    validatePickConfirmation: typeof validatePickConfirmation;
    consolidatePickConfirmations: typeof consolidatePickConfirmations;
    performQualityCheck: typeof performQualityCheck;
    resolvePickException: typeof resolvePickException;
    escalateException: typeof escalateException;
    generateExceptionReport: typeof generateExceptionReport;
    validatePickListCompletion: typeof validatePickListCompletion;
    completePickList: typeof completePickList;
    calculatePickerPerformance: typeof calculatePickerPerformance;
    calculatePickAccuracy: typeof calculatePickAccuracy;
    calculateWavePerformance: typeof calculateWavePerformance;
    generateProductivityReport: typeof generateProductivityReport;
    rankPickerPerformance: typeof rankPickerPerformance;
    analyzePickTimeDistribution: typeof analyzePickTimeDistribution;
    identifyPickingBottlenecks: typeof identifyPickingBottlenecks;
    exportPickMetricsToCSV: typeof exportPickMetricsToCSV;
};
export default _default;
//# sourceMappingURL=outbound-order-picking-kit.d.ts.map