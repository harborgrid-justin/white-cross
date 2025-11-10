"use strict";
/**
 * LOC: PROD-EXEC-001
 * File: /reuse/logistics/production-order-execution-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Manufacturing execution controllers
 *   - Production planning services
 *   - Quality control systems
 *   - Material management systems
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
exports.ProductionPriority = exports.LaborEntryType = exports.QualityCheckStatus = exports.MaterialIssueStatus = exports.WorkOrderStatus = exports.ProductionOrderStatus = void 0;
exports.createProductionOrder = createProductionOrder;
exports.releaseProductionOrder = releaseProductionOrder;
exports.startProductionOrder = startProductionOrder;
exports.holdProductionOrder = holdProductionOrder;
exports.resumeProductionOrder = resumeProductionOrder;
exports.completeProductionOrder = completeProductionOrder;
exports.closeProductionOrder = closeProductionOrder;
exports.cancelProductionOrder = cancelProductionOrder;
exports.updateProductionOrderQuantity = updateProductionOrderQuantity;
exports.createMaterialIssues = createMaterialIssues;
exports.issueMaterial = issueMaterial;
exports.returnMaterial = returnMaterial;
exports.scrapMaterial = scrapMaterial;
exports.checkMaterialAvailability = checkMaterialAvailability;
exports.backflushMaterials = backflushMaterials;
exports.generateMaterialShortageReport = generateMaterialShortageReport;
exports.allocateMaterials = allocateMaterials;
exports.calculateMaterialCost = calculateMaterialCost;
exports.createWorkOrders = createWorkOrders;
exports.startWorkOrder = startWorkOrder;
exports.clockInLabor = clockInLabor;
exports.clockOutLabor = clockOutLabor;
exports.pauseWorkOrder = pauseWorkOrder;
exports.resumeWorkOrder = resumeWorkOrder;
exports.completeWorkOrder = completeWorkOrder;
exports.calculateLaborHours = calculateLaborHours;
exports.calculateLaborCost = calculateLaborCost;
exports.createQualityCheckpoints = createQualityCheckpoints;
exports.recordQualityCheck = recordQualityCheck;
exports.recordSampleInspection = recordSampleInspection;
exports.recordDefects = recordDefects;
exports.validateQualityCheckpoints = validateQualityCheckpoints;
exports.calculateFirstPassYield = calculateFirstPassYield;
exports.generateQualityReport = generateQualityReport;
exports.waiveQualityCheckpoint = waiveQualityCheckpoint;
exports.reportProductionQuantity = reportProductionQuantity;
exports.calculateYieldPercentage = calculateYieldPercentage;
exports.calculateProductionEfficiency = calculateProductionEfficiency;
exports.generateProductionSummary = generateProductionSummary;
exports.generateProductionMetrics = generateProductionMetrics;
exports.searchProductionOrders = searchProductionOrders;
exports.exportProductionOrdersToCSV = exportProductionOrdersToCSV;
exports.validateProductionOrderCompletion = validateProductionOrderCompletion;
exports.generateProductionOrderId = generateProductionOrderId;
exports.generateOrderNumber = generateOrderNumber;
exports.generateWorkOrderId = generateWorkOrderId;
exports.generateWorkOrderNumber = generateWorkOrderNumber;
exports.generateMaterialIssueId = generateMaterialIssueId;
exports.generateLaborEntryId = generateLaborEntryId;
exports.generateCheckpointId = generateCheckpointId;
/**
 * File: /reuse/logistics/production-order-execution-kit.ts
 * Locator: WC-LOGISTICS-PROD-EXEC-001
 * Purpose: Comprehensive Production Order Execution - Complete manufacturing execution lifecycle
 *
 * Upstream: Independent utility module for manufacturing execution operations
 * Downstream: ../backend/logistics/*, Manufacturing modules, MES systems, ERP integrations
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 43 utility functions for production orders, work orders, material tracking, labor, quality control
 *
 * LLM Context: Enterprise-grade manufacturing execution utilities to compete with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive production order lifecycle management, work order scheduling, material issue/tracking,
 * labor time capture, resource allocation, quality checkpoints, production reporting, real-time shop floor
 * integration, and complete traceability for regulated manufacturing environments.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Production order status enumeration
 */
var ProductionOrderStatus;
(function (ProductionOrderStatus) {
    ProductionOrderStatus["DRAFT"] = "DRAFT";
    ProductionOrderStatus["RELEASED"] = "RELEASED";
    ProductionOrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProductionOrderStatus["ON_HOLD"] = "ON_HOLD";
    ProductionOrderStatus["COMPLETED"] = "COMPLETED";
    ProductionOrderStatus["CLOSED"] = "CLOSED";
    ProductionOrderStatus["CANCELLED"] = "CANCELLED";
})(ProductionOrderStatus || (exports.ProductionOrderStatus = ProductionOrderStatus = {}));
/**
 * Work order status enumeration
 */
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["PENDING"] = "PENDING";
    WorkOrderStatus["READY"] = "READY";
    WorkOrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkOrderStatus["PAUSED"] = "PAUSED";
    WorkOrderStatus["COMPLETED"] = "COMPLETED";
    WorkOrderStatus["FAILED"] = "FAILED";
    WorkOrderStatus["SKIPPED"] = "SKIPPED";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
/**
 * Material issue status
 */
var MaterialIssueStatus;
(function (MaterialIssueStatus) {
    MaterialIssueStatus["PLANNED"] = "PLANNED";
    MaterialIssueStatus["ISSUED"] = "ISSUED";
    MaterialIssueStatus["PARTIALLY_ISSUED"] = "PARTIALLY_ISSUED";
    MaterialIssueStatus["RETURNED"] = "RETURNED";
    MaterialIssueStatus["SCRAPPED"] = "SCRAPPED";
})(MaterialIssueStatus || (exports.MaterialIssueStatus = MaterialIssueStatus = {}));
/**
 * Quality checkpoint status
 */
var QualityCheckStatus;
(function (QualityCheckStatus) {
    QualityCheckStatus["PENDING"] = "PENDING";
    QualityCheckStatus["PASSED"] = "PASSED";
    QualityCheckStatus["FAILED"] = "FAILED";
    QualityCheckStatus["CONDITIONAL"] = "CONDITIONAL";
    QualityCheckStatus["WAIVED"] = "WAIVED";
})(QualityCheckStatus || (exports.QualityCheckStatus = QualityCheckStatus = {}));
/**
 * Labor entry type
 */
var LaborEntryType;
(function (LaborEntryType) {
    LaborEntryType["SETUP"] = "SETUP";
    LaborEntryType["RUN"] = "RUN";
    LaborEntryType["INSPECTION"] = "INSPECTION";
    LaborEntryType["REWORK"] = "REWORK";
    LaborEntryType["MAINTENANCE"] = "MAINTENANCE";
    LaborEntryType["DOWNTIME"] = "DOWNTIME";
})(LaborEntryType || (exports.LaborEntryType = LaborEntryType = {}));
/**
 * Production order priority
 */
var ProductionPriority;
(function (ProductionPriority) {
    ProductionPriority[ProductionPriority["LOW"] = 1] = "LOW";
    ProductionPriority[ProductionPriority["NORMAL"] = 5] = "NORMAL";
    ProductionPriority[ProductionPriority["HIGH"] = 8] = "HIGH";
    ProductionPriority[ProductionPriority["URGENT"] = 10] = "URGENT";
    ProductionPriority[ProductionPriority["CRITICAL"] = 15] = "CRITICAL";
})(ProductionPriority || (exports.ProductionPriority = ProductionPriority = {}));
// ============================================================================
// SECTION 1: ORDER CREATION & MANAGEMENT (Functions 1-9)
// ============================================================================
/**
 * 1. Creates a new production order from configuration.
 *
 * @param {ProductionOrderConfig} config - Production order configuration
 * @param {BOMLineItem[]} bom - Bill of materials
 * @param {RoutingOperation[]} routing - Manufacturing routing
 * @returns {ProductionOrder} New production order
 *
 * @example
 * ```typescript
 * const order = createProductionOrder(
 *   {
 *     facilityId: 'FAC-001',
 *     itemId: 'ITEM-12345',
 *     itemCode: 'WIDGET-A',
 *     quantity: 1000,
 *     unitOfMeasure: 'EA',
 *     priority: ProductionPriority.HIGH,
 *     plannedStartDate: new Date('2024-02-01'),
 *     plannedCompletionDate: new Date('2024-02-15')
 *   },
 *   bomItems,
 *   routingOperations
 * );
 * ```
 */
function createProductionOrder(config, bom, routing) {
    const productionOrderId = generateProductionOrderId();
    const orderNumber = generateOrderNumber(config.facilityId);
    return {
        productionOrderId,
        orderNumber,
        itemId: config.itemId,
        itemCode: config.itemCode,
        itemDescription: config.itemCode, // Would typically fetch from item master
        plannedQuantity: config.quantity,
        completedQuantity: 0,
        scrappedQuantity: 0,
        unitOfMeasure: config.unitOfMeasure,
        status: ProductionOrderStatus.DRAFT,
        priority: config.priority,
        facilityId: config.facilityId,
        plannedStartDate: config.plannedStartDate,
        plannedCompletionDate: config.plannedCompletionDate,
        salesOrderId: config.salesOrderId,
        customerId: config.customerId,
        bom,
        routing,
        workOrders: [],
        lotNumber: config.lotNumber,
        serialNumbers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 2. Releases production order for execution with Sequelize eager loading.
 *
 * @param {ProductionOrder} order - Production order to release
 * @returns {ProductionOrder} Released production order
 *
 * @example
 * ```typescript
 * // With Sequelize model
 * const order = await ProductionOrderModel.findByPk(orderId, {
 *   include: [
 *     { model: WorkOrderModel, as: 'workOrders' },
 *     { model: ItemModel, as: 'item' },
 *     { model: FacilityModel, as: 'facility' }
 *   ]
 * });
 * const released = releaseProductionOrder(order);
 * await order.save();
 * ```
 */
function releaseProductionOrder(order) {
    if (order.status !== ProductionOrderStatus.DRAFT) {
        throw new Error(`Cannot release order in ${order.status} status`);
    }
    // Validate material availability
    const availability = checkMaterialAvailability(order);
    const hasShortage = availability.some(item => !item.isAvailable);
    if (hasShortage) {
        throw new Error('Cannot release order: Material shortages detected');
    }
    return {
        ...order,
        status: ProductionOrderStatus.RELEASED,
        updatedAt: new Date(),
    };
}
/**
 * 3. Starts production order execution.
 *
 * @param {ProductionOrder} order - Production order to start
 * @returns {ProductionOrder} Started production order
 *
 * @example
 * ```typescript
 * const started = startProductionOrder(order);
 * ```
 */
function startProductionOrder(order) {
    if (order.status !== ProductionOrderStatus.RELEASED) {
        throw new Error(`Cannot start order in ${order.status} status`);
    }
    return {
        ...order,
        status: ProductionOrderStatus.IN_PROGRESS,
        actualStartDate: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 4. Puts production order on hold.
 *
 * @param {ProductionOrder} order - Production order to hold
 * @param {string} reason - Hold reason
 * @returns {ProductionOrder} Updated production order
 *
 * @example
 * ```typescript
 * const held = holdProductionOrder(order, 'Material quality issue');
 * ```
 */
function holdProductionOrder(order, reason) {
    if (order.status !== ProductionOrderStatus.IN_PROGRESS) {
        throw new Error('Can only hold in-progress orders');
    }
    return {
        ...order,
        status: ProductionOrderStatus.ON_HOLD,
        metadata: {
            ...order.metadata,
            holdReason: reason,
            heldAt: new Date(),
        },
        updatedAt: new Date(),
    };
}
/**
 * 5. Resumes production order from hold.
 *
 * @param {ProductionOrder} order - Production order to resume
 * @returns {ProductionOrder} Resumed production order
 *
 * @example
 * ```typescript
 * const resumed = resumeProductionOrder(order);
 * ```
 */
function resumeProductionOrder(order) {
    if (order.status !== ProductionOrderStatus.ON_HOLD) {
        throw new Error('Can only resume orders on hold');
    }
    return {
        ...order,
        status: ProductionOrderStatus.IN_PROGRESS,
        metadata: {
            ...order.metadata,
            resumedAt: new Date(),
        },
        updatedAt: new Date(),
    };
}
/**
 * 6. Completes production order.
 *
 * @param {ProductionOrder} order - Production order to complete
 * @returns {ProductionOrder} Completed production order
 *
 * @example
 * ```typescript
 * const completed = completeProductionOrder(order);
 * ```
 */
function completeProductionOrder(order) {
    if (order.status !== ProductionOrderStatus.IN_PROGRESS) {
        throw new Error('Can only complete in-progress orders');
    }
    // Validate all work orders are completed
    const incompleteWorkOrders = order.workOrders.filter(wo => wo.status !== WorkOrderStatus.COMPLETED && wo.status !== WorkOrderStatus.SKIPPED);
    if (incompleteWorkOrders.length > 0) {
        throw new Error('Cannot complete order: Work orders still pending');
    }
    return {
        ...order,
        status: ProductionOrderStatus.COMPLETED,
        actualCompletionDate: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 7. Closes production order (final accounting).
 *
 * @param {ProductionOrder} order - Production order to close
 * @returns {ProductionOrder} Closed production order
 *
 * @example
 * ```typescript
 * const closed = closeProductionOrder(order);
 * ```
 */
function closeProductionOrder(order) {
    if (order.status !== ProductionOrderStatus.COMPLETED) {
        throw new Error('Can only close completed orders');
    }
    return {
        ...order,
        status: ProductionOrderStatus.CLOSED,
        metadata: {
            ...order.metadata,
            closedAt: new Date(),
        },
        updatedAt: new Date(),
    };
}
/**
 * 8. Cancels production order.
 *
 * @param {ProductionOrder} order - Production order to cancel
 * @param {string} reason - Cancellation reason
 * @returns {ProductionOrder} Cancelled production order
 *
 * @example
 * ```typescript
 * const cancelled = cancelProductionOrder(order, 'Customer cancelled sales order');
 * ```
 */
function cancelProductionOrder(order, reason) {
    if (order.status === ProductionOrderStatus.CLOSED) {
        throw new Error('Cannot cancel closed orders');
    }
    return {
        ...order,
        status: ProductionOrderStatus.CANCELLED,
        metadata: {
            ...order.metadata,
            cancellationReason: reason,
            cancelledAt: new Date(),
        },
        updatedAt: new Date(),
    };
}
/**
 * 9. Updates production order quantity.
 *
 * @param {ProductionOrder} order - Production order to update
 * @param {number} newQuantity - New planned quantity
 * @returns {ProductionOrder} Updated production order
 *
 * @example
 * ```typescript
 * const updated = updateProductionOrderQuantity(order, 1500);
 * ```
 */
function updateProductionOrderQuantity(order, newQuantity) {
    if (order.status === ProductionOrderStatus.COMPLETED ||
        order.status === ProductionOrderStatus.CLOSED) {
        throw new Error('Cannot update quantity for completed/closed orders');
    }
    if (newQuantity < order.completedQuantity) {
        throw new Error('New quantity cannot be less than completed quantity');
    }
    return {
        ...order,
        plannedQuantity: newQuantity,
        updatedAt: new Date(),
    };
}
// ============================================================================
// SECTION 2: MATERIAL ISSUE & TRACKING (Functions 10-18)
// ============================================================================
/**
 * 10. Creates material issue transactions from BOM.
 *
 * @param {ProductionOrder} order - Production order
 * @param {WorkOrder} workOrder - Work order
 * @returns {MaterialIssue[]} Material issue transactions
 *
 * @example
 * ```typescript
 * const issues = createMaterialIssues(productionOrder, workOrder);
 * ```
 */
function createMaterialIssues(order, workOrder) {
    return order.bom.map(bomItem => ({
        materialIssueId: generateMaterialIssueId(),
        workOrderId: workOrder.workOrderId,
        productionOrderId: order.productionOrderId,
        itemId: bomItem.itemId,
        itemCode: bomItem.itemCode,
        plannedQuantity: bomItem.quantity * workOrder.plannedQuantity * (1 + bomItem.scrapFactor),
        issuedQuantity: 0,
        returnedQuantity: 0,
        scrappedQuantity: 0,
        unitOfMeasure: bomItem.unitOfMeasure,
        status: MaterialIssueStatus.PLANNED,
        warehouseLocation: bomItem.issueLocation || 'DEFAULT',
    }));
}
/**
 * 11. Issues material to work order with Sequelize associations.
 *
 * @param {MaterialIssue} issue - Material issue to process
 * @param {number} quantity - Quantity to issue
 * @param {string} issuedBy - User ID issuing material
 * @returns {MaterialIssue} Updated material issue
 *
 * @example
 * ```typescript
 * // With Sequelize model
 * const materialIssue = await MaterialIssueModel.findByPk(issueId, {
 *   include: [
 *     { model: WorkOrderModel, as: 'workOrder' },
 *     { model: ItemModel, as: 'item' },
 *     { model: WarehouseLocationModel, as: 'location' }
 *   ]
 * });
 * const issued = issueMaterial(materialIssue, 100, 'USER-123');
 * await materialIssue.save();
 * ```
 */
function issueMaterial(issue, quantity, issuedBy) {
    if (issue.status === MaterialIssueStatus.ISSUED) {
        throw new Error('Material already fully issued');
    }
    const newIssuedQuantity = issue.issuedQuantity + quantity;
    if (newIssuedQuantity > issue.plannedQuantity * 1.1) {
        throw new Error('Issue quantity exceeds planned quantity by more than 10%');
    }
    const status = newIssuedQuantity >= issue.plannedQuantity
        ? MaterialIssueStatus.ISSUED
        : MaterialIssueStatus.PARTIALLY_ISSUED;
    return {
        ...issue,
        issuedQuantity: newIssuedQuantity,
        status,
        issuedBy,
        issuedAt: new Date(),
    };
}
/**
 * 12. Returns material from work order.
 *
 * @param {MaterialIssue} issue - Material issue
 * @param {number} quantity - Quantity to return
 * @returns {MaterialIssue} Updated material issue
 *
 * @example
 * ```typescript
 * const returned = returnMaterial(materialIssue, 25);
 * ```
 */
function returnMaterial(issue, quantity) {
    if (quantity > issue.issuedQuantity - issue.returnedQuantity) {
        throw new Error('Return quantity exceeds issued quantity');
    }
    return {
        ...issue,
        returnedQuantity: issue.returnedQuantity + quantity,
        status: MaterialIssueStatus.RETURNED,
    };
}
/**
 * 13. Records material scrap/waste.
 *
 * @param {MaterialIssue} issue - Material issue
 * @param {number} quantity - Scrapped quantity
 * @param {string} reason - Scrap reason
 * @returns {MaterialIssue} Updated material issue
 *
 * @example
 * ```typescript
 * const scrapped = scrapMaterial(materialIssue, 10, 'Defective raw material');
 * ```
 */
function scrapMaterial(issue, quantity, reason) {
    return {
        ...issue,
        scrappedQuantity: issue.scrappedQuantity + quantity,
        status: MaterialIssueStatus.SCRAPPED,
        metadata: {
            ...issue.metadata,
            scrapReason: reason,
            scrappedAt: new Date(),
        },
    };
}
/**
 * 14. Checks material availability for production order.
 *
 * @param {ProductionOrder} order - Production order
 * @returns {MaterialAvailability[]} Material availability results
 *
 * @example
 * ```typescript
 * const availability = checkMaterialAvailability(productionOrder);
 * const shortages = availability.filter(item => !item.isAvailable);
 * ```
 */
function checkMaterialAvailability(order) {
    return order.bom.map(bomItem => {
        const requiredQuantity = bomItem.quantity * order.plannedQuantity * (1 + bomItem.scrapFactor);
        // In real implementation, this would query inventory system
        const availableQuantity = requiredQuantity * 0.95; // Simulated
        const shortageQuantity = Math.max(0, requiredQuantity - availableQuantity);
        return {
            itemId: bomItem.itemId,
            itemCode: bomItem.itemCode,
            requiredQuantity,
            availableQuantity,
            shortageQuantity,
            isAvailable: shortageQuantity === 0,
        };
    });
}
/**
 * 15. Backflushes materials on work order completion.
 *
 * @param {WorkOrder} workOrder - Completed work order
 * @param {ProductionOrder} order - Production order
 * @returns {MaterialIssue[]} Backflushed material issues
 *
 * @example
 * ```typescript
 * const backflushed = backflushMaterials(workOrder, productionOrder);
 * ```
 */
function backflushMaterials(workOrder, order) {
    const backflushItems = order.bom.filter(bomItem => bomItem.backflushFlag);
    return backflushItems.map(bomItem => {
        const quantity = bomItem.quantity * workOrder.completedQuantity;
        return {
            materialIssueId: generateMaterialIssueId(),
            workOrderId: workOrder.workOrderId,
            productionOrderId: order.productionOrderId,
            itemId: bomItem.itemId,
            itemCode: bomItem.itemCode,
            plannedQuantity: quantity,
            issuedQuantity: quantity,
            returnedQuantity: 0,
            scrappedQuantity: 0,
            unitOfMeasure: bomItem.unitOfMeasure,
            status: MaterialIssueStatus.ISSUED,
            warehouseLocation: bomItem.issueLocation || 'DEFAULT',
            issuedBy: 'SYSTEM',
            issuedAt: new Date(),
            metadata: {
                backflushed: true,
                backflushDate: new Date(),
            },
        };
    });
}
/**
 * 16. Generates material shortage report.
 *
 * @param {ProductionOrder} order - Production order
 * @returns {object} Shortage report
 *
 * @example
 * ```typescript
 * const report = generateMaterialShortageReport(productionOrder);
 * ```
 */
function generateMaterialShortageReport(order) {
    const availability = checkMaterialAvailability(order);
    const shortages = availability.filter(item => !item.isAvailable);
    return {
        orderId: order.productionOrderId,
        orderNumber: order.orderNumber,
        shortages,
        totalShortageItems: shortages.length,
        canProceed: shortages.length === 0,
    };
}
/**
 * 17. Allocates material to production order.
 *
 * @param {ProductionOrder} order - Production order
 * @param {string} warehouseLocation - Warehouse location
 * @returns {MaterialIssue[]} Allocated material issues
 *
 * @example
 * ```typescript
 * const allocated = allocateMaterials(productionOrder, 'WH-001');
 * ```
 */
function allocateMaterials(order, warehouseLocation) {
    return order.bom.map(bomItem => ({
        materialIssueId: generateMaterialIssueId(),
        workOrderId: '', // Allocated at order level, not work order
        productionOrderId: order.productionOrderId,
        itemId: bomItem.itemId,
        itemCode: bomItem.itemCode,
        plannedQuantity: bomItem.quantity * order.plannedQuantity,
        issuedQuantity: 0,
        returnedQuantity: 0,
        scrappedQuantity: 0,
        unitOfMeasure: bomItem.unitOfMeasure,
        status: MaterialIssueStatus.PLANNED,
        warehouseLocation,
        metadata: {
            allocated: true,
            allocatedAt: new Date(),
        },
    }));
}
/**
 * 18. Calculates material cost for production order.
 *
 * @param {MaterialIssue[]} issues - Material issues
 * @param {Record<string, number>} unitCosts - Item unit costs
 * @returns {number} Total material cost
 *
 * @example
 * ```typescript
 * const cost = calculateMaterialCost(materialIssues, { 'ITEM-001': 12.50 });
 * ```
 */
function calculateMaterialCost(issues, unitCosts) {
    return issues.reduce((total, issue) => {
        const unitCost = unitCosts[issue.itemId] || 0;
        const issuedCost = issue.issuedQuantity * unitCost;
        const scrapCost = issue.scrappedQuantity * unitCost;
        return total + issuedCost + scrapCost;
    }, 0);
}
// ============================================================================
// SECTION 3: LABOR & RESOURCE TRACKING (Functions 19-27)
// ============================================================================
/**
 * 19. Creates work orders from routing operations.
 *
 * @param {ProductionOrder} order - Production order
 * @returns {WorkOrder[]} Work orders
 *
 * @example
 * ```typescript
 * const workOrders = createWorkOrders(productionOrder);
 * ```
 */
function createWorkOrders(order) {
    return order.routing.map(operation => ({
        workOrderId: generateWorkOrderId(),
        workOrderNumber: generateWorkOrderNumber(order.orderNumber, operation.operationNumber),
        productionOrderId: order.productionOrderId,
        operationId: operation.operationId,
        operationNumber: operation.operationNumber,
        operationDescription: operation.operationDescription,
        workCenterId: operation.workCenterId,
        status: WorkOrderStatus.PENDING,
        plannedQuantity: order.plannedQuantity,
        completedQuantity: 0,
        scrappedQuantity: 0,
        scheduledStartTime: order.plannedStartDate,
        scheduledEndTime: order.plannedCompletionDate,
        materialIssues: [],
        laborEntries: [],
        qualityCheckpoints: [],
    }));
}
/**
 * 20. Starts work order execution with operator assignment.
 *
 * @param {WorkOrder} workOrder - Work order to start
 * @param {string[]} operatorIds - Assigned operator IDs
 * @returns {WorkOrder} Started work order
 *
 * @example
 * ```typescript
 * // With Sequelize model
 * const workOrder = await WorkOrderModel.findByPk(workOrderId, {
 *   include: [
 *     { model: OperatorModel, as: 'operators', through: { attributes: [] } },
 *     { model: ProductionOrderModel, as: 'productionOrder' },
 *     { model: WorkCenterModel, as: 'workCenter' }
 *   ]
 * });
 * const started = startWorkOrder(workOrder, ['OP-001', 'OP-002']);
 * await workOrder.save();
 * ```
 */
function startWorkOrder(workOrder, operatorIds) {
    if (workOrder.status !== WorkOrderStatus.READY &&
        workOrder.status !== WorkOrderStatus.PENDING) {
        throw new Error(`Cannot start work order in ${workOrder.status} status`);
    }
    return {
        ...workOrder,
        status: WorkOrderStatus.IN_PROGRESS,
        actualStartTime: new Date(),
        assignedOperators: operatorIds,
    };
}
/**
 * 21. Records labor time entry (clock in/out).
 *
 * @param {WorkOrder} workOrder - Work order
 * @param {string} operatorId - Operator ID
 * @param {LaborEntryType} entryType - Labor entry type
 * @returns {LaborEntry} Labor entry
 *
 * @example
 * ```typescript
 * const laborEntry = clockInLabor(workOrder, 'OP-001', LaborEntryType.RUN);
 * ```
 */
function clockInLabor(workOrder, operatorId, entryType) {
    return {
        laborEntryId: generateLaborEntryId(),
        workOrderId: workOrder.workOrderId,
        productionOrderId: workOrder.productionOrderId,
        operatorId,
        operatorName: operatorId, // Would fetch from user system
        entryType,
        clockInTime: new Date(),
    };
}
/**
 * 22. Completes labor time entry (clock out).
 *
 * @param {LaborEntry} entry - Labor entry to complete
 * @param {number} quantityProduced - Quantity produced
 * @param {number} quantityScrapped - Quantity scrapped
 * @returns {LaborEntry} Completed labor entry
 *
 * @example
 * ```typescript
 * const completed = clockOutLabor(laborEntry, 150, 5);
 * ```
 */
function clockOutLabor(entry, quantityProduced, quantityScrapped = 0) {
    const clockOutTime = new Date();
    const duration = (clockOutTime.getTime() - entry.clockInTime.getTime()) / (1000 * 60 * 60); // hours
    return {
        ...entry,
        clockOutTime,
        duration,
        quantityProduced,
        quantityScrapped,
        laborCost: entry.hourlyRate ? duration * entry.hourlyRate : undefined,
    };
}
/**
 * 23. Pauses work order execution.
 *
 * @param {WorkOrder} workOrder - Work order to pause
 * @param {string} reason - Pause reason
 * @returns {WorkOrder} Paused work order
 *
 * @example
 * ```typescript
 * const paused = pauseWorkOrder(workOrder, 'Equipment maintenance');
 * ```
 */
function pauseWorkOrder(workOrder, reason) {
    if (workOrder.status !== WorkOrderStatus.IN_PROGRESS) {
        throw new Error('Can only pause in-progress work orders');
    }
    return {
        ...workOrder,
        status: WorkOrderStatus.PAUSED,
        metadata: {
            ...workOrder.metadata,
            pauseReason: reason,
            pausedAt: new Date(),
        },
    };
}
/**
 * 24. Resumes paused work order.
 *
 * @param {WorkOrder} workOrder - Work order to resume
 * @returns {WorkOrder} Resumed work order
 *
 * @example
 * ```typescript
 * const resumed = resumeWorkOrder(workOrder);
 * ```
 */
function resumeWorkOrder(workOrder) {
    if (workOrder.status !== WorkOrderStatus.PAUSED) {
        throw new Error('Can only resume paused work orders');
    }
    return {
        ...workOrder,
        status: WorkOrderStatus.IN_PROGRESS,
        metadata: {
            ...workOrder.metadata,
            resumedAt: new Date(),
        },
    };
}
/**
 * 25. Completes work order with quantity reporting.
 *
 * @param {WorkOrder} workOrder - Work order to complete
 * @param {number} completedQuantity - Completed quantity
 * @param {number} scrappedQuantity - Scrapped quantity
 * @returns {WorkOrder} Completed work order
 *
 * @example
 * ```typescript
 * const completed = completeWorkOrder(workOrder, 950, 50);
 * ```
 */
function completeWorkOrder(workOrder, completedQuantity, scrappedQuantity = 0) {
    if (workOrder.status !== WorkOrderStatus.IN_PROGRESS) {
        throw new Error('Can only complete in-progress work orders');
    }
    return {
        ...workOrder,
        status: WorkOrderStatus.COMPLETED,
        completedQuantity,
        scrappedQuantity,
        actualEndTime: new Date(),
    };
}
/**
 * 26. Calculates total labor hours for work order.
 *
 * @param {LaborEntry[]} entries - Labor entries
 * @returns {object} Labor summary
 *
 * @example
 * ```typescript
 * const summary = calculateLaborHours(workOrder.laborEntries);
 * ```
 */
function calculateLaborHours(entries) {
    const summary = {
        totalHours: 0,
        setupHours: 0,
        runHours: 0,
        inspectionHours: 0,
        reworkHours: 0,
        downtime: 0,
    };
    for (const entry of entries) {
        const hours = entry.duration || 0;
        summary.totalHours += hours;
        switch (entry.entryType) {
            case LaborEntryType.SETUP:
                summary.setupHours += hours;
                break;
            case LaborEntryType.RUN:
                summary.runHours += hours;
                break;
            case LaborEntryType.INSPECTION:
                summary.inspectionHours += hours;
                break;
            case LaborEntryType.REWORK:
                summary.reworkHours += hours;
                break;
            case LaborEntryType.DOWNTIME:
                summary.downtime += hours;
                break;
        }
    }
    return summary;
}
/**
 * 27. Calculates labor cost for work order.
 *
 * @param {LaborEntry[]} entries - Labor entries
 * @returns {number} Total labor cost
 *
 * @example
 * ```typescript
 * const cost = calculateLaborCost(workOrder.laborEntries);
 * ```
 */
function calculateLaborCost(entries) {
    return entries.reduce((total, entry) => {
        return total + (entry.laborCost || 0);
    }, 0);
}
// ============================================================================
// SECTION 4: QUALITY CONTROL INTEGRATION (Functions 28-35)
// ============================================================================
/**
 * 28. Creates quality checkpoints from routing.
 *
 * @param {WorkOrder} workOrder - Work order
 * @param {RoutingOperation} operation - Routing operation
 * @returns {QualityCheckpoint[]} Quality checkpoints
 *
 * @example
 * ```typescript
 * const checkpoints = createQualityCheckpoints(workOrder, operation);
 * ```
 */
function createQualityCheckpoints(workOrder, operation) {
    if (!operation.qualityCheckpoints) {
        return [];
    }
    return operation.qualityCheckpoints.map(def => ({
        checkpointId: generateCheckpointId(),
        workOrderId: workOrder.workOrderId,
        productionOrderId: workOrder.productionOrderId,
        checkpointName: def.checkpointName,
        inspectionType: def.inspectionType,
        status: QualityCheckStatus.PENDING,
        measurements: {},
    }));
}
/**
 * 29. Records quality checkpoint result with Sequelize associations.
 *
 * @param {QualityCheckpoint} checkpoint - Quality checkpoint
 * @param {QualityCheckStatus} status - Check status
 * @param {Record<string, any>} measurements - Inspection measurements
 * @param {string} inspectorId - Inspector ID
 * @returns {QualityCheckpoint} Updated checkpoint
 *
 * @example
 * ```typescript
 * // With Sequelize model
 * const checkpoint = await QualityCheckpointModel.findByPk(checkpointId, {
 *   include: [
 *     { model: WorkOrderModel, as: 'workOrder' },
 *     { model: InspectorModel, as: 'inspector' },
 *     { model: DefectModel, as: 'defects' }
 *   ]
 * });
 * const recorded = recordQualityCheck(checkpoint, QualityCheckStatus.PASSED, measurements, 'QC-001');
 * await checkpoint.save();
 * ```
 */
function recordQualityCheck(checkpoint, status, measurements, inspectorId) {
    return {
        ...checkpoint,
        status,
        measurements,
        inspectedBy: inspectorId,
        inspectedAt: new Date(),
    };
}
/**
 * 30. Records quality inspection with sample data.
 *
 * @param {QualityCheckpoint} checkpoint - Quality checkpoint
 * @param {number} sampleSize - Sample size inspected
 * @param {number} acceptedQuantity - Accepted quantity
 * @param {number} rejectedQuantity - Rejected quantity
 * @returns {QualityCheckpoint} Updated checkpoint
 *
 * @example
 * ```typescript
 * const inspected = recordSampleInspection(checkpoint, 50, 48, 2);
 * ```
 */
function recordSampleInspection(checkpoint, sampleSize, acceptedQuantity, rejectedQuantity) {
    const status = rejectedQuantity === 0
        ? QualityCheckStatus.PASSED
        : rejectedQuantity <= sampleSize * 0.05
            ? QualityCheckStatus.CONDITIONAL
            : QualityCheckStatus.FAILED;
    return {
        ...checkpoint,
        status,
        sampleSize,
        acceptedQuantity,
        rejectedQuantity,
        inspectedAt: new Date(),
    };
}
/**
 * 31. Records defect codes for failed inspection.
 *
 * @param {QualityCheckpoint} checkpoint - Quality checkpoint
 * @param {string[]} defectCodes - Defect codes
 * @param {string} notes - Additional notes
 * @returns {QualityCheckpoint} Updated checkpoint
 *
 * @example
 * ```typescript
 * const updated = recordDefects(checkpoint, ['DEF-001', 'DEF-003'], 'Surface finish out of spec');
 * ```
 */
function recordDefects(checkpoint, defectCodes, notes) {
    return {
        ...checkpoint,
        defectCodes,
        notes,
        status: QualityCheckStatus.FAILED,
    };
}
/**
 * 32. Validates all quality checkpoints for work order.
 *
 * @param {WorkOrder} workOrder - Work order
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateQualityCheckpoints(workOrder);
 * if (!result.allPassed) {
 *   console.log('Failed checkpoints:', result.failedCheckpoints);
 * }
 * ```
 */
function validateQualityCheckpoints(workOrder) {
    const checkpoints = workOrder.qualityCheckpoints;
    const passed = checkpoints.filter(c => c.status === QualityCheckStatus.PASSED);
    const failed = checkpoints.filter(c => c.status === QualityCheckStatus.FAILED);
    const pending = checkpoints.filter(c => c.status === QualityCheckStatus.PENDING);
    return {
        allPassed: failed.length === 0 && pending.length === 0,
        totalCheckpoints: checkpoints.length,
        passedCheckpoints: passed.length,
        failedCheckpoints: failed,
        pendingCheckpoints: pending,
    };
}
/**
 * 33. Calculates first pass yield for work order.
 *
 * @param {WorkOrder} workOrder - Work order
 * @returns {number} First pass yield percentage
 *
 * @example
 * ```typescript
 * const fpy = calculateFirstPassYield(workOrder);
 * // Returns: 95.5 (for 95.5%)
 * ```
 */
function calculateFirstPassYield(workOrder) {
    if (workOrder.plannedQuantity === 0) {
        return 0;
    }
    const reworkQuantity = workOrder.laborEntries
        .filter(entry => entry.entryType === LaborEntryType.REWORK)
        .reduce((sum, entry) => sum + (entry.quantityProduced || 0), 0);
    const firstPassQuantity = workOrder.completedQuantity - reworkQuantity;
    return (firstPassQuantity / workOrder.plannedQuantity) * 100;
}
/**
 * 34. Generates quality report for production order.
 *
 * @param {ProductionOrder} order - Production order
 * @returns {object} Quality report
 *
 * @example
 * ```typescript
 * const report = generateQualityReport(productionOrder);
 * ```
 */
function generateQualityReport(order) {
    const allCheckpoints = order.workOrders.flatMap(wo => wo.qualityCheckpoints);
    const passed = allCheckpoints.filter(c => c.status === QualityCheckStatus.PASSED);
    const failed = allCheckpoints.filter(c => c.status === QualityCheckStatus.FAILED);
    // Aggregate defect codes
    const defectSummary = {};
    for (const checkpoint of failed) {
        if (checkpoint.defectCodes) {
            for (const code of checkpoint.defectCodes) {
                defectSummary[code] = (defectSummary[code] || 0) + 1;
            }
        }
    }
    const overallYield = order.plannedQuantity > 0
        ? (order.completedQuantity / order.plannedQuantity) * 100
        : 0;
    const avgFirstPassYield = order.workOrders.length > 0
        ? order.workOrders.reduce((sum, wo) => sum + calculateFirstPassYield(wo), 0) / order.workOrders.length
        : 0;
    return {
        orderId: order.productionOrderId,
        orderNumber: order.orderNumber,
        totalCheckpoints: allCheckpoints.length,
        passedCheckpoints: passed.length,
        failedCheckpoints: failed.length,
        overallYield,
        firstPassYield: avgFirstPassYield,
        defectSummary,
    };
}
/**
 * 35. Waives quality checkpoint with approval.
 *
 * @param {QualityCheckpoint} checkpoint - Quality checkpoint
 * @param {string} approver - Approver ID
 * @param {string} reason - Waiver reason
 * @returns {QualityCheckpoint} Waived checkpoint
 *
 * @example
 * ```typescript
 * const waived = waiveQualityCheckpoint(checkpoint, 'MGR-001', 'Minor cosmetic defect acceptable per customer');
 * ```
 */
function waiveQualityCheckpoint(checkpoint, approver, reason) {
    return {
        ...checkpoint,
        status: QualityCheckStatus.WAIVED,
        metadata: {
            ...checkpoint.metadata,
            waivedBy: approver,
            waivedAt: new Date(),
            waiverReason: reason,
        },
    };
}
// ============================================================================
// SECTION 5: COMPLETION & REPORTING (Functions 36-43)
// ============================================================================
/**
 * 36. Reports production quantity for work order.
 *
 * @param {WorkOrder} workOrder - Work order
 * @param {number} quantity - Quantity to report
 * @param {boolean} isGood - Is good quantity (vs. scrap)
 * @returns {WorkOrder} Updated work order
 *
 * @example
 * ```typescript
 * const updated = reportProductionQuantity(workOrder, 100, true);
 * ```
 */
function reportProductionQuantity(workOrder, quantity, isGood = true) {
    if (isGood) {
        return {
            ...workOrder,
            completedQuantity: workOrder.completedQuantity + quantity,
        };
    }
    else {
        return {
            ...workOrder,
            scrappedQuantity: workOrder.scrappedQuantity + quantity,
        };
    }
}
/**
 * 37. Calculates production order yield percentage.
 *
 * @param {ProductionOrder} order - Production order
 * @returns {number} Yield percentage
 *
 * @example
 * ```typescript
 * const yield = calculateYieldPercentage(productionOrder);
 * // Returns: 96.5 (for 96.5%)
 * ```
 */
function calculateYieldPercentage(order) {
    const totalProduced = order.completedQuantity + order.scrappedQuantity;
    if (totalProduced === 0) {
        return 0;
    }
    return (order.completedQuantity / totalProduced) * 100;
}
/**
 * 38. Calculates production efficiency vs. planned.
 *
 * @param {WorkOrder} workOrder - Work order
 * @param {number} standardHours - Standard hours for operation
 * @returns {number} Efficiency percentage
 *
 * @example
 * ```typescript
 * const efficiency = calculateProductionEfficiency(workOrder, 40);
 * // Returns: 125.5 (125.5% efficient - better than standard)
 * ```
 */
function calculateProductionEfficiency(workOrder, standardHours) {
    const laborSummary = calculateLaborHours(workOrder.laborEntries);
    const actualHours = laborSummary.runHours;
    if (actualHours === 0) {
        return 0;
    }
    return (standardHours / actualHours) * 100;
}
/**
 * 39. Generates production summary report.
 *
 * @param {ProductionOrder} order - Production order
 * @returns {object} Production summary
 *
 * @example
 * ```typescript
 * const summary = generateProductionSummary(productionOrder);
 * ```
 */
function generateProductionSummary(order) {
    const plannedDuration = order.plannedCompletionDate.getTime() - order.plannedStartDate.getTime();
    const actualDuration = order.actualCompletionDate && order.actualStartDate
        ? order.actualCompletionDate.getTime() - order.actualStartDate.getTime()
        : Date.now() - (order.actualStartDate?.getTime() || Date.now());
    const completedWorkOrders = order.workOrders.filter(wo => wo.status === WorkOrderStatus.COMPLETED).length;
    return {
        orderId: order.productionOrderId,
        orderNumber: order.orderNumber,
        itemCode: order.itemCode,
        status: order.status,
        plannedQuantity: order.plannedQuantity,
        completedQuantity: order.completedQuantity,
        scrappedQuantity: order.scrappedQuantity,
        yieldPercentage: calculateYieldPercentage(order),
        plannedDuration: plannedDuration / (1000 * 60 * 60), // hours
        actualDuration: actualDuration / (1000 * 60 * 60), // hours
        completionPercentage: (order.completedQuantity / order.plannedQuantity) * 100,
        workOrdersCompleted: completedWorkOrders,
        workOrdersTotal: order.workOrders.length,
    };
}
/**
 * 40. Generates production performance metrics.
 *
 * @param {ProductionOrder} order - Production order
 * @param {Record<string, number>} materialCosts - Material unit costs
 * @param {Record<string, number>} laborRates - Labor hourly rates
 * @returns {ProductionMetrics} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = generateProductionMetrics(order, materialCosts, laborRates);
 * ```
 */
function generateProductionMetrics(order, materialCosts, laborRates) {
    // Calculate material cost
    const allMaterialIssues = order.workOrders.flatMap(wo => wo.materialIssues);
    const totalMaterialCost = calculateMaterialCost(allMaterialIssues, materialCosts);
    // Calculate labor cost
    const allLaborEntries = order.workOrders.flatMap(wo => wo.laborEntries);
    const totalLaborHours = allLaborEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalLaborCost = allLaborEntries.reduce((sum, entry) => {
        const rate = laborRates[entry.operatorId] || 25.0; // Default rate
        const cost = (entry.duration || 0) * rate;
        return sum + cost;
    }, 0);
    // Calculate efficiency
    const plannedDuration = (order.plannedCompletionDate.getTime() - order.plannedStartDate.getTime()) / (1000 * 60 * 60);
    const actualDuration = order.actualCompletionDate && order.actualStartDate
        ? (order.actualCompletionDate.getTime() - order.actualStartDate.getTime()) / (1000 * 60 * 60)
        : 0;
    const efficiency = actualDuration > 0 ? (plannedDuration / actualDuration) * 100 : 0;
    // Calculate yields
    const yieldPercentage = calculateYieldPercentage(order);
    const avgFirstPassYield = order.workOrders.length > 0
        ? order.workOrders.reduce((sum, wo) => sum + calculateFirstPassYield(wo), 0) / order.workOrders.length
        : 0;
    // Calculate unit cost
    const totalCost = totalMaterialCost + totalLaborCost;
    const unitCost = order.completedQuantity > 0 ? totalCost / order.completedQuantity : 0;
    return {
        productionOrderId: order.productionOrderId,
        plannedQuantity: order.plannedQuantity,
        completedQuantity: order.completedQuantity,
        scrappedQuantity: order.scrappedQuantity,
        yieldPercentage,
        firstPassYield: avgFirstPassYield,
        plannedDuration,
        actualDuration,
        efficiencyPercentage: efficiency,
        totalLaborHours,
        totalLaborCost,
        totalMaterialCost,
        unitCost,
    };
}
/**
 * 41. Searches production orders by criteria with Sequelize.
 *
 * @param {ProductionOrder[]} orders - All production orders
 * @param {ProductionOrderSearchCriteria} criteria - Search criteria
 * @returns {ProductionOrder[]} Matching orders
 *
 * @example
 * ```typescript
 * // With Sequelize query
 * const orders = await ProductionOrderModel.findAll({
 *   where: {
 *     facilityId: 'FAC-001',
 *     status: [ProductionOrderStatus.IN_PROGRESS, ProductionOrderStatus.RELEASED]
 *   },
 *   include: [
 *     { model: WorkOrderModel, as: 'workOrders', include: ['laborEntries', 'materialIssues'] },
 *     { model: ItemModel, as: 'item' },
 *     { model: FacilityModel, as: 'facility' }
 *   ]
 * });
 * ```
 */
function searchProductionOrders(orders, criteria) {
    return orders.filter(order => {
        if (criteria.facilityId && order.facilityId !== criteria.facilityId)
            return false;
        if (criteria.status && !criteria.status.includes(order.status))
            return false;
        if (criteria.priority && !criteria.priority.includes(order.priority))
            return false;
        if (criteria.itemCode && order.itemCode !== criteria.itemCode)
            return false;
        if (criteria.salesOrderId && order.salesOrderId !== criteria.salesOrderId)
            return false;
        if (criteria.customerId && order.customerId !== criteria.customerId)
            return false;
        if (criteria.plannedStartFrom && order.plannedStartDate < criteria.plannedStartFrom)
            return false;
        if (criteria.plannedStartTo && order.plannedStartDate > criteria.plannedStartTo)
            return false;
        if (criteria.orderNumber && order.orderNumber !== criteria.orderNumber)
            return false;
        return true;
    });
}
/**
 * 42. Exports production order data to CSV.
 *
 * @param {ProductionOrder[]} orders - Production orders to export
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportProductionOrdersToCSV(orders);
 * fs.writeFileSync('production-orders.csv', csv);
 * ```
 */
function exportProductionOrdersToCSV(orders) {
    const headers = [
        'Order Number',
        'Item Code',
        'Item Description',
        'Status',
        'Priority',
        'Planned Qty',
        'Completed Qty',
        'Scrapped Qty',
        'Yield %',
        'Planned Start',
        'Planned Completion',
        'Actual Start',
        'Actual Completion',
        'Facility ID',
    ];
    let csv = headers.join(',') + '\n';
    for (const order of orders) {
        const row = [
            order.orderNumber,
            order.itemCode,
            `"${order.itemDescription}"`,
            order.status,
            order.priority,
            order.plannedQuantity,
            order.completedQuantity,
            order.scrappedQuantity,
            calculateYieldPercentage(order).toFixed(2),
            order.plannedStartDate.toISOString(),
            order.plannedCompletionDate.toISOString(),
            order.actualStartDate?.toISOString() || '',
            order.actualCompletionDate?.toISOString() || '',
            order.facilityId,
        ];
        csv += row.join(',') + '\n';
    }
    return csv;
}
/**
 * 43. Validates production order completion with Sequelize nested includes.
 *
 * @param {ProductionOrder} order - Production order to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * // With Sequelize deep nesting
 * const order = await ProductionOrderModel.findByPk(orderId, {
 *   include: [
 *     {
 *       model: WorkOrderModel,
 *       as: 'workOrders',
 *       include: [
 *         { model: MaterialIssueModel, as: 'materialIssues' },
 *         { model: LaborEntryModel, as: 'laborEntries' },
 *         {
 *           model: QualityCheckpointModel,
 *           as: 'qualityCheckpoints',
 *           include: [{ model: DefectModel, as: 'defects' }]
 *         }
 *       ]
 *     }
 *   ]
 * });
 * const validation = validateProductionOrderCompletion(order);
 * ```
 */
function validateProductionOrderCompletion(order) {
    const issues = [];
    const warnings = [];
    // Check status
    if (order.status !== ProductionOrderStatus.IN_PROGRESS) {
        issues.push(`Order must be in IN_PROGRESS status (current: ${order.status})`);
    }
    // Check work orders
    const incompleteWorkOrders = order.workOrders.filter(wo => wo.status !== WorkOrderStatus.COMPLETED && wo.status !== WorkOrderStatus.SKIPPED);
    if (incompleteWorkOrders.length > 0) {
        issues.push(`${incompleteWorkOrders.length} work order(s) not completed`);
    }
    // Check quality checkpoints
    for (const workOrder of order.workOrders) {
        const validation = validateQualityCheckpoints(workOrder);
        if (!validation.allPassed) {
            issues.push(`Work order ${workOrder.workOrderNumber} has failed quality checkpoints`);
        }
    }
    // Check quantity
    if (order.completedQuantity === 0) {
        issues.push('No completed quantity reported');
    }
    if (order.completedQuantity < order.plannedQuantity * 0.9) {
        warnings.push(`Completed quantity (${order.completedQuantity}) is less than 90% of planned (${order.plannedQuantity})`);
    }
    // Check yield
    const yield_ = calculateYieldPercentage(order);
    if (yield_ < 85) {
        warnings.push(`Low yield percentage: ${yield_.toFixed(2)}%`);
    }
    return {
        canComplete: issues.length === 0,
        issues,
        warnings,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique production order ID.
 */
function generateProductionOrderId() {
    return `PO-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates production order number.
 */
function generateOrderNumber(facilityId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-6);
    const facilityCode = facilityId.replace(/[^A-Z0-9]/g, '');
    return `${facilityCode}-${dateStr}-${timeStr}`;
}
/**
 * Helper: Generates work order ID.
 */
function generateWorkOrderId() {
    return `WO-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates work order number.
 */
function generateWorkOrderNumber(orderNumber, operationNumber) {
    return `${orderNumber}-OP${String(operationNumber).padStart(3, '0')}`;
}
/**
 * Helper: Generates material issue ID.
 */
function generateMaterialIssueId() {
    return `MI-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates labor entry ID.
 */
function generateLaborEntryId() {
    return `LE-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates quality checkpoint ID.
 */
function generateCheckpointId() {
    return `QC-${crypto.randomUUID()}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Order Creation & Management
    createProductionOrder,
    releaseProductionOrder,
    startProductionOrder,
    holdProductionOrder,
    resumeProductionOrder,
    completeProductionOrder,
    closeProductionOrder,
    cancelProductionOrder,
    updateProductionOrderQuantity,
    // Material Issue & Tracking
    createMaterialIssues,
    issueMaterial,
    returnMaterial,
    scrapMaterial,
    checkMaterialAvailability,
    backflushMaterials,
    generateMaterialShortageReport,
    allocateMaterials,
    calculateMaterialCost,
    // Labor & Resource Tracking
    createWorkOrders,
    startWorkOrder,
    clockInLabor,
    clockOutLabor,
    pauseWorkOrder,
    resumeWorkOrder,
    completeWorkOrder,
    calculateLaborHours,
    calculateLaborCost,
    // Quality Control Integration
    createQualityCheckpoints,
    recordQualityCheck,
    recordSampleInspection,
    recordDefects,
    validateQualityCheckpoints,
    calculateFirstPassYield,
    generateQualityReport,
    waiveQualityCheckpoint,
    // Completion & Reporting
    reportProductionQuantity,
    calculateYieldPercentage,
    calculateProductionEfficiency,
    generateProductionSummary,
    generateProductionMetrics,
    searchProductionOrders,
    exportProductionOrdersToCSV,
    validateProductionOrderCompletion,
};
//# sourceMappingURL=production-order-execution-kit.js.map