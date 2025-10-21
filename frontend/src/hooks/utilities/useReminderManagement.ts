/**
 * WF-COMP-142 | useReminderManagement.ts - React component or utility module
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
import { medicationsApi } from '../services/api';
import { useMedicationToast } from './useMedicationToast';

export interface UseReminderManagementReturn {
  markReminderCompleted: (reminderId: string) => Promise<void>;
  markReminderMissed: (reminderId: string) => Promise<void>;
  isUpdating: boolean;
}

/**
 * Hook for managing medication reminders
 * Handles marking reminders as completed or missed
 */
export const useReminderManagement = (): UseReminderManagementReturn => {
  const queryClient = useQueryClient();
  const toast = useMedicationToast();

  const updateReminderMutation = useMutation({
    mutationFn: async ({ reminderId, status }: { reminderId: string; status: 'COMPLETED' | 'MISSED' }) => {
      // Call the API to update reminder status
      // Note: This endpoint needs to be implemented in the backend
      const response = await medicationsApi.updateReminderStatus(reminderId, status);
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch reminders data
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });

      const message = variables.status === 'COMPLETED'
        ? 'Reminder marked as completed'
        : 'Reminder marked as missed';
      toast.showSuccess(message);
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update reminder';
      toast.showError(message);
      throw error;
    },
  });

  const markReminderCompleted = async (reminderId: string): Promise<void> => {
    await updateReminderMutation.mutateAsync({ reminderId, status: 'COMPLETED' });
  };

  const markReminderMissed = async (reminderId: string): Promise<void> => {
    await updateReminderMutation.mutateAsync({ reminderId, status: 'MISSED' });
  };

  return {
    markReminderCompleted,
    markReminderMissed,
    isUpdating: updateReminderMutation.isPending,
  };
};
