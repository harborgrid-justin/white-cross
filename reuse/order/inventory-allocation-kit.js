"use strict";
/**
 * LOC: ORD-INVATP-001
 * File: /reuse/order/inventory-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order fulfillment services
 *   - Warehouse management systems
 *   - Inventory controllers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseCapability = exports.AllocationStatus = exports.AllocationPriority = exports.ATPMethod = exports.ReservationType = exports.AllocationStrategy = void 0;
exports.calculateSimpleATP = calculateSimpleATP;
exports.calculateProjectedATP = calculateProjectedATP;
exports.calculateCumulativeATP = calculateCumulativeATP;
exports.calculateMultiWarehouseATP = calculateMultiWarehouseATP;
exports.createSoftReservation = createSoftReservation;
exports.createHardReservation = createHardReservation;
exports.convertToHardAllocation = convertToHardAllocation;
exports.releaseReservation = releaseReservation;
exports.extendReservationExpiration = extendReservationExpiration;
exports.allocateFromSingleWarehouse = allocateFromSingleWarehouse;
exports.allocateFromMultipleWarehouses = allocateFromMultipleWarehouses;
exports.allocateWithBackorder = allocateWithBackorder;
exports.batchAllocateInventory = batchAllocateInventory;
exports.prioritizeAllocationRequests = prioritizeAllocationRequests;
exports.applyCustomerPriorityOverride = applyCustomerPriorityOverride;
exports.calculateAllocationPriorityScore = calculateAllocationPriorityScore;
exports.optimizeAllocationByCost = optimizeAllocationByCost;
exports.optimizeToMinimizeWarehouses = optimizeToMinimizeWarehouses;
exports.balanceInventoryAllocation = balanceInventoryAllocation;
exports.calculateSafetyStockLevel = calculateSafetyStockLevel;
exports.checkSafetyStockBreach = checkSafetyStockBreach;
exports.recommendSafetyStockAdjustment = recommendSafetyStockAdjustment;
exports.reallocateInventoryBetweenWarehouses = reallocateInventoryBetweenWarehouses;
exports.identifyReallocationOpportunities = identifyReallocationOpportunities;
exports.processExpiredReservations = processExpiredReservations;
exports.getExpiringSoonReservations = getExpiringSoonReservations;
exports.applyExpirationPolicy = applyExpirationPolicy;
exports.planCrossWarehouseFulfillment = planCrossWarehouseFulfillment;
exports.consolidateMultiWarehouseShipments = consolidateMultiWarehouseShipments;
exports.createSplitShipmentPlan = createSplitShipmentPlan;
exports.analyzeSplitShipmentCosts = analyzeSplitShipmentCosts;
exports.findSubstituteItems = findSubstituteItems;
exports.allocateWithSubstitution = allocateWithSubstitution;
/**
 * File: /reuse/order/inventory-allocation-kit.ts
 * Locator: WC-ORD-INVATP-001
 * Purpose: Inventory Allocation & ATP - Reservation and available-to-promise
 *
 * Upstream: Independent utility module for inventory allocation operations
 * Downstream: ../backend/order/*, Warehouse modules, Fulfillment services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for ATP, reservation, allocation, optimization
 *
 * LLM Context: Enterprise-grade inventory allocation utilities to compete with Oracle MICROS and JD Edwards.
 * Provides comprehensive ATP calculations, multi-warehouse allocation, hard/soft reservations, allocation prioritization,
 * allocation optimization, safety stock management, reallocation strategies, allocation expiration handling,
 * cross-warehouse fulfillment, split shipment allocation, substitute allocation, and advanced allocation algorithms.
 */
const common_1 = require("@nestjs/common");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Allocation strategy types for inventory distribution
 */
var AllocationStrategy;
(function (AllocationStrategy) {
    AllocationStrategy["FIFO"] = "FIFO";
    AllocationStrategy["LIFO"] = "LIFO";
    AllocationStrategy["FEFO"] = "FEFO";
    AllocationStrategy["NEAREST"] = "NEAREST";
    AllocationStrategy["LOWEST_COST"] = "LOWEST_COST";
    AllocationStrategy["BALANCED"] = "BALANCED";
    AllocationStrategy["PRIORITY"] = "PRIORITY";
    AllocationStrategy["CUSTOM"] = "CUSTOM";
})(AllocationStrategy || (exports.AllocationStrategy = AllocationStrategy = {}));
/**
 * Reservation types for inventory holding
 */
var ReservationType;
(function (ReservationType) {
    ReservationType["HARD"] = "HARD";
    ReservationType["SOFT"] = "SOFT";
    ReservationType["PLANNED"] = "PLANNED";
    ReservationType["BACKORDER"] = "BACKORDER";
    ReservationType["TEMPORARY"] = "TEMPORARY";
})(ReservationType || (exports.ReservationType = ReservationType = {}));
/**
 * ATP calculation methods
 */
var ATPMethod;
(function (ATPMethod) {
    ATPMethod["SIMPLE"] = "SIMPLE";
    ATPMethod["PROJECTED"] = "PROJECTED";
    ATPMethod["CUMULATIVE"] = "CUMULATIVE";
    ATPMethod["DISCRETE"] = "DISCRETE";
    ATPMethod["MULTI_LEVEL"] = "MULTI_LEVEL";
})(ATPMethod || (exports.ATPMethod = ATPMethod = {}));
/**
 * Allocation priority levels
 */
var AllocationPriority;
(function (AllocationPriority) {
    AllocationPriority["CRITICAL"] = "CRITICAL";
    AllocationPriority["HIGH"] = "HIGH";
    AllocationPriority["NORMAL"] = "NORMAL";
    AllocationPriority["LOW"] = "LOW";
    AllocationPriority["BACKORDER"] = "BACKORDER";
})(AllocationPriority || (exports.AllocationPriority = AllocationPriority = {}));
/**
 * Allocation status tracking
 */
var AllocationStatus;
(function (AllocationStatus) {
    AllocationStatus["PENDING"] = "PENDING";
    AllocationStatus["ALLOCATED"] = "ALLOCATED";
    AllocationStatus["PARTIALLY_ALLOCATED"] = "PARTIALLY_ALLOCATED";
    AllocationStatus["RESERVED"] = "RESERVED";
    AllocationStatus["RELEASED"] = "RELEASED";
    AllocationStatus["EXPIRED"] = "EXPIRED";
    AllocationStatus["CANCELLED"] = "CANCELLED";
})(AllocationStatus || (exports.AllocationStatus = AllocationStatus = {}));
/**
 * Warehouse fulfillment capabilities
 */
var WarehouseCapability;
(function (WarehouseCapability) {
    WarehouseCapability["STANDARD"] = "STANDARD";
    WarehouseCapability["EXPEDITED"] = "EXPEDITED";
    WarehouseCapability["DROPSHIP"] = "DROPSHIP";
    WarehouseCapability["STORE_PICKUP"] = "STORE_PICKUP";
    WarehouseCapability["SAME_DAY"] = "SAME_DAY";
    WarehouseCapability["HAZMAT"] = "HAZMAT";
    WarehouseCapability["REFRIGERATED"] = "REFRIGERATED";
    WarehouseCapability["OVERSIZED"] = "OVERSIZED";
})(WarehouseCapability || (exports.WarehouseCapability = WarehouseCapability = {}));
// ============================================================================
// ATP CALCULATION FUNCTIONS
// ============================================================================
/**
 * Calculate simple ATP (Available-to-Promise) for an item
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param inventory - Current inventory snapshot
 * @returns ATP result with availability details
 */
async function calculateSimpleATP(itemId, warehouseId, inventory) {
    const atpQuantity = Math.max(0, inventory.onHandQuantity - inventory.allocatedQuantity - inventory.reservedQuantity - inventory.safetyStock);
    return {
        itemId,
        warehouseId,
        atpQuantity,
        onHandQuantity: inventory.onHandQuantity,
        allocatedQuantity: inventory.allocatedQuantity,
        reservedQuantity: inventory.reservedQuantity,
        inTransitQuantity: inventory.inTransitQuantity,
        backorderQuantity: 0,
        projectedAvailability: [],
        safetyStockLevel: inventory.safetyStock,
        reorderPoint: inventory.reorderPoint,
        leadTimeDays: inventory.leadTimeDays,
        calculationTimestamp: new Date(),
        method: ATPMethod.SIMPLE,
    };
}
/**
 * Calculate projected ATP with scheduled receipts and demand
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param inventory - Current inventory snapshot
 * @param scheduledReceipts - Future scheduled receipts
 * @param scheduledDemand - Future scheduled demand
 * @param horizonDays - Planning horizon in days
 * @returns ATP result with time-phased projections
 */
async function calculateProjectedATP(itemId, warehouseId, inventory, scheduledReceipts, scheduledDemand, horizonDays = 90) {
    const projectedAvailability = [];
    let runningBalance = inventory.onHandQuantity - inventory.allocatedQuantity - inventory.reservedQuantity;
    // Build time-phased projection
    const today = new Date();
    for (let i = 0; i < horizonDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayReceipts = scheduledReceipts
            .filter((r) => r.date.toDateString() === date.toDateString())
            .reduce((sum, r) => sum + r.quantity, 0);
        const dayDemand = scheduledDemand
            .filter((d) => d.date.toDateString() === date.toDateString())
            .reduce((sum, d) => sum + d.quantity, 0);
        runningBalance = runningBalance + dayReceipts - dayDemand;
        projectedAvailability.push({
            date,
            projectedQuantity: Math.max(0, runningBalance),
            scheduledReceipts: dayReceipts,
            scheduledDemand: dayDemand,
            cumulativeATP: Math.max(0, runningBalance - inventory.safetyStock),
        });
    }
    const currentATP = Math.max(0, inventory.onHandQuantity + inventory.inTransitQuantity - inventory.allocatedQuantity - inventory.reservedQuantity - inventory.safetyStock);
    return {
        itemId,
        warehouseId,
        atpQuantity: currentATP,
        onHandQuantity: inventory.onHandQuantity,
        allocatedQuantity: inventory.allocatedQuantity,
        reservedQuantity: inventory.reservedQuantity,
        inTransitQuantity: inventory.inTransitQuantity,
        backorderQuantity: 0,
        projectedAvailability,
        safetyStockLevel: inventory.safetyStock,
        reorderPoint: inventory.reorderPoint,
        leadTimeDays: inventory.leadTimeDays,
        calculationTimestamp: new Date(),
        method: ATPMethod.PROJECTED,
    };
}
/**
 * Calculate cumulative ATP across time periods
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param projectedData - Time-phased projected availability data
 * @returns ATP result with cumulative calculations
 */
function calculateCumulativeATP(itemId, warehouseId, projectedData) {
    let cumulativeATP = 0;
    const updatedProjections = projectedData.map((period) => {
        cumulativeATP += period.projectedQuantity;
        return {
            ...period,
            cumulativeATP: Math.max(0, cumulativeATP),
        };
    });
    return {
        itemId,
        warehouseId,
        atpQuantity: updatedProjections[0]?.cumulativeATP || 0,
        onHandQuantity: updatedProjections[0]?.projectedQuantity || 0,
        allocatedQuantity: 0,
        reservedQuantity: 0,
        inTransitQuantity: 0,
        backorderQuantity: 0,
        projectedAvailability: updatedProjections,
        safetyStockLevel: 0,
        reorderPoint: 0,
        leadTimeDays: 0,
        calculationTimestamp: new Date(),
        method: ATPMethod.CUMULATIVE,
    };
}
/**
 * Calculate multi-warehouse ATP aggregation
 *
 * @param itemId - Item identifier
 * @param warehouseInventories - Inventory across multiple warehouses
 * @returns Aggregated ATP result across all warehouses
 */
async function calculateMultiWarehouseATP(itemId, warehouseInventories) {
    let totalATP = 0;
    let totalOnHand = 0;
    let totalAllocated = 0;
    let totalReserved = 0;
    let totalInTransit = 0;
    let totalSafetyStock = 0;
    for (const inventory of warehouseInventories) {
        const warehouseATP = Math.max(0, inventory.onHandQuantity - inventory.allocatedQuantity - inventory.reservedQuantity - inventory.safetyStock);
        totalATP += warehouseATP;
        totalOnHand += inventory.onHandQuantity;
        totalAllocated += inventory.allocatedQuantity;
        totalReserved += inventory.reservedQuantity;
        totalInTransit += inventory.inTransitQuantity;
        totalSafetyStock += inventory.safetyStock;
    }
    return {
        itemId,
        warehouseId: 'MULTI',
        atpQuantity: totalATP,
        onHandQuantity: totalOnHand,
        allocatedQuantity: totalAllocated,
        reservedQuantity: totalReserved,
        inTransitQuantity: totalInTransit,
        backorderQuantity: 0,
        projectedAvailability: [],
        safetyStockLevel: totalSafetyStock,
        reorderPoint: 0,
        leadTimeDays: 0,
        calculationTimestamp: new Date(),
        method: ATPMethod.SIMPLE,
    };
}
// ============================================================================
// INVENTORY RESERVATION FUNCTIONS
// ============================================================================
/**
 * Create a soft reservation for inventory
 *
 * @param request - Allocation request details
 * @param warehouseId - Warehouse to reserve from
 * @param quantity - Quantity to reserve
 * @param expirationHours - Reservation expiration in hours
 * @returns Created reservation record
 */
async function createSoftReservation(request, warehouseId, quantity, expirationHours = 24) {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expirationHours);
    const reservation = {
        reservationId: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        itemId: request.itemId,
        warehouseId,
        quantity,
        reservedQuantity: quantity,
        allocatedQuantity: 0,
        type: ReservationType.SOFT,
        priority: request.priority,
        orderId: request.orderId,
        orderLineId: request.orderLineId,
        customerId: request.customerId,
        expirationDate,
        createdDate: new Date(),
        createdBy: 'SYSTEM',
        status: AllocationStatus.RESERVED,
        metadata: request.metadata,
    };
    return reservation;
}
/**
 * Create a hard reservation (committed allocation)
 *
 * @param request - Allocation request details
 * @param warehouseId - Warehouse to allocate from
 * @param quantity - Quantity to allocate
 * @returns Created hard reservation record
 */
async function createHardReservation(request, warehouseId, quantity) {
    const reservation = {
        reservationId: `HARD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        itemId: request.itemId,
        warehouseId,
        quantity,
        reservedQuantity: quantity,
        allocatedQuantity: quantity,
        type: ReservationType.HARD,
        priority: request.priority,
        orderId: request.orderId,
        orderLineId: request.orderLineId,
        customerId: request.customerId,
        expirationDate: undefined, // Hard reservations don't expire
        createdDate: new Date(),
        createdBy: 'SYSTEM',
        status: AllocationStatus.ALLOCATED,
        metadata: request.metadata,
    };
    return reservation;
}
/**
 * Convert soft reservation to hard allocation
 *
 * @param reservation - Existing soft reservation
 * @returns Updated reservation as hard allocation
 */
async function convertToHardAllocation(reservation) {
    if (reservation.type !== ReservationType.SOFT) {
        throw new common_1.BadRequestException('Only soft reservations can be converted to hard allocations');
    }
    return {
        ...reservation,
        type: ReservationType.HARD,
        allocatedQuantity: reservation.reservedQuantity,
        status: AllocationStatus.ALLOCATED,
        expirationDate: undefined,
    };
}
/**
 * Release inventory reservation
 *
 * @param reservationId - Reservation identifier to release
 * @param releaseReason - Reason for release
 * @returns Updated reservation with released status
 */
async function releaseReservation(reservationId, releaseReason) {
    // In production, this would update the database
    // Mock implementation for demonstration
    const reservation = {
        reservationId,
        status: AllocationStatus.RELEASED,
        metadata: { releaseReason, releaseDate: new Date() },
    };
    return reservation;
}
/**
 * Extend reservation expiration time
 *
 * @param reservationId - Reservation identifier
 * @param additionalHours - Additional hours to extend
 * @returns Updated reservation with new expiration
 */
async function extendReservationExpiration(reservationId, additionalHours) {
    // In production, this would fetch and update from database
    const currentExpiration = new Date();
    currentExpiration.setHours(currentExpiration.getHours() + additionalHours);
    const reservation = {
        reservationId,
        expirationDate: currentExpiration,
    };
    return reservation;
}
// ============================================================================
// ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Allocate inventory from single warehouse
 *
 * @param request - Allocation request
 * @param inventory - Warehouse inventory snapshot
 * @returns Allocation result
 */
async function allocateFromSingleWarehouse(request, inventory) {
    const startTime = Date.now();
    // Calculate available quantity
    const atp = await calculateSimpleATP(request.itemId, inventory.warehouseId, inventory);
    const allocatedQuantity = Math.min(request.requestedQuantity, atp.atpQuantity);
    if (allocatedQuantity === 0) {
        return {
            requestId: request.requestId,
            status: AllocationStatus.PENDING,
            allocations: [],
            totalAllocated: 0,
            totalRequested: request.requestedQuantity,
            fulfillmentPercentage: 0,
            shortQuantity: request.requestedQuantity,
            processingTime: Date.now() - startTime,
        };
    }
    const reservation = await createHardReservation(request, inventory.warehouseId, allocatedQuantity);
    const warehouseAllocation = {
        warehouseId: inventory.warehouseId,
        warehouseName: inventory.warehouseName,
        itemId: request.itemId,
        allocatedQuantity,
        reservationId: reservation.reservationId,
        location: inventory.location,
    };
    const status = allocatedQuantity >= request.requestedQuantity
        ? AllocationStatus.ALLOCATED
        : AllocationStatus.PARTIALLY_ALLOCATED;
    return {
        requestId: request.requestId,
        status,
        allocations: [warehouseAllocation],
        totalAllocated: allocatedQuantity,
        totalRequested: request.requestedQuantity,
        fulfillmentPercentage: (allocatedQuantity / request.requestedQuantity) * 100,
        shortQuantity: request.requestedQuantity - allocatedQuantity,
        processingTime: Date.now() - startTime,
    };
}
/**
 * Allocate inventory from multiple warehouses
 *
 * @param request - Allocation request
 * @param inventories - Available warehouse inventories
 * @returns Allocation result with multi-warehouse assignments
 */
async function allocateFromMultipleWarehouses(request, inventories) {
    const startTime = Date.now();
    const allocations = [];
    let remainingQuantity = request.requestedQuantity;
    // Filter and sort warehouses based on strategy
    const sortedInventories = sortWarehousesByStrategy(inventories, request);
    // Respect max warehouses limit
    const maxWarehouses = request.maxWarehouses || inventories.length;
    const warehousesToUse = sortedInventories.slice(0, maxWarehouses);
    for (const inventory of warehousesToUse) {
        if (remainingQuantity <= 0)
            break;
        const atp = await calculateSimpleATP(request.itemId, inventory.warehouseId, inventory);
        const allocatedQuantity = Math.min(remainingQuantity, atp.atpQuantity);
        if (allocatedQuantity > 0) {
            const reservation = await createHardReservation(request, inventory.warehouseId, allocatedQuantity);
            allocations.push({
                warehouseId: inventory.warehouseId,
                warehouseName: inventory.warehouseName,
                itemId: request.itemId,
                allocatedQuantity,
                reservationId: reservation.reservationId,
                location: inventory.location,
            });
            remainingQuantity -= allocatedQuantity;
        }
    }
    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedQuantity, 0);
    const status = totalAllocated >= request.requestedQuantity
        ? AllocationStatus.ALLOCATED
        : totalAllocated > 0
            ? AllocationStatus.PARTIALLY_ALLOCATED
            : AllocationStatus.PENDING;
    return {
        requestId: request.requestId,
        status,
        allocations,
        totalAllocated,
        totalRequested: request.requestedQuantity,
        fulfillmentPercentage: (totalAllocated / request.requestedQuantity) * 100,
        shortQuantity: remainingQuantity,
        processingTime: Date.now() - startTime,
    };
}
/**
 * Allocate with backorder creation for shortages
 *
 * @param request - Allocation request
 * @param inventories - Available inventories
 * @returns Allocation result with backorder details
 */
async function allocateWithBackorder(request, inventories) {
    const result = await allocateFromMultipleWarehouses(request, inventories);
    // Create backorder for short quantity if needed
    if (result.shortQuantity > 0) {
        const backorderReservation = await createBackorderReservation(request, result.shortQuantity);
        // Add backorder metadata to result
        result.metadata = {
            backorderReservationId: backorderReservation.reservationId,
            backorderQuantity: result.shortQuantity,
            estimatedAvailabilityDate: calculateEstimatedAvailability(request.itemId, inventories),
        };
    }
    return result;
}
/**
 * Batch allocate multiple items/orders efficiently
 *
 * @param requests - Array of allocation requests
 * @param inventoryMap - Map of item inventories by itemId
 * @returns Array of allocation results
 */
async function batchAllocateInventory(requests, inventoryMap) {
    const results = [];
    // Sort requests by priority
    const sortedRequests = [...requests].sort((a, b) => {
        const priorityOrder = {
            [AllocationPriority.CRITICAL]: 0,
            [AllocationPriority.HIGH]: 1,
            [AllocationPriority.NORMAL]: 2,
            [AllocationPriority.LOW]: 3,
            [AllocationPriority.BACKORDER]: 4,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    // Process requests in priority order
    for (const request of sortedRequests) {
        const inventories = inventoryMap.get(request.itemId) || [];
        const result = await allocateFromMultipleWarehouses(request, inventories);
        results.push(result);
        // Update inventory map to reflect allocations
        updateInventoryAfterAllocation(inventoryMap, request.itemId, result);
    }
    return results;
}
// ============================================================================
// ALLOCATION PRIORITIZATION FUNCTIONS
// ============================================================================
/**
 * Prioritize allocation requests based on business rules
 *
 * @param requests - Array of allocation requests
 * @param rules - Prioritization rules configuration
 * @returns Sorted allocation requests by priority
 */
function prioritizeAllocationRequests(requests, rules) {
    return [...requests].sort((a, b) => {
        // Primary sort by allocation priority
        const priorityOrder = {
            [AllocationPriority.CRITICAL]: 0,
            [AllocationPriority.HIGH]: 1,
            [AllocationPriority.NORMAL]: 2,
            [AllocationPriority.LOW]: 3,
            [AllocationPriority.BACKORDER]: 4,
        };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Secondary sort by required date
        if (rules?.considerRequiredDate) {
            return a.requiredDate.getTime() - b.requiredDate.getTime();
        }
        return 0;
    });
}
/**
 * Apply allocation priority overrides based on customer status
 *
 * @param request - Allocation request
 * @param customerTier - Customer tier/status
 * @returns Updated request with adjusted priority
 */
function applyCustomerPriorityOverride(request, customerTier) {
    const tierPriorityMap = {
        VIP: AllocationPriority.CRITICAL,
        PLATINUM: AllocationPriority.HIGH,
        GOLD: AllocationPriority.HIGH,
        SILVER: AllocationPriority.NORMAL,
        STANDARD: AllocationPriority.NORMAL,
    };
    const overridePriority = tierPriorityMap[customerTier];
    // Only upgrade priority, never downgrade
    const currentPriorityLevel = {
        [AllocationPriority.CRITICAL]: 0,
        [AllocationPriority.HIGH]: 1,
        [AllocationPriority.NORMAL]: 2,
        [AllocationPriority.LOW]: 3,
        [AllocationPriority.BACKORDER]: 4,
    };
    if (currentPriorityLevel[overridePriority] < currentPriorityLevel[request.priority]) {
        return {
            ...request,
            priority: overridePriority,
            metadata: {
                ...request.metadata,
                originalPriority: request.priority,
                priorityOverrideReason: `Customer tier: ${customerTier}`,
            },
        };
    }
    return request;
}
/**
 * Calculate dynamic priority score for allocation
 *
 * @param request - Allocation request
 * @param factors - Scoring factors
 * @returns Priority score (higher = more important)
 */
function calculateAllocationPriorityScore(request, factors) {
    let score = 0;
    // Base score from priority level
    const priorityScores = {
        [AllocationPriority.CRITICAL]: 1000,
        [AllocationPriority.HIGH]: 750,
        [AllocationPriority.NORMAL]: 500,
        [AllocationPriority.LOW]: 250,
        [AllocationPriority.BACKORDER]: 100,
    };
    score += priorityScores[request.priority];
    // Urgency factor (closer required date = higher score)
    if (factors.daysUntilRequired !== undefined) {
        score += Math.max(0, 100 - factors.daysUntilRequired * 2);
    }
    // Order value factor
    if (factors.orderValue) {
        score += Math.min(200, factors.orderValue / 100);
    }
    // Customer lifetime value factor
    if (factors.customerLifetimeValue) {
        score += Math.min(150, factors.customerLifetimeValue / 1000);
    }
    // Item margin factor
    if (factors.itemMargin) {
        score += Math.min(100, factors.itemMargin * 10);
    }
    return score;
}
// ============================================================================
// ALLOCATION OPTIMIZATION FUNCTIONS
// ============================================================================
/**
 * Optimize allocation across warehouses to minimize cost
 *
 * @param request - Allocation request
 * @param inventories - Available inventories with cost data
 * @param criteria - Optimization criteria
 * @returns Optimized allocation result
 */
async function optimizeAllocationByCost(request, inventories, criteria) {
    const startTime = Date.now();
    // Calculate cost for each warehouse option
    const warehouseOptions = inventories.map((inv) => {
        const atp = Math.max(0, inv.onHandQuantity - inv.allocatedQuantity - inv.reservedQuantity - inv.safetyStock);
        const distance = request.customerLocation && inv.location
            ? calculateDistance(request.customerLocation, inv.location)
            : 0;
        const shippingCost = estimateShippingCost(distance, request.requestedQuantity);
        const inventoryCost = (inv.costPerUnit || 0) * request.requestedQuantity;
        const totalCost = shippingCost + inventoryCost;
        return {
            inventory: inv,
            atp,
            distance,
            shippingCost,
            totalCost,
            score: calculateOptimizationScore({ distance, cost: totalCost, atp }, criteria),
        };
    });
    // Sort by optimization score
    warehouseOptions.sort((a, b) => b.score - a.score);
    // Allocate from optimal warehouses
    const allocations = [];
    let remainingQuantity = request.requestedQuantity;
    let totalCost = 0;
    for (const option of warehouseOptions) {
        if (remainingQuantity <= 0)
            break;
        const allocatedQuantity = Math.min(remainingQuantity, option.atp);
        if (allocatedQuantity > 0) {
            const reservation = await createHardReservation(request, option.inventory.warehouseId, allocatedQuantity);
            allocations.push({
                warehouseId: option.inventory.warehouseId,
                warehouseName: option.inventory.warehouseName,
                itemId: request.itemId,
                allocatedQuantity,
                reservationId: reservation.reservationId,
                location: option.inventory.location,
                distance: option.distance,
                shippingCost: option.shippingCost * (allocatedQuantity / request.requestedQuantity),
            });
            remainingQuantity -= allocatedQuantity;
            totalCost += option.totalCost * (allocatedQuantity / request.requestedQuantity);
        }
    }
    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedQuantity, 0);
    return {
        requestId: request.requestId,
        status: totalAllocated >= request.requestedQuantity ? AllocationStatus.ALLOCATED : AllocationStatus.PARTIALLY_ALLOCATED,
        allocations,
        totalAllocated,
        totalRequested: request.requestedQuantity,
        fulfillmentPercentage: (totalAllocated / request.requestedQuantity) * 100,
        shortQuantity: remainingQuantity,
        totalCost,
        processingTime: Date.now() - startTime,
    };
}
/**
 * Optimize to minimize number of warehouses used
 *
 * @param request - Allocation request
 * @param inventories - Available inventories
 * @returns Optimized allocation using fewest warehouses
 */
async function optimizeToMinimizeWarehouses(request, inventories) {
    // Sort warehouses by available quantity (descending)
    const sorted = [...inventories].sort((a, b) => {
        const atpA = a.onHandQuantity - a.allocatedQuantity - a.reservedQuantity - a.safetyStock;
        const atpB = b.onHandQuantity - b.allocatedQuantity - b.reservedQuantity - b.safetyStock;
        return atpB - atpA;
    });
    // Try to fulfill from single warehouse first
    return await allocateFromMultipleWarehouses({ ...request, maxWarehouses: 1 }, sorted);
}
/**
 * Balance inventory allocation across warehouses
 *
 * @param requests - Multiple allocation requests
 * @param inventories - Available inventories
 * @returns Balanced allocation results
 */
async function balanceInventoryAllocation(requests, inventories) {
    const results = [];
    // Track utilization by warehouse
    const utilizationMap = new Map();
    inventories.forEach((inv) => {
        const utilization = inv.allocatedQuantity / inv.onHandQuantity;
        utilizationMap.set(inv.warehouseId, utilization);
    });
    for (const request of requests) {
        // Sort warehouses by current utilization (prefer lower utilization)
        const sortedByUtilization = [...inventories].sort((a, b) => {
            const utilA = utilizationMap.get(a.warehouseId) || 0;
            const utilB = utilizationMap.get(b.warehouseId) || 0;
            return utilA - utilB;
        });
        const result = await allocateFromMultipleWarehouses(request, sortedByUtilization);
        results.push(result);
        // Update utilization map
        result.allocations.forEach((alloc) => {
            const currentUtil = utilizationMap.get(alloc.warehouseId) || 0;
            utilizationMap.set(alloc.warehouseId, currentUtil + 0.1); // Increment utilization
        });
    }
    return results;
}
// ============================================================================
// SAFETY STOCK MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Calculate optimal safety stock level using statistical method
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param demandHistory - Historical demand data
 * @param leadTimeDays - Lead time in days
 * @param serviceLevel - Desired service level (e.g., 0.95)
 * @returns Safety stock configuration
 */
function calculateSafetyStockLevel(itemId, warehouseId, demandHistory, leadTimeDays, serviceLevel = 0.95) {
    // Calculate average demand and standard deviation
    const avgDemand = demandHistory.reduce((a, b) => a + b, 0) / demandHistory.length;
    const variance = demandHistory.reduce((sum, val) => sum + Math.pow(val - avgDemand, 2), 0) / demandHistory.length;
    const stdDev = Math.sqrt(variance);
    // Z-score for service level (approximate)
    const zScores = {
        0.90: 1.28,
        0.95: 1.65,
        0.98: 2.05,
        0.99: 2.33,
    };
    const zScore = zScores[serviceLevel] || 1.65;
    // Safety stock formula: Z * σ * √(lead time)
    const safetyStock = Math.ceil(zScore * stdDev * Math.sqrt(leadTimeDays));
    // Reorder point: (average demand * lead time) + safety stock
    const reorderPoint = Math.ceil(avgDemand * leadTimeDays + safetyStock);
    // Economic order quantity (simplified)
    const reorderQuantity = Math.ceil(avgDemand * leadTimeDays * 2);
    return {
        itemId,
        warehouseId,
        safetyStockQuantity: safetyStock,
        reorderPoint,
        reorderQuantity,
        leadTimeDays,
        demandVariability: stdDev,
        serviceLevel,
        calculationMethod: 'STATISTICAL',
        reviewDate: new Date(),
    };
}
/**
 * Check if safety stock should be protected from allocation
 *
 * @param inventory - Warehouse inventory
 * @param allocationQuantity - Requested allocation quantity
 * @returns Whether allocation would breach safety stock
 */
function checkSafetyStockBreach(inventory, allocationQuantity) {
    const afterAllocation = inventory.availableQuantity - allocationQuantity;
    const breached = afterAllocation < inventory.safetyStock;
    const shortfall = breached ? inventory.safetyStock - afterAllocation : 0;
    return { breached, shortfall };
}
/**
 * Recommend safety stock adjustments based on performance
 *
 * @param config - Current safety stock configuration
 * @param performance - Historical performance metrics
 * @returns Recommended adjustments
 */
function recommendSafetyStockAdjustment(config, performance) {
    const recommendations = {};
    // If stockouts occurred, increase safety stock
    if (performance.stockoutOccurrences > 0) {
        recommendations.safetyStockQuantity = Math.ceil(config.safetyStockQuantity * 1.2);
        recommendations.serviceLevel = Math.min(0.99, config.serviceLevel + 0.05);
    }
    // If excess inventory, decrease safety stock
    if (performance.excessInventoryDays > 30 && performance.stockoutOccurrences === 0) {
        recommendations.safetyStockQuantity = Math.floor(config.safetyStockQuantity * 0.9);
    }
    // Adjust based on actual vs target service level
    if (performance.actualServiceLevel < config.serviceLevel - 0.05) {
        recommendations.safetyStockQuantity = Math.ceil(config.safetyStockQuantity * 1.15);
    }
    return recommendations;
}
// ============================================================================
// REALLOCATION FUNCTIONS
// ============================================================================
/**
 * Reallocate inventory between warehouses
 *
 * @param reallocationRequest - Reallocation request details
 * @param sourceInventory - Source warehouse inventory
 * @param targetInventory - Target warehouse inventory
 * @returns Reallocation result
 */
async function reallocateInventoryBetweenWarehouses(reallocationRequest, sourceInventory, targetInventory) {
    // Check source availability
    const sourceATP = Math.max(0, sourceInventory.availableQuantity - sourceInventory.safetyStock);
    if (sourceATP < reallocationRequest.quantity) {
        throw new common_1.BadRequestException(`Insufficient inventory at source warehouse. Available: ${sourceATP}, Requested: ${reallocationRequest.quantity}`);
    }
    // Create transfer record
    const transferId = `XFER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const estimatedArrivalDate = new Date();
    estimatedArrivalDate.setDate(estimatedArrivalDate.getDate() + 3); // Assume 3-day transfer
    return {
        success: true,
        transferId,
        quantity: reallocationRequest.quantity,
        estimatedArrivalDate,
    };
}
/**
 * Identify reallocation opportunities based on demand patterns
 *
 * @param inventories - All warehouse inventories
 * @param demandForecasts - Demand forecasts by warehouse
 * @returns Recommended reallocations
 */
function identifyReallocationOpportunities(inventories, demandForecasts) {
    const opportunities = [];
    // Find warehouses with excess inventory
    const excessWarehouses = inventories.filter((inv) => {
        const forecast = demandForecasts.get(inv.warehouseId) || 0;
        const daysOfSupply = forecast > 0 ? inv.availableQuantity / (forecast / 30) : 999;
        return daysOfSupply > 60; // More than 60 days of supply
    });
    // Find warehouses with shortage
    const shortageWarehouses = inventories.filter((inv) => {
        const forecast = demandForecasts.get(inv.warehouseId) || 0;
        const daysOfSupply = forecast > 0 ? inv.availableQuantity / (forecast / 30) : 999;
        return daysOfSupply < 15; // Less than 15 days of supply
    });
    // Match excess with shortage
    for (const shortage of shortageWarehouses) {
        for (const excess of excessWarehouses) {
            if (excess.itemId === shortage.itemId) {
                const transferQuantity = Math.min(excess.availableQuantity - excess.safetyStock, shortage.reorderPoint - shortage.availableQuantity);
                if (transferQuantity > 0) {
                    opportunities.push({
                        sourceWarehouseId: excess.warehouseId,
                        targetWarehouseId: shortage.warehouseId,
                        itemId: excess.itemId,
                        quantity: transferQuantity,
                        reason: 'Balance inventory based on demand forecast',
                        priority: AllocationPriority.NORMAL,
                        requestedDate: new Date(),
                        approvalRequired: false,
                    });
                }
            }
        }
    }
    return opportunities;
}
// ============================================================================
// ALLOCATION EXPIRATION FUNCTIONS
// ============================================================================
/**
 * Process expired reservations and release inventory
 *
 * @param reservations - All active reservations
 * @param currentTime - Current timestamp
 * @returns List of expired and released reservations
 */
async function processExpiredReservations(reservations, currentTime = new Date()) {
    const expiredReservations = [];
    for (const reservation of reservations) {
        if (reservation.expirationDate &&
            reservation.expirationDate <= currentTime &&
            reservation.status === AllocationStatus.RESERVED) {
            const released = await releaseReservation(reservation.reservationId, 'Automatic release due to expiration');
            expiredReservations.push(released);
        }
    }
    return expiredReservations;
}
/**
 * Get reservations expiring soon for notification
 *
 * @param reservations - All active reservations
 * @param thresholdHours - Notification threshold in hours
 * @returns Reservations expiring within threshold
 */
function getExpiringSoonReservations(reservations, thresholdHours = 2) {
    const thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() + thresholdHours);
    return reservations.filter((res) => res.expirationDate &&
        res.expirationDate <= thresholdTime &&
        res.expirationDate > new Date() &&
        res.status === AllocationStatus.RESERVED);
}
/**
 * Apply expiration policy to reservation
 *
 * @param reservation - Inventory reservation
 * @param policy - Expiration policy to apply
 * @returns Updated reservation with policy applied
 */
function applyExpirationPolicy(reservation, policy) {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + policy.expirationPeriodHours);
    return {
        ...reservation,
        expirationDate,
        metadata: {
            ...reservation.metadata,
            autoRelease: policy.autoRelease,
            notificationThresholdHours: policy.notificationThresholdHours,
            escalationRequired: policy.escalationRequired,
        },
    };
}
// ============================================================================
// CROSS-WAREHOUSE FULFILLMENT FUNCTIONS
// ============================================================================
/**
 * Plan cross-warehouse fulfillment strategy
 *
 * @param request - Allocation request
 * @param inventories - Available inventories across warehouses
 * @param customerLocation - Customer delivery location
 * @returns Cross-warehouse fulfillment plan
 */
async function planCrossWarehouseFulfillment(request, inventories, customerLocation) {
    // Calculate distance from each warehouse to customer
    const warehouseDistances = inventories.map((inv) => ({
        inventory: inv,
        distance: inv.location ? calculateDistance(customerLocation, inv.location) : 999999,
    }));
    // Sort by distance (nearest first)
    warehouseDistances.sort((a, b) => a.distance - b.distance);
    // Allocate from nearest warehouses
    const sortedInventories = warehouseDistances.map((wd) => wd.inventory);
    const result = await allocateFromMultipleWarehouses(request, sortedInventories);
    // Add distance and shipping estimates
    result.allocations.forEach((alloc) => {
        const warehouseDist = warehouseDistances.find((wd) => wd.inventory.warehouseId === alloc.warehouseId);
        if (warehouseDist) {
            alloc.distance = warehouseDist.distance;
            alloc.shippingCost = estimateShippingCost(warehouseDist.distance, alloc.allocatedQuantity);
            alloc.estimatedShipDate = new Date();
            alloc.estimatedDeliveryDate = estimateDeliveryDate(warehouseDist.distance);
        }
    });
    return result;
}
/**
 * Consolidate shipments from multiple warehouses
 *
 * @param allocations - Warehouse allocations
 * @param consolidationHub - Hub location for consolidation
 * @returns Consolidated shipment plan
 */
function consolidateMultiWarehouseShipments(allocations, consolidationHub) {
    if (allocations.length <= 1) {
        return {
            requiresConsolidation: false,
            estimatedConsolidationDelay: 0,
            totalShippingCost: allocations[0]?.shippingCost || 0,
        };
    }
    const totalShippingCost = allocations.reduce((sum, a) => sum + (a.shippingCost || 0), 0);
    return {
        requiresConsolidation: true,
        consolidationPoint: consolidationHub,
        estimatedConsolidationDelay: 2, // 2 days for consolidation
        totalShippingCost: totalShippingCost * 1.1, // 10% premium for consolidation
    };
}
// ============================================================================
// SPLIT SHIPMENT ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Create split shipment allocation plan
 *
 * @param request - Allocation request
 * @param inventories - Available inventories
 * @param config - Split shipment configuration
 * @returns Split shipment allocation result
 */
async function createSplitShipmentPlan(request, inventories, config) {
    if (!config.allowSplitShipment) {
        // Try single shipment allocation
        return await optimizeToMinimizeWarehouses(request, inventories);
    }
    // Allow multiple warehouses up to max shipments
    const result = await allocateFromMultipleWarehouses({ ...request, maxWarehouses: config.maxShipments }, inventories);
    // Filter out shipments below minimum quantity
    const validAllocations = result.allocations.filter((alloc) => alloc.allocatedQuantity >= config.minQuantityPerShipment);
    // Redistribute if needed
    if (validAllocations.length < result.allocations.length) {
        const totalValid = validAllocations.reduce((sum, a) => sum + a.allocatedQuantity, 0);
        return {
            ...result,
            allocations: validAllocations,
            totalAllocated: totalValid,
            fulfillmentPercentage: (totalValid / request.requestedQuantity) * 100,
            shortQuantity: request.requestedQuantity - totalValid,
        };
    }
    return result;
}
/**
 * Calculate split shipment costs and trade-offs
 *
 * @param allocations - Warehouse allocations
 * @param config - Split shipment configuration
 * @returns Cost analysis of split shipment
 */
function analyzeSplitShipmentCosts(allocations, config) {
    const numberOfShipments = allocations.length;
    const baseShippingCost = allocations.reduce((sum, a) => sum + (a.shippingCost || 0), 0);
    const additionalCosts = config.additionalCostPerShipment
        ? (numberOfShipments - 1) * config.additionalCostPerShipment
        : 0;
    const totalCost = baseShippingCost + additionalCosts;
    // Recommend consolidation if costs are high and preference is set
    const recommendation = config.preferConsolidation && numberOfShipments > 2 && additionalCosts > baseShippingCost * 0.3
        ? 'CONSOLIDATE'
        : 'SPLIT';
    return {
        numberOfShipments,
        baseShippingCost,
        additionalCosts,
        totalCost,
        recommendation,
    };
}
// ============================================================================
// SUBSTITUTE ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Find substitute items for allocation
 *
 * @param itemId - Original item identifier
 * @param requiredQuantity - Required quantity
 * @param substitutionRules - Substitution rules/mappings
 * @returns Array of substitute options
 */
function findSubstituteItems(itemId, requiredQuantity, substitutionRules) {
    const substitutes = substitutionRules
        .filter((rule) => rule.originalItemId === itemId)
        .sort((a, b) => a.priority - b.priority)
        .map((rule) => ({
        originalItemId: itemId,
        substituteItemId: rule.substituteItemId,
        substituteDescription: rule.substituteDescription,
        quantity: requiredQuantity,
        substitutionReason: 'Original item unavailable',
        priceAdjustment: rule.priceAdjustment,
        requiresApproval: rule.requiresApproval,
    }));
    return substitutes;
}
/**
 * Allocate with automatic substitution
 *
 * @param request - Allocation request
 * @param inventories - Inventory for original item
 * @param substituteInventories - Inventories for substitute items
 * @param substitutionRules - Substitution rules
 * @returns Allocation result with substitutions
 */
async function allocateWithSubstitution(request, inventories, substituteInventories, substitutionRules) {
    // Try to allocate original item first
    const originalResult = await allocateFromMultipleWarehouses(request, inventories);
    // If fully allocated, return
    if (originalResult.status === AllocationStatus.ALLOCATED) {
        return originalResult;
    }
    // Find substitutes for short quantity
    const shortQuantity = originalResult.shortQuantity;
    const substitutes = findSubstituteItems(request.itemId, shortQuantity, substitutionRules);
    const substitutionAllocations = [];
    let remainingShort = shortQuantity;
    // Try to allocate substitutes
    for (const substitute of substitutes) {
        if (remainingShort <= 0)
            break;
        const subInventories = substituteInventories.get(substitute.substituteItemId) || [];
        const subRequest = {
            ...request,
            itemId: substitute.substituteItemId,
            requestedQuantity: remainingShort,
        };
        const subResult = await allocateFromMultipleWarehouses(subRequest, subInventories);
        if (subResult.totalAllocated > 0) {
            substitutionAllocations.push(...subResult.allocations);
            remainingShort -= subResult.totalAllocated;
        }
    }
    const totalAllocated = originalResult.totalAllocated + substitutionAllocations.reduce((sum, a) => sum + a.allocatedQuantity, 0);
    return {
        requestId: request.requestId,
        status: totalAllocated >= request.requestedQuantity ? AllocationStatus.ALLOCATED : AllocationStatus.PARTIALLY_ALLOCATED,
        allocations: [...originalResult.allocations, ...substitutionAllocations],
        totalAllocated,
        totalRequested: request.requestedQuantity,
        fulfillmentPercentage: (totalAllocated / request.requestedQuantity) * 100,
        shortQuantity: request.requestedQuantity - totalAllocated,
        substitutions: substitutes.filter((s) => substitutionAllocations.some((a) => a.itemId === s.substituteItemId)),
        processingTime: originalResult.processingTime,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Sort warehouses based on allocation strategy
 */
function sortWarehousesByStrategy(inventories, request) {
    switch (request.strategy) {
        case AllocationStrategy.NEAREST:
            return request.customerLocation
                ? [...inventories].sort((a, b) => {
                    const distA = a.location ? calculateDistance(request.customerLocation, a.location) : 999999;
                    const distB = b.location ? calculateDistance(request.customerLocation, b.location) : 999999;
                    return distA - distB;
                })
                : inventories;
        case AllocationStrategy.LOWEST_COST:
            return [...inventories].sort((a, b) => (a.costPerUnit || 0) - (b.costPerUnit || 0));
        case AllocationStrategy.BALANCED:
            return [...inventories].sort((a, b) => {
                const utilA = a.allocatedQuantity / a.onHandQuantity;
                const utilB = b.allocatedQuantity / b.onHandQuantity;
                return utilA - utilB;
            });
        default:
            return inventories;
    }
}
/**
 * Calculate distance between two geographic locations (Haversine formula)
 */
function calculateDistance(loc1, loc2) {
    const R = 3959; // Earth radius in miles
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((loc1.latitude * Math.PI) / 180) *
            Math.cos((loc2.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Estimate shipping cost based on distance and quantity
 */
function estimateShippingCost(distance, quantity) {
    const baseRate = 5.0;
    const perMileRate = 0.5;
    const perUnitRate = 0.25;
    return baseRate + distance * perMileRate + quantity * perUnitRate;
}
/**
 * Estimate delivery date based on distance
 */
function estimateDeliveryDate(distance) {
    const deliveryDate = new Date();
    const daysToDeliver = Math.ceil(distance / 500) + 1; // 500 miles per day + 1 day processing
    deliveryDate.setDate(deliveryDate.getDate() + daysToDeliver);
    return deliveryDate;
}
/**
 * Calculate optimization score for warehouse selection
 */
function calculateOptimizationScore(factors, criteria) {
    let score = 0;
    const weights = criteria.weights || {};
    if (criteria.minimizeDistance) {
        score += (weights.distance || 1) * (1000 / (factors.distance + 1));
    }
    if (criteria.minimizeShippingCost) {
        score += (weights.cost || 1) * (1000 / (factors.cost + 1));
    }
    // Higher ATP = higher score
    score += factors.atp * 0.1;
    return score;
}
/**
 * Create backorder reservation
 */
async function createBackorderReservation(request, quantity) {
    return {
        reservationId: `BO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        itemId: request.itemId,
        warehouseId: 'BACKORDER',
        quantity,
        reservedQuantity: quantity,
        allocatedQuantity: 0,
        type: ReservationType.BACKORDER,
        priority: AllocationPriority.BACKORDER,
        orderId: request.orderId,
        orderLineId: request.orderLineId,
        customerId: request.customerId,
        createdDate: new Date(),
        createdBy: 'SYSTEM',
        status: AllocationStatus.PENDING,
        metadata: { backorderReason: 'Insufficient inventory' },
    };
}
/**
 * Calculate estimated availability date for backorders
 */
function calculateEstimatedAvailability(itemId, inventories) {
    // Find longest lead time
    const maxLeadTime = Math.max(...inventories.map((inv) => inv.leadTimeDays), 7);
    const availDate = new Date();
    availDate.setDate(availDate.getDate() + maxLeadTime);
    return availDate;
}
/**
 * Update inventory map after allocation
 */
function updateInventoryAfterAllocation(inventoryMap, itemId, result) {
    const inventories = inventoryMap.get(itemId);
    if (!inventories)
        return;
    result.allocations.forEach((alloc) => {
        const inventory = inventories.find((inv) => inv.warehouseId === alloc.warehouseId);
        if (inventory) {
            inventory.allocatedQuantity += alloc.allocatedQuantity;
            inventory.availableQuantity -= alloc.allocatedQuantity;
        }
    });
}
//# sourceMappingURL=inventory-allocation-kit.js.map