/**
 * WF-COMP-291 | reportsApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils, ../utils/apiUtils
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
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
  ReportHistory
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
  // Health Trend Analysis
  async getHealthTrends(filters: DateRangeFilter = {}): Promise<HealthTrendsReport> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<HealthTrendsReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/health-trends?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getHealthTrendsByCategory(category: string, filters: DateRangeFilter = {}): Promise<{ trends: HealthTrendData }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ trends: HealthTrendData }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/health-trends/${category}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Medication Usage & Compliance
  async getMedicationUsage(filters: DateRangeFilter = {}): Promise<MedicationUsageReport> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<MedicationUsageReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/medication-usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getMedicationCompliance(medicationId?: string, filters: DateRangeFilter = {}): Promise<{ compliance: any }> {
    const params = buildUrlParams({ medicationId, ...filters });
    const response = await apiInstance.get<ApiResponse<({ compliance: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/medication-compliance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getMedicationEffectiveness(filters: ReportFilters = {}): Promise<{ effectiveness: any }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ effectiveness: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/medication-effectiveness?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Incident Statistics
  async getIncidentStatistics(filters: DateRangeFilter = {}): Promise<IncidentStatisticsReport> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<IncidentStatisticsReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incident-statistics?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getIncidentTrends(filters: DateRangeFilter = {}): Promise<{ trends: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ trends: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incident-trends?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getIncidentsByLocation(filters: DateRangeFilter = {}): Promise<{ incidents: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ incidents: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incidents-by-location?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Attendance Correlation
  async getAttendanceCorrelation(filters: DateRangeFilter = {}): Promise<AttendanceCorrelationReport> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<AttendanceCorrelationReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/attendance-correlation?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getAbsenteeismPatterns(filters: DateRangeFilter = {}): Promise<{ patterns: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ patterns: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/absenteeism-patterns?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Performance Metrics
  async getPerformanceMetrics(metricType?: string, filters: DateRangeFilter = {}): Promise<PerformanceMetric[]> {
    const params = buildUrlParams({ metricType, ...filters });
    const response = await apiInstance.get<ApiResponse<PerformanceMetric[]> | undefined>(
      `${API_ENDPOINTS.REPORTS}/performance-metrics?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getNursePerformance(nurseId?: string, filters: DateRangeFilter = {}): Promise<{ performance: any }> {
    const params = buildUrlParams({ nurseId, ...filters });
    const response = await apiInstance.get<ApiResponse<{ performance: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/nurse-performance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getSystemUsageMetrics(filters: DateRangeFilter = {}): Promise<{ usage: any }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ usage: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/system-usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Real-time Dashboard
  async getDashboard(): Promise<DashboardMetrics> {
    const response = await apiInstance.get<ApiResponse<DashboardMetrics> | undefined>(
      `${API_ENDPOINTS.REPORTS}/dashboard`
    );
    return extractApiData(response as any);
  }

  async getDashboardWidgets(widgetIds?: string[]): Promise<{ widgets: any[] }> {
    const params = widgetIds ? buildUrlParams({ widgets: widgetIds.join(',') }) : '';
    const response = await apiInstance.get<ApiResponse<({ widgets: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/dashboard/widgets?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async updateDashboardLayout(layout: any): Promise<{ layout: any }> {
    const response = await apiInstance.put<ApiResponse<({ layout: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/dashboard/layout`,
      { layout }
    );
    return extractApiData(response as any);
  }

  // Compliance Reports
  async getComplianceReport(filters: DateRangeFilter = {}): Promise<ComplianceReport> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<ComplianceReport> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getComplianceHistory(category?: string, filters: DateRangeFilter = {}): Promise<{ history: any[] }> {
    const params = buildUrlParams({ category, ...filters });
    const response = await apiInstance.get<ApiResponse<{ history: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance/history?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async generateComplianceAudit(filters: DateRangeFilter = {}): Promise<{ audit: any }> {
    const response = await apiInstance.post<ApiResponse<{ audit: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance/audit`,
      filters
    );
    return extractApiData(response as any);
  }

  // Custom Report Builder
  async getReportTemplates(category?: string): Promise<{ templates: ReportTemplate[] }> {
    const params = category ? buildUrlParams({ category }) : '';
    const response = await apiInstance.get<ApiResponse<{ templates: ReportTemplate[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/templates?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async generateCustomReport(request: CustomReportRequest): Promise<ReportData> {
    const response = await apiInstance.post<ApiResponse<ReportData> | undefined>(
      `${API_ENDPOINTS.REPORTS}/custom`,
      request
    );
    return extractApiData(response as any);
  }

  async saveReportTemplate(template: Partial<ReportTemplate>): Promise<{ template: ReportTemplate }> {
    const response = await apiInstance.post<ApiResponse<{ template: ReportTemplate }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/templates`,
      template
    );
    return extractApiData(response as any);
  }

  async getScheduledReports(): Promise<{ reports: ScheduledReport[] }> {
    const response = await apiInstance.get<ApiResponse<{ reports: ScheduledReport[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/scheduled`
    );
    return extractApiData(response as any);
  }

  async scheduleReport(request: ScheduledReport): Promise<{ scheduled: ScheduledReport }> {
    const response = await apiInstance.post<ApiResponse<{ scheduled: ScheduledReport }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/schedule`,
      request
    );
    return extractApiData(response as any);
  }

  // Export & Sharing
  async exportReport(request: ExportRequest): Promise<Blob> {
    const response = await apiInstance.post(
      `${API_ENDPOINTS.REPORTS}/export`,
      request,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async shareReport(reportId: string, data: { recipients: string[]; message?: string }): Promise<{ shared: boolean }> {
    const response = await apiInstance.post<ApiResponse<({ shared: boolean })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/${reportId}/share`,
      data
    );
    return extractApiData(response as any);
  }

  async getReportHistory(filters: { userId?: string; reportType?: string } = {}): Promise<{ history: ReportHistory[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ history: ReportHistory[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/history?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Analytics
  async getUsageAnalytics(filters: DateRangeFilter = {}): Promise<{ analytics: any }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ analytics: any }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getReportPopularity(): Promise<{ popularity: any[] }> {
    const response = await apiInstance.get<ApiResponse<{ popularity: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/popularity`
    );
    return extractApiData(response as any);
  }

  async getPerformanceInsights(filters: DateRangeFilter = {}): Promise<{ insights: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ insights: any[] }> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/insights?${params.toString()}`
    );
    return extractApiData(response as any);
  }
}

export const reportsApi = new ReportsApiImpl();
