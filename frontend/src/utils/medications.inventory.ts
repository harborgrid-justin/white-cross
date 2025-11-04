/**
 * WF-COMP-344 | medications.inventory.ts - Inventory calculation utilities
 * Purpose: Total inventory, batch tracking, and stock analysis
 * Upstream: medications.types, medications.status | Dependencies: Types, status utilities
 * Downstream: Components, pages, operations module | Called by: Display and operations
 * Related: medications.status, medications.operations
 * Exports: Inventory calculation functions | Key Features: Batch tracking, stock analysis
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Inventory calculation → Display rendering
 * LLM Context: Inventory utilities module, part of medications utility refactoring
 */

import type { Medication, InventoryInfo } from './medications.types';
import { getExpirationStatus, getStockStatus } from './medications.status';

/**
 * Calculate total medication inventory
 */
export const calculateTotalInventory = (medication: Medication): InventoryInfo => {
  // Check if medication has inventory property (it might be optional in the type)
  const inventory = (medication as Record<string, unknown>).inventory as unknown[] || []

  if (!inventory || inventory.length === 0) {
    return { totalQuantity: 0, totalBatches: 0, nearExpiry: 0, expired: 0, lowStock: 0 }
  }

  let totalQuantity = 0
  let nearExpiry = 0
  let expired = 0
  let lowStock = 0

  inventory.forEach((item: unknown) => {
    const itemRecord = item as Record<string, unknown>;
    const quantity = typeof itemRecord.quantity === 'number' ? itemRecord.quantity : 0;
    totalQuantity += quantity;

    const expirationDate = typeof itemRecord.expirationDate === 'string' ? itemRecord.expirationDate : undefined;
    if (expirationDate) {
      const expirationStatus = getExpirationStatus(expirationDate);
      if (expirationStatus.status === 'expired') {
        expired++;
      } else if (expirationStatus.status === 'critical' || expirationStatus.status === 'warning') {
        nearExpiry++;
      }
    }

    const reorderLevel = typeof itemRecord.reorderLevel === 'number' ? itemRecord.reorderLevel : undefined;
    const stockStatus = getStockStatus(quantity, reorderLevel);
    if (stockStatus.status === 'critical' || stockStatus.status === 'low') {
      lowStock++;
    }
  })

  return {
    totalQuantity,
    totalBatches: inventory.length,
    nearExpiry,
    expired,
    lowStock
  }
}
