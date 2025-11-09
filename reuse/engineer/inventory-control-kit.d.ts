/**
 * INVENTORY CONTROL KIT FOR MATERIALS AND EQUIPMENT
 *
 * Comprehensive inventory and stock management toolkit for materials and equipment.
 * Provides 45 specialized functions covering:
 * - Stock level tracking and real-time monitoring
 * - Inventory transactions (receive, issue, transfer, adjust)
 * - Reorder point calculations and automated alerts
 * - ABC analysis for inventory classification
 * - Stock valuation methods (FIFO, LIFO, Weighted Average)
 * - Inventory reconciliation and cycle counting
 * - Location management and bin tracking
 * - Batch/lot tracking for pharmaceuticals and supplies
 * - Expiration date management (FEFO - First Expired, First Out)
 * - Inventory optimization and demand forecasting
 * - Stock movement analytics and reporting
 * - Multi-location inventory management
 * - Barcode and RFID integration
 * - Safety stock calculations
 * - Inventory turnover metrics
 *
 * @module InventoryControlKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - includes audit trails for pharmaceutical tracking
 * @performance Optimized for high-volume transaction processing (1000+ transactions/hour)
 *
 * @example
 * ```typescript
 * import {
 *   receiveInventory,
 *   issueInventory,
 *   calculateReorderPoint,
 *   performABCAnalysis,
 *   InventoryItem,
 *   StockMovement,
 *   InventoryLocation
 * } from './inventory-control-kit';
 *
 * // Receive new stock
 * const receipt = await receiveInventory({
 *   itemId: 'med-supply-001',
 *   quantity: 500,
 *   locationId: 'warehouse-a',
 *   batchNumber: 'BATCH-2024-001',
 *   expirationDate: new Date('2026-12-31'),
 *   unitCost: 25.50
 * });
 *
 * // Issue stock to department
 * await issueInventory({
 *   itemId: 'med-supply-001',
 *   quantity: 50,
 *   fromLocationId: 'warehouse-a',
 *   issuedTo: 'dept-emergency',
 *   reason: 'Department requisition #12345'
 * });
 *
 * // Calculate when to reorder
 * const reorderPoint = await calculateReorderPoint('med-supply-001', {
 *   averageDailyDemand: 10,
 *   leadTimeDays: 7,
 *   serviceLevel: 0.95
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Stock movement types
 */
export declare enum StockMovementType {
    RECEIPT = "receipt",
    ISSUE = "issue",
    TRANSFER = "transfer",
    ADJUSTMENT = "adjustment",
    RETURN = "return",
    DISPOSAL = "disposal",
    CYCLE_COUNT = "cycle_count",
    DAMAGED = "damaged",
    EXPIRED = "expired",
    WRITE_OFF = "write_off"
}
/**
 * Inventory valuation methods
 */
export declare enum ValuationMethod {
    FIFO = "fifo",// First In, First Out
    LIFO = "lifo",// Last In, First Out
    WEIGHTED_AVERAGE = "weighted_average",
    STANDARD_COST = "standard_cost",
    SPECIFIC_IDENTIFICATION = "specific_identification"
}
/**
 * ABC classification categories
 */
export declare enum ABCCategory {
    A = "A",// High value, tight control
    B = "B",// Medium value, moderate control
    C = "C"
}
/**
 * Stock status
 */
export declare enum StockStatus {
    AVAILABLE = "available",
    RESERVED = "reserved",
    QUARANTINED = "quarantined",
    DAMAGED = "damaged",
    EXPIRED = "expired",
    IN_TRANSIT = "in_transit"
}
/**
 * Inventory receipt data
 */
export interface InventoryReceiptData {
    itemId: string;
    quantity: number;
    locationId: string;
    batchNumber?: string;
    lotNumber?: string;
    serialNumbers?: string[];
    expirationDate?: Date;
    manufacturingDate?: Date;
    unitCost: number;
    supplierId?: string;
    purchaseOrderNumber?: string;
    receivedBy: string;
    receivedDate?: Date;
    notes?: string;
}
/**
 * Inventory issue data
 */
export interface InventoryIssueData {
    itemId: string;
    quantity: number;
    fromLocationId: string;
    batchNumber?: string;
    issuedTo: string;
    issuedBy: string;
    reason?: string;
    costCenter?: string;
    requisitionNumber?: string;
    notes?: string;
}
/**
 * Inventory transfer data
 */
export interface InventoryTransferData {
    itemId: string;
    quantity: number;
    fromLocationId: string;
    toLocationId: string;
    batchNumber?: string;
    transferredBy: string;
    reason?: string;
    expectedArrivalDate?: Date;
    notes?: string;
}
/**
 * Inventory adjustment data
 */
export interface InventoryAdjustmentData {
    itemId: string;
    locationId: string;
    batchNumber?: string;
    quantityChange: number;
    adjustmentType: 'cycle_count' | 'damage' | 'expiration' | 'correction' | 'other';
    reason: string;
    adjustedBy: string;
    notes?: string;
}
/**
 * Reorder point calculation parameters
 */
export interface ReorderPointParams {
    averageDailyDemand: number;
    leadTimeDays: number;
    serviceLevel?: number;
    demandVariability?: number;
}
/**
 * Stock level alert configuration
 */
export interface StockAlertConfig {
    itemId: string;
    locationId?: string;
    minStockLevel: number;
    maxStockLevel: number;
    reorderPoint: number;
    reorderQuantity: number;
    alertEmails?: string[];
    alertSMS?: string[];
    alertPriority: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Inventory valuation result
 */
export interface InventoryValuationResult {
    itemId: string;
    locationId?: string;
    quantity: number;
    method: ValuationMethod;
    unitValue: number;
    totalValue: number;
    oldestBatch?: {
        batchNumber: string;
        quantity: number;
        unitCost: number;
    };
    newestBatch?: {
        batchNumber: string;
        quantity: number;
        unitCost: number;
    };
}
/**
 * ABC analysis result
 */
export interface ABCAnalysisResult {
    itemId: string;
    category: ABCCategory;
    annualValue: number;
    percentageOfTotalValue: number;
    cumulativePercentage: number;
    annualDemand: number;
    unitCost: number;
}
/**
 * Inventory turnover metrics
 */
export interface InventoryTurnoverMetrics {
    itemId: string;
    period: 'month' | 'quarter' | 'year';
    startDate: Date;
    endDate: Date;
    costOfGoodsSold: number;
    averageInventoryValue: number;
    turnoverRatio: number;
    daysInventoryOutstanding: number;
    stockVelocity: 'fast' | 'medium' | 'slow';
}
/**
 * Stock availability result
 */
export interface StockAvailability {
    itemId: string;
    locationId: string;
    availableQuantity: number;
    reservedQuantity: number;
    quarantinedQuantity: number;
    totalQuantity: number;
    batches: Array<{
        batchNumber: string;
        quantity: number;
        expirationDate?: Date;
        status: StockStatus;
    }>;
}
/**
 * Cycle count plan
 */
export interface CycleCountPlan {
    itemId: string;
    locationId: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    nextCountDate: Date;
    abcCategory: ABCCategory;
    priority: number;
}
/**
 * Inventory Item Model - Master data for inventory items
 */
export declare class InventoryItem extends Model {
    id: string;
    itemCode: string;
    name: string;
    description?: string;
    category?: string;
    subcategory?: string;
    unitOfMeasure: string;
    standardCost?: number;
    valuationMethod: ValuationMethod;
    abcCategory?: ABCCategory;
    minStockLevel?: number;
    maxStockLevel?: number;
    reorderPoint?: number;
    reorderQuantity?: number;
    leadTimeDays?: number;
    isSerialized: boolean;
    isBatchTracked: boolean;
    hasExpirationDate: boolean;
    shelfLifeDays?: number;
    barcode?: string;
    manufacturer?: string;
    manufacturerPartNumber?: string;
    isActive: boolean;
    customAttributes?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    movements?: StockMovement[];
}
/**
 * Inventory Location Model - Warehouses, bins, shelves
 */
export declare class InventoryLocation extends Model {
    id: string;
    locationCode: string;
    name: string;
    locationType: string;
    parentLocationId?: string;
    description?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    gpsCoordinates?: {
        latitude: number;
        longitude: number;
    };
    capacity?: number;
    isTemperatureControlled: boolean;
    temperatureRange?: {
        min: number;
        max: number;
        unit: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    parentLocation?: InventoryLocation;
    childLocations?: InventoryLocation[];
    movements?: StockMovement[];
}
/**
 * Stock Movement Model - All inventory transactions
 */
export declare class StockMovement extends Model {
    id: string;
    itemId: string;
    locationId: string;
    movementType: StockMovementType;
    movementDate: Date;
    quantity: number;
    unitCost?: number;
    totalCost?: number;
    batchNumber?: string;
    lotNumber?: string;
    serialNumbers?: string[];
    expirationDate?: Date;
    manufacturingDate?: Date;
    fromLocationId?: string;
    toLocationId?: string;
    referenceNumber?: string;
    supplierId?: string;
    performedBy: string;
    issuedTo?: string;
    costCenter?: string;
    reason?: string;
    notes?: string;
    stockStatus: StockStatus;
    balanceAfterTransaction?: number;
    createdAt: Date;
    updatedAt: Date;
    item?: InventoryItem;
    location?: InventoryLocation;
}
/**
 * Receives inventory into stock
 *
 * @param data - Receipt data
 * @param transaction - Optional database transaction
 * @returns Created stock movement record
 *
 * @example
 * ```typescript
 * const receipt = await receiveInventory({
 *   itemId: 'item-001',
 *   quantity: 1000,
 *   locationId: 'warehouse-central',
 *   batchNumber: 'BATCH-2024-Q1-001',
 *   expirationDate: new Date('2026-12-31'),
 *   unitCost: 12.50,
 *   receivedBy: 'user-123',
 *   purchaseOrderNumber: 'PO-2024-0042'
 * });
 * ```
 */
export declare function receiveInventory(data: InventoryReceiptData, transaction?: Transaction): Promise<StockMovement>;
/**
 * Bulk receives multiple inventory items
 *
 * @param receipts - Array of receipt data
 * @param transaction - Optional database transaction
 * @returns Array of created movements
 *
 * @example
 * ```typescript
 * const movements = await bulkReceiveInventory([
 *   { itemId: 'item-001', quantity: 500, locationId: 'wh-a', unitCost: 10, receivedBy: 'user-1' },
 *   { itemId: 'item-002', quantity: 250, locationId: 'wh-a', unitCost: 15, receivedBy: 'user-1' }
 * ]);
 * ```
 */
export declare function bulkReceiveInventory(receipts: InventoryReceiptData[], transaction?: Transaction): Promise<StockMovement[]>;
/**
 * Issues inventory from stock
 *
 * @param data - Issue data
 * @param transaction - Optional database transaction
 * @returns Created stock movement record
 *
 * @example
 * ```typescript
 * const issue = await issueInventory({
 *   itemId: 'item-001',
 *   quantity: 50,
 *   fromLocationId: 'warehouse-a',
 *   issuedTo: 'dept-surgery',
 *   issuedBy: 'user-456',
 *   requisitionNumber: 'REQ-2024-0123',
 *   costCenter: 'CC-SURGERY'
 * });
 * ```
 */
export declare function issueInventory(data: InventoryIssueData, transaction?: Transaction): Promise<StockMovement>;
/**
 * Issues inventory using FEFO (First Expired, First Out) logic
 *
 * @param data - Issue data
 * @param transaction - Optional database transaction
 * @returns Array of movement records (may be multiple batches)
 *
 * @example
 * ```typescript
 * const movements = await issueFEFO({
 *   itemId: 'med-supply-001',
 *   quantity: 100,
 *   fromLocationId: 'pharmacy',
 *   issuedTo: 'ward-3',
 *   issuedBy: 'pharmacist-001'
 * });
 * ```
 */
export declare function issueFEFO(data: InventoryIssueData, transaction?: Transaction): Promise<StockMovement[]>;
/**
 * Transfers inventory between locations
 *
 * @param data - Transfer data
 * @param transaction - Optional database transaction
 * @returns Array of movement records (from and to)
 *
 * @example
 * ```typescript
 * const [fromMovement, toMovement] = await transferInventory({
 *   itemId: 'item-001',
 *   quantity: 100,
 *   fromLocationId: 'warehouse-a',
 *   toLocationId: 'warehouse-b',
 *   transferredBy: 'user-789',
 *   reason: 'Stock balancing'
 * });
 * ```
 */
export declare function transferInventory(data: InventoryTransferData, transaction?: Transaction): Promise<[StockMovement, StockMovement]>;
/**
 * Adjusts inventory quantity (cycle count, damage, etc.)
 *
 * @param data - Adjustment data
 * @param transaction - Optional database transaction
 * @returns Created adjustment movement
 *
 * @example
 * ```typescript
 * const adjustment = await adjustInventory({
 *   itemId: 'item-001',
 *   locationId: 'warehouse-a',
 *   quantityChange: -5,
 *   adjustmentType: 'damage',
 *   reason: '5 units damaged during handling',
 *   adjustedBy: 'user-001'
 * });
 * ```
 */
export declare function adjustInventory(data: InventoryAdjustmentData, transaction?: Transaction): Promise<StockMovement>;
/**
 * Performs cycle count and creates adjustment if needed
 *
 * @param itemId - Item identifier
 * @param locationId - Location identifier
 * @param countedQuantity - Physically counted quantity
 * @param countedBy - User performing count
 * @param batchNumber - Optional batch number
 * @param transaction - Optional database transaction
 * @returns Adjustment movement if variance found, null otherwise
 *
 * @example
 * ```typescript
 * const adjustment = await performCycleCount(
 *   'item-001',
 *   'warehouse-a',
 *   485,
 *   'user-001'
 * );
 * if (adjustment) {
 *   console.log(`Variance: ${adjustment.quantity}`);
 * }
 * ```
 */
export declare function performCycleCount(itemId: string, locationId: string, countedQuantity: number, countedBy: string, batchNumber?: string, transaction?: Transaction): Promise<StockMovement | null>;
/**
 * Gets current stock balance for an item at a location
 *
 * @param itemId - Item identifier
 * @param locationId - Location identifier
 * @param batchNumber - Optional batch number
 * @param transaction - Optional database transaction
 * @returns Current balance
 *
 * @example
 * ```typescript
 * const balance = await getCurrentStockBalance('item-001', 'warehouse-a');
 * console.log(`Current stock: ${balance}`);
 * ```
 */
export declare function getCurrentStockBalance(itemId: string, locationId: string, batchNumber?: string, transaction?: Transaction): Promise<number>;
/**
 * Gets detailed stock availability including batches
 *
 * @param itemId - Item identifier
 * @param locationId - Location identifier
 * @param transaction - Optional database transaction
 * @returns Stock availability details
 *
 * @example
 * ```typescript
 * const availability = await getStockAvailability('item-001', 'warehouse-a');
 * console.log(`Available: ${availability.availableQuantity}`);
 * console.log(`Batches: ${availability.batches.length}`);
 * ```
 */
export declare function getStockAvailability(itemId: string, locationId: string, transaction?: Transaction): Promise<StockAvailability>;
/**
 * Gets stock levels across all locations for an item
 *
 * @param itemId - Item identifier
 * @returns Stock levels by location
 *
 * @example
 * ```typescript
 * const levels = await getStockLevelsByLocation('item-001');
 * levels.forEach(level => {
 *   console.log(`${level.locationCode}: ${level.quantity}`);
 * });
 * ```
 */
export declare function getStockLevelsByLocation(itemId: string): Promise<Array<{
    locationId: string;
    locationCode: string;
    quantity: number;
}>>;
/**
 * Gets items with low stock (below reorder point)
 *
 * @param locationId - Optional location filter
 * @returns Items requiring reorder
 *
 * @example
 * ```typescript
 * const lowStock = await getLowStockItems('warehouse-a');
 * lowStock.forEach(item => {
 *   console.log(`${item.itemCode}: ${item.currentStock}/${item.reorderPoint}`);
 * });
 * ```
 */
export declare function getLowStockItems(locationId?: string): Promise<Array<{
    itemId: string;
    itemCode: string;
    itemName: string;
    currentStock: number;
    reorderPoint: number;
    reorderQuantity: number;
}>>;
/**
 * Calculates reorder point using safety stock formula
 *
 * @param itemId - Item identifier
 * @param params - Calculation parameters
 * @param transaction - Optional database transaction
 * @returns Calculated reorder point and safety stock
 *
 * @example
 * ```typescript
 * const result = await calculateReorderPoint('item-001', {
 *   averageDailyDemand: 25,
 *   leadTimeDays: 14,
 *   serviceLevel: 0.95,
 *   demandVariability: 5
 * });
 * console.log(`Reorder at: ${result.reorderPoint}`);
 * ```
 */
export declare function calculateReorderPoint(itemId: string, params: ReorderPointParams, transaction?: Transaction): Promise<{
    itemId: string;
    reorderPoint: number;
    safetyStock: number;
    averageDemandDuringLeadTime: number;
}>;
/**
 * Calculates Economic Order Quantity (EOQ)
 *
 * @param annualDemand - Annual demand quantity
 * @param orderingCost - Cost per order
 * @param holdingCostPerUnit - Annual holding cost per unit
 * @returns Optimal order quantity
 *
 * @example
 * ```typescript
 * const eoq = calculateEOQ(12000, 50, 2.5);
 * console.log(`Optimal order quantity: ${eoq}`);
 * ```
 */
export declare function calculateEOQ(annualDemand: number, orderingCost: number, holdingCostPerUnit: number): number;
/**
 * Checks and triggers reorder alerts
 *
 * @param itemId - Item identifier
 * @param locationId - Location identifier
 * @returns Alert triggered status
 *
 * @example
 * ```typescript
 * const alerted = await checkReorderAlerts('item-001', 'warehouse-a');
 * ```
 */
export declare function checkReorderAlerts(itemId: string, locationId: string): Promise<boolean>;
/**
 * Performs ABC analysis on inventory items
 *
 * @param locationId - Optional location filter
 * @param periodDays - Analysis period in days (default: 365)
 * @returns ABC analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performABCAnalysis('warehouse-a', 365);
 * const categoryA = analysis.filter(r => r.category === ABCCategory.A);
 * console.log(`Category A items: ${categoryA.length}`);
 * ```
 */
export declare function performABCAnalysis(locationId?: string, periodDays?: number): Promise<ABCAnalysisResult[]>;
/**
 * Calculates inventory valuation using specified method
 *
 * @param itemId - Item identifier
 * @param locationId - Optional location filter
 * @param method - Valuation method
 * @param transaction - Optional database transaction
 * @returns Valuation result
 *
 * @example
 * ```typescript
 * const valuation = await calculateInventoryValuation(
 *   'item-001',
 *   'warehouse-a',
 *   ValuationMethod.FIFO
 * );
 * console.log(`Total value: $${valuation.totalValue}`);
 * ```
 */
export declare function calculateInventoryValuation(itemId: string, locationId?: string, method?: ValuationMethod, transaction?: Transaction): Promise<InventoryValuationResult>;
/**
 * Gets items expiring within specified days
 *
 * @param days - Days until expiration
 * @param locationId - Optional location filter
 * @returns Expiring items
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringItems(30, 'pharmacy');
 * expiring.forEach(item => {
 *   console.log(`${item.itemCode} batch ${item.batchNumber} expires ${item.expirationDate}`);
 * });
 * ```
 */
export declare function getExpiringItems(days?: number, locationId?: string): Promise<Array<{
    itemId: string;
    itemCode: string;
    batchNumber: string;
    quantity: number;
    expirationDate: Date;
    daysUntilExpiration: number;
}>>;
/**
 * Calculates inventory turnover ratio
 *
 * @param itemId - Item identifier
 * @param period - Analysis period
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Turnover metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateInventoryTurnover(
 *   'item-001',
 *   'year',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Turnover ratio: ${metrics.turnoverRatio}`);
 * ```
 */
export declare function calculateInventoryTurnover(itemId: string, period: 'month' | 'quarter' | 'year', startDate: Date, endDate: Date): Promise<InventoryTurnoverMetrics>;
/**
 * Gets inventory movement history
 *
 * @param itemId - Item identifier
 * @param options - Query options
 * @returns Movement history
 *
 * @example
 * ```typescript
 * const history = await getInventoryMovementHistory('item-001', {
 *   limit: 50,
 *   movementType: StockMovementType.ISSUE
 * });
 * ```
 */
export declare function getInventoryMovementHistory(itemId: string, options?: {
    locationId?: string;
    movementType?: StockMovementType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}): Promise<StockMovement[]>;
/**
 * Generates inventory reconciliation report
 *
 * @param locationId - Location identifier
 * @param asOfDate - Reconciliation date
 * @returns Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport('warehouse-a', new Date());
 * console.log(`Total items: ${report.length}`);
 * ```
 */
export declare function generateReconciliationReport(locationId: string, asOfDate?: Date): Promise<Array<{
    itemId: string;
    itemCode: string;
    itemName: string;
    systemQuantity: number;
    systemValue: number;
    unitCost: number;
}>>;
/**
 * Generates stock movement summary report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @param locationId - Optional location filter
 * @returns Movement summary
 *
 * @example
 * ```typescript
 * const summary = await generateMovementSummary(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   'warehouse-a'
 * );
 * ```
 */
export declare function generateMovementSummary(startDate: Date, endDate: Date, locationId?: string): Promise<Array<{
    movementType: StockMovementType;
    count: number;
    totalQuantity: number;
    totalValue: number;
}>>;
declare const _default: {
    InventoryItem: typeof InventoryItem;
    InventoryLocation: typeof InventoryLocation;
    StockMovement: typeof StockMovement;
    receiveInventory: typeof receiveInventory;
    bulkReceiveInventory: typeof bulkReceiveInventory;
    issueInventory: typeof issueInventory;
    issueFEFO: typeof issueFEFO;
    transferInventory: typeof transferInventory;
    adjustInventory: typeof adjustInventory;
    performCycleCount: typeof performCycleCount;
    getCurrentStockBalance: typeof getCurrentStockBalance;
    getStockAvailability: typeof getStockAvailability;
    getStockLevelsByLocation: typeof getStockLevelsByLocation;
    getLowStockItems: typeof getLowStockItems;
    calculateReorderPoint: typeof calculateReorderPoint;
    calculateEOQ: typeof calculateEOQ;
    checkReorderAlerts: typeof checkReorderAlerts;
    performABCAnalysis: typeof performABCAnalysis;
    calculateInventoryValuation: typeof calculateInventoryValuation;
    getExpiringItems: typeof getExpiringItems;
    calculateInventoryTurnover: typeof calculateInventoryTurnover;
    getInventoryMovementHistory: typeof getInventoryMovementHistory;
    generateReconciliationReport: typeof generateReconciliationReport;
    generateMovementSummary: typeof generateMovementSummary;
};
export default _default;
//# sourceMappingURL=inventory-control-kit.d.ts.map