/**
 * @fileoverview Analytics API Module - Main Aggregator
 * @module services/modules/analytics
 * @category Services
 *
 * @deprecated This module is deprecated. Use server actions or new API client instead.
 *
 * **MIGRATION NOTICE:**
 *
 * This legacy service layer is being phased out in favor of:
 * 1. Server Actions (for Server Components) - RECOMMENDED
 * 2. New API Client (for client-side code)
 *
 * See parent module `@/services/modules/analyticsApi.ts` for detailed migration guide.
 *
 * **Quick Migration Examples:**
 *
 * ```typescript
 * // OLD (this module):
 * import { analyticsApi } from '@/services/modules/analytics';
 * const metrics = await analyticsApi.getHealthMetrics({ schoolId: '123' });
 *
 * // NEW (Server Actions - RECOMMENDED):
 * import { getHealthMetrics } from '@/lib/actions/analytics.actions';
 * const metrics = await getHealthMetrics({ schoolId: '123' });
 *
 * // NEW (Client Components with React Query):
 * import { useQuery } from '@tanstack/react-query';
 * import { getHealthMetrics } from '@/lib/actions/analytics.actions';
 * const { data: metrics } = useQuery({
 *   queryKey: ['analytics', 'health', schoolId],
 *   queryFn: () => getHealthMetrics({ schoolId })
 * });
 * ```
 *
 * **API Client Update:**
 *
 * If you need to use the legacy ApiClient pattern, update imports:
 * ```typescript
 * // OLD:
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * // NEW:
 * import { apiClient } from '@/lib/api/client';
 * // or for server-side:
 * import { serverGet, serverPost } from '@/lib/api/server';
 * ```
 *
 * ## Architecture (Legacy Reference)
 *
 * Comprehensive analytics, reporting, and dashboard capabilities for healthcare
 * metrics, trends, and insights. Aggregates all analytics modules into a unified API.
 *
 * This module aggregates domain-specific analytics modules:
 * - **Health Analytics**: Health metrics and trends
 * - **Incident Analytics**: Incident trends and location data
 * - **Medication Analytics**: Medication usage and adherence
 * - **Appointment Analytics**: Appointment trends and no-show rates
 * - **Dashboard Analytics**: Role-specific dashboards
 * - **Reports Analytics**: Custom report generation and scheduling
 * - **Advanced Analytics**: Real-time updates, forecasting, drill-down
 *
 * ## Performance Optimization
 *
 * All modules share a centralized cache with intelligent TTL:
 * - Dashboard data: 3-minute cache
 * - Metrics: 5-minute cache
 * - Trends: 10-minute cache
 * - Reports: 1-minute cache
 *
 * **Scheduled for Removal**: v2.0.0 (Q2 2025)
 *
 * @see {@link @/lib/actions/analytics.actions} for server actions (RECOMMENDED)
 * @see {@link @/lib/api/client} for client-side API utilities
 * @see {@link HealthAnalytics} for health metrics (legacy)
 * @see {@link IncidentAnalytics} for incident analytics (legacy)
 * @see {@link DashboardAnalytics} for dashboard data (legacy)
 * @see {@link ReportsAnalytics} for custom reports (legacy)
 */

import type { ApiClient } from '../../core/ApiClient';
import { apiClient } from '../../core/ApiClient';

// Import all analytics modules
import { HealthAnalytics, createHealthAnalytics } from './healthAnalytics';
import { IncidentAnalytics, createIncidentAnalytics } from './incidentAnalytics';
import { MedicationAnalytics, createMedicationAnalytics } from './medicationAnalytics';
import { AppointmentAnalytics, createAppointmentAnalytics } from './appointmentAnalytics';
import { DashboardAnalytics, createDashboardAnalytics } from './dashboardAnalytics';
import { ReportsAnalytics, createReportsAnalytics } from './reportsAnalytics';
import { AdvancedAnalytics, createAdvancedAnalytics } from './advancedAnalytics';

// Import cache utilities
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

// Re-export all types from main types module
export * from '../../types';

// Re-export cache utilities for advanced use cases
export { analyticsCache, CacheKeys, CacheTTL };

/**
 * Unified Analytics API
 * Aggregates all analytics modules into a single, comprehensive API
 */
export class AnalyticsApi {
  // Module instances
  private healthAnalytics: HealthAnalytics;
  private incidentAnalytics: IncidentAnalytics;
  private medicationAnalytics: MedicationAnalytics;
  private appointmentAnalytics: AppointmentAnalytics;
  private dashboardAnalytics: DashboardAnalytics;
  private reportsAnalytics: ReportsAnalytics;
  private advancedAnalytics: AdvancedAnalytics;

  constructor(private readonly client: ApiClient) {
    // Initialize all analytics modules
    this.healthAnalytics = createHealthAnalytics(client);
    this.incidentAnalytics = createIncidentAnalytics(client);
    this.medicationAnalytics = createMedicationAnalytics(client);
    this.appointmentAnalytics = createAppointmentAnalytics(client);
    this.dashboardAnalytics = createDashboardAnalytics(client);
    this.reportsAnalytics = createReportsAnalytics(client);
    this.advancedAnalytics = createAdvancedAnalytics(client);
  }

  // ==========================================================================
  // CACHE MANAGEMENT
  // ==========================================================================

  /**
   * Clear cache by key or pattern
   * @param pattern - Optional pattern to match cache keys. If omitted, clears all cache.
   */
  clearCache(pattern?: string): void {
    analyticsCache.clear(pattern);
  }

  // ==========================================================================
  // HEALTH ANALYTICS - Delegate to HealthAnalytics module
  // ==========================================================================

  getHealthMetrics = this.healthAnalytics.getHealthMetrics.bind(this.healthAnalytics);
  getHealthTrends = this.healthAnalytics.getHealthTrends.bind(this.healthAnalytics);
  getStudentHealthMetrics = this.healthAnalytics.getStudentHealthMetrics.bind(this.healthAnalytics);
  getSchoolHealthMetrics = this.healthAnalytics.getSchoolHealthMetrics.bind(this.healthAnalytics);

  // ==========================================================================
  // INCIDENT ANALYTICS - Delegate to IncidentAnalytics module
  // ==========================================================================

  getIncidentTrends = this.incidentAnalytics.getIncidentTrends.bind(this.incidentAnalytics);
  getIncidentsByLocation = this.incidentAnalytics.getIncidentsByLocation.bind(this.incidentAnalytics);

  // ==========================================================================
  // MEDICATION ANALYTICS - Delegate to MedicationAnalytics module
  // ==========================================================================

  getMedicationUsage = this.medicationAnalytics.getMedicationUsage.bind(this.medicationAnalytics);
  getMedicationAdherence = this.medicationAnalytics.getMedicationAdherence.bind(this.medicationAnalytics);

  // ==========================================================================
  // APPOINTMENT ANALYTICS - Delegate to AppointmentAnalytics module
  // ==========================================================================

  getAppointmentTrends = this.appointmentAnalytics.getAppointmentTrends.bind(this.appointmentAnalytics);
  getNoShowRate = this.appointmentAnalytics.getNoShowRate.bind(this.appointmentAnalytics);

  // ==========================================================================
  // DASHBOARD ANALYTICS - Delegate to DashboardAnalytics module
  // ==========================================================================

  getNurseDashboard = this.dashboardAnalytics.getNurseDashboard.bind(this.dashboardAnalytics);
  getAdminDashboard = this.dashboardAnalytics.getAdminDashboard.bind(this.dashboardAnalytics);
  getSchoolDashboard = this.dashboardAnalytics.getSchoolDashboard.bind(this.dashboardAnalytics);
  getSummary = this.dashboardAnalytics.getSummary.bind(this.dashboardAnalytics);

  // ==========================================================================
  // REPORTS ANALYTICS - Delegate to ReportsAnalytics module
  // ==========================================================================

  createCustomReport = this.reportsAnalytics.createCustomReport.bind(this.reportsAnalytics);
  getReports = this.reportsAnalytics.getReports.bind(this.reportsAnalytics);
  getReport = this.reportsAnalytics.getReport.bind(this.reportsAnalytics);
  deleteReport = this.reportsAnalytics.deleteReport.bind(this.reportsAnalytics);
  scheduleReport = this.reportsAnalytics.scheduleReport.bind(this.reportsAnalytics);
  updateReportSchedule = this.reportsAnalytics.updateReportSchedule.bind(this.reportsAnalytics);
  deleteReportSchedule = this.reportsAnalytics.deleteReportSchedule.bind(this.reportsAnalytics);
  getReportSchedules = this.reportsAnalytics.getReportSchedules.bind(this.reportsAnalytics);

  // ==========================================================================
  // ADVANCED ANALYTICS - Delegate to AdvancedAnalytics module
  // ==========================================================================

  subscribeToRealTimeUpdates = this.advancedAnalytics.subscribeToRealTimeUpdates.bind(this.advancedAnalytics);
  exportReportData = this.advancedAnalytics.exportReportData.bind(this.advancedAnalytics);
  transformToChartData = this.advancedAnalytics.transformToChartData.bind(this.advancedAnalytics);
  drillDown = this.advancedAnalytics.drillDown.bind(this.advancedAnalytics);
  getForecast = this.advancedAnalytics.getForecast.bind(this.advancedAnalytics);
}

/**
 * Factory function to create Analytics API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AnalyticsApi instance with all modules
 */
export function createAnalyticsApi(client: ApiClient): AnalyticsApi {
  return new AnalyticsApi(client);
}

// ==========================================================================
// SINGLETON INSTANCES
// ==========================================================================

/**
 * Singleton unified Analytics API instance
 */
export const analyticsApi = createAnalyticsApi(apiClient);

/**
 * Individual module instances for granular access
 */
export const healthAnalytics = createHealthAnalytics(apiClient);
export const incidentAnalytics = createIncidentAnalytics(apiClient);
export const medicationAnalytics = createMedicationAnalytics(apiClient);
export const appointmentAnalytics = createAppointmentAnalytics(apiClient);
export const dashboardAnalytics = createDashboardAnalytics(apiClient);
export const reportsAnalytics = createReportsAnalytics(apiClient);
export const advancedAnalytics = createAdvancedAnalytics(apiClient);

// ==========================================================================
// DEFAULT EXPORT
// ==========================================================================

export default analyticsApi;
