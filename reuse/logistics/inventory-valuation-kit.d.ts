/**
 * LOC: INV-VAL-001
 * File: /reuse/logistics/inventory-valuation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Inventory controllers
 *   - Costing services
 *   - Valuation processors
 *   - Variance analysis modules
 */
/**
 * Costing method enumeration
 */
export declare enum CostingMethod {
    FIFO = "FIFO",// First In, First Out
    LIFO = "LIFO",// Last In, First Out
    WEIGHTED_AVERAGE = "WEIGHTED_AVERAGE",// Weighted Average Cost
    MOVING_AVERAGE = "MOVING_AVERAGE",// Moving Average Cost
    STANDARD = "STANDARD",// Standard Costing
    SPECIFIC_IDENTIFICATION = "SPECIFIC_IDENTIFICATION"
}
/**
 * Valuation status enumeration
 */
export declare enum ValuationStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    CLOSED = "CLOSED",
    ADJUSTED = "ADJUSTED",
    FROZEN = "FROZEN",
    UNDER_REVIEW = "UNDER_REVIEW"
}
/**
 * Variance type enumeration
 */
export declare enum VarianceType {
    PRICE = "PRICE",// Purchase price variance
    QUANTITY = "QUANTITY",// Quantity variance
    USAGE = "USAGE",// Material usage variance
    EFFICIENCY = "EFFICIENCY",// Labor efficiency variance
    SCRAP = "SCRAP",// Scrap variance
    VOLUME = "VOLUME",// Production volume variance
    MIX = "MIX",// Product mix variance
    YIELD = "YIELD"
}
/**
 * Adjustment reason enumeration
 */
export declare enum AdjustmentReason {
    PHYSICAL_COUNT = "PHYSICAL_COUNT",
    SHRINKAGE = "SHRINKAGE",
    DAMAGE = "DAMAGE",
    OBSOLESCENCE = "OBSOLESCENCE",
    REVALUATION = "REVALUATION",
    CORRECTION = "CORRECTION",
    WRITE_OFF = "WRITE_OFF",
    WRITE_DOWN = "WRITE_DOWN",
    RECLASSIFICATION = "RECLASSIFICATION"
}
/**
 * Cost layer representing a batch of inventory received at a specific cost
 */
export interface CostLayer {
    layerId: string;
    itemId: string;
    locationId: string;
    receiptDate: Date;
    receiptId?: string;
    quantity: number;
    remainingQuantity: number;
    unitCost: number;
    totalCost: number;
    currency: string;
    lotNumber?: string;
    serialNumber?: string;
    expirationDate?: Date;
    status: ValuationStatus;
    metadata?: Record<string, any>;
}
/**
 * Cost pool for averaging methods
 */
export interface CostPool {
    poolId: string;
    itemId: string;
    locationId: string;
    totalQuantity: number;
    totalCost: number;
    averageCost: number;
    currency: string;
    lastUpdated: Date;
    layers?: CostLayer[];
    metadata?: Record<string, any>;
}
/**
 * Inventory valuation snapshot
 */
export interface ValuationSnapshot {
    snapshotId: string;
    itemId: string;
    locationId: string;
    snapshotDate: Date;
    costingMethod: CostingMethod;
    quantity: number;
    unitCost: number;
    totalValue: number;
    currency: string;
    layers?: CostLayer[];
    pool?: CostPool;
    status: ValuationStatus;
    periodId?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    metadata?: Record<string, any>;
}
/**
 * Cost adjustment record
 */
export interface CostAdjustment {
    adjustmentId: string;
    itemId: string;
    locationId: string;
    adjustmentDate: Date;
    reason: AdjustmentReason;
    quantityBefore: number;
    quantityAfter: number;
    quantityChange: number;
    unitCostBefore: number;
    unitCostAfter: number;
    valueBefore: number;
    valueAfter: number;
    valueChange: number;
    currency: string;
    approvedBy?: string;
    approvedAt?: Date;
    notes?: string;
    referenceId?: string;
    reversalId?: string;
    status: ValuationStatus;
    metadata?: Record<string, any>;
}
/**
 * Variance record
 */
export interface VarianceRecord {
    varianceId: string;
    itemId: string;
    locationId: string;
    varianceDate: Date;
    varianceType: VarianceType;
    standardCost: number;
    actualCost: number;
    variance: number;
    variancePercent: number;
    quantity: number;
    totalVariance: number;
    currency: string;
    isFavorable: boolean;
    threshold?: number;
    exceedsThreshold: boolean;
    periodId?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Inventory transaction for costing
 */
export interface InventoryTransaction {
    transactionId: string;
    itemId: string;
    locationId: string;
    transactionDate: Date;
    transactionType: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'PRODUCTION';
    quantity: number;
    unitCost: number;
    totalCost: number;
    referenceId?: string;
    lotNumber?: string;
    serialNumber?: string;
    metadata?: Record<string, any>;
}
/**
 * Item master data
 */
export interface InventoryItem {
    itemId: string;
    sku: string;
    description: string;
    costingMethod: CostingMethod;
    standardCost?: number;
    currency: string;
    category?: string;
    uom: string;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Costing configuration
 */
export interface CostingConfig {
    defaultMethod: CostingMethod;
    allowNegativeInventory: boolean;
    roundingPrecision: number;
    currencyPrecision: number;
    autoRecalculate: boolean;
    periodCloseRequired: boolean;
    varianceThreshold: number;
    minCostAllowed?: number;
    maxCostAllowed?: number;
}
/**
 * Valuation report
 */
export interface ValuationReport {
    reportId: string;
    reportDate: Date;
    periodId?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    items: ValuationSnapshot[];
    totalValue: number;
    totalQuantity: number;
    currency: string;
    breakdown: {
        byLocation: Record<string, number>;
        byCategory: Record<string, number>;
        byCostingMethod: Record<CostingMethod, number>;
    };
    metadata?: Record<string, any>;
}
/**
 * Variance analysis summary
 */
export interface VarianceAnalysis {
    analysisId: string;
    analysisDate: Date;
    periodId?: string;
    fiscalYear?: number;
    fiscalPeriod?: number;
    variances: VarianceRecord[];
    totalVariance: number;
    favorableVariance: number;
    unfavorableVariance: number;
    varianceCount: number;
    exceedsThresholdCount: number;
    breakdown: {
        byType: Record<VarianceType, number>;
        byItem: Record<string, number>;
        byLocation: Record<string, number>;
    };
    metadata?: Record<string, any>;
}
/**
 * 1. Initializes cost pool for an item at a location.
 *
 * @param {string} itemId - Item identifier
 * @param {string} locationId - Location identifier
 * @param {string} currency - Currency code
 * @returns {CostPool} Initialized cost pool
 *
 * @example
 * ```typescript
 * const pool = initializeCostPool('ITEM-001', 'WH-01', 'USD');
 * ```
 */
export declare function initializeCostPool(itemId: string, locationId: string, currency?: string): CostPool;
/**
 * 2. Creates a new cost layer for FIFO/LIFO tracking.
 *
 * @param {InventoryTransaction} transaction - Receipt transaction
 * @returns {CostLayer} New cost layer
 *
 * @example
 * ```typescript
 * const layer = createCostLayer({
 *   transactionId: 'TXN-001',
 *   itemId: 'ITEM-001',
 *   locationId: 'WH-01',
 *   transactionDate: new Date(),
 *   transactionType: 'RECEIPT',
 *   quantity: 100,
 *   unitCost: 10.50,
 *   totalCost: 1050.00
 * });
 * ```
 */
export declare function createCostLayer(transaction: InventoryTransaction): CostLayer;
/**
 * 3. Calculates FIFO cost for an issue transaction.
 *
 * @param {CostLayer[]} layers - Available cost layers (oldest first)
 * @param {number} issueQuantity - Quantity to issue
 * @returns {object} FIFO cost calculation
 *
 * @example
 * ```typescript
 * const result = calculateFIFOCost(costLayers, 50);
 * // Returns: { totalCost: 525.00, averageUnitCost: 10.50, layersUsed: [...] }
 * ```
 */
export declare function calculateFIFOCost(layers: CostLayer[], issueQuantity: number): {
    totalCost: number;
    averageUnitCost: number;
    layersUsed: Array<{
        layer: CostLayer;
        quantityUsed: number;
        costUsed: number;
    }>;
    remainingQuantity: number;
};
/**
 * 4. Calculates LIFO cost for an issue transaction.
 *
 * @param {CostLayer[]} layers - Available cost layers (newest first)
 * @param {number} issueQuantity - Quantity to issue
 * @returns {object} LIFO cost calculation
 *
 * @example
 * ```typescript
 * const result = calculateLIFOCost(costLayers, 50);
 * ```
 */
export declare function calculateLIFOCost(layers: CostLayer[], issueQuantity: number): {
    totalCost: number;
    averageUnitCost: number;
    layersUsed: Array<{
        layer: CostLayer;
        quantityUsed: number;
        costUsed: number;
    }>;
    remainingQuantity: number;
};
/**
 * 5. Calculates weighted average cost.
 *
 * @param {CostPool} pool - Cost pool
 * @returns {number} Weighted average unit cost
 *
 * @example
 * ```typescript
 * const avgCost = calculateWeightedAverageCost(costPool);
 * // Returns: 10.75
 * ```
 */
export declare function calculateWeightedAverageCost(pool: CostPool): number;
/**
 * 6. Updates cost pool with new receipt.
 *
 * @param {CostPool} pool - Current cost pool
 * @param {InventoryTransaction} transaction - Receipt transaction
 * @returns {CostPool} Updated cost pool
 *
 * @example
 * ```typescript
 * const updated = updateCostPoolWithReceipt(pool, receiptTransaction);
 * ```
 */
export declare function updateCostPoolWithReceipt(pool: CostPool, transaction: InventoryTransaction): CostPool;
/**
 * 7. Updates cost pool with issue transaction.
 *
 * @param {CostPool} pool - Current cost pool
 * @param {number} issueQuantity - Quantity issued
 * @returns {CostPool} Updated cost pool
 *
 * @example
 * ```typescript
 * const updated = updateCostPoolWithIssue(pool, 50);
 * ```
 */
export declare function updateCostPoolWithIssue(pool: CostPool, issueQuantity: number): CostPool;
/**
 * 8. Determines costing method for an item.
 *
 * @param {InventoryItem} item - Inventory item
 * @param {CostingConfig} config - Costing configuration
 * @returns {CostingMethod} Costing method to use
 *
 * @example
 * ```typescript
 * const method = determineCostingMethod(item, config);
 * ```
 */
export declare function determineCostingMethod(item: InventoryItem, config: CostingConfig): CostingMethod;
/**
 * 9. Updates cost layer after issue transaction.
 *
 * @param {CostLayer} layer - Cost layer
 * @param {number} quantityIssued - Quantity issued from this layer
 * @returns {CostLayer} Updated cost layer
 *
 * @example
 * ```typescript
 * const updated = updateCostLayerWithIssue(layer, 25);
 * ```
 */
export declare function updateCostLayerWithIssue(layer: CostLayer, quantityIssued: number): CostLayer;
/**
 * 10. Retrieves active cost layers for an item.
 *
 * @param {CostLayer[]} allLayers - All cost layers
 * @param {string} itemId - Item identifier
 * @param {string} locationId - Location identifier
 * @returns {CostLayer[]} Active layers
 *
 * @example
 * ```typescript
 * const active = getActiveCostLayers(layers, 'ITEM-001', 'WH-01');
 * ```
 */
export declare function getActiveCostLayers(allLayers: CostLayer[], itemId: string, locationId: string): CostLayer[];
/**
 * 11. Consolidates cost layers (removes depleted layers).
 *
 * @param {CostLayer[]} layers - Cost layers
 * @returns {CostLayer[]} Consolidated layers
 *
 * @example
 * ```typescript
 * const consolidated = consolidateCostLayers(layers);
 * ```
 */
export declare function consolidateCostLayers(layers: CostLayer[]): CostLayer[];
/**
 * 12. Calculates total inventory value from cost layers.
 *
 * @param {CostLayer[]} layers - Cost layers
 * @returns {object} Inventory value summary
 *
 * @example
 * ```typescript
 * const value = calculateInventoryValueFromLayers(layers);
 * // Returns: { totalQuantity: 500, totalValue: 5250.00, averageCost: 10.50 }
 * ```
 */
export declare function calculateInventoryValueFromLayers(layers: CostLayer[]): {
    totalQuantity: number;
    totalValue: number;
    averageCost: number;
    layerCount: number;
};
/**
 * 13. Merges cost layers with same unit cost.
 *
 * @param {CostLayer[]} layers - Cost layers to merge
 * @returns {CostLayer[]} Merged layers
 *
 * @example
 * ```typescript
 * const merged = mergeCostLayers(layers);
 * ```
 */
export declare function mergeCostLayers(layers: CostLayer[]): CostLayer[];
/**
 * 14. Splits cost layer for partial lot transfer.
 *
 * @param {CostLayer} layer - Original cost layer
 * @param {number} splitQuantity - Quantity to split off
 * @returns {object} Split result
 *
 * @example
 * ```typescript
 * const result = splitCostLayer(layer, 30);
 * // Returns: { originalLayer: {...}, newLayer: {...} }
 * ```
 */
export declare function splitCostLayer(layer: CostLayer, splitQuantity: number): {
    originalLayer: CostLayer;
    newLayer: CostLayer;
};
/**
 * 15. Validates cost layer integrity.
 *
 * @param {CostLayer} layer - Cost layer to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCostLayer(layer);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateCostLayer(layer: CostLayer): {
    valid: boolean;
    errors: string[];
};
/**
 * 16. Creates valuation snapshot for an item.
 *
 * @param {string} itemId - Item identifier
 * @param {string} locationId - Location identifier
 * @param {CostingMethod} method - Costing method
 * @param {CostLayer[] | CostPool} data - Cost data
 * @returns {ValuationSnapshot} Valuation snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createValuationSnapshot('ITEM-001', 'WH-01', CostingMethod.FIFO, costLayers);
 * ```
 */
export declare function createValuationSnapshot(itemId: string, locationId: string, method: CostingMethod, data: CostLayer[] | CostPool): ValuationSnapshot;
/**
 * 17. Calculates current inventory valuation.
 *
 * @param {InventoryItem} item - Inventory item
 * @param {number} quantity - Current quantity
 * @param {CostLayer[] | CostPool} data - Cost data
 * @returns {object} Valuation calculation
 *
 * @example
 * ```typescript
 * const valuation = calculateCurrentValuation(item, 200, costLayers);
 * ```
 */
export declare function calculateCurrentValuation(item: InventoryItem, quantity: number, data: CostLayer[] | CostPool): {
    quantity: number;
    unitCost: number;
    totalValue: number;
    method: CostingMethod;
};
/**
 * 18. Calculates moving average cost after transaction.
 *
 * @param {number} currentQuantity - Quantity before transaction
 * @param {number} currentAvgCost - Average cost before transaction
 * @param {number} receiptQuantity - Received quantity
 * @param {number} receiptCost - Received unit cost
 * @returns {number} New moving average cost
 *
 * @example
 * ```typescript
 * const newAvgCost = calculateMovingAverageCost(100, 10.00, 50, 11.00);
 * // Returns: 10.33
 * ```
 */
export declare function calculateMovingAverageCost(currentQuantity: number, currentAvgCost: number, receiptQuantity: number, receiptCost: number): number;
/**
 * 19. Calculates standard cost variance.
 *
 * @param {number} standardCost - Standard unit cost
 * @param {number} actualCost - Actual unit cost
 * @param {number} quantity - Quantity
 * @returns {object} Cost variance
 *
 * @example
 * ```typescript
 * const variance = calculateStandardCostVariance(10.00, 10.50, 100);
 * // Returns: { variance: 50.00, variancePercent: 5.0, isFavorable: false }
 * ```
 */
export declare function calculateStandardCostVariance(standardCost: number, actualCost: number, quantity: number): {
    variance: number;
    variancePercent: number;
    isFavorable: boolean;
    totalVariance: number;
};
/**
 * 20. Revalues inventory at new cost.
 *
 * @param {ValuationSnapshot} snapshot - Current valuation
 * @param {number} newUnitCost - New unit cost
 * @returns {object} Revaluation result
 *
 * @example
 * ```typescript
 * const result = revalueInventory(snapshot, 11.00);
 * ```
 */
export declare function revalueInventory(snapshot: ValuationSnapshot, newUnitCost: number): {
    oldValue: number;
    newValue: number;
    revaluationAmount: number;
    newSnapshot: ValuationSnapshot;
};
/**
 * 21. Calculates lower of cost or market (LCM) valuation.
 *
 * @param {number} cost - Current cost
 * @param {number} marketValue - Current market value
 * @param {number} quantity - Quantity
 * @returns {object} LCM valuation
 *
 * @example
 * ```typescript
 * const lcm = calculateLowerOfCostOrMarket(10.50, 9.75, 100);
 * // Returns: { lcmValue: 975.00, writeDown: 75.00, useMarket: true }
 * ```
 */
export declare function calculateLowerOfCostOrMarket(cost: number, marketValue: number, quantity: number): {
    lcmValue: number;
    writeDown: number;
    useMarket: boolean;
};
/**
 * 22. Calculates net realizable value (NRV).
 *
 * @param {number} sellingPrice - Expected selling price
 * @param {number} costToComplete - Cost to complete/sell
 * @param {number} quantity - Quantity
 * @returns {object} NRV calculation
 *
 * @example
 * ```typescript
 * const nrv = calculateNetRealizableValue(15.00, 2.00, 100);
 * // Returns: { nrv: 13.00, totalNRV: 1300.00 }
 * ```
 */
export declare function calculateNetRealizableValue(sellingPrice: number, costToComplete: number, quantity: number): {
    nrv: number;
    totalNRV: number;
};
/**
 * 23. Generates valuation report for multiple items.
 *
 * @param {ValuationSnapshot[]} snapshots - Valuation snapshots
 * @param {string} periodId - Period identifier
 * @returns {ValuationReport} Valuation report
 *
 * @example
 * ```typescript
 * const report = generateValuationReport(snapshots, 'P-2024-01');
 * ```
 */
export declare function generateValuationReport(snapshots: ValuationSnapshot[], periodId?: string): ValuationReport;
/**
 * 24. Creates cost adjustment record.
 *
 * @param {string} itemId - Item identifier
 * @param {string} locationId - Location identifier
 * @param {AdjustmentReason} reason - Adjustment reason
 * @param {object} before - Before values
 * @param {object} after - After values
 * @returns {CostAdjustment} Cost adjustment
 *
 * @example
 * ```typescript
 * const adjustment = createCostAdjustment(
 *   'ITEM-001',
 *   'WH-01',
 *   AdjustmentReason.PHYSICAL_COUNT,
 *   { quantity: 100, unitCost: 10.00 },
 *   { quantity: 95, unitCost: 10.00 }
 * );
 * ```
 */
export declare function createCostAdjustment(itemId: string, locationId: string, reason: AdjustmentReason, before: {
    quantity: number;
    unitCost: number;
}, after: {
    quantity: number;
    unitCost: number;
}): CostAdjustment;
/**
 * 25. Applies cost adjustment to valuation.
 *
 * @param {ValuationSnapshot} snapshot - Current valuation
 * @param {CostAdjustment} adjustment - Adjustment to apply
 * @returns {ValuationSnapshot} Adjusted valuation
 *
 * @example
 * ```typescript
 * const adjusted = applyCostAdjustment(snapshot, adjustment);
 * ```
 */
export declare function applyCostAdjustment(snapshot: ValuationSnapshot, adjustment: CostAdjustment): ValuationSnapshot;
/**
 * 26. Reverses cost adjustment.
 *
 * @param {CostAdjustment} adjustment - Adjustment to reverse
 * @returns {CostAdjustment} Reversal adjustment
 *
 * @example
 * ```typescript
 * const reversal = reverseCostAdjustment(originalAdjustment);
 * ```
 */
export declare function reverseCostAdjustment(adjustment: CostAdjustment): CostAdjustment;
/**
 * 27. Calculates inventory write-down.
 *
 * @param {number} currentValue - Current inventory value
 * @param {number} nrv - Net realizable value
 * @returns {object} Write-down calculation
 *
 * @example
 * ```typescript
 * const writeDown = calculateInventoryWriteDown(1000.00, 850.00);
 * // Returns: { writeDownAmount: 150.00, writeDownPercent: 15.0 }
 * ```
 */
export declare function calculateInventoryWriteDown(currentValue: number, nrv: number): {
    writeDownAmount: number;
    writeDownPercent: number;
    newValue: number;
};
/**
 * 28. Processes obsolescence adjustment.
 *
 * @param {ValuationSnapshot} snapshot - Current valuation
 * @param {number} obsoletePercent - Percent to write off (0-1)
 * @returns {CostAdjustment} Obsolescence adjustment
 *
 * @example
 * ```typescript
 * const adjustment = processObsolescenceAdjustment(snapshot, 0.50);
 * ```
 */
export declare function processObsolescenceAdjustment(snapshot: ValuationSnapshot, obsoletePercent: number): CostAdjustment;
/**
 * 29. Processes shrinkage adjustment.
 *
 * @param {ValuationSnapshot} snapshot - Current valuation
 * @param {number} actualQuantity - Physical count quantity
 * @returns {CostAdjustment} Shrinkage adjustment
 *
 * @example
 * ```typescript
 * const adjustment = processShrinkageAdjustment(snapshot, 95);
 * ```
 */
export declare function processShrinkageAdjustment(snapshot: ValuationSnapshot, actualQuantity: number): CostAdjustment;
/**
 * 30. Approves cost adjustment.
 *
 * @param {CostAdjustment} adjustment - Adjustment to approve
 * @param {string} approvedBy - Approver identifier
 * @returns {CostAdjustment} Approved adjustment
 *
 * @example
 * ```typescript
 * const approved = approveCostAdjustment(adjustment, 'MGR-001');
 * ```
 */
export declare function approveCostAdjustment(adjustment: CostAdjustment, approvedBy: string): CostAdjustment;
/**
 * 31. Validates adjustment before processing.
 *
 * @param {CostAdjustment} adjustment - Adjustment to validate
 * @param {CostingConfig} config - Costing configuration
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCostAdjustment(adjustment, config);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateCostAdjustment(adjustment: CostAdjustment, config: CostingConfig): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 32. Creates variance record.
 *
 * @param {string} itemId - Item identifier
 * @param {string} locationId - Location identifier
 * @param {VarianceType} type - Variance type
 * @param {number} standardCost - Standard cost
 * @param {number} actualCost - Actual cost
 * @param {number} quantity - Quantity
 * @returns {VarianceRecord} Variance record
 *
 * @example
 * ```typescript
 * const variance = createVarianceRecord(
 *   'ITEM-001',
 *   'WH-01',
 *   VarianceType.PRICE,
 *   10.00,
 *   10.50,
 *   100
 * );
 * ```
 */
export declare function createVarianceRecord(itemId: string, locationId: string, type: VarianceType, standardCost: number, actualCost: number, quantity: number, threshold?: number): VarianceRecord;
/**
 * 33. Calculates purchase price variance.
 *
 * @param {number} standardPrice - Standard purchase price
 * @param {number} actualPrice - Actual purchase price
 * @param {number} quantityPurchased - Quantity purchased
 * @returns {VarianceRecord} Price variance
 *
 * @example
 * ```typescript
 * const ppv = calculatePurchasePriceVariance(10.00, 9.75, 500);
 * ```
 */
export declare function calculatePurchasePriceVariance(standardPrice: number, actualPrice: number, quantityPurchased: number): VarianceRecord;
/**
 * 34. Calculates usage variance.
 *
 * @param {number} standardQuantity - Standard quantity expected
 * @param {number} actualQuantity - Actual quantity used
 * @param {number} standardCost - Standard unit cost
 * @returns {object} Usage variance
 *
 * @example
 * ```typescript
 * const variance = calculateUsageVariance(100, 105, 10.00);
 * ```
 */
export declare function calculateUsageVariance(standardQuantity: number, actualQuantity: number, standardCost: number): {
    quantityVariance: number;
    valueVariance: number;
    variancePercent: number;
    isFavorable: boolean;
};
/**
 * 35. Generates variance analysis report.
 *
 * @param {VarianceRecord[]} variances - Variance records
 * @param {string} periodId - Period identifier
 * @returns {VarianceAnalysis} Variance analysis
 *
 * @example
 * ```typescript
 * const analysis = generateVarianceAnalysis(variances, 'P-2024-01');
 * ```
 */
export declare function generateVarianceAnalysis(variances: VarianceRecord[], periodId?: string): VarianceAnalysis;
/**
 * 36. Identifies significant variances.
 *
 * @param {VarianceRecord[]} variances - All variances
 * @param {number} threshold - Significance threshold percent
 * @returns {VarianceRecord[]} Significant variances
 *
 * @example
 * ```typescript
 * const significant = identifySignificantVariances(variances, 10);
 * ```
 */
export declare function identifySignificantVariances(variances: VarianceRecord[], threshold: number): VarianceRecord[];
/**
 * 37. Calculates variance trend over periods.
 *
 * @param {VarianceRecord[]} currentPeriod - Current period variances
 * @param {VarianceRecord[]} previousPeriod - Previous period variances
 * @returns {object} Variance trend
 *
 * @example
 * ```typescript
 * const trend = calculateVarianceTrend(currentVariances, previousVariances);
 * ```
 */
export declare function calculateVarianceTrend(currentPeriod: VarianceRecord[], previousPeriod: VarianceRecord[]): {
    currentTotal: number;
    previousTotal: number;
    change: number;
    changePercent: number;
    improving: boolean;
};
/**
 * 38. Exports variance analysis to CSV.
 *
 * @param {VarianceAnalysis} analysis - Variance analysis
 * @returns {string} CSV content
 *
 * @example
 * ```typescript
 * const csv = exportVarianceAnalysisToCSV(analysis);
 * ```
 */
export declare function exportVarianceAnalysisToCSV(analysis: VarianceAnalysis): string;
declare const _default: {
    initializeCostPool: typeof initializeCostPool;
    createCostLayer: typeof createCostLayer;
    calculateFIFOCost: typeof calculateFIFOCost;
    calculateLIFOCost: typeof calculateLIFOCost;
    calculateWeightedAverageCost: typeof calculateWeightedAverageCost;
    updateCostPoolWithReceipt: typeof updateCostPoolWithReceipt;
    updateCostPoolWithIssue: typeof updateCostPoolWithIssue;
    determineCostingMethod: typeof determineCostingMethod;
    updateCostLayerWithIssue: typeof updateCostLayerWithIssue;
    getActiveCostLayers: typeof getActiveCostLayers;
    consolidateCostLayers: typeof consolidateCostLayers;
    calculateInventoryValueFromLayers: typeof calculateInventoryValueFromLayers;
    mergeCostLayers: typeof mergeCostLayers;
    splitCostLayer: typeof splitCostLayer;
    validateCostLayer: typeof validateCostLayer;
    createValuationSnapshot: typeof createValuationSnapshot;
    calculateCurrentValuation: typeof calculateCurrentValuation;
    calculateMovingAverageCost: typeof calculateMovingAverageCost;
    calculateStandardCostVariance: typeof calculateStandardCostVariance;
    revalueInventory: typeof revalueInventory;
    calculateLowerOfCostOrMarket: typeof calculateLowerOfCostOrMarket;
    calculateNetRealizableValue: typeof calculateNetRealizableValue;
    generateValuationReport: typeof generateValuationReport;
    createCostAdjustment: typeof createCostAdjustment;
    applyCostAdjustment: typeof applyCostAdjustment;
    reverseCostAdjustment: typeof reverseCostAdjustment;
    calculateInventoryWriteDown: typeof calculateInventoryWriteDown;
    processObsolescenceAdjustment: typeof processObsolescenceAdjustment;
    processShrinkageAdjustment: typeof processShrinkageAdjustment;
    approveCostAdjustment: typeof approveCostAdjustment;
    validateCostAdjustment: typeof validateCostAdjustment;
    createVarianceRecord: typeof createVarianceRecord;
    calculatePurchasePriceVariance: typeof calculatePurchasePriceVariance;
    calculateUsageVariance: typeof calculateUsageVariance;
    generateVarianceAnalysis: typeof generateVarianceAnalysis;
    identifySignificantVariances: typeof identifySignificantVariances;
    calculateVarianceTrend: typeof calculateVarianceTrend;
    exportVarianceAnalysisToCSV: typeof exportVarianceAnalysisToCSV;
};
export default _default;
//# sourceMappingURL=inventory-valuation-kit.d.ts.map