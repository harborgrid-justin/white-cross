/**
 * WF-COMP-127 | calendar-mutations.ts - Calendar export mutation hooks
 * Purpose: TanStack Query hooks for calendar export operations
 * Upstream: React, TanStack Query | Dependencies: @tanstack/react-query, @/services/api, react-hot-toast
 * Downstream: Components | Called by: React component tree
 * Related: queries.ts, query-keys.ts, mutations.ts
 * Exports: Calendar mutation hooks | Key Features: File download
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: User action → Mutation → File download
 * LLM Context: TanStack Query hooks for calendar export operations
 */

import { useMutation } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import toast from 'react-hot-toast';

// =====================
// HOOKS - CALENDAR MUTATIONS
// =====================

/**
 * Export calendar
 * Returns a blob for download
 */
export function useExportCalendar() {
  return useMutation({
    mutationFn: ({ nurseId, dateFrom, dateTo }: {
      nurseId: string;
      dateFrom?: string;
      dateTo?: string
    }) => appointmentsApi.exportCalendar(nurseId, dateFrom, dateTo),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-${new Date().toISOString().split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Calendar exported successfully');
    },
    onError: (error) => {
      toast.error('Failed to export calendar');
      console.error('Export calendar error:', error);
    },
  });
}
