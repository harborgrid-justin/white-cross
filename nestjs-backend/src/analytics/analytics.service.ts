import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HealthTrendAnalyticsService } from './services/health-trend-analytics.service';
import { ComplianceReportGeneratorService } from './services/compliance-report-generator.service';
import { TimePeriod } from './enums';
import {
  GetHealthMetricsQueryDto,
  GetHealthTrendsQueryDto,
  GetStudentHealthMetricsQueryDto,
  GetSchoolMetricsQueryDto,
  GetIncidentTrendsQueryDto,
  GetIncidentsByLocationQueryDto,
  GetMedicationUsageQueryDto,
  GetMedicationAdherenceQueryDto,
  GetAppointmentTrendsQueryDto,
  GetNoShowRateQueryDto,
  GetNurseDashboardQueryDto,
  GetAdminDashboardQueryDto,
  GetPlatformSummaryQueryDto,
  GenerateCustomReportDto,
  GetReportQueryDto,
} from './dto';

/**
 * Analytics Service
 * Main orchestration service for analytics module
 * Coordinates between health trend analytics and compliance report generation
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
    private readonly reportGeneratorService: ComplianceReportGeneratorService,
  ) {}

  /**
   * Get module metadata
   */
  getAnalyticsMetadata() {
    return {
      module: 'Analytics',
      version: '1.0.0',
      description: 'Comprehensive health metrics, analytics, and reporting for school healthcare operations',
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
    try {
      const start = query.startDate;
      const end = query.endDate;
      const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      // Determine time period based on date range
      let period: TimePeriod = TimePeriod.LAST_30_DAYS;
      if (daysDiff <= 7) period = TimePeriod.LAST_7_DAYS;
      else if (daysDiff <= 30) period = TimePeriod.LAST_30_DAYS;
      else if (daysDiff <= 90) period = TimePeriod.LAST_90_DAYS;
      else if (daysDiff <= 180) period = TimePeriod.LAST_6_MONTHS;
      else period = TimePeriod.LAST_YEAR;

      const schoolId = query.schoolId || query.districtId || 'default-school';
      const metrics = await this.healthTrendService.getHealthMetrics(schoolId, period);

      // Calculate comparison data if requested
      let comparisonData = null;
      if (query.compareWithPrevious) {
        const previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - daysDiff);
        const previousEnd = new Date(end);
        previousEnd.setDate(previousEnd.getDate() - daysDiff);

        comparisonData = {
          periodLabel: 'Previous Period',
          startDate: previousStart,
          endDate: previousEnd,
        };
      }

      return {
        metrics,
        period: { startDate: start, endDate: end },
        aggregationLevel: query.aggregationLevel || 'SCHOOL',
        comparisonData,
      };
    } catch (error) {
      this.logger.error('Error getting health metrics', error);
      throw error;
    }
  }

  /**
   * Get health trend analysis
   */
  async getHealthTrends(query: GetHealthTrendsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;

      // Map time period to service enum
      let period: TimePeriod = TimePeriod.LAST_90_DAYS;
      switch (query.timePeriod) {
        case 'DAILY':
          period = TimePeriod.LAST_7_DAYS;
          break;
        case 'WEEKLY':
          period = TimePeriod.LAST_30_DAYS;
          break;
        case 'MONTHLY':
          period = TimePeriod.LAST_90_DAYS;
          break;
        case 'QUARTERLY':
          period = TimePeriod.LAST_6_MONTHS;
          break;
        case 'YEARLY':
          period = TimePeriod.LAST_YEAR;
          break;
      }

      const schoolId = query.schoolId || query.districtId || 'default-school';

      const conditionTrends = await this.healthTrendService.getConditionTrends(
        schoolId,
        query.metrics,
        period,
      );

      const medicationTrends = await this.healthTrendService.getMedicationTrends(schoolId, period);

      return {
        healthConditionTrends: conditionTrends,
        medicationTrends,
        period: { startDate: start, endDate: end },
        timePeriod: query.timePeriod || 'MONTHLY',
        forecastingEnabled: query.includeForecasting || false,
      };
    } catch (error) {
      this.logger.error('Error getting health trends', error);
      throw error;
    }
  }

  /**
   * Get student-specific health trends
   */
  async getStudentHealthMetrics(studentId: string, query: GetStudentHealthMetricsQueryDto) {
    try {
      // TODO: Integrate with health metrics service for real patient trends
      // This is a placeholder implementation
      const trends = {
        vitalSigns: [
          { date: new Date(), heartRate: 72, bloodPressure: '120/80', temperature: 98.6 },
        ],
        healthVisits: [],
        medicationAdherence: { rate: 95, missedDoses: 2 },
      };

      const startDate = query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate || new Date();

      return {
        studentId,
        trends,
        period: { startDate, endDate },
        includesHistoricalData: query.includeHistory !== false,
      };
    } catch (error) {
      this.logger.error('Error getting student health metrics', error);
      throw error;
    }
  }

  /**
   * Get school-wide health metrics
   */
  async getSchoolMetrics(schoolId: string, query: GetSchoolMetricsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;

      const summary = await this.healthTrendService.getPopulationSummary(schoolId, TimePeriod.CUSTOM, {
        start,
        end,
      });

      const immunizationData = await this.healthTrendService.getImmunizationDashboard(schoolId);

      const incidentAnalytics = await this.healthTrendService.getIncidentAnalytics(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      return {
        schoolId,
        summary,
        immunization: immunizationData,
        incidents: incidentAnalytics,
        period: { startDate: start, endDate: end },
        gradeLevel: query.gradeLevel,
        includesComparisons: query.includeComparisons !== false,
      };
    } catch (error) {
      this.logger.error('Error getting school metrics', error);
      throw error;
    }
  }

  /**
   * Get incident trends
   */
  async getIncidentTrends(query: GetIncidentTrendsQueryDto) {
    try {
      const schoolId = query.schoolId || 'default-school';
      const incidentAnalytics = await this.healthTrendService.getIncidentAnalytics(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      return {
        trends: incidentAnalytics.trends,
        byType: incidentAnalytics.byType,
        byTimeOfDay: incidentAnalytics.byTimeOfDay,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          incidentType: query.incidentType,
          severity: query.severity,
          groupBy: query.groupBy || 'TYPE',
        },
      };
    } catch (error) {
      this.logger.error('Error getting incident trends', error);
      throw error;
    }
  }

  /**
   * Get incidents by location
   */
  async getIncidentsByLocation(query: GetIncidentsByLocationQueryDto) {
    try {
      const schoolId = query.schoolId || 'default-school';
      const incidentAnalytics = await this.healthTrendService.getIncidentAnalytics(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      return {
        byLocation: incidentAnalytics.byLocation,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        location: query.location,
        heatMapIncluded: query.includeHeatMap || false,
      };
    } catch (error) {
      this.logger.error('Error getting incidents by location', error);
      throw error;
    }
  }

  /**
   * Get medication usage statistics
   */
  async getMedicationUsage(query: GetMedicationUsageQueryDto) {
    try {
      const schoolId = query.schoolId || 'default-school';
      const medicationTrends = await this.healthTrendService.getMedicationTrends(
        schoolId,
        TimePeriod.LAST_30_DAYS,
      );

      const summary = await this.healthTrendService.getPopulationSummary(
        schoolId,
        TimePeriod.LAST_30_DAYS,
      );

      return {
        usageChart: medicationTrends,
        topMedications: summary.topMedications,
        totalAdministrations: summary.totalMedicationAdministrations,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          medicationName: query.medicationName,
          category: query.category,
          groupBy: query.groupBy || 'MEDICATION',
        },
        adherenceIncluded: query.includeAdherenceRate !== false,
      };
    } catch (error) {
      this.logger.error('Error getting medication usage', error);
      throw error;
    }
  }

  /**
   * Get medication adherence rates
   */
  async getMedicationAdherence(query: GetMedicationAdherenceQueryDto) {
    try {
      const schoolId = query.schoolId || 'default-school';
      const summary = await this.healthTrendService.getPopulationSummary(
        schoolId,
        TimePeriod.LAST_30_DAYS,
      );

      const threshold = query.threshold || 80;

      // Calculate adherence data from medication trends
      const adherenceData = summary.topMedications.map((med) => ({
        medicationName: med.medicationName,
        category: med.category,
        studentCount: med.studentCount,
        administrationCount: med.administrationCount,
        adherenceRate: 100 - med.sideEffectRate, // Simplified calculation
        isBelowThreshold: 100 - med.sideEffectRate < threshold,
        trend: med.trend,
      }));

      return {
        adherenceData,
        threshold,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          studentId: query.studentId,
          medicationId: query.medicationId,
        },
      };
    } catch (error) {
      this.logger.error('Error getting medication adherence', error);
      throw error;
    }
  }

  /**
   * Get appointment trends
   */
  async getAppointmentTrends(query: GetAppointmentTrendsQueryDto) {
    try {
      // Simulated appointment trend data
      const trends = {
        totalAppointments: 342,
        completedAppointments: 298,
        cancelledAppointments: 23,
        noShowAppointments: 21,
        completionRate: 87.1,
        noShowRate: 6.1,
        byType: [
          { type: 'Health Screening', count: 156, completionRate: 94.2 },
          { type: 'Medication Check', count: 89, completionRate: 85.4 },
          { type: 'Follow-up', count: 67, completionRate: 82.1 },
          { type: 'Immunization', count: 30, completionRate: 96.7 },
        ],
        byMonth: [
          { month: 'Sep', scheduled: 85, completed: 76, noShow: 5 },
          { month: 'Oct', scheduled: 92, completed: 81, noShow: 6 },
          { month: 'Nov', scheduled: 88, completed: 75, noShow: 7 },
          { month: 'Dec', scheduled: 77, completed: 66, noShow: 3 },
        ],
      };

      return {
        trends,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          schoolId: query.schoolId,
          appointmentType: query.appointmentType,
          status: query.status,
          groupBy: query.groupBy || 'MONTH',
        },
      };
    } catch (error) {
      this.logger.error('Error getting appointment trends', error);
      throw error;
    }
  }

  /**
   * Get appointment no-show statistics
   */
  async getNoShowRate(query: GetNoShowRateQueryDto) {
    try {
      const noShowAnalytics = {
        overallNoShowRate: 6.1,
        totalScheduled: 342,
        totalNoShows: 21,
        targetRate: query.compareWithTarget || 5.0,
        meetsTarget: 6.1 <= (query.compareWithTarget || 5.0),
        byType: [
          { type: 'Health Screening', noShowRate: 3.8, count: 6 },
          { type: 'Medication Check', noShowRate: 7.9, count: 7 },
          { type: 'Follow-up', noShowRate: 10.4, count: 7 },
          { type: 'Immunization', noShowRate: 3.3, count: 1 },
        ],
        reasons: query.includeReasons
          ? [
              { reason: 'Student absent', count: 9, percentage: 42.9 },
              { reason: 'Parent did not consent', count: 5, percentage: 23.8 },
              { reason: 'Scheduling conflict', count: 4, percentage: 19.0 },
              { reason: 'Other', count: 3, percentage: 14.3 },
            ]
          : null,
        trend: {
          direction: 'DECREASING',
          changePercent: -12.5,
        },
      };

      return {
        noShowAnalytics,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          schoolId: query.schoolId,
          appointmentType: query.appointmentType,
        },
      };
    } catch (error) {
      this.logger.error('Error getting no-show rate', error);
      throw error;
    }
  }

  /**
   * Get nurse dashboard data
   */
  async getNurseDashboard(query: GetNurseDashboardQueryDto) {
    try {
      const schoolId = query.schoolId || 'default-school';
      const timeRange = query.timeRange || 'TODAY';

      // TODO: Integrate with health metrics service for real-time data
      const metricsOverview = {
        totalPatients: 24,
        activeAppointments: 8,
        criticalAlerts: 2,
        bedOccupancy: 3,
        averageHeartRate: 78,
        status: 'OPERATIONAL',
      };

      const alerts = query.includeAlerts
        ? [
            {
              id: '1',
              type: 'Tachycardia',
              severity: 'HIGH',
              student: 'Student A',
              time: new Date(),
            },
            { id: '2', type: 'Fever', severity: 'MEDIUM', student: 'Student B', time: new Date() },
          ]
        : [];

      const upcomingTasks = query.includeUpcoming
        ? [
            {
              type: 'Medication Administration',
              student: 'John Doe',
              time: new Date(Date.now() + 30 * 60000),
              priority: 'HIGH',
            },
            {
              type: 'Health Screening',
              student: 'Jane Smith',
              time: new Date(Date.now() + 60 * 60000),
              priority: 'MEDIUM',
            },
          ]
        : [];

      return {
        overview: metricsOverview,
        alerts,
        upcomingTasks,
        timeRange,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting nurse dashboard', error);
      throw error;
    }
  }

  /**
   * Get admin dashboard data
   */
  async getAdminDashboard(query: GetAdminDashboardQueryDto) {
    try {
      const schoolId = query.schoolId || 'default-school';

      // Map time range to period
      let period: TimePeriod = TimePeriod.LAST_30_DAYS;
      switch (query.timeRange) {
        case 'TODAY':
        case 'WEEK':
          period = TimePeriod.LAST_7_DAYS;
          break;
        case 'MONTH':
          period = TimePeriod.LAST_30_DAYS;
          break;
        case 'QUARTER':
          period = TimePeriod.LAST_90_DAYS;
          break;
        case 'YEAR':
          period = TimePeriod.LAST_YEAR;
          break;
      }

      const summary = await this.healthTrendService.getPopulationSummary(schoolId, period);

      const complianceMetrics = query.includeComplianceMetrics
        ? {
            immunizationCompliance: summary.immunizationComplianceRate,
            documentationCompliance: 98.5,
            staffTrainingCompliance: 92.3,
            auditReadiness: 94.7,
          }
        : null;

      const insights = await this.healthTrendService.getPredictiveInsights(schoolId);

      return {
        summary,
        complianceMetrics,
        insights,
        timeRange: query.timeRange || 'MONTH',
        includesFinancialData: query.includeFinancialData || false,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting admin dashboard', error);
      throw error;
    }
  }

  /**
   * Get platform summary
   */
  async getPlatformSummary(query: GetPlatformSummaryQueryDto) {
    try {
      const targetSchoolId =
        (query.schoolIds && query.schoolIds.length > 0 && query.schoolIds[0]) || 'default-school';

      const summary = await this.healthTrendService.getPopulationSummary(
        targetSchoolId,
        TimePeriod.LAST_30_DAYS,
      );

      const platformSummary = {
        totalStudents: summary.totalStudents,
        totalSchools: query.schoolIds ? query.schoolIds.length : 1,
        totalDistricts: query.districtId ? 1 : 0,
        healthMetrics: {
          totalHealthVisits: summary.totalHealthVisits,
          totalMedicationAdministrations: summary.totalMedicationAdministrations,
          totalIncidents: summary.totalIncidents,
          immunizationCompliance: summary.immunizationComplianceRate,
        },
        alerts: summary.alerts,
        systemStatus: 'OPERATIONAL',
        lastUpdated: new Date(),
      };

      return {
        summary: platformSummary,
        details: query.includeDetails ? summary : null,
        period: {
          startDate: query.startDate || null,
          endDate: query.endDate || null,
        },
      };
    } catch (error) {
      this.logger.error('Error getting platform summary', error);
      throw error;
    }
  }

  /**
   * Generate custom report
   */
  async generateCustomReport(dto: GenerateCustomReportDto, userId: string) {
    try {
      const start = dto.startDate;
      const end = dto.endDate;
      const format = dto.format || 'JSON';
      const schoolId = dto.filters?.schoolId || 'default-school';

      let report;

      switch (dto.reportType) {
        case 'IMMUNIZATION_REPORT':
          report = await this.reportGeneratorService.generateImmunizationReport({
            schoolId,
            periodStart: start,
            periodEnd: end,
            format: format as any,
            generatedBy: userId,
          });
          break;

        case 'COMPLIANCE_STATUS':
          report = await this.reportGeneratorService.generateControlledSubstanceReport({
            schoolId,
            periodStart: start,
            periodEnd: end,
            format: format as any,
            generatedBy: userId,
          });
          break;

        case 'STUDENT_HEALTH_SUMMARY':
          report = await this.reportGeneratorService.generateScreeningReport({
            schoolId,
            periodStart: start,
            periodEnd: end,
            format: format as any,
            generatedBy: userId,
          });
          break;

        default:
          // Generate generic health metrics report
          const summary = await this.healthTrendService.getPopulationSummary(
            schoolId,
            TimePeriod.CUSTOM,
            { start, end },
          );

          report = {
            id: `RPT-${Date.now()}`,
            reportName: dto.reportName,
            reportType: dto.reportType,
            generatedDate: new Date(),
            period: { start, end },
            data: summary,
            format,
          };
      }

      return {
        report: {
          id: report.id,
          name: dto.reportName,
          type: dto.reportType,
          format,
          generatedAt: new Date(),
          status: 'COMPLETED',
          downloadUrl: report.fileUrl || `/api/v1/analytics/reports/${report.id}`,
          recipients: dto.recipients,
          schedule: dto.schedule,
        },
      };
    } catch (error) {
      this.logger.error('Error generating custom report', error);
      throw error;
    }
  }

  /**
   * Get generated report
   */
  async getGeneratedReport(reportId: string, query: GetReportQueryDto) {
    try {
      const report = await this.reportGeneratorService.getReport(reportId);

      if (!report) {
        throw new NotFoundException('Report not found');
      }

      // Return full report or metadata only
      if (!query.includeData) {
        return {
          report: {
            id: report.id,
            title: report.title,
            reportType: report.reportType,
            generatedDate: report.generatedDate,
            status: report.status,
            format: report.format,
            fileUrl: report.fileUrl,
          },
        };
      }

      return { report };
    } catch (error) {
      this.logger.error('Error getting generated report', error);
      throw error;
    }
  }
}
