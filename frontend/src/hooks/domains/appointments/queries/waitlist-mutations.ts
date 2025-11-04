/**
 * WF-COMP-127 | waitlist-mutations.ts - Waitlist mutation hooks
 * Purpose: TanStack Query hooks for waitlist operations
 * Upstream: React, TanStack Query | Dependencies: @tanstack/react-query, @/services/api, react-hot-toast
 * Downstream: Components, forms | Called by: React component tree
 * Related: queries.ts, query-keys.ts, mutations.ts
 * Exports: Waitlist mutation hooks | Key Features: Cache invalidation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: User action → Mutation → Cache update → UI refresh
 * LLM Context: TanStack Query hooks for waitlist management
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import toast from 'react-hot-toast';
import { appointmentKeys } from './query-keys';

// =====================
// HOOKS - WAITLIST MUTATIONS
// =====================

/**
 * Add student to waitlist
 */
export function useAddToWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      studentId: string;
      nurseId?: string;
      type: string;
      reason: string;
      priority?: string;
      preferredDate?: string;
      duration?: number;
      notes?: string;
    }) => appointmentsApi.addToWaitlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.waitlist() });
      toast.success('Student added to waitlist');
    },
    onError: (error) => {
      toast.error('Failed to add student to waitlist');
      console.error('Add to waitlist error:', error);
    },
  });
}

/**
 * Remove student from waitlist
 */
export function useRemoveFromWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentsApi.removeFromWaitlist(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.waitlist() });
      toast.success('Student removed from waitlist');
    },
    onError: (error) => {
      toast.error('Failed to remove student from waitlist');
      console.error('Remove from waitlist error:', error);
    },
  });
}
