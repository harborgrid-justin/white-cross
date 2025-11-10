/**
 * LOC: WC-ORD-WHSFUL-001
 * File: /reuse/order/warehouse-fulfillment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Order fulfillment services
 *   - Warehouse management systems
 *   - Inventory management services
 *   - Shipping integration services
 */
import { Model } from 'sequelize-typescript';
import { Sequelize } from 'sequelize';
/**
 * Picking strategy types
 */
export declare enum PickingStrategy {
    SINGLE_ORDER = "SINGLE_ORDER",
    BATCH_PICK = "BATCH_PICK",
    ZONE_PICK = "ZONE_PICK",
    CLUSTER_PICK = "CLUSTER_PICK",
    WAVE_PICK = "WAVE_PICK"
}
/**
 * Pick task status
 */
export declare enum PickTaskStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    PICKED = "PICKED",
    SHORT_PICKED = "SHORT_PICKED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
/**
 * Wave status
 */
export declare enum WaveStatus {
    PLANNED = "PLANNED",
    RELEASED = "RELEASED",
    IN_PROGRESS = "IN_PROGRESS",
    PICKING_COMPLETE = "PICKING_COMPLETE",
    PACKING_COMPLETE = "PACKING_COMPLETE",
    SHIPPED = "SHIPPED",
    CANCELLED = "CANCELLED"
}
/**
 * Packing status
 */
export declare enum PackingStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    PACKED = "PACKED",
    MANIFESTED = "MANIFESTED",
    SHIPPED = "SHIPPED",
    CANCELLED = "CANCELLED"
}
/**
 * Quality check status
 */
export declare enum QualityCheckStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    PASSED = "PASSED",
    FAILED = "FAILED",
    CONDITIONAL_PASS = "CONDITIONAL_PASS"
}
/**
 * Shipment status
 */
export declare enum ShipmentStatus {
    PENDING = "PENDING",
    LABEL_CREATED = "LABEL_CREATED",
    MANIFESTED = "MANIFESTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    EXCEPTION = "EXCEPTION",
    RETURNED = "RETURNED"
}
/**
 * Cartonization strategy
 */
export declare enum CartonizationStrategy {
    MINIMIZE_BOXES = "MINIMIZE_BOXES",
    MINIMIZE_COST = "MINIMIZE_COST",
    OPTIMIZE_WEIGHT = "OPTIMIZE_WEIGHT",
    FRAGILE_FIRST = "FRAGILE_FIRST",
    TEMPERATURE_CONTROLLED = "TEMPERATURE_CONTROLLED"
}
/**
 * Zone type
 */
export declare enum ZoneType {
    FAST_PICK = "FAST_PICK",
    RESERVE = "RESERVE",
    BULK = "BULK",
    REFRIGERATED = "REFRIGERATED",
    CONTROLLED_SUBSTANCE = "CONTROLLED_SUBSTANCE",
    HAZMAT = "HAZMAT"
}
export interface WaveConfiguration {
    maxOrders: number;
    maxItems: number;
    maxWeight: number;
    maxVolume: number;
    pickingStrategy: PickingStrategy;
    priorityThreshold: number;
    autoRelease: boolean;
    releaseTime?: Date;
}
export interface PickListItem {
    itemId: string;
    itemNumber: string;
    itemDescription: string;
    location: string;
    quantity: number;
    unitOfMeasure: string;
    lotNumber?: string;
    serialNumber?: string;
    expirationDate?: Date;
}
export interface CartonSpecification {
    cartonId: string;
    length: number;
    width: number;
    height: number;
    maxWeight: number;
    tareWeight: number;
    isDefault: boolean;
}
export interface PackingResult {
    cartons: PackedCarton[];
    totalWeight: number;
    totalCartons: number;
    packingEfficiency: number;
}
export interface PackedCarton {
    cartonId: string;
    cartonSpec: CartonSpecification;
    items: PickListItem[];
    weight: number;
    trackingNumber?: string;
}
export interface QualityCheckRule {
    ruleId: string;
    ruleName: string;
    checkType: 'ITEM_VERIFICATION' | 'QUANTITY_CHECK' | 'EXPIRATION_CHECK' | 'LOT_TRACE' | 'TEMPERATURE';
    isMandatory: boolean;
    threshold?: number;
}
export interface PerformanceMetrics {
    pickerId: string;
    pickerName: string;
    totalPicks: number;
    totalUnits: number;
    picksPerHour: number;
    unitsPerHour: number;
    accuracy: number;
    averagePickTime: number;
    periodStart: Date;
    periodEnd: Date;
}
/**
 * Warehouse model
 */
export declare class Warehouse extends Model {
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    addressLine1: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    isActive: boolean;
    waves: WavePick[];
    zones: WarehouseZone[];
    pickTasks: PickTask[];
}
/**
 * Warehouse zone model
 */
export declare class WarehouseZone extends Model {
    zoneId: string;
    warehouseId: string;
    zoneCode: string;
    zoneName: string;
    zoneType: ZoneType;
    priority: number;
    isActive: boolean;
    warehouse: Warehouse;
    pickTasks: PickTask[];
}
/**
 * Wave pick model
 */
export declare class WavePick extends Model {
    waveId: string;
    waveNumber: string;
    warehouseId: string;
    status: WaveStatus;
    pickingStrategy: PickingStrategy;
    totalOrders: number;
    totalItems: number;
    totalWeight: number;
    plannedReleaseTime: Date;
    actualReleaseTime: Date;
    pickingStartTime: Date;
    pickingCompleteTime: Date;
    createdBy: string;
    releasedBy: string;
    warehouse: Warehouse;
    pickLists: PickList[];
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Wave order junction table
 */
export declare class WaveOrder extends Model {
    waveId: string;
    orderId: string;
    sequenceNumber: number;
    addedToWaveAt: Date;
    wave: WavePick;
    order: Order;
}
/**
 * Order model (simplified for fulfillment context)
 */
export declare class Order extends Model {
    orderId: string;
    orderNumber: string;
    customerId: string;
    status: string;
    priority: number;
    orderDate: Date;
    requestedDeliveryDate: Date;
    orderLines: OrderLine[];
    waves: WavePick[];
    shipments: Shipment[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Order line model
 */
export declare class OrderLine extends Model {
    orderLineId: string;
    orderId: string;
    lineNumber: number;
    itemId: string;
    itemNumber: string;
    itemDescription: string;
    quantityOrdered: number;
    quantityPicked: number;
    quantityPacked: number;
    quantityShipped: number;
    unitOfMeasure: string;
    location: string;
    order: Order;
    pickTasks: PickTask[];
}
/**
 * Pick list model
 */
export declare class PickList extends Model {
    pickListId: string;
    pickListNumber: string;
    waveId: string;
    warehouseId: string;
    pickingStrategy: PickingStrategy;
    status: PickTaskStatus;
    assignedTo: string;
    assignedToName: string;
    assignedAt: Date;
    startedAt: Date;
    completedAt: Date;
    totalTasks: number;
    completedTasks: number;
    completionPercent: number;
    wave: WavePick;
    warehouse: Warehouse;
    pickTasks: PickTask[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Pick task model
 */
export declare class PickTask extends Model {
    pickTaskId: string;
    pickListId: string;
    orderLineId: string;
    warehouseId: string;
    zoneId: string;
    sequenceNumber: number;
    itemId: string;
    itemNumber: string;
    itemDescription: string;
    location: string;
    quantityToPick: number;
    quantityPicked: number;
    quantityShort: number;
    unitOfMeasure: string;
    lotNumber: string;
    serialNumber: string;
    expirationDate: Date;
    status: PickTaskStatus;
    pickedAt: Date;
    pickedBy: string;
    notes: string;
    pickList: PickList;
    orderLine: OrderLine;
    warehouse: Warehouse;
    zone: WarehouseZone;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Carton model
 */
export declare class Carton extends Model {
    cartonId: string;
    shipmentId: string;
    cartonNumber: string;
    cartonType: string;
    length: number;
    width: number;
    height: number;
    weight: number;
    tareWeight: number;
    trackingNumber: string;
    status: PackingStatus;
    packedBy: string;
    packedAt: Date;
    shipment: Shipment;
    contents: CartonContent[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Carton content model
 */
export declare class CartonContent extends Model {
    cartonContentId: string;
    cartonId: string;
    pickTaskId: string;
    itemId: string;
    itemNumber: string;
    quantity: number;
    lotNumber: string;
    serialNumber: string;
    carton: Carton;
    pickTask: PickTask;
}
/**
 * Shipment model
 */
export declare class Shipment extends Model {
    shipmentId: string;
    shipmentNumber: string;
    orderId: string;
    warehouseId: string;
    trackingNumber: string;
    carrier: string;
    serviceLevel: string;
    status: ShipmentStatus;
    totalWeight: number;
    totalCartons: number;
    shippingCost: number;
    shipDate: Date;
    estimatedDeliveryDate: Date;
    actualDeliveryDate: Date;
    shippedBy: string;
    shippingLabel: string;
    packingSlip: string;
    order: Order;
    cartons: Carton[];
    qualityChecks: QualityCheck[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Quality check model
 */
export declare class QualityCheck extends Model {
    qualityCheckId: string;
    shipmentId: string;
    pickTaskId: string;
    checkType: string;
    status: QualityCheckStatus;
    isMandatory: boolean;
    performedBy: string;
    performedAt: Date;
    findings: string;
    notes: string;
    shipment: Shipment;
    pickTask: PickTask;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Picker performance model
 */
export declare class PickerPerformance extends Model {
    performanceId: string;
    pickerId: string;
    pickerName: string;
    performanceDate: Date;
    totalPicks: number;
    totalUnits: number;
    totalHours: number;
    picksPerHour: number;
    unitsPerHour: number;
    accuracyPercent: number;
    errorCount: number;
    averagePickTime: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * 1. Plans a new wave based on pending orders and configuration
 */
export declare function planWave(warehouseId: string, config: WaveConfiguration, sequelize: Sequelize): Promise<WavePick>;
/**
 * 2. Releases a planned wave for picking
 */
export declare function releaseWave(waveId: string, releasedBy: string, sequelize: Sequelize): Promise<WavePick>;
/**
 * 3. Optimizes wave for picking efficiency
 */
export declare function optimizeWaveRouting(waveId: string, sequelize: Sequelize): Promise<{
    optimizedRoute: string[];
    estimatedTime: number;
}>;
/**
 * 4. Retrieves active waves for a warehouse
 */
export declare function getActiveWaves(warehouseId: string): Promise<WavePick[]>;
/**
 * 5. Cancels a wave before completion
 */
export declare function cancelWave(waveId: string, reason: string, sequelize: Sequelize): Promise<WavePick>;
/**
 * 6. Calculates wave capacity utilization
 */
export declare function calculateWaveCapacity(waveId: string, maxCapacity: WaveConfiguration): Promise<{
    utilizationPercent: number;
    canAddOrders: boolean;
    remainingCapacity: any;
}>;
/**
 * 7. Generates pick lists for a wave based on strategy
 */
export declare function generatePickLists(waveId: string, strategy: PickingStrategy, sequelize: Sequelize): Promise<PickList[]>;
/**
 * 11. Assigns pick list to picker
 */
export declare function assignPickList(pickListId: string, pickerId: string, pickerName: string, sequelize: Sequelize): Promise<PickList>;
/**
 * 12. Retrieves pick list with tasks
 */
export declare function getPickListWithTasks(pickListId: string): Promise<PickList>;
/**
 * 13. Starts picking a pick list
 */
export declare function startPicking(pickListId: string, pickerId: string, sequelize: Sequelize): Promise<PickList>;
/**
 * 14. Confirms a pick task
 */
export declare function confirmPick(pickTaskId: string, quantityPicked: number, pickerId: string, lotNumber?: string, serialNumber?: string, sequelize?: Sequelize): Promise<PickTask>;
/**
 * 15. Handles short pick scenarios
 */
export declare function handleShortPick(pickTaskId: string, quantityShort: number, reason: string, sequelize: Sequelize): Promise<PickTask>;
/**
 * 16. Completes a pick list
 */
export declare function completePickList(pickListId: string, sequelize: Sequelize): Promise<PickList>;
/**
 * 17. Retrieves pick tasks by location for cluster picking
 */
export declare function getPickTasksByLocation(warehouseId: string, locations: string[]): Promise<PickTask[]>;
/**
 * 18. Calculates pick list progress
 */
export declare function calculatePickListProgress(pickListId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    progressPercent: number;
    estimatedTimeRemaining: number;
}>;
/**
 * 19. Performs intelligent cartonization
 */
export declare function performCartonization(pickListId: string, strategy: CartonizationStrategy, availableCartons: CartonSpecification[]): Promise<PackingResult>;
/**
 * 20. Creates carton record
 */
export declare function createCarton(shipmentId: string, cartonSpec: CartonSpecification, weight: number, packedBy: string, sequelize: Sequelize): Promise<Carton>;
/**
 * 21. Adds items to carton
 */
export declare function addItemsToCarton(cartonId: string, pickTasks: PickTask[], sequelize: Sequelize): Promise<CartonContent[]>;
/**
 * 22. Completes packing for a carton
 */
export declare function completeCartonPacking(cartonId: string, sequelize: Sequelize): Promise<Carton>;
/**
 * 23. Verifies carton contents
 */
export declare function verifyCartonContents(cartonId: string): Promise<{
    isValid: boolean;
    discrepancies: string[];
}>;
/**
 * 24. Retrieves packing summary for shipment
 */
export declare function getPackingSummary(shipmentId: string): Promise<{
    totalCartons: number;
    totalItems: number;
    totalWeight: number;
    cartons: Carton[];
}>;
/**
 * 25. Generates shipping label for carton
 */
export declare function generateShippingLabel(cartonId: string, carrier: string, serviceLevel: string, sequelize: Sequelize): Promise<{
    labelData: string;
    trackingNumber: string;
}>;
/**
 * 26. Generates packing slip for shipment
 */
export declare function generatePackingSlip(shipmentId: string): Promise<{
    packingSlipData: string;
    itemCount: number;
}>;
/**
 * 27. Manifests shipment with carrier
 */
export declare function manifestShipment(shipmentId: string, sequelize: Sequelize): Promise<Shipment>;
/**
 * 28. Prints batch labels for multiple cartons
 */
export declare function printBatchLabels(shipmentId: string): Promise<{
    labels: Array<{
        cartonId: string;
        trackingNumber: string;
        labelData: string;
    }>;
}>;
/**
 * 29. Creates quality check for shipment
 */
export declare function createQualityCheck(shipmentId: string, checkType: string, isMandatory: boolean, sequelize: Sequelize): Promise<QualityCheck>;
/**
 * 30. Performs quality check
 */
export declare function performQualityCheck(qualityCheckId: string, performedBy: string, passed: boolean, findings: string, sequelize: Sequelize): Promise<QualityCheck>;
/**
 * 31. Validates expiration dates for medical supplies
 */
export declare function validateExpirationDates(pickTasks: PickTask[], minDaysValid?: number): Promise<{
    valid: boolean;
    warnings: string[];
}>;
/**
 * 32. Verifies lot numbers and serial numbers
 */
export declare function verifyLotAndSerial(pickTaskId: string, lotNumber?: string, serialNumber?: string): Promise<{
    isValid: boolean;
    message: string;
}>;
/**
 * 33. Checks temperature compliance for cold chain items
 */
export declare function checkTemperatureCompliance(shipmentId: string, temperatureLog: Array<{
    timestamp: Date;
    temperature: number;
}>, minTemp: number, maxTemp: number): Promise<{
    compliant: boolean;
    violations: string[];
}>;
/**
 * 34. Updates inventory after pick confirmation
 */
export declare function updateInventoryAfterPick(pickTaskId: string, sequelize: Sequelize): Promise<{
    success: boolean;
    newQuantity: number;
}>;
/**
 * 35. Reserves inventory for wave
 */
export declare function reserveInventoryForWave(waveId: string, sequelize: Sequelize): Promise<{
    reservedItems: number;
    totalQuantity: number;
}>;
/**
 * 36. Releases reserved inventory after cancellation
 */
export declare function releaseReservedInventory(waveId: string, sequelize: Sequelize): Promise<{
    releasedItems: number;
}>;
/**
 * 37. Syncs inventory with warehouse management system
 */
export declare function syncInventoryWithWMS(warehouseId: string): Promise<{
    syncedItems: number;
    lastSync: Date;
}>;
/**
 * 38. Calculates picker performance metrics
 */
export declare function calculatePickerPerformance(pickerId: string, startDate: Date, endDate: Date): Promise<PerformanceMetrics>;
/**
 * 39. Tracks real-time picking status
 */
export declare function getRealtimePickingStatus(warehouseId: string): Promise<{
    activePickers: number;
    activePickLists: number;
    completedToday: number;
    pendingOrders: number;
}>;
/**
 * 40. Generates fulfillment summary report
 */
export declare function generateFulfillmentReport(warehouseId: string, startDate: Date, endDate: Date): Promise<{
    totalOrders: number;
    totalShipments: number;
    totalUnits: number;
    averageFulfillmentTime: number;
    onTimePercent: number;
}>;
/**
 * 41. Identifies bottlenecks in fulfillment process
 */
export declare function identifyFulfillmentBottlenecks(warehouseId: string): Promise<Array<{
    stage: string;
    avgDuration: number;
    taskCount: number;
}>>;
/**
 * 42. Exports audit trail for HIPAA compliance
 */
export declare function exportAuditTrail(startDate: Date, endDate: Date): Promise<Array<{
    timestamp: Date;
    action: string;
    userId: string;
    entityType: string;
    entityId: string;
    details: string;
}>>;
export declare const WAREHOUSE_FULFILLMENT_SERVICE = "WAREHOUSE_FULFILLMENT_SERVICE";
export declare const CARTONIZATION_ENGINE = "CARTONIZATION_ENGINE";
export declare const QUALITY_CHECK_SERVICE = "QUALITY_CHECK_SERVICE";
declare const _default: {
    Warehouse: typeof Warehouse;
    WarehouseZone: typeof WarehouseZone;
    WavePick: typeof WavePick;
    WaveOrder: typeof WaveOrder;
    Order: typeof Order;
    OrderLine: typeof OrderLine;
    PickList: typeof PickList;
    PickTask: typeof PickTask;
    Carton: typeof Carton;
    CartonContent: typeof CartonContent;
    Shipment: typeof Shipment;
    QualityCheck: typeof QualityCheck;
    PickerPerformance: typeof PickerPerformance;
    planWave: typeof planWave;
    releaseWave: typeof releaseWave;
    optimizeWaveRouting: typeof optimizeWaveRouting;
    getActiveWaves: typeof getActiveWaves;
    cancelWave: typeof cancelWave;
    calculateWaveCapacity: typeof calculateWaveCapacity;
    generatePickLists: typeof generatePickLists;
    assignPickList: typeof assignPickList;
    getPickListWithTasks: typeof getPickListWithTasks;
    startPicking: typeof startPicking;
    confirmPick: typeof confirmPick;
    handleShortPick: typeof handleShortPick;
    completePickList: typeof completePickList;
    getPickTasksByLocation: typeof getPickTasksByLocation;
    calculatePickListProgress: typeof calculatePickListProgress;
    performCartonization: typeof performCartonization;
    createCarton: typeof createCarton;
    addItemsToCarton: typeof addItemsToCarton;
    completeCartonPacking: typeof completeCartonPacking;
    verifyCartonContents: typeof verifyCartonContents;
    getPackingSummary: typeof getPackingSummary;
    generateShippingLabel: typeof generateShippingLabel;
    generatePackingSlip: typeof generatePackingSlip;
    manifestShipment: typeof manifestShipment;
    printBatchLabels: typeof printBatchLabels;
    createQualityCheck: typeof createQualityCheck;
    performQualityCheck: typeof performQualityCheck;
    validateExpirationDates: typeof validateExpirationDates;
    verifyLotAndSerial: typeof verifyLotAndSerial;
    checkTemperatureCompliance: typeof checkTemperatureCompliance;
    updateInventoryAfterPick: typeof updateInventoryAfterPick;
    reserveInventoryForWave: typeof reserveInventoryForWave;
    releaseReservedInventory: typeof releaseReservedInventory;
    syncInventoryWithWMS: typeof syncInventoryWithWMS;
    calculatePickerPerformance: typeof calculatePickerPerformance;
    getRealtimePickingStatus: typeof getRealtimePickingStatus;
    generateFulfillmentReport: typeof generateFulfillmentReport;
    identifyFulfillmentBottlenecks: typeof identifyFulfillmentBottlenecks;
    exportAuditTrail: typeof exportAuditTrail;
};
export default _default;
//# sourceMappingURL=warehouse-fulfillment-kit.d.ts.map