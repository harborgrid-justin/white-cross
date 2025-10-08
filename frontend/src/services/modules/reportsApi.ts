import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import type { ApiResponse, DateRangeFilter, ReportData } from '../types';

export interface ReportFilters extends DateRangeFilter {
  reportType?: string;
  category?: string;
  studentId?: string;
  nurseId?: string;
  metricType?: string;
}

export interface CustomReportRequest {
  reportType: string;
  title?: string;
  description?: string;
  filters?: any;
  parameters?: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time?: string;
    recipients?: string[];
  };
}

export interface ExportRequest extends CustomReportRequest {
  format: 'csv' | 'pdf' | 'excel' | 'json';
  includeCharts?: boolean;
  template?: string;
}

export interface HealthTrendData {
  category: string;
  data: Array<{
    date: string;
    value: number;
    studentCount: number;
    incidents: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  insights: string[];
}

export interface MedicationUsageData {
  medication: {
    id: string;
    name: string;
    category: string;
  };
  usage: {
    administered: number;
    missed: number;
    refused: number;
    totalScheduled: number;
    complianceRate: number;
  };
  trends: Array<{
    date: string;
    administered: number;
    missed: number;
  }>;
}

export interface IncidentStatistics {
  totalIncidents: number;
  incidentsByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  incidentsBySeverity: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    count: number;
    type: string;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

export interface AttendanceCorrelationData {
  correlations: Array<{
    healthCondition: string;
    absenceRate: number;
    correlation: number;
    significance: string;
  }>;
  patterns: Array<{
    pattern: string;
    affectedStudents: number;
    description: string;
  }>;
}

export interface PerformanceMetrics {
  nurseWorkload: Array<{
    nurseId: string;
    nurseName: string;
    appointmentsCompleted: number;
    medicationsAdministered: number;
    incidentsHandled: number;
    efficiency: number;
  }>;
  systemUsage: {
    activeUsers: number;
    documentsCreated: number;
    recordsUpdated: number;
    averageResponseTime: number;
  };
  complianceScores: Array<{
    category: string;
    score: number;
    target: number;
    status: 'good' | 'warning' | 'critical';
  }>;
}

export interface DashboardData {
  summary: {
    totalStudents: number;
    activeNurses: number;
    todayAppointments: number;
    pendingTasks: number;
    criticalAlerts: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    priority: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    type: string;
    scheduledAt: string;
    participants: string[];
  }>;
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>;
}

export interface ComplianceReport {
  overallScore: number;
  categories: Array<{
    name: string;
    score: number;
    requirements: Array<{
      requirement: string;
      status: 'compliant' | 'non-compliant' | 'partial';
      details: string;
      dueDate?: string;
    }>;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    recommendation: string;
    estimatedEffort: string;
  }>;
}

export interface ReportsApi {
  // Health Trend Analysis
  getHealthTrends(filters?: ReportFilters): Promise<{ trends: HealthTrendData[] }>;
  getHealthTrendsByCategory(category: string, filters?: DateRangeFilter): Promise<{ trends: HealthTrendData }>;

  // Medication Usage & Compliance
  getMedicationUsage(filters?: ReportFilters): Promise<{ usage: MedicationUsageData[] }>;
  getMedicationCompliance(medicationId?: string, filters?: DateRangeFilter): Promise<{ compliance: any }>;
  getMedicationEffectiveness(filters?: ReportFilters): Promise<{ effectiveness: any }>;

  // Incident Statistics
  getIncidentStatistics(filters?: ReportFilters): Promise<{ statistics: IncidentStatistics }>;
  getIncidentTrends(filters?: ReportFilters): Promise<{ trends: any[] }>;
  getIncidentsByLocation(filters?: ReportFilters): Promise<{ incidents: any[] }>;

  // Attendance Correlation
  getAttendanceCorrelation(filters?: ReportFilters): Promise<{ correlation: AttendanceCorrelationData }>;
  getAbsenteeismPatterns(filters?: DateRangeFilter): Promise<{ patterns: any[] }>;

  // Performance Metrics
  getPerformanceMetrics(filters?: ReportFilters): Promise<{ metrics: PerformanceMetrics }>;
  getNursePerformance(nurseId?: string, filters?: DateRangeFilter): Promise<{ performance: any }>;
  getSystemUsageMetrics(filters?: DateRangeFilter): Promise<{ usage: any }>;

  // Real-time Dashboard
  getDashboard(): Promise<DashboardData>;
  getDashboardWidgets(widgetIds?: string[]): Promise<{ widgets: any[] }>;
  updateDashboardLayout(layout: any): Promise<{ layout: any }>;

  // Compliance Reports
  getComplianceReport(filters?: ReportFilters): Promise<ComplianceReport>;
  getComplianceHistory(category?: string, filters?: DateRangeFilter): Promise<{ history: any[] }>;
  generateComplianceAudit(filters?: ReportFilters): Promise<{ audit: any }>;

  // Custom Report Builder
  getReportTemplates(category?: string): Promise<{ templates: any[] }>;
  generateCustomReport(request: CustomReportRequest): Promise<{ report: ReportData }>;
  saveReportTemplate(template: any): Promise<{ template: any }>;
  getScheduledReports(): Promise<{ reports: any[] }>;
  scheduleReport(request: CustomReportRequest & { schedule: any }): Promise<{ scheduled: any }>;

  // Export & Sharing
  exportReport(request: ExportRequest): Promise<Blob>;
  shareReport(reportId: string, data: { recipients: string[]; message?: string }): Promise<{ shared: boolean }>;
  getReportHistory(filters?: { userId?: string; reportType?: string }): Promise<{ history: any[] }>;

  // Analytics
  getUsageAnalytics(filters?: DateRangeFilter): Promise<{ analytics: any }>;
  getReportPopularity(): Promise<{ popularity: any[] }>;
  getPerformanceInsights(filters?: ReportFilters): Promise<{ insights: any[] }>;
}

class ReportsApiImpl implements ReportsApi {
  // Health Trend Analysis
  async getHealthTrends(filters: ReportFilters = {}): Promise<{ trends: HealthTrendData[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ trends: HealthTrendData[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/health-trends?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getHealthTrendsByCategory(category: string, filters: DateRangeFilter = {}): Promise<{ trends: HealthTrendData }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ trends: HealthTrendData })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/health-trends/${category}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Medication Usage & Compliance
  async getMedicationUsage(filters: ReportFilters = {}): Promise<{ usage: MedicationUsageData[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ usage: MedicationUsageData[] })> | undefined>(
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
  async getIncidentStatistics(filters: ReportFilters = {}): Promise<{ statistics: IncidentStatistics }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ statistics: IncidentStatistics })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incident-statistics?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getIncidentTrends(filters: ReportFilters = {}): Promise<{ trends: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ trends: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incident-trends?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getIncidentsByLocation(filters: ReportFilters = {}): Promise<{ incidents: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ incidents: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/incidents-by-location?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Attendance Correlation
  async getAttendanceCorrelation(filters: ReportFilters = {}): Promise<{ correlation: AttendanceCorrelationData }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ correlation: AttendanceCorrelationData })> | undefined>(
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
  async getPerformanceMetrics(filters: ReportFilters = {}): Promise<{ metrics: PerformanceMetrics }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ metrics: PerformanceMetrics })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/performance-metrics?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getNursePerformance(nurseId?: string, filters: DateRangeFilter = {}): Promise<{ performance: any }> {
    const params = buildUrlParams({ nurseId, ...filters });
    const response = await apiInstance.get<ApiResponse<({ performance: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/nurse-performance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getSystemUsageMetrics(filters: DateRangeFilter = {}): Promise<{ usage: any }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ usage: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/system-usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Real-time Dashboard
  async getDashboard(): Promise<DashboardData> {
    const response = await apiInstance.get<ApiResponse<(DashboardData)> | undefined>(
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
  async getComplianceReport(filters: ReportFilters = {}): Promise<ComplianceReport> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<(ComplianceReport)> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getComplianceHistory(category?: string, filters: DateRangeFilter = {}): Promise<{ history: any[] }> {
    const params = buildUrlParams({ category, ...filters });
    const response = await apiInstance.get<ApiResponse<({ history: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance/history?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async generateComplianceAudit(filters: ReportFilters = {}): Promise<{ audit: any }> {
    const response = await apiInstance.post<ApiResponse<({ audit: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/compliance/audit`,
      filters
    );
    return extractApiData(response as any);
  }

  // Custom Report Builder
  async getReportTemplates(category?: string): Promise<{ templates: any[] }> {
    const params = category ? buildUrlParams({ category }) : '';
    const response = await apiInstance.get<ApiResponse<({ templates: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/templates?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async generateCustomReport(request: CustomReportRequest): Promise<{ report: ReportData }> {
    const response = await apiInstance.post<ApiResponse<({ report: ReportData })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/custom`,
      request
    );
    return extractApiData(response as any);
  }

  async saveReportTemplate(template: any): Promise<{ template: any }> {
    const response = await apiInstance.post<ApiResponse<({ template: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/templates`,
      template
    );
    return extractApiData(response as any);
  }

  async getScheduledReports(): Promise<{ reports: any[] }> {
    const response = await apiInstance.get<ApiResponse<({ reports: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/scheduled`
    );
    return extractApiData(response as any);
  }

  async scheduleReport(request: CustomReportRequest & { schedule: any }): Promise<{ scheduled: any }> {
    const response = await apiInstance.post<ApiResponse<({ scheduled: any })> | undefined>(
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

  async getReportHistory(filters: { userId?: string; reportType?: string } = {}): Promise<{ history: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ history: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/history?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Analytics
  async getUsageAnalytics(filters: DateRangeFilter = {}): Promise<{ analytics: any }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ analytics: any })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/usage?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getReportPopularity(): Promise<{ popularity: any[] }> {
    const response = await apiInstance.get<ApiResponse<({ popularity: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/popularity`
    );
    return extractApiData(response as any);
  }

  async getPerformanceInsights(filters: ReportFilters = {}): Promise<{ insights: any[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ insights: any[] })> | undefined>(
      `${API_ENDPOINTS.REPORTS}/analytics/insights?${params.toString()}`
    );
    return extractApiData(response as any);
  }
}

export const reportsApi = new ReportsApiImpl();
