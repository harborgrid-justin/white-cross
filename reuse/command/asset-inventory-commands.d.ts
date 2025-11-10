/**
 * ASSET INVENTORY MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset inventory management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive inventory control including:
 * - Physical inventory counts and cycle counting
 * - Inventory reconciliation and variance analysis
 * - Inventory valuation (FIFO, LIFO, Weighted Average)
 * - Stock level monitoring and alerts
 * - Reorder point management and automation
 * - Inventory optimization algorithms
 * - ABC analysis and classification
 * - Stock aging and obsolescence tracking
 * - Inventory accuracy metrics
 * - Write-off and adjustment processing
 * - Multi-location inventory balancing
 *
 * @module AssetInventoryCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   initiatePhysicalCount,
 *   recordCountResult,
 *   reconcileInventory,
 *   performABCAnalysis,
 *   InventoryCountType
 * } from './asset-inventory-commands';
 *
 * // Start physical count
 * const count = await initiatePhysicalCount({
 *   countType: InventoryCountType.FULL_PHYSICAL,
 *   locationId: 'warehouse-1',
 *   scheduledDate: new Date(),
 *   assignedTo: ['user-001', 'user-002']
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Inventory count types
 */
export declare enum InventoryCountType {
    FULL_PHYSICAL = "full_physical",
    CYCLE_COUNT = "cycle_count",
    SPOT_CHECK = "spot_check",
    WALL_TO_WALL = "wall_to_wall",
    BLIND_COUNT = "blind_count",
    TARGETED_COUNT = "targeted_count"
}
/**
 * Count status
 */
export declare enum CountStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    RECONCILED = "reconciled",
    CANCELLED = "cancelled",
    ON_HOLD = "on_hold"
}
/**
 * Variance status
 */
export declare enum VarianceStatus {
    NO_VARIANCE = "no_variance",
    MINOR_VARIANCE = "minor_variance",
    SIGNIFICANT_VARIANCE = "significant_variance",
    CRITICAL_VARIANCE = "critical_variance",
    UNDER_INVESTIGATION = "under_investigation",
    RESOLVED = "resolved"
}
/**
 * Valuation method
 */
export declare enum ValuationMethod {
    FIFO = "fifo",
    LIFO = "lifo",
    WEIGHTED_AVERAGE = "weighted_average",
    STANDARD_COST = "standard_cost",
    SPECIFIC_IDENTIFICATION = "specific_identification"
}
/**
 * ABC classification
 */
export declare enum ABCClassification {
    A = "A",// High value, low quantity
    B = "B",// Medium value, medium quantity
    C = "C"
}
/**
 * Stock status
 */
export declare enum StockStatus {
    IN_STOCK = "in_stock",
    LOW_STOCK = "low_stock",
    OUT_OF_STOCK = "out_of_stock",
    REORDER_POINT = "reorder_point",
    EXCESS_STOCK = "excess_stock",
    OBSOLETE = "obsolete"
}
/**
 * Adjustment reason
 */
export declare enum AdjustmentReason {
    COUNT_VARIANCE = "count_variance",
    DAMAGE = "damage",
    THEFT = "theft",
    OBSOLESCENCE = "obsolescence",
    RETURN = "return",
    WRITE_OFF = "write_off",
    TRANSFER = "transfer",
    CORRECTION = "correction"
}
/**
 * Physical count data
 */
export interface PhysicalCountData {
    countType: InventoryCountType;
    countName: string;
    locationId?: string;
    assetTypeIds?: string[];
    scheduledDate: Date;
    assignedTo: string[];
    instructions?: string;
    blindCount?: boolean;
}
/**
 * Count result data
 */
export interface CountResultData {
    countId: string;
    assetId: string;
    countedQuantity: number;
    countedBy: string;
    countDate: Date;
    condition?: string;
    notes?: string;
    photos?: string[];
}
/**
 * Variance analysis result
 */
export interface VarianceAnalysis {
    assetId: string;
    expectedQuantity: number;
    countedQuantity: number;
    variance: number;
    variancePercentage: number;
    varianceStatus: VarianceStatus;
    estimatedValue: number;
    varianceValue: number;
}
/**
 * Reorder point data
 */
export interface ReorderPointData {
    assetTypeId: string;
    locationId?: string;
    reorderPoint: number;
    reorderQuantity: number;
    leadTimeDays: number;
    safetyStock: number;
    maxStockLevel?: number;
}
/**
 * ABC analysis result
 */
export interface ABCAnalysisResult {
    assetTypeId: string;
    classification: ABCClassification;
    annualValue: number;
    annualUsage: number;
    percentOfTotalValue: number;
    cumulativePercentValue: number;
}
/**
 * Inventory valuation result
 */
export interface InventoryValuationResult {
    assetTypeId: string;
    method: ValuationMethod;
    totalQuantity: number;
    unitCost: number;
    totalValue: number;
    valuationDate: Date;
}
/**
 * Physical Count Model
 */
export declare class PhysicalCount extends Model {
    id: string;
    countNumber: string;
    countName: string;
    countType: InventoryCountType;
    status: CountStatus;
    locationId?: string;
    assetTypeIds?: string[];
    scheduledDate: Date;
    startDate?: Date;
    completionDate?: Date;
    assignedTo: string[];
    instructions?: string;
    blindCount: boolean;
    totalItemsToCount?: number;
    itemsCounted: number;
    variancesFound: number;
    accuracyPercentage?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    countResults?: CountResult[];
    variances?: InventoryVariance[];
}
/**
 * Count Result Model
 */
export declare class CountResult extends Model {
    id: string;
    countId: string;
    assetId: string;
    expectedQuantity?: number;
    countedQuantity: number;
    variance?: number;
    countedBy: string;
    countDate: Date;
    condition?: string;
    notes?: string;
    photos?: string[];
    requiresInvestigation: boolean;
    createdAt: Date;
    updatedAt: Date;
    count?: PhysicalCount;
}
/**
 * Inventory Variance Model
 */
export declare class InventoryVariance extends Model {
    id: string;
    countId: string;
    assetId: string;
    expectedQuantity: number;
    countedQuantity: number;
    variance: number;
    variancePercentage?: number;
    varianceStatus: VarianceStatus;
    unitValue?: number;
    varianceValue?: number;
    investigatedBy?: string;
    investigationDate?: Date;
    investigationFindings?: string;
    resolution?: string;
    resolvedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    count?: PhysicalCount;
}
/**
 * Reorder Point Model
 */
export declare class ReorderPoint extends Model {
    id: string;
    assetTypeId: string;
    locationId?: string;
    reorderPoint: number;
    reorderQuantity: number;
    leadTimeDays: number;
    safetyStock: number;
    maxStockLevel?: number;
    averageDailyUsage?: number;
    isActive: boolean;
    lastReviewDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Inventory Adjustment Model
 */
export declare class InventoryAdjustment extends Model {
    id: string;
    adjustmentNumber: string;
    assetId: string;
    adjustmentReason: AdjustmentReason;
    previousQuantity: number;
    adjustmentQuantity: number;
    newQuantity: number;
    unitValue?: number;
    totalValueImpact?: number;
    adjustedBy: string;
    adjustmentDate: Date;
    approvedBy?: string;
    approvalDate?: Date;
    notes?: string;
    referenceDocument?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * ABC Classification Model
 */
export declare class ABCClassificationModel extends Model {
    id: string;
    assetTypeId: string;
    classification: ABCClassification;
    annualValue: number;
    annualUsage: number;
    percentOfTotalValue?: number;
    cumulativePercentValue?: number;
    analysisDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Initiates a physical inventory count
 *
 * @param data - Physical count data
 * @param transaction - Optional database transaction
 * @returns Created count
 *
 * @example
 * ```typescript
 * const count = await initiatePhysicalCount({
 *   countType: InventoryCountType.CYCLE_COUNT,
 *   countName: 'Q2 2024 Cycle Count - Warehouse A',
 *   locationId: 'warehouse-a',
 *   scheduledDate: new Date('2024-06-01'),
 *   assignedTo: ['user-001', 'user-002'],
 *   blindCount: true
 * });
 * ```
 */
export declare function initiatePhysicalCount(data: PhysicalCountData, transaction?: Transaction): Promise<PhysicalCount>;
/**
 * Starts a physical count
 *
 * @param countId - Count ID
 * @param startedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated count
 *
 * @example
 * ```typescript
 * await startPhysicalCount('count-123', 'user-001');
 * ```
 */
export declare function startPhysicalCount(countId: string, startedBy: string, transaction?: Transaction): Promise<PhysicalCount>;
/**
 * Records count result for an asset
 *
 * @param data - Count result data
 * @param transaction - Optional database transaction
 * @returns Count result
 *
 * @example
 * ```typescript
 * await recordCountResult({
 *   countId: 'count-123',
 *   assetId: 'asset-456',
 *   countedQuantity: 47,
 *   countedBy: 'user-001',
 *   countDate: new Date(),
 *   condition: 'Good',
 *   notes: 'All items accounted for'
 * });
 * ```
 */
export declare function recordCountResult(data: CountResultData, transaction?: Transaction): Promise<CountResult>;
/**
 * Completes physical count
 *
 * @param countId - Count ID
 * @param completedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated count
 *
 * @example
 * ```typescript
 * await completePhysicalCount('count-123', 'user-001');
 * ```
 */
export declare function completePhysicalCount(countId: string, completedBy: string, transaction?: Transaction): Promise<PhysicalCount>;
/**
 * Analyzes inventory variances
 *
 * @param countId - Count ID
 * @returns Variance analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeInventoryVariances('count-123');
 * ```
 */
export declare function analyzeInventoryVariances(countId: string): Promise<VarianceAnalysis[]>;
/**
 * Reconciles inventory after count
 *
 * @param countId - Count ID
 * @param reconciledBy - User ID
 * @param autoAdjust - Whether to automatically adjust inventory
 * @param transaction - Optional database transaction
 * @returns Reconciliation summary
 *
 * @example
 * ```typescript
 * const summary = await reconcileInventory('count-123', 'user-001', true);
 * ```
 */
export declare function reconcileInventory(countId: string, reconciledBy: string, autoAdjust?: boolean, transaction?: Transaction): Promise<{
    totalVariances: number;
    totalValueImpact: number;
    adjustmentsMade: number;
    requiresManualReview: number;
}>;
/**
 * Investigates variance
 *
 * @param varianceId - Variance ID
 * @param investigatedBy - User ID
 * @param findings - Investigation findings
 * @param resolution - Resolution details
 * @param transaction - Optional database transaction
 * @returns Updated variance
 *
 * @example
 * ```typescript
 * await investigateVariance(
 *   'variance-123',
 *   'user-001',
 *   'Items found in alternate storage location',
 *   'Assets relocated to correct location, inventory adjusted'
 * );
 * ```
 */
export declare function investigateVariance(varianceId: string, investigatedBy: string, findings: string, resolution?: string, transaction?: Transaction): Promise<InventoryVariance>;
/**
 * Creates inventory adjustment
 *
 * @param data - Adjustment data
 * @param transaction - Optional database transaction
 * @returns Created adjustment
 *
 * @example
 * ```typescript
 * await createInventoryAdjustment({
 *   assetId: 'asset-123',
 *   adjustmentReason: AdjustmentReason.DAMAGE,
 *   previousQuantity: 100,
 *   adjustmentQuantity: -5,
 *   newQuantity: 95,
 *   unitValue: 50,
 *   adjustedBy: 'user-001',
 *   notes: 'Water damage during storm'
 * });
 * ```
 */
export declare function createInventoryAdjustment(data: {
    assetId: string;
    adjustmentReason: AdjustmentReason;
    previousQuantity: number;
    adjustmentQuantity: number;
    newQuantity: number;
    unitValue?: number;
    adjustedBy: string;
    notes?: string;
    referenceDocument?: string;
}, transaction?: Transaction): Promise<InventoryAdjustment>;
/**
 * Approves inventory adjustment
 *
 * @param adjustmentId - Adjustment ID
 * @param approvedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated adjustment
 *
 * @example
 * ```typescript
 * await approveInventoryAdjustment('adj-123', 'mgr-001');
 * ```
 */
export declare function approveInventoryAdjustment(adjustmentId: string, approvedBy: string, transaction?: Transaction): Promise<InventoryAdjustment>;
/**
 * Sets reorder point for asset type
 *
 * @param data - Reorder point data
 * @param transaction - Optional database transaction
 * @returns Created/updated reorder point
 *
 * @example
 * ```typescript
 * await setReorderPoint({
 *   assetTypeId: 'type-123',
 *   locationId: 'warehouse-a',
 *   reorderPoint: 50,
 *   reorderQuantity: 100,
 *   leadTimeDays: 14,
 *   safetyStock: 20,
 *   maxStockLevel: 200
 * });
 * ```
 */
export declare function setReorderPoint(data: ReorderPointData, transaction?: Transaction): Promise<ReorderPoint>;
/**
 * Checks inventory levels against reorder points
 *
 * @param locationId - Optional location filter
 * @returns Assets at or below reorder point
 *
 * @example
 * ```typescript
 * const reorderNeeded = await checkReorderPoints('warehouse-a');
 * ```
 */
export declare function checkReorderPoints(locationId?: string): Promise<Array<{
    assetTypeId: string;
    currentQuantity: number;
    reorderPoint: number;
    reorderQuantity: number;
    shortfall: number;
}>>;
/**
 * Performs ABC analysis on inventory
 *
 * @param startDate - Analysis period start
 * @param endDate - Analysis period end
 * @param transaction - Optional database transaction
 * @returns ABC classification results
 *
 * @example
 * ```typescript
 * const analysis = await performABCAnalysis(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function performABCAnalysis(startDate: Date, endDate: Date, transaction?: Transaction): Promise<ABCAnalysisResult[]>;
/**
 * Gets ABC classification for asset type
 *
 * @param assetTypeId - Asset type ID
 * @returns Current ABC classification
 *
 * @example
 * ```typescript
 * const classification = await getABCClassification('type-123');
 * ```
 */
export declare function getABCClassification(assetTypeId: string): Promise<ABCClassificationModel | null>;
/**
 * Calculates inventory valuation
 *
 * @param assetTypeId - Optional asset type filter
 * @param method - Valuation method
 * @param valuationDate - Valuation date
 * @returns Valuation results
 *
 * @example
 * ```typescript
 * const valuation = await calculateInventoryValuation(
 *   'type-123',
 *   ValuationMethod.WEIGHTED_AVERAGE,
 *   new Date()
 * );
 * ```
 */
export declare function calculateInventoryValuation(assetTypeId?: string, method?: ValuationMethod, valuationDate?: Date): Promise<InventoryValuationResult[]>;
/**
 * Generates inventory accuracy report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns Accuracy metrics
 *
 * @example
 * ```typescript
 * const report = await generateInventoryAccuracyReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function generateInventoryAccuracyReport(startDate: Date, endDate: Date): Promise<{
    totalCounts: number;
    averageAccuracy: number;
    totalVariances: number;
    totalVarianceValue: number;
    countsByType: Record<InventoryCountType, number>;
}>;
declare const _default: {
    PhysicalCount: typeof PhysicalCount;
    CountResult: typeof CountResult;
    InventoryVariance: typeof InventoryVariance;
    ReorderPoint: typeof ReorderPoint;
    InventoryAdjustment: typeof InventoryAdjustment;
    ABCClassificationModel: typeof ABCClassificationModel;
    initiatePhysicalCount: typeof initiatePhysicalCount;
    startPhysicalCount: typeof startPhysicalCount;
    recordCountResult: typeof recordCountResult;
    completePhysicalCount: typeof completePhysicalCount;
    analyzeInventoryVariances: typeof analyzeInventoryVariances;
    reconcileInventory: typeof reconcileInventory;
    investigateVariance: typeof investigateVariance;
    createInventoryAdjustment: typeof createInventoryAdjustment;
    approveInventoryAdjustment: typeof approveInventoryAdjustment;
    setReorderPoint: typeof setReorderPoint;
    checkReorderPoints: typeof checkReorderPoints;
    performABCAnalysis: typeof performABCAnalysis;
    getABCClassification: typeof getABCClassification;
    calculateInventoryValuation: typeof calculateInventoryValuation;
    generateInventoryAccuracyReport: typeof generateInventoryAccuracyReport;
};
export default _default;
//# sourceMappingURL=asset-inventory-commands.d.ts.map