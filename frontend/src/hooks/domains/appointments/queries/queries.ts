/**
 * WF-COMP-127 | queries.ts - Appointment query hooks
 * Purpose: TanStack Query hooks for fetching appointment data
 * Upstream: React, TanStack Query | Dependencies: @tanstack/react-query, @/services/api
 * Downstream: Components, pages | Called by: React component tree
 * Related: mutations.ts, query-keys.ts
 * Exports: Query hooks | Key Features: Data fetching with caching
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query execution → Data rendering
 * LLM Context: TanStack Query hooks for appointment data fetching
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { appointmentsApi } from '@/services/api';
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatistics,
  PaginatedResponse,
  WaitlistEntryData,
  WaitlistFilters,
  AvailabilitySlot,
  NurseAvailability,
} from '@/types';
import { appointmentKeys } from './query-keys';

// =====================
// HOOKS - QUERIES
// =====================

/**
 * Get all appointments with filtering and pagination
 * Uses aggressive caching with 5-minute stale time
 */
export function useAppointments(
  filters?: AppointmentFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<Appointment>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    ...options,
  });
}

/**
 * Get upcoming appointments for a specific nurse
 */
export function useUpcomingAppointments(
  nurseId: string,
  limit?: number,
  options?: Omit<UseQueryOptions<{ appointments: Appointment[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.upcoming(nurseId, limit),
    queryFn: () => appointmentsApi.getUpcoming(nurseId, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for upcoming appointments
    enabled: !!nurseId,
    ...options,
  });
}

/**
 * Get appointment statistics with caching
 */
export function useAppointmentStats(
  filters?: { nurseId?: string; dateFrom?: string; dateTo?: string },
  options?: Omit<UseQueryOptions<AppointmentStatistics>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.statistics(filters),
    queryFn: () => appointmentsApi.getStatistics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Get appointment waitlist
 */
export function useWaitlist(
  filters?: WaitlistFilters,
  options?: Omit<UseQueryOptions<{ waitlist: WaitlistEntryData[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.waitlist(filters),
    queryFn: () => appointmentsApi.getWaitlist(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
}

/**
 * Get available time slots for scheduling
 */
export function useAvailability(
  nurseId: string,
  date?: string,
  duration?: number,
  options?: Omit<UseQueryOptions<{ slots: AvailabilitySlot[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.availability(nurseId, date, duration),
    queryFn: () => appointmentsApi.getAvailability(nurseId, date, duration),
    staleTime: 1 * 60 * 1000, // 1 minute - short stale time for availability
    enabled: !!nurseId,
    ...options,
  });
}

/**
 * Get nurse availability schedule
 */
export function useNurseAvailability(
  nurseId: string,
  date?: string,
  options?: Omit<UseQueryOptions<{ availability: NurseAvailability[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentKeys.nurseAvailability(nurseId, date),
    queryFn: () => appointmentsApi.getNurseAvailability(nurseId, date),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!nurseId,
    ...options,
  });
}
