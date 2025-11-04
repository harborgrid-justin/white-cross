/**
 * WF-COMP-127 | query-keys.ts - Query key factory
 * Purpose: Centralized query key factory for appointment cache management
 * Upstream: TanStack Query | Dependencies: None
 * Downstream: Query hooks, mutations | Called by: All appointment hooks
 * Related: useAppointments queries and mutations
 * Exports: appointmentKeys | Key Features: Query key factory pattern
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Query key generation → Cache management
 * LLM Context: Query key factory for TanStack Query cache management
 */

import type {
  AppointmentFilters,
  WaitlistFilters,
} from '@/types';

// =====================
// QUERY KEYS
// =====================
// Centralized query key factory for better cache management
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters?: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  statistics: (filters?: { nurseId?: string; dateFrom?: string; dateTo?: string }) =>
    [...appointmentKeys.all, 'statistics', filters] as const,
  upcoming: (nurseId: string, limit?: number) =>
    [...appointmentKeys.all, 'upcoming', nurseId, limit] as const,
  waitlist: (filters?: WaitlistFilters) =>
    [...appointmentKeys.all, 'waitlist', filters] as const,
  availability: (nurseId: string, date?: string, duration?: number) =>
    [...appointmentKeys.all, 'availability', nurseId, date, duration] as const,
  nurseAvailability: (nurseId: string, date?: string) =>
    [...appointmentKeys.all, 'nurseAvailability', nurseId, date] as const,
};
