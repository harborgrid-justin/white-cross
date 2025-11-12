/**
 * @fileoverview Health Records Statistics and Analytics Service
 * @module services/modules/health/healthRecordsStatistics
 * @category Services
 *
 * Health Records Statistics and Reporting
 *
 * Purpose:
 * Provides aggregated statistics and analytics for health records at school
 * or district level. Supports population health management, trend analysis,
 * compliance reporting, and administrative oversight.
 *
 * Features:
 * - Aggregate health statistics by scope (school/district)
 * - Visit trend analysis over time
 * - Top diagnoses reporting
 * - Emergency visit rate tracking
 * - Follow-up completion rate monitoring
 * - Records by type distribution
 *
 * Healthcare Context:
 * - Supports population health management initiatives
 * - Enables identification of health trends and outbreaks
 * - Tracks healthcare service utilization
 * - Monitors quality metrics (follow-up completion rates)
 * - Facilitates resource allocation planning
 *
 * Privacy Considerations:
 * - Statistics are aggregated and de-identified
 * - No individual PHI exposed in statistics
 * - Minimum thresholds prevent re-identification
 * - Access controls enforced at API level
 *
 * @example
 * ```typescript
 * import { createHealthRecordsStatisticsService } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const statsService = createHealthRecordsStatisticsService(apiClient);
 *
 * // Get school health statistics
 * const stats = await statsService.getHealthStatistics(
 *   'school',
 *   'school-uuid',
 *   '2024-01-01T00:00:00Z',
 *   '2024-12-31T23:59:59Z'
 * );
 *
 * console.log(`Total Records: ${stats.totalRecords}`);
 * console.log(`Emergency Rate: ${stats.emergencyRate}%`);
 * console.log(`Follow-up Completion: ${stats.followUpCompletionRate}%`);
 * ```
 */

import { API_ENDPOINTS } from '@/constants/api';
import type { ApiClient } from '@/services/core/ApiClient';
import type { ApiResponse } from '@/services/types';
import type { HealthRecordType, HealthStatistics } from './healthRecordsTypes';

/**
 * Health Records Statistics Service
 *
 * @class
 * @description
 * Service for retrieving aggregated health statistics and analytics. Provides
 * de-identified aggregate data for population health management, trend analysis,
 * and administrative reporting without exposing individual PHI.
 *
 * Statistical Measures:
 * - Total record counts
 * - Distribution by record type
 * - Top diagnoses with counts
 * - Visit trends over time
 * - Emergency visit rates
 * - Follow-up completion rates
 *
 * Scoping:
 * - School-level: Statistics for a single school
 * - District-level: Aggregated statistics across all schools in district
 *
 * Privacy & Security:
 * - All statistics are de-identified aggregates
 * - No individual student data exposed
 * - Minimum cell sizes prevent re-identification
 * - Access controls enforced at API gateway
 * - Role-based access to district vs school statistics
 *
 * Performance:
 * - Statistics pre-computed and cached
 * - Typical response time: <1 second
 * - Date range filtering for custom periods
 * - Optimized database queries with proper indexing
 *
 * @example
 * ```typescript
 * const statsService = new HealthRecordsStatisticsService(apiClient);
 *
 * // Get yearly statistics for a school
 * const yearStats = await statsService.getHealthStatistics(
 *   'school',
 *   'school-uuid',
 *   '2024-01-01T00:00:00Z',
 *   '2024-12-31T23:59:59Z'
 * );
 *
 * // Analyze emergency visit rate
 * if (yearStats.emergencyRate > 5) {
 *   console.warn('High emergency visit rate requires review');
 * }
 *
 * // Check follow-up completion
 * if (yearStats.followUpCompletionRate < 80) {
 *   console.log('Follow-up completion rate below target');
 * }
 * ```
 */
export class HealthRecordsStatisticsService {
  constructor(private client: ApiClient) {}

  /**
   * Get aggregated health statistics for a scope
   *
   * @param {'school' | 'district'} scope - Statistical scope (school or district)
   * @param {string} scopeId - UUID of school or district
   * @param {string} [dateFrom] - Optional start date for date range filter (ISO 8601)
   * @param {string} [dateTo] - Optional end date for date range filter (ISO 8601)
   * @returns {Promise<HealthStatistics>} Aggregated health statistics
   * @throws {Error} If scopeId is invalid or API request fails
   *
   * @description
   * Retrieves comprehensive aggregated health statistics for a school or district.
   * Returns de-identified aggregate data suitable for population health management,
   * trend analysis, and administrative reporting.
   *
   * Statistics Included:
   * - **Total Records**: Overall count of health records
   * - **By Type**: Distribution of records across types (ILLNESS, INJURY, etc.)
   * - **Top Diagnoses**: Most common diagnoses with occurrence counts
   * - **Visit Trends**: Health office visits over time (daily/weekly/monthly)
   * - **Emergency Rate**: Percentage of visits classified as emergencies
   * - **Follow-up Completion Rate**: Percentage of required follow-ups completed
   *
   * Healthcare Applications:
   * - Population health management and planning
   * - Disease surveillance and outbreak detection
   * - Healthcare resource utilization analysis
   * - Quality metrics monitoring
   * - Compliance reporting (follow-up rates)
   * - Budget planning and resource allocation
   *
   * Privacy & Security:
   * - All data is de-identified and aggregated
   * - No individual PHI exposed
   * - Minimum cell sizes enforced to prevent re-identification
   * - Access controls ensure appropriate authorization
   *
   * Performance:
   * - Pre-computed statistics with periodic refresh
   * - Cached results for frequently accessed periods
   * - Typical response time: <1 second
   * - Date range filtering allows custom analysis periods
   *
   * @example
   * ```typescript
   * // Get school statistics for current year
   * const currentYearStats = await statsService.getHealthStatistics(
   *   'school',
   *   'school-uuid',
   *   '2024-01-01T00:00:00Z',
   *   '2024-12-31T23:59:59Z'
   * );
   *
   * console.log('Health Office Statistics:');
   * console.log(`Total Visits: ${currentYearStats.totalRecords}`);
   * console.log(`Emergency Rate: ${currentYearStats.emergencyRate.toFixed(1)}%`);
   * console.log(`Follow-up Completion: ${currentYearStats.followUpCompletionRate.toFixed(1)}%`);
   *
   * // Analyze visit types
   * console.log('\nVisit Distribution:');
   * Object.entries(currentYearStats.byType).forEach(([type, count]) => {
   *   console.log(`${type}: ${count}`);
   * });
   *
   * // Review top diagnoses
   * console.log('\nTop Diagnoses:');
   * currentYearStats.topDiagnoses.slice(0, 10).forEach((diag, idx) => {
   *   console.log(`${idx + 1}. ${diag.diagnosis}: ${diag.count} cases`);
   * });
   *
   * // Analyze trends
   * console.log('\nVisit Trends:');
   * currentYearStats.visitTrends.forEach(trend => {
   *   console.log(`${trend.date}: ${trend.count} visits`);
   * });
   *
   * // Get district-wide statistics
   * const districtStats = await statsService.getHealthStatistics(
   *   'district',
   *   'district-uuid'
   * );
   * console.log(`District Total Records: ${districtStats.totalRecords}`);
   * ```
   *
   * @see {@link HealthStatistics} for complete statistics structure
   */
  async getHealthStatistics(
    scope: 'school' | 'district',
    scopeId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<HealthStatistics> {
    this.validateId(scopeId);

    const params = this.buildQueryParams({
      dateFrom,
      dateTo
    });

    const response = await this.client.get<ApiResponse<HealthStatistics>>(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/statistics/${scope}/${scopeId}${params}`
    );

    return this.extractData(response);
  }

  /**
   * Validate UUID format
   * @private
   */
  private validateId(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`Invalid UUID format: ${id}`);
    }
  }

  /**
   * Build query parameters string
   * @private
   */
  private buildQueryParams(params: Record<string, unknown>): string {
    const filteredParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        filteredParams[key] = String(value);
      }
    });

    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Extract data from API response
   * @private
   */
  private extractData<T>(response: ApiResponse<T>): T {
    if (response.data) {
      return response.data;
    }
    throw new Error('Invalid API response: missing data');
  }
}

/**
 * Factory function to create statistics service instance
 *
 * @param {ApiClient} client - API client instance
 * @returns {HealthRecordsStatisticsService} Configured statistics service
 *
 * @example
 * ```typescript
 * import { createHealthRecordsStatisticsService } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const statsService = createHealthRecordsStatisticsService(apiClient);
 * ```
 */
export function createHealthRecordsStatisticsService(
  client: ApiClient
): HealthRecordsStatisticsService {
  return new HealthRecordsStatisticsService(client);
}
