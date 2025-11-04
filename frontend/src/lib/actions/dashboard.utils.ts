/**
 * @fileoverview Dashboard Utilities Module
 * @module app/dashboard/utils
 * @category Dashboard - Utilities
 * @version 2.0.0
 *
 * Utility functions for dashboard data management.
 * Includes cache management and data refresh operations.
 */

'use server';

import { revalidatePath } from 'next/cache';

/**
 * Refresh Dashboard Data
 * Force refresh all dashboard data by invalidating caches
 *
 * @returns Promise<void>
 */
export async function refreshDashboardData(): Promise<void> {
  try {
    console.log('[Dashboard] Refreshing all dashboard data');

    // Revalidate dashboard path to refresh all cached data
    revalidatePath('/(dashboard)/dashboard');

    console.log('[Dashboard] Dashboard data refreshed successfully');

  } catch (error) {
    console.error('[Dashboard] Failed to refresh dashboard data:', error);
    throw error;
  }
}
