/**
 * LOC: USACE-DOWNSTREAM-INV-CTRL-001
 * File: /reuse/frontend/composites/usace/downstream/inventory-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-inventory-systems-composites
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS inventory management applications
 *   - Warehouse management systems
 *   - Stock control interfaces
 *   - Supply chain dashboards
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  InventoryItem,
  StockLevel,
  InventoryTransaction,
  ReorderRecommendation,
  useInventoryItem,
  useStockLevels,
  useInventoryTransactions,
  useReorderRecommendations,
  validateInventoryTransaction,
  calculateReorderPoint,
} from '../usace-inventory-systems-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface InventoryController {
  itemId: string;
  item: InventoryItem | null;
  stockLevels: StockLevel[];
  transactions: InventoryTransaction[];
  recommendations: ReorderRecommendation[];
  loading: boolean;
}

export interface BulkInventoryOperation {
  operationId: string;
  operationType: 'issue' | 'receive' | 'transfer' | 'adjust';
  items: {
    itemId: string;
    quantity: number;
    location?: string;
  }[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedCount: number;
  totalCount: number;
  errors: string[];
}

// ============================================================================
// INVENTORY CONTROLLER HOOKS
// ============================================================================

/**
 * Comprehensive inventory controller hook
 *
 * @param {string} itemId - Inventory item ID
 * @returns {InventoryController} Complete inventory controller
 *
 * @example
 * ```tsx
 * function InventoryDashboard({ itemId }) {
 *   const controller = useInventoryController(itemId);
 *   return (
 *     <div>
 *       <h1>{controller.item?.nomenclature}</h1>
 *       <StockLevels levels={controller.stockLevels} />
 *       <Transactions transactions={controller.transactions} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useInventoryController(itemId: string): InventoryController {
  const { item, loading: itemLoading } = useInventoryItem(itemId);
  const { stockLevels, loading: stockLoading } = useStockLevels(itemId);
  const { transactions, loading: transLoading } = useInventoryTransactions(itemId);
  const { recommendations, loading: recoLoading } = useReorderRecommendations();

  const itemRecommendations = useMemo(() =>
    recommendations.filter(r => r.itemId === itemId),
    [recommendations, itemId]
  );

  return {
    itemId,
    item,
    stockLevels,
    transactions,
    recommendations: itemRecommendations,
    loading: itemLoading || stockLoading || transLoading || recoLoading,
  };
}

/**
 * Hook for bulk inventory operations
 *
 * @returns {object} Bulk operation management
 *
 * @example
 * ```tsx
 * function BulkIssue() {
 *   const { operations, startBulkOperation } = useBulkInventoryOperations();
 *
 *   const handleBulkIssue = async () => {
 *     await startBulkOperation('issue', items);
 *   };
 * }
 * ```
 */
export function useBulkInventoryOperations() {
  const [operations, setOperations] = useState<BulkInventoryOperation[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const startBulkOperation = useCallback(async (
    operationType: 'issue' | 'receive' | 'transfer' | 'adjust',
    items: { itemId: string; quantity: number; location?: string }[]
  ) => {
    const operationId = `bulk_${Date.now()}`;
    const operation: BulkInventoryOperation = {
      operationId,
      operationType,
      items,
      status: 'pending',
      processedCount: 0,
      totalCount: items.length,
      errors: [],
    };

    setOperations(prev => [...prev, operation]);
    setProcessing(true);

    try {
      operation.status = 'processing';
      setOperations(prev => prev.map(o => o.operationId === operationId ? operation : o));

      for (const item of items) {
        try {
          await fetch(`/api/usace/inventory/items/${item.itemId}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionType: operationType,
              quantity: item.quantity,
              location: item.location,
            }),
          });
          operation.processedCount++;
        } catch (error) {
          operation.errors.push(`Failed to process ${item.itemId}: ${error}`);
        }
        setOperations(prev => prev.map(o => o.operationId === operationId ? { ...operation } : o));
      }

      operation.status = operation.errors.length === 0 ? 'completed' : 'failed';
      setOperations(prev => prev.map(o => o.operationId === operationId ? operation : o));
    } finally {
      setProcessing(false);
    }

    return operation;
  }, []);

  return {
    operations,
    processing,
    startBulkOperation,
  };
}

/**
 * Calculates inventory health metrics
 *
 * @param {InventoryItem} item - Inventory item
 * @param {StockLevel[]} stockLevels - Stock levels
 * @param {InventoryTransaction[]} transactions - Recent transactions
 * @returns {object} Health metrics
 *
 * @example
 * ```tsx
 * const health = calculateInventoryHealth(item, stockLevels, transactions);
 * console.log(`Health score: ${health.score}/100`);
 * ```
 */
export function calculateInventoryHealth(
  item: InventoryItem,
  stockLevels: StockLevel[],
  transactions: InventoryTransaction[]
): {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check stock levels
  const totalAvailable = stockLevels.reduce((sum, sl) => sum + sl.quantityAvailable, 0);
  const totalReorderPoint = stockLevels.reduce((sum, sl) => sum + sl.reorderPoint, 0);

  if (totalAvailable === 0) {
    score -= 50;
    issues.push('Out of stock');
    recommendations.push('Immediate reorder required');
  } else if (totalAvailable <= totalReorderPoint) {
    score -= 25;
    issues.push('Below reorder point');
    recommendations.push('Initiate reorder process');
  }

  // Check for recent movement
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(t =>
    new Date(t.performedDate) >= thirtyDaysAgo
  );

  if (recentTransactions.length === 0) {
    score -= 15;
    issues.push('No recent movement');
    recommendations.push('Review if item is still needed');
  }

  // Check for aging inventory
  stockLevels.forEach(sl => {
    if (sl.lastMovementDate) {
      const daysSinceMovement = Math.floor(
        (now.getTime() - new Date(sl.lastMovementDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceMovement > 180) {
        score -= 10;
        issues.push('Slow-moving inventory');
        recommendations.push('Consider disposition or transfer');
      }
    }
  });

  // Determine status
  let status: 'healthy' | 'warning' | 'critical';
  if (score >= 80) {
    status = 'healthy';
  } else if (score >= 50) {
    status = 'warning';
  } else {
    status = 'critical';
  }

  return {
    score: Math.max(0, score),
    status,
    issues,
    recommendations,
  };
}

/**
 * Optimizes inventory levels based on usage patterns
 *
 * @param {InventoryItem} item - Inventory item
 * @param {InventoryTransaction[]} transactions - Transaction history
 * @param {number} analysisMonths - Months of history to analyze
 * @returns {object} Optimized inventory parameters
 *
 * @example
 * ```tsx
 * const optimized = optimizeInventoryLevels(item, transactions, 12);
 * console.log(`Optimal reorder point: ${optimized.reorderPoint}`);
 * ```
 */
export function optimizeInventoryLevels(
  item: InventoryItem,
  transactions: InventoryTransaction[],
  analysisMonths: number = 6
): {
  averageDailyUsage: number;
  recommendedReorderPoint: number;
  recommendedReorderQuantity: number;
  recommendedSafetyStock: number;
  recommendedMaximumLevel: number;
  confidenceLevel: 'high' | 'medium' | 'low';
} {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - analysisMonths * 30 * 24 * 60 * 60 * 1000);

  const relevantTransactions = transactions.filter(t =>
    t.transactionType === 'issue' &&
    new Date(t.performedDate) >= cutoffDate
  );

  if (relevantTransactions.length < 5) {
    return {
      averageDailyUsage: 0,
      recommendedReorderPoint: item.minimumOrderQuantity || 10,
      recommendedReorderQuantity: item.minimumOrderQuantity || 10,
      recommendedSafetyStock: Math.ceil((item.minimumOrderQuantity || 10) * 0.2),
      recommendedMaximumLevel: (item.minimumOrderQuantity || 10) * 2,
      confidenceLevel: 'low',
    };
  }

  const totalIssued = relevantTransactions.reduce((sum, t) => sum + t.quantity, 0);
  const daysAnalyzed = (now.getTime() - cutoffDate.getTime()) / (1000 * 60 * 60 * 24);
  const averageDailyUsage = totalIssued / daysAnalyzed;

  const reorderCalc = calculateReorderPoint(
    averageDailyUsage,
    item.leadTimeDays,
    7 // 7 days safety stock
  );

  const confidenceLevel: 'high' | 'medium' | 'low' = relevantTransactions.length >= 30
    ? 'high'
    : relevantTransactions.length >= 10
    ? 'medium'
    : 'low';

  return {
    averageDailyUsage: Math.round(averageDailyUsage * 100) / 100,
    recommendedReorderPoint: reorderCalc.reorderPoint,
    recommendedReorderQuantity: reorderCalc.reorderQuantity,
    recommendedSafetyStock: reorderCalc.safetyStock,
    recommendedMaximumLevel: reorderCalc.maximumLevel,
    confidenceLevel,
  };
}

/**
 * Validates inventory consistency across locations
 *
 * @param {StockLevel[]} stockLevels - Stock levels across locations
 * @returns {object} Consistency check results
 *
 * @example
 * ```tsx
 * const check = validateInventoryConsistency(stockLevels);
 * if (!check.isConsistent) console.log(check.discrepancies);
 * ```
 */
export function validateInventoryConsistency(stockLevels: StockLevel[]): {
  isConsistent: boolean;
  discrepancies: string[];
  totalOnHand: number;
  totalAvailable: number;
  totalAllocated: number;
} {
  const discrepancies: string[] = [];
  let totalOnHand = 0;
  let totalAvailable = 0;
  let totalAllocated = 0;

  stockLevels.forEach(sl => {
    totalOnHand += sl.quantityOnHand;
    totalAvailable += sl.quantityAvailable;
    totalAllocated += sl.quantityAllocated;

    // Check if allocated + available = on hand
    if (sl.quantityAllocated + sl.quantityAvailable !== sl.quantityOnHand) {
      discrepancies.push(
        `Location ${sl.locationId}: On hand (${sl.quantityOnHand}) != Allocated (${sl.quantityAllocated}) + Available (${sl.quantityAvailable})`
      );
    }

    // Check for negative quantities
    if (sl.quantityOnHand < 0 || sl.quantityAvailable < 0 || sl.quantityAllocated < 0) {
      discrepancies.push(`Location ${sl.locationId}: Negative quantity detected`);
    }
  });

  // Check total consistency
  if (totalAllocated + totalAvailable !== totalOnHand) {
    discrepancies.push('Total quantities do not balance across locations');
  }

  return {
    isConsistent: discrepancies.length === 0,
    discrepancies,
    totalOnHand,
    totalAvailable,
    totalAllocated,
  };
}

// Export all functions
export default {
  useInventoryController,
  useBulkInventoryOperations,
  calculateInventoryHealth,
  optimizeInventoryLevels,
  validateInventoryConsistency,
};
