/**
 * @fileoverview Appointment Analytics API Module for Healthcare Scheduling Insights
 * @module services/modules/analytics/appointmentAnalytics
 * @category Services - Analytics
 *
 * Provides comprehensive appointment analytics including volume trends, no-show rate tracking,
 * resource utilization metrics, and wait time analysis for healthcare scheduling optimization.
 *
 * ## Healthcare Application
 *
 * **Primary Use Cases**:
 * - **Capacity Planning**: Analyze appointment volumes to optimize nurse scheduling
 * - **No-Show Prevention**: Track no-show patterns to implement reminder strategies
 * - **Resource Optimization**: Monitor nurse utilization and appointment duration
 * - **Wait Time Management**: Identify bottlenecks and improve patient flow
 * - **Trend Analysis**: Compare periods to identify seasonal or temporal patterns
 *
 * **Healthcare Benefits**:
 * - Reduces student wait times through better scheduling
 * - Optimizes nurse workload distribution
 * - Improves appointment attendance through pattern analysis
 * - Enables data-driven capacity planning decisions
 * - Identifies peak periods for staff allocation
 *
 * ## Key Features
 *
 * **Appointment Trend Analysis**:
 * - Volume trends by day, week, or month
 * - Appointment type distribution (routine, urgent, follow-up)
 * - Seasonal pattern identification
 * - Period-over-period comparison
 * - School-specific or system-wide analytics
 *
 * **No-Show Rate Tracking**:
 * - Overall and per-school no-show percentages
 * - Student-level no-show patterns
 * - Appointment type no-show correlation
 * - Time-based no-show trends
 * - Cancellation vs no-show analysis
 *
 * **Resource Utilization**:
 * - Nurse appointment load distribution
 * - Average appointment duration by type
 * - Peak vs off-peak utilization
 * - Room and resource availability gaps
 *
 * **Performance Optimization**:
 * - Intelligent caching with 10-minute TTL for trends
 * - Efficient cache key generation
 * - Minimal API calls through cache reuse
 * - Automatic cache invalidation
 *
 * ## Architecture
 *
 * This module follows the analytics service pattern:
 * 1. **ApiClient Integration**: Uses centralized API client with authentication
 * 2. **Caching Layer**: Leverages shared analytics cache for performance
 * 3. **Type Safety**: Strongly typed requests and responses
 * 4. **Factory Pattern**: Provides factory function for instance creation
 *
 * ## Usage Patterns
 *
 * @example
 * **Basic Appointment Trend Analysis**
 * ```typescript
 * import { appointmentAnalytics } from '@/services/modules/analytics';
 *
 * // Get weekly appointment trends for a school
 * const trends = await appointmentAnalytics.getAppointmentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly',
 *   schoolId: 'school-123'
 * });
 *
 * // Display trend data
 * trends.periods.forEach(period => {
 *   console.log(`Week ${period.label}: ${period.count} appointments`);
 *   console.log(`  Types: ${period.byType.routine} routine, ${period.byType.urgent} urgent`);
 * });
 * ```
 *
 * @example
 * **No-Show Rate Analysis**
 * ```typescript
 * // Track no-show rates to implement reminder strategies
 * const noShowRate = await appointmentAnalytics.getNoShowRate({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   schoolId: 'school-123'
 * });
 *
 * console.log(`No-show rate: ${(noShowRate.rate * 100).toFixed(1)}%`);
 * console.log(`Total appointments: ${noShowRate.totalAppointments}`);
 * console.log(`No-shows: ${noShowRate.noShowCount}`);
 *
 * if (noShowRate.rate > 0.15) {
 *   console.warn('High no-show rate detected - consider reminder interventions');
 * }
 * ```
 *
 * @example
 * **Multi-Period Comparison**
 * ```typescript
 * // Compare current month to previous month
 * const currentMonthTrends = await appointmentAnalytics.getAppointmentTrends({
 *   startDate: '2025-02-01',
 *   endDate: '2025-02-28',
 *   period: 'weekly'
 * });
 *
 * const previousMonthTrends = await appointmentAnalytics.getAppointmentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly'
 * });
 *
 * const currentTotal = currentMonthTrends.totalCount;
 * const previousTotal = previousMonthTrends.totalCount;
 * const percentChange = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);
 *
 * console.log(`Appointment volume change: ${percentChange}%`);
 * ```
 *
 * @example
 * **TanStack Query Integration**
 * ```typescript
 * import { useQuery } from '@tanstack/react-query';
 * import { appointmentAnalytics } from '@/services/modules/analytics';
 *
 * function AppointmentTrendsChart({ schoolId, dateRange }) {
 *   const { data, isLoading, error } = useQuery({
 *     queryKey: ['analytics', 'appointment-trends', schoolId, dateRange],
 *     queryFn: () => appointmentAnalytics.getAppointmentTrends({
 *       ...dateRange,
 *       schoolId,
 *       period: 'weekly'
 *     }),
 *     staleTime: 180000, // 3 minutes
 *     cacheTime: 600000  // 10 minutes
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <TrendsChart data={data} />;
 * }
 * ```
 *
 * @see {@link HealthAnalytics} for health metrics and trends
 * @see {@link DashboardAnalytics} for dashboard-specific appointment data
 * @see {@link ReportsAnalytics} for custom appointment reports
 * @see {@link cacheUtils} for cache management and invalidation
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  AppointmentTrends,
  NoShowRate
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Appointment Analytics API Service
 *
 * @class
 * @classdesc Provides comprehensive appointment analytics including trend analysis, no-show tracking,
 * and resource utilization metrics with intelligent caching for optimal performance.
 *
 * **Service Architecture**:
 * - Utilizes shared ApiClient for authenticated requests
 * - Leverages centralized analytics cache for performance
 * - Implements automatic cache key generation
 * - Provides strongly-typed API responses
 *
 * **Healthcare Context**:
 * - Supports capacity planning through volume trend analysis
 * - Enables no-show prevention through pattern identification
 * - Optimizes nurse scheduling through utilization metrics
 * - Improves patient flow through wait time analysis
 *
 * **Caching Strategy**:
 * - Appointment trends: 10-minute cache (CacheTTL.TRENDS)
 * - No-show rates: No caching (requires real-time accuracy)
 * - Cache keys: Generated from method name + parameters
 * - Automatic cache invalidation on data updates
 *
 * **Performance Characteristics**:
 * - O(1) cache lookups
 * - Minimal network requests through cache reuse
 * - Efficient parameter-based cache key generation
 * - Low memory footprint with TTL-based expiration
 *
 * @example
 * **Create Instance and Track Trends**
 * ```typescript
 * import { apiClient } from '@/services/core/ApiClient';
 * import { AppointmentAnalytics } from '@/services/modules/analytics/appointmentAnalytics';
 *
 * const appointmentAnalytics = new AppointmentAnalytics(apiClient);
 *
 * // Analyze appointment trends for capacity planning
 * const trends = await appointmentAnalytics.getAppointmentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly',
 *   schoolId: 'school-123'
 * });
 *
 * // Plan nurse staffing based on peak periods
 * const peakPeriod = trends.periods.reduce((max, p) =>
 *   p.count > max.count ? p : max
 * );
 * console.log(`Peak week: ${peakPeriod.label} with ${peakPeriod.count} appointments`);
 * ```
 *
 * @example
 * **Monitor No-Show Rates for Interventions**
 * ```typescript
 * const noShowRate = await appointmentAnalytics.getNoShowRate({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   schoolId: 'school-123'
 * });
 *
 * // Implement reminder strategy if rate is high
 * if (noShowRate.rate > 0.15) {
 *   await sendAutomatedReminders(noShowRate.highRiskStudents);
 *   console.log('Automated reminders sent to high-risk students');
 * }
 * ```
 */
export class AppointmentAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get appointment volume trends over time with optional filtering
   *
   * @param {Object} [params] - Query parameters for filtering appointment trends
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {'daily' | 'weekly' | 'monthly'} [params.period='weekly'] - Aggregation period for trend data
   * @param {string} [params.schoolId] - Filter by specific school ID
   * @returns {Promise<AppointmentTrends>} Appointment trends with period breakdowns and totals
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid (must be ISO 8601 YYYY-MM-DD)
   *
   * @description
   * Retrieves appointment volume trends aggregated by the specified period. Results include:
   * - Total appointment count for the date range
   * - Period-by-period breakdown (daily/weekly/monthly)
   * - Appointment type distribution (routine, urgent, follow-up)
   * - Comparison to previous period (optional)
   *
   * **Caching Behavior**:
   * - Results are cached for 10 minutes (CacheTTL.TRENDS)
   * - Cache key includes all parameters for accurate cache hits
   * - Subsequent identical requests return cached data
   * - Cache automatically expires after TTL
   *
   * **Healthcare Use Cases**:
   * - **Capacity Planning**: Identify peak appointment periods for nurse scheduling
   * - **Trend Analysis**: Detect seasonal patterns in appointment volumes
   * - **Resource Allocation**: Plan room and equipment availability
   * - **Workload Balancing**: Distribute appointments to optimize nurse workload
   *
   * **Date Range Guidelines**:
   * - Maximum recommended range: 365 days
   * - Use 'daily' period for ranges < 31 days
   * - Use 'weekly' period for ranges 31-365 days
   * - Use 'monthly' period for ranges > 365 days
   *
   * @example
   * **Basic Weekly Trend Analysis**
   * ```typescript
   * const trends = await appointmentAnalytics.getAppointmentTrends({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   period: 'weekly'
   * });
   *
   * console.log(`Total appointments: ${trends.totalCount}`);
   * trends.periods.forEach(week => {
   *   console.log(`${week.label}: ${week.count} appointments`);
   * });
   * ```
   *
   * @example
   * **School-Specific Monthly Trends**
   * ```typescript
   * const schoolTrends = await appointmentAnalytics.getAppointmentTrends({
   *   startDate: '2024-01-01',
   *   endDate: '2024-12-31',
   *   period: 'monthly',
   *   schoolId: 'school-123'
   * });
   *
   * // Identify busiest month for this school
   * const busiestMonth = schoolTrends.periods.reduce((max, month) =>
   *   month.count > max.count ? month : max
   * );
   * console.log(`Busiest month: ${busiestMonth.label} (${busiestMonth.count} appointments)`);
   * ```
   *
   * @example
   * **Appointment Type Distribution Analysis**
   * ```typescript
   * const trends = await appointmentAnalytics.getAppointmentTrends({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   period: 'daily'
   * });
   *
   * // Calculate type percentages
   * const total = trends.totalCount;
   * const routinePercent = (trends.byType.routine / total * 100).toFixed(1);
   * const urgentPercent = (trends.byType.urgent / total * 100).toFixed(1);
   *
   * console.log(`Routine: ${routinePercent}%, Urgent: ${urgentPercent}%`);
   * ```
   *
   * @see {@link getNoShowRate} for no-show rate analysis
   * @see {@link DashboardAnalytics.getNurseDashboard} for nurse-specific appointment data
   */
  async getAppointmentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    schoolId?: string;
  }): Promise<AppointmentTrends> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.APPOINTMENT_TRENDS, params);
    const cached = analyticsCache.get<AppointmentTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<AppointmentTrends>>(
      '/analytics/appointments/trends',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get appointment no-show rate metrics for intervention planning
   *
   * @param {Object} [params] - Query parameters for filtering no-show analysis
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.schoolId] - Filter by specific school ID
   * @returns {Promise<NoShowRate>} No-show rate data with totals and breakdown
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid (must be ISO 8601 YYYY-MM-DD)
   *
   * @description
   * Calculates no-show rates for appointments to enable targeted interventions and
   * reminder strategies. Returns comprehensive metrics including:
   * - Overall no-show rate percentage
   * - Total appointments scheduled
   * - No-show count
   * - Cancellation count
   * - Student-level patterns (optional)
   * - Time-based trends (optional)
   *
   * **Caching Behavior**:
   * - **Not cached**: No-show data requires real-time accuracy for interventions
   * - Fresh data on every request
   * - Use with caution in high-frequency scenarios
   *
   * **Healthcare Use Cases**:
   * - **Reminder Automation**: Identify high-risk students for proactive reminders
   * - **Pattern Analysis**: Detect time-based no-show patterns (day of week, time of day)
   * - **Resource Planning**: Adjust schedule density based on expected no-shows
   * - **Student Engagement**: Target students with poor attendance for support
   *
   * **Intervention Thresholds**:
   * - **< 5%**: Excellent - maintain current practices
   * - **5-10%**: Good - monitor trends
   * - **10-15%**: Concerning - implement basic reminders
   * - **> 15%**: Critical - activate comprehensive intervention strategy
   *
   * **Performance Considerations**:
   * - Not cached due to intervention sensitivity
   * - Recommended for scheduled reports or on-demand analysis
   * - Consider caching in UI layer with short TTL (1-2 minutes)
   *
   * @example
   * **Basic No-Show Rate Analysis**
   * ```typescript
   * const noShowRate = await appointmentAnalytics.getNoShowRate({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31'
   * });
   *
   * console.log(`No-show rate: ${(noShowRate.rate * 100).toFixed(1)}%`);
   * console.log(`${noShowRate.noShowCount} no-shows out of ${noShowRate.totalAppointments} appointments`);
   *
   * // Display summary
   * console.log(`Completed: ${noShowRate.completedCount}`);
   * console.log(`Cancelled: ${noShowRate.cancelledCount}`);
   * ```
   *
   * @example
   * **Automated Intervention Trigger**
   * ```typescript
   * const noShowRate = await appointmentAnalytics.getNoShowRate({
   *   startDate: lastMonthStart,
   *   endDate: lastMonthEnd,
   *   schoolId: 'school-123'
   * });
   *
   * // Trigger reminder strategy based on threshold
   * if (noShowRate.rate > 0.15) {
   *   console.warn(`High no-show rate: ${(noShowRate.rate * 100).toFixed(1)}%`);
   *
   *   // Send automated reminders to all upcoming appointments
   *   await sendBulkAppointmentReminders({
   *     schoolId: 'school-123',
   *     channels: ['sms', 'email', 'push'],
   *     reminderSchedule: '24hours_before'
   *   });
   *
   *   console.log('Automated 24-hour reminders activated');
   * } else if (noShowRate.rate > 0.10) {
   *   // Implement basic SMS reminders
   *   await sendSMSReminders({ schoolId: 'school-123' });
   * }
   * ```
   *
   * @example
   * **School Comparison Analysis**
   * ```typescript
   * const schoolIds = ['school-1', 'school-2', 'school-3'];
   * const dateRange = { startDate: '2025-01-01', endDate: '2025-01-31' };
   *
   * const noShowRates = await Promise.all(
   *   schoolIds.map(schoolId =>
   *     appointmentAnalytics.getNoShowRate({ ...dateRange, schoolId })
   *   )
   * );
   *
   * // Identify schools needing intervention
   * const schoolsNeedingHelp = noShowRates
   *   .map((rate, index) => ({ schoolId: schoolIds[index], rate: rate.rate }))
   *   .filter(school => school.rate > 0.15)
   *   .sort((a, b) => b.rate - a.rate);
   *
   * console.log('Schools requiring intervention:');
   * schoolsNeedingHelp.forEach(school => {
   *   console.log(`  ${school.schoolId}: ${(school.rate * 100).toFixed(1)}%`);
   * });
   * ```
   *
   * @example
   * **Monthly Trend Monitoring**
   * ```typescript
   * // Track no-show rate over multiple months
   * const months = [
   *   { start: '2024-09-01', end: '2024-09-30', label: 'September' },
   *   { start: '2024-10-01', end: '2024-10-31', label: 'October' },
   *   { start: '2024-11-01', end: '2024-11-30', label: 'November' }
   * ];
   *
   * for (const month of months) {
   *   const rate = await appointmentAnalytics.getNoShowRate({
   *     startDate: month.start,
   *     endDate: month.end
   *   });
   *
   *   console.log(`${month.label}: ${(rate.rate * 100).toFixed(1)}%`);
   * }
   * ```
   *
   * @see {@link getAppointmentTrends} for overall appointment volume trends
   * @see {@link DashboardAnalytics.getNurseDashboard} for nurse-specific no-show data
   * @see {@link ReportsAnalytics} for detailed no-show reports
   */
  async getNoShowRate(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<NoShowRate> {
    const response = await this.client.get<ApiResponse<NoShowRate>>(
      '/analytics/appointments/no-show-rate',
      { params }
    );

    return response.data.data!;
  }
}

/**
 * Factory function to create Appointment Analytics instance
 *
 * @param {ApiClient} client - Configured ApiClient instance with authentication and resilience patterns
 * @returns {AppointmentAnalytics} Configured AppointmentAnalytics service instance
 *
 * @description
 * Creates a new AppointmentAnalytics instance with the provided ApiClient.
 * The client should be configured with:
 * - Authentication tokens
 * - Circuit breaker patterns
 * - Retry logic
 * - Request/response interceptors
 *
 * **Usage Recommendation**: Use the singleton instance `appointmentAnalytics` exported
 * from the analytics module instead of creating new instances.
 *
 * @example
 * **Create Custom Instance**
 * ```typescript
 * import { apiClient } from '@/services/core/ApiClient';
 * import { createAppointmentAnalytics } from '@/services/modules/analytics/appointmentAnalytics';
 *
 * const customAnalytics = createAppointmentAnalytics(apiClient);
 * const trends = await customAnalytics.getAppointmentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 *
 * @example
 * **Use Singleton (Recommended)**
 * ```typescript
 * import { appointmentAnalytics } from '@/services/modules/analytics';
 *
 * const trends = await appointmentAnalytics.getAppointmentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 *
 * @see {@link AppointmentAnalytics} for the main class documentation
 */
export function createAppointmentAnalytics(client: ApiClient): AppointmentAnalytics {
  return new AppointmentAnalytics(client);
}
