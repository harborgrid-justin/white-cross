/**
 * WF-COMP-134 | useInventoryManagement.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/api, ./useMedicationToast | Dependencies: @tanstack/react-query, ../services/api, ./useMedicationToast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '@/services';
import { useMedicationToast } from '../utilities/useMedicationToast';

export interface UpdateInventoryData {
  inventoryId: string;
  quantity: number;
  batchNumber: string;
  expirationDate: string;
  supplier?: string;
}

export interface UseInventoryManagementReturn {
  updateInventory: (data: UpdateInventoryData) => Promise<void>;
  isUpdating: boolean;
}

/**
 * Hook for managing medication inventory operations
 * Handles stock updates and integrates with the API
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
