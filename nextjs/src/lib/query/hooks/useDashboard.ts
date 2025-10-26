/**
 * TanStack Query Hooks for Dashboard Domain
 *
 * Provides React Query hooks for:
 * - Dashboard statistics
 * - Recent activity
 * - Upcoming appointments
 * - Alerts and notifications
 *
 * @module lib/query/hooks/useDashboard
 * @version 1.0.0
 */

'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ==========================================
// TYPES
// ==========================================

export interface DashboardStats {
  totalStudents: number;
  activeAppointments: number;
  pendingIncidents: number;
  healthRecordsToday: number;
  medicationsAdministered: number;
  emergencyContacts: number;
}

export interface RecentActivity {
  id: string;
  type: 'APPOINTMENT' | 'MEDICATION' | 'INCIDENT' | 'HEALTH_RECORD';
  description: string;
  timestamp: string;
  studentName?: string;
  studentId?: string;
}

export interface UpcomingAppointment {
  id: string;
  studentId: string;
  studentName: string;
  appointmentType: string;
  scheduledTime: string;
  notes?: string;
}

export interface DashboardAlert {
  id: string;
  type: 'WARNING' | 'ERROR' | 'INFO';
  message: string;
  timestamp: string;
  actionRequired: boolean;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  upcomingAppointments: UpcomingAppointment[];
  alerts: DashboardAlert[];
}

// ==========================================
// QUERY KEYS
// ==========================================

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
  appointments: () => [...dashboardKeys.all, 'appointments'] as const,
  alerts: () => [...dashboardKeys.all, 'alerts'] as const,
  full: () => [...dashboardKeys.all, 'full'] as const,
};

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Fetch dashboard statistics
 */
export function useDashboardStats(
  options?: Omit<UseQueryOptions<DashboardStats>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      return apiClient.get<DashboardStats>('/dashboard/stats');
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    meta: {
      cacheTags: ['dashboard', 'stats'],
      errorMessage: 'Failed to load dashboard statistics',
    },
    ...options,
  });
}

/**
 * Fetch recent activity
 */
export function useRecentActivity(
  limit: number = 10,
  options?: Omit<UseQueryOptions<RecentActivity[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...dashboardKeys.activity(), { limit }],
    queryFn: async () => {
      return apiClient.get<RecentActivity[]>('/dashboard/activity', { limit });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      cacheTags: ['dashboard', 'activity'],
      errorMessage: 'Failed to load recent activity',
    },
    ...options,
  });
}

/**
 * Fetch upcoming appointments
 */
export function useUpcomingAppointments(
  limit: number = 5,
  options?: Omit<UseQueryOptions<UpcomingAppointment[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...dashboardKeys.appointments(), { limit }],
    queryFn: async () => {
      return apiClient.get<UpcomingAppointment[]>('/dashboard/upcoming-appointments', { limit });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    meta: {
      cacheTags: ['dashboard', 'appointments'],
      errorMessage: 'Failed to load upcoming appointments',
    },
    ...options,
  });
}

/**
 * Fetch dashboard alerts
 */
export function useDashboardAlerts(
  options?: Omit<UseQueryOptions<DashboardAlert[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.alerts(),
    queryFn: async () => {
      return apiClient.get<DashboardAlert[]>('/dashboard/alerts');
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Auto-refetch every 2 minutes
    meta: {
      cacheTags: ['dashboard', 'alerts'],
      errorMessage: 'Failed to load alerts',
    },
    ...options,
  });
}

/**
 * Fetch all dashboard data in one request
 */
export function useDashboard(
  options?: Omit<UseQueryOptions<DashboardData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.full(),
    queryFn: async () => {
      return apiClient.get<DashboardData>('/dashboard');
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    meta: {
      cacheTags: ['dashboard'],
      errorMessage: 'Failed to load dashboard',
    },
    ...options,
  });
}
