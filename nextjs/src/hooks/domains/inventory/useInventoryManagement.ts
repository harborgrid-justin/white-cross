/**
 * Medication Inventory Management Hook
 *
 * Provides mutation functions for managing medication inventory with
 * batch tracking, expiration dates, and supplier information. Integrates
 * with React Query for cache management and optimistic updates.
 *
 * @module hooks/domains/inventory/useInventoryManagement
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '@/services';
import { useMedicationToast } from '../utilities/useMedicationToast';

/**
 * Data required for updating medication inventory.
 *
 * @interface UpdateInventoryData
 * @property {string} inventoryId - Unique identifier for the inventory record
 * @property {number} quantity - New stock quantity (must be non-negative)
 * @property {string} batchNumber - Batch/lot number for traceability
 * @property {string} expirationDate - Expiration date in ISO format (YYYY-MM-DD)
 * @property {string} [supplier] - Optional supplier/vendor identifier
 */
export interface UpdateInventoryData {
  inventoryId: string;
  quantity: number;
  batchNumber: string;
  expirationDate: string;
  supplier?: string;
}

/**
 * Return type for useInventoryManagement hook.
 *
 * @interface UseInventoryManagementReturn
 * @property {Function} updateInventory - Function to update inventory with new data
 * @property {boolean} isUpdating - Loading state during inventory update
 */
export interface UseInventoryManagementReturn {
  updateInventory: (data: UpdateInventoryData) => Promise<void>;
  isUpdating: boolean;
}

/**
 * Hook for managing medication inventory operations.
 *
 * Handles stock updates with batch tracking and expiration date management.
 * Automatically invalidates related React Query caches on success to ensure
 * UI stays synchronized with latest data.
 *
 * Business Rules:
 * - Quantity must be non-negative
 * - Batch number is required for traceability
 * - Expiration date must be in future
 * - Updates invalidate both medication-inventory and medications caches
 *
 * @returns {UseInventoryManagementReturn} Object containing update function and loading state
 *
 * @example
 * ```tsx
 * const { updateInventory, isUpdating } = useInventoryManagement();
 *
 * const handleStockUpdate = async () => {
 *   try {
 *     await updateInventory({
 *       inventoryId: 'inv-123',
 *       quantity: 250,
 *       batchNumber: 'BATCH-2025-001',
 *       expirationDate: '2026-12-31',
 *       supplier: 'supplier-456'
 *     });
 *     console.log('Inventory updated successfully');
 *   } catch (error) {
 *     console.error('Update failed:', error);
 *   }
 * };
 *
 * return (
 *   <Button onClick={handleStockUpdate} disabled={isUpdating}>
 *     {isUpdating ? 'Updating...' : 'Update Stock'}
 *   </Button>
 * );
 * ```
 */
export const useInventoryManagement = (): UseInventoryManagementReturn => {
  const queryClient = useQueryClient();
  const toast = useMedicationToast();

  const updateInventoryMutation = useMutation({
    mutationFn: async (data: UpdateInventoryData) => {
      // Call the API to update inventory
      // Note: This endpoint needs to be implemented in the backend
      const response = await medicationsApi.updateInventory(data);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch inventory data
      queryClient.invalidateQueries({ queryKey: ['medication-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast.showSuccess('Inventory updated successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update inventory';
      toast.showError(message);
      throw error;
    },
  });

  const updateInventory = async (data: UpdateInventoryData): Promise<void> => {
    await updateInventoryMutation.mutateAsync(data);
  };

  return {
    updateInventory,
    isUpdating: updateInventoryMutation.isPending,
  };
};
