/**
 * WF-COMP-127 | availability-mutations.ts - Availability mutation hooks
 * Purpose: TanStack Query hooks for nurse availability mutations
 * Upstream: React, TanStack Query | Dependencies: @tanstack/react-query, @/services/api, react-hot-toast
 * Downstream: Components, forms | Called by: React component tree
 * Related: queries.ts, query-keys.ts, mutations.ts
 * Exports: Availability mutation hooks | Key Features: Cache invalidation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: User action → Mutation → Cache update → UI refresh
 * LLM Context: TanStack Query hooks for nurse availability management
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import type { NurseAvailabilityData } from '@/types';
import toast from 'react-hot-toast';
import { appointmentKeys } from './query-keys';

// =====================
// HOOKS - AVAILABILITY MUTATIONS
// =====================

/**
 * Set nurse availability
 */
export function useSetAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NurseAvailabilityData) => appointmentsApi.setAvailability(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.nurseAvailability(data.availability.nurseId)
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.availability(data.availability.nurseId)
      });

      toast.success('Availability set successfully');
    },
    onError: (error) => {
      toast.error('Failed to set availability');
      console.error('Set availability error:', error);
    },
  });
}

/**
 * Update nurse availability
 */
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NurseAvailabilityData> }) =>
      appointmentsApi.updateAvailability(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.nurseAvailability(data.availability.nurseId)
      });

      toast.success('Availability updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update availability');
      console.error('Update availability error:', error);
    },
  });
}

/**
 * Delete nurse availability
 */
export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.deleteAvailability(id),
    onSuccess: () => {
      // Invalidate all availability queries since we don't have nurseId in response
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });

      toast.success('Availability deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete availability');
      console.error('Delete availability error:', error);
    },
  });
}
