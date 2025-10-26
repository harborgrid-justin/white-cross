/**
 * WF-COMP-275 | dashboardApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../../types/dashboard | Dependencies: ../config/apiConfig, zod, ../../types/dashboard
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Dashboard API Module
 *
 * Provides API methods for dashboard statistics, activity feeds, and analytics.
 * Implements enterprise-grade caching, error handling, and type safety.
 *
 * Features:
 * - Real-time dashboard statistics with trend analysis
 * - Recent activity tracking across all modules
 * - Upcoming appointments with priority classification
 * - Chart data for time-series visualizations
 * - HIPAA-compliant data aggregation
 * - Optimized caching for performance
 *
 * Backend Routes Mapping:
 * - GET /api/dashboard/stats → getDashboardStats()
 * - GET /api/dashboard/recent-activities → getRecentActivities()
 * - GET /api/dashboard/upcoming-appointments → getUpcomingAppointments()
 * - GET /api/dashboard/chart-data → getChartData()
 *
 * @module dashboardApi
 * @requires apiInstance from config/apiConfig
 * @requires zod for runtime validation
 */

import type { ApiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../../constants/api';
import { z } from 'zod';
import { createApiError, createValidationError } from '../core/errors';
import {
  DashboardStats,
  DashboardRecentActivity,
  DashboardUpcomingAppointment,
  DashboardChartData,
  RecentActivitiesParams,
  UpcomingAppointmentsParams,
  ChartDataParams,
  DashboardStatsResponse,
  RecentActivitiesResponse,
  UpcomingAppointmentsResponse,
  ChartDataResponse,
  HealthAlert,
  QuickAction,
  CompleteDashboardData,
} from '../../types/dashboard';

/**
 * Backend API response wrapper matching Hapi response structure
 * @internal
 */
interface BackendApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
}

/**
 * Validation Schemas
 *
 * Runtime validation using Zod to ensure type safety and data integrity
 * at the API boundary. Prevents malformed data from propagating through
 * the application.
 */

/**
 * Schema for recent activities query parameters
 */
const recentActivitiesParamsSchema = z.object({
  limit: z.number().int().min(1).max(20).optional(),
});

/**
 * Schema for upcoming appointments query parameters
 */
const upcomingAppointmentsParamsSchema = z.object({
  limit: z.number().int().min(1).max(20).optional(),
});

/**
 * Schema for chart data query parameters
 */
const chartDataParamsSchema = z.object({
  period: z.enum(['week', 'month', 'year']).optional(),
});

/**
 * DashboardApi Class
 *
 * Singleton service class providing all dashboard-related API operations.
 * Implements enterprise patterns:
 * - Centralized error handling with detailed error messages
 * - Input validation with Zod schemas
 * - Type-safe responses aligned with backend interfaces
 * - RESTful API conventions
 * - Proper HTTP status code handling
 */
export class DashboardApi {
  constructor(private readonly client: ApiClient) {}
  /**
   * Get comprehensive dashboard statistics with trend analysis
   *
   * Retrieves key platform metrics including:
   * - Total active students
   * - Active medication prescriptions
   * - Today's scheduled appointments
   * - Pending incident reports requiring follow-up
   * - Medications due for administration today
   * - Critical health alerts (severe/life-threatening allergies)
   * - Recent activity counts
   * - Month-over-month trend comparisons
   *
   * Backend implements 5-minute caching for performance optimization.
   * Data is aggregated from multiple tables with parallel query execution.
   *
   * @returns {Promise<DashboardStats>} Complete dashboard statistics with trends
   * @throws {Error} If statistics retrieval fails or response is invalid
   *
   * @example
   * ```typescript
   * const stats = await dashboardApi.getDashboardStats();
   * console.log(`Total Students: ${stats.totalStudents}`);
   * console.log(`Student Trend: ${stats.studentTrend.change} (${stats.studentTrend.changeType})`);
   * ```
   *
   * Backend Route: GET /api/dashboard/stats
   * Backend Method: DashboardService.getDashboardStats()
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await this.client.get<BackendApiResponse<DashboardStats>>(
        API_ENDPOINTS.DASHBOARD.STATS
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch dashboard statistics');
      }

      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message
        || error.message
        || 'Failed to fetch dashboard statistics';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get recent activities across all modules for dashboard feed
   *
   * Aggregates and formats recent platform activity from:
   * - Medication administration logs (last 3)
   * - Incident reports (last 2)
   * - Upcoming appointments (next 2)
   *
   * Activities include:
   * - Relative timestamps (e.g., "2 hours ago", "in 30 minutes")
   * - Status indicators (completed, pending, warning, upcoming)
   * - Student and action context
   * - Type-specific formatting
   *
   * Results are sorted by most recent/upcoming and limited to specified count.
   *
   * @param {RecentActivitiesParams} params - Query parameters
   * @param {number} params.limit - Maximum activities to return (1-20, default: 5)
   * @returns {Promise<DashboardRecentActivity[]>} Array of formatted recent activities
   * @throws {Error} If validation fails or activities retrieval fails
   *
   * @example
   * ```typescript
   * const activities = await dashboardApi.getRecentActivities({ limit: 10 });
   * activities.forEach(activity => {
   *   console.log(`[${activity.type}] ${activity.message} - ${activity.time}`);
   * });
   * ```
   *
   * Backend Route: GET /api/dashboard/recent-activities?limit=5
   * Backend Method: DashboardService.getRecentActivities()
   */
  async getRecentActivities(
    params: RecentActivitiesParams = {}
  ): Promise<DashboardRecentActivity[]> {
    try {
      // Validate input parameters
      recentActivitiesParamsSchema.parse(params);

      const queryParams = new URLSearchParams();
      if (params.limit !== undefined) {
        queryParams.append('limit', String(params.limit));
      }

      const response = await this.client.get<BackendApiResponse<{ activities: DashboardRecentActivity[] }>>(
        `${API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch recent activities');
      }

      return response.data.data.activities;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      const errorMessage = error.response?.data?.error?.message
        || error.message
        || 'Failed to fetch recent activities';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get upcoming appointments with priority classification
   *
   * Retrieves scheduled appointments sorted by time with:
   * - Priority levels based on appointment type:
   *   - High: Medication administration, Emergency
   *   - Medium: Default priority
   *   - Low: Routine checkups
   * - Formatted time strings (e.g., "2:30 PM")
   * - Student information for quick reference
   * - Formatted appointment types (e.g., "Medication Administration")
   *
   * Only includes appointments with status SCHEDULED or IN_PROGRESS.
   *
   * @param {UpcomingAppointmentsParams} params - Query parameters
   * @param {number} params.limit - Maximum appointments to return (1-20, default: 5)
   * @returns {Promise<DashboardUpcomingAppointment[]>} Array of prioritized upcoming appointments
   * @throws {Error} If validation fails or appointments retrieval fails
   *
   * @example
   * ```typescript
   * const appointments = await dashboardApi.getUpcomingAppointments({ limit: 10 });
   * const highPriority = appointments.filter(apt => apt.priority === 'high');
   * ```
   *
   * Backend Route: GET /api/dashboard/upcoming-appointments?limit=5
   * Backend Method: DashboardService.getUpcomingAppointments()
   */
  async getUpcomingAppointments(
    params: UpcomingAppointmentsParams = {}
  ): Promise<DashboardUpcomingAppointment[]> {
    try {
      // Validate input parameters
      upcomingAppointmentsParamsSchema.parse(params);

      const queryParams = new URLSearchParams();
      if (params.limit !== undefined) {
        queryParams.append('limit', String(params.limit));
      }

      const response = await this.client.get<BackendApiResponse<{ appointments: DashboardUpcomingAppointment[] }>>(
        `${API_ENDPOINTS.DASHBOARD.UPCOMING_APPOINTMENTS}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch upcoming appointments');
      }

      return response.data.data.appointments;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      const errorMessage = error.response?.data?.error?.message
        || error.message
        || 'Failed to fetch upcoming appointments';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get chart data for dashboard visualizations over specified time period
   *
   * Generates time-series data for multiple chart widgets:
   * - Student enrollment trends (count by date)
   * - Medication administration frequency (count by date)
   * - Incident report frequency (count by date)
   * - Appointment scheduling patterns (count by date)
   *
   * Data aggregation periods:
   * - 'week': Last 7 days with date labels (e.g., "Jan 15")
   * - 'month': Last 30 days with date labels (e.g., "Jan 15")
   * - 'year': Last 12 months with month labels (e.g., "Jan")
   *
   * All data points include:
   * - Formatted date/label for x-axis
   * - Numeric value for y-axis
   * - Optional label for tooltips
   *
   * @param {ChartDataParams} params - Query parameters
   * @param {string} params.period - Time period ('week' | 'month' | 'year', default: 'week')
   * @returns {Promise<DashboardChartData>} Chart data sets for all visualizations
   * @throws {Error} If validation fails or chart data retrieval fails
   *
   * @example
   * ```typescript
   * const chartData = await dashboardApi.getChartData({ period: 'month' });
   * renderLineChart(chartData.enrollmentTrend);
   * renderBarChart(chartData.medicationAdministration);
   * ```
   *
   * Backend Route: GET /api/dashboard/chart-data?period=week
   * Backend Method: DashboardService.getChartData()
   */
  async getChartData(params: ChartDataParams = {}): Promise<DashboardChartData> {
    try {
      // Validate input parameters
      chartDataParamsSchema.parse(params);

      const queryParams = new URLSearchParams();
      if (params.period) {
        queryParams.append('period', params.period);
      }

      const response = await this.client.get<BackendApiResponse<DashboardChartData>>(
        `${API_ENDPOINTS.DASHBOARD.CHART_DATA}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch chart data');
      }

      return response.data.data;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      const errorMessage = error.response?.data?.error?.message
        || error.message
        || 'Failed to fetch chart data';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get complete dashboard data in a single request
   *
   * Convenience method that fetches all dashboard data with parallel requests
   * for optimal performance. Use this when loading the dashboard page initially
   * to minimize sequential API calls.
   *
   * Executes in parallel:
   * - Dashboard statistics
   * - Recent activities (limit: 5)
   * - Upcoming appointments (limit: 5)
   *
   * @param {Object} options - Fetch options
   * @param {number} options.activityLimit - Limit for recent activities (default: 5)
   * @param {number} options.appointmentLimit - Limit for upcoming appointments (default: 5)
   * @returns {Promise<Partial<CompleteDashboardData>>} Aggregated dashboard data
   * @throws {Error} If any request fails (uses partial data on individual failures)
   *
   * @example
   * ```typescript
   * const dashboardData = await dashboardApi.getCompleteDashboardData({
   *   activityLimit: 10,
   *   appointmentLimit: 10
   * });
   *
   * if (dashboardData.stats) {
   *   renderStats(dashboardData.stats);
   * }
   * if (dashboardData.recentActivities) {
   *   renderActivities(dashboardData.recentActivities);
   * }
   * ```
   */
  async getCompleteDashboardData(
    options: {
      activityLimit?: number;
      appointmentLimit?: number;
    } = {}
  ): Promise<Partial<CompleteDashboardData>> {
    const {
      activityLimit = 5,
      appointmentLimit = 5,
    } = options;

    try {
      // Execute all requests in parallel for optimal performance
      const [stats, recentActivities, upcomingAppointments] = await Promise.allSettled([
        this.getDashboardStats(),
        this.getRecentActivities({ limit: activityLimit }),
        this.getUpcomingAppointments({ limit: appointmentLimit }),
      ]);

      // Construct result with partial data (graceful degradation)
      const result: Partial<CompleteDashboardData> = {};

      if (stats.status === 'fulfilled') {
        result.stats = stats.value;
      }

      if (recentActivities.status === 'fulfilled') {
        result.recentActivities = recentActivities.value;
      }

      if (upcomingAppointments.status === 'fulfilled') {
        result.upcomingAppointments = upcomingAppointments.value;
      }

      // Initialize empty arrays for missing data
      result.healthAlerts = result.healthAlerts || [];
      result.quickActions = result.quickActions || this.getDefaultQuickActions();

      return result;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch complete dashboard data');
    }
  }

  /**
   * Get default quick actions for dashboard shortcuts
   *
   * Provides predefined quick action buttons for common nurse workflows.
   * Can be extended to include dynamic badge counts from API.
   *
   * @returns {QuickAction[]} Array of default quick actions
   * @private
   */
  private getDefaultQuickActions(): QuickAction[] {
    return [
      {
        id: 'administer-medication',
        label: 'Administer Medication',
        icon: 'pill',
        route: '/medications/administer',
        category: 'medication',
      },
      {
        id: 'schedule-appointment',
        label: 'Schedule Appointment',
        icon: 'calendar-plus',
        route: '/appointments/new',
        category: 'appointment',
      },
      {
        id: 'create-incident',
        label: 'Report Incident',
        icon: 'alert-triangle',
        route: '/incidents/new',
        category: 'incident',
      },
      {
        id: 'view-alerts',
        label: 'Health Alerts',
        icon: 'bell',
        route: '/health-alerts',
        category: 'health',
      },
    ];
  }

  /**
   * Refresh dashboard cache
   *
   * Forces backend to clear cached statistics and fetch fresh data.
   * Useful after significant data changes (e.g., bulk imports, migrations).
   *
   * Note: This is a placeholder for future backend implementation.
   * Backend currently auto-clears cache after 5 minutes.
   *
   * @returns {Promise<boolean>} Success status
   */
  async refreshCache(): Promise<boolean> {
    try {
      // Future enhancement: POST /api/dashboard/refresh-cache
      // For now, just fetch stats to trigger cache update
      await this.getDashboardStats();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get dashboard data for specific date range
   *
   * Future enhancement for custom date range filtering.
   * Currently returns standard dashboard data.
   *
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise<DashboardStats>} Dashboard statistics for date range
   */
  async getDashboardStatsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<DashboardStats> {
    // Placeholder for future implementation
    // Backend: GET /api/dashboard/stats?startDate=...&endDate=...
    return this.getDashboardStats();
  }

  /**
   * Get dashboard data filtered by school or district
   *
   * For multi-tenant deployments where users can switch between
   * different schools or view district-wide data.
   *
   * @param {Object} scope - Scope filters
   * @param {string} scope.schoolId - Optional school ID filter
   * @param {string} scope.districtId - Optional district ID filter
   * @returns {Promise<DashboardStats>} Scoped dashboard statistics
   */
  async getDashboardStatsByScope(scope: {
    schoolId?: string;
    districtId?: string;
  }): Promise<DashboardStats> {
    try {
      const queryParams = new URLSearchParams();
      if (scope.schoolId) {
        queryParams.append('schoolId', scope.schoolId);
      }
      if (scope.districtId) {
        queryParams.append('districtId', scope.districtId);
      }

      // Future enhancement: Backend to implement scope filtering
      // For now, returns general stats
      const response = await this.client.get<BackendApiResponse<DashboardStats>>(
        `${API_ENDPOINTS.DASHBOARD.STATS}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch scoped dashboard statistics');
      }

      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message
        || error.message
        || 'Failed to fetch scoped dashboard statistics';
      throw new Error(errorMessage);
    }
  }
}

/**
 * Export singleton instance
 *
 * Use this singleton throughout the application to maintain consistent
 * state and avoid multiple instantiations.
 */

/**
 * Export class for testing and advanced use cases
 */
export function createDashboardApi(client: ApiClient): DashboardApi {
  return new DashboardApi(client);
}

// Export singleton instance
import { apiClient } from '../core/ApiClient'
export const dashboardApi = createDashboardApi(apiClient)
