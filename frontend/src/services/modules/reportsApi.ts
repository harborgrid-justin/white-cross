/**
 * @fileoverview Healthcare Analytics and Reporting API service
 * @module services/modules/reportsApi
 * @category Services - Analytics & Reporting
 *
 * @deprecated This service is deprecated and will be removed on 2026-06-30.
 * Please migrate to @/lib/actions/reports.actions and @/lib/actions/analytics.actions instead.
 * See: /src/services/modules/DEPRECATED.md for migration guide
 *
 * MIGRATION GUIDE:
 * ```typescript
 * // Before:
 * import { reportsApi } from '@/services/modules/reportsApi';
 * const healthTrends = await reportsApi.getHealthTrends({ startDate, endDate });
 * const dashboardMetrics = await reportsApi.getDashboard();
 *
 * // After:
 * import { getHealthTrends } from '@/lib/actions/reports.actions';
 * import { getDashboardMetrics } from '@/lib/actions/analytics.actions';
 * const healthTrends = await getHealthTrends({ startDate, endDate });
 * const dashboardMetrics = await getDashboardMetrics();
 * ```
 *
 * Provides comprehensive healthcare analytics, reporting, and data visualization
 * capabilities for the White Cross platform. Implements health trend analysis,
 * medication usage tracking, incident statistics, custom report generation, and
 * HIPAA-compliant data aggregation.
 *
 * Key Features:
 * - Health trend analysis and pattern recognition
 * - Medication usage and compliance reporting
 * - Incident statistics and safety analytics
 * - Attendance correlation with health data
 * - Performance metrics tracking
 * - Real-time dashboard data aggregation
 * - Custom report builder with templates
 * - Report scheduling and automation
 * - Multi-format export (CSV, PDF, Excel, JSON)
 * - Report sharing and distribution
 * - Historical report archive
 *
 * Health Trend Analysis:
 * - Chronic condition tracking over time
 * - Seasonal illness pattern detection
 * - Immunization coverage analysis
 * - Allergy prevalence statistics
 * - Health screenings compliance tracking
 * - Emergency visit frequency analysis
 *
 * Medication Reporting:
 * - Medication administration compliance rates
 * - Controlled substance tracking and reconciliation
 * - Medication error incident analysis
 * - Stock level and usage forecasting
 * - Prescription refill tracking
 * - Adverse drug event monitoring
 *
 * Incident Statistics:
 * - Incident type distribution analysis
 * - Location-based incident patterns
 * - Time-of-day incident correlation
 * - Severity trend analysis
 * - Follow-up completion rates
 * - Recurring incident identification
 *
 * Compliance Reporting:
 * - HIPAA compliance score calculation
 * - Consent form completion tracking
 * - Policy acknowledgment rates
 * - Audit log completeness verification
 * - Training completion statistics
 * - Documentation quality metrics
 *
 * Custom Report Builder:
 * - Drag-and-drop report designer
 * - Reusable report templates
 * - Custom field selection
 * - Filter and grouping configuration
 * - Chart type selection (bar, line, pie, scatter)
 * - Scheduled report generation
 * - Email distribution lists
 *
 * Data Aggregation:
 * - De-identified health data aggregation for analytics
 * - HIPAA-compliant data anonymization
 * - No PHI in exported reports without authorization
 * - Aggregate statistics across schools and districts
 * - Year-over-year comparison reporting
 *
 * @example Generate health trends report
 * ```typescript
 * import { reportsApi } from '@/services/modules/reportsApi';
 *
 * const trends = await reportsApi.getHealthTrends({
 *   startDate: '2024-09-01',
 *   endDate: '2025-06-01',
 *   schoolId: 'school-uuid-123'
 * });
 * console.log(`Total health visits: ${trends.summary.totalVisits}`);
 * console.log(`Top diagnosis: ${trends.topDiagnoses[0].code}`);
 * ```
 *
 * @example Create custom report
 * ```typescript
 * const customReport = await reportsApi.generateCustomReport({
 *   name: 'Monthly Medication Compliance',
 *   dataSource: 'MEDICATION_ADMINISTRATION',
 *   fields: ['studentName', 'medicationName', 'complianceRate'],
 *   filters: { schoolId: 'school-123', month: 'JANUARY' },
 *   groupBy: ['medicationName'],
 *   chartType: 'BAR'
 * });
 * console.log(`Report generated: ${customReport.id}`);
 * ```
 *
 * @example Schedule automated report
 * ```typescript
 * const scheduled = await reportsApi.scheduleReport({
 *   templateId: 'template-uuid-456',
 *   frequency: 'WEEKLY',
 *   dayOfWeek: 'FRIDAY',
 *   recipients: ['principal@school.edu', 'nurse@school.edu'],
 *   format: 'PDF'
 * });
 * console.log(`Report scheduled with ID: ${scheduled.id}`);
 * ```
 *
 * @example Export report to Excel
 * ```typescript
 * const blob = await reportsApi.exportReport({
 *   reportId: 'report-uuid-789',
 *   format: 'XLSX'
 * });
 * // Download blob as Excel file
 * ```
 *
 * @see {@link dashboardApi} for real-time dashboard metrics
 * @see {@link complianceApi} for compliance-specific reports
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import type {
  ApiResponse,
  DateRangeFilter,
  ReportData,
  HealthTrendsReport,
  MedicationUsageReport,
  IncidentStatisticsReport,
  AttendanceCorrelationReport,
  ComplianceReport,
  DashboardMetrics,
  DashboardData,
  PerformanceMetric,
  ReportType,
  ReportFormat,
  CustomReportRequest,
  ExportRequest,
  ReportTemplate,
  ScheduledReport,
  ReportHistory,
  ReportFilters,
  HealthTrendData,
  MedicationUsageData,
  IncidentStatistics,
  AttendanceCorrelationData,
  PerformanceMetrics
} from '../../types';

// Re-export types from unified types for backward compatibility
export type {
  ReportFilters,
  HealthTrendData,
  MedicationUsageData,
  IncidentStatistics,
  AttendanceCorrelationData,
  PerformanceMetrics,
  DashboardData
} from '../../types';

export interface ReportsApi {
  // Health Trend Analysis
  getHealthTrends(filters?: DateRangeFilter): Promise<HealthTrendsReport>;
  getHealthTrendsByCategory(category: string, filters?: DateRangeFilter): Promise<{ trends: HealthTrendData }>;

  // Medication Usage & Compliance
  getMedicationUsage(filters?: DateRangeFilter): Promise<MedicationUsageReport>;
  getMedicationCompliance(medicationId?: string, filters?: DateRangeFilter): Promise<{ compliance: any }>;
  getMedicationEffectiveness(filters?: DateRangeFilter): Promise<{ effectiveness: any }>;

  // Incident Statistics
  getIncidentStatistics(filters?: DateRangeFilter): Promise<IncidentStatisticsReport>;
  getIncidentTrends(filters?: DateRangeFilter): Promise<{ trends: any[] }>;
  getIncidentsByLocation(filters?: DateRangeFilter): Promise<{ incidents: any[] }>;

  // Attendance Correlation
  getAttendanceCorrelation(filters?: DateRangeFilter): Promise<AttendanceCorrelationReport>;
  getAbsenteeismPatterns(filters?: DateRangeFilter): Promise<{ patterns: any[] }>;

  // Performance Metrics
  getPerformanceMetrics(metricType?: string, filters?: DateRangeFilter): Promise<PerformanceMetric[]>;
  getNursePerformance(nurseId?: string, filters?: DateRangeFilter): Promise<{ performance: any }>;
  getSystemUsageMetrics(filters?: DateRangeFilter): Promise<{ usage: any }>;

  // Real-time Dashboard
  getDashboard(): Promise<DashboardMetrics>;
  getDashboardWidgets(widgetIds?: string[]): Promise<{ widgets: any[] }>;
  updateDashboardLayout(layout: any): Promise<{ layout: any }>;

  // Compliance Reports
  getComplianceReport(filters?: DateRangeFilter): Promise<ComplianceReport>;
  getComplianceHistory(category?: string, filters?: DateRangeFilter): Promise<{ history: any[] }>;
  generateComplianceAudit(filters?: DateRangeFilter): Promise<{ audit: any }>;

  // Custom Report Builder
  getReportTemplates(category?: string): Promise<{ templates: ReportTemplate[] }>;
  generateCustomReport(request: CustomReportRequest): Promise<ReportData>;
  saveReportTemplate(template: Partial<ReportTemplate>): Promise<{ template: ReportTemplate }>;
  getScheduledReports(): Promise<{ reports: ScheduledReport[] }>;
  scheduleReport(request: ScheduledReport): Promise<{ scheduled: ScheduledReport }>;

  // Export & Sharing
  exportReport(request: ExportRequest): Promise<Blob>;
  shareReport(reportId: string, data: { recipients: string[]; message?: string }): Promise<{ shared: boolean }>;
  getReportHistory(filters?: { userId?: string; reportType?: string }): Promise<{ history: ReportHistory[] }>;

  // Analytics
  getUsageAnalytics(filters?: DateRangeFilter): Promise<{ analytics: any }>;
  getReportPopularity(): Promise<{ popularity: any[] }>;
  getPerformanceInsights(filters?: DateRangeFilter): Promise<{ insights: any[] }>;
}

class ReportsApiImpl implements ReportsApi {
  constructor(private readonly client: ApiClient) {}

  // Health Trend Analysis
  async getHealthTrends(filters: DateRangeFilter = {}): Promise<HealthTrendsReport> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<HealthTrendsReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/health-trends?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getHealthTrendsByCategory(category: string, filters: DateRangeFilter = {}): Promise<{ trends: HealthTrendData }> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<{ trends: HealthTrendData }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/health-trends/${category}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Medication Usage & Compliance
  async getMedicationUsage(filters: DateRangeFilter = {}): Promise<MedicationUsageReport> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<MedicationUsageReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/medication-usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getMedicationCompliance(medicationId?: string, filters: DateRangeFilter = {}): Promise<{ compliance: any }> {
    const params = buildUrlParams({ medicationId, ...filters });
    const response = await this.client.get<ApiResponse<({ compliance: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/medication-compliance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getMedicationEffectiveness(filters: ReportFilters = {}): Promise<{ effectiveness: any }> {
    const params = buildUrlParams(filters);
    const response = await this.client.get<ApiResponse<({ effectiveness: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/medication-effectiveness?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Incident Statistics
  async getIncidentStatistics(filters: DateRangeFilter = {}): Promise<IncidentStatisticsReport> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<IncidentStatisticsReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incident-statistics?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getIncidentTrends(filters: DateRangeFilter = {}): Promise<{ trends: any[] }> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<{ trends: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incident-trends?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getIncidentsByLocation(filters: DateRangeFilter = {}): Promise<{ incidents: any[] }> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<{ incidents: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incidents-by-location?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Attendance Correlation
  async getAttendanceCorrelation(filters: DateRangeFilter = {}): Promise<AttendanceCorrelationReport> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<AttendanceCorrelationReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/attendance-correlation?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getAbsenteeismPatterns(filters: DateRangeFilter = {}): Promise<{ patterns: any[] }> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<({ patterns: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/absenteeism-patterns?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Performance Metrics
  async getPerformanceMetrics(metricType?: string, filters: DateRangeFilter = {}): Promise<PerformanceMetric[]> {
    const params = buildUrlParams({ metricType, ...filters });
    const response = await this.client.get<ApiResponse<PerformanceMetric[]> | undefined>(
      `${API_ENDPOINTS.REPORTS}/performance-metrics?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getNursePerformance(nurseId?: string, filters: DateRangeFilter = {}): Promise<{ performance: any }> {
    const params = buildUrlParams({ nurseId, ...filters });
    const response = await this.client.get<ApiResponse<{ performance: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/nurse-performance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getSystemUsageMetrics(filters: DateRangeFilter = {}): Promise<{ usage: any }> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<{ usage: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/system-usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Real-time Dashboard
  async getDashboard(): Promise<DashboardMetrics> {
    const response = await this.client.get<ApiResponse<DashboardMetrics> | undefined>(
      `${API_ENDPOINTS.REPORTS}/dashboard`
    );
    return extractApiData(response as any);
  }

  async getDashboardWidgets(widgetIds?: string[]): Promise<{ widgets: any[] }> {
    const params = widgetIds ? buildUrlParams({ widgets: widgetIds.join(',') }) : '';
    const response = await this.client.get<ApiResponse<({ widgets: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/dashboard/widgets?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async updateDashboardLayout(layout: any): Promise<{ layout: any }> {
    const response = await this.client.put<ApiResponse<({ layout: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/dashboard/layout`,
      { layout }
    );
    return extractApiData(response as any);
  }

  // Compliance Reports
  async getComplianceReport(filters: DateRangeFilter = {}): Promise<ComplianceReport> {
    const params = buildUrlParams(filters as Record<string, unknown>);
    const response = await this.client.get<ApiResponse<ComplianceReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getComplianceHistory(category?: string, filters: DateRangeFilter = {}): Promise<{ history: any[] }> {
    const params = buildUrlParams({ category, ...filters });
    const response = await this.client.get<ApiResponse<{ history: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance/history?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async generateComplianceAudit(filters: DateRangeFilter = {}): Promise<{ audit: any }> {
    const response = await this.client.post<ApiResponse<{ audit: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance/audit`,
      filters
    );
    return extractApiData(response as any);
  }

  // Custom Report Builder
  async getReportTemplates(category?: string): Promise<{ templates: ReportTemplate[] }> {
    const params = category ? buildUrlParams({ category }) : '';
    const response = await this.client.get<ApiResponse<{ templates: ReportTemplate[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/templates?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async generateCustomReport(request: CustomReportRequest): Promise<ReportData> {
    const response = await this.client.post<ApiResponse<ReportData> | undefined>(
      `${API_ENDPOINTS.REPORTS}/custom`,
      request
    );
    return extractApiData(response as any);
  }

  async saveReportTemplate(template: Partial<ReportTemplate>): Promise<{ template: ReportTemplate }> {
    const response = await this.client.post<ApiResponse<{ template: ReportTemplate }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/templates`,
      template
    );
    return extractApiData(response as any);
  }

  async getScheduledReports(): Promise<{ reports: ScheduledReport[] }> {
    const response = await this.client.get<ApiResponse<{ reports: ScheduledReport[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/scheduled`
    );
    return extractApiData(response as any);
  }

  async scheduleReport(request: ScheduledReport): Promise<{ scheduled: ScheduledReport }> {
    const response = await this.client.post<ApiResponse<{ scheduled: ScheduledReport }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/schedule`,
      request
    );
    return extractApiData(response as any);
  }

  // Export & Sharing
  async exportReport(request: ExportRequest): Promise<Blob> {
    const response = await this.client.post(
      `${API_ENDPOINTS.REPORTS}/export`,
      request,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async shareReport(reportId: string, data: { recipients: string[]; message?: string }): Promise<{ shared: boolean }> {
    const response = await this.client.post<ApiResponse<({ shared: boolean })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/${reportId}/share`,
      data
    );
    return extractApiData(response as any);
  }

  async getReportHistory(filters: { userId?: string; reportType?: string } = {}): Promise<{ history: ReportHistory[] }> {
    const params = buildUrlParams(filters);
    const response = await this.client.get<ApiResponse<{ history: ReportHistory[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/history?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Analytics
  async getUsageAnalytics(filters: DateRangeFilter = {}): Promise<{ analytics: any }> {
    const params = buildUrlParams(filters);
    const response = await this.client.get<ApiResponse<{ analytics: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getReportPopularity(): Promise<{ popularity: any[] }> {
    const response = await this.client.get<ApiResponse<{ popularity: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/popularity`
    );
    return extractApiData(response as any);
  }

  async getPerformanceInsights(filters: DateRangeFilter = {}): Promise<{ insights: any[] }> {
    const params = buildUrlParams(filters);
    const response = await this.client.get<ApiResponse<{ insights: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/insights?${params.toString()}`
    );
    return extractApiData(response as any);
  }
}

// Factory function for creating ReportsApi instances
export function createReportsApi(client: ApiClient): ReportsApi {
  return new ReportsApiImpl(client);
}

/**
 * Singleton instance of ReportsApi
 * Pre-configured with the default apiClient
 */
export const reportsApi = createReportsApi(apiClient);
