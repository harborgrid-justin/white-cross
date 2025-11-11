/**
 * @fileoverview Dashboard Statistics Module
 * @module app/dashboard/statistics
 * @category Dashboard - Statistics
 * @version 2.0.0
 *
 * Handles fetching and processing dashboard statistics.
 * Integrates with backend API to retrieve core metrics.
 */

'use server';

import { serverGet } from '@/lib/api/nextjs-client';
import type { ApiResponse } from '@/types';
import type { DashboardStats, DashboardFilters } from './dashboard.types';

/**
 * Get Dashboard Statistics
 * Retrieves core dashboard metrics with caching
 *
 * @param filters - Optional filters for statistics
 * @returns Promise<DashboardStats>
 */
export async function getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
  try {
    console.log('[Dashboard] Loading dashboard statistics from backend with filters:', filters);

    const wrappedResponse = await serverGet<ApiResponse<any>>('/api/v1/dashboard/stats', undefined, {
      cache: 'no-store', // Fresh data for dashboard
    });

    const backendStats = wrappedResponse?.data || {};

    // Map backend response to frontend interface
    const stats: DashboardStats = {
      totalStudents: backendStats.totalStudents || 0,
      activeStudents: backendStats.activeStudents || 0,
      healthAlerts: backendStats.criticalHealthAlerts || 0,
      pendingMedications: backendStats.activeMedications || 0,
      appointmentsToday: backendStats.todaysAppointments || 0,
      completedScreenings: backendStats.completedScreenings || 0,
      immunizationCompliance: backendStats.immunizationCompliance || 0,
      emergencyContacts: backendStats.emergencyContacts || 0
    };

    console.log('[Dashboard] Dashboard statistics loaded successfully from backend');
    return stats;

  } catch (error) {
    console.error('[Dashboard] Failed to load dashboard statistics:', error);

    // Return safe defaults on error
    return {
      totalStudents: 0,
      activeStudents: 0,
      healthAlerts: 0,
      pendingMedications: 0,
      appointmentsToday: 0,
      completedScreenings: 0,
      immunizationCompliance: 0,
      emergencyContacts: 0
    };
  }
}
