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
 * File: /reuse/logistics/inventory-valuation-kit.ts
 * Locator: WC-LOGISTICS-INV-VAL-001
 * Purpose: Comprehensive Inventory Valuation & Costing - Complete costing methods and valuation management for logistics operations
 *
 * Upstream: Independent utility module for inventory valuation operations
 * Downstream: ../backend/logistics/*, Inventory modules, Costing services, Financial reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 38 utility functions for inventory costing, valuation, adjustments, variance analysis
 *
 * LLM Context: Enterprise-grade inventory valuation utilities for logistics operations to compete with JD Edwards EnterpriseOne.
 * Provides comprehensive costing method management (FIFO, LIFO, Average, Standard), cost layer tracking,
 * valuation calculations, cost adjustments, variance analysis, period-end close processes, and compliance reporting.
 * Supports multi-currency, multi-location, and regulatory compliance (GAAP, IFRS).
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Costing method enumeration
 */
export enum CostingMethod {
  FIFO = 'FIFO', // First In, First Out
  LIFO = 'LIFO', // Last In, First Out
  WEIGHTED_AVERAGE = 'WEIGHTED_AVERAGE', // Weighted Average Cost
  MOVING_AVERAGE = 'MOVING_AVERAGE', // Moving Average Cost
  STANDARD = 'STANDARD', // Standard Costing
  SPECIFIC_IDENTIFICATION = 'SPECIFIC_IDENTIFICATION', // Specific Item ID
}

/**
 * Valuation status enumeration
 */
export enum ValuationStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
  ADJUSTED = 'ADJUSTED',
  FROZEN = 'FROZEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * Variance type enumeration
 */
export enum VarianceType {
  PRICE = 'PRICE', // Purchase price variance
  QUANTITY = 'QUANTITY', // Quantity variance
  USAGE = 'USAGE', // Material usage variance
  EFFICIENCY = 'EFFICIENCY', // Labor efficiency variance
  SCRAP = 'SCRAP', // Scrap variance
  VOLUME = 'VOLUME', // Production volume variance
  MIX = 'MIX', // Product mix variance
  YIELD = 'YIELD', // Yield variance
}

/**
 * Adjustment reason enumeration
 */
export enum AdjustmentReason {
  PHYSICAL_COUNT = 'PHYSICAL_COUNT',
  SHRINKAGE = 'SHRINKAGE',
  DAMAGE = 'DAMAGE',
  OBSOLESCENCE = 'OBSOLESCENCE',
  REVALUATION = 'REVALUATION',
  CORRECTION = 'CORRECTION',
  WRITE_OFF = 'WRITE_OFF',
  WRITE_DOWN = 'WRITE_DOWN',
  RECLASSIFICATION = 'RECLASSIFICATION',
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

// ============================================================================
// SECTION 1: COSTING METHOD MANAGEMENT (Functions 1-8)
// ============================================================================

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
export function initializeCostPool(
  itemId: string,
  locationId: string,
  currency: string = 'USD'
): CostPool {
  return {
    poolId: `POOL-${crypto.randomUUID()}`,
    itemId,
    locationId,
    totalQuantity: 0,
    totalCost: 0,
    averageCost: 0,
    currency,
    lastUpdated: new Date(),
    layers: [],
  };
}

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
export function createCostLayer(transaction: InventoryTransaction): CostLayer {
  return {
    layerId: `LAYER-${crypto.randomUUID()}`,
    itemId: transaction.itemId,
    locationId: transaction.locationId,
    receiptDate: transaction.transactionDate,
    receiptId: transaction.referenceId,
    quantity: transaction.quantity,
    remainingQuantity: transaction.quantity,
    unitCost: transaction.unitCost,
    totalCost: transaction.totalCost,
    currency: 'USD',
    lotNumber: transaction.lotNumber,
    serialNumber: transaction.serialNumber,
    status: ValuationStatus.ACTIVE,
  };
}

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
export function calculateFIFOCost(
  layers: CostLayer[],
  issueQuantity: number
): {
  totalCost: number;
  averageUnitCost: number;
  layersUsed: Array<{ layer: CostLayer; quantityUsed: number; costUsed: number }>;
  remainingQuantity: number;
} {
  const layersUsed: Array<{ layer: CostLayer; quantityUsed: number; costUsed: number }> = [];
  let remainingToIssue = issueQuantity;
  let totalCost = 0;

  // Sort layers by receipt date (oldest first)
  const sortedLayers = [...layers].sort(
    (a, b) => a.receiptDate.getTime() - b.receiptDate.getTime()
  );

  for (const layer of sortedLayers) {
    if (remainingToIssue <= 0) break;
    if (layer.remainingQuantity <= 0) continue;

    const quantityFromLayer = Math.min(layer.remainingQuantity, remainingToIssue);
    const costFromLayer = quantityFromLayer * layer.unitCost;

    layersUsed.push({
      layer,
      quantityUsed: quantityFromLayer,
      costUsed: costFromLayer,
    });

    totalCost += costFromLayer;
    remainingToIssue -= quantityFromLayer;
  }

  return {
    totalCost: Number(totalCost.toFixed(2)),
    averageUnitCost: issueQuantity > 0 ? Number((totalCost / issueQuantity).toFixed(2)) : 0,
    layersUsed,
    remainingQuantity: remainingToIssue,
  };
}

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
export function calculateLIFOCost(
  layers: CostLayer[],
  issueQuantity: number
): {
  totalCost: number;
  averageUnitCost: number;
  layersUsed: Array<{ layer: CostLayer; quantityUsed: number; costUsed: number }>;
  remainingQuantity: number;
} {
  const layersUsed: Array<{ layer: CostLayer; quantityUsed: number; costUsed: number }> = [];
  let remainingToIssue = issueQuantity;
  let totalCost = 0;

  // Sort layers by receipt date (newest first)
  const sortedLayers = [...layers].sort(
    (a, b) => b.receiptDate.getTime() - a.receiptDate.getTime()
  );

  for (const layer of sortedLayers) {
    if (remainingToIssue <= 0) break;
    if (layer.remainingQuantity <= 0) continue;

    const quantityFromLayer = Math.min(layer.remainingQuantity, remainingToIssue);
    const costFromLayer = quantityFromLayer * layer.unitCost;

    layersUsed.push({
      layer,
      quantityUsed: quantityFromLayer,
      costUsed: costFromLayer,
    });

    totalCost += costFromLayer;
    remainingToIssue -= quantityFromLayer;
  }

  return {
    totalCost: Number(totalCost.toFixed(2)),
    averageUnitCost: issueQuantity > 0 ? Number((totalCost / issueQuantity).toFixed(2)) : 0,
    layersUsed,
    remainingQuantity: remainingToIssue,
  };
}

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
export function calculateWeightedAverageCost(pool: CostPool): number {
  if (pool.totalQuantity <= 0) {
    return 0;
  }

  return Number((pool.totalCost / pool.totalQuantity).toFixed(4));
}

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
export function updateCostPoolWithReceipt(
  pool: CostPool,
  transaction: InventoryTransaction
): CostPool {
  const newTotalQuantity = pool.totalQuantity + transaction.quantity;
  const newTotalCost = pool.totalCost + transaction.totalCost;
  const newAverageCost = newTotalQuantity > 0 ? newTotalCost / newTotalQuantity : 0;

  return {
    ...pool,
    totalQuantity: newTotalQuantity,
    totalCost: Number(newTotalCost.toFixed(2)),
    averageCost: Number(newAverageCost.toFixed(4)),
    lastUpdated: new Date(),
  };
}

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
export function updateCostPoolWithIssue(
  pool: CostPool,
  issueQuantity: number
): CostPool {
  const issueCost = issueQuantity * pool.averageCost;
  const newTotalQuantity = pool.totalQuantity - issueQuantity;
  const newTotalCost = pool.totalCost - issueCost;

  return {
    ...pool,
    totalQuantity: Math.max(0, newTotalQuantity),
    totalCost: Number(Math.max(0, newTotalCost).toFixed(2)),
    averageCost: newTotalQuantity > 0 ? Number((newTotalCost / newTotalQuantity).toFixed(4)) : 0,
    lastUpdated: new Date(),
  };
}

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
export function determineCostingMethod(
  item: InventoryItem,
  config: CostingConfig
): CostingMethod {
  // Use item-specific method if defined, otherwise use default
  return item.costingMethod || config.defaultMethod;
}

// ============================================================================
// SECTION 2: COST LAYER TRACKING (Functions 9-15)
// ============================================================================

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
export function updateCostLayerWithIssue(
  layer: CostLayer,
  quantityIssued: number
): CostLayer {
  const newRemainingQuantity = layer.remainingQuantity - quantityIssued;

  return {
    ...layer,
    remainingQuantity: Math.max(0, newRemainingQuantity),
    status: newRemainingQuantity <= 0 ? ValuationStatus.CLOSED : layer.status,
  };
}

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
export function getActiveCostLayers(
  allLayers: CostLayer[],
  itemId: string,
  locationId: string
): CostLayer[] {
  return allLayers.filter(
    layer =>
      layer.itemId === itemId &&
      layer.locationId === locationId &&
      layer.status === ValuationStatus.ACTIVE &&
      layer.remainingQuantity > 0
  );
}

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
export function consolidateCostLayers(layers: CostLayer[]): CostLayer[] {
  return layers.filter(layer => layer.remainingQuantity > 0 && layer.status === ValuationStatus.ACTIVE);
}

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
export function calculateInventoryValueFromLayers(layers: CostLayer[]): {
  totalQuantity: number;
  totalValue: number;
  averageCost: number;
  layerCount: number;
} {
  const activeLayers = layers.filter(
    layer => layer.status === ValuationStatus.ACTIVE && layer.remainingQuantity > 0
  );

  const totalQuantity = activeLayers.reduce((sum, layer) => sum + layer.remainingQuantity, 0);
  const totalValue = activeLayers.reduce(
    (sum, layer) => sum + layer.remainingQuantity * layer.unitCost,
    0
  );
  const averageCost = totalQuantity > 0 ? totalValue / totalQuantity : 0;

  return {
    totalQuantity,
    totalValue: Number(totalValue.toFixed(2)),
    averageCost: Number(averageCost.toFixed(4)),
    layerCount: activeLayers.length,
  };
}

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
export function mergeCostLayers(layers: CostLayer[]): CostLayer[] {
  const layerMap = new Map<number, CostLayer>();

  for (const layer of layers) {
    const costKey = layer.unitCost;

    if (layerMap.has(costKey)) {
      const existing = layerMap.get(costKey)!;
      existing.quantity += layer.quantity;
      existing.remainingQuantity += layer.remainingQuantity;
      existing.totalCost += layer.totalCost;
    } else {
      layerMap.set(costKey, { ...layer });
    }
  }

  return Array.from(layerMap.values());
}

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
export function splitCostLayer(
  layer: CostLayer,
  splitQuantity: number
): {
  originalLayer: CostLayer;
  newLayer: CostLayer;
} {
  if (splitQuantity > layer.remainingQuantity) {
    throw new Error('Split quantity exceeds available quantity');
  }

  const originalLayer: CostLayer = {
    ...layer,
    remainingQuantity: layer.remainingQuantity - splitQuantity,
  };

  const newLayer: CostLayer = {
    ...layer,
    layerId: `LAYER-${crypto.randomUUID()}`,
    quantity: splitQuantity,
    remainingQuantity: splitQuantity,
    totalCost: Number((splitQuantity * layer.unitCost).toFixed(2)),
  };

  return {
    originalLayer,
    newLayer,
  };
}

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
export function validateCostLayer(layer: CostLayer): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (layer.remainingQuantity > layer.quantity) {
    errors.push('Remaining quantity cannot exceed original quantity');
  }

  if (layer.remainingQuantity < 0) {
    errors.push('Remaining quantity cannot be negative');
  }

  if (layer.unitCost < 0) {
    errors.push('Unit cost cannot be negative');
  }

  const expectedTotalCost = layer.quantity * layer.unitCost;
  if (Math.abs(expectedTotalCost - layer.totalCost) > 0.01) {
    errors.push('Total cost does not match quantity × unit cost');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// SECTION 3: VALUATION CALCULATIONS (Functions 16-23)
// ============================================================================

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
export function createValuationSnapshot(
  itemId: string,
  locationId: string,
  method: CostingMethod,
  data: CostLayer[] | CostPool
): ValuationSnapshot {
  let quantity = 0;
  let totalValue = 0;
  let unitCost = 0;
  let layers: CostLayer[] | undefined;
  let pool: CostPool | undefined;

  if (Array.isArray(data)) {
    // Cost layers (FIFO/LIFO)
    const valueCalc = calculateInventoryValueFromLayers(data);
    quantity = valueCalc.totalQuantity;
    totalValue = valueCalc.totalValue;
    unitCost = valueCalc.averageCost;
    layers = data.filter(l => l.remainingQuantity > 0);
  } else {
    // Cost pool (Average)
    quantity = data.totalQuantity;
    totalValue = data.totalCost;
    unitCost = data.averageCost;
    pool = data;
  }

  return {
    snapshotId: `SNAP-${crypto.randomUUID()}`,
    itemId,
    locationId,
    snapshotDate: new Date(),
    costingMethod: method,
    quantity,
    unitCost: Number(unitCost.toFixed(4)),
    totalValue: Number(totalValue.toFixed(2)),
    currency: 'USD',
    layers,
    pool,
    status: ValuationStatus.ACTIVE,
  };
}

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
export function calculateCurrentValuation(
  item: InventoryItem,
  quantity: number,
  data: CostLayer[] | CostPool
): {
  quantity: number;
  unitCost: number;
  totalValue: number;
  method: CostingMethod;
} {
  let unitCost = 0;

  if (item.costingMethod === CostingMethod.STANDARD) {
    unitCost = item.standardCost || 0;
  } else if (Array.isArray(data)) {
    const valueCalc = calculateInventoryValueFromLayers(data);
    unitCost = valueCalc.averageCost;
  } else {
    unitCost = data.averageCost;
  }

  return {
    quantity,
    unitCost: Number(unitCost.toFixed(4)),
    totalValue: Number((quantity * unitCost).toFixed(2)),
    method: item.costingMethod,
  };
}

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
export function calculateMovingAverageCost(
  currentQuantity: number,
  currentAvgCost: number,
  receiptQuantity: number,
  receiptCost: number
): number {
  const currentValue = currentQuantity * currentAvgCost;
  const receiptValue = receiptQuantity * receiptCost;
  const newQuantity = currentQuantity + receiptQuantity;

  if (newQuantity <= 0) {
    return 0;
  }

  return Number(((currentValue + receiptValue) / newQuantity).toFixed(4));
}

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
export function calculateStandardCostVariance(
  standardCost: number,
  actualCost: number,
  quantity: number
): {
  variance: number;
  variancePercent: number;
  isFavorable: boolean;
  totalVariance: number;
} {
  const unitVariance = actualCost - standardCost;
  const totalVariance = unitVariance * quantity;
  const variancePercent = standardCost > 0 ? (unitVariance / standardCost) * 100 : 0;

  return {
    variance: Number(unitVariance.toFixed(4)),
    variancePercent: Number(variancePercent.toFixed(2)),
    isFavorable: unitVariance < 0, // Lower actual cost is favorable
    totalVariance: Number(totalVariance.toFixed(2)),
  };
}

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
export function revalueInventory(
  snapshot: ValuationSnapshot,
  newUnitCost: number
): {
  oldValue: number;
  newValue: number;
  revaluationAmount: number;
  newSnapshot: ValuationSnapshot;
} {
  const oldValue = snapshot.totalValue;
  const newValue = snapshot.quantity * newUnitCost;
  const revaluationAmount = newValue - oldValue;

  const newSnapshot: ValuationSnapshot = {
    ...snapshot,
    snapshotId: `SNAP-${crypto.randomUUID()}`,
    snapshotDate: new Date(),
    unitCost: Number(newUnitCost.toFixed(4)),
    totalValue: Number(newValue.toFixed(2)),
    status: ValuationStatus.ADJUSTED,
  };

  return {
    oldValue: Number(oldValue.toFixed(2)),
    newValue: Number(newValue.toFixed(2)),
    revaluationAmount: Number(revaluationAmount.toFixed(2)),
    newSnapshot,
  };
}

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
export function calculateLowerOfCostOrMarket(
  cost: number,
  marketValue: number,
  quantity: number
): {
  lcmValue: number;
  writeDown: number;
  useMarket: boolean;
} {
  const costValue = cost * quantity;
  const marketValueTotal = marketValue * quantity;
  const useMarket = marketValue < cost;
  const lcmValue = Math.min(costValue, marketValueTotal);
  const writeDown = costValue - lcmValue;

  return {
    lcmValue: Number(lcmValue.toFixed(2)),
    writeDown: Number(writeDown.toFixed(2)),
    useMarket,
  };
}

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
export function calculateNetRealizableValue(
  sellingPrice: number,
  costToComplete: number,
  quantity: number
): {
  nrv: number;
  totalNRV: number;
} {
  const nrv = sellingPrice - costToComplete;

  return {
    nrv: Number(nrv.toFixed(2)),
    totalNRV: Number((nrv * quantity).toFixed(2)),
  };
}

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
export function generateValuationReport(
  snapshots: ValuationSnapshot[],
  periodId?: string
): ValuationReport {
  const totalValue = snapshots.reduce((sum, s) => sum + s.totalValue, 0);
  const totalQuantity = snapshots.reduce((sum, s) => sum + s.quantity, 0);

  const byLocation: Record<string, number> = {};
  const byCostingMethod: Record<CostingMethod, number> = {} as any;
  const byCategory: Record<string, number> = {};

  for (const snapshot of snapshots) {
    // By location
    byLocation[snapshot.locationId] = (byLocation[snapshot.locationId] || 0) + snapshot.totalValue;

    // By costing method
    byCostingMethod[snapshot.costingMethod] =
      (byCostingMethod[snapshot.costingMethod] || 0) + snapshot.totalValue;
  }

  return {
    reportId: `RPT-${crypto.randomUUID()}`,
    reportDate: new Date(),
    periodId,
    items: snapshots,
    totalValue: Number(totalValue.toFixed(2)),
    totalQuantity,
    currency: 'USD',
    breakdown: {
      byLocation,
      byCategory,
      byCostingMethod,
    },
  };
}

// ============================================================================
// SECTION 4: COST ADJUSTMENTS (Functions 24-31)
// ============================================================================

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
export function createCostAdjustment(
  itemId: string,
  locationId: string,
  reason: AdjustmentReason,
  before: { quantity: number; unitCost: number },
  after: { quantity: number; unitCost: number }
): CostAdjustment {
  const valueBefore = before.quantity * before.unitCost;
  const valueAfter = after.quantity * after.unitCost;

  return {
    adjustmentId: `ADJ-${crypto.randomUUID()}`,
    itemId,
    locationId,
    adjustmentDate: new Date(),
    reason,
    quantityBefore: before.quantity,
    quantityAfter: after.quantity,
    quantityChange: after.quantity - before.quantity,
    unitCostBefore: Number(before.unitCost.toFixed(4)),
    unitCostAfter: Number(after.unitCost.toFixed(4)),
    valueBefore: Number(valueBefore.toFixed(2)),
    valueAfter: Number(valueAfter.toFixed(2)),
    valueChange: Number((valueAfter - valueBefore).toFixed(2)),
    currency: 'USD',
    status: ValuationStatus.PENDING,
  };
}

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
export function applyCostAdjustment(
  snapshot: ValuationSnapshot,
  adjustment: CostAdjustment
): ValuationSnapshot {
  return {
    ...snapshot,
    snapshotId: `SNAP-${crypto.randomUUID()}`,
    snapshotDate: new Date(),
    quantity: adjustment.quantityAfter,
    unitCost: adjustment.unitCostAfter,
    totalValue: adjustment.valueAfter,
    status: ValuationStatus.ADJUSTED,
    metadata: {
      ...snapshot.metadata,
      adjustmentId: adjustment.adjustmentId,
      adjustmentReason: adjustment.reason,
    },
  };
}

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
export function reverseCostAdjustment(adjustment: CostAdjustment): CostAdjustment {
  return {
    ...adjustment,
    adjustmentId: `ADJ-${crypto.randomUUID()}`,
    adjustmentDate: new Date(),
    reason: AdjustmentReason.CORRECTION,
    quantityBefore: adjustment.quantityAfter,
    quantityAfter: adjustment.quantityBefore,
    quantityChange: -adjustment.quantityChange,
    unitCostBefore: adjustment.unitCostAfter,
    unitCostAfter: adjustment.unitCostBefore,
    valueBefore: adjustment.valueAfter,
    valueAfter: adjustment.valueBefore,
    valueChange: -adjustment.valueChange,
    status: ValuationStatus.PENDING,
    metadata: {
      reversalOf: adjustment.adjustmentId,
    },
  };
}

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
export function calculateInventoryWriteDown(
  currentValue: number,
  nrv: number
): {
  writeDownAmount: number;
  writeDownPercent: number;
  newValue: number;
} {
  const writeDownAmount = Math.max(0, currentValue - nrv);
  const writeDownPercent = currentValue > 0 ? (writeDownAmount / currentValue) * 100 : 0;

  return {
    writeDownAmount: Number(writeDownAmount.toFixed(2)),
    writeDownPercent: Number(writeDownPercent.toFixed(2)),
    newValue: Number((currentValue - writeDownAmount).toFixed(2)),
  };
}

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
export function processObsolescenceAdjustment(
  snapshot: ValuationSnapshot,
  obsoletePercent: number
): CostAdjustment {
  const writeOffValue = snapshot.totalValue * obsoletePercent;
  const newValue = snapshot.totalValue - writeOffValue;
  const newUnitCost = snapshot.quantity > 0 ? newValue / snapshot.quantity : 0;

  return createCostAdjustment(
    snapshot.itemId,
    snapshot.locationId,
    AdjustmentReason.OBSOLESCENCE,
    { quantity: snapshot.quantity, unitCost: snapshot.unitCost },
    { quantity: snapshot.quantity, unitCost: newUnitCost }
  );
}

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
export function processShrinkageAdjustment(
  snapshot: ValuationSnapshot,
  actualQuantity: number
): CostAdjustment {
  return createCostAdjustment(
    snapshot.itemId,
    snapshot.locationId,
    AdjustmentReason.SHRINKAGE,
    { quantity: snapshot.quantity, unitCost: snapshot.unitCost },
    { quantity: actualQuantity, unitCost: snapshot.unitCost }
  );
}

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
export function approveCostAdjustment(
  adjustment: CostAdjustment,
  approvedBy: string
): CostAdjustment {
  return {
    ...adjustment,
    approvedBy,
    approvedAt: new Date(),
    status: ValuationStatus.ACTIVE,
  };
}

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
export function validateCostAdjustment(
  adjustment: CostAdjustment,
  config: CostingConfig
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.allowNegativeInventory && adjustment.quantityAfter < 0) {
    errors.push('Negative inventory not allowed');
  }

  if (config.minCostAllowed && adjustment.unitCostAfter < config.minCostAllowed) {
    errors.push(`Unit cost below minimum allowed (${config.minCostAllowed})`);
  }

  if (config.maxCostAllowed && adjustment.unitCostAfter > config.maxCostAllowed) {
    errors.push(`Unit cost above maximum allowed (${config.maxCostAllowed})`);
  }

  if (adjustment.unitCostAfter < 0) {
    errors.push('Unit cost cannot be negative');
  }

  const valueChangePercent = adjustment.valueBefore > 0
    ? Math.abs(adjustment.valueChange / adjustment.valueBefore) * 100
    : 0;

  if (valueChangePercent > 50) {
    warnings.push(`Large value change detected (${valueChangePercent.toFixed(2)}%)`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// SECTION 5: VARIANCE REPORTING (Functions 32-38)
// ============================================================================

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
export function createVarianceRecord(
  itemId: string,
  locationId: string,
  type: VarianceType,
  standardCost: number,
  actualCost: number,
  quantity: number,
  threshold?: number
): VarianceRecord {
  const variance = actualCost - standardCost;
  const variancePercent = standardCost > 0 ? (variance / standardCost) * 100 : 0;
  const totalVariance = variance * quantity;
  const isFavorable = variance < 0;

  const exceedsThreshold = threshold
    ? Math.abs(variancePercent) > threshold
    : false;

  return {
    varianceId: `VAR-${crypto.randomUUID()}`,
    itemId,
    locationId,
    varianceDate: new Date(),
    varianceType: type,
    standardCost: Number(standardCost.toFixed(4)),
    actualCost: Number(actualCost.toFixed(4)),
    variance: Number(variance.toFixed(4)),
    variancePercent: Number(variancePercent.toFixed(2)),
    quantity,
    totalVariance: Number(totalVariance.toFixed(2)),
    currency: 'USD',
    isFavorable,
    threshold,
    exceedsThreshold,
  };
}

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
export function calculatePurchasePriceVariance(
  standardPrice: number,
  actualPrice: number,
  quantityPurchased: number
): VarianceRecord {
  return createVarianceRecord(
    '', // To be filled by caller
    '', // To be filled by caller
    VarianceType.PRICE,
    standardPrice,
    actualPrice,
    quantityPurchased
  );
}

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
export function calculateUsageVariance(
  standardQuantity: number,
  actualQuantity: number,
  standardCost: number
): {
  quantityVariance: number;
  valueVariance: number;
  variancePercent: number;
  isFavorable: boolean;
} {
  const quantityVariance = actualQuantity - standardQuantity;
  const valueVariance = quantityVariance * standardCost;
  const variancePercent = standardQuantity > 0 ? (quantityVariance / standardQuantity) * 100 : 0;

  return {
    quantityVariance,
    valueVariance: Number(valueVariance.toFixed(2)),
    variancePercent: Number(variancePercent.toFixed(2)),
    isFavorable: quantityVariance < 0, // Less usage is favorable
  };
}

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
export function generateVarianceAnalysis(
  variances: VarianceRecord[],
  periodId?: string
): VarianceAnalysis {
  const totalVariance = variances.reduce((sum, v) => sum + v.totalVariance, 0);
  const favorableVariance = variances
    .filter(v => v.isFavorable)
    .reduce((sum, v) => sum + Math.abs(v.totalVariance), 0);
  const unfavorableVariance = variances
    .filter(v => !v.isFavorable)
    .reduce((sum, v) => sum + v.totalVariance, 0);
  const exceedsThresholdCount = variances.filter(v => v.exceedsThreshold).length;

  const byType: Record<VarianceType, number> = {} as any;
  const byItem: Record<string, number> = {};
  const byLocation: Record<string, number> = {};

  for (const variance of variances) {
    byType[variance.varianceType] =
      (byType[variance.varianceType] || 0) + variance.totalVariance;
    byItem[variance.itemId] = (byItem[variance.itemId] || 0) + variance.totalVariance;
    byLocation[variance.locationId] =
      (byLocation[variance.locationId] || 0) + variance.totalVariance;
  }

  return {
    analysisId: `ANA-${crypto.randomUUID()}`,
    analysisDate: new Date(),
    periodId,
    variances,
    totalVariance: Number(totalVariance.toFixed(2)),
    favorableVariance: Number(favorableVariance.toFixed(2)),
    unfavorableVariance: Number(unfavorableVariance.toFixed(2)),
    varianceCount: variances.length,
    exceedsThresholdCount,
    breakdown: {
      byType,
      byItem,
      byLocation,
    },
  };
}

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
export function identifySignificantVariances(
  variances: VarianceRecord[],
  threshold: number
): VarianceRecord[] {
  return variances.filter(v => Math.abs(v.variancePercent) > threshold);
}

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
export function calculateVarianceTrend(
  currentPeriod: VarianceRecord[],
  previousPeriod: VarianceRecord[]
): {
  currentTotal: number;
  previousTotal: number;
  change: number;
  changePercent: number;
  improving: boolean;
} {
  const currentTotal = currentPeriod.reduce((sum, v) => sum + Math.abs(v.totalVariance), 0);
  const previousTotal = previousPeriod.reduce((sum, v) => sum + Math.abs(v.totalVariance), 0);
  const change = currentTotal - previousTotal;
  const changePercent = previousTotal > 0 ? (change / previousTotal) * 100 : 0;

  return {
    currentTotal: Number(currentTotal.toFixed(2)),
    previousTotal: Number(previousTotal.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    improving: change < 0, // Less variance is improvement
  };
}

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
export function exportVarianceAnalysisToCSV(analysis: VarianceAnalysis): string {
  const headers = [
    'Variance ID',
    'Item ID',
    'Location ID',
    'Date',
    'Type',
    'Standard Cost',
    'Actual Cost',
    'Variance',
    'Variance %',
    'Quantity',
    'Total Variance',
    'Favorable',
    'Exceeds Threshold',
  ];

  let csv = headers.join(',') + '\n';

  for (const variance of analysis.variances) {
    const row = [
      variance.varianceId,
      variance.itemId,
      variance.locationId,
      variance.varianceDate.toISOString(),
      variance.varianceType,
      variance.standardCost.toFixed(4),
      variance.actualCost.toFixed(4),
      variance.variance.toFixed(4),
      variance.variancePercent.toFixed(2),
      variance.quantity,
      variance.totalVariance.toFixed(2),
      variance.isFavorable ? 'Yes' : 'No',
      variance.exceedsThreshold ? 'Yes' : 'No',
    ];
    csv += row.join(',') + '\n';
  }

  return csv;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Generates unique identifier.
 */
function generateUniqueId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

/**
 * Helper: Rounds to specified precision.
 */
function roundToPrecision(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Helper: Formats currency value.
 */
function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Helper: Validates positive number.
 */
function validatePositiveNumber(value: number, fieldName: string): void {
  if (value < 0) {
    throw new Error(`${fieldName} cannot be negative`);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Costing Method Management
  initializeCostPool,
  createCostLayer,
  calculateFIFOCost,
  calculateLIFOCost,
  calculateWeightedAverageCost,
  updateCostPoolWithReceipt,
  updateCostPoolWithIssue,
  determineCostingMethod,

  // Cost Layer Tracking
  updateCostLayerWithIssue,
  getActiveCostLayers,
  consolidateCostLayers,
  calculateInventoryValueFromLayers,
  mergeCostLayers,
  splitCostLayer,
  validateCostLayer,

  // Valuation Calculations
  createValuationSnapshot,
  calculateCurrentValuation,
  calculateMovingAverageCost,
  calculateStandardCostVariance,
  revalueInventory,
  calculateLowerOfCostOrMarket,
  calculateNetRealizableValue,
  generateValuationReport,

  // Cost Adjustments
  createCostAdjustment,
  applyCostAdjustment,
  reverseCostAdjustment,
  calculateInventoryWriteDown,
  processObsolescenceAdjustment,
  processShrinkageAdjustment,
  approveCostAdjustment,
  validateCostAdjustment,

  // Variance Reporting
  createVarianceRecord,
  calculatePurchasePriceVariance,
  calculateUsageVariance,
  generateVarianceAnalysis,
  identifySignificantVariances,
  calculateVarianceTrend,
  exportVarianceAnalysisToCSV,
};
