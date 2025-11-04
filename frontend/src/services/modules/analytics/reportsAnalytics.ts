/**
 * @fileoverview Reports Analytics API Module
 * @module services/modules/analytics/reportsAnalytics
 * @category Services - Analytics
 *
 * Provides custom report generation, scheduling, and management capabilities.
 * Supports flexible report parameters, multiple export formats, and automated delivery.
 *
 * ## Features
 * - Custom report generation with flexible parameters
 * - Report list with pagination and filtering
 * - Report scheduling with various frequencies
 * - Schedule management (create, update, delete)
 * - Multiple export formats (PDF, Excel, CSV)
 * - Email delivery support
 * - Template-based reports
 * - Intelligent caching for performance
 *
 * @example
 * ```typescript
 * const reportsAnalytics = new ReportsAnalytics(apiClient);
 *
 * // Create custom report
 * const report = await reportsAnalytics.createCustomReport({
 *   name: 'Monthly Incident Summary',
 *   reportType: 'INCIDENTS',
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   groupBy: ['type', 'severity'],
 *   metrics: ['count', 'avgResponseTime'],
 *   exportFormat: 'PDF'
 * });
 *
 * // Get list of reports
 * const reports = await reportsAnalytics.getReports({
 *   page: 1,
 *   pageSize: 20,
 *   reportType: 'INCIDENTS',
 *   sortBy: 'createdAt'
 * });
 *
 * // Schedule report
 * const schedule = await reportsAnalytics.scheduleReport('report-123', {
 *   frequency: 'WEEKLY',
 *   dayOfWeek: 1,
 *   timeOfDay: '09:00',
 *   recipients: ['admin@school.edu'],
 *   isActive: true
 * });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  CustomReport,
  CustomReportRequest,
  CustomReportResult,
  ReportListResponse,
  ReportSchedule,
  CreateReportScheduleRequest
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Reports Analytics API Service
 * Handles custom report generation and scheduling with caching
 */
export class ReportsAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Create/generate custom report with validation
   * Supports flexible parameters, aggregations, and export formats
   * @param request - Custom report request parameters
   * @returns Custom report result
   */
  async createCustomReport(request: CustomReportRequest): Promise<CustomReportResult> {
    const response = await this.client.post<ApiResponse<CustomReportResult>>(
      '/analytics/reports/custom',
      request
    );

    // Clear report list cache as new report may be saved
    analyticsCache.clear(CacheKeys.REPORT_LIST);

    return response.data.data!;
  }

  /**
   * Get list of saved custom reports
   * Supports pagination, filtering, and sorting
   * @param params - Query parameters for report list
   * @returns Paginated report list
   */
  async getReports(params?: {
    page?: number;
    pageSize?: number;
    reportType?: string;
    tags?: string[];
    createdBy?: string;
    searchQuery?: string;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'lastRunAt';
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<ReportListResponse> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.REPORT_LIST, params);
    const cached = analyticsCache.get<ReportListResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<ReportListResponse>>(
      '/analytics/reports',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.REPORTS);

    return data;
  }

  /**
   * Get specific custom report by ID
   * @param reportId - Report identifier
   * @returns Custom report data
   * @throws Error if reportId is not provided
   */
  async getReport(reportId: string): Promise<CustomReport> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    const response = await this.client.get<ApiResponse<CustomReport>>(
      `/analytics/reports/${reportId}`
    );

    return response.data.data!;
  }

  /**
   * Delete custom report
   * @param reportId - Report identifier
   * @throws Error if reportId is not provided
   */
  async deleteReport(reportId: string): Promise<void> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    await this.client.delete(`/analytics/reports/${reportId}`);

    // Clear report list cache
    analyticsCache.clear(CacheKeys.REPORT_LIST);
  }

  /**
   * Schedule custom report generation
   * Supports various frequencies and email delivery
   * @param reportId - Report identifier
   * @param schedule - Report schedule configuration
   * @returns Created report schedule
   * @throws Error if reportId is not provided
   */
  async scheduleReport(
    reportId: string,
    schedule: CreateReportScheduleRequest
  ): Promise<ReportSchedule> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    const response = await this.client.post<ApiResponse<ReportSchedule>>(
      `/analytics/reports/${reportId}/schedule`,
      schedule
    );

    return response.data.data!;
  }

  /**
   * Update report schedule
   * @param reportId - Report identifier
   * @param scheduleId - Schedule identifier
   * @param updates - Partial schedule updates
   * @returns Updated report schedule
   * @throws Error if reportId or scheduleId is not provided
   */
  async updateReportSchedule(
    reportId: string,
    scheduleId: string,
    updates: Partial<CreateReportScheduleRequest>
  ): Promise<ReportSchedule> {
    if (!reportId || !scheduleId) {
      throw new Error('Report ID and Schedule ID are required');
    }

    const response = await this.client.patch<ApiResponse<ReportSchedule>>(
      `/analytics/reports/${reportId}/schedule/${scheduleId}`,
      updates
    );

    return response.data.data!;
  }

  /**
   * Delete report schedule
   * @param reportId - Report identifier
   * @param scheduleId - Schedule identifier
   * @throws Error if reportId or scheduleId is not provided
   */
  async deleteReportSchedule(reportId: string, scheduleId: string): Promise<void> {
    if (!reportId || !scheduleId) {
      throw new Error('Report ID and Schedule ID are required');
    }

    await this.client.delete(
      `/analytics/reports/${reportId}/schedule/${scheduleId}`
    );
  }

  /**
   * Get report schedules
   * @param reportId - Report identifier
   * @returns Array of report schedules
   * @throws Error if reportId is not provided
   */
  async getReportSchedules(reportId: string): Promise<ReportSchedule[]> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    const response = await this.client.get<ApiResponse<ReportSchedule[]>>(
      `/analytics/reports/${reportId}/schedules`
    );

    return response.data.data || [];
  }
}

/**
 * Factory function to create Reports Analytics instance
 * @param client - ApiClient instance
 * @returns Configured ReportsAnalytics instance
 */
export function createReportsAnalytics(client: ApiClient): ReportsAnalytics {
  return new ReportsAnalytics(client);
}
