/**
 * Inventory Mutation Hooks
 *
 * Provides hooks for mutating inventory data (stock adjustments, etc.).
 * Handles write operations with proper loading states and error handling.
 *
 * @module hooks/domains/inventory/useInventory.mutations
 */

import { useState } from 'react';
import { inventoryApi } from '@/services';
import toast from 'react-hot-toast';

/**
 * Hook for performing manual stock adjustments.
 *
 * Used for correcting inventory discrepancies, cycle count adjustments,
 * or recording stock changes not captured by normal transactions.
 *
 * Validation Rules:
 * - Quantity can be positive (increase) or negative (decrease)
 * - Reason is required for audit trail
 * - Adjustment cannot result in negative stock
 *
 * @returns Object containing adjustStock mutation function and loading state
 *
 * @example
 * ```tsx
 * const { adjustStock, loading } = useStockAdjustment();
 *
 * const handleCycleCount = async () => {
 *   const physicalCount = 45;
 *   const systemCount = 50;
 *   const difference = physicalCount - systemCount; // -5
 *
 *   try {
 *     await adjustStock(itemId, difference, 'Cycle count adjustment - physical count variance');
 *     console.log('Stock adjusted successfully');
 *   } catch (error) {
 *     console.error('Failed to adjust stock:', error);
 *   }
 * };
 *
 * // Increase stock
 * await adjustStock('item-123', 10, 'Found additional units in storage');
 *
 * // Decrease stock
 * await adjustStock('item-123', -5, 'Damaged units removed from inventory');
 * ```
 */
export function useStockAdjustment() {
  const [loading, setLoading] = useState(false);

  /**
   * Adjusts stock quantity for an inventory item.
   *
   * @param {string} itemId - Inventory item ID
   * @param {number} quantity - Adjustment amount (positive to increase, negative to decrease)
   * @param {string} reason - Reason for adjustment (required for audit trail)
   * @returns Promise resolving to adjustment response data
   * @throws {Error} If adjustment fails or would result in negative stock
   */
  const adjustStock = async (itemId: string, quantity: number, reason: string) => {
    try {
      setLoading(true);
      const response = await inventoryApi.adjustStock(itemId, quantity, reason);

      if (response.success) {
        toast.success(`Stock adjusted successfully: ${quantity > 0 ? '+' : ''}${quantity}`);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to adjust stock');
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to adjust stock');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    adjustStock,
    loading
  };
}
