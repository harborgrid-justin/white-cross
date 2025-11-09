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
/**
 * Production order status enumeration
 */
export declare enum ProductionOrderStatus {
    DRAFT = "DRAFT",
    RELEASED = "RELEASED",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CLOSED = "CLOSED",
    CANCELLED = "CANCELLED"
}
/**
 * Work order status enumeration
 */
export declare enum WorkOrderStatus {
    PENDING = "PENDING",
    READY = "READY",
    IN_PROGRESS = "IN_PROGRESS",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED"
}
/**
 * Material issue status
 */
export declare enum MaterialIssueStatus {
    PLANNED = "PLANNED",
    ISSUED = "ISSUED",
    PARTIALLY_ISSUED = "PARTIALLY_ISSUED",
    RETURNED = "RETURNED",
    SCRAPPED = "SCRAPPED"
}
/**
 * Quality checkpoint status
 */
export declare enum QualityCheckStatus {
    PENDING = "PENDING",
    PASSED = "PASSED",
    FAILED = "FAILED",
    CONDITIONAL = "CONDITIONAL",
    WAIVED = "WAIVED"
}
/**
 * Labor entry type
 */
export declare enum LaborEntryType {
    SETUP = "SETUP",
    RUN = "RUN",
    INSPECTION = "INSPECTION",
    REWORK = "REWORK",
    MAINTENANCE = "MAINTENANCE",
    DOWNTIME = "DOWNTIME"
}
/**
 * Production order priority
 */
export declare enum ProductionPriority {
    LOW = 1,
    NORMAL = 5,
    HIGH = 8,
    URGENT = 10,
    CRITICAL = 15
}
/**
 * Bill of materials line item
 */
export interface BOMLineItem {
    bomLineId: string;
    itemId: string;
    itemCode: string;
    itemDescription: string;
    quantity: number;
    unitOfMeasure: string;
    scrapFactor: number;
    isPhantom: boolean;
    backflushFlag: boolean;
    issueLocation?: string;
    substituteItems?: string[];
    metadata?: Record<string, any>;
}
/**
 * Routing operation
 */
export interface RoutingOperation {
    operationId: string;
    operationNumber: number;
    operationCode: string;
    operationDescription: string;
    workCenterId: string;
    workCenterName: string;
    setupTime: number;
    runTimePerUnit: number;
    queueTime: number;
    moveTime: number;
    requiredSkills?: string[];
    simultaneousOperations?: string[];
    qualityCheckpoints?: QualityCheckpointDefinition[];
    metadata?: Record<string, any>;
}
/**
 * Quality checkpoint definition
 */
export interface QualityCheckpointDefinition {
    checkpointId: string;
    checkpointName: string;
    inspectionType: 'FIRST_ARTICLE' | 'IN_PROCESS' | 'FINAL' | 'SAMPLING';
    frequency: number;
    requiredInspectors?: string[];
    inspectionProcedure?: string;
    specifications: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Complete production order
 */
export interface ProductionOrder {
    productionOrderId: string;
    orderNumber: string;
    itemId: string;
    itemCode: string;
    itemDescription: string;
    plannedQuantity: number;
    completedQuantity: number;
    scrappedQuantity: number;
    unitOfMeasure: string;
    status: ProductionOrderStatus;
    priority: ProductionPriority;
    facilityId: string;
    plannedStartDate: Date;
    plannedCompletionDate: Date;
    actualStartDate?: Date;
    actualCompletionDate?: Date;
    salesOrderId?: string;
    customerId?: string;
    bom: BOMLineItem[];
    routing: RoutingOperation[];
    workOrders: WorkOrder[];
    lotNumber?: string;
    serialNumbers?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Work order (operation execution)
 */
export interface WorkOrder {
    workOrderId: string;
    workOrderNumber: string;
    productionOrderId: string;
    operationId: string;
    operationNumber: number;
    operationDescription: string;
    workCenterId: string;
    status: WorkOrderStatus;
    plannedQuantity: number;
    completedQuantity: number;
    scrappedQuantity: number;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    assignedOperators?: string[];
    materialIssues: MaterialIssue[];
    laborEntries: LaborEntry[];
    qualityCheckpoints: QualityCheckpoint[];
    metadata?: Record<string, any>;
}
/**
 * Material issue transaction
 */
export interface MaterialIssue {
    materialIssueId: string;
    workOrderId: string;
    productionOrderId: string;
    itemId: string;
    itemCode: string;
    plannedQuantity: number;
    issuedQuantity: number;
    returnedQuantity: number;
    scrappedQuantity: number;
    unitOfMeasure: string;
    status: MaterialIssueStatus;
    lotNumber?: string;
    serialNumber?: string;
    warehouseLocation: string;
    issuedBy?: string;
    issuedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Labor time entry
 */
export interface LaborEntry {
    laborEntryId: string;
    workOrderId: string;
    productionOrderId: string;
    operatorId: string;
    operatorName: string;
    entryType: LaborEntryType;
    clockInTime: Date;
    clockOutTime?: Date;
    duration?: number;
    quantityProduced?: number;
    quantityScrapped?: number;
    hourlyRate?: number;
    laborCost?: number;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Quality checkpoint result
 */
export interface QualityCheckpoint {
    checkpointId: string;
    workOrderId: string;
    productionOrderId: string;
    checkpointName: string;
    inspectionType: string;
    status: QualityCheckStatus;
    inspectedBy?: string;
    inspectedAt?: Date;
    sampleSize?: number;
    acceptedQuantity?: number;
    rejectedQuantity?: number;
    measurements: Record<string, any>;
    defectCodes?: string[];
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Production order configuration
 */
export interface ProductionOrderConfig {
    facilityId: string;
    itemId: string;
    itemCode: string;
    quantity: number;
    unitOfMeasure: string;
    priority: ProductionPriority;
    plannedStartDate: Date;
    plannedCompletionDate: Date;
    salesOrderId?: string;
    customerId?: string;
    lotNumber?: string;
    useBackflushing?: boolean;
}
/**
 * Work order scheduling parameters
 */
export interface WorkOrderScheduleParams {
    productionOrderId: string;
    workCenterId?: string;
    startDate?: Date;
    finiteCapacity?: boolean;
    considerConstraints?: boolean;
}
/**
 * Material availability result
 */
export interface MaterialAvailability {
    itemId: string;
    itemCode: string;
    requiredQuantity: number;
    availableQuantity: number;
    shortageQuantity: number;
    availableDate?: Date;
    warehouseLocation?: string;
    isAvailable: boolean;
}
/**
 * Production order search criteria
 */
export interface ProductionOrderSearchCriteria {
    facilityId?: string;
    status?: ProductionOrderStatus[];
    priority?: ProductionPriority[];
    itemCode?: string;
    salesOrderId?: string;
    customerId?: string;
    plannedStartFrom?: Date;
    plannedStartTo?: Date;
    orderNumber?: string;
}
/**
 * Production performance metrics
 */
export interface ProductionMetrics {
    productionOrderId: string;
    plannedQuantity: number;
    completedQuantity: number;
    scrappedQuantity: number;
    yieldPercentage: number;
    firstPassYield: number;
    plannedDuration: number;
    actualDuration: number;
    efficiencyPercentage: number;
    totalLaborHours: number;
    totalLaborCost: number;
    totalMaterialCost: number;
    unitCost: number;
}
/**
 * Sequelize association examples for production orders
 */
export interface SequelizeProductionOrderModel {
    workOrders?: any[];
    getWorkOrders?: () => Promise<any[]>;
    addWorkOrder?: (workOrder: any) => Promise<void>;
    materialIssues?: any[];
    getMaterialIssues?: () => Promise<any[]>;
    qualityCheckpoints?: any[];
    getQualityCheckpoints?: () => Promise<any[]>;
    facility?: any;
    getFacility?: () => Promise<any>;
    item?: any;
    getItem?: () => Promise<any>;
    salesOrder?: any;
    getSalesOrder?: () => Promise<any>;
}
/**
 * Sequelize association examples for work orders
 */
export interface SequelizeWorkOrderModel {
    productionOrder?: any;
    getProductionOrder?: () => Promise<any>;
    workCenter?: any;
    getWorkCenter?: () => Promise<any>;
    laborEntries?: any[];
    getLaborEntries?: () => Promise<any[]>;
    addLaborEntry?: (entry: any) => Promise<void>;
    materialIssues?: any[];
    getMaterialIssues?: () => Promise<any[]>;
    qualityCheckpoints?: any[];
    getQualityCheckpoints?: () => Promise<any[]>;
    operators?: any[];
    getOperators?: () => Promise<any[]>;
    addOperator?: (operator: any) => Promise<void>;
    removeOperator?: (operator: any) => Promise<void>;
}
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
export declare function createProductionOrder(config: ProductionOrderConfig, bom: BOMLineItem[], routing: RoutingOperation[]): ProductionOrder;
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
export declare function releaseProductionOrder(order: ProductionOrder): ProductionOrder;
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
export declare function startProductionOrder(order: ProductionOrder): ProductionOrder;
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
export declare function holdProductionOrder(order: ProductionOrder, reason: string): ProductionOrder;
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
export declare function resumeProductionOrder(order: ProductionOrder): ProductionOrder;
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
export declare function completeProductionOrder(order: ProductionOrder): ProductionOrder;
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
export declare function closeProductionOrder(order: ProductionOrder): ProductionOrder;
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
export declare function cancelProductionOrder(order: ProductionOrder, reason: string): ProductionOrder;
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
export declare function updateProductionOrderQuantity(order: ProductionOrder, newQuantity: number): ProductionOrder;
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
export declare function createMaterialIssues(order: ProductionOrder, workOrder: WorkOrder): MaterialIssue[];
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
export declare function issueMaterial(issue: MaterialIssue, quantity: number, issuedBy: string): MaterialIssue;
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
export declare function returnMaterial(issue: MaterialIssue, quantity: number): MaterialIssue;
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
export declare function scrapMaterial(issue: MaterialIssue, quantity: number, reason: string): MaterialIssue;
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
export declare function checkMaterialAvailability(order: ProductionOrder): MaterialAvailability[];
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
export declare function backflushMaterials(workOrder: WorkOrder, order: ProductionOrder): MaterialIssue[];
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
export declare function generateMaterialShortageReport(order: ProductionOrder): {
    orderId: string;
    orderNumber: string;
    shortages: MaterialAvailability[];
    totalShortageItems: number;
    canProceed: boolean;
};
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
export declare function allocateMaterials(order: ProductionOrder, warehouseLocation: string): MaterialIssue[];
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
export declare function calculateMaterialCost(issues: MaterialIssue[], unitCosts: Record<string, number>): number;
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
export declare function createWorkOrders(order: ProductionOrder): WorkOrder[];
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
export declare function startWorkOrder(workOrder: WorkOrder, operatorIds: string[]): WorkOrder;
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
export declare function clockInLabor(workOrder: WorkOrder, operatorId: string, entryType: LaborEntryType): LaborEntry;
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
export declare function clockOutLabor(entry: LaborEntry, quantityProduced: number, quantityScrapped?: number): LaborEntry;
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
export declare function pauseWorkOrder(workOrder: WorkOrder, reason: string): WorkOrder;
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
export declare function resumeWorkOrder(workOrder: WorkOrder): WorkOrder;
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
export declare function completeWorkOrder(workOrder: WorkOrder, completedQuantity: number, scrappedQuantity?: number): WorkOrder;
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
export declare function calculateLaborHours(entries: LaborEntry[]): {
    totalHours: number;
    setupHours: number;
    runHours: number;
    inspectionHours: number;
    reworkHours: number;
    downtime: number;
};
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
export declare function calculateLaborCost(entries: LaborEntry[]): number;
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
export declare function createQualityCheckpoints(workOrder: WorkOrder, operation: RoutingOperation): QualityCheckpoint[];
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
export declare function recordQualityCheck(checkpoint: QualityCheckpoint, status: QualityCheckStatus, measurements: Record<string, any>, inspectorId: string): QualityCheckpoint;
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
export declare function recordSampleInspection(checkpoint: QualityCheckpoint, sampleSize: number, acceptedQuantity: number, rejectedQuantity: number): QualityCheckpoint;
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
export declare function recordDefects(checkpoint: QualityCheckpoint, defectCodes: string[], notes?: string): QualityCheckpoint;
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
export declare function validateQualityCheckpoints(workOrder: WorkOrder): {
    allPassed: boolean;
    totalCheckpoints: number;
    passedCheckpoints: number;
    failedCheckpoints: QualityCheckpoint[];
    pendingCheckpoints: QualityCheckpoint[];
};
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
export declare function calculateFirstPassYield(workOrder: WorkOrder): number;
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
export declare function generateQualityReport(order: ProductionOrder): {
    orderId: string;
    orderNumber: string;
    totalCheckpoints: number;
    passedCheckpoints: number;
    failedCheckpoints: number;
    overallYield: number;
    firstPassYield: number;
    defectSummary: Record<string, number>;
};
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
export declare function waiveQualityCheckpoint(checkpoint: QualityCheckpoint, approver: string, reason: string): QualityCheckpoint;
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
export declare function reportProductionQuantity(workOrder: WorkOrder, quantity: number, isGood?: boolean): WorkOrder;
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
export declare function calculateYieldPercentage(order: ProductionOrder): number;
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
export declare function calculateProductionEfficiency(workOrder: WorkOrder, standardHours: number): number;
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
export declare function generateProductionSummary(order: ProductionOrder): {
    orderId: string;
    orderNumber: string;
    itemCode: string;
    status: ProductionOrderStatus;
    plannedQuantity: number;
    completedQuantity: number;
    scrappedQuantity: number;
    yieldPercentage: number;
    plannedDuration: number;
    actualDuration: number;
    completionPercentage: number;
    workOrdersCompleted: number;
    workOrdersTotal: number;
};
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
export declare function generateProductionMetrics(order: ProductionOrder, materialCosts: Record<string, number>, laborRates: Record<string, number>): ProductionMetrics;
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
export declare function searchProductionOrders(orders: ProductionOrder[], criteria: ProductionOrderSearchCriteria): ProductionOrder[];
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
export declare function exportProductionOrdersToCSV(orders: ProductionOrder[]): string;
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
export declare function validateProductionOrderCompletion(order: ProductionOrder): {
    canComplete: boolean;
    issues: string[];
    warnings: string[];
};
/**
 * Helper: Generates unique production order ID.
 */
export declare function generateProductionOrderId(): string;
/**
 * Helper: Generates production order number.
 */
export declare function generateOrderNumber(facilityId: string): string;
/**
 * Helper: Generates work order ID.
 */
export declare function generateWorkOrderId(): string;
/**
 * Helper: Generates work order number.
 */
export declare function generateWorkOrderNumber(orderNumber: string, operationNumber: number): string;
/**
 * Helper: Generates material issue ID.
 */
export declare function generateMaterialIssueId(): string;
/**
 * Helper: Generates labor entry ID.
 */
export declare function generateLaborEntryId(): string;
/**
 * Helper: Generates quality checkpoint ID.
 */
export declare function generateCheckpointId(): string;
declare const _default: {
    createProductionOrder: typeof createProductionOrder;
    releaseProductionOrder: typeof releaseProductionOrder;
    startProductionOrder: typeof startProductionOrder;
    holdProductionOrder: typeof holdProductionOrder;
    resumeProductionOrder: typeof resumeProductionOrder;
    completeProductionOrder: typeof completeProductionOrder;
    closeProductionOrder: typeof closeProductionOrder;
    cancelProductionOrder: typeof cancelProductionOrder;
    updateProductionOrderQuantity: typeof updateProductionOrderQuantity;
    createMaterialIssues: typeof createMaterialIssues;
    issueMaterial: typeof issueMaterial;
    returnMaterial: typeof returnMaterial;
    scrapMaterial: typeof scrapMaterial;
    checkMaterialAvailability: typeof checkMaterialAvailability;
    backflushMaterials: typeof backflushMaterials;
    generateMaterialShortageReport: typeof generateMaterialShortageReport;
    allocateMaterials: typeof allocateMaterials;
    calculateMaterialCost: typeof calculateMaterialCost;
    createWorkOrders: typeof createWorkOrders;
    startWorkOrder: typeof startWorkOrder;
    clockInLabor: typeof clockInLabor;
    clockOutLabor: typeof clockOutLabor;
    pauseWorkOrder: typeof pauseWorkOrder;
    resumeWorkOrder: typeof resumeWorkOrder;
    completeWorkOrder: typeof completeWorkOrder;
    calculateLaborHours: typeof calculateLaborHours;
    calculateLaborCost: typeof calculateLaborCost;
    createQualityCheckpoints: typeof createQualityCheckpoints;
    recordQualityCheck: typeof recordQualityCheck;
    recordSampleInspection: typeof recordSampleInspection;
    recordDefects: typeof recordDefects;
    validateQualityCheckpoints: typeof validateQualityCheckpoints;
    calculateFirstPassYield: typeof calculateFirstPassYield;
    generateQualityReport: typeof generateQualityReport;
    waiveQualityCheckpoint: typeof waiveQualityCheckpoint;
    reportProductionQuantity: typeof reportProductionQuantity;
    calculateYieldPercentage: typeof calculateYieldPercentage;
    calculateProductionEfficiency: typeof calculateProductionEfficiency;
    generateProductionSummary: typeof generateProductionSummary;
    generateProductionMetrics: typeof generateProductionMetrics;
    searchProductionOrders: typeof searchProductionOrders;
    exportProductionOrdersToCSV: typeof exportProductionOrdersToCSV;
    validateProductionOrderCompletion: typeof validateProductionOrderCompletion;
};
export default _default;
//# sourceMappingURL=production-order-execution-kit.d.ts.map