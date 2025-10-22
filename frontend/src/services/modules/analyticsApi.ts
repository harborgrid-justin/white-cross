/**
 * Analytics API Module
 * Provides frontend access to analytics and reporting endpoints
 */

import { apiInstance } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams, buildUrlParams } from '../utils/apiUtils';

/**
 * Analytics API interfaces
 */
export interface HealthMetrics {
  id: string;
  metricType: string;
  value: number;
  studentId?: string;
  schoolId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HealthTrends {
  period: string;
  data: Array<{
    date: string;
    value: number;
    category: string;
  }>;
}

export interface IncidentTrends {
  period: string;
  trends: Array<{
    date: string;
    count: number;
    severity: string;
  }>;
}

export interface IncidentLocationData {
  location: string;
  count: number;
  percentage: number;
}

export interface MedicationUsage {
  medicationId: string;
  medicationName: string;
  usageCount: number;
  period: string;
}

export interface MedicationAdherence {
  studentId: string;
  adherenceRate: number;
  missedDoses: number;
  totalDoses: number;
}

export interface AppointmentTrends {
  period: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface NoShowRate {
  rate: number;
  total: number;
  noShowCount: number;
  period: string;
}

export interface DashboardData {
  nurseId?: string;
  schoolId?: string;
  metrics: Record<string, any>;
  recentActivity: Array<any>;
  alerts: Array<any>;
}

export interface AnalyticsSummary {
  healthMetrics: any;
  incidents: any;
  medications: any;
  appointments: any;
  compliance: any;
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  reportType: string;
  parameters: Record<string, any>;
  createdAt: string;
  createdBy: string;
}

export interface CustomReportRequest {
  name: string;
  description?: string;
  reportType: string;
  parameters: Record<string, any>;
  format?: 'PDF' | 'EXCEL' | 'CSV';
}

/**
 * Analytics API Service
 * Handles all analytics and reporting related API calls
 */
export class AnalyticsApi {
  /**
   * Get health metrics
   */
  async getHealthMetrics(params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
  }): Promise<HealthMetrics[]> {
    const response = await apiInstance.get<ApiResponse<HealthMetrics[]>>(
      '/api/v1/analytics/health-metrics',
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get health trends
   */
  async getHealthTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  }): Promise<HealthTrends> {
    const response = await apiInstance.get<ApiResponse<HealthTrends>>(
      '/api/v1/analytics/health-trends',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get health metrics for specific student
   */
  async getStudentHealthMetrics(studentId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<HealthMetrics[]> {
    const response = await apiInstance.get<ApiResponse<HealthMetrics[]>>(
      `/api/v1/analytics/health-metrics/student/${studentId}`,
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get health metrics for specific school
   */
  async getSchoolHealthMetrics(schoolId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<HealthMetrics[]> {
    const response = await apiInstance.get<ApiResponse<HealthMetrics[]>>(
      `/api/v1/analytics/health-metrics/school/${schoolId}`,
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get incident trends
   */
  async getIncidentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  }): Promise<IncidentTrends> {
    const response = await apiInstance.get<ApiResponse<IncidentTrends>>(
      '/api/v1/analytics/incidents/trends',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get incidents by location
   */
  async getIncidentsByLocation(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<IncidentLocationData[]> {
    const response = await apiInstance.get<ApiResponse<IncidentLocationData[]>>(
      '/api/v1/analytics/incidents/by-location',
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get medication usage analytics
   */
  async getMedicationUsage(params?: {
    startDate?: string;
    endDate?: string;
    medicationId?: string;
  }): Promise<MedicationUsage[]> {
    const response = await apiInstance.get<ApiResponse<MedicationUsage[]>>(
      '/api/v1/analytics/medications/usage',
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get medication adherence data
   */
  async getMedicationAdherence(params?: {
    startDate?: string;
    endDate?: string;
    studentId?: string;
  }): Promise<MedicationAdherence[]> {
    const response = await apiInstance.get<ApiResponse<MedicationAdherence[]>>(
      '/api/v1/analytics/medications/adherence',
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get appointment trends
   */
  async getAppointmentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  }): Promise<AppointmentTrends> {
    const response = await apiInstance.get<ApiResponse<AppointmentTrends>>(
      '/api/v1/analytics/appointments/trends',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get appointment no-show rate
   */
  async getNoShowRate(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<NoShowRate> {
    const response = await apiInstance.get<ApiResponse<NoShowRate>>(
      '/api/v1/analytics/appointments/no-show-rate',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get nurse dashboard data
   */
  async getNurseDashboard(nurseId?: string): Promise<DashboardData> {
    const response = await apiInstance.get<ApiResponse<DashboardData>>(
      '/api/v1/analytics/dashboard/nurse',
      { params: { nurseId } }
    );
    return response.data.data!;
  }

  /**
   * Get admin dashboard data
   */
  async getAdminDashboard(schoolId?: string): Promise<DashboardData> {
    const response = await apiInstance.get<ApiResponse<DashboardData>>(
      '/api/v1/analytics/dashboard/admin',
      { params: { schoolId } }
    );
    return response.data.data!;
  }

  /**
   * Get analytics summary
   */
  async getSummary(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AnalyticsSummary> {
    const response = await apiInstance.get<ApiResponse<AnalyticsSummary>>(
      '/api/v1/analytics/summary',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Create custom report
   */
  async createCustomReport(report: CustomReportRequest): Promise<CustomReport> {
    const response = await apiInstance.post<ApiResponse<CustomReport>>(
      '/api/v1/analytics/reports/custom',
      report
    );
    return response.data.data!;
  }

  /**
   * Get custom report by ID
   */
  async getCustomReport(reportId: string): Promise<CustomReport> {
    const response = await apiInstance.get<ApiResponse<CustomReport>>(
      `/api/v1/analytics/reports/${reportId}`
    );
    return response.data.data!;
  }
}

// Export singleton instance
export const analyticsApi = new AnalyticsApi();
