import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '../services/api';
import { useMedicationToast } from './useMedicationToast';

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
