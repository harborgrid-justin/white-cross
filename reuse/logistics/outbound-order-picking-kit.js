"use strict";
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
exports.PickExceptionType = exports.VerificationMethod = exports.PickPriority = exports.PickingStrategy = exports.PickTaskStatus = exports.WaveStatus = void 0;
exports.createPickWave = createPickWave;
exports.addOrdersToWave = addOrdersToWave;
exports.optimizeWaveWorkload = optimizeWaveWorkload;
exports.releaseWave = releaseWave;
exports.calculateWaveCapacity = calculateWaveCapacity;
exports.prioritizeWaves = prioritizeWaves;
exports.splitWave = splitWave;
exports.mergeWaves = mergeWaves;
exports.cancelWave = cancelWave;
exports.generatePickLists = generatePickLists;
exports.createPickTasks = createPickTasks;
exports.optimizePickRoute = optimizePickRoute;
exports.allocateInventoryToTasks = allocateInventoryToTasks;
exports.batchOrders = batchOrders;
exports.assignPickList = assignPickList;
exports.groupTasksByZone = groupTasksByZone;
exports.calculatePickListTime = calculatePickListTime;
exports.generatePickingLabel = generatePickingLabel;
exports.startPickTask = startPickTask;
exports.completePickTask = completePickTask;
exports.verifyPickedItem = verifyPickedItem;
exports.handlePartialPick = handlePartialPick;
exports.handleItemSubstitution = handleItemSubstitution;
exports.recordDamagedItem = recordDamagedItem;
exports.handleLocationEmpty = handleLocationEmpty;
exports.skipPickTask = skipPickTask;
exports.resumePickTask = resumePickTask;
exports.createPickConfirmation = createPickConfirmation;
exports.validatePickConfirmation = validatePickConfirmation;
exports.consolidatePickConfirmations = consolidatePickConfirmations;
exports.performQualityCheck = performQualityCheck;
exports.resolvePickException = resolvePickException;
exports.escalateException = escalateException;
exports.generateExceptionReport = generateExceptionReport;
exports.validatePickListCompletion = validatePickListCompletion;
exports.completePickList = completePickList;
exports.calculatePickerPerformance = calculatePickerPerformance;
exports.calculatePickAccuracy = calculatePickAccuracy;
exports.calculateWavePerformance = calculateWavePerformance;
exports.generateProductivityReport = generateProductivityReport;
exports.rankPickerPerformance = rankPickerPerformance;
exports.analyzePickTimeDistribution = analyzePickTimeDistribution;
exports.identifyPickingBottlenecks = identifyPickingBottlenecks;
exports.exportPickMetricsToCSV = exportPickMetricsToCSV;
/**
 * File: /reuse/logistics/outbound-order-picking-kit.ts
 * Locator: WC-LOGISTICS-PICK-001
 * Purpose: Comprehensive Order Picking and Wave Management - Complete picking operations for warehouse management
 *
 * Upstream: Independent utility module for warehouse picking operations
 * Downstream: ../backend/logistics/*, WMS modules, Order fulfillment services, Picking operations
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 44 utility functions for wave planning, pick list generation, pick execution, confirmation, and metrics
 *
 * LLM Context: Enterprise-grade warehouse picking and wave management utilities to compete with Oracle JDE.
 * Provides comprehensive wave planning, pick list generation, multi-strategy picking (zone, batch, wave),
 * pick task execution, real-time verification, accuracy tracking, picker performance metrics, route optimization,
 * exception handling, and quality control for warehouse operations.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Wave status enumeration
 */
var WaveStatus;
(function (WaveStatus) {
    WaveStatus["PLANNED"] = "PLANNED";
    WaveStatus["RELEASED"] = "RELEASED";
    WaveStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WaveStatus["COMPLETED"] = "COMPLETED";
    WaveStatus["CANCELLED"] = "CANCELLED";
    WaveStatus["ON_HOLD"] = "ON_HOLD";
})(WaveStatus || (exports.WaveStatus = WaveStatus = {}));
/**
 * Pick task status enumeration
 */
var PickTaskStatus;
(function (PickTaskStatus) {
    PickTaskStatus["PENDING"] = "PENDING";
    PickTaskStatus["ASSIGNED"] = "ASSIGNED";
    PickTaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PickTaskStatus["PICKED"] = "PICKED";
    PickTaskStatus["VERIFIED"] = "VERIFIED";
    PickTaskStatus["COMPLETED"] = "COMPLETED";
    PickTaskStatus["CANCELLED"] = "CANCELLED";
    PickTaskStatus["EXCEPTION"] = "EXCEPTION";
})(PickTaskStatus || (exports.PickTaskStatus = PickTaskStatus = {}));
/**
 * Picking strategy types
 */
var PickingStrategy;
(function (PickingStrategy) {
    PickingStrategy["DISCRETE"] = "DISCRETE";
    PickingStrategy["BATCH"] = "BATCH";
    PickingStrategy["ZONE"] = "ZONE";
    PickingStrategy["WAVE"] = "WAVE";
    PickingStrategy["CLUSTER"] = "CLUSTER";
})(PickingStrategy || (exports.PickingStrategy = PickingStrategy = {}));
/**
 * Pick priority levels
 */
var PickPriority;
(function (PickPriority) {
    PickPriority["URGENT"] = "URGENT";
    PickPriority["HIGH"] = "HIGH";
    PickPriority["NORMAL"] = "NORMAL";
    PickPriority["LOW"] = "LOW";
})(PickPriority || (exports.PickPriority = PickPriority = {}));
/**
 * Pick verification method
 */
var VerificationMethod;
(function (VerificationMethod) {
    VerificationMethod["BARCODE_SCAN"] = "BARCODE_SCAN";
    VerificationMethod["RFID"] = "RFID";
    VerificationMethod["MANUAL"] = "MANUAL";
    VerificationMethod["VISUAL"] = "VISUAL";
    VerificationMethod["WEIGHT"] = "WEIGHT";
})(VerificationMethod || (exports.VerificationMethod = VerificationMethod = {}));
/**
 * Exception types
 */
var PickExceptionType;
(function (PickExceptionType) {
    PickExceptionType["SHORT_PICK"] = "SHORT_PICK";
    PickExceptionType["DAMAGED_ITEM"] = "DAMAGED_ITEM";
    PickExceptionType["WRONG_ITEM"] = "WRONG_ITEM";
    PickExceptionType["LOCATION_EMPTY"] = "LOCATION_EMPTY";
    PickExceptionType["QUALITY_ISSUE"] = "QUALITY_ISSUE";
    PickExceptionType["CANNOT_LOCATE"] = "CANNOT_LOCATE";
    PickExceptionType["OTHER"] = "OTHER";
})(PickExceptionType || (exports.PickExceptionType = PickExceptionType = {}));
// ============================================================================
// SECTION 1: WAVE PLANNING (Functions 1-9)
// ============================================================================
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
function createPickWave(warehouseId, criteria, strategy, createdBy) {
    const waveId = generateWaveId();
    const waveNumber = generateWaveNumber(warehouseId);
    return {
        waveId,
        waveNumber,
        warehouseId,
        status: WaveStatus.PLANNED,
        strategy,
        priority: determinePriority(criteria),
        plannedStartTime: new Date(),
        plannedEndTime: calculatePlannedEndTime(criteria),
        orderCount: 0,
        lineCount: 0,
        unitCount: 0,
        pickLists: [],
        criteria,
        createdBy,
        createdAt: new Date(),
    };
}
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
function addOrdersToWave(wave, orders) {
    const eligibleOrders = filterOrdersByCriteria(orders, wave.criteria);
    let orderCount = 0;
    let lineCount = 0;
    let unitCount = 0;
    for (const order of eligibleOrders) {
        if (wave.criteria.maxOrders && orderCount >= wave.criteria.maxOrders)
            break;
        if (wave.criteria.maxLines && lineCount >= wave.criteria.maxLines)
            break;
        if (wave.criteria.maxUnits && unitCount >= wave.criteria.maxUnits)
            break;
        orderCount++;
        lineCount += order.lineItems?.length || 0;
        unitCount += order.lineItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    }
    return {
        ...wave,
        orderCount,
        lineCount,
        unitCount,
        metadata: {
            ...wave.metadata,
            orders: eligibleOrders.slice(0, orderCount).map((o) => o.orderId),
        },
    };
}
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
function optimizeWaveWorkload(wave, orders) {
    const workloadByZone = new Map();
    const estimatedTimeByZone = new Map();
    // Group tasks by zone
    for (const order of orders) {
        for (const line of order.lineItems || []) {
            const zone = line.location?.zone || 'UNASSIGNED';
            workloadByZone.set(zone, (workloadByZone.get(zone) || 0) + (line.quantity || 0));
            // Estimate 6 seconds per unit pick
            const pickTime = (line.quantity || 0) * 6;
            estimatedTimeByZone.set(zone, (estimatedTimeByZone.get(zone) || 0) + pickTime);
        }
    }
    const zones = Array.from(workloadByZone.keys());
    const workloads = Array.from(workloadByZone.values());
    const avgWorkload = workloads.reduce((sum, w) => sum + w, 0) / workloads.length;
    const balanced = workloads.every(w => Math.abs(w - avgWorkload) / avgWorkload < 0.2); // Within 20%
    return {
        zones,
        workloadByZone,
        estimatedTimeByZone,
        balanced,
    };
}
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
function releaseWave(wave, releasedBy) {
    if (wave.status !== WaveStatus.PLANNED) {
        throw new Error(`Cannot release wave with status: ${wave.status}`);
    }
    if (wave.pickLists.length === 0) {
        throw new Error('Cannot release wave without pick lists');
    }
    return {
        ...wave,
        status: WaveStatus.RELEASED,
        actualStartTime: new Date(),
        metadata: {
            ...wave.metadata,
            releasedBy,
            releasedAt: new Date(),
        },
    };
}
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
function calculateWaveCapacity(wave, maxCapacity) {
    const currentUnits = wave.unitCount;
    const available = maxCapacity - currentUnits;
    const utilizationPercent = (currentUnits / maxCapacity) * 100;
    return {
        currentUnits,
        maxCapacity,
        available,
        utilizationPercent,
        canAddOrders: available > 0 && wave.status === WaveStatus.PLANNED,
    };
}
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
function prioritizeWaves(waves) {
    return [...waves].sort((a, b) => {
        // First by priority
        const priorityOrder = {
            [PickPriority.URGENT]: 4,
            [PickPriority.HIGH]: 3,
            [PickPriority.NORMAL]: 2,
            [PickPriority.LOW]: 1,
        };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Then by planned start time
        return a.plannedStartTime.getTime() - b.plannedStartTime.getTime();
    });
}
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
function splitWave(wave, maxOrdersPerWave) {
    if (wave.orderCount <= maxOrdersPerWave) {
        return [wave];
    }
    const orderIds = (wave.metadata?.orders || []);
    const splitCount = Math.ceil(orderIds.length / maxOrdersPerWave);
    const waves = [];
    for (let i = 0; i < splitCount; i++) {
        const start = i * maxOrdersPerWave;
        const end = Math.min(start + maxOrdersPerWave, orderIds.length);
        const splitOrders = orderIds.slice(start, end);
        const splitWave = {
            ...wave,
            waveId: generateWaveId(),
            waveNumber: `${wave.waveNumber}-${i + 1}`,
            orderCount: splitOrders.length,
            pickLists: [],
            metadata: {
                ...wave.metadata,
                orders: splitOrders,
                splitFrom: wave.waveId,
                splitIndex: i + 1,
                splitTotal: splitCount,
            },
        };
        waves.push(splitWave);
    }
    return waves;
}
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
function mergeWaves(waves, mergedBy) {
    if (waves.length === 0) {
        throw new Error('Cannot merge empty wave array');
    }
    const warehouseId = waves[0].warehouseId;
    if (!waves.every(w => w.warehouseId === warehouseId)) {
        throw new Error('Cannot merge waves from different warehouses');
    }
    const allOrders = waves.flatMap(w => (w.metadata?.orders || []));
    const uniqueOrders = [...new Set(allOrders)];
    return {
        waveId: generateWaveId(),
        waveNumber: generateWaveNumber(warehouseId),
        warehouseId,
        status: WaveStatus.PLANNED,
        strategy: waves[0].strategy,
        priority: waves.reduce((max, w) => max > w.priority ? max : w.priority, PickPriority.LOW),
        plannedStartTime: new Date(Math.min(...waves.map(w => w.plannedStartTime.getTime()))),
        plannedEndTime: new Date(Math.max(...waves.map(w => w.plannedEndTime.getTime()))),
        orderCount: uniqueOrders.length,
        lineCount: waves.reduce((sum, w) => sum + w.lineCount, 0),
        unitCount: waves.reduce((sum, w) => sum + w.unitCount, 0),
        pickLists: [],
        criteria: waves[0].criteria,
        createdBy: mergedBy,
        createdAt: new Date(),
        metadata: {
            orders: uniqueOrders,
            mergedFrom: waves.map(w => w.waveId),
            mergedBy,
            mergedAt: new Date(),
        },
    };
}
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
function cancelWave(wave, reason, cancelledBy) {
    if (wave.status === WaveStatus.COMPLETED) {
        throw new Error('Cannot cancel completed wave');
    }
    return {
        ...wave,
        status: WaveStatus.CANCELLED,
        metadata: {
            ...wave.metadata,
            cancellationReason: reason,
            cancelledBy,
            cancelledAt: new Date(),
        },
    };
}
// ============================================================================
// SECTION 2: PICK LIST GENERATION (Functions 10-18)
// ============================================================================
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
function generatePickLists(wave, orders, strategy) {
    const pickLists = [];
    switch (strategy) {
        case PickingStrategy.DISCRETE:
            // One pick list per order
            for (const order of orders) {
                pickLists.push(createPickListForOrder(wave, order));
            }
            break;
        case PickingStrategy.BATCH:
            // Group orders into batches
            const batches = createOrderBatches(orders, 5); // 5 orders per batch
            for (const batch of batches) {
                pickLists.push(createPickListForBatch(wave, batch));
            }
            break;
        case PickingStrategy.ZONE:
            // Group by zone
            const zoneGroups = groupOrdersByZone(orders);
            for (const [zone, zoneOrders] of zoneGroups.entries()) {
                pickLists.push(createPickListForZone(wave, zone, zoneOrders));
            }
            break;
        case PickingStrategy.WAVE:
            // Single pick list for entire wave
            pickLists.push(createPickListForWave(wave, orders));
            break;
        case PickingStrategy.CLUSTER:
            // Cluster picking with cart zones
            const clusters = createOrderClusters(orders, 4); // 4 orders per cart
            for (const cluster of clusters) {
                pickLists.push(createPickListForCluster(wave, cluster));
            }
            break;
    }
    return pickLists;
}
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
function createPickTasks(pickListId, orderLines) {
    return orderLines.map((line, index) => ({
        taskId: generateTaskId(),
        pickListId,
        orderId: line.orderId,
        orderLineId: line.orderLineId,
        productId: line.productId,
        sku: line.sku,
        description: line.description || line.productName,
        quantityOrdered: line.quantity,
        quantityToPick: line.quantity,
        quantityPicked: 0,
        uom: line.uom || 'EA',
        fromLocation: line.location || {
            locationId: 'UNKNOWN',
            warehouseId: 'WH-001',
            zone: 'A',
            aisle: '00',
            rack: '00',
            shelf: '00',
            bin: '00',
        },
        sequence: index + 1,
        status: PickTaskStatus.PENDING,
        priority: line.priority || PickPriority.NORMAL,
        verificationMethod: VerificationMethod.BARCODE_SCAN,
        barcode: line.barcode,
        weight: line.weight,
        dimensions: line.dimensions,
    }));
}
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
function optimizePickRoute(pickList, config) {
    const tasks = [...pickList.tasks];
    switch (config.strategy) {
        case 'SHORTEST_PATH':
            tasks.sort((a, b) => {
                const distA = calculateDistanceFromStart(a.fromLocation, config.startLocation);
                const distB = calculateDistanceFromStart(b.fromLocation, config.startLocation);
                return distA - distB;
            });
            break;
        case 'ZONE_BASED':
            tasks.sort((a, b) => {
                const zoneCompare = a.fromLocation.zone.localeCompare(b.fromLocation.zone);
                if (zoneCompare !== 0)
                    return zoneCompare;
                return a.fromLocation.aisle.localeCompare(b.fromLocation.aisle);
            });
            break;
        case 'SERPENTINE':
            tasks.sort((a, b) => {
                const aisleA = parseInt(a.fromLocation.aisle) || 0;
                const aisleB = parseInt(b.fromLocation.aisle) || 0;
                if (aisleA !== aisleB)
                    return aisleA - aisleB;
                // Alternate direction for serpentine pattern
                const shelfA = parseInt(a.fromLocation.shelf) || 0;
                const shelfB = parseInt(b.fromLocation.shelf) || 0;
                return aisleA % 2 === 0 ? shelfA - shelfB : shelfB - shelfA;
            });
            break;
        case 'LARGEST_GAP':
            tasks.sort((a, b) => {
                const rackA = parseInt(a.fromLocation.rack) || 0;
                const rackB = parseInt(b.fromLocation.rack) || 0;
                return rackA - rackB;
            });
            break;
    }
    // Update sequence numbers
    tasks.forEach((task, index) => {
        task.sequence = index + 1;
    });
    const routeSequence = tasks.map(t => t.sequence);
    return {
        ...pickList,
        tasks,
        routeSequence,
        estimatedTime: calculateRouteTime(tasks),
    };
}
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
function allocateInventoryToTasks(tasks, inventory) {
    const allocations = new Map();
    const shortages = [];
    let totalAllocated = 0;
    let totalRequired = 0;
    for (const task of tasks) {
        totalRequired += task.quantityToPick;
        // Find available inventory for this SKU
        const available = inventory.filter(inv => inv.sku === task.sku &&
            inv.locationId === task.fromLocation.locationId &&
            inv.availableQuantity > 0);
        let remainingToPick = task.quantityToPick;
        const taskAllocations = [];
        for (const inv of available) {
            if (remainingToPick <= 0)
                break;
            const allocateQty = Math.min(remainingToPick, inv.availableQuantity);
            taskAllocations.push({
                inventoryId: inv.inventoryId,
                locationId: inv.locationId,
                quantity: allocateQty,
            });
            remainingToPick -= allocateQty;
            totalAllocated += allocateQty;
        }
        allocations.set(task.taskId, taskAllocations);
        if (remainingToPick > 0) {
            shortages.push({
                ...task,
                quantityToPick: remainingToPick,
            });
        }
    }
    return {
        allocated: totalAllocated,
        required: totalRequired,
        shortages,
        allocations,
    };
}
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
function batchOrders(orders, maxOrdersPerBatch) {
    const batches = [];
    for (let i = 0; i < orders.length; i += maxOrdersPerBatch) {
        batches.push(orders.slice(i, i + maxOrdersPerBatch));
    }
    return batches;
}
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
function assignPickList(pickList, pickerId) {
    return {
        assignmentId: crypto.randomUUID(),
        pickerId,
        pickerName: `Picker ${pickerId}`,
        pickListId: pickList.pickListId,
        waveId: pickList.waveId,
        zone: pickList.zone,
        assignedAt: new Date(),
        status: PickTaskStatus.ASSIGNED,
        tasksAssigned: pickList.tasks.length,
        tasksCompleted: 0,
    };
}
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
function groupTasksByZone(tasks) {
    const zoneGroups = new Map();
    for (const task of tasks) {
        const zone = task.fromLocation.zone;
        if (!zoneGroups.has(zone)) {
            zoneGroups.set(zone, []);
        }
        zoneGroups.get(zone).push(task);
    }
    return zoneGroups;
}
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
function calculatePickListTime(pickList) {
    const baseTimePerTask = 0.5; // 30 seconds per task
    const travelTimePerTask = 0.25; // 15 seconds travel between tasks
    const verificationTime = 0.17; // 10 seconds per verification
    const taskCount = pickList.tasks.length;
    const totalUnits = pickList.tasks.reduce((sum, t) => sum + t.quantityToPick, 0);
    // Base formula: (tasks * baseTime) + (travel time) + (verification time)
    const estimatedMinutes = (taskCount * baseTimePerTask) +
        (taskCount * travelTimePerTask) +
        (taskCount * verificationTime) +
        (totalUnits * 0.05); // 3 seconds per unit
    return Math.ceil(estimatedMinutes);
}
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
function generatePickingLabel(task) {
    return {
        taskId: task.taskId,
        orderNumber: task.orderId,
        sku: task.sku,
        description: task.description,
        quantity: task.quantityToPick,
        location: formatLocation(task.fromLocation),
        barcode: task.barcode || task.sku,
        sequence: task.sequence,
    };
}
// ============================================================================
// SECTION 3: PICK EXECUTION (Functions 19-27)
// ============================================================================
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
function startPickTask(task, pickerId) {
    if (task.status !== PickTaskStatus.PENDING && task.status !== PickTaskStatus.ASSIGNED) {
        throw new Error(`Cannot start task with status: ${task.status}`);
    }
    return {
        ...task,
        status: PickTaskStatus.IN_PROGRESS,
        pickedBy: pickerId,
        metadata: {
            ...task.metadata,
            startedAt: new Date(),
        },
    };
}
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
function completePickTask(task, quantityPicked, pickerId) {
    if (task.status !== PickTaskStatus.IN_PROGRESS) {
        throw new Error(`Cannot complete task with status: ${task.status}`);
    }
    const status = quantityPicked === task.quantityToPick
        ? PickTaskStatus.PICKED
        : PickTaskStatus.EXCEPTION;
    const exception = quantityPicked < task.quantityToPick
        ? createShortPickException(task, task.quantityToPick - quantityPicked, pickerId)
        : undefined;
    return {
        ...task,
        quantityPicked,
        status,
        pickedBy: pickerId,
        pickedAt: new Date(),
        exception,
    };
}
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
function verifyPickedItem(task, scannedBarcode, verifiedBy) {
    const expectedBarcode = task.barcode || task.sku;
    if (scannedBarcode !== expectedBarcode) {
        return {
            verified: false,
            error: `Barcode mismatch. Expected: ${expectedBarcode}, Scanned: ${scannedBarcode}`,
            task: {
                ...task,
                status: PickTaskStatus.EXCEPTION,
                exception: {
                    exceptionId: crypto.randomUUID(),
                    taskId: task.taskId,
                    type: PickExceptionType.WRONG_ITEM,
                    description: 'Barcode verification failed',
                    reportedBy: verifiedBy,
                    reportedAt: new Date(),
                    requiresAction: true,
                },
            },
        };
    }
    return {
        verified: true,
        task: {
            ...task,
            status: PickTaskStatus.VERIFIED,
            verifiedBy,
            verifiedAt: new Date(),
        },
    };
}
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
function handlePartialPick(task, quantityAvailable, reason, pickerId) {
    const quantityShort = task.quantityToPick - quantityAvailable;
    return {
        ...task,
        quantityPicked: quantityAvailable,
        status: PickTaskStatus.EXCEPTION,
        pickedBy: pickerId,
        pickedAt: new Date(),
        exception: {
            exceptionId: crypto.randomUUID(),
            taskId: task.taskId,
            type: PickExceptionType.SHORT_PICK,
            description: reason,
            quantityShort,
            reportedBy: pickerId,
            reportedAt: new Date(),
            requiresAction: true,
        },
    };
}
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
function handleItemSubstitution(task, substituteProductId, substituteSku, pickerId) {
    return {
        ...task,
        status: PickTaskStatus.PICKED,
        pickedBy: pickerId,
        pickedAt: new Date(),
        metadata: {
            ...task.metadata,
            originalProductId: task.productId,
            originalSku: task.sku,
            substituteProductId,
            substituteSku,
            substitutedAt: new Date(),
            substitutedBy: pickerId,
        },
    };
}
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
function recordDamagedItem(task, damagedQuantity, description, reportedBy) {
    return {
        exceptionId: crypto.randomUUID(),
        taskId: task.taskId,
        type: PickExceptionType.DAMAGED_ITEM,
        description: `${damagedQuantity} units damaged: ${description}`,
        quantityShort: damagedQuantity,
        reportedBy,
        reportedAt: new Date(),
        requiresAction: true,
    };
}
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
function handleLocationEmpty(task, pickerId) {
    return {
        ...task,
        quantityPicked: 0,
        status: PickTaskStatus.EXCEPTION,
        exception: {
            exceptionId: crypto.randomUUID(),
            taskId: task.taskId,
            type: PickExceptionType.LOCATION_EMPTY,
            description: `Location ${formatLocation(task.fromLocation)} is empty`,
            quantityShort: task.quantityToPick,
            reportedBy: pickerId,
            reportedAt: new Date(),
            requiresAction: true,
        },
    };
}
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
function skipPickTask(task, reason, skippedBy) {
    return {
        ...task,
        status: PickTaskStatus.EXCEPTION,
        exception: {
            exceptionId: crypto.randomUUID(),
            taskId: task.taskId,
            type: PickExceptionType.CANNOT_LOCATE,
            description: reason,
            reportedBy: skippedBy,
            reportedAt: new Date(),
            requiresAction: true,
        },
        metadata: {
            ...task.metadata,
            skippedBy,
            skippedAt: new Date(),
            skipReason: reason,
        },
    };
}
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
function resumePickTask(task, pickerId) {
    return {
        ...task,
        status: PickTaskStatus.IN_PROGRESS,
        pickedBy: pickerId,
        metadata: {
            ...task.metadata,
            resumedAt: new Date(),
            resumedBy: pickerId,
        },
    };
}
// ============================================================================
// SECTION 4: PICK CONFIRMATION (Functions 28-36)
// ============================================================================
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
function createPickConfirmation(task, method, scanData) {
    const accuracy = task.quantityPicked === task.quantityToPick ? 1.0 :
        task.quantityPicked / task.quantityToPick;
    const discrepancies = [];
    if (task.quantityPicked !== task.quantityToPick) {
        discrepancies.push(`Quantity mismatch: expected ${task.quantityToPick}, picked ${task.quantityPicked}`);
    }
    if (scanData && scanData !== task.barcode && scanData !== task.sku) {
        discrepancies.push(`Barcode mismatch: expected ${task.barcode || task.sku}, scanned ${scanData}`);
    }
    return {
        confirmationId: crypto.randomUUID(),
        taskId: task.taskId,
        pickListId: task.pickListId,
        productId: task.productId,
        sku: task.sku,
        quantityConfirmed: task.quantityPicked,
        locationConfirmed: formatLocation(task.fromLocation),
        verificationMethod: method,
        scanData,
        weight: task.weight,
        confirmedBy: task.pickedBy || 'UNKNOWN',
        confirmedAt: new Date(),
        accuracy,
        discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
    };
}
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
function validatePickConfirmation(confirmation, task) {
    const errors = [];
    const warnings = [];
    if (confirmation.taskId !== task.taskId) {
        errors.push('Task ID mismatch');
    }
    if (confirmation.productId !== task.productId) {
        errors.push('Product ID mismatch');
    }
    if (confirmation.sku !== task.sku) {
        errors.push('SKU mismatch');
    }
    if (confirmation.quantityConfirmed > task.quantityToPick) {
        errors.push('Confirmed quantity exceeds requested quantity');
    }
    if (confirmation.quantityConfirmed < task.quantityToPick) {
        warnings.push('Short pick detected');
    }
    if (confirmation.quantityConfirmed === 0) {
        errors.push('Zero quantity confirmed');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
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
function consolidatePickConfirmations(confirmations) {
    const totalTasks = confirmations.length;
    const totalUnits = confirmations.reduce((sum, c) => sum + c.quantityConfirmed, 0);
    const accurateCount = confirmations.filter(c => c.accuracy === 1.0).length;
    const discrepancyCount = confirmations.filter(c => c.discrepancies && c.discrepancies.length > 0).length;
    const overallAccuracy = confirmations.reduce((sum, c) => sum + c.accuracy, 0) / totalTasks;
    const byVerificationMethod = new Map();
    for (const confirmation of confirmations) {
        const count = byVerificationMethod.get(confirmation.verificationMethod) || 0;
        byVerificationMethod.set(confirmation.verificationMethod, count + 1);
    }
    return {
        totalTasks,
        totalUnits,
        accurateCount,
        discrepancyCount,
        overallAccuracy,
        byVerificationMethod,
    };
}
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
function performQualityCheck(task, qualityChecks) {
    const checks = [];
    if (qualityChecks.checkQuantity) {
        checks.push({
            name: 'Quantity Verification',
            passed: task.quantityPicked === task.quantityToPick,
            notes: task.quantityPicked !== task.quantityToPick
                ? `Expected ${task.quantityToPick}, picked ${task.quantityPicked}`
                : undefined,
        });
    }
    if (qualityChecks.checkBarcode) {
        checks.push({
            name: 'Barcode Verification',
            passed: task.status === PickTaskStatus.VERIFIED,
            notes: task.status !== PickTaskStatus.VERIFIED ? 'Barcode not verified' : undefined,
        });
    }
    if (qualityChecks.checkDamage) {
        checks.push({
            name: 'Damage Inspection',
            passed: !task.exception || task.exception.type !== PickExceptionType.DAMAGED_ITEM,
            notes: task.exception?.type === PickExceptionType.DAMAGED_ITEM
                ? 'Damaged items reported'
                : undefined,
        });
    }
    const passed = checks.every(check => check.passed);
    return {
        passed,
        checks,
    };
}
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
function resolvePickException(exception, resolution, resolvedBy) {
    return {
        ...exception,
        resolution,
        resolvedBy,
        resolvedAt: new Date(),
        requiresAction: false,
    };
}
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
function escalateException(exception, escalatedTo, notes) {
    return {
        ...exception,
        requiresAction: true,
        description: `${exception.description} [ESCALATED to ${escalatedTo}: ${notes}]`,
    };
}
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
function generateExceptionReport(pickList) {
    const exceptions = pickList.tasks
        .filter(task => task.exception)
        .map(task => task.exception);
    const byType = new Map();
    for (const exception of exceptions) {
        const count = byType.get(exception.type) || 0;
        byType.set(exception.type, count + 1);
    }
    const unresolvedCount = exceptions.filter(e => e.requiresAction).length;
    return {
        pickListId: pickList.pickListId,
        exceptionCount: exceptions.length,
        unresolvedCount,
        byType,
        exceptions,
    };
}
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
function validatePickListCompletion(pickList) {
    const totalTasks = pickList.tasks.length;
    const completedTasks = pickList.tasks.filter(t => t.status === PickTaskStatus.COMPLETED || t.status === PickTaskStatus.VERIFIED).length;
    const incompleteTasks = pickList.tasks.filter(t => t.status !== PickTaskStatus.COMPLETED && t.status !== PickTaskStatus.VERIFIED);
    const exceptions = pickList.tasks.filter(t => t.exception && t.exception.requiresAction).length;
    return {
        complete: incompleteTasks.length === 0 && exceptions === 0,
        totalTasks,
        completedTasks,
        incompleteTasks,
        exceptions,
    };
}
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
function completePickList(pickList, completedBy) {
    const validation = validatePickListCompletion(pickList);
    if (!validation.complete) {
        throw new Error(`Cannot complete pick list: ${validation.incompleteTasks.length} incomplete tasks, ${validation.exceptions} unresolved exceptions`);
    }
    const actualTime = pickList.startedAt
        ? (new Date().getTime() - pickList.startedAt.getTime()) / (1000 * 60)
        : pickList.estimatedTime;
    return {
        ...pickList,
        status: PickTaskStatus.COMPLETED,
        completedAt: new Date(),
        actualTime,
        metadata: {
            ...pickList.metadata,
            completedBy,
        },
    };
}
// ============================================================================
// SECTION 5: PERFORMANCE METRICS (Functions 37-44)
// ============================================================================
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
function calculatePickerPerformance(pickerId, pickLists, startDate, endDate) {
    const pickerLists = pickLists.filter(pl => pl.assignedTo === pickerId &&
        pl.completedAt &&
        pl.completedAt >= startDate &&
        pl.completedAt <= endDate);
    const allTasks = pickerLists.flatMap(pl => pl.tasks);
    const completedTasks = allTasks.filter(t => t.status === PickTaskStatus.COMPLETED || t.status === PickTaskStatus.VERIFIED);
    const totalUnits = completedTasks.reduce((sum, t) => sum + t.quantityPicked, 0);
    const totalLines = completedTasks.length;
    const accurateTasks = completedTasks.filter(t => t.quantityPicked === t.quantityToPick).length;
    const accuracy = completedTasks.length > 0 ? accurateTasks / completedTasks.length : 0;
    const totalMinutes = pickerLists.reduce((sum, pl) => sum + (pl.actualTime || 0), 0);
    const totalHours = totalMinutes / 60;
    const productivity = totalHours > 0 ? totalUnits / totalHours : 0;
    const totalPickTimeSeconds = completedTasks.reduce((sum, t) => {
        if (t.pickedAt && t.metadata?.startedAt) {
            return sum + (t.pickedAt.getTime() - new Date(t.metadata.startedAt).getTime()) / 1000;
        }
        return sum;
    }, 0);
    const averagePickTime = totalUnits > 0 ? totalPickTimeSeconds / totalUnits : 0;
    const averageLineTime = totalLines > 0 ? totalPickTimeSeconds / totalLines : 0;
    const exceptions = allTasks.filter(t => t.exception).length;
    const errorRate = allTasks.length > 0 ? exceptions / allTasks.length : 0;
    return {
        pickerId,
        pickerName: `Picker ${pickerId}`,
        period: { start: startDate, end: endDate },
        tasksCompleted: completedTasks.length,
        unitsPickedCount: totalUnits,
        linesPickedCount: totalLines,
        accuracy,
        averagePickTime,
        averageLineTime,
        totalHours,
        productivity,
        errorRate,
        exceptions,
    };
}
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
function calculatePickAccuracy(warehouseId, confirmations, startDate, endDate) {
    const periodConfirmations = confirmations.filter(c => c.confirmedAt >= startDate && c.confirmedAt <= endDate);
    const totalPicks = periodConfirmations.length;
    const accuratePicks = periodConfirmations.filter(c => c.accuracy === 1.0).length;
    const accuracy = totalPicks > 0 ? accuratePicks / totalPicks : 0;
    const shortPicks = periodConfirmations.filter(c => c.discrepancies?.some(d => d.includes('Quantity mismatch'))).length;
    const wrongItems = periodConfirmations.filter(c => c.discrepancies?.some(d => d.includes('Barcode mismatch'))).length;
    const byPicker = new Map();
    const byZone = new Map();
    for (const confirmation of periodConfirmations) {
        // By picker
        const picker = confirmation.confirmedBy;
        byPicker.set(picker, (byPicker.get(picker) || 0) + (confirmation.accuracy === 1.0 ? 1 : 0));
        // By zone (extracted from location)
        const zone = confirmation.locationConfirmed.split('-')[0] || 'UNKNOWN';
        byZone.set(zone, (byZone.get(zone) || 0) + (confirmation.accuracy === 1.0 ? 1 : 0));
    }
    return {
        warehouseId,
        period: { start: startDate, end: endDate },
        totalPicks,
        accuratePicks,
        accuracy,
        shortPicks,
        wrongItems,
        damagedItems: 0, // Would need exception data
        qualityIssues: 0, // Would need exception data
        locationErrors: 0, // Would need exception data
        byPicker,
        byZone,
    };
}
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
function calculateWavePerformance(wave) {
    const plannedDuration = (wave.plannedEndTime.getTime() - wave.plannedStartTime.getTime()) / (1000 * 60);
    const actualDuration = wave.actualStartTime && wave.actualEndTime
        ? (wave.actualEndTime.getTime() - wave.actualStartTime.getTime()) / (1000 * 60)
        : 0;
    const efficiency = plannedDuration > 0 ? Math.min(plannedDuration / actualDuration, 1.0) : 0;
    const allTasks = wave.pickLists.flatMap(pl => pl.tasks);
    const completedTasks = allTasks.filter(t => t.status === PickTaskStatus.COMPLETED || t.status === PickTaskStatus.VERIFIED);
    const accurateTasks = completedTasks.filter(t => t.quantityPicked === t.quantityToPick).length;
    const accuracy = completedTasks.length > 0 ? accurateTasks / completedTasks.length : 0;
    const pickersUtilized = new Set(wave.pickLists.map(pl => pl.assignedTo).filter(Boolean)).size;
    const totalPickTimeSeconds = completedTasks.reduce((sum, t) => {
        if (t.pickedAt && t.metadata?.startedAt) {
            return sum + (t.pickedAt.getTime() - new Date(t.metadata.startedAt).getTime()) / 1000;
        }
        return sum;
    }, 0);
    const averagePickTime = completedTasks.length > 0 ? totalPickTimeSeconds / completedTasks.length : 0;
    const exceptionsCount = allTasks.filter(t => t.exception).length;
    return {
        waveId: wave.waveId,
        waveNumber: wave.waveNumber,
        plannedDuration,
        actualDuration,
        efficiency,
        ordersFulfilled: wave.orderCount,
        linesFulfilled: completedTasks.length,
        unitsFulfilled: completedTasks.reduce((sum, t) => sum + t.quantityPicked, 0),
        accuracy,
        pickersUtilized,
        averagePickTime,
        exceptionsCount,
    };
}
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
function generateProductivityReport(pickLists, startDate, endDate) {
    const periodLists = pickLists.filter(pl => pl.completedAt && pl.completedAt >= startDate && pl.completedAt <= endDate);
    const totalPickLists = periodLists.length;
    const allTasks = periodLists.flatMap(pl => pl.tasks);
    const totalTasks = allTasks.length;
    const totalUnits = allTasks.reduce((sum, t) => sum + t.quantityPicked, 0);
    const totalMinutes = periodLists.reduce((sum, pl) => sum + (pl.actualTime || 0), 0);
    const totalHours = totalMinutes / 60;
    const unitsPerHour = totalHours > 0 ? totalUnits / totalHours : 0;
    const tasksPerHour = totalHours > 0 ? totalTasks / totalHours : 0;
    const averagePickListTime = totalPickLists > 0 ? totalMinutes / totalPickLists : 0;
    const completedTasks = allTasks.filter(t => t.status === PickTaskStatus.COMPLETED || t.status === PickTaskStatus.VERIFIED).length;
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
    return {
        period: { start: startDate, end: endDate },
        totalPickLists,
        totalTasks,
        totalUnits,
        totalHours,
        unitsPerHour,
        tasksPerHour,
        averagePickListTime,
        completionRate,
    };
}
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
function rankPickerPerformance(performances) {
    // Calculate composite score: 60% productivity + 40% accuracy
    const scored = performances.map(p => ({
        pickerId: p.pickerId,
        pickerName: p.pickerName,
        productivity: p.productivity,
        accuracy: p.accuracy,
        score: (p.productivity * 0.6) + (p.accuracy * 100 * 0.4),
    }));
    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);
    // Add ranks
    return scored.map((s, index) => ({
        rank: index + 1,
        ...s,
    }));
}
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
function analyzePickTimeDistribution(tasks) {
    const pickTimes = tasks
        .filter(t => t.pickedAt && t.metadata?.startedAt)
        .map(t => (t.pickedAt.getTime() - new Date(t.metadata.startedAt).getTime()) / 1000);
    if (pickTimes.length === 0) {
        return {
            averageSeconds: 0,
            medianSeconds: 0,
            minSeconds: 0,
            maxSeconds: 0,
            standardDeviation: 0,
            percentiles: { p50: 0, p75: 0, p90: 0, p95: 0, p99: 0 },
        };
    }
    pickTimes.sort((a, b) => a - b);
    const average = pickTimes.reduce((sum, t) => sum + t, 0) / pickTimes.length;
    const median = pickTimes[Math.floor(pickTimes.length / 2)];
    const min = pickTimes[0];
    const max = pickTimes[pickTimes.length - 1];
    const variance = pickTimes.reduce((sum, t) => sum + Math.pow(t - average, 2), 0) / pickTimes.length;
    const standardDeviation = Math.sqrt(variance);
    const percentile = (p) => pickTimes[Math.floor(pickTimes.length * p)];
    return {
        averageSeconds: average,
        medianSeconds: median,
        minSeconds: min,
        maxSeconds: max,
        standardDeviation,
        percentiles: {
            p50: percentile(0.5),
            p75: percentile(0.75),
            p90: percentile(0.9),
            p95: percentile(0.95),
            p99: percentile(0.99),
        },
    };
}
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
function identifyPickingBottlenecks(pickLists) {
    const zoneMetrics = new Map();
    const productMetrics = new Map();
    const zoneExceptions = new Map();
    const locationCongestion = new Map();
    for (const pickList of pickLists) {
        for (const task of pickList.tasks) {
            const zone = task.fromLocation.zone;
            const sku = task.sku;
            const location = formatLocation(task.fromLocation);
            // Zone metrics
            if (task.pickedAt && task.metadata?.startedAt) {
                const pickTime = (task.pickedAt.getTime() - new Date(task.metadata.startedAt).getTime()) / 1000;
                const zoneData = zoneMetrics.get(zone) || { totalTime: 0, count: 0 };
                zoneData.totalTime += pickTime;
                zoneData.count += 1;
                zoneMetrics.set(zone, zoneData);
                // Product metrics
                const prodData = productMetrics.get(sku) || { totalTime: 0, count: 0 };
                prodData.totalTime += pickTime;
                prodData.count += 1;
                productMetrics.set(sku, prodData);
            }
            // Zone exceptions
            const exceptionData = zoneExceptions.get(zone) || { exceptions: 0, total: 0 };
            exceptionData.total += 1;
            if (task.exception)
                exceptionData.exceptions += 1;
            zoneExceptions.set(zone, exceptionData);
            // Location congestion
            locationCongestion.set(location, (locationCongestion.get(location) || 0) + 1);
        }
    }
    const slowestZones = Array.from(zoneMetrics.entries())
        .map(([zone, data]) => ({ zone, averageTime: data.totalTime / data.count }))
        .sort((a, b) => b.averageTime - a.averageTime)
        .slice(0, 5);
    const slowestProducts = Array.from(productMetrics.entries())
        .map(([sku, data]) => ({ sku, averageTime: data.totalTime / data.count }))
        .sort((a, b) => b.averageTime - a.averageTime)
        .slice(0, 10);
    const highExceptionZones = Array.from(zoneExceptions.entries())
        .map(([zone, data]) => ({ zone, exceptionRate: data.exceptions / data.total }))
        .sort((a, b) => b.exceptionRate - a.exceptionRate)
        .slice(0, 5);
    const congestionPoints = Array.from(locationCongestion.entries())
        .map(([location, count]) => ({ location, taskCount: count }))
        .sort((a, b) => b.taskCount - a.taskCount)
        .slice(0, 10);
    return {
        slowestZones,
        slowestProducts,
        highExceptionZones,
        congestionPoints,
    };
}
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
function exportPickMetricsToCSV(performances) {
    const headers = [
        'Picker ID',
        'Picker Name',
        'Period Start',
        'Period End',
        'Tasks Completed',
        'Units Picked',
        'Lines Picked',
        'Accuracy (%)',
        'Avg Pick Time (sec)',
        'Avg Line Time (sec)',
        'Total Hours',
        'Productivity (units/hr)',
        'Error Rate (%)',
        'Exceptions',
    ];
    let csv = headers.join(',') + '\n';
    for (const perf of performances) {
        const row = [
            perf.pickerId,
            perf.pickerName,
            perf.period.start.toISOString(),
            perf.period.end.toISOString(),
            perf.tasksCompleted,
            perf.unitsPickedCount,
            perf.linesPickedCount,
            (perf.accuracy * 100).toFixed(2),
            perf.averagePickTime.toFixed(2),
            perf.averageLineTime.toFixed(2),
            perf.totalHours.toFixed(2),
            perf.productivity.toFixed(2),
            (perf.errorRate * 100).toFixed(2),
            perf.exceptions,
        ];
        csv += row.join(',') + '\n';
    }
    return csv;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique wave ID.
 */
function generateWaveId() {
    return `WAVE-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates human-readable wave number.
 */
function generateWaveNumber(warehouseId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-4);
    const whCode = warehouseId.replace(/[^A-Z0-9]/g, '');
    return `${whCode}-W${dateStr}-${timeStr}`;
}
/**
 * Helper: Generates unique task ID.
 */
function generateTaskId() {
    return `TASK-${crypto.randomUUID()}`;
}
/**
 * Helper: Determines wave priority from criteria.
 */
function determinePriority(criteria) {
    if (criteria.priorities && criteria.priorities.includes(PickPriority.URGENT)) {
        return PickPriority.URGENT;
    }
    if (criteria.priorities && criteria.priorities.includes(PickPriority.HIGH)) {
        return PickPriority.HIGH;
    }
    if (criteria.shipByDate && criteria.shipByDate < new Date(Date.now() + 86400000)) {
        return PickPriority.HIGH; // Ship within 24 hours
    }
    return PickPriority.NORMAL;
}
/**
 * Helper: Calculates planned end time based on criteria.
 */
function calculatePlannedEndTime(criteria) {
    const start = new Date();
    const estimatedHours = Math.ceil((criteria.maxOrders || 50) / 10); // 10 orders per hour estimate
    return new Date(start.getTime() + estimatedHours * 3600000);
}
/**
 * Helper: Filters orders by wave criteria.
 */
function filterOrdersByCriteria(orders, criteria) {
    return orders.filter(order => {
        if (criteria.orderTypes && !criteria.orderTypes.includes(order.type))
            return false;
        if (criteria.priorities && !criteria.priorities.includes(order.priority))
            return false;
        if (criteria.shipByDate && order.shipByDate > criteria.shipByDate)
            return false;
        if (criteria.carriers && !criteria.carriers.includes(order.carrier))
            return false;
        return true;
    });
}
/**
 * Helper: Creates pick list for single order.
 */
function createPickListForOrder(wave, order) {
    const pickListId = `PL-${crypto.randomUUID()}`;
    const tasks = createPickTasks(pickListId, order.lineItems || []);
    return {
        pickListId,
        pickListNumber: `${wave.waveNumber}-${order.orderId}`,
        waveId: wave.waveId,
        warehouseId: wave.warehouseId,
        strategy: PickingStrategy.DISCRETE,
        status: PickTaskStatus.PENDING,
        priority: order.priority || PickPriority.NORMAL,
        tasks,
        routeSequence: tasks.map((_, i) => i + 1),
        estimatedTime: calculateRouteTime(tasks),
        createdAt: new Date(),
    };
}
/**
 * Helper: Creates pick list for batch of orders.
 */
function createPickListForBatch(wave, orders) {
    const pickListId = `PL-${crypto.randomUUID()}`;
    const allLines = orders.flatMap(o => o.lineItems || []);
    const tasks = createPickTasks(pickListId, allLines);
    return {
        pickListId,
        pickListNumber: `${wave.waveNumber}-BATCH-${orders.length}`,
        waveId: wave.waveId,
        warehouseId: wave.warehouseId,
        strategy: PickingStrategy.BATCH,
        status: PickTaskStatus.PENDING,
        priority: PickPriority.NORMAL,
        tasks,
        routeSequence: tasks.map((_, i) => i + 1),
        estimatedTime: calculateRouteTime(tasks),
        createdAt: new Date(),
    };
}
/**
 * Helper: Creates pick list for zone.
 */
function createPickListForZone(wave, zone, orders) {
    const pickListId = `PL-${crypto.randomUUID()}`;
    const zoneLines = orders
        .flatMap(o => o.lineItems || [])
        .filter((line) => line.location?.zone === zone);
    const tasks = createPickTasks(pickListId, zoneLines);
    return {
        pickListId,
        pickListNumber: `${wave.waveNumber}-ZONE-${zone}`,
        waveId: wave.waveId,
        warehouseId: wave.warehouseId,
        strategy: PickingStrategy.ZONE,
        status: PickTaskStatus.PENDING,
        priority: PickPriority.NORMAL,
        zone,
        tasks,
        routeSequence: tasks.map((_, i) => i + 1),
        estimatedTime: calculateRouteTime(tasks),
        createdAt: new Date(),
    };
}
/**
 * Helper: Creates pick list for entire wave.
 */
function createPickListForWave(wave, orders) {
    const pickListId = `PL-${crypto.randomUUID()}`;
    const allLines = orders.flatMap(o => o.lineItems || []);
    const tasks = createPickTasks(pickListId, allLines);
    return {
        pickListId,
        pickListNumber: wave.waveNumber,
        waveId: wave.waveId,
        warehouseId: wave.warehouseId,
        strategy: PickingStrategy.WAVE,
        status: PickTaskStatus.PENDING,
        priority: wave.priority,
        tasks,
        routeSequence: tasks.map((_, i) => i + 1),
        estimatedTime: calculateRouteTime(tasks),
        createdAt: new Date(),
    };
}
/**
 * Helper: Creates pick list for cluster.
 */
function createPickListForCluster(wave, orders) {
    const pickListId = `PL-${crypto.randomUUID()}`;
    const allLines = orders.flatMap(o => o.lineItems || []);
    const tasks = createPickTasks(pickListId, allLines);
    return {
        pickListId,
        pickListNumber: `${wave.waveNumber}-CLUSTER-${orders.length}`,
        waveId: wave.waveId,
        warehouseId: wave.warehouseId,
        strategy: PickingStrategy.CLUSTER,
        status: PickTaskStatus.PENDING,
        priority: PickPriority.NORMAL,
        tasks,
        routeSequence: tasks.map((_, i) => i + 1),
        estimatedTime: calculateRouteTime(tasks),
        createdAt: new Date(),
    };
}
/**
 * Helper: Groups orders by zone.
 */
function groupOrdersByZone(orders) {
    const zoneGroups = new Map();
    for (const order of orders) {
        for (const line of order.lineItems || []) {
            const zone = line.location?.zone || 'UNASSIGNED';
            if (!zoneGroups.has(zone)) {
                zoneGroups.set(zone, []);
            }
            // Add order if not already in zone group
            const zoneOrders = zoneGroups.get(zone);
            if (!zoneOrders.find(o => o.orderId === order.orderId)) {
                zoneOrders.push(order);
            }
        }
    }
    return zoneGroups;
}
/**
 * Helper: Creates order batches.
 */
function createOrderBatches(orders, batchSize) {
    const batches = [];
    for (let i = 0; i < orders.length; i += batchSize) {
        batches.push(orders.slice(i, i + batchSize));
    }
    return batches;
}
/**
 * Helper: Creates order clusters for cluster picking.
 */
function createOrderClusters(orders, clusterSize) {
    return createOrderBatches(orders, clusterSize);
}
/**
 * Helper: Calculates route time for tasks.
 */
function calculateRouteTime(tasks) {
    const baseTimePerTask = 0.5; // 30 seconds
    const travelTimePerTask = 0.25; // 15 seconds
    return Math.ceil(tasks.length * (baseTimePerTask + travelTimePerTask));
}
/**
 * Helper: Calculates distance from start location.
 */
function calculateDistanceFromStart(location, start) {
    if (!start || !location.coordinates || !start.coordinates) {
        // Simple fallback based on zone/aisle/rack
        const zoneNum = location.zone.charCodeAt(0);
        const aisleNum = parseInt(location.aisle) || 0;
        const rackNum = parseInt(location.rack) || 0;
        return zoneNum * 1000 + aisleNum * 100 + rackNum;
    }
    // Euclidean distance
    const dx = location.coordinates.x - start.coordinates.x;
    const dy = location.coordinates.y - start.coordinates.y;
    const dz = location.coordinates.z - start.coordinates.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
/**
 * Helper: Formats warehouse location as string.
 */
function formatLocation(location) {
    return `${location.zone}-${location.aisle}-${location.rack}-${location.shelf}-${location.bin}`;
}
/**
 * Helper: Creates short pick exception.
 */
function createShortPickException(task, quantityShort, pickerId) {
    return {
        exceptionId: crypto.randomUUID(),
        taskId: task.taskId,
        type: PickExceptionType.SHORT_PICK,
        description: `Short pick: ${quantityShort} units short`,
        quantityShort,
        reportedBy: pickerId,
        reportedAt: new Date(),
        requiresAction: true,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Wave Planning
    createPickWave,
    addOrdersToWave,
    optimizeWaveWorkload,
    releaseWave,
    calculateWaveCapacity,
    prioritizeWaves,
    splitWave,
    mergeWaves,
    cancelWave,
    // Pick List Generation
    generatePickLists,
    createPickTasks,
    optimizePickRoute,
    allocateInventoryToTasks,
    batchOrders,
    assignPickList,
    groupTasksByZone,
    calculatePickListTime,
    generatePickingLabel,
    // Pick Execution
    startPickTask,
    completePickTask,
    verifyPickedItem,
    handlePartialPick,
    handleItemSubstitution,
    recordDamagedItem,
    handleLocationEmpty,
    skipPickTask,
    resumePickTask,
    // Pick Confirmation
    createPickConfirmation,
    validatePickConfirmation,
    consolidatePickConfirmations,
    performQualityCheck,
    resolvePickException,
    escalateException,
    generateExceptionReport,
    validatePickListCompletion,
    completePickList,
    // Performance Metrics
    calculatePickerPerformance,
    calculatePickAccuracy,
    calculateWavePerformance,
    generateProductivityReport,
    rankPickerPerformance,
    analyzePickTimeDistribution,
    identifyPickingBottlenecks,
    exportPickMetricsToCSV,
};
//# sourceMappingURL=outbound-order-picking-kit.js.map