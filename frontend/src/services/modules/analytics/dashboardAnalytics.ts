/**
 * @fileoverview Dashboard Analytics API Module
 * @module services/modules/analytics/dashboardAnalytics
 * @category Services - Analytics
 *
 * Provides comprehensive dashboard data for nurses, administrators, and schools.
 * Supports real-time updates, customizable widgets, and role-specific metrics.
 *
 * ## Features
 * - Nurse dashboard with daily schedule and pending tasks
 * - Admin dashboard with system health and compliance metrics
 * - School dashboard with institution-level insights
 * - Customizable widget support
 * - Real-time data updates
 * - Date range filtering
 * - Intelligent caching for performance
 *
 * @example
 * ```typescript
 * const dashboardAnalytics = new DashboardAnalytics(apiClient);
 *
 * // Get nurse dashboard
 * const nurseDashboard = await dashboardAnalytics.getNurseDashboard('nurse-123', {
 *   includeWidgets: true,
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' }
 * });
 *
 * // Get admin dashboard
 * const adminDashboard = await dashboardAnalytics.getAdminDashboard({
 *   schoolId: 'school-123',
 *   scope: 'SCHOOL',
 *   includeWidgets: true
 * });
 *
 * // Get school dashboard
 * const schoolDashboard = await dashboardAnalytics.getSchoolDashboard('school-123');
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  NurseDashboard,
  AdminDashboard,
  SchoolDashboard,
  AnalyticsSummary,
  DateRangeFilter
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Dashboard Analytics API Service
 * Handles dashboard data for nurses, admins, and schools with caching
 */
export class DashboardAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get nurse dashboard data (comprehensive)
   * Includes today's schedule, pending tasks, alerts, and quick stats
   * @param nurseId - Optional nurse identifier
   * @param params - Additional dashboard parameters
   * @returns Nurse dashboard data
   */
  async getNurseDashboard(nurseId?: string, params?: {
    includeWidgets?: boolean;
    dateRange?: DateRangeFilter;
  }): Promise<NurseDashboard> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.NURSE_DASHBOARD, { nurseId, ...params });
    const cached = analyticsCache.get<NurseDashboard>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<NurseDashboard>>(
      '/analytics/dashboard/nurse',
      { params: { nurseId, ...params } }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.DASHBOARD);

    return data;
  }

  /**
   * Get admin dashboard data (comprehensive)
   * Includes system health, user activity, compliance, and budget overview
   * @param params - Dashboard query parameters
   * @returns Admin dashboard data
   */
  async getAdminDashboard(params?: {
    schoolId?: string;
    scope?: 'DISTRICT' | 'SCHOOL' | 'REGION';
    includeWidgets?: boolean;
  }): Promise<AdminDashboard> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.ADMIN_DASHBOARD, params);
    const cached = analyticsCache.get<AdminDashboard>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<AdminDashboard>>(
      '/analytics/dashboard/admin',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.DASHBOARD);

    return data;
  }

  /**
   * Get school-specific dashboard data
   * Comprehensive school metrics, trends, and alerts
   * @param schoolId - School identifier
   * @param params - Additional dashboard parameters
   * @returns School dashboard data
   * @throws Error if schoolId is not provided
   */
  async getSchoolDashboard(schoolId: string, params?: {
    includeWidgets?: boolean;
    dateRange?: DateRangeFilter;
  }): Promise<SchoolDashboard> {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    const cacheKey = analyticsCache.buildKey(CacheKeys.SCHOOL_DASHBOARD, { schoolId, ...params });
    const cached = analyticsCache.get<SchoolDashboard>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<SchoolDashboard>>(
      `/analytics/dashboard/school/${schoolId}`,
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.DASHBOARD);

    return data;
  }

  /**
   * Get comprehensive analytics summary
   * @param params - Query parameters for summary
   * @returns Analytics summary data
   */
  async getSummary(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<AnalyticsSummary> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.SUMMARY, params);
    const cached = analyticsCache.get<AnalyticsSummary>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<AnalyticsSummary>>(
      '/analytics/summary',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.SUMMARY);

    return data;
  }
}

/**
 * Factory function to create Dashboard Analytics instance
 * @param client - ApiClient instance
 * @returns Configured DashboardAnalytics instance
 */
export function createDashboardAnalytics(client: ApiClient): DashboardAnalytics {
  return new DashboardAnalytics(client);
}
