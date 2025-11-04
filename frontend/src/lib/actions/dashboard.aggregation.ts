/**
 * @fileoverview Dashboard Data Aggregation Module
 * @module app/dashboard/aggregation
 * @category Dashboard - Aggregation
 * @version 2.0.0
 *
 * Combines multiple dashboard data sources into a single optimized call.
 * Uses parallel execution for improved performance.
 */

'use server';

import { getDashboardStats } from './dashboard.statistics';
import { getHealthAlerts } from './dashboard.alerts';
import { getRecentActivities } from './dashboard.activities';
import { getSystemStatus } from './dashboard.system';
import type { DashboardFilters, DashboardStats, HealthAlert, RecentActivity, SystemStatus } from './dashboard.types';

/**
 * Get Combined Dashboard Data
 * Retrieves all dashboard data in a single optimized call
 *
 * @param filters - Dashboard filtering options
 * @returns Promise<{stats: DashboardStats, alerts: HealthAlert[], activities: RecentActivity[], systemStatus: SystemStatus}>
 */
export const getDashboardData = async (filters: DashboardFilters = {}) => {
  try {
    console.log('[Dashboard] Loading combined dashboard data');

    // Execute all dashboard data fetches in parallel for performance
    const [stats, alerts, activities, systemStatus] = await Promise.all([
      getDashboardStats(filters),
      getHealthAlerts(filters),
      getRecentActivities(filters, 10),
      getSystemStatus()
    ]);

    console.log('[Dashboard] Combined dashboard data loaded successfully');

    // Ensure data is fully serializable by removing any non-serializable properties
    const serializedData = {
      stats: JSON.parse(JSON.stringify(stats)),
      alerts: JSON.parse(JSON.stringify(alerts)),
      activities: JSON.parse(JSON.stringify(activities)),
      systemStatus: JSON.parse(JSON.stringify(systemStatus))
    };

    return serializedData;

  } catch (error) {
    console.error('[Dashboard] Failed to load combined dashboard data:', error);

    // Return safe defaults on error
    return {
      stats: JSON.parse(JSON.stringify(await getDashboardStats({}))),
      alerts: [],
      activities: [],
      systemStatus: JSON.parse(JSON.stringify(await getSystemStatus()))
    };
  }
};
