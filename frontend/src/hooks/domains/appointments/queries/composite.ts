/**
 * WF-COMP-127 | composite.ts - Composite appointment hooks
 * Purpose: Combined hooks for complex appointment operations
 * Upstream: React, queries.ts | Dependencies: queries.ts
 * Downstream: Dashboard components, pages | Called by: Complex views
 * Related: queries.ts, mutations.ts
 * Exports: Composite hooks | Key Features: Parallel data fetching
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Parallel queries → Combined data rendering
 * LLM Context: Composite hooks that combine multiple queries for dashboard views
 */

import type {
  AppointmentFilters,
  WaitlistFilters,
} from '@/types';
import {
  useAppointments,
  useAppointmentStats,
  useWaitlist,
} from './queries';

// =====================
// COMPOSITE HOOKS
// =====================

/**
 * Combined hook for appointment management dashboard
 * Fetches appointments, statistics, and waitlist in parallel
 */
export function useAppointmentDashboard(
  filters?: AppointmentFilters,
  statsFilters?: { nurseId?: string; dateFrom?: string; dateTo?: string },
  waitlistFilters?: WaitlistFilters
) {
  const appointments = useAppointments(filters);
  const statistics = useAppointmentStats(statsFilters);
  const waitlist = useWaitlist(waitlistFilters);

  return {
    appointments,
    statistics,
    waitlist,
    isLoading: appointments.isLoading || statistics.isLoading || waitlist.isLoading,
    isError: appointments.isError || statistics.isError || waitlist.isError,
    refetchAll: () => {
      appointments.refetch();
      statistics.refetch();
      waitlist.refetch();
    },
  };
}
