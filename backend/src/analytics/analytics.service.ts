import { Injectable } from '@nestjs/common';
import {
  AnalyticsDashboardService,
  AnalyticsReportService,
  AnalyticsHealthService,
  AnalyticsIncidentOrchestratorService,
  AnalyticsMedicationOrchestratorService,
  AnalyticsAppointmentOrchestratorService,
} from './services';
import { BaseService } from '@/common/base';
import { AnalyticsGenerateCustomReportDto } from './dto/custom-reports.dto';
import { GetAdminDashboardQueryDto } from './dto/dashboard.dto';
import { GetAppointmentTrendsQueryDto } from './dto/appointment-analytics.dto';
import { GetHealthMetricsQueryDto } from './dto/health-metrics.dto';
import { GetHealthTrendsQueryDto } from './dto/analytics-query.dto';
import { GetIncidentsByLocationQueryDto } from './dto/incident-analytics.dto';
import { GetIncidentTrendsQueryDto } from './dto/incident-analytics.dto';
import { GetMedicationAdherenceQueryDto } from './dto/medication-analytics.dto';
import { GetMedicationUsageQueryDto } from './dto/medication-analytics.dto';
import { GetNoShowRateQueryDto } from './dto/appointment-analytics.dto';
import { GetNurseDashboardQueryDto } from './dto/dashboard.dto';
import { GetPlatformSummaryQueryDto } from './dto/dashboard.dto';
import { GetReportQueryDto } from './dto/report-generation.dto';
import { GetSchoolMetricsQueryDto } from './dto/health-metrics.dto';
import { GetStudentHealthMetricsQueryDto } from './dto/health-metrics.dto';

/**
 * Analytics Service
 * Main orchestration service for analytics module
 * Delegates to specialized services for different analytics domains
 */
@Injectable()
export class AnalyticsService extends BaseService {
  constructor(
    private readonly dashboardService: AnalyticsDashboardService,
    private readonly reportService: AnalyticsReportService,
    private readonly healthService: AnalyticsHealthService,
    private readonly incidentService: AnalyticsIncidentOrchestratorService,
    private readonly medicationService: AnalyticsMedicationOrchestratorService,
    private readonly appointmentService: AnalyticsAppointmentOrchestratorService,
  ) {
    super('AnalyticsService');
  }

  /**
   * Get module metadata
   */
  getAnalyticsMetadata() {
    return {
      module: 'Analytics',
      version: '1.0.0',
      description:
        'Comprehensive health metrics, analytics, and reporting for school healthcare operations',
      endpoints: 17,
      categories: [
        {
          name: 'Health Metrics & Trends',
          endpoints: 4,
          description: 'Aggregated health data and trend analysis',
        },
        {
          name: 'Incident Analytics',
          endpoints: 2,
          description: 'Safety incident patterns and location-based analysis',
        },
        {
          name: 'Medication Analytics',
          endpoints: 2,
          description: 'Medication usage and adherence tracking',
        },
        {
          name: 'Appointment Analytics',
          endpoints: 2,
          description: 'Appointment trends and no-show rate analysis',
        },
        {
          name: 'Dashboards',
          endpoints: 3,
          description: 'Real-time operational dashboards for nurses and admins',
        },
        {
          name: 'Custom Reports',
          endpoints: 2,
          description: 'Flexible custom report generation and retrieval',
        },
      ],
      capabilities: [
        'Health metrics aggregation',
        'Time-series trend analysis',
        'Incident pattern identification',
        'Medication usage tracking',
        'Adherence monitoring',
        'Appointment analytics',
        'Real-time dashboards',
        'Custom report generation',
        'Compliance reporting',
        'Predictive insights',
      ],
      authentication: 'JWT required for all endpoints',
      compliance: 'HIPAA-compliant with PHI protection',
    };
  }

  /**
   * Get aggregated health metrics
   */
  async getHealthMetrics(query: GetHealthMetricsQueryDto) {
    return this.healthService.getHealthMetrics(query);
  }

  /**
   * Get health trend analysis
   */
  async getHealthTrends(query: GetHealthTrendsQueryDto) {
    return this.healthService.getHealthTrends(query);
  }

  /**
   * Get student-specific health trends
   * Integrates with health records, medication logs, and appointments for comprehensive metrics
   */
  async getStudentHealthMetrics(
    studentId: string,
    query: GetStudentHealthMetricsQueryDto,
  ) {
    return this.healthService.getStudentHealthMetrics(studentId, query);
  }

  /**
   * Get school-wide health metrics
   */
  async getSchoolMetrics(schoolId: string, query: GetSchoolMetricsQueryDto) {
    return this.healthService.getSchoolMetrics(schoolId, query);
  }

  /**
   * Get incident trends
   */
  async getIncidentTrends(query: GetIncidentTrendsQueryDto) {
    return this.incidentService.getIncidentTrends(query);
  }

  /**
   * Get incidents by location
   */
  async getIncidentsByLocation(query: GetIncidentsByLocationQueryDto) {
    return this.incidentService.getIncidentsByLocation(query);
  }

  /**
   * Get medication usage statistics
   */
  async getMedicationUsage(query: GetMedicationUsageQueryDto) {
    return this.medicationService.getMedicationUsage(query);
  }

  /**
   * Get medication adherence rates
   */
  async getMedicationAdherence(query: GetMedicationAdherenceQueryDto) {
    return this.medicationService.getMedicationAdherence(query);
  }

  /**
   * Get appointment trends
   */
  async getAppointmentTrends(query: GetAppointmentTrendsQueryDto) {
    return this.appointmentService.getAppointmentTrends(query);
  }

  /**
   * Get appointment no-show statistics
   */
  async getNoShowRate(query: GetNoShowRateQueryDto) {
    return this.appointmentService.getNoShowRate(query);
  }

  /**
   * Get nurse dashboard data
   * Integrates with real-time health data sources for operational metrics
   */
  async getNurseDashboard(query: GetNurseDashboardQueryDto) {
    return this.dashboardService.getNurseDashboard(query);
  }

  /**
   * Get admin dashboard data
   */
  async getAdminDashboard(query: GetAdminDashboardQueryDto) {
    return this.dashboardService.getAdminDashboard(query);
  }

  /**
   * Get platform summary
   */
  async getPlatformSummary(query: GetPlatformSummaryQueryDto) {
    return this.dashboardService.getPlatformSummary(query);
  }

  /**
   * Generate custom report
   */
  async generateCustomReport(
    dto: AnalyticsGenerateCustomReportDto,
    userId: string,
  ) {
    return this.reportService.generateCustomReport(dto, userId);
  }

  /**
   * Get generated report
   */
  async getGeneratedReport(reportId: string, query: GetReportQueryDto) {
    return this.reportService.getGeneratedReport(reportId, query);
  }
}
